import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Pause, Play } from "lucide-react";
import type { Language } from "../content/knowledge";

type SupportedLanguage = "zh" | "en" | "ja" | "ko";
type LocalizedText = Record<SupportedLanguage, string>;

const localized = (language: Language, values: LocalizedText) => values[language as SupportedLanguage];

type MicrophoneLabProps = {
  language: Language;
  onBack: () => void;
  onBackToDetails?: () => void;
};

type PolarPattern = "omni" | "cardioid" | "figure8";
type MicExample = "near" | "far" | "noise" | "plosive" | "clipping" | "offAxis";
type MicPrinciple = "electret" | "digitalMems" | "dynamicVocal" | "array";

type ActiveMicAudio = {
  context: AudioContext;
  directGain: GainNode;
  filter: BiquadFilterNode;
  noiseGain: GainNode;
  outputGain: GainNode;
  shaper: WaveShaperNode;
  stopAt: number;
  timeoutId: number;
};

type MicPlaybackProfile = {
  directLevel: number;
  distortionAmount: number;
  duration: number;
  filterFrequency: number;
  filterQ: number;
  noiseLevel: number;
  oscillatorFrequency: number;
  outputLevel: number;
  plosiveLevel: number;
};

type PrincipleCopy = {
  label: LocalizedText;
  subtitle: LocalizedText;
  signal: LocalizedText;
  output: LocalizedText;
  core: LocalizedText;
  stages: Array<LocalizedText>;
  notes: Array<LocalizedText>;
};

type MicNumericStep = {
  label: string;
  note: string;
  value: string;
};

type MicNumericModel = {
  assumption: string;
  steps: MicNumericStep[];
};

const polarLabels: Record<PolarPattern, LocalizedText> = {
  omni: { zh: "全指向", en: "Omnidirectional", ja: "無指向性", ko: "무지향성" },
  cardioid: { zh: "心形", en: "Cardioid", ja: "カーディオイド", ko: "카디오이드" },
  figure8: { zh: "8 字形", en: "Figure-8", ja: "8の字", ko: "8자형" }
};

const exampleLabels: Record<MicExample, LocalizedText> = {
  near: { zh: "近讲", en: "Close talk", ja: "近接発話", ko: "근접 발화" },
  far: { zh: "远距离", en: "Far field", ja: "遠距離", ko: "원거리" },
  noise: { zh: "环境底噪", en: "Room noise", ja: "室内ノイズ", ko: "실내 잡음" },
  plosive: { zh: "爆破音", en: "Plosive", ja: "破裂音", ko: "파열음" },
  clipping: { zh: "削波失真", en: "Clipping", ja: "クリッピング", ko: "클리핑" },
  offAxis: { zh: "离轴衰减", en: "Off-axis loss", ja: "軸外減衰", ko: "축외 감쇠" }
};

const exampleNotes: Record<MicExample, LocalizedText> = {
  near: {
    zh: "近讲时直达声占比高，声音更清楚；指向性麦克风还可能出现低频近讲效应。",
    en: "Close talk has more direct sound and better clarity; directional microphones may also add proximity bass.",
    ja: "近接発話では直接音の割合が高く、音が明瞭になります。指向性マイクでは近接効果による低域の増加も起こりえます。",
    ko: "가까이 말하면 직접음 비율이 높아져 더 선명해집니다. 지향성 마이크에서는 근접 효과로 저역이 늘어날 수도 있습니다."
  },
  far: {
    zh: "距离变远后直达声下降，房间反射和环境噪声更明显，语音会变薄、变远。",
    en: "At longer distance, direct sound drops while reflections and ambient noise become more obvious.",
    ja: "距離が遠くなると直接音が下がり、部屋の反射と環境ノイズが目立つため、音声が薄く遠く感じられます。",
    ko: "거리가 멀어지면 직접음이 줄고 공간 반사와 환경 잡음이 두드러져 음성이 얇고 멀게 들립니다."
  },
  noise: {
    zh: "底噪来自环境、麦克风自噪声和前级增益。目标声越小，噪声越容易盖住细节。",
    en: "Noise comes from the room, microphone self-noise, and preamp gain. Lower target level makes noise more exposed.",
    ja: "ノイズは部屋、マイク自身の雑音、プリアンプのゲインから生じます。目標音が小さいほどノイズが細部を覆いやすくなります。",
    ko: "잡음은 공간, 마이크 자체 잡음, 프리앰프 이득에서 생깁니다. 목표 음량이 작을수록 잡음이 세부 정보를 덮기 쉽습니다."
  },
  plosive: {
    zh: "爆破音是气流直接冲击振膜造成的低频冲击，常用防喷罩、偏轴摆位和距离控制解决。",
    en: "Plosives are low-frequency bursts from air hitting the diaphragm, controlled with pop filters, off-axis placement, and distance.",
    ja: "破裂音は気流が振動板に直接当たって生じる低域の衝撃です。ポップガード、軸を外した配置、距離の調整で抑えます。",
    ko: "파열음은 기류가 진동판을 직접 때려 생기는 저주파 충격입니다. 팝 필터, 축을 비껴 둔 배치, 거리 조절로 줄일 수 있습니다."
  },
  clipping: {
    zh: "声源太响或增益太高会让前级过载，波形顶部被削平，听起来破、硬、刺耳。",
    en: "A loud source or too much gain overloads the front end, flattening waveform peaks and sounding harsh.",
    ja: "音源が大きすぎたりゲインが高すぎたりすると前段が過負荷になり、波形の頂部が平らになって荒く鋭い音になります。",
    ko: "음원이 너무 크거나 이득이 높으면 전단이 과부하되어 파형 꼭대기가 평평해지고 거칠고 날카롭게 들립니다."
  },
  offAxis: {
    zh: "离开主轴后拾音会变小，高频通常先衰减，所以声音会变暗、变远。",
    en: "Off-axis pickup is weaker and often loses treble first, making the source darker and farther away.",
    ja: "主軸から外れると収音レベルが下がり、高域から先に減衰することが多いため、音が暗く遠く感じられます。",
    ko: "주축에서 벗어나면 수음이 약해지고 보통 고역이 먼저 감쇠되어 음원이 어둡고 멀게 들립니다."
  }
};

