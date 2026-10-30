import { describe, expect, it } from "vitest";
import { compressedOutputDb, dynamicsFrame } from "./dynamicsModel";

describe("static compression teaching model", () => {
  it("leaves below-threshold and ratio-one inputs unchanged", () => {
    expect(compressedOutputDb(-30, -18, 3)).toBe(-30);
    expect(compressedOutputDb(-18, -18, 3)).toBe(-18);
    expect(compressedOutputDb(-6, -18, 1)).toBe(-6);
  });
  it("keeps the selected example, gain and linear PCM scaling consistent", () => {
    const frame = dynamicsFrame(250, -18, 3);
    expect(frame.inputDb).toBe(-6);
    expect(frame.outputDb).toBe(-14);
    expect(frame.gainDb).toBe(-8);
    expect(frame.linearGain).toBeCloseTo(0.398107, 6);
    expect(20 * Math.log10(10 ** (frame.inputDb / 20) * frame.linearGain)).toBeCloseTo(frame.outputDb, 10);
  });
  it("keeps the input fixed as compression increases and gain never positive", () => {
    for (let time = 0; time <= 1000; time += 10) {
      const normal = dynamicsFrame(time, -18, 3);
      const lowerThreshold = dynamicsFrame(time, -30, 3);
      const higherRatio = dynamicsFrame(time, -18, 12);
      expect(lowerThreshold.inputDb).toBe(normal.inputDb);
      expect(higherRatio.inputDb).toBe(normal.inputDb);
      expect(lowerThreshold.outputDb).toBeLessThanOrEqual(normal.outputDb);
      expect(higherRatio.outputDb).toBeLessThanOrEqual(normal.outputDb);
      expect(normal.gainDb).toBeLessThanOrEqual(0);
      expect(normal.linearGain).toBeGreaterThan(0);
      expect(normal.linearGain).toBeLessThanOrEqual(1);
    }
  });
});
