import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { SoundCompositionExperiment } from "./SoundCompositionExperiment";
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

it("controls C independently of B and keeps phase out of magnitude spectra", () => {
  render(<SoundCompositionExperiment mode="spectrum" language="en" />);
  const c = screen.getByTestId("composition-spectrum-2");
  const initialC = c.getAttribute("d");
  fireEvent.change(screen.getByRole("slider", { name: /Component B amplitude/ }), { target: { value: "0.1" } });
  expect(c.getAttribute("d")).toBe(initialC);
  const b = screen.getByTestId("composition-spectrum-1").getAttribute("d");
  fireEvent.change(screen.getByRole("slider", { name: /Component C amplitude/ }), { target: { value: "0.4" } });
  expect(c.getAttribute("d")).not.toBe(initialC);
  expect(screen.getByTestId("composition-spectrum-1").getAttribute("d")).toBe(b);
  const magnitude = c.getAttribute("d");
  const wave = screen.getByTestId("composition-sum").getAttribute("d");
  fireEvent.change(screen.getByRole("slider", { name: /Component C phase/ }), { target: { value: "90" } });
  expect(c.getAttribute("d")).toBe(magnitude);
  expect(screen.getByTestId("composition-sum").getAttribute("d")).not.toBe(wave);
});

it("identifies components with matching colors, distinct dashes and live frequencies", () => {
  render(<SoundCompositionExperiment mode="spectrum" language="en" />);
  const legend = screen.getByRole("list", { name: "Curve legend" });
  expect(within(legend).getByText(/Component C · 660 Hz/)).toBeInTheDocument();
  const paths = [0, 1, 2].map(i => screen.getByTestId(`composition-component-${i}`));
  expect(new Set(paths.map(p => p.getAttribute("stroke-dasharray"))).size).toBe(3);
  paths.forEach((p, i) => expect(legend.querySelectorAll("path")[i].getAttribute("stroke")).toBe(p.getAttribute("stroke")));
  fireEvent.change(screen.getByRole("slider", { name: /^Frequency/ }), { target: { value: "440" } });
  expect(within(legend).getByText(/Component C · 1320 Hz/)).toBeInTheDocument();
  expect(within(legend).getByText("Resulting waveform = A + B + C")).toBeInTheDocument();
});

function mockAudio(resume = () => Promise.resolve()) {
  const contexts: Array<ReturnType<typeof create>> = [];
  function create() {
    const oscillator = { frequency: { value: 0, setTargetAtTime: vi.fn() }, setPeriodicWave: vi.fn(), connect: vi.fn(), disconnect: vi.fn(), start: vi.fn(), stop: vi.fn() };
    const gain = { gain: { value: 0, setTargetAtTime: vi.fn() }, connect: vi.fn(), disconnect: vi.fn() };
    return { oscillator, gain, currentTime: 0, createOscillator: () => oscillator, createGain: () => gain, createPeriodicWave: vi.fn((_r: Float32Array, _i: Float32Array, _o: PeriodicWaveConstraints) => ({})), destination: {}, resume, close: vi.fn(() => Promise.resolve()) };
  }
  vi.stubGlobal("AudioContext", vi.fn(function () { const ctx = create(); contexts.push(ctx); return ctx; }));
  return contexts;
}

it("changes waveform with phase without changing magnitude spectrum", () => {
  render(<SoundCompositionExperiment mode="spectrum" language="en" />);
  const path = screen.getByTestId("composition-sum").getAttribute("d");
  const line = screen.getByTestId("composition-spectrum-1").getAttribute("d");
  fireEvent.change(screen.getByRole("slider", { name: /Component B phase/ }), { target: { value: "1" } });
  expect(screen.getByTestId("composition-sum").getAttribute("d")).not.toBe(path);
  expect(screen.getByTestId("composition-spectrum-1").getAttribute("d")).toBe(line);
});

it("updates shared audio coefficients, stops another experiment, and cleans up on exit", async () => {
  const contexts = mockAudio();
  const view = render(<><SoundCompositionExperiment mode="tone" language="en" /><SoundCompositionExperiment mode="sum" language="en" /></>);
  fireEvent.click(within(screen.getByTestId("sound-composition-tone")).getByRole("button", { name: "Listen to this waveform" }));
  await waitFor(() => expect(contexts[0].oscillator.start).toHaveBeenCalledOnce());
  expect(contexts[0].createPeriodicWave.mock.calls[0][2]).toEqual({ disableNormalization: true });
  fireEvent.click(within(screen.getByTestId("sound-composition-sum")).getByRole("button", { name: "Listen to this waveform" }));
  await waitFor(() => expect(contexts[1].oscillator.start).toHaveBeenCalledOnce());
  expect(contexts[0].close).toHaveBeenCalledOnce();
  fireEvent.change(within(screen.getByTestId("sound-composition-sum")).getByRole("slider", { name: /Component B phase/ }), { target: { value: "180" } });
  const calls = contexts[1].createPeriodicWave.mock.calls;
  expect(Math.abs(calls[calls.length - 1][1][1])).toBeLessThan(1e-6);
  view.unmount(); expect(contexts[1].close).toHaveBeenCalledOnce();
});

it("cannot start a pending audio request after unmount", async () => {
  let finish!: () => void;
  const contexts = mockAudio(() => new Promise<void>(resolve => { finish = resolve; }));
  const view = render(<SoundCompositionExperiment mode="tone" language="en" />);
  fireEvent.click(screen.getByRole("button", { name: "Listen to this waveform" }));
  view.unmount(); await act(async () => finish());
  expect(contexts[0].oscillator.start).not.toHaveBeenCalled();
  expect(contexts[0].close).toHaveBeenCalledOnce();
});

it("reports playback failure and closes its context", async () => {
  const contexts = mockAudio(() => Promise.reject(new Error("blocked")));
  render(<SoundCompositionExperiment mode="tone" language="en" />);
  fireEvent.click(screen.getByRole("button", { name: "Listen to this waveform" }));
  await screen.findByRole("alert"); expect(contexts[0].close).toHaveBeenCalledOnce();
});
