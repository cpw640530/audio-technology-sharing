import { traditional } from "../content/traditional";
import type { ReactNode } from "react";
import { TopicReadingLayout } from "./TopicReadingLayout";
import { ArrowLeft, BookOpen, CircuitBoard } from "lucide-react";
import type { Category, Language, Topic } from "../content/knowledge";
import { TopicPager } from "./TopicPager";

type DisplayTopic = Topic & { category: Category };
type Locale = "zh" | "en" | "ja" | "ko" | "zh-Hant";
type LocalizedText = Record<Locale, string>;
const l = (zh: string, en: string, ja: string, ko: string): LocalizedText => ({ zh, "zh-Hant": traditional(zh), en, ja, ko });
type ApplicationTopicPageProps = {
  relatedTopics?: ReactNode; language: Language; topic: DisplayTopic; onBack: () => void; onOpenLab: () => void; onOpenPrevious?: () => void; onOpenNext?: () => void };

type Stage = { title: LocalizedText; detail: LocalizedText };
const stageMap: Record<string, Stage[]> = {
  "bluetooth-audio": [
    { title: l("源设备 PCM", "Source PCM", "ソースデバイス PCM", "소스 기기 PCM"), detail: l("手机或主机先解码、混音并准备播放帧。", "The phone or host decodes, mixes, and prepares playout frames.", "スマートフォンやホストが先にデコード、ミックスし、再生フレームを準備します。", "휴대폰이나 호스트가 먼저 디코딩·믹싱하고 재생 프레임을 준비합니다.") },
    { title: l("Codec 与协议协商", "Codec and profile negotiation", "Codec とプロファイルのネゴシエーション", "Codec 및 프로파일 협상"), detail: l("A2DP、HFP 或 LE Audio 确定传输能力和编解码方式。", "A2DP, HFP, or LE Audio defines transport capability and coding.", "A2DP、HFP、LE Audio が伝送能力と符号化方式を決めます。", "A2DP, HFP 또는 LE Audio가 전송 능력과 코딩 방식을 정합니다.") },
    { title: l("无线传输与缓冲", "Wireless transport and buffering", "無線伝送とバッファリング", "무선 전송과 버퍼링"), detail: l("无线调度、丢包、抖动和接收缓冲共同决定稳定性。", "Radio scheduling, loss, jitter, and receive buffering determine stability.", "無線スケジューリング、パケット損失、ジッター、受信バッファが安定性を左右します。", "무선 스케줄링·손실·지터·수신 버퍼가 안정성을 함께 결정합니다.") },
    { title: l("解码与播放", "Decode and playout", "デコードと再生", "디코딩과 재생"), detail: l("耳机解码后经 DAC、功放和扬声器输出。", "The headset decodes, then uses DAC, amplifier, and speakers for output.", "ヘッドセットがデコードし、DAC、アンプ、スピーカーを通して出力します。", "헤드셋이 디코딩한 뒤 DAC·앰프·스피커를 거쳐 출력합니다.") }
  ],
  "meeting-communication": [
    { title: l("麦克风采集", "Microphone capture", "マイク収音", "마이크 캡처"), detail: l("近端语音进入驱动和采集 buffer，多麦场景还要同步。", "Near-end speech enters the driver buffer; arrays also require synchronization.", "近端音声がドライバと収音バッファに入り、マイクアレイでは同期も必要です。", "근거리 음성이 드라이버와 캡처 버퍼로 들어가며 다중 마이크는 동기화도 필요합니다.") },
    { title: l("VQE / 3A", "VQE / 3A", "VQE / 3A", "VQE / 3A"), detail: l("波束成形、AEC、降噪、去混响和 AGC 改善语音。", "Beamforming, AEC, denoising, dereverberation, and AGC improve speech.", "ビームフォーミング、AEC、ノイズ抑制、残響除去、AGC が音声を改善します。", "빔포밍·AEC·잡음 억제·잔향 제거·AGC가 음성을 개선합니다.") },
    { title: l("编码与网络", "Coding and network", "符号化とネットワーク", "코딩과 네트워크"), detail: l("编码、RTP、抖动缓冲和 PLC 共同处理弱网。", "Coding, RTP, jitter buffering, and PLC handle poor networks.", "符号化、RTP、ジッターバッファ、PLC が弱いネットワークに対応します。", "코딩·RTP·지터 버퍼·PLC가 불안정한 네트워크를 처리합니다.") },
    { title: l("播放与字幕旁路", "Playout and caption side path", "再生と字幕の分岐経路", "재생과 자막 분기 경로"), detail: l("主音频送播放，同时增强后的语音可旁路到 ASR。", "Audio plays while enhanced speech can branch to ASR for captions.", "主音声を再生しつつ、強調後の音声を ASR へ分岐して字幕に使えます。", "주 오디오는 재생하면서 향상된 음성을 ASR로 분기해 자막에 사용할 수 있습니다.") }
  ],
  "robot-audio": [
    { title: l("阵列采集", "Array capture", "アレイ収音", "어레이 캡처"), detail: l("机器人从多个麦克风获取方向和距离线索。", "The robot gathers direction and distance cues from multiple microphones.", "ロボットは複数マイクから方向と距離の手がかりを得ます。", "로봇은 여러 마이크에서 방향과 거리 단서를 얻습니다.") },
    { title: l("定位与定向拾音", "Localization and beamforming", "位置推定とビームフォーミング", "위치 추정과 빔포밍"), detail: l("DOA、波束成形和回声消除选择目标说话人。", "DOA, beamforming, and echo cancellation select the target speaker.", "DOA、ビームフォーミング、エコーキャンセルで目標話者を選びます。", "DOA·빔포밍·에코 제거로 목표 화자를 선택합니다.") },
    { title: l("语音理解", "Speech understanding", "音声理解", "음성 이해"), detail: l("VAD、ASR、意图识别和对话状态决定动作。", "VAD, ASR, intent recognition, and dialogue state determine action.", "VAD、ASR、意図認識、対話状態がアクションを決めます。", "VAD·ASR·의도 인식·대화 상태가 동작을 결정합니다.") },
    { title: l("反馈与运动", "Feedback and motion", "フィードバックと運動", "피드백과 움직임"), detail: l("TTS、灯光、屏幕和云台动作形成闭环反馈。", "TTS, lights, displays, and gimbal motion close the interaction loop.", "TTS、照明、画面、ジンバル動作で対話のフィードバックループを閉じます。", "TTS·조명·화면·짐벌 동작으로 상호작용 피드백 루프를 닫습니다.") }
  ],
  "automotive-audio": [
    { title: l("座舱采集", "Cabin capture", "キャビン収音", "캐빈 캡처"), detail: l("车内麦克风采集驾驶员和乘员语音，同时面对路噪和风噪。", "Cabin microphones capture occupants amid road and wind noise.", "車内マイクが道路ノイズや風切り音の中で運転者と乗員の声を収音します。", "차량 내부 마이크가 도로 소음과 바람 소음 속에서 운전자와 탑승자 음성을 수집합니다.") },
    { title: l("声源定位与增强", "Localization and enhancement", "音源定位と強調", "음원 위치 추정과 향상"), detail: l("多麦定位、波束成形、AEC 和降噪确定谁在说话。", "Array localization, beamforming, AEC, and denoising identify the speaker.", "マイクアレイ定位、ビームフォーミング、AEC、ノイズ抑制で話者を特定します。", "어레이 위치 추정·빔포밍·AEC·잡음 억제로 발화자를 식별합니다.") },
    { title: l("助手与座舱策略", "Assistant and cabin policy", "アシスタントとキャビンポリシー", "어시스턴트와 캐빈 정책"), detail: l("ASR、上下文和座位信息决定响应对象与交互方式。", "ASR, context, and seat information decide who receives the response.", "ASR、コンテキスト、座席情報で応答対象と対話方法を決めます。", "ASR·문맥·좌석 정보로 응답 대상과 상호작용 방식을 결정합니다.") },
    { title: l("空间回放与主动降噪", "Spatial playback and ANC", "空間再生と ANC", "공간 재생과 ANC"), detail: l("多扬声器空间音频和 ANC/RNC 同时服务体验与舒适度。", "Multi-speaker spatial audio and ANC/RNC serve experience and comfort.", "マルチスピーカー空間音響と ANC/RNC が体験と快適性を支えます。", "다중 스피커 공간 오디오와 ANC/RNC가 경험과 편안함을 함께 지원합니다.") }
  ],
  "iot-content": [
    { title: l("低功耗感知", "Low-power sensing", "低消費電力センシング", "저전력 감지"), detail: l("设备持续监听声音事件，按功耗预算选择唤醒和推理策略。", "Devices monitor sound events within a power budget for wake and inference.", "デバイスは音イベントを継続監視し、消費電力予算に応じてウェイクと推論方式を選びます。", "기기는 전력 예산 안에서 소리 이벤트를 계속 감지하고 웨이크·추론 전략을 선택합니다.") },
    { title: l("端侧或云端处理", "Edge or cloud processing", "エッジまたはクラウド処理", "엣지 또는 클라우드 처리"), detail: l("语音控制和事件识别可在端侧完成，也可上传特征或音频。", "Voice control and event detection may run on-device or upload features/audio.", "音声制御とイベント認識は端末で実行することも、特徴や音声をアップロードすることもできます。", "음성 제어와 이벤트 인식은 기기에서 수행하거나 특징·오디오를 업로드할 수 있습니다.") },
    { title: l("内容生产", "Content production", "コンテンツ制作", "콘텐츠 제작"), detail: l("录音、编辑、降噪、配乐和导出形成另一条生产链。", "Recording, editing, denoising, music, and export form a production path.", "録音、編集、ノイズ抑制、音楽、書き出しが別の制作経路を作ります。", "녹음·편집·잡음 억제·음악·내보내기가 별도의 제작 경로를 이룹니다.") },
    { title: l("交付与运维", "Delivery and operation", "納品と運用", "납품과 운영"), detail: l("关注误报、隐私、版权、格式、版本和长期维护。", "Consider false alarms, privacy, copyright, formats, versions, and maintenance.", "誤警報、プライバシー、著作権、形式、バージョン、長期保守を考慮します。", "오탐·개인정보·저작권·형식·버전·장기 유지보수를 고려합니다.") }
  ]
};

