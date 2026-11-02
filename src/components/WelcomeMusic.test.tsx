import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { WelcomeMusic } from "./WelcomeMusic";

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

it("plays only on request, pauses, changes gain and closes on exit", async () => {
  const samples = new Float32Array(8000 * 16);
  const gain = { gain: { value: 0, setTargetAtTime: vi.fn() }, connect: vi.fn() };
  const source = { buffer: null, loop: false, connect: vi.fn(), start: vi.fn() };
  const context = {
    sampleRate: 8000, currentTime: 0, state: "suspended", destination: {}, onstatechange: null,
    createGain: () => gain, createBuffer: () => ({ getChannelData: () => samples }), createBufferSource: () => source,
    resume: vi.fn(async () => { context.state = "running"; }),
    suspend: vi.fn(async () => { context.state = "suspended"; }), close: vi.fn(async () => {})
  };
  const Constructor = vi.fn(() => context);
  vi.stubGlobal("AudioContext", Constructor);
  const { unmount } = render(<WelcomeMusic language="en" />);
  expect(Constructor).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Play background music" }));
  await screen.findByRole("button", { name: "Pause background music" });
  expect(source.start).toHaveBeenCalledOnce();
  expect(source.loop).toBe(true);
  expect(samples.some(value => Math.abs(value) > 0.01)).toBe(true);
  expect(samples.every(value => Number.isFinite(value) && Math.abs(value) < 1)).toBe(true);
  expect(samples[0]).toBe(0);
  expect(samples.at(-1)).toBe(0);
  fireEvent.change(screen.getByRole("slider"), { target: { value: "20" } });
  expect(gain.gain.setTargetAtTime).toHaveBeenCalledWith(.2, 0, .05);
  fireEvent.click(screen.getByRole("button", { name: "Pause background music" }));
  await screen.findByRole("button", { name: "Play background music" });
  fireEvent.click(screen.getByRole("button", { name: "Play background music" }));
  await screen.findByRole("button", { name: "Pause background music" });
  expect(Constructor).toHaveBeenCalledOnce();
  unmount();
  expect(context.close).toHaveBeenCalledOnce();
});

it("reports unavailable audio without starting playback", async () => {
  vi.stubGlobal("AudioContext", vi.fn(() => { throw new Error("unavailable"); }));
  render(<WelcomeMusic language="zh" />);
  fireEvent.click(screen.getByRole("button", { name: "播放背景音乐" }));
  await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("播放失败"));
});
