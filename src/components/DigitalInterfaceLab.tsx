import { traditional } from "../content/traditional";
import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import type { Language } from "../content/knowledge";

type SupportedLanguage = "zh" | "en" | "ja" | "ko" | "zh-Hant";
type LocalizedText = Record<SupportedLanguage, string>;

const localized = (language: Language, values: LocalizedText) => values[language as SupportedLanguage];

type DigitalInterfaceLabProps = {
  language: Language;
  onBack: () => void;
  onBackToDetails?: () => void;
};

type InterfaceProtocol = "i2s" | "tdm" | "pdm" | "spdif" | "usb";

const protocolLabels: Record<InterfaceProtocol, LocalizedText> = {
  i2s: { zh: "I2S", "zh-Hant": traditional("I2S"), en: "I2S", ja: "I2S", ko: "I2S" },
  tdm: { zh: "TDM", "zh-Hant": traditional("TDM"), en: "TDM", ja: "TDM", ko: "TDM" },
  pdm: { zh: "PDM", "zh-Hant": traditional("PDM"), en: "PDM", ja: "PDM", ko: "PDM" },
  spdif: { zh: "SPDIF", "zh-Hant": traditional("SPDIF"), en: "SPDIF", ja: "SPDIF", ko: "SPDIF" },
  usb: { zh: "USB Audio", "zh-Hant": traditional("USB Audio"), en: "USB Audio", ja: "USB Audio", ko: "USB Audio" }
};

const protocolCopy: Record<
  InterfaceProtocol,
  {
    title: LocalizedText;
    body: LocalizedText;
  }
> = {
  i2s: {
    title: { zh: "协议：I2S / IIS / I²S", "zh-Hant": traditional("协议：I2S / IIS / I²S"), en: "Protocol: I2S / IIS / I²S", ja: "プロトコル：I2S / IIS / I²S", ko: "프로토콜: I2S / IIS / I²S" },
    body: {
      zh: "增加总通道数时，会增加并行 SD 线，而不是提高单条线的位时钟。图中表示数字样本的传输顺序，不表示 ADC 在左右半帧分别采样。", "zh-Hant": traditional("增加总通道数时，会增加并行 SD 线，而不是提高单条线的位时钟。图中表示数字样本的传输顺序，不表示 ADC 在左右半帧分别采样。"),
      en: "Adding channels adds parallel SD lines rather than increasing the bit clock per line. The diagram shows sample transport order, not alternating left/right ADC acquisition.",
      ja: "チャンネルを増やすと1本あたりのビットクロックを上げるのではなく、並列のSD線を追加します。図はサンプルの伝送順を示すもので、ADCが左右を交互に収音する動作を示しているわけではありません。",
      ko: "채널을 늘리면 각 라인의 비트 클록을 높이는 대신 병렬 SD 라인을 추가합니다. 그림은 샘플 전송 순서를 보여줄 뿐 ADC가 좌우를 번갈아 캡처하는 동작을 나타내지는 않습니다."
    }
  },
  tdm: {
    title: { zh: "协议：TDM 多通道时分复用", "zh-Hant": traditional("协议：TDM 多通道时分复用"), en: "Protocol: TDM multichannel time division", ja: "プロトコル：TDMマルチチャンネル時分割", ko: "프로토콜: TDM 다채널 시분할" },
    body: {
      zh: "保持 slot 宽度不变，降低有效位深只增加填充位，不降低 BCLK；改变 slot 数或宽度才改变帧长。缩小时隙会同步降低超出范围的位深，提高位深则自动扩展时隙。", "zh-Hant": traditional("保持 slot 宽度不变，降低有效位深只增加填充位，不降低 BCLK；改变 slot 数或宽度才改变帧长。缩小时隙会同步降低超出范围的位深，提高位深则自动扩展时隙。"),
      en: "With fixed slot width, reducing valid bit depth adds padding without lowering BCLK. Slot count and width set frame length. Narrowing a slot also reduces any excessive bit depth; increasing bit depth expands the slot when needed.",
      ja: "スロット幅を固定したまま有効ビット深度を下げると、BCLKを下げずにパディングが増えます。フレーム長はスロット数と幅で決まります。スロットを狭めると余分なビット深度も減り、ビット深度を上げると必要に応じてスロットが広がります。",
      ko: "슬롯 폭을 고정한 채 유효 비트 깊이를 낮추면 BCLK를 낮추지 않고 패딩이 늘어납니다. 프레임 길이는 슬롯 수와 폭으로 정해집니다. 슬롯을 좁히면 초과 비트 깊이도 줄고 비트 깊이를 높이면 필요에 따라 슬롯이 넓어집니다."
    }
  },
  pdm: {
    title: { zh: "协议：PDM 数字麦克风", "zh-Hant": traditional("协议：PDM 数字麦克风"), en: "Protocol: PDM digital microphone", ja: "プロトコル：PDMデジタルマイク", ko: "프로토콜: PDM 디지털 마이크" },
    body: {
      zh: "观察一小段时间内的 1/0 比例，而不是某一个 bit：1 较多偏向正电平，0 较多偏向负电平，各半接近零。图中脉冲是密度示例，并非上方正弦波的逐点调制结果。", "zh-Hant": traditional("观察一小段时间内的 1/0 比例，而不是某一个 bit：1 较多偏向正电平，0 较多偏向负电平，各半接近零。图中脉冲是密度示例，并非上方正弦波的逐点调制结果。"),
      en: "Read the local proportion of 1s and 0s, not a single bit: more 1s means a more positive level, more 0s a more negative level, and half each is near zero. The bits illustrate density, not a simulated modulation of the sine above.",
      ja: "1個のビットではなく、一定区間の1と0の割合を読みます。1が多いほど正側、0が多いほど負側に寄り、半々ならほぼゼロです。図のビット列は密度の説明であり、上の正弦波を逐点変調した結果ではありません。",
      ko: "한 비트가 아니라 짧은 구간의 1과 0 비율을 봅니다. 1이 많으면 양의 레벨, 0이 많으면 음의 레벨에 가까워지고 반반이면 0에 가깝습니다. 그림의 비트열은 밀도를 설명하기 위한 것이며 위 정현파를 점별로 변조한 결과가 아닙니다."
    }
  },
  spdif: {
    title: { zh: "协议：SPDIF 设备间数字音频", "zh-Hant": traditional("协议：SPDIF 设备间数字音频"), en: "Protocol: SPDIF device-to-device audio", ja: "プロトコル：SPDIF機器間デジタルオーディオ", ko: "프로토콜: SPDIF 장치 간 디지털 오디오" },
    body: {
      zh: "实物图为光纤线缆；下方两条线表示同轴与光纤两种可选连接，并不是需要同时连接两条线。接收端从所选链路中恢复时钟。", "zh-Hant": traditional("实物图为光纤线缆；下方两条线表示同轴与光纤两种可选连接，并不是需要同时连接两条线。接收端从所选链路中恢复时钟。"),
      en: "The photo shows an optical cable. The two lines below represent coaxial and optical alternatives, not two required simultaneous connections. The receiver recovers clocking from the chosen link.",
      ja: "写真は光ファイバーケーブルです。下の2本の線は同軸と光の選択肢を示しており、2本を同時に接続する必要はありません。受信側は選択した経路からクロックを復元します。",
      ko: "사진은 광 케이블을 보여줍니다. 아래의 두 선은 동축과 광 연결의 선택지를 뜻하며 두 선을 동시에 연결해야 한다는 의미가 아닙니다. 수신기는 선택한 경로에서 클록을 복원합니다."
    }
  },
  usb: {
    title: { zh: "协议：USB Audio 外设音频", "zh-Hant": traditional("协议：USB Audio 外设音频"), en: "Protocol: USB Audio peripheral audio", ja: "プロトコル：USB Audio周辺機器オーディオ", ko: "프로토콜: USB Audio 주변기기 오디오" },
    body: {
      zh: "这里示例主机向声卡异步播放，声卡用显式反馈向主机报告所需数据速率。并非所有 USB Audio 设备都使用独立反馈端点；采集方向及其他同步模式的配置不同。", "zh-Hant": traditional("这里示例主机向声卡异步播放，声卡用显式反馈向主机报告所需数据速率。并非所有 USB Audio 设备都使用独立反馈端点；采集方向及其他同步模式的配置不同。"),
      en: "This example shows asynchronous playback from host to interface, with explicit feedback reporting the required data rate. Not all USB Audio devices use a separate feedback endpoint; capture and other synchronization modes differ.",
      ja: "この例は、機器が必要なデータレートを明示的なフィードバックでホストへ知らせる非同期再生を示します。すべてのUSB Audio機器が独立したフィードバックエンドポイントを使うわけではなく、収音方向や他の同期方式では構成が異なります。",
      ko: "이 예시는 장치가 필요한 데이터 속도를 명시적 피드백으로 호스트에 알리는 비동기 재생을 보여줍니다. 모든 USB Audio 장치가 별도 피드백 엔드포인트를 사용하는 것은 아니며 캡처 방향과 다른 동기화 방식은 구성이 다릅니다."
    }
  }
};

