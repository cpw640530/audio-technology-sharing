import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, StepForward, Volume2, VolumeX } from "lucide-react";
import { text } from "../content/language";
import type { Language } from "../content/knowledge";
import { pressureHistory, propagationFrame, propagationSample, type PropagationSettings } from "./soundPropagationModel";
import { animationLoop } from "./animationLoop";

const AirVolume = lazy(() => import("./SoundPropagation3D"));

export function SoundPropagationDiagram({ language }: { language: Language }) {
  const figure = useRef<HTMLElement>(null);
  const [running, setRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [settings, setSettings] = useState<PropagationSettings>({ mode: "continuous", amplitude: 1, rate: 1 });
  const audio = useRef<{ context: AudioContext; oscillator: OscillatorNode; gain: GainNode; started: boolean } | null>(null);
  const [audible, setAudible] = useState(false);
  const [audioError, setAudioError] = useState(false);
  function stopSound(update = true) {
    const current = audio.current;
    audio.current = null;
    if (current) {
      if (current.started) current.oscillator.stop();
      current.oscillator.disconnect();
      current.gain.disconnect();
      void current.context.close().catch(() => {});
    }
    if (update) setAudible(false);
  }
  async function startSound() {
    document.dispatchEvent(new Event("sound-article-play"));
    setAudioError(false);
    let current: typeof audio.current = null;
    try {
      const Audio = window.AudioContext ?? window.webkitAudioContext;
      if (!Audio) throw new Error("Audio unavailable");
      const context = new Audio();
      current = { context, oscillator: context.createOscillator(), gain: context.createGain(), started: false };
      audio.current = current;
      current.oscillator.type = "sine";
      current.oscillator.frequency.value = 220 * settings.rate;
      current.gain.gain.value = 0;
      current.oscillator.connect(current.gain);
      current.gain.connect(context.destination);
      setAudible(true);
      setRunning(true);
      await context.resume();
      if (audio.current !== current) return;
      current.oscillator.start();
      current.started = true;
    } catch {
      if (current && audio.current !== current) return;
      stopSound();
      setAudioError(true);
    }
  }
  useEffect(() => {
    if (!running) { stopSound(); return; }
    const current = audio.current;
    if (!current) return;
    current.oscillator.frequency.setTargetAtTime(220 * settings.rate, current.context.currentTime, .02);
    current.gain.gain.setTargetAtTime(.08 * settings.amplitude * settings.rate / 1.5, current.context.currentTime, .02);
  }, [running, settings, audible]);
  useEffect(() => {
    const halt = () => { stopSound(); setRunning(false); };
    const hide = () => { if (document.hidden) halt(); };
    const observer = typeof IntersectionObserver === "undefined" ? undefined : new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) halt();
    });
    if (figure.current) observer?.observe(figure.current);
    document.addEventListener("sound-article-play", halt);
    document.addEventListener("visibilitychange", hide);
    return () => {
      observer?.disconnect();
      document.removeEventListener("sound-article-play", halt);
      document.removeEventListener("visibilitychange", hide);
      stopSound(false);
    };
  }, []);
  const t = (zh: string, en: string, ja: string, ko: string) => text(language, zh, en, ja, ko);
  const reset = () => { setTime(0); setRunning(false); };
  const configure = (change: Partial<PropagationSettings>) => {
    setSettings(value => ({ ...value, ...change }));
    setRunning(true);
  };
  useEffect(() => {
    if (!running || !figure.current) return;
    const animation = animationLoop(figure.current, delta => {
      if (delta > 0) setTime(value => value + delta);
    }, { respectReducedMotion: false });
    return () => animation.dispose();
  }, [running]);
  const displacements = propagationFrame(time, settings);
  const probe = propagationSample(4, time, settings);
  const windowSize = 8;
  const start = Math.max(0, time - windowSize);
  const history = pressureHistory(time, settings);
  const px = (sampleTime: number) => 40 + (sampleTime - start) / windowSize * 240;
  const pressurePath = history.map((sample, i) => `${i ? "L" : "M"} ${px(sample.time)} ${85 - sample.pressure * 50}`).join(" ");
  const displacementPath = history.map((sample, i) => `${i ? "L" : "M"} ${px(sample.time)} ${85 - propagationSample(4, sample.time, settings).displacement / .22 * 50}`).join(" ");
  const fallback = <svg viewBox="0 0 600 200" role="img" aria-label={t("振膜、空气疏密和固定观察点", "Diaphragm, air compression and fixed observation point", "振動板、空気の圧縮と固定観測点", "진동판, 공기 압축 및 고정 관측점")}>
    <path d="M70 35 H550 l-10 -6 m10 6 l-10 6" fill="none" stroke="currentColor" />
    <rect x={44 + displacements[0] * 60} y="65" width="6" height="90" fill="#227a70" />
    {displacements.map((displacement, i) => [80, 100, 120, 140].map(y => <circle key={`${i}-${y}`} cx={60 + i * 10 + displacement * 60} cy={y} r="2.6" fill={i === 24 ? "#a94d1d" : "#227a70"} />))}
    <line x1="300" x2="300" y1="55" y2="155" stroke="#a94d1d" strokeDasharray="4 4" />
  </svg>;
  return <figure className="sound-propagation" ref={figure}>
    <h3>{t("① 推一下空气，远处会立刻变化吗？", "① Push the air: does a distant point change immediately?", "① 空気を押すと遠くもすぐ変わる？", "① 공기를 밀면 먼 곳도 즉시 변할까요?")}</h3>
    <p>{t("播放连续振动：振膜反复推动空气，再退回原位。留意橙色观察面何时开始变化，比较振膜运动与远处的声压变化。", "Start continuous vibration: the diaphragm repeatedly pushes forward and returns. Watch when the orange observation plane responds and compare its pressure changes with the source motion.", "振動板の連続した往復を再生します。橙色の観測面がいつ変わるかを見て、音源の動きと遠くの音圧を比べましょう。", "연속 진동을 재생하면 진동판이 반복해서 왕복합니다. 주황색 관측면이 언제 반응하는지 보고 음원의 움직임과 먼 곳의 음압을 비교하세요.")}</p>
    <div className="sound-propagation-controls">
      <div className="sound-propagation-actions">
        <button type="button" className="sound-topic-back" aria-pressed={audible} onClick={() => audible ? stopSound() : void startSound()}>{audible ? <VolumeX size={18} /> : <Volume2 size={18} />}{audible ? t("关闭声音", "Mute sound", "音を消す", "음소거") : t("开启声音", "Enable sound", "音を鳴らす", "소리 켜기")}</button>
        <button type="button" className="sound-topic-back" onClick={() => setRunning(value => !value)}>{running ? <Pause size={18} /> : <Play size={18} />}{running ? t("暂停动画", "Pause animation", "一時停止", "일시 정지") : t("播放动画", "Play animation", "再生", "재생")}</button>
        <button type="button" className="sound-topic-back" title={t("前进一步", "Step forward", "一コマ進む", "한 단계 진행")} aria-label={t("前进一步", "Step forward", "一コマ進む", "한 단계 진행")} onClick={() => { setRunning(false); setTime(value => value + .1); }}><StepForward size={18} /></button>
        <button type="button" className="sound-topic-back" title={t("重新实验", "Restart experiment", "実験をリセット", "실험 초기화")} aria-label={t("重新实验", "Restart experiment", "実験をリセット", "실험 초기화")} onClick={reset}><RotateCcw size={18} /></button>
      </div>
      <label>{t("振膜行程", "Diaphragm stroke", "振動板のストローク", "진동판 이동량")} <span>{Math.round(settings.amplitude * 100)}%</span><input type="range" min="0" max="1" step="0.05" value={settings.amplitude} onChange={event => configure({ amplitude: Number(event.target.value) })} /></label>
      <label>{t("振动速度", "Vibration rate", "振動の速さ", "진동 속도")} <span>{settings.rate.toFixed(2)}×</span><input type="range" min="0.5" max="1.5" step="0.05" value={settings.rate} onChange={event => configure({ rate: Number(event.target.value) })} /></label>
    </div>
    {audioError && <p role="alert">{t("无法播放，请检查浏览器音频权限后重试。", "Playback failed. Check browser audio permissions and retry.", "再生できません。音声権限を確認してください。", "재생할 수 없습니다. 오디오 권한을 확인하세요.")}</p>}
    <p className="sound-topic-note">{t("声音对应振源：", "Source tone: ", "音源の音：", "음원 소리: ")}{Math.round(220 * settings.rate)} Hz · {t("动画慢放，声音为可听纯音映射，不是观察面录音或与球点逐周期同步。行程和速度共同决定播放幅度；先调低设备音量，未校准实际声压级。", "Slow-motion animation with an audible sine-tone mapping, not a probe recording or cycle-by-cycle synchronization. Stroke and rate both set playback amplitude. Start with low device volume; SPL is not calibrated.", "スロー表示を可聴正弦音に対応させています。観測面の録音や周期ごとの同期ではありません。行程と速度が音の振幅を決めます。音量を下げてください。音圧レベルは未校正です。", "느린 애니메이션을 가청 정현파에 대응시켰으며 관측면 녹음이나 주기별 동기화가 아닙니다. 이동량과 속도가 재생 진폭을 결정합니다. 기기 음량을 낮추세요. 음압 레벨은 보정되지 않았습니다.")}</p>
    <div className="sound-propagation-air">
      <Suspense fallback={fallback}><AirVolume displacements={displacements} language={language}>{fallback}</AirVolume></Suspense>
    </div>
    <div className="sound-propagation-legend"><span>{t("演示时间", "Demo time", "デモ時間", "데모 시간")}: {time.toFixed(2)}</span><span>Δp / p_ref = {probe.pressure.toFixed(2)}</span></div>
    <p className="sound-topic-note">{t("橙色球点会一路跑到右端吗？它只在原位附近移动；传播的是疏密变化。球点代表含有大量分子的空气小体积，不是分子的随机热运动。橙色框才是固定的测量位置。", "Does the orange dot reach the far end? It moves locally; compression and rarefaction travel. Dots represent parcels containing many molecules, not molecular thermal motion. The orange frame is the fixed measurement location.", "橙色の点は局所的に動き、疎密変化が伝わります。点は多くの分子を含む空気の小体積で、分子の熱運動ではありません。橙色の枠は固定測定位置です。", "주황색 점은 국소적으로 움직이고 압축과 희박이 전달됩니다. 점은 많은 분자를 포함한 공기 부피이며 분자의 열운동이 아닙니다. 주황색 틀은 고정 측정 위치입니다.")}</p>
    <h3>{t("② 固定位置的记录，逐渐画成波形", "② A fixed-location record becomes a waveform", "② 固定位置の記録が波形になる", "② 고정 위치의 기록이 파형이 됩니다")}</h3>
    <p>{t("扰动到达观察面前，曲线保持为零；经过时先升后降。正值表示压缩，负值表示稀疏，不是负的绝对气压。曲线只记录已经发生的变化，不会提前画出未来。", "The trace stays at zero until the disturbance arrives, then rises and falls. Positive means compression; negative means rarefaction, not negative absolute pressure. Only elapsed time is recorded, never the future.", "到着前はゼロで、その後上下します。正は圧縮、負は希薄化で、負の絶対圧ではありません。過去の変化だけを記録し、未来は描きません。", "도착 전에는 0이고 이후 오르내립니다. 양수는 압축, 음수는 희박이며 음의 절대 압력이 아닙니다. 이미 일어난 변화만 기록합니다.")}</p>
    <div className="sound-propagation-signals">
      {[false, true].map(displacement => <div key={String(displacement)}>
        <h3>{displacement ? t("橙色空气小体积的位移", "Displacement of the orange air parcel", "橙色の空気小体積の変位", "주황색 공기 부피의 변위") : t("观察面声压记录", "Pressure at the observation plane", "観測面の音圧記録", "관측면 음압 기록")}</h3>
        <p>{displacement
          ? t("纵轴 s/s_ref：相对初始位置，向右为正；不是空气上下运动。", "Y: s/s_ref relative to the initial position; positive is rightward, not upward motion.", "縦軸 s/s_ref：初期位置から右向きを正とする変位で、上下運動ではありません。", "세로축 s/s_ref: 초기 위치에서 오른쪽이 양수이며 상하 운동이 아닙니다.")
          : t("纵轴 Δp/p_ref：相对背景气压，正值压缩，负值稀疏。", "Y: Δp/p_ref relative to ambient pressure; positive is compression, negative is rarefaction.", "縦軸 Δp/p_ref：静圧に対する変化で、正は圧縮、負は希薄化です。", "세로축 Δp/p_ref: 배경 기압 대비 변화이며 양수는 압축, 음수는 희박입니다.")}</p>
        <svg viewBox="0 0 300 185" role="img" aria-label={displacement ? t("归一化空气位移随时间变化", "Normalized parcel displacement over time", "正規化した空気変位の時間変化", "정규화한 공기 변위의 시간 변화") : t("归一化观察点声压随时间变化", "Normalized probe pressure over time", "正規化した観測点音圧の時間変化", "정규화한 관측점 음압의 시간 변화")}>
          <path d="M40 25 V145 H280 M40 85 H280" fill="none" stroke="#a3b5af" />
          <path data-testid={displacement ? "propagation-displacement-trace" : "propagation-pressure-trace"} d={displacement ? displacementPath : pressurePath} fill="none" stroke={displacement ? "#a94d1d" : "#227a70"} strokeWidth="2.5" />
          <circle cx={px(time)} cy={85 - (displacement ? probe.displacement / .22 : probe.pressure) * 50} r="4" fill="#a94d1d" />
          <text x="30" y="39" textAnchor="end">+1</text><text x="30" y="89" textAnchor="end">0</text><text x="30" y="139" textAnchor="end">−1</text>
          {[0, windowSize / 2, windowSize].map(offset => <text key={offset} x={40 + offset / windowSize * 240} y="163" textAnchor="middle">{(start + offset).toFixed(1)}</text>)}
          <text x="160" y="181" textAnchor="middle">{t("演示时间（慢放）", "Demo time (slow motion)", "デモ時間（スロー）", "데모 시간 (느리게)")}</text>
        </svg>
      </div>)}
    </div>
    <p>{t("位移为何只在零线上方？本演示从初始位置向右推出，再返回初始位置，因此 s/s_ref 在 0 到行程比例之间变化；零线不是周期运动的平均位置。位移增大时声压为正，位移减小时声压为负，往返端点处声压为零。两图共用时间轴；当前圆点右侧的空白是尚未发生的时间。", "Why is displacement nonnegative? The parcel moves right from its initial position and returns, so s/s_ref ranges from zero to the stroke fraction. Zero is not the periodic mean position. Rising displacement gives positive pressure; falling displacement gives negative pressure; pressure is zero at either turning point. Both plots share time; blank space right of the marker is future time.", "変位が非負なのは、初期位置から右へ動いて戻るためです。ゼロは周期運動の平均位置ではありません。変位の増加中は音圧が正、減少中は負、折り返しではゼロです。時間軸は共通で、点の右側の空白は未来です。", "변위가 양수인 이유는 초기 위치에서 오른쪽으로 이동한 뒤 돌아오기 때문입니다. 0은 주기 운동의 평균 위치가 아닙니다. 변위가 증가하면 음압은 양수, 감소하면 음수이며 양쪽 반환점에서는 0입니다. 두 그래프의 시간축은 같으며 점 오른쪽 빈 공간은 미래입니다.")}</p>
    <p>{t("两图使用固定参考值，不自动拉满高度，最多显示最近 8 个演示时间单位。调整行程或速度会按新条件重算示意记录，不是在模拟参数突变后的真实声场。", "Both plots use fixed references without automatic scaling and show up to eight recent demo units. Changing stroke or rate recomputes the model record, rather than simulating a physical parameter jump.", "固定基準を使い、過去8単位まで表示します。行程や速度の変更ではモデル全体を再計算し、実際の急変後の音場は再現しません。", "고정 기준을 사용하며 최근 8단위를 표시합니다. 이동량이나 속도 변경은 모델 기록을 다시 계산하며 실제 매개변수 급변 후 음장은 모사하지 않습니다.")}</p>
    <h3>{t("③ 加快振动，为什么声压也变大？", "③ Why does faster vibration also raise pressure?", "③ 振動を速くすると音圧も上がる理由", "③ 진동을 빠르게 하면 음압도 커지는 이유")}</h3>
    <p>{t("同样的行程，用更短时间走完，空气运动得更快。连续模式下加快振动，周期会更密，声压也增大。这里调的是振膜行程，不是声压振幅；若想保持声压不变，需要在加快振动时同时减小行程。", "Covering the same stroke in less time means faster particle motion. In continuous mode, a higher rate produces more cycles and greater pressure. This control sets travel, not pressure amplitude. Keeping pressure constant requires reducing stroke as rate increases.", "同じ移動量を短時間で動くと粒子速度が増します。連続モードでは周期が密になり音圧も上がります。音圧一定で比べるには、速くするほど移動量を減らします。", "같은 거리를 짧은 시간에 움직이면 입자 속도가 커집니다. 연속 모드에서는 주기가 촘촘해지고 음압도 커집니다. 음압을 유지하려면 빠르게 할수록 이동량을 줄여야 합니다.")}</p>
    <details><summary>{t("模型与适用边界", "Model and limits", "モデルと適用範囲", "모델과 한계")}</summary>
      <p><code>s(x,t) = g(t − x/c); Δp = ρc · ∂s/∂t</code></p>
      <p>{t("理想小振幅单向平面波，无反射与衰减，不是球面扩散或分子碰撞仿真。振膜持续重复平滑的往返行程。距离、位移和时间使用演示单位，位移夸大、速度放慢，不对应真实尺寸或可听频率。可选试听将振源频率映射为 220 × 速度倍率 Hz，不是慢放动画的实际频率。", "Ideal small-amplitude one-way plane wave without reflections or attenuation, not spherical spreading or molecular collisions. The diaphragm repeats a smooth out-and-back stroke. Distances and times are illustrative, with exaggerated slow motion, not real dimensions or audible frequencies. Optional audio maps the source to 220 × rate Hz, not the slow animation frequency.", "反射・減衰のない微小振幅の一方向平面波で、球面拡散や分子衝突ではありません。振動板は滑らかな往復を繰り返します。長さと時間はデモ単位で、実寸や可聴周波数ではなく、試聴は音源を 220 × 速度倍率 Hz に対応させます。", "반사와 감쇠가 없는 작은 진폭의 단방향 평면파이며 구면 확산이나 분자 충돌이 아닙니다. 진동판은 부드러운 왕복을 반복합니다. 길이와 시간은 데모 단위이며 실제 크기나 가청 주파수가 아닙니다. 선택적 소리는 음원을 220 × 속도 배율 Hz에 대응시킵니다.")}</p>
      <a href="https://www.acs.psu.edu/drussell/Demos/phase-p-u-sine/phase-p-u-sine.html" target="_blank" rel="noreferrer">Penn State: Phase Relationships for Plane Waves</a>
      <p>{t("交互叙事参考", "Interactive narrative reference", "対話型解説の参考", "인터랙티브 설명 참고")}: <a href="https://ciechanow.ski/sound/" target="_blank" rel="noreferrer">Sound — Bartosz Ciechanowski</a></p>
    </details>
  </figure>;
}
