import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import demo from "../../public/ai-denoise/demo.json";
import { DenoisePipelineAnimation } from "./DenoisePipelineAnimation";

afterEach(()=>vi.restoreAllMocks());
const props={data:demo,frame:20,bin:8,channel:0,language:"en" as const,onFrameChange:vi.fn(),onBinChange:vi.fn(),onChannelChange:vi.fn()};

it("links each highlighted spectral cell to the exact product and partial sum",()=>{
  const {container}=render(<DenoisePipelineAnimation {...props}/>);
  const order=[6,7,8,3,4,5,0,1,2];
  for(let term=0;term<9;term++){
    fireEvent.change(screen.getByRole("slider",{name:"Lesson animation progress"}),{target:{value:String(2400+200+term*180+10)}});
    const i=order[term];
    const active=container.querySelector('.denoise-pipeline-patch [data-active="true"]')!;
    const marker=container.querySelector('.denoise-active-cell')!;
    expect(active.getAttribute("data-bin")).toBe(String(8+Math.floor(i/3)-1));
    expect(active.getAttribute("data-frame")).toBe(String(20+i%3-1));
    expect(marker.getAttribute("data-bin")).toBe(active.getAttribute("data-bin"));
    expect(marker.getAttribute("data-frame")).toBe(active.getAttribute("data-frame"));
    const sum=order.slice(0,term+1).reduce((s,k)=>s+demo.input[8+Math.floor(k/3)-1][20+k%3-1]*demo.kernels[0].flat()[k],demo.bias[0]);
    expect(screen.getByTestId("denoise-running-sum")).toHaveTextContent(sum.toFixed(5));
  }
});

it("defaults to a complete static diagram and supports guided navigation and shared selections",()=>{
  render(<DenoisePipelineAnimation {...props}/>);
  expect(screen.getByRole("button",{name:"Previous step"})).toBeDisabled();
  expect(screen.getByRole("button",{name:"Play pipeline"})).toBeInTheDocument();
  expect(screen.getByRole("img",{name:"PCM · x[n]"}).querySelector('path.denoise-frame-signal')).not.toHaveStyle({clipPath:"inset(0 100% 0 0)"});
  fireEvent.change(screen.getByRole("slider",{name:/Inspect frame/}),{target:{value:"30"}});
  expect(props.onFrameChange).toHaveBeenCalledWith(30);
  fireEvent.change(screen.getByRole("slider",{name:/Inspect frequency/}),{target:{value:"12"}});
  expect(props.onBinChange).toHaveBeenCalledWith(12);
  fireEvent.change(screen.getByRole("combobox",{name:"Model feature channel"}),{target:{value:"2"}});
  expect(props.onChannelChange).toHaveBeenCalledWith(2);
  for(let i=1;i<5;i++)fireEvent.click(screen.getByRole("button",{name:"Next step"}));
  expect(screen.getByRole("button",{name:"Next step"})).toBeDisabled();
  expect(screen.getByRole("img",{name:"Clean reference spectrum"})).toBeInTheDocument();
  expect(screen.getByRole("img",{name:"Clean reference · PCM"})).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button",{name:"Previous step"}));
  expect(screen.getByRole("button",{name:"Jump to Mask & gain"})).toHaveAttribute("aria-current","step");
});

it("exports the clean reference on the same scale as PCM and spectral comparisons",()=>{
  for(const frame of [1,20,62])for(const bin of [1,8,62]){
    let real=0,imag=0;
    for(let n=0;n<256;n++){
      const sample=demo.trace.target[frame*128-128+n]/demo.trace.scale*(.5-.5*Math.cos(2*Math.PI*n/256))/128;
      real+=sample*Math.cos(2*Math.PI*bin*n/256);
      imag-=sample*Math.sin(2*Math.PI*bin*n/256);
    }
    const feature=Math.max(0,Math.min(1,(20*Math.log10(Math.hypot(real,imag)+1e-8)+80)/80));
    expect(demo.target[bin][frame]).toBeCloseTo(feature,4);
  }
  expect(demo.trace.target).toHaveLength(demo.trace.input.length);
});

