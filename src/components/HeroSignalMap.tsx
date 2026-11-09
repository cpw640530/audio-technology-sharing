import { useEffect, useRef } from "react";
import { animationLoop } from "./animationLoop";

export function HeroSignalMap() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas || window.navigator.userAgent.toLowerCase().includes("jsdom")) {
      return undefined;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return undefined;
    }

    const activeCanvas = canvas;
    const activeContext = context;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let elapsed = 0;
    let width = 0;
    let height = 0;

    function resize() {
      const scale = Math.min(window.devicePixelRatio || 1, 2);
      const bounds = activeCanvas.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      activeCanvas.width = Math.round(width * scale);
      activeCanvas.height = Math.round(height * scale);
      activeContext.setTransform(scale, 0, 0, scale, 0, 0);
    }

    function draw(delta: number) {
      elapsed += delta;
      const phase = elapsed * 2.2;
      const sectionWidth = width / 3;
      const centerY = height * 0.57;
      const amplitude = Math.min(42, height * 0.25);

      activeContext.clearRect(0, 0, width, height);
      activeContext.font = '700 10px "SFMono-Regular", Consolas, monospace';
      activeContext.textBaseline = "top";

      ["ANALOG", "PCM", "FFT"].forEach((label, index) => {
        const left = index * sectionWidth;
        activeContext.fillStyle = index === 2 ? "#f0a85b" : "#9dd9d0";
        activeContext.fillText(label, left + 10, 8);
        activeContext.strokeStyle = "rgba(157, 217, 208, 0.16)";
        activeContext.lineWidth = 1;
        activeContext.beginPath();
        activeContext.moveTo(left + 10, centerY);
        activeContext.lineTo(left + sectionWidth - 10, centerY);
        activeContext.stroke();
      });

      activeContext.strokeStyle = "#2ee5c2";
      activeContext.lineWidth = 2.4;
      activeContext.beginPath();
      for (let x = 10; x <= sectionWidth - 14; x += 2) {
        const progress = (x - 10) / Math.max(sectionWidth - 24, 1);
        const y = centerY - Math.sin(progress * Math.PI * 4 + phase) * amplitude;
        if (x === 10) activeContext.moveTo(x, y);
        else activeContext.lineTo(x, y);
      }
      activeContext.stroke();

      const sampleCount = 10;
      for (let index = 0; index < sampleCount; index += 1) {
        const progress = index / (sampleCount - 1);
        const x = sectionWidth + 10 + progress * (sectionWidth - 24);
        const y = centerY - Math.sin(progress * Math.PI * 4 + phase) * amplitude;
        activeContext.strokeStyle = "rgba(46, 229, 194, 0.32)";
        activeContext.beginPath();
        activeContext.moveTo(x, centerY);
        activeContext.lineTo(x, y);
        activeContext.stroke();
        activeContext.fillStyle = "#7ee7d8";
        activeContext.beginPath();
        activeContext.arc(x, y, 3, 0, Math.PI * 2);
        activeContext.fill();
      }

      const spectrum = [0.16, 0.28, 0.88, 0.58, 0.22, 0.14, 0.5, 0.26, 0.12, 0.08];
      const fftLeft = sectionWidth * 2 + 12;
      const fftWidth = sectionWidth - 24;
      const gap = 3;
      const barWidth = Math.max(3, (fftWidth - gap * (spectrum.length - 1)) / spectrum.length);
      spectrum.forEach((energy, index) => {
        const pulse = reducedMotion.matches ? 1 : 0.94 + Math.sin(phase * 0.7 + index) * 0.06;
        const barHeight = amplitude * 1.55 * energy * pulse;
        const x = fftLeft + index * (barWidth + gap);
        activeContext.fillStyle = index === 2 || index === 6 ? "#f0a85b" : "rgba(126, 231, 216, 0.72)";
        activeContext.fillRect(x, centerY - barHeight, barWidth, barHeight);
      });

      activeContext.fillStyle = "rgba(220, 236, 232, 0.5)";
      activeContext.font = '600 9px "SFMono-Regular", Consolas, monospace';
      activeContext.fillText("time", 10, height - 17);
      activeContext.fillText("samples", sectionWidth + 10, height - 17);
      activeContext.fillText("frequency", sectionWidth * 2 + 10, height - 17);
    }

    const observer = new ResizeObserver(() => {
      resize();
      draw(0);
    });
    observer.observe(activeCanvas);
    resize();

    const animation = animationLoop(activeCanvas, draw);

    return () => {
      observer.disconnect();
      animation.dispose();
    };
  }, []);

  return <canvas className="hero-signal-map" data-testid="hero-signal-map" ref={canvasRef} />;
}
