import { useState } from "react";
import { ArrowLeft } from "lucide-react";

import type { Language } from "../content/knowledge";

type FlowMode = "playback" | "capture" | "duplex";

type FlowStep = {
  label: Record<Language, string>;
  sub: Record<Language, string>;
  x: number;
  y: number;
};

const FLOW_VIEWBOX = "0 0 1240 680";
const FLOW_WIDTH = 1240;
const FLOW_HEIGHT = 680;
const FLOW_NODE_WIDTH = 252;
const FLOW_NODE_HEIGHT = 152;
const FLOW_NODE_HALF_WIDTH = FLOW_NODE_WIDTH / 2;
const FLOW_NODE_HALF_HEIGHT = FLOW_NODE_HEIGHT / 2;

type ArchitectureLayer = {
  kind: "app" | "middleware" | "software" | "driver" | "hardware";
  title: Record<Language, string>;
  detail: Record<Language, string>;
};

type SystemAudioLabProps = {
  language: Language;
  onBack: () => void;
};

const genericArchitectureLayers = [
  {
    kind: "app",
    title: { zh: "应用程序", en: "Application" },
    detail: { zh: "播放器 / 浏览器 / 录音 / 通话软件", en: "player / browser / recorder / call app" }
  },
  {
    kind: "middleware",
    title: { zh: "音频 API / 音频服务", en: "Audio API / audio service" },
    detail: { zh: "接收请求，管理会话、权限和音量", en: "receives requests, manages sessions, permission, and volume" }
  },
  {
    kind: "software",
    title: { zh: "混音 / 路由 / 重采样 / 音量管理", en: "Mixing / routing / resampling / volume" },
    detail: { zh: "合并播放流，选择设备，统一格式", en: "combines streams, selects devices, normalizes formats" }
  },
  {
    kind: "driver",
    title: { zh: "驱动接口", en: "Driver interface" },
    detail: { zh: "承接 PCM 数据、控制命令和设备状态", en: "handles PCM data, controls, and device state" }
  },
  {
    kind: "hardware",
    title: { zh: "硬件设备", en: "Hardware device" },
    detail: { zh: "Codec / DAC / ADC / 麦克风 / 扬声器", en: "Codec / DAC / ADC / microphone / speaker" }
  }
] satisfies ArchitectureLayer[];

const linuxArchitectureLayers = [
  {
    kind: "app",
    title: { zh: "应用程序", en: "Application" },
    detail: { zh: "播放器 / 浏览器 / 录音软件 / 通话软件", en: "player / browser / recorder / call app" }
  },
  {
    kind: "middleware",
    title: { zh: "PipeWire / PulseAudio / JACK", en: "PipeWire / PulseAudio / JACK" },
    detail: { zh: "音频流管理、路由、会话和低延迟服务", en: "stream management, routing, sessions, low-latency service" }
  },
  {
    kind: "driver",
    title: { zh: "ALSA 用户态接口", en: "ALSA user-space interface" },
    detail: { zh: "alsa-lib / PCM API / mixer control", en: "alsa-lib / PCM API / mixer control" }
  },
  {
    kind: "driver",
    title: { zh: "Linux Kernel ALSA 驱动", en: "Linux kernel ALSA driver" },
    detail: { zh: "声卡驱动 / I2S / USB Audio / HDA / ASoC", en: "sound driver / I2S / USB Audio / HDA / ASoC" }
  },
  {
    kind: "hardware",
    title: { zh: "硬件层", en: "Hardware layer" },
    detail: { zh: "Codec / DAC / ADC / 功放 / 麦克风 / 扬声器", en: "Codec / DAC / ADC / amplifier / mic / speaker" }
  }
] satisfies ArchitectureLayer[];

const architectureKindLabels = {
  app: { zh: "应用", en: "App" },
  middleware: { zh: "中间件", en: "Middleware" },
  software: { zh: "软件", en: "Software" },
  driver: { zh: "驱动", en: "Driver" },
  hardware: { zh: "硬件", en: "Hardware" }
} satisfies Record<ArchitectureLayer["kind"], Record<Language, string>>;

const flowTabs: Array<{ id: FlowMode; label: Record<Language, string> }> = [
  { id: "playback", label: { zh: "播放链路", en: "Playback path" } },
  { id: "capture", label: { zh: "录音链路", en: "Capture path" } },
  { id: "duplex", label: { zh: "全双工语音", en: "Full-duplex voice" } }
];

