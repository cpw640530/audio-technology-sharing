import { useEffect, useMemo, useRef, useState } from "react";
import type { Language } from "../content/knowledge";
import { psdDb, stftAnalysis, type StftExample } from "./stftModel";

const examples: Record<StftExample, [string, string]> = {
  tone: ["纯音", "Pure tone"], chirp: ["扫频", "Chirp"],
  pulse: ["短脉冲", "Impulse"], mixed: ["混合信号", "Mixture"]
};
const descriptions: Record<StftExample, [string, string]> = {
  tone: ["1 kHz 纯音：频率不变，因此是一条水平亮带。", "1 kHz tone: constant frequency forms a horizontal band."],
  chirp: ["1→6.12 kHz 扫频：频率逐渐上升，因此是一条斜向亮带。", "1→6.12 kHz chirp: rising frequency forms an upward band."],
  pulse: ["160 ms 处的单样本脉冲：持续极短、频带很宽，因此形成竖向亮带。", "A single-sample impulse at 160 ms: brief and broadband, forming a vertical band."],
  mixed: ["1 kHz 纯音、2.5→3.524 kHz 扫频，以及 160 ms 附近的 6 kHz 短音同时存在。", "A 1 kHz tone, a 2.5→3.524 kHz chirp and a brief 6 kHz tone near 160 ms coexist."]
};

// Dark blue -> violet -> orange -> white; interpolate colors, never spectrum values.
function color(db: number) {
  const stops = [[5, 9, 20], [35, 42, 110], [147, 49, 146], [245, 139, 65], [255, 250, 225]];
  const position = Math.max(0, Math.min(4, (db + 100) / 20));
  const i = Math.min(3, Math.floor(position)), t = position - i;
  return `rgb(${stops[i].map((v, c) => Math.round(v + (stops[i + 1][c] - v) * t)).join(",")})`;
}

function line(values: number[], height: number, scale: number, offset: number) {
  return values.map((v, i) => `${i ? "L" : "M"} ${i / (values.length - 1) * 800} ${height - (v + offset) * scale}`).join(" ");
}

