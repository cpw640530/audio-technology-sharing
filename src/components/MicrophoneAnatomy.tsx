import { traditional } from "../content/traditional";
import { useState } from "react";
import { Mic, CircuitBoard, Cpu } from "lucide-react";
import type { Language } from "../content/knowledge";

type SupportedLanguage = "zh" | "en" | "ja" | "ko" | "zh-Hant";

const languageIndex: Record<SupportedLanguage, number> = { zh: 0, "zh-Hant": traditional(0), en: 1, ja: 2, ko: 3 };

const models = [
  {
    id: "dynamic", icon: Mic, name: ["动圈话筒", "Dynamic", "ダイナミックマイク", "다이내믹 마이크"], photo: "microphone-dynamic.jpg",
    caption: ["手持动圈话筒：Shure SM58", "Handheld dynamic microphone: Shure SM58", "ハンドヘルド・ダイナミックマイク：Shure SM58", "핸드헬드 다이내믹 마이크: Shure SM58"],
    author: "Nicolas Esposito", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
    source: "https://commons.wikimedia.org/wiki/File:Micro_Shure_SM58.jpg",
    reference: "https://service.shure.com/articles/en_US/Knowledge/difference-between-a-dynamic-and-condenser-microphone",
    flow: [["声压", "振膜与线圈运动", "电磁感应", "模拟电压"], ["Pressure", "Diaphragm and coil motion", "Electromagnetic induction", "Analog voltage"], ["音圧", "振動板とボイスコイルの動き", "電磁誘導", "アナログ電圧"], ["음압", "진동판과 코일의 운동", "전자기 유도", "아날로그 전압"]],
    parts: [
      { name: ["振膜", "Diaphragm", "振動板", "진동판"], text: ["声压差推动振膜，振膜带动相连的线圈一起运动。", "Pressure differences move the diaphragm and its attached coil.", "音圧差が振動板を動かし、接続されたボイスコイルも一緒に動きます。", "음압 차이가 진동판을 움직이고 연결된 코일도 함께 움직입니다."], x: 185, y: 76 },
      { name: ["音圈", "Voice coil", "ボイスコイル", "보이스 코일"], text: ["线圈在磁隙内运动产生感应电压；振膜与线圈是机械连接。", "Motion of the coil in the magnetic gap induces a voltage; it is mechanically attached to the diaphragm.", "磁気ギャップ内のコイルの動きで電圧が誘導され、振動板と機械的に接続されています。", "자기 갭 안에서 코일이 움직이면 전압이 유도되며 진동판과 기계적으로 연결되어 있습니다."], x: 240, y: 133 },
      { name: ["磁路", "Magnetic circuit", "磁気回路", "자기 회로"], text: ["固定磁体与极片在磁隙中提供磁场，普通被动动圈音头不需要供电。", "The stationary magnet and pole pieces provide the gap field. A conventional passive moving-coil capsule needs no power.", "固定磁石とポールピースがギャップに磁界を作ります。一般的なパッシブ動電型カプセルに電源は不要です。", "고정 자석과 폴 피스가 갭에 자기장을 만듭니다. 일반적인 수동 다이내믹 캡슐에는 전원이 필요하지 않습니다."], x: 185, y: 196 }
    ]
  },
  {
    id: "electret", icon: CircuitBoard, name: ["驻极体咪头", "Electret", "エレクトレットマイクカプセル", "일렉트릿 마이크 캡슐"], photo: "microphone-electret.jpg",
    caption: ["驻极体咪头：不同封装与接线", "Electret capsules with different packages and wiring", "エレクトレットカプセル：異なるパッケージと配線", "서로 다른 패키지와 배선의 일렉트릿 캡슐"],
    author: "Omegatron", license: "CC BY-SA 3.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    source: "https://commons.wikimedia.org/wiki/File:Electret_condenser_microphone_capsules.jpg",
    reference: "https://www.ti.com/lit/ug/tidu765/tidu765.pdf",
    flow: [["声压", "电容变化", "JFET 阻抗变换", "模拟输出"], ["Pressure", "Capacitance change", "JFET impedance conversion", "Analog output"], ["音圧", "静電容量の変化", "JFETインピーダンス変換", "アナログ出力"], ["음압", "정전용량 변화", "JFET 임피던스 변환", "아날로그 출력"]],
    parts: [
      { name: ["振膜", "Diaphragm", "振動板", "진동판"], text: ["振膜与背板构成电容；声压使间距变化，从而改变电容。", "The diaphragm and backplate form a capacitor; pressure changes their spacing and capacitance.", "振動板と背板がコンデンサーを形成し、音圧で間隔と静電容量が変化します。", "진동판과 백플레이트가 커패시터를 이루며 음압이 간격과 정전용량을 바꿉니다."], x: 180, y: 80 },
      { name: ["背板与驻极体", "Backplate and electret", "背板とエレクトレット", "백플레이트와 일렉트릿"], text: ["以背驻极体结构为例，材料中的持久电荷提供极化，不代表整个咪头无需供电。", "In this back-electret example, persistent material charge provides polarization; this does not make the whole capsule power-free.", "バックエレクトレットの例では材料の残留電荷が分極を作りますが、カプセル全体に電源が不要という意味ではありません。", "백 일렉트릿 예에서는 재료의 영구 전하가 분극을 만들지만 캡슐 전체에 전원이 필요 없다는 뜻은 아닙니다."], x: 180, y: 127 },
      { name: ["JFET", "JFET", "JFET", "JFET"], text: ["高输入阻抗的 JFET 缓冲微弱信号；常见两线咪头由外部偏置电阻供电，并通过耦合电容取出交流信号。", "A high-input-impedance JFET buffers the small signal. Typical two-wire capsules use an external bias resistor and AC-coupled output.", "高入力インピーダンスのJFETが微弱信号をバッファします。一般的な2線式カプセルは外部バイアス抵抗で動作点を作り、結合コンデンサーで交流信号を取り出します。", "입력 임피던스가 높은 JFET가 미약한 신호를 버퍼링합니다. 일반적인 2선식 캡슐은 외부 바이어스 저항으로 동작점을 만들고 결합 커패시터로 교류 신호를 꺼냅니다."], x: 212, y: 211 }
    ]
  },
  {
    id: "mems", icon: Cpu, name: ["数字 MEMS 麦", "Digital MEMS", "デジタルMEMSマイク", "디지털 MEMS 마이크"], photo: "microphone-mems.jpg",
    caption: ["PCB 上的数字 MEMS 麦：Akustica AKU230", "Digital MEMS microphone on a PCB: Akustica AKU230", "PCB上のデジタルMEMSマイク：Akustica AKU230", "PCB의 디지털 MEMS 마이크: Akustica AKU230"],
    author: "© Raimond Spekking", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    source: "https://commons.wikimedia.org/wiki/File:Asus_Zenbook_UX32V_-_webcam_module_-_AK230_0539L_4911C-0108.jpg",
    reference: "https://www.knowles.com/docs/default-source/default-document-library/sisonic-design-guide.pdf",
    flow: [["声孔", "MEMS 电容变化", "ASIC 转换", "PDM / I2S"], ["Acoustic port", "MEMS capacitance change", "ASIC conversion", "PDM / I2S"], ["音響ポート", "MEMS静電容量の変化", "ASIC変換", "PDM / I2S"], ["음향 포트", "MEMS 정전용량 변화", "ASIC 변환", "PDM / I2S"]],
    parts: [
      { name: ["声孔", "Acoustic port", "音響ポート", "음향 포트"], text: ["图示为顶进音封装；也有底进音结构，安装时必须为声孔保留通道。", "This schematic shows a top-port package. Bottom-port designs also exist; mounting must leave an acoustic path.", "これはトップポート型の模式図です。ボトムポート型もあり、取り付け時は音響経路を確保する必要があります。", "이 그림은 톱 포트 패키지입니다. 바텀 포트 구조도 있으므로 장착할 때 음향 경로를 확보해야 합니다."], x: 115, y: 70 },
      { name: ["MEMS 传感器", "MEMS sensor", "MEMSセンサー", "MEMS 센서"], text: ["微机械振膜与背板构成电容式传感器，最初产生的仍是模拟电学变化。", "A micromachined diaphragm and backplate form a capacitive sensor. Its initial electrical variation is still analog.", "微細加工された振動板と背板が容量センサーを形成し、最初に生じる電気変化はアナログです。", "미세 가공 진동판과 백플레이트가 정전용량 센서를 이루며 처음 생기는 전기 변화는 여전히 아날로그입니다."], x: 115, y: 171 },
      { name: ["ASIC", "ASIC", "ASIC", "ASIC"], text: ["接口电路完成偏置、前端放大和模数转换。PDM 需后端抽取为 PCM；I2S 型号已在内部完成所需数字处理。", "The interface circuit provides bias, amplification, and conversion. PDM needs downstream decimation to PCM; I2S models include the required digital processing.", "インターフェース回路がバイアス、前段増幅、変換を行います。PDMは後段でPCMへデシメーションし、I2S型は必要なデジタル処理を内部で済ませます。", "인터페이스 회로가 바이어스, 전단 증폭, 변환을 수행합니다. PDM은 후단에서 PCM으로 데시메이션해야 하며 I2S 모델은 필요한 디지털 처리를 내부에서 끝냅니다."], x: 278, y: 171 }
    ]
  }
];

