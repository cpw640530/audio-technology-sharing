import { traditional } from "../content/traditional";
import { text } from "../content/language";
import type { ReactNode } from "react";
import { TopicReadingLayout } from "./TopicReadingLayout";
import { ArrowLeft, BookOpen, CircuitBoard } from "lucide-react";
import type { Category, Language, LocalizedText, Topic } from "../content/knowledge";
import { TopicPager } from "./TopicPager";

type DisplayTopic = Topic & { category: Category };

type AlsaPageProps = {
  relatedTopics?: ReactNode;
  language: Language;
  topic: DisplayTopic;
  onBack: () => void;
  onOpenLab: () => void;
  onOpenPrevious?: () => void;
  onOpenNext?: () => void;
};

const frameworkLayers: Array<{
  id: string;
  label: LocalizedText;
  nodes: Array<{ title: LocalizedText; detail: LocalizedText }>;
  handoff?: LocalizedText;
}> = [
  {
    id: "user",
    label: { zh: "用户态", "zh-Hant": traditional("用户态"), en: "User space", ja: "ユーザー空間", ko: "사용자 공간" },
    nodes: [
      { title: { zh: "应用程序", "zh-Hant": traditional("应用程序"), en: "Applications", ja: "アプリケーション", ko: "애플리케이션" }, detail: { zh: "播放器 / 录音 / 通话", "zh-Hant": traditional("播放器 / 录音 / 通话"), en: "playback / capture / calls", ja: "再生 / 収録 / 通話", ko: "재생 / 캡처 / 통화" } },
      { title: { zh: "可选音频服务", "zh-Hant": traditional("可选音频服务"), en: "Optional audio server", ja: "任意の音声サーバー", ko: "선택적 오디오 서버" }, detail: { zh: "PipeWire / PulseAudio / JACK", "zh-Hant": traditional("PipeWire / PulseAudio / JACK"), en: "PipeWire / PulseAudio / JACK", ja: "PipeWire / PulseAudio / JACK", ko: "PipeWire / PulseAudio / JACK" } },
      { title: { zh: "alsa-lib", "zh-Hant": traditional("alsa-lib"), en: "alsa-lib", ja: "alsa-lib", ko: "alsa-lib" }, detail: { zh: "PCM API + Control API", "zh-Hant": traditional("PCM API + Control API"), en: "PCM API + Control API", ja: "PCM API + Control API", ko: "PCM API + Control API" } },
      { title: { zh: "PCM 插件", "zh-Hant": traditional("PCM 插件"), en: "PCM plugins", ja: "PCM プラグイン", ko: "PCM 플러그인" }, detail: { zh: "hw / plughw / default / dmix", "zh-Hant": traditional("hw / plughw / default / dmix"), en: "hw / plughw / default / dmix", ja: "hw / plughw / default / dmix", ko: "hw / plughw / default / dmix" } }
    ],
    handoff: { zh: "系统调用 / ioctl / mmap", "zh-Hant": traditional("系统调用 / ioctl / mmap"), en: "system calls / ioctl / mmap", ja: "システムコール / ioctl / mmap", ko: "시스템 호출 / ioctl / mmap" }
  },
  {
    id: "kernel",
    label: { zh: "内核 ALSA", "zh-Hant": traditional("内核 ALSA"), en: "Kernel ALSA", ja: "カーネル ALSA", ko: "커널 ALSA" },
    nodes: [
      { title: { zh: "ALSA Core", "zh-Hant": traditional("ALSA Core"), en: "ALSA Core", ja: "ALSA Core", ko: "ALSA Core" }, detail: { zh: "声卡注册、状态与公共接口", "zh-Hant": traditional("声卡注册、状态与公共接口"), en: "card registration, state, common APIs", ja: "カード登録・状態・共通 API", ko: "사운드 카드 등록·상태·공통 API" } },
      { title: { zh: "PCM 子系统", "zh-Hant": traditional("PCM 子系统"), en: "PCM subsystem", ja: "PCM サブシステム", ko: "PCM 서브시스템" }, detail: { zh: "音频帧、buffer、period、XRUN", "zh-Hant": traditional("音频帧、buffer、period、XRUN"), en: "frames, buffer, period, XRUN", ja: "フレーム・buffer・period・XRUN", ko: "프레임·buffer·period·XRUN" } },
      { title: { zh: "Control 子系统", "zh-Hant": traditional("Control 子系统"), en: "Control subsystem", ja: "Control サブシステム", ko: "Control 서브시스템" }, detail: { zh: "音量、静音、路由与开关", "zh-Hant": traditional("音量、静音、路由与开关"), en: "volume, mute, routes, switches", ja: "音量・ミュート・経路・スイッチ", ko: "음량·음소거·경로·스위치" } }
    ],
    handoff: { zh: "驱动回调 / 参数约束 / 中断", "zh-Hant": traditional("驱动回调 / 参数约束 / 中断"), en: "driver callbacks / constraints / interrupts", ja: "ドライバーのコールバック / 制約 / 割り込み", ko: "드라이버 콜백 / 제약 / 인터럽트" }
  },
  {
    id: "driver",
    label: { zh: "设备驱动", "zh-Hant": traditional("设备驱动"), en: "Device drivers", ja: "デバイスドライバー", ko: "장치 드라이버" },
    nodes: [
      { title: { zh: "PC / USB 驱动", "zh-Hant": traditional("PC / USB 驱动"), en: "PC / USB drivers", ja: "PC / USB ドライバー", ko: "PC / USB 드라이버" }, detail: { zh: "PCI、USB 等声卡驱动", "zh-Hant": traditional("PCI、USB 等声卡驱动"), en: "PCI, USB, and other sound drivers", ja: "PCI・USB などの音声ドライバー", ko: "PCI, USB 등의 사운드 드라이버" } },
      { title: { zh: "嵌入式 ASoC", "zh-Hant": traditional("嵌入式 ASoC"), en: "Embedded ASoC", ja: "組み込み ASoC", ko: "임베디드 ASoC" }, detail: { zh: "Machine + Platform / CPU DAI", "zh-Hant": traditional("Machine + Platform / CPU DAI"), en: "Machine + Platform / CPU DAI", ja: "Machine + Platform / CPU DAI", ko: "Machine + Platform / CPU DAI" } },
      { title: { zh: "Codec 驱动", "zh-Hant": traditional("Codec 驱动"), en: "Codec driver", ja: "Codec ドライバー", ko: "Codec 드라이버" }, detail: { zh: "Codec DAI、Mixer、DAPM", "zh-Hant": traditional("Codec DAI、Mixer、DAPM"), en: "Codec DAI, Mixer, DAPM", ja: "Codec DAI・Mixer・DAPM", ko: "Codec DAI, Mixer, DAPM" } }
    ],
    handoff: { zh: "寄存器 / DMA / 音频总线", "zh-Hant": traditional("寄存器 / DMA / 音频总线"), en: "registers / DMA / audio buses", ja: "レジスター / DMA / 音声バス", ko: "레지스터 / DMA / 오디오 버스" }
  },
  {
    id: "hardware",
    label: { zh: "硬件", "zh-Hant": traditional("硬件"), en: "Hardware", ja: "ハードウェア", ko: "하드웨어" },
    nodes: [
      { title: { zh: "USB / PCI 声卡", "zh-Hant": traditional("USB / PCI 声卡"), en: "USB / PCI audio", ja: "USB / PCI 音声", ko: "USB / PCI 오디오" }, detail: { zh: "独立设备路径", "zh-Hant": traditional("独立设备路径"), en: "discrete device path", ja: "独立機器の経路", ko: "독립 장치 경로" } },
      { title: { zh: "SoC 音频控制器", "zh-Hant": traditional("SoC 音频控制器"), en: "SoC audio controller", ja: "SoC 音声コントローラー", ko: "SoC 오디오 컨트롤러" }, detail: { zh: "DMA + I2S / TDM / PDM", "zh-Hant": traditional("DMA + I2S / TDM / PDM"), en: "DMA + I2S / TDM / PDM", ja: "DMA + I2S / TDM / PDM", ko: "DMA + I2S / TDM / PDM" } },
      { title: { zh: "Codec 与换能器", "zh-Hant": traditional("Codec 与换能器"), en: "Codec and transducers", ja: "Codec と変換器", ko: "Codec 및 변환기" }, detail: { zh: "麦克风 → ADC；DAC → 功放 → 扬声器", "zh-Hant": traditional("麦克风 → ADC；DAC → 功放 → 扬声器"), en: "mic → ADC; DAC → amp → speaker", ja: "マイク → ADC；DAC → アンプ → スピーカー", ko: "마이크 → ADC; DAC → 앰프 → 스피커" } }
    ]
  }
];

