import { traditional } from "../content/traditional";
import { useMemo, useState } from "react";
import { DacReconstruction } from "./DacReconstruction";
import { ArrowLeft } from "lucide-react";
import type { Language, LocalizedText } from "../content/knowledge";

type DigitalAudioLabProps = {
  language: Language;
  initialDirection?: "adc" | "dac";
  onBack: () => void;
  onBackToDetails?: () => void;
};

type DisplayMode = "waveform" | "samples" | "quantized" | "error" | "pcm";

const modeLabels: Record<DisplayMode, Record<Language, string>> = {
  waveform: { zh: "原始波形", "zh-Hant": traditional("原始波形"), en: "Original waveform", ja: "元の波形", ko: "원래 파형" },
  samples: { zh: "采样点", "zh-Hant": traditional("采样点"), en: "Samples", ja: "サンプル点", ko: "샘플 지점" },
  quantized: { zh: "量化阶梯", "zh-Hant": traditional("量化阶梯"), en: "Quantized steps", ja: "量子化ステップ", ko: "양자화 계단" },
  error: { zh: "误差曲线", "zh-Hant": traditional("误差曲线"), en: "Error curve", ja: "誤差曲線", ko: "오차 곡선" },
  pcm: { zh: "PCM 编码", "zh-Hant": traditional("PCM 编码"), en: "PCM encoding", ja: "PCM エンコード", ko: "PCM 인코딩" }
};

