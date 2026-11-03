import type { ReactNode } from "react";
import { TopicReadingLayout } from "./TopicReadingLayout";
import { ArrowLeft, BookOpen, CircuitBoard } from "lucide-react";
import type { Category, Language, Topic } from "../content/knowledge";
import { TopicPager } from "./TopicPager";
import { MicrophoneAnatomy } from "./MicrophoneAnatomy";
import { ConverterGuide } from "./ConverterGuide";
import { AmplifierSpeakerAnatomy } from "./AmplifierSpeakerAnatomy";

type DisplayTopic = Topic & { category: Category };

type SupportedLanguage = "zh" | "en" | "ja" | "ko";
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
    zh: ["声压变化", "模拟麦振膜换能", "模拟前级", "抗混叠与 ADC", "PCM 样本"],
    en: ["Pressure change", "Analog mic transduction", "Analog preamp", "Anti-aliasing and ADC", "PCM samples"],
    ja: ["音圧の変化", "アナログマイクの振動板変換", "アナログプリアンプ", "アンチエイリアスとADC", "PCMサンプル"],
    ko: ["음압 변화", "아날로그 마이크 진동판 변환", "아날로그 프리앰프", "안티앨리어싱과 ADC", "PCM 샘플"]
  },
  "codec-hardware": {
    zh: ["模拟输入", "ADC 采样", "PCM 总线", "DSP / 混音", "DAC 输出"],
    en: ["Analog input", "ADC sampling", "PCM bus", "DSP / mixer", "DAC output"],
    ja: ["アナログ入力", "ADCサンプリング", "PCMバス", "DSP / ミキサー", "DAC出力"],
    ko: ["아날로그 입력", "ADC 샘플링", "PCM 버스", "DSP / 믹서", "DAC 출력"]
  },
  "digital-interface": {
    zh: ["PCM 样本", "I2S / TDM 成帧", "时钟与数据线", "接收端解帧", "PCM 样本"],
    en: ["PCM samples", "I2S / TDM framing", "Clocks and data lines", "Receiver deframing", "PCM samples"],
    ja: ["PCMサンプル", "I2S / TDMフレーミング", "クロックとデータ線", "受信側のデフレーミング", "PCMサンプル"],
    ko: ["PCM 샘플", "I2S / TDM 프레이밍", "클록과 데이터 라인", "수신 측 디프레이밍", "PCM 샘플"]
  },
  "amplifier-speaker": {
    zh: ["DAC 模拟输出", "功放", "负载电压与电流", "音圈运动", "空气声压"],
    en: ["DAC analog output", "Power amplifier", "Load voltage and current", "Voice-coil motion", "Air pressure"],
    ja: ["DACアナログ出力", "パワーアンプ", "負荷電圧と電流", "ボイスコイルの動き", "空気圧"],
    ko: ["DAC 아날로그 출력", "파워 앰프", "부하 전압과 전류", "보이스 코일 운동", "공기 압력"]
  }
};

