import { lazy, Suspense } from "react";
import type { Category, Language, Topic } from "../content/knowledge";
import { interfaceCopy } from "../content/knowledge";
import { text } from "../content/language";

const TopicCarousel = lazy(() => import("./TopicCarousel"));

export type DisplayTopic = Topic & { category: Category };

type TopicGridProps = {
  language: Language;
  topics: DisplayTopic[];
  onSelectTopic: (topic: DisplayTopic) => void;
};

export function TopicGrid({ language, topics, onSelectTopic }: TopicGridProps) {
  return (
    <section className="section-block" aria-labelledby="topics-heading">
      <div className="section-heading">
        <div>
          <h2 id="topics-heading">{interfaceCopy.topicsTitle[language]}</h2>
          <p>{interfaceCopy.topicsSubtitle[language]}</p>
        </div>
        <span className="result-count">{topics.length}</span>
      </div>
      <div data-testid="topic-grid">
        {topics.length === 0 ? (
          <div className="empty-state">{interfaceCopy.noResults[language]}</div>
        ) : (
          <Suspense fallback={<p role="status">{text(language, "正在加载", "Loading", "読み込み中", "불러오는 중")}</p>}>
            <TopicCarousel language={language} topics={topics} onSelectTopic={onSelectTopic} />
          </Suspense>
        )}
      </div>
    </section>
  );
}
