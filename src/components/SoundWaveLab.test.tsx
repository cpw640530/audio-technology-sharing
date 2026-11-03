import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { SoundWaveLab } from "./SoundWaveLab";

afterEach(cleanup);

it("keeps frequency and the computed waveform when switching Japanese to Korean", () => {
  const back = () => {};
  const view = render(<SoundWaveLab language="ja" onBack={back} onBackToDetails={back} />);
  expect(screen.getByRole("heading", { name: "音の波形実験室" })).toBeInTheDocument();
  fireEvent.change(screen.getByRole("slider", { name: "周波数" }), { target: { value: "550" } });
  const path = view.container.querySelector(".lab-wave-path")?.getAttribute("d");
  view.rerender(<SoundWaveLab language="ko" onBack={back} onBackToDetails={back} />);
  expect(screen.getByRole("heading", { name: "소리 파형 실험실" })).toBeInTheDocument();
  expect(screen.getByRole("slider", { name: "주파수" })).toHaveValue("550");
  expect(screen.getByRole("button", { name: "상세 설명으로 돌아가기" })).toBeInTheDocument();
  expect(view.container.querySelector(".lab-wave-path")?.getAttribute("d")).toBe(path);
});
