import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import type { Language } from "../content/knowledge";

type SpeechEnhancementLabProps = {
  language: Language;
  onBack: () => void;
  onBackToDetails?: () => void;
};

type EnhancementMode = "aec" | "ns" | "agc" | "beamforming" | "dereverb";
type WaveProcessing = Partial<Record<EnhancementMode, number>>;
type ProcessingStrengths = Record<EnhancementMode, number>;
type SocFlow = {
  name: string;
  summary: Record<Language, string>;
  flow: {
    label: string;
    detail: Record<Language, string>;
  }[];
  chips: {
    model: string;
    zh: string;
    en: string;
  }[];
  note: Record<Language, string>;
  stages: Record<Language, string>[];
};

const flowModes: EnhancementMode[] = ["beamforming", "aec", "ns", "dereverb", "agc"];
const demoNoiseLevel = 45;
const demoEchoLevel = 55;
const demoReverbLevel = 35;
const defaultProcessingStrengths: ProcessingStrengths = {
  beamforming: 65,
  aec: 65,
  ns: 65,
  dereverb: 65,
  agc: 65
};

const modeLabels: Record<EnhancementMode, Record<Language, string>> = {
  beamforming: { zh: "多麦波束成形", en: "Beamforming" },
  aec: { zh: "AEC 回声消除", en: "AEC" },
  ns: { zh: "NS / ANR 降噪", en: "NS / ANR" },
  dereverb: { zh: "去混响", en: "Dereverb" },
  agc: { zh: "AGC 自动增益", en: "AGC" }
};

const modeDescriptions: Record<EnhancementMode, Record<Language, string>> = {
  aec: {
    zh: "AEC 利用 AO/Mixer 播放回采参考估计回声路径，再从麦克风信号中减掉扬声器回声；强度滑块主要改变回声尾巴。",
    en: "AEC uses an AO/Mixer playback reference to estimate the echo path and subtract speaker echo; the strength slider mainly changes the echo tail."
  },
  ns: {
    zh: "NS/ANR 估计背景噪声频谱，在压低噪声和保护语音辅音细节之间做取舍；强度滑块主要改变噪声纹理。",
    en: "NS/ANR estimates the background-noise spectrum and trades off reduction against speech detail; the strength slider mainly changes the noise texture."
  },
  agc: {
    zh: "AGC 根据语音电平包络缓慢调节增益，把过小的语音拉高、过大的语音限制住；强度滑块主要改变包络稳定度。",
    en: "AGC slowly adjusts gain from the speech-level envelope, raising quiet speech and limiting loud speech; the slider mainly changes envelope stability."
  },
  beamforming: {
    zh: "多麦波束成形只在 2 Mic 或 4 Mic 阵列下启用，先用到达时间差或相位差做 DOA 声源定位，再做定向拾音增强目标方向。",
    en: "Beamforming is enabled only with 2-mic or 4-mic arrays. It first uses arrival-time or phase differences for DOA localization, then applies directional pickup toward the target."
  },
  dereverb: {
    zh: "去混响减弱房间后期反射造成的拖尾，让语音更近；强度滑块主要改变反射尾巴长度和密度。",
    en: "Dereverberation reduces late room-reflection tails so speech sounds closer; the slider mainly changes tail length and density."
  }
};

const modeLimits: Record<EnhancementMode, Record<Language, string>> = {
  aec: {
    zh: "边界：AEC 依赖时间对齐的播放 reference；双讲或延迟漂移时，过强收敛可能误削近端语音。",
    en: "Limit: AEC depends on a time-aligned playback reference; during double-talk or delay drift, aggressive adaptation can suppress near-end speech."
  },
  ns: {
    zh: "边界：更强抑制不等于更好；过强会损伤辅音和高频细节，并引入金属音或抽吸声。",
    en: "Limit: stronger suppression is not always better; aggressive settings can damage consonants and high-frequency detail, causing metallic sound or pumping."
  },
  agc: {
    zh: "边界：attack/release 决定跟随速度；过快会抽吸、过慢会跟不上变化，增益过高仍需 limiter 防止削波。",
    en: "Limit: attack/release set tracking speed; too fast causes pumping, too slow misses level changes, and excessive gain still needs a limiter to prevent clipping."
  },
  beamforming: {
    zh: "边界：至少需要两路同步麦克风；单麦没有空间差分，更多通道通常增加计算量，抑制效果和延迟还取决于阵列结构与算法。",
    en: "Limit: at least two synchronized microphones are required; a single mic has no spatial difference. More channels usually add compute, while suppression and latency also depend on array geometry and the algorithm."
  },
  dereverb: {
    zh: "边界：去混响主要压低后期拖尾；过强会削弱自然共鸣和词尾，声音变薄发干。",
    en: "Limit: dereverb mainly reduces late tails; aggressive settings can remove natural resonance and word endings, making speech thin and dry."
  }
};

