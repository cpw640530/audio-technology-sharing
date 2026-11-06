import { traditional } from "../content/traditional";
import type { ReactNode } from "react";
import { TopicReadingLayout } from "./TopicReadingLayout";
import { ArrowLeft, BookOpen, CircuitBoard } from "lucide-react";
import type { Category, Language, Topic } from "../content/knowledge";
import { TopicPager } from "./TopicPager";
import { MicrophoneAnatomy } from "./MicrophoneAnatomy";
import { DigitalInterfaceGuide } from "./DigitalInterfaceGuide";
import { AmplifierSpeakerAnatomy } from "./AmplifierSpeakerAnatomy";

type DisplayTopic = Topic & { category: Category };

type SupportedLanguage = "zh" | "en" | "ja" | "ko" | "zh-Hant";
type LocalizedText = Record<SupportedLanguage, string>;

const localized = (language: Language, values: LocalizedText) => values[language as SupportedLanguage];

type HardwareTopicPageProps = {
  relatedTopics?: ReactNode;
  language: Language;
  topic: DisplayTopic;
  onBack: () => void;
  onOpenLab: () => void;
  onOpenPrevious?: () => void;
  onOpenNext?: () => void;
};

const flowByType: Record<string, Record<SupportedLanguage, string[]>> = {
  microphone: {
    zh: ["声压变化", "模拟麦振膜换能", "模拟前级", "抗混叠与 ADC", "PCM 样本"], "zh-Hant": traditional(["声压变化", "模拟麦振膜换能", "模拟前级", "抗混叠与 ADC", "PCM 样本"]),
    en: ["Pressure change", "Analog mic transduction", "Analog preamp", "Anti-aliasing and ADC", "PCM samples"],
    ja: ["音圧の変化", "アナログマイクの振動板変換", "アナログプリアンプ", "アンチエイリアスとADC", "PCMサンプル"],
    ko: ["음압 변화", "아날로그 마이크 진동판 변환", "아날로그 프리앰프", "안티앨리어싱과 ADC", "PCM 샘플"]
  },
  "digital-interface": {
    zh: ["PCM 样本", "I2S / TDM 成帧", "时钟与数据线", "接收端解帧", "PCM 样本"], "zh-Hant": traditional(["PCM 样本", "I2S / TDM 成帧", "时钟与数据线", "接收端解帧", "PCM 样本"]),
    en: ["PCM samples", "I2S / TDM framing", "Clocks and data lines", "Receiver deframing", "PCM samples"],
    ja: ["PCMサンプル", "I2S / TDMフレーミング", "クロックとデータ線", "受信側のデフレーミング", "PCMサンプル"],
    ko: ["PCM 샘플", "I2S / TDM 프레이밍", "클록과 데이터 라인", "수신 측 디프레이밍", "PCM 샘플"]
  },
  "amplifier-speaker": {
    zh: ["DAC 模拟输出", "功放", "负载电压与电流", "音圈运动", "空气声压"], "zh-Hant": traditional(["DAC 模拟输出", "功放", "负载电压与电流", "音圈运动", "空气声压"]),
    en: ["DAC analog output", "Power amplifier", "Load voltage and current", "Voice-coil motion", "Air pressure"],
    ja: ["DACアナログ出力", "パワーアンプ", "負荷電圧と電流", "ボイスコイルの動き", "空気圧"],
    ko: ["DAC 아날로그 출력", "파워 앰프", "부하 전압과 전류", "보이스 코일 운동", "공기 압력"]
  }
};

const micText = (zh: string, en: string, ja: string, ko: string): LocalizedText => ({ zh, "zh-Hant": traditional(zh), en, ja, ko });

