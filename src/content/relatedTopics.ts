import { traditional } from "./traditional";
import type { AiAudioLabId, LocalizedText, Topic, TopicLab } from "./knowledge";

export type TopicKey = Exclude<TopicLab["type"], "ai-audio"> | `ai-${AiAudioLabId}`;

export function getTopicKey(topic: Topic): TopicKey | undefined {
  if (topic.title.en === "AI Audio Overall Flow") return "ai-overview";
  if (topic.title.en === "System Audio Architecture") return "system-audio";
  const lab = topic.detail.lab;
  if (!lab) return undefined;
  if (lab.type !== "ai-audio") return lab.type;
  return lab.initialMode ? `ai-${lab.initialMode}` : undefined;
}

export const relatedTopics: Record<TopicKey, { target: TopicKey; reason: LocalizedText }[]> = {
  "wave-spectrum": [
    { target: "sound-wave", reason: { zh: "回看单个正弦波的频率、振幅和相位。", "zh-Hant": traditional("回看单个正弦波的频率、振幅和相位。"), en: "Review frequency, amplitude, and phase of a single sine wave.", ja: "単一正弦波の周波数・振幅・位相を復習します。", ko: "단일 정현파의 주파수, 진폭, 위상을 복습합니다." } },
    { target: "core-signal-processing", reason: { zh: "继续理解 FFT/STFT 如何从 PCM 计算频谱。", "zh-Hant": traditional("继续理解 FFT/STFT 如何从 PCM 计算频谱。"), en: "Learn how FFT/STFT compute spectra from PCM.", ja: "FFT/STFT が PCM からスペクトルを計算する仕組みへ進みます。", ko: "FFT/STFT가 PCM에서 스펙트럼을 계산하는 원리를 학습합니다." } }
  ],
  "sound-wave": [
    {
      target: "microphone",
      reason: { zh: "声音的压力变化由麦克风转换为电信号。", "zh-Hant": traditional("声音的压力变化由麦克风转换为电信号。"), en: "A microphone converts sound-pressure changes into an electrical signal.", ja: "マイクは音圧の変化を電気信号に変換します。", ko: "마이크는 음압 변화를 전기 신호로 바꿉니다." }
    },
    {
      target: "sampling-quantization",
      reason: { zh: "采样与量化把连续波形变成数字音频。", "zh-Hant": traditional("采样与量化把连续波形变成数字音频。"), en: "Sampling and quantization turn a continuous wave into digital audio.", ja: "標本化と量子化で連続波形をデジタル音声に変換します。", ko: "샘플링과 양자화는 연속 파형을 디지털 오디오로 바꿉니다." }
    }
  ],
  "audio-units": [
    {
      target: "sampling-quantization",
      reason: { zh: "采样率和位深是理解数字音频单位的基础。", "zh-Hant": traditional("采样率和位深是理解数字音频单位的基础。"), en: "Sample rate and bit depth ground the main digital-audio units.", ja: "標本化周波数とビット深度はデジタル音声の単位を理解する基礎です。", ko: "샘플링 주파수와 비트 깊이는 디지털 오디오 단위 이해의 기초입니다." }
    },
    {
      target: "listening-metrics",
      reason: { zh: "响度单位需要结合听觉测量来理解。", "zh-Hant": traditional("响度单位需要结合听觉测量来理解。"), en: "Loudness units make more sense alongside perceptual measurements.", ja: "ラウドネスの単位は聴覚に基づく測定と合わせて理解できます。", ko: "라우드니스 단위는 청각 기반 측정과 함께 이해해야 합니다." }
    }
  ],
  "sampling-quantization": [
    {
      target: "core-signal-processing",
      reason: { zh: "数字信号处理直接作用于采样后的离散信号。", "zh-Hant": traditional("数字信号处理直接作用于采样后的离散信号。"), en: "Signal processing operates directly on sampled discrete signals.", ja: "信号処理は標本化された離散信号に直接作用します。", ko: "신호 처리는 샘플링된 이산 신호에 직접 작용합니다." }
    },
    {
      target: "audio-codec",
      reason: { zh: "编码器会压缩采样得到的 PCM 数据。", "zh-Hant": traditional("编码器会压缩采样得到的 PCM 数据。"), en: "Codecs compress the PCM data produced by sampling.", ja: "コーデックは標本化で得た PCM データを圧縮します。", ko: "코덱은 샘플링으로 얻은 PCM 데이터를 압축합니다." }
    }
  ],
  "listening-metrics": [
    {
      target: "audio-units",
      reason: { zh: "响度、声压级和数字电平使用不同参考点。", "zh-Hant": traditional("响度、声压级和数字电平使用不同参考点。"), en: "Loudness, sound pressure, and digital level use different references.", ja: "ラウドネス、音圧、デジタルレベルは異なる基準を使います。", ko: "라우드니스, 음압, 디지털 레벨은 서로 다른 기준을 사용합니다." }
    },
    {
      target: "speech-enhancement",
      reason: { zh: "增强效果需要用信噪比和感知质量衡量。", "zh-Hant": traditional("增强效果需要用信噪比和感知质量衡量。"), en: "Enhancement quality needs signal-to-noise and perceptual measures.", ja: "音声強調の品質は SNR と知覚品質の両面から評価します。", ko: "음성 향상 품질은 신호 대 잡음비와 지각 품질로 평가합니다." }
    }
  ],
  microphone: [
    {
      target: "sampling-quantization",
      reason: { zh: "麦克风信号通常经过 Codec 或 ADC 进入数字链路。", "zh-Hant": traditional("麦克风信号通常经过 Codec 或 ADC 进入数字链路。"), en: "Microphone signals usually enter the digital chain through a Codec or ADC.", ja: "マイク信号は通常 Codec や ADC を通ってデジタル経路に入ります。", ko: "마이크 신호는 보통 Codec이나 ADC를 거쳐 디지털 경로로 들어갑니다." }
    },
    {
      target: "digital-interface",
      reason: { zh: "数字麦克风和 ADC 通过音频接口传输采样数据。", "zh-Hant": traditional("数字麦克风和 ADC 通过音频接口传输采样数据。"), en: "Digital microphones and ADCs carry samples through audio interfaces.", ja: "デジタルマイクと ADC は音声インターフェースでサンプルを転送します。", ko: "디지털 마이크와 ADC는 오디오 인터페이스로 샘플을 전달합니다." }
    }
  ],
  "digital-interface": [
    {
      target: "sampling-quantization",
      reason: { zh: "I2S 等接口连接 Codec 与处理器。", "zh-Hant": traditional("I2S 等接口连接 Codec 与处理器。"), en: "Interfaces such as I2S connect Codecs to processors.", ja: "I2S などのインターフェースが Codec とプロセッサーを接続します。", ko: "I2S 등의 인터페이스는 Codec과 프로세서를 연결합니다." }
    },
    {
      target: "system-audio",
      reason: { zh: "系统音频需要配置设备、时钟和音频数据通路。", "zh-Hant": traditional("系统音频需要配置设备、时钟和音频数据通路。"), en: "System audio configures devices, clocks, and audio data paths.", ja: "システム音声は機器、クロック、データ経路を設定します。", ko: "시스템 오디오는 장치, 클록, 오디오 데이터 경로를 설정합니다." }
    }
  ],
  "amplifier-speaker": [
    {
      target: "sound-wave",
      reason: { zh: "扬声器把电信号还原为声压波。", "zh-Hant": traditional("扬声器把电信号还原为声压波。"), en: "A speaker turns an electrical signal back into a pressure wave.", ja: "スピーカーは電気信号を音圧波に戻します。", ko: "스피커는 전기 신호를 다시 음압 파형으로 바꿉니다." }
    },
    {
      target: "listening-metrics",
      reason: { zh: "扬声器性能需要结合响度和失真等听感指标。", "zh-Hant": traditional("扬声器性能需要结合响度和失真等听感指标。"), en: "Speaker performance is judged with loudness, distortion, and other perceptual metrics.", ja: "スピーカーの性能はラウドネス、ひずみなどの指標と合わせて評価します。", ko: "스피커 성능은 라우드니스, 왜곡 등의 지표와 함께 평가합니다." }
    }
  ],
  "system-audio": [
    {
      target: "alsa",
      reason: { zh: "Linux 系统音频常通过 ALSA 访问硬件设备。", "zh-Hant": traditional("Linux 系统音频常通过 ALSA 访问硬件设备。"), en: "Linux system audio commonly reaches hardware through ALSA.", ja: "Linux のシステム音声は通常 ALSA を介してハードウェアにアクセスします。", ko: "Linux 시스템 오디오는 보통 ALSA를 통해 하드웨어에 접근합니다." }
    },
    {
      target: "realtime-audio",
      reason: { zh: "系统音频要在缓冲、调度和延迟之间做取舍。", "zh-Hant": traditional("系统音频要在缓冲、调度和延迟之间做取舍。"), en: "System audio balances buffering, scheduling, and latency.", ja: "システム音声ではバッファリング、スケジューリング、遅延のバランスを取ります。", ko: "시스템 오디오는 버퍼링, 스케줄링, 지연 사이에서 균형을 잡습니다." }
    }
  ],
  alsa: [
    {
      target: "system-audio",
      reason: { zh: "ALSA 是 Linux 音频系统访问硬件的基础层。", "zh-Hant": traditional("ALSA 是 Linux 音频系统访问硬件的基础层。"), en: "ALSA is the foundational Linux layer for accessing audio hardware.", ja: "ALSA は Linux から音声ハードウェアへアクセスするための基盤です。", ko: "ALSA는 Linux에서 오디오 하드웨어에 접근하는 기본 계층입니다." }
    },
    {
      target: "realtime-audio",
      reason: { zh: "ALSA 缓冲和调度配置会影响实时音频延迟。", "zh-Hant": traditional("ALSA 缓冲和调度配置会影响实时音频延迟。"), en: "ALSA buffering and scheduling affect real-time audio latency.", ja: "ALSA のバッファーとスケジューリングはリアルタイム音声の遅延に影響します。", ko: "ALSA 버퍼링과 스케줄링은 실시간 오디오 지연에 영향을 줍니다." }
    }
  ],
  "audio-codec": [
    {
      target: "sampling-quantization",
      reason: { zh: "把 PCM 编解码与硬件采集、播放的职责区分开。", "zh-Hant": traditional("把 PCM 编解码与硬件采集、播放的职责区分开。"), en: "Separate PCM encoding/decoding from hardware capture and playback responsibilities.", ja: "PCM の符号化・復号と、ハードウェアの収録・再生の役割を区別します。", ko: "PCM 인코딩·디코딩과 하드웨어 캡처·재생의 역할을 구분합니다." }
    },
    {
      target: "bluetooth-audio",
      reason: { zh: "蓝牙音频依赖编码格式来控制码率和延迟。", "zh-Hant": traditional("蓝牙音频依赖编码格式来控制码率和延迟。"), en: "Bluetooth audio relies on codecs to control bitrate and latency.", ja: "Bluetooth 音声ではコーデックでビットレートと遅延を制御します。", ko: "Bluetooth 오디오는 코덱으로 비트레이트와 지연을 제어합니다." }
    }
  ],
  "realtime-audio": [
    {
      target: "system-audio",
      reason: { zh: "实时处理依赖系统音频的设备和缓冲管理。", "zh-Hant": traditional("实时处理依赖系统音频的设备和缓冲管理。"), en: "Real-time processing depends on system audio device and buffer management.", ja: "リアルタイム処理はシステム音声の機器・バッファー管理に依存します。", ko: "실시간 처리는 시스템 오디오의 장치 및 버퍼 관리에 의존합니다." }
    },
    {
      target: "meeting-communication",
      reason: { zh: "会议通话把实时采集、处理和播放串成完整链路。", "zh-Hant": traditional("会议通话把实时采集、处理和播放串成完整链路。"), en: "Meetings combine real-time capture, processing, and playback in one chain.", ja: "会議ではリアルタイムの収録・処理・再生を一つの経路にまとめます。", ko: "회의는 실시간 캡처, 처리, 재생을 하나의 경로로 연결합니다." }
    }
  ],
  "core-signal-processing": [
    {
      target: "sampling-quantization",
      reason: { zh: "采样与量化决定 DSP 处理的离散输入。", "zh-Hant": traditional("采样与量化决定 DSP 处理的离散输入。"), en: "Sampling and quantization define the discrete input to DSP.", ja: "標本化と量子化が DSP に渡す離散入力を決めます。", ko: "샘플링과 양자화가 DSP의 이산 입력을 결정합니다." }
    },
    {
      target: "speech-enhancement",
      reason: { zh: "滤波、频谱和变换是语音增强的传统基础。", "zh-Hant": traditional("滤波、频谱和变换是语音增强的传统基础。"), en: "Filtering, spectra, and transforms are traditional foundations of enhancement.", ja: "フィルター、スペクトル、変換は音声強調の従来型の基礎技術です。", ko: "필터링, 스펙트럼, 변환은 음성 향상의 전통적인 기초입니다." }
    }
  ],
  "speech-enhancement": [
    {
      target: "core-signal-processing",
      reason: { zh: "语音增强常结合滤波、STFT 和频谱处理。", "zh-Hant": traditional("语音增强常结合滤波、STFT 和频谱处理。"), en: "Speech enhancement commonly uses filtering, STFT, and spectral processing.", ja: "音声強調ではフィルター、STFT、スペクトル処理を組み合わせます。", ko: "음성 향상은 필터링, STFT, 스펙트럼 처리를 함께 사용합니다." }
    },
    {
      target: "meeting-communication",
      reason: { zh: "会议通话需要抑制噪声、回声和混响。", "zh-Hant": traditional("会议通话需要抑制噪声、回声和混响。"), en: "Meeting communication needs noise, echo, and reverberation suppression.", ja: "会議通話ではノイズ、エコー、残響の抑制が必要です。", ko: "회의 통화에는 잡음, 에코, 잔향 억제가 필요합니다." }
    }
  ],
  "spatial-audio": [
    {
      target: "sound-wave",
      reason: { zh: "空间听感来自声波的相位、时间和强度差异。", "zh-Hant": traditional("空间听感来自声波的相位、时间和强度差异。"), en: "Spatial perception comes from wave phase, timing, and level differences.", ja: "空間知覚には波の位相、時間、レベルの違いが関わります。", ko: "공간 지각에는 파형의 위상, 시간, 레벨 차이가 관여합니다." }
    },
    {
      target: "listening-metrics",
      reason: { zh: "先比较左右声道电平与声像，再理解空间定位。", "zh-Hant": traditional("先比较左右声道电平与声像，再理解空间定位。"), en: "Compare left/right levels and stereo panning before exploring spatial localization.", ja: "左右のレベルとパンニングを比較してから空間定位を考えましょう。", ko: "좌우 레벨과 스테레오 패닝을 비교한 뒤 공간 위치감을 살펴보세요." }
    }
  ],
  "meeting-communication": [
    {
      target: "realtime-audio",
      reason: { zh: "通话体验受端到端延迟和抖动预算约束。", "zh-Hant": traditional("通话体验受端到端延迟和抖动预算约束。"), en: "Call quality is constrained by end-to-end latency and jitter budgets.", ja: "通話品質はエンドツーエンド遅延とジッターの許容範囲に制約されます。", ko: "통화 품질은 종단 간 지연과 지터 허용 범위에 제약을 받습니다." }
    },
    {
      target: "speech-enhancement",
      reason: { zh: "降噪、回声消除和自动增益是会议音频核心处理。", "zh-Hant": traditional("降噪、回声消除和自动增益是会议音频核心处理。"), en: "Noise reduction, echo cancellation, and gain control are core meeting processing.", ja: "ノイズ除去、エコーキャンセル、自動ゲイン制御は会議音声の主要な処理です。", ko: "잡음 제거, 에코 제거, 자동 게인 제어는 회의 오디오의 핵심 처리입니다." }
    }
  ],
  "automotive-audio": [
    {
      target: "spatial-audio",
      reason: { zh: "车内多扬声器布局需要空间定位和声场控制。", "zh-Hant": traditional("车内多扬声器布局需要空间定位和声场控制。"), en: "In-car speaker layouts need spatial positioning and sound-field control.", ja: "車内のスピーカー配置には空間定位と音場制御が必要です。", ko: "차량 내 스피커 배치에는 공간 위치와 음장 제어가 필요합니다." }
    },
    {
      target: "realtime-audio",
      reason: { zh: "车载交互要求稳定的低延迟音频链路。", "zh-Hant": traditional("车载交互要求稳定的低延迟音频链路。"), en: "Automotive interaction requires a stable low-latency audio path.", ja: "車載インタラクションには安定した低遅延の音声経路が必要です。", ko: "차량 내 상호작용에는 안정적인 저지연 오디오 경로가 필요합니다." }
    }
  ],
  "robot-audio": [
    {
      target: "microphone",
      reason: { zh: "机器人通过麦克风获取环境和用户声音。", "zh-Hant": traditional("机器人通过麦克风获取环境和用户声音。"), en: "Robots use microphones to capture the environment and user speech.", ja: "ロボットはマイクで環境音と利用者の声を収録します。", ko: "로봇은 마이크로 환경 소리와 사용자 음성을 수집합니다." }
    },
    {
      target: "ai-event",
      reason: { zh: "事件识别帮助机器人理解非语音声音。", "zh-Hant": traditional("事件识别帮助机器人理解非语音声音。"), en: "Event recognition helps robots understand non-speech sounds.", ja: "イベント認識はロボットによる非音声の理解を助けます。", ko: "이벤트 인식은 로봇이 말소리 이외의 소리를 이해하도록 돕습니다." }
    }
  ],
  "iot-content": [
    {
      target: "bluetooth-audio",
      reason: { zh: "物联网设备常通过无线音频链路传输内容。", "zh-Hant": traditional("物联网设备常通过无线音频链路传输内容。"), en: "IoT devices often deliver content over wireless audio links.", ja: "IoT 機器では無線音声リンクでコンテンツを伝送することがあります。", ko: "IoT 장치는 무선 오디오 링크로 콘텐츠를 전달하기도 합니다." }
    },
    {
      target: "ai-event",
      reason: { zh: "声音事件可以触发设备状态和自动化动作。", "zh-Hant": traditional("声音事件可以触发设备状态和自动化动作。"), en: "Sound events can trigger device states and automation actions.", ja: "音イベントを機器の状態変更や自動化のきっかけにできます。", ko: "소리 이벤트는 장치 상태 변경이나 자동화 동작을 유발할 수 있습니다." }
    }
  ],
  "bluetooth-audio": [
    {
      target: "audio-codec",
      reason: { zh: "蓝牙传输需要编码来降低无线带宽占用。", "zh-Hant": traditional("蓝牙传输需要编码来降低无线带宽占用。"), en: "Bluetooth transmission uses codecs to reduce wireless bandwidth.", ja: "Bluetooth 伝送ではコーデックで無線帯域の使用量を減らします。", ko: "Bluetooth 전송은 코덱으로 무선 대역폭 사용량을 줄입니다." }
    },
    {
      target: "realtime-audio",
      reason: { zh: "缓冲和重传策略直接影响蓝牙音频延迟。", "zh-Hant": traditional("缓冲和重传策略直接影响蓝牙音频延迟。"), en: "Buffering and retransmission directly affect Bluetooth audio latency.", ja: "バッファリングと再送は Bluetooth 音声の遅延に直接影響します。", ko: "버퍼링과 재전송은 Bluetooth 오디오 지연에 직접 영향을 줍니다." }
    }
  ],
  "ai-overview": [
    {
      target: "ai-asr",
      reason: { zh: "ASR 展示 AI 如何从声音提取语言内容。", "zh-Hant": traditional("ASR 展示 AI 如何从声音提取语言内容。"), en: "ASR shows how AI extracts language content from sound.", ja: "ASR は AI が音から言語内容を抽出する仕組みを示します。", ko: "ASR은 AI가 소리에서 언어 내용을 추출하는 방식을 보여 줍니다." }
    },
    {
      target: "ai-enhancement",
      reason: { zh: "增强展示 AI 如何改善输入音频质量。", "zh-Hant": traditional("增强展示 AI 如何改善输入音频质量。"), en: "Enhancement shows how AI improves incoming audio quality.", ja: "音声強調は AI が入力音声の品質を改善する仕組みを示します。", ko: "음성 향상은 AI가 입력 오디오 품질을 개선하는 방식을 보여 줍니다." }
    }
  ],
  "ai-asr": [
    {
      target: "core-signal-processing",
      reason: { zh: "理解常见 ASR 前端的分帧、频谱与特征提取。", "zh-Hant": traditional("理解常见 ASR 前端的分帧、频谱与特征提取。"), en: "Understand framing, spectra, and feature extraction in common ASR front ends.", ja: "一般的な ASR フロントエンドのフレーム分割、スペクトル、特徴抽出を理解します。", ko: "일반적인 ASR 프런트엔드의 프레임 분할, 스펙트럼, 특징 추출을 이해합니다." }
    },
    {
      target: "sampling-quantization",
      reason: { zh: "采样率和量化精度决定 ASR 的数字输入。", "zh-Hant": traditional("采样率和量化精度决定 ASR 的数字输入。"), en: "Sample rate and quantization precision define ASR's digital input.", ja: "標本化周波数と量子化精度が ASR のデジタル入力を決めます。", ko: "샘플링 주파수와 양자화 정밀도는 ASR의 디지털 입력을 결정합니다." }
    }
  ],
  "ai-tts": [
    {
      target: "ai-generation",
      reason: { zh: "TTS 是以文本为条件生成语音的典型任务。", "zh-Hant": traditional("TTS 是以文本为条件生成语音的典型任务。"), en: "TTS is a canonical task for generating speech from text.", ja: "TTS はテキストを条件として音声を生成する代表的なタスクです。", ko: "TTS는 텍스트를 조건으로 음성을 생성하는 대표적인 작업입니다." }
    },
    {
      target: "realtime-audio",
      reason: { zh: "交互式 TTS 需要控制合成和播放延迟。", "zh-Hant": traditional("交互式 TTS 需要控制合成和播放延迟。"), en: "Interactive TTS must control synthesis and playback latency.", ja: "対話型 TTS では合成と再生の遅延を抑える必要があります。", ko: "대화형 TTS는 합성과 재생 지연을 제어해야 합니다." }
    }
  ],
  "ai-generation": [
    {
      target: "ai-tts",
      reason: { zh: "TTS 是 AI 音频生成中最常见的语音应用。", "zh-Hant": traditional("TTS 是 AI 音频生成中最常见的语音应用。"), en: "TTS is one of the most common speech applications of audio generation.", ja: "TTS は AI 音声生成の代表的な応用の一つです。", ko: "TTS는 AI 오디오 생성의 대표적인 음성 응용 중 하나입니다." }
    },
    {
      target: "ai-codec",
      reason: { zh: "神经 Codec 可提供生成模型使用的音频 token。", "zh-Hant": traditional("神经 Codec 可提供生成模型使用的音频 token。"), en: "Neural codecs can provide audio tokens for generative models.", ja: "ニューラルコーデックは生成モデル向けの音声トークンを提供できます。", ko: "신경망 코덱은 생성 모델에 오디오 토큰을 제공할 수 있습니다." }
    }
  ],
  "ai-event": [
    {
      target: "core-signal-processing",
      reason: { zh: "事件识别通常从频谱或时频特征开始。", "zh-Hant": traditional("事件识别通常从频谱或时频特征开始。"), en: "Event recognition commonly starts from spectral or time-frequency features.", ja: "イベント認識は通常、スペクトルや時間周波数特徴から始まります。", ko: "이벤트 인식은 보통 스펙트럼 또는 시간·주파수 특징에서 시작합니다." }
    },
    {
      target: "microphone",
      reason: { zh: "事件模型的输入来自真实环境中的麦克风采集。", "zh-Hant": traditional("事件模型的输入来自真实环境中的麦克风采集。"), en: "Event models receive input captured by microphones in real environments.", ja: "イベントモデルには実環境のマイクで収録した入力を渡します。", ko: "이벤트 모델은 실제 환경의 마이크에서 수집한 입력을 받습니다." }
    }
  ],
  "ai-enhancement": [
    {
      target: "speech-enhancement",
      reason: { zh: "AI 增强与传统语音增强共享降噪和分离目标。", "zh-Hant": traditional("AI 增强与传统语音增强共享降噪和分离目标。"), en: "AI enhancement shares denoising and separation goals with speech enhancement.", ja: "AI 音声強調と従来型音声強調はノイズ除去・分離の目標を共有します。", ko: "AI 음성 향상과 기존 음성 향상은 잡음 제거 및 분리 목표를 공유합니다." }
    },
    {
      target: "core-signal-processing",
      reason: { zh: "理解频域增强模型中常见的时频分析和信号重建。", "zh-Hant": traditional("理解频域增强模型中常见的时频分析和信号重建。"), en: "Understand time-frequency analysis and reconstruction used in spectral enhancement models.", ja: "スペクトル領域の強調モデルで使う時間周波数解析と再構成を理解します。", ko: "주파수 영역 향상 모델에 쓰이는 시간·주파수 분석과 신호 복원을 이해합니다." }
    }
  ],
  "ai-codec": [
    {
      target: "audio-codec",
      reason: { zh: "AI Codec 与 MP3、AAC、Opus 共享压缩与重建目标。", "zh-Hant": traditional("AI Codec 与 MP3、AAC、Opus 共享压缩与重建目标。"), en: "AI codecs share compression and reconstruction goals with MP3, AAC, and Opus.", ja: "AI コーデックは MP3、AAC、Opus と圧縮・再構成の目標を共有します。", ko: "AI 코덱은 MP3, AAC, Opus와 압축 및 복원 목표를 공유합니다." }
    },
    {
      target: "realtime-audio",
      reason: { zh: "神经编码部署必须满足码率、算力和延迟约束。", "zh-Hant": traditional("神经编码部署必须满足码率、算力和延迟约束。"), en: "Neural codec deployment must meet bitrate, compute, and latency constraints.", ja: "ニューラルコーデックの実装ではビットレート、計算量、遅延の制約を満たす必要があります。", ko: "신경망 코덱 배포는 비트레이트, 연산량, 지연 제약을 충족해야 합니다." }
    }
  ]
};
