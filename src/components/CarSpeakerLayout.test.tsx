import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import CarSpeakerLayout from "./CarSpeakerLayout";
import { carSpeakers } from "../content/carSpeakers";
import { carAcousticScenes, type CarAcousticMode } from "../content/carAcoustics";

it.each(["zh", "zh-Hant", "en", "ja", "ko"] as const)("keeps all speaker explanations accessible without WebGL in %s", language => {
  const { container } = render(<CarSpeakerLayout language={language} />);
  expect(screen.getByRole("status")).not.toHaveTextContent("undefined");
  expect(container.querySelector("canvas")).not.toBeInTheDocument();
  expect(screen.getAllByRole("option")).toHaveLength(8);
  expect(screen.getAllByRole("button")).toHaveLength(5);
  for (const button of screen.getAllByRole("button")) expect(button).toBeDisabled();
  carSpeakers.forEach((speaker, index) => {
    fireEvent.change(screen.getByRole("combobox"), { target: { value: index } });
    expect(screen.getByRole("heading", { name: `${index + 1}. ${speaker.title[language]}` })).toBeVisible();
    expect(screen.getByText(speaker.purpose[language])).toBeVisible();
  });
});

it.each(["zh", "zh-Hant", "en", "ja", "ko"] as const)("switches component explanations and routes together in the lab (%s)", language => {
  const { container, rerender } = render(<CarSpeakerLayout language={language} module="layout" />);
  for (const mode of Object.keys(carAcousticScenes) as CarAcousticMode[]) {
    rerender(<CarSpeakerLayout language={language} module={mode} />);
    expect(container.querySelector(".car-speaker-layout")).toHaveAttribute("data-active-module", mode);
    expect(screen.getAllByRole("option")).toHaveLength(carAcousticScenes[mode].points.length);
    expect(screen.getByText(carAcousticScenes[mode].caption[language])).toBeInTheDocument();
    const options = screen.getAllByRole("option") as HTMLOptionElement[];
    const last = options[options.length - 1];
    fireEvent.change(screen.getByRole("combobox"), { target: { value: last.value } });
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(last.textContent!);
    expect(container.textContent).not.toMatch(/undefined|NaN/);
  }
});

it("uses the supplied 2D fallback without leaving dead 3D controls", () => {
  render(<CarSpeakerLayout language="en" module="anc" fallback={<p>Planar cabin fallback</p>} />);
  expect(screen.getByText("Planar cabin fallback")).toBeInTheDocument();
  expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
});
