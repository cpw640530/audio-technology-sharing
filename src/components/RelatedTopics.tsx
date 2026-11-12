import { traditional } from "../content/traditional";
import { ArrowRight } from "lucide-react";
import { categories, type Category, type Language, type Topic } from "../content/knowledge";
import { getTopicKey, relatedTopics, type TopicKey } from "../content/relatedTopics";
import { topicLearning } from "../content/topicLearning";
import { isPlainNavigation, topicHref } from "../content/topicRoutes";
import { text } from "../content/language";

const topics = categories.flatMap(category => category.topics.map(topic => ({ ...topic, category })));

export function RelatedTopics({ topicKey, language, onOpen }: {
  topicKey: TopicKey;
  language: Language;
  onOpen: (topic: Topic & { category: Category }) => void;
}) {
  const learning = topicLearning[topicKey];
  const readings = [
    { target: learning.next, reason: learning.transition },
    ...relatedTopics[topicKey].filter(relation => relation.target !== learning.next)
  ];
  return (
    <section className="related-topics" aria-labelledby="related-topics-title">
      <h2 id="related-topics-title">{{ zh: "相关知识", "zh-Hant": traditional("相关知识"), en: "Related knowledge", ja: "関連知識", ko: "관련 지식" }[language]}</h2>
      <ul>
        {readings.map((relation, index) => {
          const target = topics.find(topic => getTopicKey(topic) === relation.target);
          if (!target) return null;
          return (
            <li key={relation.target} className={index === 0 ? "topic-next-reading" : undefined}>
              {index === 0 && <strong>{text(language, "下一步看什么", "Read next", "次に読む内容", "다음에 읽을 내용")}</strong>}
              <a href={topicHref(target)} onClick={event => { if (!isPlainNavigation(event)) return; event.preventDefault(); onOpen(target); }}>
                <span>{target.title[language]}</span>
                <ArrowRight size={17} aria-hidden="true" />
              </a>
              <p>{relation.reason[language]}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
