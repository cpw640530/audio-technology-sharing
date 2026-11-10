import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { categories, type Category, type Language, type Topic } from "../content/knowledge";
import { getTopicKey, type TopicKey } from "../content/relatedTopics";
import { KnowledgeExplorer, LocalKnowledgeMap } from "./KnowledgeNavigation";

type DisplayTopic = Topic & { category: Category };

const allTopics: DisplayTopic[] = categories.flatMap(category =>
  category.topics.map(topic => ({ ...topic, category }))
);

function topicFor(key: TopicKey): DisplayTopic {
  const topic = allTopics.find(item => getTopicKey(item) === key);
  if (!topic) throw new Error(`Missing topic fixture: ${key}`);
  return topic;
}

const languageCases: {
  language: Language;
  explorer: string;
  summary: string;
  search: string;
  placeholder: string;
  allTopics: string;
  noResults: string;
}[] = [
  { language: "zh", explorer: "知识导航", summary: "知识导航", search: "搜索导航主题", placeholder: "搜索主题…", allTopics: "全部主题", noResults: "未找到主题" },
  { language: "zh-Hant", explorer: "知識導航", summary: "知識導航", search: "搜索導航主題", placeholder: "搜索主題…", allTopics: "全部主題", noResults: "未找到主題" },
  { language: "en", explorer: "Knowledge navigation", summary: "Explorer", search: "Search navigation topics", placeholder: "Search topics…", allTopics: "All topics", noResults: "No topics found" },
  { language: "ja", explorer: "知識ナビゲーション", summary: "エクスプローラー", search: "ナビゲーション内を検索", placeholder: "トピックを検索…", allTopics: "すべてのトピック", noResults: "該当なし" },
  { language: "ko", explorer: "지식 탐색", summary: "탐색기", search: "탐색 주제 검색", placeholder: "주제 검색…", allTopics: "모든 주제", noResults: "주제 없음" }
];

function openExplorer(labels: (typeof languageCases)[number]) {
  const explorer = screen.getByRole("complementary", { name: labels.explorer });
  fireEvent.click(within(explorer).getByText(labels.summary, { selector: "summary" }));
  return explorer;
}

afterEach(cleanup);

describe("KnowledgeExplorer", () => {
  it.each(languageCases)("renders localized navigation semantics in $language", labels => {
    const topic = topicFor("sound-wave");
    render(<KnowledgeExplorer language={labels.language} onOpen={vi.fn()} />);
    const explorer = openExplorer(labels);
    const search = within(explorer).getByRole("searchbox", { name: labels.search });

    expect(search).toHaveAttribute("placeholder", labels.placeholder);
    expect(within(explorer).getByRole("navigation", { name: labels.allTopics })).toBeInTheDocument();
    expect(within(explorer).getByRole("link", { name: topic.title[labels.language] })).toBeInTheDocument();
  });

  it("filters topics and opens a cross-topic search result", () => {
    const current = topicFor("sound-wave");
    const target = topicFor("microphone");
    const onOpen = vi.fn();
    const labels = languageCases.find(item => item.language === "en")!;
    render(<KnowledgeExplorer language="en" current="sound-wave" onOpen={onOpen} />);
    const explorer = openExplorer(labels);
    const search = within(explorer).getByRole("searchbox", { name: labels.search });

    fireEvent.change(search, { target: { value: target.title.en } });
    expect(within(explorer).getByRole("link", { name: target.title.en })).toBeInTheDocument();
    expect(within(explorer).queryByRole("link", { name: current.title.en })).not.toBeInTheDocument();

    fireEvent.click(within(explorer).getByRole("link", { name: target.title.en }));
    expect(onOpen).toHaveBeenCalledWith(target);
    expect(search).toHaveValue("");
  });

  it("marks the current topic link with page-current semantics", () => {
    const labels = languageCases.find(item => item.language === "en")!;
    const current = topicFor("sound-wave");
    const other = topicFor("microphone");
    render(<KnowledgeExplorer language="en" current="sound-wave" onOpen={vi.fn()} />);
    const explorer = openExplorer(labels);

    expect(within(explorer).getByRole("link", { name: current.title.en })).toHaveAttribute("aria-current", "page");
    expect(within(explorer).getByRole("link", { name: other.title.en })).not.toHaveAttribute("aria-current");
  });

  it.each(languageCases)("shows the localized no-result state in $language", labels => {
    render(<KnowledgeExplorer language={labels.language} onOpen={vi.fn()} />);
    const explorer = openExplorer(labels);
    const search = within(explorer).getByRole("searchbox", { name: labels.search });

    fireEvent.change(search, { target: { value: "not-a-real-topic-987654" } });
    expect(within(explorer).getByRole("status")).toHaveTextContent(labels.noResults);
    expect(within(explorer).queryByRole("link")).not.toBeInTheDocument();
  });
});

