import { ArrowLeft } from "lucide-react";
import { useMemo, useState } from "react";
import type { Language } from "../content/knowledge";

type SpatialAudioLabProps = {
  language: Language;
  onBack: () => void;
};

type SpatialMode = "cues" | "binaural" | "object" | "headTracking";

const modeLabels: Record<SpatialMode, Record<Language, string>> = {
  cues: { zh: "定位线索", en: "Localization cues" },
  binaural: { zh: "双耳渲染", en: "Binaural rendering" },
  object: { zh: "对象 / 声道", en: "Object / channel" },
  headTracking: { zh: "头部追踪", en: "Head tracking" }
};

const modeDescriptions: Record<SpatialMode, Record<Language, string>> = {
  cues: {
    zh: "观察声源角度、距离和房间反射如何影响 ITD、ILD、HRTF 频谱线索和距离感。",
    en: "Observe how source angle, distance, and room reflections affect ITD, ILD, HRTF spectral cues, and distance."
  },
  binaural: {
    zh: "耳机空间音频通常把每个虚拟声源与对应方向的 HRIR 卷积，得到左耳和右耳 PCM。",
    en: "Headphone spatial audio usually convolves each virtual source with direction-specific HRIRs to produce left-ear and right-ear PCM."
  },
  object: {
    zh: "对象音频保存声音和空间元数据，播放端根据耳机、5.1/7.1、Atmos 或车载扬声器重新渲染。",
    en: "Object audio stores sound plus spatial metadata, then the playback renderer maps it to headphones, 5.1/7.1, Atmos, or in-car speakers."
  },
  headTracking: {
    zh: "头部追踪让声源固定在外部世界；转头时渲染器要低延迟更新相对耳朵的方向。",
    en: "Head tracking keeps sources fixed in the outside world; as the head turns, the renderer must update the source direction relative to the ears with low latency."
  }
};

