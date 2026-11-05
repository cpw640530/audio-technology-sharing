import { traditional } from "../content/traditional";
import type { ReactNode } from "react";
import { TopicReadingLayout } from "./TopicReadingLayout";
import { ArrowLeft, BookOpen, CircuitBoard } from "lucide-react";
import type { Category, Language, Topic } from "../content/knowledge";
import { TopicPager } from "./TopicPager";

type DisplayTopic = Topic & { category: Category };

type Localized = Record<"zh" | "en" | "ja" | "ko" | "zh-Hant", string>;

type SpeechEnhancementPageProps = {
  relatedTopics?: ReactNode;
  language: Language;
  topic: DisplayTopic;
  onBack: () => void;
  onOpenLab: () => void;
  onOpenPrevious?: () => void;
  onOpenNext?: () => void;
};

const stages = [
  {
    number: "01",
    title: { zh: "采集与同步", "zh-Hant": traditional("采集与同步"), en: "Capture and sync", ja: "収音と同期", ko: "수집 및 동기화" },
    detail: { zh: "Mic / PDM / I2S 进入驱动 buffer，形成固定帧 PCM；多麦通道需要同步。", "zh-Hant": traditional("Mic / PDM / I2S 进入驱动 buffer，形成固定帧 PCM；多麦通道需要同步。"), en: "Mic / PDM / I2S enters driver buffers as fixed PCM frames; multi-mic channels must be synchronized.", ja: "Mic / PDM / I2S をドライバの buffer に取り込み、固定長の PCM フレームを作る。複数マイクのチャンネルは同期が必要。", ko: "Mic / PDM / I2S를 드라이버 buffer로 받아 고정 길이 PCM 프레임을 만들며, 여러 마이크 채널은 동기화해야 함." }
  },
  {
    number: "02",
    title: { zh: "空间处理", "zh-Hant": traditional("空间处理"), en: "Spatial processing", ja: "空間処理", ko: "공간 처리" },
    detail: { zh: "仅在多麦阵列中做 DOA、波束成形和定向拾音，单麦跳过这一层。", "zh-Hant": traditional("仅在多麦阵列中做 DOA、波束成形和定向拾音，单麦跳过这一层。"), en: "DOA, beamforming, and directional pickup require a mic array; single-mic capture skips this stage.", ja: "DOA、ビームフォーミング、指向性収音はマイクアレイで行い、単一マイクではこの段階を省略する。", ko: "DOA, 빔포밍 및 지향성 수음은 마이크 배열이 필요하며, 단일 마이크 입력에서는 이 단계를 건너뜀." }
  },
  {
    number: "03",
    title: { zh: "回声与噪声处理", "zh-Hant": traditional("回声与噪声处理"), en: "Echo and noise processing", ja: "エコーとノイズの処理", ko: "에코 및 노이즈 처리" },
    detail: { zh: "AEC 使用播放回采 reference，随后 NS / ANR 估计并抑制噪声频段。", "zh-Hant": traditional("AEC 使用播放回采 reference，随后 NS / ANR 估计并抑制噪声频段。"), en: "AEC uses a playback reference, followed by NS / ANR to estimate and suppress noisy bands.", ja: "AEC は再生の回り込み reference を使い、その後 NS / ANR がノイズ帯域を推定して抑制する。", ko: "AEC는 재생 루프백 reference를 사용하고, 이어서 NS / ANR이 노이즈 대역을 추정해 억제함." }
  },
  {
    number: "04",
    title: { zh: "尾音与电平控制", "zh-Hant": traditional("尾音与电平控制"), en: "Tail and level control", ja: "残響尾部とレベルの制御", ko: "잔향 꼬리 및 레벨 제어" },
    detail: { zh: "去混响减弱后期拖尾，AGC / Limiter 稳定语音包络和峰值。", "zh-Hant": traditional("去混响减弱后期拖尾，AGC / Limiter 稳定语音包络和峰值。"), en: "Dereverb reduces late tails, while AGC / limiter stabilizes the speech envelope and peaks.", ja: "残響除去で後期の尾部を弱め、AGC / リミッターで音声包絡とピークを安定させる。", ko: "잔향 제거로 후반 꼬리를 줄이고 AGC / 리미터로 음성 엔벨로프와 피크를 안정화함." }
  },
  {
    number: "05",
    title: { zh: "交给上层应用", "zh-Hant": traditional("交给上层应用"), en: "Hand off upstream", ja: "上位アプリへ渡す", ko: "상위 애플리케이션으로 전달" },
    detail: { zh: "处理后的 PCM 可送给 AENC、ASR、录音或通信链路。", "zh-Hant": traditional("处理后的 PCM 可送给 AENC、ASR、录音或通信链路。"), en: "Processed PCM can go to AENC, ASR, recording, or a communication pipeline.", ja: "処理後の PCM は AENC、ASR、録音、または通信経路へ渡せる。", ko: "처리된 PCM은 AENC, ASR, 녹음 또는 통신 파이프라인으로 보낼 수 있음." }
  }
];

