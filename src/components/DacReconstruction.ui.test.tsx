import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { DacReconstruction } from "./DacReconstruction";

afterEach(cleanup);

it("shows distinct PCM, voltage, hold, filter and analog output stages", () => {
  const { container } = render(<DacReconstruction language="zh" bitDepth={2} codes={[0, 1, 2, 3]} values={[-1, -1 / 3, 1 / 3, 1]} />);
  fireEvent.click(screen.getByRole("button", { name: "1. PCM" }));
  expect(screen.getByText("00")).toBeInTheDocument();
  expect(container.querySelector(".codec-step-path")).not.toBeInTheDocument();
  expect(container.querySelectorAll(".digital-quantized-dot")).toHaveLength(4);
  fireEvent.click(screen.getByRole("button", { name: "2. 码值映射为电压" }));
  expect(screen.getByText(/V\[n\] =/)).toBeInTheDocument();
  expect(screen.queryByRole("slider")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "3. 零阶保持" }));
  expect(container.querySelector(".codec-step-path")).toBeInTheDocument();
  expect(container.querySelector(".codec-reconstruction-path")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "4. 重建低通" }));
  expect(container.querySelector(".codec-step-path")).toBeInTheDocument();
  expect(container.querySelector(".codec-reconstruction-path")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "5. 模拟输出" }));
  expect(container.querySelector(".codec-step-path")).not.toBeInTheDocument();
  expect(container.querySelector(".codec-reconstruction-path")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "5. 模拟输出" })).toHaveAttribute("aria-pressed", "true");
});
