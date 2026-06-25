import { ArrowLeft } from "lucide-react";

import type { Language } from "../content/knowledge";

type RealtimeAudioLabProps = {
  language: Language;
  onBack: () => void;
};

type FlowStep = {
  title: Record<Language, string>;
  detail: Record<Language, string>;
  type?: "hardware" | "driver" | "buffer" | "process" | "codec";
};

type FlowLayout = "horizontal" | "compact-horizontal";

const bytesPerSample = 2;
const channels = 1;
const sampleRate = 16000;
const bufferFrames = 512;
const dspMs = 1.4;
const jitterMs = 0.4;
const periodMs = (bufferFrames / sampleRate) * 1000;
const samples = bufferFrames * channels;
const bytes = samples * bytesPerSample;
const worstProcessingMs = dspMs + jitterMs;
const latencyMs = periodMs * 3;

const basicFlowSteps = [
  {
    title: { zh: "声音输入", en: "Sound input" },
    detail: { zh: "空气压力变化进入麦克风", en: "air pressure enters the microphone" },
    type: "hardware"
  },
  {
    title: { zh: "麦克风 / ADC", en: "Microphone / ADC" },
    detail: { zh: "模拟声音变为 PCM 采样", en: "analog sound becomes PCM samples" },
    type: "hardware"
  },
  {
    title: { zh: "驱动采集 PCM", en: "Driver captures PCM" },
    detail: { zh: "硬件 DMA 和驱动持续搬运数据", en: "DMA and driver move samples continuously" },
    type: "driver"
  },
  {
    title: { zh: "采集 buffer", en: "Capture buffer" },
    detail: { zh: "暂存原始 PCM，等待应用读取", en: "stores raw PCM until the app reads it" },
    type: "buffer"
  },
  {
    title: { zh: "用户态读取 PCM", en: "User-space PCM read" },
    detail: { zh: "read 或 mmap 取到一段 PCM", en: "read or mmap obtains a PCM block" },
    type: "process"
  },
  {
    title: { zh: "filter / DSP", en: "filter / DSP" },
    detail: { zh: "滤波、降噪、AEC、AGC", en: "filtering, NS, AEC, AGC" },
    type: "process"
  },
  {
    title: { zh: "编码器输入 buffer", en: "Encoder input buffer" },
    detail: { zh: "攒够编码器需要的样本数", en: "accumulates enough samples for codec frames" },
    type: "buffer"
  },
  {
    title: { zh: "编码", en: "Encode" },
    detail: { zh: "PCM 压缩为 MP3 / Opus 等帧", en: "PCM is compressed into MP3 / Opus frames" },
    type: "codec"
  },
  {
    title: { zh: "传输 / 缓存", en: "Transmit / buffer" },
    detail: { zh: "文件、RTSP/RTP 或 jitter buffer", en: "file, RTSP/RTP, or jitter buffer" },
    type: "buffer"
  },
  {
    title: { zh: "解码", en: "Decode" },
    detail: { zh: "压缩帧还原为播放 PCM", en: "compressed frames return to playback PCM" },
    type: "codec"
  },
  {
    title: { zh: "播放侧 filter / DSP", en: "Playback filter / DSP" },
    detail: { zh: "音量、EQ、混音或响度处理", en: "volume, EQ, mixing, or loudness processing" },
    type: "process"
  },
  {
    title: { zh: "播放驱动", en: "Playback driver" },
    detail: { zh: "写入播放 ring buffer，DMA 读走", en: "writes playback ring buffer, DMA reads out" },
    type: "driver"
  },
  {
    title: { zh: "D/A 转换", en: "D/A conversion" },
    detail: { zh: "DAC 把 PCM 变回模拟电压", en: "DAC turns PCM back into analog voltage" },
    type: "hardware"
  },
  {
    title: { zh: "功放", en: "Amplifier" },
    detail: { zh: "放大模拟信号推动负载", en: "amplifies analog signal to drive the load" },
    type: "hardware"
  },
  {
    title: { zh: "声音输出", en: "Sound output" },
    detail: { zh: "扬声器振膜推动空气", en: "speaker diaphragm moves air" },
    type: "hardware"
  }
] satisfies FlowStep[];

