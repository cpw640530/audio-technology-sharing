import { traditional } from "../content/traditional";
import { text } from "../content/language";
import type { ReactNode } from "react";
import { TopicReadingLayout } from "./TopicReadingLayout";
import { ArrowLeft, BookOpen, CircuitBoard } from "lucide-react";
import type { Category, Language, Topic } from "../content/knowledge";
import { TopicPager } from "./TopicPager";

type DisplayTopic = Topic & { category: Category };

type RealtimeAudioPageProps = {
  relatedTopics?: ReactNode;
  language: Language;
  topic: DisplayTopic;
  onBack: () => void;
  onOpenLab: () => void;
  onOpenPrevious?: () => void;
  onOpenNext?: () => void;
};

const realtimeStages = [
  {
    title: { zh: "一块数据到来", "zh-Hant": traditional("一块数据到来"), en: "A block arrives", ja: "データブロックが到着", ko: "데이터 블록 도착" },
    detail: { zh: "驱动或音频服务交付固定数量的 PCM 帧。", "zh-Hant": traditional("驱动或音频服务交付固定数量的 PCM 帧。"), en: "The driver or audio service delivers a fixed block of PCM frames.", ja: "ドライバーや音声サービスが一定数の PCM フレームを渡します。", ko: "드라이버나 오디오 서비스가 일정 수의 PCM 프레임을 전달합니다." }
  },
  {
    title: { zh: "开始计时", "zh-Hant": traditional("开始计时"), en: "The clock starts", ja: "時間予算の開始", ko: "시간 예산 시작" },
    detail: { zh: "帧数 / 采样率给出稳态的每块时间预算；实际截止时间还受队列水位影响。", "zh-Hant": traditional("帧数 / 采样率给出稳态的每块时间预算；实际截止时间还受队列水位影响。"), en: "Frames / sample rate gives a steady-state block budget; the actual deadline also depends on queue occupancy.", ja: "フレーム数 / 標本化周波数が定常状態のブロック時間予算です。実際の期限はキューの蓄積量にも依存します。", ko: "프레임 수 / 샘플링 주파수는 정상 상태의 블록 시간 예산입니다. 실제 마감 시간은 큐에 쌓인 데이터 양에도 좌우됩니다." }
  },
  {
    title: { zh: "完成处理", "zh-Hant": traditional("完成处理"), en: "Processing completes", ja: "処理を完了", ko: "처리 완료" },
    detail: { zh: "滤波、混音、AEC、编码等工作必须在预算内完成。", "zh-Hant": traditional("滤波、混音、AEC、编码等工作必须在预算内完成。"), en: "Filtering, mixing, AEC, encoding, and other work must fit the budget.", ja: "フィルター、ミキシング、AEC、符号化などを予算内に完了する必要があります。", ko: "필터링, 믹싱, AEC, 인코딩 등의 처리는 시간 예산 내에 완료해야 합니다." }
  },
  {
    title: { zh: "按时交付", "zh-Hant": traditional("按时交付"), en: "Handoff on time", ja: "期限内に受け渡す", ko: "기한 내 전달" },
    detail: { zh: "及时交付或读取数据；延误耗尽缓冲余量后，才会出现 underrun / overrun。", "zh-Hant": traditional("及时交付或读取数据；延误耗尽缓冲余量后，才会出现 underrun / overrun。"), en: "Deliver or read on time; delays cause underrun / overrun once buffering headroom is exhausted.", ja: "期限内に受け渡しや読み出しを行います。遅れがバッファーの余裕を使い切ると underrun / overrun が起きます。", ko: "제때 전달하거나 읽어야 합니다. 지연으로 버퍼 여유가 소진되면 underrun / overrun이 발생합니다." }
  }
];

