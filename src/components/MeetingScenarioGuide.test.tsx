import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import type { Language } from "../content/knowledge";
import { MeetingScenarioGuide } from "./MeetingScenarioGuide";

const languages = ["zh", "zh-Hant", "en", "ja", "ko"] as const;
const headings: Record<Language, string> = {
  zh: "会议场景对比",
  "zh-Hant": "會議場景對比",
  en: "Meeting scenario comparison",
  ja: "会議シーン比較",
  ko: "회의 장면 비교"
};

it.each(languages)("renders the embedded meeting guide in %s", language => {
  const { container } = render(<MeetingScenarioGuide language={language} />);
  const root = container.querySelector("section.sound-topic-section.meeting-scenario-guide");

  expect(root).toBeInTheDocument();
  expect(root).toHaveAttribute("aria-label", headings[language]);
  expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(headings[language]);
  expect(root!.querySelectorAll("h2")).toHaveLength(1);
  expect(screen.getAllByRole("button")).toHaveLength(4);
  expect(screen.getAllByRole("button", { pressed: true })).toHaveLength(1);
  expect(container.querySelector("main, h1, .sound-lab-back-actions, .sound-lab-hero, [class*='lab-entry']")).not.toBeInTheDocument();
  expect(container.textContent).not.toMatch(/(?:Lab|实验室|ラボ|랩)/);
});

it("switches all four scenarios and preserves the caption branch and accessible SVG markers", () => {
  const { container } = render(<MeetingScenarioGuide language="en" />);
  const scenarioNames = [
    "Personal device",
    "Meeting room",
    "Poor network",
    "Live captions"
  ];

  for (const name of scenarioNames) {
    expect(screen.getByRole("button", { name })).toBeInTheDocument();
  }

  fireEvent.click(screen.getByRole("button", { name: "Meeting room" }));
  expect(screen.getByRole("heading", { level: 3, name: "Meeting room: far-field pickup" })).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Poor network" }));
  expect(screen.getByRole("heading", { level: 3, name: "Poor network: continuous listening" })).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Live captions" }));
  expect(screen.getByRole("heading", { level: 3, name: "Live captions: recognition side path" })).toBeInTheDocument();
  expect(container.querySelector(".meeting-optional-branch")).toHaveTextContent("Optional translation branch");
  expect(container.querySelector('[data-caption-route="direct-asr-to-captions"]')).toBeInTheDocument();
  expect(container.querySelector('[data-caption-route="optional-translation"]')).toBeInTheDocument();

  const markers = [...container.querySelectorAll("svg marker")];
  const markerIds = markers.map(marker => marker.id);
  expect(markers).toHaveLength(2);
  expect(new Set(markerIds).size).toBe(markerIds.length);
  expect(container.querySelector("svg")).toHaveAttribute("role", "img");
  expect(container.querySelector("svg title")).toBeInTheDocument();
  expect(container.querySelector("svg desc")).toBeInTheDocument();
  expect(container.querySelector("figure[role='region']")).toHaveAttribute("tabindex", "0");
  expect(container.querySelectorAll(".meeting-arrow").length).toBeGreaterThan(0);
  expect(container.querySelectorAll("h4").length).toBeGreaterThan(0);
});
