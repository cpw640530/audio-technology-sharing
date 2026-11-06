import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { MicrophoneLab } from "./MicrophoneLab";

afterEach(cleanup);

it("keeps polar controls without sound examples or playback", () => {
  render(<MicrophoneLab language="en" onBack={vi.fn()} />);
  expect(screen.queryByRole("button", { name: "Play pickup example" })).not.toBeInTheDocument();
  expect(screen.getByRole("img", { name: "Microphone polar pattern chart" })).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Figure-8" }));
  fireEvent.change(screen.getByRole("slider", { name: "Source angle" }), { target: { value: "90" } });
  expect(screen.getByText("Pattern: Figure-8")).toBeInTheDocument();
  expect(screen.getByRole("slider", { name: "Source angle" })).toHaveValue("90");
  expect(screen.queryByRole("group", { name: "Pickup examples" })).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Clipping" })).not.toBeInTheDocument();
});

it.each(["Analog electret capsule", "Digital MEMS mic", "Dynamic vocal mic"])("shows overload instead of a valid positive-dBFS output for %s", name => {
  render(<MicrophoneLab language="en" onBack={vi.fn()} />);
  fireEvent.click(within(screen.getByRole("group", { name: "Microphone principle type" })).getByRole("button", { name }));
  expect(screen.queryByText(/Diaphragm motion about/)).not.toBeInTheDocument();
  const diagram = screen.getByRole("img", { name: `${name} principle diagram` });
  const before = diagram.querySelector(".mic-diaphragm-line")!.getAttribute("d");
  fireEvent.change(screen.getByRole("slider", { name: "Working principle input SPL" }), { target: { value: "124" } });
  expect(screen.getByRole("status")).toHaveTextContent(/Overload.*PCM clips/);
  expect(diagram.querySelector(".mic-diaphragm-line")!.getAttribute("d")).not.toBe(before);
  expect(screen.queryByText(/About (4|6|16)\.0 dBFS/)).not.toBeInTheDocument();
});

it("switches PDM density and serialized PCM examples without implying a complete I2S timing diagram", () => {
  render(<MicrophoneLab language="en" onBack={vi.fn()} />);
  fireEvent.click(screen.getByRole("button", { name: "Digital MEMS mic" }));
  const diagram = screen.getByRole("img", { name: "Digital output bit illustration" });
  const before = diagram.querySelector(".mic-pdm-line")!.getAttribute("d");
  fireEvent.change(screen.getByRole("slider", { name: "Working principle input SPL" }), { target: { value: "114" } });
  expect(diagram.querySelector(".mic-pdm-line")!.getAttribute("d")).not.toBe(before);
  expect(screen.getByText(/local density, not logic height/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "I2S" }));
  expect(screen.getByText(/one-bit delay are not shown/)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "I2S" })).toHaveAttribute("aria-pressed", "true");
});

it("connects all four microphones to the average and separates target amplitude from SNR", () => {
  render(<MicrophoneLab language="en" onBack={vi.fn()} />);
  fireEvent.click(screen.getByRole("button", { name: "Multi-mic array" }));
  const diagram = screen.getByRole("img", { name: "Multi-mic array principle diagram" });
  const connections = diagram.querySelectorAll("path.mic-signal-line[d^='M252']");
  expect(connections).toHaveLength(4);
  expect(screen.getByText("Target: 1.00 × one channel")).toBeInTheDocument();
  expect(screen.getByText("+6.0 dB")).toBeInTheDocument();
  expect(screen.queryByText("12.62 mVrms")).not.toBeInTheDocument();
  expect(screen.getByRole("img", { name: "Four-mic delay and aligned average" }).querySelectorAll("path.mic-signal-line")).toHaveLength(4);
});
