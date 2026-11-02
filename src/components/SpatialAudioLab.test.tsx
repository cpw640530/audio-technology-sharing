import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { SpatialAudioLab } from "./SpatialAudioLab";

it.each(["zh", "en"] as const)("keeps spatial diagrams consistent (%s)", language => {
  const { container } = render(<SpatialAudioLab language={language} onBack={() => {}} />);
  const explanation = screen.getByText(language === "zh" ? "原理与渲染流程" : "Principles and rendering flow").closest("details")!;
  expect(explanation).not.toHaveAttribute("open");
  fireEvent.click(explanation.querySelector("summary")!);
  expect(explanation).toHaveAttribute("open");
  const set = (zh: string, en: string, value: number) => fireEvent.change(screen.getByRole("slider", { name: language === "zh" ? zh : en }), { target: { value: String(value) } });
  const ear = (side: string, attr: string) => Number(screen.getByTestId(`spatial-ear-${side}`).getAttribute(`data-${attr}`));
  set("声源角度", "Source angle", 90);
  set("距离", "Distance", 1);
  expect(ear("R", "delay")).toBe(0);
  expect(ear("L", "delay")).toBeCloseTo(0.63);
  expect(20 * Math.log10(ear("R", "gain") / ear("L", "gain"))).toBeCloseTo(9.5);
  set("头部朝向", "Head yaw", 90);
  expect(ear("L", "delay")).toBe(ear("R", "delay"));
  expect(ear("L", "gain")).toBe(ear("R", "gain"));
  set("距离", "Distance", 2);
  expect(ear("R", "gain")).toBe(0.5);
  set("头部朝向", "Head yaw", 0);
  set("声源角度", "Source angle", -90);
  expect(ear("L", "delay")).toBe(0);
  expect(ear("R", "delay")).toBeCloseTo(0.63);
  for (const distance of [1, 8]) for (const reflection of [0, 100]) {
    set("距离", "Distance", distance);
    set("房间反射", "Room reflections", reflection);
    const envelope = container.querySelector(".spatial-reverb-tail-line")!.getAttribute("d")!.split(/ [ML] /).map(point => point.replace(/^M /, "").split(" ").map(Number));
    for (const line of container.querySelectorAll(".spatial-tail-texture")) {
      const x = Number(line.getAttribute("x1")), y = Number(line.getAttribute("y2"));
      const nearest = envelope.reduce((a, b) => Math.abs(b[0] - x) < Math.abs(a[0] - x) ? b : a);
      expect(y).toBeGreaterThanOrEqual(nearest[1] - 1);
      expect(y).toBeLessThanOrEqual(214);
      if (reflection === 0) expect(y).toBe(214);
    }
    expect(container.innerHTML).not.toMatch(/NaN|Infinity/);
  }
});
