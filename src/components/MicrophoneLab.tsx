import { useMemo, useRef, useState } from "react";
import { ArrowLeft, Pause, Play } from "lucide-react";
import type { Language } from "../content/knowledge";

type MicrophoneLabProps = {
  language: Language;
  onBack: () => void;
};

type PolarPattern = "omni" | "cardioid" | "figure8";
type MicExample = "near" | "far" | "noise" | "plosive" | "clipping" | "offAxis";
type MicPrinciple = "electret" | "digitalMems" | "dynamicVocal" | "array";

type ActiveMicAudio = {
  context: AudioContext;
};

type PrincipleCopy = {
  label: Record<Language, string>;
  subtitle: Record<Language, string>;
  signal: Record<Language, string>;
  output: Record<Language, string>;
  core: Record<Language, string>;
  stages: Array<Record<Language, string>>;
  notes: Array<Record<Language, string>>;
};

const polarLabels: Record<PolarPattern, Record<Language, string>> = {
  omni: { zh: "全指向", en: "Omnidirectional" },
  cardioid: { zh: "心形", en: "Cardioid" },
  figure8: { zh: "8 字形", en: "Figure-8" }
};

const exampleLabels: Record<MicExample, Record<Language, string>> = {
  near: { zh: "近讲", en: "Close talk" },
  far: { zh: "远距离", en: "Far field" },
  noise: { zh: "环境底噪", en: "Room noise" },
  plosive: { zh: "爆破音", en: "Plosive" },
  clipping: { zh: "削波失真", en: "Clipping" },
  offAxis: { zh: "离轴衰减", en: "Off-axis loss" }
};

const exampleNotes: Record<MicExample, Record<Language, string>> = {
  near: {
    zh: "近讲时直达声占比高，声音更清楚；指向性麦克风还可能出现低频近讲效应。",
    en: "Close talk has more direct sound and better clarity; directional microphones may also add proximity bass."
  },
  far: {
    zh: "距离变远后直达声下降，房间反射和环境噪声更明显，语音会变薄、变远。",
    en: "At longer distance, direct sound drops while reflections and ambient noise become more obvious."
  },
  noise: {
    zh: "底噪来自环境、麦克风自噪声和前级增益。目标声越小，噪声越容易盖住细节。",
    en: "Noise comes from the room, microphone self-noise, and preamp gain. Lower target level makes noise more exposed."
  },
  plosive: {
    zh: "爆破音是气流直接冲击振膜造成的低频冲击，常用防喷罩、偏轴摆位和距离控制解决。",
    en: "Plosives are low-frequency bursts from air hitting the diaphragm, controlled with pop filters, off-axis placement, and distance."
  },
  clipping: {
    zh: "声源太响或增益太高会让前级过载，波形顶部被削平，听起来破、硬、刺耳。",
    en: "A loud source or too much gain overloads the front end, flattening waveform peaks and sounding harsh."
  },
  offAxis: {
    zh: "离开主轴后拾音会变小，高频通常先衰减，所以声音会变暗、变远。",
    en: "Off-axis pickup is weaker and often loses treble first, making the source darker and farther away."
  }
};

