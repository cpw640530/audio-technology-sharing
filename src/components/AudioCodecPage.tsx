import type { ReactNode } from "react";
import { TopicReadingLayout } from "./TopicReadingLayout";
import { ArrowLeft, BookOpen, CircuitBoard } from "lucide-react";
import type { Category, Language, Topic } from "../content/knowledge";
import { TopicPager } from "./TopicPager";

type DisplayTopic = Topic & { category: Category };

type AudioCodecPageProps = {
  relatedTopics?: ReactNode;
  language: Language;
  topic: DisplayTopic;
  onBack: () => void;
  onOpenLab: () => void;
  onOpenPrevious?: () => void;
  onOpenNext?: () => void;
};

type CodecRow = {
  name: string;
  family: Record<Language, string>;
  bitrate: Record<Language, string>;
  latency: Record<Language, string>;
  principle: Record<Language, string>;
  example: Record<Language, string>;
  scenario: Record<Language, string>;
};

const codecRows = [
  {
    name: "PCM",
    family: { zh: "不压缩基准", en: "Uncompressed baseline" },
    bitrate: { zh: "约 1411 kbps / CD 双声道", en: "about 1411 kbps / CD stereo" },
    latency: { zh: "极低", en: "Very low" },
    principle: { zh: "通俗理解：像把原始录音直接逐点记下来，不猜、不省、不压缩。", en: "Plainly: it writes down the original audio point by point, without guessing, skipping, or compressing." },
    example: { zh: "例子：48 kHz / 16-bit / 双声道 PCM 每秒固定约 1536 kbps，安静片段和复杂音乐一样大。", en: "Example: 48 kHz / 16-bit / stereo PCM is always about 1536 kbps, whether the audio is silence or dense music." },
    scenario: { zh: "编辑、系统内部、短素材", en: "editing, system internals, short assets" }
  },
  {
    name: "FLAC",
    family: { zh: "无损压缩", en: "Lossless compression" },
    bitrate: { zh: "约为 PCM 的 40%-70%", en: "about 40%-70% of PCM" },
    latency: { zh: "低到中", en: "Low to medium" },
    principle: { zh: "通俗理解：先找波形里的重复规律，再把规律写短；解码后每个采样点还能还原回来。", en: "Plainly: it finds repeated patterns in the waveform and writes them shorter; every sample can be restored exactly." },
    example: { zh: "例子：FLAC 像把重复规律写成公式，连续安静、稳定音符和相似片段会比 PCM 小很多。", en: "Example: FLAC is like writing repeated patterns as formulas, so silence, steady notes, and similar passages become much smaller than PCM." },
    scenario: { zh: "音乐归档、母带备份", en: "music archive, master backup" }
  },
  {
    name: "MP3",
    family: { zh: "有损音乐", en: "Lossy music" },
    bitrate: { zh: "常见 128-320 kbps", en: "often 128-320 kbps" },
    latency: { zh: "中", en: "Medium" },
    principle: { zh: "通俗理解：先把声音拆成很多频率小格子，再把人耳不敏感、被大声音盖住的细节少记或不记。", en: "Plainly: it splits sound into frequency bins, then spends fewer bits on details that are masked or hard to hear." },
    example: { zh: "例子：16 kHz 采样率的 PCM 最高只到 8 kHz。MP3 不会固定砍掉某个频率，但低码率时会优先弱化接近 8 kHz、能量弱、被人声或乐器盖住的细节。", en: "Example: 16 kHz PCM only reaches 8 kHz. MP3 does not cut a fixed frequency, but at low bitrate it may weaken details near 8 kHz when they are quiet or masked by voice or instruments." },
    scenario: { zh: "兼容性优先的音乐文件", en: "music files where compatibility matters" }
  },
  {
    name: "AAC",
    family: { zh: "有损音乐 / 视频", en: "Lossy music / video" },
    bitrate: { zh: "常见 96-256 kbps", en: "often 96-256 kbps" },
    latency: { zh: "中", en: "Medium" },
    principle: { zh: "通俗理解：和 MP3 一样会按听感取舍，但工具更细，能用更少码率保留更多细节。", en: "Plainly: like MP3, it makes hearing-based trade-offs, but with finer tools that preserve more detail at lower bitrate." },
    example: { zh: "例子：同样 128 kbps，AAC 通常比 MP3 更容易保住鼓镲、空气感和视频里的背景音乐。", en: "Example: at the same 128 kbps, AAC often keeps cymbals, air, and video background music cleaner than MP3." },
    scenario: { zh: "在线视频、手机音乐、蓝牙 AAC", en: "online video, phone music, Bluetooth AAC" }
  },
  {
    name: "Opus",
    family: { zh: "实时语音 / 音乐", en: "Real-time speech / music" },
    bitrate: { zh: "约 16-256 kbps", en: "about 16-256 kbps" },
    latency: { zh: "低", en: "Low" },
    principle: { zh: "通俗理解：会判断当前更像语音还是音乐，并尽量用很短的等待时间完成压缩。", en: "Plainly: it can treat content more like speech or music while keeping the wait time short." },
    example: { zh: "例子：Opus 在网络变差时可以降低码率，先保证人声不断，再牺牲一点音乐细节。", en: "Example: Opus can lower bitrate when the network gets worse, keeping speech continuous before preserving music detail." },
    scenario: { zh: "语音会议、直播互动、游戏语音", en: "meetings, interactive streaming, game chat" }
  },
  {
    name: "AMR",
    family: { zh: "语音专用", en: "Speech specific" },
    bitrate: { zh: "约 4.75-23.85 kbps", en: "about 4.75-23.85 kbps" },
    latency: { zh: "低到中", en: "Low to medium" },
    principle: { zh: "通俗理解：不试图完整保存声音，而是保存“这句话怎么发出来”的人声参数。", en: "Plainly: it does not preserve the whole sound; it stores speech parameters describing how the voice was produced." },
    example: { zh: "例子：AMR 可以用很低码率让电话里的人声还听得懂，但音乐会明显变窄、变薄。", en: "Example: AMR can keep phone speech understandable at very low bitrate, but music becomes narrow and thin." },
    scenario: { zh: "蜂窝语音、窄带或宽带通话", en: "cellular voice, narrowband or wideband calls" }
  },
  {
    name: "LC3",
    family: { zh: "低功耗蓝牙 / 通信", en: "LE Audio / communication" },
    bitrate: { zh: "约 16-345 kbps", en: "about 16-345 kbps" },
    latency: { zh: "低", en: "Low" },
    principle: { zh: "通俗理解：为新一代低功耗蓝牙设计，在省电、稳定和音质之间找平衡。", en: "Plainly: it is designed for modern low-power Bluetooth, balancing battery, stability, and quality." },
    example: { zh: "例子：LC3 可以在较低码率下维持通话清晰度，适合耳机、助听器和广播音频。", en: "Example: LC3 can keep calls clear at lower bitrate, fitting earbuds, hearing aids, and broadcast audio." },
    scenario: { zh: "蓝牙 LE 耳机、助听、广播音频", en: "LE headsets, hearing aids, broadcast audio" }
  },
  {
    name: "SBC",
    family: { zh: "蓝牙基础", en: "Bluetooth baseline" },
    bitrate: { zh: "常见 192-345 kbps", en: "often 192-345 kbps" },
    latency: { zh: "中到高", en: "Medium to high" },
    principle: { zh: "通俗理解：把声音分成几个粗频段，再给每段分配比特；做法稳妥但不算特别省。", en: "Plainly: it splits sound into coarse bands and assigns bits to each; reliable but not especially efficient." },
    example: { zh: "例子：SBC 像蓝牙耳机的保底方案，两端大多能用，但同码率下细节通常不如 AAC、LDAC 或 LC3。", en: "Example: SBC is the fallback for Bluetooth headsets: widely usable, but usually less detailed than AAC, LDAC, or LC3 at similar bitrate." },
    scenario: { zh: "A2DP 默认兼容模式", en: "default compatible A2DP mode" }
  },
  {
    name: "aptX",
    family: { zh: "蓝牙有损", en: "Bluetooth lossy" },
    bitrate: { zh: "经典 aptX：352.8 / 384 kbps", en: "Classic aptX: 352.8 / 384 kbps" },
    latency: { zh: "中，低延迟版本更低", en: "Medium, lower with low-latency variants" },
    principle: { zh: "通俗理解：不直接记完整波形，而是记相邻采样之间怎么变，计算量相对可控。", en: "Plainly: it stores how samples change from one to the next rather than storing the full waveform directly." },
    example: { zh: "例子：aptX 需要手机和耳机都支持；如果任一端不支持，通常会退回 SBC 或其他公共格式。", en: "Example: aptX needs support on both phone and headset; otherwise it usually falls back to SBC or another common format." },
    scenario: { zh: "兼容设备间的蓝牙音乐", en: "Bluetooth music between compatible devices" }
  },
  {
    name: "LDAC",
    family: { zh: "高码率蓝牙", en: "High-bitrate Bluetooth" },
    bitrate: { zh: "330 / 660 / 990 kbps", en: "330 / 660 / 990 kbps" },
    latency: { zh: "中到高", en: "Medium to high" },
    principle: { zh: "通俗理解：尽量给蓝牙音频更大的数据通道，让压缩少一点，但无线条件要跟得上。", en: "Plainly: it gives Bluetooth audio a larger data pipe so compression can be gentler, but the radio link must keep up." },
    example: { zh: "例子：LDAC 990 kbps 更像走更宽的无线通道，近距离稳定时细节更多，干扰大时可能切到 660 或 330 kbps。", en: "Example: LDAC 990 kbps is like using a wider wireless lane; it can keep more detail nearby, but may drop to 660 or 330 kbps under interference." },
    scenario: { zh: "稳定近距离的高码率蓝牙听音", en: "stable close-range high-bitrate Bluetooth listening" }
  }
] satisfies CodecRow[];

