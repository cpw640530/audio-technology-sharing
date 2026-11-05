import { traditional } from "../content/traditional";
import type { ReactNode } from "react";
import { TopicReadingLayout } from "./TopicReadingLayout";
import { ArrowLeft, BookOpen, CircuitBoard } from "lucide-react";
import type { Category, Language, Topic } from "../content/knowledge";
import { TopicPager } from "./TopicPager";

type DisplayTopic = Topic & { category: Category };

type Localized = Record<"zh" | "en" | "ja" | "ko" | "zh-Hant", string>;

type CoreSignalProcessingPageProps = {
  relatedTopics?: ReactNode;
  language: Language;
  topic: DisplayTopic;
  onBack: () => void;
  onOpenLab: () => void;
  onOpenNext?: () => void;
};

const processingJobs = [
  {
    number: "01",
    title: { zh: "分析结构", "zh-Hant": traditional("分析结构"), en: "Analyze structure", ja: "構造を分析", ko: "구조 분석" },
    input: { zh: "PCM 波形", "zh-Hant": traditional("PCM 波形"), en: "PCM waveform", ja: "PCM 波形", ko: "PCM 파형" },
    method: { zh: "时间域、FFT / STFT", "zh-Hant": traditional("时间域、FFT / STFT"), en: "Time domain, FFT / STFT", ja: "時間領域、FFT / STFT", ko: "시간 영역, FFT / STFT" },
    output: { zh: "波形、频谱或特征；原 PCM 不一定改变", "zh-Hant": traditional("波形、频谱或特征；原 PCM 不一定改变"), en: "Waveform, spectrum, or features; PCM may remain unchanged", ja: "波形、スペクトル、または特徴量。元の PCM は変わらない場合がある", ko: "파형, 스펙트럼 또는 특징값. 원본 PCM은 바뀌지 않을 수 있음" }
  },
  {
    number: "02",
    title: { zh: "塑造频段", "zh-Hant": traditional("塑造频段"), en: "Shape frequency bands", ja: "周波数帯域を整形", ko: "주파수 대역 형성" },
    input: { zh: "PCM 样本", "zh-Hant": traditional("PCM 样本"), en: "PCM samples", ja: "PCM サンプル", ko: "PCM 샘플" },
    method: { zh: "FIR / IIR、滤波器、EQ", "zh-Hant": traditional("FIR / IIR、滤波器、EQ"), en: "FIR / IIR, filters, EQ", ja: "FIR / IIR、フィルター、EQ", ko: "FIR / IIR, 필터, EQ" },
    output: { zh: "各频段能量改变后的 PCM", "zh-Hant": traditional("各频段能量改变后的 PCM"), en: "PCM with reshaped frequency energy", ja: "各帯域のエネルギーを変えた PCM", ko: "각 대역의 에너지가 바뀐 PCM" }
  },
  {
    number: "03",
    title: { zh: "控制电平", "zh-Hant": traditional("控制电平"), en: "Control level", ja: "レベルを制御", ko: "레벨 제어" },
    input: { zh: "PCM 与电平包络", "zh-Hant": traditional("PCM 与电平包络"), en: "PCM and level envelope", ja: "PCM とレベル包絡", ko: "PCM과 레벨 엔벨로프" },
    method: { zh: "压缩器、Limiter", "zh-Hant": traditional("压缩器、Limiter"), en: "Compressor, limiter", ja: "コンプレッサー、リミッター", ko: "컴프레서, 리미터" },
    output: { zh: "响度、瞬态和峰值受控的 PCM", "zh-Hant": traditional("响度、瞬态和峰值受控的 PCM"), en: "PCM with controlled loudness, transients, and peaks", ja: "ラウドネス、トランジェント、ピークを制御した PCM", ko: "라우드니스, 트랜지언트, 피크가 제어된 PCM" }
  }
];

