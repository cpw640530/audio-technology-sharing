import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { DigitalAudioLab } from "./DigitalAudioLab";

afterEach(cleanup);

it.each(["zh", "en", "ja", "ko", "zh-Hant"] as const)("keeps direct controls without parameter presets (%s)", language => {
  render(<DigitalAudioLab language={language} onBack={vi.fn()} />);
  expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
  const sliders = screen.getAllByRole("slider");
  expect(sliders).toHaveLength(3);
  expect(sliders.map(slider => (slider as HTMLInputElement).value)).toEqual(["24", "4", "2"]);
  const wave = document.querySelector(".digital-analog-path")!;
  const original = wave.getAttribute("d");
  fireEvent.change(sliders[2], { target: { value: "7" } });
  expect(wave.getAttribute("d")).not.toBe(original);
  expect(sliders[0]).toHaveValue("24");
  expect(sliders[1]).toHaveValue("4");
  fireEvent.change(sliders[1], { target: { value: "2" } });
  expect(screen.getAllByTestId("digital-bit-depth-level")).toHaveLength(4);
  expect(sliders[2]).toHaveValue("7");
  expect(document.querySelectorAll(".digital-lab-panel button[aria-pressed='true']")).toHaveLength(1);
});