const compressionComparisonRows = [
  {
    codec: "PCM / PCM WAV",
    ratio: { zh: "约 1:1", en: "About 1:1" },
    typical: { zh: "48 kHz / 16-bit / 双声道约 1536 kbps", en: "48 kHz / 16-bit / stereo is about 1536 kbps" },
    note: { zh: "此处特指 WAV 内装 PCM；WAV 是容器，也可装其他编码。", en: "This row means PCM in WAV; WAV is a container and can carry other codecs." }
  },
  {
    codec: "FLAC",
    ratio: { zh: "约 1.4:1 到 2.5:1", en: "About 1.4:1 to 2.5:1" },
    typical: { zh: "通常为 PCM 的 40%-70%", en: "Often 40%-70% of PCM size" },
    note: { zh: "无损，解码后每个采样点应和原始 PCM 一致。", en: "Lossless; decoded samples should match the original PCM." }
  },
  {
    codec: "MP3 / AAC",
    ratio: { zh: "约 4.8:1 到 16:1", en: "About 4.8:1 to 16:1" },
    typical: { zh: "48 kHz / 16-bit / 双声道：1536 → 96-320 kbps", en: "48 kHz / 16-bit / stereo: 1536 → 96-320 kbps" },
    note: { zh: "有损，依靠听觉掩蔽分配比特；低码率更容易损失高频细节。", en: "Lossy; uses auditory masking for bit allocation, and low bitrate more easily loses treble detail." }
  },
  {
    codec: "Opus",
    ratio: { zh: "示例 4:1 到 16:1", en: "Example: 4:1 to 16:1" },
    typical: { zh: "16 kHz / 16-bit / 单声道：256 → 16-64 kbps", en: "16 kHz / 16-bit / mono: 256 → 16-64 kbps" },
    note: { zh: "这是指定输入格式的语音例子，不是编码器固定压缩比。", en: "A voice example with a specified input format, not a fixed codec ratio." }
  },
  {
    codec: "LC3",
    ratio: { zh: "示例 8:1", en: "Example: 8:1" },
    typical: { zh: "16 kHz / 16-bit / 单声道：256 → 32 kbps", en: "16 kHz / 16-bit / mono: 256 → 32 kbps" },
    note: { zh: "LE Audio 的一个语音配置示例；实际按采样率、帧长和每帧字节数协商。", en: "One LE Audio speech configuration; actual operation negotiates sample rate, frame duration, and bytes per frame." }
  },
  {
    codec: "AMR-NB",
    ratio: { zh: "约 10.5:1 到 26.9:1", en: "About 10.5:1 to 26.9:1" },
    typical: { zh: "8 kHz / 16-bit / 单声道：128 → 4.75-12.2 kbps", en: "8 kHz / 16-bit / mono: 128 → 4.75-12.2 kbps" },
    note: { zh: "语音专用，保可懂度，不适合音乐保真。", en: "Speech specific; keeps intelligibility, not music fidelity." }
  },
  {
    codec: "ADPCM",
    ratio: { zh: "约 4:1", en: "About 4:1" },
    typical: { zh: "示例：16-bit PCM → 4-bit ADPCM，不计块头", en: "Example: 16-bit PCM → 4-bit ADPCM, excluding block headers" },
    note: { zh: "保存预测差分，实现简单，但压缩效率有限。", en: "Stores prediction differences; simple, but compression efficiency is limited." }
  }
] satisfies Array<{
  codec: string;
  note: Record<Language, string>;
  ratio: Record<Language, string>;
  typical: Record<Language, string>;
}>;

