import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { AiEnhancementPrinciple } from "./AiEnhancementPrinciple";

it.each(["zh", "zh-Hant", "en", "ja", "ko"] as const)("explains a bounded reconstruction route with primary references in %s", language => {
  const { container } = render(<AiEnhancementPrinciple language={language} />);
  expect(screen.getByRole("heading", { level: 2 })).not.toBeEmptyDOMElement();
  expect(container.querySelectorAll("dd")).toHaveLength(3);
  expect(container).toHaveTextContent("y[n] = s[n] + v[n]");
  expect(container).toHaveTextContent("Ŝ = M · Y");
  expect(container).toHaveTextContent("−14 dB");
  expect(screen.getByRole("link", { name: "RNNoise" })).toHaveAttribute("href", "https://jmvalin.ca/demo/rnnoise/");
  expect(screen.getByRole("link", { name: "DeepFilterNet" })).toHaveAttribute("href", "https://github.com/Rikorose/DeepFilterNet");
  expect(container).not.toHaveTextContent("undefined");
});
