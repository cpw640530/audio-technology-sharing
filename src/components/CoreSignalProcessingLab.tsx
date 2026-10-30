import { useMemo, useState } from "react";
import { ArrowLeft, RotateCcw } from "lucide-react";
import type { Language } from "../content/knowledge";
import { combinedResponse, filterSignal, filterTones, type FilterType } from "./filterModel";
import { compressedOutputDb, dynamicsFrame } from "./dynamicsModel";
import { StftWorkbench } from "./StftWorkbench";

type CoreSignalProcessingLabProps = {
  language: Language;
  onBack: () => void;
  onBackToDetails?: () => void;
};

type SignalMode = "stft" | "filter" | "dynamics";
type FlowStep = {
  label: Record<Language, string>;
  detail: Record<Language, string>;
};
type ProcessingStage = {
  label: Record<Language, string>;
  detail: Record<Language, string>;
  role?: SignalMode;
};
type ProcessingRole = {
  title: Record<Language, string>;
  stage: Record<Language, string>;
  summary: Record<Language, string>;
};

const modeLabels: Record<SignalMode, Record<Language, string>> = {
  stft: { zh: "FFT / STFT", en: "FFT / STFT" },
  filter: { zh: "滤波器 / EQ", en: "Filters / EQ" },
  dynamics: { zh: "动态处理", en: "Dynamics" }
};

const filterLabels: Record<FilterType, Record<Language, string>> = {
  lowpass: { zh: "低通", en: "Low-pass" },
  highpass: { zh: "高通", en: "High-pass" },
  bandpass: { zh: "带通", en: "Band-pass" },
  notch: { zh: "陷波", en: "Notch" }
};

const flowSteps: Record<SignalMode, FlowStep[]> = {
  stft: [
    {
      label: { zh: "输入 PCM", en: "Input PCM" },
      detail: { zh: "按时间排列的离散样本", en: "Discrete samples over time" }
    },
    {
      label: { zh: "分帧/加窗", en: "Frame/window" },
      detail: { zh: "窗口长度和 hop 决定取多少样本", en: "Window and hop decide sample grouping" }
    },
    {
      label: { zh: "FFT", en: "FFT" },
      detail: { zh: "每帧从时间域转到频率域", en: "Each frame moves from time to frequency" }
    },
    {
      label: { zh: "频谱/特征", en: "Spectrum/features" },
      detail: { zh: "得到频率格、能量和特征", en: "Frequency bins, energy, and features" }
    }
  ],
  filter: [
    {
      label: { zh: "输入频谱", en: "Input spectrum" },
      detail: { zh: "原始各频段能量", en: "Original band energy" }
    },
    {
      label: { zh: "选择滤波器", en: "Select filter" },
      detail: { zh: "低通、高通、带通或陷波", en: "Low-pass, high-pass, band-pass, or notch" }
    },
    {
      label: { zh: "频率响应", en: "Response" },
      detail: { zh: "cutoff、Q、gain 决定曲线", en: "Cutoff, Q, and gain shape the curve" }
    },
    {
      label: { zh: "输出频谱", en: "Output spectrum" },
      detail: { zh: "频段能量被保留或削弱", en: "Band energy is kept or reduced" }
    }
  ],
  dynamics: [
    {
      label: { zh: "输入数字电平", en: "Digital input level" },
      detail: { zh: "PCM 样本包络换算成 dBFS", en: "PCM envelope mapped to dBFS" }
    },
    {
      label: { zh: "电平检测", en: "Level detector" },
      detail: { zh: "和 threshold 比较", en: "Compare with threshold" }
    },
    {
      label: { zh: "增益计算", en: "Gain computer" },
      detail: { zh: "超过阈值后按 ratio 降增益", en: "Reduce gain above threshold by ratio" }
    },
    {
      label: { zh: "输出电平", en: "Output level" },
      detail: { zh: "峰值和动态范围变小", en: "Peaks and dynamic range shrink" }
    }
  ]
};

const processingStages: ProcessingStage[] = [
  {
    label: { zh: "输入源", en: "Source" },
    detail: { zh: "麦克风采集或文件/网络解码", en: "Mic capture or file/network decode" }
  },
  {
    label: { zh: "PCM 音频", en: "PCM audio" },
    detail: { zh: "已采样、量化的时域数据", en: "Sampled time-domain data" }
  },
  {
    label: { zh: "FFT / STFT", en: "FFT / STFT" },
    detail: { zh: "分析频谱、做特征或频域处理", en: "Spectrum analysis, features, or frequency-domain processing" },
    role: "stft"
  },
  {
    label: { zh: "EQ / 滤波", en: "EQ / filter" },
    detail: { zh: "改变不同频段能量", en: "Reshape energy by frequency band" },
    role: "filter"
  },
  {
    label: { zh: "动态处理", en: "Dynamics" },
    detail: { zh: "根据电平包络改变增益", en: "Change gain from the level envelope" },
    role: "dynamics"
  },
  {
    label: { zh: "输出去向", en: "Output" },
    detail: { zh: "编码、混音、DAC 或播放", en: "Encode, mix, DAC, or playback" }
  }
];

