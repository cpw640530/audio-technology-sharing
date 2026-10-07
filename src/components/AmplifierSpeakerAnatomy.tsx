import { useState } from "react";
import { CircuitBoard, Radio, Speaker } from "lucide-react";
import type { Language } from "../content/knowledge";

type AnatomyMode = "amplifier" | "woofer" | "crossover";

const modes: Record<AnatomyMode, {
  label: Record<Language, string>;
  image: string;
  sourceUrl: string;
  fallback: string;
  alt: Record<Language, string>;
  caption: Record<Language, string>;
  description: Record<Language, string>;
  parts: Array<Record<Language, string>>;
}> = {
  amplifier: {
    label: { zh: "功放板", en: "Amplifier board" },
    image: `${import.meta.env.BASE_URL}images/amplifier-board-product.jpg`,
    sourceUrl: "https://www.tinytronics.nl/en/audio/amplifiers/tpa3116-2x50w-audio-amplifier",
    fallback: `${import.meta.env.BASE_URL}images/amplifier-board.svg`,
    alt: { zh: "Synte 2 音频功放板实物图", en: "Synte 2 audio amplifier board" },
    caption: { zh: "功放板实物：先找输入、供电、散热和扬声器输出。", en: "Amplifier board: identify input, power, cooling, and speaker output first." },
    description: { zh: "这类功放板把前级或 DAC 的小信号变成能够驱动负载的电压和电流。照片用于认识布局，不代表所有 Class A、AB 或 D 功放的固定结构。", en: "This type of amplifier board turns a preamp or DAC signal into the voltage and current needed by a load. The photo teaches layout, not a fixed structure for every Class A, AB, or D amplifier." },
    parts: [
      { zh: "散热器：把功率器件产生的热量传到空气。", en: "Heatsink: transfers power-device heat to the air." },
      { zh: "电源与滤波电容：提供稳定的电压和瞬态电流。", en: "Power and filter capacitors: provide stable voltage and transient current." },
      { zh: "输出端：连接扬声器负载，电流能力和阻抗需要匹配。", en: "Output: connects the speaker load; current capability and impedance must match." }
    ]
  },
  woofer: {
    label: { zh: "动圈扬声器", en: "Moving-coil woofer" },
    image: `${import.meta.env.BASE_URL}images/speaker-woofer-product.jpg`,
    sourceUrl: "https://speakerrepairshop.nl/en/rubber-surrounds/bowers-wilkins/rubber-surround-for-b-w-dm604-woofer-zz10065/a-5932-10000098",
    fallback: `${import.meta.env.BASE_URL}images/speaker-woofer.svg`,
    alt: { zh: "两个动圈低音扬声器单元实物图", en: "Two moving-coil woofer drivers" },
    caption: { zh: "扬声器单元实物：框架、纸盆、悬边和磁路共同完成换能。", en: "Speaker drivers: frame, cone, surround, and motor work together as a transducer." },
    description: { zh: "扬声器不是只有一个纸盆。音圈在磁隙中受力，带动振膜；悬边和定心支片提供回弹与定位，框架和磁路决定机械稳定性。", en: "A speaker is more than a cone. Force on the voice coil in the magnetic gap moves the diaphragm; surround and spider provide restoring force and centering, while the frame and motor provide stability." },
    parts: [
      { zh: "纸盆与防尘帽：把机械运动耦合为空气声压。", en: "Cone and dust cap: couple mechanical motion to air pressure." },
      { zh: "悬边与定心支片：限制行程并让音圈保持在磁隙中央。", en: "Surround and spider: limit excursion and keep the coil centered." },
      { zh: "磁路与音圈：电流在磁场中产生力，决定效率和失真边界。", en: "Motor and voice coil: current in the magnetic field creates force, shaping efficiency and distortion limits." }
    ]
  },
  crossover: {
    label: { zh: "被动分频器", en: "Passive crossover" },
    image: `${import.meta.env.BASE_URL}images/speaker-crossover-product.jpg`,
    sourceUrl: "https://www.time-tunnel.com.au/speakers/loudspeaker-crossover-network-2-way-100w-rms-handling-with-tech-info-used/",
    fallback: `${import.meta.env.BASE_URL}images/speaker-crossover.svg`,
    alt: { zh: "B&W DM2000 扬声器被动分频器实物图", en: "B&W DM2000 loudspeaker crossover" },
    caption: { zh: "被动分频器实物：电感、电容和电阻组成不同频段的滤波网络。", en: "Passive crossover: inductors, capacitors, and resistors form band-splitting networks." },
    description: { zh: "被动分频器位于功放之后，用无源元件把高频和低频分给不同单元。实际分频点和斜率会受到扬声器阻抗曲线影响，不能只按元件标称值判断。", en: "A passive crossover sits after the amplifier and uses passive components to route high and low bands to different drivers. The real crossover point and slope depend on the speaker impedance curve, not only component labels." },
    parts: [
      { zh: "电感：通常更阻碍高频，让低频通过低音支路。", en: "Inductor: typically impedes high frequency and passes the woofer band." },
      { zh: "电容：通常更阻碍低频，让高频通过高音支路。", en: "Capacitor: typically impedes low frequency and passes the tweeter band." },
      { zh: "电阻：衰减电平、修正响应或改善阻抗特性。", en: "Resistor: attenuates level, shapes response, or improves impedance behavior." }
    ]
  }
};