const moduleCards = [
  {
    title: { zh: "AEC 回声消除", "zh-Hant": traditional("AEC 回声消除"), en: "AEC echo cancellation", ja: "AEC エコーキャンセル", ko: "AEC 에코 제거" },
    input: { zh: "麦克风 PCM + 播放回采 reference", "zh-Hant": traditional("麦克风 PCM + 播放回采 reference"), en: "Mic PCM + playback reference", ja: "マイク PCM + 再生回り込み reference", ko: "마이크 PCM + 재생 루프백 reference" },
    output: { zh: "减弱扬声器经空间传播后返回麦克风的回声", "zh-Hant": traditional("减弱扬声器经空间传播后返回麦克风的回声"), en: "Reduced echo returning from the speaker path", ja: "スピーカーから空間を伝わってマイクに戻るエコーを低減", ko: "스피커 경로를 거쳐 마이크로 돌아오는 에코를 줄임" }
  },
  {
    title: { zh: "NS / ANR 降噪", "zh-Hant": traditional("NS / ANR 降噪"), en: "NS / ANR noise suppression", ja: "NS / ANR ノイズ抑制", ko: "NS / ANR 노이즈 억제" },
    input: { zh: "AEC 后的短帧 PCM / 频谱", "zh-Hant": traditional("AEC 后的短帧 PCM / 频谱"), en: "Short PCM frames or spectra after AEC", ja: "AEC 後の短フレーム PCM / スペクトル", ko: "AEC 후의 짧은 PCM 프레임 / 스펙트럼" },
    output: { zh: "保留语音、降低噪声占比高的频段", "zh-Hant": traditional("保留语音、降低噪声占比高的频段"), en: "Speech-preserving attenuation of noise-dominant bands", ja: "音声を保ちながらノイズ優勢の帯域を減衰", ko: "음성을 보존하면서 노이즈가 우세한 대역을 감쇠" }
  },
  {
    title: { zh: "去混响", "zh-Hant": traditional("去混响"), en: "Dereverberation", ja: "残響除去", ko: "잔향 제거" },
    input: { zh: "包含房间反射拖尾的语音", "zh-Hant": traditional("包含房间反射拖尾的语音"), en: "Speech containing room-reflection tails", ja: "部屋の反射尾部を含む音声", ko: "실내 반사 잔향 꼬리가 포함된 음성" },
    output: { zh: "更短、更清楚但不过度发干的语音", "zh-Hant": traditional("更短、更清楚但不过度发干的语音"), en: "Clearer speech with reduced but not erased room tails", ja: "部屋の尾部を減らしつつ、過度に乾かさない明瞭な音声", ko: "실내 잔향 꼬리는 줄이되 지나치게 건조하지 않은 선명한 음성" }
  },
  {
    title: { zh: "AGC / Limiter", "zh-Hant": traditional("AGC / Limiter"), en: "AGC / limiter", ja: "AGC / リミッター", ko: "AGC / 리미터" },
    input: { zh: "语音包络和峰值", "zh-Hant": traditional("语音包络和峰值"), en: "Speech envelope and peaks", ja: "音声包絡とピーク", ko: "음성 엔벨로프와 피크" },
    output: { zh: "稳定电平并避免数字削波", "zh-Hant": traditional("稳定电平并避免数字削波"), en: "Stable level without digital clipping", ja: "レベルを安定させ、デジタルクリッピングを防ぐ", ko: "레벨을 안정화하고 디지털 클리핑을 방지" }
  }
];