const principleCopy: Record<MicPrinciple, PrincipleCopy> = {
  electret: {
    label: { zh: "模拟驻极体咪头", en: "Analog electret capsule" },
    subtitle: {
      zh: "常见于耳机线控、录音笔、低成本采集模块和嵌入式设备。",
      en: "Common in headset remotes, recorders, low-cost capture modules, and embedded devices."
    },
    signal: { zh: "输出：模拟电压", en: "Output: analog voltage" },
    output: { zh: "需要偏置电阻、耦合电容、前级放大和 ADC。", en: "Needs bias resistor, coupling capacitor, preamp, and ADC." },
    core: {
      zh: "驻极体材料预先带电，声压推动振膜改变电容，内部 JFET 把高阻抗微弱信号缓冲成可用模拟电压。",
      en: "Electret material holds charge; sound moves the diaphragm and changes capacitance, while an internal JFET buffers the weak high-impedance signal into usable analog voltage."
    },
    stages: [
      { zh: "声压", en: "Pressure" },
      { zh: "振膜电容", en: "Capsule C" },
      { zh: "JFET 缓冲", en: "JFET buffer" },
      { zh: "模拟电压", en: "Analog V" }
    ],
    notes: [
      { zh: "优点是便宜、小巧、接口简单。", en: "Small, cheap, and simple to interface." },
      { zh: "缺点是易受布线、偏置、电源噪声和前级质量影响。", en: "Sensitive to wiring, bias, power noise, and preamp quality." }
    ]
  },
  digitalMems: {
    label: { zh: "数字 MEMS 麦", en: "Digital MEMS mic" },
    subtitle: {
      zh: "常见于手机、TWS 耳机、智能音箱、笔记本和车载语音。",
      en: "Common in phones, TWS earbuds, smart speakers, laptops, and vehicle voice systems."
    },
    signal: { zh: "输出：PDM / I2S", en: "Output: PDM / I2S" },
    output: { zh: "芯片内完成前端放大和调制，主控直接接收数字音频数据。", en: "Front-end amplification and modulation happen on chip, so the host receives digital audio data directly." },
    core: {
      zh: "MEMS 振膜和 ASIC 集成在封装内，声压改变微结构电容，芯片内部放大并通过 Σ-Δ 调制输出 PDM，或进一步抽取成 I2S PCM。",
      en: "A MEMS diaphragm and ASIC share one package. Pressure changes micro-capacitance, the ASIC amplifies it, then sigma-delta modulation outputs PDM or decimated I2S PCM."
    },
    stages: [
      { zh: "MEMS 振膜", en: "MEMS diaphragm" },
      { zh: "ASIC 前端", en: "ASIC front end" },
      { zh: "Σ-Δ 调制", en: "Sigma-delta" },
      { zh: "PDM / I2S", en: "PDM / I2S" }
    ],
    notes: [
      { zh: "数字输出抗模拟布线干扰，更适合小体积多麦设计。", en: "Digital output resists analog wiring noise and suits compact multi-mic designs." },
      { zh: "需要关注时钟、左右声道配置、PDM 抽取和封装声孔设计。", en: "Clocking, left/right configuration, PDM decimation, and acoustic port design matter." }
    ]
  },
  dynamicVocal: {
    label: { zh: "动圈话筒", en: "Dynamic vocal mic" },
    subtitle: {
      zh: "常见于舞台演出、K 歌、人声近讲、鼓和吉他箱体。",
      en: "Common for stage performance, karaoke, close vocals, drums, and guitar cabinets."
    },
    signal: { zh: "输出：低电平模拟电压", en: "Output: low-level analog voltage" },
    output: { zh: "不需要幻象电源，但通常需要更高前级增益。", en: "Needs no phantom power, but usually requires more preamp gain." },
    core: {
      zh: "振膜连接轻质线圈，线圈在磁场中随声音运动并感应出电压。结构坚固、抗大声压，但灵敏度通常低于电容麦。",
      en: "A diaphragm moves a lightweight coil inside a magnetic field, inducing voltage. It is rugged and handles high SPL, but is usually less sensitive than condenser microphones."
    },
    stages: [
      { zh: "振膜", en: "Diaphragm" },
      { zh: "音圈", en: "Voice coil" },
      { zh: "磁场感应", en: "Magnetic induction" },
      { zh: "前级增益", en: "Preamp gain" }
    ],
    notes: [
      { zh: "适合近距离、大声压和嘈杂环境。", en: "Good for close distance, high SPL, and noisy environments." },
      { zh: "离嘴太远时电平会低，房间声和底噪会更明显。", en: "Too much distance lowers level and reveals room sound and noise." }
    ]
  },
  array: {
    label: { zh: "多麦阵列", en: "Multi-mic array" },
    subtitle: {
      zh: "常见于会议设备、智能音箱、手机免提、TWS 耳机和车载座舱。",
      en: "Common in conference devices, smart speakers, phone speaker mode, TWS earbuds, and vehicle cabins."
    },
    signal: { zh: "输出：增强后的目标声", en: "Output: enhanced target voice" },
    output: { zh: "多路麦克风同步采集后，算法利用时间差和相位差增强目标方向。", en: "Multiple synchronized microphones use time and phase differences to enhance the target direction." },
    core: {
      zh: "声源到每颗麦克风的距离不同，到达时间和相位也不同。阵列算法估计方向，延时对齐并加权求和，形成波束，同时抑制非目标方向噪声和回声。",
      en: "A source reaches each microphone at different times and phases. Array algorithms estimate direction, delay-align and weight channels to form a beam, while suppressing off-target noise and echo."
    },
    stages: [
      { zh: "多路采集", en: "Multi capture" },
      { zh: "时间差", en: "Time delay" },
      { zh: "波束形成", en: "Beamforming" },
      { zh: "目标语音", en: "Target voice" }
    ],
    notes: [
      { zh: "阵列能力依赖麦间距、同步时钟、安装位置和算法。", en: "Array performance depends on mic spacing, sync clock, placement, and algorithms." },
      { zh: "后续可继续接入 AEC、NS、DOA 和声源分离。", en: "It can extend into AEC, noise suppression, DOA, and source separation." }
    ]
  }
};

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

