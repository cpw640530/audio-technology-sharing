import { traditional } from "../content/traditional";
import { useLabState } from "../hooks/useLabState";
import { useMemo } from "react";
import { ArrowLeft, RotateCcw } from "lucide-react";
import type { Language } from "../content/knowledge";
import { combinedResponse, filterSignal, filterTones, type FilterType } from "./filterModel";
import { compressedOutputDb, dynamicsFrame } from "./dynamicsModel";
import { StftWorkbench } from "./StftWorkbench";

type CoreSignalProcessingLabProps = {
  language: Language;
  onBack: () => void;
  onBackToDetails?: () => void;
};

type SignalMode = "stft" | "filter" | "dynamics";
type Localized = Record<"zh" | "en" | "ja" | "ko" | "zh-Hant", string>;
type FlowStep = {
  label: Localized;
  detail: Localized;
};
type ProcessingStage = {
  label: Localized;
  detail: Localized;
  role?: SignalMode;
};
type ProcessingRole = {
  title: Localized;
  stage: Localized;
  summary: Localized;
};

const modeLabels: Record<SignalMode, Localized> = {
  stft: { zh: "FFT / STFT", "zh-Hant": traditional("FFT / STFT"), en: "FFT / STFT", ja: "FFT / STFT", ko: "FFT / STFT" },
  filter: { zh: "滤波器 / EQ", "zh-Hant": traditional("滤波器 / EQ"), en: "Filters / EQ", ja: "フィルター / EQ", ko: "필터 / EQ" },
  dynamics: { zh: "动态处理", "zh-Hant": traditional("动态处理"), en: "Dynamics", ja: "ダイナミクス", ko: "다이내믹 처리" }
};

const filterLabels: Record<FilterType, Localized> = {
  lowpass: { zh: "低通", "zh-Hant": traditional("低通"), en: "Low-pass", ja: "ローパス", ko: "저역통과" },
  highpass: { zh: "高通", "zh-Hant": traditional("高通"), en: "High-pass", ja: "ハイパス", ko: "고역통과" },
  bandpass: { zh: "带通", "zh-Hant": traditional("带通"), en: "Band-pass", ja: "バンドパス", ko: "대역통과" },
  notch: { zh: "陷波", "zh-Hant": traditional("陷波"), en: "Notch", ja: "ノッチ", ko: "노치" }
};

const flowSteps: Record<SignalMode, FlowStep[]> = {
  stft: [
    {
      label: { zh: "输入 PCM", "zh-Hant": traditional("输入 PCM"), en: "Input PCM", ja: "入力 PCM", ko: "입력 PCM" },
      detail: { zh: "按时间排列的离散样本", "zh-Hant": traditional("按时间排列的离散样本"), en: "Discrete samples over time", ja: "時間順に並んだ離散サンプル", ko: "시간 순으로 나열된 이산 샘플" }
    },
    {
      label: { zh: "分帧/加窗", "zh-Hant": traditional("分帧/加窗"), en: "Frame/window", ja: "フレーム化/窓掛け", ko: "프레임/윈도잉" },
      detail: { zh: "窗口长度和 hop 决定取多少样本", "zh-Hant": traditional("窗口长度和 hop 决定取多少样本"), en: "Window and hop decide sample grouping", ja: "窓長と hop が取り込むサンプル数を決める", ko: "윈도 길이와 hop이 묶을 샘플 수를 결정함" }
    },
    {
      label: { zh: "FFT", "zh-Hant": traditional("FFT"), en: "FFT", ja: "FFT", ko: "FFT" },
      detail: { zh: "每帧从时间域转到频率域", "zh-Hant": traditional("每帧从时间域转到频率域"), en: "Each frame moves from time to frequency", ja: "各フレームを時間領域から周波数領域へ変換する", ko: "각 프레임을 시간 영역에서 주파수 영역으로 변환함" }
    },
    {
      label: { zh: "频谱/特征", "zh-Hant": traditional("频谱/特征"), en: "Spectrum/features", ja: "スペクトル/特徴量", ko: "스펙트럼/특징" },
      detail: { zh: "得到频率格、能量和特征", "zh-Hant": traditional("得到频率格、能量和特征"), en: "Frequency bins, energy, and features", ja: "周波数ビン、エネルギー、特徴量を得る", ko: "주파수 빈, 에너지 및 특징을 얻음" }
    }
  ],
  filter: [
    {
      label: { zh: "输入频谱", "zh-Hant": traditional("输入频谱"), en: "Input spectrum", ja: "入力スペクトル", ko: "입력 스펙트럼" },
      detail: { zh: "原始各频段能量", "zh-Hant": traditional("原始各频段能量"), en: "Original band energy", ja: "元の各帯域のエネルギー", ko: "원래 각 대역의 에너지" }
    },
    {
      label: { zh: "选择滤波器", "zh-Hant": traditional("选择滤波器"), en: "Select filter", ja: "フィルターを選択", ko: "필터 선택" },
      detail: { zh: "低通、高通、带通或陷波", "zh-Hant": traditional("低通、高通、带通或陷波"), en: "Low-pass, high-pass, band-pass, or notch", ja: "ローパス、ハイパス、バンドパス、ノッチ", ko: "저역통과, 고역통과, 대역통과 또는 노치" }
    },
    {
      label: { zh: "频率响应", "zh-Hant": traditional("频率响应"), en: "Response", ja: "周波数応答", ko: "주파수 응답" },
      detail: { zh: "cutoff、Q、gain 决定曲线", "zh-Hant": traditional("cutoff、Q、gain 决定曲线"), en: "Cutoff, Q, and gain shape the curve", ja: "cutoff、Q、gain が曲線を決める", ko: "cutoff, Q 및 gain이 곡선을 결정함" }
    },
    {
      label: { zh: "输出频谱", "zh-Hant": traditional("输出频谱"), en: "Output spectrum", ja: "出力スペクトル", ko: "출력 스펙트럼" },
      detail: { zh: "频段能量被保留或削弱", "zh-Hant": traditional("频段能量被保留或削弱"), en: "Band energy is kept or reduced", ja: "帯域エネルギーを保持または減衰する", ko: "대역 에너지를 유지하거나 줄임" }
    }
  ],
  dynamics: [
    {
      label: { zh: "输入数字电平", "zh-Hant": traditional("输入数字电平"), en: "Digital input level", ja: "デジタル入力レベル", ko: "디지털 입력 레벨" },
      detail: { zh: "PCM 样本包络换算成 dBFS", "zh-Hant": traditional("PCM 样本包络换算成 dBFS"), en: "PCM envelope mapped to dBFS", ja: "PCM サンプルの包絡を dBFS に換算する", ko: "PCM 샘플 엔벨로프를 dBFS로 변환함" }
    },
    {
      label: { zh: "电平检测", "zh-Hant": traditional("电平检测"), en: "Level detector", ja: "レベル検出", ko: "레벨 검출" },
      detail: { zh: "和 threshold 比较", "zh-Hant": traditional("和 threshold 比较"), en: "Compare with threshold", ja: "threshold と比較する", ko: "threshold와 비교함" }
    },
    {
      label: { zh: "增益计算", "zh-Hant": traditional("增益计算"), en: "Gain computer", ja: "ゲイン計算", ko: "게인 계산" },
      detail: { zh: "超过阈值后按 ratio 降增益", "zh-Hant": traditional("超过阈值后按 ratio 降增益"), en: "Reduce gain above threshold by ratio", ja: "しきい値超過後に ratio でゲインを下げる", ko: "threshold 초과분의 게인을 ratio에 따라 줄임" }
    },
    {
      label: { zh: "输出电平", "zh-Hant": traditional("输出电平"), en: "Output level", ja: "出力レベル", ko: "출력 레벨" },
      detail: { zh: "峰值和动态范围变小", "zh-Hant": traditional("峰值和动态范围变小"), en: "Peaks and dynamic range shrink", ja: "ピークとダイナミックレンジが小さくなる", ko: "피크와 다이내믹 레인지가 줄어듦" }
    }
  ]
};

const processingStages: ProcessingStage[] = [
  {
    label: { zh: "输入源", "zh-Hant": traditional("输入源"), en: "Source", ja: "入力ソース", ko: "입력 소스" },
    detail: { zh: "麦克风采集或文件/网络解码", "zh-Hant": traditional("麦克风采集或文件/网络解码"), en: "Mic capture or file/network decode", ja: "マイク収音またはファイル/ネットワークのデコード", ko: "마이크 수집 또는 파일/네트워크 디코드" }
  },
  {
    label: { zh: "PCM 音频", "zh-Hant": traditional("PCM 音频"), en: "PCM audio", ja: "PCM オーディオ", ko: "PCM 오디오" },
    detail: { zh: "已采样、量化的时域数据", "zh-Hant": traditional("已采样、量化的时域数据"), en: "Sampled time-domain data", ja: "サンプリングと量子化を行った時間領域データ", ko: "샘플링 및 양자화된 시간 영역 데이터" }
  },
  {
    label: { zh: "FFT / STFT", "zh-Hant": traditional("FFT / STFT"), en: "FFT / STFT", ja: "FFT / STFT", ko: "FFT / STFT" },
    detail: { zh: "分析频谱、做特征或频域处理", "zh-Hant": traditional("分析频谱、做特征或频域处理"), en: "Spectrum analysis, features, or frequency-domain processing", ja: "スペクトル解析、特徴量抽出、周波数領域処理", ko: "스펙트럼 분석, 특징 추출 또는 주파수 영역 처리" },
    role: "stft"
  },
  {
    label: { zh: "EQ / 滤波", "zh-Hant": traditional("EQ / 滤波"), en: "EQ / filter", ja: "EQ / フィルター", ko: "EQ / 필터" },
    detail: { zh: "改变不同频段能量", "zh-Hant": traditional("改变不同频段能量"), en: "Reshape energy by frequency band", ja: "周波数帯域ごとのエネルギーを変える", ko: "주파수 대역별 에너지를 바꿈" },
    role: "filter"
  },
  {
    label: { zh: "动态处理", "zh-Hant": traditional("动态处理"), en: "Dynamics", ja: "ダイナミクス", ko: "다이내믹 처리" },
    detail: { zh: "根据电平包络改变增益", "zh-Hant": traditional("根据电平包络改变增益"), en: "Change gain from the level envelope", ja: "レベル包絡に応じてゲインを変える", ko: "레벨 엔벨로프에 따라 게인을 바꿈" },
    role: "dynamics"
  },
  {
    label: { zh: "输出去向", "zh-Hant": traditional("输出去向"), en: "Output", ja: "出力先", ko: "출력 대상" },
    detail: { zh: "编码、混音、DAC 或播放", "zh-Hant": traditional("编码、混音、DAC 或播放"), en: "Encode, mix, DAC, or playback", ja: "エンコード、ミックス、DAC、または再生", ko: "인코딩, 믹싱, DAC 또는 재생" }
  }
];

