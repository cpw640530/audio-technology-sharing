import { ArrowRight } from "lucide-react";
import { categories, type Category, type Language, type Topic } from "../content/knowledge";
import { getTopicKey, relatedTopics, type TopicKey } from "../content/relatedTopics";

const topics = categories.flatMap(category => category.topics.map(topic => ({ ...topic, category })));

export function RelatedTopics({ topicKey, language, onOpen }: {
  topicKey: TopicKey;
  language: Language;
  onOpen: (topic: Topic & { category: Category }) => void;
}) {
  return (
    <section className="related-topics" aria-labelledby="related-topics-title">
      <h2 id="related-topics-title">{language === "zh" ? "相关知识" : "Related knowledge"}</h2>
      <ul>
        {relatedTopics[topicKey].map(relation => {
          const target = topics.find(topic => getTopicKey(topic) === relation.target);
          if (!target) return null;
          return (
            <li key={relation.target}>
              <button type="button" onClick={() => onOpen(target)}>
                <span>{target.title[language]}</span>
                <ArrowRight size={17} aria-hidden="true" />
              </button>
              <p>{relation.reason[language]}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
