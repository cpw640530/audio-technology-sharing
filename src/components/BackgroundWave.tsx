import { useEffect, useRef, useState } from "react";

export function BackgroundWave() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || window.navigator.userAgent.toLowerCase().includes("jsdom")) return;
    let cancelled = false;
    let dispose: (() => void) | undefined;
    // Load WebGL separately so the reading interface can render first.
    void import("./waveSurface").then(({ createWaveSurface }) => {
      if (!cancelled) dispose = createWaveSurface(canvas, available => {
        if (!cancelled) setReady(available);
      });
    }).catch((error: unknown) => {
      if (!cancelled) {
        setReady(false);
        console.warn("Background WebGL unavailable; using CSS fallback.", error);
      }
    });
    return () => {
      cancelled = true;
      dispose?.();
    };
  }, []);

  return <div aria-hidden="true" className="background-wave" data-ready={ready}>
    <div className="background-wave-fallback" />
    <canvas ref={canvasRef} />
  </div>;
}
