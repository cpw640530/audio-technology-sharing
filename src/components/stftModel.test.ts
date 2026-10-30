import { describe, expect, it } from "vitest";
import { hannPsd, stftAnalysis, stftSample } from "./stftModel";

describe("shared PCM STFT model", () => {
  it("uses physically distinct tone, chirp and broadband impulse examples", () => {
    const tone = stftAnalysis(512, 256, "tone");
    const chirp = stftAnalysis(512, 256, "chirp");
    const pulse = stftAnalysis(512, 256, "pulse");
    const peak = (psd: number[]) => psd.indexOf(Math.max(...psd));
    expect(tone.frames.every(f => peak(f.psd) === 32)).toBe(true);
    expect(peak(chirp.frames[chirp.frames.length - 1].psd)).toBeGreaterThan(peak(chirp.frames[0].psd));
    expect(pulse.pcm.filter(v => v !== 0)).toEqual([0.8]);
    const hit = pulse.frames.find(f => f.centerMs === 160)!;
    expect(hit.psd[32]).toBeCloseTo(hit.psd[192], 12);
    expect(pulse.frames[0].psd.every(v => v === 0)).toBe(true);
  });
  it("preserves tone power across windows while peak density changes", () => {
    const tone = (n: number) => Array.from({ length: n }, (_, i) => 0.5 * Math.sin(2 * Math.PI * 1000 * i / 16000));
    const short = hannPsd(tone(256)), long = hannPsd(tone(1024));
    expect(long.psd[64] / short.psd[16]).toBeCloseTo(4, 10);
    for (const result of [short, long]) {
      expect(result.psd.reduce((sum, p) => sum + p, 0) * 16000 / result.fftSize).toBeCloseTo(0.125, 10);
    }
    const doubled = hannPsd(tone(256).map(x => x * 2));
    expect(doubled.psd[16] / short.psd[16]).toBeCloseTo(4, 10);
    const nyquist = hannPsd(Array.from({ length: 512 }, (_, i) => i % 2 ? -0.5 : 0.5));
    expect(nyquist.psd.reduce((s, p) => s + p, 0) * 16000 / 512).toBeCloseTo(0.25, 10);
  });
  it("locates a known tone and integrates PSD to window-weighted mean square", () => {
    const samples = Array.from({ length: 512 }, (_, i) => 0.5 * Math.sin(2 * Math.PI * 1000 * i / 16000));
    const { psd, fftSize } = hannPsd(samples);
    expect(psd.indexOf(Math.max(...psd)) * 16000 / fftSize).toBe(1000);
    expect(psd.reduce((sum, p) => sum + p, 0) * 16000 / fftSize).toBeCloseTo(0.125, 10);
    const dc = hannPsd(Array(512).fill(0.5));
    expect(dc.psd.reduce((s, p) => s + p, 0) * 16000 / 512).toBeCloseTo(0.25, 10);
  });
  it("matches an independently evaluated complex DFT including padding", () => {
    const samples = Array.from({ length: 768 }, (_, i) => stftSample(i));
    const actual = hannPsd(samples);
    for (const k of [0, 64, 160, 384, 512]) {
      let re = 0, im = 0, norm = 0;
      samples.forEach((x, n) => {
        const w = 0.5 - 0.5 * Math.cos(2 * Math.PI * n / 768);
        re += x * w * Math.cos(2 * Math.PI * k * n / 1024);
        im -= x * w * Math.sin(2 * Math.PI * k * n / 1024);
        norm += w * w;
      });
      expect(actual.psd[k]).toBeCloseTo((re * re + im * im) * (k === 0 || k === 512 ? 1 : 2) / (16000 * norm), 12);
    }
  });
  it("changes frame spacing without changing identical-frame spectra or input", () => {
    const sparse = stftAnalysis(512, 256), dense = stftAnalysis(512, 128);
    expect(sparse.frames).toHaveLength(15);
    expect(dense.frames).toHaveLength(29);
    expect(dense.pcm).toEqual(sparse.pcm);
    sparse.frames.forEach((frame, i) => expect(dense.frames[i * 2].psd).toEqual(frame.psd));
    expect(dense.frames[0].centerMs).toBe(16);
    expect(dense.frames[dense.frames.length - 1].centerMs).toBe(240);
  });
  it("represents the burst and produces finite PSDs at all window sizes", () => {
    const result = stftAnalysis(512, 128);
    const burst = result.frames.find(f => f.centerMs === 160)!;
    expect(burst.psd[192]).toBeGreaterThan(result.frames[0].psd[192] * 100);
    for (const n of [256, 512, 768, 1024]) {
      const a = stftAnalysis(n, 512);
      expect(a.frames.length).toBe(Math.floor((4096 - n) / 512) + 1);
      expect(a.pcm.every(v => Math.abs(v) < 1)).toBe(true);
      expect(a.frames.every(f => f.psd.every(p => Number.isFinite(p) && p >= 0))).toBe(true);
    }
  });
});
