import { traditional } from "../content/traditional";
import { text } from "../content/language";
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
  const flow = {
    zh: ["连续模拟波形", "抗混叠滤波", "按采样率取点", "按位深量化", "PCM 存储 / 处理", "DAC 转换", "重建滤波", "模拟输出"], "zh-Hant": traditional(["连续模拟波形", "抗混叠滤波", "按采样率取点", "按位深量化", "PCM 存储 / 处理", "DAC 转换", "重建滤波", "模拟输出"]),
    en: ["Continuous analog wave", "Anti-alias filter", "Sample at fs", "Quantize by bit depth", "PCM storage / processing", "DAC conversion", "Reconstruction filter", "Analog output"],
    ja: ["連続アナログ波形", "アンチエイリアスフィルター", "fs で標本化", "ビット深度に応じた量子化", "PCM保存 / 処理", "DAC変換", "再構成フィルター", "アナログ出力"],
    ko: ["연속 아날로그 파형", "안티에일리어싱 필터", "fs로 샘플링", "비트 깊이에 따라 양자화", "PCM 저장 / 처리", "DAC 변환", "복원 필터", "아날로그 출력"]
  }[language];

  return (
    <main className="sound-topic-page digital-topic-page" aria-labelledby="digital-topic-title">
      <header className="sound-topic-hero">
        <button className="sound-topic-back" type="button" onClick={onBack}>
          <ArrowLeft size={17} aria-hidden="true" />
          {text(language, "返回知识库", "Back to knowledge base", "知識ベースに戻る", "지식 모음으로 돌아가기")}
        </button>
        <div className="sound-topic-kicker">
          <BookOpen size={16} aria-hidden="true" />
          {text(language, "音频基础 · 数字化链路", "Audio fundamentals · Digital signal chain", "オーディオの基礎 · デジタル信号経路", "오디오 기초 · 디지털 신호 경로")}
        </div>
        <h1 id="digital-topic-title">{digitalAudioTopic.title[language]}</h1>
        <p className="sound-topic-lede">{digitalAudioTopic.summary[language]}</p>
        <div className="sound-topic-meta">
          <span>{text(language, "采样定理", "Sampling theorem", "標本化定理", "샘플링 정리")}</span>
          <span>{text(language, "量化与位深", "Quantization and bit depth", "量子化とビット深度", "양자화와 비트 깊이")}</span>
          <span>{text(language, "PCM 与编码", "PCM and codecs", "PCM とコーデック", "PCM과 코덱")}</span>
        </div>
      </header>

      <TopicReadingLayout language={language}>
        <section className="sound-topic-section sound-topic-intro">

          <div>
            <h2>{text(language, "数字音频究竟做了什么？", "What does digital audio actually do?", "デジタルオーディオは何をしているのか", "디지털 오디오는 실제로 무엇을 하는가?")}</h2>
            <p>{detail.explanation[language]}</p>
          </div>
        </section>

        <p className="sound-topic-note">{text(language, "沿着模拟输入 → ADC → PCM → DAC → 模拟输出阅读。接口如何搬运样本见数字音频接口，压缩算法详见音频编解码。", "Follow analog input → ADC → PCM → DAC → analog output. See digital interfaces for sample transport and audio codecs for compression algorithms.", "アナログ入力 → ADC → PCM → DAC → アナログ出力の順に読みます。転送はデジタル接続、圧縮は音声コーデックで扱います。", "아날로그 입력 → ADC → PCM → DAC → 아날로그 출력 순으로 읽습니다. 샘플 전송은 디지털 인터페이스, 압축은 오디오 코덱에서 다룹니다.")}</p>
        <section className="sound-topic-section sound-topic-bottom-grid">
          <div>
            <h2>{text(language, "理解取舍，而不是背参数", "Understand trade-offs, not isolated specs", "数値だけでなくトレードオフを理解する", "수치보다 절충 관계를 이해하기")}</h2>
            <p>{detail.misconception[language]}</p>
          </div>
          <div className="sound-topic-cta">
            <Calculator size={22} aria-hidden="true" />
            <h2>{text(language, "进入 ADC / DAC 实验室", "Open the ADC / DAC lab", "ADC / DAC実験室へ", "ADC / DAC 실험실 열기")}</h2>
            <p>{text(language, "切换 ADC 与 DAC：观察采样、量化、PCM 码字，再逐步查看电压映射、保持和重建滤波。", "Switch ADC and DAC to explore sampling, quantization and PCM words, then voltage mapping, hold and reconstruction filtering.", "ADCとDACを切り替え、標本化・量子化・PCMから、電圧変換・ホールド・再構成フィルターまで観察します。", "ADC와 DAC를 전환하며 샘플링, 양자화, PCM부터 전압 매핑, 홀드, 복원 필터까지 살펴봅니다.")}</p>
            <button className="diagram-open-button" type="button" onClick={onOpenLab}>
              {detail.lab?.buttonLabel[language]}
            </button>
          </div>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading">

            <div>
              <h2>{text(language, "一条完整的数字化链路", "The complete digitization chain", "デジタル化の全体像", "전체 디지털 변환 경로")}</h2>
              <p>{text(language, "采样解决时间轴，量化解决幅度轴，编码负责组织和压缩已经得到的数字。", "Sampling handles the time axis, quantization handles amplitude, and encoding organizes or compresses the resulting numbers.", "標本化は時間軸、量子化は振幅軸を離散化し、符号化は得られた数値を整理・圧縮します。", "샘플링은 시간축을, 양자화는 진폭축을 이산화하며 인코딩은 얻은 수치를 정리하거나 압축합니다.")}</p>
            </div>
          </div>
          <ol className="sound-topic-flow digital-topic-flow" aria-label={text(language, "模拟信号到数字音频的流程", "Analog to digital audio flow", "アナログからデジタル音声への流れ", "아날로그에서 디지털 오디오까지의 흐름")}>
            {flow.map((step, index) => (
              <li key={step}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{step}</strong>
              </li>
            ))}
          </ol>
          <p className="sound-topic-note">{text(language, "抗混叠滤波通常位于 ADC 前面；它先限制输入带宽，再让采样率有明确的最高可表示频率。", "An anti-alias filter usually sits before the ADC. It limits input bandwidth so the sample rate has a defined maximum representable frequency.", "通常、ADC の前にアンチエイリアスフィルターを置きます。入力帯域を制限し、標本化周波数に応じた帯域内に収めます。", "보통 ADC 앞에 안티에일리어싱 필터를 둡니다. 입력 대역폭을 제한하여 샘플링 주파수로 표현할 수 있는 대역 안에 맞춥니다.")}</p>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading">

            <div>
              <h2>{text(language, "基本原理一：采样与奈奎斯特频率", "Principle 1: Sampling and the Nyquist frequency", "原理 1：標本化とナイキスト周波数", "원리 1: 샘플링과 나이퀴스트 주파수")}</h2>
              <p>{detail.keyConcepts[0][language]} {detail.keyConcepts[1][language]}</p>
            </div>
          </div>
          <div className="digital-topic-equation-grid">
            <article className="digital-topic-equation-card">
              <span>{text(language, "奈奎斯特条件", "Nyquist", "ナイキスト条件", "나이퀴스트 조건")}</span>
              <code>fₛ &gt; 2 × fₘₐₓ</code>
              <p>{text(language, "如果采样率不够，高频会折叠成错误的低频，形成混叠；提高采样率不是无条件提升音质。", "If the sample rate is too low, high frequencies fold into incorrect lower frequencies. A higher rate is not an unconditional quality upgrade.", "標本化周波数が低すぎると高周波が誤った低周波へ折り返します。標本化周波数を上げれば常に音質が向上するわけではありません。", "샘플링 주파수가 너무 낮으면 고주파가 잘못된 저주파로 접힙니다. 주파수를 높인다고 무조건 음질이 좋아지지는 않습니다.")}</p>
            </article>
            <article className="digital-topic-equation-card">
              <span>{text(language, "奈奎斯特频率", "Nyquist frequency", "ナイキスト周波数", "나이퀴스트 주파수")}</span>
              <code>fN = fₛ / 2</code>
              <p>{text(language, "48 kHz 系统的奈奎斯特频率是 24 kHz，实际还要留出抗混叠滤波器的过渡带。", "A 48 kHz system has a 24 kHz Nyquist frequency, with practical room needed for the anti-alias filter transition band.", "48 kHz 系のナイキスト周波数は 24 kHz です。実際にはアンチエイリアスフィルターの遷移帯域も確保します。", "48 kHz 시스템의 나이퀴스트 주파수는 24 kHz이며 실제로는 안티에일리어싱 필터의 전이 대역도 확보해야 합니다.")}</p>
            </article>
          </div>
          <figure className="digital-topic-diagram digital-topic-sampling-figure">
            <figcaption>{text(language, "为什么采样率要高于最高频率的 2 倍", "Why the sample rate must exceed twice the highest frequency", "なぜ最高周波数の 2 倍を超える標本化周波数が必要か", "왜 최고 주파수의 두 배보다 높게 샘플링해야 하는가")}</figcaption>
            <p>{text(language, "上图：2 Hz 信号以 3 Hz 采样，圆点同时落在原波形与 1 Hz 混叠波形上。下图：同一信号以 8 Hz 采样，每周期 4 个采样点。", "Top: a 2 Hz signal sampled at 3 Hz; dots fit both the source and a 1 Hz alias. Bottom: the same signal sampled at 8 Hz, with four samples per cycle.", "上：2 Hz 信号を 3 Hz で標本化すると、点は元の波形にも 1 Hz の折り返し波形にも一致します。下：同じ信号を 8 Hz で標本化し、1 周期に 4 点を得ます。", "위: 2 Hz 신호를 3 Hz로 샘플링하면 점들이 원래 파형과 1 Hz 에일리어스 모두에 일치합니다. 아래: 같은 신호를 8 Hz로 샘플링하여 주기당 4점을 얻습니다.")}</p>
            <ul className="digital-topic-legend">
              <li className="source">{text(language, "绿色虚线：原始 2 Hz", "Green dashed: source, 2 Hz", "緑の破線：元信号 2 Hz", "녹색 점선: 원본 2 Hz")}</li>
              <li className="alias">{text(language, "橙色实线：混叠 1 Hz", "Orange solid: alias, 1 Hz", "橙の実線：折り返し 1 Hz", "주황 실선: 에일리어스 1 Hz")}</li>
              <li>{text(language, "圆点：采样值", "Dots: samples", "点：サンプル値", "점: 샘플값")}</li>
            </ul>
            <svg viewBox="0 0 520 280" role="img" aria-label={text(language, "不足采样产生混叠与足够采样的对比", "Undersampling aliasing compared with adequate sampling", "標本化不足の折り返しと十分な標本化の比較", "불충분한 샘플링의 에일리어싱과 충분한 샘플링 비교")}>
              <line className="digital-axis" x1="20" y1="70" x2="500" y2="70" />
              <line className="digital-axis" x1="20" y1="210" x2="500" y2="210" />
              <path className="digital-wave source" d={lowRateWave} />
              <path className="digital-wave alias" d={lowRateAlias} />
              {lowRateSamples.map((point) => <circle key={`low-${point.x}`} className="digital-sample low" cx={point.x} cy={point.y} r="4" />)}
              <path className="digital-wave adequate" d={adequateRateWave} />
              {adequateRateSamples.map((point) => <circle key={`adequate-${point.x}`} className="digital-sample adequate" cx={point.x} cy={point.y} r="3.5" />)}
            </svg>
            <p>{text(language, "横轴：时间 0–1 s；纵轴：相对幅度，两行尺度相同，水平线为零。", "Horizontal: time, 0–1 s. Vertical: relative amplitude, same scale in both rows; horizontal lines mark zero.", "横軸：時間 0–1 s。縦軸：相対振幅。上下は同じ尺度で、水平線はゼロです。", "가로축: 시간 0–1 s. 세로축: 상대 진폭. 두 행의 척도는 같으며 수평선은 0입니다.")}</p>
            <p>{text(language, "对于最高频率受限的基带信号，理想重建要求采样率高于 2fₘₐₓ；仅凭几个离散点不能唯一确定任意波形。工程上还要给抗混叠滤波器留过渡带。", "For a band-limited baseband signal, ideal reconstruction requires a sample rate above 2fₘₐₓ. A few isolated samples cannot uniquely determine an arbitrary waveform. Practical anti-alias filters also need a transition band.", "帯域制限されたベースバンド信号の理想再構成には 2fₘₐₓ を超える標本化周波数が必要です。少数の点だけでは任意の波形を一意に決められません。実際のフィルターには遷移帯域も必要です。", "대역 제한된 기저대역 신호의 이상적인 복원에는 2fₘₐₓ보다 높은 샘플링 주파수가 필요합니다. 몇 개의 점만으로 임의의 파형을 유일하게 정할 수는 없습니다. 실제 필터에는 전이 대역도 필요합니다.")}</p>
          </figure>
        </section>

        <section className="sound-topic-section">
          <h2>{text(language, "从 ADC 输入范围到 DAC 模拟输出", "From ADC input range to DAC analog output", "ADCの入力範囲からDACのアナログ出力へ", "ADC 입력 범위에서 DAC 아날로그 출력까지")}</h2>
          <div className="digital-topic-equation-grid">
            <article className="digital-topic-equation-card">
              <span>{text(language, "ADC 前：增益与削波", "Before ADC: gain and clipping", "ADCの前：ゲインとクリップ", "ADC 이전: 이득과 클리핑")}</span>
              <code>Vpeak × G ≤ VFS</code>
              <p>{text(language, "PGA 是可编程增益放大器。假设 ADC 输入范围相对中点为 ±1 V，0.2 V 峰值经 4 倍增益成为 0.8 V；6 倍则要求 1.2 V，超出范围就会削波。增益太低又会浪费量化范围；增加位深不能恢复已削掉的波峰。", "A PGA is a programmable gain amplifier. With an ADC range of ±1 V relative to its midpoint, a 0.2 V peak at 4× gain becomes 0.8 V; 6× requests 1.2 V and clips. Too little gain wastes quantization range; more bits cannot recover clipped peaks.", "PGAは可変ゲイン増幅器です。入力範囲が中点に対して±1 Vなら、0.2 Vのピークを4倍すると0.8 V、6倍では1.2 Vとなりクリップします。小さすぎるゲインは量子化範囲を生かせず、ビット数を増やしても失われたピークは戻りません。", "PGA는 프로그래머블 이득 증폭기입니다. ADC 범위가 중점 기준 ±1 V라면 0.2 V 피크를 4배 증폭하면 0.8 V, 6배면 1.2 V로 클리핑됩니다. 이득이 너무 작으면 양자화 범위를 낭비하며 비트 수를 늘려도 잘린 피크는 복구되지 않습니다.")}</p>
            </article>
            <article className="digital-topic-equation-card">
              <span>{text(language, "DAC 后：重建与负载", "After DAC: reconstruction and load", "DACの後：再構成と負荷", "DAC 이후: 복원과 부하")}</span>
              <code>PCM → DAC → LPF → amplifier</code>
              <p>{text(language, "DAC 按时钟把样本转成模拟输出，重建滤波抑制采样镜像。实验室用零阶保持和一阶 RC 展示这个过程，不代表所有 DAC 的内部结构。线路输出通常还需要功放才能驱动扬声器；播放质量也受输出级和负载影响。", "A clocked DAC converts samples to analog output; reconstruction filtering suppresses sampling images. The lab uses zero-order hold and a first-order RC model, not a universal DAC architecture. Line output generally needs a power amplifier to drive speakers; the output stage and load also matter.", "DACはクロックに従ってサンプルをアナログ出力へ変換し、再構成フィルターでイメージを抑えます。ラボのゼロ次ホールドと一次RCは説明用モデルで、すべてのDACの内部構造ではありません。ライン出力でスピーカーを駆動するには通常パワーアンプが必要です。", "DAC는 클록에 따라 샘플을 아날로그 출력으로 변환하고 복원 필터로 샘플링 이미지를 억제합니다. 실험실의 영차 홀드와 1차 RC는 설명용 모델로 모든 DAC 구조를 뜻하지 않습니다. 라인 출력으로 스피커를 구동하려면 보통 파워 앰프가 필요합니다.")}</p>
            </article>
          </div>
          <h3>{text(language, "硬件 Codec：把转换链路集成到芯片", "Hardware codec: an integrated conversion path", "ハードウェアCodec：変換経路をチップに統合", "하드웨어 Codec: 변환 경로를 칩에 통합")}</h3>
          <p>{text(language, "音频 Codec 芯片通常集成 ADC、DAC，以及部分 PGA、混音或耳机输出电路，具体以芯片手册为准；它不是 MP3 / AAC 压缩算法。录音侧从模拟输入到 PCM，播放侧从 PCM 到模拟输出。I2S / TDM 搬运样本，I²C / SPI 配置寄存器，它们不负责采样量化本身。", "An audio codec chip typically integrates ADCs, DACs and some PGA, mixer or headphone circuits; check the datasheet. It is not an MP3/AAC compression algorithm. Capture converts analog input to PCM, playback converts PCM to analog. I2S/TDM carry samples; I²C/SPI configure registers, not sampling and quantization.", "音声Codecチップは通常ADC、DAC、一部のPGAやミキサー、ヘッドホン回路を統合します。詳細は仕様書で確認します。MP3/AAC圧縮とは別物です。録音はアナログからPCM、再生はPCMからアナログへ変換します。I2S/TDMはサンプル転送、I²C/SPIはレジスター設定を担います。", "오디오 Codec 칩은 보통 ADC, DAC와 일부 PGA, 믹서 또는 헤드폰 회로를 통합하며 세부 사항은 데이터시트를 따릅니다. MP3/AAC 압축 알고리즘과 다릅니다. 녹음은 아날로그를 PCM으로, 재생은 PCM을 아날로그로 변환합니다. I2S/TDM은 샘플 전송, I²C/SPI는 레지스터 설정을 담당합니다.")}</p>
        </section>

        <section className="sound-topic-section digital-topic-principles">
          <div className="sound-topic-section-heading">
            <div>
              <h2>{text(language, "基本原理二：傅里叶变换把波形拆成频率", "Principle 2: The Fourier transform separates frequencies", "原理 2：フーリエ変換で周波数成分に分ける", "원리 2: 푸리에 변환으로 주파수 성분 분리")}</h2>
              <p>{text(language, "波形告诉我们信号随时间如何变化，频谱告诉我们它由哪些频率组成。两种表示描述的是同一段信号。", "A waveform shows how a signal changes over time; a spectrum shows which frequencies compose it. Both describe the same signal.", "波形は時間変化を、スペクトルは構成する周波数を示します。どちらも同じ信号の表現です。", "파형은 시간 변화를, 스펙트럼은 구성 주파수를 보여 줍니다. 둘 다 같은 신호의 표현입니다.")}</p>
            </div>
          </div>
          <div className="digital-topic-diagram-grid">
            <figure className="digital-topic-diagram">
              <figcaption>{text(language, "复杂波形 = 基频 + 谐波（示意）", "Complex waveform = fundamental + harmonics (schematic)", "複雑な波形 = 基本波 + 高調波（模式図）", "복잡한 파형 = 기본파 + 고조파 (모식도)")}</figcaption>
              <ul className="digital-topic-legend">
                <li className="source">{text(language, "绿色：基频 f", "Green: fundamental f", "緑：基本波 f", "녹색: 기본파 f")}</li>
                <li className="alias">{text(language, "橙色：二次谐波 2f", "Orange: second harmonic 2f", "橙：第 2 高調波 2f", "주황: 2차 고조파 2f")}</li>
                <li>{text(language, "深色：逐点相加", "Dark: pointwise sum", "濃色：各点の和", "진한 색: 점별 합")}</li>
              </ul>
              <svg viewBox="0 0 520 170" role="img" aria-label={text(language, "基频、二次谐波与叠加后的复杂波形", "Fundamental, second harmonic, and composite waveform", "基本波、第 2 高調波と合成波形", "기본파, 2차 고조파 및 합성 파형")}>
                <line className="digital-axis" x1="20" y1="78" x2="500" y2="78" />
                <path className="digital-wave fundamental" d={fundamentalWave} />
                <path className="digital-wave harmonic" d={harmonicWave} />
                <path className="digital-wave composite" d={compositeWave} />
              </svg>
              <p>{text(language, "横轴：一个基频周期的时间；纵轴：相对幅度，水平线为零。", "Horizontal: time over one fundamental period. Vertical: relative amplitude; the horizontal line marks zero.", "横軸：基本波の 1 周期の時間。縦軸：相対振幅。水平線はゼロです。", "가로축: 기본파 한 주기의 시간. 세로축: 상대 진폭. 수평선은 0입니다.")}</p>
              <p>{text(language, "真实声音通常不是一个纯正弦波。基频决定主要音高，谐波和其他成分叠加后形成音色与波形细节。", "Real sounds are usually not a single sine wave. The fundamental provides the main pitch, while harmonics and other components shape timbre and waveform detail.", "実際の音は通常、単一の正弦波ではありません。基本波が主な音高に関わり、高調波などの成分が音色と波形の細部を形作ります。", "실제 소리는 보통 단일 정현파가 아닙니다. 기본파는 주된 음높이에 관여하고 고조파와 다른 성분은 음색과 파형의 세부를 형성합니다.")}</p>
            </figure>
          </div>
          <div className="digital-topic-equation-grid">
            <article className="digital-topic-equation-card">
              <span>{text(language, "傅里叶变换", "Fourier transform", "フーリエ変換", "푸리에 변환")}</span>
              <code>x(t) → X(f)</code>
              <p>{text(language, "把复杂波形看成许多不同频率、幅度和相位的正弦波叠加。频谱中的峰值表示对应频率成分较强。", "It views a complex waveform as a sum of sinusoids with different frequencies, amplitudes, and phases. A spectral peak means that frequency component is strong.", "複雑な波形を、周波数・振幅・位相の異なる正弦波の和として捉えます。スペクトルのピークは対応する周波数成分の強さを示します。", "복잡한 파형을 주파수, 진폭, 위상이 다른 정현파의 합으로 봅니다. 스펙트럼 봉우리는 해당 주파수 성분이 강함을 나타냅니다.")}</p>
            </article>
            <article className="digital-topic-equation-card">
              <span>DFT / FFT</span>
              <code>Δf = fₛ / N</code>
              <p>{text(language, "DFT 对 N 个采样点计算离散频率结果；FFT 是更快地计算 DFT 的算法。N 越大，频率格越细，但不代表频率范围变大。", "The DFT computes discrete frequency results from N samples; the FFT computes the DFT faster. Larger N gives finer frequency spacing, not a wider frequency range.", "DFT は N 個のサンプルから離散的な周波数成分を求め、FFT はそれを高速に計算します。N が大きいほど周波数間隔は細かくなりますが、周波数範囲は広がりません。", "DFT는 N개 샘플로 이산 주파수 성분을 계산하며 FFT는 이를 빠르게 계산합니다. N이 크면 주파수 간격이 촘촘해지지만 주파수 범위가 넓어지지는 않습니다.")}</p>
            </article>
            <article className="digital-topic-equation-card">
              <span>STFT</span>
              <code>frame → window → FFT</code>
              <p>{text(language, "分帧、加窗并重复 FFT 得到随时间变化的频谱。窗口长度和窗形决定时间与频率的分辨能力；hop size 决定相邻帧的时间间隔，不直接改变单帧的频率分辨率。", "Framing, windowing, and repeated FFTs track spectra over time. Window length and shape determine time-frequency resolving power; hop size sets the interval between frames, not a single frame's frequency resolution.", "フレーム分割・窓掛け・FFT の反復で時間変化するスペクトルを求めます。窓の長さと形が時間・周波数の分解能力を決め、ホップ幅はフレーム間隔を決めます。単一フレームの周波数分解能を直接変えるものではありません。", "프레임 분할, 창 적용, 반복 FFT로 시간에 따른 스펙트럼을 구합니다. 창 길이와 모양은 시간·주파수 분해 능력을, 홉 크기는 프레임 간격을 정합니다. 홉 크기가 한 프레임의 주파수 분해능을 직접 바꾸지는 않습니다.")}</p>
            </article>
          </div>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading">

            <div>
              <h2>{text(language, "位深决定幅度能分多细", "Bit depth sets amplitude precision", "ビット深度が振幅の精度を決める", "비트 깊이가 진폭 정밀도를 결정")}</h2>
              <p>{terms.find((term) => term.name.en === "Quantization")?.explanation[language]}</p>
            </div>
          </div>
          <div className="digital-topic-equation-grid">
            <article className="digital-topic-equation-card">
              <span>{text(language, "量化等级", "Levels", "量子化レベル", "양자화 레벨")}</span>
              <code>levels = 2ⁿ</code>
              <p>{text(language, "n-bit 量化可以表达 2ⁿ 个等级；位深越低，波形越容易呈现阶梯和量化误差。", "n-bit quantization provides 2ⁿ levels; lower bit depth makes stair-steps and quantization error more visible.", "n-bit 量子化には 2ⁿ 段階があります。ビット深度が低いほど階段状の変化と量子化誤差が目立ちます。", "n-bit 양자화는 2ⁿ개 레벨을 제공합니다. 비트 깊이가 낮을수록 계단 모양과 양자화 오차가 뚜렷해집니다.")}</p>
            </article>
            <article className="digital-topic-equation-card">
              <span>{text(language, "理想量化信噪比", "Ideal quantization SNR", "理想量子化 SNR", "이상적인 양자화 SNR")}</span>
              <code>SQNR ≈ 6.02n + 1.76 dB</code>
              <p>{text(language, "适用于满刻度正弦输入、理想均匀量化且量化误差近似均匀分布的模型，噪声计入整个奈奎斯特带宽；不是任意信号或设备的实测动态范围。", "Assumes a full-scale sine input, ideal uniform quantization, and approximately uniform quantization error across the full Nyquist bandwidth. It is not the measured dynamic range of an arbitrary signal or device.", "フルスケールの正弦波、理想的な一様量子化、ほぼ一様な量子化誤差を仮定し、ナイキスト帯域全体のノイズを含めます。任意の信号や機器の実測ダイナミックレンジではありません。", "풀 스케일 정현파, 이상적인 균일 양자화, 거의 균일한 양자화 오차를 가정하고 전체 나이퀴스트 대역의 잡음을 포함합니다. 임의의 신호나 장치의 실측 다이내믹 레인지가 아닙니다.")}</p>
            </article>
          </div>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading">

            <div>
              <h2>{text(language, "PCM、WAV 和压缩编码不是一回事", "PCM, WAV, and codecs are different layers", "PCM・WAV・コーデックは異なる層", "PCM, WAV, 코덱은 서로 다른 계층")}</h2>
              <p>{text(language, "PCM 是样本表达，WAV 是常见容器，MP3、AAC、Opus 等编码器负责压缩和传输取舍。", "PCM expresses samples, WAV is a common container, and MP3, AAC, and Opus make compression and transport trade-offs.", "PCM はサンプルの表現、WAV は一般的なコンテナです。MP3・AAC・Opus は圧縮と伝送のトレードオフを扱います。", "PCM은 샘플 표현이고 WAV는 일반적인 컨테이너입니다. MP3, AAC, Opus는 압축과 전송의 절충을 다룹니다.")}</p>
            </div>
          </div>
          <div className="digital-topic-layer-row">
            <article><FileAudio size={18} aria-hidden="true" /><strong>PCM</strong><p>{text(language, "按顺序存放量化样本", "Ordered quantized samples", "順番に並ぶ量子化サンプル", "순서대로 저장된 양자화 샘플")}</p></article>
            <article><FileAudio size={18} aria-hidden="true" /><strong>WAV</strong><p>{text(language, "常见情况：文件头 + PCM 数据；也可容纳其他编码", "Commonly: header + PCM data; other encodings are also possible", "一般例：ヘッダー + PCM。ほかの符号化形式も格納可能", "일반적인 예: 헤더 + PCM. 다른 인코딩도 저장 가능")}</p></article>
            <article><Calculator size={18} aria-hidden="true" /><strong>{text(language, "感知编码", "Perceptual codecs", "知覚符号化", "지각 코덱")}</strong><p>{text(language, "用更少数据换取可接受听感", "Trade data size for acceptable perception", "許容できる聴感を保ちながらデータ量を削減", "허용 가능한 청감을 유지하며 데이터 축소")}</p></article>
          </div>
          <div className="digital-topic-codec-grid">
            {codecPrinciples.map((codec) => (
              <article key={codec.format}>
                <div><h3>{codec.format}</h3><strong>{codec.ratio[language]}</strong></div>
                <p>{codec.principle[language]}</p>
              </article>
            ))}
          </div>
          <p className="sound-topic-note">{text(language, "压缩比是大致范围，会随原始 PCM 参数、目标码率、内容类型和编码器实现变化。", "Compression ratios are rough ranges and vary with PCM source settings, target bitrate, content type, and encoder implementation.", "圧縮率は目安であり、元の PCM 設定、目標ビットレート、内容、エンコーダー実装によって変わります。", "압축률은 대략적인 범위이며 PCM 원본 설정, 목표 비트레이트, 콘텐츠 및 인코더 구현에 따라 달라집니다.")}</p>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading">

            <div>
              <h2>{text(language, "核心概念词典", "Core concept glossary", "基本用語", "핵심 용어")}</h2>
              <p>{text(language, "把采样、量化、PCM 和码率放在同一条工程路径上理解。", "Understand sampling, quantization, PCM, and bitrate along one engineering path.", "標本化・量子化・PCM・ビットレートを一つの信号経路として理解します。", "샘플링, 양자화, PCM, 비트레이트를 하나의 신호 경로로 이해합니다.")}</p>
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
