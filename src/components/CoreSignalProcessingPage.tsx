import { ArrowLeft, BookOpen, CircuitBoard } from "lucide-react";
import type { Category, Language, Topic } from "../content/knowledge";
import { TopicPager } from "./TopicPager";

type DisplayTopic = Topic & { category: Category };

type CoreSignalProcessingPageProps = {
  language: Language;
  topic: DisplayTopic;
  onBack: () => void;
  onOpenLab: () => void;
  onOpenNext?: () => void;
};

const processingJobs = [
  {
    number: "01",
    title: { zh: "分析结构", en: "Analyze structure" },
    input: { zh: "PCM 波形", en: "PCM waveform" },
    method: { zh: "时间域、FFT / STFT", en: "Time domain, FFT / STFT" },
    output: { zh: "波形、频谱或特征；原 PCM 不一定改变", en: "Waveform, spectrum, or features; PCM may remain unchanged" }
  },
  {
    number: "02",
    title: { zh: "塑造频段", en: "Shape frequency bands" },
    input: { zh: "PCM 样本", en: "PCM samples" },
    method: { zh: "FIR / IIR、滤波器、EQ", en: "FIR / IIR, filters, EQ" },
    output: { zh: "各频段能量改变后的 PCM", en: "PCM with reshaped frequency energy" }
  },
  {
    number: "03",
    title: { zh: "控制电平", en: "Control level" },
    input: { zh: "PCM 与电平包络", en: "PCM and level envelope" },
    method: { zh: "压缩器、Limiter", en: "Compressor, limiter" },
    output: { zh: "响度、瞬态和峰值受控的 PCM", en: "PCM with controlled loudness, transients, and peaks" }
  }
];

const signalPaths = [
  {
    title: { zh: "分析路径", en: "Analysis path" },
    note: { zh: "输出频谱或特征，通常不直接改变声音。", en: "Produces spectra or features and usually does not directly change sound." },
    steps: {
      zh: ["输入 PCM", "分帧 / 加窗", "FFT / STFT", "频谱 / 特征"],
      en: ["Input PCM", "Frame / window", "FFT / STFT", "Spectrum / features"]
    }
  },
  {
    title: { zh: "时域处理路径", en: "Time-domain processing path" },
    note: { zh: "许多 FIR、IIR、EQ 和动态处理可直接逐样本或逐帧运行。", en: "Many FIR, IIR, EQ, and dynamics algorithms run directly per sample or frame." },
    steps: {
      zh: ["输入 PCM", "滤波 / EQ", "动态处理", "输出 PCM"],
      en: ["Input PCM", "Filter / EQ", "Dynamics", "Output PCM"]
    }
  },
  {
    title: { zh: "频域处理路径", en: "Frequency-domain processing path" },
    note: { zh: "只有需要在频率格上修改并还原音频时，才需要 IFFT 和重叠相加。", en: "IFFT and overlap-add are needed when frequency bins are modified and audio must be reconstructed." },
    steps: {
      zh: ["FFT", "修改频率格", "IFFT", "重叠相加"],
      en: ["FFT", "Modify bins", "IFFT", "Overlap-add"]
    }
  }
];

