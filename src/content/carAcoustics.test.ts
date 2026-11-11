import { expect, it } from "vitest";
import { carAcousticPoints, carAcousticScenes, type CarAcousticMode } from "./carAcoustics";
import { traditional } from "./traditional";

const languages = ["zh", "zh-Hant", "en", "ja", "ko"] as const;
const modes = ["layout", "voice", "localization", "spatial", "anc"] as const satisfies readonly CarAcousticMode[];

it("keeps the six fixed acoustic points and unique IDs", () => {
  expect(carAcousticPoints).toHaveLength(6);
  expect(new Set(carAcousticPoints.map(({ id }) => id)).size).toBe(6);
  expect(carAcousticPoints.map(({ id, position }) => [id, position])).toEqual([
    ["talker", [-0.62, 1.95, -0.48]],
    ["mic-left", [-0.25, 2.1, -0.9]],
    ["mic-right", [0.25, 2.1, -0.9]],
    ["error", [0.62, 1.95, -0.48]],
    ["reference", [1.45, 0.65, 1.85]],
    ["processor", [1.9, 1.15, 0.35]]
  ]);
});

it("uses finite coordinates and complete five-language content", () => {
  for (const point of carAcousticPoints) {
    expect(point.position).toHaveLength(3);
    expect(point.position.every(Number.isFinite)).toBe(true);

    for (const field of ["title", "purpose"] as const) {
      const text = point[field];
      expect(Object.keys(text).sort()).toEqual([...languages].sort());
      for (const language of languages) expect(text[language].trim()).not.toBe("");
      expect(text["zh-Hant"]).toBe(traditional(text.zh));
    }
  }

  for (const scene of Object.values(carAcousticScenes)) {
    const text = scene.caption;
    expect(Object.keys(text).sort()).toEqual([...languages].sort());
    for (const language of languages) expect(text[language].trim()).not.toBe("");
    expect(text["zh-Hant"]).toBe(traditional(text.zh));
  }
});

it("keeps scene path endpoints inside their scene points", () => {
  for (const mode of modes) {
    const scene = carAcousticScenes[mode];
    const points = new Set(scene.points);
    for (const path of scene.paths) {
      expect(points.has(path.from)).toBe(true);
      expect(points.has(path.to)).toBe(true);
    }
  }

  expect(carAcousticScenes.layout.points).toHaveLength(14);
  expect(carAcousticScenes.layout.paths).toEqual([]);
});

it("keeps ANC feedback directed toward the processor and separates voice from localization", () => {
  expect(carAcousticScenes.anc.paths).toContainEqual({ from: "error", to: "processor", kind: "feedback" });
  expect(carAcousticScenes.voice.paths).not.toEqual(carAcousticScenes.localization.paths);
  expect(carAcousticScenes.voice.paths).toContainEqual({ from: "processor", to: "center", kind: "signal" });
  expect(carAcousticScenes.localization.paths).not.toContainEqual({ from: "processor", to: "center", kind: "signal" });
});
