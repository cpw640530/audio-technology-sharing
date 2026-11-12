import { traditional } from "../content/traditional";
import { createDistortionCurve, distortionSample, getDistortionHarmonics } from "./listeningDistortionModel";
import { text } from "../content/language";
import { toneComponents, toneResponse, toneSample } from "./listeningToneModel";
import { useLabState } from "../hooks/useLabState";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Pause, Play } from "lucide-react";
import type { Language, LocalizedText } from "../content/knowledge";

type ListeningMetricsLabProps = {
  language: Language;
  onBack: () => void;
  onBackToDetails?: () => void;
};

type ListeningEffect = "brightness" | "muddy" | "noise" | "distortion" | "compression" | "stereo";

type EffectCopy = {
  label: LocalizedText;
  metric: LocalizedText;
  description: LocalizedText;
  hearing: LocalizedText;
};

type ActiveAudioGraph = {
  context: AudioContext;
  effect: ListeningEffect;
  filter: BiquadFilterNode;
  outputGain: GainNode;
  shaper?: WaveShaperNode;
  compressor?: DynamicsCompressorNode;
  panner?: StereoPannerNode | null;
  noiseGain?: GainNode;
};

type HarmonicComponent = {
  gain: number;
  order: number;
  phase: number;
};

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

const effectCopy: Record<ListeningEffect, EffectCopy> = {
  brightness: {
    label: { zh: "明亮高频", "zh-Hant": traditional("明亮高频"), en: "Bright treble", ja: "明るい高域", ko: "밝은 고역" },
    metric: { zh: "频响曲线", "zh-Hant": traditional("频响曲线"), en: "Frequency response curve", ja: "周波数特性曲線", ko: "주파수 응답 곡선" },
    description: {
      zh: "明亮：提升高频能量，声音会更清晰、更靠前，但过强会刺耳。", "zh-Hant": traditional("明亮：提升高频能量，声音会更清晰、更靠前，但过强会刺耳。"),
      en: "Brightness: boosting treble makes sound clearer and more forward, but too much becomes harsh.",
      ja: "明るさ：高域のエネルギーを上げると音は明瞭で前に出ますが、強すぎると刺さります。",
      ko: "밝기: 고역 에너지를 높이면 소리가 더 선명하고 앞으로 나오지만 너무 강하면 자극적입니다."
    },
    hearing: {
      zh: "听感重点：齿音、空气感、清晰度。", "zh-Hant": traditional("听感重点：齿音、空气感、清晰度。"),
      en: "Listen for: sibilance, air, and clarity.",
      ja: "聴くポイント：歯擦音、空気感、明瞭度。",
      ko: "청취 포인트: 치찰음, 공기감과 선명도."
    }
  },
  muddy: {
    label: { zh: "浑浊低中频", "zh-Hant": traditional("浑浊低中频"), en: "Muddy low mids", ja: "こもった低中域", ko: "탁한 저중역" },
    metric: { zh: "频响曲线", "zh-Hant": traditional("频响曲线"), en: "Frequency response curve", ja: "周波数特性曲線", ko: "주파수 응답 곡선" },
    description: {
      zh: "浑浊：低频和低中频堆积，声音会变厚但不清楚。", "zh-Hant": traditional("浑浊：低频和低中频堆积，声音会变厚但不清楚。"),
      en: "Muddiness: bass and low-mid buildup makes sound thicker but less clear.",
      ja: "こもり：低域と低中域が積み重なり、音は厚くなりますが不明瞭になります。",
      ko: "탁함: 저역과 저중역이 쌓이면 소리가 두꺼워지지만 선명하지 않게 됩니다."
    },
    hearing: {
      zh: "听感重点：低频轰鸣、人声被盖住。", "zh-Hant": traditional("听感重点：低频轰鸣、人声被盖住。"),
      en: "Listen for: boominess and covered vocals.",
      ja: "聴くポイント：低域のこもり、人声の埋もれ。",
      ko: "청취 포인트: 저역의 웅웅거림과 묻히는 보컬."
    }
  },
  noise: {
    label: { zh: "噪声底噪", "zh-Hant": traditional("噪声底噪"), en: "Noise floor", ja: "ノイズフロア", ko: "노이즈 플로어" },
    metric: { zh: "SNR", "zh-Hant": traditional("SNR"), en: "SNR", ja: "SNR", ko: "SNR" },
    description: {
      zh: "底噪：在信号下方加入持续噪声，SNR 变低时安静段更容易听到嘶声。", "zh-Hant": traditional("底噪：在信号下方加入持续噪声，SNR 变低时安静段更容易听到嘶声。"),
      en: "Noise floor: adding steady noise lowers SNR, making hiss obvious in quiet parts.",
      ja: "ノイズフロア：信号の下に一定のノイズを加えます。SNR が低いほど静かな部分でヒスが目立ちます。",
      ko: "노이즈 플로어: 신호 아래에 지속적인 잡음을 더합니다. SNR이 낮아지면 조용한 구간에서 히스가 더 잘 들립니다."
    },
    hearing: {
      zh: "听感重点：嘶声、电流声、安静处不干净。", "zh-Hant": traditional("听感重点：嘶声、电流声、安静处不干净。"),
      en: "Listen for: hiss, electrical noise, and dirty quiet parts.",
      ja: "聴くポイント：ヒス、電気ノイズ、静かな部分の汚れ。",
      ko: "청취 포인트: 히스, 전기 잡음과 조용한 구간의 불결한 소리."
    }
  },
  distortion: {
    label: { zh: "谐波失真", "zh-Hant": traditional("谐波失真"), en: "Harmonic distortion", ja: "高調波歪み", ko: "고조파 왜곡" },
    metric: { zh: "THD / THD+N", "zh-Hant": traditional("THD / THD+N"), en: "THD / THD+N", ja: "THD / THD+N", ko: "THD / THD+N" },
    description: {
      zh: "失真：非线性会在基波外生成谐波；本演示随驱动逐步加入高阶分量，实际分布取决于具体非线性。", "zh-Hant": traditional("失真：非线性会在基波外生成谐波；本演示随驱动逐步加入高阶分量，实际分布取决于具体非线性。"),
      en: "Distortion: nonlinearity creates harmonics beyond the fundamental. This demo adds higher orders with drive; real distributions depend on the nonlinearity.",
      ja: "歪み：非線形性は基音以外に高調波を生みます。このデモではドライブに応じて高次成分を加えますが、実際の分布は非線形性に依存します。",
      ko: "왜곡: 비선형성은 기본파 외에 고조파를 만듭니다. 이 데모는 드라이브에 따라 고차 성분을 추가하며 실제 분포는 구체적인 비선형성에 따라 달라집니다."
    },
    hearing: {
      zh: "听感重点：温暖感、毛刺、破音、边缘变粗。", "zh-Hant": traditional("听感重点：温暖感、毛刺、破音、边缘变粗。"),
      en: "Listen for: warmth, grit, clipping, and rough edges.",
      ja: "聴くポイント：温かさ、ざらつき、クリップ、音の縁の粗さ。",
      ko: "청취 포인트: 따뜻함, 거친 질감, 클리핑과 거친 가장자리."
    }
  },
  compression: {
    label: { zh: "动态压缩", "zh-Hant": traditional("动态压缩"), en: "Dynamic compression", ja: "ダイナミックコンプレッション", ko: "다이내믹 압축" },
    metric: { zh: "动态范围 / LUFS", "zh-Hant": traditional("动态范围 / LUFS"), en: "Dynamic range / LUFS", ja: "ダイナミックレンジ / LUFS", ko: "다이내믹 레인지 / LUFS" },
    description: {
      zh: "动态压缩：降低超过阈值的电平；本演示再加入补偿增益，听起来更稳定，但瞬态和强弱对比会减少。", "zh-Hant": traditional("动态压缩：降低超过阈值的电平；本演示再加入补偿增益，听起来更稳定，但瞬态和强弱对比会减少。"),
      en: "Compression reduces levels above a threshold. This demo then adds makeup gain, sounding steadier while reducing transient and level contrast.",
      ja: "ダイナミックコンプレッション：しきい値を超えるレベルを下げます。このデモではメイクアップゲインも加えるため音は安定しますが、トランジェントと強弱差は減ります。",
      ko: "다이내믹 압축: 임계값을 초과하는 레벨을 낮춥니다. 이 데모는 메이크업 게인도 추가하므로 소리가 안정되지만 트랜지언트와 강약 대비가 줄어듭니다."
    },
    hearing: {
      zh: "听感重点：声音更贴脸，起伏和瞬态减少。", "zh-Hant": traditional("听感重点：声音更贴脸，起伏和瞬态减少。"),
      en: "Listen for: forward loudness with reduced movement and transients.",
      ja: "聴くポイント：前に出る音量感、減少する起伏とトランジェント。",
      ko: "청취 포인트: 앞으로 나오는 음량감, 줄어드는 움직임과 트랜지언트."
    }
  },
  stereo: {
    label: { zh: "声像偏移", "zh-Hant": traditional("声像偏移"), en: "Stereo shift", ja: "音像の移動", ko: "스테레오 이동" },
    metric: { zh: "串扰 / 相位 / 声像", "zh-Hant": traditional("串扰 / 相位 / 声像"), en: "Crosstalk / phase / stereo image", ja: "クロストーク / 位相 / 音像", ko: "크로스토크 / 위상 / 스테레오 이미지" },
    description: {
      zh: "声像偏移：左右声道电平或时间差会让声音从中心移动到一侧。", "zh-Hant": traditional("声像偏移：左右声道电平或时间差会让声音从中心移动到一侧。"),
      en: "Stereo shift: level or timing differences move sound away from the center.",
      ja: "音像の移動：左右チャンネルのレベル差や時間差によって、音が中央から片側へ移動します。",
      ko: "스테레오 이동: 좌우 채널의 레벨 차이나 시간 차이가 소리를 중앙에서 한쪽으로 이동시킵니다."
    },
    hearing: {
      zh: "听感重点：中心是否偏左或偏右，空间是否稳定。", "zh-Hant": traditional("听感重点：中心是否偏左或偏右，空间是否稳定。"),
      en: "Listen for: whether the center pulls left or right and whether space stays stable.",
      ja: "聴くポイント：中央が左または右へ寄るか、空間が安定しているか。",
      ko: "청취 포인트: 중앙이 왼쪽이나 오른쪽으로 끌리는지, 공간이 안정적인지."
    }
  }
};