const flowCopy = {
  playback: {
    title: { zh: "播放链路重点", en: "Playback focus" },
    summary: {
      zh: "播放链路重点：系统把应用输出映射到当前可用的输出设备。",
      en: "Playback focus: the system maps app output to the currently available output device."
    },
  },
  capture: {
    title: { zh: "录音链路重点", en: "Capture focus" },
    summary: {
      zh: "录音链路重点：系统在应用拿到数据前完成权限、输入选择和格式交付。",
      en: "Capture focus: the system handles permission, input selection, and format delivery before the app receives data."
    },
  },
  duplex: {
    title: { zh: "全双工重点", en: "Full-duplex focus" },
    summary: {
      zh: "全双工重点：系统只说明回放参考和采集流怎样接入语音链路。",
      en: "Full-duplex focus: the system only shows how playback reference and capture stream enter the voice path."
    },
  }
} satisfies Record<FlowMode, { title: Record<Language, string>; summary: Record<Language, string> }>;

const flowSteps = {
  playback: [
    {
      label: { zh: "App 播放请求", en: "App playback request" },
      sub: { zh: "媒体 / 游戏 / 提示音", en: "Media / game / prompt" },
      x: 178,
      y: 170
    },
    {
      label: { zh: "Audio API", en: "Audio API" },
      sub: { zh: "格式 / 会话", en: "format / session" },
      x: 486,
      y: 170
    },
    {
      label: { zh: "音频服务", en: "Audio service" },
      sub: { zh: "音频焦点 / session", en: "focus / session" },
      x: 794,
      y: 170
    },
    {
      label: { zh: "混音 / 重采样", en: "Mix / resample" },
      sub: { zh: "多路流统一输出", en: "streams to output" },
      x: 794,
      y: 448
    },
    {
      label: { zh: "HAL / 驱动", en: "HAL / driver" },
      sub: { zh: "DMA / 接口配置", en: "DMA / interface" },
      x: 486,
      y: 448
    },
    {
      label: { zh: "扬声器 / 耳机", en: "Speaker / headset" },
      sub: { zh: "Codec / DAC 输出", en: "Codec / DAC out" },
      x: 178,
      y: 448
    }
  ],
  capture: [
    {
      label: { zh: "麦克风 / ADC", en: "Mic / ADC" },
      sub: { zh: "声压转数字样本", en: "pressure to samples" },
      x: 178,
      y: 170
    },
    {
      label: { zh: "HAL / 驱动", en: "HAL / driver" },
      sub: { zh: "DMA / 时间戳", en: "DMA / timestamp" },
      x: 486,
      y: 170
    },
    {
      label: { zh: "输入路由", en: "Input routing" },
      sub: { zh: "内置 / USB / 蓝牙", en: "built-in / USB / BT" },
      x: 794,
      y: 170
    },
    {
      label: { zh: "权限 / 隐私指示", en: "Permission / privacy" },
      sub: { zh: "麦克风授权", en: "microphone grant" },
      x: 794,
      y: 448
    },
    {
      label: { zh: "预处理", en: "Preprocess" },
      sub: { zh: "增益 / 降噪 / 格式", en: "gain / denoise / format" },
      x: 486,
      y: 448
    },
    {
      label: { zh: "App 录音数据", en: "App capture data" },
      sub: { zh: "识别 / 通话 / 录制", en: "ASR / call / record" },
      x: 178,
      y: 448
    }
  ],
  duplex: [
    {
      label: { zh: "回放流", en: "Playback stream" },
      sub: { zh: "远端语音 / 提示音", en: "remote voice / prompt" },
      x: 190,
      y: 170
    },
    {
      label: { zh: "扬声器输出", en: "Speaker output" },
      sub: { zh: "进入空气和麦克风", en: "into air and mic" },
      x: 506,
      y: 170
    },
    {
      label: { zh: "回放参考", en: "Playback reference" },
      sub: { zh: "送入语音处理", en: "to voice processing" },
      x: 822,
      y: 170
    },
    {
      label: { zh: "采集流", en: "Capture stream" },
      sub: { zh: "近端语音 + 回声", en: "near voice + echo" },
      x: 190,
      y: 462
    },
    {
      label: { zh: "AEC / NS / AGC", en: "AEC / NS / AGC" },
      sub: { zh: "消回声 / 降噪 / 自动增益", en: "echo / noise / gain" },
      x: 506,
      y: 462
    },
    {
      label: { zh: "语音 App", en: "Voice app" },
      sub: { zh: "通话 / 会议 / 对讲", en: "call / meeting / intercom" },
      x: 822,
      y: 462
    }
  ]
} satisfies Record<FlowMode, FlowStep[]>;