export const codecPrinciples = [
  {
    format: "PCM",
    ratio: { zh: "1:1", "zh-Hant": traditional("1:1"), en: "1:1", ja: "1:1", ko: "1:1" },
    relation: { zh: "原始数字采样", "zh-Hant": traditional("原始数字采样"), en: "Raw digital samples", ja: "生のデジタルサンプル", ko: "원시 디지털 샘플" },
    principle: {
      zh: "直接保存每个采样点的整数值，不压缩，数据量由采样率、位深和声道数决定。", "zh-Hant": traditional("直接保存每个采样点的整数值，不压缩，数据量由采样率、位深和声道数决定。"),
      en: "Stores each sample's integer value directly with no compression; size is determined by sample rate, bit depth, and channel count.",
      ja: "各サンプルの整数値を圧縮せずに直接保存します。データ量はサンプルレート、ビット深度、チャンネル数で決まります。",
      ko: "각 샘플의 정수값을 압축하지 않고 직접 저장합니다. 데이터 크기는 샘플레이트, 비트 깊이와 채널 수로 결정됩니다."
    }
  },
  {
    format: "WAV",
    ratio: { zh: "约 1:1", "zh-Hant": traditional("约 1:1"), en: "About 1:1", ja: "約 1:1", ko: "약 1:1" },
    relation: { zh: "常见为 PCM + 文件头", "zh-Hant": traditional("常见为 PCM + 文件头"), en: "Often PCM plus a file header", ja: "一般的には PCM + ファイルヘッダー", ko: "일반적으로 PCM + 파일 헤더" },
    principle: {
      zh: "给 PCM 加上 RIFF/WAVE 文件头，写入采样率、位深、声道数和数据长度等信息。", "zh-Hant": traditional("给 PCM 加上 RIFF/WAVE 文件头，写入采样率、位深、声道数和数据长度等信息。"),
      en: "Adds a RIFF/WAVE header to PCM with sample rate, bit depth, channel count, and data length.",
      ja: "PCM に RIFF/WAVE ヘッダーを付加し、サンプルレート、ビット深度、チャンネル数、データ長を記録します。",
      ko: "PCM에 RIFF/WAVE 헤더를 추가해 샘플레이트, 비트 깊이, 채널 수와 데이터 길이를 기록합니다."
    }
  },
  {
    format: "MP3",
    ratio: { zh: "约 6:1 到 12:1", "zh-Hant": traditional("约 6:1 到 12:1"), en: "About 6:1 to 12:1", ja: "約 6:1〜12:1", ko: "약 6:1~12:1" },
    relation: { zh: "感知有损压缩", "zh-Hant": traditional("感知有损压缩"), en: "Perceptual lossy compression", ja: "知覚的非可逆圧縮", ko: "지각 기반 손실 압축" },
    principle: {
      zh: "利用人耳掩蔽效应，丢弃不容易听到的频率成分，再做频域编码。", "zh-Hant": traditional("利用人耳掩蔽效应，丢弃不容易听到的频率成分，再做频域编码。"),
      en: "Uses auditory masking to remove less audible frequency content, then encodes in the frequency domain.",
      ja: "聴覚マスキングを利用して聴こえにくい周波数成分を削り、周波数領域でエンコードします。",
      ko: "청각 마스킹을 이용해 잘 들리지 않는 주파수 성분을 제거한 뒤 주파수 영역에서 인코딩합니다."
    }
  },
  {
    format: "AAC",
    ratio: { zh: "约 8:1 到 16:1", "zh-Hant": traditional("约 8:1 到 16:1"), en: "About 8:1 to 16:1", ja: "約 8:1〜16:1", ko: "약 8:1~16:1" },
    relation: { zh: "更高效的感知有损压缩", "zh-Hant": traditional("更高效的感知有损压缩"), en: "More efficient perceptual lossy compression", ja: "より効率的な知覚的非可逆圧縮", ko: "더 효율적인 지각 기반 손실 압축" },
    principle: {
      zh: "和 MP3 思路类似，但工具更丰富，同码率下通常能保留更多细节。", "zh-Hant": traditional("和 MP3 思路类似，但工具更丰富，同码率下通常能保留更多细节。"),
      en: "Similar idea to MP3, but with richer tools that usually preserve more detail at the same bitrate.",
      ja: "MP3 と似た考え方ですが、より多くのツールを備え、同じビットレートで通常は細部を多く保ちます。",
      ko: "MP3와 비슷한 방식이지만 도구가 더 풍부해 같은 비트레이트에서 보통 더 많은 세부 정보를 보존합니다."
    }
  },
  {
    format: "AMR",
    ratio: { zh: "约 10:1 到 30:1", "zh-Hant": traditional("约 10:1 到 30:1"), en: "About 10:1 to 30:1", ja: "約 10:1〜30:1", ko: "약 10:1~30:1" },
    relation: { zh: "语音专用低码率编码", "zh-Hant": traditional("语音专用低码率编码"), en: "Low-bitrate speech coding", ja: "音声向け低ビットレート符号化", ko: "음성 전용 저비트레이트 코딩" },
    principle: {
      zh: "用人声产生模型和参数来描述语音，适合电话语音，不适合高保真音乐。", "zh-Hant": traditional("用人声产生模型和参数来描述语音，适合电话语音，不适合高保真音乐。"),
      en: "Uses a speech production model and parameters, good for telephony speech but not high-fidelity music.",
      ja: "音声生成モデルとパラメーターで音声を表現し、電話音声には適しますが、高忠実度の音楽には向きません。",
      ko: "음성 생성 모델과 파라미터로 음성을 표현하므로 전화 음성에는 적합하지만 고음질 음악에는 적합하지 않습니다."
    }
  },
  {
    format: "Opus",
    ratio: { zh: "约 6:1 到 30:1", "zh-Hant": traditional("约 6:1 到 30:1"), en: "About 6:1 to 30:1", ja: "約 6:1〜30:1", ko: "약 6:1~30:1" },
    relation: { zh: "低延迟语音/音乐编码", "zh-Hant": traditional("低延迟语音/音乐编码"), en: "Low-latency speech and music coding", ja: "低遅延の音声／音楽符号化", ko: "저지연 음성/음악 코딩" },
    principle: {
      zh: "结合语音编码和音乐编码思路，能在通话、会议、实时互动中自适应内容和码率。", "zh-Hant": traditional("结合语音编码和音乐编码思路，能在通话、会议、实时互动中自适应内容和码率。"),
      en: "Combines speech and music coding ideas, adapting to content and bitrate for calls, meetings, and real-time interaction.",
      ja: "音声符号化と音楽符号化の考え方を組み合わせ、通話、会議、リアルタイム対話で内容とビットレートに適応します。",
      ko: "음성 코딩과 음악 코딩 방식을 결합해 통화, 회의와 실시간 상호작용에서 콘텐츠와 비트레이트에 적응합니다."
    }
  },
  {
    format: "ADPCM",
    ratio: { zh: "约 4:1", "zh-Hant": traditional("约 4:1"), en: "About 4:1", ja: "約 4:1", ko: "약 4:1" },
    relation: { zh: "预测差分编码", "zh-Hant": traditional("预测差分编码"), en: "Predictive differential coding", ja: "予測差分符号化", ko: "예측 차분 코딩" },
    principle: {
      zh: "不保存完整采样值，而是保存当前采样与预测值之间的差分，实现简单、延迟低。", "zh-Hant": traditional("不保存完整采样值，而是保存当前采样与预测值之间的差分，实现简单、延迟低。"),
      en: "Stores the difference between the current sample and a prediction instead of the full value; simple and low-latency.",
      ja: "完全な値ではなく、現在のサンプルと予測値の差分を保存するため、単純で低遅延です。",
      ko: "전체 값 대신 현재 샘플과 예측값의 차이를 저장하므로 구조가 단순하고 지연이 낮습니다."
    }
  }
];

