// IMA/DVI reference: https://www.cs.columbia.edu/~hgs/audio/dvi/IMA_ADPCM.pdf
const steps = [
  7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 19, 21, 23, 25, 28, 31, 34, 37,
  41, 45, 50, 55, 60, 66, 73, 80, 88, 97, 107, 118, 130, 143, 157, 173,
  190, 209, 230, 253, 279, 307, 337, 371, 408, 449, 494, 544, 598, 658,
  724, 796, 876, 963, 1060, 1166, 1282, 1411, 1552, 1707, 1878, 2066,
  2272, 2499, 2749, 3024, 3327, 3660, 4026, 4428, 4871, 5358, 5894,
  6484, 7132, 7845, 8630, 9493, 10442, 11487, 12635, 13899, 15289,
  16818, 18500, 20350, 22385, 24623, 27086, 29794, 32767,
];
const indexChanges = [-1, -1, -1, -1, 2, 4, 6, 8];
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
function integerInRange(value: number, min: number, max: number) {
  if (!Number.isInteger(value) || value < min || value > max) throw new RangeError(`Expected integer in [${min}, ${max}]`);
}

export function decodeImaSample(code: number, prediction: number, index: number) {
  integerInRange(code, 0, 15);
  integerInRange(prediction, -32768, 32767);
  integerInRange(index, 0, 88);
  const step = steps[index];
  // Separate shifts retain the integer rounding of the reference decoder.
  let difference = step >> 3;
  if (code & 4) difference += step;
  if (code & 2) difference += step >> 1;
  if (code & 1) difference += step >> 2;
  return {
    sample: clamp(prediction + (code & 8 ? -difference : difference), -32768, 32767),
    index: clamp(index + indexChanges[code & 7], 0, 88),
  };
}

export function encodeImaTrace(samples: number[], initialIndex: number) {
  if (!samples.length) throw new RangeError("At least one PCM sample is required");
  samples.forEach(sample => integerInRange(sample, -32768, 32767));
  integerInRange(initialIndex, 0, 88);
  let prediction = samples[0];
  let index = initialIndex;
  return samples.slice(1).map(original => {
    const step = steps[index];
    const difference = original - prediction;
    let remainder = Math.abs(difference);
    let code = difference < 0 ? 8 : 0;
    for (const [bit, threshold] of [[4, step], [2, step >> 1], [1, step >> 2]]) {
      if (remainder >= threshold) { code |= bit; remainder -= threshold; }
    }
    const decoded = decodeImaSample(code, prediction, index);
    const trace = { original, prediction, difference, code, step, index, nextIndex: decoded.index, reconstructed: decoded.sample, error: decoded.sample - original };
    prediction = decoded.sample;
    index = decoded.index;
    return trace;
  });
}
