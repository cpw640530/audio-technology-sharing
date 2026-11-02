import { expect, it } from "vitest";
import { arrayExample, spectralExample } from "./spatialSpectralModel";

it("aligns target channels at the target angle and bypasses with one microphone", () => {
  const a = arrayExample(4, 30);
  a.alignedTarget.forEach(channel => channel.forEach((v, i) => expect(v).toBeCloseTo(a.rawTarget[0][i], 12)));
  expect(a.delays[1]).toBeCloseTo(0.04 * 0.5 / 343, 12);
  expect(arrayExample(1, -60).input).toEqual(arrayExample(1, -60).output);
  const energy = (x: number[]) => x.reduce((s, v) => s + v * v, 0);
  expect(energy(arrayExample(4, -40).outputTarget)).toBeLessThan(energy(a.outputTarget));
  expect(energy(a.outputNoise)).toBeLessThan(energy(arrayExample(4, -40).outputNoise));
});

it("reconstructs unprocessed PCM and uses varying, bounded spectral gains", () => {
  const bypass = spectralExample(0), processed = spectralExample(100);
  bypass.input.forEach((v, i) => expect(bypass.output[i]).toBeCloseTo(v, 11));
  expect(processed.input).toEqual(bypass.input);
  const f = processed.frames[7];
  expect(f.gains[8]).toBeGreaterThan(f.gains[32]); // 500 Hz signal versus 2 kHz interference.
  expect(processed.frames[0].gains).not.toEqual(f.gains);
  for (const frame of processed.frames) frame.gains.forEach((g, k) => {
    expect(g).toBeGreaterThanOrEqual(0.1);
    expect(g).toBeLessThanOrEqual(1);
    expect(frame.outputPower[k]).toBeCloseTo(frame.inputPower[k] * g ** 2, 10);
  });
  expect(processed.output.every(v => Number.isFinite(v) && Math.abs(v) < 1)).toBe(true);
  expect(processed.output.slice(0, 256).reduce((s, v) => s + v * v, 0)).toBeLessThan(processed.input.slice(0, 256).reduce((s, v) => s + v * v, 0));
});