const sourceReferenceRows = [
  {
    title: "AEC",
    keyword: "NLMS adaptive filter",
    pseudo: "e = mic - dot(w, ref); w += mu * e * ref / (epsilon + dot(ref, ref))",
    note: {
      zh: "源码关键词：NLMS adaptive filter、delay estimation、double-talk detection。重点看播放 reference 如何对齐麦克风回声。",
      en: "Source keywords: NLMS adaptive filter, delay estimation, double-talk detection. Focus on how playback reference is aligned to mic echo."
    }
  },
  {
    title: "NS / ANR",
    keyword: "STFT spectral subtraction",
    pseudo: "X[k] = STFT(x); G[k] = max(floor, 1 - N[k] / |X[k]|); y = ISTFT(G * X)",
    note: {
      zh: "源码关键词：STFT spectral subtraction、Wiener filter、noise estimator。重点看噪声谱估计和最小增益地板。",
      en: "Source keywords: STFT spectral subtraction, Wiener filter, noise estimator. Focus on noise spectrum estimation and gain floor."
    }
  },
  {
    title: "AGC",
    keyword: "envelope follower gain smoothing",
    pseudo: "rms = sqrt(mean(x^2)); targetGain = target / rms; gain = smooth(targetGain)",
    note: {
      zh: "源码关键词：envelope follower、attack/release、limiter。重点看增益平滑，避免抽吸和削波。",
      en: "Source keywords: envelope follower, attack/release, limiter. Focus on gain smoothing to avoid pumping and clipping."
    }
  },
  {
    title: "EQ / Filter",
    keyword: "biquad filter",
    pseudo: "y[n] = b0*x[n] + b1*x[n-1] + b2*x[n-2] - a1*y[n-1] - a2*y[n-2]",
    note: {
      zh: "源码关键词：biquad filter、IIR、frequency response。重点看系数如何决定低通、高通、峰值 EQ。",
      en: "Source keywords: biquad filter, IIR, frequency response. Focus on how coefficients set low-pass, high-pass, and peaking EQ."
    }
  }
] satisfies Array<{
  keyword: string;
  note: Record<Language, string>;
  pseudo: string;
  title: string;
}>;

const sdkRows = [
  {
    module: "AI",
    zh: "Audio Input，麦克风采集、DMA、驱动 ring buffer",
    en: "Audio input, microphone capture, DMA, and driver ring buffer"
  },
  {
    module: "AO",
    zh: "Audio Output，播放 PCM，同时给 AEC 提供 reference",
    en: "Audio output, playback PCM, and AEC reference source"
  },
  {
    module: "VQE / 3A",
    zh: "语音增强模块，常包含波束成形、AEC、NS/ANR、去混响和 AGC",
    en: "Voice quality enhancement, often containing beamforming, AEC, NS/ANR, dereverberation, and AGC"
  },
  {
    module: "AENC / ASR",
    zh: "增强后的 PCM 送编码、通话、唤醒识别或录音",
    en: "Enhanced PCM goes to encoding, calls, wake/ASR, or recording"
  }
] as const;

