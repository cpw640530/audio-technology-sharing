import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BluetoothAudioLab } from "./BluetoothAudioLab";

afterEach(cleanup);

it("keeps the fixed teaching delay separate from codec switching", () => {
  render(<BluetoothAudioLab language="en" onBack={vi.fn()} />);

  expect(screen.getByTestId("bluetooth-latency")).toHaveTextContent("80 ms");
  expect(screen.getByText(/Switching codecs changes only this page's example bitrate/)).toBeInTheDocument();
  expect(screen.getByText("LE Audio / LE ISO")).toBeInTheDocument();
  expect(screen.getByText(/HFP for duplex calls/)).toBeInTheDocument();

  fireEvent.change(screen.getByRole("combobox", { name: "Bluetooth codec" }), { target: { value: "LDAC" } });

  expect(screen.getByTestId("bluetooth-payload")).toHaveTextContent("825.0 B");
  expect(screen.getByText("A2DP / BR/EDR")).toBeInTheDocument();
  expect(screen.getByTestId("bluetooth-latency")).toHaveTextContent("80 ms");
});

describe("the non-measured delay label", () => {
  it.each([
    ["zh", "固定教学延迟预算（非设备实测）"],
    ["zh-Hant", "固定教學延遲預算（非設備實測）"],
    ["en", "Fixed teaching latency budget (not a device measurement)"],
    ["ja", "固定の教材用遅延予算（デバイスの実測値ではありません）"],
    ["ko", "고정된 교육용 지연 예산(기기 실측값 아님)"]
  ] as const)("renders in %s", (language, label) => {
    render(<BluetoothAudioLab language={language} onBack={vi.fn()} />);

    expect(screen.getByText(label, { exact: false })).toBeInTheDocument();
    expect(screen.getByTestId("bluetooth-latency")).toHaveTextContent("80 ms");
    expect(document.body.textContent).not.toContain("undefined");
  });
});

it("keeps the packet trace counts bounded at the slider extremes", () => {
  render(<BluetoothAudioLab language="en" onBack={vi.fn()} />);

  fireEvent.change(screen.getByRole("slider", { name: "Permanent loss" }), { target: { value: "20" } });
  fireEvent.change(screen.getByRole("slider", { name: "Maximum extra arrival delay" }), { target: { value: "120" } });
  fireEvent.change(screen.getByRole("slider", { name: "RX buffer wait" }), { target: { value: "10" } });

  expect(screen.getByTestId("bluetooth-packet-summary")).toHaveTextContent("Green: on time 8; yellow !: late 72; red ×: permanently lost 20");
  expect(screen.getByRole("img", { name: "On time 8, late 72, lost 20" })).toBeInTheDocument();
});
