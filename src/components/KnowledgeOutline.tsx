import type { Category, Language, Topic } from "../content/knowledge";

type KnowledgeOutlineProps = {
  categories: Category[];
  language: Language;
  onSelectTopic: (category: Category, topic: Topic) => void;
};

export function KnowledgeOutline({ categories, language, onSelectTopic }: KnowledgeOutlineProps) {
  return (
    <aside
      aria-label={language === "zh" ? "知识分类大纲" : "Knowledge Outline"}
      className="knowledge-outline"
    >
      <div className="knowledge-outline-header">
        <span>{language === "zh" ? "快速浏览" : "Quick browse"}</span>
        <h2>{language === "zh" ? "知识分类大纲" : "Knowledge Outline"}</h2>
        <p>
          {language === "zh"
            ? "按分类查看当前网页中的所有主题。"
            : "Browse all topics currently available on the site."}
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
                      onClick={() => onSelectTopic(category, topic)}
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
