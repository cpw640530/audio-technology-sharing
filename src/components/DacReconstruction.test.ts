import { expect, it } from "vitest";
import { reconstructPcm } from "./DacReconstruction";

it("matches the exact RC step response with zero initial output", () => {
  const output = reconstructPcm([1, 1], 100);
  expect(output[0]).toBe(0);
  expect(output[64]).toBeCloseTo(1 - Math.exp(-1), 10);
  expect(output.every(v => v >= 0 && v <= 1)).toBe(true);
  expect(reconstructPcm([1, 1], 5)[64]).toBeGreaterThan(output[64]);
});

it("keeps zero PCM silent and the output continuous at sample changes", () => {
  expect(reconstructPcm([0, 0], 25).every(v => v === 0)).toBe(true);
  const output = reconstructPcm([1, -1, 1], 100);
  expect(output[320]).toBeCloseTo(1 - Math.exp(-5), 10);
  expect(output[321]).toBeLessThan(output[320]);
});