const digitalAudioCopy = {
  backKnowledge: { zh: "返回知识库", "zh-Hant": traditional("返回知识库"), en: "Back to knowledge base", ja: "知識ベースに戻る", ko: "지식 베이스로 돌아가기" },
  backGuide: { zh: "返回详细内容", "zh-Hant": traditional("返回详细内容"), en: "Back to detailed guide", ja: "詳細ガイドに戻る", ko: "상세 가이드로 돌아가기" },
  kicker: { zh: "数字音频实验", "zh-Hant": traditional("数字音频实验"), en: "Digital audio lab", ja: "デジタル音声ラボ", ko: "디지털 오디오 실험실" },
  title: { zh: "采样、量化与编码实验室", "zh-Hant": traditional("采样、量化与编码实验室"), en: "Sampling, Quantization, and Encoding Lab", ja: "サンプリング・量子化・符号化ラボ", ko: "샘플링, 양자화와 인코딩 실험실" },
  description: {
    zh: "切换 ADC / DAC：从采样、量化与 PCM 码字，逐步观察电压映射、零阶保持和重建低通。", "zh-Hant": traditional("切换 ADC / DAC：从采样、量化与 PCM 码字，逐步观察电压映射、零阶保持和重建低通。"),
    en: "Switch ADC / DAC: explore sampling, quantization and PCM words, then voltage mapping, zero-order hold and reconstruction filtering.",
    ja: "ADC / DACを切り替え、標本化・量子化・PCMから電圧変換・ゼロ次ホールド・再構成フィルターまで観察します。",
    ko: "ADC / DAC를 전환하여 샘플링, 양자화, PCM부터 전압 매핑, 영차 홀드, 복원 필터까지 살펴봅니다."
  },
  workbench: { zh: "采样、量化与编码实验台", "zh-Hant": traditional("采样、量化与编码实验台"), en: "Sampling, quantization, and encoding workbench", ja: "サンプリング・量子化・符号化の実験台", ko: "샘플링, 양자화와 인코딩 실험대" },
  simulation: {
    zh: "数值仿真：横轴为归一化观察区间，频率表示区间内周期数，不是 Hz。使用含两端点的均匀量化与无符号偏移编码；常见 16-bit 音频 PCM 则使用有符号整数。阶梯是样本显示方式，不是 DAC 重建结果；本实验不模拟抗混叠滤波或抖动。", "zh-Hant": traditional("数值仿真：横轴为归一化观察区间，频率表示区间内周期数，不是 Hz。使用含两端点的均匀量化与无符号偏移编码；常见 16-bit 音频 PCM 则使用有符号整数。阶梯是样本显示方式，不是 DAC 重建结果；本实验不模拟抗混叠滤波或抖动。"),
    en: "Numerical simulation: the horizontal axis is a normalized interval; frequency means cycles per interval, not Hz. Quantization includes both endpoints and uses unsigned offset codes, unlike common signed 16-bit audio PCM. Steps display samples, not DAC reconstruction. Anti-alias filtering and dither are not simulated.",
    ja: "数値シミュレーション：横軸は正規化した観測区間で、周波数は Hz ではなく区間内の周期数です。両端点を含む一様量子化と符号なしオフセットコードを使います。一般的な符号付き 16-bit オーディオ PCM とは異なります。階段はサンプルの表示であり DAC の再構成結果ではありません。アンチエイリアスフィルターとディザーはシミュレートしません。",
    ko: "수치 시뮬레이션: 가로축은 정규화된 관찰 구간이며 주파수는 Hz가 아니라 구간 안의 주기 수입니다. 양 끝점을 포함한 균일 양자화와 부호 없는 오프셋 코드를 사용하며 일반적인 부호 있는 16-bit 오디오 PCM과 다릅니다. 계단은 샘플 표시 방식이지 DAC 재구성 결과가 아닙니다. 앨리어싱 방지 필터와 디더는 시뮬레이션하지 않습니다."
  },
  displayModePrefix: { zh: "显示模式：", "zh-Hant": traditional("显示模式："), en: "Display mode: ", ja: "表示モード：", ko: "표시 모드: " },
  diagramAria: { zh: "采样与量化可视化图", "zh-Hant": traditional("采样与量化可视化图"), en: "Sampling and quantization visualization", ja: "サンプリングと量子化の可視化", ko: "샘플링과 양자화 시각화" },
  analogWaveform: { zh: "模拟波形", "zh-Hant": traditional("模拟波形"), en: "Analog waveform", ja: "アナログ波形", ko: "아날로그 파형" },
  bitDepthGuide: { zh: "位深量化等级参考线", "zh-Hant": traditional("位深量化等级参考线"), en: "Bit-depth quantization level guide", ja: "ビット深度の量子化レベル基準線", ko: "비트 깊이 양자화 레벨 기준선" },
  errorDefinition: { zh: "误差 = 原始值 - 量化值", "zh-Hant": traditional("误差 = 原始值 - 量化值"), en: "Error = original - quantized", ja: "誤差 = 元の値 - 量子化値", ko: "오차 = 원래 값 - 양자화 값" },
  moreSamples: { zh: "采样点越多，时间越细", "zh-Hant": traditional("采样点越多，时间越细"), en: "More samples, finer time detail", ja: "サンプル点が多いほど時間分解能が高くなります", ko: "샘플 지점이 많을수록 시간 해상도가 높아집니다" },
  displayMode: { zh: "显示模式", "zh-Hant": traditional("显示模式"), en: "Display mode", ja: "表示モード", ko: "표시 모드" },
  sampleCount: { zh: "采样点数", "zh-Hant": traditional("采样点数"), en: "Sample count", ja: "サンプル数", ko: "샘플 수" },
  bitDepth: { zh: "位深", "zh-Hant": traditional("位深"), en: "Bit depth", ja: "ビット深度", ko: "비트 깊이" },
  inputFrequency: { zh: "输入频率", "zh-Hant": traditional("输入频率"), en: "Input frequency", ja: "入力周波数", ko: "입력 주파수" },
  currentSamples: { zh: "当前采样点", "zh-Hant": traditional("当前采样点"), en: "Current samples", ja: "現在のサンプル数", ko: "현재 샘플 수" },
  quantizationLevels: { zh: "当前量化等级", "zh-Hant": traditional("当前量化等级"), en: "Quantization levels", ja: "現在の量子化レベル数", ko: "현재 양자화 레벨" },
  maximumError: { zh: "最大采样量化误差", "zh-Hant": traditional("最大采样量化误差"), en: "Maximum sampled quantization error", ja: "最大サンプル量子化誤差", ko: "최대 샘플 양자화 오차" },
  theoreticalBound: { zh: "理论上限", "zh-Hant": traditional("理论上限"), en: "bound", ja: "理論上限", ko: "이론적 한계" },
  pcmSectionAria: { zh: "PCM 编码说明", "zh-Hant": traditional("PCM 编码说明"), en: "PCM encoding explanation", ja: "PCM 符号化の説明", ko: "PCM 인코딩 설명" },
  howPcm: { zh: "如何变成 PCM", "zh-Hant": traditional("如何变成 PCM"), en: "How samples become PCM", ja: "サンプルが PCM になるまで", ko: "샘플이 PCM이 되는 과정" },
  pcmFlow: { zh: "模拟值 → 量化值 → 整数样本值 → 二进制 PCM", "zh-Hant": traditional("模拟值 → 量化值 → 整数样本值 → 二进制 PCM"), en: "Analog value → Quantized value → Integer sample → Binary PCM", ja: "アナログ値 → 量子化値 → 整数サンプル値 → バイナリ PCM", ko: "아날로그 값 → 양자화 값 → 정수 샘플값 → 이진 PCM" },
  sample: { zh: "采样", "zh-Hant": traditional("采样"), en: "Sample", ja: "サンプル", ko: "샘플" },
  quantized: { zh: "量化值", "zh-Hant": traditional("量化值"), en: "Quantized", ja: "量子化値", ko: "양자화 값" },
  integerSample: { zh: "整数样本值", "zh-Hant": traditional("整数样本值"), en: "Integer sample", ja: "整数サンプル値", ko: "정수 샘플값" },
  pcmBitrate: { zh: "PCM 码率 = 采样率 × 位深 × 声道数", "zh-Hant": traditional("PCM 码率 = 采样率 × 位深 × 声道数"), en: "PCM bitrate = sample rate × bit depth × channels", ja: "PCM ビットレート = サンプルレート × ビット深度 × チャンネル数", ko: "PCM 비트레이트 = 샘플레이트 × 비트 깊이 × 채널 수" },
  pcmBitrateExample: { zh: "48 kHz × 16-bit × 2 声道 = 1536 kbps", "zh-Hant": traditional("48 kHz × 16-bit × 2 声道 = 1536 kbps"), en: "48 kHz × 16-bit × 2 channels = 1536 kbps", ja: "48 kHz × 16-bit × 2 チャンネル = 1536 kbps", ko: "48 kHz × 16-bit × 2채널 = 1536 kbps" },
  wavRelationAria: { zh: "PCM 和 WAV 关系", "zh-Hant": traditional("PCM 和 WAV 关系"), en: "PCM and WAV relationship", ja: "PCM と WAV の関係", ko: "PCM과 WAV의 관계" },
  howWav: { zh: "PCM 如何变成 WAV", "zh-Hant": traditional("PCM 如何变成 WAV"), en: "How PCM becomes WAV", ja: "PCM が WAV になるまで", ko: "PCM이 WAV가 되는 과정" },
  wavHeaderDetails: { zh: "采样率 / 位深 / 声道数 / 数据长度", "zh-Hant": traditional("采样率 / 位深 / 声道数 / 数据长度"), en: "Sample rate / bit depth / channels / data length", ja: "サンプルレート / ビット深度 / チャンネル数 / データ長", ko: "샘플레이트 / 비트 깊이 / 채널 수 / 데이터 길이" },
  wavSampleWords: { zh: "按时间顺序排列的采样字", "zh-Hant": traditional("按时间顺序排列的采样字"), en: "Sample words ordered in time", ja: "時間順に並んだサンプルワード", ko: "시간 순서로 배열된 샘플 워드" },
  wavNote: { zh: "这里关注封装关系：文件头描述参数，PCM Data 保存样本。", "zh-Hant": traditional("这里关注封装关系：文件头描述参数，PCM Data 保存样本。"), en: "This view focuses on the container relationship: the header describes parameters and PCM Data stores samples.", ja: "ここではコンテナーの関係に注目します。ヘッダーがパラメーターを記述し、PCM Data がサンプルを保存します。", ko: "여기서는 컨테이너 관계를 살펴봅니다. 헤더가 파라미터를 설명하고 PCM Data가 샘플을 저장합니다." }
} satisfies Record<string, LocalizedText>;

