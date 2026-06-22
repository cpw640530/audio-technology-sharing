import { ArrowLeft } from "lucide-react";
import { useMemo, useState } from "react";
import type { Language } from "../content/knowledge";

type AudioPluginLabProps = {
  language: Language;
  onBack: () => void;
};

type PluginModule = "gain" | "filter" | "delay" | "compressor" | "waveshaper";

const moduleLabels: Record<PluginModule, Record<Language, string>> = {
  gain: { zh: "Gain / Pan", en: "Gain / Pan" },
  filter: { zh: "Filter / EQ", en: "Filter / EQ" },
  delay: { zh: "Delay", en: "Delay" },
  compressor: { zh: "Compressor", en: "Compressor" },
  waveshaper: { zh: "Waveshaper", en: "Waveshaper" }
};

const moduleDescriptions: Record<PluginModule, Record<Language, string>> = {
  gain: {
    zh: "最基础的插件模块：每个 sample 乘以增益，声像则按左右声道比例分配。",
    en: "The most basic plugin block: each sample is multiplied by gain, while panning distributes level between left and right channels."
  },
  filter: {
    zh: "常见为 biquad 或 FIR/IIR 滤波器，用 cutoff、Q、gain 改变频率响应。",
    en: "Often implemented as a biquad or FIR/IIR filter, changing frequency response with cutoff, Q, and gain."
  },
  delay: {
    zh: "把历史 sample 存进环形 buffer，再按延迟时间读出，可加入 feedback 形成回声。",
    en: "Stores past samples in a circular buffer, reads them back after a delay, and can add feedback to create echoes."
  },
  compressor: {
    zh: "检测电平包络，超过 threshold 后按 ratio 降低增益，控制峰值和动态范围。",
    en: "Detects the level envelope, then reduces gain above a threshold according to ratio to control peaks and dynamic range."
  },
  waveshaper: {
    zh: "用非线性函数重映射 sample，产生饱和、失真和新的谐波。",
    en: "Remaps samples through a nonlinear curve, creating saturation, distortion, and new harmonics."
  }
};

const moduleCosts: Record<PluginModule, number> = {
  gain: 0.18,
  filter: 0.52,
  delay: 0.38,
  compressor: 0.74,
  waveshaper: 0.46
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function createPluginWavePath({
  drive,
  module,
  mix,
  oversampling,
  smoothing,
  yBase
}: {
  drive: number;
  module: PluginModule;
  mix: number;
  oversampling: number;
  smoothing: number;
  yBase: number;
}) {
  const points = Array.from({ length: 96 }, (_, index) => {
    const ratio = index / 95;
    const carrier = Math.sin(ratio * Math.PI * 8);
    const harmonic = Math.sin(ratio * Math.PI * 24) * 0.22;
    const envelope = 0.48 + Math.sin(ratio * Math.PI * 2) * 0.18;
    let value = carrier * envelope + harmonic;

    if (module === "filter") {
      const filterAmount = clamp(mix * 0.72 + drive * 0.28, 0, 1);
      value = carrier * envelope * (0.5 + filterAmount * 0.45) + harmonic * (1 - filterAmount * 0.82);
    } else if (module === "delay") {
      const delayOffset = 0.08 + drive * 0.16;
      const repeats = [1, 2, 3].reduce((sum, tap) => {
        const delayedRatio = Math.max(0, ratio - delayOffset * tap);
        const tapGain = Math.pow(drive, tap) * Math.exp(-tap * (1.05 - mix * 0.36));
        return sum + Math.sin(delayedRatio * Math.PI * 8) * tapGain;
      }, 0);
      value = value * (0.72 - drive * 0.18) + repeats * mix * 0.62;
    } else if (module === "compressor") {
      const threshold = 0.44 + (1 - mix) * 0.14 - drive * 0.08;
      const sign = Math.sign(value);
      const amount = Math.abs(value);
      value = sign * (amount > threshold ? threshold + (amount - threshold) * (1 - mix * (0.45 + drive * 0.36)) : amount);
    } else if (module === "waveshaper") {
      const shapeDrive = 1.1 + mix * 2.4 + drive * 5.2;
      const shaped = Math.tanh(value * shapeDrive) / Math.tanh(shapeDrive);
      const aliasRipple = Math.sin(ratio * Math.PI * (36 + drive * 42)) * drive * mix * (0.24 / oversampling);
      value = shaped + aliasRipple;
    } else {
      value *= 0.42 + mix * 0.64 + drive * 0.24;
    }

    const smoothed = clamp(value * (1 - smoothing * 0.18), -1.15, 1.15);

    return {
      x: 48 + ratio * 624,
      y: yBase - smoothed * 72
    };
  });

  return points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" ");
}