const sampleRateComparisonRows = [
  {
    rate: "8 kHz",
    bandwidth: { zh: "最高约 4 kHz", en: "Up to about 4 kHz" },
    quality: { zh: "窄带电话，能听懂但高频缺失明显。", en: "Narrowband telephony; intelligible but clearly missing high frequencies." },
    use: { zh: "传统电话、极低码率语音", en: "Legacy phone calls, very low-bitrate speech" }
  },
  {
    rate: "16 kHz",
    bandwidth: { zh: "最高约 8 kHz", en: "Up to about 8 kHz" },
    quality: { zh: "宽带语音，会议和 ASR 常用，清晰度明显好于 8 kHz。", en: "Wideband speech, common for meetings and ASR, clearly cleaner than 8 kHz." },
    use: { zh: "会议、语音识别、对讲", en: "Meetings, ASR, intercom" }
  },
  {
    rate: "44.1 kHz",
    bandwidth: { zh: "最高约 22.05 kHz", en: "Up to about 22.05 kHz" },
    quality: { zh: "覆盖人耳常见听觉范围，是音乐发行的经典规格。", en: "Covers common hearing range and is the classic music-delivery rate." },
    use: { zh: "音乐 CD、音乐文件", en: "Audio CDs, music files" }
  },
  {
    rate: "48 kHz",
    bandwidth: { zh: "最高约 24 kHz", en: "Up to about 24 kHz" },
    quality: { zh: "视频、直播、系统音频常用，和音视频同步生态更匹配。", en: "Common for video, livestreaming, and system audio; fits AV sync ecosystems." },
    use: { zh: "视频、直播、系统音频", en: "Video, livestreaming, system audio" }
  },
  {
    rate: "96 kHz",
    bandwidth: { zh: "最高约 48 kHz", en: "Up to about 48 kHz" },
    quality: { zh: "更多用于制作、处理余量和某些专业流程；不等于普通听音必然更好。", en: "More for production headroom and professional workflows; not automatically better for normal listening." },
    use: { zh: "录音制作、后期处理", en: "Recording, post-production" }
  }
] satisfies Array<{
  bandwidth: Record<Language, string>;
  quality: Record<Language, string>;
  rate: string;
  use: Record<Language, string>;
}>;

