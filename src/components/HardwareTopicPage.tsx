import { ArrowLeft, BookOpen, CircuitBoard } from "lucide-react";
import type { Category, Language, Topic } from "../content/knowledge";
import { TopicPager } from "./TopicPager";
import { MicrophoneAnatomy } from "./MicrophoneAnatomy";
import { ConverterGuide } from "./ConverterGuide";

type DisplayTopic = Topic & { category: Category };

type HardwareTopicPageProps = {
  language: Language;
  topic: DisplayTopic;
  onBack: () => void;
  onOpenLab: () => void;
  onOpenPrevious?: () => void;
  onOpenNext?: () => void;
};

const flowByType: Record<string, Record<Language, string[]>> = {
  microphone: {
    zh: ["声压变化", "模拟麦振膜换能", "模拟前级", "抗混叠与 ADC", "PCM 样本"],
    en: ["Pressure change", "Analog mic transduction", "Analog preamp", "Anti-aliasing and ADC", "PCM samples"]
  },
  "codec-hardware": {
    zh: ["模拟输入", "ADC 采样", "PCM 总线", "DSP / 混音", "DAC 输出"],
    en: ["Analog input", "ADC sampling", "PCM bus", "DSP / mixer", "DAC output"]
  },
  "digital-interface": {
    zh: ["PCM 样本", "I2S / TDM 成帧", "时钟与数据线", "接收端解帧", "PCM 样本"],
    en: ["PCM samples", "I2S / TDM framing", "Clocks and data lines", "Receiver deframing", "PCM samples"]
  },
  "amplifier-speaker": {
    zh: ["DAC 模拟输出", "功放", "负载电压与电流", "音圈运动", "空气声压"],
    en: ["DAC analog output", "Power amplifier", "Load voltage and current", "Voice-coil motion", "Air pressure"]
  }
};

const microphoneSections = [
  {
    title: { zh: "先判断采集任务", en: "Start with the capture task" },
    description: {
      zh: "专业内容页只建立选型框架：先看声源、距离和空间环境，再决定需要的灵敏度、指向性和耐受声压。",
      en: "This page establishes the selection frame: check the source, distance, and room first, then choose sensitivity, directionality, and SPL tolerance."
    },
    points: [
      { zh: "近距离大声压更看重耐受和余量；远场语音更看重自噪声、阵列布局和后端处理。", en: "Close loud sources need SPL headroom; far-field speech depends more on self-noise, array placement, and downstream processing." },
      { zh: "电容、动圈、驻极体和 MEMS 是换能与封装选择，不是单独代表音质高低。", en: "Condenser, dynamic, electret, and MEMS describe transducer and package choices, not a universal quality ranking." }
    ]
  },
  {
    title: { zh: "再确认系统接口", en: "Then confirm the system interface" },
    description: {
      zh: "麦克风输出会决定后面接什么：模拟电压要经过偏置、前级和 ADC；数字麦则把部分前端放进器件内部。",
      en: "The microphone output determines what follows: analog voltage needs bias, preamp, and ADC, while a digital mic integrates part of the front end."
    },
    points: [
      { zh: "先保证信号链有足够余量，再比较灵敏度、频响、自噪声和最大 SPL 等规格。", en: "Ensure signal-chain headroom first, then compare sensitivity, frequency response, self-noise, and maximum SPL." },
      { zh: "PDM、I2S、ADC 和阵列算法属于后续接口与处理环节，具体参数留给实验室验证。", en: "PDM, I2S, ADC, and array algorithms belong to later interface and processing stages; their parameters are explored in the lab." }
    ]
  }
];

