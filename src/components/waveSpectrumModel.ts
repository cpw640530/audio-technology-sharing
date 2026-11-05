export const componentFrequencies = [250, 500, 750] as const;
export const initialAmplitudes = [0.25, 0.15, 0.10];

export function componentSample(timeSeconds: number, index: number, amplitude: number, phaseDegrees: number) {
  return amplitude * Math.sin(2 * Math.PI * componentFrequencies[index] * timeSeconds + phaseDegrees * Math.PI / 180);
}

export function mixtureSample(timeSeconds: number, amplitudes: number[], thirdPhase: number) {
  return amplitudes.reduce((sum, amplitude, index) => sum + componentSample(timeSeconds, index, amplitude, index === 2 ? thirdPhase : 0), 0);
}

export function periodicCoefficients(amplitudes: number[], thirdPhase: number) {
  const real = new Float32Array(4);
  const imag = new Float32Array(4);
  amplitudes.forEach((amplitude, index) => {
    const phase = index === 2 ? thirdPhase * Math.PI / 180 : 0;
    real[index + 1] = amplitude * Math.sin(phase);
    imag[index + 1] = amplitude * Math.cos(phase);
  });
  return { real, imag };
}
