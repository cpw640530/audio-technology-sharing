import type { Language } from "../content/knowledge";
import type { TopicKey } from "../content/relatedTopics";
import { text } from "../content/language";
import { topicHref, topicRoutes } from "../content/topicRoutes";
import { topicLearning } from "../content/topicLearning";

export function TopicLearningGuide({ topicKey, language, lab = false }: {
  topicKey: TopicKey; language: Language; lab?: boolean;
}) {
  const learning = topicLearning[topicKey];
  const prerequisite = topicRoutes.find(entry => entry.key === learning.prerequisite);
  const t = (zh: string, en: string, ja: string, ko: string) => text(language, zh, en, ja, ko);
  if (lab) return learning.labTask ? <aside className="topic-learning-lab" aria-label={t("实验目标", "Experiment goal", "実験の目標", "실험 목표")}>
    <strong>{t("本次验证", "Investigate", "今回の検証", "이번 검증")}</strong>
    <p>{learning.labTask[language]}</p>
  </aside> : null;
  return <aside className="topic-learning-guide" aria-label={t("阅读起点与目标", "Reading prerequisites and goal", "読む前の知識と目標", "읽기 전 지식과 목표")}>
    <dl>
      <div>
        <dt>{t("先了解什么", "Before reading", "先に知ること", "먼저 알 것")}</dt>
        <dd>{prerequisite && <a href={topicHref(prerequisite.key)}>{prerequisite.topic.title[language]}</a>}<p>{learning.prerequisiteNote[language]}</p></dd>
      </div>
      <div>
        <dt>{t("本篇解决什么", "The question", "この記事の問い", "이 글의 질문")}</dt>
        <dd>{learning.question[language]}</dd>
      </div>
    </dl>
  </aside>;
}
