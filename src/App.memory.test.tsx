import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";
import App from "./App";
import { labStoragePrefix, learningStorageKey } from "./content/localLearning";

vi.mock("./components/BackgroundWave", () => ({ BackgroundWave: () => null }));
vi.mock("./components/TopicGrid", () => import("./test/TopicBrowserStub"));
beforeEach(() => {
  localStorage.setItem("audio-technology-language", "en");
  window.history.replaceState(null, "", "#/labs/sound-wave");
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
});

it("restores real lab controls on revisiting, never resumes playback and resets persisted settings", async () => {
  const audioContext = vi.fn();
  vi.stubGlobal("AudioContext", audioContext);
  const view = render(<App />);
  const frequency = await screen.findByRole("slider", { name: "Frequency" });
  fireEvent.change(frequency, { target: { value: "880" } });
  fireEvent.click(screen.getByRole("button", { name: "Bookmark topic" }));
  view.unmount();
  expect(JSON.parse(localStorage.getItem(learningStorageKey)!).favorites).toContain("sound-wave");
  render(<App />);
  expect(await screen.findByRole("slider", { name: "Frequency" })).toHaveValue("880");
  expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
  expect(audioContext).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Reset lab parameters" }));
  await waitFor(() => expect(screen.getByRole("slider", { name: "Frequency" })).toHaveValue("440"));
  expect(Object.keys(localStorage).filter(key => key.startsWith(`${labStoragePrefix}sound-wave:`))).toEqual([]);
  vi.unstubAllGlobals();
});

it("still renders and permits language changes when browser storage is unavailable", async () => {
  const get = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new Error("blocked"); });
  const set = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("blocked"); });
  const view = render(<App />);
  expect(await screen.findByRole("slider", { name: "Frequency" })).toBeInTheDocument();
  expect(screen.getByText(/Local saving is unavailable/)).toBeInTheDocument();
  fireEvent.change(screen.getByRole("combobox", { name: /Language/ }), { target: { value: "zh" } });
  expect(await screen.findByRole("slider", { name: "频率" })).toBeInTheDocument();
  view.unmount();
  get.mockRestore(); set.mockRestore();
});
