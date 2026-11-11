import { fireEvent, render, screen, within } from "@testing-library/react";
import { expect, it } from "vitest";
import { aiModelReferences, aiModelReviewDate } from "../content/aiModelReferences";
import type { AiAudioLabId } from "../content/knowledge";
import { AiModelReference } from "./AiModelReference";

const modes = Object.keys(aiModelReferences) as AiAudioLabId[];
it.each(modes)("shows a dated, sourced model path for %s in all five locales", mode => {
  const model = aiModelReferences[mode];
  for (const language of ["zh", "zh-Hant", "en", "ja", "ko"] as const) {
    const { container, unmount } = render(<AiModelReference mode={mode} language={language} />);
    expect(screen.getByRole("heading", { name: model.name })).toBeInTheDocument();
    expect(container.querySelector(`#ai-reference-${mode}-title`)).toHaveTextContent(model.name);
    expect(container.querySelector("time")).toHaveAttribute("datetime", aiModelReviewDate);
    const stages = within(container.querySelector(".ai-reference-flow")!);
    expect(stages.getAllByRole("button")).toHaveLength(4);
    for (const [index, stage] of model.stages.entries()) {
      fireEvent.click(stages.getAllByRole("button")[index]);
      expect(stages.getAllByRole("button")[index]).toHaveAttribute("aria-pressed", "true");
      expect(container.querySelector(".ai-reference-stage")).toHaveTextContent(stage.detail[language]);
      expect(container.querySelectorAll('.ai-reference-flow [aria-pressed="true"]')).toHaveLength(1);
    }
    fireEvent.click(container.querySelector("summary")!);
    expect(container.querySelector("details")).toHaveAttribute("open");
    expect(screen.getByText(model.boundary[language])).toBeInTheDocument();
    for (const source of model.sources) {
      expect(screen.getByRole("link", { name: source.name })).toHaveAttribute("href", source.url);
      expect(new URL(source.url).protocol).toBe("https:");
    }
    expect(container.textContent).not.toMatch(/undefined|\[object Object\]/);
    unmount();
  }
});

it("keeps article summaries compact without duplicating lab stages", () => {
  const { container } = render(<AiModelReference mode="asr" language="en" compact />);
  expect(screen.getByRole("heading", { name: /Qwen3-ASR/ })).toBeInTheDocument();
  expect(container.querySelector(".ai-reference-flow")).toBeNull();
  expect(container.querySelector("details")).not.toHaveAttribute("open");
});

it("resets the inspected stage when the topic changes", () => {
  const { container, rerender } = render(<AiModelReference mode="asr" language="en" />);
  fireEvent.click(screen.getAllByRole("button")[3]);
  rerender(<AiModelReference mode="codec" language="en" />);
  expect(container.querySelector(".ai-reference-stage")).toHaveTextContent(aiModelReferences.codec.stages[0].detail.en);
});

it("does not conflate representations, model inference or public research with deployments", () => {
  expect(aiModelReferences.asr.stages[1].detail.en).toContain("not the PCM sample rate");
  expect(aiModelReferences.asr.comparison.en).toContain("no claim of public weights");
  expect(aiModelReferences.tts.stages[3].detail.en).toContain("not CosyVoice");
  expect(aiModelReferences.enhancement.boundary.en).toContain("does not run DPDFNet");
  expect(aiModelReferences.event.boundary.en).toContain("Lab scores are presets");
  expect(aiModelReferences.codec.stages[2].detail.en).toContain("Tokens/s is not bit/s");
});