const alsaFlowSteps = [
  {
    title: { zh: "麦克风", en: "Microphone" },
    detail: { zh: "空气压力变化先变成很小的模拟电信号", en: "air pressure first becomes a tiny analog electrical signal" },
    type: "hardware"
  },
  {
    title: { zh: "模拟前端 / Codec ADC", en: "Analog front end / Codec ADC" },
    detail: { zh: "放大、偏置、抗混叠后采样成 16 kHz / mono / 16-bit PCM", en: "amplifies, biases, anti-aliases, then samples to 16 kHz / mono / 16-bit PCM" },
    type: "hardware"
  },
  {
    title: { zh: "I2S / PDM / USB Audio", en: "I2S / PDM / USB Audio" },
    detail: { zh: "硬件接口把采样送到 SoC 或声卡", en: "hardware interface sends samples to SoC or audio card" },
    type: "hardware"
  },
  {
    title: { zh: "DMA", en: "DMA" },
    detail: { zh: "不经过 CPU 逐点拷贝，直接写内存", en: "writes memory without CPU copying every sample" },
    type: "driver"
  },
  {
    title: { zh: "ALSA ring buffer", en: "ALSA ring buffer" },
    detail: { zh: "内核态 PCM 环形 buffer，保存原始采集数据", en: "kernel PCM ring buffer storing captured data" },
    type: "buffer"
  },
  {
    title: { zh: "period ready", en: "period ready" },
    detail: { zh: "达到一个 period 后中断或唤醒应用", en: "interrupts or wakes the app when one period is ready" },
    type: "driver"
  },
  {
    title: { zh: "copy_to_user / mmap", en: "copy_to_user / mmap" },
    detail: { zh: "read 走拷贝，mmap 可减少显式拷贝", en: "read copies data; mmap reduces explicit copies" },
    type: "process"
  },
  {
    title: { zh: "用户态 capture buffer", en: "User capture buffer" },
    detail: { zh: "应用拿到可处理的 PCM", en: "PCM block ready for the application" },
    type: "buffer"
  },
  {
    title: { zh: "32ms filter frame", en: "32 ms filter frame" },
    detail: { zh: "16 kHz 下 512 samples / 1024 bytes", en: "512 samples / 1024 bytes at 16 kHz" },
    type: "buffer"
  },
  {
    title: { zh: "filter / DSP", en: "filter / DSP" },
    detail: { zh: "高通滤波、降噪、AEC、AGC", en: "high-pass, noise suppression, AEC, AGC" },
    type: "process"
  },
  {
    title: { zh: "编码器输入 buffer", en: "Encoder input buffer" },
    detail: { zh: "按编码器帧长重新攒样本", en: "accumulates samples according to codec frame size" },
    type: "buffer"
  },
  {
    title: { zh: "MP3 frame", en: "MP3 frame" },
    detail: { zh: "例如 MP3 常见 1152 samples 一帧", en: "for example, MP3 commonly uses 1152 samples per frame" },
    type: "codec"
  }
] satisfies FlowStep[];

const playbackFlowSteps = [
  {
    title: { zh: "网络包 / 文件码流", en: "Network packet / file bitstream" },
    detail: { zh: "RTSP/RTP 包、文件块或其他压缩码流入口", en: "RTSP/RTP packets, file chunks, or compressed bitstream input" },
    type: "codec"
  },
  {
    title: { zh: "接收 buffer / jitter buffer", en: "Receive buffer / jitter buffer" },
    detail: { zh: "抵抗网络包到达时间抖动，按播放时间排队", en: "absorbs packet-arrival jitter and queues by playout time" },
    type: "buffer"
  },
  {
    title: { zh: "解包 / 重排", en: "Depacketize / reorder" },
    detail: { zh: "去掉 RTP/容器头，按序恢复连续编码帧", en: "removes RTP/container headers and restores ordered codec frames" },
    type: "process"
  },
  {
    title: { zh: "解码器输入 buffer", en: "Decoder input buffer" },
    detail: { zh: "攒够一帧 MP3/AAC/Opus 后才能送解码器", en: "accumulates one MP3/AAC/Opus frame before decoding" },
    type: "buffer"
  },
  {
    title: { zh: "MP3 解码", en: "MP3 decode" },
    detail: { zh: "压缩帧解码回多点 PCM 采样", en: "turns compressed frames back into PCM samples" },
    type: "codec"
  },
  {
    title: { zh: "PCM playback buffer", en: "PCM playback buffer" },
    detail: { zh: "保存待播放 PCM，太少会 underrun", en: "stores PCM waiting for playback; too little causes underrun" },
    type: "buffer"
  },
  {
    title: { zh: "重采样 / 混音 / 音量", en: "Resample / mix / volume" },
    detail: { zh: "匹配设备采样率，叠加多路声音并处理音量", en: "matches device rate, mixes streams, and applies volume" },
    type: "process"
  },
  {
    title: { zh: "ALSA playback ring buffer", en: "ALSA playback ring buffer" },
    detail: { zh: "应用写入 PCM，DMA 按硬件节奏读走", en: "app writes PCM while DMA reads it at hardware cadence" },
    type: "buffer"
  },
  {
    title: { zh: "DMA", en: "DMA" },
    detail: { zh: "把播放 PCM 搬到音频接口或声卡", en: "moves playback PCM to the audio interface or sound card" },
    type: "driver"
  },
  {
    title: { zh: "I2S / TDM / USB Audio", en: "I2S / TDM / USB Audio" },
    detail: { zh: "按 BCLK/LRCLK 或 USB 帧节奏把 PCM 送到硬件", en: "sends PCM to hardware using BCLK/LRCLK or USB frame cadence" },
    type: "hardware"
  },
  {
    title: { zh: "Codec DAC / 模拟处理", en: "Codec DAC / analog processing" },
    detail: { zh: "数字 PCM 还原为模拟电压，可带滤波和增益控制", en: "converts digital PCM to analog voltage, with filtering and gain control" },
    type: "hardware"
  },
  {
    title: { zh: "功放", en: "Amplifier" },
    detail: { zh: "把模拟小信号放大到能推动耳机或扬声器", en: "amplifies the analog signal enough to drive headphones or speakers" },
    type: "hardware"
  },
  {
    title: { zh: "扬声器", en: "Speaker" },
    detail: { zh: "电信号推动振膜，重新变成空气振动", en: "electrical signal moves the diaphragm and becomes air vibration again" },
    type: "hardware"
  }
] satisfies FlowStep[];

