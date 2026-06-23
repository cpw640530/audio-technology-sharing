import { useState } from "react";
import { ArrowLeft } from "lucide-react";

import type { Language } from "../content/knowledge";

type DiagramMode = "amplifier" | "speaker" | "enclosure" | "ts" | "crossover" | "activePassive" | "lineArray" | "matching";
type AmpClass = "class-a" | "class-ab" | "class-d";
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
  { id: "ts", label: { zh: "T/S 参数", en: "T/S parameters" } },
  { id: "crossover", label: { zh: "分频阶数", en: "Crossover order" } },
  { id: "activePassive", label: { zh: "主动 / 被动分频", en: "Active / passive" } },
  { id: "lineArray", label: { zh: "线阵列", en: "Line array" } },
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

function renderTsDiagram(language: Language) {
  return (
    <figure className="amp-diagram-figure">
      <svg
        aria-label={language === "zh" ? "Thiele-Small 参数与箱体关系图" : "Thiele-Small parameter enclosure diagram"}
        role="img"
        viewBox="0 0 760 430"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <marker id="tsFlowArrow" markerHeight="10" markerWidth="10" orient="auto" refX="8" refY="5">
            <path d="M 0 0 L 10 5 L 0 10 Z" fill="#f0b46a" />
          </marker>
        </defs>
        <rect className="lab-diagram-bg" height="430" rx="14" width="760" />
        <text className="lab-label" x="48" y="42">
          {language === "zh" ? "T/S 参数不是音色玄学，而是低频箱体设计的输入条件" : "T/S parameters are input data for low-frequency box design"}
        </text>
        <text className="interface-node-sub amp-flow-note" x="48" y="66">
          {language === "zh" ? "Fs、Qts、Vas 会影响箱体容积、低频下潜、瞬态和倒相调谐" : "Fs, Qts, and Vas affect box volume, extension, transient behavior, and port tuning"}
        </text>

        {[
          { key: "Fs", y: 116, body: language === "zh" ? "自由空气谐振频率" : "free-air resonance" },
          { key: "Qts", y: 202, body: language === "zh" ? "总 Q 值，反映阻尼" : "total Q, damping" },
          { key: "Vas", y: 288, body: language === "zh" ? "等效空气顺性体积" : "equivalent compliance volume" }
        ].map((item) => (
          <g key={item.key}>
            <rect className="amp-match-card" height="64" rx="12" width="150" x="56" y={item.y - 32} />
            <text className="interface-node-text" x="131" y={item.y - 4}>{item.key}</text>
            <text className="interface-node-sub" x="131" y={item.y + 22}>{item.body}</text>
            <path className="amp-matching-arrow" d={`M 210 ${item.y} C 252 ${item.y} 272 204 314 204`} />
          </g>
        ))}

        <rect className="amp-block" height="128" rx="16" width="174" x="318" y="140" />
        <text className="interface-node-text" x="405" y="182">{language === "zh" ? "箱体计算" : "Box model"}</text>
        <text className="interface-node-sub" x="405" y="208">{language === "zh" ? "容积 / 调谐 / 阻尼" : "volume / tuning / damping"}</text>
        <text className="interface-node-sub" x="405" y="232">{language === "zh" ? "不是只看单元口径" : "not just driver size"}</text>

        <path className="amp-matching-arrow" d="M 496 172 C 536 142 558 126 604 126" />
        <path className="amp-matching-arrow" d="M 496 236 C 536 268 558 292 604 292" />

        <rect className="amp-speaker-box" height="118" rx="14" width="122" x="606" y="70" />
        <circle className="amp-driver-low" cx="666" cy="130" r="32" />
        <text className="lab-label" x="666" y="214">{language === "zh" ? "密闭箱" : "Sealed box"}</text>
        <text className="interface-node-sub" x="666" y="238">{language === "zh" ? "空气弹簧控制振膜" : "air spring controls cone"}</text>

        <rect className="amp-speaker-box" height="118" rx="14" width="122" x="606" y="248" />
        <circle className="amp-driver-low" cx="654" cy="306" r="30" />
        <path className="amp-port" d="M 690 330 H 724" />
        <text className="lab-label" x="666" y="392">{language === "zh" ? "倒相箱" : "Bass reflex"}</text>
        <text className="interface-node-sub" x="666" y="414">{language === "zh" ? "导管共振增强低频" : "port resonance boosts bass"}</text>
      </svg>
      <figcaption>
        {language === "zh"
          ? "常见经验是：Qts 较低的单元更常用于倒相箱，Qts 较高的单元更容易做密闭箱；但最终还要看目标体积、低频下潜、最大声压和保护策略。"
          : "A common rule of thumb is that lower-Qts drivers often suit bass-reflex boxes, while higher-Qts drivers are easier in sealed boxes; final choices still depend on target volume, extension, maximum SPL, and protection."}
      </figcaption>
    </figure>
  );
}

