import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ContentCredibility } from "./ContentCredibility";
import { topicRoutes } from "../content/topicRoutes";
import { topicCredibility, evidenceKinds } from "../content/topicCredibility";
import { aiModelReviewDate } from "../content/aiModelReferences";
import type { Language } from "../content/knowledge";

const languages: Language[] = ["zh", "zh-Hant", "en", "ja", "ko"];

describe("content provenance", () => {
  it("covers every article and lab with explicit dates, localized assumptions, scoped methods and sources", () => {
    expect(Object.keys(topicCredibility).sort()).toEqual(topicRoutes.map(entry => entry.key).sort());
    for (const entry of topicRoutes) {
      const info = topicCredibility[entry.key];
      expect(info.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(info.sources.length).toBeGreaterThan(0);
      expect(new Set(info.sources.map(source => source.url)).size).toBe(info.sources.length);
      for (const source of info.sources) {
        expect(new URL(source.url).protocol).toBe("https:");
        expect(source.name.trim()).not.toBe("");
      }
      expect(info.methods.length).toBeGreaterThan(0);
      expect(new Set(info.methods.map(method => method.kind)).size).toBe(info.methods.length);
      for (const language of languages) {
        expect(info.assumptions[language].trim()).not.toBe("");
        for (const method of info.methods) {
          expect(method.scope[language].trim()).not.toBe("");
          expect(evidenceKinds[method.kind].label[language].trim()).not.toBe("");
          expect(evidenceKinds[method.kind].meaning[language].trim()).not.toBe("");
        }
      }
    }
  });

  it.each(languages)("renders sources, dates and assumptions in %s", language => {
    const info = topicCredibility["audio-units"];
    render(<ContentCredibility topicKey="audio-units" language={language} />);
    const panel = screen.getByRole("complementary");
    expect(panel.querySelector("time")).toHaveAttribute("dateTime", info.updatedAt);
    expect(panel.querySelector("details")).not.toHaveAttribute("open");
    fireEvent.click(panel.querySelector("summary")!);
    expect(panel.querySelector("details")).toHaveAttribute("open");
    expect(within(panel).getByText(info.assumptions[language], { exact: false })).toBeVisible();
    for (const source of info.sources) {
      const link = within(panel).getByRole("link", { name: source.name });
      expect(link).toHaveAttribute("href", source.url);
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });

  it("separates offline teaching-CNN computation from reference-model inference and model review dates", () => {
    render(<ContentCredibility topicKey="ai-enhancement" language="en" lab />);
    expect(screen.getByText(/does not run the referenced models/)).toBeVisible();
    const panel = screen.getByRole("complementary");
    fireEvent.click(panel.querySelector("summary")!);
    expect(screen.getByText(/Offline teaching-CNN training\/inference/)).toBeVisible();
    expect(screen.getByText(/not full online DPDFNet inference/)).toBeVisible();
    const dates = Array.from(panel.querySelectorAll("time")).map(time => time.dateTime);
    expect(dates).toEqual([topicCredibility["ai-enhancement"].updatedAt, aiModelReviewDate]);
  });

  it("does not label a static neural-codec explanation as executed quantization", () => {
    expect(topicCredibility["ai-codec"].methods.map(method => method.kind)).toEqual(["illustration"]);
    expect(topicCredibility["ai-codec"].assumptions.en).toContain("No neural codec or real codebook search runs");
    expect(topicCredibility["ai-event"].assumptions.en).toContain("presets");
    expect(topicCredibility["speech-enhancement"].assumptions.en).toContain("knows the synthetic");
  });
});
