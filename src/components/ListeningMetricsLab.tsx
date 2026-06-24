import { useRef, useState } from "react";
import { ArrowLeft, Pause, Play } from "lucide-react";
import type { Language } from "../content/knowledge";

type ListeningMetricsLabProps = {
  language: Language;
  onBack: () => void;
};

type ListeningEffect = "brightness" | "muddy" | "noise" | "distortion" | "compression" | "stereo";

type EffectCopy = {
  label: Record<Language, string>;
  metric: string;
  description: Record<Language, string>;
  hearing: Record<Language, string>;
};

type MetricDetail = {
  title: string;
  summary: Record<Language, string>;
  measures: Record<Language, string>;
  listening: Record<Language, string>;
  scenes: Record<Language, string>;
  misconception: Record<Language, string>;
};

type ActiveAudioGraph = {
  context: AudioContext;
  effect: ListeningEffect;
  filter: BiquadFilterNode;
  outputGain: GainNode;
  shaper?: WaveShaperNode;
  compressor?: DynamicsCompressorNode;
  panner?: StereoPannerNode | null;
  noiseGain?: GainNode;
};

type HarmonicComponent = {
  gain: number;
  order: number;
  phase: number;
};

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

const effectCopy: Record<ListeningEffect, EffectCopy> = {
  brightness: {
    label: { zh: "明亮高频", en: "Bright treble" },
    metric: "频响曲线",
    description: {
      zh: "明亮：提升高频能量，声音会更清晰、更靠前，但过强会刺耳。",
      en: "Brightness: boosting treble makes sound clearer and more forward, but too much becomes harsh."
    },
    hearing: {
      zh: "听感重点：齿音、空气感、清晰度。",
      en: "Listen for: sibilance, air, and clarity."
    }
  },
  muddy: {
    label: { zh: "浑浊低中频", en: "Muddy low mids" },
    metric: "频响曲线",
    description: {
      zh: "浑浊：低频和低中频堆积，声音会变厚但不清楚。",
      en: "Muddiness: bass and low-mid buildup makes sound thicker but less clear."
    },
    hearing: {
      zh: "听感重点：低频轰鸣、人声被盖住。",
      en: "Listen for: boominess and covered vocals."
    }
  },
  noise: {
    label: { zh: "噪声底噪", en: "Noise floor" },
    metric: "SNR",
    description: {
      zh: "底噪：在信号下方加入持续噪声，SNR 变低时安静段更容易听到嘶声。",
      en: "Noise floor: adding steady noise lowers SNR, making hiss obvious in quiet parts."
    },
    hearing: {
      zh: "听感重点：嘶声、电流声、安静处不干净。",
      en: "Listen for: hiss, electrical noise, and dirty quiet parts."
    }
  },
  distortion: {
    label: { zh: "谐波失真", en: "Harmonic distortion" },
    metric: "THD / THD+N",
    description: {
      zh: "失真：非线性会在基波外生成 2f、3f、5f 等谐波；强度越高，高阶谐波越多，波形越偏离正弦。",
      en: "Distortion: nonlinearity adds 2f, 3f, 5f, and higher harmonics; stronger drive adds more high-order content and bends the waveform away from a sine."
    },
    hearing: {
      zh: "听感重点：温暖感、毛刺、破音、边缘变粗。",
      en: "Listen for: warmth, grit, clipping, and rough edges."
    }
  },
  compression: {
    label: { zh: "动态压缩", en: "Dynamic compression" },
    metric: "动态范围 / LUFS",
    description: {
      zh: "动态压缩：缩小强弱差距，让声音更稳定、更大声，但冲击力会下降。",
      en: "Compression: reducing level contrast makes sound steadier and louder, but less punchy."
    },
    hearing: {
      zh: "听感重点：声音更贴脸，起伏和瞬态减少。",
      en: "Listen for: forward loudness with reduced movement and transients."
    }
  },
  stereo: {
    label: { zh: "声像偏移", en: "Stereo shift" },
    metric: "串扰 / 相位 / 声像",
    description: {
      zh: "声像偏移：左右声道电平或时间差会让声音从中心移动到一侧。",
      en: "Stereo shift: level or timing differences move sound away from the center."
    },
    hearing: {
      zh: "听感重点：中心是否偏左或偏右，空间是否稳定。",
      en: "Listen for: whether the center pulls left or right and whether space stays stable."
    }
  }
};

