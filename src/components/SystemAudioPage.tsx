import { ArrowLeft, BookOpen, CircuitBoard } from "lucide-react";
import type { Category, Language, Topic } from "../content/knowledge";
import { TopicPager } from "./TopicPager";

type DisplayTopic = Topic & { category: Category };

type SystemAudioPageProps = {
  language: Language;
  topic: DisplayTopic;
  onBack: () => void;
  onOpenLab: () => void;
  onOpenPrevious?: () => void;
  onOpenNext?: () => void;
};

const systemLayers = [
  {
    number: "01",
    title: { zh: "应用请求", en: "Application request" },
    description: { zh: "播放器、会议、录音或语音助手提出播放/采集需求。", en: "A player, meeting app, recorder, or voice assistant requests playback or capture." }
  },
  {
    number: "02",
    title: { zh: "策略与会话", en: "Policy and session" },
    description: { zh: "系统处理权限、设备选择、路由、混音和格式协商。", en: "The system handles permissions, device choice, routing, mixing, and format negotiation." }
  },
  {
    number: "03",
    title: { zh: "用户态音频接口", en: "User-space audio interface" },
    description: { zh: "把应用可见的音频流交给平台接口；Linux 中常见 ALSA、PipeWire 等。", en: "Platform interfaces deliver application streams; Linux commonly uses ALSA, PipeWire, and related layers." }
  },
  {
    number: "04",
    title: { zh: "驱动与硬件", en: "Driver and hardware" },
    description: { zh: "驱动管理 DMA、时钟和设备寄存器，最后连接 Codec、功放或 ADC。", en: "Drivers manage DMA, clocks, and registers before reaching a Codec, amplifier, or ADC." }
  }
];

const systemModes = [
  {
    title: { zh: "播放", en: "Playback" },
    direction: { zh: "应用 → 设备", en: "App → device" },
    description: { zh: "应用提交 PCM，系统完成路由与混音，驱动把数据送到 DAC、功放和扬声器。", en: "The app submits PCM; the system routes and mixes it, and the driver sends it to the DAC, amplifier, and speaker." }
  },
  {
    title: { zh: "采集", en: "Capture" },
    direction: { zh: "设备 → 应用", en: "Device → app" },
    description: { zh: "麦克风和 ADC 产生 PCM，驱动与系统完成输入选择、权限检查，再交给应用。", en: "The microphone and ADC produce PCM; the driver and system handle input selection and permission before delivering it to the app." }
  },
  {
    title: { zh: "全双工", en: "Full duplex" },
    direction: { zh: "两条方向相反的流", en: "Two opposite flows" },
    description: { zh: "通话同时播放和采集；系统要协调两条流的设备、时钟、权限与会话。", en: "A call captures and plays at once; the system coordinates devices, clocks, permissions, and the session for both streams." }
  }
];