const socFlows: SocFlow[] = [
  {
    name: "Rockchip RK Media / VQE",
    summary: {
      zh: "常见边界是 AI 采集、AO 播放回采、VQE/3A 做语音增强、AENC 或 ASR 消费增强后 PCM。",
      en: "A common boundary is AI capture, AO playback reference, VQE/3A enhancement, then AENC or ASR consuming enhanced PCM."
    },
    flow: [
      { label: "Mic / Codec", detail: { zh: "PDM / I2S / ADC", en: "PDM / I2S / ADC" } },
      { label: "AI", detail: { zh: "DMA + ring buffer", en: "DMA + ring buffer" } },
      { label: "VQE / 3A", detail: { zh: "BF / AEC / ANR / AGC", en: "BF / AEC / ANR / AGC" } },
      { label: "AENC / ASR", detail: { zh: "编码、唤醒、识别", en: "encode, wake, ASR" } },
      { label: "AO Ref", detail: { zh: "播放回采给 AEC", en: "playback ref to AEC" } }
    ],
    chips: [
      { model: "RV1103B / RV1106B", zh: "适合低功耗 IPC、门铃、语音唤醒和边缘 AI 语音前端。", en: "Good for low-power IPC, doorbells, wake-word, and edge-AI voice frontends." },
      { model: "RV1126B / RV1109", zh: "适合更高算力的视频设备、双向语音和多算法并行。", en: "Good for higher-compute video devices, two-way audio, and parallel algorithms." },
      { model: "RK3568", zh: "适合网关、工业屏、Linux 应用层音频处理和多媒体系统。", en: "Good for gateways, industrial panels, Linux user-space audio processing, and multimedia systems." }
    ],
    note: {
      zh: "公开资料显示 RV1103B/RV1106B 面向 AI IPC，并列出 AI 降噪、语音识别、音频编解码等能力；具体 VQE 接口以板级 SDK 为准。",
      en: "Public material positions RV1103B/RV1106B for AI IPC and lists AI noise reduction, speech recognition, and audio codec capabilities; exact VQE APIs depend on the board SDK."
    },
    stages: [
      { zh: "Mic / Codec / PDM / I2S -> AI 通道，驱动和 DMA 写入 ring buffer。", en: "Mic / codec / PDM / I2S -> AI channel, with driver and DMA writing a ring buffer." },
      { zh: "AI 输出 10-20 ms PCM 帧，配置 VQE 参数后进入 AEC、ANR、AGC 等处理。", en: "AI outputs 10-20 ms PCM frames, then VQE parameters route frames through AEC, ANR, AGC, and similar processing." },
      { zh: "AO / Mixer 的播放 PCM 作为 AEC reference，需要做延迟估计和时间对齐。", en: "AO / Mixer playback PCM is used as AEC reference and needs delay estimation and time alignment." },
      { zh: "增强后 PCM 送 AENC 编码、网络传输、本地录音或唤醒/ASR。", en: "Enhanced PCM goes to AENC, networking, local recording, or wake/ASR." }
    ]
  },
  {
    name: "SigmaStar MI Audio",
    summary: {
      zh: "常见模块名围绕 MI_AI、MI_AO、MI_AENC、Audio Process / VQE，处理链路和 Rockchip 边界类似。",
      en: "Common names revolve around MI_AI, MI_AO, MI_AENC, and Audio Process / VQE, with boundaries similar to Rockchip-style pipelines."
    },
    flow: [
      { label: "Mic / I2S", detail: { zh: "输入设备与通道", en: "input device + channel" } },
      { label: "MI_AI", detail: { zh: "采集 PCM 帧", en: "capture PCM frames" } },
      { label: "Audio Process", detail: { zh: "AEC / ANR / AGC", en: "AEC / ANR / AGC" } },
      { label: "MI_AENC", detail: { zh: "编码或网络", en: "encode or network" } },
      { label: "MI_AO Ref", detail: { zh: "播放回采", en: "playback reference" } }
    ],
    chips: [
      { model: "SSC338Q / SSC338G", zh: "适合 IPC、双向对讲、摄像头语音增强和本地 AI 处理。", en: "Good for IPC, two-way talk, camera voice enhancement, and local AI processing." },
      { model: "SSC337 / SSC335", zh: "适合成本敏感型摄像头、基础采集和编码链路。", en: "Good for cost-sensitive cameras with basic capture and encoding paths." },
      { model: "SSD202D / SSD20x", zh: "适合低成本 Linux 音频、屏显控制和轻量语音交互。", en: "Good for low-cost Linux audio, display-control products, and lightweight voice interaction." }
    ],
    note: {
      zh: "SigmaStar MI SDK 常见 AI/AO/AENC/Audio Process 边界明确，但不同授权包里的 AEC、ANR、AGC、阵列算法可能差异较大，选型时要确认 SDK 示例和库授权。",
      en: "SigmaStar MI SDK commonly exposes AI/AO/AENC/Audio Process-style boundaries, but AEC, ANR, AGC, and array libraries can vary by licensed SDK package; confirm samples and library authorization during selection."
    },
    stages: [
      { zh: "麦克风进入 MI_AI，按采样率、位宽、通道数创建音频输入设备和通道。", en: "Microphones enter MI_AI, creating audio input devices and channels by sample rate, bit depth, and channel count." },
      { zh: "Audio Process 对 AI 帧做 AEC、ANR/NS、AGC 等增强，参数通常绑定到 AI 通道。", en: "Audio Process enhances AI frames with AEC, ANR/NS, AGC, and related processing, usually bound to the AI channel." },
      { zh: "MI_AO 负责播放，回采 reference 给 AEC；增强后送 MI_AENC、上层算法或网络。", en: "MI_AO handles playback and provides AEC reference; enhanced audio goes to MI_AENC, upper algorithms, or networking." },
      { zh: "多麦方案会在 AI 后加入阵列/波束成形，再进入单通道增强或编码。", en: "Multi-mic products add array or beamforming after AI, then continue to single-channel enhancement or encoding." }
    ]
  },
  {
    name: "Ingenic IMP Audio",
    summary: {
      zh: "常见边界是 IMP Audio 输入输出，加 AGC、NS、AEC 等接口，最后接编码、录像、对讲或识别。",
      en: "A common boundary is IMP Audio input/output plus AGC, NS, AEC-style interfaces, then encoding, recording, intercom, or recognition."
    },
    flow: [
      { label: "Codec / DMIC", detail: { zh: "模拟或数字麦", en: "analog or digital mic" } },
      { label: "IMP AI", detail: { zh: "内核 buffer 取帧", en: "read frames from buffer" } },
      { label: "IMP Algo", detail: { zh: "NS / AGC / AEC", en: "NS / AGC / AEC" } },
      { label: "Encode / App", detail: { zh: "录像、对讲、识别", en: "record, talk, ASR" } },
      { label: "IMP AO Ref", detail: { zh: "播放参考", en: "playback reference" } }
    ],
    chips: [
      { model: "T41", zh: "适合 AI 摄像头、IPC、音频 3A、DMIC 和多麦算法验证。", en: "Good for AI cameras, IPC, audio 3A, DMIC, and multi-mic algorithm validation." },
      { model: "T31 / T40", zh: "适合经典 IPC、低功耗采集、对讲和录像音轨。", en: "Good for classic IPC, low-power capture, intercom, and recorded audio tracks." },
      { model: "X2000 / X2600", zh: "适合 Linux 应用处理、网关、人机交互和更复杂的用户态音频链路。", en: "Good for Linux application processing, gateways, HMI, and more complex user-space audio chains." }
    ],
    note: {
      zh: "公开资料显示 T41 支持音频 3A、DMIC，君正 Mert 音频算法库覆盖降噪、回声消除、多麦增强等方向；具体接口和算力预算仍需按 SDK 与板型确认。",
      en: "Public material lists T41 audio 3A and DMIC support, and Ingenic's Mert audio algorithm library covers denoise, echo cancellation, multi-mic enhancement, and related functions; exact APIs and compute budget still depend on SDK and board design."
    },
    stages: [
      { zh: "Codec / I2S / PDM 音频进入 IMP Audio AI，按帧从内核 buffer 取 PCM。", en: "Codec / I2S / PDM audio enters IMP Audio AI, and PCM frames are read from kernel buffers." },
      { zh: "根据产品启用 NS、AGC、AEC；AEC 同样需要播放侧 reference 和稳定延迟。", en: "Products enable NS, AGC, and AEC as needed; AEC still requires playback reference and stable delay." },
      { zh: "处理后 PCM 可以送编码、录像文件音轨、语音对讲或本地识别。", en: "Processed PCM can go to encoding, video-file audio tracks, voice intercom, or local recognition." },
      { zh: "算力较小的芯片通常会限制采样率、帧长、算法强度和多麦通道数。", en: "Lower-power chips often constrain sample rate, frame size, algorithm strength, and number of microphone channels." }
    ]
  }
];

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function getSelectedProcessing(mode: EnhancementMode, strength: number, micCount: number): WaveProcessing {
  if (mode === "beamforming" && micCount <= 1) {
    return {};
  }

  return { [mode]: strength / 100 };
}