const metricDetails: MetricDetail[] = [
  {
    title: "LUFS",
    summary: {
      zh: "LUFS 是面向人耳感知的节目响度指标，用来描述一段内容整体听起来有多响。",
      en: "LUFS is a perceptual program-loudness metric that describes how loud a full piece of content feels."
    },
    measures: {
      zh: "它关注整体响度、一段时间内的平均响度和响度一致性，常和 True Peak 一起用于交付规范。",
      en: "It focuses on overall loudness, time-averaged loudness, and consistency, often paired with True Peak in delivery specs."
    },
    listening: {
      zh: "LUFS 更接近听众对音量一致性的感受，适合判断视频、播客、直播和音乐节目是否忽大忽小。",
      en: "LUFS maps better to perceived loudness consistency, useful for videos, podcasts, livestreams, and music programs."
    },
    scenes: {
      zh: "常见于流媒体响度归一、视频平台交付、播客制作、广播电视和直播混音。",
      en: "Common in streaming normalization, video delivery, podcast production, broadcast, and livestream mixing."
    },
    misconception: {
      zh: "LUFS 不是瞬时峰值，也不等于 SPL；它不能单独说明音质，只说明响度管理是否合理。",
      en: "LUFS is not instantaneous peak level and is not SPL; it does not define quality by itself, only loudness management."
    }
  },
  {
    title: "SNR",
    summary: {
      zh: "SNR 是信噪比，描述有效信号和噪声底之间相差多少。",
      en: "SNR is signal-to-noise ratio, describing the gap between useful signal and the noise floor."
    },
    measures: {
      zh: "它衡量目标声音相对底噪、嘶声、电源噪声或环境噪声的优势，通常用 dB 表示。",
      en: "It measures how much the target sound rises above hiss, power noise, or environmental noise, usually in dB."
    },
    listening: {
      zh: "SNR 低时，安静段更容易听到底噪，人声清晰度下降，录音会显得不干净。",
      en: "Low SNR makes hiss obvious in quiet parts, reduces speech clarity, and makes recordings feel dirty."
    },
    scenes: {
      zh: "常见于麦克风、ADC、录音环境、耳放底噪、远场语音和会议拾音评估。",
      en: "Common for microphones, ADCs, recording rooms, headphone-amp hiss, far-field voice, and conferencing capture."
    },
    misconception: {
      zh: "SNR 高不代表整体音质一定好；频响、失真、动态和空间声学仍然会影响最终听感。",
      en: "High SNR does not guarantee overall quality; frequency response, distortion, dynamics, and acoustics still matter."
    }
  },
  {
    title: "THD+N",
    summary: {
      zh: "THD+N 表示总谐波失真加噪声，用来观察系统是否产生额外谐波和杂散噪声。",
      en: "THD+N means total harmonic distortion plus noise, showing added harmonics and stray noise."
    },
    measures: {
      zh: "它把非线性失真产生的谐波和噪声一起统计，常用于功放、扬声器、DAC 和麦克风链路。",
      en: "It combines nonlinear harmonic distortion and noise, often used for amplifiers, speakers, DACs, and microphone chains."
    },
    listening: {
      zh: "过高时可能听到破音、毛刺、粗糙感和刺耳边缘，低频大音量时尤其明显。",
      en: "When too high, it can sound clipped, gritty, rough, or harsh, especially at loud bass levels."
    },
    scenes: {
      zh: "常见于小音箱极限响度、功放过载、数字削波、麦克风前级过载和扬声器保护评估。",
      en: "Common in small-speaker loudness limits, amplifier overload, digital clipping, mic preamp overload, and speaker protection."
    },
    misconception: {
      zh: "THD+N 数字越低通常越干净，但少量谐波不一定总是坏事；音乐制作里有时会主动加入饱和感。",
      en: "Lower THD+N is usually cleaner, but a little harmonic content is not always bad; music production may add saturation intentionally."
    }
  },
  {
    title: "RT60",
    summary: {
      zh: "RT60 是混响衰减 60 dB 所需时间，用来描述空间声音拖尾长短。",
      en: "RT60 is the time reverberation takes to decay by 60 dB, describing the length of a room's sound tail."
    },
    measures: {
      zh: "它衡量房间反射能量消失速度，和空间大小、墙面吸收、家具、人群和材料有关。",
      en: "It measures how fast reflected energy fades, depending on room size, absorption, furniture, people, and materials."
    },
    listening: {
      zh: "RT60 过长会让语音含糊、音乐糊成一团；过短则可能显得干、近、缺少空间感。",
      en: "Too long makes speech blurry and music smeared; too short can feel dry, close, and lacking space."
    },
    scenes: {
      zh: "常见于会议室、录音棚、教室、车舱、智能音箱远场拾音和家庭影院调校。",
      en: "Common for meeting rooms, studios, classrooms, car cabins, smart-speaker far-field pickup, and home theater tuning."
    },
    misconception: {
      zh: "RT60 不是越短越好；语音、音乐和沉浸式内容需要的空间感目标不同。",
      en: "Shorter RT60 is not always better; speech, music, and immersive content need different spatial goals."
    }
  }
];

function createMetricPath(effect: ListeningEffect, intensity: number) {
  const x = 76;
  const width = 608;
  const midY = 120;
  const amount = intensity / 100;

  return Array.from({ length: 96 }, (_, index) => {
    const ratio = index / 95;
    const pointX = x + ratio * width;
    let y = midY;

    if (effect === "brightness") {
      const lift = Math.max(0, (ratio - 0.52) / 0.48);
      y = midY - lift ** 1.35 * amount * 72;
    } else if (effect === "muddy") {
      const lowMidBump = Math.exp(-((ratio - 0.28) ** 2) / 0.012);
      const highLoss = Math.max(0, (ratio - 0.58) / 0.42);
      y = midY - lowMidBump * amount * 58 + highLoss ** 1.3 * amount * 28;
    } else if (effect === "noise") {
      y = 210 - amount * 74 + Math.sin(ratio * Math.PI * 24) * 5;
    } else if (effect === "distortion") {
      y = midY - Math.sin(ratio * Math.PI * 8) * (20 + amount * 42);
    } else if (effect === "compression") {
      y = midY - Math.sin(ratio * Math.PI * 5) * (80 - amount * 54);
    } else {
      y = midY - Math.sin(ratio * Math.PI * 2) * 18 - amount * 48;
    }

    const clampedY = Math.min(196, Math.max(36, y));
    return `${index === 0 ? "M" : "L"} ${pointX.toFixed(2)} ${clampedY.toFixed(2)}`;
  }).join(" ");
}

function createListeningWavePath({
  amplitude = 34,
  centerY = 130,
  cycles = 5,
  phase = 0,
  points = 90,
  width = 660,
  x = 50
}: {
  amplitude?: number;
  centerY?: number;
  cycles?: number;
  phase?: number;
  points?: number;
  width?: number;
  x?: number;
}) {
  return Array.from({ length: points }, (_, index) => {
    const ratio = index / (points - 1);
    const pointX = x + ratio * width;
    const value =
      Math.sin(ratio * Math.PI * cycles + phase) * 0.78 +
      Math.sin(ratio * Math.PI * cycles * 2.4 + phase * 0.7) * 0.22;
    const pointY = centerY - value * amplitude;

    return `${index === 0 ? "M" : "L"} ${pointX.toFixed(2)} ${pointY.toFixed(2)}`;
  }).join(" ");
}

function createPureSinePath({
  amplitude = 34,
  centerY = 130,
  cycles = 4,
  phase = 0,
  points = 128,
  width = 660,
  x = 50
}: {
  amplitude?: number;
  centerY?: number;
  cycles?: number;
  phase?: number;
  points?: number;
  width?: number;
  x?: number;
}) {
  return Array.from({ length: points }, (_, index) => {
    const ratio = index / (points - 1);
    const pointX = x + ratio * width;
    const pointY = centerY - Math.sin(ratio * Math.PI * 2 * cycles + phase) * amplitude;

    return `${index === 0 ? "M" : "L"} ${pointX.toFixed(2)} ${pointY.toFixed(2)}`;
  }).join(" ");
}

