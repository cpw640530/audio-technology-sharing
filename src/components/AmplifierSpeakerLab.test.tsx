import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { Language } from "../content/knowledge";
import { AmplifierSpeakerLab } from "./AmplifierSpeakerLab";

describe("AmplifierSpeakerLab", () => {
  it.each<Language>(["zh", "zh-Hant", "en", "ja", "ko"])("switches all diagrams and preserves return actions in %s", async language => {
    const onBack = vi.fn();
    const onBackToDetails = vi.fn();
    const user = userEvent.setup();
    render(<AmplifierSpeakerLab language={language} onBack={onBack} onBackToDetails={onBackToDetails} />);
    const modes = Array.from(document.querySelectorAll<HTMLButtonElement>(".amp-lab-panel > .waveform-tabs:first-child button"));
    expect(modes).toHaveLength(8);
    const names = new Set<string>();
    for (const mode of modes) {
      await user.click(mode);
      expect(mode).toHaveAttribute("aria-pressed", "true");
      const chart = screen.getByRole("img");
      names.add(chart.getAttribute("aria-label")!);
      expect(document.querySelector(".amp-diagram-figure figcaption")).not.toBeEmptyDOMElement();
      expect(document.querySelector(".amp-lab-model-note")).not.toBeEmptyDOMElement();
    }
    expect(names.size).toBe(8);
    const actions = document.querySelectorAll<HTMLButtonElement>(".sound-lab-back-actions button");
    await user.click(actions[0]);
    await user.click(actions[1]);
    expect(onBack).toHaveBeenCalledOnce();
    expect(onBackToDetails).toHaveBeenCalledOnce();
  });

  it("uses linear A/AB output, modulated D output, and a compact unclipped viewport", async () => {
    render(<AmplifierSpeakerLab language="en" onBack={vi.fn()} />);
    const user = userEvent.setup();
    const chart = screen.getByRole("img");
    expect(chart).toHaveAttribute("viewBox", "0 0 760 310");
    expect(chart.querySelector(".amp-pwm-output")?.getAttribute("d")?.match(/V 138/g)).toHaveLength(10);
    await user.click(screen.getByRole("button", { name: "Class A" }));
    const linear = screen.getByRole("img").querySelector(".amp-output-wave")!.getAttribute("d");
    await user.click(screen.getByRole("button", { name: "Class AB" }));
    expect(screen.getByRole("img").querySelector(".amp-output-wave")).toHaveAttribute("d", linear);
  });

  it("shows a two-tone input and connects separated crossover drivers", async () => {
    render(<AmplifierSpeakerLab language="zh" onBack={vi.fn()} />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "箱体与分频" }));
    const path = screen.getByRole("img").querySelector(".amp-wave-input")!.getAttribute("d")!;
    const points = [...path.matchAll(/[ML] ([\d.]+) ([\d.]+)/g)];
    expect(points).toHaveLength(121);
    for (const index of [0, 10, 30, 45, 90, 120]) {
      const phase = 2 * Math.PI * index / 120;
      expect(Number(points[index][2])).toBeCloseTo(198 - 16 * Math.sin(phase) - 9 * Math.sin(4 * phase), 1);
    }
    await user.click(screen.getByRole("button", { name: "主动 / 被动分频" }));
    const chart = screen.getByRole("img");
    expect(chart.querySelector('path[d="M 336 92 H 424"]')).toBeInTheDocument();
    expect(chart.querySelector('path[d="M 350 356 H 392 V 370 H 432"]')).toBeInTheDocument();
    const low = chart.querySelectorAll("circle.amp-driver-low")[1];
    const high = chart.querySelectorAll("circle.amp-driver-high")[1];
    expect(Number(high.getAttribute("cy")) - Number(low.getAttribute("cy"))).toBeGreaterThan(Number(low.getAttribute("r")) + Number(high.getAttribute("r")));
    expect(screen.getByText(/模拟主动分频不需要 DAC/)).toBeInTheDocument();
  });
});
