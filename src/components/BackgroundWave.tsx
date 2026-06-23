import { useEffect, useRef } from "react";

const FRAME_INTERVAL_MS = 1000 / 24;

function getCanvasContext(canvas: HTMLCanvasElement) {
  return canvas.getContext("2d", { alpha: true });
}

function getColorTriplet(style: CSSStyleDeclaration, name: string, fallback: string) {
  return style.getPropertyValue(name).trim() || fallback;
}

export function BackgroundWave() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (window.navigator.userAgent.toLowerCase().includes("jsdom")) {
      return undefined;
    }

    const context = canvas ? getCanvasContext(canvas) : null;

    if (!canvas || !context) {
      return undefined;
    }

    const activeCanvas = canvas;
    const activeContext = context;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animationFrame = 0;
    let lastFrame = 0;
    let width = 0;
    let height = 0;
    let deviceScale = 1;
    const rootStyle = getComputedStyle(document.documentElement);
    const colors = {
      deep: getColorTriplet(rootStyle, "--background-wave-deep", "31 117 105"),
      muted: getColorTriplet(rootStyle, "--background-wave-muted", "109 140 63"),
      primary: getColorTriplet(rootStyle, "--background-wave-primary", "31 157 138"),
      rose: getColorTriplet(rootStyle, "--background-wave-rose", "180 76 109"),
      secondary: getColorTriplet(rootStyle, "--background-wave-secondary", "196 111 42")
    };

    function resizeCanvas() {
      deviceScale = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      activeCanvas.width = Math.floor(width * deviceScale);
      activeCanvas.height = Math.floor(height * deviceScale);
      activeCanvas.style.width = `${width}px`;
      activeCanvas.style.height = `${height}px`;
      activeContext.setTransform(deviceScale, 0, 0, deviceScale, 0, 0);
    }

    function drawWave(timestamp: number, shouldContinue = true) {
      if (shouldContinue && timestamp - lastFrame < FRAME_INTERVAL_MS) {
        animationFrame = window.requestAnimationFrame(drawWave);
        return;
      }

      lastFrame = timestamp;
      const time = timestamp * 0.00035;
      activeContext.clearRect(0, 0, width, height);

      const gradient = activeContext.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, `rgb(${colors.primary} / 0.16)`);
      gradient.addColorStop(0.48, `rgb(${colors.muted} / 0.08)`);
      gradient.addColorStop(1, `rgb(${colors.secondary} / 0.12)`);
      activeContext.fillStyle = gradient;
      activeContext.fillRect(0, 0, width, height);

      const lanes = 4;
      for (let lane = 0; lane < lanes; lane += 1) {
        const baseline = height * (0.22 + lane * 0.18);
        const amplitude = 18 + lane * 7;
        const frequency = 0.008 + lane * 0.0018;

        activeContext.beginPath();
        for (let x = -20; x <= width + 20; x += 18) {
          const y =
            baseline +
            Math.sin(x * frequency + time + lane * 0.9) * amplitude +
            Math.sin(x * frequency * 0.42 - time * 1.4) * (amplitude * 0.38);

          if (x === -20) {
            activeContext.moveTo(x, y);
          } else {
            activeContext.lineTo(x, y);
          }
        }
        activeContext.strokeStyle =
          lane % 2 === 0 ? `rgb(${colors.deep} / 0.16)` : `rgb(${colors.rose} / 0.11)`;
        activeContext.lineWidth = lane === 0 ? 1.4 : 1;
        activeContext.stroke();
      }

      for (let index = 0; index < 34; index += 1) {
        const x = ((index * 137 + time * 96) % (width + 160)) - 80;
        const y = (height * (0.18 + ((index * 29) % 64) / 100)) % height;
        const pulse = 0.42 + Math.sin(time * 2.6 + index) * 0.22;
        const radius = 1.5 + pulse * 2.8;

        activeContext.beginPath();
        activeContext.arc(x, y, radius, 0, Math.PI * 2);
        activeContext.fillStyle =
          index % 3 === 0 ? `rgb(${colors.primary} / 0.14)` : `rgb(${colors.secondary} / 0.1)`;
        activeContext.fill();
      }

      if (shouldContinue) {
        animationFrame = window.requestAnimationFrame(drawWave);
      }
    }

    resizeCanvas();
    if (reducedMotion.matches) {
      drawWave(FRAME_INTERVAL_MS, false);
    } else {
      animationFrame = window.requestAnimationFrame(drawWave);
    }

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return <canvas aria-hidden="true" className="background-wave" ref={canvasRef} />;
}