function createNoiseBandPath(intensity: number) {
  const amount = intensity / 100;
  const width = 660;
  const x = 50;
  const baseline = 214 - amount * 42;
  const thickness = 8 + amount * 38;
  const topPoints = Array.from({ length: 72 }, (_, index) => {
    const ratio = index / 71;
    const pointX = x + ratio * width;
    const texture = Math.sin(ratio * Math.PI * 37) * 3.4 + Math.sin(ratio * Math.PI * 91) * 1.8;
    const pointY = baseline - thickness / 2 + texture * amount;

    return `${index === 0 ? "M" : "L"} ${pointX.toFixed(2)} ${pointY.toFixed(2)}`;
  });
  const bottomPoints = Array.from({ length: 72 }, (_, index) => {
    const ratio = 1 - index / 71;
    const pointX = x + ratio * width;
    const texture = Math.cos(ratio * Math.PI * 43) * 3.2 + Math.sin(ratio * Math.PI * 83) * 1.6;
    const pointY = baseline + thickness / 2 + texture * amount;

    return `L ${pointX.toFixed(2)} ${pointY.toFixed(2)}`;
  });

  return `${topPoints.join(" ")} ${bottomPoints.join(" ")} Z`;
}

function createNoisySignalPath(intensity: number) {
  const amount = intensity / 100;
  const width = 660;
  const x = 50;
  const centerY = 130;

  return Array.from({ length: 96 }, (_, index) => {
    const ratio = index / 95;
    const pointX = x + ratio * width;
    const clean =
      Math.sin(ratio * Math.PI * 4.8) * 0.78 +
      Math.sin(ratio * Math.PI * 11.5 + 0.6) * 0.22;
    const noise =
      Math.sin(ratio * Math.PI * 63) * 0.34 +
      Math.sin(ratio * Math.PI * 97 + 0.8) * 0.22 +
      Math.sin(ratio * Math.PI * 151 + 1.3) * 0.14;
    const pointY = centerY - clean * 28 - noise * amount * 22;

    return `${index === 0 ? "M" : "L"} ${pointX.toFixed(2)} ${pointY.toFixed(2)}`;
  }).join(" ");
}

function createSnrWavePath({
  amplitude,
  centerY,
  noiseAmount,
  width,
  x
}: {
  amplitude: number;
  centerY: number;
  noiseAmount: number;
  width: number;
  x: number;
}) {
  return Array.from({ length: 96 }, (_, index) => {
    const ratio = index / 95;
    const pointX = x + ratio * width;
    const clean =
      Math.sin(ratio * Math.PI * 5.2) * 0.78 +
      Math.sin(ratio * Math.PI * 10.6 + 0.4) * 0.22;
    const noise =
      Math.sin(ratio * Math.PI * 61 + 0.2) * 0.42 +
      Math.sin(ratio * Math.PI * 107 + 0.9) * 0.25;
    const pointY = centerY - clean * amplitude - noise * noiseAmount * 18;

    return `${index === 0 ? "M" : "L"} ${pointX.toFixed(1)} ${pointY.toFixed(1)}`;
  }).join(" ");
}

function createToneComparisonPath(effect: "brightness" | "muddy", intensity: number, processed: boolean) {
  const amount = intensity / 100;
  const width = 260;
  const x = processed ? 410 : 76;
  const centerY = 242;
  const amplitude = 17;

  return Array.from({ length: 128 }, (_, index) => {
    const ratio = index / 127;
    const pointX = x + ratio * width;
    const low = Math.sin(ratio * Math.PI * 4.2) * 0.54;
    const mid = Math.sin(ratio * Math.PI * 9.2 + 0.25) * 0.28;
    const high = Math.sin(ratio * Math.PI * 44 + 0.7) * 0.18;
    let value = low + mid + high * 0.65;

    if (processed && effect === "brightness") {
      value = low * Math.max(0.7, 0.92 - amount * 0.16) + mid * 0.92 + high * (1.1 + amount * 3.1);
    }

    if (processed && effect === "muddy") {
      value = low * (1 + amount * 1.15) + mid * (1 + amount * 0.74) + high * Math.max(0.08, 0.55 - amount * 0.5);
    }

    const pointY = centerY - value * amplitude;

    return `${index === 0 ? "M" : "L"} ${pointX.toFixed(2)} ${pointY.toFixed(2)}`;
  }).join(" ");
}

function ToneFrequencyAxes({ language }: { language: Language }) {
  const x = 76;
  const y = 120;
  const width = 608;
  const height = 82;
  const ticks = [
    { label: language === "zh" ? "低频" : "Low", x: 76 },
    { label: language === "zh" ? "中频" : "Mid", x: 338 },
    { label: language === "zh" ? "高频" : "High", x: 684 }
  ];
  const gainTicks = [
    { label: "+12 dB", y: y - height },
    { label: "0 dB", y },
    { label: "-12 dB", y: y + height }
  ];

  return (
    <g className="listening-tone-axis">
      <line data-testid="listening-frequency-x-axis" x1={x} x2={x + width} y1={y} y2={y} />
      <line data-testid="listening-level-y-axis" x1={x} x2={x} y1={y - height} y2={y + height} />
      {ticks.map((tick) => (
        <g key={tick.label}>
          <line x1={tick.x} x2={tick.x} y1={y - 6} y2={y + 6} />
          <text className="lab-chip" textAnchor="middle" x={tick.x} y={y + 26}>{tick.label}</text>
        </g>
      ))}
      {gainTicks.map((tick) => (
        <g key={tick.label}>
          <line className="faint" x1={x - 6} x2={x + width} y1={tick.y} y2={tick.y} />
          <text className="lab-chip" textAnchor="end" x={x - 12} y={tick.y + 4}>{tick.label}</text>
        </g>
      ))}
      <text className="lab-chip" x="532" y="182">{language === "zh" ? "横轴：频率" : "X: frequency"}</text>
      <text className="lab-chip" x="92" y="34">{language === "zh" ? "纵轴：增益 dB" : "Y: gain dB"}</text>
    </g>
  );
}

