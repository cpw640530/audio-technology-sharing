import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { AsrWalkthrough, collapseCtc } from "./AsrWalkthrough";

it("merges repeats before removing blanks, preserving separated repeats", () => {
  expect(collapseCtc([3, 3, 0, 3, 3]).text).toBe("妈妈");
  expect(collapseCtc([3, 3, 3]).text).toBe("妈");
  expect(collapseCtc([0, 0]).text).toBe("");
  expect(collapseCtc([]).text).toBe("");
});

it("advances RNN-T time only on blank and retains repeated emitted labels", () => {
  const { rerender } = render(<AsrWalkthrough language="zh" />);
  fireEvent.click(screen.getByRole("button", { name: "4. RNN-T 流式识别" }));
  fireEvent.change(screen.getByLabelText("RNN-T 文字示例"), { target: { value: "妈妈" } });
  const next = screen.getByRole("button", { name: "下一步" });
  fireEvent.click(next);
  expect(screen.getByTestId("rnnt-state")).toHaveTextContent("t = 1, u = 0");
  fireEvent.click(next);
  fireEvent.click(next);
  expect(screen.getByTestId("rnnt-state")).toHaveTextContent("t = 1, u = 2");
  expect(screen.getByTestId("rnnt-transcript")).toHaveTextContent("妈妈");
  for (let i = 0; i < 3; i++) fireEvent.click(next);
  expect(next).toBeDisabled();
  expect(screen.getByTestId("rnnt-state")).toHaveTextContent("t = 4, u = 2");
  fireEvent.click(screen.getByRole("button", { name: "上一步" }));
  expect(screen.getByTestId("rnnt-state")).toHaveTextContent("t = 3, u = 2");
  fireEvent.click(screen.getByRole("button", { name: "重置" }));
  expect(screen.getByTestId("rnnt-state")).toHaveTextContent("t = 0, u = 0");
  rerender(<AsrWalkthrough language="en" />);
  expect(screen.getByRole("img", { name: "RNN-T time and label alignment" })).toBeInTheDocument();
});

it("updates CTC output when a separating blank loses, and supports English", () => {
  const { rerender } = render(<AsrWalkthrough language="zh" />);
  fireEvent.click(screen.getByRole("button", { name: "3. CTC 解码" }));
  expect(screen.getByTestId("asr-transcript")).toHaveTextContent("你好");
  fireEvent.change(screen.getByLabelText("文字示例"), { target: { value: "1" } });
  expect(screen.getByTestId("asr-transcript")).toHaveTextContent("妈妈");
  fireEvent.change(screen.getByRole("slider"), { target: { value: "0" } });
  expect(screen.getByTestId("asr-transcript").textContent).toBe("妈");
  const rows = screen.getAllByRole("row").slice(1);
  for (let i = 0; i < 6; i++) {
    const total = rows.reduce((sum, row) => sum + parseFloat(row.querySelectorAll("td")[i].textContent!), 0);
    expect(total).toBeCloseTo(1, 2);
  }
  rerender(<AsrWalkthrough language="en" />);
  expect(screen.getByText("Remove blanks to obtain text")).toBeInTheDocument();
});
