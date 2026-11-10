import { act, fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { NyquistExplorer, sampledTone } from "./NyquistExplorer";

it("preserves every sample when folding across several Nyquist zones and phases", () => {
  for (const rate of [2, 3, 4, 8, 24]) for (const f of [.5, 2, 6, 12]) for (const phase of [0, .3, Math.PI / 2]) {
    const tone = sampledTone(f, rate, phase);
    expect(Math.abs(tone.folded)).toBeLessThanOrEqual(rate / 2);
    tone.samples.forEach(p => expect(tone.value(p.time, tone.folded)).toBeCloseTo(p.value, 10));
  }
});

it("shows boundary phase ambiguity and distinct adequate/alias cases", () => {
  render(<NyquistExplorer language="en"/>);
  expect(screen.getByText(/Aliasing: different waves/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Exactly twice" }));
  screen.getAllByTestId("nyquist-sample").forEach(p => expect(Number(p.getAttribute("cy"))).toBeCloseTo(100));
  fireEvent.change(screen.getByRole("slider", { name: /Initial phase/ }), { target: { value: "90" } });
  expect(Number(screen.getAllByTestId("nyquist-sample")[0].getAttribute("cy"))).toBeCloseTo(40);
  expect(Number(screen.getAllByTestId("nyquist-sample")[1].getAttribute("cy"))).toBeCloseTo(160);
  fireEvent.click(screen.getByRole("button", { name: "Adequate" }));
  expect(screen.getByText(/Recoverable under/)).toBeInTheDocument();
  expect(screen.getAllByTestId("nyquist-sample")).toHaveLength(9);
});

it("reveals samples over time, pauses and disposes its animation", () => {
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "requestAnimationFrame", "cancelAnimationFrame", "performance"] });
  const view = render(<NyquistExplorer language="en"/>);
  fireEvent.click(screen.getByRole("button", { name: "Play sampling animation" }));
  expect(screen.getAllByTestId("nyquist-sample")).toHaveLength(1);
  act(() => vi.advanceTimersByTime(1500));
  expect(screen.getAllByTestId("nyquist-sample").length).toBeGreaterThan(1);
  fireEvent.click(screen.getByRole("button", { name: "Pause sampling animation" }));
  const count = screen.getAllByTestId("nyquist-sample").length;
  act(() => vi.advanceTimersByTime(1500));
  expect(screen.getAllByTestId("nyquist-sample")).toHaveLength(count);
  view.unmount(); vi.useRealTimers();
});

it.each(["zh", "zh-Hant", "en", "ja", "ko"] as const)("renders labels and formulas in %s", language => {
  const { container } = render(<NyquistExplorer language={language}/>);
  expect(screen.getAllByRole("slider")).toHaveLength(3);
  expect(container.textContent).not.toMatch(/undefined|NaN/);
  expect(screen.getByRole("link")).toHaveAttribute("href", "https://www.analog.com/en/resources/faqs/FAQ_antialiasing_filter.html");
});