function gaussian(value: number, center: number, width: number) {
  return Math.exp(-((value - center) ** 2) / width);
}

function residualScales(processing: WaveProcessing, micCount: number) {
  const beam = micCount > 1 ? (processing.beamforming ?? 0) * (micCount === 4 ? 1 : 0.72) : 0;
  return {
    noise: (1 - (processing.ns ?? 0) * 0.93) * (1 - beam * 0.48),
    echo: 1 - (processing.aec ?? 0) * 0.94,
    reverb: (1 - (processing.dereverb ?? 0) * 0.9) * (1 - beam * 0.18)
  };
}

function speechEnvelopeAt(ratio: number) {
  return clamp(
    0.18 +
      gaussian(ratio, 0.18, 0.006) * 0.58 +
      gaussian(ratio, 0.38, 0.014) * 0.92 +
      gaussian(ratio, 0.62, 0.01) * 0.72 +
      gaussian(ratio, 0.82, 0.018) * 0.46,
    0.16,
    1
  );
}

function speechCarrierAt(ratio: number) {
  return (
    Math.sin(ratio * Math.PI * 9.2) * 0.68 +
    Math.sin(ratio * Math.PI * 18.6 + 0.54) * 0.24 +
    Math.sin(ratio * Math.PI * 31.2 + 1.15) * 0.1
  );
}

function createSpeechWavePath({
  centerY,
  echoLevel,
  enhanced,
  micCount,
  mode,
  noiseLevel,
  processing,
  reverbLevel,
  pathWidth = 656,
  startX = 42,
  strength
}: {
  centerY?: number;
  echoLevel: number;
  enhanced: boolean;
  micCount: number;
  mode: EnhancementMode;
  noiseLevel: number;
  pathWidth?: number;
  processing?: WaveProcessing;
  reverbLevel: number;
  startX?: number;
  strength: number;
}) {
  const points = 512;
  const y = centerY ?? (enhanced ? 282 : 150);
  const activeProcessing = enhanced ? (processing ?? getSelectedProcessing(mode, strength, micCount)) : {};
  const noise = noiseLevel / 100;
  const echo = echoLevel / 100;
  const reverb = reverbLevel / 100;
  const isMultiMic = micCount > 1;
  const beamformingAmount = isMultiMic ? (activeProcessing.beamforming ?? 0) * (micCount === 4 ? 1 : 0.72) : 0;
  const agcAmount = activeProcessing.agc ?? 0;
  const residual = residualScales(activeProcessing, micCount);
  const noiseScale = noise * residual.noise;
  const echoScale = echo * residual.echo;
  const reverbScale = reverb * residual.reverb;
  const targetEnvelope = 0.58;
  const speechPresenceBoost = 1 + beamformingAmount * 0.14;

  return Array.from({ length: points }, (_, index) => {
    const ratio = index / (points - 1);
    const pointX = startX + ratio * pathWidth;
    const speechEnvelope = speechEnvelopeAt(ratio);
    const leveledEnvelope = speechEnvelope + (targetEnvelope - speechEnvelope) * agcAmount * 0.9;
    const speech = speechCarrierAt(ratio);
    const noiseTexture =
      Math.sin(ratio * Math.PI * 92 + 0.4) * 0.52 +
      Math.sin(ratio * Math.PI * 143 + 1.3) * 0.3 +
      Math.sin(ratio * Math.PI * 211 + 0.2) * 0.14;
    const delayedRatio = Math.max(0, ratio - 0.12);
    const echoTail = delayedRatio === 0 ? 0 : Math.sin(delayedRatio * Math.PI * 14 + 0.3) * (0.6 + 0.3 * Math.sin(delayedRatio * Math.PI * 3));
    const lateRatio = Math.max(0, ratio - 0.18);
    const reverbTail = ratio <= 0.18 ? 0 : speechCarrierAt(lateRatio) * speechEnvelopeAt(lateRatio) * Math.exp(-lateRatio * 1.55);
    const value =
      speech * speechEnvelope * speechPresenceBoost +
      noiseTexture * noiseScale * 0.52 +
      echoTail * echoScale * 0.92 +
      reverbTail * reverbScale * 0.58;
    const agcGain = leveledEnvelope / speechEnvelope;
    const pointY = y - value * agcGain * 20;

    return `${index === 0 ? "M" : "L"} ${pointX.toFixed(1)} ${pointY.toFixed(1)}`;
  }).join(" ");
}

