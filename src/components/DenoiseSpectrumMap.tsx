import { useEffect, useRef } from "react";

export function DenoiseSpectrumMap({ values, label, max = 1, selection, selectionSize = 3, scale, activeCell = -1 }: {
  values: number[][]; label: string; max?: number; selection?: number[]; selectionSize?: number; scale: string[]; activeCell?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (/jsdom/i.test(navigator.userAgent)) return;
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    values.forEach((row,f) => row.forEach((v,t) => {
      const a = Math.max(0,Math.min(1,v/max));
      ctx.fillStyle = `rgb(${15+230*a},${35+155*a},${65-30*a})`;
      ctx.fillRect(t*4,(63-f)*4,4,4);
    }));
  },[values,max]);
  const radius = (selectionSize - 1) / 2;
  return <>
    <strong className="denoise-map-title">{label}</strong>
    <div style={{position:"relative"}}>
      <div className="denoise-map-axis"><span>1968.75 Hz</span><span>0 Hz</span></div>
      <canvas ref={ref} width="256" height="256" role="img" aria-label={label}/>
      {selection && <>
        <span className="denoise-time-cursor" aria-hidden="true" style={{left:`${selection[0]/64*100}%`}}/>
        <span className="denoise-selection" aria-hidden="true" style={{outline:"2px solid white",boxShadow:"0 0 0 3px #16372e",left:`${(selection[0]-radius)/64*100}%`,top:`${(63-selection[1]-radius)/64*100}%`,width:`${selectionSize/64*100}%`,height:`${selectionSize/64*100}%`}}/>
        {selectionSize===3 && activeCell>=0 && <span className="denoise-active-cell" aria-hidden="true" data-bin={selection[1]+Math.floor(activeCell/3)-1} data-frame={selection[0]+activeCell%3-1} style={{left:`${(selection[0]+activeCell%3-1)/64*100}%`,top:`${(64-selection[1]-Math.floor(activeCell/3))/64*100}%`}}/>}
      </>}
    </div>
    <div className="denoise-map-times"><span>0 s</span><span>1.008 s</span></div>
    <div className="denoise-colorbar" aria-hidden="true"/>
    <div className="denoise-map-times">{scale.map(value=><span key={value}>{value}</span>)}</div>
  </>;
}
