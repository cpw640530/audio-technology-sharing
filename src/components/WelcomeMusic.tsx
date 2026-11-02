import { useEffect, useRef, useState } from "react";
import { Music2, Pause, Volume2 } from "lucide-react";
import type { Language } from "../content/knowledge";

export function WelcomeMusic({ language }: { language: Language }) {
  const audio = useRef<{ context: AudioContext; gain: GainNode } | null>(null);
  const [playing, setPlaying] = useState(false);
  const [busy, setBusy] = useState(false);
  const [volume, setVolume] = useState(15);
  const [error, setError] = useState(false);
  const zh = language === "zh";

  useEffect(() => () => {
    const current = audio.current;
    audio.current = null;
    if (current) {
      current.context.onstatechange = null;
      void current.context.close().catch(() => {});
    }
  }, []);

  async function toggle() {
    if (busy) return;
    setBusy(true);
    setError(false);
    try {
      if (!audio.current) {
        const context = new AudioContext();
        const gain = context.createGain();
        audio.current = { context, gain };
        gain.gain.value = volume / 100;
        gain.connect(context.destination);
        const buffer = context.createBuffer(1, context.sampleRate * 16, context.sampleRate);
        const samples = buffer.getChannelData(0);
        // Four original broken chords; each note fades to zero before the loop boundary.
        const chords = [[48, 55, 60, 64], [45, 52, 57, 60], [41, 48, 53, 57], [43, 50, 55, 59]];
        for (let beat = 0; beat < 32; beat++) {
          const note = chords[Math.floor(beat / 8)][beat % 4];
          const frequency = 440 * 2 ** ((note - 69) / 12);
          const start = Math.floor(beat * 0.5 * context.sampleRate);
          const length = Math.min(Math.floor(context.sampleRate * 1.8), samples.length - start);
          for (let i = 0; i < length; i++) {
            const t = i / context.sampleRate;
            const envelope = Math.min(t / 0.025, 1) * Math.exp(-t * 3) * Math.min((length - 1 - i) / (context.sampleRate * 0.08), 1);
            samples[start + i] += 0.22 * envelope * (Math.sin(2 * Math.PI * frequency * t) + 0.2 * Math.sin(4 * Math.PI * frequency * t));
          }
        }
        const source = context.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        source.connect(gain);
        source.start();
        context.onstatechange = () => {
          if (audio.current?.context === context) setPlaying(context.state === "running");
        };
      }
      const current = audio.current;
      if (playing) await current.context.suspend();
      else await current.context.resume();
      if (audio.current === current) setPlaying(current.context.state === "running");
    } catch {
      if (audio.current) {
        void audio.current.context.close().catch(() => {});
        audio.current = null;
        setPlaying(false);
        setError(true);
      } else setError(true);
    } finally {
      setBusy(false);
    }
  }

  const label = zh ? (playing ? "暂停背景音乐" : "播放背景音乐") : (playing ? "Pause background music" : "Play background music");
  return <div className="welcome-music">
    <button type="button" onClick={() => void toggle()} disabled={busy} aria-label={label} title={label}>
      {playing ? <Pause size={18} aria-hidden="true" /> : <Music2 size={18} aria-hidden="true" />}
    </button>
    <label><Volume2 size={16} aria-hidden="true" /><input type="range" min="0" max="50" step="1" value={volume}
      aria-label={zh ? "背景音乐音量" : "Background music volume"}
      onChange={event => {
        const next = Number(event.target.value);
        setVolume(next);
        if (audio.current) audio.current.gain.gain.setTargetAtTime(next / 100, audio.current.context.currentTime, 0.05);
      }} /></label>
    {error && <span role="alert">{zh ? "播放失败，请重试。" : "Playback failed. Please retry."}</span>}
  </div>;
}
