import { ArrowUpRight } from "lucide-react";
import type { Category, Language, Topic } from "../content/knowledge";
import { interfaceCopy } from "../content/knowledge";

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
          {topics.map((topic) => (
            <button
              aria-pressed={selectedTopicKey === `${topic.category.id}-${topic.title.en}`}
              className="topic-card"
              id={getTopicElementId(topic.category.id, topic.title.en)}
              key={`${topic.category.id}-${topic.title.en}`}
              onClick={() => onSelectTopic(topic)}
              style={{ "--accent": topic.category.accent } as React.CSSProperties}
              type="button"
            >
              <div className="topic-card-topline">
                <div className="topic-meta">{topic.category.title[language]}</div>
                <ArrowUpRight size={18} aria-hidden="true" />
              </div>
              <h3>{topic.title[language]}</h3>
              <p>{topic.summary[language]}</p>
              <span className="topic-card-entry">{language === "zh" ? "阅读与探索" : "Read and explore"}<ArrowUpRight size={16} aria-hidden="true" /></span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
