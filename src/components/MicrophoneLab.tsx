import { traditional } from "../content/traditional";
import { useLabState } from "../hooks/useLabState";
import { useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import type { Language } from "../content/knowledge";
import { bitStreamPath, getMicrophoneSignal, makePdmBits, pcmWavePath, pcmWordBits, type MicPrinciple } from "./microphoneSignalModel";

type SupportedLanguage = "zh" | "en" | "ja" | "ko" | "zh-Hant";
type LocalizedText = Record<SupportedLanguage, string>;

const localized = (language: Language, values: LocalizedText) => values[language as SupportedLanguage];

type MicrophoneLabProps = {
  language: Language;
  onBack: () => void;
  onBackToDetails?: () => void;
};

type PolarPattern = "omni" | "cardioid" | "figure8";


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
  omni: { zh: "全指向", "zh-Hant": traditional("全指向"), en: "Omnidirectional", ja: "無指向性", ko: "무지향성" },
  cardioid: { zh: "心形", "zh-Hant": traditional("心形"), en: "Cardioid", ja: "カーディオイド", ko: "카디오이드" },
  figure8: { zh: "8 字形", "zh-Hant": traditional("8 字形"), en: "Figure-8", ja: "8の字", ko: "8자형" }
};


const principleCopy: Record<MicPrinciple, PrincipleCopy> = {
  electret: {
    label: { zh: "模拟驻极体咪头", "zh-Hant": traditional("模拟驻极体咪头"), en: "Analog electret capsule", ja: "アナログ・エレクトレットカプセル", ko: "아날로그 일렉트릿 캡슐" },
    subtitle: {
      zh: "常见于耳机线控、录音笔、低成本采集模块和嵌入式设备。", "zh-Hant": traditional("常见于耳机线控、录音笔、低成本采集模块和嵌入式设备。"),
      en: "Common in headset remotes, recorders, low-cost capture modules, and embedded devices.",
      ja: "ヘッドセットのリモコン、レコーダー、低コスト収音モジュール、組み込み機器でよく使われます。",
      ko: "헤드셋 리모컨, 레코더, 저가 캡처 모듈, 임베디드 장치에서 흔히 사용됩니다."
    },
    signal: { zh: "输出：模拟电压", "zh-Hant": traditional("输出：模拟电压"), en: "Output: analog voltage", ja: "出力：アナログ電圧", ko: "출력: 아날로그 전압" },
    output: { zh: "需要偏置电阻、耦合电容、前级放大和 ADC。", "zh-Hant": traditional("需要偏置电阻、耦合电容、前级放大和 ADC。"), en: "Needs bias resistor, coupling capacitor, preamp, and ADC.", ja: "バイアス抵抗、結合コンデンサー、プリアンプ、ADCが必要です。", ko: "바이어스 저항, 결합 커패시터, 프리앰프, ADC가 필요합니다." },
    core: {
      zh: "驻极体材料预先带电，声压推动振膜改变电容，内部 JFET 把高阻抗微弱信号缓冲成可用模拟电压。", "zh-Hant": traditional("驻极体材料预先带电，声压推动振膜改变电容，内部 JFET 把高阻抗微弱信号缓冲成可用模拟电压。"),
      en: "Electret material holds charge; sound moves the diaphragm and changes capacitance, while an internal JFET buffers the weak high-impedance signal into usable analog voltage.",
      ja: "エレクトレット材料が電荷を保持し、音圧が振動板を動かして静電容量を変えます。内部JFETが高インピーダンスの微弱信号をバッファし、扱いやすいアナログ電圧にします。",
      ko: "일렉트릿 재료가 전하를 유지하고 음압이 진동판을 움직여 정전용량을 바꿉니다. 내부 JFET가 고임피던스 미약 신호를 버퍼링해 사용할 수 있는 아날로그 전압으로 만듭니다."
    },
    stages: [
      { zh: "声压", "zh-Hant": traditional("声压"), en: "Pressure", ja: "音圧", ko: "음압" },
      { zh: "振膜电容", "zh-Hant": traditional("振膜电容"), en: "Capsule C", ja: "カプセルC", ko: "캡슐 C" },
      { zh: "JFET 缓冲", "zh-Hant": traditional("JFET 缓冲"), en: "JFET buffer", ja: "JFETバッファ", ko: "JFET 버퍼" },
      { zh: "模拟电压", "zh-Hant": traditional("模拟电压"), en: "Analog V", ja: "アナログ電圧", ko: "아날로그 전압" }
    ],
    notes: [
      { zh: "优点是便宜、小巧、接口简单。", "zh-Hant": traditional("优点是便宜、小巧、接口简单。"), en: "Small, cheap, and simple to interface.", ja: "安価で小型、インターフェースが簡単です。", ko: "저렴하고 작으며 인터페이스가 간단합니다." },
      { zh: "缺点是易受布线、偏置、电源噪声和前级质量影响。", "zh-Hant": traditional("缺点是易受布线、偏置、电源噪声和前级质量影响。"), en: "Sensitive to wiring, bias, power noise, and preamp quality.", ja: "配線、バイアス、電源ノイズ、プリアンプの品質に左右されやすいです。", ko: "배선, 바이어스, 전원 잡음, 프리앰프 품질의 영향을 받기 쉽습니다." }
    ]
  },
  digitalMems: {
    label: { zh: "数字 MEMS 麦", "zh-Hant": traditional("数字 MEMS 麦"), en: "Digital MEMS mic", ja: "デジタルMEMSマイク", ko: "디지털 MEMS 마이크" },
    subtitle: {
      zh: "常见于手机、TWS 耳机、智能音箱、笔记本和车载语音。", "zh-Hant": traditional("常见于手机、TWS 耳机、智能音箱、笔记本和车载语音。"),
      en: "Common in phones, TWS earbuds, smart speakers, laptops, and vehicle voice systems.",
      ja: "スマートフォン、TWSイヤホン、スマートスピーカー、ノートPC、車載音声システムでよく使われます。",
      ko: "스마트폰, TWS 이어버드, 스마트 스피커, 노트북, 차량 음성 시스템에서 흔히 사용됩니다."
    },
    signal: { zh: "输出：PDM / I2S", "zh-Hant": traditional("输出：PDM / I2S"), en: "Output: PDM / I2S", ja: "出力：PDM / I2S", ko: "출력: PDM / I2S" },
    output: { zh: "芯片内完成前端放大和调制，主控直接接收数字音频数据。", "zh-Hant": traditional("芯片内完成前端放大和调制，主控直接接收数字音频数据。"), en: "Front-end amplification and modulation happen on chip, so the host receives digital audio data directly.", ja: "前段増幅と変調をチップ内で行うため、ホストはデジタルオーディオデータを直接受信します。", ko: "전단 증폭과 변조가 칩 내부에서 이루어져 호스트가 디지털 오디오 데이터를 직접 받습니다." },
    core: {
      zh: "MEMS 振膜和 ASIC 集成在封装内，声压改变微结构电容，芯片内部放大并通过 Σ-Δ 调制输出 PDM，或进一步抽取成 I2S PCM。", "zh-Hant": traditional("MEMS 振膜和 ASIC 集成在封装内，声压改变微结构电容，芯片内部放大并通过 Σ-Δ 调制输出 PDM，或进一步抽取成 I2S PCM。"),
      en: "A MEMS diaphragm and ASIC share one package. Pressure changes micro-capacitance, the ASIC amplifies it, then sigma-delta modulation outputs PDM or decimated I2S PCM.",
      ja: "MEMS振動板とASICを一つのパッケージに集積します。音圧で微小な静電容量が変化し、ASICが増幅した後、Σ-Δ変調でPDMを出力するか、さらにデシメーションしてI2S PCMにします。",
      ko: "MEMS 진동판과 ASIC가 하나의 패키지에 통합됩니다. 음압이 미세 정전용량을 바꾸면 ASIC가 증폭하고 Σ-Δ 변조로 PDM을 출력하거나 데시메이션해 I2S PCM으로 만듭니다."
    },
    stages: [
      { zh: "MEMS 振膜", "zh-Hant": traditional("MEMS 振膜"), en: "MEMS diaphragm", ja: "MEMS振動板", ko: "MEMS 진동판" },
      { zh: "ASIC 前端", "zh-Hant": traditional("ASIC 前端"), en: "ASIC front end", ja: "ASIC前段", ko: "ASIC 전단" },
      { zh: "Σ-Δ 调制", "zh-Hant": traditional("Σ-Δ 调制"), en: "Sigma-delta", ja: "Σ-Δ変調", ko: "Σ-Δ 변조" },
      { zh: "PDM / I2S", "zh-Hant": traditional("PDM / I2S"), en: "PDM / I2S", ja: "PDM / I2S", ko: "PDM / I2S" }
    ],
    notes: [
      { zh: "数字输出抗模拟布线干扰，更适合小体积多麦设计。", "zh-Hant": traditional("数字输出抗模拟布线干扰，更适合小体积多麦设计。"), en: "Digital output resists analog wiring noise and suits compact multi-mic designs.", ja: "デジタル出力はアナログ配線ノイズに強く、小型の複数マイク設計に向きます。", ko: "디지털 출력은 아날로그 배선 잡음에 강해 소형 다중 마이크 설계에 적합합니다." },
      { zh: "需要关注时钟、左右声道配置、PDM 抽取和封装声孔设计。", "zh-Hant": traditional("需要关注时钟、左右声道配置、PDM 抽取和封装声孔设计。"), en: "Clocking, left/right configuration, PDM decimation, and acoustic port design matter.", ja: "クロック、左右チャンネル設定、PDMデシメーション、パッケージの音響ポート設計が重要です。", ko: "클록, 좌우 채널 설정, PDM 데시메이션, 패키지 음향 포트 설계를 확인해야 합니다." }
    ]
  },
  dynamicVocal: {
    label: { zh: "动圈话筒", "zh-Hant": traditional("动圈话筒"), en: "Dynamic vocal mic", ja: "ダイナミックボーカルマイク", ko: "다이내믹 보컬 마이크" },
    subtitle: {
      zh: "常见于舞台演出、K 歌、人声近讲、鼓和吉他箱体。", "zh-Hant": traditional("常见于舞台演出、K 歌、人声近讲、鼓和吉他箱体。"),
      en: "Common for stage performance, karaoke, close vocals, drums, and guitar cabinets.",
      ja: "ステージ、カラオケ、近接ボーカル、ドラム、ギターキャビネットでよく使われます。",
      ko: "무대 공연, 노래방, 근접 보컬, 드럼, 기타 캐비닛에 흔히 사용됩니다."
    },
    signal: { zh: "输出：低电平模拟电压", "zh-Hant": traditional("输出：低电平模拟电压"), en: "Output: low-level analog voltage", ja: "出力：低レベルのアナログ電圧", ko: "출력: 저레벨 아날로그 전압" },
    output: { zh: "不需要幻象电源，但通常需要更高前级增益。", "zh-Hant": traditional("不需要幻象电源，但通常需要更高前级增益。"), en: "Needs no phantom power, but usually requires more preamp gain.", ja: "ファンタム電源は不要ですが、通常はより高いプリアンプゲインが必要です。", ko: "팬텀 전원은 필요 없지만 보통 더 높은 프리앰프 이득이 필요합니다." },
    core: {
      zh: "振膜连接轻质线圈，线圈在磁场中随声音运动并感应出电压。结构坚固、抗大声压，但灵敏度通常低于电容麦。", "zh-Hant": traditional("振膜连接轻质线圈，线圈在磁场中随声音运动并感应出电压。结构坚固、抗大声压，但灵敏度通常低于电容麦。"),
      en: "A diaphragm moves a lightweight coil inside a magnetic field, inducing voltage. It is rugged and handles high SPL, but is usually less sensitive than condenser microphones.",
      ja: "振動板が軽いコイルを磁界内で動かし、電圧を誘導します。頑丈で大音圧に耐えますが、通常はコンデンサーマイクより感度が低いです。",
      ko: "진동판이 가벼운 코일을 자기장 안에서 움직여 전압을 유도합니다. 튼튼하고 높은 SPL을 견디지만 보통 콘덴서 마이크보다 감도가 낮습니다."
    },
    stages: [
      { zh: "振膜", "zh-Hant": traditional("振膜"), en: "Diaphragm", ja: "振動板", ko: "진동판" },
      { zh: "音圈", "zh-Hant": traditional("音圈"), en: "Voice coil", ja: "ボイスコイル", ko: "보이스 코일" },
      { zh: "磁场感应", "zh-Hant": traditional("磁场感应"), en: "Magnetic induction", ja: "電磁誘導", ko: "전자기 유도" },
      { zh: "前级增益", "zh-Hant": traditional("前级增益"), en: "Preamp gain", ja: "プリアンプゲイン", ko: "프리앰프 이득" }
    ],
    notes: [
      { zh: "适合近距离、大声压和嘈杂环境。", "zh-Hant": traditional("适合近距离、大声压和嘈杂环境。"), en: "Good for close distance, high SPL, and noisy environments.", ja: "近距離、大音圧、騒がしい環境に向きます。", ko: "근거리, 높은 SPL, 시끄러운 환경에 적합합니다." },
      { zh: "离嘴太远时电平会低，房间声和底噪会更明显。", "zh-Hant": traditional("离嘴太远时电平会低，房间声和底噪会更明显。"), en: "Too much distance lowers level and reveals room sound and noise.", ja: "口元から離れすぎるとレベルが下がり、部屋の音とノイズが目立ちます。", ko: "입에서 너무 멀어지면 레벨이 낮아지고 공간음과 잡음이 더 드러납니다." }
    ]
  },
  array: {
    label: { zh: "多麦阵列", "zh-Hant": traditional("多麦阵列"), en: "Multi-mic array", ja: "マルチマイクアレイ", ko: "다중 마이크 어레이" },
    subtitle: {
      zh: "常见于会议设备、智能音箱、手机免提、TWS 耳机和车载座舱。", "zh-Hant": traditional("常见于会议设备、智能音箱、手机免提、TWS 耳机和车载座舱。"),
      en: "Common in conference devices, smart speakers, phone speaker mode, TWS earbuds, and vehicle cabins.",
      ja: "会議機器、スマートスピーカー、スマートフォンのスピーカーモード、TWSイヤホン、車載キャビンでよく使われます。",
      ko: "회의 장치, 스마트 스피커, 휴대폰 스피커 모드, TWS 이어버드, 차량 캐빈에서 흔히 사용됩니다."
    },
    signal: { zh: "输出：增强后的目标声", "zh-Hant": traditional("输出：增强后的目标声"), en: "Output: enhanced target voice", ja: "出力：強調された目標音声", ko: "출력: 강화된 목표 음성" },
    output: { zh: "多路麦克风同步采集后，算法利用时间差和相位差增强目标方向。", "zh-Hant": traditional("多路麦克风同步采集后，算法利用时间差和相位差增强目标方向。"), en: "Multiple synchronized microphones use time and phase differences to enhance the target direction.", ja: "複数のマイクで同期収音し、アルゴリズムが時間差と位相差を使って目標方向を強調します。", ko: "여러 마이크가 동기화되어 수음한 뒤 알고리즘이 시간차와 위상차로 목표 방향을 강화합니다." },
    core: {
      zh: "声源到每颗麦克风的距离不同，到达时间和相位也不同。延时对齐并加权求和可形成波束，增强目标方向并衰减部分离轴干扰；这不等同于使用播放参考的 AEC 回声消除。", "zh-Hant": traditional("声源到每颗麦克风的距离不同，到达时间和相位也不同。延时对齐并加权求和可形成波束，增强目标方向并衰减部分离轴干扰；这不等同于使用播放参考的 AEC 回声消除。"),
      en: "A source reaches each microphone at different times and phases. Delay alignment and weighted summation form a beam that favors a target direction and attenuates some off-axis interference; this is not playback-reference AEC.",
      ja: "音源から各マイクまでの距離が異なるため、到達時間と位相も異なります。遅延をそろえて重み付き加算するとビームが形成され、目標方向を強調し一部の軸外干渉を抑えます。これは再生リファレンスを使うAECとは異なります。",
      ko: "음원에서 각 마이크까지의 거리가 달라 도달 시간과 위상도 다릅니다. 지연을 맞춰 가중 합산하면 빔이 형성되어 목표 방향을 강화하고 일부 축외 간섭을 줄입니다. 이는 재생 참조를 사용하는 AEC와 다릅니다."
    },
    stages: [
      { zh: "多路采集", "zh-Hant": traditional("多路采集"), en: "Multi capture", ja: "複数チャンネル収音", ko: "다중 채널 캡처" },
      { zh: "时间差", "zh-Hant": traditional("时间差"), en: "Time delay", ja: "時間差", ko: "시간 지연" },
      { zh: "波束形成", "zh-Hant": traditional("波束形成"), en: "Beamforming", ja: "ビームフォーミング", ko: "빔포밍" },
      { zh: "目标语音", "zh-Hant": traditional("目标语音"), en: "Target voice", ja: "目標音声", ko: "목표 음성" }
    ],
    notes: [
      { zh: "阵列能力依赖麦间距、同步时钟、安装位置和算法。", "zh-Hant": traditional("阵列能力依赖麦间距、同步时钟、安装位置和算法。"), en: "Array performance depends on mic spacing, sync clock, placement, and algorithms.", ja: "アレイ性能はマイク間隔、同期クロック、配置、アルゴリズムに左右されます。", ko: "어레이 성능은 마이크 간격, 동기 클록, 배치, 알고리즘에 좌우됩니다." },
      { zh: "后续可继续接入 AEC、NS、DOA 和声源分离。", "zh-Hant": traditional("后续可继续接入 AEC、NS、DOA 和声源分离。"), en: "It can extend into AEC, noise suppression, DOA, and source separation.", ja: "後段でAEC、ノイズ抑制、DOA、音源分離へ拡張できます。", ko: "후단에서 AEC, 잡음 억제, DOA, 음원 분리로 확장할 수 있습니다." }
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

function formatPascal(value: number) {
  return `${value.toFixed(3)} Pa`;
}

function formatMillivolts(valueVrms: number) {
  return `${(valueVrms * 1000).toFixed(2)} mVrms`;
}

function formatDb(value: number) {
  return `${value.toFixed(1)} dB`;
}

function digitalLevelNote(dbfs: number, language: Language) {
  return dbfs > 1e-9 ? localized(language, {
    zh: `已过载：理论需求超出满量程 ${formatDb(dbfs)}，PCM 削波`, "zh-Hant": traditional(`已过载：理论需求超出满量程 ${formatDb(dbfs)}，PCM 削波`),
    en: `Overload: linear demand exceeds full scale by ${formatDb(dbfs)}; PCM clips`,
    ja: `過負荷：線形推定はフルスケールを${formatDb(dbfs)}超え、PCMはクリップ`,
    ko: `과부하: 선형 추정이 풀 스케일을 ${formatDb(dbfs)} 초과하여 PCM 클리핑`
  }) : localized(language, { zh: `约 ${formatDb(dbfs)}FS`, "zh-Hant": traditional(`约 ${formatDb(dbfs)}FS`), en: `About ${formatDb(dbfs)}FS`, ja: `約${formatDb(dbfs)}FS`, ko: `약 ${formatDb(dbfs)}FS` });
}

function getElectretNumericModel(inputSpl: number, language: Language): MicNumericModel {
  const { pressurePa, microphoneVrms, preampVrms, requestedDbfs } = getMicrophoneSignal("electret", inputSpl);

  return {
    assumption: localized(language, { zh: "教学近似：-44 dBV/Pa，20 dB 前级，1 Vrms ADC 满量程", "zh-Hant": traditional("教学近似：-44 dBV/Pa，20 dB 前级，1 Vrms ADC 满量程"), en: "Teaching approximation: -44 dBV/Pa, 20 dB preamp, 1 Vrms ADC full scale", ja: "教育用近似：-44 dBV/Pa、20 dBプリアンプ、1 Vrms ADCフルスケール", ko: "교육용 근사: -44 dBV/Pa, 20 dB 프리앰프, 1 Vrms ADC 풀 스케일" }),
    steps: [
      {
        label: localized(language, { zh: "声波输入", "zh-Hant": traditional("声波输入"), en: "Sound input", ja: "音波入力", ko: "음파 입력" }),
        note: localized(language, { zh: `声压：${formatPascal(pressurePa)}`, "zh-Hant": traditional(`声压：${formatPascal(pressurePa)}`), en: `Pressure: ${formatPascal(pressurePa)}`, ja: `音圧：${formatPascal(pressurePa)}`, ko: `음압: ${formatPascal(pressurePa)}` }),
        value: localized(language, { zh: `输入声压：${inputSpl} dBSPL`, "zh-Hant": traditional(`输入声压：${inputSpl} dBSPL`), en: `Input SPL: ${inputSpl} dBSPL`, ja: `入力音圧：${inputSpl} dBSPL`, ko: `입력 음압: ${inputSpl} dBSPL` })
      },
      {
        label: localized(language, { zh: "JFET 输出", "zh-Hant": traditional("JFET 输出"), en: "JFET output", ja: "JFET出力", ko: "JFET 출력" }),
        note: localized(language, { zh: "按咪头整体灵敏度计算；含 JFET 与规定负载，不假定内部固定增益", "zh-Hant": traditional("按咪头整体灵敏度计算；含 JFET 与规定负载，不假定内部固定增益"), en: "From overall capsule sensitivity, including JFET and specified load; no fixed internal gain assumed", ja: "JFETと規定負荷を含むカプセル感度から計算。内部の固定ゲインは仮定しません", ko: "JFET와 규정 부하를 포함한 캡슐 감도로 계산하며 내부 고정 이득은 가정하지 않음" }),
        value: formatMillivolts(microphoneVrms)
      },
      {
        label: localized(language, { zh: "20 dB 前级后", "zh-Hant": traditional("20 dB 前级后"), en: "After 20 dB preamp", ja: "20 dBプリアンプ後", ko: "20 dB 프리앰프 후" }),
        note: digitalLevelNote(requestedDbfs, language),
        value: formatMillivolts(preampVrms)
      }
    ]
  };
}

function getPrincipleNumericModel(principle: MicPrinciple, inputSpl: number, language: Language): MicNumericModel {
  const { pressurePa, microphoneVrms, preampVrms, requestedDbfs, arrayNoiseRatio, arraySnrGainDb } = getMicrophoneSignal(principle, inputSpl);

  if (principle === "digitalMems") {
    return {
      assumption: localized(language, { zh: "教学近似：数字 MEMS 在 94 dB SPL 时约 -26 dBFS，ASIC 内部完成放大和调制", "zh-Hant": traditional("教学近似：数字 MEMS 在 94 dB SPL 时约 -26 dBFS，ASIC 内部完成放大和调制"), en: "Teaching approximation: digital MEMS about -26 dBFS at 94 dB SPL, with gain and modulation inside the ASIC", ja: "教育用近似：デジタルMEMSは94 dB SPLで約-26 dBFS、ASIC内部で増幅と変調を実行", ko: "교육용 근사: 디지털 MEMS는 94 dB SPL에서 약 -26 dBFS, ASIC 내부에서 증폭과 변조 수행" }),
      steps: [
        {
          label: localized(language, { zh: "声波输入", "zh-Hant": traditional("声波输入"), en: "Sound input", ja: "音波入力", ko: "음파 입력" }),
          note: localized(language, { zh: `声压：${formatPascal(pressurePa)}`, "zh-Hant": traditional(`声压：${formatPascal(pressurePa)}`), en: `Pressure: ${formatPascal(pressurePa)}`, ja: `音圧：${formatPascal(pressurePa)}`, ko: `음압: ${formatPascal(pressurePa)}` }),
          value: localized(language, { zh: `输入声压：${inputSpl} dBSPL`, "zh-Hant": traditional(`输入声压：${inputSpl} dBSPL`), en: `Input SPL: ${inputSpl} dBSPL`, ja: `入力音圧：${inputSpl} dBSPL`, ko: `입력 음압: ${inputSpl} dBSPL` })
        },
        {
          label: localized(language, { zh: "MEMS 电容", "zh-Hant": traditional("MEMS 电容"), en: "MEMS capacitance", ja: "MEMS静電容量", ko: "MEMS 정전용량" }),
          note: localized(language, { zh: "微结构电容变化进入 ASIC 前端", "zh-Hant": traditional("微结构电容变化进入 ASIC 前端"), en: "Micro-capacitance change enters the ASIC front end", ja: "微細構造の静電容量変化がASIC前段に入ります", ko: "미세 구조 정전용량 변화가 ASIC 전단으로 들어갑니다" }),
          value: localized(language, { zh: "片内模拟信号", "zh-Hant": traditional("片内模拟信号"), en: "On-chip analog signal", ja: "チップ内アナログ信号", ko: "칩 내부 아날로그 신호" })
        },
        {
          label: localized(language, { zh: "Σ-Δ 调制", "zh-Hant": traditional("Σ-Δ 调制"), en: "Sigma-delta", ja: "Σ-Δ変調", ko: "Σ-Δ 변조" }),
          note: localized(language, { zh: "把模拟量调制成高速 1-bit PDM", "zh-Hant": traditional("把模拟量调制成高速 1-bit PDM"), en: "Converts analog level into high-rate 1-bit PDM", ja: "アナログ量を高速1-bit PDMへ変調します", ko: "아날로그 값을 고속 1-bit PDM으로 변조합니다" }),
          value: localized(language, { zh: "PDM 1-bit 流", "zh-Hant": traditional("PDM 1-bit 流"), en: "PDM 1-bit stream", ja: "PDM 1-bitストリーム", ko: "PDM 1-bit 스트림" })
        },
        {
          label: localized(language, { zh: "抽取后 PCM", "zh-Hant": traditional("抽取后 PCM"), en: "Decimated PCM", ja: "デシメーション後PCM", ko: "데시메이션 후 PCM" }),
          note: digitalLevelNote(requestedDbfs, language),
          value: localized(language, { zh: "多 bit 采样值", "zh-Hant": traditional("多 bit 采样值"), en: "Multi-bit samples", ja: "マルチビットサンプル", ko: "멀티비트 샘플" })
        }
      ]
    };
  }

  if (principle === "dynamicVocal") {
    return {
      assumption: localized(language, { zh: "教学近似：动圈约 -54 dBV/Pa，40 dB 前级，1 Vrms ADC 满量程", "zh-Hant": traditional("教学近似：动圈约 -54 dBV/Pa，40 dB 前级，1 Vrms ADC 满量程"), en: "Teaching approximation: dynamic mic about -54 dBV/Pa, 40 dB preamp, 1 Vrms ADC full scale", ja: "教育用近似：ダイナミックマイク約-54 dBV/Pa、40 dBプリアンプ、1 Vrms ADCフルスケール", ko: "교육용 근사: 다이내믹 마이크 약 -54 dBV/Pa, 40 dB 프리앰프, 1 Vrms ADC 풀 스케일" }),
      steps: [
        {
          label: localized(language, { zh: "声波输入", "zh-Hant": traditional("声波输入"), en: "Sound input", ja: "音波入力", ko: "음파 입력" }),
          note: localized(language, { zh: `声压：${formatPascal(pressurePa)}`, "zh-Hant": traditional(`声压：${formatPascal(pressurePa)}`), en: `Pressure: ${formatPascal(pressurePa)}`, ja: `音圧：${formatPascal(pressurePa)}`, ko: `음압: ${formatPascal(pressurePa)}` }),
          value: localized(language, { zh: `输入声压：${inputSpl} dBSPL`, "zh-Hant": traditional(`输入声压：${inputSpl} dBSPL`), en: `Input SPL: ${inputSpl} dBSPL`, ja: `入力音圧：${inputSpl} dBSPL`, ko: `입력 음압: ${inputSpl} dBSPL` })
        },
        {
          label: localized(language, { zh: "音圈感应", "zh-Hant": traditional("音圈感应"), en: "Coil induction", ja: "コイル誘導", ko: "코일 유도" }),
          note: localized(language, { zh: "线圈在磁场中运动产生电压", "zh-Hant": traditional("线圈在磁场中运动产生电压"), en: "Moving coil in magnetic field induces voltage", ja: "磁界中でコイルが動くと電圧が誘導されます", ko: "자기장 속에서 코일이 움직이면 전압이 유도됩니다" }),
          value: formatMillivolts(microphoneVrms)
        },
        {
          label: localized(language, { zh: "40 dB 前级后", "zh-Hant": traditional("40 dB 前级后"), en: "After 40 dB preamp", ja: "40 dBプリアンプ後", ko: "40 dB 프리앰프 후" }),
          note: digitalLevelNote(requestedDbfs, language),
          value: formatMillivolts(preampVrms)
        }
      ]
    };
  }

  if (principle === "array") {
    return {
      assumption: localized(language, {
        zh: "理想四麦等权平均：y = Σxᵢ(t + τᵢ) / 4。目标对齐、各路等功率噪声互不相关时，SNR 理论提升约 6 dB，不是电压翻倍。", "zh-Hant": traditional("理想四麦等权平均：y = Σxᵢ(t + τᵢ) / 4。目标对齐、各路等功率噪声互不相关时，SNR 理论提升约 6 dB，不是电压翻倍。"),
        en: "Ideal 4-mic average: y = Σxᵢ(t + τᵢ) / 4. Aligned target and equal-power, uncorrelated channel noise yield about 6 dB SNR improvement, not doubled voltage.",
        ja: "理想的な4本の等重み平均：y = Σxᵢ(t + τᵢ) / 4。目標を整列し等電力の雑音が無相関なら、SNRは約6 dB改善。電圧の倍増ではありません。",
        ko: "이상적인 4개 마이크 동일 가중 평균: y = Σxᵢ(t + τᵢ) / 4. 목표 정렬 및 같은 전력의 비상관 잡음 조건에서 SNR 약 6 dB 개선이며 전압 2배가 아닙니다."
      }),
      steps: [
        {
          label: localized(language, { zh: "声波输入", "zh-Hant": traditional("声波输入"), en: "Sound input", ja: "音波入力", ko: "음파 입력" }),
          note: localized(language, {
            zh: `声压：${formatPascal(pressurePa)}`, "zh-Hant": traditional(`声压：${formatPascal(pressurePa)}`),
            en: `Pressure: ${formatPascal(pressurePa)}`,
            ja: `音圧：${formatPascal(pressurePa)}`,
            ko: `음압: ${formatPascal(pressurePa)}`
          }),
          value: localized(language, {
            zh: `输入声压：${inputSpl} dBSPL`, "zh-Hant": traditional(`输入声压：${inputSpl} dBSPL`),
            en: `Input SPL: ${inputSpl} dBSPL`,
            ja: `入力音圧：${inputSpl} dBSPL`,
            ko: `입력 음압: ${inputSpl} dBSPL`
          })
        },
        {
          label: localized(language, { zh: "单颗麦输出", "zh-Hant": traditional("单颗麦输出"), en: "Single mic output", ja: "単一マイク出力", ko: "단일 마이크 출력" }),
          note: localized(language, {
            zh: "每路仍先是独立麦克风信号", "zh-Hant": traditional("每路仍先是独立麦克风信号"),
            en: "Each channel is still an independent microphone signal",
            ja: "各チャンネルはまず独立したマイク信号です",
            ko: "각 채널은 먼저 독립적인 마이크 신호입니다"
          }),
          value: formatMillivolts(microphoneVrms)
        },
        {
          label: localized(language, { zh: "对齐后等权平均", "zh-Hant": traditional("对齐后等权平均"), en: "Aligned average", ja: "整列後の等重み平均", ko: "정렬 후 동일 가중 평균" }),
          note: localized(language, {
            zh: `噪声 RMS 为单路的 ${arrayNoiseRatio.toFixed(2)} 倍；离轴衰减取决于频率、间距和方向`, "zh-Hant": traditional(`噪声 RMS 为单路的 ${arrayNoiseRatio.toFixed(2)} 倍；离轴衰减取决于频率、间距和方向`),
            en: `Noise RMS is ${arrayNoiseRatio.toFixed(2)} × one channel; off-axis attenuation depends on frequency, spacing, and direction`,
            ja: `雑音RMSは単一チャンネルの${arrayNoiseRatio.toFixed(2)}倍。軸外減衰は周波数・間隔・方向に依存`,
            ko: `잡음 RMS는 단일 채널의 ${arrayNoiseRatio.toFixed(2)}배. 축외 감쇠는 주파수·간격·방향에 따라 다름`
          }),
          value: localized(language, { zh: "目标分量：单路的 1.00 倍", "zh-Hant": traditional("目标分量：单路的 1.00 倍"), en: "Target: 1.00 × one channel", ja: "目標成分：単一チャンネルの1.00倍", ko: "목표 성분: 단일 채널의 1.00배" })
        },
        {
          label: "SNR",
          value: `+${formatDb(arraySnrGainDb)}`,
          note: localized(language, { zh: "10 log₁₀(4) ≈ 6.02 dB；相干干扰、混响或失配会降低收益", "zh-Hant": traditional("10 log₁₀(4) ≈ 6.02 dB；相干干扰、混响或失配会降低收益"), en: "10 log₁₀(4) ≈ 6.02 dB; coherent interference, reverberation, or mismatch reduce the benefit", ja: "10 log₁₀(4) ≈ 6.02 dB。相関干渉・残響・不整合で改善量は低下", ko: "10 log₁₀(4) ≈ 6.02 dB. 상관 간섭·잔향·불일치로 이득 감소" })
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
  const signal = getMicrophoneSignal(principle, inputSpl);
  const [digitalOutput, setDigitalOutput] = useLabState<"pdm" | "i2s">(
    "MicrophoneLab.PrincipleDiagram.digitalOutput",
    "pdm",
    (value): value is "pdm" | "i2s" => value === "pdm" || value === "i2s"
  );
  const bits = digitalOutput === "pdm" ? makePdmBits(signal.requestedPeak) : pcmWordBits(signal.outputPeak);
  const visualPressure = 0.15 + 0.85 * (inputSpl - 54) / 70;
  const diaphragmOffset = visualPressure * 12;

  return (
    <section
      className="mic-principle-workbench"
      aria-label={localized(language, {
        zh: "麦克风工作原理可视化", "zh-Hant": traditional("麦克风工作原理可视化"),
        en: "Microphone working principle visualization",
        ja: "マイクの動作原理の可視化",
        ko: "마이크 작동 원리 시각화"
      })}
    >
      <div className="mic-principle-visual">
        <svg
          aria-label={localized(language, {
            zh: `${copy.label.zh}工作原理图`, "zh-Hant": traditional(`${copy.label.zh}工作原理图`),
            en: `${copy.label.en} principle diagram`,
            ja: `${copy.label.ja}の原理図`,
            ko: `${copy.label.ko} 원리 다이어그램`
          })}
          role="img"
          viewBox="0 0 760 300"
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
          <rect className="lab-diagram-bg" height="300" rx="8" width="760" />
          <path className="mic-air-wave" d={pcmWavePath(visualPressure, 38, 178, 144, 46)} />
          <text className="lab-label" x="42" y="92">{localized(language, { zh: "声波", "zh-Hant": traditional("声波"), en: "Sound wave", ja: "音波", ko: "음파" })}</text>

          {isArray ? (
            <g>
              {[96, 150, 204, 258].map((y, index) => (
                <g key={y}>
                  <circle className="mic-array-capsule" cx="238" cy={y} r="14" />
                  <path className="mic-signal-line" d={`M110 ${178 + index * 8} C148 ${130 + index * 30} 188 ${y} 224 ${y}`} />
                  <text className="lab-label" x="258" y={y - 18}>{`Mic ${index + 1}`}</text>
                  <path className="mic-signal-line" d={`M252 ${y} C326 ${y} 372 ${166 + index * 12} 404 ${166 + index * 12}`} />
                </g>
              ))}
              <rect className="mic-stage-box" height="78" rx="8" width="132" x="404" y="139" />
              <text className="mic-stage-text" x="424" y="172">{localized(language, { zh: "延时对齐", "zh-Hant": traditional("延时对齐"), en: "Delay align", ja: "遅延整列", ko: "지연 정렬" })}</text>
              <text className="mic-stage-text" x="424" y="198">{localized(language, { zh: "等权平均", "zh-Hant": traditional("等权平均"), en: "Average / 4", ja: "等重み平均", ko: "동일 가중 평균" })}</text>
              <path className="mic-signal-line" d="M536 178 L548 178" />
              <path className="mic-analog-line" d={pcmWavePath(visualPressure, 548, 178, 174, 30)} />
              <text className="lab-label" x="552" y="248">{localized(language, { zh: "平均后目标分量", "zh-Hant": traditional("平均后目标分量"), en: "Averaged target", ja: "平均後の目標成分", ko: "평균 후 목표 성분" })}</text>
            </g>
          ) : (
            <g>
              <rect className="mic-capsule-shell" height="150" rx="20" width="126" x="218" y="104" />
              <path className="mic-diaphragm-line" fill="none" d={`M258 124 C${258 + diaphragmOffset} 148 ${258 + diaphragmOffset} 210 258 234`} />
              <path className="mic-signal-line" d="M182 178 C202 160 216 154 246 154" markerEnd="url(#signalArrow)" />
              {isDynamic ? (
                <>
                  <g className="mic-moving-coil" transform={`translate(${diaphragmOffset * 0.75} 0)`}>
                    <path className="mic-coil" d="M258 178 H278 M278 132 C306 146 306 164 278 178 C306 192 306 210 278 224" />
                  </g>
                  <rect className="mic-magnet" height="118" rx="6" width="18" x="318" y="120" />
                  <text className="lab-label" x="286" y="270">{localized(language, { zh: "音圈 + 磁体", "zh-Hant": traditional("音圈 + 磁体"), en: "Coil + magnet", ja: "ボイスコイル + 磁石", ko: "보이스 코일 + 자석" })}</text>
                </>
              ) : (
                <>
                  <line className="mic-backplate-line" x1="304" x2="304" y1="124" y2="234" />
                  <text className="lab-label" x="236" y="270">{localized(language, { zh: "振膜 / 背板电容", "zh-Hant": traditional("振膜 / 背板电容"), en: "Diaphragm / backplate C", ja: "振動板 / バックプレート容量", ko: "진동판 / 백플레이트 정전용량" })}</text>
                </>
              )}
              <rect className="mic-stage-box" height="74" rx="8" width="122" x="410" y="141" />
              <text className="mic-stage-text" x="431" y="172">
                {isDigital
                  ? localized(language, { zh: "ASIC", "zh-Hant": traditional("ASIC"), en: "ASIC", ja: "ASIC", ko: "ASIC" })
                  : isDynamic
                    ? localized(language, { zh: "前级", "zh-Hant": traditional("前级"), en: "Preamp", ja: "プリアンプ", ko: "프리앰프" })
                    : localized(language, { zh: "JFET", "zh-Hant": traditional("JFET"), en: "JFET", ja: "JFET", ko: "JFET" })}
              </text>
              <text className="mic-stage-text" x="431" y="198">
                {isDigital
                  ? localized(language, { zh: "调制", "zh-Hant": traditional("调制"), en: "Modulate", ja: "変調", ko: "변조" })
                  : isDynamic
                    ? localized(language, { zh: "放大", "zh-Hant": traditional("放大"), en: "Gain", ja: "ゲイン", ko: "게인" })
                    : localized(language, { zh: "缓冲", "zh-Hant": traditional("缓冲"), en: "Buffer", ja: "バッファ", ko: "버퍼" })}
              </text>
              <path className="mic-signal-line" d="M344 178 L410 178" markerEnd="url(#signalArrow)" />
              <path className="mic-signal-line" d="M532 178 H548" />
              <path className={isDigital ? "mic-pdm-line" : "mic-analog-line"} d={isDigital ? bitStreamPath(bits, 548, 178, 174, 22) : pcmWavePath(visualPressure, 548, 178, 174, 30)} />
              <text className="lab-label" x="548" y="248">{isDigital ? (digitalOutput === "pdm" ? "PDM / 1-bit" : "I2S / PCM") : localized(language, { zh: "模拟电压", "zh-Hant": traditional("模拟电压"), en: "Analog voltage", ja: "アナログ電圧", ko: "아날로그 전압" })}</text>
            </g>
          )}

        </svg>
        <ol className="mic-principle-stage-flow">
          {copy.stages.map(stage => <li key={stage.en}>{localized(language, stage)}</li>)}
        </ol>
        <p className="mic-model-note">{localized(language, {
          zh: "上图为功能示意，非封装剖面。振膜形变与波形幅度经夸张，不按真实位移或电压比例；模拟波形代表交流信号，不是空气分子的运动轨迹。", "zh-Hant": traditional("上图为功能示意，非封装剖面。振膜形变与波形幅度经夸张，不按真实位移或电压比例；模拟波形代表交流信号，不是空气分子的运动轨迹。"),
          en: "Functional schematic, not a package cross-section. Diaphragm deflection and signal icons are exaggerated, not displacement or voltage scales. The curves represent AC signals, not air-particle paths.",
          ja: "封装断面ではなく機能図です。振動板変形と波形は誇張表示で、変位や電圧の実寸尺度ではありません。曲線は交流信号であり空気粒子の軌跡ではありません。",
          ko: "패키지 단면이 아닌 기능도입니다. 진동판 변형과 파형은 과장 표시이며 실제 변위나 전압 비율이 아닙니다. 곡선은 교류 신호이며 공기 입자의 이동 경로가 아닙니다."
        })}</p>
        <section
          className="mic-principle-numeric"
          aria-label={localized(language, {
            zh: "麦克风数值链路", "zh-Hant": traditional("麦克风数值链路"),
            en: "Microphone numeric signal path",
            ja: "マイクの数値信号経路",
            ko: "마이크 수치 신호 경로"
          })}
        >
          <div className="mic-numeric-heading">
            <div>
              <span className="section-kicker">{localized(language, { zh: "数值链路", "zh-Hant": traditional("数值链路"), en: "Numeric path", ja: "数値経路", ko: "수치 경로" })}</span>
              <h3>{localized(language, { zh: "调节声压，观察输出", "zh-Hant": traditional("调节声压，观察输出"), en: "Adjust SPL and inspect the output", ja: "音圧を変えて出力を見る", ko: "음압을 바꾸며 출력 확인" })}</h3>
            </div>
            <p>{numericModel.assumption}</p>
          </div>
          <div className="lab-sliders mic-principle-numeric-slider">
            <label>
              <span>
                {localized(language, { zh: "输入声压", "zh-Hant": traditional("输入声压"), en: "Input SPL", ja: "入力音圧", ko: "입력 음압" })}
                <strong>{inputSpl} dBSPL</strong>
              </span>
              <input
                aria-label={localized(language, { zh: "工作原理输入声压", "zh-Hant": traditional("工作原理输入声压"), en: "Working principle input SPL", ja: "動作原理の入力音圧", ko: "작동 원리 입력 음압" })}
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
          <figure className="mic-output-preview">
            <figcaption>{localized(language, { zh: "输出观察", "zh-Hant": traditional("输出观察"), en: "Output inspection", ja: "出力の観察", ko: "출력 관찰" })}</figcaption>
            {isDigital && <div className="waveform-tabs" role="group" aria-label={localized(language, { zh: "数字输出方式", "zh-Hant": traditional("数字输出方式"), en: "Digital output mode", ja: "デジタル出力形式", ko: "디지털 출력 방식" })}>
              {(["pdm", "i2s"] as const).map(mode => <button type="button" className={digitalOutput === mode ? "waveform-tab active" : "waveform-tab"} aria-pressed={digitalOutput === mode} key={mode} onClick={() => setDigitalOutput(mode)}>{mode === "pdm" ? "PDM" : "I2S"}</button>)}
            </div>}
            {isArray ? <>
              <svg viewBox="0 0 760 280" role="img" aria-label={localized(language, { zh: "四麦时间差与对齐平均图", "zh-Hant": traditional("四麦时间差与对齐平均图"), en: "Four-mic delay and aligned average", ja: "4マイクの時間差と整列平均", ko: "4개 마이크 시간차와 정렬 평균" })}>
                {[0, 1, 2, 3, 4].map(i => <g key={i}>
                  <text x="12" y={44 + i * 45}>{i < 4 ? `Mic ${i + 1}` : "y"}</text>
                  <path className="mic-preview-grid" d={`M90 ${40 + i * 45} H720`} />
                  <path className={i === 4 ? "mic-analog-line" : "mic-signal-line"} d={pcmWavePath(1, 90, 40 + i * 45, 630, 15, i < 4 ? i * 0.04 * Math.sin(Math.PI / 6) / 343 : 0)} />
                </g>)}
                <text x="90" y="265">0 ms</text><text x="670" y="265">4 ms</text>
              </svg>
              <p>{localized(language, {
                zh: "仅展示 1 kHz 目标分量，各行按同一单位振幅归一化。麦间距 4 cm、相对阵列法线 30°、声速 343 m/s：相邻到达差约 58 μs。补偿后取平均，目标幅度不翻倍；噪声收益见数值条件。这里不模拟各路 ADC 削波。", "zh-Hant": traditional("仅展示 1 kHz 目标分量，各行按同一单位振幅归一化。麦间距 4 cm、相对阵列法线 30°、声速 343 m/s：相邻到达差约 58 μs。补偿后取平均，目标幅度不翻倍；噪声收益见数值条件。这里不模拟各路 ADC 削波。"),
                en: "Only the 1 kHz target component, with the same unit-amplitude normalization in every row. Spacing 4 cm, 30° from broadside, c = 343 m/s: adjacent delay ≈ 58 μs. Compensation and averaging preserve target amplitude; noise benefits require the stated assumptions. Per-channel ADC clipping is not modeled here.",
                ja: "1 kHzの目標成分のみを各行で同じ単位振幅に正規化。間隔4 cm、正面から30°、音速343 m/sで隣接到達差は約58 μs。補償後に平均しても目標振幅は倍増しません。雑音改善は記載条件に依存し、各ADCのクリップは未モデル化です。",
                ko: "1 kHz 목표 성분만 각 행에 동일한 단위 진폭으로 정규화했습니다. 간격 4 cm, 정면 기준 30°, 음속 343 m/s에서 인접 도달차는 약 58 μs. 보상 후 평균은 목표 진폭을 2배로 만들지 않습니다. 잡음 이득에는 명시한 조건이 필요하며 채널별 ADC 클리핑은 모델링하지 않습니다."
              })}</p>
            </> : isDigital ? <>
              <svg viewBox="0 0 760 180" role="img" aria-label={localized(language, { zh: "数字输出比特示意", "zh-Hant": traditional("数字输出比特示意"), en: "Digital output bit illustration", ja: "デジタル出力ビット例", ko: "디지털 출력 비트 예시" })}>
                <path className="mic-preview-grid" d="M90 50 H720 M90 100 H720" />
                <text x="45" y="55">1</text><text x="45" y="105">0</text>
                <path className="mic-pdm-line" d={bitStreamPath(bits, 90, 75, 630, 25)} />
                <text x="90" y="145">0</text><text x="660" y="145">{bits.length - 1}</text>
                <text x="285" y="170">{localized(language, { zh: "比特序号", "zh-Hant": traditional("比特序号"), en: "Bit index", ja: "ビット番号", ko: "비트 인덱스" })}</text>
              </svg>
              <p>{digitalOutput === "pdm" ? localized(language, {
                zh: "一阶 Σ-Δ 教学示意：128 个等时长比特表示一个正弦周期。正半周 1 更密，负半周 0 更密；增大声压会增大局部密度差，不改变 0/1 电平高度。PDM 麦需在接收端低通、抽取为 PCM；此图不是器件实际时钟或噪声性能仿真。", "zh-Hant": traditional("一阶 Σ-Δ 教学示意：128 个等时长比特表示一个正弦周期。正半周 1 更密，负半周 0 更密；增大声压会增大局部密度差，不改变 0/1 电平高度。PDM 麦需在接收端低通、抽取为 PCM；此图不是器件实际时钟或噪声性能仿真。"),
                en: "First-order sigma-delta illustration: 128 equal-duration bits per sine period. Ones are denser in the positive half, zeros in the negative half. SPL changes local density, not logic height. A PDM receiver low-pass filters and decimates to PCM. This is not a device clock or noise-performance simulation.",
                ja: "一次Σ-Δの教育用例：1正弦周期を等時間の128ビットで表示。正半周期は1、負半周期は0が密になります。音圧は局所密度を変え、論理レベルの高さは変えません。受信側で低域通過・デシメーションしてPCMにします。実機のクロックや雑音性能の再現ではありません。",
                ko: "1차 Σ-Δ 교육 예시: 정현파 한 주기를 같은 시간 길이의 128비트로 표시합니다. 양의 반주기에는 1, 음의 반주기에는 0이 조밀합니다. 음압은 국소 밀도를 바꾸며 논리 전압 높이는 바꾸지 않습니다. 수신 측에서 저역통과와 데시메이션으로 PCM을 만듭니다. 실제 클록이나 잡음 성능 시뮬레이션은 아닙니다."
              }) : localized(language, {
                zh: `I2S 型号在芯片内抽取为 PCM，再串行发送。这里仅示例正峰值处的一个 16-bit PCM 数据字，MSB 在前：${bits.join("")}；不含 I2S 的时钟、声道与一位延迟时序。`, "zh-Hant": traditional(`I2S 型号在芯片内抽取为 PCM，再串行发送。这里仅示例正峰值处的一个 16-bit PCM 数据字，MSB 在前：${bits.join("")}；不含 I2S 的时钟、声道与一位延迟时序。`),
                en: `I2S models decimate to PCM on chip, then serialize. One illustrative 16-bit PCM word at the positive peak, MSB first: ${bits.join("")}. I2S clocks, channels, and the one-bit delay are not shown.`,
                ja: `I2S型はチップ内でPCMへデシメーションし直列送信します。正のピークの16-bit PCMワードをMSBから表示：${bits.join("")}。クロック、チャンネル、1ビット遅延の時序は省略しています。`,
                ko: `I2S형은 칩 내부에서 PCM으로 데시메이션 후 직렬 전송합니다. 양의 피크에 해당하는 16-bit PCM 워드 예시(MSB 우선): ${bits.join("")}. 클록, 채널, 1비트 지연 타이밍은 생략합니다.`
              })}</p>
            </> : <>
              <svg viewBox="0 0 760 190" role="img" aria-label={localized(language, { zh: "ADC 归一化输出波形", "zh-Hant": traditional("ADC 归一化输出波形"), en: "Normalized ADC output waveform", ja: "ADC正規化出力波形", ko: "ADC 정규화 출력 파형" })}>
                <path className="mic-preview-grid" d="M90 30 H720 M90 85 H720 M90 140 H720" />
                <text x="12" y="35">+1 FS</text><text x="45" y="90">0</text><text x="12" y="145">-1 FS</text>
                <path className="mic-analog-line" d={pcmWavePath(signal.requestedPeak, 90, 85, 630, 55)} />
                <text x="90" y="180">0 ms</text><text x="670" y="180">4 ms</text>
              </svg>
              <p>{localized(language, {
                zh: "图中为前级后、理想 ADC 的 1 kHz 输出，纵轴是固定的归一化满量程。小信号接近中线是正常的；超量程被限制在 ±1，出现平顶。忽略量化噪声，前级饱和与麦克风自身失真可能更早发生。", "zh-Hant": traditional("图中为前级后、理想 ADC 的 1 kHz 输出，纵轴是固定的归一化满量程。小信号接近中线是正常的；超量程被限制在 ±1，出现平顶。忽略量化噪声，前级饱和与麦克风自身失真可能更早发生。"),
                en: "The plot shows a 1 kHz signal after the preamp and an ideal ADC, on a fixed normalized full-scale axis. Small signals sit near zero; overload clips at ±1. Quantization noise is omitted. Preamp saturation and microphone distortion may occur earlier.",
                ja: "前段増幅後の理想ADCの1 kHz出力を固定の正規化フルスケールで表示。小信号は中央線に近く、過負荷では±1で平頂化します。量子化雑音は省略し、前段飽和やマイクの歪みはより早く起こる可能性があります。",
                ko: "프리앰프 뒤 이상적 ADC의 1 kHz 출력을 고정 정규화 풀 스케일 축에 표시합니다. 작은 신호는 중앙선에 가깝고 과부하는 ±1에서 평평하게 잘립니다. 양자화 잡음은 생략하며 프리앰프 포화와 마이크 왜곡이 먼저 발생할 수 있습니다."
              })}</p>
            </>}
            {!isArray && <p className={signal.overloaded ? "mic-overload-warning" : "mic-output-level"} role="status">{digitalLevelNote(signal.requestedDbfs, language)}</p>}
          </figure>
          <p className="mic-model-note mic-numeric-assumptions">{localized(language, {
            zh: "数值以 1 kHz 正弦稳态为例，约定 94 dB SPL ≈ 1 Pa RMS，模拟电压为 RMS；0 dBFS 按满幅正弦标定。前级电压仅为线性需求估算，不保证真实电路可达到。", "zh-Hant": traditional("数值以 1 kHz 正弦稳态为例，约定 94 dB SPL ≈ 1 Pa RMS，模拟电压为 RMS；0 dBFS 按满幅正弦标定。前级电压仅为线性需求估算，不保证真实电路可达到。"),
            en: "1 kHz steady sine example; 94 dB SPL ≈ 1 Pa RMS. Analog voltages are RMS; 0 dBFS is calibrated to a full-scale sine. Preamp voltages are linear-demand estimates, not guaranteed circuit outputs.",
            ja: "1 kHz定常正弦波の例。94 dB SPL ≈ 1 Pa RMS、アナログ電圧はRMS、0 dBFSはフルスケール正弦波で校正。前段電圧は線形推定で実回路の出力保証ではありません。",
            ko: "1 kHz 정상 정현파 예시. 94 dB SPL ≈ 1 Pa RMS, 아날로그 전압은 RMS이며 0 dBFS는 풀 스케일 정현파 기준입니다. 프리앰프 전압은 선형 요구 추정이며 실제 회로 출력을 보장하지 않습니다."
          })}</p>
        </section>
      </div>
      <div className="mic-principle-copy">
        <div>
          <span className="section-kicker">{localized(language, { zh: "工作原理", "zh-Hant": traditional("工作原理"), en: "Working principle", ja: "動作原理", ko: "작동 원리" })}</span>
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
  const [principle, setPrinciple] = useLabState<MicPrinciple>(
    "MicrophoneLab.principle",
    "electret",
    (value): value is MicPrinciple => value === "electret" || value === "digitalMems" || value === "dynamicVocal" || value === "array"
  );
  const [principleSpl, setPrincipleSpl] = useLabState(
    "MicrophoneLab.principleSpl",
    94,
    (value): value is number => typeof value === "number" && Number.isFinite(value) && Number.isInteger(value) && value >= 54 && value <= 124
  );
  const [pattern, setPattern] = useLabState<PolarPattern>(
    "MicrophoneLab.pattern",
    "cardioid",
    (value): value is PolarPattern => value === "omni" || value === "cardioid" || value === "figure8"
  );
  const [angle, setAngle] = useLabState(
    "MicrophoneLab.angle",
    0,
    (value): value is number => typeof value === "number" && Number.isFinite(value) && Number.isInteger(value) && value >= -180 && value <= 180 && (value + 180) % 5 === 0
  );
  const [distance, setDistance] = useLabState(
    "MicrophoneLab.distance",
    1.2,
    (value): value is number => typeof value === "number" && Number.isFinite(value) && value >= 0.2 && value <= 4 && Math.abs((value - 0.2) / 0.1 - Math.round((value - 0.2) / 0.1)) < 1e-9
  );
  const [gain, setGain] = useLabState(
    "MicrophoneLab.gain",
    52,
    (value): value is number => typeof value === "number" && Number.isFinite(value) && Number.isInteger(value) && value >= 10 && value <= 100 && (value - 10) % 2 === 0
  );
  const polar = useMemo(() => createPolarPath(pattern, angle), [angle, pattern]);
  const analysis = useMemo(
    () => getPickupAnalysis({ angle, distance, gain, pattern }),
    [angle, distance, gain, pattern]
  );

  return (
    <main className="microphone-lab-page">
      <section className="sound-lab-hero" aria-labelledby="microphone-lab-title">
        <div className="sound-lab-back-actions">
        <button className="sound-lab-back sound-lab-back-secondary" type="button" onClick={onBack}>
          <ArrowLeft size={18} aria-hidden="true" />
          {localized(language, { zh: "返回知识库", "zh-Hant": traditional("返回知识库"), en: "Back to knowledge base", ja: "ナレッジベースに戻る", ko: "지식 베이스로 돌아가기" })}
        </button>
        {onBackToDetails && <button className="sound-lab-back" type="button" onClick={onBackToDetails}>
          <ArrowLeft size={18} aria-hidden="true" />
          {localized(language, { zh: "返回详细内容", "zh-Hant": traditional("返回详细内容"), en: "Back to detailed content", ja: "詳細内容に戻る", ko: "상세 내용으로 돌아가기" })}
        </button>}
        </div>
        <div>
          <span className="section-kicker">{localized(language, { zh: "硬件实验", "zh-Hant": traditional("硬件实验"), en: "Hardware lab", ja: "ハードウェア実験", ko: "하드웨어 실험" })}</span>
          <h1 id="microphone-lab-title">{localized(language, { zh: "麦克风指向性与拾音实验室", "zh-Hant": traditional("麦克风指向性与拾音实验室"), en: "Microphone Pickup Lab", ja: "マイク指向性と収音ラボ", ko: "마이크 지향성과 수음 실험실" })}</h1>
          <p>{localized(language, {
            zh: "用可视化方式理解指向性、角度、距离和增益如何影响拾音强度、噪声和削波风险。", "zh-Hant": traditional("用可视化方式理解指向性、角度、距离和增益如何影响拾音强度、噪声和削波风险。"),
            en: "Use visual controls to understand how polar pattern, angle, distance, and gain affect pickup strength, noise, and clipping risk.",
            ja: "指向性、角度、距離、ゲインが収音レベル、ノイズ、クリッピングリスクに与える影響を可視化します。",
            ko: "지향성, 각도, 거리, 게인이 수음 강도와 노이즈, 클리핑 위험에 미치는 영향을 시각적으로 이해합니다."
          })}</p>
        </div>
      </section>

      <section className="mic-principle-section" aria-labelledby="mic-principle-heading">
        <div className="section-heading">
          <div>
            <h2 id="mic-principle-heading">{localized(language, { zh: "麦克风工作原理", "zh-Hant": traditional("麦克风工作原理"), en: "How Microphones Work", ja: "マイクの動作原理", ko: "마이크 작동 원리" })}</h2>
            <p>{localized(language, {
              zh: "对比模拟驻极体咪头、数字 MEMS 麦、动圈话筒和多麦阵列的信号路径。", "zh-Hant": traditional("对比模拟驻极体咪头、数字 MEMS 麦、动圈话筒和多麦阵列的信号路径。"),
              en: "Compare signal paths for analog electret capsules, digital MEMS microphones, dynamic vocal microphones, and multi-mic arrays.",
              ja: "アナログのエレクトレットカプセル、デジタルMEMSマイク、ダイナミックボーカルマイク、多マイクアレイの信号経路を比較します。",
              ko: "아날로그 일렉트릿 캡슐, 디지털 MEMS 마이크, 다이내믹 보컬 마이크, 다중 마이크 어레이의 신호 경로를 비교합니다."
            })}</p>
          </div>
        </div>
        <div className="mic-principle-tabs" role="group" aria-label={localized(language, { zh: "麦克风工作原理类型", "zh-Hant": traditional("麦克风工作原理类型"), en: "Microphone principle type", ja: "マイク動作原理の種類", ko: "마이크 작동 원리 유형" })}>
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

      <section className="microphone-lab-workbench" aria-label={localized(language, { zh: "麦克风拾音实验台", "zh-Hant": traditional("麦克风拾音实验台"), en: "Microphone pickup workbench", ja: "マイク収音ワークベンチ", ko: "마이크 수음 작업대" })}>
        <div className="microphone-visual">
          <div className="digital-lab-status">
            <strong>{localized(language, {
              zh: `指向性：${polarLabels[pattern].zh}`, "zh-Hant": traditional(`指向性：${polarLabels[pattern].zh}`),
              en: `Pattern: ${polarLabels[pattern].en}`,
              ja: `指向性：${polarLabels[pattern].ja}`,
              ko: `지향성: ${polarLabels[pattern].ko}`
            })}</strong>
            <span>{localized(language, {
              zh: `拾音强度：${analysis.levelPercent}%`, "zh-Hant": traditional(`拾音强度：${analysis.levelPercent}%`),
              en: `Pickup level: ${analysis.levelPercent}%`,
              ja: `収音レベル：${analysis.levelPercent}%`,
              ko: `수음 강도: ${analysis.levelPercent}%`
            })}</span>
          </div>
          <p className="mic-polar-legend">{localized(language, {
            zh: "外点：声源方向；内点：方向响应幅度。曲线仅表示理想指向性，不随距离或增益缩放。", "zh-Hant": traditional("外点：声源方向；内点：方向响应幅度。曲线仅表示理想指向性，不随距离或增益缩放。"),
            en: "Outer dot: source direction. Inner dot: directional magnitude. The curve shows ideal directivity, independent of distance and gain.",
            ja: "外側の点は音源方向、内側の点は指向性の応答振幅です。曲線は理想的な指向性だけを示し、距離やゲインでは拡大縮小しません。",
            ko: "바깥 점은 음원 방향, 안쪽 점은 지향성 응답 크기입니다. 곡선은 이상적인 지향성만 나타내며 거리나 게인에 따라 확대되지 않습니다."
          })}</p>
          <div className="mic-polar-display">
          <svg
            aria-label={localized(language, { zh: "麦克风指向性极坐标图", "zh-Hant": traditional("麦克风指向性极坐标图"), en: "Microphone polar pattern chart", ja: "マイク指向性の極座標図", ko: "마이크 지향성 극좌표 그래프" })}
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
          <dl className="mic-pickup-readouts" aria-label={localized(language, { zh: "拾音教学结果", "zh-Hant": traditional("拾音教学结果"), en: "Pickup teaching results", ja: "収音学習結果", ko: "수음 학습 결과" })}>
            <div><dt>{localized(language, { zh: "角度", "zh-Hant": traditional("角度"), en: "Angle", ja: "角度", ko: "각도" })}</dt><dd>{angle}°</dd></div>
            <div><dt>{localized(language, { zh: "距离", "zh-Hant": traditional("距离"), en: "Distance", ja: "距離", ko: "거리" })}</dt><dd>{distance.toFixed(1)} m</dd></div>
            <div><dt>{localized(language, { zh: "增益旋钮", "zh-Hant": traditional("增益旋钮"), en: "Gain control", ja: "ゲイン調整", ko: "게인 조절" })}</dt><dd>{gain}%</dd></div>
            <div><dt>{localized(language, { zh: "拾音强度", "zh-Hant": traditional("拾音强度"), en: "Pickup level", ja: "収音レベル", ko: "수음 강도" })}</dt><dd>{analysis.levelPercent}%</dd></div>
            <div><dt>{localized(language, { zh: "清晰度评分", "zh-Hant": traditional("清晰度评分"), en: "Clarity score", ja: "明瞭度スコア", ko: "선명도 점수" })}</dt><dd>{analysis.clarity}%</dd></div>
            <div><dt>{localized(language, { zh: "噪声风险评分", "zh-Hant": traditional("噪声风险评分"), en: "Noise risk score", ja: "ノイズリスクスコア", ko: "노이즈 위험 점수" })}</dt><dd>{analysis.noiseRisk}%</dd></div>
            <div><dt>{localized(language, { zh: "削波风险评分", "zh-Hant": traditional("削波风险评分"), en: "Clipping risk score", ja: "クリッピングリスクスコア", ko: "클리핑 위험 점수" })}</dt><dd>{analysis.clippingRisk}%</dd></div>
          </dl>
          </div>
          <p className="mic-polar-legend">{localized(language, {
            zh: "教学模型：评分不是实测 SNR、失真或概率，增益百分比不是 dB。本区域仅作可视化，不提供合成试听；距离采用有近场限幅的 1/r 近似，不模拟真实房间。8 字形只展示响应幅度，不演示背瓣的极性反转。", "zh-Hant": traditional("教学模型：评分不是实测 SNR、失真或概率，增益百分比不是 dB。本区域仅作可视化，不提供合成试听；距离采用有近场限幅的 1/r 近似，不模拟真实房间。8 字形只展示响应幅度，不演示背瓣的极性反转。"),
            en: "Teaching model: scores are not measured SNR, distortion, or probabilities; gain percentage is not dB. Visual demonstration only, without synthetic playback. Distance uses a near-field-clamped 1/r approximation, not a real room. Figure-8 shows magnitude only, not rear-lobe polarity reversal.",
            ja: "教育用モデル：スコアは実測SNR、歪み、確率ではなく、ゲインの百分率はdBではありません。合成音の再生は行いません。距離は近接場で制限した1/r近似で、実際の部屋は再現しません。8の字は振幅だけを示し、背面ローブの極性反転は表しません。",
            ko: "교육용 모델입니다. 점수는 실측 SNR, 왜곡 또는 확률이 아니며 게인 백분율은 dB가 아닙니다. 합성음을 재생하지 않습니다. 거리는 근접장 제한이 있는 1/r 근사이며 실제 공간은 모델링하지 않습니다. 8자형은 크기만 나타내고 후면 로브의 극성 반전은 나타내지 않습니다."
          })}</p>
        </div>

        <div className="microphone-panel">
          <div className="waveform-tabs" role="group" aria-label={localized(language, { zh: "麦克风指向性", "zh-Hant": traditional("麦克风指向性"), en: "Microphone polar pattern", ja: "マイク指向性", ko: "마이크 지향성" })}>
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
                {localized(language, { zh: "声源角度", "zh-Hant": traditional("声源角度"), en: "Source angle", ja: "音源角度", ko: "음원 각도" })}
                <strong>{angle}°</strong>
              </span>
              <input
                aria-label={localized(language, { zh: "声源角度", "zh-Hant": traditional("声源角度"), en: "Source angle", ja: "音源角度", ko: "음원 각도" })}
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
                {localized(language, { zh: "拾音距离", "zh-Hant": traditional("拾音距离"), en: "Pickup distance", ja: "収音距離", ko: "수음 거리" })}
                <strong>{distance.toFixed(1)} m</strong>
              </span>
              <input
                aria-label={localized(language, { zh: "拾音距离", "zh-Hant": traditional("拾音距离"), en: "Pickup distance", ja: "収音距離", ko: "수음 거리" })}
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
                {localized(language, { zh: "前级增益", "zh-Hant": traditional("前级增益"), en: "Preamp gain", ja: "プリアンプゲイン", ko: "프리앰프 게인" })}
                <strong>{gain}%</strong>
              </span>
              <input
                aria-label={localized(language, { zh: "前级增益", "zh-Hant": traditional("前级增益"), en: "Preamp gain", ja: "プリアンプゲイン", ko: "프리앰프 게인" })}
                max="100"
                min="10"
                step="2"
                type="range"
                value={gain}
                onChange={(event) => setGain(Number(event.target.value))}
              />
            </label>
          </div>

        </div>
      </section>

    </main>
  );
}
