import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import type { Language } from "../content/knowledge";
import { SoundTopicPage } from "./SoundTopicPage";
import { traditional } from "../content/traditional";

afterEach(cleanup);

it("keeps physical sound concepts here and links to waveform reading", () => {
  const onOpenLab = vi.fn();
  const onOpenNext = vi.fn();
  const { container } = render(<SoundTopicPage language="zh" onBack={vi.fn()} onOpenLab={onOpenLab} onOpenNext={onOpenNext} />);
  const headings = Array.from(container.querySelectorAll("section h2"), node => node.textContent);
  const sequence = [
    "1. 声音是什么？",
    "2. 声音如何产生？",
    "3. 声音如何传播到耳朵？",
    "进一步探索：振动与波形",
  ];
  const positions = sequence.map(title => headings.indexOf(title));
  expect(positions.every(position => position >= 0)).toBe(true);
  expect(positions).toEqual([...positions].sort((a, b) => a - b));
  expect(screen.getByText(/固定振幅不保证主观上一样响/)).toBeInTheDocument();
  expect(screen.getByText(/不表示绝对气压变成负数/)).toBeInTheDocument();
  expect(container.querySelector(".sound-propagation")).toBeInTheDocument();
  expect(container.querySelectorAll(".sound-composition")).toHaveLength(1);
  expect(screen.queryByTestId("sound-composition-sum")).not.toBeInTheDocument();
  expect(screen.queryByTestId("sound-composition-spectrum")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "下一篇：读懂波形与频谱" }));
  expect(onOpenNext).toHaveBeenCalledOnce();
  expect(screen.queryByText(/从振动到 PCM/)).not.toBeInTheDocument();
  fireEvent.click(container.querySelector<HTMLButtonElement>(".diagram-open-button")!);
  expect(onOpenLab).toHaveBeenCalledOnce();
});

it.each<[Language, string]>([
  ["en", "1. What is sound?"],
  ["zh-Hant", traditional("1. 声音是什么？")],
  ["ja", "1. 音とは何か？"],
  ["ko", "1. 소리란 무엇인가요?"],
])("provides the beginner introduction in %s", (language, title) => {
  render(<SoundTopicPage language={language} onBack={vi.fn()} onOpenLab={vi.fn()} onOpenNext={vi.fn()} />);
  expect(screen.getByRole("heading", { name: title })).toBeInTheDocument();
});
