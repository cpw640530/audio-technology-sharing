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
  const pause = screen.getByRole("button", { name: language === "zh" ? "暂停背景动画" : "Pause background animation" });
  fireEvent.click(pause);
  expect(pause).toHaveAttribute("aria-pressed", "true");
  expect(container.querySelector(".welcome-page")).toHaveAttribute("data-paused", "true");
  fireEvent.click(pause);
  expect(pause).toHaveAttribute("aria-pressed", "false");
  expect(screen.getByRole("link", { name: language === "zh" ? "进入音频知识库" : "Explore audio knowledge" })).toHaveAttribute("href", "#top");
  window.history.replaceState(null, "", "#top");
  fireEvent(window, new HashChangeEvent("hashchange"));
  expect(screen.getByTestId("topic-grid")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: language === "zh" ? "返回欢迎页" : "Back to welcome page" })).toHaveAttribute("href", "#welcome");
  window.history.replaceState(null, "", "#welcome");
  fireEvent(window, new HashChangeEvent("hashchange"));
  expect(screen.queryByTestId("topic-grid")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: language === "zh" ? "English" : "中文" }));
  expect(screen.getByRole("link", { name: language === "zh" ? "Explore audio knowledge" : "进入音频知识库" })).toBeInTheDocument();
});
