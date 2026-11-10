import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { categories, type Category, type Language, type Topic } from "../content/knowledge";
import { getTopicKey, relatedTopics, type TopicKey } from "../content/relatedTopics";
import { buildKnowledgeGraph, KnowledgeGraph } from "./KnowledgeGraph";

type DisplayTopic = Topic & { category: Category };

const allTopics: DisplayTopic[] = categories.flatMap(category =>
  category.topics.map(topic => ({ ...topic, category }))
);

function topicFor(key: TopicKey): DisplayTopic {
  const topic = allTopics.find(item => getTopicKey(item) === key);
  if (!topic) throw new Error(`Missing topic fixture: ${key}`);
  return topic;
}

function endpointId(endpoint: string | number | { id: string }) {
  return typeof endpoint === "object" ? endpoint.id : String(endpoint);
}

const graphTopics = [
  topicFor("sound-wave"),
  topicFor("microphone"),
  topicFor("sampling-quantization")
];

const languageLabels: {
  language: Language;
  heading: string;
  graph: string;
  categoryLegend: string;
  relatedLegend: string;
  zoomOut: string;
  zoomIn: string;
  fit: string;
}[] = [
  { language: "zh", heading: "知识关系图", graph: "音频知识连接图", categoryLegend: "分类归属", relatedLegend: "相关知识", zoomOut: "缩小", zoomIn: "放大", fit: "适应全图" },
  { language: "zh-Hant", heading: "知識關系圖", graph: "音頻知識連接圖", categoryLegend: "分類歸屬", relatedLegend: "相關知識", zoomOut: "縮小", zoomIn: "放大", fit: "適應全圖" },
  { language: "en", heading: "Knowledge graph", graph: "Audio knowledge network", categoryLegend: "Category", relatedLegend: "Related knowledge", zoomOut: "Zoom out", zoomIn: "Zoom in", fit: "Fit graph" },
  { language: "ja", heading: "知識グラフ", graph: "オーディオ知識ネットワーク", categoryLegend: "分類", relatedLegend: "関連知識", zoomOut: "縮小", zoomIn: "拡大", fit: "全体表示" },
  { language: "ko", heading: "지식 그래프", graph: "오디오 지식 네트워크", categoryLegend: "분류", relatedLegend: "관련 지식", zoomOut: "축소", zoomIn: "확대", fit: "전체 보기" }
];

