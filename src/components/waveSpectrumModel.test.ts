import { describe, expect, it } from "vitest";
import { componentFrequencies, componentSample, initialAmplitudes, mixtureSample, periodicCoefficients } from "./waveSpectrumModel";

describe("waveform / spectrum correspondence", () => {
  it.each([0, 90, 180, 360])("preserves spectral magnitudes and RMS at phase %s", phase => {
    const samples = Array.from({ length: 128 }, (_, n) => mixtureSample(n / 16000, initialAmplitudes, phase));
    const meanSquare = samples.reduce((sum, x) => sum + x * x, 0) / samples.length;
    expect(meanSquare).toBeCloseTo(initialAmplitudes.reduce((sum, a) => sum + a * a / 2, 0), 10);
    componentFrequencies.forEach((f, i) => {
      const real = samples.reduce((sum, x, n) => sum + x * Math.cos(2 * Math.PI * f * n / 16000), 0);
      const imag = samples.reduce((sum, x, n) => sum + x * Math.sin(2 * Math.PI * f * n / 16000), 0);
      expect(2 * Math.hypot(real, imag) / samples.length).toBeCloseTo(initialAmplitudes[i], 10);
    });
  });

  it("uses the same phase and amplitudes in Web Audio Fourier coefficients", () => {
    const phase = 135;
    const { real, imag } = periodicCoefficients(initialAmplitudes, phase);
    for (let n = 0; n < 128; n++) {
      const t = n / 16000;
      const synthesized = componentFrequencies.reduce((sum, f, i) => sum + real[i + 1] * Math.cos(2 * Math.PI * f * t) + imag[i + 1] * Math.sin(2 * Math.PI * f * t), 0);
      expect(synthesized).toBeCloseTo(mixtureSample(t, initialAmplitudes, phase), 7);
    }
  });

  it("sums pointwise, stays within the fixed scale and handles silence", () => {
    for (let n = 0; n < 128; n++) {
      const t = n / 16000;
      const sum = componentFrequencies.reduce((value, _, index) => value + componentSample(t, index, .3, index === 2 ? 90 : 0), 0);
      expect(mixtureSample(t, [.3, .3, .3], 90)).toBeCloseTo(sum, 12);
      expect(Math.abs(sum)).toBeLessThanOrEqual(.9);
      expect(mixtureSample(t, [0, 0, 0], 90)).toBe(0);
    }
    expect(mixtureSample(.0005, initialAmplitudes, 0)).not.toBeCloseTo(mixtureSample(.0005, initialAmplitudes, 90));
  });
});
