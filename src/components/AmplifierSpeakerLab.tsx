import { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";

import type { Language } from "../content/knowledge";

type DiagramMode = "amplifier" | "speaker" | "enclosure" | "matching";
type AmpClass = "class-a" | "class-ab" | "class-d";
type EffectMode = "clipping" | "harmonics" | "bass-loss" | "cabinet-resonance" | "limiter";

type EffectDetail = {
  phenomenon: string;
  cause: string;
  sound: string;
  scenario: string;
  fix: string;
};

type PlaybackHandle = {
  stop: () => void;
};

type AmpPrincipleDetail = {
  principle: string;
  advantage: string;
  caution: string;
  usage: string;
};

type AmplifierSpeakerLabProps = {
  language: Language;
  onBack: () => void;
};

const chainLabels = {
  zh: ["DAC / Codec 输出", "功放", "分频 / 保护", "扬声器单元", "空气声波"],
  en: ["DAC / Codec out", "Amplifier", "Crossover / protection", "Speaker driver", "Air pressure"]
} satisfies Record<Language, string[]>;

const diagramModes: Array<{ id: DiagramMode; label: Record<Language, string> }> = [
  { id: "amplifier", label: { zh: "功放类型", en: "Amplifier class" } },
  { id: "speaker", label: { zh: "扬声器单元", en: "Speaker driver" } },
  { id: "enclosure", label: { zh: "箱体与分频", en: "Enclosure and crossover" } },
  { id: "matching", label: { zh: "匹配关系", en: "Matching" } }
];

const ampClasses: Array<{ id: AmpClass; label: string; copy: Record<Language, string> }> = [
  {
    id: "class-a",
    label: "Class A",
    copy: {
      zh: "Class A：器件几乎一直导通，线性好但效率低",
      en: "Class A: devices conduct almost all the time, with good linearity but low efficiency"
    }
  },
  {
    id: "class-ab",
    label: "Class AB",
    copy: {
      zh: "Class AB：正负半周分担输出，效率和失真折中",
      en: "Class AB: positive and negative halves share output, balancing efficiency and distortion"
    }
  },
  {
    id: "class-d",
    label: "Class D",
    copy: {
      zh: "Class D：用高速开关和 PWM 表示音频，效率高但要关注滤波和 EMI",
      en: "Class D: represents audio with fast switching and PWM, efficient but sensitive to filtering and EMI"
    }
  }
];

const ampPrinciples = {
  "class-a": {
    zh: {
      principle: "基本原理：输出器件始终处在导通区，完整正负半周都由线性放大路径连续处理。",
      advantage: "优势：线性好，交越失真少，声音细节容易保持。",
      caution: "注意：静态电流大，效率低，发热明显。",
      usage: "常见：小功率高保真、耳放、前级或偏重音质的线性电路。"
    },
    en: {
      principle:
        "Principle: the output device stays biased on, so the full positive and negative waveform is handled through a continuous linear path.",
      advantage: "Benefit: good linearity and very little crossover distortion.",
      caution: "Watch out: high idle current, low efficiency, and obvious heat.",
      usage: "Common in: low-power hi-fi, headphone amps, preamps, and linear circuits focused on sound quality."
    }
  },
  "class-ab": {
    zh: {
      principle: "基本原理：正半周和负半周主要由上下两组输出器件分担，并保留少量偏置来减轻交越失真。",
      advantage: "优势：比 Class A 效率高，又比纯 B 类更容易控制交越失真。",
      caution: "注意：偏置设置不好会有交越失真，仍有一定发热。",
      usage: "常见：传统音箱功放、车载功放和较多线性功放。"
    },
    en: {
      principle:
        "Principle: positive and negative halves are mainly shared by upper and lower output devices, with a small bias to reduce crossover distortion.",
      advantage: "Benefit: more efficient than Class A and easier to keep clean than pure Class B.",
      caution: "Watch out: poor biasing causes crossover distortion, and it still produces heat.",
      usage: "Common in: traditional speaker amps, car amplifiers, and many linear power amplifiers."
    }
  },
  "class-d": {
    zh: {
      principle: "基本原理：音频信号先变成 PWM 或类似的高速开关脉冲，输出级只在开/关之间切换，再通过滤波和扬声器还原音频电流。",
      advantage: "优势：效率高、发热低，适合电池供电和小体积设备。",
      caution: "注意：需要输出滤波，并关注 EMI、电源和 PCB 布局。",
      usage: "常见：蓝牙音箱、手机、电视、便携设备和高效率大功率功放。"
    },
    en: {
      principle:
        "Principle: the audio signal is converted into PWM or a similar high-speed switching pulse stream, the output stage switches on/off, then filtering and the speaker recover audio current.",
      advantage: "Benefit: high efficiency and low heat, well suited to battery-powered and compact devices.",
      caution: "Watch out: output filtering, EMI, power supply, and PCB layout matter.",
      usage: "Common in: Bluetooth speakers, phones, TVs, portable devices, and high-efficiency high-power amps."
    }
  }
} satisfies Record<AmpClass, Record<Language, AmpPrincipleDetail>>;

const effects: Array<{
  id: EffectMode;
  label: Record<Language, string>;
  description: Record<Language, string>;
  detail: Record<Language, EffectDetail>;
}> = [
  {
    id: "clipping",
    label: { zh: "削波失真", en: "Clipping" },
    description: { zh: "波峰被压平，声音变硬、刺耳。", en: "Peaks flatten, making sound hard and harsh." },
    detail: {
      zh: {
        phenomenon: "波形峰值被硬性压平，原本圆滑的瞬态变成平顶。",
        cause: "波形超过功放或数字链路允许范围，输出无法继续跟随输入。",
        sound: "听感常见为刺耳、粗糙、瞬态发毛，严重时像破音。",
        scenario: "大音量播放、前级增益过高、低阻抗负载或电池供电余量不足时更常见。",
        fix: "降低增益、提高供电余量、换更合适的功放/扬声器匹配或启用软限幅。"
      },
      en: {
        phenomenon: "Waveform peaks are flattened, turning smooth transients into clipped plateaus.",
        cause: "The waveform exceeds the amplifier or digital path headroom, so output can no longer follow input.",
        sound: "It sounds harsh, rough, and broken on peaks.",
        scenario: "Common at high volume, excessive upstream gain, low-impedance loads, or limited battery headroom.",
        fix: "Reduce gain, improve headroom, match amplifier and speaker, or use soft limiting."
      }
    }
  },
  {
    id: "harmonics",
    label: { zh: "谐波失真", en: "Harmonic distortion" },
    description: { zh: "非线性产生额外倍频成分。", en: "Nonlinearity adds extra multiples of the tone." },
    detail: {
      zh: {
        phenomenon: "原本只有一个频率的信号，会多出二次、三次等倍频成分。",
        cause: "功放输出级、扬声器悬边、磁路或振膜在大信号下不再完全线性。",
        sound: "少量低阶谐波可能只觉得变厚，过多会变浑、变脏或刺耳。",
        scenario: "功放接近最大输出、扬声器大行程运动、低频重放或单元老化时更明显。",
        fix: "降低工作强度、优化单元和箱体、使用失真更低的功放或保护曲线。"
      },
      en: {
        phenomenon: "A tone gains added second, third, and higher harmonic components.",
        cause: "The amplifier stage or speaker mechanics become nonlinear at higher levels.",
        sound: "Small low-order harmonics can sound thicker; too much sounds dirty or harsh.",
        scenario: "More obvious near maximum output, with large driver excursion, heavy bass, or worn drivers.",
        fix: "Reduce level, improve driver/enclosure design, or use a lower-distortion amplifier/protection curve."
      }
    }
  },
  {
    id: "bass-loss",
    label: { zh: "低频不足", en: "Bass loss" },
    description: { zh: "低频被削弱，声音变薄。", en: "Bass is reduced and the sound becomes thin." },
    detail: {
      zh: {
        phenomenon: "低频音量和下潜明显变少，频响在低端提前衰减。",
        cause: "小扬声器振膜面积、行程和箱体容积有限，低频无法产生足够声压。",
        sound: "鼓和贝斯缺少重量，人声可能偏薄。",
        scenario: "手机、平板、轻薄电视、小型蓝牙音箱或箱体漏气时常见。",
        fix: "增大单元/箱体、改善密封和倒相设计，或用 DSP 在安全范围内补偿。"
      },
      en: {
        phenomenon: "Bass level and extension drop, with the low end rolling off early.",
        cause: "Small drivers have limited area, excursion, and enclosure volume, so bass SPL is limited.",
        sound: "Kick and bass lose weight; voices may sound thin.",
        scenario: "Common in phones, tablets, thin TVs, small Bluetooth speakers, or leaky enclosures.",
        fix: "Use a larger driver/enclosure, improve sealing or porting, or apply DSP within safe limits."
      }
    }
  },
  {
    id: "cabinet-resonance",
    label: { zh: "箱体共振", en: "Enclosure resonance" },
    description: { zh: "某一段频率被突出，出现嗡、闷或箱声。", en: "A narrow band is emphasized, causing boom or boxiness." },
    detail: {
      zh: {
        phenomenon: "某一小段频率被箱体或结构放大，频响出现窄峰。",
        cause: "箱体、腔体、出音孔或结构件在某个频率附近发生共振。",
        sound: "声音有明显嗡声、闷声或某个音总是特别突出。",
        scenario: "塑料外壳、小体积腔体、桌面反射、倒相孔调谐不当或装配松动时常见。",
        fix: "优化箱体容积、加强结构、加入吸音材料、调整 EQ 或分频。"
      },
      en: {
        phenomenon: "A narrow frequency band is boosted by the enclosure or structure.",
        cause: "The enclosure, cavity, vent, or mechanical parts resonate around a frequency.",
        sound: "The sound becomes boomy, boxy, or dominated by one note.",
        scenario: "Common with plastic housings, small cavities, desk reflections, mistuned ports, or loose assembly.",
        fix: "Adjust volume, stiffening, damping, EQ, or crossover design."
      }
    }
  },
  {
    id: "limiter",
    label: { zh: "动态保护 / 限幅", en: "Dynamic protection / limiting" },
    description: { zh: "峰值被压低，避免破音、过热或过行程。", en: "Peaks are reduced to avoid clipping, heat, or over-excursion." },
    detail: {
      zh: {
        phenomenon: "大动态或大音量时峰值被自动压低，整体响度可能忽高忽低。",
        cause: "小音箱或便携设备为了保护扬声器和功放，会在大音量时压低峰值。",
        sound: "声音变稳但动态变小，鼓点和瞬态可能不够冲。",
        scenario: "便携音箱、手机外放、电视内置扬声器和长时间高音量播放时常见。",
        fix: "优化保护参数、提升硬件余量，或降低目标响度。"
      },
      en: {
        phenomenon: "Peaks are automatically reduced at high level, sometimes making loudness pump.",
        cause: "Small speakers or portable devices reduce peaks to protect the driver and amplifier.",
        sound: "The sound is safer but less dynamic; transients lose impact.",
        scenario: "Common in portable speakers, phone speakers, TV speakers, and sustained loud playback.",
        fix: "Tune protection, increase hardware headroom, or reduce target loudness."
      }
    }
  }
];

function createClippingCurve(strength: number) {
  const samples = 1024;
  const curve = new Float32Array(samples);
  const drive = 1 + strength * 24;

  for (let index = 0; index < samples; index += 1) {
    const x = (index / (samples - 1)) * 2 - 1;
    curve[index] = Math.tanh(x * drive);
  }

  return curve;
}

function getAudioContext() {
  const AudioContextConstructor =
    window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

  return AudioContextConstructor ? new AudioContextConstructor() : null;
}

function startEffectPlayback(effectMode: EffectMode, strengthPercent: number): PlaybackHandle | null {
  const context = getAudioContext();

  if (!context) {
    return null;
  }

  const strength = strengthPercent / 100;
  const source = context.createOscillator();
  const inputGain = context.createGain();
  const outputGain = context.createGain();

  source.type = "sawtooth";
  source.frequency.setValueAtTime(180, context.currentTime);
  inputGain.gain.setValueAtTime(0.08 + strength * 0.14, context.currentTime);
  outputGain.gain.setValueAtTime(0.18, context.currentTime);

  if (effectMode === "clipping") {
    const shaper = context.createWaveShaper();
    shaper.curve = createClippingCurve(strength);
    shaper.oversample = "4x";
    source.connect(inputGain);
    inputGain.connect(shaper);
    shaper.connect(outputGain);
  } else if (effectMode === "bass-loss") {
    const highpass = context.createBiquadFilter();
    highpass.type = "highpass";
    highpass.frequency.setValueAtTime(120 + strength * 520, context.currentTime);
    highpass.Q.setValueAtTime(0.8, context.currentTime);
    source.connect(inputGain);
    inputGain.connect(highpass);
    highpass.connect(outputGain);
  } else if (effectMode === "cabinet-resonance") {
    const peak = context.createBiquadFilter();
    peak.type = "peaking";
    peak.frequency.setValueAtTime(180 + strength * 420, context.currentTime);
    peak.Q.setValueAtTime(8 + strength * 14, context.currentTime);
    peak.gain.setValueAtTime(4 + strength * 16, context.currentTime);
    source.connect(inputGain);
    inputGain.connect(peak);
    peak.connect(outputGain);
  } else if (effectMode === "limiter") {
    const compressor = context.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-18 - strength * 28, context.currentTime);
    compressor.knee.setValueAtTime(6, context.currentTime);
    compressor.ratio.setValueAtTime(4 + strength * 14, context.currentTime);
    compressor.attack.setValueAtTime(0.004, context.currentTime);
    compressor.release.setValueAtTime(0.18, context.currentTime);
    source.connect(inputGain);
    inputGain.connect(compressor);
    compressor.connect(outputGain);
  } else {
    const second = context.createOscillator();
    const third = context.createOscillator();
    const secondGain = context.createGain();
    const thirdGain = context.createGain();

    second.type = "sine";
    third.type = "sine";
    second.frequency.setValueAtTime(360, context.currentTime);
    third.frequency.setValueAtTime(540, context.currentTime);
    secondGain.gain.setValueAtTime(0.02 + strength * 0.08, context.currentTime);
    thirdGain.gain.setValueAtTime(0.01 + strength * 0.06, context.currentTime);
    source.connect(inputGain);
    inputGain.connect(outputGain);
    second.connect(secondGain);
    third.connect(thirdGain);
    secondGain.connect(outputGain);
    thirdGain.connect(outputGain);
    outputGain.connect(context.destination);
    source.start(0);
    second.start(0);
    third.start(0);

    return {
      stop: () => {
        source.stop();
        second.stop();
        third.stop();
        void context.close();
      }
    };
  }

  outputGain.connect(context.destination);
  source.start(0);

  return {
    stop: () => {
      source.stop();
      void context.close();
    }
  };
}

