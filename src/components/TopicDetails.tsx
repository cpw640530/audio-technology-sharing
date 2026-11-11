import { traditional } from "../content/traditional";
import { X } from "lucide-react";
import type { AiAudioLabId, Category, Language, Topic } from "../content/knowledge";
import { interfaceCopy } from "../content/knowledge";

type DisplayTopic = Topic & {
  category: Category;
};

type TopicDetailsProps = {
  language: Language;
  topic: DisplayTopic;
  onClose: () => void;
  onOpenAmplifierSpeakerLab: () => void;
  onOpenAlsaLab: () => void;
  onOpenAiAudioLab: (initialMode?: AiAudioLabId) => void;
  onOpenAudioUnitsLab: () => void;
  onOpenAudioUnitsPage: () => void;
  onOpenAutomotiveAudioLab: () => void;
  onOpenRobotAudioLab: () => void;
  onOpenBluetoothAudioLab: () => void;
  onOpenCoreSignalProcessingLab: () => void;
  onOpenDigitalLab: () => void;
  onOpenDigitalPage: () => void;
  onOpenDigitalInterfaceLab: () => void;
  onOpenListeningMetricsLab: () => void;
  onOpenListeningMetricsPage: () => void;
  onOpenMicrophoneLab: () => void;
  onOpenRealtimeAudioLab: () => void;
  onOpenSpeechEnhancementLab: () => void;
  onOpenSoundLab: () => void;
  onOpenWaveSpectrumLab: () => void;
  onOpenSoundTopicPage: () => void;
  onOpenSpatialAudioLab: () => void;
};

