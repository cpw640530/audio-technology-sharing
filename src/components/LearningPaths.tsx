import { topicHref, isPlainNavigation } from "../content/topicRoutes";
import { traditional } from "../content/traditional";
import { categories, type Category, type Language, type Topic } from "../content/knowledge";
import { getTopicKey, type TopicKey } from "../content/relatedTopics";

export const learningPaths: { title: Record<Language, string>; topics: TopicKey[] }[] = [
  { title: { zh: "声音入门", "zh-Hant": traditional("声音入门"), en: "Audio fundamentals", ja: "音の基礎", ko: "소리의 기초" }, topics: ["sound-wave", "wave-spectrum", "sampling-quantization", "audio-units", "listening-metrics"] },
  { title: { zh: "设备开发", "zh-Hant": traditional("设备开发"), en: "Device development", ja: "デバイス開発", ko: "장치 개발" }, topics: ["microphone", "sampling-quantization", "digital-interface", "system-audio", "alsa", "realtime-audio"] },
  { title: { zh: "算法进阶", "zh-Hant": traditional("算法进阶"), en: "Signal processing", ja: "信号処理", ko: "신호 처리" }, topics: ["core-signal-processing", "speech-enhancement", "ai-overview"] }
];
const topics = categories.flatMap(category => category.topics.map(topic => ({ ...topic, category })));

export function LearningPaths({ language, onOpen }: { language: Language; onOpen: (topic: Topic & { category: Category }) => void }) {
  return <section className="learning-paths" aria-labelledby="learning-paths-title">
    <h2 id="learning-paths-title">{{ zh: "学习路线", "zh-Hant": traditional("学习路线"), en: "Learning paths", ja: "学習ルート", ko: "학습 경로" }[language]}</h2>
    {learningPaths.map(path => <div className="learning-path" key={path.title.en}>
      <h3>{path.title[language]}</h3>
      <ol>{path.topics.map(key => {
        const topic = topics.find(item => getTopicKey(item) === key);
        return topic && <li key={key}><a href={topicHref(topic)} onClick={event => { if (!isPlainNavigation(event)) return; event.preventDefault(); onOpen(topic); }}>{topic.title[language]}</a></li>;
      })}</ol>
    </div>)}
  </section>;
}
