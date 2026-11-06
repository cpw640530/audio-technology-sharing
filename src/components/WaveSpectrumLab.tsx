import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Play, RotateCcw, Square } from "lucide-react";
import type { Language } from "../content/knowledge";
import { text } from "../content/language";
import { waveSpectrumTopic } from "../content/waveSpectrum";
import { SoundCompositionExperiment } from "./SoundCompositionExperiment";
import { componentFrequencies, componentSample, initialAmplitudes, mixtureSample, periodicCoefficients } from "./waveSpectrumModel";

const colors = ["#7ee7d8", "#f0c470", "#f29a9a"];
const WaveSpectrum3D = lazy(() => import("./WaveSpectrum3D"));
const pathFor = (sample: (seconds: number) => number) => Array.from({ length: 257 }, (_, index) => {
  const t = index / 256;
  return `${index ? "L" : "M"}${(44 + 356 * t).toFixed(2)},${(80 - 60 * sample(t * 0.008)).toFixed(2)}`;
}).join(" ");

function TimePlot({ title, paths, labels }: { title: string; paths: string[]; labels: string[] }) {
  return <figure className="wave-spectrum-plot">
    <figcaption>{title}</figcaption>
    <svg role="img" aria-label={title} viewBox="0 0 420 180">
      {[-1, 0, 1].map(value => <g key={value}><line x1="44" x2="400" y1={80 - value * 60} y2={80 - value * 60} /><text x="34" y={85 - value * 60} textAnchor="end">{value}</text></g>)}
      {[0, 2, 4, 6, 8].map(ms => <g key={ms}><line x1={44 + ms * 44.5} x2={44 + ms * 44.5} y1="20" y2="140" /><text x={44 + ms * 44.5} y="165" textAnchor="middle">{ms}</text></g>)}
      {paths.map((path, index) => <path data-testid={paths.length === 1 ? "wave-spectrum-sum" : `wave-spectrum-component-${index}`} key={index} d={path} stroke={paths.length === 1 ? "#edf7f4" : colors[index]} />)}
    </svg>
    <div className="wave-spectrum-legend">{labels.map((label, index) => <span key={label}><i style={{ background: paths.length === 1 ? "#edf7f4" : colors[index] }} />{label}</span>)}</div>
  </figure>;
}

type Playback = { context: AudioContext; oscillator: OscillatorNode; gain: GainNode; started: boolean };

