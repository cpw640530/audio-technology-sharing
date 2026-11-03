import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { DigitalAudioLab } from "./DigitalAudioLab";
afterEach(cleanup);
it.each(["zh", "en"] as const)("loads controlled comparisons (%s)", language => {
  render(<DigitalAudioLab language={language} onBack={() => {}} />);
  const select = screen.getByRole("combobox");
  const samples = screen.getByRole("slider", { name: language === "zh" ? "采样点数" : "Sample count" });
  const bits = screen.getByRole("slider", { name: language === "zh" ? "位深" : "Bit depth" });
  const frequency = screen.getByRole("slider", { name: language === "zh" ? "输入频率" : "Input frequency" });
  for (const [preset, count, depth, cycles] of [["sparse", 8, 4, 7], ["dense", 48, 4, 7], ["coarse", 24, 2, 2], ["fine", 24, 8, 2], ["pcm", 24, 4, 2]] as const) {
    fireEvent.change(select, { target: { value: preset } });
    expect(samples).toHaveValue(String(count));
    expect(bits).toHaveValue(String(depth));
    expect(frequency).toHaveValue(String(cycles));
  }
});
