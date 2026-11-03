import { useState } from "react";
import { CircuitBoard, Radio, Speaker } from "lucide-react";
import type { Language } from "../content/knowledge";

type SupportedLanguage = "zh" | "en" | "ja" | "ko";
type LocalizedText = Record<SupportedLanguage, string>;

const languageIndex: Record<SupportedLanguage, number> = { zh: 0, en: 1, ja: 2, ko: 3 };
const localized = (language: Language, values: [string, string, string, string]) => values[languageIndex[language as SupportedLanguage]];

type AnatomyMode = "amplifier" | "woofer" | "crossover";

const modes: Record<AnatomyMode, {
  label: LocalizedText;
  image: string;
  sourceUrl: string;
  fallback: string;
  alt: LocalizedText;
  caption: LocalizedText;
  description: LocalizedText;
  parts: Array<LocalizedText>;
}> = {
  amplifier: {
    label: { zh: "功放板", en: "Amplifier board", ja: "アンプ基板", ko: "앰프 보드" },
    image: `${import.meta.env.BASE_URL}images/amplifier-board-product.jpg`,
    sourceUrl: "https://www.tinytronics.nl/en/audio/amplifiers/tpa3116-2x50w-audio-amplifier",
    fallback: `${import.meta.env.BASE_URL}images/amplifier-board.svg`,
    alt: { zh: "Synte 2 音频功放板实物图", en: "Synte 2 audio amplifier board", ja: "Synte 2オーディオアンプ基板の実物写真", ko: "Synte 2 오디오 앰프 보드 실물 사진" },
    caption: { zh: "功放板实物：先找输入、供电、散热和扬声器输出。", en: "Amplifier board: identify input, power, cooling, and speaker output first.", ja: "アンプ基板の実物：まず入力、電源、放熱、スピーカー出力を確認します。", ko: "앰프 보드 실물: 먼저 입력, 전원, 방열, 스피커 출력을 확인합니다." },
    description: { zh: "这类功放板把前级或 DAC 的小信号变成能够驱动负载的电压和电流。照片用于认识布局，不代表所有 Class A、AB 或 D 功放的固定结构。", en: "This type of amplifier board turns a preamp or DAC signal into the voltage and current needed by a load. The photo teaches layout, not a fixed structure for every Class A, AB, or D amplifier.", ja: "この種のアンプ基板は、プリアンプやDACの小信号を負荷を駆動できる電圧と電流に変換します。写真は配置を理解するためのもので、すべてのClass A、AB、Dアンプが同じ構造という意味ではありません。", ko: "이런 앰프 보드는 프리앰프나 DAC의 작은 신호를 부하를 구동할 수 있는 전압과 전류로 바꿉니다. 사진은 배치를 이해하기 위한 예이며 모든 Class A, AB, D 앰프의 구조가 같다는 뜻은 아닙니다." },
    parts: [
      { zh: "散热器：把功率器件产生的热量传到空气。", en: "Heatsink: transfers power-device heat to the air.", ja: "ヒートシンク：パワー素子の熱を空気へ逃がします。", ko: "방열판: 전력 소자의 열을 공기로 전달합니다." },
      { zh: "电源与滤波电容：提供稳定的电压和瞬态电流。", en: "Power and filter capacitors: provide stable voltage and transient current.", ja: "電源と平滑コンデンサー：安定した電圧と過渡電流を供給します。", ko: "전원과 필터 커패시터: 안정적인 전압과 과도 전류를 제공합니다." },
      { zh: "输出端：连接扬声器负载，电流能力和阻抗需要匹配。", en: "Output: connects the speaker load; current capability and impedance must match.", ja: "出力端子：スピーカー負荷を接続し、電流能力とインピーダンスを合わせます。", ko: "출력 단자: 스피커 부하를 연결하며 전류 용량과 임피던스를 맞춰야 합니다." }
    ]
  },
  woofer: {
    label: { zh: "动圈扬声器", en: "Moving-coil woofer", ja: "動電型ウーファー", ko: "다이내믹 우퍼" },
    image: `${import.meta.env.BASE_URL}images/speaker-woofer-product.jpg`,
    sourceUrl: "https://speakerrepairshop.nl/en/rubber-surrounds/bowers-wilkins/rubber-surround-for-b-w-dm604-woofer-zz10065/a-5932-10000098",
    fallback: `${import.meta.env.BASE_URL}images/speaker-woofer.svg`,
    alt: { zh: "两个动圈低音扬声器单元实物图", en: "Two moving-coil woofer drivers", ja: "2基の動電型ウーファードライバーの実物写真", ko: "다이내믹 우퍼 드라이버 2개의 실물 사진" },
    caption: { zh: "扬声器单元实物：框架、纸盆、悬边和磁路共同完成换能。", en: "Speaker drivers: frame, cone, surround, and motor work together as a transducer.", ja: "スピーカードライバーの実物：フレーム、コーン、エッジ、磁気回路が一体で変換を行います。", ko: "스피커 드라이버 실물: 프레임, 콘, 서라운드, 모터가 함께 변환을 수행합니다." },
    description: { zh: "扬声器不是只有一个纸盆。音圈在磁隙中受力，带动振膜；悬边和定心支片提供回弹与定位，框架和磁路决定机械稳定性。", en: "A speaker is more than a cone. Force on the voice coil in the magnetic gap moves the diaphragm; surround and spider provide restoring force and centering, while the frame and motor provide stability.", ja: "スピーカーはコーンだけではありません。磁気ギャップ内でボイスコイルに働く力が振動板を動かし、エッジとダンパーが復元力とセンタリングを担い、フレームと磁気回路が機械的安定性を決めます。", ko: "스피커는 콘만으로 이루어지지 않습니다. 자기 갭 안의 보이스 코일에 작용하는 힘이 진동판을 움직이고, 서라운드와 스파이더가 복원력과 중심 유지를 담당하며 프레임과 모터가 기계적 안정성을 결정합니다." },
    parts: [
      { zh: "纸盆与防尘帽：把机械运动耦合为空气声压。", en: "Cone and dust cap: couple mechanical motion to air pressure.", ja: "コーンとダストキャップ：機械運動を空気圧へ結合します。", ko: "콘과 더스트 캡: 기계적 운동을 공기 압력으로 결합합니다." },
      { zh: "悬边与定心支片：限制行程并让音圈保持在磁隙中央。", en: "Surround and spider: limit excursion and keep the coil centered.", ja: "エッジとダンパー：振幅を制限し、ボイスコイルを磁気ギャップの中央に保ちます。", ko: "서라운드와 스파이더: 변위를 제한하고 보이스 코일을 자기 갭 중앙에 유지합니다." },
      { zh: "磁路与音圈：电流在磁场中产生力，决定效率和失真边界。", en: "Motor and voice coil: current in the magnetic field creates force, shaping efficiency and distortion limits.", ja: "磁気回路とボイスコイル：磁界中の電流が力を生み、効率と歪みの限界を左右します。", ko: "모터와 보이스 코일: 자기장 속 전류가 힘을 만들어 효율과 왜곡 한계를 결정합니다." }
    ]
  },
  crossover: {
    label: { zh: "被动分频器", en: "Passive crossover", ja: "パッシブ・クロスオーバー", ko: "패시브 크로스오버" },
    image: `${import.meta.env.BASE_URL}images/speaker-crossover-product.jpg`,
    sourceUrl: "https://www.time-tunnel.com.au/speakers/loudspeaker-crossover-network-2-way-100w-rms-handling-with-tech-info-used/",
    fallback: `${import.meta.env.BASE_URL}images/speaker-crossover.svg`,
    alt: { zh: "B&W DM2000 扬声器被动分频器实物图", en: "B&W DM2000 loudspeaker crossover", ja: "B&W DM2000スピーカーのパッシブ・クロスオーバー実物写真", ko: "B&W DM2000 스피커 패시브 크로스오버 실물 사진" },
    caption: { zh: "被动分频器实物：电感、电容和电阻组成不同频段的滤波网络。", en: "Passive crossover: inductors, capacitors, and resistors form band-splitting networks.", ja: "パッシブ・クロスオーバーの実物：コイル、コンデンサー、抵抗で帯域分割フィルターを構成します。", ko: "패시브 크로스오버 실물: 인덕터, 커패시터, 저항으로 대역 분할 필터를 구성합니다." },
    description: { zh: "被动分频器位于功放之后，用无源元件把高频和低频分给不同单元。实际分频点和斜率会受到扬声器阻抗曲线影响，不能只按元件标称值判断。", en: "A passive crossover sits after the amplifier and uses passive components to route high and low bands to different drivers. The real crossover point and slope depend on the speaker impedance curve, not only component labels.", ja: "パッシブ・クロスオーバーはアンプの後段に置かれ、受動部品で高域と低域を別のドライバーへ振り分けます。実際の分周点と傾きは部品定数だけでなく、スピーカーのインピーダンス曲線にも左右されます。", ko: "패시브 크로스오버는 앰프 뒤에 놓이며 수동 부품으로 고역과 저역을 서로 다른 드라이버에 분배합니다. 실제 크로스오버 주파수와 기울기는 부품 표기값뿐 아니라 스피커 임피던스 곡선의 영향도 받습니다." },
    parts: [
      { zh: "电感：通常更阻碍高频，让低频通过低音支路。", en: "Inductor: typically impedes high frequency and passes the woofer band.", ja: "コイル：通常は高域を通しにくくし、ウーファー帯域を通します。", ko: "인덕터: 보통 고주파를 막고 우퍼 대역을 통과시킵니다." },
      { zh: "电容：通常更阻碍低频，让高频通过高音支路。", en: "Capacitor: typically impedes low frequency and passes the tweeter band.", ja: "コンデンサー：通常は低域を通しにくくし、ツイーター帯域を通します。", ko: "커패시터: 보통 저주파를 막고 트위터 대역을 통과시킵니다." },
      { zh: "电阻：衰减电平、修正响应或改善阻抗特性。", en: "Resistor: attenuates level, shapes response, or improves impedance behavior.", ja: "抵抗：レベルを減衰させ、応答を整え、インピーダンス特性を改善します。", ko: "저항: 레벨을 감쇠하고 응답을 조정하거나 임피던스 특성을 개선합니다." }
    ]
  }
};

