export type FilterType = "lowpass" | "highpass" | "bandpass" | "notch";
type Coefficients = { b: number[]; a: number[] };
export const filterSampleRate = 16000;
export const filterTones = [
  { frequency: 300, amplitude: 0.36, phase: 0 },
  { frequency: 1600, amplitude: 0.17, phase: 0.45 },
  { frequency: 5200, amplitude: 0.11, phase: 1.1 }
];

// RBJ biquads: https://www.w3.org/TR/audio-eq-cookbook/ (constant-peak bandpass).
export function filterCoefficients(type: FilterType | "peaking", cutoff: number, q: number, gain = 0): Coefficients {
  const w = 2 * Math.PI * Math.min(7900, Math.max(1, cutoff)) / filterSampleRate;
  const c = Math.cos(w);
  const alpha = Math.sin(w) / (2 * Math.max(0.1, q));
  const A = 10 ** (gain / 40);
  if (type === "peaking") return { b: [1 + alpha * A, -2 * c, 1 - alpha * A], a: [1 + alpha / A, -2 * c, 1 - alpha / A] };
  const b = type === "lowpass" ? [(1 - c) / 2, 1 - c, (1 - c) / 2]
    : type === "highpass" ? [(1 + c) / 2, -(1 + c), (1 + c) / 2]
    : type === "bandpass" ? [alpha, 0, -alpha] : [1, -2 * c, 1];
  return { b, a: [1 + alpha, -2 * c, 1 - alpha] };
}

export function frequencyResponse(coefficients: Coefficients, frequency: number) {
  const w = 2 * Math.PI * frequency / filterSampleRate;
  const evaluate = (values: number[]) => ({
    re: values.reduce((sum, v, i) => sum + v * Math.cos(w * i), 0),
    im: values.reduce((sum, v, i) => sum - v * Math.sin(w * i), 0)
  });
  const b = evaluate(coefficients.b);
  const a = evaluate(coefficients.a);
  return { magnitude: Math.hypot(b.re, b.im) / Math.hypot(a.re, a.im), phase: Math.atan2(b.im, b.re) - Math.atan2(a.im, a.re) };
}

export function combinedResponse(type: FilterType, frequency: number, cutoff: number, q: number, gain: number) {
  const filter = frequencyResponse(filterCoefficients(type, cutoff, q), frequency);
  const eq = frequencyResponse(filterCoefficients("peaking", cutoff, q, gain), frequency);
  return { magnitude: filter.magnitude * eq.magnitude, phase: filter.phase + eq.phase };
}

export function filterSignal(time: number, type: FilterType, cutoff: number, q: number, gain: number, filtered: boolean) {
  return filterTones.reduce((sum, tone) => {
    const h = filtered ? combinedResponse(type, tone.frequency, cutoff, q, gain) : { magnitude: 1, phase: 0 };
    return sum + tone.amplitude * h.magnitude * Math.sin(2 * Math.PI * tone.frequency * time + tone.phase + h.phase);
  }, 0);
}
