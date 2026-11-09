import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { TtsPrinciple } from "./TtsPrinciple";

it.each(["zh", "zh-Hant", "en", "ja", "ko"] as const)("renders one bounded TTS journey in %s", language => {
  const { container } = render(<TtsPrinciple language={language} />);
  expect(container.querySelectorAll("section.sound-topic-section.tts-principle")).toHaveLength(1);
  expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(1);
  expect(container.querySelectorAll("ol.ai-topic-flow.tts-journey-strip > li")).toHaveLength(4);
  expect(container.querySelectorAll("ol.tts-journey-strip > li svg")).toHaveLength(4);
  expect(container).toHaveTextContent("Hello, AI!");
  expect(container).toHaveTextContent("Hello, A I!");
  expect(container.querySelector('a[href="https://arxiv.org/abs/2006.04558"]')).toBeTruthy();
  expect(container.querySelector('a[href="https://github.com/jik876/hifi-gan"]')).toBeTruthy();
  expect(container).not.toHaveTextContent("undefined");
});

it("states the waveform and model boundaries without fabricating inference output", () => {
  const { container } = render(<TtsPrinciple language="en" />);
  expect(container).toHaveTextContent("not one unique waveform");
  expect(container).toHaveTextContent("duration, pitch, and timbre");
  expect(container).toHaveTextContent("modern models need not expose explicit phonemes or durations");
  expect(container).toHaveTextContent("A vocoder generates");
  expect(container).toHaveTextContent("not an inverse FFT of a Mel image");
  expect(container.querySelector("canvas")).toBeNull();
});
