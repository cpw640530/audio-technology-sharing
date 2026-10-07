import { ArrowLeft, BookOpen, CircuitBoard } from "lucide-react";
import type { Category, Language, Topic } from "../content/knowledge";
import { TopicPager } from "./TopicPager";

type DisplayTopic = Topic & { category: Category };

type RealtimeAudioPageProps = {
  language: Language;
  topic: DisplayTopic;
  onBack: () => void;
  onOpenLab: () => void;
  onOpenPrevious?: () => void;
  onOpenNext?: () => void;
};

const realtimeStages = [
  {
    title: { zh: "一块数据到来", en: "A block arrives" },
    detail: { zh: "驱动或音频服务交付固定数量的 PCM 帧。", en: "The driver or audio service delivers a fixed block of PCM frames." }
  },
  {
    title: { zh: "开始计时", en: "The clock starts" },
    detail: { zh: "采样率和帧数决定下一次交付前的 deadline。", en: "Sample rate and frame count determine the deadline before the next delivery." }
  },
  {
    title: { zh: "完成处理", en: "Processing completes" },
    detail: { zh: "滤波、混音、AEC、编码等工作必须在预算内完成。", en: "Filtering, mixing, AEC, encoding, and other work must fit the budget." }
  },
  {
    title: { zh: "按时交付", en: "Handoff on time" },
    detail: { zh: "输出端拿到新数据，或输入端及时取走数据；否则出现 XRUN。", en: "The output receives new data or the input is read in time; otherwise an XRUN occurs." }
  }
];

export function RealtimeAudioPage({ language, topic, onBack, onOpenLab, onOpenPrevious, onOpenNext }: RealtimeAudioPageProps) {
  const detail = topic.detail;
  const terms = detail.termExplanations ?? [];

  return (
    <main className="sound-topic-page realtime-topic-page" aria-labelledby="realtime-topic-title">
      <header className="sound-topic-hero">
        <button className="sound-topic-back" type="button" onClick={onBack}>
          <ArrowLeft size={17} aria-hidden="true" />
          {language === "zh" ? "返回知识库" : "Back to knowledge base"}
        </button>
        <div className="sound-topic-kicker">
          <BookOpen size={16} aria-hidden="true" />
          {language === "zh" ? "音频软件 · 实时系统专题" : "Audio software · Real-time systems"}
        </div>
        <h1 id="realtime-topic-title">{topic.title[language]}</h1>
        <p className="sound-topic-lede">{topic.summary[language]}</p>
        <div className="sound-topic-meta">
          <span>{language === "zh" ? "时间预算" : "Time budget"}</span>
          <span>{language === "zh" ? "线程与 buffer" : "Threads and buffers"}</span>
          <span>{language === "zh" ? "实验验证" : "Hands-on lab"}</span>
        </div>
      </header>

      <div className="sound-topic-content">
        <section className="sound-topic-section sound-topic-intro">
          <div>
            <h2>{language === "zh" ? "实时的关键是按时完成" : "Real-time means finishing on time"}</h2>
            <p>{detail.explanation[language]}</p>
          </div>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading">
            <div>
              <h2>{language === "zh" ? "一块 PCM 如何经过实时处理" : "How one PCM block moves through real-time processing"}</h2>
              <p>{language === "zh" ? "这不是普通的离线流程：每一步都受到固定时间窗口约束。" : "This is not an offline pipeline: every step is constrained by a fixed time window."}</p>
            </div>
          </div>
          <ol className="realtime-topic-stages" aria-label={language === "zh" ? "实时音频处理阶段" : "Real-time audio processing stages"}>
            {realtimeStages.map((stage, index) => (
              <li key={stage.title.en}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <strong>{stage.title[language]}</strong>
                  <p>{stage.detail[language]}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="sound-topic-note">
            {language === "zh"
              ? "ALSA 负责设备与 PCM 交付；实时处理关注交付之间的时间预算；具体 DSP 算法再决定这段预算会被消耗多少。"
              : "ALSA handles device and PCM delivery; real-time processing manages the time budget between deliveries; the DSP algorithm determines how much of that budget is consumed."}
          </p>
        </section>

        <section className="sound-topic-section realtime-topic-lab-entry" aria-label={language === "zh" ? "实时音频实验室入口" : "Real-time audio lab entry"}>
          <div className="sound-topic-cta">
            <CircuitBoard size={22} aria-hidden="true" />
            <h2>{language === "zh" ? "进入实时音频处理实验室" : "Open the real-time audio processing lab"}</h2>
            <p>{language === "zh" ? "调整采样率、buffer 帧数、DSP 耗时和 CPU 抖动，观察 deadline、延迟和 XRUN 风险的关系。" : "Adjust sample rate, buffer frames, DSP time, and CPU jitter to observe deadline, latency, and XRUN risk."}</p>
            <button className="diagram-open-button" type="button" onClick={onOpenLab}>
              {detail.lab?.buttonLabel[language]}
            </button>
          </div>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading">
            <div>
              <h2>{language === "zh" ? "核心判断" : "Core decisions"}</h2>
              <p>{language === "zh" ? "先建立实时系统的取舍，再进入 buffer 和 XRUN 的具体排查。" : "Understand the real-time trade-offs before debugging buffers and XRUNs."}</p>
            </div>
          </div>
          <div className="sound-topic-glossary realtime-topic-key-points">
            {detail.keyConcepts.map((concept) => <article key={concept.en}><p>{concept[language]}</p></article>)}
          </div>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading">
            <div>
              <h2>{language === "zh" ? "实时术语" : "Real-time terms"}</h2>
              <p>{language === "zh" ? "将参数、现象和处理策略放回同一条时间线上。" : "Place parameters, symptoms, and mitigation on the same timeline."}</p>
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

        <section className="sound-topic-section">
          <div>
            <h2>{language === "zh" ? "工程边界" : "Engineering boundary"}</h2>
            <p>{detail.misconception[language]}</p>
          </div>
        </section>
      </div>
      <TopicPager language={language} onBack={onBack} onPrevious={onOpenPrevious} onNext={onOpenNext} />
    </main>
  );
}
