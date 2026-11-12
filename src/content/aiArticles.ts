import { traditional } from "./traditional";
import type { AiAudioLabId, Language } from "./knowledge";

type LocalizedText = Record<Language, string>;
type SourceText = { zh: string; en: string };

type AiArticleSection = {
  title: SourceText;
  body: SourceText;
  points?: SourceText[];
};

type AiFlowStep = {
  title: SourceText;
  detail: SourceText;
};

type AiModelCard = {
  name: string;
  task: SourceText;
  principle: SourceText;
  deployment: SourceText;
  caution: SourceText;
};

type AiTechnicalProfile = {
  input: SourceText;
  representation: SourceText;
  output: SourceText;
  objective: SourceText;
  metrics: SourceText;
  deployment: SourceText;
};

type AiEquation = {
  expression: string;
  title: SourceText;
  explanation: SourceText;
};

type AiArticle = {
  title: SourceText;
  eyebrow: SourceText;
  summary: SourceText;
  flowLabel: SourceText;
  flow: AiFlowStep[];
  technical: AiTechnicalProfile;
  equations: AiEquation[];
  models: AiModelCard[];
  sections: AiArticleSection[];
};

type LocalizedArticleSection = {
  title: LocalizedText;
  body: LocalizedText;
  points?: LocalizedText[];
};

type LocalizedFlowStep = {
  title: LocalizedText;
  detail: LocalizedText;
};

type LocalizedModelCard = {
  name: string;
  task: LocalizedText;
  principle: LocalizedText;
  deployment: LocalizedText;
  caution: LocalizedText;
};

type LocalizedTechnicalProfile = {
  input: LocalizedText;
  representation: LocalizedText;
  output: LocalizedText;
  objective: LocalizedText;
  metrics: LocalizedText;
  deployment: LocalizedText;
};

type LocalizedEquation = {
  expression: string;
  title: LocalizedText;
  explanation: LocalizedText;
};

export type LocalizedAiArticle = {
  title: LocalizedText;
  eyebrow: LocalizedText;
  summary: LocalizedText;
  flowLabel: LocalizedText;
  flow: LocalizedFlowStep[];
  technical: LocalizedTechnicalProfile;
  equations: LocalizedEquation[];
  models: LocalizedModelCard[];
  sections: LocalizedArticleSection[];
};

const sectionTitles = {
  overview: { zh: "全面概述", en: "Overview" },
  principle: { zh: "基本原理", en: "Principles" },
  technologies: { zh: "核心技术", en: "Core technologies" },
  applications: { zh: "应用场景", en: "Applications" },
  challenges: { zh: "挑战", en: "Challenges" },
  trends: { zh: "未来趋势", en: "Future trends" }
} satisfies Record<string, SourceText>;

const ja: Record<string, string> = {};
const ko: Record<string, string> = {};