export function MicrophoneAnatomy({ language }: { language: Language }) {
  const [selected, setSelected] = useState(0);
  const [part, setPart] = useState(0);
  const l = languageIndex[language as SupportedLanguage];
  const model = models[selected];
  return (
    <section className="mic-anatomy" aria-label={["麦克风实物与剖面图解", "Microphone photos and cross-sections", "マイクの実物写真と断面図", "마이크 실물 사진과 단면도"][l]}>
      <div className="mic-anatomy-modes" role="group" aria-label={["麦克风类型", "Microphone type", "マイクの種類", "마이크 종류"][l]}>
        {models.map((item, index) => <button key={item.id} type="button" aria-pressed={selected === index} onClick={() => { setSelected(index); setPart(0); }}><item.icon size={18} aria-hidden="true" />{item.name[l]}</button>)}
      </div>
      <div className="mic-anatomy-visuals">
        <figure>
          <img src={`${import.meta.env.BASE_URL}images/${model.photo}`} alt={model.caption[l]} width="480" height="320" loading="lazy" />
          <figcaption>{model.caption[l]}<small>{model.author} / <a href={model.licenseUrl}>{model.license}</a> · <a href={model.source}>Wikimedia Commons</a> · {["缩放与压缩", "Resized and compressed", "縮小・圧縮済み", "크기 조정 및 압축"][l]}</small></figcaption>
        </figure>
        <figure>
          <svg viewBox="0 0 600 340" role="img" aria-label={`${model.name[l]}${["结构剖面示意", " cross-section schematic", "の断面模式図", " 단면도"][l]}`}>
            <text x="28" y="30">{["声压作用于振膜", "Sound pressure acts on the diaphragm", "音圧が振動板に作用", "음압이 진동판에 작용"][l]}</text>
            <path d={selected === 2 ? "M115 36 V48 M108 40 L115 48 L122 40" : "M155 42 V66 M148 58 L155 66 L162 58 M215 42 V66 M208 58 L215 66 L222 58"} stroke="#3264a0" fill="none" strokeWidth="2" />
            {selected === 0 ? <>
              <path d="M65 90 V251 H305 V90" fill="none" stroke="#879a92" strokeWidth="7" />
              <path d="M72 90 Q185 54 298 90" fill="#d7eee5" stroke="#226d60" strokeWidth="4" />
              <rect x="113" y="121" width="43" height="96" fill="#fff1cf" />
              <rect x="214" y="121" width="43" height="96" fill="#fff1cf" />
              <path d="M126 79 V176 M244 79 V176" stroke="#b47b42" strokeWidth="3" />
              <path d="M87 120 H112 V218 H157 V119 H213 V218 H258 V120 H283 V243 H87 Z" fill="#c7d3dd" stroke="#536879" strokeWidth="2" />
              <rect x="159" y="177" width="52" height="41" fill="#ba7671" stroke="#81524e" />
              {[132, 144, 156, 168].map(y => <g key={y} fill="#d9994c" stroke="#87581e"><circle cx="126" cy={y} r="5" /><circle cx="244" cy={y} r="5" /></g>)}
              <path d="M246 174 H323 V267 H350 M246 163 H334 V280 H350" stroke="#b47b42" strokeWidth="2" fill="none" />
              <path d="M320 97 V127 M314 104 L320 97 L326 104 M314 120 L320 127 L326 120" stroke="#226d60" fill="none" strokeWidth="2" />
              <g className="mic-gap-field" stroke="#3264a0" fill="none" strokeWidth="2">
                <path d="M151 190 H118 M125 185 L118 190 L125 195 M219 190 H252 M245 185 L252 190 L245 195" />
              </g>
              <text x="132" y="211">B</text><text x="228" y="211">B</text>
              <path d="M290 87 H380 M258 151 H380 M213 198 H380" stroke="#879a92" fill="none" />
              <text x="392" y="91">{["振膜 / 可动", "Diaphragm / moving", "振動板 / 可動部", "진동판 / 가동부"][l]}</text>
              <text x="392" y="145">{["音圈 / 磁隙内", "Coil / in the gap", "音声コイル / 磁気ギャップ内", "코일 / 자기 갭 내부"][l]}</text>
              <text x="392" y="168">{["同一环形线圈的两侧", "Two sides of one coil", "同じ環状コイルの両側", "하나의 환형 코일 양쪽"][l]}</text>
              <text x="392" y="202">{["永磁体与导磁极片", "Magnet + pole pieces", "永久磁石とポールピース", "영구 자석과 폴 피스"][l]}</text>
              <text x="365" y="279">{["两端模拟输出", "Analog output pair", "2端子アナログ出力", "2단자 아날로그 출력"][l]}</text>
              <text x="28" y="302">{["振膜与音圈沿轴向往复；磁路固定。", "Diaphragm and coil move axially; the magnetic circuit is fixed.", "振動板とコイルは軸方向に往復し、磁気回路は固定。", "진동판과 코일은 축 방향으로 왕복하며 자기 회로는 고정."][l]}</text>
              <text x="28" y="325">{["浅黄色：磁隙；B 箭头：磁场方向示例。", "Pale yellow: air gaps. B arrows: example field direction.", "薄黄色：磁気ギャップ。B矢印：磁界方向の一例。", "연한 노랑: 자기 갭. B 화살표: 자기장 방향의 예."][l]}</text>
            </> : selected === 1 ? <>
              <path d="M65 78 V260 H315 V78" fill="#f0f4f2" stroke="#879a92" strokeWidth="5" />
              <rect x="82" y="96" width="216" height="25" fill="#e5f3fb" />
              <path d="M72 89 C110 89 120 89 190 89 C260 89 270 89 308 89" fill="none" stroke="#226d60" strokeWidth="4" className="mic-diaphragm-motion" />
              <path d="M72 83 V95 M308 83 V95" stroke="#536879" strokeWidth="7" />
              <path d="M82 128 H298" stroke="#b87838" strokeWidth="6" strokeDasharray="23 6" />
              <path d="M82 139 H298" stroke="#8d9fab" strokeWidth="12" strokeDasharray="23 6" />
              <path d="M190 145 V204 H212 M268 201 H330 V247 M268 224 H288 V260" stroke="#536879" fill="none" strokeWidth="2" />
              <rect x="212" y="184" width="56" height="47" rx="3" fill="#d7eee5" stroke="#226d60" />
              <text x="240" y="214" textAnchor="middle">JFET</text>
              <path d="M298 89 H379 M298 108 H355 V121 H379 M298 128 H343 V157 H379 M298 143 H330 V185 H379" stroke="#879a92" fill="none" />
              <text x="392" y="93">{["导电振膜 / 可动", "Conductive diaphragm", "導電振動板 / 可動部", "전도성 진동판 / 가동부"][l]}</text>
              <text x="392" y="125">{["空气间隙 d", "Air gap d", "空気ギャップ d", "공기 갭 d"][l]}</text>
              <text x="392" y="161">{["驻极体层 / 持久电荷", "Electret / stored charge", "エレクトレット層 / 残留電荷", "일렉트릿층 / 영구 전하"][l]}</text>
              <text x="392" y="189">{["穿孔背板 / 固定", "Fixed, perforated plate", "穴あき背板 / 固定", "고정 백플레이트"][l]}</text>
              <text x="352" y="251">{["信号 + 供电端", "Signal + bias terminal", "信号 + バイアス端子", "신호 + 바이어스 단자"][l]}</text>
              <text x="250" y="276">{["外壳 / 地", "Case / ground", "ケース / グランド", "케이스 / 접지"][l]}</text>
              <text x="28" y="302">{["振膜边缘固定，中心挠曲；间隙随位置变化。", "The rim is clamped; the center flexes, changing the local gap.", "振動板の縁は固定し、中心がたわんで局所的な間隔が変化。", "진동판 가장자리는 고정되고 중앙이 휘어 국소 간격이 변화."][l]}</text>
              <text x="28" y="325">{["C ≈ εA/d 为均匀间隙近似；驻极体提供极化。", "C ≈ εA/d assumes a uniform gap; the electret provides polarization.", "C ≈ εA/dは一様な間隔の近似。エレクトレットは分極を提供。", "C ≈ εA/d는 균일 간격 근사이며 일렉트릿은 분극을 제공."][l]}</text>
            </> : <>
              <path d="M50 240 V72 H94 M138 72 H350 V240" fill="none" stroke="#879a92" strokeWidth="8" />
              <path d="M46 242 H354" stroke="#627c6c" strokeWidth="12" />
              <path d="M80 228 V147 H96 V209 H140 V147 H156 V228 Z" fill="#c9d8e2" stroke="#536879" strokeWidth="2" />
              <path d="M96 157 H140" stroke="#b87838" strokeWidth="5" strokeDasharray="8 4" />
              <path d="M96 175 Q118 184 140 175" fill="none" stroke="#226d60" strokeWidth="3" />
              <rect x="238" y="171" width="80" height="60" fill="#d7eee5" stroke="#226d60" rx="3" />
              <text x="278" y="207" textAnchor="middle">ASIC</text>
              <g className="mic-electrode-connections" fill="none" stroke="#c46f2a" strokeWidth="2">
                <path d="M140 157 H174 V151 H222 V186 H238" />
                <path d="M140 175 H164 V211 H238" />
                <circle cx="140" cy="157" r="3" fill="#c46f2a" /><circle cx="140" cy="175" r="3" fill="#c46f2a" />
              </g>
              <path d="M302 231 V258 H353" fill="none" stroke="#c46f2a" strokeWidth="3" />
              <path d="M115 90 V130 M108 120 L115 130 L122 120" fill="none" stroke="#3264a0" strokeWidth="2" />
              <text x="383" y="79">{["传感器局部放大", "Sensor detail", "センサー拡大図", "센서 상세"][l]}</text>
              <rect x="382" y="94" width="192" height="122" fill="#f0f6fa" stroke="#b2c6d0" />
              <path d="M398 123 H550" stroke="#b87838" strokeWidth="7" strokeDasharray="18 8" />
              <path d="M398 177 Q474 195 550 177" fill="none" stroke="#226d60" strokeWidth="3" />
              <path d="M156 160 L382 94" stroke="#879a92" strokeDasharray="4 4" />
              <text x="398" y="111">{["固定背板", "Fixed backplate", "固定背板", "고정 백플레이트"][l]}</text>
              <text x="398" y="151">{["空气间隙", "Air gap", "空気ギャップ", "공기 갭"][l]}</text>
              <text x="398" y="205">{["可动振膜", "Moving diaphragm", "可動振動板", "가동 진동판"][l]}</text>
              <text x="168" y="270">{["电极 → ASIC", "Electrodes → ASIC", "電極 → ASIC", "전극 → ASIC"][l]}</text>
              <text x="375" y="262">PDM / I2S</text>
              <text x="28" y="290">{["ASIC：偏置 / 前端 / ADC / 数字接口", "ASIC: bias / front end / ADC / digital I/O", "ASIC：バイアス / 前段 / ADC / デジタル入出力", "ASIC: 바이어스 / 전단 / ADC / 디지털 I/O"][l]}</text>
              <text x="28" y="319">{["顶进音示意；PDM、I2S 为不同型号接口。", "Top-port example; PDM and I2S are alternative interfaces.", "トップポートの例。PDMとI2Sは機種ごとの接続方式。", "톱 포트 예시. PDM과 I2S는 모델별 인터페이스."][l]}</text>
            </>}
            {model.parts.map((item, index) => <g key={item.name[1]} role="button" tabIndex={0} aria-label={item.name[l]} aria-pressed={part === index} onClick={() => setPart(index)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setPart(index); } }} className="mic-anatomy-hotspot">
              <title>{item.name[l]}</title>
              <circle cx="28" cy={78 + index * 62} r="22" fill="transparent" />
              <path d={`M42 ${78 + index * 62} H54 L${item.x} ${item.y}`} fill="none" stroke="#879a92" strokeDasharray="3 3" />
              <circle cx="28" cy={78 + index * 62} r="14" fill={part === index ? "#226d60" : "#fff"} stroke="#226d60" strokeWidth="2" />
              <text x="28" y={83 + index * 62} textAnchor="middle" style={{ fill: part === index ? "#fff" : "#234c43" }}>{index + 1}</text>
            </g>)}
          </svg>
          <figcaption>{["通用原理剖面，非照片型号拆解；非实际比例。封装与声孔因型号而异。", "Generic principle, not a teardown of the photographed model; not to scale. Packages and port locations vary.", "一般原理の断面図であり、写真の機種を分解したものではありません。縮尺は実寸ではなく、パッケージとポート位置は機種で異なります。", "일반 원리 단면도이며 사진 속 모델을 분해한 것이 아닙니다. 실제 비율이 아니고 패키지와 포트 위치는 모델마다 다릅니다."][l]}{selected === 1 && [" 振膜运动为慢速夸张示意，不表示实际振幅或频率。", " Diaphragm motion is slowed and exaggerated, not an actual amplitude or frequency.", " 振動板の動きは低速化・誇張した表示で、実際の振幅や周波数ではありません。", " 진동판 움직임은 느리게 과장한 표현이며 실제 진폭이나 주파수를 나타내지 않습니다."][l]}</figcaption>
        </figure>
      </div>
      <div className="mic-anatomy-parts" role="group" aria-label={["结构部件", "Components", "構成部品", "구성 부품"][l]}>
        {model.parts.map((item, index) => <button key={item.name[1]} type="button" aria-pressed={part === index} onClick={() => setPart(index)}>{index + 1}. {item.name[l]}</button>)}
      </div>
      <p className="mic-anatomy-explanation" aria-live="polite">{model.parts[part].text[l]}</p>
      {selected === 1 && <div className="mic-anatomy-bias">
        <h4>{["两线驻极体：外部偏置与取出信号", "Two-wire electret: external bias and signal coupling", "2線式エレクトレット：外部バイアスと信号取り出し", "2선식 일렉트릿: 외부 바이어스와 신호 추출"][l]}</h4>
        <svg viewBox="0 0 600 210" role="img" aria-label={["驻极体外部偏置简化电路", "Simplified electret bias circuit", "エレクトレット外部バイアスの簡略回路", "일렉트릿 외부 바이어스 간략 회로"][l]}>
          <g stroke="#536879" strokeWidth="2" fill="none">
            <path d="M270 32 V45 M270 79 V107 H345 M359 107 H440 M270 107 V134 M270 170 V187 M255 187 H285 M260 193 H280 M266 199 H274" />
            <rect x="262" y="45" width="16" height="34" />
            <path d="M345 91 V123 M359 91 V123" />
            <rect x="190" y="134" width="160" height="36" rx="4" fill="#e5ede7" />
            <circle cx="270" cy="107" r="3" fill="#536879" />
          </g>
          <text x="245" y="23">Vbias</text><text x="300" y="54">{["偏置电阻 R", "Bias resistor R", "バイアス抵抗 R", "바이어스 저항 R"][l]}</text>
          <text x="333" y="80">{["耦合电容", "Coupling C", "結合コンデンサー", "결합 커패시터"][l]}</text>
          <text x="450" y="111">{["交流输出", "AC output", "交流出力", "교류 출력"][l]}</text>
          <text x="215" y="158">{["咪头 / JFET", "Capsule / JFET", "カプセル / JFET", "캡슐 / JFET"][l]}</text>
          <text x="28" y="95">{["咪头内部电路", "Internal circuit", "カプセル内部回路", "캡슐 내부 회로"][l]}</text>
          <text x="28" y="120">{["采用功能块简化", "shown as a block", "機能ブロックで簡略化", "기능 블록으로 단순화"][l]}</text>
        </svg>
        <p>{["驻极体提供持久极化；外部电源经电阻为内部 JFET 建立工作点。声信号使电流变化，电阻将其转为电压变化，耦合电容隔开直流。JFET 主要进行阻抗变换，不能默认它有固定的电压放大倍数。", "The electret provides persistent polarization. The external supply and resistor bias the internal JFET. Signal current variations produce voltage variations across the resistor; the coupling capacitor blocks DC. The JFET primarily provides impedance conversion, not a guaranteed fixed voltage gain.", "エレクトレットが持続分極を作り、外部電源と抵抗が内部JFETの動作点を設定します。信号電流の変化は抵抗で電圧変化になり、結合コンデンサーが直流を遮断します。JFETは主にインピーダンス変換を担い、一定の電圧利得があるとは限りません。", "일렉트릿이 지속적인 분극을 만들고 외부 전원과 저항이 내부 JFET의 동작점을 설정합니다. 신호 전류 변화는 저항에서 전압 변화가 되고 결합 커패시터가 직류를 차단합니다. JFET는 주로 임피던스 변환을 하며 일정한 전압 이득을 보장하지 않습니다."][l]}</p>
        <a href="https://www.bilibili.com/video/BV1mB4y1x7pV/">{["延伸视频：爱上半导体 · 驻极话筒的工作原理", "Further viewing: 爱上半导体 · How electret microphones work (Chinese)", "関連動画：愛上半導体 · エレクトレットマイクの動作原理（中国語）", "추가 영상: 爱上半导体 · 일렉트릿 마이크 작동 원리(중국어)"][l]}</a>
      </div>}
      <ol className="mic-anatomy-flow" aria-label={["换能信号流程", "Transduction signal flow", "変換信号の流れ", "변환 신호 흐름"][l]}>{model.flow[l].map((step) => <li key={step}>{step}</li>)}</ol>
      <a className="mic-anatomy-reference" href={model.reference}>{["原理参考：厂商技术资料", "Principle reference: manufacturer documentation", "原理参考：メーカー技術資料", "원리 참고: 제조사 기술 문서"][l]}</a>
    </section>
  );
}
