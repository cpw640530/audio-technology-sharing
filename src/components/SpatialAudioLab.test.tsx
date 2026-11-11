import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { SpatialAudioLab } from "./SpatialAudioLab";

afterEach(cleanup);

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

it("switches diagrams and only exposes relevant controls", () => {
  render(<SpatialAudioLab language="en" onBack={vi.fn()} />);
  expect(screen.getByRole("img", { name: "Room reflection time response" })).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Binaural rendering" }));
  expect(screen.getByTestId("spatial-binaural-flow")).toHaveTextContent("yL[n] = g · Σ x[n−k] hL[k]");
  expect(screen.queryByRole("slider", { name: "Room reflections" })).not.toBeInTheDocument();
  expect(screen.queryByRole("img", { name: "Room reflection time response" })).not.toBeInTheDocument();
  fireEvent.change(screen.getByRole("slider", { name: "Source angle" }), { target: { value: "60" } });
  fireEvent.change(screen.getByRole("slider", { name: "Head yaw" }), { target: { value: "30" } });
  expect(screen.getByTestId("spatial-binaural-flow")).toHaveTextContent("+30°");
  fireEvent.change(screen.getByRole("slider", { name: "Distance" }), { target: { value: "2" } });
  expect(screen.getByTestId("spatial-binaural-flow")).toHaveTextContent("g = 1 / d = 0.500");

  fireEvent.click(screen.getByRole("button", { name: "Object / channel" }));
  expect(screen.queryByTestId("spatial-binaural-flow")).not.toBeInTheDocument();
  expect(screen.queryByRole("slider", { name: "Head yaw" })).not.toBeInTheDocument();
  expect(screen.queryByTestId("spatial-ear-L")).not.toBeInTheDocument();
  expect(screen.getByTestId("spatial-object-mapping")).toHaveTextContent("PCM + +60° · 2.0 m");
  expect(screen.getByTestId("spatial-output-channels").children).toHaveLength(6);
  fireEvent.click(screen.getByRole("button", { name: "Headphones" }));
  expect(screen.getByTestId("spatial-output-channels").children).toHaveLength(2);
  expect(screen.getByTestId("spatial-output-channels")).not.toHaveTextContent("LFE");
  fireEvent.click(screen.getByRole("button", { name: "Localization cues" }));
  expect(screen.getByRole("slider", { name: "Head yaw" })).toHaveValue("30");
  expect(screen.getByRole("slider", { name: "Room reflections" })).toHaveValue("42");
});

it("keeps the world source fixed while the head-relative source turns and wraps", () => {
  render(<SpatialAudioLab language="en" onBack={vi.fn()} />);
  fireEvent.click(screen.getByRole("button", { name: "Head tracking" }));
  const world = screen.getByTestId("spatial-world-source");
  const head = screen.getByTestId("spatial-head-source");
  const worldX = world.getAttribute("cx");
  const headX = head.getAttribute("cx");
  fireEvent.change(screen.getByRole("slider", { name: "Head yaw" }), { target: { value: "90" } });
  expect(world).toHaveAttribute("cx", worldX);
  expect(head.getAttribute("cx")).not.toBe(headX);
  expect(screen.getByTestId("spatial-head-coordinates")).toHaveTextContent("= -125°");
  fireEvent.change(screen.getByRole("slider", { name: "Source angle" }), { target: { value: "-150" } });
  expect(screen.getByTestId("spatial-head-coordinates")).toHaveTextContent("= +120°");
});

it.each(["zh", "zh-Hant", "en", "ja", "ko"] as const)("renders all mode diagrams in %s", language => {
  const { container } = render(<SpatialAudioLab language={language} onBack={vi.fn()} />);
  const tabs = container.querySelectorAll('.spatial-audio-tabs button');
  for (let index = 0; index < tabs.length; index++) {
    fireEvent.click(tabs[index]);
    expect(tabs[index]).toHaveAttribute("aria-pressed", "true");
    expect(container.innerHTML).not.toMatch(/NaN|undefined|Infinity/);
    expect(container.querySelector('.spatial-mode-description')).not.toBeEmptyDOMElement();
    if (index === 2) {
      const group = container.querySelector('.spatial-object-mapping .waveform-tabs') as HTMLElement;
      expect(within(group).getAllByRole('button')).toHaveLength(2);
    }
  }
});