function ToneWaveAxes({
  language,
  prefix,
  x
}: {
  language: Language;
  prefix: "clean" | "processed";
  x: number;
}) {
  const width = 260;
  const midY = 242;
  const height = 26;
  const tickYs = [
    { label: "+A", y: midY - height },
    { label: "0", y: midY },
    { label: "-A", y: midY + height }
  ];

  return (
    <g className="listening-wave-axis">
      <line data-testid={`listening-${prefix}-time-axis`} x1={x} x2={x + width} y1={midY} y2={midY} />
      <line data-testid={`listening-${prefix}-amplitude-axis`} x1={x} x2={x} y1={midY - height} y2={midY + height} />
      {[x, x + width / 2, x + width].map((tickX) => (
        <line key={tickX} x1={tickX} x2={tickX} y1={midY - 4} y2={midY + 4} />
      ))}
      {tickYs.map((tick) => (
        <g key={tick.label}>
          <line x1={x - 4} x2={x + 4} y1={tick.y} y2={tick.y} />
          <text className="lab-chip" textAnchor="end" x={x - 8} y={tick.y + 4}>
            {tick.label}
          </text>
        </g>
      ))}
      <text className="lab-chip" textAnchor="middle" x={x + width / 2} y="292">
        {language === "zh" ? "横轴：时间" : "X: time"}
      </text>
      <text className="lab-chip" textAnchor="middle" transform={`translate(${x - 34} ${midY}) rotate(-90)`}>
        {language === "zh" ? "纵轴：幅度" : "Y: amplitude"}
      </text>
    </g>
  );
}

