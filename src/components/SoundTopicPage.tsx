import { ArrowLeft, BookOpen, Waves } from "lucide-react";
import { categories, type Language } from "../content/knowledge";
import { SoundWaveDiagram } from "./TopicDetails";

type SoundTopicPageProps = {
  language: Language;
  onBack: () => void;
  onOpenLab: () => void;
};

const soundTopic = categories
  .find((category) => category.id === "fundamentals")
  ?.topics.find((topic) => topic.title.en === "What Sound Is")!;

if (!soundTopic) {
  throw new Error("The sound topic is required for the professional sound guide.");
}

export function SoundTopicPage({ language, onBack, onOpenLab }: SoundTopicPageProps) {
  const detail = soundTopic.detail;
  const terms = detail.termExplanations ?? [];
  const flow = language === "zh"
    ? ["声源振动", "空气压力 Δp", "麦克风膜片", "模拟电压", "ADC 采样与量化", "PCM 样本"]
    : ["Source vibration", "Air pressure Δp", "Microphone diaphragm", "Analog voltage", "ADC sampling and quantization", "PCM samples"];

  return (
    <main className="sound-topic-page" aria-labelledby="sound-topic-title">
      <header className="sound-topic-hero">
        <button className="sound-topic-back" type="button" onClick={onBack}>
          <ArrowLeft size={17} aria-hidden="true" />
          {language === "zh" ? "返回知识库" : "Back to knowledge base"}
        </button>
        <div className="sound-topic-kicker">
          <BookOpen size={16} aria-hidden="true" />
          {language === "zh" ? "音频基础 · 专业内容" : "Audio fundamentals · Deep dive"}
        </div>
        <h1 id="sound-topic-title">{soundTopic.title[language]}</h1>
        <p className="sound-topic-lede">{soundTopic.summary[language]}</p>
        <div className="sound-topic-meta">
          <span>{language === "zh" ? "物理声学" : "Acoustics"}</span>
          <span>{language === "zh" ? "信号模型" : "Signal model"}</span>
          <span>{language === "zh" ? "采集前端" : "Capture front end"}</span>
        </div>
      </header>

      <div className="sound-topic-content">
        <section className="sound-topic-section sound-topic-intro">
          <span className="sound-topic-index">01</span>
          <div>
            <h2>{language === "zh" ? "先建立一个准确的直觉" : "Start with the right intuition"}</h2>
            <p>{detail.explanation[language]}</p>
          </div>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading">
            <span className="sound-topic-index">02</span>
            <div>
              <h2>{language === "zh" ? "从振动到 PCM：一条工程链路" : "From vibration to PCM: the engineering chain"}</h2>
              <p>{language === "zh" ? "每一步都改变信号的表达方式，但物理量和数字量不能混为一谈。" : "Each step changes the representation, but physical and digital quantities must not be conflated."}</p>
            </div>
          </div>
          <ol className="sound-topic-flow" aria-label={language === "zh" ? "声音采集工程链路" : "Sound capture engineering chain"}>
            {flow.map((step, index) => (
              <li key={step}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{step}</strong>
              </li>
            ))}
          </ol>
          <p className="sound-topic-note">{terms.find((term) => term.name.en === "From pressure to PCM")?.explanation[language]}</p>
        </section>

        <section className="sound-topic-section sound-topic-model-section">
          <div className="sound-topic-section-heading">
            <span className="sound-topic-index">03</span>
            <div>
              <h2>{language === "zh" ? "用一个正弦模型读懂声音" : "Read sound through a sine model"}</h2>
              <p>{language === "zh" ? "正弦波不是所有声音，但它是理解频率、振幅和相位最清晰的起点。" : "A sine wave is not every sound, but it is the clearest starting point for frequency, amplitude, and phase."}</p>
            </div>
          </div>
          <div className="sound-topic-model-grid">
            <div className="sound-topic-formula-block">
              <code>Δp(t) = Â · sin(2πft + φ)</code>
              <dl>
                <div><dt>Â</dt><dd>{language === "zh" ? "峰值声压，决定压力变化的幅度" : "Peak pressure; the size of the pressure variation"}</dd></div>
                <div><dt>f</dt><dd>{language === "zh" ? "频率，决定周期快慢，T = 1/f" : "Frequency; cycle rate, T = 1/f"}</dd></div>
                <div><dt>φ</dt><dd>{language === "zh" ? "初相位，决定从周期的哪个位置开始" : "Initial phase; where the cycle starts"}</dd></div>
              </dl>
              <p>{language === "zh" ? "在空气中还可以用 λ = c/f 估算空间波长，20°C 时 c 约为 343 m/s。" : "In air, spatial wavelength can be estimated with λ = c/f; at 20°C, c is about 343 m/s."}</p>
            </div>
            {detail.diagram?.type === "sound-wave" ? (
              <SoundWaveDiagram caption={detail.diagram.caption} label={detail.diagram.label} language={language} />
            ) : null}
          </div>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading">
            <span className="sound-topic-index">04</span>
            <div>
              <h2>{language === "zh" ? "核心概念词典" : "Core concept glossary"}</h2>
              <p>{language === "zh" ? "把物理量、听感和工程单位放在同一张地图上。" : "Put physical quantities, perception, and engineering units on one map."}</p>
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
            <span className="sound-topic-index">05</span>
            <h2>{language === "zh" ? "两个必须记住的边界" : "Two boundaries to remember"}</h2>
            <p>{detail.misconception[language]}</p>
          </div>
          <div className="sound-topic-cta">
            <Waves size={22} aria-hidden="true" />
            <h2>{language === "zh" ? "继续动手验证" : "Keep experimenting"}</h2>
            <p>{language === "zh" ? "用实验室调节频率、振幅和相位，把公式和听感对应起来。" : "Use the lab to connect frequency, amplitude, and phase with the formula and what you hear."}</p>
            <button className="diagram-open-button" type="button" onClick={onOpenLab}>
              {detail.lab?.buttonLabel[language]}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