describe("LocalKnowledgeMap", () => {
  it("drags the central topic and keeps every connected edge attached", async () => {
    const onOpen = vi.fn();
    const { container } = render(<LocalKnowledgeMap language="en" current="sound-wave" onOpen={onOpen} />);
    const center = container.querySelector(".quartz-map-center")!;
    const neighbor = container.querySelector(".quartz-map-node")!;
    const initialPosition = neighbor.getAttribute("transform");
    const view = document.defaultView!;
    const dispatch = (target: Element | Window, type: string, clientX: number, clientY: number) => {
      const event = new MouseEvent(type, { bubbles: true, cancelable: true, clientX, clientY, button: 0 });
      Object.defineProperty(event, "view", { value: view });
      fireEvent(target, event);
    };
    dispatch(center, "mousedown", 160, 145);
    dispatch(view, "mousemove", 180, 165);
    expect(center).toHaveAttribute("cx", "180");
    expect(center).toHaveAttribute("cy", "165");
    for (const edge of container.querySelectorAll(".quartz-map-edge")) {
      expect(edge).toHaveAttribute("x1", "180");
      expect(edge).toHaveAttribute("y1", "165");
    }
    dispatch(view, "mouseup", 180, 165);
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(onOpen).not.toHaveBeenCalled();
    await waitFor(() => expect(neighbor.getAttribute("transform")).not.toBe(initialPosition));
    const edge = container.querySelector(".quartz-map-edge")!;
    expect(edge.getAttribute("x1")).toBe(center.getAttribute("cx"));
    expect(edge.getAttribute("y1")).toBe(center.getAttribute("cy"));
  });
  it("centers the current topic and refreshes the radial graph when navigating", () => {
    const { container, rerender } = render(<LocalKnowledgeMap language="en" current="sound-wave" onOpen={vi.fn()} />);
    expect(container.querySelector(".quartz-map-center")).toHaveAttribute("cx", "160");
    expect(container.querySelectorAll(".quartz-map-edge")).toHaveLength(container.querySelectorAll(".quartz-map-node").length);
    expect(container.querySelector(".quartz-map-node")).toHaveAttribute("transform", "translate(160,50)");
    rerender(<LocalKnowledgeMap language="en" current="microphone" onOpen={vi.fn()} />);
    expect(container.querySelector(".quartz-map-current")).toHaveTextContent(topicFor("microphone").title.en);
    expect(container.querySelector(".quartz-map-center title")).toHaveTextContent(topicFor("microphone").title.en);
    expect(screen.getByRole("link", { name: topicFor("sound-wave").title.en })).toBeInTheDocument();
  });
  it("renders incoming and outgoing curated links without a self link and opens anchors", () => {
    const incoming: TopicKey[] = ["wave-spectrum", "amplifier-speaker", "spatial-audio"];
    const outgoing: TopicKey[] = ["microphone", "sampling-quantization"];
    const current = topicFor("sound-wave");
    const onOpen = vi.fn();
    render(<LocalKnowledgeMap language="en" current="sound-wave" onOpen={onOpen} />);

    const graph = screen.getByRole("group", { name: "Current topic and related knowledge" });
    const links = within(graph).getAllByRole("link");
    const labels = links.map(link => link.getAttribute("aria-label"));

    expect(links).toHaveLength(incoming.length + outgoing.length);
    for (const key of [...incoming, ...outgoing]) expect(labels).toContain(topicFor(key).title.en);
    expect(labels).not.toContain(current.title.en);

    fireEvent.click(within(graph).getByRole("link", { name: topicFor("wave-spectrum").title.en }));
    fireEvent.click(within(graph).getByRole("link", { name: topicFor("microphone").title.en }));
    expect(onOpen.mock.calls.map(([topic]) => getTopicKey(topic as Topic))).toEqual(["wave-spectrum", "microphone"]);
  });
});