function renderAmplifierDiagram(language: Language, ampClass: AmpClass) {
  const currentCopy = ampClasses.find((item) => item.id === ampClass)?.copy[language] ?? ampClasses[2].copy[language];
  const ampClassLabel = ampClasses.find((item) => item.id === ampClass)?.label ?? "Class D";
  const stageLabel = {
    "class-a": { zh: "线性放大", en: "Linear gain" },
    "class-ab": { zh: "AB 推挽", en: "AB push-pull" },
    "class-d": { zh: "PWM 调制", en: "PWM modulation" }
  } satisfies Record<AmpClass, Record<Language, string>>;
  const outputLabel = {
    "class-a": { zh: "线性连续输出", en: "Linear continuous output" },
    "class-ab": { zh: "正负半周交替输出", en: "Positive and negative halves alternate" },
    "class-d": { zh: "PWM 开关输出", en: "PWM switching output" }
  } satisfies Record<AmpClass, Record<Language, string>>;
  const outputWave = {
    "class-a": "M 438 190 C 456 134 474 134 492 190 S 528 246 546 190",
    "class-ab": "M 438 190 C 452 144 466 144 480 190 H 492 C 506 236 520 236 534 190 H 546",
    "class-d": "M 438 190 H 451 V 138 H 464 V 242 H 477 V 138 H 490 V 242 H 503 V 138 H 516 V 242 H 529 V 138 H 542 V 190"
  } satisfies Record<AmpClass, string>;
  const inputWave = "M 62 190 C 80 152 98 152 116 190 S 152 228 170 190 206 152 224 190";

  return (
    <figure className="amp-diagram-figure">
      <svg
        aria-label={language === "zh" ? `${ampClassLabel} 功放图解` : `${ampClassLabel} amplifier diagram`}
        role="img"
        viewBox="0 0 760 410"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <marker id="ampFlowArrow" markerHeight="10" markerWidth="10" orient="auto" refX="8" refY="5">
            <path d="M 0 0 L 10 5 L 0 10 Z" fill="#f0b46a" />
          </marker>
        </defs>
        <rect className="lab-diagram-bg" height="410" rx="14" width="760" />
        <text className="lab-label" x="48" y="42">
          {language === "zh"
            ? "从左到右：输入小信号 → 功放工作方式 → 功率输出 → 扬声器负载"
            : "Left to right: small input signal -> amplifier method -> power output -> speaker load"}
        </text>
        <text className="interface-node-sub amp-flow-note" x="48" y="66">
          {language === "zh"
            ? "同一条中线表示同一个时间基准，方便比较波形如何变化"
            : "The shared center line uses the same time reference so waveform changes are easier to compare"}
        </text>

        <line className="amp-flow-centerline" x1="48" x2="712" y1="190" y2="190" />
        <path className="amp-flow-arrow" d="M 240 190 L 270 190" />
        <path className="amp-flow-arrow" d="M 358 190 L 408 190" />
        <path className="amp-flow-arrow" d="M 560 190 L 598 190" />

        <text className="lab-label" x="144" y="112">
          {language === "zh" ? "输入小信号" : "Small input signal"}
        </text>
        <path className="amp-wave-input" d={inputWave} />
        <text className="interface-node-sub" x="144" y="268">
          {language === "zh" ? "DAC / Codec 输出，电压小" : "DAC / codec out, low voltage"}
        </text>

        <text className="lab-label" x="314" y="112">
          {language === "zh" ? "功放工作方式" : "Amplifier method"}
        </text>
        <rect className="amp-block" height="86" rx="12" width="104" x="276" y="146" />
        <text className="interface-node-text" x="328" y="180">{ampClassLabel}</text>
        <text className="interface-node-sub" x="328" y="207">{stageLabel[ampClass][language]}</text>
        <text className="interface-node-sub" x="328" y="268">
          {language === "zh" ? "决定效率、失真和发热" : "Sets efficiency, distortion, and heat"}
        </text>

        <text className="lab-label" x="492" y="112">
          {language === "zh" ? "功率输出" : "Power output"}
        </text>
        <path className="interface-clock-line" d={outputWave[ampClass]} />
        {ampClass === "class-ab" ? (
          <>
            <text className="interface-node-sub" x="470" y="246">
              {language === "zh" ? "正半周" : "Positive half"}
            </text>
            <text className="interface-node-sub" x="528" y="246">
              {language === "zh" ? "负半周" : "Negative half"}
            </text>
          </>
        ) : null}
        <text className="interface-node-sub" x="492" y="268">{outputLabel[ampClass][language]}</text>

        <text className="lab-label" x="656" y="112">
          {language === "zh" ? "扬声器负载" : "Speaker load"}
        </text>
        <rect className="amp-block muted" height="86" rx="12" width="104" x="604" y="146" />
        <path className="amp-cone small" d="M 626 162 L 678 146 L 678 234 L 626 218 Z" />
        <path className="amp-air-wave" d="M 686 170 C 708 184 708 206 686 220" />
        <text className="interface-node-sub" x="656" y="268">
          {language === "zh" ? "滤波后推动扬声器" : "Filtered current drives speaker"}
        </text>
      </svg>
      <figcaption>{currentCopy}</figcaption>
    </figure>
  );
}

