import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { WaveSpectrumLab } from "./WaveSpectrumLab";

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
const back = () => {};
const renderLab = () => render(<WaveSpectrumLab language="en" onBack={back} onBackToDetails={back} />);

it("changes only the selected component and keeps amplitude lines fixed for a phase change", () => {
  const view = renderLab();
  const before = screen.getByTestId("wave-spectrum-sum").getAttribute("d");
  const component = screen.getByTestId("wave-spectrum-component-0").getAttribute("d");
  fireEvent.change(screen.getByRole("slider", { name: "750 Hz phase" }), { target: { value: "90" } });
  expect(screen.getByTestId("wave-spectrum-sum").getAttribute("d")).not.toBe(before);
  expect(screen.getByTestId("wave-spectrum-component-0")).toHaveAttribute("d", component);
  expect(screen.getByTestId("spectrum-line-2")).toHaveAttribute("data-amplitude", "0.1");
  fireEvent.change(screen.getByRole("slider", { name: "500 Hz" }), { target: { value: "0.3" } });
  expect(screen.getByTestId("spectrum-line-1")).toHaveAttribute("data-amplitude", "0.3");
  view.rerender(<WaveSpectrumLab language="zh-Hant" onBack={back} onBackToDetails={back} />);
  expect(screen.getByRole("slider", { name: "500 Hz" })).toHaveValue("0.3");
  expect(screen.getByRole("slider", { name: "750 Hz phase" })).toHaveValue("90");
});

function mockAudio(resume = () => Promise.resolve()) {
  const oscillator = { frequency: { value: 0 }, setPeriodicWave: vi.fn(), connect: vi.fn(), disconnect: vi.fn(), start: vi.fn(), stop: vi.fn() };
  const gain = { gain: { value: 0 }, connect: vi.fn(), disconnect: vi.fn() };
  const context = { createOscillator: () => oscillator, createGain: () => gain, createPeriodicWave: vi.fn((_real: Float32Array, _imag: Float32Array, _options: PeriodicWaveConstraints) => ({})), destination: {}, resume, close: vi.fn(() => Promise.resolve()) };
  vi.stubGlobal("AudioContext", vi.fn(function () { return context; }));
  return { context, oscillator, gain };
}

it("plays unnormalized matching coefficients, updates live, and closes on exit", async () => {
  const { context, oscillator, gain } = mockAudio();
  const view = renderLab();
  fireEvent.click(screen.getByRole("button", { name: "Play" }));
  await waitFor(() => expect(oscillator.start).toHaveBeenCalledOnce());
  expect(context.createPeriodicWave.mock.calls[0][2]).toEqual({ disableNormalization: true });
  expect(gain.gain.value).toBe(.15);
  fireEvent.change(screen.getByRole("slider", { name: "500 Hz" }), { target: { value: "0.3" } });
  expect(context.createPeriodicWave.mock.calls.slice(-1)[0][1][2]).toBeCloseTo(.3);
  view.unmount();
  expect(oscillator.stop).toHaveBeenCalledOnce();
  expect(context.close).toHaveBeenCalledOnce();
});

it("does not start a pending playback after leaving", async () => {
  let finish!: () => void;
  const { context, oscillator } = mockAudio(() => new Promise<void>(resolve => { finish = resolve; }));
  const view = renderLab();
  fireEvent.click(screen.getByRole("button", { name: "Play" }));
  view.unmount();
  await act(async () => finish());
  expect(oscillator.start).not.toHaveBeenCalled();
  expect(context.close).toHaveBeenCalledOnce();
});

it("reports audio failures without leaving a context open", async () => {
  const { context } = mockAudio(() => Promise.reject(new Error("blocked")));
  renderLab();
  fireEvent.click(screen.getByRole("button", { name: "Play" }));
  await screen.findByRole("alert");
  expect(context.close).toHaveBeenCalledOnce();
});
