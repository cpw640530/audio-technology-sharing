import type { AiAudioLabId, LocalizedText, Topic, TopicLab } from "./knowledge";

export type TopicKey = Exclude<TopicLab["type"], "ai-audio"> | `ai-${AiAudioLabId}`;

export function getTopicKey(topic: Topic): TopicKey | undefined {
  const lab = topic.detail.lab;
  if (!lab) return undefined;
  if (lab.type !== "ai-audio") return lab.type;
  return lab.initialMode ? `ai-${lab.initialMode}` : undefined;
}

export const relatedTopics: Record<TopicKey, { target: TopicKey; reason: LocalizedText }[]> = {
  "sound-wave": [
    {
      target: "microphone",
      reason: { zh: "声音的压力变化由麦克风转换为电信号。", en: "A microphone converts sound-pressure changes into an electrical signal." }
    },
    {
      target: "sampling-quantization",
      reason: { zh: "采样与量化把连续波形变成数字音频。", en: "Sampling and quantization turn a continuous wave into digital audio." }
    }
  ],
  "audio-units": [
    {
      target: "sampling-quantization",
      reason: { zh: "采样率和位深是理解数字音频单位的基础。", en: "Sample rate and bit depth ground the main digital-audio units." }
    },
    {
      target: "listening-metrics",
      reason: { zh: "响度单位需要结合听觉测量来理解。", en: "Loudness units make more sense alongside perceptual measurements." }
    }
  ],
  "sampling-quantization": [
    {
      target: "core-signal-processing",
      reason: { zh: "数字信号处理直接作用于采样后的离散信号。", en: "Signal processing operates directly on sampled discrete signals." }
    },
    {
      target: "audio-codec",
      reason: { zh: "编码器会压缩采样得到的 PCM 数据。", en: "Codecs compress the PCM data produced by sampling." }
    }
  ],
  "listening-metrics": [
    {
      target: "audio-units",
      reason: { zh: "响度、声压级和数字电平使用不同参考点。", en: "Loudness, sound pressure, and digital level use different references." }
    },
    {
      target: "speech-enhancement",
      reason: { zh: "增强效果需要用信噪比和感知质量衡量。", en: "Enhancement quality needs signal-to-noise and perceptual measures." }
    }
  ],
  microphone: [
    {
      target: "codec-hardware",
      reason: { zh: "麦克风信号通常经过 Codec 或 ADC 进入数字链路。", en: "Microphone signals usually enter the digital chain through a Codec or ADC." }
    },
    {
      target: "digital-interface",
      reason: { zh: "数字麦克风和 ADC 通过音频接口传输采样数据。", en: "Digital microphones and ADCs carry samples through audio interfaces." }
    }
  ],
  "codec-hardware": [
    {
      target: "microphone",
      reason: { zh: "Codec 的输入端连接麦克风等模拟换能器。", en: "Codec inputs connect to microphones and other analog transducers." }
    },
    {
      target: "audio-codec",
      reason: { zh: "区分采集/播放用的 Codec 芯片与压缩码流用的编解码算法。", en: "Distinguish capture/playback codec chips from algorithms that compress audio streams." }
    }
  ],
  "digital-interface": [
    {
      target: "codec-hardware",
      reason: { zh: "I2S 等接口连接 Codec 与处理器。", en: "Interfaces such as I2S connect Codecs to processors." }
    },
    {
      target: "system-audio",
      reason: { zh: "系统音频需要配置设备、时钟和音频数据通路。", en: "System audio configures devices, clocks, and audio data paths." }
    }
  ],
  "amplifier-speaker": [
    {
      target: "sound-wave",
      reason: { zh: "扬声器把电信号还原为声压波。", en: "A speaker turns an electrical signal back into a pressure wave." }
    },
    {
      target: "listening-metrics",
      reason: { zh: "扬声器性能需要结合响度和失真等听感指标。", en: "Speaker performance is judged with loudness, distortion, and other perceptual metrics." }
    }
  ],
  "system-audio": [
    {
      target: "alsa",
      reason: { zh: "Linux 系统音频常通过 ALSA 访问硬件设备。", en: "Linux system audio commonly reaches hardware through ALSA." }
    },
    {
      target: "realtime-audio",
      reason: { zh: "系统音频要在缓冲、调度和延迟之间做取舍。", en: "System audio balances buffering, scheduling, and latency." }
    }
  ],
  alsa: [
    {
      target: "system-audio",
      reason: { zh: "ALSA 是 Linux 音频系统访问硬件的基础层。", en: "ALSA is the foundational Linux layer for accessing audio hardware." }
    },
    {
      target: "realtime-audio",
      reason: { zh: "ALSA 缓冲和调度配置会影响实时音频延迟。", en: "ALSA buffering and scheduling affect real-time audio latency." }
    }
  ],
  "audio-codec": [
    {
      target: "codec-hardware",
      reason: { zh: "把 PCM 编解码与硬件采集、播放的职责区分开。", en: "Separate PCM encoding/decoding from hardware capture and playback responsibilities." }
    },
    {
      target: "bluetooth-audio",
      reason: { zh: "蓝牙音频依赖编码格式来控制码率和延迟。", en: "Bluetooth audio relies on codecs to control bitrate and latency." }
    }
  ],
  "realtime-audio": [
    {
      target: "system-audio",
      reason: { zh: "实时处理依赖系统音频的设备和缓冲管理。", en: "Real-time processing depends on system audio device and buffer management." }
    },
    {
      target: "meeting-communication",
      reason: { zh: "会议通话把实时采集、处理和播放串成完整链路。", en: "Meetings combine real-time capture, processing, and playback in one chain." }
    }
  ],
  "core-signal-processing": [
    {
      target: "sampling-quantization",
      reason: { zh: "采样与量化决定 DSP 处理的离散输入。", en: "Sampling and quantization define the discrete input to DSP." }
    },
    {
      target: "speech-enhancement",
      reason: { zh: "滤波、频谱和变换是语音增强的传统基础。", en: "Filtering, spectra, and transforms are traditional foundations of enhancement." }
    }
  ],
  "speech-enhancement": [
    {
      target: "core-signal-processing",
      reason: { zh: "语音增强常结合滤波、STFT 和频谱处理。", en: "Speech enhancement commonly uses filtering, STFT, and spectral processing." }
    },
    {
      target: "meeting-communication",
      reason: { zh: "会议通话需要抑制噪声、回声和混响。", en: "Meeting communication needs noise, echo, and reverberation suppression." }
    }
  ],
  "spatial-audio": [
    {
      target: "sound-wave",
      reason: { zh: "空间听感来自声波的相位、时间和强度差异。", en: "Spatial perception comes from wave phase, timing, and level differences." }
    },
    {
      target: "listening-metrics",
      reason: { zh: "先比较左右声道电平与声像，再理解空间定位。", en: "Compare left/right levels and stereo panning before exploring spatial localization." }
    }
  ],
  "meeting-communication": [
    {
      target: "realtime-audio",
      reason: { zh: "通话体验受端到端延迟和抖动预算约束。", en: "Call quality is constrained by end-to-end latency and jitter budgets." }
    },
    {
      target: "speech-enhancement",
      reason: { zh: "降噪、回声消除和自动增益是会议音频核心处理。", en: "Noise reduction, echo cancellation, and gain control are core meeting processing." }
    }
  ],
  "automotive-audio": [
    {
      target: "spatial-audio",
      reason: { zh: "车内多扬声器布局需要空间定位和声场控制。", en: "In-car speaker layouts need spatial positioning and sound-field control." }
    },
    {
      target: "realtime-audio",
      reason: { zh: "车载交互要求稳定的低延迟音频链路。", en: "Automotive interaction requires a stable low-latency audio path." }
    }
  ],
  "robot-audio": [
    {
      target: "microphone",
      reason: { zh: "机器人通过麦克风获取环境和用户声音。", en: "Robots use microphones to capture the environment and user speech." }
    },
    {
      target: "ai-event",
      reason: { zh: "事件识别帮助机器人理解非语音声音。", en: "Event recognition helps robots understand non-speech sounds." }
    }
  ],
  "iot-content": [
    {
      target: "bluetooth-audio",
      reason: { zh: "物联网设备常通过无线音频链路传输内容。", en: "IoT devices often deliver content over wireless audio links." }
    },
    {
      target: "ai-event",
      reason: { zh: "声音事件可以触发设备状态和自动化动作。", en: "Sound events can trigger device states and automation actions." }
    }
  ],
  "bluetooth-audio": [
    {
      target: "audio-codec",
      reason: { zh: "蓝牙传输需要编码来降低无线带宽占用。", en: "Bluetooth transmission uses codecs to reduce wireless bandwidth." }
    },
    {
      target: "realtime-audio",
      reason: { zh: "缓冲和重传策略直接影响蓝牙音频延迟。", en: "Buffering and retransmission directly affect Bluetooth audio latency." }
    }
  ],
  "ai-overview": [
    {
      target: "ai-asr",
      reason: { zh: "ASR 展示 AI 如何从声音提取语言内容。", en: "ASR shows how AI extracts language content from sound." }
    },
    {
      target: "ai-enhancement",
      reason: { zh: "增强展示 AI 如何改善输入音频质量。", en: "Enhancement shows how AI improves incoming audio quality." }
    }
  ],
  "ai-asr": [
    {
      target: "core-signal-processing",
      reason: { zh: "理解常见 ASR 前端的分帧、频谱与特征提取。", en: "Understand framing, spectra, and feature extraction in common ASR front ends." }
    },
    {
      target: "sampling-quantization",
      reason: { zh: "采样率和量化精度决定 ASR 的数字输入。", en: "Sample rate and quantization precision define ASR's digital input." }
    }
  ],
  "ai-tts": [
    {
      target: "ai-generation",
      reason: { zh: "TTS 是以文本为条件生成语音的典型任务。", en: "TTS is a canonical task for generating speech from text." }
    },
    {
      target: "realtime-audio",
      reason: { zh: "交互式 TTS 需要控制合成和播放延迟。", en: "Interactive TTS must control synthesis and playback latency." }
    }
  ],
  "ai-generation": [
    {
      target: "ai-tts",
      reason: { zh: "TTS 是 AI 音频生成中最常见的语音应用。", en: "TTS is one of the most common speech applications of audio generation." }
    },
    {
      target: "ai-codec",
      reason: { zh: "神经 Codec 可提供生成模型使用的音频 token。", en: "Neural codecs can provide audio tokens for generative models." }
    }
  ],
  "ai-event": [
    {
      target: "core-signal-processing",
      reason: { zh: "事件识别通常从频谱或时频特征开始。", en: "Event recognition commonly starts from spectral or time-frequency features." }
    },
    {
      target: "microphone",
      reason: { zh: "事件模型的输入来自真实环境中的麦克风采集。", en: "Event models receive input captured by microphones in real environments." }
    }
  ],
  "ai-enhancement": [
    {
      target: "speech-enhancement",
      reason: { zh: "AI 增强与传统语音增强共享降噪和分离目标。", en: "AI enhancement shares denoising and separation goals with speech enhancement." }
    },
    {
      target: "core-signal-processing",
      reason: { zh: "理解频域增强模型中常见的时频分析和信号重建。", en: "Understand time-frequency analysis and reconstruction used in spectral enhancement models." }
    }
  ],
  "ai-codec": [
    {
      target: "audio-codec",
      reason: { zh: "AI Codec 与 MP3、AAC、Opus 共享压缩与重建目标。", en: "AI codecs share compression and reconstruction goals with MP3, AAC, and Opus." }
    },
    {
      target: "realtime-audio",
      reason: { zh: "神经编码部署必须满足码率、算力和延迟约束。", en: "Neural codec deployment must meet bitrate, compute, and latency constraints." }
    }
  ]
};
