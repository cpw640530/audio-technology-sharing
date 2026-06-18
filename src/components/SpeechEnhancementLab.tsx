import { ArrowLeft } from "lucide-react";
import { useMemo, useState } from "react";
import type { Language } from "../content/knowledge";

type SpeechEnhancementLabProps = {
  language: Language;
  onBack: () => void;
};

type EnhancementMode = "aec" | "ns" | "agc" | "beamforming" | "dereverb";
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

const modePrinciples: Record<EnhancementMode, Record<Language, string>[]> = {
  beamforming: [
    {
      zh: "DOA 声源定位：多麦阵列要求至少两路同步麦克风，用到达时间差 τ 或相位差估计目标方向。",
      en: "DOA localization: a microphone array needs at least two synchronized channels and estimates target direction from time difference tau or phase difference."
    },
    {
      zh: "定向拾音：延时求和会把目标方向的多路麦克风对齐相加，目标语音被增强，侧向噪声因相位不一致被压低。",
      en: "Directional pickup: delay-and-sum aligns channels from the target direction, boosting target speech while reducing side noise through phase mismatch."
    },
    {
      zh: "单麦没有空间信息，所以不能做真正的多麦增强；最多只能做单通道降噪、AGC 或去混响。",
      en: "A single microphone has no spatial information, so true array enhancement is unavailable; it can still use single-channel NS, AGC, or dereverb."
    }
  ],
  aec: [
    {
      zh: "AEC 的关键输入是麦克风 PCM 和播放侧 reference PCM。reference 必须和麦克风里的回声时间对齐，否则自适应滤波器会估错。",
      en: "AEC needs microphone PCM plus playback reference PCM. The reference must be time-aligned with the echo in the microphone signal, otherwise the adaptive filter estimates the wrong path."
    },
    {
      zh: "自适应滤波器会学习扬声器、机壳、空气和房间形成的回声路径，生成一个“预测回声”，再从麦克风信号中相减。",
      en: "An adaptive filter learns the echo path through the speaker, enclosure, air, and room, generates a predicted echo, then subtracts it from the microphone signal."
    },
    {
      zh: "双讲时近端人声和远端播放声同时存在，AEC 不能盲目强收敛，否则会把近端人声当回声一起减掉。",
      en: "During double-talk, near-end speech and far-end playback coexist. AEC must avoid aggressive adaptation or it can subtract near-end speech as if it were echo."
    }
  ],
  ns: [
    {
      zh: "ANR/NS 通常按短帧做 FFT 或滤波器组分析，估计哪些频段更像稳定噪声，哪些频段更像语音。",
      en: "ANR/NS usually analyzes short frames with FFT or filter banks to estimate which bands look like steady noise and which bands look like speech."
    },
    {
      zh: "常见做法类似谱减法或维纳滤波：对噪声占比高的频段降低增益，对语音占比高的频段保留更多能量。",
      en: "A common idea is spectral subtraction or Wiener-style filtering: reduce gain in noise-dominant bands and preserve more energy in speech-dominant bands."
    },
    {
      zh: "强度太高会让辅音、高频细节和环境自然感被削掉，听起来像金属音、抽吸声或吞字。",
      en: "Too much strength can remove consonants, high-frequency detail, and natural ambience, causing metallic sound, pumping, or clipped words."
    }
  ],
  dereverb: [
    {
      zh: "混响由早期反射和后期反射组成。去混响通常重点压低后期拖尾，因为它会让语音变远、变糊。",
      en: "Reverberation contains early and late reflections. Dereverb mainly reduces late tails because they make speech sound distant and blurred."
    },
    {
      zh: "工程上常结合多麦空间信息、线性预测或频域衰减，判断哪些能量是持续拖尾，再按频段降低它。",
      en: "Engineering implementations may combine array cues, linear prediction, or frequency-domain attenuation to identify sustained tails and reduce them by band."
    },
    {
      zh: "去混响不会让房间完全消失。过强会把语音尾音和自然共鸣一起削弱，声音会变薄、发干。",
      en: "Dereverb cannot make the room disappear. Aggressive settings can remove natural resonance and word endings, making speech thin and dry."
    }
  ],
  agc: [
    {
      zh: "AGC 先估计短时 RMS、峰值或语音包络，再把电平拉向目标范围。它改变的是增益，不是频谱编码压缩。",
      en: "AGC estimates short-term RMS, peaks, or speech envelope, then moves level toward a target range. It changes gain, not codec-style spectral compression."
    },
    {
      zh: "Attack 和 release 决定增益变化速度：太快会抽吸，太慢会跟不上说话距离变化。",
      en: "Attack and release set how quickly gain changes: too fast causes pumping, too slow fails to track changing speaker distance."
    },
    {
      zh: "Limiter 常放在 AGC 后面兜底，防止增益过高导致数字削波。示意波形里 AGC 会让包络更均匀，而不是整体上下平移。",
      en: "A limiter is often placed after AGC to prevent clipping. In the demo waveform, AGC evens the envelope rather than shifting the waveform up or down."
    }
  ]
};