function renderFlowDiagram(language: Language, flowMode: FlowMode) {
  const steps = flowSteps[flowMode];
  const isDuplex = flowMode === "duplex";
  const label = {
    playback: { zh: "播放链路流程图", en: "Playback path flowchart" },
    capture: { zh: "录音链路流程图", en: "Capture path flowchart" },
    duplex: { zh: "全双工语音流程图", en: "Full-duplex voice flowchart" }
  } satisfies Record<FlowMode, Record<Language, string>>;
  const renderStepConnector = (step: FlowStep, next: FlowStep, index: number) => {
    if (step.y === next.y) {
      return (
        <path
          className="system-audio-arrow"
          d={`M ${Math.min(step.x, next.x) + FLOW_NODE_HALF_WIDTH} ${step.y} H ${Math.max(step.x, next.x) - FLOW_NODE_HALF_WIDTH}`}
          key={`${step.label.en}-${next.label.en}`}
        />
      );
    }

    return (
      <path
        className="system-audio-arrow"
        d={`M ${step.x} ${step.y + FLOW_NODE_HALF_HEIGHT} V ${(step.y + next.y) / 2} H ${next.x} V ${next.y - FLOW_NODE_HALF_HEIGHT}`}
        key={`${step.label.en}-${next.label.en}-${index}`}
      />
    );
  };

  return (
    <figure className="system-audio-flow">
      <svg aria-label={label[flowMode][language]} role="img" viewBox={FLOW_VIEWBOX} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <marker id="systemAudioArrow" markerHeight="10" markerWidth="10" orient="auto" refX="8" refY="5">
            <path d="M 0 0 L 10 5 L 0 10 Z" fill="#f0b46a" />
          </marker>
        </defs>
        <rect className="lab-diagram-bg" height={FLOW_HEIGHT} rx="20" width={FLOW_WIDTH} />
        <text className="lab-label system-audio-flow-title" x="56" y="56">
          {label[flowMode][language]}
        </text>
        {steps.map((step) => (
          <g key={step.label.en}>
            <rect
              className="system-audio-node"
              height={FLOW_NODE_HEIGHT}
              rx="18"
              width={FLOW_NODE_WIDTH}
              x={step.x - FLOW_NODE_HALF_WIDTH}
              y={step.y - FLOW_NODE_HALF_HEIGHT}
            />
            <text className="interface-node-text" x={step.x} y={step.y - 4}>
              {step.label[language]}
            </text>
            <text className="interface-node-sub" x={step.x} y={step.y + 34}>
              {step.sub[language]}
            </text>
          </g>
        ))}
        {isDuplex ? (
          <>
            <path className="system-audio-arrow" d="M 316 170 H 380" />
            <path className="system-audio-arrow" d="M 632 170 H 696" />
            <path className="system-audio-arrow reference" d="M 822 246 C 822 330 632 354 548 386" />
            <path className="system-audio-arrow" d="M 316 462 H 380" />
            <path className="system-audio-arrow" d="M 632 462 H 696" />
            <path className="system-audio-arrow echo" d="M 506 246 C 416 318 286 342 190 386" />
            <text className="system-audio-note" x="944" y="176">
              {language === "zh" ? "回放参考不出声，只给算法对齐" : "Reference is for algorithm alignment"}
            </text>
            <text className="system-audio-note" x="306" y="628">
              {language === "zh" ? "扬声器声可能被麦克风再次采到" : "Speaker sound may be captured by the mic"}
            </text>
          </>
        ) : (
          steps.slice(0, -1).map((step, index) => {
            const next = steps[index + 1];
            return renderStepConnector(step, next, index);
          })
        )}
      </svg>
      <figcaption>{flowCopy[flowMode].summary[language]}</figcaption>
    </figure>
  );
}