const processingRoles: Record<SignalMode, ProcessingRole> = {
  stft: {
    title: { zh: "FFT / STFT：主要是分析和变换域入口", "zh-Hant": traditional("FFT / STFT：主要是分析和变换域入口"), en: "FFT / STFT: analysis and transform-domain entry", ja: "FFT / STFT：解析と変換領域への入口", ko: "FFT / STFT: 분석 및 변환 영역 진입점" },
    stage: {
      zh: "常放在 PCM 之后：实时语音里用于语音增强、降噪、回声消除特征；音乐/工具里用于频谱显示、频域滤波或特征提取。", "zh-Hant": traditional("常放在 PCM 之后：实时语音里用于语音增强、降噪、回声消除特征；音乐/工具里用于频谱显示、频域滤波或特征提取。"),
      en: "Usually after PCM exists: in real-time voice it feeds enhancement, denoise, and AEC features; in tools it powers spectrum displays, frequency-domain filtering, or feature extraction.",
      ja: "通常は PCM の後段に置く。リアルタイム音声では音声強調、ノイズ抑制、AEC の特徴量に使い、音楽やツールではスペクトル表示、周波数領域フィルター、特徴量抽出を支える。",
      ko: "보통 PCM 뒤에 배치함. 실시간 음성에서는 음성 향상, 노이즈 억제 및 AEC 특징에 사용하고, 음악이나 도구에서는 스펙트럼 표시, 주파수 영역 필터링 또는 특징 추출에 사용함."
    },
    summary: {
      zh: "FFT 快速计算一帧的离散傅里叶变换，输出包含幅度和相位的复数频谱；STFT 对连续分帧加窗后反复做变换，再取模平方得到时频功率图。分析本身不改善声音，修改频谱并重建才会改变声音。", "zh-Hant": traditional("FFT 快速计算一帧的离散傅里叶变换，输出包含幅度和相位的复数频谱；STFT 对连续分帧加窗后反复做变换，再取模平方得到时频功率图。分析本身不改善声音，修改频谱并重建才会改变声音。"),
      en: "FFT efficiently computes a frame's DFT, yielding complex coefficients with magnitude and phase. STFT transforms successive windowed frames; squared magnitudes form a time-frequency power map. Analysis alone does not improve sound; modifying and reconstructing it does.",
      ja: "FFT は 1 フレームの離散フーリエ変換を効率よく計算し、振幅と位相を持つ複素スペクトルを出力する。STFT は連続する窓掛けフレームを変換し、絶対値の二乗から時周波数パワーマップを作る。解析だけでは音は改善せず、スペクトルを変更して再構成したときに音が変わる。",
      ko: "FFT는 한 프레임의 이산 푸리에 변환을 효율적으로 계산해 진폭과 위상을 포함한 복소 스펙트럼을 출력함. STFT는 연속된 윈도 프레임을 변환하고 절댓값 제곱으로 시간-주파수 파워 맵을 만듦. 분석만으로는 소리가 개선되지 않으며 스펙트럼을 수정하고 재구성해야 소리가 변함."
    }
  },
  filter: {
    title: { zh: "EQ / 滤波：主要是频段能量塑形", "zh-Hant": traditional("EQ / 滤波：主要是频段能量塑形"), en: "EQ / filtering: frequency-band shaping", ja: "EQ / フィルタリング：周波数帯域のエネルギー整形", ko: "EQ / 필터링: 주파수 대역 에너지 형성" },
    stage: {
      zh: "通常放在 PCM 处理链中间：可以在录音后修正人声和设备频响，也可以在播放前做音色、响度或扬声器校正。", "zh-Hant": traditional("通常放在 PCM 处理链中间：可以在录音后修正人声和设备频响，也可以在播放前做音色、响度或扬声器校正。"),
      en: "Usually in the middle of a PCM chain: after capture for voice/device correction, or before playback for tone, loudness, or speaker correction.",
      ja: "通常は PCM 処理チェーンの中間に置く。収音後の音声や機器の周波数応答補正、または再生前の音色、ラウドネス、スピーカー補正に使う。",
      ko: "보통 PCM 처리 체인의 중간에 배치함. 수집 후 음성이나 장치 응답을 보정하거나 재생 전에 음색, 라우드니스 또는 스피커를 보정하는 데 사용함."
    },
    summary: {
      zh: "滤波器按频率保留或削弱信号；参数 EQ 用中心频率、增益和 Q 控制某一段频率。它改变的是频段能量，也可能带来相位、延迟或振铃等副作用。", "zh-Hant": traditional("滤波器按频率保留或削弱信号；参数 EQ 用中心频率、增益和 Q 控制某一段频率。它改变的是频段能量，也可能带来相位、延迟或振铃等副作用。"),
      en: "Filters keep or attenuate signal by frequency; parametric EQ uses center frequency, gain, and Q to control a band. It reshapes frequency energy and can also introduce phase shift, delay, or ringing.",
      ja: "フィルターは周波数ごとに信号を通過または減衰させる。パラメトリック EQ は中心周波数、ゲイン、Q で帯域を制御する。周波数エネルギーを整形する一方、位相変化、遅延、リンギングを生むこともある。",
      ko: "필터는 주파수별로 신호를 통과시키거나 감쇠함. 파라메트릭 EQ는 중심 주파수, 게인 및 Q로 대역을 제어함. 주파수 에너지를 형성하지만 위상 변화, 지연 또는 링잉이 생길 수도 있음."
    }
  },
  dynamics: {
    title: { zh: "动态处理：主要是电平和峰值控制", "zh-Hant": traditional("动态处理：主要是电平和峰值控制"), en: "Dynamics: level and peak control", ja: "ダイナミクス：レベルとピークの制御", ko: "다이내믹 처리: 레벨과 피크 제어" },
    stage: {
      zh: "通常放在降噪/EQ 之后、编码或 DAC 之前；语音链路里常见 AGC/压缩，播放链路里常见 DRC、limiter 和扬声器保护。", "zh-Hant": traditional("通常放在降噪/EQ 之后、编码或 DAC 之前；语音链路里常见 AGC/压缩，播放链路里常见 DRC、limiter 和扬声器保护。"),
      en: "Usually after denoise/EQ and before encoding or DAC; voice chains often use AGC/compression, while playback chains use DRC, limiting, and speaker protection.",
      ja: "通常はノイズ抑制/EQ の後、エンコードまたは DAC の前に置く。音声チェーンでは AGC/コンプレッション、再生チェーンでは DRC、リミッター、スピーカー保護がよく使われる。",
      ko: "보통 노이즈 억제/EQ 뒤, 인코딩 또는 DAC 앞에 배치함. 음성 체인에서는 AGC/컴프레션을, 재생 체인에서는 DRC, 리미팅 및 스피커 보호를 자주 사용함."
    },
    summary: {
      zh: "动态处理先检测电平包络，再按 threshold、ratio、attack、release 改变增益。它不是 MP3/AAC 这类编码压缩，而是把忽大忽小、瞬态峰值或过载风险控制住。", "zh-Hant": traditional("动态处理先检测电平包络，再按 threshold、ratio、attack、release 改变增益。它不是 MP3/AAC 这类编码压缩，而是把忽大忽小、瞬态峰值或过载风险控制住。"),
      en: "Dynamics first detects the level envelope, then changes gain using threshold, ratio, attack, and release. It is not MP3/AAC codec compression; it controls level swings, transient peaks, or overload risk.",
      ja: "ダイナミクス処理はまずレベル包絡を検出し、threshold、ratio、attack、release に応じてゲインを変える。MP3/AAC のような符号化圧縮ではなく、レベル変動、トランジェントピーク、過負荷のリスクを制御する。",
      ko: "다이내믹 처리는 먼저 레벨 엔벨로프를 검출한 뒤 threshold, ratio, attack, release에 따라 게인을 바꿈. MP3/AAC 같은 코덱 압축이 아니라 레벨 변동, 트랜지언트 피크 또는 과부하 위험을 제어함."
    }
  }
};

