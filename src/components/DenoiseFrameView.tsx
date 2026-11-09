import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from "lucide-react";
import { animate, createScope } from "animejs";
import type { Language } from "../content/knowledge";
import { traditional } from "../content/traditional";

export type DenoiseTrace = { input: number[]; output: number[]; contributions: number[][] };

export function DenoiseFrameView({ trace, frame, step, onFrameChange, language }: {
  trace: DenoiseTrace; frame: number; step: number; onFrameChange: (frame: number) => void; language: Language;
}) {
  const t = (zh: string, en: string, ja: string, ko: string) => ({ zh, "zh-Hant": traditional(zh), en, ja, ko })[language];
  const [playing, setPlaying] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (step!==0 && step!==4) return;
    const scope = createScope({ root, mediaQueries: { reduceMotion: "(prefers-reduced-motion: reduce)" } }).add(self => {
      if (self?.matches.reduceMotion) return;
      // Reveal existing samples in time order; never morph between signal values.
      animate(".denoise-frame-plots .denoise-frame-signal", {
        clipPath: ["inset(0 100% 0 0)", "inset(0 0% 0 0)"],
        duration: playing ? 180 : 600,
        ease: "linear",
      });
    });
    return () => scope.revert();
  }, [frame, step, playing]);
  useEffect(() => {
    if (!playing) return;
    if (frame >= 62) { setPlaying(false); return; }
    const timer = window.setTimeout(() => onFrameChange(frame + 1), 250);
    return () => window.clearTimeout(timer);
  }, [playing, frame, onFrameChange]);
  useEffect(() => { setPlaying(false); }, [step]);
  useEffect(() => {
    const hide = () => { if (document.hidden) setPlaying(false); };
    document.addEventListener("visibilitychange", hide);
    const observer = typeof IntersectionObserver !== "undefined" ? new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) setPlaying(false);
    }) : undefined;
    if (root.current) observer?.observe(root.current);
    return () => { document.removeEventListener("visibilitychange", hide); observer?.disconnect(); };
  }, []);
  const seek = (value: number) => { setPlaying(false); onFrameChange(value); };
  const overview = useMemo(() => {
    // Min/max envelopes retain peaks; plotting every 20th sample would alias this waveform.
    return Array.from({ length: 400 }, (_, i) => {
      const samples = trace.input.slice(Math.floor(i*trace.input.length/400), Math.floor((i+1)*trace.input.length/400));
      return `M${40+i*1.3},${46-Math.max(...samples)*32}V${46-Math.min(...samples)*32}`;
    }).join(" ");
  }, [trace]);
  const start = frame*128-128;
  const input = Array.from({ length: 256 }, (_, i) => trace.input[start+i] ?? 0);
  const windowed = input.map((v, i) => v*(0.5-0.5*Math.cos(2*Math.PI*i/256)));
  const output = trace.output.slice(start, start+256);
  const path = (samples: number[]) => samples.map((v, i) => `${i ? "L" : "M"}${40+i/255*320},${76-v*52}`).join(" ");
  const plot = (samples: number[], label: string, reference?: number[]) => <svg viewBox="0 0 400 160" role="img" aria-label={label}>
    {[-1,0,1].map(v=><g key={v}><path d={`M40 ${76-v*52}H360`} className="denoise-frame-grid"/><text x="12" y={80-v*52}>{v}</text></g>)}
    {[0,128,255].map(i=><text key={i} x={40+i/255*320} y="148" textAnchor="middle">{((start+i)/8).toFixed(1)}</text>)}
    {reference && <path d={path(reference)} className="denoise-frame-reference"/>}
    <path d={path(samples)} className="denoise-frame-signal"/>
  </svg>;
  const reconstruction = step===4;
  return <div className="denoise-frame-view" ref={root}>
    <div className="denoise-frame-toolbar">
      <div className="robot-buttons">
        <button type="button" aria-label={playing ? t("暂停帧演示","Pause frame animation","フレーム再生を停止","프레임 재생 일시 정지") : t("播放帧演示","Play frame animation","フレーム再生","프레임 재생")} title={t("帧演示，不播放声音","Frame animation, no audio","フレーム表示、音声なし","프레임 표시, 오디오 없음")} onClick={() => { if (frame===62) onFrameChange(1); setPlaying(v=>!v); }}>{playing ? <Pause size={18}/> : <Play size={18}/>}</button>
        <button type="button" disabled={frame===1} onClick={()=>seek(frame-1)} aria-label={t("上一帧","Previous frame","前のフレーム","이전 프레임")} title={t("上一帧","Previous frame","前のフレーム","이전 프레임")}><ChevronLeft size={18}/></button>
        <button type="button" disabled={frame===62} onClick={()=>seek(frame+1)} aria-label={t("下一帧","Next frame","次のフレーム","다음 프레임")} title={t("下一帧","Next frame","次のフレーム","다음 프레임")}><ChevronRight size={18}/></button>
        <button type="button" onClick={()=>seek(1)} aria-label={t("重置帧演示","Reset frame animation","フレームをリセット","프레임 초기화")} title={t("重置帧演示","Reset frame animation","フレームをリセット","프레임 초기화")}><RotateCcw size={18}/></button>
      </div>
      <label>{t("时间帧","Time frame","時間フレーム","시간 프레임")} <span>{frame}</span> / 62<input type="range" min="1" max="62" value={frame} onChange={e=>seek(Number(e.target.value))}/></label>
      <span data-testid="denoise-frame-time">{t("帧中心","Frame center","フレーム中心","프레임 중심")} {(frame*16).toFixed(0)} ms<br/>{t("窗口","Window","窓","창")} {start/8}–{(start+256)/8} ms</span>
    </div>
    <figure className="denoise-frame-overview">
      <svg viewBox="0 0 600 88" role="img" aria-label={t("带噪 PCM 与移动取帧窗口","Noisy PCM and moving analysis window","ノイズ付き PCM と移動する解析窓","잡음 PCM과 이동 분석 창")}>
        <path d="M40 46H560" className="denoise-frame-grid"/>
        <path d={overview} className="denoise-frame-reference"/>
        <rect data-testid="denoise-frame-window" x={40+start/8192*520} y="10" width={256/8192*520} height="72" className="denoise-window-highlight"/>
        <path d={`M${40+frame*128/8192*520} 10V82`} className="denoise-frame-signal"/>
      </svg>
      <div className="denoise-overview-times" aria-hidden="true">{[0,0.256,0.512,0.768,1.024].map(time=><span key={time}>{time.toFixed(3)} s</span>)}</div>
      <figcaption>{t("带噪 PCM 峰值包络；色框 = 32 ms 窗，每步移动 16 ms。动画按每秒 4 帧慢放，与试听独立，不改变模型或音频。","Noisy PCM peak envelope; box = 32 ms window, 16 ms per step. Animation runs at 4 frames/s, independent of listening; it changes neither the model nor audio.","ノイズ付き PCM のピーク包絡。色枠は 32 ms 窓、1 ステップ 16 ms。毎秒 4 フレームの低速表示で、試聴とは独立し、モデルや音声は変えません。","잡음 PCM 피크 포락선. 색 상자는 32 ms 창, 단계마다 16 ms 이동합니다. 초당 4프레임의 느린 표시이며 청취와 독립적이고 모델이나 오디오를 바꾸지 않습니다.")}</figcaption>
    </figure>
    {(step===0 || reconstruction) && <div className="denoise-frame-plots">
      <figure><h4>{reconstruction ? t("本帧合成贡献","This frame's synthesis contribution","このフレームの合成寄与","이 프레임의 합성 기여") : t("取出的 256 个样本","256 extracted samples","切り出した 256 サンプル","추출한 256개 샘플")}</h4>
        {plot(reconstruction ? trace.contributions[frame] : input, reconstruction ? "IFFT × Hann" : "PCM")}
        <figcaption>{reconstruction ? t("IFFT(Ŝ) × Σw × w[n]；这是重叠相加的一个分子项，还不是完整 PCM。","IFFT(Ŝ) × Σw × w[n]: one numerator term of overlap-add, not the final PCM.","IFFT(Ŝ) × Σw × w[n]。重ね合わせ分子の一項で、最終 PCM ではありません。","IFFT(Ŝ) × Σw × w[n]: 중첩 합산 분자의 한 항이며 최종 PCM이 아닙니다.") : t("纵轴：归一化 PCM 幅度；横轴：时间（ms）。","Vertical: normalized PCM amplitude; horizontal: time (ms).","縦軸：正規化 PCM 振幅、横軸：時間（ms）。","세로: 정규화 PCM 진폭, 가로: 시간(ms).")}</figcaption>
      </figure>
      <figure><h4>{reconstruction ? t("多帧重建后的输出","Output reconstructed from overlapping frames","複数フレームから再構成した出力","중첩 프레임에서 재구성한 출력") : t("Hann 加窗后的样本","Samples after the Hann window","Hann 窓を掛けたサンプル","Hann 창 적용 샘플")}</h4>
        {plot(reconstruction ? output : windowed, reconstruction ? "PCM output" : "PCM × Hann", input)}
        <figcaption>{reconstruction ? t("彩线：所有帧贡献相加 ÷ Σw²；灰线：带噪输入。两图幅度标尺相同。","Color: sum of all frame contributions ÷ Σw²; gray: noisy input. Both plots share an amplitude scale.","色線：全フレームの寄与の和 ÷ Σw²。灰線：ノイズ付き入力。両図の振幅目盛りは同じです。","색 선: 전체 프레임 기여 합 ÷ Σw². 회색: 잡음 입력. 두 그림의 진폭 축척은 같습니다.") : t("彩线：PCM × w[n]；灰线：加窗前。窗口边缘逐渐减弱，不是降噪结果。","Color: PCM × w[n]; gray: before windowing. Fading edges come from the window, not denoising.","色線：PCM × w[n]。灰線：窓掛け前。端の減衰は窓によるもので、ノイズ除去ではありません。","색 선: PCM × w[n]. 회색: 창 적용 전. 가장자리 감소는 창 효과이며 잡음 제거 결과가 아닙니다.")}</figcaption>
      </figure>
    </div>}
    {reconstruction && <p className="denoise-frame-note"><code>ŝ[n] = Σₘ contributionₘ[n] / Σₘ wₘ[n]²</code> · {t("Σw 撤销 STFT 幅度归一化。修改频谱后，iSTFT 给出重建估计，不保证恢复干净原声。图中仅显示 0–1.97 kHz，重建使用完整 0–4 kHz 和全部时间帧。","Σw reverses STFT amplitude normalization. After spectral modification, iSTFT estimates a reconstruction, not guaranteed clean audio. Maps show 0–1.97 kHz; reconstruction uses the full 0–4 kHz and all frames.","Σw は STFT 振幅正規化を戻します。変更したスペクトルの iSTFT は再構成の推定で、原音の完全回復を保証しません。図は 0–1.97 kHz、再構成は 0–4 kHz と全フレームを使います。","Σw는 STFT 진폭 정규화를 되돌립니다. 수정한 스펙트럼의 iSTFT는 재구성 추정이며 깨끗한 원음 복원을 보장하지 않습니다. 그림은 0–1.97 kHz, 재구성은 전체 0–4 kHz와 모든 프레임을 사용합니다.")}</p>}
  </div>;
}