const principleCopy: Record<MicPrinciple, PrincipleCopy> = {
  electret: {
    label: { zh: "模拟驻极体咪头", en: "Analog electret capsule", ja: "アナログ・エレクトレットカプセル", ko: "아날로그 일렉트릿 캡슐" },
    subtitle: {
      zh: "常见于耳机线控、录音笔、低成本采集模块和嵌入式设备。",
      en: "Common in headset remotes, recorders, low-cost capture modules, and embedded devices.",
      ja: "ヘッドセットのリモコン、レコーダー、低コスト収音モジュール、組み込み機器でよく使われます。",
      ko: "헤드셋 리모컨, 레코더, 저가 캡처 모듈, 임베디드 장치에서 흔히 사용됩니다."
    },
    signal: { zh: "输出：模拟电压", en: "Output: analog voltage", ja: "出力：アナログ電圧", ko: "출력: 아날로그 전압" },
    output: { zh: "需要偏置电阻、耦合电容、前级放大和 ADC。", en: "Needs bias resistor, coupling capacitor, preamp, and ADC.", ja: "バイアス抵抗、結合コンデンサー、プリアンプ、ADCが必要です。", ko: "바이어스 저항, 결합 커패시터, 프리앰프, ADC가 필요합니다." },
    core: {
      zh: "驻极体材料预先带电，声压推动振膜改变电容，内部 JFET 把高阻抗微弱信号缓冲成可用模拟电压。",
      en: "Electret material holds charge; sound moves the diaphragm and changes capacitance, while an internal JFET buffers the weak high-impedance signal into usable analog voltage.",
      ja: "エレクトレット材料が電荷を保持し、音圧が振動板を動かして静電容量を変えます。内部JFETが高インピーダンスの微弱信号をバッファし、扱いやすいアナログ電圧にします。",
      ko: "일렉트릿 재료가 전하를 유지하고 음압이 진동판을 움직여 정전용량을 바꿉니다. 내부 JFET가 고임피던스 미약 신호를 버퍼링해 사용할 수 있는 아날로그 전압으로 만듭니다."
    },
    stages: [
      { zh: "声压", en: "Pressure", ja: "音圧", ko: "음압" },
      { zh: "振膜电容", en: "Capsule C", ja: "カプセルC", ko: "캡슐 C" },
      { zh: "JFET 缓冲", en: "JFET buffer", ja: "JFETバッファ", ko: "JFET 버퍼" },
      { zh: "模拟电压", en: "Analog V", ja: "アナログ電圧", ko: "아날로그 전압" }
    ],
    notes: [
      { zh: "优点是便宜、小巧、接口简单。", en: "Small, cheap, and simple to interface.", ja: "安価で小型、インターフェースが簡単です。", ko: "저렴하고 작으며 인터페이스가 간단합니다." },
      { zh: "缺点是易受布线、偏置、电源噪声和前级质量影响。", en: "Sensitive to wiring, bias, power noise, and preamp quality.", ja: "配線、バイアス、電源ノイズ、プリアンプの品質に左右されやすいです。", ko: "배선, 바이어스, 전원 잡음, 프리앰프 품질의 영향을 받기 쉽습니다." }
    ]
  },
  digitalMems: {
    label: { zh: "数字 MEMS 麦", en: "Digital MEMS mic", ja: "デジタルMEMSマイク", ko: "디지털 MEMS 마이크" },
    subtitle: {
      zh: "常见于手机、TWS 耳机、智能音箱、笔记本和车载语音。",
      en: "Common in phones, TWS earbuds, smart speakers, laptops, and vehicle voice systems.",
      ja: "スマートフォン、TWSイヤホン、スマートスピーカー、ノートPC、車載音声システムでよく使われます。",
      ko: "스마트폰, TWS 이어버드, 스마트 스피커, 노트북, 차량 음성 시스템에서 흔히 사용됩니다."
    },
    signal: { zh: "输出：PDM / I2S", en: "Output: PDM / I2S", ja: "出力：PDM / I2S", ko: "출력: PDM / I2S" },
    output: { zh: "芯片内完成前端放大和调制，主控直接接收数字音频数据。", en: "Front-end amplification and modulation happen on chip, so the host receives digital audio data directly.", ja: "前段増幅と変調をチップ内で行うため、ホストはデジタルオーディオデータを直接受信します。", ko: "전단 증폭과 변조가 칩 내부에서 이루어져 호스트가 디지털 오디오 데이터를 직접 받습니다." },
    core: {
      zh: "MEMS 振膜和 ASIC 集成在封装内，声压改变微结构电容，芯片内部放大并通过 Σ-Δ 调制输出 PDM，或进一步抽取成 I2S PCM。",
      en: "A MEMS diaphragm and ASIC share one package. Pressure changes micro-capacitance, the ASIC amplifies it, then sigma-delta modulation outputs PDM or decimated I2S PCM.",
      ja: "MEMS振動板とASICを一つのパッケージに集積します。音圧で微小な静電容量が変化し、ASICが増幅した後、Σ-Δ変調でPDMを出力するか、さらにデシメーションしてI2S PCMにします。",
      ko: "MEMS 진동판과 ASIC가 하나의 패키지에 통합됩니다. 음압이 미세 정전용량을 바꾸면 ASIC가 증폭하고 Σ-Δ 변조로 PDM을 출력하거나 데시메이션해 I2S PCM으로 만듭니다."
    },
    stages: [
      { zh: "MEMS 振膜", en: "MEMS diaphragm", ja: "MEMS振動板", ko: "MEMS 진동판" },
      { zh: "ASIC 前端", en: "ASIC front end", ja: "ASIC前段", ko: "ASIC 전단" },
      { zh: "Σ-Δ 调制", en: "Sigma-delta", ja: "Σ-Δ変調", ko: "Σ-Δ 변조" },
      { zh: "PDM / I2S", en: "PDM / I2S", ja: "PDM / I2S", ko: "PDM / I2S" }
    ],
    notes: [
      { zh: "数字输出抗模拟布线干扰，更适合小体积多麦设计。", en: "Digital output resists analog wiring noise and suits compact multi-mic designs.", ja: "デジタル出力はアナログ配線ノイズに強く、小型の複数マイク設計に向きます。", ko: "디지털 출력은 아날로그 배선 잡음에 강해 소형 다중 마이크 설계에 적합합니다." },
      { zh: "需要关注时钟、左右声道配置、PDM 抽取和封装声孔设计。", en: "Clocking, left/right configuration, PDM decimation, and acoustic port design matter.", ja: "クロック、左右チャンネル設定、PDMデシメーション、パッケージの音響ポート設計が重要です。", ko: "클록, 좌우 채널 설정, PDM 데시메이션, 패키지 음향 포트 설계를 확인해야 합니다." }
    ]
  },
  dynamicVocal: {
    label: { zh: "动圈话筒", en: "Dynamic vocal mic", ja: "ダイナミックボーカルマイク", ko: "다이내믹 보컬 마이크" },
    subtitle: {
      zh: "常见于舞台演出、K 歌、人声近讲、鼓和吉他箱体。",
      en: "Common for stage performance, karaoke, close vocals, drums, and guitar cabinets.",
      ja: "ステージ、カラオケ、近接ボーカル、ドラム、ギターキャビネットでよく使われます。",
      ko: "무대 공연, 노래방, 근접 보컬, 드럼, 기타 캐비닛에 흔히 사용됩니다."
    },
    signal: { zh: "输出：低电平模拟电压", en: "Output: low-level analog voltage", ja: "出力：低レベルのアナログ電圧", ko: "출력: 저레벨 아날로그 전압" },
    output: { zh: "不需要幻象电源，但通常需要更高前级增益。", en: "Needs no phantom power, but usually requires more preamp gain.", ja: "ファンタム電源は不要ですが、通常はより高いプリアンプゲインが必要です。", ko: "팬텀 전원은 필요 없지만 보통 더 높은 프리앰프 이득이 필요합니다." },
    core: {
      zh: "振膜连接轻质线圈，线圈在磁场中随声音运动并感应出电压。结构坚固、抗大声压，但灵敏度通常低于电容麦。",
      en: "A diaphragm moves a lightweight coil inside a magnetic field, inducing voltage. It is rugged and handles high SPL, but is usually less sensitive than condenser microphones.",
      ja: "振動板が軽いコイルを磁界内で動かし、電圧を誘導します。頑丈で大音圧に耐えますが、通常はコンデンサーマイクより感度が低いです。",
      ko: "진동판이 가벼운 코일을 자기장 안에서 움직여 전압을 유도합니다. 튼튼하고 높은 SPL을 견디지만 보통 콘덴서 마이크보다 감도가 낮습니다."
    },
    stages: [
      { zh: "振膜", en: "Diaphragm", ja: "振動板", ko: "진동판" },
      { zh: "音圈", en: "Voice coil", ja: "ボイスコイル", ko: "보이스 코일" },
      { zh: "磁场感应", en: "Magnetic induction", ja: "電磁誘導", ko: "전자기 유도" },
      { zh: "前级增益", en: "Preamp gain", ja: "プリアンプゲイン", ko: "프리앰프 이득" }
    ],
    notes: [
      { zh: "适合近距离、大声压和嘈杂环境。", en: "Good for close distance, high SPL, and noisy environments.", ja: "近距離、大音圧、騒がしい環境に向きます。", ko: "근거리, 높은 SPL, 시끄러운 환경에 적합합니다." },
      { zh: "离嘴太远时电平会低，房间声和底噪会更明显。", en: "Too much distance lowers level and reveals room sound and noise.", ja: "口元から離れすぎるとレベルが下がり、部屋の音とノイズが目立ちます。", ko: "입에서 너무 멀어지면 레벨이 낮아지고 공간음과 잡음이 더 드러납니다." }
    ]
  },
  array: {
    label: { zh: "多麦阵列", en: "Multi-mic array", ja: "マルチマイクアレイ", ko: "다중 마이크 어레이" },
    subtitle: {
      zh: "常见于会议设备、智能音箱、手机免提、TWS 耳机和车载座舱。",
      en: "Common in conference devices, smart speakers, phone speaker mode, TWS earbuds, and vehicle cabins.",
      ja: "会議機器、スマートスピーカー、スマートフォンのスピーカーモード、TWSイヤホン、車載キャビンでよく使われます。",
      ko: "회의 장치, 스마트 스피커, 휴대폰 스피커 모드, TWS 이어버드, 차량 캐빈에서 흔히 사용됩니다."
    },
    signal: { zh: "输出：增强后的目标声", en: "Output: enhanced target voice", ja: "出力：強調された目標音声", ko: "출력: 강화된 목표 음성" },
    output: { zh: "多路麦克风同步采集后，算法利用时间差和相位差增强目标方向。", en: "Multiple synchronized microphones use time and phase differences to enhance the target direction.", ja: "複数のマイクで同期収音し、アルゴリズムが時間差と位相差を使って目標方向を強調します。", ko: "여러 마이크가 동기화되어 수음한 뒤 알고리즘이 시간차와 위상차로 목표 방향을 강화합니다." },
    core: {
      zh: "声源到每颗麦克风的距离不同，到达时间和相位也不同。延时对齐并加权求和可形成波束，增强目标方向并衰减部分离轴干扰；这不等同于使用播放参考的 AEC 回声消除。",
      en: "A source reaches each microphone at different times and phases. Delay alignment and weighted summation form a beam that favors a target direction and attenuates some off-axis interference; this is not playback-reference AEC.",
      ja: "音源から各マイクまでの距離が異なるため、到達時間と位相も異なります。遅延をそろえて重み付き加算するとビームが形成され、目標方向を強調し一部の軸外干渉を抑えます。これは再生リファレンスを使うAECとは異なります。",
      ko: "음원에서 각 마이크까지의 거리가 달라 도달 시간과 위상도 다릅니다. 지연을 맞춰 가중 합산하면 빔이 형성되어 목표 방향을 강화하고 일부 축외 간섭을 줄입니다. 이는 재생 참조를 사용하는 AEC와 다릅니다."
    },
    stages: [
      { zh: "多路采集", en: "Multi capture", ja: "複数チャンネル収音", ko: "다중 채널 캡처" },
      { zh: "时间差", en: "Time delay", ja: "時間差", ko: "시간 지연" },
      { zh: "波束形成", en: "Beamforming", ja: "ビームフォーミング", ko: "빔포밍" },
      { zh: "目标语音", en: "Target voice", ja: "目標音声", ko: "목표 음성" }
    ],
    notes: [
      { zh: "阵列能力依赖麦间距、同步时钟、安装位置和算法。", en: "Array performance depends on mic spacing, sync clock, placement, and algorithms.", ja: "アレイ性能はマイク間隔、同期クロック、配置、アルゴリズムに左右されます。", ko: "어레이 성능은 마이크 간격, 동기 클록, 배치, 알고리즘에 좌우됩니다." },
      { zh: "后续可继续接入 AEC、NS、DOA 和声源分离。", en: "It can extend into AEC, noise suppression, DOA, and source separation.", ja: "後段でAEC、ノイズ抑制、DOA、音源分離へ拡張できます。", ko: "후단에서 AEC, 잡음 억제, DOA, 음원 분리로 확장할 수 있습니다." }
    ]
  }
};

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

