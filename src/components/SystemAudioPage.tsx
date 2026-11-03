import { text } from "../content/language";
import type { ReactNode } from "react";
import { TopicReadingLayout } from "./TopicReadingLayout";
import { ArrowLeft, BookOpen, CircuitBoard } from "lucide-react";
import type { Category, Language, Topic } from "../content/knowledge";
import { TopicPager } from "./TopicPager";

type DisplayTopic = Topic & { category: Category };

type SystemAudioPageProps = {
  relatedTopics?: ReactNode;
  language: Language;
  topic: DisplayTopic;
  onBack: () => void;
  onOpenLab: () => void;
  onOpenPrevious?: () => void;
  onOpenNext?: () => void;
};

const systemLayers = [
  {
    number: "01",
    title: { zh: "应用请求", en: "Application request", ja: "アプリケーションの要求", ko: "애플리케이션 요청" },
    description: { zh: "播放器、会议、录音或语音助手提出播放/采集需求。", en: "A player, meeting app, recorder, or voice assistant requests playback or capture.", ja: "プレーヤー、会議アプリ、録音アプリ、音声アシスタントが再生や収録を要求します。", ko: "플레이어, 회의 앱, 녹음기 또는 음성 비서가 재생이나 캡처를 요청합니다." }
  },
  {
    number: "02",
    title: { zh: "策略与会话", en: "Policy and session", ja: "ポリシーとセッション", ko: "정책과 세션" },
    description: { zh: "系统处理权限、设备选择、路由、混音和格式协商。", en: "The system handles permissions, device choice, routing, mixing, and format negotiation.", ja: "システムが権限、機器選択、ルーティング、ミキシング、形式のネゴシエーションを扱います。", ko: "시스템은 권한, 장치 선택, 라우팅, 믹싱 및 형식 협상을 처리합니다." }
  },
  {
    number: "03",
    title: { zh: "用户态音频接口", en: "User-space audio interface", ja: "ユーザー空間の音声インターフェース", ko: "사용자 공간 오디오 인터페이스" },
    description: { zh: "把应用可见的音频流交给平台接口；Linux 中常见 ALSA、PipeWire 等。", en: "Platform interfaces deliver application streams; Linux commonly uses ALSA, PipeWire, and related layers.", ja: "プラットフォームのインターフェースがアプリのストリームを渡します。Linux では ALSA、PipeWire などを使います。", ko: "플랫폼 인터페이스가 앱 스트림을 전달합니다. Linux에서는 ALSA, PipeWire 등의 계층을 사용합니다." }
  },
  {
    number: "04",
    title: { zh: "驱动与硬件", en: "Driver and hardware", ja: "ドライバーとハードウェア", ko: "드라이버와 하드웨어" },
    description: { zh: "驱动管理 DMA、时钟和设备寄存器，最后连接 Codec、功放或 ADC。", en: "Drivers manage DMA, clocks, and registers before reaching a Codec, amplifier, or ADC.", ja: "ドライバーが DMA、クロック、レジスターを管理し、Codec、アンプ、ADC へ接続します。", ko: "드라이버는 DMA, 클록, 레지스터를 관리하며 Codec, 앰프, ADC에 연결됩니다." }
  }
];

const systemModes = [
  {
    title: { zh: "播放", en: "Playback", ja: "再生", ko: "재생" },
    direction: { zh: "应用 → 设备", en: "App → device", ja: "アプリ → 機器", ko: "앱 → 장치" },
    description: { zh: "应用提交 PCM，系统完成路由与混音，驱动把数据送到 DAC、功放和扬声器。", en: "The app submits PCM; the system routes and mixes it, and the driver sends it to the DAC, amplifier, and speaker.", ja: "アプリが PCM を渡し、システムがルーティングとミキシングを行い、ドライバー経由で DAC、アンプ、スピーカーへ送ります。", ko: "앱이 PCM을 제출하면 시스템이 라우팅과 믹싱을 하고 드라이버가 DAC, 앰프, 스피커로 전달합니다." }
  },
  {
    title: { zh: "采集", en: "Capture", ja: "収録", ko: "캡처" },
    direction: { zh: "设备 → 应用", en: "Device → app", ja: "機器 → アプリ", ko: "장치 → 앱" },
    description: { zh: "麦克风和 ADC 产生 PCM，驱动与系统完成输入选择、权限检查，再交给应用。", en: "The microphone and ADC produce PCM; the driver and system handle input selection and permission before delivering it to the app.", ja: "マイクと ADC が PCM を生成し、ドライバーとシステムが入力選択や権限確認を行ってアプリへ渡します。", ko: "마이크와 ADC가 PCM을 생성하고 드라이버와 시스템이 입력 선택 및 권한 확인 후 앱으로 전달합니다." }
  },
  {
    title: { zh: "全双工", en: "Full duplex", ja: "全二重", ko: "전이중" },
    direction: { zh: "两条方向相反的流", en: "Two opposite flows", ja: "逆方向の二つの流れ", ko: "서로 반대 방향의 두 흐름" },
    description: { zh: "通话同时播放和采集；系统要协调两条流的设备、时钟、权限与会话。", en: "A call captures and plays at once; the system coordinates devices, clocks, permissions, and the session for both streams.", ja: "通話では収録と再生を同時に行い、システムが両ストリームの機器、クロック、権限、セッションを調整します。", ko: "통화는 캡처와 재생을 동시에 수행하며 시스템은 두 스트림의 장치, 클록, 권한, 세션을 조정합니다." }
  }
];

