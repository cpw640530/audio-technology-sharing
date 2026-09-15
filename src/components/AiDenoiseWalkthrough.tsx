/// <reference types="vite/client" />
import { useEffect, useRef, useState } from "react";
import type { Language } from "../content/knowledge";
type Demo = { waves: number[][]; input: number[][]; output: number[][]; mask: number[][]; magnitude: number[][]; activations: number[][][]; kernels: number[][][]; bias: number[]; head: number[]; headBias: number; snr: number[] };

function Map({ values, label, max = 1, selection, selectionSize = 3 }: { values: number[][]; label: string; max?: number; selection?: number[]; selectionSize?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    if (/jsdom/i.test(navigator.userAgent)) return;
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    values.forEach((row,f)=>row.forEach((v,t)=>{
      const a = Math.max(0,Math.min(1,v/max));
      ctx.fillStyle = `rgb(${15+230*a},${35+155*a},${65-30*a})`;
      ctx.fillRect(t*4,(63-f)*4,4,4);
    }));
  },[values,max]);
  const radius = (selectionSize - 1) / 2;
  return <div style={{position:"relative"}}><canvas ref={ref} width="256" height="256" role="img" aria-label={label} />{selection && <span className="denoise-selection" aria-hidden="true" style={{position:"absolute", outline:"2px solid white",boxShadow:"0 0 0 3px #16372e",pointerEvents:"none",left:`${(selection[0]-radius)/64*100}%`,top:`${(63-selection[1]-radius)/64*100}%`,width:`${selectionSize/64*100}%`,height:`${selectionSize/64*100}%`}} />}</div>;
}