const processingRoles: Record<SignalMode, ProcessingRole> = {
  stft: {
    title: { zh: "FFT / STFT：主要是分析和变换域入口", en: "FFT / STFT: analysis and transform-domain entry" },
    stage: {
      zh: "常放在 PCM 之后：实时语音里用于语音增强、降噪、回声消除特征；音乐/工具里用于频谱显示、频域滤波或特征提取。",
      en: "Usually after PCM exists: in real-time voice it feeds enhancement, denoise, and AEC features; in tools it powers spectrum displays, frequency-domain filtering, or feature extraction."
    },
    summary: {
      zh: "FFT 快速计算一帧的离散傅里叶变换，输出包含幅度和相位的复数频谱；STFT 对连续分帧加窗后反复做变换，再取模平方得到时频功率图。分析本身不改善声音，修改频谱并重建才会改变声音。",
      en: "FFT efficiently computes a frame's DFT, yielding complex coefficients with magnitude and phase. STFT transforms successive windowed frames; squared magnitudes form a time-frequency power map. Analysis alone does not improve sound; modifying and reconstructing it does."
    }
  },
  filter: {
    title: { zh: "EQ / 滤波：主要是频段能量塑形", en: "EQ / filtering: frequency-band shaping" },
    stage: {
      zh: "通常放在 PCM 处理链中间：可以在录音后修正人声和设备频响，也可以在播放前做音色、响度或扬声器校正。",
      en: "Usually in the middle of a PCM chain: after capture for voice/device correction, or before playback for tone, loudness, or speaker correction."
    },
    summary: {
      zh: "滤波器按频率保留或削弱信号；参数 EQ 用中心频率、增益和 Q 控制某一段频率。它改变的是频段能量，也可能带来相位、延迟或振铃等副作用。",
      en: "Filters keep or attenuate signal by frequency; parametric EQ uses center frequency, gain, and Q to control a band. It reshapes frequency energy and can also introduce phase shift, delay, or ringing."
    }
  },
  dynamics: {
    title: { zh: "动态处理：主要是电平和峰值控制", en: "Dynamics: level and peak control" },
    stage: {
      zh: "通常放在降噪/EQ 之后、编码或 DAC 之前；语音链路里常见 AGC/压缩，播放链路里常见 DRC、limiter 和扬声器保护。",
      en: "Usually after denoise/EQ and before encoding or DAC; voice chains often use AGC/compression, while playback chains use DRC, limiting, and speaker protection."
    },
    summary: {
      zh: "动态处理先检测电平包络，再按 threshold、ratio、attack、release 改变增益。它不是 MP3/AAC 这类编码压缩，而是把忽大忽小、瞬态峰值或过载风险控制住。",
      en: "Dynamics first detects the level envelope, then changes gain using threshold, ratio, attack, and release. It is not MP3/AAC codec compression; it controls level swings, transient peaks, or overload risk."
    }
  }
};

const sampleRate = 16000;
function formatDb(value: number) {
  return `${value > 0 ? "+" : ""}${value} dB`;
}

function formatDbValue(value: number) {
  const rounded = Math.round(value * 10) / 10;
  const text = Number.isInteger(rounded) ? rounded.toFixed(0) : rounded.toFixed(1);

  return `${rounded > 0 ? "+" : ""}${text} dB`;
}

function formatDbfs(value: number) {
  const rounded = Math.round(value * 10) / 10;
  const text = Number.isInteger(rounded) ? rounded.toFixed(0) : rounded.toFixed(1);

  return `${text} dBFS`;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}


function logFrequencyPosition(frequency: number, min = 80, max = 8000) {
  return (Math.log10(frequency) - Math.log10(min)) / (Math.log10(max) - Math.log10(min));
}

function getCombinedFilterGain(
  filterType: FilterType,
  frequency: number,
  cutoff: number,
  q: number,
  eqGain: number
) {
  return combinedResponse(filterType, frequency, cutoff, q, eqGain).magnitude;
}

function createFilterWavePath(
  filterType: FilterType,
  cutoff: number,
  q: number,
  eqGain: number,
  x: number,
  y: number,
  width: number,
  amplitude: number,
  filtered: boolean,
  scale: number
) {
  const points = Array.from({ length: 161 }, (_, index) => {
    const ratio = index / 160;
    const value = filterSignal(index / sampleRate, filterType, cutoff, q, eqGain, filtered);
    const pointX = x + ratio * width;
    const pointY = y - value / scale * amplitude;
    return `${index === 0 ? "M" : "L"} ${pointX.toFixed(1)} ${pointY.toFixed(1)}`;
  });

  return points.join(" ");
}

function createFilterResponsePath(
  filterType: FilterType,
  cutoff: number,
  q: number,
  eqGain: number,
  x = 70,
  y = 248,
  width = 620,
  height = 176
) {
  const frequencies = [...Array.from({ length: 401 }, (_, index) => 80 * 100 ** (index / 400)), cutoff].sort((a, b) => a - b);
  const points = frequencies.map((frequency, index) => {
    const ratio = logFrequencyPosition(frequency);
    const gain = getCombinedFilterGain(filterType, frequency, cutoff, q, eqGain);
    const gainDb = 20 * Math.log10(Math.max(0.001, gain));
    const normalizedGain = clamp((gainDb + 60) / 100, 0, 1);
    const pointX = x + ratio * width;
    const pointY = y - normalizedGain * height;

    return `${index === 0 ? "M" : "L"} ${pointX.toFixed(1)} ${pointY.toFixed(1)}`;
  });

  return points.join(" ");
}

function createDynamicsCurvePath(threshold: number, ratio: number, x = 92, y = 258, width = 598, height = 196) {
  const thresholdX = x + ((threshold + 48) / 48) * width;
  const thresholdY = y - ((threshold + 48) / 48) * height;
  const endY = thresholdY - ((x + width - thresholdX) / ratio) * (height / width);

  return `M ${x} ${y} L ${thresholdX.toFixed(1)} ${thresholdY.toFixed(1)} L ${x + width} ${Math.max(y - height, endY).toFixed(1)}`;
}

