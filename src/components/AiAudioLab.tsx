import { ArrowLeft } from "lucide-react";
import type { AiAudioLabId, Language } from "../content/knowledge";

type AiAudioLabProps = {
  labId?: AiAudioLabId;
  language: Language;
  onBack: () => void;
};

type LocalizedText = Record<Language, string>;

type AiArticleSection = {
  title: LocalizedText;
  body: LocalizedText;
  points?: LocalizedText[];
};

type AiFlowStep = {
  title: LocalizedText;
  detail: LocalizedText;
};

type AiModelCard = {
  name: string;
  task: LocalizedText;
  principle: LocalizedText;
  deployment: LocalizedText;
  caution: LocalizedText;
};

type AiArticle = {
  title: LocalizedText;
  eyebrow: LocalizedText;
  summary: LocalizedText;
  flowLabel: LocalizedText;
  flow: AiFlowStep[];
  models: AiModelCard[];
  sections: AiArticleSection[];
};

const sectionTitles = {
  overview: { zh: "全面概述", en: "Overview" },
  principle: { zh: "基本原理", en: "Principles" },
  technologies: { zh: "核心技术", en: "Core technologies" },
  applications: { zh: "应用场景", en: "Applications" },
  challenges: { zh: "挑战", en: "Challenges" },
  trends: { zh: "未来趋势", en: "Future trends" }
} satisfies Record<string, LocalizedText>;

