import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { categories, type Language } from "../content/knowledge";
import { HardwareTopicPage } from "./HardwareTopicPage";

const category = categories.find(item => item.id === "hardware")!;
const topic = { ...category.topics.find(item => item.detail.lab?.type === "amplifier-speaker")!, category };

describe("Amplifier and speaker reading", () => {
  it.each<Language>(["zh", "zh-Hant", "en", "ja", "ko"])("groups each concept once and keeps the lab accessible in %s", async language => {
    const onOpenLab = vi.fn();
    render(<HardwareTopicPage language={language} topic={topic} onBack={vi.fn()} onOpenLab={onOpenLab} />);
    const groups = Array.from(document.querySelectorAll('section[id^="speaker-"]'));
    expect(groups).toHaveLength(5);
    expect(groups.map(group => within(group as HTMLElement).getAllByRole("heading", { level: 3 }).length)).toEqual([3, 2, 2, 3, 1]);
    for (const term of topic.detail.termExplanations!) {
      expect(screen.getAllByRole("heading", { name: term.name[language], level: 3 })).toHaveLength(1);
    }
    expect(document.querySelector(".hardware-topic-key-points")).not.toBeInTheDocument();
    expect(document.querySelector(".hardware-chain-context")).not.toBeInTheDocument();
    expect(screen.getByText(/P = V²\/R = 2 W/)).toBeInTheDocument();
    const lab = screen.getByRole("button", { name: topic.detail.lab!.buttonLabel[language] });
    expect(lab.compareDocumentPosition(groups[0]) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    await userEvent.click(lab);
    expect(onOpenLab).toHaveBeenCalledOnce();
    expect(document.querySelector(".feedback")).toHaveAttribute("d", "M438 150 V238 H240 V179");
  });
});
