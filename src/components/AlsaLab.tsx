import { ArrowLeft } from "lucide-react";
import { useState } from "react";

import type { Language, LocalizedText } from "../content/knowledge";

type AlsaLabProps = {
  language: Language;
  onBack: () => void;
};

type AlsaMode = "playback" | "capture" | "buffer" | "xrun";
type StreamDirection = "playback" | "capture";
type FlowLayer = "user" | "kernel" | "driver" | "hardware";
type SampleRate = 16000 | 44100 | 48000;
type Channels = 1 | 2;
type BitDepth = 16 | 24 | 32;
type PeriodFrames = 64 | 128 | 256 | 512 | 1024;
type PeriodCount = 2 | 3 | 4 | 8;

type AlsaConfig = {
  sampleRate: SampleRate;
  channels: Channels;
  bitDepth: BitDepth;
  periodFrames: PeriodFrames;
  periodCount: PeriodCount;
};

type FlowStep = {
  label: LocalizedText;
  detail: LocalizedText;
  layer: FlowLayer;
};

const sampleRates: SampleRate[] = [16000, 44100, 48000];
const channelOptions: Channels[] = [1, 2];
const bitDepths: BitDepth[] = [16, 24, 32];
const periodFramesOptions: PeriodFrames[] = [64, 128, 256, 512, 1024];
const periodCounts: PeriodCount[] = [2, 3, 4, 8];

const defaultConfig: AlsaConfig = {
  sampleRate: 44100,
  channels: 2,
  bitDepth: 16,
  periodFrames: 128,
  periodCount: 4
};

const modeTabs: Array<{ id: AlsaMode; label: LocalizedText; description: LocalizedText }> = [
  {
    id: "playback",
    label: { zh: "PCM 播放", en: "PCM Playback" },
    description: {
      zh: "应用填充播放 ring buffer，硬件/DMA 按时间取走帧。",
      en: "The app fills the playback ring while hardware/DMA consumes frames on time."
    }
  },
  {
    id: "capture",
    label: { zh: "PCM 录音", en: "PCM Capture" },
    description: {
      zh: "硬件/DMA 写入采集 ring buffer，应用读取新到的帧。",
      en: "Hardware/DMA writes the capture ring while the app reads new frames."
    }
  },
  {
    id: "buffer",
    label: { zh: "缓冲与延迟", en: "Buffer and Latency" },
    description: {
      zh: "把 period、总 buffer、指针和可用帧放在同一个环形视图里。",
      en: "Put period size, total buffer, pointers, and available frames in one ring view."
    }
  },
  {
    id: "xrun",
    label: { zh: "XRUN 排查", en: "XRUN Troubleshooting" },
    description: {
      zh: "从现象、状态和日志走到根因，再恢复 PCM 流。",
      en: "Move from symptoms, state, and logs to the root cause, then recover the PCM stream."
    }
  }
];

const layerLabels: Record<FlowLayer, LocalizedText> = {
  user: { zh: "用户态", en: "User space" },
  kernel: { zh: "内核态", en: "Kernel space" },
  driver: { zh: "驱动", en: "Driver" },
  hardware: { zh: "硬件", en: "Hardware" }
};

const flowSteps: Record<StreamDirection, FlowStep[]> = {
  playback: [
    { label: { zh: "应用", en: "Application" }, detail: { zh: "PCM 帧", en: "PCM frames" }, layer: "user" },
    { label: { zh: "alsa-lib", en: "alsa-lib" }, detail: { zh: "用户态 API", en: "user API" }, layer: "user" },
    { label: { zh: "PCM 插件", en: "PCM plugin" }, detail: { zh: "plughw / default", en: "plughw / default" }, layer: "user" },
    { label: { zh: "ALSA PCM", en: "ALSA PCM" }, detail: { zh: "内核 ring", en: "kernel ring" }, layer: "kernel" },
    { label: { zh: "ASoC / DMA", en: "ASoC / DMA" }, detail: { zh: "驱动 period", en: "period transfer" }, layer: "driver" },
    { label: { zh: "I2S", en: "I2S" }, detail: { zh: "DAI 串行链路", en: "DAI serial link" }, layer: "hardware" },
    { label: { zh: "Codec DAC", en: "Codec DAC" }, detail: { zh: "PCM -> 模拟", en: "PCM -> analog" }, layer: "hardware" },
    { label: { zh: "扬声器", en: "Speaker" }, detail: { zh: "空气声压", en: "air pressure" }, layer: "hardware" }
  ],
  capture: [
    { label: { zh: "麦克风", en: "Microphone" }, detail: { zh: "模拟输入", en: "analog input" }, layer: "hardware" },
    { label: { zh: "Codec ADC", en: "Codec ADC" }, detail: { zh: "模拟 -> PCM", en: "analog -> PCM" }, layer: "hardware" },
    { label: { zh: "I2S", en: "I2S" }, detail: { zh: "DAI 串行链路", en: "DAI serial link" }, layer: "hardware" },
    { label: { zh: "ASoC / DMA", en: "ASoC / DMA" }, detail: { zh: "写入 period", en: "period write" }, layer: "driver" },
    { label: { zh: "ALSA PCM", en: "ALSA PCM" }, detail: { zh: "内核 ring", en: "kernel ring" }, layer: "kernel" },
    { label: { zh: "alsa-lib", en: "alsa-lib" }, detail: { zh: "用户态 API", en: "user API" }, layer: "user" },
    { label: { zh: "应用", en: "Application" }, detail: { zh: "读取 PCM 帧", en: "read PCM frames" }, layer: "user" }
  ]
};