const bufferCards = [
  {
    title: { zh: "ALSA PCM ring buffer", en: "ALSA PCM ring buffer" },
    body: {
      zh: "在内核态保存原始 PCM。DMA 持续写入，ALSA 用读写指针管理哪些数据已经被应用取走。",
      en: "Stores raw PCM in kernel space. DMA writes continuously, while ALSA manages read/write pointers for consumed data."
    }
  },
  {
    title: { zh: "period buffer", en: "period buffer" },
    body: {
      zh: "period 是 ALSA 唤醒应用的节奏单位。这里默认 512 samples，也就是 16 kHz 下 32 ms。",
      en: "A period is the cadence that wakes the app. Here it is 512 samples, or 32 ms at 16 kHz."
    }
  },
  {
    title: { zh: "用户态 capture buffer", en: "User capture buffer" },
    body: {
      zh: "应用通过 read 得到拷贝后的 PCM，或通过 mmap 访问映射区域。这里开始进入应用自己的处理节奏。",
      en: "The app receives copied PCM through read, or accesses a mapped area through mmap. This is where app-side timing begins."
    }
  },
  {
    title: { zh: "filter frame", en: "filter frame" },
    body: {
      zh: "算法通常按固定时长处理，例如 32 ms。它不一定等于 ALSA period，也不一定等于编码器帧长。",
      en: "Algorithms often process fixed frame durations, such as 32 ms. This does not have to match ALSA period or codec frame size."
    }
  },
  {
    title: { zh: "encoder input buffer", en: "Encoder input buffer" },
    body: {
      zh: "编码器会按自己的帧长攒样本。比如 MP3 需要 1152 samples，32 ms 的 512 samples 需要多次拼帧。",
      en: "The codec accumulates samples according to its own frame length. MP3 needs 1152 samples, so multiple 512-sample blocks are combined."
    }
  },
  {
    title: { zh: "encoded frame buffer", en: "Encoded frame buffer" },
    body: {
      zh: "PCM 编码后变成 MP3、AAC、Opus 等码流帧，后面才能进入文件、RTSP/RTP 或其他网络队列。",
      en: "After encoding, PCM becomes MP3, AAC, Opus, or other bitstream frames for files, RTSP/RTP, or network queues."
    }
  },
  {
    title: { zh: "jitter buffer", en: "jitter buffer" },
    body: {
      zh: "播放网络实时音频时，包到达时间会忽快忽慢。jitter buffer 用少量额外延迟换连续播放，太小会断续，太大会增加通话延迟。",
      en: "For network audio, packet arrival timing varies. A jitter buffer trades a little delay for continuous playback; too small stutters, too large adds call latency."
    }
  },
  {
    title: { zh: "解码器输入 buffer", en: "Decoder input buffer" },
    body: {
      zh: "解码器通常不能只拿半帧数据工作，需要先攒够一个完整压缩帧，再输出对应的一段 PCM。",
      en: "Decoders usually cannot process half a frame. They need a complete compressed frame before outputting a block of PCM."
    }
  },
  {
    title: { zh: "PCM playback buffer", en: "PCM playback buffer" },
    body: {
      zh: "这是用户态待播放 PCM 队列。它把解码节奏和设备播放节奏隔开，队列被读空就容易出现 underrun 和爆音。",
      en: "This user-space queue holds PCM waiting for playback. It separates decode cadence from device cadence; if it runs dry, underrun and pops can occur."
    }
  },
  {
    title: { zh: "ALSA playback ring buffer", en: "ALSA playback ring buffer" },
    body: {
      zh: "播放方向和采集方向相反：应用把 PCM 写进内核环形 buffer，DMA 按声卡时钟读走并送到 DAC。",
      en: "Playback is the reverse of capture: the app writes PCM into the kernel ring buffer, and DMA reads it at the sound-card clock toward the DAC."
    }
  },
  {
    title: { zh: "AEC reference buffer", en: "AEC reference buffer" },
    body: {
      zh: "播放参考通常取自 AO/Mixer 输出或即将送入播放设备的 PCM。AEC 用它和麦克风信号做时间对齐，再估计并减掉扬声器回声。",
      en: "The playback reference is usually taken from AO/Mixer output or PCM about to reach the playback device. AEC aligns it with the microphone signal, then estimates and removes speaker echo."
    }
  }
] satisfies Array<{ title: Record<Language, string>; body: Record<Language, string> }>;