function renderSpeakerDiagram(language: Language) {
  return (
    <figure className="amp-diagram-figure">
      <svg
        aria-label={language === "zh" ? "动圈扬声器结构图" : "Moving coil speaker diagram"}
        role="img"
        viewBox="0 0 760 410"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <marker id="speakerFlowArrow" markerHeight="10" markerWidth="10" orient="auto" refX="8" refY="5">
            <path d="M 0 0 L 10 5 L 0 10 Z" fill="#f0b46a" />
          </marker>
        </defs>
        <rect className="lab-diagram-bg" height="410" rx="14" width="760" />
        <text className="lab-label" x="48" y="42">
          {language === "zh"
            ? "从左到右：电流输入 → 音圈受力 → 振膜运动 → 空气声波"
            : "Left to right: current input -> coil force -> diaphragm motion -> air pressure wave"}
        </text>
        <text className="interface-node-sub amp-flow-note" x="48" y="66">
          {language === "zh"
            ? "这张图看的是电能如何变成机械运动和声波"
            : "This diagram shows how electrical energy becomes mechanical motion and sound"}
        </text>

        <line className="amp-flow-centerline" x1="52" x2="708" y1="196" y2="196" />
        <path className="amp-speaker-arrow" d="M 154 196 L 196 196" />
        <path className="amp-speaker-arrow" d="M 328 196 L 374 196" />
        <path className="amp-speaker-arrow" d="M 552 196 L 608 196" />

        <text className="lab-label" x="106" y="118">
          {language === "zh" ? "电流输入" : "Current input"}
        </text>
        <path className="amp-wave-input" d="M 60 196 C 76 166 92 166 108 196 S 140 226 156 196" />
        <text className="interface-node-sub" x="106" y="272">
          {language === "zh" ? "来自功放的交流电流" : "AC current from amplifier"}
        </text>

        <text className="lab-label" x="262" y="118">
          {language === "zh" ? "音圈受力" : "Voice coil force"}
        </text>
        <circle className="amp-magnet" cx="262" cy="196" r="56" />
        <rect className="amp-voice-coil" height="64" rx="10" width="68" x="296" y="164" />
        <text className="interface-node-sub" x="262" y="278">
          {language === "zh" ? "磁路" : "Magnet"}
        </text>
        <text className="interface-node-sub" x="330" y="252">
          {language === "zh" ? "音圈" : "Voice coil"}
        </text>
        <text className="interface-node-sub" x="292" y="334">
          {language === "zh" ? "电流在磁场中产生推/拉力" : "Current in the magnetic field creates push/pull force"}
        </text>

        <text className="lab-label" x="466" y="118">
          {language === "zh" ? "振膜运动" : "Diaphragm motion"}
        </text>
        <path className="amp-cone" d="M 388 138 L 552 92 L 552 300 L 388 252 Z" />
        <path className="amp-motion-line" d="M 434 118 L 466 118" />
        <path className="amp-motion-line reverse" d="M 434 318 L 466 318" />
        <text className="interface-node-sub" x="466" y="354">
          {language === "zh" ? "振膜前后运动，压缩/稀疏空气" : "Diaphragm moves forward/backward and moves air"}
        </text>

        <text className="lab-label" x="654" y="118">
          {language === "zh" ? "空气声波" : "Air pressure wave"}
        </text>
        <path className="amp-air-wave" d="M 614 132 C 650 162 650 230 614 260" />
        <path className="amp-air-wave" d="M 650 106 C 706 154 706 238 650 288" />
        <text className="interface-node-sub" x="654" y="354">
          {language === "zh" ? "空气压力变化被耳朵听到" : "Air pressure variation reaches the ear"}
        </text>
      </svg>
      <figcaption>
        {language === "zh"
          ? "动圈扬声器的核心是音圈、磁路和振膜：功放输出电流，音圈在磁场中受力，振膜把机械运动变成空气压力变化。"
          : "A moving-coil speaker is built around the coil, magnet, and diaphragm: amplifier current creates force, and the diaphragm turns that motion into air pressure."}
      </figcaption>
    </figure>
  );
}