export function SoundWaveDiagram({
  language,
  label,
  caption
}: {
  language: Language;
  label: Record<Language, string>;
  caption: Record<Language, string>;
}) {
  function createWavePath(startRatio: number, endRatio: number, cycles: number) {
    const startX = 40;
    const width = 640;
    const centerY = 110;
    const amplitude = 52;

    return Array.from({ length: 72 }, (_, index) => {
      const ratio = index / 71;
      const progress = startRatio + ratio * (endRatio - startRatio);
      const x = startX + progress * width;
      const y = centerY - Math.sin(ratio * Math.PI * 2 * cycles) * amplitude;

      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    }).join(" ");
  }

  return (
    <figure className="sound-wave-diagram">
      <svg
        aria-label={label[language]}
        role="img"
        viewBox="0 0 720 300"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="waveLine" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#7ee7d8" />
            <stop offset="100%" stopColor="#f0b46a" />
          </linearGradient>
          <marker id="arrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
            <path d="M0 0 8 4 0 8Z" fill="#dcece8" />
          </marker>
        </defs>
        <rect className="diagram-bg" height="300" rx="14" width="720" />
        <line className="diagram-axis" x1="40" x2="680" y1="110" y2="110" />
        <line className="diagram-axis faint" x1="40" x2="680" y1="28" y2="28" />
        <line className="diagram-axis faint" x1="40" x2="680" y1="192" y2="192" />
        <path className="diagram-wave diagram-wave-low" data-amplitude="52" data-cycles="1" data-testid="sound-wave-low" d={createWavePath(0, 0.3, 1)} />
        <path className="diagram-wave diagram-wave-mid" data-amplitude="52" data-cycles="2" data-testid="sound-wave-mid" d={createWavePath(0.35, 0.65, 2)} />
        <path className="diagram-wave diagram-wave-high" data-amplitude="52" data-cycles="4" data-testid="sound-wave-high" d={createWavePath(0.7, 1, 4)} />
        <line
          className="diagram-measure"
          x1="92"
          x2="92"
          y1="60"
          y2="110"
        />
        <text className="diagram-label" x="70" y="48">{({zh:"A 振幅", "zh-Hant": traditional("A 振幅"),en:"A amplitude",ja:"A 振幅",ko:"A 진폭"})[language]}</text>
        <line className="diagram-arrow" markerEnd="url(#arrow)" markerStart="url(#arrow)" x1="40" x2="232" y1="236" y2="236" />
        <text className="diagram-label" textAnchor="middle" x="136" y="264">{({zh:"周期 T（时间）", "zh-Hant": traditional("周期 T（时间）"),en:"Period T (time)",ja:"周期 T（時間）",ko:"주기 T (시간)"})[language]}</text>
        <text className="diagram-chip" textAnchor="middle" x="136" y="92">{({zh:"低频：1 周期", "zh-Hant": traditional("低频：1 周期"),en:"Low: 1 cycle",ja:"低周波：1 周期",ko:"저주파: 1주기"})[language]}</text>
        <text className="diagram-chip" textAnchor="middle" x="360" y="92">{({zh:"中频：2 周期", "zh-Hant": traditional("中频：2 周期"),en:"Mid: 2 cycles",ja:"中周波：2 周期",ko:"중간 주파수: 2주기"})[language]}</text>
        <text className="diagram-chip" textAnchor="middle" x="584" y="92">{({zh:"高频：4 周期", "zh-Hant": traditional("高频：4 周期"),en:"High: 4 cycles",ja:"高周波：4 周期",ko:"고주파: 4주기"})[language]}</text>
        <text className="diagram-label" x="46" y="22">{({zh:"Δp 声压变化", "zh-Hant": traditional("Δp 声压变化"),en:"Δp pressure",ja:"Δp 音圧変化",ko:"Δp 음압 변화"})[language]}</text>
        <text className="diagram-label" textAnchor="end" x="680" y="216">{({zh:"t 时间", "zh-Hant": traditional("t 时间"),en:"t time",ja:"t 時間",ko:"t 시간"})[language]}</text>
        <text className="diagram-chip" textAnchor="middle" x="520" y="266">{({zh:"频率改变，振幅保持相同", "zh-Hant": traditional("频率改变，振幅保持相同"),en:"Frequency changes; amplitude stays equal",ja:"周波数は変化し、振幅は一定",ko:"주파수는 변하고 진폭은 일정"})[language]}</text>
      </svg>
      <ol className="sound-signal-chain" aria-label={({zh:"声音转为 PCM 的流程", "zh-Hant": traditional("声音转为 PCM 的流程"),en:"Sound-to-PCM flow",ja:"音から PCM への流れ",ko:"소리에서 PCM으로의 흐름"})[language]}>
        {({
          zh: ["声源振动", "空气声压 Δp", "麦克风电压", "ADC 采样量化", "PCM 样本"], "zh-Hant": traditional(["声源振动", "空气声压 Δp", "麦克风电压", "ADC 采样量化", "PCM 样本"]),
          en: ["Source vibration", "Air pressure Δp", "Microphone voltage", "ADC sampling", "PCM samples"],
          ja: ["音源の振動", "空気の音圧 Δp", "マイクの電圧", "ADC 標本化・量子化", "PCM サンプル"],
          ko: ["음원의 진동", "공기의 음압 Δp", "마이크 전압", "ADC 샘플링·양자화", "PCM 샘플"]
        })[language].map((step) => <li key={step}>{step}</li>)}
      </ol>
      <figcaption>{caption[language]}</figcaption>
    </figure>
  );
}

