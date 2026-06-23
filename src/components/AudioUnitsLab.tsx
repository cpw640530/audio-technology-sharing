import { ArrowLeft } from "lucide-react";
import type { Language } from "../content/knowledge";

type AudioUnitsLabProps = {
  language: Language;
  onBack: () => void;
};

const unitCards = [
  {
    unit: "dBSPL",
    reference: { zh: "参考：20 uPa 声压", en: "Reference: 20 uPa sound pressure" },
    range: { zh: "常见：30 dB 安静房间，94 dB = 1 Pa，120 dB 接近痛感", en: "Typical: 30 dB quiet room, 94 dB = 1 Pa, 120 dB near pain" },
    use: { zh: "用于声学测量、扬声器最大声压、噪声和听力安全。", en: "Used for acoustic measurement, speaker SPL, noise, and hearing safety." }
  },
  {
    unit: "dBFS",
    reference: { zh: "参考：数字满刻度 0 dBFS", en: "Reference: digital full scale, 0 dBFS" },
    range: { zh: "常见：峰值 -12 到 -1 dBFS；超过 0 dBFS 通常削波", en: "Typical: peaks -12 to -1 dBFS; above 0 dBFS usually clips" },
    use: { zh: "用于 PCM、DAW、录音电平、混音 headroom 和数字峰值。", en: "Used for PCM, DAWs, recording level, mix headroom, and digital peaks." }
  },
  {
    unit: "dBu / dBV",
    reference: { zh: "参考：0 dBu = 0.775 Vrms；0 dBV = 1 Vrms", en: "Reference: 0 dBu = 0.775 Vrms; 0 dBV = 1 Vrms" },
    range: { zh: "常见：专业 +4 dBu，消费 -10 dBV", en: "Typical: pro +4 dBu, consumer -10 dBV" },
    use: { zh: "用于模拟线路电平、声卡输入输出和设备接口匹配。", en: "Used for analog line level, audio-interface I/O, and device matching." }
  },
  {
    unit: "LUFS",
    reference: { zh: "参考：K-weighting + 时间积分", en: "Reference: K-weighting plus time integration" },
    range: { zh: "常见：流媒体约 -14 LUFS，广播常见 -23/-24 LUFS", en: "Typical: streaming around -14 LUFS, broadcast often -23/-24 LUFS" },
    use: { zh: "用于节目响度、视频平台、播客、直播和响度标准化。", en: "Used for program loudness, video platforms, podcasts, streams, and normalization." }
  }
] satisfies Array<{
  unit: string;
  reference: Record<Language, string>;
  range: Record<Language, string>;
  use: Record<Language, string>;
}>;

const conversionRows = [
  {
    label: { zh: "幅度比", en: "Amplitude ratio" },
    formula: "dB = 20 x log10(A2 / A1)",
    example: { zh: "-6 dB 约等于幅度减半", en: "-6 dB is roughly half amplitude" }
  },
  {
    label: { zh: "功率比", en: "Power ratio" },
    formula: "dB = 10 x log10(P2 / P1)",
    example: { zh: "+3 dB 约等于功率翻倍", en: "+3 dB is roughly double power" }
  },
  {
    label: { zh: "dBu 转电压", en: "dBu to voltage" },
    formula: "Vrms = 0.775 x 10^(dBu / 20)",
    example: { zh: "+4 dBu 约等于 1.228 Vrms", en: "+4 dBu is about 1.228 Vrms" }
  },
  {
    label: { zh: "sample 转 ms", en: "samples to ms" },
    formula: "ms = samples / sampleRate x 1000",
    example: { zh: "48 kHz 下 480 samples = 10 ms", en: "At 48 kHz, 480 samples = 10 ms" }
  }
] satisfies Array<{
  label: Record<Language, string>;
  formula: string;
  example: Record<Language, string>;
}>;

