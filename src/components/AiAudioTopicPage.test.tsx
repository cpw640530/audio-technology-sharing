import { fireEvent, render, screen, within } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { categories } from "../content/knowledge";
import { AiAudioTopicPage } from "./AiAudioTopicPage";

const topics = categories.flatMap(category => category.topics
  .filter(topic => topic.detail.lab?.type === "ai-audio")
  .map(topic => ({ ...topic, category })));

it.each(topics)("keeps the reading structure and lab entry for $title.en", topic => {
  for (const language of ["zh", "en"] as const) {
    const onOpenLab = vi.fn();
    const { container, unmount } = render(<AiAudioTopicPage
      topic={topic} mode={topic.detail.lab!.initialMode ?? "overview"}
      language={language} onBack={() => {}} onOpenLab={onOpenLab}
    />);
    const headings = Array.from(container.querySelectorAll(".sound-topic-content h2"));
    expect(headings).toHaveLength(6);
    expect(headings.slice(-3).map(heading => heading.textContent)).toEqual(language === "zh"
      ? ["核心知识点", "工程边界", "相关术语"]
      : ["Core concepts", "Engineering boundary", "Related terms"]);
    expect(container.querySelectorAll(".ai-topic-concepts li")).toHaveLength(topic.detail.keyConcepts.length);
    expect(container.querySelectorAll(".ai-topic-flow li")).toHaveLength(4);
    const nav = screen.getByRole("navigation", { name: language === "zh" ? "章节目录" : "Page contents" });
    expect(within(nav).getAllByRole("link").map(link => link.getAttribute("href")))
      .toEqual(headings.map(heading => `#${heading.id}`));
    for (const details of container.querySelectorAll(".ai-topic-terms details")) {
      expect(details).not.toHaveAttribute("open");
      fireEvent.click(details.querySelector("summary")!);
      expect(details).toHaveAttribute("open");
    }
    expect(container.querySelectorAll(".ai-topic-terms details")).toHaveLength(topic.detail.termExplanations?.length ?? 0);
    fireEvent.click(screen.getByRole("button", { name: topic.detail.lab!.buttonLabel[language] }));
    expect(onOpenLab).toHaveBeenCalledOnce();
    unmount();
  }
});
