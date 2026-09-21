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
  onOpenAudioCodecLab: () => void;
  onOpenAudioUnitsLab: () => void;
  onOpenAutomotiveAudioLab: () => void;
  onOpenRobotAudioLab: () => void;
  onOpenBluetoothAudioLab: () => void;
  onOpenCodecLab: () => void;
  onOpenCoreSignalProcessingLab: () => void;
  onOpenDigitalLab: () => void;
  onOpenDigitalInterfaceLab: () => void;
  onOpenIotContentLab: () => void;
  onOpenListeningMetricsLab: () => void;
  onOpenMeetingCommunicationLab: () => void;
  onOpenMicrophoneLab: () => void;
  onOpenRealtimeAudioLab: () => void;
  onOpenSpeechEnhancementLab: () => void;
  onOpenSoundLab: () => void;
  onOpenSoundTopicPage: () => void;
  onOpenSpatialAudioLab: () => void;
  onOpenSystemAudioLab: () => void;
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
        <text className="diagram-label" x="70" y="48">{language === "zh" ? "A 振幅" : "A amplitude"}</text>
        <line className="diagram-arrow" markerEnd="url(#arrow)" markerStart="url(#arrow)" x1="40" x2="232" y1="236" y2="236" />
        <text className="diagram-label" textAnchor="middle" x="136" y="264">{language === "zh" ? "周期 T（时间）" : "Period T (time)"}</text>
        <text className="diagram-chip" textAnchor="middle" x="136" y="92">{language === "zh" ? "低频：1 周期" : "Low: 1 cycle"}</text>
        <text className="diagram-chip" textAnchor="middle" x="360" y="92">{language === "zh" ? "中频：2 周期" : "Mid: 2 cycles"}</text>
        <text className="diagram-chip" textAnchor="middle" x="584" y="92">{language === "zh" ? "高频：4 周期" : "High: 4 cycles"}</text>
        <text className="diagram-label" x="46" y="22">{language === "zh" ? "Δp 声压变化" : "Δp pressure"}</text>
        <text className="diagram-label" textAnchor="end" x="680" y="216">{language === "zh" ? "t 时间" : "t time"}</text>
        <text className="diagram-chip" textAnchor="middle" x="520" y="266">{language === "zh" ? "频率改变，振幅保持相同" : "Frequency changes; amplitude stays equal"}</text>
      </svg>
      <ol className="sound-signal-chain" aria-label={language === "zh" ? "声音转为 PCM 的流程" : "Sound-to-PCM flow"}>
        {(language === "zh"
          ? ["声源振动", "空气声压 Δp", "麦克风电压", "ADC 采样量化", "PCM 样本"]
          : ["Source vibration", "Air pressure Δp", "Microphone voltage", "ADC sampling", "PCM samples"]
        ).map((step) => <li key={step}>{step}</li>)}
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
  onOpenAudioCodecLab,
  onOpenAudioUnitsLab,
  onOpenAutomotiveAudioLab,
  onOpenRobotAudioLab,
  onOpenBluetoothAudioLab,
  onOpenCodecLab,
  onOpenCoreSignalProcessingLab,
  onOpenDigitalLab,
  onOpenDigitalInterfaceLab,
  onOpenIotContentLab,
  onOpenListeningMetricsLab,
  onOpenMeetingCommunicationLab,
  onOpenMicrophoneLab,
  onOpenRealtimeAudioLab,
  onOpenSpeechEnhancementLab,
  onOpenSoundLab,
  onOpenSoundTopicPage,
  onOpenSpatialAudioLab,
  onOpenSystemAudioLab
}: TopicDetailsProps) {
  const isSoundTopic = topic.detail.lab?.type === "sound-wave";

  function closeDetails() {
    onClose();
  }

  function openTopicLab() {
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

    if (topic.detail.lab?.type === "codec-hardware") {
      onOpenCodecLab();
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

    if (topic.detail.lab?.type === "system-audio") {
      onOpenSystemAudioLab();
      return;
    }

    if (topic.detail.lab?.type === "alsa") {
      onOpenAlsaLab();
      return;
    }

    if (topic.detail.lab?.type === "audio-codec") {
      onOpenAudioCodecLab();
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

    if (topic.detail.lab?.type === "meeting-communication") {
      onOpenMeetingCommunicationLab();
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

    if (topic.detail.lab?.type === "iot-content") {
      onOpenIotContentLab();
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
          {!isSoundTopic ? <div className="details-block details-block-emphasis">
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
                  {isSoundTopic ? (
                    <button className="diagram-open-button diagram-open-button-secondary" type="button" onClick={onOpenSoundTopicPage}>
                      {language === "zh" ? "阅读详细内容" : "Read detailed content"}
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
            <h3>{language === "zh" ? "关键知识点" : "Key points"}</h3>
            <ul>
              {topic.bullets.map((bullet) => (
                <li key={bullet.en}>{bullet[language]}</li>
              ))}
            </ul>
          </div>
          {!isSoundTopic && topic.detail.termExplanations ? (
            <div className="details-block">
              <h3>{interfaceCopy.detailsRelatedTermsTitle[language]}</h3>
              <div className="term-grid">
                {(isSoundTopic ? topic.detail.termExplanations.slice(0, 4) : topic.detail.termExplanations).map((term) => (
                  <article className="term-card" key={term.name.en}>
                    <h4>{term.name[language]}</h4>
                    <p>{term.explanation[language]}</p>
                  </article>
                ))}
              </div>
            </div>
          ) : null}
          {!isSoundTopic ? <div className="details-block">
            <h3>{interfaceCopy.detailsConceptsTitle[language]}</h3>
            <ul>
              {topic.detail.keyConcepts.map((concept) => (
                <li key={concept.en}>{concept[language]}</li>
              ))}
            </ul>
          </div> : null}
          {!isSoundTopic && topic.detail.diagram ? (
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
          {!isSoundTopic ? <div className="details-block">
            <h3>{interfaceCopy.detailsMisconceptionTitle[language]}</h3>
            <p>{topic.detail.misconception[language]}</p>
          </div> : null}
          {!isSoundTopic ? <div className="details-block">
            <h3>{interfaceCopy.detailsContentDirectionTitle[language]}</h3>
            <p>{topic.detail.contentDirection[language]}</p>
          </div> : null}
          {!isSoundTopic ? <div className="details-formats">
            <span>{interfaceCopy.detailsFormatTitle[language]}</span>
            <strong>{interfaceCopy.detailsFormats[language]}</strong>
          </div> : null}
        </div>
      </section>
    </div>
  );
}
