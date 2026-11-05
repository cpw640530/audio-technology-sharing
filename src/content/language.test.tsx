import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { categories, interfaceCopy } from "./knowledge";
import { relatedTopics } from "./relatedTopics";
import { LanguageContext, LanguageSelect, text } from "./language";

afterEach(cleanup);

it("exposes five explicit language choices", () => {
  const change = vi.fn();
  render(<LanguageContext.Provider value={change}><LanguageSelect language="en" /></LanguageContext.Provider>);
  expect(screen.getAllByRole("option").map(option => option.getAttribute("value"))).toEqual(["en", "zh", "zh-Hant", "ja", "ko"]);
  fireEvent.change(screen.getByRole("combobox"), { target: { value: "zh-Hant" } });
  expect(change).toHaveBeenCalledWith("zh-Hant");
  expect(text("zh-Hant", "音频知识", "Audio", "", "")).toBe("音頻知識");
  fireEvent.change(screen.getByRole("combobox"), { target: { value: "ja" } });
  expect(change).toHaveBeenCalledWith("ja");
  fireEvent.change(screen.getByRole("combobox"), { target: { value: "ko" } });
  expect(change).toHaveBeenCalledWith("ko");
  expect(text("ja", "中", "English", "日本語", "한국어")).toBe("日本語");
});

it("provides nonempty Japanese and Korean for every shared localized text", () => {
  let checked = 0;
  function visit(value: unknown, path: string) {
    if (!value || typeof value !== "object") return;
    const object = value as Record<string, unknown>;
    if (typeof object.zh === "string" && typeof object.en === "string") {
      for (const language of ["ja", "ko", "zh-Hant"]) {
        expect(typeof object[language], `${path}.${language}`).toBe("string");
        expect((object[language] as string)?.trim(), `${path}.${language}`).not.toBe("");
      }
      checked++;
    }
    for (const [key, child] of Object.entries(object)) visit(child, `${path}.${key}`);
  }
  visit({ categories, interfaceCopy, relatedTopics }, "content");
  expect(checked).toBeGreaterThan(100);
});
