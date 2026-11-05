import { expect, it } from "vitest";
import { toneResponse, toneSample } from "./listeningToneModel";

it("bypasses exactly at zero and shelves the intended band", () => {
  for (const effect of ["brightness", "muddy"] as const) {
    expect(toneResponse(effect, 0, 1000)).toEqual({ magnitude: 1, phase: 0 });
    expect(Number.isFinite(toneSample(effect, 100, .003))).toBe(true);
  }
  expect(20 * Math.log10(toneResponse("brightness", 100, 20000).magnitude)).toBeCloseTo(16, 1);
  expect(20 * Math.log10(toneResponse("muddy", 100, 20).magnitude)).toBeCloseTo(16, 1);
  expect(toneResponse("muddy", 100, 10000).magnitude).toBeCloseTo(1, 3);
});
