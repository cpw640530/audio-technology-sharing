import { describe, expect, it } from "vitest";
import { decodeImaSample, encodeImaTrace } from "./imaAdpcm";

describe("IMA/DVI ADPCM sample rules", () => {
  it("decodes all nibbles at the reference initial step of 7", () => {
    const values = [0, 1, 3, 4, 7, 8, 10, 11, 0, -1, -3, -4, -7, -8, -10, -11];
    values.forEach((sample, code) => expect(decodeImaSample(code, 0, 0)).toEqual({ sample, index: [0, 0, 0, 0, 2, 4, 6, 8][code & 7] }));
  });
  it("encodes a known sequence using reconstructed history and adaptive steps", () => {
    const rows = encodeImaTrace([0, 1000, 1000, -1000, 0], 0);
    expect(rows.map(row => row.code)).toEqual([7, 7, 15, 1]);
    expect(rows.map(row => row.reconstructed)).toEqual([11, 41, -22, 5]);
    expect(rows.map(row => row.step)).toEqual([7, 16, 34, 73]);
    expect(rows.map(row => row.prediction)).toEqual([0, 11, 41, -22]);
  });
  it("saturates predictor and step index and rejects invalid input", () => {
    expect(decodeImaSample(7, 32760, 88)).toEqual({ sample: 32767, index: 88 });
    expect(decodeImaSample(15, -32760, 88)).toEqual({ sample: -32768, index: 88 });
    expect(decodeImaSample(0, 0, 0).index).toBe(0);
    for (const bad of [NaN, Infinity, -1, 89, 0.5]) expect(() => encodeImaTrace([0, 10], bad)).toThrow(RangeError);
    for (const samples of [[], [32768], [-32769], [NaN], [1.5]]) expect(() => encodeImaTrace(samples, 0)).toThrow(RangeError);
    expect(() => decodeImaSample(16, 0, 0)).toThrow(RangeError);
  });
  it("can decode the codes without access to the original samples", () => {
    for (const initial of [0, 40, 88]) {
      const samples = Array.from({ length: 80 }, (_, n) => Math.round(32000 * Math.sin(n * 1.7)));
      const rows = encodeImaTrace(samples, initial);
      let prediction = samples[0];
      let index = initial;
      for (const row of rows) {
        const result = decodeImaSample(row.code, prediction, index);
        expect(result.sample).toBe(row.reconstructed);
        expect(result.sample).toBeGreaterThanOrEqual(-32768);
        expect(result.sample).toBeLessThanOrEqual(32767);
        expect(row.error).toBe(row.reconstructed - row.original);
        prediction = result.sample;
        index = result.index;
      }
    }
  });
});