export function SystemAudioPage({ relatedTopics,
  language,
  topic,
  onBack,
  onOpenLab,
  onOpenPrevious,
  onOpenNext
}: SystemAudioPageProps) {
  const detail = topic.detail;
  const terms = detail.termExplanations ?? [];

  return (
    <main className="sound-topic-page system-topic-page" aria-labelledby="system-topic-title">
      <header className="sound-topic-hero">
        <button className="sound-topic-back" type="button" onClick={onBack}>
          <ArrowLeft size={17} aria-hidden="true" />
          {text(language, "返回知识库", "Back to knowledge base", "知識ベースに戻る", "지식 모음으로 돌아가기")}
        </button>
        <div className="sound-topic-kicker">
          <BookOpen size={16} aria-hidden="true" />
          {text(language, "音频软件 · 专业内容", "Audio software · Deep dive", "音声ソフトウェア · 詳しい解説", "오디오 소프트웨어 · 상세 설명")}
        </div>
        <h1 id="system-topic-title">{topic.title[language]}</h1>
        <p className="sound-topic-lede">{topic.summary[language]}</p>
        <div className="sound-topic-meta">
          <span>{text(language, "系统边界", "System boundaries", "システムの責任範囲", "시스템의 책임 범위")}</span>
          <span>{text(language, "请求与路由", "Requests and routing", "要求とルーティング", "요청과 라우팅")}</span>
          <span>{text(language, "实验验证", "Hands-on lab", "実験で確認", "실험으로 확인")}</span>
        </div>
      </header>

      <TopicReadingLayout language={language}>
        <section className="sound-topic-section sound-topic-intro">
          <div>
            <h2>{text(language, "先建立系统地图", "Build the system map first", "まずシステムの全体像をつかむ", "먼저 시스템의 전체 구조 파악")}</h2>
            <p>{detail.explanation[language]}</p>
          </div>
        </section>

        {detail.chainContext ? (
          <section className="details-chain-context hardware-chain-context" aria-label={text(language, "当前模块在音频链路中的位置", "Current module in the audio chain", "音声経路内のこのモジュールの位置", "오디오 경로에서 현재 모듈의 위치")}>
            <div className="details-chain-heading">
              <strong>{text(language, "它在整条音频链路中的位置", "Where this module fits", "音声経路内での役割", "전체 오디오 경로에서의 역할")}</strong>
              <span>{detail.chainContext.stage[language]}</span>
            </div>
            <div className="details-chain-grid">
              <div><small>{text(language, "输入", "Input", "入力", "입력")}</small><p>{detail.chainContext.input[language]}</p></div>
              <div><small>{text(language, "本模块输出", "Module output", "モジュールの出力", "모듈 출력")}</small><p>{detail.chainContext.output[language]}</p></div>
              <div><small>{text(language, "下一站", "Next", "次の段階", "다음 단계")}</small><p>{detail.chainContext.next[language]}</p></div>
            </div>
          </section>
        ) : null}

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading">
            <div>
              <h2>{text(language, "系统如何管理一条音频流", "How the system manages an audio stream", "システムは音声ストリームをどう管理するか", "시스템은 오디오 스트림을 어떻게 관리하는가")}</h2>
              <p>{text(language, "这四层是职责边界，不是四道信号处理算法。播放数据由应用送往设备，采集数据反向返回；权限和路由策略控制两条流的建立与交付。", "These are responsibility boundaries, not four signal-processing algorithms. Playback data goes from app to device; capture returns in reverse. Permission and routing policy control stream setup and delivery.", "この四層は責任分担であり、四つの信号処理アルゴリズムではありません。再生はアプリから機器へ、収録は逆方向へ流れます。権限とルーティングのポリシーがストリームの開始と受け渡しを制御します。", "이 네 계층은 책임 구분이며 네 개의 신호 처리 알고리즘이 아닙니다. 재생 데이터는 앱에서 장치로, 캡처 데이터는 반대로 흐릅니다. 권한과 라우팅 정책은 스트림 설정과 전달을 제어합니다.")}</p>
            </div>
          </div>
          <ol className="system-topic-flow" aria-label={text(language, "系统音频请求流程", "System audio request flow", "システム音声要求の流れ", "시스템 오디오 요청 흐름")}>
            {systemLayers.map((layer) => (
              <li key={layer.number}>
                <span>{layer.number}</span>
                <div>
                  <strong>{layer.title[language]}</strong>
                  <p>{layer.description[language]}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="sound-topic-note">
            {text(language, "边界提醒：ALSA 负责 Linux 设备接口与 PCM 传输；实时音频卡片负责 deadline、buffer 和 XRUN；DSP 算法卡片负责对信号本身做处理。", "Boundary note: ALSA covers Linux device interfaces and PCM transport; the real-time audio card covers deadlines, buffers, and XRUNs; DSP cards cover signal processing.", "範囲の区別：ALSA は Linux の機器インターフェースと PCM 転送、リアルタイム音声は期限・バッファー・XRUN、DSP は信号そのものの処理を扱います。", "범위 구분: ALSA는 Linux 장치 인터페이스와 PCM 전송을, 실시간 오디오는 마감 시간·버퍼·XRUN을, DSP는 신호 자체의 처리를 다룹니다.")}
          </p>
        </section>

        <section className="sound-topic-section system-topic-modes">
          <div className="sound-topic-section-heading">
            <div>
              <h2>{text(language, "先分清三种数据方向", "Separate the three data directions", "三つのデータ方向を区別する", "세 가지 데이터 방향 구분")}</h2>
              <p>{text(language, "系统架构相同，但数据方向和设备占用方式不同；理解这一点再进入实验室会更容易。", "The architecture is shared, but data direction and device ownership differ; this makes the lab flows easier to read.", "構造は共通でもデータの方向と機器の使用方法は異なります。この区別が実験室の図を読む助けになります。", "구조는 같아도 데이터 방향과 장치 사용 방식은 다릅니다. 이를 구분하면 실험실 흐름을 이해하기 쉽습니다.")}</p>
            </div>
          </div>
          <div className="system-topic-mode-grid">
            {systemModes.map((mode) => (
              <article key={mode.title.en}>
                <div className="system-topic-mode-heading">
                  <h3>{mode.title[language]}</h3>
                  <span>{mode.direction[language]}</span>
                </div>
                <p>{mode.description[language]}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="sound-topic-section system-topic-lab-entry" aria-label={text(language, "当前主题实验室入口", "Current topic lab entry", "このトピックの実験室", "현재 주제 실험실 입구")}>
          <div className="sound-topic-cta">
            <CircuitBoard size={22} aria-hidden="true" />
            <h2>{text(language, "进入系统音频架构实验室", "Open the system audio architecture lab", "システム音声構造の実験室へ", "시스템 오디오 구조 실험실 열기")}</h2>
            <p>{text(language, "在同一套架构中切换播放、录音和全双工，观察应用、策略、驱动与硬件的分工。", "Switch playback, capture, and duplex in one architecture to see how applications, policy, drivers, and hardware divide the work.", "再生・収録・全二重を切り替え、同じ構造内でアプリ、ポリシー、ドライバー、ハードウェアの役割を確認しましょう。", "같은 구조에서 재생, 캡처, 전이중을 전환하며 앱, 정책, 드라이버, 하드웨어의 역할을 확인하세요.")}</p>
            <button className="diagram-open-button" type="button" onClick={onOpenLab}>
              {detail.lab?.buttonLabel[language]}
            </button>
          </div>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading">
            <div>
              <h2>{text(language, "核心知识点", "Core concepts", "基本知識", "핵심 지식")}</h2>
              <p>{text(language, "掌握系统级判断，再进入 ALSA、实时处理和具体算法。", "Learn the system-level decisions before diving into ALSA, real-time processing, and algorithms.", "ALSA、リアルタイム処理、個別アルゴリズムに進む前に、システム全体での判断を理解します。", "ALSA, 실시간 처리, 개별 알고리즘으로 넘어가기 전에 시스템 수준의 판단을 이해합니다.")}</p>
            </div>
          </div>
          <div className="sound-topic-glossary system-topic-key-points">
            {detail.keyConcepts.map((concept) => <article key={concept.en}><p>{concept[language]}</p></article>)}
          </div>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading">
            <div>
              <h2>{text(language, "系统术语", "System terms", "システム用語", "시스템 용어")}</h2>
              <p>{text(language, "把常见软件层概念放回真实请求路径中。", "Place common software-layer terms back into the real request path.", "ソフトウェア層の用語を、実際の要求経路に沿って整理します。", "소프트웨어 계층 용어를 실제 요청 경로에 맞춰 정리합니다.")}</p>
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