export function AlsaPage({ relatedTopics, language, topic, onBack, onOpenLab, onOpenPrevious, onOpenNext }: AlsaPageProps) {
  const detail = topic.detail;
  const terms = detail.termExplanations ?? [];

  return (
    <main className="sound-topic-page alsa-topic-page" aria-labelledby="alsa-topic-title">
      <header className="sound-topic-hero">
        <button className="sound-topic-back" type="button" onClick={onBack}>
          <ArrowLeft size={17} aria-hidden="true" />
          {text(language, "返回知识库", "Back to knowledge base", "知識ベースに戻る", "지식 모음으로 돌아가기")}
        </button>
        <div className="sound-topic-kicker">
          <BookOpen size={16} aria-hidden="true" />
          {text(language, "音频软件 · Linux 专题", "Audio software · Linux deep dive", "音声ソフトウェア · Linux 詳説", "오디오 소프트웨어 · Linux 상세 설명")}
        </div>
        <h1 id="alsa-topic-title">{topic.title[language]}</h1>
        <p className="sound-topic-lede">{topic.summary[language]}</p>
        <div className="sound-topic-meta">
          <span>{text(language, "Linux 音频栈", "Linux audio stack", "Linux 音声スタック", "Linux 오디오 스택")}</span>
          <span>{text(language, "PCM 数据路径", "PCM data path", "PCM データ経路", "PCM 데이터 경로")}</span>
          <span>{text(language, "实验验证", "Hands-on lab", "実験で確認", "실험으로 확인")}</span>
        </div>
      </header>

      <TopicReadingLayout language={language}>
        <section className="sound-topic-section sound-topic-intro">
          <div>
            <h2>{text(language, "先定位 ALSA", "Place ALSA first", "まず ALSA の位置付けを理解する", "먼저 ALSA의 역할 파악")}</h2>
            <p>{detail.explanation[language]}</p>
          </div>
        </section>

        {detail.chainContext ? (
          <section className="details-chain-context hardware-chain-context" aria-label={text(language, "ALSA 在音频链路中的位置", "Where ALSA fits in the audio chain", "音声経路内での ALSA の位置", "오디오 경로에서 ALSA의 위치")}>
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
          <h2>{text(language, "Linux ALSA 分层框架", "Linux ALSA layers", "Linux ALSA の階層", "Linux ALSA 계층")}</h2>
        <figure className="alsa-framework-figure" aria-labelledby="alsa-framework-title">
          <div className="alsa-framework-heading">
            <div>
              <span className="section-kicker">Linux ALSA</span>
              <h3 id="alsa-framework-title">{text(language, "Linux ALSA 分层框架图", "Linux ALSA layered framework", "Linux ALSA の階層構造", "Linux ALSA 계층 구조")}</h3>
            </div>
            <div className="alsa-framework-legend" aria-label={text(language, "通路图例", "Path legend", "経路の凡例", "경로 범례")}>
              <span><i className="alsa-framework-key pcm" />{text(language, "PCM 数据", "PCM data", "PCM データ", "PCM 데이터")}</span>
              <span><i className="alsa-framework-key control" />{text(language, "Control 控制", "Control path", "制御経路", "제어 경로")}</span>
            </div>
          </div>
          <div
            className="alsa-framework-diagram"
            role="img"
            aria-label={text(language, "Linux ALSA 分层框架图", "Linux ALSA layered framework diagram", "Linux ALSA の階層構造図", "Linux ALSA 계층 구조도")}
          >
            {frameworkLayers.map((layer) => (
              <div className="alsa-framework-stage" key={layer.id}>
                <div className={`alsa-framework-layer-label ${layer.id}`}>{layer.label[language]}</div>
                <div className="alsa-framework-nodes">
                  {layer.nodes.map((node) => (
                    <div className={`alsa-framework-node ${layer.id}`} key={node.title.en}>
                      <strong>{node.title[language]}</strong>
                      <span>{node.detail[language]}</span>
                    </div>
                  ))}
                </div>
                {layer.handoff ? (
                  <div className="alsa-framework-handoff">
                    <span aria-hidden="true">↓</span>
                    <small>{layer.handoff[language]}</small>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
          <figcaption>
            {text(language, "应用可以直接调用 alsa-lib，也可以先经过 PipeWire、PulseAudio 或 JACK；后者是可选上层服务。ASoC 是嵌入式 Linux 常见驱动框架，不是 USB/PCI 声卡的必经路径。", "An application may call alsa-lib directly or use PipeWire, PulseAudio, or JACK first; those are optional higher-level services. ASoC is common in embedded Linux, not a mandatory path for USB or PCI audio.", "アプリは alsa-lib を直接呼び出すか、任意の上位サービスである PipeWire、PulseAudio、JACK を経由します。ASoC は組み込み Linux で一般的ですが、USB・PCI 音声で必須の経路ではありません。", "앱은 alsa-lib를 직접 호출하거나 선택적 상위 서비스인 PipeWire, PulseAudio, JACK을 먼저 사용할 수 있습니다. ASoC는 임베디드 Linux에서 일반적이지만 USB·PCI 오디오의 필수 경로는 아닙니다.")}
          </figcaption>
        </figure>
        <aside className="alsa-embedded-note" aria-label={text(language, "嵌入式 Linux 链路说明", "Embedded Linux path note", "組み込み Linux の経路について", "임베디드 Linux 경로 설명")}>
          <strong>{text(language, "嵌入式 Linux 常见链路", "Common embedded Linux path", "一般的な組み込み Linux の経路", "일반적인 임베디드 Linux 경로")}</strong>
          <p>
            {text(language, "ASoC 通常把 CPU DAI、I2S、Codec DAI、Codec 和功放组合成声卡；DAI 是接口抽象，I2S 是常见协议。这个链路适合解释嵌入式系统，但不是所有 PC 声卡的固定结构。", "ASoC often combines CPU DAI, I2S, codec DAI, codec, and amplifier into a sound card; DAI is an interface abstraction and I2S is a common protocol. This explains embedded systems, not every PC sound card.", "ASoC では CPU DAI、I2S、Codec DAI、Codec、アンプなどを組み合わせてサウンドカードを構成します。DAI はインターフェースの抽象化、I2S は一般的なプロトコルです。これは組み込み系の例で、すべての PC 音声機器に共通ではありません。", "ASoC는 보통 CPU DAI, I2S, Codec DAI, Codec, 앰프를 조합해 사운드 카드를 구성합니다. DAI는 인터페이스 추상화이고 I2S는 일반적인 프로토콜입니다. 이는 임베디드 시스템의 예이며 모든 PC 사운드 카드의 고정 구조가 아닙니다.")}
          </p>
        </aside>
          <p className="sound-topic-note">{text(language, "录音方向相反：硬件产生 PCM，应用读取；Control/Mixer 改变音量和路由，不搬运 PCM 帧。", "Capture reverses the direction: hardware produces PCM and the app reads it; Control/Mixer changes volume and routing without moving PCM frames.", "収録は逆方向です。ハードウェアが PCM を生成し、アプリが読み取ります。Control/Mixer は音量や経路を変えますが PCM フレームを運びません。", "캡처는 반대 방향입니다. 하드웨어가 PCM을 생성하고 앱이 읽습니다. Control/Mixer는 음량과 경로를 바꾸지만 PCM 프레임을 전달하지 않습니다.")}</p>
        </section>

        <section className="sound-topic-section alsa-topic-lab-entry" aria-label={text(language, "ALSA 实验室入口", "ALSA lab entry", "ALSA 実験室の入口", "ALSA 실험실 입구")}>
          <div className="sound-topic-cta">
            <CircuitBoard size={22} aria-hidden="true" />
            <h2>{text(language, "进入 ALSA 实验室", "Open the ALSA lab", "ALSA 実験室へ", "ALSA 실험실 열기")}</h2>
            <p>{text(language, "在交互实验中切换播放、录音、环形 buffer 和 XRUN，观察配置如何影响 PCM 流。", "Use the interactive lab to switch playback, capture, ring buffers, and XRUN handling, then observe how configuration affects the PCM stream.", "実験室で再生・収録・リングバッファー・XRUN 処理を切り替え、設定が PCM ストリームに与える影響を観察します。", "실험실에서 재생, 캡처, 링 버퍼, XRUN 처리를 전환하며 설정이 PCM 스트림에 주는 영향을 관찰하세요.")}</p>
            <button className="diagram-open-button" type="button" onClick={onOpenLab}>
              {detail.lab?.buttonLabel[language]}
            </button>
          </div>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading">
            <div>
              <h2>{text(language, "核心对象", "Core objects", "主要な構成要素", "핵심 구성 요소")}</h2>
              <p>{text(language, "框架说明 PCM 经过谁，下面的对象说明谁生产、谁消费，以及按什么参数交付；当双方进度不匹配、buffer 耗尽或溢出时，才会发生 XRUN。", "The stack shows where PCM travels; these objects explain who produces and consumes it and how delivery is configured. An XRUN occurs when their progress diverges enough to empty or overflow the buffer.", "階層図は PCM の経路、以下のオブジェクトは生成側・消費側と転送設定を示します。両者の進行差でバッファーが空になるか溢れると XRUN が発生します。", "계층도는 PCM의 경로를, 아래 객체는 생산자와 소비자 및 전달 설정을 보여 줍니다. 양쪽의 진행 차이로 버퍼가 비거나 넘치면 XRUN이 발생합니다.")}</p>
            </div>
          </div>
          <div className="sound-topic-glossary alsa-topic-key-points">
            {detail.keyConcepts.map((concept) => <article key={concept.en}><p>{concept[language]}</p></article>)}
          </div>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading">
            <div>
              <h2>{text(language, "ALSA 术语", "ALSA terms", "ALSA 用語", "ALSA 용어")}</h2>
              <p>{text(language, "把命令和参数放回数据路径中理解，详细数值操作交给实验室。", "Place commands and parameters back into the data path; detailed numeric behavior belongs in the lab.", "コマンドとパラメーターをデータ経路に沿って理解し、数値による挙動は実験室で確認します。", "명령과 매개변수를 데이터 경로 속에서 이해하고 자세한 수치 동작은 실험실에서 확인합니다.")}</p>
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
