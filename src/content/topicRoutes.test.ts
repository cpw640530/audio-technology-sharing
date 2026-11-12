import { describe, expect, it } from "vitest";
import { categories } from "./knowledge";
import { isPlainNavigation, parseSiteRoute, topicHref, topicRoutes } from "./topicRoutes";

describe("topic URLs", () => {
  it("assigns a unique stable article URL to every topic", () => {
    expect(topicRoutes).toHaveLength(categories.flatMap(category => category.topics).length);
    expect(new Set(topicRoutes.map(entry => entry.key)).size).toBe(topicRoutes.length);
    for (const entry of topicRoutes) {
      expect(parseSiteRoute(topicHref(entry.topic))).toEqual({ kind: "topic", entry });
      expect(parseSiteRoute(topicHref(entry.key) + "/")).toEqual({ kind: "topic", entry });
      expect(parseSiteRoute(`#topic-${entry.topic.category.id}-${encodeURIComponent(entry.topic.title.en)}`)).toEqual({ kind: "topic", entry });
    }
  });

  it("only exposes labs that still exist on their topic", () => {
    for (const entry of topicRoutes) {
      expect(Boolean(entry.labView)).toBe(Boolean(entry.topic.detail.lab));
      expect(parseSiteRoute(topicHref(entry.key, "lab"))).toEqual(entry.labView
        ? { kind: "lab", entry } : { kind: "missing" });
    }
  });

  it.each(["", "#welcome"])("preserves the welcome entry %s", hash => {
    expect(parseSiteRoute(hash)).toEqual({ kind: "welcome" });
  });
  it.each(["#top", "#knowledge-content"])("preserves the library entry %s", hash => {
    expect(parseSiteRoute(hash)).toEqual({ kind: "home" });
  });
  it("preserves technical notes", () => {
    expect(parseSiteRoute("#technical-notes")).toEqual({ kind: "notes" });
  });
  it.each(["#/topics/unknown", "#/topics/%E0%A4", "#/labs/ai-overview", "#/labs/audio-codec", "#/topics/constructor", "#/topics/../microphone", "#bad"])("handles invalid or removed routes: %s", hash => {
    expect(parseSiteRoute(hash)).toEqual({ kind: "missing" });
  });
  it("leaves modified and cancelled clicks to the browser", () => {
    const click = { button: 0, metaKey: false, ctrlKey: false, shiftKey: false, altKey: false, defaultPrevented: false };
    expect(isPlainNavigation(click)).toBe(true);
    for (const key of ["metaKey", "ctrlKey", "shiftKey", "altKey", "defaultPrevented"])
      expect(isPlainNavigation({ ...click, [key]: true })).toBe(false);
    expect(isPlainNavigation({ ...click, button: 1 })).toBe(false);
  });
});
