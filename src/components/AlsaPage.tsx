import { ArrowLeft, BookOpen, CircuitBoard } from "lucide-react";
import type { Category, Language, Topic } from "../content/knowledge";
import { TopicPager } from "./TopicPager";

type DisplayTopic = Topic & { category: Category };

type AlsaPageProps = {
  language: Language;
  topic: DisplayTopic;
  onBack: () => void;
  onOpenLab: () => void;
  onOpenPrevious?: () => void;
  onOpenNext?: () => void;
};

const alsaPath = [
  {
    title: { zh: "应用程序", en: "Application" },
    detail: { zh: "调用播放或录音 API，交付 PCM 帧。", en: "Calls playback or capture APIs and delivers PCM frames." }
  },
  {
    title: { zh: "alsa-lib", en: "alsa-lib" },
    detail: { zh: "提供 PCM、Control 等用户态接口。", en: "Provides user-space PCM, Control, and related APIs." }
  },
  {
    title: { zh: "PCM 插件", en: "PCM plugins" },
    detail: { zh: "hw、plughw、default 等配置决定是否适配格式和路由。", en: "hw, plughw, default, and configuration decide format adaptation and routing." }
  },
  {
    title: { zh: "内核 ALSA / 驱动", en: "Kernel ALSA / driver" },
    detail: { zh: "维护 PCM 状态、DMA、period 和设备约束。", en: "Maintains PCM state, DMA, periods, and device constraints." }
  },
  {
    title: { zh: "硬件设备", en: "Hardware" },
    detail: { zh: "连接 USB、PCI、I2S、Codec、ADC、DAC 等设备。", en: "Connects USB, PCI, I2S, codecs, ADCs, DACs, and related devices." }
  }
];

export function AlsaPage({ language, topic, onBack, onOpenLab, onOpenPrevious, onOpenNext }: AlsaPageProps) {
  const detail = topic.detail;
  const terms = detail.termExplanations ?? [];

  return (
    <main className="sound-topic-page alsa-topic-page" aria-labelledby="alsa-topic-title">
      <header className="sound-topic-hero">
        <button className="sound-topic-back" type="button" onClick={onBack}>
          <ArrowLeft size={17} aria-hidden="true" />
          {language === "zh" ? "返回知识库" : "Back to knowledge base"}
        </button>
        <div className="sound-topic-kicker">
          <BookOpen size={16} aria-hidden="true" />
          {language === "zh" ? "音频软件 · Linux 专题" : "Audio software · Linux deep dive"}
        </div>
        <h1 id="alsa-topic-title">{topic.title[language]}</h1>
        <p className="sound-topic-lede">{topic.summary[language]}</p>
        <div className="sound-topic-meta">
          <span>{language === "zh" ? "Linux 音频栈" : "Linux audio stack"}</span>
          <span>{language === "zh" ? "PCM 数据路径" : "PCM data path"}</span>
          <span>{language === "zh" ? "实验验证" : "Hands-on lab"}</span>
        </div>
      </header>

      <div className="sound-topic-content">
        <section className="sound-topic-section sound-topic-intro">
          <div>
            <h2>{language === "zh" ? "先定位 ALSA" : "Place ALSA first"}</h2>
            <p>{detail.explanation[language]}</p>
          </div>
        </section>

        {detail.chainContext ? (
          <section className="details-chain-context hardware-chain-context" aria-label={language === "zh" ? "ALSA 在音频链路中的位置" : "Where ALSA fits in the audio chain"}>
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
              <h2>{language === "zh" ? "一次 PCM 播放如何落到硬件" : "How PCM playback reaches hardware"}</h2>
              <p>{language === "zh" ? "把 ALSA 看成连接用户态音频程序和硬件设备的桥：应用交付样本，ALSA 负责接口、状态和传输。" : "Think of ALSA as the bridge between user-space audio programs and hardware: apps deliver samples while ALSA manages interfaces, state, and transport."}</p>
            </div>
          </div>
          <ol className="alsa-topic-path" aria-label={language === "zh" ? "ALSA PCM 数据路径" : "ALSA PCM data path"}>
            {alsaPath.map((step, index) => (
              <li key={step.title.en}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <strong>{step.title[language]}</strong>
                  <p>{step.detail[language]}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="sound-topic-note">
            {language === "zh"
              ? "录音方向相反：硬件产生 PCM，DMA 写入内核缓冲，应用再通过 alsa-lib 读取。Control/Mixer 改变音量和路由，但不搬运 PCM 帧。"
              : "Capture reverses the direction: hardware produces PCM, DMA writes the kernel buffer, and the app reads through alsa-lib. Control/Mixer changes volume and routing but does not move PCM frames."}
          </p>
        </section>

        <section className="sound-topic-section alsa-topic-lab-entry" aria-label={language === "zh" ? "ALSA 实验室入口" : "ALSA lab entry"}>
          <div className="sound-topic-cta">
            <CircuitBoard size={22} aria-hidden="true" />
            <h2>{language === "zh" ? "进入 ALSA 实验室" : "Open the ALSA lab"}</h2>
            <p>{language === "zh" ? "在交互实验中切换播放、录音、环形 buffer 和 XRUN，观察配置如何影响 PCM 流。" : "Use the interactive lab to switch playback, capture, ring buffers, and XRUN handling, then observe how configuration affects the PCM stream."}</p>
            <button className="diagram-open-button" type="button" onClick={onOpenLab}>
              {detail.lab?.buttonLabel[language]}
            </button>
          </div>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading">
            <div>
              <h2>{language === "zh" ? "核心对象" : "Core objects"}</h2>
              <p>{language === "zh" ? "先分清设备对象、参数协商和数据接口，再进入 buffer 与 XRUN。" : "Separate device objects, parameter negotiation, and data interfaces before exploring buffers and XRUNs."}</p>
            </div>
          </div>
          <div className="sound-topic-glossary alsa-topic-key-points">
            {detail.keyConcepts.map((concept) => <article key={concept.en}><p>{concept[language]}</p></article>)}
          </div>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading">
            <div>
              <h2>{language === "zh" ? "ALSA 术语" : "ALSA terms"}</h2>
              <p>{language === "zh" ? "把命令和参数放回数据路径中理解，详细数值操作交给实验室。" : "Place commands and parameters back into the data path; detailed numeric behavior belongs in the lab."}</p>
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
