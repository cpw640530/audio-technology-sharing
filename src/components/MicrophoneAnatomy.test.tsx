import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { MicrophoneAnatomy } from "./MicrophoneAnatomy";

afterEach(cleanup);

it("keeps numbered callouts outside the moving-coil structure and shows gap fields", () => {
  render(<MicrophoneAnatomy language="zh" />);
  const diagram = screen.getByRole("img", { name: "动圈话筒结构剖面示意" });
  expect(diagram.querySelectorAll(".mic-gap-field path")).toHaveLength(1);
  const callouts = diagram.querySelectorAll(".mic-anatomy-hotspot");
  expect(callouts).toHaveLength(3);
  for (const callout of callouts) {
    expect(callout.querySelector("circle")).toHaveAttribute("cx", "28");
    expect(callout.querySelector("path")).toHaveAttribute("stroke-dasharray", "3 3");
  }
  fireEvent.keyDown(within(diagram).getByRole("button", { name: "音圈" }), { key: "Enter" });
  expect(screen.getByText(/线圈在磁隙内运动产生感应电压/)).toBeInTheDocument();
});

it("shows a clamped electret diaphragm and labels its JFET without covering it", () => {
  render(<MicrophoneAnatomy language="zh" />);
  fireEvent.click(screen.getByRole("button", { name: "驻极体咪头" }));
  const diagram = screen.getByRole("img", { name: "驻极体咪头结构剖面示意" });
  expect(diagram.querySelector(".mic-diaphragm-motion")).toHaveAttribute("d", "M72 89 C110 89 120 89 190 89 C260 89 270 89 308 89");
  expect(within(diagram).getByText("JFET", { selector: "text" })).toBeInTheDocument();
  expect(within(diagram).getByText(/振膜边缘固定，中心挠曲/)).toBeInTheDocument();
  expect(within(diagram).getByText(/均匀间隙近似/)).toBeInTheDocument();
});

it("connects both MEMS electrodes to a labeled ASIC and distinguishes the enlarged layers", () => {
  render(<MicrophoneAnatomy language="en" />);
  fireEvent.click(screen.getByRole("button", { name: "Digital MEMS" }));
  const diagram = screen.getByRole("img", { name: "Digital MEMS cross-section schematic" });
  expect(within(diagram).getByText("ASIC", { selector: "text" })).toBeInTheDocument();
  for (const label of ["Fixed backplate", "Air gap", "Moving diaphragm"]) {
    expect(within(diagram).getByText(label)).toBeInTheDocument();
  }
  expect(Array.from(diagram.querySelectorAll(".mic-electrode-connections path"), path => path.getAttribute("d")))
    .toEqual(["M140 157 H174 V151 H222 V186 H238", "M140 175 H164 V211 H238"]);
  fireEvent.click(within(diagram).getByRole("button", { name: "ASIC" }));
  expect(screen.getByText(/PDM needs downstream decimation/)).toBeInTheDocument();
});