function formatMhz(value: number) {
  return value.toFixed(3);
}

function getProtocolObservation({
  bclkFormula,
  language,
  mclkFormula,
  mclkMultiple,
  protocol
}: {
  bclkFormula: string;
  language: Language;
  mclkFormula: string;
  mclkMultiple: number;
  protocol: InterfaceProtocol;
}) {
  if (protocol === "i2s") {
    return localized(language, {
      zh: `当前公式按每条 SD 计算名义 BCLK：${bclkFormula}；多通道 I2S 增加并行 SD 线，不把单条 SD 的 BCLK 乘以总通道数。MCLK=${mclkMultiple}fs（${mclkFormula}）只是单位换算，实际主从选择、PLL 锁定和时钟容差仍需校准。`, "zh-Hant": traditional(`当前公式按每条 SD 计算名义 BCLK：${bclkFormula}；多通道 I2S 增加并行 SD 线，不把单条 SD 的 BCLK 乘以总通道数。MCLK=${mclkMultiple}fs（${mclkFormula}）只是单位换算，实际主从选择、PLL 锁定和时钟容差仍需校准。`),
      en: `The formula gives nominal BCLK per SD line: ${bclkFormula}; multichannel I2S adds parallel SD lines instead of multiplying one line's BCLK by total channels. MCLK=${mclkMultiple}fs (${mclkFormula}) is a unit conversion; master/slave choice, PLL lock, and clock tolerance still need hardware calibration.`,
      ja: `この式はSD 1本あたりの公称BCLKを計算します：${bclkFormula}。マルチチャンネルI2Sでは全チャンネル数を掛けるのではなく、並列SD線を増やします。MCLK=${mclkMultiple}fs（${mclkFormula}）は単位換算であり、実際のマスター/スレーブ設定、PLLロック、クロック許容差はハードウェアで調整する必要があります。`,
      ko: `이 식은 SD 한 라인당 공칭 BCLK를 계산합니다: ${bclkFormula}. 다채널 I2S에서는 한 라인의 BCLK에 전체 채널 수를 곱하지 않고 병렬 SD 라인을 추가합니다. MCLK=${mclkMultiple}fs(${mclkFormula})는 단위 변환이며 실제 마스터/슬레이브 선택, PLL 잠금, 클록 허용 오차는 하드웨어에서 조정해야 합니다.`
    });
  }

  if (protocol === "tdm") {
    return localized(language, {
      zh: `当前公式按一帧的 slot 数和 slot 宽度计算名义 BCLK：${bclkFormula}；slot 数、宽度、顺序和 FS 极性必须与两端一致。MCLK=${mclkMultiple}fs（${mclkFormula}）不等于实测时钟精度，未模拟 PLL 锁定或边界偏移。`, "zh-Hant": traditional(`当前公式按一帧的 slot 数和 slot 宽度计算名义 BCLK：${bclkFormula}；slot 数、宽度、顺序和 FS 极性必须与两端一致。MCLK=${mclkMultiple}fs（${mclkFormula}）不等于实测时钟精度，未模拟 PLL 锁定或边界偏移。`),
      en: `The formula gives nominal BCLK from frame slots and slot width: ${bclkFormula}; slot count, width, order, and FS polarity must match at both ends. MCLK=${mclkMultiple}fs (${mclkFormula}) is not measured clock accuracy, and PLL lock or edge offset is not simulated.`,
      ja: `この式は1フレームのスロット数と幅から公称BCLKを計算します：${bclkFormula}。スロット数、幅、順序、FS極性は両端で一致させる必要があります。MCLK=${mclkMultiple}fs（${mclkFormula}）は実測クロック精度を意味せず、PLLロックやエッジずれはシミュレーションしていません。`,
      ko: `이 식은 한 프레임의 슬롯 수와 슬롯 폭에서 공칭 BCLK를 계산합니다: ${bclkFormula}. 슬롯 수, 폭, 순서, FS 극성은 양쪽에서 일치해야 합니다. MCLK=${mclkMultiple}fs(${mclkFormula})는 측정된 클록 정밀도가 아니며 PLL 잠금이나 에지 오프셋은 시뮬레이션하지 않습니다.`
    });
  }

  if (protocol === "pdm") {
    return localized(language, {
      zh: "图中的 PDM 密度只用于说明 1-bit 流如何表达幅度；实际 PCM 还取决于抽取比、滤波器通带和噪声整形，左右声道的时钟边沿/选择脚也必须与接收端一致。", "zh-Hant": traditional("图中的 PDM 密度只用于说明 1-bit 流如何表达幅度；实际 PCM 还取决于抽取比、滤波器通带和噪声整形，左右声道的时钟边沿/选择脚也必须与接收端一致。"),
      en: "The PDM density here only illustrates how a 1-bit stream represents amplitude; actual PCM also depends on decimation ratio, filter passband, and noise shaping, while left/right clock-edge or select-pin wiring must match the receiver.",
      ja: "図のPDM密度は1-bitストリームが振幅を表す仕組みの説明だけを目的としています。実際のPCMはデシメーション比、フィルター通過帯域、ノイズシェーピングにも左右され、左右チャンネルのクロックエッジや選択ピンの配線も受信側に合わせる必要があります。",
      ko: "그림의 PDM 밀도는 1-bit 스트림이 진폭을 표현하는 방식을 설명하기 위한 것입니다. 실제 PCM은 데시메이션 비율, 필터 통과 대역, 노이즈 셰이핑에도 좌우되며 좌우 채널의 클록 에지나 선택 핀 배선도 수신기에 맞아야 합니다."
    });
  }

  if (protocol === "spdif") {
    return localized(language, {
      zh: "SPDIF 把数据和时钟嵌在同一链路并由接收端恢复；本图不模拟线缆抖动、误码、PLL 锁定或接收端容差，不能把链路示意当成时钟质量测量。", "zh-Hant": traditional("SPDIF 把数据和时钟嵌在同一链路并由接收端恢复；本图不模拟线缆抖动、误码、PLL 锁定或接收端容差，不能把链路示意当成时钟质量测量。"),
      en: "SPDIF embeds data and clock on one link for receiver recovery; this diagram does not model cable jitter, bit errors, PLL lock, or receiver tolerance, so it is not a clock-quality measurement.",
      ja: "SPDIFはデータとクロックを同じ経路に埋め込み、受信側で復元します。この図はケーブルジッター、ビット誤り、PLLロック、受信側の許容差をモデル化していないため、クロック品質の測定ではありません。",
      ko: "SPDIF는 데이터와 클록을 하나의 경로에 넣고 수신 측에서 복원합니다. 이 그림은 케이블 지터, 비트 오류, PLL 잠금, 수신기 허용 오차를 모델링하지 않으므로 클록 품질 측정이 아닙니다."
    });
  }

  return localized(language, {
    zh: "USB Audio 没有本页 I2S/TDM 那样固定的 BCLK 线；等时包、缓冲和反馈端点用于对齐主机与设备速率，本图不模拟主机调度、端到端延迟或时钟漂移校准。", "zh-Hant": traditional("USB Audio 没有本页 I2S/TDM 那样固定的 BCLK 线；等时包、缓冲和反馈端点用于对齐主机与设备速率，本图不模拟主机调度、端到端延迟或时钟漂移校准。"),
    en: "USB Audio has no fixed BCLK wire like I2S/TDM here; isochronous packets, buffers, and feedback endpoints align host and device rates. This diagram does not simulate host scheduling, end-to-end latency, or clock-drift calibration.",
    ja: "USB AudioにはこのページのI2S/TDMのような固定BCLK線がありません。アイソクロナスパケット、バッファ、フィードバックエンドポイントでホストと機器のレートを合わせますが、この図はホストスケジューリング、エンドツーエンド遅延、クロックドリフト補正をシミュレーションしていません。",
    ko: "USB Audio에는 이 페이지의 I2S/TDM처럼 고정된 BCLK 선이 없습니다. 등시성 패킷, 버퍼, 피드백 엔드포인트로 호스트와 장치의 속도를 맞추지만 이 그림은 호스트 스케줄링, 종단 간 지연, 클록 드리프트 보정을 시뮬레이션하지 않습니다."
  });
}

