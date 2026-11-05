import { text } from "../content/language";
import type { Language } from "../content/knowledge";

export function SoundPropagationDiagram({ language }: { language: Language }) {
  const figure = useRef<HTMLElement>(null);
  const [running, setRunning] = useState(() => !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    if (!running || typeof IntersectionObserver === "undefined") return;
    let visible = false;
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    if (figure.current) observer.observe(figure.current);
    const timer = window.setInterval(() => {
      if (visible && !document.hidden) setPhase(value => (value + 2 * Math.PI / 120) % (2 * Math.PI));
    }, 1000 / 30);
    return () => { clearInterval(timer); observer.disconnect(); };
  }, [running]);
  // Right-going wave: displacement = -a sin(kx - wt); pressure = -K d(displacement)/dx.
  const pressure = Array.from({ length: 161 }, (_, i) =>
    `${i ? "L" : "M"} ${30 + i * 1.5} ${85 + 45 * Math.cos(i / 160 * 2 * Math.PI)}`
  ).join(" ");
  return (
    <figure className="sound-propagation" ref={figure}>
      <div className="sound-propagation-air">
        <h3>{text(language, "① 振膜推动空气，疏密变化向右传播", "① A diaphragm drives a pressure wave to the right", "① 振動板による音圧変化が右へ伝わる", "① 진동판이 만든 압력파가 오른쪽으로 전달됨")}</h3>
        <button className="sound-topic-back" onClick={() => setRunning(value => !value)}>{running ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}{running ? text(language, "暂停动画", "Pause animation", "一時停止", "애니메이션 일시 정지") : text(language, "播放动画", "Play animation", "再生", "애니메이션 재생")}</button>
        <svg viewBox="0 0 600 200" role="img" aria-label={text(language, "振膜、空气疏密和固定观察点", "Diaphragm, air compression and fixed observation point", "振動板、空気の圧縮と固定観測点", "진동판, 공기 압축 및 고정 관측점")}>
          <path d="M 70 35 H 550 l -10 -6 m 10 6 l -10 6" fill="none" stroke="currentColor" />
          <rect x={44 + 12 * Math.sin(phase)} y="65" width="6" height="90" fill="#227a70" />
          <path d="M 28 165 H 65 m -6 -5 l 6 5 l -6 5 M 34 160 l -6 5 l 6 5" fill="none" stroke="currentColor" />
          {Array.from({ length: 49 }, (_, i) => {
            const rest = 60 + i * 10;
            const x = rest - 12 * Math.sin(i / 48 * 2 * Math.PI - phase);
            return [80, 100, 120, 140].map(y => <circle key={`${i}-${y}`} cx={x} cy={y} r="2.6" fill="#227a70" />);
          })}
          <line x1="300" x2="300" y1="55" y2="155" stroke="#a94d1d" strokeDasharray="4 4" />
        </svg>
        <div className="sound-propagation-legend"><span>t / T = {(phase / (2 * Math.PI)).toFixed(2)}</span><span>Δp / pₘₐₓ = {(-Math.cos(phase)).toFixed(2)}</span></div>
        <p>{text(language, "动画慢放一个周期：点代表空气小体积，在原位附近往复，并不随声波向右流走。位移已夸大，虚线观察点固定；下方圆点同步标出当地声压和理想麦克风电压。", "One cycle in slow motion: dots represent air parcels oscillating locally, not flowing right with the wave. Displacement is exaggerated; the dashed probe stays fixed. Markers below track local pressure and ideal microphone voltage.", "一周期のスローモーションです。空気はその場で往復し、波と共に右へ流れません。変位は誇張し、観測点は固定です。下の点は音圧と理想マイク電圧を示します。", "한 주기를 느리게 표시합니다. 공기는 제자리에서 왕복하며 파동과 함께 오른쪽으로 흐르지 않습니다. 변위는 과장했으며 관측점은 고정입니다. 아래 점은 음압과 이상적 마이크 전압을 나타냅니다.")}</p>
      </div>
      <div className="sound-propagation-signals">
        {[false, true].map(voltage => (
          <div key={String(voltage)}>
            <h3>{voltage ? (text(language, "③ 麦克风将当地声压变为电压", "③ A microphone converts local pressure to voltage", "③ マイクがその場所の音圧を電圧に変換", "③ 마이크가 해당 위치의 음압을 전압으로 변환")) : (text(language, "② 记录观察点的声压随时间变化", "② Record pressure over time at the probe", "② 観測点の音圧を時間に沿って記録", "② 관측점의 시간에 따른 음압 기록"))}</h3>
            <svg viewBox="0 0 300 180" role="img" aria-label={voltage ? (text(language, "归一化麦克风电压随时间变化", "Normalized microphone voltage over time", "正規化したマイク電圧の時間変化", "정규화한 마이크 전압의 시간 변화")) : (text(language, "归一化观察点声压随时间变化", "Normalized probe pressure over time", "正規化した観測点音圧の時間変化", "정규화한 관측점 음압의 시간 변화"))}>
              <path d="M30 25 V145 H270 M30 85 H270" fill="none" stroke="#a3b5af" />
              <path d={pressure} fill="none" stroke={voltage ? "#a94d1d" : "#227a70"} strokeWidth="3" />
              <circle cx={30 + 240 * phase / (2 * Math.PI)} cy={85 + 45 * Math.cos(phase)} r="5" fill="#a94d1d" />
              <text x="24" y="44" textAnchor="end">+1</text><text x="24" y="89" textAnchor="end">0</text><text x="24" y="134" textAnchor="end">−1</text>
              <text x="30" y="165">0</text><text x="150" y="165" textAnchor="middle">T/2</text><text x="270" y="165" textAnchor="end">T</text>
            </svg>
            <p>{voltage ? (text(language, "理想线性模型 v(t) = S · Δp(t)，S 为灵敏度。两图各自归一化，形状相同不代表 Pa 和 V 数值相等。", "Ideal linear model: v(t) = S · Δp(t), with sensitivity S. Each plot is normalized independently: equal shapes do not imply equal Pa and V values.", "理想的な線形モデルは v(t) = S · Δp(t) で、S は感度です。各図は独立に正規化しており、形が同じでも Pa と V の数値が同じとは限りません。", "이상적인 선형 모델은 v(t) = S · Δp(t)이며 S는 감도입니다. 각 그래프는 따로 정규화했으므로 모양이 같아도 Pa와 V의 수치가 같다는 뜻은 아닙니다.")) : (text(language, "横轴：时间；纵轴：Δp / 峰值声压。t = 0 时处于稀疏区，所以声压低于静态气压；并非绝对气压为负。", "Horizontal: time; vertical: Δp / peak pressure. At t = 0, rarefaction means pressure below ambient, not negative absolute pressure.", "横軸は時間、縦軸は Δp / ピーク音圧です。t = 0 の希薄な領域では周囲の静圧を下回りますが、絶対圧が負になるわけではありません。", "가로축은 시간, 세로축은 Δp / 최대 음압입니다. t = 0의 희박한 영역은 주변 정압보다 낮다는 뜻이며 절대 압력이 음수라는 뜻은 아닙니다."))}</p>
          </div>
        ))}
      </div>
      <figcaption>{text(language, "理想小振幅平面行波示意，忽略衰减、反射与麦克风频响。空气质点在平衡位置附近往复，传播的是扰动与能量。", "Ideal small-amplitude plane traveling wave; attenuation, reflections and microphone response are omitted. Air parcels oscillate locally while disturbance and energy propagate.", "理想的な微小振幅の平面進行波です。減衰・反射・マイクの周波数特性は省略しています。空気は平衡位置の周辺で振動し、擾乱とエネルギーが伝わります。", "이상적인 작은 진폭의 평면 진행파입니다. 감쇠, 반사, 마이크 주파수 응답은 생략했습니다. 공기는 평형 위치 근처에서 진동하고 교란과 에너지가 전달됩니다.")}</figcaption>
    </figure>
  );
}
import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
