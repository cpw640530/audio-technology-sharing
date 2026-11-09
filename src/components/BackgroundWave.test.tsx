import { act, cleanup, render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { BackgroundWave } from "./BackgroundWave";
import { createWaveSurface } from "./waveSurface";

vi.mock("./waveSurface", () => ({ createWaveSurface: vi.fn() }));

beforeEach(() => {
  vi.spyOn(window.navigator, "userAgent", "get").mockReturnValue("Browser");
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.mocked(createWaveSurface).mockReset(); });

it("shows a fallback until ready and during context loss, then restores WebGL", async () => {
  let available!: (ready: boolean) => void;
  const dispose = vi.fn();
  vi.mocked(createWaveSurface).mockImplementation((_canvas, notify) => {
    available = notify!;
    return dispose;
  });
  const view = render(<BackgroundWave />);
  const background = view.container.firstElementChild!;
  expect(background).toHaveAttribute("data-ready", "false");
  await waitFor(() => expect(createWaveSurface).toHaveBeenCalledOnce());
  act(() => available(true));
  expect(background).toHaveAttribute("data-ready", "true");
  act(() => available(false));
  expect(background).toHaveAttribute("data-ready", "false");
  act(() => available(true));
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
  expect(view.container.firstElementChild).toHaveAttribute("data-ready", "false");
  expect(view.container.querySelector(".background-wave-fallback")).toBeInTheDocument();
});