function EnhancementFlowChart({
  language,
  micCount,
  mode
}: {
  language: Language;
  micCount: number;
  mode: EnhancementMode;
}) {
  const isMultiMic = micCount > 1;
  const micLabel =
    language === "zh"
      ? micCount === 1
        ? "1 Mic 单麦"
        : `${micCount} Mic 阵列`
      : micCount === 1
        ? "1 Mic single"
        : `${micCount} Mic array`;
  const nodes = [
    { id: "mic", label: "Mic / PDM / I2S", sub: { zh: micLabel, en: micLabel }, x: 46, y: 76 },
    { id: "ai", label: "AI", sub: { zh: "ring buffer", en: "ring buffer" }, x: 192, y: 76 },
    {
      id: "beamforming",
      label: "Beamforming",
      sub: { zh: isMultiMic ? "DOA + 定向拾音" : "单麦跳过", en: isMultiMic ? "DOA + pickup" : "bypassed" },
      x: 338,
      y: 76
    },
    { id: "aec", label: "AEC", sub: { zh: "消回声", en: "echo cancel" }, x: 484, y: 76 },
    { id: "ns", label: "NS / ANR", sub: { zh: "降噪", en: "denoise" }, x: 192, y: 220 },
    { id: "dereverb", label: "Dereverb", sub: { zh: "去混响", en: "tail reduce" }, x: 338, y: 220 },
    { id: "agc", label: "AGC", sub: { zh: "自动增益", en: "auto gain" }, x: 484, y: 220 },
    { id: "out", label: "AENC / ASR", sub: { zh: "编码或识别", en: "encode or ASR" }, x: 484, y: 350 }
  ] as const;

  return (
    <svg
      aria-label={language === "zh" ? "语音增强处理流程图" : "Speech enhancement processing flow"}
      className="speech-enhancement-flow-chart"
      role="img"
      viewBox="0 0 720 470"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <marker id="speechLabArrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
          <path d="M0 0 8 4 0 8Z" fill="#dcece8" />
        </marker>
      </defs>
      <rect className="lab-diagram-bg" height="470" rx="16" width="720" />
      <text className="speech-lab-chart-title" x="44" y="42">
        {language === "zh" ? "SoC SDK 风格：采集侧 VQE / 3A 处理链路" : "SoC SDK style: capture-side VQE / 3A chain"}
      </text>
      <path className="speech-lab-flow-link" d="M 164 117 H 192" />
      <path className={isMultiMic ? "speech-lab-flow-link" : "speech-lab-flow-link muted"} d="M 310 117 H 338" />
      <path className={isMultiMic ? "speech-lab-flow-link" : "speech-lab-flow-link muted"} d="M 456 117 H 484" />
      {!isMultiMic ? (
        <>
          <path className="speech-lab-flow-link bypass" d="M 310 94 C 360 64 434 64 484 94" />
          <text className="speech-lab-bypass-label" x="397" y="72">
            {language === "zh" ? "单麦无空间信息，跳过多麦增强" : "Single mic has no spatial cue, beamforming bypassed"}
          </text>
        </>
      ) : null}
      <path className="speech-lab-flow-link" d="M 550 158 V 198 H 251 V 220" />
      <path className="speech-lab-flow-link" d="M 310 261 H 338" />
      <path className="speech-lab-flow-link" d="M 456 261 H 484" />
      <path className="speech-lab-flow-link" d="M 550 302 V 350" />
      <g className="speech-lab-reference">
        <rect height="76" rx="12" width="170" x="42" y="350" />
        <text x="127" y="382">AO / Mixer</text>
        <text x="127" y="406">{language === "zh" ? "播放 reference" : "playback reference"}</text>
      </g>
      <path className="speech-lab-reference-link" d="M 212 386 C 352 386 388 144 484 116" />
      <text className="speech-lab-note" x="238" y="380">
        {language === "zh" ? "AEC 对齐播放参考和麦克风输入" : "AEC aligns reference and mic input"}
      </text>
      <g className="speech-lab-mic-array" aria-hidden="true">
        {Array.from({ length: micCount }, (_, index) => (
          <circle
            cx={84 + index * (micCount === 4 ? 14 : 22)}
            cy="170"
            key={index}
            r="5"
          />
        ))}
        <text x="105" y="190">{micLabel}</text>
      </g>
      {nodes.map((node) => (
        <g
          className={
            `${(mode === "aec" && node.id === "aec") ||
            (mode === "ns" && node.id === "ns") ||
            (mode === "agc" && node.id === "agc") ||
            (mode === "beamforming" && node.id === "beamforming") ||
            (mode === "dereverb" && node.id === "dereverb")
              ? "speech-lab-node active"
              : "speech-lab-node"}${node.id === "beamforming" && !isMultiMic ? " disabled" : ""}`
          }
          key={node.id}
        >
          <rect height="82" rx="12" width="118" x={node.x} y={node.y} />
          <text className="speech-lab-node-title" x={node.x + 59} y={node.y + 32}>{node.label}</text>
          <text className="speech-lab-node-sub" x={node.x + 59} y={node.y + 56}>{node.sub[language]}</text>
        </g>
      ))}
      <text className="speech-lab-sdk-label" x="44" y="452">
        {language === "zh" ? "Rockchip VQE / SigmaStar Audio Process / Ingenic IMP Audio：命名不同，边界类似" : "Rockchip VQE / SigmaStar Audio Process / Ingenic IMP Audio: different names, similar boundaries"}
      </text>
    </svg>
  );
}

function SocFlowDiagram({
  flow,
  language,
  name
}: {
  flow: SocFlow["flow"];
  language: Language;
  name: string;
}) {
  const mainFlow = flow.slice(0, 4);
  const reference = flow[4];
  const markerId = `socArrow-${name.replace(/\W/g, "-")}`;

  return (
    <svg
      aria-label={`${name} ${language === "zh" ? "音频处理流程图" : "audio processing flow"}`}
      className="speech-soc-flow-chart"
      role="img"
      viewBox="0 0 520 238"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <marker id={markerId} markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
          <path d="M0 0 8 4 0 8Z" fill="#dcece8" />
        </marker>
      </defs>
      <rect className="speech-soc-flow-bg" height="238" rx="12" width="520" />
      <text className="speech-soc-flow-title" x="24" y="32">{language === "zh" ? "典型处理链路" : "Typical processing chain"}</text>
      {mainFlow.map((step, index) => {
        const x = 24 + index * 122;

        return (
          <g className="speech-soc-flow-node" key={step.label}>
            <rect height="72" rx="10" width="100" x={x} y="64" />
            <text className="speech-soc-flow-node-title" x={x + 50} y="92">{step.label}</text>
            <text className="speech-soc-flow-node-sub" x={x + 50} y="116">{step.detail[language]}</text>
          </g>
        );
      })}
      <path className="speech-soc-flow-link" d="M 124 100 H 146" markerEnd={`url(#${markerId})`} />
      <path className="speech-soc-flow-link" d="M 246 100 H 268" markerEnd={`url(#${markerId})`} />
      <path className="speech-soc-flow-link" d="M 368 100 H 390" markerEnd={`url(#${markerId})`} />
      {reference ? (
        <>
          <g className="speech-soc-flow-node reference">
            <rect height="62" rx="10" width="132" x="40" y="158" />
            <text className="speech-soc-flow-node-title" x="106" y="183">{reference.label}</text>
            <text className="speech-soc-flow-node-sub" x="106" y="205">{reference.detail[language]}</text>
          </g>
          <path className="speech-soc-flow-reference-link" d="M 172 189 C 250 188 284 132 322 101" markerEnd={`url(#${markerId})`} />
        </>
      ) : null}
    </svg>
  );
}

