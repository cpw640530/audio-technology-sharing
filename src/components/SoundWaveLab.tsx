import { traditional } from "../content/traditional";
import { text } from "../content/language";
import { useLabState } from "../hooks/useLabState";
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
  sine: { zh: "正弦波", "zh-Hant": traditional("正弦波"), en: "Sine wave", ja: "正弦波", ko: "정현파" },
  square: { zh: "方波", "zh-Hant": traditional("方波"), en: "Square wave", ja: "矩形波", ko: "구형파" },
  triangle: { zh: "三角波", "zh-Hant": traditional("三角波"), en: "Triangle wave", ja: "三角波", ko: "삼각파" }
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
  const [waveform, setWaveform] = useLabState<WaveformType>(
    "SoundWaveLab.waveform",
    "sine",
    (value): value is WaveformType => value === "sine" || value === "square" || value === "triangle"
  );
  const [amplitude, setAmplitude] = useLabState(
    "SoundWaveLab.amplitude",
    0.6,
    (value): value is number => typeof value === "number" && Number.isFinite(value) && value >= 0.1 && value <= 1 && Math.abs((value - 0.1) / 0.05 - Math.round((value - 0.1) / 0.05)) < 1e-9
  );
  const [frequency, setFrequency] = useLabState(
    "SoundWaveLab.frequency",
    440,
    (value): value is number => typeof value === "number" && Number.isFinite(value) && Number.isInteger(value) && value >= 110 && value <= 880 && (value - 110) % 10 === 0
  );
  const [phase, setPhase] = useLabState(
    "SoundWaveLab.phase",
    0,
    (value): value is number => typeof value === "number" && Number.isFinite(value) && value >= -2 && value <= 2 && Math.abs((value + 2) / 0.05 - Math.round((value + 2) / 0.05)) < 1e-9
  );
  const [compare, setCompare] = useLabState(
    "SoundWaveLab.compare",
    true,
    (value): value is boolean => typeof value === "boolean"
  );
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
            {text(language, "返回知识库", "Back to knowledge base", "知識ベースに戻る", "지식 모음으로 돌아가기")}
          </button>
          {onBackToDetails ? <button className="sound-lab-back" type="button" onClick={onBackToDetails}>
            <ArrowLeft size={18} aria-hidden="true" />
            {text(language, "返回详细内容", "Back to detailed guide", "詳しい解説に戻る", "상세 설명으로 돌아가기")}
          </button> : null}
        </div>
        <div>
          <span className="section-kicker">
            {text(language, "交互实验", "Interactive lab", "インタラクティブ実験", "인터랙티브 실험")}
          </span>
          <h1 id="sound-lab-title">
            {text(language, "声音波形实验室", "Sound Wave Lab", "音の波形実験室", "소리 파형 실험실")}
          </h1>
          <p>
            {text(language, "对照当前公式与波形，观察频率、振幅和相位分别改变什么。", "Compare the current formula and waveform to observe what frequency, amplitude, and phase each change.", "式と波形を見比べ、周波数・振幅・位相がそれぞれ何を変えるか確かめましょう。", "현재 수식과 파형을 비교하며 주파수, 진폭, 위상이 각각 무엇을 바꾸는지 관찰하세요.")}
          </p>
        </div>
      </section>

      <section
        aria-label={text(language, "声音波形实验台", "Sound waveform workbench", "音の波形実験台", "소리 파형 실험대")}
        className="sound-lab-workbench"
      >
        <div className="sound-lab-visual">
          <div className="sound-lab-formula">
            <strong>
              {text(language, "当前波形：", "Current waveform: ", "現在の波形：", "현재 파형: ")}
              {currentWaveLabel}
            </strong>
            <code>{formula}</code>
            <span className="sound-lab-derived">T = {periodMs.toFixed(2)} ms · λ ≈ {wavelengthM.toFixed(3)} m</span>
          </div>
          <svg
            aria-label={text(language, "当前声音波形图", "Current sound waveform", "現在の音の波形", "현재 소리 파형")}
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
              {text(language, "周期 T（时间）", "Period T (time)", "周期 T（時間）", "주기 T (시간)")}
            </text>
          </svg>
          <div className="sound-lab-comparison">
            <p>{text(language, "横轴：时间（ms），固定 0–10 ms；纵轴：归一化幅度 x(t)，不是实测 Pa 或 dBSPL。", "Horizontal: time (ms), fixed at 0–10 ms. Vertical: normalized amplitude x(t), not measured Pa or dBSPL.", "横軸は時間（ms）で 0–10 ms に固定。縦軸は正規化振幅 x(t) で、実測の Pa や dBSPL ではありません。", "가로축은 시간(ms)이며 0–10 ms로 고정됩니다. 세로축은 정규화 진폭 x(t)이며 실측 Pa 또는 dBSPL이 아닙니다.")}</p>
            <label><input type="checkbox" checked={compare} onChange={event => setCompare(event.target.checked)} />{text(language, "显示原始状态（虚线）：正弦波 · 440 Hz · A 0.60 · φ 0", "Original (dashed): sine · 440 Hz · A 0.60 · φ 0", "初期状態（破線）：正弦波 · 440 Hz · A 0.60 · φ 0", "초기 상태(점선): 정현파 · 440 Hz · A 0.60 · φ 0")}</label>
            <p>{text(language,
              `当前：${(frequency * 0.01).toFixed(1)} 个周期 / 10 ms；峰值 ±${amplitude.toFixed(2)}。实线为当前状态。`,
              `Current: ${(frequency * 0.01).toFixed(1)} cycles / 10 ms; peak ±${amplitude.toFixed(2)}. Solid line shows the current state.`,
              `現在：10 ms に ${(frequency * 0.01).toFixed(1)} 周期、ピーク ±${amplitude.toFixed(2)}。実線は現在の状態です。`,
              `현재: 10 ms에 ${(frequency * 0.01).toFixed(1)}주기, 최댓값 ±${amplitude.toFixed(2)}. 실선은 현재 상태입니다.`
            )}</p>
          </div>
        </div>

        <div className="sound-lab-panel">
          <div
            aria-label={text(language, "波形类型", "Waveform type", "波形の種類", "파형 종류")}
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
              {text(language, "播放", "Play", "再生", "재생")}
            </button>
            <button className="sine-button" type="button" onClick={() => stopAudio()}>
              <Pause size={16} aria-hidden="true" />
              {text(language, "停止", "Stop", "停止", "정지")}
            </button>
            <button className="sine-button" type="button" onClick={() => { stopAudio(); setWaveform("sine"); setAmplitude(0.6); setFrequency(440); setPhase(0); }}>
              <RotateCcw size={16} aria-hidden="true" />{text(language, "重置", "Reset", "リセット", "초기화")}
            </button>
            <span className={isPlaying ? "sine-status playing" : "sine-status"}>
              {isPlaying ? (text(language, "播放中", "Playing", "再生中", "재생 중")) : text(language, "未播放", "Stopped", "停止中", "정지됨")}
            </span>
          </div>

          <div className="lab-sliders">
            <label>
              <span>
                {text(language, "频率", "Frequency", "周波数", "주파수")}
                <strong>{frequency} Hz</strong>
              </span>
              <input
                aria-label={text(language, "频率", "Frequency", "周波数", "주파수")}
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
                {text(language, "振幅", "Amplitude", "振幅", "진폭")}
                <strong>{amplitude.toFixed(2)}</strong>
              </span>
              <input
                aria-label={text(language, "振幅", "Amplitude", "振幅", "진폭")}
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
                {text(language, "相位", "Phase", "位相", "위상")}
                <strong>{phase.toFixed(2)}π</strong>
              </span>
              <input
                aria-label={text(language, "相位", "Phase", "位相", "위상")}
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
            {text(language,
              `当前周期 ${periodMs.toFixed(2)} ms，空气中波长约 ${wavelengthM.toFixed(3)} m。频率与振幅彼此独立；相位滑块只移动图中的起点，单独持续纯音通常听不出绝对相位变化。`,
              `The current period is ${periodMs.toFixed(2)} ms and the wavelength in air is about ${wavelengthM.toFixed(3)} m. Frequency and amplitude are independent; the phase slider shifts the plotted start, while absolute phase is usually inaudible for one sustained tone.`,
              `周期は ${periodMs.toFixed(2)} ms、空気中の波長は約 ${wavelengthM.toFixed(3)} m です。周波数と振幅は独立です。位相スライダーは図の開始位置を変えますが、持続する単一の純音では通常、絶対位相の違いは聴き分けられません。`,
              `현재 주기는 ${periodMs.toFixed(2)} ms, 공기 중 파장은 약 ${wavelengthM.toFixed(3)} m입니다. 주파수와 진폭은 서로 독립적입니다. 위상 슬라이더는 그래프 시작 위치만 바꾸며, 하나의 지속적인 순음에서는 보통 절대 위상 차이를 구별할 수 없습니다.`
            )}
          </div>
        </div>
      </section>

    </main>
  );
}
