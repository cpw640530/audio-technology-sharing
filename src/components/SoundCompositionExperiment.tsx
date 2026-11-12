import { useEffect, useRef, useState } from "react";
import { useLabState } from "../hooks/useLabState";
import { Play, Square } from "lucide-react";
import { text } from "../content/language";
import type { Language } from "../content/knowledge";
import { soundCoefficients, soundComponents, soundValue } from "./soundCompositionModel";

type Playback = { context: AudioContext; oscillator: OscillatorNode; gain: GainNode; started: boolean };
export function SoundCompositionExperiment({ language, mode }: { language: Language; mode: "tone" | "sum" | "spectrum" }) {
  const t = (zh: string, en: string, ja: string, ko: string) => text(language, zh, en, ja, ko);
  const [frequency, setFrequency] = useLabState("composition.frequency", 220, (v): v is number => typeof v === "number" && Number.isFinite(v) && v >= 110 && v <= 660);
  const [amplitude, setAmplitude] = useLabState("composition.amplitude", .35, (v): v is number => typeof v === "number" && Number.isFinite(v) && v >= 0 && v <= .4);
  const [second, setSecond] = useLabState("composition.second", .35, (v): v is number => typeof v === "number" && Number.isFinite(v) && v >= 0 && v <= .4);
  const [phase, setPhase] = useLabState("composition.phase", 0, (v): v is number => typeof v === "number" && Number.isFinite(v) && v >= 0 && v <= Math.PI);
  const [third, setThird] = useLabState("composition.third", .175, (v): v is number => typeof v === "number" && Number.isFinite(v) && v >= 0 && v <= .4);
  const [thirdPhase, setThirdPhase] = useLabState("composition.thirdPhase", 0, (v): v is number => typeof v === "number" && Number.isFinite(v) && v >= 0 && v <= Math.PI);
  const [cursor, setCursor] = useLabState("composition.cursor", .002, (v): v is number => typeof v === "number" && Number.isFinite(v) && v >= 0 && v <= .012);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);
  const audio = useRef<Playback | null>(null);
  const components = soundComponents(mode, amplitude, second, phase, third, thirdPhase);
  const axisMax = mode === "spectrum" ? 1.2 : 1;
  const coefficients = soundCoefficients(components);
  const curve = (index?: number) => Array.from({ length: 401 }, (_, i) => `${i ? "L" : "M"}${40 + i},${100 - 65 / axisMax * soundValue(i / 400 * .012, frequency, index === undefined ? components : [components[index]])}`).join(" ");
  function stop(update = true) {
    const current = audio.current; audio.current = null;
    if (current) {
      if (current.started) current.oscillator.stop();
      current.oscillator.disconnect(); current.gain.disconnect();
      void current.context.close().catch(() => {});
    }
    if (update) setPlaying(false);
  }
  async function play() {
    document.dispatchEvent(new Event("sound-article-play"));
    setError(false);
    let current: Playback | null = null;
    try {
      const Audio = window.AudioContext ?? window.webkitAudioContext;
      if (!Audio) throw new Error("Audio unavailable");
      const context = new Audio();
      current = { context, oscillator: context.createOscillator(), gain: context.createGain(), started: false };
      audio.current = current;
      current.oscillator.frequency.value = frequency;
      current.oscillator.setPeriodicWave(context.createPeriodicWave(coefficients.real, coefficients.imag, { disableNormalization: true }));
      current.gain.gain.value = 0;
      current.oscillator.connect(current.gain); current.gain.connect(context.destination);
      await context.resume();
      if (audio.current !== current) return;
      current.oscillator.start(); current.started = true;
      current.gain.gain.setTargetAtTime(.12, context.currentTime, .02);
      setPlaying(true);
    } catch {
      if (current && audio.current !== current) return;
      stop(); setError(true);
    }
  }
  useEffect(() => {
    const current = audio.current;
    if (!current) return;
    const c = soundCoefficients(soundComponents(mode, amplitude, second, phase, third, thirdPhase));
    current.oscillator.frequency.setTargetAtTime(frequency, current.context.currentTime, .02);
    current.oscillator.setPeriodicWave(current.context.createPeriodicWave(c.real, c.imag, { disableNormalization: true }));
  }, [mode, amplitude, second, phase, third, thirdPhase, frequency]);
  useEffect(() => {
    const halt = () => stop();
    const hide = () => { if (document.hidden) stop(); };
    document.addEventListener("sound-article-play", halt);
    document.addEventListener("visibilitychange", hide);
    return () => { document.removeEventListener("sound-article-play", halt); document.removeEventListener("visibilitychange", hide); stop(false); };
  }, []);
  const colors = ["#227a70", "#a94d1d", "#4167a0"];
  const dashes = ["8 4", "2 4", "8 3 2 3"];
  const angle = 2 * Math.PI * frequency * cursor;
  return <div className="sound-composition" data-testid={`sound-composition-${mode}`}>
    <div className="sound-propagation-controls">
      <label>{t("频率", "Frequency", "周波数", "주파수")} {frequency} Hz<input type="range" min="110" max="660" step="10" value={frequency} onChange={e => setFrequency(Number(e.target.value))} /></label>
      <label>{t("分量 A 振幅", "Component A amplitude", "成分 A の振幅", "성분 A 진폭")} {amplitude.toFixed(2)}<input type="range" min="0" max="0.4" step="0.01" value={amplitude} onChange={e => setAmplitude(Number(e.target.value))} /></label>
      {mode !== "tone" && <>
        <label>{t("分量 B 振幅", "Component B amplitude", "成分 B の振幅", "성분 B 진폭")} {second.toFixed(2)}<input type="range" min="0" max="0.4" step="0.01" value={second} onChange={e => setSecond(Number(e.target.value))} /></label>
        <label>{t("分量 B 相位", "Component B phase", "成分 B の位相", "성분 B 위상")} {Math.round(phase * 180 / Math.PI)}°<input type="range" min="0" max="180" step="1" value={Math.round(phase * 180 / Math.PI)} onChange={e => setPhase(Number(e.target.value) * Math.PI / 180)} /></label>
      </>}
      {mode === "spectrum" && <>
        <label>{t("分量 C 振幅", "Component C amplitude", "成分 C の振幅", "성분 C 진폭")} {third.toFixed(3)}<input type="range" min="0" max="0.4" step="0.005" value={third} onChange={e => setThird(Number(e.target.value))} /></label>
        <label>{t("分量 C 相位", "Component C phase", "成分 C の位相", "성분 C 위상")} {Math.round(thirdPhase * 180 / Math.PI)}°<input type="range" min="0" max="180" step="1" value={Math.round(thirdPhase * 180 / Math.PI)} onChange={e => setThirdPhase(Number(e.target.value) * Math.PI / 180)} /></label>
      </>}
      <label>{t("观察时刻", "Observation time", "観測時刻", "관측 시점")} {(cursor * 1000).toFixed(1)} ms<input type="range" min="0" max="0.012" step="0.0001" value={cursor} onChange={e => setCursor(Number(e.target.value))} /></label>
      <button type="button" className="sound-topic-back" onClick={() => playing ? stop() : void play()}>{playing ? <Square size={18} /> : <Play size={18} />}{playing ? t("停止试听", "Stop sound", "停止", "정지") : t("试听当前波形", "Listen to this waveform", "現在の波形を聴く", "현재 파형 듣기")}</button>
    </div>
    {error && <p role="alert">{t("无法播放，请检查浏览器音频权限后重试。", "Playback failed. Check browser audio permissions and retry.", "再生できません。音声権限を確認してください。", "재생할 수 없습니다. 오디오 권한을 확인하세요.")}</p>}
    {mode === "tone" && <svg className="sound-circle" viewBox="0 0 460 170" role="img" aria-label={t("圆周投影与正弦瞬时值", "Circular projection and sine value", "円の投影と正弦値", "원 투영과 정현파 값")}>
      <circle cx="100" cy="85" r={amplitude * 150} fill="none" stroke="#227a70" />
      <path d="M25 85 H175 M100 10 V160 M270 10 V160 M240 85 H390" stroke="#a3b5af" fill="none" />
      <path d={`M100 85 L${100 + amplitude * 150 * Math.cos(angle)} ${85 - amplitude * 150 * Math.sin(angle)} H270`} stroke="#a94d1d" fill="none" />
      <circle cx={100 + amplitude * 150 * Math.cos(angle)} cy={85 - amplitude * 150 * Math.sin(angle)} r="5" fill="#a94d1d" />
      <circle cx="270" cy={85 - amplitude * 150 * Math.sin(angle)} r="5" fill="#227a70" />
      <text x="300" y="35">A sin(2πft)</text><text x="300" y="59">{soundValue(cursor, frequency, components).toFixed(3)}</text>
    </svg>}
    <ul className="sound-composition-legend" aria-label={t("曲线图例", "Curve legend", "曲線の凡例", "곡선 범례")}>
      {components.map((c, i) => <li key={i}>
        <svg viewBox="0 0 40 12" aria-hidden="true"><path d="M0 6 H40" stroke={mode === "tone" ? "#203b35" : colors[i]} strokeWidth="2.5" strokeDasharray={mode === "tone" ? undefined : dashes[i]} /></svg>
        <span>{t("分量", "Component", "成分", "성분")} {"ABC"[i]} · {frequency * c.multiple} Hz · {t("振幅", "amplitude", "振幅", "진폭")} {c.amplitude.toFixed(2)} · {t("相位", "phase", "位相", "위상")} {Math.round(c.phase * 180 / Math.PI)}°</span>
      </li>)}
      {mode !== "tone" && <li><svg viewBox="0 0 40 12" aria-hidden="true"><path d="M0 6 H40" stroke="#203b35" strokeWidth="3" /></svg><span>{t("合成波形", "Resulting waveform", "合成波形", "합성 파형")} = {mode === "sum" ? "A + B" : "A + B + C"}</span></li>}
      <li><svg viewBox="0 0 40 12" aria-hidden="true"><path d="M20 0 V12" stroke="#687772" strokeDasharray="3 3" /></svg><span>{t("灰色竖线：观察时刻，不是信号", "Gray vertical line: observation time, not a signal", "灰色の縦線：観測時刻、信号ではありません", "회색 세로선: 관측 시점, 신호가 아닙니다")}</span></li>
    </ul>
    <svg className="sound-composition-wave" viewBox="0 0 460 210" role="img" aria-label={t("分量与合成波形", "Components and resulting waveform", "成分と合成波形", "성분과 합성 파형")}>
      {[-1, 0, 1].map(a => <g key={a}><path d={`M40 ${100 - a * 65} H440`} stroke="#c8d6d0" /><text x="30" y={105 - a * 65} textAnchor="end">{a * axisMax}</text></g>)}
      {[0, 3, 6, 9, 12].map(ms => <text key={ms} x={40 + ms / 12 * 400} y="190" textAnchor="middle">{ms}</text>)}
      {mode !== "tone" && components.map((_, i) => <path key={i} data-testid={`composition-component-${i}`} d={curve(i)} fill="none" stroke={colors[i]} strokeWidth="1.8" strokeDasharray={dashes[i]} />)}
      <path data-testid="composition-sum" d={curve()} fill="none" stroke="#203b35" strokeWidth="2.5" />
      <path d={`M${40 + cursor / .012 * 400} 25 V170`} stroke="#687772" strokeDasharray="3 3" />
      <circle cx={40 + cursor / .012 * 400} cy={100 - 65 / axisMax * soundValue(cursor, frequency, components)} r="4" fill="#203b35" />
    </svg>
    <p className="sound-topic-note">{t(`横轴：时间 0–12 ms；纵轴：信号相对幅度，固定 ±${axisMax}。实线是合成结果，虚线是分量。试听使用相同系数并统一衰减，不自动归一化；请先调低设备音量。`, `X: time 0–12 ms; Y: signal amplitude, fixed ±${axisMax}. Solid: sum; dashed: components. Playback uses the same coefficients with fixed attenuation and no normalization. Start with low device volume.`, `横軸：時間 0–12 ms、縦軸：相対振幅 ±${axisMax} 固定。実線は合成、破線は成分です。試聴は同じ係数と固定減衰を使用します。音量を下げて開始してください。`, `가로축: 0–12 ms, 세로축: 상대 진폭 ±${axisMax} 고정. 실선은 합, 점선은 성분입니다. 같은 계수와 고정 감쇠로 재생합니다. 기기 음량을 낮춰 시작하세요.`)}</p>
    {mode === "sum" && <p className="sound-sum-readout">{components.map(c => (c.amplitude * Math.sin(2 * Math.PI * frequency * cursor + c.phase)).toFixed(3)).join(" + ")} = {soundValue(cursor, frequency, components).toFixed(3)}</p>}
    {mode === "spectrum" && <>
      <svg className="sound-composition-spectrum" viewBox="0 0 460 185" role="img" aria-label={t("幅度线谱", "Amplitude line spectrum", "振幅線スペクトル", "진폭 선 스펙트럼")}>
        {[0, .2, .4].map(a => <g key={a}><path d={`M40 ${140 - a * 280} H440`} stroke="#c8d6d0" /><text x="30" y={145 - a * 280} textAnchor="end">{a}</text></g>)}
        {[0, 500, 1000, 1500, 2000].map(f => <text key={f} x={40 + f / 2000 * 400} y="171" textAnchor="middle">{f}</text>)}
        {components.map((c, i) => <path key={i} data-testid={`composition-spectrum-${i}`} d={`M${40 + frequency * c.multiple / 2000 * 400} 140 v${-c.amplitude * 280}`} stroke={colors[i]} strokeWidth="5" />)}
      </svg>
      <p>{t("横轴：Hz；纵轴：各分量峰值振幅。A、B、C 分别是 f、2f、3f；各分量的振幅独立调节。线谱来自已知合成系数，不是假装测得的 FFT，也不包含相位信息。", "X: Hz; Y: peak component amplitude. A, B, C are f, 2f, 3f; each amplitude is independent. Lines come from known synthesis coefficients, not a measured FFT, and do not show phase.", "横軸は Hz、縦軸は各成分のピーク振幅。A、B、C は f、2f、3f、各振幅は独立に調整できます。既知の合成係数であり FFT 測定ではなく、位相も示しません。", "가로축은 Hz, 세로축은 성분 피크 진폭입니다. A, B, C는 f, 2f, 3f이며 각 진폭은 독립적으로 조절합니다. 알려진 합성 계수이며 FFT 측정이나 위상 표시가 아닙니다.")}</p>
    </>}
  </div>;
}
