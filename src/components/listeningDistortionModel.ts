export function createDistortionCurve(amount: number) {
  const samples = 512;
  const curve = new Float32Array(samples);
  const drive = 1 + amount * 34;
  const wet = amount;
  const asymmetry = amount * 0.18;

  for (let index = 0; index < samples; index += 1) {
    const x = (index * 2) / (samples - 1) - 1;
    const shaped = (Math.tanh(x * drive) + asymmetry * x * x) / (1 + asymmetry);
    curve[index] = x * (1 - wet) + shaped * wet;
  }

  return curve;
}

export function distortionSample(curve: Float32Array, input: number) {
  const position = (Math.max(-1, Math.min(1, input)) + 1) * (curve.length - 1) / 2;
  const low = Math.floor(position), high = Math.min(low + 1, curve.length - 1);
  return curve[low] + (curve[high] - curve[low]) * (position - low);
}

export function getDistortionHarmonics(intensity: number) {
  const curve = createDistortionCurve(intensity / 100);
  const count = 2048;
  const samples = Array.from({ length: count }, (_, i) => distortionSample(curve, Math.sin(2 * Math.PI * i / count)));
  return [1, 2, 3, 5, 7].map(order => {
    let sine = 0, cosine = 0;
    samples.forEach((value, i) => {
      const phase = 2 * Math.PI * order * i / count;
      sine += value * Math.sin(phase) * 2 / count;
      cosine += value * Math.cos(phase) * 2 / count;
    });
    return { order, gain: Math.hypot(sine, cosine), phase: Math.atan2(cosine, sine) };
  }).filter(component => component.order === 1 || component.gain > 1e-5);
}