function getPolarGain(pattern: PolarPattern, angleDegrees: number) {
  const radians = (angleDegrees * Math.PI) / 180;
  const cosine = Math.cos(radians);

  if (pattern === "omni") {
    return 1;
  }

  if (pattern === "figure8") {
    return Math.abs(cosine);
  }

  return Math.max(0, 0.5 + 0.5 * cosine);
}

function createPolarPath(pattern: PolarPattern, angleDegrees: number) {
  const centerX = 190;
  const centerY = 190;
  const radiusScale = 142;
  const points = Array.from({ length: 181 }, (_, index) => {
    const degrees = (index / 180) * 360;
    const gain = getPolarGain(pattern, degrees);
    const radians = ((degrees - 90) * Math.PI) / 180;
    const radius = gain * radiusScale;
    const x = centerX + Math.cos(radians) * radius;
    const y = centerY + Math.sin(radians) * radius;

    return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
  });

  const sourceRadians = ((angleDegrees - 90) * Math.PI) / 180;
  const sourceRadius = 156;
  const source = {
    x: centerX + Math.cos(sourceRadians) * sourceRadius,
    y: centerY + Math.sin(sourceRadians) * sourceRadius
  };

  return {
    path: `${points.join(" ")} Z`,
    source
  };
}

function getPickupAnalysis({
  angle,
  distance,
  gain,
  pattern
}: {
  angle: number;
  distance: number;
  gain: number;
  pattern: PolarPattern;
}) {
  const directionalGain = getPolarGain(pattern, Math.abs(angle));
  const distanceGain = 1 / Math.max(1, distance);
  const preampGain = gain / 50;
  const level = directionalGain * distanceGain * preampGain;
  const levelPercent = Math.min(100, Math.round(level * 82));
  const noiseRisk = Math.min(100, Math.round((distance / 3.2) * 46 + Math.max(0, gain - 42) * 0.8));
  const clippingRisk = Math.min(100, Math.round(Math.max(0, level - 0.86) * 160 + Math.max(0, gain - 70) * 1.1));
  const clarity = Math.max(0, Math.min(100, Math.round(levelPercent - noiseRisk * 0.42 - Math.abs(angle) * 0.12)));

  return {
    clarity,
    clippingRisk,
    directionalGain,
    levelPercent,
    noiseRisk
  };
}

function createNoiseBuffer(context: AudioContext, duration: number, amount: number) {
  const sampleRate = context.sampleRate || 44100;
  const frameCount = Math.floor(sampleRate * duration);
  const buffer = context.createBuffer(1, frameCount, sampleRate);
  const data = buffer.getChannelData(0);

  for (let index = 0; index < frameCount; index += 1) {
    data[index] = (Math.random() * 2 - 1) * amount;
  }

  return buffer;
}

function createDistortionCurve(amount: number) {
  const curve = new Float32Array(512);
  const drive = 1 + amount * 38;

  for (let index = 0; index < curve.length; index += 1) {
    const x = (index * 2) / (curve.length - 1) - 1;
    curve[index] = Math.tanh(x * drive);
  }

  return curve;
}

