import { frequencyResponse } from "./filterModel";

export type ToneEffect = "brightness" | "muddy";
export const toneComponents = [{ order: 1, amplitude: .45 }, { order: 3, amplitude: .25 }, { order: 15, amplitude: .1 }];
export const toneFundamental = (effect: ToneEffect) => effect === "brightness" ? 330 : 180;

// RBJ shelf, slope S=1, matching Web Audio's high/low shelf definition.
export function toneResponse(effect: ToneEffect, intensity: number, frequency: number, sampleRate = 48000) {
  if (intensity === 0) return { magnitude: 1, phase: 0 };
  const A = 10 ** (intensity * .16 / 40);
  const w = 2 * Math.PI * (effect === "brightness" ? 3600 : 260) / sampleRate;
  const c = Math.cos(w), d = Math.sin(w) * Math.sqrt(2 * A);
  const b = effect === "brightness"
    ? [A * (A + 1 + (A - 1) * c + d), -2 * A * (A - 1 + (A + 1) * c), A * (A + 1 + (A - 1) * c - d)]
    : [A * (A + 1 - (A - 1) * c + d), 2 * A * (A - 1 - (A + 1) * c), A * (A + 1 - (A - 1) * c - d)];
  const a = effect === "brightness"
    ? [A + 1 - (A - 1) * c + d, 2 * (A - 1 - (A + 1) * c), A + 1 - (A - 1) * c - d]
    : [A + 1 + (A - 1) * c + d, -2 * (A - 1 + (A + 1) * c), A + 1 + (A - 1) * c - d];
  return frequencyResponse({ a, b }, frequency, sampleRate);
}

export function toneSample(effect: ToneEffect, intensity: number, seconds: number, sampleRate = 48000) {
  return toneComponents.reduce((sum, component) => {
    const f = component.order * toneFundamental(effect);
    const h = toneResponse(effect, intensity, f, sampleRate);
    return sum + component.amplitude * h.magnitude * Math.sin(2 * Math.PI * f * seconds + h.phase);
  }, 0);
}
