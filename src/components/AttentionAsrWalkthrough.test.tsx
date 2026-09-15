import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { AttentionAsrWalkthrough } from "./AttentionAsrWalkthrough";

it("steps through decoder tokens and updates the selected attention row", () => {
  const { container, rerender } = render(<AttentionAsrWalkthrough language="zh" />);
  expect(screen.getByTestId("attention-transcript")).toHaveTextContent("尚未生成");
  fireEvent.click(screen.getByRole("button", { name: "生成下一个 token" }));
  expect(screen.getByTestId("attention-transcript").textContent).toBe("你好");
  expect(screen.getByTestId("attention-next")).toHaveTextContent("世界");
  expect(container.querySelector('[data-current="true"] th')).toHaveTextContent("世界");
  fireEvent.click(screen.getByRole("button", { name: "生成下一个 token" }));
  expect(screen.getByTestId("attention-transcript").textContent).toBe("你好世界");
  expect(container.querySelector('[data-current="true"] th')).toHaveTextContent("。");
  fireEvent.click(screen.getByRole("button", { name: "生成下一个 token" }));
  expect(screen.getByTestId("attention-next")).toHaveTextContent("<eot>");
  fireEvent.click(screen.getByRole("button", { name: "生成下一个 token" }));
  expect(screen.getByRole("button", { name: "生成下一个 token" })).toBeDisabled();
  expect(screen.getByTestId("attention-transcript").textContent).toBe("你好世界。");
  fireEvent.click(screen.getByRole("button", { name: "回退" }));
  expect(screen.getByRole("button", { name: "生成下一个 token" })).toBeEnabled();
  expect(screen.getByTestId("attention-next").textContent).toBe("<eot>");
  expect(screen.getAllByRole("cell", { name: /0.70/ }).length).toBeGreaterThan(0);
  expect(screen.getByRole("link", { name: "OpenAI Whisper" })).toHaveAttribute("href", "https://github.com/openai/whisper");
  expect(screen.getByRole("link", { name: "FunASR" })).toHaveAttribute("href", "https://github.com/modelscope/FunASR");
  expect(screen.getByRole("link", { name: "sherpa-onnx" })).toHaveAttribute("href", "https://github.com/k2-fsa/sherpa-onnx");
  rerender(<AttentionAsrWalkthrough language="en" />);
  expect(screen.getByRole("columnheader", { name: "Position 1" })).toBeInTheDocument();
});
