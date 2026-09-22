import { ArrowUpRight, Waves, Ruler, AudioLines, Ear, Mic, Cpu, Cable, Speaker, Layers, Terminal, FileAudio, Timer, SlidersHorizontal, MicVocal, Orbit, Users, Car, Bot, Radio, Bluetooth, BrainCircuit } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Category, Language, Topic, TopicLab } from "../content/knowledge";
import { interfaceCopy } from "../content/knowledge";

const topicIcons: Record<TopicLab["type"], LucideIcon> = {
  "sound-wave": Waves,
  "audio-units": Ruler,
  "sampling-quantization": AudioLines,
  "listening-metrics": Ear,
  microphone: Mic,
  "codec-hardware": Cpu,
  "digital-interface": Cable,
  "amplifier-speaker": Speaker,
  "system-audio": Layers,
  alsa: Terminal,
  "audio-codec": FileAudio,
  "realtime-audio": Timer,
  "core-signal-processing": SlidersHorizontal,
  "speech-enhancement": MicVocal,
  "spatial-audio": Orbit,
  "meeting-communication": Users,
  "automotive-audio": Car,
  "robot-audio": Bot,
  "iot-content": Radio,
  "bluetooth-audio": Bluetooth,
  "ai-audio": BrainCircuit
};

type DisplayTopic = Topic & {
  category: Category;
};

type TopicGridProps = {
  language: Language;
  topics: DisplayTopic[];
  selectedTopicKey?: string;
  onSelectTopic: (topic: DisplayTopic) => void;
};

export function getTopicElementId(categoryId: string, title: string) {
  return `topic-${categoryId}-${encodeURIComponent(title)}`;
}

export function TopicGrid({ language, topics, selectedTopicKey, onSelectTopic }: TopicGridProps) {
  return (
    <section className="section-block" aria-labelledby="topics-heading">
      <div className="section-heading">
        <div>
          <h2 id="topics-heading">{interfaceCopy.topicsTitle[language]}</h2>
          <p>{interfaceCopy.topicsSubtitle[language]}</p>
        </div>
        <span className="result-count">{topics.length}</span>
      </div>
      {topics.length === 0 ? (
        <div className="empty-state">{interfaceCopy.noResults[language]}</div>
      ) : (
        <div className="topic-grid" data-testid="topic-grid">
          {topics.map((topic) => {
            const Icon = topic.detail.lab ? topicIcons[topic.detail.lab.type] : topic.category.icon;
            return (
            <button
              aria-pressed={selectedTopicKey === `${topic.category.id}-${topic.title.en}`}
              className="topic-card"
              data-guide={topic.category.id === "fundamentals" ? topic.detail.lab?.type : undefined}
              id={getTopicElementId(topic.category.id, topic.title.en)}
              key={`${topic.category.id}-${topic.title.en}`}
              onClick={() => onSelectTopic(topic)}
              style={{ "--accent": topic.category.accent } as React.CSSProperties}
              type="button"
            >
              <div className="topic-card-topline">
                <Icon className="topic-guide-icon" size={24} aria-hidden="true" />
                <div className="topic-meta">{topic.category.title[language]}</div>
                <ArrowUpRight size={18} aria-hidden="true" />
              </div>
              <h3>{topic.title[language]}</h3>
              <p>{topic.summary[language]}</p>
              <span className="topic-card-entry">{language === "zh" ? "阅读与探索" : "Read and explore"}<ArrowUpRight size={16} aria-hidden="true" /></span>
            </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
