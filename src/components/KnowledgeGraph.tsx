import { useEffect, useMemo, useRef, useState } from "react";
import { Maximize, Minus, Plus } from "lucide-react";
import { forceCollide, forceLink, forceManyBody, forceSimulation, forceX, forceY, type SimulationNodeDatum, type SimulationLinkDatum } from "d3-force";
import { select } from "d3-selection";
import { drag } from "d3-drag";
import { zoom, zoomIdentity } from "d3-zoom";
import "d3-transition";
import { type Category, type Language, type Topic, interfaceCopy } from "../content/knowledge";
import { getTopicKey, relatedTopics } from "../content/relatedTopics";
import { text } from "../content/language";
import { animationLoop } from "./animationLoop";

type DisplayTopic = Topic & { category: Category };
type GraphNode = SimulationNodeDatum & { id: string; category: Category; topic?: DisplayTopic; homeX: number; homeY: number };
type GraphLink = SimulationLinkDatum<GraphNode> & { kind: "category" | "related" };

export function buildKnowledgeGraph(topics: DisplayTopic[]) {
  const groups = [...new Map(topics.map(topic => [topic.category.id, topic.category])).values()];
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];
  groups.forEach((category, i) => {
    const angle = i / groups.length * Math.PI * 2 - Math.PI / 2;
    const homeX = Math.cos(angle) * (groups.length === 1 ? 0 : 330);
    const homeY = Math.sin(angle) * (groups.length === 1 ? 0 : 300);
    nodes.push({ id: `category:${category.id}`, category, homeX, homeY, x: homeX, y: homeY });
    const members = topics.filter(topic => topic.category.id === category.id);
    members.forEach((topic, j) => {
      const a = j / members.length * Math.PI * 2 + angle;
      const x = homeX + Math.cos(a) * 150;
      const y = homeY + Math.sin(a) * 150;
      const id = getTopicKey(topic) ?? topic.title.en;
      nodes.push({ id, category, topic, x, y, homeX: x, homeY: y });
      links.push({ source: `category:${category.id}`, target: id, kind: "category" });
    });
  });
  const ids = new Set(nodes.map(node => node.id));
  const pairs = new Set<string>();
  for (const topic of topics) {
    const key = getTopicKey(topic);
    if (!key) continue;
    for (const relation of relatedTopics[key] ?? []) {
      const pair = [key, relation.target].sort().join("|");
      if (!ids.has(relation.target) || pairs.has(pair)) continue;
      pairs.add(pair);
      links.push({ source: key, target: relation.target, kind: "related" });
    }
  }
  return { nodes, links };
}

function labelLines(label: string) {
  // Bound labels in every locale; full titles remain available to assistive tech and hover.
  const parts = label.match(/[\u3000-\u9fff\uac00-\ud7af]|[^\u3000-\u9fff\uac00-\ud7af\s]+\s*/g) ?? [label];
  const lines: string[] = [""];
  for (const part of parts) {
    const width = [...lines[lines.length - 1] + part].reduce((sum, character) => sum + (character.charCodeAt(0) > 255 ? 2 : 1), 0);
    if (width > 16 && lines[lines.length - 1]) lines.push("");
    lines[lines.length - 1] += part;
  }
  return lines.map(line => line.trim());
}

