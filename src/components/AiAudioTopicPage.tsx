import type { ReactNode } from "react";
import { TopicReadingLayout } from "./TopicReadingLayout";
import { ArrowLeft, BookOpen, CircuitBoard } from "lucide-react";
import type { AiAudioLabId, Category, Language, Topic } from "../content/knowledge";
import { TopicPager } from "./TopicPager";

type DisplayTopic = Topic & { category: Category };
type Locale = "zh" | "en" | "ja" | "ko";
type LocalizedText = Record<Locale, string>;
const l = (zh: string, en: string, ja: string, ko: string): LocalizedText => ({ zh, en, ja, ko });

type AiAudioTopicPageProps = {
  relatedTopics?: ReactNode;
  language: Language;
  topic: DisplayTopic;
  mode: AiAudioLabId;
  onBack: () => void;
  onOpenLab: () => void;
  onOpenPrevious?: () => void;
  onOpenNext?: () => void;
};

const flows: Record<AiAudioLabId, Array<{ title: LocalizedText; detail: LocalizedText }>> = {
  overview: [
    { title: l("采集 PCM", "Capture PCM", "PCM を収録", "PCM 캡처"), detail: l("麦克风和 ADC 把声音变成数字波形。", "Microphones and ADC turn sound into digital waveforms.", "マイクと ADC が音をデジタル波形に変換します。", "마이크와 ADC가 소리를 디지털 파형으로 변환합니다.") },
    { title: l("选择表示", "Choose representation", "表現を選ぶ", "표현 선택"), detail: l("按任务选择波形、频谱、Mel、embedding 或 token。", "Choose waveform, spectra, Mel, embeddings, or tokens for the task.", "タスクに応じて波形、スペクトル、Mel、embedding、token を選びます。", "작업에 따라 파형, 스펙트럼, Mel, embedding 또는 token을 선택합니다.") },
    { title: l("任务模型", "Task model", "タスクモデル", "작업 모델"), detail: l("识别、增强、生成或编码使用不同模型。", "Recognition, enhancement, generation, and coding use different models.", "認識、強調、生成、符号化では異なるモデルを使います。", "인식·향상·생성·코딩에는 서로 다른 모델을 사용합니다.") },
    { title: l("后处理", "Post-process", "後処理", "후처리"), detail: l("把模型输出变成文字、类别、PCM 或码流。", "Turn model outputs into text, labels, PCM, or bitstreams.", "モデル出力をテキスト、ラベル、PCM、ビットストリームに変換します。", "모델 출력을 텍스트, 레이블, PCM 또는 비트스트림으로 변환합니다.") }
  ],
  asr: [
    { title: l("PCM 与前端", "PCM and front end", "PCM とフロントエンド", "PCM과 프런트엔드"), detail: l("匹配模型采样率；频谱路线常用 25 ms 窗、10 ms 步长，两者不同。", "Match the model sample rate; spectral routes often use 25 ms windows and 10 ms hops, which are different quantities.", "モデルのサンプルレートを合わせます。スペクトル経路では 25 ms 窓と 10 ms ホップがよく使われますが、異なる量です。", "모델 샘플레이트를 맞춥니다. 스펙트럼 경로에서는 25 ms 창과 10 ms 홉을 자주 사용하지만 서로 다른 값입니다.") },
    { title: l("声学表示", "Acoustic representation", "音響表現", "음향 표현"), detail: l("可选 log-Mel/MFCC，或从波形学习表示；并非都必须先做 FFT。", "Use log-Mel/MFCC or learned waveform features; an FFT is not always required.", "log-Mel/MFCC、または波形から学習した表現を使えます。常に FFT が必要とは限りません。", "log-Mel/MFCC 또는 파형에서 학습한 표현을 사용하며 항상 FFT가 필요한 것은 아닙니다.") },
    { title: l("Encoder 与识别头", "Encoder and head", "Encoder と認識ヘッド", "Encoder와 인식 헤드"), detail: l("Encoder 建立上下文，CTC、RNNT 或 Attention 预测 token。", "The encoder builds context while CTC, RNNT, or attention predicts tokens.", "Encoder がコンテキストを作り、CTC、RNNT、Attention が token を予測します。", "Encoder가 문맥을 만들고 CTC, RNNT 또는 Attention이 token을 예측합니다.") },
    { title: l("解码与文本处理", "Decoding and text processing", "デコードとテキスト処理", "디코딩과 텍스트 처리"), detail: l("热词可参与解码；标点与时间戳由模型或专门后处理提供。", "Hotwords may guide decoding; punctuation and timestamps come from the model or dedicated post-processing.", "ホットワードはデコードを誘導できます。句読点とタイムスタンプはモデルまたは専用後処理が提供します。", "핫워드는 디코딩을 유도할 수 있고 구두점과 타임스탬프는 모델 또는 전용 후처리가 제공합니다.") }
  ],
  tts: [
    { title: l("文本规范化", "Normalize text", "テキスト正規化", "텍스트 정규화"), detail: l("数字、单位和缩写先转换为可朗读形式。", "Convert numbers, units, and abbreviations into speakable text.", "数字、単位、略語を先に読み上げ可能な形へ変換します。", "숫자·단위·약어를 먼저 읽을 수 있는 형태로 변환합니다.") },
    { title: l("读音与韵律", "Pronunciation and prosody", "発音と韻律", "발음과 운율"), detail: l("预测音素、停顿、重音、语速和音高。", "Predict phonemes, pauses, stress, speaking rate, and pitch.", "音素、ポーズ、強勢、話速、ピッチを予測します。", "음소·멈춤·강세·말하기 속도·피치를 예측합니다.") },
    { title: l("声学表示", "Acoustic representation", "音響表現", "음향 표현"), detail: l("生成 Mel 频谱或神经 codec 表示。", "Generate a Mel spectrogram or neural-codec representation.", "Mel スペクトログラムまたはニューラル codec 表現を生成します。", "Mel 스펙트로그램 또는 신경 codec 표현을 생성합니다.") },
    { title: l("波形重建", "Waveform reconstruction", "波形再構成", "파형 재구성"), detail: l("Mel 走声码器；codec token 走匹配的 codec 解码器，输出 PCM。", "Mel uses a vocoder; codec tokens use a matching codec decoder to produce PCM.", "Mel はボコーダ、codec token は対応する codec デコーダを通して PCM を出力します。", "Mel은 보코더를, codec token은 일치하는 codec 디코더를 거쳐 PCM을 출력합니다.") }
  ],
  generation: [
    { title: l("声音条件", "Audio condition", "音声条件", "오디오 조건"), detail: l("输入文本、参考音色、音乐提示或环境条件。", "Provide text, reference voice, music prompts, or scene conditions.", "テキスト、参照音色、音楽プロンプト、環境条件を入力します。", "텍스트·참조 음색·음악 프롬프트 또는 장면 조건을 입력합니다.") },
    { title: l("压缩表示", "Compressed representation", "圧縮表現", "압축 표현"), detail: l("模型在 Mel、latent 或 codec token 空间中建模。", "Model the sound in Mel, latent, or codec-token space.", "モデルは Mel、latent、codec token の空間で音をモデル化します。", "모델은 Mel, latent 또는 codec token 공간에서 소리를 모델링합니다.") },
    { title: l("生成采样", "Generative sampling", "生成サンプリング", "생성 샘플링"), detail: l("扩散模型或自回归模型逐步生成结果。", "Diffusion or autoregressive models generate the result step by step.", "拡散モデルまたは自己回帰モデルが結果を段階的に生成します。", "확산 모델 또는 자기회귀 모델이 결과를 단계적으로 생성합니다.") },
    { title: l("解码与筛选", "Decode and select", "デコードと選別", "디코딩과 선택"), detail: l("声码器还原波形，再按质量和语义筛选。", "Decode the waveform, then select by quality and semantic fit.", "ボコーダで波形を復元し、品質と意味の適合度で選別します。", "보코더로 파형을 복원한 뒤 품질과 의미 적합성으로 선택합니다.") }
  ],
  event: [
    { title: l("环境 PCM", "Environment PCM", "環境音 PCM", "환경 PCM"), detail: l("采集哭声、狗叫、玻璃破碎等环境声音。", "Capture events such as cries, barks, and glass breaks.", "泣き声、犬の鳴き声、ガラス破損などの環境音を収録します。", "울음·개 짖는 소리·유리 파손 같은 환경음을 수집합니다.") },
    { title: l("log-mel 频谱", "log-mel spectrum", "log-mel スペクトル", "log-mel 스펙트럼"), detail: l("横轴是时间，纵轴是频率，亮度表示能量。", "Time is horizontal, frequency is vertical, and brightness is energy.", "横軸は時間、縦軸は周波数、明るさはエネルギーを示します。", "가로축은 시간, 세로축은 주파수, 밝기는 에너지를 나타냅니다.") },
    { title: l("分类模型", "Classifier", "分類モデル", "분류 모델"), detail: l("CNN、Transformer 或 embedding 模型估计类别。", "CNN, Transformer, or embedding models estimate event classes.", "CNN、Transformer、embedding モデルがイベントのクラスを推定します。", "CNN, Transformer 또는 embedding 모델이 이벤트 클래스를 추정합니다.") },
    { title: l("阈值与告警", "Threshold and alert", "閾値とアラート", "임계값과 알림"), detail: l("结合置信度、持续时间和误报策略触发事件。", "Use confidence, duration, and false-alarm policy to trigger events.", "信頼度、継続時間、誤警報ポリシーを組み合わせてイベントを発火します。", "신뢰도·지속 시간·오탐 정책을 결합해 이벤트를 발생시킵니다.") }
  ],
  enhancement: [
    { title: l("带噪输入", "Noisy input", "ノイズ付き入力", "잡음 입력"), detail: l("输入含噪声、混响或多人叠加的 PCM。", "Input PCM contains noise, reverberation, or multiple speakers.", "入力 PCM にはノイズ、残響、複数話者の重なりが含まれます。", "입력 PCM에는 잡음·잔향·여러 화자의 중첩이 포함됩니다.") },
    { title: l("特征与上下文", "Features and context", "特徴とコンテキスト", "특징과 문맥"), detail: l("模型从波形或复数频谱估计目标声源。", "The model estimates the target source from waveform or complex spectra.", "モデルは波形または複素スペクトルから目標音源を推定します。", "모델은 파형 또는 복소 스펙트럼에서 목표 음원을 추정합니다.") },
    { title: l("掩码或波形重建", "Mask or waveform reconstruction", "マスクまたは波形再構成", "마스크 또는 파형 재구성"), detail: l("生成频谱掩码、滤波器或增强波形。", "Generate a spectral mask, filter, or enhanced waveform.", "スペクトルマスク、フィルタ、強調波形を生成します。", "스펙트럼 마스크·필터 또는 향상된 파형을 생성합니다.") },
    { title: l("质量与延迟", "Quality and latency", "品質と遅延", "품질과 지연"), detail: l("检查残留噪声、失真、可懂度和实时性。", "Check residual noise, distortion, intelligibility, and real-time behavior.", "残留ノイズ、ひずみ、明瞭度、リアルタイム性を確認します。", "잔여 잡음·왜곡·명료도·실시간 동작을 확인합니다.") }
  ],
  codec: [
    { title: l("PCM 分帧", "Frame PCM", "PCM をフレーム化", "PCM 프레임화"), detail: l("把波形切成固定帧，准备编码。", "Split the waveform into fixed frames for coding.", "波形を固定長フレームに分けて符号化の準備をします。", "파형을 고정 프레임으로 나눠 코딩을 준비합니다.") },
    { title: l("神经编码器", "Neural encoder", "ニューラルエンコーダ", "신경 인코더"), detail: l("把音频压缩到 latent 或离散 token。", "Compress audio into latents or discrete tokens.", "音声を latent または離散 token に圧縮します。", "오디오를 latent 또는 이산 token으로 압축합니다.") },
    { title: l("量化与码流", "Quantize and packetize", "量子化とパケット化", "양자화와 패킷화"), detail: l("控制码率、延迟和传输封装。", "Control bitrate, latency, and transport packaging.", "ビットレート、遅延、伝送パッケージを制御します。", "비트레이트·지연·전송 패키징을 제어합니다.") },
    { title: l("神经解码器", "Neural decoder", "ニューラルデコーダ", "신경 디코더"), detail: l("由匹配模型重建 PCM，不能与传统 Codec 混用。", "Reconstruct PCM with the matching model; it is not interchangeable with traditional codecs.", "対応するモデルで PCM を再構成します。従来の codec と互換ではありません。", "일치하는 모델로 PCM을 재구성하며 기존 코덱과 서로 바꿔 쓸 수 없습니다.") }
  ]
};

