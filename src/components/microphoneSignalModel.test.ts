import { expect, it } from "vitest";
import { bitStreamPath, getMicrophoneSignal, makePdmBits, pcmWavePath, pcmWordBits } from "./microphoneSignalModel";

it("derives voltages from complete microphone sensitivity and preamp gain", () => {
  const electret = getMicrophoneSignal("electret", 94);
  expect(electret.pressurePa).toBe(1);
  expect(electret.microphoneVrms).toBeCloseTo(0.00631, 8);
  expect(electret.preampVrms).toBeCloseTo(0.0631, 8);
  expect(electret.requestedDbfs).toBeCloseTo(-24, 2);
  expect(getMicrophoneSignal("electret", 114).preampVrms).toBeCloseTo(0.631, 8);
  expect(getMicrophoneSignal("dynamicVocal", 94).preampVrms).toBeCloseTo(0.2, 8);
  expect(getMicrophoneSignal("digitalMems", 94).requestedDbfs).toBe(-26);
});

it.each(["electret", "dynamicVocal", "digitalMems"] as const)("flags overload and bounds PCM peaks for %s", principle => {
  expect(getMicrophoneSignal(principle, 94).overloaded).toBe(false);
  const loud = getMicrophoneSignal(principle, 124);
  expect(loud.overloaded).toBe(true);
  expect(loud.requestedDbfs).toBeGreaterThan(0);
  expect(loud.outputPeak).toBe(1);
  const coords = pcmWavePath(loud.requestedPeak, 0, 0, 192, 1).match(/-?\d+\.\d+/g)!.map(Number);
  const samples = coords.filter((_, i) => i % 2 === 1);
  expect(Math.max(...samples)).toBe(1);
  expect(Math.min(...samples)).toBe(-1);
  expect(samples.filter(sample => Math.abs(sample) === 1).length).toBeGreaterThan(20);
});

it("averages coherent targets without doubling amplitude and states the ideal noise benefit", () => {
  const array = getMicrophoneSignal("array", 94);
  expect(array.arraySignalRatio).toBe(1);
  expect(array.arrayNoiseRatio).toBe(0.5);
  expect(array.arraySnrGainDb).toBeCloseTo(6.0206, 4);
  expect(getMicrophoneSignal("array", 124).arraySnrGainDb).toBe(array.arraySnrGainDb);
});

it("changes local PDM density, not logic height, as the sine amplitude grows", () => {
  const quiet = makePdmBits(0.05);
  const loud = makePdmBits(1);
  expect(loud).toHaveLength(128);
  expect(loud.every(bit => bit === 0 || bit === 1)).toBe(true);
  expect(loud.slice(0, 64).reduce<number>((a, b) => a + b, 0)).toBeGreaterThan(quiet.slice(0, 64).reduce<number>((a, b) => a + b, 0));
  expect(loud.slice(64).reduce<number>((a, b) => a + b, 0)).toBeLessThan(quiet.slice(64).reduce<number>((a, b) => a + b, 0));
  expect(bitStreamPath(loud, 0, 0, 128, 1)).not.toMatch(/[CL]/);
  expect(pcmWordBits(1).join("")).toBe("0111111111111111");
  expect(pcmWordBits(0.05)).not.toEqual(pcmWordBits(1));
});