function AudioUnitsDiagram({ language }: { language: Language }) {
  return (
    <svg
      aria-label={language === "zh" ? "声音与音频单位参考关系图" : "Sound and audio unit reference diagram"}
      role="img"
      viewBox="0 0 820 470"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <marker id="unitArrow" markerHeight="10" markerWidth="10" orient="auto" refX="8" refY="5">
          <path d="M 0 0 L 10 5 L 0 10 Z" fill="#f0b46a" />
        </marker>
      </defs>
      <rect className="lab-diagram-bg" height="470" rx="16" width="820" />
      <text className="lab-label" x="48" y="46">
        {language === "zh" ? "先看参考点：同样写 dB，含义可能完全不同" : "Start with the reference: dB suffixes can mean very different things"}
      </text>

      <g className="unit-reference-axis">
        <line x1="82" x2="738" y1="118" y2="118" />
        <text x="82" y="92">{language === "zh" ? "空气声压" : "acoustic pressure"}</text>
        <text x="304" y="92">{language === "zh" ? "数字幅度" : "digital amplitude"}</text>
        <text x="508" y="92">{language === "zh" ? "模拟电压" : "analog voltage"}</text>
        <text x="668" y="92">{language === "zh" ? "节目响度" : "program loudness"}</text>
        {[
          { x: 104, label: "dBSPL", sub: "20 uPa" },
          { x: 326, label: "dBFS", sub: "0 dBFS" },
          { x: 532, label: "dBu / dBV", sub: "0.775 V / 1 V" },
          { x: 704, label: "LUFS", sub: "K-weighted" }
        ].map((item) => (
          <g key={item.label}>
            <circle cx={item.x} cy="118" r="9" />
            <text className="unit-axis-label" x={item.x} y="156">{item.label}</text>
            <text className="unit-axis-sub" x={item.x} y="178">{item.sub}</text>
          </g>
        ))}
      </g>

      <g>
        <rect className="unit-meter acoustic" height="148" rx="12" width="150" x="62" y="238" />
        <text className="interface-node-text" x="137" y="272">dBSPL</text>
        <text className="interface-node-sub" x="137" y="304">{language === "zh" ? "30 dB 安静" : "30 dB quiet"}</text>
        <text className="interface-node-sub" x="137" y="330">{language === "zh" ? "94 dB = 1 Pa" : "94 dB = 1 Pa"}</text>
        <text className="interface-node-sub" x="137" y="356">{language === "zh" ? "120 dB 很响" : "120 dB very loud"}</text>

        <rect className="unit-meter digital" height="148" rx="12" width="150" x="246" y="238" />
        <text className="interface-node-text" x="321" y="272">dBFS</text>
        <text className="interface-node-sub" x="321" y="304">{language === "zh" ? "0 dBFS 满刻度" : "0 dBFS full scale"}</text>
        <text className="interface-node-sub" x="321" y="330">{language === "zh" ? "-6 dBFS 约半幅度" : "-6 dBFS half-ish"}</text>
        <text className="interface-node-sub" x="321" y="356">{language === "zh" ? "负数是正常电平" : "negative is normal"}</text>

        <rect className="unit-meter voltage" height="148" rx="12" width="150" x="430" y="238" />
        <text className="interface-node-text" x="505" y="272">dBu / dBV</text>
        <text className="interface-node-sub" x="505" y="304">+4 dBu</text>
        <text className="interface-node-sub" x="505" y="330">-10 dBV</text>
        <text className="interface-node-sub" x="505" y="356">{language === "zh" ? "线路电平" : "line level"}</text>

        <rect className="unit-meter loudness" height="148" rx="12" width="150" x="614" y="238" />
        <text className="interface-node-text" x="689" y="272">LUFS</text>
        <text className="interface-node-sub" x="689" y="304">{language === "zh" ? "积分响度" : "integrated loudness"}</text>
        <text className="interface-node-sub" x="689" y="330">-14 LUFS</text>
        <text className="interface-node-sub" x="689" y="356">{language === "zh" ? "平台标准化" : "platform normalization"}</text>
      </g>

      <text className="lab-chip audio-units-note" x="410" y="424">
        <tspan x="410">{language === "zh" ? "不能把 -6 dBFS 直接换成 94 dBSPL" : "You cannot directly convert -6 dBFS to 94 dBSPL"}</tspan>
        <tspan x="410" dy="26">
          {language === "zh"
            ? "中间还要经过 DAC、功放、扬声器灵敏度和距离。"
            : "DAC, amplifier, speaker sensitivity, and distance sit in between."}
        </tspan>
      </text>
    </svg>
  );
}

export function AudioUnitsLab({ language, onBack }: AudioUnitsLabProps) {
  return (
    <main className="codec-lab-page audio-units-page">
      <section className="sound-lab-hero" aria-labelledby="audio-units-title">
        <button className="sound-lab-back" type="button" onClick={onBack}>
          <ArrowLeft size={18} aria-hidden="true" />
          {language === "zh" ? "返回知识库" : "Back to knowledge base"}
        </button>
        <div>
          <span className="section-kicker">{language === "zh" ? "基础实验" : "Fundamentals lab"}</span>
          <h1 id="audio-units-title">{language === "zh" ? "声音与音频单位实验室" : "Sound and Audio Units Lab"}</h1>
          <p>
            {language === "zh"
              ? "把 dBSPL、dBFS、dBu、dBV、LUFS、Hz、bit、sample 和 ms 放在同一张参考图里，先分清参考点再谈换算。"
              : "Place dBSPL, dBFS, dBu, dBV, LUFS, Hz, bit, sample, and ms on one reference map so conversions start from the right reference."}
          </p>
        </div>
      </section>

      <section className="audio-units-workbench" aria-label={language === "zh" ? "声音与音频单位实验台" : "Sound and audio units workbench"}>
        <div className="audio-units-visual">
          <AudioUnitsDiagram language={language} />
        </div>

        <div className="audio-units-grid">
          {unitCards.map((card) => (
            <article className="audio-unit-card" key={card.unit}>
              <h2>{card.unit}</h2>
              <strong>{card.reference[language]}</strong>
              <p>{card.range[language]}</p>
              <span>{card.use[language]}</span>
            </article>
          ))}
        </div>

        <section className="audio-units-conversions" aria-label={language === "zh" ? "常用换算关系" : "Common conversion relationships"}>
          <div className="codec-mode-concepts-header">
            <strong>{language === "zh" ? "常用换算关系" : "Common conversion relationships"}</strong>
            <span>{language === "zh" ? "先确认参考点，再使用公式" : "Confirm the reference first, then use the formula"}</span>
          </div>
          <div className="audio-units-grid">
            {conversionRows.map((row) => (
              <article className="audio-unit-card compact" key={row.formula}>
                <h2>{row.label[language]}</h2>
                <strong>{row.formula}</strong>
                <p>{row.example[language]}</p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
