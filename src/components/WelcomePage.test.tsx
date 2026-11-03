import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import App from "../App";

afterEach(() => {
  cleanup();
  window.history.replaceState(null, "", window.location.pathname);
});

it.each([
  ["ja", "オーディオ技術共有サイト", "オーディオ知識を探る"],
  ["ko", "오디오 기술공유 사이트", "오디오 지식 살펴보기"]
] as const)("switches to %s and remembers it after reload", (language, heading, link) => {
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
  window.localStorage.setItem("audio-technology-language", "en");
  const view = render(<App />);
  fireEvent.change(screen.getByRole("combobox", { name: /Language/ }), { target: { value: language } });
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(heading);
  expect(screen.getByRole("link", { name: link })).toBeInTheDocument();
  expect(document.documentElement.lang).toBe(language);
  expect(window.localStorage.getItem("audio-technology-language")).toBe(language);
  view.unmount();
  render(<App />);
  expect(screen.getByRole("combobox", { name: /Language/ })).toHaveValue(language);
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(heading);
});

it("uses English when the stored language is unsupported", () => {
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
  window.localStorage.setItem("audio-technology-language", "__proto__");
  render(<App />);
  expect(screen.getByRole("combobox", { name: /Language/ })).toHaveValue("en");
  expect(document.documentElement.lang).toBe("en");
});

it.each(["zh", "en"] as const)("opens the welcome page and preserves library navigation (%s)", language => {
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
  window.history.replaceState(null, "", window.location.pathname);
  window.localStorage.setItem("audio-technology-language", language);
  const { container } = render(<App />);
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(language === "zh" ? "音频知识分享网站" : "Audio KnowledgeSharing Website");
  expect(screen.queryByTestId("topic-grid")).not.toBeInTheDocument();
  expect(screen.getByRole("img")).toHaveAttribute("src", expect.stringContaining("images/welcome-listener-light.png"));
  expect(container.querySelectorAll(".welcome-motion button")).toHaveLength(1);
  const music = container.querySelector(".welcome-music");
  expect(screen.getByRole("button", { name: language === "zh" ? "播放背景音乐" : "Play background music" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: language === "zh" ? "进入音频知识库" : "Explore audio knowledge" })).toHaveAttribute("href", "#top");
  window.history.replaceState(null, "", "#top");
  fireEvent(window, new HashChangeEvent("hashchange"));
  expect(screen.getByTestId("topic-grid")).toBeInTheDocument();
  expect(container.querySelector(".welcome-music")).toBe(music);
  expect(screen.getByRole("link", { name: language === "zh" ? "返回欢迎页" : "Back to welcome page" })).toHaveAttribute("href", "#welcome");
  window.history.replaceState(null, "", "#welcome");
  fireEvent(window, new HashChangeEvent("hashchange"));
  expect(screen.queryByTestId("topic-grid")).not.toBeInTheDocument();
  expect(container.querySelector(".welcome-music")).toBe(music);
  fireEvent.change(screen.getByRole("combobox", { name: /Language/ }), { target: { value: language === "zh" ? "en" : "zh" } });
  expect(screen.getByRole("link", { name: language === "zh" ? "Explore audio knowledge" : "进入音频知识库" })).toBeInTheDocument();
});
