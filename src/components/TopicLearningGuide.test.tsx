import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Language } from "../content/knowledge";
import type { TopicKey } from "../content/relatedTopics";
import { topicLearning } from "../content/topicLearning";
import { topicHref, topicRoutes } from "../content/topicRoutes";
import { TopicLearningGuide } from "./TopicLearningGuide";
import { RelatedTopics } from "./RelatedTopics";

const languages: Language[] = ["zh", "zh-Hant", "en", "ja", "ko"];

describe("learning continuity", () => {
  it("covers all topics with valid, noncircular prerequisites and tasks only for existing labs", () => {
    const keys = topicRoutes.map(entry => entry.key);
    expect(Object.keys(topicLearning).sort()).toEqual([...keys].sort());
    for (const entry of topicRoutes) {
      const learning = topicLearning[entry.key];
      expect(keys).toContain(learning.next);
      expect(learning.next).not.toBe(entry.key);
      expect(Boolean(learning.labTask)).toBe(Boolean(entry.labView));
      const visited = new Set<TopicKey>([entry.key]);
      let prerequisite = learning.prerequisite;
      while (prerequisite) {
        expect(keys).toContain(prerequisite);
        expect(visited.has(prerequisite)).toBe(false);
        visited.add(prerequisite);
        prerequisite = topicLearning[prerequisite].prerequisite;
      }
      for (const language of languages) {
        for (const copy of [learning.prerequisiteNote, learning.question, learning.transition]) {
          expect(copy[language].trim()).not.toBe("");
        }
        if (learning.labTask) expect(learning.labTask[language].trim()).not.toBe("");
      }
    }
  });

  it.each(languages)("renders the prerequisite and question in %s", language => {
    const learning = topicLearning["ai-asr"];
    render(<TopicLearningGuide topicKey="ai-asr" language={language} />);
    const panel = screen.getByRole("complementary");
    expect(within(panel).getByText(learning.question[language])).toBeVisible();
    expect(within(panel).getByText(learning.prerequisiteNote[language])).toBeVisible();
    expect(within(panel).getByRole("link")).toHaveAttribute("href", topicHref(learning.prerequisite!));
  });

  it("keeps the lab focused on its experiment, without repeating the article introduction", () => {
    const learning = topicLearning["ai-asr"];
    const view = render(<TopicLearningGuide topicKey="ai-asr" language="en" lab />);
    expect(screen.getByRole("complementary", { name: "Experiment goal" })).toHaveTextContent(learning.labTask!.en);
    expect(screen.queryByText(learning.question.en)).not.toBeInTheDocument();
    view.rerender(<TopicLearningGuide topicKey="system-audio" language="en" lab />);
    expect(screen.queryByRole("complementary")).not.toBeInTheDocument();
  });

  it("provides one reasoned next-reading link and preserves modified-click behavior", () => {
    const onOpen = vi.fn();
    const learning = topicLearning.microphone;
    render(<RelatedTopics topicKey="microphone" language="en" onOpen={onOpen} />);
    const region = screen.getByRole("region", { name: "Related knowledge" });
    const links = within(region).getAllByRole("link");
    expect(new Set(links.map(link => link.getAttribute("href"))).size).toBe(links.length);
    const next = links[0];
    expect(next).toHaveAttribute("href", topicHref(learning.next));
    expect(next.closest("li")).toHaveTextContent(learning.transition.en);
    fireEvent.click(next, { ctrlKey: true });
    expect(onOpen).not.toHaveBeenCalled();
    fireEvent.click(next);
    expect(onOpen).toHaveBeenCalledWith(topicRoutes.find(entry => entry.key === learning.next)!.topic);
  });
});
