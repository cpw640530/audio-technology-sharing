import type { ReactNode } from "react";
import { TopicReadingLayout } from "./TopicReadingLayout";
import { ArrowLeft, BookOpen, CircuitBoard } from "lucide-react";
import type { Category, Language, Topic } from "../content/knowledge";
import { TopicPager } from "./TopicPager";

type DisplayTopic = Topic & { category: Category };

type SpeechEnhancementPageProps = {
  relatedTopics?: ReactNode;
  language: Language;
  topic: DisplayTopic;
  onBack: () => void;
  onOpenLab: () => void;
  onOpenPrevious?: () => void;
  onOpenNext?: () => void;
};

const stages = [
  {
    number: "01",
    title: { zh: "采集与同步", en: "Capture and sync" },
    detail: { zh: "Mic / PDM / I2S 进入驱动 buffer，形成固定帧 PCM；多麦通道需要同步。", en: "Mic / PDM / I2S enters driver buffers as fixed PCM frames; multi-mic channels must be synchronized." }
  },
  {
    number: "02",
    title: { zh: "空间处理", en: "Spatial processing" },
    detail: { zh: "仅在多麦阵列中做 DOA、波束成形和定向拾音，单麦跳过这一层。", en: "DOA, beamforming, and directional pickup require a mic array; single-mic capture skips this stage." }
  },
  {
    number: "03",
    title: { zh: "回声与噪声处理", en: "Echo and noise processing" },
    detail: { zh: "AEC 使用播放回采 reference，随后 NS / ANR 估计并抑制噪声频段。", en: "AEC uses a playback reference, followed by NS / ANR to estimate and suppress noisy bands." }
  },
  {
    number: "04",
    title: { zh: "尾音与电平控制", en: "Tail and level control" },
    detail: { zh: "去混响减弱后期拖尾，AGC / Limiter 稳定语音包络和峰值。", en: "Dereverb reduces late tails, while AGC / limiter stabilizes the speech envelope and peaks." }
  },
  {
    number: "05",
    title: { zh: "交给上层应用", en: "Hand off upstream" },
    detail: { zh: "处理后的 PCM 可送给 AENC、ASR、录音或通信链路。", en: "Processed PCM can go to AENC, ASR, recording, or a communication pipeline." }
  }
];

const moduleCards = [
  {
    title: { zh: "AEC 回声消除", en: "AEC echo cancellation" },
    input: { zh: "麦克风 PCM + 播放回采 reference", en: "Mic PCM + playback reference" },
    output: { zh: "减弱扬声器经空间传播后返回麦克风的回声", en: "Reduced echo returning from the speaker path" }
  },
  {
    title: { zh: "NS / ANR 降噪", en: "NS / ANR noise suppression" },
    input: { zh: "AEC 后的短帧 PCM / 频谱", en: "Short PCM frames or spectra after AEC" },
    output: { zh: "保留语音、降低噪声占比高的频段", en: "Speech-preserving attenuation of noise-dominant bands" }
  },
  {
    title: { zh: "去混响", en: "Dereverberation" },
    input: { zh: "包含房间反射拖尾的语音", en: "Speech containing room-reflection tails" },
    output: { zh: "更短、更清楚但不过度发干的语音", en: "Clearer speech with reduced but not erased room tails" }
  },
  {
    title: { zh: "AGC / Limiter", en: "AGC / limiter" },
    input: { zh: "语音包络和峰值", en: "Speech envelope and peaks" },
    output: { zh: "稳定电平并避免数字削波", en: "Stable level without digital clipping" }
  }
];

