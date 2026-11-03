import { expect, it } from "vitest";
import { createSamplePoints, quantize } from "./DigitalAudioLab";

it("keeps unsigned codes and plotted quantized values consistent at every supported depth", () => {
  for (let bits = 2; bits <= 8; bits++) {
    const levels = 2 ** bits;
    expect(quantize(-1, bits)).toBe(-1);
    expect(quantize(1, bits)).toBe(1);
    for (const frequency of [1, 3, 8]) {
      for (const point of createSamplePoints(64, bits, frequency)) {
        expect(parseInt(point.pcmBinary, 2)).toBe(point.pcmInteger);
        expect(point.pcmBinary).toHaveLength(bits);
        expect(point.quantizedValue).toBeCloseTo(2 * point.pcmInteger / (levels - 1) - 1, 12);
        const analog = (170 - point.analogY) / 94;
        expect(Math.abs(analog - point.quantizedValue)).toBeLessThanOrEqual(1 / (levels - 1) + 1e-12);
      }
    }
  }
});
