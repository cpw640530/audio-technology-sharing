export type PropagationSettings = { mode: "pulse" | "continuous"; amplitude: number; rate: number };
export const propagationStep = 1 / 30;
// Linear right-going plane wave: s(x,t)=g(t-x/c), p=rho*c*ds/dt.
// Length/time are illustrative units. Fixed velocity reference avoids auto-normalization.
export function propagationSample(x: number, time: number, settings: PropagationSettings) {
  const delayedTime = time - x / 4;
  if (delayedTime <= 0 || (settings.mode === "pulse" && delayedTime >= 1)) return { displacement: 0, pressure: 0 };
  const rate = settings.mode === "pulse" ? 1 : settings.rate;
  const angle = Math.PI * rate * delayedTime;
  return {
    displacement: .22 * settings.amplitude * Math.sin(angle) ** 2,
    pressure: settings.amplitude * rate / 1.5 * Math.sin(2 * angle),
  };
}
export function propagationFrame(time: number, settings: PropagationSettings) {
  return Array.from({ length: 49 }, (_, i) => propagationSample(i / 48 * 8, time, settings).displacement);
}
export function pressureHistory(time: number, settings: PropagationSettings) {
  const end = Math.floor(time / propagationStep + 1e-7);
  return Array.from({ length: Math.min(end, 240) + 1 }, (_, i) => {
    const t = (Math.max(0, end - 240) + i) * propagationStep;
    return { time: t, pressure: propagationSample(4, t, settings).pressure };
  });
}