const aiArticlesSource: Record<AiAudioLabId, AiArticle> = {
  overview: {
    title: { zh: "AI 音频总流程实验室", en: "AI Audio Overall Flow Lab" },
    eyebrow: { zh: "AI 音频入口", en: "AI audio entry" },
    summary: {
      zh: "用一条工程链路解释声音如何从 PCM 进入不同表示、任务模型、评价与部署。",
      en: "An engineering chain from PCM through task-specific representations, models, evaluation, and deployment."
    },
    flowLabel: { zh: "AI 音频总流程图解流程", en: "AI audio overall flow diagram" },
    flow: [
      {
        title: { zh: "麦克风 / Codec / ADC", en: "Mic / Codec / ADC" },
        detail: { zh: "把空气压力变化变成数字采样", en: "Turns air-pressure changes into digital samples" }
      },
      {
        title: { zh: "PCM 数字音频", en: "PCM digital audio" },
        detail: { zh: "原始波形数据，不直接等于语义", en: "Raw waveform data, not semantic meaning" }
      },
      {
        title: { zh: "切片 / 标准化", en: "Segment / normalize" },
        detail: { zh: "按流式或离线任务组织输入", en: "Organizes input for streaming or offline tasks" }
      },
      {
        title: { zh: "任务表示", en: "Task representation" },
        detail: { zh: "按需选波形、频谱、embedding 或 token", en: "Selects waveform, spectra, embeddings, or tokens" }
      },
      {
        title: { zh: "任务模型", en: "Task model" },
        detail: { zh: "ASR、分类、增强、编码或生成", en: "ASR, classification, enhancement, coding, or generation" }
      },
      {
        title: { zh: "后处理 / 输出", en: "Post-process / output" },
        detail: { zh: "文字、类别、增强 PCM、token 或新音频", en: "Text, labels, enhanced PCM, tokens, or new audio" }
      }
    ],
    technical: {
      input: { zh: "PCM 波形 x[n]，以及任务需要的文本、标签或条件信息", en: "PCM waveform x[n], plus task-specific text, labels, or conditioning" },
      representation: { zh: "按任务选择原始波形、STFT/log-mel、学习型 embedding 或 codec token", en: "Task-dependent raw waveform, STFT/log-mel, learned embeddings, or codec tokens" },
      output: { zh: "文字、类别与时间戳、增强 PCM、离散码流或生成音频", en: "Text, labels and timestamps, enhanced PCM, discrete streams, or generated audio" },
      objective: { zh: "监督分类/对齐、自监督表征、重建与感知损失，或生成式建模", en: "Supervised classification/alignment, self-supervision, reconstruction and perceptual losses, or generative modeling" },
      metrics: { zh: "必须按任务选指标：WER、F1、SI-SDR、MOS、码率等不能混用", en: "Metrics are task-specific: WER, F1, SI-SDR, MOS, and bitrate are not interchangeable" },
      deployment: { zh: "明确流式或离线、端侧或云端，并核算延迟、RTF、内存、功耗与隐私", en: "Specify streaming or offline and edge or cloud; budget latency, RTF, memory, power, and privacy" }
    },
    equations: [
      {
        expression: "X(m,k) = Σₙ x[n + mH]w[n]e^(-j2πkn/N)",
        title: { zh: "短时傅里叶变换 STFT", en: "Short-time Fourier transform" },
        explanation: { zh: "m 是时间帧，k 是频率 bin，H 是 hop size，N 是窗口长度。它是可选声学表示，不是所有 AI 音频模型的必经步骤。", en: "m is the frame, k the frequency bin, H the hop size, and N the window length. It is an optional representation, not a mandatory stage for every AI audio model." }
      },
      {
        expression: "ŷ = fθ(R(x), c)",
        title: { zh: "统一任务表达", en: "Unified task expression" },
        explanation: { zh: "R(x) 表示波形、频谱或 token，c 是文本等条件，模型 fθ 根据任务输出识别、增强、编码或生成结果。", en: "R(x) is a waveform, spectrum, or token representation; c is optional conditioning, and fθ produces task-specific recognition, enhancement, coding, or generation output." }
      },
      {
        expression: "Lend-to-end = Lcapture + Lframe + Lmodel + Ldecode + Loutput",
        title: { zh: "端到端延迟预算", en: "End-to-end latency budget" },
        explanation: { zh: "实时性不是只看模型推理时间，还要计算采集缓存、分帧、解码与播放缓存。", en: "Real-time performance includes capture buffering, framing, decoding, and playback buffering, not model inference alone." }
      }
    ],
    models: [
      {
        name: "Whisper",
        task: { zh: "通用语音识别和翻译", en: "General speech recognition and translation" },
        principle: {
          zh: "把音频转成 log-mel 频谱，再用 Transformer 做序列到文本建模。",
          en: "Converts audio to log-mel spectra, then uses a Transformer for sequence-to-text modeling."
        },
        deployment: {
          zh: "适合离线转写、多语言字幕和音频内容检索。",
          en: "Fits offline transcription, multilingual captions, and audio content retrieval."
        },
        caution: {
          zh: "长音频、强噪声和专有名词仍需要分段、热词或后处理。",
          en: "Long audio, heavy noise, and proper nouns still need segmentation, hotwords, or post-processing."
        }
      },
      {
        name: "wav2vec 2.0",
        task: { zh: "自监督语音表征", en: "Self-supervised speech representation" },
        principle: {
          zh: "先从大量未标注语音中学习声学表示，再用少量标注数据微调 ASR。",
          en: "Learns acoustic representations from unlabeled speech, then fine-tunes ASR with labeled data."
        },
        deployment: {
          zh: "适合标注数据较少的语种、领域和端侧 ASR 训练参考。",
          en: "Useful for low-label languages, domains, and edge ASR training references."
        },
        caution: {
          zh: "它更像基础表示模型，落地时通常还要接解码器和语言后处理。",
          en: "It is closer to a representation model; deployment still needs decoders and language post-processing."
        }
      },
      {
        name: "CLAP",
        task: { zh: "文本和音频跨模态检索", en: "Text-audio cross-modal retrieval" },
        principle: {
          zh: "把音频和文字描述映射到同一 embedding 空间，用相似度匹配声音含义。",
          en: "Maps audio and text captions into one embedding space and matches meaning by similarity."
        },
        deployment: {
          zh: "适合用文字搜索音效、做声音标签扩展和多模态内容理解。",
          en: "Fits text-based sound search, label expansion, and multimodal content understanding."
        },
        caution: {
          zh: "它偏理解和检索，不直接替代 ASR、降噪或编码器。",
          en: "It targets understanding and retrieval, not direct ASR, denoising, or coding replacement."
        }
      },
      {
        name: "EnCodec",
        task: { zh: "神经音频编码和生成式 token", en: "Neural audio coding and generative tokens" },
        principle: {
          zh: "用神经编码器、残差量化和解码器把 PCM 压成离散 code，再重建音频。",
          en: "Uses neural encoders, residual quantization, and decoders to compress PCM into discrete codes."
        },
        deployment: {
          zh: "常作为低码率音频、音乐生成和语音生成的中间表示。",
          en: "Often serves as an intermediate representation for low-bitrate audio, music generation, and speech generation."
        },
        caution: {
          zh: "需要模型解码，不能像 WAV/MP3 一样被普通播放器直接解析。",
          en: "Needs a neural decoder; ordinary players cannot parse it like WAV or MP3."
        }
      },
      {
        name: "SoundStream",
        task: { zh: "实时神经音频 codec", en: "Real-time neural audio codec" },
        principle: {
          zh: "用端到端神经 codec 在低码率下保持语音和一般音频质量。",
          en: "Uses an end-to-end neural codec to preserve speech and general audio quality at low bitrates."
        },
        deployment: {
          zh: "适合理解神经 codec 如何服务实时通信和弱网音频。",
          en: "Useful for understanding neural codecs in real-time communication and weak-network audio."
        },
        caution: {
          zh: "实时部署要重点看算法延迟、算力和跨设备一致性。",
          en: "Real-time deployment depends on algorithmic latency, compute, and cross-device consistency."
        }
      }
    ],
    sections: [
      {
        title: sectionTitles.overview,
        body: {
          zh: "AI 音频不是单一算法，而是一组把音频信号转换成可识别、可生成、可增强或可压缩表示的技术。最前面通常是麦克风和 Codec/ADC，把声音采集为 PCM；之后再把 PCM 转成更适合模型处理的特征或 embedding。",
          en: "AI audio is not one algorithm. It is a set of techniques that turns audio signals into recognizable, generatable, enhanceable, or compressible representations. The front end usually captures sound as PCM through microphones and codec/ADC hardware, then converts PCM into features or embeddings suitable for models."
        }
      },
      {
        title: sectionTitles.principle,
        body: {
          zh: "PCM 只是采样值序列，不包含“文字”“事件类别”或“干净语音”这些含义。ASR 和事件识别常分析短时频谱或 Mel 特征，时域增强可以直接学习波形表示，神经编码与生成还会使用离散 codec token；表示方式由任务目标决定。",
          en: "PCM is only a sample sequence; it does not directly contain words, event labels, or clean speech. ASR and event detection often analyze short-time spectra or Mel features, time-domain enhancement may learn waveform representations directly, and neural coding or generation may use discrete codec tokens. The task determines the representation."
        }
      },
      {
        title: sectionTitles.technologies,
        body: {
          zh: "常见技术包括 FFT/STFT、Mel 滤波、MFCC、CNN、Transformer、CTC/RNNT、扩散模型、神经声码器、神经 codec、mask 估计和 embedding 学习。声音事件识别常把频谱图当二维特征图，但 ASR、降噪、编码和生成并不完全等同于图像分类。",
          en: "Common techniques include FFT/STFT, Mel filtering, MFCCs, CNNs, Transformers, CTC/RNNT, diffusion models, neural vocoders, neural codecs, mask estimation, and embedding learning. Sound event detection often treats spectrograms as 2D feature maps, but ASR, denoising, coding, and generation are not all image classification."
        }
      },
      {
        title: sectionTitles.applications,
        body: {
          zh: "应用包括会议转写、实时字幕、语音助手、TTS 播报、AI 降噪耳机、摄像头哭声/玻璃破碎检测、智能座舱、内容生成、低码率通信和音频编辑。",
          en: "Applications include meeting transcription, live captions, voice assistants, TTS prompts, AI denoising headsets, baby-cry or glass-break detection in cameras, smart cabins, content generation, low-bitrate communication, and audio editing."
        }
      },
      {
        title: sectionTitles.challenges,
        body: {
          zh: "主要挑战是噪声、远场、多说话人、口音、低功耗、实时延迟、误报漏报、隐私、数据授权和模型伪影。产品不能只看模型准确率，还要看设备麦克风、算力、网络和用户场景。",
          en: "Key challenges include noise, far-field capture, multiple speakers, accents, low power, real-time latency, false alarms, misses, privacy, data licensing, and model artifacts. Products cannot judge only model accuracy; microphones, compute, network, and user context matter."
        }
      },
      {
        title: sectionTitles.trends,
        body: {
          zh: "趋势包括端侧小模型、多模态音频理解、神经 codec token、实时生成、个性化声音、音频大模型和 SoC/NPU/DSP 协同部署。",
          en: "Trends include edge models, multimodal audio understanding, neural codec tokens, real-time generation, personalized voices, audio foundation models, and SoC/NPU/DSP co-deployment."
        }
      }
    ]
  },
  asr: {
    title: { zh: "语音识别 ASR 实验室", en: "Speech Recognition ASR Lab" },
    eyebrow: { zh: "语音转文字", en: "Speech to text" },
    summary: {
      zh: "解释语音如何从 PCM 变成声学特征，再经过识别模型、解码和后处理输出文字。",
      en: "Explains how speech moves from PCM to acoustic features, recognition models, decoding, and final text."
    },
    flowLabel: { zh: "语音识别 ASR 图解流程", en: "ASR diagram flow" },
    flow: [
      {
        title: { zh: "PCM 输入", en: "PCM input" },
        detail: { zh: "16 kHz 单声道语音常见", en: "16 kHz mono speech is common" }
      },
      {
        title: { zh: "模型前端", en: "Model front end" },
        detail: { zh: "频谱路线常用 25 ms 窗、10 ms 步长；按模型配置", en: "Spectral routes often use 25 ms windows / 10 ms hops; match the model" }
      },
      {
        title: { zh: "声学表示", en: "Acoustic representation" },
        detail: { zh: "log-Mel、MFCC 或波形学习前端，不是依次必经", en: "Log-Mel, MFCC, or learned waveform features; alternatives, not mandatory sequential steps" }
      },
      {
        title: { zh: "Encoder 编码器", en: "Encoder" },
        detail: { zh: "建模上下文声学表示", en: "Models contextual acoustic states" }
      },
      {
        title: { zh: "识别头 / Decoder", en: "Recognition head / decoder" },
        detail: { zh: "CTC、RNN-T 或 Attention 等路线输出 token", en: "CTC, RNN-T, or attention-based routes emit tokens" }
      },
      {
        title: { zh: "文本后处理", en: "Text post-processing" },
        detail: { zh: "规范化；按需补标点与对齐。热词也可在解码时介入", en: "Normalization; optional punctuation/alignment. Hotwords can also guide decoding" }
      }
    ],
    technical: {
      input: { zh: "常见为 16 kHz 单声道 PCM 分块，可附语言、热词和说话人上下文", en: "Commonly chunked 16 kHz mono PCM with optional language, hotword, and speaker context" },
      representation: { zh: "log-mel 特征或从波形学习的声学表示，经 Encoder 形成上下文状态", en: "Log-mel or waveform-learned acoustic features encoded into contextual states" },
      output: { zh: "字符、音素或 subword token 概率，再解码成文字、时间戳和标点", en: "Character, phoneme, or subword token probabilities decoded into text, timestamps, and punctuation" },
      objective: { zh: "CTC、RNNT 与注意力交叉熵是不同训练路线，不应视为同一个算法", en: "CTC, RNNT, and attention cross-entropy are distinct training paths, not one algorithm" },
      metrics: { zh: "WER/CER、首字与句末延迟、RTF、热词召回和流式结果回滚率", en: "WER/CER, first-token and final latency, RTF, hotword recall, and streaming revision rate" },
      deployment: { zh: "流式系统需要控制 chunk、右侧上下文和状态缓存；离线系统更重视全局上下文", en: "Streaming controls chunks, right context, and state caches; offline systems can exploit full context" }
    },
    equations: [
      {
        expression: "P(y|x) = Σπ∈B⁻¹(y) ∏ₜ P(πₜ|x)",
        title: { zh: "CTC 对齐", en: "CTC alignment" },
        explanation: { zh: "同一句文字 y 可以对应多条含 blank 和重复 token 的帧级路径 π；CTC 把这些合法路径的概率相加。", en: "One transcript y can map to many frame-level paths π containing blanks and repeats; CTC sums the probabilities of all valid paths." }
      },
      {
        expression: "WER = (S + D + I) / N",
        title: { zh: "词错误率", en: "Word error rate" },
        explanation: { zh: "S、D、I 分别是替换、删除和插入词数，N 是参考文本词数；中文也常按字计算 CER。", en: "S, D, and I count substitutions, deletions, and insertions; N is the reference word count. Character error rate is often used for Chinese." }
      },
      {
        expression: "RTF = Tprocess / Taudio",
        title: { zh: "实时因子", en: "Real-time factor" },
        explanation: { zh: "RTF 小于 1 表示处理速度快于音频时长，但不等于首字延迟一定低。", en: "RTF below 1 means processing is faster than audio duration, but it does not guarantee low first-token latency." }
      }
    ],
    models: [
      {
        name: "Conformer / RNNT",
        task: { zh: "低延迟流式 ASR", en: "Low-latency streaming ASR" },
        principle: {
          zh: "Conformer 同时看局部卷积特征和全局上下文，RNNT 边接收帧边输出 token。",
          en: "Conformer combines local convolutional cues and global context; RNNT emits tokens while frames arrive."
        },
        deployment: {
          zh: "适合语音助手、实时字幕、车载语音和会议增量转写。",
          en: "Fits voice assistants, live captions, in-car speech, and incremental meeting transcription."
        },
        caution: {
          zh: "要同时优化首字延迟、临时结果稳定性和热词召回。",
          en: "Must tune first-token latency, partial-result stability, and hotword recall together."
        }
      },
      {
        name: "wav2vec 2.0",
        task: { zh: "少标注语音识别训练", en: "Low-label speech recognition training" },
        principle: {
          zh: "从未标注波形学习语音表示，再用标注文本做 CTC 等监督微调。",
          en: "Learns speech representations from unlabeled waveform, then fine-tunes with labeled text and CTC-like losses."
        },
        deployment: {
          zh: "适合冷门语种、行业语音和需要自建模型的数据启动阶段。",
          en: "Fits low-resource languages, domain speech, and early self-built ASR datasets."
        },
        caution: {
          zh: "自监督表示不等于完整 ASR 产品，还要补解码、标点和领域词。",
          en: "Self-supervised representation is not a full ASR product; decoding, punctuation, and domain words are still needed."
        }
      },
      {
        name: "Whisper",
        task: { zh: "多语言离线转写", en: "Multilingual offline transcription" },
        principle: {
          zh: "把 30 秒左右音频片段转成 log-mel，再用编码器-解码器 Transformer 输出文本 token。",
          en: "Converts roughly 30-second chunks to log-mel features, then uses an encoder-decoder Transformer to emit text tokens."
        },
        deployment: {
          zh: "适合录音转写、字幕生成、内容审核和多语言素材整理。",
          en: "Fits recording transcription, captioning, moderation, and multilingual media organization."
        },
        caution: {
          zh: "实时低延迟不是它的唯一目标，工程上常要做分段、队列和后处理。",
          en: "Ultra-low latency is not its only goal; production often needs chunking, queues, and post-processing."
        }
      },
      {
        name: "Paraformer / FunASR",
        task: { zh: "中文和工业级 ASR 参考", en: "Chinese and industrial ASR reference" },
        principle: {
          zh: "Paraformer 通过非自回归预测提升解码效率，FunASR 提供端点、标点、说话人等工程链路。",
          en: "Paraformer improves decoding efficiency with non-autoregressive prediction; FunASR supplies endpointing, punctuation, diarization, and engineering pipelines."
        },
        deployment: {
          zh: "适合中文会议、客服、设备命令词和本地化 ASR 方案评估。",
          en: "Fits Chinese meetings, support calls, device commands, and localized ASR evaluation."
        },
        caution: {
          zh: "不同模型大小、授权和部署后端会影响端侧可用性。",
          en: "Model size, license, and deployment backend affect edge usability."
        }
      },
      {
        name: "GPT-4o transcribe",
        task: { zh: "云端高质量语音转文字", en: "Cloud high-quality speech-to-text" },
        principle: {
          zh: "面向语音转写任务的端到端模型，直接从音频输入输出文字结果。",
          en: "An end-to-end model for transcription that maps audio input to text output."
        },
        deployment: {
          zh: "适合云端转写、复杂口音、多语言内容和需要快速集成的产品。",
          en: "Fits cloud transcription, complex accents, multilingual content, and fast product integration."
        },
        caution: {
          zh: "云服务要关注费用、延迟、隐私合规和网络可用性。",
          en: "Cloud service use needs attention to cost, latency, privacy compliance, and network availability."
        }
      }
    ],
    sections: [
      {
        title: sectionTitles.overview,
        body: {
          zh: "ASR 的目标是把人说的话转换成可编辑、可检索、可控制设备的文字。它适合语音助手、会议纪要、字幕、客服质检和车载语音。",
          en: "ASR converts spoken language into editable, searchable text or device commands. It is used in voice assistants, meeting notes, captions, support QA, and in-car voice UI."
        }
      },
      {
        title: sectionTitles.principle,
        body: {
          zh: "先按模型选择前端：可提取 log-Mel/MFCC，也可直接从 PCM 学习表示；不是所有模型都需要傅里叶变换。频谱路线要区分窗长与步长，例如 25 ms 窗每 10 ms 移动一次。Encoder 建模上下文，CTC、RNN-T 或 Attention Decoder 按各自规则生成 token。标点可能由模型直接输出，也可后处理；热词可参与解码，时间戳通常需要专门输出或对齐。",
          en: "Choose the model front end: log-Mel/MFCC or features learned directly from PCM; Fourier transforms are not mandatory. Distinguish window length from hop, e.g. a 25 ms window every 10 ms. An encoder supplies context and CTC, RNN-T, or an attention decoder emits tokens under different rules. Punctuation may be generated or post-processed; hotwords may guide decoding, while timestamps require dedicated outputs or alignment."
        }
      },
      {
        title: sectionTitles.technologies,
        body: {
          zh: "核心技术包括端点检测、特征提取、Conformer/Transformer Encoder、CTC、RNNT、语言模型重打分、热词增强、说话人分离和标点恢复。",
          en: "Core techniques include endpointing, feature extraction, Conformer/Transformer encoders, CTC, RNNT, language-model rescoring, hotword boosting, speaker diarization, and punctuation restoration."
        }
      },
      {
        title: sectionTitles.applications,
        body: {
          zh: "离线转写适合会议纪要和录音整理；流式字幕强调首字延迟和增量稳定性；唤醒词/命令词适合端侧小模型和隐私优先场景。",
          en: "Offline transcription fits meeting notes and recording cleanup; streaming captions emphasize first-token latency and incremental stability; wake words and commands fit small edge models and privacy-first products."
        }
      },
      {
        title: sectionTitles.challenges,
        body: {
          zh: "困难来自噪声、混响、远场、重叠说话、口音、专有名词和实时性。指标不能只看 WER/CER，还要看首字延迟、RTF、热词召回和临时结果回滚。",
          en: "Difficulties come from noise, reverberation, far-field capture, overlapping speech, accents, proper nouns, and real-time constraints. Metrics include not only WER/CER but also first-token latency, RTF, hotword recall, and partial-result rollback."
        }
      },
      {
        title: sectionTitles.trends,
        body: {
          zh: "趋势是多语言统一模型、端云协同、低延迟流式大模型、语音到语义理解一体化，以及和多模态助手结合。",
          en: "Trends include multilingual unified models, edge-cloud collaboration, low-latency streaming foundation models, integrated speech-to-semantic understanding, and multimodal assistants."
        }
      }
    ]
  },
  tts: {
    title: { zh: "语音合成 TTS 实验室", en: "Text-to-Speech TTS Lab" },
    eyebrow: { zh: "文本到语音", en: "Text to speech" },
    summary: {
      zh: "解释文本如何经过规范化、韵律预测、声学模型和声码器生成自然语音。",
      en: "Explains how text becomes natural speech through normalization, prosody prediction, acoustic models, and vocoders."
    },
    flowLabel: { zh: "语音合成 TTS 图解流程", en: "TTS diagram flow" },
    flow: [
      {
        title: { zh: "输入文本", en: "Input text" },
        detail: { zh: "数字、单位、缩写和标点", en: "Numbers, units, abbreviations, punctuation" }
      },
      {
        title: { zh: "文本规范化", en: "Text normalization" },
        detail: { zh: "转为可朗读内容", en: "Converts text into speakable form" }
      },
      {
        title: { zh: "韵律 / 音素", en: "Prosody / phonemes" },
        detail: { zh: "读音、停顿、重音", en: "Pronunciation, pauses, stress" }
      },
      {
        title: { zh: "声学模型", en: "Acoustic model" },
        detail: { zh: "预测 Mel 谱或 codec token", en: "Predicts Mel spectra or codec tokens" }
      },
      {
        title: { zh: "波形重建", en: "Waveform reconstruction" },
        detail: { zh: "Mel → 声码器；codec token → 匹配的 codec 解码器", en: "Mel → vocoder; codec tokens → matching codec decoder" }
      }
    ],
    technical: {
      input: { zh: "规范化文本或音素，以及说话人、语言、情绪和韵律条件", en: "Normalized text or phonemes plus speaker, language, emotion, and prosody conditions" },
      representation: { zh: "音素隐藏状态、时长/音高/能量，以及 Mel 谱或离散 codec token", en: "Phoneme states, duration/pitch/energy, and Mel spectra or discrete codec tokens" },
      output: { zh: "声码器或神经 codec 解码得到的 PCM 波形", en: "PCM waveform decoded by a vocoder or neural codec" },
      objective: { zh: "声学重建损失叠加时长、音高、能量损失；端到端模型还可能使用对抗损失", en: "Acoustic reconstruction plus duration, pitch, and energy losses; end-to-end models may add adversarial losses" },
      metrics: { zh: "MOS/CMOS、可懂度、说话人相似度、发音错误率、RTF 与首段音频延迟", en: "MOS/CMOS, intelligibility, speaker similarity, pronunciation errors, RTF, and time to first audio" },
      deployment: { zh: "区分整句与流式合成，关注长文本稳定性、声码器算力、授权和滥用防护", en: "Distinguish sentence and streaming synthesis; consider long-form stability, vocoder cost, consent, and misuse controls" }
    },
    equations: [
      {
        expression: "Tmel ≈ Σᵢ dᵢ",
        title: { zh: "时长展开", en: "Duration expansion" },
        explanation: { zh: "以 FastSpeech 类显式时长模型为例：每个音素展开为 dᵢ 个声学帧，时长之和决定帧数；并非所有 TTS 都有独立时长预测器。", en: "For explicit-duration models such as FastSpeech, each phoneme expands to dᵢ acoustic frames; the sum determines frame count. Not every TTS uses a separate duration predictor." }
      },
      {
        expression: "L = ||M - M̂||₁ + λdLduration + λf0Lpitch + λeLenergy",
        title: { zh: "声学模型训练目标", en: "Acoustic-model objective" },
        explanation: { zh: "这是 FastSpeech 2 类路线的示意目标：M 为目标 Mel 谱。自回归 token、扩散与 flow matching 模型使用不同目标，不能套用同一公式。", en: "An illustrative FastSpeech 2-style objective, with target Mel spectrum M. Autoregressive-token, diffusion, and flow-matching models use different objectives; this formula is not universal." }
      },
      {
        expression: "x̂ = Gθ(M, es, p)",
        title: { zh: "波形生成", en: "Waveform synthesis" },
        explanation: { zh: "声码器 Gθ 把声学表示 M、说话人向量 es 和韵律条件 p 转成最终波形。", en: "Vocoder Gθ converts acoustic representation M, speaker embedding es, and prosody p into waveform audio." }
      }
    ],
    models: [
      {
        name: "FastSpeech 2",
        task: { zh: "高效文本到 Mel 谱", en: "Efficient text-to-Mel synthesis" },
        principle: {
          zh: "非自回归地预测音素时长、音高、能量和 Mel 谱，速度比逐步生成更适合工程部署。",
          en: "Predicts phoneme duration, pitch, energy, and Mel spectra non-autoregressively, making it deployment-friendly."
        },
        deployment: {
          zh: "适合语音播报、客服提示音和需要稳定批量生成的 TTS。",
          en: "Fits prompts, support voices, and stable batch TTS generation."
        },
        caution: {
          zh: "自然度还依赖文本前端、韵律数据和后端声码器质量。",
          en: "Naturalness still depends on text front ends, prosody data, and the vocoder."
        }
      },
      {
        name: "VITS",
        task: { zh: "端到端自然语音合成", en: "End-to-end natural speech synthesis" },
        principle: {
          zh: "把声学模型和声码器联合训练，用变分推断和对抗训练提升自然度。",
          en: "Jointly trains acoustic modeling and vocoding with variational inference and adversarial training."
        },
        deployment: {
          zh: "常用于开源中文/多说话人 TTS、角色音色和内容创作工具。",
          en: "Common in open-source Chinese or multi-speaker TTS, character voices, and creator tools."
        },
        caution: {
          zh: "数据授权、相似音色滥用和长文本稳定性需要额外控制。",
          en: "Data licensing, voice-similarity misuse, and long-form stability need extra control."
        }
      },
      {
        name: "HiFi-GAN",
        task: { zh: "神经声码器", en: "Neural vocoder" },
        principle: {
          zh: "把 Mel 谱还原成 waveform，通过对抗训练生成更自然的细节。",
          en: "Reconstructs waveform from Mel spectra and uses adversarial training for natural detail."
        },
        deployment: {
          zh: "常接在 FastSpeech、Tacotron 或其他声学模型后面做最终出声。",
          en: "Often follows FastSpeech, Tacotron, or other acoustic models as the final audio generator."
        },
        caution: {
          zh: "声码器不能修复所有前端错误，输入 Mel 谱不准会直接影响音质。",
          en: "A vocoder cannot fix all front-end errors; poor Mel input directly hurts audio quality."
        }
      },
      {
        name: "VALL-E",
        task: { zh: "语音提示克隆和 codec token TTS", en: "Prompted voice cloning and codec-token TTS" },
        principle: {
          zh: "把语音看成 codec token 序列，用短参考音频条件生成目标说话人风格。",
          en: "Treats speech as codec-token sequences and conditions generation on a short reference voice."
        },
        deployment: {
          zh: "适合理解零样本声音克隆、个性化 TTS 和生成式语音趋势。",
          en: "Useful for understanding zero-shot voice cloning, personalized TTS, and generative speech trends."
        },
        caution: {
          zh: "人物声音同意、鉴伪、水印和内容安全是落地前提。",
          en: "Speaker consent, detection, watermarking, and safety are prerequisites for deployment."
        }
      },
      {
        name: "GPT-4o mini TTS",
        task: { zh: "云端可控语音合成", en: "Cloud controllable speech synthesis" },
        principle: {
          zh: "把文本和风格指令转成语音输出，面向对话和应用集成。",
          en: "Turns text plus style instructions into speech for dialogue and app integration."
        },
        deployment: {
          zh: "适合客服播报、内容配音、语音助手和快速原型。",
          en: "Fits support prompts, content dubbing, voice assistants, and rapid prototypes."
        },
        caution: {
          zh: "需要关注成本、延迟、可控性边界和声音授权。",
          en: "Requires attention to cost, latency, controllability limits, and voice rights."
        }
      }
    ],
    sections: [
      {
        title: sectionTitles.overview,
        body: {
          zh: "TTS 把文字变成自然语音，可用于导航、客服、无障碍阅读、播报、配音和数字人。",
          en: "TTS turns text into natural speech for navigation, support prompts, accessibility, announcements, dubbing, and avatars."
        }
      },
      {
        title: sectionTitles.principle,
        body: {
          zh: "系统先决定文字该怎么读，再决定声音该怎么响。文本前端处理数字和多音字，韵律模块预测停顿和语调，声学模型生成声音表示，声码器把表示还原成波形。",
          en: "The system first decides how text should be read, then how it should sound. The text front end handles numbers and pronunciations, prosody predicts pauses and intonation, the acoustic model creates sound representations, and the vocoder reconstructs waveform audio."
        }
      },
      {
        title: sectionTitles.technologies,
        body: {
          zh: "核心技术包括文本规范化、G2P、音素/拼音、韵律预测、FastSpeech/Tacotron 类声学模型、HiFi-GAN/神经声码器、音色 embedding 和 codec token TTS。",
          en: "Core techniques include text normalization, G2P, phonemes or pinyin, prosody prediction, FastSpeech/Tacotron-style acoustic models, HiFi-GAN/neural vocoders, speaker embeddings, and codec-token TTS."
        }
      },
      {
        title: sectionTitles.applications,
        body: {
          zh: "常见应用有语音播报、有声书、智能客服、车载提示、儿童故事、数字人和多语言配音。",
          en: "Applications include speech prompts, audiobooks, intelligent support, in-car prompts, children stories, avatars, and multilingual dubbing."
        }
      },
      {
        title: sectionTitles.challenges,
        body: {
          zh: "挑战包括长文本稳定性、断句、情感自然度、实时延迟、音色授权、相似度滥用和跨语言发音。",
          en: "Challenges include long-form stability, phrasing, emotional naturalness, real-time latency, voice consent, similarity misuse, and cross-lingual pronunciation."
        }
      },
      {
        title: sectionTitles.trends,
        body: {
          zh: "趋势是可控情感、多说话人、零样本声音克隆、端侧实时 TTS、与大语言模型对话系统融合。",
          en: "Trends include controllable emotion, multi-speaker systems, zero-shot voice cloning, edge real-time TTS, and integration with LLM dialogue systems."
        }
      }
    ]
  },
  generation: {
    title: { zh: "音频生成实验室", en: "Audio Generation Lab" },
    eyebrow: { zh: "生成式音频", en: "Generative audio" },
    summary: {
      zh: "解释文本、旋律、参考音色或视频条件如何驱动模型生成音乐、音效、人声和环境声。",
      en: "Explains how text, melody, reference timbre, or video conditioning drives models to generate music, effects, voices, and ambience."
    },
    flowLabel: { zh: "音频生成图解流程", en: "Audio generation diagram flow" },
    flow: [
      {
        title: { zh: "条件输入", en: "Conditioning" },
        detail: { zh: "文本、旋律、参考音色", en: "Text, melody, reference timbre" }
      },
      {
        title: { zh: "条件编码", en: "Condition encoding" },
        detail: { zh: "转成模型可用表示", en: "Converts conditions to model states" }
      },
      {
        title: { zh: "生成模型", en: "Generative model" },
        detail: { zh: "Transformer 或 Diffusion", en: "Transformer or diffusion" }
      },
      {
        title: { zh: "声学重建", en: "Acoustic reconstruction" },
        detail: { zh: "声码器或 codec 解码", en: "Vocoder or codec decoding" }
      },
      {
        title: { zh: "安全与交付", en: "Safety and delivery" },
        detail: { zh: "水印、响度、格式", en: "Watermarking, loudness, format" }
      }
    ],
    technical: {
      input: { zh: "文本、旋律、参考音频、视频、节拍或局部编辑掩码", en: "Text, melody, reference audio, video, tempo, or local edit masks" },
      representation: { zh: "连续潜变量、Mel 谱或神经 codec 离散 token", en: "Continuous latents, Mel spectra, or discrete neural-codec tokens" },
      output: { zh: "音乐、环境声、音效或编辑后的 PCM 音频", en: "Music, ambience, sound effects, or edited PCM audio" },
      objective: { zh: "token 似然、Flow Matching 速度场或扩散目标，按模型与训练阶段选择", en: "Token likelihood, flow-matching velocity fields or diffusion objectives, depending on model and training stage" },
      metrics: { zh: "主观偏好、FAD、文本-音频对齐、生成多样性、结构一致性和生成速度", en: "Human preference, FAD, text-audio alignment, diversity, structural consistency, and generation speed" },
      deployment: { zh: "区分离线创作与交互生成，并处理时长、显存、来源标记、版权和安全过滤", en: "Separate offline creation from interactive generation; handle duration, memory, provenance, licensing, and safety filters" }
    },
    equations: [
      {
        expression: "LAR = -Σₜ log P(zₜ | z<t, c)",
        title: { zh: "自回归 token 建模", en: "Autoregressive token modeling" },
        explanation: { zh: "zₜ 是当前 codec token，模型根据过去 token 和条件 c 预测下一个 token；序列越长，生成成本越高。", en: "zₜ is the current codec token; the model predicts it from prior tokens and condition c. Longer sequences cost more to generate." }
      },
      {
        expression: "Ldiff = E[||ε - εθ(zt, t, c)||²]",
        title: { zh: "扩散模型训练", en: "Diffusion training" },
        explanation: { zh: "噪声预测参数化的一种目标：zₜ = √ᾱₜ z₀ + √(1−ᾱₜ) ε，模型预测构造 zₜ 时的整体噪声 ε。t 是扩散步，不是音频采样时刻；并非所有生成模型都预测 ε。", en: "One noise-prediction objective: zₜ = √ᾱₜ z₀ + √(1−ᾱₜ) ε, predicting the total noise used to construct zₜ. Here t is a diffusion step, not an audio sample time; not all generative models predict ε." }
      },
      {
        expression: "Lflow = E[||vθ(xτ, τ, c) − (ε − x₀)||²]",
        title: { zh: "Flow Matching 基础目标", en: "Basic flow-matching objective" },
        explanation: { zh: "线性路径教学式：xτ = (1−τ)x₀ + τε，τ=0 是数据、τ=1 是噪声，模型学习速度 ε−x₀；生成时从噪声反向积分。它不是 ACE-Step 蒸馏训练的全部损失。", en: "Teaching linear path: xτ = (1−τ)x₀ + τε, with data at τ=0 and noise at τ=1. The model learns velocity ε−x₀; generation integrates back from noise. This is not the complete ACE-Step distillation loss." }
      }
    ],
    models: [
      {
        name: "ACE-Step 1.5 · 2026",
        task: { zh: "文本条件音乐生成与编辑", en: "Text-conditioned music generation and editing" },
        principle: {
          zh: "可选 LM 规划语义码与音乐条件，DiT 经 Flow Matching 生成连续潜变量，1D 波形 VAE 输出 48 kHz 双声道 PCM。",
          en: "An optional LM plans semantic codes and musical conditions; a DiT uses flow matching to generate continuous latents, and a waveform VAE outputs 48 kHz stereo PCM."
        },
        deployment: {
          zh: "适合配乐草稿、短视频音乐、音乐创意辅助和素材预览。",
          en: "Fits score drafts, short-video music, music ideation, and asset previews."
        },
        caution: {
          zh: "版权、训练数据授权和旋律相似性必须在产品侧处理。",
          en: "Copyright, training-data rights, and melody similarity must be handled at product level."
        }
      },
      {
        name: "AudioGen",
        task: { zh: "文本到音效/环境声", en: "Text-to-sound effects and ambience" },
        principle: {
          zh: "把文字场景条件映射到音频 token，生成非音乐类声音片段。",
          en: "Maps scene text conditions to audio tokens to generate non-music sound clips."
        },
        deployment: {
          zh: "适合游戏音效、视频补声、环境氛围和声音设计草稿。",
          en: "Fits game effects, video sound fill, ambience, and sound-design drafts."
        },
        caution: {
          zh: "生成结果需要人工筛选，瞬态、循环和真实感不总是稳定。",
          en: "Outputs need human selection; transients, looping, and realism are not always stable."
        }
      },
      {
        name: "Stable Audio 3 Medium · 2026",
        task: { zh: "文本条件音乐、音效与局部编辑", en: "Text-conditioned music, sound effects and inpainting" },
        principle: {
          zh: "DiT 在 SAME 连续潜空间生成，结合 Flow Matching、蒸馏和对抗后训练，SAME-L 解码为 44.1 kHz 双声道 PCM。",
          en: "A DiT generates continuous SAME latents using flow matching, distillation and adversarial post-training; SAME-L decodes 44.1 kHz stereo PCM."
        },
        deployment: {
          zh: "Medium 支持音乐和音效，可按目标时长生成或用掩码编辑局部片段。",
          en: "Medium supports music and sound effects, target-duration generation and masked local editing."
        },
        caution: {
          zh: "Small 分音乐与音效专用版，Large 仅 API；实际速度取决于硬件、时长和采样设置，权重授权需单独核对。",
          en: "Small has music/SFX-specific variants; Large is API-only. Speed depends on hardware, duration and sampling; check weight licenses separately."
        }
      },
      {
        name: "MusicLM",
        task: { zh: "长结构文本到音乐研究方向", en: "Long-form text-to-music research direction" },
        principle: {
          zh: "使用层级 token 和语义/声学表示，把文本描述转换成较长音乐结构。",
          en: "Uses hierarchical tokens and semantic/acoustic representations to turn text into longer musical structure."
        },
        deployment: {
          zh: "适合理解音乐生成的结构控制、长时一致性和语义条件。",
          en: "Useful for understanding structure control, long-term consistency, and semantic conditioning in music generation."
        },
        caution: {
          zh: "并非所有研究模型都直接开放商用，落地要看可用接口和授权。",
          en: "Not every research model is directly commercialized; deployment depends on APIs and licensing."
        }
      },
      {
        name: "MAGNeT / JASCO",
        task: { zh: "可控音乐生成", en: "Controllable music generation" },
        principle: {
          zh: "通过非自回归或多条件控制，让节奏、和弦、文本等条件更容易约束生成结果。",
          en: "Uses non-autoregressive or multi-condition control to constrain outputs with rhythm, chords, text, and related cues."
        },
        deployment: {
          zh: "适合音乐制作辅助、广告配乐和可编辑生成工作流。",
          en: "Fits assisted music production, ad scoring, and editable generation workflows."
        },
        caution: {
          zh: "可控性越强，交互设计和版权边界越需要清楚。",
          en: "More control raises the need for clear interaction design and copyright boundaries."
        }
      }
    ],
    sections: [
      {
        title: sectionTitles.overview,
        body: {
          zh: "音频生成的目标是创造新内容，而不是识别已有声音。它可以生成音乐草稿、环境声、游戏音效、角色人声、配乐和声音修复结果。",
          en: "Audio generation creates new content rather than recognizing existing sound. It can produce music drafts, ambience, game effects, character voices, scoring, and restoration results."
        }
      },
      {
        title: sectionTitles.principle,
        body: {
          zh: "模型根据文本、旋律、参考音色或场景描述形成条件表示，再逐步生成音频 token、频谱或 waveform。最后通过声码器、codec 解码器或扩散解码得到可播放音频。",
          en: "A model forms conditioning representations from text, melody, reference timbre, or scene descriptions, then generates audio tokens, spectra, or waveforms. A vocoder, codec decoder, or diffusion decoder produces playable audio."
        }
      },
      {
        title: sectionTitles.technologies,
        body: {
          zh: "核心技术包括文本编码器、音频 tokenizer、Transformer、自回归生成、扩散模型、神经声码器、风格控制、水印和内容安全检测。",
          en: "Core techniques include text encoders, audio tokenizers, Transformers, autoregressive generation, diffusion models, neural vocoders, style control, watermarking, and safety checks."
        }
      },
      {
        title: sectionTitles.applications,
        body: {
          zh: "应用包括短视频配乐、广告音效、游戏资产、虚拟主播、人声草稿、环境氛围和辅助声音设计。",
          en: "Applications include short-video scoring, ad sound effects, game assets, virtual hosts, voice drafts, ambience, and assisted sound design."
        }
      },
      {
        title: sectionTitles.challenges,
        body: {
          zh: "挑战包括版权、训练数据授权、声音相似性、人物声音同意、时长一致性、可控性、生成伪影和滥用检测。",
          en: "Challenges include copyright, training-data licensing, voice similarity, speaker consent, long-duration consistency, controllability, artifacts, and misuse detection."
        }
      },
      {
        title: sectionTitles.trends,
        body: {
          zh: "趋势是多模态生成、可编辑音频 token、实时互动声音、长结构音乐生成和带水印的可追溯内容。",
          en: "Trends include multimodal generation, editable audio tokens, real-time interactive sound, long-structure music generation, and watermark-based traceability."
        }
      }
    ]
  },
  event: {
    title: { zh: "AI 音频事件识别实验室", en: "AI Audio Event Detection Lab" },
    eyebrow: { zh: "非语音声音识别", en: "Non-speech sound recognition" },
    summary: {
      zh: "解释哭声、玻璃破碎、狗叫声、警报声等事件如何从频谱模式中被识别。",
      en: "Explains how events such as baby cries, glass breaks, dog barks, and alarms are recognized from spectral-temporal patterns."
    },
    flowLabel: { zh: "AI 音频事件识别图解流程", en: "AI audio event detection diagram flow" },
    flow: [
      {
        title: { zh: "环境 PCM 片段", en: "Scene PCM clip" },
        detail: { zh: "连续监听或触发录音", en: "Continuous monitoring or triggered clips" }
      },
      {
        title: { zh: "分帧 / STFT", en: "Frame / STFT" },
        detail: { zh: "形成短时频率结构", en: "Forms short-time frequency structure" }
      },
      {
        title: { zh: "log-mel 频谱图", en: "log-mel spectrogram" },
        detail: { zh: "二维时间频率能量图", en: "2D time-frequency energy map" }
      },
      {
        title: { zh: "分类模型", en: "Classifier" },
        detail: { zh: "CNN / Transformer 识别模式", en: "CNN / Transformer recognizes patterns" }
      },
      {
        title: { zh: "阈值与告警", en: "Threshold and alert" },
        detail: { zh: "输出类别、时间和置信度", en: "Outputs label, time, and confidence" }
      }
    ],
    technical: {
      input: { zh: "连续环境 PCM，按重叠窗口切片并保留时间位置", en: "Continuous scene PCM segmented into overlapping windows with timing retained" },
      representation: { zh: "log-mel patch 或预训练音频 embedding", en: "Log-mel patches or pretrained audio embeddings" },
      output: { zh: "类别分数；片段分类只说明是否出现，起止时间需要帧级检测或额外时序后处理", en: "Class scores; clip tagging indicates presence, while onset/offset times require frame-level detection or temporal post-processing" },
      objective: { zh: "多标签 sigmoid + BCE；类别极不均衡时可用加权 BCE 或 focal loss", en: "Multi-label sigmoid plus BCE; weighted BCE or focal loss for severe class imbalance" },
      metrics: { zh: "Precision、Recall、F1、mAP、事件错误率、每小时误报数和检测延迟", en: "Precision, recall, F1, mAP, event error rate, false alarms per hour, and detection latency" },
      deployment: { zh: "连续监听需设置阈值、迟滞、去抖和设备域校准，同时控制功耗与隐私", en: "Continuous listening needs thresholds, hysteresis, debounce, and device-domain calibration under power and privacy constraints" }
    },
    equations: [
      {
        expression: "pc = sigmoid(zc)",
        title: { zh: "多标签概率", en: "Multi-label probability" },
        explanation: { zh: "各类单独做 sigmoid，分数不要求相加为 1，多种声音可同时出现；这不代表事件在统计上独立。未经校准的分数也不能当作告警正确率。", en: "Each class has its own sigmoid; scores need not sum to one and multiple sounds can coexist. This does not imply statistical independence, and uncalibrated scores are not alert accuracy." }
      },
      {
        expression: "LBCE = -Σc[yc log pc + (1-yc)log(1-pc)]",
        title: { zh: "二元交叉熵", en: "Binary cross-entropy" },
        explanation: { zh: "yc 是类别真实标签，pc 是预测概率；正负样本不平衡时需要类别权重或重采样。", en: "yc is the target and pc the predicted probability; imbalanced classes need weighting or resampling." }
      },
      {
        expression: "F1 = 2PR / (P + R)",
        title: { zh: "告警效果平衡", en: "Alert tradeoff" },
        explanation: { zh: "P 是精确率、R 是召回率。安全告警还必须单独检查每小时误报数，不能只看 F1。", en: "P is precision and R recall. Safety alerts must also track false alarms per hour rather than relying on F1 alone." }
      }
    ],
    models: [
      {
        name: "YAMNet",
        task: { zh: "通用声音事件分类", en: "General sound event classification" },
        principle: {
          zh: "基于 MobileNet 的轻量模型，从 log-mel 特征中识别 AudioSet 类别。",
          en: "A lightweight MobileNet-based model that recognizes AudioSet classes from log-mel features."
        },
        deployment: {
          zh: "适合教学、原型、端侧声音标签和环境声粗分类。",
          en: "Fits education, prototypes, edge sound labels, and coarse scene classification."
        },
        caution: {
          zh: "通用类别不等于产品级告警，婴儿哭声或玻璃破碎需要场景数据校准。",
          en: "Generic classes are not product-grade alerts; baby cry or glass break needs scene-specific calibration."
        }
      },
      {
        name: "PANNs",
        task: { zh: "大规模音频标签识别", en: "Large-scale audio tagging" },
        principle: {
          zh: "用 CNN 在大规模弱标注数据上学习频谱时间模式，输出多标签声音类别。",
          en: "Uses CNNs trained on large weakly labeled data to learn spectral-temporal patterns and emit multi-label classes."
        },
        deployment: {
          zh: "适合音频标签、素材库检索、环境声识别和迁移学习。",
          en: "Fits audio tagging, asset search, scene recognition, and transfer learning."
        },
        caution: {
          zh: "弱标注数据会带来类别边界不清，落地要做阈值和误报验证。",
          en: "Weak labels blur class boundaries; deployment needs thresholding and false-alarm validation."
        }
      },
      {
        name: "AST",
        task: { zh: "Transformer 频谱图分类", en: "Transformer spectrogram classification" },
        principle: {
          zh: "把频谱图切成 patch，像视觉 Transformer 一样建模时间频率关系。",
          en: "Splits spectrograms into patches and models time-frequency relations like a vision Transformer."
        },
        deployment: {
          zh: "适合高精度事件分类、研究评估和算力较充足的边云场景。",
          en: "Fits high-accuracy event classification, research evaluation, and edge-cloud systems with enough compute."
        },
        caution: {
          zh: "模型较重，端侧实时监听要关注功耗和延迟。",
          en: "It is relatively heavy; edge continuous listening must watch power and latency."
        }
      },
      {
        name: "BEATs",
        task: { zh: "音频自监督/预训练理解", en: "Audio self-supervised pretraining and understanding" },
        principle: {
          zh: "通过离散音频标签和预训练学习通用音频表示，再迁移到事件识别。",
          en: "Learns general audio representations with discrete audio labels and pretraining, then transfers to event tasks."
        },
        deployment: {
          zh: "适合小数据事件识别、异常声检测和更细粒度声音理解。",
          en: "Fits small-data event detection, anomalous sound detection, and finer-grained audio understanding."
        },
        caution: {
          zh: "预训练模型仍要用目标设备采集的数据做验证和适配。",
          en: "Pretrained models still need validation and adaptation with target-device recordings."
        }
      },
      {
        name: "CLAP",
        task: { zh: "文本描述驱动的声音检索", en: "Text-prompted sound retrieval" },
        principle: {
          zh: "把声音片段和文字标签放到同一向量空间，用文本描述搜索或开放词表分类。",
          en: "Places sound clips and text labels in one vector space for text search or open-vocabulary classification."
        },
        deployment: {
          zh: "适合素材库搜索、开放类别筛选和给事件识别补充语义标签。",
          en: "Fits asset search, open-class filtering, and semantic label expansion for event detection."
        },
        caution: {
          zh: "开放词表结果需要阈值和人工规则保护，不能直接当安全告警。",
          en: "Open-vocabulary results need thresholds and rules; they should not directly trigger safety alarms."
        }
      }
    ],
    sections: [
      {
        title: sectionTitles.overview,
        body: {
          zh: "事件识别回答的是“发生了什么声音”，不是“说了什么话”。它可以识别哭声、玻璃破碎、狗叫声、门铃、警报声、碰撞声等。",
          en: "Event detection answers what sound happened, not what words were spoken. It detects baby cries, glass breaks, dog barks, doorbells, alarms, impacts, and related events."
        }
      },
      {
        title: sectionTitles.principle,
        body: {
          zh: "系统把环境 PCM 变成 log-mel 频谱图。横轴是时间，纵轴是频率，亮度代表能量。模型学习不同事件的频谱形状和时间节奏，例如玻璃破碎的短促高频、狗叫声的重复脉冲和哭声的调制结构。",
          en: "The system converts scene PCM into log-mel spectrograms. Time is on the x-axis, frequency is on the y-axis, and brightness represents energy. The model learns spectral shapes and temporal rhythms such as short high-frequency glass breaks, repeated dog-bark pulses, and modulated baby cries."
        },
        points: [
          { zh: "哭声", en: "Baby cry" },
          { zh: "玻璃破碎", en: "Glass break" },
          { zh: "狗叫声", en: "Dog bark" }
        ]
      },
      {
        title: sectionTitles.technologies,
        body: {
          zh: "核心技术包括 STFT、log-mel、数据增强、CNN/CRNN/Transformer 分类器、置信度阈值、事件后处理和边缘小模型部署。",
          en: "Core techniques include STFT, log-mel features, data augmentation, CNN/CRNN/Transformer classifiers, confidence thresholds, event post-processing, and small edge models."
        }
      },
      {
        title: sectionTitles.applications,
        body: {
          zh: "应用包括婴儿看护、摄像头安防、智能门铃、车载安全、工厂异常声检测、智慧家居和城市声音监测。",
          en: "Applications include baby monitoring, camera security, smart doorbells, vehicle safety, industrial anomaly detection, smart homes, and urban sound monitoring."
        }
      },
      {
        title: sectionTitles.challenges,
        body: {
          zh: "挑战是误报和漏报的取舍、背景噪声、设备麦克风位置、训练数据覆盖、隐私策略和连续监听功耗。",
          en: "Challenges include false-alarm versus miss tradeoffs, background noise, microphone placement, training-data coverage, privacy policy, and continuous-listening power."
        }
      },
      {
        title: sectionTitles.trends,
        body: {
          zh: "趋势是端侧事件识别、多标签连续检测、和摄像头/雷达多模态融合，以及更细粒度的异常声音理解。",
          en: "Trends include edge event detection, multi-label continuous detection, camera/radar multimodal fusion, and finer-grained anomalous sound understanding."
        }
      }
    ]
  },
  enhancement: {
    title: { zh: "AI 音频增强实验室", en: "AI Audio Enhancement Lab" },
    eyebrow: { zh: "学习型增强", en: "Learned enhancement" },
    summary: {
      zh: "解释 AI 降噪、语音分离和去混响如何从带噪 PCM 中估计目标语音。",
      en: "Explains how AI denoising, speech separation, and dereverberation estimate target speech from noisy PCM."
    },
    flowLabel: { zh: "AI 音频增强图解流程", en: "AI audio enhancement diagram flow" },
    flow: [
      {
        title: { zh: "带噪 PCM", en: "Noisy PCM" },
        detail: { zh: "语音、噪声、混响或重叠人声", en: "Speech, noise, reverb, or overlap" }
      },
      {
        title: { zh: "特征 / 编码", en: "Features / encoding" },
        detail: { zh: "频谱或时域表示", en: "Spectral or time-domain representation" }
      },
      {
        title: { zh: "模型估计", en: "Model estimation" },
        detail: { zh: "语音 mask、噪声或目标声源", en: "Speech mask, noise, or target source" }
      },
      {
        title: { zh: "重建 / 后滤波", en: "Reconstruction / post-filter" },
        detail: { zh: "降低噪声并保留语音", en: "Reduces noise while keeping speech" }
      },
      {
        title: { zh: "增强 PCM", en: "Enhanced PCM" },
        detail: { zh: "输出给通话、播放或 ASR", en: "Outputs to calls, playback, or ASR" }
      }
    ],
    technical: {
      input: { zh: "混合信号 y，可包含目标语音 s、噪声 n、混响 r 或其他说话人", en: "Mixture y containing target speech s, noise n, reverberation r, or competing speakers" },
      representation: { zh: "复数 STFT、时频 mask/滤波器，或学习型时域潜变量", en: "Complex STFT with time-frequency masks/filters, or learned time-domain latents" },
      output: { zh: "目标语音估计或增强 PCM，送往通话、录音或 ASR", en: "Target-speech estimate or enhanced PCM for calls, recording, or ASR" },
      objective: { zh: "SI-SDR、波形与多分辨率 STFT 损失；不同模型再加入感知或对抗目标", en: "SI-SDR, waveform, and multi-resolution STFT losses, with model-specific perceptual or adversarial terms" },
      metrics: { zh: "SI-SDR 提升、STOI、PESQ/DNSMOS、下游 WER，以及延迟、RTF 和 MACs", en: "SI-SDR improvement, STOI, PESQ/DNSMOS, downstream WER, latency, RTF, and MACs" },
      deployment: { zh: "实时模型必须因果或限制前视，维护跨帧状态，并评估陌生噪声与处理伪影", en: "Real-time models must be causal or limit lookahead, retain frame state, and handle unseen noise and artifacts" }
    },
    equations: [
      {
        expression: "Y(t,f) = S(t,f) + N(t,f)",
        title: { zh: "时频混合模型", en: "Time-frequency mixture" },
        explanation: { zh: "简化情况下，观测频谱 Y 是目标语音 S 与噪声 N 的叠加；回声、混响和非线性失真需要更完整模型。", en: "In a simplified case, observed spectrum Y is target speech S plus noise N; echo, reverb, and nonlinear distortion require richer models." }
      },
      {
        expression: "Ŝ(t,f) = Mθ(t,f) · Y(t,f)",
        title: { zh: "学习型 mask", en: "Learned mask" },
        explanation: { zh: "模型预测 mask Mθ 来保留更像语音的时频单元；复数 mask 还能同时修正幅度和相位。", en: "The model predicts mask Mθ to retain speech-like time-frequency bins; a complex mask can alter magnitude and phase." }
      },
      {
        expression: "SI-SDR = 10log10(||starget||² / ||e||²)",
        title: { zh: "尺度不变失真比", en: "Scale-invariant SDR" },
        explanation: { zh: "它比较目标投影能量与残差能量，适合训练和评价分离/增强，但不能代替主观听感测试。", en: "It compares target-projection energy with residual energy for separation/enhancement, but does not replace listening tests." }
      }
    ],
    models: [
      {
        name: "RNNoise",
        task: { zh: "轻量实时语音降噪", en: "Lightweight real-time speech denoising" },
        principle: {
          zh: "结合传统特征和小型循环网络，估计频带增益来压低噪声。",
          en: "Combines traditional features with a small recurrent network to estimate band gains and suppress noise."
        },
        deployment: {
          zh: "适合低功耗通话、嵌入式设备和传统降噪后的神经后滤波参考。",
          en: "Fits low-power calls, embedded devices, and neural post-filter references after traditional denoising."
        },
        caution: {
          zh: "强噪声下可能牺牲语音自然度，不能替代完整 AEC/AGC 链路。",
          en: "Heavy noise may reduce speech naturalness; it does not replace a full AEC/AGC chain."
        }
      },
      {
        name: "DeepFilterNet",
        task: { zh: "实时神经降噪", en: "Real-time neural noise suppression" },
        principle: {
          zh: "在频域估计深度滤波系数，保留语音细节同时降低背景噪声。",
          en: "Estimates deep filtering coefficients in the frequency domain to keep speech detail while reducing background noise."
        },
        deployment: {
          zh: "适合 PC/移动端会议、直播降噪和本地实时语音增强。",
          en: "Fits PC/mobile conferencing, streaming denoising, and local real-time speech enhancement."
        },
        caution: {
          zh: "实时效果取决于帧长、模型大小、CPU/NPU 后端和音频设备延迟。",
          en: "Real-time behavior depends on frame size, model size, CPU/NPU backend, and audio-device latency."
        }
      },
      {
        name: "Conv-TasNet",
        task: { zh: "时域语音分离", en: "Time-domain speech separation" },
        principle: {
          zh: "不先做频谱图，而是在时域学习编码、mask 和解码，把混合语音分开。",
          en: "Learns encoding, masking, and decoding in the time domain instead of first creating a spectrogram."
        },
        deployment: {
          zh: "适合理解重叠说话人分离、会议语音前处理和目标声源增强。",
          en: "Useful for overlapping-speaker separation, meeting front ends, and target-source enhancement."
        },
        caution: {
          zh: "多说话人数量、说话人变化和实时延迟会显著增加工程难度。",
          en: "Speaker count, speaker changes, and real-time latency significantly raise engineering difficulty."
        }
      },
      {
        name: "Demucs",
        task: { zh: "音乐/语音源分离", en: "Music and speech source separation" },
        principle: {
          zh: "用深度网络把混合音频分离成人声、鼓、贝斯或其他声源。",
          en: "Uses deep networks to separate mixtures into vocals, drums, bass, or other sources."
        },
        deployment: {
          zh: "适合音乐分轨、内容编辑、人声提取和离线修复工作流。",
          en: "Fits music stem separation, content editing, vocal extraction, and offline restoration workflows."
        },
        caution: {
          zh: "它更偏离线源分离，通话实时降噪要另看轻量模型。",
          en: "It is more offline source separation; real-time call denoising needs lighter models."
        }
      },
      {
        name: "U-Net mask model",
        task: { zh: "频谱 mask 增强", en: "Spectral-mask enhancement" },
        principle: {
          zh: "在频谱图上预测语音 mask，保留目标语音区域并压低噪声区域。",
          en: "Predicts a speech mask on the spectrogram, keeping target speech regions and reducing noisy regions."
        },
        deployment: {
          zh: "适合教学理解、ASR 前端增强和需要可视化 mask 的产品调试。",
          en: "Fits teaching, ASR front-end enhancement, and product debugging where masks need visualization."
        },
        caution: {
          zh: "mask 过强会造成音乐噪声、断字和高频损失。",
          en: "Over-aggressive masks can cause musical noise, clipped words, and high-frequency loss."
        }
      }
    ],
    sections: [
      {
        title: sectionTitles.overview,
        body: {
          zh: "AI 音频增强用训练出来的模型改善语音清晰度，常见能力包括 AI 降噪、去混响、目标说话人增强、语音分离和神经后滤波。",
          en: "AI enhancement uses trained models to improve speech clarity. Common capabilities include neural denoising, dereverberation, target-speaker enhancement, speech separation, and neural post-filtering."
        }
      },
      {
        title: sectionTitles.principle,
        body: {
          zh: "模型学习语音、噪声和房间混响在特征空间里的差异，估计哪些时间频率区域更像语音，哪些更像噪声，然后重建较干净的 PCM。过强处理会带来断字、发闷和音乐噪声。",
          en: "The model learns differences between speech, noise, and room reverberation in feature space, estimates which time-frequency regions look like speech or noise, then reconstructs cleaner PCM. Aggressive processing can cause clipped words, muffling, or musical noise."
        }
      },
      {
        title: sectionTitles.technologies,
        body: {
          zh: "核心技术包括频谱 mask、时域分离网络、U-Net、DPRNN、Transformer、神经后滤波、感知损失、端侧量化和实时流式推理。",
          en: "Core techniques include spectral masks, time-domain separation networks, U-Net, DPRNN, Transformers, neural post-filters, perceptual losses, edge quantization, and streaming inference."
        }
      },
      {
        title: sectionTitles.applications,
        body: {
          zh: "应用包括会议软件、蓝牙耳机、直播降噪、车载通话、助听、短视频修音和 ASR 前端增强。",
          en: "Applications include conferencing, Bluetooth headsets, streaming denoising, in-car calls, hearing assistance, short-video cleanup, and ASR front-end enhancement."
        }
      },
      {
        title: sectionTitles.challenges,
        body: {
          zh: "挑战是实时延迟、模型大小、NPU/DSP/CPU 占用、训练数据泛化、残留噪声和语音保真之间的平衡。",
          en: "Challenges include real-time latency, model size, NPU/DSP/CPU load, training-data generalization, residual noise, and speech fidelity tradeoffs."
        }
      },
      {
        title: sectionTitles.trends,
        body: {
          zh: "趋势是传统 AEC/AGC/NS 与神经后滤波混合、端侧小模型、个性化目标声源增强和多模态降噪。",
          en: "Trends include hybrid traditional AEC/AGC/NS plus neural post-filtering, small edge models, personalized target-source enhancement, and multimodal denoising."
        }
      }
    ]
  },
  codec: {
    title: { zh: "AI 音频编码实验室", en: "AI Audio Coding Lab" },
    eyebrow: { zh: "神经 codec", en: "Neural codec" },
    summary: {
      zh: "解释神经编码器如何把 PCM 压缩成 token 或 latent，再由神经解码器重建音频。",
      en: "Explains how neural encoders compress PCM into tokens or latents and how neural decoders reconstruct audio."
    },
    flowLabel: { zh: "AI 音频编码图解流程", en: "AI audio coding diagram flow" },
    flow: [
      {
        title: { zh: "PCM 音频帧", en: "PCM audio frames" },
        detail: { zh: "原始采样值", en: "Raw samples" }
      },
      {
        title: { zh: "神经编码器", en: "Neural encoder" },
        detail: { zh: "学习压缩表示", en: "Learns compressed representation" }
      },
      {
        title: { zh: "token / latent", en: "Token / latent" },
        detail: { zh: "离散编号或连续向量", en: "Discrete IDs or continuous vectors" }
      },
      {
        title: { zh: "低码率码流", en: "Low-bitrate stream" },
        detail: { zh: "用于弱网或生成式语音", en: "For weak networks or generative speech" }
      },
      {
        title: { zh: "神经解码器", en: "Neural decoder" },
        detail: { zh: "重建可播放 PCM", en: "Reconstructs playable PCM" }
      }
    ],
    technical: {
      input: { zh: "按帧输入 PCM，可包含语音、音乐或一般声音", en: "Framed PCM containing speech, music, or general audio" },
      representation: { zh: "编码器连续潜变量，经 VQ/RVQ 转成一个或多个离散码本索引", en: "Continuous encoder latents quantized by VQ/RVQ into one or more discrete codebook indices" },
      output: { zh: "带必要边信息的低码率索引流，以及解码重建 PCM", en: "Low-bitrate index stream with side information and reconstructed PCM" },
      objective: { zh: "波形/多分辨率 STFT 重建、量化承诺损失，并可加入感知或对抗损失", en: "Waveform/multi-resolution STFT reconstruction, quantizer commitment, and optional perceptual or adversarial losses" },
      metrics: { zh: "kbps、主观 MOS/MUSHRA、内容适配质量、算法延迟、RTF 和丢包鲁棒性", en: "kbps, subjective MOS/MUSHRA, content quality, algorithmic delay, RTF, and packet-loss robustness" },
      deployment: { zh: "编码端与解码端必须严格匹配模型、码本和版本；还需定义帧长、前视、封包和 PLC", en: "Encoder and decoder must match model, codebooks, and version; frame size, lookahead, packetization, and PLC must be defined" }
    },
    equations: [
      {
        expression: "k* = arg minₖ ||z - eₖ||²; q(z) = eₖ*",
        title: { zh: "矢量量化", en: "Vector quantization" },
        explanation: { zh: "连续向量 z 被替换为最近码本向量 eₖ，并只传输索引 k；RVQ 会逐级量化前一级残差。", en: "Continuous vector z is replaced by nearest codebook vector eₖ and only index k is sent; RVQ quantizes residuals stage by stage." }
      },
      {
        expression: "R = Ftoken · Q · ceil(log2(K)) bit/s",
        title: { zh: "原始 token 码率", en: "Raw token bitrate" },
        explanation: { zh: "等大码本、固定长度索引：Ftoken 是每秒帧数，Q 是级数，K 是码本大小。K 为 2 的整数次幂时不需取整，例如 50 帧/s × 8 级 × 10 bit = 4 kbps。熵编码、封包和边信息会改变实际码率。", en: "Equal-sized codebooks with fixed-length indices: Ftoken is frames/s, Q stages, K entries. No rounding is needed for power-of-two K: 50 frames/s × 8 stages × 10 bits = 4 kbps. Entropy coding, packets, and side information change transport rate." }
      },
      {
        expression: "L = λtLwave + λfLSTFT + λqLVQ + λaLadv",
        title: { zh: "联合训练目标", en: "Joint training objective" },
        explanation: { zh: "时域、频域、量化和对抗损失共同约束保真度与自然度；不同 codec 的具体组合并不相同。", en: "Waveform, spectral, quantization, and adversarial terms jointly constrain fidelity and naturalness; exact combinations differ by codec." }
      }
    ],
    models: [
      {
        name: "SoundStream",
        task: { zh: "低码率实时神经 codec", en: "Low-bitrate real-time neural codec" },
        principle: {
          zh: "用神经编码器、量化器和解码器端到端压缩音频，目标是低码率下保持可懂度和质量。",
          en: "Compresses audio end to end with neural encoders, quantizers, and decoders for quality at low bitrates."
        },
        deployment: {
          zh: "适合理解实时通信、弱网音频和神经 codec 的基本路线。",
          en: "Fits understanding real-time communication, weak-network audio, and neural codec basics."
        },
        caution: {
          zh: "不是 MP3/AAC 的手工变换编码路线，播放端必须有匹配的神经解码器。",
          en: "It is not the handcrafted transform-coding path of MP3/AAC; playback needs a matching neural decoder."
        }
      },
      {
        name: "EnCodec",
        task: { zh: "通用神经音频 codec 和生成 token", en: "General neural audio codec and generation tokens" },
        principle: {
          zh: "使用卷积自编码器和残差向量量化，把 PCM 压成多级离散 code。",
          en: "Uses a convolutional autoencoder and residual vector quantization to compress PCM into multi-level discrete codes."
        },
        deployment: {
          zh: "常用于音乐生成、语音生成、音频编辑和低码率重建研究。",
          en: "Common in music generation, speech generation, audio editing, and low-bitrate reconstruction research."
        },
        caution: {
          zh: "码率、码本级数和模型大小会共同决定质量、延迟和算力。",
          en: "Bitrate, codebook count, and model size jointly determine quality, latency, and compute."
        }
      },
      {
        name: "Lyra",
        task: { zh: "极低码率语音通信", en: "Ultra-low-bitrate speech communication" },
        principle: {
          zh: "把语音特征压缩到很低码率，再用生成式神经声码器重建语音。",
          en: "Compresses speech features to very low bitrates, then reconstructs speech with a generative neural vocoder."
        },
        deployment: {
          zh: "适合弱网语音、低带宽通话和移动网络不稳定场景。",
          en: "Fits weak-network voice, low-bandwidth calls, and unstable mobile networks."
        },
        caution: {
          zh: "主要面向语音，不等同于高保真音乐编码。",
          en: "It mainly targets speech and is not the same as high-fidelity music coding."
        }
      },
      {
        name: "AudioDec",
        task: { zh: "高质量神经 codec 研究", en: "High-quality neural codec research" },
        principle: {
          zh: "围绕神经编码、量化和解码提升重建音质，强调更自然的低码率音频。",
          en: "Improves reconstruction quality through neural encoding, quantization, and decoding for natural low-bitrate audio."
        },
        deployment: {
          zh: "适合对比神经 codec 结构、感知损失和高质量重建路线。",
          en: "Useful for comparing neural codec structures, perceptual losses, and high-quality reconstruction paths."
        },
        caution: {
          zh: "研究模型到产品还要补流式、丢包、标准化和播放器生态。",
          en: "Research-to-product still needs streaming, packet loss handling, standardization, and player ecosystems."
        }
      },
      {
        name: "codec token / neural codec language model",
        task: { zh: "生成式语音和音频大模型中间表示", en: "Intermediate representation for generative speech and audio models" },
        principle: {
          zh: "先把音频压成离散 token，再像语言模型处理文字 token 一样预测音频 token。",
          en: "Compresses audio into discrete tokens, then predicts audio tokens similarly to how language models predict text tokens."
        },
        deployment: {
          zh: "适合语音生成、音频补全、编辑、跨语言配音和多模态对话。",
          en: "Fits speech generation, audio infilling, editing, cross-lingual dubbing, and multimodal dialogue."
        },
        caution: {
          zh: "token 越抽象越利于生成，但也可能损失细节和真实音色。",
          en: "More abstract tokens help generation but can lose detail and authentic timbre."
        }
      }
    ],
    sections: [
      {
        title: sectionTitles.overview,
        body: {
          zh: "AI 音频编码用神经网络学习压缩表示，适合低码率通信、语音 token、内容编辑和生成式音频中间表示。",
          en: "AI audio coding uses neural networks to learn compressed representations for low-bitrate communication, speech tokens, content editing, and generative audio representations."
        }
      },
      {
        title: sectionTitles.principle,
        body: {
          zh: "神经编码器把短帧 PCM 压成 token 或 latent，码流传输后由神经解码器还原 PCM。它不等同于 MP3/AAC/Opus 的变换编码，而是让模型学习哪些信息最该保留。",
          en: "A neural encoder compresses short PCM frames into tokens or latents; after transport, a neural decoder reconstructs PCM. This is not the same as MP3/AAC/Opus transform coding. The model learns which information should be preserved."
        }
      },
      {
        title: sectionTitles.technologies,
        body: {
          zh: "核心技术包括自编码器、向量量化 VQ、残差量化 RVQ、codec token、感知损失、码率控制、丢包恢复和神经解码器。",
          en: "Core techniques include autoencoders, vector quantization, residual vector quantization, codec tokens, perceptual losses, bitrate control, packet-loss recovery, and neural decoders."
        }
      },
      {
        title: sectionTitles.applications,
        body: {
          zh: "应用包括低码率语音通信、弱网会议、生成式语音 token、音频编辑、语音合成中间表示和边缘设备传输。",
          en: "Applications include low-bitrate speech communication, weak-network conferencing, generative speech tokens, audio editing, intermediate TTS representations, and edge-device transport."
        }
      },
      {
        title: sectionTitles.challenges,
        body: {
          zh: "挑战包括算法延迟、跨设备一致性、算力、低码率失真、背景声保持、瞬态还原和传统生态兼容。",
          en: "Challenges include algorithmic latency, cross-device consistency, compute, low-bitrate distortion, background preservation, transient reconstruction, and compatibility with traditional ecosystems."
        }
      },
      {
        title: sectionTitles.trends,
        body: {
          zh: "趋势是语义 token 与音频 codec 结合、极低码率语音、生成式重建、端侧神经 codec 和与大模型音频 token 的统一。",
          en: "Trends include combining semantic tokens with audio codecs, ultra-low-bitrate speech, generative reconstruction, edge neural codecs, and unification with audio tokens for foundation models."
        }
      }
    ]
  }
};