function dbToDisplayY(db: number, bottomY: number, height: number) {
  const normalized = (clamp(db, -48, 0) + 48) / 48;

  return bottomY - normalized * height;
}

function createInputEnvelopePath(x = 92, bottomY = 330, width = 598, height = 70) {
  const points = Array.from({ length: 101 }, (_, index) => {
    const ratio = index / 100;
    const pointX = x + ratio * width;
    const pointY = dbToDisplayY(dynamicsFrame(ratio * 1000, -18, 1).inputDb, bottomY, height);

    return `${index === 0 ? "M" : "L"} ${pointX.toFixed(1)} ${pointY.toFixed(1)}`;
  });

  return points.join(" ");
}

function createOutputEnvelopePath(threshold: number, ratio: number, x = 92, bottomY = 330, width = 598, height = 70) {
  const points = Array.from({ length: 101 }, (_, index) => {
    const ratioPosition = index / 100;
    const pointX = x + ratioPosition * width;
    const outputDb = dynamicsFrame(ratioPosition * 1000, threshold, ratio).outputDb;
    const pointY = dbToDisplayY(outputDb, bottomY, height);

    return `${index === 0 ? "M" : "L"} ${pointX.toFixed(1)} ${pointY.toFixed(1)}`;
  });

  return points.join(" ");
}

function flowAriaLabel(mode: SignalMode, language: Language) {
  const labels: Record<SignalMode, Record<Language, string>> = {
    stft: { zh: "STFT 流程节点", en: "STFT flow steps" },
    filter: { zh: "滤波器流程节点", en: "Filter flow steps" },
    dynamics: { zh: "动态处理流程节点", en: "Dynamics flow steps" }
  };

  return labels[mode][language];
}