const modeLabels: Record<AiAudioLabId, LocalizedText> = {
  overview: l("AI 音频总流程", "AI audio overview", "AI オーディオ全体の流れ", "AI 오디오 전체 흐름"),
  asr: l("语音识别", "ASR", "音声認識", "음성 인식"),
  tts: l("语音合成", "TTS", "音声合成", "음성 합성"),
  generation: l("音频生成", "Generation", "オーディオ生成", "오디오 생성"),
  event: l("事件识别", "Event detection", "イベント認識", "이벤트 인식"),
  enhancement: l("音频增强", "Enhancement", "オーディオ強調", "오디오 향상"),
  codec: l("神经编码", "Neural coding", "ニューラル符号化", "신경 코딩")
};

export function AiAudioTopicPage({ relatedTopics, language, topic, mode, onBack, onOpenLab, onOpenPrevious, onOpenNext }: AiAudioTopicPageProps) {
  const detail = topic.detail;
  const steps = flows[mode];
  const t = (zh: string, en: string, ja: string, ko: string) => ({ zh, en, ja, ko })[language];
  return (
    <main className="sound-topic-page ai-topic-page" aria-labelledby="ai-topic-title">
      <header className="sound-topic-hero">
        <button className="sound-topic-back" type="button" onClick={onBack}><ArrowLeft size={17} aria-hidden="true" />{t("返回知识库", "Back to knowledge base", "ナレッジベースに戻る", "지식 베이스로 돌아가기")}</button>
        <div className="sound-topic-kicker"><BookOpen size={16} aria-hidden="true" />{t("AI 音频 · 专业内容", "AI audio · Deep dive", "AI オーディオ · 詳細解説", "AI 오디오 · 심층 내용")}</div>
        <h1 id="ai-topic-title">{topic.title[language]}</h1>
        <p className="sound-topic-lede">{topic.summary[language]}</p>
        <div className="sound-topic-meta"><span>{modeLabels[mode][language]}</span><span>{t("模型与部署", "Models and deployment", "モデルとデプロイ", "모델과 배포")}</span><span>{t("实验验证", "Hands-on lab", "実験で検証", "실험 검증")}</span></div>
      </header>
      <TopicReadingLayout language={language}>
        <section className="sound-topic-section sound-topic-intro"><div><h2>{t("先明确任务，再选择模型", "Define the task before choosing the model", "まずタスクを定義してからモデルを選ぶ", "먼저 작업을 정의한 뒤 모델을 선택하세요")}</h2>{detail.explanation[language].split("\n\n").map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div></section>
        <section className="sound-topic-section"><div className="sound-topic-section-heading"><div><h2>{t("这张卡片的 AI 音频链路", "The AI audio path for this topic", "このテーマの AI オーディオ経路", "이 주제의 AI 오디오 경로")}</h2><p>{t("输入表示、模型输出和工程后处理会随任务变化，不能把所有 AI 音频都当成频谱图像分类。", "Input representations, model outputs, and engineering post-processing vary by task; not all AI audio is spectrogram classification.", "入力表現、モデル出力、実装上の後処理はタスクごとに異なり、すべての AI オーディオをスペクトログラム分類とみなすことはできません。", "입력 표현·모델 출력·엔지니어링 후처리는 작업마다 다르며 모든 AI 오디오를 스펙트로그램 분류로 볼 수 없습니다.")}</p></div></div><ol className="ai-topic-flow" aria-label={t("AI 音频处理流程", "AI audio processing flow", "AI オーディオ処理フロー", "AI 오디오 처리 흐름")}>{steps.map((step, index) => <li key={step.title.en}><span>{String(index + 1).padStart(2, "0")}</span><h3>{step.title[language]}</h3><p>{step.detail[language]}</p></li>)}</ol></section>
        <section className="sound-topic-section ai-topic-lab-entry" aria-label={t("当前主题实验室入口", "Current topic lab entry", "現在のテーマのラボ入口", "현재 주제 실험실 입구")}><div className="sound-topic-cta"><CircuitBoard size={22} aria-hidden="true" /><h2>{detail.lab?.title[language]}</h2><p>{detail.lab?.description[language]}</p><button className="diagram-open-button" type="button" onClick={onOpenLab}>{detail.lab?.buttonLabel[language]}</button></div></section>
        <section className="sound-topic-section"><div className="sound-topic-section-heading"><div><h2>{t("核心知识点", "Core concepts", "核心概念", "핵심 개념")}</h2><p>{t("先掌握任务边界，再深入实验室中的公式、模型和案例。", "Understand the task boundary before diving into formulas, models, and cases in the lab.", "まずタスクの境界を理解し、ラボの式・モデル・事例へ進みます。", "먼저 작업의 경계를 이해한 뒤 실험실의 공식·모델·사례로 들어갑니다.")}</p></div></div><ul className="ai-topic-concepts">{detail.keyConcepts.map((concept) => <li key={concept.en}>{concept[language]}</li>)}</ul></section>
        <section className="sound-topic-section"><div><h2>{t("工程边界", "Engineering boundary", "実装上の境界", "엔지니어링 경계")}</h2><p>{detail.misconception[language]}</p></div></section>
        <section className="sound-topic-section"><div className="sound-topic-section-heading"><div><h2>{t("相关术语", "Related terms", "関連用語", "관련 용어")}</h2></div></div><div className="ai-topic-terms">{detail.termExplanations?.map((term) => <details key={term.name.en}><summary>{term.name[language]}</summary><p>{term.explanation[language]}</p></details>)}</div></section>
      </TopicReadingLayout>
      {relatedTopics}
      <TopicPager language={language} onBack={onBack} onPrevious={onOpenPrevious} onNext={onOpenNext} />
    </main>
  );
}