function localized(language: Language, copy: LocalizedText) {
  return copy[language];
}

function inputFrequencyCopy(language: Language, frequency: number) {
  return localized(language, {
    zh: `输入频率：${frequency} 个周期`, "zh-Hant": traditional(`输入频率：${frequency} 个周期`),
    en: `Input frequency: ${frequency} cycles`,
    ja: `入力周波数：${frequency} 周期`,
    ko: `입력 주파수: ${frequency}주기`
  });
}

function bitDepthGuideCopy(language: Language, bitDepth: number, levelCount: number) {
  return localized(language, {
    zh: `${bitDepth}-bit：${levelCount} 个幅度等级`, "zh-Hant": traditional(`${bitDepth}-bit：${levelCount} 个幅度等级`),
    en: `${bitDepth}-bit: ${levelCount} amplitude levels`,
    ja: `${bitDepth}-bit：${levelCount} 段階の振幅レベル`,
    ko: `${bitDepth}-bit: 진폭 레벨 ${levelCount}개`
  });
}

function liveSamplingCopy(language: Language, intervals: string, undersampled: boolean) {
  return localized(language, {
    zh: `每周期 ${intervals} 个采样间隔（区间含首尾两个端点）。${undersampled ? "当前未满足严格大于两倍的采样条件，采样点不能唯一确定原波形。" : "当前单音满足大于两倍的采样条件；点间折线仍不等于理想重建。"}`, "zh-Hant": traditional(`每周期 ${intervals} 个采样间隔（区间含首尾两个端点）。${undersampled ? "当前未满足严格大于两倍的采样条件，采样点不能唯一确定原波形。" : "当前单音满足大于两倍的采样条件；点间折线仍不等于理想重建。"}`),
    en: `${intervals} sampling intervals per cycle (both interval endpoints included). ${undersampled ? "Sampling is not strictly above twice the tone frequency; samples do not uniquely identify the input." : "This tone is sampled above twice its frequency; connecting dots still is not ideal reconstruction."}`,
    ja: `1周期あたり ${intervals} サンプル間隔（区間の両端点を含みます）。${undersampled ? "サンプリング周波数は音の周波数の2倍を厳密には上回っておらず、サンプルだけでは元の波形を一意に定められません。" : "この音は周波数の2倍を上回ってサンプリングされていますが、点を結んだ線は理想的な再構成ではありません。"}`,
    ko: `주기당 ${intervals}개 샘플 간격(구간의 양 끝점을 포함).${undersampled ? " 샘플링이 음 주파수의 2배를 엄격히 초과하지 않아 샘플만으로 입력을 유일하게 정할 수 없습니다." : " 이 음은 주파수의 2배를 초과해 샘플링되지만 점을 이은 선이 이상적인 재구성은 아닙니다."}`
  });
}

