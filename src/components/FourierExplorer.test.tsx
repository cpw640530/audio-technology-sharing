import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { analyzeTones, FourierExplorer } from "./FourierExplorer";

afterEach(cleanup);
describe("Fourier explorer", () => {
  it("recovers amplitude and cosine-reference phase from samples", () => {
    for (const phase of [0, 45, 90, 180]) {
      const { bins } = analyzeTones([{ frequency: 5, amplitude: .7, phase }]);
      expect(bins[5].amplitude).toBeCloseTo(.7, 10);
      expect(bins[5].phase).toBeCloseTo(phase - 90, 10);
      expect(bins[4].amplitude).toBeLessThan(1e-10);
    }
  });
  it("adds equal-frequency components with their phase and preserves mean-square power", () => {
    const cancelled = analyzeTones([{ frequency: 3, amplitude: 1, phase: 0 }, { frequency: 3, amplitude: 1, phase: 180 }]);
    expect(Math.max(...cancelled.samples.map(Math.abs))).toBeLessThan(1e-10);
    const { samples, bins } = analyzeTones([{ frequency: 2, amplitude: .6, phase: 30 }, { frequency: 8, amplitude: .3, phase: 90 }]);
    const meanSquare = samples.reduce((sum, value) => sum + value * value, 0) / samples.length;
    expect(meanSquare).toBeCloseTo(bins.reduce((sum, value) => sum + value.amplitude ** 2 / 2, 0), 10);
  });
  it("updates the waveform and spectrum immediately, then resets", () => {
    render(<FourierExplorer language="en"/>);
    const original = screen.getByTestId("fourier-sum").getAttribute("d");
    fireEvent.change(screen.getByRole("slider", { name: /Amplitude B/ }), { target: { value: "0.8" } });
    expect(screen.getByTestId("fourier-sum").getAttribute("d")).not.toBe(original);
    expect(Number(screen.getAllByTestId("fourier-bin")[5].getAttribute("height"))).toBeCloseTo(.8 * 48, 10);
    fireEvent.click(screen.getByRole("button", { name: "Reset Fourier explorer" }));
    expect(screen.getByTestId("fourier-sum").getAttribute("d")).toBe(original);
  });
  it.each(["zh", "zh-Hant", "en", "ja", "ko"] as const)("renders both plots in %s", language => {
    const { container } = render(<FourierExplorer language={language}/>);
    expect(screen.getAllByRole("img")).toHaveLength(2);
    expect(screen.getAllByRole("slider")).toHaveLength(10);
    expect(container.innerHTML).not.toMatch(/NaN|undefined/);
  });
});
