import type { ReactNode } from "react";
import { TopicReadingLayout } from "./TopicReadingLayout";
import { ArrowLeft, BookOpen, CircuitBoard } from "lucide-react";
import type { Category, Language, Topic } from "../content/knowledge";
import { TopicPager } from "./TopicPager";

type DisplayTopic = Topic & { category: Category };
type ApplicationTopicPageProps = {
  relatedTopics?: ReactNode; language: Language; topic: DisplayTopic; onBack: () => void; onOpenLab: () => void; onOpenPrevious?: () => void; onOpenNext?: () => void };

type Stage = { title: Record<Language, string>; detail: Record<Language, string> };
const stageMap: Record<string, Stage[]> = {
  "bluetooth-audio": [
    { title: { zh: "源设备 PCM", en: "Source PCM" }, detail: { zh: "手机或主机先解码、混音并准备播放帧。", en: "The phone or host decodes, mixes, and prepares playout frames." } },
    { title: { zh: "Codec 与协议协商", en: "Codec and profile negotiation" }, detail: { zh: "A2DP、HFP 或 LE Audio 确定传输能力和编解码方式。", en: "A2DP, HFP, or LE Audio defines transport capability and coding." } },
    { title: { zh: "无线传输与缓冲", en: "Wireless transport and buffering" }, detail: { zh: "无线调度、丢包、抖动和接收缓冲共同决定稳定性。", en: "Radio scheduling, loss, jitter, and receive buffering determine stability." } },
    { title: { zh: "解码与播放", en: "Decode and playout" }, detail: { zh: "耳机解码后经 DAC、功放和扬声器输出。", en: "The headset decodes, then uses DAC, amplifier, and speakers for output." } }
  ],
  "meeting-communication": [
    { title: { zh: "麦克风采集", en: "Microphone capture" }, detail: { zh: "近端语音进入驱动和采集 buffer，多麦场景还要同步。", en: "Near-end speech enters the driver buffer; arrays also require synchronization." } },
    { title: { zh: "VQE / 3A", en: "VQE / 3A" }, detail: { zh: "波束成形、AEC、降噪、去混响和 AGC 改善语音。", en: "Beamforming, AEC, denoising, dereverberation, and AGC improve speech." } },
    { title: { zh: "编码与网络", en: "Coding and network" }, detail: { zh: "编码、RTP、抖动缓冲和 PLC 共同处理弱网。", en: "Coding, RTP, jitter buffering, and PLC handle poor networks." } },
    { title: { zh: "播放与字幕旁路", en: "Playout and caption side path" }, detail: { zh: "主音频送播放，同时增强后的语音可旁路到 ASR。", en: "Audio plays while enhanced speech can branch to ASR for captions." } }
  ],
  "robot-audio": [
    { title: { zh: "阵列采集", en: "Array capture" }, detail: { zh: "机器人从多个麦克风获取方向和距离线索。", en: "The robot gathers direction and distance cues from multiple microphones." } },
    { title: { zh: "定位与定向拾音", en: "Localization and beamforming" }, detail: { zh: "DOA、波束成形和回声消除选择目标说话人。", en: "DOA, beamforming, and echo cancellation select the target speaker." } },
    { title: { zh: "语音理解", en: "Speech understanding" }, detail: { zh: "VAD、ASR、意图识别和对话状态决定动作。", en: "VAD, ASR, intent recognition, and dialogue state determine action." } },
    { title: { zh: "反馈与运动", en: "Feedback and motion" }, detail: { zh: "TTS、灯光、屏幕和云台动作形成闭环反馈。", en: "TTS, lights, displays, and gimbal motion close the interaction loop." } }
  ],
  "automotive-audio": [
    { title: { zh: "座舱采集", en: "Cabin capture" }, detail: { zh: "车内麦克风采集驾驶员和乘员语音，同时面对路噪和风噪。", en: "Cabin microphones capture occupants amid road and wind noise." } },
    { title: { zh: "声源定位与增强", en: "Localization and enhancement" }, detail: { zh: "多麦定位、波束成形、AEC 和降噪确定谁在说话。", en: "Array localization, beamforming, AEC, and denoising identify the speaker." } },
    { title: { zh: "助手与座舱策略", en: "Assistant and cabin policy" }, detail: { zh: "ASR、上下文和座位信息决定响应对象与交互方式。", en: "ASR, context, and seat information decide who receives the response." } },
    { title: { zh: "空间回放与主动降噪", en: "Spatial playback and ANC" }, detail: { zh: "多扬声器空间音频和 ANC/RNC 同时服务体验与舒适度。", en: "Multi-speaker spatial audio and ANC/RNC serve experience and comfort." } }
  ],
  "iot-content": [
    { title: { zh: "低功耗感知", en: "Low-power sensing" }, detail: { zh: "设备持续监听声音事件，按功耗预算选择唤醒和推理策略。", en: "Devices monitor sound events within a power budget for wake and inference." } },
    { title: { zh: "端侧或云端处理", en: "Edge or cloud processing" }, detail: { zh: "语音控制和事件识别可在端侧完成，也可上传特征或音频。", en: "Voice control and event detection may run on-device or upload features/audio." } },
    { title: { zh: "内容生产", en: "Content production" }, detail: { zh: "录音、编辑、降噪、配乐和导出形成另一条生产链。", en: "Recording, editing, denoising, music, and export form a production path." } },
    { title: { zh: "交付与运维", en: "Delivery and operation" }, detail: { zh: "关注误报、隐私、版权、格式、版本和长期维护。", en: "Consider false alarms, privacy, copyright, formats, versions, and maintenance." } }
  ]
};

