import { expect, it } from "vitest";
import { carSpeakers } from "./carSpeakers";
import { traditional } from "./traditional";

const languages = ["zh", "zh-Hant", "en", "ja", "ko"] as const;
const expectedLayout = [
  ["front-left-tweeter", [-1.05, 1.3, -1.4], "tweeter"],
  ["front-right-tweeter", [1.05, 1.3, -1.4], "tweeter"],
  ["center", [0, 1.08, -1.55], "center"],
  ["front-left-door", [-1.17, 0.9, -0.65], "door"],
  ["front-right-door", [1.17, 0.9, -0.65], "door"],
  ["rear-left-door", [-1.17, 0.9, 1.15], "door"],
  ["rear-right-door", [1.17, 0.9, 1.15], "door"],
  ["sub", [0, 1.05, 2], "sub"]
] as const;

it("keeps the fixed eight-speaker layout and unique IDs", () => {
  expect(carSpeakers).toHaveLength(8);
  expect(new Set(carSpeakers.map(({ id }) => id)).size).toBe(8);
  expect(carSpeakers.map(({ id, position, kind }) => [id, position, kind])).toEqual(expectedLayout);
});

it("uses finite coordinates and five-language content", () => {
  for (const speaker of carSpeakers) {
    expect(speaker.position).toHaveLength(3);
    expect(speaker.position.every(Number.isFinite)).toBe(true);

    for (const field of ["title", "purpose"] as const) {
      const text = speaker[field];
      expect(Object.keys(text).sort()).toEqual([...languages].sort());
      for (const language of languages) expect(text[language].trim()).not.toBe("");
      expect(text["zh-Hant"]).toBe(traditional(text.zh));
    }
  }
});

it("mirrors the coordinates of each left and right pair", () => {
  const speaker = (id: string) => carSpeakers.find(item => item.id === id)!;

  for (const [leftId, rightId] of [
    ["front-left-tweeter", "front-right-tweeter"],
    ["front-left-door", "front-right-door"],
    ["rear-left-door", "rear-right-door"]
  ]) {
    const left = speaker(leftId);
    const right = speaker(rightId);
    expect(right.position).toEqual([-left.position[0], left.position[1], left.position[2]]);
  }
});
