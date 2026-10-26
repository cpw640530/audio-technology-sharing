import type { ReactNode } from "react";
import { TopicReadingLayout } from "./TopicReadingLayout";
import { ArrowLeft, BookOpen, CircuitBoard } from "lucide-react";
import type { AiAudioLabId, Category, Language, Topic } from "../content/knowledge";
import { TopicPager } from "./TopicPager";

type DisplayTopic = Topic & { category: Category };

type AiAudioTopicPageProps = {
  relatedTopics?: ReactNode;
  language: Language;
  topic: DisplayTopic;
  mode: AiAudioLabId;
  onBack: () => void;
  onOpenLab: () => void;
  onOpenPrevious?: () => void;
  onOpenNext?: () => void;
};

const flows: Record<AiAudioLabId, Array<{ title: Record<Language, string>; detail: Record<Language, string> }>> = {
  overview: [
    { title: { zh: "采集 PCM", en: "Capture PCM" }, detail: { zh: "麦克风和 ADC 把声音变成数字波形。", en: "Microphones and ADC turn sound into digital waveforms." } },
    { title: { zh: "选择表示", en: "Choose representation" }, detail: { zh: "按任务选择波形、频谱、Mel、embedding 或 token。", en: "Choose waveform, spectra, Mel, embeddings, or tokens for the task." } },
    { title: { zh: "任务模型", en: "Task model" }, detail: { zh: "识别、增强、生成或编码使用不同模型。", en: "Recognition, enhancement, generation, and coding use different models." } },
    { title: { zh: "后处理", en: "Post-process" }, detail: { zh: "把模型输出变成文字、类别、PCM 或码流。", en: "Turn model outputs into text, labels, PCM, or bitstreams." } }
  ],
  asr: [
    { title: { zh: "PCM 分帧", en: "Frame PCM" }, detail: { zh: "16 kHz 语音按 10 到 20 ms 切成短帧。", en: "Split 16 kHz speech into 10-20 ms frames." } },
    { title: { zh: "log-mel / MFCC", en: "log-mel / MFCC" }, detail: { zh: "提取每帧的频率能量结构。", en: "Extract frequency-energy structure from each frame." } },
    { title: { zh: "Encoder 与识别头", en: "Encoder and head" }, detail: { zh: "Encoder 建立上下文，CTC、RNNT 或 Attention 预测 token。", en: "The encoder builds context while CTC, RNNT, or attention predicts tokens." } },
    { title: { zh: "文本后处理", en: "Text post-processing" }, detail: { zh: "解码、标点、热词和时间戳形成最终文本。", en: "Decoding, punctuation, hotwords, and timestamps form final text." } }
  ],
  tts: [
    { title: { zh: "文本规范化", en: "Normalize text" }, detail: { zh: "数字、单位和缩写先转换为可朗读形式。", en: "Convert numbers, units, and abbreviations into speakable text." } },
    { title: { zh: "读音与韵律", en: "Pronunciation and prosody" }, detail: { zh: "预测音素、停顿、重音、语速和音高。", en: "Predict phonemes, pauses, stress, speaking rate, and pitch." } },
    { title: { zh: "声学表示", en: "Acoustic representation" }, detail: { zh: "生成 Mel 频谱或神经 codec 表示。", en: "Generate a Mel spectrogram or neural-codec representation." } },
    { title: { zh: "声码器输出", en: "Vocoder output" }, detail: { zh: "声码器把声学表示还原为 PCM 波形。", en: "The vocoder reconstructs a PCM waveform from acoustic features." } }
  ],
  generation: [
    { title: { zh: "声音条件", en: "Audio condition" }, detail: { zh: "输入文本、参考音色、音乐提示或环境条件。", en: "Provide text, reference voice, music prompts, or scene conditions." } },
    { title: { zh: "压缩表示", en: "Compressed representation" }, detail: { zh: "模型在 Mel、latent 或 codec token 空间中建模。", en: "Model the sound in Mel, latent, or codec-token space." } },
    { title: { zh: "生成采样", en: "Generative sampling" }, detail: { zh: "扩散模型或自回归模型逐步生成结果。", en: "Diffusion or autoregressive models generate the result step by step." } },
    { title: { zh: "解码与筛选", en: "Decode and select" }, detail: { zh: "声码器还原波形，再按质量和语义筛选。", en: "Decode the waveform, then select by quality and semantic fit." } }
  ],
  event: [
    { title: { zh: "环境 PCM", en: "Environment PCM" }, detail: { zh: "采集哭声、狗叫、玻璃破碎等环境声音。", en: "Capture events such as cries, barks, and glass breaks." } },
    { title: { zh: "log-mel 频谱", en: "log-mel spectrum" }, detail: { zh: "横轴是时间，纵轴是频率，亮度表示能量。", en: "Time is horizontal, frequency is vertical, and brightness is energy." } },
    { title: { zh: "分类模型", en: "Classifier" }, detail: { zh: "CNN、Transformer 或 embedding 模型估计类别。", en: "CNN, Transformer, or embedding models estimate event classes." } },
    { title: { zh: "阈值与告警", en: "Threshold and alert" }, detail: { zh: "结合置信度、持续时间和误报策略触发事件。", en: "Use confidence, duration, and false-alarm policy to trigger events." } }
  ],
  enhancement: [
    { title: { zh: "带噪输入", en: "Noisy input" }, detail: { zh: "输入含噪声、混响或多人叠加的 PCM。", en: "Input PCM contains noise, reverberation, or multiple speakers." } },
    { title: { zh: "特征与上下文", en: "Features and context" }, detail: { zh: "模型从波形或复数频谱估计目标声源。", en: "The model estimates the target source from waveform or complex spectra." } },
    { title: { zh: "掩码或波形重建", en: "Mask or waveform reconstruction" }, detail: { zh: "生成频谱掩码、滤波器或增强波形。", en: "Generate a spectral mask, filter, or enhanced waveform." } },
    { title: { zh: "质量与延迟", en: "Quality and latency" }, detail: { zh: "检查残留噪声、失真、可懂度和实时性。", en: "Check residual noise, distortion, intelligibility, and real-time behavior." } }
  ],
  codec: [
    { title: { zh: "PCM 分帧", en: "Frame PCM" }, detail: { zh: "把波形切成固定帧，准备编码。", en: "Split the waveform into fixed frames for coding." } },
    { title: { zh: "神经编码器", en: "Neural encoder" }, detail: { zh: "把音频压缩到 latent 或离散 token。", en: "Compress audio into latents or discrete tokens." } },
    { title: { zh: "量化与码流", en: "Quantize and packetize" }, detail: { zh: "控制码率、延迟和传输封装。", en: "Control bitrate, latency, and transport packaging." } },
    { title: { zh: "神经解码器", en: "Neural decoder" }, detail: { zh: "由匹配模型重建 PCM，不能与传统 Codec 混用。", en: "Reconstruct PCM with the matching model; it is not interchangeable with traditional codecs." } }
  ]
};

