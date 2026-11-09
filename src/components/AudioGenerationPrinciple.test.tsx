import { render } from "@testing-library/react";
import { expect, it } from "vitest";
import { AudioGenerationPrinciple } from "./AudioGenerationPrinciple";

it.each(["zh", "zh-Hant", "en", "ja", "ko"] as const)("renders one four-step audio generation flow in %s", language => {
  const { container } = render(<AudioGenerationPrinciple language={language} />);
  expect(container.querySelectorAll("section.sound-topic-section.audio-generation-principle")).toHaveLength(1);
  expect(container.querySelectorAll("h2")).toHaveLength(1);
  expect(container.querySelectorAll("ol.ai-topic-flow > li")).toHaveLength(4);
  expect(container.querySelectorAll("ol.ai-topic-flow > li svg")).toHaveLength(4);
  expect(container.querySelector('a[href="https://github.com/ace-step/ACE-Step-1.5"]')).toBeTruthy();
  expect(container.querySelector('a[href="https://arxiv.org/abs/2602.00744"]')).toBeTruthy();
  expect(container.querySelector('a[href="https://github.com/Stability-AI/stable-audio-3"]')).toBeTruthy();
  expect(container.querySelector('a[href="https://arxiv.org/abs/2605.17991"]')).toBeTruthy();
  expect(container).toHaveTextContent("quiet piano with rain");
  expect(container).not.toHaveTextContent("undefined");
});

it("keeps the prompt, ACE architecture chain, contemporary architecture routes, and timing boundaries explicit", () => {
  const { container } = render(<AudioGenerationPrinciple language="en" />);
  expect(container).toHaveTextContent("Unlike TTS");
  expect(container).toHaveTextContent("music, not speech to read aloud");
  expect(container).not.toHaveTextContent("MusicGen");
  expect(container).toHaveTextContent("optional LM planner → metadata / lyrics / 5 Hz semantic codes → DiT flow matching → 25 Hz continuous acoustic latents → waveform-domain 1D VAE decoder → 48 kHz stereo PCM");
  expect(container).toHaveTextContent("The four steps below explicitly cover only the ACE-Step 1.5 route");
  expect(container).toHaveTextContent("two contemporary audio-generation architectures");
  expect(container).toHaveTextContent("Stable Audio 3 Medium (2026)");
  expect(container).toHaveTextContent("text / duration conditioning → DiT (continuous SAME latent generation; flow matching + distillation + adversarial post-training) → 256-dim SAME latents (~10.77 Hz, 4096× temporal downsampling) → SAME-L decoder → 44.1 kHz stereo PCM");
  expect(container).toHaveTextContent("generation iterations != audio playback time");
  expect(container).toHaveTextContent("token rate != audio sample rate");
  expect(container.querySelector("img")).toBeNull();
  expect(container.querySelector("canvas")).toBeNull();
});

it.each([
  ["zh-Hant", "提示怎樣變成可播放的聲音"],
  ["en", "How a prompt becomes playable audio"],
  ["ja", "プロンプトが再生可能な音声になるまで"],
  ["ko", "프롬프트가 재생 가능한 오디오가 되기까지"]
] as const)("localizes the article heading in %s", (language, heading) => {
  const { container } = render(<AudioGenerationPrinciple language={language} />);
  expect(container.querySelector("h2")).toHaveTextContent(heading);
});