const icons = { amplifier: CircuitBoard, woofer: Speaker, crossover: Radio };

function PrincipleDiagram({ mode, language }: { mode: AnatomyMode; language: Language }) {
  const diagramLabels = mode === "amplifier"
    ? ["输入小信号", "电压/电流增益", "输出级", "扬声器负载", "电源", "Small signal", "Gain", "Output stage", "Speaker load", "Power", "小信号入力", "電圧・電流利得", "出力段", "スピーカー負荷", "電源", "작은 신호 입력", "전압/전류 이득", "출력단", "스피커 부하", "전원"]
    : mode === "woofer"
      ? ["音频电流", "音圈", "磁隙中的力", "振膜运动", "空气声压", "Audio current", "Voice coil", "Force in gap", "Diaphragm", "Air pressure", "オーディオ電流", "ボイスコイル", "ギャップ内の力", "振動板の動き", "空気圧", "오디오 전류", "보이스 코일", "갭 안의 힘", "진동판 운동", "공기 압력"]
      : ["功放输出", "低通支路", "低音单元", "高通支路", "高音单元", "Amp output", "Low-pass", "Woofer", "High-pass", "Tweeter", "アンプ出力", "ローパス経路", "ウーファー", "ハイパス経路", "ツイーター", "앰프 출력", "저역 통과 경로", "우퍼", "고역 통과 경로", "트위터"];
  const label = (index: number) => diagramLabels[index + languageIndex[language as SupportedLanguage] * 5];
  return <svg className="amplifier-speaker-schematic" role="img" aria-label={localized(language, [`${modes[mode].label.zh}原理图`, `${modes[mode].label.en} principle diagram`, `${modes[mode].label.ja}の原理図`, `${modes[mode].label.ko} 원리도`])} viewBox="0 0 620 300">
    <rect className="amplifier-speaker-schematic-bg" height="300" rx="12" width="620" />
    {mode !== "crossover" && <path className="amplifier-speaker-schematic-line" d="M48 150 H572" />}
    {mode === "amplifier" && <>
      {[{ x: 58, text: label(0) }, { x: 190, text: label(1) }, { x: 322, text: label(2) }, { x: 454, text: label(3) }].map(({ x, text }) => <g key={text}><rect className="amplifier-speaker-schematic-box" height="58" rx="7" width="108" x={x} y="121" /><text className="amplifier-speaker-schematic-text" textAnchor="middle" x={x + 54} y="155">{text}</text></g>)}
      <path className="amplifier-speaker-schematic-line" d="M376 121 V64 H250" /><text className="amplifier-speaker-schematic-label" x="258" y="55">{label(4)}</text>
      <path className="amplifier-speaker-schematic-line feedback" d="M508 179 V238 H240 V179" /><text className="amplifier-speaker-schematic-label" x="270" y="260">{localized(language, ["反馈 / 保护", "Feedback / protection", "フィードバック / 保護", "피드백 / 보호"])}</text>
    </>}
    {mode === "woofer" && <>
      <rect className="amplifier-speaker-schematic-box" height="58" rx="7" width="108" x="48" y="121" /><text className="amplifier-speaker-schematic-text" textAnchor="middle" x="102" y="155">{label(0)}</text>
      <path className="amplifier-speaker-schematic-line" d="M156 150 H220" /><path className="amplifier-speaker-schematic-coil" d="M220 122 C250 138 250 162 220 178 C250 194 250 218 220 234" /><text className="amplifier-speaker-schematic-label" x="198" y="108">{label(1)}</text>
      <rect className="amplifier-speaker-schematic-magnet" height="100" rx="8" width="30" x="290" y="100" /><text className="amplifier-speaker-schematic-label" x="274" y="82">{label(2)}</text>
      <path className="amplifier-speaker-schematic-cone" d="M340 105 Q420 150 340 195" /><text className="amplifier-speaker-schematic-label" x="368" y="92">{label(3)}</text>
      <path className="amplifier-speaker-schematic-wave" d="M468 150 C490 120 512 120 534 150 S578 180 600 150" /><text className="amplifier-speaker-schematic-label" textAnchor="end" x="598" y="220">{label(4)}</text>
    </>}
    {mode === "crossover" && <>
      <rect className="amplifier-speaker-schematic-box" height="58" rx="7" width="108" x="42" y="121" /><text className="amplifier-speaker-schematic-text" textAnchor="middle" x="96" y="155">{label(0)}</text>
      <path className="amplifier-speaker-schematic-line" d="M150 150 H224 M224 150 V92 H280 M224 150 V208 H280" />
      <rect className="amplifier-speaker-schematic-box" height="48" rx="7" width="116" x="280" y="68" /><text className="amplifier-speaker-schematic-text" textAnchor="middle" x="338" y="97">{label(1)}</text>
      <rect className="amplifier-speaker-schematic-box" height="48" rx="7" width="116" x="280" y="184" /><text className="amplifier-speaker-schematic-text" textAnchor="middle" x="338" y="213">{label(3)}</text>
      <path className="amplifier-speaker-schematic-line" d="M396 92 H490 M396 208 H490" /><text className="amplifier-speaker-schematic-label" x="430" y="82">{label(2)}</text><text className="amplifier-speaker-schematic-label" x="430" y="230">{label(4)}</text>
      <path className="amplifier-speaker-schematic-wave" d="M492 92 C510 72 528 72 546 92 S582 112 600 92" /><path className="amplifier-speaker-schematic-wave" d="M492 208 C510 188 528 188 546 208 S582 228 600 208" />
    </>}
  </svg>;
}

