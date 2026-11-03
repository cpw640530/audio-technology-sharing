import { useState } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { StftWorkbench } from "./StftWorkbench";
afterEach(() => { cleanup(); vi.restoreAllMocks(); });
it.each(["zh", "en"] as const)("loads linked STFT comparisons (%s)", language => {
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
  function Harness() {
    const [params, setParams] = useState([512, 256]);
    return <StftWorkbench language={language} windowSize={params[0]} hopSize={params[1]} onParameters={(w, h) => setParams([w, h])} />;
  }
  render(<Harness />);
  const select = screen.getByRole("combobox");
  for (const [key, samples] of [["single", 1024], ["pair", 1024], ["two-short", 256], ["two-long", 1024], ["hop-sparse", 1024], ["hop-dense", 1024], ["pulse-short", 256], ["pulse-long", 1024]] as const) {
    fireEvent.change(select, { target: { value: key } });
    expect(screen.getByTestId("stft-frame-readout")).toHaveTextContent(String(samples));
    expect(screen.getByTestId("stft-frame-span").style.width).toBe(`${samples / 4096 * 100}%`);
  }
});