function liveBitDepthCopy(language: Language, bitDepth: number, levelCount: number) {
  return localized(language, {
    zh: `采样点数量越少，越容易漏掉快速变化；位深决定纵向幅度等级，${bitDepth}-bit 时有 ${levelCount} 个幅度等级。输入频率不会改变位深本身，但会改变采样点落在哪些等级上，所以量化阶梯和误差也会随之变化。`, "zh-Hant": traditional(`采样点数量越少，越容易漏掉快速变化；位深决定纵向幅度等级，${bitDepth}-bit 时有 ${levelCount} 个幅度等级。输入频率不会改变位深本身，但会改变采样点落在哪些等级上，所以量化阶梯和误差也会随之变化。`),
    en: `Fewer samples miss fast changes more easily; bit depth sets vertical amplitude levels, and ${bitDepth}-bit gives ${levelCount} levels. Input frequency does not change bit depth itself, but it changes which levels the samples land on, so the steps and error change too.`,
    ja: `サンプル点が少ないほど速い変化を取りこぼしやすくなります。ビット深度が振幅方向のレベル数を決め、${bitDepth}-bit では ${levelCount} 段階になります。入力周波数はビット深度自体を変えませんが、サンプルがどのレベルに落ちるかを変えるため、量子化ステップと誤差も変化します。`,
    ko: `샘플 지점이 적을수록 빠른 변화를 놓치기 쉽습니다. 비트 깊이가 진폭 방향 레벨 수를 정하며 ${bitDepth}-bit에서는 ${levelCount}개입니다. 입력 주파수는 비트 깊이 자체를 바꾸지 않지만 샘플이 어느 레벨에 놓이는지를 바꾸므로 계단과 오차도 달라집니다.`
  });
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function createAnalogValue(xRatio: number, frequency: number) {
  return Math.sin(xRatio * Math.PI * 2 * frequency);
}

export function quantize(value: number, bitDepth: number) {
  const levels = 2 ** bitDepth;
  const normalized = (value + 1) / 2;
  const quantizedIndex = Math.round(clamp(normalized, 0, 1) * (levels - 1));
  return (quantizedIndex / (levels - 1)) * 2 - 1;
}

function toPcmInteger(value: number, bitDepth: number) {
  const levels = 2 ** bitDepth;
  return Math.round(((value + 1) / 2) * (levels - 1));
}

function toBinaryWord(value: number, bitDepth: number) {
  return value.toString(2).padStart(bitDepth, "0");
}

function createAnalogPath(frequency: number) {
  const points = Array.from({ length: 241 }, (_, index) => {
    const ratio = index / 240;
    const x = 36 + ratio * 688;
    const y = 170 - createAnalogValue(ratio, frequency) * 94;
    return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
  });

  return points.join(" ");
}

export function createSamplePoints(sampleCount: number, bitDepth: number, frequency: number) {
  return Array.from({ length: sampleCount }, (_, index) => {
    const ratio = sampleCount === 1 ? 0 : index / (sampleCount - 1);
    const analogValue = createAnalogValue(ratio, frequency);
    const quantizedValue = quantize(analogValue, bitDepth);
    const pcmInteger = toPcmInteger(quantizedValue, bitDepth);
    return {
      analogY: 170 - analogValue * 94,
      errorY: 170 - (analogValue - quantizedValue) * 180,
      pcmBinary: toBinaryWord(pcmInteger, bitDepth),
      pcmInteger,
      quantizedY: 170 - quantizedValue * 94,
      quantizedValue,
      x: 36 + ratio * 688
    };
  });
}

function createQuantizationLevelLines(bitDepth: number) {
  const levels = 2 ** bitDepth;

  return Array.from({ length: levels }, (_, index) => {
    const value = levels === 1 ? 0 : (index / (levels - 1)) * 2 - 1;

    return {
      index,
      isReference: index === 0 || index === levels - 1 || Math.abs(value) < 0.0001,
      value,
      y: 170 - value * 94
    };
  });
}

function createSteppedPath(points: ReturnType<typeof createSamplePoints>) {
  if (!points.length) {
    return "";
  }

  const commands = [`M ${points[0].x.toFixed(2)} ${points[0].quantizedY.toFixed(2)}`];
  points.slice(1).forEach((point, index) => {
    const previous = points[index];
    const midX = (previous.x + point.x) / 2;
    commands.push(`H ${midX.toFixed(2)}`);
    commands.push(`V ${point.quantizedY.toFixed(2)}`);
    commands.push(`H ${point.x.toFixed(2)}`);
  });

  return commands.join(" ");
}

function createErrorPath(points: ReturnType<typeof createSamplePoints>) {
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.errorY.toFixed(2)}`)
    .join(" ");
}

export function DigitalAudioLab({ language, onBack, onBackToDetails, initialDirection = "adc" }: DigitalAudioLabProps) {
  const [direction, setDirection] = useState(initialDirection);
  const [sampleCount, setSampleCount] = useState(24);
  const [bitDepth, setBitDepth] = useState(4);
  const [frequency, setFrequency] = useState(2);
  const [displayMode, setDisplayMode] = useState<DisplayMode>("quantized");

  const analogPath = useMemo(() => createAnalogPath(frequency), [frequency]);
  const quantizationLevelLines = useMemo(() => createQuantizationLevelLines(bitDepth), [bitDepth]);
  const samplePoints = useMemo(
    () => createSamplePoints(sampleCount, bitDepth, frequency),
    [bitDepth, frequency, sampleCount]
  );
  const steppedPath = useMemo(() => createSteppedPath(samplePoints), [samplePoints]);
  const errorPath = useMemo(() => createErrorPath(samplePoints), [samplePoints]);
  const quantizationLevelCount = 2 ** bitDepth;
  const maxError = Math.max(...samplePoints.map(point => Math.abs((170 - point.analogY) / 94 - point.quantizedValue)));
  const pcmPreview = samplePoints.slice(0, 5);
  const showSamples = displayMode === "samples" || displayMode === "quantized" || displayMode === "pcm";
  const showQuantized = displayMode === "quantized" || displayMode === "pcm";
  const showError = displayMode === "error";
  const showBitDepthGuide = displayMode === "samples" || displayMode === "quantized" || displayMode === "pcm" || displayMode === "error";

  return (
    <main className="digital-lab-page">
      <section className="sound-lab-hero" aria-labelledby="digital-lab-title">
        <div className="sound-lab-back-actions">
          <button className="sound-lab-back sound-lab-back-secondary" type="button" onClick={onBack}>
            {digitalAudioCopy.backKnowledge[language]}
          </button>
          {onBackToDetails ? <button className="sound-lab-back" type="button" onClick={onBackToDetails}>
            <ArrowLeft size={18} aria-hidden="true" />
            {digitalAudioCopy.backGuide[language]}
          </button> : null}
        </div>
        <div>
          <span className="section-kicker">
            {digitalAudioCopy.kicker[language]}
          </span>
          <h1 id="digital-lab-title">
            {digitalAudioCopy.title[language]}
          </h1>
          <p>
            {digitalAudioCopy.description[language]}
          </p>
        </div>
      </section>

      <div className="waveform-tabs digital-conversion-tabs" role="group" aria-label="ADC / DAC">
        {(["adc", "dac"] as const).map(mode => <button key={mode} type="button" className={direction === mode ? "waveform-tab active" : "waveform-tab"} aria-pressed={direction === mode} onClick={() => setDirection(mode)}>{mode === "adc" ? "ADC · Analog → PCM" : "DAC · PCM → Analog"}</button>)}
      </div>
      {direction === "dac" ? <DacReconstruction language={language} values={samplePoints.map(point => point.quantizedValue)} codes={samplePoints.map(point => point.pcmInteger)} bitDepth={bitDepth} /> : <>
      <section
        aria-label={digitalAudioCopy.workbench[language]}
        className="digital-lab-workbench"
      >
        <div className="digital-lab-visual">
          <p>{digitalAudioCopy.simulation[language]}</p>
          <div className="digital-lab-status">
            <strong>{digitalAudioCopy.displayModePrefix[language]}{modeLabels[displayMode][language]}</strong>
            <span>{inputFrequencyCopy(language, frequency)}</span>
          </div>
          <svg
            aria-label={digitalAudioCopy.diagramAria[language]}
            role="img"
            viewBox="0 0 760 360"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="digitalAnalogLine" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#7ee7d8" />
                <stop offset="100%" stopColor="#f0b46a" />
              </linearGradient>
            </defs>
            <rect className="lab-diagram-bg" height="360" rx="14" width="760" />
            <line className="lab-axis" x1="36" x2="724" y1="170" y2="170" />
            <line className="lab-axis faint" x1="36" x2="724" y1="76" y2="76" />
            <line className="lab-axis faint" x1="36" x2="724" y1="264" y2="264" />
            <text className="lab-label" x="46" y="46">{digitalAudioCopy.analogWaveform[language]}</text>
            {showBitDepthGuide ? (
              <g
                aria-label={digitalAudioCopy.bitDepthGuide[language]}
                className="digital-bit-depth-guide"
                data-testid="digital-bit-depth-guide"
              >
                {quantizationLevelLines.map((level) => (
                  <line
                    className={level.isReference ? "reference" : undefined}
                    data-testid="digital-bit-depth-level"
                    key={level.index}
                    x1="36"
                    x2="724"
                    y1={level.y.toFixed(2)}
                    y2={level.y.toFixed(2)}
                  />
                ))}
                <text className="digital-bit-depth-caption" x="552" y="62">
                  {bitDepthGuideCopy(language, bitDepth, quantizationLevelCount)}
                </text>
              </g>
            ) : null}
            <path className="digital-analog-path" d={analogPath} />
            {showQuantized ? <path className="digital-step-path" data-testid="digital-step-path" d={steppedPath} /> : null}
            {showError ? <path className="digital-error-path" d={errorPath} /> : null}
            {showSamples
              ? samplePoints.map((point) => (
                  <g key={`${point.x}-${point.quantizedY}`}>
                    <line className="digital-sample-stem" x1={point.x} x2={point.x} y1="170" y2={point.quantizedY} />
                    <circle className="digital-sample-dot" cx={point.x} cy={point.analogY} r="4.5" />
                    <circle className="digital-quantized-dot" cx={point.x} cy={point.quantizedY} r="4" />
                  </g>
                ))
              : null}
            {showError ? (
              <text className="lab-chip" x="724" y="316" textAnchor="end">
                {digitalAudioCopy.errorDefinition[language]}
              </text>
            ) : (
              <text className="lab-chip" x="724" y="316" textAnchor="end">
                {digitalAudioCopy.moreSamples[language]}
              </text>
            )}
          </svg>
        </div>

        <div className="digital-lab-panel">
          <div className="waveform-tabs" role="group" aria-label={digitalAudioCopy.displayMode[language]}>
            {(Object.keys(modeLabels) as DisplayMode[]).map((mode) => (
              <button
                className={displayMode === mode ? "waveform-tab active" : "waveform-tab"}
                key={mode}
                type="button"
                aria-pressed={displayMode === mode}
                onClick={() => setDisplayMode(mode)}
              >
                {modeLabels[mode][language]}
              </button>
            ))}
          </div>

          <div className="lab-sliders">
            <label>
              <span>
                {digitalAudioCopy.sampleCount[language]}
                <strong>{sampleCount}</strong>
              </span>
              <input
                aria-label={digitalAudioCopy.sampleCount[language]}
                max="48"
                min="8"
                step="4"
                type="range"
                value={sampleCount}
                onChange={(event) => setSampleCount(Number(event.target.value))}
              />
            </label>
            <label>
              <span>
                {digitalAudioCopy.bitDepth[language]}
                <strong>{bitDepth}-bit</strong>
              </span>
              <input
                aria-label={digitalAudioCopy.bitDepth[language]}
                max="8"
                min="2"
                step="1"
                type="range"
                value={bitDepth}
                onChange={(event) => setBitDepth(Number(event.target.value))}
              />
            </label>
            <label>
              <span>
                {digitalAudioCopy.inputFrequency[language]}
                <strong>{frequency}</strong>
              </span>
              <input
                aria-label={digitalAudioCopy.inputFrequency[language]}
                max="7"
                min="1"
                step="1"
                type="range"
                value={frequency}
                onChange={(event) => setFrequency(Number(event.target.value))}
              />
            </label>
          </div>

          <div className="digital-lab-metrics">
            <strong>{localized(language, {
              zh: `当前采样点：${sampleCount} 个`, "zh-Hant": traditional(`当前采样点：${sampleCount} 个`),
              en: `Current samples: ${sampleCount}`,
              ja: `現在のサンプル数：${sampleCount}`,
              ko: `현재 샘플 수: ${sampleCount}`
            })}</strong>
            <strong>{localized(language, {
              zh: `当前量化等级：${quantizationLevelCount} 级`, "zh-Hant": traditional(`当前量化等级：${quantizationLevelCount} 级`),
              en: `Quantization levels: ${quantizationLevelCount}`,
              ja: `現在の量子化レベル数：${quantizationLevelCount}`,
              ko: `현재 양자화 레벨: ${quantizationLevelCount}`
            })}</strong>
            <span>{digitalAudioCopy.maximumError[language]}: {maxError.toFixed(4)} / {digitalAudioCopy.theoreticalBound[language]}: {(1 / (quantizationLevelCount - 1)).toFixed(4)}</span>
          </div>

          <div className="lab-live-note">
            <p>{liveSamplingCopy(language, ((sampleCount - 1) / frequency).toFixed(2), sampleCount - 1 <= 2 * frequency)}</p>
            {liveBitDepthCopy(language, bitDepth, quantizationLevelCount)}
          </div>
        </div>
      </section>

      <section className="pcm-encoding-section" aria-label={digitalAudioCopy.pcmSectionAria[language]}>
        <div className="section-heading">
          <div>
            <span className="section-kicker">PCM</span>
            <h2>{digitalAudioCopy.howPcm[language]}</h2>
          </div>
        </div>
        <p className="pcm-flow">
          {digitalAudioCopy.pcmFlow[language]}
        </p>
        <div className="pcm-word-grid">
          {pcmPreview.map((point, index) => (
            <article key={`${point.x}-${point.pcmBinary}`} className="pcm-word-card">
              <strong>{digitalAudioCopy.sample[language]} #{index + 1}</strong>
              <span>{digitalAudioCopy.quantized[language]}: {point.quantizedValue.toFixed(3)}</span>
              <span>{digitalAudioCopy.integerSample[language]}: {point.pcmInteger}</span>
              <code>{point.pcmBinary}</code>
            </article>
          ))}
        </div>
        <div className="pcm-formula-card">
          <strong>{digitalAudioCopy.pcmBitrate[language]}</strong>
          <span>{digitalAudioCopy.pcmBitrateExample[language]}</span>
        </div>
      </section>

      <section className="wav-container-section" aria-label={digitalAudioCopy.wavRelationAria[language]}>
        <div className="section-heading">
          <div>
            <span className="section-kicker">WAV</span>
            <h2>{digitalAudioCopy.howWav[language]}</h2>
          </div>
        </div>
        <div className="wav-container-card">
          <div className="wav-header-box">
            <strong>RIFF / WAVE Header</strong>
            <span>{digitalAudioCopy.wavHeaderDetails[language]}</span>
          </div>
          <div className="wav-plus">+</div>
          <div className="wav-data-box">
            <strong>PCM Data</strong>
            <span>{digitalAudioCopy.wavSampleWords[language]}</span>
          </div>
        </div>
        <p className="codec-note">
          {digitalAudioCopy.wavNote[language]}
        </p>
      </section>
      </>}
    </main>
  );
}
