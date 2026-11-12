import { fireEvent, render, screen, within } from "@testing-library/react";
import { expect, it, vi, beforeEach, afterEach } from "vitest";
import { categories } from "../content/knowledge";
import { TopicGrid } from "./TopicGrid";
import TopicCarousel from "./TopicCarousel";

const topics = categories.flatMap(category => category.topics.map(topic => ({ ...topic, category })));
beforeEach(() => {
  vi.stubGlobal("ResizeObserver", class { observe() {} disconnect() {} });
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(900);
  vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(420);
});
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

it("opens the carousel directly without a grid toggle and handles empty searches", async () => {
  const open = vi.fn();
  const { rerender } = render(<TopicGrid topics={topics} language="en" onSelectTopic={open} />);
  await screen.findByRole("button", { name: "Rotate right" });
  expect(screen.queryByRole("button", { name: "Grid" })).not.toBeInTheDocument();
  expect(document.querySelector(".topic-grid")).not.toBeInTheDocument();
  expect(document.querySelectorAll(".carousel-card")).toHaveLength(categories[0].topics.length);
  expect(document.querySelector(".carousel-card .topic-card-entry")).toHaveTextContent("Read and explore");
  rerender(<TopicGrid topics={[]} language="en" onSelectTopic={open} />);
  expect(document.querySelector(".empty-state")).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Rotate right" })).not.toBeInTheDocument();
});

it("rotates before opening a side card and wraps in both directions", () => {
  const cards = topics.filter(topic => topic.category.id === categories[0].id);
  const open = vi.fn();
  render(<TopicCarousel topics={cards} language="en" onSelectTopic={open} />);
  fireEvent.click(screen.getByRole("button", { name: cards[1].title.en }));
  expect(open).not.toHaveBeenCalled();
  expect(screen.getByRole("button", { name: cards[1].title.en })).toHaveAttribute("aria-current", "true");
  fireEvent.click(screen.getByRole("button", { name: cards[1].title.en }));
  expect(open).toHaveBeenCalledWith(cards[1]);
  fireEvent.click(screen.getByRole("button", { name: "Rotate left" }));
  fireEvent.click(screen.getByRole("button", { name: "Rotate left" }));
  expect(screen.getByRole("button", { name: cards[cards.length - 1].title.en })).toHaveAttribute("aria-current", "true");
  fireEvent.keyDown(screen.getByRole("button", { name: "Rotate right" }), { key: "ArrowRight" });
  expect(screen.getByRole("button", { name: cards[0].title.en })).toHaveAttribute("aria-current", "true");
  screen.getByRole("button", { name: cards[0].title.en }).focus();
  fireEvent.keyDown(document.activeElement!, { key: "ArrowRight" });
  expect(screen.getByRole("button", { name: cards[1].title.en })).toHaveFocus();
});

it("keeps three-card side previews separated and loops without duplicating topics", () => {
  vi.spyOn(window, "matchMedia").mockImplementation(media => ({
    media, matches: true, onchange: null, addEventListener() {}, removeEventListener() {},
    addListener() {}, removeListener() {}, dispatchEvent: () => true,
  }));
  const cards = topics.slice(0, 3);
  render(<TopicCarousel topics={cards} language="en" onSelectTopic={vi.fn()} />);
  for (let step = 0; step < 4; step++) {
    expect(document.querySelectorAll(".carousel-card")).toHaveLength(3);
    const front = screen.getByRole("button", { name: cards[step % 3].title.en });
    expect(front).toHaveAttribute("aria-current", "true");
    const sides = [...document.querySelectorAll<HTMLElement>(".carousel-object")].filter(el => !el.contains(front));
    const xs = sides.map(el => {
      expect(Number(el.style.opacity)).toBeGreaterThan(.45);
      return Number(el.style.transform.match(/matrix3d\(([^)]+)\)/)![1].split(",")[12]);
    }).sort((a, b) => a - b);
    expect(xs[0]).toBeLessThan(-290);
    expect(xs[1]).toBeGreaterThan(290);
    fireEvent.click(screen.getByRole("button", { name: "Rotate right" }));
  }
});

it("integrates the sole carousel view with search, filters and article returns", async () => {
  const { default: App } = await import("../App");
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
  window.history.replaceState(null, "", "#top");
  localStorage.setItem("audio-technology-language", "en");
  render(<App />);
  await screen.findByRole("button", { name: "Rotate right" });
  expect(screen.queryByRole("button", { name: "Graph" })).not.toBeInTheDocument();
  expect(screen.queryByRole("heading", { name: "Knowledge graph" })).not.toBeInTheDocument();
  expect(screen.queryByRole("group", { name: "Browse view" })).not.toBeInTheDocument();
  expect(document.querySelector(".topic-grid")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Rotate right" }));
  const front = document.querySelector<HTMLButtonElement>(".carousel-card[aria-current=true]")!;
  const title = front.getAttribute("aria-label")!;
  fireEvent.click(front);
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(title);
  fireEvent.click(screen.getByRole("button", { name: "Back to knowledge base" }));
  expect(await screen.findByRole("button", { name: "Rotate right" })).toBeInTheDocument();
  const categoryRegion = screen.getByRole("region", { name: "Knowledge Areas" });
  fireEvent.click(within(categoryRegion).getByRole("button", { name: /Audio Hardware/ }));
  expect(document.querySelectorAll(".carousel-card")).toHaveLength(categories.find(category => category.id === "hardware")!.topics.length);
  fireEvent.change(screen.getByRole("searchbox"), { target: { value: "no-such-audio-topic" } });
  expect(document.querySelector(".empty-state")).toBeInTheDocument();
  fireEvent.change(screen.getByRole("searchbox"), { target: { value: "Microphones" } });
  const matches = document.querySelectorAll(".carousel-card").length;
  expect(matches).toBeGreaterThan(0);
  expect(screen.getByRole("button", { name: "Microphones" })).toBeInTheDocument();
  expect(await screen.findByRole("button", { name: "Rotate right" })).toBeInTheDocument();
  expect(document.querySelectorAll(".carousel-card")).toHaveLength(matches);
}, 20000);

it.each(["zh", "zh-Hant", "en", "ja", "ko"] as const)("keeps translated cards and resets after search/category changes (%s)", language => {
  const open = vi.fn();
  const { rerender, container, unmount } = render(<TopicCarousel topics={topics} language={language} onSelectTopic={open} />);
  fireEvent.change(screen.getByRole("combobox"), { target: { value: categories[1].id } });
  const topic = topics.find(topic => topic.category.id === categories[1].id)!;
  expect(screen.getByRole("button", { name: topic.title[language] })).toHaveAttribute("aria-current", "true");
  rerender(<TopicCarousel topics={[topics[0]]} language={language} onSelectTopic={open} />);
  expect(container.querySelectorAll(".carousel-card")).toHaveLength(1);
  expect(container.querySelectorAll("button:disabled")).toHaveLength(2);
  fireEvent.click(screen.getByRole("button", { name: topics[0].title[language] }));
  expect(open).toHaveBeenCalledWith(topics[0]);
  unmount();
  expect(document.querySelector(".carousel-object")).not.toBeInTheDocument();
});
