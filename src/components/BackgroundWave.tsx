import { useEffect, useRef } from "react";

export function BackgroundWave() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || window.navigator.userAgent.toLowerCase().includes("jsdom")) return;
    let cancelled = false;
    let dispose: (() => void) | undefined;
    // Load WebGL separately so the reading interface can render first.
    void import("./waveSurface").then(({ createWaveSurface }) => {
      if (!cancelled) dispose = createWaveSurface(canvas);
    }).catch(() => {
      // The CSS page background remains available without WebGL.
    });
    return () => {
      cancelled = true;
      dispose?.();
    };
  }, []);

  return <canvas aria-hidden="true" className="background-wave" ref={canvasRef} />;
}
