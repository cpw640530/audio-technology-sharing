import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { topicHref, topicRoutes } from "./content/topicRoutes";

vi.mock("./components/TopicGrid", () => import("./test/TopicBrowserStub"));

beforeEach(() => {
  window.history.replaceState(null, "", "#top");
  window.localStorage.setItem("audio-technology-language", "en");
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
  Element.prototype.scrollIntoView = vi.fn();
});

describe("independent topic and lab pages", () => {
  it.each(topicRoutes)("opens article $key directly without visiting home", async entry => {
    window.history.replaceState(null, "", topicHref(entry.key));
    render(<App />);
    await waitFor(() => expect(document.querySelector(".route-loading")).not.toBeInTheDocument());
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(entry.topic.title.en);
    expect(screen.queryByTestId("topic-grid")).not.toBeInTheDocument();
    expect(document.title).toContain(entry.topic.title.en);
    const provenance = screen.getByRole("complementary", { name: "Content sources and experiment methods" });
    expect(provenance).toHaveAttribute("data-topic", entry.key);
    expect(provenance.closest(".sound-topic-content")).not.toBeNull();
    const graph = screen.getByRole("group", { name: "Current topic and related knowledge" });
    expect(graph.closest("details")).toHaveAttribute("open");
    expect(graph.querySelector(".quartz-map-center title")).toHaveTextContent(entry.topic.title.en);
    expect(within(graph).getAllByRole("link").length).toBeGreaterThan(0);
    expect(screen.getByRole("complementary", { name: "Reading prerequisites and goal" })).toBeInTheDocument();
    expect(screen.getByText("Read next", { selector: ".topic-next-reading > strong" })).toBeInTheDocument();
  });

  it.each(topicRoutes.filter(entry => entry.labView))("opens lab $key directly and returns to its own article", async entry => {
    window.history.replaceState(null, "", topicHref(entry.key, "lab"));
    render(<App />);
    await waitFor(() => expect(document.querySelector(".route-loading")).not.toBeInTheDocument());
    expect(screen.queryByTestId("topic-grid")).not.toBeInTheDocument();
    expect(screen.getByRole("complementary", { name: "Content sources and experiment methods" })).toHaveAttribute("data-topic", entry.key);
    expect(screen.getByRole("complementary", { name: "Experiment goal" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /^Back to (details|detailed (content|guide))$/ }));
    await waitFor(() => expect(document.querySelector(".route-loading")).not.toBeInTheDocument());
    expect(window.location.hash).toBe(topicHref(entry.key));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(entry.topic.title.en);
  });

  it("updates links, preserves article/lab identity across remounts and keeps music mounted", async () => {
    let app = render(<App />);
    const outline = screen.getByRole("complementary", { name: "Knowledge Outline" });
    const link = within(outline).getByRole("link", { name: "Microphones" });
    expect(link).toHaveAttribute("href", "#/topics/microphone");
    const music = document.querySelector(".site-music");
    fireEvent.click(link);
    await waitFor(() => expect(document.querySelector(".route-loading")).not.toBeInTheDocument());
    expect(window.location.hash).toBe("#/topics/microphone");
    expect(document.querySelector(".site-music")).toBe(music);
    app.unmount();
    app = render(<App />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Microphones");
    const entry = topicRoutes.find(item => item.key === "microphone")!;
    fireEvent.click(screen.getByRole("button", { name: entry.topic.detail.lab!.buttonLabel.en }));
    await waitFor(() => expect(document.querySelector(".route-loading")).not.toBeInTheDocument());
    expect(window.location.hash).toBe("#/labs/microphone");
    app.unmount();
    render(<App />);
    await waitFor(() => expect(document.querySelector(".route-loading")).not.toBeInTheDocument());
    fireEvent.click(screen.getByRole("button", { name: /^Back to (details|detailed (content|guide))$/ }));
    await waitFor(() => expect(document.querySelector(".route-loading")).not.toBeInTheDocument());
    expect(window.location.hash).toBe("#/topics/microphone");
  });

  it("restores article and lab on browser back/forward without adding history entries", async () => {
    window.history.replaceState(null, "", "#/topics/microphone");
    render(<App />);
    await waitFor(() => expect(document.querySelector(".route-loading")).not.toBeInTheDocument());
    const entry = topicRoutes.find(item => item.key === "microphone")!;
    const length = window.history.length;
    fireEvent.click(screen.getByRole("button", { name: entry.topic.detail.lab!.buttonLabel.en }));
    await waitFor(() => expect(document.querySelector(".route-loading")).not.toBeInTheDocument());
    expect(window.history.length).toBe(length + 1);
    window.history.back();
    await waitFor(() => expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Microphones"));
    expect(window.location.hash).toBe("#/topics/microphone");
    window.history.forward();
    await waitFor(() => expect(screen.getByRole("button", { name: /^Back to (details|detailed (content|guide))$/ })).toBeInTheDocument());
    expect(window.location.hash).toBe("#/labs/microphone");
    expect(window.history.length).toBe(length + 1);
  });

  it("keeps the topic URL when changing language or navigating a chapter", async () => {
    window.history.replaceState(null, "", "#/topics/microphone");
    render(<App />);
    await waitFor(() => expect(document.querySelector(".route-loading")).not.toBeInTheDocument());
    for (const language of ["zh", "zh-Hant", "ja", "ko", "en"]) {
      fireEvent.change(screen.getByRole("combobox", { name: /Language/ }), { target: { value: language } });
      expect(window.location.hash).toBe("#/topics/microphone");
    }
    const toc = screen.getByRole("navigation", { name: "Page contents" });
    fireEvent.click(within(toc).getAllByRole("link")[0]);
    await waitFor(() => expect(document.querySelector(".route-loading")).not.toBeInTheDocument());
    expect(window.location.hash).toBe("#/topics/microphone");
  });

  it("renders a useful fallback for an invalid link", async () => {
    window.history.replaceState(null, "", "#/topics/not-a-topic");
    render(<App />);
    await waitFor(() => expect(document.querySelector(".route-loading")).not.toBeInTheDocument());
    expect(screen.getByRole("heading", { name: "Page not found" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to knowledge base" })).toHaveAttribute("href", "#top");
  });
});
