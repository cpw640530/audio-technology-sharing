export function compressedOutputDb(inputDb: number, threshold: number, ratio: number) {
  return inputDb <= threshold ? inputDb : threshold + (inputDb - threshold) / ratio;
}

export function dynamicsFrame(timeMs: number, threshold: number, ratio: number) {
  // A synthetic detector envelope, not signed audio samples. Quarter-second peaks are exact.
  const levels = [-36, -6, -30, -3, -24];
  const position = Math.min(1000, Math.max(0, timeMs)) / 250;
  const segment = Math.min(3, Math.floor(position));
  const blend = (1 - Math.cos(Math.PI * (position - segment))) / 2;
  const inputDb = levels[segment] + (levels[segment + 1] - levels[segment]) * blend;
  const outputDb = compressedOutputDb(inputDb, threshold, ratio);
  return { inputDb, outputDb, gainDb: outputDb - inputDb, linearGain: 10 ** ((outputDb - inputDb) / 20) };
}