export function KnowledgeGraph({ topics, language, onOpen, onSelectCategory }: {
  topics: DisplayTopic[]; language: Language; onOpen: (topic: DisplayTopic) => void; onSelectCategory: (id: string) => void;
}) {
  const t = (zh: string, en: string, ja: string, ko: string) => text(language, zh, en, ja, ko);
  const model = useMemo(() => buildKnowledgeGraph(topics), [topics]);
  const svg = useRef<SVGSVGElement>(null);
  const viewport = useRef<SVGGElement>(null);
  const controls = useRef({ fit: () => {}, scale: (_factor: number) => {} });
  const [focused, setFocused] = useState<string | null>(null);
  const neighbors = new Set([focused]);
  for (const link of model.links) {
    const source = typeof link.source === "object" ? link.source.id : String(link.source);
    const target = typeof link.target === "object" ? link.target.id : String(link.target);
    if (source === focused) neighbors.add(target);
    if (target === focused) neighbors.add(source);
  }

  useEffect(() => {
    setFocused(null);
    if (!svg.current || !viewport.current || !model.nodes.length) return;
    const surface = select(svg.current);
    const world = select(viewport.current);
    const nodes = world.selectAll<SVGGElement, GraphNode>(".knowledge-node").data(model.nodes);
    const edges = world.selectAll<SVGLineElement, GraphLink>(".knowledge-edge").data(model.links);
    const simulation = forceSimulation(model.nodes).stop()
      .force("link", forceLink<GraphNode, GraphLink>(model.links).id(node => node.id).distance(link => link.kind === "category" ? 150 : 230).strength(link => link.kind === "category" ? .25 : .025))
      .force("charge", forceManyBody().strength(-180))
      .force("collide", forceCollide<GraphNode>(node => node.topic ? 87 : 100).iterations(2))
      .force("x", forceX<GraphNode>(node => node.homeX).strength(.07))
      .force("y", forceY<GraphNode>(node => node.homeY).strength(.07));
    const render = () => {
      nodes.attr("transform", node => `translate(${node.x},${node.y})`);
      edges.attr("x1", link => (link.source as GraphNode).x!).attr("y1", link => (link.source as GraphNode).y!)
        .attr("x2", link => (link.target as GraphNode).x!).attr("y2", link => (link.target as GraphNode).y!);
    };
    simulation.tick(140);
    render();
    let width = 1200, height = 800;
    const behavior = zoom<SVGSVGElement, unknown>().extent(() => [[0, 0], [width, height]]).scaleExtent([.1, 4])
      .on("zoom", event => world.attr("transform", event.transform.toString()));
    surface.call(behavior).on("dblclick.zoom", null);
    const fitTransform = () => {
      const xs = model.nodes.map(node => node.x!);
      const ys = model.nodes.map(node => node.y!);
      const left = Math.min(...xs) - 115, right = Math.max(...xs) + 115;
      const top = Math.min(...ys) - 50, bottom = Math.max(...ys) + 100;
      const k = Math.max(.1, Math.min(1.3, (width - 50) / (right - left), (height - 70) / (bottom - top)));
      return zoomIdentity.translate(width / 2 - (left + right) / 2 * k, height / 2 - (top + bottom) / 2 * k).scale(k);
    };
    const resize = () => {
      const bounds = svg.current!.getBoundingClientRect();
      width = bounds.width || 1200; height = bounds.height || 800;
      surface.attr("viewBox", `0 0 ${width} ${height}`);
      const first = model.nodes[0];
      const transform = width < 600 ? zoomIdentity.translate(width / 2 - first.x! * .85, height / 2 - first.y! * .85).scale(.85) : fitTransform();
      surface.call(behavior.transform, transform);
    };
    resize();
    const observer = typeof ResizeObserver === "undefined" ? undefined : new ResizeObserver(resize);
    observer?.observe(svg.current);
    const duration = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 240;
    controls.current = {
      fit: () => { surface.transition().duration(duration()).call(behavior.transform, fitTransform()); },
      scale: factor => { surface.transition().duration(duration()).call(behavior.scaleBy, factor); }
    };
    const clock = animationLoop(svg.current, delta => {
      if (!delta) return;
      simulation.tick();
      render();
      if (simulation.alpha() < .015) clock.setPlaying(false);
    }, { fps: 60 });
    nodes.call(drag<SVGGElement, GraphNode>().container(() => viewport.current!)
      .on("start", (_event, node) => { node.fx = node.x; node.fy = node.y; simulation.alpha(.25); clock.setPlaying(true); })
      .on("drag", (event, node) => { node.fx = event.x; node.fy = event.y; simulation.tick(); render(); })
      .on("end", (_event, node) => { node.fx = null; node.fy = null; }));
    return () => { clock.dispose(); simulation.stop(); observer?.disconnect(); surface.interrupt().on(".zoom", null); nodes.on(".drag", null); controls.current = { fit: () => {}, scale: () => {} }; };
  }, [model]);

  return <section className="knowledge-graph" aria-labelledby="graph-title">
    <div className="knowledge-graph-heading"><div><h2 id="graph-title">{t("知识关系图", "Knowledge graph", "知識グラフ", "지식 그래프")}</h2><span>{topics.length} {t("主题", "topics", "トピック", "주제")}</span></div>
      <div className="knowledge-graph-tools">
        {[{ icon: Minus, label: t("缩小", "Zoom out", "縮小", "축소"), action: () => controls.current.scale(1 / 1.25) }, { icon: Plus, label: t("放大", "Zoom in", "拡大", "확대"), action: () => controls.current.scale(1.25) }, { icon: Maximize, label: t("适应全图", "Fit graph", "全体表示", "전체 보기"), action: () => controls.current.fit() }].map(({ icon: Icon, label, action }) => <button key={label} type="button" title={label} aria-label={label} onClick={action}><Icon size={18}/></button>)}
      </div>
    </div>
    {!topics.length ? <div className="empty-state">{interfaceCopy.noResults[language]}</div> : <svg ref={svg} className="knowledge-graph-surface" viewBox="0 0 1200 800" role="group" aria-label={t("音频知识连接图", "Audio knowledge network", "オーディオ知識ネットワーク", "오디오 지식 네트워크")}>
      <g ref={viewport}>
        {model.links.map((link, i) => {
          const source = typeof link.source === "object" ? link.source.id : String(link.source);
          const target = typeof link.target === "object" ? link.target.id : String(link.target);
          return <line key={i} className={`knowledge-edge ${link.kind}`} data-kind={link.kind} data-dimmed={focused !== null && source !== focused && target !== focused}/>;
        })}
        {model.nodes.map(node => {
          const label = node.topic?.title[language] ?? node.category.title[language];
          const open = () => node.topic ? onOpen(node.topic) : onSelectCategory(node.category.id);
          return <g key={node.id} className={`knowledge-node ${node.topic ? "topic" : "category"}`} role="button" tabIndex={0} aria-label={label} data-node-id={node.id} data-dimmed={focused !== null && !neighbors.has(node.id)} style={{ "--node-color": node.category.accent } as React.CSSProperties}
            onMouseEnter={() => setFocused(node.id)} onMouseLeave={() => setFocused(null)} onFocus={() => setFocused(node.id)} onBlur={() => setFocused(null)} onClick={open}
            onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); open(); } }}>
            <title>{label}{node.topic ? `\n${node.topic.summary[language]}` : ""}</title>
            <circle className="knowledge-node-hit" r={node.topic ? 23 : 30}/><circle className="knowledge-node-dot" r={node.topic ? 6 : 13}/>
            <text textAnchor="middle" y={node.topic ? 25 : 35}>{labelLines(label).map((line, i) => <tspan key={i} x="0" dy={i ? "1.25em" : "0"}>{line}</tspan>)}</text>
          </g>;
        })}
      </g>
    </svg>}
    <div className="knowledge-graph-legend"><span><i className="category-link"/>{t("分类归属", "Category", "分類", "분류")}</span><span><i className="related-link"/>{t("相关知识", "Related knowledge", "関連知識", "관련 지식")}</span></div>
  </section>;
}