function stopGraph(graph: ActiveMicAudio | null) {
  if (!graph) {
    return;
  }

  void graph.context.close();
}

function PrincipleDiagram({
  language,
  principle
}: {
  language: Language;
  principle: MicPrinciple;
}) {
  const copy = principleCopy[principle];
  const isArray = principle === "array";
  const isDigital = principle === "digitalMems";
  const isDynamic = principle === "dynamicVocal";

  return (
    <section className="mic-principle-workbench" aria-label={language === "zh" ? "麦克风工作原理可视化" : "Microphone working principle visualization"}>
      <div className="mic-principle-visual">
        <svg
          aria-label={language === "zh" ? `${copy.label.zh}工作原理图` : `${copy.label.en} principle diagram`}
          role="img"
          viewBox="0 0 760 360"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="micSignalGradient" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#7ee7d8" />
              <stop offset="100%" stopColor="#f0b46a" />
            </linearGradient>
            <marker id="signalArrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
              <path d="M0 0 8 4 0 8Z" fill="#f0b46a" />
            </marker>
          </defs>
          <rect className="lab-diagram-bg" height="360" rx="14" width="760" />
          <path className="mic-air-wave" d="M38 178 C62 126 86 126 110 178 S158 230 182 178" />
          <text className="lab-label" x="42" y="92">{language === "zh" ? "声波" : "Sound wave"}</text>

          {isArray ? (
            <g>
              {[118, 178, 238, 298].map((y, index) => (
                <g key={y}>
                  <circle className="mic-array-capsule" cx="238" cy={y} r="14" />
                  <path className="mic-signal-line" d={`M110 ${178 + index * 8} C148 ${130 + index * 30} 188 ${y} 224 ${y}`} />
                  <text className="lab-label" x="258" y={y + 6}>{`Mic ${index + 1}`}</text>
                </g>
              ))}
              <rect className="mic-stage-box" height="78" rx="8" width="132" x="404" y="139" />
              <text className="mic-stage-text" x="424" y="172">{language === "zh" ? "延时对齐" : "Delay align"}</text>
              <text className="mic-stage-text" x="424" y="198">{language === "zh" ? "加权求和" : "Weighted sum"}</text>
              <path className="mic-signal-line" d="M326 118 C360 126 372 150 404 166" />
              <path className="mic-signal-line" d="M326 178 L404 178" />
              <path className="mic-signal-line" d="M326 238 C360 230 372 206 404 190" />
              <path className="mic-signal-line" d="M326 298 C370 286 388 220 404 202" />
              <path className="mic-signal-line" d="M536 178 L650 178" markerEnd="url(#signalArrow)" />
              <path className="mic-beam-shape" d="M594 178 C626 118 694 102 718 178 C694 254 626 238 594 178Z" />
            </g>
          ) : (
            <g>
              <rect className="mic-capsule-shell" height="150" rx="20" width="126" x="218" y="104" />
              <line className="mic-diaphragm-line" x1="258" x2="258" y1="124" y2="234" />
              <path className="mic-signal-line" d="M182 178 C202 160 216 154 246 154" markerEnd="url(#signalArrow)" />
              {isDynamic ? (
                <>
                  <path className="mic-coil" d="M278 132 C306 146 306 164 278 178 C306 192 306 210 278 224" />
                  <rect className="mic-magnet" height="118" rx="10" width="28" x="302" y="120" />
                  <text className="lab-label" x="286" y="270">{language === "zh" ? "音圈 + 磁体" : "Coil + magnet"}</text>
                </>
              ) : (
                <>
                  <line className="mic-backplate-line" x1="304" x2="304" y1="124" y2="234" />
                  <text className="lab-label" x="236" y="270">{language === "zh" ? "振膜 / 背板电容" : "Diaphragm / backplate C"}</text>
                </>
              )}
              <rect className="mic-stage-box" height="74" rx="8" width="122" x="410" y="141" />
              <text className="mic-stage-text" x="431" y="172">
                {isDigital ? (language === "zh" ? "ASIC" : "ASIC") : isDynamic ? (language === "zh" ? "前级" : "Preamp") : "JFET"}
              </text>
              <text className="mic-stage-text" x="431" y="198">
                {isDigital ? (language === "zh" ? "调制" : "Modulate") : isDynamic ? (language === "zh" ? "放大" : "Gain") : (language === "zh" ? "缓冲" : "Buffer")}
              </text>
              <path className="mic-signal-line" d="M344 178 L410 178" markerEnd="url(#signalArrow)" />
              <path className={isDigital ? "mic-pdm-line" : "mic-analog-line"} d={isDigital ? "M532 178 L548 156 L564 200 L580 156 L596 200 L612 156 L628 200 L644 178" : "M532 178 C552 138 572 138 592 178 S632 218 652 178"} />
              <text className="lab-label" x="550" y="248">{copy.signal[language]}</text>
            </g>
          )}

          <g className="mic-stage-flow" transform="translate(54 312)">
            {copy.stages.map((stage, index) => (
              <g key={stage.en} transform={`translate(${index * 174} 0)`}>
                <rect height="32" rx="8" width="138" x="0" y="0" />
                <text x="14" y="21">{stage[language]}</text>
                {index < copy.stages.length - 1 ? <path d="M142 16 L166 16" markerEnd="url(#signalArrow)" /> : null}
              </g>
            ))}
          </g>
        </svg>
      </div>
      <div className="mic-principle-copy">
        <div>
          <span className="section-kicker">{language === "zh" ? "工作原理" : "Working principle"}</span>
          <h2>{copy.label[language]}</h2>
          <p>{copy.subtitle[language]}</p>
        </div>
        <div className="mic-principle-core">
          <strong>{copy.signal[language]}</strong>
          <p>{copy.core[language]}</p>
          <span>{copy.output[language]}</span>
        </div>
        <div className="mic-principle-notes">
          {copy.notes.map((note) => (
            <article key={note.en}>
              <p>{note[language]}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function MicrophoneLab({ language, onBack }: MicrophoneLabProps) {
  const [principle, setPrinciple] = useState<MicPrinciple>("electret");
  const [pattern, setPattern] = useState<PolarPattern>("cardioid");
  const [angle, setAngle] = useState(0);
  const [distance, setDistance] = useState(1.2);
  const [gain, setGain] = useState(52);
  const [example, setExample] = useState<MicExample>("near");
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<ActiveMicAudio | null>(null);
  const polar = useMemo(() => createPolarPath(pattern, angle), [angle, pattern]);
  const analysis = useMemo(
    () => getPickupAnalysis({ angle, distance, gain, pattern }),
    [angle, distance, gain, pattern]
  );

  function stopAudio() {
    stopGraph(audioRef.current);
    audioRef.current = null;
    setIsPlaying(false);
  }

  function playExample() {
    stopAudio();
    const AudioContextConstructor = window.AudioContext ?? window.webkitAudioContext;

    if (!AudioContextConstructor) {
      return;
    }

    const context = new AudioContextConstructor();
    const now = context.currentTime;
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    const filter = context.createBiquadFilter();
    const outputGain = context.createGain();
    const sourceLevel = Math.max(0.02, analysis.levelPercent / 100);

    oscillator.type = "sawtooth";
    oscillator.frequency.setValueAtTime(example === "plosive" ? 130 : 210, now);
    filter.type = example === "offAxis" || example === "far" ? "lowpass" : "bandpass";
    filter.frequency.setValueAtTime(
      example === "offAxis" ? 1500 : example === "far" ? 2200 : example === "plosive" ? 170 : 920,
      now
    );
    filter.Q.setValueAtTime(example === "plosive" ? 0.7 : 1.1, now);
    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.linearRampToValueAtTime(
      example === "far" ? 0.035 : example === "noise" ? 0.045 : 0.05 + sourceLevel * 0.08,
      now + 0.04
    );
    gainNode.gain.linearRampToValueAtTime(0.0001, now + 1.05);
    outputGain.gain.setValueAtTime(0.86, now);

    oscillator.connect(filter);
    let lastNode: AudioNode = filter;

    if (example === "clipping") {
      const shaper = context.createWaveShaper();
      shaper.curve = createDistortionCurve(0.82);
      shaper.oversample = "4x";
      lastNode.connect(shaper);
      lastNode = shaper;
    }

    lastNode.connect(gainNode);
    gainNode.connect(outputGain);
    outputGain.connect(context.destination);

    oscillator.start(now);
    oscillator.stop(now + 1.08);

    if (example === "noise" || example === "far") {
      const noiseSource = context.createBufferSource();
      const noiseGain = context.createGain();
      const noiseFilter = context.createBiquadFilter();
      noiseSource.buffer = createNoiseBuffer(context, 1.1, 0.7);
      noiseSource.loop = true;
      noiseFilter.type = "highpass";
      noiseFilter.frequency.setValueAtTime(700, now);
      noiseGain.gain.setValueAtTime(0.0001, now);
      noiseGain.gain.linearRampToValueAtTime(example === "far" ? 0.028 : 0.05, now + 0.04);
      noiseGain.gain.linearRampToValueAtTime(0.0001, now + 1.05);
      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(context.destination);
      noiseSource.start(now);
      noiseSource.stop(now + 1.08);
    }

    if (example === "plosive") {
      const burst = context.createOscillator();
      const burstGain = context.createGain();
      const burstFilter = context.createBiquadFilter();
      burst.type = "sine";
      burst.frequency.setValueAtTime(72, now);
      burstFilter.type = "lowpass";
      burstFilter.frequency.setValueAtTime(210, now);
      burstGain.gain.setValueAtTime(0.0001, now);
      burstGain.gain.linearRampToValueAtTime(0.22, now + 0.03);
      burstGain.gain.linearRampToValueAtTime(0.0001, now + 0.22);
      burst.connect(burstFilter);
      burstFilter.connect(burstGain);
      burstGain.connect(context.destination);
      burst.start(now);
      burst.stop(now + 0.24);
    }

    audioRef.current = { context };
    setIsPlaying(true);
    window.setTimeout(() => setIsPlaying(false), 1120);
  }

  return (
    <main className="microphone-lab-page">
      <section className="sound-lab-hero" aria-labelledby="microphone-lab-title">
        <button className="sound-lab-back" type="button" onClick={onBack}>
          <ArrowLeft size={18} aria-hidden="true" />
          {language === "zh" ? "返回知识库" : "Back to knowledge base"}
        </button>
        <div>
          <span className="section-kicker">{language === "zh" ? "硬件实验" : "Hardware lab"}</span>
          <h1 id="microphone-lab-title">{language === "zh" ? "麦克风指向性与拾音实验室" : "Microphone Pickup Lab"}</h1>
          <p>
            {language === "zh"
              ? "用可视化方式理解指向性、角度、距离和增益如何影响拾音强度、噪声和削波风险。"
              : "Use visual controls to understand how polar pattern, angle, distance, and gain affect pickup strength, noise, and clipping risk."}
          </p>
        </div>
      </section>

      <section className="mic-principle-section" aria-labelledby="mic-principle-heading">
        <div className="section-heading">
          <div>
            <h2 id="mic-principle-heading">{language === "zh" ? "麦克风工作原理" : "How Microphones Work"}</h2>
            <p>
              {language === "zh"
                ? "对比模拟驻极体咪头、数字 MEMS 麦、动圈话筒和多麦阵列的信号路径。"
                : "Compare signal paths for analog electret capsules, digital MEMS microphones, dynamic vocal microphones, and multi-mic arrays."}
            </p>
          </div>
        </div>
        <div className="mic-principle-tabs" role="group" aria-label={language === "zh" ? "麦克风工作原理类型" : "Microphone principle type"}>
          {(Object.keys(principleCopy) as MicPrinciple[]).map((type) => (
            <button
              className={principle === type ? "mic-principle-tab active" : "mic-principle-tab"}
              key={type}
              type="button"
              onClick={() => setPrinciple(type)}
            >
              {principleCopy[type].label[language]}
            </button>
          ))}
        </div>
        <PrincipleDiagram language={language} principle={principle} />
      </section>

      <section className="microphone-lab-workbench" aria-label={language === "zh" ? "麦克风拾音实验台" : "Microphone pickup workbench"}>
        <div className="microphone-visual">
          <div className="digital-lab-status">
            <strong>{language === "zh" ? `指向性：${polarLabels[pattern].zh}` : `Pattern: ${polarLabels[pattern].en}`}</strong>
            <span>{language === "zh" ? `拾音强度：${analysis.levelPercent}%` : `Pickup level: ${analysis.levelPercent}%`}</span>
          </div>
          <svg
            aria-label={language === "zh" ? "麦克风指向性极坐标图" : "Microphone polar pattern chart"}
            role="img"
            viewBox="0 0 760 420"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="micPolarFill" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#7ee7d8" stopOpacity="0.72" />
                <stop offset="100%" stopColor="#f0b46a" stopOpacity="0.58" />
              </linearGradient>
              <marker id="micArrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
                <path d="M0 0 8 4 0 8Z" fill="#f0b46a" />
              </marker>
            </defs>
            <rect className="lab-diagram-bg" height="420" rx="14" width="760" />
            <g transform="translate(190 190)">
              {[50, 95, 142].map((radius) => (
                <circle className="mic-polar-grid" cx="0" cy="0" key={radius} r={radius} />
              ))}
              <line className="mic-polar-axis" x1="0" x2="0" y1="-160" y2="160" />
              <line className="mic-polar-axis" x1="-160" x2="160" y1="0" y2="0" />
              <text className="lab-label" x="-12" y="-170">0°</text>
              <text className="lab-label" x="148" y="6">90°</text>
              <text className="lab-label" x="-28" y="184">180°</text>
            </g>
            <path className="mic-polar-path" d={polar.path} />
            <circle className="mic-capsule" cx="190" cy="190" r="14" />
            <line className="mic-source-line" markerEnd="url(#micArrow)" x1="190" x2={polar.source.x.toFixed(2)} y1="190" y2={polar.source.y.toFixed(2)} />
            <circle className="mic-source-dot" cx={polar.source.x.toFixed(2)} cy={polar.source.y.toFixed(2)} r="10" />
            <text className="lab-chip" x="392" y="78">{language === "zh" ? `角度 ${angle}°` : `Angle ${angle}°`}</text>
            <text className="lab-chip" x="392" y="114">{language === "zh" ? `距离 ${distance.toFixed(1)} m` : `Distance ${distance.toFixed(1)} m`}</text>
            <text className="lab-chip" x="392" y="150">{language === "zh" ? `前级增益 ${gain}%` : `Preamp gain ${gain}%`}</text>
            <g className="mic-meter" transform="translate(390 205)">
              <text className="lab-label" x="0" y="-18">{language === "zh" ? "拾音结果" : "Pickup result"}</text>
              <rect height="14" rx="7" width="280" x="0" y="0" />
              <rect className="mic-meter-fill" height="14" rx="7" width={(analysis.levelPercent * 2.8).toFixed(1)} x="0" y="0" />
              <text className="lab-label" x="0" y="48">{language === "zh" ? `清晰度 ${analysis.clarity}%` : `Clarity ${analysis.clarity}%`}</text>
              <text className="lab-label" x="0" y="84">{language === "zh" ? `噪声风险 ${analysis.noiseRisk}%` : `Noise risk ${analysis.noiseRisk}%`}</text>
              <text className="lab-label" x="0" y="120">{language === "zh" ? `削波风险 ${analysis.clippingRisk}%` : `Clipping risk ${analysis.clippingRisk}%`}</text>
            </g>
          </svg>
        </div>

        <div className="microphone-panel">
          <div className="waveform-tabs" role="group" aria-label={language === "zh" ? "麦克风指向性" : "Microphone polar pattern"}>
            {(Object.keys(polarLabels) as PolarPattern[]).map((type) => (
              <button
                className={pattern === type ? "waveform-tab active" : "waveform-tab"}
                key={type}
                type="button"
                onClick={() => setPattern(type)}
              >
                {polarLabels[type][language]}
              </button>
            ))}
          </div>

          <div className="lab-sliders">
            <label>
              <span>
                {language === "zh" ? "声源角度" : "Source angle"}
                <strong>{angle}°</strong>
              </span>
              <input
                aria-label={language === "zh" ? "声源角度" : "Source angle"}
                max="180"
                min="-180"
                step="5"
                type="range"
                value={angle}
                onChange={(event) => setAngle(Number(event.target.value))}
              />
            </label>
            <label>
              <span>
                {language === "zh" ? "拾音距离" : "Pickup distance"}
                <strong>{distance.toFixed(1)} m</strong>
              </span>
              <input
                aria-label={language === "zh" ? "拾音距离" : "Pickup distance"}
                max="4"
                min="0.2"
                step="0.1"
                type="range"
                value={distance}
                onChange={(event) => setDistance(Number(event.target.value))}
              />
            </label>
            <label>
              <span>
                {language === "zh" ? "前级增益" : "Preamp gain"}
                <strong>{gain}%</strong>
              </span>
              <input
                aria-label={language === "zh" ? "前级增益" : "Preamp gain"}
                max="100"
                min="10"
                step="2"
                type="range"
                value={gain}
                onChange={(event) => setGain(Number(event.target.value))}
              />
            </label>
          </div>

          <div className="mic-example-grid" role="group" aria-label={language === "zh" ? "拾音问题示例" : "Pickup examples"}>
            {(Object.keys(exampleLabels) as MicExample[]).map((item) => (
              <button
                className={example === item ? "waveform-tab active" : "waveform-tab"}
                key={item}
                type="button"
                onClick={() => setExample(item)}
              >
                {exampleLabels[item][language]}
              </button>
            ))}
          </div>

          <div className="sound-lab-actions">
            <button className="sine-button" type="button" onClick={playExample}>
              <Play size={16} aria-hidden="true" />
              {language === "zh" ? "播放拾音示例" : "Play pickup example"}
            </button>
            <button className="sine-button" type="button" onClick={stopAudio}>
              <Pause size={16} aria-hidden="true" />
              {language === "zh" ? "停止" : "Stop"}
            </button>
            <span className={isPlaying ? "sine-status playing" : "sine-status"}>
              {isPlaying ? (language === "zh" ? "播放中" : "Playing") : language === "zh" ? "未播放" : "Stopped"}
            </span>
          </div>

          <div className="lab-live-note">
            <strong>{exampleLabels[example][language]}</strong>
            <span>{exampleNotes[example][language]}</span>
          </div>
        </div>
      </section>

      <section className="mic-knowledge-grid" aria-label={language === "zh" ? "麦克风选型提示" : "Microphone selection tips"}>
        <article>
          <h2>{language === "zh" ? "直播 / 播客" : "Livestream / Podcast"}</h2>
          <p>
            {language === "zh"
              ? "安静房间可用电容麦获得细节；普通房间或键盘噪声较多时，近讲动圈麦更稳。"
              : "A quiet room can benefit from condenser detail; in ordinary rooms with keyboard noise, a close dynamic mic is often more stable."}
          </p>
        </article>
        <article>
          <h2>{language === "zh" ? "会议 / 远场" : "Meeting / Far field"}</h2>
          <p>
            {language === "zh"
              ? "重点不是单颗麦多贵，而是阵列位置、回声消除、噪声抑制和房间混响控制。"
              : "The key is not one expensive capsule, but array placement, echo cancellation, noise suppression, and room reverb control."}
          </p>
        </article>
        <article>
          <h2>{language === "zh" ? "手机 / 耳机" : "Phone / Earbuds"}</h2>
          <p>
            {language === "zh"
              ? "MEMS 麦克风适合小体积和多麦协同，常结合波束成形、通话降噪和风噪检测。"
              : "MEMS microphones fit compact multi-mic systems, often paired with beamforming, call noise reduction, and wind detection."}
          </p>
        </article>
        <article>
          <h2>{language === "zh" ? "录音棚 / 乐器" : "Studio / Instruments"}</h2>
          <p>
            {language === "zh"
              ? "根据声源声压、瞬态、音色目标和房间条件选择电容、动圈或铝带麦，并控制摆位。"
              : "Choose condenser, dynamic, or ribbon mics by SPL, transient response, tone target, and room condition, then tune placement."}
          </p>
        </article>
      </section>
    </main>
  );
}
