import { expect, it } from "vitest";
import { soundComponents, soundCoefficients, soundValue } from "./soundCompositionModel";

it("adds pointwise, cancels equal opposite components, and preserves fixed scale", () => {
  for (let i = 0; i < 100; i++) {
    const t = i / 48000;
    const a = soundValue(t, 220, soundComponents("tone", .35, 0, 0));
    expect(soundValue(t, 220, soundComponents("sum", .35, .35, 0))).toBeCloseTo(2 * a);
    expect(soundValue(t, 220, soundComponents("sum", .35, .35, Math.PI))).toBeCloseTo(0);
  }
});

it("uses equivalent Fourier coefficients for audio and visual samples", () => {
  for (const mode of ["tone", "sum", "spectrum"] as const) {
    const parts = soundComponents(mode, .4, .4, .7);
    const { real, imag } = soundCoefficients(parts);
    for (let i = 0; i < 200; i++) {
      const time = i / 48000;
      const audio = Array.from(real).reduce((sum, r, n) => sum + r * Math.cos(2 * Math.PI * 220 * n * time) + imag[n] * Math.sin(2 * Math.PI * 220 * n * time), 0);
      expect(audio).toBeCloseTo(soundValue(time, 220, parts), 6);
      expect(Math.abs(audio)).toBeLessThanOrEqual(1.000001);
    }
  }
});