export function RealtimeAudioPage({ relatedTopics, language, topic, onBack, onOpenLab, onOpenPrevious, onOpenNext }: RealtimeAudioPageProps) {
  const detail = topic.detail;
  const terms = detail.termExplanations ?? [];

  return (
    <main className="sound-topic-page realtime-topic-page" aria-labelledby="realtime-topic-title">
      <header className="sound-topic-hero">
        <button className="sound-topic-back" type="button" onClick={onBack}>
          <ArrowLeft size={17} aria-hidden="true" />
          {text(language, "返回知识库", "Back to knowledge base", "知識ベースに戻る", "지식 모음으로 돌아가기")}
        </button>
        <div className="sound-topic-kicker">
          <BookOpen size={16} aria-hidden="true" />
          {text(language, "音频软件 · 实时系统专题", "Audio software · Real-time systems", "音声ソフトウェア · リアルタイム系", "오디오 소프트웨어 · 실시간 시스템")}
        </div>
        <h1 id="realtime-topic-title">{topic.title[language]}</h1>
        <p className="sound-topic-lede">{topic.summary[language]}</p>
        <div className="sound-topic-meta">
          <span>{text(language, "时间预算", "Time budget", "時間予算", "시간 예산")}</span>
          <span>{text(language, "线程与 buffer", "Threads and buffers", "スレッドとバッファー", "스레드와 버퍼")}</span>
          <span>{text(language, "实验验证", "Hands-on lab", "実験で確認", "실험으로 확인")}</span>
        </div>
      </header>

      <TopicReadingLayout language={language}>
        <section className="sound-topic-section sound-topic-intro">
          <div>
            <h2>{text(language, "实时的关键是按时完成", "Real-time means finishing on time", "リアルタイムとは期限内に完了すること", "실시간의 핵심은 제때 완료하는 것")}</h2>
            <p>{detail.explanation[language]}</p>
          </div>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading">
            <div>
              <h2>{text(language, "一块 PCM 如何经过实时处理", "How one PCM block moves through real-time processing", "PCM ブロックのリアルタイム処理経路", "PCM 블록의 실시간 처리 경로")}</h2>
              <p>{text(language, "这不是普通的离线流程：每一步都受到固定时间窗口约束。", "This is not an offline pipeline: every step is constrained by a fixed time window.", "オフライン処理と異なり、各段階は決められた時間枠に制約されます。", "오프라인 처리와 달리 각 단계는 정해진 시간 범위의 제약을 받습니다.")}</p>
            </div>
          </div>
          <ol className="realtime-topic-stages" aria-label={text(language, "实时音频处理阶段", "Real-time audio processing stages", "リアルタイム音声処理の段階", "실시간 오디오 처리 단계")}>
            {realtimeStages.map((stage, index) => (
              <li key={stage.title.en}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <strong>{stage.title[language]}</strong>
                  <p>{stage.detail[language]}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="sound-topic-note">
            {text(language, "ALSA 负责设备与 PCM 交付；实时处理关注交付之间的时间预算；具体 DSP 算法再决定这段预算会被消耗多少。", "ALSA handles device and PCM delivery; real-time processing manages the time budget between deliveries; the DSP algorithm determines how much of that budget is consumed.", "ALSA は機器と PCM の受け渡しを扱い、リアルタイム処理は受け渡し間の時間予算を管理します。DSP アルゴリズムがその予算の消費量を決めます。", "ALSA는 장치와 PCM 전달을 담당하고, 실시간 처리는 전달 사이의 시간 예산을 관리합니다. DSP 알고리즘은 그 예산의 소모량을 결정합니다.")}
          </p>
        </section>

        <section className="sound-topic-section realtime-topic-lab-entry" aria-label={text(language, "实时音频实验室入口", "Real-time audio lab entry", "リアルタイム音声実験室の入口", "실시간 오디오 실험실 입구")}>
          <div className="sound-topic-cta">
            <CircuitBoard size={22} aria-hidden="true" />
            <h2>{text(language, "进入实时音频处理实验室", "Open the real-time audio processing lab", "リアルタイム音声処理実験室へ", "실시간 오디오 처리 실험실 열기")}</h2>
            <p>{text(language, "沿 16 kHz 单声道实例，跟踪采集、512 点处理块、MP3 攒帧和解码播放；再查看 AEC 的播放参考路径。", "Follow a fixed 16 kHz mono example through capture, 512-sample processing blocks, MP3 framing, and decoded playback, then trace the AEC playback reference.", "16 kHz モノラルの例で、収録、512 サンプル単位の処理、MP3 フレーム化、復号・再生を追い、AEC の再生参照経路も確認します。", "16 kHz 모노 예제로 캡처, 512샘플 처리 블록, MP3 프레임 구성, 디코딩·재생을 따라가고 AEC 재생 참조 경로도 확인합니다.")}</p>
            <button className="diagram-open-button" type="button" onClick={onOpenLab}>
              {detail.lab?.buttonLabel[language]}
            </button>
          </div>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading">
            <div>
              <h2>{text(language, "核心判断", "Core decisions", "判断の要点", "핵심 판단")}</h2>
              <p>{text(language, "先建立实时系统的取舍，再进入 buffer 和 XRUN 的具体排查。", "Understand the real-time trade-offs before debugging buffers and XRUNs.", "バッファーや XRUN を調査する前にリアルタイム系のトレードオフを理解します。", "버퍼와 XRUN을 디버깅하기 전에 실시간 시스템의 절충 관계를 이해합니다.")}</p>
            </div>
          </div>
          <div className="sound-topic-glossary realtime-topic-key-points">
            {detail.keyConcepts.map((concept) => <article key={concept.en}><p>{concept[language]}</p></article>)}
          </div>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading">
            <div>
              <h2>{text(language, "实时术语", "Real-time terms", "リアルタイム処理の用語", "실시간 처리 용어")}</h2>
              <p>{text(language, "将参数、现象和处理策略放回同一条时间线上。", "Place parameters, symptoms, and mitigation on the same timeline.", "パラメーター、現象、対策を同じ時間軸で整理します。", "매개변수, 현상, 대응 방법을 같은 시간축에서 정리합니다.")}</p>
            </div>
          </div>
          <div className="sound-topic-glossary">
            {terms.map((term) => (
              <article key={term.name.en}>
                <h3>{term.name[language]}</h3>
                <p>{term.explanation[language]}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="sound-topic-section">
          <div>
            <h2>{text(language, "工程边界", "Engineering boundary", "実装上の適用範囲", "구현의 적용 범위")}</h2>
            <p>{detail.misconception[language]}</p>
          </div>
        </section>
      </TopicReadingLayout>
      {relatedTopics}
      <TopicPager language={language} onBack={onBack} onPrevious={onOpenPrevious} onNext={onOpenNext} />
    </main>
  );
}