export function SpeechEnhancementPage({ relatedTopics, language, topic, onBack, onOpenLab, onOpenPrevious, onOpenNext }: SpeechEnhancementPageProps) {
  const detail = topic.detail;

  return (
    <main className="sound-topic-page speech-enhancement-topic-page" aria-labelledby="speech-enhancement-topic-title">
      <header className="sound-topic-hero">
        <button className="sound-topic-back" type="button" onClick={onBack}>
          <ArrowLeft size={17} aria-hidden="true" />
          {language === "zh" ? "返回知识库" : "Back to knowledge base"}
        </button>
        <div className="sound-topic-kicker"><BookOpen size={16} aria-hidden="true" />{language === "zh" ? "传统算法 · 专业内容" : "Traditional DSP · Deep dive"}</div>
        <h1 id="speech-enhancement-topic-title">{topic.title[language]}</h1>
        <p className="sound-topic-lede">{topic.summary[language]}</p>
        <div className="sound-topic-meta">
          <span>{language === "zh" ? "采集侧 VQE / 3A" : "Capture-side VQE / 3A"}</span>
          <span>{language === "zh" ? "回采与多麦" : "Reference and arrays"}</span>
          <span>{language === "zh" ? "实验验证" : "Hands-on lab"}</span>
        </div>
      </header>

      <TopicReadingLayout language={language}>
        <section className="sound-topic-section sound-topic-intro">
          <div>
            <h2>{language === "zh" ? "语音增强是一条有顺序的 PCM 链路" : "Speech enhancement is an ordered PCM chain"}</h2>
            <p>{detail.explanation[language]}</p>
          </div>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading"><div>
            <h2>{language === "zh" ? "从麦克风到 ASR 的典型流程" : "A typical path from microphone to ASR"}</h2>
            <p>{language === "zh" ? "这是一个典型链路，不是所有 SDK 的固定顺序。AEC 可以在各麦通道上先处理，也可以位于波束成形之后；应以具体 SDK 的参考信号、通道配置和模块依赖为准。" : "This is one typical chain, not a universal SDK order. AEC may run per microphone before beamforming or after it; follow the SDK's reference routing, channel configuration, and module dependencies."}</p>
          </div></div>
          <ol className="speech-topic-stages" aria-label={language === "zh" ? "语音增强处理流程" : "Speech enhancement processing flow"}>
            {stages.map((stage) => <li key={stage.number}><span>{stage.number}</span><strong>{stage.title[language]}</strong><p>{stage.detail[language]}</p></li>)}
          </ol>
          <p className="sound-topic-note">{language === "zh" ? "关键依赖：AEC 不是只看麦克风信号，它必须拿到与回声时间对齐的播放 reference；多麦波束成形也不是单麦算法，至少需要同步的多路采集。" : "Key dependencies: AEC needs a playback reference aligned with the microphone echo, and beamforming is not a single-mic algorithm; it needs synchronized channels."}</p>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading"><div>
            <h2>{language === "zh" ? "每个模块负责什么" : "What each module is responsible for"}</h2>
            <p>{language === "zh" ? "把输入、输出和副作用分开，才能知道应该调整哪一个模块。" : "Separate inputs, outputs, and side effects to know which module to tune."}</p>
          </div></div>
          <div className="speech-topic-modules">
            {moduleCards.map((module) => <article key={module.title.en}><h3>{module.title[language]}</h3><dl><div><dt>{language === "zh" ? "输入" : "Input"}</dt><dd>{module.input[language]}</dd></div><div><dt>{language === "zh" ? "输出" : "Output"}</dt><dd>{module.output[language]}</dd></div></dl></article>)}
          </div>
        </section>

        <section className="sound-topic-section speech-enhancement-topic-lab-entry" aria-label={language === "zh" ? "当前主题实验室入口" : "Current topic lab entry"}>
          <div className="sound-topic-cta"><CircuitBoard size={22} aria-hidden="true" /><h2>{language === "zh" ? "进入语音增强实验室" : "Open the speech enhancement lab"}</h2><p>{detail.lab?.description[language]}</p><button className="diagram-open-button" type="button" onClick={onOpenLab}>{detail.lab?.buttonLabel[language]}</button></div>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading"><div><h2>{language === "zh" ? "核心知识点" : "Core concepts"}</h2><p>{language === "zh" ? "工程上要同时看清晰度、自然度、延迟和算力。" : "Engineering decisions must balance clarity, naturalness, latency, and compute."}</p></div></div>
          <div className="sound-topic-glossary speech-topic-key-points">{detail.keyConcepts.map((concept) => <article key={concept.en}><p>{concept[language]}</p></article>)}</div>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading"><div><h2>{language === "zh" ? "算法术语" : "Algorithm terms"}</h2><p>{language === "zh" ? "详细公式、波形和 SoC 处理图留在实验室中展开。" : "Detailed formulas, waveforms, and SoC process diagrams stay in the lab."}</p></div></div>
          <div className="sound-topic-glossary">{detail.termExplanations?.map((term) => <article key={term.name.en}><h3>{term.name[language]}</h3><p>{term.explanation[language]}</p></article>)}</div>
        </section>

        <section className="sound-topic-section"><div><h2>{language === "zh" ? "工程边界" : "Engineering boundary"}</h2><p>{detail.misconception[language]}</p></div></section>
      </TopicReadingLayout>
      {relatedTopics}
      <TopicPager language={language} onBack={onBack} onPrevious={onOpenPrevious} onNext={onOpenNext} />
    </main>
  );
}
