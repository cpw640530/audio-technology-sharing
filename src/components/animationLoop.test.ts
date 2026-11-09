import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { animationLoop } from "./animationLoop";

let now: number;
let pending: Map<number, FrameRequestCallback>;
let visible: (entries: { isIntersecting: boolean }[]) => void;
let motion: { matches: boolean; addEventListener: ReturnType<typeof vi.fn>; removeEventListener: ReturnType<typeof vi.fn> };
let motionChange: () => void;

beforeEach(() => {
  now = 0;
  pending = new Map();
  let id = 0;
  vi.spyOn(performance, "now").mockImplementation(() => now);
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => { pending.set(++id, callback); return id; });
  vi.stubGlobal("cancelAnimationFrame", (key: number) => pending.delete(key));
  motion = { matches: false, addEventListener: vi.fn((_event, callback) => { motionChange = callback; }), removeEventListener: vi.fn() };
  vi.stubGlobal("matchMedia", () => motion);
  vi.stubGlobal("IntersectionObserver", class {
    constructor(callback: typeof visible) { visible = callback; }
    observe() { visible([{ isIntersecting: true }]); }
    disconnect() {}
  });
});
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

function advance(milliseconds: number, hz = 60) {
  const end = now + milliseconds;
  while (now + 1000 / hz <= end + 1e-6) {
    now += 1000 / hz;
    const callbacks = [...pending.values()];
    pending.clear();
    callbacks.forEach(callback => callback(now));
  }
}

it.each([60, 120, 144])("keeps 30fps cadence and elapsed time on a %iHz display", hz => {
  const draw = vi.fn();
  const animation = animationLoop(document.createElement("canvas"), draw);
  advance(1000, hz);
  expect(draw).toHaveBeenCalledTimes(31); // Initial static frame plus 30 updates.
  expect(draw.mock.calls.reduce((sum, [delta]) => sum + delta, 0)).toBeCloseTo(1, 2);
  animation.dispose();
  expect(pending.size).toBe(0);
});

it("stops offscreen and hidden; resumes without catching up lost time", () => {
  const draw = vi.fn();
  const animation = animationLoop(document.createElement("canvas"), draw);
  advance(100);
  visible([{ isIntersecting: false }]);
  expect(pending.size).toBe(0);
  const count = draw.mock.calls.length;
  advance(2000);
  expect(draw).toHaveBeenCalledTimes(count);
  visible([{ isIntersecting: true }]);
  advance(1000 / 30);
  expect(draw.mock.lastCall![0]).toBeCloseTo(1 / 30);
  vi.spyOn(document, "hidden", "get").mockReturnValue(true);
  document.dispatchEvent(new Event("visibilitychange"));
  expect(pending.size).toBe(0);
  vi.spyOn(document, "hidden", "get").mockReturnValue(false);
  document.dispatchEvent(new Event("visibilitychange"));
  expect(pending.size).toBe(1);
  animation.setPlaying(false);
  expect(pending.size).toBe(0);
  animation.setPlaying(true);
  animation.setPlaying(true);
  expect(pending.size).toBe(1);
  animation.dispose();
  motionChange();
  visible([{ isIntersecting: true }]);
  expect(pending.size).toBe(0);
});

it("reacts to reduced motion but permits explicitly started teaching simulations", () => {
  const animation = animationLoop(document.createElement("canvas"), vi.fn());
  motion.matches = true;
  motionChange();
  expect(pending.size).toBe(0);
  motion.matches = false;
  motionChange();
  expect(pending.size).toBe(1);
  animation.dispose();
  motion.matches = true;
  const simulation = animationLoop(document.createElement("canvas"), vi.fn(), { respectReducedMotion: false });
  expect(pending.size).toBe(1);
  simulation.dispose();
});

it("caps catch-up after a long main-thread stall", () => {
  const draw = vi.fn();
  const animation = animationLoop(document.createElement("canvas"), draw);
  now = 5000;
  const callbacks = [...pending.values()]; pending.clear();
  callbacks.forEach(callback => callback(now));
  expect(draw.mock.lastCall![0]).toBe(.1);
  animation.dispose();
});
