import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Pause, Play, RotateCcw } from "lucide-react";
import type { Language } from "../content/knowledge";

type WaveformType = "sine" | "square" | "triangle";

type SoundWaveLabProps = {
  language: Language;
  onBack: () => void;
  onBackToDetails?: () => void;
};

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

const waveformLabels: Record<WaveformType, Record<Language, string>> = {
  sine: { zh: "正弦波", en: "Sine wave" },
  square: { zh: "方波", en: "Square wave" },
  triangle: { zh: "三角波", en: "Triangle wave" }
};

function createLabWavePath(
  waveform: WaveformType,
  amplitude: number,
  frequency: number,
  phase: number
) {
  const width = 680;
  const midY = 160;
  const drawAmplitude = amplitude * 110;
  const cycles = frequency * 0.01;
  const phaseRadians = phase * Math.PI;
  const points = Array.from({ length: 801 }, (_, index) => {
    const ratio = index / 800;
    const angle = ratio * Math.PI * 2 * cycles + phaseRadians;
    const x = 40 + ratio * width;
    let value = Math.sin(angle);

    if (waveform === "square") {
      value = value >= 0 ? 1 : -1;
    }

    if (waveform === "triangle") {
      value = (2 / Math.PI) * Math.asin(Math.sin(angle));
    }

    const y = midY - value * drawAmplitude;
    return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
  });

  return points.join(" ");
}

