import { useState } from "react";
import { Mic, CircuitBoard, Cpu } from "lucide-react";
import type { Language } from "../content/knowledge";

const models = [
  {
    id: "dynamic", icon: Mic, name: ["动圈话筒", "Dynamic"], photo: "microphone-dynamic.jpg",
    caption: ["手持动圈话筒：Shure SM58", "Handheld dynamic microphone: Shure SM58"],
    author: "Nicolas Esposito", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
    source: "https://commons.wikimedia.org/wiki/File:Micro_Shure_SM58.jpg",
    reference: "https://service.shure.com/articles/en_US/Knowledge/difference-between-a-dynamic-and-condenser-microphone",
    flow: [["声压", "振膜与线圈运动", "电磁感应", "模拟电压"], ["Pressure", "Diaphragm and coil motion", "Electromagnetic induction", "Analog voltage"]],
    parts: [
      { name: ["振膜", "Diaphragm"], text: ["声压差推动振膜，振膜带动相连的线圈一起运动。", "Pressure differences move the diaphragm and its attached coil."], x: 185, y: 76 },
      { name: ["音圈", "Voice coil"], text: ["线圈在磁隙内运动产生感应电压；振膜与线圈是机械连接。", "Motion of the coil in the magnetic gap induces a voltage; it is mechanically attached to the diaphragm."], x: 240, y: 133 },
      { name: ["磁路", "Magnetic circuit"], text: ["固定磁体与极片在磁隙中提供磁场，普通被动动圈音头不需要供电。", "The stationary magnet and pole pieces provide the gap field. A conventional passive moving-coil capsule needs no power."], x: 185, y: 196 }
    ]
  },
  {
    id: "electret", icon: CircuitBoard, name: ["驻极体咪头", "Electret"], photo: "microphone-electret.jpg",
    caption: ["驻极体咪头：不同封装与接线", "Electret capsules with different packages and wiring"],
    author: "Omegatron", license: "CC BY-SA 3.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    source: "https://commons.wikimedia.org/wiki/File:Electret_condenser_microphone_capsules.jpg",
    reference: "https://www.ti.com/lit/ug/tidu765/tidu765.pdf",
    flow: [["声压", "电容变化", "JFET 阻抗变换", "模拟输出"], ["Pressure", "Capacitance change", "JFET impedance conversion", "Analog output"]],
    parts: [
      { name: ["振膜", "Diaphragm"], text: ["振膜与背板构成电容；声压使间距变化，从而改变电容。", "The diaphragm and backplate form a capacitor; pressure changes their spacing and capacitance."], x: 180, y: 80 },
      { name: ["背板与驻极体", "Backplate and electret"], text: ["以背驻极体结构为例，材料中的持久电荷提供极化，不代表整个咪头无需供电。", "In this back-electret example, persistent material charge provides polarization; this does not make the whole capsule power-free."], x: 180, y: 127 },
      { name: ["JFET", "JFET"], text: ["高输入阻抗的 JFET 缓冲微弱信号；常见两线咪头由外部偏置电阻供电，并通过耦合电容取出交流信号。", "A high-input-impedance JFET buffers the small signal. Typical two-wire capsules use an external bias resistor and AC-coupled output."], x: 230, y: 211 }
    ]
  },
  {
    id: "mems", icon: Cpu, name: ["数字 MEMS 麦", "Digital MEMS"], photo: "microphone-mems.jpg",
    caption: ["PCB 上的数字 MEMS 麦：Akustica AKU230", "Digital MEMS microphone on a PCB: Akustica AKU230"],
    author: "© Raimond Spekking", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "https://commons.wikimedia.org/wiki/File:Asus_Zenbook_UX32V_-_webcam_module_-_AK230_0539L_4911C-0108.jpg",
    reference: "https://www.knowles.com/docs/default-source/default-document-library/sisonic-design-guide.pdf",
    flow: [["声孔", "MEMS 电容变化", "ASIC 转换", "PDM / I2S"], ["Acoustic port", "MEMS capacitance change", "ASIC conversion", "PDM / I2S"]],
    parts: [
      { name: ["声孔", "Acoustic port"], text: ["图示为顶进音封装；也有底进音结构，安装时必须为声孔保留通道。", "This schematic shows a top-port package. Bottom-port designs also exist; mounting must leave an acoustic path."], x: 115, y: 70 },
      { name: ["MEMS 传感器", "MEMS sensor"], text: ["微机械振膜与背板构成电容式传感器，最初产生的仍是模拟电学变化。", "A micromachined diaphragm and backplate form a capacitive sensor. Its initial electrical variation is still analog."], x: 115, y: 171 },
      { name: ["ASIC", "ASIC"], text: ["接口电路完成偏置、前端放大和模数转换。PDM 需后端抽取为 PCM；I2S 型号已在内部完成所需数字处理。", "The interface circuit provides bias, amplification, and conversion. PDM needs downstream decimation to PCM; I2S models include the required digital processing."], x: 278, y: 171 }
    ]
  }
];

