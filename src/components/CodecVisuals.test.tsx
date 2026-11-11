import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { FlacPredictionVisual, PcmStorageVisual } from "./CodecVisuals";

afterEach(cleanup);

describe("Inline codec visualizations", () => {
  it("explains prediction, exact residual and restoration with linked numbers", () => {
    const { container } = render(<FlacPredictionVisual language="en" />);
    const steps = () => Array.from(container.querySelectorAll(".codec-flac-steps strong"), el => el.textContent);
    expect(steps()).toEqual(["104 → 104", "107 − (104) = 3", "104 + (3) = 107"]);
    expect(container.querySelector(".codec-flac-storage")).toHaveTextContent("Then store residuals: 2, 2, 3, 2, 1, 2, 2");
    fireEvent.change(screen.getByLabelText("Predictor"), { target: { value: 2 } });
    expect(steps()).toEqual(["104 + (104 − (102)) = 106", "107 − (106) = 1", "106 + (1) = 107"]);
    fireEvent.change(screen.getByRole("slider"), { target: { value: 4 } });
    expect(steps()).toEqual(["107 + (107 − (104)) = 110", "109 − (110) = -1", "110 + (-1) = 109"]);
    expect(Array.from(container.querySelectorAll(".codec-flac-current"), el => el.textContent)).toEqual(["109", "110", "-1", "109"]);
    fireEvent.change(screen.getByLabelText("Input samples"), { target: { value: "irregular" } });
    expect(steps()).toEqual(["-80 + (-80 − (90)) = -250", "20 − (-250) = 270", "-250 + (270) = 20"]);
    fireEvent.change(screen.getByLabelText("Predictor"), { target: { value: 1 } });
    fireEvent.change(screen.getByRole("slider"), { target: { value: 1 } });
    fireEvent.change(screen.getByLabelText("Predictor"), { target: { value: 2 } });
    expect(screen.getByRole("slider")).toHaveValue("2");
    expect(container.innerHTML).not.toMatch(/NaN|undefined|Infinity/);
  });

  it("keeps PCM bit cells, sample cells, bitrate and byte size consistent for every setting", () => {
    const { container } = render(<PcmStorageVisual language="en" />);
    for (const rate of [8000, 16000, 48000, 96000]) {
      for (const depth of [8, 16, 24, 32]) {
        for (const channels of [1, 2]) {
          fireEvent.change(screen.getByLabelText("Sample rate"), { target: { value: rate } });
          fireEvent.change(screen.getByLabelText("Bit depth"), { target: { value: depth } });
          fireEvent.change(screen.getByLabelText("Channels"), { target: { value: channels } });
          expect(container.querySelectorAll(".codec-bit-cells span")).toHaveLength(depth);
          expect(container.querySelectorAll(".codec-sample-cells rect")).toHaveLength(rate / 1000 * channels);
          const result = screen.getByLabelText("PCM size for 1 second");
          expect(result).toHaveTextContent(`${rate * depth * channels / 1000} kbps`);
          expect(result).toHaveTextContent(`${rate * depth * channels / 8000} kB`);
        }
      }
    }
  });

  it.each([
    { signal: "smooth", order: 1, residual: ["—", "2", "2", "3", "2", "1", "2", "2"] },
    { signal: "smooth", order: 2, residual: ["—", "—", "0", "1", "-1", "-1", "1", "0"] },
    { signal: "irregular", order: 1, residual: ["—", "-150", "140", "-170", "100", "90", "-210", "160"] },
    { signal: "irregular", order: 2, residual: ["—", "—", "290", "-310", "270", "-10", "-300", "370"] },
  ])("restores every sample from order $order residuals for $signal input", ({ signal, order, residual }) => {
    render(<FlacPredictionVisual language="en" />);
    fireEvent.change(screen.getByLabelText("Input samples"), { target: { value: signal } });
    fireEvent.change(screen.getByLabelText("Predictor"), { target: { value: order } });
    const cells = (name: RegExp) => within(screen.getByRole("row", { name })).getAllByRole("cell").map(cell => cell.textContent);
    expect(cells(/^Residual /)).toEqual(residual);
    expect(cells(/^Restored /)).toEqual(cells(/^Original /));
    expect(screen.getByRole("status")).toHaveTextContent("8 / 8 samples restored exactly");
  });

  it.each(["zh", "zh-Hant", "en", "ja", "ko"] as const)("renders both inline demonstrations in %s without invalid coordinates", language => {
    const { container } = render(<><PcmStorageVisual language={language} /><FlacPredictionVisual language={language} /></>);
    expect(screen.getAllByRole("combobox")).toHaveLength(5);
    expect(screen.getAllByRole("img")).toHaveLength(2);
    expect(container.innerHTML).not.toMatch(/NaN|undefined|Infinity/);
  });
});
