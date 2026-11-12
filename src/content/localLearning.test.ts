import { describe, expect, it, vi } from "vitest";
import { clearLocalLearning, labStoragePrefix, learningStorageKey, readLocal, sanitizeReadingMemory, writeLocal } from "./localLearning";

describe("local learning storage", () => {
  it("rejects invalid, removed and duplicate topics and unavailable labs", () => {
    const topics = new Map([["sound-wave", true], ["system-audio", false]]);
    expect(sanitizeReadingMemory({ favorites: ["sound-wave", "sound-wave", "removed", 2], recent: [
      { key: "system-audio", kind: "lab", at: 1 }, { key: "sound-wave", kind: "topic", at: 2 },
      { key: "sound-wave", kind: "lab", at: 1 }, { key: "system-audio", kind: "topic", at: "bad" }
    ] }, topics)).toEqual({ favorites: ["sound-wave"], recent: [{ key: "sound-wave", kind: "topic", at: 2 }] });
    expect(sanitizeReadingMemory(null, topics)).toEqual({ favorites: [], recent: [] });
  });
  it("handles corrupted JSON and unavailable/quota-exceeded storage", () => {
    localStorage.setItem(learningStorageKey, "{broken");
    expect(readLocal(learningStorageKey, vi.fn())).toBeUndefined();
    const error = vi.fn();
    const get = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new Error("blocked"); });
    expect(readLocal(learningStorageKey, error)).toBeUndefined();
    get.mockRestore();
    const set = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("quota"); });
    writeLocal(learningStorageKey, {}, error);
    expect(error).toHaveBeenCalledTimes(2);
    set.mockRestore();
  });
  it("clears only its own data and supports one-lab reset", () => {
    localStorage.setItem("audio-technology-language", "ja");
    localStorage.setItem("unrelated", "keep");
    localStorage.setItem(learningStorageKey, "{}");
    localStorage.setItem(`${labStoragePrefix}sound-wave:frequency`, "440");
    localStorage.setItem(`${labStoragePrefix}microphone:angle`, "30");
    clearLocalLearning(vi.fn(), "sound-wave");
    expect(localStorage.getItem(`${labStoragePrefix}sound-wave:frequency`)).toBeNull();
    expect(localStorage.getItem(`${labStoragePrefix}microphone:angle`)).toBe("30");
    clearLocalLearning(vi.fn());
    expect(localStorage.getItem(learningStorageKey)).toBeNull();
    expect(localStorage.getItem(`${labStoragePrefix}microphone:angle`)).toBeNull();
    expect(localStorage.getItem("audio-technology-language")).toBe("ja");
    expect(localStorage.getItem("unrelated")).toBe("keep");
  });
});