const listeningLabCopy = {
  low: { zh: "低频", "zh-Hant": traditional("低频"), en: "Low", ja: "低域", ko: "저역" },
  mid: { zh: "中频", "zh-Hant": traditional("中频"), en: "Mid", ja: "中域", ko: "중역" },
  high: { zh: "高频", "zh-Hant": traditional("高频"), en: "High", ja: "高域", ko: "고역" },
  xFrequency: { zh: "横轴：频率", "zh-Hant": traditional("横轴：频率"), en: "X: frequency", ja: "X：周波数", ko: "X: 주파수" },
  yGain: { zh: "纵轴：增益 dB", "zh-Hant": traditional("纵轴：增益 dB"), en: "Y: gain dB", ja: "Y：ゲイン dB", ko: "Y: 게인 dB" },
  xTime: { zh: "横轴：时间", "zh-Hant": traditional("横轴：时间"), en: "X: time", ja: "X：時間", ko: "X: 시간" },
  yAmplitude: { zh: "纵轴：幅度", "zh-Hant": traditional("纵轴：幅度"), en: "Y: amplitude", ja: "Y：振幅", ko: "Y: 진폭" },
  cleanSignal: { zh: "纯净信号", "zh-Hant": traditional("纯净信号"), en: "Clean signal", ja: "クリーン信号", ko: "깨끗한 신호" },
  signalNoise: { zh: "信号 + 噪声", "zh-Hant": traditional("信号 + 噪声"), en: "Signal + noise", ja: "信号 + ノイズ", ko: "신호 + 잡음" },
  noiseFloor: { zh: "噪声底", "zh-Hant": traditional("噪声底"), en: "Noise floor", ja: "ノイズフロア", ko: "노이즈 플로어" },
  inputWaveform: { zh: "输入波形", "zh-Hant": traditional("输入波形"), en: "Input waveform", ja: "入力波形", ko: "입력 파형" },
  compressedWaveform: { zh: "压缩后波形", "zh-Hant": traditional("压缩后波形"), en: "Compressed waveform", ja: "圧縮後の波形", ko: "압축 후 파형" },
  threshold: { zh: "阈值", "zh-Hant": traditional("阈值"), en: "Threshold", ja: "しきい値", ko: "임계값" },
  gainReduction: { zh: "增益衰减", "zh-Hant": traditional("增益衰减"), en: "Gain reduction", ja: "ゲインリダクション", ko: "게인 리덕션" },
  panCenterRight: { zh: "声像：中心 → 右侧", "zh-Hant": traditional("声像：中心 → 右侧"), en: "Pan: center → right", ja: "パン：中央 → 右", ko: "팬: 중앙 → 오른쪽" },
  cleanFundamental: { zh: "纯净基波输入", "zh-Hant": traditional("纯净基波输入"), en: "Clean fundamental input", ja: "クリーンな基音入力", ko: "깨끗한 기본파 입력" },
  harmonicSum: { zh: "基波 + 谐波叠加输出", "zh-Hant": traditional("基波 + 谐波叠加输出"), en: "Fundamental + harmonic sum", ja: "基音 + 高調波の合成出力", ko: "기본파 + 고조파 합산 출력" },
  harmonicComponents: { zh: "谐波分量拆解", "zh-Hant": traditional("谐波分量拆解"), en: "Harmonic components", ja: "高調波成分の分解", ko: "고조파 성분 분해" },
  cleanWave: { zh: "原始波形", "zh-Hant": traditional("原始波形"), en: "Clean wave", ja: "元の波形", ko: "원래 파형" },
  trebleBoosted: { zh: "高频提升后", "zh-Hant": traditional("高频提升后"), en: "Treble boosted", ja: "高域ブースト後", ko: "고역 부스트 후" },
  lowMidBuildup: { zh: "低中频堆积后", "zh-Hant": traditional("低中频堆积后"), en: "Low-mid buildup", ja: "低中域の積み上げ後", ko: "저중역 축적 후" },
  trebleZone: { zh: "高频提升区", "zh-Hant": traditional("高频提升区"), en: "Treble boost zone", ja: "高域ブースト領域", ko: "고역 부스트 영역" },
  lowMidZone: { zh: "低中频堆积区", "zh-Hant": traditional("低中频堆积区"), en: "Low-mid buildup zone", ja: "低中域の積み上げ領域", ko: "저중역 축적 영역" },
  snrChartAria: { zh: "SNR 良好与较差波形对比图", "zh-Hant": traditional("SNR 良好与较差波形对比图"), en: "Good and poor SNR waveform comparison", ja: "良好な SNR と低い SNR の波形比較", ko: "좋은 SNR과 나쁜 SNR 파형 비교" },
  goodSnr: { zh: "SNR 良好：信号明显高于噪声底", "zh-Hant": traditional("SNR 良好：信号明显高于噪声底"), en: "Good SNR: signal sits clearly above noise", ja: "良好な SNR：信号がノイズフロアを明確に上回る", ko: "좋은 SNR: 신호가 노이즈 플로어보다 뚜렷하게 높음" },
  poorSnr: { zh: "SNR 较差：噪声底接近有效信号", "zh-Hant": traditional("SNR 较差：噪声底接近有效信号"), en: "Poor SNR: noise floor approaches signal", ja: "低い SNR：ノイズフロアが有効信号に近い", ko: "나쁜 SNR: 노이즈 플로어가 신호에 가까움" },
  lowFloor: { zh: "底噪低，安静段更干净", "zh-Hant": traditional("底噪低，安静段更干净"), en: "Low floor, cleaner quiet parts", ja: "ノイズフロアが低く、静かな部分がきれい", ko: "노이즈 플로어가 낮아 조용한 구간이 더 깨끗함" },
  highFloor: { zh: "底噪高，嘶声更明显", "zh-Hant": traditional("底噪高，嘶声更明显"), en: "High floor, hiss is obvious", ja: "ノイズフロアが高く、ヒスが目立つ", ko: "노이즈 플로어가 높아 히스가 뚜렷함" },
  distortionAxis: { zh: "时间 / 幅度（下方为谐波阶次）", "zh-Hant": traditional("时间 / 幅度（下方为谐波阶次）"), en: "Time / amplitude (harmonic order below)", ja: "時間 / 振幅（下段は高調波次数）", ko: "시간 / 진폭(아래는 고조파 차수)" },
  frequencyAxis: { zh: "低频 → 高频", "zh-Hant": traditional("低频 → 高频"), en: "Low → high", ja: "低域 → 高域", ko: "저역 → 고역" },
  stereoAxis: { zh: "时间 / 左右声道", "zh-Hant": traditional("时间 / 左右声道"), en: "Time / left-right channels", ja: "時間 / 左右チャンネル", ko: "시간 / 좌우 채널" },
  amplitudeAxis: { zh: "时间 / 幅度", "zh-Hant": traditional("时间 / 幅度"), en: "Time / amplitude", ja: "時間 / 振幅", ko: "시간 / 진폭" },
  backKnowledge: { zh: "返回知识库", "zh-Hant": traditional("返回知识库"), en: "Back to knowledge base", ja: "知識ベースに戻る", ko: "지식 베이스로 돌아가기" },
  backGuide: { zh: "返回详细内容", "zh-Hant": traditional("返回详细内容"), en: "Back to detailed guide", ja: "詳細ガイドに戻る", ko: "상세 가이드로 돌아가기" },
  kicker: { zh: "听感实验", "zh-Hant": traditional("听感实验"), en: "Listening lab", ja: "聴感ラボ", ko: "청감 실험실" },
  title: { zh: "听感与指标实验室", "zh-Hant": traditional("听感与指标实验室"), en: "Listening Metrics Lab", ja: "聴感と指標ラボ", ko: "청감과 지표 실험실" },
  metricPrefix: { zh: "指标：", "zh-Hant": traditional("指标："), en: "Metric: ", ja: "指標：", ko: "지표: " },
  intensityPrefix: { zh: "效果强度：", "zh-Hant": traditional("效果强度："), en: "Effect intensity: ", ja: "効果の強さ：", ko: "효과 강도: " },
  description: { zh: "比较原始与处理后的声音，对照曲线观察效果强度带来的变化。", "zh-Hant": traditional("比较原始与处理后的声音，对照曲线观察效果强度带来的变化。"), en: "Compare original and processed audio, and relate changes in effect strength to the chart.", ja: "元の音と処理後の音を比較し、効果の強さによる変化を曲線で確認します。", ko: "원본과 처리된 소리를 비교하고 효과 강도에 따른 변화를 곡선으로 확인합니다." },
  workbench: { zh: "听感与指标实验台", "zh-Hant": traditional("听感与指标实验台"), en: "Listening metrics workbench", ja: "聴感と指標の実験台", ko: "청감과 지표 실험대" },
  effectChart: { zh: "听感与指标效果图", "zh-Hant": traditional("听感与指标效果图"), en: "Listening metric effect chart", ja: "聴感と指標の効果図", ko: "청감과 지표 효과 차트" },
  effects: { zh: "听感效果", "zh-Hant": traditional("听感效果"), en: "Listening effects", ja: "聴感効果", ko: "청감 효과" },
  playExample: { zh: "播放对照音效", "zh-Hant": traditional("播放对照音效"), en: "Play example", ja: "比較音を再生", ko: "비교 음향 재생" },
  stop: { zh: "停止", "zh-Hant": traditional("停止"), en: "Stop", ja: "停止", ko: "중지" },
  playing: { zh: "播放中", "zh-Hant": traditional("播放中"), en: "Playing", ja: "再生中", ko: "재생 중" },
  stopped: { zh: "未播放", "zh-Hant": traditional("未播放"), en: "Stopped", ja: "停止中", ko: "중지됨" },
  intensity: { zh: "效果强度", "zh-Hant": traditional("效果强度"), en: "Effect intensity", ja: "効果の強さ", ko: "효과 강도" },
  chartNote: { zh: "图形是参数关联的教学示意，不是仪器测量结果。", "zh-Hant": traditional("图形是参数关联的教学示意，不是仪器测量结果。"), en: "Charts are parameter-linked teaching diagrams, not instrument measurements.", ja: "グラフはパラメーターに基づく学習用の図であり、計測器の測定結果ではありません。", ko: "차트는 파라미터와 연결된 교육용 도해이며 계측기 측정 결과가 아닙니다." }
} satisfies Record<string, LocalizedText>;

