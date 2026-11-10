import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import type { Language } from "../content/knowledge";
import { text } from "../content/language";
import { animationLoop } from "./animationLoop";

// Signed baseband representative preserves sample phase, including folded tones.
export function sampledTone(frequency: number, rate: number, phase: number) {
  const folded = frequency - Math.floor(frequency / rate + .5) * rate;
  const value = (time: number, f = frequency) => Math.sin(2 * Math.PI * f * time + phase);
  return { folded, value, samples: Array.from({ length: Math.floor(rate) + 1 }, (_, n) => ({ time: n / rate, value: value(n / rate) })) };
}

export function NyquistExplorer({ language }: { language: Language }) {
  const t = (zh: string, en: string, ja: string, ko: string) => text(language, zh, en, ja, ko);
  const [frequency, setFrequency] = useState(2);
  const [rate, setRate] = useState(3);
  const [phase, setPhase] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(1);
  const root = useRef<HTMLDivElement>(null);
  const tone = sampledTone(frequency, rate, phase * Math.PI / 180);
  const boundary = Math.abs(frequency - rate / 2) < 1e-8;
  const aliased = frequency > rate / 2;
  useEffect(() => {
    if (!playing || !root.current) return;
    const animation = animationLoop(root.current, delta => { if (delta) setTime(v => Math.min(1, v + delta / 4)); });
    return () => animation.dispose();
  }, [playing]);
  useEffect(() => { if (time >= 1) setPlaying(false); }, [time]);
  const configure = (f: number, fs: number, p = 0) => { setFrequency(f); setRate(fs); setPhase(p); setTime(1); setPlaying(false); };
  const path = (f: number) => Array.from({ length: 601 }, (_, i) => `${i ? "L" : "M"}${48 + i / 600 * 544},${100 - tone.value(i / 600, f) * 60}`).join(" ");
  return <div ref={root} role="region" className="nyquist-explorer" aria-label={t("采样与混叠交互图解", "Sampling and aliasing explorer", "標本化と折り返しの実験", "샘플링과 에일리어싱 탐구")}>
    <h3>{t("只拿到采样点，还能认出原来的频率吗？", "Can samples identify the original frequency?", "標本点だけで元の周波数は分かる？", "샘플만으로 원래 주파수를 알 수 있을까요?")}</h3>
    <p>{t("采样就像按固定间隔拍照：记录的是瞬间幅度，不是这段时间的平均值。先看默认的 2 Hz 与 3 Hz，再试下面三个边界案例。", "Sampling takes snapshots at fixed intervals: instantaneous amplitudes, not interval averages. Start with 2 Hz at 3 samples/s, then compare the three cases.", "標本化は一定間隔の撮影のように、平均でなく瞬間の振幅を記録します。2 Hz を毎秒3点で観察し、3つの例を比較します。", "샘플링은 고정 간격 촬영처럼 구간 평균이 아닌 순간 진폭을 기록합니다. 2 Hz를 초당 3점으로 관찰한 뒤 세 사례를 비교하세요.")}</p>
    <div className="robot-buttons"><button onClick={() => configure(2, 8)}>{t("充分采样", "Adequate", "十分な標本化", "충분한 샘플링")}</button><button onClick={() => configure(2, 4)}>{t("恰好两倍", "Exactly twice", "ちょうど2倍", "정확히 두 배")}</button><button onClick={() => configure(2, 3)}>{t("发生混叠", "Aliasing", "折り返し", "에일리어싱")}</button></div>
    <div className="nyquist-controls">
      <label>{t("输入频率", "Input frequency", "入力周波数", "입력 주파수")} · {frequency} Hz<input type="range" min="0.5" max="12" step="0.5" value={frequency} onChange={e => configure(Number(e.target.value), rate, phase)}/></label>
      <label>{t("采样率", "Sample rate", "標本化周波数", "샘플레이트")} · {rate} samples/s<input type="range" min="2" max="24" step="1" value={rate} onChange={e => configure(frequency, Number(e.target.value), phase)}/></label>
      <label>{t("初相位", "Initial phase", "初期位相", "초기 위상")} · {phase}°<input type="range" min="0" max="360" step="15" value={phase} onChange={e => configure(frequency, rate, Number(e.target.value))}/></label>
    </div>
    <div className="nyquist-readout" aria-live="polite"><code>Δt = 1/fₛ = {(1000 / rate).toFixed(2)} ms</code><code>fN = {rate / 2} Hz</code><code>fₛ/f = {(rate / frequency).toFixed(2)} samples/cycle</code><strong>{boundary ? t("临界：不能保证恢复", "Boundary: recovery not guaranteed", "境界：復元保証なし", "경계: 복원 보장 없음") : aliased ? t("混叠：不同波形给出相同样本", "Aliasing: different waves, identical samples", "折り返し：異なる波形で同じ標本", "에일리어싱: 다른 파형, 같은 샘플") : t("带限假设下可恢复", "Recoverable under the band-limit assumption", "帯域制限の仮定で復元可能", "대역 제한 가정에서 복원 가능")}</strong></div>
    <figure>
      <figcaption>{t("固定 1 秒窗口：波形与采样点", "Fixed 1-second window: waveforms and samples", "固定1秒窓：波形と標本点", "고정 1초 창: 파형과 샘플")}</figcaption>
      <svg viewBox="0 0 640 220" role="img" aria-label={t("不足采样产生混叠与足够采样的对比", "Undersampling aliasing compared with adequate sampling", "標本化不足の折り返しと十分な標本化の比較", "불충분한 샘플링의 에일리어싱과 충분한 샘플링 비교")}>
        {[-1, 0, 1].map(v => <g key={v}><line x1="48" x2="592" y1={100 - v * 60} y2={100 - v * 60} stroke="#bbcfc5"/><text x="32" y={105 - v * 60} textAnchor="end">{v}</text></g>)}
        {[0, .25, .5, .75, 1].map(v => <text key={v} x={48 + v * 544} y="193" textAnchor="middle">{v} s</text>)}
        <path d={path(frequency)} fill="none" stroke="#227a70" strokeWidth="2" strokeDasharray="7 4"/>
        {(aliased || boundary) && <path d={path(tone.folded)} fill="none" stroke="#a94d1d" strokeWidth="2"/>}
        {tone.samples.filter(p => p.time <= time + 1e-8).map((p, n) => <g key={n}><line x1={48 + p.time * 544} x2={48 + p.time * 544} y1="100" y2={100 - p.value * 60} stroke="#526b60"/><circle data-testid="nyquist-sample" cx={48 + p.time * 544} cy={100 - p.value * 60} r="4" fill="#183f35"/></g>)}
        <line x1={48 + time * 544} x2={48 + time * 544} y1="27" y2="165" stroke="#925b28" strokeDasharray="3 3"/>
      </svg>
      <p>{t("绿色虚线：原信号；黑点与竖线：采样值（不是保持输出）；橙线：同样经过全部采样点的基带候选。横轴时间，纵轴归一化幅度 ±1，所有参数共用固定刻度。", "Green dashed: source; black dots/stems: samples, not held output; orange: a baseband candidate through the same samples. X: time; Y: normalized amplitude ±1. All settings share fixed scales.", "緑の破線は元信号、黒点と縦線は標本値でホールド出力ではありません。橙は同じ標本を通る基底帯域候補。横軸は時間、縦軸は正規化振幅±1で尺度は固定です。", "녹색 점선은 원신호, 검은 점과 줄기는 유지 출력이 아닌 샘플입니다. 주황색은 같은 샘플을 지나는 기저대역 후보입니다. 가로 시간, 세로 정규화 진폭 ±1이며 축척은 고정입니다.")}</p>
    </figure>
    <div className="robot-buttons"><button onClick={() => { if (time >= 1) setTime(0); setPlaying(v => !v); }} aria-label={playing ? t("暂停采样动画", "Pause sampling animation", "標本化アニメ停止", "샘플링 애니메이션 일시 정지") : t("播放采样动画", "Play sampling animation", "標本化アニメ再生", "샘플링 애니메이션 재생")} title={t("逐点采样，不播放声音", "Reveal samples, no audio", "標本点表示・音声なし", "샘플 표시, 오디오 없음")}>{playing ? <Pause size={18}/> : <Play size={18}/>}</button><button onClick={() => configure(2, 3)} aria-label={t("重置采样演示", "Reset sampling explorer", "標本化をリセット", "샘플링 초기화")} title={t("重置", "Reset", "リセット", "초기화")}><RotateCcw size={18}/></button></div>
    <h3>{t("为什么两倍是边界，而不是保险线？", "Why is twice the frequency a boundary, not a safety margin?", "なぜ2倍は安全域でなく境界か", "왜 두 배는 안전 여유가 아니라 경계일까요?")}</h3>
    <p><code>x[n] = sin(2πfn/fₛ + φ)</code> · {t("选择“恰好两倍”且相位为 0°：每次都采到过零点，所有样本都是 0。把相位改成 90°，样本却成为 +1、−1。未知相位的任意输入，不能靠每周期两个点保证恢复。定理针对严格带限信号的完整样本序列，图中有限的一秒只是局部示意。", "At exactly twice with phase 0°, every sample hits a zero crossing. At 90°, they alternate +1 and −1. Two points per cycle cannot guarantee recovery for arbitrary unknown phase. The theorem assumes a strictly band-limited signal and its full sample sequence; this one-second window is only an excerpt.", "ちょうど2倍・位相0°では全標本がゼロ交差です。90°では+1と−1になります。未知位相に対して周期2点だけで復元は保証できません。定理は厳密に帯域制限された信号の全標本列を対象とし、1秒の図は一部分です。", "정확히 두 배이고 위상이 0°면 모든 샘플이 영점입니다. 90°면 +1과 −1이 번갈아 나옵니다. 미지 위상에 대해 주기당 두 점만으로 복원을 보장할 수 없습니다. 정리는 엄격히 대역 제한된 신호의 전체 샘플열을 가정하며 1초 그림은 일부입니다.")}</p>
    <p>{t("换到频域看：理想冲激采样会把原频谱每隔 fₛ 重复一次。带限于 −fmax 到 +fmax 的频谱宽度是 2fmax；副本间隔大于这个宽度，才不会重叠。这也是 fₛ > 2fmax 的由来，不是把两个点用直线连起来就能恢复曲线。", "In frequency space, ideal impulse sampling repeats the spectrum every fₛ. A spectrum spanning −fmax to +fmax is 2fmax wide. Spacing replicas farther apart than that prevents overlap: this is why fₛ > 2fmax, not because straight lines between two points reconstruct a curve.", "理想インパルス標本化はスペクトルを fₛ 間隔で複製します。−fmax から +fmax の幅は 2fmax なので、複製の間隔がそれより広ければ重なりません。これが条件の理由であり、2点を直線で結ぶことによる復元ではありません。", "이상적 임펄스 샘플링은 스펙트럼을 fₛ 간격으로 복제합니다. −fmax부터 +fmax까지 폭은 2fmax이므로 복제 간격이 이보다 넓으면 겹치지 않습니다. 이것이 조건의 이유이며 두 점을 직선으로 연결해 복원하는 것은 아닙니다.")}</p>
    <h3>{t("混叠不是失真变形，而是频率身份丢失", "Aliasing loses frequency identity", "折り返しは周波数の識別を失う", "에일리어싱은 주파수 식별을 잃는 것")}</h3>
    <p><code>falias = |f − kfₛ| ≤ fₛ/2</code> · {t("k 取能折回基带的整数。本图候选频率为", "Choose integer k to fold into baseband. Candidate frequency:", "基底帯域へ戻す整数 k を選びます。候補周波数：", "기저대역으로 접히도록 정수 k를 선택합니다. 후보 주파수:")} <strong>{Math.abs(tone.folded).toFixed(2)} Hz</strong>. {t("折回的有符号频率保留相位，不能只把原正弦公式里的频率换成绝对值。16 kHz 采样时，6 kHz 与 10 kHz 的正弦可在合适相位下给出相同样本。采样后的低通无法分辨它们原来是谁。", "The signed folded frequency retains phase; replacing it by its absolute value in a sine formula can be wrong. At 16 kHz sampling, 6 and 10 kHz tones can produce identical samples with suitable phases. A later low-pass cannot identify their origins.", "符号付き周波数は位相を保ち、正弦式で単に絶対値へ置換できません。16 kHz 標本化では6 kHzと10 kHzが適切な位相で同じ標本になります。後段の低域フィルターでは元を識別できません。", "부호 있는 주파수는 위상을 보존하므로 사인 식에서 절댓값으로만 바꾸면 틀릴 수 있습니다. 16 kHz 샘플링에서는 적절한 위상의 6 kHz와 10 kHz가 같은 샘플을 만듭니다. 뒤의 저역통과 필터로 원래 주파수를 구별할 수 없습니다.")}</p>
    <h3>{t("工程上：先限带，再采样", "Engineering: limit bandwidth before sampling", "実装：帯域制限してから標本化", "구현: 대역 제한 후 샘플링")}</h3>
    <ol className="sound-topic-flow"><li>Analog → LPF</li><li>ADC · fₛ</li><li>PCM</li></ol>
    <p>{t("若想保留 0–20 kHz，48 kHz 系统在 20–24 kHz 间可安排过渡带；实际滤波器不能在一个频点突然截断。真实 ADC 也可能用内部过采样与数字抽取共同完成限带。提高位深不会改变混叠边界，提高已有 PCM 的采样率也不会找回丢失的信息。", "For a 0–20 kHz target band, a 48 kHz system can allocate 20–24 kHz for transition: real filters do not cut off instantly. ADCs may combine internal oversampling with digital decimation. More bits do not change the alias boundary; upsampling existing PCM cannot restore lost information.", "0–20 kHz を残す48 kHz系では20–24 kHzを遷移帯域に使えます。実フィルターは瞬時に遮断できません。内部過標本化とデジタル間引きを併用する ADC もあります。ビット数は境界を変えず、既存 PCM のアップサンプリングは失われた情報を戻せません。", "0–20 kHz 목표 대역을 위해 48 kHz 시스템은 20–24 kHz를 전이 대역으로 둘 수 있습니다. 실제 필터는 즉시 차단하지 못합니다. ADC는 내부 오버샘플링과 디지털 데시메이션을 함께 쓰기도 합니다. 비트 수는 경계를 바꾸지 않고 기존 PCM 업샘플링도 잃은 정보를 복원하지 못합니다.")}</p>
    <a href="https://www.analog.com/en/resources/faqs/FAQ_antialiasing_filter.html" target="_blank" rel="noreferrer">Analog Devices · {t("抗混叠滤波原理", "Anti-alias filtering", "折り返し防止フィルター", "안티에일리어싱 필터")}</a>
  </div>;
}