const explanationCards: Array<{ title: LocalizedText; body: LocalizedText }> = [
  {
    title: { zh: "设备对象", en: "Device objects" },
    body: {
      zh: "card 是声卡容器，PCM device 是音频流端点，subdevice 是逻辑子流；PCM stream 再区分 playback 和 capture。Control 是声卡的独立控制接口。",
      en: "A card is a sound-card container, a PCM device is an audio-stream endpoint, and a subdevice is a logical substream; a PCM stream is playback or capture. Control is a separate card-level interface."
    }
  },
  {
    title: { zh: "设备名", en: "Device names" },
    body: {
      zh: "hw:0,0 偏向原生能力，plughw:0,0 可由 plug 层适配格式、采样率和通道，default 遵循系统配置的默认 PCM 路由。",
      en: "hw:0,0 favors native capabilities, plughw:0,0 lets the plug layer adapt format, rate, and channels, and default follows the configured default PCM route."
    }
  },
  {
    title: { zh: "参数层", en: "Parameter layers" },
    body: {
      zh: "hw_params 协商 access、format、rate、channels、period 和 buffer；sw_params 处理 avail_min、start_threshold、stop_threshold 等软件阈值。",
      en: "hw_params negotiates access, format, rate, channels, period, and buffer; sw_params handles software thresholds such as avail_min, start_threshold, and stop_threshold."
    }
  },
  {
    title: { zh: "数据与控制", en: "Data and controls" },
    body: {
      zh: "PCM 搬运有顺序的音频帧；Control/Mixer 改变音量、静音、输入选择和路由。read/write 交付帧，mmap 访问映射 ring。",
      en: "PCM moves ordered audio frames; Control/Mixer changes volume, mute, input selection, and routing. read/write delivers frames, while mmap accesses a mapped ring."
    }
  }
];

const frameworkLayers: Array<{
  id: FlowLayer;
  label: LocalizedText;
  nodes: Array<{ title: LocalizedText; detail: LocalizedText }>;
  handoff?: LocalizedText;
}> = [
  {
    id: "user",
    label: { zh: "用户态", en: "User space" },
    nodes: [
      { title: { zh: "应用程序", en: "Applications" }, detail: { zh: "播放器 / 录音 / 通话", en: "playback / capture / calls" } },
      { title: { zh: "可选音频服务", en: "Optional audio server" }, detail: { zh: "PipeWire / PulseAudio / JACK", en: "PipeWire / PulseAudio / JACK" } },
      { title: { zh: "alsa-lib", en: "alsa-lib" }, detail: { zh: "PCM API + Control API", en: "PCM API + Control API" } },
      { title: { zh: "PCM 插件", en: "PCM plugins" }, detail: { zh: "hw / plughw / default / dmix", en: "hw / plughw / default / dmix" } }
    ],
    handoff: { zh: "系统调用 / ioctl / mmap", en: "system calls / ioctl / mmap" }
  },
  {
    id: "kernel",
    label: { zh: "内核 ALSA", en: "Kernel ALSA" },
    nodes: [
      { title: { zh: "ALSA Core", en: "ALSA Core" }, detail: { zh: "声卡注册、状态与公共接口", en: "card registration, state, common APIs" } },
      { title: { zh: "PCM 子系统", en: "PCM subsystem" }, detail: { zh: "音频帧、buffer、period、XRUN", en: "frames, buffer, period, XRUN" } },
      { title: { zh: "Control 子系统", en: "Control subsystem" }, detail: { zh: "音量、静音、路由与开关", en: "volume, mute, routes, switches" } }
    ],
    handoff: { zh: "驱动回调 / 参数约束 / 中断", en: "driver callbacks / constraints / interrupts" }
  },
  {
    id: "driver",
    label: { zh: "设备驱动", en: "Device drivers" },
    nodes: [
      { title: { zh: "PC / USB 驱动", en: "PC / USB drivers" }, detail: { zh: "PCI、USB 等声卡驱动", en: "PCI, USB, and other sound drivers" } },
      { title: { zh: "嵌入式 ASoC", en: "Embedded ASoC" }, detail: { zh: "Machine + Platform / CPU DAI", en: "Machine + Platform / CPU DAI" } },
      { title: { zh: "Codec 驱动", en: "Codec driver" }, detail: { zh: "Codec DAI、Mixer、DAPM", en: "Codec DAI, Mixer, DAPM" } }
    ],
    handoff: { zh: "寄存器 / DMA / 音频总线", en: "registers / DMA / audio buses" }
  },
  {
    id: "hardware",
    label: { zh: "硬件", en: "Hardware" },
    nodes: [
      { title: { zh: "USB / PCI 声卡", en: "USB / PCI audio" }, detail: { zh: "独立设备路径", en: "discrete device path" } },
      { title: { zh: "SoC 音频控制器", en: "SoC audio controller" }, detail: { zh: "DMA + I2S / TDM / PDM", en: "DMA + I2S / TDM / PDM" } },
      { title: { zh: "Codec 与换能器", en: "Codec and transducers" }, detail: { zh: "ADC / DAC → 麦克风、功放、扬声器", en: "ADC / DAC → mic, amp, speaker" } }
    ]
  }
];

