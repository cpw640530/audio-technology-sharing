import { expect, it } from "vitest";
import { createDistortionCurve, distortionSample, getDistortionHarmonics } from "./listeningDistortionModel";

it("keeps zero intensity clean and obtains harmonic coefficients from the shaper", () => {
  const clean = createDistortionCurve(0);
  for (const x of [-1, -.3, 0, .7, 1]) expect(distortionSample(clean, x)).toBeCloseTo(x, 6);
  expect(getDistortionHarmonics(0).map(h => h.order)).toEqual([1]);
  const harmonics = getDistortionHarmonics(80);
  expect(harmonics.map(h => h.order)).toEqual([1, 2, 3, 5, 7]);
  // The even quadratic term contributes a negative cosine at twice the fundamental.
  const second = harmonics.find(h => h.order === 2)!;
  expect(second.gain).toBeCloseTo(.8 * (.8 * .18) / (2 * (1 + .8 * .18)), 5);
  expect(second.phase).toBeCloseTo(-Math.PI / 2, 5);
});
