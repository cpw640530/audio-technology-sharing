import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { SoundPropagationDiagram } from "./SoundPropagationDiagram";

afterEach(() => { cleanup(); vi.useRealTimers(); vi.unstubAllGlobals(); });

it("moves air parcels locally, synchronizes the probe, and pauses", () => {
  vi.useFakeTimers();
  vi.stubGlobal("IntersectionObserver", class {
    constructor(private callback: (entries: { isIntersecting: boolean }[]) => void) {}
    observe() { this.callback([{ isIntersecting: true }]); }
    disconnect() {}
  });
  const { container } = render(<SoundPropagationDiagram language="en" />);
  const air = container.querySelector(".sound-propagation-air circle")!;
  expect(Number(air.getAttribute("cx"))).toBeCloseTo(60);
  act(() => { vi.advanceTimersByTime(1010); });
  expect(Number(air.getAttribute("cx"))).toBeCloseTo(72);
  const markers = container.querySelectorAll(".sound-propagation-signals circle");
  expect(markers[0].getAttribute("cy")).toBe(markers[1].getAttribute("cy"));
  fireEvent.click(screen.getByRole("button", { name: "Pause animation" }));
  const position = air.getAttribute("cx");
  act(() => { vi.advanceTimersByTime(1000); });
  expect(air.getAttribute("cx")).toBe(position);
});
