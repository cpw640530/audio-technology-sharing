import type { Language } from "../content/knowledge";

export function ConverterGuide({ language }: { language: Language }) {
  const zh = language === "zh";
  const stages = [
    {
      title: zh ? "ADC：从电压到 PCM" : "ADC: from voltage to PCM",
      flow: zh ? ["模拟输入与 PGA", "模拟抗混叠", "Σ-Δ 过采样与噪声整形", "数字低通与抽取", "PCM 输出"] : ["Analog input + PGA", "Analog anti-aliasing", "Σ-Δ oversampling + noise shaping", "Digital low-pass + decimation", "PCM output"],
      text: zh ? "这是常见 Σ-Δ 音频 ADC 的功能链路。内部高速转换率不同于最终 48 kHz 等 PCM 输出率；噪声整形把更多量化噪声移到带外，数字滤波后再抽取。模拟滤波与数字滤波各有职责，不能用一句‘采样前去掉 24 kHz 以上’概括所有内部环节。" : "This is a typical sigma-delta audio ADC chain. Its internal conversion rate differs from the final PCM rate, such as 48 kHz. Noise shaping moves more quantization noise out of band; digital filtering precedes decimation. Analog and digital filters serve different boundaries.",
      note: zh ? "理想数值例：以相对共模电压 ±1 V 对应满量程，16-bit 有符号 PCM 的步长为 2 V / 65536 ≈ 30.5 μV。+0.25 V 对应约 8192；前级放大 4 倍后已到正满量程边缘。实际输入范围、共模和增益必须查芯片手册。" : "Ideal example: with ±1 V relative to common mode as full scale, signed 16-bit PCM has a 2 V / 65536 ≈ 30.5 μV step. +0.25 V gives about 8192; 4× preamp gain reaches the positive full-scale edge. Actual range, common mode and gain come from the datasheet."
    },
    {
      title: zh ? "DAC：从 PCM 到模拟输出" : "DAC: from PCM to analog output",
      flow: zh ? ["PCM 输入", "数字插值", "Σ-Δ 调制与 DAC 核心", "模拟重建滤波", "线路输出 / 耳放"] : ["PCM input", "Digital interpolation", "Σ-Δ modulation + DAC core", "Analog reconstruction filter", "Line output / headphone amp"],
      text: zh ? "插值提高内部更新率，不会凭空恢复录音中没有的细节。重建滤波抑制采样镜像和带外噪声；实际响应还包含幅频、相位和延迟。阶梯图是零阶保持模型，并非每种音频 DAC 内部真实波形。" : "Interpolation increases the internal update rate without inventing missing recording detail. Reconstruction filtering suppresses images and out-of-band noise, with amplitude, phase and delay effects. A staircase is a zero-order-hold model, not the internal waveform of every audio DAC.",
      note: zh ? "线路输出不能默认直接驱动扬声器；耳机输出和扬声器功放也不是同一类负载能力。输出级是否集成，取决于具体型号。" : "A line output cannot be assumed to drive a speaker. Headphone and speaker amplifiers have different load capabilities; integration depends on the device."
    }
  ];
  const specs = zh ? [
    ["位宽与有效精度", "24-bit 是数据表示能力，不是 24-bit 无噪声精度。理想满幅正弦量化 SNR ≈ 6.02N + 1.76 dB；ENOB 应由规定条件下的 SINAD 估计。"],
    ["SNR / THD+N", "分别关注噪声和噪声加失真；比较时同时核对带宽、A 计权、信号频率与电平、负载，不能只比一个 dB 数字。"],
    ["时钟与延迟", "随机抖动、固定采样率偏差、时钟丢失是不同问题。ADC 抽取和 DAC 插值滤波也产生群延迟，低延迟模式可能牺牲部分带外抑制。"],
    ["无声 / 削波 / 爆音", "无声先查供电、时钟、路由与静音；削波查输入范围和 PGA；底噪查增益、参考与布局；上电爆音查偏置稳定和静音时序。"]
  ] : [
    ["Word length vs precision", "24-bit words do not mean 24 noise-free bits. Ideal full-scale sine quantization SNR ≈ 6.02N + 1.76 dB; estimate ENOB from SINAD under specified conditions."],
    ["SNR / THD+N", "Noise and distortion-plus-noise are different metrics. Compare bandwidth, A-weighting, test frequency, level and load alongside the dB figures."],
    ["Clocks and latency", "Random jitter, fixed rate error and missing clocks are different faults. ADC decimation and DAC interpolation filters add group delay; low-latency modes may trade stopband rejection."],
    ["Silence / clipping / pops", "For silence check supplies, clocks, routing and mute; for clipping check range and PGA; for noise check gain, reference and layout; for startup pops check bias settling and mute sequencing."]
  ];
  return <>
    {stages.map(stage => <section className="sound-topic-section" key={stage.title}>
      <h2>{stage.title}</h2><p>{stage.text}</p>
      <ol className="codec-guide-flow">{stage.flow.map((step, i) => <li key={step}><strong>{i + 1}. {step}</strong></li>)}</ol>
      <p className="sound-topic-note">{stage.note}</p>
    </section>)}
    <section className="sound-topic-section">
      <h2>{zh ? "Codec 与 SoC：音频、控制、时钟分开看" : "Codec and SoC: separate audio, control and clocks"}</h2>
      <p>{zh ? "Codec 中的采集与播放是两条可独立工作的路径，不要求录音数据必须经过 DSP 后返回 DAC。部分芯片还有不经过 ADC/DAC 的模拟旁路。" : "Capture and playback are independent paths: recorded data need not pass through a DSP and return to the DAC. Some devices also offer analog bypass without ADC/DAC conversion."}</p>
      <div className="codec-chip-boundary">
        <strong>{zh ? "Codec 芯片边界（通用功能示意）" : "Codec boundary (generic functional example)"}</strong>
        <p>{zh ? "模拟输入 → PGA → ADC → 数字音频输出 → SoC" : "Analog input → PGA → ADC → digital audio output → SoC"}</p>
        <p>{zh ? "SoC → 数字音频输入 → DAC → 输出缓冲 → 外部负载" : "SoC → digital audio input → DAC → output buffer → external load"}</p>
        <p>{zh ? "可选模拟旁路：输入 → 模拟混音 / 增益 → 输出" : "Optional analog bypass: input → analog mixer / gain → output"}</p>
      </div>
      <table className="codec-guide-table"><thead><tr><th>{zh ? "连接" : "Connection"}</th><th>{zh ? "职责与方向" : "Purpose and direction"}</th></tr></thead><tbody>
        {(zh ? [
          ["I2S / TDM", "Codec → SoC 送采集 PCM；SoC → Codec 送播放 PCM。时序细节见数字音频接口卡片。"],
          ["I²C / SPI", "SoC 配置 Codec 寄存器：输入选择、PGA、音量、静音、采样率与路由；不是用来持续传 PCM 的音频总线。"],
          ["时钟与供电", "BCLK / LRCLK 的驱动方向由主从模式决定；MCLK / PLL 需求因型号而异。模拟、数字电源和参考去耦按手册实施。"]
        ] : [
          ["I2S / TDM", "Codec → SoC carries capture PCM; SoC → Codec carries playback PCM. See the digital-interface topic for timing."],
          ["I²C / SPI", "SoC configures codec registers: input, PGA, volume, mute, rate and routing. This is not the streaming PCM audio bus."],
          ["Clocks and supplies", "BCLK/LRCLK direction depends on clock master selection. MCLK/PLL requirements vary; follow the datasheet for supplies, reference and decoupling."]
        ]).map(([name, text]) => <tr key={name}><th scope="row">{name}</th><td>{text}</td></tr>)}
      </tbody></table>
      <p>{zh ? "实例：瑞芯微 RK3308 是带内置 Audio CODEC 的语音 SoC，官方资料列出 8 路 ADC、2 路 DAC，并支持 2 组 8 通道 I2S/TDM、1 组 8 通道 PDM 和 1 组 2 通道 I2S/PCM。它适合用来理解‘SoC 内置 Codec + 音频接口 + Linux/ALSA 驱动’的链路，但不能代表所有瑞芯微 SoC 的模块和规格。" : "Example: Rockchip RK3308 is a voice-oriented SoC with an embedded audio CODEC. Rockchip lists 8 ADC channels, 2 DAC channels, two 8-channel I2S/TDM interfaces, one 8-channel PDM interface, and one 2-channel I2S/PCM interface. It is a useful example of an SoC-integrated codec plus audio interfaces and Linux/ALSA support, but it does not represent every Rockchip SoC."}</p>
      <a href="https://www.rock-chips.com/a/en/products/RK33_Series/2018/0614/907.html">{zh ? "查看瑞芯微 RK3308 官方资料" : "Rockchip RK3308 official product page"}</a>
    </section>
    <section className="sound-topic-section">
      <h2>{zh ? "读规格与定位问题" : "Read specifications and locate faults"}</h2>
      <table className="codec-guide-table"><thead><tr><th>{zh ? "关注点" : "Focus"}</th><th>{zh ? "如何判断" : "How to interpret it"}</th></tr></thead><tbody>{specs.map(([name,text]) => <tr key={name}><th scope="row">{name}</th><td>{text}</td></tr>)}</tbody></table>
      <p><a href="https://www.analog.com/en/resources/technical-articles/behind-the-sigma-delta-adc-topology.html">{zh ? "原理参考：ADI Σ-Δ ADC" : "Reference: ADI sigma-delta ADC"}</a> · <a href="https://www.analog.com/media/en/training-seminars/tutorials/mt-017.pdf">{zh ? "ADI 过采样与插值 DAC" : "ADI oversampling and interpolating DACs"}</a></p>
    </section>
  </>;
}
