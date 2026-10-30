import type { Language } from "../content/knowledge";

export function SoundPropagationDiagram({ language }: { language: Language }) {
  const zh = language === "zh";
  // Linear plane wave: displacement = -a sin(kx), pressure is proportional to cos(kx).
  const pressure = Array.from({ length: 161 }, (_, i) =>
    `${i ? "L" : "M"} ${30 + i * 1.5} ${85 + 45 * Math.cos(i / 160 * 2 * Math.PI)}`
  ).join(" ");
  return (
    <figure className="sound-propagation">
      <div className="sound-propagation-air">
        <h3>{zh ? "① 振膜推动空气，疏密变化向右传播" : "① A diaphragm drives a pressure wave to the right"}</h3>
        <svg viewBox="0 0 600 200" role="img" aria-label={zh ? "振膜、空气疏密和固定观察点" : "Diaphragm, air compression and fixed observation point"}>
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
        <div className="sound-propagation-legend"><span>{zh ? "压缩" : "Compressed"}</span><span>{zh ? "观察点：稀疏" : "Probe: rarefied"}</span><span>{zh ? "压缩" : "Compressed"}</span></div>
        <p>{zh ? "这是 t = 0 的空间快照：振膜此刻向右运动。点代表空气小体积，不是分子的随机热运动；位移已夸大。观察点固定，不跟随质点移动。" : "Spatial snapshot at t = 0: the diaphragm is moving right. Dots represent small air parcels, not molecular thermal motion; displacement is exaggerated. The probe stays fixed."}</p>
      </div>
      <div className="sound-propagation-signals">
        {[false, true].map(voltage => (
          <div key={String(voltage)}>
            <h3>{voltage ? (zh ? "③ 麦克风将当地声压变为电压" : "③ A microphone converts local pressure to voltage") : (zh ? "② 记录观察点的声压随时间变化" : "② Record pressure over time at the probe")}</h3>
            <svg viewBox="0 0 300 180" role="img" aria-label={voltage ? (zh ? "归一化麦克风电压随时间变化" : "Normalized microphone voltage over time") : (zh ? "归一化观察点声压随时间变化" : "Normalized probe pressure over time")}>
              <path d="M30 25 V145 H270 M30 85 H270" fill="none" stroke="#a3b5af" />
              <path d={pressure} fill="none" stroke={voltage ? "#a94d1d" : "#227a70"} strokeWidth="3" />
              <circle cx="30" cy="130" r="4" fill="#a94d1d" />
              <text x="24" y="44" textAnchor="end">+1</text><text x="24" y="89" textAnchor="end">0</text><text x="24" y="134" textAnchor="end">−1</text>
              <text x="30" y="165">0</text><text x="150" y="165" textAnchor="middle">T/2</text><text x="270" y="165" textAnchor="end">T</text>
            </svg>
            <p>{voltage ? (zh ? "理想线性模型 v(t) = S · Δp(t)，S 为灵敏度。两图各自归一化，形状相同不代表 Pa 和 V 数值相等。" : "Ideal linear model: v(t) = S · Δp(t), with sensitivity S. Each plot is normalized independently: equal shapes do not imply equal Pa and V values.") : (zh ? "横轴：时间；纵轴：Δp / 峰值声压。t = 0 时处于稀疏区，所以声压低于静态气压；并非绝对气压为负。" : "Horizontal: time; vertical: Δp / peak pressure. At t = 0, rarefaction means pressure below ambient, not negative absolute pressure.")}</p>
          </div>
        ))}
      </div>
      <figcaption>{zh ? "理想小振幅平面行波示意，忽略衰减、反射与麦克风频响。空气质点在平衡位置附近往复，传播的是扰动与能量。" : "Ideal small-amplitude plane traveling wave; attenuation, reflections and microphone response are omitted. Air parcels oscillate locally while disturbance and energy propagate."}</figcaption>
    </figure>
  );
}
