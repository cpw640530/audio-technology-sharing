import { traditional } from "../content/traditional";
import type { ReactNode } from "react";
import { TopicReadingLayout } from "./TopicReadingLayout";
import { ArrowLeft, BookOpen, CircuitBoard } from "lucide-react";
import type { AiAudioLabId, Category, Language, Topic } from "../content/knowledge";
import { TopicPager } from "./TopicPager";
import { AiAudioOverview } from "./AiAudioOverview";
import { AiEnhancementPrinciple } from "./AiEnhancementPrinciple";
import { AsrSignalJourney } from "./AsrVisuals";
import { AsrPrinciple } from "./AsrPrinciple";
import { TtsPrinciple } from "./TtsPrinciple";
import { AudioGenerationPrinciple } from "./AudioGenerationPrinciple";

type DisplayTopic = Topic & { category: Category };
type Locale = "zh" | "en" | "ja" | "ko" | "zh-Hant";
type LocalizedText = Record<Locale, string>;
const l = (zh: string, en: string, ja: string, ko: string): LocalizedText => ({ zh, "zh-Hant": traditional(zh), en, ja, ko });

type AiAudioTopicPageProps = {
  relatedTopics?: ReactNode;
  language: Language;
  topic: DisplayTopic;
  mode: AiAudioLabId;
  onBack: () => void;
  onOpenLab: () => void;
  onOpenTopic?: (id: Exclude<AiAudioLabId, "overview">) => void;
  onOpenPrevious?: () => void;
  onOpenNext?: () => void;
};

