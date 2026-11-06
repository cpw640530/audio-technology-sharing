import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { categories, type Language } from "../content/knowledge";
import { SystemAudioPage } from "./SystemAudioPage";

const category = categories.find(item => item.id === "software")!;
const topic = { ...category.topics.find(item => item.title.en === "System Audio Architecture")!, category };

describe("System audio reading", () => {
  it.each<Language>(["zh", "zh-Hant", "en", "ja", "ko"])("follows directions, responsibilities, inline diagrams and routing without duplication in %s", async language => {
    render(<SystemAudioPage language={language} topic={topic} onBack={vi.fn()} />);
    const modes = document.querySelector(".system-topic-modes")!;
    const roles = screen.getByRole("list");
    const diagrams = document.querySelector(".system-topic-diagrams")!;
    const glossary = document.querySelector(".sound-topic-glossary")!;
    expect(modes.querySelectorAll("article")).toHaveLength(3);
    expect(within(roles).getAllByRole("listitem")).toHaveLength(4);
    for (const [first, second] of [[modes, roles], [roles, diagrams], [diagrams, glossary]]) {
      expect(first.compareDocumentPosition(second) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    }
    for (const term of topic.detail.termExplanations!) {
      expect(screen.getAllByRole("heading", { name: term.name[language], level: 3 })).toHaveLength(1);
    }
    expect(screen.getByText(/PipeWire.*WirePlumber/)).toBeInTheDocument();
    expect(document.querySelector(".system-topic-key-points")).not.toBeInTheDocument();
    expect(document.querySelector(".hardware-chain-context")).not.toBeInTheDocument();
    expect(topic.detail.lab).toBeUndefined();
    const buttons = diagrams.querySelectorAll(".waveform-tab");
    await userEvent.click(buttons[1]);
    expect(buttons[1]).toHaveAttribute("aria-pressed", "true");
    expect(screen.getAllByRole("main")).toHaveLength(1);
  });
});
