import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { AlsaLab } from "./AlsaLab";

afterEach(cleanup);
it("steps playback and capture directly in the buffer panel", () => {
  const { container } = render(<AlsaLab language="en" onBack={vi.fn()} />);
  fireEvent.click(screen.getByRole("button", { name: "Buffer and Latency" }));
  const unread = screen.getByRole("slider", { name: "Unread frames" });
  fireEvent.click(screen.getByRole("button", { name: "App writes 128 frames" }));
  expect(unread).toHaveValue("448");
  fireEvent.click(screen.getByRole("button", { name: "Advance hardware 128 frames" }));
  expect(unread).toHaveValue("320");
  expect(screen.getByRole("slider", { name: "Read pointer position" })).toHaveValue("128");
  fireEvent.click(screen.getByRole("button", { name: "Capture: hardware writes / app reads" }));
  expect(unread).toHaveValue("320");
  expect(screen.queryByRole("status")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "App reads 128 frames" }));
  expect(unread).toHaveValue("192");
  fireEvent.change(unread, { target: { value: "512" } });
  fireEvent.click(screen.getByRole("button", { name: "Advance hardware 128 frames" }));
  expect(screen.getByRole("status")).toHaveTextContent("Insufficient space: 128 frames");
  expect(unread).toHaveValue("512");
  fireEvent.change(screen.getByRole("slider", { name: "Read pointer position" }), { target: { value: "256" } });
  expect(unread).toHaveValue("512");
  expect(container.querySelector('.alsa-buffer-stats')).toHaveTextContent('Free capture space0');
});

it.each(["zh", "zh-Hant", "en", "ja", "ko"] as const)("renders buffer actions in %s", language => {
  const { container } = render(<AlsaLab language={language} onBack={vi.fn()} />);
  fireEvent.click(container.querySelectorAll('.alsa-mode-tabs button')[2]);
  expect(container.querySelectorAll('.alsa-ring-actions button')).toHaveLength(4);
  expect(container.innerHTML).not.toMatch(/NaN|undefined|Infinity/);
});