Object.assign(ja, {
  "文本条件音乐生成与编辑": "テキスト条件付き音楽生成と編集",
  "token 似然、Flow Matching 速度场或扩散目标，按模型与训练阶段选择": "モデルと学習段階に応じ、token 尤度・Flow Matching の速度場・拡散目的関数を使い分けます。",
  "全面概述": "全体概要",
  "基本原理": "基本原理",
  "核心技术": "コア技術",
  "应用场景": "応用シナリオ",
  "挑战": "課題",
  "未来趋势": "今後の動向",
  "AI 音频总流程实验室": "AI 音響全体フローラボ",
  "AI 音频入口": "AI 音響の入口",
  "用一条工程链路解释声音如何从 PCM 进入不同表示、任务模型、评价与部署。": "1 本のエンジニアリング経路で、音が PCM からさまざまな表現、タスクモデル、評価、デプロイへ進む流れを説明します。",
  "AI 音频总流程图解流程": "AI 音響全体フローの図解",
  "麦克风 / Codec / ADC": "マイク / Codec / ADC",
  "把空气压力变化变成数字采样": "空気圧の変化をデジタルサンプルに変換",
  "PCM 数字音频": "PCM デジタル音声",
  "原始波形数据，不直接等于语义": "生の波形データであり、意味そのものではない",
  "切片 / 标准化": "分割 / 正規化",
  "按流式或离线任务组织输入": "ストリーミングまたはオフライン処理向けに入力を整理",
  "任务表示": "タスク表現",
  "按需选波形、频谱、embedding 或 token": "必要に応じて波形、スペクトル、embedding、token を選択",
  "任务模型": "タスクモデル",
  "ASR、分类、增强、编码或生成": "ASR、分類、強調、符号化、生成",
  "后处理 / 输出": "後処理 / 出力",
  "文字、类别、增强 PCM、token 或新音频": "文字、クラス、強調 PCM、token、新しい音声",
  "PCM 波形 x[n]，以及任务需要的文本、标签或条件信息": "PCM 波形 x[n] と、タスクに必要なテキスト、ラベル、条件情報",
  "按任务选择原始波形、STFT/log-mel、学习型 embedding 或 codec token": "タスクに応じて生波形、STFT/log-mel、学習型 embedding、codec token を選択",
  "文字、类别与时间戳、增强 PCM、离散码流或生成音频": "文字、クラスとタイムスタンプ、強調 PCM、離散ビットストリーム、生成音声",
  "监督分类/对齐、自监督表征、重建与感知损失，或生成式建模": "教師あり分類 / アライメント、自己教師あり表現、再構成・知覚損失、生成モデリング",
  "必须按任务选指标：WER、F1、SI-SDR、MOS、码率等不能混用": "指標はタスクごとに選ぶ必要があります。WER、F1、SI-SDR、MOS、ビットレートなどは混用できません。",
  "明确流式或离线、端侧或云端，并核算延迟、RTF、内存、功耗与隐私": "ストリーミングかオフラインか、エッジかクラウドかを明確にし、遅延、RTF、メモリ、電力、プライバシーを見積もります。",
  "短时傅里叶变换 STFT": "短時間フーリエ変換 STFT",
  "m 是时间帧，k 是频率 bin，H 是 hop size，N 是窗口长度。它是可选声学表示，不是所有 AI 音频模型的必经步骤。": "m は時間フレーム、k は周波数 bin、H は hop size、N は窓長です。これは任意の音響表現であり、すべての AI 音響モデルに必須ではありません。",
  "统一任务表达": "統一タスク表現",
  "R(x) 表示波形、频谱或 token，c 是文本等条件，模型 fθ 根据任务输出识别、增强、编码或生成结果。": "R(x) は波形、スペクトル、token を表し、c はテキストなどの条件です。モデル fθ はタスクに応じて認識、強調、符号化、生成結果を出力します。",
  "端到端延迟预算": "エンドツーエンド遅延予算",
  "实时性不是只看模型推理时间，还要计算采集缓存、分帧、解码与播放缓存。": "リアルタイム性はモデル推論時間だけでなく、収録バッファ、フレーミング、デコード、再生バッファも含めて計算します。",
  "通用语音识别和翻译": "汎用音声認識と翻訳",
  "把音频转成 log-mel 频谱，再用 Transformer 做序列到文本建模。": "音声を log-mel スペクトルに変換し、Transformer で系列からテキストへのモデリングを行います。",
  "适合离线转写、多语言字幕和音频内容检索。": "オフライン文字起こし、多言語字幕、音声コンテンツ検索に適しています。",
  "长音频、强噪声和专有名词仍需要分段、热词或后处理。": "長時間音声、強い雑音、固有名詞には分割、ホットワード、後処理がなお必要です。",
  "自监督语音表征": "自己教師あり音声表現",
  "先从大量未标注语音中学习声学表示，再用少量标注数据微调 ASR。": "大量の未ラベル音声から音響表現を学び、少量のラベル付きデータで ASR を微調整します。",
  "适合标注数据较少的语种、领域和端侧 ASR 训练参考。": "ラベル付きデータが少ない言語や分野、エッジ ASR の学習基盤に適しています。",
  "它更像基础表示模型，落地时通常还要接解码器和语言后处理。": "基盤表現モデルに近く、実運用では通常デコーダーと言語後処理も必要です。",
  "文本和音频跨模态检索": "テキスト・音声クロスモーダル検索",
  "把音频和文字描述映射到同一 embedding 空间，用相似度匹配声音含义。": "音声とテキスト記述を同じ embedding 空間へ写像し、類似度で音の意味を対応付けます。",
  "适合用文字搜索音效、做声音标签扩展和多模态内容理解。": "テキストによる効果音検索、音声ラベル拡張、マルチモーダルコンテンツ理解に適しています。",
  "它偏理解和检索，不直接替代 ASR、降噪或编码器。": "理解と検索に重点があり、ASR、ノイズ抑圧、エンコーダーを直接置き換えるものではありません。",
  "神经音频编码和生成式 token": "ニューラル音声符号化と生成 token",
  "用神经编码器、残差量化和解码器把 PCM 压成离散 code，再重建音频。": "ニューラルエンコーダー、残差量子化、デコーダーで PCM を離散 code に圧縮し、音声を再構成します。",
  "常作为低码率音频、音乐生成和语音生成的中间表示。": "低ビットレート音声、音楽生成、音声生成の中間表現としてよく使われます。",
  "需要模型解码，不能像 WAV/MP3 一样被普通播放器直接解析。": "モデルによるデコードが必要で、WAV/MP3 のように通常のプレーヤーで直接再生できません。",
  "实时神经音频 codec": "リアルタイムニューラル音声 codec",
  "用端到端神经 codec 在低码率下保持语音和一般音频质量。": "エンドツーエンドのニューラル codec で、低ビットレートでも音声と一般音響の品質を保ちます。",
  "适合理解神经 codec 如何服务实时通信和弱网音频。": "ニューラル codec がリアルタイム通信や低品質ネットワーク音声にどう使われるかを理解するのに適しています。",
  "实时部署要重点看算法延迟、算力和跨设备一致性。": "リアルタイム導入ではアルゴリズム遅延、計算量、デバイス間の一貫性を重視します。",
  "AI 音频不是单一算法，而是一组把音频信号转换成可识别、可生成、可增强或可压缩表示的技术。最前面通常是麦克风和 Codec/ADC，把声音采集为 PCM；之后再把 PCM 转成更适合模型处理的特征或 embedding。": "AI 音響は単一のアルゴリズムではなく、音声信号を認識・生成・強調・圧縮可能な表現へ変換する技術群です。通常はマイクと Codec/ADC で音を PCM として収録し、その後モデルに適した特徴や embedding へ変換します。",
  "PCM 只是采样值序列，不包含“文字”“事件类别”或“干净语音”这些含义。ASR 和事件识别常分析短时频谱或 Mel 特征，时域增强可以直接学习波形表示，神经编码与生成还会使用离散 codec token；表示方式由任务目标决定。": "PCM はサンプル値の系列にすぎず、「文字」「イベントクラス」「クリーン音声」の意味は含みません。ASR とイベント認識は短時間スペクトルや Mel 特徴を分析することが多く、時間領域の強調は波形表現を直接学習できます。ニューラル符号化と生成では離散 codec token も使い、表現方式はタスクの目的で決まります。",
  "常见技术包括 FFT/STFT、Mel 滤波、MFCC、CNN、Transformer、CTC/RNNT、扩散模型、神经声码器、神经 codec、mask 估计和 embedding 学习。声音事件识别常把频谱图当二维特征图，但 ASR、降噪、编码和生成并不完全等同于图像分类。": "代表的な技術には FFT/STFT、Mel フィルタ、MFCC、CNN、Transformer、CTC/RNNT、拡散モデル、ニューラルボコーダー、ニューラル codec、mask 推定、embedding 学習があります。音響イベント認識ではスペクトログラムを二次元特徴マップとして扱うことが多い一方、ASR、ノイズ抑圧、符号化、生成は画像分類と完全に同じではありません。",
  "应用包括会议转写、实时字幕、语音助手、TTS 播报、AI 降噪耳机、摄像头哭声/玻璃破碎检测、智能座舱、内容生成、低码率通信和音频编辑。": "応用には会議文字起こし、リアルタイム字幕、音声アシスタント、TTS 通知、AI ノイズ抑圧ヘッドセット、カメラによる泣き声 / ガラス破損検出、スマートコックピット、コンテンツ生成、低ビットレート通信、音声編集があります。",
  "主要挑战是噪声、远场、多说话人、口音、低功耗、实时延迟、误报漏报、隐私、数据授权和模型伪影。产品不能只看模型准确率，还要看设备麦克风、算力、网络和用户场景。": "主な課題は雑音、遠方収音、複数話者、訛り、低消費電力、リアルタイム遅延、誤報と見逃し、プライバシー、データ権利、モデルアーティファクトです。製品ではモデル精度だけでなく、デバイスのマイク、計算資源、ネットワーク、利用シーンも評価します。",
  "趋势包括端侧小模型、多模态音频理解、神经 codec token、实时生成、个性化声音、音频大模型和 SoC/NPU/DSP 协同部署。": "動向として、エッジ小型モデル、マルチモーダル音響理解、ニューラル codec token、リアルタイム生成、個人化音声、音声基盤モデル、SoC/NPU/DSP の協調デプロイが挙げられます。"
});

