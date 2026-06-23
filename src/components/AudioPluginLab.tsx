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

const pluginWaveComponents = [
  { amplitude: 0.58, cycles: 4, phase: 0 },
  { amplitude: 0.23, cycles: 9, phase: 0.4 },
  { amplitude: 0.14, cycles: 16, phase: 1.1 },
  { amplitude: 0.08, cycles: 29, phase: 1.7 }
];

function getGainDb(value: number) {
  return -24 + value * 0.36;
}

function getPanOffset(value: number) {
  return value * 2 - 1;
}

function getFilterCutoffHz(value: number) {
  return Math.round(160 + value ** 1.8 * 7840);
}

function getFilterCutoffCycles(value: number) {
  return 3 + value ** 1.8 * 28;
}

function getFilterQ(value: number) {
  return 0.4 + value * 11.6;
}

function getDelayTimeMs(value: number) {
  return Math.round(35 + value * 565);
}

function getCompressorThresholdDb(value: number) {
  return -8 - value * 36;
}

function getCompressorRatio(value: number) {
  return 1 + value * 14;
}

function getWaveshaperDrive(value: number) {
  return 1 + value * 9;
}

function dbToLinear(db: number) {
  return 10 ** (db / 20);
}

function synthesizePluginSample(ratio: number, gains?: Array<number>) {
  const envelope = 0.58 + Math.sin(ratio * Math.PI * 2) * 0.16;

  return pluginWaveComponents.reduce((sum, component, index) => {
    const gain = gains?.[index] ?? 1;
    return sum + Math.sin(ratio * Math.PI * 2 * component.cycles + component.phase) * component.amplitude * gain;
  }, 0) * envelope;
}

function getLowpassMagnitude(cycles: number, cutoffCycles: number, q: number) {
  const ratio = cycles / Math.max(0.1, cutoffCycles);
  const magnitude = 1 / Math.sqrt((1 - ratio ** 2) ** 2 + (ratio / Math.max(0.1, q)) ** 2);

  return clamp(magnitude, 0, 1 + q * 0.08);
}

