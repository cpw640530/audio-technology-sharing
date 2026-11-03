import { text } from "../content/language";
import type { Language } from "../content/knowledge";

export function SoundPropagationDiagram({ language }: { language: Language }) {
  // Linear plane wave: displacement = -a sin(kx), pressure is proportional to cos(kx).
  const pressure = Array.from({ length: 161 }, (_, i) =>
    `${i ? "L" : "M"} ${30 + i * 1.5} ${85 + 45 * Math.cos(i / 160 * 2 * Math.PI)}`
  ).join(" ");
  return (
    <figure className="sound-propagation">
      <div className="sound-propagation-air">
        <h3>{text(language, "① 振膜推动空气，疏密变化向右传播", "① A diaphragm drives a pressure wave to the right", "① 振動板による音圧変化が右へ伝わる", "① 진동판이 만든 압력파가 오른쪽으로 전달됨")}</h3>
        <svg viewBox="0 0 600 200" role="img" aria-label={text(language, "振膜、空气疏密和固定观察点", "Diaphragm, air compression and fixed observation point", "振動板、空気の圧縮と固定観測点", "진동판, 공기 압축 및 고정 관측점")}>
          <path d="M 70 35 H 550 l -10 -6 m 10 6 l -10 6" fill="none" stroke="currentColor" />
          <rect x="44" y="65" width="6" height="90" fill="#227a70" />
          <path d="M 28 110 H 65 m -6 -5 l 6 5 l -6 5" fill="none" stroke="currentColor" />
          {Array.from({ length: 49 }, (_, i) => {
            const rest = 60 + i * 10;
            const x = rest - 12 * Math.sin(i / 48 * 2 * Math.PI);
            return [80, 100, 120, 140].map(y => <circle key={`${i}-${y}`} cx={x} cy={y} r="2.6" fill="#227a70" />);
          })}
          <line x1="300" x2="300" y1="55" y2="155" stroke="#a94d1d" strokeDasharray="4 4" />
        </svg>
        <div className="sound-propagation-legend"><span>{text(language, "压缩", "Compressed", "圧縮", "압축")}</span><span>{text(language, "观察点：稀疏", "Probe: rarefied", "観測点：希薄", "관측점: 희박")}</span><span>{text(language, "压缩", "Compressed", "圧縮", "압축")}</span></div>
        <p>{text(language, "这是 t = 0 的空间快照：振膜此刻向右运动。点代表空气小体积，不是分子的随机热运动；位移已夸大。观察点固定，不跟随质点移动。", "Spatial snapshot at t = 0: the diaphragm is moving right. Dots represent small air parcels, not molecular thermal motion; displacement is exaggerated. The probe stays fixed.", "t = 0 の空間分布です。振動板は右へ動いています。点は微小な空気の塊を表し、分子の熱運動ではありません。変位は誇張しています。観測点は固定されています。", "t = 0의 공간 분포입니다. 진동판은 오른쪽으로 움직입니다. 점은 작은 공기 덩어리를 나타내며 분자의 열운동이 아닙니다. 변위는 과장했으며 관측점은 고정되어 있습니다.")}</p>
      </div>
      <div className="sound-propagation-signals">
        {[false, true].map(voltage => (
          <div key={String(voltage)}>
            <h3>{voltage ? (text(language, "③ 麦克风将当地声压变为电压", "③ A microphone converts local pressure to voltage", "③ マイクがその場所の音圧を電圧に変換", "③ 마이크가 해당 위치의 음압을 전압으로 변환")) : (text(language, "② 记录观察点的声压随时间变化", "② Record pressure over time at the probe", "② 観測点の音圧を時間に沿って記録", "② 관측점의 시간에 따른 음압 기록"))}</h3>
            <svg viewBox="0 0 300 180" role="img" aria-label={voltage ? (text(language, "归一化麦克风电压随时间变化", "Normalized microphone voltage over time", "正規化したマイク電圧の時間変化", "정규화한 마이크 전압의 시간 변화")) : (text(language, "归一化观察点声压随时间变化", "Normalized probe pressure over time", "正規化した観測点音圧の時間変化", "정규화한 관측점 음압의 시간 변화"))}>
              <path d="M30 25 V145 H270 M30 85 H270" fill="none" stroke="#a3b5af" />
              <path d={pressure} fill="none" stroke={voltage ? "#a94d1d" : "#227a70"} strokeWidth="3" />
              <circle cx="30" cy="130" r="4" fill="#a94d1d" />
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
