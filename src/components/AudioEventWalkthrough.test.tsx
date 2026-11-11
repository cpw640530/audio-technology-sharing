import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { AudioEventWalkthrough, detectEventRuns } from "./AudioEventWalkthrough";
import { AudioEventPrinciple } from "./AudioEventPrinciple";

afterEach(cleanup);

it("merges adjacent positive bins, includes threshold equality, and flushes the last run", () => {
  expect(detectEventRuns([.5, .8, .2, .9, .9], .5, 2)).toEqual([[0, 2], [3, 5]]);
  expect(detectEventRuns([.7, .2, .8], .5, 2)).toEqual([]);
  expect(detectEventRuns([], .5, 1)).toEqual([]);
  expect(detectEventRuns([.1, .2], 0, 1)).toEqual([[0, 2]]);
  expect(detectEventRuns([.9, 1], 1, 1)).toEqual([[1, 2]]);
});

it("rejects invalid detection parameters", () => {
  expect(() => detectEventRuns([NaN], .5, 1)).toThrow(RangeError);
  expect(() => detectEventRuns([1.1], .5, 1)).toThrow(RangeError);
  expect(() => detectEventRuns([.1], Infinity, 1)).toThrow(RangeError);
  expect(() => detectEventRuns([.1], .5, 0)).toThrow(RangeError);
  expect(() => detectEventRuns([.1], .5, 1.5)).toThrow(RangeError);
});

it("changes decisions but preserves scores and shows the short-event tradeoff", () => {
  render(<AudioEventWalkthrough language="en" />);
  const initialPath = screen.getByTestId("event-score-1").getAttribute("d");
  expect(screen.getByText(/Synthetic frame scores for generic postprocessing/)).toBeInTheDocument();
  expect(screen.getByTestId("event-result-1")).toHaveTextContent("False / missed duration: 0.5 / 0.0 s");
  fireEvent.change(screen.getByRole("combobox", { name: "Minimum retained duration" }), { target: { value: "2" } });
  expect(screen.getByTestId("event-result-1")).toHaveTextContent("False / missed duration: 0.0 / 0.5 s");
  expect(screen.queryAllByTestId("event-run-1")).toHaveLength(0);
  fireEvent.change(screen.getByRole("slider", { name: /Score threshold/ }), { target: { value: ".95" } });
  expect(screen.getByTestId("event-score-1")).toHaveAttribute("d", initialPath);
  expect(screen.queryAllByTestId("event-run-0")).toHaveLength(0);
  fireEvent.click(screen.getByRole("button", { name: "Clip tags" }));
  expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
  expect(screen.getAllByRole("meter")).toHaveLength(3);
  expect(screen.queryByTestId("event-score-1")).not.toBeInTheDocument();
});

it("explains the modern frame-to-boundary model path and keeps YAMNet folded", () => {
  const { container } = render(<AudioEventPrinciple language="en" />);
  expect(screen.getByRole("heading", { name: "A reproducible SED path: PretrainedSED / ATST-F (ICASSP 2025)" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Pretrained frame encoder · ATST-F" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Fine-tuned SED head" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Per-frame multi-label scores" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Postprocess: onset / offset" })).toBeInTheDocument();
  expect(screen.getByText(/encoder alone does not emit event labels or boundaries/)).toBeInTheDocument();
  expect(screen.getByText(/The SED head emits one score per class for each frame/)).toBeInTheDocument();
  expect(container.querySelector("details")).not.toHaveAttribute("open");
  expect(screen.getByText("Classic baseline: YAMNet clip tagging")).toBeInTheDocument();
  expect(container.querySelector("details")).toHaveTextContent(/overlapping 0\.96 s patches every 0\.48 s/);
  expect(screen.getByRole("link", { name: /PretrainedSED/ })).toHaveAttribute("href", "https://github.com/fschmid56/PretrainedSED");
  expect(screen.getByRole("link", { name: /ICASSP 2025/ })).toHaveAttribute("href", "https://arxiv.org/abs/2409.09546");
});

it.each(["zh", "zh-Hant", "en", "ja", "ko"] as const)("renders the event guide and walkthrough in %s", language => {
  const { container } = render(<><AudioEventPrinciple language={language} /><AudioEventWalkthrough language={language} /></>);
  expect(screen.getAllByRole("img")).toHaveLength(3);
  const classicBaseline = container.querySelector("details");
  expect(classicBaseline).not.toBeNull();
  expect(classicBaseline).toHaveTextContent(/521 × sigmoid/);
  expect(container.innerHTML).not.toMatch(/NaN|undefined|Infinity/);
  expect(screen.getByRole("link", { name: /PretrainedSED/ })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /ICASSP 2025/ })).toBeInTheDocument();
  fireEvent.change(screen.getByRole("slider"), { target: { value: ".7" } });
  expect(screen.getByTestId("event-result-0")).toHaveTextContent("[1.5, 3.0) s");
});
