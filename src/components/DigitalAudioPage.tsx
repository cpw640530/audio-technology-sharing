import type { ReactNode } from "react";
import { TopicReadingLayout } from "./TopicReadingLayout";
import { ArrowLeft, BookOpen, Calculator, FileAudio } from "lucide-react";
import { categories, type Language } from "../content/knowledge";
import { codecPrinciples } from "./DigitalAudioLab";
import { TopicPager } from "./TopicPager";

type DigitalAudioPageProps = {
  relatedTopics?: ReactNode;
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

function sinePath({ cycles, amplitude, center = 78, phase = 0 }: { cycles: number; amplitude: number; center?: number; phase?: number }) {
  return Array.from({ length: 161 }, (_, index) => {
    const x = 20 + (index / 160) * 480;
    const y = center - Math.sin((index / 160) * Math.PI * 2 * cycles + phase) * amplitude;
    return `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");
}

function sumPath({ center = 78 }: { center?: number }) {
  return Array.from({ length: 161 }, (_, index) => {
    const x = 20 + (index / 160) * 480;
    const phase = (index / 160) * Math.PI * 2;
    const y = center - (Math.sin(phase) * 30 + Math.sin(phase * 2 + 0.3) * 13);
    return `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");
}

function samplePoints({ count, cycles, center }: { count: number; cycles: number; center: number }) {
  return Array.from({ length: count }, (_, index) => {
    const time = index / (count - 1);
    return {
      x: 20 + time * 480,
      y: center - Math.sin(time * Math.PI * 2 * cycles) * 30
    };
  });
}

const fundamentalWave = sinePath({ cycles: 1, amplitude: 30 });
const harmonicWave = sinePath({ cycles: 2, amplitude: 13, phase: 0.3 });
const compositeWave = sumPath({ center: 78 });
const lowRateWave = sinePath({ cycles: 2, amplitude: 30, center: 70 });
const lowRateAlias = sinePath({ cycles: 1, amplitude: 30, center: 70, phase: Math.PI });
const adequateRateWave = sinePath({ cycles: 2, amplitude: 30, center: 210 });
const lowRateSamples = samplePoints({ count: 4, cycles: 2, center: 70 });
const adequateRateSamples = samplePoints({ count: 9, cycles: 2, center: 210 });

export function DigitalAudioPage({ relatedTopics, language, onBack, onOpenLab, onOpenPrevious, onOpenNext }: DigitalAudioPageProps) {
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

      <TopicReadingLayout language={language}>
        <section className="sound-topic-section sound-topic-intro">

          <div>
            <h2>{language === "zh" ? "数字音频究竟做了什么？" : "What does digital audio actually do?"}</h2>
            <p>{detail.explanation[language]}</p>
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
              <h2>{language === "zh" ? "基本原理一：采样与奈奎斯特频率" : "Principle 1: Sampling and the Nyquist frequency"}</h2>
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
          <figure className="digital-topic-diagram digital-topic-sampling-figure">
            <figcaption>{language === "zh" ? "为什么采样率要高于最高频率的 2 倍" : "Why the sample rate must exceed twice the highest frequency"}</figcaption>
            <p>{language === "zh" ? "上图：2 Hz 信号以 3 Hz 采样，圆点同时落在原波形与 1 Hz 混叠波形上。下图：同一信号以 8 Hz 采样，每周期 4 个采样点。" : "Top: a 2 Hz signal sampled at 3 Hz; dots fit both the source and a 1 Hz alias. Bottom: the same signal sampled at 8 Hz, with four samples per cycle."}</p>
            <ul className="digital-topic-legend">
              <li className="source">{language === "zh" ? "绿色虚线：原始 2 Hz" : "Green dashed: source, 2 Hz"}</li>
              <li className="alias">{language === "zh" ? "橙色实线：混叠 1 Hz" : "Orange solid: alias, 1 Hz"}</li>
              <li>{language === "zh" ? "圆点：采样值" : "Dots: samples"}</li>
            </ul>
            <svg viewBox="0 0 520 280" role="img" aria-label={language === "zh" ? "不足采样产生混叠与足够采样的对比" : "Undersampling aliasing compared with adequate sampling"}>
              <line className="digital-axis" x1="20" y1="70" x2="500" y2="70" />
              <line className="digital-axis" x1="20" y1="210" x2="500" y2="210" />
              <path className="digital-wave source" d={lowRateWave} />
              <path className="digital-wave alias" d={lowRateAlias} />
              {lowRateSamples.map((point) => <circle key={`low-${point.x}`} className="digital-sample low" cx={point.x} cy={point.y} r="4" />)}
              <path className="digital-wave adequate" d={adequateRateWave} />
              {adequateRateSamples.map((point) => <circle key={`adequate-${point.x}`} className="digital-sample adequate" cx={point.x} cy={point.y} r="3.5" />)}
            </svg>
            <p>{language === "zh" ? "横轴：时间 0–1 s；纵轴：相对幅度，两行尺度相同，水平线为零。" : "Horizontal: time, 0–1 s. Vertical: relative amplitude, same scale in both rows; horizontal lines mark zero."}</p>
            <p>{language === "zh" ? "对于最高频率受限的基带信号，理想重建要求采样率高于 2fₘₐₓ；仅凭几个离散点不能唯一确定任意波形。工程上还要给抗混叠滤波器留过渡带。" : "For a band-limited baseband signal, ideal reconstruction requires a sample rate above 2fₘₐₓ. A few isolated samples cannot uniquely determine an arbitrary waveform. Practical anti-alias filters also need a transition band."}</p>
          </figure>
        </section>

        <section className="sound-topic-section digital-topic-principles">
          <div className="sound-topic-section-heading">
            <div>
              <h2>{language === "zh" ? "基本原理二：傅里叶变换把波形拆成频率" : "Principle 2: The Fourier transform separates frequencies"}</h2>
              <p>{language === "zh" ? "波形告诉我们信号随时间如何变化，频谱告诉我们它由哪些频率组成。两种表示描述的是同一段信号。" : "A waveform shows how a signal changes over time; a spectrum shows which frequencies compose it. Both describe the same signal."}</p>
            </div>
          </div>
          <div className="digital-topic-diagram-grid">
            <figure className="digital-topic-diagram">
              <figcaption>{language === "zh" ? "复杂波形 = 基频 + 谐波（示意）" : "Complex waveform = fundamental + harmonics (schematic)"}</figcaption>
              <ul className="digital-topic-legend">
                <li className="source">{language === "zh" ? "绿色：基频 f" : "Green: fundamental f"}</li>
                <li className="alias">{language === "zh" ? "橙色：二次谐波 2f" : "Orange: second harmonic 2f"}</li>
                <li>{language === "zh" ? "深色：逐点相加" : "Dark: pointwise sum"}</li>
              </ul>
              <svg viewBox="0 0 520 170" role="img" aria-label={language === "zh" ? "基频、二次谐波与叠加后的复杂波形" : "Fundamental, second harmonic, and composite waveform"}>
                <line className="digital-axis" x1="20" y1="78" x2="500" y2="78" />
                <path className="digital-wave fundamental" d={fundamentalWave} />
                <path className="digital-wave harmonic" d={harmonicWave} />
                <path className="digital-wave composite" d={compositeWave} />
              </svg>
              <p>{language === "zh" ? "横轴：一个基频周期的时间；纵轴：相对幅度，水平线为零。" : "Horizontal: time over one fundamental period. Vertical: relative amplitude; the horizontal line marks zero."}</p>
              <p>{language === "zh" ? "真实声音通常不是一个纯正弦波。基频决定主要音高，谐波和其他成分叠加后形成音色与波形细节。" : "Real sounds are usually not a single sine wave. The fundamental provides the main pitch, while harmonics and other components shape timbre and waveform detail."}</p>
            </figure>
          </div>
          <div className="digital-topic-equation-grid">
            <article className="digital-topic-equation-card">
              <span>Fourier transform</span>
              <code>x(t) → X(f)</code>
              <p>{language === "zh" ? "把复杂波形看成许多不同频率、幅度和相位的正弦波叠加。频谱中的峰值表示对应频率成分较强。" : "It views a complex waveform as a sum of sinusoids with different frequencies, amplitudes, and phases. A spectral peak means that frequency component is strong."}</p>
            </article>
            <article className="digital-topic-equation-card">
              <span>DFT / FFT</span>
              <code>Δf = fₛ / N</code>
              <p>{language === "zh" ? "DFT 对 N 个采样点计算离散频率结果；FFT 是更快地计算 DFT 的算法。N 越大，频率格越细，但不代表频率范围变大。" : "The DFT computes discrete frequency results from N samples; the FFT computes the DFT faster. Larger N gives finer frequency spacing, not a wider frequency range."}</p>
            </article>
            <article className="digital-topic-equation-card">
              <span>STFT</span>
              <code>frame → window → FFT</code>
              <p>{language === "zh" ? "分帧、加窗并重复 FFT 得到随时间变化的频谱。窗口长度和窗形决定时间与频率的分辨能力；hop size 决定相邻帧的时间间隔，不直接改变单帧的频率分辨率。" : "Framing, windowing, and repeated FFTs track spectra over time. Window length and shape determine time-frequency resolving power; hop size sets the interval between frames, not a single frame's frequency resolution."}</p>
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
              <span>{language === "zh" ? "理想量化信噪比" : "Ideal quantization SNR"}</span>
              <code>SQNR ≈ 6.02n + 1.76 dB</code>
              <p>{language === "zh" ? "适用于满刻度正弦输入、理想均匀量化且量化误差近似均匀分布的模型，噪声计入整个奈奎斯特带宽；不是任意信号或设备的实测动态范围。" : "Assumes a full-scale sine input, ideal uniform quantization, and approximately uniform quantization error across the full Nyquist bandwidth. It is not the measured dynamic range of an arbitrary signal or device."}</p>
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
            <article><FileAudio size={18} aria-hidden="true" /><strong>WAV</strong><p>{language === "zh" ? "常见情况：文件头 + PCM 数据；也可容纳其他编码" : "Commonly: header + PCM data; other encodings are also possible"}</p></article>
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
          <p className="sound-topic-note">{language === "zh" ? "压缩比是大致范围，会随原始 PCM 参数、目标码率、内容类型和编码器实现变化。" : "Compression ratios are rough ranges and vary with PCM source settings, target bitrate, content type, and encoder implementation."}</p>
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

      </TopicReadingLayout>
      {relatedTopics}
      <TopicPager language={language} onPrevious={onOpenPrevious} onBack={onBack} onNext={onOpenNext} />
    </main>
  );
}