export function HardwareTopicPage({
  language,
  topic,
  onBack,
  onOpenLab,
  onOpenPrevious,
  onOpenNext
}: HardwareTopicPageProps) {
  const detail = topic.detail;
  const isMicrophone = detail.lab?.type === "microphone";
  const isConverter = detail.lab?.type === "codec-hardware";
  const terms = detail.termExplanations ?? [];
  const flow = flowByType[detail.lab?.type ?? ""]?.[language] ?? topic.bullets.map((item) => item[language]);

  return (
    <main className={`sound-topic-page hardware-topic-page${isMicrophone ? " microphone-topic-page" : ""}`} aria-labelledby="hardware-topic-title">
      <header className="sound-topic-hero">
        <button className="sound-topic-back" type="button" onClick={onBack}>
          <ArrowLeft size={17} aria-hidden="true" />
          {language === "zh" ? "返回知识库" : "Back to knowledge base"}
        </button>
        <div className="sound-topic-kicker">
          <BookOpen size={16} aria-hidden="true" />
          {language === "zh" ? "音频硬件 · 专业内容" : "Audio hardware · Deep dive"}
        </div>
        <h1 id="hardware-topic-title">{topic.title[language]}</h1>
        <p className="sound-topic-lede">{topic.summary[language]}</p>
        <div className="sound-topic-meta">
          <span>{language === "zh" ? "硬件链路" : "Hardware chain"}</span>
          <span>{language === "zh" ? "工程参数" : "Engineering specs"}</span>
          <span>{language === "zh" ? "实验验证" : "Hands-on lab"}</span>
        </div>
      </header>

      <div className="sound-topic-content">
        <section className="sound-topic-section sound-topic-intro">
          <div>
            <h2>{language === "zh" ? "先建立硬件链路" : "Start with the hardware chain"}</h2>
            <p>{detail.explanation[language]}</p>
          </div>
        </section>

        {detail.chainContext ? <section className="details-chain-context hardware-chain-context" aria-label={language === "zh" ? "当前模块在音频链路中的位置" : "Current module in the audio chain"}>
          <div className="details-chain-heading">
            <strong>{language === "zh" ? "它在整条音频链路中的位置" : "Where this module fits"}</strong>
            <span>{detail.chainContext.stage[language]}</span>
          </div>
          <div className="details-chain-grid">
            <div><small>{language === "zh" ? "输入" : "Input"}</small><p>{detail.chainContext.input[language]}</p></div>
            <div><small>{language === "zh" ? "本模块输出" : "Module output"}</small><p>{detail.chainContext.output[language]}</p></div>
            <div><small>{language === "zh" ? "下一站" : "Next"}</small><p>{detail.chainContext.next[language]}</p></div>
          </div>
        </section> : null}

        {!isConverter && <section className="sound-topic-section">
          <div className="sound-topic-section-heading">
            <div>
              <h2>{language === "zh" ? "典型信号链示例" : "Example signal chain"}</h2>
              <p>{language === "zh" ? "沿着信号实际经过的边界阅读，避免把换能、转换、传输和播放混成一个概念。" : "Follow the actual signal boundaries so transduction, conversion, transport, and playback stay distinct."}</p>
            </div>
          </div>
          <ol className="sound-topic-flow" aria-label={language === "zh" ? "音频硬件信号链" : "Audio hardware signal chain"}>
            {flow.map((step, index) => (
              <li key={`${index}-${step}`}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{step}</strong>
              </li>
            ))}
          </ol>
          {detail.lab?.type === "microphone" && <p className="sound-topic-note">{language === "zh" ? "上图是模拟麦路径。数字麦在内部完成转换；PDM 输出需抽取滤波得到 PCM，I2S 数字麦可直接输出 PCM。" : "This shows an analog microphone path. Digital microphones convert internally: PDM needs decimation to PCM, while I2S microphones can output PCM directly."}</p>}
          {detail.lab?.type === "digital-interface" && <p className="sound-topic-note">{language === "zh" ? "上图仅示例 I2S/TDM。PDM 是 1-bit 密度流，SPDIF 携带嵌入时钟，USB Audio 使用数据包，不能套用同一时序。" : "This example covers I2S/TDM only. PDM carries a 1-bit density stream, SPDIF embeds its clock, and USB Audio uses packets; their timing differs."}</p>}
        </section>}

        {!isMicrophone && !isConverter && <section className="sound-topic-section">
          <div className="sound-topic-section-heading">
            <div>
              <h2>{language === "zh" ? "核心知识点" : "Core concepts"}</h2>
              <p>{language === "zh" ? "先掌握卡片中的关键判断，再进入术语细节。" : "Learn the key engineering decisions before going deeper into the terminology."}</p>
            </div>
          </div>
          <div className="sound-topic-glossary hardware-topic-key-points">
            {detail.keyConcepts.map((concept) => (
              <article key={concept.en}>
                <p>{concept[language]}</p>
              </article>
            ))}
          </div>
        </section>}

        {isConverter ? <ConverterGuide language={language} /> : isMicrophone ? microphoneSections.map((section, index) => (
          <section className="sound-topic-section microphone-topic-section" key={section.title.en}>
            <div className="microphone-topic-section-intro">
              <h2>{section.title[language]}</h2>
              <p>{section.description[language]}</p>
            </div>
            <div className="sound-topic-glossary microphone-topic-points">
              {section.points.map((point) => <article key={point.en}><p>{point[language]}</p></article>)}
            </div>
            {index === 0 && <>
              <p className="sound-topic-note microphone-topic-boundary">
                {language === "zh" ? "内容分工：这里帮助你建立选型判断；实验室负责切换麦克风类型、调节角度/距离/增益，并观察或试听参数变化。" : "Division of labor: this page frames the selection decision; the lab switches microphone types, adjusts angle/distance/gain, and makes the changes visible or audible."}
              </p>
              <MicrophoneAnatomy language={language} />
            </>}
          </section>
        )) : <section className="sound-topic-section">
          <div className="sound-topic-section-heading">
            <div>
              <h2>{language === "zh" ? "术语与参数词典" : "Terms and parameters"}</h2>
              <p>{language === "zh" ? "把数据手册里的词汇放回真实信号链中理解。" : "Place datasheet terms back into the real signal chain."}</p>
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
        </section>}

        <section className="sound-topic-section sound-topic-bottom-grid">
          <div>
            <h2>{language === "zh" ? "工程边界" : "Engineering boundary"}</h2>
            <p>{detail.misconception[language]}</p>
          </div>
          <div className="sound-topic-cta">
            <CircuitBoard size={22} aria-hidden="true" />
            <h2>{language === "zh" ? "继续动手验证" : "Keep experimenting"}</h2>
            <p>{language === "zh" ? "用交互实验验证参数变化，而不是只记住术语。" : "Use the interactive lab to verify parameter changes instead of memorizing terms."}</p>
            <button className="diagram-open-button" type="button" onClick={onOpenLab}>
              {detail.lab?.buttonLabel[language]}
            </button>
          </div>
        </section>
      </div>
      <TopicPager language={language} onBack={onBack} onPrevious={onOpenPrevious} onNext={onOpenNext} />
    </main>
  );
}
