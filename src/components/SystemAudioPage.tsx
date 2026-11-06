import { traditional } from "../content/traditional";
import { text } from "../content/language";
import type { ReactNode } from "react";
import { TopicReadingLayout } from "./TopicReadingLayout";
import { ArrowLeft, BookOpen } from "lucide-react";
import type { Category, Language, Topic } from "../content/knowledge";
import { SystemAudioDiagrams } from "./SystemAudioDiagrams";
import { TopicPager } from "./TopicPager";

type DisplayTopic = Topic & { category: Category };

type SystemAudioPageProps = {
  relatedTopics?: ReactNode;
  language: Language;
  topic: DisplayTopic;
  onBack: () => void;
  onOpenPrevious?: () => void;
  onOpenNext?: () => void;
};

const systemLayers = [
  {
    number: "01",
    title: { zh: "应用请求", "zh-Hant": traditional("应用请求"), en: "Application request", ja: "アプリケーションの要求", ko: "애플리케이션 요청" },
    description: { zh: "播放器、会议、录音或语音助手提出播放/采集需求。", "zh-Hant": traditional("播放器、会议、录音或语音助手提出播放/采集需求。"), en: "A player, meeting app, recorder, or voice assistant requests playback or capture.", ja: "プレーヤー、会議アプリ、録音アプリ、音声アシスタントが再生や収録を要求します。", ko: "플레이어, 회의 앱, 녹음기 또는 음성 비서가 재생이나 캡처를 요청합니다." }
  },
  {
    number: "02",
    title: { zh: "用户态音频服务", "zh-Hant": traditional("用户态音频服务"), en: "User-space audio service", ja: "ユーザー空間の音声サービス", ko: "사용자 공간 오디오 서비스" },
    description: { zh: "通过音频 API 接收流，按配置连接设备，按需混音或转换格式；策略决定连接关系。", "zh-Hant": traditional("通过音频 API 接收流，按配置连接设备，按需混音或转换格式；策略决定连接关系。"), en: "Receives streams through audio APIs, connects devices, and mixes or converts formats as needed. Policy decides the connections.", ja: "音声APIでストリームを受け、設定に沿って機器へ接続します。必要に応じてミキシングや形式変換を行い、接続先はポリシーが決めます。", ko: "오디오 API로 스트림을 받아 설정에 따라 장치에 연결하고 필요시 믹싱과 형식 변환을 합니다. 연결 관계는 정책이 결정합니다." }
  },
  {
    number: "03",
    title: { zh: "内核驱动", "zh-Hant": traditional("内核驱动"), en: "Kernel drivers", ja: "カーネルドライバー", ko: "커널 드라이버" },
    description: { zh: "提供设备与流接口，管理缓冲、传输和状态；DMA、总线与时钟由具体驱动协调。", "zh-Hant": traditional("提供设备与流接口，管理缓冲、传输和状态；DMA、总线与时钟由具体驱动协调。"), en: "Expose device and stream interfaces, manage buffers, transport and state, and coordinate DMA, buses and clocks as applicable.", ja: "機器とストリームのインターフェースを提供し、バッファー、転送、状態を管理します。DMAやバス、クロックの扱いは実装によります。", ko: "장치와 스트림 인터페이스를 제공하고 버퍼, 전송, 상태를 관리합니다. DMA, 버스, 클록은 해당 드라이버가 조정합니다." }
  },
  {
    number: "04",
    title: { zh: "硬件设备", "zh-Hant": traditional("硬件设备"), en: "Hardware devices", ja: "ハードウェア機器", ko: "하드웨어 장치" },
    description: { zh: "完成实际采集或播放：模拟麦经 ADC 得到 PCM；播放 PCM 经 DAC、功放和扬声器发声。数字麦可在内部完成转换。", "zh-Hant": traditional("完成实际采集或播放：模拟麦经 ADC 得到 PCM；播放 PCM 经 DAC、功放和扬声器发声。数字麦可在内部完成转换。"), en: "Perform capture or playback: an analog mic feeds an ADC; playback PCM feeds a DAC, amplifier and speaker. Digital mics can integrate conversion.", ja: "実際の収録・再生を担います。アナログマイクはADCへ、再生PCMはDAC・アンプ・スピーカーへ進みます。デジタルマイクは変換を内蔵できます。", ko: "실제 수음과 재생을 담당합니다. 아날로그 마이크는 ADC로, 재생 PCM은 DAC, 앰프, 스피커로 이어집니다. 디지털 마이크는 변환을 내장할 수 있습니다." }
  }
];

