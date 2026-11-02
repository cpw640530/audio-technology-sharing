import { fireEvent, render, screen, within } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { SpeechEnhancementLab } from "./SpeechEnhancementLab";

it.each(["zh", "en"] as const)("keeps strengths across independent 3A pages (%s)", language => {
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  render(<SpeechEnhancementLab language={language} onBack={() => {}} />);
  const nav = () => screen.getByRole("navigation", { name: language === "zh" ? "语音增强算法" : "Speech enhancement algorithms" });
  fireEvent.click(within(nav()).getByRole("button", { name: /AEC/ }));
  const slider = () => screen.getByRole("slider");
  fireEvent.change(slider(), { target: { value: "25" } });
  expect(screen.getByTestId("aec-track-output")).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "增强总览" })).not.toBeInTheDocument();
  fireEvent.click(within(nav()).getByRole("button", { name: /NS/ }));
  expect(screen.queryByTestId("aec-track-output")).not.toBeInTheDocument();
  fireEvent.change(slider(), { target: { value: "80" } });
  fireEvent.click(within(nav()).getByRole("button", { name: /AGC/ }));
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("AGC");
  fireEvent.click(within(nav()).getByRole("button", { name: /AEC/ }));
  expect(slider()).toHaveValue("25");
  fireEvent.click(within(nav()).getByRole("button", { name: /NS/ }));
  expect(slider()).toHaveValue("80");
  fireEvent.click(within(nav()).getByRole("button", { name: language === "zh" ? /多麦/ : /Beamforming/ }));
  fireEvent.click(screen.getByRole("button", { name: "1 Mic" }));
  expect(screen.getByRole("group", { name: language === "zh" ? "麦克风数量" : "Microphone count" })).toBeInTheDocument();
  fireEvent.click(within(nav()).getByRole("button", { name: language === "zh" ? /去混响/ : /Dereverb/ }));
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(language === "zh" ? "去混响" : "Dereverb");
  expect(screen.queryByRole("group", { name: language === "zh" ? "麦克风数量" : "Microphone count" })).not.toBeInTheDocument();
  for (const button of within(nav()).getAllByRole("button")) {
    fireEvent.click(button);
    const principle = screen.getByRole("region", { name: language === "zh" ? "基本原理" : "Basic principle" });
    const details = principle.querySelector("details")!;
    if (details.open) fireEvent.click(details.querySelector("summary")!);
    expect(details).not.toHaveAttribute("open");
    fireEvent.click(details.querySelector("summary")!);
    expect(details).toHaveAttribute("open");
    fireEvent.click(details.querySelector("summary")!);
    expect(principle.textContent!.length).toBeGreaterThan(80);
    expect(principle.compareDocumentPosition(slider()) & Node.DOCUMENT_POSITION_FOLLOWING).not.toBe(0);
    expect(screen.getAllByRole("slider")).toHaveLength(1);
  }
});