export function CoreSignalProcessingPage({ language, topic, onBack, onOpenLab, onOpenNext }: CoreSignalProcessingPageProps) {
  const detail = topic.detail;

  return (
    <main className="sound-topic-page core-signal-topic-page" aria-labelledby="core-signal-topic-title">
      <header className="sound-topic-hero">
        <button className="sound-topic-back" type="button" onClick={onBack}>
          <ArrowLeft size={17} aria-hidden="true" />
          {language === "zh" ? "返回知识库" : "Back to knowledge base"}
        </button>
        <div className="sound-topic-kicker">
          <BookOpen size={16} aria-hidden="true" />
          {language === "zh" ? "传统算法 · 专业内容" : "Traditional DSP · Deep dive"}
        </div>
        <h1 id="core-signal-topic-title">{topic.title[language]}</h1>
        <p className="sound-topic-lede">{topic.summary[language]}</p>
        <div className="sound-topic-meta">
          <span>{language === "zh" ? "信号分析" : "Signal analysis"}</span>
          <span>{language === "zh" ? "频段塑形" : "Frequency shaping"}</span>
          <span>{language === "zh" ? "电平控制" : "Level control"}</span>
        </div>
      </header>

      <div className="sound-topic-content">
        <section className="sound-topic-section sound-topic-intro">
          <div>
            <h2>{language === "zh" ? "先判断：分析还是处理" : "First decide: analyze or process"}</h2>
            <p>{detail.explanation[language]}</p>
          </div>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading">
            <div>
              <h2>{language === "zh" ? "一段 PCM 的三类任务" : "Three jobs for one PCM stream"}</h2>
              <p>{language === "zh" ? "先看算法要回答什么问题，再选择时间域、频率域或电平检测方法。" : "Choose time-domain, frequency-domain, or level detection methods based on the question the algorithm must answer."}</p>
            </div>
          </div>
          <ol className="core-topic-jobs">
            {processingJobs.map((job) => (
              <li key={job.number}>
                <span>{job.number}</span>
                <h3>{job.title[language]}</h3>
                <dl>
                  <div><dt>{language === "zh" ? "输入" : "Input"}</dt><dd>{job.input[language]}</dd></div>
                  <div><dt>{language === "zh" ? "方法" : "Method"}</dt><dd>{job.method[language]}</dd></div>
                  <div><dt>{language === "zh" ? "结果" : "Result"}</dt><dd>{job.output[language]}</dd></div>
                </dl>
              </li>
            ))}
          </ol>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading">
            <div>
              <h2>{language === "zh" ? "不要把所有 DSP 都画成 FFT 链路" : "Not every DSP algorithm needs an FFT path"}</h2>
              <p>{language === "zh" ? "分析、时域处理和频域处理是三条不同路径；只有修改频域后还要恢复声音时，才需要完整的 FFT → IFFT 重建。" : "Analysis, time-domain processing, and frequency-domain processing are distinct paths. A full FFT-to-IFFT reconstruction is only needed when modified frequency-domain data must return to audio."}</p>
            </div>
          </div>
          <div className="core-topic-paths">
            {signalPaths.map((path) => (
              <article key={path.title.en}>
                <h3>{path.title[language]}</h3>
                <ol aria-label={path.title[language]}>
                  {path.steps[language].map((step) => <li key={step}>{step}</li>)}
                </ol>
                <p>{path.note[language]}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="sound-topic-section core-topic-lab-entry" aria-label={language === "zh" ? "当前主题实验室入口" : "Current topic lab entry"}>
          <div className="sound-topic-cta">
            <CircuitBoard size={22} aria-hidden="true" />
            <h2>{language === "zh" ? "进入基础信号处理实验室" : "Open the core signal processing lab"}</h2>
            <p>{detail.lab?.description[language]}</p>
            <button className="diagram-open-button" type="button" onClick={onOpenLab}>{detail.lab?.buttonLabel[language]}</button>
          </div>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading">
            <div>
              <h2>{language === "zh" ? "核心知识点" : "Core concepts"}</h2>
              <p>{language === "zh" ? "这些判断决定算法效果、延迟和计算量。" : "These decisions determine algorithm behavior, latency, and compute cost."}</p>
            </div>
          </div>
          <div className="sound-topic-glossary core-topic-key-points">
            {detail.keyConcepts.map((concept) => <article key={concept.en}><p>{concept[language]}</p></article>)}
          </div>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading">
            <div>
              <h2>{language === "zh" ? "基础术语" : "Core terms"}</h2>
              <p>{language === "zh" ? "把观察方式、处理方法和控制参数分清。" : "Separate observation domains, processing methods, and control parameters."}</p>
            </div>
          </div>
          <div className="sound-topic-glossary">
            {detail.termExplanations?.map((term) => (
              <article key={term.name.en}><h3>{term.name[language]}</h3><p>{term.explanation[language]}</p></article>
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

      <TopicPager language={language} onBack={onBack} onNext={onOpenNext} />
    </main>
  );
}