const ruleCards = [
  {
    title: { zh: "实时安全规则", en: "Real-time safety rules" },
    body: {
      zh: "不要在采集回调或低延迟线程里做磁盘 IO、网络请求、锁等待或动态内存分配。把不可预测工作放到非实时线程。",
      en: "Do not do disk IO, network calls, lock waits, or runtime allocation inside capture callbacks or low-latency threads. Move unpredictable work elsewhere."
    }
  },
  {
    title: { zh: "排查方向", en: "Troubleshooting direction" },
    body: {
      zh: "CPU 峰值过高、period 太小、filter 太慢、copy 阻塞或编码器攒帧过多，都可能让采集链路发生 overrun。",
      en: "CPU peaks, tiny periods, slow filters, blocking copies, or excessive codec buffering can cause capture overruns."
    }
  },
  {
    title: { zh: "线程分工", en: "Thread split" },
    body: {
      zh: "采集线程负责按时取 PCM；处理线程负责 filter；编码线程负责攒帧和输出码流。线程之间用预分配队列传递数据。",
      en: "The capture thread reads PCM on time; the processing thread filters; the encoder thread frames and outputs bitstream. Preallocated queues pass data across threads."
    }
  },
  {
    title: { zh: "延迟取舍", en: "Latency tradeoff" },
    body: {
      zh: "period 越小响应越快，但唤醒更频繁、CPU 余量更少。语音链路常在 10 ms、20 ms、32 ms 等处理帧之间取舍。",
      en: "Smaller periods respond faster, but wake more often and leave less CPU headroom. Voice pipelines commonly trade off among 10 ms, 20 ms, and 32 ms frames."
    }
  },
  {
    title: { zh: "典型 SoC 命名差异", en: "Typical SoC naming differences" },
    body: {
      zh: "瑞芯微、君正、SigmaStar 等 SoC 的 SDK 名称不同，但常见边界类似：AI 表示音频输入，AO 表示音频输出，AENC/ADEC 表示音频编码和解码，VQE/3A 表示 AEC、NS/ANR、AGC 等语音增强。",
      en: "Rockchip, Ingenic, SigmaStar, and similar SoCs use different SDK names, but the common boundaries are similar: AI for audio input, AO for audio output, AENC/ADEC for audio encode/decode, and VQE/3A for AEC, NS/ANR, AGC, and other voice enhancement blocks."
    }
  }
] satisfies Array<{ title: Record<Language, string>; body: Record<Language, string> }>;

function formatMs(value: number) {
  return `${value.toFixed(2)} ms`;
}

function formatFrameMs(value: number) {
  return Number.isInteger(value) ? `${value} ms` : formatMs(value);
}

function getFlowTextUnits(text: string) {
  return Array.from(text).reduce((total, char) => {
    if (/[\u4e00-\u9fff]/.test(char)) {
      return total + 1;
    }
    if (char === " ") {
      return total + 0.3;
    }
    if (/[/|.,:;()\-]/.test(char)) {
      return total + 0.35;
    }
    if (/[A-Za-z0-9_]/.test(char)) {
      return total + 0.58;
    }
    return total + 0.75;
  }, 0);
}

