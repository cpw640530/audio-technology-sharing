export type SoundComponent = { multiple: number; amplitude: number; phase: number };
export function soundComponents(mode: "tone" | "sum" | "spectrum", amplitude: number, second: number, phase: number): SoundComponent[] {
  return mode === "tone" ? [{ multiple: 1, amplitude, phase: 0 }] : mode === "sum"
    ? [{ multiple: 1, amplitude, phase: 0 }, { multiple: 1, amplitude: second, phase }]
    : [{ multiple: 1, amplitude, phase: 0 }, { multiple: 2, amplitude: second, phase }, { multiple: 3, amplitude: second / 2, phase: 0 }];
}
export function soundValue(time: number, frequency: number, components: SoundComponent[]) {
  return components.reduce((sum, c) => sum + c.amplitude * Math.sin(2 * Math.PI * frequency * c.multiple * time + c.phase), 0);
}
export function soundCoefficients(components: SoundComponent[]) {
  const real = new Float32Array(4);
  const imag = new Float32Array(4);
  for (const c of components) {
    real[c.multiple] += c.amplitude * Math.sin(c.phase);
    imag[c.multiple] += c.amplitude * Math.cos(c.phase);
  }
  return { real, imag };
}
