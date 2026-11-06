import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { categories, type Language } from "../content/knowledge";
import { CoreSignalProcessingPage } from "./CoreSignalProcessingPage";

const category = categories.find(item => item.id === "dsp")!;
const topic = { ...category.topics.find(item => item.detail.lab?.type === "core-signal-processing")!, category };

describe("Core signal processing reading", () => {
  it.each<Language>(["zh", "zh-Hant", "en", "ja", "ko"])("groups concepts once and preserves the lab in %s", async language => {
    const onOpenLab = vi.fn();
    render(<CoreSignalProcessingPage language={language} topic={topic} onBack={vi.fn()} onOpenLab={onOpenLab} />);
    const groups = document.querySelectorAll(".core-topic-concept-group");
    expect(Array.from(groups).map(group => group.querySelectorAll("article").length)).toEqual([4, 2, 1]);
    for (const term of topic.detail.termExplanations!) {
      expect(screen.getAllByRole("heading", { name: term.name[language] })).toHaveLength(1);
    }
    expect(document.querySelector(".core-topic-key-points")).not.toBeInTheDocument();
    expect(screen.getByText(/Δf = fs\/NFFT/)).toBeInTheDocument();
    const lab = screen.getByRole("button", { name: topic.detail.lab!.buttonLabel[language] });
    expect(lab.compareDocumentPosition(groups[0]) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    await userEvent.click(lab);
    expect(onOpenLab).toHaveBeenCalledOnce();
  });
});