const pipelineSteps: Record<SpatialMode, Array<{ title: Record<Language, string>; detail: Record<Language, string> }>> = {
  cues: [
    { title: { zh: "声源位置", en: "Source position" }, detail: { zh: "角度、距离、移动", en: "angle, distance, motion" } },
    { title: { zh: "双耳线索", en: "Binaural cues" }, detail: { zh: "ITD / ILD", en: "ITD / ILD" } },
    { title: { zh: "耳廓滤波", en: "Pinna filtering" }, detail: { zh: "HRTF 峰谷", en: "HRTF peaks/notches" } },
    { title: { zh: "距离与房间", en: "Distance / room" }, detail: { zh: "反射、混响、衰减", en: "reflections, reverb, loss" } }
  ],
  binaural: [
    { title: { zh: "对象 / 声源", en: "Object / source" }, detail: { zh: "mono 或多路素材", en: "mono or multi-channel asset" } },
    { title: { zh: "方位参数", en: "Spatial parameters" }, detail: { zh: "方位角、距离、仰角", en: "azimuth, distance, elevation" } },
    { title: { zh: "HRIR 卷积", en: "HRIR convolution" }, detail: { zh: "生成左右耳信号", en: "left/right ear signals" } },
    { title: { zh: "双耳 PCM", en: "Binaural PCM" }, detail: { zh: "适合耳机播放", en: "for headphone playback" } }
  ],
  object: [
    { title: { zh: "声道床", en: "Channel bed" }, detail: { zh: "5.1 / 7.1 基础混音", en: "5.1 / 7.1 base mix" } },
    { title: { zh: "音频对象", en: "Audio objects" }, detail: { zh: "声音 + 空间元数据", en: "audio + spatial metadata" } },
    { title: { zh: "渲染器", en: "Renderer" }, detail: { zh: "适配播放设备", en: "adapt to playback device" } },
    { title: { zh: "耳机 / 扬声器", en: "Headphones / speakers" }, detail: { zh: "双耳或多扬声器输出", en: "binaural or speaker output" } }
  ],
  headTracking: [
    { title: { zh: "IMU 姿态", en: "IMU pose" }, detail: { zh: "头部 yaw / pitch / roll", en: "head yaw / pitch / roll" } },
    { title: { zh: "坐标变换", en: "Coordinate update" }, detail: { zh: "世界方向 -> 耳朵方向", en: "world direction -> ear direction" } },
    { title: { zh: "重选 HRTF", en: "HRTF update" }, detail: { zh: "低延迟更新滤波器", en: "low-latency filter update" } },
    { title: { zh: "外部化声像", en: "Externalized image" }, detail: { zh: "声源不跟头转", en: "source does not rotate with head" } }
  ]
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function normalizeAngle(angle: number) {
  const normalized = ((((angle + 180) % 360) + 360) % 360) - 180;

  return normalized === -180 ? 180 : normalized;
}

function polarPoint(cx: number, cy: number, radius: number, angleDegrees: number) {
  const radians = (angleDegrees * Math.PI) / 180;

  return {
    x: cx + Math.sin(radians) * radius,
    y: cy - Math.cos(radians) * radius
  };
}

function rotateOffset(cx: number, cy: number, offsetX: number, offsetY: number, angleDegrees: number) {
  const radians = (angleDegrees * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);

  return {
    x: cx + offsetX * cos - offsetY * sin,
    y: cy + offsetX * sin + offsetY * cos
  };
}

function formatSignedDegrees(value: number) {
  return `${value > 0 ? "+" : ""}${Math.round(value)}°`;
}

function formatSignedDb(value: number) {
  const rounded = Math.round(value * 10) / 10;

  return `${rounded > 0 ? "+" : ""}${rounded.toFixed(1)} dB`;
}

const reflectionPaths = [
  { controlA: { x: 92, y: 86 }, controlB: { x: 98, y: 414 }, earOffset: -34, threshold: 0.08 },
  { controlA: { x: 632, y: 88 }, controlB: { x: 636, y: 412 }, earOffset: 34, threshold: 0.08 },
  { controlA: { x: 205, y: 54 }, controlB: { x: 506, y: 74 }, earOffset: -12, threshold: 0.32 },
  { controlA: { x: 514, y: 456 }, controlB: { x: 214, y: 432 }, earOffset: 12, threshold: 0.52 },
  { controlA: { x: 72, y: 250 }, controlB: { x: 214, y: 92 }, earOffset: -46, threshold: 0.72 },
  { controlA: { x: 648, y: 250 }, controlB: { x: 506, y: 408 }, earOffset: 46, threshold: 0.72 }
];

function SpatialScene({
  distance,
  headYaw,
  language,
  mode,
  reflection,
  sourceAngle
}: {
  distance: number;
  headYaw: number;
  language: Language;
  mode: SpatialMode;
  reflection: number;
  sourceAngle: number;
}) {
  const center = { x: 360, y: 250 };
  const sourceRadius = 72 + distance * 32;
  const source = polarPoint(center.x, center.y, sourceRadius, sourceAngle);
  const headForward = polarPoint(center.x, center.y, 88, headYaw);
  const relativeAngle = normalizeAngle(sourceAngle - headYaw);
  const relativeSource = polarPoint(center.x, center.y, 138, relativeAngle);
  const leftEar = rotateOffset(center.x, center.y, -52, 0, headYaw);
  const rightEar = rotateOffset(center.x, center.y, 52, 0, headYaw);
  const lateral = Math.sin((relativeAngle * Math.PI) / 180);
  const leadingEarPoint = Math.abs(lateral) < 0.08 ? center : lateral < 0 ? leftEar : rightEar;
  const laggingEarPoint = Math.abs(lateral) < 0.08 ? center : lateral < 0 ? rightEar : leftEar;
  const reflectionAmount = reflection / 100;
  const showHeadTracking = mode === "headTracking";

  return (
    <svg
      aria-label={language === "zh" ? "空间音频声源定位图" : "Spatial audio source localization diagram"}
      className="spatial-audio-scene"
      role="img"
      viewBox="0 0 720 500"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <marker id="spatialArrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
          <path d="M0 0 8 4 0 8Z" fill="#dcece8" />
        </marker>
      </defs>
      <rect className="lab-diagram-bg" height="500" rx="16" width="720" />
      <text className="spatial-chart-title" x="34" y="42">
        {language === "zh" ? "俯视图：世界声源、头部朝向和耳朵相对方向" : "Top view: world source, head direction, and ear-relative direction"}
      </text>
      <circle className="spatial-room-ring" cx={center.x} cy={center.y} r="190" />
      <circle className="spatial-room-ring faint" cx={center.x} cy={center.y} r="118" />
      <line className="spatial-axis" x1={center.x} x2={center.x} y1="72" y2="432" />
      <line className="spatial-axis" x1="180" x2="540" y1={center.y} y2={center.y} />
      <text className="spatial-axis-label" x="348" y="86">{language === "zh" ? "前" : "front"}</text>
      <text className="spatial-axis-label" x="344" y="438">{language === "zh" ? "后" : "rear"}</text>
      <text className="spatial-axis-label" x="186" y="242">{language === "zh" ? "左" : "left"}</text>
      <text className="spatial-axis-label" x="508" y="242">{language === "zh" ? "右" : "right"}</text>

      {reflectionPaths.map((path, index) => {
        const pathStrength = clamp((reflectionAmount - path.threshold) / 0.28, 0, 1);

        if (pathStrength <= 0) {
          return null;
        }

        return (
          <path
            className={index < 2 ? "spatial-reflection-path early" : "spatial-reflection-path late"}
            d={`M ${source.x.toFixed(1)} ${source.y.toFixed(1)} C ${path.controlA.x} ${path.controlA.y} ${path.controlB.x} ${path.controlB.y} ${(path.earOffset < 0 ? leftEar.x : rightEar.x).toFixed(1)} ${(path.earOffset < 0 ? leftEar.y : rightEar.y).toFixed(1)}`}
            key={`${path.controlA.x}-${path.controlB.y}`}
            opacity={0.12 + pathStrength * 0.55}
          />
        );
      })}
      <line
        className="spatial-direct-path"
        x1={source.x}
        x2={leadingEarPoint.x}
        y1={source.y}
        y2={leadingEarPoint.y}
      />
      {Math.abs(lateral) >= 0.08 ? (
        <line
          className="spatial-secondary-ear-path"
          x1={source.x}
          x2={laggingEarPoint.x}
          y1={source.y}
          y2={laggingEarPoint.y}
        />
      ) : null}
      <line
        className="spatial-head-forward"
        markerEnd="url(#spatialArrow)"
        x1={center.x}
        x2={headForward.x}
        y1={center.y}
        y2={headForward.y}
      />
      {showHeadTracking ? (
        <path
          className="spatial-world-lock"
          d={`M ${source.x.toFixed(1)} ${source.y.toFixed(1)} C ${source.x + 42} ${source.y - 36} ${center.x + 126} ${center.y - 110} ${headForward.x} ${headForward.y}`}
        />
      ) : null}

      <g className="spatial-head" transform={`rotate(${headYaw} ${center.x} ${center.y})`}>
        <ellipse cx={center.x} cy={center.y} rx="44" ry="58" />
        <circle className="spatial-ear left" cx={center.x - 52} cy={center.y} r="10" />
        <circle className="spatial-ear right" cx={center.x + 52} cy={center.y} r="10" />
        <text className="spatial-ear-label" x={center.x - 72} y={center.y + 28}>{language === "zh" ? "左耳" : "L"}</text>
        <text className="spatial-ear-label" x={center.x + 58} y={center.y + 28}>{language === "zh" ? "右耳" : "R"}</text>
      </g>

      <g className="spatial-source">
        <circle cx={source.x} cy={source.y} r="14" />
        <text x={source.x + 20} y={source.y + 5}>{language === "zh" ? "声源" : "source"}</text>
      </g>
      <g className="spatial-relative-cue">
        <line x1={center.x} x2={relativeSource.x} y1={center.y} y2={relativeSource.y} />
        <circle cx={relativeSource.x} cy={relativeSource.y} r="6" />
        <text className="spatial-cue-chip" x="34" y="418">
          {language === "zh"
            ? `当前双耳线索：${Math.abs(lateral) < 0.08 ? "左右耳接近同时" : lateral < 0 ? "左耳先到 / 左侧更强" : "右耳先到 / 右侧更强"}`
            : `Current binaural cue: ${Math.abs(lateral) < 0.08 ? "ears nearly aligned" : lateral < 0 ? "left ear first / stronger left" : "right ear first / stronger right"}`}
        </text>
        <text x="34" y="462">
          {language === "zh"
            ? `相对耳朵方向：${formatSignedDegrees(relativeAngle)}；世界声源角度：${formatSignedDegrees(sourceAngle)}；头部朝向：${formatSignedDegrees(headYaw)}`
            : `Ear-relative direction: ${formatSignedDegrees(relativeAngle)}; world source: ${formatSignedDegrees(sourceAngle)}; head yaw: ${formatSignedDegrees(headYaw)}`}
        </text>
      </g>
    </svg>
  );
}

function RoomReflectionResponse({
  distance,
  language,
  reflection
}: {
  distance: number;
  language: Language;
  reflection: number;
}) {
  const reflectionAmount = reflection / 100;
  const directX = 74 + distance * 8;
  const directPeak = clamp(114 - distance * 8, 48, 108);
  const earlyPeaks = [
    { x: directX + 64, height: 20 + reflectionAmount * 58 },
    { x: directX + 112, height: 15 + reflectionAmount * 46 },
    { x: directX + 168, height: 10 + reflectionAmount * 34 }
  ];
  const tailStart = directX + 190;
  const tailLength = 92 + reflectionAmount * 210;
  const tailHeight = 18 + reflectionAmount * 58;
  const tailPath = `M ${tailStart.toFixed(1)} 214 C ${(tailStart + tailLength * 0.22).toFixed(1)} ${(214 - tailHeight).toFixed(1)} ${(tailStart + tailLength * 0.58).toFixed(1)} ${(206 - tailHeight * 0.48).toFixed(1)} ${(tailStart + tailLength).toFixed(1)} 214`;
  const tailFillPath = `${tailPath} L ${(tailStart + tailLength).toFixed(1)} 214 L ${tailStart.toFixed(1)} 214 Z`;
  const tailTexture = Array.from({ length: 18 }, (_, index) => {
    const ratio = index / 17;
    const x = tailStart + ratio * tailLength;
    const decay = Math.exp(-ratio * (1.35 + (1 - reflectionAmount) * 1.4));
    const height = tailHeight * decay * (0.28 + ((index * 7) % 5) * 0.08);

    return { height, x };
  });

  return (
    <svg
      aria-label={language === "zh" ? "房间反射时间响应图" : "Room reflection time response"}
      className="spatial-reflection-response"
      role="img"
      viewBox="0 0 720 260"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect className="lab-diagram-bg" height="260" rx="16" width="720" />
      <text className="spatial-chart-title" x="34" y="38">
        {language === "zh" ? "时间响应：直达声、早期反射和混响尾巴" : "Time response: direct sound, early reflections, and reverb tail"}
      </text>
      <line className="spatial-response-axis" x1="54" x2="666" y1="214" y2="214" />
      <line className="spatial-response-axis" x1="54" x2="54" y1="62" y2="214" />
      <text className="spatial-axis-label" x="600" y="238">{language === "zh" ? "时间 ms" : "time ms"}</text>
      <text className="spatial-axis-label" x="28" y="72">{language === "zh" ? "能量" : "energy"}</text>
      <path className="spatial-reverb-tail-fill" d={tailFillPath} opacity={0.1 + reflectionAmount * 0.28} />
      <path className="spatial-reverb-tail-line" d={tailPath} opacity={0.35 + reflectionAmount * 0.52} />
      {tailTexture.map((item) => (
        <line
          className="spatial-tail-texture"
          key={item.x.toFixed(1)}
          opacity={0.12 + reflectionAmount * 0.36}
          x1={item.x}
          x2={item.x}
          y1={214}
          y2={214 - item.height}
        />
      ))}
      <path className="spatial-direct-impulse" d={`M ${(directX - 3).toFixed(1)} 214 L ${directX.toFixed(1)} ${directPeak.toFixed(1)} L ${(directX + 3).toFixed(1)} 214`} />
      <text className="spatial-response-label" x={directX - 32} y={directPeak - 12}>
        {language === "zh" ? "直达声" : "direct"}
      </text>
      {earlyPeaks.map((peak, index) => (
        <g key={peak.x}>
          <path
            className="spatial-early-impulse"
            d={`M ${(peak.x - 2.6).toFixed(1)} 214 L ${peak.x.toFixed(1)} ${(214 - peak.height).toFixed(1)} L ${(peak.x + 2.6).toFixed(1)} 214`}
            opacity={0.22 + reflectionAmount * 0.68}
          />
          {index === 0 ? (
            <text className="spatial-response-label" x={peak.x - 44} y={196 - peak.height}>
              {language === "zh" ? "早期反射" : "early reflections"}
            </text>
          ) : null}
        </g>
      ))}
      <text className="spatial-response-label" x={tailStart + 72} y={188 - tailHeight}>
        {language === "zh" ? "混响尾巴" : "reverb tail"}
      </text>
      <text className="spatial-response-note" x="34" y="246">
        {language === "zh"
          ? "这是简化脉冲响应：前面尖峰是直达声，随后几个窄峰是早期反射，连续衰减区域是后期混响能量。"
          : "This is a simplified impulse response: the first spike is direct sound, later narrow spikes are early reflections, and the continuous decay is late reverberant energy."}
      </text>
    </svg>
  );
}

function SpatialPipeline({ language, mode }: { language: Language; mode: SpatialMode }) {
  const steps = pipelineSteps[mode];

  return (
    <ol className="spatial-pipeline" aria-label={language === "zh" ? "空间音频渲染流程" : "Spatial audio rendering pipeline"}>
      {steps.map((step, index) => (
        <li key={step.title.en}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <strong>{step.title[language]}</strong>
          <p>{step.detail[language]}</p>
        </li>
      ))}
    </ol>
  );
}

export function SpatialAudioLab({ language, onBack }: SpatialAudioLabProps) {
  const [mode, setMode] = useState<SpatialMode>("cues");
  const [sourceAngle, setSourceAngle] = useState(-35);
  const [distance, setDistance] = useState(3);
  const [reflection, setReflection] = useState(42);
  const [headYaw, setHeadYaw] = useState(0);

  const metrics = useMemo(() => {
    const relativeAngle = normalizeAngle(sourceAngle - headYaw);
    const radians = (relativeAngle * Math.PI) / 180;
    const lateral = Math.sin(radians);
    const frontBack = Math.cos(radians);
    const itdMs = Math.abs(lateral) * 0.63;
    const ildDb = Math.abs(lateral) * 9.5;
    const hrtfNotch = Math.round(5200 + Math.abs(frontBack) * 1800 + Math.abs(lateral) * 1200);
    const distanceGain = -20 * Math.log10(distance);
    const directReverbRatio = clamp(14 - reflection * 0.18 - Math.max(0, distance - 1) * 1.45, -12, 16);
    const renderLatency = 8 + Math.round(reflection * 0.03) + (mode === "headTracking" ? 6 : mode === "binaural" ? 4 : 2);
    const leadingEar =
      Math.abs(lateral) < 0.08
        ? { zh: "双耳近似同时", en: "ears nearly aligned" }
        : lateral < 0
          ? { zh: "左耳先到", en: "left ear first" }
          : { zh: "右耳先到", en: "right ear first" };

    return { directReverbRatio, distanceGain, hrtfNotch, ildDb, itdMs, leadingEar, relativeAngle, renderLatency };
  }, [distance, headYaw, mode, reflection, sourceAngle]);

  return (
    <main className="spatial-audio-page">
      <section className="sound-lab-hero" aria-labelledby="spatial-audio-title">
        <button className="sound-lab-back" type="button" onClick={onBack}>
          <ArrowLeft size={18} aria-hidden="true" />
          {language === "zh" ? "返回知识库" : "Back to knowledge base"}
        </button>
        <div>
          <span className="section-kicker">{language === "zh" ? "传统 DSP 实验" : "Traditional DSP lab"}</span>
          <h1 id="spatial-audio-title">{language === "zh" ? "空间音频实验室" : "Spatial Audio Lab"}</h1>
          <p>
            {language === "zh"
              ? "用一个俯视声源图理解 ITD、ILD、HRTF、双耳渲染、对象音频和头部追踪如何共同形成空间感。"
              : "Use a top-down source diagram to understand how ITD, ILD, HRTF, binaural rendering, object audio, and head tracking create spatial perception."}
          </p>
        </div>
      </section>

      <section
        aria-label={language === "zh" ? "空间音频实验台" : "Spatial audio workbench"}
        className="spatial-audio-workbench"
      >
        <div className="waveform-tabs spatial-audio-tabs" role="group" aria-label={language === "zh" ? "空间音频模式" : "Spatial audio modes"}>
          {(Object.keys(modeLabels) as SpatialMode[]).map((item) => (
            <button className={mode === item ? "active" : ""} key={item} type="button" onClick={() => setMode(item)}>
              {modeLabels[item][language]}
            </button>
          ))}
        </div>

        <div className="spatial-audio-layout">
          <div className="spatial-audio-visuals">
            <SpatialScene
              distance={distance}
              headYaw={headYaw}
              language={language}
              mode={mode}
              reflection={reflection}
              sourceAngle={sourceAngle}
            />
            <RoomReflectionResponse distance={distance} language={language} reflection={reflection} />
            <SpatialPipeline language={language} mode={mode} />
          </div>

          <aside className="spatial-audio-panel">
            <div className="codec-mode-concepts-header">
              <span>{modeLabels[mode][language]}</span>
              <strong>{modeDescriptions[mode][language]}</strong>
            </div>
            <label className="sound-lab-control">
              <span>{language === "zh" ? `声源角度：${formatSignedDegrees(sourceAngle)}` : `Source angle: ${formatSignedDegrees(sourceAngle)}`}</span>
              <input aria-label={language === "zh" ? "声源角度" : "Source angle"} max="150" min="-150" step="5" type="range" value={sourceAngle} onChange={(event) => setSourceAngle(Number(event.target.value))} />
            </label>
            <label className="sound-lab-control">
              <span>{language === "zh" ? `距离：${distance.toFixed(1)} m` : `Distance: ${distance.toFixed(1)} m`}</span>
              <input aria-label={language === "zh" ? "距离" : "Distance"} max="8" min="1" step="0.5" type="range" value={distance} onChange={(event) => setDistance(Number(event.target.value))} />
            </label>
            <label className="sound-lab-control">
              <span>{language === "zh" ? `房间反射：${reflection}%` : `Room reflections: ${reflection}%`}</span>
              <input aria-label={language === "zh" ? "房间反射" : "Room reflections"} max="100" min="0" step="5" type="range" value={reflection} onChange={(event) => setReflection(Number(event.target.value))} />
            </label>
            <label className="sound-lab-control">
              <span>{language === "zh" ? `头部朝向：${formatSignedDegrees(headYaw)}` : `Head yaw: ${formatSignedDegrees(headYaw)}`}</span>
              <input aria-label={language === "zh" ? "头部朝向" : "Head yaw"} max="90" min="-90" step="5" type="range" value={headYaw} onChange={(event) => setHeadYaw(Number(event.target.value))} />
            </label>
            <div className="spatial-audio-metrics">
              <strong>{language === "zh" ? `相对角度：${formatSignedDegrees(metrics.relativeAngle)}` : `Relative angle: ${formatSignedDegrees(metrics.relativeAngle)}`}</strong>
              <strong>{language === "zh" ? `ITD：${metrics.itdMs.toFixed(2)} ms，${metrics.leadingEar.zh}` : `ITD: ${metrics.itdMs.toFixed(2)} ms, ${metrics.leadingEar.en}`}</strong>
              <strong>{language === "zh" ? `ILD：约 ${metrics.ildDb.toFixed(1)} dB` : `ILD: about ${metrics.ildDb.toFixed(1)} dB`}</strong>
              <strong>{language === "zh" ? `HRTF 谱线索：约 ${metrics.hrtfNotch} Hz` : `HRTF cue: about ${metrics.hrtfNotch} Hz`}</strong>
              <strong>{language === "zh" ? `距离衰减：${formatSignedDb(metrics.distanceGain)}` : `Distance loss: ${formatSignedDb(metrics.distanceGain)}`}</strong>
              <strong>{language === "zh" ? `直达/混响比：${formatSignedDb(metrics.directReverbRatio)}` : `Direct/reverb ratio: ${formatSignedDb(metrics.directReverbRatio)}`}</strong>
              <strong>{language === "zh" ? `渲染延迟预算：约 ${metrics.renderLatency} ms` : `Render latency budget: about ${metrics.renderLatency} ms`}</strong>
            </div>
          </aside>
        </div>

        <section className="spatial-concept-grid" aria-label={language === "zh" ? "空间音频关键解释" : "Spatial audio key explanations"}>
          <article>
            <h2>ITD / ILD</h2>
            <p>
              {language === "zh"
                ? "ITD 是左右耳到达时间差，ILD 是左右耳声级差。它们主要帮助判断左右方向，但前后和高度还需要 HRTF 频谱线索。"
                : "ITD is arrival-time difference and ILD is level difference between ears. They mainly help left-right localization, while front/back and height need HRTF spectral cues."}
            </p>
          </article>
          <article>
            <h2>HRTF / HRIR</h2>
            <p>
              {language === "zh"
                ? "HRTF/HRIR 描述头部、耳廓和躯干对某个方向声音的滤波。耳机双耳渲染会用它把虚拟声源变成左右耳 PCM。"
                : "HRTF/HRIR describes how the head, pinna, and torso filter sound from a direction. Headphone binaural rendering uses it to turn virtual sources into left/right ear PCM."}
            </p>
          </article>
          <article>
            <h2>{language === "zh" ? "对象音频 / Ambisonics" : "Object audio / Ambisonics"}</h2>
            <p>
              {language === "zh"
                ? "对象音频保存每个声音的位置元数据；Ambisonics 保存球面声场。二者都需要在播放端按设备能力解码或渲染。"
                : "Object audio stores position metadata per sound; Ambisonics stores a spherical sound field. Both must be decoded or rendered for the playback device."}
            </p>
          </article>
          <article>
            <h2>{language === "zh" ? "头部追踪" : "Head tracking"}</h2>
            <p>
              {language === "zh"
                ? "头部追踪会把世界坐标中的声源重新换算到耳朵坐标。延迟过高时，声像会跟头移动或产生漂移。"
                : "Head tracking converts sources in world coordinates into ear-relative coordinates. With too much latency, the image moves with the head or drifts."}
            </p>
          </article>
        </section>
      </section>
    </main>
  );
}
