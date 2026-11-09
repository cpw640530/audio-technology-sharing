import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { AiAudioOverview } from "./AiAudioOverview";

it.each(["zh", "zh-Hant", "en", "ja", "ko"] as const)("explores AI tasks directly within the overview guide (%s)", language => {
  const onOpen = vi.fn();
  const { container } = render(<AiAudioOverview language={language} onOpen={onOpen} />);
  expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(4);
  expect(container.querySelectorAll(".ai-representations > div")).toHaveLength(3);
  expect(container.textContent).not.toMatch(/undefined/);
  expect(screen.getByRole("link", { name: "EnCodec" })).toHaveAttribute("href", "https://github.com/facebookresearch/encodec");

  expect(container.querySelector(".denoise-explanation")).toBeInTheDocument();
  const switches = container.querySelectorAll(".ai-task-switcher button");
  expect(switches).toHaveLength(4);
  expect(switches[0]).toHaveAttribute("aria-pressed", "true");
  expect(switches[2]).toHaveAttribute("aria-pressed", "false");
  const initial = container.querySelector("ol")!.textContent;
  fireEvent.click(screen.getAllByRole("button")[2]);
  expect(switches[0]).toHaveAttribute("aria-pressed", "false");
  expect(switches[2]).toHaveAttribute("aria-pressed", "true");
  expect(container.querySelector("ol")!.textContent).not.toBe(initial);
  expect(container.querySelectorAll("ol")[0].querySelectorAll("li")).toHaveLength(5);
  expect(container.querySelectorAll("ol")[0].querySelectorAll(".ai-overview-visual")).toHaveLength(5);
  fireEvent.click(screen.getByRole("button", { name: /TTS/ }));
  expect(onOpen).toHaveBeenCalledWith("tts");
  expect(container.textContent).not.toMatch(/undefined/);
});

it("updates a real scalar gradient calculation while inference leaves weights unchanged", () => {
  render(<AiAudioOverview language="zh" />);
  expect(screen.getByTestId("overview-weight")).toHaveTextContent("w=0.2000");
  expect(screen.getByTestId("overview-loss")).toHaveTextContent("0.360000");
  const input=screen.getByRole("slider", {name:/新输入 x/});
  fireEvent.change(input,{target:{value:"1"}});
  expect(screen.getByTestId("overview-inference")).toHaveTextContent("0.2000");
  expect(screen.getByTestId("overview-weight")).toHaveTextContent("w=0.2000");
  fireEvent.click(screen.getByRole("button",{name:"更新一次"}));
  expect(screen.getByTestId("overview-weight")).toHaveTextContent("w=0.5000");
  expect(screen.getByTestId("overview-loss")).toHaveTextContent("0.090000");
  expect(screen.getByTestId("overview-inference")).toHaveTextContent("0.5000");
  for(let i=0;i<4;i++) fireEvent.click(screen.getByRole("button",{name:"更新一次"}));
  expect(screen.getByRole("button",{name:"更新一次"})).toBeDisabled();
  expect(screen.getByTestId("overview-loss")).toHaveTextContent("0.000352");
  fireEvent.click(screen.getByRole("button",{name:"重置训练"}));
  expect(screen.getByTestId("overview-weight")).toHaveTextContent("w=0.2000");
});
