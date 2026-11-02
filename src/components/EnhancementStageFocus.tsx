import type { Language } from "../content/knowledge";
import { playbackReference, processingThrough, speechComponents, type EnhancementMode, type ProcessingStrengths } from "./speechEnhancementModel";

const labels = {
  speech: ["近端语音", "Near-end voice"], noise: ["噪声", "Noise"],
  echo: ["远端回声", "Remote echo"], reverb: ["混响拖尾", "Reverb tail"]
};
export function EnhancementStageFocus({ language, mode, strengths, micCount }: {
  language: Language; mode: EnhancementMode; strengths: ProcessingStrengths; micCount: number;
}) {
  const zh = language === "zh";
  const beforeProcessing = processingThrough(mode, strengths, micCount, false);
  const afterProcessing = processingThrough(mode, strengths, micCount);
  const before = Array.from({ length: 512 }, (_, i) => speechComponents(i / 511, beforeProcessing, micCount));
  const after = Array.from({ length: 512 }, (_, i) => speechComponents(i / 511, afterProcessing, micCount));
  const key = mode === "aec" ? "echo" : mode === "dereverb" ? "reverb" : mode === "agc" ? "total" : "noise";
  const range = { noise: 0.25, echo: 0.6, reverb: 0.25, total: 2 }[key];
  const title = mode === "agc" ? (zh ? "AGC：整路信号的电平变化" : "AGC: whole-signal level change")
    : mode === "beamforming" ? (zh ? "多麦：合成前后的干扰对比" : "Array: interference before and after combining")
    : `${mode.toUpperCase()} · ${labels[key as keyof typeof labels][zh ? 0 : 1]}`;
  const path = (samples: typeof before) => samples.map((s, i) => `${i ? "L" : "M"} ${i / 511 * 800} ${90 - s[key] * 80 / range}`).join(" ");
  const rms = (samples: typeof before, component: keyof typeof labels) => Math.sqrt(samples.reduce((sum, s) => sum + s[component] ** 2, 0) / samples.length);
  const aecPath = (values: number[]) => values.map((v, i) => `${i ? "L" : "M"} ${48 + i / 511 * 728} ${110 - v * 40}`).join(" ");
  return <section className="enhancement-stage-focus" aria-label={zh ? "当前阶段分量对比" : "Current-stage component comparison"}>
    <h2>{title}</h2>
    {mode === "aec" ? <div className="aec-three-tracks">
      <p className="aec-reading-summary">{zh ? "AEC 不是把采集声音全部调小，而是减去由播放参考估计出来的回声。对比第 2、3 图的黄虚线：回声变小，近端语音等其他分量保留。" : "AEC does not turn down the entire capture. It subtracts echo estimated from playback. Compare the yellow traces in tracks 2 and 3: echo decreases while near-end voice and other components remain."}</p>
      {[
        { id: "ao", label: zh ? "AO · 播放参考" : "AO · playback reference", values: before.map((_, i) => playbackReference(i / 511)) },
        { id: "ai", label: zh ? "AI · 采集信号（含扬声器回声）" : "AI · capture including speaker echo", values: before.map(s => s.total) },
        { id: "output", label: zh ? "AEC · 输出信号" : "AEC · output signal", values: after.map(s => s.total) }
      ].map((track, index) => <div className="aec-track" key={track.id}>
        <h3>{index + 1}. {track.label}</h3>
        <div className="aec-track-legend">
          <span><i className={track.id === "ai" ? "aec-key-input" : "aec-key-output"} />{track.id === "ao" ? (zh ? "送往扬声器的信号" : "Signal sent to speaker") : (zh ? "完整混合信号" : "Full mixture")}</span>
          {track.id !== "ao" && <span><i className="aec-key-echo" />{track.id === "ai" ? (zh ? "其中的回声" : "Echo component") : (zh ? "剩余回声" : "Residual echo")}</span>}
        </div>
        <div className="aec-axis-caption">{zh ? "归一化幅度（非声压）" : "Normalized amplitude (not sound pressure)"}</div>
        <div className="aec-plot-row"><div className="aec-y-axis"><span>+2</span><span>0</span><span>−2</span></div>
        <svg role="img" aria-label={track.label} viewBox="48 30 728 160" preserveAspectRatio="none">
          {[-2, 0, 2].map(value => <g key={value}>
            <line x1="48" x2="776" y1={110 - value * 40} y2={110 - value * 40} stroke="#536c64" />
          </g>)}
          <line x1={48 + (track.id === "ao" ? 0 : 0.12) * 728} x2={48 + (track.id === "ao" ? 0 : 0.12) * 728} y1="24" y2="190" stroke="#f1bb72" strokeDasharray="3 5" />
          <path className={track.id === "ai" ? "focus-before-line" : "focus-after-line"} data-testid={`aec-track-${track.id}`}
            d={aecPath(track.values)} />
          {track.id !== "ao" && <path data-testid={`aec-echo-${track.id}`} d={aecPath((track.id === "ai" ? before : after).map(s => s.echo))} fill="none" stroke="#f1bb72" strokeWidth="2" strokeDasharray="7 4" />}
        </svg></div>
        <div className="aec-x-axis">{[0, 0.25, 0.5, 0.75, 1].map(t => <span key={t}>{t}</span>)}</div>
        <div className="aec-axis-caption">{zh ? "归一化时间（不是秒）" : "Normalized time (not seconds)"}</div>
        <p>{track.id === "ao"
          ? (zh ? "播放参考从 t = 0 开始；黄虚线标出起点。" : "Playback starts at t = 0; the yellow marker indicates its onset.")
          : (zh ? `黄虚线：${track.id === "ai" ? "输入中的回声分量" : "处理后的残余回声"}；回声从 t = 0.12 开始，与 AO 相比延迟 0.12。` : `Yellow dashed: ${track.id === "ai" ? "echo in the input" : "residual echo"}; onset at t = 0.12, delayed by 0.12 relative to AO.`)}</p>
      </div>)}
      <details className="speech-explanation"><summary>{zh ? "AEC 图解说明" : "About the AEC plots"}</summary>
      <p>{zh ? "三图共用归一化时间 0–1、幅度刻度 ±2（中心为 0）。AI 一行表示送入 AEC 的采集路，包含已启用的多麦预处理。" : "All three share normalized time 0–1 and amplitude ticks ±2, centered at 0. AI is the capture stream entering AEC, including enabled array preprocessing."}</p>
      <p>{zh ? "AI = 近端语音 + 扬声器回声 + 噪声 + 混响；AEC 输出 = AI − 估计回声。演示中，回声是 AO 参考延迟 0.12 个归一化时间单位后乘以 0.506。强度改变估计回声的抵消比例，不改变 AO 或 AI 输入；真实 AEC 还需自适应估计传播路径，不能直接用 AI − AO。" : "AI = near-end voice + speaker echo + noise + reverb; AEC output = AI − estimated echo. Here echo is AO delayed by 0.12 normalized time units and scaled by 0.506. Strength changes cancellation, not AO or AI. Real AEC must adaptively estimate the acoustic path; it is not simply AI − AO."}</p>
      </details>
    </div> : <>
    <div className="aec-track-legend"><span><i className="aec-key-input" />{zh ? "本级输入（灰虚线）" : "Stage input (gray dashed)"}</span><span><i className="aec-key-output" />{zh ? "本级输出（绿实线）" : "Stage output (green solid)"}</span></div>
    <div className="aec-plot-row"><div className="aec-y-axis"><span>+{range}</span><span>0</span><span>−{range}</span></div>
    <svg role="img" aria-label={title} viewBox="0 10 800 160" preserveAspectRatio="none">
      <line x1="0" x2="800" y1="90" y2="90" stroke="#536c64" />
      <path className="focus-before-line" data-testid="speech-focus-before" d={path(before)} />
      <path className="focus-after-line" data-testid="speech-focus-after" d={path(after)} />
    </svg></div>
    <div className="aec-x-axis">{[0, 0.25, 0.5, 0.75, 1].map(t => <span key={t}>{t}</span>)}</div>
    <p className="enhancement-focus-axis">{zh ? `横轴：归一化时间 0–1（不是秒）；纵轴：${mode === "agc" ? "混合信号" : "已知干扰分量"}幅度 ±${range}，不是 dBFS 或声压。前后共用固定刻度，不随强度自动放大。` : `X: normalized time 0–1 (not seconds); Y: ${mode === "agc" ? "mixture" : "known interference"} amplitude ±${range}, not dBFS or sound pressure. Input and output share a fixed scale, without strength-dependent zoom.`}</p>
    {mode === "agc" && <p>{zh ? "本段瞬时增益范围" : "Instantaneous gain range"}: {Math.min(...after.map(s => s.gain)).toFixed(2)}–{Math.max(...after.map(s => s.gain)).toFixed(2)}×{zh ? "；依据已知语音包络调节，不是测量混合信号 RMS 的真实 AGC。" : "; driven by the known voice envelope, not a real AGC measuring mixture RMS."}</p>}
    </>}
    <details className="speech-explanation"><summary>{zh ? "分量 RMS 与模型说明" : "Component RMS and model notes"}</summary>
    <div className="enhancement-component-table" role="table" aria-label={zh ? "已知分量 RMS 对比" : "Known-component RMS comparison"}>
      <div role="row"><strong role="columnheader">{zh ? "分量" : "Component"}</strong><strong role="columnheader">{zh ? "输入 RMS" : "Input RMS"}</strong><strong role="columnheader">{zh ? "输出 RMS" : "Output RMS"}</strong><strong role="columnheader">Δ dB</strong></div>
      {(Object.keys(labels) as (keyof typeof labels)[]).map(component => {
        const input = rms(before, component), output = rms(after, component);
        return <div role="row" key={component} data-testid={`speech-component-${component}`}>
          <span role="cell">{labels[component][zh ? 0 : 1]}</span>
          <span role="cell"><meter min="0" max="1" value={input} aria-label={`${labels[component][zh ? 0 : 1]} ${zh ? "输入" : "input"}`} />{input.toFixed(4)}</span>
          <span role="cell"><meter min="0" max="1" value={output} aria-label={`${labels[component][zh ? 0 : 1]} ${zh ? "输出" : "output"}`} />{output.toFixed(4)}</span>
          <span role="cell">{(20 * Math.log10(Math.max(output, 1e-12) / Math.max(input, 1e-12))).toFixed(1)}</span>
        </div>;
      })}
    </div>
    <p>{zh ? "RMS 为归一化分量的均方根；Δ dB = 20 log10(输出 RMS / 输入 RMS)，负值为衰减。它不是总响度、SNR 或设备实测指标。AGC 的增益随时间变化，因此各分量整段 RMS 的变化量可能不同。" : "RMS is the root mean square of each normalized component; Δ dB = 20 log10(output RMS / input RMS), negative for attenuation. This is not loudness, SNR or a device measurement. Time-varying AGC gain can produce different whole-segment RMS changes for different components."}</p>
    <p>{mode === "beamforming"
      ? (zh ? `当前 ${micCount} 麦：目标语音保持单位增益，观察空间干扰分量的降低。这里仅用预设残留比例解释阵列作用，没有模拟麦克风间距、方向或 DOA；不能据此推断真实 2 麦/4 麦产品的提升。` : `${micCount} microphones: unity target gain, with reduced spatial interference. Preset residual ratios illustrate array behavior; geometry, steering and DOA are not simulated. This is not a measured 2-/4-mic improvement.`)
      : mode === "aec"
        ? (zh ? "三路是合成信号，不是真实语音录音或自适应滤波器运行结果。RMS 表只对比 AI 输入与 AEC 输出中的已知分量；AEC 不负责消除独立噪声和近端混响。" : "These are synthetic signals, not speech recordings or an adaptive filter run. RMS compares known components in AI input and AEC output; AEC does not remove independent noise or near-end reverberation.")
      : mode === "agc"
        ? (zh ? "AGC 对整路信号施加同一时变增益，弱语音和残余噪声都可能被放大；这不是降噪。此处未模拟 attack/release。" : "AGC applies one time-varying gain to the entire mixture. Quiet voice and residual noise may both increase; this is not denoising. Attack/release is not modeled.")
        : (zh ? "这里单独画出本级负责的已知干扰分量，避免总波形把效果掩盖。灰线已包含前级处理，绿线只增加当前一级；真实录音不能直接拆出这些干净分量。" : "The plot isolates the known interference targeted by this stage. Gray includes upstream processing; green adds only this stage. Real recordings do not expose these clean components directly.")}</p>
    </details>
  </section>;
}