export function AiDenoiseWalkthrough({ language }: { language: Language }) {
  const t = (zh: string,en: string) => language === "zh" ? zh : en;
  const [data,setData] = useState<Demo | null>(null);
  const [failed,setFailed] = useState(false);
  const [step,setStep] = useState(0);
  const [channel,setChannel] = useState(0);
  const [frame,setFrame] = useState(20);
  const [bin,setBin] = useState(8);
  const root = `${import.meta.env.BASE_URL}ai-denoise/`;
  useEffect(()=>{
    const controller = new AbortController();
    fetch(`${root}demo.json`,{signal:controller.signal}).then(r=>{if(!r.ok) throw Error(); return r.json();}).then(setData).catch(e=>{if(e.name!=="AbortError") setFailed(true);});
    return ()=>controller.abort();
  },[root]);
  const names = [t("输入与 STFT","Input and STFT"),t("卷积乘加","Convolution"),t("激活特征","Activations"),t("预测掩码","Predict mask"),t("重建与试听","Reconstruction")];
  const descriptions = [
    t("8 kHz PCM → 256 点 Hann 窗 → STFT，hop=128。幅度 dB 裁剪至 [-80,0]，再缩放到 [0,1] 作为模型输入；另行保留复数频谱用于重建。", "8 kHz PCM → 256-point Hann window → STFT, hop=128. Magnitude dB is clipped to [-80,0] and scaled to [0,1] for the model; complex spectra are retained for reconstruction."),
    t("3×3 核沿时间和频率移动，逐项相乘、求和、加偏置。深度学习中通常将这种互相关运算称为卷积，权重来自训练。", "A 3×3 kernel slides over time and frequency: multiply, sum, add bias. Deep learning usually calls this cross-correlation convolution; weights are learned."),
    t("ReLU(z)=max(0,z)。四个通道有各自的学习权重，亮区表示响应较强，不代表声音能量或语音概率。", "ReLU(z)=max(0,z). Four channels use different learned weights. Bright areas indicate stronger activations, not sound energy or speech probability."),
    t("1×1 卷积合并四个激活通道，Sigmoid 产生 0–1 掩码。M=0.2 表示幅度乘 0.2，不是语音概率 20%。Ŝ=M×Y。", "A 1×1 convolution mixes four activation channels; sigmoid produces a 0–1 mask. M=0.2 multiplies amplitude by 0.2, not a 20% speech probability. Ŝ=M×Y."),
    t("掩码乘原始复数频谱，保留输入相位，经 iSTFT 与重叠相加恢复 PCM。未加入额外后滤波。三段音频统一缩放，避免分别归一化误导对比。", "Apply the mask to the original complex spectrum, retain input phase, and reconstruct PCM via iSTFT and overlap-add. No extra postfilter. All clips share one scale for a fair comparison.")
  ];
  const products = data ? data.kernels[channel].flat().map((w,i)=>({w,x:data.input[bin+Math.floor(i/3)-1][frame+i%3-1]})) : [];
  const sum = data ? products.reduce((s,p)=>s+p.x*p.w,data.bias[channel]) : 0;
  const headProducts = data ? data.head.map((w,i)=>({w,x:data.activations[i][bin][frame]})) : [];
  const logit = data ? headProducts.reduce((s,p)=>s+p.x*p.w,data.headBias) : 0;
  const predictedMask = 1 / (1 + Math.exp(-Math.max(-30,Math.min(30,logit))));
  const selected = step===3 ? [frame,bin] : undefined;
  const explanations = [
    [t("输入：带噪 PCM", "Input: noisy PCM"), t("PCM 是按时间排列的振幅数值。这里是合成谐波加白噪声，不是真人说话。", "PCM stores amplitude samples over time. Here it contains synthetic harmonics plus white noise, not recorded speech."),
      t("运算：分帧、加窗、FFT", "Operation: frame, window, FFT"), t("每 32 ms 取一帧，每 16 ms 前进一步。Hann 窗减轻截断引起的频谱泄漏；逐帧 FFT 组成 STFT，展示不同频率随时间的变化。", "Take a 32 ms frame every 16 ms. A Hann window reduces spectral leakage from truncation; frame-by-frame FFTs form the STFT, showing frequency content over time."),
      t("输出：频谱与模型特征", "Output: spectrum and model features"), t("复数频谱含幅度和相位。本模型只把缩放后的对数幅度送入网络，不使用 MFCC；相位留到重建时使用。", "The complex spectrum contains magnitude and phase. This model receives scaled log magnitudes, not MFCCs; phase is retained for reconstruction.")],
    [t("输入：3×3 局部频谱", "Input: a local 3×3 patch"), t("取相邻 3 个频率 bin 和 3 个时间帧。模型同时观察某个频率及其附近的时频结构。", "Take three neighboring frequency bins across three frames, so the model sees local time-frequency structure."),
      t("运算：共享权重乘加", "Operation: weighted sum"), t("九个输入分别乘九个权重，再求和加偏置。同一组权重扫描整个频谱；训练调整权重，而不是人为指定哪里是语音。", "Multiply nine inputs by nine weights, sum, and add a bias. The same weights scan the spectrum; training adjusts them rather than manually labeling speech regions."),
      t("输出：四路响应", "Output: four response channels"), t("四组卷积核各产生一张响应图。它们是内部特征，不是四个麦克风，也不是四条可播放音轨。", "Four kernels produce four response maps. These are internal features, not four microphones or playable audio tracks.")],
    [t("输入：卷积响应 z", "Input: convolution response z"), t("卷积乘加结果可以为正或负，尚未决定最终保留多少声音。", "Weighted sums can be positive or negative; they do not yet decide how much sound to retain."),
      t("运算：ReLU 非线性", "Operation: ReLU nonlinearity"), t("ReLU 将负值置零、正值保留。加入非线性后，网络可以学习比单次线性加权更复杂的映射。", "ReLU sets negative values to zero and keeps positive values, allowing more complex mappings than a single linear weighted sum."),
      t("输出：激活特征图", "Output: activation maps"), t("亮区表示卷积核对该局部模式响应较强。四通道使用同一色标，但不能把亮度解释为声音更响或语音更确定。", "Brightness means a stronger response to a local pattern. Channels share a color scale, but brightness does not mean louder sound or greater speech certainty.")],
    [t("输入：四路激活", "Input: four activations"), t("取同一个时间帧、同一个频率 bin 上的四个特征值。", "Take the four feature values at the same frame and frequency bin."),
      t("运算：1×1 卷积与 Sigmoid", "Operation: 1×1 convolution and sigmoid"), t("将四路特征加权求和加偏置，再映射到 0–1。训练目标是该位置干净信号与带噪信号的幅度比，并裁剪到 0–1。", "Mix the four features with weights and a bias, then map to 0–1. The training target is the clean-to-noisy magnitude ratio clipped to 0–1."),
      t("输出：逐点幅度掩码 M", "Output: magnitude mask M"), t("M 接近 0 表示强衰减，接近 1 表示保留。M=0.2 对应约 −14 dB 幅度增益；同一格内的目标与噪声都会被缩放，不能保证完全分离。", "M near 0 strongly attenuates; near 1 retains. M=0.2 means about −14 dB gain. Both target and noise in that bin are scaled, so perfect separation is not guaranteed.")],
    [t("输入：掩码与原始复数频谱", "Input: mask and original complex spectrum"), t("逐点相乘 Ŝ=M×Y，修改幅度并沿用输入相位。输出频谱使用与输入相同的色标，便于比较衰减区域。", "Multiply pointwise: Ŝ=M×Y, changing magnitude while retaining input phase. Input and output spectra share a color scale for comparing attenuation."),
      t("运算：iSTFT 重建", "Operation: iSTFT reconstruction"), t("每帧做逆 FFT，再按窗口重叠相加并归一化，恢复连续 PCM。本例没有额外 AGC 或后滤波。", "Apply an inverse FFT to each frame, then overlap-add with window normalization to reconstruct PCM. This example adds no AGC or postfilter."),
      t("输出：可播放 PCM", "Output: playable PCM"), t("对比残留噪声与谐波是否受损。SNR 使用已知干净参考计算，只代表本段合成信号，不能推断真实语音质量。", "Compare residual noise and harmonic damage. SNR uses the known clean reference and describes only this synthetic clip, not real-speech quality.")]
  ];
  return <section className="ai-denoise-walkthrough" aria-label={t("模型逐步可视化","Model walkthrough")}>
    <h2>{t("从频谱到降噪：看见模型计算","From spectrum to denoising: inspect the computation")}</h2>
    <p>{t("教学 CNN：用 24 段合成谐波与白噪声训练，展示独立测试片段的真实中间结果；不是经过真实语音验证的降噪产品。结构为 3×3 卷积（4 通道）→ ReLU → 1×1 卷积 → Sigmoid。", "Teaching CNN: trained on 24 synthetic harmonic signals with white noise. These are real intermediate results on a held-out clip, not a validated speech denoiser. Architecture: 3×3 convolution (4 channels) → ReLU → 1×1 convolution → sigmoid.")}</p>
    <div className="robot-buttons">{names.map((s,i)=><button key={s} onClick={()=>setStep(i)} aria-pressed={step===i}>{i+1}. {s}</button>)}</div>
    {failed ? <p role="alert">{t("数据加载失败，请刷新重试。","Data failed to load. Reload to retry.")}</p> : !data ? <p role="status">{t("加载计算结果…","Loading results…")}</p> : <>
      <h3>{names[step]}</h3><p>{descriptions[step]}</p>
      <dl className="denoise-explanation">{[0,2,4].map(i=><div key={i}><dt>{explanations[step][i]}</dt><dd>{explanations[step][i+1]}</dd></div>)}</dl>
      {(step===0 || step===4) && data.waves && <figure style={{margin:0}}><svg viewBox="0 0 600 220" role="img" aria-label={t("PCM 波形对照","PCM waveform comparison")} style={{width:"100%",maxHeight:220,background:"#f0f5f3"}}>{data.waves.map((wave,i)=><g key={i}><text x="12" y={20+i*100} fill="#285c50">{i===0 ? t("带噪 PCM","Noisy PCM") : t("输出 PCM","Output PCM")}</text><path d={`M0 ${60+i*100} H600`} stroke="#99b8b0" /><path d={wave.map((v,j)=>`${j===0 ? "M" : "L"}${j/255*600} ${60+i*100-v*40}`).join(" ")} fill="none" stroke={i===0 ? "#a26a2e" : "#158571"} /></g>)}</svg><figcaption>{t("同一片段 0.500–0.532 s；横轴为时间，纵轴为归一化 PCM 幅度，两图零线及幅度比例相同（每单位 40 图像坐标）。", "Same excerpt, 0.500–0.532 s; horizontal time, vertical normalized PCM amplitude. Both use identical zero-line conventions and amplitude scale (40 drawing units per amplitude unit).")}</figcaption></figure>}
      {(step>=1 && step<=3) && <div className="robot-controls">{step<3 && <label>{t("输出通道","Output channel")}<select value={channel} onChange={e=>setChannel(+e.target.value)}>{[0,1,2,3].map(i=><option key={i} value={i}>{i+1}</option>)}</select></label>}<label>{t("时间帧","Time frame")} {frame}<input type="range" min="1" max="62" value={frame} onChange={e=>setFrame(+e.target.value)} /></label><label>{t("频率 bin","Frequency bin")} {bin} ({bin*31.25} Hz)<input type="range" min="1" max="62" value={bin} onChange={e=>setBin(+e.target.value)} /></label></div>}
      {step===3 && <p data-testid="denoise-mask-value">{t("所选位置", "Selected position")}: M = {data.mask[bin][frame].toFixed(4)}; {t("幅度增益", "Magnitude gain")} = {(20*Math.log10(data.mask[bin][frame])).toFixed(2)} dB. {t("滑动仅检查固定推理结果，不会重新训练或改变音频。", "Sliders inspect fixed inference results; they do not retrain the model or change the audio.")}</p>}
      {step===3 && <section className="denoise-head" aria-label={t("掩码计算图解", "Mask calculation walkthrough")}>
        <h4>{t("四路特征如何变成一个掩码", "How four features become one mask")}</h4>
        <div className="denoise-head-products">{headProducts.map((p,i)=><div key={i}><strong>{t("特征通道", "Feature channel")} {i+1}</strong><code>{p.x.toFixed(5)} × ({p.w.toFixed(5)})<br />= {(p.x*p.w).toFixed(5)}</code></div>)}</div>
        <ol className="denoise-head-flow">
          <li><strong>{t("求和 + 偏置", "Sum + bias")}</strong><code>z = Σ(h × w) + ({data.headBias.toFixed(5)}) = {logit.toFixed(5)}</code></li>
          <li><strong>Sigmoid</strong><code data-testid="denoise-head-result">M = 1 / (1 + exp(−z)) ≈ {predictedMask.toFixed(5)}</code></li>
          <li><strong>{t("缩放线性频谱幅度", "Scale linear spectral magnitude")}</strong><code data-testid="denoise-amplitude-product">|Ŝ| = |Y| × M ≈ {data.magnitude[bin][frame].toExponential(4)} × {data.mask[bin][frame].toFixed(5)} = {(data.magnitude[bin][frame]*data.mask[bin][frame]).toExponential(4)}</code></li>
        </ol>
        <p>{t("h 是激活值，w 和偏置是训练得到的参数。显示数值经过舍入，因此复算与保存的掩码可能有微小差异。幅度取自原始 STFT 系数，既不是 0–1 着色特征，也不是 PCM 单点振幅。", "h denotes an activation; weights w and the bias are learned. Rounded values can cause small differences from the saved mask. Magnitudes come from the original STFT coefficients, not the 0–1 color features or individual PCM samples.")}</p>
        <p>{t("三张图的白框对应同一时间帧和频率 bin；掩码图亮度表示保留比例，输入与输出图亮度表示对数幅度。", "White outlines mark the same frame and frequency bin in all three maps. Mask brightness shows the retained fraction; input and output brightness shows log magnitude.")}</p>
      </section>}
      <div className="denoise-maps">
        <figure><Map values={data.input} selection={step===1 ? [frame,bin] : selected} selectionSize={step===1 ? 3 : 1} label={t("输入频谱","Input spectrum")} /><figcaption>{t("输入幅度：暗 -80 dB → 亮 0 dB","Input magnitude: dark -80 dB → bright 0 dB")}</figcaption></figure>
        <figure><Map values={step<3 ? data.activations[channel] : data.mask} selection={selected} selectionSize={1} max={step<3 ? Math.max(1e-8,...data.activations.flat(2)) : 1} label={step<3 ? "ReLU" : "Mask"} /><figcaption>{step<3 ? t("ReLU 激活；四通道共用色标，非能量","ReLU activation; shared scale across channels, not energy") : t("掩码：暗 0（抑制）→ 亮 1（保留）","Mask: dark 0 (suppress) → bright 1 (retain)")}</figcaption></figure>
        <figure><Map values={data.output} selection={selected} selectionSize={1} label={t("输出频谱","Output spectrum")} /><figcaption>{t("输出幅度：与输入相同色标","Output magnitude: same scale as input")}</figcaption></figure>
      </div>
      <p>{t("横轴：时间帧 0–63（0–1.008 s）；纵轴：下方 0 Hz，上方 1968.75 Hz（bin 0–63）。局部展示，模型实际处理完整 0–4 kHz 频谱和 2 秒音频。", "Horizontal: frames 0–63 (0–1.008 s). Vertical: 0 Hz at bottom, 1968.75 Hz at top (bins 0–63). Cropped display; inference covers the full 0–4 kHz spectrum and 2-second clip.")}</p>
      {step===1 && <><div className="denoise-products">{products.map((p,i)=><code key={i}>{p.x.toFixed(3)} × {p.w.toFixed(3)}<br />= {(p.x*p.w).toFixed(3)}</code>)}</div><p data-testid="denoise-sum"><code>Σ(x×w) + b ({data.bias[channel].toFixed(4)}) = {sum.toFixed(4)} → ReLU = {Math.max(0,sum).toFixed(4)}</code></p></>}
      {step===4 && <><div className="denoise-audio">{["input","output","target"].map((name,i)=><div key={name}><h4>{[t("带噪输入","Noisy input"),t("模型输出","Model output"),t("干净参考","Clean reference")][i]}</h4><audio controls preload="none" src={`${root}${name}.wav`} onPlay={e=>{e.currentTarget.closest("section")?.querySelectorAll("audio").forEach(a=>{if(a!==e.currentTarget) a.pause();});}} /></div>)}</div><p>SNR: {data.snr[0].toFixed(2)} dB → {data.snr[1].toFixed(2)} dB {t("（仅此合成测试片段）","(this synthetic clip only)")}</p></>}
      <details><summary>{t("训练方式与可复现源码","Training and reproducible source")}</summary><p>{t("目标为 clip(|S|/(|Y|+ε),0,1)，以掩码 MSE 训练，NumPy 反向传播与 Adam 更新权重。固定随机种子，测试片段未参与训练。真实语音、混响与其他噪声尚未验证。", "Target: clip(|S|/(|Y|+ε),0,1), trained with mask MSE, NumPy backpropagation, and Adam. Fixed seed; test clip excluded from training. Real speech, reverberation, and other noise types are untested.")}</p><code>scripts/generate-ai-denoise-demo.py</code></details>
    </>}
  </section>;
}