const copy = {
  back: { zh: "返回知识库", "zh-Hant": traditional("返回知识库"), en: "Back to knowledge base", ja: "知識ベースに戻る", ko: "지식 베이스로 돌아가기" },
  kicker: { zh: "传统算法 · 专业内容", "zh-Hant": traditional("传统算法 · 专业内容"), en: "Traditional DSP · Deep dive", ja: "従来アルゴリズム · 専門解説", ko: "전통 알고리즘 · 전문 해설" },
  captureVqe: { zh: "采集侧 VQE / 3A", "zh-Hant": traditional("采集侧 VQE / 3A"), en: "Capture-side VQE / 3A", ja: "収音側 VQE / 3A", ko: "수집 측 VQE / 3A" },
  referenceArrays: { zh: "回采与多麦", "zh-Hant": traditional("回采与多麦"), en: "Reference and arrays", ja: "回り込み reference とマイクアレイ", ko: "루프백 reference 및 마이크 배열" },
  lab: { zh: "实验验证", "zh-Hant": traditional("实验验证"), en: "Hands-on lab", ja: "実験で検証", ko: "실험 검증" },
  intro: { zh: "语音增强是一条有顺序的 PCM 链路", "zh-Hant": traditional("语音增强是一条有顺序的 PCM 链路"), en: "Speech enhancement is an ordered PCM chain", ja: "音声強調は順序を持つ PCM 経路", ko: "음성 향상은 순서가 있는 PCM 경로" },
  flow: { zh: "从麦克风到 ASR 的典型流程", "zh-Hant": traditional("从麦克风到 ASR 的典型流程"), en: "A typical path from microphone to ASR", ja: "マイクから ASR までの典型的な流れ", ko: "마이크에서 ASR까지의 일반적인 흐름" },
  flowLead: { zh: "这是一个典型链路，不是所有 SDK 的固定顺序。AEC 可以在各麦通道上先处理，也可以位于波束成形之后；应以具体 SDK 的参考信号、通道配置和模块依赖为准。", "zh-Hant": traditional("这是一个典型链路，不是所有 SDK 的固定顺序。AEC 可以在各麦通道上先处理，也可以位于波束成形之后；应以具体 SDK 的参考信号、通道配置和模块依赖为准。"), en: "This is one typical chain, not a universal SDK order. AEC may run per microphone before beamforming or after it; follow the SDK's reference routing, channel configuration, and module dependencies.", ja: "これは典型例であり、すべての SDK に固定された順序ではない。AEC は各マイクチャンネルでビームフォーミング前に実行する場合も後に置く場合もあるため、SDK の reference 配線、チャンネル設定、モジュール依存関係に従う。", ko: "이는 일반적인 예일 뿐 모든 SDK에 고정된 순서는 아님. AEC는 각 마이크 채널에서 빔포밍 전에 처리할 수도, 이후에 처리할 수도 있으므로 SDK의 reference 라우팅, 채널 설정 및 모듈 의존성을 따라야 함." },
  flowAria: { zh: "语音增强处理流程", "zh-Hant": traditional("语音增强处理流程"), en: "Speech enhancement processing flow", ja: "音声強調処理の流れ", ko: "음성 향상 처리 흐름" },
  dependency: { zh: "关键依赖：AEC 不是只看麦克风信号，它必须拿到与回声时间对齐的播放 reference；多麦波束成形也不是单麦算法，至少需要同步的多路采集。", "zh-Hant": traditional("关键依赖：AEC 不是只看麦克风信号，它必须拿到与回声时间对齐的播放 reference；多麦波束成形也不是单麦算法，至少需要同步的多路采集。"), en: "Key dependencies: AEC needs a playback reference aligned with the microphone echo, and beamforming is not a single-mic algorithm; it needs synchronized channels.", ja: "重要な依存関係：AEC はマイク信号だけでなく、エコーと時間的にそろった再生 reference を必要とする。マイクアレイのビームフォーミングも単一マイクのアルゴリズムではなく、少なくとも同期した複数チャンネルが必要。", ko: "핵심 의존성: AEC는 마이크 신호만 보는 것이 아니라 에코와 시간 정렬된 재생 reference가 필요함. 다중 마이크 빔포밍도 단일 마이크 알고리즘이 아니며 최소한 동기화된 여러 입력 채널이 필요함." },
  modules: { zh: "每个模块负责什么", "zh-Hant": traditional("每个模块负责什么"), en: "What each module is responsible for", ja: "各モジュールの役割", ko: "각 모듈의 역할" },
  modulesLead: { zh: "把输入、输出和副作用分开，才能知道应该调整哪一个模块。", "zh-Hant": traditional("把输入、输出和副作用分开，才能知道应该调整哪一个模块。"), en: "Separate inputs, outputs, and side effects to know which module to tune.", ja: "入力、出力、副作用を分けて考えると、どのモジュールを調整すべきか分かる。", ko: "입력, 출력 및 부작용을 나누어야 어느 모듈을 조정할지 알 수 있음." },
  input: { zh: "输入", "zh-Hant": traditional("输入"), en: "Input", ja: "入力", ko: "입력" },
  output: { zh: "输出", "zh-Hant": traditional("输出"), en: "Output", ja: "出力", ko: "출력" },
  labAria: { zh: "当前主题实验室入口", "zh-Hant": traditional("当前主题实验室入口"), en: "Current topic lab entry", ja: "現在のテーマのラボ入口", ko: "현재 주제 실험실 입구" },
  labTitle: { zh: "进入语音增强实验室", "zh-Hant": traditional("进入语音增强实验室"), en: "Open the speech enhancement lab", ja: "音声強調ラボを開く", ko: "음성 향상 실험실 열기" },
  concepts: { zh: "核心知识点", "zh-Hant": traditional("核心知识点"), en: "Core concepts", ja: "核心概念", ko: "핵심 개념" },
  conceptsLead: { zh: "工程上要同时看清晰度、自然度、延迟和算力。", "zh-Hant": traditional("工程上要同时看清晰度、自然度、延迟和算力。"), en: "Engineering decisions must balance clarity, naturalness, latency, and compute.", ja: "実装では明瞭度、自然さ、遅延、計算量を同時に見る必要がある。", ko: "엔지니어링에서는 명료도, 자연스러움, 지연 시간 및 연산량을 함께 균형 있게 봐야 함." },
  terms: { zh: "算法术语", "zh-Hant": traditional("算法术语"), en: "Algorithm terms", ja: "アルゴリズム用語", ko: "알고리즘 용어" },
  termsLead: { zh: "详细公式、波形和 SoC 处理图留在实验室中展开。", "zh-Hant": traditional("详细公式、波形和 SoC 处理图留在实验室中展开。"), en: "Detailed formulas, waveforms, and SoC process diagrams stay in the lab.", ja: "詳しい式、波形、SoC 処理図はラボで詳しく扱う。", ko: "자세한 수식, 파형 및 SoC 처리 도식은 실험실에서 다룸." },
  boundary: { zh: "工程边界", "zh-Hant": traditional("工程边界"), en: "Engineering boundary", ja: "エンジニアリング上の境界", ko: "엔지니어링 경계" }
} satisfies Record<string, Localized>;