const icons = { amplifier: CircuitBoard, woofer: Speaker, crossover: Radio };

function PrincipleDiagram({ mode, language }: { mode: AnatomyMode; language: Language }) {
  const zh = language === "zh";
  const labels = mode === "amplifier"
    ? (zh ? ["输入小信号", "电压/电流增益", "输出级", "扬声器负载", "电源"] : ["Small signal", "Voltage/current gain", "Output stage", "Speaker load", "Power"])
    : mode === "woofer"
      ? (zh ? ["音频电流", "音圈", "磁隙中的力", "振膜运动", "空气声压"] : ["Audio current", "Voice coil", "Force in gap", "Diaphragm", "Air pressure"])
      : (zh ? ["功放输出", "低通支路", "低音单元", "高通支路", "高音单元"] : ["Amp output", "Low-pass", "Woofer", "High-pass", "Tweeter"]);
  return <svg className="amplifier-speaker-schematic" role="img" aria-label={zh ? `${modes[mode].label.zh}原理图` : `${modes[mode].label.en} principle diagram`} viewBox="0 0 620 300">
    <rect className="amplifier-speaker-schematic-bg" height="300" rx="12" width="620" />
    <path className="amplifier-speaker-schematic-line" d="M48 150 H572" />
    {mode === "amplifier" && <>
      {[{ x: 58, text: labels[0] }, { x: 190, text: labels[1] }, { x: 322, text: labels[2] }, { x: 454, text: labels[3] }].map(({ x, text }) => <g key={text}><rect className="amplifier-speaker-schematic-box" height="58" rx="7" width="108" x={x} y="121" /><text className="amplifier-speaker-schematic-text" textAnchor="middle" x={x + 54} y="155">{text}</text></g>)}
      <path className="amplifier-speaker-schematic-line" d="M376 121 V64 H250" /><text className="amplifier-speaker-schematic-label" x="258" y="55">{labels[4]}</text>
      <path className="amplifier-speaker-schematic-line feedback" d="M508 179 V238 H240 V179" /><text className="amplifier-speaker-schematic-label" x="270" y="260">{zh ? "反馈 / 保护" : "Feedback / protection"}</text>
    </>}
    {mode === "woofer" && <>
      <rect className="amplifier-speaker-schematic-box" height="58" rx="7" width="108" x="48" y="121" /><text className="amplifier-speaker-schematic-text" textAnchor="middle" x="102" y="155">{labels[0]}</text>
      <path className="amplifier-speaker-schematic-line" d="M156 150 H220" /><path className="amplifier-speaker-schematic-coil" d="M220 122 C250 138 250 162 220 178 C250 194 250 218 220 234" /><text className="amplifier-speaker-schematic-label" x="198" y="108">{labels[1]}</text>
      <rect className="amplifier-speaker-schematic-magnet" height="100" rx="8" width="30" x="290" y="100" /><text className="amplifier-speaker-schematic-label" x="274" y="82">{labels[2]}</text>
      <path className="amplifier-speaker-schematic-cone" d="M340 105 Q420 150 340 195" /><text className="amplifier-speaker-schematic-label" x="368" y="92">{labels[3]}</text>
      <path className="amplifier-speaker-schematic-wave" d="M468 150 C490 120 512 120 534 150 S578 180 600 150" /><text className="amplifier-speaker-schematic-label" textAnchor="end" x="598" y="220">{labels[4]}</text>
    </>}
    {mode === "crossover" && <>
      <rect className="amplifier-speaker-schematic-box" height="58" rx="7" width="108" x="42" y="121" /><text className="amplifier-speaker-schematic-text" textAnchor="middle" x="96" y="155">{labels[0]}</text>
      <path className="amplifier-speaker-schematic-line" d="M150 150 H224 M224 150 V92 H280 M224 150 V208 H280" />
      <rect className="amplifier-speaker-schematic-box" height="48" rx="7" width="116" x="280" y="68" /><text className="amplifier-speaker-schematic-text" textAnchor="middle" x="338" y="97">{labels[1]}</text>
      <rect className="amplifier-speaker-schematic-box" height="48" rx="7" width="116" x="280" y="184" /><text className="amplifier-speaker-schematic-text" textAnchor="middle" x="338" y="213">{labels[3]}</text>
      <path className="amplifier-speaker-schematic-line" d="M396 92 H490 M396 208 H490" /><text className="amplifier-speaker-schematic-label" x="430" y="82">{labels[2]}</text><text className="amplifier-speaker-schematic-label" x="430" y="230">{labels[4]}</text>
      <path className="amplifier-speaker-schematic-wave" d="M492 92 C510 72 528 72 546 92 S582 112 600 92" /><path className="amplifier-speaker-schematic-wave" d="M492 208 C510 188 528 188 546 208 S582 228 600 208" />
    </>}
  </svg>;
}

