import { ArrowLeft, BookOpen, CircuitBoard } from "lucide-react";
import type { Category, Language, Topic } from "../content/knowledge";
import { TopicPager } from "./TopicPager";

type DisplayTopic = Topic & { category: Category };

type AudioCodecPageProps = {
  language: Language;
  topic: DisplayTopic;
  onBack: () => void;
  onOpenLab: () => void;
  onOpenPrevious?: () => void;
  onOpenNext?: () => void;
};

const encodePath = [
  { title: { zh: "PCM 输入", en: "PCM input" }, detail: { zh: "已经采样量化后的多声道样本。", en: "Already-sampled and quantized audio samples." } },
  { title: { zh: "分帧", en: "Framing" }, detail: { zh: "切成固定时长，建立时间边界。", en: "Split into fixed-duration frames." } },
  { title: { zh: "分析与建模", en: "Analysis and modeling" }, detail: { zh: "预测、变换或建立语音/听觉模型。", en: "Use prediction, transforms, or speech and hearing models." } },
  { title: { zh: "量化与码率控制", en: "Quantization and rate control" }, detail: { zh: "按目标质量和带宽分配比特。", en: "Allocate bits for target quality and bandwidth." } },
  { title: { zh: "码流 / 封装", en: "Bitstream / container" }, detail: { zh: "变成文件、网络包或蓝牙传输帧。", en: "Produce a file, network packet, or Bluetooth frame." } }
];

const decodePath = [
  { title: { zh: "码流输入", en: "Bitstream input" }, detail: { zh: "来自文件、网络、蓝牙或实时通信。", en: "From a file, network, Bluetooth, or live call." } },
  { title: { zh: "解包与纠错", en: "Unpack and repair" }, detail: { zh: "取出编码帧、时间戳和必要冗余。", en: "Recover frames, timestamps, and redundancy." } },
  { title: { zh: "反量化与合成", en: "Inverse quantization and synthesis" }, detail: { zh: "从模型参数重建频域或时域信号。", en: "Reconstruct frequency- or time-domain signals from model parameters." } },
  { title: { zh: "PCM 输出", en: "PCM output" }, detail: { zh: "交给系统音频栈、后处理或 DAC。", en: "Deliver to the system audio stack, post-processing, or DAC." } }
];

