import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { AdpcmVisual } from "./AdpcmVisual";

afterEach(cleanup);
it("updates the actual reconstructed signal and inspected code with controls", () => {
  const { container } = render(<AdpcmVisual language="en" />);
  const curve = () => container.querySelector(".predicted polyline")!.getAttribute("points");
  const before = curve();
  fireEvent.change(screen.getByRole("slider", { name: /Initial step-table/ }), { target: { value: "0" } });
  expect(curve()).not.toBe(before);
  const code = () => container.querySelectorAll(".codec-adpcm-steps code")[2].textContent;
  fireEvent.change(screen.getByLabelText("Inspect sample index n"), { target: { value: "1" } });
  expect(code()).toBe("0111");
  fireEvent.change(screen.getByRole("slider", { name: /Input amplitude/ }), { target: { value: "500" } });
  expect(container.querySelector(".codec-adpcm-steps")!.textContent).toContain("191");
});
it.each(["zh", "zh-Hant", "en", "ja", "ko"] as const)("renders a translated ADPCM diagram in %s", language => {
  const { container } = render(<AdpcmVisual language={language} />);
  expect(screen.getAllByRole("slider")).toHaveLength(2);
  expect(screen.getAllByRole("listitem")).toHaveLength(5);
  expect(container.innerHTML).not.toMatch(/NaN|undefined|Infinity/);
});
