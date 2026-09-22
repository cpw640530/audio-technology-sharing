import { ArrowLeft, BookOpen, Calculator, FileAudio } from "lucide-react";
import { categories, type Language } from "../content/knowledge";
import { codecPrinciples } from "./DigitalAudioLab";
import { TopicPager } from "./TopicPager";

type DigitalAudioPageProps = {
  language: Language;
  onBack: () => void;
  onOpenLab: () => void;
  onOpenPrevious: () => void;
  onOpenNext: () => void;
};

const digitalAudioTopic = categories
  .find((category) => category.id === "fundamentals")
  ?.topics.find((topic) => topic.title.en === "Digital Audio Basics")!;

if (!digitalAudioTopic) {
  throw new Error("The digital audio topic is required for the professional guide.");
}

export function DigitalAudioPage({ language, onBack, onOpenLab, onOpenPrevious, onOpenNext }: DigitalAudioPageProps) {
  const detail = digitalAudioTopic.detail;
  const terms = detail.termExplanations ?? [];
  const flow = language === "zh"
    ? ["连续模拟波形", "抗混叠滤波", "按采样率取点", "按位深量化", "PCM 样本", "文件或码流编码"]
    : ["Continuous analog wave", "Anti-alias filter", "Sample at fs", "Quantize by bit depth", "PCM samples", "File or stream encoding"];

  return (
    <main className="sound-topic-page digital-topic-page" aria-labelledby="digital-topic-title">
      <header className="sound-topic-hero">
        <button className="sound-topic-back" type="button" onClick={onBack}>
          <ArrowLeft size={17} aria-hidden="true" />
          {language === "zh" ? "返回知识库" : "Back to knowledge base"}
        </button>
        <div className="sound-topic-kicker">
          <BookOpen size={16} aria-hidden="true" />
          {language === "zh" ? "音频基础 · 数字化链路" : "Audio fundamentals · Digital signal chain"}
        </div>
        <h1 id="digital-topic-title">{digitalAudioTopic.title[language]}</h1>
        <p className="sound-topic-lede">{digitalAudioTopic.summary[language]}</p>
        <div className="sound-topic-meta">
          <span>{language === "zh" ? "采样定理" : "Sampling theorem"}</span>
          <span>{language === "zh" ? "量化与位深" : "Quantization and bit depth"}</span>
          <span>{language === "zh" ? "PCM 与编码" : "PCM and codecs"}</span>
        </div>
      </header>

      <div className="sound-topic-content">
        <section className="sound-topic-section sound-topic-intro">

          <div>
            <h2>{language === "zh" ? "数字音频究竟做了什么？" : "What does digital audio actually do?"}</h2>
            <p>{detail.explanation[language]}</p>
          </div>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading">

            <div>
              <h2>{language === "zh" ? "一条完整的数字化链路" : "The complete digitization chain"}</h2>
              <p>{language === "zh" ? "采样解决时间轴，量化解决幅度轴，编码负责组织和压缩已经得到的数字。" : "Sampling handles the time axis, quantization handles amplitude, and encoding organizes or compresses the resulting numbers."}</p>
            </div>
          </div>
          <ol className="sound-topic-flow digital-topic-flow" aria-label={language === "zh" ? "模拟信号到数字音频的流程" : "Analog to digital audio flow"}>
            {flow.map((step, index) => (
              <li key={step}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{step}</strong>
              </li>
            ))}
          </ol>
          <p className="sound-topic-note">{language === "zh" ? "抗混叠滤波通常位于 ADC 前面；它先限制输入带宽，再让采样率有明确的最高可表示频率。" : "An anti-alias filter usually sits before the ADC. It limits input bandwidth so the sample rate has a defined maximum representable frequency."}</p>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading">

            <div>
              <h2>{language === "zh" ? "采样率决定时间轴的分辨率" : "Sample rate sets time-axis resolution"}</h2>
              <p>{detail.keyConcepts[0][language]} {detail.keyConcepts[1][language]}</p>
            </div>
          </div>
          <div className="digital-topic-equation-grid">
            <article className="digital-topic-equation-card">
              <span>Nyquist</span>
              <code>fₛ &gt; 2 × fₘₐₓ</code>
              <p>{language === "zh" ? "如果采样率不够，高频会折叠成错误的低频，形成混叠；提高采样率不是无条件提升音质。" : "If the sample rate is too low, high frequencies fold into incorrect lower frequencies. A higher rate is not an unconditional quality upgrade."}</p>
            </article>
            <article className="digital-topic-equation-card">
              <span>Nyquist frequency</span>
              <code>fN = fₛ / 2</code>
              <p>{language === "zh" ? "48 kHz 系统的奈奎斯特频率是 24 kHz，实际还要留出抗混叠滤波器的过渡带。" : "A 48 kHz system has a 24 kHz Nyquist frequency, with practical room needed for the anti-alias filter transition band."}</p>
            </article>
          </div>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading">

            <div>
              <h2>{language === "zh" ? "位深决定幅度能分多细" : "Bit depth sets amplitude precision"}</h2>
              <p>{terms.find((term) => term.name.en === "Quantization")?.explanation[language]}</p>
            </div>
          </div>
          <div className="digital-topic-equation-grid">
            <article className="digital-topic-equation-card">
              <span>Levels</span>
              <code>levels = 2ⁿ</code>
              <p>{language === "zh" ? "n-bit 量化可以表达 2ⁿ 个等级；位深越低，波形越容易呈现阶梯和量化误差。" : "n-bit quantization provides 2ⁿ levels; lower bit depth makes stair-steps and quantization error more visible."}</p>
            </article>
            <article className="digital-topic-equation-card">
              <span>Ideal dynamic range</span>
              <code>DR ≈ 6.02n + 1.76 dB</code>
              <p>{language === "zh" ? "这是理想量化器的近似值；实际设备还会受模拟噪声、时钟、前端和实现质量影响。" : "This is an ideal quantizer approximation; real systems are also limited by analog noise, clocks, front ends, and implementation quality."}</p>
            </article>
          </div>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading">

            <div>
              <h2>{language === "zh" ? "PCM、WAV 和压缩编码不是一回事" : "PCM, WAV, and codecs are different layers"}</h2>
              <p>{language === "zh" ? "PCM 是样本表达，WAV 是常见容器，MP3、AAC、Opus 等编码器负责压缩和传输取舍。" : "PCM expresses samples, WAV is a common container, and MP3, AAC, and Opus make compression and transport trade-offs."}</p>
            </div>
          </div>
          <div className="digital-topic-layer-row">
            <article><FileAudio size={18} aria-hidden="true" /><strong>PCM</strong><p>{language === "zh" ? "按顺序存放量化样本" : "Ordered quantized samples"}</p></article>
            <article><FileAudio size={18} aria-hidden="true" /><strong>WAV</strong><p>{language === "zh" ? "文件头 + PCM 数据" : "Header + PCM data"}</p></article>
            <article><Calculator size={18} aria-hidden="true" /><strong>{language === "zh" ? "感知编码" : "Perceptual codecs"}</strong><p>{language === "zh" ? "用更少数据换取可接受听感" : "Trade data size for acceptable perception"}</p></article>
          </div>
          <div className="digital-topic-codec-grid">
            {codecPrinciples.map((codec) => (
              <article key={codec.format}>
                <div><h3>{codec.format}</h3><strong>{codec.ratio[language]}</strong></div>
                <p>{codec.principle[language]}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading">

            <div>
              <h2>{language === "zh" ? "核心概念词典" : "Core concept glossary"}</h2>
              <p>{language === "zh" ? "把采样、量化、PCM 和码率放在同一条工程路径上理解。" : "Understand sampling, quantization, PCM, and bitrate along one engineering path."}</p>
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

        <section className="sound-topic-section sound-topic-bottom-grid">
          <div>

            <h2>{language === "zh" ? "理解取舍，而不是背参数" : "Understand trade-offs, not isolated specs"}</h2>
            <p>{detail.misconception[language]}</p>
          </div>
          <div className="sound-topic-cta">
            <Calculator size={22} aria-hidden="true" />
            <h2>{language === "zh" ? "进入采样实验室" : "Open the sampling lab"}</h2>
            <p>{language === "zh" ? "拖动采样点、位深和输入频率，直接观察采样、量化误差以及 PCM 二进制样本如何变化。" : "Adjust samples, bit depth, and input frequency to see sampling, quantization error, and PCM binary words change."}</p>
            <button className="diagram-open-button" type="button" onClick={onOpenLab}>
              {detail.lab?.buttonLabel[language]}
            </button>
          </div>
        </section>
      </div>
      <TopicPager language={language} onPrevious={onOpenPrevious} onBack={onBack} onNext={onOpenNext} />
    </main>
  );
}
