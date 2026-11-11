import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { RealtimeTimeline, simulateRealtime } from "./RealtimeTimeline";

afterEach(cleanup);
describe("Realtime FIFO timeline", () => {
  it("finishes each block before the next arrival with spare capacity", () => {
    const rows = simulateRealtime(12, 4, 2);
    expect(rows.map(row => row.end! - row.arrival)).toEqual(Array(8).fill(16));
    expect(rows[0]).toEqual({ arrival: 32, start: 36, end: 48, occupancy: 1 });
    expect(simulateRealtime(12, 4, 6)).toEqual(rows);
    expect(simulateRealtime(32, 0, 1).every(row => row.end !== null)).toBe(true);
  });
  it("accumulates waiting and drops only when capacity is exhausted", () => {
    const rows = simulateRealtime(40, 0, 2);
    expect(rows[0].end).toBe(72);
    expect(rows[1].start).toBe(72);
    expect(rows[5].end).toBe(272);
    expect(rows[6]).toEqual({ arrival: 224, start: null, end: null, occupancy: 2 });
    const large = simulateRealtime(40, 0, 6);
    expect(large.every(row => row.end !== null)).toBe(true);
    expect(large[7].end! - large[7].arrival).toBe(96);
    for (const row of large) expect(row.occupancy).toBeLessThanOrEqual(6);
  });
  it("includes scheduling delay and rejects invalid parameters", () => {
    expect(simulateRealtime(24, 12, 2)[1].start).toBe(80);
    for (const args of [[NaN, 0, 1], [0, 0, 1], [65, 0, 1], [12, -1, 1], [12, Infinity, 1], [12, 0, 1.5], [12, 0, 7]]) expect(() => simulateRealtime(...args as [number, number, number])).toThrow(RangeError);
  });
  it("updates results and bar lengths when settings change", () => {
    const { container } = render(<RealtimeTimeline language="en" />);
    const before = container.querySelector('rect.work')!.getAttribute('width');
    fireEvent.change(screen.getByLabelText("Processing per block"), { target: { value: "64" } });
    fireEvent.change(screen.getByLabelText("Capacity (blocks, including active)"), { target: { value: "1" } });
    expect(screen.getByRole("status")).toHaveTextContent("Dropped out of 8 blocks: 5");
    expect(container.querySelector('rect.work')!.getAttribute('width')).not.toBe(before);
    expect(container.querySelectorAll('svg text.drop')).toHaveLength(5);
  });
  it.each(["zh", "zh-Hant", "en", "ja", "ko"] as const)("renders controls and valid coordinates in %s", language => {
    const { container } = render(<RealtimeTimeline language={language} />);
    expect(screen.getAllByRole("combobox")).toHaveLength(3);
    expect(screen.getByRole("img")).toBeInTheDocument();
    expect(container.innerHTML).not.toMatch(/NaN|undefined|Infinity/);
  });
});