export function MicrophoneAnatomy({ language }: { language: Language }) {
  const [selected, setSelected] = useState(0);
  const [part, setPart] = useState(0);
  const l = language === "zh" ? 0 : 1;
  const model = models[selected];
  return (
    <section className="mic-anatomy" aria-label={l === 0 ? "麦克风实物与剖面图解" : "Microphone photos and cross-sections"}>
      <div className="mic-anatomy-modes" role="group" aria-label={l === 0 ? "麦克风类型" : "Microphone type"}>
        {models.map((item, index) => <button key={item.id} type="button" aria-pressed={selected === index} onClick={() => { setSelected(index); setPart(0); }}><item.icon size={18} aria-hidden="true" />{item.name[l]}</button>)}
      </div>
      <div className="mic-anatomy-visuals">
        <figure>
          <img src={`${import.meta.env.BASE_URL}images/${model.photo}`} alt={model.caption[l]} width="480" height="320" loading="lazy" />
          <figcaption>{model.caption[l]}<small>{model.author} / <a href={model.licenseUrl}>{model.license}</a> · <a href={model.source}>Wikimedia Commons</a> · {l === 0 ? "缩放与压缩" : "Resized and compressed"}</small></figcaption>
        </figure>
        <figure>
          <svg viewBox="0 0 600 340" role="img" aria-label={`${model.name[l]}${l === 0 ? "结构剖面示意" : " cross-section schematic"}`}>
            <text x="28" y="30">{l === 0 ? "声压作用于振膜" : "Sound pressure acts on the diaphragm"}</text>
            <path d={selected === 2 ? "M115 36 V48 M108 40 L115 48 L122 40" : "M155 42 V66 M148 58 L155 66 L162 58 M215 42 V66 M208 58 L215 66 L222 58"} stroke="#3264a0" fill="none" strokeWidth="2" />
            {selected === 0 ? <>
              <path d="M65 90 V251 H305 V90" fill="none" stroke="#879a92" strokeWidth="7" />
              <path d="M72 90 Q185 54 298 90" fill="#d7eee5" stroke="#226d60" strokeWidth="4" />
              <path d="M126 79 V176 M244 79 V176" stroke="#b47b42" strokeWidth="3" />
              <path d="M87 120 H112 V218 H157 V119 H213 V218 H258 V120 H283 V243 H87 Z" fill="#c7d3dd" stroke="#536879" strokeWidth="2" />
              <rect x="159" y="177" width="52" height="41" fill="#ba7671" stroke="#81524e" />
              {[132, 144, 156, 168].map(y => <g key={y} fill="#d9994c" stroke="#87581e"><circle cx="126" cy={y} r="5" /><circle cx="244" cy={y} r="5" /></g>)}
              <path d="M246 174 H323 V267 H350 M246 163 H334 V280 H350" stroke="#b47b42" strokeWidth="2" fill="none" />
              <path d="M50 105 V152 M44 112 L50 105 L56 112 M44 145 L50 152 L56 145" stroke="#226d60" fill="none" strokeWidth="2" />
              <path d="M290 87 H380 M258 151 H380 M213 198 H380" stroke="#879a92" fill="none" />
              <text x="392" y="91">{l === 0 ? "振膜 / 可动" : "Diaphragm / moving"}</text>
              <text x="392" y="145">{l === 0 ? "音圈处于磁隙内" : "Coil in magnetic gap"}</text>
              <text x="392" y="168">{l === 0 ? "两侧为同一环形线圈" : "Two sides of one coil"}</text>
              <text x="392" y="202">{l === 0 ? "永磁体与导磁极片" : "Magnet + pole pieces"}</text>
              <text x="365" y="279">{l === 0 ? "两端模拟输出" : "Analog output pair"}</text>
              <text x="28" y="319">{l === 0 ? "振膜带动音圈沿轴向往复；磁路固定不动。" : "Diaphragm and coil move axially; the magnetic circuit stays fixed."}</text>
            </> : selected === 1 ? <>
              <path d="M65 78 V260 H315 V78" fill="#f0f4f2" stroke="#879a92" strokeWidth="5" />
              <rect x="82" y="96" width="216" height="25" fill="#e5f3fb" />
              <path d="M72 89 Q190 75 308 89" fill="none" stroke="#226d60" strokeWidth="4" className="mic-diaphragm-motion" />
              <path d="M82 128 H298" stroke="#b87838" strokeWidth="6" strokeDasharray="23 6" />
              <path d="M82 139 H298" stroke="#8d9fab" strokeWidth="12" strokeDasharray="23 6" />
              <path d="M190 145 V204 H212 M268 201 H330 V247 M268 224 H288 V260" stroke="#536879" fill="none" strokeWidth="2" />
              <rect x="212" y="184" width="56" height="47" rx="3" fill="#d7eee5" stroke="#226d60" />
              <path d="M298 89 H379 M298 108 H355 V121 H379 M298 128 H343 V157 H379 M298 143 H330 V185 H379" stroke="#879a92" fill="none" />
              <text x="392" y="93">{l === 0 ? "导电振膜 / 可动" : "Conductive diaphragm"}</text>
              <text x="392" y="125">{l === 0 ? "空气间隙 d" : "Air gap d"}</text>
              <text x="392" y="161">{l === 0 ? "驻极体层 / 持久电荷" : "Electret / stored charge"}</text>
              <text x="392" y="189">{l === 0 ? "穿孔背板 / 固定" : "Perforated backplate"}</text>
              <text x="352" y="251">{l === 0 ? "信号 + 供电端" : "Signal + bias terminal"}</text>
              <text x="250" y="285">{l === 0 ? "外壳 / 地" : "Case / ground"}</text>
              <text x="28" y="319">{l === 0 ? "背驻极体示意：间距 d 改变 → 电容 C ≈ εA/d 改变。" : "Back-electret example: changing gap d changes C ≈ εA/d."}</text>
            </> : <>
              <path d="M50 240 V72 H94 M138 72 H350 V240" fill="none" stroke="#879a92" strokeWidth="8" />
              <path d="M46 242 H354" stroke="#627c6c" strokeWidth="12" />
              <path d="M80 228 V147 H96 V209 H140 V147 H156 V228 Z" fill="#c9d8e2" stroke="#536879" strokeWidth="2" />
              <path d="M96 157 H140" stroke="#b87838" strokeWidth="5" strokeDasharray="8 4" />
              <path d="M96 175 Q118 184 140 175" fill="none" stroke="#226d60" strokeWidth="3" />
              <rect x="238" y="171" width="80" height="60" fill="#d7eee5" stroke="#226d60" rx="3" />
              <path d="M153 184 Q195 106 247 184 M302 231 V258 H353" fill="none" stroke="#c46f2a" strokeWidth="3" />
              <path d="M115 90 V130 M108 120 L115 130 L122 120" fill="none" stroke="#3264a0" strokeWidth="2" />
              <text x="383" y="79">{l === 0 ? "传感器局部放大" : "Sensor detail"}</text>
              <rect x="382" y="94" width="184" height="107" fill="#f0f6fa" stroke="#b2c6d0" />
              <path d="M398 117 H550" stroke="#b87838" strokeWidth="7" strokeDasharray="18 8" />
              <path d="M398 162 Q474 185 550 162" fill="none" stroke="#226d60" strokeWidth="3" />
              <path d="M156 160 L382 94 M156 183 L382 201" stroke="#879a92" strokeDasharray="4 4" />
              <text x="400" y="144">{l === 0 ? "背板 · 空气间隙" : "Backplate · air gap"}</text>
              <text x="403" y="193">{l === 0 ? "可动振膜" : "Moving diaphragm"}</text>
              <text x="375" y="262">PDM / I2S</text>
              <text x="28" y="290">{l === 0 ? "ASIC：偏置 → 前端放大 → ADC → 数字接口" : "ASIC: bias → analog front end → ADC → digital interface"}</text>
              <text x="28" y="319">{l === 0 ? "顶进音封装示意；PDM 与 I2S 是不同型号的接口选择。" : "Top-port example; PDM and I2S are alternative model interfaces."}</text>
            </>}
            {model.parts.map((item, index) => <g key={item.name[1]} role="button" tabIndex={0} aria-label={item.name[l]} aria-pressed={part === index} onClick={() => setPart(index)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setPart(index); } }} className="mic-anatomy-hotspot">
              <title>{item.name[l]}</title><circle cx={item.x} cy={item.y} r="18" fill={part === index ? "#226d60" : "#fff"} stroke="#226d60" strokeWidth="2" /><text x={item.x} y={item.y + 5} textAnchor="middle" style={{ fill: part === index ? "#fff" : "#234c43" }}>{index + 1}</text>
            </g>)}
          </svg>
          <figcaption>{l === 0 ? "通用原理剖面，非照片型号拆解；非实际比例。封装与声孔因型号而异。" : "Generic principle, not a teardown of the photographed model; not to scale. Packages and port locations vary."}{selected === 1 && (l === 0 ? " 振膜运动为慢速夸张示意，不表示实际振幅或频率。" : " Diaphragm motion is slowed and exaggerated, not an actual amplitude or frequency.")}</figcaption>
        </figure>
      </div>
      <div className="mic-anatomy-parts" role="group" aria-label={l === 0 ? "结构部件" : "Components"}>
        {model.parts.map((item, index) => <button key={item.name[1]} type="button" aria-pressed={part === index} onClick={() => setPart(index)}>{index + 1}. {item.name[l]}</button>)}
      </div>
      <p className="mic-anatomy-explanation" aria-live="polite">{model.parts[part].text[l]}</p>
      {selected === 1 && <div className="mic-anatomy-bias">
        <h4>{l === 0 ? "两线驻极体：外部偏置与取出信号" : "Two-wire electret: external bias and signal coupling"}</h4>
        <svg viewBox="0 0 600 210" role="img" aria-label={l === 0 ? "驻极体外部偏置简化电路" : "Simplified electret bias circuit"}>
          <g stroke="#536879" strokeWidth="2" fill="none">
            <path d="M270 32 V45 M270 79 V107 H345 M359 107 H440 M270 107 V134 M270 170 V187 M255 187 H285 M260 193 H280 M266 199 H274" />
            <rect x="262" y="45" width="16" height="34" />
            <path d="M345 91 V123 M359 91 V123" />
            <rect x="190" y="134" width="160" height="36" rx="4" fill="#e5ede7" />
            <circle cx="270" cy="107" r="3" fill="#536879" />
          </g>
          <text x="245" y="23">Vbias</text><text x="300" y="54">{l === 0 ? "偏置电阻 R" : "Bias resistor R"}</text>
          <text x="333" y="80">{l === 0 ? "耦合电容" : "Coupling C"}</text>
          <text x="450" y="111">{l === 0 ? "交流输出" : "AC output"}</text>
          <text x="215" y="158">{l === 0 ? "咪头 / JFET" : "Capsule / JFET"}</text>
          <text x="28" y="95">{l === 0 ? "咪头内部电路" : "Internal circuit"}</text>
          <text x="28" y="120">{l === 0 ? "采用功能块简化" : "shown as a block"}</text>
        </svg>
        <p>{l === 0 ? "驻极体提供持久极化；外部电源经电阻为内部 JFET 建立工作点。声信号使电流变化，电阻将其转为电压变化，耦合电容隔开直流。JFET 主要进行阻抗变换，不能默认它有固定的电压放大倍数。" : "The electret provides persistent polarization. The external supply and resistor bias the internal JFET. Signal current variations produce voltage variations across the resistor; the coupling capacitor blocks DC. The JFET primarily provides impedance conversion, not a guaranteed fixed voltage gain."}</p>
        <a href="https://www.bilibili.com/video/BV1mB4y1x7pV/">{l === 0 ? "延伸视频：爱上半导体 · 驻极话筒的工作原理" : "Further viewing: 爱上半导体 · How electret microphones work (Chinese)"}</a>
      </div>}
      <ol className="mic-anatomy-flow" aria-label={l === 0 ? "换能信号流程" : "Transduction signal flow"}>{model.flow[l].map((step) => <li key={step}>{step}</li>)}</ol>
      <a className="mic-anatomy-reference" href={model.reference}>{l === 0 ? "原理参考：厂商技术资料" : "Principle reference: manufacturer documentation"}</a>
    </section>
  );
}
