import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import demo from "../../public/ai-denoise/demo.json";
import { AiDenoiseWalkthrough } from "./AiDenoiseWalkthrough";

afterEach(() => vi.unstubAllGlobals());
const openInspector=async()=>fireEvent.click(await screen.findByText("逐项检查数值与频谱"));

it("explains each stage and inspects the actual inference data in both languages", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => demo }));
  const { rerender, container } = render(<AiDenoiseWalkthrough language="zh" />);
  await openInspector();
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
  const markers = Array.from(container.querySelectorAll<HTMLElement>(".denoise-numeric-inspector .denoise-selection"));
  expect(markers).toHaveLength(2);
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

it("exposes a single fair audio comparison before stepping and pauses competing clips", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => demo }));
  const { container } = render(<AiDenoiseWalkthrough language="zh" />);
  await openInspector();
  await screen.findByText("输入：带噪 PCM");
  const players = Array.from(container.querySelectorAll("audio"));
  expect(players).toHaveLength(3);
  expect(players.map(player => player.getAttribute("aria-labelledby")))
    .toEqual(["input", "output", "target"].map(name => `denoise-audio-${name}`));
  const pauses = players.map(player => vi.spyOn(player, "pause").mockImplementation(() => {}));
  fireEvent.play(players[1]);
  expect(pauses[0]).toHaveBeenCalledOnce();
  expect(pauses[1]).not.toHaveBeenCalled();
  expect(pauses[2]).toHaveBeenCalledOnce();
  fireEvent.click(screen.getByRole("button", { name: "5. 重建与试听" }));
  expect(Array.from(container.querySelectorAll("audio"))).toEqual(players);
  for (const pause of pauses) pause.mockRestore();
});

it("reproduces saved convolution and mask values across the displayed interior", () => {
  let activationError = 0, maskError = 0;
  for (let bin = 1; bin < 63; bin++) for (let frame = 1; frame < 63; frame++) {
    let logit = demo.headBias;
    for (let channel = 0; channel < 4; channel++) {
      let sum = demo.bias[channel];
      for (let f = 0; f < 3; f++) for (let t = 0; t < 3; t++) {
        sum += demo.kernels[channel][f][t] * demo.input[bin + f - 1][frame + t - 1];
      }
      activationError = Math.max(activationError, Math.abs(Math.max(0, sum) - demo.activations[channel][bin][frame]));
      logit += demo.head[channel] * demo.activations[channel][bin][frame];
    }
    maskError = Math.max(maskError, Math.abs(1 / (1 + Math.exp(-logit)) - demo.mask[bin][frame]));
  }
  // Exported features/weights are rounded; compare within their quantization error.
  expect(activationError).toBeLessThan(0.00003);
  expect(maskError).toBeLessThan(0.00002);
});

it("shares a frame cursor across waveform, maps and all model stages without changing audio",async()=>{
  vi.stubGlobal("fetch",vi.fn().mockResolvedValue({ok:true,json:async()=>demo}));
  const {container}=render(<AiDenoiseWalkthrough language="zh"/>);
  await openInspector();
  await screen.findByRole("button",{name:"下一帧"});
  const sources=Array.from(container.querySelectorAll("audio")).map(a=>a.src);
  const original=screen.getByRole("img",{name:"PCM"}).querySelector(".denoise-frame-signal")!.getAttribute("d");
  fireEvent.click(screen.getByRole("button",{name:"下一帧"}));
  expect(screen.getByRole("slider",{name:/时间帧/})).toHaveValue("21");
  expect(screen.getByRole("img",{name:"PCM"}).querySelector(".denoise-frame-signal")!.getAttribute("d")).not.toBe(original);
  for(const [index,name] of ["2. 卷积乘加","3. 激活特征","4. 预测掩码","5. 重建与试听"].entries()){
    fireEvent.click(screen.getByRole("button",{name}));
    expect(screen.getByRole("slider",{name:/时间帧/})).toHaveValue("21");
    const cursors=container.querySelectorAll<HTMLElement>(".denoise-numeric-inspector .denoise-time-cursor");
    expect(cursors).toHaveLength([1,1,2,3][index]);
    for(const cursor of cursors)expect(cursor.style.left).toBe(`${21/64*100}%`);
  }
  expect(Array.from(container.querySelectorAll("audio")).map(a=>a.src)).toEqual(sources);
});

it("shows only stage-relevant maps and matches patch cells to the upward frequency axis",async()=>{
  vi.stubGlobal("fetch",vi.fn().mockResolvedValue({ok:true,json:async()=>demo}));
  const {container}=render(<AiDenoiseWalkthrough language="en"/>);
  fireEvent.click(await screen.findByText("Inspect individual values and spectra"));
  await screen.findByRole("button",{name:"2. Convolution"});
  const labels=()=>Array.from(container.querySelectorAll(".denoise-maps canvas")).map(c=>c.getAttribute("aria-label"));
  expect(labels()).toEqual(["Input spectrum"]);
  for(const [name,expected] of [
    ["2. Convolution",["Input spectrum"]],
    ["3. Activations",["ReLU · 1"]],
    ["4. Predict mask",["ReLU · 1","Mask"]],
    ["5. Reconstruction",["Input spectrum","Mask","Output spectrum"]],
  ] as const){
    fireEvent.click(screen.getByRole("button",{name}));
    expect(labels()).toEqual(expected);
    expect(container.querySelectorAll(".denoise-numeric-inspector .denoise-colorbar")).toHaveLength(expected.length);
    if(name!=="5. Reconstruction")expect(screen.queryByRole("img",{name:"PCM"})).not.toBeInTheDocument();
  }
  fireEvent.click(screen.getByRole("button",{name:"2. Convolution"}));
  const cells=Array.from(container.querySelectorAll(".denoise-numeric-inspector .denoise-products code"));
  expect(cells.map(c=>c.getAttribute("data-bin"))).toEqual([9,9,9,8,8,8,7,7,7].map(String));
  expect(cells.map(c=>c.getAttribute("data-frame"))).toEqual([19,20,21,19,20,21,19,20,21].map(String));
});
