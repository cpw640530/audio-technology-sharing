import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { SoundPropagationDiagram } from "./SoundPropagationDiagram";
import { propagationSample } from "./soundPropagationModel";

afterEach(() => { cleanup(); vi.useRealTimers(); vi.unstubAllGlobals(); });
beforeEach(() => {
  vi.stubGlobal("matchMedia", () => ({ matches: false, addEventListener() {}, removeEventListener() {} }));
});

it("moves air parcels locally, synchronizes the probe, and pauses", () => {
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "setInterval", "clearInterval", "requestAnimationFrame", "cancelAnimationFrame", "performance"] });
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
  const time = Number(screen.getByText(/^Demo time:/).textContent!.replace("Demo time: ", ""));
  expect(time).toBeGreaterThan(.46);
  expect(time).toBeLessThanOrEqual(.51);
  expect(Number(air.getAttribute("cx"))).toBeCloseTo(60 + propagationSample(0, time, { mode: "continuous", amplitude: 1, rate: 1 }).displacement * 60, 2);
  const markers = container.querySelectorAll(".sound-propagation-signals circle");
  // The probe has not been reached at t=.5, so both records are still zero.
  expect(markers[0].getAttribute("cy")).toBe("85");
  expect(markers[1].getAttribute("cy")).toBe("85");
  fireEvent.click(screen.getByRole("button", { name: "Pause animation" }));
  const position = air.getAttribute("cx");
  act(() => { vi.advanceTimersByTime(1000); });
  expect(air.getAttribute("cx")).toBe(position);
});

it("starts live updates when parameters change without resetting time", () => {
  render(<SoundPropagationDiagram language="en" />);
  const trace = screen.getByTestId("propagation-pressure-trace");
  expect(trace.getAttribute("d")).toBe("M 40 85");
  expect(screen.queryByRole("button", { name: "Single pulse" })).not.toBeInTheDocument();
  expect(screen.getByRole("slider", { name: /Vibration rate/ })).toBeEnabled();
  expect(screen.queryByRole("slider", { name: /Observation time/ })).not.toBeInTheDocument();
  for (let i = 0; i < 13; i++) fireEvent.click(screen.getByRole("button", { name: "Step forward" }));
  expect(screen.getByText("Demo time: 1.30")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Play animation" })).toBeInTheDocument();
  const original = trace.getAttribute("d");
  expect(trace.getAttribute("d")).toContain("L");
  fireEvent.change(screen.getByRole("slider", { name: /Vibration rate/ }), { target: { value: "1.5" } });
  expect(screen.getByRole("slider", { name: /Vibration rate/ })).toBeEnabled();
  expect(screen.getByText("Demo time: 1.30")).toBeInTheDocument();
  expect(trace.getAttribute("d")).not.toBe(original);
  expect(screen.getByRole("button", { name: "Pause animation" })).toBeInTheDocument();
  fireEvent.change(screen.getByRole("slider", { name: /Diaphragm stroke/ }), { target: { value: ".5" } });
  expect(screen.getByText("Demo time: 1.30")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Restart experiment" }));
  expect(screen.getByRole("button", { name: "Play animation" })).toBeInTheDocument();
  expect(trace.getAttribute("d")).toBe("M 40 85");
});

it("continues past four demo units until explicitly reset", () => {
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "setInterval", "clearInterval", "requestAnimationFrame", "cancelAnimationFrame", "performance"] });
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

it("joins both records to the live marker between history sampling ticks", () => {
  const { container } = render(<SoundPropagationDiagram language="en" />);
  for (let i = 0; i < 13; i++) fireEvent.click(screen.getByRole("button", { name: "Step forward" }));
  const markers = container.querySelectorAll(".sound-propagation-signals circle");
  for (const [i, id] of ["propagation-pressure-trace", "propagation-displacement-trace"].entries()) {
    const marker = markers[i];
    expect(screen.getByTestId(id).getAttribute("d")!.endsWith(`${marker.getAttribute("cx")} ${marker.getAttribute("cy")}`)).toBe(true);
  }
  expect(screen.getByText(/relative to the initial position/)).toBeInTheDocument();
  expect(screen.getByText(/Zero is not the periodic mean position/)).toBeInTheDocument();
});
