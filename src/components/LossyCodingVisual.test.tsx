import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { LossyCodingVisual, transformQuantization } from "./LossyCodingVisual";

afterEach(cleanup);
describe("Lossy transform coding illustration", () => {
  it("matches an independent DCT analysis and conserves quantization error energy", () => {
    for (const bits of [2, 4, 7, 10]) for (const weak of [0, 0.08, 0.3]) {
      const data = transformQuantization(bits, weak);
      for (let k = 0; k < 32; k++) {
        const analyze = (samples: number[]) => samples.reduce((sum, value, n) => sum + value * Math.cos(Math.PI * (n + 0.5) * k / 32), 0) * Math.sqrt((k === 0 ? 1 : 2) / 32);
        expect(analyze(data.original)).toBeCloseTo(data.coefficients[k], 10);
        expect(analyze(data.reconstructed)).toBeCloseTo(data.quantized[k], 10);
      }
      const spectralError = data.coefficients.reduce((sum, value, k) => sum + (data.quantized[k] - value) ** 2, 0) / 32;
      expect(data.rmse ** 2).toBeCloseTo(spectralError, 12);
      expect(Math.max(...data.reconstructed.map(Math.abs))).toBeLessThanOrEqual(1);
    }
  });
  it("can quantize a weak component to zero without cutting all high frequencies", () => {
    expect(transformQuantization(2, 0.08).quantized[5]).toBe(0);
    expect(transformQuantization(2, 0.3).quantized[5]).toBe(2);
    expect(transformQuantization(10, 0.08).rmse).toBeLessThan(transformQuantization(2, 0.08).rmse);
    for (const [bits, weak] of [[1, 0.1], [11, 0], [3.5, 0], [4, -1], [4, 0.4], [4, NaN]]) expect(() => transformQuantization(bits, weak)).toThrow(RangeError);
  });
  it("updates the spectrum, reconstruction and block budget together", () => {
    const { container } = render(<LossyCodingVisual language="en" />);
    const before = container.querySelector(".predicted polyline")!.getAttribute("points");
    fireEvent.change(screen.getByRole("slider", { name: /Bits per coefficient/ }), { target: { value: "2" } });
    expect(container.querySelector(".predicted polyline")!.getAttribute("points")).not.toBe(before);
    expect(screen.getByRole("status")).toHaveTextContent("32 × 2 = 64 bit");
    fireEvent.change(screen.getByRole("slider", { name: /Weak-component amplitude/ }), { target: { value: "0.3" } });
    expect(container.querySelectorAll('rect[fill="#9b541c"]')[5]).toHaveAttribute("height", "80");
  });
  it.each(["zh", "zh-Hant", "en", "ja", "ko"] as const)("renders the demonstration in %s", language => {
    const { container } = render(<LossyCodingVisual language={language} />);
    expect(screen.getAllByRole("img")).toHaveLength(2);
    expect(screen.getAllByRole("slider")).toHaveLength(2);
    expect(container.innerHTML).not.toMatch(/undefined|NaN|Infinity/);
  });
});
