import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { RobotAudioLab } from "./RobotAudioLab";

afterEach(cleanup);

describe("scene geometry", () => {
  it("updates the geometric relative direction with robot heading", () => {
    render(<RobotAudioLab language="en" onBack={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "Working scene" }));
    expect(screen.getByTestId("robot-bearing")).toHaveTextContent("-45°");

    fireEvent.change(screen.getByRole("slider", { name: "Robot heading" }), { target: { value: "-45" } });
    expect(screen.getByTestId("robot-bearing")).toHaveTextContent("0°");
  });

  it.each(["zh", "zh-Hant", "en", "ja", "ko"] as const)("keeps the scene labels defined in %s", (language) => {
    render(<RobotAudioLab language={language} onBack={vi.fn()} />);

    expect(document.body.textContent).not.toContain("undefined");
  });

  it("hides array direction output in single-mic mode", () => {
    render(<RobotAudioLab language="en" onBack={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "Working scene" }));
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "1" } });

    expect(screen.getByTestId("robot-bearing")).toHaveTextContent("Single mic: array localization unavailable");
    expect(screen.getByTestId("robot-bearing")).not.toHaveTextContent("geometric ground truth");
  });

  it("does not assign a direction when the source overlaps the robot center", () => {
    render(<RobotAudioLab language="en" onBack={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "Working scene" }));
    const person = screen.getByRole("button", { name: "Person" });
    for (let i = 0; i < 17; i += 1) fireEvent.keyDown(person, { key: "ArrowRight" });
    for (let i = 0; i < 17; i += 1) fireEvent.keyDown(person, { key: "ArrowDown" });

    expect(screen.getByTestId("robot-bearing")).toHaveTextContent("undefined (source overlaps robot center)");
  });
});