const chartAxisLabels: Record<ListeningEffect, LocalizedText> = {
  brightness: listeningLabCopy.frequencyAxis,
  muddy: listeningLabCopy.frequencyAxis,
  noise: listeningLabCopy.amplitudeAxis,
  distortion: listeningLabCopy.distortionAxis,
  compression: listeningLabCopy.amplitudeAxis,
  stereo: listeningLabCopy.stereoAxis
};

function createMetricPath(effect: ListeningEffect, intensity: number) {
  const x = 76;
  const width = 608;
  const midY = 120;
  const amount = intensity / 100;

  return Array.from({ length: 96 }, (_, index) => {
    const ratio = index / 95;
    const pointX = x + ratio * width;
    let y = midY;

    if (effect === "brightness" || effect === "muddy") {
      const response = toneResponse(effect, intensity, 20 * 1000 ** ratio);
      y = midY - 20 * Math.log10(response.magnitude) * 82 / 18;
    } else if (effect === "noise") {
      y = 210 - amount * 74 + Math.sin(ratio * Math.PI * 24) * 5;
    } else if (effect === "distortion") {
      y = midY - Math.sin(ratio * Math.PI * 8) * (20 + amount * 42);
    } else if (effect === "compression") {
      y = midY - Math.sin(ratio * Math.PI * 5) * (80 - amount * 54);
    } else {
      y = midY - Math.sin(ratio * Math.PI * 2) * 18 - amount * 48;
    }

    const clampedY = Math.min(196, Math.max(36, y));
    return `${index === 0 ? "M" : "L"} ${pointX.toFixed(2)} ${clampedY.toFixed(2)}`;
  }).join(" ");
}

