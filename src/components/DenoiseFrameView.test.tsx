import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { useState } from "react";
import demo from "../../public/ai-denoise/demo.json";
import { DenoiseFrameView } from "./DenoiseFrameView";

afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); });

function Example({ step=0 }: { step?: number }) {
  const [frame,setFrame] = useState(20);
  return <DenoiseFrameView trace={demo.trace} frame={frame} step={step} onFrameChange={setFrame} language="zh"/>;
}

it("steps, seeks, pauses and cleans up with reduced motion enabled", () => {
  const matchMedia=window.matchMedia;
  vi.spyOn(window,"matchMedia").mockImplementation(query=>({...matchMedia(query),matches:true}));
  vi.useFakeTimers();
  const { rerender, unmount } = render(<Example/>);
  expect(screen.getByTestId("denoise-frame-time")).toHaveTextContent("320 ms");
  const initial = screen.getByTestId("denoise-frame-window").getAttribute("x");
  fireEvent.click(screen.getByRole("button",{name:"下一帧"}));
  expect(screen.getByTestId("denoise-frame-time")).toHaveTextContent("336 ms");
  expect(screen.getByTestId("denoise-frame-window").getAttribute("x")).not.toBe(initial);
  fireEvent.click(screen.getByRole("button",{name:"播放帧演示"}));
  act(()=>vi.advanceTimersByTime(250));
  expect(screen.getByRole("slider")).toHaveValue("22");
  fireEvent.click(screen.getByRole("button",{name:"暂停帧演示"}));
  act(()=>vi.advanceTimersByTime(1000));
  expect(screen.getByRole("slider")).toHaveValue("22");
  fireEvent.change(screen.getByRole("slider"),{target:{value:"61"}});
  fireEvent.click(screen.getByRole("button",{name:"播放帧演示"}));
  act(()=>vi.advanceTimersByTime(250));
  expect(screen.getByRole("slider")).toHaveValue("62");
  expect(screen.getByRole("button",{name:"下一帧"})).toBeDisabled();
  expect(screen.getByRole("button",{name:"播放帧演示"})).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button",{name:"重置帧演示"}));
  expect(screen.getByRole("slider")).toHaveValue("1");
  expect(screen.getByRole("button",{name:"上一帧"})).toBeDisabled();
  fireEvent.click(screen.getByRole("button",{name:"播放帧演示"}));
  rerender(<Example step={4}/>);
  expect(screen.getByRole("button",{name:"播放帧演示"})).toBeInTheDocument();
  expect(screen.getByText("本帧合成贡献")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button",{name:"播放帧演示"}));
  vi.spyOn(document,"hidden","get").mockReturnValue(true);
  fireEvent(document,new Event("visibilitychange"));
  expect(screen.getByRole("button",{name:"播放帧演示"})).toBeInTheDocument();
  unmount();
  expect(vi.getTimerCount()).toBe(0);
});

it.each(["zh","zh-Hant","en","ja","ko"] as const)("renders labelled plots and controls in %s",language=>{
  const {container,rerender}=render(<DenoiseFrameView trace={demo.trace} frame={1} step={0} onFrameChange={()=>{}} language={language}/>);
  expect(screen.getAllByRole("img")).toHaveLength(3);
  expect(screen.getAllByRole("button")).toHaveLength(4);
  expect(screen.getByRole("slider")).toHaveAccessibleName();
  expect(container.textContent).not.toMatch(/undefined|NaN/);
  rerender(<DenoiseFrameView trace={demo.trace} frame={62} step={4} onFrameChange={()=>{}} language={language}/>);
  expect(container.textContent).toContain("Σₘ");
  expect(container.textContent).not.toMatch(/undefined|NaN/);
});

it("reconstructs saved output from the exported overlap-add contributions",()=>{
  const sums=Array<number>(8192).fill(0), weights=Array<number>(8192).fill(0);
  demo.trace.contributions.forEach((contribution,frame)=>contribution.forEach((v,i)=>{
    const n=frame*128-128+i;
    if(n<0||n>=sums.length)return;
    sums[n]+=v;
    weights[n]+=(0.5-0.5*Math.cos(2*Math.PI*i/256))**2;
  }));
  expect(Math.min(...weights)).toBeGreaterThan(0);
  const error=Math.max(...sums.map((v,n)=>Math.abs(v/weights[n]-demo.trace.output[n])));
  expect(error).toBeLessThan(0.000001);
});

it("aligns extracted PCM windows with the saved input STFT magnitudes",()=>{
  for(const frame of [1,20,62]) for(const bin of [0,8,63]) {
    let re=0,im=0;
    for(let i=0;i<256;i++){
      const v=demo.trace.input[frame*128-128+i]*(0.5-0.5*Math.cos(2*Math.PI*i/256));
      re+=v*Math.cos(2*Math.PI*bin*i/256);
      im-=v*Math.sin(2*Math.PI*bin*i/256);
    }
    expect(Math.hypot(re,im)/128/demo.trace.scale).toBeCloseTo(demo.magnitude[bin][frame],6);
  }
});
