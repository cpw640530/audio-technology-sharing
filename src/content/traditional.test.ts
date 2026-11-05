import { expect, it } from "vitest";
import { traditional } from "./traditional";

it("converts Chinese copy without altering numeric data, identifiers or formulas", () => {
  const source = { title: "声音与音频单位", value: 48000, labels: ["采样率", "频率", "x(t) = A sin(2πft)", "PCM / FFT / ASR"] };
  expect(traditional(source)).toEqual({ title: "聲音與音頻單位", value: 48000, labels: ["採樣率", "頻率", "x(t) = A sin(2πft)", "PCM / FFT / ASR"] });
  expect(source.title).toBe("声音与音频单位");
});