function createSquareWavePath({
  height,
  pulses,
  width,
  x,
  y
}: {
  height: number;
  pulses: number;
  width: number;
  x: number;
  y: number;
}) {
  const step = width / (pulses * 2);
  const commands = [`M ${x} ${y}`];

  Array.from({ length: pulses * 2 }, (_, index) => {
    const nextX = x + (index + 1) * step;
    const nextY = index % 2 === 0 ? y - height : y;
    commands.push(`V ${nextY.toFixed(2)}`);
    commands.push(`H ${nextX.toFixed(2)}`);
  });

  return commands.join(" ");
}

function createPdmBits() {
  return "1011110111101110011110110011011011110010".split("");
}

function renderI2sDiagram(language: Language, bitDepth: number, channels: number, slotWidth: number) {
  const t = (zh: string, en: string, ja: string, ko: string) => localized(language, { zh, en, ja, ko, "zh-Hant": traditional(zh) });
  const dataLines = Array.from({ length: channels / 2 }, (_, i) => i);
  const bitWidth = 588 / (slotWidth * 2);
  const left = 124;
  const right = 418;
  const notesY = 178 + dataLines.length * 68;
  const diagramHeight = notesY + 190;
  // Data cells begin on falling edges; WS changes one full bit before each MSB.
  const clock = Array.from({ length: slotWidth * 2 }, (_, i) => {
    const x = left + i * bitWidth;
    return `H ${x + bitWidth / 2} V 44 H ${x + bitWidth} V 72`;
  }).join(" ");
  return <svg aria-label={t("I2S 时序图", "I2S timing diagram", "I2Sタイミング図", "I2S 타이밍 다이어그램")} role="img" viewBox={`0 0 760 ${diagramHeight}`}>
    <rect className="lab-diagram-bg" height={diagramHeight} rx="8" width="760" />
    <text className="lab-label" x="28" y="58">BCLK</text>
    <path className="interface-clock-line" data-cycles={slotWidth * 2} d={`M ${left} 72 ${clock}`} />
    <text className="lab-label" x="28" y="122">LRCLK</text>
    <path className="interface-frame-line" data-bit-width={bitWidth} d={`M ${left - 2 * bitWidth} 104 H ${left - bitWidth} V 132 H ${right - bitWidth} V 104 H ${712 - bitWidth} V 132 H 712`} />
    <text className="interface-channel-label" x="266" y="155">L · WS = 0</text>
    <text className="interface-channel-label" x="560" y="155">R · WS = 1</text>
    {dataLines.map(line => {
      const y = 178 + line * 68;
      return <g key={line}>
        <text className="lab-label interface-i2s-line-label" x="84" y={y + 22}>{`SD${line}`}</text>
        {[0, 1].map(side => <g key={side}>
          {Array.from({ length: slotWidth }, (_, bit) => <rect key={bit}
            className={side ? "interface-bit-cell right" : "interface-bit-cell"}
            data-bit={bit < bitDepth ? bitDepth - bit - 1 : "padding"}
            style={bit >= bitDepth ? { fill: "#344642", strokeDasharray: "2 2" } : undefined}
            height="34" width={bitWidth} x={left + (side * slotWidth + bit) * bitWidth} y={y} />)}
          <text className="interface-channel-label" x={side ? 560 : 266} y={y + 54}>
            {channels === 2 ? `${side ? "R" : "L"}: bit${bitDepth - 1} → bit0` : `SD${line}: CH${line * 2 + side + 1}`}
          </text>
        </g>)}
        <text className="interface-bit-text" x={left + bitWidth / 2} y={y + 23}>M</text>
        <text className="interface-bit-text" x={right + bitWidth / 2} y={y + 23}>M</text>
      </g>;
    })}
    <foreignObject x="124" y={notesY} width="588" height="170">
      <div className="interface-diagram-copy">
        <p>{t("M 为 MSB；每格对应一个 BCLK，虚线格为补齐位。WS 比对应声道的 MSB 提前一格切换。", "M marks MSB. One cell is one BCLK; dashed cells are padding. WS changes one cell before the channel MSB.", "MはMSB。1マスが1 BCLK、破線はパディング。WSは対応するMSBの1マス前に変化します。", "M은 MSB입니다. 한 칸은 1 BCLK이고 점선은 패딩입니다. WS는 해당 MSB보다 한 칸 먼저 전환됩니다.")}</p>
        <p>{t(`${channels > 2 ? "多通道 I2S（并行 SD 线）" : "双声道 I2S"}：${dataLines.length} SD × 2 slots × ${slotWidth} bit；有效位深 ${bitDepth} bit。`, `${channels > 2 ? "Multichannel I2S (parallel SD)" : "Stereo I2S"}: ${dataLines.length} SD × 2 slots × ${slotWidth} bits; ${bitDepth} valid bits.`, `I2S：${dataLines.length} SD × 2スロット × ${slotWidth} bit、有効${bitDepth} bit。`, `I2S: ${dataLines.length} SD × 2슬롯 × ${slotWidth} bit, 유효 ${bitDepth} bit.`)}</p>
        <p>{t("MCLK 可为片内 PLL 或转换器提供参考，不承载数据位；是否需要外部输入以器件手册为准。", "MCLK can reference an internal PLL or converter, not carry data bits. External clock requirements depend on the device.", "MCLKはPLLや変換器の基準であり、データビットは運びません。外部入力の要否は仕様書に従います。", "MCLK는 PLL이나 변환기의 기준이며 데이터 비트를 전송하지 않습니다. 외부 입력 필요 여부는 기기 사양을 따릅니다.")}</p>
      </div>
    </foreignObject>
  </svg>;
}