export function ApplicationTopicPage({ relatedTopics, language, topic, onBack, onOpenLab, onOpenPrevious, onOpenNext }: ApplicationTopicPageProps) {
  const detail = topic.detail;
  const stages = stageMap[detail.lab?.type ?? ""] ?? [];
  const t = (zh: string, en: string, ja: string, ko: string) => ({ zh, "zh-Hant": traditional(zh), en, ja, ko })[language];
  return (
    <main className="sound-topic-page application-topic-page" aria-labelledby="application-topic-title">
      <header className="sound-topic-hero">
        <button className="sound-topic-back" type="button" onClick={onBack}><ArrowLeft size={17} aria-hidden="true" />{t("返回知识库", "Back to knowledge base", "ナレッジベースに戻る", "지식 베이스로 돌아가기")}</button>
        <div className="sound-topic-kicker"><BookOpen size={16} aria-hidden="true" />{t("应用场景 · 专业内容", "Applications · Deep dive", "アプリケーション · 詳細解説", "응용 분야 · 심층 내용")}</div>
        <h1 id="application-topic-title">{topic.title[language]}</h1>
        <p className="sound-topic-lede">{topic.summary[language]}</p>
        <div className="sound-topic-meta"><span>{t("真实场景", "Real-world scenario", "実際のシナリオ", "실제 시나리오")}</span><span>{t("端到端链路", "End-to-end path", "エンドツーエンド経路", "엔드투엔드 경로")}</span><span>{t("实验验证", "Hands-on lab", "実験で検証", "실험 검증")}</span></div>
      </header>
      <TopicReadingLayout language={language}>
        <section className="sound-topic-section sound-topic-intro"><div><h2>{t("先从场景问题出发", "Start from the scenario problem", "まずシナリオの課題から始める", "먼저 시나리오 문제에서 시작하세요")}</h2><p>{detail.explanation[language]}</p></div></section>
        <section className="sound-topic-section"><div className="sound-topic-section-heading"><div><h2>{t("从输入到用户结果", "From input to user outcome", "入力からユーザーの結果まで", "입력에서 사용자 결과까지")}</h2><p>{t("同一个音频算法放进不同设备后，采集位置、实时约束、网络和交互反馈都会改变。", "When an audio algorithm enters a product, capture position, real-time constraints, network, and feedback all change.", "同じオーディオアルゴリズムでも製品に入ると、収音位置、リアルタイム制約、ネットワーク、フィードバックが変わります。", "같은 오디오 알고리즘도 제품에 들어가면 캡처 위치·실시간 제약·네트워크·상호작용 피드백이 달라집니다.")}</p></div></div><ol className="application-topic-flow" aria-label={t("应用场景音频流程", "Application audio flow", "アプリケーションのオーディオフロー", "응용 오디오 흐름")}>{stages.map((stage, index) => <li key={stage.title.en}><span>{String(index + 1).padStart(2, "0")}</span><h3>{stage.title[language]}</h3><p>{stage.detail[language]}</p></li>)}</ol></section>
        <section className="sound-topic-section application-topic-lab-entry" aria-label={t("当前主题实验室入口", "Current topic lab entry", "現在のテーマのラボ入口", "현재 주제 실험실 입구")}><div className="sound-topic-cta"><CircuitBoard size={22} aria-hidden="true" /><h2>{detail.lab?.title[language]}</h2><p>{detail.lab?.description[language]}</p><button className="diagram-open-button" type="button" onClick={onOpenLab}>{detail.lab?.buttonLabel[language]}</button></div></section>
        <section className="sound-topic-section"><div className="sound-topic-section-heading"><div><h2>{t("核心知识点", "Core concepts", "核心概念", "핵심 개념")}</h2><p>{t("把产品体验拆回环境、信号链、指标和故障边界。", "Break product experience into environment, signal chain, metrics, and failure boundaries.", "製品体験を環境、信号経路、指標、故障境界に分解します。", "제품 경험을 환경·신호 체인·지표·장애 경계로 나눠 봅니다.")}</p></div></div><div className="sound-topic-glossary">{detail.keyConcepts.map((concept) => <article key={concept.en}><p>{concept[language]}</p></article>)}</div></section>
        <section className="sound-topic-section"><div className="sound-topic-section-heading"><div><h2>{t("场景术语", "Scenario terms", "シナリオ用語", "시나리오 용어")}</h2><p>{t("这些概念连接设备能力和实际用户体验。", "These concepts connect device capabilities to user experience.", "これらの概念がデバイス能力と実際のユーザー体験をつなぎます。", "이 개념들이 기기 능력과 실제 사용자 경험을 연결합니다.")}</p></div></div><div className="sound-topic-glossary">{detail.termExplanations?.map((term) => <article key={term.name.en}><h3>{term.name[language]}</h3><p>{term.explanation[language]}</p></article>)}</div></section>
        <section className="sound-topic-section"><div><h2>{t("工程边界", "Engineering boundary", "実装上の境界", "엔지니어링 경계")}</h2><p>{detail.misconception[language]}</p></div></section>
      </TopicReadingLayout>
      {relatedTopics}
      <TopicPager language={language} onBack={onBack} onPrevious={onOpenPrevious} onNext={onOpenNext} />
    </main>
  );
}
