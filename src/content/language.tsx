import { traditional } from "./traditional";
import { createContext, useContext } from "react";
import type { Language } from "./knowledge";

export const languageNames = { en: "English", zh: "简体中文", "zh-Hant": "繁體中文", ja: "日本語", ko: "한국어" };
export const LanguageContext = createContext<((language: Language) => void) | null>(null);
export function LanguageSelect({ language }: { language: Language }) {
  const change = useContext(LanguageContext);
  return <select className="language-toggle" aria-label="Language / 语言 / 言語 / 언어" value={language} onChange={event => change?.(event.target.value as Language)}>
    {Object.entries(languageNames).map(([value, name]) => <option key={value} value={value}>{name}</option>)}
  </select>;
}

export function text(language: Language, zh: string, en: string, ja: string, ko: string) {
  return ({ zh, "zh-Hant": traditional(zh), en, ja, ko })[language];
}