export function AmplifierSpeakerAnatomy({ language }: { language: Language }) {
  const [mode, setMode] = useState<AnatomyMode>("amplifier");
  const item = modes[mode];
  const Icon = icons[mode];
  return (
    <section className="amplifier-speaker-anatomy" aria-label={language === "zh" ? "功放与扬声器实物图解" : "Amplifier and speaker object guide"}>
      <div className="amplifier-speaker-modes" role="group" aria-label={language === "zh" ? "实物类型" : "Object type"}>
        {(Object.keys(modes) as AnatomyMode[]).map((itemMode) => { const ModeIcon = icons[itemMode]; return <button key={itemMode} type="button" aria-pressed={mode === itemMode} onClick={() => setMode(itemMode)}><ModeIcon size={17} aria-hidden="true" />{modes[itemMode].label[language]}</button>; })}
      </div>
      <div className="amplifier-speaker-anatomy-grid">
        <figure><img src={item.image} alt={item.alt[language]} width="960" height="640" loading="lazy" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = item.fallback; }} /><figcaption>{item.caption[language]}<small>{language === "zh" ? "仓库内实物图 · " : "Local product photo · "}<a href={item.sourceUrl} target="_blank" rel="noreferrer">{language === "zh" ? "查看产品来源" : "View source"}</a></small></figcaption></figure>
        <figure><PrincipleDiagram language={language} mode={mode} /><figcaption>{language === "zh" ? "原理图：抽象表示主要能量或信号路径，不按比例。" : "Principle diagram: an abstract signal or energy path, not to scale."}</figcaption></figure>
        <div className="amplifier-speaker-anatomy-copy"><div className="amplifier-speaker-anatomy-heading"><Icon size={20} aria-hidden="true" /><h3>{item.label[language]}</h3></div><p>{item.description[language]}</p><ul>{item.parts.map((part) => <li key={part.en}>{part[language]}</li>)}</ul></div>
      </div>
      <p className="amplifier-speaker-anatomy-note">{language === "zh" ? "详细内容负责识别器件与基本职责；功放类别、箱体、T/S 参数、分频和线阵列的可视化变化请在实验室中验证。" : "This guide identifies objects and their roles; use the lab to explore amplifier classes, enclosures, T/S parameters, crossovers, and line arrays."}</p>
    </section>
  );
}