const signalPaths = [
  {
    title: { zh: "分析路径", "zh-Hant": traditional("分析路径"), en: "Analysis path", ja: "解析経路", ko: "분석 경로" },
    note: { zh: "输出频谱或特征，通常不直接改变声音。", "zh-Hant": traditional("输出频谱或特征，通常不直接改变声音。"), en: "Produces spectra or features and usually does not directly change sound.", ja: "スペクトルや特徴量を出力し、通常は音そのものを直接変えない。", ko: "스펙트럼이나 특징값을 출력하며 보통 소리 자체를 직접 바꾸지 않음." },
    steps: {
      zh: ["输入 PCM", "分帧 / 加窗", "FFT / STFT", "频谱 / 特征"], "zh-Hant": traditional(["输入 PCM", "分帧 / 加窗", "FFT / STFT", "频谱 / 特征"]),
      en: ["Input PCM", "Frame / window", "FFT / STFT", "Spectrum / features"],
      ja: ["入力 PCM", "フレーム分割 / 窓掛け", "FFT / STFT", "スペクトル / 特徴量"],
      ko: ["입력 PCM", "프레임 분할 / 윈도잉", "FFT / STFT", "스펙트럼 / 특징값"]
    }
  },
  {
    title: { zh: "时域处理路径", "zh-Hant": traditional("时域处理路径"), en: "Time-domain processing path", ja: "時間領域処理の経路", ko: "시간 영역 처리 경로" },
    note: { zh: "许多 FIR、IIR、EQ 和动态处理可直接逐样本或逐帧运行。", "zh-Hant": traditional("许多 FIR、IIR、EQ 和动态处理可直接逐样本或逐帧运行。"), en: "Many FIR, IIR, EQ, and dynamics algorithms run directly per sample or frame.", ja: "多くの FIR、IIR、EQ、ダイナミクス処理はサンプル単位またはフレーム単位で直接動作する。", ko: "많은 FIR, IIR, EQ 및 다이내믹 처리는 샘플 또는 프레임 단위로 직접 실행할 수 있음." },
    steps: {
      zh: ["输入 PCM", "滤波 / EQ", "动态处理", "输出 PCM"], "zh-Hant": traditional(["输入 PCM", "滤波 / EQ", "动态处理", "输出 PCM"]),
      en: ["Input PCM", "Filter / EQ", "Dynamics", "Output PCM"],
      ja: ["入力 PCM", "フィルター / EQ", "ダイナミクス処理", "出力 PCM"],
      ko: ["입력 PCM", "필터 / EQ", "다이내믹 처리", "출력 PCM"]
    }
  },
  {
    title: { zh: "频域处理路径", "zh-Hant": traditional("频域处理路径"), en: "Frequency-domain processing path", ja: "周波数領域処理の経路", ko: "주파수 영역 처리 경로" },
    note: { zh: "只有需要在频率格上修改并还原音频时，才需要 IFFT 和重叠相加。", "zh-Hant": traditional("只有需要在频率格上修改并还原音频时，才需要 IFFT 和重叠相加。"), en: "IFFT and overlap-add are needed when frequency bins are modified and audio must be reconstructed.", ja: "周波数ビンを変更して音声を復元する場合にだけ、IFFT とオーバーラップ加算が必要になる。", ko: "주파수 빈을 수정하고 오디오를 복원해야 할 때만 IFFT와 오버랩-애드가 필요함." },
    steps: {
      zh: ["FFT", "修改频率格", "IFFT", "重叠相加"], "zh-Hant": traditional(["FFT", "修改频率格", "IFFT", "重叠相加"]),
      en: ["FFT", "Modify bins", "IFFT", "Overlap-add"],
      ja: ["FFT", "周波数ビンを変更", "IFFT", "オーバーラップ加算"],
      ko: ["FFT", "빈 수정", "IFFT", "오버랩-애드"]
    }
  }
];

