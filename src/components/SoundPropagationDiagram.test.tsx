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
  fireEvent.click(screen.getByRole("button", { name: "Play animation" }));
  act(() => { vi.advanceTimersByTime(510); });
  expect(Number(air.getAttribute("cx"))).toBeCloseTo(73.2);
  const markers = container.querySelectorAll(".sound-propagation-signals circle");
  // The probe has not been reached at t=.5, so both records are still zero.
  expect(markers[0].getAttribute("cy")).toBe("85");
  expect(markers[1].getAttribute("cy")).toBe("85");
  fireEvent.click(screen.getByRole("button", { name: "Pause animation" }));
  const position = air.getAttribute("cx");
  act(() => { vi.advanceTimersByTime(1000); });
  expect(air.getAttribute("cx")).toBe(position);
});

it("starts with no future trace and restarts recording when settings change", () => {
  render(<SoundPropagationDiagram language="en" />);
  const trace = screen.getByTestId("propagation-pressure-trace");
  expect(trace.getAttribute("d")).toBe("M 40 85");
  expect(screen.queryByRole("button", { name: "Single pulse" })).not.toBeInTheDocument();
  expect(screen.getByRole("slider", { name: /Vibration rate/ })).toBeEnabled();
  fireEvent.click(screen.getByRole("button", { name: "Step forward" }));
  expect(trace.getAttribute("d")).toContain("L");
  fireEvent.change(screen.getByRole("slider", { name: /Vibration rate/ }), { target: { value: "1.5" } });
  expect(screen.getByRole("slider", { name: /Vibration rate/ })).toBeEnabled();
  expect(trace.getAttribute("d")).toBe("M 40 85");
  fireEvent.click(screen.getByRole("button", { name: "Step forward" }));
  fireEvent.change(screen.getByRole("slider", { name: /Diaphragm stroke/ }), { target: { value: ".5" } });
  expect(trace.getAttribute("d")).toBe("M 40 85");
});

it("continues past four demo units until explicitly reset", () => {
  vi.useFakeTimers();
  vi.stubGlobal("IntersectionObserver", class {
    constructor(private callback: (entries: { isIntersecting: boolean }[]) => void) {}
    observe() { this.callback([{ isIntersecting: true }]); }
    disconnect() {}
  });
  render(<SoundPropagationDiagram language="en" />);
  fireEvent.click(screen.getByRole("button", { name: "Play animation" }));
  act(() => { vi.advanceTimersByTime(4100); });
  expect(screen.getByRole("button", { name: "Pause animation" })).toBeInTheDocument();
  expect(Number(screen.getByText(/^Demo time:/).textContent!.replace("Demo time: ", ""))).toBeGreaterThan(4);
  fireEvent.click(screen.getByRole("button", { name: "Restart experiment" }));
  expect(screen.getByText("Demo time: 0.00")).toBeInTheDocument();
});
