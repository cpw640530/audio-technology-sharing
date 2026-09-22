import { ArrowLeft, BookOpen, Gauge, Ruler } from "lucide-react";
import { categories, type Language } from "../content/knowledge";
import { TopicPager } from "./TopicPager";

type AudioUnitsPageProps = {
  language: Language;
  onBack: () => void;
  onOpenLab: () => void;
  onOpenPrevious: () => void;
  onOpenNext: () => void;
};

const audioUnitsTopic = categories
  .find((category) => category.id === "fundamentals")
  ?.topics.find((topic) => topic.title.en === "Sound and Audio Units")!;

if (!audioUnitsTopic) {
  throw new Error("The audio units topic is required for the professional unit guide.");
}

const references: Record<string, Record<Language, string>> = {
  dB: { zh: "比例：必须先说明比较对象", en: "Ratio: always name the compared quantities" },
  dBSPL: { zh: "声压参考：20 µPa", en: "Acoustic reference: 20 µPa" },
  dBFS: { zh: "数字参考：0 dBFS 满刻度", en: "Digital reference: 0 dBFS full scale" },
  "dBu / dBV": { zh: "模拟电压：0.775 / 1 Vrms", en: "Analog voltage: 0.775 / 1 Vrms" }
};

export function AudioUnitsPage({ language, onBack, onOpenLab, onOpenPrevious, onOpenNext }: AudioUnitsPageProps) {
  const detail = audioUnitsTopic.detail;
  const terms = detail.termExplanations ?? [];
  const chain = language === "zh"
    ? ["数字样本 dBFS", "DAC 输出电压", "功放增益", "扬声器灵敏度", "测得 dBSPL"]
    : ["Digital samples dBFS", "DAC output voltage", "Amplifier gain", "Speaker sensitivity", "Measured dBSPL"];

  return (
    <main className="sound-topic-page audio-units-page" aria-labelledby="audio-units-topic-title">
      <header className="sound-topic-hero">
        <button className="sound-topic-back" type="button" onClick={onBack}>
          <ArrowLeft size={17} aria-hidden="true" />
          {language === "zh" ? "返回知识库" : "Back to knowledge base"}
        </button>
        <div className="sound-topic-kicker">
          <BookOpen size={16} aria-hidden="true" />
          {language === "zh" ? "音频基础 · 单位体系" : "Audio fundamentals · Unit system"}
        </div>
        <h1 id="audio-units-topic-title">{audioUnitsTopic.title[language]}</h1>
        <p className="sound-topic-lede">{audioUnitsTopic.summary[language]}</p>
        <div className="sound-topic-meta">
          <span>{language === "zh" ? "参考点" : "Reference points"}</span>
          <span>{language === "zh" ? "电平与响度" : "Level and loudness"}</span>
          <span>{language === "zh" ? "声学测量" : "Acoustic measurement"}</span>
        </div>
      </header>

      <div className="sound-topic-content">
        <section className="sound-topic-section sound-topic-intro">

          <div>
            <h2>{language === "zh" ? "先问：这个 dB 相对于什么？" : "First ask: relative to what?"}</h2>
            <p>{detail.explanation[language]}</p>
          </div>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading">

            <div>
              <h2>{language === "zh" ? "同一个 dB，不同的参考点" : "The same dB, different references"}</h2>
              <p>{language === "zh" ? "后缀决定它属于声压、电压、功率还是数字系统。先分域，再比较数值。" : "The suffix tells you whether the value belongs to pressure, voltage, power, or a digital system. Identify the domain before comparing numbers."}</p>
            </div>
          </div>
          <div className="audio-units-reference-grid">
            {terms.slice(0, 4).map((term) => (
              <article key={term.name.en} className="audio-units-reference">
                <h3>{term.name[language]}</h3>
                <span>{references[term.name.en]?.[language]}</span>
                <p>{term.explanation[language]}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading">

            <div>
              <h2>{language === "zh" ? "从数字电平到真实声压" : "From digital level to real SPL"}</h2>
              <p>{language === "zh" ? "dBFS 不是 dBSPL。中间要经过硬件增益、扬声器和测量距离。" : "dBFS is not dBSPL. Hardware gain, the speaker, and measurement distance sit between them."}</p>
            </div>
          </div>
          <ol className="sound-topic-flow audio-units-chain" aria-label={language === "zh" ? "数字电平到声压的链路" : "Digital level to SPL chain"}>
            {chain.map((step, index) => (
              <li key={step}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{step}</strong>
              </li>
            ))}
          </ol>
          <div className="audio-units-formulas">
            <div>
              <Gauge size={18} aria-hidden="true" />
              <code>dBSPL = 20 log10(p / 20 µPa)</code>
              <p>{language === "zh" ? "声压级使用 20 µPa 作为参考，94 dBSPL 约等于 1 Pa。" : "SPL uses 20 µPa as its reference; 94 dBSPL is approximately 1 Pa."}</p>
            </div>
            <div>
              <Ruler size={18} aria-hidden="true" />
              <code>samples = sampleRate × time</code>
              <p>{language === "zh" ? "48 kHz 下，480 samples 对应 10 ms；这是数字延迟，不是声压。" : "At 48 kHz, 480 samples equal 10 ms; this is digital latency, not acoustic pressure."}</p>
            </div>
          </div>
          <p className="sound-topic-note">{language === "zh" ? "不能把 -6 dBFS 直接换成 94 dBSPL：必须知道 DAC 满刻度电压、功放增益、扬声器灵敏度和测量距离。" : "You cannot directly convert -6 dBFS to 94 dBSPL: DAC full-scale voltage, amplifier gain, speaker sensitivity, and measurement distance must be known."}</p>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading">

            <div>
              <h2>{language === "zh" ? "常见单位词典" : "Common unit glossary"}</h2>
              <p>{language === "zh" ? "把常用符号放回真实工程场景，而不是孤立背定义。" : "Put common symbols back into real engineering contexts instead of memorizing isolated definitions."}</p>
            </div>
          </div>
          <div className="sound-topic-glossary">
            {terms.map((term) => (
              <article key={term.name.en}>
                <h3>{term.name[language]}</h3>
                <p>{term.explanation[language]}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="sound-topic-section sound-topic-bottom-grid">
          <div>

            <h2>{language === "zh" ? "换算前先确认边界" : "Check the boundary before converting"}</h2>
            <p>{detail.misconception[language]}</p>
          </div>
          <div className="sound-topic-cta">
            <Gauge size={22} aria-hidden="true" />
            <h2>{language === "zh" ? "进入换算实验室" : "Open the conversion lab"}</h2>
            <p>{language === "zh" ? "输入源单位和数值，观察同一参考域内的等效结果，并用距离计算器理解理想自由场衰减。" : "Enter a source unit and value, inspect equivalent results inside one reference domain, and use the distance calculator to understand ideal free-field loss."}</p>
            <button className="diagram-open-button" type="button" onClick={onOpenLab}>
              {detail.lab?.buttonLabel[language]}
            </button>
          </div>
        </section>
      </div>
      <TopicPager language={language} onPrevious={onOpenPrevious} onBack={onBack} onNext={onOpenNext} />
    </main>
  );
}
