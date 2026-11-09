import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { AsrPrinciple } from "./AsrPrinciple";

it.each(["zh", "zh-Hant", "en", "ja", "ko"] as const)("compares alternative ASR routes and explains CER/RTF in %s", language => {
  const { container } = render(<AsrPrinciple language={language} />);
  expect(screen.getByRole("heading", { level: 2 })).not.toBeEmptyDOMElement();
  expect(container.querySelectorAll(".asr-timeline > div")).toHaveLength(6);
  for (const [name, url] of [["CTC", "https://huggingface.co/learn/audio-course/en/chapter3/ctc"], ["RNN-T / Transducer", "https://arxiv.org/abs/1211.3711"], ["Attention Encoder–Decoder", "https://github.com/openai/whisper"]]) {
    fireEvent.click(screen.getByRole("button", { name }));
    expect(screen.getByRole("button", { name })).toHaveAttribute("aria-pressed", "true");
    expect(container.querySelector(".asr-reading-more a")).toHaveAttribute("href", url);
  }
  expect(container.querySelectorAll(".asr-attention-tokens > div")).toHaveLength(3);
  expect(container.querySelectorAll(".asr-time-used")).toHaveLength(2);
  expect(container.querySelectorAll(".asr-missing")).toHaveLength(1);
  expect(container).toHaveTextContent("CER=(0+1+0)/5=20%");
  expect(container).toHaveTextContent("RTF=0.2");
  expect(container).not.toHaveTextContent("undefined");
});