function createListeningWavePath({
  amplitude = 34,
  centerY = 130,
  cycles = 5,
  phase = 0,
  points = 90,
  width = 660,
  x = 50
}: {
  amplitude?: number;
  centerY?: number;
  cycles?: number;
  phase?: number;
  points?: number;
  width?: number;
  x?: number;
}) {
  return Array.from({ length: points }, (_, index) => {
    const ratio = index / (points - 1);
    const pointX = x + ratio * width;
    const value =
      Math.sin(ratio * Math.PI * cycles + phase) * 0.78 +
      Math.sin(ratio * Math.PI * cycles * 2.4 + phase * 0.7) * 0.22;
    const pointY = centerY - value * amplitude;

    return `${index === 0 ? "M" : "L"} ${pointX.toFixed(2)} ${pointY.toFixed(2)}`;
  }).join(" ");
}

function createPureSinePath({
  amplitude = 34,
  centerY = 130,
  cycles = 4,
  phase = 0,
  points = 128,
  width = 660,
  x = 50
}: {
  amplitude?: number;
  centerY?: number;
  cycles?: number;
  phase?: number;
  points?: number;
  width?: number;
  x?: number;
}) {
  return Array.from({ length: points }, (_, index) => {
    const ratio = index / (points - 1);
    const pointX = x + ratio * width;
    const pointY = centerY - Math.sin(ratio * Math.PI * 2 * cycles + phase) * amplitude;

    return `${index === 0 ? "M" : "L"} ${pointX.toFixed(2)} ${pointY.toFixed(2)}`;
  }).join(" ");
}

function createNoiseBandPath(intensity: number) {
  const amount = intensity / 100;
  const width = 660;
  const x = 50;
  const baseline = 214 - amount * 42;
  const thickness = 8 + amount * 38;
  const topPoints = Array.from({ length: 72 }, (_, index) => {
    const ratio = index / 71;
    const pointX = x + ratio * width;
    const texture = Math.sin(ratio * Math.PI * 37) * 3.4 + Math.sin(ratio * Math.PI * 91) * 1.8;
    const pointY = baseline - thickness / 2 + texture * amount;

    return `${index === 0 ? "M" : "L"} ${pointX.toFixed(2)} ${pointY.toFixed(2)}`;
  });
  const bottomPoints = Array.from({ length: 72 }, (_, index) => {
    const ratio = 1 - index / 71;
    const pointX = x + ratio * width;
    const texture = Math.cos(ratio * Math.PI * 43) * 3.2 + Math.sin(ratio * Math.PI * 83) * 1.6;
    const pointY = baseline + thickness / 2 + texture * amount;

    return `L ${pointX.toFixed(2)} ${pointY.toFixed(2)}`;
  });

  return `${topPoints.join(" ")} ${bottomPoints.join(" ")} Z`;
}

function createNoisySignalPath(intensity: number) {
  const amount = intensity / 100;
  const width = 660;
  const x = 50;
  const centerY = 130;

  return Array.from({ length: 96 }, (_, index) => {
    const ratio = index / 95;
    const pointX = x + ratio * width;
    const clean =
      Math.sin(ratio * Math.PI * 4.8) * 0.78 +
      Math.sin(ratio * Math.PI * 11.5 + 0.6) * 0.22;
    const noise =
      Math.sin(ratio * Math.PI * 63) * 0.34 +
      Math.sin(ratio * Math.PI * 97 + 0.8) * 0.22 +
      Math.sin(ratio * Math.PI * 151 + 1.3) * 0.14;
    const pointY = centerY - clean * 28 - noise * amount * 22;

    return `${index === 0 ? "M" : "L"} ${pointX.toFixed(2)} ${pointY.toFixed(2)}`;
  }).join(" ");
}

function createSnrWavePath({
  amplitude,
  centerY,
  noiseAmount,
  width,
  x
}: {
  amplitude: number;
  centerY: number;
  noiseAmount: number;
  width: number;
  x: number;
}) {
  return Array.from({ length: 96 }, (_, index) => {
    const ratio = index / 95;
    const pointX = x + ratio * width;
    const clean =
      Math.sin(ratio * Math.PI * 5.2) * 0.78 +
      Math.sin(ratio * Math.PI * 10.6 + 0.4) * 0.22;
    const noise =
      Math.sin(ratio * Math.PI * 61 + 0.2) * 0.42 +
      Math.sin(ratio * Math.PI * 107 + 0.9) * 0.25;
    const pointY = centerY - clean * amplitude - noise * noiseAmount * 18;

    return `${index === 0 ? "M" : "L"} ${pointX.toFixed(1)} ${pointY.toFixed(1)}`;
  }).join(" ");
}

function createToneComparisonPath(effect: "brightness" | "muddy", intensity: number, processed: boolean) {
  const width = 260;
  const x = processed ? 410 : 76;
  const centerY = 304;
  const amplitude = effect === "brightness" ? 32 : 16;

  return Array.from({ length: 513 }, (_, index) => {
    const ratio = index / 512;
    const pointX = x + ratio * width;
    const value = toneSample(effect, processed ? intensity : 0, ratio * .008);

    const pointY = centerY - value * amplitude;

    return `${index === 0 ? "M" : "L"} ${pointX.toFixed(2)} ${pointY.toFixed(2)}`;
  }).join(" ");
}

function ToneFrequencyAxes({ language }: { language: Language }) {
  const x = 76;
  const y = 120;
  const width = 608;
  const height = 82;
  const ticks = [
    { label: listeningLabCopy.low[language], x: 76 },
    { label: listeningLabCopy.mid[language], x: 76 + 608 / 2 },
    { label: listeningLabCopy.high[language], x: 684 }
  ];
  const gainTicks = [
    { label: "+18 dB", y: y - height },
    { label: "0 dB", y },
    { label: "-18 dB", y: y + height }
  ];

  return (
    <g className="listening-tone-axis">
      <line data-testid="listening-frequency-x-axis" x1={x} x2={x + width} y1={y} y2={y} />
      <line data-testid="listening-level-y-axis" x1={x} x2={x} y1={y - height} y2={y + height} />
      {ticks.map((tick) => (
        <g key={tick.label}>
          <line x1={tick.x} x2={tick.x} y1={y - 6} y2={y + 6} />
          <text className="lab-chip" textAnchor="middle" x={tick.x} y={y + 26}>{tick.label}</text>
          <text className="lab-chip" textAnchor="middle" x={tick.x} y={y + 44}>{tick.x === 76 ? "20 Hz" : tick.x === 684 ? "20 kHz" : "632 Hz"}</text>
        </g>
      ))}
      {gainTicks.map((tick) => (
        <g key={tick.label}>
          <line className="faint" x1={x - 6} x2={x + width} y1={tick.y} y2={tick.y} />
          <text className="lab-chip" textAnchor="end" x={x - 12} y={tick.y + 4}>{tick.label}</text>
        </g>
      ))}
      <text className="lab-chip" x="532" y="182">{listeningLabCopy.xFrequency[language]}</text>
      <text className="lab-chip" x="92" y="34">{listeningLabCopy.yGain[language]}</text>
    </g>
  );
}

