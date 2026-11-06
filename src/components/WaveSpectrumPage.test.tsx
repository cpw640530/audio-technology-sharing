import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import type { Language } from "../content/knowledge";
import { WaveSpectrumPage } from "./WaveSpectrumPage";

afterEach(cleanup);

it.each<Language>(["zh", "zh-Hant", "en", "ja", "ko"])("explains with a static example and leaves controls in the lab (%s)", language => {
  const onOpenLab = vi.fn();
  const { container } = render(<WaveSpectrumPage language={language} onBack={vi.fn()} onOpenLab={onOpenLab} onPrevious={vi.fn()} onNext={vi.fn()} relatedTopics={null} />);
  expect(screen.getByTestId("wave-spectrum-example")).toBeInTheDocument();
  expect(screen.queryByTestId("sound-composition-sum")).not.toBeInTheDocument();
  expect(screen.queryByTestId("sound-composition-spectrum")).not.toBeInTheDocument();
  expect(screen.queryByRole("slider")).not.toBeInTheDocument();
  expect(screen.queryByTestId("sound-composition-tone")).not.toBeInTheDocument();
  expect(screen.getByRole("table")).toBeInTheDocument();
  expect(container.querySelectorAll(".sound-topic-formula-block")).toHaveLength(1);
  fireEvent.click(container.querySelector<HTMLButtonElement>(".wave-spectrum-entry button")!);
  expect(onOpenLab).toHaveBeenCalledOnce();
  fireEvent.click(container.querySelector<HTMLButtonElement>('.sound-topic-section > .diagram-open-button')!);
  expect(onOpenLab).toHaveBeenCalledTimes(2);
});
