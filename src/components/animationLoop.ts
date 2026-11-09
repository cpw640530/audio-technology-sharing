// Share one frame clock per animation, with no work while hidden or offscreen.
export function animationLoop(
  element: Element,
  draw: (deltaSeconds: number) => void,
  { fps = 30, respectReducedMotion = true } = {}
) {
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const interval = 1000 / fps;
  let visible = typeof IntersectionObserver === "undefined";
  let playing = true;
  let disposed = false;
  let frame = 0;
  let previous = performance.now();
  let scheduled = previous;

  function tick(now: number) {
    if (now - scheduled >= interval - 0.5) {
      const delta = Math.min(Math.max(0, now - previous) / 1000, 0.1);
      previous = now;
      // Keep the cadence anchored instead of accumulating refresh-rate rounding.
      scheduled += Math.max(1, Math.floor((now - scheduled + 0.5) / interval)) * interval;
      draw(delta);
    }
    frame = requestAnimationFrame(tick);
  }

  function sync() {
    cancelAnimationFrame(frame);
    previous = scheduled = performance.now();
    if (!disposed && playing && visible && !document.hidden && !(respectReducedMotion && motion.matches)) {
      frame = requestAnimationFrame(tick);
    }
  }

  const observer = typeof IntersectionObserver === "undefined" ? undefined : new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    sync();
  });
  draw(0);
  observer?.observe(element);
  document.addEventListener("visibilitychange", sync);
  motion.addEventListener("change", sync);
  sync();

  return {
    setPlaying(value: boolean) { playing = value; sync(); },
    dispose() {
      disposed = true;
      cancelAnimationFrame(frame);
      observer?.disconnect();
      document.removeEventListener("visibilitychange", sync);
      motion.removeEventListener("change", sync);
    }
  };
}