function renderEnclosureDiagram(language: Language) {
  return (
    <figure className="amp-diagram-figure">
      <svg
        aria-label={language === "zh" ? "箱体与分频图解" : "Enclosure and crossover diagram"}
        role="img"
        viewBox="0 0 760 410"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <marker id="enclosureFlowArrow" markerHeight="10" markerWidth="10" orient="auto" refX="8" refY="5">
            <path d="M 0 0 L 10 5 L 0 10 Z" fill="#f0b46a" />
          </marker>
        </defs>
        <rect className="lab-diagram-bg" height="410" rx="14" width="760" />
        <text className="lab-label" x="48" y="42">
          {language === "zh"
            ? "从左到右：全频信号 → 分频器 → 低音/高音单元 → 箱体声学"
            : "Left to right: full-range signal -> crossover -> woofer/tweeter -> enclosure acoustics"}
        </text>
        <text className="interface-node-sub amp-flow-note" x="48" y="66">
          {language === "zh"
            ? "分频器决定谁负责低频、谁负责高频"
            : "The crossover decides which driver handles low or high frequencies"}
        </text>

        <text className="lab-label" x="96" y="134">
          {language === "zh" ? "全频信号" : "Full-range signal"}
        </text>
        <path className="amp-wave-input" d="M 54 198 C 72 168 90 168 108 198 S 144 228 162 198" />
        <text className="interface-node-sub" x="96" y="256">
          {language === "zh" ? "功放输出含低频和高频" : "Amplifier output contains lows and highs"}
        </text>

        <path className="amp-enclosure-arrow" d="M 176 198 L 220 198" />
        <rect className="amp-block" height="92" rx="12" width="128" x="224" y="152" />
        <text className="interface-node-text" x="288" y="188">
          {language === "zh" ? "分频器" : "Crossover"}
        </text>
        <text className="interface-node-sub" x="288" y="216">
          {language === "zh" ? "低通 / 高通" : "Low-pass / high-pass"}
        </text>
        <text className="interface-node-sub" x="288" y="276">
          {language === "zh" ? "分频点常见 2-3 kHz" : "Typical crossover point: 2-3 kHz"}
        </text>

        <path className="amp-enclosure-arrow" d="M 352 178 C 390 136 416 128 456 126" />
        <path className="amp-enclosure-arrow" d="M 352 218 C 394 260 420 274 456 276" />
        <text className="lab-label" x="432" y="104">
          {language === "zh" ? "高频通路" : "High-frequency path"}
        </text>
        <text className="lab-label" x="432" y="316">
          {language === "zh" ? "低频通路" : "Low-frequency path"}
        </text>

        <rect className="amp-speaker-box" height="230" rx="16" width="190" x="474" y="90" />
        <circle className="amp-driver-high" cx="568" cy="136" r="28" />
        <circle className="amp-driver-low" cx="568" cy="248" r="52" />
        <text className="interface-node-sub" x="568" y="184">
          {language === "zh" ? "高音单元" : "Tweeter"}
        </text>
        <text className="interface-node-sub" x="568" y="322">
          {language === "zh" ? "低音单元" : "Woofer"}
        </text>

        <path className="amp-port" d="M 622 260 H 654" />
        <text className="lab-chip" x="626" y="214">
          {language === "zh" ? "箱体低频响应" : "Enclosure bass response"}
        </text>
        <path className="amp-air-wave" d="M 682 224 C 710 244 710 282 682 304" />
        <text className="interface-node-sub" x="628" y="354">
          {language === "zh" ? "密闭 / 倒相会影响低频" : "Sealed/ported designs affect bass"}
        </text>
        <text className="interface-node-sub" x="628" y="374">
          {language === "zh" ? "腔体容积会改变共振" : "Cabinet volume changes resonance"}
        </text>
      </svg>
      <figcaption>
        {language === "zh"
          ? "分频器把全频信号拆给不同单元，箱体负责控制低频效率、下潜、共振和漏气问题。"
          : "The crossover splits the full-range signal across drivers, while the enclosure controls bass efficiency, extension, resonance, and leakage."}
      </figcaption>
    </figure>
  );
}