function findFlowTextBreak(text: string, maxUnits: number) {
  const breakpoints = [" / ", "，", ", ", "、", " "];
  const breakpointPositions = breakpoints.flatMap((separator) => {
    const positions: number[] = [];
    let index = text.indexOf(separator);
    while (index !== -1) {
      positions.push(index + separator.length);
      index = text.indexOf(separator, index + separator.length);
    }
    return positions;
  });
  const minUsefulBreak = Math.max(2.5, maxUnits * 0.45);
  const preferredBreakpoint = breakpointPositions
    .map((position) => ({ position, units: getFlowTextUnits(text.slice(0, position)) }))
    .filter(({ units }) => units > minUsefulBreak && units <= maxUnits)
    .sort((a, b) => b.units - a.units)[0]?.position;
  const fallbackBreakpoint = breakpointPositions
    .map((position) => ({ position, units: getFlowTextUnits(text.slice(0, position)) }))
    .filter(({ units }) => units > maxUnits && units <= maxUnits * 1.22)
    .sort((a, b) => a.units - b.units)[0]?.position;

  if (preferredBreakpoint ?? fallbackBreakpoint) {
    return preferredBreakpoint ?? fallbackBreakpoint;
  }

  let units = 0;
  for (let index = 0; index < text.length; index += 1) {
    units += getFlowTextUnits(text[index]);
    if (units >= maxUnits) {
      return index + 1;
    }
  }

  return text.length;
}

function splitFlowText(text: string, maxUnits: number, maxLines = 2) {
  const lines: string[] = [];
  let remaining = text;

  while (getFlowTextUnits(remaining) > maxUnits && lines.length < maxLines - 1) {
    const splitIndex = findFlowTextBreak(remaining, maxUnits);
    lines.push(remaining.slice(0, splitIndex).trimEnd());
    remaining = remaining.slice(splitIndex).trimStart();
  }

  if (remaining) {
    lines.push(remaining);
  }

  return lines;
}

function renderFlowTextLines(lines: string[], x: number, lineGap: number) {
  return lines.map((line, index) => (
    <tspan dy={index === 0 ? 0 : lineGap} key={`${line}-${index}`} x={x}>
      {index < lines.length - 1 ? `${line} ` : line}
    </tspan>
  ));
}

