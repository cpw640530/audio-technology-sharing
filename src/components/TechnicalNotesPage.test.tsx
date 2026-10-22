import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import App from "../App";

afterEach(() => {
  cleanup();
  window.history.replaceState(null, "", window.location.pathname);
});

it("opens notes by URL, switches categories and returns to audio knowledge", () => {
  window.localStorage.setItem("audio-technology-language", "en");
  window.history.replaceState(null, "", "#technical-notes");
  render(<App />);
  expect(screen.getByRole("heading", { name: "Technical notes" })).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Home Assistant" }));
  expect(screen.getByRole("heading", { name: "Home Assistant" })).toBeInTheDocument();
  expect(screen.getByText("No published notes yet.")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "中文" }));
  expect(screen.getByRole("heading", { name: "HA 智能家居" })).toBeInTheDocument();
  window.history.replaceState(null, "", "#top");
  fireEvent(window, new HashChangeEvent("hashchange"));
  expect(screen.getByTestId("topic-grid")).toBeInTheDocument();
});
