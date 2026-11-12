import { fireEvent, render, screen, within } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { categories } from "../content/knowledge";
import { AiAudioTopicPage } from "./AiAudioTopicPage";
import { aiModelReferences } from "../content/aiModelReferences";
import { aiArticles } from "../content/aiArticles";

const topics = categories.flatMap(category => category.topics
  .filter(topic => category.id === "ai")
  .map(topic => ({ ...topic, category })));

it.each(topics)("keeps the reading structure and lab entry for $title.en", topic => {
  for (const language of ["zh", "en"] as const) {
    const onOpenLab = vi.fn();
    const { container, unmount } = render(<AiAudioTopicPage
      topic={topic} mode={topic.detail.lab?.initialMode ?? "overview"}
      language={language} onBack={() => {}} onOpenLab={onOpenLab}
    />);
    const headings = Array.from(container.querySelectorAll(".sound-topic-content h2"));
    const overview = !topic.detail.lab;
    expect(headings).toHaveLength((overview || ["enhancement", "asr", "event"].includes(topic.detail.lab?.initialMode ?? "") ? 8 : 7) + (overview ? 0 : 1));
    const mode = topic.detail.lab?.initialMode ?? "overview";
    expect(screen.getByRole("heading", { name: aiModelReferences[mode].name })).toBeInTheDocument();
    expect(headings.slice(-3).map(heading => heading.textContent)).toEqual(language === "zh"
      ? ["核心知识点", "工程边界", "相关术语"]
      : ["Core concepts", "Engineering boundary", "Related terms"]);
    expect(container.querySelectorAll(".ai-topic-concepts li")).toHaveLength(topic.detail.keyConcepts.length);
    expect(container.querySelectorAll(overview ? ".ai-overview ol:first-of-type li" : topic.detail.lab?.initialMode === "asr" ? ".asr-journey-strip > li" : ".ai-topic-flow li")).toHaveLength(overview ? 5 : 4);
    const nav = screen.getByRole("navigation", { name: language === "zh" ? "章节目录" : "Page contents" });
    expect(within(nav).getAllByRole("link").map(link => link.getAttribute("href")))
      .toEqual(headings.map(heading => `#${heading.id}`));
    for (const details of container.querySelectorAll(".ai-topic-terms details")) {
      expect(details).not.toHaveAttribute("open");
      fireEvent.click(details.querySelector("summary")!);
      expect(details).toHaveAttribute("open");
    }
    expect(container.querySelectorAll(".ai-topic-terms details")).toHaveLength(topic.detail.termExplanations?.length ?? 0);
    if (topic.detail.lab) {
      fireEvent.click(screen.getByRole("button", { name: topic.detail.lab.buttonLabel[language] }));
      expect(onOpenLab).toHaveBeenCalledOnce();
    } else {
      expect(container.querySelector(".ai-topic-lab-entry")).not.toBeInTheDocument();
      expect(onOpenLab).not.toHaveBeenCalled();
    }
    unmount();
  }
});

it("keeps advanced AI article content folded and out of the page contents", () => {
  const topic = topics.find(candidate => candidate.detail.lab?.initialMode === "event")!;
  const { container } = render(<AiAudioTopicPage
    topic={topic} mode="event" language="zh" onBack={() => {}} onOpenLab={() => {}}
  />);
  const advanced = container.querySelector(".ai-topic-advanced-reading") as HTMLElement;
  const details = advanced.querySelector(".ai-topic-advanced-details") as HTMLElement;

  expect(details).not.toHaveAttribute("open");
  expect(details.querySelectorAll("h2")).toHaveLength(0);
  expect(within(advanced).getByRole("heading", { name: "进阶阅读" })).toBeInTheDocument();
  expect(within(advanced).getByText("进阶阅读", { selector: "summary" })).toBeInTheDocument();

  fireEvent.click(within(advanced).getByText("进阶阅读", { selector: "summary" }));
  expect(within(advanced).getByRole("heading", { name: "工程技术剖面" })).toBeInTheDocument();
  expect(within(advanced).getByRole("region", { name: "经典与补充方案" })).toBeInTheDocument();
  expect(within(advanced).getByText(aiArticles.event.equations[0].expression)).toBeInTheDocument();
  expect(within(advanced).getByText("全面概述", { selector: "summary" })).toBeInTheDocument();
  expect(Array.from(container.querySelectorAll(".sound-topic-content h2")).map(heading => heading.textContent))
    .not.toContain("工程技术剖面");
});

it("keeps codec equations in the lab instead of duplicating them in the article", () => {
  const topic = topics.find(candidate => candidate.detail.lab?.initialMode === "codec")!;
  const { container } = render(<AiAudioTopicPage
    topic={topic} mode="codec" language="zh" onBack={() => {}} onOpenLab={() => {}}
  />);
  fireEvent.click(within(container).getByText("进阶阅读", { selector: "summary" }));
  expect(container.querySelector(".ai-topic-advanced-details") as HTMLElement)
    .not.toHaveTextContent(aiArticles.codec.equations[0].expression);
});