const encodePath = [
  { title: { zh: "PCM 输入", en: "PCM input" }, detail: { zh: "已经采样量化后的多声道样本。", en: "Already-sampled and quantized audio samples." } },
  { title: { zh: "分帧", en: "Framing" }, detail: { zh: "切成固定时长，建立时间边界。", en: "Split into fixed-duration frames." } },
  { title: { zh: "分析与建模", en: "Analysis and modeling" }, detail: { zh: "预测、变换或建立语音/听觉模型。", en: "Use prediction, transforms, or speech and hearing models." } },
  { title: { zh: "量化与码率控制", en: "Quantization and rate control" }, detail: { zh: "按目标质量和带宽分配比特。", en: "Allocate bits for target quality and bandwidth." } },
  { title: { zh: "码流 / 封装", en: "Bitstream / container" }, detail: { zh: "变成文件、网络包或蓝牙传输帧。", en: "Produce a file, network packet, or Bluetooth frame." } }
];

const decodePath = [
  { title: { zh: "码流输入", en: "Bitstream input" }, detail: { zh: "来自文件、网络、蓝牙或实时通信。", en: "From a file, network, Bluetooth, or live call." } },
  { title: { zh: "解包与解析", en: "Unpack and parse" }, detail: { zh: "取出编码帧和时间戳；丢包恢复取决于协议和编解码器。", en: "Extract frames and timestamps; loss recovery depends on the protocol and codec." } },
  { title: { zh: "反量化与合成", en: "Inverse quantization and synthesis" }, detail: { zh: "从模型参数重建频域或时域信号。", en: "Reconstruct frequency- or time-domain signals from model parameters." } },
  { title: { zh: "PCM 输出", en: "PCM output" }, detail: { zh: "交给系统音频栈、后处理或 DAC。", en: "Deliver to the system audio stack, post-processing, or DAC." } }
];