function FlowSteps({ language, mode }: { language: Language; mode: SignalMode }) {
  return (
    <ol aria-label={flowAriaLabel(mode, language)} className="core-flow-steps">
      {flowSteps[mode].map((step, index) => (
        <li className="core-flow-step" key={step.label.en}>
          <span>{index + 1}</span>
          <div>
            <strong>{step.label[language]}</strong>
            <p>{step.detail[language]}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function ProcessingStageOverview({ language, mode }: { language: Language; mode: SignalMode }) {
  const activeRole = processingRoles[mode];

  return (
    <section className="core-stage-overview" aria-labelledby="core-stage-overview-title">
      <div className="codec-mode-concepts-header">
        <span>{language === "zh" ? "处理阶段" : "Processing stage"}</span>
        <strong id="core-stage-overview-title">
          {language === "zh" ? "FFT/STFT、EQ 和动态处理通常在音频链路哪里做" : "Where FFT/STFT, EQ, and dynamics usually sit"}
        </strong>
      </div>
      <div className="core-stage-flow" role="list" aria-label={language === "zh" ? "音频处理阶段流程图" : "Audio processing stage flow"}>
        {processingStages.map((stage, index) => (
          <div
            className={stage.role === mode ? "core-stage-node active" : "core-stage-node"}
            key={stage.label.en}
            role="listitem"
          >
            <span>{index + 1}</span>
            <strong>{stage.label[language]}</strong>
            <p>{stage.detail[language]}</p>
          </div>
        ))}
      </div>
      <div className="core-stage-explain">
        <article>
          <h2>{activeRole.title[language]}</h2>
          <p>{activeRole.stage[language]}</p>
          <p>{activeRole.summary[language]}</p>
          {mode === "stft" && <p>{language === "zh" ? "上方是功能位置示意，不是必经的串行链路。时域 EQ 和压缩器可直接处理 PCM；若在 STFT 域修改频谱，通常需逆变换与重叠相加重建，再交给时域模块。" : "The stages show functional placement, not a mandatory serial chain. Time-domain EQ and compressors can process PCM directly. Modified STFT spectra normally need an inverse transform and overlap-add reconstruction before time-domain modules."}</p>}
        </article>
      </div>
    </section>
  );
}

function FlowArrow({ x1, x2, y }: { x1: number; x2: number; y: number }) {
  return <path className="core-flow-arrow" d={`M ${x1} ${y} L ${x2} ${y}`} />;
}

function SliderControl({
  label,
  max,
  min,
  onChange,
  step = 1,
  value
}: {
  label: string;
  max: number;
  min: number;
  onChange: (value: number) => void;
  step?: number;
  value: number;
}) {
  return (
    <label className="sound-lab-control">
      <span>{label}</span>
      <input
        aria-label={label}
        max={max}
        min={min}
        step={step}
        type="range"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

function FilterChart({
  cutoff,
  eqGain,
  filterType,
  language,
  q
}: {
  cutoff: number;
  eqGain: number;
  filterType: FilterType;
  language: Language;
  q: number;
}) {
  const responsePath = createFilterResponsePath(filterType, cutoff, q, eqGain, 414, 282, 164, 110);
  const outputBars = filterTones.map(tone => {
    const response = combinedResponse(filterType, tone.frequency, cutoff, q, eqGain);
    return { ...tone, output: tone.amplitude * response.magnitude, gainDb: 20 * Math.log10(Math.max(1e-12, response.magnitude)) };
  });
  const scale = Math.max(1, ...Array.from({ length: 161 }, (_, i) => Math.abs(filterSignal(i / sampleRate, filterType, cutoff, q, eqGain, true))));
  const originalWavePath = createFilterWavePath(filterType, cutoff, q, eqGain, 48, 374, 300, 26, false, scale);
  const filteredWavePath = createFilterWavePath(filterType, cutoff, q, eqGain, 410, 374, 300, 26, true, scale);
  const cutoffX = 90 + logFrequencyPosition(cutoff) * 560;
  const visibleCutoffX = Math.max(414, Math.min(578, 414 + (cutoffX - 90) * (164 / 560)));
  const barHeight = (amplitude: number) => clamp((20 * Math.log10(Math.max(0.001, amplitude)) + 60) / 100, 0, 1) * 110;
  const steps = flowSteps.filter;

  return (
    <>
    <svg
      aria-label={language === "zh" ? "滤波器流程对应图" : "Filter flow-linked diagram"}
      className="core-signal-chart filter-comparison-chart"
      role="img"
      viewBox="0 0 760 480"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect className="lab-diagram-bg" height="480" rx="16" width="760" />
      {steps.map((step, index) => {
        const x = 44 + index * 184;
        return (
          <g key={step.label.en}>
            <g className="core-flow-node">
              <rect x={x} y="34" width="148" height="72" rx="8" />
              <text className="core-flow-node-title" x={x + 74} y="70">{step.label[language]}</text>
            </g>
            {index < steps.length - 1 ? <FlowArrow x1={x + 148} x2={x + 174} y={70} /> : null}
          </g>
        );
      })}
      <line className="lab-axis" x1="54" x2="206" y1="282" y2="282" />
      {filterTones.map((tone, index) => (
        <g key={tone.frequency}>
          <rect className="core-spectrum-bar muted" data-testid="filter-input-bar" data-frequency={tone.frequency} height={barHeight(tone.amplitude)} width="14" x={76 + index * 44} y={282 - barHeight(tone.amplitude)} />
          <text className="interface-tdm-note" x={83 + index * 44} y="305" textAnchor="middle">{tone.frequency / 1000}</text>
        </g>
      ))}
      <text className="core-diagram-caption" x="130" y="332">{steps[0].label[language]} (kHz)</text>
      <rect className="core-filter-type-box" height="112" rx="12" width="138" x="240" y="174" />
      <text className="core-filter-type-label" x="309" y="224">{filterLabels[filterType][language]}</text>
      <text className="core-diagram-caption" x="309" y="332">{steps[1].label[language]}</text>
      <line className="lab-axis" x1="414" x2="578" y1="282" y2="282" />
      <line className="lab-axis faint" x1="414" x2="578" y1="216" y2="216" />
      <text className="interface-tdm-note" x="414" y="160">+40 / 0 / −60 dB</text>
      <path className="core-filter-fill" d={`${responsePath} L 578 282 L 414 282 Z`} />
      <path className="lab-wave-path filter-response-path" data-testid="filter-response-path" d={responsePath} />
      <line
        className="core-cutoff-marker"
        data-testid="filter-cutoff-marker"
        x1={visibleCutoffX}
        x2={visibleCutoffX}
        y1="170"
        y2="292"
      />
      <text className="interface-tdm-note" x="414" y="305">80</text>
      <text className="interface-tdm-note" x="578" y="305" textAnchor="end">8000 Hz</text>
      <text className="core-diagram-caption" x="496" y="332">{steps[2].label[language]}</text>
      <line className="lab-axis" x1="624" x2="716" y1="282" y2="282" />
      {outputBars.map((band, index) => (
        <g key={`output-${index}`}><rect
          className="core-spectrum-bar"
          data-frequency={band.frequency}
          data-testid="filter-output-bar"
          height={barHeight(band.output)}
          width="11"
          x={626 + index * 36}
          y={282 - barHeight(band.output)}
        /><text className="interface-tdm-note" x={632 + index * 36} y="305" textAnchor="middle">{band.frequency / 1000}</text></g>
      ))}
      <text className="core-diagram-caption" x="670" y="332">{steps[3].label[language]} (kHz)</text>
      <line className="lab-axis faint" x1="48" x2="348" y1="374" y2="374" />
      <path className="core-original-wave" d={originalWavePath} />
      <text className="core-diagram-caption small" x="198" y="428">{language === "zh" ? "原始波形" : "Original waveform"}</text>
      <line className="lab-axis faint" x1="410" x2="710" y1="374" y2="374" />
      <path className="core-filtered-wave" data-testid="filtered-wave-path" d={filteredWavePath} />
      <text className="core-diagram-caption small" x="560" y="428">{language === "zh" ? "滤波后波形" : "Filtered waveform"}</text>
      {[48, 410].map(x => <g key={x}>
        <text className="interface-tdm-note" x={x} y="401">0</text>
        <text className="interface-tdm-note" x={x + 300} y="401" textAnchor="end">10 ms</text>
      </g>)}
    </svg>
    <div className="filter-result-note">
      <p>{language === "zh" ? `同一输入：300、1600、5200 Hz 三音，16 kHz 采样。两幅波形均为 0–10 ms，共用纵轴 ±${scale.toFixed(2)}，不分别归一化；输出包含滤波器相移。` : `One input: 300, 1600 and 5200 Hz tones sampled at 16 kHz. Both waveforms span 0–10 ms and share ±${scale.toFixed(2)} vertically, without separate normalization. Output includes filter phase shift.`}</p>
      <table>
        <caption>{language === "zh" ? "同一频率分量的输入与输出（线性峰值幅度）" : "Input and output of each tone (linear peak amplitude)"}</caption>
        <thead><tr><th>Hz</th><th>{language === "zh" ? "输入" : "Input"}</th><th>{language === "zh" ? "输出" : "Output"}</th><th>{language === "zh" ? "变化" : "Change"}</th></tr></thead>
        <tbody>{outputBars.map(tone => <tr key={tone.frequency}><td>{tone.frequency}</td><td>{tone.amplitude.toFixed(3)}</td><td>{tone.output.toFixed(3)}</td><td>{tone.gainDb < -60 ? "< −60 dB" : formatDbValue(tone.gainDb)}</td></tr>)}</tbody>
      </table>
      <p>{language === "zh" ? "柱图为这三个分量的峰值幅度谱，单位 dB re 1，统一范围 −60 至 +40；频率按三档排列，非等间距频率轴。响应图横轴为对数 Hz，纵轴为增益 dB（同范围），0 dB 表示不增不减。" : "Bars show peak-amplitude spectra of these three tones in dB re 1, sharing −60 to +40. Frequency positions are categorical, not equally spaced Hz. Response uses logarithmic Hz and gain dB (same range); 0 dB is unity gain."}</p>
      <p>{language === "zh" ? "二阶滤波器后串联同中心频率/Q 的峰值 EQ。Q=0 按 0.1 计算，避免无定义；Q 不改变阶数。这里是解析稳态结果，不含启动瞬态、削波或新增谐波。方波纹理不应凭空出现。" : "A second-order filter is followed by peaking EQ at the same center/Q. Q=0 uses 0.1 to avoid an undefined filter; Q does not change order. This analytic steady-state result excludes startup transients, clipping and new harmonics."}</p>
      {scale > 1 && <p role="status">{language === "zh" ? "输出峰值超过 1：实际定点输出前需预留余量或降低增益，图中没有自动限幅。" : "Output exceeds 1: leave headroom or reduce gain before fixed-point output. No automatic limiter is applied here."}</p>}
      <a href="https://www.w3.org/TR/audio-eq-cookbook/" target="_blank" rel="noreferrer">W3C Audio EQ Cookbook</a>
    </div>
    </>
  );
}

function DynamicsChart({
  language,
  ratio,
  threshold
}: {
  language: Language;
  ratio: number;
  threshold: number;
}) {
  const [timeMs, setTimeMs] = useState(250);
  const frame = dynamicsFrame(timeMs, threshold, ratio);
  const curvePath = createDynamicsCurvePath(threshold, ratio, 430, 286, 136, 108);
  const envelopeBottomY = 286;
  const envelopeHeight = 92;
  const inputEnvelope = createInputEnvelopePath(54, envelopeBottomY, 140, envelopeHeight);
  const detectorEnvelope = createInputEnvelopePath(250, envelopeBottomY, 132, envelopeHeight);
  const outputEnvelope = createOutputEnvelopePath(threshold, ratio, 620, envelopeBottomY, 92, envelopeHeight);
  const thresholdLineY = dbToDisplayY(threshold, envelopeBottomY, envelopeHeight);
  const exampleInputDb = frame.inputDb;
  const exampleOverThresholdDb = Math.max(0, exampleInputDb - threshold);
  const exampleKeptOverDb = exampleOverThresholdDb / ratio;
  const exampleOutputDb = compressedOutputDb(exampleInputDb, threshold, ratio);
  const exampleGainDb = exampleOutputDb - exampleInputDb;
  const curveX = 430;
  const curveY = 286;
  const curveWidth = 136;
  const curveHeight = 108;
  const gainMarkerX = curveX + ((exampleInputDb + 48) / 48) * curveWidth;
  const inputReferenceY = dbToDisplayY(exampleInputDb, curveY, curveHeight);
  const compressedOutputY = dbToDisplayY(exampleOutputDb, curveY, curveHeight);
  const steps = flowSteps.dynamics;
  const gainPath = Array.from({ length: 101 }, (_, i) => {
    const gainDb = dynamicsFrame(i * 10, threshold, ratio).gainDb;
    return `${i ? "L" : "M"} ${60 + i * 6.4} ${30 - gainDb * 2}`;
  }).join(" ");

  return (
    <>
    <svg
      aria-label={language === "zh" ? "动态处理流程对应图" : "Dynamics flow-linked diagram"}
      className="core-signal-chart dynamics-comparison-chart"
      role="img"
      viewBox="0 0 760 365"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect className="lab-diagram-bg" height="365" rx="16" width="760" />
      {steps.map((step, index) => {
        const x = 44 + index * 184;
        return (
          <g key={step.label.en}>
            <g className="core-flow-node">
              <rect x={x} y="34" width="148" height="72" rx="8" />
              <text className="core-flow-node-title" x={x + 74} y="70">{step.label[language]}</text>
            </g>
            {index < steps.length - 1 ? <FlowArrow x1={x + 148} x2={x + 174} y={70} /> : null}
          </g>
        );
      })}
      {[{ x: 54, width: 140, db: frame.inputDb }, { x: 250, width: 132, db: frame.inputDb }, { x: 620, width: 92, db: frame.outputDb }].map(plot => <g key={plot.x}>
        <line className="lab-axis" x1={plot.x} x2={plot.x + plot.width} y1="286" y2="286" />
        <line className="core-cutoff-marker" x1={plot.x + timeMs / 1000 * plot.width} x2={plot.x + timeMs / 1000 * plot.width} y1="194" y2="286" />
        <circle className="core-gain-point" cx={plot.x + timeMs / 1000 * plot.width} cy={dbToDisplayY(plot.db, envelopeBottomY, envelopeHeight)} r="4" />
        <text className="interface-tdm-note" x={plot.x} y="310">0</text>
        <text className="interface-tdm-note" x={plot.x + plot.width} y="310" textAnchor="end">1 s</text>
      </g>)}
      <path className="core-dynamics-input" data-testid="dynamics-input-envelope" d={inputEnvelope} />
      <text className="core-diagram-caption" x="124" y="342">{steps[0].label[language]}</text>
      <line
        className="lab-axis faint"
        data-testid="dynamics-threshold-line"
        x1="238"
        x2="382"
        y1={thresholdLineY}
        y2={thresholdLineY}
      />
      <text className="interface-tdm-note" x="250" y="170">T = {threshold} dBFS</text>
      <path className="core-dynamics-input" d={detectorEnvelope} />
      <text className="core-diagram-caption" x="316" y="342">{steps[1].label[language]}</text>
      <line className="lab-axis" x1="430" x2="566" y1="286" y2="286" />
      <line className="lab-axis" x1="430" x2="430" y1="176" y2="286" />
      <path className="core-dynamics-guide" d="M 430 286 L 566 178" />
      <path className="lab-wave-path dynamics-transfer-path" d={curvePath} />
      <line
        className="core-gain-reference"
        x1="430"
        x2={gainMarkerX}
        y1={inputReferenceY}
        y2={inputReferenceY}
      />
      <line
        className="core-gain-reference"
        x1="430"
        x2={gainMarkerX}
        y1={compressedOutputY}
        y2={compressedOutputY}
      />
      <line
        className="core-gain-reduction-marker"
        data-testid="dynamics-gain-reduction"
        x1={gainMarkerX}
        x2={gainMarkerX}
        y1={inputReferenceY}
        y2={compressedOutputY}
      />
      <circle className="core-gain-point" cx={gainMarkerX} cy={compressedOutputY} r="4" />
      <text className="interface-tdm-note" x="430" y="310">−48</text><text className="interface-tdm-note" x="566" y="310" textAnchor="end">0 dBFS</text>
      <text className="core-diagram-caption" x="498" y="342">{steps[2].label[language]}</text>
      <path className="core-dynamics-output" data-testid="dynamics-output-envelope" d={outputEnvelope} />
      <text className="core-diagram-caption" x="666" y="342">{steps[3].label[language]}</text>
    </svg>
    <div className="dynamics-result-note">
      <p>{language === "zh" ? "输入、检测与输出图：横轴 0–1 s，纵轴统一 −48 至 0 dBFS，显示电平包络而非有正负的 PCM 波形。增益计算图：横轴为输入、纵轴为输出（均 −48 至 0 dBFS）；虚线表示未压缩输出=输入。" : "Input, detector and output: 0–1 s horizontally, −48 to 0 dBFS vertically. These are level envelopes, not signed PCM waveforms. Transfer plot: input vs output (both −48 to 0 dBFS); dashed diagonal is unity output."}</p>
      <label className="dynamics-time-control">{language === "zh" ? "观察时刻" : "Observation time"} · {timeMs} ms
        <input aria-label={language === "zh" ? "观察时刻" : "Observation time"} type="range" min="0" max="1000" step="10" value={timeMs} onChange={event => setTimeMs(Number(event.target.value))} />
      </label>
      <svg className="dynamics-gain-chart" viewBox="0 0 760 145" role="img" aria-label={language === "zh" ? "增益变化随时间" : "Gain change over time"}>
        {[0, -18, -36].map(db => <g key={db}><line className="lab-axis faint" x1="60" x2="700" y1={30 - db * 2} y2={30 - db * 2} /><text className="lab-label" x="50" y={36 - db * 2} textAnchor="end">{db}</text></g>)}
        <path className="core-dynamics-output" data-testid="dynamics-gain-history" d={gainPath} />
        <line className="core-cutoff-marker" x1={60 + timeMs * 0.64} x2={60 + timeMs * 0.64} y1="30" y2="102" />
        <circle className="core-gain-point" cx={60 + timeMs * 0.64} cy={30 - frame.gainDb * 2} r="4" />
        <text className="lab-label" x="60" y="133">0</text><text className="lab-label" x="380" y="133" textAnchor="middle">500</text><text className="lab-label" x="700" y="133" textAnchor="end">1000 ms</text>
      </svg>
      <p>{language === "zh" ? "增益曲线纵轴为 dB：0 表示不改变，负值表示衰减；横轴为时间。它不是输出电平，也不是频率响应。" : "Gain curve: vertical dB, with 0 meaning unchanged and negative values attenuation; horizontal time. It is neither output level nor frequency response."}</p>
      <div className="dynamics-calculation">
        <p>{language === "zh" ? "超过阈值：输出 = T + (输入 - T) / Ratio" : "Above threshold: output = T + (input - T) / Ratio"}</p>
        <p>{language === "zh" ? "低于或等于阈值：输出 = 输入，增益为 0 dB。" : "At or below threshold: output = input, gain = 0 dB."}</p>
        <p data-testid="dynamics-over-threshold">
          {language === "zh"
            ? `超出量：max(0, ${formatDbfs(exampleInputDb)} - ${formatDbfs(threshold)}) = ${formatDbValue(exampleOverThresholdDb)}`
            : `Excess: max(0, ${formatDbfs(exampleInputDb)} - ${formatDbfs(threshold)}) = ${formatDbValue(exampleOverThresholdDb)}`}
        </p>
        <p data-testid="dynamics-ratio-kept">
          {language === "zh"
            ? `Ratio：${formatDbValue(exampleOverThresholdDb)} / ${ratio} = ${formatDbValue(exampleKeptOverDb)}`
            : `Ratio: ${formatDbValue(exampleOverThresholdDb)} / ${ratio} = ${formatDbValue(exampleKeptOverDb)}`}
        </p>
        <p data-testid="dynamics-gain-db">
          {language === "zh"
            ? `输出：${formatDbfs(exampleOutputDb)}；增益变化 ${formatDbValue(exampleGainDb)}`
            : `Output: ${formatDbfs(exampleOutputDb)}; gain change ${formatDbValue(exampleGainDb)}`}
        </p>
        <p>{language === "zh" ? `衰减量：${(-exampleGainDb).toFixed(1)} dB；线性增益 g = ${frame.linearGain.toFixed(3)}，应用到 PCM 时 y[n] = g[n] · x[n]。` : `Reduction: ${(-exampleGainDb).toFixed(1)} dB; linear gain g = ${frame.linearGain.toFixed(3)}, applied to PCM as y[n] = g[n] · x[n].`}</p>
      </div>
      <p>{language === "zh" ? "Threshold 改变超出量；ratio 改变超出阈值部分保留多少，二者共同决定增益衰减。" : "Threshold changes how far above the line the signal is; ratio decides how much of that excess remains."}</p>
      <p>{language === "zh" ? "模型边界：使用合成检测包络与硬拐点静态映射，没有 attack/release、软拐点、补偿增益或前瞻。真实压缩器的增益有时间响应，不能把这里的结果当作完整压缩器波形或砖墙限幅器。" : "Model limits: synthetic detector envelope and hard-knee static mapping; no attack/release, soft knee, makeup gain or lookahead. Real gain has a time response; this is not a complete compressor waveform or a brick-wall limiter."}</p>
    </div>
    </>
  );
}

export function CoreSignalProcessingLab({ language, onBack, onBackToDetails }: CoreSignalProcessingLabProps) {
  const [mode, setMode] = useState<SignalMode>("stft");
  const [windowSize, setWindowSize] = useState(512);
  const [hopSize, setHopSize] = useState(256);
  const [filterType, setFilterType] = useState<FilterType>("lowpass");
  const [cutoff, setCutoff] = useState(2400);
  const [q, setQ] = useState(1.2);
  const [eqGain, setEqGain] = useState(0);
  const [threshold, setThreshold] = useState(-18);
  const [ratio, setRatio] = useState(3);

  const stftMetrics = useMemo(() => {
    const frequencyResolution = sampleRate / (2 ** Math.ceil(Math.log2(windowSize)));
    const frameDuration = (windowSize / sampleRate) * 1000;
    const overlap = Math.max(0, 1 - hopSize / windowSize) * 100;

    return { frameDuration, frequencyResolution, overlap };
  }, [hopSize, windowSize]);

  const filterSummary = {
    lowpass: {
      zh: "低通：削弱截止频率以上的高频",
      en: "Low-pass: attenuates high frequencies above cutoff"
    },
    highpass: {
      zh: "高通：削弱截止频率以下的低频",
      en: "High-pass: attenuates low frequencies below cutoff"
    },
    bandpass: {
      zh: "带通：只保留中心频段附近能量",
      en: "Band-pass: keeps energy around the center band"
    },
    notch: {
      zh: "陷波：压低某个窄频段的干扰",
      en: "Notch: suppresses a narrow interference band"
    }
  }[filterType];
  const activeChangeNote = {
    stft: {
      zh: "窗口越长，通常越能区分相邻频率，但时间定位越粗；hop 越小，时间帧更密、计算量更高。颜色越亮表示该帧频带的功率谱密度越高。",
      en: "Longer windows usually distinguish closer frequencies but give coarser timing; smaller hops add time frames and computation. Brighter cells mean higher power spectral density in that frame/band."
    },
    filter: {
      zh: "这一步变化：截止频率、Q 和 EQ 增益共同改变频率响应，输出频谱会随各频段保留比例变化。",
      en: "Current change: cutoff, Q, and EQ gain shape the response together, so the output spectrum follows the retained energy in each band."
    },
    dynamics: {
      zh: "这一步变化：阈值线下移，更早进入压缩，输出包络更平。",
      en: "Current change: the threshold line moves lower, compression starts earlier, and the output envelope becomes flatter."
    }
  }[mode];

  return (
    <main className="sound-lab-page core-signal-page">
      <section className="sound-lab-hero" aria-labelledby="core-signal-lab-title">
        <div className="sound-lab-back-actions">
          <button className="sound-lab-back" type="button" onClick={onBack}>
            <ArrowLeft size={18} aria-hidden="true" />
            {language === "zh" ? "返回知识库" : "Back to knowledge base"}
          </button>
          {onBackToDetails ? <button className="sound-lab-back" type="button" onClick={onBackToDetails}>
            <ArrowLeft size={18} aria-hidden="true" />
            {language === "zh" ? "返回详细内容" : "Back to detailed content"}
          </button> : null}
        </div>
        <div>
          <span className="section-kicker">{language === "zh" ? "传统 DSP 实验" : "Traditional DSP lab"}</span>
          <h1 id="core-signal-lab-title">
            {language === "zh" ? "基础信号处理实验室" : "Core Signal Processing Lab"}
          </h1>
          <p>
            {language === "zh"
              ? "把 STFT 分帧、滤波器/EQ 和动态处理放在一个实验台里，观察参数变化如何影响图形、分辨率、频率响应和动态范围。"
              : "Explore STFT framing, filters/EQ, and dynamics processing in one workbench, watching how parameters change diagrams, resolution, response, and dynamic range."}
          </p>
        </div>
      </section>

      <section
        aria-label={language === "zh" ? "基础信号处理实验台" : "Core signal processing workbench"}
        className="core-signal-workbench"
      >
        <div className="waveform-tabs core-signal-tabs" role="group" aria-label={language === "zh" ? "信号处理视图" : "Signal processing views"}>
          {(Object.keys(modeLabels) as SignalMode[]).map((item) => (
            <button
              className={mode === item ? "active" : ""}
              key={item}
              type="button"
              onClick={() => setMode(item)}
            >
              {modeLabels[item][language]}
            </button>
          ))}
        </div>

        {mode !== "stft" && <><ProcessingStageOverview language={language} mode={mode} /><FlowSteps language={language} mode={mode} /></>}

        <div className={mode === "stft" ? "core-signal-layout core-stft-layout" : "core-signal-layout"}>
          <div className="sound-lab-visual core-signal-visual">
            {mode === "stft" ? (
              <StftWorkbench hopSize={hopSize} language={language} windowSize={windowSize} />
            ) : null}
            {mode === "filter" ? (
              <FilterChart
                cutoff={cutoff}
                eqGain={eqGain}
                filterType={filterType}
                language={language}
                q={q}
              />
            ) : null}
            {mode === "dynamics" ? (
              <DynamicsChart language={language} ratio={ratio} threshold={threshold} />
            ) : null}
          </div>

          <aside className="sound-lab-controls core-signal-controls">
            {mode === "stft" ? (
              <>
                <div className="codec-mode-concepts-header">
                  <span>STFT</span>
                  <strong>{language === "zh" ? "分帧和频谱分辨率" : "Framing and spectral resolution"}</strong>
                </div>
                <SliderControl
                  label={language === "zh" ? "窗口长度" : "Window size"}
                  max={1024}
                  min={256}
                  step={256}
                  value={windowSize}
                  onChange={setWindowSize}
                />
                <SliderControl
                  label="Hop size"
                  max={512}
                  min={128}
                  step={128}
                  value={hopSize}
                  onChange={setHopSize}
                />
                <div className="core-signal-metrics">
                  <strong>{language === "zh" ? `频率格间距：${stftMetrics.frequencyResolution.toFixed(2)} Hz/bin` : `Bin spacing: ${stftMetrics.frequencyResolution.toFixed(2)} Hz/bin`}</strong>
                  <strong>{language === "zh" ? `每帧时长：${stftMetrics.frameDuration.toFixed(1)} ms` : `Frame duration: ${stftMetrics.frameDuration.toFixed(1)} ms`}</strong>
                  <strong>{language === "zh" ? `重叠率：${stftMetrics.overlap.toFixed(1)}%` : `Overlap: ${stftMetrics.overlap.toFixed(1)}%`}</strong>
                </div>
                <p className="core-signal-change-note">{activeChangeNote[language]}</p>
              </>
            ) : null}

            {mode === "filter" ? (
              <>
                <div className="codec-mode-concepts-header">
                  <span>{language === "zh" ? "频率响应" : "Frequency response"}</span>
                  <strong>{filterSummary[language]}</strong>
                </div>
                <div className="waveform-tabs core-filter-tabs" role="group" aria-label={language === "zh" ? "滤波器类型" : "Filter type"}>
                  {(Object.keys(filterLabels) as FilterType[]).map((item) => (
                    <button
                      className={filterType === item ? "active" : ""}
                      key={item}
                      type="button"
                      onClick={() => setFilterType(item)}
                    >
                      {filterLabels[item][language]}
                    </button>
                  ))}
                </div>
                <SliderControl
                  label={language === "zh" ? "截止频率" : "Cutoff frequency"}
                  max={7900}
                  min={200}
                  step={100}
                  value={cutoff}
                  onChange={setCutoff}
                />
                <SliderControl label="Q" max={20} min={0} step={0.1} value={q} onChange={setQ} />
                <SliderControl
                  label={language === "zh" ? "EQ 增益" : "EQ gain"}
                  max={12}
                  min={-12}
                  value={eqGain}
                  onChange={setEqGain}
                />
                <div className="core-signal-metrics">
                  <strong>{language === "zh" ? `截止频率：${cutoff} Hz` : `Cutoff: ${cutoff} Hz`}</strong>
                  <strong>Q：{q.toFixed(1)}</strong>
                  <strong>{language === "zh" ? `EQ 增益：${formatDb(eqGain)}` : `EQ gain: ${formatDb(eqGain)}`}</strong>
                </div>
                <p className="core-signal-change-note">{activeChangeNote[language]}</p>
                <button className="sine-button" type="button" onClick={() => { setFilterType("lowpass"); setCutoff(2400); setQ(1.2); setEqGain(0); }}><RotateCcw size={16} aria-hidden="true" />{language === "zh" ? "重置滤波参数" : "Reset filter"}</button>
              </>
            ) : null}

            {mode === "dynamics" ? (
              <>
                <div className="codec-mode-concepts-header">
                  <span>{language === "zh" ? "压缩器 / 限幅器" : "Compressor / limiter"}</span>
                  <strong>{language === "zh" ? "超过阈值后按 ratio 收缩，峰值被压低" : "Above threshold, ratio reduces peaks"}</strong>
                </div>
                <SliderControl
                  label="Threshold"
                  max={-6}
                  min={-36}
                  value={threshold}
                  onChange={setThreshold}
                />
                <SliderControl label="Ratio" max={12} min={1} value={ratio} onChange={setRatio} />
                <div className="core-signal-metrics">
                  <strong>Threshold：{threshold} dBFS</strong>
                  <strong>Ratio：{ratio}:1</strong>
                  <strong>{language === "zh" ? "Attack / release 决定增益变化速度" : "Attack / release set gain-change speed"}</strong>
                </div>
                <p className="core-signal-change-note">{activeChangeNote[language]}</p>
              </>
            ) : null}
          </aside>
        </div>

        {mode === "stft" && <details className="stft-reading-notes">
          <summary>{language === "zh" ? "处理流程与应用位置" : "Processing flow and placement"}</summary>
          <ProcessingStageOverview language={language} mode={mode} />
          <FlowSteps language={language} mode={mode} />
        </details>}
      </section>
    </main>
  );
}
