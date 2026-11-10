import { useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import type { Language } from "../content/knowledge";
import { text } from "../content/language";
import { animationLoop } from "./animationLoop";

type Tone = { frequency: number; amplitude: number; phase: number };
const initial: Tone[] = [{ frequency: 2, amplitude: .6, phase: 0 }, { frequency: 5, amplitude: .3, phase: 0 }, { frequency: 8, amplitude: .1, phase: 90 }];
const colors = ["#227a70", "#ab501e", "#695095"];

// Fixed one-second rectangular record: integer-Hz tones align with the DFT bins.
export function analyzeTones(tones: Tone[]) {
  const samples = Array.from({ length: 128 }, (_, n) => tones.reduce((sum, tone) => sum + tone.amplitude * Math.sin(2 * Math.PI * tone.frequency * n / 128 + tone.phase * Math.PI / 180), 0));
  const bins = Array.from({ length: 65 }, (_, k) => {
    const re = samples.reduce((sum, x, n) => sum + x * Math.cos(2 * Math.PI * k * n / 128), 0);
    const im = samples.reduce((sum, x, n) => sum - x * Math.sin(2 * Math.PI * k * n / 128), 0);
    return { re, im, amplitude: Math.hypot(re, im) * (k === 0 || k === 64 ? 1 : 2) / 128, phase: Math.atan2(im, re) * 180 / Math.PI };
  });
  return { samples, bins };
}

export function FourierExplorer({ language }: { language: Language }) {
  const t = (zh: string, en: string, ja: string, ko: string) => text(language, zh, en, ja, ko);
  const [tones, setTones] = useState(initial);
  const [bin, setBin] = useState(2);
  const [playing, setPlaying] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const { bins } = useMemo(() => analyzeTones(tones), [tones]);
  useEffect(() => {
    if (!playing || !root.current) return;
    let elapsed = 0;
    const animation = animationLoop(root.current, delta => {
      elapsed += delta;
      if (elapsed >= .7) { elapsed %= .7; setBin(value => value >= 12 ? 0 : value + 1); }
    });
    return () => animation.dispose();
  }, [playing]);
  const update = (index: number, key: keyof Tone, value: number) => setTones(previous => previous.map((tone, i) => i === index ? { ...tone, [key]: value } : tone));
  const curve = (values: number[], center: number, scale: number) => values.map((v, n) => `${n ? "L" : "M"}${48 + n / (values.length - 1) * 544},${center - v * scale}`).join(" ");
  const current = bins[bin];
  return <div ref={root} className="nyquist-explorer fourier-explorer" role="region" aria-label={t("傅里叶交互图解", "Fourier explorer", "フーリエ実験", "푸리에 탐구")}>
    <h3>{t("先合成，再用正弦与余弦找回分量", "Build a wave, then recover its components", "合成してから成分を取り出す", "파형을 합성한 뒤 성분 찾기")}</h3>
    <code>x(t) = Σ Aᵢ sin(2πfᵢt + φᵢ)</code>
    {tones.map((tone, i) => <fieldset key={i} className="fourier-tone"><legend style={{ color: colors[i] }}>{t("分量", "Component", "成分", "성분")} {String.fromCharCode(65 + i)}</legend><div className="nyquist-controls">
      <label>{t("频率", "Frequency", "周波数", "주파수")} {String.fromCharCode(65 + i)} · {tone.frequency} Hz<input type="range" min="1" max="12" step="1" value={tone.frequency} onChange={e => update(i, "frequency", Number(e.target.value))}/></label>
      <label>{t("振幅", "Amplitude", "振幅", "진폭")} {String.fromCharCode(65 + i)} · {tone.amplitude.toFixed(2)}<input type="range" min="0" max="1" step="0.05" value={tone.amplitude} onChange={e => update(i, "amplitude", Number(e.target.value))}/></label>
      <label>{t("相位", "Phase", "位相", "위상")} {String.fromCharCode(65 + i)} · {tone.phase}°<input type="range" min="0" max="360" step="15" value={tone.phase} onChange={e => update(i, "phase", Number(e.target.value))}/></label>
    </div></fieldset>)}
    <figure><figcaption>{t("时间域：彩色分量 → 深色总和", "Time domain: colored components → dark sum", "時間領域：各色の成分 → 濃色の和", "시간 영역: 색상별 성분 → 진한 합성파")}</figcaption>
      <svg viewBox="0 0 640 250" role="img" aria-label={t("三个分量及其合成波形", "Three components and their sum", "3成分と合成波形", "세 성분과 합성 파형")}>
        {[-3, 0, 3].map(v => <g key={v}><line x1="48" x2="592" y1={110 - v * 28} y2={110 - v * 28} stroke="#bbcfc5"/><text x="34" y={115 - v * 28} textAnchor="end">{v}</text></g>)}
        {tones.map((tone, i) => <path key={i} d={curve(Array.from({ length: 513 }, (_, n) => tone.amplitude * Math.sin(2 * Math.PI * tone.frequency * n / 512 + tone.phase * Math.PI / 180)), 110, 28)} fill="none" stroke={colors[i]} strokeWidth="1.5" strokeDasharray="5 3"/>)}
        <path data-testid="fourier-sum" d={curve(Array.from({ length: 513 }, (_, n) => tones.reduce((sum, tone) => sum + tone.amplitude * Math.sin(2 * Math.PI * tone.frequency * n / 512 + tone.phase * Math.PI / 180), 0)), 110, 28)} fill="none" stroke="#183f35" strokeWidth="2.5"/>
        {[0, .25, .5, .75, 1].map(v => <text key={v} x={48 + v * 544} y="226" textAnchor="middle">{v} s</text>)}
      </svg>
      <p>{t("横轴时间 0–1 s，纵轴相对幅度 ±3，刻度固定；没有自动放大或削波。虚线 A/B/C 对应上方颜色，深色实线是同一时刻的代数和。", "X: 0–1 s; Y: relative amplitude ±3, fixed scale, no auto-gain or clipping. Dashed A/B/C follow the control colors; the dark solid curve is their pointwise sum.", "横軸0–1秒、縦軸相対振幅±3で固定。自動拡大やクリップはありません。破線A/B/Cの和が濃色の実線です。", "가로축 0–1초, 세로축 상대 진폭 ±3으로 고정하며 자동 확대나 클리핑이 없습니다. 점선 A/B/C의 점별 합이 진한 실선입니다.")}</p>
    </figure>
    <figure><figcaption>{t("频域：从实际样本算出的单边幅度谱", "Frequency domain: one-sided amplitude from actual samples", "標本から計算した片側振幅スペクトル", "실제 샘플로 계산한 단측 진폭 스펙트럼")}</figcaption>
      <svg viewBox="0 0 640 245" role="img" aria-label={t("DFT 幅度谱", "DFT amplitude spectrum", "DFT振幅スペクトル", "DFT 진폭 스펙트럼")}>
        {[0, 1, 2, 3].map(v => <g key={v}><line x1="48" x2="592" y1={180 - v * 48} y2={180 - v * 48} stroke="#bbcfc5"/><text x="34" y={185 - v * 48} textAnchor="end">{v}</text></g>)}
        {bins.slice(0, 13).map((value, k) => <g key={k}><rect data-testid="fourier-bin" x={48 + k * 44 - 5} y={180 - value.amplitude * 48} width="10" height={value.amplitude * 48} fill={bin === k ? "#ab501e" : "#227a70"}/><text x={48 + k * 44} y="211" textAnchor="middle">{k}</text></g>)}
        <line x1={48 + bin * 44} x2={48 + bin * 44} y1="25" y2="180" stroke="#ab501e" strokeDasharray="4 4"/>
        <text x="320" y="237" textAnchor="middle">Hz</text>
      </svg>
      <p>{t("显示 0–12 Hz；完整 DFT 覆盖 0–64 Hz。纵轴是正弦峰值幅度，不是能量或 dB。能量与幅度平方有关：整数周期纯正弦的均方值为 A²/2。", "Display: 0–12 Hz; the full DFT covers 0–64 Hz. Y is peak sinusoidal amplitude, not energy or dB. Energy depends on amplitude squared: an integer-cycle sine has mean square A²/2.", "表示は0–12 Hz、全DFTは0–64 Hz。縦軸は正弦波のピーク振幅でエネルギーやdBではありません。整数周期の正弦波の平均二乗はA²/2です。", "표시는 0–12 Hz, 전체 DFT는 0–64 Hz입니다. 세로축은 에너지나 dB가 아닌 정현파 피크 진폭입니다. 정수 주기 정현파의 평균 제곱은 A²/2입니다.")}</p>
    </figure>
    <label>{t("正在检测的频率格", "Frequency bin to inspect", "調べる周波数ビン", "검사할 주파수 빈")} · {bin} Hz<input type="range" min="0" max="12" step="1" value={bin} onChange={e => { setPlaying(false); setBin(Number(e.target.value)); }}/></label>
    <div className="robot-buttons"><button aria-label={playing ? t("暂停频率扫描", "Pause frequency scan", "走査を停止", "주파수 스캔 일시 정지") : t("播放频率扫描", "Play frequency scan", "走査を再生", "주파수 스캔 재생")} onClick={() => setPlaying(v => !v)}>{playing ? <Pause size={18}/> : <Play size={18}/>}</button><button aria-label={t("重置傅里叶演示", "Reset Fourier explorer", "フーリエをリセット", "푸리에 초기화")} onClick={() => { setTones(initial); setBin(2); setPlaying(false); }}><RotateCcw size={18}/></button></div>
    <div className="nyquist-readout" aria-live="polite"><code>N = 128 · fₛ = 128 Hz · Δf = 1 Hz</code><code>Re X[{bin}] = {current.re.toFixed(2)}</code><code>Im X[{bin}] = {current.im.toFixed(2)}</code><code>A = {current.amplitude.toFixed(3)}</code><code>φcos = {current.amplitude < 1e-8 ? "—" : `${current.phase.toFixed(1)}°`}</code></div>
    <h3>{t("为什么乘一乘、加一加就能找频率？", "Why does multiplying and summing find a frequency?", "なぜ積と和で周波数が分かる？", "곱하고 더하면 왜 주파수를 찾을까요?")}</h3>
    <code>X[k] = Σ x[n](cos(2πkn/N) − j sin(2πkn/N))</code>
    <p>{t("把 128 个样本与某个频率的余弦、正弦分别相乘求和。同频分量会累积，不同整数频率在这一秒内正负抵消，这叫正交投影。只测正弦会漏掉相差 90° 的成分，因此要测两路；Re 和 Im 合起来才确定幅度与相位。橙色扫描线只是依次查看计算结果，不是声音随时间改变频率。", "Multiply the 128 samples by a cosine and a sine at each bin, then sum. Matching components accumulate; different integer frequencies cancel over this second: orthogonal projection. A sine alone misses a component shifted by 90°, so both are needed. Re and Im determine amplitude and phase. The orange scan inspects results; it does not change the sound's frequency over time.", "128標本を各ビンの余弦と正弦に掛けて足します。同周波数は累積し、異なる整数周波数は1秒間で相殺します。これが直交射影です。90°ずれた成分も検出するため両方が必要です。橙の走査は計算結果の確認で、音の周波数変化ではありません。", "128개 샘플을 각 빈의 코사인과 사인에 곱해 더합니다. 같은 주파수는 누적되고 다른 정수 주파수는 1초 동안 상쇄되는 직교 투영입니다. 90° 다른 성분도 찾으려면 두 값이 필요합니다. 주황 스캔은 결과 확인이지 소리 주파수 변화가 아닙니다.")}</p>
    <h3>{t("试一试：相位变了，为何谱峰不动？", "Try it: why can phase change without moving a peak?", "位相を変えてもピークが動かない理由", "위상이 바뀌어도 피크가 움직이지 않는 이유")}</h3>
    <p>{t("保持三个频率不同，只改 B 的相位：总波形会变，幅度谱不变，但 Re、Im 与相位读数会变。这里输入用正弦，DFT 相位按余弦为基准，所以单个正弦的 0° 对应谱相位 −90°。再把 A、B 设成同频且等振幅，B 相位设为 180°：两者抵消，谱峰也消失。同频分量是复数相加，不是振幅直接相加。接近零的谱峰没有可靠相位。", "Keep all frequencies distinct and change B's phase: the waveform changes but the amplitude spectrum does not; Re, Im and phase do. Inputs use sine, while DFT phase uses cosine, so a 0° sine gives −90° spectral phase. Give A and B equal frequency and amplitude, then set B to 180°: they cancel, including their spectral peak. Same-frequency components add as complex values, not scalar amplitudes. Near-zero peaks have no reliable phase.", "周波数を別々に保ちBの位相だけ変えると、波形は変わっても振幅スペクトルは変わりません。DFTは余弦基準なので0°の正弦は−90°です。AとBを同周波数・同振幅で180°ずらすと相殺します。同周波数は振幅ではなく複素数として加算します。ゼロ付近の位相は不定です。", "주파수를 서로 다르게 유지하고 B 위상만 바꾸면 파형은 바뀌어도 진폭 스펙트럼은 그대로입니다. DFT는 코사인 기준이므로 0° 사인은 −90°입니다. A와 B를 같은 주파수·진폭에 180° 차이로 두면 상쇄됩니다. 같은 주파수는 진폭이 아닌 복소수로 더합니다. 영점 근처 위상은 불확정입니다.")}</p>
    <p>{t("模型边界：固定 1 秒矩形窗、128 个样本、整数 Hz，专门让分量对齐频率格。真实录音常含非整数周期，会出现谱泄漏；加窗会改变峰宽与幅度标定。Δf = fₛ/N 是格间距，不等于任意两音都能分开的保证；补零也不增加真实分辨能力。FFT 是 DFT 的快速算法，STFT 则对连续短帧重复计算；深入交互见基础信号处理卡片。", "Model limits: one-second rectangular window, 128 samples, integer Hz deliberately aligned to bins. Real recordings often have noninteger cycles and spectral leakage; windows alter peak width and amplitude calibration. Δf = fₛ/N is bin spacing, not a guarantee of separating any two tones; zero-padding adds no true resolving power. FFT computes the DFT faster; STFT repeats it on short frames. See Basic Signal Processing for deeper experiments.", "固定1秒・矩形窓・128標本・整数Hzでビンに一致させています。実録音では漏れが生じ、窓はピーク幅や振幅補正に影響します。Δfはビン間隔で、分離能力の保証ではありません。ゼロ詰めも真の分解能を増やしません。FFTは高速DFT、STFTは短いフレームでの反復です。", "1초 직사각 창, 128개 샘플, 정수 Hz로 빈에 맞춘 모델입니다. 실제 녹음에는 누설이 생기며 창은 피크 폭과 진폭 보정에 영향을 줍니다. Δf는 빈 간격이지 두 음 분리 보장이 아니며 제로 패딩도 실제 분해 능력을 늘리지 않습니다. FFT는 빠른 DFT, STFT는 짧은 프레임별 반복입니다.")}</p>
    <a href="https://www.dspguide.com/ch8/6.htm" target="_blank" rel="noreferrer">DSP Guide · {t("用相关计算 DFT", "Calculating the DFT by correlation", "相関によるDFT", "상관으로 DFT 계산")}</a>
  </div>;
}