function CodecPath({ language, title, steps, tone }: { language: Language; title: string; steps: typeof encodePath; tone: "encode" | "decode" }) {
  return (
    <section className={`audio-codec-topic-path ${tone}`} aria-label={title}>
      <h3>{title}</h3>
      <ol>
        {steps.map((step, index) => (
          <li key={step.title.en}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div><strong>{step.title[language]}</strong><p>{step.detail[language]}</p></div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function AudioCodecPage({ relatedTopics, language, topic, onBack, onOpenLab, onOpenPrevious, onOpenNext }: AudioCodecPageProps) {
  const detail = topic.detail;
  const terms = detail.termExplanations ?? [];

  return (
    <main className="sound-topic-page audio-codec-topic-page" aria-labelledby="audio-codec-topic-title">
      <header className="sound-topic-hero">
        <button className="sound-topic-back" type="button" onClick={onBack}>
          <ArrowLeft size={17} aria-hidden="true" />
          {language === "zh" ? "返回知识库" : "Back to knowledge base"}
        </button>
        <div className="sound-topic-kicker">
          <BookOpen size={16} aria-hidden="true" />
          {language === "zh" ? "音频软件 · 编解码专题" : "Audio software · Codec deep dive"}
        </div>
        <h1 id="audio-codec-topic-title">{topic.title[language]}</h1>
        <p className="sound-topic-lede">{topic.summary[language]}</p>
        <div className="sound-topic-meta">
          <span>{language === "zh" ? "PCM 与码流" : "PCM and bitstreams"}</span>
          <span>{language === "zh" ? "质量与延迟" : "Quality and latency"}</span>
          <span>{language === "zh" ? "实验验证" : "Hands-on lab"}</span>
        </div>
      </header>

      <TopicReadingLayout language={language}>
        <section className="sound-topic-section sound-topic-intro">
          <div>
            <h2>{language === "zh" ? "先区分 PCM、码流和硬件 Codec" : "Separate PCM, bitstreams, and hardware codecs"}</h2>
            <p>
              {language === "zh" ? (
                <>
                  这里的 Codec 指<strong>压缩编解码算法</strong>，<strong>不是硬件章节中的音频 Codec 芯片</strong>。编码器接收已经采样量化后的 <strong>PCM</strong>，经过<strong>分帧、分析建模和压缩</strong>形成适合存储或传输的<strong>码流</strong>；播放或接收端再将码流<strong>解码回 PCM</strong>，交给系统音频栈、后处理或 DAC。
                </>
              ) : (
                <>
                  Here, codec means a <strong>compression algorithm</strong>, <strong>not the hardware audio codec chip</strong>. An encoder takes sampled and quantized <strong>PCM</strong>, then performs <strong>framing, analysis, modeling, and compression</strong> to produce a <strong>bitstream</strong> for storage or transport. The receiving side <strong>decodes it back to PCM</strong> for the system audio stack, post-processing, or DAC.
                </>
              )}
            </p>
          </div>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading">
            <div>
              <h2>{language === "zh" ? "编码和解码是两个方向" : "Encoding and decoding are two directions"}</h2>
              <p>{language === "zh" ? "编码把样本变成更适合存储或传输的表示，解码再把它交回播放链路。" : "Encoding turns samples into a representation suited to storage or transport; decoding returns it to the playback path."}</p>
            </div>
          </div>
          <div className="audio-codec-topic-path-grid">
            <CodecPath language={language} title={language === "zh" ? "编码：PCM → 码流" : "Encode: PCM → bitstream"} steps={encodePath} tone="encode" />
            <CodecPath language={language} title={language === "zh" ? "解码：码流 → PCM" : "Decode: bitstream → PCM"} steps={decodePath} tone="decode" />
          </div>
          <p className="sound-topic-note">
            {language === "zh"
              ? "以上是有损编码路径：量化会引入不可逆误差。FLAC 等无损编码以预测残差和熵编码等方式保留全部样本精度；解码可逐样本还原，不经过丢精度的量化。"
              : "The paths above describe lossy coding: quantization introduces irreversible error. Lossless codecs such as FLAC use prediction residuals and entropy coding to preserve sample precision and restore samples exactly."}
          </p>
        </section>

        <section className="sound-topic-section audio-codec-topic-lab-entry" aria-label={language === "zh" ? "音频编解码实验室入口" : "Audio codec lab entry"}>
          <div className="sound-topic-cta">
            <CircuitBoard size={22} aria-hidden="true" />
            <h2>{language === "zh" ? "进入音频编解码实验室" : "Open the audio codec lab"}</h2>
            <p>{language === "zh" ? "对照编码与解码流程，切换音乐、会议和蓝牙等场景，比较选型取舍。" : "Follow the encode/decode flows and switch music, meeting, and Bluetooth scenarios to compare trade-offs."}</p>
            <button className="diagram-open-button" type="button" onClick={onOpenLab}>
              {detail.lab?.buttonLabel[language]}
            </button>
          </div>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading">
            <div>
              <h2>{language === "zh" ? "核心判断" : "Core decisions"}</h2>
              <p>{language === "zh" ? "选 Codec 时同时看质量、码率、延迟、抗丢包和设备兼容性。" : "Choose a codec by quality, bitrate, latency, packet-loss resilience, and device compatibility."}</p>
            </div>
          </div>
          <div className="sound-topic-glossary audio-codec-topic-key-points">
            {detail.keyConcepts.map((concept) => <article key={concept.en}><p>{concept[language]}</p></article>)}
          </div>
        </section>

      <section className="sound-topic-section audio-codec-reference-tables" aria-label={language === "zh" ? "编码和采样率对比表" : "Codec and sample-rate comparison tables"}>
        <article className="audio-codec-reference-card">
          <div className="codec-mode-concepts-header">
            <h2>{language === "zh" ? "编码压缩率对比" : "Codec compression ratio comparison"}</h2>
            <span>{language === "zh" ? "压缩比 = 原 PCM 码率 / 编码码率；示例不计封装开销" : "Ratio = original PCM bitrate / encoded bitrate; examples exclude packaging overhead"}</span>
          </div>
          <div className="audio-codec-reference-table">
            <div className="audio-codec-reference-row header">
              <span>{language === "zh" ? "格式" : "Format"}</span>
              <span>{language === "zh" ? "压缩率" : "Ratio"}</span>
              <span>{language === "zh" ? "典型码率 / 大小" : "Typical bitrate / size"}</span>
              <span>{language === "zh" ? "说明" : "Note"}</span>
            </div>
            {compressionComparisonRows.map((row) => (
              <div className="audio-codec-reference-row" key={row.codec}>
                <strong>{row.codec}</strong>
                <span>{row.ratio[language]}</span>
                <span>{row.typical[language]}</span>
                <span>{row.note[language]}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="audio-codec-reference-card">
          <div className="codec-mode-concepts-header">
            <h2>{language === "zh" ? "采样率音质差异对比" : "Sample-rate quality comparison"}</h2>
            <span>{language === "zh" ? "Nyquist 上限约为采样率的一半" : "Nyquist limit is about half the sample rate"}</span>
          </div>
          <div className="audio-codec-reference-table sample-rate">
            <div className="audio-codec-reference-row header">
              <span>{language === "zh" ? "采样率" : "Sample rate"}</span>
              <span>{language === "zh" ? "可表示频率" : "Representable band"}</span>
              <span>{language === "zh" ? "听感差异" : "Listening difference"}</span>
              <span>{language === "zh" ? "典型用途" : "Typical use"}</span>
            </div>
            {sampleRateComparisonRows.map((row) => (
              <div className="audio-codec-reference-row" key={row.rate}>
                <strong>{row.rate}</strong>
                <span>{row.bandwidth[language]}</span>
                <span>{row.quality[language]}</span>
                <span>{row.use[language]}</span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="sound-topic-section audio-codec-comparison" aria-label={language === "zh" ? "音频编码格式对比" : "Audio codec comparison"}>
        <div className="codec-mode-concepts-header">
          <h2>{language === "zh" ? "格式对比" : "Codec comparison"}</h2>
          <span>{language === "zh" ? "按用途理解，而不是按名字背诵" : "Understand by use case, not by name alone"}</span>
        </div>
        <div className="audio-codec-table">
          {codecRows.map((row) => (
            <article key={row.name}>
              <div className="audio-codec-table-head">
                <h3>{row.name}</h3>
                <span>{row.family[language]}</span>
              </div>
              <dl>
                <div>
                  <dt>{language === "zh" ? "码率 / 压缩" : "Bitrate / compression"}</dt>
                  <dd>{row.bitrate[language]}</dd>
                </div>
                <div>
                  <dt>{language === "zh" ? "延迟" : "Latency"}</dt>
                  <dd>{row.latency[language]}</dd>
                </div>
                <div>
                  <dt>{language === "zh" ? "适合场景" : "Best fit"}</dt>
                  <dd>{row.scenario[language]}</dd>
                </div>
              </dl>
              <details className="codec-reading-details">
                <summary aria-label={language === "zh" ? `${row.name} 原理与示例` : `${row.name} principle and example`}>
                  {language === "zh" ? "原理与示例" : "Principle and example"}
                </summary>
                <dl>
                  <div>
                    <dt>{language === "zh" ? "通俗原理" : "Plain principle"}</dt>
                    <dd>{row.principle[language]}</dd>
                  </div>
                  <div>
                    <dt>{language === "zh" ? "简单例子" : "Simple example"}</dt>
                    <dd>{row.example[language]}</dd>
                  </div>
                </dl>
              </details>
            </article>
          ))}
        </div>
      </section>
        <section className="sound-topic-section">
          <div className="sound-topic-section-heading">
            <div>
              <h2>{language === "zh" ? "编解码术语" : "Codec terms"}</h2>
              <p>{language === "zh" ? "把帧长、封装和蓝牙 Codec 放回真实使用场景。" : "Place frame size, containers, and Bluetooth codecs back into real use cases."}</p>
            </div>
          </div>
          <div className="sound-topic-glossary">
            {terms.map((term) => <article key={term.name.en}><h3>{term.name[language]}</h3><p>{term.explanation[language]}</p></article>)}
          </div>
        </section>

        <section className="sound-topic-section">
          <div><h2>{language === "zh" ? "工程边界" : "Engineering boundary"}</h2><p>{detail.misconception[language]}</p></div>
        </section>
      </TopicReadingLayout>
      {relatedTopics}
      <TopicPager language={language} onBack={onBack} onPrevious={onOpenPrevious} onNext={onOpenNext} />
    </main>
  );
}
