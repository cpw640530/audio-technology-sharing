import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import type { Language } from "../content/knowledge";

type AudioUnitsLabProps = {
  language: Language;
  onBack: () => void;
};

type ConversionUnit =
  | "dBSPL"
  | "Pa"
  | "uPa"
  | "dBu"
  | "dBV"
  | "Vrms"
  | "W"
  | "dBW"
  | "dBm"
  | "dBFS"
  | "dBAmplitude"
  | "dBPower";

type ConversionResult = {
  label: string;
  value: string;
};

type ConversionCalculation =
  | {
      kind: "valid";
      domain: Record<Language, string>;
      results: ConversionResult[];
      note?: Record<Language, string>;
    }
  | {
      kind: "invalid";
      message: Record<Language, string>;
    };

const conversionUnitOptions = [
  { value: "dBSPL", label: { zh: "dBSPL（声压级）", en: "dBSPL (sound pressure)" } },
  { value: "Pa", label: { zh: "Pa（声压）", en: "Pa (sound pressure)" } },
  { value: "uPa", label: { zh: "uPa（声压）", en: "uPa (sound pressure)" } },
  { value: "dBu", label: { zh: "dBu（模拟电压）", en: "dBu (analog voltage)" } },
  { value: "dBV", label: { zh: "dBV（模拟电压）", en: "dBV (analog voltage)" } },
  { value: "Vrms", label: { zh: "Vrms（有效值电压）", en: "Vrms (RMS voltage)" } },
  { value: "W", label: { zh: "W（功率）", en: "W (power)" } },
  { value: "dBW", label: { zh: "dBW（参考 1 W）", en: "dBW (ref 1 W)" } },
  { value: "dBm", label: { zh: "dBm（参考 1 mW）", en: "dBm (ref 1 mW)" } },
  { value: "dBFS", label: { zh: "dBFS（数字满刻度）", en: "dBFS (digital full scale)" } },
  { value: "dBAmplitude", label: { zh: "dB（幅度比）", en: "dB (amplitude ratio)" } },
  { value: "dBPower", label: { zh: "dB（功率比）", en: "dB (power ratio)" } }
] satisfies Array<{ value: ConversionUnit; label: Record<Language, string> }>;

const conversionBoundaryNote = {
  zh: "提示：dBSPL 与 dBFS/dBu/dBV 不能无校准直接互转；这里只计算同一参考域内的等效值。",
  en: "Note: dBSPL cannot be directly converted to dBFS/dBu/dBV without calibration; this tool only calculates equivalents inside the same reference domain."
};

const invalidNumberMessage = {
  zh: "请输入有效数字。",
  en: "Enter a valid number."
};

const positiveNumberMessage = {
  zh: "该单位必须输入大于 0 的数值。",
  en: "This unit requires a value greater than 0."
};

function parseFiniteNumber(value: string) {
  if (!value.trim()) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatFixed(value: number, digits: number) {
  return value.toLocaleString("en-US", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits
  });
}

function formatCompact(value: number, digits = 3) {
  if (Math.abs(value) >= 0.001 && Math.abs(value) < 1_000_000) {
    return value.toLocaleString("en-US", {
      maximumFractionDigits: digits,
      minimumFractionDigits: digits
    });
  }

  return value.toExponential(digits);
}

function formatInteger(value: number) {
  return value.toLocaleString("en-US", {
    maximumFractionDigits: 0
  });
}

