import type { ReactNode } from "react";
import { TopicReadingLayout } from "./TopicReadingLayout";
import { ArrowLeft, BookOpen, CircuitBoard } from "lucide-react";
import type { Category, Language, Topic } from "../content/knowledge";
import { TopicPager } from "./TopicPager";

type DisplayTopic = Topic & { category: Category };

type SpatialAudioPageProps = {
  relatedTopics?: ReactNode;
  language: Language;
  topic: DisplayTopic;
  onBack: () => void;
  onOpenLab: () => void;
  onOpenPrevious?: () => void;
};

const spatialFlow = [
  {
    number: "01",
    title: { zh: "内容与声源", en: "Content and sources" },
    detail: { zh: "输入单声道素材、声道床或带位置元数据的对象音频。", en: "Start with mono assets, a channel bed, or objects carrying position metadata." }
  },
  {
    number: "02",
    title: { zh: "空间线索", en: "Spatial cues" },
    detail: { zh: "计算角度、距离、ITD、ILD、耳廓滤波和房间反射。", en: "Compute angle, distance, ITD, ILD, pinna filtering, and room reflections." }
  },
  {
    number: "03",
    title: { zh: "渲染与映射", en: "Render and map" },
    detail: { zh: "耳机使用 HRIR 卷积；扬声器使用布局、延迟、增益和校正。", en: "Headphones use HRIR convolution; speakers use layout, delay, gain, and calibration." }
  },
  {
    number: "04",
    title: { zh: "播放声场", en: "Playback field" },
    detail: { zh: "输出双耳 PCM 或多扬声器信号，听者据此感知方向和距离。", en: "Output binaural PCM or multi-speaker signals for perceived direction and distance." }
  }
];

export function SpatialAudioPage({ relatedTopics, language, topic, onBack, onOpenLab, onOpenPrevious }: SpatialAudioPageProps) {
  const detail = topic.detail;

  return (
    <main className="sound-topic-page spatial-topic-page" aria-labelledby="spatial-topic-title">
      <header className="sound-topic-hero">
        <button className="sound-topic-back" type="button" onClick={onBack}>
          <ArrowLeft size={17} aria-hidden="true" />
          {language === "zh" ? "返回知识库" : "Back to knowledge base"}
        </button>
        <div className="sound-topic-kicker"><BookOpen size={16} aria-hidden="true" />{language === "zh" ? "传统算法 · 专业内容" : "Traditional DSP · Deep dive"}</div>
        <h1 id="spatial-topic-title">{topic.title[language]}</h1>
        <p className="sound-topic-lede">{topic.summary[language]}</p>
        <div className="sound-topic-meta">
          <span>{language === "zh" ? "空间定位" : "Localization"}</span>
          <span>{language === "zh" ? "双耳渲染" : "Binaural rendering"}</span>
          <span>{language === "zh" ? "头部追踪" : "Head tracking"}</span>
        </div>
      </header>

      <TopicReadingLayout language={language}>
        <section className="sound-topic-section sound-topic-intro">
          <div>
            <h2>{language === "zh" ? "空间音频先解决一个问题：声音应该位于哪里" : "Spatial audio answers one question first: where should a sound be?"}</h2>
            <p>{detail.explanation[language]}</p>
          </div>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading"><div>
            <h2>{language === "zh" ? "从声源到空间声场" : "From source to spatial field"}</h2>
            <p>{language === "zh" ? "空间音频不是把左右声道简单拉宽，而是把内容、空间线索和播放设备连接成一条渲染链路。" : "Spatial audio is not simply widening stereo; it connects content, spatial cues, and playback hardware in one rendering path."}</p>
          </div></div>
          <ol className="spatial-topic-flow" aria-label={language === "zh" ? "空间音频处理流程" : "Spatial audio processing flow"}>
            {spatialFlow.map((stage) => <li key={stage.number}><span>{stage.number}</span><h3>{stage.title[language]}</h3><p>{stage.detail[language]}</p></li>)}
          </ol>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading"><div>
            <h2>{language === "zh" ? "耳机与扬声器是两条输出路径" : "Headphones and speakers are two output paths"}</h2>
            <p>{language === "zh" ? "相同的空间对象，必须针对不同播放设备重新渲染，不能直接复用同一组左右声道。" : "The same spatial object must be rendered for the playback device; one fixed stereo pair cannot serve every output."}</p>
          </div></div>
          <div className="spatial-topic-output-grid">
            <article>
              <h3>{language === "zh" ? "耳机：双耳渲染" : "Headphones: binaural rendering"}</h3>
              <p>{language === "zh" ? "渲染器根据声源方位选择对应 HRIR，并分别与左、右耳滤波器卷积，再叠加距离衰减和房间响应，输出两路双耳 PCM。头部追踪开启后，声源的世界坐标还要实时转换为相对头部的角度。" : "The renderer selects direction-specific HRIRs, convolves the source with left and right filters, then adds distance loss and room response to produce binaural PCM. With head tracking, world coordinates are continuously converted to head-relative angles."}</p>
            </article>
            <article>
              <h3>{language === "zh" ? "扬声器：声道与对象映射" : "Speakers: channel and object mapping"}</h3>
              <p>{language === "zh" ? "渲染器把声道床或对象音频分配到实际扬声器，例如 5.1、7.1、Atmos 或车载多扬声器布局，并通过延迟、增益、EQ 和房间校正让声像落在正确位置。" : "The renderer maps a channel bed or objects to real layouts such as 5.1, 7.1, Atmos, or in-car speakers, using delay, gain, EQ, and room correction to place images correctly."}</p>
            </article>
          </div>
        </section>

        <section className="sound-topic-section spatial-topic-lab-entry" aria-label={language === "zh" ? "当前主题实验室入口" : "Current topic lab entry"}>
          <div className="sound-topic-cta"><CircuitBoard size={22} aria-hidden="true" /><h2>{language === "zh" ? "进入空间音频实验室" : "Open the spatial audio lab"}</h2><p>{detail.lab?.description[language]}</p><button className="diagram-open-button" type="button" onClick={onOpenLab}>{detail.lab?.buttonLabel[language]}</button></div>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading"><div><h2>{language === "zh" ? "核心知识点" : "Core concepts"}</h2><p>{language === "zh" ? "先分清定位线索、内容格式和渲染器，再理解具体标准。" : "Separate localization cues, content formats, and renderers before studying specific standards."}</p></div></div>
          <div className="sound-topic-glossary spatial-topic-key-points">{detail.keyConcepts.map((concept) => <article key={concept.en}><p>{concept[language]}</p></article>)}</div>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading"><div><h2>{language === "zh" ? "空间音频术语" : "Spatial audio terms"}</h2><p>{language === "zh" ? "这些术语描述的是线索、表示方式或播放阶段。" : "These terms describe cues, representations, or playback stages."}</p></div></div>
          <div className="sound-topic-glossary">{detail.termExplanations?.map((term) => <article key={term.name.en}><h3>{term.name[language]}</h3><p>{term.explanation[language]}</p></article>)}</div>
        </section>

        <section className="sound-topic-section"><div><h2>{language === "zh" ? "工程边界" : "Engineering boundary"}</h2><p>{detail.misconception[language]}</p></div></section>
      </TopicReadingLayout>
      {relatedTopics}
      <TopicPager language={language} onBack={onBack} onPrevious={onOpenPrevious} />
    </main>
  );
}