function ToneWaveAxes({
  language,
  prefix,
  x,
  effect
}: {
  language: Language;
  prefix: "clean" | "processed";
  x: number;
  effect: "brightness" | "muddy";
}) {
  const width = 260;
  const midY = 304;
  const height = 64;
  const limit = effect === "brightness" ? 2 : 4;
  const tickYs = [
    { label: `+${limit}`, y: midY - height },
    { label: "0", y: midY },
    { label: `-${limit}`, y: midY + height }
  ];

  return (
    <g className="listening-wave-axis">
      <line data-testid={`listening-${prefix}-time-axis`} x1={x} x2={x + width} y1={midY} y2={midY} />
      <line data-testid={`listening-${prefix}-amplitude-axis`} x1={x} x2={x} y1={midY - height} y2={midY + height} />
      {[x, x + width / 2, x + width].map((tickX) => (
        <line key={tickX} x1={tickX} x2={tickX} y1={midY - 4} y2={midY + 4} />
      ))}
      {tickYs.map((tick) => (
        <g key={tick.label}>
          <line x1={x - 4} x2={x + 4} y1={tick.y} y2={tick.y} />
          <text className="lab-chip" textAnchor="end" x={x - 8} y={tick.y + 4}>
            {tick.label}
          </text>
        </g>
      ))}
      <text className="lab-chip" textAnchor="middle" x={x + width / 2} y="420">
        {listeningLabCopy.xTime[language]}
      </text>
      {[0, 4, 8].map(ms => <text key={ms} className="lab-chip" x={x + ms / 8 * width} y="388" textAnchor="middle">{ms} ms</text>)}
      <text className="lab-chip" textAnchor="middle" transform={`translate(${x - 34} ${midY}) rotate(-90)`}>
        {listeningLabCopy.yAmplitude[language]}
      </text>
    </g>
  );
}

