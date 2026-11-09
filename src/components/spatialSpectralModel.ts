export const demoRate = 8000;
const size = 128;
const hop = 64;
// The fixed teaching transform reuses the same basis in analysis and synthesis.
const cosine = Array.from({ length: size }, (_, k) => Float64Array.from({ length: size }, (_, n) => Math.cos(2 * Math.PI * k * n / size)));
const sine = Array.from({ length: size }, (_, k) => Float64Array.from({ length: size }, (_, n) => Math.sin(2 * Math.PI * k * n / size)));

export function arrayExample(count: number, steering: number) {
  const delay = (mic: number, angle: number) => mic * 0.04 * Math.sin(angle * Math.PI / 180) / 343;
  const target = (t: number) => 0.35 * Math.sin(2 * Math.PI * 1000 * t) + 0.15 * Math.sin(2 * Math.PI * 1500 * t);
  const noise = (t: number) => 0.3 * Math.sin(2 * Math.PI * 2000 * t + 0.5);
  const times = Array.from({ length: 321 }, (_, i) => i / 80000);
  const delays = Array.from({ length: count }, (_, m) => delay(m, steering));
  // Analytic fractional shifts remove a common latency for display; hardware needs causal delay filters.
  const rawTarget = delays.map((_, m) => times.map(t => target(t - delay(m, 30))));
  const alignedTarget = delays.map((d, m) => times.map(t => target(t + d - delay(m, 30))));
  const alignedNoise = delays.map((d, m) => times.map(t => noise(t + d - delay(m, -40))));
  const sum = (channels: number[][]) => times.map((_, i) => channels.reduce((s, c) => s + c[i], 0) / count);
  const outputTarget = sum(alignedTarget), outputNoise = sum(alignedNoise);
  return { delays, rawTarget, alignedTarget, input: times.map(t => target(t) + noise(t)), outputTarget, outputNoise,
    output: outputTarget.map((v, i) => v + outputNoise[i]) };
}

// shortcut: bounded 128-point direct DFT for this fixed teaching clip; use FFT for live/long audio.
function transform(input: number[]) {
  return Array.from({ length: size }, (_, k) => {
    let re = 0, im = 0;
    for (let n = 0; n < size; n++) {
      re += input[n] * cosine[k][n]; im -= input[n] * sine[k][n];
    }
    return { re, im };
  });
}

export function spectralExample(strength: number) {
  const length = 1024;
  let seed = 17;
  const noise = Array.from({ length }, (_, i) => {
    seed = (1664525 * seed + 1013904223) >>> 0;
    return (seed / 4294967296 - 0.5) * 0.25 + 0.15 * Math.sin(2 * Math.PI * 2000 * i / demoRate);
  });
  const input = noise.map((v, i) => {
    const envelope = i < 256 ? 0 : Math.sin(Math.PI * (i - 256) / 768) ** 2;
    return v + envelope * (0.4 * Math.sin(2 * Math.PI * 500 * i / demoRate) + 0.18 * Math.sin(2 * Math.PI * 1000 * i / demoRate));
  });
  const window = Array.from({ length: size }, (_, i) => Math.sin(Math.PI * (i + 0.5) / size));
  const power = (bins: ReturnType<typeof transform>) => bins.map(b => b.re ** 2 + b.im ** 2);
  // Estimate stationary noise from the first three complete noise-only frames (0–32 ms).
  const noisePower = Array<number>(size).fill(0);
  for (const start of [0, 64, 128]) {
    const p = power(transform(input.slice(start, start + size).map((v, i) => v * window[i])));
    p.forEach((v, k) => { noisePower[k] += v / 3; });
  }
  const output = Array<number>(length).fill(0), weights = Array<number>(length).fill(0);
  const frames = [];
  for (let start = -hop; start < length; start += hop) {
    const bins = transform(window.map((w, n) => (input[start + n] ?? 0) * w));
    const p = power(bins);
    const gains = p.map(v => v); // Mirror gains to preserve a real-valued output.
    for (let k = 0; k <= size / 2; k++) {
      const gain = Math.sqrt(Math.max(0.01, 1 - strength / 100 * noisePower[k] / Math.max(p[k], 1e-12)));
      gains[k] = gain;
      if (k > 0 && k < size / 2) gains[size - k] = gain;
    }
    if (start >= 0 && start + size <= length) frames.push({ start, inputPower: p.slice(0, 65), gains: gains.slice(0, 65), outputPower: p.slice(0, 65).map((v, k) => v * gains[k] ** 2) });
    for (let n = 0; n < size; n++) {
      const index = start + n;
      if (index < 0 || index >= length) continue;
      let sample = 0;
      for (let k = 0; k < size; k++) {
        sample += gains[k] * (bins[k].re * cosine[k][n] - bins[k].im * sine[k][n]);
      }
      output[index] += sample / size * window[n]; weights[index] += window[n] ** 2;
    }
  }
  return { input, output: output.map((v, i) => v / weights[i]), frames };
}