const systemModes = [
  {
    title: { zh: "播放", "zh-Hant": traditional("播放"), en: "Playback", ja: "再生", ko: "재생" },
    direction: { zh: "应用 → 设备", "zh-Hant": traditional("应用 → 设备"), en: "App → device", ja: "アプリ → 機器", ko: "앱 → 장치" },
    description: { zh: "应用提交 PCM，系统完成路由与混音，驱动把数据送到 DAC、功放和扬声器。", "zh-Hant": traditional("应用提交 PCM，系统完成路由与混音，驱动把数据送到 DAC、功放和扬声器。"), en: "The app submits PCM; the system routes and mixes it, and the driver sends it to the DAC, amplifier, and speaker.", ja: "アプリが PCM を渡し、システムがルーティングとミキシングを行い、ドライバー経由で DAC、アンプ、スピーカーへ送ります。", ko: "앱이 PCM을 제출하면 시스템이 라우팅과 믹싱을 하고 드라이버가 DAC, 앰프, 스피커로 전달합니다." }
  },
  {
    title: { zh: "采集", "zh-Hant": traditional("采集"), en: "Capture", ja: "収録", ko: "캡처" },
    direction: { zh: "设备 → 应用", "zh-Hant": traditional("设备 → 应用"), en: "Device → app", ja: "機器 → アプリ", ko: "장치 → 앱" },
    description: { zh: "麦克风和 ADC 产生 PCM，驱动与系统完成输入选择、权限检查，再交给应用。", "zh-Hant": traditional("麦克风和 ADC 产生 PCM，驱动与系统完成输入选择、权限检查，再交给应用。"), en: "The microphone and ADC produce PCM; the driver and system handle input selection and permission before delivering it to the app.", ja: "マイクと ADC が PCM を生成し、ドライバーとシステムが入力選択や権限確認を行ってアプリへ渡します。", ko: "마이크와 ADC가 PCM을 생성하고 드라이버와 시스템이 입력 선택 및 권한 확인 후 앱으로 전달합니다." }
  },
  {
    title: { zh: "全双工", "zh-Hant": traditional("全双工"), en: "Full duplex", ja: "全二重", ko: "전이중" },
    direction: { zh: "两条方向相反的流", "zh-Hant": traditional("两条方向相反的流"), en: "Two opposite flows", ja: "逆方向の二つの流れ", ko: "서로 반대 방향의 두 흐름" },
    description: { zh: "通话同时播放和采集；系统要协调两条流的设备、时钟、权限与会话。", "zh-Hant": traditional("通话同时播放和采集；系统要协调两条流的设备、时钟、权限与会话。"), en: "A call captures and plays at once; the system coordinates devices, clocks, permissions, and the session for both streams.", ja: "通話では収録と再生を同時に行い、システムが両ストリームの機器、クロック、権限、セッションを調整します。", ko: "통화는 캡처와 재생을 동시에 수행하며 시스템은 두 스트림의 장치, 클록, 권한, 세션을 조정합니다." }
  }
];

