import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import type { Language } from "../content/knowledge";
import { IotTroubleshooting } from "./IotTroubleshooting";

const languages = ["zh", "zh-Hant", "en", "ja", "ko"] as const;
const headings: Record<Language, string> = {
  zh: "典型问题诊断",
  "zh-Hant": "典型問題診斷",
  en: "Common Issue Troubleshooting",
  ja: "典型的な問題の診断",
  ko: "일반 문제 진단"
};

it.each(languages)("renders the embedded troubleshooting section in %s", language => {
  const { container } = render(<IotTroubleshooting language={language} />);
  const root = container.querySelector("section.sound-topic-section.iot-troubleshooting");

  expect(root).toBeInTheDocument();
  expect(root).toHaveAttribute("aria-label", headings[language]);
  expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(headings[language]);
  expect(screen.getAllByRole("article")).toHaveLength(3);
  expect(root!.querySelectorAll("h2")).toHaveLength(1);
  expect(container.querySelector("main, h1, button, .sound-lab-back-actions, .iot-responsive-workflow, .iot-content-diagram")).not.toBeInTheDocument();
  expect(container.textContent).not.toMatch(/(?:Lab|实验室|ラボ|랩)/);
});

it("keeps the playback-reference boundary in the false-wake diagnosis", () => {
  const { container } = render(<IotTroubleshooting language="en" />);

  expect(screen.getByText(/AEC needs the device's actual playback reference/)).toBeInTheDocument();
  expect(screen.getByText(/cannot be assumed to cancel an external TV without a reference/)).toBeInTheDocument();
  expect(container.querySelectorAll(".iot-content-issue-card")).toHaveLength(3);
});