const formatNames: Record<BitDepth, string> = {
  16: "S16_LE",
  24: "S24_3LE",
  32: "S32_LE"
};

function formatMs(value: number) {
  return value.toFixed(2);
}

function formatInteger(value: number) {
  return Math.round(value).toLocaleString("en-US");
}

function getFlowGroups(steps: FlowStep[]) {
  return steps.reduce<Array<{ layer: FlowLayer; start: number; end: number }>>((groups, step, index) => {
    const previous = groups[groups.length - 1];
    if (previous?.layer === step.layer) {
      previous.end = index;
    } else {
      groups.push({ layer: step.layer, start: index, end: index });
    }
    return groups;
  }, []);
}

function AlsaFlowDiagram({ language, direction }: { language: Language; direction: StreamDirection }) {
  const steps = flowSteps[direction];
  const nodeWidth = 150;
  const nodeHeight = 126;
  const gap = 24;
  const left = 28;
  const top = 116;
  const width = left * 2 + steps.length * nodeWidth + (steps.length - 1) * gap;
  const height = 342;
  const groups = getFlowGroups(steps);
  const title = direction === "playback"
    ? { zh: "ALSA PCM 播放流程图", en: "ALSA PCM playback flow diagram" }
    : { zh: "ALSA PCM 录音流程图", en: "ALSA PCM capture flow diagram" };
  const description = direction === "playback"
    ? {
        zh: "播放从应用和 alsa-lib 进入 PCM 插件、内核 ALSA PCM、DMA、I2S、Codec DAC 和扬声器。",
        en: "Playback moves from the app and alsa-lib through a PCM plugin, kernel ALSA PCM, DMA, I2S, Codec DAC, and speaker."
      }
    : {
        zh: "录音从麦克风和 Codec ADC 反向经过 I2S、DMA、ALSA PCM、alsa-lib 到应用。",
        en: "Capture reverses from microphone and Codec ADC through I2S, DMA, ALSA PCM, alsa-lib, and the app."
      };
  const path = direction === "playback"
    ? { zh: "应用/alsa-lib → PCM 插件 → ALSA PCM → DMA → I2S → Codec DAC → 扬声器", en: "Application/alsa-lib → PCM plugin → ALSA PCM → DMA → I2S → Codec DAC → speaker" }
    : { zh: "麦克风 → Codec ADC → I2S → DMA → ALSA PCM → alsa-lib → 应用", en: "Microphone → Codec ADC → I2S → DMA → ALSA PCM → alsa-lib → application" };

  return (
    <figure className="alsa-flow-figure">
      <div
        aria-label={language === "zh" ? "可水平滚动的 ALSA 流程图" : "Horizontally scrollable ALSA flow diagram"}
        className="alsa-flow-scroll"
        role="region"
        tabIndex={0}
      >
        <svg
          aria-label={title[language]}
          className="alsa-flow-svg"
          role="img"
          viewBox={`0 0 ${width} ${height}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>{title[language]}</title>
          <desc>{description[language]}</desc>
          <defs>
            <marker id={`alsa-flow-arrow-${direction}`} markerHeight="10" markerWidth="10" orient="auto" refX="8" refY="5">
              <path d="M 0 0 L 10 5 L 0 10 Z" />
            </marker>
          </defs>
          <rect className="alsa-flow-background" height={height} rx="16" width={width} />
          {groups.map((group) => {
            const x = left + group.start * (nodeWidth + gap) - 12;
            const groupWidth = (group.end - group.start + 1) * nodeWidth + (group.end - group.start) * gap + 24;
            return (
              <g key={group.layer}>
                <rect className={`alsa-flow-layer alsa-flow-layer-${group.layer}`} height="246" rx="12" width={groupWidth} x={x} y="54" />
                <text className="alsa-flow-layer-title" x={x + 14} y="78">{layerLabels[group.layer][language]}</text>
              </g>
            );
          })}
          {steps.slice(0, -1).map((step, index) => {
            const x = left + index * (nodeWidth + gap);
            const nextX = left + (index + 1) * (nodeWidth + gap);
            return (
              <line
                className="alsa-flow-arrow"
                key={`${step.label.en}-${index}`}
                markerEnd={`url(#alsa-flow-arrow-${direction})`}
                x1={x + nodeWidth}
                x2={nextX}
                y1={top + nodeHeight / 2}
                y2={top + nodeHeight / 2}
              />
            );
          })}
          {steps.map((step, index) => {
            const x = left + index * (nodeWidth + gap);
            return (
              <g key={step.label.en}>
                <rect className={`alsa-flow-node alsa-flow-node-${step.layer}`} height={nodeHeight} rx="12" width={nodeWidth} x={x} y={top} />
                <text className="alsa-flow-node-title" x={x + nodeWidth / 2} y={top + 48}>{step.label[language]}</text>
                <text className="alsa-flow-node-detail" x={x + nodeWidth / 2} y={top + 82}>{step.detail[language]}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <figcaption className="alsa-flow-caption">
        <strong>{path[language]}</strong>
        <span>{description[language]}</span>
      </figcaption>
    </figure>
  );
}

function AlsaBufferDiagram({
  config,
  direction,
  language,
  usedFrames
}: {
  config: AlsaConfig;
  direction: StreamDirection;
  language: Language;
  usedFrames: number;
}) {
  const [dragFrame, setDragFrame] = useState<number | null>(null);
  const bufferFrames = config.periodFrames * config.periodCount;
  const center = 310;
  const radius = 128;
  const circumference = 2 * Math.PI * radius;
  const frameAngle = (frame: number) => -90 + (frame / bufferFrames) * 360;
  const point = (frame: number, distance: number) => {
    const angle = (frameAngle(frame) * Math.PI) / 180;
    return { x: center + Math.cos(angle) * distance, y: 210 + Math.sin(angle) * distance };
  };
  const displayedFrames = dragFrame ?? usedFrames;
  const appPointer = direction === "playback" ? displayedFrames : 0;
  const dmaPointer = direction === "playback" ? 0 : displayedFrames;
  const title = language === "zh" ? "ALSA 环形 buffer" : "ALSA ring buffer";
  const description = direction === "playback"
    ? {
        zh: "播放中应用写指针位于已填充数据末端，硬件/DMA 读指针从环中消费。",
        en: "During playback, the app write pointer ends the filled region while hardware/DMA reads from the ring."
      }
    : {
        zh: "录音中硬件/DMA 写指针位于新数据末端，应用读指针消费尚未读取的帧。",
        en: "During capture, the hardware/DMA write pointer ends new data while the app reads unconsumed frames."
      };

  return (
    <figure className="alsa-buffer-figure">
      <div
        aria-label={language === "zh" ? "可水平滚动的 ALSA 环形 buffer 图" : "Horizontally scrollable ALSA ring-buffer diagram"}
        className="alsa-buffer-scroll"
        role="region"
        tabIndex={0}
      >
        <svg aria-label={title} className="alsa-buffer-svg" role="img" viewBox="0 0 620 430" xmlns="http://www.w3.org/2000/svg"
          onPointerMove={(event) => {
            if (dragFrame === null) return;
            const rect = event.currentTarget.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width) * 620;
            const y = ((event.clientY - rect.top) / rect.height) * 430;
            const angle = (Math.atan2(y - 210, x - center) * 180) / Math.PI + 90;
            setDragFrame(Math.round((((angle + 360) % 360) / 360) * bufferFrames));
          }}
          onPointerUp={() => setDragFrame(null)}
          onPointerLeave={() => setDragFrame(null)}>
          <title>{title}</title>
          <desc>{description[language]}</desc>
          <rect className="alsa-buffer-background" height="430" rx="16" width="620" />
          <text className="alsa-buffer-heading" x="310" y="405" textAnchor="middle">{bufferFrames} frames · {language === "zh" ? "顺时针推进" : "clockwise progress"}</text>
          <circle className="alsa-buffer-track" cx={center} cy="210" r={radius} />
          <circle className="alsa-buffer-period-used" cx={center} cy="210" r={radius} transform="rotate(-90 310 210)" strokeDasharray={`${(displayedFrames / bufferFrames) * circumference} ${circumference}`} />
          <text className="alsa-buffer-heading" textAnchor="middle" x="310" y="203">{language === "zh" ? "着色：未读数据" : "Color: unread data"}</text>
          <text className="alsa-buffer-heading" textAnchor="middle" x="310" y="230">{displayedFrames} frames</text>
          {Array.from({ length: config.periodCount }, (_, index) => {
            const inner = point(index * config.periodFrames, radius - 18);
            const boundary = point(index * config.periodFrames, radius + 18);
            const label = point((index + 0.5) * config.periodFrames, radius + 32);
            return (
              <g key={index}>
                <line className="alsa-buffer-period" data-period-index={index} x1={inner.x} x2={boundary.x} y1={inner.y} y2={boundary.y} />
                <text className="alsa-buffer-period-label" textAnchor="middle" x={label.x} y={label.y + 4}>{index + 1}</text>
              </g>
            );
          })}
          {[{ frame: appPointer, className: "alsa-buffer-pointer-app", label: direction === "playback" ? (language === "zh" ? "应用写" : "App write") : (language === "zh" ? "应用读" : "App read") }, { frame: dmaPointer, className: "alsa-buffer-pointer-dma", label: direction === "playback" ? (language === "zh" ? "硬件/DMA 读" : "HW/DMA read") : (language === "zh" ? "硬件/DMA 写" : "HW/DMA write") }].map(({ frame, className, label }) => {
            const inner = point(frame, radius - 10);
            const outer = point(frame, radius + 28);
            const text = point(frame, radius + 58);
            return <g key={className} onPointerDown={() => setDragFrame(frame)}><line className={`alsa-buffer-pointer ${className}`} x1={inner.x} x2={outer.x} y1={inner.y} y2={outer.y} /><text className="alsa-buffer-pointer-label" textAnchor="middle" x={text.x} y={text.y + 4}>{label}</text></g>;
          })}
        </svg>
      </div>
      <figcaption className="alsa-buffer-caption">{description[language]} {language === "zh" ? "数字代表 period 分区，位置按 buffer 容量取模后回绕；这是静态快照，不代表指针停止。实际 ALSA 使用逻辑指针跟踪进度，仅靠环上位置不能区分空和满。" : "Numbers identify periods; positions wrap modulo buffer capacity. This is a static snapshot, not stopped pointers. ALSA tracks progress using logical pointers: ring positions alone cannot distinguish empty from full."}</figcaption>
    </figure>
  );
}

function AlsaLab({ language, onBack }: AlsaLabProps) {
  const [config, setConfig] = useState<AlsaConfig>(defaultConfig);
  const [mode, setMode] = useState<AlsaMode>("playback");
  const [streamDirection, setStreamDirection] = useState<StreamDirection>("playback");
  const periodMs = (config.periodFrames / config.sampleRate) * 1000;
  const bufferFrames = config.periodFrames * config.periodCount;
  const bufferMs = (bufferFrames / config.sampleRate) * 1000;
  const wakeupsPerSecond = config.sampleRate / config.periodFrames;
  const bytesPerSecond = config.sampleRate * config.channels * (config.bitDepth / 8);
  const usedFrames = Math.round(bufferFrames * (streamDirection === "playback" ? 0.625 : 0.375));
  const availableFrames = bufferFrames - usedFrames;
  const currentTab = modeTabs.find((tab) => tab.id === mode) ?? modeTabs[0];
  const format = formatNames[config.bitDepth];
  const command = streamDirection === "playback"
    ? `aplay -D plughw:0,0 -f ${format} -r ${config.sampleRate} -c ${config.channels} raw.pcm`
    : `arecord -D plughw:0,0 -f ${format} -r ${config.sampleRate} -c ${config.channels} capture.raw`;

  function updateConfig(key: keyof AlsaConfig, value: number) {
    setConfig((current) => ({ ...current, [key]: value } as AlsaConfig));
  }

  function selectMode(nextMode: AlsaMode) {
    setMode(nextMode);
    if (nextMode === "playback" || nextMode === "capture") {
      setStreamDirection(nextMode);
    }
  }

  const xrunSteps = [
    {
      title: { zh: "现象", en: "Symptom" },
      body: {
        zh: "播放时应用未及时补充数据，硬件追上应用会发生 playback underrun；录音时应用未及时读取，硬件覆盖尚未读取的数据会发生 capture overrun。",
        en: "A playback underrun occurs when hardware catches the application after it fails to refill; a capture overrun occurs when hardware overwrites data the application has not read."
      }
    },
    {
      title: { zh: "确认状态与日志", en: "Confirm state and logs" },
      body: { zh: "检查 snd_pcm_state、返回值和内核/驱动日志，确认是否真的进入 XRUN。", en: "Check snd_pcm_state, return values, and kernel/driver logs to confirm an XRUN." }
    },
    {
      title: { zh: "定位根因", en: "Find the root cause" },
      body: { zh: "分别排查调度抢占、处理耗时、阻塞 IO、CPU 抖动、设备时钟和 rate / period / buffer 参数。", en: "Check scheduling, processing time, blocking IO, CPU jitter, device clocks, and rate / period / buffer parameters." }
    },
    {
      title: { zh: "恢复流", en: "Recover the stream" },
      body: { zh: "调用 snd_pcm_prepare 重新准备 PCM，再按方向补齐或读取数据。", en: "Call snd_pcm_prepare to prepare the PCM again, then refill or read data for the direction." }
    }
  ];

  return (
    <main className="codec-lab-page alsa-lab-page" aria-label={language === "zh" ? "ALSA 框架实验室" : "ALSA Framework Lab"}>
      <section className="sound-lab-hero alsa-hero" aria-labelledby="alsa-lab-title">
        <button className="sound-lab-back" type="button" onClick={onBack}>
          <ArrowLeft aria-hidden="true" size={18} />
          {language === "zh" ? "返回知识库" : "Back to knowledge base"}
        </button>
        <div>
          <span className="section-kicker">{language === "zh" ? "Linux 音频软件" : "Linux audio software"}</span>
          <h1 id="alsa-lab-title">{language === "zh" ? "ALSA 框架实验室" : "ALSA Framework Lab"}</h1>
          <p>
            {language === "zh"
              ? "用可计算的 PCM 参数和静态流程图理解 ALSA 设备、数据流、环形 buffer 与 XRUN。"
              : "Use computable PCM parameters and static path diagrams to understand ALSA devices, data flow, ring buffers, and XRUNs."}
          </p>
        </div>
      </section>

      <section className="alsa-explanation" aria-labelledby="alsa-explanation-title">
        <div className="alsa-explanation-intro">
          <span className="section-kicker">{language === "zh" ? "先看框架" : "Read the framework first"}</span>
          <h2 id="alsa-explanation-title">{language === "zh" ? "ALSA 把音频帧、设备控制和硬件时序分开" : "ALSA separates audio frames, device controls, and hardware timing"}</h2>
          <p>
            {language === "zh"
              ? "PCM 是有时间顺序的数据流；Control/Mixer 是设备控制面；buffer 和 period 则把应用的处理节奏与硬件/DMA 的消费或写入节奏联系起来。"
              : "PCM is a time-ordered data stream; Control/Mixer is the device-control plane; buffer and period connect application timing with hardware/DMA consumption or writes."}
          </p>
        </div>
        <div className="alsa-explanation-grid">
          {explanationCards.map((card) => (
            <article className="alsa-explanation-card" key={card.title.en}>
              <h3>{card.title[language]}</h3>
              <p>{card.body[language]}</p>
            </article>
          ))}
        </div>
        <figure className="alsa-framework-figure" aria-labelledby="alsa-framework-title">
          <div className="alsa-framework-heading">
            <div>
              <span className="section-kicker">Linux ALSA</span>
              <h3 id="alsa-framework-title">{language === "zh" ? "Linux ALSA 分层框架图" : "Linux ALSA layered framework"}</h3>
            </div>
            <div className="alsa-framework-legend" aria-label={language === "zh" ? "通路图例" : "Path legend"}>
              <span><i className="alsa-framework-key pcm" />{language === "zh" ? "PCM 数据" : "PCM data"}</span>
              <span><i className="alsa-framework-key control" />{language === "zh" ? "Control 控制" : "Control path"}</span>
            </div>
          </div>
          <div
            className="alsa-framework-diagram"
            role="img"
            aria-label={language === "zh" ? "Linux ALSA 分层框架图" : "Linux ALSA layered framework diagram"}
          >
            {frameworkLayers.map((layer) => (
              <div className="alsa-framework-stage" key={layer.id}>
                <div className={`alsa-framework-layer-label ${layer.id}`}>{layer.label[language]}</div>
                <div className="alsa-framework-nodes">
                  {layer.nodes.map((node) => (
                    <div className={`alsa-framework-node ${layer.id}`} key={node.title.en}>
                      <strong>{node.title[language]}</strong>
                      <span>{node.detail[language]}</span>
                    </div>
                  ))}
                </div>
                {layer.handoff ? (
                  <div className="alsa-framework-handoff">
                    <span aria-hidden="true">↓</span>
                    <small>{layer.handoff[language]}</small>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
          <figcaption>
            {language === "zh"
              ? "应用可以直接调用 alsa-lib，也可以先经过 PipeWire、PulseAudio 或 JACK；后者是可选上层服务。ASoC 是嵌入式 Linux 常见驱动框架，不是 USB/PCI 声卡的必经路径。"
              : "An application may call alsa-lib directly or use PipeWire, PulseAudio, or JACK first; those are optional higher-level services. ASoC is common in embedded Linux, not a mandatory path for USB or PCI audio."}
          </figcaption>
        </figure>
        <aside className="alsa-embedded-note" aria-label={language === "zh" ? "嵌入式 Linux 链路说明" : "Embedded Linux path note"}>
          <strong>{language === "zh" ? "嵌入式 Linux 常见链路" : "Common embedded Linux path"}</strong>
          <p>
            {language === "zh"
              ? "ASoC 通常把 CPU DAI、I2S、Codec DAI、Codec 和功放组合成声卡；DAI 是接口抽象，I2S 是常见协议。这个链路适合解释嵌入式系统，但不是所有 PC 声卡的固定结构。"
              : "ASoC often combines CPU DAI, I2S, codec DAI, codec, and amplifier into a sound card; DAI is an interface abstraction and I2S is a common protocol. This explains embedded systems, not every PC sound card."}
          </p>
        </aside>
      </section>

      <section className="alsa-workbench" aria-label={language === "zh" ? "ALSA 交互实验台" : "ALSA interactive workbench"}>
        <div className="alsa-workbench-main">
          <div className="alsa-workbench-heading">
            <div>
              <span className="section-kicker">{language === "zh" ? "浏览器教学模拟" : "Browser teaching simulation"}</span>
              <h2>{currentTab.label[language]}</h2>
            </div>
            <p>{currentTab.description[language]}</p>
          </div>

          <form className="alsa-controls" aria-label={language === "zh" ? "ALSA PCM 参数" : "ALSA PCM parameters"}>
            <label className="alsa-control">
              <span>{language === "zh" ? "采样率" : "Sample rate"}</span>
              <select aria-label={language === "zh" ? "采样率" : "Sample rate"} value={config.sampleRate} onChange={(event) => updateConfig("sampleRate", Number(event.target.value))}>
                {sampleRates.map((value) => <option key={value} value={value}>{value.toLocaleString("en-US")} Hz</option>)}
              </select>
            </label>
            <label className="alsa-control">
              <span>{language === "zh" ? "声道" : "Channels"}</span>
              <select aria-label={language === "zh" ? "声道" : "Channels"} value={config.channels} onChange={(event) => updateConfig("channels", Number(event.target.value))}>
                {channelOptions.map((value) => <option key={value} value={value}>{value} {language === "zh" ? "声道" : "channel(s)"}</option>)}
              </select>
            </label>
            <label className="alsa-control">
              <span>{language === "zh" ? "位深" : "Bit depth"}</span>
              <select aria-label={language === "zh" ? "位深" : "Bit depth"} value={config.bitDepth} onChange={(event) => updateConfig("bitDepth", Number(event.target.value))}>
                {bitDepths.map((value) => <option key={value} value={value}>{value}-bit / {formatNames[value]}</option>)}
              </select>
            </label>
            <label className="alsa-control">
              <span>period frames</span>
              <select aria-label="period frames" value={config.periodFrames} onChange={(event) => updateConfig("periodFrames", Number(event.target.value))}>
                {periodFramesOptions.map((value) => <option key={value} value={value}>{value} frames</option>)}
              </select>
            </label>
            <label className="alsa-control">
              <span>period count</span>
              <select aria-label="period count" value={config.periodCount} onChange={(event) => updateConfig("periodCount", Number(event.target.value))}>
                {periodCounts.map((value) => <option key={value} value={value}>{value} periods</option>)}
              </select>
            </label>
          </form>

          <section className="alsa-metrics" aria-label={language === "zh" ? "实时计算结果" : "Live calculations"} aria-live="polite">
            <article className="alsa-metric">
              <span>{language === "zh" ? "周期时长" : "Period duration"}</span>
              <strong>period {formatMs(periodMs)} ms</strong>
            </article>
            <article className="alsa-metric">
              <span>{language === "zh" ? "总 buffer 时长" : "Total buffer duration"}</span>
              <strong>buffer {formatMs(bufferMs)} ms</strong>
            </article>
            <article className="alsa-metric">
              <span>{language === "zh" ? "唤醒频率" : "Wakeups per second"}</span>
              <strong>{language === "zh" ? `${wakeupsPerSecond.toFixed(2)} 次/秒` : `${wakeupsPerSecond.toFixed(2)} wakeups/s`}</strong>
            </article>
            <article className="alsa-metric">
              <span>{language === "zh" ? "数据速率" : "Data rate"}</span>
              <strong>{formatInteger(bytesPerSecond)} B/s</strong>
            </article>
          </section>

          <div className="alsa-mode-tabs" role="group" aria-label={language === "zh" ? "ALSA 实验模式" : "ALSA lab modes"}>
            {modeTabs.map((tab) => (
              <button
                aria-pressed={mode === tab.id}
                className={mode === tab.id ? "alsa-mode-tab active" : "alsa-mode-tab"}
                key={tab.id}
                type="button"
                onClick={() => selectMode(tab.id)}
              >
                {tab.label[language]}
              </button>
            ))}
          </div>

          {mode === "buffer" ? (
            <section className="alsa-mode-panel" aria-label={currentTab.label[language]}>
              <div className="alsa-panel-heading">
                <h2>{language === "zh" ? "环形 buffer 与指针" : "Ring buffer and pointers"}</h2>
                <p>{language === "zh" ? "每个分区代表一个 period；分区数量和总容量随参数实时变化。" : "Each partition represents one period; partition count and total capacity update with the parameters."}</p>
              </div>
              <AlsaBufferDiagram config={config} direction={streamDirection} language={language} usedFrames={usedFrames} />
              <dl className="alsa-buffer-stats">
                <div>
                  <dt>{streamDirection === "playback" ? (language === "zh" ? "排队待播放" : "Queued for playback") : (language === "zh" ? "可读采集帧" : "Captured frames ready")}</dt>
                  <dd>{usedFrames}</dd>
                </div>
                <div>
                  <dt>{streamDirection === "playback" ? (language === "zh" ? "应用可写空间" : "Writable space") : (language === "zh" ? "硬件可写空间" : "Free capture space")}</dt>
                  <dd>{availableFrames}</dd>
                </div>
                <div><dt>{language === "zh" ? "总帧数" : "Total frames"}</dt><dd>{bufferFrames}</dd></div>
              </dl>
              <p className="alsa-buffer-direction-note">
                {streamDirection === "playback"
                  ? (language === "zh" ? "播放 underrun：硬件追上应用，读指针进入尚未填充的区域。" : "Playback underrun: hardware catches the app and reads into an area the app has not filled.")
                  : (language === "zh" ? "录音 overrun：硬件覆盖应用尚未读取的数据。" : "Capture overrun: hardware overwrites data the app has not read.")}
              </p>
            </section>
          ) : mode === "xrun" ? (
            <section className="alsa-mode-panel alsa-xrun-panel" aria-label={currentTab.label[language]}>
              <div className="alsa-panel-heading">
                <h2>{currentTab.label[language]}</h2>
                <p>{currentTab.description[language]}</p>
              </div>
              <ol className="alsa-xrun-flow">
                {xrunSteps.map((step, index) => (
                  <li className="alsa-xrun-step" key={step.title.en}>
                    <span>{index + 1}</span>
                    <div>
                      <h3>{step.title[language]}</h3>
                      <p>{step.body[language]}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <aside className="alsa-xrun-callout">
                <strong>snd_pcm_prepare</strong>
                <p>
                  {language === "zh"
                    ? "prepare 只把 PCM 流恢复到可运行状态；它不解决调度、处理耗时、设备参数或驱动时钟的根因。"
                    : "prepare only returns the PCM stream to a runnable state; it does not fix scheduling, processing time, device parameters, or driver-clock root causes."}
                </p>
              </aside>
            </section>
          ) : (
            <section className="alsa-mode-panel" aria-label={currentTab.label[language]}>
              <div className="alsa-panel-heading">
                <h2>{streamDirection === "playback" ? (language === "zh" ? "播放：应用填充，硬件消费" : "Playback: app fills, hardware consumes") : (language === "zh" ? "录音：硬件写入，应用读取" : "Capture: hardware writes, app reads")}</h2>
                <p>{currentTab.description[language]}</p>
              </div>
              <AlsaFlowDiagram direction={streamDirection} language={language} />
              <div className="alsa-command-block">
                <span>{language === "zh" ? "对应命令（raw PCM 示例）" : "Matching command (raw PCM example)"}</span>
                <code data-testid="alsa-command">{command}</code>
                <p>
                  {language === "zh"
                    ? "S16_LE、S24_3LE、S32_LE 分别按每样本 2/3/4 字节存储；S24_LE 通常使用 4 字节容器。WAV 通常自带格式头，这些 -f/-r/-c 参数更适合 raw PCM。"
                    : "S16_LE, S24_3LE, and S32_LE store each sample in 2, 3, and 4 bytes; S24_LE commonly uses a 4-byte container. WAV usually carries its own header, so these -f/-r/-c flags are mainly for raw PCM."}
                </p>
              </div>
            </section>
          )}
        </div>
      </section>
    </main>
  );
}

export { AlsaLab };