function getModuleFocus(module: PluginModule, language: Language) {
  const content: Record<PluginModule, Record<Language, string>> = {
    gain: {
      zh: "关注 sample 乘法、左右声道比例和自动化平滑，不展开系统 buffer 调度。",
      en: "Focus on sample multiplication, left/right balance, and automation smoothing, not system buffer scheduling."
    },
    filter: {
      zh: "关注 biquad 系数、cutoff/Q 改变时的平滑，以及频率响应如何影响当前 buffer。",
      en: "Focus on biquad coefficients, smoothing cutoff/Q changes, and how frequency response affects the current buffer."
    },
    delay: {
      zh: "关注插件内部 delay line、读写指针和 feedback，区别于系统层的环形 buffer。",
      en: "Focus on the plugin's internal delay line, read/write pointers, and feedback, distinct from system-level ring buffers."
    },
    compressor: {
      zh: "关注包络检测、增益计算和 gain reduction，不重复实时音频卡片里的 deadline 调度。",
      en: "Focus on envelope detection, gain computation, and gain reduction, not deadline scheduling from the real-time audio card."
    },
    waveshaper: {
      zh: "关注非线性映射、谐波增加和 oversampling 抑制混叠。",
      en: "Focus on nonlinear mapping, added harmonics, and oversampling to reduce aliasing."
    }
  };

  return content[module][language];
}

function ProcessingGraph({
  language,
  module
}: {
  language: Language;
  module: PluginModule;
}) {
  const stages = [
    { label: "Host", sub: { zh: "DAW / App", en: "DAW / app" } },
    { label: "prepare", sub: { zh: "参数 / 状态", en: "parameters / state" } },
    { label: "processBlock", sub: { zh: "实时回调", en: "real-time callback" } },
    { label: moduleLabels[module].en, sub: moduleLabels[module] },
    { label: "Output", sub: { zh: "PCM buffer", en: "PCM buffer" } }
  ];

  return (
    <ol className="audio-plugin-flow" aria-label={language === "zh" ? "音频插件处理流程" : "Audio plugin processing flow"}>
      {stages.map((stage, index) => (
        <li key={`${stage.label}-${index}`}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <strong>{stage.label}</strong>
          <p>{stage.sub[language]}</p>
        </li>
      ))}
    </ol>
  );
}

function PluginSignalView({
  drive,
  language,
  mix,
  module,
  oversampling,
  smoothing
}: {
  drive: number;
  language: Language;
  mix: number;
  module: PluginModule;
  oversampling: number;
  smoothing: number;
}) {
  const rawPath = createPluginWavePath({
    drive: 0,
    mix: 0.72,
    module: "gain",
    oversampling: 1,
    smoothing: 0,
    yBase: 124
  });
  const processedPath = createPluginWavePath({
    drive: drive / 100,
    mix: mix / 100,
    module,
    oversampling,
    smoothing: smoothing / 100,
    yBase: 264
  });

  return (
    <svg
      aria-label={language === "zh" ? "音频插件信号处理对比图" : "Audio plugin signal processing comparison"}
      className="audio-plugin-signal"
      role="img"
      viewBox="0 0 720 330"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect className="lab-diagram-bg" height="330" rx="16" width="720" />
      <text className="spatial-chart-title" x="34" y="38">
        {language === "zh" ? "输入 buffer 与处理后 buffer" : "Input buffer and processed buffer"}
      </text>
      <line className="spatial-response-axis" x1="48" x2="672" y1="124" y2="124" />
      <line className="spatial-response-axis" x1="48" x2="672" y1="264" y2="264" />
      <path className="audio-plugin-wave raw" d={rawPath} />
      <path className="audio-plugin-wave processed" d={processedPath} />
      <text className="spatial-response-label" x="50" y="92">{language === "zh" ? "输入 PCM" : "Input PCM"}</text>
      <text className="spatial-response-label" x="50" y="232">{language === "zh" ? "处理后 PCM" : "Processed PCM"}</text>
      <text className="spatial-response-note" x="34" y="310">
        {language === "zh"
          ? "真实插件在每个 block 里逐 sample 或逐 frame 处理；图中只展示当前模块的典型变化，不代表完整声学仿真。"
          : "Real plugins process each block sample by sample or frame by frame; this diagram shows typical module behavior, not a full acoustic simulation."}
      </text>
    </svg>
  );
}

