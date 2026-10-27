import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import type { Language } from "../content/knowledge";

type DigitalInterfaceLabProps = {
  language: Language;
  onBack: () => void;
  onBackToDetails?: () => void;
};

type InterfaceProtocol = "i2s" | "tdm" | "pdm" | "spdif" | "usb";

const protocolLabels: Record<InterfaceProtocol, Record<Language, string>> = {
  i2s: { zh: "I2S", en: "I2S" },
  tdm: { zh: "TDM", en: "TDM" },
  pdm: { zh: "PDM", en: "PDM" },
  spdif: { zh: "SPDIF", en: "SPDIF" },
  usb: { zh: "USB Audio", en: "USB Audio" }
};

const protocolCopy: Record<
  InterfaceProtocol,
  {
    title: Record<Language, string>;
    body: Record<Language, string>;
  }
> = {
  i2s: {
    title: { zh: "协议：I2S / IIS / I²S", en: "Protocol: I2S / IIS / I²S" },
    body: {
      zh: "增加总通道数时，会增加并行 SD 线，而不是提高单条线的位时钟。图中表示数字样本的传输顺序，不表示 ADC 在左右半帧分别采样。",
      en: "Adding channels adds parallel SD lines rather than increasing the bit clock per line. The diagram shows sample transport order, not alternating left/right ADC acquisition."
    }
  },
  tdm: {
    title: { zh: "协议：TDM 多通道时分复用", en: "Protocol: TDM multichannel time division" },
    body: {
      zh: "保持 slot 宽度不变，降低有效位深只增加填充位，不降低 BCLK；改变 slot 数或宽度才改变帧长。缩小时隙会同步降低超出范围的位深，提高位深则自动扩展时隙。",
      en: "With fixed slot width, reducing valid bit depth adds padding without lowering BCLK. Slot count and width set frame length. Narrowing a slot also reduces any excessive bit depth; increasing bit depth expands the slot when needed."
    }
  },
  pdm: {
    title: { zh: "协议：PDM 数字麦克风", en: "Protocol: PDM digital microphone" },
    body: {
      zh: "观察一小段时间内的 1/0 比例，而不是某一个 bit：1 较多偏向正电平，0 较多偏向负电平，各半接近零。图中脉冲是密度示例，并非上方正弦波的逐点调制结果。",
      en: "Read the local proportion of 1s and 0s, not a single bit: more 1s means a more positive level, more 0s a more negative level, and half each is near zero. The bits illustrate density, not a simulated modulation of the sine above."
    }
  },
  spdif: {
    title: { zh: "协议：SPDIF 设备间数字音频", en: "Protocol: SPDIF device-to-device audio" },
    body: {
      zh: "实物图为光纤线缆；下方两条线表示同轴与光纤两种可选连接，并不是需要同时连接两条线。接收端从所选链路中恢复时钟。",
      en: "The photo shows an optical cable. The two lines below represent coaxial and optical alternatives, not two required simultaneous connections. The receiver recovers clocking from the chosen link."
    }
  },
  usb: {
    title: { zh: "协议：USB Audio 外设音频", en: "Protocol: USB Audio peripheral audio" },
    body: {
      zh: "这里示例主机向声卡异步播放，声卡用显式反馈向主机报告所需数据速率。并非所有 USB Audio 设备都使用独立反馈端点；采集方向及其他同步模式的配置不同。",
      en: "This example shows asynchronous playback from host to interface, with explicit feedback reporting the required data rate. Not all USB Audio devices use a separate feedback endpoint; capture and other synchronization modes differ."
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
    return language === "zh"
      ? `当前公式按每条 SD 计算名义 BCLK：${bclkFormula}；多通道 I2S 增加并行 SD 线，不把单条 SD 的 BCLK 乘以总通道数。MCLK=${mclkMultiple}fs（${mclkFormula}）只是单位换算，实际主从选择、PLL 锁定和时钟容差仍需校准。`
      : `The formula gives nominal BCLK per SD line: ${bclkFormula}; multichannel I2S adds parallel SD lines instead of multiplying one line's BCLK by total channels. MCLK=${mclkMultiple}fs (${mclkFormula}) is a unit conversion; master/slave choice, PLL lock, and clock tolerance still need hardware calibration.`;
  }

  if (protocol === "tdm") {
    return language === "zh"
      ? `当前公式按一帧的 slot 数和 slot 宽度计算名义 BCLK：${bclkFormula}；slot 数、宽度、顺序和 FS 极性必须与两端一致。MCLK=${mclkMultiple}fs（${mclkFormula}）不等于实测时钟精度，未模拟 PLL 锁定或边界偏移。`
      : `The formula gives nominal BCLK from frame slots and slot width: ${bclkFormula}; slot count, width, order, and FS polarity must match at both ends. MCLK=${mclkMultiple}fs (${mclkFormula}) is not measured clock accuracy, and PLL lock or edge offset is not simulated.`;
  }

  if (protocol === "pdm") {
    return language === "zh"
      ? "图中的 PDM 密度只用于说明 1-bit 流如何表达幅度；实际 PCM 还取决于抽取比、滤波器通带和噪声整形，左右声道的时钟边沿/选择脚也必须与接收端一致。"
      : "The PDM density here only illustrates how a 1-bit stream represents amplitude; actual PCM also depends on decimation ratio, filter passband, and noise shaping, while left/right clock-edge or select-pin wiring must match the receiver.";
  }

  if (protocol === "spdif") {
    return language === "zh"
      ? "SPDIF 把数据和时钟嵌在同一链路并由接收端恢复；本图不模拟线缆抖动、误码、PLL 锁定或接收端容差，不能把链路示意当成时钟质量测量。"
      : "SPDIF embeds data and clock on one link for receiver recovery; this diagram does not model cable jitter, bit errors, PLL lock, or receiver tolerance, so it is not a clock-quality measurement.";
  }

  return language === "zh"
    ? "USB Audio 没有本页 I2S/TDM 那样固定的 BCLK 线；等时包、缓冲和反馈端点用于对齐主机与设备速率，本图不模拟主机调度、端到端延迟或时钟漂移校准。"
    : "USB Audio has no fixed BCLK wire like I2S/TDM here; isochronous packets, buffers, and feedback endpoints align host and device rates. This diagram does not simulate host scheduling, end-to-end latency, or clock-drift calibration.";
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

function getI2sBitLabel(cell: number, bitDepth: number) {
  const position = cell % 8;

  if (position === 0) {
    return "MSB";
  }

  if (position === 3) {
    return "...";
  }

  if (position === 6) {
    return "b1";
  }

  if (position === 7) {
    return "LSB";
  }

  return `b${bitDepth - position - 1}`;
}

function renderI2sDiagram(language: Language, bitDepth: number, channels: number) {
  const bitCells = Array.from({ length: 16 }, (_, index) => index);
  const dataLines = Array.from({ length: Math.ceil(channels / 2) }, (_, index) => index);
  const isMultichannelI2s = channels > 2;
  const i2sDataStartY = 166;
  const i2sDataRowGap = 44;
  const i2sDataRowHeight = 34;
  const i2sLastDataRowY = i2sDataStartY + (dataLines.length - 1) * i2sDataRowGap;
  const i2sNotesY = i2sLastDataRowY + i2sDataRowHeight + 44;
  const i2sMclkLabelY = i2sNotesY + 134;
  const i2sMclkWaveY = i2sMclkLabelY + 16;
  const i2sMappingY = i2sMclkWaveY + 58;
  const i2sDiagramHeight = isMultichannelI2s ? i2sMappingY + 36 : 360;
  const leftFrameChannels = dataLines.map((line) => `CH${line * 2 + 1}`).join(" / ");
  const rightFrameChannels = dataLines.map((line) => `CH${line * 2 + 2}`).join(" / ");

  return (
    <svg
      aria-label={language === "zh" ? "I2S 时序图" : "I2S timing diagram"}
      role="img"
      viewBox={`0 0 760 ${i2sDiagramHeight}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <marker id="interfaceArrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
          <path d="M 0 0 L 8 4 L 0 8 Z" fill="#f0b46a" />
        </marker>
      </defs>
      <rect className="lab-diagram-bg" height={i2sDiagramHeight} rx="14" width="760" />
      <text className="lab-label" x="42" y="44">BCLK</text>
      <text className="lab-label" x="42" y="116">LRCLK</text>
      <text className="lab-label" x="42" y={isMultichannelI2s ? 150 : 188}>{isMultichannelI2s ? (language === "zh" ? "SD 数据线" : "SD lines") : "SD"}</text>
      <text className="lab-label" x="42" y={isMultichannelI2s ? i2sMclkLabelY : 282}>MCLK</text>
      <path className="interface-clock-line" d={createSquareWavePath({ height: 28, pulses: 24, width: 588, x: 124, y: 72 })} />
      <path className="interface-frame-line" d="M 124 132 H 418 V 104 H 712 V 132" />
      {isMultichannelI2s ? (
        <>
          <text className="interface-channel-label" x="266" y="152">{language === "zh" ? "L 半帧" : "L half-frame"}</text>
          <text className="interface-channel-label" x="560" y="152">{language === "zh" ? "R 半帧" : "R half-frame"}</text>
          <g>
            {dataLines.map((line) => {
              const y = i2sDataStartY + line * i2sDataRowGap;
              const leftChannel = line * 2 + 1;
              const rightChannel = line * 2 + 2;

              return (
                <g key={line}>
                  <text className="lab-label interface-i2s-line-label" x="86" y={y + 20}>{`SD${line}`}</text>
                  <rect className="interface-i2s-data-pair" height={i2sDataRowHeight} width="284" x="124" y={y} />
                  <rect className="interface-i2s-data-pair right" height={i2sDataRowHeight} width="284" x="418" y={y} />
                  <text className="interface-slot-label" x="266" y={y + 18}>{`CH${leftChannel}`}</text>
                  <text className="interface-slot-label" x="560" y={y + 18}>{`CH${rightChannel}`}</text>
                </g>
              );
            })}
          </g>
          <text className="interface-tdm-note" x="124" y={i2sNotesY}>
            {language === "zh"
              ? `多通道 I2S（并行 SD 线）：${dataLines.length} 条 SD 数据线同时工作`
              : `Multichannel I2S (parallel SD lines): ${dataLines.length} SD data lines work at once`}
          </text>
          <text className="interface-tdm-note" x="124" y={i2sNotesY + 22}>
            {language === "zh"
              ? `左半帧并行传输 ${leftFrameChannels}`
              : `Left half-frame transfers ${leftFrameChannels} in parallel`}
          </text>
          <text className="interface-tdm-note" x="124" y={i2sNotesY + 44}>
            {language === "zh"
              ? `右半帧并行传输 ${rightFrameChannels}`
              : `Right half-frame transfers ${rightFrameChannels} in parallel`}
          </text>
          <text className="interface-tdm-note" x="124" y={i2sNotesY + 66}>
            {language === "zh" ? "每条 SD 仍只传一对 L / R；LRCLK 只负责左右半帧" : "Each SD still carries one L/R pair; LRCLK only marks the two half-frames"}
          </text>
          <text className="interface-tdm-note" x="124" y={i2sNotesY + 88}>
            {language === "zh" ? "如果只用一条 SD 放多声道，那是 TDM 的 slot 思路" : "If one SD carries many channels, that is the TDM slot approach"}
          </text>
          <path className="interface-clock-line faint" d={createSquareWavePath({ height: 18, pulses: 12, width: 588, x: 124, y: i2sMclkWaveY })} />
          <g>
            {dataLines.map((line) => {
              const leftChannel = line * 2 + 1;
              const rightChannel = line * 2 + 2;
              return (
                <text className="interface-channel-label" key={`map-${line}`} x={124 + line * 150} y={i2sMappingY}>
                  {`SD${line}: CH${leftChannel} / CH${rightChannel}`}
                </text>
              );
            })}
          </g>
        </>
      ) : (
        <>
          <path className="interface-clock-line faint" d={createSquareWavePath({ height: 18, pulses: 12, width: 588, x: 124, y: 298 })} />
          <g>
            {bitCells.map((cell) => {
              const x = 124 + cell * 36;
              const isRight = cell >= 8;
              return (
                <g key={cell}>
                  <rect className={isRight ? "interface-bit-cell right" : "interface-bit-cell"} height="46" width="34" x={x} y="164" />
                  <text className="interface-bit-text" x={x + 17} y="192">
                    {getI2sBitLabel(cell, bitDepth)}
                  </text>
                </g>
              );
            })}
          </g>
          <text className="interface-channel-label" x="216" y="238">{language === "zh" ? `L: bit${bitDepth - 1} → bit0` : `L: bit${bitDepth - 1} to bit0`}</text>
          <text className="interface-channel-label" x="506" y="238">{language === "zh" ? `R: bit${bitDepth - 1} → bit0` : `R: bit${bitDepth - 1} to bit0`}</text>
          <text className="lab-chip" x="418" y="324" textAnchor="middle">{language === "zh" ? "LRCLK 每翻转一次切换声道" : "LRCLK toggles between channels"}</text>
        </>
      )}
    </svg>
  );
}

function renderTdmDiagram(language: Language, channels: number, slotWidth: number, bitDepth: number) {
  const slots = Array.from({ length: channels }, (_, index) => index + 1);
  const slotVisualWidth = 620 / channels;
  const channelBoxWidth = 548 / channels;

  return (
    <svg
      aria-label={language === "zh" ? "TDM 时隙图" : "TDM slot diagram"}
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
      <text className="lab-label" x="48" y="42">{language === "zh" ? "时钟与帧同步" : "Clock and frame sync"}</text>
      <text className="lab-chip" x="424" y="42">
        {language === "zh" ? `一帧 = ${channels} 个 slot` : `One frame = ${channels} slots`}
      </text>
      <text className="lab-label" x="18" y="86">BCLK</text>
      <path className="interface-clock-line" d={createSquareWavePath({ height: 22, pulses: 32, width: 620, x: 70, y: 94 })} />
      <text className="lab-label" x="48" y="138">FS</text>
      <path className="interface-frame-line" d="M 70 142 V 116 H 132 V 142 H 690" />
      <text className="interface-tdm-note" x="352" y="134">
        {language === "zh" ? "FS 帧同步：新一帧从这里开始" : "FS frame sync: a new frame starts here"}
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
              <text className="interface-slot-sub" x={x + slotVisualWidth / 2 - 2.5} y="246">{language === "zh" ? `CH${slot}` : `CH${slot}`}</text>
              <text className="interface-slot-sub" x={x + slotVisualWidth / 2 - 2.5} y="268">
                {`${bitDepth}+${slotWidth - bitDepth}`}
              </text>
            </g>
          );
        })}
      </g>
      <text className="interface-tdm-note" x="70" y="316">
        {language === "zh" ? "每个 slot 内仍按 MSB → LSB 传一个采样字" : "Each slot sends one sample, MSB to LSB"}
      </text>
      <text className="interface-tdm-note" x="430" y="316">
        {language === "zh" ? `${channels} 个 slot 共用一条 SD 数据线` : `${channels} slots share one SD line`}
      </text>
      <path className="interface-flow-arrow" d="M 380 324 L 380 346" />
      <text className="lab-label" x="48" y="364">
        {language === "zh" ? "SD 串行数据拆回多声道" : "Serial SD data is split back into channels"}
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
        {language === "zh" ? "slot 宽度可以大于有效位深，多余 bit 通常补 0" : "Slot width can exceed valid bit depth; extra bits are usually padded with 0"}
      </text>
      <text className="interface-tdm-note" x="70" y="444">
        {language === "zh" ? "slot 顺序两端必须一致，否则 CH1/CH2 会错位" : "Slot order must match at both ends, or CH1/CH2 will shift"}
      </text>
    </svg>
  );
}

function renderPdmDiagram(language: Language) {
  const bits = createPdmBits();
  const bitPreview = bits.slice(0, 32);

  return (
    <svg
      aria-label={language === "zh" ? "PDM 到 PCM 转换图" : "PDM to PCM conversion diagram"}
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
      <text className="lab-label" x="48" y="44">{language === "zh" ? "PDM 从哪里来" : "Where PDM comes from"}</text>
      <path className="interface-pcm-wave" d="M 58 116 C 86 74 122 74 150 116 S 214 158 242 116" />
      <text className="lab-chip" x="58" y="76">{language === "zh" ? "模拟声音电压" : "Analog sound voltage"}</text>
      <rect className="interface-node" height="78" rx="10" width="128" x="286" y="76" />
      <text className="interface-node-text" x="350" y="104">{language === "zh" ? "Σ-Δ 调制器" : "Sigma-delta"}</text>
      <text className="interface-node-sub" x="350" y="132">{language === "zh" ? "模拟 → 1-bit" : "Analog to 1-bit"}</text>
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
      <text className="lab-chip" x="482" y="170">{language === "zh" ? "1-bit 高速脉冲密度流" : "High-rate 1-bit PDM"}</text>

      <text className="lab-label" x="48" y="230">{language === "zh" ? "密度如何表示幅度" : "Density represents amplitude"}</text>
      <text className="interface-tdm-note" x="56" y="260">{language === "zh" ? "脉冲密度表示幅度" : "Pulse density represents amplitude"}</text>
      <g transform="translate(56 278)">
        {"1110111111011110".split("").map((bit, index) => (
          <rect className={bit === "1" ? "interface-pdm-bit high" : "interface-pdm-bit"} height={bit === "1" ? 34 : 10} key={`dense-${index}`} width="9" x={index * 13} y={bit === "1" ? 0 : 24} />
        ))}
      </g>
      <text className="interface-tdm-note" x="56" y="334">{language === "zh" ? "1 更多 = 电平更偏正" : "More 1s = more positive"}</text>
      <g transform="translate(284 278)">
        {"1010101010101010".split("").map((bit, index) => (
          <rect className={bit === "1" ? "interface-pdm-bit high" : "interface-pdm-bit"} height={bit === "1" ? 34 : 10} key={`mid-${index}`} width="9" x={index * 13} y={bit === "1" ? 0 : 24} />
        ))}
      </g>
      <text className="interface-tdm-note" x="284" y="334">{language === "zh" ? "1/0 各半 ≈ 零电平" : "Half 1s / 0s ≈ zero"}</text>

      <rect className="interface-node" height="78" rx="10" width="158" x="534" y="250" />
      <text className="interface-node-text" x="613" y="280">{language === "zh" ? "低通 + 抽取" : "LPF + decimation"}</text>
      <text className="interface-node-sub" x="613" y="306">PDM → PCM</text>
      <path className="interface-flow-arrow" d="M 468 294 L 526 294" />
      <text className="interface-tdm-note" x="56" y="370">
        {language === "zh" ? "PDM 高速 1-bit 流 → PCM 多 bit 采样值" : "High-rate 1-bit PDM stream to multibit PCM samples"}
      </text>
      <text className="interface-tdm-note" x="56" y="392">{language === "zh" ? "抽取滤波后变成 PCM" : "Decimation turns it into PCM"}</text>
      <text className="lab-label" x="48" y="430">{language === "zh" ? "PDM 时钟与采样率" : "PDM clock and sample rate"}</text>
      <text className="interface-tdm-note" x="56" y="456">
        {language === "zh" ? "PDM 时钟 ≈ 目标采样率 × 抽取倍数" : "PDM clock roughly equals target sample rate times decimation ratio"}
      </text>
      <text className="interface-tdm-note" x="56" y="478">
        {language === "zh" ? "48 kHz PCM 常见：3.072 MHz PDM = 48 kHz × 64" : "Common 48 kHz PCM case: 3.072 MHz PDM = 48 kHz x 64"}
      </text>
      <text className="interface-tdm-note" x="56" y="510">
        {language === "zh" ? "数字麦的 PDM 时钟通常由主控或 Codec 提供，不等于 CPU 主频" : "The host or codec typically clocks a PDM mic, not at the CPU frequency"}
      </text>
    </svg>
  );
}

function renderSpdifDiagram(language: Language) {
  return (
    <svg
      aria-label={language === "zh" ? "SPDIF 设备链路图" : "SPDIF device link diagram"}
      role="img"
      viewBox="0 0 760 520"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect className="lab-diagram-bg" height="520" rx="14" width="760" />
      <image
        aria-label={language === "zh" ? "SPDIF 同轴光纤线示例图" : "SPDIF coaxial optical cable example"}
        height="210"
        href="/audio-technology-sharing/images/spdif-line.png"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        width="250"
        x="48"
        y="50"
      />
      <text className="lab-label" x="336" y="76">{language === "zh" ? "SPDIF 线缆示例" : "SPDIF cable example"}</text>
      <foreignObject x="336" y="94" width="376" height="190">
      <div className="interface-diagram-copy">
      <p>
        {language === "zh"
          ? "同轴或光纤用于设备之间传数字音频"
          : "Coaxial or optical links carry digital audio between devices"}
      </p>
      <p>
        {language === "zh"
          ? "音频数据和时钟信息嵌在同一条链路里，接收端再恢复时钟"
          : "Audio data and clocking are embedded in one link, then recovered by the receiver"}
      </p>
      <p>
        {language === "zh"
          ? "它是外部设备互连接口，不是芯片内部的 I2S/TDM 总线"
          : "It is an external device interconnect, not an internal I2S/TDM chip bus"}
      </p>
      </div>
      </foreignObject>
      <rect className="interface-device-node" height="96" rx="12" width="150" x="68" y="326" />
      <text className="interface-node-text" x="143" y="362">{language === "zh" ? "播放器 / 电视" : "Player / TV"}</text>
      <text className="interface-node-sub" x="143" y="390">{language === "zh" ? "SPDIF 输出" : "SPDIF out"}</text>
      <rect className="interface-device-node" height="96" rx="12" width="150" x="542" y="326" />
      <text className="interface-node-text" x="617" y="362">{language === "zh" ? "功放 / 声卡" : "Amp / interface"}</text>
      <text className="interface-node-sub" x="617" y="390">{language === "zh" ? "时钟恢复" : "Clock recovery"}</text>
      <path className="interface-link-line" d="M 232 374 C 306 318 454 318 528 374" />
      <path className="interface-link-line alt" d="M 232 388 C 306 444 454 444 528 388" />
      <text className="lab-chip" x="274" y="292">{language === "zh" ? "同轴 / 光纤" : "Coaxial / optical"}</text>
      <text className="lab-chip" x="250" y="484">{language === "zh" ? "嵌入式时钟 + 双相标记编码" : "Embedded clock + biphase mark coding"}</text>
    </svg>
  );
}

function renderUsbDiagram(language: Language) {
  return (
    <svg
      aria-label={language === "zh" ? "USB Audio 包传输图" : "USB Audio packet transfer diagram"}
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
        aria-label={language === "zh" ? "USB 外置声卡示例图" : "USB external sound card example"}
        height="210"
        href="/audio-technology-sharing/images/usb-audio-card.png.png"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        width="250"
        x="48"
        y="50"
      />
      <text className="lab-label" x="336" y="76">{language === "zh" ? "USB 外置声卡示例" : "USB external sound card example"}</text>
      <foreignObject x="336" y="94" width="376" height="190">
      <div className="interface-diagram-copy">
      <p>
        {language === "zh"
          ? "USB 连接主机，设备提供耳机、麦克风和耳麦一体接口"
          : "USB connects to the host; the device provides headphone, mic, and combo headset ports"}
      </p>
      <p>
        {language === "zh"
          ? "这类产品属于 USB Audio 外设，不是 SPDIF 同轴/光纤接口"
          : "This is a USB Audio peripheral, not an SPDIF coaxial or optical interface"}
      </p>
      <p>{language === "zh" ? "设备枚举 → 端点 → 等时包 → 音频缓冲" : "Enumeration to endpoints to isochronous packets to audio buffers"}</p>
      </div>
      </foreignObject>
      <rect className="interface-device-node" height="82" rx="12" width="136" x="54" y="326" />
      <text className="interface-node-text" x="122" y="354">{language === "zh" ? "主机" : "Host"}</text>
      <text className="interface-node-sub" x="122" y="380">PC / Phone</text>
      <rect className="interface-device-node" height="82" rx="12" width="146" x="560" y="326" />
      <text className="interface-node-text" x="633" y="354">{language === "zh" ? "声卡 / 耳机" : "Interface / headset"}</text>
      <text className="interface-node-sub" x="633" y="380">USB Audio</text>
      {[0, 1, 2, 3].map((packet) => (
        <g key={packet}>
          <rect className="interface-usb-packet" height="46" rx="8" width="70" x={232 + packet * 80} y={328 + (packet % 2) * 46} />
          <text className="interface-slot-label" x={267 + packet * 80} y={356 + (packet % 2) * 46}>{`Pkt ${packet + 1}`}</text>
        </g>
      ))}
      <path className="interface-flow-arrow" d="M 196 366 L 224 366" />
      <path className="interface-flow-arrow" d="M 526 366 L 552 366" />
      <path className="interface-link-line alt" d="M 536 452 C 430 484 330 484 224 452" />
      <path className="interface-flow-arrow" d="M 244 452 L 224 452" />
      <text className="lab-chip" x="224" y="296">{language === "zh" ? "音频样本被装入 USB 等时包" : "Playback: isochronous audio packets"}</text>
      <text className="lab-chip" x="156" y="504">{language === "zh" ? "异步播放示例：设备向主机反馈速率" : "Async playback: rate feedback to host"}</text>
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

  return renderI2sDiagram(language, bitDepth, channels);
}

export function DigitalInterfaceLab({ language, onBack, onBackToDetails }: DigitalInterfaceLabProps) {
  const [protocol, setProtocol] = useState<InterfaceProtocol>("i2s");
  const [sampleRate, setSampleRate] = useState(48);
  const [bitDepth, setBitDepth] = useState(24);
  const [channels, setChannels] = useState(2);
  const [slotWidth, setSlotWidth] = useState(32);
  const [mclkMultiple, setMclkMultiple] = useState(256);

  const sampleRateHz = sampleRate * 1000;
  const bclkMhz = useMemo(() => formatMhz((sampleRateHz * (protocol === "tdm" ? channels * slotWidth : bitDepth * 2)) / 1_000_000), [bitDepth, channels, protocol, sampleRateHz, slotWidth]);
  const mclkMhz = useMemo(() => formatMhz((sampleRateHz * mclkMultiple) / 1_000_000), [mclkMultiple, sampleRateHz]);
  const bclkFormula = protocol === "tdm"
    ? `${sampleRate} kHz × 1000 × ${channels} slots × ${slotWidth} bit ÷ 1,000,000 = ${bclkMhz} MHz`
    : `${sampleRate} kHz × 1000 × ${bitDepth} bit × 2 ch ÷ 1,000,000 = ${bclkMhz} MHz / SD`;
  const mclkFormula = `${sampleRate} kHz × 1000 × ${mclkMultiple} ÷ 1,000,000 = ${mclkMhz} MHz`;
  const activeCopy = protocolCopy[protocol];
  const usesClockControls = protocol === "i2s" || protocol === "tdm";
  const protocolObservation = getProtocolObservation({ bclkFormula, language, mclkFormula, mclkMultiple, protocol });

  return (
    <main className="digital-interface-page">
      <section className="sound-lab-hero" aria-labelledby="digital-interface-title">
        <div className="sound-lab-back-actions">
        <button className="sound-lab-back sound-lab-back-secondary" type="button" onClick={onBack}>
          <ArrowLeft size={18} aria-hidden="true" />
          {language === "zh" ? "返回知识库" : "Back to knowledge base"}
        </button>
        {onBackToDetails && <button className="sound-lab-back" type="button" onClick={onBackToDetails}>
          <ArrowLeft size={18} aria-hidden="true" />
          {language === "zh" ? "返回详细内容" : "Back to detailed content"}
        </button>}
        </div>
        <div>
          <span className="section-kicker">{language === "zh" ? "硬件实验" : "Hardware lab"}</span>
          <h1 id="digital-interface-title">{language === "zh" ? "数字音频接口实验室" : "Digital Audio Interface Lab"}</h1>
          <p>
            {language === "zh"
              ? "切换常见数字音频接口，观察时钟线、数据线、帧同步、slot、PDM 抽取和 USB 包传输之间的区别。"
              : "Switch common digital audio interfaces and compare clocks, data lines, frame sync, slots, PDM decimation, and USB packet transport."}
          </p>
        </div>
      </section>

      <section className="digital-interface-workbench" aria-label={language === "zh" ? "数字音频接口实验台" : "Digital audio interface workbench"}>
        <div className="digital-lab-visual">
          <div className="digital-lab-status">
            <strong>{activeCopy.title[language]}</strong>
            {usesClockControls ? (
              <span>
                {language === "zh"
                  ? `BCLK = ${bclkFormula}`
                  : `BCLK = ${bclkFormula}`}
              </span>
            ) : null}
          </div>
          <div className="interface-diagram-scroll" role="region" aria-label={language === "zh" ? "接口图解" : "Interface diagram"} tabIndex={0}>
            {renderProtocolDiagram(protocol, language, bitDepth, channels, slotWidth)}
          </div>
          {usesClockControls && <p className="codec-model-note">{language === "zh"
            ? (protocol === "i2s" ? "本图展示声道排布，位单元与时钟周期有省略，不按比例绘制。标准 I2S 在 LRCLK 切换后一个 BCLK 周期发送新声道 MSB；此处计算假设每个声道时隙宽度等于有效位深，不含填充。" : `每个 slot 下方的 ${bitDepth}+${slotWidth - bitDepth} 表示有效数据位 + 填充位；示例按左对齐、补 0 处理。时钟图不逐位展开，FS 宽度、极性和首位延迟以芯片配置为准。`)
            : (protocol === "i2s" ? "Channel-layout schematic: bit cells and clock cycles are abbreviated, not to scale. Standard I2S sends the new MSB one BCLK after LRCLK changes. This calculation assumes slot width equals valid bit depth, with no padding." : `${bitDepth}+${slotWidth - bitDepth} in each slot means valid data bits + padding bits, shown left-aligned with zero padding. Clock cycles are abbreviated; FS width, polarity and first-bit delay depend on chip configuration.`)}
          </p>}
        </div>

        <div className="digital-interface-panel">
          <div className="interface-tabs" role="group" aria-label={language === "zh" ? "接口协议" : "Interface protocol"}>
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
                {protocol === "tdm" && <label>
                  <span>
                    {language === "zh" ? "Slot 宽度" : "Slot width"}
                    <strong>{slotWidth} bit</strong>
                  </span>
                  <select aria-label={language === "zh" ? "Slot 宽度" : "Slot width"} value={slotWidth} onChange={(event) => {
                    const width = Number(event.target.value);
                    setSlotWidth(width);
                    setBitDepth(Math.min(bitDepth, width));
                  }}>
                    {[16, 24, 32].map((value) => <option key={value} value={value}>{value} bit</option>)}
                  </select>
                </label>}
                <label>
                  <span>
                    {language === "zh" ? "采样率" : "Sample rate"}
                    <strong>{sampleRate} kHz</strong>
                  </span>
                  <input
                    aria-label={language === "zh" ? "采样率" : "Sample rate"}
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
                    {language === "zh" ? "位深" : "Bit depth"}
                    <strong>{bitDepth} bit</strong>
                  </span>
                  <input
                    aria-label={language === "zh" ? "位深" : "Bit depth"}
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
                    {protocol === "tdm" ? (language === "zh" ? "Slot 数" : "Slots") : (language === "zh" ? "总通道数" : "Total channels")}
                    <strong>{channels} {protocol === "tdm" ? "slots" : "ch"}</strong>
                  </span>
                  <input
                    aria-label={language === "zh" ? "通道数" : "Channels"}
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
                <span>{language === "zh" ? "MCLK 倍频" : "MCLK multiple"}<strong>{mclkMultiple}fs</strong></span>
                <select aria-label={language === "zh" ? "MCLK 倍频" : "MCLK multiple"} value={mclkMultiple} onChange={(event) => setMclkMultiple(Number(event.target.value))}>
                  {[128, 256, 384, 512].map((value) => <option key={value} value={value}>{value}fs</option>)}
                </select>
              </label>

              <div className="digital-lab-metrics">
                <strong>
                  {language === "zh"
                    ? `BCLK：${bclkFormula}`
                    : `BCLK: ${bclkFormula}`}
                </strong>
                <strong>
                  {language === "zh"
                    ? `MCLK 配置 ${mclkMultiple}fs：${mclkFormula}`
                    : `MCLK setting ${mclkMultiple}fs: ${mclkFormula}`}
                </strong>
              </div>
            </>
          ) : null}

          <div className="lab-live-note">
            <strong>{language === "zh" ? "协议说明  :  " : "Protocol notes"}</strong>
            <span>{activeCopy.body[language]}</span>
            <span>{protocolObservation}</span>
          </div>
        </div>

      </section>
    </main>
  );
}