Object.assign(ko, {
  "文本条件音乐生成与编辑": "텍스트 조건 음악 생성 및 편집",
  "token 似然、Flow Matching 速度场或扩散目标，按模型与训练阶段选择": "모델과 학습 단계에 따라 token 우도·Flow Matching 속도장·확산 목표를 사용합니다.",
  "全面概述": "전체 개요",
  "基本原理": "기본 원리",
  "核心技术": "핵심 기술",
  "应用场景": "응용 시나리오",
  "挑战": "과제",
  "未来趋势": "향후 동향",
  "AI 音频总流程实验室": "AI 오디오 전체 흐름 랩",
  "AI 音频入口": "AI 오디오 입구",
  "用一条工程链路解释声音如何从 PCM 进入不同表示、任务模型、评价与部署。": "하나의 엔지니어링 경로로 소리가 PCM에서 다양한 표현, 작업 모델, 평가, 배포로 이어지는 과정을 설명합니다.",
  "AI 音频总流程图解流程": "AI 오디오 전체 흐름 도해",
  "麦克风 / Codec / ADC": "마이크 / Codec / ADC",
  "把空气压力变化变成数字采样": "공기 압력 변화를 디지털 샘플로 변환",
  "PCM 数字音频": "PCM 디지털 오디오",
  "原始波形数据，不直接等于语义": "원시 파형 데이터이며 의미 자체는 아님",
  "切片 / 标准化": "분할 / 정규화",
  "按流式或离线任务组织输入": "스트리밍 또는 오프라인 작업에 맞게 입력 구성",
  "任务表示": "작업 표현",
  "按需选波形、频谱、embedding 或 token": "필요에 따라 파형, 스펙트럼, 임베딩, 토큰 선택",
  "任务模型": "작업 모델",
  "ASR、分类、增强、编码或生成": "ASR, 분류, 향상, 코딩 또는 생성",
  "后处理 / 输出": "후처리 / 출력",
  "文字、类别、增强 PCM、token 或新音频": "텍스트, 클래스, 향상된 PCM, 토큰 또는 새 오디오",
  "PCM 波形 x[n]，以及任务需要的文本、标签或条件信息": "PCM 파형 x[n]과 작업에 필요한 텍스트, 라벨 또는 조건 정보",
  "按任务选择原始波形、STFT/log-mel、学习型 embedding 或 codec token": "작업에 따라 원시 파형, STFT/log-mel, 학습 임베딩 또는 코덱 토큰 선택",
  "文字、类别与时间戳、增强 PCM、离散码流或生成音频": "텍스트, 클래스와 타임스탬프, 향상된 PCM, 이산 스트림 또는 생성 오디오",
  "监督分类/对齐、自监督表征、重建与感知损失，或生成式建模": "지도 분류/정렬, 자기지도 표현, 재구성 및 지각 손실 또는 생성 모델링",
  "必须按任务选指标：WER、F1、SI-SDR、MOS、码率等不能混用": "지표는 작업별로 선택해야 합니다. WER, F1, SI-SDR, MOS, 비트레이트 등은 서로 바꿔 쓸 수 없습니다.",
  "明确流式或离线、端侧或云端，并核算延迟、RTF、内存、功耗与隐私": "스트리밍/오프라인, 엣지/클라우드를 구분하고 지연, RTF, 메모리, 전력, 개인정보를 산정합니다.",
  "短时傅里叶变换 STFT": "단시간 푸리에 변환 STFT",
  "m 是时间帧，k 是频率 bin，H 是 hop size，N 是窗口长度。它是可选声学表示，不是所有 AI 音频模型的必经步骤。": "m은 시간 프레임, k는 주파수 bin, H는 hop size, N은 창 길이입니다. 선택적 음향 표현이며 모든 AI 오디오 모델에 필수는 아닙니다.",
  "统一任务表达": "통합 작업 표현",
  "R(x) 表示波形、频谱或 token，c 是文本等条件，模型 fθ 根据任务输出识别、增强、编码或生成结果。": "R(x)는 파형, 스펙트럼 또는 토큰을 나타내고 c는 텍스트 같은 조건입니다. 모델 fθ는 작업에 따라 인식, 향상, 코딩 또는 생성 결과를 출력합니다.",
  "端到端延迟预算": "종단 간 지연 예산",
  "实时性不是只看模型推理时间，还要计算采集缓存、分帧、解码与播放缓存。": "실시간성은 모델 추론 시간만 보는 것이 아니라 캡처 버퍼, 프레이밍, 디코딩, 재생 버퍼도 계산해야 합니다.",
  "通用语音识别和翻译": "범용 음성 인식 및 번역",
  "把音频转成 log-mel 频谱，再用 Transformer 做序列到文本建模。": "오디오를 log-mel 스펙트럼으로 바꾼 뒤 Transformer로 시퀀스-텍스트 모델링을 수행합니다.",
  "适合离线转写、多语言字幕和音频内容检索。": "오프라인 전사, 다국어 자막, 오디오 콘텐츠 검색에 적합합니다.",
  "长音频、强噪声和专有名词仍需要分段、热词或后处理。": "긴 오디오, 강한 잡음, 고유명사에는 여전히 분할, 핫워드, 후처리가 필요합니다.",
  "自监督语音表征": "자기지도 음성 표현",
  "先从大量未标注语音中学习声学表示，再用少量标注数据微调 ASR。": "많은 비라벨 음성에서 음향 표현을 학습한 뒤 적은 라벨 데이터로 ASR을 미세 조정합니다.",
  "适合标注数据较少的语种、领域和端侧 ASR 训练参考。": "라벨 데이터가 적은 언어와 분야, 엣지 ASR 학습 기반에 적합합니다.",
  "它更像基础表示模型，落地时通常还要接解码器和语言后处理。": "기초 표현 모델에 가까우므로 실제 적용에는 보통 디코더와 언어 후처리도 필요합니다.",
  "文本和音频跨模态检索": "텍스트-오디오 크로스모달 검색",
  "把音频和文字描述映射到同一 embedding 空间，用相似度匹配声音含义。": "오디오와 텍스트 설명을 같은 임베딩 공간에 매핑하고 유사도로 소리의 의미를 대응시킵니다.",
  "适合用文字搜索音效、做声音标签扩展和多模态内容理解。": "텍스트 기반 효과음 검색, 소리 라벨 확장, 멀티모달 콘텐츠 이해에 적합합니다.",
  "它偏理解和检索，不直接替代 ASR、降噪或编码器。": "이해와 검색에 초점을 두며 ASR, 잡음 억제, 인코더를 직접 대체하지 않습니다.",
  "神经音频编码和生成式 token": "신경 오디오 코딩 및 생성 토큰",
  "用神经编码器、残差量化和解码器把 PCM 压成离散 code，再重建音频。": "신경 인코더, 잔차 양자화, 디코더로 PCM을 이산 코드로 압축한 뒤 오디오를 재구성합니다.",
  "常作为低码率音频、音乐生成和语音生成的中间表示。": "저비트레이트 오디오, 음악 생성, 음성 생성의 중간 표현으로 자주 사용됩니다.",
  "需要模型解码，不能像 WAV/MP3 一样被普通播放器直接解析。": "모델 디코딩이 필요하므로 WAV/MP3처럼 일반 플레이어가 직접 해석할 수 없습니다.",
  "实时神经音频 codec": "실시간 신경 오디오 코덱",
  "用端到端神经 codec 在低码率下保持语音和一般音频质量。": "종단 간 신경 코덱으로 낮은 비트레이트에서도 음성과 일반 오디오 품질을 유지합니다.",
  "适合理解神经 codec 如何服务实时通信和弱网音频。": "신경 코덱이 실시간 통신과 불안정 네트워크 오디오에 어떻게 쓰이는지 이해하는 데 적합합니다.",
  "实时部署要重点看算法延迟、算力和跨设备一致性。": "실시간 배포에서는 알고리즘 지연, 연산량, 기기 간 일관성을 중점적으로 봐야 합니다.",
  "AI 音频不是单一算法，而是一组把音频信号转换成可识别、可生成、可增强或可压缩表示的技术。最前面通常是麦克风和 Codec/ADC，把声音采集为 PCM；之后再把 PCM 转成更适合模型处理的特征或 embedding。": "AI 오디오는 하나의 알고리즘이 아니라 오디오 신호를 인식·생성·향상·압축 가능한 표현으로 바꾸는 기술 모음입니다. 보통 마이크와 Codec/ADC로 소리를 PCM으로 캡처한 뒤 모델에 맞는 특징이나 임베딩으로 변환합니다.",
  "PCM 只是采样值序列，不包含“文字”“事件类别”或“干净语音”这些含义。ASR 和事件识别常分析短时频谱或 Mel 特征，时域增强可以直接学习波形表示，神经编码与生成还会使用离散 codec token；表示方式由任务目标决定。": "PCM은 샘플 값의 시퀀스일 뿐 ‘텍스트’, ‘이벤트 클래스’, ‘깨끗한 음성’의 의미를 담지 않습니다. ASR과 이벤트 인식은 단시간 스펙트럼이나 Mel 특징을 자주 분석하고 시간 영역 향상은 파형 표현을 직접 학습할 수 있습니다. 신경 코딩과 생성에는 이산 코덱 토큰도 사용하며 표현 방식은 작업 목표가 정합니다.",
  "常见技术包括 FFT/STFT、Mel 滤波、MFCC、CNN、Transformer、CTC/RNNT、扩散模型、神经声码器、神经 codec、mask 估计和 embedding 学习。声音事件识别常把频谱图当二维特征图，但 ASR、降噪、编码和生成并不完全等同于图像分类。": "대표 기술에는 FFT/STFT, Mel 필터, MFCC, CNN, Transformer, CTC/RNNT, 확산 모델, 신경 보코더, 신경 코덱, 마스크 추정, 임베딩 학습이 있습니다. 음향 이벤트 인식은 스펙트로그램을 2차원 특징 맵으로 다루지만 ASR, 잡음 억제, 코딩, 생성이 이미지 분류와 완전히 같지는 않습니다.",
  "应用包括会议转写、实时字幕、语音助手、TTS 播报、AI 降噪耳机、摄像头哭声/玻璃破碎检测、智能座舱、内容生成、低码率通信和音频编辑。": "응용에는 회의 전사, 실시간 자막, 음성 어시스턴트, TTS 안내, AI 잡음 억제 헤드셋, 카메라 기반 울음/유리 파손 감지, 스마트 콕핏, 콘텐츠 생성, 저비트레이트 통신, 오디오 편집이 있습니다.",
  "主要挑战是噪声、远场、多说话人、口音、低功耗、实时延迟、误报漏报、隐私、数据授权和模型伪影。产品不能只看模型准确率，还要看设备麦克风、算力、网络和用户场景。": "주요 과제는 잡음, 원거리 수음, 다중 화자, 억양, 저전력, 실시간 지연, 오탐과 누락, 개인정보, 데이터 권리, 모델 아티팩트입니다. 제품은 모델 정확도뿐 아니라 기기 마이크, 연산 자원, 네트워크, 사용자 환경도 평가해야 합니다.",
  "趋势包括端侧小模型、多模态音频理解、神经 codec token、实时生成、个性化声音、音频大模型和 SoC/NPU/DSP 协同部署。": "동향으로는 엣지 소형 모델, 멀티모달 오디오 이해, 신경 코덱 토큰, 실시간 생성, 개인화 음성, 오디오 파운데이션 모델, SoC/NPU/DSP 협업 배포가 있습니다."
});

Object.assign(ja, {
  "语音识别 ASR 实验室": "音声認識 ASR ラボ",
  "语音转文字": "音声からテキストへ",
  "解释语音如何从 PCM 变成声学特征，再经过识别模型、解码和后处理输出文字。": "音声が PCM から音響特徴になり、認識モデル、デコード、後処理を経て文字を出力する流れを説明します。",
  "语音识别 ASR 图解流程": "音声認識 ASR の図解フロー",
  "PCM 输入": "PCM 入力",
  "16 kHz 单声道语音常见": "16 kHz モノラル音声が一般的",
  "模型前端": "モデルフロントエンド",
  "频谱路线常用 25 ms 窗、10 ms 步长；按模型配置": "スペクトル系では 25 ms 窓、10 ms hop がよく使われます。モデル設定に合わせます。",
  "声学表示": "音響表現",
  "log-Mel、MFCC 或波形学习前端，不是依次必经": "log-Mel、MFCC、波形学習フロントエンドのいずれかで、順番にすべて通るわけではありません。",
  "Encoder 编码器": "Encoder エンコーダー",
  "建模上下文声学表示": "文脈を含む音響表現をモデル化",
  "识别头 / Decoder": "認識ヘッド / Decoder",
  "CTC、RNN-T 或 Attention 等路线输出 token": "CTC、RNN-T、Attention などの方式で token を出力",
  "文本后处理": "テキスト後処理",
  "规范化；按需补标点与对齐。热词也可在解码时介入": "正規化。必要に応じて句読点とアライメントを追加し、デコード時にホットワードも介入できます。",
  "常见为 16 kHz 单声道 PCM 分块，可附语言、热词和说话人上下文": "一般的には 16 kHz モノラル PCM のチャンクで、言語、ホットワード、話者コンテキストを付加できます。",
  "log-mel 特征或从波形学习的声学表示，经 Encoder 形成上下文状态": "log-mel 特徴または波形から学習した音響表現を Encoder に通して文脈状態を作ります。",
  "字符、音素或 subword token 概率，再解码成文字、时间戳和标点": "文字、音素、subword token の確率をデコードし、テキスト、タイムスタンプ、句読点にします。",
  "CTC、RNNT 与注意力交叉熵是不同训练路线，不应视为同一个算法": "CTC、RNNT、Attention の交差エントロピーは異なる学習方式であり、同じアルゴリズムとみなしてはいけません。",
  "WER/CER、首字与句末延迟、RTF、热词召回和流式结果回滚率": "WER/CER、初回文字と文末の遅延、RTF、ホットワード再現率、ストリーミング結果のロールバック率",
  "流式系统需要控制 chunk、右侧上下文和状态缓存；离线系统更重视全局上下文": "ストリーミングでは chunk、右コンテキスト、状態キャッシュを制御し、オフラインでは全体コンテキストを重視します。",
  "CTC 对齐": "CTC アライメント",
  "同一句文字 y 可以对应多条含 blank 和重复 token 的帧级路径 π；CTC 把这些合法路径的概率相加。": "同じ文字列 y は blank と重複 token を含む複数のフレーム経路 π に対応できます。CTC は有効な経路の確率を合計します。",
  "词错误率": "単語誤り率",
  "S、D、I 分别是替换、删除和插入词数，N 是参考文本词数；中文也常按字计算 CER。": "S、D、I はそれぞれ置換、削除、挿入の単語数、N は参照テキストの単語数です。中国語では文字誤り率 CER もよく使います。",
  "实时因子": "リアルタイム係数",
  "RTF 小于 1 表示处理速度快于音频时长，但不等于首字延迟一定低。": "RTF が 1 未満なら音声長より速く処理できますが、初回文字遅延が低いとは限りません。",
  "低延迟流式 ASR": "低遅延ストリーミング ASR",
  "Conformer 同时看局部卷积特征和全局上下文，RNNT 边接收帧边输出 token。": "Conformer は局所畳み込み特徴と全体コンテキストを組み合わせ、RNNT はフレームを受け取りながら token を出力します。",
  "适合语音助手、实时字幕、车载语音和会议增量转写。": "音声アシスタント、リアルタイム字幕、車載音声、会議の逐次文字起こしに適しています。",
  "要同时优化首字延迟、临时结果稳定性和热词召回。": "初回文字遅延、暫定結果の安定性、ホットワード再現率を同時に最適化する必要があります。",
  "少标注语音识别训练": "少量ラベル音声認識学習",
  "从未标注波形学习语音表示，再用标注文本做 CTC 等监督微调。": "未ラベル波形から音声表現を学び、ラベル付きテキストで CTC などの教師あり微調整を行います。",
  "适合冷门语种、行业语音和需要自建模型的数据启动阶段。": "低リソース言語、業界音声、自前モデルのデータ準備段階に適しています。",
  "自监督表示不等于完整 ASR 产品，还要补解码、标点和领域词。": "自己教師あり表現だけでは ASR 製品にならず、デコード、句読点、分野語彙も必要です。",
  "多语言离线转写": "多言語オフライン文字起こし",
  "把 30 秒左右音频片段转成 log-mel，再用编码器-解码器 Transformer 输出文本 token。": "約 30 秒の音声チャンクを log-mel に変換し、Encoder-Decoder Transformer でテキスト token を出力します。",
  "适合录音转写、字幕生成、内容审核和多语言素材整理。": "録音文字起こし、字幕生成、コンテンツ審査、多言語素材整理に適しています。",
  "实时低延迟不是它的唯一目标，工程上常要做分段、队列和后处理。": "超低遅延だけが目的ではなく、実運用では分割、キュー、後処理が必要になることが多いです。",
  "中文和工业级 ASR 参考": "中国語・産業向け ASR の参考",
  "Paraformer 通过非自回归预测提升解码效率，FunASR 提供端点、标点、说话人等工程链路。": "Paraformer は非自己回帰予測でデコードを高速化し、FunASR はエンドポイント、句読点、話者分離などの実装経路を提供します。",
  "适合中文会议、客服、设备命令词和本地化 ASR 方案评估。": "中国語会議、カスタマーサービス、デバイスコマンド、ローカル ASR 方案の評価に適しています。",
  "不同模型大小、授权和部署后端会影响端侧可用性。": "モデルサイズ、ライセンス、デプロイバックエンドがエッジでの利用可能性に影響します。",
  "云端高质量语音转文字": "クラウド高品質音声文字変換",
  "面向语音转写任务的端到端模型，直接从音频输入输出文字结果。": "音声文字起こし向けのエンドツーエンドモデルで、音声入力から直接テキスト結果を出力します。",
  "适合云端转写、复杂口音、多语言内容和需要快速集成的产品。": "クラウド文字起こし、複雑な訛り、多言語コンテンツ、迅速な統合が必要な製品に適しています。",
  "云服务要关注费用、延迟、隐私合规和网络可用性。": "クラウドサービスでは費用、遅延、プライバシーコンプライアンス、ネットワーク可用性を確認します。",
  "ASR 的目标是把人说的话转换成可编辑、可检索、可控制设备的文字。它适合语音助手、会议纪要、字幕、客服质检和车载语音。": "ASR の目的は話し言葉を編集・検索でき、デバイスを制御できる文字へ変換することです。音声アシスタント、会議議事録、字幕、コンタクトセンター品質管理、車載音声に適しています。",
  "先按模型选择前端：可提取 log-Mel/MFCC，也可直接从 PCM 学习表示；不是所有模型都需要傅里叶变换。频谱路线要区分窗长与步长，例如 25 ms 窗每 10 ms 移动一次。Encoder 建模上下文，CTC、RNN-T 或 Attention Decoder 按各自规则生成 token。标点可能由模型直接输出，也可后处理；热词可参与解码，时间戳通常需要专门输出或对齐。": "まずモデルに応じてフロントエンドを選びます。log-Mel/MFCC を抽出することも、PCM から直接表現を学ぶこともできます。すべてのモデルにフーリエ変換が必要なわけではありません。スペクトル系では窓長と hop を区別し、例えば 25 ms 窓を 10 ms ごとに移動します。Encoder が文脈をモデル化し、CTC、RNN-T、Attention Decoder がそれぞれの規則で token を生成します。句読点はモデルが直接出力する場合と後処理する場合があり、ホットワードはデコードに参加でき、タイムスタンプには専用出力またはアライメントが必要です。",
  "核心技术包括端点检测、特征提取、Conformer/Transformer Encoder、CTC、RNNT、语言模型重打分、热词增强、说话人分离和标点恢复。": "主要技術はエンドポイント検出、特徴抽出、Conformer/Transformer Encoder、CTC、RNNT、言語モデル再スコアリング、ホットワード強化、話者分離、句読点復元です。",
  "离线转写适合会议纪要和录音整理；流式字幕强调首字延迟和增量稳定性；唤醒词/命令词适合端侧小模型和隐私优先场景。": "オフライン文字起こしは議事録や録音整理に向き、ストリーミング字幕は初回文字遅延と逐次結果の安定性を重視します。ウェイクワードやコマンドはエッジ小型モデルとプライバシー優先の場面に適しています。",
  "困难来自噪声、混响、远场、重叠说话、口音、专有名词和实时性。指标不能只看 WER/CER，还要看首字延迟、RTF、热词召回和临时结果回滚。": "課題は雑音、残響、遠方収音、発話の重なり、訛り、固有名詞、リアルタイム制約から生じます。WER/CER だけでなく、初回文字遅延、RTF、ホットワード再現率、暫定結果のロールバックも見ます。",
  "趋势是多语言统一模型、端云协同、低延迟流式大模型、语音到语义理解一体化，以及和多模态助手结合。": "動向は多言語統合モデル、エッジ・クラウド協調、低遅延ストリーミング基盤モデル、音声から意味理解までの統合、マルチモーダルアシスタントとの連携です。"
});

