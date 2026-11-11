import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AutomotiveAudioLab } from "./AutomotiveAudioLab";
import { MeetingScenarioGuide } from "./MeetingScenarioGuide";

const languages = ["zh", "zh-Hant", "en", "ja", "ko"] as const;

afterEach(cleanup);

describe("application lab visuals", () => {
  it("keeps the planar view mounted once below the 3D view, including without WebGL", async () => {
    const { container } = render(<AutomotiveAudioLab language="en" onBack={vi.fn()} />);
    expect(screen.getByRole("region", { name: "3D cabin layout" })).toBeInTheDocument();
    const planar = screen.getByRole("region", { name: "Planar layout and processing flow" });
    await screen.findByTestId("car-cabin-fallback", {}, { timeout: 10000 });
    expect(container.querySelectorAll(".automotive-diagram svg")).toHaveLength(1);
    for (const [label, mode] of [["Whole-car layout", "layout"], ["Voice interaction", "voice"], ["Source localization", "localization"], ["Spatial audio", "spatial"], ["ANC / RNC", "anc"]]) {
      fireEvent.click(screen.getByRole("button", { name: label }));
      expect(planar.querySelector("svg")).toHaveAttribute("data-active-module", mode);
    }
  }, 15000);

  it("keeps meeting AEC and echo arrows directed to their actual targets", () => {
    const { container } = render(<MeetingScenarioGuide language="en" />);
    const svg = container.querySelector(".meeting-scene-figure svg")!;
    const arrows = Array.from(svg.querySelectorAll<SVGPathElement>(".meeting-arrow"));
    const echo = svg.querySelector<SVGPathElement>(".meeting-echo-arrow")!;

    expect(arrows[1]).toHaveAttribute("d", "M317 205 C390 205 415 272 490 272");
    expect(echo).toHaveAttribute("d", "M282 226 C390 350 410 350 282 282");

    fireEvent.click(screen.getByRole("button", { name: "Poor network" }));
    expect(svg.querySelectorAll("text")).toHaveLength(16);
    expect(Array.from(svg.querySelectorAll("text")).map((text) => text.textContent)).toContain("#5");
    expect(Array.from(svg.querySelectorAll("text")).map((text) => text.textContent)).toContain("#4");
    const missing = container.querySelector<SVGRectElement>('svg rect[stroke="#b44c6d"]')!;
    const missingStart = Number(missing.getAttribute("x"));
    const missingEnd = missingStart + Number(missing.getAttribute("width"));
    expect(missingStart).toBeGreaterThanOrEqual(235 + 54);
    expect(missingEnd).toBeLessThanOrEqual(340);
  });

  it("keeps ANC reference and error feedback arrows directed to the controller", () => {
    const { container } = render(<AutomotiveAudioLab language="en" onBack={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: "ANC / RNC" }));
    const svg = container.querySelector(".automotive-diagram svg")!;
    const paths = Array.from(svg.querySelectorAll<SVGPathElement>(".auto-anc-wave"));
    const pathData = paths.map((path) => path.getAttribute("d"));

    expect(pathData).toContain("M114 494 V512");
    expect(pathData).toContain("M414 330 Q320 410 206 540");
    expect(pathData).toContain("M566 330 Q440 410 206 540");
    expect(pathData).not.toContain("M736 518 Q628 392 566 330");
    expect(pathData).not.toContain("M566 330 Q660 410 736 540");

    const centerSpeaker = Array.from(svg.querySelectorAll("text.auto-component-text")).find((text) => text.textContent === "Center speaker");
    expect(centerSpeaker).toHaveAttribute("y", "132");
  });

  it.each(languages)("keeps localized SVG labels populated (%s)", (language) => {
    const { container: meeting } = render(<MeetingScenarioGuide language={language} />);
    const { container: automotive } = render(<AutomotiveAudioLab language={language} onBack={vi.fn()} />);
    const labels = [...meeting.querySelectorAll("svg text"), ...automotive.querySelectorAll("svg text")];

    expect(labels.length).toBeGreaterThan(0);
    expect(labels.every((label) => Boolean(label.textContent?.trim()))).toBe(true);
    expect(`${meeting.textContent}\n${automotive.textContent}`).not.toMatch(/undefined|null|NaN/);
  });
});
