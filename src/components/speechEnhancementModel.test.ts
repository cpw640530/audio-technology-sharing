import { describe, expect, it } from "vitest";
import { playbackReference, processingThrough, speechComponents, type ProcessingStrengths } from "./speechEnhancementModel";
const strengths: ProcessingStrengths = { beamforming: 65, aec: 65, ns: 65, dereverb: 65, agc: 65 };
describe("speech enhancement component model", () => {
  it("derives speaker echo from the delayed AO reference and subtracts only that estimate", () => {
    for (let i = 0; i < 512; i++) {
      const t = i / 511, ai = speechComponents(t, {}, 2);
      const output = speechComponents(t, { aec: 1 }, 2);
      expect(ai.echo).toBeCloseTo(playbackReference(t - 0.12) * 0.506, 12);
      expect(ai.total - output.total).toBeCloseTo(ai.echo * 0.94, 12);
      expect(output.speech).toBe(ai.speech);
      expect(output.noise).toBe(ai.noise);
    }
  });
  it("bypasses single mic and preserves target gain for multiple microphones", () => {
    for (let i = 0; i < 512; i++) {
      const t = i / 511, raw = speechComponents(t, {}, 1);
      expect(speechComponents(t, { beamforming: 1 }, 1)).toEqual(raw);
      for (const count of [2, 4]) {
        const array = speechComponents(t, { beamforming: 1 }, count);
        expect(array.speech).toBe(raw.speech);
        expect(Math.abs(array.noise)).toBeLessThanOrEqual(Math.abs(raw.noise));
        expect(array.echo).toBe(raw.echo);
      }
    }
  });
  it("does not let a downstream control change an earlier stage", () => {
    const changed = { ...strengths, ns: 100 };
    expect(processingThrough("aec", changed, 4)).toEqual(processingThrough("aec", strengths, 4));
    expect(processingThrough("agc", changed, 4)).not.toEqual(processingThrough("agc", strengths, 4));
    expect(processingThrough("aec", strengths, 1)).not.toHaveProperty("beamforming");
  });
  it("reduces the targeted component only; AGC multiplies all components equally", () => {
    for (const [mode, key] of [["aec", "echo"], ["ns", "noise"], ["dereverb", "reverb"]] as const) {
      const before = speechComponents(0.4, {}, 2), after = speechComponents(0.4, { [mode]: 1 }, 2);
      for (const component of ["speech", "noise", "echo", "reverb"] as const) {
        if (component === key) expect(Math.abs(after[component])).toBeLessThan(Math.abs(before[component]));
        else expect(after[component]).toBe(before[component]);
      }
    }
    for (let i = 0; i < 512; i++) {
      const before = speechComponents(i / 511, {}, 2), after = speechComponents(i / 511, { agc: 1 }, 2);
      for (const component of ["speech", "noise", "echo", "reverb"] as const) {
        expect(after[component]).toBeCloseTo(before[component] * after.gain, 10);
      }
      expect(after.total).toBeCloseTo(after.speech + after.noise + after.echo + after.reverb, 10);
    }
  });
});