Object.assign(ko, {
  "语音识别 ASR 实验室": "음성 인식 ASR 랩",
  "语音转文字": "음성에서 텍스트로",
  "解释语音如何从 PCM 变成声学特征，再经过识别模型、解码和后处理输出文字。": "음성이 PCM에서 음향 특징으로 바뀐 뒤 인식 모델, 디코딩, 후처리를 거쳐 텍스트가 되는 과정을 설명합니다.",
  "语音识别 ASR 图解流程": "음성 인식 ASR 도해 흐름",
  "PCM 输入": "PCM 입력",
  "16 kHz 单声道语音常见": "16 kHz 모노 음성이 일반적",
  "模型前端": "모델 프런트엔드",
  "频谱路线常用 25 ms 窗、10 ms 步长；按模型配置": "스펙트럼 방식은 25 ms 창과 10 ms hop을 자주 사용하며 모델 설정에 맞춥니다.",
  "声学表示": "음향 표현",
  "log-Mel、MFCC 或波形学习前端，不是依次必经": "log-Mel, MFCC 또는 파형 학습 프런트엔드 중 하나이며 순서대로 모두 거치지는 않습니다.",
  "Encoder 编码器": "Encoder 인코더",
  "建模上下文声学表示": "문맥 음향 표현 모델링",
  "识别头 / Decoder": "인식 헤드 / Decoder",
  "CTC、RNN-T 或 Attention 等路线输出 token": "CTC, RNN-T, Attention 등의 방식으로 토큰 출력",
  "文本后处理": "텍스트 후처리",
  "规范化；按需补标点与对齐。热词也可在解码时介入": "정규화하고 필요하면 문장 부호와 정렬을 추가합니다. 디코딩 중 핫워드도 개입할 수 있습니다.",
  "常见为 16 kHz 单声道 PCM 分块，可附语言、热词和说话人上下文": "일반적으로 16 kHz 모노 PCM 청크를 사용하며 언어, 핫워드, 화자 문맥을 추가할 수 있습니다.",
  "log-mel 特征或从波形学习的声学表示，经 Encoder 形成上下文状态": "log-mel 특징 또는 파형에서 학습한 음향 표현을 Encoder로 처리해 문맥 상태를 만듭니다.",
  "字符、音素或 subword token 概率，再解码成文字、时间戳和标点": "문자, 음소, 서브워드 토큰 확률을 디코딩해 텍스트, 타임스탬프, 문장 부호로 만듭니다.",
  "CTC、RNNT 与注意力交叉熵是不同训练路线，不应视为同一个算法": "CTC, RNNT, 어텐션 교차 엔트로피는 서로 다른 학습 방식이며 같은 알고리즘으로 보면 안 됩니다.",
  "WER/CER、首字与句末延迟、RTF、热词召回和流式结果回滚率": "WER/CER, 첫 글자와 문장 끝 지연, RTF, 핫워드 재현율, 스트리밍 결과 롤백률",
  "流式系统需要控制 chunk、右侧上下文和状态缓存；离线系统更重视全局上下文": "스트리밍 시스템은 chunk, 오른쪽 문맥, 상태 캐시를 제어하고 오프라인 시스템은 전체 문맥을 더 중시합니다.",
  "CTC 对齐": "CTC 정렬",
  "同一句文字 y 可以对应多条含 blank 和重复 token 的帧级路径 π；CTC 把这些合法路径的概率相加。": "같은 텍스트 y는 blank와 반복 토큰을 포함한 여러 프레임 경로 π에 대응할 수 있으며 CTC는 유효 경로의 확률을 합산합니다.",
  "词错误率": "단어 오류율",
  "S、D、I 分别是替换、删除和插入词数，N 是参考文本词数；中文也常按字计算 CER。": "S, D, I는 각각 대체, 삭제, 삽입 단어 수이고 N은 참조 텍스트 단어 수입니다. 중국어에는 문자 오류율 CER도 자주 사용합니다.",
  "实时因子": "실시간 계수",
  "RTF 小于 1 表示处理速度快于音频时长，但不等于首字延迟一定低。": "RTF가 1보다 작으면 오디오 길이보다 빠르게 처리한다는 뜻이지만 첫 토큰 지연이 낮다는 의미는 아닙니다.",
  "低延迟流式 ASR": "저지연 스트리밍 ASR",
  "Conformer 同时看局部卷积特征和全局上下文，RNNT 边接收帧边输出 token。": "Conformer는 로컬 합성곱 특징과 전역 문맥을 함께 보고 RNNT는 프레임을 받으면서 토큰을 출력합니다.",
  "适合语音助手、实时字幕、车载语音和会议增量转写。": "음성 어시스턴트, 실시간 자막, 차량 음성, 회의 증분 전사에 적합합니다.",
  "要同时优化首字延迟、临时结果稳定性和热词召回。": "첫 글자 지연, 부분 결과 안정성, 핫워드 재현율을 함께 최적화해야 합니다.",
  "少标注语音识别训练": "저라벨 음성 인식 학습",
  "从未标注波形学习语音表示，再用标注文本做 CTC 等监督微调。": "비라벨 파형에서 음성 표현을 학습한 뒤 라벨 텍스트로 CTC 같은 지도 미세 조정을 합니다.",
  "适合冷门语种、行业语音和需要自建模型的数据启动阶段。": "저자원 언어, 산업 음성, 자체 모델 데이터 구축 초기 단계에 적합합니다.",
  "自监督表示不等于完整 ASR 产品，还要补解码、标点和领域词。": "자기지도 표현만으로 완전한 ASR 제품이 되지는 않으며 디코딩, 문장 부호, 분야 어휘가 더 필요합니다.",
  "多语言离线转写": "다국어 오프라인 전사",
  "把 30 秒左右音频片段转成 log-mel，再用编码器-解码器 Transformer 输出文本 token。": "약 30초 오디오 청크를 log-mel로 변환한 뒤 인코더-디코더 Transformer로 텍스트 토큰을 출력합니다.",
  "适合录音转写、字幕生成、内容审核和多语言素材整理。": "녹음 전사, 자막 생성, 콘텐츠 검수, 다국어 자료 정리에 적합합니다.",
  "实时低延迟不是它的唯一目标，工程上常要做分段、队列和后处理。": "초저지연만을 목표로 하지 않으므로 실제 시스템에서는 분할, 큐, 후처리가 자주 필요합니다.",
  "中文和工业级 ASR 参考": "중국어 및 산업용 ASR 참고",
  "Paraformer 通过非自回归预测提升解码效率，FunASR 提供端点、标点、说话人等工程链路。": "Paraformer는 비자기회귀 예측으로 디코딩 효율을 높이고 FunASR은 엔드포인트, 문장 부호, 화자 분리 같은 엔지니어링 경로를 제공합니다.",
  "适合中文会议、客服、设备命令词和本地化 ASR 方案评估。": "중국어 회의, 고객 서비스, 장치 명령어, 현지화 ASR方案 평가에 적합합니다.",
  "不同模型大小、授权和部署后端会影响端侧可用性。": "모델 크기, 라이선스, 배포 백엔드가 엣지 사용 가능성에 영향을 줍니다.",
  "云端高质量语音转文字": "클라우드 고품질 음성-텍스트",
  "面向语音转写任务的端到端模型，直接从音频输入输出文字结果。": "음성 전사 작업을 위한 종단 간 모델로 오디오 입력에서 텍스트 결과를 직접 출력합니다.",
  "适合云端转写、复杂口音、多语言内容和需要快速集成的产品。": "클라우드 전사, 복잡한 억양, 다국어 콘텐츠, 빠른 통합이 필요한 제품에 적합합니다.",
  "云服务要关注费用、延迟、隐私合规和网络可用性。": "클라우드 서비스에서는 비용, 지연, 개인정보 규정 준수, 네트워크 가용성을 확인해야 합니다.",
  "ASR 的目标是把人说的话转换成可编辑、可检索、可控制设备的文字。它适合语音助手、会议纪要、字幕、客服质检和车载语音。": "ASR의 목표는 말한 내용을 편집·검색하고 기기를 제어할 수 있는 텍스트로 바꾸는 것입니다. 음성 어시스턴트, 회의록, 자막, 고객 상담 품질 점검, 차량 음성에 적합합니다.",
  "先按模型选择前端：可提取 log-Mel/MFCC，也可直接从 PCM 学习表示；不是所有模型都需要傅里叶变换。频谱路线要区分窗长与步长，例如 25 ms 窗每 10 ms 移动一次。Encoder 建模上下文，CTC、RNN-T 或 Attention Decoder 按各自规则生成 token。标点可能由模型直接输出，也可后处理；热词可参与解码，时间戳通常需要专门输出或对齐。": "먼저 모델에 맞춰 프런트엔드를 선택합니다. log-Mel/MFCC를 추출하거나 PCM에서 직접 표현을 학습할 수 있으며 모든 모델에 푸리에 변환이 필요한 것은 아닙니다. 스펙트럼 방식에서는 창 길이와 hop을 구분해 25 ms 창을 10 ms마다 이동할 수 있습니다. Encoder가 문맥을 모델링하고 CTC, RNN-T, Attention Decoder가 각 규칙으로 토큰을 생성합니다. 문장 부호는 모델이 직접 출력하거나 후처리할 수 있고 핫워드는 디코딩에 참여하며 타임스탬프에는 전용 출력 또는 정렬이 필요합니다.",
  "核心技术包括端点检测、特征提取、Conformer/Transformer Encoder、CTC、RNNT、语言模型重打分、热词增强、说话人分离和标点恢复。": "핵심 기술은 엔드포인트 감지, 특징 추출, Conformer/Transformer Encoder, CTC, RNNT, 언어 모델 재점수화, 핫워드 강화, 화자 분리, 문장 부호 복원입니다.",
  "离线转写适合会议纪要和录音整理；流式字幕强调首字延迟和增量稳定性；唤醒词/命令词适合端侧小模型和隐私优先场景。": "오프라인 전사는 회의록과 녹음 정리에 적합하고 스트리밍 자막은 첫 글자 지연과 증분 안정성을 중시합니다. 웨이크워드와 명령어는 엣지 소형 모델과 개인정보 우선 환경에 적합합니다.",
  "困难来自噪声、混响、远场、重叠说话、口音、专有名词和实时性。指标不能只看 WER/CER，还要看首字延迟、RTF、热词召回和临时结果回滚。": "잡음, 잔향, 원거리 수음, 겹쳐 말하기, 억양, 고유명사, 실시간 제약이 어려움을 만듭니다. WER/CER뿐 아니라 첫 글자 지연, RTF, 핫워드 재현율, 부분 결과 롤백도 봐야 합니다.",
  "趋势是多语言统一模型、端云协同、低延迟流式大模型、语音到语义理解一体化，以及和多模态助手结合。": "동향은 다국어 통합 모델, 엣지-클라우드 협업, 저지연 스트리밍 파운데이션 모델, 음성에서 의미 이해까지의 통합, 멀티모달 어시스턴트 결합입니다."
});

Object.assign(ja, {
  "语音合成 TTS 实验室": "音声合成 TTS ラボ",
  "文本到语音": "テキストから音声へ",
  "解释文本如何经过规范化、韵律预测、声学模型和声码器生成自然语音。": "テキストが正規化、韻律予測、音響モデル、ボコーダーを経て自然な音声になる流れを説明します。",
  "语音合成 TTS 图解流程": "音声合成 TTS の図解フロー",
  "输入文本": "入力テキスト",
  "数字、单位、缩写和标点": "数字、単位、略語、句読点",
  "文本规范化": "テキスト正規化",
  "转为可朗读内容": "読み上げ可能な内容へ変換",
  "韵律 / 音素": "韻律 / 音素",
  "读音、停顿、重音": "発音、ポーズ、アクセント",
  "声学模型": "音響モデル",
  "预测 Mel 谱或 codec token": "Mel スペクトルまたは codec token を予測",
  "波形重建": "波形再構成",
  "Mel → 声码器；codec token → 匹配的 codec 解码器": "Mel → ボコーダー、codec token → 対応する codec デコーダー",
  "规范化文本或音素，以及说话人、语言、情绪和韵律条件": "正規化テキストまたは音素と、話者、言語、感情、韻律の条件",
  "音素隐藏状态、时长/音高/能量，以及 Mel 谱或离散 codec token": "音素の隠れ状態、長さ / ピッチ / エネルギー、Mel スペクトルまたは離散 codec token",
  "声码器或神经 codec 解码得到的 PCM 波形": "ボコーダーまたはニューラル codec がデコードした PCM 波形",
  "声学重建损失叠加时长、音高、能量损失；端到端模型还可能使用对抗损失": "音響再構成損失に長さ、ピッチ、エネルギー損失を加えます。エンドツーエンドモデルでは敵対的損失を使う場合もあります。",
  "MOS/CMOS、可懂度、说话人相似度、发音错误率、RTF 与首段音频延迟": "MOS/CMOS、明瞭度、話者類似度、発音誤り率、RTF、初回音声までの遅延",
  "区分整句与流式合成，关注长文本稳定性、声码器算力、授权和滥用防护": "全文合成とストリーミング合成を分け、長文の安定性、ボコーダー計算量、権利、悪用対策を確認します。",
  "时长展开": "長さの展開",
  "以 FastSpeech 类显式时长模型为例：每个音素展开为 dᵢ 个声学帧，时长之和决定帧数；并非所有 TTS 都有独立时长预测器。": "FastSpeech 系の明示的な長さモデルでは、各音素を dᵢ 個の音響フレームに展開し、合計でフレーム数が決まります。すべての TTS に独立した長さ予測器があるわけではありません。",
  "声学模型训练目标": "音響モデルの学習目標",
  "这是 FastSpeech 2 类路线的示意目标：M 为目标 Mel 谱。自回归 token、扩散与 flow matching 模型使用不同目标，不能套用同一公式。": "FastSpeech 2 系の例示的な目標で、M は目標 Mel スペクトルです。自己回帰 token、拡散、flow matching モデルは異なる目標を使うため、この式を共通化できません。",
  "波形生成": "波形生成",
  "声码器 Gθ 把声学表示 M、说话人向量 es 和韵律条件 p 转成最终波形。": "ボコーダー Gθ が音響表現 M、話者ベクトル es、韻律条件 p を最終波形へ変換します。",
  "高效文本到 Mel 谱": "効率的なテキストから Mel への合成",
  "非自回归地预测音素时长、音高、能量和 Mel 谱，速度比逐步生成更适合工程部署。": "音素の長さ、ピッチ、エネルギー、Mel スペクトルを非自己回帰で予測し、逐次生成より高速で実装に適しています。",
  "适合语音播报、客服提示音和需要稳定批量生成的 TTS。": "音声通知、サポート案内、安定した一括生成が必要な TTS に適しています。",
  "自然度还依赖文本前端、韵律数据和后端声码器质量。": "自然さはテキストフロントエンド、韻律データ、後段ボコーダーの品質にも依存します。",
  "端到端自然语音合成": "エンドツーエンド自然音声合成",
  "把声学模型和声码器联合训练，用变分推断和对抗训练提升自然度。": "音響モデルとボコーダーを共同学習し、変分推論と敵対的学習で自然さを高めます。",
  "常用于开源中文/多说话人 TTS、角色音色和内容创作工具。": "オープンソースの中国語 / 複数話者 TTS、キャラクターボイス、コンテンツ制作ツールでよく使われます。",
  "数据授权、相似音色滥用和长文本稳定性需要额外控制。": "データ権利、似た声の悪用、長文の安定性には追加の制御が必要です。",
  "神经声码器": "ニューラルボコーダー",
  "把 Mel 谱还原成 waveform，通过对抗训练生成更自然的细节。": "Mel スペクトルを waveform に復元し、敵対的学習で自然な細部を生成します。",
  "常接在 FastSpeech、Tacotron 或其他声学模型后面做最终出声。": "FastSpeech、Tacotron などの音響モデルの後段で最終音声を生成します。",
  "声码器不能修复所有前端错误，输入 Mel 谱不准会直接影响音质。": "ボコーダーですべてのフロントエンド誤りを直せるわけではなく、入力 Mel の誤りは音質に直接影響します。",
  "语音提示克隆和 codec token TTS": "音声プロンプトクローニングと codec token TTS",
  "把语音看成 codec token 序列，用短参考音频条件生成目标说话人风格。": "音声を codec token 列として扱い、短い参照音声を条件に対象話者のスタイルを生成します。",
  "适合理解零样本声音克隆、个性化 TTS 和生成式语音趋势。": "ゼロショット音声クローニング、個人化 TTS、生成音声の動向を理解するのに適しています。",
  "人物声音同意、鉴伪、水印和内容安全是落地前提。": "本人の声の同意、検出、ウォーターマーク、コンテンツ安全が導入の前提です。",
  "云端可控语音合成": "クラウド制御可能な音声合成",
  "把文本和风格指令转成语音输出，面向对话和应用集成。": "テキストとスタイル指示を音声出力へ変換し、対話やアプリ統合を想定します。",
  "适合客服播报、内容配音、语音助手和快速原型。": "サポート案内、コンテンツ吹き替え、音声アシスタント、迅速なプロトタイプに適しています。",
  "需要关注成本、延迟、可控性边界和声音授权。": "コスト、遅延、制御可能な範囲、音声の権利を確認する必要があります。",
  "TTS 把文字变成自然语音，可用于导航、客服、无障碍阅读、播报、配音和数字人。": "TTS は文字を自然な音声に変換し、ナビ、サポート、アクセシビリティ読上げ、通知、吹き替え、デジタルヒューマンに使えます。",
  "系统先决定文字该怎么读，再决定声音该怎么响。文本前端处理数字和多音字，韵律模块预测停顿和语调，声学模型生成声音表示，声码器把表示还原成波形。": "システムはまず文字の読み方を決め、次に声の響きを決めます。テキストフロントエンドが数字や多音字を処理し、韻律モジュールがポーズとイントネーションを予測し、音響モデルが音声表現を作り、ボコーダーが波形に戻します。",
  "核心技术包括文本规范化、G2P、音素/拼音、韵律预测、FastSpeech/Tacotron 类声学模型、HiFi-GAN/神经声码器、音色 embedding 和 codec token TTS。": "主な技術はテキスト正規化、G2P、音素 / ピンイン、韻律予測、FastSpeech/Tacotron 系音響モデル、HiFi-GAN/ニューラルボコーダー、音色 embedding、codec token TTS です。",
  "常见应用有语音播报、有声书、智能客服、车载提示、儿童故事、数字人和多语言配音。": "主な応用は音声通知、オーディオブック、スマートサポート、車載案内、子ども向け物語、デジタルヒューマン、多言語吹き替えです。",
  "挑战包括长文本稳定性、断句、情感自然度、实时延迟、音色授权、相似度滥用和跨语言发音。": "課題は長文の安定性、文の区切り、感情の自然さ、リアルタイム遅延、音色の権利、類似音声の悪用、言語間の発音です。",
  "趋势是可控情感、多说话人、零样本声音克隆、端侧实时 TTS、与大语言模型对话系统融合。": "動向は制御可能な感情、複数話者、ゼロショット音声クローニング、エッジのリアルタイム TTS、LLM 対話システムとの統合です。"
});

Object.assign(ko, {
  "语音合成 TTS 实验室": "음성 합성 TTS 랩",
  "文本到语音": "텍스트에서 음성으로",
  "解释文本如何经过规范化、韵律预测、声学模型和声码器生成自然语音。": "텍스트가 정규화, 운율 예측, 음향 모델, 보코더를 거쳐 자연스러운 음성이 되는 과정을 설명합니다.",
  "语音合成 TTS 图解流程": "음성 합성 TTS 도해 흐름",
  "输入文本": "입력 텍스트",
  "数字、单位、缩写和标点": "숫자, 단위, 약어, 문장 부호",
  "文本规范化": "텍스트 정규화",
  "转为可朗读内容": "읽을 수 있는 내용으로 변환",
  "韵律 / 音素": "운율 / 음소",
  "读音、停顿、重音": "발음, 멈춤, 강세",
  "声学模型": "음향 모델",
  "预测 Mel 谱或 codec token": "Mel 스펙트럼 또는 코덱 토큰 예측",
  "波形重建": "파형 재구성",
  "Mel → 声码器；codec token → 匹配的 codec 解码器": "Mel → 보코더, 코덱 토큰 → 대응 코덱 디코더",
  "规范化文本或音素，以及说话人、语言、情绪和韵律条件": "정규화된 텍스트 또는 음소와 화자, 언어, 감정, 운율 조건",
  "音素隐藏状态、时长/音高/能量，以及 Mel 谱或离散 codec token": "음소 은닉 상태, 길이/피치/에너지, Mel 스펙트럼 또는 이산 코덱 토큰",
  "声码器或神经 codec 解码得到的 PCM 波形": "보코더 또는 신경 코덱이 디코딩한 PCM 파형",
  "声学重建损失叠加时长、音高、能量损失；端到端模型还可能使用对抗损失": "음향 재구성 손실에 길이, 피치, 에너지 손실을 더하며 종단 간 모델은 적대적 손실을 사용할 수도 있습니다.",
  "MOS/CMOS、可懂度、说话人相似度、发音错误率、RTF 与首段音频延迟": "MOS/CMOS, 명료도, 화자 유사도, 발음 오류율, RTF, 첫 오디오 지연",
  "区分整句与流式合成，关注长文本稳定性、声码器算力、授权和滥用防护": "문장 단위와 스트리밍 합성을 구분하고 긴 텍스트 안정성, 보코더 연산량, 권리, 오용 방지를 확인합니다.",
  "时长展开": "길이 확장",
  "以 FastSpeech 类显式时长模型为例：每个音素展开为 dᵢ 个声学帧，时长之和决定帧数；并非所有 TTS 都有独立时长预测器。": "FastSpeech 계열의 명시적 길이 모델에서는 각 음소를 dᵢ개의 음향 프레임으로 펼치고 합계가 프레임 수를 정합니다. 모든 TTS에 독립 길이 예측기가 있는 것은 아닙니다.",
  "声学模型训练目标": "음향 모델 학습 목표",
  "这是 FastSpeech 2 类路线的示意目标：M 为目标 Mel 谱。自回归 token、扩散与 flow matching 模型使用不同目标，不能套用同一公式。": "FastSpeech 2 계열의 예시 목표이며 M은 목표 Mel 스펙트럼입니다. 자기회귀 토큰, 확산, flow matching 모델은 다른 목표를 사용하므로 같은 식을 적용할 수 없습니다.",
  "波形生成": "파형 생성",
  "声码器 Gθ 把声学表示 M、说话人向量 es 和韵律条件 p 转成最终波形。": "보코더 Gθ가 음향 표현 M, 화자 벡터 es, 운율 조건 p를 최종 파형으로 변환합니다.",
  "高效文本到 Mel 谱": "효율적인 텍스트-Mel 합성",
  "非自回归地预测音素时长、音高、能量和 Mel 谱，速度比逐步生成更适合工程部署。": "음소 길이, 피치, 에너지, Mel 스펙트럼을 비자기회귀로 예측해 순차 생성보다 빠르고 배포에 적합합니다.",
  "适合语音播报、客服提示音和需要稳定批量生成的 TTS。": "음성 안내, 고객 지원 안내음, 안정적인 일괄 생성이 필요한 TTS에 적합합니다.",
  "自然度还依赖文本前端、韵律数据和后端声码器质量。": "자연스러움은 텍스트 프런트엔드, 운율 데이터, 후단 보코더 품질에도 좌우됩니다.",
  "端到端自然语音合成": "종단 간 자연 음성 합성",
  "把声学模型和声码器联合训练，用变分推断和对抗训练提升自然度。": "음향 모델과 보코더를 함께 학습하고 변분 추론과 적대적 학습으로 자연스러움을 높입니다.",
  "常用于开源中文/多说话人 TTS、角色音色和内容创作工具。": "오픈소스 중국어/다중 화자 TTS, 캐릭터 음색, 콘텐츠 제작 도구에 자주 사용됩니다.",
  "数据授权、相似音色滥用和长文本稳定性需要额外控制。": "데이터 권리, 유사 음색 오용, 긴 텍스트 안정성에 추가 제어가 필요합니다.",
  "神经声码器": "신경 보코더",
  "把 Mel 谱还原成 waveform，通过对抗训练生成更自然的细节。": "Mel 스펙트럼을 waveform으로 복원하고 적대적 학습으로 더 자연스러운 세부를 생성합니다.",
  "常接在 FastSpeech、Tacotron 或其他声学模型后面做最终出声。": "FastSpeech, Tacotron 또는 다른 음향 모델 뒤에서 최종 음성을 생성하는 데 사용됩니다.",
  "声码器不能修复所有前端错误，输入 Mel 谱不准会直接影响音质。": "보코더가 모든 프런트엔드 오류를 고칠 수는 없으며 잘못된 Mel 입력은 음질에 직접 영향을 줍니다.",
  "语音提示克隆和 codec token TTS": "음성 프롬프트 복제 및 코덱 토큰 TTS",
  "把语音看成 codec token 序列，用短参考音频条件生成目标说话人风格。": "음성을 코덱 토큰 시퀀스로 보고 짧은 참조 음성을 조건으로 대상 화자 스타일을 생성합니다.",
  "适合理解零样本声音克隆、个性化 TTS 和生成式语音趋势。": "제로샷 음성 복제, 개인화 TTS, 생성 음성 동향을 이해하는 데 적합합니다.",
  "人物声音同意、鉴伪、水印和内容安全是落地前提。": "본인 음성 동의, 탐지, 워터마크, 콘텐츠 안전이 적용의 전제입니다.",
  "云端可控语音合成": "클라우드 제어 가능 음성 합성",
  "把文本和风格指令转成语音输出，面向对话和应用集成。": "텍스트와 스타일 지시를 음성 출력으로 바꾸며 대화와 앱 통합을 대상으로 합니다.",
  "适合客服播报、内容配音、语音助手和快速原型。": "고객 지원 안내, 콘텐츠 더빙, 음성 어시스턴트, 빠른 프로토타입에 적합합니다.",
  "需要关注成本、延迟、可控性边界和声音授权。": "비용, 지연, 제어 가능 범위, 음성 권리를 확인해야 합니다.",
  "TTS 把文字变成自然语音，可用于导航、客服、无障碍阅读、播报、配音和数字人。": "TTS는 텍스트를 자연스러운 음성으로 바꾸며 내비게이션, 고객 지원, 접근성 읽기, 안내, 더빙, 디지털 휴먼에 사용할 수 있습니다.",
  "系统先决定文字该怎么读，再决定声音该怎么响。文本前端处理数字和多音字，韵律模块预测停顿和语调，声学模型生成声音表示，声码器把表示还原成波形。": "시스템은 먼저 텍스트를 어떻게 읽을지 정한 뒤 소리가 어떻게 들릴지 정합니다. 텍스트 프런트엔드가 숫자와 다중 발음을 처리하고 운율 모듈이 멈춤과 억양을 예측하며 음향 모델이 음성 표현을 만들고 보코더가 파형으로 복원합니다.",
  "核心技术包括文本规范化、G2P、音素/拼音、韵律预测、FastSpeech/Tacotron 类声学模型、HiFi-GAN/神经声码器、音色 embedding 和 codec token TTS。": "핵심 기술은 텍스트 정규화, G2P, 음소/병음, 운율 예측, FastSpeech/Tacotron 계열 음향 모델, HiFi-GAN/신경 보코더, 음색 임베딩, 코덱 토큰 TTS입니다.",
  "常见应用有语音播报、有声书、智能客服、车载提示、儿童故事、数字人和多语言配音。": "주요 응용은 음성 안내, 오디오북, 스마트 고객 지원, 차량 안내, 어린이 이야기, 디지털 휴먼, 다국어 더빙입니다.",
  "挑战包括长文本稳定性、断句、情感自然度、实时延迟、音色授权、相似度滥用和跨语言发音。": "과제는 긴 텍스트 안정성, 문장 분할, 감정의 자연스러움, 실시간 지연, 음색 권리, 유사 음성 오용, 언어 간 발음입니다.",
  "趋势是可控情感、多说话人、零样本声音克隆、端侧实时 TTS、与大语言模型对话系统融合。": "동향은 제어 가능한 감정, 다중 화자, 제로샷 음성 복제, 엣지 실시간 TTS, LLM 대화 시스템과의 통합입니다."
});