const copy = {
  processingStage: { zh: "处理阶段", "zh-Hant": traditional("处理阶段"), en: "Processing stage", ja: "処理段階", ko: "처리 단계" },
  stageTitle: { zh: "FFT/STFT、EQ 和动态处理通常在音频链路哪里做", "zh-Hant": traditional("FFT/STFT、EQ 和动态处理通常在音频链路哪里做"), en: "Where FFT/STFT, EQ, and dynamics usually sit", ja: "FFT/STFT、EQ、ダイナミクスは音声チェーンのどこに置くか", ko: "FFT/STFT, EQ 및 다이내믹 처리는 오디오 체인의 어디에 배치하는가" },
  stageAria: { zh: "音频处理阶段流程图", "zh-Hant": traditional("音频处理阶段流程图"), en: "Audio processing stage flow", ja: "オーディオ処理段階のフロー", ko: "오디오 처리 단계 흐름" },
  stftPlacement: { zh: "上方是功能位置示意，不是必经的串行链路。时域 EQ 和压缩器可直接处理 PCM；若在 STFT 域修改频谱，通常需逆变换与重叠相加重建，再交给时域模块。", "zh-Hant": traditional("上方是功能位置示意，不是必经的串行链路。时域 EQ 和压缩器可直接处理 PCM；若在 STFT 域修改频谱，通常需逆变换与重叠相加重建，再交给时域模块。"), en: "The stages show functional placement, not a mandatory serial chain. Time-domain EQ and compressors can process PCM directly. Modified STFT spectra normally need an inverse transform and overlap-add reconstruction before time-domain modules.", ja: "上図は機能上の配置であり、必須の直列チェーンではない。時間領域の EQ やコンプレッサーは PCM を直接処理できる。STFT 領域で変更したスペクトルは通常、逆変換とオーバーラップ加算で再構成してから時間領域モジュールへ渡す。", ko: "위 단계는 기능적 배치를 보여 주며 반드시 직렬로 거치는 체인은 아님. 시간 영역 EQ와 컴프레서는 PCM을 직접 처리할 수 있음. STFT 영역에서 수정한 스펙트럼은 보통 역변환과 오버랩-애드로 재구성한 뒤 시간 영역 모듈로 전달함." },
  filterDiagram: { zh: "滤波器流程对应图", "zh-Hant": traditional("滤波器流程对应图"), en: "Filter flow-linked diagram", ja: "フィルター処理フロー図", ko: "필터 처리 흐름도" },
  originalWaveform: { zh: "原始波形", "zh-Hant": traditional("原始波形"), en: "Original waveform", ja: "元の波形", ko: "원본 파형" },
  filteredWaveform: { zh: "滤波后波形", "zh-Hant": traditional("滤波后波形"), en: "Filtered waveform", ja: "フィルター後の波形", ko: "필터 후 파형" },
  inputOutput: { zh: "输入与输出", "zh-Hant": traditional("输入与输出"), en: "Input and output", ja: "入力と出力", ko: "입력과 출력" },
  input: { zh: "输入", "zh-Hant": traditional("输入"), en: "Input", ja: "入力", ko: "입력" },
  output: { zh: "输出", "zh-Hant": traditional("输出"), en: "Output", ja: "出力", ko: "출력" },
  change: { zh: "变化", "zh-Hant": traditional("变化"), en: "Change", ja: "変化", ko: "변화" },
  filterSpectrum: { zh: "柱图为这三个分量的峰值幅度谱，单位 dB re 1，统一范围 −60 至 +40；频率按三档排列，非等间距频率轴。响应图横轴为对数 Hz，纵轴为增益 dB（同范围），0 dB 表示不增不减。", "zh-Hant": traditional("柱图为这三个分量的峰值幅度谱，单位 dB re 1，统一范围 −60 至 +40；频率按三档排列，非等间距频率轴。响应图横轴为对数 Hz，纵轴为增益 dB（同范围），0 dB 表示不增不减。"), en: "Bars show peak-amplitude spectra of these three tones in dB re 1, sharing −60 to +40. Frequency positions are categorical, not equally spaced Hz. Response uses logarithmic Hz and gain dB (same range); 0 dB is unity gain.", ja: "棒グラフは 3 音のピーク振幅スペクトルを dB re 1 で示し、−60～+40 の範囲を共有する。周波数位置はカテゴリ配置で、Hz に対して等間隔ではない。応答図は対数 Hz 軸とゲイン dB 軸（同じ範囲）を使い、0 dB はユニティゲインを示す。", ko: "막대 그래프는 세 톤의 피크 진폭 스펙트럼을 dB re 1로 표시하며 −60~+40 범위를 공유함. 주파수 위치는 범주형 배치라 Hz 기준 등간격이 아님. 응답 그래프는 로그 Hz 축과 게인 dB 축(같은 범위)을 사용하며 0 dB는 유니티 게인임." },
  filterModel: { zh: "二阶滤波器后串联同中心频率/Q 的峰值 EQ。Q=0 按 0.1 计算，避免无定义；Q 不改变阶数。这里是解析稳态结果，不含启动瞬态、削波或新增谐波。方波纹理不应凭空出现。", "zh-Hant": traditional("二阶滤波器后串联同中心频率/Q 的峰值 EQ。Q=0 按 0.1 计算，避免无定义；Q 不改变阶数。这里是解析稳态结果，不含启动瞬态、削波或新增谐波。方波纹理不应凭空出现。"), en: "A second-order filter is followed by peaking EQ at the same center/Q. Q=0 uses 0.1 to avoid an undefined filter; Q does not change order. This analytic steady-state result excludes startup transients, clipping and new harmonics.", ja: "2 次フィルターの後に、同じ中心周波数/Q のピーキング EQ を直列接続している。Q=0 は未定義を避けるため 0.1 として計算し、Q は次数を変えない。これは解析的な定常状態の結果であり、起動過渡、クリッピング、新しい高調波は含まない。方形波のテクスチャが突然現れることはない。", ko: "2차 필터 뒤에 같은 중심 주파수/Q의 피킹 EQ를 직렬로 연결함. Q=0은 정의되지 않는 상황을 피하려고 0.1로 계산하며 Q가 차수를 바꾸지는 않음. 이 결과는 해석적 정상 상태이며 시작 과도, 클리핑 또는 새 고조파를 포함하지 않음. 사각파 질감이 임의로 생기지 않아야 함." },
  peakWarning: { zh: "输出峰值超过 1：实际定点输出前需预留余量或降低增益，图中没有自动限幅。", "zh-Hant": traditional("输出峰值超过 1：实际定点输出前需预留余量或降低增益，图中没有自动限幅。"), en: "Output exceeds 1: leave headroom or reduce gain before fixed-point output. No automatic limiter is applied here.", ja: "出力ピークが 1 を超えている。固定小数点で出力する前にヘッドルームを確保するかゲインを下げる必要があり、ここでは自動リミッターを適用していない。", ko: "출력 피크가 1을 초과함. 고정소수점으로 출력하기 전에 헤드룸을 확보하거나 게인을 낮춰야 하며 여기서는 자동 리미터를 적용하지 않음." },
  dynamicsDiagram: { zh: "动态处理流程对应图", "zh-Hant": traditional("动态处理流程对应图"), en: "Dynamics flow-linked diagram", ja: "ダイナミクス処理フロー図", ko: "다이내믹 처리 흐름도" },
  dynamicsResult: { zh: "输入、检测与输出图：横轴 0–1 s，纵轴统一 −48 至 0 dBFS，显示电平包络而非有正负的 PCM 波形。增益计算图：横轴为输入、纵轴为输出（均 −48 至 0 dBFS）；虚线表示未压缩输出=输入。", "zh-Hant": traditional("输入、检测与输出图：横轴 0–1 s，纵轴统一 −48 至 0 dBFS，显示电平包络而非有正负的 PCM 波形。增益计算图：横轴为输入、纵轴为输出（均 −48 至 0 dBFS）；虚线表示未压缩输出=输入。"), en: "Input, detector and output: 0–1 s horizontally, −48 to 0 dBFS vertically. These are level envelopes, not signed PCM waveforms. Transfer plot: input vs output (both −48 to 0 dBFS); dashed diagonal is unity output.", ja: "入力・検出・出力図は横軸 0–1 s、縦軸 −48～0 dBFS で、符号付き PCM 波形ではなくレベル包絡を示す。ゲイン計算図は入力を横軸、出力を縦軸（どちらも −48～0 dBFS）とし、破線は非圧縮時の出力=入力を示す。", ko: "입력·검출·출력 그래프는 가로축 0–1 s, 세로축 −48~0 dBFS이며 부호가 있는 PCM 파형이 아닌 레벨 엔벨로프를 표시함. 게인 계산 그래프는 입력을 가로축, 출력을 세로축(둘 다 −48~0 dBFS)으로 하며 점선은 비압축 출력=입력을 나타냄." },
  observationTime: { zh: "观察时刻", "zh-Hant": traditional("观察时刻"), en: "Observation time", ja: "観測時刻", ko: "관찰 시각" },
  gainOverTime: { zh: "增益变化随时间", "zh-Hant": traditional("增益变化随时间"), en: "Gain change over time", ja: "時間に対するゲイン変化", ko: "시간에 따른 게인 변화" },
  gainCurve: { zh: "增益曲线纵轴为 dB：0 表示不改变，负值表示衰减；横轴为时间。它不是输出电平，也不是频率响应。", "zh-Hant": traditional("增益曲线纵轴为 dB：0 表示不改变，负值表示衰减；横轴为时间。它不是输出电平，也不是频率响应。"), en: "Gain curve: vertical dB, with 0 meaning unchanged and negative values attenuation; horizontal time. It is neither output level nor frequency response.", ja: "ゲイン曲線の縦軸は dB で、0 は変化なし、負値は減衰を示す。横軸は時間であり、出力レベルでも周波数応答でもない。", ko: "게인 곡선의 세로축은 dB이며 0은 변화 없음, 음수는 감쇠를 의미함. 가로축은 시간이며 출력 레벨이나 주파수 응답이 아님." },
  aboveThreshold: { zh: "超过阈值：输出 = T + (输入 - T) / Ratio", "zh-Hant": traditional("超过阈值：输出 = T + (输入 - T) / Ratio"), en: "Above threshold: output = T + (input - T) / Ratio", ja: "しきい値超過時：出力 = T + (入力 - T) / Ratio", ko: "threshold 초과: 출력 = T + (입력 - T) / Ratio" },
  atOrBelowThreshold: { zh: "低于或等于阈值：输出 = 输入，增益为 0 dB。", "zh-Hant": traditional("低于或等于阈值：输出 = 输入，增益为 0 dB。"), en: "At or below threshold: output = input, gain = 0 dB.", ja: "しきい値以下：出力 = 入力、ゲイン = 0 dB。", ko: "threshold 이하: 출력 = 입력, 게인 = 0 dB." },
  thresholdChanges: { zh: "Threshold 改变超出量；ratio 改变超出阈值部分保留多少，二者共同决定增益衰减。", "zh-Hant": traditional("Threshold 改变超出量；ratio 改变超出阈值部分保留多少，二者共同决定增益衰减。"), en: "Threshold changes how far above the line the signal is; ratio decides how much of that excess remains.", ja: "Threshold は信号が線をどれだけ超えるかを変え、ratio はその超過分をどれだけ残すかを決める。両者でゲイン減衰が決まる。", ko: "Threshold는 신호가 선을 얼마나 넘는지 바꾸고 ratio는 그 초과분을 얼마나 남길지 결정함. 두 값이 게인 감쇠를 함께 결정함." },
  modelLimits: { zh: "模型边界：使用合成检测包络与硬拐点静态映射，没有 attack/release、软拐点、补偿增益或前瞻。真实压缩器的增益有时间响应，不能把这里的结果当作完整压缩器波形或砖墙限幅器。", "zh-Hant": traditional("模型边界：使用合成检测包络与硬拐点静态映射，没有 attack/release、软拐点、补偿增益或前瞻。真实压缩器的增益有时间响应，不能把这里的结果当作完整压缩器波形或砖墙限幅器。"), en: "Model limits: synthetic detector envelope and hard-knee static mapping; no attack/release, soft knee, makeup gain or lookahead. Real gain has a time response; this is not a complete compressor waveform or a brick-wall limiter.", ja: "モデルの範囲：合成した検出包絡とハードニーの静的マッピングを使い、attack/release、ソフトニー、メイクアップゲイン、先読みはない。実際のコンプレッサーのゲインには時間応答があり、ここを完全なコンプレッサー波形やブリックウォールリミッターとみなせない。", ko: "모델 범위: 합성 검출 엔벨로프와 하드 니 정적 매핑을 사용하며 attack/release, 소프트 니, 메이크업 게인 또는 룩어헤드는 없음. 실제 컴프레서 게인은 시간 응답을 가지므로 이 결과를 완전한 컴프레서 파형이나 브릭월 리미터로 볼 수 없음." },
  backKnowledge: { zh: "返回知识库", "zh-Hant": traditional("返回知识库"), en: "Back to knowledge base", ja: "ナレッジベースに戻る", ko: "지식 베이스로 돌아가기" },
  backDetails: { zh: "返回详细内容", "zh-Hant": traditional("返回详细内容"), en: "Back to detailed content", ja: "詳細コンテンツに戻る", ko: "상세 내용으로 돌아가기" },
  traditionalLab: { zh: "传统 DSP 实验", "zh-Hant": traditional("传统 DSP 实验"), en: "Traditional DSP lab", ja: "従来型 DSP 実験", ko: "전통 DSP 실험" },
  labTitle: { zh: "基础信号处理实验室", "zh-Hant": traditional("基础信号处理实验室"), en: "Core Signal Processing Lab", ja: "基礎信号処理ラボ", ko: "기초 신호 처리 실험실" },
  intro: { zh: "STFT 数值仿真：PCM 与频谱来自同一合成信号，采样率 16 kHz，采用 Hann 窗和单边功率谱密度。颜色不是声压级；补零仅加密频率网格，不增加真实分辨能力。此处以有限长度 DFT 计算，不代表实时 FFT 性能测试。", "zh-Hant": traditional("STFT 数值仿真：PCM 与频谱来自同一合成信号，采样率 16 kHz，采用 Hann 窗和单边功率谱密度。颜色不是声压级；补零仅加密频率网格，不增加真实分辨能力。此处以有限长度 DFT 计算，不代表实时 FFT 性能测试。"), en: "STFT simulation: PCM and spectra share one synthetic signal at 16 kHz, using a Hann window and one-sided power spectral density. Color is not SPL. Zero padding densifies the frequency grid without improving resolving power. A bounded DFT is used; this is not a real-time FFT benchmark.", ja: "STFT の数値シミュレーション。PCM とスペクトルは同じ合成信号を使い、サンプリングレートは 16 kHz、Hann 窓と片側パワースペクトル密度を用いる。色は音圧レベルではない。ゼロパディングは周波数グリッドを密にするだけで、実際の分解能は上げない。有限長 DFT を使っており、リアルタイム FFT の性能試験ではない。", ko: "STFT 수치 시뮬레이션. PCM과 스펙트럼은 같은 합성 신호를 사용하고 샘플링 레이트는 16 kHz이며 Hann 윈도와 단측 파워 스펙트럼 밀도를 사용함. 색상은 음압 레벨이 아님. 제로 패딩은 주파수 격자를 촘촘하게 할 뿐 실제 분해능을 높이지 않음. 유한 길이 DFT를 사용하므로 실시간 FFT 성능 시험이 아님." },
  explore: { zh: "把 STFT 分帧、滤波器/EQ 和动态处理放在一个实验台里，观察参数变化如何影响图形、分辨率、频率响应和动态范围。", "zh-Hant": traditional("把 STFT 分帧、滤波器/EQ 和动态处理放在一个实验台里，观察参数变化如何影响图形、分辨率、频率响应和动态范围。"), en: "Explore STFT framing, filters/EQ, and dynamics processing in one workbench, watching how parameters change diagrams, resolution, response, and dynamic range.", ja: "STFT のフレーム化、フィルター/EQ、ダイナミクス処理を 1 つのワークベンチで試し、パラメータが図、分解能、周波数応答、ダイナミックレンジに与える影響を観察する。", ko: "하나의 워크벤치에서 STFT 프레이밍, 필터/EQ 및 다이내믹 처리를 살펴보며 파라미터가 도형, 분해능, 응답 및 다이내믹 레인지에 미치는 영향을 관찰함." },
  workbench: { zh: "基础信号处理实验台", "zh-Hant": traditional("基础信号处理实验台"), en: "Core signal processing workbench", ja: "基礎信号処理ワークベンチ", ko: "기초 신호 처리 워크벤치" },
  views: { zh: "信号处理视图", "zh-Hant": traditional("信号处理视图"), en: "Signal processing views", ja: "信号処理ビュー", ko: "신호 처리 보기" },
  framing: { zh: "分帧和频谱分辨率", "zh-Hant": traditional("分帧和频谱分辨率"), en: "Framing and spectral resolution", ja: "フレーム化とスペクトル分解能", ko: "프레이밍 및 스펙트럼 분해능" },
  windowSize: { zh: "窗口长度", "zh-Hant": traditional("窗口长度"), en: "Window size", ja: "窓長", ko: "윈도 길이" },
  hopSize: { zh: "Hop size", "zh-Hant": traditional("Hop size"), en: "Hop size", ja: "Hop size", ko: "Hop size" },
  frequencyResponse: { zh: "频率响应", "zh-Hant": traditional("频率响应"), en: "Frequency response", ja: "周波数応答", ko: "주파수 응답" },
  filterTypes: { zh: "滤波器类型", "zh-Hant": traditional("滤波器类型"), en: "Filter type", ja: "フィルター種別", ko: "필터 유형" },
  cutoffFrequency: { zh: "截止频率", "zh-Hant": traditional("截止频率"), en: "Cutoff frequency", ja: "カットオフ周波数", ko: "차단 주파수" },
  eqGain: { zh: "EQ 增益", "zh-Hant": traditional("EQ 增益"), en: "EQ gain", ja: "EQ ゲイン", ko: "EQ 게인" },
  resetFilter: { zh: "重置滤波参数", "zh-Hant": traditional("重置滤波参数"), en: "Reset filter", ja: "フィルターをリセット", ko: "필터 초기화" },
  compressor: { zh: "压缩器 / 限幅器", "zh-Hant": traditional("压缩器 / 限幅器"), en: "Compressor / limiter", ja: "コンプレッサー / リミッター", ko: "컴프레서 / 리미터" },
  compressorLead: { zh: "超过阈值后按 ratio 收缩，峰值被压低", "zh-Hant": traditional("超过阈值后按 ratio 收缩，峰值被压低"), en: "Above threshold, ratio reduces peaks", ja: "しきい値を超えると ratio に応じてピークを縮小する", ko: "threshold를 넘으면 ratio에 따라 피크를 줄임" },
  threshold: { zh: "Threshold", "zh-Hant": traditional("Threshold"), en: "Threshold", ja: "Threshold", ko: "Threshold" },
  ratio: { zh: "Ratio", "zh-Hant": traditional("Ratio"), en: "Ratio", ja: "Ratio", ko: "Ratio" },
  attackRelease: { zh: "Attack / release 决定增益变化速度", "zh-Hant": traditional("Attack / release 决定增益变化速度"), en: "Attack / release set gain-change speed", ja: "Attack / release がゲイン変化の速度を決める", ko: "Attack / release가 게인 변화 속도를 결정함" },
  processingFlow: { zh: "处理流程与应用位置", "zh-Hant": traditional("处理流程与应用位置"), en: "Processing flow and placement", ja: "処理フローと配置", ko: "처리 흐름 및 배치" }
} satisfies Record<string, Localized>;

