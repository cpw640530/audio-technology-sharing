import { AudioLines, Binary, Music2, Sparkles } from "lucide-react";
import type { Language } from "../content/knowledge";
import { text } from "../content/language";

export function AudioGenerationPrinciple({ language }: { language: Language }) {
  const t = (zh: string, en: string, ja: string, ko: string) => text(language, zh, en, ja, ko);
  const steps = [
    {
      title: t("提示与条件", "Prompt and conditions", "プロンプトと条件", "프롬프트와 조건"),
      icon: Music2,
      detail: <><code>quiet piano with rain</code>{t(" = 音乐，不是要朗读的文字。和 TTS 不同，提示词描述想要的声音，而不是要说出的词。", " = music, not speech to read aloud. Unlike TTS, the prompt describes the sound to make, not words to speak.", " = 音楽であり、読み上げる言葉ではありません。TTS と違い、プロンプトは作りたい音を表し、話す言葉を表しません。", " = 음악이며 읽어 줄 말이 아닙니다. TTS와 달리 프롬프트는 만들 소리를 설명하며 말할 단어를 설명하지 않습니다.")}</>
    },
    {
      title: t("LM 规划与语义代码", "LM planning and semantic codes", "LM の計画と意味コード", "LM 계획과 의미 코드"),
      icon: Binary,
      detail: <>{t("ACE-Step 1.5 可选用 LM 规划器，把提示整理成 metadata、lyrics 和 5 Hz 语义代码；这些是 DiT 的结构条件，不是可播放音频。", "ACE-Step 1.5 can use an LM planner to turn the prompt into metadata, lyrics, and 5 Hz semantic codes; these are DiT structural conditions, not playable audio.", "ACE-Step 1.5 は LM プランナーを使い、プロンプトを metadata、lyrics、5 Hz の意味コードに整理できます。これらは DiT の構造条件で、再生可能な音声ではありません。", "ACE-Step 1.5는 LM 플래너를 사용해 프롬프트를 metadata, lyrics, 5 Hz 의미 코드로 정리할 수 있습니다. 이는 DiT의 구조 조건이며 재생 가능한 오디오가 아닙니다.")}</>
    },
    {
      title: t("DiT 生成声学潜变量", "DiT acoustic generation", "DiT による音響生成", "DiT 음향 생성"),
      icon: Sparkles,
      detail: <>{t("DiT 使用 flow matching，在 25 Hz 的连续声学潜空间中生成或细化目标；生成步数是计算过程，不是音频时长。", "The DiT uses flow matching to generate or refine 25 Hz continuous acoustic latents; generation steps are computation, not audio duration.", "DiT は flow matching を使い、25 Hz の連続音響潜在空間で目標を生成または精緻化します。生成ステップ数は計算過程で、音声の長さではありません。", "DiT는 flow matching으로 25 Hz 연속 음향 잠재 공간에서 목표를 생성하거나 정제합니다. 생성 단계 수는 계산 과정이지 오디오 길이가 아닙니다.")} <code>generation iterations != audio playback time</code></>
    },
    {
      title: t("1D VAE 解码为 PCM", "1D VAE decodes waveform PCM", "1D VAE による波形 PCM デコード", "1D VAE 파형 PCM 디코드"),
      icon: AudioLines,
      detail: <>{t("波形域 1D VAE 将连续潜变量解码为 48 kHz 立体声 PCM。ACE-Step 这条路线不插入 Mel 频谱或独立 vocoder；", "A waveform-domain 1D VAE decodes the continuous latents into 48 kHz stereo PCM. This ACE-Step route does not insert a Mel spectrogram or a separate vocoder;", "波形領域の 1D VAE が連続潜在変数を 48 kHz ステレオ PCM にデコードします。ACE-Step の経路に Mel スペクトログラムや独立した vocoder は入りません。", "파형 영역의 1D VAE가 연속 잠재 변수를 48 kHz 스테레오 PCM으로 디코드합니다. ACE-Step 경로에는 Mel 스펙트로그램이나 별도 vocoder가 들어가지 않습니다.")} {t("token rate 统计表示符号，audio sample rate 统计 PCM 每秒采样数，二者不是一回事：", "a token rate counts representation symbols; an audio sample rate counts PCM samples per second. They are different quantities:", "token rate は表現の記号数、audio sample rate は PCM の 1 秒あたりのサンプル数で、同じ量ではありません：", "token rate는 표현 기호 수를 세고 audio sample rate는 초당 PCM 샘플 수를 세므로 서로 다른 양입니다:")} <code>token rate != audio sample rate</code></>
    }
  ];

  return <section className="sound-topic-section audio-generation-principle">
    <div className="sound-topic-section-heading">
      <div>
        <h2>{t("提示怎样变成可播放的声音", "How a prompt becomes playable audio", "プロンプトが再生可能な音声になるまで", "프롬프트가 재생 가능한 오디오가 되기까지")}</h2>
        <p>{t("从 quiet piano with rain 开始：提示词给出声音条件；ACE-Step 1.5 与 Stable Audio 3 Medium (2026) 展示两种当代音频生成架构，后者支持音乐和 SFX。下面四步仅解释 ACE-Step 1.5 的可选 LM 规划、DiT 声学生成和波形 VAE 解码，Stable Audio 3 Medium (2026) 的独立路线列在其下。", "Start with quiet piano with rain: the prompt supplies sound conditions; ACE-Step 1.5 and Stable Audio 3 Medium (2026) show two contemporary audio-generation architectures, with the latter supporting music/SFX. The four steps below explicitly cover only the ACE-Step 1.5 route of optional LM planning, DiT acoustic generation, and waveform VAE decoding; Stable Audio 3 Medium (2026)'s separate route is listed below.", "quiet piano with rain から始めます。プロンプトが音の条件を与え、ACE-Step 1.5 と Stable Audio 3 Medium (2026) は現代の音声生成アーキテクチャを 2 つ示し、後者は音楽と SFX に対応します。以下の 4 ステップは ACE-Step 1.5 の任意の LM 計画、DiT 音響生成、波形 VAE デコードだけを説明し、Stable Audio 3 Medium (2026) の独立した経路はその下に示します。", "quiet piano with rain으로 시작합니다. 프롬프트가 소리 조건을 주며 ACE-Step 1.5와 Stable Audio 3 Medium (2026)은 두 가지 현대 오디오 생성 아키텍처를 보여 주고, 후자는 음악과 SFX를 지원합니다. 아래 네 단계는 선택적 LM 계획, DiT 음향 생성, 파형 VAE 디코딩으로 이어지는 ACE-Step 1.5 경로만 설명하고 Stable Audio 3 Medium (2026)의 별도 경로는 아래에 표시합니다.")}</p>
      </div>
    </div>
    <ol className="ai-topic-flow audio-generation-flow" aria-label={t("ACE-Step 音频生成流程", "ACE-Step audio generation flow", "ACE-Step 音声生成フロー", "ACE-Step 오디오 생성 흐름")}>
      {steps.map(({ title, icon: Icon, detail }, index) => <li key={title}>
        <span>{String(index + 1).padStart(2, "0")}</span>
        <Icon className="audio-generation-icon" size={28} aria-hidden="true" />
        <h3>{title}</h3>
        <p>{detail}</p>
      </li>)}
    </ol>
    <div className="generation-article-routes">
      <p><span><a href="https://github.com/ace-step/ACE-Step-1.5" target="_blank" rel="noreferrer">ACE-Step 1.5</a>{" "}<a href="https://arxiv.org/abs/2602.00744" target="_blank" rel="noreferrer">{t("论文", "paper", "論文", "논문")}</a></span><code>optional LM planner → metadata / lyrics / 5 Hz semantic codes → DiT flow matching → 25 Hz continuous acoustic latents → waveform-domain 1D VAE decoder → 48 kHz stereo PCM</code></p>
      <p><span><a href="https://github.com/Stability-AI/stable-audio-3" target="_blank" rel="noreferrer">Stable Audio 3 Medium (2026)</a>{" "}<a href="https://arxiv.org/abs/2605.17991" target="_blank" rel="noreferrer">{t("论文", "paper", "論文", "논문")}</a></span><code>text / duration conditioning → DiT (continuous SAME latent generation; flow matching + distillation + adversarial post-training) → 256-dim SAME latents (~10.77 Hz, 4096× temporal downsampling) → SAME-L decoder → 44.1 kHz stereo PCM</code></p>
    </div>
  </section>;
}