it("seeks all five real-data stages and preserves the stage on input selection changes",()=>{
  const view=render(<DenoisePipelineAnimation {...props}/>);
  expect(screen.getByRole("button",{name:"Jump to Frame & spectrum"})).toHaveAttribute("aria-current","step");
  expect(screen.getByRole("img",{name:"PCM · x[n]"})).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button",{name:"Jump to Convolution"}));
  expect(screen.queryByRole("img",{name:"PCM · x[n]"})).not.toBeInTheDocument();
  const cells=view.container.querySelectorAll(".denoise-pipeline-patch code");
  expect(cells).toHaveLength(9);
  expect(cells[0]).toHaveTextContent("281.25 Hz · 304 ms");
  fireEvent.click(screen.getByRole("button",{name:"Jump to Activation"}));
  const rows=view.container.querySelectorAll(".denoise-phase-2 .denoise-response-table >div");
  for(let c=0;c<4;c++)expect(rows[c+1]).toHaveTextContent(demo.activations[c][8][20].toFixed(5));
  fireEvent.click(screen.getByRole("button",{name:"Jump to Mask & gain"}));
  expect(screen.getByRole("meter",{name:"Magnitude retained"})).toHaveAttribute("aria-valuenow",String(demo.mask[8][20]));
  fireEvent.change(screen.getByRole("slider",{name:"Lesson animation progress"}),{target:{value:"12000"}});
  expect(screen.getByRole("img",{name:"Reconstructed output · PCM"})).toBeInTheDocument();
  expect(screen.getByText("12.0 / 12 s")).toBeInTheDocument();
  view.rerender(<DenoisePipelineAnimation {...props} frame={21}/>);
  expect(screen.getByRole("slider",{name:"Lesson animation progress"})).toHaveValue("11600");
  expect(screen.getByRole("button",{name:"Jump to Reconstruction"})).toHaveAttribute("aria-current","step");
});

it("supports play, pause, replay, visibility pause and scope cleanup",()=>{
  const view=render(<DenoisePipelineAnimation {...props}/>);
  fireEvent.click(screen.getByRole("button",{name:"Play pipeline"}));
  expect(screen.getByRole("button",{name:"Pause pipeline"})).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button",{name:"Pause pipeline"}));
  fireEvent.change(screen.getByRole("slider",{name:"Lesson animation progress"}),{target:{value:"12000"}});
  fireEvent.click(screen.getByRole("button",{name:"Play pipeline"}));
  expect(screen.getByRole("slider",{name:"Lesson animation progress"})).toHaveValue("0");
  vi.spyOn(document,"hidden","get").mockReturnValue(true);
  fireEvent(document,new Event("visibilitychange"));
  expect(screen.getByRole("button",{name:"Play pipeline"})).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button",{name:"Reset pipeline"}));
  expect(screen.getByRole("slider",{name:"Lesson animation progress"})).toHaveValue("0");
  const path=view.container.querySelector<SVGElement>(".denoise-phase-0 .phase-reveal")!;
  view.unmount();
  expect(path.style.clipPath).toBe("");
});

it.each(["zh","zh-Hant","en","ja","ko"] as const)("renders all stages with reduced motion in %s",language=>{
  const media=window.matchMedia;
  vi.spyOn(window,"matchMedia").mockImplementation(query=>({...media(query),matches:true}));
  const {container}=render(<DenoisePipelineAnimation {...props} language={language}/>);
  const stages=container.querySelectorAll<HTMLButtonElement>(".denoise-pipeline-stages button");
  expect(stages).toHaveLength(5);
  stages.forEach(button=>{
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-current","step");
    expect(container.querySelectorAll(".denoise-animation-scene:not([hidden])")).toHaveLength(1);
  });
  expect(container.querySelector<SVGElement>(".phase-reveal")!.style.clipPath).toBe("");
  expect(container.textContent).not.toMatch(/undefined|NaN/);
});