const sampleRate = 16000;
function formatDb(value: number) {
  return `${value > 0 ? "+" : ""}${value} dB`;
}

function formatDbValue(value: number) {
  const rounded = Math.round(value * 10) / 10;
  const text = Number.isInteger(rounded) ? rounded.toFixed(0) : rounded.toFixed(1);

  return `${rounded > 0 ? "+" : ""}${text} dB`;
}

function formatDbfs(value: number) {
  const rounded = Math.round(value * 10) / 10;
  const text = Number.isInteger(rounded) ? rounded.toFixed(0) : rounded.toFixed(1);

  return `${text} dBFS`;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}


function logFrequencyPosition(frequency: number, min = 80, max = 8000) {
  return (Math.log10(frequency) - Math.log10(min)) / (Math.log10(max) - Math.log10(min));
}

function getCombinedFilterGain(
  filterType: FilterType,
  frequency: number,
  cutoff: number,
  q: number,
  eqGain: number
) {
  return combinedResponse(filterType, frequency, cutoff, q, eqGain).magnitude;
}

function createFilterWavePath(
  filterType: FilterType,
  cutoff: number,
  q: number,
  eqGain: number,
  x: number,
  y: number,
  width: number,
  amplitude: number,
  filtered: boolean,
  scale: number
) {
  const points = Array.from({ length: 161 }, (_, index) => {
    const ratio = index / 160;
    const value = filterSignal(index / sampleRate, filterType, cutoff, q, eqGain, filtered);
    const pointX = x + ratio * width;
    const pointY = y - value / scale * amplitude;
    return `${index === 0 ? "M" : "L"} ${pointX.toFixed(1)} ${pointY.toFixed(1)}`;
  });

  return points.join(" ");
}