export function WaveSpectrumLab({ language, onBack, onBackToDetails }: {
  language: Language; onBack: () => void; onBackToDetails: () => void;
}) {
  const [amplitudes, setAmplitudes] = useState(initialAmplitudes);
  const [phase, setPhase] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);
  const audio = useRef<Playback | null>(null);
  const t = (zh: string, en: string, ja: string, ko: string) => text(language, zh, en, ja, ko);
  const paths = useMemo(() => amplitudes.map((amplitude, index) => pathFor(time => componentSample(time, index, amplitude, index === 2 ? phase : 0))), [amplitudes, phase]);
  const sum = useMemo(() => pathFor(time => mixtureSample(time, amplitudes, phase)), [amplitudes, phase]);
  const rms = Math.sqrt(amplitudes.reduce((power, a) => power + a * a / 2, 0));

  function stop(updateState = true) {
    const current = audio.current;
    audio.current = null;
    if (current) {
      if (current.started) current.oscillator.stop();
      current.oscillator.disconnect();
      current.gain.disconnect();
      void current.context.close().catch(() => {});
    }
    if (updateState) setPlaying(false);
  }

  function updateWave(current: Playback) {
    const { real, imag } = periodicCoefficients(amplitudes, phase);
    current.oscillator.setPeriodicWave(current.context.createPeriodicWave(real, imag, { disableNormalization: true }));
  }

  async function play() {
    document.dispatchEvent(new Event("sound-article-play"));
    stop();
    setError(false);
    let current: Playback | null = null;
    try {
      const Audio = window.AudioContext ?? window.webkitAudioContext;
      if (!Audio) throw new Error("Web Audio unavailable");
      const context = new Audio();
      current = { context, oscillator: context.createOscillator(), gain: context.createGain(), started: false };
      audio.current = current;
      current.oscillator.frequency.value = componentFrequencies[0];
      updateWave(current);
      current.gain.gain.value = 0.15;
      current.oscillator.connect(current.gain);
      current.gain.connect(context.destination);
      await context.resume();
      if (audio.current !== current) return;
      current.oscillator.start();
      current.started = true;
      setPlaying(true);
    } catch {
      if (current && audio.current !== current) return;
      stop();
      setError(true);
    }
  }

  useEffect(() => { if (audio.current) updateWave(audio.current); }, [amplitudes, phase]);
  useEffect(() => () => stop(false), []);
  useEffect(() => {
    const hide = () => { if (document.hidden) stop(); };
    const halt = () => stop();
    document.addEventListener("sound-article-play", halt);
    document.addEventListener("visibilitychange", hide);
    return () => { document.removeEventListener("visibilitychange", hide); document.removeEventListener("sound-article-play", halt); };
  }, []);

  return <main className="sound-lab-page wave-spectrum-lab">
    <section className="sound-lab-hero">
      <div className="sound-lab-back-actions">
        <button className="sound-lab-back sound-lab-back-secondary" onClick={onBack}>{t("返回知识库", "Back to knowledge base", "知識ベースに戻る", "지식 모음으로 돌아가기")}</button>
        <button className="sound-lab-back" onClick={onBackToDetails}><ArrowLeft size={18} aria-hidden="true" />{t("返回详细内容", "Back to detailed guide", "詳しい解説に戻る", "상세 설명으로 돌아가기")}</button>
      </div>
      <h1>{waveSpectrumTopic.detail.lab!.title[language]}</h1>
      <p>{t("各分量在同一时刻相加；三个图共用同一组振幅和相位参数。", "Components add at each instant; all plots share the same amplitudes and phases.", "各成分を同じ時刻で加算し、全図で同じ振幅と位相を使います。", "각 시점에서 성분을 더하며 모든 그래프가 같은 진폭과 위상을 사용합니다.")}</p>
    </section>
    <div className="wave-spectrum-workbench">
      <div className="wave-spectrum-three-slot"><Suspense fallback={null}><WaveSpectrum3D language={language} amplitudes={amplitudes} phase={phase} /></Suspense></div>
      <section className="sound-lab-visual">
        <h2>{t("时域：分量与合成", "Time: components and sum", "時間：成分と合成", "시간: 성분과 합성")}</h2>
        <TimePlot title={t("三个分量", "Three components", "三つの成分", "세 성분")} paths={paths} labels={componentFrequencies.map(f => `${f} Hz`)} />
        <TimePlot title={t("逐点相加后的波形", "Point-by-point sum", "各時刻で足した波形", "시점별 합성 파형")} paths={[sum]} labels={["x(t)"]} />
        <p className="wave-spectrum-caption">{t("横轴：时间 ms，固定 0–8；纵轴：归一化幅度，固定 ±1。零振幅保持水平线，不自动放大。", "X: time in ms, fixed 0–8. Y: normalized amplitude, fixed ±1. Zero amplitude stays flat; no auto-scaling.", "横軸：時間 ms、0–8 固定。縦軸：正規化振幅、±1 固定。振幅ゼロは水平線のままで自動拡大しません。", "가로축: 시간 ms, 0–8 고정. 세로축: 정규화 진폭, ±1 고정. 진폭 0은 자동 확대 없이 수평선입니다.")}</p>
      </section>
      <section className="sound-lab-visual">
        <h2>{t("频域：幅度线谱", "Frequency: amplitude lines", "周波数：振幅線スペクトル", "주파수: 진폭 선 스펙트럼")}</h2>
        <figure className="wave-spectrum-plot">
          <svg viewBox="0 0 420 190" role="img" aria-label={t("理想幅度线谱", "Ideal amplitude line spectrum", "理想振幅線スペクトル", "이상적 진폭 선 스펙트럼")}>
            {[0, 0.1, 0.2, 0.3].map(a => <g key={a}><line x1="44" x2="400" y1={145 - a * 400} y2={145 - a * 400} /><text x="34" y={150 - a * 400} textAnchor="end">{a.toFixed(1)}</text></g>)}
            {[0, ...componentFrequencies, 1000].map(f => <text key={f} x={44 + f * .356} y="174" textAnchor="middle">{f}</text>)}
            {amplitudes.map((a, i) => <g key={i} data-testid={`spectrum-line-${i}`} data-amplitude={a}>
              <path stroke={colors[i]} d={`M${44 + componentFrequencies[i] * .356},145 V${145 - a * 400}`} />
              <circle cx={44 + componentFrequencies[i] * .356} cy={145 - a * 400} r="4" fill={colors[i]} />
            </g>)}
          </svg>
          <figcaption>{t("横轴：频率 Hz；纵轴：各正弦分量的峰值振幅 A，线性标度 0–0.30。", "X: frequency in Hz. Y: peak amplitude A per sine component, linear 0–0.30.", "横軸：周波数 Hz。縦軸：各正弦成分のピーク振幅 A、線形 0–0.30。", "가로축: 주파수 Hz. 세로축: 정현파별 피크 진폭 A, 선형 0–0.30.")}</figcaption>
        </figure>
        <dl className="wave-spectrum-values">
          <div><dt>RMS</dt><dd data-testid="wave-spectrum-rms">{rms.toFixed(3)}</dd></div>
          <div><dt>{t("峰值上界 ΣA", "Peak bound ΣA", "ピーク上限 ΣA", "피크 상한 ΣA")}</dt><dd>{amplitudes.reduce((a, b) => a + b, 0).toFixed(2)}</dd></div>
        </dl>
        <p className="wave-spectrum-caption">{t("这是已知系数的理想线谱，不是实际 FFT 测量，也不是功率谱密度。相位不显示在幅度谱里。", "These ideal lines come from known coefficients, not a measured FFT or power spectral density. Phase is not shown in an amplitude spectrum.", "既知の係数から描く理想線スペクトルで、実測 FFT やパワースペクトル密度ではありません。位相は振幅スペクトルに表示されません。", "알려진 계수로 그린 이상적 선 스펙트럼이며 실측 FFT나 파워 스펙트럼 밀도가 아닙니다. 진폭 스펙트럼에는 위상이 표시되지 않습니다.")}</p>
        <p className="wave-spectrum-caption">{t("改变 φ₃：合成形状变化，三条谱线与 RMS 不变。相位变化不保证能被听出。", "Change φ₃: the shape changes, while the three lines and RMS stay fixed. A phase change is not guaranteed to be audible.", "φ₃ を変えると合成形状は変わりますが、三本の線と RMS は一定です。位相差が必ず聞こえるとは限りません。", "φ₃를 바꾸면 합성 모양은 달라지지만 세 선과 RMS는 그대로입니다. 위상 차이가 반드시 들리는 것은 아닙니다.")}</p>
      </section>
      <section className="sound-lab-panel">
        <h2>{t("分量控制", "Component controls", "成分の調整", "성분 조절")}</h2>
        {amplitudes.map((a, i) => <label className="lab-control" key={i}>
          <span>{componentFrequencies[i]} Hz · A{i + 1}<strong>{a.toFixed(2)}</strong></span>
          <input type="range" min="0" max="0.3" step="0.01" value={a} aria-label={`${componentFrequencies[i]} Hz`} onChange={e => setAmplitudes(current => current.map((value, index) => index === i ? Number(e.target.value) : value))} />
        </label>)}
        <label className="lab-control"><span>750 Hz · φ₃<strong>{phase}°</strong></span><input type="range" min="0" max="360" step="15" value={phase} aria-label="750 Hz phase" onChange={e => setPhase(Number(e.target.value))} /></label>
        <div className="wave-spectrum-commands">
          <button className="sine-button" onClick={() => setAmplitudes([.25, 0, 0])}>{t("仅基频", "Fundamental only", "基本波のみ", "기본파만")}</button>
          <button className="sine-button" onClick={() => { setAmplitudes(initialAmplitudes); setPhase(0); }}><RotateCcw size={16} aria-hidden="true" />{t("重置", "Reset", "リセット", "초기화")}</button>
          <button className="sine-button" onClick={() => playing ? stop() : void play()}>{playing ? <Square size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}{playing ? t("停止", "Stop", "停止", "정지") : t("播放", "Play", "再生", "재생")}</button>
        </div>
        {error && <p role="alert">{t("无法播放，请检查浏览器的音频权限后重试。", "Playback failed. Check browser audio permissions and retry.", "再生できません。ブラウザーの音声権限を確認してください。", "재생할 수 없습니다. 브라우저 오디오 권한을 확인하세요.")}</p>}
        <p className="wave-spectrum-caption">{t("试听与图形共用系数，固定衰减至 15%，不自动归一化。先调低设备音量；如有背景音乐，请先暂停。切换语言保留参数，离开实验室停止播放。", "Audio uses the same coefficients at a fixed 15% gain, without auto-normalization. Start at low device volume and pause any background music. Language changes keep parameters; leaving stops playback.", "試聴は同じ係数を固定 15% のゲインで再生し、自動正規化しません。機器音量を下げ BGM を停止してください。言語切替では値を保持し、退出時に停止します。", "같은 계수를 고정 15% 게인으로 재생하며 자동 정규화하지 않습니다. 장치 음량을 낮추고 배경 음악을 멈추세요. 언어 전환은 값을 유지하고 나가면 재생을 멈춥니다.")}</p>
      </section>
    </div>
    <details className="sound-topic-section">
      <summary>{t("补充实验：同频信号的相消", "Additional experiment: same-frequency cancellation", "補足実験：同周波数信号の相殺", "추가 실험: 같은 주파수 신호의 상쇄")}</summary>
      <p>{t("此处 A、B 频率相同，不是上方的不同次谐波。振幅相等、相位差 180° 时，播放前合成的信号抵消；这不代表房间内处处都能消声。", "Here A and B share a frequency, unlike the harmonics above. Equal amplitudes at 180° cancel in the summed signal before playback, not everywhere in a room.", "ここではAとBは同周波数です。同振幅・180°で再生前の合成信号が相殺しますが、部屋全体の消音ではありません。", "여기서 A와 B는 같은 주파수입니다. 같은 진폭과 180°에서 재생 전 합성 신호가 상쇄되며 방 전체의 소음 제거는 아닙니다.")}</p>
      <SoundCompositionExperiment language={language} mode="sum" />
    </details>
  </main>;
}
