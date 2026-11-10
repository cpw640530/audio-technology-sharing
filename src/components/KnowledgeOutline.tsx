import type { Category, Language, Topic } from "../content/knowledge";
import { text } from "../content/language";

type KnowledgeOutlineProps = {
  categories: Category[];
  language: Language;
  onSelectTopic: (category: Category, topic: Topic) => void;
};

export function KnowledgeOutline({ categories, language, onSelectTopic }: KnowledgeOutlineProps) {
  return (
    <aside
      aria-label={text(language, "知识分类大纲", "Knowledge Outline", "知識の分類", "지식 분류 개요")}
      className="knowledge-outline"
    >
      <div className="knowledge-outline-header">
        <span>{text(language, "快速浏览", "Quick browse", "クイック閲覧", "빠른 탐색")}</span>
        <h2>{text(language, "知识分类大纲", "Knowledge Outline", "知識の分類", "지식 분류 개요")}</h2>
        <p>
          {text(language, "按分类查看当前网页中的所有主题。", "Browse all topics currently available on the site.", "公開中のトピックを分類別に確認できます。", "사이트의 모든 주제를 분류별로 살펴보세요.")}
        </p>
      </div>
      <div className="knowledge-outline-list">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <section className="knowledge-outline-group" key={category.id}>
              <h3 style={{ "--accent": category.accent } as React.CSSProperties}>
                <Icon size={16} aria-hidden="true" />
                <span>{category.title[language]}</span>
              </h3>
              <ul>
                {category.topics.map((topic) => (
                  <li key={topic.title.en}>
                    <a
                      href={`#topic-${category.id}-${encodeURIComponent(topic.title.en)}`}
                      onClick={event => { event.preventDefault(); onSelectTopic(category, topic); }}
                    >
                      {topic.title[language]}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </aside>
  );
}