function renderMatchingDiagram(language: Language) {
  const nodes = [
    {
      label: language === "zh" ? "功率" : "Power",
      sub: language === "zh" ? "能提供多少电压/电流余量" : "Voltage/current headroom",
      x: 146,
      y: 126
    },
    {
      label: language === "zh" ? "阻抗" : "Impedance",
      sub: language === "zh" ? "负载越低，电流压力越大" : "Lower load means higher current stress",
      x: 146,
      y: 262
    },
    {
      label: language === "zh" ? "灵敏度" : "Sensitivity",
      sub: language === "zh" ? "同样功率能换来多少声压" : "SPL produced per watt",
      x: 382,
      y: 126
    }
  ];

  return (
    <figure className="amp-diagram-figure">
      <svg
        aria-label={language === "zh" ? "功放扬声器匹配图" : "Amplifier speaker matching diagram"}
        role="img"
        viewBox="0 0 760 410"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <marker id="ampMatchArrow" markerHeight="10" markerWidth="10" orient="auto" refX="8" refY="5">
            <path d="M 0 0 L 10 5 L 0 10 Z" fill="#f0b46a" />
          </marker>
        </defs>
        <rect className="lab-diagram-bg" height="410" rx="14" width="760" />
        <text className="lab-label" x="48" y="42">
          {language === "zh"
            ? "不是信号流，而是三个参数共同决定结果"
            : "This is not a signal flow: three parameters jointly decide the result"}
        </text>
        <text className="interface-node-sub amp-flow-note" x="48" y="66">
          {language === "zh"
            ? "匹配关系看的是响度、失真、发热和保护余量"
            : "Matching is about loudness, distortion, heat, and protection margin"}
        </text>
        {nodes.map((node) => (
          <g key={node.label}>
            <rect className="amp-match-card" height="82" rx="12" width="172" x={node.x - 86} y={node.y - 41} />
            <text className="interface-node-text" x={node.x} y={node.y + 6}>
              {node.label}
            </text>
            <text className="interface-node-sub" x={node.x} y={node.y + 30}>
              {node.sub}
            </text>
          </g>
        ))}

        <path className="amp-matching-arrow" d="M 236 126 L 474 176" />
        <path className="amp-matching-arrow" d="M 236 262 L 474 224" />
        <path className="amp-matching-arrow" d="M 472 150 L 514 174" />

        <rect className="amp-block" height="142" rx="16" width="204" x="494" y="132" />
        <text className="interface-node-text" x="595" y="178">
          {language === "zh" ? "实际声压" : "Actual SPL"}
        </text>
        <text className="interface-node-sub" x="595" y="204">
          {language === "zh" ? "听起来有多响" : "How loud it sounds"}
        </text>
        <line className="amp-match-divider" x1="526" x2="670" y1="222" y2="222" />
        <text className="interface-node-text" x="595" y="240">
          {language === "zh" ? "失真 / 保护风险" : "Distortion / protection risk"}
        </text>
        <text className="interface-node-sub" x="595" y="282">
          {language === "zh" ? "功率过小会削波，阻抗过低会过流" : "Too little power clips; too low impedance overcurrents"}
        </text>
        <text className="interface-node-sub" x="595" y="302">
          {language === "zh" ? "灵敏度低需要更多功率" : "Low sensitivity needs more power"}
        </text>
        <text className="lab-chip" x="368" y="366">
          {language === "zh" ? "目标：够响、不破音、不过热" : "Goal: loud enough, clean, and not overheating"}
        </text>
      </svg>
      <figcaption>
        {language === "zh"
          ? "匹配不是只看一个参数：功放功率、扬声器阻抗和灵敏度共同决定可达到的声压、失真风险和保护动作。"
          : "Matching is not one number: amplifier power, speaker impedance, and sensitivity together determine achievable SPL, distortion risk, and protection behavior."}
      </figcaption>
    </figure>
  );
}