function createDistortionPath(intensity: number) {
  const amount = intensity / 100;
  const harmonics = getDistortionHarmonics(intensity);
  const width = 660;
  const centerY = 130;
  const amplitude = 34 + amount * 12;
  const baseCycles = 4;
  const normalizer = 1 + amount * 0.34;

  return Array.from({ length: 128 }, (_, index) => {
    const ratio = index / 127;
    const x = 50 + ratio * width;
    const summed = harmonics.reduce(
      (total, harmonic) =>
        total + Math.sin(ratio * Math.PI * 2 * baseCycles * harmonic.order + harmonic.phase) * harmonic.gain,
      0
    );
    const y = centerY - (summed / normalizer) * amplitude;

    return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(" ");
}

function getDistortionHarmonics(intensity: number): HarmonicComponent[] {
  const amount = intensity / 100;
  const harmonics: HarmonicComponent[] = [{ gain: 1, order: 1, phase: 0 }];

  if (amount > 0) {
    harmonics.push(
      { gain: amount * 0.3, order: 2, phase: Math.PI * 0.08 },
      { gain: amount * 0.24, order: 3, phase: -Math.PI * 0.06 }
    );
  }

  if (amount >= 0.35) {
    harmonics.push({ gain: (amount - 0.26) * 0.24, order: 5, phase: Math.PI * 0.12 });
  }

  if (amount >= 0.8) {
    harmonics.push({ gain: (amount - 0.7) * 0.2, order: 7, phase: -Math.PI * 0.1 });
  }

  return harmonics;
}

function getHarmonicComponentLayout(total: number, index: number) {
  const gap = 22;
  const totalWidth = 608;
  const width = (totalWidth - gap * (total - 1)) / total;
  const x = 76 + index * (width + gap);

  return { width, x };
}

function createHarmonicComponentPath(component: HarmonicComponent, index: number, total: number) {
  const layout = getHarmonicComponentLayout(total, index);
  const amplitude = component.order === 1 ? 9 : component.gain * 76;

  return createPureSinePath({
    amplitude,
    centerY: 232,
    cycles: component.order,
    phase: component.phase,
    points: 58,
    width: layout.width,
    x: layout.x
  });
}

function getCompressionVisualSettings(intensity: number) {
  const amount = intensity / 100;

  return {
    amplitude: 72,
    centerY: 130,
    ratio: 1 + amount * 11,
    threshold: 0.34 + (1 - amount) * 0.34
  };
}

function getCompressionSourceSample(ratio: number) {
  const envelope =
    0.2 +
    Math.exp(-((ratio - 0.18) ** 2) / 0.0035) * 0.78 +
    Math.exp(-((ratio - 0.48) ** 2) / 0.006) * 0.58 +
    Math.exp(-((ratio - 0.78) ** 2) / 0.0045) * 0.72;
  const carrier =
    Math.sin(ratio * Math.PI * 28) * 0.82 +
    Math.sin(ratio * Math.PI * 56 + 0.35) * 0.12;

  return carrier * Math.min(1, envelope);
}

function compressNormalizedSample(sample: number, threshold: number, ratio: number) {
  const sign = Math.sign(sample);
  const magnitude = Math.abs(sample);
  const compressedMagnitude = magnitude <= threshold ? magnitude : threshold + (magnitude - threshold) / ratio;

  return sign * compressedMagnitude;
}

function createCompressionEnvelopePath(intensity: number, compressed: boolean) {
  const settings = getCompressionVisualSettings(intensity);

  return Array.from({ length: 160 }, (_, index) => {
    const ratio = index / 159;
    const x = 50 + ratio * 660;
    const input = getCompressionSourceSample(ratio);
    const output = compressed ? compressNormalizedSample(input, settings.threshold, settings.ratio) : input;
    const y = settings.centerY - output * settings.amplitude;

    return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(" ");
}

function getCompressionGainMarker(intensity: number) {
  const settings = getCompressionVisualSettings(intensity);
  let peak = { ratio: 0, sample: 0 };

  for (let index = 0; index < 160; index += 1) {
    const ratio = index / 159;
    const sample = getCompressionSourceSample(ratio);

    if (sample > peak.sample) {
      peak = { ratio, sample };
    }
  }

  const compressed = compressNormalizedSample(peak.sample, settings.threshold, settings.ratio);

  return {
    inputY: settings.centerY - peak.sample * settings.amplitude,
    outputY: settings.centerY - compressed * settings.amplitude,
    x: 50 + peak.ratio * 660
  };
}

function createStereoChannelPath(intensity: number, channel: "left" | "right") {
  const amount = intensity / 100;
  const pan = amount * 0.85;
  const channelGain = channel === "left" ? 1 - pan * 0.58 : 1 + pan * 0.34;
  const centerY = channel === "left" ? 100 : 184;

  return createListeningWavePath({
    amplitude: 28 * channelGain,
    centerY,
    cycles: 6.2,
    phase: 0
  });
}

function createDistortionCurve(amount: number) {
  const samples = 512;
  const curve = new Float32Array(samples);
  const drive = 1 + amount * 34;
  const wet = amount;

  for (let index = 0; index < samples; index += 1) {
    const x = (index * 2) / (samples - 1) - 1;
    const shaped = Math.tanh(x * drive);
    curve[index] = x * (1 - wet) + shaped * wet;
  }

  return curve;
}

function createNoiseBuffer(context: AudioContext, amount: number) {
  const sampleRate = context.sampleRate || 44100;
  const frameCount = Math.floor(sampleRate * 0.1);
  const buffer = context.createBuffer(1, frameCount, sampleRate);
  const data = buffer.getChannelData(0);

  for (let index = 0; index < frameCount; index += 1) {
    data[index] = (Math.random() * 2 - 1) * amount;
  }

  return buffer;
}

function ListeningEffectChart({
  effect,
  intensity,
  language
}: {
  effect: ListeningEffect;
  intensity: number;
  language: Language;
}) {
  if (effect === "noise") {
    return (
      <>
        <path
          className="listening-noise-band"
          data-testid="listening-noise-band"
          d={createNoiseBandPath(intensity)}
        />
        <path
          className="listening-metric-path"
          data-testid="listening-noise-signal"
          d={createListeningWavePath({ amplitude: 28, centerY: 130, cycles: 4.8 })}
        />
        <path
          className="listening-noisy-signal"
          data-testid="listening-noisy-signal"
          d={createNoisySignalPath(intensity)}
        />
        <text className="lab-chip" x="92" y="92">Clean signal</text>
        <text className="lab-chip" x="428" y="92">Signal + noise</text>
        <text className="lab-chip" data-testid="listening-noise-floor-label" x="560" y="286">Noise floor</text>
      </>
    );
  }

  if (effect === "compression") {
    const settings = getCompressionVisualSettings(intensity);
    const thresholdOffset = settings.threshold * settings.amplitude;
    const positiveThresholdY = settings.centerY - thresholdOffset;
    const negativeThresholdY = settings.centerY + thresholdOffset;
    const gainMarker = getCompressionGainMarker(intensity);

    return (
      <>
        <line
          className="listening-compression-threshold"
          data-testid="listening-compression-threshold-positive"
          x1="50"
          x2="710"
          y1={positiveThresholdY.toFixed(2)}
          y2={positiveThresholdY.toFixed(2)}
        />
        <line
          className="listening-compression-threshold"
          data-testid="listening-compression-threshold-negative"
          x1="50"
          x2="710"
          y1={negativeThresholdY.toFixed(2)}
          y2={negativeThresholdY.toFixed(2)}
        />
        <path
          className="listening-envelope-input"
          data-testid="listening-input-envelope"
          d={createCompressionEnvelopePath(intensity, false)}
        />
        <path
          className="listening-envelope-output"
          data-testid="listening-compressed-envelope"
          d={createCompressionEnvelopePath(intensity, true)}
        />
        <line
          className="listening-compression-gain-reduction"
          data-testid="listening-compression-gain-reduction"
          x1={gainMarker.x.toFixed(2)}
          x2={gainMarker.x.toFixed(2)}
          y1={gainMarker.inputY.toFixed(2)}
          y2={gainMarker.outputY.toFixed(2)}
        />
        <text className="lab-chip" x="76" y="62">Input waveform</text>
        <text className="lab-chip" x="248" y="62">Compressed waveform</text>
        <text className="lab-chip" x="570" y={Math.max(72, positiveThresholdY - 10).toFixed(2)}>Threshold</text>
        <text className="lab-chip" x={Math.min(548, gainMarker.x + 16).toFixed(2)} y={((gainMarker.inputY + gainMarker.outputY) / 2).toFixed(2)}>
          Gain reduction
        </text>
      </>
    );
  }

  if (effect === "stereo") {
    return (
      <>
        <path
          className="listening-stereo-left"
          data-testid="listening-stereo-left"
          d={createStereoChannelPath(intensity, "left")}
        />
        <path
          className="listening-stereo-right"
          data-testid="listening-stereo-right"
          d={createStereoChannelPath(intensity, "right")}
        />
        <text className="lab-chip" x="70" y="74">L</text>
        <text className="lab-chip" x="70" y="158">R</text>
        <text className="lab-chip" data-testid="listening-stereo-pan-label" x="528" y="284">Pan: center → right</text>
      </>
    );
  }

  if (effect === "distortion") {
    const harmonics = getDistortionHarmonics(intensity);
    const harmonicLabel = harmonics.map((harmonic) => `${harmonic.order}f`).join(" + ");

    return (
      <>
        <path
          className="listening-clean-wave"
          data-testid="listening-clean-wave"
          d={createPureSinePath({ amplitude: 34, centerY: 130, cycles: 4 })}
        />
        <path
          className="listening-processed-wave"
          data-testid="listening-harmonic-sum"
          d={createDistortionPath(intensity)}
        />
        <text className="lab-chip" x="76" y="82">{language === "zh" ? "纯净基波输入" : "Clean fundamental input"}</text>
        <text className="lab-chip" x="476" y="82">{language === "zh" ? "基波 + 谐波叠加输出" : "Fundamental + harmonic sum"}</text>
        <text className="lab-chip" x="76" y="206">{language === "zh" ? "谐波分量拆解" : "Harmonic components"}</text>
        {harmonics.map((harmonic, index) => {
          const layout = getHarmonicComponentLayout(harmonics.length, index);

          return (
            <g key={harmonic.order}>
              <path
                className="listening-harmonic-component"
                data-testid={`listening-harmonic-${harmonic.order}`}
                d={createHarmonicComponentPath(harmonic, index, harmonics.length)}
              />
              <text
                className="lab-chip listening-harmonic-label"
                textAnchor="middle"
                x={layout.x + layout.width / 2}
                y="266"
              >
                {harmonic.order}f
              </text>
            </g>
          );
        })}
        <text className="lab-chip" x="76" y="286">{harmonicLabel}</text>
      </>
    );
  }

  if (effect === "brightness" || effect === "muddy") {
    return (
      <>
        <rect
          className="listening-tone-emphasis-band"
          data-testid="listening-tone-emphasis-band"
          height={effect === "brightness" ? 126 : 116}
          rx="8"
          width={effect === "brightness" ? 172 : 190}
          x={effect === "brightness" ? 512 : 174}
          y={effect === "brightness" ? 44 : 52}
        />
        <ToneFrequencyAxes language={language} />
        <path
          className="listening-metric-path"
          data-testid="listening-metric-response"
          d={createMetricPath(effect, intensity)}
        />
        <ToneWaveAxes language={language} prefix="clean" x={76} />
        <ToneWaveAxes language={language} prefix="processed" x={410} />
        <path
          className="listening-clean-wave"
          data-testid="listening-clean-wave"
          d={createToneComparisonPath(effect, intensity, false)}
        />
        <path
          className="listening-processed-wave"
          data-testid="listening-processed-wave"
          d={createToneComparisonPath(effect, intensity, true)}
        />
        <text className="lab-chip" x="78" y="274">Clean wave</text>
        <text className="lab-chip" x="410" y="274">
          {effect === "brightness" ? "Treble boosted" : "Low-mid buildup"}
        </text>
        <text className="lab-chip" x={effect === "brightness" ? "526" : "188"} y={effect === "brightness" ? "56" : "64"}>
          {effect === "brightness"
            ? language === "zh"
              ? "高频提升区"
              : "Treble boost zone"
            : language === "zh"
              ? "低中频堆积区"
              : "Low-mid buildup zone"}
        </text>
      </>
    );
  }

  return (
    <path
      className="listening-metric-path"
      data-testid="listening-metric-response"
      d={createMetricPath(effect, intensity)}
    />
  );
}

function SnrComparisonChart({ language }: { language: Language }) {
  const goodWave = createSnrWavePath({ amplitude: 34, centerY: 106, noiseAmount: 0.18, width: 270, x: 60 });
  const poorWave = createSnrWavePath({ amplitude: 24, centerY: 106, noiseAmount: 0.92, width: 270, x: 430 });

  return (
    <svg
      aria-label={language === "zh" ? "SNR 良好与较差波形对比图" : "Good and poor SNR waveform comparison"}
      className="listening-snr-chart"
      role="img"
      viewBox="0 0 760 260"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect className="lab-diagram-bg" height="260" rx="14" width="760" />
      <line className="lab-axis" x1="54" x2="340" y1="106" y2="106" />
      <line className="lab-axis" x1="424" x2="710" y1="106" y2="106" />
      <rect className="listening-snr-good-floor" height="16" rx="8" width="286" x="54" y="176" />
      <rect className="listening-snr-poor-floor" height="50" rx="10" width="286" x="424" y="146" />
      <path className="listening-snr-good-wave" data-testid="snr-good-wave" d={goodWave} />
      <path className="listening-snr-poor-wave" data-testid="snr-poor-wave" d={poorWave} />
      <path className="listening-snr-gap good" d="M 354 84 V 184" />
      <path className="listening-snr-gap poor" d="M 724 92 V 170" />
      <text className="lab-label" x="58" y="42">{language === "zh" ? "SNR 良好：信号明显高于噪声底" : "Good SNR: signal sits clearly above noise"}</text>
      <text className="lab-label" x="428" y="42">{language === "zh" ? "SNR 较差：噪声底接近有效信号" : "Poor SNR: noise floor approaches signal"}</text>
      <text className="lab-chip" x="62" y="214">{language === "zh" ? "底噪低，安静段更干净" : "Low floor, cleaner quiet parts"}</text>
      <text className="lab-chip" x="432" y="214">{language === "zh" ? "底噪高，嘶声更明显" : "High floor, hiss is obvious"}</text>
    </svg>
  );
}

function getCompressionSettings(amount: number) {
  return {
    attack: 0.004 + (1 - amount) * 0.018,
    knee: 16 - amount * 10,
    ratio: 1 + amount * 14,
    release: 0.22 - amount * 0.12,
    threshold: -10 - amount * 28
  };
}

function applyLiveIntensity(graph: ActiveAudioGraph, amount: number) {
  const now = graph.context.currentTime;

  graph.filter.Q.setValueAtTime(0.9 + amount, now);

  if (graph.effect === "brightness" || graph.effect === "muddy") {
    graph.filter.gain.setValueAtTime(amount * 16, now);
  }

  if (graph.shaper) {
    graph.shaper.curve = createDistortionCurve(amount);
  }

  if (graph.compressor) {
    const settings = getCompressionSettings(amount);
    graph.compressor.threshold.setValueAtTime(settings.threshold, now);
    graph.compressor.knee.setValueAtTime(settings.knee, now);
    graph.compressor.ratio.setValueAtTime(settings.ratio, now);
    graph.compressor.attack.setValueAtTime(settings.attack, now);
    graph.compressor.release.setValueAtTime(settings.release, now);
  }

  if (graph.panner) {
    graph.panner.pan.setValueAtTime(graph.effect === "stereo" ? amount * 0.9 : 0, now);
  }

  if (graph.noiseGain) {
    graph.noiseGain.gain.setValueAtTime(0.014 + amount * 0.04, now);
  }
}

export function ListeningMetricsLab({ language, onBack }: ListeningMetricsLabProps) {
  const [activeEffect, setActiveEffect] = useState<ListeningEffect>("brightness");
  const [intensity, setIntensity] = useState(55);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<MetricDetail | null>(null);
  const audioRef = useRef<ActiveAudioGraph | null>(null);
  const activeCopy = effectCopy[activeEffect];
  const chartAxisLabel =
    activeEffect === "distortion"
      ? language === "zh"
        ? "时间 / 谐波分量"
        : "Time / harmonic components"
      : activeEffect === "brightness" || activeEffect === "muddy"
      ? language === "zh"
        ? "低频 → 高频"
        : "Low → high"
      : language === "zh"
        ? "时间 / 声道示意"
        : "Time / channel view";
  const chartAxisLabelY = activeEffect === "brightness" || activeEffect === "muddy" ? 292 : activeEffect === "distortion" ? 288 : 256;
  const showAxisGuideLabel = activeEffect !== "brightness" && activeEffect !== "muddy";
  const showGenericChartGuides = activeEffect !== "brightness" && activeEffect !== "muddy";

  function stopAudio() {
    if (audioRef.current) {
      void audioRef.current.context.close();
      audioRef.current = null;
    }
    setIsPlaying(false);
  }

  function handleIntensityChange(nextIntensity: number) {
    setIntensity(nextIntensity);

    if (audioRef.current) {
      applyLiveIntensity(audioRef.current, nextIntensity / 100);
    }
  }

  function playAudio() {
    stopAudio();
    const AudioContextConstructor = window.AudioContext ?? window.webkitAudioContext;

    if (!AudioContextConstructor) {
      return;
    }

    const context = new AudioContextConstructor();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const filter = context.createBiquadFilter();
    const outputGain = context.createGain();
    const panner = context.createStereoPanner ? context.createStereoPanner() : null;
    let shaper: WaveShaperNode | undefined;
    let compressor: DynamicsCompressorNode | undefined;
    let noiseGain: GainNode | undefined;
    const now = context.currentTime;
    const amount = intensity / 100;

    oscillator.type = activeEffect === "distortion" ? "sine" : activeEffect === "compression" ? "triangle" : "sawtooth";
    oscillator.frequency.setValueAtTime(activeEffect === "muddy" ? 180 : activeEffect === "compression" ? 220 : 330, now);
    filter.type = activeEffect === "brightness" ? "highshelf" : activeEffect === "muddy" ? "lowshelf" : "peaking";
    filter.frequency.setValueAtTime(activeEffect === "brightness" ? 3600 : activeEffect === "muddy" ? 260 : 900, now);
    filter.gain.setValueAtTime(activeEffect === "brightness" || activeEffect === "muddy" ? amount * 16 : 0, now);
    filter.Q.setValueAtTime(0.9 + amount, now);
    gain.gain.setValueAtTime(0.0001, now);
    if (activeEffect === "compression") {
      gain.gain.linearRampToValueAtTime(0.28, now + 0.08);
      gain.gain.linearRampToValueAtTime(0.035, now + 0.24);
      gain.gain.linearRampToValueAtTime(0.32, now + 0.4);
      gain.gain.linearRampToValueAtTime(0.04, now + 0.58);
      gain.gain.linearRampToValueAtTime(0.26, now + 0.72);
      gain.gain.linearRampToValueAtTime(0.055, now + 0.9);
      gain.gain.linearRampToValueAtTime(0.22, now + 1.04);
      gain.gain.linearRampToValueAtTime(0.04, now + 1.22);
      gain.gain.linearRampToValueAtTime(0.0001, now + 1.5);
    } else {
      gain.gain.linearRampToValueAtTime(0.08, now + 0.04);
      gain.gain.linearRampToValueAtTime(0.0001, now + 1.1);
    }
    outputGain.gain.setValueAtTime(activeEffect === "compression" ? 1.35 + amount * 0.45 : 0.9, now);

    oscillator.connect(filter);
    let lastNode: AudioNode = filter;

    if (activeEffect === "distortion") {
      shaper = context.createWaveShaper();
      shaper.curve = createDistortionCurve(amount);
      shaper.oversample = "4x";
      lastNode.connect(shaper);
      lastNode = shaper;
    }

    if (activeEffect === "compression") {
      compressor = context.createDynamicsCompressor();
      const settings = getCompressionSettings(amount);
      compressor.threshold.setValueAtTime(settings.threshold, now);
      compressor.knee.setValueAtTime(settings.knee, now);
      compressor.ratio.setValueAtTime(settings.ratio, now);
      compressor.attack.setValueAtTime(settings.attack, now);
      compressor.release.setValueAtTime(settings.release, now);
      lastNode.connect(compressor);
      lastNode = compressor;
    }

    lastNode.connect(gain);
    gain.connect(outputGain);

    if (panner) {
      panner.pan.setValueAtTime(activeEffect === "stereo" ? amount * 0.9 : 0, now);
      outputGain.connect(panner);
      panner.connect(context.destination);
    } else {
      outputGain.connect(context.destination);
    }

    oscillator.start(now);
    oscillator.stop(now + (activeEffect === "compression" ? 1.54 : 1.14));

    if (activeEffect === "noise") {
      const noiseSource = context.createBufferSource();
      noiseGain = context.createGain();
      noiseSource.buffer = createNoiseBuffer(context, amount);
      noiseSource.loop = true;
      noiseGain.gain.setValueAtTime(0.0001, now);
      noiseGain.gain.linearRampToValueAtTime(0.014 + amount * 0.04, now + 0.04);
      noiseGain.gain.linearRampToValueAtTime(0.0001, now + 1.1);
      noiseSource.connect(noiseGain);
      noiseGain.connect(context.destination);
      noiseSource.start(now);
      noiseSource.stop(now + 1.14);
    }

    audioRef.current = {
      compressor,
      context,
      effect: activeEffect,
      filter,
      noiseGain,
      outputGain,
      panner,
      shaper
    };
    setIsPlaying(true);
    window.setTimeout(() => setIsPlaying(false), activeEffect === "compression" ? 1600 : 1200);
  }

  return (
    <main className="listening-lab-page">
      <section className="sound-lab-hero" aria-labelledby="listening-lab-title">
        <button className="sound-lab-back" type="button" onClick={onBack}>
          <ArrowLeft size={18} aria-hidden="true" />
          {language === "zh" ? "返回知识库" : "Back to knowledge base"}
        </button>
        <div>
          <span className="section-kicker">{language === "zh" ? "听感实验" : "Listening lab"}</span>
          <h1 id="listening-lab-title">{language === "zh" ? "听感与指标实验室" : "Listening Metrics Lab"}</h1>
          <p>
            {language === "zh"
              ? "把主观描述、可测指标和可听音效放在一起，理解“听起来如何”背后的工程原因。"
              : "Connect subjective descriptions, measurable metrics, and audible examples to understand engineering causes behind perception."}
          </p>
        </div>
      </section>

      <section className="listening-lab-workbench" aria-label={language === "zh" ? "听感与指标实验台" : "Listening metrics workbench"}>
        <div className="listening-visual">
          <div className="digital-lab-status">
            <strong>{language === "zh" ? `指标：${activeCopy.metric}` : `Metric: ${activeCopy.metric}`}</strong>
            <span>{language === "zh" ? `效果强度：${intensity}%` : `Effect intensity: ${intensity}%`}</span>
          </div>
          <svg
            aria-label={language === "zh" ? "听感与指标效果图" : "Listening metric effect chart"}
            role="img"
            viewBox="0 0 760 300"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="listeningMetricLine" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#7ee7d8" />
                <stop offset="100%" stopColor="#f0b46a" />
              </linearGradient>
            </defs>
            <rect className="lab-diagram-bg" height="300" rx="14" width="760" />
            {showGenericChartGuides ? (
              <>
                <line className="lab-axis" x1="50" x2="710" y1="130" y2="130" />
                <line className="lab-axis faint" x1="50" x2="710" y1="58" y2="58" />
                <line className="lab-axis faint" x1="50" x2="710" y1="210" y2="210" />
              </>
            ) : null}
            <ListeningEffectChart effect={activeEffect} intensity={intensity} language={language} />
            {showGenericChartGuides ? <text className="lab-label" x="54" y="42">{activeCopy.metric}</text> : null}
            {showAxisGuideLabel ? (
              <text className="lab-chip" data-testid="listening-axis-guide-label" x="520" y={chartAxisLabelY}>{chartAxisLabel}</text>
            ) : null}
          </svg>
          {activeEffect === "noise" ? <SnrComparisonChart language={language} /> : null}
        </div>

        <div className="listening-panel">
          <div className="listening-effect-grid" role="group" aria-label={language === "zh" ? "听感效果" : "Listening effects"}>
            {(Object.keys(effectCopy) as ListeningEffect[]).map((effect) => (
              <button
                className={activeEffect === effect ? "waveform-tab active" : "waveform-tab"}
                key={effect}
                type="button"
                onClick={() => setActiveEffect(effect)}
              >
                {effectCopy[effect].label[language]}
              </button>
            ))}
          </div>

          <div className="sound-lab-actions">
            <button className="sine-button" type="button" onClick={playAudio}>
              <Play size={16} aria-hidden="true" />
              {language === "zh" ? "播放对照音效" : "Play example"}
            </button>
            <button className="sine-button" type="button" onClick={stopAudio}>
              <Pause size={16} aria-hidden="true" />
              {language === "zh" ? "停止" : "Stop"}
            </button>
            <span className={isPlaying ? "sine-status playing" : "sine-status"}>
              {isPlaying ? (language === "zh" ? "播放中" : "Playing") : language === "zh" ? "未播放" : "Stopped"}
            </span>
          </div>

          <div className="lab-sliders">
            <label>
              <span>
                {language === "zh" ? "效果强度" : "Effect intensity"}
                <strong>{intensity}%</strong>
              </span>
              <input
                aria-label={language === "zh" ? "效果强度" : "Effect intensity"}
                max="100"
                min="0"
                step="5"
                type="range"
                value={intensity}
                onChange={(event) => handleIntensityChange(Number(event.target.value))}
              />
            </label>
          </div>

          <div className="lab-live-note">
            <strong>{activeCopy.description[language]}</strong>
            <span>{activeCopy.hearing[language]}</span>
          </div>
        </div>
      </section>

      <section className="listening-metric-cards" aria-label={language === "zh" ? "指标速查" : "Metric cheat sheet"}>
        {metricDetails.map((metric) => (
          <button
            className="metric-card-button"
            key={metric.title}
            type="button"
            onClick={() => setSelectedMetric(metric)}
          >
            <h2>{metric.title}</h2>
            <p>{metric.summary[language]}</p>
          </button>
        ))}
      </section>

      {selectedMetric ? (
        <div className="metric-modal-layer">
          <button
            aria-label={language === "zh" ? "关闭指标详情" : "Close metric details"}
            className="metric-modal-backdrop"
            type="button"
            onClick={() => setSelectedMetric(null)}
          />
          <section
            aria-label={language === "zh" ? `${selectedMetric.title} 详细介绍` : `${selectedMetric.title} details`}
            aria-modal="true"
            className="metric-modal"
            role="dialog"
          >
            <div className="metric-modal-header">
              <span className="section-kicker">{language === "zh" ? "指标详情" : "Metric details"}</span>
              <h2>{language === "zh" ? `${selectedMetric.title} 详细介绍` : `${selectedMetric.title} details`}</h2>
            </div>
            <div className="metric-modal-grid">
              <article>
                <h3>{language === "zh" ? "是什么" : "What it is"}</h3>
                <p>{selectedMetric.summary[language]}</p>
              </article>
              <article>
                <h3>{language === "zh" ? "测量什么" : "What it measures"}</h3>
                <p>{selectedMetric.measures[language]}</p>
              </article>
              <article>
                <h3>{language === "zh" ? "听感表现" : "Listening cue"}</h3>
                <p>{selectedMetric.listening[language]}</p>
              </article>
              <article>
                <h3>{language === "zh" ? "应用场景" : "Where used"}</h3>
                <p>{selectedMetric.scenes[language]}</p>
              </article>
            </div>
            <div className="metric-modal-warning">
              <h3>{language === "zh" ? "常见误区" : "Common misconception"}</h3>
              <p>{selectedMetric.misconception[language]}</p>
            </div>
            <button className="diagram-open-button" type="button" onClick={() => setSelectedMetric(null)}>
              {language === "zh" ? "关闭指标详情" : "Close metric details"}
            </button>
          </section>
        </div>
      ) : null}
    </main>
  );
}