function renderCrossoverOrderDiagram(language: Language) {
  const rows = [
    { label: language === "zh" ? "一阶" : "1st order", slope: "6 dB/oct", phase: language === "zh" ? "相位旋转小" : "less phase rotation", d: "M 84 132 C 220 132 302 142 420 230" },
    { label: language === "zh" ? "二阶" : "2nd order", slope: "12 dB/oct", phase: language === "zh" ? "常需反相/对齐" : "often needs polarity/alignment", d: "M 84 212 C 196 212 292 222 420 310" },
    { label: language === "zh" ? "四阶" : "4th order", slope: "24 dB/oct", phase: language === "zh" ? "保护强，设计更严格" : "more protection, stricter design", d: "M 84 292 C 190 292 262 302 420 382" }
  ];

  return (
    <figure className="amp-diagram-figure">
      <svg
        aria-label={language === "zh" ? "分频阶数与相位对齐图" : "Crossover order and phase alignment diagram"}
        role="img"
        viewBox="0 0 760 430"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect className="lab-diagram-bg" height="430" rx="14" width="760" />
        <text className="lab-label" x="48" y="42">
          {language === "zh" ? "分频阶数决定斜率，分频点附近还要看相位叠加" : "Crossover order sets slope; phase summing near crossover also matters"}
        </text>
        <line className="spatial-response-axis" x1="84" x2="430" y1="352" y2="352" />
        <line className="spatial-response-axis" x1="84" x2="84" y1="92" y2="352" />
        <text className="interface-node-sub" x="86" y="380">{language === "zh" ? "频率升高" : "frequency increases"}</text>
        <text className="interface-node-sub" x="44" y="94">{language === "zh" ? "电平" : "level"}</text>
        {rows.map((row, index) => (
          <g key={row.label}>
            <path className={`amp-crossover-slope order-${index + 1}`} d={row.d} />
            <text className="lab-label" x="468" y={126 + index * 80}>{row.label}</text>
            <text className="interface-node-sub" x="548" y={126 + index * 80}>{row.slope}</text>
            <text className="interface-node-sub" x="468" y={150 + index * 80}>{row.phase}</text>
          </g>
        ))}
        <rect className="amp-block muted" height="142" rx="14" width="210" x="500" y="248" />
        <text className="interface-node-text" x="605" y="284">{language === "zh" ? "相位对齐" : "Phase alignment"}</text>
        <text className="interface-node-sub" x="605" y="312">{language === "zh" ? "低音 + 高音在分频点相加" : "woofer + tweeter sum at crossover"}</text>
        <text className="interface-node-sub" x="605" y="338">{language === "zh" ? "不对齐会凹陷、隆起或声像漂移" : "misalignment causes dips, peaks, or image shift"}</text>
      </svg>
      <figcaption>
        {language === "zh"
          ? "分频不是简单切一刀。阶数越高，带外衰减越快，单元更安全；但电声相位、单元声学中心和摆位都会影响最终叠加。"
          : "A crossover is not just a cut. Higher order gives faster out-of-band attenuation and better driver protection, but electrical/acoustic phase, acoustic centers, and placement affect the final sum."}
      </figcaption>
    </figure>
  );
}