function ArchitectureStack({
  ariaLabel,
  language,
  layers
}: {
  ariaLabel: string;
  language: Language;
  layers: ArchitectureLayer[];
}) {
  return (
    <figure aria-label={ariaLabel} className="system-audio-architecture-card" role="img">
      <div className="system-audio-architecture-stack">
        {layers.map((layer, index) => (
          <div className="system-audio-architecture-row" key={layer.title.en}>
            <div className={`system-audio-architecture-box ${layer.kind}`}>
              <span className={`system-audio-kind-badge ${layer.kind}`}>
                {architectureKindLabels[layer.kind][language]}
              </span>
              <strong>{layer.title[language]}</strong>
              <span>{layer.detail[language]}</span>
            </div>
            {index < layers.length - 1 ? <span aria-hidden="true" className="system-audio-down-arrow">↓</span> : null}
          </div>
        ))}
      </div>
    </figure>
  );
}

export function SystemAudioLab({ language, onBack }: SystemAudioLabProps) {
  const [flowMode, setFlowMode] = useState<FlowMode>("playback");
  const currentCopy = flowCopy[flowMode];

  return (
    <main className="codec-lab-page system-audio-lab">
      <section className="sound-lab-hero" aria-labelledby="system-audio-lab-title">
        <button className="sound-lab-back" type="button" onClick={onBack}>
          <ArrowLeft size={18} aria-hidden="true" />
          {language === "zh" ? "返回知识库" : "Back to knowledge base"}
        </button>
        <div>
          <span className="section-kicker">{language === "zh" ? "软件实验" : "Software lab"}</span>
          <h1 id="system-audio-lab-title">
            {language === "zh" ? "系统音频架构实验室" : "System Audio Architecture Lab"}
          </h1>
          <p>
            {language === "zh"
              ? "用系统分层理解应用请求、音频服务、路由策略、驱动和硬件之间的边界。"
              : "Use system layers to understand the boundaries among app requests, audio services, routing policy, drivers, and hardware."}
          </p>
        </div>
      </section>

      <section
        aria-label={language === "zh" ? "系统音频架构总览" : "System audio architecture overview"}
        className="system-audio-overview"
      >
        <div className="system-audio-overview-grid">
          <article className="system-audio-frame-panel">
            <span className="section-kicker">{language === "zh" ? "通用框架" : "Generic model"}</span>
            <h2>{language === "zh" ? "通用系统音频架构" : "Generic System Audio Architecture"}</h2>
            <ArchitectureStack
              ariaLabel={language === "zh" ? "通用系统音频架构框图" : "Generic system audio architecture block diagram"}
              language={language}
              layers={genericArchitectureLayers}
            />
          </article>

          <article className="system-audio-frame-panel">
            <span className="section-kicker">{language === "zh" ? "具体例子" : "Concrete example"}</span>
            <h2>{language === "zh" ? "Linux 音频架构示例" : "Linux Audio Architecture Example"}</h2>
            <ArchitectureStack
              ariaLabel={language === "zh" ? "Linux 音频架构示例框图" : "Linux audio architecture example block diagram"}
              language={language}
              layers={linuxArchitectureLayers}
            />
          </article>
        </div>

        <p className="system-audio-overview-note">
          {language === "zh"
            ? "Linux 只是具体映射：桌面常见 PipeWire / PulseAudio → ALSA，嵌入式常见 ASoC → Codec / 功放。接口时序和环形 buffer 分别在对应专题展开。"
            : "Linux is one concrete mapping: desktop systems commonly use PipeWire / PulseAudio → ALSA, while embedded systems often use ASoC → codec / amplifier. Interface timing and ring buffers belong to their dedicated topics."}
        </p>
      </section>

      <section
        aria-label={language === "zh" ? "系统音频链路实验台" : "System audio path workbench"}
        className="system-audio-workbench"
      >
        <div className="amp-lab-panel">
          <div className="waveform-tabs" role="group" aria-label={language === "zh" ? "链路模式" : "Path mode"}>
            {flowTabs.map((tab) => (
              <button
                aria-pressed={flowMode === tab.id}
                className={flowMode === tab.id ? "waveform-tab active" : "waveform-tab"}
                key={tab.id}
                type="button"
                onClick={() => setFlowMode(tab.id)}
              >
                {tab.label[language]}
              </button>
            ))}
          </div>
          <div className="system-audio-mode-summary">
            <strong>{currentCopy.title[language]}</strong>
            <p>{currentCopy.summary[language]}</p>
          </div>
          {renderFlowDiagram(language, flowMode)}
        </div>
      </section>
    </main>
  );
}