function WaveComparison({
  echoLevel,
  language,
  micCount,
  mode,
  noiseLevel,
  reverbLevel,
  strength
}: {
  echoLevel: number;
  language: Language;
  micCount: number;
  mode: EnhancementMode;
  noiseLevel: number;
  reverbLevel: number;
  strength: number;
}) {
  const rawPath = createSpeechWavePath({ echoLevel, enhanced: false, micCount, mode, noiseLevel, reverbLevel, strength });
  const enhancedPath = createSpeechWavePath({ echoLevel, enhanced: true, micCount, mode, noiseLevel, reverbLevel, strength });

  return (
    <svg
      aria-label={language === "zh" ? "语音增强前后波形对比" : "Speech enhancement waveform comparison"}
      className="speech-enhancement-wave-chart"
      role="img"
      viewBox="0 0 740 360"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect className="lab-diagram-bg" height="360" rx="16" width="740" />
      <line className="lab-axis" x1="42" x2="698" y1="150" y2="150" />
      <line className="lab-axis" x1="42" x2="698" y1="282" y2="282" />
      <text className="speech-lab-chart-title" x="44" y="44">
        {language === "zh" ? "原始采集 vs 增强后 PCM" : "Raw capture vs enhanced PCM"}
      </text>
      <path className="speech-raw-wave" data-testid="speech-raw-wave" d={rawPath} />
      <path className="speech-enhanced-wave" data-testid="speech-enhanced-wave" d={enhancedPath} />
      <text className="speech-lab-axis-label" x="54" y="112">{language === "zh" ? "原始：近端语音 + 噪声 + 回声 + 混响" : "Raw: speech + noise + echo + reverb"}</text>
      <text className="speech-lab-axis-label" x="54" y="244">{language === "zh" ? "增强后：保留语音，压低干扰" : "Enhanced: speech preserved, interference reduced"}</text>
      <text className="speech-lab-note" x="54" y="328">
        {language === "zh" ? "示意图表达趋势，不代表具体算法输出" : "Model trends, not real algorithm output"}
      </text>
    </svg>
  );
}

function AlgorithmStageWaveChart({
  echoLevel,
  language,
  micCount,
  noiseLevel,
  reverbLevel,
  strengths
}: {
  echoLevel: number;
  language: Language;
  micCount: number;
  noiseLevel: number;
  reverbLevel: number;
  strengths: ProcessingStrengths;
}) {
  const aecStrength = strengths.aec / 100;
  const nsStrength = strengths.ns / 100;
  const dereverbStrength = strengths.dereverb / 100;
  const agcStrength = strengths.agc / 100;
  const stages = [
    {
      id: "raw",
      label: { zh: "原始采集", en: "Raw capture" },
      processing: {},
      enhanced: false,
      x: 54,
      y: 86
    },
    {
      id: "aec",
      label: { zh: "AEC 后", en: "After AEC" },
      processing: { aec: aecStrength },
      enhanced: true,
      x: 54,
      y: 154
    },
    {
      id: "ns",
      label: { zh: "NS / ANR 后", en: "After NS / ANR" },
      processing: { aec: aecStrength, ns: nsStrength },
      enhanced: true,
      x: 54,
      y: 222
    },
    {
      id: "dereverb",
      label: { zh: "去混响后", en: "After dereverb" },
      processing: { aec: aecStrength, ns: nsStrength, dereverb: dereverbStrength },
      enhanced: true,
      x: 54,
      y: 290
    },
    {
      id: "agc",
      label: { zh: "AGC 后", en: "After AGC" },
      processing: { aec: aecStrength, ns: nsStrength, dereverb: dereverbStrength, agc: agcStrength },
      enhanced: true,
      x: 54,
      y: 358
    }
  ] as const;

  return (
    <svg
      aria-label={language === "zh" ? "语音增强算法链路波形变化图" : "Speech enhancement algorithm-stage waveform chart"}
      className="speech-stage-wave-chart"
      role="img"
      viewBox="0 0 740 430"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect className="lab-diagram-bg" height="430" rx="16" width="740" />
      <text className="speech-lab-chart-title" x="44" y="42">
        {language === "zh" ? "算法链路中波形如何逐步变化" : "How the waveform changes through the algorithm chain"}
      </text>
      {stages.map((stage) => (
        <g className="speech-stage-row" key={stage.id}>
          <line className="lab-axis" x1="176" x2="700" y1={stage.y} y2={stage.y} />
          <text className="speech-lab-axis-label" x={stage.x} y={stage.y + 5}>{stage.label[language]}</text>
          <path
            className={`speech-stage-wave ${stage.id}`}
            data-testid={`speech-stage-${stage.id}`}
            d={createSpeechWavePath({
              centerY: stage.y,
              echoLevel,
              enhanced: stage.enhanced,
              micCount,
              mode: "aec",
              noiseLevel,
              pathWidth: 524,
              processing: stage.enhanced ? { beamforming: micCount > 1 ? strengths.beamforming / 100 : 0, ...stage.processing } : {},
              reverbLevel,
              startX: 176,
              strength: strengths.aec
            })}
          />
        </g>
      ))}
      <text className="speech-lab-note" x="54" y="410">
        {language === "zh"
          ? "累计示意：多麦预处理 → AEC → NS/ANR → 去混响 → AGC；单麦跳过多麦预处理。"
          : "Cumulative: array (if present) → AEC → NS/ANR → dereverb → AGC."}
      </text>
    </svg>
  );
}

