import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
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

it.each(cases)("opens the translated guide and its lab: $title ($language)", ({ topic, language }) => {
  window.localStorage.setItem("audio-technology-language", language);
  const view = render(<App />);
  const grid = within(screen.getByTestId("topic-grid"));
  const title = grid.getByText(topic.title[language], { exact: true });
  const card = title.closest("button");
  expect(card).not.toBeNull();
  fireEvent.click(card!);
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(topic.title[language]);
  const entry = view.container.querySelector<HTMLButtonElement>(".diagram-open-button");
  if (topic.detail.lab) {
    expect(entry, `${topic.title.en}: lab entry`).not.toBeNull();
    expect(entry?.textContent?.trim()).toBeTruthy();
    fireEvent.click(entry!);
  } else {
    expect(entry).toBeNull();
    expect(view.container.querySelector(".system-audio-inline")).toBeInTheDocument();
  }
  expect(screen.getByRole("heading", { level: 1 }).textContent?.trim()).toBeTruthy();
  expect(screen.getByRole("combobox", { name: /Language/ })).toHaveValue(language);
  expect(view.container.textContent).not.toMatch(/undefined|\[object Object\]/);
});