const speakerReadingGroups = [
  { id: "speaker-drive", title: micText("先驱动，再换能", "Drive, then transduce", "駆動から音への変換", "구동에서 소리로"), terms: ["What an amplifier does", "Class A / AB / D", "Moving-coil speaker"] },
  { id: "speaker-match", title: micText("匹配负载，而不是只看瓦数", "Match the load, not just the watts", "ワット数だけでなく負荷を確認", "와트 수보다 부하 매칭"), terms: ["Impedance", "Sensitivity"] },
  { id: "speaker-box", title: micText("单元确定之后，再设计箱体", "Design the enclosure around the driver", "ユニットに合わせて箱を設計", "드라이버에 맞춘 인클로저 설계"), terms: ["Thiele-Small parameters", "Sealed vs bass reflex"] },
  { id: "speaker-crossover", title: micText("把频段分开，再让声音合起来", "Split the bands, then sum the sound", "帯域を分け、音を合成する", "대역을 나눈 뒤 소리를 합하기"), terms: ["Crossover", "Crossover order and phase", "Active vs passive crossover"] },
  { id: "speaker-array", title: micText("进阶：从单只音箱到覆盖控制", "Next: from one speaker to coverage control", "発展：単体からカバレッジ制御へ", "심화: 단일 스피커에서 커버리지 제어로"), terms: ["Line array speaker"] }
];

