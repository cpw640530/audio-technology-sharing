import type { ReactNode } from "react";
import { TopicReadingLayout } from "./TopicReadingLayout";
import { ArrowLeft, BookOpen, CircuitBoard } from "lucide-react";
import type { Category, Language, LocalizedText, Topic } from "../content/knowledge";
import { TopicPager } from "./TopicPager";

type DisplayTopic = Topic & { category: Category };

type AlsaPageProps = {
  relatedTopics?: ReactNode;
  language: Language;
  topic: DisplayTopic;
  onBack: () => void;
  onOpenLab: () => void;
  onOpenPrevious?: () => void;
  onOpenNext?: () => void;
};

const frameworkLayers: Array<{
  id: string;
  label: LocalizedText;
  nodes: Array<{ title: LocalizedText; detail: LocalizedText }>;
  handoff?: LocalizedText;
}> = [
  {
    id: "user",
    label: { zh: "用户态", en: "User space" },
    nodes: [
      { title: { zh: "应用程序", en: "Applications" }, detail: { zh: "播放器 / 录音 / 通话", en: "playback / capture / calls" } },
      { title: { zh: "可选音频服务", en: "Optional audio server" }, detail: { zh: "PipeWire / PulseAudio / JACK", en: "PipeWire / PulseAudio / JACK" } },
      { title: { zh: "alsa-lib", en: "alsa-lib" }, detail: { zh: "PCM API + Control API", en: "PCM API + Control API" } },
      { title: { zh: "PCM 插件", en: "PCM plugins" }, detail: { zh: "hw / plughw / default / dmix", en: "hw / plughw / default / dmix" } }
    ],
    handoff: { zh: "系统调用 / ioctl / mmap", en: "system calls / ioctl / mmap" }
  },
  {
    id: "kernel",
    label: { zh: "内核 ALSA", en: "Kernel ALSA" },
    nodes: [
      { title: { zh: "ALSA Core", en: "ALSA Core" }, detail: { zh: "声卡注册、状态与公共接口", en: "card registration, state, common APIs" } },
      { title: { zh: "PCM 子系统", en: "PCM subsystem" }, detail: { zh: "音频帧、buffer、period、XRUN", en: "frames, buffer, period, XRUN" } },
      { title: { zh: "Control 子系统", en: "Control subsystem" }, detail: { zh: "音量、静音、路由与开关", en: "volume, mute, routes, switches" } }
    ],
    handoff: { zh: "驱动回调 / 参数约束 / 中断", en: "driver callbacks / constraints / interrupts" }
  },
  {
    id: "driver",
    label: { zh: "设备驱动", en: "Device drivers" },
    nodes: [
      { title: { zh: "PC / USB 驱动", en: "PC / USB drivers" }, detail: { zh: "PCI、USB 等声卡驱动", en: "PCI, USB, and other sound drivers" } },
      { title: { zh: "嵌入式 ASoC", en: "Embedded ASoC" }, detail: { zh: "Machine + Platform / CPU DAI", en: "Machine + Platform / CPU DAI" } },
      { title: { zh: "Codec 驱动", en: "Codec driver" }, detail: { zh: "Codec DAI、Mixer、DAPM", en: "Codec DAI, Mixer, DAPM" } }
    ],
    handoff: { zh: "寄存器 / DMA / 音频总线", en: "registers / DMA / audio buses" }
  },
  {
    id: "hardware",
    label: { zh: "硬件", en: "Hardware" },
    nodes: [
      { title: { zh: "USB / PCI 声卡", en: "USB / PCI audio" }, detail: { zh: "独立设备路径", en: "discrete device path" } },
      { title: { zh: "SoC 音频控制器", en: "SoC audio controller" }, detail: { zh: "DMA + I2S / TDM / PDM", en: "DMA + I2S / TDM / PDM" } },
      { title: { zh: "Codec 与换能器", en: "Codec and transducers" }, detail: { zh: "麦克风 → ADC；DAC → 功放 → 扬声器", en: "mic → ADC; DAC → amp → speaker" } }
    ]
  }
];