function createFilterResponsePath(
  filterType: FilterType,
  cutoff: number,
  q: number,
  eqGain: number,
  x = 70,
  y = 248,
  width = 620,
  height = 176
) {
  const frequencies = [...Array.from({ length: 401 }, (_, index) => 80 * 100 ** (index / 400)), cutoff].sort((a, b) => a - b);
  const points = frequencies.map((frequency, index) => {
    const ratio = logFrequencyPosition(frequency);
    const gain = getCombinedFilterGain(filterType, frequency, cutoff, q, eqGain);
    const gainDb = 20 * Math.log10(Math.max(0.001, gain));
    const normalizedGain = clamp((gainDb + 60) / 100, 0, 1);
    const pointX = x + ratio * width;
    const pointY = y - normalizedGain * height;

    return `${index === 0 ? "M" : "L"} ${pointX.toFixed(1)} ${pointY.toFixed(1)}`;
  });

  return points.join(" ");
}

function createDynamicsCurvePath(threshold: number, ratio: number, x = 92, y = 258, width = 598, height = 196) {
  const thresholdX = x + ((threshold + 48) / 48) * width;
  const thresholdY = y - ((threshold + 48) / 48) * height;
  const endY = thresholdY - ((x + width - thresholdX) / ratio) * (height / width);

  return `M ${x} ${y} L ${thresholdX.toFixed(1)} ${thresholdY.toFixed(1)} L ${x + width} ${Math.max(y - height, endY).toFixed(1)}`;
}

function dbToDisplayY(db: number, bottomY: number, height: number) {
  const normalized = (clamp(db, -48, 0) + 48) / 48;

  return bottomY - normalized * height;
}

function createInputEnvelopePath(x = 92, bottomY = 330, width = 598, height = 70) {
  const points = Array.from({ length: 101 }, (_, index) => {
    const ratio = index / 100;
    const pointX = x + ratio * width;
    const pointY = dbToDisplayY(dynamicsFrame(ratio * 1000, -18, 1).inputDb, bottomY, height);

    return `${index === 0 ? "M" : "L"} ${pointX.toFixed(1)} ${pointY.toFixed(1)}`;
  });

  return points.join(" ");
}

function createOutputEnvelopePath(threshold: number, ratio: number, x = 92, bottomY = 330, width = 598, height = 70) {
  const points = Array.from({ length: 101 }, (_, index) => {
    const ratioPosition = index / 100;
    const pointX = x + ratioPosition * width;
    const outputDb = dynamicsFrame(ratioPosition * 1000, threshold, ratio).outputDb;
    const pointY = dbToDisplayY(outputDb, bottomY, height);

    return `${index === 0 ? "M" : "L"} ${pointX.toFixed(1)} ${pointY.toFixed(1)}`;
  });

  return points.join(" ");
}

function flowAriaLabel(mode: SignalMode, language: Language) {
  const labels: Record<SignalMode, Localized> = {
    stft: { zh: "STFT 流程节点", "zh-Hant": traditional("STFT 流程节点"), en: "STFT flow steps", ja: "STFT のフローステップ", ko: "STFT 흐름 단계" },
    filter: { zh: "滤波器流程节点", "zh-Hant": traditional("滤波器流程节点"), en: "Filter flow steps", ja: "フィルターのフローステップ", ko: "필터 흐름 단계" },
    dynamics: { zh: "动态处理流程节点", "zh-Hant": traditional("动态处理流程节点"), en: "Dynamics flow steps", ja: "ダイナミクスのフローステップ", ko: "다이내믹 처리 흐름 단계" }
  };

  return labels[mode][language];
}