Object.assign(ja, {
  "音频生成实验室": "音声生成ラボ",
  "生成式音频": "生成音声",
  "解释文本、旋律、参考音色或视频条件如何驱动模型生成音乐、音效、人声和环境声。": "テキスト、メロディー、参照音色、動画条件がモデルを駆動し、音楽、効果音、声、環境音を生成する流れを説明します。",
  "音频生成图解流程": "音声生成の図解フロー",
  "条件输入": "条件入力",
  "文本、旋律、参考音色": "テキスト、メロディー、参照音色",
  "条件编码": "条件エンコード",
  "转成模型可用表示": "モデルが使える表現へ変換",
  "生成模型": "生成モデル",
  "Transformer 或 Diffusion": "Transformer または Diffusion",
  "声学重建": "音響再構成",
  "声码器或 codec 解码": "ボコーダーまたは codec デコード",
  "安全与交付": "安全と提供",
  "水印、响度、格式": "ウォーターマーク、ラウドネス、形式",
  "文本、旋律、参考音频、视频、节拍或局部编辑掩码": "テキスト、メロディー、参照音声、動画、テンポ、局所編集マスク",
  "连续潜变量、Mel 谱或神经 codec 离散 token": "連続潜在変数、Mel スペクトル、ニューラル codec の離散 token",
  "音乐、环境声、音效或编辑后的 PCM 音频": "音楽、環境音、効果音、編集済み PCM 音声",
  "自回归 token 似然或扩散噪声预测，并用条件对齐约束提示词一致性": "自己回帰 token 尤度または拡散ノイズ予測を使い、条件アライメントでプロンプト整合性を制約します。",
  "主观偏好、FAD、文本-音频对齐、生成多样性、结构一致性和生成速度": "主観評価、FAD、テキスト・音声アライメント、生成多様性、構造一貫性、生成速度",
  "区分离线创作与交互生成，并处理时长、显存、来源标记、版权和安全过滤": "オフライン制作と対話的生成を分け、長さ、GPU メモリ、出典表示、著作権、安全フィルタを扱います。",
  "自回归 token 建模": "自己回帰 token モデリング",
  "zₜ 是当前 codec token，模型根据过去 token 和条件 c 预测下一个 token；序列越长，生成成本越高。": "zₜ は現在の codec token で、モデルは過去の token と条件 c から次の token を予測します。系列が長いほど生成コストが高くなります。",
  "扩散模型训练": "拡散モデルの学習",
  "噪声预测参数化的一种目标：zₜ = √ᾱₜ z₀ + √(1−ᾱₜ) ε，模型预测构造 zₜ 时的整体噪声 ε。t 是扩散步，不是音频采样时刻；并非所有生成模型都预测 ε。": "ノイズ予測パラメータ化の目標例です。zₜ = √ᾱₜ z₀ + √(1−ᾱₜ) ε で、モデルは zₜ の構成に使った全ノイズ ε を予測します。t は拡散ステップで音声サンプル時刻ではなく、すべての生成モデルが ε を予測するわけではありません。",
  "文本/旋律条件音乐生成": "テキスト / メロディー条件付き音楽生成",
  "基于 EnCodec token 做生成，文本或旋律条件控制音乐内容。": "EnCodec token 上で生成し、テキストやメロディー条件で音楽内容を制御します。",
  "适合配乐草稿、短视频音乐、音乐创意辅助和素材预览。": "スコア草案、短動画音楽、音楽アイデア支援、素材プレビューに適しています。",
  "版权、训练数据授权和旋律相似性必须在产品侧处理。": "著作権、学習データの権利、メロディー類似性を製品側で扱う必要があります。",
  "文本到音效/环境声": "テキストから効果音 / 環境音へ",
  "把文字场景条件映射到音频 token，生成非音乐类声音片段。": "テキストのシーン条件を音声 token に写像し、非音楽の音声クリップを生成します。",
  "适合游戏音效、视频补声、环境氛围和声音设计草稿。": "ゲーム効果音、動画の補助音、環境音、サウンドデザイン草案に適しています。",
  "生成结果需要人工筛选，瞬态、循环和真实感不总是稳定。": "生成結果は人手で選別する必要があり、過渡音、ループ、リアリティが常に安定するとは限りません。",
  "扩散式文本到音频": "拡散型テキスト音声生成",
  "在 latent 空间逐步去噪生成音频表示，再解码成可播放声音。": "latent 空間で段階的にノイズを除去して音声表現を生成し、再生可能な音にデコードします。",
  "适合通用音效生成、声音实验和多样化候选生成。": "汎用効果音生成、音声実験、多様な候補生成に適しています。",
  "扩散采样通常更耗时，实时互动要看模型和推理优化。": "拡散サンプリングは通常時間がかかり、リアルタイム対話ではモデルと推論の最適化が重要です。",
  "长结构文本到音乐研究方向": "長構造テキスト音楽生成の研究方向",
  "使用层级 token 和语义/声学表示，把文本描述转换成较长音乐结构。": "階層 token と意味 / 音響表現を使い、テキスト記述を比較的長い音楽構造へ変換します。",
  "适合理解音乐生成的结构控制、长时一致性和语义条件。": "音楽生成の構造制御、長時間の一貫性、意味条件を理解するのに適しています。",
  "并非所有研究模型都直接开放商用，落地要看可用接口和授权。": "すべての研究モデルが商用公開されているわけではなく、導入には利用可能な API とライセンスの確認が必要です。",
  "可控音乐生成": "制御可能な音楽生成",
  "通过非自回归或多条件控制，让节奏、和弦、文本等条件更容易约束生成结果。": "非自己回帰または複数条件制御により、リズム、コード、テキストなどで生成結果を制約しやすくします。",
  "适合音乐制作辅助、广告配乐和可编辑生成工作流。": "音楽制作支援、広告音楽、編集可能な生成ワークフローに適しています。",
  "可控性越强，交互设计和版权边界越需要清楚。": "制御性が高いほど、インタラクション設計と著作権の境界を明確にする必要があります。",
  "音频生成的目标是创造新内容，而不是识别已有声音。它可以生成音乐草稿、环境声、游戏音效、角色人声、配乐和声音修复结果。": "音声生成の目的は既存音を認識することではなく、新しいコンテンツを作ることです。音楽草案、環境音、ゲーム効果音、キャラクターボイス、劇伴、音声修復結果を生成できます。",
  "模型根据文本、旋律、参考音色或场景描述形成条件表示，再逐步生成音频 token、频谱或 waveform。最后通过声码器、codec 解码器或扩散解码得到可播放音频。": "モデルはテキスト、メロディー、参照音色、シーン記述から条件表現を作り、音声 token、スペクトル、waveform を段階的に生成します。最後にボコーダー、codec デコーダー、拡散デコーダーで再生可能な音声にします。",
  "核心技术包括文本编码器、音频 tokenizer、Transformer、自回归生成、扩散模型、神经声码器、风格控制、水印和内容安全检测。": "主要技術はテキストエンコーダー、音声 tokenizer、Transformer、自己回帰生成、拡散モデル、ニューラルボコーダー、スタイル制御、ウォーターマーク、コンテンツ安全検査です。",
  "应用包括短视频配乐、广告音效、游戏资产、虚拟主播、人声草稿、环境氛围和辅助声音设计。": "応用には短動画の劇伴、広告効果音、ゲーム素材、バーチャル配信者、声の草案、環境音、音響設計支援があります。",
  "挑战包括版权、训练数据授权、声音相似性、人物声音同意、时长一致性、可控性、生成伪影和滥用检测。": "課題は著作権、学習データの権利、声の類似性、本人の声の同意、長さの一貫性、制御性、生成アーティファクト、悪用検出です。",
  "趋势是多模态生成、可编辑音频 token、实时互动声音、长结构音乐生成和带水印的可追溯内容。": "動向はマルチモーダル生成、編集可能な音声 token、リアルタイム対話音、長構造音楽生成、ウォーターマーク付き追跡可能コンテンツです。"
});

Object.assign(ko, {
  "音频生成实验室": "오디오 생성 랩",
  "生成式音频": "생성 오디오",
  "解释文本、旋律、参考音色或视频条件如何驱动模型生成音乐、音效、人声和环境声。": "텍스트, 멜로디, 참조 음색, 비디오 조건이 모델을 구동해 음악, 효과음, 음성, 환경음을 생성하는 과정을 설명합니다.",
  "音频生成图解流程": "오디오 생성 도해 흐름",
  "条件输入": "조건 입력",
  "文本、旋律、参考音色": "텍스트, 멜로디, 참조 음색",
  "条件编码": "조건 인코딩",
  "转成模型可用表示": "모델이 사용할 수 있는 표현으로 변환",
  "生成模型": "생성 모델",
  "Transformer 或 Diffusion": "Transformer 또는 Diffusion",
  "声学重建": "음향 재구성",
  "声码器或 codec 解码": "보코더 또는 코덱 디코딩",
  "安全与交付": "안전 및 제공",
  "水印、响度、格式": "워터마크, 라우드니스, 형식",
  "文本、旋律、参考音频、视频、节拍或局部编辑掩码": "텍스트, 멜로디, 참조 오디오, 비디오, 템포 또는 부분 편집 마스크",
  "连续潜变量、Mel 谱或神经 codec 离散 token": "연속 잠재 변수, Mel 스펙트럼 또는 신경 코덱 이산 토큰",
  "音乐、环境声、音效或编辑后的 PCM 音频": "음악, 환경음, 효과음 또는 편집된 PCM 오디오",
  "自回归 token 似然或扩散噪声预测，并用条件对齐约束提示词一致性": "자기회귀 토큰 우도 또는 확산 노이즈 예측을 사용하고 조건 정렬로 프롬프트 일관성을 제한합니다.",
  "主观偏好、FAD、文本-音频对齐、生成多样性、结构一致性和生成速度": "주관적 선호, FAD, 텍스트-오디오 정렬, 생성 다양성, 구조 일관성, 생성 속도",
  "区分离线创作与交互生成，并处理时长、显存、来源标记、版权和安全过滤": "오프라인 제작과 대화형 생성을 구분하고 길이, GPU 메모리, 출처 표시, 저작권, 안전 필터를 처리합니다.",
  "自回归 token 建模": "자기회귀 토큰 모델링",
  "zₜ 是当前 codec token，模型根据过去 token 和条件 c 预测下一个 token；序列越长，生成成本越高。": "zₜ는 현재 코덱 토큰이며 모델은 이전 토큰과 조건 c로 다음 토큰을 예측합니다. 시퀀스가 길수록 생성 비용이 커집니다.",
  "扩散模型训练": "확산 모델 학습",
  "噪声预测参数化的一种目标：zₜ = √ᾱₜ z₀ + √(1−ᾱₜ) ε，模型预测构造 zₜ 时的整体噪声 ε。t 是扩散步，不是音频采样时刻；并非所有生成模型都预测 ε。": "노이즈 예측 파라미터화의 한 목표입니다. zₜ = √ᾱₜ z₀ + √(1−ᾱₜ) ε에서 모델은 zₜ를 만드는 데 사용된 전체 노이즈 ε를 예측합니다. t는 오디오 샘플 시각이 아닌 확산 단계이며 모든 생성 모델이 ε를 예측하는 것은 아닙니다.",
  "文本/旋律条件音乐生成": "텍스트/멜로디 조건 음악 생성",
  "基于 EnCodec token 做生成，文本或旋律条件控制音乐内容。": "EnCodec 토큰을 기반으로 생성하고 텍스트나 멜로디 조건으로 음악 내용을 제어합니다.",
  "适合配乐草稿、短视频音乐、音乐创意辅助和素材预览。": "스코어 초안, 숏폼 음악, 음악 아이디어 지원, 자료 미리보기에 적합합니다.",
  "版权、训练数据授权和旋律相似性必须在产品侧处理。": "저작권, 학습 데이터 권리, 멜로디 유사성은 제품 측에서 처리해야 합니다.",
  "文本到音效/环境声": "텍스트에서 효과음/환경음으로",
  "把文字场景条件映射到音频 token，生成非音乐类声音片段。": "텍스트 장면 조건을 오디오 토큰에 매핑해 비음악 음향 클립을 생성합니다.",
  "适合游戏音效、视频补声、环境氛围和声音设计草稿。": "게임 효과음, 영상 보조음, 환경 분위기, 사운드 디자인 초안에 적합합니다.",
  "生成结果需要人工筛选，瞬态、循环和真实感不总是稳定。": "생성 결과는 사람이 선별해야 하며 트랜지언트, 루프, 현실감이 항상 안정적인 것은 아닙니다.",
  "扩散式文本到音频": "확산 기반 텍스트-오디오",
  "在 latent 空间逐步去噪生成音频表示，再解码成可播放声音。": "latent 공간에서 단계적으로 노이즈를 제거해 오디오 표현을 생성한 뒤 재생 가능한 소리로 디코딩합니다.",
  "适合通用音效生成、声音实验和多样化候选生成。": "범용 효과음 생성, 소리 실험, 다양한 후보 생성에 적합합니다.",
  "扩散采样通常更耗时，实时互动要看模型和推理优化。": "확산 샘플링은 보통 시간이 더 걸리며 실시간 상호작용은 모델과 추론 최적화에 달려 있습니다.",
  "长结构文本到音乐研究方向": "긴 구조 텍스트-음악 연구 방향",
  "使用层级 token 和语义/声学表示，把文本描述转换成较长音乐结构。": "계층적 토큰과 의미/음향 표현으로 텍스트 설명을 긴 음악 구조로 변환합니다.",
  "适合理解音乐生成的结构控制、长时一致性和语义条件。": "음악 생성의 구조 제어, 장기 일관성, 의미 조건을 이해하는 데 적합합니다.",
  "并非所有研究模型都直接开放商用，落地要看可用接口和授权。": "모든 연구 모델이 바로 상용 공개되는 것은 아니며 실제 적용에는 사용 가능한 API와 라이선스를 확인해야 합니다.",
  "可控音乐生成": "제어 가능한 음악 생성",
  "通过非自回归或多条件控制，让节奏、和弦、文本等条件更容易约束生成结果。": "비자기회귀 또는 다중 조건 제어로 리듬, 코드, 텍스트 등의 조건이 생성 결과를 더 쉽게 제한하도록 합니다.",
  "适合音乐制作辅助、广告配乐和可编辑生成工作流。": "음악 제작 지원, 광고 음악, 편집 가능한 생성 워크플로에 적합합니다.",
  "可控性越强，交互设计和版权边界越需要清楚。": "제어성이 강할수록 상호작용 설계와 저작권 경계를 명확히 해야 합니다.",
  "音频生成的目标是创造新内容，而不是识别已有声音。它可以生成音乐草稿、环境声、游戏音效、角色人声、配乐和声音修复结果。": "오디오 생성의 목표는 기존 소리를 인식하는 것이 아니라 새 콘텐츠를 만드는 것입니다. 음악 초안, 환경음, 게임 효과음, 캐릭터 음성, 스코어, 음성 복원 결과를 생성할 수 있습니다.",
  "模型根据文本、旋律、参考音色或场景描述形成条件表示，再逐步生成音频 token、频谱或 waveform。最后通过声码器、codec 解码器或扩散解码得到可播放音频。": "모델은 텍스트, 멜로디, 참조 음색, 장면 설명으로 조건 표현을 만들고 오디오 토큰, 스펙트럼, waveform을 단계적으로 생성합니다. 마지막으로 보코더, 코덱 디코더, 확산 디코더로 재생 가능한 오디오를 얻습니다.",
  "核心技术包括文本编码器、音频 tokenizer、Transformer、自回归生成、扩散模型、神经声码器、风格控制、水印和内容安全检测。": "핵심 기술은 텍스트 인코더, 오디오 토크나이저, Transformer, 자기회귀 생성, 확산 모델, 신경 보코더, 스타일 제어, 워터마크, 콘텐츠 안전 검사입니다.",
  "应用包括短视频配乐、广告音效、游戏资产、虚拟主播、人声草稿、环境氛围和辅助声音设计。": "응용에는 숏폼 스코어, 광고 효과음, 게임 자산, 버추얼 진행자, 음성 초안, 환경 분위기, 사운드 디자인 지원이 있습니다.",
  "挑战包括版权、训练数据授权、声音相似性、人物声音同意、时长一致性、可控性、生成伪影和滥用检测。": "과제는 저작권, 학습 데이터 권리, 음성 유사성, 본인 음성 동의, 길이 일관성, 제어성, 생성 아티팩트, 오용 탐지입니다.",
  "趋势是多模态生成、可编辑音频 token、实时互动声音、长结构音乐生成和带水印的可追溯内容。": "동향은 멀티모달 생성, 편집 가능한 오디오 토큰, 실시간 상호작용 소리, 긴 구조 음악 생성, 워터마크 기반 추적 가능 콘텐츠입니다."
});

Object.assign(ja, {
  "AI 音频事件识别实验室": "AI 音響イベント認識ラボ",
  "非语音声音识别": "非音声音響認識",
  "解释哭声、玻璃破碎、狗叫声、警报声等事件如何从频谱模式中被识别。": "泣き声、ガラス破損、犬の鳴き声、警報音などのイベントをスペクトルパターンから認識する方法を説明します。",
  "AI 音频事件识别图解流程": "AI 音響イベント認識の図解フロー",
  "环境 PCM 片段": "環境 PCM クリップ",
  "连续监听或触发录音": "連続監視またはトリガー録音",
  "分帧 / STFT": "フレーミング / STFT",
  "形成短时频率结构": "短時間の周波数構造を形成",
  "log-mel 频谱图": "log-mel スペクトログラム",
  "二维时间频率能量图": "二次元の時間・周波数エネルギーマップ",
  "分类模型": "分類モデル",
  "CNN / Transformer 识别模式": "CNN / Transformer でパターンを認識",
  "阈值与告警": "しきい値とアラート",
  "输出类别、时间和置信度": "クラス、時刻、信頼度を出力",
  "连续环境 PCM，按重叠窗口切片并保留时间位置": "連続環境 PCM を重複窓で分割し、時間位置を保持",
  "log-mel patch 或预训练音频 embedding": "log-mel パッチまたは事前学習済み音声 embedding",
  "类别分数；片段分类只说明是否出现，起止时间需要帧级检测或额外时序后处理": "クラススコア。クリップ分類は出現の有無だけを示し、開始・終了時刻にはフレーム単位の検出または時系列後処理が必要です。",
  "多标签 sigmoid + BCE；类别极不均衡时可用加权 BCE 或 focal loss": "マルチラベル sigmoid + BCE。クラス不均衡が深刻なら重み付き BCE または focal loss を使えます。",
  "Precision、Recall、F1、mAP、事件错误率、每小时误报数和检测延迟": "Precision、Recall、F1、mAP、イベント誤り率、1 時間あたりの誤報数、検出遅延",
  "连续监听需设置阈值、迟滞、去抖和设备域校准，同时控制功耗与隐私": "連続監視ではしきい値、ヒステリシス、デバウンス、デバイスドメイン校正を設定し、消費電力とプライバシーも制御します。",
  "多标签概率": "マルチラベル確率",
  "各类单独做 sigmoid，分数不要求相加为 1，多种声音可同时出现；这不代表事件在统计上独立。未经校准的分数也不能当作告警正确率。": "各クラスに個別の sigmoid を適用し、スコアの合計は 1 でなくてよく、複数の音が同時に出現できます。これはイベントの統計的独立性を意味せず、校正されていないスコアをアラート正解率とみなせません。",
  "二元交叉熵": "二値交差エントロピー",
  "yc 是类别真实标签，pc 是预测概率；正负样本不平衡时需要类别权重或重采样。": "yc はクラスの正解ラベル、pc は予測確率です。正負サンプルが不均衡ならクラス重みまたは再サンプリングが必要です。",
  "告警效果平衡": "アラート性能のバランス",
  "P 是精确率、R 是召回率。安全告警还必须单独检查每小时误报数，不能只看 F1。": "P は適合率、R は再現率です。安全アラートでは F1 だけでなく、1 時間あたりの誤報数も個別に確認する必要があります。",
  "通用声音事件分类": "汎用音響イベント分類",
  "基于 MobileNet 的轻量模型，从 log-mel 特征中识别 AudioSet 类别。": "MobileNet ベースの軽量モデルで、log-mel 特徴から AudioSet クラスを認識します。",
  "适合教学、原型、端侧声音标签和环境声粗分类。": "教育、プロトタイプ、エッジの音響ラベル、環境音の粗分類に適しています。",
  "通用类别不等于产品级告警，婴儿哭声或玻璃破碎需要场景数据校准。": "汎用クラスは製品向けアラートと同じではなく、泣き声やガラス破損にはシーンデータでの校正が必要です。",
  "大规模音频标签识别": "大規模音声タグ認識",
  "用 CNN 在大规模弱标注数据上学习频谱时间模式，输出多标签声音类别。": "CNN で大規模な弱ラベルデータから時間・周波数パターンを学び、マルチラベル音響クラスを出力します。",
  "适合音频标签、素材库检索、环境声识别和迁移学习。": "音声タグ、素材検索、環境音認識、転移学習に適しています。",
  "弱标注数据会带来类别边界不清，落地要做阈值和误报验证。": "弱ラベルデータではクラス境界が曖昧になり、導入時にしきい値と誤報を検証する必要があります。",
  "Transformer 频谱图分类": "Transformer スペクトログラム分類",
  "把频谱图切成 patch，像视觉 Transformer 一样建模时间频率关系。": "スペクトログラムをパッチに分割し、Vision Transformer のように時間・周波数関係をモデル化します。",
  "适合高精度事件分类、研究评估和算力较充足的边云场景。": "高精度イベント分類、研究評価、計算資源に余裕のあるエッジ・クラウド環境に適しています。",
  "模型较重，端侧实时监听要关注功耗和延迟。": "比較的重いモデルなので、エッジ連続監視では消費電力と遅延に注意が必要です。",
  "音频自监督/预训练理解": "音声自己教師あり / 事前学習理解",
  "通过离散音频标签和预训练学习通用音频表示，再迁移到事件识别。": "離散音声ラベルと事前学習で汎用音声表現を学び、イベント認識へ転移します。",
  "适合小数据事件识别、异常声检测和更细粒度声音理解。": "少量データのイベント認識、異常音検出、より細かな音響理解に適しています。",
  "预训练模型仍要用目标设备采集的数据做验证和适配。": "事前学習モデルも対象デバイスで収録したデータによる検証と適応が必要です。",
  "文本描述驱动的声音检索": "テキスト記述による音声検索",
  "把声音片段和文字标签放到同一向量空间，用文本描述搜索或开放词表分类。": "音声クリップとテキストラベルを同じベクトル空間に置き、テキスト検索やオープンボキャブラリ分類を行います。",
  "适合素材库搜索、开放类别筛选和给事件识别补充语义标签。": "素材検索、オープンクラスの絞り込み、イベント認識への意味ラベル追加に適しています。",
  "开放词表结果需要阈值和人工规则保护，不能直接当安全告警。": "オープンボキャブラリの結果にはしきい値と人手ルールが必要で、そのまま安全アラートに使えません。",
  "事件识别回答的是“发生了什么声音”，不是“说了什么话”。它可以识别哭声、玻璃破碎、狗叫声、门铃、警报声、碰撞声等。": "イベント認識が答えるのは「どんな音が起きたか」であり、「何を話したか」ではありません。泣き声、ガラス破損、犬の鳴き声、ドアベル、警報音、衝突音などを認識できます。",
  "系统把环境 PCM 变成 log-mel 频谱图。横轴是时间，纵轴是频率，亮度代表能量。模型学习不同事件的频谱形状和时间节奏，例如玻璃破碎的短促高频、狗叫声的重复脉冲和哭声的调制结构。": "システムは環境 PCM を log-mel スペクトログラムに変換します。横軸は時間、縦軸は周波数、明るさはエネルギーを表します。モデルはイベントごとのスペクトル形状と時間リズムを学び、短く高いガラス破損音、犬の鳴き声の反復パルス、泣き声の変調構造などを捉えます。",
  "哭声": "泣き声",
  "玻璃破碎": "ガラス破損",
  "狗叫声": "犬の鳴き声",
  "核心技术包括 STFT、log-mel、数据增强、CNN/CRNN/Transformer 分类器、置信度阈值、事件后处理和边缘小模型部署。": "主な技術は STFT、log-mel、データ拡張、CNN/CRNN/Transformer 分類器、信頼度しきい値、イベント後処理、エッジ小型モデルのデプロイです。",
  "应用包括婴儿看护、摄像头安防、智能门铃、车载安全、工厂异常声检测、智慧家居和城市声音监测。": "応用には乳児見守り、カメラセキュリティ、スマートドアベル、車載安全、工場異常音検出、スマートホーム、都市音監視があります。",
  "挑战是误报和漏报的取舍、背景噪声、设备麦克风位置、训练数据覆盖、隐私策略和连续监听功耗。": "課題は誤報と見逃しのトレードオフ、背景雑音、デバイスのマイク位置、学習データの網羅性、プライバシー方針、連続監視の消費電力です。",
  "趋势是端侧事件识别、多标签连续检测、和摄像头/雷达多模态融合，以及更细粒度的异常声音理解。": "動向はエッジイベント認識、マルチラベル連続検出、カメラ / レーダーとのマルチモーダル融合、より細かな異常音理解です。"
});