function calculateConversion(rawValue: string, unit: ConversionUnit): ConversionCalculation {
  const value = parseFiniteNumber(rawValue);

  if (value === null) {
    return { kind: "invalid", message: invalidNumberMessage };
  }

  if (unit === "dBSPL" || unit === "Pa" || unit === "uPa") {
    const pressurePa =
      unit === "dBSPL"
        ? 20e-6 * 10 ** (value / 20)
        : unit === "Pa"
          ? value
          : value / 1_000_000;

    if (pressurePa <= 0) {
      return { kind: "invalid", message: positiveNumberMessage };
    }

    const dbSpl = 20 * Math.log10(pressurePa / 20e-6);

    return {
      kind: "valid",
      domain: { zh: "声压参考域", en: "Acoustic pressure domain" },
      results: [
        { label: "dBSPL", value: `${formatFixed(dbSpl, 2)} dBSPL` },
        { label: "Pa", value: `${formatCompact(pressurePa, 3)} Pa` },
        { label: "uPa", value: `${formatInteger(pressurePa * 1_000_000)} uPa` }
      ]
    };
  }

  if (unit === "dBu" || unit === "dBV" || unit === "Vrms") {
    const vrms =
      unit === "dBu" ? 0.775 * 10 ** (value / 20) : unit === "dBV" ? 10 ** (value / 20) : value;

    if (vrms <= 0) {
      return { kind: "invalid", message: positiveNumberMessage };
    }

    return {
      kind: "valid",
      domain: { zh: "模拟电压参考域", en: "Analog voltage domain" },
      results: [
        { label: "dBu", value: `${formatFixed(20 * Math.log10(vrms / 0.775), 2)} dBu` },
        { label: "dBV", value: `${formatFixed(20 * Math.log10(vrms), 2)} dBV` },
        { label: "Vrms", value: `${formatFixed(vrms, 3)} Vrms` },
        { label: "mVrms", value: `${formatInteger(vrms * 1000)} mVrms` }
      ]
    };
  }

  if (unit === "W" || unit === "dBW" || unit === "dBm") {
    const watts = unit === "W" ? value : unit === "dBW" ? 10 ** (value / 10) : 0.001 * 10 ** (value / 10);

    if (watts <= 0) {
      return { kind: "invalid", message: positiveNumberMessage };
    }

    const dbw = 10 * Math.log10(watts);

    return {
      kind: "valid",
      domain: { zh: "功率参考域", en: "Power domain" },
      results: [
        { label: "W", value: `${formatCompact(watts, 3)} W` },
        { label: "mW", value: `${formatCompact(watts * 1000, 3)} mW` },
        { label: "dBW", value: `${formatFixed(dbw, 2)} dBW` },
        { label: "dBm", value: `${formatFixed(dbw + 30, 2)} dBm` }
      ]
    };
  }

  if (unit === "dBFS") {
    const amplitudeRatio = 10 ** (value / 20);

    return {
      kind: "valid",
      domain: { zh: "数字满刻度参考域", en: "Digital full-scale domain" },
      results: [
        { label: "dBFS", value: `${formatFixed(value, 2)} dBFS` },
        { label: "幅度比例", value: `${formatCompact(amplitudeRatio, 3)} x FS` },
        { label: "满刻度百分比", value: `${formatFixed(amplitudeRatio * 100, 2)}% FS` },
        {
          label: "余量",
          value: value <= 0 ? `${formatFixed(Math.abs(value), 2)} dB headroom` : "超过 0 dBFS，可能削波"
        }
      ],
      note: {
        zh: "dBFS 是数字系统内部参考，只有经过 DAC、增益、扬声器和距离校准后，才能映射到真实声压。",
        en: "dBFS is an internal digital reference. It maps to real SPL only after DAC, gain, speaker, and distance calibration."
      }
    };
  }

  const dbValue = value;
  const amplitudeRatio = 10 ** (dbValue / 20);
  const powerRatio = 10 ** (dbValue / 10);

  return {
    kind: "valid",
    domain: { zh: "无量纲比例域", en: "Dimensionless ratio domain" },
    results: [
      { label: "dB", value: `${formatFixed(dbValue, 2)} dB` },
      { label: "幅度比", value: `${formatCompact(amplitudeRatio, 3)} : 1` },
      { label: "功率比", value: `${formatCompact(powerRatio, 3)} : 1` }
    ],
    note: {
      zh: unit === "dBAmplitude" ? "幅度、电压、声压这类幅度比使用 20 x log10。" : "功率、能量这类功率比使用 10 x log10。",
      en:
        unit === "dBAmplitude"
          ? "Amplitude-like quantities such as voltage or pressure use 20 x log10."
          : "Power-like quantities use 10 x log10."
    }
  };
}