export function SpeechEnhancementLab({ language, onBack, onBackToDetails }: SpeechEnhancementLabProps) {
  const [mode, setMode] = useState<EnhancementMode>("beamforming");
  const [strengths, setStrengths] = useState<ProcessingStrengths>(() => ({ ...defaultProcessingStrengths }));
  const [micCount, setMicCount] = useState(2);
  const strength = strengths[mode];
  const noiseLevel = demoNoiseLevel;
  const echoLevel = demoEchoLevel;
  const reverbLevel = demoReverbLevel;
  const availableModes = flowModes.filter((item) => item !== "beamforming" || micCount > 1);

  const residual = residualScales(getSelectedProcessing(mode, strength, micCount), micCount);
  const attenuation = (scale: number) => (-20 * Math.log10(scale)).toFixed(1);

  function handleMicCountChange(count: number) {
    setMicCount(count);
    if (count === 1 && mode === "beamforming") {
      setMode("aec");
    }
  }

  function handleStrengthChange(value: number) {
    setStrengths((current) => ({
      ...current,
      [mode]: value
    }));
  }

  return (
    <main className="speech-enhancement-page">
      <section className="sound-lab-hero" aria-labelledby="speech-enhancement-title">
        <div className="sound-lab-back-actions">
          <button className="sound-lab-back" type="button" onClick={onBack}>
            <ArrowLeft size={18} aria-hidden="true" />
            {language === "zh" ? "返回知识库" : "Back to knowledge base"}
          </button>
          {onBackToDetails ? <button className="sound-lab-back" type="button" onClick={onBackToDetails}>
            <ArrowLeft size={18} aria-hidden="true" />
            {language === "zh" ? "返回详细内容" : "Back to detailed content"}
          </button> : null}
        </div>
        <div>
          <span className="section-kicker">{language === "zh" ? "传统 DSP 实验" : "Traditional DSP lab"}</span>
          <h1 id="speech-enhancement-title">{language === "zh" ? "语音增强实验室" : "Speech Enhancement Lab"}</h1>
          <p>
            {language === "zh"
              ? "按嵌入式 SoC SDK 的模块边界理解波束成形、AEC、NS/ANR、去混响和 AGC 如何串成一条低延迟语音处理链。"
              : "Understand beamforming, AEC, NS/ANR, dereverberation, and AGC as a low-latency voice chain using embedded SoC SDK boundaries."}
          </p>
        </div>
      </section>

      <section
        aria-label={language === "zh" ? "语音增强实验台" : "Speech enhancement workbench"}
        className="speech-enhancement-workbench"
      >
        <div className="speech-enhancement-layout">
          <div className="speech-enhancement-flow-area">
            <EnhancementFlowChart language={language} micCount={micCount} mode={mode} />
            <div className="waveform-tabs speech-enhancement-tabs speech-enhancement-flow-tabs" role="group" aria-label={language === "zh" ? "语音增强模块" : "Speech enhancement modules"}>
              {availableModes.map((item) => (
                <button className={mode === item ? "active" : ""} key={item} type="button" onClick={() => setMode(item)}>
                  {modeLabels[item][language]}
                </button>
              ))}
            </div>
          </div>

          <div className="speech-enhancement-wave-control-row">
            <div className="speech-enhancement-visuals">
              <WaveComparison
                echoLevel={echoLevel}
                language={language}
                micCount={micCount}
                mode={mode}
                noiseLevel={noiseLevel}
                reverbLevel={reverbLevel}
                strength={strength}
              />
              <AlgorithmStageWaveChart
                echoLevel={echoLevel}
                language={language}
                micCount={micCount}
                noiseLevel={noiseLevel}
                reverbLevel={reverbLevel}
                strengths={strengths}
              />
              <section className="speech-wave-explain-card" aria-label={language === "zh" ? "强度如何影响波形" : "How strength affects the waveform"}>
                <h2>{language === "zh" ? "波形如何变化" : "How the waveform changes"}</h2>
                <ul>
                  <li>
                    {language === "zh"
                      ? "当前模块强度：只保存到选中的算法。上方对比图展示选中算法单独处理的趋势，链路图按 AEC、NS/ANR、去混响、AGC 的顺序累计显示。"
                      : "Current module strength is stored only for the selected algorithm. The comparison chart shows that selected module alone, while the chain chart accumulates AEC, NS/ANR, dereverb, then AGC."}
                  </li>
                  <li>
                    {language === "zh"
                      ? "演示输入固定包含噪声、回声和混响，用来观察各模块负责的干扰类型：AEC 处理延迟回声，NS/ANR 处理细碎噪声，去混响处理衰减拖尾。"
                      : "The demo input always contains noise, echo, and reverb so each module has a stable target: AEC handles delayed echo, NS/ANR handles fine noise, and dereverb handles decaying tails."}
                  </li>
                  <li>
                    {language === "zh"
                      ? "前级算法强度会传递到后级波形；后级算法强度不会回头改变前级波形。例如提高 NS/ANR 不会改变 AEC 后波形，但会改变 NS/ANR 后、去混响后和 AGC 后波形。"
                      : "Upstream strength propagates downstream; downstream strength never changes earlier rows. For example, raising NS/ANR leaves the AEC row unchanged but changes the NS/ANR, dereverb, and AGC rows."}
                  </li>
                </ul>
              </section>
              <section className="speech-principle-card" aria-label={language === "zh" ? "当前模式边界" : "Current-mode limits"}>
                <h2>{language === "zh" ? "当前模式边界" : "Current-mode limits"}</h2>
                <p>{modeLimits[mode][language]}</p>
              </section>
              <section className="speech-source-reference-card" aria-label={language === "zh" ? "算法源码参考" : "Algorithm source-code references"}>
                <h2>{language === "zh" ? "算法源码参考" : "Algorithm source references"}</h2>
                <div className="speech-source-reference-grid">
                  {sourceReferenceRows.map((row) => (
                    <article key={row.title}>
                      <h3>{row.title}</h3>
                      <strong>{`${row.title} ${language === "zh" ? "源码关键词" : "source keywords"}：${row.keyword}`}</strong>
                      <code>{row.pseudo}</code>
                      <p>{row.note[language]}</p>
                    </article>
                  ))}
                </div>
              </section>
            </div>

            <aside className="speech-enhancement-panel">
              <div className="codec-mode-concepts-header">
                <span>{modeLabels[mode][language]}</span>
                <strong>{modeDescriptions[mode][language]}</strong>
              </div>
              <div className="speech-mic-selector" role="group" aria-label={language === "zh" ? "麦克风数量" : "Microphone count"}>
                {[1, 2, 4].map((count) => (
                  <button className={micCount === count ? "active" : ""} key={count} type="button" onClick={() => handleMicCountChange(count)}>
                    {count} Mic
                  </button>
                ))}
              </div>
              <p className="speech-mic-note">
                {language === "zh"
                  ? micCount === 1
                    ? "当前是单麦模式：流程图会跳过多麦波束成形，只保留 AEC、NS/ANR、去混响和 AGC。"
                    : `当前是 ${micCount} Mic 阵列：启用 DOA 声源定位和定向拾音，阵列通道越多，空间抑制能力和延迟/算力开销通常越高。`
                  : micCount === 1
                    ? "Single-mic mode: the flow bypasses beamforming and keeps AEC, NS/ANR, dereverb, and AGC."
                    : `${micCount}-mic array: the flow enables DOA localization and directional pickup; more channels usually mean better spatial suppression plus more latency and CPU cost.`}
              </p>
              <label className="sound-lab-control">
                <span>{language === "zh" ? `当前模块强度：${strength}%` : `Current module strength: ${strength}%`}</span>
                <input aria-label={language === "zh" ? "处理强度" : "Processing strength"} max="100" min="0" step="5" type="range" value={strength} onChange={(event) => handleStrengthChange(Number(event.target.value))} />
              </label>
              <div className="speech-enhancement-metrics">
                <strong>{language === "zh" ? `模型噪声分量衰减：${attenuation(residual.noise)} dB` : `Model noise attenuation: ${attenuation(residual.noise)} dB`}</strong>
                <strong>{language === "zh" ? `模型回声分量衰减：${attenuation(residual.echo)} dB` : `Model echo attenuation: ${attenuation(residual.echo)} dB`}</strong>
                <strong>{language === "zh" ? `模型混响分量衰减：${attenuation(residual.reverb)} dB` : `Model reverb attenuation: ${attenuation(residual.reverb)} dB`}</strong>
              </div>
              <p className="traditional-model-note">{language === "zh" ? "已知分量的教学模型，不是运行真实 AEC / NS 或测量 SoC 性能。回声来自独立远端信号，混响是本地语音的延迟副本；AGC 对整路信号施加相同增益，也会抬高残留噪声。图中幅度/时间为归一化示意，未模拟收敛与 attack/release。" : "A known-component teaching model, not a running AEC/NS engine or SoC benchmark. Echo comes from an independent remote signal; reverb is delayed local speech. AGC applies the same gain to the whole signal, including residual noise. Axes are normalized; adaptation and attack/release are not simulated."}</p>
            </aside>
          </div>
        </div>

        <section className="speech-sdk-table" aria-label={language === "zh" ? "SDK 模块对照" : "SDK module mapping"}>
          {sdkRows.map((row) => (
            <article key={row.module}>
              <h2>{row.module}</h2>
              <p>{row[language]}</p>
            </article>
          ))}
        </section>

        <section className="speech-soc-section" aria-label={language === "zh" ? "SoC SDK 音频处理流程" : "SoC SDK audio processing flows"}>
          <div className="speech-soc-heading">
            <h2>{language === "zh" ? "常见 SoC SDK 音频处理流程" : "Common SoC SDK Audio Flows"}</h2>
            <p>
              {language === "zh"
                ? "不同 SDK 版本命名会变化，下面按工程模块边界理解：采集、回采、语音增强、编码或识别。"
                : "Names differ by SDK version, so these flows focus on engineering boundaries: capture, playback reference, voice enhancement, and encoding or recognition."}
            </p>
          </div>
          <div className="speech-soc-grid">
            {socFlows.map((flow) => (
              <article key={flow.name}>
                <h3>{flow.name}</h3>
                <p>{flow.summary[language]}</p>
                <SocFlowDiagram flow={flow.flow} language={language} name={flow.name} />
                <ol>
                  {flow.stages.map((stage) => (
                    <li key={stage.en}>{stage[language]}</li>
                  ))}
                </ol>
                <div className="speech-soc-chip-list" aria-label={language === "zh" ? `${flow.name} 推荐芯片` : `${flow.name} recommended chips`}>
                  <strong>{language === "zh" ? "主流芯片推荐" : "Recommended mainstream chips"}</strong>
                  {flow.chips.map((chip) => (
                    <p key={chip.model}>
                      <span>{chip.model}</span>
                      {chip[language]}
                    </p>
                  ))}
                </div>
                <p className="speech-soc-note">{flow.note[language]}</p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