export function StftWorkbench({ language, windowSize, hopSize }: { language: Language; windowSize: number; hopSize: number }) {
  const zh = language === "zh";
  const [example, setExample] = useState<StftExample>("tone");
  const [time, setTime] = useState(16);
  const analysis = useMemo(() => stftAnalysis(windowSize, hopSize, example), [windowSize, hopSize, example]);
  const frameIndex = analysis.frames.reduce((best, f, i) => Math.abs(f.centerMs - time) < Math.abs(analysis.frames[best].centerMs - time) ? i : best, 0);
  const frame = analysis.frames[frameIndex];
  const canvas = useRef<HTMLCanvasElement>(null);
  const cursor = frame.centerMs / 256 * 100;
  const waveform = useMemo(() => {
    // Preserve peaks with min/max buckets instead of downsampling away the impulse.
    return Array.from({ length: 800 }, (_, i) => {
      const samples = analysis.pcm.slice(Math.floor(i * 4096 / 800), Math.floor((i + 1) * 4096 / 800));
      return `M ${i} ${60 - Math.min(...samples) * 54} V ${60 - Math.max(...samples) * 54}`;
    }).join(" ");
  }, [analysis.pcm]);
  useEffect(() => {
    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#111b20";
    ctx.fillRect(0, 0, 1024, 512);
    const span = Math.min(hopSize, windowSize);
    for (const f of analysis.frames) {
      const x = (f.centerMs * 16 - span / 2) / 4;
      const bins = f.psd.length - 1;
      for (let k = 0; k <= bins; k++) {
        const lower = Math.max(0, (k - 0.5) / bins), upper = Math.min(1, (k + 0.5) / bins);
        ctx.fillStyle = color(psdDb(f.psd[k]));
        ctx.fillRect(x, (1 - upper) * 512, span / 4, (upper - lower) * 512);
      }
    }
  }, [analysis, hopSize, windowSize]);
  const selectPosition = (clientX: number, element: HTMLElement) => {
    const bounds = element.getBoundingClientRect();
    setTime(Math.max(0, Math.min(256, (clientX - bounds.left) / bounds.width * 256)));
  };
  return <section className="stft-tracks" aria-label={zh ? "STFT 音轨观察台" : "STFT track workbench"}>
    <div className="waveform-tabs" role="group" aria-label={zh ? "示例信号" : "Example signal"}>
      {(Object.keys(examples) as StftExample[]).map(key => <button key={key} type="button" aria-pressed={key === example} className={key === example ? "active" : ""} onClick={() => setExample(key)}>{examples[key][zh ? 0 : 1]}</button>)}
    </div>
    <p className="stft-example-note">{descriptions[example][zh ? 0 : 1]}</p>
    <header><h2>{zh ? "波形" : "Waveform"}</h2><span>PCM · 16 kHz · 256 ms</span></header>
    <div className="stft-track-row">
      <div className="stft-axis"><span>+1</span><span>0</span><span>−1</span></div>
      <div className="stft-track-plot">
        <svg role="img" aria-label={zh ? "完整 PCM 波形" : "Full PCM waveform"} viewBox="0 0 800 120" preserveAspectRatio="none">
          <line x1="0" x2="800" y1="60" y2="60" className="stft-grid-line" />
          <path data-testid="stft-full-wave" d={waveform} className="stft-pcm-line" />
        </svg>
        <div className="stft-frame-span" data-testid="stft-frame-span" style={{ left: `${frame.start / 4096 * 100}%`, width: `${windowSize / 4096 * 100}%` }} />
        <div className="stft-time-cursor" style={{ left: `${cursor}%` }} />
      </div><span className="stft-axis-unit">{zh ? "幅度" : "Amp."}</span>
    </div>
    <header><h2>{zh ? "STFT 时频图" : "STFT spectrogram"}</h2><span>{zh ? "频率随时间的分布" : "Frequency over time"}</span></header>
    <div className="stft-track-row">
      <div className="stft-axis"><span>8k</span><span>6k</span><span>4k</span><span>2k</span><span>0 Hz</span></div>
      <div className="stft-track-plot stft-heatmap" onPointerDown={event => selectPosition(event.clientX, event.currentTarget)}>
        <canvas ref={canvas} width="1024" height="512" role="img" aria-label={zh ? "STFT 时频图：横轴时间，纵轴频率，颜色表示功率谱密度" : "STFT spectrogram: time, frequency and power spectral density"} />
        <div className="stft-time-cursor" data-testid="stft-time-cursor" style={{ left: `${cursor}%` }} />
      </div>
      <div className="stft-color-key"><div /> <span>−20</span><span>−60</span><span>−100</span></div>
    </div>
    <div className="stft-track-row stft-time-axis"><span>ms</span><div>{[0, 64, 128, 192, 256].map(t => <span key={t}>{t}</span>)}</div><span>dB/Hz</span></div>
    <label className="stft-frame-control">{zh ? "观察帧" : "Selected frame"} · {frameIndex + 1}/{analysis.frames.length} · {frame.centerMs.toFixed(1)} ms
      <input type="range" min="0" max={analysis.frames.length - 1} step="1" value={frameIndex} aria-label={zh ? "观察帧" : "Selected frame"} onChange={e => setTime(analysis.frames[Number(e.target.value)].centerMs)} />
    </label>
    <p data-testid="stft-frame-readout">{zh ? "当前窗口" : "Current window"}: {(frame.start / 16).toFixed(1)}–{((frame.start + windowSize) / 16).toFixed(1)} ms · Hann · {windowSize} {zh ? "样本" : "samples"}</p>
    {hopSize >= windowSize && <p role="status">{zh ? "当前帧不重叠：落在 Hann 窗边缘或帧间空隙的短事件可能漏检。可减小 hop 观察差别。" : "Frames do not overlap: brief events at Hann window edges or in gaps can be missed. Reduce hop to compare."}</p>}
    <div className="stft-frame-details">
      <section><h3>{zh ? "当前帧 · 加窗波形" : "Selected frame · windowed PCM"}</h3>
        <svg role="img" aria-label={zh ? "当前帧加窗波形" : "Selected windowed frame"} viewBox="0 0 800 160" preserveAspectRatio="none"><line x1="0" x2="800" y1="80" y2="80" className="stft-grid-line" /><path className="stft-pcm-line" data-testid="stft-windowed-wave" d={line(frame.windowed, 80, 72, 0)} /></svg>
        <p>{zh ? "横轴：窗口内时间；纵轴：幅度 −1…+1" : "X: time within window; Y: amplitude −1…+1"} · 0–{windowSize / 16} ms</p>
      </section>
      <section><h3>{zh ? "当前帧 · 频谱" : "Selected frame · spectrum"}</h3>
        <svg role="img" aria-label={zh ? "当前帧功率谱密度" : "Selected-frame PSD"} viewBox="0 0 800 160" preserveAspectRatio="none">{[0, 80, 160].map(y => <line key={y} x1="0" x2="800" y1={y} y2={y} className="stft-grid-line" />)}<path className="stft-spectrum-line" data-testid="stft-spectrum-path" d={line(frame.psd.map(psdDb), 160, 2, 100)} /></svg>
        <p>{zh ? "横轴：0–8 kHz；纵轴：−100…−20 dB/Hz" : "X: 0–8 kHz; Y: −100…−20 dB/Hz"}</p>
      </section>
    </div>
    <details className="stft-reading-notes"><summary>{zh ? "读图与计算说明" : "Reading and calculation notes"}</summary>
      <p>{zh ? "每列来自一帧 PCM：分帧 → Hann 加窗 → DFT → 功率谱密度。上下音轨共用时间轴；游标是帧中心，上方阴影是完整分析窗口。空白边缘或帧间空隙是未显示分析值，不代表静音。" : "Each column comes from one PCM frame: framing → Hann window → DFT → PSD. Tracks share a timeline; the cursor is the frame center and the shaded region is the full analysis window. Blank edges or gaps mean no displayed analysis, not silence."}</p>
      <p>{zh ? "颜色由暗蓝到紫、橙、亮白，对应功率谱密度由低到高，参考 1 FS²/Hz。色标固定为 −100…−20 dB/Hz，超范围饱和显示；这不是总响度。纯音的峰值密度可随窗口变化，但频带积分功率不因此增大。" : "Dark blue, violet, orange and white indicate increasing PSD relative to 1 FS²/Hz. The fixed −100…−20 dB/Hz scale clips values outside its range; this is not total loudness. A tone peak may change with window length without increasing integrated power."}</p>
      <p>{zh ? "长窗更能分开相邻频率，但短事件会在时间上展开。hop 改变帧间距，不改变同一帧的频谱。这里使用逐频率格数据，不做频带平均或平滑补细节。" : "Long windows better separate nearby frequencies but spread short events in time. Hop changes frame spacing, not an identical frame's spectrum. These are individual frequency bins, without band averaging or smoothing to invent detail."}</p>
      <p>{zh ? "FFT 是计算 DFT 的快速算法。本演示使用有限长度直接 DFT；768 点窗补零至 1024 点，补零不会增加实际分辨能力。单边 PSD 按采样率和窗平方和归一化，频率格间距为 fs/NDFT。" : "FFT is a fast algorithm for the DFT. This demo directly computes the bounded DFT; 768-sample windows are padded to 1024 without improving true resolution. One-sided PSD is normalized by sample rate and window squared sum; bin spacing is fs/NDFT."}</p>
      <a href="https://manual.audacityteam.org/man/spectrogram_view.html" target="_blank" rel="noreferrer">Audacity · Spectrogram View</a>
    </details>
  </section>;
}
