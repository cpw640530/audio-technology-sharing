import { traditional } from "../content/traditional";
import { useMemo, useState } from "react";
import type { Language } from "../content/knowledge";
import { arrayExample, spectralExample } from "./spatialSpectralModel";

type Localized = Record<"zh" | "en" | "ja" | "ko" | "zh-Hant", string>;

const copy = {
  delayDemo: { zh: "延迟求和演示", "zh-Hant": traditional("延迟求和演示"), en: "Delay-and-sum demo", ja: "遅延和演算のデモ", ko: "지연 합산 데모" },
  alignmentTitle: { zh: "空间对齐，而不是统一缩小噪声", "zh-Hant": traditional("空间对齐，而不是统一缩小噪声"), en: "Spatial alignment, not uniform noise scaling", ja: "空間的にそろえるのであって、ノイズ全体を一様に下げるのではない", ko: "공간 정렬이지 노이즈 전체를 일괄 축소하는 것이 아님" },
  arraySetup: { zh: "线阵麦间距 4 cm；声速 343 m/s。目标在 +30°，干扰在 −40°；0° 为阵列正侧向。目标为 1/1.5 kHz 合成音，干扰为 2 kHz 音，不是真实语音。", "zh-Hant": traditional("线阵麦间距 4 cm；声速 343 m/s。目标在 +30°，干扰在 −40°；0° 为阵列正侧向。目标为 1/1.5 kHz 合成音，干扰为 2 kHz 音，不是真实语音。"), en: "Linear array, 4 cm spacing, sound speed 343 m/s. Target +30°, interferer −40°; 0° is broadside. Target contains 1/1.5 kHz tones; interference is 2 kHz, not speech recordings.", ja: "線形アレイのマイク間隔は 4 cm、音速は 343 m/s。目的音は +30°、干渉音は −40°、0° はアレイ正面。目的音は 1/1.5 kHz の合成音、干渉音は 2 kHz で、実録音の音声ではない。", ko: "선형 배열의 마이크 간격은 4 cm, 음속은 343 m/s. 목표음은 +30°, 간섭음은 −40°이며 0°는 배열 정면임. 목표음은 1/1.5 kHz 합성음, 간섭음은 2 kHz이며 실제 음성 녹음이 아님." },
  compensation: { zh: "补偿时间（相对 Mic 1，μs）", "zh-Hant": traditional("补偿时间（相对 Mic 1，μs）"), en: "Compensation relative to Mic 1 (μs)", ja: "補償時間（Mic 1 基準、μs）", ko: "보상 시간(Mic 1 기준, μs)" },
  targetArrival: { zh: "1. 目标到达各麦：存在时间差", "zh-Hant": traditional("1. 目标到达各麦：存在时间差"), en: "1. Target arrival: channel delays", ja: "1. 目的音の到達：チャンネル間の遅延", ko: "1. 목표음 도달: 채널 지연" },
  targetArrivalAxis: { zh: "横轴 0–4 ms；纵轴归一化幅度 ±1。仅分离目标分量以观察对齐。", "zh-Hant": traditional("横轴 0–4 ms；纵轴归一化幅度 ±1。仅分离目标分量以观察对齐。"), en: "X 0–4 ms; Y normalized amplitude ±1. Target component isolated to show alignment.", ja: "横軸 0–4 ms、縦軸は正規化振幅 ±1。整列を確認するため目的音成分だけを分離。", ko: "가로축 0–4 ms, 세로축 정규화 진폭 ±1. 정렬을 보기 위해 목표음 성분만 분리함." },
  steering: { zh: "2. 按指向补偿：对准 +30° 时目标重合", "zh-Hant": traditional("2. 按指向补偿：对准 +30° 时目标重合"), en: "2. Steering compensation: target aligns at +30°", ja: "2. 指向補償：+30° に合わせると目的音が重なる", ko: "2. 조향 보상: +30°에서 목표음 정렬" },
  steeringAxis: { zh: "横轴 0–4 ms；纵轴 ±1。指向错误也会削弱目标。", "zh-Hant": traditional("横轴 0–4 ms；纵轴 ±1。指向错误也会削弱目标。"), en: "X 0–4 ms; Y ±1. Wrong steering also attenuates the target.", ja: "横軸 0–4 ms、縦軸 ±1。指向を誤ると目的音も弱くなる。", ko: "가로축 0–4 ms, 세로축 ±1. 잘못 조향하면 목표음도 약해짐." },
  mixture: { zh: "3. 完整混合信号：单麦与平均合成", "zh-Hant": traditional("3. 完整混合信号：单麦与平均合成"), en: "3. Full mixture: one microphone versus averaged sum", ja: "3. 完全な混合信号：単一マイクと平均合成の比較", ko: "3. 전체 혼합 신호: 단일 마이크와 평균 합산 비교" },
  mixtureAxis: { zh: "横轴 0–4 ms；纵轴 ±1；y(t) = Σ 对齐后的麦克风信号 / 麦数。", "zh-Hant": traditional("横轴 0–4 ms；纵轴 ±1；y(t) = Σ 对齐后的麦克风信号 / 麦数。"), en: "X 0–4 ms; Y ±1; y(t) = sum of aligned channels / microphone count.", ja: "横軸 0–4 ms、縦軸 ±1。y(t) = 整列後のマイク信号の総和 / マイク数。", ko: "가로축 0–4 ms, 세로축 ±1. y(t) = 정렬된 마이크 신호의 합 / 마이크 수." },
  micInput: { zh: "Mic 1 输入", "zh-Hant": traditional("Mic 1 输入"), en: "Mic 1 input", ja: "Mic 1 入力", ko: "Mic 1 입력" },
  delayOutput: { zh: "延迟求和输出", "zh-Hant": traditional("延迟求和输出"), en: "Delay-and-sum output", ja: "遅延和出力", ko: "지연 합산 출력" },
  arrayNote: { zh: "单麦时原样通过。理想远场平面波，解析计算分数延迟，图中省略共同延迟；实际设备需要因果延迟滤波器、同步及校准。未模拟反射和传感器噪声，更多麦不保证所有方向/频率都改善。", "zh-Hant": traditional("单麦时原样通过。理想远场平面波，解析计算分数延迟，图中省略共同延迟；实际设备需要因果延迟滤波器、同步及校准。未模拟反射和传感器噪声，更多麦不保证所有方向/频率都改善。"), en: "One microphone passes through unchanged. Ideal far-field plane waves with analytic fractional shifts; common latency is omitted. Real devices need causal delay filters, synchronization and calibration. Reflections and sensor noise are omitted; more microphones do not guarantee improvement at every frequency/direction.", ja: "単一マイクではそのまま通過する。理想的な遠方界平面波に対して分数遅延を解析的に計算し、共通遅延は図から省略した。実機には因果的な遅延フィルター、同期、校正が必要。反射とセンサー雑音は未モデル化で、マイクを増やしても全方向・全周波数が改善するとは限らない。", ko: "단일 마이크에서는 그대로 통과함. 이상적인 원거리 평면파에 대해 분수 지연을 해석적으로 계산하고 공통 지연은 그림에서 생략함. 실제 장치에는 인과 지연 필터, 동기화 및 보정이 필요함. 반사와 센서 노이즈는 모델링하지 않았으며 마이크를 늘려도 모든 방향/주파수가 개선된다는 보장은 없음." },
  spectralDemo: { zh: "频谱降噪演示", "zh-Hant": traditional("频谱降噪演示"), en: "Spectral suppression demo", ja: "スペクトル抑制のデモ", ko: "스펙트럼 억제 데모" },
  spectralTitle: { zh: "频带增益，而不是整段调小", "zh-Hant": traditional("频带增益，而不是整段调小"), en: "Frequency-dependent gain, not whole-signal volume", ja: "周波数帯域ごとのゲインであり、信号全体の音量ではない", ko: "전체 신호 볼륨이 아니라 주파수별 게인" },
  spectralSetup: { zh: "8 kHz PCM，128 ms；前 32 ms 只有噪声，用于估计噪声功率谱。之后加入 500/1000 Hz 包络合成音。128 点窗、64 点 hop，保留原相位并重叠相加重建。", "zh-Hant": traditional("8 kHz PCM，128 ms；前 32 ms 只有噪声，用于估计噪声功率谱。之后加入 500/1000 Hz 包络合成音。128 点窗、64 点 hop，保留原相位并重叠相加重建。"), en: "8 kHz PCM, 128 ms. The first 32 ms contain noise only for noise-power estimation, followed by enveloped 500/1000 Hz tones. 128-sample window, 64-sample hop, original phase and overlap-add reconstruction.", ja: "8 kHz PCM、128 ms。最初の 32 ms はノイズだけで、ノイズパワースペクトルの推定に使う。その後、包絡を持つ 500/1000 Hz の合成音を加える。128 サンプル窓、64 サンプル hop、元の位相を保ったオーバーラップ加算で再構成する。", ko: "8 kHz PCM, 128 ms. 처음 32 ms는 노이즈만 있어 노이즈 전력 스펙트럼 추정에 사용함. 이후 엔벨로프가 있는 500/1000 Hz 톤을 추가함. 128 샘플 윈도, 64 샘플 hop, 원래 위상을 유지한 오버랩-애드로 재구성함." },
  fullPcm: { zh: "完整 PCM：处理前后", "zh-Hant": traditional("完整 PCM：处理前后"), en: "Full PCM: before and after", ja: "全体 PCM：処理前と処理後", ko: "전체 PCM: 처리 전과 후" },
  fullPcmAxis: { zh: "横轴 0–127.875 ms；纵轴归一化幅度 ±1。", "zh-Hant": traditional("横轴 0–127.875 ms；纵轴归一化幅度 ±1。"), en: "X 0–127.875 ms; Y normalized amplitude ±1.", ja: "横軸 0–127.875 ms、縦軸は正規化振幅 ±1。", ko: "가로축 0–127.875 ms, 세로축 정규화 진폭 ±1." },
  inspect: { zh: "观察时间帧", "zh-Hant": traditional("观察时间帧"), en: "Inspect frame", ja: "時間フレームを確認", ko: "시간 프레임 확인" },
  comparison: { zh: "当前帧：频谱前后对比", "zh-Hant": traditional("当前帧：频谱前后对比"), en: "Selected frame: spectral comparison", ja: "選択フレーム：処理前後のスペクトル比較", ko: "선택한 프레임: 스펙트럼 비교" },
  inputSpectrum: { zh: "输入频谱", "zh-Hant": traditional("输入频谱"), en: "Input spectrum", ja: "入力スペクトル", ko: "입력 스펙트럼" },
  outputSpectrum: { zh: "输出频谱", "zh-Hant": traditional("输出频谱"), en: "Output spectrum", ja: "出力スペクトル", ko: "출력 스펙트럼" },
  spectrumAxis: { zh: "横轴 0–4 kHz；纵轴 10 log10(|DFT|²/128²)，固定 −80…0 dB，非 PSD 或校准 dBFS。", "zh-Hant": traditional("横轴 0–4 kHz；纵轴 10 log10(|DFT|²/128²)，固定 −80…0 dB，非 PSD 或校准 dBFS。"), en: "X 0–4 kHz; Y 10 log10(|DFT|²/128²), fixed −80…0 dB; not PSD or calibrated dBFS.", ja: "横軸 0–4 kHz、縦軸 10 log10(|DFT|²/128²)。−80…0 dB に固定し、PSD や校正済み dBFS ではない。", ko: "가로축 0–4 kHz, 세로축 10 log10(|DFT|²/128²), −80…0 dB로 고정하며 PSD나 보정된 dBFS가 아님." },
  gain: { zh: "当前帧：各频率格的幅度增益", "zh-Hant": traditional("当前帧：各频率格的幅度增益"), en: "Selected frame: gain per frequency bin", ja: "選択フレーム：各周波数ビンの振幅ゲイン", ko: "선택한 프레임: 주파수 빈별 진폭 게인" },
  gainLabel: { zh: "增益 G", "zh-Hant": traditional("增益 G"), en: "Gain G", ja: "ゲイン G", ko: "게인 G" },
  gainAxis: { zh: "横轴 0–4 kHz；纵轴 0–1，越低抑制越强。", "zh-Hant": traditional("横轴 0–4 kHz；纵轴 0–1，越低抑制越强。"), en: "X 0–4 kHz; Y 0–1, lower means stronger suppression.", ja: "横軸 0–4 kHz、縦軸 0–1。低いほど抑制が強い。", ko: "가로축 0–4 kHz, 세로축 0–1이며 낮을수록 억제가 강함." },
  input: { zh: "输入", "zh-Hant": traditional("输入"), en: "Input", ja: "入力", ko: "입력" },
  output: { zh: "输出", "zh-Hant": traditional("输出"), en: "Output", ja: "出力", ko: "출력" },
  suppressionNote: { zh: "G = √max(0.01, 1 − α·噪声功率/输入功率)。α 为当前强度比例；0% 原样重建，增益下限 0.1（−20 dB）避免硬置零。噪声估计固定，语音与噪声重叠时也可能损伤语音；未加入增益平滑，可能出现音乐噪声。独立单通道示例，不是 AI 降噪或链路性能测量。", "zh-Hant": traditional("G = √max(0.01, 1 − α·噪声功率/输入功率)。α 为当前强度比例；0% 原样重建，增益下限 0.1（−20 dB）避免硬置零。噪声估计固定，语音与噪声重叠时也可能损伤语音；未加入增益平滑，可能出现音乐噪声。独立单通道示例，不是 AI 降噪或链路性能测量。"), en: "G = √max(0.01, 1 − α·noise power/input power). α is suppression strength; 0% reconstructs the input. Minimum amplitude gain 0.1 (−20 dB) avoids hard zeros. Fixed noise estimation can damage overlapping speech; no gain smoothing is applied, so musical noise is possible. Standalone single-channel example, not AI denoising or a chain benchmark.", ja: "G = √max(0.01, 1 − α·ノイズパワー/入力パワー)。α は抑制強度で、0% なら入力をそのまま再構成する。振幅ゲインの下限 0.1（−20 dB）は完全なゼロ化を避けるため。固定したノイズ推定は音声とノイズが重なる場合に音声を損なうことがあり、ゲイン平滑化を行わないためミュージカルノイズが生じる可能性がある。単独の単一チャンネル例であり、AI ノイズ除去や経路性能の測定ではない。", ko: "G = √max(0.01, 1 − α·노이즈 전력/입력 전력). α는 억제 강도이며 0%는 입력을 그대로 재구성함. 진폭 게인 하한 0.1(−20 dB)은 완전한 0을 피하기 위한 것임. 고정된 노이즈 추정은 음성과 노이즈가 겹칠 때 음성을 손상할 수 있고, 게인 평활화를 하지 않아 음악성 노이즈가 생길 수 있음. 독립 단일 채널 예시이며 AI 노이즈 제거 또는 전체 경로 성능 측정이 아님."
  }
} satisfies Record<string, Localized>;

