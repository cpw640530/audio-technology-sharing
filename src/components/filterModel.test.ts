import { describe, expect, it } from "vitest";
import { combinedResponse, filterCoefficients, filterSignal, filterTones, frequencyResponse, type FilterType } from "./filterModel";

describe("filter teaching model", () => {
  it("matches RBJ passband, center gain, notch and EQ limits", () => {
    const response = (type: FilterType, f: number) => frequencyResponse(filterCoefficients(type, 1600, Math.SQRT1_2), f).magnitude;
    expect(response("lowpass", 0)).toBeCloseTo(1, 10);
    expect(response("lowpass", 8000)).toBeCloseTo(0, 10);
    expect(response("highpass", 0)).toBeCloseTo(0, 10);
    expect(response("highpass", 8000)).toBeCloseTo(1, 10);
    expect(response("lowpass", 1600)).toBeCloseTo(Math.SQRT1_2, 10);
    expect(response("bandpass", 1600)).toBeCloseTo(1, 10);
    expect(response("notch", 1600)).toBeCloseTo(0, 10);
    expect(combinedResponse("bandpass", 1600, 1600, 20, 12).magnitude).toBeCloseTo(10 ** (12 / 20), 9);
  });

  it.each<FilterType>(["lowpass", "highpass", "bandpass", "notch"])("matches an independently run difference equation for %s", type => {
    const coeffs = [filterCoefficients(type, 1600, 1.2), filterCoefficients("peaking", 1600, 1.2, 9)];
    const states = coeffs.map(() => ({ x1: 0, x2: 0, y1: 0, y2: 0 }));
    let output = 0;
    for (let n = 0; n <= 8000; n++) {
      output = filterSignal(n / 16000, type, 1600, 1.2, 9, false);
      coeffs.forEach(({ b, a }, i) => {
        const s = states[i];
        const y = (b[0] * output + b[1] * s.x1 + b[2] * s.x2 - a[1] * s.y1 - a[2] * s.y2) / a[0];
        s.x2 = s.x1; s.x1 = output; s.y2 = s.y1; s.y1 = y; output = y;
      });
    }
    expect(output).toBeCloseTo(filterSignal(0.5, type, 1600, 1.2, 9, true), 9);
  });

  it("keeps Q=0 and near-Nyquist settings finite without changing input tones", () => {
    for (const type of ["lowpass", "highpass", "bandpass", "notch"] as const)
      for (const cutoff of [200, 7900]) for (const q of [0, 20]) for (const gain of [-12, 12]) {
        for (const tone of filterTones) expect(Number.isFinite(combinedResponse(type, tone.frequency, cutoff, q, gain).magnitude)).toBe(true);
        expect(filterSignal(0.003, type, cutoff, q, gain, false)).toBe(filterSignal(0.003, "lowpass", 2400, 1.2, 0, false));
      }
  });
});
