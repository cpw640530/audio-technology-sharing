import { act, cleanup, render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { BackgroundWave } from "./BackgroundWave";
import { createWaveSurface } from "./waveSurface";
import { createWaveSurfaceFallback } from "./waveSurfaceFallback";

vi.mock("./waveSurface", () => ({ createWaveSurface: vi.fn() }));
vi.mock("./waveSurfaceFallback", () => ({ createWaveSurfaceFallback: vi.fn() }));

beforeEach(() => {
  vi.spyOn(window.navigator, "userAgent", "get").mockReturnValue("Browser");
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.mocked(createWaveSurface).mockReset(); vi.mocked(createWaveSurfaceFallback).mockReset(); });

it("shows a fallback until ready and during context loss, then restores WebGL", async () => {
  let available!: (ready: boolean) => void;
  const dispose = vi.fn();
  const disposeFallback = vi.fn();
  vi.mocked(createWaveSurfaceFallback).mockReturnValue(disposeFallback);
  vi.mocked(createWaveSurface).mockImplementation((_canvas, notify) => {
    available = notify!;
    return dispose;
  });
  const view = render(<BackgroundWave />);
  const background = view.container.firstElementChild!;
  expect(background).toHaveAttribute("data-ready", "false");
  await waitFor(() => expect(createWaveSurface).toHaveBeenCalledOnce());
  await waitFor(() => expect(createWaveSurfaceFallback).toHaveBeenCalledOnce());
  act(() => available(true));
  expect(background).toHaveAttribute("data-ready", "true");
  expect(disposeFallback).toHaveBeenCalledTimes(1);
  act(() => available(false));
  expect(background).toHaveAttribute("data-ready", "false");
  await waitFor(() => expect(createWaveSurfaceFallback).toHaveBeenCalledTimes(2));
  act(() => available(true));
  expect(disposeFallback).toHaveBeenCalledTimes(2);
  expect(background).toHaveAttribute("data-ready", "true");
  view.unmount();
  expect(dispose).toHaveBeenCalledOnce();
  act(() => available(false));
});

it("keeps the fallback when WebGL initialization fails", async () => {
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.mocked(createWaveSurface).mockImplementation(() => { throw new Error("WebGL unavailable"); });
  const view = render(<BackgroundWave />);
  await waitFor(() => expect(console.warn).toHaveBeenCalled());
  await waitFor(() => expect(createWaveSurfaceFallback).toHaveBeenCalledOnce());
  expect(view.container.firstElementChild).toHaveAttribute("data-ready", "false");
  expect(view.container.querySelector("canvas.background-wave-fallback")).toBeInTheDocument();
});
