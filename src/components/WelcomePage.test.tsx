import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import App from "../App";

afterEach(() => {
  cleanup();
  window.history.replaceState(null, "", window.location.pathname);
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
  fireEvent.click(screen.getByRole("button", { name: language === "zh" ? "English" : "中文" }));
  expect(screen.getByRole("link", { name: language === "zh" ? "Explore audio knowledge" : "进入音频知识库" })).toBeInTheDocument();
});