function CodecPath({ language, title, steps, tone }: { language: Language; title: string; steps: typeof encodePath; tone: "encode" | "decode" }) {
  return (
    <section className={`audio-codec-topic-path ${tone}`} aria-label={title}>
      <h3>{title}</h3>
      <ol>
        {steps.map((step, index) => (
          <li key={step.title.en}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div><strong>{step.title[language]}</strong><p>{step.detail[language]}</p></div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function AudioCodecPage({ language, topic, onBack, onOpenLab, onOpenPrevious, onOpenNext }: AudioCodecPageProps) {
  const detail = topic.detail;
  const terms = detail.termExplanations ?? [];

  return (
    <main className="sound-topic-page audio-codec-topic-page" aria-labelledby="audio-codec-topic-title">
      <header className="sound-topic-hero">
        <button className="sound-topic-back" type="button" onClick={onBack}>
          <ArrowLeft size={17} aria-hidden="true" />
          {language === "zh" ? "返回知识库" : "Back to knowledge base"}
        </button>
        <div className="sound-topic-kicker">
          <BookOpen size={16} aria-hidden="true" />
          {language === "zh" ? "音频软件 · 编解码专题" : "Audio software · Codec deep dive"}
        </div>
        <h1 id="audio-codec-topic-title">{topic.title[language]}</h1>
        <p className="sound-topic-lede">{topic.summary[language]}</p>
        <div className="sound-topic-meta">
          <span>{language === "zh" ? "PCM 与码流" : "PCM and bitstreams"}</span>
          <span>{language === "zh" ? "质量与延迟" : "Quality and latency"}</span>
          <span>{language === "zh" ? "实验验证" : "Hands-on lab"}</span>
        </div>
      </header>

      <div className="sound-topic-content">
        <section className="sound-topic-section sound-topic-intro">
          <div>
            <h2>{language === "zh" ? "先区分 PCM、码流和硬件 Codec" : "Separate PCM, bitstreams, and hardware codecs"}</h2>
            <p>
              {language === "zh" ? (
                <>
                  这里的 Codec 指<strong>压缩编解码算法</strong>，<strong>不是硬件章节中的音频 Codec 芯片</strong>。编码器接收已经采样量化后的 <strong>PCM</strong>，经过<strong>分帧、分析建模和压缩</strong>形成适合存储或传输的<strong>码流</strong>；播放或接收端再将码流<strong>解码回 PCM</strong>，交给系统音频栈、后处理或 DAC。
                </>
              ) : (
                <>
                  Here, codec means a <strong>compression algorithm</strong>, <strong>not the hardware audio codec chip</strong>. An encoder takes sampled and quantized <strong>PCM</strong>, then performs <strong>framing, analysis, modeling, and compression</strong> to produce a <strong>bitstream</strong> for storage or transport. The receiving side <strong>decodes it back to PCM</strong> for the system audio stack, post-processing, or DAC.
                </>
              )}
            </p>
          </div>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading">
            <div>
              <h2>{language === "zh" ? "编码和解码是两个方向" : "Encoding and decoding are two directions"}</h2>
              <p>{language === "zh" ? "编码把样本变成更适合存储或传输的表示，解码再把它交回播放链路。" : "Encoding turns samples into a representation suited to storage or transport; decoding returns it to the playback path."}</p>
            </div>
          </div>
          <div className="audio-codec-topic-path-grid">
            <CodecPath language={language} title={language === "zh" ? "编码：PCM → 码流" : "Encode: PCM → bitstream"} steps={encodePath} tone="encode" />
            <CodecPath language={language} title={language === "zh" ? "解码：码流 → PCM" : "Decode: bitstream → PCM"} steps={decodePath} tone="decode" />
          </div>
          <p className="sound-topic-note">
            {language === "zh"
              ? "无损编码解码后可以逐样本还原；有损编码会利用听觉掩蔽、语音模型或带宽约束减少数据，因此音质、码率和延迟需要一起权衡。"
              : "Lossless codecs can restore samples exactly; lossy codecs reduce data using auditory masking, speech models, or bandwidth constraints, so quality, bitrate, and latency must be balanced."}
          </p>
        </section>

        <section className="sound-topic-section audio-codec-topic-lab-entry" aria-label={language === "zh" ? "音频编解码实验室入口" : "Audio codec lab entry"}>
          <div className="sound-topic-cta">
            <CircuitBoard size={22} aria-hidden="true" />
            <h2>{language === "zh" ? "进入音频编解码实验室" : "Open the audio codec lab"}</h2>
            <p>{language === "zh" ? "在实验室中比较编码/解码流程、格式压缩率、采样率和音乐、语音、蓝牙等场景。" : "Compare encode/decode flows, compression ratios, sample rates, and music, speech, and Bluetooth scenarios in the lab."}</p>
            <button className="diagram-open-button" type="button" onClick={onOpenLab}>
              {detail.lab?.buttonLabel[language]}
            </button>
          </div>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading">
            <div>
              <h2>{language === "zh" ? "核心判断" : "Core decisions"}</h2>
              <p>{language === "zh" ? "选 Codec 时同时看质量、码率、延迟、抗丢包和设备兼容性。" : "Choose a codec by quality, bitrate, latency, packet-loss resilience, and device compatibility."}</p>
            </div>
          </div>
          <div className="sound-topic-glossary audio-codec-topic-key-points">
            {detail.keyConcepts.map((concept) => <article key={concept.en}><p>{concept[language]}</p></article>)}
          </div>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading">
            <div>
              <h2>{language === "zh" ? "编解码术语" : "Codec terms"}</h2>
              <p>{language === "zh" ? "把帧长、封装和蓝牙 Codec 放回真实使用场景。" : "Place frame size, containers, and Bluetooth codecs back into real use cases."}</p>
            </div>
          </div>
          <div className="sound-topic-glossary">
            {terms.map((term) => <article key={term.name.en}><h3>{term.name[language]}</h3><p>{term.explanation[language]}</p></article>)}
          </div>
        </section>

        <section className="sound-topic-section">
          <div><h2>{language === "zh" ? "工程边界" : "Engineering boundary"}</h2><p>{detail.misconception[language]}</p></div>
        </section>
      </div>
      <TopicPager language={language} onBack={onBack} onPrevious={onOpenPrevious} onNext={onOpenNext} />
    </main>
  );
}
