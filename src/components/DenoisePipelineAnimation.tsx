import { useEffect, useRef, useState } from "react";
import { createScope, createTimeline, stagger } from "animejs";
import { AudioLines, ChevronLeft, ChevronRight, Cpu, Grid2X2, Pause, Play, RotateCcw, SlidersHorizontal, Waves } from "lucide-react";
import type { Language } from "../content/knowledge";
import { text } from "../content/language";
import type { DenoiseDemo } from "./AiDenoiseWalkthrough";
import { DenoiseSpectrumMap } from "./DenoiseSpectrumMap";

const phaseDuration = 2400;
const duration = phaseDuration * 5;
const cellOrder = [6,7,8,3,4,5,0,1,2];

function Wave({ samples, label }: { samples: number[]; label: string }) {
  const d = samples.map((v,i)=>`${i ? "L" : "M"}${40+i/256*320},${65-v*45}`).join(" ");
  return <figure><figcaption>{label}</figcaption><svg viewBox="0 0 400 150" role="img" aria-label={label}>
    {[-1,0,1].map(v=><g key={v}><path d={`M40 ${65-v*45}H360`} className="denoise-frame-grid"/><text x="12" y={69-v*45}>{v}</text></g>)}
    {[0,16,32].map(ms=><text key={ms} x={40+ms*10} y="140" textAnchor="middle">{ms} ms</text>)}
    <path className="denoise-frame-signal phase-reveal" d={d}/>
  </svg></figure>;
}