const microphoneSections = [
  {
    title: { zh: "先判断采集任务", en: "Start with the capture task", ja: "まず収音の目的を判断する", ko: "먼저 수음 목적을 판단하기" },
    description: {
      zh: "先看声源、距离和空间环境，再决定需要的灵敏度、指向性和耐受声压。",
      en: "Check the source, distance, and room first, then choose sensitivity, directionality, and SPL tolerance.",
      ja: "まず音源、距離、空間環境を確認し、必要な感度、指向性、許容SPLを決めます。",
      ko: "먼저 음원, 거리, 공간 환경을 확인한 뒤 필요한 감도, 지향성, 허용 SPL을 결정합니다."
    },
    points: [
      { zh: "近距离大声压更看重耐受和余量；远场语音更看重自噪声、阵列布局和后端处理。", en: "Close loud sources need SPL headroom; far-field speech depends more on self-noise, array placement, and downstream processing.", ja: "近距離の大音圧では許容SPLとヘッドルームが重要で、遠距離音声では自己雑音、アレイ配置、後段処理がより重要です。", ko: "가까운 큰 음원은 허용 SPL과 헤드룸이 중요하고 원거리 음성은 자체 잡음, 어레이 배치, 후단 처리가 더 중요합니다." },
      { zh: "电容、动圈、驻极体和 MEMS 是换能与封装选择，不是单独代表音质高低。", en: "Condenser, dynamic, electret, and MEMS describe transducer and package choices, not a universal quality ranking.", ja: "コンデンサー、ダイナミック、エレクトレット、MEMSは変換方式とパッケージの選択を示すもので、単独で音質の優劣を決めるものではありません。", ko: "콘덴서, 다이내믹, 일렉트릿, MEMS는 변환 방식과 패키지 선택을 뜻할 뿐 그 자체로 음질 순위를 정하지 않습니다." },
      { zh: "录音棚和乐器还要按声压、瞬态、音色目标和房间条件比较电容、动圈与铝带麦，并结合摆位。", en: "Studio and instrument capture also compares condenser, dynamic, and ribbon mics by SPL, transients, tone target, and room, then tunes placement.", ja: "スタジオや楽器の収音では、SPL、過渡応答、目標音色、部屋の条件でコンデンサー、ダイナミック、リボンを比較し、配置も調整します。", ko: "스튜디오와 악기 수음에서는 SPL, 트랜지언트, 목표 음색, 공간 조건으로 콘덴서·다이내믹·리본 마이크를 비교하고 배치도 조정합니다." }
    ]
  },
  {
    title: { zh: "再确认系统接口", en: "Then confirm the system interface", ja: "次にシステムインターフェースを確認する", ko: "다음으로 시스템 인터페이스를 확인하기" },
    description: {
      zh: "模拟输出需要匹配前级和 ADC；供电按类型决定：普通被动动圈不需供电，两线驻极体通常需要外部偏置。数字麦还需匹配电源、时钟和 PDM 或 I2S 接口。",
      en: "Analog outputs need a suitable preamp and ADC. Power depends on type: conventional passive moving-coil capsules need none; two-wire electret capsules typically need external bias. Digital mics also require compatible power, clocks, and PDM or I2S interfaces.",
      ja: "アナログ出力には適切なプリアンプとADCが必要です。電源は種類で決まり、一般的な受動ダイナミックカプセルは不要ですが、2線式エレクトレットは通常外部バイアスを必要とします。デジタルマイクでは電源、クロック、PDMまたはI2Sインターフェースも適合させます。",
      ko: "아날로그 출력에는 적절한 프리앰프와 ADC가 필요합니다. 전원은 종류에 따라 다르며 일반적인 수동 다이내믹 캡슐은 필요 없지만 2선식 일렉트릿은 보통 외부 바이어스가 필요합니다. 디지털 마이크는 전원, 클록, PDM 또는 I2S 인터페이스도 맞아야 합니다."
    },
    points: [
      { zh: "先保证信号链有足够余量，再比较灵敏度、频响、自噪声和最大 SPL 等规格。", en: "Ensure signal-chain headroom first, then compare sensitivity, frequency response, self-noise, and maximum SPL.", ja: "まず信号チェーンのヘッドルームを確保し、その後で感度、周波数応答、自己雑音、最大SPLなどを比較します。", ko: "먼저 신호 체인의 헤드룸을 확보한 뒤 감도, 주파수 응답, 자체 잡음, 최대 SPL 등의 사양을 비교합니다." },
      { zh: "PDM 接收端需要抽取滤波；I2S 接收端需要匹配时钟、字长和声道配置。不能仅凭‘数字麦’判断接口兼容。", en: "PDM reception needs decimation; I2S reception needs matching clocks, word length, and channel settings. The label 'digital mic' alone does not establish compatibility.", ja: "PDMの受信側にはデシメーションが必要で、I2Sの受信側にはクロック、ワード長、チャンネル設定の一致が必要です。「デジタルマイク」という名称だけでは互換性を判断できません。", ko: "PDM 수신 측에는 데시메이션이 필요하고 I2S 수신 측에는 클록, 워드 길이, 채널 설정을 맞춰야 합니다. ‘디지털 마이크’라는 이름만으로는 호환성을 판단할 수 없습니다." },
      { zh: "手机和耳机里的多麦 MEMS 常与波束成形、通话降噪和风噪检测配合，系统布局比单颗麦规格更关键。", en: "Multi-mic MEMS systems in phones and earbuds often pair beamforming with call noise reduction and wind detection, making layout as important as one mic's specification.", ja: "スマートフォンやイヤホンの複数MEMSマイクは、ビームフォーミング、通話ノイズ低減、風雑音検出と組み合わせることが多く、単一マイクの仕様以上にシステム配置が重要です。", ko: "스마트폰과 이어버드의 다중 MEMS 마이크는 빔포밍, 통화 잡음 감소, 바람 잡음 감지와 함께 사용되는 경우가 많아 단일 마이크 사양보다 시스템 배치가 중요합니다." }
    ]
  }
];

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
  const isConverter = detail.lab?.type === "codec-hardware";
  const isAmplifierSpeaker = detail.lab?.type === "amplifier-speaker";
  const terms = detail.termExplanations ?? [];
  const currentLanguage = language as SupportedLanguage;
  const flow = flowByType[detail.lab?.type ?? ""]?.[currentLanguage] ?? topic.bullets.map((item) => item[language]);

  return (
    <main className={`sound-topic-page hardware-topic-page${isMicrophone ? " microphone-topic-page" : ""}`} aria-labelledby="hardware-topic-title">
      <header className="sound-topic-hero">
        <button className="sound-topic-back" type="button" onClick={onBack}>
          <ArrowLeft size={17} aria-hidden="true" />
          {localized(language, { zh: "返回知识库", en: "Back to knowledge base", ja: "知識ベースに戻る", ko: "지식 베이스로 돌아가기" })}
        </button>
        <div className="sound-topic-kicker">
          <BookOpen size={16} aria-hidden="true" />
          {localized(language, { zh: "音频硬件 · 专业内容", en: "Audio hardware · Deep dive", ja: "オーディオハードウェア · 詳細解説", ko: "오디오 하드웨어 · 심화 내용" })}
        </div>
        <h1 id="hardware-topic-title">{topic.title[language]}</h1>
        <p className="sound-topic-lede">{topic.summary[language]}</p>
        <div className="sound-topic-meta">
          <span>{localized(language, { zh: "硬件链路", en: "Hardware chain", ja: "ハードウェア経路", ko: "하드웨어 경로" })}</span>
          <span>{localized(language, { zh: "工程参数", en: "Engineering specs", ja: "技術仕様", ko: "엔지니어링 사양" })}</span>
          <span>{localized(language, { zh: "实验验证", en: "Hands-on lab", ja: "実験で検証", ko: "실험 검증" })}</span>
        </div>
      </header>

      <TopicReadingLayout language={language}>
        <section id={isMicrophone ? "mic-intro" : undefined} tabIndex={isMicrophone ? -1 : undefined} className="sound-topic-section sound-topic-intro">
          <div>
            <h2>{localized(language, { zh: "先建立硬件链路", en: "Start with the hardware chain", ja: "まずハードウェア経路を組み立てる", ko: "먼저 하드웨어 경로를 세우기" })}</h2>
            <p>{detail.explanation[language]}</p>
          </div>
        </section>

        {detail.chainContext ? <section className="details-chain-context hardware-chain-context" aria-label={localized(language, { zh: "当前模块在音频链路中的位置", en: "Current module in the audio chain", ja: "現在のモジュールのオーディオ経路上の位置", ko: "현재 모듈의 오디오 경로상 위치" })}>
          <div className="details-chain-heading">
            <strong>{localized(language, { zh: "它在整条音频链路中的位置", en: "Where this module fits", ja: "オーディオ経路の中での位置", ko: "전체 오디오 경로에서의 위치" })}</strong>
            <span>{detail.chainContext.stage[language]}</span>
          </div>
          <div className="details-chain-grid">
            <div><small>{localized(language, { zh: "输入", en: "Input", ja: "入力", ko: "입력" })}</small><p>{detail.chainContext.input[language]}</p></div>
            <div><small>{localized(language, { zh: "本模块输出", en: "Module output", ja: "モジュール出力", ko: "모듈 출력" })}</small><p>{detail.chainContext.output[language]}</p></div>
            <div><small>{localized(language, { zh: "下一站", en: "Next", ja: "次の段", ko: "다음 단계" })}</small><p>{detail.chainContext.next[language]}</p></div>
          </div>
        </section> : null}

        {!isConverter && <section id={isMicrophone ? "mic-signal" : undefined} tabIndex={isMicrophone ? -1 : undefined} className="sound-topic-section">
          <div className="sound-topic-section-heading">
            <div>
              <h2>{localized(language, { zh: "典型信号链示例", en: "Example signal chain", ja: "典型的な信号経路の例", ko: "일반적인 신호 경로 예시" })}</h2>
              <p>{localized(language, { zh: "沿着信号实际经过的边界阅读，避免把换能、转换、传输和播放混成一个概念。", en: "Follow the actual signal boundaries so transduction, conversion, transport, and playback stay distinct.", ja: "信号が実際に通る境界に沿って読み、変換、伝送、再生を一つの概念に混同しないようにします。", ko: "신호가 실제로 지나가는 경계를 따라 읽어 변환, 전송, 재생을 하나의 개념으로 섞지 않습니다." })}</p>
            </div>
          </div>
          <ol className="sound-topic-flow" aria-label={localized(language, { zh: "音频硬件信号链", en: "Audio hardware signal chain", ja: "オーディオハードウェア信号経路", ko: "오디오 하드웨어 신호 경로" })}>
            {flow.map((step, index) => (
              <li key={`${index}-${step}`}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{step}</strong>
              </li>
            ))}
          </ol>
          {detail.lab?.type === "microphone" && <p className="sound-topic-note">{localized(language, { zh: "上图是模拟麦路径。数字麦在内部完成转换；PDM 输出需抽取滤波得到 PCM，I2S 数字麦可直接输出 PCM。", en: "This shows an analog microphone path. Digital microphones convert internally: PDM needs decimation to PCM, while I2S microphones can output PCM directly.", ja: "上の図はアナログマイクの経路です。デジタルマイクは内部で変換し、PDM出力にはPCMへのデシメーションが必要ですが、I2SマイクはPCMを直接出力できます。", ko: "위 그림은 아날로그 마이크 경로입니다. 디지털 마이크는 내부에서 변환하며 PDM 출력은 PCM으로 데시메이션해야 하지만 I2S 마이크는 PCM을 직접 출력할 수 있습니다." })}</p>}
          {detail.lab?.type === "digital-interface" && <p className="sound-topic-note">{localized(language, { zh: "上图仅示例 I2S/TDM。PDM 是 1-bit 密度流，SPDIF 携带嵌入时钟，USB Audio 使用数据包，不能套用同一时序。", en: "This example covers I2S/TDM only. PDM carries a 1-bit density stream, SPDIF embeds its clock, and USB Audio uses packets; their timing differs.", ja: "この例はI2S/TDMだけを扱います。PDMは1-bit密度ストリーム、SPDIFは埋め込みクロック、USB Audioはパケットを使うため、同じタイミング規則は適用できません。", ko: "이 예시는 I2S/TDM만 다룹니다. PDM은 1-bit 밀도 스트림, SPDIF는 임베디드 클록, USB Audio는 패킷을 사용하므로 같은 타이밍을 적용할 수 없습니다." })}</p>}
          {isAmplifierSpeaker && <AmplifierSpeakerAnatomy language={language} />}
        </section>}

        <section id={isMicrophone ? "mic-lab" : undefined} tabIndex={isMicrophone ? -1 : undefined} className="sound-topic-section hardware-topic-lab-entry" aria-label={localized(language, { zh: "当前主题实验室入口", en: "Current topic lab entry", ja: "現在のトピックのラボ入口", ko: "현재 주제 실험실 입구" })}>
          <div className="sound-topic-cta">
            <CircuitBoard size={22} aria-hidden="true" />
            <h2>{localized(language, { zh: "先进入实验室验证", en: "Verify it in the lab first", ja: "まずラボで検証する", ko: "먼저 실험실에서 검증하기" })}</h2>
            <p>{localized(language, { zh: "先用交互实验观察参数变化，再阅读后面的核心知识点和术语说明。", en: "Use the interactive lab to observe parameter changes before reading the core concepts and terms below.", ja: "まずインタラクティブな実験でパラメーターの変化を観察し、その後で核心概念と用語を読みます。", ko: "먼저 대화형 실험으로 매개변수 변화를 관찰한 뒤 핵심 개념과 용어 설명을 읽습니다." })}</p>
            <button className="diagram-open-button" type="button" onClick={onOpenLab}>
              {detail.lab?.buttonLabel[language]}
            </button>
          </div>
        </section>

        {!isMicrophone && !isConverter && <section className="sound-topic-section">
          <div className="sound-topic-section-heading">
            <div>
              <h2>{localized(language, { zh: "核心知识点", en: "Core concepts", ja: "核心概念", ko: "핵심 개념" })}</h2>
              <p>{localized(language, { zh: "先掌握卡片中的关键判断，再进入术语细节。", en: "Learn the key engineering decisions before going deeper into the terminology.", ja: "用語の細部に進む前に、カードの重要な技術判断を身につけます。", ko: "용어의 세부 사항으로 들어가기 전에 카드의 핵심 기술 판단을 익힙니다." })}</p>
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

        {isConverter ? <ConverterGuide language={language} /> : isMicrophone ? microphoneSections.map((section, index) => (
          <section id={index === 0 ? "mic-selection" : "mic-interface"} tabIndex={-1} className="sound-topic-section microphone-topic-section" key={section.title.en}>
            <div className="microphone-topic-section-intro">
              <h2>{section.title[language]}</h2>
              <p>{section.description[language]}</p>
            </div>
            <ul className="microphone-topic-points">
              {section.points.map((point) => <li key={point.en}>{point[language]}</li>)}
            </ul>
            {index === 0 && <>
              <MicrophoneAnatomy language={language} />
            </>}
          </section>
        )) : <section className="sound-topic-section">
          <div className="sound-topic-section-heading">
            <div>
              <h2>{localized(language, { zh: "术语与参数词典", en: "Terms and parameters", ja: "用語とパラメーター", ko: "용어와 매개변수" })}</h2>
              <p>{localized(language, { zh: "把数据手册里的词汇放回真实信号链中理解。", en: "Place datasheet terms back into the real signal chain.", ja: "データシートの用語を実際の信号経路に戻して理解します。", ko: "데이터시트의 용어를 실제 신호 경로에 놓고 이해합니다." })}</p>
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
            <h2>{localized(language, { zh: "工程边界", en: "Engineering boundary", ja: "技術上の境界", ko: "엔지니어링 경계" })}</h2>
            <p>{detail.misconception[language]}</p>
          </div>
        </section>
      </TopicReadingLayout>
      {relatedTopics}
      <TopicPager language={language} onBack={onBack} onPrevious={onOpenPrevious} onNext={onOpenNext} />
    </main>
  );
}
