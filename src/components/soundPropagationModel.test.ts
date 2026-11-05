import { expect, it } from "vitest";
import { propagationSample, propagationFrame, pressureHistory, type PropagationSettings } from "./soundPropagationModel";
const pulse: PropagationSettings = { mode: "pulse", amplitude: 1, rate: 1 };

it("delays the disturbance, returns parcels to rest, and leaves no future record", () => {
  expect(propagationSample(4, .9, pulse)).toEqual({ displacement: 0, pressure: 0 });
  expect(propagationSample(4, 1.25, pulse)).toEqual(propagationSample(0, .25, pulse));
  expect(propagationSample(4, 1.25, pulse).pressure).toBeGreaterThan(0);
  expect(propagationSample(4, 1.75, pulse).pressure).toBeLessThan(0);
  expect(propagationFrame(3.1, pulse)).toEqual(Array(49).fill(0));
  const history = pressureHistory(12, pulse);
  expect(history).toHaveLength(241);
  expect(history[0].time).toBe(4);
  expect(history[history.length - 1].time).toBe(12);
});

it("ties pressure to the time derivative of displacement and to compression", () => {
  const dt = 1e-5;
  const sample = propagationSample(4, 1.25, pulse);
  const velocity = (propagationSample(4, 1.25 + dt, pulse).displacement - propagationSample(4, 1.25 - dt, pulse).displacement) / (2 * dt);
  expect(sample.pressure).toBeCloseTo(velocity / (.22 * Math.PI * 1.5), 6);
  const left = propagationSample(3.99, 1.25, pulse).displacement;
  const right = propagationSample(4.01, 1.25, pulse).displacement;
  expect(right - left).toBeLessThan(0);
});

it("uses fixed scaling and keeps all supported settings bounded and ordered", () => {
  expect(propagationSample(4, 1.25, { ...pulse, amplitude: .5 }).pressure).toBeCloseTo(propagationSample(4, 1.25, pulse).pressure / 2);
  for (const rate of [.5, 1, 1.5]) for (const time of [.25, .5, 1.25, 2.25, 4.25]) {
    const settings: PropagationSettings = { mode: "continuous", amplitude: 1, rate };
    const frame = propagationFrame(time, settings);
    expect(frame.every((d, i) => d >= 0 && d <= .22 && (i === 0 || i / 48 * 8 + d > (i - 1) / 48 * 8 + frame[i - 1]))).toBe(true);
    expect(Math.abs(propagationSample(4, time, settings).pressure)).toBeLessThanOrEqual(1);
  }
});