function renderActivePassiveDiagram(language: Language) {
  return (
    <figure className="amp-diagram-figure">
      <svg
        aria-label={language === "zh" ? "主动分频与被动分频对比图" : "Active and passive crossover comparison diagram"}
        role="img"
        viewBox="0 0 760 430"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <marker id="activePassiveArrow" markerHeight="10" markerWidth="10" orient="auto" refX="8" refY="5">
            <path d="M 0 0 L 10 5 L 0 10 Z" fill="#f0b46a" />
          </marker>
        </defs>
        <rect className="lab-diagram-bg" height="430" rx="14" width="760" />
        <text className="lab-label" x="48" y="42">{language === "zh" ? "主动分频：先分频，再分别功放" : "Active crossover: split first, then amplify each band"}</text>
        <rect className="amp-block" height="58" rx="10" width="112" x="54" y="84" />
        <text className="interface-node-text" x="110" y="120">DSP</text>
        <path className="amp-enclosure-arrow" d="M 170 112 H 220" />
        <rect className="amp-block" height="58" rx="10" width="112" x="224" y="62" />
        <text className="interface-node-text" x="280" y="98">{language === "zh" ? "低频功放" : "LF amp"}</text>
        <rect className="amp-block" height="58" rx="10" width="112" x="224" y="146" />
        <text className="interface-node-text" x="280" y="182">{language === "zh" ? "高频功放" : "HF amp"}</text>
        <path className="amp-enclosure-arrow" d="M 340 92 H 404" />
        <path className="amp-enclosure-arrow" d="M 340 176 H 404" />
        <circle className="amp-driver-low" cx="452" cy="92" r="28" />
        <circle className="amp-driver-high" cx="452" cy="176" r="20" />
        <text className="interface-node-sub" x="596" y="92">{language === "zh" ? "优点：延迟/EQ/限幅/保护精确" : "Pros: precise delay/EQ/limiting/protection"}</text>
        <text className="interface-node-sub" x="596" y="122">{language === "zh" ? "代价：需要多路 DAC/功放" : "Cost: needs more DAC/amp channels"}</text>

        <line className="amp-match-divider" x1="48" x2="712" y1="228" y2="228" />
        <text className="lab-label" x="48" y="270">{language === "zh" ? "被动分频：先功放，再用 L/C/R 分给单元" : "Passive crossover: amplify first, then split with L/C/R"}</text>
        <rect className="amp-block" height="58" rx="10" width="112" x="54" y="306" />
        <text className="interface-node-text" x="110" y="342">{language === "zh" ? "功放" : "Amp"}</text>
        <path className="amp-enclosure-arrow" d="M 170 334 H 220" />
        <rect className="amp-block muted" height="82" rx="10" width="126" x="224" y="294" />
        <text className="interface-node-text" x="287" y="324">{language === "zh" ? "L / C / R" : "L / C / R"}</text>
        <text className="interface-node-sub" x="287" y="350">{language === "zh" ? "被动分频网络" : "passive network"}</text>
        <path className="amp-enclosure-arrow" d="M 354 314 H 404" />
        <path className="amp-enclosure-arrow" d="M 354 356 H 404" />
        <circle className="amp-driver-low" cx="452" cy="314" r="28" />
        <circle className="amp-driver-high" cx="452" cy="356" r="20" />
        <text className="interface-node-sub" x="596" y="314">{language === "zh" ? "优点：结构简单，一路功放即可" : "Pros: simple, one amp channel can work"}</text>
        <text className="interface-node-sub" x="596" y="344">{language === "zh" ? "代价：受阻抗曲线影响，元件会损耗" : "Cost: load-dependent, components dissipate power"}</text>
      </svg>
      <figcaption>
        {language === "zh"
          ? "主动分频更像系统设计，适合 DSP 音箱、车载和有源监听；被动分频更像模拟网络设计，常见于传统无源音箱。"
          : "Active crossover is closer to system design and fits DSP speakers, cars, and active monitors; passive crossover is an analog network design common in traditional passive speakers."}
      </figcaption>
    </figure>
  );
}