const copy = {
  back: { zh: "返回知识库", "zh-Hant": traditional("返回知识库"), en: "Back to knowledge base", ja: "知識ベースに戻る", ko: "지식 베이스로 돌아가기" },
  kicker: { zh: "传统算法 · 专业内容", "zh-Hant": traditional("传统算法 · 专业内容"), en: "Traditional DSP · Deep dive", ja: "従来アルゴリズム · 専門解説", ko: "전통 알고리즘 · 전문 해설" },
  signalAnalysis: { zh: "信号分析", "zh-Hant": traditional("信号分析"), en: "Signal analysis", ja: "信号解析", ko: "신호 분석" },
  frequencyShaping: { zh: "频段塑形", "zh-Hant": traditional("频段塑形"), en: "Frequency shaping", ja: "周波数帯域の整形", ko: "주파수 대역 형성" },
  levelControl: { zh: "电平控制", "zh-Hant": traditional("电平控制"), en: "Level control", ja: "レベル制御", ko: "레벨 제어" },
  intro: { zh: "先判断：分析还是处理", "zh-Hant": traditional("先判断：分析还是处理"), en: "First decide: analyze or process", ja: "まず判断する：解析か処理か", ko: "먼저 판단하기: 분석인가 처리인가" },
  jobs: { zh: "一段 PCM 的三类任务", "zh-Hant": traditional("一段 PCM 的三类任务"), en: "Three jobs for one PCM stream", ja: "1 本の PCM ストリームで行う 3 つの仕事", ko: "하나의 PCM 스트림이 수행하는 세 가지 작업" },
  jobsLead: { zh: "先看算法要回答什么问题，再选择时间域、频率域或电平检测方法。", "zh-Hant": traditional("先看算法要回答什么问题，再选择时间域、频率域或电平检测方法。"), en: "Choose time-domain, frequency-domain, or level detection methods based on the question the algorithm must answer.", ja: "アルゴリズムが答える問いを確認してから、時間領域、周波数領域、レベル検出の方法を選ぶ。", ko: "알고리즘이 답해야 할 질문을 먼저 보고 시간 영역, 주파수 영역 또는 레벨 검출 방법을 선택함." },
  input: { zh: "输入", "zh-Hant": traditional("输入"), en: "Input", ja: "入力", ko: "입력" },
  method: { zh: "方法", "zh-Hant": traditional("方法"), en: "Method", ja: "方法", ko: "방법" },
  result: { zh: "结果", "zh-Hant": traditional("结果"), en: "Result", ja: "結果", ko: "결과" },
  paths: { zh: "不要把所有 DSP 都画成 FFT 链路", "zh-Hant": traditional("不要把所有 DSP 都画成 FFT 链路"), en: "Not every DSP algorithm needs an FFT path", ja: "すべての DSP を FFT 経路として描かない", ko: "모든 DSP를 FFT 경로로 그리지 않기" },
  pathsLead: { zh: "分析、时域处理和频域处理是三条不同路径；只有修改频域后还要恢复声音时，才需要完整的 FFT → IFFT 重建。", "zh-Hant": traditional("分析、时域处理和频域处理是三条不同路径；只有修改频域后还要恢复声音时，才需要完整的 FFT → IFFT 重建。"), en: "Analysis, time-domain processing, and frequency-domain processing are distinct paths. A full FFT-to-IFFT reconstruction is only needed when modified frequency-domain data must return to audio.", ja: "解析、時間領域処理、周波数領域処理は別々の経路。周波数領域を変更して音声に戻す場合だけ、完全な FFT → IFFT 再構成が必要になる。", ko: "분석, 시간 영역 처리, 주파수 영역 처리는 서로 다른 경로임. 수정한 주파수 영역 데이터를 다시 오디오로 돌려야 할 때만 전체 FFT → IFFT 재구성이 필요함." },
  labAria: { zh: "当前主题实验室入口", "zh-Hant": traditional("当前主题实验室入口"), en: "Current topic lab entry", ja: "現在のテーマのラボ入口", ko: "현재 주제 실험실 입구" },
  labTitle: { zh: "进入基础信号处理实验室", "zh-Hant": traditional("进入基础信号处理实验室"), en: "Open the core signal processing lab", ja: "基礎信号処理ラボを開く", ko: "기초 신호 처리 실험실 열기" },
  concepts: { zh: "核心知识点", "zh-Hant": traditional("核心知识点"), en: "Core concepts", ja: "核心概念", ko: "핵심 개념" },
  conceptsLead: { zh: "这些判断决定算法效果、延迟和计算量。", "zh-Hant": traditional("这些判断决定算法效果、延迟和计算量。"), en: "These decisions determine algorithm behavior, latency, and compute cost.", ja: "これらの判断がアルゴリズムの挙動、遅延、計算量を決める。", ko: "이러한 판단이 알고리즘 동작, 지연 시간 및 연산량을 결정함." },
  terms: { zh: "基础术语", "zh-Hant": traditional("基础术语"), en: "Core terms", ja: "基本用語", ko: "기본 용어" },
  termsLead: { zh: "把观察方式、处理方法和控制参数分清。", "zh-Hant": traditional("把观察方式、处理方法和控制参数分清。"), en: "Separate observation domains, processing methods, and control parameters.", ja: "観測領域、処理方法、制御パラメータを区別する。", ko: "관찰 영역, 처리 방법 및 제어 파라미터를 구분함." },
  fft: {
    zh: "FFT（Fast Fourier Transform，快速傅里叶变换）是快速计算 DFT 的算法，把一帧时间域 PCM 转成复数频谱，包含幅度和相位信息；取模后可显示幅度谱。STFT（Short-Time Fourier Transform，短时傅里叶变换）把连续音频切成加窗短帧，通常逐帧用 FFT 计算，再按时间排列频谱。", "zh-Hant": traditional("FFT（Fast Fourier Transform，快速傅里叶变换）是快速计算 DFT 的算法，把一帧时间域 PCM 转成复数频谱，包含幅度和相位信息；取模后可显示幅度谱。STFT（Short-Time Fourier Transform，短时傅里叶变换）把连续音频切成加窗短帧，通常逐帧用 FFT 计算，再按时间排列频谱。"),
    en: "FFT (Fast Fourier Transform) is a fast algorithm for computing the DFT. It converts a PCM frame into a complex spectrum carrying magnitude and phase; taking magnitudes produces a magnitude spectrum. STFT (Short-Time Fourier Transform) analyzes successive windowed frames, typically using FFTs, and arranges their spectra over time.",
    ja: "FFT（Fast Fourier Transform、 高速フーリエ変換）は DFT を高速に計算するアルゴリズムで、時間領域の PCM 1 フレームを振幅と位相を含む複素スペクトルへ変換する。絶対値を取ると振幅スペクトルを表示できる。STFT（Short-Time Fourier Transform、短時間フーリエ変換）は連続音声を窓掛けした短いフレームに分け、通常は各フレームを FFT で計算し、スペクトルを時間順に並べる。",
    ko: "FFT(Fast Fourier Transform, 고속 푸리에 변환)는 DFT를 빠르게 계산하는 알고리즘으로, 시간 영역 PCM 한 프레임을 진폭과 위상을 포함한 복소 스펙트럼으로 변환함. 절댓값을 취하면 진폭 스펙트럼을 표시할 수 있음. STFT(Short-Time Fourier Transform, 단시간 푸리에 변환)는 연속 오디오를 윈도잉한 짧은 프레임으로 나누고 보통 각 프레임을 FFT로 계산한 뒤 시간 순서로 스펙트럼을 배열함."
  },
  boundary: { zh: "工程边界", "zh-Hant": traditional("工程边界"), en: "Engineering boundary", ja: "エンジニアリング上の境界", ko: "엔지니어링 경계" }
} satisfies Record<string, Localized>;

