import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import demo from "../../public/ai-denoise/demo.json";
import { AiDenoiseWalkthrough } from "./AiDenoiseWalkthrough";

afterEach(() => vi.unstubAllGlobals());

it("explains each stage and inspects the actual inference data in both languages", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => demo }));
  const { rerender, container } = render(<AiDenoiseWalkthrough language="zh" />);
  expect(await screen.findByText("输入：带噪 PCM")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "2. 卷积乘加" }));
  const expected = demo.activations[0][8][20];
  const shown = screen.getByTestId("denoise-sum").textContent!.split("ReLU = ")[1];
  expect(Number(shown)).toBeCloseTo(expected, 3);
  fireEvent.click(screen.getByRole("button", { name: "3. 激活特征" }));
  expect(screen.getByText("输出：激活特征图")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "4. 预测掩码" }));
  fireEvent.change(screen.getByRole("slider", { name: /时间帧/ }), { target: { value: "30" } });
  expect(screen.getByTestId("denoise-mask-value")).toHaveTextContent(demo.mask[8][30].toFixed(4));
  const maskResult = Number(screen.getByTestId("denoise-head-result").textContent!.split("≈ ")[1]);
  expect(maskResult).toBeCloseTo(demo.mask[8][30], 4);
  expect(screen.getByTestId("denoise-amplitude-product")).toHaveTextContent((demo.magnitude[8][30]*demo.mask[8][30]).toExponential(4));
  const markers = Array.from(container.querySelectorAll<HTMLElement>(".denoise-selection"));
  expect(markers).toHaveLength(3);
  for (const marker of markers) {
    expect(marker.style.left).toBe(`${30/64*100}%`);
    expect(marker.style.top).toBe(`${(63-8)/64*100}%`);
    expect(marker.style.width).toBe(`${100/64}%`);
  }
  fireEvent.change(screen.getByRole("slider", { name: /频率 bin/ }), { target: { value: "62" } });
  expect(Number(screen.getByTestId("denoise-head-result").textContent!.split("≈ ")[1])).toBeCloseTo(demo.mask[62][30], 4);
  expect(markers[0].style.top).toBe(`${100/64}%`);
  rerender(<AiDenoiseWalkthrough language="en" />);
  expect(screen.getByText("Output: magnitude mask M")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "5. Reconstruction" }));
  expect(screen.getByText("Output: playable PCM")).toBeInTheDocument();
  expect(Array.from(container.querySelectorAll("audio")).map(a => a.getAttribute("src")))
    .toEqual(["input", "output", "target"].map(name => `${import.meta.env.BASE_URL}ai-denoise/${name}.wav`));
});

it("reports a failed asset request", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
  render(<AiDenoiseWalkthrough language="zh" />);
  expect(await screen.findByRole("alert")).toHaveTextContent("数据加载失败");
});
