import { waitFor, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import App from "./App";
import { categories } from "./content/knowledge";

beforeEach(() => {
  window.history.replaceState(null, "", "#top");
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
});
afterEach(cleanup);

const cases = categories.flatMap(category => category.topics.flatMap(topic =>
  (["ja", "ko", "zh-Hant"] as const).map(language => ({ title: topic.title.en, topic, language }))
));

it.each(cases)("opens the translated guide and its lab: $title ($language)", async ({ topic, language }) => {
  window.localStorage.setItem("audio-technology-language", language);
  const view = render(<App />);
  const outline = view.container.querySelector<HTMLElement>(".knowledge-outline")!;
  fireEvent.click(within(outline).getByRole("link", { name: topic.title[language] }));
    await waitFor(() => expect(document.querySelector(".route-loading")).not.toBeInTheDocument());
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(topic.title[language]);
  const entry = view.container.querySelector<HTMLButtonElement>(".diagram-open-button");
  if (topic.detail.lab) {
    expect(entry, `${topic.title.en}: lab entry`).not.toBeNull();
    expect(entry?.textContent?.trim()).toBeTruthy();
    fireEvent.click(entry!);
    await waitFor(() => expect(document.querySelector(".route-loading")).not.toBeInTheDocument());
  } else {
    expect(entry).toBeNull();
    if (topic.title.en === "Audio Codecs") {
      expect(view.container.querySelector(".audio-codec-topic-page")).toBeInTheDocument();
      expect(view.container.querySelectorAll(".codec-inline-visual")).toHaveLength(4);
    } else if (topic.title.en === "Conferencing and Communication" || topic.title.en === "IoT and Content Creation") {
      expect(view.container.querySelector(".application-topic-page")).toBeInTheDocument();
      expect(view.container.querySelector(topic.title.en === "Conferencing and Communication" ? ".meeting-scenario-guide" : ".iot-troubleshooting")).toBeInTheDocument();
    } else {
      expect(view.container.querySelector(topic.title.en === "AI Audio Overall Flow" ? ".ai-overview" : ".system-audio-inline")).toBeInTheDocument();
    }
  }
  expect(screen.getByRole("heading", { level: 1 }).textContent?.trim()).toBeTruthy();
  expect(screen.getByRole("combobox", { name: /Language/ })).toHaveValue(language);
  expect(view.container.textContent).not.toMatch(/undefined|\[object Object\]/);
});