const microphoneReading = {
  intro: micText("麦克风把声压变化转换成电信号。先看它怎样换能，再看输出如何接入系统，最后用参数判断是否适合你的采集任务。", "A microphone converts pressure changes into an electrical signal. Start with transduction, follow its output into the system, then use specifications to judge the capture task.", "マイクは音圧の変化を電気信号に変えます。変換の仕組み、システムへの接続、用途に合う仕様の順に見ていきます。", "마이크는 음압 변화를 전기 신호로 바꿉니다. 변환 원리, 시스템 연결, 용도에 맞는 사양 순으로 살펴봅니다."),
  anatomy: micText("从实物看懂换能", "From the real microphone to transduction", "実物から変換の仕組みを知る", "실물로 이해하는 변환 원리"),
  anatomyNote: micText("左侧看外形，右侧看声压如何变成电信号。动圈描述换能方式，驻极体属于电容式，MEMS 描述微加工结构；这些名称不是音质排名。", "Compare the product on the left with transduction on the right. Moving-coil describes a principle, electret is a condenser type, and MEMS describes a micromachined structure; these labels are not quality rankings.", "左の外観と右の変換原理を見比べます。動電型は変換方式、エレクトレットはコンデンサーの一種、MEMSは微細加工構造を表し、音質の順位ではありません。", "왼쪽 실물과 오른쪽 변환 원리를 비교합니다. 다이내믹은 변환 방식, 일렉트릿은 콘덴서의 한 종류, MEMS는 미세 가공 구조를 뜻하며 음질 순위가 아닙니다."),
  lab: micText("观察指向性与距离", "Explore directionality and distance", "指向性と距離を観察する", "지향성과 거리 살펴보기"),
  labNote: micText("可在实验室调节方向、距离和增益，观察理想模型；继续向下阅读接口与选型。", "Adjust direction, distance, and gain in an idealized model, or continue below for interfaces and selection.", "ラボでは方向、距離、ゲインを理想モデルで確認できます。続いて接続と選び方を読み進められます。", "실험실에서 방향, 거리, 이득을 이상화된 모델로 확인하거나 아래에서 연결과 선택 기준을 읽을 수 있습니다."),
  interface: micText("输出如何接入系统", "Connect the output to the system", "出力をシステムにつなぐ", "출력을 시스템에 연결하기"),
  interfaceNote: micText("先确认输出类型，再匹配供电和接收端。模拟或数字只是接口差别，不能直接代表音质高低。", "Identify the output first, then match power and the receiver. Analog versus digital describes the interface, not a quality ranking.", "出力形式を確認し、電源と受信側を合わせます。アナログとデジタルは接続の違いであり、音質の順位ではありません。", "출력 형식을 확인한 뒤 전원과 수신 측을 맞춥니다. 아날로그와 디지털은 연결 방식의 차이이지 음질 순위가 아닙니다."),
  interfaceHeaders: [micText("输出", "Output", "出力", "출력"), micText("供电与接入条件", "Power and connection", "電源と接続条件", "전원과 연결 조건"), micText("下一环节", "Next stage", "次の段", "다음 단계")],
  interfaces: [
    [micText("模拟电压", "Analog voltage", "アナログ電圧", "아날로그 전압"), micText("普通被动动圈不需供电；两线驻极体通常需外部偏置。其他电容麦按型号供电。", "Passive moving-coil capsules need no power; two-wire electrets usually need external bias. Power other condenser mics as specified.", "一般的な受動動電型は電源不要、2線式エレクトレットは通常外部バイアスが必要です。他のコンデンサー型は機種仕様に従います。", "일반적인 수동 다이내믹 캡슐은 전원이 필요 없고 2선식 일렉트릿은 보통 외부 바이어스가 필요합니다. 다른 콘덴서형은 모델 사양에 따릅니다."), micText("前级 → 抗混叠 / ADC → PCM", "Preamp → anti-aliasing / ADC → PCM", "前段増幅 → アンチエイリアス / ADC → PCM", "프리앰프 → 안티앨리어싱 / ADC → PCM")],
    [micText("PDM 数字流", "PDM stream", "PDMストリーム", "PDM 스트림"), micText("匹配电源、时钟和数据电平。", "Match power, clock, and logic levels.", "電源、クロック、信号レベルを合わせます。", "전원, 클록, 논리 레벨을 맞춥니다."), micText("PDM 接收 / 抽取滤波 → PCM", "PDM receiver / decimation → PCM", "PDM受信 / デシメーション → PCM", "PDM 수신 / 데시메이션 → PCM")],
    [micText("I2S 数字流", "I2S stream", "I2Sストリーム", "I2S 스트림"), micText("匹配电源、时钟、时隙和有效字长。", "Match power, clocks, slots, and valid word length.", "電源、クロック、スロット、有効ワード長を合わせます。", "전원, 클록, 슬롯, 유효 워드 길이를 맞춥니다."), micText("I2S 接收 → PCM", "I2S receiver → PCM", "I2S受信 → PCM", "I2S 수신 → PCM")]
  ],
  specs: micText("用四个参数读懂规格", "Read four key specifications", "四つの仕様を読み解く", "네 가지 핵심 사양 읽기"),
  specHeaders: [micText("参数", "Parameter", "項目", "항목"), micText("告诉你什么", "What it tells you", "分かること", "의미"), micText("什么时候关注", "When it matters", "注目する場面", "중요한 상황")],
  parameters: [
    [micText("灵敏度", "Sensitivity", "感度", "감도"), micText("给定声压下的输出大小；模拟麦常用 mV/Pa 或 dBV/Pa，数字麦常用 dBFS @ 94 dB SPL。", "Output at a stated pressure: often mV/Pa or dBV/Pa for analog mics, dBFS @ 94 dB SPL for digital mics.", "所定音圧での出力。アナログはmV/PaやdBV/Pa、デジタルはdBFS @ 94 dB SPLなどで表します。", "정해진 음압에서의 출력입니다. 아날로그는 주로 mV/Pa 또는 dBV/Pa, 디지털은 dBFS @ 94 dB SPL로 표시합니다."), micText("匹配前级增益与输入余量，不是越高越好。", "Match preamp gain and headroom; higher is not always better.", "前段ゲインとヘッドルームを合わせます。高いほど良いわけではありません。", "프리앰프 이득과 헤드룸을 맞춥니다. 높을수록 좋은 것은 아닙니다.")],
    [micText("自噪声", "Self-noise", "自己雑音", "자체 잡음"), micText("麦克风自身噪声折算成的等效输入声压级，常用 dB(A) SPL。", "The mic's own noise expressed as equivalent input SPL, often in dB(A) SPL.", "マイク自身の雑音を等価入力音圧レベルで表し、通常dB(A) SPLを使います。", "마이크 자체 잡음을 등가 입력 음압 레벨로 나타내며 보통 dB(A) SPL을 씁니다."), micText("安静、微弱声源；须在相同计权与带宽下比较。", "Quiet or faint sources; compare with matching weighting and bandwidth.", "静かな環境や小さい音。計重と帯域をそろえて比較します。", "조용한 환경이나 작은 음원. 가중치와 대역폭을 맞춰 비교합니다.")],
    [micText("最大 SPL", "Maximum SPL", "最大SPL", "최대 SPL"), micText("达到规定失真限值时可承受的声压级。", "The sound pressure level at a specified distortion limit.", "規定の歪み限界に達する音圧レベルです。", "정해진 왜곡 한계에 도달하는 음압 레벨입니다."), micText("近距离大声源；也要检查前级 / ADC 是否先削波。", "Loud close sources; the preamp or ADC may clip first.", "近距離の大きな音。前段やADCが先にクリップしないかも確認します。", "가까운 큰 음원. 프리앰프나 ADC가 먼저 클리핑되는지도 확인합니다.")],
    [micText("频率响应", "Frequency response", "周波数応答", "주파수 응답"), micText("不同频率被增强或减弱的程度。", "How response varies with frequency.", "周波数ごとの強調や減衰の程度です。", "주파수에 따른 강조 또는 감쇠 정도입니다."), micText("人声、乐器音色；结合测量方向、距离与摆位判断。", "Speech and instrument tone; consider measurement angle, distance, and placement.", "声や楽器の音色。測定方向、距離、配置も考慮します。", "음성과 악기 음색. 측정 방향, 거리, 배치를 함께 고려합니다.")]
  ],
  selection: micText("把参数放回采集场景", "Apply the specifications to a capture task", "仕様を収音の場面に当てはめる", "수음 상황에 사양 적용하기"),
  example: micText("例如桌面语音：先把麦放近说话者，再根据噪声方向选指向性；确认输出与设备兼容后，检查自噪声和增益余量。远场会议还要考虑混响与阵列布局，不能只靠提高灵敏度解决。", "For desktop speech, first move the mic closer, then choose directionality for the noise direction. Check output compatibility, self-noise, and gain headroom. Far-field meetings also require room and array design; higher sensitivity alone is not a solution.", "卓上での音声収録なら、まず話者に近づけ、雑音の方向に応じて指向性を選びます。出力の互換性、自己雑音、ゲイン余裕を確認します。遠距離の会議では残響とアレイ配置も重要で、感度を上げるだけでは解決しません。", "데스크톱 음성은 먼저 마이크를 화자 가까이 두고 잡음 방향에 맞춰 지향성을 고릅니다. 출력 호환성, 자체 잡음, 이득 여유를 확인합니다. 원거리 회의는 잔향과 어레이 배치도 고려해야 하며 감도만 높여서는 해결되지 않습니다."),
  next: micText("下一步：微弱的模拟电压如何变成 PCM？继续阅读数字音频基础；数字麦的时钟与接线则看数字音频接口。", "Next: how does a small analog voltage become PCM? Continue to Digital Audio Basics; for digital mic clocks and wiring, see digital audio interfaces.", "次は微弱なアナログ電圧をPCMに変える仕組みです。デジタル音声の基礎へ進み、デジタルマイクのクロックや配線はデジタルオーディオ接続で確認します。", "다음은 작은 아날로그 전압이 PCM으로 바뀌는 과정입니다. 디지털 오디오 기초로 이어가고 디지털 마이크의 클록과 배선은 디지털 오디오 인터페이스에서 확인합니다.")
};