function getPolarGain(pattern: PolarPattern, angleDegrees: number) {
  const radians = (angleDegrees * Math.PI) / 180;
  const cosine = Math.cos(radians);

  if (pattern === "omni") {
    return 1;
  }

  if (pattern === "figure8") {
    return Math.abs(cosine);
  }

  return Math.max(0, 0.5 + 0.5 * cosine);
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function splToTeachingPascal(spl: number) {
  return 10 ** ((spl - 94) / 20);
}

function formatPascal(value: number) {
  return `${value.toFixed(3)} Pa`;
}

function formatMillivolts(valueVrms: number) {
  return `${(valueVrms * 1000).toFixed(2)} mVrms`;
}

function formatDb(value: number) {
  return `${value.toFixed(1)} dB`;
}

function getElectretNumericModel(inputSpl: number, language: Language): MicNumericModel {
  const pressurePa = splToTeachingPascal(inputSpl);
  const jfetOutputVrms = pressurePa * 0.00631;
  const capsuleHighImpedanceVrms = jfetOutputVrms / 0.9;
  const preampVrms = jfetOutputVrms * 10;
  const dbfs = 20 * Math.log10(Math.max(preampVrms, 0.000001));
  const diaphragmNm = pressurePa * 20;
  const capacitanceDeltaPf = pressurePa * 0.02;

  return {
    assumption: localized(language, { zh: "教学近似：-44 dBV/Pa，20 dB 前级，1 Vrms ADC 满量程", en: "Teaching approximation: -44 dBV/Pa, 20 dB preamp, 1 Vrms ADC full scale", ja: "教育用近似：-44 dBV/Pa、20 dBプリアンプ、1 Vrms ADCフルスケール", ko: "교육용 근사: -44 dBV/Pa, 20 dB 프리앰프, 1 Vrms ADC 풀 스케일" }),
    steps: [
      {
        label: localized(language, { zh: "声波输入", en: "Sound input", ja: "音波入力", ko: "음파 입력" }),
        note: localized(language, { zh: `声压：${formatPascal(pressurePa)}`, en: `Pressure: ${formatPascal(pressurePa)}`, ja: `音圧：${formatPascal(pressurePa)}`, ko: `음압: ${formatPascal(pressurePa)}` }),
        value: localized(language, { zh: `输入声压：${inputSpl} dBSPL`, en: `Input SPL: ${inputSpl} dBSPL`, ja: `入力音圧：${inputSpl} dBSPL`, ko: `입력 음압: ${inputSpl} dBSPL` })
      },
      {
        label: localized(language, { zh: "振膜 / 电容", en: "Diaphragm / capacitance", ja: "振動板 / 静電容量", ko: "진동판 / 정전용량" }),
        note: localized(language, { zh: `电容变化约 ${capacitanceDeltaPf.toFixed(3)} pF`, en: `Capacitance change about ${capacitanceDeltaPf.toFixed(3)} pF`, ja: `静電容量の変化：約${capacitanceDeltaPf.toFixed(3)} pF`, ko: `정전용량 변화 약 ${capacitanceDeltaPf.toFixed(3)} pF` }),
        value: localized(language, { zh: `振膜位移约 ${diaphragmNm.toFixed(1)} nm`, en: `Diaphragm motion about ${diaphragmNm.toFixed(1)} nm`, ja: `振動板の変位：約${diaphragmNm.toFixed(1)} nm`, ko: `진동판 변위 약 ${diaphragmNm.toFixed(1)} nm` })
      },
      {
        label: localized(language, { zh: "高阻节点", en: "High-Z node", ja: "高インピーダンスノード", ko: "고임피던스 노드" }),
        note: localized(language, { zh: "电容换能后的微弱高阻抗信号", en: "Weak high-impedance signal after capacitance transduction", ja: "容量変換後の微弱な高インピーダンス信号", ko: "정전용량 변환 후의 미약한 고임피던스 신호" }),
        value: formatMillivolts(capsuleHighImpedanceVrms)
      },
      {
        label: localized(language, { zh: "JFET 输出", en: "JFET output", ja: "JFET出力", ko: "JFET 출력" }),
        note: localized(language, { zh: "缓冲后电压接近不变，输出阻抗降低", en: "Buffered voltage is similar, with lower output impedance", ja: "バッファ後も電圧はほぼ同じで、出力インピーダンスが下がります", ko: "버퍼 후 전압은 거의 같고 출력 임피던스는 낮아집니다" }),
        value: formatMillivolts(jfetOutputVrms)
      },
      {
        label: localized(language, { zh: "20 dB 前级后", en: "After 20 dB preamp", ja: "20 dBプリアンプ後", ko: "20 dB 프리앰프 후" }),
        note: localized(language, { zh: `约 ${formatDb(dbfs)}FS`, en: `About ${formatDb(dbfs)}FS`, ja: `約${formatDb(dbfs)}FS`, ko: `약 ${formatDb(dbfs)}FS` }),
        value: formatMillivolts(preampVrms)
      }
    ]
  };
}

function getPrincipleNumericModel(principle: MicPrinciple, inputSpl: number, language: Language): MicNumericModel {
  const pressurePa = splToTeachingPascal(inputSpl);

  if (principle === "digitalMems") {
    const pcmDbfs = inputSpl - 120;

    return {
      assumption: localized(language, { zh: "教学近似：数字 MEMS 约 -26 dBFS/Pa，ASIC 内部完成放大和调制", en: "Teaching approximation: digital MEMS about -26 dBFS/Pa, with gain and modulation inside the ASIC", ja: "教育用近似：デジタルMEMSは約-26 dBFS/Pa、ASIC内部で増幅と変調を実行", ko: "교육용 근사: 디지털 MEMS 약 -26 dBFS/Pa, ASIC 내부에서 증폭과 변조 수행" }),
      steps: [
        {
          label: localized(language, { zh: "声波输入", en: "Sound input", ja: "音波入力", ko: "음파 입력" }),
          note: localized(language, { zh: `声压：${formatPascal(pressurePa)}`, en: `Pressure: ${formatPascal(pressurePa)}`, ja: `音圧：${formatPascal(pressurePa)}`, ko: `음압: ${formatPascal(pressurePa)}` }),
          value: localized(language, { zh: `输入声压：${inputSpl} dBSPL`, en: `Input SPL: ${inputSpl} dBSPL`, ja: `入力音圧：${inputSpl} dBSPL`, ko: `입력 음압: ${inputSpl} dBSPL` })
        },
        {
          label: localized(language, { zh: "MEMS 电容", en: "MEMS capacitance", ja: "MEMS静電容量", ko: "MEMS 정전용량" }),
          note: localized(language, { zh: "微结构电容变化进入 ASIC 前端", en: "Micro-capacitance change enters the ASIC front end", ja: "微細構造の静電容量変化がASIC前段に入ります", ko: "미세 구조 정전용량 변화가 ASIC 전단으로 들어갑니다" }),
          value: localized(language, { zh: "片内模拟信号", en: "On-chip analog signal", ja: "チップ内アナログ信号", ko: "칩 내부 아날로그 신호" })
        },
        {
          label: localized(language, { zh: "Σ-Δ 调制", en: "Sigma-delta", ja: "Σ-Δ変調", ko: "Σ-Δ 변조" }),
          note: localized(language, { zh: "把模拟量调制成高速 1-bit PDM", en: "Converts analog level into high-rate 1-bit PDM", ja: "アナログ量を高速1-bit PDMへ変調します", ko: "아날로그 값을 고속 1-bit PDM으로 변조합니다" }),
          value: localized(language, { zh: "PDM 1-bit 流", en: "PDM 1-bit stream", ja: "PDM 1-bitストリーム", ko: "PDM 1-bit 스트림" })
        },
        {
          label: localized(language, { zh: "抽取后 PCM", en: "Decimated PCM", ja: "デシメーション後PCM", ko: "데시메이션 후 PCM" }),
          note: localized(language, { zh: `约 ${formatDb(pcmDbfs)}FS`, en: `About ${formatDb(pcmDbfs)}FS`, ja: `約${formatDb(pcmDbfs)}FS`, ko: `약 ${formatDb(pcmDbfs)}FS` }),
          value: localized(language, { zh: "多 bit 采样值", en: "Multi-bit samples", ja: "マルチビットサンプル", ko: "멀티비트 샘플" })
        }
      ]
    };
  }

  if (principle === "dynamicVocal") {
    const coilVrms = pressurePa * 0.002;
    const preampVrms = coilVrms * 100;
    const dbfs = 20 * Math.log10(Math.max(preampVrms, 0.000001));

    return {
      assumption: localized(language, { zh: "教学近似：动圈约 -54 dBV/Pa，40 dB 前级，1 Vrms ADC 满量程", en: "Teaching approximation: dynamic mic about -54 dBV/Pa, 40 dB preamp, 1 Vrms ADC full scale", ja: "教育用近似：ダイナミックマイク約-54 dBV/Pa、40 dBプリアンプ、1 Vrms ADCフルスケール", ko: "교육용 근사: 다이내믹 마이크 약 -54 dBV/Pa, 40 dB 프리앰프, 1 Vrms ADC 풀 스케일" }),
      steps: [
        {
          label: localized(language, { zh: "声波输入", en: "Sound input", ja: "音波入力", ko: "음파 입력" }),
          note: localized(language, { zh: `声压：${formatPascal(pressurePa)}`, en: `Pressure: ${formatPascal(pressurePa)}`, ja: `音圧：${formatPascal(pressurePa)}`, ko: `음압: ${formatPascal(pressurePa)}` }),
          value: localized(language, { zh: `输入声压：${inputSpl} dBSPL`, en: `Input SPL: ${inputSpl} dBSPL`, ja: `入力音圧：${inputSpl} dBSPL`, ko: `입력 음압: ${inputSpl} dBSPL` })
        },
        {
          label: localized(language, { zh: "音圈感应", en: "Coil induction", ja: "コイル誘導", ko: "코일 유도" }),
          note: localized(language, { zh: "线圈在磁场中运动产生电压", en: "Moving coil in magnetic field induces voltage", ja: "磁界中でコイルが動くと電圧が誘導されます", ko: "자기장 속에서 코일이 움직이면 전압이 유도됩니다" }),
          value: formatMillivolts(coilVrms)
        },
        {
          label: localized(language, { zh: "40 dB 前级后", en: "After 40 dB preamp", ja: "40 dBプリアンプ後", ko: "40 dB 프리앰프 후" }),
          note: localized(language, { zh: `约 ${formatDb(dbfs)}FS`, en: `About ${formatDb(dbfs)}FS`, ja: `約${formatDb(dbfs)}FS`, ko: `약 ${formatDb(dbfs)}FS` }),
          value: formatMillivolts(preampVrms)
        }
      ]
    };
  }

  if (principle === "array") {
    const singleMicVrms = pressurePa * 0.00631;
    const coherentArrayVrms = singleMicVrms * 2;

    return {
      assumption: localized(language, {
        zh: "教学近似：4 Mic 目标方向延时对齐后，相干目标约 +6 dB",
        en: "Teaching approximation: after delay alignment, a 4-mic target direction can gain about +6 dB",
        ja: "教育用近似：4本のMicを遅延整列すると、目的方向のコヒーレント信号は約+6 dB向上します",
        ko: "교육용 근사: 4개 Mic를 지연 정렬하면 목표 방향의 코히어런트 신호가 약 +6 dB 향상됩니다"
      }),
      steps: [
        {
          label: localized(language, { zh: "声波输入", en: "Sound input", ja: "音波入力", ko: "음파 입력" }),
          note: localized(language, {
            zh: `声压：${formatPascal(pressurePa)}`,
            en: `Pressure: ${formatPascal(pressurePa)}`,
            ja: `音圧：${formatPascal(pressurePa)}`,
            ko: `음압: ${formatPascal(pressurePa)}`
          }),
          value: localized(language, {
            zh: `输入声压：${inputSpl} dBSPL`,
            en: `Input SPL: ${inputSpl} dBSPL`,
            ja: `入力音圧：${inputSpl} dBSPL`,
            ko: `입력 음압: ${inputSpl} dBSPL`
          })
        },
        {
          label: localized(language, { zh: "单颗麦输出", en: "Single mic output", ja: "単一マイク出力", ko: "단일 마이크 출력" }),
          note: localized(language, {
            zh: "每路仍先是独立麦克风信号",
            en: "Each channel is still an independent microphone signal",
            ja: "各チャンネルはまず独立したマイク信号です",
            ko: "각 채널은 먼저 독립적인 마이크 신호입니다"
          }),
          value: formatMillivolts(singleMicVrms)
        },
        {
          label: localized(language, { zh: "延时对齐求和", en: "Delay-align sum", ja: "遅延整列加算", ko: "지연 정렬 합산" }),
          note: localized(language, {
            zh: "目标方向相干增强，非目标方向相消",
            en: "Target direction adds coherently; off-axis sound is reduced",
            ja: "目的方向はコヒーレントに加算され、軸外音は低減します",
            ko: "목표 방향은 코히어런트하게 더해지고 축외 소리는 줄어듭니다"
          }),
          value: formatMillivolts(coherentArrayVrms)
        }
      ]
    };
  }

  return getElectretNumericModel(inputSpl, language);
}

function createPolarPath(pattern: PolarPattern, angleDegrees: number) {
  const centerX = 190;
  const centerY = 190;
  const radiusScale = 142;
  const points = Array.from({ length: 181 }, (_, index) => {
    const degrees = (index / 180) * 360;
    const gain = getPolarGain(pattern, degrees);
    const radians = ((degrees - 90) * Math.PI) / 180;
    const radius = gain * radiusScale;
    const x = centerX + Math.cos(radians) * radius;
    const y = centerY + Math.sin(radians) * radius;

    return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
  });

  const sourceRadians = ((angleDegrees - 90) * Math.PI) / 180;
  const sourceRadius = 156;
  const source = {
    x: centerX + Math.cos(sourceRadians) * sourceRadius,
    y: centerY + Math.sin(sourceRadians) * sourceRadius
  };
  const pickupRadius = getPolarGain(pattern, angleDegrees) * radiusScale;
  const pickup = {
    x: centerX + Math.cos(sourceRadians) * pickupRadius,
    y: centerY + Math.sin(sourceRadians) * pickupRadius
  };

  return {
    path: `${points.join(" ")} Z`,
    pickup,
    source
  };
}

function getPickupAnalysis({
  angle,
  distance,
  gain,
  pattern
}: {
  angle: number;
  distance: number;
  gain: number;
  pattern: PolarPattern;
}) {
  const directionalGain = getPolarGain(pattern, Math.abs(angle));
  const distanceGain = 1 / Math.max(0.35, distance);
  const preampGain = gain / 50;
  const level = directionalGain * distanceGain * preampGain;
  const levelPercent = Math.min(100, Math.round(level * 82));
  const noiseRisk = Math.min(100, Math.round((distance / 3.2) * 46 + Math.max(0, gain - 42) * 0.8));
  const clippingRisk = Math.min(100, Math.round(Math.max(0, level - 0.86) * 160 + Math.max(0, gain - 70) * 1.1));
  const clarity = Math.max(0, Math.min(100, Math.round(levelPercent - noiseRisk * 0.42 - Math.abs(angle) * 0.12)));

  return {
    clarity,
    clippingRisk,
    directionalGain,
    levelPercent,
    noiseRisk
  };
}

function createNoiseBuffer(context: AudioContext, duration: number, amount: number) {
  const sampleRate = context.sampleRate || 44100;
  const frameCount = Math.floor(sampleRate * duration);
  const buffer = context.createBuffer(1, frameCount, sampleRate);
  const data = buffer.getChannelData(0);

  for (let index = 0; index < frameCount; index += 1) {
    data[index] = (Math.random() * 2 - 1) * amount;
  }

  return buffer;
}

function createDistortionCurve(amount: number) {
  const curve = new Float32Array(512);
  const drive = 1 + amount * 38;

  for (let index = 0; index < curve.length; index += 1) {
    const x = (index * 2) / (curve.length - 1) - 1;
    curve[index] = amount <= 0.01 ? x : Math.tanh(x * drive);
  }

  return curve;
}

function createMicPlaybackProfile({
  analysis,
  distance,
  example,
  gain
}: {
  analysis: ReturnType<typeof getPickupAnalysis>;
  distance: number;
  example: MicExample;
  gain: number;
}): MicPlaybackProfile {
  const distanceGain = 1 / Math.max(0.35, distance);
  const preampGain = gain / 50;
  const offAxisAmount = 1 - analysis.directionalGain;
  const normalizedPickup = clamp(analysis.directionalGain * distanceGain * preampGain, 0, 1.8);
  const exampleLevel =
    example === "near"
      ? 1.1
      : example === "far"
        ? 0.72
        : example === "noise"
          ? 0.62
          : example === "plosive"
            ? 0.9
            : example === "clipping"
              ? 1.35
              : 0.82;
  const baseFilter =
    example === "plosive"
      ? 190
      : example === "far"
        ? 2400
        : example === "offAxis"
          ? 1800
          : example === "noise"
            ? 3100
            : 4300;
  const clippingBoost = example === "clipping" ? 0.55 : 0;
  const distanceNoise = clamp((distance - 0.8) * 0.014, 0, 0.05);

  return {
    directLevel: clamp(normalizedPickup * 0.12 * exampleLevel, 0.0006, 0.24),
    distortionAmount: clamp((analysis.clippingRisk / 100) * 0.9 + clippingBoost, 0, 1),
    duration: example === "plosive" ? 1.55 : 2.8,
    filterFrequency: clamp(baseFilter - offAxisAmount * 1900 - distance * 140 + analysis.directionalGain * 260, 150, 4800),
    filterQ: example === "plosive" ? 0.65 : example === "offAxis" || example === "far" ? 0.82 : 1.05,
    noiseLevel: clamp(
      0.005 +
        analysis.noiseRisk * 0.00052 +
        offAxisAmount * 0.018 +
        distanceNoise +
        (example === "noise" ? 0.048 : 0) +
        (example === "far" ? 0.022 : 0),
      0.004,
      0.12
    ),
    oscillatorFrequency: example === "plosive" ? 130 : example === "clipping" ? 230 : 210,
    outputLevel: clamp(0.72 + gain / 220, 0.76, 1.14),
    plosiveLevel: clamp(normalizedPickup * 0.16 + (example === "plosive" ? 0.035 : 0), 0.002, 0.26)
  };
}

function setParamNow(param: AudioParam, value: number, now: number) {
  const runtimeParam = param as AudioParam & {
    cancelScheduledValues?: (startTime: number) => AudioParam;
    setTargetAtTime?: (target: number, startTime: number, timeConstant: number) => AudioParam;
  };

  if (typeof runtimeParam.cancelScheduledValues === "function") {
    runtimeParam.cancelScheduledValues(now);
  }

  if (typeof runtimeParam.setTargetAtTime === "function") {
    runtimeParam.setTargetAtTime(value, now, 0.025);
    return;
  }

  param.setValueAtTime(value, now);
}

function applyLiveMicProfile(graph: ActiveMicAudio, profile: MicPlaybackProfile) {
  const now = graph.context.currentTime;

  setParamNow(graph.directGain.gain, profile.directLevel, now);
  setParamNow(graph.noiseGain.gain, profile.noiseLevel, now);
  setParamNow(graph.outputGain.gain, profile.outputLevel, now);
  setParamNow(graph.filter.frequency, profile.filterFrequency, now);
  setParamNow(graph.filter.Q, profile.filterQ, now);
  graph.shaper.curve = createDistortionCurve(profile.distortionAmount);

  if (graph.stopAt > now + 0.08) {
    graph.directGain.gain.linearRampToValueAtTime(0.0001, graph.stopAt);
    graph.noiseGain.gain.linearRampToValueAtTime(0.0001, graph.stopAt);
  }
}

function stopGraph(graph: ActiveMicAudio | null) {
  if (!graph) {
    return;
  }

  window.clearTimeout(graph.timeoutId);
  void graph.context.close();
}

function PrincipleDiagram({
  inputSpl,
  language,
  onInputSplChange,
  principle
}: {
  inputSpl: number;
  language: Language;
  onInputSplChange: (value: number) => void;
  principle: MicPrinciple;
}) {
  const copy = principleCopy[principle];
  const isArray = principle === "array";
  const isDigital = principle === "digitalMems";
  const isDynamic = principle === "dynamicVocal";
  const numericModel = getPrincipleNumericModel(principle, inputSpl, language);

  return (
    <section
      className="mic-principle-workbench"
      aria-label={localized(language, {
        zh: "麦克风工作原理可视化",
        en: "Microphone working principle visualization",
        ja: "マイクの動作原理の可視化",
        ko: "마이크 작동 원리 시각화"
      })}
    >
      <div className="mic-principle-visual">
        <svg
          aria-label={localized(language, {
            zh: `${copy.label.zh}工作原理图`,
            en: `${copy.label.en} principle diagram`,
            ja: `${copy.label.ja}の原理図`,
            ko: `${copy.label.ko} 원리 다이어그램`
          })}
          role="img"
          viewBox="0 0 760 360"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="micSignalGradient" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#7ee7d8" />
              <stop offset="100%" stopColor="#f0b46a" />
            </linearGradient>
            <marker id="signalArrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
              <path d="M0 0 8 4 0 8Z" fill="#f0b46a" />
            </marker>
          </defs>
          <rect className="lab-diagram-bg" height="360" rx="14" width="760" />
          <path className="mic-air-wave" d="M38 178 C62 126 86 126 110 178 S158 230 182 178" />
          <text className="lab-label" x="42" y="92">{localized(language, { zh: "声波", en: "Sound wave", ja: "音波", ko: "음파" })}</text>

          {isArray ? (
            <g>
              {[118, 178, 238, 298].map((y, index) => (
                <g key={y}>
                  <circle className="mic-array-capsule" cx="238" cy={y} r="14" />
                  <path className="mic-signal-line" d={`M110 ${178 + index * 8} C148 ${130 + index * 30} 188 ${y} 224 ${y}`} />
                  <text className="lab-label" x="258" y={y + 6}>{`Mic ${index + 1}`}</text>
                </g>
              ))}
              <rect className="mic-stage-box" height="78" rx="8" width="132" x="404" y="139" />
              <text className="mic-stage-text" x="424" y="172">{localized(language, { zh: "延时对齐", en: "Delay align", ja: "遅延整列", ko: "지연 정렬" })}</text>
              <text className="mic-stage-text" x="424" y="198">{localized(language, { zh: "加权求和", en: "Weighted sum", ja: "加重合算", ko: "가중 합산" })}</text>
              <path className="mic-signal-line" d="M326 118 C360 126 372 150 404 166" />
              <path className="mic-signal-line" d="M326 178 L404 178" />
              <path className="mic-signal-line" d="M326 238 C360 230 372 206 404 190" />
              <path className="mic-signal-line" d="M326 298 C370 286 388 220 404 202" />
              <path className="mic-signal-line" d="M536 178 L650 178" markerEnd="url(#signalArrow)" />
              <path className="mic-beam-shape" d="M594 178 C626 118 694 102 718 178 C694 254 626 238 594 178Z" />
            </g>
          ) : (
            <g>
              <rect className="mic-capsule-shell" height="150" rx="20" width="126" x="218" y="104" />
              <line className="mic-diaphragm-line" x1="258" x2="258" y1="124" y2="234" />
              <path className="mic-signal-line" d="M182 178 C202 160 216 154 246 154" markerEnd="url(#signalArrow)" />
              {isDynamic ? (
                <>
                  <path className="mic-coil" d="M278 132 C306 146 306 164 278 178 C306 192 306 210 278 224" />
                  <rect className="mic-magnet" height="118" rx="10" width="28" x="302" y="120" />
                  <text className="lab-label" x="286" y="270">{localized(language, { zh: "音圈 + 磁体", en: "Coil + magnet", ja: "ボイスコイル + 磁石", ko: "보이스 코일 + 자석" })}</text>
                </>
              ) : (
                <>
                  <line className="mic-backplate-line" x1="304" x2="304" y1="124" y2="234" />
                  <text className="lab-label" x="236" y="270">{localized(language, { zh: "振膜 / 背板电容", en: "Diaphragm / backplate C", ja: "振動板 / バックプレート容量", ko: "진동판 / 백플레이트 정전용량" })}</text>
                </>
              )}
              <rect className="mic-stage-box" height="74" rx="8" width="122" x="410" y="141" />
              <text className="mic-stage-text" x="431" y="172">
                {isDigital
                  ? localized(language, { zh: "ASIC", en: "ASIC", ja: "ASIC", ko: "ASIC" })
                  : isDynamic
                    ? localized(language, { zh: "前级", en: "Preamp", ja: "プリアンプ", ko: "프리앰프" })
                    : localized(language, { zh: "JFET", en: "JFET", ja: "JFET", ko: "JFET" })}
              </text>
              <text className="mic-stage-text" x="431" y="198">
                {isDigital
                  ? localized(language, { zh: "调制", en: "Modulate", ja: "変調", ko: "변조" })
                  : isDynamic
                    ? localized(language, { zh: "放大", en: "Gain", ja: "ゲイン", ko: "게인" })
                    : localized(language, { zh: "缓冲", en: "Buffer", ja: "バッファ", ko: "버퍼" })}
              </text>
              <path className="mic-signal-line" d="M344 178 L410 178" markerEnd="url(#signalArrow)" />
              <path className={isDigital ? "mic-pdm-line" : "mic-analog-line"} d={isDigital ? "M532 178 L548 156 L564 200 L580 156 L596 200 L612 156 L628 200 L644 178" : "M532 178 C552 138 572 138 592 178 S632 218 652 178"} />
              <text className="lab-label" x="550" y="248">{localized(language, copy.signal)}</text>
            </g>
          )}

          <g className="mic-stage-flow" transform="translate(54 312)">
            {copy.stages.map((stage, index) => (
              <g key={stage.en} transform={`translate(${index * 174} 0)`}>
                <rect height="32" rx="8" width="138" x="0" y="0" />
                <text x="14" y="21">{localized(language, stage)}</text>
                {index < copy.stages.length - 1 ? <path d="M142 16 L166 16" markerEnd="url(#signalArrow)" /> : null}
              </g>
            ))}
          </g>
        </svg>
        <section
          className="mic-principle-numeric"
          aria-label={localized(language, {
            zh: "麦克风数值链路",
            en: "Microphone numeric signal path",
            ja: "マイクの数値信号経路",
            ko: "마이크 수치 신호 경로"
          })}
        >
          <div className="mic-numeric-heading">
            <div>
              <span className="section-kicker">{localized(language, { zh: "数值链路", en: "Numeric path", ja: "数値経路", ko: "수치 경로" })}</span>
              <h3>{localized(language, { zh: "声压到电压是多少？", en: "How much voltage does SPL create?", ja: "音圧から電圧はいくらになる？", ko: "음압이 만드는 전압은 얼마일까?" })}</h3>
            </div>
            <p>{numericModel.assumption}</p>
          </div>
          <div className="lab-sliders mic-principle-numeric-slider">
            <label>
              <span>
                {localized(language, { zh: "输入声压", en: "Input SPL", ja: "入力音圧", ko: "입력 음압" })}
                <strong>{inputSpl} dBSPL</strong>
              </span>
              <input
                aria-label={localized(language, { zh: "工作原理输入声压", en: "Working principle input SPL", ja: "動作原理の入力音圧", ko: "작동 원리 입력 음압" })}
                max="124"
                min="54"
                step="1"
                type="range"
                value={inputSpl}
                onChange={(event) => onInputSplChange(Number(event.target.value))}
              />
            </label>
          </div>
          <div className="mic-numeric-flow">
            {numericModel.steps.map((step, index) => (
              <article className="mic-numeric-step" key={`${step.label}-${index}`}>
                <strong>{step.label}</strong>
                <span>{step.value}</span>
                <small>{step.note}</small>
              </article>
            ))}
          </div>
        </section>
      </div>
      <div className="mic-principle-copy">
        <div>
          <span className="section-kicker">{localized(language, { zh: "工作原理", en: "Working principle", ja: "動作原理", ko: "작동 원리" })}</span>
          <h2>{localized(language, copy.label)}</h2>
          <p>{localized(language, copy.subtitle)}</p>
        </div>
        <div className="mic-principle-core">
          <strong>{localized(language, copy.signal)}</strong>
          <p>{localized(language, copy.core)}</p>
          <span>{localized(language, copy.output)}</span>
        </div>
        <div className="mic-principle-notes">
          {copy.notes.map((note) => (
            <article key={note.en}>
              <p>{localized(language, note)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function MicrophoneLab({ language, onBack, onBackToDetails }: MicrophoneLabProps) {
  const [principle, setPrinciple] = useState<MicPrinciple>("electret");
  const [principleSpl, setPrincipleSpl] = useState(94);
  const [pattern, setPattern] = useState<PolarPattern>("cardioid");
  const [angle, setAngle] = useState(0);
  const [distance, setDistance] = useState(1.2);
  const [gain, setGain] = useState(52);
  const [example, setExample] = useState<MicExample>("near");
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<ActiveMicAudio | null>(null);
  const polar = useMemo(() => createPolarPath(pattern, angle), [angle, pattern]);
  const analysis = useMemo(
    () => getPickupAnalysis({ angle, distance, gain, pattern }),
    [angle, distance, gain, pattern]
  );
  const playbackProfile = useMemo(
    () => createMicPlaybackProfile({ analysis, distance, example, gain }),
    [analysis, distance, example, gain]
  );

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    applyLiveMicProfile(audioRef.current, playbackProfile);
  }, [playbackProfile]);

  useEffect(() => () => stopGraph(audioRef.current), []);

  function stopAudio() {
    stopGraph(audioRef.current);
    audioRef.current = null;
    setIsPlaying(false);
  }

  function playExample() {
    stopAudio();
    const AudioContextConstructor = window.AudioContext ?? window.webkitAudioContext;

    if (!AudioContextConstructor) {
      return;
    }

    const context = new AudioContextConstructor();
    const now = context.currentTime;
    const oscillator = context.createOscillator();
    const directGain = context.createGain();
    const filter = context.createBiquadFilter();
    const shaper = context.createWaveShaper();
    const outputGain = context.createGain();
    const noiseSource = context.createBufferSource();
    const noiseGain = context.createGain();
    const noiseFilter = context.createBiquadFilter();
    const stopAt = now + playbackProfile.duration;

    oscillator.type = "sawtooth";
    oscillator.frequency.setValueAtTime(playbackProfile.oscillatorFrequency, now);
    filter.type = example === "plosive" ? "bandpass" : "lowpass";
    filter.frequency.setValueAtTime(playbackProfile.filterFrequency, now);
    filter.Q.setValueAtTime(playbackProfile.filterQ, now);
    shaper.curve = createDistortionCurve(playbackProfile.distortionAmount);
    shaper.oversample = "4x";
    directGain.gain.setValueAtTime(0.0001, now);
    directGain.gain.linearRampToValueAtTime(playbackProfile.directLevel, now + 0.04);
    directGain.gain.linearRampToValueAtTime(0.0001, stopAt);
    outputGain.gain.setValueAtTime(playbackProfile.outputLevel, now);

    noiseSource.buffer = createNoiseBuffer(context, playbackProfile.duration, 0.72);
    noiseSource.loop = true;
    noiseFilter.type = "highpass";
    noiseFilter.frequency.setValueAtTime(example === "plosive" ? 120 : 520, now);
    noiseGain.gain.setValueAtTime(0.0001, now);
    noiseGain.gain.linearRampToValueAtTime(playbackProfile.noiseLevel, now + 0.04);
    noiseGain.gain.linearRampToValueAtTime(0.0001, stopAt);

    oscillator.connect(filter);
    filter.connect(shaper);
    shaper.connect(directGain);
    directGain.connect(outputGain);
    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(outputGain);
    outputGain.connect(context.destination);

    oscillator.start(now);
    oscillator.stop(stopAt + 0.02);
    noiseSource.start(now);
    noiseSource.stop(stopAt + 0.02);

    if (example === "plosive") {
      const burst = context.createOscillator();
      const burstGain = context.createGain();
      const burstFilter = context.createBiquadFilter();
      burst.type = "sine";
      burst.frequency.setValueAtTime(72, now);
      burstFilter.type = "lowpass";
      burstFilter.frequency.setValueAtTime(210, now);
      burstGain.gain.setValueAtTime(0.0001, now);
      burstGain.gain.linearRampToValueAtTime(playbackProfile.plosiveLevel, now + 0.03);
      burstGain.gain.linearRampToValueAtTime(0.0001, now + 0.22);
      burst.connect(burstFilter);
      burstFilter.connect(burstGain);
      burstGain.connect(outputGain);
      burst.start(now);
      burst.stop(now + 0.24);
    }

    const timeoutId = window.setTimeout(() => {
      audioRef.current = null;
      setIsPlaying(false);
    }, playbackProfile.duration * 1000 + 80);

    audioRef.current = { context, directGain, filter, noiseGain, outputGain, shaper, stopAt, timeoutId };
    setIsPlaying(true);
  }

  return (
    <main className="microphone-lab-page">
      <section className="sound-lab-hero" aria-labelledby="microphone-lab-title">
        <div className="sound-lab-back-actions">
        <button className="sound-lab-back sound-lab-back-secondary" type="button" onClick={onBack}>
          <ArrowLeft size={18} aria-hidden="true" />
          {localized(language, { zh: "返回知识库", en: "Back to knowledge base", ja: "ナレッジベースに戻る", ko: "지식 베이스로 돌아가기" })}
        </button>
        {onBackToDetails && <button className="sound-lab-back" type="button" onClick={onBackToDetails}>
          <ArrowLeft size={18} aria-hidden="true" />
          {localized(language, { zh: "返回详细内容", en: "Back to detailed content", ja: "詳細内容に戻る", ko: "상세 내용으로 돌아가기" })}
        </button>}
        </div>
        <div>
          <span className="section-kicker">{localized(language, { zh: "硬件实验", en: "Hardware lab", ja: "ハードウェア実験", ko: "하드웨어 실험" })}</span>
          <h1 id="microphone-lab-title">{localized(language, { zh: "麦克风指向性与拾音实验室", en: "Microphone Pickup Lab", ja: "マイク指向性と収音ラボ", ko: "마이크 지향성과 수음 실험실" })}</h1>
          <p>{localized(language, {
            zh: "用可视化方式理解指向性、角度、距离和增益如何影响拾音强度、噪声和削波风险。",
            en: "Use visual controls to understand how polar pattern, angle, distance, and gain affect pickup strength, noise, and clipping risk.",
            ja: "指向性、角度、距離、ゲインが収音レベル、ノイズ、クリッピングリスクに与える影響を可視化します。",
            ko: "지향성, 각도, 거리, 게인이 수음 강도와 노이즈, 클리핑 위험에 미치는 영향을 시각적으로 이해합니다."
          })}</p>
        </div>
      </section>

      <section className="mic-principle-section" aria-labelledby="mic-principle-heading">
        <div className="section-heading">
          <div>
            <h2 id="mic-principle-heading">{localized(language, { zh: "麦克风工作原理", en: "How Microphones Work", ja: "マイクの動作原理", ko: "마이크 작동 원리" })}</h2>
            <p>{localized(language, {
              zh: "对比模拟驻极体咪头、数字 MEMS 麦、动圈话筒和多麦阵列的信号路径。",
              en: "Compare signal paths for analog electret capsules, digital MEMS microphones, dynamic vocal microphones, and multi-mic arrays.",
              ja: "アナログのエレクトレットカプセル、デジタルMEMSマイク、ダイナミックボーカルマイク、多マイクアレイの信号経路を比較します。",
              ko: "아날로그 일렉트릿 캡슐, 디지털 MEMS 마이크, 다이내믹 보컬 마이크, 다중 마이크 어레이의 신호 경로를 비교합니다."
            })}</p>
          </div>
        </div>
        <div className="mic-principle-tabs" role="group" aria-label={localized(language, { zh: "麦克风工作原理类型", en: "Microphone principle type", ja: "マイク動作原理の種類", ko: "마이크 작동 원리 유형" })}>
          {(Object.keys(principleCopy) as MicPrinciple[]).map((type) => (
            <button
              className={principle === type ? "mic-principle-tab active" : "mic-principle-tab"}
              key={type}
              type="button"
              aria-pressed={principle === type}
              onClick={() => setPrinciple(type)}
            >
              {localized(language, principleCopy[type].label)}
            </button>
          ))}
        </div>
        <PrincipleDiagram
          inputSpl={principleSpl}
          language={language}
          principle={principle}
          onInputSplChange={setPrincipleSpl}
        />
      </section>

      <section className="microphone-lab-workbench" aria-label={localized(language, { zh: "麦克风拾音实验台", en: "Microphone pickup workbench", ja: "マイク収音ワークベンチ", ko: "마이크 수음 작업대" })}>
        <div className="microphone-visual">
          <div className="digital-lab-status">
            <strong>{localized(language, {
              zh: `指向性：${polarLabels[pattern].zh}`,
              en: `Pattern: ${polarLabels[pattern].en}`,
              ja: `指向性：${polarLabels[pattern].ja}`,
              ko: `지향성: ${polarLabels[pattern].ko}`
            })}</strong>
            <span>{localized(language, {
              zh: `拾音强度：${analysis.levelPercent}%`,
              en: `Pickup level: ${analysis.levelPercent}%`,
              ja: `収音レベル：${analysis.levelPercent}%`,
              ko: `수음 강도: ${analysis.levelPercent}%`
            })}</span>
          </div>
          <p className="mic-polar-legend">{localized(language, {
            zh: "外点：声源方向；内点：方向响应幅度。曲线仅表示理想指向性，不随距离或增益缩放。",
            en: "Outer dot: source direction. Inner dot: directional magnitude. The curve shows ideal directivity, independent of distance and gain.",
            ja: "外側の点は音源方向、内側の点は指向性の応答振幅です。曲線は理想的な指向性だけを示し、距離やゲインでは拡大縮小しません。",
            ko: "바깥 점은 음원 방향, 안쪽 점은 지향성 응답 크기입니다. 곡선은 이상적인 지향성만 나타내며 거리나 게인에 따라 확대되지 않습니다."
          })}</p>
          <div className="mic-polar-display">
          <svg
            aria-label={localized(language, { zh: "麦克风指向性极坐标图", en: "Microphone polar pattern chart", ja: "マイク指向性の極座標図", ko: "마이크 지향성 극좌표 그래프" })}
            role="img"
            viewBox="-20 0 420 400"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="micPolarFill" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#7ee7d8" stopOpacity="0.72" />
                <stop offset="100%" stopColor="#f0b46a" stopOpacity="0.58" />
              </linearGradient>
              <marker id="micArrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
                <path d="M0 0 8 4 0 8Z" fill="#f0b46a" />
              </marker>
            </defs>
            <rect className="lab-diagram-bg" x="-20" height="400" rx="14" width="420" />
            <g transform="translate(190 190)">
              {[50, 95, 142].map((radius) => (
                <circle className="mic-polar-grid" cx="0" cy="0" key={radius} r={radius} />
              ))}
              <line className="mic-polar-axis" x1="0" x2="0" y1="-160" y2="160" />
              <line className="mic-polar-axis" x1="-160" x2="160" y1="0" y2="0" />
              <text className="lab-label" x="-12" y="-170">0°</text>
              <text className="lab-label" x="170" y="6">90°</text>
              <text className="lab-label" x="-28" y="184">180°</text>
              <text className="lab-label" x="-170" y="6" textAnchor="end">-90°</text>
            </g>
            <path className="mic-polar-path" d={polar.path} />
            <circle className="mic-capsule" cx="190" cy="190" r="14" />
            <line className="mic-source-line" markerEnd="url(#micArrow)" x1="190" x2={polar.source.x.toFixed(2)} y1="190" y2={polar.source.y.toFixed(2)} />
            <circle className="mic-source-dot" cx={polar.source.x.toFixed(2)} cy={polar.source.y.toFixed(2)} r="10" />
            <circle className="mic-pickup-dot" cx={polar.pickup.x.toFixed(2)} cy={polar.pickup.y.toFixed(2)} r="6" />
          </svg>
          <dl className="mic-pickup-readouts" aria-label={localized(language, { zh: "拾音教学结果", en: "Pickup teaching results", ja: "収音学習結果", ko: "수음 학습 결과" })}>
            <div><dt>{localized(language, { zh: "角度", en: "Angle", ja: "角度", ko: "각도" })}</dt><dd>{angle}°</dd></div>
            <div><dt>{localized(language, { zh: "距离", en: "Distance", ja: "距離", ko: "거리" })}</dt><dd>{distance.toFixed(1)} m</dd></div>
            <div><dt>{localized(language, { zh: "增益旋钮", en: "Gain control", ja: "ゲイン調整", ko: "게인 조절" })}</dt><dd>{gain}%</dd></div>
            <div><dt>{localized(language, { zh: "拾音强度", en: "Pickup level", ja: "収音レベル", ko: "수음 강도" })}</dt><dd>{analysis.levelPercent}%</dd></div>
            <div><dt>{localized(language, { zh: "清晰度评分", en: "Clarity score", ja: "明瞭度スコア", ko: "선명도 점수" })}</dt><dd>{analysis.clarity}%</dd></div>
            <div><dt>{localized(language, { zh: "噪声风险评分", en: "Noise risk score", ja: "ノイズリスクスコア", ko: "노이즈 위험 점수" })}</dt><dd>{analysis.noiseRisk}%</dd></div>
            <div><dt>{localized(language, { zh: "削波风险评分", en: "Clipping risk score", ja: "クリッピングリスクスコア", ko: "클리핑 위험 점수" })}</dt><dd>{analysis.clippingRisk}%</dd></div>
          </dl>
          </div>
          <p className="mic-polar-legend">{localized(language, {
            zh: "教学模型：评分不是实测 SNR、失真或概率，增益百分比不是 dB。试听为合成信号；距离采用有近场限幅的 1/r 近似，不模拟真实房间。8 字形只展示响应幅度，不演示背瓣的极性反转。",
            en: "Teaching model: scores are not measured SNR, distortion, or probabilities; gain percentage is not dB. Playback is synthetic. Distance uses a near-field-clamped 1/r approximation, not a real room. Figure-8 shows magnitude only, not rear-lobe polarity reversal.",
            ja: "教育用モデル：スコアは実測SNR、歪み、確率ではなく、ゲインの百分率はdBではありません。再生音は合成信号です。距離は近接場で制限した1/r近似で、実際の部屋は再現しません。8の字は振幅だけを示し、背面ローブの極性反転は表しません。",
            ko: "교육용 모델입니다. 점수는 실측 SNR, 왜곡 또는 확률이 아니며 게인 백분율은 dB가 아닙니다. 재생음은 합성 신호입니다. 거리는 근접장 제한이 있는 1/r 근사이며 실제 공간은 모델링하지 않습니다. 8자형은 크기만 나타내고 후면 로브의 극성 반전은 나타내지 않습니다."
          })}</p>
        </div>

        <div className="microphone-panel">
          <div className="waveform-tabs" role="group" aria-label={localized(language, { zh: "麦克风指向性", en: "Microphone polar pattern", ja: "マイク指向性", ko: "마이크 지향성" })}>
            {(Object.keys(polarLabels) as PolarPattern[]).map((type) => (
              <button
                className={pattern === type ? "waveform-tab active" : "waveform-tab"}
                key={type}
                type="button"
                aria-pressed={pattern === type}
                onClick={() => setPattern(type)}
              >
                {localized(language, polarLabels[type])}
              </button>
            ))}
          </div>

          <div className="lab-sliders">
            <label>
              <span>
                {localized(language, { zh: "声源角度", en: "Source angle", ja: "音源角度", ko: "음원 각도" })}
                <strong>{angle}°</strong>
              </span>
              <input
                aria-label={localized(language, { zh: "声源角度", en: "Source angle", ja: "音源角度", ko: "음원 각도" })}
                max="180"
                min="-180"
                step="5"
                type="range"
                value={angle}
                onChange={(event) => setAngle(Number(event.target.value))}
              />
            </label>
            <label>
              <span>
                {localized(language, { zh: "拾音距离", en: "Pickup distance", ja: "収音距離", ko: "수음 거리" })}
                <strong>{distance.toFixed(1)} m</strong>
              </span>
              <input
                aria-label={localized(language, { zh: "拾音距离", en: "Pickup distance", ja: "収音距離", ko: "수음 거리" })}
                max="4"
                min="0.2"
                step="0.1"
                type="range"
                value={distance}
                onChange={(event) => setDistance(Number(event.target.value))}
              />
            </label>
            <label>
              <span>
                {localized(language, { zh: "前级增益", en: "Preamp gain", ja: "プリアンプゲイン", ko: "프리앰프 게인" })}
                <strong>{gain}%</strong>
              </span>
              <input
                aria-label={localized(language, { zh: "前级增益", en: "Preamp gain", ja: "プリアンプゲイン", ko: "프리앰프 게인" })}
                max="100"
                min="10"
                step="2"
                type="range"
                value={gain}
                onChange={(event) => setGain(Number(event.target.value))}
              />
            </label>
          </div>

          <div className="mic-example-grid" role="group" aria-label={localized(language, { zh: "拾音问题示例", en: "Pickup examples", ja: "収音の問題例", ko: "수음 문제 예시" })}>
            {(Object.keys(exampleLabels) as MicExample[]).map((item) => (
              <button
                className={example === item ? "waveform-tab active" : "waveform-tab"}
                key={item}
                type="button"
                onClick={() => setExample(item)}
              >
                {localized(language, exampleLabels[item])}
              </button>
            ))}
          </div>

          <div className="sound-lab-actions">
            <button className="sine-button" type="button" onClick={playExample}>
              <Play size={16} aria-hidden="true" />
              {localized(language, { zh: "播放拾音示例", en: "Play pickup example", ja: "収音例を再生", ko: "수음 예시 재생" })}
            </button>
            <button className="sine-button" type="button" onClick={stopAudio}>
              <Pause size={16} aria-hidden="true" />
              {localized(language, { zh: "停止", en: "Stop", ja: "停止", ko: "중지" })}
            </button>
            <span className={isPlaying ? "sine-status playing" : "sine-status"}>
              {isPlaying
                ? localized(language, { zh: "播放中", en: "Playing", ja: "再生中", ko: "재생 중" })
                : localized(language, { zh: "未播放", en: "Stopped", ja: "停止中", ko: "정지됨" })}
            </span>
          </div>

          <div className="lab-live-note">
            <strong>{localized(language, exampleLabels[example])}</strong>
            <span>{localized(language, exampleNotes[example])}</span>
          </div>
        </div>
      </section>

    </main>
  );
}