export function ApplicationTopicPage({ relatedTopics, language, topic, onBack, onOpenLab, onOpenPrevious, onOpenNext }: ApplicationTopicPageProps) {
  const detail = topic.detail;
  const stages = stageMap[detail.lab?.type ?? ""] ?? [];
  return (
    <main className="sound-topic-page application-topic-page" aria-labelledby="application-topic-title">
      <header className="sound-topic-hero">
        <button className="sound-topic-back" type="button" onClick={onBack}><ArrowLeft size={17} aria-hidden="true" />{language === "zh" ? "返回知识库" : "Back to knowledge base"}</button>
        <div className="sound-topic-kicker"><BookOpen size={16} aria-hidden="true" />{language === "zh" ? "应用场景 · 专业内容" : "Applications · Deep dive"}</div>
        <h1 id="application-topic-title">{topic.title[language]}</h1>
        <p className="sound-topic-lede">{topic.summary[language]}</p>
        <div className="sound-topic-meta"><span>{language === "zh" ? "真实场景" : "Real-world scenario"}</span><span>{language === "zh" ? "端到端链路" : "End-to-end path"}</span><span>{language === "zh" ? "实验验证" : "Hands-on lab"}</span></div>
      </header>
      <TopicReadingLayout language={language}>
        <section className="sound-topic-section sound-topic-intro"><div><h2>{language === "zh" ? "先从场景问题出发" : "Start from the scenario problem"}</h2><p>{detail.explanation[language]}</p></div></section>
        <section className="sound-topic-section"><div className="sound-topic-section-heading"><div><h2>{language === "zh" ? "从输入到用户结果" : "From input to user outcome"}</h2><p>{language === "zh" ? "同一个音频算法放进不同设备后，采集位置、实时约束、网络和交互反馈都会改变。" : "When an audio algorithm enters a product, capture position, real-time constraints, network, and feedback all change."}</p></div></div><ol className="application-topic-flow" aria-label={language === "zh" ? "应用场景音频流程" : "Application audio flow"}>{stages.map((stage, index) => <li key={stage.title.en}><span>{String(index + 1).padStart(2, "0")}</span><h3>{stage.title[language]}</h3><p>{stage.detail[language]}</p></li>)}</ol></section>
        <section className="sound-topic-section application-topic-lab-entry" aria-label={language === "zh" ? "当前主题实验室入口" : "Current topic lab entry"}><div className="sound-topic-cta"><CircuitBoard size={22} aria-hidden="true" /><h2>{detail.lab?.title[language]}</h2><p>{detail.lab?.description[language]}</p><button className="diagram-open-button" type="button" onClick={onOpenLab}>{detail.lab?.buttonLabel[language]}</button></div></section>
        <section className="sound-topic-section"><div className="sound-topic-section-heading"><div><h2>{language === "zh" ? "核心知识点" : "Core concepts"}</h2><p>{language === "zh" ? "把产品体验拆回环境、信号链、指标和故障边界。" : "Break product experience into environment, signal chain, metrics, and failure boundaries."}</p></div></div><div className="sound-topic-glossary">{detail.keyConcepts.map((concept) => <article key={concept.en}><p>{concept[language]}</p></article>)}</div></section>
        <section className="sound-topic-section"><div className="sound-topic-section-heading"><div><h2>{language === "zh" ? "场景术语" : "Scenario terms"}</h2><p>{language === "zh" ? "这些概念连接设备能力和实际用户体验。" : "These concepts connect device capabilities to user experience."}</p></div></div><div className="sound-topic-glossary">{detail.termExplanations?.map((term) => <article key={term.name.en}><h3>{term.name[language]}</h3><p>{term.explanation[language]}</p></article>)}</div></section>
        <section className="sound-topic-section"><div><h2>{language === "zh" ? "工程边界" : "Engineering boundary"}</h2><p>{detail.misconception[language]}</p></div></section>
      </TopicReadingLayout>
      {relatedTopics}
      <TopicPager language={language} onBack={onBack} onPrevious={onOpenPrevious} onNext={onOpenNext} />
    </main>
  );
}