export function HardwareTopicPage({ relatedTopics,
  language,
  topic,
  onBack,
  onOpenLab,
  onOpenPrevious,
  onOpenNext
}: HardwareTopicPageProps) {
  const detail = topic.detail;
  const isMicrophone = detail.lab?.type === "microphone";
  const isInterface = detail.lab?.type === "digital-interface";
  const isAmplifierSpeaker = detail.lab?.type === "amplifier-speaker";
  const terms = detail.termExplanations ?? [];
  const currentLanguage = language as SupportedLanguage;
  const flow = flowByType[detail.lab?.type ?? ""]?.[currentLanguage] ?? topic.bullets.map((item) => item[language]);

  return (
    <main className={`sound-topic-page hardware-topic-page${isMicrophone ? " microphone-topic-page" : ""}${isAmplifierSpeaker ? " amplifier-topic-page" : ""}`} aria-labelledby="hardware-topic-title">
      <header className="sound-topic-hero">
        <button className="sound-topic-back" type="button" onClick={onBack}>
          <ArrowLeft size={17} aria-hidden="true" />
          {localized(language, { zh: "返回知识库", "zh-Hant": traditional("返回知识库"), en: "Back to knowledge base", ja: "知識ベースに戻る", ko: "지식 베이스로 돌아가기" })}
        </button>
        <div className="sound-topic-kicker">
          <BookOpen size={16} aria-hidden="true" />
          {localized(language, { zh: "音频硬件 · 专业内容", "zh-Hant": traditional("音频硬件 · 专业内容"), en: "Audio hardware · Deep dive", ja: "オーディオハードウェア · 詳細解説", ko: "오디오 하드웨어 · 심화 내용" })}
        </div>
        <h1 id="hardware-topic-title">{topic.title[language]}</h1>
        <p className="sound-topic-lede">{topic.summary[language]}</p>
        <div className="sound-topic-meta">
          <span>{localized(language, { zh: "硬件链路", "zh-Hant": traditional("硬件链路"), en: "Hardware chain", ja: "ハードウェア経路", ko: "하드웨어 경로" })}</span>
          <span>{localized(language, { zh: "工程参数", "zh-Hant": traditional("工程参数"), en: "Engineering specs", ja: "技術仕様", ko: "엔지니어링 사양" })}</span>
          <span>{localized(language, { zh: "实验验证", "zh-Hant": traditional("实验验证"), en: "Hands-on lab", ja: "実験で検証", ko: "실험 검증" })}</span>
        </div>
      </header>

      <TopicReadingLayout language={language}>
        {isInterface && detail.lab ? <DigitalInterfaceGuide language={language} lab={detail.lab} onOpenLab={onOpenLab} /> : <>
        <section id={isMicrophone ? "mic-intro" : undefined} tabIndex={isMicrophone ? -1 : undefined} className="sound-topic-section sound-topic-intro">
          <div>
            <h2>{localized(language, { zh: "先建立硬件链路", "zh-Hant": traditional("先建立硬件链路"), en: "Start with the hardware chain", ja: "まずハードウェア経路を組み立てる", ko: "먼저 하드웨어 경로를 세우기" })}</h2>
            <p>{isMicrophone ? microphoneReading.intro[language] : isAmplifierSpeaker ? micText(
              "功放负责把 DAC、Codec 或前级输出的小信号，变成驱动扬声器所需的电压和电流；能量来自电源。扬声器再把电能转换成机械运动和声波。先认识实物，再看负载、箱体和分频如何共同决定结果。",
              "A power amplifier uses supply energy to turn a small DAC, Codec or preamp signal into speaker-driving voltage and current. The speaker converts electrical energy into motion and sound. Start with real hardware, then examine loads, enclosures and crossovers.",
              "アンプは電源のエネルギーを使い、DACや前段の小信号をスピーカー駆動用の電圧・電流にします。スピーカーは電気を運動と音に変えます。実物から負荷、箱、クロスオーバーへと見ていきます。",
              "앰프는 전원 에너지로 DAC, Codec, 프리앰프의 작은 신호를 스피커 구동 전압과 전류로 바꿉니다. 스피커는 전기를 운동과 소리로 변환합니다. 실물부터 부하, 인클로저, 크로스오버 순으로 살펴봅니다."
            )[language] : detail.explanation[language]}</p>
          </div>
        </section>

        {!isMicrophone && !isAmplifierSpeaker && detail.chainContext ? <section className="details-chain-context hardware-chain-context" aria-label={localized(language, { zh: "当前模块在音频链路中的位置", "zh-Hant": traditional("当前模块在音频链路中的位置"), en: "Current module in the audio chain", ja: "現在のモジュールのオーディオ経路上の位置", ko: "현재 모듈의 오디오 경로상 위치" })}>
          <div className="details-chain-heading">
            <strong>{localized(language, { zh: "它在整条音频链路中的位置", "zh-Hant": traditional("它在整条音频链路中的位置"), en: "Where this module fits", ja: "オーディオ経路の中での位置", ko: "전체 오디오 경로에서의 위치" })}</strong>
            <span>{detail.chainContext.stage[language]}</span>
          </div>
          <div className="details-chain-grid">
            <div><small>{localized(language, { zh: "输入", "zh-Hant": traditional("输入"), en: "Input", ja: "入力", ko: "입력" })}</small><p>{detail.chainContext.input[language]}</p></div>
            <div><small>{localized(language, { zh: "本模块输出", "zh-Hant": traditional("本模块输出"), en: "Module output", ja: "モジュール出力", ko: "모듈 출력" })}</small><p>{detail.chainContext.output[language]}</p></div>
            <div><small>{localized(language, { zh: "下一站", "zh-Hant": traditional("下一站"), en: "Next", ja: "次の段", ko: "다음 단계" })}</small><p>{detail.chainContext.next[language]}</p></div>
          </div>
        </section> : null}

        <section id={isMicrophone ? "mic-signal" : undefined} tabIndex={isMicrophone ? -1 : undefined} className="sound-topic-section">
          {!isMicrophone && <div className="sound-topic-section-heading">
            <div>
              <h2>{localized(language, { zh: "典型信号链示例", "zh-Hant": traditional("典型信号链示例"), en: "Example signal chain", ja: "典型的な信号経路の例", ko: "일반적인 신호 경로 예시" })}</h2>
              <p>{localized(language, { zh: "沿着信号实际经过的边界阅读，避免把换能、转换、传输和播放混成一个概念。", "zh-Hant": traditional("沿着信号实际经过的边界阅读，避免把换能、转换、传输和播放混成一个概念。"), en: "Follow the actual signal boundaries so transduction, conversion, transport, and playback stay distinct.", ja: "信号が実際に通る境界に沿って読み、変換、伝送、再生を一つの概念に混同しないようにします。", ko: "신호가 실제로 지나가는 경계를 따라 읽어 변환, 전송, 재생을 하나의 개념으로 섞지 않습니다." })}</p>
            </div>
          </div>}
          <ol className="sound-topic-flow" aria-label={localized(language, { zh: "音频硬件信号链", "zh-Hant": traditional("音频硬件信号链"), en: "Audio hardware signal chain", ja: "オーディオハードウェア信号経路", ko: "오디오 하드웨어 신호 경로" })}>
            {flow.map((step, index) => (
              <li key={`${index}-${step}`}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{step}</strong>
              </li>
            ))}
          </ol>
          {detail.lab?.type === "microphone" && <p className="sound-topic-note">{localized(language, { zh: "上图是模拟麦路径。数字麦在内部完成转换；PDM 输出需抽取滤波得到 PCM，I2S 数字麦可直接输出 PCM。", "zh-Hant": traditional("上图是模拟麦路径。数字麦在内部完成转换；PDM 输出需抽取滤波得到 PCM，I2S 数字麦可直接输出 PCM。"), en: "This shows an analog microphone path. Digital microphones convert internally: PDM needs decimation to PCM, while I2S microphones can output PCM directly.", ja: "上の図はアナログマイクの経路です。デジタルマイクは内部で変換し、PDM出力にはPCMへのデシメーションが必要ですが、I2SマイクはPCMを直接出力できます。", ko: "위 그림은 아날로그 마이크 경로입니다. 디지털 마이크는 내부에서 변환하며 PDM 출력은 PCM으로 데시메이션해야 하지만 I2S 마이크는 PCM을 직접 출력할 수 있습니다." })}</p>}
          {detail.lab?.type === "digital-interface" && <p className="sound-topic-note">{localized(language, { zh: "上图仅示例 I2S/TDM。PDM 是 1-bit 密度流，SPDIF 携带嵌入时钟，USB Audio 使用数据包，不能套用同一时序。", "zh-Hant": traditional("上图仅示例 I2S/TDM。PDM 是 1-bit 密度流，SPDIF 携带嵌入时钟，USB Audio 使用数据包，不能套用同一时序。"), en: "This example covers I2S/TDM only. PDM carries a 1-bit density stream, SPDIF embeds its clock, and USB Audio uses packets; their timing differs.", ja: "この例はI2S/TDMだけを扱います。PDMは1-bit密度ストリーム、SPDIFは埋め込みクロック、USB Audioはパケットを使うため、同じタイミング規則は適用できません。", ko: "이 예시는 I2S/TDM만 다룹니다. PDM은 1-bit 밀도 스트림, SPDIF는 임베디드 클록, USB Audio는 패킷을 사용하므로 같은 타이밍을 적용할 수 없습니다." })}</p>}
          {isAmplifierSpeaker && <AmplifierSpeakerAnatomy language={language} />}
        </section>

        {isMicrophone && <section id="mic-anatomy" tabIndex={-1} className="sound-topic-section microphone-topic-section">
          <div>
            <h2>{microphoneReading.anatomy[language]}</h2>
            <p>{microphoneReading.anatomyNote[language]}</p>
          </div>
          <MicrophoneAnatomy language={language} />
        </section>}

        <section id={isMicrophone ? "mic-lab" : undefined} tabIndex={isMicrophone ? -1 : undefined} className="sound-topic-section hardware-topic-lab-entry" aria-label={localized(language, { zh: "当前主题实验室入口", "zh-Hant": traditional("当前主题实验室入口"), en: "Current topic lab entry", ja: "現在のトピックのラボ入口", ko: "현재 주제 실험실 입구" })}>
          <div className="sound-topic-cta">
            <CircuitBoard size={22} aria-hidden="true" />
            <h2>{isMicrophone ? microphoneReading.lab[language] : localized(language, { zh: "先进入实验室验证", "zh-Hant": traditional("先进入实验室验证"), en: "Verify it in the lab first", ja: "まずラボで検証する", ko: "먼저 실험실에서 검증하기" })}</h2>
            <p>{isMicrophone ? microphoneReading.labNote[language] : isAmplifierSpeaker ? micText("切换功放类别、单元、箱体和分频图解，观察各环节的作用。图解是原理示意，不是具体产品的实测曲线；下文继续讨论选型与工程限制。", "Switch amplifier classes, drivers, enclosures and crossover diagrams to inspect their roles. These are conceptual diagrams, not product measurements; continue below for selection and limits.", "アンプ方式、ユニット、箱、分岐の図を切り替え、各段の役割を確認します。図は原理の説明であり製品の実測ではありません。続いて選定と制約を読みます。", "앰프 방식, 드라이버, 인클로저, 크로스오버 도해를 전환해 역할을 확인합니다. 개념도이며 제품 실측 곡선은 아닙니다. 아래에서 선택과 한계를 이어서 읽습니다.")[language] : localized(language, { zh: "先用交互实验观察参数变化，再阅读后面的核心知识点和术语说明。", "zh-Hant": traditional("先用交互实验观察参数变化，再阅读后面的核心知识点和术语说明。"), en: "Use the interactive lab to observe parameter changes before reading the core concepts and terms below.", ja: "まずインタラクティブな実験でパラメーターの変化を観察し、その後で核心概念と用語を読みます。", ko: "먼저 대화형 실험으로 매개변수 변화를 관찰한 뒤 핵심 개념과 용어 설명을 읽습니다." })}</p>
            <button className="diagram-open-button" type="button" onClick={onOpenLab}>
              {detail.lab?.buttonLabel[language]}
            </button>
          </div>
        </section>

        {!isMicrophone && !isAmplifierSpeaker && <section className="sound-topic-section">
          <div className="sound-topic-section-heading">
            <div>
              <h2>{localized(language, { zh: "核心知识点", "zh-Hant": traditional("核心知识点"), en: "Core concepts", ja: "核心概念", ko: "핵심 개념" })}</h2>
              <p>{localized(language, { zh: "先掌握卡片中的关键判断，再进入术语细节。", "zh-Hant": traditional("先掌握卡片中的关键判断，再进入术语细节。"), en: "Learn the key engineering decisions before going deeper into the terminology.", ja: "用語の細部に進む前に、カードの重要な技術判断を身につけます。", ko: "용어의 세부 사항으로 들어가기 전에 카드의 핵심 기술 판단을 익힙니다." })}</p>
            </div>
          </div>
          <div className="sound-topic-glossary hardware-topic-key-points">
            {detail.keyConcepts.map((concept) => (
              <article key={concept.en}>
                <p>{concept[language]}</p>
              </article>
            ))}
          </div>
        </section>}

        {isMicrophone ? <>
          <section id="mic-interface" tabIndex={-1} className="sound-topic-section microphone-topic-section">
            <div>
              <h2>{microphoneReading.interface[language]}</h2>
              <p>{microphoneReading.interfaceNote[language]}</p>
            </div>
            <table className="microphone-reading-table">
              <caption>{microphoneReading.interface[language]}</caption>
              <thead><tr>{microphoneReading.interfaceHeaders.map(header => <th scope="col" key={header.en}>{header[language]}</th>)}</tr></thead>
              <tbody>{microphoneReading.interfaces.map(row => <tr key={row[0].en}>
                <th scope="row">{row[0][language]}</th><td>{row[1][language]}</td><td>{row[2][language]}</td>
              </tr>)}</tbody>
            </table>
          </section>
          <section id="mic-specs" tabIndex={-1} className="sound-topic-section microphone-topic-section">
            <h2>{microphoneReading.specs[language]}</h2>
            <table className="microphone-reading-table">
              <caption>{microphoneReading.specs[language]}</caption>
              <thead><tr>{microphoneReading.specHeaders.map(header => <th scope="col" key={header.en}>{header[language]}</th>)}</tr></thead>
              <tbody>{microphoneReading.parameters.map(row => <tr key={row[0].en}>
                <th scope="row">{row[0][language]}</th><td>{row[1][language]}</td><td>{row[2][language]}</td>
              </tr>)}</tbody>
            </table>
          </section>
          <section id="mic-selection" tabIndex={-1} className="sound-topic-section microphone-topic-section">
            <div><h2>{microphoneReading.selection[language]}</h2><p>{microphoneReading.example[language]}</p></div>
          </section>
        </> : isAmplifierSpeaker ? speakerReadingGroups.map(group => <section key={group.id} id={group.id} tabIndex={-1} className="sound-topic-section">
          <h2>{group.title[language]}</h2>
          <div className="sound-topic-glossary">
            {terms.filter(term => group.terms.includes(term.name.en)).map(term => <article key={term.name.en}>
              <h3>{term.name[language]}</h3><p>{term.explanation[language]}</p>
            </article>)}
          </div>
          {group.id === "speaker-match" && <p className="sound-topic-note">{micText(
            "理想纯电阻例子：4 V RMS 加到 8 Ω，P = V²/R = 2 W；同电压加到 4 Ω 是 4 W，电流也加倍。实际扬声器阻抗随频率变化，不能直接套用标称阻抗计算所有频率的功率。灵敏度比较须统一距离与输入：2.83 V 在 8 Ω 上约为 1 W，在 4 Ω 上约为 2 W。",
            "Ideal resistor example: 4 V RMS into 8 Ω gives P = V²/R = 2 W; into 4 Ω it gives 4 W and twice the current. Real speaker impedance varies with frequency. Compare sensitivity at the same distance and input: 2.83 V is about 1 W into 8 Ω but 2 W into 4 Ω.",
            "理想抵抗の例：4 V RMSを8 Ωに加えるとP = V²/R = 2 W、4 Ωでは4 Wで電流も2倍です。実際のインピーダンスは周波数で変わります。感度比較では距離と入力を統一します。2.83 Vは8 Ωで約1 W、4 Ωで約2 Wです。",
            "이상적인 저항 예: 4 V RMS를 8 Ω에 가하면 P = V²/R = 2 W, 4 Ω이면 4 W이며 전류도 두 배입니다. 실제 임피던스는 주파수에 따라 달라집니다. 감도는 같은 거리와 입력으로 비교합니다. 2.83 V는 8 Ω에서 약 1 W, 4 Ω에서 약 2 W입니다."
          )[language]}</p>}
        </section>) : <section className="sound-topic-section">
          <div className="sound-topic-section-heading">
            <div>
              <h2>{localized(language, { zh: "术语与参数词典", "zh-Hant": traditional("术语与参数词典"), en: "Terms and parameters", ja: "用語とパラメーター", ko: "용어와 매개변수" })}</h2>
              <p>{localized(language, { zh: "把数据手册里的词汇放回真实信号链中理解。", "zh-Hant": traditional("把数据手册里的词汇放回真实信号链中理解。"), en: "Place datasheet terms back into the real signal chain.", ja: "データシートの用語を実際の信号経路に戻して理解します。", ko: "데이터시트의 용어를 실제 신호 경로에 놓고 이해합니다." })}</p>
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
        </section>}

        <section id={isMicrophone ? "mic-boundary" : undefined} tabIndex={isMicrophone ? -1 : undefined} className="sound-topic-section">
          <div>
            <h2>{localized(language, { zh: "工程边界", "zh-Hant": traditional("工程边界"), en: "Engineering boundary", ja: "技術上の境界", ko: "엔지니어링 경계" })}</h2>
            <p>{detail.misconception[language]}</p>
            {isMicrophone && <p className="sound-topic-note">{microphoneReading.next[language]}</p>}
          </div>
        </section>
        </>}
      </TopicReadingLayout>
      {relatedTopics}
      <TopicPager language={language} onBack={onBack} onPrevious={onOpenPrevious} onNext={onOpenNext} />
    </main>
  );
}