function renderLineArrayDiagram(language: Language) {
  const drivers = [92, 132, 172, 212, 252, 292, 332];

  return (
    <figure className="amp-diagram-figure">
      <svg
        aria-label={language === "zh" ? "线阵列扬声器覆盖控制图" : "Line array coverage control diagram"}
        role="img"
        viewBox="0 0 760 430"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect className="lab-diagram-bg" height="430" rx="14" width="760" />
        <text className="lab-label" x="48" y="42">
          {language === "zh" ? "线阵列通过多个单元的叠加控制垂直覆盖" : "A line array controls vertical coverage by combining many drivers"}
        </text>
        <rect className="amp-block muted" height="300" rx="16" width="96" x="86" y="72" />
        {drivers.map((y, index) => (
          <g key={y}>
            <circle className="amp-driver-high" cx="134" cy={y} r="14" />
            <text className="interface-node-sub" x="196" y={y + 4}>{language === "zh" ? `单元 ${index + 1}` : `Driver ${index + 1}`}</text>
          </g>
        ))}
        <path className="amp-linearray-main" d="M 184 212 C 290 126 462 100 684 130" />
        <path className="amp-linearray-main lower" d="M 184 212 C 290 298 462 324 684 294" />
        <path className="amp-linearray-side" d="M 184 212 C 294 176 438 182 622 210" />
        <path className="amp-linearray-side" d="M 184 212 C 294 248 438 242 622 214" />
        <text className="lab-chip" x="388" y="96">{language === "zh" ? "目标覆盖区" : "target coverage"}</text>
        <text className="lab-chip" x="392" y="340">{language === "zh" ? "减少垂直扩散" : "reduced vertical spill"}</text>
        <rect className="amp-block" height="94" rx="14" width="210" x="476" y="154" />
        <text className="interface-node-text" x="581" y="186">{language === "zh" ? "延迟 / 电平 / 角度" : "Delay / level / splay"}</text>
        <text className="interface-node-sub" x="581" y="214">{language === "zh" ? "让远近听众声压更均匀" : "more even SPL for near/far listeners"}</text>
        <text className="interface-node-sub" x="581" y="238">{language === "zh" ? "阵列越长，低频指向控制越强" : "longer arrays control lower frequencies better"}</text>
        <text className="interface-node-sub" x="92" y="402">
          {language === "zh" ? "注意：线阵列不是简单堆喇叭，单元间距过大会产生梳状滤波和旁瓣。" : "Note: a line array is not just stacked speakers; excessive spacing causes comb filtering and side lobes."}
        </text>
      </svg>
      <figcaption>
        {language === "zh"
          ? "线阵列常用于大型扩声。它通过多个单元在空间中的相干叠加控制覆盖范围，设计重点是阵列长度、单元间距、吊挂角度、延迟和电平 shading。"
          : "Line arrays are common in large sound reinforcement. They use coherent spatial summing to control coverage; key design points are array length, driver spacing, splay angle, delay, and level shading."}
      </figcaption>
    </figure>
  );
}

function renderMatchingDiagram(language: Language) {
  const nodes = [
    {
      label: language === "zh" ? "功率" : "Power",
      sub: language === "zh" ? "能提供多少电压/电流余量" : "Voltage/current headroom",
      x: 164,
      y: 118
    },
    {
      label: language === "zh" ? "阻抗" : "Impedance",
      sub: language === "zh" ? "负载越低，电流压力越大" : "Lower load means higher current stress",
      x: 164,
      y: 212
    },
    {
      label: language === "zh" ? "灵敏度" : "Sensitivity",
      sub: language === "zh" ? "同样功率能换来多少声压" : "SPL produced per watt",
      x: 164,
      y: 306
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

        <path className="amp-matching-arrow" d="M 250 118 C 330 118 402 154 484 176" />
        <path className="amp-matching-arrow" d="M 250 212 H 484" />
        <path className="amp-matching-arrow" d="M 250 306 C 330 306 404 250 484 226" />

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
  if (diagramMode === "ts") {
    return renderTsDiagram(language);
  }
  if (diagramMode === "crossover") {
    return renderCrossoverOrderDiagram(language);
  }
  if (diagramMode === "activePassive") {
    return renderActivePassiveDiagram(language);
  }
  if (diagramMode === "lineArray") {
    return renderLineArrayDiagram(language);
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
              ? "观察小信号如何变成功率输出、振膜运动和空气声波，理解功放、分频、箱体和扬声器匹配关系。"
              : "Inspect how a small signal becomes power output, diaphragm motion, and air pressure while learning amplifier, crossover, enclosure, and speaker matching relationships."}
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
      </section>
    </main>
  );
}