function createPluginWavePath({
  module,
  primary,
  oversampling,
  secondary,
  smoothing,
  yBase
}: {
  module: PluginModule;
  primary: number;
  oversampling: number;
  secondary: number;
  smoothing: number;
  yBase: number;
}) {
  const points = Array.from({ length: 96 }, (_, index) => {
    const ratio = index / 95;
    let value = synthesizePluginSample(ratio);

    if (module === "filter") {
      const cutoffCycles = getFilterCutoffCycles(primary);
      const q = getFilterQ(secondary);
      const componentGains = pluginWaveComponents.map((component) => getLowpassMagnitude(component.cycles, cutoffCycles, q));
      value = synthesizePluginSample(ratio, componentGains) * 0.72;
    } else if (module === "delay") {
      const delayOffset = 0.04 + primary * 0.22;
      const repeats = [1, 2, 3].reduce((sum, tap) => {
        const delayedRatio = Math.max(0, ratio - delayOffset * tap);
        const tapGain = Math.pow(secondary, tap) * Math.exp(-tap * 0.52);
        return sum + synthesizePluginSample(delayedRatio) * tapGain;
      }, 0);
      value = value * (0.72 - secondary * 0.16) + repeats * 0.64;
    } else if (module === "compressor") {
      const threshold = 0.18 + (1 - primary) * 0.42;
      const ratioAmount = getCompressorRatio(secondary);
      const sign = Math.sign(value);
      const amount = Math.abs(value);
      value = sign * (amount > threshold ? threshold + (amount - threshold) / ratioAmount : amount);
    } else if (module === "waveshaper") {
      const shapeDrive = getWaveshaperDrive(secondary);
      const shaped = Math.tanh(value * shapeDrive) / Math.tanh(shapeDrive);
      const nonlinearMix = primary;
      const foldbackResidue = Math.sin(ratio * Math.PI * 2 * (32 + secondary * 46)) * secondary * nonlinearMix * (0.2 / oversampling);
      value = value * (1 - nonlinearMix * 0.35) + shaped * nonlinearMix + foldbackResidue;
    } else {
      const gain = dbToLinear(getGainDb(primary));
      const panOffset = Math.abs(getPanOffset(secondary));
      value *= gain * (1 - panOffset * 0.18);
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
  language,
  module,
  oversampling,
  primary,
  secondary,
  smoothing
}: {
  language: Language;
  module: PluginModule;
  oversampling: number;
  primary: number;
  secondary: number;
  smoothing: number;
}) {
  const rawPath = createPluginWavePath({
    module: "gain",
    oversampling: 1,
    primary: 0.72,
    secondary: 0.5,
    smoothing: 0,
    yBase: 124
  });
  const processedPath = createPluginWavePath({
    module,
    oversampling,
    primary: primary / 100,
    secondary: secondary / 100,
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
  const [primaryAmount, setPrimaryAmount] = useState(62);
  const [smoothing, setSmoothing] = useState(45);
  const [secondaryAmount, setSecondaryAmount] = useState(42);
  const [oversampling, setOversampling] = useState(2);

  const metrics = useMemo(() => {
    const primary = primaryAmount / 100;
    const secondary = secondaryAmount / 100;
    const zipperRisk = clamp(primaryAmount * (1 - smoothing / 100), 0, 100);
    const latencyLabel =
      module === "delay"
        ? {
            zh: `效果延迟线：${Math.round((getDelayTimeMs(primary) / 1000) * 48_000).toLocaleString("en-US")} samples`,
            en: `Effect delay line: ${Math.round((getDelayTimeMs(primary) / 1000) * 48_000).toLocaleString("en-US")} samples`
          }
        : module === "filter"
          ? { zh: "算法延迟：IIR biquad 通常 0 samples", en: "Algorithmic latency: IIR biquad is usually 0 samples" }
          : module === "compressor"
            ? {
                zh: "算法延迟：普通压缩器通常 0 samples；只有 lookahead 才额外延迟",
                en: "Algorithmic latency: a basic compressor is usually 0 samples; lookahead adds latency"
              }
            : { zh: "算法延迟：0 samples", en: "Algorithmic latency: 0 samples" };
    const colorAmount =
      module === "waveshaper"
        ? secondaryAmount * 0.92 + primaryAmount * 0.18
        : module === "delay"
          ? secondaryAmount * 0.68
          : module === "filter"
            ? primaryAmount * 0.5 + secondaryAmount * 0.18
            : module === "compressor"
              ? primaryAmount * 0.42 + secondaryAmount * 0.22
              : primaryAmount * 0.42;
    const rawAliasRisk = module === "waveshaper" ? clamp(secondaryAmount * primary * 0.95, 0, 100) : 0;
    const aliasRisk = module === "waveshaper" ? clamp(rawAliasRisk / oversampling, 0, 100) : 0;
    const automationRisk =
      zipperRisk > 50
        ? { zh: "高：容易 zipper noise", en: "high: zipper noise risk" }
        : zipperRisk > 22
          ? { zh: "中：适合多数参数", en: "medium: suitable for most parameters" }
          : { zh: "低：更平滑但响应慢", en: "low: smoother but slower" };
    const primaryLabel =
      module === "gain"
        ? {
            zh: `增益：${getGainDb(primaryAmount).toFixed(1)} dB`,
            en: `Gain: ${getGainDb(primaryAmount).toFixed(1)} dB`
          }
        : module === "filter"
          ? {
              zh: `Cutoff：${getFilterCutoffHz(primary).toLocaleString("en-US")} Hz`,
              en: `Cutoff: ${getFilterCutoffHz(primary).toLocaleString("en-US")} Hz`
            }
          : module === "delay"
            ? {
                zh: `Delay time：${getDelayTimeMs(primary)} ms`,
                en: `Delay time: ${getDelayTimeMs(primary)} ms`
              }
            : module === "compressor"
              ? {
                  zh: `Threshold：${getCompressorThresholdDb(primary).toFixed(1)} dBFS`,
                  en: `Threshold: ${getCompressorThresholdDb(primary).toFixed(1)} dBFS`
                }
              : {
                  zh: `非线性混合：${primaryAmount}%`,
                  en: `Nonlinear mix: ${primaryAmount}%`
                };
    const secondaryLabel =
      module === "gain"
        ? {
            zh: `声像偏移：${getPanOffset(secondary).toFixed(2)}`,
            en: `Pan offset: ${getPanOffset(secondary).toFixed(2)}`
          }
        : module === "filter"
          ? {
              zh: `Q / 共振：${getFilterQ(secondary).toFixed(1)}`,
              en: `Q / resonance: ${getFilterQ(secondary).toFixed(1)}`
            }
          : module === "delay"
            ? {
                zh: `Feedback：${secondaryAmount}%`,
                en: `Feedback: ${secondaryAmount}%`
              }
            : module === "compressor"
              ? {
                  zh: `Ratio：${getCompressorRatio(secondary).toFixed(1)}:1`,
                  en: `Ratio: ${getCompressorRatio(secondary).toFixed(1)}:1`
                }
              : {
                  zh: `Drive：${getWaveshaperDrive(secondary).toFixed(1)}x`,
                  en: `Drive: ${getWaveshaperDrive(secondary).toFixed(1)}x`
                };

    return { aliasRisk, automationRisk, colorAmount, latencyLabel, primaryLabel, rawAliasRisk, secondaryLabel, zipperRisk };
  }, [module, oversampling, primaryAmount, secondaryAmount, smoothing]);

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
              language={language}
              module={module}
              oversampling={oversampling}
              primary={primaryAmount}
              secondary={secondaryAmount}
              smoothing={smoothing}
            />
          </div>

          <aside className="audio-plugin-panel">
            <div className="codec-mode-concepts-header">
              <span>{moduleLabels[module][language]}</span>
              <strong>{moduleDescriptions[module][language]}</strong>
            </div>
            <label className="sound-lab-control">
              <span>{metrics.primaryLabel[language]}</span>
              <input aria-label={language === "zh" ? "主参数" : "Primary parameter"} max="100" min="0" step="5" type="range" value={primaryAmount} onChange={(event) => setPrimaryAmount(Number(event.target.value))} />
            </label>
            <label className="sound-lab-control">
              <span>{language === "zh" ? `参数平滑：${smoothing}%` : `Parameter smoothing: ${smoothing}%`}</span>
              <input aria-label={language === "zh" ? "参数平滑" : "Parameter smoothing"} max="100" min="0" step="5" type="range" value={smoothing} onChange={(event) => setSmoothing(Number(event.target.value))} />
            </label>
            <label className="sound-lab-control">
              <span>{metrics.secondaryLabel[language]}</span>
              <input aria-label={language === "zh" ? "模块参数" : "Module parameter"} max="100" min="0" step="5" type="range" value={secondaryAmount} onChange={(event) => setSecondaryAmount(Number(event.target.value))} />
            </label>
            {module === "waveshaper" ? (
              <label className="sound-lab-control">
                <span>{language === "zh" ? `Oversampling：${oversampling}x` : `Oversampling: ${oversampling}x`}</span>
                <input aria-label="Oversampling" max="4" min="1" step="1" type="range" value={oversampling} onChange={(event) => setOversampling(Number(event.target.value))} />
              </label>
            ) : null}
            <div className="audio-plugin-metrics">
              <strong>{language === "zh" ? `模块关注点：${getModuleFocus(module, language)}` : `Module focus: ${getModuleFocus(module, language)}`}</strong>
              <strong>{language === "zh" ? `Zipper noise 风险：${metrics.zipperRisk.toFixed(0)}%` : `Zipper-noise risk: ${metrics.zipperRisk.toFixed(0)}%`}</strong>
              <strong>{language === "zh" ? `音色变化量：${metrics.colorAmount.toFixed(0)}%` : `Tone-color change: ${metrics.colorAmount.toFixed(0)}%`}</strong>
              <strong>{metrics.latencyLabel[language]}</strong>
              {module === "waveshaper" ? (
                <>
                  <strong>{language === "zh" ? `未过采样混叠风险：${metrics.rawAliasRisk.toFixed(0)}%` : `Pre-oversampling aliasing risk: ${metrics.rawAliasRisk.toFixed(0)}%`}</strong>
                  <strong>{language === "zh" ? `过采样后残留混叠风险：${metrics.aliasRisk.toFixed(0)}%` : `Residual aliasing risk after oversampling: ${metrics.aliasRisk.toFixed(0)}%`}</strong>
                </>
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
