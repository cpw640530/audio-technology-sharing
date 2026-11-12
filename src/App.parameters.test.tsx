import { render, screen } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";
import App from "./App";
import { topicHref, topicRoutes } from "./content/topicRoutes";
import { labStoragePrefix } from "./content/localLearning";

vi.mock("./components/BackgroundWave", () => ({ BackgroundWave: () => null }));
vi.mock("./components/TopicGrid", () => import("./test/TopicBrowserStub"));
vi.mock("./hooks/useLabState", async importOriginal => {
  const actual = await importOriginal<typeof import("./hooks/useLabState")>();
  return { ...actual, useLabState: <T,>(name: string, initial: T | (() => T), validate: (value: unknown) => value is T) => {
    const fallback = typeof initial === "function" ? (initial as () => T)() : initial;
    expect(validate(fallback), `Invalid default for ${name}`).toBe(true);
    expect(validate(null), `Null accepted for ${name}`).toBe(false);
    expect(validate({ unexpected: true }), `Malformed object accepted for ${name}`).toBe(false);
    if (typeof fallback === "number") expect(validate(Number.MAX_SAFE_INTEGER), `Unbounded value for ${name}`).toBe(false);
    return actual.useLabState(name, initial, validate);
  } };
});

beforeEach(() => {
  localStorage.setItem("audio-technology-language", "en");
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
});

it.each(topicRoutes.filter(entry => entry.labView))("validates saved parameter shapes and defaults for $key", async entry => {
  window.history.replaceState(null, "", topicHref(entry.key, "lab"));
  render(<App />);
  await screen.findByRole("button", { name: "Reset lab parameters" }, { timeout: 5000 });
  expect(Object.keys(localStorage).filter(key => key.startsWith(`${labStoragePrefix}${entry.key}:`))).toHaveLength(0);
});