function Plot({ title, traces, min = -1, max = 1, axis }: { title: string; traces: { values: number[]; label: string }[]; min?: number; max?: number; axis: string }) {
  const colors = ["#b8c4ce", "#7ee7d8", "#f1bb72", "#bdacf2"];
  return <section className="algorithm-signal-plot"><h3>{title}</h3>
    <div className="aec-track-legend">{traces.map((t, i) => <span key={t.label} style={{ color: colors[i] }}>{i + 1}. {t.label}</span>)}</div>
    <div className="aec-plot-row"><div className="aec-y-axis"><span>{max}</span><span>{(max + min) / 2}</span><span>{min}</span></div>
      <svg role="img" aria-label={title} viewBox="0 0 800 160" preserveAspectRatio="none">
        {[0, 80, 160].map(y => <line key={y} x1="0" x2="800" y1={y} y2={y} stroke="#536c64" />)}
        {traces.map((t, i) => <path key={t.label} fill="none" stroke={colors[i]} strokeWidth="1.5" strokeDasharray={i === 0 ? "5 3" : undefined} d={t.values.map((v, n) => `${n ? "L" : "M"} ${n / (t.values.length - 1) * 800} ${(max - v) / (max - min) * 160}`).join(" ")} />)}
      </svg>
    </div><p>{axis}</p>
  </section>;
}