export function SystemAudioPage({
  language,
  topic,
  onBack,
  onOpenLab,
  onOpenPrevious,
  onOpenNext
}: SystemAudioPageProps) {
  const detail = topic.detail;
  const terms = detail.termExplanations ?? [];

  return (
    <main className="sound-topic-page system-topic-page" aria-labelledby="system-topic-title">
      <header className="sound-topic-hero">
        <button className="sound-topic-back" type="button" onClick={onBack}>
          <ArrowLeft size={17} aria-hidden="true" />
          {language === "zh" ? "返回知识库" : "Back to knowledge base"}
        </button>
        <div className="sound-topic-kicker">
          <BookOpen size={16} aria-hidden="true" />
          {language === "zh" ? "音频软件 · 专业内容" : "Audio software · Deep dive"}
        </div>
        <h1 id="system-topic-title">{topic.title[language]}</h1>
        <p className="sound-topic-lede">{topic.summary[language]}</p>
        <div className="sound-topic-meta">
          <span>{language === "zh" ? "系统边界" : "System boundaries"}</span>
          <span>{language === "zh" ? "请求与路由" : "Requests and routing"}</span>
          <span>{language === "zh" ? "实验验证" : "Hands-on lab"}</span>
        </div>
      </header>

      <div className="sound-topic-content">
        <section className="sound-topic-section sound-topic-intro">
          <div>
            <h2>{language === "zh" ? "先建立系统地图" : "Build the system map first"}</h2>
            <p>{detail.explanation[language]}</p>
          </div>
        </section>

        {detail.chainContext ? (
          <section className="details-chain-context hardware-chain-context" aria-label={language === "zh" ? "当前模块在音频链路中的位置" : "Current module in the audio chain"}>
            <div className="details-chain-heading">
              <strong>{language === "zh" ? "它在整条音频链路中的位置" : "Where this module fits"}</strong>
              <span>{detail.chainContext.stage[language]}</span>
            </div>
            <div className="details-chain-grid">
              <div><small>{language === "zh" ? "输入" : "Input"}</small><p>{detail.chainContext.input[language]}</p></div>
              <div><small>{language === "zh" ? "本模块输出" : "Module output"}</small><p>{detail.chainContext.output[language]}</p></div>
              <div><small>{language === "zh" ? "下一站" : "Next"}</small><p>{detail.chainContext.next[language]}</p></div>
            </div>
          </section>
        ) : null}

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading">
            <div>
              <h2>{language === "zh" ? "系统如何管理一条音频流" : "How the system manages an audio stream"}</h2>
              <p>{language === "zh" ? "这四层是系统级边界：播放通常从左向右，采集方向相反，全双工同时存在两条流。" : "These four layers define the system boundary: playback usually moves left to right, capture reverses it, and full duplex has both flows at once."}</p>
            </div>
          </div>
          <ol className="system-topic-flow" aria-label={language === "zh" ? "系统音频请求流程" : "System audio request flow"}>
            {systemLayers.map((layer) => (
              <li key={layer.number}>
                <span>{layer.number}</span>
                <div>
                  <strong>{layer.title[language]}</strong>
                  <p>{layer.description[language]}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="sound-topic-note">
            {language === "zh"
              ? "边界提醒：ALSA 负责 Linux 设备接口与 PCM 传输；实时音频卡片负责 deadline、buffer 和 XRUN；DSP 算法卡片负责对信号本身做处理。"
              : "Boundary note: ALSA covers Linux device interfaces and PCM transport; the real-time audio card covers deadlines, buffers, and XRUNs; DSP cards cover signal processing."}
          </p>
        </section>

        <section className="sound-topic-section system-topic-modes">
          <div className="sound-topic-section-heading">
            <div>
              <h2>{language === "zh" ? "先分清三种数据方向" : "Separate the three data directions"}</h2>
              <p>{language === "zh" ? "系统架构相同，但数据方向和设备占用方式不同；理解这一点再进入实验室会更容易。" : "The architecture is shared, but data direction and device ownership differ; this makes the lab flows easier to read."}</p>
            </div>
          </div>
          <div className="system-topic-mode-grid">
            {systemModes.map((mode) => (
              <article key={mode.title.en}>
                <div className="system-topic-mode-heading">
                  <h3>{mode.title[language]}</h3>
                  <span>{mode.direction[language]}</span>
                </div>
                <p>{mode.description[language]}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="sound-topic-section system-topic-lab-entry" aria-label={language === "zh" ? "当前主题实验室入口" : "Current topic lab entry"}>
          <div className="sound-topic-cta">
            <CircuitBoard size={22} aria-hidden="true" />
            <h2>{language === "zh" ? "进入系统音频架构实验室" : "Open the system audio architecture lab"}</h2>
            <p>{language === "zh" ? "在同一套架构中切换播放、录音和全双工，观察应用、策略、驱动与硬件的分工。" : "Switch playback, capture, and duplex in one architecture to see how applications, policy, drivers, and hardware divide the work."}</p>
            <button className="diagram-open-button" type="button" onClick={onOpenLab}>
              {detail.lab?.buttonLabel[language]}
            </button>
          </div>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading">
            <div>
              <h2>{language === "zh" ? "核心知识点" : "Core concepts"}</h2>
              <p>{language === "zh" ? "掌握系统级判断，再进入 ALSA、实时处理和具体算法。" : "Learn the system-level decisions before diving into ALSA, real-time processing, and algorithms."}</p>
            </div>
          </div>
          <div className="sound-topic-glossary system-topic-key-points">
            {detail.keyConcepts.map((concept) => <article key={concept.en}><p>{concept[language]}</p></article>)}
          </div>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading">
            <div>
              <h2>{language === "zh" ? "系统术语" : "System terms"}</h2>
              <p>{language === "zh" ? "把常见软件层概念放回真实请求路径中。" : "Place common software-layer terms back into the real request path."}</p>
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