export function SpeechEnhancementPage({ relatedTopics, language, topic, onBack, onOpenLab, onOpenPrevious, onOpenNext }: SpeechEnhancementPageProps) {
  const detail = topic.detail;

  return (
    <main className="sound-topic-page speech-enhancement-topic-page" aria-labelledby="speech-enhancement-topic-title">
      <header className="sound-topic-hero">
        <button className="sound-topic-back" type="button" onClick={onBack}>
          <ArrowLeft size={17} aria-hidden="true" />
          {copy.back[language]}
        </button>
        <div className="sound-topic-kicker"><BookOpen size={16} aria-hidden="true" />{copy.kicker[language]}</div>
        <h1 id="speech-enhancement-topic-title">{topic.title[language]}</h1>
        <p className="sound-topic-lede">{topic.summary[language]}</p>
        <div className="sound-topic-meta">
          <span>{copy.captureVqe[language]}</span>
          <span>{copy.referenceArrays[language]}</span>
          <span>{copy.lab[language]}</span>
        </div>
      </header>

      <TopicReadingLayout language={language}>
        <section className="sound-topic-section sound-topic-intro">
          <div>
            <h2>{copy.intro[language]}</h2>
            <p>{detail.explanation[language]}</p>
          </div>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading"><div>
            <h2>{copy.flow[language]}</h2>
            <p>{copy.flowLead[language]}</p>
          </div></div>
          <ol className="speech-topic-stages" aria-label={copy.flowAria[language]}>
            {stages.map((stage) => <li key={stage.number}><span>{stage.number}</span><strong>{stage.title[language]}</strong><p>{stage.detail[language]}</p></li>)}
          </ol>
          <p className="sound-topic-note">{copy.dependency[language]}</p>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading"><div>
            <h2>{copy.modules[language]}</h2>
            <p>{copy.modulesLead[language]}</p>
          </div></div>
          <div className="speech-topic-modules">
            {moduleCards.map((module) => <article key={module.title.en}><h3>{module.title[language]}</h3><dl><div><dt>{copy.input[language]}</dt><dd>{module.input[language]}</dd></div><div><dt>{copy.output[language]}</dt><dd>{module.output[language]}</dd></div></dl></article>)}
          </div>
        </section>

        <section className="sound-topic-section speech-enhancement-topic-lab-entry" aria-label={copy.labAria[language]}>
          <div className="sound-topic-cta"><CircuitBoard size={22} aria-hidden="true" /><h2>{copy.labTitle[language]}</h2><p>{detail.lab?.description[language]}</p><button className="diagram-open-button" type="button" onClick={onOpenLab}>{detail.lab?.buttonLabel[language]}</button></div>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading"><div><h2>{copy.concepts[language]}</h2><p>{copy.conceptsLead[language]}</p></div></div>
          <div className="sound-topic-glossary speech-topic-key-points">{detail.keyConcepts.map((concept) => <article key={concept.en}><p>{concept[language]}</p></article>)}</div>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading"><div><h2>{copy.terms[language]}</h2><p>{copy.termsLead[language]}</p></div></div>
          <div className="sound-topic-glossary">{detail.termExplanations?.map((term) => <article key={term.name.en}><h3>{term.name[language]}</h3><p>{term.explanation[language]}</p></article>)}</div>
        </section>

        <section className="sound-topic-section"><div><h2>{copy.boundary[language]}</h2><p>{detail.misconception[language]}</p></div></section>
      </TopicReadingLayout>
      {relatedTopics}
      <TopicPager language={language} onBack={onBack} onPrevious={onOpenPrevious} onNext={onOpenNext} />
    </main>
  );
}