function FlowSteps({ language, mode }: { language: Language; mode: SignalMode }) {
  return (
    <ol aria-label={flowAriaLabel(mode, language)} className="core-flow-steps">
      {flowSteps[mode].map((step, index) => (
        <li className="core-flow-step" key={step.label.en}>
          <span>{index + 1}</span>
          <div>
            <strong>{step.label[language]}</strong>
            <p>{step.detail[language]}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function ProcessingStageOverview({ language, mode }: { language: Language; mode: SignalMode }) {
  const activeRole = processingRoles[mode];

  return (
    <section className="core-stage-overview" aria-labelledby="core-stage-overview-title">
      <div className="codec-mode-concepts-header">
        <span>{copy.processingStage[language]}</span>
        <strong id="core-stage-overview-title">
          {copy.stageTitle[language]}
        </strong>
      </div>
      <div className="core-stage-flow" role="list" aria-label={copy.stageAria[language]}>
        {processingStages.map((stage, index) => (
          <div
            className={stage.role === mode ? "core-stage-node active" : "core-stage-node"}
            key={stage.label.en}
            role="listitem"
          >
            <span>{index + 1}</span>
            <strong>{stage.label[language]}</strong>
            <p>{stage.detail[language]}</p>
          </div>
        ))}
      </div>
      <div className="core-stage-explain">
        <article>
          <h2>{activeRole.title[language]}</h2>
          <p>{activeRole.stage[language]}</p>
          <p>{activeRole.summary[language]}</p>
          {mode === "stft" && <p>{copy.stftPlacement[language]}</p>}
        </article>
      </div>
    </section>
  );
}

function FlowArrow({ x1, x2, y }: { x1: number; x2: number; y: number }) {
  return <path className="core-flow-arrow" d={`M ${x1} ${y} L ${x2} ${y}`} />;
}

function SliderControl({
  label,
  max,
  min,
  onChange,
  step = 1,
  value
}: {
  label: string;
  max: number;
  min: number;
  onChange: (value: number) => void;
  step?: number;
  value: number;
}) {
  return (
    <label className="sound-lab-control">
      <span>{label}</span>
      <input
        aria-label={label}
        max={max}
        min={min}
        step={step}
        type="range"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

function FilterChart({
  cutoff,
  eqGain,
  filterType,
  language,
  q
}: {
  cutoff: number;
  eqGain: number;
  filterType: FilterType;
  language: Language;
  q: number;
}) {
  const responsePath = createFilterResponsePath(filterType, cutoff, q, eqGain, 414, 282, 164, 110);
  const outputBars = filterTones.map(tone => {
    const response = combinedResponse(filterType, tone.frequency, cutoff, q, eqGain);
    return { ...tone, output: tone.amplitude * response.magnitude, gainDb: 20 * Math.log10(Math.max(1e-12, response.magnitude)) };
  });
  const scale = Math.max(1, ...Array.from({ length: 161 }, (_, i) => Math.abs(filterSignal(i / sampleRate, filterType, cutoff, q, eqGain, true))));
  const originalWavePath = createFilterWavePath(filterType, cutoff, q, eqGain, 48, 374, 300, 26, false, scale);
  const filteredWavePath = createFilterWavePath(filterType, cutoff, q, eqGain, 410, 374, 300, 26, true, scale);
  const cutoffX = 90 + logFrequencyPosition(cutoff) * 560;
  const visibleCutoffX = Math.max(414, Math.min(578, 414 + (cutoffX - 90) * (164 / 560)));
  const barHeight = (amplitude: number) => clamp((20 * Math.log10(Math.max(0.001, amplitude)) + 60) / 100, 0, 1) * 110;
  const steps = flowSteps.filter;
  const filterWaveNote = {
    zh: `同一输入：300、1600、5200 Hz 三音，16 kHz 采样。两幅波形均为 0–10 ms，共用纵轴 ±${scale.toFixed(2)}，不分别归一化；输出包含滤波器相移。`, "zh-Hant": traditional(`同一输入：300、1600、5200 Hz 三音，16 kHz 采样。两幅波形均为 0–10 ms，共用纵轴 ±${scale.toFixed(2)}，不分别归一化；输出包含滤波器相移。`),
    en: `One input: 300, 1600 and 5200 Hz tones sampled at 16 kHz. Both waveforms span 0–10 ms and share ±${scale.toFixed(2)} vertically, without separate normalization. Output includes filter phase shift.`,
    ja: `同じ入力として 300、1600、5200 Hz の 3 音を 16 kHz でサンプリングする。両方の波形は 0–10 ms で、縦軸 ±${scale.toFixed(2)} を共有し、個別には正規化しない。出力にはフィルターの位相シフトが含まれる。`,
    ko: `같은 입력으로 300, 1600, 5200 Hz 세 톤을 16 kHz로 샘플링함. 두 파형은 모두 0–10 ms 구간이며 세로축 ±${scale.toFixed(2)}를 공유하고 개별 정규화하지 않음. 출력에는 필터 위상 이동이 포함됨.`
  }[language];
  const toneCaption = {
    zh: "同一频率分量的输入与输出（线性峰值幅度）", "zh-Hant": traditional("同一频率分量的输入与输出（线性峰值幅度）"),
    en: "Input and output of each tone (linear peak amplitude)",
    ja: "各音の入力と出力（線形ピーク振幅）",
    ko: "각 톤의 입력과 출력(선형 피크 진폭)"
  }[language];

  return (
    <>
    <svg
      aria-label={copy.filterDiagram[language]}
      className="core-signal-chart filter-comparison-chart"
      role="img"
      viewBox="0 0 760 480"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect className="lab-diagram-bg" height="480" rx="16" width="760" />
      {steps.map((step, index) => {
        const x = 44 + index * 184;
        return (
          <g key={step.label.en}>
            <g className="core-flow-node">
              <rect x={x} y="34" width="148" height="72" rx="8" />
              <text className="core-flow-node-title" x={x + 74} y="70">{step.label[language]}</text>
            </g>
            {index < steps.length - 1 ? <FlowArrow x1={x + 148} x2={x + 174} y={70} /> : null}
          </g>
        );
      })}
      <line className="lab-axis" x1="54" x2="206" y1="282" y2="282" />
      {filterTones.map((tone, index) => (
        <g key={tone.frequency}>
          <rect className="core-spectrum-bar muted" data-testid="filter-input-bar" data-frequency={tone.frequency} height={barHeight(tone.amplitude)} width="14" x={76 + index * 44} y={282 - barHeight(tone.amplitude)} />
          <text className="interface-tdm-note" x={83 + index * 44} y="305" textAnchor="middle">{tone.frequency / 1000}</text>
        </g>
      ))}
      <text className="core-diagram-caption" x="130" y="332">{steps[0].label[language]} (kHz)</text>
      <rect className="core-filter-type-box" height="112" rx="12" width="138" x="240" y="174" />
      <text className="core-filter-type-label" x="309" y="224">{filterLabels[filterType][language]}</text>
      <text className="core-diagram-caption" x="309" y="332">{steps[1].label[language]}</text>
      <line className="lab-axis" x1="414" x2="578" y1="282" y2="282" />
      <line className="lab-axis faint" x1="414" x2="578" y1="216" y2="216" />
      <text className="interface-tdm-note" x="414" y="160">+40 / 0 / −60 dB</text>
      <path className="core-filter-fill" d={`${responsePath} L 578 282 L 414 282 Z`} />
      <path className="lab-wave-path filter-response-path" data-testid="filter-response-path" d={responsePath} />
      <line
        className="core-cutoff-marker"
        data-testid="filter-cutoff-marker"
        x1={visibleCutoffX}
        x2={visibleCutoffX}
        y1="170"
        y2="292"
      />
      <text className="interface-tdm-note" x="414" y="305">80</text>
      <text className="interface-tdm-note" x="578" y="305" textAnchor="end">8000 Hz</text>
      <text className="core-diagram-caption" x="496" y="332">{steps[2].label[language]}</text>
      <line className="lab-axis" x1="624" x2="716" y1="282" y2="282" />
      {outputBars.map((band, index) => (
        <g key={`output-${index}`}><rect
          className="core-spectrum-bar"
          data-frequency={band.frequency}
          data-testid="filter-output-bar"
          height={barHeight(band.output)}
          width="11"
          x={626 + index * 36}
          y={282 - barHeight(band.output)}
        /><text className="interface-tdm-note" x={632 + index * 36} y="305" textAnchor="middle">{band.frequency / 1000}</text></g>
      ))}
      <text className="core-diagram-caption" x="670" y="332">{steps[3].label[language]} (kHz)</text>
      <line className="lab-axis faint" x1="48" x2="348" y1="374" y2="374" />
      <path className="core-original-wave" d={originalWavePath} />
      <text className="core-diagram-caption small" x="198" y="428">{copy.originalWaveform[language]}</text>
      <line className="lab-axis faint" x1="410" x2="710" y1="374" y2="374" />
      <path className="core-filtered-wave" data-testid="filtered-wave-path" d={filteredWavePath} />
      <text className="core-diagram-caption small" x="560" y="428">{copy.filteredWaveform[language]}</text>
      {[48, 410].map(x => <g key={x}>
        <text className="interface-tdm-note" x={x} y="401">0</text>
        <text className="interface-tdm-note" x={x + 300} y="401" textAnchor="end">10 ms</text>
      </g>)}
    </svg>
    <div className="filter-result-note">
      <p>{filterWaveNote}</p>
      <table>
        <caption>{toneCaption}</caption>
        <thead><tr><th>Hz</th><th>{copy.input[language]}</th><th>{copy.output[language]}</th><th>{copy.change[language]}</th></tr></thead>
        <tbody>{outputBars.map(tone => <tr key={tone.frequency}><td>{tone.frequency}</td><td>{tone.amplitude.toFixed(3)}</td><td>{tone.output.toFixed(3)}</td><td>{tone.gainDb < -60 ? "< −60 dB" : formatDbValue(tone.gainDb)}</td></tr>)}</tbody>
      </table>
      <p>{copy.filterSpectrum[language]}</p>
      <p>{copy.filterModel[language]}</p>
      {scale > 1 && <p role="status">{copy.peakWarning[language]}</p>}
      <a href="https://www.w3.org/TR/audio-eq-cookbook/" target="_blank" rel="noreferrer">W3C Audio EQ Cookbook</a>
    </div>
    </>
  );
}

function DynamicsChart({
  language,
  ratio,
  threshold
}: {
  language: Language;
  ratio: number;
  threshold: number;
}) {
  const [timeMs, setTimeMs] = useLabState(
    "CoreSignalProcessingLab.DynamicsChart.timeMs",
    250,
    (value): value is number => typeof value === "number" && Number.isFinite(value) && Number.isInteger(value) && value >= 0 && value <= 1000 && value % 10 === 0
  );
  const frame = dynamicsFrame(timeMs, threshold, ratio);
  const curvePath = createDynamicsCurvePath(threshold, ratio, 430, 286, 136, 108);
  const envelopeBottomY = 286;
  const envelopeHeight = 92;
  const inputEnvelope = createInputEnvelopePath(54, envelopeBottomY, 140, envelopeHeight);
  const detectorEnvelope = createInputEnvelopePath(250, envelopeBottomY, 132, envelopeHeight);
  const outputEnvelope = createOutputEnvelopePath(threshold, ratio, 620, envelopeBottomY, 92, envelopeHeight);
  const thresholdLineY = dbToDisplayY(threshold, envelopeBottomY, envelopeHeight);
  const exampleInputDb = frame.inputDb;
  const exampleOverThresholdDb = Math.max(0, exampleInputDb - threshold);
  const exampleKeptOverDb = exampleOverThresholdDb / ratio;
  const exampleOutputDb = compressedOutputDb(exampleInputDb, threshold, ratio);
  const exampleGainDb = exampleOutputDb - exampleInputDb;
  const curveX = 430;
  const curveY = 286;
  const curveWidth = 136;
  const curveHeight = 108;
  const gainMarkerX = curveX + ((exampleInputDb + 48) / 48) * curveWidth;
  const inputReferenceY = dbToDisplayY(exampleInputDb, curveY, curveHeight);
  const compressedOutputY = dbToDisplayY(exampleOutputDb, curveY, curveHeight);
  const steps = flowSteps.dynamics;
  const gainPath = Array.from({ length: 101 }, (_, i) => {
    const gainDb = dynamicsFrame(i * 10, threshold, ratio).gainDb;
    return `${i ? "L" : "M"} ${60 + i * 6.4} ${30 - gainDb * 2}`;
  }).join(" ");
  const excessNote = {
    zh: `超出量：max(0, ${formatDbfs(exampleInputDb)} - ${formatDbfs(threshold)}) = ${formatDbValue(exampleOverThresholdDb)}`, "zh-Hant": traditional(`超出量：max(0, ${formatDbfs(exampleInputDb)} - ${formatDbfs(threshold)}) = ${formatDbValue(exampleOverThresholdDb)}`),
    en: `Excess: max(0, ${formatDbfs(exampleInputDb)} - ${formatDbfs(threshold)}) = ${formatDbValue(exampleOverThresholdDb)}`,
    ja: `超過量：max(0, ${formatDbfs(exampleInputDb)} - ${formatDbfs(threshold)}) = ${formatDbValue(exampleOverThresholdDb)}`,
    ko: `초과량: max(0, ${formatDbfs(exampleInputDb)} - ${formatDbfs(threshold)}) = ${formatDbValue(exampleOverThresholdDb)}`
  }[language];
  const ratioNote = {
    zh: `Ratio：${formatDbValue(exampleOverThresholdDb)} / ${ratio} = ${formatDbValue(exampleKeptOverDb)}`, "zh-Hant": traditional(`Ratio：${formatDbValue(exampleOverThresholdDb)} / ${ratio} = ${formatDbValue(exampleKeptOverDb)}`),
    en: `Ratio: ${formatDbValue(exampleOverThresholdDb)} / ${ratio} = ${formatDbValue(exampleKeptOverDb)}`,
    ja: `Ratio：${formatDbValue(exampleOverThresholdDb)} / ${ratio} = ${formatDbValue(exampleKeptOverDb)}`,
    ko: `Ratio: ${formatDbValue(exampleOverThresholdDb)} / ${ratio} = ${formatDbValue(exampleKeptOverDb)}`
  }[language];
  const outputNote = {
    zh: `输出：${formatDbfs(exampleOutputDb)}；增益变化 ${formatDbValue(exampleGainDb)}`, "zh-Hant": traditional(`输出：${formatDbfs(exampleOutputDb)}；增益变化 ${formatDbValue(exampleGainDb)}`),
    en: `Output: ${formatDbfs(exampleOutputDb)}; gain change ${formatDbValue(exampleGainDb)}`,
    ja: `出力：${formatDbfs(exampleOutputDb)}；ゲイン変化 ${formatDbValue(exampleGainDb)}`,
    ko: `출력: ${formatDbfs(exampleOutputDb)}; 게인 변화 ${formatDbValue(exampleGainDb)}`
  }[language];
  const reductionNote = {
    zh: `衰减量：${(-exampleGainDb).toFixed(1)} dB；线性增益 g = ${frame.linearGain.toFixed(3)}，应用到 PCM 时 y[n] = g[n] · x[n]。`, "zh-Hant": traditional(`衰减量：${(-exampleGainDb).toFixed(1)} dB；线性增益 g = ${frame.linearGain.toFixed(3)}，应用到 PCM 时 y[n] = g[n] · x[n]。`),
    en: `Reduction: ${(-exampleGainDb).toFixed(1)} dB; linear gain g = ${frame.linearGain.toFixed(3)}, applied to PCM as y[n] = g[n] · x[n].`,
    ja: `減衰量：${(-exampleGainDb).toFixed(1)} dB；線形ゲイン g = ${frame.linearGain.toFixed(3)}、PCM には y[n] = g[n] · x[n] として適用する。`,
    ko: `감쇠량: ${(-exampleGainDb).toFixed(1)} dB; 선형 게인 g = ${frame.linearGain.toFixed(3)}이며 PCM에는 y[n] = g[n] · x[n]으로 적용함.`
  }[language];

  return (
    <>
    <svg
      aria-label={copy.dynamicsDiagram[language]}
      className="core-signal-chart dynamics-comparison-chart"
      role="img"
      viewBox="0 0 760 365"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect className="lab-diagram-bg" height="365" rx="16" width="760" />
      {steps.map((step, index) => {
        const x = 44 + index * 184;
        return (
          <g key={step.label.en}>
            <g className="core-flow-node">
              <rect x={x} y="34" width="148" height="72" rx="8" />
              <text className="core-flow-node-title" x={x + 74} y="70">{step.label[language]}</text>
            </g>
            {index < steps.length - 1 ? <FlowArrow x1={x + 148} x2={x + 174} y={70} /> : null}
          </g>
        );
      })}
      {[{ x: 54, width: 140, db: frame.inputDb }, { x: 250, width: 132, db: frame.inputDb }, { x: 620, width: 92, db: frame.outputDb }].map(plot => <g key={plot.x}>
        <line className="lab-axis" x1={plot.x} x2={plot.x + plot.width} y1="286" y2="286" />
        <line className="core-cutoff-marker" x1={plot.x + timeMs / 1000 * plot.width} x2={plot.x + timeMs / 1000 * plot.width} y1="194" y2="286" />
        <circle className="core-gain-point" cx={plot.x + timeMs / 1000 * plot.width} cy={dbToDisplayY(plot.db, envelopeBottomY, envelopeHeight)} r="4" />
        <text className="interface-tdm-note" x={plot.x} y="310">0</text>
        <text className="interface-tdm-note" x={plot.x + plot.width} y="310" textAnchor="end">1 s</text>
      </g>)}
      <path className="core-dynamics-input" data-testid="dynamics-input-envelope" d={inputEnvelope} />
      <text className="core-diagram-caption" x="124" y="342">{steps[0].label[language]}</text>
      <line
        className="lab-axis faint"
        data-testid="dynamics-threshold-line"
        x1="238"
        x2="382"
        y1={thresholdLineY}
        y2={thresholdLineY}
      />
      <text className="interface-tdm-note" x="250" y="170">T = {threshold} dBFS</text>
      <path className="core-dynamics-input" d={detectorEnvelope} />
      <text className="core-diagram-caption" x="316" y="342">{steps[1].label[language]}</text>
      <line className="lab-axis" x1="430" x2="566" y1="286" y2="286" />
      <line className="lab-axis" x1="430" x2="430" y1="176" y2="286" />
      <path className="core-dynamics-guide" d="M 430 286 L 566 178" />
      <path className="lab-wave-path dynamics-transfer-path" d={curvePath} />
      <line
        className="core-gain-reference"
        x1="430"
        x2={gainMarkerX}
        y1={inputReferenceY}
        y2={inputReferenceY}
      />
      <line
        className="core-gain-reference"
        x1="430"
        x2={gainMarkerX}
        y1={compressedOutputY}
        y2={compressedOutputY}
      />
      <line
        className="core-gain-reduction-marker"
        data-testid="dynamics-gain-reduction"
        x1={gainMarkerX}
        x2={gainMarkerX}
        y1={inputReferenceY}
        y2={compressedOutputY}
      />
      <circle className="core-gain-point" cx={gainMarkerX} cy={compressedOutputY} r="4" />
      <text className="interface-tdm-note" x="430" y="310">−48</text><text className="interface-tdm-note" x="566" y="310" textAnchor="end">0 dBFS</text>
      <text className="core-diagram-caption" x="498" y="342">{steps[2].label[language]}</text>
      <path className="core-dynamics-output" data-testid="dynamics-output-envelope" d={outputEnvelope} />
      <text className="core-diagram-caption" x="666" y="342">{steps[3].label[language]}</text>
    </svg>
    <div className="dynamics-result-note">
      <p>{copy.dynamicsResult[language]}</p>
      <label className="dynamics-time-control">{copy.observationTime[language]} · {timeMs} ms
        <input aria-label={copy.observationTime[language]} type="range" min="0" max="1000" step="10" value={timeMs} onChange={event => setTimeMs(Number(event.target.value))} />
      </label>
      <svg className="dynamics-gain-chart" viewBox="0 0 760 145" role="img" aria-label={copy.gainOverTime[language]}>
        {[0, -18, -36].map(db => <g key={db}><line className="lab-axis faint" x1="60" x2="700" y1={30 - db * 2} y2={30 - db * 2} /><text className="lab-label" x="50" y={36 - db * 2} textAnchor="end">{db}</text></g>)}
        <path className="core-dynamics-output" data-testid="dynamics-gain-history" d={gainPath} />
        <line className="core-cutoff-marker" x1={60 + timeMs * 0.64} x2={60 + timeMs * 0.64} y1="30" y2="102" />
        <circle className="core-gain-point" cx={60 + timeMs * 0.64} cy={30 - frame.gainDb * 2} r="4" />
        <text className="lab-label" x="60" y="133">0</text><text className="lab-label" x="380" y="133" textAnchor="middle">500</text><text className="lab-label" x="700" y="133" textAnchor="end">1000 ms</text>
      </svg>
      <p>{copy.gainCurve[language]}</p>
      <div className="dynamics-calculation">
        <p>{copy.aboveThreshold[language]}</p>
        <p>{copy.atOrBelowThreshold[language]}</p>
        <p data-testid="dynamics-over-threshold">
          {excessNote}
        </p>
        <p data-testid="dynamics-ratio-kept">
          {ratioNote}
        </p>
        <p data-testid="dynamics-gain-db">
          {outputNote}
        </p>
        <p>{reductionNote}</p>
      </div>
      <p>{copy.thresholdChanges[language]}</p>
      <p>{copy.modelLimits[language]}</p>
    </div>
    </>
  );
}

export function CoreSignalProcessingLab({ language, onBack, onBackToDetails }: CoreSignalProcessingLabProps) {
  const [mode, setMode] = useLabState<SignalMode>(
    "CoreSignalProcessingLab.mode",
    "stft",
    (value): value is SignalMode => value === "stft" || value === "filter" || value === "dynamics"
  );
  const [windowSize, setWindowSize] = useLabState(
    "CoreSignalProcessingLab.windowSize",
    512,
    (value): value is number => typeof value === "number" && Number.isFinite(value) && Number.isInteger(value) && value >= 256 && value <= 1024 && (value - 256) % 256 === 0
  );
  const [hopSize, setHopSize] = useLabState(
    "CoreSignalProcessingLab.hopSize",
    256,
    (value): value is number => typeof value === "number" && Number.isFinite(value) && Number.isInteger(value) && value >= 128 && value <= 512 && (value - 128) % 128 === 0
  );
  const [filterType, setFilterType] = useLabState<FilterType>(
    "CoreSignalProcessingLab.filterType",
    "lowpass",
    (value): value is FilterType => value === "lowpass" || value === "highpass" || value === "bandpass" || value === "notch"
  );
  const [cutoff, setCutoff] = useLabState(
    "CoreSignalProcessingLab.cutoff",
    2400,
    (value): value is number => typeof value === "number" && Number.isFinite(value) && Number.isInteger(value) && value >= 200 && value <= 7900 && (value - 200) % 100 === 0
  );
  const [q, setQ] = useLabState(
    "CoreSignalProcessingLab.q",
    1.2,
    (value): value is number => typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 20 && Math.abs(value * 10 - Math.round(value * 10)) < 1e-9
  );
  const [eqGain, setEqGain] = useLabState(
    "CoreSignalProcessingLab.eqGain",
    0,
    (value): value is number => typeof value === "number" && Number.isFinite(value) && Number.isInteger(value) && value >= -12 && value <= 12
  );
  const [threshold, setThreshold] = useLabState(
    "CoreSignalProcessingLab.threshold",
    -18,
    (value): value is number => typeof value === "number" && Number.isFinite(value) && Number.isInteger(value) && value >= -36 && value <= -6
  );
  const [ratio, setRatio] = useLabState(
    "CoreSignalProcessingLab.ratio",
    3,
    (value): value is number => typeof value === "number" && Number.isFinite(value) && Number.isInteger(value) && value >= 1 && value <= 12
  );

  const stftMetrics = useMemo(() => {
    const frequencyResolution = sampleRate / (2 ** Math.ceil(Math.log2(windowSize)));
    const frameDuration = (windowSize / sampleRate) * 1000;
    const overlap = Math.max(0, 1 - hopSize / windowSize) * 100;

    return { frameDuration, frequencyResolution, overlap };
  }, [hopSize, windowSize]);

  const filterSummary = {
    lowpass: {
      zh: "低通：削弱截止频率以上的高频", "zh-Hant": traditional("低通：削弱截止频率以上的高频"),
      en: "Low-pass: attenuates high frequencies above cutoff",
      ja: "ローパス：カットオフより上の高域を減衰",
      ko: "저역통과: 차단 주파수 위의 고주파를 감쇠"
    },
    highpass: {
      zh: "高通：削弱截止频率以下的低频", "zh-Hant": traditional("高通：削弱截止频率以下的低频"),
      en: "High-pass: attenuates low frequencies below cutoff",
      ja: "ハイパス：カットオフより下の低域を減衰",
      ko: "고역통과: 차단 주파수 아래의 저주파를 감쇠"
    },
    bandpass: {
      zh: "带通：只保留中心频段附近能量", "zh-Hant": traditional("带通：只保留中心频段附近能量"),
      en: "Band-pass: keeps energy around the center band",
      ja: "バンドパス：中心帯域付近のエネルギーだけを保持",
      ko: "대역통과: 중심 대역 주변의 에너지만 유지"
    },
    notch: {
      zh: "陷波：压低某个窄频段的干扰", "zh-Hant": traditional("陷波：压低某个窄频段的干扰"),
      en: "Notch: suppresses a narrow interference band",
      ja: "ノッチ：狭い干渉帯域を抑制",
      ko: "노치: 좁은 간섭 대역을 억제"
    }
  }[filterType];
  const activeChangeNote = {
    stft: {
      zh: "窗口越长，通常越能区分相邻频率，但时间定位越粗；hop 越小，时间帧更密、计算量更高。颜色越亮表示该帧频带的功率谱密度越高。", "zh-Hant": traditional("窗口越长，通常越能区分相邻频率，但时间定位越粗；hop 越小，时间帧更密、计算量更高。颜色越亮表示该帧频带的功率谱密度越高。"),
      en: "Longer windows usually distinguish closer frequencies but give coarser timing; smaller hops add time frames and computation. Brighter cells mean higher power spectral density in that frame/band.",
      ja: "窓を長くすると近接周波数を区別しやすい一方、時間位置は粗くなる。hop を小さくするとフレーム密度と計算量が増える。明るいセルほどそのフレーム/帯域のパワースペクトル密度が高い。",
      ko: "윈도가 길수록 가까운 주파수를 구분하기 쉽지만 시간 위치가 거칠어짐. hop이 작으면 시간 프레임과 계산량이 늘어남. 밝은 셀일수록 해당 프레임/대역의 파워 스펙트럼 밀도가 높음."
    },
    filter: {
      zh: "这一步变化：截止频率、Q 和 EQ 增益共同改变频率响应，输出频谱会随各频段保留比例变化。", "zh-Hant": traditional("这一步变化：截止频率、Q 和 EQ 增益共同改变频率响应，输出频谱会随各频段保留比例变化。"),
      en: "Current change: cutoff, Q, and EQ gain shape the response together, so the output spectrum follows the retained energy in each band.",
      ja: "この段階の変化：カットオフ、Q、EQ ゲインが周波数応答を共同で変え、出力スペクトルは各帯域の保持率に応じて変わる。",
      ko: "현재 단계의 변화: cutoff, Q 및 EQ 게인이 주파수 응답을 함께 형성하므로 출력 스펙트럼은 각 대역의 유지 비율을 따름."
    },
    dynamics: {
      zh: "这一步变化：阈值线下移，更早进入压缩，输出包络更平。", "zh-Hant": traditional("这一步变化：阈值线下移，更早进入压缩，输出包络更平。"),
      en: "Current change: the threshold line moves lower, compression starts earlier, and the output envelope becomes flatter.",
      ja: "この段階の変化：しきい値を下げると圧縮が早く始まり、出力包絡が平坦になる。",
      ko: "현재 단계의 변화: threshold 선을 낮추면 압축이 더 일찍 시작되고 출력 엔벨로프가 평탄해짐."
    }
  }[mode];
  const stftMetricsCopy = {
    zh: [`频率格间距：${stftMetrics.frequencyResolution.toFixed(2)} Hz/bin`, `每帧时长：${stftMetrics.frameDuration.toFixed(1)} ms`, `重叠率：${stftMetrics.overlap.toFixed(1)}%`], "zh-Hant": traditional([`频率格间距：${stftMetrics.frequencyResolution.toFixed(2)} Hz/bin`, `每帧时长：${stftMetrics.frameDuration.toFixed(1)} ms`, `重叠率：${stftMetrics.overlap.toFixed(1)}%`]),
    en: [`Bin spacing: ${stftMetrics.frequencyResolution.toFixed(2)} Hz/bin`, `Frame duration: ${stftMetrics.frameDuration.toFixed(1)} ms`, `Overlap: ${stftMetrics.overlap.toFixed(1)}%`],
    ja: [`ビン間隔：${stftMetrics.frequencyResolution.toFixed(2)} Hz/bin`, `1 フレームの長さ：${stftMetrics.frameDuration.toFixed(1)} ms`, `オーバーラップ率：${stftMetrics.overlap.toFixed(1)}%`],
    ko: [`빈 간격: ${stftMetrics.frequencyResolution.toFixed(2)} Hz/bin`, `프레임 길이: ${stftMetrics.frameDuration.toFixed(1)} ms`, `중첩률: ${stftMetrics.overlap.toFixed(1)}%`]
  }[language];
  const filterMetricsCopy = {
    zh: [`截止频率：${cutoff} Hz`, `EQ 增益：${formatDb(eqGain)}`], "zh-Hant": traditional([`截止频率：${cutoff} Hz`, `EQ 增益：${formatDb(eqGain)}`]),
    en: [`Cutoff: ${cutoff} Hz`, `EQ gain: ${formatDb(eqGain)}`],
    ja: [`カットオフ：${cutoff} Hz`, `EQ ゲイン：${formatDb(eqGain)}`],
    ko: [`차단 주파수: ${cutoff} Hz`, `EQ 게인: ${formatDb(eqGain)}`]
  }[language];

  return (
    <main className="sound-lab-page core-signal-page">
      <section className="sound-lab-hero" aria-labelledby="core-signal-lab-title">
        <div className="sound-lab-back-actions">
          <button className="sound-lab-back" type="button" onClick={onBack}>
            <ArrowLeft size={18} aria-hidden="true" />
            {copy.backKnowledge[language]}
          </button>
          {onBackToDetails ? <button className="sound-lab-back" type="button" onClick={onBackToDetails}>
            <ArrowLeft size={18} aria-hidden="true" />
            {copy.backDetails[language]}
          </button> : null}
        </div>
        <div>
          <span className="section-kicker">{copy.traditionalLab[language]}</span>
          <h1 id="core-signal-lab-title">
            {copy.labTitle[language]}
          </h1>
          <p>{copy.intro[language]}</p>
          <p>{copy.explore[language]}</p>
        </div>
      </section>

      <section
        aria-label={copy.workbench[language]}
        className="core-signal-workbench"
      >
        <div className="waveform-tabs core-signal-tabs" role="group" aria-label={copy.views[language]}>
          {(Object.keys(modeLabels) as SignalMode[]).map((item) => (
            <button
              className={mode === item ? "active" : ""}
              key={item}
              type="button"
              onClick={() => setMode(item)}
            >
              {modeLabels[item][language]}
            </button>
          ))}
        </div>

        {mode !== "stft" && <><ProcessingStageOverview language={language} mode={mode} /><FlowSteps language={language} mode={mode} /></>}

        <div className={mode === "stft" ? "core-signal-layout core-stft-layout" : "core-signal-layout"}>
          <div className="sound-lab-visual core-signal-visual">
            {mode === "stft" ? (
              <StftWorkbench hopSize={hopSize} language={language} windowSize={windowSize} onParameters={(window, hop) => { setWindowSize(window); setHopSize(hop); }} />
            ) : null}
            {mode === "filter" ? (
              <FilterChart
                cutoff={cutoff}
                eqGain={eqGain}
                filterType={filterType}
                language={language}
                q={q}
              />
            ) : null}
            {mode === "dynamics" ? (
              <DynamicsChart language={language} ratio={ratio} threshold={threshold} />
            ) : null}
          </div>

          <aside className="sound-lab-controls core-signal-controls">
            {mode === "stft" ? (
              <>
                <div className="codec-mode-concepts-header">
                  <span>STFT</span>
                  <strong>{copy.framing[language]}</strong>
                </div>
                <SliderControl
                  label={copy.windowSize[language]}
                  max={1024}
                  min={256}
                  step={256}
                  value={windowSize}
                  onChange={setWindowSize}
                />
                <SliderControl
                  label={copy.hopSize[language]}
                  max={512}
                  min={128}
                  step={128}
                  value={hopSize}
                  onChange={setHopSize}
                />
                <div className="core-signal-metrics">
                  <strong>{stftMetricsCopy[0]}</strong>
                  <strong>{stftMetricsCopy[1]}</strong>
                  <strong>{stftMetricsCopy[2]}</strong>
                </div>
                <p className="core-signal-change-note">{activeChangeNote[language]}</p>
              </>
            ) : null}

            {mode === "filter" ? (
              <>
                <div className="codec-mode-concepts-header">
                  <span>{copy.frequencyResponse[language]}</span>
                  <strong>{filterSummary[language]}</strong>
                </div>
                <div className="waveform-tabs core-filter-tabs" role="group" aria-label={copy.filterTypes[language]}>
                  {(Object.keys(filterLabels) as FilterType[]).map((item) => (
                    <button
                      className={filterType === item ? "active" : ""}
                      key={item}
                      type="button"
                      onClick={() => setFilterType(item)}
                    >
                      {filterLabels[item][language]}
                    </button>
                  ))}
                </div>
                <SliderControl
                  label={copy.cutoffFrequency[language]}
                  max={7900}
                  min={200}
                  step={100}
                  value={cutoff}
                  onChange={setCutoff}
                />
                <SliderControl label="Q" max={20} min={0} step={0.1} value={q} onChange={setQ} />
                <SliderControl
                  label={copy.eqGain[language]}
                  max={12}
                  min={-12}
                  value={eqGain}
                  onChange={setEqGain}
                />
                <div className="core-signal-metrics">
                  <strong>{filterMetricsCopy[0]}</strong>
                  <strong>Q：{q.toFixed(1)}</strong>
                  <strong>{filterMetricsCopy[1]}</strong>
                </div>
                <p className="core-signal-change-note">{activeChangeNote[language]}</p>
                <button className="sine-button" type="button" onClick={() => { setFilterType("lowpass"); setCutoff(2400); setQ(1.2); setEqGain(0); }}><RotateCcw size={16} aria-hidden="true" />{copy.resetFilter[language]}</button>
              </>
            ) : null}

            {mode === "dynamics" ? (
              <>
                <div className="codec-mode-concepts-header">
                  <span>{copy.compressor[language]}</span>
                  <strong>{copy.compressorLead[language]}</strong>
                </div>
                <SliderControl
                  label={copy.threshold[language]}
                  max={-6}
                  min={-36}
                  value={threshold}
                  onChange={setThreshold}
                />
                <SliderControl label={copy.ratio[language]} max={12} min={1} value={ratio} onChange={setRatio} />
                <div className="core-signal-metrics">
                  <strong>{copy.threshold[language]}{language === "zh-Hant" ? traditional("：") : language === "zh" ? "：" : ": "}{threshold} dBFS</strong>
                  <strong>{copy.ratio[language]}{language === "zh-Hant" ? traditional("：") : language === "zh" ? "：" : ": "}{ratio}:1</strong>
                  <strong>{copy.attackRelease[language]}</strong>
                </div>
                <p className="core-signal-change-note">{activeChangeNote[language]}</p>
              </>
            ) : null}
          </aside>
        </div>

        {mode === "stft" && <details className="stft-reading-notes">
          <summary>{copy.processingFlow[language]}</summary>
          <ProcessingStageOverview language={language} mode={mode} />
          <FlowSteps language={language} mode={mode} />
        </details>}
      </section>
    </main>
  );
}