const modeLabels: Record<AiAudioLabId, Record<Language, string>> = {
  overview: { zh: "AI 音频总流程", en: "AI audio overview" }, asr: { zh: "语音识别", en: "ASR" }, tts: { zh: "语音合成", en: "TTS" }, generation: { zh: "音频生成", en: "Generation" }, event: { zh: "事件识别", en: "Event detection" }, enhancement: { zh: "音频增强", en: "Enhancement" }, codec: { zh: "神经编码", en: "Neural coding" }
};

export function AiAudioTopicPage({ relatedTopics, language, topic, mode, onBack, onOpenLab, onOpenPrevious, onOpenNext }: AiAudioTopicPageProps) {
  const detail = topic.detail;
  const steps = flows[mode];
  return (
    <main className="sound-topic-page ai-topic-page" aria-labelledby="ai-topic-title">
      <header className="sound-topic-hero">
        <button className="sound-topic-back" type="button" onClick={onBack}><ArrowLeft size={17} aria-hidden="true" />{language === "zh" ? "返回知识库" : "Back to knowledge base"}</button>
        <div className="sound-topic-kicker"><BookOpen size={16} aria-hidden="true" />{language === "zh" ? "AI 音频 · 专业内容" : "AI audio · Deep dive"}</div>
        <h1 id="ai-topic-title">{topic.title[language]}</h1>
        <p className="sound-topic-lede">{topic.summary[language]}</p>
        <div className="sound-topic-meta"><span>{modeLabels[mode][language]}</span><span>{language === "zh" ? "模型与部署" : "Models and deployment"}</span><span>{language === "zh" ? "实验验证" : "Hands-on lab"}</span></div>
      </header>
      <TopicReadingLayout language={language}>
        <section className="sound-topic-section sound-topic-intro"><div><h2>{language === "zh" ? "先明确任务，再选择模型" : "Define the task before choosing the model"}</h2>{detail.explanation[language].split("\n\n").map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div></section>
        <section className="sound-topic-section"><div className="sound-topic-section-heading"><div><h2>{language === "zh" ? "这张卡片的 AI 音频链路" : "The AI audio path for this topic"}</h2><p>{language === "zh" ? "输入表示、模型输出和工程后处理会随任务变化，不能把所有 AI 音频都当成频谱图像分类。" : "Input representations, model outputs, and engineering post-processing vary by task; not all AI audio is spectrogram classification."}</p></div></div><ol className="ai-topic-flow" aria-label={language === "zh" ? "AI 音频处理流程" : "AI audio processing flow"}>{steps.map((step, index) => <li key={step.title.en}><span>{String(index + 1).padStart(2, "0")}</span><h3>{step.title[language]}</h3><p>{step.detail[language]}</p></li>)}</ol></section>
        <section className="sound-topic-section ai-topic-lab-entry" aria-label={language === "zh" ? "当前主题实验室入口" : "Current topic lab entry"}><div className="sound-topic-cta"><CircuitBoard size={22} aria-hidden="true" /><h2>{detail.lab?.title[language]}</h2><p>{detail.lab?.description[language]}</p><button className="diagram-open-button" type="button" onClick={onOpenLab}>{detail.lab?.buttonLabel[language]}</button></div></section>
        <section className="sound-topic-section"><div className="sound-topic-section-heading"><div><h2>{language === "zh" ? "核心知识点" : "Core concepts"}</h2><p>{language === "zh" ? "先掌握任务边界，再深入实验室中的公式、模型和案例。" : "Understand the task boundary before diving into formulas, models, and cases in the lab."}</p></div></div><div className="sound-topic-glossary">{detail.keyConcepts.map((concept) => <article key={concept.en}><p>{concept[language]}</p></article>)}</div></section>
        <section className="sound-topic-section"><div className="sound-topic-section-heading"><div><h2>{language === "zh" ? "相关术语" : "Related terms"}</h2><p>{language === "zh" ? "这些术语说明数据如何表示、模型如何工作以及结果如何评价。" : "These terms explain data representation, model behavior, and result evaluation."}</p></div></div><div className="sound-topic-glossary">{detail.termExplanations?.map((term) => <article key={term.name.en}><h3>{term.name[language]}</h3><p>{term.explanation[language]}</p></article>)}</div></section>
        <section className="sound-topic-section"><div><h2>{language === "zh" ? "工程边界" : "Engineering boundary"}</h2><p>{detail.misconception[language]}</p></div></section>
      </TopicReadingLayout>
      {relatedTopics}
      <TopicPager language={language} onBack={onBack} onPrevious={onOpenPrevious} onNext={onOpenNext} />
    </main>
  );
}
