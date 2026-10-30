export type EnhancementMode = "aec" | "ns" | "agc" | "beamforming" | "dereverb";
export type WaveProcessing = Partial<Record<EnhancementMode, number>>;
export type ProcessingStrengths = Record<EnhancementMode, number>;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function getSelectedProcessing(mode: EnhancementMode, strength: number, micCount: number): WaveProcessing {
  if (mode === "beamforming" && micCount <= 1) {
    return {};
  }

  return { [mode]: strength / 100 };
}

function gaussian(value: number, center: number, width: number) {
  return Math.exp(-((value - center) ** 2) / width);
}

export function residualScales(processing: WaveProcessing, micCount: number) {
  const beam = micCount > 1 ? (processing.beamforming ?? 0) * (micCount === 4 ? 1 : 0.72) : 0;
  return {
    noise: (1 - (processing.ns ?? 0) * 0.93) * (1 - beam * 0.48),
    echo: 1 - (processing.aec ?? 0) * 0.94,
    reverb: (1 - (processing.dereverb ?? 0) * 0.9) * (1 - beam * 0.18)
  };
}

function speechEnvelopeAt(ratio: number) {
  return clamp(
    0.18 +
      gaussian(ratio, 0.18, 0.006) * 0.58 +
      gaussian(ratio, 0.38, 0.014) * 0.92 +
      gaussian(ratio, 0.62, 0.01) * 0.72 +
      gaussian(ratio, 0.82, 0.018) * 0.46,
    0.16,
    1
  );
}

function speechCarrierAt(ratio: number) {
  return (
    Math.sin(ratio * Math.PI * 9.2) * 0.68 +
    Math.sin(ratio * Math.PI * 18.6 + 0.54) * 0.24 +
    Math.sin(ratio * Math.PI * 31.2 + 1.15) * 0.1
  );
}


export function playbackReference(ratio: number) {
  return ratio <= 0 ? 0 : Math.sin(ratio * Math.PI * 14 + 0.3) * (0.6 + 0.3 * Math.sin(ratio * Math.PI * 3));
}

export function speechComponents(ratio: number, processing: WaveProcessing, micCount: number, noiseLevel = 45, echoLevel = 55, reverbLevel = 35) {
  const residual = residualScales(processing, micCount);
  const envelope = speechEnvelopeAt(ratio);
  const gain = (envelope + (0.58 - envelope) * (processing.agc ?? 0) * 0.9) / envelope;
  const texture = Math.sin(ratio * Math.PI * 92 + 0.4) * 0.52
    + Math.sin(ratio * Math.PI * 143 + 1.3) * 0.3
    + Math.sin(ratio * Math.PI * 211 + 0.2) * 0.14;
  const delayed = Math.max(0, ratio - 0.12);
  const late = Math.max(0, ratio - 0.18);
  // Unity target gain: adding microphones does not inherently amplify the desired voice.
  const speech = speechCarrierAt(ratio) * envelope * gain;
  const noise = texture * noiseLevel / 100 * residual.noise * 0.52 * gain;
  const echo = playbackReference(delayed) * echoLevel / 100 * residual.echo * 0.92 * gain;
  const reverb = (ratio <= 0.18 ? 0 : speechCarrierAt(late) * speechEnvelopeAt(late) * Math.exp(-late * 1.55)) * reverbLevel / 100 * residual.reverb * 0.58 * gain;
  return { speech, noise, echo, reverb, gain, total: speech + noise + echo + reverb };
}

export function processingThrough(mode: EnhancementMode, strengths: ProcessingStrengths, micCount: number, includeCurrent = true): WaveProcessing {
  const result: WaveProcessing = {};
  for (const stage of ["beamforming", "aec", "ns", "dereverb", "agc"] as const) {
    if (stage === mode && !includeCurrent) break;
    if (stage !== "beamforming" || micCount > 1) result[stage] = strengths[stage] / 100;
    if (stage === mode) break;
  }
  return result;
}