export function CoreSignalProcessingPage({ relatedTopics, language, topic, onBack, onOpenLab, onOpenNext }: CoreSignalProcessingPageProps) {
  const detail = topic.detail;

  return (
    <main className="sound-topic-page core-signal-topic-page" aria-labelledby="core-signal-topic-title">
      <header className="sound-topic-hero">
        <button className="sound-topic-back" type="button" onClick={onBack}>
          <ArrowLeft size={17} aria-hidden="true" />
          {copy.back[language]}
        </button>
        <div className="sound-topic-kicker">
          <BookOpen size={16} aria-hidden="true" />
          {copy.kicker[language]}
        </div>
        <h1 id="core-signal-topic-title">{topic.title[language]}</h1>
        <p className="sound-topic-lede">{topic.summary[language]}</p>
        <div className="sound-topic-meta">
          <span>{copy.signalAnalysis[language]}</span>
          <span>{copy.frequencyShaping[language]}</span>
          <span>{copy.levelControl[language]}</span>
        </div>
      </header>

      <TopicReadingLayout language={language}>
        <section className="sound-topic-section sound-topic-intro">
          <div>
            <h2>{copy.intro[language]}</h2>
            <p>{detail.explanation[language]}</p>
          </div>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading">
            <div>
              <h2>{copy.jobs[language]}</h2>
              <p>{copy.jobsLead[language]}</p>
            </div>
          </div>
          <ol className="core-topic-jobs">
            {processingJobs.map((job) => (
              <li key={job.number}>
                <span>{job.number}</span>
                <h3>{job.title[language]}</h3>
                <dl>
                  <div><dt>{copy.input[language]}</dt><dd>{job.input[language]}</dd></div>
                  <div><dt>{copy.method[language]}</dt><dd>{job.method[language]}</dd></div>
                  <div><dt>{copy.result[language]}</dt><dd>{job.output[language]}</dd></div>
                </dl>
              </li>
            ))}
          </ol>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading">
            <div>
              <h2>{copy.paths[language]}</h2>
              <p>{copy.pathsLead[language]}</p>
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

        <section className="sound-topic-section core-topic-lab-entry" aria-label={copy.labAria[language]}>
          <div className="sound-topic-cta">
            <CircuitBoard size={22} aria-hidden="true" />
            <h2>{copy.labTitle[language]}</h2>
            <p>{detail.lab?.description[language]}</p>
            <button className="diagram-open-button" type="button" onClick={onOpenLab}>{detail.lab?.buttonLabel[language]}</button>
          </div>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading">
            <div>
              <h2>{copy.concepts[language]}</h2>
              <p>{copy.conceptsLead[language]}</p>
            </div>
          </div>
          <div className="sound-topic-glossary core-topic-key-points">
            {detail.keyConcepts.map((concept) => <article key={concept.en}><p>{concept[language]}</p></article>)}
          </div>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading">
            <div>
              <h2>{copy.terms[language]}</h2>
              <p>{copy.termsLead[language]}</p>
            </div>
          </div>
          <div className="sound-topic-glossary">
            <article>
              <h3>FFT / STFT</h3>
              <p>
                {copy.fft[language]}
              </p>
            </article>
            {detail.termExplanations?.map((term) => (
              <article key={term.name.en}><h3>{term.name[language]}</h3><p>{term.explanation[language]}</p></article>
            ))}
          </div>
        </section>

        <section className="sound-topic-section">
          <div>
            <h2>{copy.boundary[language]}</h2>
            <p>{detail.misconception[language]}</p>
          </div>
        </section>
      </TopicReadingLayout>

      {relatedTopics}
      <TopicPager language={language} onBack={onBack} onNext={onOpenNext} />
    </main>
  );
}