const flows: Record<Exclude<AiAudioLabId, "overview">, Array<{ title: LocalizedText; detail: LocalizedText }>> = {
  asr: [
    { title: l("先得到 PCM", "Start with PCM", "まず PCM を得る", "먼저 PCM 수집"), detail: l("以说“你好”为例：16 kHz 每秒采集 16000 个幅度值，采样值本身不是汉字。", "For “你好”: 16 kHz captures 16,000 amplitude values per second, not characters.", "「你好」を例に、16 kHz では毎秒 16000 個の振幅値を収録します。値自体は文字ではありません。", "‘你好’를 예로 들면 16 kHz는 초당 16000개의 진폭 값을 수집하며 값 자체는 문자가 아닙니다.") },
    { title: l("提取短时声学模式", "Extract acoustic patterns", "短時間の音響パターン", "단시간 음향 패턴 추출"), detail: l("例如 25 ms 窗取 400 点，每 10 ms 移动 160 点，提取 log-Mel；波形学习前端是另一条路线，不必先做 MFCC。", "A 25 ms window takes 400 samples and a 10 ms hop advances 160 to form log-Mel features. Learned waveform front ends are an alternative; MFCC is not mandatory.", "25 ms 窓は 400 サンプル、10 ms ホップは 160 サンプルで log-Mel を作ります。波形学習は別経路で、MFCC は必須ではありません。", "25 ms 창은 400샘플, 10 ms 홉은 160샘플로 log-Mel을 만듭니다. 파형 학습 프런트엔드는 대안이며 MFCC는 필수가 아닙니다.") },
    { title: l("上下文与 token 决策", "Context and token decisions", "文脈と token の判断", "문맥과 token 판단"), detail: l("Encoder 从连续声学模式建立上下文，再用选定的识别机制估计 token 序列。一个 token 不一定对应一个汉字或一个输入帧。", "The encoder builds context from acoustic patterns; the chosen recognition mechanism estimates tokens. One token need not equal a character or an input frame.", "Encoder が音響パターンから文脈を作り、選択した認識機構で token 列を推定します。token と文字や入力フレームは一対一ではありません。", "Encoder가 음향 패턴에서 문맥을 만들고 선택한 인식 방식으로 token을 추정합니다. token 하나가 문자나 입력 프레임 하나와 일치하지 않을 수 있습니다.") },
    { title: l("解码为可用文本", "Decode usable text", "使える文字列へデコード", "사용할 텍스트로 디코딩"), detail: l("候选 token 经解码得到“你好”。热词可参与候选选择；标点、时间戳按模型或额外模块提供，说话人分离是独立任务。", "Decode candidate tokens into “你好”. Hotwords may guide selection; punctuation and timestamps depend on the model or extra modules. Speaker diarization is a separate task.", "候補 token を「你好」へデコードします。ホットワードは選択に参加でき、句読点と時刻はモデルか追加機構が提供します。話者分離は別タスクです。", "후보 token을 ‘你好’로 디코딩합니다. 핫워드는 선택을 도울 수 있고 구두점·시간 정보는 모델이나 추가 모듈이 제공합니다. 화자 분리는 별도 작업입니다.") }
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

export function AiAudioTopicPage({ relatedTopics, language, topic, mode, onBack, onOpenLab, onOpenTopic, onOpenPrevious, onOpenNext }: AiAudioTopicPageProps) {
  const detail = topic.detail;
  const steps = mode === "overview" ? [] : flows[mode];
  const t = (zh: string, en: string, ja: string, ko: string) => ({ zh, "zh-Hant": traditional(zh), en, ja, ko })[language];
  return (
    <main className={`sound-topic-page ai-topic-page${mode === "overview" ? " ai-overview-page" : ""}`} aria-labelledby="ai-topic-title">
      <header className="sound-topic-hero">
        <button className="sound-topic-back" type="button" onClick={onBack}><ArrowLeft size={17} aria-hidden="true" />{t("返回知识库", "Back to knowledge base", "ナレッジベースに戻る", "지식 베이스로 돌아가기")}</button>
        <div className="sound-topic-kicker"><BookOpen size={16} aria-hidden="true" />{t("AI 音频 · 专业内容", "AI audio · Deep dive", "AI オーディオ · 詳細解説", "AI 오디오 · 심층 내용")}</div>
        <h1 id="ai-topic-title">{topic.title[language]}</h1>
        <p className="sound-topic-lede">{topic.summary[language]}</p>
        <div className="sound-topic-meta"><span>{modeLabels[mode][language]}</span><span>{t("模型与部署", "Models and deployment", "モデルとデプロイ", "모델과 배포")}</span><span>{t("实验验证", "Hands-on lab", "実験で検証", "실험 검증")}</span></div>
      </header>
      <TopicReadingLayout language={language}>
        {mode === "overview" ? <AiAudioOverview language={language} onOpen={onOpenTopic} /> : <>
        <section className="sound-topic-section sound-topic-intro"><div><h2>{t("先明确任务，再选择模型", "Define the task before choosing the model", "まずタスクを定義してからモデルを選ぶ", "먼저 작업을 정의한 뒤 모델을 선택하세요")}</h2>{mode === "asr" ? <><p>{detail.explanation[language].split("\n\n")[0]}</p><details className="asr-reading-more"><summary>{t("展开输入与输出说明", "Input and output details", "入力と出力の説明", "입력과 출력 설명")}</summary>{detail.explanation[language].split("\n\n").slice(1).map((paragraph,index)=><p key={index}>{paragraph}</p>)}</details></> : detail.explanation[language].split("\n\n").map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div></section>
        {mode === "asr" ? <AsrSignalJourney language={language} /> : mode === "tts" ? <TtsPrinciple language={language} /> : mode === "generation" ? <AudioGenerationPrinciple language={language} /> : <>
        <section className="sound-topic-section"><div className="sound-topic-section-heading"><div><h2>{t("这张卡片的 AI 音频链路", "The AI audio path for this topic", "このテーマの AI オーディオ経路", "이 주제의 AI 오디오 경로")}</h2><p>{t("输入表示、模型输出和工程后处理会随任务变化，不能把所有 AI 音频都当成频谱图像分类。", "Input representations, model outputs, and engineering post-processing vary by task; not all AI audio is spectrogram classification.", "入力表現、モデル出力、実装上の後処理はタスクごとに異なり、すべての AI オーディオをスペクトログラム分類とみなすことはできません。", "입력 표현·모델 출력·엔지니어링 후처리는 작업마다 다르며 모든 AI 오디오를 스펙트로그램 분류로 볼 수 없습니다.")}</p></div></div><ol className="ai-topic-flow" aria-label={t("AI 音频处理流程", "AI audio processing flow", "AI オーディオ処理フロー", "AI 오디오 처리 흐름")}>{steps.map((step, index) => <li key={step.title.en}><span>{String(index + 1).padStart(2, "0")}</span><h3>{step.title[language]}</h3><p>{step.detail[language]}</p></li>)}</ol></section>
        </>}
        {mode === "enhancement" && <section className="sound-topic-section"><AiEnhancementPrinciple language={language} /></section>}
        {mode === "asr" && <AsrPrinciple language={language} />}
        </>}
        {detail.lab &&
        <section className="sound-topic-section ai-topic-lab-entry" aria-label={t("当前主题实验室入口", "Current topic lab entry", "現在のテーマのラボ入口", "현재 주제 실험실 입구")}><div className="sound-topic-cta"><CircuitBoard size={22} aria-hidden="true" /><h2>{detail.lab?.title[language]}</h2><p>{detail.lab?.description[language]}</p><button className="diagram-open-button" type="button" onClick={onOpenLab}>{detail.lab?.buttonLabel[language]}</button></div></section>
        }
        <section className="sound-topic-section"><div className="sound-topic-section-heading"><div><h2>{t("核心知识点", "Core concepts", "核心概念", "핵심 개념")}</h2><p>{t("先掌握任务边界，再深入实验室中的公式、模型和案例。", "Understand the task boundary before diving into formulas, models, and cases in the lab.", "まずタスクの境界を理解し、ラボの式・モデル・事例へ進みます。", "먼저 작업의 경계를 이해한 뒤 실험실의 공식·모델·사례로 들어갑니다.")}</p></div></div><ul className="ai-topic-concepts">{detail.keyConcepts.map((concept) => <li key={concept.en}>{concept[language]}</li>)}</ul></section>
        <section className="sound-topic-section"><div><h2>{t("工程边界", "Engineering boundary", "実装上の境界", "엔지니어링 경계")}</h2><p>{detail.misconception[language]}</p></div></section>
        <section className="sound-topic-section"><div className="sound-topic-section-heading"><div><h2>{t("相关术语", "Related terms", "関連用語", "관련 용어")}</h2></div></div><div className="ai-topic-terms">{detail.termExplanations?.map((term) => <details key={term.name.en}><summary>{term.name[language]}</summary><p>{term.explanation[language]}</p></details>)}</div></section>
      </TopicReadingLayout>
      {relatedTopics}
      <TopicPager language={language} onBack={onBack} onPrevious={onOpenPrevious} onNext={onOpenNext} />
    </main>
  );
}
