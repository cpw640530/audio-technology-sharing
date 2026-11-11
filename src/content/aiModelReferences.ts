import type { AiAudioLabId, Language } from "./knowledge";
import { traditional } from "./traditional";

type Text = Record<Language, string>;
const l = (zh: string, en: string, ja: string, ko: string): Text => ({ zh, en, ja, ko, "zh-Hant": traditional(zh) });
type ModelReference = {
  name: string;
  release: string;
  purpose: Text;
  stages: { name: Text; detail: Text }[];
  boundary: Text;
  comparison: Text;
  sources: { name: string; url: string }[];
};

export const aiModelReviewDate = "2026-11-11";

// Dates describe the named release/paper, not a claim of being the newest model.
export const aiModelReferences: Record<AiAudioLabId, ModelReference> = {
  overview: {
    name: "Qwen3-Omni",
    release: "2025-09-22",
    purpose: l("原生音频大模型路线：既理解音频，也能生成语音。它与 ASR + 文本大模型 + TTS 的级联系统并存。", "Native audio models understand audio and generate speech, alongside cascaded ASR + text LLM + TTS systems.", "音声を理解して生成するネイティブ音声モデルです。ASR + テキスト LLM + TTS のカスケード方式も併存します。", "오디오를 이해하고 음성을 생성하는 네이티브 오디오 모델입니다. ASR + 텍스트 LLM + TTS 연쇄 방식도 함께 사용됩니다."),
    stages: [
      { name: l("音频输入", "Audio input", "音声入力", "오디오 입력"), detail: l("PCM 经音频编码器成为连续特征，不是先强制转成文字。", "An audio encoder maps PCM to continuous features without mandatory transcription first.", "PCM を音声エンコーダで連続特徴に変換し、先に文字へ変換する必要はありません。", "오디오 인코더가 PCM을 연속 특징으로 바꾸며 먼저 문자로 전사할 필요는 없습니다.") },
      { name: l("Thinker 理解", "Thinker understanding", "Thinker の理解", "Thinker 이해"), detail: l("结合音频特征与文本上下文生成回答；音频还包含语气、环境声等信息。", "Audio features and text context inform the response; audio also carries tone and environmental sounds.", "音声特徴と文脈から応答を作ります。音声には口調や環境音も含まれます。", "오디오 특징과 텍스트 문맥으로 응답을 만들며 오디오에는 말투와 환경음도 포함됩니다.") },
      { name: l("Talker 生成", "Talker generation", "Talker の生成", "Talker 생성"), detail: l("语音分支结合 Thinker 表示生成多码本语音 token；文本输出不必经过此分支。", "The speech branch uses Thinker representations to produce multi-codebook speech tokens; text output can bypass it.", "音声分岐は Thinker 表現から複数コードブックの音声 token を生成します。文字出力には不要です。", "음성 분기는 Thinker 표현으로 다중 코드북 음성 token을 생성하며 텍스트 출력은 이를 거치지 않아도 됩니다.") },
      { name: l("流式输出", "Streaming output", "ストリーミング出力", "스트리밍 출력"), detail: l("语音 token 解码成波形块。流式生成不自动等于支持任意打断或全双工。", "Decode speech tokens into waveform chunks. Streaming alone does not guarantee interruption handling or full duplex.", "音声 token を波形チャンクへ復号します。ストリーミングだけで割り込みや全二重が保証されるわけではありません。", "음성 token을 파형 청크로 복호화합니다. 스트리밍만으로 끼어들기나 전이중이 보장되지는 않습니다.") }
    ],
    boundary: l("代码与权重公开；部署仍需评估显存、首包延迟、并发与幻觉。专用端侧小模型仍有价值。", "Code and weights are public; evaluate memory, first-output latency, concurrency and hallucinations. Small task-specific edge models remain useful.", "コードと重みを公開。メモリ、初回出力遅延、同時処理、幻覚を評価します。端末向け小型モデルにも用途があります。", "코드와 가중치가 공개되어 있습니다. 메모리·첫 출력 지연·동시 처리·환각을 평가해야 하며 소형 전용 모델도 유용합니다."),
    comparison: l("基础路径中的特征、训练与推理仍适用，但不能把所有任务画成“频谱图 → 图像分类”。", "Features, training and inference still apply, but not every task is spectrogram image classification.", "特徴・学習・推論の基礎は共通ですが、すべてがスペクトログラム画像分類ではありません。", "특징·학습·추론의 기초는 유효하지만 모든 작업이 스펙트로그램 이미지 분류는 아닙니다."),
    sources: [{ name: "Qwen3-Omni · code / weights", url: "https://github.com/QwenLM/Qwen3-Omni" }]
  },
  asr: {
    name: "Qwen3-ASR · 0.6B / 1.7B",
    release: "2026-01-29",
    purpose: l("把声音表征接入语言模型，预测转写 token；离线与流式使用统一模型。", "Connect acoustic representations to a language model to predict transcription tokens, with unified offline and streaming models.", "音響表現を言語モデルへ接続し、文字 token を予測します。オフラインとストリーミングでモデルを共用します。", "음향 표현을 언어 모델에 연결해 전사 token을 예측하며 오프라인과 스트리밍이 모델을 공유합니다."),
    stages: [
      { name: l("PCM → Fbank", "PCM → Fbank", "PCM → Fbank", "PCM → Fbank"), detail: l("前端提取 128 维滤波器组特征；维度是频带特征数，不是字数。", "The front end extracts 128-dimensional filter-bank features, not 128 characters.", "フロントエンドが 128 次元のフィルタバンク特徴を抽出します。文字数ではありません。", "프런트엔드가 128차원 필터뱅크 특징을 추출합니다. 문자 수가 아닙니다.") },
      { name: l("AuT 编码器", "AuT encoder", "AuT エンコーダ", "AuT 인코더"), detail: l("时间轴下采样 8 倍，形成约 12.5 Hz 的音频表示；它不是 PCM 采样率。", "Eightfold temporal downsampling yields audio representations at about 12.5 Hz, not the PCM sample rate.", "時間軸を 8 倍ダウンサンプリングし約 12.5 Hz の音声表現を得ます。PCM の標本化周波数ではありません。", "시간축을 8배 다운샘플링해 약 12.5 Hz의 오디오 표현을 얻으며 PCM 샘플률은 아닙니다.") },
      { name: l("语言模型解码", "Language-model decoding", "言語モデルで復号", "언어 모델 디코딩"), detail: l("结合音频表示、上下文和已输出文本逐步预测下一个 token，不是逐帧 CTC 合并。", "Use audio, context and prior text to predict the next token; this is not framewise CTC collapsing.", "音声・文脈・既出文字から次の token を予測します。フレームごとの CTC 統合ではありません。", "오디오·문맥·이전 텍스트로 다음 token을 예측하며 프레임별 CTC 병합과 다릅니다.") },
      { name: l("文本与可选对齐", "Text and optional alignment", "文字と任意のアラインメント", "텍스트와 선택적 정렬"), detail: l("转写后可把音频和已知文本交给 ForcedAligner 预测时间戳；对齐不是再次识别。", "Optionally pass audio and known text to ForcedAligner for timestamps; alignment is not another recognition pass.", "音声と既知の文字を ForcedAligner に渡して時刻を推定できます。認識とは別の処理です。", "오디오와 알려진 텍스트를 ForcedAligner에 전달해 시간을 예측할 수 있으며 정렬은 재인식이 아닙니다.") }
    ],
    boundary: l("代码与权重公开。用 WER/CER 与流式首字、尾字延迟评估；语言模型可能补写未说出的内容，吞吐量不能当作单路延迟。", "Code and weights are public. Measure WER/CER and streaming first/final-token latency; hallucinated words remain possible. Throughput is not single-stream latency.", "コードと重みを公開。WER/CER とストリーミングの先頭・末尾遅延を評価します。幻覚に注意し、スループットと遅延を区別します。", "코드와 가중치가 공개되어 있습니다. WER/CER와 첫·마지막 token 지연을 평가하며 환각 및 처리량과 지연의 차이에 주의합니다."),
    comparison: l("CTC、RNN-T 与 Whisper 保留为机制对照，不表示过时失效。前沿阅读：2026-10 的 Qwen-Audio-3.1-ASR 报告；这里不宣称其权重公开。", "Keep CTC, RNN-T and Whisper as mechanism comparisons, not obsolete methods. Frontier reading: the October 2026 Qwen-Audio-3.1-ASR report; no claim of public weights here.", "CTC・RNN-T・Whisper は仕組みの比較として残します。2026 年 10 月の Qwen-Audio-3.1-ASR 報告は先端資料で、重み公開とは断定しません。", "CTC·RNN-T·Whisper는 원리 비교로 유지합니다. 2026년 10월 Qwen-Audio-3.1-ASR 보고서는 최신 동향 자료이며 가중치 공개를 주장하지 않습니다."),
    sources: [{ name: "Qwen3-ASR · code / weights", url: "https://github.com/QwenLM/Qwen3-ASR" }, { name: "Qwen3-ASR · report", url: "https://arxiv.org/abs/2601.21337" }, { name: "Qwen-Audio-3.1-ASR · report", url: "https://arxiv.org/abs/2610.28711" }]
  },
  tts: {
    name: "Qwen3-TTS · 12Hz",
    release: "2026-01-22",
    purpose: l("文本与声音条件驱动语音 token 生成；不要套用 FastSpeech 2 的显式音素时长流程。", "Text and voice conditioning drive speech-token generation, without imposing FastSpeech 2's explicit phoneme-duration pipeline.", "テキストと声の条件から音声 token を生成します。FastSpeech 2 の明示的な音素長の処理を当てはめません。", "텍스트와 음성 조건으로 음성 token을 생성하며 FastSpeech 2의 명시적 음소 길이 과정을 적용하지 않습니다."),
    stages: [
      { name: l("文本与声音条件", "Text and voice conditioning", "テキストと声の条件", "텍스트와 음성 조건"), detail: l("按 checkpoint 选择参考音频、预设说话人或声音描述；这些能力不一定在同一个模型里。", "Choose reference audio, a preset speaker or a voice description according to the checkpoint; capabilities differ.", "チェックポイントに応じ参照音声・既定話者・声の説明を選びます。能力はモデルごとに異なります。", "체크포인트에 따라 참조 음성·기본 화자·음성 설명을 선택하며 지원 기능은 다릅니다.") },
      { name: l("自回归语音生成", "Autoregressive speech generation", "自己回帰音声生成", "자기회귀 음성 생성"), detail: l("模型根据条件与历史语音 token 生成新的声学帧；token 不是可直接播放的 PCM。", "Conditioning and previous speech tokens predict new acoustic frames; tokens are not playable PCM.", "条件と既出音声 token から新しい音響フレームを予測します。token は PCM ではありません。", "조건과 이전 음성 token으로 새 음향 프레임을 예측하며 token은 재생 가능한 PCM이 아닙니다.") },
      { name: l("多码本表示", "Multi-codebook representation", "複数コードブック表現", "다중 코드북 표현"), detail: l("12Hz 是表示的帧率；每帧含多个码本索引，不等于每秒只有 12 个数字或 12 Hz 音频。", "12Hz is the representation frame rate. Multiple codebook indices per frame do not mean 12 numbers per second or 12 Hz audio.", "12Hz は表現のフレーム率です。各フレームの複数索引は毎秒 12 個の値や 12 Hz 音声を意味しません。", "12Hz는 표현의 프레임률입니다. 프레임당 여러 코드북 인덱스가 있으므로 초당 12개 숫자나 12 Hz 오디오가 아닙니다.") },
      { name: l("匹配解码器 → PCM", "Matching decoder → PCM", "対応デコーダ → PCM", "대응 디코더 → PCM"), detail: l("使用 12Hz tokenizer 的匹配波形解码器；此路线不是 CosyVoice 的 Mel + HiFT，也不是通用扩散声码器。", "Use the 12Hz tokenizer's matching waveform decoder, not CosyVoice's Mel + HiFT or a generic diffusion vocoder.", "12Hz tokenizer 対応の波形デコーダを使います。CosyVoice の Mel + HiFT や汎用拡散ボコーダではありません。", "12Hz tokenizer의 대응 파형 디코더를 사용하며 CosyVoice의 Mel + HiFT나 일반 확산 보코더와 다릅니다.") }
    ],
    boundary: l("代码与权重公开；声音克隆须获授权。评估错读、漏读、说话人相似度和首包延迟，不能只比较自然度。", "Code and weights are public; voice cloning needs consent. Evaluate mispronunciations, omissions, speaker similarity and first-chunk latency, not naturalness alone.", "コードと重みを公開。声の複製には許可が必要です。自然さだけでなく誤読・欠落・話者類似度・初回遅延も評価します。", "코드와 가중치가 공개되어 있으며 음성 복제에는 동의가 필요합니다. 자연스러움 외에 오독·누락·화자 유사도·첫 청크 지연도 평가합니다."),
    comparison: l("另一条近期可复现路线是 CosyVoice 3（2025-12）：语音 token → flow matching → Mel → HiFT。实验室对照这条路线与 FastSpeech 2、F5-TTS。", "Another recent reproducible route is CosyVoice 3 (2025-12): speech tokens → flow matching → Mel → HiFT. The lab compares it with FastSpeech 2 and F5-TTS.", "CosyVoice 3（2025-12）は音声 token → flow matching → Mel → HiFT の別経路です。ラボで FastSpeech 2・F5-TTS と比較します。", "CosyVoice 3(2025-12)는 음성 token → flow matching → Mel → HiFT의 다른 경로입니다. 실험실에서 FastSpeech 2·F5-TTS와 비교합니다."),
    sources: [{ name: "Qwen3-TTS · code / weights", url: "https://github.com/QwenLM/Qwen3-TTS" }, { name: "CosyVoice 3 · code / weights", url: "https://github.com/QwenAudio/CosyVoice" }]
  },
  generation: {
    name: "ACE-Step 1.5 / Stable Audio 3 Medium",
    release: "2026",
    purpose: l("保留已有的近期生成路线；以下以 ACE-Step 1.5 为例，不能与 Stable Audio 的 latent 规格互换。", "Keep the recent generation routes. The path below uses ACE-Step 1.5; its latent format is not interchangeable with Stable Audio.", "既存の新しい生成経路を維持します。以下は ACE-Step 1.5 で、Stable Audio の latent 形式とは互換ではありません。", "최근 생성 경로를 유지합니다. 아래는 ACE-Step 1.5이며 Stable Audio의 latent 형식과 호환되지 않습니다."),
    stages: [
      { name: l("条件与可选规划", "Conditioning and optional planning", "条件と任意の計画", "조건과 선택적 계획"), detail: l("文本、歌词等提供条件；可选 LM 规划语义码，不是 PCM 波形。", "Text and lyrics provide conditions; an optional LM plans semantic codes, not PCM.", "テキストや歌詞を条件とし、任意の LM が PCM ではなく意味コードを計画します。", "텍스트와 가사를 조건으로 사용하며 선택적 LM은 PCM이 아닌 의미 코드를 계획합니다.") },
      { name: l("连续 latent", "Continuous latents", "連続 latent", "연속 latent"), detail: l("声学 latent 承载整段声音的压缩表示，不是着色频谱或逐字 token。", "Acoustic latents represent compressed audio, not colored spectra or character tokens.", "音響 latent は圧縮した音の表現で、色付きスペクトルや文字 token ではありません。", "음향 latent는 압축 오디오 표현이며 색상 스펙트럼이나 문자 token이 아닙니다.") },
      { name: l("DiT / flow matching", "DiT / flow matching", "DiT / flow matching", "DiT / flow matching"), detail: l("迭代更新整段 latent；迭代步数不是已经生成的音频秒数。", "Iterations update the latent window; iteration count is not generated audio duration.", "反復で latent 全体を更新します。反復回数は生成済みの秒数ではありません。", "반복으로 latent 구간을 갱신하며 반복 횟수는 생성된 오디오 시간이 아닙니다.") },
      { name: l("波形解码", "Waveform decoding", "波形デコード", "파형 디코딩"), detail: l("ACE 的匹配 VAE 输出 48 kHz 立体声。Stable Audio 3 Medium 使用自己的 SAME-L 与 44.1 kHz 路线。", "ACE's matching VAE outputs 48 kHz stereo. Stable Audio 3 Medium uses its own SAME-L and 44.1 kHz route.", "ACE の対応 VAE は 48 kHz ステレオを出力します。Stable Audio 3 Medium は独自の SAME-L と 44.1 kHz 経路です。", "ACE의 대응 VAE는 48 kHz 스테레오를 출력하며 Stable Audio 3 Medium은 자체 SAME-L과 44.1 kHz 경로를 사용합니다.") }
    ],
    boundary: l("两条路线均有公开代码与权重入口；权重许可与代码许可需分开核对。图中状态为结构示意，不是模型实际生成。", "Both routes provide code and weight access; check weight and code licenses separately. Diagram states are conceptual, not actual generation.", "両経路にコードと重みの公開先があります。各ライセンスは別途確認します。図は構造の説明で実生成ではありません。", "두 경로 모두 코드와 가중치 접근 경로가 있으며 라이선스는 별도로 확인해야 합니다. 도식은 구조 설명이지 실제 생성이 아닙니다."),
    comparison: l("MusicLM、AudioGen 与 AudioLDM 2 属于发展脉络与对照，不再作为最新主线。", "MusicLM, AudioGen and AudioLDM 2 are historical comparisons, not the current main route.", "MusicLM・AudioGen・AudioLDM 2 は発展の比較資料で、最新の主経路ではありません。", "MusicLM·AudioGen·AudioLDM 2는 발전 과정의 비교 자료이며 최신 주 경로가 아닙니다."),
    sources: [{ name: "ACE-Step 1.5 · code / weights", url: "https://github.com/ace-step/ACE-Step-1.5" }, { name: "Stable Audio 3 · code / weights", url: "https://github.com/Stability-AI/stable-audio-3" }]
  },
  event: {
    name: "PretrainedSED · ATST-F",
    release: "ICASSP 2025",
    purpose: l("从预训练声音表征走向带起止时间的多标签检测；主讲帧级 SED，而不是把整段分类结果当事件边界。", "Adapt pretrained sound representations to multi-label temporal detection, rather than treating clip tags as event boundaries.", "事前学習表現を多ラベルの時間検出へ適応します。クリップ分類をイベント境界とはみなしません。", "사전 학습 표현을 다중 레이블 시간 검출에 적용하며 클립 분류를 이벤트 경계로 간주하지 않습니다."),
    stages: [
      { name: l("音频与特征", "Audio and features", "音声と特徴", "오디오와 특징"), detail: l("按选定 checkpoint 的采样率和前端生成 log-Mel，保留时间轴。", "Follow the checkpoint's sample rate and log-Mel front end while retaining the time axis.", "選んだ checkpoint の標本化周波数と log-Mel 前処理に従い時間軸を保ちます。", "체크포인트의 샘플률과 log-Mel 전처리를 따르며 시간축을 유지합니다.") },
      { name: l("帧级预训练编码器", "Pretrained frame encoder", "事前学習フレームエンコーダ", "사전 학습 프레임 인코더"), detail: l("ATST-F 提供随时间变化的表征；预训练本身不会自动输出目标事件边界。", "ATST-F supplies time-varying representations; pretraining alone does not yield target event boundaries.", "ATST-F は時間変化する表現を作ります。事前学習だけで対象イベント境界が得られるわけではありません。", "ATST-F가 시간에 따라 변하는 표현을 제공하며 사전 학습만으로 목표 이벤트 경계를 얻지는 못합니다.") },
      { name: l("微调 SED 检测头", "Fine-tuned SED head", "微調整した SED ヘッド", "미세 조정 SED 헤드"), detail: l("在检测任务上适配后得到每帧、每类分数；多种声音可在同一时刻出现。", "Task adaptation yields per-frame, per-class scores, allowing overlapping sounds.", "検出タスクへ適応しフレーム・クラスごとのスコアを得ます。音の重なりも表せます。", "검출 작업에 적응해 프레임·클래스별 점수를 얻으며 중첩 소리도 나타낼 수 있습니다.") },
      { name: l("事件区间", "Event intervals", "イベント区間", "이벤트 구간"), detail: l("用阈值、平滑和持续时间规则形成区间；时间精度同时受模型、标注和后处理影响。", "Thresholds, smoothing and duration rules form intervals; timing depends on the model, labels and post-processing.", "閾値・平滑化・継続時間で区間を作ります。時間精度はモデル・ラベル・後処理に依存します。", "임계값·평활화·지속 시간 규칙으로 구간을 만들며 시간 정확도는 모델·레이블·후처리에 달려 있습니다.") }
    ],
    boundary: l("代码与适配检查点公开。评估事件 F1/PSDS 和真实设备误报；标签覆盖范围外的声音不能保证识别。实验室分数是预设数据。", "Code and adapted checkpoints are public. Evaluate event F1/PSDS and device false alarms; out-of-label sounds are not guaranteed. Lab scores are presets.", "コードと適応済み重みを公開。イベント F1/PSDS と端末誤報を評価します。対象外の音は保証されず、ラボは設定済みスコアです。", "코드와 적응된 체크포인트가 공개되어 있습니다. 이벤트 F1/PSDS와 기기 오탐을 평가해야 하며 실험실 점수는 사전 설정값입니다."),
    comparison: l("YAMNet 保留为经典窗口标签示例。BEATs/CLAP 是表征或对齐方法，不能单凭名称认定已有精确起止检测。", "YAMNet remains a classic window-tagging example. BEATs/CLAP representations or alignment alone do not guarantee precise event timing.", "YAMNet は従来の窓単位タグの例です。BEATs/CLAP の表現・整列だけでは正確な境界は保証されません。", "YAMNet은 고전적인 창 단위 태깅 예시입니다. BEATs/CLAP 표현·정렬만으로 정확한 경계가 보장되지는 않습니다."),
    sources: [{ name: "PretrainedSED · code / checkpoints", url: "https://github.com/fschmid56/PretrainedSED" }]
  },
  enhancement: {
    name: "DPDFNet",
    release: "2025-12 · paper v3 2026-06-16",
    purpose: l("在 DeepFilterNet2 框架中加入 Dual-Path RNN，面向因果单通道语音增强，不是音乐分轨。", "Dual-Path RNN blocks extend DeepFilterNet2 for causal single-channel speech enhancement, not music stem separation.", "DeepFilterNet2 に Dual-Path RNN を加えた因果的単一チャネル音声強調です。音楽の分離とは異なります。", "DeepFilterNet2에 Dual-Path RNN을 추가한 인과적 단일 채널 음성 향상이며 음악 스템 분리와 다릅니다."),
    stages: [
      { name: l("PCM → STFT", "PCM → STFT", "PCM → STFT", "PCM → STFT"), detail: l("从带噪语音提取频带与复数频谱特征，保留逆变换所需信息。", "Extract band and complex-spectral features from noisy speech, retaining reconstruction information.", "雑音音声から帯域・複素スペクトル特徴を抽出し、復元情報を保持します。", "잡음 음성에서 대역·복소 스펙트럼 특징을 추출하고 복원 정보를 유지합니다.") },
      { name: l("Dual-Path 编码", "Dual-Path encoding", "Dual-Path 符号化", "Dual-Path 인코딩"), detail: l("联合建模跨频带关系与时间上下文；因果设计不读取未来语音。", "Model cross-band relations and temporal context; the causal design does not read future speech.", "帯域間関係と時間文脈をモデル化します。因果設計は未来の音声を参照しません。", "대역 간 관계와 시간 문맥을 모델링하며 인과적 설계는 미래 음성을 읽지 않습니다.") },
      { name: l("增益与深度滤波", "Gains and deep filtering", "ゲインと深層フィルタ", "이득과 심층 필터링"), detail: l("沿用频带增益与复数多帧滤波框架；不是只有 0–1 实数掩码，也可改变相位。", "Retain band gains and complex multi-frame filtering, beyond a real 0–1 mask and with phase changes possible.", "帯域ゲインと複素多フレームフィルタを用い、実数マスクだけでなく位相も変更できます。", "대역 이득과 복소 다중 프레임 필터를 사용해 실수 마스크를 넘어 위상도 바꿀 수 있습니다.") },
      { name: l("重建与设备验证", "Reconstruct and validate", "復元と端末検証", "복원과 기기 검증"), detail: l("逆变换输出 PCM；在目标设备测处理耗时、缓冲延迟和语音损伤，因果不等于零延迟。", "Inverse transforms produce PCM. Measure runtime, buffering and speech damage on target hardware; causal does not mean zero latency.", "逆変換で PCM を得ます。端末で計算・バッファ遅延と音声損傷を測ります。因果性はゼロ遅延ではありません。", "역변환으로 PCM을 얻습니다. 대상 기기에서 계산·버퍼 지연과 음성 손상을 측정하며 인과성이 무지연을 뜻하지 않습니다.") }
    ],
    boundary: l("公开 PyTorch、ONNX/TFLite 与 8/16/48 kHz 模型入口，各规格不能混用。实际抑噪结果需试听和独立测试；网页教学掩码并未运行 DPDFNet。", "PyTorch, ONNX/TFLite and 8/16/48 kHz model variants are available; do not mix configurations. Validate with listening and independent tests; the teaching mask does not run DPDFNet.", "PyTorch・ONNX/TFLite と 8/16/48 kHz モデルを公開。設定は混用せず試聴と独立評価を行います。教材マスクは DPDFNet を実行しません。", "PyTorch·ONNX/TFLite와 8/16/48 kHz 모델이 공개되어 있습니다. 설정을 혼용하지 말고 청취·독립 평가를 하세요. 교육용 마스크는 DPDFNet 추론이 아닙니다."),
    comparison: l("RNNoise 用于经典轻量路线对照，DeepFilterNet 解释深度滤波基础；Demucs/Conv-TasNet 则放在源分离的任务边界下理解。", "RNNoise is a classic lightweight comparison; DeepFilterNet explains deep filtering. Treat Demucs/Conv-TasNet as source-separation references.", "RNNoise は従来の軽量方式、DeepFilterNet は深層フィルタの基礎です。Demucs/Conv-TasNet は音源分離の参考です。", "RNNoise는 고전적 경량 방식, DeepFilterNet은 심층 필터의 기초이며 Demucs/Conv-TasNet은 음원 분리 참고입니다."),
    sources: [{ name: "DPDFNet · code / weights", url: "https://github.com/ceva-ip/DPDFNet" }, { name: "DPDFNet · paper v3", url: "https://arxiv.org/abs/2512.16420v3" }]
  },
  codec: {
    name: "WavTokenizer / Mimi",
    release: "WavTokenizer · ICLR 2025 / Mimi · 2024",
    purpose: l("两种后续路线作对照：WavTokenizer 面向音频语言模型；Mimi 面向流式语音。它们不是新的通用传输标准。", "Compare two later routes: WavTokenizer for audio language models and Mimi for streaming speech. Neither is a new universal transport standard.", "音声言語モデル向け WavTokenizer とストリーミング音声向け Mimi を比較します。汎用伝送規格ではありません。", "오디오 언어 모델용 WavTokenizer와 스트리밍 음성용 Mimi를 비교하며 새로운 범용 전송 표준은 아닙니다."),
    stages: [
      { name: l("PCM → 编码器", "PCM → encoder", "PCM → エンコーダ", "PCM → 인코더"), detail: l("波形压缩成低帧率表示。Mimi 的输入是 24 kHz，表示为 12.5 帧/秒。", "Compress waveforms into low-rate representations. Mimi maps 24 kHz audio to 12.5 frames per second.", "波形を低フレーム率表現へ圧縮します。Mimi は 24 kHz を毎秒 12.5 フレームへ変換します。", "파형을 저프레임률 표현으로 압축합니다. Mimi는 24 kHz를 초당 12.5프레임으로 변환합니다.") },
      { name: l("量化为索引", "Quantize to indices", "索引へ量子化", "인덱스로 양자화"), detail: l("WavTokenizer 用单量化器达到 40/75 tokens/s；Mimi 使用多码本，第一码本蒸馏语义表征。", "WavTokenizer uses one quantizer at 40/75 tokens/s. Mimi uses multiple codebooks, distilling semantic representations into the first.", "WavTokenizer は単一量子化器で 40/75 tokens/s。Mimi は複数コードブックで最初に意味表現を蒸留します。", "WavTokenizer는 단일 양자화기로 40/75 tokens/s를 사용하며 Mimi는 다중 코드북의 첫 코드북에 의미 표현을 증류합니다.") },
      { name: l("建模或打包", "Model or packetize", "モデル化またはパケット化", "모델링 또는 패킷화"), detail: l("token 可供生成模型学习；用于传输还要约定码本数、打包、丢包与版本。token/s 不等于 bit/s。", "Tokens can train generative models. Transport additionally needs codebook count, packing, loss handling and versioning. Tokens/s is not bit/s.", "token は生成モデルの学習に使えます。伝送にはコードブック数・パケット化・欠落処理・版管理が別途必要です。tokens/s は bit/s ではありません。", "token은 생성 모델 학습에 사용할 수 있습니다. 전송에는 코드북 수·패킷화·손실 처리·버전 관리가 별도로 필요합니다. tokens/s와 bit/s는 다릅니다.") },
      { name: l("匹配解码器", "Matching decoder", "対応するデコーダ", "대응 디코더"), detail: l("同一模型及码本的解码器恢复有损 PCM。Mimi 的 80 ms 帧长不是整条通话链路的延迟。", "The matching model and codebooks reconstruct lossy PCM. Mimi's 80 ms frame is not the whole call's latency.", "対応モデルとコードブックで非可逆 PCM を復元します。Mimi の 80 ms フレームは通話全体の遅延ではありません。", "일치하는 모델과 코드북으로 손실 PCM을 복원합니다. Mimi의 80 ms 프레임은 전체 통화 지연이 아닙니다.") }
    ],
    boundary: l("两者均有代码与权重入口；Mimi 为流式参考，不宣称是 2026 年最新。选择时同时报告码率、帧长、音质和设备算力。", "Both provide code and weight access. Mimi is a streaming reference, not claimed to be a new 2026 model. Report bitrate, frame size, quality and compute together.", "両者にコードと重みの公開先があります。Mimi は流式の参考で、2026 年最新とは主張しません。ビットレート・フレーム長・品質・計算量を併記します。", "둘 다 코드와 가중치 접근 경로가 있습니다. Mimi는 스트리밍 참고이며 2026년 최신 모델이라는 주장은 아닙니다. 비트율·프레임 길이·품질·계산량을 함께 보고합니다."),
    comparison: l("SoundStream / EnCodec 保留为量化基础。Lyra 是通信取向方案，不能只凭 token 数与生成模型 tokenizer 比优劣。", "Keep SoundStream / EnCodec for quantization foundations. Lyra targets communication; token count alone cannot compare it with generative-model tokenizers.", "SoundStream / EnCodec は量子化の基礎です。通信用 Lyra と生成モデル用 tokenizer は token 数だけで比較できません。", "SoundStream / EnCodec은 양자화 기초입니다. 통신용 Lyra와 생성 모델 tokenizer를 token 수만으로 비교할 수 없습니다."),
    sources: [{ name: "WavTokenizer · code / weights", url: "https://github.com/jishengpeng/WavTokenizer" }, { name: "Mimi · code / weights", url: "https://github.com/kyutai-labs/moshi" }]
  }
};
