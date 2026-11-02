import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { WelcomeMusic } from "./WelcomeMusic";

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

it.each([false, true])("attempts autoplay and supports pause and cleanup (blocked=%s)", async blocked => {
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
  const media = { paused: true, loop: false, preload: "", onerror: null,
    play: vi.fn(async () => { media.paused = false; }), pause: vi.fn(() => { media.paused = true; }),
    removeAttribute: vi.fn(), load: vi.fn() };
  const Media = vi.fn(() => media);
  vi.stubGlobal("Audio", Media);
  const gain = { gain: { value: 0, setTargetAtTime: vi.fn() }, connect: vi.fn() };
  const source = { buffer: null, loop: false, connect: vi.fn(), start: vi.fn() };
  const context = {
    createAnalyser: () => ({ connect: vi.fn(), fftSize: 512 }),
    sampleRate: 8000, currentTime: 0, state: "suspended", destination: {}, onstatechange: null,
    createGain: () => gain, createMediaElementSource: () => source,
    resume: vi.fn(async () => { context.state = "running"; }),
    suspend: vi.fn(async () => { context.state = "suspended"; }), close: vi.fn(async () => {})
  };
  const Constructor = vi.fn(() => context);
  if (blocked) media.play.mockRejectedValueOnce(new DOMException("blocked", "NotAllowedError"));
  vi.stubGlobal("AudioContext", Constructor);
  const { unmount } = render(<WelcomeMusic language="en" />);
  if (blocked) {
    await screen.findByRole("status");
    expect(screen.getByRole("button", { name: "Play background music" })).toBeEnabled();
    fireEvent.click(screen.getByRole("button", { name: "Play background music" }));
  }
  await screen.findByRole("button", { name: "Pause background music" });
  expect(media.play).toHaveBeenCalledTimes(blocked ? 2 : 1);
  expect(media.loop).toBe(true);
  expect(media.preload).toBe("none");
  expect(Media).toHaveBeenCalledWith(expect.stringContaining("audio/merry-christmas-mr-lawrence.mp3"));
  fireEvent.change(screen.getByRole("slider"), { target: { value: "20" } });
  expect(gain.gain.setTargetAtTime).toHaveBeenCalledWith(.2, 0, .05);
  fireEvent.click(screen.getByRole("button", { name: "Pause background music" }));
  await screen.findByRole("button", { name: "Play background music" });
  fireEvent.click(screen.getByRole("button", { name: "Play background music" }));
  await screen.findByRole("button", { name: "Pause background music" });
  expect(Constructor).toHaveBeenCalledTimes(blocked ? 2 : 1);
  unmount();
  expect(context.close).toHaveBeenCalledTimes(blocked ? 2 : 1);
  expect(media.paused).toBe(true);
  expect(media.removeAttribute).toHaveBeenCalledWith("src");
});

it("reports unavailable audio without starting playback", async () => {
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
  vi.stubGlobal("AudioContext", vi.fn(() => { throw new Error("unavailable"); }));
  render(<WelcomeMusic language="zh" />);
  fireEvent.click(screen.getByRole("button", { name: "播放背景音乐" }));
  await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("播放失败"));
});
