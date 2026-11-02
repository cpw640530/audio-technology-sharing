import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import type { Language } from "../content/knowledge";
import { EnhancementStageFocus } from "./EnhancementStageFocus";
import { SpatialSpectralDemo } from "./SpatialSpectralDemo";

type SpeechEnhancementLabProps = {
  language: Language;
  onBack: () => void;
  onBackToDetails?: () => void;
};

type EnhancementMode = "aec" | "ns" | "agc" | "beamforming" | "dereverb";
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
const enhancementGuides = {
  aec: {
    title: { zh: "AEC：减掉扬声器传回来的声音", en: "AEC: remove the sound returning from the speaker" },
    sections: [
      { zh: ["输入是什么", "一路是 AI 采集的混合信号，包含近端人声、扬声器回声和噪声；另一路是 AO 播放参考。两路必须正确对齐，参考还要能代表实际送播的信号。"], en: ["Inputs", "AI captures near-end voice, speaker echo and noise. A separate AO playback reference describes what is being played. Correct timing and a representative playback reference are essential."] },
      { zh: ["如何抵消", "扬声器、房间和麦克风共同改变播放声音的延迟、幅度和频响。自适应滤波器估计这条回声路径，用播放参考生成估计回声，再执行：输出 = 采集信号 − 估计回声，而不是直接减掉 AO。"], en: ["Cancellation", "The speaker, room and microphone change delay, level and frequency response. An adaptive filter models this echo path and generates an echo estimate from the reference. Output = capture − estimated echo, not capture − AO."] },
      { zh: ["怎样看结果", "先看 AO 与 AI 中回声的对应关系，再看 AEC 输出是否保留近端语音。双讲时不能把近端人声当作回声消掉；延迟漂移、削波或路径突变都会影响收敛。下方三路图是已知路径教学模拟，不是运行自适应算法。"], en: ["Reading the result", "Compare AO with its echo in AI, then check that near-end voice remains in AEC output. Double-talk, timing drift, clipping and path changes complicate adaptation. The three tracks below model a known path rather than running an adaptive filter."] }
    ]
  },
  ns: {
    title: { zh: "ANR / NS：压低背景噪声，保留人声", en: "ANR / NS: reduce background noise while preserving speech" },
    sections: [
      { zh: ["输入是什么", "输入通常是经过 AEC 的 PCM。AEC 减少的是与播放参考相关的回声；风扇、电流声等独立背景噪声仍然可能存在。ANR/NS 不等于 AEC，也不是耳机的主动降噪 ANC。"], en: ["Inputs", "The input is typically PCM after AEC. Independent fan or electrical noise may remain after playback-correlated echo is reduced. ANR/NS is not AEC or headphone ANC."] },
      { zh: ["如何处理", "典型传统方法将 PCM 分帧加窗，估计各频带噪声功率，计算随时间和频率变化的增益，再重建波形。不是把整段声音统一调小：语音占优势的频带尽量保留，噪声占优势的频带适当衰减。"], en: ["Processing", "A typical traditional method windows PCM frames, estimates noise power by frequency band, applies time-varying spectral gains, then reconstructs the waveform. Speech-dominant bands are preserved rather than turning the entire signal down."] },
      { zh: ["怎样看结果", "观察噪声分量 RMS 是否降低，同时检查近端语音有没有被削弱。真实语音与噪声会重叠，抑制过强可能造成辅音丢失、音乐噪声或抽吸。下方示例从开头的纯噪声段估计频谱，再对混合信号计算增益；不能无损分离重叠的语音和噪声。"], en: ["Reading the result", "Noise RMS should decrease while voice remains. Real speech overlaps noise; excessive suppression can remove consonants or cause musical noise and pumping. The example estimates noise from an initial noise-only segment, then filters the mixture; overlapping speech and noise cannot be separated losslessly."] }
    ]
  },
  agc: {
    title: { zh: "AGC：稳定电平，不是继续降噪", en: "AGC: stabilize level, not remove more noise" },
    sections: [
      { zh: ["输入是什么", "输入是前级处理后的 PCM，通常仍包含少量残留噪声。数字信号也有电平：可通过峰值或 RMS 衡量，常以相对满刻度的 dBFS 表示。"], en: ["Inputs", "PCM from upstream stages may still contain residual noise. Digital signals have levels measured by peak or RMS, often expressed relative to full scale in dBFS."] },
      { zh: ["如何处理", "先检测电平，再与目标电平比较，计算并平滑增益：输出样本 = 增益 × 输入样本。attack/release 控制跟随速度，最大增益和限幅等约束避免过度放大与过载；AGC 不必然包含限幅器。"], en: ["Processing", "Detect level, compare with a target, then calculate and smooth gain: output sample = gain × input sample. Attack/release set tracking speed; gain limits and optional limiting control overload. An AGC does not necessarily include a limiter."] },
      { zh: ["怎样看结果", "轻声可能被抬高，大声可能被压低，但同一时刻的语音和残余噪声都乘以相同增益。不要把噪声变大误认为降噪失效。下方是即时包络教学模型，未模拟真实 attack/release 或静音门控。"], en: ["Reading the result", "Quiet passages may rise and loud passages may fall. Voice and residual noise receive the same gain at each instant, so louder noise does not imply failed denoising. This instantaneous envelope model omits attack/release and silence gating."] }
    ]
  }
};
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
    zh: "多麦波束成形对同步麦克风信号进行延迟与加权合成，增强目标方向；方向可固定，也可由 DOA 定位提供。单麦时旁路此处理。",
    en: "Beamforming delays and weights synchronized microphone signals toward a fixed or DOA-estimated direction. This processing is bypassed with one microphone."
  },
  dereverb: {
      zh: "去混响减弱房间后期反射造成的拖尾；此教学滑块仅压低拖尾幅度，不改变模拟房间的延迟或衰减常数。",
      en: "Dereverberation reduces late reflection tails. This teaching slider lowers tail amplitude only, not the modeled room delay or decay constant."
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
    { id: "out", label: "PCM", sub: { zh: "增强后数据", en: "enhanced samples" }, x: 484, y: 350 },
    { id: "encode", label: "AENC / ASR", sub: { zh: "编码或识别", en: "encode or ASR" }, x: 338, y: 490 },
    { id: "play", label: "AO", sub: { zh: "本地播放", en: "local playback" }, x: 484, y: 490 }
  ] as const;

  return (
    <>
    <svg
      aria-label={language === "zh" ? "语音增强处理流程图" : "Speech enhancement processing flow"}
      className="speech-enhancement-flow-chart"
      role="img"
      viewBox="0 0 720 650"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <marker id="speechLabArrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
          <path d="M0 0 8 4 0 8Z" fill="#dcece8" />
        </marker>
      </defs>
      <rect className="lab-diagram-bg" height="650" rx="16" width="720" />
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
      <path className="speech-lab-flow-link" data-testid="speech-pcm-to-encode" d="M 543 432 V 460 H 397 V 490" />
      <path className="speech-lab-flow-link" data-testid="speech-pcm-to-ao" d="M 543 460 V 490" />
      <path className="speech-lab-reference-link" data-testid="speech-playback-to-ao" d="M 127 426 V 592 H 650 V 531 H 602" />
      <g className="speech-lab-reference">
        <rect height="76" rx="12" width="170" x="42" y="350" />
        <text x="127" y="382">Playback / Mixer</text>
        <text x="127" y="406">{language === "zh" ? "播放 reference" : "playback reference"}</text>
      </g>
      <path className="speech-lab-reference-link" d="M 42 388 H 20 V 58 H 543 V 76" />
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
      <text className="speech-lab-sdk-label" x="44" y="624">
        {language === "zh" ? "Rockchip VQE / SigmaStar Audio Process / Ingenic IMP Audio：命名不同，边界类似" : "Rockchip VQE / SigmaStar Audio Process / Ingenic IMP Audio: different names, similar boundaries"}
      </text>
    </svg>
    <p className="speech-mic-note">{language === "zh" ? "实线：PCM 主数据通路。虚线：播放信号与 AEC 参考的关联，不是另一条必须串行经过的处理链。" : "Solid: primary PCM data path. Dashed: association between playback and the AEC reference, not an additional mandatory serial processing chain."}</p>
    <p className="speech-mic-note">{language === "zh"
      ? "AGC 后仍是 PCM，可按应用选择编码、识别、录音或直接送 AO。AO 再经驱动、数字接口、DAC/Codec 与功放到扬声器，不必先编码。AEC 对齐播放参考和麦克风输入：参考应来自实际送往扬声器的播放信号，不是把 AGC 输出无条件回接 AEC。麦克风直通扬声器还需防止声反馈啸叫。"
      : "AGC still outputs PCM: route it to encoding, recognition, recording or directly to AO. AO feeds the driver, digital interface, DAC/Codec and amplifier/speaker; encoding is not required. AEC aligns reference and mic input: the reference must represent actual speaker playback, not an unconditional loop from AGC. Mic-to-speaker monitoring also requires acoustic-feedback control."}</p>
    </>
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

export function SpeechEnhancementLab({ language, onBack, onBackToDetails }: SpeechEnhancementLabProps) {
  const [page, setPage] = useState<EnhancementMode>("aec");
  const [strengths, setStrengths] = useState<ProcessingStrengths>(() => ({ ...defaultProcessingStrengths }));
  const [micCount, setMicCount] = useState(2);
  const [steering, setSteering] = useState(30);
  const index = flowModes.indexOf(page);
  const guide = page === "aec" || page === "ns" || page === "agc" ? enhancementGuides[page] : null;
  const extraPrinciple = page === "beamforming"
    ? (language === "zh"
      ? "同一个声源到达不同麦克风的时间和相位不同。波束成形对各路信号施加延迟和权重后相加，让目标方向的声音尽量同相叠加，其他方向的干扰受到抑制。目标方向可以预先设定，也可以由 DOA 定位结果提供；并非所有波束成形都必须先做定位。这里按理想远场模型计算延迟求和，未模拟房间反射。"
      : "A source reaches different microphones with different delays and phases. Beamforming delays and weights the channels before summing them, aligning the target direction while reducing other directions. Steering can be fixed or supplied by DOA estimation; localization is not mandatory. This demo calculates delay-and-sum for ideal far-field waves, without room reflections.")
    : (language === "zh"
      ? "房间反射使直达声之后仍有衰减的声音尾巴，多个音节因此互相叠加。去混响利用信号的时间相关性、频谱或房间模型，估计并减弱后期反射，尽量保留直达声及有用的早期反射。它不是简单删掉某个时间点之后的声音；本演示仅降低已知拖尾分量的幅度。"
      : "Room reflections produce decaying tails after direct sound, smearing successive syllables. Dereverberation uses temporal correlation, spectral information or room models to estimate and reduce late reflections while preserving direct sound and useful early reflections. It does not simply delete everything after a time point; this demo only attenuates a known tail component.");
  const inputs = {
    beamforming: { zh: "麦克风采集；单麦时旁路多麦处理", en: "Microphone capture; array processing is bypassed with one microphone" },
    aec: { zh: "麦克风采集，包含已启用的多麦预处理", en: "Microphone capture, including enabled array preprocessing" },
    ns: { zh: "AEC 输出", en: "AEC output" },
    dereverb: { zh: "AEC → ANR/NS 后的 PCM", en: "PCM after AEC → ANR/NS" },
    agc: { zh: "AEC → ANR/NS → 去混响后的 PCM", en: "PCM after AEC → ANR/NS → dereverberation" }
  };
  const input = inputs[page][language];
  function openAlgorithm(next: EnhancementMode) {
    setPage(next);
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  const pageNavigation = <nav className="waveform-tabs speech-enhancement-tabs" aria-label={language === "zh" ? "语音增强算法" : "Speech enhancement algorithms"}>
    {flowModes.map(item => <button key={item} type="button" className={item === page ? "active" : ""} aria-current={item === page ? "page" : undefined} onClick={() => openAlgorithm(item)}>{modeLabels[item][language]}</button>)}
  </nav>;
    return <main className="speech-enhancement-page">
      <section className="sound-lab-hero">
        <div className="sound-lab-back-actions">
          <button type="button" className="sound-lab-back" onClick={onBack}>{language === "zh" ? "返回知识库" : "Back to knowledge base"}</button>
          {onBackToDetails && <button type="button" className="sound-lab-back" onClick={onBackToDetails}>{language === "zh" ? "返回详细内容" : "Back to detailed content"}</button>}
        </div>
        <h1>{modeLabels[page][language]}</h1>
        <p>{modeDescriptions[page][language]}</p>
        {pageNavigation}
      </section>
      <section className="speech-enhancement-workbench" aria-label={language === "zh" ? "算法独立实验页" : "Individual algorithm workbench"}>
        <p className="speech-mic-note">{page === "beamforming" || page === "ns"
          ? (language === "zh" ? "当前为独立算法示例，不串接其他页面的波形。空间参数和频谱增益只影响本页。" : "Standalone algorithm example, not connected to other pages' waveforms. Spatial parameters and spectral gain affect this page only.")
          : (language === "zh" ? `当前输入：${input}；${micCount} Mic。此页仍使用简化链路模型，不采用独立波束/频谱实验的输出。` : `Input: ${input}; ${micCount} microphones. This page retains the simplified chain model, not the outputs of the standalone spatial/spectral experiments.`)}</p>
        {page === "beamforming" && <div className="speech-mic-selector" role="group" aria-label={language === "zh" ? "麦克风数量" : "Microphone count"}>
          {[1, 2, 4].map(count => <button key={count} type="button" className={micCount === count ? "active" : ""} onClick={() => setMicCount(count)}>{count} Mic</button>)}
        </div>}
        <div className="speech-enhancement-visuals">
          <section className="speech-module-guide" aria-label={language === "zh" ? "基本原理" : "Basic principle"}>
            <details className="speech-explanation"><summary>{language === "zh" ? "基本原理" : "Basic principle"}</summary>
            {guide ? <div>{guide.sections.map((item, i) => <section key={i}><h3>{item[language][0]}</h3><p>{item[language][1]}</p></section>)}</div> : <p>{extraPrinciple}</p>}
            </details>
          </section>
          <label className="sound-lab-control speech-live-strength">
            <span>{page === "beamforming" ? `${language === "zh" ? "指向角度" : "Steering angle"} · ${steering}°` : `${modeLabels[page][language]} · ${strengths[page]}%`}</span>
            {page === "beamforming" ? <input type="range" min="-90" max="90" step="5" value={steering} aria-label={language === "zh" ? "指向角度" : "Steering angle"} onChange={event => setSteering(Number(event.target.value))} />
              : <input type="range" min="0" max="100" step="5" value={strengths[page]} aria-label={language === "zh" ? "处理强度" : "Processing strength"} onChange={event => setStrengths(current => ({ ...current, [page]: Number(event.target.value) }))} />}
          </label>
          {page === "beamforming" || page === "ns" ? <SpatialSpectralDemo language={language} mode={page} micCount={micCount} steering={steering} strength={strengths[page]} />
            : <EnhancementStageFocus language={language} mode={page} strengths={{ ...strengths, ns: defaultProcessingStrengths.ns, beamforming: defaultProcessingStrengths.beamforming }} micCount={micCount} />}
          <details className="speech-explanation"><summary>{language === "zh" ? "工程限制" : "Engineering limits"}</summary><p>{modeLimits[page][language]}</p></details>
        </div>
        <nav className="sound-lab-back-actions" aria-label={language === "zh" ? "相邻算法" : "Adjacent algorithms"}>
          {index > 0 && <button type="button" className="sine-button" onClick={() => openAlgorithm(flowModes[index - 1])}>{language === "zh" ? "上一算法" : "Previous"} · {modeLabels[flowModes[index - 1]][language]}</button>}
          {index < flowModes.length - 1 && <button type="button" className="sine-button" onClick={() => openAlgorithm(flowModes[index + 1])}>{language === "zh" ? "下一算法" : "Next"} · {modeLabels[flowModes[index + 1]][language]}</button>}
        </nav>
        <details className="speech-supplement"><summary>{language === "zh" ? "完整链路参考" : "Full chain reference"}</summary><EnhancementFlowChart language={language} micCount={micCount} mode={page} /></details>
        <details className="speech-supplement">
        <summary>{language === "zh" ? "SoC SDK 与工程参考" : "SoC SDK and engineering references"}</summary>
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
        </details>
      </section>
    </main>;

}
