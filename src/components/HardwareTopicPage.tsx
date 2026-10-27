import type { ReactNode } from "react";
import { TopicReadingLayout } from "./TopicReadingLayout";
import { ArrowLeft, BookOpen, CircuitBoard } from "lucide-react";
import type { Category, Language, Topic } from "../content/knowledge";
import { TopicPager } from "./TopicPager";
import { MicrophoneAnatomy } from "./MicrophoneAnatomy";
import { ConverterGuide } from "./ConverterGuide";
import { AmplifierSpeakerAnatomy } from "./AmplifierSpeakerAnatomy";

type DisplayTopic = Topic & { category: Category };

type HardwareTopicPageProps = {
  relatedTopics?: ReactNode;
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
      zh: "先看声源、距离和空间环境，再决定需要的灵敏度、指向性和耐受声压。",
      en: "Check the source, distance, and room first, then choose sensitivity, directionality, and SPL tolerance."
    },
    points: [
      { zh: "近距离大声压更看重耐受和余量；远场语音更看重自噪声、阵列布局和后端处理。", en: "Close loud sources need SPL headroom; far-field speech depends more on self-noise, array placement, and downstream processing." },
      { zh: "电容、动圈、驻极体和 MEMS 是换能与封装选择，不是单独代表音质高低。", en: "Condenser, dynamic, electret, and MEMS describe transducer and package choices, not a universal quality ranking." },
      { zh: "录音棚和乐器还要按声压、瞬态、音色目标和房间条件比较电容、动圈与铝带麦，并结合摆位。", en: "Studio and instrument capture also compares condenser, dynamic, and ribbon mics by SPL, transients, tone target, and room, then tunes placement." }
    ]
  },
  {
    title: { zh: "再确认系统接口", en: "Then confirm the system interface" },
    description: {
      zh: "模拟输出需要匹配前级和 ADC；供电按类型决定：普通被动动圈不需供电，两线驻极体通常需要外部偏置。数字麦还需匹配电源、时钟和 PDM 或 I2S 接口。",
      en: "Analog outputs need a suitable preamp and ADC. Power depends on type: conventional passive moving-coil capsules need none; two-wire electret capsules typically need external bias. Digital mics also require compatible power, clocks, and PDM or I2S interfaces."
    },
    points: [
      { zh: "先保证信号链有足够余量，再比较灵敏度、频响、自噪声和最大 SPL 等规格。", en: "Ensure signal-chain headroom first, then compare sensitivity, frequency response, self-noise, and maximum SPL." },
      { zh: "PDM 接收端需要抽取滤波；I2S 接收端需要匹配时钟、字长和声道配置。不能仅凭‘数字麦’判断接口兼容。", en: "PDM reception needs decimation; I2S reception needs matching clocks, word length, and channel settings. The label 'digital mic' alone does not establish compatibility." },
      { zh: "手机和耳机里的多麦 MEMS 常与波束成形、通话降噪和风噪检测配合，系统布局比单颗麦规格更关键。", en: "Multi-mic MEMS systems in phones and earbuds often pair beamforming with call noise reduction and wind detection, making layout as important as one mic's specification." }
    ]
  }
];

export function HardwareTopicPage({ relatedTopics,
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
  const isAmplifierSpeaker = detail.lab?.type === "amplifier-speaker";
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

      <TopicReadingLayout language={language}>
        <section id={isMicrophone ? "mic-intro" : undefined} tabIndex={isMicrophone ? -1 : undefined} className="sound-topic-section sound-topic-intro">
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

        {!isConverter && <section id={isMicrophone ? "mic-signal" : undefined} tabIndex={isMicrophone ? -1 : undefined} className="sound-topic-section">
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
          {isAmplifierSpeaker && <AmplifierSpeakerAnatomy language={language} />}
        </section>}

        <section id={isMicrophone ? "mic-lab" : undefined} tabIndex={isMicrophone ? -1 : undefined} className="sound-topic-section hardware-topic-lab-entry" aria-label={language === "zh" ? "当前主题实验室入口" : "Current topic lab entry"}>
          <div className="sound-topic-cta">
            <CircuitBoard size={22} aria-hidden="true" />
            <h2>{language === "zh" ? "先进入实验室验证" : "Verify it in the lab first"}</h2>
            <p>{language === "zh" ? "先用交互实验观察参数变化，再阅读后面的核心知识点和术语说明。" : "Use the interactive lab to observe parameter changes before reading the core concepts and terms below."}</p>
            <button className="diagram-open-button" type="button" onClick={onOpenLab}>
              {detail.lab?.buttonLabel[language]}
            </button>
          </div>
        </section>

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
          <section id={index === 0 ? "mic-selection" : "mic-interface"} tabIndex={-1} className="sound-topic-section microphone-topic-section" key={section.title.en}>
            <div className="microphone-topic-section-intro">
              <h2>{section.title[language]}</h2>
              <p>{section.description[language]}</p>
            </div>
            <ul className="microphone-topic-points">
              {section.points.map((point) => <li key={point.en}>{point[language]}</li>)}
            </ul>
            {index === 0 && <>
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

        <section id={isMicrophone ? "mic-boundary" : undefined} tabIndex={isMicrophone ? -1 : undefined} className="sound-topic-section">
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
