export type MicPrinciple = "electret" | "digitalMems" | "dynamicVocal" | "array";

export function getMicrophoneSignal(principle: MicPrinciple, inputSpl: number) {
  // Use the conventional teaching approximation 94 dB SPL = 1 Pa RMS.
  const pressurePa = 10 ** ((inputSpl - 94) / 20);
  const sensitivity = principle === "dynamicVocal" ? 0.002 : 0.00631;
  const microphoneVrms = pressurePa * sensitivity;
  const preampGain = principle === "dynamicVocal" ? 100 : 10;
  const preampVrms = microphoneVrms * preampGain;
  const requestedDbfs = principle === "digitalMems" ? inputSpl - 120 : 20 * Math.log10(preampVrms);
  const requestedPeak = 10 ** (requestedDbfs / 20);
  return {
    pressurePa, microphoneVrms, preampVrms, requestedDbfs, requestedPeak,
    overloaded: requestedDbfs > 1e-9,
    outputPeak: Math.min(1, requestedPeak),
    arraySignalRatio: 1,
    arrayNoiseRatio: 1 / Math.sqrt(4),
    arraySnrGainDb: 10 * Math.log10(4)
  };
}

export function pcmWavePath(peak: number, x: number, centerY: number, width: number, height: number, delaySeconds = 0) {
  return Array.from({ length: 193 }, (_, i) => {
    const time = i / 48000;
    const sample = Math.max(-1, Math.min(1, peak * Math.sin(2 * Math.PI * 1000 * (time - delaySeconds))));
    return `${i ? "L" : "M"}${(x + width * i / 192).toFixed(2)} ${(centerY - sample * height).toFixed(2)}`;
  }).join(" ");
}

export function makePdmBits(peak: number) {
  let error = 0;
  return Array.from({ length: 128 }, (_, i) => {
    const input = Math.max(-1, Math.min(1, peak * Math.sin(2 * Math.PI * i / 128)));
    error += input;
    const bit = error >= 0 ? 1 : 0;
    error -= bit ? 1 : -1;
    return bit;
  });
}

export function pcmWordBits(peak: number) {
  const sample = Math.round(Math.max(-1, Math.min(1, peak)) * 32767);
  return (sample & 0xffff).toString(2).padStart(16, "0").split("").map(Number);
}

export function bitStreamPath(bits: number[], x: number, centerY: number, width: number, height: number) {
  return bits.map((bit, i) => {
    const y = centerY + (bit ? -height : height);
    return `${i ? "V" : `M${x} `}${y} H${(x + (i + 1) * width / bits.length).toFixed(2)}`;
  }).join(" ");
}