function renderTdmDiagram(language: Language, channels: number, slotWidth: number, bitDepth: number) {
  const slots = Array.from({ length: channels }, (_, index) => index + 1);
  const slotVisualWidth = 620 / channels;
  const channelBoxWidth = 548 / channels;

  return (
    <svg
      aria-label={localized(language, { zh: "TDM 时隙图", "zh-Hant": traditional("TDM 时隙图"), en: "TDM slot diagram", ja: "TDMスロット図", ko: "TDM 슬롯 다이어그램" })}
      role="img"
      viewBox="0 0 760 460"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <marker id="interfaceArrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
          <path d="M 0 0 L 8 4 L 0 8 Z" fill="#f0b46a" />
        </marker>
      </defs>
      <rect className="lab-diagram-bg" height="460" rx="14" width="760" />
      <text className="lab-label" x="48" y="42">{localized(language, { zh: "时钟与帧同步", "zh-Hant": traditional("时钟与帧同步"), en: "Clock and frame sync", ja: "クロックとフレーム同期", ko: "클록과 프레임 동기" })}</text>
      <text className="lab-chip" x="424" y="42">
        {localized(language, { zh: `一帧 = ${channels} 个 slot`, "zh-Hant": traditional(`一帧 = ${channels} 个 slot`), en: `One frame = ${channels} slots`, ja: `1フレーム = ${channels}スロット`, ko: `한 프레임 = ${channels}개 슬롯` })}
      </text>
      <text className="lab-label" x="18" y="86">BCLK</text>
      <path className="interface-clock-line" data-cycles={channels * slotWidth} d={createSquareWavePath({ height: 22, pulses: channels * slotWidth, width: 620, x: 70, y: 94 })} />
      <text className="lab-label" x="48" y="138">FS</text>
      <path className="interface-frame-line" data-pulse-width={620 / (channels * slotWidth)} d={`M 70 142 V 116 H ${70 + 620 / (channels * slotWidth)} V 142 H 690`} />
      <text className="interface-tdm-note" x="352" y="134">
        {localized(language, { zh: "FS 帧同步：新一帧从这里开始", "zh-Hant": traditional("FS 帧同步：新一帧从这里开始"), en: "FS frame sync: a new frame starts here", ja: "FSフレーム同期：ここから新しいフレームが始まります", ko: "FS 프레임 동기: 여기서 새 프레임이 시작됩니다" })}
      </text>

      <line className="interface-frame-marker" x1="70" x2="70" y1="160" y2="292" />
      <line className="interface-frame-marker" x1="690" x2="690" y1="160" y2="292" />
      <text className="lab-label" x="48" y="184">SD</text>
      <g>
        {slots.map((slot, index) => {
          const x = 70 + index * slotVisualWidth;
          return (
            <g key={slot}>
              <rect className="interface-slot" height="82" width={slotVisualWidth - 5} x={x} y="202" />
              <text className="interface-slot-label" x={x + slotVisualWidth / 2 - 2.5} y="224">{`Slot ${slot}`}</text>
              <text className="interface-slot-sub" x={x + slotVisualWidth / 2 - 2.5} y="246">{`CH${slot}`}</text>
              <text className="interface-slot-sub" x={x + slotVisualWidth / 2 - 2.5} y="268">
                {`${bitDepth}+${slotWidth - bitDepth}`}
              </text>
            </g>
          );
        })}
      </g>
      <text className="interface-tdm-note" x="70" y="316">
        {localized(language, { zh: "每个 slot 内仍按 MSB → LSB 传一个采样字", "zh-Hant": traditional("每个 slot 内仍按 MSB → LSB 传一个采样字"), en: "Each slot sends one sample, MSB to LSB", ja: "各スロットはMSBからLSBの順に1つのサンプルを送ります", ko: "각 슬롯은 MSB에서 LSB 순서로 하나의 샘플을 보냅니다" })}
      </text>
      <text className="interface-tdm-note" x="430" y="316">
        {localized(language, { zh: `${channels} 个 slot 共用一条 SD 数据线`, "zh-Hant": traditional(`${channels} 个 slot 共用一条 SD 数据线`), en: `${channels} slots share one SD line`, ja: `${channels}個のスロットが1本のSD線を共有`, ko: `${channels}개 슬롯이 하나의 SD 라인을 공유` })}
      </text>
      <path className="interface-flow-arrow" d="M 380 324 L 380 346" />
      <text className="lab-label" x="48" y="364">
        {localized(language, { zh: "SD 串行数据拆回多声道", "zh-Hant": traditional("SD 串行数据拆回多声道"), en: "Serial SD data is split back into channels", ja: "SDシリアルデータをチャンネルへ分離", ko: "SD 직렬 데이터를 채널로 분리" })}
      </text>
      <g>
        {slots.map((slot, index) => {
          const x = 106 + index * channelBoxWidth;
          return (
            <g key={`channel-${slot}`}>
              <rect className="interface-tdm-channel" height="30" rx="6" width={channelBoxWidth - 8} x={x} y="376" />
              <text className="interface-slot-sub" x={x + channelBoxWidth / 2 - 4} y="391">{`CH${slot}`}</text>
            </g>
          );
        })}
      </g>
      <text className="interface-tdm-note" x="70" y="420">
        {localized(language, { zh: "slot 宽度可以大于有效位深，多余 bit 通常补 0", "zh-Hant": traditional("slot 宽度可以大于有效位深，多余 bit 通常补 0"), en: "Slot width can exceed valid bit depth; extra bits are usually padded with 0", ja: "スロット幅は有効ビット深度より広くでき、余ったビットは通常0で埋めます", ko: "슬롯 폭은 유효 비트 깊이보다 넓을 수 있으며 남는 비트는 보통 0으로 채웁니다" })}
      </text>
      <text className="interface-tdm-note" x="70" y="444">
        {localized(language, { zh: "slot 顺序两端必须一致，否则 CH1/CH2 会错位", "zh-Hant": traditional("slot 顺序两端必须一致，否则 CH1/CH2 会错位"), en: "Slot order must match at both ends, or CH1/CH2 will shift", ja: "スロット順序は両端で一致させないと、CH1/CH2がずれます", ko: "슬롯 순서는 양쪽에서 일치해야 하며 그렇지 않으면 CH1/CH2가 어긋납니다" })}
      </text>
    </svg>
  );
}

