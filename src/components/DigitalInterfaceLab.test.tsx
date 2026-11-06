import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Language } from "../content/knowledge";
import { DigitalInterfaceLab } from "./DigitalInterfaceLab";

describe("DigitalInterfaceLab timing", () => {
  it.each<Language>(["zh", "zh-Hant", "en", "ja", "ko"])("keeps slot widths, clocks and diagrams consistent in %s", language => {
    const { container } = render(<DigitalInterfaceLab language={language} onBack={vi.fn()} />);
    const chart = () => container.querySelector(".interface-diagram-scroll svg")!;
    const cycles = () => chart().querySelector("[data-cycles]")!;
    expect(cycles()).toHaveAttribute("data-cycles", "64");
    expect(chart().querySelectorAll('[data-bit="padding"]')).toHaveLength(16);
    const bitWidth = 588 / 64;
    expect(chart().querySelector(".interface-frame-line")).toHaveAttribute("d", `M ${124 - 2 * bitWidth} 104 H ${124 - bitWidth} V 132 H ${418 - bitWidth} V 104 H ${712 - bitWidth} V 132 H 712`);
    const clock = cycles().getAttribute("d");
    fireEvent.change(screen.getAllByRole("slider")[1], { target: { value: "16" } });
    expect(cycles().getAttribute("d")).toBe(clock);
    expect(chart().querySelectorAll('[data-bit="padding"]')).toHaveLength(32);
    fireEvent.change(screen.getAllByRole("combobox")[0], { target: { value: "16" } });
    expect(cycles()).toHaveAttribute("data-cycles", "32");
    expect(chart().querySelectorAll('[data-bit="padding"]')).toHaveLength(0);
    fireEvent.change(screen.getAllByRole("slider")[1], { target: { value: "32" } });
    expect(screen.getAllByRole("combobox")[0]).toHaveValue("32");
    fireEvent.change(screen.getAllByRole("slider")[0], { target: { value: "96" } });
    expect(cycles()).toHaveAttribute("data-cycles", "64");
    expect(container.querySelector(".digital-lab-status span")).toHaveTextContent("6.144 MHz / SD");
    fireEvent.change(screen.getAllByRole("slider")[2], { target: { value: "8" } });
    expect(cycles()).toHaveAttribute("data-cycles", "64");
    expect(chart().querySelectorAll("[data-bit]")).toHaveLength(256);
    fireEvent.click(screen.getByRole("button", { name: "TDM" }));
    expect(cycles()).toHaveAttribute("data-cycles", "256");
    expect(chart().querySelector("[data-pulse-width]")).toHaveAttribute("data-pulse-width", String(620 / 256));
    expect(container.querySelector(".digital-lab-status span")).toHaveTextContent("24.576 MHz");
    for (const protocol of ["PDM", "SPDIF", "USB Audio"]) {
      fireEvent.click(screen.getByRole("button", { name: protocol }));
      expect(screen.queryByRole("slider")).not.toBeInTheDocument();
      expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
      expect(container.querySelector(".digital-lab-status span")).not.toBeInTheDocument();
    }
    expect(chart().querySelector('path[d="M 542 366 L 560 366"]')).toBeInTheDocument();
    expect(chart().querySelector('path[d="M 633 408 V 452 H 122 V 408"]')).toBeInTheDocument();
  });
});