export function SystemAudioPage({ relatedTopics,
  language,
  topic,
  onBack,
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
          <span>{text(language, "链路图解", "Path diagrams", "経路図", "경로 다이어그램")}</span>
        </div>
      </header>

      <TopicReadingLayout language={language}>
        <section className="sound-topic-section sound-topic-intro">
          <div>
            <h2>{text(language, "先建立系统地图", "Build the system map first", "まずシステムの全体像をつかむ", "먼저 시스템의 전체 구조 파악")}</h2>
            <p>{detail.explanation[language]}</p>
            <p>{text(language, "以电脑会议为例：你要听到远端声音，同时把麦克风声音送给应用。插入耳机后，还需要决定两条流改用哪个设备。下面先看数据往哪里走，再看各层分别负责什么。", "Consider a computer call: you need to hear the remote participant while sending microphone audio to the app. Plugging in a headset also raises a routing decision for both streams. First follow their directions, then identify who does what.", "PCの通話では相手の声を聴きながら、マイク音声をアプリへ渡します。ヘッドセットを接続すると、それぞれの接続先も決める必要があります。まず流れの方向、次に各層の役割を見ます。", "PC 통화에서는 상대방 소리를 듣는 동시에 마이크 소리를 앱에 전달합니다. 헤드셋을 연결하면 두 스트림의 장치도 결정해야 합니다. 먼저 데이터 방향을 보고 각 계층의 역할을 살펴봅니다.")}</p>
          </div>
        </section>

        <section className="sound-topic-section system-topic-modes">
          <div className="sound-topic-section-heading">
            <div>
              <h2>{text(language, "先分清播放、采集和全双工", "Start with playback, capture and duplex", "まず再生・収録・全二重を区別する", "먼저 재생, 캡처, 전이중 구분")}</h2>
              <p>{text(language, "以下以 PCM 音频流为例。播放和采集是两个方向；全双工是同时使用这两个方向，不是第三种数据格式，也不意味着自动具备回声消除。", "The examples use PCM streams. Playback and capture are two directions; full duplex uses both at once. It is not a third data format and does not automatically provide echo cancellation.", "以下はPCMストリームの例です。再生と収録は二つの方向で、全二重は両方を同時に使う方式です。第三の形式ではなく、エコー除去が自動で付くわけでもありません。", "아래는 PCM 스트림의 예입니다. 재생과 캡처는 두 방향이며 전이중은 양쪽을 동시에 사용하는 방식입니다. 세 번째 형식이 아니고 자동으로 에코 제거가 되는 것도 아닙니다.")}</p>
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

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading">
            <div>
              <h2>{text(language, "系统如何管理一条音频流", "How the system manages an audio stream", "システムは音声ストリームをどう管理するか", "시스템은 오디오 스트림을 어떻게 관리하는가")}</h2>
              <p>{text(language, "两条流都要跨越应用、用户态服务、内核驱动和硬件的边界。下列分层是常见服务型架构的职责示意，不是四道 DSP 算法；策略在旁控制连接关系，不是 PCM 必经的串行处理站。", "Both streams cross application, user-space service, kernel driver and hardware boundaries. These are roles in a common service-based architecture, not four DSP stages. Policy controls connections rather than acting as a serial PCM stage.", "両ストリームはアプリ、ユーザー空間サービス、カーネル、機器の境界を通ります。一般的なサービス型構造の役割であり、四段のDSPではありません。ポリシーは接続を制御し、PCMの直列処理段ではありません。", "두 스트림은 앱, 사용자 공간 서비스, 커널 드라이버, 하드웨어의 경계를 지납니다. 일반적인 서비스형 구조의 역할이지 DSP 네 단계가 아닙니다. 정책은 연결을 제어하며 PCM의 직렬 처리 단계가 아닙니다.")}</p>
            </div>
          </div>
          <ol className="system-topic-flow" aria-label={text(language, "系统音频职责分层", "System audio responsibilities", "システム音声の役割分担", "시스템 오디오 역할 분담")}>
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
          <p className="sound-topic-note">{text(language, "落到 Linux 桌面：PipeWire 提供媒体图与流处理机制，WirePlumber 负责会话与连接策略；ALSA 既有用户态库，也有内核驱动，不是与 PipeWire 二选一。嵌入式应用也可能直接通过 ALSA 访问设备，不经过桌面音频服务。", "On a Linux desktop, PipeWire supplies the media graph and processing mechanism; WirePlumber handles session and connection policy. ALSA includes user-space libraries and kernel drivers, not an either-or alternative to PipeWire. Embedded apps may access devices through ALSA without a desktop audio service.", "LinuxデスクトップではPipeWireがメディアグラフと処理機構、WirePlumberがセッションと接続方針を担います。ALSAにはユーザー空間ライブラリとカーネルドライバーがあり、PipeWireとの二者択一ではありません。組み込みアプリはALSAを直接利用する場合もあります。", "Linux 데스크톱에서는 PipeWire가 미디어 그래프와 처리 기구를, WirePlumber가 세션과 연결 정책을 맡습니다. ALSA에는 사용자 라이브러리와 커널 드라이버가 있으며 PipeWire와 양자택일이 아닙니다. 임베디드 앱은 데스크톱 서비스 없이 ALSA로 장치에 접근할 수도 있습니다.")}</p>
        </section>

        <section className="sound-topic-section system-topic-diagrams">
          <h2>{text(language, "对照 Linux，跟随数据流", "Follow the data through Linux", "Linuxでデータの流れをたどる", "Linux에서 데이터 흐름 따라가기")}</h2>
          <SystemAudioDiagrams language={language} />
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading">
            <div>
              <h2>{text(language, "回到会议：请求、路由与平台差异", "Back to the call: requests, routing and platforms", "通話に戻る：要求・経路・プラットフォームの違い", "통화로 돌아가기: 요청, 라우팅, 플랫폼 차이")}</h2>
              <p>{text(language, "从加入会议到切换耳机，再到结束通话，用这三个问题检查是否真正理解了系统边界。", "From joining a call to switching a headset and ending the call, use these three questions to check the system boundaries.", "参加、ヘッドセット切替、通話終了の三つの場面から、システムの責任範囲を確認します。", "통화 참여, 헤드셋 전환, 통화 종료 상황에서 시스템의 책임 범위를 확인합니다.")}</p>
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
            <p className="sound-topic-note">
              {text(language, "接下来按问题深入：设备接口与 PCM 传输看 ALSA；deadline、buffer 和 XRUN 看实时音频处理；信号本身如何变化看算法卡片。", "Continue by question: explore ALSA for device interfaces and PCM transport, real-time audio for deadlines, buffers and XRUNs, and algorithm cards for changes to the signal itself.", "次は疑問に合わせて進みます。機器インターフェースとPCM転送はALSA、期限・バッファー・XRUNはリアルタイム音声、信号自体の変化はアルゴリズムのカードで扱います。", "질문에 따라 이어서 살펴보세요. 장치 인터페이스와 PCM 전송은 ALSA, 마감 시간·버퍼·XRUN은 실시간 오디오, 신호 자체의 변화는 알고리즘 카드에서 다룹니다.")}
            </p>
          </div>
        </section>
      </TopicReadingLayout>
      {relatedTopics}
      <TopicPager language={language} onBack={onBack} onPrevious={onOpenPrevious} onNext={onOpenNext} />
    </main>
  );
}