Object.assign(ko, {
  "AI 音频事件识别实验室": "AI 오디오 이벤트 인식 랩",
  "非语音声音识别": "비음성 소리 인식",
  "解释哭声、玻璃破碎、狗叫声、警报声等事件如何从频谱模式中被识别。": "울음, 유리 파손, 개 짖는 소리, 경보 같은 이벤트를 스펙트럼 패턴에서 인식하는 방법을 설명합니다.",
  "AI 音频事件识别图解流程": "AI 오디오 이벤트 인식 도해 흐름",
  "环境 PCM 片段": "환경 PCM 클립",
  "连续监听或触发录音": "연속 모니터링 또는 트리거 녹음",
  "分帧 / STFT": "프레이밍 / STFT",
  "形成短时频率结构": "단시간 주파수 구조 형성",
  "log-mel 频谱图": "log-mel 스펙트로그램",
  "二维时间频率能量图": "2차원 시간-주파수 에너지 맵",
  "分类模型": "분류 모델",
  "CNN / Transformer 识别模式": "CNN / Transformer로 패턴 인식",
  "阈值与告警": "임계값과 알림",
  "输出类别、时间和置信度": "클래스, 시각, 신뢰도 출력",
  "连续环境 PCM，按重叠窗口切片并保留时间位置": "연속 환경 PCM을 겹치는 창으로 분할하고 시간 위치를 유지",
  "log-mel patch 或预训练音频 embedding": "log-mel 패치 또는 사전 학습 오디오 임베딩",
  "类别分数；片段分类只说明是否出现，起止时间需要帧级检测或额外时序后处理": "클래스 점수. 클립 분류는 발생 여부만 알려 주며 시작·종료 시각에는 프레임 수준 감지 또는 추가 시계열 후처리가 필요합니다.",
  "多标签 sigmoid + BCE；类别极不均衡时可用加权 BCE 或 focal loss": "멀티라벨 sigmoid + BCE. 클래스 불균형이 심하면 가중 BCE 또는 focal loss를 사용할 수 있습니다.",
  "Precision、Recall、F1、mAP、事件错误率、每小时误报数和检测延迟": "Precision, Recall, F1, mAP, 이벤트 오류율, 시간당 오탐 수, 감지 지연",
  "连续监听需设置阈值、迟滞、去抖和设备域校准，同时控制功耗与隐私": "연속 청취에는 임계값, 히스테리시스, 디바운스, 기기 도메인 보정을 설정하고 전력과 개인정보도 제어해야 합니다.",
  "多标签概率": "멀티라벨 확률",
  "各类单独做 sigmoid，分数不要求相加为 1，多种声音可同时出现；这不代表事件在统计上独立。未经校准的分数也不能当作告警正确率。": "각 클래스에 별도의 sigmoid를 적용하므로 점수 합이 1일 필요가 없고 여러 소리가 동시에 나타날 수 있습니다. 이것이 통계적 독립을 뜻하지는 않으며 보정되지 않은 점수는 알림 정확도가 아닙니다.",
  "二元交叉熵": "이진 교차 엔트로피",
  "yc 是类别真实标签，pc 是预测概率；正负样本不平衡时需要类别权重或重采样。": "yc는 클래스 정답 라벨, pc는 예측 확률입니다. 양성과 음성 샘플이 불균형하면 클래스 가중치 또는 재샘플링이 필요합니다.",
  "告警效果平衡": "알림 성능 균형",
  "P 是精确率、R 是召回率。安全告警还必须单独检查每小时误报数，不能只看 F1。": "P는 정밀도, R은 재현율입니다. 안전 알림은 F1만 보지 말고 시간당 오탐 수도 따로 확인해야 합니다.",
  "通用声音事件分类": "범용 소리 이벤트 분류",
  "基于 MobileNet 的轻量模型，从 log-mel 特征中识别 AudioSet 类别。": "MobileNet 기반 경량 모델로 log-mel 특징에서 AudioSet 클래스를 인식합니다.",
  "适合教学、原型、端侧声音标签和环境声粗分类。": "교육, 프로토타입, 엣지 소리 라벨, 환경음 거친 분류에 적합합니다.",
  "通用类别不等于产品级告警，婴儿哭声或玻璃破碎需要场景数据校准。": "범용 클래스가 제품 수준 알림을 의미하지는 않으며 아기 울음이나 유리 파손은 장면 데이터 보정이 필요합니다.",
  "大规模音频标签识别": "대규모 오디오 태깅",
  "用 CNN 在大规模弱标注数据上学习频谱时间模式，输出多标签声音类别。": "CNN으로 대규모 약라벨 데이터에서 시간-주파수 패턴을 학습하고 멀티라벨 소리 클래스를 출력합니다.",
  "适合音频标签、素材库检索、环境声识别和迁移学习。": "오디오 태깅, 자료 검색, 장면 인식, 전이 학습에 적합합니다.",
  "弱标注数据会带来类别边界不清，落地要做阈值和误报验证。": "약한 라벨은 클래스 경계를 흐리게 하므로 실제 적용에서 임계값과 오탐을 검증해야 합니다.",
  "Transformer 频谱图分类": "Transformer 스펙트로그램 분류",
  "把频谱图切成 patch，像视觉 Transformer 一样建模时间频率关系。": "스펙트로그램을 패치로 나눠 비전 Transformer처럼 시간-주파수 관계를 모델링합니다.",
  "适合高精度事件分类、研究评估和算力较充足的边云场景。": "고정밀 이벤트 분류, 연구 평가, 연산 자원이 충분한 엣지-클라우드 환경에 적합합니다.",
  "模型较重，端侧实时监听要关注功耗和延迟。": "모델이 비교적 무거워 엣지 연속 청취에서는 전력과 지연에 주의해야 합니다.",
  "音频自监督/预训练理解": "오디오 자기지도/사전학습 이해",
  "通过离散音频标签和预训练学习通用音频表示，再迁移到事件识别。": "이산 오디오 라벨과 사전학습으로 범용 오디오 표현을 학습한 뒤 이벤트 인식으로 전이합니다.",
  "适合小数据事件识别、异常声检测和更细粒度声音理解。": "소량 데이터 이벤트 인식, 이상음 감지, 세밀한 소리 이해에 적합합니다.",
  "预训练模型仍要用目标设备采集的数据做验证和适配。": "사전학습 모델도 대상 기기로 수집한 데이터로 검증하고 적응해야 합니다.",
  "文本描述驱动的声音检索": "텍스트 설명 기반 소리 검색",
  "把声音片段和文字标签放到同一向量空间，用文本描述搜索或开放词表分类。": "소리 클립과 텍스트 라벨을 같은 벡터 공간에 두고 텍스트 검색 또는 오픈 보캐뷸러리 분류를 수행합니다.",
  "适合素材库搜索、开放类别筛选和给事件识别补充语义标签。": "자료 검색, 개방형 클래스 필터링, 이벤트 인식의 의미 라벨 보완에 적합합니다.",
  "开放词表结果需要阈值和人工规则保护，不能直接当安全告警。": "오픈 보캐뷸러리 결과에는 임계값과 수동 규칙이 필요하며 바로 안전 알림으로 사용하면 안 됩니다.",
  "事件识别回答的是“发生了什么声音”，不是“说了什么话”。它可以识别哭声、玻璃破碎、狗叫声、门铃、警报声、碰撞声等。": "이벤트 인식은 ‘어떤 소리가 발생했는가’를 답하며 ‘무슨 말을 했는가’를 답하지 않습니다. 울음, 유리 파손, 개 짖는 소리, 초인종, 경보, 충돌음 등을 인식할 수 있습니다.",
  "系统把环境 PCM 变成 log-mel 频谱图。横轴是时间，纵轴是频率，亮度代表能量。模型学习不同事件的频谱形状和时间节奏，例如玻璃破碎的短促高频、狗叫声的重复脉冲和哭声的调制结构。": "시스템은 환경 PCM을 log-mel 스펙트로그램으로 변환합니다. 가로축은 시간, 세로축은 주파수, 밝기는 에너지를 나타냅니다. 모델은 이벤트별 스펙트럼 형태와 시간 리듬을 학습하며 짧은 고주파 유리 파손음, 반복되는 개 짖는 펄스, 울음의 변조 구조 등을 구분합니다.",
  "哭声": "울음소리",
  "玻璃破碎": "유리 파손",
  "狗叫声": "개 짖는 소리",
  "核心技术包括 STFT、log-mel、数据增强、CNN/CRNN/Transformer 分类器、置信度阈值、事件后处理和边缘小模型部署。": "핵심 기술은 STFT, log-mel, 데이터 증강, CNN/CRNN/Transformer 분류기, 신뢰도 임계값, 이벤트 후처리, 엣지 소형 모델 배포입니다.",
  "应用包括婴儿看护、摄像头安防、智能门铃、车载安全、工厂异常声检测、智慧家居和城市声音监测。": "응용에는 아기 모니터링, 카메라 보안, 스마트 초인종, 차량 안전, 공장 이상음 감지, 스마트 홈, 도시 소리 모니터링이 있습니다.",
  "挑战是误报和漏报的取舍、背景噪声、设备麦克风位置、训练数据覆盖、隐私策略和连续监听功耗。": "과제는 오탐과 누락의 균형, 배경 잡음, 기기 마이크 위치, 학습 데이터 범위, 개인정보 정책, 연속 청취 전력입니다.",
  "趋势是端侧事件识别、多标签连续检测、和摄像头/雷达多模态融合，以及更细粒度的异常声音理解。": "동향은 엣지 이벤트 인식, 멀티라벨 연속 감지, 카메라/레이더 멀티모달 융합, 더 세밀한 이상음 이해입니다."
});

Object.assign(ja, {
  "AI 音频增强实验室": "AI 音響強調ラボ",
  "学习型增强": "学習型音声強調",
  "解释 AI 降噪、语音分离和去混响如何从带噪 PCM 中估计目标语音。": "AI ノイズ抑圧、音声分離、残響除去がノイズを含む PCM から対象音声を推定する方法を説明します。",
  "AI 音频增强图解流程": "AI 音響強調の図解フロー",
  "带噪 PCM": "ノイズ付き PCM",
  "语音、噪声、混响或重叠人声": "音声、雑音、残響、重なった話者",
  "特征 / 编码": "特徴 / 符号化",
  "频谱或时域表示": "スペクトルまたは時間領域表現",
  "模型估计": "モデル推定",
  "语音 mask、噪声或目标声源": "音声 mask、雑音、対象音源",
  "重建 / 后滤波": "再構成 / ポストフィルタ",
  "降低噪声并保留语音": "雑音を下げて音声を保持",
  "增强 PCM": "強調 PCM",
  "输出给通话、播放或 ASR": "通話、再生、ASR へ出力",
  "混合信号 y，可包含目标语音 s、噪声 n、混响 r 或其他说话人": "対象音声 s、雑音 n、残響 r、他話者を含み得る混合信号 y",
  "复数 STFT、时频 mask/滤波器，或学习型时域潜变量": "複素 STFT、時間周波数 mask / フィルタ、学習型時間領域潜在変数",
  "目标语音估计或增强 PCM，送往通话、录音或 ASR": "対象音声推定または強調 PCM を通話、録音、ASR へ送出",
  "SI-SDR、波形与多分辨率 STFT 损失；不同模型再加入感知或对抗目标": "SI-SDR、波形、多解像度 STFT 損失に、モデルごとの知覚・敵対目標を加えます。",
  "SI-SDR 提升、STOI、PESQ/DNSMOS、下游 WER，以及延迟、RTF 和 MACs": "SI-SDR 改善、STOI、PESQ/DNSMOS、下流 WER、遅延、RTF、MACs",
  "实时模型必须因果或限制前视，维护跨帧状态，并评估陌生噪声与处理伪影": "リアルタイムモデルは因果的または先読み制限付きで、フレーム間状態を保持し、未知雑音と処理アーティファクトを評価します。",
  "时频混合模型": "時間周波数混合モデル",
  "简化情况下，观测频谱 Y 是目标语音 S 与噪声 N 的叠加；回声、混响和非线性失真需要更完整模型。": "単純化すると観測スペクトル Y は対象音声 S と雑音 N の加算です。エコー、残響、非線形ひずみにはより完全なモデルが必要です。",
  "学习型 mask": "学習型 mask",
  "模型预测 mask Mθ 来保留更像语音的时频单元；复数 mask 还能同时修正幅度和相位。": "モデルは音声らしい時間周波数ビンを残す mask Mθ を予測し、複素 mask なら振幅と位相を同時に修正できます。",
  "尺度不变失真比": "スケール不変 SDR",
  "它比较目标投影能量与残差能量，适合训练和评价分离/增强，但不能代替主观听感测试。": "対象への射影エネルギーと残差エネルギーを比較し、分離・強調の学習と評価に適しますが、主観聴取試験の代わりにはなりません。",
  "轻量实时语音降噪": "軽量リアルタイム音声ノイズ抑圧",
  "结合传统特征和小型循环网络，估计频带增益来压低噪声。": "従来特徴と小型リカレントネットワークを組み合わせ、帯域ゲインを推定して雑音を抑えます。",
  "适合低功耗通话、嵌入式设备和传统降噪后的神经后滤波参考。": "低消費電力通話、組み込み機器、従来ノイズ抑圧後のニューラルポストフィルタの参考に適しています。",
  "强噪声下可能牺牲语音自然度，不能替代完整 AEC/AGC 链路。": "強い雑音では音声の自然さを犠牲にすることがあり、完全な AEC/AGC 経路の代わりにはなりません。",
  "实时神经降噪": "リアルタイムニューラルノイズ抑圧",
  "在频域估计深度滤波系数，保留语音细节同时降低背景噪声。": "周波数領域で深層フィルタ係数を推定し、音声の細部を保ちながら背景雑音を下げます。",
  "适合 PC/移动端会议、直播降噪和本地实时语音增强。": "PC・モバイル会議、配信ノイズ抑圧、ローカルリアルタイム音声強調に適しています。",
  "实时效果取决于帧长、模型大小、CPU/NPU 后端和音频设备延迟。": "リアルタイム性能はフレーム長、モデルサイズ、CPU/NPU バックエンド、音声デバイス遅延に依存します。",
  "时域语音分离": "時間領域音声分離",
  "不先做频谱图，而是在时域学习编码、mask 和解码，把混合语音分开。": "先にスペクトログラムを作らず、時間領域で符号化、mask、デコードを学習して混合音声を分離します。",
  "适合理解重叠说话人分离、会议语音前处理和目标声源增强。": "重複話者分離、会議音声フロントエンド、対象音源強調の理解に適しています。",
  "多说话人数量、说话人变化和实时延迟会显著增加工程难度。": "話者数、話者の変化、リアルタイム遅延により実装の難易度が大きく上がります。",
  "音乐/语音源分离": "音楽 / 音声ソース分離",
  "用深度网络把混合音频分离成人声、鼓、贝斯或其他声源。": "深層ネットワークで混合音声をボーカル、ドラム、ベースなどの音源に分離します。",
  "适合音乐分轨、内容编辑、人声提取和离线修复工作流。": "音楽ステム分離、コンテンツ編集、ボーカル抽出、オフライン修復ワークフローに適しています。",
  "它更偏离线源分离，通话实时降噪要另看轻量模型。": "主にオフライン音源分離向けで、通話のリアルタイム抑圧には軽量モデルを別に検討します。",
  "频谱 mask 增强": "スペクトル mask 強調",
  "在频谱图上预测语音 mask，保留目标语音区域并压低噪声区域。": "スペクトログラム上で音声 mask を予測し、対象音声領域を残して雑音領域を抑えます。",
  "适合教学理解、ASR 前端增强和需要可视化 mask 的产品调试。": "教育、ASR フロントエンド強調、mask の可視化が必要な製品デバッグに適しています。",
  "mask 过强会造成音乐噪声、断字和高频损失。": "過度な mask はミュージカルノイズ、語の欠落、高域損失を生みます。",
  "AI 音频增强用训练出来的模型改善语音清晰度，常见能力包括 AI 降噪、去混响、目标说话人增强、语音分离和神经后滤波。": "AI 音響強調は学習済みモデルで音声の明瞭度を改善します。主な機能は AI ノイズ抑圧、残響除去、対象話者強調、音声分離、ニューラルポストフィルタです。",
  "模型学习语音、噪声和房间混响在特征空间里的差异，估计哪些时间频率区域更像语音，哪些更像噪声，然后重建较干净的 PCM。过强处理会带来断字、发闷和音乐噪声。": "モデルは特徴空間で音声、雑音、室内残響の差を学び、音声らしい時間周波数領域と雑音らしい領域を推定して、よりクリーンな PCM を再構成します。過剰処理は語の欠落、こもり、ミュージカルノイズを生みます。",
  "核心技术包括频谱 mask、时域分离网络、U-Net、DPRNN、Transformer、神经后滤波、感知损失、端侧量化和实时流式推理。": "主な技術はスペクトル mask、時間領域分離ネットワーク、U-Net、DPRNN、Transformer、ニューラルポストフィルタ、知覚損失、エッジ量子化、リアルタイムストリーミング推論です。",
  "应用包括会议软件、蓝牙耳机、直播降噪、车载通话、助听、短视频修音和 ASR 前端增强。": "応用には会議ソフト、Bluetooth ヘッドセット、配信ノイズ抑圧、車載通話、補聴、短動画音声修復、ASR フロントエンド強調があります。",
  "挑战是实时延迟、模型大小、NPU/DSP/CPU 占用、训练数据泛化、残留噪声和语音保真之间的平衡。": "課題はリアルタイム遅延、モデルサイズ、NPU/DSP/CPU 使用量、学習データの汎化、残留雑音、音声忠実度のバランスです。",
  "趋势是传统 AEC/AGC/NS 与神经后滤波混合、端侧小模型、个性化目标声源增强和多模态降噪。": "動向は従来の AEC/AGC/NS とニューラルポストフィルタの併用、エッジ小型モデル、個人化対象音源強調、マルチモーダルノイズ抑圧です。"
});

Object.assign(ko, {
  "AI 音频增强实验室": "AI 오디오 향상 랩",
  "学习型增强": "학습 기반 향상",
  "解释 AI 降噪、语音分离和去混响如何从带噪 PCM 中估计目标语音。": "AI 잡음 억제, 음성 분리, 잔향 제거가 잡음이 섞인 PCM에서 대상 음성을 추정하는 방법을 설명합니다.",
  "AI 音频增强图解流程": "AI 오디오 향상 도해 흐름",
  "带噪 PCM": "잡음 PCM",
  "语音、噪声、混响或重叠人声": "음성, 잡음, 잔향 또는 겹친 화자",
  "特征 / 编码": "특징 / 인코딩",
  "频谱或时域表示": "스펙트럼 또는 시간 영역 표현",
  "模型估计": "모델 추정",
  "语音 mask、噪声或目标声源": "음성 마스크, 잡음 또는 대상 음원",
  "重建 / 后滤波": "재구성 / 후필터",
  "降低噪声并保留语音": "잡음을 줄이고 음성 유지",
  "增强 PCM": "향상된 PCM",
  "输出给通话、播放或 ASR": "통화, 재생 또는 ASR로 출력",
  "混合信号 y，可包含目标语音 s、噪声 n、混响 r 或其他说话人": "대상 음성 s, 잡음 n, 잔향 r 또는 다른 화자를 포함할 수 있는 혼합 신호 y",
  "复数 STFT、时频 mask/滤波器，或学习型时域潜变量": "복소 STFT, 시간-주파수 마스크/필터 또는 학습 시간 영역 잠재 변수",
  "目标语音估计或增强 PCM，送往通话、录音或 ASR": "대상 음성 추정 또는 향상 PCM을 통화, 녹음, ASR로 전달",
  "SI-SDR、波形与多分辨率 STFT 损失；不同模型再加入感知或对抗目标": "SI-SDR, 파형, 다중 해상도 STFT 손실에 모델별 지각 또는 적대적 항을 추가합니다.",
  "SI-SDR 提升、STOI、PESQ/DNSMOS、下游 WER，以及延迟、RTF 和 MACs": "SI-SDR 향상, STOI, PESQ/DNSMOS, 다운스트림 WER, 지연, RTF, MACs",
  "实时模型必须因果或限制前视，维护跨帧状态，并评估陌生噪声与处理伪影": "실시간 모델은 인과적이거나 lookahead를 제한하고 프레임 간 상태를 유지하며 미지 잡음과 처리 아티팩트를 평가해야 합니다.",
  "时频混合模型": "시간-주파수 혼합 모델",
  "简化情况下，观测频谱 Y 是目标语音 S 与噪声 N 的叠加；回声、混响和非线性失真需要更完整模型。": "단순화하면 관측 스펙트럼 Y는 대상 음성 S와 잡음 N의 합입니다. 에코, 잔향, 비선형 왜곡에는 더 완전한 모델이 필요합니다.",
  "学习型 mask": "학습 마스크",
  "模型预测 mask Mθ 来保留更像语音的时频单元；复数 mask 还能同时修正幅度和相位。": "모델은 음성에 가까운 시간-주파수 빈을 보존하는 마스크 Mθ를 예측하며 복소 마스크는 크기와 위상도 함께 수정할 수 있습니다.",
  "尺度不变失真比": "스케일 불변 SDR",
  "它比较目标投影能量与残差能量，适合训练和评价分离/增强，但不能代替主观听感测试。": "대상 투영 에너지와 잔차 에너지를 비교해 분리/향상 학습과 평가에 적합하지만 청취 시험을 대신할 수는 없습니다.",
  "轻量实时语音降噪": "경량 실시간 음성 잡음 억제",
  "结合传统特征和小型循环网络，估计频带增益来压低噪声。": "전통 특징과 소형 순환 네트워크를 결합해 대역 이득을 추정하고 잡음을 줄입니다.",
  "适合低功耗通话、嵌入式设备和传统降噪后的神经后滤波参考。": "저전력 통화, 임베디드 기기, 전통 잡음 억제 후 신경 후필터 참고에 적합합니다.",
  "强噪声下可能牺牲语音自然度，不能替代完整 AEC/AGC 链路。": "강한 잡음에서는 음성 자연스러움을 희생할 수 있으며 전체 AEC/AGC 경로를 대신하지 않습니다.",
  "实时神经降噪": "실시간 신경 잡음 억제",
  "在频域估计深度滤波系数，保留语音细节同时降低背景噪声。": "주파수 영역에서 심층 필터 계수를 추정해 음성 세부를 유지하면서 배경 잡음을 줄입니다.",
  "适合 PC/移动端会议、直播降噪和本地实时语音增强。": "PC/모바일 회의, 스트리밍 잡음 억제, 로컬 실시간 음성 향상에 적합합니다.",
  "实时效果取决于帧长、模型大小、CPU/NPU 后端和音频设备延迟。": "실시간 성능은 프레임 길이, 모델 크기, CPU/NPU 백엔드, 오디오 장치 지연에 좌우됩니다.",
  "时域语音分离": "시간 영역 음성 분리",
  "不先做频谱图，而是在时域学习编码、mask 和解码，把混合语音分开。": "먼저 스펙트로그램을 만들지 않고 시간 영역에서 인코딩, 마스크, 디코딩을 학습해 혼합 음성을 분리합니다.",
  "适合理解重叠说话人分离、会议语音前处理和目标声源增强。": "겹친 화자 분리, 회의 음성 프런트엔드, 대상 음원 향상을 이해하는 데 적합합니다.",
  "多说话人数量、说话人变化和实时延迟会显著增加工程难度。": "화자 수, 화자 변화, 실시간 지연은 엔지니어링 난도를 크게 높입니다.",
  "音乐/语音源分离": "음악/음성 소스 분리",
  "用深度网络把混合音频分离成人声、鼓、贝斯或其他声源。": "딥 네트워크로 혼합 오디오를 보컬, 드럼, 베이스 또는 다른 음원으로 분리합니다.",
  "适合音乐分轨、内容编辑、人声提取和离线修复工作流。": "음악 스템 분리, 콘텐츠 편집, 보컬 추출, 오프라인 복원 워크플로에 적합합니다.",
  "它更偏离线源分离，通话实时降噪要另看轻量模型。": "주로 오프라인 소스 분리용이며 통화 실시간 잡음 억제에는 더 가벼운 모델을 따로 봐야 합니다.",
  "频谱 mask 增强": "스펙트럼 마스크 향상",
  "在频谱图上预测语音 mask，保留目标语音区域并压低噪声区域。": "스펙트로그램에서 음성 마스크를 예측해 대상 음성 영역을 남기고 잡음 영역을 낮춥니다.",
  "适合教学理解、ASR 前端增强和需要可视化 mask 的产品调试。": "교육, ASR 프런트엔드 향상, 마스크 시각화가 필요한 제품 디버깅에 적합합니다.",
  "mask 过强会造成音乐噪声、断字和高频损失。": "마스크가 과하면 음악성 잡음, 단어 끊김, 고주파 손실이 발생합니다.",
  "AI 音频增强用训练出来的模型改善语音清晰度，常见能力包括 AI 降噪、去混响、目标说话人增强、语音分离和神经后滤波。": "AI 오디오 향상은 학습 모델로 음성 명료도를 개선합니다. 주요 기능은 AI 잡음 억제, 잔향 제거, 대상 화자 향상, 음성 분리, 신경 후필터입니다.",
  "模型学习语音、噪声和房间混响在特征空间里的差异，估计哪些时间频率区域更像语音，哪些更像噪声，然后重建较干净的 PCM。过强处理会带来断字、发闷和音乐噪声。": "모델은 특징 공간에서 음성, 잡음, 실내 잔향의 차이를 학습하고 음성에 가까운 시간-주파수 영역과 잡음 영역을 추정해 더 깨끗한 PCM을 재구성합니다. 과도한 처리는 단어 끊김, 먹먹함, 음악성 잡음을 만들 수 있습니다.",
  "核心技术包括频谱 mask、时域分离网络、U-Net、DPRNN、Transformer、神经后滤波、感知损失、端侧量化和实时流式推理。": "핵심 기술은 스펙트럼 마스크, 시간 영역 분리 네트워크, U-Net, DPRNN, Transformer, 신경 후필터, 지각 손실, 엣지 양자화, 실시간 스트리밍 추론입니다.",
  "应用包括会议软件、蓝牙耳机、直播降噪、车载通话、助听、短视频修音和 ASR 前端增强。": "응용에는 회의 소프트웨어, 블루투스 헤드셋, 스트리밍 잡음 억제, 차량 통화, 보청, 숏폼 오디오 보정, ASR 프런트엔드 향상이 있습니다.",
  "挑战是实时延迟、模型大小、NPU/DSP/CPU 占用、训练数据泛化、残留噪声和语音保真之间的平衡。": "과제는 실시간 지연, 모델 크기, NPU/DSP/CPU 사용량, 학습 데이터 일반화, 잔류 잡음, 음성 충실도의 균형입니다.",
  "趋势是传统 AEC/AGC/NS 与神经后滤波混合、端侧小模型、个性化目标声源增强和多模态降噪。": "동향은 기존 AEC/AGC/NS와 신경 후필터 결합, 엣지 소형 모델, 개인화 대상 음원 향상, 멀티모달 잡음 억제입니다."
});

