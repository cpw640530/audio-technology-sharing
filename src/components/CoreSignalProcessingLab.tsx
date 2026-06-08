import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import type { Language } from "../content/knowledge";

type CoreSignalProcessingLabProps = {
  language: Language;
  onBack: () => void;
};

type SignalMode = "stft" | "filter" | "dynamics";
type FilterType = "lowpass" | "highpass" | "bandpass" | "notch";
type FlowStep = {
  label: Record<Language, string>;
  detail: Record<Language, string>;
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
      detail: { zh: "连续采样值", en: "Continuous samples" }
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
      label: { zh: "输入电平", en: "Input level" },
      detail: { zh: "每帧或包络的响度变化", en: "Frame or envelope loudness" }
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

const sampleRate = 16000;

function formatDb(value: number) {
  return `${value > 0 ? "+" : ""}${value} dB`;
}

function createFrameEnvelopePath(windowSize: number, originX = 84, originY = 158, maxWidth = 230, amplitude = 44) {
  const frameWidth = Math.max(maxWidth * 0.45, Math.min(maxWidth, (windowSize / 1024) * maxWidth));
  const points = Array.from({ length: 80 }, (_, index) => {
    const ratio = index / 79;
    const x = originX + ratio * frameWidth;
    const envelope = 0.5 - 0.5 * Math.cos(2 * Math.PI * ratio);
    const carrier = Math.sin(ratio * Math.PI * 10);
    const y = originY - carrier * envelope * amplitude;
    return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
  });

  return points.join(" ");
}

function createSpectrumBars(windowSize: number) {
  const resolutionBoost = Math.log2(windowSize / 512);

  return Array.from({ length: 18 }, (_, index) => {
    const x = 432 + index * 15;
    const harmonic = Math.max(0, 86 - Math.abs(index - 4) * 16);
    const noise = Math.max(8, 42 - index * 1.5);
    const detail = Math.max(0, resolutionBoost * (index % 3) * 5);
    const height = Math.max(10, Math.min(104, harmonic + noise * 0.35 + detail));
    return { x, height };
  });
}

function mixColor(start: [number, number, number], end: [number, number, number], ratio: number) {
  const clamped = Math.max(0, Math.min(1, ratio));

  return start.map((value, index) => Math.round(value + (end[index] - value) * clamped));
}

function energyColor(value: number) {
  const clamped = Math.max(0, Math.min(1, value));
  const stops: Array<{ color: [number, number, number]; stop: number }> = [
    { stop: 0, color: [19, 29, 50] },
    { stop: 0.28, color: [31, 88, 125] },
    { stop: 0.52, color: [43, 171, 147] },
    { stop: 0.76, color: [246, 197, 87] },
    { stop: 1, color: [235, 92, 72] }
  ];
  const nextIndex = Math.max(1, stops.findIndex((item) => clamped <= item.stop));
  const previous = stops[nextIndex - 1];
  const next = stops[nextIndex];
  const ratio = (clamped - previous.stop) / (next.stop - previous.stop);
  const [red, green, blue] = mixColor(previous.color, next.color, ratio);

  return `rgb(${red}, ${green}, ${blue})`;
}

function createSpectrogramCells(windowSize: number, hopSize: number) {
  const columns = 18;
  const rows = 10;
  const windowFactor = Math.min(1, Math.max(0, (windowSize - 512) / 512));
  const hopFactor = Math.min(1, Math.max(0, (hopSize - 128) / 384));

  return Array.from({ length: columns * rows }, (_, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    const time = column / (columns - 1);
    const freq = 1 - row / (rows - 1);
    const fundamental = Math.exp(-((freq - (0.22 + Math.sin(time * Math.PI * 1.5) * 0.04)) ** 2) / 0.012);
    const harmonic = Math.exp(-((freq - (0.48 + Math.cos(time * Math.PI * 1.8) * 0.08)) ** 2) / 0.018);
    const transient = Math.exp(-((time - 0.66) ** 2) / 0.006) * Math.exp(-((freq - 0.72) ** 2) / 0.06);
    const noiseFloor = 0.1 + Math.sin((column + row) * 1.9) * 0.035;
    const timeTexture = 0.78 + Math.sin(time * Math.PI * 4.2) * 0.16;
    const resolutionBoost = windowFactor * (row % 2 === 0 ? 0.08 : -0.02);
    const smear = hopFactor * Math.exp(-((time - 0.35) ** 2) / 0.025) * 0.14;
    const energy = Math.max(
      0.05,
      Math.min(1, (fundamental * 0.82 + harmonic * 0.5 + transient * 0.7 + noiseFloor + smear + resolutionBoost) * timeTexture)
    );

    return {
      color: energyColor(energy),
      column,
      energy,
      row
    };
  });
}

function createFilterWavePath(
  filterType: FilterType,
  cutoff: number,
  eqGain: number,
  x: number,
  y: number,
  width: number,
  amplitude: number,
  filtered: boolean
) {
  const cutoffRatio = Math.min(1, Math.max(0, (cutoff - 200) / 7800));
  const gainScale = Math.max(0.45, Math.min(1.55, 1 + eqGain / 18));
  const points = Array.from({ length: 96 }, (_, index) => {
    const ratio = index / 95;
    const low = Math.sin(ratio * Math.PI * 2.2);
    const mid = Math.sin(ratio * Math.PI * 7.5) * 0.34;
    const high = Math.sin(ratio * Math.PI * 22) * 0.22;
    let value = low + mid + high;

    if (filtered) {
      if (filterType === "lowpass") {
        value = low * 1.03 + mid * (0.28 + cutoffRatio * 0.62) + high * cutoffRatio * 0.5;
      } else if (filterType === "highpass") {
        value = low * cutoffRatio * 0.34 + mid * 0.74 + high * 1.22;
      } else if (filterType === "bandpass") {
        value = low * 0.24 + mid * (0.85 + cutoffRatio * 0.22) + high * 0.22;
      } else {
        value = low + mid * (0.14 + cutoffRatio * 0.32) + high * 0.88;
      }

      value *= gainScale;
    }

    const pointX = x + ratio * width;
    const pointY = y - value * amplitude;
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
  const cutoffPosition = x + (Math.log10(cutoff) - Math.log10(80)) / (Math.log10(8000) - Math.log10(80)) * width;
  const scaleX = width / 620;
  const scaleY = height / 176;
  const normalizedQ = Math.min(1, Math.max(0, q / 20));
  const qBump = (10 + normalizedQ * 98) * scaleY;
  const qNarrow = 1 - normalizedQ * 0.78;
  const gainOffset = -eqGain * 4 * scaleY;
  const highY = y - 136 * scaleY;
  const midY = y - 72 * scaleY;

  if (filterType === "highpass") {
    return `M ${x} ${y} C ${cutoffPosition - 180 * scaleX} ${y} ${cutoffPosition - 118 * scaleX * qNarrow} ${y - 24 * scaleY} ${cutoffPosition - 44 * scaleX * qNarrow} ${y - 82 * scaleY + gainOffset * 0.25} C ${cutoffPosition + 12 * scaleX * qNarrow} ${highY + gainOffset - qBump * 0.32} ${cutoffPosition + 72 * scaleX * qNarrow} ${highY + 8 * scaleY + gainOffset * 0.3} ${x + width} ${highY + 16 * scaleY + gainOffset * 0.2}`;
  }

  if (filterType === "bandpass") {
    return `M ${x} ${y} C ${cutoffPosition - 190 * scaleX} ${y} ${cutoffPosition - 108 * scaleX * qNarrow} ${y - 30 * scaleY} ${cutoffPosition - 46 * scaleX * qNarrow} ${midY - 20 * scaleY} C ${cutoffPosition - 10 * scaleX * qNarrow} ${highY + 16 * scaleY - qBump * 0.68 + gainOffset} ${cutoffPosition + 10 * scaleX * qNarrow} ${highY + 16 * scaleY - qBump * 0.68 + gainOffset} ${cutoffPosition + 46 * scaleX * qNarrow} ${midY - 20 * scaleY} C ${cutoffPosition + 108 * scaleX * qNarrow} ${y - 30 * scaleY} ${cutoffPosition + 190 * scaleX} ${y} ${x + width} ${y}`;
  }

  if (filterType === "notch") {
    return `M ${x} ${highY} C ${cutoffPosition - 154 * scaleX} ${highY} ${cutoffPosition - 72 * scaleX * qNarrow} ${highY + 10 * scaleY} ${cutoffPosition - 38 * scaleX * qNarrow} ${midY} C ${cutoffPosition - 12 * scaleX * qNarrow} ${Math.min(y - 4 * scaleY, y - 24 * scaleY + qBump * 0.54 - gainOffset)} ${cutoffPosition + 12 * scaleX * qNarrow} ${Math.min(y - 4 * scaleY, y - 24 * scaleY + qBump * 0.54 - gainOffset)} ${cutoffPosition + 38 * scaleX * qNarrow} ${midY} C ${cutoffPosition + 72 * scaleX * qNarrow} ${highY + 10 * scaleY} ${cutoffPosition + 154 * scaleX} ${highY} ${x + width} ${highY}`;
  }

  return `M ${x} ${highY - 4 * scaleY} C ${cutoffPosition - 160 * scaleX} ${highY - 12 * scaleY + gainOffset * 0.2} ${cutoffPosition - 84 * scaleX * qNarrow} ${highY - 20 * scaleY + gainOffset - qBump * 0.32} ${cutoffPosition - 24 * scaleX * qNarrow} ${y - 98 * scaleY + gainOffset * 0.25} C ${cutoffPosition + 44 * scaleX * qNarrow} ${y - 22 * scaleY} ${cutoffPosition + 126 * scaleX} ${y} ${x + width} ${y}`;
}

function createDynamicsCurvePath(threshold: number, ratio: number, x = 92, y = 258, width = 598, height = 196) {
  const thresholdX = x + ((threshold + 48) / 48) * width;
  const thresholdY = y - ((threshold + 48) / 48) * height;
  const endY = thresholdY - ((x + width - thresholdX) / ratio) * (height / width);

  return `M ${x} ${y} L ${thresholdX.toFixed(1)} ${thresholdY.toFixed(1)} L ${x + width} ${Math.max(y - height, endY).toFixed(1)}`;
}

function createInputEnvelopePath(x = 92, y = 330, width = 598, amplitude = 70) {
  const points = Array.from({ length: 80 }, (_, index) => {
    const ratio = index / 79;
    const pointX = x + ratio * width;
    const wave = Math.abs(Math.sin(ratio * Math.PI * 4.5)) * (0.45 + 0.55 * Math.sin(ratio * Math.PI));
    const pointY = y - wave * amplitude;
    return `${index === 0 ? "M" : "L"} ${pointX.toFixed(1)} ${pointY.toFixed(1)}`;
  });

  return points.join(" ");
}

function createOutputEnvelopePath(threshold: number, ratio: number, x = 92, y = 330, width = 598, amplitude = 70) {
  const thresholdLinear = Math.max(0.15, (threshold + 48) / 48);
  const points = Array.from({ length: 80 }, (_, index) => {
    const ratioPosition = index / 79;
    const pointX = x + ratioPosition * width;
    const input = Math.abs(Math.sin(ratioPosition * Math.PI * 4.5)) * (0.45 + 0.55 * Math.sin(ratioPosition * Math.PI));
    const compressed = input <= thresholdLinear ? input : thresholdLinear + (input - thresholdLinear) / ratio;
    const pointY = y - compressed * amplitude;
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

function FlowNode({
  detail,
  index,
  label,
  x,
  y
}: {
  detail: string;
  index: number;
  label: string;
  x: number;
  y: number;
}) {
  const detailLines = detail.length > 14
    ? [detail.slice(0, 14), detail.slice(14, 26)]
    : [detail];

  return (
    <g className="core-flow-node">
      <rect height="72" rx="12" width="142" x={x} y={y} />
      <circle cx={x + 20} cy={y + 21} r="12" />
      <text className="core-flow-node-index" x={x + 20} y={y + 25}>{index + 1}</text>
      <text className="core-flow-node-title" x={x + 72} y={y + 25}>{label}</text>
      <text className="core-flow-node-detail" x={x + 72} y={y + 47}>
        {detailLines.map((line, lineIndex) => (
          <tspan key={line} x={x + 72} dy={lineIndex === 0 ? 0 : 13}>
            {line}
          </tspan>
        ))}
      </text>
    </g>
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

function StftChart({
  hopSize,
  language,
  windowSize
}: {
  hopSize: number;
  language: Language;
  windowSize: number;
}) {
  const framePath = createFrameEnvelopePath(windowSize, 226, 228, 150, 32);
  const bars = createSpectrumBars(windowSize);
  const hopOffset = Math.max(18, Math.min(74, (hopSize / 512) * 74));
  const windowBlockWidth = Math.max(56, Math.min(118, (windowSize / 1024) * 118));
  const spectrogramCells = createSpectrogramCells(windowSize, hopSize);
  const heatmapX = 116;
  const heatmapY = 404;
  const heatmapColumns = 18;
  const heatmapRows = 10;
  const heatmapCellWidth = 24;
  const heatmapCellHeight = 12;
  const heatmapGap = 3;
  const heatmapWidth = heatmapColumns * heatmapCellWidth + (heatmapColumns - 1) * heatmapGap;
  const heatmapHeight = heatmapRows * heatmapCellHeight + (heatmapRows - 1) * heatmapGap;
  const steps = flowSteps.stft;

  return (
    <svg
      aria-label={language === "zh" ? "STFT 流程对应图" : "STFT flow-linked diagram"}
      className="core-signal-chart"
      role="img"
      viewBox="0 0 760 680"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="coreSignalLine" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#7ee7d8" />
          <stop offset="100%" stopColor="#f0b46a" />
        </linearGradient>
      </defs>
      <rect className="lab-diagram-bg" height="680" rx="16" width="760" />
      {steps.map((step, index) => {
        const x = 44 + index * 184;
        return (
          <g key={step.label.en}>
            <FlowNode
              detail={step.detail[language]}
              index={index}
              label={step.label[language]}
              x={x}
              y={34}
            />
            {index < steps.length - 1 ? <FlowArrow x1={x + 148} x2={x + 174} y={70} /> : null}
          </g>
        );
      })}
      <line className="lab-axis" x1="44" x2="196" y1="226" y2="226" />
      <path className="core-mini-wave" d="M 46 226 C 62 190 78 190 94 226 S 126 262 142 226 174 192 196 220" />
      <circle className="core-sample-dot" cx="62" cy="200" r="4" />
      <circle className="core-sample-dot" cx="94" cy="226" r="4" />
      <circle className="core-sample-dot" cx="126" cy="252" r="4" />
      <circle className="core-sample-dot" cx="158" cy="226" r="4" />
      <text className="core-diagram-caption" x="90" y="318">{steps[0].label[language]}</text>
      <rect
        className="core-signal-window"
        data-testid="stft-window-block"
        height="104"
        rx="12"
        width={windowBlockWidth}
        x="226"
        y="174"
      />
      <rect
        className="core-overlap-window"
        data-testid="stft-overlap-frame"
        height="104"
        rx="12"
        width={windowBlockWidth}
        x={226 + hopOffset}
        y="184"
      />
      <line className="lab-axis" x1="218" x2="396" y1="228" y2="228" />
      <path className="lab-wave-path" d={framePath} />
      <path className="core-hann-window" d="M 226 276 C 246 176 306 176 376 276" />
      <path className="core-signal-hop" d={`M 226 304 H ${226 + hopOffset}`} />
      <text className="interface-tdm-note" x="226" y="320">hop</text>
      <text className="core-diagram-caption" x="278" y="350">{steps[1].label[language]}</text>
      <text className="core-diagram-caption small" x="350" y="314">{language === "zh" ? "Hann 窗" : "Hann window"}</text>
      <text className="core-diagram-caption small" x="310" y="334">{language === "zh" ? "重叠帧" : "Overlap frame"}</text>
      <rect className="core-fft-box" height="104" rx="12" width="116" x="424" y="174" />
      <path className="core-fft-symbol" d="M 448 248 L 478 190 L 508 248" />
      <text className="core-diagram-caption" x="482" y="318">{steps[2].label[language]}</text>
      <text className="core-diagram-caption small" x="482" y="342">{language === "zh" ? "频率格 / bin" : "Frequency bins"}</text>
      <line className="lab-axis" x1="574" x2="720" y1="286" y2="286" />
      <line className="lab-axis faint" x1="574" x2="720" y1="188" y2="188" />
      <text className="core-axis-label" x="580" y="170">{language === "zh" ? "纵轴：能量" : "Y: energy"}</text>
      <text className="core-axis-label" x="642" y="306">{language === "zh" ? "横轴：频率格" : "X: frequency bin"}</text>
      {bars.map((bar, index) => (
        <rect
          className="core-spectrum-bar"
          height={bar.height * 0.55}
          key={`bar-${index}`}
          rx="4"
          width="5"
          x={582 + index * 7}
          y={286 - bar.height * 0.55}
        />
      ))}
      <text className="core-diagram-caption" x="644" y="338">{steps[3].label[language]}</text>

      <text className="core-diagram-caption" x={heatmapX + heatmapWidth / 2} y="376">
        {language === "zh" ? "STFT 频谱图" : "STFT spectrogram"}
      </text>
      <rect
        className="core-spectrogram-panel"
        data-testid="stft-energy-plot"
        height={heatmapHeight + 24}
        rx="12"
        width={heatmapWidth + 24}
        x={heatmapX - 12}
        y={heatmapY - 12}
      />
      <line className="lab-axis" x1={heatmapX - 8} x2={heatmapX - 8} y1={heatmapY} y2={heatmapY + heatmapHeight} />
      <line className="lab-axis" x1={heatmapX} x2={heatmapX + heatmapWidth} y1={heatmapY + heatmapHeight + 8} y2={heatmapY + heatmapHeight + 8} />
      <text
        className="core-axis-label"
        transform={`rotate(-90 ${heatmapX - 72} ${heatmapY + heatmapHeight / 2})`}
        x={heatmapX - 72}
        y={heatmapY + heatmapHeight / 2}
      >
        {language === "zh" ? "纵轴：频率" : "Y: frequency"}
      </text>
      <text className="core-axis-label" x={heatmapX + heatmapWidth / 2} y={heatmapY + heatmapHeight + 30}>
        {language === "zh" ? "横轴：时间帧" : "X: time frame"}
      </text>
      <text className="core-axis-tick" x={heatmapX - 52} y={heatmapY + 8}>{language === "zh" ? "高频" : "High"}</text>
      <text className="core-axis-tick" x={heatmapX - 52} y={heatmapY + heatmapHeight}>{language === "zh" ? "低频" : "Low"}</text>
      <g className="core-spectrogram-grid">
        {spectrogramCells.map((cell) => (
          <rect
            className="core-spectrogram-cell"
            data-testid="stft-energy-cell"
            fill={cell.color}
            height={heatmapCellHeight}
            key={`${cell.column}-${cell.row}`}
            rx="2"
            width={heatmapCellWidth}
            x={heatmapX + cell.column * (heatmapCellWidth + heatmapGap)}
            y={heatmapY + cell.row * (heatmapCellHeight + heatmapGap)}
          />
        ))}
      </g>
      <g className="core-energy-legend">
        <text className="core-axis-label" x="620" y="440">{language === "zh" ? "颜色：能量" : "Color: energy"}</text>
        <rect fill={energyColor(1)} height="16" rx="3" width="26" x="622" y="456" />
        <text className="interface-tdm-note" x="656" y="468">{language === "zh" ? "亮 = 能量高" : "Bright = high energy"}</text>
        <rect fill={energyColor(0.55)} height="16" rx="3" width="26" x="622" y="486" />
        <text className="interface-tdm-note" x="656" y="498">{language === "zh" ? "中等能量" : "Mid energy"}</text>
        <rect fill={energyColor(0.12)} height="16" rx="3" width="26" x="622" y="516" />
        <text className="interface-tdm-note" x="656" y="528">{language === "zh" ? "暗 = 能量低" : "Dark = low energy"}</text>
      </g>
    </svg>
  );
}

function StftKeyConcepts({ language }: { language: Language }) {
  return (
    <section className="core-key-concepts" aria-labelledby="stft-key-concepts-title">
      <div className="codec-mode-concepts-header">
        <span>{language === "zh" ? "关键知识点" : "Key concepts"}</span>
        <strong id="stft-key-concepts-title">
          {language === "zh" ? "窗口长度、hop size 和能量图怎么理解" : "How to read window size, hop size, and energy maps"}
        </strong>
      </div>
      <div className="core-key-concept-grid">
        <article>
          <h3>{language === "zh" ? "窗口长度为什么影响频谱" : "Why window size changes the spectrum"}</h3>
          <p>
            {language === "zh"
              ? "STFT 会先截取一小段 PCM 样本，再对这一段做 FFT。窗口越长，参与分析的样本越多，频率格越细；但它覆盖的时间也更长，瞬态变化会被平均到这一帧里。"
              : "STFT cuts a short PCM segment and runs FFT on that segment. A longer window uses more samples, so frequency bins are finer, but it covers more time and smears transients across the frame."}
          </p>
          <p>
            {language === "zh"
              ? "频率分辨率公式：Δf = 采样率 Fs / FFT 点数 N。16 kHz 下，512 点约 31.25 Hz/bin，1024 点约 15.63 Hz/bin。"
              : "Frequency resolution: Delta f = sample rate Fs / FFT size N. At 16 kHz, 512 points are about 31.25 Hz/bin, while 1024 points are about 15.63 Hz/bin."}
          </p>
        </article>
        <article>
          <h3>{language === "zh" ? "hop size 表示什么" : "What hop size means"}</h3>
          <p>
            {language === "zh"
              ? "hop size 是相邻两帧起点之间相隔多少个采样点。hop 越小，相邻帧重叠越多，时间变化看起来更平滑；但需要计算更多帧，计算量也更高。"
              : "Hop size is the sample distance between the start of adjacent frames. Smaller hop means more overlap and smoother time changes, but it also produces more frames and higher compute cost."}
          </p>
          <p>
            {language === "zh"
              ? "重叠率可以理解为：1 - hop size / 窗口长度。比如 512 点窗口、256 点 hop，就是 50% 重叠。"
              : "Overlap can be read as 1 - hop size / window size. For example, a 512-point window with a 256-point hop has 50% overlap."}
          </p>
        </article>
        <article>
          <h3>{language === "zh" ? "能量高低表示什么" : "What energy level means"}</h3>
          <p>
            {language === "zh"
              ? "STFT 能量图里的每个格子，对应一个时间帧和一个频率范围。颜色越亮，表示这个时间点附近、这个频率范围里的声音成分越强。"
              : "Each spectrogram cell maps to one time frame and one frequency range. Brighter color means that frequency component is stronger around that time."}
          </p>
          <p>
            {language === "zh"
              ? "它不是新的音频信号，而是把原始波形拆成“什么时候有什么频率、强度有多大”的可视化。"
              : "It is not a new audio signal; it visualizes the original waveform as what frequencies exist at what times and how strong they are."}
          </p>
        </article>
      </div>
    </section>
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
  const originalWavePath = createFilterWavePath(filterType, cutoff, eqGain, 48, 374, 300, 26, false);
  const filteredWavePath = createFilterWavePath(filterType, cutoff, eqGain, 410, 374, 300, 26, true);
  const cutoffX = 90 + (Math.log10(cutoff) - Math.log10(80)) / (Math.log10(8000) - Math.log10(80)) * 560;
  const visibleCutoffX = Math.max(414, Math.min(578, 414 + (cutoffX - 90) * (164 / 560)));
  const qBandWidth = Math.max(10, 118 - q * 5);
  const eqGainLineY = Math.max(172, Math.min(282, 238 - eqGain * 4.5));
  const eqGainMultiplier = Math.max(0.3, Math.min(1.9, 1 + eqGain / 18));
  const outputBars = [26, 48, 70, filterType === "lowpass" ? 22 : 76].map((height) =>
    Math.max(8, Math.min(104, height * eqGainMultiplier))
  );
  const steps = flowSteps.filter;

  return (
    <svg
      aria-label={language === "zh" ? "滤波器流程对应图" : "Filter flow-linked diagram"}
      className="core-signal-chart"
      role="img"
      viewBox="0 0 760 480"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect className="lab-diagram-bg" height="480" rx="16" width="760" />
      {steps.map((step, index) => {
        const x = 44 + index * 184;
        return (
          <g key={step.label.en}>
            <FlowNode
              detail={step.detail[language]}
              index={index}
              label={step.label[language]}
              x={x}
              y={34}
            />
            {index < steps.length - 1 ? <FlowArrow x1={x + 148} x2={x + 174} y={70} /> : null}
          </g>
        );
      })}
      <line className="lab-axis" x1="54" x2="206" y1="282" y2="282" />
      {[28, 58, 88, 118].map((height, index) => (
        <rect className="core-spectrum-bar muted" height={height} key={`input-${index}`} rx="4" width="14" x={76 + index * 28} y={282 - height} />
      ))}
      <text className="core-diagram-caption" x="64" y="332">{steps[0].label[language]}</text>
      <rect className="core-filter-type-box" height="112" rx="12" width="138" x="240" y="174" />
      <text className="core-filter-type-label" x="309" y="224">{filterLabels[filterType][language]}</text>
      <text className="core-diagram-caption" x="246" y="332">{steps[1].label[language]}</text>
      <line className="lab-axis" x1="414" x2="578" y1="282" y2="282" />
      <line className="lab-axis faint" x1="414" x2="578" y1="194" y2="194" />
      <line
        className="core-eq-gain-line"
        data-testid="filter-eq-gain-line"
        x1="414"
        x2="578"
        y1={eqGainLineY}
        y2={eqGainLineY}
      />
      <text className="interface-tdm-note" x="418" y={eqGainLineY - 8}>
        {language === "zh" ? `EQ ${formatDb(eqGain)}` : `EQ ${formatDb(eqGain)}`}
      </text>
      <rect
        className="core-q-band"
        data-testid="filter-q-band"
        height="112"
        rx="8"
        width={qBandWidth}
        x={Math.max(414, Math.min(578 - qBandWidth, visibleCutoffX - qBandWidth / 2))}
        y="170"
      />
      <path className="core-filter-fill" d={`${responsePath} L 578 282 L 414 282 Z`} />
      <path className="lab-wave-path" d={responsePath} />
      <line
        className="core-cutoff-marker"
        data-testid="filter-cutoff-marker"
        x1={visibleCutoffX}
        x2={visibleCutoffX}
        y1="170"
        y2="292"
      />
      <text className="core-diagram-caption" x="420" y="332">{steps[2].label[language]}</text>
      <line className="lab-axis" x1="624" x2="716" y1="282" y2="282" />
      {outputBars.map((height, index) => (
        <rect
          className="core-spectrum-bar"
          data-testid="filter-output-bar"
          height={height}
          key={`output-${index}`}
          rx="4"
          width="13"
          x={636 + index * 20}
          y={282 - height}
        />
      ))}
      <text className="core-diagram-caption" x="626" y="332">{steps[3].label[language]}</text>
      <line className="lab-axis faint" x1="48" x2="348" y1="374" y2="374" />
      <path className="core-original-wave" d={originalWavePath} />
      <text className="core-diagram-caption small" x="112" y="428">{language === "zh" ? "原始波形" : "Original waveform"}</text>
      <line className="lab-axis faint" x1="410" x2="710" y1="374" y2="374" />
      <path className="core-filtered-wave" data-testid="filtered-wave-path" d={filteredWavePath} />
      <text className="core-diagram-caption small" x="490" y="428">{language === "zh" ? "滤波后波形" : "Filtered waveform"}</text>
      <text className="interface-tdm-note" x="52" y="454">{language === "zh" ? "波形对比：低通会让高频纹理变少；高通会削弱低频起伏；EQ 增益会改变滤波后振幅。" : "Waveform comparison: low-pass removes high-frequency texture, high-pass reduces slow movement, and EQ gain changes filtered amplitude."}</text>
    </svg>
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
  const curvePath = createDynamicsCurvePath(threshold, ratio, 430, 286, 136, 108);
  const inputEnvelope = createInputEnvelopePath(54, 286, 140, 52);
  const outputEnvelope = createOutputEnvelopePath(threshold, ratio, 620, 286, 92, 52);
  const thresholdY = 258 - ((threshold + 48) / 48) * 196;
  const steps = flowSteps.dynamics;

  return (
    <svg
      aria-label={language === "zh" ? "动态处理流程对应图" : "Dynamics flow-linked diagram"}
      className="core-signal-chart"
      role="img"
      viewBox="0 0 760 460"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect className="lab-diagram-bg" height="460" rx="16" width="760" />
      {steps.map((step, index) => {
        const x = 44 + index * 184;
        return (
          <g key={step.label.en}>
            <FlowNode
              detail={step.detail[language]}
              index={index}
              label={step.label[language]}
              x={x}
              y={34}
            />
            {index < steps.length - 1 ? <FlowArrow x1={x + 148} x2={x + 174} y={70} /> : null}
          </g>
        );
      })}
      <path className="core-dynamics-input" d={inputEnvelope} />
      <text className="core-diagram-caption" x="58" y="332">{steps[0].label[language]}</text>
      <line
        className="lab-axis faint"
        data-testid="dynamics-threshold-line"
        x1="238"
        x2="382"
        y1={Math.max(180, Math.min(292, thresholdY + 26))}
        y2={Math.max(180, Math.min(292, thresholdY + 26))}
      />
      <text className="interface-tdm-note" x="246" y="170">Threshold</text>
      <path className="core-dynamics-input" d="M 250 282 C 274 226 300 226 324 282 S 360 326 382 264" />
      <text className="core-diagram-caption" x="238" y="332">{steps[1].label[language]}</text>
      <line className="lab-axis" x1="430" x2="566" y1="286" y2="286" />
      <line className="lab-axis" x1="430" x2="430" y1="176" y2="286" />
      <path className="core-dynamics-guide" d="M 430 286 L 566 178" />
      <path className="lab-wave-path" d={curvePath} />
      <text className="core-diagram-caption" x="430" y="332">{steps[2].label[language]}</text>
      <path className="core-dynamics-output" d={outputEnvelope} />
      <text className="core-diagram-caption" x="618" y="332">{steps[3].label[language]}</text>
      <text className="interface-tdm-note" x="52" y="408">{language === "zh" ? "Threshold 决定从哪里开始压缩；ratio 越大，超过阈值后的输出斜率越平。" : "Threshold decides where compression starts; higher ratio flattens output above threshold."}</text>
      <text className="interface-tdm-note" x="52" y="432">{language === "zh" ? "这里的压缩是动态范围压缩，不是 MP3/AAC 这类编码压缩。" : "This is dynamic range compression, not MP3/AAC-style codec compression."}</text>
    </svg>
  );
}

export function CoreSignalProcessingLab({ language, onBack }: CoreSignalProcessingLabProps) {
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
    const frequencyResolution = sampleRate / windowSize;
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
      zh: "这一步变化：分帧/加窗窗口变宽，FFT 频率格更细。",
      en: "Current change: the frame/window block changes width, and FFT frequency bins become finer."
    },
    filter: {
      zh: "这一步变化：截止频率标记右移，输出频谱的高频保留更多。",
      en: "Current change: the cutoff marker moves right, and more high-frequency output is kept."
    },
    dynamics: {
      zh: "这一步变化：阈值线下移，更早进入压缩，输出包络更平。",
      en: "Current change: the threshold line moves lower, compression starts earlier, and the output envelope becomes flatter."
    }
  }[mode];

  return (
    <main className="sound-lab-page core-signal-page">
      <section className="sound-lab-hero" aria-labelledby="core-signal-lab-title">
        <button className="sound-lab-back" type="button" onClick={onBack}>
          <ArrowLeft size={18} aria-hidden="true" />
          {language === "zh" ? "返回知识库" : "Back to knowledge base"}
        </button>
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

        <FlowSteps language={language} mode={mode} />

        <div className="core-signal-layout">
          <div className="sound-lab-visual core-signal-visual">
            {mode === "stft" ? (
              <StftChart hopSize={hopSize} language={language} windowSize={windowSize} />
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
                  <strong>{language === "zh" ? `频率分辨率：${stftMetrics.frequencyResolution.toFixed(2)} Hz/bin` : `Frequency resolution: ${stftMetrics.frequencyResolution.toFixed(2)} Hz/bin`}</strong>
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
                  max={8000}
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

        {mode === "stft" ? <StftKeyConcepts language={language} /> : null}
      </section>
    </main>
  );
}
