import { useMemo, useState } from "react";
import type { Language } from "../content/knowledge";
import { arrayExample, spectralExample } from "./spatialSpectralModel";

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
  const zh = language === "zh";
  const [frameIndex, setFrameIndex] = useState(7);
  const array = useMemo(() => mode === "beamforming" ? arrayExample(micCount, steering) : null, [mode, micCount, steering]);
  const spectral = useMemo(() => mode === "ns" ? spectralExample(strength) : null, [mode, strength]);
  if (array) return <section className="enhancement-stage-focus" aria-label={zh ? "延迟求和演示" : "Delay-and-sum demo"}>
    <h2>{zh ? "空间对齐，而不是统一缩小噪声" : "Spatial alignment, not uniform noise scaling"}</h2>
    <p>{zh ? "线阵麦间距 4 cm；声速 343 m/s。目标在 +30°，干扰在 −40°；0° 为阵列正侧向。目标为 1/1.5 kHz 合成音，干扰为 2 kHz 音，不是真实语音。" : "Linear array, 4 cm spacing, sound speed 343 m/s. Target +30°, interferer −40°; 0° is broadside. Target contains 1/1.5 kHz tones; interference is 2 kHz, not speech recordings."}</p>
    <p>{zh ? "补偿时间（相对 Mic 1，μs）" : "Compensation relative to Mic 1 (μs)"}: {array.delays.map(d => (d * 1e6).toFixed(1)).join(" / ")}</p>
    <div className="algorithm-plot-grid">
    <Plot title={zh ? "1. 目标到达各麦：存在时间差" : "1. Target arrival: channel delays"} traces={array.rawTarget.map((values, i) => ({ values, label: `Mic ${i + 1}` }))} axis={zh ? "横轴 0–4 ms；纵轴归一化幅度 ±1。仅分离目标分量以观察对齐。" : "X 0–4 ms; Y normalized amplitude ±1. Target component isolated to show alignment."} />
    <Plot title={zh ? "2. 按指向补偿：对准 +30° 时目标重合" : "2. Steering compensation: target aligns at +30°"} traces={array.alignedTarget.map((values, i) => ({ values, label: `Mic ${i + 1}` }))} axis={zh ? "横轴 0–4 ms；纵轴 ±1。指向错误也会削弱目标。" : "X 0–4 ms; Y ±1. Wrong steering also attenuates the target."} />
    <Plot title={zh ? "3. 完整混合信号：单麦与平均合成" : "3. Full mixture: one microphone versus averaged sum"} traces={[{ values: array.input, label: zh ? "Mic 1 输入" : "Mic 1 input" }, { values: array.output, label: zh ? "延迟求和输出" : "Delay-and-sum output" }]} axis={zh ? "横轴 0–4 ms；纵轴 ±1；y(t) = Σ 对齐后的麦克风信号 / 麦数。" : "X 0–4 ms; Y ±1; y(t) = sum of aligned channels / microphone count."} />
    </div>
    <p>{zh ? "单麦时原样通过。理想远场平面波，解析计算分数延迟，图中省略共同延迟；实际设备需要因果延迟滤波器、同步及校准。未模拟反射和传感器噪声，更多麦不保证所有方向/频率都改善。" : "One microphone passes through unchanged. Ideal far-field plane waves with analytic fractional shifts; common latency is omitted. Real devices need causal delay filters, synchronization and calibration. Reflections and sensor noise are omitted; more microphones do not guarantee improvement at every frequency/direction."}</p>
    <a href="https://speechprocessingbook.aalto.fi/enhancement/multi-channel-speech-enhancement-and-beamforming/" target="_blank" rel="noreferrer">Aalto · Delay-and-sum</a>
  </section>;
  if (!spectral) return null;
  const frame = spectral.frames[frameIndex];
  const db = (power: number) => Math.max(-80, 10 * Math.log10(Math.max(1e-12, power / 128 ** 2)));
  return <section className="enhancement-stage-focus" aria-label={zh ? "频谱降噪演示" : "Spectral suppression demo"}>
    <h2>{zh ? "频带增益，而不是整段调小" : "Frequency-dependent gain, not whole-signal volume"}</h2>
    <p>{zh ? "8 kHz PCM，128 ms；前 32 ms 只有噪声，用于估计噪声功率谱。之后加入 500/1000 Hz 包络合成音。128 点窗、64 点 hop，保留原相位并重叠相加重建。" : "8 kHz PCM, 128 ms. The first 32 ms contain noise only for noise-power estimation, followed by enveloped 500/1000 Hz tones. 128-sample window, 64-sample hop, original phase and overlap-add reconstruction."}</p>
    <div className="algorithm-plot-grid">
    <Plot title={zh ? "完整 PCM：处理前后" : "Full PCM: before and after"} traces={[{ values: spectral.input, label: zh ? "输入" : "Input" }, { values: spectral.output, label: zh ? "输出" : "Output" }]} axis={zh ? "横轴 0–127.875 ms；纵轴归一化幅度 ±1。" : "X 0–127.875 ms; Y normalized amplitude ±1."} />
    <label className="spectral-frame-select">{zh ? "观察时间帧" : "Inspect frame"}<select value={frameIndex} onChange={e => setFrameIndex(Number(e.target.value))}>{spectral.frames.map((f, i) => <option key={f.start} value={i}>{f.start / 8}–{(f.start + 128) / 8} ms</option>)}</select></label>
    <Plot title={zh ? "当前帧：频谱前后对比" : "Selected frame: spectral comparison"} min={-80} max={0} traces={[{ values: frame.inputPower.map(db), label: zh ? "输入频谱" : "Input spectrum" }, { values: frame.outputPower.map(db), label: zh ? "输出频谱" : "Output spectrum" }]} axis={zh ? "横轴 0–4 kHz；纵轴 10 log10(|DFT|²/128²)，固定 −80…0 dB，非 PSD 或校准 dBFS。" : "X 0–4 kHz; Y 10 log10(|DFT|²/128²), fixed −80…0 dB; not PSD or calibrated dBFS."} />
    <Plot title={zh ? "当前帧：各频率格的幅度增益" : "Selected frame: gain per frequency bin"} min={0} max={1} traces={[{ values: frame.gains, label: zh ? "增益 G" : "Gain G" }]} axis={zh ? "横轴 0–4 kHz；纵轴 0–1，越低抑制越强。" : "X 0–4 kHz; Y 0–1, lower means stronger suppression."} />
    </div>
    <p>{zh ? "G = √max(0.01, 1 − α·噪声功率/输入功率)。α 为当前强度比例；0% 原样重建，增益下限 0.1（−20 dB）避免硬置零。噪声估计固定，语音与噪声重叠时也可能损伤语音；未加入增益平滑，可能出现音乐噪声。独立单通道示例，不是 AI 降噪或链路性能测量。" : "G = √max(0.01, 1 − α·noise power/input power). α is suppression strength; 0% reconstructs the input. Minimum amplitude gain 0.1 (−20 dB) avoids hard zeros. Fixed noise estimation can damage overlapping speech; no gain smoothing is applied, so musical noise is possible. Standalone single-channel example, not AI denoising or a chain benchmark."}</p>
  </section>;
}
