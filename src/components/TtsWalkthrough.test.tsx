import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { expandTtsDurations, ttsUnits } from "./ttsDurationModel";
import { TtsWalkthrough } from "./TtsWalkthrough";

it("expands vectors with exact integer durations and independent silence",()=>{
  const normal=expandTtsDurations(1,15);
  expect(normal.durations).toEqual([6,8,8,20,15,18,22]);
  expect(normal.frames).toHaveLength(97);
  for(const speed of [.7,1,1.5])for(const pause of [0,15,30]){
    const {frames,durations}=expandTtsDurations(speed,pause);
    expect(durations[4]).toBe(pause);
    expect(frames.length).toBe(durations.reduce((a,b)=>a+b,0));
    ttsUnits.forEach((_,i)=>expect(frames.filter(v=>v===i)).toHaveLength(durations[i]));
    expect(frames.every(v=>v>=0&&v<ttsUnits.length)).toBe(true);
  }
  expect(expandTtsDurations(1.5,15).frames.length).toBeLessThan(97);
  expect(expandTtsDurations(.7,15).frames.length).toBeGreaterThan(97);
});

it("connects pronunciation, duration, frame selection and illustrative sample budget",()=>{
  const {container}=render(<TtsWalkthrough language="en"/>);
  expect(screen.getByRole("button",{name:"Previous step"})).toBeDisabled();
  expect(screen.getByText("Hello, A I!")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button",{name:"Next step"}));
  expect(screen.getByTestId("tts-duration-total")).toHaveTextContent("97");
  fireEvent.change(screen.getByRole("slider",{name:/Speaking-rate multiplier/}),{target:{value:"1.5"}});
  fireEvent.change(screen.getByRole("slider",{name:/Pause frames/}),{target:{value:"0"}});
  const result=expandTtsDurations(1.5,0);
  expect(screen.getByTestId("tts-duration-total")).toHaveTextContent(String(result.frames.length));
  expect(container.querySelectorAll('.tts-unit-buttons button')[4]).toBeDisabled();
  fireEvent.change(screen.getByRole("slider",{name:/Inspect acoustic frame/}),{target:{value:String(result.frames.length-1)}});
  expect(screen.getByTestId("tts-selected-unit")).toHaveTextContent("aɪ · h7");
  expect(container.querySelectorAll('.tts-expanded-frames [data-selected="true"]')).toHaveLength(1);
  fireEvent.click(screen.getByRole("button",{name:"4. Representation to PCM"}));
  expect(screen.getByTestId("tts-sample-budget")).toHaveTextContent(String(result.frames.length*240));
  expect(screen.getByRole("button",{name:"Next step"})).toBeDisabled();
  fireEvent.click(screen.getByRole("button",{name:"Reset TTS walkthrough"}));
  expect(screen.getByRole("button",{name:"1. Text & pronunciation"})).toHaveAttribute("aria-current","step");
});

it("distinguishes duration, generative flow and hybrid speech-token routes",()=>{
  const {container}=render(<TtsWalkthrough language="en"/>);
  fireEvent.click(screen.getByRole("button",{name:"3. Model generation"}));
  expect(container.querySelector('.tts-route-equation')).toHaveTextContent("LengthRegulator");
  fireEvent.click(screen.getByRole("button",{name:"F5-TTS"}));
  expect(container.querySelector('.tts-route-equation')).toHaveTextContent("dxτ / dτ");
  expect(screen.getByText(/not removing environmental noise/)).toBeInTheDocument();
  expect(screen.getByRole("link")).toHaveAttribute("href","https://github.com/SWivid/F5-TTS");
  fireEvent.click(screen.getByRole("button",{name:"CosyVoice 2"}));
  expect(container.querySelector('.tts-route-chain')).toHaveTextContent("Flow matching → Mel");
  expect(container.querySelector('.tts-route-equation')).toHaveTextContent("HiFT");
  fireEvent.click(screen.getByRole("button",{name:"Next step"}));
  expect(screen.queryByTestId("tts-sample-budget")).not.toBeInTheDocument();
  expect(screen.getByText(/not every model configuration/)).toBeInTheDocument();
  expect(container.querySelectorAll('audio,canvas')).toHaveLength(0);
});

it.each(["zh","zh-Hant","en","ja","ko"] as const)("shows all steps in %s with reduced motion",language=>{
  const media=window.matchMedia;
  const mock=vi.spyOn(window,"matchMedia").mockImplementation(query=>({...media(query),matches:true}));
  const {container,unmount}=render(<TtsWalkthrough language={language}/>);
  container.querySelectorAll<HTMLButtonElement>('.tts-stage-nav button').forEach(button=>{
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-current","step");
    expect(container.textContent).not.toMatch(/undefined|NaN/);
    expect(container.querySelector<HTMLElement>('.tts-stage-content')!.style.opacity).toBe("");
  });
  unmount();mock.mockRestore();
});