export function TopicDetails({
  language,
  topic,
  onClose,
  onOpenAmplifierSpeakerLab,
  onOpenAlsaLab,
  onOpenAiAudioLab,
  onOpenAudioUnitsLab,
  onOpenAudioUnitsPage,
  onOpenAutomotiveAudioLab,
  onOpenRobotAudioLab,
  onOpenBluetoothAudioLab,
  onOpenCoreSignalProcessingLab,
  onOpenDigitalLab,
  onOpenDigitalPage,
  onOpenDigitalInterfaceLab,
  onOpenListeningMetricsLab,
  onOpenListeningMetricsPage,
  onOpenMicrophoneLab,
  onOpenRealtimeAudioLab,
  onOpenSpeechEnhancementLab,
  onOpenSoundLab,
  onOpenWaveSpectrumLab,
  onOpenSoundTopicPage,
  onOpenSpatialAudioLab,
}: TopicDetailsProps) {
  const isSoundTopic = topic.detail.lab?.type === "sound-wave";
  const isAudioUnitsTopic = topic.detail.lab?.type === "audio-units";
  const isDigitalTopic = topic.detail.lab?.type === "sampling-quantization";
  const isListeningTopic = topic.detail.lab?.type === "listening-metrics";
  const isCompactTopic = isSoundTopic || isAudioUnitsTopic || isDigitalTopic || isListeningTopic;

  function closeDetails() {
    onClose();
  }

  function openTopicLab() {
    if (topic.detail.lab?.type === "wave-spectrum") {
      onOpenWaveSpectrumLab();
      return;
    }
    if (topic.detail.lab?.type === "sound-wave") {
      onOpenSoundLab();
      return;
    }

    if (topic.detail.lab?.type === "audio-units") {
      onOpenAudioUnitsLab();
      return;
    }

    if (topic.detail.lab?.type === "sampling-quantization") {
      onOpenDigitalLab();
      return;
    }

    if (topic.detail.lab?.type === "microphone") {
      onOpenMicrophoneLab();
      return;
    }

    if (topic.detail.lab?.type === "digital-interface") {
      onOpenDigitalInterfaceLab();
      return;
    }

    if (topic.detail.lab?.type === "amplifier-speaker") {
      onOpenAmplifierSpeakerLab();
      return;
    }

    if (topic.detail.lab?.type === "alsa") {
      onOpenAlsaLab();
      return;
    }

    if (topic.detail.lab?.type === "realtime-audio") {
      onOpenRealtimeAudioLab();
      return;
    }

    if (topic.detail.lab?.type === "core-signal-processing") {
      onOpenCoreSignalProcessingLab();
      return;
    }

    if (topic.detail.lab?.type === "speech-enhancement") {
      onOpenSpeechEnhancementLab();
      return;
    }

    if (topic.detail.lab?.type === "spatial-audio") {
      onOpenSpatialAudioLab();
      return;
    }

    if (topic.detail.lab?.type === "ai-audio") {
      onOpenAiAudioLab(topic.detail.lab.initialMode);
      return;
    }

    if (topic.detail.lab?.type === "automotive-audio") {
      onOpenAutomotiveAudioLab();
      return;
    }

    if (topic.detail.lab?.type === "robot-audio") {
      onOpenRobotAudioLab();
      return;
    }

    if (topic.detail.lab?.type === "bluetooth-audio") {
      onOpenBluetoothAudioLab();
      return;
    }

    onOpenListeningMetricsLab();
  }

  return (
    <div className="topic-details-layer">
      <button
        aria-label={interfaceCopy.closeDetails[language]}
        className="topic-details-backdrop"
        data-testid="topic-details-backdrop"
        type="button"
        onClick={closeDetails}
      />
      <section
        aria-label={interfaceCopy.detailsLabel[language]}
        aria-modal="true"
        className="topic-details topic-details-modal"
        role="dialog"
        style={{ "--accent": topic.category.accent } as React.CSSProperties}
      >
        <div className="details-header">
          <div>
            <span className="details-category">{topic.category.title[language]}</span>
            <h2>{topic.title[language]}</h2>
          </div>
          <button
            aria-label={interfaceCopy.closeDetails[language]}
            className="details-close"
            type="button"
            onClick={closeDetails}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        <div className="details-scroll">
          <p className="details-summary">{topic.summary[language]}</p>
          {topic.detail.chainContext ? (
            <section className="details-chain-context" aria-label={({zh:"当前模块在音频链路中的位置", "zh-Hant": traditional("当前模块在音频链路中的位置"),en:"Current module in the audio chain",ja:"音声処理経路での位置",ko:"오디오 처리 경로에서의 위치"})[language]}>
              <div className="details-chain-heading">
                <strong>{({zh:"它在整条音频链路中的位置", "zh-Hant": traditional("它在整条音频链路中的位置"),en:"Where this module fits",ja:"このモジュールの役割",ko:"이 모듈의 역할"})[language]}</strong>
                <span>{topic.detail.chainContext.stage[language]}</span>
              </div>
              <div className="details-chain-grid">
                <div><small>{({zh:"输入", "zh-Hant": traditional("输入"),en:"Input",ja:"入力",ko:"입력"})[language]}</small><p>{topic.detail.chainContext.input[language]}</p></div>
                <div><small>{({zh:"本模块输出", "zh-Hant": traditional("本模块输出"),en:"Module output",ja:"モジュールの出力",ko:"모듈 출력"})[language]}</small><p>{topic.detail.chainContext.output[language]}</p></div>
                <div><small>{({zh:"下一站", "zh-Hant": traditional("下一站"),en:"Next",ja:"次の段階",ko:"다음 단계"})[language]}</small><p>{topic.detail.chainContext.next[language]}</p></div>
              </div>
            </section>
          ) : null}
          {!isCompactTopic ? <div className="details-block details-block-emphasis">
            <h3>{interfaceCopy.detailsExplanationTitle[language]}</h3>
            <p>{topic.detail.explanation[language]}</p>
          </div> : null}
          {topic.detail.lab ? (
            <div className="details-block details-lab-block">
              <div className="sound-lab-entry">
                <div>
                  <strong>{topic.detail.lab.title[language]}</strong>
                  <p>{topic.detail.lab.description[language]}</p>
                </div>
                <div className="sound-lab-entry-actions">
                  {isCompactTopic ? (
                    <button
                      className="diagram-open-button diagram-open-button-secondary"
                      type="button"
                      onClick={isSoundTopic
                        ? onOpenSoundTopicPage
                        : isAudioUnitsTopic
                          ? onOpenAudioUnitsPage
                          : isDigitalTopic
                            ? onOpenDigitalPage
                            : onOpenListeningMetricsPage}
                    >
                      {({zh:"阅读详细内容", "zh-Hant": traditional("阅读详细内容"),en:"Read detailed content",ja:"詳細を読む",ko:"상세 내용 읽기"})[language]}
                    </button>
                  ) : null}
                  <button className="diagram-open-button" type="button" onClick={openTopicLab}>
                    {topic.detail.lab.buttonLabel[language]}
                  </button>
                </div>
              </div>
            </div>
          ) : null}
          <div className="details-block">
            <h3>{({zh:"关键知识点", "zh-Hant": traditional("关键知识点"),en:"Key points",ja:"重要なポイント",ko:"핵심 지식"})[language]}</h3>
            <ul>
              {topic.bullets.map((bullet) => (
                <li key={bullet.en}>{bullet[language]}</li>
              ))}
            </ul>
          </div>
          {!isCompactTopic && topic.detail.termExplanations ? (
            <div className="details-block">
              <h3>{interfaceCopy.detailsRelatedTermsTitle[language]}</h3>
              <div className="term-grid">
                {topic.detail.termExplanations.map((term) => (
                  <article className="term-card" key={term.name.en}>
                    <h4>{term.name[language]}</h4>
                    <p>{term.explanation[language]}</p>
                  </article>
                ))}
              </div>
            </div>
          ) : null}
          {!isCompactTopic ? <div className="details-block">
            <h3>{interfaceCopy.detailsConceptsTitle[language]}</h3>
            <ul>
              {topic.detail.keyConcepts.map((concept) => (
                <li key={concept.en}>{concept[language]}</li>
              ))}
            </ul>
          </div> : null}
          {!isCompactTopic && topic.detail.diagram ? (
            <div className="details-block details-diagram-block">
              <h3>{interfaceCopy.detailsDiagramTitle[language]}</h3>
              {topic.detail.diagram.type === "sound-wave" ? (
                <SoundWaveDiagram
                  caption={topic.detail.diagram.caption}
                  label={topic.detail.diagram.label}
                  language={language}
                />
              ) : null}
            </div>
          ) : null}
          {!isCompactTopic ? <div className="details-block">
            <h3>{interfaceCopy.detailsMisconceptionTitle[language]}</h3>
            <p>{topic.detail.misconception[language]}</p>
          </div> : null}
          {!isCompactTopic ? <div className="details-block">
            <h3>{interfaceCopy.detailsContentDirectionTitle[language]}</h3>
            <p>{topic.detail.contentDirection[language]}</p>
          </div> : null}
          {!isCompactTopic ? <div className="details-formats">
            <span>{interfaceCopy.detailsFormatTitle[language]}</span>
            <strong>{interfaceCopy.detailsFormats[language]}</strong>
          </div> : null}
        </div>
      </section>
    </div>
  );
}