export function SpatialSpectralDemo({ language, mode, micCount, steering, strength }: { language: Language; mode: "beamforming" | "ns"; micCount: number; steering: number; strength: number }) {
  const [frameIndex, setFrameIndex] = useState(7);
  const array = useMemo(() => mode === "beamforming" ? arrayExample(micCount, steering) : null, [mode, micCount, steering]);
  const spectral = useMemo(() => mode === "ns" ? spectralExample(strength) : null, [mode, strength]);
  if (array) return <section className="enhancement-stage-focus" aria-label={copy.delayDemo[language]}>
    <h2>{copy.alignmentTitle[language]}</h2>
    <p>{copy.arraySetup[language]}</p>
    <p>{copy.compensation[language]}: {array.delays.map(d => (d * 1e6).toFixed(1)).join(" / ")}</p>
    <div className="algorithm-plot-grid">
    <Plot title={copy.targetArrival[language]} traces={array.rawTarget.map((values, i) => ({ values, label: `Mic ${i + 1}` }))} axis={copy.targetArrivalAxis[language]} />
    <Plot title={copy.steering[language]} traces={array.alignedTarget.map((values, i) => ({ values, label: `Mic ${i + 1}` }))} axis={copy.steeringAxis[language]} />
    <Plot title={copy.mixture[language]} traces={[{ values: array.input, label: copy.micInput[language] }, { values: array.output, label: copy.delayOutput[language] }]} axis={copy.mixtureAxis[language]} />
    </div>
    <p>{copy.arrayNote[language]}</p>
    <a href="https://speechprocessingbook.aalto.fi/enhancement/multi-channel-speech-enhancement-and-beamforming/" target="_blank" rel="noreferrer">Aalto · Delay-and-sum</a>
  </section>;
  if (!spectral) return null;
  const frame = spectral.frames[frameIndex];
  const db = (power: number) => Math.max(-80, 10 * Math.log10(Math.max(1e-12, power / 128 ** 2)));
  return <section className="enhancement-stage-focus" aria-label={copy.spectralDemo[language]}>
    <h2>{copy.spectralTitle[language]}</h2>
    <p>{copy.spectralSetup[language]}</p>
    <div className="algorithm-plot-grid">
    <Plot title={copy.fullPcm[language]} traces={[{ values: spectral.input, label: copy.input[language] }, { values: spectral.output, label: copy.output[language] }]} axis={copy.fullPcmAxis[language]} />
    <label className="spectral-frame-select">{copy.inspect[language]}<select value={frameIndex} onChange={e => setFrameIndex(Number(e.target.value))}>{spectral.frames.map((f, i) => <option key={f.start} value={i}>{f.start / 8}–{(f.start + 128) / 8} ms</option>)}</select></label>
    <Plot title={copy.comparison[language]} min={-80} max={0} traces={[{ values: frame.inputPower.map(db), label: copy.inputSpectrum[language] }, { values: frame.outputPower.map(db), label: copy.outputSpectrum[language] }]} axis={copy.spectrumAxis[language]} />
    <Plot title={copy.gain[language]} min={0} max={1} traces={[{ values: frame.gains, label: copy.gainLabel[language] }]} axis={copy.gainAxis[language]} />
    </div>
    <p>{copy.suppressionNote[language]}</p>
  </section>;
}
