import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ReadingActions, ReadingMemoryProvider, ReadingShelf } from "./ReadingMemory";
import { KnowledgeNavigationContext } from "./KnowledgeNavigation";
import { topicRoutes } from "../content/topicRoutes";
import type { Language } from "../content/knowledge";
import type { TopicKey } from "../content/relatedTopics";
import { labStoragePrefix, learningStorageKey } from "../content/localLearning";

function Fixture({ topic = "sound-wave", language = "en" }: { topic?: TopicKey; language?: Language }) {
  return <ReadingMemoryProvider><KnowledgeNavigationContext.Provider value={{ current: topic, onOpen: vi.fn() }}><ReadingActions language={language} /><ReadingShelf language={language} /></KnowledgeNavigationContext.Provider></ReadingMemoryProvider>;
}

describe("return-visit controls", () => {
  it("records, deduplicates and caps recent visits while preserving bookmarks on remount", () => {
    const view = render(<Fixture />);
    fireEvent.click(screen.getByRole("button", { name: "Bookmark topic" }));
    expect(screen.getByRole("button", { name: "Remove bookmark" })).toHaveAttribute("aria-pressed", "true");
    for (const entry of topicRoutes.slice(0, 12)) view.rerender(<Fixture topic={entry.key} />);
    view.rerender(<Fixture topic="sound-wave" />);
    const data = JSON.parse(localStorage.getItem(learningStorageKey)!);
    expect(data.recent).toHaveLength(8);
    expect(data.recent[0].key).toBe("sound-wave");
    expect(data.favorites).toEqual(["sound-wave"]);
    view.unmount();
    render(<Fixture />);
    fireEvent.click(screen.getByRole("button", { name: "Bookmarks" }));
    const list = screen.getByRole("list", { name: "Bookmarks" });
    expect(within(list).getByRole("link", { name: "What Sound Is" })).toHaveAttribute("href", "#/topics/sound-wave");
    fireEvent.click(within(list).getByRole("button", { name: /Remove bookmark/ }));
    expect(screen.getByText("No bookmarks yet")).toBeInTheDocument();
  });
  it("requires clear confirmation and preserves language and unrelated storage", () => {
    localStorage.setItem("audio-technology-language", "ko");
    localStorage.setItem(`${labStoragePrefix}sound-wave:frequency`, "800");
    render(<Fixture />);
    fireEvent.click(screen.getByRole("button", { name: "Clear local learning data" }));
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(localStorage.getItem(learningStorageKey)).not.toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Clear local learning data" }));
    fireEvent.click(screen.getByRole("button", { name: "Confirm clear" }));
    expect(localStorage.getItem(learningStorageKey)).toBeNull();
    expect(localStorage.getItem(`${labStoragePrefix}sound-wave:frequency`)).toBeNull();
    expect(localStorage.getItem("audio-technology-language")).toBe("ko");
    expect(screen.getByText("No recent visits")).toBeInTheDocument();
  });
  it("keeps controls functional when writing is blocked and syncs external changes", () => {
    const set = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("quota"); });
    render(<Fixture />);
    fireEvent.click(screen.getByRole("button", { name: "Bookmark topic" }));
    fireEvent.click(screen.getByRole("button", { name: "Remove bookmark" }));
    expect(screen.getByRole("button", { name: "Bookmark topic" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getAllByRole("status")[0]).toHaveTextContent("Local saving is unavailable");
    set.mockRestore();
    localStorage.setItem(learningStorageKey, JSON.stringify({ recent: [], favorites: ["sound-wave"] }));
    fireEvent(window, new StorageEvent("storage", { key: learningStorageKey }));
    expect(screen.getByRole("button", { name: "Remove bookmark" })).toBeInTheDocument();
  });
  it.each(["zh", "zh-Hant", "en", "ja", "ko"] as const)("shows translated actions and collections in %s", language => {
    render(<Fixture language={language} />);
    expect(screen.getByRole("region")).toHaveAccessibleName();
    for (const button of screen.getAllByRole("button")) expect(button).toHaveAccessibleName();
    expect(screen.queryByText("undefined")).not.toBeInTheDocument();
  });
});