export function SoundWaveLab({ language, onBack, onBackToDetails }: SoundWaveLabProps) {
  const [waveform, setWaveform] = useState<WaveformType>("sine");
  const [amplitude, setAmplitude] = useState(0.6);
  const [frequency, setFrequency] = useState(440);
  const [phase, setPhase] = useState(0);
  const [compare, setCompare] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<{
    context: AudioContext;
    oscillator: OscillatorNode;
    gain: GainNode;
  } | null>(null);

  const path = useMemo(
    () => createLabWavePath(waveform, amplitude, frequency, phase),
    [amplitude, frequency, phase, waveform]
  );
  const phaseTerm = `${phase.toFixed(2)}π`;
  const formula = waveform === "sine"
    ? `x(t) = ${amplitude.toFixed(2)} · sin(2π · ${frequency}t + ${phaseTerm})`
    : waveform === "square"
      ? `x(t) = ${amplitude.toFixed(2)} · sgn(sin(2π · ${frequency}t + ${phaseTerm}))`
      : `x(t) = ${amplitude.toFixed(2)} · (2/π)asin(sin(2π · ${frequency}t + ${phaseTerm}))`;
  const periodMs = 1000 / frequency;
  const wavelengthM = 343 / frequency;
  const currentWaveLabel = waveformLabels[waveform][language];

  function stopAudio(updateState = true) {
    const activeAudio = audioRef.current;

    if (!activeAudio) {
      if (updateState) {
        setIsPlaying(false);
      }
      return;
    }

    audioRef.current = null;
    const stopTime = activeAudio.context.currentTime;

    try {
      activeAudio.gain.gain.cancelScheduledValues(stopTime);
    } catch {
      // Some test doubles and older browsers may not expose every AudioParam method.
    }

    activeAudio.gain.gain.setValueAtTime(0, stopTime);

    try {
      activeAudio.oscillator.stop(stopTime);
    } catch {
      // The oscillator can already be stopped when the user switches views.
    }

    try {
      activeAudio.oscillator.disconnect();
      activeAudio.gain.disconnect();
    } catch {
      // Disconnect is best-effort cleanup; closing the context still releases the graph.
    }

    void activeAudio.context.close();

    if (updateState) {
      setIsPlaying(false);
    }
  }

  function playAudio(nextWaveform = waveform) {
    stopAudio(false);
    const AudioContextConstructor = window.AudioContext ?? window.webkitAudioContext;

    if (!AudioContextConstructor) {
      setIsPlaying(false);
      return;
    }

    const context = new AudioContextConstructor();
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = nextWaveform;
    oscillator.frequency.setValueAtTime(frequency, context.currentTime);
    gain.gain.setValueAtTime(amplitude * 0.14, context.currentTime);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();

    audioRef.current = { context, oscillator, gain };
    setIsPlaying(true);
  }

  function handleWaveformChange(nextWaveform: WaveformType) {
    const wasPlaying = audioRef.current !== null;

    setWaveform(nextWaveform);

    if (wasPlaying) {
      playAudio(nextWaveform);
    }
  }

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    audioRef.current.oscillator.type = waveform;
    audioRef.current.oscillator.frequency.setValueAtTime(
      frequency,
      audioRef.current.context.currentTime
    );
    audioRef.current.gain.gain.setValueAtTime(
      amplitude * 0.14,
      audioRef.current.context.currentTime
    );
  }, [amplitude, frequency, waveform]);

  useEffect(() => () => stopAudio(false), []);

  return (
    <main className="sound-lab-page">
      <section className="sound-lab-hero" aria-labelledby="sound-lab-title">
        <div className="sound-lab-back-actions">
          <button className="sound-lab-back sound-lab-back-secondary" type="button" onClick={onBack}>
            {language === "zh" ? "返回知识库" : "Back to knowledge base"}
          </button>
          {onBackToDetails ? <button className="sound-lab-back" type="button" onClick={onBackToDetails}>
            <ArrowLeft size={18} aria-hidden="true" />
            {language === "zh" ? "返回详细内容" : "Back to detailed guide"}
          </button> : null}
        </div>
        <div>
          <span className="section-kicker">
            {language === "zh" ? "交互实验" : "Interactive lab"}
          </span>
          <h1 id="sound-lab-title">
            {language === "zh" ? "声音波形实验室" : "Sound Wave Lab"}
          </h1>
          <p>
            {language === "zh"
              ? "对照当前公式与波形，观察频率、振幅和相位分别改变什么。"
              : "Compare the current formula and waveform to observe what frequency, amplitude, and phase each change."}
          </p>
        </div>
      </section>

      <section
        aria-label={language === "zh" ? "声音波形实验台" : "Sound waveform workbench"}
        className="sound-lab-workbench"
      >
        <div className="sound-lab-visual">
          <div className="sound-lab-formula">
            <strong>
              {language === "zh" ? "当前波形：" : "Current waveform: "}
              {currentWaveLabel}
            </strong>
            <code>{formula}</code>
            <span className="sound-lab-derived">T = {periodMs.toFixed(2)} ms · λ ≈ {wavelengthM.toFixed(3)} m</span>
          </div>
          <svg
            aria-label={language === "zh" ? "当前声音波形图" : "Current sound waveform"}
            role="img"
            viewBox="0 0 760 340"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="labWaveLine" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#7ee7d8" />
                <stop offset="100%" stopColor="#f0b46a" />
              </linearGradient>
            </defs>
            <rect className="lab-diagram-bg" height="340" rx="14" width="760" />
            <line className="lab-axis" x1="40" x2="720" y1="160" y2="160" />
            <line className="lab-axis faint" x1="40" x2="720" y1="50" y2="50" />
            <line className="lab-axis faint" x1="40" x2="720" y1="270" y2="270" />
            {compare && <path className="sound-lab-reference" d={createLabWavePath("sine", 0.6, 440, 0)} />}
            <path className="lab-wave-path" d={path} />
            {[1, 0, -1].map(value => <text key={value} className="lab-label" x="32" y={164 - value * 110} textAnchor="end">{value}</text>)}
            {[0, 2, 4, 6, 8, 10].map(ms => <text key={ms} className="lab-label" x={40 + ms * 68} y="290" textAnchor="middle">{ms}</text>)}
            <line
              className="lab-measure"
              x1="40"
              x2={(40 + 68 * periodMs).toFixed(2)}
              y1="300"
              y2="300"
            />
            <text className="lab-label" x="40" y="328">
              {language === "zh" ? "周期 T（时间）" : "Period T (time)"}
            </text>
          </svg>
          <div className="sound-lab-comparison">
            <p>{language === "zh" ? "横轴：时间（ms），固定 0–10 ms；纵轴：归一化幅度 x(t)，不是实测 Pa 或 dBSPL。" : "Horizontal: time (ms), fixed at 0–10 ms. Vertical: normalized amplitude x(t), not measured Pa or dBSPL."}</p>
            <label><input type="checkbox" checked={compare} onChange={event => setCompare(event.target.checked)} />{language === "zh" ? "显示原始状态（虚线）：正弦波 · 440 Hz · A 0.60 · φ 0" : "Original (dashed): sine · 440 Hz · A 0.60 · φ 0"}</label>
            <p>{language === "zh" ? `当前：${(frequency * 0.01).toFixed(1)} 个周期 / 10 ms；峰值 ±${amplitude.toFixed(2)}。实线为当前状态。` : `Current: ${(frequency * 0.01).toFixed(1)} cycles / 10 ms; peak ±${amplitude.toFixed(2)}. Solid line shows the current state.`}</p>
          </div>
        </div>

        <div className="sound-lab-panel">
          <div
            aria-label={language === "zh" ? "波形类型" : "Waveform type"}
            className="waveform-tabs"
            role="group"
          >
            {(Object.keys(waveformLabels) as WaveformType[]).map((type) => (
              <button
                className={waveform === type ? "waveform-tab active" : "waveform-tab"}
                key={type}
                type="button"
                onClick={() => handleWaveformChange(type)}
              >
                {waveformLabels[type][language]}
              </button>
            ))}
          </div>

          <div className="sound-lab-actions">
            <button className="sine-button" type="button" onClick={() => playAudio()}>
              <Play size={16} aria-hidden="true" />
              {language === "zh" ? "播放" : "Play"}
            </button>
            <button className="sine-button" type="button" onClick={() => stopAudio()}>
              <Pause size={16} aria-hidden="true" />
              {language === "zh" ? "停止" : "Stop"}
            </button>
            <button className="sine-button" type="button" onClick={() => { stopAudio(); setWaveform("sine"); setAmplitude(0.6); setFrequency(440); setPhase(0); }}>
              <RotateCcw size={16} aria-hidden="true" />{language === "zh" ? "重置" : "Reset"}
            </button>
            <span className={isPlaying ? "sine-status playing" : "sine-status"}>
              {isPlaying ? (language === "zh" ? "播放中" : "Playing") : language === "zh" ? "未播放" : "Stopped"}
            </span>
          </div>

          <div className="lab-sliders">
            <label>
              <span>
                {language === "zh" ? "频率" : "Frequency"}
                <strong>{frequency} Hz</strong>
              </span>
              <input
                aria-label={language === "zh" ? "频率" : "Frequency"}
                max="880"
                min="110"
                step="10"
                type="range"
                value={frequency}
                onChange={(event) => setFrequency(Number(event.target.value))}
              />
            </label>
            <label>
              <span>
                {language === "zh" ? "振幅" : "Amplitude"}
                <strong>{amplitude.toFixed(2)}</strong>
              </span>
              <input
                aria-label={language === "zh" ? "振幅" : "Amplitude"}
                max="1"
                min="0.1"
                step="0.05"
                type="range"
                value={amplitude}
                onChange={(event) => setAmplitude(Number(event.target.value))}
              />
            </label>
            <label>
              <span>
                {language === "zh" ? "相位" : "Phase"}
                <strong>{phase.toFixed(2)}π</strong>
              </span>
              <input
                aria-label={language === "zh" ? "相位" : "Phase"}
                max="2"
                min="-2"
                step="0.05"
                type="range"
                value={phase}
                onChange={(event) => setPhase(Number(event.target.value))}
              />
            </label>
          </div>

          <div className="lab-live-note">
            {language === "zh"
              ? `当前周期 ${periodMs.toFixed(2)} ms，空气中波长约 ${wavelengthM.toFixed(3)} m。频率与振幅彼此独立；相位滑块只移动图中的起点，单独持续纯音通常听不出绝对相位变化。`
              : `The current period is ${periodMs.toFixed(2)} ms and the wavelength in air is about ${wavelengthM.toFixed(3)} m. Frequency and amplitude are independent; the phase slider shifts the plotted start, while absolute phase is usually inaudible for one sustained tone.`}
          </div>
        </div>
      </section>

    </main>
  );
}
