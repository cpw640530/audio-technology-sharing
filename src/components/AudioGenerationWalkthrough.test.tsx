import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { AudioGenerationWalkthrough } from "./AudioGenerationWalkthrough";
import { aceStepBudget } from "./audioGenerationModel";

it("keeps 5Hz codes, 25Hz latents and 48kHz per-channel samples distinct", () => {
  for (const seconds of [10, 20, 60]) {
    const budget = aceStepBudget(seconds);
    expect(budget.semanticSteps).toBe(seconds * 5);
    expect(budget.latentFrames).toBe(seconds * 25);
    expect(budget.samplesPerChannel).toBe(seconds * 48_000);
    expect(budget.latentFrames / budget.semanticSteps).toBe(5);
    expect(budget.samplesPerChannel / budget.latentFrames).toBe(1920);
  }
});

it("replaces MusicGen codebooks with ACE-Step budgets and whole-window updates", () => {
  const { container } = render(<AudioGenerationWalkthrough language="en"/>);
  expect(screen.getByRole("button", { name: "Previous step" })).toBeDisabled();
  expect(screen.getByRole("button", { name: "ACE-Step 1.5 · 2026" })).toHaveAttribute("aria-pressed", "true");
  expect(container.textContent).not.toMatch(/MusicGen|EnCodec|codebooks/);
  fireEvent.click(screen.getByRole("button", { name: "2. Audio representation" }));
  expect(screen.getByTestId("generation-budget")).toHaveTextContent("10 × 25 = 250 latent frames");
  fireEvent.change(screen.getByRole("slider"), { target: { value: "20" } });
  expect(screen.getByTestId("generation-budget")).toHaveTextContent("20 × 5 = 100 codes");
  expect(screen.getByTestId("generation-budget")).toHaveTextContent("20 × 48,000 = 960000 samples/ch");
  fireEvent.click(screen.getByRole("button", { name: "3. How generation works" }));
  expect(screen.getByTestId("generation-latent-count")).toHaveTextContent("Nlatent = 500");
  expect(container.querySelectorAll(".generation-latent-strip sup")).toHaveLength(8);
  for (const k of [0, 1, 8]) {
    fireEvent.change(screen.getByRole("slider"), { target: { value: String(k) } });
    expect(screen.getByTestId("generation-iteration")).toHaveTextContent(`k = ${k}/8`);
    expect(screen.getByTestId("generation-latent-count")).toHaveTextContent("Nlatent = 500");
    for (const node of container.querySelectorAll(".generation-latent-strip sup")) expect(node).toHaveTextContent(`(${k})`);
  }
  fireEvent.click(screen.getByRole("button", { name: "Next step" }));
  expect(screen.getByText("1D VAE decoder")).toBeInTheDocument();
  expect(screen.getByText("48 kHz stereo PCM")).toBeInTheDocument();
  expect(screen.getByText(/960000 samples\/ch/)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Next step" })).toBeDisabled();
  expect(container.querySelectorAll("audio, canvas")).toHaveLength(0);
  fireEvent.click(screen.getByRole("button", { name: "Reset generation walkthrough" }));
  fireEvent.click(screen.getByRole("button", { name: "2. Audio representation" }));
  expect(screen.getByTestId("generation-budget")).toHaveTextContent("10 × 25 = 250");
});

it("uses Stable Audio 3 SAME latents and post-trained ping-pong sampling without borrowing ACE states", () => {
  render(<AudioGenerationWalkthrough language="en"/>);
  fireEvent.click(screen.getByRole("button", { name: "3. How generation works" }));
  fireEvent.click(screen.getByRole("button", { name: "Stable Audio 3 Medium · 2026" }));
  expect(screen.getByRole("button", { name: "3. How generation works" })).toHaveAttribute("aria-current", "step");
  expect(screen.queryByRole("slider")).not.toBeInTheDocument();
  expect(screen.queryByTestId("generation-iteration")).not.toBeInTheDocument();
  expect(screen.getByText(/not song time/)).toBeInTheDocument();
  expect(screen.getByText("Ping-pong sampling")).toBeInTheDocument();
  expect(screen.getByRole("link")).toHaveAttribute("href", "https://github.com/Stability-AI/stable-audio-3");
  fireEvent.click(screen.getByRole("button", { name: "2. Audio representation" }));
  expect(screen.getByText("256-dim SAME latents · ≈10.77 Hz")).toBeInTheDocument();
  expect(screen.getByText(/Dimensions are not audio channels/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "4. Decode & deliver" }));
  expect(screen.getByText("SAME-L decoder")).toBeInTheDocument();
  expect(screen.getByText("44.1 kHz stereo PCM")).toBeInTheDocument();
  expect(screen.queryByText("1D VAE decoder")).not.toBeInTheDocument();
});

it.each(["zh", "zh-Hant", "en", "ja", "ko"] as const)("renders both routes and all stages in %s with reduced motion", language => {
  const media = window.matchMedia;
  const mock = vi.spyOn(window, "matchMedia").mockImplementation(query => ({ ...media(query), matches: true }));
  const { container, unmount } = render(<AudioGenerationWalkthrough language={language}/>);
  for (const route of container.querySelectorAll<HTMLButtonElement>(".tts-route-options button")) {
    fireEvent.click(route);
    for (const button of container.querySelectorAll<HTMLButtonElement>(".tts-stage-nav button")) {
      fireEvent.click(button);
      expect(container.textContent).not.toMatch(/undefined|NaN|MusicGen|EnCodec|AudioLDM|AudioMAE/);
      expect(container.querySelector<HTMLElement>(".generation-stage-content")!.style.opacity).toBe("");
    }
  }
  unmount(); mock.mockRestore();
});