function renderDiagram({
  language,
  diagramMode,
  ampClass
}: {
  language: Language;
  diagramMode: DiagramMode;
  ampClass: AmpClass;
}) {
  if (diagramMode === "speaker") {
    return renderSpeakerDiagram(language);
  }
  if (diagramMode === "enclosure") {
    return renderEnclosureDiagram(language);
  }
  if (diagramMode === "matching") {
    return renderMatchingDiagram(language);
  }

  return renderAmplifierDiagram(language, ampClass);
}

function renderAmpPrinciple(language: Language, ampClass: AmpClass) {
  const ampClassLabel = ampClasses.find((item) => item.id === ampClass)?.label ?? "Class D";
  const principle = ampPrinciples[ampClass][language];
  const items = [
    {
      key: "principle",
      label: language === "zh" ? "基本原理" : "Principle",
      copy: principle.principle
    },
    {
      key: "advantage",
      label: language === "zh" ? "优势" : "Benefit",
      copy: principle.advantage
    },
    {
      key: "caution",
      label: language === "zh" ? "注意" : "Watch out",
      copy: principle.caution
    },
    {
      key: "usage",
      label: language === "zh" ? "常见场景" : "Common uses",
      copy: principle.usage
    }
  ];

  return (
    <section
      aria-label={language === "zh" ? `${ampClassLabel} 基本原理` : `${ampClassLabel} principle`}
      className="amp-principle-panel"
    >
      <div className="amp-principle-header">
        <span>{language === "zh" ? "功放类型原理" : "Amplifier class principle"}</span>
        <h2>{language === "zh" ? `${ampClassLabel} 基本原理` : `${ampClassLabel} Principle`}</h2>
      </div>
      <div className="amp-principle-grid">
        {items.map((item) => (
          <article className={`amp-principle-card ${item.key}`} key={item.key}>
            <strong>{item.label}</strong>
            <p>{item.copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function AmplifierSpeakerLab({ language, onBack }: AmplifierSpeakerLabProps) {
  const [diagramMode, setDiagramMode] = useState<DiagramMode>("amplifier");
  const [ampClass, setAmpClass] = useState<AmpClass>("class-d");
  const [effectMode, setEffectMode] = useState<EffectMode>("clipping");
  const [effectStrength, setEffectStrength] = useState(65);
  const [activeInfo, setActiveInfo] = useState<EffectMode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUnsupported, setAudioUnsupported] = useState(false);
  const playbackRef = useRef<PlaybackHandle | null>(null);
  const closeInfoButtonRef = useRef<HTMLButtonElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const activeInfoEffect = activeInfo ? effects.find((effect) => effect.id === activeInfo) : null;

  function stopPlayback() {
    playbackRef.current?.stop();
    playbackRef.current = null;
    setIsPlaying(false);
  }

  function selectEffect(nextEffect: EffectMode) {
    stopPlayback();
    setEffectMode(nextEffect);
  }

  function togglePlayback() {
    if (isPlaying) {
      stopPlayback();
      return;
    }

    const playback = startEffectPlayback(effectMode, effectStrength);

    if (!playback) {
      setAudioUnsupported(true);
      return;
    }

    playbackRef.current = playback;
    setAudioUnsupported(false);
    setIsPlaying(true);
  }

  useEffect(() => {
    return () => {
      playbackRef.current?.stop();
      playbackRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!activeInfoEffect) {
      return;
    }

    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeInfoButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveInfo(null);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus();
      previousFocusRef.current = null;
    };
  }, [activeInfoEffect]);

  return (
    <main className="codec-lab-page amp-lab">
      <section className="sound-lab-hero" aria-labelledby="amplifier-speaker-lab-title">
        <button className="sound-lab-back" type="button" onClick={onBack}>
          <ArrowLeft size={18} aria-hidden="true" />
          {language === "zh" ? "返回知识库" : "Back to knowledge base"}
        </button>
        <div>
          <span className="section-kicker">{language === "zh" ? "硬件实验" : "Hardware lab"}</span>
          <h1 id="amplifier-speaker-lab-title">
            {language === "zh" ? "功放与扬声器实验室" : "Amplifier and Speaker Lab"}
          </h1>
          <p>
            {language === "zh"
              ? "观察小信号如何变成功率输出、振膜运动和空气声波，并试听常见功放与扬声器问题。"
              : "Inspect how a small signal becomes power output, diaphragm motion, and air pressure while auditioning common amplifier and speaker problems."}
          </p>
        </div>
      </section>

      <section
        aria-label={language === "zh" ? "功放与扬声器信号链" : "Amplifier and speaker signal chain"}
        className="amp-lab-chain"
      >
        {chainLabels[language].map((label, index) => (
          <div className="amp-chain-node" key={label}>
            <span>{label}</span>
            {index < chainLabels[language].length - 1 ? <span aria-hidden="true" className="amp-chain-arrow">→</span> : null}
          </div>
        ))}
      </section>

      <section
        aria-label={language === "zh" ? "功放与扬声器实验台" : "Amplifier and speaker workbench"}
        className="amp-lab-workbench"
      >
        <div className="amp-lab-panel">
          <div className="waveform-tabs" role="group" aria-label={language === "zh" ? "图解模式" : "Diagram mode"}>
            {diagramModes.map((mode) => (
              <button
                aria-pressed={diagramMode === mode.id}
                className={diagramMode === mode.id ? "waveform-tab active" : "waveform-tab"}
                key={mode.id}
                type="button"
                onClick={() => setDiagramMode(mode.id)}
              >
                {mode.label[language]}
              </button>
            ))}
          </div>

          {diagramMode === "amplifier" ? (
            <div
              className="waveform-tabs amp-class-tabs"
              role="group"
              aria-label={language === "zh" ? "功放类型" : "Amplifier class"}
            >
              {ampClasses.map((item) => (
                <button
                  aria-pressed={ampClass === item.id}
                  className={ampClass === item.id ? "waveform-tab active" : "waveform-tab"}
                  key={item.id}
                  type="button"
                  onClick={() => setAmpClass(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          ) : null}

          {renderDiagram({ language, diagramMode, ampClass })}
          {diagramMode === "amplifier" ? renderAmpPrinciple(language, ampClass) : null}
        </div>

        <aside
          className="amp-lab-effects"
          aria-label={language === "zh" ? "功放扬声器音效演示" : "Amplifier speaker effect demos"}
        >
          <h2>{language === "zh" ? "可听音效演示" : "Listening demos"}</h2>
          <div className="amp-effect-list">
            {effects.map((effect) => (
              <article className={effectMode === effect.id ? "amp-effect-card active" : "amp-effect-card"} key={effect.id}>
                <button aria-pressed={effectMode === effect.id} type="button" onClick={() => selectEffect(effect.id)}>
                  {effect.label[language]}
                </button>
                <p>{effect.description[language]}</p>
                <button className="amp-info-button" type="button" onClick={() => setActiveInfo(effect.id)}>
                  {language === "zh" ? `查看${effect.label.zh}说明` : `View ${effect.label.en} details`}
                </button>
              </article>
            ))}
          </div>

          <label className="lab-slider">
            <span>{language === "zh" ? "效果强度" : "Effect strength"}</span>
            <input
              aria-label={language === "zh" ? "效果强度" : "Effect strength"}
              max="100"
              min="0"
              type="range"
              value={effectStrength}
              onChange={(event) => setEffectStrength(Number(event.target.value))}
            />
            <strong>{effectStrength}%</strong>
          </label>

          <button className="lab-play-button" type="button" onClick={togglePlayback}>
            {isPlaying ? (language === "zh" ? "停止音效" : "Stop effect") : language === "zh" ? "播放音效" : "Play effect"}
          </button>
          <p className="amp-play-state">
            {isPlaying ? (language === "zh" ? "播放中" : "Playing") : language === "zh" ? "已停止" : "Stopped"}
          </p>
          {audioUnsupported ? (
            <p className="lab-warning">
              {language === "zh"
                ? "当前浏览器不支持 Web Audio，仍可查看图解。"
                : "This browser does not support Web Audio; diagrams are still available."}
            </p>
          ) : null}
        </aside>
      </section>

      {activeInfoEffect ? (
        <div className="effect-modal-layer" onClick={() => setActiveInfo(null)}>
          <section
            aria-label={`${activeInfoEffect.label[language]}${language === "zh" ? "说明" : " details"}`}
            aria-modal="true"
            className="effect-modal"
            role="dialog"
            onClick={(event) => event.stopPropagation()}
          >
            <h2>{activeInfoEffect.label[language]}</h2>
            <div className="effect-modal-sections">
              {[
                {
                  key: "phenomenon",
                  label: language === "zh" ? "现象" : "Phenomenon",
                  copy: activeInfoEffect.detail[language].phenomenon
                },
                {
                  key: "cause",
                  label: language === "zh" ? "原因" : "Cause",
                  copy: activeInfoEffect.detail[language].cause
                },
                {
                  key: "sound",
                  label: language === "zh" ? "听感" : "Sound",
                  copy: activeInfoEffect.detail[language].sound
                },
                {
                  key: "scenario",
                  label: language === "zh" ? "常见场景" : "Common scenario",
                  copy: activeInfoEffect.detail[language].scenario
                },
                {
                  key: "fix",
                  label: language === "zh" ? "改善方式" : "How to improve",
                  copy: activeInfoEffect.detail[language].fix
                }
              ].map((section) => (
                <section className="effect-modal-section" key={section.key}>
                  <h3>{section.label}</h3>
                  <p>{section.copy}</p>
                </section>
              ))}
            </div>
            <button ref={closeInfoButtonRef} type="button" onClick={() => setActiveInfo(null)}>
              {language === "zh" ? "关闭说明" : "Close details"}
            </button>
          </section>
        </div>
      ) : null}
    </main>
  );
}