function createDistortionPath(intensity: number) {
  const amount = intensity / 100;
  const curve = createDistortionCurve(amount);
  const width = 660;
  const centerY = 130;
  const amplitude = 34;
  const baseCycles = 4;

  return Array.from({ length: 513 }, (_, index) => {
    const ratio = index / 512;
    const x = 50 + ratio * width;
    const summed = distortionSample(curve, Math.sin(ratio * Math.PI * 2 * baseCycles));
    const y = centerY - summed * amplitude;

    return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(" ");
}



function getHarmonicComponentLayout(total: number, index: number) {
  const gap = 22;
  const totalWidth = 608;
  const width = (totalWidth - gap * (total - 1)) / total;
  const x = 76 + index * (width + gap);

  return { width, x };
}

function createHarmonicComponentPath(component: HarmonicComponent, index: number, total: number) {
  const layout = getHarmonicComponentLayout(total, index);
  const amplitude = component.gain * 16;

  return createPureSinePath({
    amplitude,
    centerY: 232,
    cycles: component.order,
    phase: component.phase,
    points: 58,
    width: layout.width,
    x: layout.x
  });
}

function getCompressionVisualSettings(intensity: number) {
  const amount = intensity / 100;

  return {
    amplitude: 72,
    centerY: 130,
    ratio: getCompressionSettings(amount).ratio,
    thresholdDb: getCompressionSettings(amount).threshold
  };
}

function getCompressionSourceSample(ratio: number) {
  const envelope =
    0.2 +
    Math.exp(-((ratio - 0.18) ** 2) / 0.0035) * 0.78 +
    Math.exp(-((ratio - 0.48) ** 2) / 0.006) * 0.58 +
    Math.exp(-((ratio - 0.78) ** 2) / 0.0045) * 0.72;
  const carrier =
    Math.sin(ratio * Math.PI * 28) * 0.82 +
    Math.sin(ratio * Math.PI * 56 + 0.35) * 0.12;

  return carrier * Math.min(1, envelope);
}

function compressNormalizedSample(sample: number, thresholdDb: number, ratio: number) {
  const sign = Math.sign(sample);
  const magnitude = Math.abs(sample);
  const inputDb = 20 * Math.log10(Math.max(magnitude, 0.0001));
  const outputDb = inputDb <= thresholdDb ? inputDb : thresholdDb + (inputDb - thresholdDb) / ratio;
  const compressedMagnitude = 10 ** (outputDb / 20);

  return sign * compressedMagnitude;
}

function createCompressionEnvelopePath(intensity: number, compressed: boolean) {
  const settings = getCompressionVisualSettings(intensity);

  return Array.from({ length: 160 }, (_, index) => {
    const ratio = index / 159;
    const x = 50 + ratio * 660;
    const input = getCompressionSourceSample(ratio);
    const output = compressed ? compressNormalizedSample(input, settings.thresholdDb, settings.ratio) : input;
    const y = settings.centerY - output * settings.amplitude;

    return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(" ");
}

function getCompressionGainMarker(intensity: number) {
  const settings = getCompressionVisualSettings(intensity);
  let peak = { ratio: 0, sample: 0 };

  for (let index = 0; index < 160; index += 1) {
    const ratio = index / 159;
    const sample = getCompressionSourceSample(ratio);

    if (sample > peak.sample) {
      peak = { ratio, sample };
    }
  }

  const compressed = compressNormalizedSample(peak.sample, settings.thresholdDb, settings.ratio);

  return {
    inputY: settings.centerY - peak.sample * settings.amplitude,
    outputY: settings.centerY - compressed * settings.amplitude,
    x: 50 + peak.ratio * 660
  };
}

function createStereoChannelPath(intensity: number, channel: "left" | "right") {
  const amount = intensity / 100;
  // Constant-power pan: keep perceived loudness stable while moving from center to right.
  const panAngle = Math.PI / 4 + amount * (Math.PI / 4);
  const channelGain = channel === "left" ? Math.cos(panAngle) : Math.sin(panAngle);
  const centerY = channel === "left" ? 100 : 184;

  return createListeningWavePath({
    amplitude: 28 * Math.SQRT2 * channelGain,
    centerY,
    cycles: 6.2,
    phase: 0
  });
}



function createNoiseBuffer(context: AudioContext) {
  const sampleRate = context.sampleRate || 44100;
  const frameCount = Math.floor(sampleRate * 0.1);
  const buffer = context.createBuffer(1, frameCount, sampleRate);
  const data = buffer.getChannelData(0);

  for (let index = 0; index < frameCount; index += 1) {
    data[index] = Math.random() * 2 - 1;
  }

  return buffer;
}

function ListeningEffectChart({
  effect,
  intensity,
  language
}: {
  effect: ListeningEffect;
  intensity: number;
  language: Language;
}) {
  if (effect === "noise") {
    return (
      <>
        <path
          className="listening-noise-band"
          data-testid="listening-noise-band"
          d={createNoiseBandPath(intensity)}
        />
        <path
          className="listening-metric-path"
          data-testid="listening-noise-signal"
          d={createListeningWavePath({ amplitude: 28, centerY: 130, cycles: 4.8 })}
        />
        <path
          className="listening-noisy-signal"
          data-testid="listening-noisy-signal"
          d={createNoisySignalPath(intensity)}
        />
        <text className="lab-chip" x="92" y="92">{listeningLabCopy.cleanSignal[language]}</text>
        <text className="lab-chip" x="428" y="92">{listeningLabCopy.signalNoise[language]}</text>
        <text className="lab-chip" data-testid="listening-noise-floor-label" x="560" y="286">{listeningLabCopy.noiseFloor[language]}</text>
      </>
    );
  }

  if (effect === "compression") {
    const settings = getCompressionVisualSettings(intensity);
    const thresholdOffset = 10 ** (settings.thresholdDb / 20) * settings.amplitude;
    const positiveThresholdY = settings.centerY - thresholdOffset;
    const negativeThresholdY = settings.centerY + thresholdOffset;
    const gainMarker = getCompressionGainMarker(intensity);

    return (
      <>
        <line
          className="listening-compression-threshold"
          data-testid="listening-compression-threshold-positive"
          x1="50"
          x2="710"
          y1={positiveThresholdY.toFixed(2)}
          y2={positiveThresholdY.toFixed(2)}
        />
        <line
          className="listening-compression-threshold"
          data-testid="listening-compression-threshold-negative"
          x1="50"
          x2="710"
          y1={negativeThresholdY.toFixed(2)}
          y2={negativeThresholdY.toFixed(2)}
        />
        <path
          className="listening-envelope-input"
          data-testid="listening-input-envelope"
          d={createCompressionEnvelopePath(intensity, false)}
        />
        <path
          className="listening-envelope-output"
          data-testid="listening-compressed-envelope"
          d={createCompressionEnvelopePath(intensity, true)}
        />
        <line
          className="listening-compression-gain-reduction"
          data-testid="listening-compression-gain-reduction"
          x1={gainMarker.x.toFixed(2)}
          x2={gainMarker.x.toFixed(2)}
          y1={gainMarker.inputY.toFixed(2)}
          y2={gainMarker.outputY.toFixed(2)}
        />
        <text className="lab-chip" x="76" y="62">{listeningLabCopy.inputWaveform[language]}</text>
        <text className="lab-chip" x="248" y="62">{listeningLabCopy.compressedWaveform[language]}</text>
        <text className="lab-chip" x="570" y={Math.max(72, positiveThresholdY - 10).toFixed(2)}>{listeningLabCopy.threshold[language]}</text>
        <text className="lab-chip" x={Math.min(548, gainMarker.x + 16).toFixed(2)} y={((gainMarker.inputY + gainMarker.outputY) / 2).toFixed(2)}>
          {listeningLabCopy.gainReduction[language]}
        </text>
      </>
    );
  }

  if (effect === "stereo") {
    return (
      <>
        <path
          className="listening-stereo-left"
          data-testid="listening-stereo-left"
          d={createStereoChannelPath(intensity, "left")}
        />
        <path
          className="listening-stereo-right"
          data-testid="listening-stereo-right"
          d={createStereoChannelPath(intensity, "right")}
        />
        <text className="lab-chip" x="70" y="74">L</text>
        <text className="lab-chip" x="70" y="158">R</text>
        <text className="lab-chip" data-testid="listening-stereo-pan-label" x="528" y="284">
          {listeningLabCopy.panCenterRight[language]}
        </text>
      </>
    );
  }

  if (effect === "distortion") {
    const harmonics = getDistortionHarmonics(intensity);
    const harmonicLabel = harmonics.map((harmonic) => `${harmonic.order}f`).join(" + ");

    return (
      <>
        <path
          className="listening-clean-wave"
          data-testid="listening-clean-wave"
          d={createPureSinePath({ amplitude: 34, centerY: 130, cycles: 4 })}
        />
        <path
          className="listening-processed-wave"
          data-testid="listening-harmonic-sum"
          d={createDistortionPath(intensity)}
        />
        <text className="lab-chip" x="76" y="82">{listeningLabCopy.cleanFundamental[language]}</text>
        <text className="lab-chip" x="710" textAnchor="end" y="82">{listeningLabCopy.harmonicSum[language]}</text>
        <text className="lab-chip" x="76" y="206">{listeningLabCopy.harmonicComponents[language]}</text>
        {harmonics.map((harmonic, index) => {
          const layout = getHarmonicComponentLayout(harmonics.length, index);

          return (
            <g key={harmonic.order}>
              <path
                className="listening-harmonic-component"
                data-testid={`listening-harmonic-${harmonic.order}`}
                d={createHarmonicComponentPath(harmonic, index, harmonics.length)}
              />
              <text
                className="lab-chip listening-harmonic-label"
                textAnchor="middle"
                x={layout.x + layout.width / 2}
                y="266"
              >
                {harmonic.order}f
              </text>
            </g>
          );
        })}
        <text className="lab-chip" x="76" y="286">{harmonicLabel}</text>
      </>
    );
  }

  if (effect === "brightness" || effect === "muddy") {
    return (
      <>
        <rect
          className="listening-tone-emphasis-band"
          data-testid="listening-tone-emphasis-band"
          height={effect === "brightness" ? 126 : 116}
          rx="8"
          width={effect === "brightness" ? 172 : 190}
          x={effect === "brightness" ? 512 : 174}
          y={effect === "brightness" ? 44 : 52}
        />
        <ToneFrequencyAxes language={language} />
        <path
          className="listening-metric-path"
          data-testid="listening-metric-response"
          d={createMetricPath(effect, intensity)}
        />
        <ToneWaveAxes language={language} prefix="clean" x={76} effect={effect} />
        <ToneWaveAxes language={language} prefix="processed" x={410} effect={effect} />
        <path
          className="listening-clean-wave"
          data-testid="listening-clean-wave"
          d={createToneComparisonPath(effect, intensity, false)}
        />
        <path
          className="listening-processed-wave"
          data-testid="listening-processed-wave"
          d={createToneComparisonPath(effect, intensity, true)}
        />
        <text className="lab-chip" x="78" y="222">{listeningLabCopy.cleanWave[language]}</text>
        <text className="lab-chip" x="410" y="222">
          {(effect === "brightness" ? listeningLabCopy.trebleBoosted : listeningLabCopy.lowMidBuildup)[language]}
        </text>
        <text className="lab-chip" x={effect === "brightness" ? "526" : "188"} y={effect === "brightness" ? "56" : "64"}>
          {(effect === "brightness" ? listeningLabCopy.trebleZone : listeningLabCopy.lowMidZone)[language]}
        </text>
      </>
    );
  }

  return (
    <path
      className="listening-metric-path"
      data-testid="listening-metric-response"
      d={createMetricPath(effect, intensity)}
    />
  );
}

function SnrComparisonChart({ language }: { language: Language }) {
  const goodWave = createSnrWavePath({ amplitude: 34, centerY: 106, noiseAmount: 0.18, width: 270, x: 60 });
  const poorWave = createSnrWavePath({ amplitude: 24, centerY: 106, noiseAmount: 0.92, width: 270, x: 430 });

  return (
    <svg
      aria-label={listeningLabCopy.snrChartAria[language]}
      className="listening-snr-chart"
      role="img"
      viewBox="0 0 760 260"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect className="lab-diagram-bg" height="260" rx="14" width="760" />
      <line className="lab-axis" x1="54" x2="340" y1="106" y2="106" />
      <line className="lab-axis" x1="424" x2="710" y1="106" y2="106" />
      <rect className="listening-snr-good-floor" height="16" rx="8" width="286" x="54" y="176" />
      <rect className="listening-snr-poor-floor" height="50" rx="10" width="286" x="424" y="146" />
      <path className="listening-snr-good-wave" data-testid="snr-good-wave" d={goodWave} />
      <path className="listening-snr-poor-wave" data-testid="snr-poor-wave" d={poorWave} />
      <path className="listening-snr-gap good" d="M 354 84 V 184" />
      <path className="listening-snr-gap poor" d="M 724 92 V 170" />
      <text className="lab-label" x="58" y="42">{listeningLabCopy.goodSnr[language]}</text>
      <text className="lab-label" x="428" y="42">{listeningLabCopy.poorSnr[language]}</text>
      <text className="lab-chip" x="62" y="214">{listeningLabCopy.lowFloor[language]}</text>
      <text className="lab-chip" x="432" y="214">{listeningLabCopy.highFloor[language]}</text>
    </svg>
  );
}

function getCompressionSettings(amount: number) {
  return {
    attack: 0.004 + (1 - amount) * 0.018,
    knee: 16 - amount * 10,
    ratio: 1 + amount * 14,
    release: 0.22 - amount * 0.12,
    threshold: -10 - amount * 28
  };
}

function applyLiveIntensity(graph: ActiveAudioGraph, amount: number) {
  const now = graph.context.currentTime;

  graph.filter.Q.setValueAtTime(0.9 + amount, now);

  if (graph.effect === "brightness" || graph.effect === "muddy") {
    graph.filter.gain.setValueAtTime(amount * 16, now);
  }

  if (graph.shaper) {
    graph.shaper.curve = createDistortionCurve(amount);
  }

  if (graph.compressor) {
    const settings = getCompressionSettings(amount);
    graph.compressor.threshold.setValueAtTime(settings.threshold, now);
    graph.compressor.knee.setValueAtTime(settings.knee, now);
    graph.compressor.ratio.setValueAtTime(settings.ratio, now);
    graph.compressor.attack.setValueAtTime(settings.attack, now);
    graph.compressor.release.setValueAtTime(settings.release, now);
  }

  if (graph.panner) {
    graph.panner.pan.setValueAtTime(graph.effect === "stereo" ? amount * 0.9 : 0, now);
  }

  if (graph.noiseGain) {
    graph.noiseGain.gain.cancelScheduledValues(now);
    graph.noiseGain.gain.setValueAtTime(amount * (0.014 + amount * 0.04), now);
  }
}

export function ListeningMetricsLab({ language, onBack, onBackToDetails }: ListeningMetricsLabProps) {
  const [activeEffect, setActiveEffect] = useLabState<ListeningEffect>(
    "ListeningMetricsLab.activeEffect",
    "brightness",
    (value): value is ListeningEffect => value === "brightness" || value === "muddy" || value === "noise" || value === "distortion" || value === "compression" || value === "stereo"
  );
  const [intensity, setIntensity] = useLabState(
    "ListeningMetricsLab.intensity",
    55,
    (value): value is number => typeof value === "number" && Number.isFinite(value) && Number.isInteger(value) && value >= 0 && value <= 100 && value % 5 === 0
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<ActiveAudioGraph | null>(null);
  const stopTimer = useRef<number>();
  useEffect(() => () => {
    window.clearTimeout(stopTimer.current);
    if (audioRef.current) void audioRef.current.context.close();
  }, []);
  const activeCopy = effectCopy[activeEffect];
  const chartAxisLabel = chartAxisLabels[activeEffect][language];
  const chartAxisLabelY = activeEffect === "brightness" || activeEffect === "muddy" ? 292 : activeEffect === "distortion" ? 318 : 256;
  const showAxisGuideLabel = activeEffect !== "brightness" && activeEffect !== "muddy";
  const showGenericChartGuides = activeEffect !== "brightness" && activeEffect !== "muddy";
  const effectNote = <div className="lab-live-note">
    <strong>{activeCopy.description[language]}</strong>
    <span>{activeCopy.hearing[language]}</span>
    <span>{listeningLabCopy.chartNote[language]}</span>
  </div>;

  function stopAudio() {
    window.clearTimeout(stopTimer.current);
    if (audioRef.current) {
      void audioRef.current.context.close();
      audioRef.current = null;
    }
    setIsPlaying(false);
  }

  function handleIntensityChange(nextIntensity: number) {
    setIntensity(nextIntensity);

    if (audioRef.current) {
      applyLiveIntensity(audioRef.current, nextIntensity / 100);
    }
  }

  function playAudio() {
    stopAudio();
    const AudioContextConstructor = window.AudioContext ?? window.webkitAudioContext;

    if (!AudioContextConstructor) {
      return;
    }

    const context = new AudioContextConstructor({ sampleRate: 48000 });
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const filter = context.createBiquadFilter();
    const outputGain = context.createGain();
    const panner = context.createStereoPanner ? context.createStereoPanner() : null;
    let shaper: WaveShaperNode | undefined;
    let compressor: DynamicsCompressorNode | undefined;
    let noiseGain: GainNode | undefined;
    const now = context.currentTime;
    const amount = intensity / 100;

    oscillator.type = activeEffect === "distortion" ? "sine" : activeEffect === "compression" ? "triangle" : "sawtooth";
    oscillator.frequency.setValueAtTime(activeEffect === "muddy" ? 180 : activeEffect === "compression" ? 220 : 330, now);
    if (activeEffect === "brightness" || activeEffect === "muddy") {
      const real = new Float32Array(16), imag = new Float32Array(16);
      toneComponents.forEach(({ order, amplitude }) => { imag[order] = amplitude; });
      oscillator.setPeriodicWave(context.createPeriodicWave(real, imag, { disableNormalization: true }));
    }
    filter.type = activeEffect === "brightness" ? "highshelf" : activeEffect === "muddy" ? "lowshelf" : "peaking";
    filter.frequency.setValueAtTime(activeEffect === "brightness" ? 3600 : activeEffect === "muddy" ? 260 : 900, now);
    filter.gain.setValueAtTime(activeEffect === "brightness" || activeEffect === "muddy" ? amount * 16 : 0, now);
    filter.Q.setValueAtTime(0.9 + amount, now);
    gain.gain.setValueAtTime(0.0001, now);
    if (activeEffect === "compression") {
      gain.gain.linearRampToValueAtTime(0.28, now + 0.08);
      gain.gain.linearRampToValueAtTime(0.035, now + 0.24);
      gain.gain.linearRampToValueAtTime(0.32, now + 0.4);
      gain.gain.linearRampToValueAtTime(0.04, now + 0.58);
      gain.gain.linearRampToValueAtTime(0.26, now + 0.72);
      gain.gain.linearRampToValueAtTime(0.055, now + 0.9);
      gain.gain.linearRampToValueAtTime(0.22, now + 1.04);
      gain.gain.linearRampToValueAtTime(0.04, now + 1.22);
      gain.gain.linearRampToValueAtTime(0.0001, now + 1.5);
    } else {
      gain.gain.linearRampToValueAtTime(0.08, now + 0.04);
      gain.gain.linearRampToValueAtTime(0.0001, now + 1.1);
    }
    outputGain.gain.setValueAtTime(activeEffect === "compression" ? 1.35 : 0.9, now);

    oscillator.connect(filter);
    let lastNode: AudioNode = filter;

    if (activeEffect === "distortion") {
      shaper = context.createWaveShaper();
      shaper.curve = createDistortionCurve(amount);
      shaper.oversample = "4x";
      lastNode.connect(shaper);
      lastNode = shaper;
    }

    if (activeEffect === "compression") {
      // The changing input envelope must reach the detector, not follow the compressor.
      lastNode.connect(gain);
      lastNode = gain;
      compressor = context.createDynamicsCompressor();
      const settings = getCompressionSettings(amount);
      compressor.threshold.setValueAtTime(settings.threshold, now);
      compressor.knee.setValueAtTime(settings.knee, now);
      compressor.ratio.setValueAtTime(settings.ratio, now);
      compressor.attack.setValueAtTime(settings.attack, now);
      compressor.release.setValueAtTime(settings.release, now);
      lastNode.connect(compressor);
      lastNode = compressor;
    }

    if (activeEffect === "compression") {
      lastNode.connect(outputGain);
    } else {
      lastNode.connect(gain);
      gain.connect(outputGain);
    }

    if (panner) {
      panner.pan.setValueAtTime(activeEffect === "stereo" ? amount * 0.9 : 0, now);
      outputGain.connect(panner);
      panner.connect(context.destination);
    } else {
      outputGain.connect(context.destination);
    }

    oscillator.start(now);
    oscillator.stop(now + (activeEffect === "compression" ? 1.54 : 1.14));

    if (activeEffect === "noise") {
      const noiseSource = context.createBufferSource();
      noiseGain = context.createGain();
      noiseSource.buffer = createNoiseBuffer(context);
      noiseSource.loop = true;
      noiseGain.gain.setValueAtTime(0.0001, now);
      noiseGain.gain.linearRampToValueAtTime(amount * (0.014 + amount * 0.04), now + 0.04);
      noiseGain.gain.linearRampToValueAtTime(0.0001, now + 1.1);
      noiseSource.connect(noiseGain);
      noiseGain.connect(context.destination);
      noiseSource.start(now);
      noiseSource.stop(now + 1.14);
    }

    audioRef.current = {
      compressor,
      context,
      effect: activeEffect,
      filter,
      noiseGain,
      outputGain,
      panner,
      shaper
    };
    setIsPlaying(true);
    stopTimer.current = window.setTimeout(stopAudio, activeEffect === "compression" ? 1600 : 1200);
  }

  return (
    <main className="listening-lab-page">
      <section className="sound-lab-hero" aria-labelledby="listening-lab-title">
        <div className="sound-lab-back-actions">
          <button className="sound-lab-back sound-lab-back-secondary" type="button" onClick={onBack}>
            {listeningLabCopy.backKnowledge[language]}
          </button>
          {onBackToDetails ? <button className="sound-lab-back" type="button" onClick={onBackToDetails}>
            <ArrowLeft size={18} aria-hidden="true" />
            {listeningLabCopy.backGuide[language]}
          </button> : null}
        </div>
        <div>
          <span className="section-kicker">{listeningLabCopy.kicker[language]}</span>
          <h1 id="listening-lab-title">{listeningLabCopy.title[language]}</h1>
          <p>
            {listeningLabCopy.description[language]}
          </p>
        </div>
      </section>

      <section className="listening-lab-workbench" data-effect={activeEffect} aria-label={listeningLabCopy.workbench[language]}>
        {activeEffect === "distortion" && <p className="listening-model-note">{text(language,
          "输出波形与试听共用失真曲线。下方仅展示 1、2、3、5、7 次分量，统一幅度比例；其他高次谐波及非对称失真产生的直流分量未单列，不能只用这些小图完整重建输出。",
          "Plot and audio share one distortion curve. Below are selected orders 1, 2, 3, 5 and 7 at a common amplitude scale. Other harmonics and the DC component from asymmetry are omitted, so these small plots alone do not fully reconstruct the output.",
          "波形と音声は同じ歪み曲線を使います。下は同じ振幅尺度で1・2・3・5・7次だけを表示。他の高調波や非対称性による直流成分は省略しており、全出力は復元できません。",
          "파형과 오디오는 같은 왜곡 곡선을 사용합니다. 아래는 동일 진폭 척도의 1, 2, 3, 5, 7차 성분입니다. 다른 고조파와 비대칭의 직류 성분은 생략되어 전체 출력을 복원하지 못합니다.")}</p>}
        {activeEffect === "compression" && <p className="listening-model-note">{text(language,
          "图示为逐采样静态传递示意，试听使用带 Attack / Release 的动态压缩器；阈值和压缩比相同，但图形不是试听音频的实测波形。",
          "The plot illustrates a sample-wise static transfer. Audio uses a compressor with attack/release. Threshold and ratio match, but the plot is not a measurement of the audio.",
          "図はサンプルごとの静特性です。試聴にはアタック・リリース付き圧縮器を使用します。しきい値と比率は共通ですが、音声の実測波形ではありません。",
          "그림은 샘플별 정적 전달 특성입니다. 오디오는 어택/릴리스가 있는 압축기를 사용합니다. 임계값과 비율은 같지만 실측 파형은 아닙니다。")}</p>}
        <div className="listening-visual">
          <div className="digital-lab-status">
            <strong>{`${listeningLabCopy.metricPrefix[language]}${activeCopy.metric[language]}`}</strong>
            <span>{`${listeningLabCopy.intensityPrefix[language]}${intensity}%`}</span>
          </div>
          <svg
            aria-label={listeningLabCopy.effectChart[language]}
            role="img"
            viewBox={activeEffect === "distortion" ? "0 0 760 330" : showGenericChartGuides ? "0 0 760 300" : "0 0 760 440"}
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="listeningMetricLine" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#7ee7d8" />
                <stop offset="100%" stopColor="#f0b46a" />
              </linearGradient>
            </defs>
            <rect className="lab-diagram-bg" height={activeEffect === "distortion" ? 330 : showGenericChartGuides ? 300 : 440} rx="14" width="760" />
            {showGenericChartGuides ? (
              <>
                <line className="lab-axis" x1="50" x2="710" y1="130" y2="130" />
                <line className="lab-axis faint" x1="50" x2="710" y1="58" y2="58" />
                <line className="lab-axis faint" x1="50" x2="710" y1="210" y2="210" />
              </>
            ) : null}
            <ListeningEffectChart effect={activeEffect} intensity={intensity} language={language} />
            {showGenericChartGuides ? <text className="lab-label" x="54" y="42">{activeCopy.metric[language]}</text> : null}
            {showAxisGuideLabel ? (
              <text className="lab-chip" data-testid="listening-axis-guide-label" x="710" textAnchor="end" y={chartAxisLabelY}>{chartAxisLabel}</text>
            ) : null}
          </svg>
          {activeEffect === "noise" ? <SnrComparisonChart language={language} /> : null}
          {effectNote}
        </div>

        <div className="listening-panel">
          <div className="listening-effect-grid" role="group" aria-label={listeningLabCopy.effects[language]}>
            {(Object.keys(effectCopy) as ListeningEffect[]).map((effect) => (
              <button
                className={activeEffect === effect ? "waveform-tab active" : "waveform-tab"}
                key={effect}
                type="button"
                onClick={() => setActiveEffect(effect)}
              >
                {effectCopy[effect].label[language]}
              </button>
            ))}
          </div>

          <div className="sound-lab-actions">
            <button className="sine-button" type="button" onClick={playAudio}>
              <Play size={16} aria-hidden="true" />
              {listeningLabCopy.playExample[language]}
            </button>
            <button className="sine-button" type="button" onClick={stopAudio}>
              <Pause size={16} aria-hidden="true" />
              {listeningLabCopy.stop[language]}
            </button>
            <span className={isPlaying ? "sine-status playing" : "sine-status"}>
              {isPlaying ? listeningLabCopy.playing[language] : listeningLabCopy.stopped[language]}
            </span>
          </div>

          <div className="lab-sliders">
            <label>
              <span>
                {listeningLabCopy.intensity[language]}
                <strong>{intensity}%</strong>
              </span>
              <input
                aria-label={listeningLabCopy.intensity[language]}
                max="100"
                min="0"
                step="5"
                type="range"
                value={intensity}
                onChange={(event) => handleIntensityChange(Number(event.target.value))}
              />
            </label>
          </div>

        </div>
      </section>
    </main>
  );
}
