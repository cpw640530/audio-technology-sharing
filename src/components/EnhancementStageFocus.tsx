import { traditional } from "../content/traditional";
import type { Language } from "../content/knowledge";
import { playbackReference, processingThrough, speechComponents, type EnhancementMode, type ProcessingStrengths } from "./speechEnhancementModel";

type Localized = Record<"zh" | "en" | "ja" | "ko" | "zh-Hant", string>;

const labels: Record<"speech" | "noise" | "echo" | "reverb", Localized> = {
  speech: { zh: "近端语音", "zh-Hant": traditional("近端语音"), en: "Near-end voice", ja: "近端音声", ko: "근단 음성" },
  noise: { zh: "噪声", "zh-Hant": traditional("噪声"), en: "Noise", ja: "ノイズ", ko: "노이즈" },
  echo: { zh: "远端回声", "zh-Hant": traditional("远端回声"), en: "Remote echo", ja: "遠端エコー", ko: "원단 에코" },
  reverb: { zh: "混响拖尾", "zh-Hant": traditional("混响拖尾"), en: "Reverb tail", ja: "残響尾部", ko: "잔향 꼬리" }
};

const copy = {
  currentStage: { zh: "当前阶段分量对比", "zh-Hant": traditional("当前阶段分量对比"), en: "Current-stage component comparison", ja: "現在の段階における成分比較", ko: "현재 단계 성분 비교" },
  agcTitle: { zh: "AGC：整路信号的电平变化", "zh-Hant": traditional("AGC：整路信号的电平变化"), en: "AGC: whole-signal level change", ja: "AGC：信号全体のレベル変化", ko: "AGC: 전체 신호 레벨 변화" },
  beamTitle: { zh: "多麦：合成前后的干扰对比", "zh-Hant": traditional("多麦：合成前后的干扰对比"), en: "Array: interference before and after combining", ja: "マイクアレイ：合成前後の干渉比較", ko: "마이크 배열: 합산 전후 간섭 비교" },
  aecSummary: { zh: "AEC 输出 = 第 2 轨采集信号 − 第 3 轨估计回声。第 1 轨只提供参考，不能直接拿来相减。第 4 轨保留近端语音、独立噪声和近端混响。", "zh-Hant": traditional("AEC 输出 = 第 2 轨采集信号 − 第 3 轨估计回声。第 1 轨只提供参考，不能直接拿来相减。第 4 轨保留近端语音、独立噪声和近端混响。"), en: "AEC output = track 2 capture − track 3 estimated echo. Track 1 supplies the reference, not the signal to subtract directly. Track 4 retains near-end voice, independent noise and near-end reverb.", ja: "AEC 出力 = 2 番目の収音信号 − 3 番目の推定エコー。1 番目のトラックは reference を提供するだけで、直接引く信号ではない。4 番目のトラックには近端音声、独立ノイズ、近端残響が残る。", ko: "AEC 출력 = 2번 트랙 수집 신호 − 3번 트랙 추정 에코. 1번 트랙은 reference만 제공하며 직접 빼는 신호가 아님. 4번 트랙에는 근단 음성, 독립 노이즈 및 근단 잔향이 남음." },
  cancellation: { zh: "模型抵消比例 / 残余回声幅度", "zh-Hant": traditional("模型抵消比例 / 残余回声幅度"), en: "Model cancellation / residual echo amplitude", ja: "モデルのキャンセル率 / 残留エコー振幅", ko: "모델 제거율 / 잔여 에코 진폭" },
  relativeInput: { zh: "（相对输入回声；不是实测性能）", "zh-Hant": traditional("（相对输入回声；不是实测性能）"), en: " (relative to input echo; not measured performance)", ja: "（入力エコーに対する相対値。実測性能ではない）", ko: "(입력 에코 대비 상대값이며 실측 성능이 아님)" },
  ao: { zh: "AO · 播放参考", "zh-Hant": traditional("AO · 播放参考"), en: "AO · playback reference", ja: "AO · 再生 reference", ko: "AO · 재생 reference" },
  ai: { zh: "AI · 采集信号（含扬声器回声）", "zh-Hant": traditional("AI · 采集信号（含扬声器回声）"), en: "AI · capture including speaker echo", ja: "AI · 収音信号（スピーカーエコーを含む）", ko: "AI · 수집 신호(스피커 에코 포함)" },
  estimate: { zh: "估计回声 · 从采集中减去的分量", "zh-Hant": traditional("估计回声 · 从采集中减去的分量"), en: "Estimated echo · subtracted from capture", ja: "推定エコー · 収音から引く成分", ko: "추정 에코 · 수집 신호에서 빼는 성분" },
  output: { zh: "AEC · 输出信号", "zh-Hant": traditional("AEC · 输出信号"), en: "AEC · output signal", ja: "AEC · 出力信号", ko: "AEC · 출력 신호" },
  speakerSignal: { zh: "送往扬声器的信号", "zh-Hant": traditional("送往扬声器的信号"), en: "Signal sent to speaker", ja: "スピーカーへ送る信号", ko: "스피커로 보내는 신호" },
  estimatedEcho: { zh: "估计回声", "zh-Hant": traditional("估计回声"), en: "Estimated echo", ja: "推定エコー", ko: "추정 에코" },
  fullMixture: { zh: "完整混合信号", "zh-Hant": traditional("完整混合信号"), en: "Full mixture", ja: "完全な混合信号", ko: "전체 혼합 신호" },
  echoComponent: { zh: "其中的回声", "zh-Hant": traditional("其中的回声"), en: "Echo component", ja: "含まれるエコー成分", ko: "포함된 에코 성분" },
  residualEcho: { zh: "剩余回声", "zh-Hant": traditional("剩余回声"), en: "Residual echo", ja: "残留エコー", ko: "잔여 에코" },
  normalizedAmplitude: { zh: "归一化幅度（非声压）", "zh-Hant": traditional("归一化幅度（非声压）"), en: "Normalized amplitude (not sound pressure)", ja: "正規化振幅（音圧ではない）", ko: "정규화 진폭(음압 아님)" },
  normalizedTime: { zh: "归一化时间（不是秒）", "zh-Hant": traditional("归一化时间（不是秒）"), en: "Normalized time (not seconds)", ja: "正規化時間（秒ではない）", ko: "정규화 시간(초가 아님)" },
  estimateNote: { zh: "估计回声 = 输入回声 × 强度 × 0.94；强度以 0–1 计，满强度保留 6% 回声幅度只是模型设定，不代表实际性能上限。", "zh-Hant": traditional("估计回声 = 输入回声 × 强度 × 0.94；强度以 0–1 计，满强度保留 6% 回声幅度只是模型设定，不代表实际性能上限。"), en: "Estimate = input echo × strength × 0.94 (strength 0–1). The 6% amplitude remaining at full strength is a model setting, not a real performance limit.", ja: "推定エコー = 入力エコー × 強度 × 0.94（強度は 0–1）。最大強度でも振幅の 6% が残るのはモデル上の設定で、実際の性能限界ではない。", ko: "추정 에코 = 입력 에코 × 강도 × 0.94(강도 0–1). 최대 강도에서 진폭의 6%가 남는 것은 모델 설정이며 실제 성능 한계가 아님." },
  playbackNote: { zh: "播放参考从 t = 0 开始；黄虚线标出起点。", "zh-Hant": traditional("播放参考从 t = 0 开始；黄虚线标出起点。"), en: "Playback starts at t = 0; the yellow marker indicates its onset.", ja: "再生 reference は t = 0 から始まり、黄色の破線が開始点を示す。", ko: "재생 reference는 t = 0에서 시작하며 노란 점선이 시작점을 나타냄." },
  inputEcho: { zh: "输入中的回声分量", "zh-Hant": traditional("输入中的回声分量"), en: "echo in the input", ja: "入力中のエコー成分", ko: "입력의 에코 성분" },
  residual: { zh: "处理后的残余回声", "zh-Hant": traditional("处理后的残余回声"), en: "residual echo", ja: "処理後の残留エコー", ko: "처리 후 잔여 에코" },
  aecPlots: { zh: "AEC 图解说明", "zh-Hant": traditional("AEC 图解说明"), en: "About the AEC plots", ja: "AEC グラフの説明", ko: "AEC 그래프 설명" },
  aecShared: { zh: "四图共用归一化时间 0–1、幅度刻度 ±2（中心为 0）。AI 一行表示送入 AEC 的采集路，包含已启用的多麦预处理。", "zh-Hant": traditional("四图共用归一化时间 0–1、幅度刻度 ±2（中心为 0）。AI 一行表示送入 AEC 的采集路，包含已启用的多麦预处理。"), en: "All four share normalized time 0–1 and amplitude ticks ±2, centered at 0. AI is the capture stream entering AEC, including enabled array preprocessing.", ja: "4 枚のグラフは正規化時間 0–1 と、0 を中心とする振幅目盛り ±2 を共有する。AI は AEC に入る収音経路で、有効なマイクアレイ前処理を含む。", ko: "네 그래프는 정규화 시간 0–1과 0을 중심으로 한 진폭 눈금 ±2를 공유함. AI 행은 AEC로 들어가는 수집 경로이며 활성화된 다중 마이크 전처리를 포함함." },
  aecModel: { zh: "AI = 近端语音 + 扬声器回声 + 噪声 + 混响；AEC 输出 = AI − 估计回声。演示中，回声是 AO 参考延迟 0.12 个归一化时间单位后乘以 0.506。强度改变估计回声的抵消比例，不改变 AO 或 AI 输入；真实 AEC 还需自适应估计传播路径，不能直接用 AI − AO。", "zh-Hant": traditional("AI = 近端语音 + 扬声器回声 + 噪声 + 混响；AEC 输出 = AI − 估计回声。演示中，回声是 AO 参考延迟 0.12 个归一化时间单位后乘以 0.506。强度改变估计回声的抵消比例，不改变 AO 或 AI 输入；真实 AEC 还需自适应估计传播路径，不能直接用 AI − AO。"), en: "AI = near-end voice + speaker echo + noise + reverb; AEC output = AI − estimated echo. Here echo is AO delayed by 0.12 normalized time units and scaled by 0.506. Strength changes cancellation, not AO or AI. Real AEC must adaptively estimate the acoustic path; it is not simply AI − AO.", ja: "AI = 近端音声 + スピーカーエコー + ノイズ + 残響、AEC 出力 = AI − 推定エコー。ここでは AO reference を正規化時間 0.12 だけ遅延し、0.506 倍したものをエコーとする。強度はキャンセル率を変えるが AO や AI の入力は変えない。実際の AEC には音響経路の適応推定が必要で、単純な AI − AO ではない。", ko: "AI = 근단 음성 + 스피커 에코 + 노이즈 + 잔향이며 AEC 출력 = AI − 추정 에코임. 여기서 에코는 AO reference를 정규화 시간 0.12만큼 지연하고 0.506배한 것임. 강도는 제거율을 바꾸지만 AO나 AI 입력은 바꾸지 않음. 실제 AEC는 음향 경로를 적응적으로 추정해야 하며 단순한 AI − AO가 아님." },
  stageInput: { zh: "本级输入（灰虚线）", "zh-Hant": traditional("本级输入（灰虚线）"), en: "Stage input (gray dashed)", ja: "この段階の入力（灰色の破線）", ko: "현재 단계 입력(회색 점선)" },
  stageOutput: { zh: "本级输出（绿实线）", "zh-Hant": traditional("本级输出（绿实线）"), en: "Stage output (green solid)", ja: "この段階の出力（緑色の実線）", ko: "현재 단계 출력(녹색 실선)" },
  gainRange: { zh: "本段瞬时增益范围", "zh-Hant": traditional("本段瞬时增益范围"), en: "Instantaneous gain range", ja: "この区間の瞬時ゲイン範囲", ko: "이 구간의 순간 게인 범위" },
  agcNote: { zh: "；依据已知语音包络调节，不是测量混合信号 RMS 的真实 AGC。", "zh-Hant": traditional("；依据已知语音包络调节，不是测量混合信号 RMS 的真实 AGC。"), en: "; driven by the known voice envelope, not a real AGC measuring mixture RMS.", ja: "。既知の音声包絡に基づく調整であり、混合信号 RMS を測る実際の AGC ではない。", ko: "; 알려진 음성 엔벨로프에 의해 조정되며 혼합 신호 RMS를 측정하는 실제 AGC가 아님." },
  rmsNotes: { zh: "分量 RMS 与模型说明", "zh-Hant": traditional("分量 RMS 与模型说明"), en: "Component RMS and model notes", ja: "成分 RMS とモデルの説明", ko: "성분 RMS 및 모델 설명" },
  component: { zh: "分量", "zh-Hant": traditional("分量"), en: "Component", ja: "成分", ko: "성분" },
  inputRms: { zh: "输入 RMS", "zh-Hant": traditional("输入 RMS"), en: "Input RMS", ja: "入力 RMS", ko: "입력 RMS" },
  outputRms: { zh: "输出 RMS", "zh-Hant": traditional("输出 RMS"), en: "Output RMS", ja: "出力 RMS", ko: "출력 RMS" },
  meterInput: { zh: "输入", "zh-Hant": traditional("输入"), en: "input", ja: "入力", ko: "입력" },
  meterOutput: { zh: "输出", "zh-Hant": traditional("输出"), en: "output", ja: "出力", ko: "출력" },
  rmsDescription: { zh: "RMS 为归一化分量的均方根；Δ dB = 20 log10(输出 RMS / 输入 RMS)，负值为衰减。它不是总响度、SNR 或设备实测指标。AGC 的增益随时间变化，因此各分量整段 RMS 的变化量可能不同。", "zh-Hant": traditional("RMS 为归一化分量的均方根；Δ dB = 20 log10(输出 RMS / 输入 RMS)，负值为衰减。它不是总响度、SNR 或设备实测指标。AGC 的增益随时间变化，因此各分量整段 RMS 的变化量可能不同。"), en: "RMS is the root mean square of each normalized component; Δ dB = 20 log10(output RMS / input RMS), negative for attenuation. This is not loudness, SNR or a device measurement. Time-varying AGC gain can produce different whole-segment RMS changes for different components.", ja: "RMS は各正規化成分の二乗平均平方根。Δ dB = 20 log10(出力 RMS / 入力 RMS) で、負値は減衰を示す。全体のラウドネス、SNR、実機測定値ではない。AGC のゲインは時間変化するため、成分ごとの区間 RMS の変化量は異なり得る。", ko: "RMS는 각 정규화 성분의 제곱평균제곱근임. Δ dB = 20 log10(출력 RMS / 입력 RMS)이며 음수는 감쇠를 의미함. 전체 라우드니스, SNR 또는 장치 실측값이 아님. AGC 게인은 시간에 따라 변하므로 성분별 전체 구간 RMS 변화량이 다를 수 있음." },
  yellowDashed: { zh: "黄虚线：", "zh-Hant": traditional("黄虚线："), en: "Yellow dashed: ", ja: "黄色の破線：", ko: "노란 점선: " },
  aecSynthetic: { zh: "三路是合成信号，不是真实语音录音或自适应滤波器运行结果。RMS 表只对比 AI 输入与 AEC 输出中的已知分量；AEC 不负责消除独立噪声和近端混响。", "zh-Hant": traditional("三路是合成信号，不是真实语音录音或自适应滤波器运行结果。RMS 表只对比 AI 输入与 AEC 输出中的已知分量；AEC 不负责消除独立噪声和近端混响。"), en: "These are synthetic signals, not speech recordings or an adaptive filter run. RMS compares known components in AI input and AEC output; AEC does not remove independent noise or near-end reverberation.", ja: "3 本のトラックは合成信号で、実録音や適応フィルターの実行結果ではない。RMS 表は AI 入力と AEC 出力に含まれる既知成分だけを比較し、AEC は独立ノイズや近端残響を除去しない。", ko: "세 트랙은 합성 신호이며 실제 음성 녹음이나 적응형 필터 실행 결과가 아님. RMS 표는 AI 입력과 AEC 출력의 알려진 성분만 비교하며 AEC는 독립 노이즈와 근단 잔향을 제거하지 않음." },
  agcDescription: { zh: "AGC 对整路信号施加同一时变增益，弱语音和残余噪声都可能被放大；这不是降噪。此处未模拟 attack/release。", "zh-Hant": traditional("AGC 对整路信号施加同一时变增益，弱语音和残余噪声都可能被放大；这不是降噪。此处未模拟 attack/release。"), en: "AGC applies one time-varying gain to the entire mixture. Quiet voice and residual noise may both increase; this is not denoising. Attack/release is not modeled.", ja: "AGC は信号全体に同じ時間変化ゲインを適用するため、弱い音声と残留ノイズの両方が大きくなる場合がある。これはノイズ除去ではない。attack / release はモデル化していない。", ko: "AGC는 전체 혼합 신호에 하나의 시간 변화 게인을 적용하므로 작은 음성과 잔여 노이즈가 모두 커질 수 있음. 이는 노이즈 제거가 아님. attack/release는 모델링하지 않음." },
  otherDescription: { zh: "这里单独画出本级负责的已知干扰分量，避免总波形把效果掩盖。灰线已包含前级处理，绿线只增加当前一级；真实录音不能直接拆出这些干净分量。", "zh-Hant": traditional("这里单独画出本级负责的已知干扰分量，避免总波形把效果掩盖。灰线已包含前级处理，绿线只增加当前一级；真实录音不能直接拆出这些干净分量。"), en: "The plot isolates the known interference targeted by this stage. Gray includes upstream processing; green adds only this stage. Real recordings do not expose these clean components directly.", ja: "ここではこの段階が対象とする既知の干渉成分だけを描き、全体波形に効果が埋もれないようにしている。灰色は前段処理を含み、緑色は現段階だけを追加する。実録音からこのような純粋な成分を直接取り出すことはできない。", ko: "여기서는 이 단계가 대상으로 하는 알려진 간섭 성분만 그려 전체 파형에 효과가 묻히지 않게 함. 회색은 이전 단계 처리를 포함하고 녹색은 현재 단계만 추가함. 실제 녹음에서는 이런 깨끗한 성분을 직접 분리할 수 없음." }
} satisfies Record<string, Localized>;
export function EnhancementStageFocus({ language, mode, strengths, micCount }: {
  language: Language; mode: EnhancementMode; strengths: ProcessingStrengths; micCount: number;
}) {
  const beforeProcessing = processingThrough(mode, strengths, micCount, false);
  const afterProcessing = processingThrough(mode, strengths, micCount);
  const before = Array.from({ length: 512 }, (_, i) => speechComponents(i / 511, beforeProcessing, micCount));
  const after = Array.from({ length: 512 }, (_, i) => speechComponents(i / 511, afterProcessing, micCount));
  const key = mode === "aec" ? "echo" : mode === "dereverb" ? "reverb" : mode === "agc" ? "total" : "noise";
  const range = { noise: 0.25, echo: 0.6, reverb: 0.25, total: 2 }[key];
  const title = mode === "agc" ? copy.agcTitle[language]
    : mode === "beamforming" ? copy.beamTitle[language]
    : `${mode.toUpperCase()} · ${labels[key as keyof typeof labels][language]}`;
  const axis = {
    zh: `横轴：归一化时间 0–1（不是秒）；纵轴：${mode === "agc" ? "混合信号" : "已知干扰分量"}幅度 ±${range}，不是 dBFS 或声压。前后共用固定刻度，不随强度自动放大。`, "zh-Hant": traditional(`横轴：归一化时间 0–1（不是秒）；纵轴：${mode === "agc" ? "混合信号" : "已知干扰分量"}幅度 ±${range}，不是 dBFS 或声压。前后共用固定刻度，不随强度自动放大。`),
    en: `X: normalized time 0–1 (not seconds); Y: ${mode === "agc" ? "mixture" : "known interference"} amplitude ±${range}, not dBFS or sound pressure. Input and output share a fixed scale, without strength-dependent zoom.`,
    ja: `横軸：正規化時間 0–1（秒ではない）。縦軸：${mode === "agc" ? "混合信号" : "既知の干渉成分"}の振幅 ±${range}。dBFS や音圧ではない。入力と出力は固定スケールを共有し、強度に応じて自動拡大しない。`,
    ko: `가로축: 정규화 시간 0–1(초가 아님). 세로축: ${mode === "agc" ? "혼합 신호" : "알려진 간섭 성분"} 진폭 ±${range}, dBFS나 음압이 아님. 입력과 출력은 고정 눈금을 공유하며 강도에 따라 자동 확대하지 않음.`
  }[language];
  const beamNote = {
    zh: `当前 ${micCount} 麦：目标语音保持单位增益，观察空间干扰分量的降低。这里仅用预设残留比例解释阵列作用，没有模拟麦克风间距、方向或 DOA；不能据此推断真实 2 麦/4 麦产品的提升。`, "zh-Hant": traditional(`当前 ${micCount} 麦：目标语音保持单位增益，观察空间干扰分量的降低。这里仅用预设残留比例解释阵列作用，没有模拟麦克风间距、方向或 DOA；不能据此推断真实 2 麦/4 麦产品的提升。`),
    en: `${micCount} microphones: unity target gain, with reduced spatial interference. Preset residual ratios illustrate array behavior; geometry, steering and DOA are not simulated. This is not a measured 2-/4-mic improvement.`,
    ja: `現在は ${micCount} 本のマイク：目的音声は単位ゲインを保ち、空間干渉成分の低下を観察する。アレイの働きを説明するため残留率をあらかじめ設定しており、マイク間隔、方向、DOA はモデル化していない。実際の 2 / 4 マイク製品の改善量は推定できない。`,
    ko: `현재 ${micCount}개 마이크: 목표 음성은 단위 게인을 유지하고 공간 간섭 성분의 감소를 관찰함. 배열 동작을 설명하기 위해 잔여 비율을 미리 설정했으며 마이크 간격, 방향 및 DOA는 모델링하지 않음. 실제 2/4 마이크 제품의 개선량을 추정할 수 없음.`
  }[language];
  const path = (samples: typeof before) => samples.map((s, i) => `${i ? "L" : "M"} ${i / 511 * 800} ${90 - s[key] * 80 / range}`).join(" ");
  const rms = (samples: typeof before, component: keyof typeof labels) => Math.sqrt(samples.reduce((sum, s) => sum + s[component] ** 2, 0) / samples.length);
  const aecPath = (values: number[]) => values.map((v, i) => `${i ? "L" : "M"} ${48 + i / 511 * 728} ${110 - v * 40}`).join(" ");
  return <section className="enhancement-stage-focus" aria-label={copy.currentStage[language]}>
    <h2>{title}</h2>
    {mode === "aec" ? <div className="aec-three-tracks">
      <p className="aec-reading-summary">{copy.aecSummary[language]}</p>
      <p data-testid="aec-cancellation-readout">{copy.cancellation[language]}: {(strengths.aec * 0.94).toFixed(1)}% / {(100 - strengths.aec * 0.94).toFixed(1)}%{copy.relativeInput[language]}</p>
      {[
        { id: "ao", label: copy.ao[language], values: before.map((_, i) => playbackReference(i / 511)) },
        { id: "ai", label: copy.ai[language], values: before.map(s => s.total) },
        { id: "estimate", label: copy.estimate[language], values: before.map((s, i) => s.echo - after[i].echo) },
        { id: "output", label: copy.output[language], values: after.map(s => s.total) }
      ].map((track, index) => <div className="aec-track" key={track.id}>
        <h3>{index + 1}. {track.label}</h3>
        <div className="aec-track-legend">
          <span><i className={track.id === "ai" ? "aec-key-input" : "aec-key-output"} />{track.id === "ao" ? copy.speakerSignal[language] : track.id === "estimate" ? copy.estimatedEcho[language] : copy.fullMixture[language]}</span>
          {(track.id === "ai" || track.id === "output") && <span><i className="aec-key-echo" />{track.id === "ai" ? copy.echoComponent[language] : copy.residualEcho[language]}</span>}
        </div>
        <div className="aec-axis-caption">{copy.normalizedAmplitude[language]}</div>
        <div className="aec-plot-row"><div className="aec-y-axis"><span>+2</span><span>0</span><span>−2</span></div>
        <svg role="img" aria-label={track.label} viewBox="48 30 728 160" preserveAspectRatio="none">
          {[-2, 0, 2].map(value => <g key={value}>
            <line x1="48" x2="776" y1={110 - value * 40} y2={110 - value * 40} stroke="#536c64" />
          </g>)}
          <line x1={48 + (track.id === "ao" ? 0 : 0.12) * 728} x2={48 + (track.id === "ao" ? 0 : 0.12) * 728} y1="24" y2="190" stroke="#f1bb72" strokeDasharray="3 5" />
          <path className={track.id === "ai" ? "focus-before-line" : "focus-after-line"} data-testid={`aec-track-${track.id}`}
            d={aecPath(track.values)} />
          {(track.id === "ai" || track.id === "output") && <path data-testid={`aec-echo-${track.id}`} d={aecPath((track.id === "ai" ? before : after).map(s => s.echo))} fill="none" stroke="#f1bb72" strokeWidth="2" strokeDasharray="7 4" />}
        </svg></div>
        <div className="aec-x-axis">{[0, 0.25, 0.5, 0.75, 1].map(t => <span key={t}>{t}</span>)}</div>
        <div className="aec-axis-caption">{copy.normalizedTime[language]}</div>
        <p>{track.id === "estimate" ? copy.estimateNote[language] : track.id === "ao"
          ? copy.playbackNote[language]
          : (() => {
            const echoLabel = track.id === "ai" ? copy.inputEcho[language] : copy.residual[language];
            return {
              zh: `${copy.yellowDashed.zh}${echoLabel}；回声从 t = 0.12 开始，与 AO 相比延迟 0.12。`, "zh-Hant": traditional(`${copy.yellowDashed.zh}${echoLabel}；回声从 t = 0.12 开始，与 AO 相比延迟 0.12。`),
              en: `${copy.yellowDashed.en}${echoLabel}; onset at t = 0.12, delayed by 0.12 relative to AO.`,
              ja: `${copy.yellowDashed.ja}${echoLabel}。エコーは t = 0.12 から始まり、AO より 0.12 遅れる。`,
              ko: `${copy.yellowDashed.ko}${echoLabel}; 에코는 t = 0.12에서 시작하며 AO보다 0.12 늦음.`
            }[language];
          })()}</p>
      </div>)}
      <details className="speech-explanation"><summary>{copy.aecPlots[language]}</summary>
      <p>{copy.aecShared[language]}</p>
      <p>{copy.aecModel[language]}</p>
      </details>
    </div> : <>
    <div className="aec-track-legend"><span><i className="aec-key-input" />{copy.stageInput[language]}</span><span><i className="aec-key-output" />{copy.stageOutput[language]}</span></div>
    <div className="aec-plot-row"><div className="aec-y-axis"><span>+{range}</span><span>0</span><span>−{range}</span></div>
    <svg role="img" aria-label={title} viewBox="0 10 800 160" preserveAspectRatio="none">
      <line x1="0" x2="800" y1="90" y2="90" stroke="#536c64" />
      <path className="focus-before-line" data-testid="speech-focus-before" d={path(before)} />
      <path className="focus-after-line" data-testid="speech-focus-after" d={path(after)} />
    </svg></div>
    <div className="aec-x-axis">{[0, 0.25, 0.5, 0.75, 1].map(t => <span key={t}>{t}</span>)}</div>
    <p className="enhancement-focus-axis">{axis}</p>
    {mode === "agc" && <p>{copy.gainRange[language]}: {Math.min(...after.map(s => s.gain)).toFixed(2)}–{Math.max(...after.map(s => s.gain)).toFixed(2)}×{copy.agcNote[language]}</p>}
    </>}
    <details className="speech-explanation"><summary>{copy.rmsNotes[language]}</summary>
    <div className="enhancement-component-table" role="table" aria-label={copy.rmsNotes[language]}>
      <div role="row"><strong role="columnheader">{copy.component[language]}</strong><strong role="columnheader">{copy.inputRms[language]}</strong><strong role="columnheader">{copy.outputRms[language]}</strong><strong role="columnheader">Δ dB</strong></div>
      {(Object.keys(labels) as (keyof typeof labels)[]).map(component => {
        const input = rms(before, component), output = rms(after, component);
        return <div role="row" key={component} data-testid={`speech-component-${component}`}>
          <span role="cell">{labels[component][language]}</span>
          <span role="cell"><meter min="0" max="1" value={input} aria-label={`${labels[component][language]} ${copy.meterInput[language]}`} />{input.toFixed(4)}</span>
          <span role="cell"><meter min="0" max="1" value={output} aria-label={`${labels[component][language]} ${copy.meterOutput[language]}`} />{output.toFixed(4)}</span>
          <span role="cell">{(20 * Math.log10(Math.max(output, 1e-12) / Math.max(input, 1e-12))).toFixed(1)}</span>
        </div>;
      })}
    </div>
    <p>{copy.rmsDescription[language]}</p>
    <p>{mode === "beamforming"
      ? beamNote
      : mode === "aec"
        ? copy.aecSynthetic[language]
      : mode === "agc"
        ? copy.agcDescription[language]
      : copy.otherDescription[language]}</p>
    </details>
  </section>;
}
