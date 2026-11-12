import { topicHref, isPlainNavigation } from "../content/topicRoutes";
import { createContext, useEffect, useMemo, useRef, useState } from "react";
import { select } from "d3-selection";
import { drag } from "d3-drag";
import { forceCollide, forceLink, forceManyBody, forceSimulation, forceX, forceY, type SimulationNodeDatum } from "d3-force";
import { ChevronRight, Search } from "lucide-react";
import { categories, type Category, type Language, type Topic } from "../content/knowledge";
import { getTopicKey, relatedTopics, type TopicKey } from "../content/relatedTopics";
import { text } from "../content/language";

type DisplayTopic = Topic & { category: Category };
type LocalGraphPoint = SimulationNodeDatum & { x: number; y: number };
const topics = categories.flatMap(category => category.topics.map(topic => ({ ...topic, category })));
export const KnowledgeNavigationContext = createContext<{ current?: TopicKey; labTopic?: TopicKey; onOpen: (topic: DisplayTopic) => void } | null>(null);

export function KnowledgeExplorer({ language, current, onOpen }: { language: Language; current?: TopicKey; onOpen: (topic: DisplayTopic) => void }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(true);
  useEffect(() => {
    const media = window.matchMedia("(min-width: 900px)");
    const sync = () => setOpen(media.matches);
    sync(); media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  const t = (zh: string, en: string, ja: string, ko: string) => text(language, zh, en, ja, ko);
  return <aside className="quartz-explorer" aria-label={t("知识导航", "Knowledge navigation", "知識ナビゲーション", "지식 탐색")}>
    <details open={open} onToggle={event => setOpen(event.currentTarget.open)}><summary>{t("知识导航", "Explorer", "エクスプローラー", "탐색기")}</summary>
      <label className="quartz-search"><Search size={16} aria-hidden="true"/><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={t("搜索主题…", "Search topics…", "トピックを検索…", "주제 검색…")} aria-label={t("搜索导航主题", "Search navigation topics", "ナビゲーション内を検索", "탐색 주제 검색")}/></label>
      <nav aria-label={t("全部主题", "All topics", "すべてのトピック", "모든 주제")}>
        {categories.map(category => {
          const matches = topics.filter(topic => topic.category.id === category.id && (!query.trim() || Object.values(topic.title).join(" ").toLowerCase().includes(query.trim().toLowerCase())));
          if (!matches.length) return null;
          return <div className="quartz-explorer-group" key={category.id}><h3><category.icon size={15} aria-hidden="true"/>{category.title[language]}</h3>
            {matches.map(topic => <a key={topic.title.en} href={topicHref(topic)} aria-current={current === getTopicKey(topic) ? "page" : undefined} onClick={event => { if (!isPlainNavigation(event)) return; event.preventDefault(); setQuery(""); onOpen(topic); }}><ChevronRight size={12} aria-hidden="true"/>{topic.title[language]}</a>)}
          </div>;
        })}
        {query.trim() && !topics.some(topic => Object.values(topic.title).join(" ").toLowerCase().includes(query.trim().toLowerCase())) && <p role="status">{t("未找到主题", "No topics found", "該当なし", "주제 없음")}</p>}
      </nav>
    </details>
  </aside>;
}

export function LocalKnowledgeMap({ language, current, onOpen }: { language: Language; current: TopicKey; onOpen: (topic: DisplayTopic) => void }) {
  const svg = useRef<SVGSVGElement>(null);
  const centerPosition = useMemo<LocalGraphPoint>(() => ({ x: 160, y: 145 }), [current]);
  const positions = useMemo(() => {
    const neighbors = topics.filter(topic => {
      const key = getTopicKey(topic);
      return key && key !== current && (relatedTopics[current]?.some(relation => relation.target === key) || relatedTopics[key]?.some(relation => relation.target === current));
    });
    return neighbors.map((topic, i) => {
      const angle = i / neighbors.length * Math.PI * 2 - Math.PI / 2;
      return { topic, x: 160 + Math.cos(angle) * 92, y: 145 + Math.sin(angle) * 95 };
    });
  }, [current]);
  useEffect(() => {
    if (!svg.current) return;
    const surface = select(svg.current);
    const nodes = surface.selectAll<SVGGElement, (typeof positions)[number]>(".quartz-map-node").data(positions);
    const edges = surface.selectAll<SVGLineElement, (typeof positions)[number]>(".quartz-map-edge").data(positions);
    const centerNode = surface.select<SVGCircleElement>(".quartz-map-center").datum(centerPosition);
    const points: LocalGraphPoint[] = [centerPosition, ...positions];
    const render = () => {
      for (const node of points) {
        node.x = Math.max(65, Math.min(255, node.x));
        node.y = Math.max(25, Math.min(240, node.y));
      }
      nodes.attr("transform", node => `translate(${node.x},${node.y})`);
      centerNode.attr("cx", centerPosition.x).attr("cy", centerPosition.y);
      edges.attr("x1", centerPosition.x).attr("y1", centerPosition.y).attr("x2", node => node.x).attr("y2", node => node.y);
    };
    const simulation = forceSimulation(points).stop()
      .force("link", forceLink<LocalGraphPoint, { source: LocalGraphPoint; target: LocalGraphPoint }>(positions.map(node => ({ source: centerPosition, target: node }))).distance(95).strength(.4))
      .force("charge", forceManyBody().strength(-120))
      .force("collide", forceCollide(30))
      .force("x", forceX(160).strength(.025))
      .force("y", forceY(145).strength(.025))
      .on("tick", render);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const behavior = <E extends SVGElement, D extends LocalGraphPoint>() => drag<E, D>().clickDistance(4)
      .on("start", (_event, node) => {
        node.fx = node.x; node.fy = node.y;
        if (!reducedMotion.matches) simulation.alpha(.6).alphaTarget(.15).restart();
      })
      .on("drag", (event, node) => {
        node.x = node.fx = Math.max(65, Math.min(255, event.x));
        node.y = node.fy = Math.max(25, Math.min(240, event.y));
        if (reducedMotion.matches) simulation.alpha(.6).tick(15);
        render();
      })
      .on("end", (_event, node) => {
        node.fx = null; node.fy = null;
        simulation.alphaTarget(0);
      });
    nodes.call(behavior<SVGGElement, (typeof positions)[number]>());
    centerNode.call(behavior<SVGCircleElement, LocalGraphPoint>());
    const pause = () => { if (document.hidden) simulation.stop(); };
    document.addEventListener("visibilitychange", pause);
    return () => { simulation.stop(); document.removeEventListener("visibilitychange", pause); nodes.on(".drag", null); centerNode.on(".drag", null); };
  }, [positions, centerPosition]);
  const t = (zh: string, en: string, ja: string, ko: string) => text(language, zh, en, ja, ko);
  const center = topics.find(topic => getTopicKey(topic) === current);
  if (!center) return null;
  return <details className="quartz-local-map" open><summary>{t("局部关系图", "Local graph", "ローカルグラフ", "로컬 그래프")}</summary>
    <svg ref={svg} viewBox="0 0 320 290" role="group" aria-label={t("当前主题与关联知识", "Current topic and related knowledge", "現在のトピックと関連知識", "현재 주제와 관련 지식")}>
      {positions.map(node => <line className="quartz-map-edge" key={node.topic.title.en} x1={centerPosition.x} y1={centerPosition.y} x2={node.x} y2={node.y} stroke="#98b3a7"/>)}
      <circle className="quartz-map-center" cx={centerPosition.x} cy={centerPosition.y} r="10" fill={center.category.accent}><title>{center.title[language]}</title></circle>
      {positions.map(({ topic, x, y }) => {
        const limit = language === "en" ? 18 : 9;
        const title = [...topic.title[language]];
        const split = Math.ceil(limit / 2);
        return <g className="quartz-map-node" transform={`translate(${x},${y})`} key={topic.title.en}><a href={topicHref(topic)} onDragStart={event => event.preventDefault()} onClick={event => { if (!isPlainNavigation(event)) return; event.preventDefault(); onOpen(topic); }} aria-label={topic.title[language]}>
          <title>{topic.title[language]}</title><circle r="18" fill="transparent"/><circle r="5" fill={topic.category.accent}/>
          <text y="22" textAnchor="middle"><tspan x="0">{title.slice(0, split).join("")}</tspan>{title.length > split && <tspan x="0" dy="14">{title.slice(split, limit).join("")}{title.length > limit ? "…" : ""}</tspan>}</text>
        </a></g>;
      })}
    </svg>
    <p className="quartz-map-current">{center.title[language]}</p>
  </details>;
}
