import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { AiAudioLab } from "./AiAudioLab";

it.each(["zh", "en"] as const)("qualifies neural coding equations (%s)", language => {
  render(<AiAudioLab labId="codec" language={language} onBack={() => {}} />);
  expect(screen.getByText("k* = arg minₖ ||z - eₖ||²; q(z) = eₖ*")).toBeInTheDocument();
  expect(screen.getByText("R = Ftoken · Q · ceil(log2(K)) bit/s")).toBeInTheDocument();
  expect(screen.getByText(/50.*8.*10.*4 kbps/)).toBeInTheDocument();
});

it.each(["zh", "en"] as const)("distinguishes TTS waveform reconstruction routes (%s)", language => {
  render(<AiAudioLab labId="tts" language={language} onBack={() => {}} />);
  fireEvent.click(screen.getByRole("button", { name: language === "zh" ? "3. 模型生成" : "3. Model generation" }));
  expect(screen.getByText("Mel decoder")).toBeInTheDocument();
  expect(screen.getByText("Vocoder → PCM")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "CosyVoice 3" }));
  expect(screen.getByText("CosyVoice3LM → speech tokens")).toBeInTheDocument();
  expect(screen.getByText("Chunked Causal DiT flow matching → Mel")).toBeInTheDocument();
  expect(screen.getByText("Causal HiFT → PCM")).toBeInTheDocument();
  expect(screen.getByText(language === "zh" ? /并非所有 TTS 都有独立时长预测器/ : /Not every TTS uses a separate duration predictor/)).toBeInTheDocument();
});

it.each(["zh", "en"] as const)("orders the concise lab path and keeps sources expandable (%s)", language => {
  const { container } = render(<AiAudioLab labId="tts" language={language} onBack={() => {}} />);
  const sections = Array.from(container.querySelectorAll(".ai-reading-section")).map(el => el.id);
  expect(sections).toEqual(["ai-source", "ai-demo"]);
  const nav = screen.getByRole("navigation", { name: language === "zh" ? "AI 实验室章节" : "AI lab chapters" });
  expect(Array.from(nav.querySelectorAll("a")).map(a => a.getAttribute("href"))).toEqual(sections.map(id => `#${id}`));
  expect(container.querySelectorAll("#ai-principle, #ai-flow, #ai-engineering, #ai-models, #ai-reading")).toHaveLength(0);
  expect(container.querySelector(".ai-reference-flow")).toBeNull();
  expect(container.querySelectorAll(".ai-model-card, .ai-article-card")).toHaveLength(0);
  expect(screen.getByRole("region", { name: language === "zh" ? "TTS 逐步可视化" : "TTS walkthrough" })).toBeInTheDocument();
});

it("scrolls chapter links without changing the independent lab URL", () => {
  const scrollIntoView = vi.fn();
  const originalScrollIntoView = HTMLElement.prototype.scrollIntoView;
  Object.defineProperty(HTMLElement.prototype, "scrollIntoView", { configurable: true, value: scrollIntoView });
  try {
    const { container } = render(<AiAudioLab labId="codec" language="en" onBack={() => {}} />);
    const sourceLink = container.querySelector<HTMLAnchorElement>('nav a[href="#ai-source"]')!;
    fireEvent.click(sourceLink);
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });
    expect(window.location.hash).toBe("");
  } finally {
    Object.defineProperty(HTMLElement.prototype, "scrollIntoView", { configurable: true, value: originalScrollIntoView });
  }
});
