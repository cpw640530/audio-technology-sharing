import type { ComponentProps } from "react";
import type { TopicGrid as Browser } from "../components/TopicGrid";
import { interfaceCopy } from "../content/knowledge";

// Article-routing tests bypass 3D gestures; TopicCarousel.test covers the real browser.
export function TopicGrid({ language, topics, onSelectTopic }: ComponentProps<typeof Browser>) {
  return <section aria-labelledby="topics-heading">
    <h2 id="topics-heading">{interfaceCopy.topicsTitle[language]}</h2>
    <div data-testid="topic-grid">
      {topics.length ? topics.map(topic => <button
        key={topic.title.en}
        id={`topic-${topic.category.id}-${encodeURIComponent(topic.title.en)}`}
        onClick={() => onSelectTopic(topic)}
      >
        <span>{topic.category.title[language]}</span>
        <h3>{topic.title[language]}</h3>
        <p>{topic.summary[language]}</p>
      </button>) : interfaceCopy.noResults[language]}
    </div>
  </section>;
}