function FlowChart({
  ariaLabel,
  id,
  layout = "horizontal",
  language,
  steps,
  title
}: {
  ariaLabel: Record<Language, string>;
  id: string;
  layout?: FlowLayout;
  language: Language;
  steps: FlowStep[];
  title: Record<Language, string>;
}) {
  const isCompact = layout === "compact-horizontal";
  const canvasWidth = isCompact ? 1180 : 1480;
  const nodeWidth = isCompact ? 270 : 260;
  const nodeHeight = isCompact ? 126 : 128;
  const columns = isCompact ? 4 : 5;
  const gapX = isCompact ? 16 : 20;
  const gapY = isCompact ? 34 : 40;
  const top = 88;
  const left = 44;
  const rowCount = Math.ceil(steps.length / columns);
  const height = top + rowCount * nodeHeight + (rowCount - 1) * gapY + 44;

  const getPosition = (index: number) => {
    const row = Math.floor(index / columns);
    const column = index % columns;
    const isReverseRow = row % 2 === 1;
    const visualColumn = isReverseRow ? columns - 1 - column : column;

    return {
      column,
      row,
      x: left + visualColumn * (nodeWidth + gapX),
      y: top + row * (nodeHeight + gapY)
    };
  };

  const getConnectorPath = (index: number) => {
    const current = getPosition(index);
    const next = getPosition(index + 1);
    const currentCenterY = current.y + nodeHeight / 2;
    const nextCenterY = next.y + nodeHeight / 2;

    if (current.row === next.row) {
      const startsRight = next.x > current.x;
      const startX = startsRight ? current.x + nodeWidth : current.x;
      const endX = startsRight ? next.x : next.x + nodeWidth;
      return `M ${startX} ${currentCenterY} H ${endX}`;
    }

    const startX = current.x + nodeWidth / 2;
    const endX = next.x + nodeWidth / 2;
    const midY = current.y + nodeHeight + gapY / 2;
    return `M ${startX} ${current.y + nodeHeight} V ${midY} H ${endX} V ${next.y}`;
  };

  return (
    <svg
      aria-label={ariaLabel[language]}
      className="realtime-flow-chart"
      data-layout={layout === "compact-horizontal" ? "horizontal-pair" : "horizontal"}
      role="img"
      viewBox={`0 0 ${canvasWidth} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <marker id={`${id}Arrow`} markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
          <path d="M 0 0 L 8 4 L 0 8 Z" />
        </marker>
      </defs>
      <rect className="lab-diagram-bg" height={height} rx="14" width={canvasWidth} />
      <text className="lab-label" x="42" y="48">
        {title[language]}
      </text>
      {steps.map((step, index) => {
        const { x, y } = getPosition(index);
        const titleMaxUnits = language === "zh" ? (isCompact ? 10.6 : 10.2) : isCompact ? 12.4 : 11.2;
        const detailMaxUnits = language === "zh" ? (isCompact ? 14.1 : 12.4) : isCompact ? 15.6 : 14.2;
        const titleLines = splitFlowText(step.title[language], titleMaxUnits, 2);
        const detailLines = splitFlowText(step.detail[language], detailMaxUnits, 3);
        const detailY = detailLines.length > 2 ? 71 : detailLines.length > 1 ? 73 : 84;

        return (
          <g key={`${id}-${step.title.en}`}>
            <rect
              className={`realtime-flow-node ${step.type ?? "process"}`}
              height={nodeHeight}
              rx="9"
              width={nodeWidth}
              x={x}
              y={y}
            />
            <text className="realtime-flow-node-title" x={x + 18} y={y + (titleLines.length > 1 ? 25 : 31)}>
              {renderFlowTextLines(titleLines, x + 18, isCompact ? 23 : 25)}
            </text>
            <text className="realtime-flow-node-detail" x={x + 18} y={y + detailY}>
              {renderFlowTextLines(detailLines, x + 18, isCompact ? 18 : 20)}
            </text>
            {index < steps.length - 1 ? (
              <path
                className="realtime-flow-arrow"
                d={getConnectorPath(index)}
                markerEnd={`url(#${id}Arrow)`}
              />
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}

function SocAecDiagram({ language }: { language: Language }) {
  const nodes = [
    { id: "remote", title: { zh: "远端音频", en: "Remote audio" }, x: 60, y: 110, type: "codec" },
    { id: "adec", title: { zh: "ADEC", en: "ADEC" }, x: 260, y: 110, type: "codec" },
    { id: "mixer", title: { zh: "AO / Mixer", en: "AO / Mixer" }, x: 460, y: 110, type: "process" },
    { id: "dac", title: { zh: "Codec DAC / I2S", en: "Codec DAC / I2S" }, x: 660, y: 110, type: "hardware" },
    { id: "speaker", title: { zh: "功放 / 扬声器", en: "Amp / speaker" }, x: 880, y: 110, type: "hardware" },
    { id: "ref", title: { zh: "AEC reference buffer", en: "AEC reference buffer" }, x: 460, y: 270, type: "buffer" },
    { id: "mic", title: { zh: "麦克风", en: "Microphone" }, x: 60, y: 430, type: "hardware" },
    { id: "ai", title: { zh: "AI / DMA", en: "AI / DMA" }, x: 260, y: 430, type: "driver" },
    { id: "aec", title: { zh: "AEC", en: "AEC" }, x: 460, y: 430, type: "process" },
    { id: "ns", title: { zh: "NS / ANR", en: "NS / ANR" }, x: 660, y: 430, type: "process" },
    { id: "agc", title: { zh: "AGC", en: "AGC" }, x: 840, y: 430, type: "process" },
    { id: "aenc", title: { zh: "AENC", en: "AENC" }, x: 1000, y: 430, type: "codec" }
  ] satisfies Array<{
    id: string;
    title: Record<Language, string>;
    x: number;
    y: number;
    type: NonNullable<FlowStep["type"]>;
  }>;

  const arrows = [
    { d: "M 220 140 L 250 140" },
    { d: "M 420 140 L 450 140" },
    { d: "M 620 140 L 650 140" },
    { d: "M 820 140 L 870 140" },
    { d: "M 540 170 L 540 260" },
    { d: "M 540 350 L 540 420" },
    { d: "M 220 460 L 250 460" },
    { d: "M 420 460 L 450 460" },
    { d: "M 620 460 L 650 460" },
    { d: "M 820 460 L 830 460" },
    { d: "M 980 460 L 990 460" }
  ];

  return (
    <svg
      aria-label={language === "zh" ? "典型 SoC AEC 和 3A 处理框图" : "Typical SoC AEC and 3A processing block diagram"}
      className="realtime-flow-chart realtime-soc-aec-chart"
      role="img"
      viewBox="0 0 1180 620"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <marker id="socAecArrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
          <path d="M 0 0 L 8 4 L 0 8 Z" />
        </marker>
      </defs>
      <rect className="lab-diagram-bg" height="620" rx="14" width="1180" />
      <text className="lab-label" x="42" y="48">
        {language === "zh" ? "典型 SoC AEC / 3A：播放参考回采到采集侧消除" : "Typical SoC AEC / 3A: playback reference returns to capture-side cancellation"}
      </text>
      <text className="realtime-soc-lane-label" x="60" y="88">
        {language === "zh" ? "播放参考链路" : "Playback reference path"}
      </text>
      <text className="realtime-soc-lane-label" x="60" y="408">
        {language === "zh" ? "麦克风采集链路" : "Microphone capture path"}
      </text>
      <text className="realtime-soc-note" x="650" y="300">
        {language === "zh" ? "AEC 需要播放参考和麦克风输入时间对齐" : "AEC needs time-aligned playback reference and mic input"}
      </text>
      <text className="realtime-soc-note" x="590" y="366">
        {language === "zh" ? "回采信号用于 AEC" : "Loopback signal feeds AEC"}
      </text>
      {arrows.map((arrow) => (
        <path className="realtime-soc-aec-arrow" d={arrow.d} key={arrow.d} markerEnd="url(#socAecArrow)" />
      ))}
      {nodes.map((node) => (
        <g key={node.id}>
          <rect className={`realtime-flow-node ${node.type}`} height="60" rx="9" width={node.id === "aenc" ? 120 : 160} x={node.x} y={node.y} />
          <text className="realtime-soc-node-title" x={node.x + (node.id === "aenc" ? 60 : 80)} y={node.y + 31}>
            {node.title[language]}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function RealtimeAudioLab({ language, onBack }: RealtimeAudioLabProps) {
  const statusLabel = language === "zh" ? "状态：稳定" : "Status: stable";

  return (
    <main className="codec-lab-page realtime-audio-lab-page">
      <section className="sound-lab-hero" aria-labelledby="realtime-audio-lab-title">
        <button className="sound-lab-back" type="button" onClick={onBack}>
          <ArrowLeft size={18} aria-hidden="true" />
          {language === "zh" ? "返回知识库" : "Back to knowledge base"}
        </button>
        <div>
          <span className="section-kicker">{language === "zh" ? "软件实验" : "Software lab"}</span>
          <h1 id="realtime-audio-lab-title">
            {language === "zh" ? "实时音频处理实验室" : "Real-Time Audio Processing Lab"}
          </h1>
          <p>
            {language === "zh"
              ? "用一个 16 kHz 单声道语音采集例子，区分驱动、ALSA、用户态 filter 和编码器里的不同 buffer。"
              : "Use a 16 kHz mono voice-capture example to separate buffers in the driver, ALSA, user-space filter, and encoder."}
          </p>
        </div>
      </section>

      <section
        className="realtime-audio-workbench"
        aria-label={language === "zh" ? "实时音频处理实验台" : "Real-time audio processing workbench"}
      >
        <section className="realtime-audio-visual" aria-label={language === "zh" ? "实时音频调度图" : "Real-time audio scheduling diagram"}>
          <div className="digital-lab-status">
            <strong>{language === "zh" ? "从 PCM 采集到解码播放" : "From PCM capture to decoded playback"}</strong>
            <span>
              {language === "zh"
                ? "先看通用链路，再看采集编码和解码播放两个具体例子"
                : "Start with the generic path, then inspect capture-encode and decode-playback examples"}
            </span>
          </div>

          <div className="realtime-audio-metrics">
            <strong>{language === "zh" ? "默认格式：16 kHz / mono / 16-bit PCM" : "Default format: 16 kHz / mono / 16-bit PCM"}</strong>
            <strong>
              {language === "zh"
                ? `${formatFrameMs(periodMs)} 处理帧：${samples} samples / ${bytes} bytes`
                : `${formatFrameMs(periodMs)} frame: ${samples} samples / ${bytes} bytes`}
            </strong>
            <strong>{language === "zh" ? `采集 period：${formatMs(periodMs)}` : `Capture period: ${formatMs(periodMs)}`}</strong>
            <strong>{language === "zh" ? `Deadline：${formatMs(periodMs)}` : `Deadline: ${formatMs(periodMs)}`}</strong>
            <strong>{language === "zh" ? `最坏处理耗时：${formatMs(worstProcessingMs)}` : `Worst processing time: ${formatMs(worstProcessingMs)}`}</strong>
            <strong>{language === "zh" ? `估算采集到编码延迟：${formatMs(latencyMs)}` : `Estimated capture-to-encode latency: ${formatMs(latencyMs)}`}</strong>
            <strong className="realtime-status stable">{statusLabel}</strong>
          </div>

          <div className="realtime-flow-grid">
            <FlowChart
              ariaLabel={{ zh: "基础音频处理流程图", en: "Basic audio processing flow chart" }}
              id="basicAudioFlow"
              language={language}
              steps={basicFlowSteps}
              title={{ zh: "基础流程：采集 -> 编码 -> 解码 -> 播放输出", en: "Basic flow: capture -> encode -> decode -> playback output" }}
            />
            <div className="realtime-example-flow-pair">
              <FlowChart
                ariaLabel={{ zh: "ALSA 采集 PCM 到编码流程图", en: "ALSA PCM capture to encoding flow chart" }}
                id="alsaCaptureFlow"
                language={language}
                steps={alsaFlowSteps}
                title={{ zh: "具体例子：ALSA 采集 PCM -> filter -> MP3 编码", en: "Example: ALSA PCM capture -> filter -> MP3 encode" }}
              />
              <FlowChart
                ariaLabel={{ zh: "MP3 解码到 PCM 播放流程图", en: "MP3 decode to PCM playback flow chart" }}
                id="mp3PlaybackFlow"
                language={language}
                steps={playbackFlowSteps}
                title={{ zh: "具体例子：MP3 / RTSP 接收 -> 解码 -> PCM 播放", en: "Example: MP3 / RTSP receive -> decode -> PCM playback" }}
              />
            </div>
            <SocAecDiagram language={language} />
          </div>
        </section>

        <aside className="realtime-audio-panel" aria-label={language === "zh" ? "当前示例参数" : "Current example parameters"}>
          <div className="realtime-static-list">
            <strong>{language === "zh" ? "当前示例参数" : "Current example parameters"}</strong>
            <dl>
              <div>
                <dt>{language === "zh" ? "PCM 格式" : "PCM format"}</dt>
                <dd>16 kHz / mono / 16-bit S16_LE</dd>
              </div>
              <div>
                <dt>{language === "zh" ? "ALSA period" : "ALSA period"}</dt>
                <dd>{bufferFrames} frames / {formatMs(periodMs)}</dd>
              </div>
              <div>
                <dt>{language === "zh" ? "filter frame" : "filter frame"}</dt>
                <dd>{samples} samples / {bytes} bytes / 32 ms</dd>
              </div>
              <div>
                <dt>{language === "zh" ? "处理预算" : "Processing budget"}</dt>
                <dd>
                  {language === "zh"
                    ? `DSP ${formatMs(dspMs)} + CPU 抖动 ${formatMs(jitterMs)}，小于 32 ms deadline`
                    : `DSP ${formatMs(dspMs)} + CPU jitter ${formatMs(jitterMs)}, below the 32 ms deadline`}
                </dd>
              </div>
            </dl>
          </div>

          <div className="lab-live-note">
            <strong>{language === "zh" ? `DSP 耗时：${formatMs(dspMs)}` : `DSP time: ${formatMs(dspMs)}`}</strong>
            <span>
              {language === "zh"
                ? "当前示例留有充足处理余量，filter 处理加 CPU 抖动仍明显小于 32 ms deadline。"
                : "The current example has enough processing headroom; filter time plus CPU jitter stays well below the 32 ms deadline."}
            </span>
          </div>
        </aside>

        <section
          className="codec-mode-concepts realtime-buffer-guide"
          aria-label={language === "zh" ? "实时音频 buffer 分层说明" : "Real-time audio buffer layers"}
        >
          <div className="codec-mode-concepts-header">
            <strong>{language === "zh" ? "这些 buffer 不是同一个东西" : "These buffers are not the same thing"}</strong>
            <span>{language === "zh" ? "按数据位置和用途区分" : "Separate them by location and purpose"}</span>
          </div>
          <div className="realtime-buffer-card-grid">
            {bufferCards.map((card) => (
              <article key={card.title.en}>
                <h2>{card.title[language]}</h2>
                <p>{card.body[language]}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          className="codec-mode-concepts realtime-audio-rules"
          aria-label={language === "zh" ? "实时音频规则和排查" : "Real-time audio rules and troubleshooting"}
        >
          <div className="codec-mode-concepts-header">
            <strong>{language === "zh" ? "关键规则" : "Key rules"}</strong>
            <span>{language === "zh" ? "实时处理的重点是确定性" : "The priority is deterministic timing"}</span>
          </div>
          <div className="codec-concept-grid realtime-rule-grid">
            {ruleCards.map((card) => (
              <article key={card.title.en}>
                <h2>{card.title[language]}</h2>
                <p>{card.body[language]}</p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
