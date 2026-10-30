export const stftSampleRate = 16000;
export const stftSampleCount = 4096;
export type StftExample = "tone" | "chirp" | "pulse" | "mixed";

export function stftSample(index: number, example: StftExample = "mixed") {
  const t = index / stftSampleRate;
  const burst = Math.exp(-0.5 * ((t - 0.16) / 0.008) ** 2);
  if (example === "tone") return 0.36 * Math.sin(2 * Math.PI * 1000 * t);
  if (example === "chirp") return 0.36 * Math.sin(2 * Math.PI * (1000 * t + 10000 * t * t));
  if (example === "pulse") return index === 2560 ? 0.8 : 0;
  return 0.36 * Math.sin(2 * Math.PI * 1000 * t)
    + 0.22 * Math.sin(2 * Math.PI * (2500 * t + 2000 * t * t))
    + 0.18 * burst * Math.sin(2 * Math.PI * 6000 * t);
}

export function hannPsd(samples: number[]) {
  const n = samples.length;
  const fftSize = 2 ** Math.ceil(Math.log2(n));
  const windowed = Array<number>(fftSize).fill(0);
  let windowPower = 0;
  for (let i = 0; i < n; i++) {
    const w = 0.5 - 0.5 * Math.cos(2 * Math.PI * i / n);
    windowed[i] = samples[i] * w;
    windowPower += w * w;
  }
  // shortcut: bounded direct DFT (N <= 1024); use an FFT library for longer/live input.
  const complex = Array<number>(fftSize + 2).fill(0);
  for (let k = 0; k <= fftSize / 2; k++) {
    const angle = -2 * Math.PI * k / fftSize;
    const stepReal = Math.cos(angle), stepImag = Math.sin(angle);
    let real = 1, imag = 0;
    for (let i = 0; i < n; i++) {
      complex[2 * k] += windowed[i] * real;
      complex[2 * k + 1] += windowed[i] * imag;
      const nextReal = real * stepReal - imag * stepImag;
      imag = real * stepImag + imag * stepReal;
      real = nextReal;
    }
  }
  // One-sided PSD: integration in Hz recovers window-weighted mean-square power.
  const psd = Array.from({ length: fftSize / 2 + 1 }, (_, k) =>
    (complex[2 * k] ** 2 + complex[2 * k + 1] ** 2)
    * (k === 0 || k === fftSize / 2 ? 1 : 2) / (stftSampleRate * windowPower));
  return { psd, fftSize, windowed: windowed.slice(0, n) };
}

export function psdDb(power: number) {
  return Math.max(-100, Math.min(-20, 10 * Math.log10(Math.max(1e-20, power))));
}

export function stftAnalysis(windowSize: number, hopSize: number, example: StftExample = "mixed") {
  const pcm = Array.from({ length: stftSampleCount }, (_, i) => stftSample(i, example));
  const frames = [];
  for (let start = 0; start + windowSize <= pcm.length; start += hopSize) {
    const spectrum = hannPsd(pcm.slice(start, start + windowSize));
    frames.push({ start, centerMs: (start + windowSize / 2) / stftSampleRate * 1000, ...spectrum });
  }
  const first = frames[0];
  return { pcm, frames, fftSize: first.fftSize };
}