const aiArticles: Record<AiAudioLabId, AiArticle> = {
  overview: {
    title: { zh: "AI 音频总流程实验室", en: "AI Audio Overall Flow Lab" },
    eyebrow: { zh: "AI 音频入口", en: "AI audio entry" },
    summary: {
      zh: "用一条通用链路解释声音如何从物理声波变成 PCM、特征、模型输入和任务结果。",
      en: "A general chain explaining how physical sound becomes PCM, features, model input, and task results."
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
        title: { zh: "分帧加窗", en: "Frame and window" },
        detail: { zh: "切成短时稳定片段", en: "Slices audio into short stable frames" }
      },
      {
        title: { zh: "频谱 / Mel / MFCC", en: "Spectrum / Mel / MFCC" },
        detail: { zh: "形成时间频率特征或紧凑特征", en: "Forms time-frequency or compact features" }
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
          zh: "PCM 只是采样值序列，不包含“文字”“事件类别”或“干净语音”这些含义。AI 模型通常先看短时结构：每 10 ms 或 20 ms 一帧，计算频谱、Mel 频带能量、MFCC，或者由神经网络学习出 embedding，再由任务模型输出结果。",
          en: "PCM is only a sequence of samples. It does not directly contain words, event labels, or clean speech. AI models usually look at short-time structure: frames of around 10 ms or 20 ms, spectra, Mel-band energy, MFCCs, or learned neural embeddings, before a task model produces outputs."
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
        title: { zh: "分帧加窗", en: "Frame and window" },
        detail: { zh: "10 ms / 20 ms 短帧", en: "10 ms / 20 ms short frames" }
      },
      {
        title: { zh: "log-mel / MFCC", en: "log-mel / MFCC" },
        detail: { zh: "提取频率能量结构", en: "Extract frequency-energy structure" }
      },
      {
        title: { zh: "Encoder 编码器", en: "Encoder" },
        detail: { zh: "建模上下文声学表示", en: "Models contextual acoustic states" }
      },
      {
        title: { zh: "CTC / RNNT", en: "CTC / RNNT" },
        detail: { zh: "把帧序列对齐到 token", en: "Aligns frames to tokens" }
      },
      {
        title: { zh: "文本后处理", en: "Text post-processing" },
        detail: { zh: "标点、热词、时间戳", en: "Punctuation, hotwords, timestamps" }
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
          zh: "系统先把语音切成短帧，提取 log-mel 或 MFCC，再由 Encoder 建模前后文。CTC 或 RNNT 把大量声学帧压缩成较短 token 序列，解码器和后处理再补标点、热词和时间戳。",
          en: "The system slices speech into short frames, extracts log-mel or MFCC features, then uses an encoder to model context. CTC or RNNT compresses many acoustic frames into a shorter token sequence; decoding and post-processing add punctuation, hotwords, and timestamps."
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
        title: { zh: "神经声码器", en: "Neural vocoder" },
        detail: { zh: "合成可播放波形", en: "Synthesizes playable waveform" }
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
    models: [
      {
        name: "MusicGen",
        task: { zh: "文本/旋律条件音乐生成", en: "Text or melody-conditioned music generation" },
        principle: {
          zh: "基于 EnCodec token 做生成，文本或旋律条件控制音乐内容。",
          en: "Generates over EnCodec tokens while text or melody conditions steer the music."
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
        name: "AudioLDM",
        task: { zh: "扩散式文本到音频", en: "Diffusion-based text-to-audio" },
        principle: {
          zh: "在 latent 空间逐步去噪生成音频表示，再解码成可播放声音。",
          en: "Denoises latent audio representations step by step, then decodes them into playable sound."
        },
        deployment: {
          zh: "适合通用音效生成、声音实验和多样化候选生成。",
          en: "Fits general sound generation, audio experiments, and diverse candidate generation."
        },
        caution: {
          zh: "扩散采样通常更耗时，实时互动要看模型和推理优化。",
          en: "Diffusion sampling is often heavier; real-time interaction depends on model and inference optimization."
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

function AiArticleFlow({
  article,
  language
}: {
  article: AiArticle;
  language: Language;
}) {
  return (
    <section className="ai-article-diagram" aria-labelledby="ai-article-diagram-title">
      <div className="ai-article-section-heading">
        <span>{language === "zh" ? "图解流程" : "Diagram"}</span>
        <h2 id="ai-article-diagram-title">{article.flowLabel[language]}</h2>
      </div>
      <ol className="ai-article-flow" aria-label={article.flowLabel[language]}>
        {article.flow.map((step, index) => (
          <li key={step.title.en}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{step.title[language]}</strong>
            <p>{step.detail[language]}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function AiModelCards({
  article,
  language
}: {
  article: AiArticle;
  language: Language;
}) {
  const headingId = "ai-model-section-title";

  return (
    <section className="ai-model-section" aria-labelledby={headingId}>
      <div className="ai-article-section-heading ai-model-heading">
        <span>{language === "zh" ? "模型参考" : "Model references"}</span>
        <h2 id={headingId}>{language === "zh" ? "常用模型与前沿落地模型" : "Common and Frontier Deployed Models"}</h2>
      </div>
      <div className="ai-model-grid">
        {article.models.map((model) => (
          <article className="ai-model-card" key={model.name}>
            <h3>{model.name}</h3>
            <dl>
              <div>
                <dt>{language === "zh" ? "适合任务" : "Task"}</dt>
                <dd>{model.task[language]}</dd>
              </div>
              <div>
                <dt>{language === "zh" ? "基本原理" : "Principle"}</dt>
                <dd>{model.principle[language]}</dd>
              </div>
              <div>
                <dt>{language === "zh" ? "落地场景" : "Deployment"}</dt>
                <dd>{model.deployment[language]}</dd>
              </div>
              <div>
                <dt>{language === "zh" ? "注意点" : "Caution"}</dt>
                <dd>{model.caution[language]}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}

function AiArticleSections({
  article,
  language
}: {
  article: AiArticle;
  language: Language;
}) {
  return (
    <section className="ai-article-body" aria-label={language === "zh" ? "AI 音频文章内容" : "AI audio article content"}>
      {article.sections.map((section) => (
        <article className="ai-article-card" key={section.title.en}>
          <h2>{section.title[language]}</h2>
          <p>{section.body[language]}</p>
          {section.points ? (
            <ul>
              {section.points.map((point) => (
                <li key={point.en}>{point[language]}</li>
              ))}
            </ul>
          ) : null}
        </article>
      ))}
    </section>
  );
}

export function AiAudioLab({ labId = "event", language, onBack }: AiAudioLabProps) {
  const article = aiArticles[labId] ?? aiArticles.event;

  return (
    <main className="ai-audio-page ai-article-page" aria-label={article.title[language]}>
      <section className="sound-lab-hero ai-article-hero">
        <button className="sound-lab-back" type="button" onClick={onBack}>
          <ArrowLeft size={18} aria-hidden="true" />
          {language === "zh" ? "返回知识库" : "Back to knowledge base"}
        </button>
        <div>
          <span className="details-category">{article.eyebrow[language]}</span>
          <h1>{article.title[language]}</h1>
          <p>{article.summary[language]}</p>
        </div>
      </section>

      <AiArticleFlow article={article} language={language} />
      <AiModelCards article={article} language={language} />
      <AiArticleSections article={article} language={language} />
    </main>
  );
}
