import { render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { RouteBoundary } from "./RouteBoundary";

it("offers recovery rather than a blank page when a chunk fails", () => {
  const error = vi.spyOn(console, "error").mockImplementation(() => {});
  function Broken(): never { throw new Error("Chunk unavailable"); }
  try {
    render(<RouteBoundary language="en"><Broken /></RouteBoundary>);
    expect(screen.getByRole("alert")).toHaveTextContent("Check your connection");
    expect(screen.getByRole("button", { name: "Reload" })).toBeVisible();
    expect(screen.getByRole("link")).toHaveAttribute("href", `${import.meta.env.BASE_URL}#top`);
  } finally { error.mockRestore(); }
});
