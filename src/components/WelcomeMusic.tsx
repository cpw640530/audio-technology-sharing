import { useEffect, useRef, useState } from "react";
import { Music2, Pause, Volume2 } from "lucide-react";
import type { Language } from "../content/knowledge";
import { text } from "../content/language";

export function WelcomeMusic({ language, autoplay = true }: { language: Language; autoplay?: boolean }) {
  const audio = useRef<{ context: AudioContext; gain: GainNode; analyser: AnalyserNode; media: HTMLAudioElement } | null>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const attempt = useRef(0);
  const [playing, setPlaying] = useState(false);
  const [busy, setBusy] = useState(false);
  const [volume, setVolume] = useState(15);
  const [error, setError] = useState(false);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const pen = canvas.current?.getContext("2d");
    if (!pen) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const samples = new Float32Array(512);
    let frame = 0;
    let last = -Infinity;
    const draw = (now: number) => {
      if (now - last >= 1000 / 30 && !document.hidden) {
        last = now;
        samples.fill(0);
        if (playing) audio.current?.analyser.getFloatTimeDomainData(samples);
        pen.clearRect(0, 0, 160, 80);
        pen.fillStyle = "#245c50";
        for (let bar = 0; bar < 12; bar++) {
          let energy = 0;
          for (let i = 0; i < 42; i++) energy += samples[bar * 42 + i] ** 2;
          // Short-time levels with fixed visual gain, not frequency bands or calibrated meters.
          const height = 4 + Math.min(1, Math.sqrt(energy / 42) * 16) * 68;
          pen.fillRect(4 + bar * 13, (80 - height) / 2, 6, height);
        }
      }
      if (playing && !reduced.matches) frame = requestAnimationFrame(draw);
    };
    const restart = () => { cancelAnimationFrame(frame); last = -Infinity; draw(performance.now()); };
    restart();
    reduced.addEventListener("change", restart);
    return () => { cancelAnimationFrame(frame); reduced.removeEventListener("change", restart); };
  }, [playing]);

  useEffect(() => () => {
    attempt.current++;
    const current = audio.current;
    audio.current = null;
    if (current) {
      current.context.onstatechange = null;
      current.media.onerror = null;
      current.media.pause();
      current.media.removeAttribute("src");
      current.media.load();
      void current.context.close().catch(() => {});
    }
  }, []);

  useEffect(() => { if (autoplay) void toggle(); }, []);

  async function toggle() {
    if (busy) return;
    const id = ++attempt.current;
    setBusy(true);
    setError(false);
    setBlocked(false);
    try {
      if (!audio.current) {
        const context = new AudioContext();
        const gain = context.createGain();
        const analyser = context.createAnalyser();
        analyser.fftSize = 512;
        const media = new Audio(`${import.meta.env.BASE_URL}audio/merry-christmas-mr-lawrence.mp3`);
        media.preload = "none";
        media.loop = true;
        audio.current = { context, gain, analyser, media };
        gain.gain.value = volume / 100;
        gain.connect(analyser);
        analyser.connect(context.destination);
        const source = context.createMediaElementSource(media);
        source.connect(gain);
        media.onerror = () => {
          if (audio.current?.media !== media) return;
          media.pause();
          setPlaying(false);
          setError(true);
        };
        context.onstatechange = () => {
          if (audio.current?.context === context) setPlaying(context.state === "running" && !media.paused);
        };
      }
      const current = audio.current;
      if (playing) {
        current.media.pause();
        await current.context.suspend();
      } else {
        // Start both in the gesture; a blocked media play rejects even if resume stays pending.
        await Promise.all([current.context.resume(), current.media.play()]);
      }
      if (audio.current === current) setPlaying(current.context.state === "running" && !current.media.paused);
    } catch (reason) {
      if (attempt.current !== id) return;
      if (audio.current) {
        audio.current.media.onerror = null;
        audio.current.media.pause();
        audio.current.media.removeAttribute("src");
        audio.current.media.load();
        void audio.current.context.close().catch(() => {});
        audio.current = null;
        setPlaying(false);
      }
      const denied = reason instanceof DOMException && reason.name === "NotAllowedError";
      setBlocked(denied);
      setError(!denied);
    } finally {
      if (attempt.current === id) setBusy(false);
    }
  }

  const label = playing ? text(language, "暂停背景音乐", "Pause background music", "BGM を一時停止", "배경 음악 일시 정지") : text(language, "播放背景音乐", "Play background music", "BGM を再生", "배경 음악 재생");
  return <div className="welcome-music">
    <button type="button" onClick={() => void toggle()} disabled={busy} aria-label={label} title={label}>
      {playing ? <Pause size={18} aria-hidden="true" /> : <Music2 size={18} aria-hidden="true" />}
    </button>
    <label><Volume2 size={16} aria-hidden="true" /><input type="range" min="0" max="50" step="1" value={volume}
      aria-label={text(language, "背景音乐音量", "Background music volume", "BGM の音量", "배경 음악 음량")}
      onChange={event => {
        const next = Number(event.target.value);
        setVolume(next);
        if (audio.current) audio.current.gain.gain.setTargetAtTime(next / 100, audio.current.context.currentTime, 0.05);
      }} /></label>
    <canvas ref={canvas} className="welcome-music-wave" width="160" height="80" aria-hidden="true" />
    {error && <span role="alert">{text(language, "播放失败，请重试。", "Playback failed. Please retry.", "再生できませんでした。もう一度お試しください。", "재생하지 못했습니다. 다시 시도해 주세요.")}</span>}
    {blocked && <span className="welcome-music-notice" role="status">{text(language, "点击音乐按钮开始播放", "Click the music button to play", "音楽ボタンを押して再生", "음악 버튼을 눌러 재생하세요")}</span>}
  </div>;
}