const algorithmFormulaNotes: Record<"aec" | "ns" | "agc", Record<Language, string>> = {
  aec: {
    zh: "AEC：x(n) 为播放参考，d_hat(n)=sum_k w_k x(n-k)，输出 e(n)=y(n)-d_hat(n)。",
    en: "AEC: x(n) is playback reference, d_hat(n)=sum_k w_k x(n-k), output e(n)=y(n)-d_hat(n)."
  },
  ns: {
    zh: "ANR/NS：估计噪声 N(k)，计算增益 G(k)，S_hat(k) = G(k)X(k) 保留语音频段。",
    en: "ANR/NS: estimate noise N(k), compute gain G(k), and keep speech bands with S_hat(k) = G(k)X(k)."
  },
  agc: {
    zh: "AGC：估计短时 rms(n)，g(n) = target / rms(n)，平滑后乘到 PCM 并用 limiter 防削波。",
    en: "AGC: estimate short-term rms(n), g(n) = target / rms(n), smooth it, apply to PCM, then limit clipping."
  }
};

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

function createSpeechWavePath({
  echoLevel,
  enhanced,
  micCount,
  mode,
  noiseLevel,
  reverbLevel,
  strength
}: {
  echoLevel: number;
  enhanced: boolean;
  micCount: number;
  mode: EnhancementMode;
  noiseLevel: number;
  reverbLevel: number;
  strength: number;
}) {
  const points = 140;
  const x = 42;
  const y = enhanced ? 282 : 150;
  const width = 656;
  const strengthRatio = strength / 100;
  const noise = noiseLevel / 100;
  const echo = echoLevel / 100;
  const reverb = reverbLevel / 100;
  const isMultiMic = micCount > 1;
  const beamformingAmount = enhanced && mode === "beamforming" && isMultiMic ? strengthRatio * (micCount === 4 ? 1 : 0.72) : 0;
  const aecAmount = enhanced && mode === "aec" ? strengthRatio : 0;
  const nsAmount = enhanced && mode === "ns" ? strengthRatio : 0;
  const dereverbAmount = enhanced && mode === "dereverb" ? strengthRatio : 0;
  const agcAmount = enhanced && mode === "agc" ? strengthRatio : 0;
  const noiseScale = noise * Math.max(0.08, 1 - nsAmount * 0.76 - beamformingAmount * 0.38);
  const echoScale = echo * Math.max(0.05, 1 - aecAmount * 0.86);
  const reverbScale = reverb * Math.max(0.14, 1 - dereverbAmount * 0.66 - beamformingAmount * 0.16);
  const gain = 1 + agcAmount * 0.2 + beamformingAmount * 0.08;

  return Array.from({ length: points }, (_, index) => {
    const ratio = index / (points - 1);
    const pointX = x + ratio * width;
    const speechEnvelope = 0.42 + Math.sin(ratio * Math.PI) * 0.58;
    const leveledEnvelope = speechEnvelope + (0.74 - speechEnvelope) * agcAmount * 0.72;
    const speech =
      Math.sin(ratio * Math.PI * 8.4) * 0.62 +
      Math.sin(ratio * Math.PI * 18.2 + 0.6) * 0.24;
    const noiseTexture =
      Math.sin(ratio * Math.PI * 72 + 0.4) * 0.38 +
      Math.sin(ratio * Math.PI * 113 + 1.3) * 0.2;
    const echoTail = Math.sin(Math.max(0, ratio - 0.1) * Math.PI * 8.4) * Math.exp(-ratio * 1.4);
    const reverbTail = Math.sin(ratio * Math.PI * 29) * Math.exp(-ratio * 1.15);
    const value =
      speech * leveledEnvelope * gain +
      noiseTexture * noiseScale * 0.38 +
      echoTail * echoScale * 0.48 +
      reverbTail * reverbScale * 0.34;
    const pointY = y - clamp(value, -1.2, 1.2) * 46;

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
      <text className="speech-lab-note" x="470" y="328">
        {language === "zh" ? "示意图表达趋势，不代表具体算法输出" : "Illustrates trends, not exact algorithm output"}
      </text>
    </svg>
  );
}

export function SpeechEnhancementLab({ language, onBack }: SpeechEnhancementLabProps) {
  const [mode, setMode] = useState<EnhancementMode>("beamforming");
  const [strength, setStrength] = useState(65);
  const [noiseLevel, setNoiseLevel] = useState(45);
  const [echoLevel, setEchoLevel] = useState(55);
  const [reverbLevel, setReverbLevel] = useState(35);
  const [micCount, setMicCount] = useState(2);
  const availableModes = flowModes.filter((item) => item !== "beamforming" || micCount > 1);

  const metrics = useMemo(() => {
    const strengthRatio = strength / 100;
    const isMultiMic = micCount > 1;
    const beamformingAmount = mode === "beamforming" && isMultiMic ? strengthRatio * (micCount === 4 ? 1 : 0.72) : 0;
    const noiseReduction = Math.round(noiseLevel * (mode === "ns" ? strengthRatio * 0.26 : beamformingAmount * 0.14));
    const echoReduction = Math.round(echoLevel * (mode === "aec" ? strengthRatio * 0.3 : 0));
    const reverbReduction = Math.round(reverbLevel * (mode === "dereverb" ? strengthRatio * 0.22 : beamformingAmount * 0.04));
    const speechLoss = Math.round(strengthRatio * (mode === "ns" ? noiseLevel * 0.02 : mode === "dereverb" ? reverbLevel * 0.018 : 0.7));
    const latencyCost = mode === "beamforming" ? 8 : mode === "aec" ? 7 : mode === "dereverb" ? 6 : mode === "ns" ? 4 : 3;
    const latency = 8 + latencyCost + Math.round(strengthRatio * 4 + (micCount - 1) * 2);

    return { echoReduction, latency, noiseReduction, reverbReduction, speechLoss };
  }, [echoLevel, micCount, mode, noiseLevel, reverbLevel, strength]);

  function handleMicCountChange(count: number) {
    setMicCount(count);
    if (count === 1 && mode === "beamforming") {
      setMode("aec");
    }
  }

  return (
    <main className="speech-enhancement-page">
      <section className="sound-lab-hero" aria-labelledby="speech-enhancement-title">
        <button className="sound-lab-back" type="button" onClick={onBack}>
          <ArrowLeft size={18} aria-hidden="true" />
          {language === "zh" ? "返回知识库" : "Back to knowledge base"}
        </button>
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
        <div className="waveform-tabs speech-enhancement-tabs" role="group" aria-label={language === "zh" ? "语音增强模块" : "Speech enhancement modules"}>
          {availableModes.map((item) => (
            <button className={mode === item ? "active" : ""} key={item} type="button" onClick={() => setMode(item)}>
              {modeLabels[item][language]}
            </button>
          ))}
        </div>

        <div className="speech-enhancement-layout">
          <div className="speech-enhancement-flow-area">
            <EnhancementFlowChart language={language} micCount={micCount} mode={mode} />
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
              <section className="speech-wave-explain-card" aria-label={language === "zh" ? "滑块如何影响波形" : "How sliders affect the waveform"}>
                <h2>{language === "zh" ? "波形如何变化" : "How the waveform changes"}</h2>
                <ul>
                  <li>
                    {language === "zh"
                      ? "当前模块强度：只作用于选中的算法。选 AEC 时增强后波形里的回声尾巴变短；选 NS/ANR 时细碎噪声纹理变少；选去混响时拖尾变短；选 AGC 时上下包络更均匀。"
                      : "Current module strength affects only the selected algorithm. With AEC, echo tails shrink; with NS/ANR, fine noise texture drops; with dereverb, tails shorten; with AGC, the envelope becomes more even."}
                  </li>
                  <li>
                    {language === "zh"
                      ? "噪声强度：增加原始波形上的高频细碎抖动。只有 NS/ANR 或多麦波束成形被选中时，增强后波形会明显把这部分压低。"
                      : "Noise level adds fine high-frequency jitter to the raw waveform. The enhanced waveform suppresses it strongly only when NS/ANR or beamforming is selected."}
                  </li>
                  <li>
                    {language === "zh"
                      ? "回声强度：增加与语音相似但延迟后的波峰和尾巴。只有 AEC 被选中时，增强后波形会明显减少这些延迟成分。"
                      : "Echo level adds delayed speech-like peaks and tails. The enhanced waveform reduces those delayed components mainly when AEC is selected."}
                  </li>
                  <li>
                    {language === "zh"
                      ? "混响拖尾：增加持续衰减的房间反射，让波形尾部更密、更长。去混响会缩短这段拖尾，多麦增强只能轻微改善。"
                      : "Reverb tail adds sustained decaying room reflections, making the waveform tail denser and longer. Dereverb shortens it; beamforming only helps slightly."}
                  </li>
                </ul>
              </section>
              <section className="speech-principle-card" aria-label={language === "zh" ? "当前算法基本原理" : "Current algorithm principle"}>
                <h2>{language === "zh" ? "基本原理" : "Principle"}</h2>
                <ul>
                  {modePrinciples[mode].map((point) => (
                    <li key={point.en}>{point[language]}</li>
                  ))}
                </ul>
              </section>
              <section className="speech-formula-card" aria-label={language === "zh" ? "核心算法数学形式" : "Core algorithm equations"}>
                <h2>{language === "zh" ? "核心算法数学形式" : "Core equations"}</h2>
                <ul>
                  {(["aec", "ns", "agc"] as const).map((item) => (
                    <li key={item}>{algorithmFormulaNotes[item][language]}</li>
                  ))}
                </ul>
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
                <input aria-label={language === "zh" ? "处理强度" : "Processing strength"} max="100" min="0" step="5" type="range" value={strength} onChange={(event) => setStrength(Number(event.target.value))} />
              </label>
              <label className="sound-lab-control">
                <span>{language === "zh" ? `噪声强度：${noiseLevel}%` : `Noise level: ${noiseLevel}%`}</span>
                <input aria-label={language === "zh" ? "噪声强度" : "Noise level"} max="100" min="0" step="5" type="range" value={noiseLevel} onChange={(event) => setNoiseLevel(Number(event.target.value))} />
              </label>
              <label className="sound-lab-control">
                <span>{language === "zh" ? `回声强度：${echoLevel}%` : `Echo level: ${echoLevel}%`}</span>
                <input aria-label={language === "zh" ? "回声强度" : "Echo level"} max="100" min="0" step="5" type="range" value={echoLevel} onChange={(event) => setEchoLevel(Number(event.target.value))} />
              </label>
              <label className="sound-lab-control">
                <span>{language === "zh" ? `混响拖尾：${reverbLevel}%` : `Reverb tail: ${reverbLevel}%`}</span>
                <input aria-label={language === "zh" ? "混响拖尾" : "Reverb tail"} max="100" min="0" step="5" type="range" value={reverbLevel} onChange={(event) => setReverbLevel(Number(event.target.value))} />
              </label>
              <div className="speech-enhancement-metrics">
                <strong>{language === "zh" ? `估计降噪：${metrics.noiseReduction} dB` : `Estimated NS: ${metrics.noiseReduction} dB`}</strong>
                <strong>{language === "zh" ? `估计回声衰减：${metrics.echoReduction} dB` : `Estimated echo reduction: ${metrics.echoReduction} dB`}</strong>
                <strong>{language === "zh" ? `估计混响衰减：${metrics.reverbReduction} dB` : `Estimated dereverb: ${metrics.reverbReduction} dB`}</strong>
                <strong>{language === "zh" ? `语音损伤风险：${metrics.speechLoss} / 10` : `Speech damage risk: ${metrics.speechLoss} / 10`}</strong>
                <strong>{language === "zh" ? `算法延迟：约 ${metrics.latency} ms` : `Algorithm latency: about ${metrics.latency} ms`}</strong>
              </div>
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

        <section className="speech-slider-analysis" aria-label={language === "zh" ? "滑块和波形关系说明" : "Slider and waveform explanation"}>
          <h2>{language === "zh" ? "滑块 / 窗口对波形的影响是否合理？" : "Are the slider and waveform effects reasonable?"}</h2>
          <ul>
            <li>
              {language === "zh"
                ? "当前模块强度只影响正在查看的算法：AEC 主要压低回声尾巴，NS/ANR 主要压低高频噪声纹理，去混响主要缩短反射拖尾，AGC 主要把包络拉向目标电平。"
                : "Current module strength affects only the selected algorithm: AEC lowers echo tails, NS/ANR lowers high-frequency noise texture, dereverb shortens reflection tails, and AGC moves the envelope toward a target level."}
            </li>
            <li>
              {language === "zh"
                ? "噪声、回声、混响三个滑块表示输入环境条件，所以会同时改变原始采集波形；增强后波形是否变化明显，取决于当前模块是否处理这类干扰。"
                : "Noise, echo, and reverb sliders represent input conditions, so they change the raw capture waveform. The enhanced waveform changes strongly only when the selected module handles that interference type."}
            </li>
            <li>
              {language === "zh"
                ? "真实 SDK 通常按 10-20 ms 帧窗处理。帧窗变长会让估计更稳定但增加延迟，帧窗变短会更实时但估计抖动更明显；它不应该让波形整体上下平移。"
                : "Real SDKs usually process 10-20 ms frames. Longer windows stabilize estimates but add latency; shorter windows react faster but jitter more. They should not shift the whole waveform up or down."}
            </li>
          </ul>
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