export function DenoisePipelineAnimation({ data, frame, bin, channel, language, onFrameChange, onBinChange, onChannelChange }: {
  data: DenoiseDemo; frame: number; bin: number; channel: number; language: Language;
  onFrameChange: (value:number)=>void; onBinChange: (value:number)=>void; onChannelChange: (value:number)=>void;
}) {
  const t = (zh: string, en: string, ja: string, ko: string) => text(language,zh,en,ja,ko);
  const root = useRef<HTMLElement>(null);
  const timeline = useRef<ReturnType<typeof createTimeline> | null>(null);
  const range = useRef<HTMLInputElement>(null);
  const clock = useRef<HTMLOutputElement>(null);
  const [phase,setPhase] = useState(0);
  const phaseRef = useRef(0);
  phaseRef.current=phase;
  const [playing,setPlaying] = useState(false);
  const [term,setTerm] = useState(8);

  useEffect(()=>{
    const scope = createScope({root, mediaQueries:{reduceMotion:"(prefers-reduced-motion: reduce)"}}).add(self=>{
      setPlaying(false);
      const reduced = self?.matches.reduceMotion;
      const tl = createTimeline({
        autoplay:false,
        frameRate:30,
        onUpdate: instance=>{
          const time=Math.max(0,Math.min(duration,instance.currentTime));
          setPhase(Math.min(4,Math.floor(time/phaseDuration)));
          setTerm(Math.max(-1,Math.min(8,Math.floor((time-phaseDuration-200)/180))));
          if(range.current) range.current.value=String(time);
          if(clock.current) clock.current.value=`${(time/1000).toFixed(1)} / 12 s`;
        },
        onComplete:()=>setPlaying(false),
      });
      timeline.current=tl;
      tl.add(".denoise-route-progress",{strokeDashoffset:[100,0],duration,ease:"linear"},0);
      if(!reduced){
        tl.add(".denoise-pipeline-patch code",{opacity:[.45,1],delay:stagger(180),duration:160,ease:"linear"},phaseDuration+200);
      }
      const initialPhase=phaseRef.current;
      const initialTime=initialPhase===0?0:initialPhase*phaseDuration+2000;
      tl.seek(initialTime);
      setPhase(initialPhase);
      setTerm(8);
      if(range.current)range.current.value=String(initialTime);
      if(clock.current)clock.current.value=`${(initialTime/1000).toFixed(1)} / 12 s`;
      return ()=>{timeline.current=null;};
    });
    const pause=()=>{timeline.current?.pause();setPlaying(false);};
    const hide=()=>{if(document.hidden)pause();};
    const observer=typeof IntersectionObserver==="undefined" ? undefined : new IntersectionObserver(([entry])=>{if(!entry.isIntersecting)pause();});
    if(root.current)observer?.observe(root.current);
    document.addEventListener("visibilitychange",hide);
    return ()=>{observer?.disconnect();document.removeEventListener("visibilitychange",hide);scope.revert();};
  },[data,frame,bin,channel]);

  const seek=(time:number)=>{
    timeline.current?.pause();
    timeline.current?.seek(time);
    setPhase(Math.min(4,Math.floor(time/phaseDuration)));
    setTerm(Math.max(-1,Math.min(8,Math.floor((time-phaseDuration-200)/180))));
    if(range.current)range.current.value=String(time);
    if(clock.current)clock.current.value=`${(time/1000).toFixed(1)} / 12 s`;
    setPlaying(false);
  };
  const toggle=()=>{
    const tl=timeline.current;
    if(!tl)return;
    if(playing){tl.pause();setPlaying(false);}
    else {if(tl.currentTime>=duration)seek(0);else if(tl.currentTime%phaseDuration>=1900)seek(phase*phaseDuration);tl.play();setPlaying(true);}
  };
  const names=[t("取帧与频谱","Frame & spectrum","フレームとスペクトル","프레임과 스펙트럼"),t("卷积乘加","Convolution","畳み込み","합성곱"),t("非线性激活","Activation","活性化","활성화"),t("掩码与增益","Mask & gain","マスクとゲイン","마스크와 이득"),t("重建输出","Reconstruction","再構成","재구성")];
  const icons=[Waves,Grid2X2,Cpu,SlidersHorizontal,AudioLines];
  const start=frame*128-128;
  const input=data.trace.input.slice(start,start+256);
  const windowed=input.map((v,i)=>v*(.5-.5*Math.cos(2*Math.PI*i/256)));
  const products=data.kernels[channel].flat().map((w,i)=>({w,x:data.input[bin+Math.floor(i/3)-1][frame+i%3-1]}));
  const sums=data.kernels.map((kernel,c)=>kernel.flat().reduce((sum,w,i)=>sum+w*data.input[bin+Math.floor(i/3)-1][frame+i%3-1],data.bias[c]));
  const mask=data.mask[bin][frame];
  const magnitude=data.magnitude[bin][frame];
  const logit=data.head.reduce((sum,w,c)=>sum+w*data.activations[c][bin][frame],data.headBias);
  const activeCell=cellOrder[term] ?? -1;
  const runningSum=cellOrder.slice(0,term+1).reduce((sum,i)=>sum+products[i].x*products[i].w,data.bias[channel]);
  const spectrumLabel=t("输入频谱","Input spectrum","入力スペクトル","입력 스펙트럼");
  const outputLabel=t("输出频谱","Output spectrum","出力スペクトル","출력 스펙트럼");
  const targetLabel=t("干净参考频谱","Clean reference spectrum","クリーン参照スペクトル","깨끗한 참조 스펙트럼");
  const map=(values:number[][],label:string,size=1,scale=["−80 dB","−40 dB","0 dB"],max=1)=><figure className="denoise-lesson-map"><DenoiseSpectrumMap values={values} label={label} selection={[frame,bin]} selectionSize={size} scale={scale} max={max} activeCell={phase===1?activeCell:-1}/></figure>;
  const activationMax=Math.max(...data.activations.flat(2));
  const featureLabel=t("模型特征通道","Model feature channel","モデル特徴チャネル","모델 특징 채널");
  const notices=[
    t("同一帧的原始样本与 Hann 加窗结果；边缘变小是加窗，不是降噪。横轴为窗口内时间，纵轴为归一化 PCM 幅度。","Raw samples and Hann-windowed samples of one frame. Fading edges mean windowing, not denoising. X: time within the window; Y: normalized PCM amplitude.","同じフレームの元サンプルと Hann 窓適用後。端の減衰は窓掛けで、ノイズ除去ではありません。横軸は窓内時間、縦軸は正規化 PCM 振幅。","동일 프레임의 원본과 Hann 창 적용 결과입니다. 가장자리 감소는 창 효과이며 잡음 제거가 아닙니다. 가로는 창 내부 시간, 세로는 정규화 PCM 진폭입니다."),
    t("白框九格与右侧九个乘积一一对应：上方高频、时间向右。橙框标出当前乘积，累计和从偏置开始。权重由带噪/干净训练对学习，不是人为指定哪里是语音；此处仅展开一个特征通道。","The outlined nine cells match the nine products: higher frequencies above, time to the right. Orange marks the current product; accumulation starts at the bias. Weights are learned from noisy/clean training pairs, not hand-labelled speech regions. One feature channel is expanded here.","白枠9セルは右の9つの積と対応し、上が高域、右が後の時刻です。橙枠は現在の積で、累積はバイアスから開始します。重みは雑音付き・クリーンの学習ペアから得たもので、音声領域の手動指定ではありません。1特徴チャネルを展開しています。","흰 테두리의 아홉 칸은 오른쪽 곱과 대응하며 위는 고주파, 오른쪽은 시간입니다. 주황색은 현재 곱이고 누적은 편향에서 시작합니다. 가중치는 잡음·깨끗한 학습 쌍에서 학습한 값으로 음성 구간의 수동 지정이 아닙니다. 하나의 특징 채널만 펼칩니다."),
    t("四个通道分别执行 ReLU：负值置零、正值保留。特征响应不是音量，也不是语音概率。","Each of four channels applies ReLU: negative values become zero; positive values remain. Feature responses are neither loudness nor speech probabilities.","4チャネルそれぞれで ReLU を適用し、負値を0に、正値を保持します。特徴応答は音量や音声確率ではありません。","네 채널에 각각 ReLU를 적용해 음수는 0으로 만들고 양수는 유지합니다. 특징 응답은 음량이나 음성 확률이 아닙니다."),
    t("同一位置的四路激活经 1×1 卷积和 Sigmoid 生成幅度掩码。掩码同时缩放该格内的语音与噪声，不会识别后只删除噪声。","A 1×1 convolution and sigmoid turn four activations at this location into a magnitude mask. It scales both speech and noise in that cell, not noise alone.","同じ位置の4活性化を1×1畳み込みと Sigmoid で振幅マスクに変換します。そのセル内の音声と雑音の両方を縮小します。","같은 위치의 네 활성화를 1×1 합성곱과 Sigmoid로 진폭 마스크로 바꿉니다. 해당 칸의 음성과 잡음이 함께 조절됩니다."),
    t("重建使用全部时频位置的掩码与原始复数频谱，不是只用上面选中的一个 bin。iSTFT、重叠相加和归一化后，得到下方同一时间段的输出。","Reconstruction uses masks at all time-frequency positions and the original complex spectrum, not just the selected bin. iSTFT, overlap-add and normalization produce the output over the same interval below.","再構成には選択 bin だけでなく全時周波数位置のマスクと元の複素スペクトルを使用します。iSTFT・重ね合わせ・正規化後の同区間を比較します。","재구성은 선택한 bin 하나가 아니라 모든 시간·주파수 위치의 마스크와 원본 복소 스펙트럼을 사용합니다. iSTFT, 중첩 합산, 정규화 후 같은 구간의 출력을 비교합니다."),
  ];
  return <section ref={root} className="denoise-pipeline" aria-label={t("降噪全流程动画","Denoising pipeline animation","ノイズ抑制の全工程アニメーション","잡음 제거 전체 과정 애니메이션")}>
    <div className="denoise-pipeline-heading"><div><h3>{t("跟踪一帧，走完降噪链路","Follow one frame through denoising","1フレームを追ってノイズ抑制を理解","한 프레임으로 잡음 제거 과정 따라가기")}</h3><span>{frame*16} ms · {bin*31.25} Hz · {featureLabel} {channel+1}</span></div>
      <div className="robot-buttons">
        <button onClick={()=>seek((phase-1)*phaseDuration+2000)} disabled={phase===0} aria-label={t("上一步","Previous step","前のステップ","이전 단계")} title={t("上一步","Previous step","前のステップ","이전 단계")}><ChevronLeft size={18}/></button>
        <button onClick={()=>seek((phase+1)*phaseDuration+2000)} disabled={phase===4} aria-label={t("下一步","Next step","次のステップ","다음 단계")} title={t("下一步","Next step","次のステップ","다음 단계")}><ChevronRight size={18}/></button>
        <button onClick={toggle} aria-label={playing?t("暂停全流程","Pause pipeline","全工程を一時停止","전체 과정 일시 정지"):t("播放全流程","Play pipeline","全工程を再生","전체 과정 재생")} title={playing?t("暂停","Pause","一時停止","일시 정지"):t("播放全流程","Play pipeline","全工程を再生","전체 과정 재생")}>{playing?<Pause size={18}/>:<Play size={18}/>}</button>
        <button onClick={()=>seek(0)} aria-label={t("重置全流程","Reset pipeline","全工程をリセット","전체 과정 초기화")} title={t("重置全流程","Reset pipeline","全工程をリセット","전체 과정 초기화")}><RotateCcw size={18}/></button>
      </div>
    </div>
    <div className="denoise-lesson-controls">
      <label>{t("检查帧","Inspect frame","確認フレーム","확인 프레임")} <span>{frame*16} ms</span><input type="range" min="1" max="62" value={frame} onChange={e=>onFrameChange(Number(e.target.value))}/></label>
      <label>{t("检查频率","Inspect frequency","確認周波数","확인 주파수")} <span>{bin*31.25} Hz</span><input type="range" min="1" max="62" value={bin} onChange={e=>onBinChange(Number(e.target.value))}/></label>
      <label>{featureLabel}<select value={channel} onChange={e=>onChannelChange(Number(e.target.value))}>{[0,1,2,3].map(c=><option key={c} value={c}>{c+1}</option>)}</select></label>
    </div>
    <ol className="denoise-pipeline-stages">{names.map((name,i)=>{const Icon=icons[i];return <li key={i}><button onClick={()=>seek(i*phaseDuration+2000)} aria-label={`${t("跳到","Jump to","移動：","이동:")} ${name}`} aria-current={phase===i?"step":undefined}><Icon size={20} aria-hidden="true"/><span>{i+1}. {name}</span></button></li>;})}</ol>
    <svg className="denoise-route" viewBox="0 0 1000 8" aria-hidden="true" preserveAspectRatio="none"><path d="M0 4H1000"/><path className="denoise-route-progress" d="M0 4H1000" pathLength="100" strokeDasharray="100"/></svg>
    <div className="denoise-pipeline-progress"><input ref={range} type="range" min="0" max={duration} step="10" defaultValue="0" onChange={e=>seek(Number(e.target.value))} aria-label={t("教学动画进度","Lesson animation progress","学習アニメーションの進行","학습 애니메이션 진행")}/><output ref={clock}>0.0 / 12 s</output></div>
    <div className="denoise-animation-scene denoise-phase-0" hidden={phase!==0}>
      {phase===0 && map(data.input,spectrumLabel)}
      <div className="denoise-stage-wave-pair"><Wave samples={input} label="PCM · x[n]"/><Wave samples={windowed} label="x[n] × Hann"/></div>
      <p className="denoise-pipeline-equation">FFT → |Y({bin})| = {magnitude.toExponential(4)} → log feature = {data.input[bin][frame].toFixed(4)}</p>
    </div>
    <div className="denoise-animation-scene denoise-phase-1" hidden={phase!==1}>
      {phase===1 && map(data.input,spectrumLabel,3)}
      <div><div className="denoise-products denoise-pipeline-patch">{cellOrder.map((i,index)=><code key={i} data-bin={bin+Math.floor(i/3)-1} data-frame={frame+i%3-1} data-active={index===term}><small>{(bin+Math.floor(i/3)-1)*31.25} Hz · {(frame+i%3-1)*16} ms</small>{products[i].x.toFixed(3)} × {products[i].w.toFixed(3)}<br/>= {(products[i].x*products[i].w).toFixed(3)}</code>)}</div>
      <div className="denoise-pipeline-equation denoise-running-sum"><span>{t("累计和（含偏置）","Running sum (including bias)","累積和（バイアス込み）","누적 합 (편향 포함)")} · {term+1}/9</span><strong data-testid="denoise-running-sum">{runningSum.toFixed(5)}</strong><span>b = {data.bias[channel].toFixed(5)} → z = {sums[channel].toFixed(5)}</span></div></div>
    </div>
    <div className="denoise-animation-scene denoise-phase-2" hidden={phase!==2}>
      {phase===2 && map(data.activations[channel],`${featureLabel} ${channel+1}`,1,["0",(activationMax/2).toFixed(2),activationMax.toFixed(2)],activationMax)}
      <div><div className="denoise-response-table"><div><strong>CH</strong><strong>z</strong><strong>ReLU(z) ≈</strong></div>{sums.map((z,c)=><div key={c} data-selected={c===channel}><span>{c+1}</span><code>{z.toFixed(5)}</code><code>{data.activations[c][bin][frame].toFixed(5)}</code></div>)}</div>
      <div className="denoise-pipeline-equation"><span>ReLU(z) = max(0, z)</span><strong>{t("负值 → 0","Negative → 0","負値 → 0","음수 → 0")}</strong><span>{t("正值保持","Positive unchanged","正値は保持","양수는 유지")}</span></div></div>
    </div>
    <div className="denoise-animation-scene denoise-phase-3" hidden={phase!==3}>
      {phase===3 && map(data.mask,t("掩码：暗色抑制，亮色保留","Mask: dark suppresses, bright retains","マスク：暗は抑制、明は保持","마스크: 어두움 억제, 밝음 보존"),1,["0","0.5","1"])}
      <div><div className="denoise-response-table"><div><strong>CH</strong><strong>h × w</strong><strong>=</strong></div>{data.head.map((w,c)=><div key={c}><span>{c+1}</span><code>{data.activations[c][bin][frame].toFixed(3)} × {w.toFixed(3)}</code><code>{(data.activations[c][bin][frame]*w).toFixed(3)}</code></div>)}</div>
      <div className="denoise-pipeline-equation"><span>σ(Σ(h × w) + b) = σ({logit.toFixed(4)})</span><strong>M = {mask.toFixed(4)} · {(mask*100).toFixed(1)}%</strong><span>{(20*Math.log10(mask)).toFixed(2)} dB</span><div className="denoise-mask-meter" role="meter" aria-label={t("幅度保留比例","Magnitude retained","振幅保持率","진폭 보존 비율")} aria-valuemin={0} aria-valuemax={1} aria-valuenow={mask}><i style={{width:`${mask*100}%`}}/></div><code>|Ŝ| = {magnitude.toExponential(3)} × {mask.toFixed(4)} = {(magnitude*mask).toExponential(3)}</code></div></div>
    </div>
    <div className="denoise-animation-scene denoise-phase-4" hidden={phase!==4}>
      <p className="denoise-pipeline-equation">Ŝ(t,f) = M(t,f) × Y(t,f) → iSTFT + OLA → PCM</p>
      <div className="denoise-output-comparison">{phase===4 && <>{map(data.input,spectrumLabel)}{map(data.output,outputLabel)}{map(data.target,targetLabel)}</>}</div>
      <div className="denoise-output-comparison"><Wave samples={input} label={t("带噪输入 · PCM","Noisy input · PCM","雑音付き入力 · PCM","잡음 입력 · PCM")}/><Wave samples={data.trace.output.slice(start,start+256)} label={t("重建输出 · PCM","Reconstructed output · PCM","再構成出力 · PCM","재구성 출력 · PCM")}/><Wave samples={data.trace.target.slice(start,start+256)} label={t("干净参考 · PCM","Clean reference · PCM","クリーン参照 · PCM","깨끗한 참조 · PCM")}/></div>
      <p className="denoise-comparison-note">{t("三张频谱同色标、三段波形同幅度比例。比较谐波是否接近干净参考，以及谐波之间是否仍有噪声；变暗或变小本身不代表质量更好。干净参考仅用于评估，不送入推理模型。","Spectra share one color scale; waveforms share one amplitude scale. Compare harmonic preservation and noise between harmonics against the clean reference. Darker or quieter alone is not better. The reference is for evaluation, never an inference input.","3スペクトルは同じ色域、波形は同じ振幅尺度です。参照と比較し調波の保持と間の残留雑音を確認してください。暗い・小さいだけでは改善ではありません。参照は評価専用で推論入力ではありません。","스펙트럼과 파형은 각각 같은 색상·진폭 척도입니다. 참조와 비교해 고조파 보존과 사이의 잔여 잡음을 확인하세요. 어둡거나 작다고 좋은 것은 아닙니다. 참조는 평가용이며 추론 입력이 아닙니다.")}</p>
    </div>
    <p className="denoise-selection-key">{t("白框始终对应同一时频位置；卷积阶段扩大为 3×3 邻域。CH 是学习到的特征通道，不是麦克风或音轨。","White outlines track the same time-frequency location, expanded to a 3×3 neighborhood for convolution. CH means a learned feature channel, not a microphone or audio track.","白枠は同じ時周波数位置を追い、畳み込み時は3×3近傍に広がります。CH は学習特徴であり、マイクや音声トラックではありません。","흰 테두리는 같은 시간·주파수 위치이며 합성곱에서는 3×3 이웃으로 확장됩니다. CH는 학습된 특징 채널이며 마이크나 오디오 트랙이 아닙니다.")}</p>
    <p className="denoise-pipeline-notice">{notices[phase]}</p>
    <p className="denoise-pipeline-footnote">{t("12 秒是教学慢放，不是模型运行延迟；动画不播放声音。结果为离线预计算；导出数据经舍入，乘加复算与保存的激活或掩码可能有微小差异。","The 12-second lesson is slow motion, not model latency; the animation has no audio. Results are precomputed offline. Export rounding may cause small differences between recalculated sums and saved activations or masks.","12秒は学習用の低速再生で、モデル遅延ではなく、音声もありません。結果は事前計算です。エクスポート時の丸めにより積和の再計算と保存した活性化・マスクに微小な差が生じます。","12초는 학습용 느린 재생이며 모델 지연이 아니고 소리도 없습니다. 결과는 사전 계산됩니다. 내보낸 값의 반올림으로 재계산한 합과 저장된 활성화·마스크에 작은 차이가 날 수 있습니다.")}</p>
  </section>;
}