beforeEach(() => {
  vi.stubGlobal("requestAnimationFrame", () => 0);
  vi.stubGlobal("cancelAnimationFrame", () => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("buildKnowledgeGraph", () => {
  it("builds the expected node and link counts for a filtered topic set", () => {
    const model = buildKnowledgeGraph(graphTopics);

    expect(model.nodes).toHaveLength(5);
    expect(model.nodes.filter(node => node.topic)).toHaveLength(3);
    expect(model.nodes.filter(node => !node.topic)).toHaveLength(2);
    expect(model.links).toHaveLength(6);
    expect(model.links.filter(link => link.kind === "category")).toHaveLength(3);
    expect(model.links.filter(link => link.kind === "related")).toHaveLength(3);
  });

  it("keeps every full-catalog edge attached to a returned node", () => {
    const model = buildKnowledgeGraph(allTopics);
    const nodeIds = new Set(model.nodes.map(node => node.id));

    for (const link of model.links) {
      expect(nodeIds.has(endpointId(link.source))).toBe(true);
      expect(nodeIds.has(endpointId(link.target))).toBe(true);
    }
  });

  it("deduplicates reciprocal related edges", () => {
    expect(relatedTopics["audio-units"].map(relation => relation.target)).toContain("listening-metrics");
    expect(relatedTopics["listening-metrics"].map(relation => relation.target)).toContain("audio-units");

    const model = buildKnowledgeGraph([
      topicFor("audio-units"),
      topicFor("listening-metrics")
    ]);
    const related = model.links.filter(link => link.kind === "related");

    expect(related).toHaveLength(1);
    expect([endpointId(related[0].source), endpointId(related[0].target)].sort().join("|")).toBe("audio-units|listening-metrics");
  });

  it("keeps a category-filtered subgraph valid", () => {
    const visibleTopics = allTopics.filter(topic => topic.category.id === "fundamentals");
    const model = buildKnowledgeGraph(visibleTopics);
    const nodeIds = new Set(model.nodes.map(node => node.id));

    expect(model.nodes.filter(node => !node.topic).map(node => node.id)).toEqual(["category:fundamentals"]);
    expect(model.nodes.filter(node => node.topic).map(node => node.id).sort()).toEqual(
      visibleTopics.map(topic => getTopicKey(topic)!).sort()
    );
    expect(model.links.filter(link => link.kind === "category")).toHaveLength(visibleTopics.length);
    for (const link of model.links) {
      expect(nodeIds.has(endpointId(link.source))).toBe(true);
      expect(nodeIds.has(endpointId(link.target))).toBe(true);
    }
  });
});

describe("KnowledgeGraph", () => {
  it.each(languageLabels)("renders stable labels in $language", labels => {
    const topic = topicFor("audio-units");
    render(<KnowledgeGraph topics={[topic]} language={labels.language} onOpen={vi.fn()} onSelectCategory={vi.fn()} />);

    expect(screen.getByRole("heading", { name: labels.heading })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: labels.graph })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: topic.title[labels.language] })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: topic.category.title[labels.language] })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: labels.zoomOut })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: labels.zoomIn })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: labels.fit })).toBeInTheDocument();
    expect(screen.getByText(labels.categoryLegend)).toBeInTheDocument();
    expect(screen.getByText(labels.relatedLegend)).toBeInTheDocument();
  });

  it("opens a topic and selects its category from keyboard activation", () => {
    const onOpen = vi.fn();
    const onSelectCategory = vi.fn();
    const { container } = render(
      <KnowledgeGraph topics={graphTopics} language="en" onOpen={onOpen} onSelectCategory={onSelectCategory} />
    );

    fireEvent.keyDown(screen.getByRole("button", { name: graphTopics[0].title.en }), { key: "Enter" });
    expect(onOpen).toHaveBeenCalledWith(graphTopics[0]);

    const categoryNode = container.querySelector<SVGGElement>('[data-node-id="category:fundamentals"]');
    expect(categoryNode).not.toBeNull();
    fireEvent.keyDown(categoryNode!, { key: " " });
    expect(onSelectCategory).toHaveBeenCalledWith("fundamentals");
  });

  it("dims non-neighbors while a topic is focused and clears the highlight", () => {
    const { container } = render(
      <KnowledgeGraph topics={graphTopics} language="en" onOpen={vi.fn()} onSelectCategory={vi.fn()} />
    );
    const soundNode = screen.getByRole("button", { name: graphTopics[0].title.en });

    fireEvent.focus(soundNode);
    expect(soundNode).toHaveAttribute("data-dimmed", "false");
    expect(container.querySelector('[data-node-id="category:fundamentals"]')).toHaveAttribute("data-dimmed", "false");
    expect(container.querySelector('[data-node-id="microphone"]')).toHaveAttribute("data-dimmed", "false");
    expect(container.querySelector('[data-node-id="sampling-quantization"]')).toHaveAttribute("data-dimmed", "false");
    expect(container.querySelector('[data-node-id="category:hardware"]')).toHaveAttribute("data-dimmed", "true");
    expect(container.querySelectorAll('.knowledge-edge[data-dimmed="true"]')).toHaveLength(3);

    fireEvent.blur(soundNode);
    expect(container.querySelectorAll('[data-dimmed="true"]')).toHaveLength(0);
  });

  it("shows the localized empty state without rendering a graph", () => {
    render(<KnowledgeGraph topics={[]} language="en" onOpen={vi.fn()} onSelectCategory={vi.fn()} />);

    expect(screen.getByText("No matching topics found.")).toBeInTheDocument();
    expect(screen.queryByRole("group", { name: "Audio knowledge network" })).not.toBeInTheDocument();
  });
});