export function AlsaPage({ relatedTopics, language, topic, onBack, onOpenLab, onOpenPrevious, onOpenNext }: AlsaPageProps) {
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

      <TopicReadingLayout language={language}>
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
          <h2>{language === "zh" ? "Linux ALSA 分层框架" : "Linux ALSA layers"}</h2>
        <figure className="alsa-framework-figure" aria-labelledby="alsa-framework-title">
          <div className="alsa-framework-heading">
            <div>
              <span className="section-kicker">Linux ALSA</span>
              <h3 id="alsa-framework-title">{language === "zh" ? "Linux ALSA 分层框架图" : "Linux ALSA layered framework"}</h3>
            </div>
            <div className="alsa-framework-legend" aria-label={language === "zh" ? "通路图例" : "Path legend"}>
              <span><i className="alsa-framework-key pcm" />{language === "zh" ? "PCM 数据" : "PCM data"}</span>
              <span><i className="alsa-framework-key control" />{language === "zh" ? "Control 控制" : "Control path"}</span>
            </div>
          </div>
          <div
            className="alsa-framework-diagram"
            role="img"
            aria-label={language === "zh" ? "Linux ALSA 分层框架图" : "Linux ALSA layered framework diagram"}
          >
            {frameworkLayers.map((layer) => (
              <div className="alsa-framework-stage" key={layer.id}>
                <div className={`alsa-framework-layer-label ${layer.id}`}>{layer.label[language]}</div>
                <div className="alsa-framework-nodes">
                  {layer.nodes.map((node) => (
                    <div className={`alsa-framework-node ${layer.id}`} key={node.title.en}>
                      <strong>{node.title[language]}</strong>
                      <span>{node.detail[language]}</span>
                    </div>
                  ))}
                </div>
                {layer.handoff ? (
                  <div className="alsa-framework-handoff">
                    <span aria-hidden="true">↓</span>
                    <small>{layer.handoff[language]}</small>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
          <figcaption>
            {language === "zh"
              ? "应用可以直接调用 alsa-lib，也可以先经过 PipeWire、PulseAudio 或 JACK；后者是可选上层服务。ASoC 是嵌入式 Linux 常见驱动框架，不是 USB/PCI 声卡的必经路径。"
              : "An application may call alsa-lib directly or use PipeWire, PulseAudio, or JACK first; those are optional higher-level services. ASoC is common in embedded Linux, not a mandatory path for USB or PCI audio."}
          </figcaption>
        </figure>
        <aside className="alsa-embedded-note" aria-label={language === "zh" ? "嵌入式 Linux 链路说明" : "Embedded Linux path note"}>
          <strong>{language === "zh" ? "嵌入式 Linux 常见链路" : "Common embedded Linux path"}</strong>
          <p>
            {language === "zh"
              ? "ASoC 通常把 CPU DAI、I2S、Codec DAI、Codec 和功放组合成声卡；DAI 是接口抽象，I2S 是常见协议。这个链路适合解释嵌入式系统，但不是所有 PC 声卡的固定结构。"
              : "ASoC often combines CPU DAI, I2S, codec DAI, codec, and amplifier into a sound card; DAI is an interface abstraction and I2S is a common protocol. This explains embedded systems, not every PC sound card."}
          </p>
        </aside>
          <p className="sound-topic-note">{language === "zh" ? "录音方向相反：硬件产生 PCM，应用读取；Control/Mixer 改变音量和路由，不搬运 PCM 帧。" : "Capture reverses the direction: hardware produces PCM and the app reads it; Control/Mixer changes volume and routing without moving PCM frames."}</p>
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
      </TopicReadingLayout>
      {relatedTopics}
      <TopicPager language={language} onBack={onBack} onPrevious={onOpenPrevious} onNext={onOpenNext} />
    </main>
  );
}