export function AmplifierSpeakerAnatomy({ language }: { language: Language }) {
  const [mode, setMode] = useState<AnatomyMode>("amplifier");
  const item = modes[mode];
  const Icon = icons[mode];
  return (
    <section className="amplifier-speaker-anatomy" aria-label={localized(language, ["功放与扬声器实物图解", "Amplifier and speaker object guide", "アンプとスピーカーの実物ガイド", "앰프와 스피커 실물 안내"])}>
      <div className="amplifier-speaker-modes" role="group" aria-label={localized(language, ["实物类型", "Object type", "対象の種類", "대상 종류"])}>
        {(Object.keys(modes) as AnatomyMode[]).map((itemMode) => { const ModeIcon = icons[itemMode]; return <button key={itemMode} type="button" aria-pressed={mode === itemMode} onClick={() => setMode(itemMode)}><ModeIcon size={17} aria-hidden="true" />{modes[itemMode].label[language]}</button>; })}
      </div>
      <div className="amplifier-speaker-anatomy-grid">
        <figure><img src={item.image} alt={item.alt[language]} width="960" height="640" loading="lazy" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = item.fallback; }} /><figcaption>{item.caption[language]}<small>{localized(language, ["仓库内实物图 · ", "Local product photo · ", "ローカル製品写真 · ", "로컬 제품 사진 · "])}<a href={item.sourceUrl} target="_blank" rel="noreferrer">{localized(language, ["查看产品来源", "View source", "製品情報を見る", "제품 출처 보기"])}</a></small></figcaption></figure>
        <figure><PrincipleDiagram language={language} mode={mode} /><figcaption>{localized(language, ["原理图：抽象表示主要能量或信号路径，不按比例。", "Principle diagram: an abstract signal or energy path, not to scale.", "原理図：主なエネルギーまたは信号経路を抽象化したもので、縮尺は実寸ではありません。", "원리도: 주요 에너지 또는 신호 경로를 추상화했으며 실제 비율이 아닙니다."])}</figcaption></figure>
        <div className="amplifier-speaker-anatomy-copy"><div className="amplifier-speaker-anatomy-heading"><Icon size={20} aria-hidden="true" /><h3>{item.label[language]}</h3></div><p>{item.description[language]}</p><ul>{item.parts.map((part) => <li key={part.en}>{part[language]}</li>)}</ul></div>
      </div>
    </section>
  );
}