export function AudioPluginLab({ language, onBack }: AudioPluginLabProps) {
  const [module, setModule] = useState<PluginModule>("filter");
  const [automationStep, setAutomationStep] = useState(62);
  const [smoothing, setSmoothing] = useState(45);
  const [driveOrFeedback, setDriveOrFeedback] = useState(42);
  const [oversampling, setOversampling] = useState(2);

  const metrics = useMemo(() => {
    const zipperRisk = clamp(automationStep * (1 - smoothing / 100), 0, 100);
    const internalDelaySamples =
      module === "delay"
        ? Math.round(1200 + driveOrFeedback * 58)
        : module === "filter"
          ? 2
          : module === "compressor"
            ? Math.round(64 + smoothing * 1.4)
            : 0;
    const colorAmount =
      module === "waveshaper"
        ? driveOrFeedback * 0.92 + automationStep * 0.18
        : module === "delay"
          ? driveOrFeedback * 0.68
          : module === "filter"
            ? automationStep * 0.35
            : module === "compressor"
              ? automationStep * 0.42
              : automationStep * 0.22;
    const aliasRisk = module === "waveshaper" ? clamp((colorAmount / oversampling) * 0.8, 0, 100) : 0;
    const automationRisk =
      zipperRisk > 50
        ? { zh: "高：容易 zipper noise", en: "high: zipper noise risk" }
        : zipperRisk > 22
          ? { zh: "中：适合多数参数", en: "medium: suitable for most parameters" }
          : { zh: "低：更平滑但响应慢", en: "low: smoother but slower" };

    return { aliasRisk, automationRisk, colorAmount, internalDelaySamples, zipperRisk };
  }, [automationStep, driveOrFeedback, module, oversampling, smoothing]);

  return (
    <main className="codec-lab-page audio-plugin-page">
      <section className="sound-lab-hero" aria-labelledby="audio-plugin-title">
        <button className="sound-lab-back" type="button" onClick={onBack}>
          <ArrowLeft size={18} aria-hidden="true" />
          {language === "zh" ? "返回知识库" : "Back to knowledge base"}
        </button>
        <div>
          <span className="section-kicker">{language === "zh" ? "音频编程实验" : "Audio programming lab"}</span>
          <h1 id="audio-plugin-title">{language === "zh" ? "音频编程与插件实验室" : "Audio Programming and Plugin Lab"}</h1>
          <p>
            {language === "zh"
              ? "用插件处理链理解 host、processBlock、buffer、DSP 模块、参数平滑和实时安全限制。"
              : "Use a plugin processing chain to understand the host, processBlock, buffers, DSP blocks, parameter smoothing, and real-time safety limits."}
          </p>
        </div>
      </section>

      <section className="audio-plugin-workbench" aria-label={language === "zh" ? "音频插件实验台" : "Audio plugin workbench"}>
        <div className="waveform-tabs audio-plugin-tabs" role="group" aria-label={language === "zh" ? "插件 DSP 模块" : "Plugin DSP modules"}>
          {(Object.keys(moduleLabels) as PluginModule[]).map((item) => (
            <button className={module === item ? "active" : ""} key={item} type="button" onClick={() => setModule(item)}>
              {moduleLabels[item][language]}
            </button>
          ))}
        </div>

        <div className="audio-plugin-layout">
          <div className="audio-plugin-visuals">
            <ProcessingGraph language={language} module={module} />
            <PluginSignalView
              drive={driveOrFeedback}
              language={language}
              mix={automationStep}
              module={module}
              oversampling={oversampling}
              smoothing={smoothing}
            />
          </div>

          <aside className="audio-plugin-panel">
            <div className="codec-mode-concepts-header">
              <span>{moduleLabels[module][language]}</span>
              <strong>{moduleDescriptions[module][language]}</strong>
            </div>
            <label className="sound-lab-control">
              <span>{language === "zh" ? `参数变化幅度：${automationStep}%` : `Automation step: ${automationStep}%`}</span>
              <input aria-label={language === "zh" ? "参数变化幅度" : "Automation step"} max="100" min="0" step="5" type="range" value={automationStep} onChange={(event) => setAutomationStep(Number(event.target.value))} />
            </label>
            <label className="sound-lab-control">
              <span>{language === "zh" ? `参数平滑：${smoothing}%` : `Parameter smoothing: ${smoothing}%`}</span>
              <input aria-label={language === "zh" ? "参数平滑" : "Parameter smoothing"} max="100" min="0" step="5" type="range" value={smoothing} onChange={(event) => setSmoothing(Number(event.target.value))} />
            </label>
            <label className="sound-lab-control">
              <span>{language === "zh" ? `反馈 / 驱动：${driveOrFeedback}%` : `Feedback / drive: ${driveOrFeedback}%`}</span>
              <input aria-label={language === "zh" ? "反馈驱动" : "Feedback drive"} max="100" min="0" step="5" type="range" value={driveOrFeedback} onChange={(event) => setDriveOrFeedback(Number(event.target.value))} />
            </label>
            <label className="sound-lab-control">
              <span>{language === "zh" ? `Oversampling：${oversampling}x` : `Oversampling: ${oversampling}x`}</span>
              <input aria-label="Oversampling" max="4" min="1" step="1" type="range" value={oversampling} onChange={(event) => setOversampling(Number(event.target.value))} />
            </label>
            <div className="audio-plugin-metrics">
              <strong>{language === "zh" ? `模块关注点：${getModuleFocus(module, language)}` : `Module focus: ${getModuleFocus(module, language)}`}</strong>
              <strong>{language === "zh" ? `Zipper noise 风险：${metrics.zipperRisk.toFixed(0)}%` : `Zipper-noise risk: ${metrics.zipperRisk.toFixed(0)}%`}</strong>
              <strong>{language === "zh" ? `音色变化量：${metrics.colorAmount.toFixed(0)}%` : `Tone-color change: ${metrics.colorAmount.toFixed(0)}%`}</strong>
              <strong>{language === "zh" ? `插件内部延迟：${metrics.internalDelaySamples} samples` : `Plugin internal delay: ${metrics.internalDelaySamples} samples`}</strong>
              {module === "waveshaper" ? (
                <strong>{language === "zh" ? `非线性混叠风险：${metrics.aliasRisk.toFixed(0)}%` : `Nonlinear aliasing risk: ${metrics.aliasRisk.toFixed(0)}%`}</strong>
              ) : null}
              <strong>{language === "zh" ? `参数自动化风险：${metrics.automationRisk.zh}` : `Automation risk: ${metrics.automationRisk.en}`}</strong>
            </div>
          </aside>
        </div>

        <section className="audio-plugin-concept-grid" aria-label={language === "zh" ? "音频插件关键解释" : "Audio plugin key explanations"}>
          <article>
            <h2>processBlock</h2>
            <p>
              {language === "zh"
                ? "Host 会周期性把一块 PCM buffer 交给插件。插件必须在下一块到来前处理完，不能把实时线程卡住。"
                : "The host periodically passes a PCM buffer to the plugin. The plugin must finish before the next block arrives and must not stall the real-time thread."}
            </p>
          </article>
          <article>
            <h2>{language === "zh" ? "参数平滑" : "Parameter smoothing"}</h2>
            <p>
              {language === "zh"
                ? "用户拖动旋钮时，如果参数瞬间跳变，容易产生 zipper noise。平滑会让参数按几毫秒到几十毫秒逐渐变化。"
                : "When a control jumps instantly, zipper noise can appear. Smoothing ramps parameters over a few to tens of milliseconds."}
            </p>
          </article>
          <article>
            <h2>{language === "zh" ? "实时安全" : "Real-time safety"}</h2>
            <p>
              {language === "zh"
                ? "音频回调里应避免磁盘 IO、网络请求、锁等待、频繁内存分配和大量日志。不可预测任务应放到后台线程。"
                : "Audio callbacks should avoid disk IO, network requests, lock waits, frequent allocation, and heavy logging. Unpredictable work belongs on background threads."}
            </p>
          </article>
          <article>
            <h2>JUCE / VST / AU</h2>
            <p>
              {language === "zh"
                ? "JUCE 常用于跨平台插件开发；VST、AU、AAX 是不同 host 可加载的插件格式或 SDK 生态。"
                : "JUCE is commonly used for cross-platform plugin development; VST, AU, and AAX are plugin formats or SDK ecosystems loaded by different hosts."}
            </p>
          </article>
        </section>
      </section>
    </main>
  );
}
