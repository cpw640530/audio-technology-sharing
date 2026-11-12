import { afterEach, expect, it, vi } from "vitest";
import { animationLoop } from "./animationLoop";
import { createWaveSurfaceFallback } from "./waveSurfaceFallback";

vi.mock("./animationLoop", () => ({ animationLoop: vi.fn() }));
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); vi.mocked(animationLoop).mockReset(); });

it("projects a curved, moving surface without requesting a GPU context and cleans up", () => {
  let draw!: (delta: number) => void;
  const dispose = vi.fn();
  vi.mocked(animationLoop).mockImplementation((_canvas, callback) => { draw = callback; return { dispose, setPlaying: vi.fn() }; });
  const context = {
    clearRect: vi.fn(), beginPath: vi.fn(), moveTo: vi.fn(), lineTo: vi.fn(), stroke: vi.fn(), setTransform: vi.fn(),
    createLinearGradient: vi.fn(() => ({ addColorStop: vi.fn() }))
  };
  const getContext = vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(context as unknown as CanvasRenderingContext2D);
  const canvas = document.createElement("canvas");
  const stop = createWaveSurfaceFallback(canvas);
  expect(getContext).toHaveBeenCalledOnce();
  expect(getContext).toHaveBeenCalledWith("2d");
  expect(canvas.dataset.ready).toBe("true");
  expect(animationLoop).toHaveBeenCalledWith(canvas, expect.any(Function), { fps: 15 });
  const firstLine = context.lineTo.mock.calls.slice(0, 66) as [number, number][];
  expect(firstLine.flat().every(Number.isFinite)).toBe(true);
  const [a, b, c] = [firstLine[5], firstLine[20], firstLine[40]];
  expect(Math.abs((b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]))).toBeGreaterThan(10);
  context.lineTo.mockClear();
  draw(1);
  expect(context.lineTo.mock.calls.slice(0, 66)).not.toEqual(firstLine);
  vi.stubGlobal("innerWidth", 390);
  window.dispatchEvent(new Event("resize"));
  expect(canvas.width).toBe(Math.round(390 * Math.min(devicePixelRatio || 1, 1.5)));
  stop();
  expect(dispose).toHaveBeenCalledOnce();
  expect(canvas.dataset.ready).toBeUndefined();
  context.clearRect.mockClear();
  window.dispatchEvent(new Event("resize"));
  expect(context.clearRect).not.toHaveBeenCalled();
});

it("does not start a loop if Canvas 2D is unavailable", () => {
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
  expect(() => createWaveSurfaceFallback(document.createElement("canvas"))).toThrow("Canvas 2D unavailable");
  expect(animationLoop).not.toHaveBeenCalled();
});