function renderPdmDiagram(language: Language) {
  const bits = createPdmBits();
  const bitPreview = bits.slice(0, 32);

  return (
    <svg
      aria-label={localized(language, { zh: "PDM 到 PCM 转换图", "zh-Hant": traditional("PDM 到 PCM 转换图"), en: "PDM to PCM conversion diagram", ja: "PDMからPCMへの変換図", ko: "PDM에서 PCM으로 변환 다이어그램" })}
      role="img"
      viewBox="0 0 760 540"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <marker id="interfaceArrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
          <path d="M 0 0 L 8 4 L 0 8 Z" fill="#f0b46a" />
        </marker>
      </defs>
      <rect className="lab-diagram-bg" height="540" rx="14" width="760" />
      <text className="lab-label" x="48" y="44">{localized(language, { zh: "PDM 从哪里来", "zh-Hant": traditional("PDM 从哪里来"), en: "Where PDM comes from", ja: "PDMはどこから来るか", ko: "PDM은 어디서 오는가" })}</text>
      <path className="interface-pcm-wave" d="M 58 116 C 86 74 122 74 150 116 S 214 158 242 116" />
      <text className="lab-chip" x="58" y="76">{localized(language, { zh: "模拟声音电压", "zh-Hant": traditional("模拟声音电压"), en: "Analog sound voltage", ja: "アナログ音声電圧", ko: "아날로그 음성 전압" })}</text>
      <rect className="interface-node" height="78" rx="10" width="128" x="286" y="76" />
      <text className="interface-node-text" x="350" y="104">{localized(language, { zh: "Σ-Δ 调制器", "zh-Hant": traditional("Σ-Δ 调制器"), en: "Sigma-delta", ja: "Σ-Δ変調器", ko: "Σ-Δ 변조기" })}</text>
      <text className="interface-node-sub" x="350" y="132">{localized(language, { zh: "模拟 → 1-bit", "zh-Hant": traditional("模拟 → 1-bit"), en: "Analog to 1-bit", ja: "アナログ → 1-bit", ko: "아날로그 → 1-bit" })}</text>
      <path className="interface-flow-arrow" d="M 248 116 L 278 116" />
      <path className="interface-flow-arrow" d="M 422 116 L 472 116" />

      <g transform="translate(482 82)">
        {bitPreview.map((bit, index) => (
          <rect
            className={bit === "1" ? "interface-pdm-bit high" : "interface-pdm-bit"}
            height={bit === "1" ? 58 : 16}
            key={`${bit}-${index}`}
            width="5"
            x={index * 7}
            y={bit === "1" ? 0 : 42}
          />
        ))}
      </g>
      <text className="lab-chip" x="482" y="170">{localized(language, { zh: "1-bit 高速脉冲密度流", "zh-Hant": traditional("1-bit 高速脉冲密度流"), en: "High-rate 1-bit PDM", ja: "高速1-bit PDM", ko: "고속 1-bit PDM" })}</text>

      <text className="lab-label" x="48" y="230">{localized(language, { zh: "密度如何表示幅度", "zh-Hant": traditional("密度如何表示幅度"), en: "Density represents amplitude", ja: "密度で振幅を表す仕組み", ko: "밀도가 진폭을 나타내는 방식" })}</text>
      <text className="interface-tdm-note" x="56" y="260">{localized(language, { zh: "脉冲密度表示幅度", "zh-Hant": traditional("脉冲密度表示幅度"), en: "Pulse density represents amplitude", ja: "パルス密度が振幅を表します", ko: "펄스 밀도가 진폭을 나타냅니다" })}</text>
      <g transform="translate(56 278)">
        {"1110111111011110".split("").map((bit, index) => (
          <rect className={bit === "1" ? "interface-pdm-bit high" : "interface-pdm-bit"} height={bit === "1" ? 34 : 10} key={`dense-${index}`} width="9" x={index * 13} y={bit === "1" ? 0 : 24} />
        ))}
      </g>
      <text className="interface-tdm-note" x="56" y="334">{localized(language, { zh: "1 更多 = 电平更偏正", "zh-Hant": traditional("1 更多 = 电平更偏正"), en: "More 1s = more positive", ja: "1が多い = レベルが正側", ko: "1이 많음 = 더 양의 레벨" })}</text>
      <g transform="translate(284 278)">
        {"1010101010101010".split("").map((bit, index) => (
          <rect className={bit === "1" ? "interface-pdm-bit high" : "interface-pdm-bit"} height={bit === "1" ? 34 : 10} key={`mid-${index}`} width="9" x={index * 13} y={bit === "1" ? 0 : 24} />
        ))}
      </g>
      <text className="interface-tdm-note" x="284" y="334">{localized(language, { zh: "1/0 各半 ≈ 零电平", "zh-Hant": traditional("1/0 各半 ≈ 零电平"), en: "Half 1s / 0s ≈ zero", ja: "1と0が半々 ≈ ゼロレベル", ko: "1/0이 절반씩 = 0 레벨에 가까움" })}</text>

      <rect className="interface-node" height="78" rx="10" width="158" x="534" y="250" />
      <text className="interface-node-text" x="613" y="280">{localized(language, { zh: "低通 + 抽取", "zh-Hant": traditional("低通 + 抽取"), en: "LPF + decimation", ja: "ローパス + デシメーション", ko: "로우패스 + 데시메이션" })}</text>
      <text className="interface-node-sub" x="613" y="306">PDM → PCM</text>
      <path className="interface-flow-arrow" d="M 468 294 L 526 294" />
      <text className="interface-tdm-note" x="56" y="370">
        {localized(language, { zh: "PDM 高速 1-bit 流 → PCM 多 bit 采样值", "zh-Hant": traditional("PDM 高速 1-bit 流 → PCM 多 bit 采样值"), en: "High-rate 1-bit PDM stream to multibit PCM samples", ja: "高速1-bit PDMストリーム → マルチビットPCMサンプル", ko: "고속 1-bit PDM 스트림 → 멀티비트 PCM 샘플" })}
      </text>
      <text className="interface-tdm-note" x="56" y="392">{localized(language, { zh: "抽取滤波后变成 PCM", "zh-Hant": traditional("抽取滤波后变成 PCM"), en: "Decimation turns it into PCM", ja: "デシメーション後にPCMになります", ko: "데시메이션 후 PCM으로 변환됩니다" })}</text>
      <text className="lab-label" x="48" y="430">{localized(language, { zh: "PDM 时钟与采样率", "zh-Hant": traditional("PDM 时钟与采样率"), en: "PDM clock and sample rate", ja: "PDMクロックとサンプルレート", ko: "PDM 클록과 샘플 속도" })}</text>
      <text className="interface-tdm-note" x="56" y="456">
        {localized(language, { zh: "PDM 时钟 ≈ 目标采样率 × 抽取倍数", "zh-Hant": traditional("PDM 时钟 ≈ 目标采样率 × 抽取倍数"), en: "PDM clock roughly equals target sample rate times decimation ratio", ja: "PDMクロック ≈ 目標サンプルレート × デシメーション比", ko: "PDM 클록 ≈ 목표 샘플 속도 × 데시메이션 배수" })}
      </text>
      <text className="interface-tdm-note" x="56" y="478">
        {localized(language, { zh: "48 kHz PCM 常见：3.072 MHz PDM = 48 kHz × 64", "zh-Hant": traditional("48 kHz PCM 常见：3.072 MHz PDM = 48 kHz × 64"), en: "Common 48 kHz PCM case: 3.072 MHz PDM = 48 kHz x 64", ja: "48 kHz PCMの例：3.072 MHz PDM = 48 kHz × 64", ko: "일반적인 48 kHz PCM 예: 3.072 MHz PDM = 48 kHz × 64" })}
      </text>
      <text className="interface-tdm-note" x="56" y="510">
        {localized(language, { zh: "数字麦的 PDM 时钟通常由主控或 Codec 提供，不等于 CPU 主频", "zh-Hant": traditional("数字麦的 PDM 时钟通常由主控或 Codec 提供，不等于 CPU 主频"), en: "The host or codec typically clocks a PDM mic, not at the CPU frequency", ja: "デジタルマイクのPDMクロックは通常ホストまたはCodecが供給し、CPUクロックとは異なります", ko: "디지털 마이크의 PDM 클록은 보통 호스트나 Codec이 제공하며 CPU 주파수와 같지 않습니다" })}
      </text>
    </svg>
  );
}

