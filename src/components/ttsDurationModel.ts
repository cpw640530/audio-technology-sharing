// Fixed teaching alignment for one English reading, not a G2P or duration predictor.
export const ttsUnits = ["h", "ə", "l", "oʊ", "sil", "eɪ", "aɪ"];
const baseDurations = [6, 8, 8, 20, 15, 18, 22];

export function expandTtsDurations(speed: number, pauseFrames: number) {
  const durations = baseDurations.map((d,i) => i===4 ? pauseFrames : Math.max(1,Math.round(d/speed)));
  const frames = durations.flatMap((d,i) => Array.from({length:d},()=>i));
  return {durations,frames};
}