Object.assign(ja, {
  "AI 音频编码实验室": "AI 音声符号化ラボ",
  "神经 codec": "ニューラル codec",
  "解释神经编码器如何把 PCM 压缩成 token 或 latent，再由神经解码器重建音频。": "ニューラルエンコーダーが PCM を token または latent に圧縮し、ニューラルデコーダーが音声を再構成する流れを説明します。",
  "AI 音频编码图解流程": "AI 音声符号化の図解フロー",
  "PCM 音频帧": "PCM 音声フレーム",
  "原始采样值": "生サンプル値",
  "神经编码器": "ニューラルエンコーダー",
  "学习压缩表示": "圧縮表現を学習",
  "token / latent": "token / latent",
  "离散编号或连续向量": "離散 ID または連続ベクトル",
  "低码率码流": "低ビットレートストリーム",
  "用于弱网或生成式语音": "低品質ネットワークまたは生成音声用",
  "神经解码器": "ニューラルデコーダー",
  "重建可播放 PCM": "再生可能な PCM を再構成",
  "按帧输入 PCM，可包含语音、音乐或一般声音": "フレーム単位の PCM 入力で、音声、音楽、一般音響を含みます。",
  "编码器连续潜变量，经 VQ/RVQ 转成一个或多个离散码本索引": "エンコーダーの連続潜在変数を VQ/RVQ で 1 つ以上の離散コードブックインデックスに量子化",
  "带必要边信息的低码率索引流，以及解码重建 PCM": "必要なサイド情報を伴う低ビットレートのインデックスストリームと、デコード再構成 PCM",
  "波形/多分辨率 STFT 重建、量化承诺损失，并可加入感知或对抗损失": "波形 / 多解像度 STFT 再構成、量子化コミットメント損失に、知覚または敵対的損失を追加可能",
  "kbps、主观 MOS/MUSHRA、内容适配质量、算法延迟、RTF 和丢包鲁棒性": "kbps、主観 MOS/MUSHRA、コンテンツ適合品質、アルゴリズム遅延、RTF、パケット損失耐性",
  "编码端与解码端必须严格匹配模型、码本和版本；还需定义帧长、前视、封包和 PLC": "エンコーダーとデコーダーはモデル、コードブック、バージョンを厳密に一致させ、フレーム長、先読み、パケット化、PLC も定義します。",
  "矢量量化": "ベクトル量子化",
  "连续向量 z 被替换为最近码本向量 eₖ，并只传输索引 k；RVQ 会逐级量化前一级残差。": "連続ベクトル z を最近傍のコードブックベクトル eₖ に置き換え、インデックス k だけを送ります。RVQ は前段の残差を段階的に量子化します。",
  "原始 token 码率": "生 token ビットレート",
  "等大码本、固定长度索引：Ftoken 是每秒帧数，Q 是级数，K 是码本大小。K 为 2 的整数次幂时不需取整，例如 50 帧/s × 8 级 × 10 bit = 4 kbps。熵编码、封包和边信息会改变实际码率。": "同じ大きさのコードブックと固定長インデックスでは、Ftoken は毎秒フレーム数、Q は段数、K はコードブックサイズです。K が 2 のべき乗なら丸め不要で、50 フレーム/s × 8 段 × 10 bit = 4 kbps です。エントロピー符号化、パケット、サイド情報で実効レートは変わります。",
  "联合训练目标": "共同学習目標",
  "时域、频域、量化和对抗损失共同约束保真度与自然度；不同 codec 的具体组合并不相同。": "時間領域、周波数領域、量子化、敵対的損失が忠実度と自然さを共同で制約します。具体的な組み合わせは codec ごとに異なります。",
  "低码率实时神经 codec": "低ビットレートリアルタイムニューラル codec",
  "用神经编码器、量化器和解码器端到端压缩音频，目标是低码率下保持可懂度和质量。": "ニューラルエンコーダー、量子化器、デコーダーで音声をエンドツーエンド圧縮し、低ビットレートで明瞭度と品質を保ちます。",
  "适合理解实时通信、弱网音频和神经 codec 的基本路线。": "リアルタイム通信、低品質ネットワーク音声、ニューラル codec の基本経路を理解するのに適しています。",
  "不是 MP3/AAC 的手工变换编码路线，播放端必须有匹配的神经解码器。": "MP3/AAC の手作業による変換符号化とは異なり、再生側には対応するニューラルデコーダーが必要です。",
  "通用神经音频 codec 和生成 token": "汎用ニューラル音声 codec と生成 token",
  "使用卷积自编码器和残差向量量化，把 PCM 压成多级离散 code。": "畳み込みオートエンコーダーと残差ベクトル量子化で PCM を多段の離散 code に圧縮します。",
  "常用于音乐生成、语音生成、音频编辑和低码率重建研究。": "音楽生成、音声生成、音声編集、低ビットレート再構成の研究でよく使われます。",
  "码率、码本级数和模型大小会共同决定质量、延迟和算力。": "ビットレート、コードブック段数、モデルサイズが品質、遅延、計算量を共同で決めます。",
  "极低码率语音通信": "超低ビットレート音声通信",
  "把语音特征压缩到很低码率，再用生成式神经声码器重建语音。": "音声特徴を非常に低いビットレートへ圧縮し、生成ニューラルボコーダーで音声を再構成します。",
  "适合弱网语音、低带宽通话和移动网络不稳定场景。": "低品質ネットワーク音声、低帯域通話、不安定なモバイルネットワークに適しています。",
  "主要面向语音，不等同于高保真音乐编码。": "主に音声向けであり、高忠実度の音楽符号化と同じではありません。",
  "高质量神经 codec 研究": "高品質ニューラル codec 研究",
  "围绕神经编码、量化和解码提升重建音质，强调更自然的低码率音频。": "ニューラル符号化、量子化、デコードで再構成品質を高め、より自然な低ビットレート音声を目指します。",
  "适合对比神经 codec 结构、感知损失和高质量重建路线。": "ニューラル codec 構造、知覚損失、高品質再構成の経路を比較するのに適しています。",
  "研究模型到产品还要补流式、丢包、标准化和播放器生态。": "研究モデルを製品化するにはストリーミング、パケット損失、標準化、プレーヤー環境も補う必要があります。",
  "生成式语音和音频大模型中间表示": "生成音声・音声基盤モデルの中間表現",
  "先把音频压成离散 token，再像语言模型处理文字 token 一样预测音频 token。": "音声を離散 token に圧縮し、言語モデルが文字 token を扱うように音声 token を予測します。",
  "适合语音生成、音频补全、编辑、跨语言配音和多模态对话。": "音声生成、音声補完、編集、多言語吹き替え、マルチモーダル対話に適しています。",
  "token 越抽象越利于生成，但也可能损失细节和真实音色。": "token が抽象的になるほど生成には有利ですが、細部や本来の音色を失う可能性もあります。",
  "AI 音频编码用神经网络学习压缩表示，适合低码率通信、语音 token、内容编辑和生成式音频中间表示。": "AI 音声符号化はニューラルネットワークで圧縮表現を学習し、低ビットレート通信、音声 token、コンテンツ編集、生成音声の中間表現に使えます。",
  "神经编码器把短帧 PCM 压成 token 或 latent，码流传输后由神经解码器还原 PCM。它不等同于 MP3/AAC/Opus 的变换编码，而是让模型学习哪些信息最该保留。": "ニューラルエンコーダーが短い PCM フレームを token または latent に圧縮し、伝送後にニューラルデコーダーが PCM へ戻します。MP3/AAC/Opus の変換符号化とは異なり、何を残すべきかをモデルが学習します。",
  "核心技术包括自编码器、向量量化 VQ、残差量化 RVQ、codec token、感知损失、码率控制、丢包恢复和神经解码器。": "主な技術はオートエンコーダー、ベクトル量子化 VQ、残差量子化 RVQ、codec token、知覚損失、ビットレート制御、パケット損失復元、ニューラルデコーダーです。",
  "应用包括低码率语音通信、弱网会议、生成式语音 token、音频编辑、语音合成中间表示和边缘设备传输。": "応用には低ビットレート音声通信、低品質ネットワーク会議、生成音声 token、音声編集、音声合成の中間表現、エッジデバイス伝送があります。",
  "挑战包括算法延迟、跨设备一致性、算力、低码率失真、背景声保持、瞬态还原和传统生态兼容。": "課題はアルゴリズム遅延、デバイス間の一貫性、計算量、低ビットレートひずみ、背景音の保持、過渡音の復元、従来エコシステムとの互換性です。",
  "趋势是语义 token 与音频 codec 结合、极低码率语音、生成式重建、端侧神经 codec 和与大模型音频 token 的统一。": "動向は意味 token と音声 codec の融合、超低ビットレート音声、生成的再構成、エッジニューラル codec、基盤モデルの音声 token との統合です。"
});

Object.assign(ko, {
  "AI 音频编码实验室": "AI 오디오 코딩 랩",
  "神经 codec": "신경 코덱",
  "解释神经编码器如何把 PCM 压缩成 token 或 latent，再由神经解码器重建音频。": "신경 인코더가 PCM을 토큰 또는 latent로 압축하고 신경 디코더가 오디오를 재구성하는 과정을 설명합니다.",
  "AI 音频编码图解流程": "AI 오디오 코딩 도해 흐름",
  "PCM 音频帧": "PCM 오디오 프레임",
  "原始采样值": "원시 샘플 값",
  "神经编码器": "신경 인코더",
  "学习压缩表示": "압축 표현 학습",
  "token / latent": "토큰 / latent",
  "离散编号或连续向量": "이산 ID 또는 연속 벡터",
  "低码率码流": "저비트레이트 스트림",
  "用于弱网或生成式语音": "불안정 네트워크 또는 생성 음성용",
  "神经解码器": "신경 디코더",
  "重建可播放 PCM": "재생 가능한 PCM 재구성",
  "按帧输入 PCM，可包含语音、音乐或一般声音": "프레임 단위 PCM 입력으로 음성, 음악 또는 일반 소리를 포함할 수 있습니다.",
  "编码器连续潜变量，经 VQ/RVQ 转成一个或多个离散码本索引": "인코더 연속 잠재 변수를 VQ/RVQ로 하나 이상의 이산 코드북 인덱스로 양자화",
  "带必要边信息的低码率索引流，以及解码重建 PCM": "필요한 사이드 정보가 있는 저비트레이트 인덱스 스트림과 디코딩된 PCM",
  "波形/多分辨率 STFT 重建、量化承诺损失，并可加入感知或对抗损失": "파형/다중 해상도 STFT 재구성, 양자화 커밋먼트 손실, 선택적 지각 또는 적대적 손실",
  "kbps、主观 MOS/MUSHRA、内容适配质量、算法延迟、RTF 和丢包鲁棒性": "kbps, 주관적 MOS/MUSHRA, 콘텐츠 적합 품질, 알고리즘 지연, RTF, 패킷 손실 강건성",
  "编码端与解码端必须严格匹配模型、码本和版本；还需定义帧长、前视、封包和 PLC": "인코더와 디코더는 모델, 코드북, 버전을 엄격히 맞춰야 하며 프레임 길이, lookahead, 패킷화, PLC도 정의해야 합니다.",
  "矢量量化": "벡터 양자화",
  "连续向量 z 被替换为最近码本向量 eₖ，并只传输索引 k；RVQ 会逐级量化前一级残差。": "연속 벡터 z를 가장 가까운 코드북 벡터 eₖ로 바꾸고 인덱스 k만 전송합니다. RVQ는 이전 단계 잔차를 단계별로 양자화합니다.",
  "原始 token 码率": "원시 토큰 비트레이트",
  "等大码本、固定长度索引：Ftoken 是每秒帧数，Q 是级数，K 是码本大小。K 为 2 的整数次幂时不需取整，例如 50 帧/s × 8 级 × 10 bit = 4 kbps。熵编码、封包和边信息会改变实际码率。": "같은 크기의 코드북과 고정 길이 인덱스에서 Ftoken은 초당 프레임 수, Q는 단계 수, K는 코드북 크기입니다. K가 2의 거듭제곱이면 반올림이 필요 없고 50 frames/s × 8 stages × 10 bits = 4 kbps입니다. 엔트로피 코딩, 패킷, 사이드 정보가 실제 전송률을 바꿉니다.",
  "联合训练目标": "공동 학습 목표",
  "时域、频域、量化和对抗损失共同约束保真度与自然度；不同 codec 的具体组合并不相同。": "시간 영역, 주파수 영역, 양자화, 적대적 항이 충실도와 자연스러움을 함께 제한하며 구체적 조합은 코덱마다 다릅니다.",
  "低码率实时神经 codec": "저비트레이트 실시간 신경 코덱",
  "用神经编码器、量化器和解码器端到端压缩音频，目标是低码率下保持可懂度和质量。": "신경 인코더, 양자화기, 디코더로 오디오를 종단 간 압축해 낮은 비트레이트에서 명료도와 품질을 유지합니다.",
  "适合理解实时通信、弱网音频和神经 codec 的基本路线。": "실시간 통신, 불안정 네트워크 오디오, 신경 코덱의 기본 경로를 이해하는 데 적합합니다.",
  "不是 MP3/AAC 的手工变换编码路线，播放端必须有匹配的神经解码器。": "MP3/AAC의 수작업 변환 코딩 경로가 아니며 재생 측에 호환 신경 디코더가 필요합니다.",
  "通用神经音频 codec 和生成 token": "범용 신경 오디오 코덱 및 생성 토큰",
  "使用卷积自编码器和残差向量量化，把 PCM 压成多级离散 code。": "합성곱 오토인코더와 잔차 벡터 양자화로 PCM을 여러 단계의 이산 코드로 압축합니다.",
  "常用于音乐生成、语音生成、音频编辑和低码率重建研究。": "음악 생성, 음성 생성, 오디오 편집, 저비트레이트 재구성 연구에 자주 사용됩니다.",
  "码率、码本级数和模型大小会共同决定质量、延迟和算力。": "비트레이트, 코드북 단계 수, 모델 크기가 품질, 지연, 연산량을 함께 결정합니다.",
  "极低码率语音通信": "초저비트레이트 음성 통신",
  "把语音特征压缩到很低码率，再用生成式神经声码器重建语音。": "음성 특징을 매우 낮은 비트레이트로 압축한 뒤 생성형 신경 보코더로 음성을 재구성합니다.",
  "适合弱网语音、低带宽通话和移动网络不稳定场景。": "불안정 네트워크 음성, 저대역폭 통화, 불안정한 모바일 네트워크 환경에 적합합니다.",
  "主要面向语音，不等同于高保真音乐编码。": "주로 음성을 대상으로 하며 고음질 음악 코딩과 같지 않습니다.",
  "高质量神经 codec 研究": "고품질 신경 코덱 연구",
  "围绕神经编码、量化和解码提升重建音质，强调更自然的低码率音频。": "신경 코딩, 양자화, 디코딩으로 재구성 품질을 높이고 더 자연스러운 저비트레이트 오디오를 지향합니다.",
  "适合对比神经 codec 结构、感知损失和高质量重建路线。": "신경 코덱 구조, 지각 손실, 고품질 재구성 경로를 비교하는 데 적합합니다.",
  "研究模型到产品还要补流式、丢包、标准化和播放器生态。": "연구 모델을 제품화하려면 스트리밍, 패킷 손실, 표준화, 플레이어 생태계도 보완해야 합니다.",
  "生成式语音和音频大模型中间表示": "생성 음성 및 오디오 파운데이션 모델 중간 표현",
  "先把音频压成离散 token，再像语言模型处理文字 token 一样预测音频 token。": "오디오를 이산 토큰으로 압축한 뒤 언어 모델이 텍스트 토큰을 처리하듯 오디오 토큰을 예측합니다.",
  "适合语音生成、音频补全、编辑、跨语言配音和多模态对话。": "음성 생성, 오디오 인페인팅, 편집, 다국어 더빙, 멀티모달 대화에 적합합니다.",
  "token 越抽象越利于生成，但也可能损失细节和真实音色。": "토큰이 추상적일수록 생성에는 유리하지만 세부와 실제 음색을 잃을 수도 있습니다.",
  "AI 音频编码用神经网络学习压缩表示，适合低码率通信、语音 token、内容编辑和生成式音频中间表示。": "AI 오디오 코딩은 신경망으로 압축 표현을 학습하며 저비트레이트 통신, 음성 토큰, 콘텐츠 편집, 생성 오디오 중간 표현에 적합합니다.",
  "神经编码器把短帧 PCM 压成 token 或 latent，码流传输后由神经解码器还原 PCM。它不等同于 MP3/AAC/Opus 的变换编码，而是让模型学习哪些信息最该保留。": "신경 인코더가 짧은 PCM 프레임을 토큰 또는 latent로 압축하고 전송 후 신경 디코더가 PCM으로 복원합니다. MP3/AAC/Opus 변환 코딩과 달리 모델이 어떤 정보를 보존할지 학습합니다.",
  "核心技术包括自编码器、向量量化 VQ、残差量化 RVQ、codec token、感知损失、码率控制、丢包恢复和神经解码器。": "핵심 기술은 오토인코더, 벡터 양자화 VQ, 잔차 양자화 RVQ, 코덱 토큰, 지각 손실, 비트레이트 제어, 패킷 손실 복구, 신경 디코더입니다.",
  "应用包括低码率语音通信、弱网会议、生成式语音 token、音频编辑、语音合成中间表示和边缘设备传输。": "응용에는 저비트레이트 음성 통신, 불안정 네트워크 회의, 생성 음성 토큰, 오디오 편집, 음성 합성 중간 표현, 엣지 기기 전송이 있습니다.",
  "挑战包括算法延迟、跨设备一致性、算力、低码率失真、背景声保持、瞬态还原和传统生态兼容。": "과제는 알고리즘 지연, 기기 간 일관성, 연산량, 저비트레이트 왜곡, 배경음 보존, 트랜지언트 복원, 기존 생태계 호환입니다.",
  "趋势是语义 token 与音频 codec 结合、极低码率语音、生成式重建、端侧神经 codec 和与大模型音频 token 的统一。": "동향은 의미 토큰과 오디오 코덱 결합, 초저비트레이트 음성, 생성형 재구성, 엣지 신경 코덱, 파운데이션 모델 오디오 토큰과의 통합입니다."
});

Object.assign(ja, {
  "Flow Matching 基础目标": "Flow Matching の基本目的関数",
  "线性路径教学式：xτ = (1−τ)x₀ + τε，τ=0 是数据、τ=1 是噪声，模型学习速度 ε−x₀；生成时从噪声反向积分。它不是 ACE-Step 蒸馏训练的全部损失。": "教材の線形経路 xτ = (1−τ)x₀ + τε では τ=0 がデータ、τ=1 がノイズです。速度 ε−x₀ を学習し、生成時はノイズから逆に積分します。ACE-Step の蒸留損失すべてを表す式ではありません。",
  "可选 LM 规划语义码与音乐条件，DiT 经 Flow Matching 生成连续潜变量，1D 波形 VAE 输出 48 kHz 双声道 PCM。": "任意の LM が意味コードと音楽条件を計画し、DiT が Flow Matching で連続潜在変数を生成、1D 波形 VAE が48 kHz ステレオ PCM を出力します。"
});
Object.assign(ko, {
  "Flow Matching 基础目标": "Flow Matching 기본 목표",
  "线性路径教学式：xτ = (1−τ)x₀ + τε，τ=0 是数据、τ=1 是噪声，模型学习速度 ε−x₀；生成时从噪声反向积分。它不是 ACE-Step 蒸馏训练的全部损失。": "교육용 선형 경로 xτ = (1−τ)x₀ + τε에서 τ=0은 데이터, τ=1은 잡음입니다. 속도 ε−x₀를 학습하고 생성 시 잡음에서 역방향 적분합니다. ACE-Step 증류 학습의 전체 손실은 아닙니다.",
  "可选 LM 规划语义码与音乐条件，DiT 经 Flow Matching 生成连续潜变量，1D 波形 VAE 输出 48 kHz 双声道 PCM。": "선택적 LM이 의미 코드와 음악 조건을 계획하고 DiT가 Flow Matching으로 연속 잠재 변수를 생성하며 1D 파형 VAE가 48 kHz 스테레오 PCM을 출력합니다."
});

Object.assign(ja, {
  "文本条件音乐、音效与局部编辑": "テキスト条件付き音楽・効果音・部分編集",
  "DiT 在 SAME 连续潜空间生成，结合 Flow Matching、蒸馏和对抗后训练，SAME-L 解码为 44.1 kHz 双声道 PCM。": "DiT が SAME 連続潜在空間で生成し、Flow Matching・蒸留・敵対的な後学習を組み合わせ、SAME-L が44.1 kHz ステレオ PCM に復号します。",
  "Medium 支持音乐和音效，可按目标时长生成或用掩码编辑局部片段。": "Medium は音楽と効果音に対応し、指定長の生成やマスクによる部分編集が可能です。",
  "Small 分音乐与音效专用版，Large 仅 API；实际速度取决于硬件、时长和采样设置，权重授权需单独核对。": "Small は音楽用と効果音用、Large は API のみです。速度は機器・長さ・サンプリング設定に依存し、重みの許諾は個別確認が必要です。"
});
Object.assign(ko, {
  "文本条件音乐、音效与局部编辑": "텍스트 조건 음악·효과음·부분 편집",
  "DiT 在 SAME 连续潜空间生成，结合 Flow Matching、蒸馏和对抗后训练，SAME-L 解码为 44.1 kHz 双声道 PCM。": "DiT가 SAME 연속 잠재 공간에서 생성하고 Flow Matching·증류·적대적 후학습을 결합하며 SAME-L이 44.1 kHz 스테레오 PCM으로 복원합니다.",
  "Medium 支持音乐和音效，可按目标时长生成或用掩码编辑局部片段。": "Medium은 음악과 효과음을 지원하며 목표 길이 생성이나 마스크 기반 부분 편집이 가능합니다.",
  "Small 分音乐与音效专用版，Large 仅 API；实际速度取决于硬件、时长和采样设置，权重授权需单独核对。": "Small은 음악·효과음 전용으로 나뉘며 Large는 API 전용입니다. 속도는 하드웨어·길이·샘플링 설정에 따라 달라지며 가중치 허가는 따로 확인해야 합니다."
});

const localizeText = (text: SourceText): LocalizedText => ({
  zh: text.zh, "zh-Hant": traditional(text.zh),
  en: text.en,
  ja: ja[text.zh],
  ko: ko[text.zh]
});

const localizeArticle = (article: AiArticle): LocalizedAiArticle => ({
  title: localizeText(article.title),
  eyebrow: localizeText(article.eyebrow),
  summary: localizeText(article.summary),
  flowLabel: localizeText(article.flowLabel),
  flow: article.flow.map(step => ({ title: localizeText(step.title), detail: localizeText(step.detail) })),
  technical: Object.fromEntries(Object.entries(article.technical).map(([key, value]) => [key, localizeText(value)])) as LocalizedTechnicalProfile,
  equations: article.equations.map(equation => ({ expression: equation.expression, title: localizeText(equation.title), explanation: localizeText(equation.explanation) })),
  models: article.models.map(model => ({
    name: model.name,
    task: localizeText(model.task),
    principle: localizeText(model.principle),
    deployment: localizeText(model.deployment),
    caution: localizeText(model.caution)
  })),
  sections: article.sections.map(section => ({
    title: localizeText(section.title),
    body: localizeText(section.body),
    points: section.points?.map(point => localizeText(point))
  }))
});

export const aiArticles: Record<AiAudioLabId, LocalizedAiArticle> = Object.fromEntries(
  Object.entries(aiArticlesSource).map(([id, article]) => [id, localizeArticle(article)])
) as Record<AiAudioLabId, LocalizedAiArticle>;