function renderSpdifDiagram(language: Language) {
  return (
    <svg
      aria-label={localized(language, { zh: "SPDIF 设备链路图", "zh-Hant": traditional("SPDIF 设备链路图"), en: "SPDIF device link diagram", ja: "SPDIF機器間リンク図", ko: "SPDIF 장치 링크 다이어그램" })}
      role="img"
      viewBox="0 0 760 520"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect className="lab-diagram-bg" height="520" rx="14" width="760" />
      <image
        aria-label={localized(language, { zh: "SPDIF 同轴光纤线示例图", "zh-Hant": traditional("SPDIF 同轴光纤线示例图"), en: "SPDIF coaxial optical cable example", ja: "SPDIF同軸・光ケーブルの例", ko: "SPDIF 동축·광 케이블 예시" })}
        height="210"
        href={`${import.meta.env.BASE_URL}images/spdif-line.png`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        width="250"
        x="48"
        y="50"
      />
      <text className="lab-label" x="336" y="76">{localized(language, { zh: "SPDIF 线缆示例", "zh-Hant": traditional("SPDIF 线缆示例"), en: "SPDIF cable example", ja: "SPDIFケーブルの例", ko: "SPDIF 케이블 예시" })}</text>
      <foreignObject x="336" y="94" width="376" height="190">
      <div className="interface-diagram-copy">
      <p>
        {localized(language, { zh: "同轴或光纤用于设备之间传数字音频", "zh-Hant": traditional("同轴或光纤用于设备之间传数字音频"), en: "Coaxial or optical links carry digital audio between devices", ja: "同軸または光リンクで機器間にデジタルオーディオを伝送します", ko: "동축 또는 광 링크로 장치 사이에 디지털 오디오를 전송합니다" })}
      </p>
      <p>
        {localized(language, { zh: "音频数据和时钟信息嵌在同一条链路里，接收端再恢复时钟", "zh-Hant": traditional("音频数据和时钟信息嵌在同一条链路里，接收端再恢复时钟"), en: "Audio data and clocking are embedded in one link, then recovered by the receiver", ja: "オーディオデータとクロック情報を1本のリンクに埋め込み、受信側でクロックを復元します", ko: "오디오 데이터와 클록 정보를 하나의 링크에 넣고 수신 측에서 클록을 복원합니다" })}
      </p>
      <p>
        {localized(language, { zh: "它是外部设备互连接口，不是芯片内部的 I2S/TDM 总线", "zh-Hant": traditional("它是外部设备互连接口，不是芯片内部的 I2S/TDM 总线"), en: "It is an external device interconnect, not an internal I2S/TDM chip bus", ja: "外部機器を接続するインターフェースであり、チップ内部のI2S/TDMバスではありません", ko: "외부 장치 연결 인터페이스이며 칩 내부의 I2S/TDM 버스가 아닙니다" })}
      </p>
      </div>
      </foreignObject>
      <rect className="interface-device-node" height="96" rx="12" width="150" x="68" y="326" />
      <text className="interface-node-text" x="143" y="362">{localized(language, { zh: "播放器 / 电视", "zh-Hant": traditional("播放器 / 电视"), en: "Player / TV", ja: "プレーヤー / テレビ", ko: "플레이어 / TV" })}</text>
      <text className="interface-node-sub" x="143" y="390">{localized(language, { zh: "SPDIF 输出", "zh-Hant": traditional("SPDIF 输出"), en: "SPDIF out", ja: "SPDIF出力", ko: "SPDIF 출력" })}</text>
      <rect className="interface-device-node" height="96" rx="12" width="150" x="542" y="326" />
      <text className="interface-node-text" x="617" y="362">{localized(language, { zh: "功放 / 声卡", "zh-Hant": traditional("功放 / 声卡"), en: "Amp / interface", ja: "アンプ / インターフェース", ko: "앰프 / 인터페이스" })}</text>
      <text className="interface-node-sub" x="617" y="390">{localized(language, { zh: "时钟恢复", "zh-Hant": traditional("时钟恢复"), en: "Clock recovery", ja: "クロック復元", ko: "클록 복원" })}</text>
      <path className="interface-link-line" d="M 232 374 C 306 318 454 318 528 374" />
      <path className="interface-link-line alt" d="M 232 388 C 306 444 454 444 528 388" />
      <text className="lab-chip" x="274" y="292">{localized(language, { zh: "同轴 / 光纤", "zh-Hant": traditional("同轴 / 光纤"), en: "Coaxial / optical", ja: "同軸 / 光", ko: "동축 / 광" })}</text>
      <text className="lab-chip" x="250" y="484">{localized(language, { zh: "嵌入式时钟 + 双相标记编码", "zh-Hant": traditional("嵌入式时钟 + 双相标记编码"), en: "Embedded clock + biphase mark coding", ja: "埋め込みクロック + バイフェーズマーク符号化", ko: "임베디드 클록 + 바이페이즈 마크 부호화" })}</text>
    </svg>
  );
}

function renderUsbDiagram(language: Language) {
  return (
    <svg
      aria-label={localized(language, { zh: "USB Audio 包传输图", "zh-Hant": traditional("USB Audio 包传输图"), en: "USB Audio packet transfer diagram", ja: "USB Audioパケット伝送図", ko: "USB Audio 패킷 전송 다이어그램" })}
      role="img"
      viewBox="0 0 760 520"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <marker id="interfaceArrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
          <path d="M 0 0 L 8 4 L 0 8 Z" fill="#f0b46a" />
        </marker>
      </defs>
      <rect className="lab-diagram-bg" height="520" rx="14" width="760" />
      <image
        aria-label={localized(language, { zh: "USB 外置声卡示例图", "zh-Hant": traditional("USB 外置声卡示例图"), en: "USB external sound card example", ja: "USB外付けサウンドカードの例", ko: "USB 외장 사운드 카드 예시" })}
        height="210"
        href={`${import.meta.env.BASE_URL}images/usb-audio-card.png.png`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        width="250"
        x="48"
        y="50"
      />
      <text className="lab-label" x="336" y="76">{localized(language, { zh: "USB 外置声卡示例", "zh-Hant": traditional("USB 外置声卡示例"), en: "USB external sound card example", ja: "USB外付けサウンドカードの例", ko: "USB 외장 사운드 카드 예시" })}</text>
      <foreignObject x="336" y="94" width="376" height="190">
      <div className="interface-diagram-copy">
      <p>
        {localized(language, { zh: "USB 连接主机，设备提供耳机、麦克风和耳麦一体接口", "zh-Hant": traditional("USB 连接主机，设备提供耳机、麦克风和耳麦一体接口"), en: "USB connects to the host; the device provides headphone, mic, and combo headset ports", ja: "USBでホストに接続し、ヘッドホン、マイク、ヘッドセット兼用端子を提供します", ko: "USB로 호스트에 연결하고 헤드폰, 마이크, 헤드셋 겸용 단자를 제공합니다" })}
      </p>
      <p>
        {localized(language, { zh: "这类产品属于 USB Audio 外设，不是 SPDIF 同轴/光纤接口", "zh-Hant": traditional("这类产品属于 USB Audio 外设，不是 SPDIF 同轴/光纤接口"), en: "This is a USB Audio peripheral, not an SPDIF coaxial or optical interface", ja: "この製品はUSB Audio周辺機器であり、SPDIFの同軸/光インターフェースではありません", ko: "이 제품은 USB Audio 주변기기이며 SPDIF 동축/광 인터페이스가 아닙니다" })}
      </p>
      <p>{localized(language, { zh: "设备枚举 → 端点 → 等时包 → 音频缓冲", "zh-Hant": traditional("设备枚举 → 端点 → 等时包 → 音频缓冲"), en: "Enumeration to endpoints to isochronous packets to audio buffers", ja: "デバイス列挙 → エンドポイント → アイソクロナスパケット → オーディオバッファ", ko: "장치 열거 → 엔드포인트 → 등시성 패킷 → 오디오 버퍼" })}</p>
      </div>
      </foreignObject>
      <rect className="interface-device-node" height="82" rx="12" width="136" x="54" y="326" />
      <text className="interface-node-text" x="122" y="354">{localized(language, { zh: "主机", "zh-Hant": traditional("主机"), en: "Host", ja: "ホスト", ko: "호스트" })}</text>
      <text className="interface-node-sub" x="122" y="380">PC / Phone</text>
      <rect className="interface-device-node" height="82" rx="12" width="146" x="560" y="326" />
      <text className="interface-node-text" x="633" y="354">{localized(language, { zh: "声卡 / 耳机", "zh-Hant": traditional("声卡 / 耳机"), en: "Interface / headset", ja: "インターフェース / ヘッドセット", ko: "인터페이스 / 헤드셋" })}</text>
      <text className="interface-node-sub" x="633" y="380">USB Audio</text>
      {[0, 1, 2, 3].map((packet) => (
        <g key={packet}>
          <rect className="interface-usb-packet" height="46" rx="8" width="70" x={232 + packet * 80} y={343} />
          <text className="interface-slot-label" x={267 + packet * 80} y={371}>{`Pkt ${packet + 1}`}</text>
        </g>
      ))}
      <path className="interface-flow-arrow" d="M 196 366 L 224 366" />
      <path className="interface-flow-arrow" d="M 542 366 L 560 366" />
      <path className="interface-link-line alt" d="M 633 408 V 452 H 122 V 408" />
      <path className="interface-flow-arrow" d="M 122 428 L 122 408" />
      <text className="lab-chip" x="224" y="296">{localized(language, { zh: "音频样本被装入 USB 等时包", "zh-Hant": traditional("音频样本被装入 USB 等时包"), en: "Playback: isochronous audio packets", ja: "オーディオサンプルをUSBアイソクロナスパケットへ格納", ko: "오디오 샘플을 USB 등시성 패킷에 담기" })}</text>
      <text className="lab-chip" x="156" y="504">{localized(language, { zh: "异步播放示例：设备向主机反馈速率", "zh-Hant": traditional("异步播放示例：设备向主机反馈速率"), en: "Async playback: rate feedback to host", ja: "非同期再生の例：機器がホストへレートをフィードバック", ko: "비동기 재생 예: 장치가 호스트에 속도를 피드백" })}</text>
    </svg>
  );
}

function renderProtocolDiagram(protocol: InterfaceProtocol, language: Language, bitDepth: number, channels: number, slotWidth: number) {
  if (protocol === "tdm") {
    return renderTdmDiagram(language, channels, slotWidth, bitDepth);
  }

  if (protocol === "pdm") {
    return renderPdmDiagram(language);
  }

  if (protocol === "spdif") {
    return renderSpdifDiagram(language);
  }

  if (protocol === "usb") {
    return renderUsbDiagram(language);
  }

  return renderI2sDiagram(language, bitDepth, channels, slotWidth);
}

export function DigitalInterfaceLab({ language, onBack, onBackToDetails }: DigitalInterfaceLabProps) {
  const [protocol, setProtocol] = useState<InterfaceProtocol>("i2s");
  const [sampleRate, setSampleRate] = useState(48);
  const [bitDepth, setBitDepth] = useState(24);
  const [channels, setChannels] = useState(2);
  const [slotWidth, setSlotWidth] = useState(32);
  const [mclkMultiple, setMclkMultiple] = useState(256);

  const sampleRateHz = sampleRate * 1000;
  const bclkMhz = useMemo(() => formatMhz((sampleRateHz * (protocol === "tdm" ? channels * slotWidth : slotWidth * 2)) / 1_000_000), [bitDepth, channels, protocol, sampleRateHz, slotWidth]);
  const mclkMhz = useMemo(() => formatMhz((sampleRateHz * mclkMultiple) / 1_000_000), [mclkMultiple, sampleRateHz]);
  const bclkFormula = protocol === "tdm"
    ? `${sampleRateHz} Hz × ${channels} slots × ${slotWidth} bit ÷ 1,000,000 = ${bclkMhz} MHz`
    : `${sampleRateHz} Hz × 2 slots × ${slotWidth} bit ÷ 1,000,000 = ${bclkMhz} MHz / SD`;
  const mclkFormula = `${sampleRateHz} Hz × ${mclkMultiple} ÷ 1,000,000 = ${mclkMhz} MHz`;
  const activeCopy = protocolCopy[protocol];
  const usesClockControls = protocol === "i2s" || protocol === "tdm";
  const protocolObservation = getProtocolObservation({ bclkFormula, language, mclkFormula, mclkMultiple, protocol });

  return (
    <main className="digital-interface-page">
      <section className="sound-lab-hero" aria-labelledby="digital-interface-title">
        <div className="sound-lab-back-actions">
        <button className="sound-lab-back sound-lab-back-secondary" type="button" onClick={onBack}>
          <ArrowLeft size={18} aria-hidden="true" />
          {localized(language, { zh: "返回知识库", "zh-Hant": traditional("返回知识库"), en: "Back to knowledge base", ja: "知識ベースに戻る", ko: "지식 베이스로 돌아가기" })}
        </button>
        {onBackToDetails && <button className="sound-lab-back" type="button" onClick={onBackToDetails}>
          <ArrowLeft size={18} aria-hidden="true" />
          {localized(language, { zh: "返回详细内容", "zh-Hant": traditional("返回详细内容"), en: "Back to detailed content", ja: "詳細内容に戻る", ko: "상세 내용으로 돌아가기" })}
        </button>}
        </div>
        <div>
          <span className="section-kicker">{localized(language, { zh: "硬件实验", "zh-Hant": traditional("硬件实验"), en: "Hardware lab", ja: "ハードウェア実験", ko: "하드웨어 실험" })}</span>
          <h1 id="digital-interface-title">{localized(language, { zh: "数字音频接口实验室", "zh-Hant": traditional("数字音频接口实验室"), en: "Digital Audio Interface Lab", ja: "デジタルオーディオインターフェース実験室", ko: "디지털 오디오 인터페이스 실험실" })}</h1>
          <p>
            {localized(language, { zh: "切换常见数字音频接口，观察时钟线、数据线、帧同步、slot、PDM 抽取和 USB 包传输之间的区别。", "zh-Hant": traditional("切换常见数字音频接口，观察时钟线、数据线、帧同步、slot、PDM 抽取和 USB 包传输之间的区别。"), en: "Switch common digital audio interfaces and compare clocks, data lines, frame sync, slots, PDM decimation, and USB packet transport.", ja: "一般的なデジタルオーディオインターフェースを切り替え、クロック線、データ線、フレーム同期、スロット、PDMデシメーション、USBパケット伝送の違いを観察します。", ko: "일반적인 디지털 오디오 인터페이스를 전환하며 클록 라인, 데이터 라인, 프레임 동기, 슬롯, PDM 데시메이션, USB 패킷 전송의 차이를 비교합니다." })}
          </p>
        </div>
      </section>

      <section className="digital-interface-workbench" aria-label={localized(language, { zh: "数字音频接口实验台", "zh-Hant": traditional("数字音频接口实验台"), en: "Digital audio interface workbench", ja: "デジタルオーディオインターフェース・ワークベンチ", ko: "디지털 오디오 인터페이스 워크벤치" })}>
        <div className="digital-lab-visual">
          <div className="digital-lab-status">
            <strong>{activeCopy.title[language]}</strong>
            {usesClockControls ? (
              <span>
                {localized(language, { zh: `BCLK = ${bclkFormula}`, "zh-Hant": traditional(`BCLK = ${bclkFormula}`), en: `BCLK = ${bclkFormula}`, ja: `BCLK = ${bclkFormula}`, ko: `BCLK = ${bclkFormula}` })}
              </span>
            ) : null}
          </div>
          <div className="interface-diagram-scroll" role="region" aria-label={localized(language, { zh: "接口图解", "zh-Hant": traditional("接口图解"), en: "Interface diagram", ja: "インターフェース図解", ko: "인터페이스 다이어그램" })} tabIndex={0}>
            {renderProtocolDiagram(protocol, language, bitDepth, channels, slotWidth)}
          </div>
          {usesClockControls && <p className="codec-model-note">{localized(language, {
            zh: protocol === "i2s" ? "本图显示一帧：每格一个 BCLK，WS 提前一位；slot 宽度可大于有效位深。改变采样率只改变这一帧的实际时长，不改变其位数。" : `每个 slot 下方的 ${bitDepth}+${slotWidth - bitDepth} 表示有效数据位 + 填充位；示例按左对齐、补 0 处理。本图选用高有效、1 BCLK 宽的 FS，首位延迟为 0；真实器件的 FS 与首位延迟以配置为准。`, "zh-Hant": traditional(protocol === "i2s" ? "本图显示一帧：每格一个 BCLK，WS 提前一位；slot 宽度可大于有效位深。改变采样率只改变这一帧的实际时长，不改变其位数。" : `每个 slot 下方的 ${bitDepth}+${slotWidth - bitDepth} 表示有效数据位 + 填充位；示例按左对齐、补 0 处理。本图选用高有效、1 BCLK 宽的 FS，首位延迟为 0；真实器件的 FS 与首位延迟以配置为准。`),
            en: protocol === "i2s" ? "One frame: each cell is one BCLK and WS leads by one bit. Slot width can exceed valid bit depth. Sample rate changes frame duration, not bit count." : `${bitDepth}+${slotWidth - bitDepth} in each slot means valid data bits + padding bits, shown left-aligned with zero padding. This example uses active-high FS lasting one BCLK and zero first-bit delay; actual FS and offset depend on device settings.`,
            ja: protocol === "i2s" ? "1フレームを表示。1マスは1 BCLK、WSは1ビット先行します。スロット幅は有効ビット数以上です。標本化周波数は実時間長を変え、ビット数は変えません。" : `各スロット下の${bitDepth}+${slotWidth - bitDepth}は有効データビット + パディングビットを示し、左詰め・0パディングで表示します。この例はHigh有効・1 BCLK幅のFSと遅延0を使います。実機のFSと遅延は設定に従います。`,
            ko: protocol === "i2s" ? "한 프레임을 표시합니다. 한 칸은 1 BCLK이며 WS는 한 비트 앞섭니다. 슬롯 폭은 유효 비트 수 이상입니다. 샘플 속도는 실제 프레임 길이를 바꾸지만 비트 수는 바꾸지 않습니다." : `각 슬롯 아래의 ${bitDepth}+${slotWidth - bitDepth}는 유효 데이터 비트 + 패딩 비트이며 왼쪽 정렬과 0 패딩으로 표시합니다. 이 예시는 활성 High, 1 BCLK 폭 FS와 첫 비트 지연 0을 사용하며 실제 설정은 기기에 따릅니다.`
          })}</p>}
        </div>

        <div className="digital-interface-panel">
          <div className="interface-tabs" role="group" aria-label={localized(language, { zh: "接口协议", "zh-Hant": traditional("接口协议"), en: "Interface protocol", ja: "インターフェースプロトコル", ko: "인터페이스 프로토콜" })}>
            {(Object.keys(protocolLabels) as InterfaceProtocol[]).map((item) => (
              <button
                className={protocol === item ? "waveform-tab active" : "waveform-tab"}
                key={item}
                aria-pressed={protocol === item}
                type="button"
                onClick={() => setProtocol(item)}
              >
                {protocolLabels[item][language]}
              </button>
            ))}
          </div>

          {usesClockControls ? (
            <>
              <div className="lab-sliders">
                <label>
                  <span>
                    {localized(language, { zh: "Slot 宽度", "zh-Hant": traditional("Slot 宽度"), en: "Slot width", ja: "スロット幅", ko: "슬롯 폭" })}
                    <strong>{slotWidth} bit</strong>
                  </span>
                  <select aria-label={localized(language, { zh: "Slot 宽度", "zh-Hant": traditional("Slot 宽度"), en: "Slot width", ja: "スロット幅", ko: "슬롯 폭" })} value={slotWidth} onChange={(event) => {
                    const width = Number(event.target.value);
                    setSlotWidth(width);
                    setBitDepth(Math.min(bitDepth, width));
                  }}>
                    {[16, 24, 32].map((value) => <option key={value} value={value}>{value} bit</option>)}
                  </select>
                </label>
                <label>
                  <span>
                    {localized(language, { zh: "采样率", "zh-Hant": traditional("采样率"), en: "Sample rate", ja: "サンプルレート", ko: "샘플 속도" })}
                    <strong>{sampleRate} kHz</strong>
                  </span>
                  <input
                    aria-label={localized(language, { zh: "采样率", "zh-Hant": traditional("采样率"), en: "Sample rate", ja: "サンプルレート", ko: "샘플 속도" })}
                    max="96"
                    min="16"
                    step="8"
                    type="range"
                    value={sampleRate}
                    onChange={(event) => setSampleRate(Number(event.target.value))}
                  />
                </label>
                <label>
                  <span>
                    {localized(language, { zh: "位深", "zh-Hant": traditional("位深"), en: "Bit depth", ja: "ビット深度", ko: "비트 깊이" })}
                    <strong>{bitDepth} bit</strong>
                  </span>
                  <input
                    aria-label={localized(language, { zh: "位深", "zh-Hant": traditional("位深"), en: "Bit depth", ja: "ビット深度", ko: "비트 깊이" })}
                    max="32"
                    min="16"
                    step="8"
                    type="range"
                    value={bitDepth}
                    onChange={(event) => {
                      const depth = Number(event.target.value);
                      setBitDepth(depth);
                      setSlotWidth(Math.max(slotWidth, depth));
                    }}
                  />
                </label>
                <label>
                  <span>
                    {protocol === "tdm" ? localized(language, { zh: "Slot 数", "zh-Hant": traditional("Slot 数"), en: "Slots", ja: "スロット数", ko: "슬롯 수" }) : localized(language, { zh: "总通道数", "zh-Hant": traditional("总通道数"), en: "Total channels", ja: "総チャンネル数", ko: "전체 채널 수" })}
                    <strong>{channels} {protocol === "tdm" ? "slots" : "ch"}</strong>
                  </span>
                  <input
                    aria-label={localized(language, { zh: "通道数", "zh-Hant": traditional("通道数"), en: "Channels", ja: "チャンネル数", ko: "채널 수" })}
                    max="8"
                    min="2"
                    step="2"
                    type="range"
                    value={channels}
                    onChange={(event) => setChannels(Number(event.target.value))}
                  />
                </label>
              </div>

              <label className="interface-select-label">
                <span>{localized(language, { zh: "MCLK 倍频", "zh-Hant": traditional("MCLK 倍频"), en: "MCLK multiple", ja: "MCLK倍率", ko: "MCLK 배수" })}<strong>{mclkMultiple}fs</strong></span>
                <select aria-label={localized(language, { zh: "MCLK 倍频", "zh-Hant": traditional("MCLK 倍频"), en: "MCLK multiple", ja: "MCLK倍率", ko: "MCLK 배수" })} value={mclkMultiple} onChange={(event) => setMclkMultiple(Number(event.target.value))}>
                  {[128, 256, 384, 512].map((value) => <option key={value} value={value}>{value}fs</option>)}
                </select>
              </label>

              <div className="digital-lab-metrics">
                <strong>
                  {localized(language, { zh: `BCLK：${bclkFormula}`, "zh-Hant": traditional(`BCLK：${bclkFormula}`), en: `BCLK: ${bclkFormula}`, ja: `BCLK：${bclkFormula}`, ko: `BCLK: ${bclkFormula}` })}
                </strong>
                <strong>
                  {localized(language, { zh: `MCLK 配置 ${mclkMultiple}fs：${mclkFormula}`, "zh-Hant": traditional(`MCLK 配置 ${mclkMultiple}fs：${mclkFormula}`), en: `MCLK setting ${mclkMultiple}fs: ${mclkFormula}`, ja: `MCLK設定 ${mclkMultiple}fs：${mclkFormula}`, ko: `MCLK 설정 ${mclkMultiple}fs: ${mclkFormula}` })}
                </strong>
              </div>
            </>
          ) : null}

          <div className="lab-live-note">
            <strong>{localized(language, { zh: "协议说明  :  ", "zh-Hant": traditional("协议说明  :  "), en: "Protocol notes", ja: "プロトコルの説明", ko: "프로토콜 설명" })}</strong>
            <span>{activeCopy.body[language]}</span>
            <span>{protocolObservation}</span>
          </div>
        </div>

      </section>
    </main>
  );
}
