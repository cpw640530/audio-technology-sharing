import { act, fireEvent, render, screen } from "@testing-library/react";
import { StrictMode, useContext } from "react";
import { afterEach, expect, it, vi } from "vitest";
import { labStoragePrefix } from "../content/localLearning";
import { LabSession, LabSessionContext, useLabState } from "./useLabState";

afterEach(() => vi.useRealTimers());
function Controls() {
  const [frequency, setFrequency] = useLabState("frequency", 440, (v): v is number => typeof v === "number" && Number.isFinite(v) && v >= 20 && v <= 2000);
  const session = useContext(LabSessionContext);
  return <><input aria-label="Frequency" value={frequency} onChange={e => setFrequency(Number(e.target.value))} /><button onClick={session?.reset}>Reset</button></>;
}
const key = `${labStoragePrefix}sound-wave:frequency`;
const lab = (topic = "sound-wave", onError = vi.fn()) => <LabSession topic={topic} onError={onError}><Controls /></LabSession>;

it("debounces edits, flushes on leaving, restores and resets without stale writes", () => {
  vi.useFakeTimers();
  const view = render(lab());
  fireEvent.change(screen.getByLabelText("Frequency"), { target: { value: "600" } });
  expect(localStorage.getItem(key)).toBeNull();
  act(() => { vi.advanceTimersByTime(250); });
  expect(localStorage.getItem(key)).toBe("600");
  fireEvent.change(screen.getByLabelText("Frequency"), { target: { value: "800" } });
  view.unmount();
  expect(localStorage.getItem(key)).toBe("800");
  const next = render(lab());
  expect(screen.getByLabelText("Frequency")).toHaveValue("800");
  fireEvent.change(screen.getByLabelText("Frequency"), { target: { value: "900" } });
  fireEvent.click(screen.getByText("Reset"));
  expect(screen.getByLabelText("Frequency")).toHaveValue("440");
  next.unmount();
  act(() => { vi.runAllTimers(); });
  expect(localStorage.getItem(key)).toBeNull();
});

it("isolates topics and rejects out-of-range saved parameters", () => {
  localStorage.setItem(key, "100000");
  const view = render(lab());
  expect(screen.getByLabelText("Frequency")).toHaveValue("440");
  fireEvent.change(screen.getByLabelText("Frequency"), { target: { value: "700" } });
  fireEvent(window, new Event("pagehide"));
  expect(localStorage.getItem(key)).toBe("700");
  view.unmount();
  render(lab("microphone"));
  expect(screen.getByLabelText("Frequency")).toHaveValue("440");
});

it("does not persist controls outside a lab provider", () => {
  localStorage.setItem(key, "900");
  const view = render(<Controls />);
  expect(screen.getByLabelText("Frequency")).toHaveValue("440");
  fireEvent.change(screen.getByLabelText("Frequency"), { target: { value: "700" } });
  view.unmount();
  expect(localStorage.getItem(key)).toBe("900");
});

it("keeps valid parameters in StrictMode and remains usable if saving fails", () => {
  vi.useFakeTimers();
  const error = vi.fn();
  const view = render(<StrictMode>{lab("sound-wave", error)}</StrictMode>);
  fireEvent.change(screen.getByLabelText("Frequency"), { target: { value: "550" } });
  act(() => { vi.advanceTimersByTime(250); });
  expect(localStorage.getItem(key)).toBe("550");
  const set = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("quota"); });
  fireEvent.change(screen.getByLabelText("Frequency"), { target: { value: "650" } });
  act(() => { vi.advanceTimersByTime(250); });
  expect(screen.getByLabelText("Frequency")).toHaveValue("650");
  expect(error).toHaveBeenCalled();
  view.unmount();
  set.mockRestore();
});
