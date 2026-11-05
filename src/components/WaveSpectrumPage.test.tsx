import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import type { Language } from "../content/knowledge";
import { WaveSpectrumPage } from "./WaveSpectrumPage";

afterEach(cleanup);

it.each<Language>(["zh", "zh-Hant", "en", "ja", "ko"])("owns superposition and spectra while preserving the lab entry (%s)", language => {
  const onOpenLab = vi.fn();
  const { container } = render(<WaveSpectrumPage language={language} onBack={vi.fn()} onOpenLab={onOpenLab} onPrevious={vi.fn()} onNext={vi.fn()} relatedTopics={null} />);
  expect(screen.getAllByTestId("sound-composition-sum")).toHaveLength(1);
  expect(screen.getAllByTestId("sound-composition-spectrum")).toHaveLength(1);
  expect(screen.queryByTestId("sound-composition-tone")).not.toBeInTheDocument();
  expect(screen.getByRole("table")).toBeInTheDocument();
  expect(container.querySelectorAll(".sound-topic-formula-block")).toHaveLength(1);
  fireEvent.click(container.querySelector<HTMLButtonElement>(".wave-spectrum-entry button")!);
  expect(onOpenLab).toHaveBeenCalledOnce();
});
