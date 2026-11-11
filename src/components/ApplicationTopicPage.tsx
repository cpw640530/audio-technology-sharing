import { traditional } from "../content/traditional";
import type { ReactNode } from "react";
import { TopicReadingLayout } from "./TopicReadingLayout";
import { ArrowLeft, ArrowRight, BookOpen, CircuitBoard } from "lucide-react";
import type { Category, Language, Topic } from "../content/knowledge";
import { TopicPager } from "./TopicPager";
import { applicationFlows } from "../content/applicationFlows";
import { applicationProducts } from "../content/applicationProducts";
import { getTopicKey } from "../content/relatedTopics";
import { MeetingScenarioGuide } from "./MeetingScenarioGuide";
import { IotTroubleshooting } from "./IotTroubleshooting";

type DisplayTopic = Topic & { category: Category };
type ApplicationTopicPageProps = {
  relatedTopics?: ReactNode; language: Language; topic: DisplayTopic; onBack: () => void; onOpenLab: () => void; onOpenPrevious?: () => void; onOpenNext?: () => void };

export function ApplicationTopicPage({ relatedTopics, language, topic, onBack, onOpenLab, onOpenPrevious, onOpenNext }: ApplicationTopicPageProps) {
  const detail = topic.detail;
  const topicKey = getTopicKey(topic);
  const flow = applicationFlows[topicKey ?? ""];
  const products = applicationProducts[topicKey ?? ""];
  const t = (zh: string, en: string, ja: string, ko: string) => ({ zh, "zh-Hant": traditional(zh), en, ja, ko })[language];
  return (
    <main className="sound-topic-page application-topic-page" aria-labelledby="application-topic-title">
      <header className="sound-topic-hero">
        <button className="sound-topic-back" type="button" onClick={onBack}><ArrowLeft size={17} aria-hidden="true" />{t("返回知识库", "Back to knowledge base", "ナレッジベースに戻る", "지식 베이스로 돌아가기")}</button>
        <div className="sound-topic-kicker"><BookOpen size={16} aria-hidden="true" />{t("应用场景 · 专业内容", "Applications · Deep dive", "アプリケーション · 詳細解説", "응용 분야 · 심층 내용")}</div>
        <h1 id="application-topic-title">{topic.title[language]}</h1>
        <p className="sound-topic-lede">{topic.summary[language]}</p>
        <div className="sound-topic-meta"><span>{t("真实场景", "Real-world scenario", "実際のシナリオ", "실제 시나리오")}</span><span>{t("端到端链路", "End-to-end path", "エンドツーエンド経路", "엔드투엔드 경로")}</span><span>{detail.lab ? t("交互实验", "Interactive lab", "インタラクティブ実験", "인터랙티브 실험") : t("场景图解", "Scenario guide", "シナリオ図解", "시나리오 도해")}</span></div>
      </header>
      <TopicReadingLayout language={language}>
        <section className="sound-topic-section sound-topic-intro"><div><h2>{t("先从场景问题出发", "Start from the scenario problem", "まずシナリオの課題から始める", "먼저 시나리오 문제에서 시작하세요")}</h2><p>{detail.explanation[language]}</p></div></section>
        {products && <section className="sound-topic-section application-products">
          <h2>{t("从实物认识场景", "Products in context", "実物からシナリオを理解する", "실물로 살펴보는 활용 장면")}</h2>
          <p>{t("实物仅用于认识设备形态，不是购买推荐，也不表示产品采用本页全部算法。", "These examples illustrate device forms, not buying recommendations or proof that a product implements every algorithm on this page.", "実物は機器の形態を理解するための例で、購入の推奨や本ページの全アルゴリズムの採用を示すものではありません。", "실물은 기기 형태를 이해하기 위한 예시이며 구매 추천이나 이 페이지의 모든 알고리즘 탑재를 뜻하지 않습니다.")}</p>
          {products.map(product => <figure className="application-product" key={product.image}>
            <a className="application-product-image" href={`${import.meta.env.BASE_URL}images/${product.image}`} target="_blank" rel="noreferrer"
              aria-label={t("查看大图：", "View larger image: ", "画像を拡大：", "큰 이미지 보기: ") + product.title[language]}>
              <img src={`${import.meta.env.BASE_URL}images/${product.image}`} alt={product.title[language]} loading="lazy" decoding="async" width="800" height="600" />
            </a>
            <figcaption>
              <h3>{product.title[language]}</h3>
              <p>{product.caption[language]}</p>
              <small>{product.author} · <a href={product.source} target="_blank" rel="noreferrer">{t("图片来源", "Photo source", "写真出典", "사진 출처")}</a> · <a href={product.licenseUrl} target="_blank" rel="noreferrer">{product.license}</a> · {t("已缩放与压缩", "Resized and compressed", "縮小・圧縮済み", "크기 조정 및 압축")}</small>
            </figcaption>
          </figure>)}
        </section>}
        {flow && <section className="sound-topic-section application-paths">
          <div className="sound-topic-section-heading"><div>
            <h2>{t("从输入到用户结果", "From input to user outcome", "入力からユーザーの結果まで", "입력에서 사용자 결과까지")}</h2>
            <p>{flow.introduction[language]}</p>
          </div></div>
          {flow.paths.map(path => <div className="application-path" key={path.id} data-path={path.id}>
            <h3 id={`application-path-${path.id}`}>{path.title[language]}</h3>
            <ol className="application-topic-flow" aria-labelledby={`application-path-${path.id}`}>
              {path.steps.map((step, index) => <li key={index}>
                <span className="application-step-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <p>{step[language]}</p>
                {index < path.steps.length - 1 && <ArrowRight className="application-step-arrow" size={18} aria-hidden="true" />}
              </li>)}
            </ol>
            <p className="application-path-note">{path.note[language]}</p>
          </div>)}
          {flow.feedback && <p className="application-path-feedback">{flow.feedback[language]}</p>}
          <div className="application-path-check">
            <h3>{t("如何验证结果", "How to verify the outcome", "結果の検証方法", "결과 검증 방법")}</h3>
            <p>{flow.check[language]}</p>
          </div>
        </section>}
        {topicKey === "meeting-communication" && <MeetingScenarioGuide key={topicKey} language={language} />}
        {topicKey === "iot-content" && <IotTroubleshooting language={language} />}
        {detail.lab && <section className="sound-topic-section application-topic-lab-entry" aria-label={t("当前主题实验室入口", "Current topic lab entry", "現在のテーマのラボ入口", "현재 주제 실험실 입구")}><div className="sound-topic-cta"><CircuitBoard size={22} aria-hidden="true" /><h2>{detail.lab.title[language]}</h2><p>{detail.lab.description[language]}</p><button className="diagram-open-button" type="button" onClick={onOpenLab}>{detail.lab.buttonLabel[language]}</button></div></section>}
        <section className="sound-topic-section"><div className="sound-topic-section-heading"><div><h2>{t("核心知识点", "Core concepts", "核心概念", "핵심 개념")}</h2><p>{t("把产品体验拆回环境、信号链、指标和故障边界。", "Break product experience into environment, signal chain, metrics, and failure boundaries.", "製品体験を環境、信号経路、指標、故障境界に分解します。", "제품 경험을 환경·신호 체인·지표·장애 경계로 나눠 봅니다.")}</p></div></div><div className="sound-topic-glossary">{detail.keyConcepts.map((concept) => <article key={concept.en}><p>{concept[language]}</p></article>)}</div></section>
        <section className="sound-topic-section"><div className="sound-topic-section-heading"><div><h2>{t("场景术语", "Scenario terms", "シナリオ用語", "시나리오 용어")}</h2><p>{t("这些概念连接设备能力和实际用户体验。", "These concepts connect device capabilities to user experience.", "これらの概念がデバイス能力と実際のユーザー体験をつなぎます。", "이 개념들이 기기 능력과 실제 사용자 경험을 연결합니다.")}</p></div></div><div className="sound-topic-glossary">{detail.termExplanations?.map((term) => <article key={term.name.en}><h3>{term.name[language]}</h3><p>{term.explanation[language]}</p></article>)}</div></section>
        <section className="sound-topic-section"><div><h2>{t("工程边界", "Engineering boundary", "実装上の境界", "엔지니어링 경계")}</h2><p>{detail.misconception[language]}</p></div></section>
      </TopicReadingLayout>
      {relatedTopics}
      <TopicPager language={language} onBack={onBack} onPrevious={onOpenPrevious} onNext={onOpenNext} />
    </main>
  );
}