function calculateDistanceLevels(rawSpl: string, rawDistance: string): ConversionCalculation {
  const spl = parseFiniteNumber(rawSpl);
  const distance = parseFiniteNumber(rawDistance);

  if (spl === null || distance === null) {
    return { kind: "invalid", message: invalidNumberMessage };
  }

  if (distance <= 0) {
    return { kind: "invalid", message: positiveNumberMessage };
  }

  const targetDistances = [1, 2, 4, 8];

  return {
    kind: "valid",
    domain: { zh: "理想自由场距离衰减", en: "Ideal free-field distance loss" },
    results: targetDistances.map((targetDistance) => ({
      label: `${targetDistance} m`,
      value: `${formatFixed(spl - 20 * Math.log10(targetDistance / distance), 1)} dBSPL`
    })),
    note: {
      zh: "理想自由场、点声源、无墙面反射和空气吸收时，距离翻倍约 -6 dB，距离减半约 +6 dB。",
      en: "In an ideal free field with a point source and no reflections or air absorption, doubling distance is about -6 dB and halving distance is about +6 dB."
    }
  };
}

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
  const [conversionValue, setConversionValue] = useState("94");
  const [conversionUnit, setConversionUnit] = useState<ConversionUnit>("dBSPL");
  const [distanceSpl, setDistanceSpl] = useState("94");
  const [distanceMeters, setDistanceMeters] = useState("1");

  const conversion = useMemo(
    () => calculateConversion(conversionValue, conversionUnit),
    [conversionUnit, conversionValue]
  );
  const distanceCalculation = useMemo(
    () => calculateDistanceLevels(distanceSpl, distanceMeters),
    [distanceMeters, distanceSpl]
  );

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

        <section className="audio-units-calculator-grid" aria-label={language === "zh" ? "单位自动换算工具" : "Automatic unit conversion tools"}>
          <section className="audio-units-tool-card" aria-label={language === "zh" ? "自动换算器" : "Automatic converter"}>
            <div className="codec-mode-concepts-header">
              <strong>{language === "zh" ? "自动换算器" : "Automatic converter"}</strong>
              <span>{language === "zh" ? "理想参考条件下，仅在同一参考域内换算" : "Ideal reference conditions, only within the same reference domain"}</span>
            </div>
            <div className="audio-units-form-grid">
              <label>
                <span>{language === "zh" ? "输入数值" : "Input value"}</span>
                <input
                  aria-label={language === "zh" ? "输入数值" : "Input value"}
                  inputMode="decimal"
                  type="number"
                  value={conversionValue}
                  onChange={(event) => setConversionValue(event.target.value)}
                />
              </label>
              <label>
                <span>{language === "zh" ? "源单位" : "Source unit"}</span>
                <select
                  aria-label={language === "zh" ? "源单位" : "Source unit"}
                  value={conversionUnit}
                  onChange={(event) => setConversionUnit(event.target.value as ConversionUnit)}
                >
                  {conversionUnitOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label[language]}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            {conversion.kind === "invalid" ? (
              <p className="audio-units-error" role="alert">
                {conversion.message[language]}
              </p>
            ) : (
              <>
                <div className="audio-units-result-heading">
                  <strong>{conversion.domain[language]}</strong>
                  <span>{conversionBoundaryNote[language]}</span>
                </div>
                <div className="audio-units-result-grid">
                  {conversion.results.map((result) => (
                    <article className="audio-units-result" key={result.label}>
                      <span>{result.label}</span>
                      <strong>{`${result.label}：${result.value}`}</strong>
                    </article>
                  ))}
                </div>
                {conversion.note ? <p className="audio-units-note-text">{conversion.note[language]}</p> : null}
              </>
            )}
          </section>

          <section className="audio-units-tool-card" aria-label={language === "zh" ? "距离声压衰减计算器" : "Distance SPL loss calculator"}>
            <div className="codec-mode-concepts-header">
              <strong>{language === "zh" ? "距离声压衰减" : "Distance SPL loss"}</strong>
              <span>{language === "zh" ? "理想实验室：自由场、点声源、无反射" : "Ideal lab: free field, point source, no reflections"}</span>
            </div>
            <div className="audio-units-form-grid">
              <label>
                <span>{language === "zh" ? "初始声压级" : "Initial SPL"}</span>
                <input
                  aria-label={language === "zh" ? "初始声压级" : "Initial SPL"}
                  inputMode="decimal"
                  type="number"
                  value={distanceSpl}
                  onChange={(event) => setDistanceSpl(event.target.value)}
                />
              </label>
              <label>
                <span>{language === "zh" ? "初始距离" : "Initial distance"}</span>
                <input
                  aria-label={language === "zh" ? "初始距离" : "Initial distance"}
                  inputMode="decimal"
                  type="number"
                  value={distanceMeters}
                  onChange={(event) => setDistanceMeters(event.target.value)}
                />
              </label>
            </div>
            {distanceCalculation.kind === "invalid" ? (
              <p className="audio-units-error" role="alert">
                {distanceCalculation.message[language]}
              </p>
            ) : (
              <>
                <div className="audio-units-result-heading">
                  <strong>{distanceCalculation.domain[language]}</strong>
                  <span>{distanceCalculation.note?.[language]}</span>
                </div>
                <div className="audio-units-result-grid">
                  {distanceCalculation.results.map((result) => (
                    <article className="audio-units-result" key={result.label}>
                      <span>{result.label}</span>
                      <strong>{`${result.label}：${result.value}`}</strong>
                    </article>
                  ))}
                </div>
              </>
            )}
          </section>
        </section>

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
