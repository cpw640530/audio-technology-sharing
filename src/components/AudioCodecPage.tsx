import { traditional } from "../content/traditional";
import type { ReactNode } from "react";
import { TopicReadingLayout } from "./TopicReadingLayout";
import { ArrowLeft, BookOpen, CircuitBoard } from "lucide-react";
import type { Category, Language, LocalizedText, Topic } from "../content/knowledge";
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
  family: LocalizedText;
  bitrate: LocalizedText;
  latency: LocalizedText;
  principle: LocalizedText;
  example: LocalizedText;
  scenario: LocalizedText;
};

const codecRows = [
  {
    name: "PCM",
    family: { zh: "不压缩基准", "zh-Hant": traditional("不压缩基准"), en: "Uncompressed baseline", ja: "非圧縮の基準", ko: "비압축 기준" },
    bitrate: { zh: "约 1411 kbps / CD 双声道", "zh-Hant": traditional("约 1411 kbps / CD 双声道"), en: "about 1411 kbps / CD stereo", ja: "約 1411 kbps / CD ステレオ", ko: "약 1411 kbps / CD 스테레오" },
    latency: { zh: "极低", "zh-Hant": traditional("极低"), en: "Very low", ja: "非常に低い", ko: "매우 낮음" },
    principle: { zh: "通俗理解：像把原始录音直接逐点记下来，不猜、不省、不压缩。", "zh-Hant": traditional("通俗理解：像把原始录音直接逐点记下来，不猜、不省、不压缩。"), en: "Plainly: it writes down the original audio point by point, without guessing, skipping, or compressing.", ja: "平たく言えば、元の録音を推測も省略も圧縮もせず、各サンプルをそのまま記録する。", ko: "쉽게 말해 원본 녹음을 추측하거나 생략·압축하지 않고 각 샘플을 그대로 기록한다." },
    example: { zh: "例子：48 kHz / 16-bit / 双声道 PCM 每秒固定约 1536 kbps，安静片段和复杂音乐一样大。", "zh-Hant": traditional("例子：48 kHz / 16-bit / 双声道 PCM 每秒固定约 1536 kbps，安静片段和复杂音乐一样大。"), en: "Example: 48 kHz / 16-bit / stereo PCM is always about 1536 kbps, whether the audio is silence or dense music.", ja: "例：48 kHz / 16-bit / ステレオ PCM は毎秒約 1536 kbps で、無音でも密度の高い音楽でもサイズは変わらない。", ko: "예: 48 kHz / 16-bit / 스테레오 PCM은 무음이든 복잡한 음악이든 항상 초당 약 1536 kbps다." },
    scenario: { zh: "编辑、系统内部、短素材", "zh-Hant": traditional("编辑、系统内部、短素材"), en: "editing, system internals, short assets", ja: "編集、システム内部、短い素材", ko: "편집, 시스템 내부, 짧은 소스" }
  },
  {
    name: "FLAC",
    family: { zh: "无损压缩", "zh-Hant": traditional("无损压缩"), en: "Lossless compression", ja: "可逆圧縮", ko: "무손실 압축" },
    bitrate: { zh: "约为 PCM 的 40%-70%", "zh-Hant": traditional("约为 PCM 的 40%-70%"), en: "about 40%-70% of PCM", ja: "PCM の約 40%-70%", ko: "PCM의 약 40%-70%" },
    latency: { zh: "低到中", "zh-Hant": traditional("低到中"), en: "Low to medium", ja: "低〜中", ko: "낮음~중간" },
    principle: { zh: "通俗理解：先找波形里的重复规律，再把规律写短；解码后每个采样点还能还原回来。", "zh-Hant": traditional("通俗理解：先找波形里的重复规律，再把规律写短；解码后每个采样点还能还原回来。"), en: "Plainly: it finds repeated patterns in the waveform and writes them shorter; every sample can be restored exactly.", ja: "平たく言えば、波形の繰り返しを見つけて短く記録し、デコード後はすべてのサンプルを完全に復元できる。", ko: "쉽게 말해 파형의 반복 패턴을 찾아 짧게 기록하고, 디코딩 후 모든 샘플을 정확히 복원한다." },
    example: { zh: "例子：FLAC 像把重复规律写成公式，连续安静、稳定音符和相似片段会比 PCM 小很多。", "zh-Hant": traditional("例子：FLAC 像把重复规律写成公式，连续安静、稳定音符和相似片段会比 PCM 小很多。"), en: "Example: FLAC is like writing repeated patterns as formulas, so silence, steady notes, and similar passages become much smaller than PCM.", ja: "例：FLAC は繰り返しのパターンを式のように記録するため、無音や安定した音、似た区間は PCM より大幅に小さくなる。", ko: "예: FLAC은 반복 패턴을 공식처럼 기록하므로 무음, 일정한 음, 유사한 구간이 PCM보다 훨씬 작아진다." },
    scenario: { zh: "音乐归档、母带备份", "zh-Hant": traditional("音乐归档、母带备份"), en: "music archive, master backup", ja: "音楽アーカイブ、マスターのバックアップ", ko: "음악 보관, 마스터 백업" }
  },
  {
    name: "MP3",
    family: { zh: "有损音乐", "zh-Hant": traditional("有损音乐"), en: "Lossy music", ja: "非可逆音楽", ko: "손실 음악" },
    bitrate: { zh: "常见 128-320 kbps", "zh-Hant": traditional("常见 128-320 kbps"), en: "often 128-320 kbps", ja: "一般に 128-320 kbps", ko: "일반적으로 128-320 kbps" },
    latency: { zh: "中", "zh-Hant": traditional("中"), en: "Medium", ja: "中程度", ko: "중간" },
    principle: { zh: "通俗理解：先把声音拆成很多频率小格子，再把人耳不敏感、被大声音盖住的细节少记或不记。", "zh-Hant": traditional("通俗理解：先把声音拆成很多频率小格子，再把人耳不敏感、被大声音盖住的细节少记或不记。"), en: "Plainly: it splits sound into frequency bins, then spends fewer bits on details that are masked or hard to hear.", ja: "平たく言えば、音を多くの周波数ビンに分け、人の耳に敏感でない部分や大きな音に隠れる細部には少ないビットを割り当てる。", ko: "쉽게 말해 소리를 여러 주파수 빈으로 나눈 뒤, 사람이 덜 민감하거나 큰 소리에 가려지는 세부 정보에는 비트를 적게 쓴다." },
    example: { zh: "例子：16 kHz 采样率的 PCM 最高只到 8 kHz。MP3 不会固定砍掉某个频率，但低码率时会优先弱化接近 8 kHz、能量弱、被人声或乐器盖住的细节。", "zh-Hant": traditional("例子：16 kHz 采样率的 PCM 最高只到 8 kHz。MP3 不会固定砍掉某个频率，但低码率时会优先弱化接近 8 kHz、能量弱、被人声或乐器盖住的细节。"), en: "Example: 16 kHz PCM only reaches 8 kHz. MP3 does not cut a fixed frequency, but at low bitrate it may weaken details near 8 kHz when they are quiet or masked by voice or instruments.", ja: "例：16 kHz サンプリングの PCM は上限が 8 kHz。MP3 は特定の周波数を固定的に削るわけではないが、低ビットレートでは 8 kHz 付近の弱い音や、人声・楽器に隠れる細部を優先して弱めることがある。", ko: "예: 16 kHz 샘플링 PCM의 상한은 8 kHz다. MP3가 특정 주파수를 고정으로 자르는 것은 아니지만, 낮은 비트레이트에서는 8 kHz 부근의 약한 소리나 음성·악기에 가려지는 세부 정보를 우선 약화할 수 있다." },
    scenario: { zh: "兼容性优先的音乐文件", "zh-Hant": traditional("兼容性优先的音乐文件"), en: "music files where compatibility matters", ja: "互換性を優先する音楽ファイル", ko: "호환성을 우선하는 음악 파일" }
  },
  {
    name: "AAC",
    family: { zh: "有损音乐 / 视频", "zh-Hant": traditional("有损音乐 / 视频"), en: "Lossy music / video", ja: "非可逆音楽 / 動画", ko: "손실 음악 / 비디오" },
    bitrate: { zh: "常见 96-256 kbps", "zh-Hant": traditional("常见 96-256 kbps"), en: "often 96-256 kbps", ja: "一般に 96-256 kbps", ko: "일반적으로 96-256 kbps" },
    latency: { zh: "中", "zh-Hant": traditional("中"), en: "Medium", ja: "中程度", ko: "중간" },
    principle: { zh: "通俗理解：和 MP3 一样会按听感取舍，但工具更细，能用更少码率保留更多细节。", "zh-Hant": traditional("通俗理解：和 MP3 一样会按听感取舍，但工具更细，能用更少码率保留更多细节。"), en: "Plainly: like MP3, it makes hearing-based trade-offs, but with finer tools that preserve more detail at lower bitrate.", ja: "平たく言えば、MP3 と同じく聴感に基づいて取捨選択するが、より細かなツールで低いビットレートでも多くの細部を残せる。", ko: "쉽게 말해 MP3처럼 청감에 따라 정보를 선택하지만, 더 세밀한 도구로 낮은 비트레이트에서도 더 많은 세부 정보를 보존한다." },
    example: { zh: "例子：同样 128 kbps，AAC 通常比 MP3 更容易保住鼓镲、空气感和视频里的背景音乐。", "zh-Hant": traditional("例子：同样 128 kbps，AAC 通常比 MP3 更容易保住鼓镲、空气感和视频里的背景音乐。"), en: "Example: at the same 128 kbps, AAC often keeps cymbals, air, and video background music cleaner than MP3.", ja: "例：同じ 128 kbps なら、AAC は MP3 よりシンバルや空気感、動画の背景音楽をきれいに保ちやすい。", ko: "예: 같은 128 kbps라면 AAC가 MP3보다 심벌, 공간감, 동영상 배경 음악을 더 깨끗하게 보존하는 경우가 많다." },
    scenario: { zh: "在线视频、手机音乐、蓝牙 AAC", "zh-Hant": traditional("在线视频、手机音乐、蓝牙 AAC"), en: "online video, phone music, Bluetooth AAC", ja: "オンライン動画、スマートフォン音楽、Bluetooth AAC", ko: "온라인 동영상, 휴대폰 음악, Bluetooth AAC" }
  },
  {
    name: "Opus",
    family: { zh: "实时语音 / 音乐", "zh-Hant": traditional("实时语音 / 音乐"), en: "Real-time speech / music", ja: "リアルタイム音声 / 音楽", ko: "실시간 음성 / 음악" },
    bitrate: { zh: "约 16-256 kbps", "zh-Hant": traditional("约 16-256 kbps"), en: "about 16-256 kbps", ja: "約 16-256 kbps", ko: "약 16-256 kbps" },
    latency: { zh: "低", "zh-Hant": traditional("低"), en: "Low", ja: "低い", ko: "낮음" },
    principle: { zh: "通俗理解：会判断当前更像语音还是音乐，并尽量用很短的等待时间完成压缩。", "zh-Hant": traditional("通俗理解：会判断当前更像语音还是音乐，并尽量用很短的等待时间完成压缩。"), en: "Plainly: it can treat content more like speech or music while keeping the wait time short.", ja: "平たく言えば、現在の内容が音声寄りか音楽寄りかを判断し、待ち時間をできるだけ短くして圧縮する。", ko: "쉽게 말해 현재 콘텐츠가 음성에 가까운지 음악에 가까운지 판단하면서 대기 시간을 짧게 유지한다." },
    example: { zh: "例子：Opus 在网络变差时可以降低码率，先保证人声不断，再牺牲一点音乐细节。", "zh-Hant": traditional("例子：Opus 在网络变差时可以降低码率，先保证人声不断，再牺牲一点音乐细节。"), en: "Example: Opus can lower bitrate when the network gets worse, keeping speech continuous before preserving music detail.", ja: "例：Opus はネットワーク状態が悪化するとビットレートを下げ、音楽の細部を少し犠牲にしても音声の連続性を優先できる。", ko: "예: Opus는 네트워크가 나빠지면 비트레이트를 낮춰 음악의 세부 정보보다 음성이 끊기지 않는 것을 우선할 수 있다." },
    scenario: { zh: "语音会议、直播互动、游戏语音", "zh-Hant": traditional("语音会议、直播互动、游戏语音"), en: "meetings, interactive streaming, game chat", ja: "音声会議、ライブ配信の対話、ゲームボイスチャット", ko: "음성 회의, 양방향 라이브 스트리밍, 게임 음성 채팅" }
  },
  {
    name: "AMR",
    family: { zh: "语音专用", "zh-Hant": traditional("语音专用"), en: "Speech specific", ja: "音声専用", ko: "음성 전용" },
    bitrate: { zh: "约 4.75-23.85 kbps", "zh-Hant": traditional("约 4.75-23.85 kbps"), en: "about 4.75-23.85 kbps", ja: "約 4.75-23.85 kbps", ko: "약 4.75-23.85 kbps" },
    latency: { zh: "低到中", "zh-Hant": traditional("低到中"), en: "Low to medium", ja: "低〜中", ko: "낮음~중간" },
    principle: { zh: "通俗理解：不试图完整保存声音，而是保存“这句话怎么发出来”的人声参数。", "zh-Hant": traditional("通俗理解：不试图完整保存声音，而是保存“这句话怎么发出来”的人声参数。"), en: "Plainly: it does not preserve the whole sound; it stores speech parameters describing how the voice was produced.", ja: "平たく言えば、音全体を保存するのではなく、「この声がどのように発声されたか」を示す音声パラメータを保存する。", ko: "쉽게 말해 소리 전체를 보존하지 않고, ‘이 목소리가 어떻게 발성되었는지’를 나타내는 음성 파라미터를 저장한다." },
    example: { zh: "例子：AMR 可以用很低码率让电话里的人声还听得懂，但音乐会明显变窄、变薄。", "zh-Hant": traditional("例子：AMR 可以用很低码率让电话里的人声还听得懂，但音乐会明显变窄、变薄。"), en: "Example: AMR can keep phone speech understandable at very low bitrate, but music becomes narrow and thin.", ja: "例：AMR は非常に低いビットレートでも電話の音声を聞き取れるようにするが、音楽は明らかに狭く薄くなる。", ko: "예: AMR은 매우 낮은 비트레이트에서도 전화 음성을 알아들을 수 있게 하지만, 음악은 눈에 띄게 좁고 얇게 들린다." },
    scenario: { zh: "蜂窝语音、窄带或宽带通话", "zh-Hant": traditional("蜂窝语音、窄带或宽带通话"), en: "cellular voice, narrowband or wideband calls", ja: "携帯電話の音声、狭帯域または広帯域通話", ko: "이동통신 음성, 협대역 또는 광대역 통화" }
  },
  {
    name: "LC3",
    family: { zh: "低功耗蓝牙 / 通信", "zh-Hant": traditional("低功耗蓝牙 / 通信"), en: "LE Audio / communication", ja: "低消費電力 Bluetooth / 通信", ko: "저전력 Bluetooth / 통신" },
    bitrate: { zh: "约 16-345 kbps", "zh-Hant": traditional("约 16-345 kbps"), en: "about 16-345 kbps", ja: "約 16-345 kbps", ko: "약 16-345 kbps" },
    latency: { zh: "低", "zh-Hant": traditional("低"), en: "Low", ja: "低い", ko: "낮음" },
    principle: { zh: "通俗理解：为新一代低功耗蓝牙设计，在省电、稳定和音质之间找平衡。", "zh-Hant": traditional("通俗理解：为新一代低功耗蓝牙设计，在省电、稳定和音质之间找平衡。"), en: "Plainly: it is designed for modern low-power Bluetooth, balancing battery, stability, and quality.", ja: "平たく言えば、新しい低消費電力 Bluetooth 向けに設計され、電池持ち、安定性、音質のバランスを取る。", ko: "쉽게 말해 최신 저전력 Bluetooth를 위해 설계되어 배터리, 안정성, 음질 사이의 균형을 맞춘다." },
    example: { zh: "例子：LC3 可以在较低码率下维持通话清晰度，适合耳机、助听器和广播音频。", "zh-Hant": traditional("例子：LC3 可以在较低码率下维持通话清晰度，适合耳机、助听器和广播音频。"), en: "Example: LC3 can keep calls clear at lower bitrate, fitting earbuds, hearing aids, and broadcast audio.", ja: "例：LC3 は低いビットレートでも通話の明瞭さを保ちやすく、イヤホン、補聴器、ブロードキャスト音声に適する。", ko: "예: LC3는 낮은 비트레이트에서도 통화 명료도를 유지하기 쉬워 이어버드, 보청기, 방송 오디오에 적합하다." },
    scenario: { zh: "蓝牙 LE 耳机、助听、广播音频", "zh-Hant": traditional("蓝牙 LE 耳机、助听、广播音频"), en: "LE headsets, hearing aids, broadcast audio", ja: "Bluetooth LE イヤホン、補聴器、ブロードキャスト音声", ko: "Bluetooth LE 헤드셋, 보청기, 방송 오디오" }
  },
  {
    name: "SBC",
    family: { zh: "蓝牙基础", "zh-Hant": traditional("蓝牙基础"), en: "Bluetooth baseline", ja: "Bluetooth の基本", ko: "블루투스 기본" },
    bitrate: { zh: "常见 192-345 kbps", "zh-Hant": traditional("常见 192-345 kbps"), en: "often 192-345 kbps", ja: "一般に 192-345 kbps", ko: "일반적으로 192-345 kbps" },
    latency: { zh: "中到高", "zh-Hant": traditional("中到高"), en: "Medium to high", ja: "中〜高", ko: "중간~높음" },
    principle: { zh: "通俗理解：把声音分成几个粗频段，再给每段分配比特；做法稳妥但不算特别省。", "zh-Hant": traditional("通俗理解：把声音分成几个粗频段，再给每段分配比特；做法稳妥但不算特别省。"), en: "Plainly: it splits sound into coarse bands and assigns bits to each; reliable but not especially efficient.", ja: "平たく言えば、音をいくつかの粗い帯域に分けて各帯域にビットを割り当てる。安定しているが、特に効率が高いわけではない。", ko: "쉽게 말해 소리를 몇 개의 거친 대역으로 나누고 각 대역에 비트를 배분한다. 안정적이지만 특별히 효율적이지는 않다." },
    example: { zh: "例子：SBC 像蓝牙耳机的保底方案，两端大多能用，但同码率下细节通常不如 AAC、LDAC 或 LC3。", "zh-Hant": traditional("例子：SBC 像蓝牙耳机的保底方案，两端大多能用，但同码率下细节通常不如 AAC、LDAC 或 LC3。"), en: "Example: SBC is the fallback for Bluetooth headsets: widely usable, but usually less detailed than AAC, LDAC, or LC3 at similar bitrate.", ja: "例：SBC は Bluetooth イヤホンの標準的な保険で、多くの機器で使える一方、同じビットレートなら通常は AAC、LDAC、LC3 より細部が少ない。", ko: "예: SBC는 블루투스 헤드셋의 기본 대안으로 대부분의 기기에서 쓸 수 있지만, 같은 비트레이트에서는 보통 AAC, LDAC, LC3보다 세부 표현이 부족하다." },
    scenario: { zh: "A2DP 默认兼容模式", "zh-Hant": traditional("A2DP 默认兼容模式"), en: "default compatible A2DP mode", ja: "A2DP の標準互換モード", ko: "A2DP 기본 호환 모드" }
  },
  {
    name: "aptX",
    family: { zh: "蓝牙有损", "zh-Hant": traditional("蓝牙有损"), en: "Bluetooth lossy", ja: "Bluetooth 非可逆", ko: "블루투스 손실" },
    bitrate: { zh: "经典 aptX：352.8 / 384 kbps", "zh-Hant": traditional("经典 aptX：352.8 / 384 kbps"), en: "Classic aptX: 352.8 / 384 kbps", ja: "従来の aptX：352.8 / 384 kbps", ko: "클래식 aptX: 352.8 / 384 kbps" },
    latency: { zh: "中，低延迟版本更低", "zh-Hant": traditional("中，低延迟版本更低"), en: "Medium, lower with low-latency variants", ja: "中程度、低遅延版ではより低い", ko: "중간, 저지연 버전은 더 낮음" },
    principle: { zh: "通俗理解：不直接记完整波形，而是记相邻采样之间怎么变，计算量相对可控。", "zh-Hant": traditional("通俗理解：不直接记完整波形，而是记相邻采样之间怎么变，计算量相对可控。"), en: "Plainly: it stores how samples change from one to the next rather than storing the full waveform directly.", ja: "平たく言えば、完全な波形を直接記録せず、隣り合うサンプルの変化を記録するため、計算量を比較的抑えられる。", ko: "쉽게 말해 전체 파형을 직접 저장하지 않고 인접 샘플 사이의 변화량을 저장해 계산량을 비교적 낮게 유지한다." },
    example: { zh: "例子：aptX 需要手机和耳机都支持；如果任一端不支持，通常会退回 SBC 或其他公共格式。", "zh-Hant": traditional("例子：aptX 需要手机和耳机都支持；如果任一端不支持，通常会退回 SBC 或其他公共格式。"), en: "Example: aptX needs support on both phone and headset; otherwise it usually falls back to SBC or another common format.", ja: "例：aptX はスマートフォンとイヤホンの両方が対応している必要があり、どちらかが非対応なら通常は SBC などの共通形式に戻る。", ko: "예: aptX는 휴대폰과 헤드셋 양쪽이 지원해야 하며, 한쪽이라도 지원하지 않으면 보통 SBC 같은 공통 형식으로 돌아간다." },
    scenario: { zh: "兼容设备间的蓝牙音乐", "zh-Hant": traditional("兼容设备间的蓝牙音乐"), en: "Bluetooth music between compatible devices", ja: "対応機器間の Bluetooth 音楽", ko: "호환 기기 사이의 블루투스 음악" }
  },
  {
    name: "LDAC",
    family: { zh: "高码率蓝牙", "zh-Hant": traditional("高码率蓝牙"), en: "High-bitrate Bluetooth", ja: "高ビットレート Bluetooth", ko: "고비트레이트 Bluetooth" },
    bitrate: { zh: "330 / 660 / 990 kbps", "zh-Hant": traditional("330 / 660 / 990 kbps"), en: "330 / 660 / 990 kbps", ja: "330 / 660 / 990 kbps", ko: "330 / 660 / 990 kbps" },
    latency: { zh: "中到高", "zh-Hant": traditional("中到高"), en: "Medium to high", ja: "中〜高", ko: "중간~높음" },
    principle: { zh: "通俗理解：尽量给蓝牙音频更大的数据通道，让压缩少一点，但无线条件要跟得上。", "zh-Hant": traditional("通俗理解：尽量给蓝牙音频更大的数据通道，让压缩少一点，但无线条件要跟得上。"), en: "Plainly: it gives Bluetooth audio a larger data pipe so compression can be gentler, but the radio link must keep up.", ja: "平たく言えば、Bluetooth 音声に広いデータ帯域を与えて圧縮を穏やかにするが、無線リンクがそれに追随できなければならない。", ko: "쉽게 말해 Bluetooth 오디오에 더 넓은 데이터 통로를 제공해 압축을 줄이지만, 무선 링크가 이를 따라줘야 한다." },
    example: { zh: "例子：LDAC 990 kbps 更像走更宽的无线通道，近距离稳定时细节更多，干扰大时可能切到 660 或 330 kbps。", "zh-Hant": traditional("例子：LDAC 990 kbps 更像走更宽的无线通道，近距离稳定时细节更多，干扰大时可能切到 660 或 330 kbps。"), en: "Example: LDAC 990 kbps is like using a wider wireless lane; it can keep more detail nearby, but may drop to 660 or 330 kbps under interference.", ja: "例：LDAC 990 kbps は広い無線通路を使うようなもので、近距離で安定していれば細部を多く保てるが、干渉が大きいと 660 または 330 kbps に下がることがある。", ko: "예: LDAC 990 kbps는 더 넓은 무선 통로를 사용하는 것과 같아 가까운 거리에서 안정적이면 세부 정보를 더 보존하지만, 간섭이 크면 660 또는 330 kbps로 낮아질 수 있다." },
    scenario: { zh: "稳定近距离的高码率蓝牙听音", "zh-Hant": traditional("稳定近距离的高码率蓝牙听音"), en: "stable close-range high-bitrate Bluetooth listening", ja: "近距離で安定した高ビットレート Bluetooth 再生", ko: "가까운 거리에서 안정적인 고비트레이트 블루투스 재생" }
  }
] satisfies CodecRow[];

const compressionComparisonRows = [
  {
    codec: "PCM / PCM WAV",
    ratio: { zh: "约 1:1", "zh-Hant": traditional("约 1:1"), en: "About 1:1", ja: "約 1:1", ko: "약 1:1" },
    typical: { zh: "48 kHz / 16-bit / 双声道约 1536 kbps", "zh-Hant": traditional("48 kHz / 16-bit / 双声道约 1536 kbps"), en: "48 kHz / 16-bit / stereo is about 1536 kbps", ja: "48 kHz / 16-bit / ステレオは約 1536 kbps", ko: "48 kHz / 16-bit / 스테레오는 약 1536 kbps" },
    note: { zh: "此处特指 WAV 内装 PCM；WAV 是容器，也可装其他编码。", "zh-Hant": traditional("此处特指 WAV 内装 PCM；WAV 是容器，也可装其他编码。"), en: "This row means PCM in WAV; WAV is a container and can carry other codecs.", ja: "この行は WAV に入った PCM を指す。WAV はコンテナで、他のコーデックも格納できる。", ko: "이 행은 WAV 안의 PCM을 뜻한다. WAV는 컨테이너이며 다른 코덱도 담을 수 있다." }
  },
  {
    codec: "FLAC",
    ratio: { zh: "约 1.4:1 到 2.5:1", "zh-Hant": traditional("约 1.4:1 到 2.5:1"), en: "About 1.4:1 to 2.5:1", ja: "約 1.4:1〜2.5:1", ko: "약 1.4:1~2.5:1" },
    typical: { zh: "通常为 PCM 的 40%-70%", "zh-Hant": traditional("通常为 PCM 的 40%-70%"), en: "Often 40%-70% of PCM size", ja: "通常は PCM サイズの 40%-70%", ko: "일반적으로 PCM 크기의 40%-70%" },
    note: { zh: "无损，解码后每个采样点应和原始 PCM 一致。", "zh-Hant": traditional("无损，解码后每个采样点应和原始 PCM 一致。"), en: "Lossless; decoded samples should match the original PCM.", ja: "可逆で、デコード後の各サンプルは元の PCM と一致する。", ko: "무손실이므로 디코딩 후 각 샘플은 원본 PCM과 일치해야 한다." }
  },
  {
    codec: "MP3 / AAC",
    ratio: { zh: "约 4.8:1 到 16:1", "zh-Hant": traditional("约 4.8:1 到 16:1"), en: "About 4.8:1 to 16:1", ja: "約 4.8:1〜16:1", ko: "약 4.8:1~16:1" },
    typical: { zh: "48 kHz / 16-bit / 双声道：1536 → 96-320 kbps", "zh-Hant": traditional("48 kHz / 16-bit / 双声道：1536 → 96-320 kbps"), en: "48 kHz / 16-bit / stereo: 1536 → 96-320 kbps", ja: "48 kHz / 16-bit / ステレオ：1536 → 96-320 kbps", ko: "48 kHz / 16-bit / 스테레오: 1536 → 96-320 kbps" },
    note: { zh: "有损，依靠听觉掩蔽分配比特；低码率更容易损失高频细节。", "zh-Hant": traditional("有损，依靠听觉掩蔽分配比特；低码率更容易损失高频细节。"), en: "Lossy; uses auditory masking for bit allocation, and low bitrate more easily loses treble detail.", ja: "非可逆で、聴覚マスキングに基づいてビットを配分する。低ビットレートほど高域の細部を失いやすい。", ko: "손실 방식으로 청각 마스킹을 이용해 비트를 배분하며, 낮은 비트레이트일수록 고역 세부 정보가 쉽게 손실된다." }
  },
  {
    codec: "Opus",
    ratio: { zh: "示例 4:1 到 16:1", "zh-Hant": traditional("示例 4:1 到 16:1"), en: "Example: 4:1 to 16:1", ja: "例：4:1〜16:1", ko: "예: 4:1~16:1" },
    typical: { zh: "16 kHz / 16-bit / 单声道：256 → 16-64 kbps", "zh-Hant": traditional("16 kHz / 16-bit / 单声道：256 → 16-64 kbps"), en: "16 kHz / 16-bit / mono: 256 → 16-64 kbps", ja: "16 kHz / 16-bit / モノラル：256 → 16-64 kbps", ko: "16 kHz / 16-bit / 모노: 256 → 16-64 kbps" },
    note: { zh: "这是指定输入格式的语音例子，不是编码器固定压缩比。", "zh-Hant": traditional("这是指定输入格式的语音例子，不是编码器固定压缩比。"), en: "A voice example with a specified input format, not a fixed codec ratio.", ja: "指定した入力形式による音声の例であり、エンコーダーの固定圧縮率ではない。", ko: "지정된 입력 형식의 음성 예시일 뿐, 인코더의 고정 압축비는 아니다." }
  },
  {
    codec: "LC3",
    ratio: { zh: "示例 8:1", "zh-Hant": traditional("示例 8:1"), en: "Example: 8:1", ja: "例：8:1", ko: "예: 8:1" },
    typical: { zh: "16 kHz / 16-bit / 单声道：256 → 32 kbps", "zh-Hant": traditional("16 kHz / 16-bit / 单声道：256 → 32 kbps"), en: "16 kHz / 16-bit / mono: 256 → 32 kbps", ja: "16 kHz / 16-bit / モノラル：256 → 32 kbps", ko: "16 kHz / 16-bit / 모노: 256 → 32 kbps" },
    note: { zh: "LE Audio 的一个语音配置示例；实际按采样率、帧长和每帧字节数协商。", "zh-Hant": traditional("LE Audio 的一个语音配置示例；实际按采样率、帧长和每帧字节数协商。"), en: "One LE Audio speech configuration; actual operation negotiates sample rate, frame duration, and bytes per frame.", ja: "LE Audio の音声設定の一例。実際の動作では、サンプリングレート、フレーム長、1 フレームあたりのバイト数を交渉する。", ko: "LE Audio 음성 구성의 한 예시다. 실제 동작에서는 샘플링 레이트, 프레임 길이, 프레임당 바이트 수를 협상한다." }
  },
  {
    codec: "AMR-NB",
    ratio: { zh: "约 10.5:1 到 26.9:1", "zh-Hant": traditional("约 10.5:1 到 26.9:1"), en: "About 10.5:1 to 26.9:1", ja: "約 10.5:1〜26.9:1", ko: "약 10.5:1~26.9:1" },
    typical: { zh: "8 kHz / 16-bit / 单声道：128 → 4.75-12.2 kbps", "zh-Hant": traditional("8 kHz / 16-bit / 单声道：128 → 4.75-12.2 kbps"), en: "8 kHz / 16-bit / mono: 128 → 4.75-12.2 kbps", ja: "8 kHz / 16-bit / モノラル：128 → 4.75-12.2 kbps", ko: "8 kHz / 16-bit / 모노: 128 → 4.75-12.2 kbps" },
    note: { zh: "语音专用，保可懂度，不适合音乐保真。", "zh-Hant": traditional("语音专用，保可懂度，不适合音乐保真。"), en: "Speech specific; keeps intelligibility, not music fidelity.", ja: "音声専用で、聞き取りやすさを保つが、音楽の忠実度には向かない。", ko: "음성 전용으로 명료도를 유지하지만 음악의 충실도에는 적합하지 않다." }
  },
  {
    codec: "ADPCM",
    ratio: { zh: "约 4:1", "zh-Hant": traditional("约 4:1"), en: "About 4:1", ja: "約 4:1", ko: "약 4:1" },
    typical: { zh: "示例：16-bit PCM → 4-bit ADPCM，不计块头", "zh-Hant": traditional("示例：16-bit PCM → 4-bit ADPCM，不计块头"), en: "Example: 16-bit PCM → 4-bit ADPCM, excluding block headers", ja: "例：16-bit PCM → 4-bit ADPCM、ブロックヘッダーを除く", ko: "예: 16-bit PCM → 4-bit ADPCM, 블록 헤더 제외" },
    note: { zh: "保存预测差分，实现简单，但压缩效率有限。", "zh-Hant": traditional("保存预测差分，实现简单，但压缩效率有限。"), en: "Stores prediction differences; simple, but compression efficiency is limited.", ja: "予測差分を保存するため実装は簡単だが、圧縮効率には限界がある。", ko: "예측 차분을 저장하므로 구현은 간단하지만 압축 효율에는 한계가 있다." }
  }
] satisfies Array<{
  codec: string;
  note: LocalizedText;
  ratio: LocalizedText;
  typical: LocalizedText;
}>;

const sampleRateComparisonRows = [
  {
    rate: "8 kHz",
    bandwidth: { zh: "最高约 4 kHz", "zh-Hant": traditional("最高约 4 kHz"), en: "Up to about 4 kHz", ja: "上限は約 4 kHz", ko: "최대 약 4 kHz" },
    quality: { zh: "窄带电话，能听懂但高频缺失明显。", "zh-Hant": traditional("窄带电话，能听懂但高频缺失明显。"), en: "Narrowband telephony; intelligible but clearly missing high frequencies.", ja: "狭帯域通話。聞き取りはできるが、高域の欠落が明らか。", ko: "협대역 전화로 알아들을 수 있지만 고역 손실이 뚜렷하다." },
    use: { zh: "传统电话、极低码率语音", "zh-Hant": traditional("传统电话、极低码率语音"), en: "Legacy phone calls, very low-bitrate speech", ja: "従来型電話、超低ビットレート音声", ko: "기존 전화, 초저비트레이트 음성" }
  },
  {
    rate: "16 kHz",
    bandwidth: { zh: "最高约 8 kHz", "zh-Hant": traditional("最高约 8 kHz"), en: "Up to about 8 kHz", ja: "上限は約 8 kHz", ko: "최대 약 8 kHz" },
    quality: { zh: "宽带语音，会议和 ASR 常用，清晰度明显好于 8 kHz。", "zh-Hant": traditional("宽带语音，会议和 ASR 常用，清晰度明显好于 8 kHz。"), en: "Wideband speech, common for meetings and ASR, clearly cleaner than 8 kHz.", ja: "広帯域音声。会議や ASR でよく使われ、8 kHz より明らかにクリア。", ko: "광대역 음성으로 회의와 ASR에 자주 쓰이며 8 kHz보다 훨씬 선명하다." },
    use: { zh: "会议、语音识别、对讲", "zh-Hant": traditional("会议、语音识别、对讲"), en: "Meetings, ASR, intercom", ja: "会議、ASR、インターホン", ko: "회의, ASR, 인터컴" }
  },
  {
    rate: "44.1 kHz",
    bandwidth: { zh: "最高约 22.05 kHz", "zh-Hant": traditional("最高约 22.05 kHz"), en: "Up to about 22.05 kHz", ja: "上限は約 22.05 kHz", ko: "최대 약 22.05 kHz" },
    quality: { zh: "覆盖人耳常见听觉范围，是音乐发行的经典规格。", "zh-Hant": traditional("覆盖人耳常见听觉范围，是音乐发行的经典规格。"), en: "Covers common hearing range and is the classic music-delivery rate.", ja: "人間の一般的な可聴域をカバーし、音楽配信用の代表的な仕様。", ko: "사람의 일반적인 가청 대역을 아우르며 음악 배포의 대표적인 규격이다." },
    use: { zh: "音乐 CD、音乐文件", "zh-Hant": traditional("音乐 CD、音乐文件"), en: "Audio CDs, music files", ja: "音楽 CD、音楽ファイル", ko: "음악 CD, 음악 파일" }
  },
  {
    rate: "48 kHz",
    bandwidth: { zh: "最高约 24 kHz", "zh-Hant": traditional("最高约 24 kHz"), en: "Up to about 24 kHz", ja: "上限は約 24 kHz", ko: "최대 약 24 kHz" },
    quality: { zh: "视频、直播、系统音频常用，和音视频同步生态更匹配。", "zh-Hant": traditional("视频、直播、系统音频常用，和音视频同步生态更匹配。"), en: "Common for video, livestreaming, and system audio; fits AV sync ecosystems.", ja: "動画、ライブ配信、システム音声でよく使われ、AV 同期の環境に合わせやすい。", ko: "동영상, 라이브 스트리밍, 시스템 오디오에 흔히 쓰이며 AV 동기화 환경에 잘 맞는다." },
    use: { zh: "视频、直播、系统音频", "zh-Hant": traditional("视频、直播、系统音频"), en: "Video, livestreaming, system audio", ja: "動画、ライブ配信、システム音声", ko: "동영상, 라이브 스트리밍, 시스템 오디오" }
  },
  {
    rate: "96 kHz",
    bandwidth: { zh: "最高约 48 kHz", "zh-Hant": traditional("最高约 48 kHz"), en: "Up to about 48 kHz", ja: "上限は約 48 kHz", ko: "최대 약 48 kHz" },
    quality: { zh: "更多用于制作、处理余量和某些专业流程；不等于普通听音必然更好。", "zh-Hant": traditional("更多用于制作、处理余量和某些专业流程；不等于普通听音必然更好。"), en: "More for production headroom and professional workflows; not automatically better for normal listening.", ja: "制作時の余裕や専門的なワークフローで使われることが多く、通常の聴取で必ずしも良くなるわけではない。", ko: "제작 여유와 전문 작업 흐름에 더 많이 쓰이며, 일반적인 청취에서 반드시 더 좋은 것은 아니다." },
    use: { zh: "录音制作、后期处理", "zh-Hant": traditional("录音制作、后期处理"), en: "Recording, post-production", ja: "録音制作、ポストプロダクション", ko: "녹음 제작, 후반 작업" }
  }
] satisfies Array<{
  bandwidth: LocalizedText;
  quality: LocalizedText;
  rate: string;
  use: LocalizedText;
}>;

const encodePath = [
  { title: { zh: "PCM 输入", "zh-Hant": traditional("PCM 输入"), en: "PCM input", ja: "PCM 入力", ko: "PCM 입력" }, detail: { zh: "已经采样量化后的多声道样本。", "zh-Hant": traditional("已经采样量化后的多声道样本。"), en: "Already-sampled and quantized audio samples.", ja: "サンプリングと量子化が済んだマルチチャンネルのサンプル。", ko: "이미 샘플링 및 양자화된 다채널 샘플." } },
  { title: { zh: "分帧", "zh-Hant": traditional("分帧"), en: "Framing", ja: "フレーム化", ko: "프레이밍" }, detail: { zh: "切成固定时长，建立时间边界。", "zh-Hant": traditional("切成固定时长，建立时间边界。"), en: "Split into fixed-duration frames.", ja: "固定長に分割して時間境界を作る。", ko: "고정된 길이로 나누어 시간 경계를 만든다." } },
  { title: { zh: "分析与建模", "zh-Hant": traditional("分析与建模"), en: "Analysis and modeling", ja: "解析とモデル化", ko: "분석 및 모델링" }, detail: { zh: "预测、变换或建立语音/听觉模型。", "zh-Hant": traditional("预测、变换或建立语音/听觉模型。"), en: "Use prediction, transforms, or speech and hearing models.", ja: "予測や変換を行い、音声・聴覚モデルを構築する。", ko: "예측, 변환을 수행하거나 음성·청각 모델을 만든다." } },
  { title: { zh: "量化与码率控制", "zh-Hant": traditional("量化与码率控制"), en: "Quantization and rate control", ja: "量子化とレート制御", ko: "양자화 및 비트레이트 제어" }, detail: { zh: "按目标质量和带宽分配比特。", "zh-Hant": traditional("按目标质量和带宽分配比特。"), en: "Allocate bits for target quality and bandwidth.", ja: "目標の品質と帯域幅に応じてビットを配分する。", ko: "목표 품질과 대역폭에 맞춰 비트를 배분한다." } },
  { title: { zh: "码流 / 封装", "zh-Hant": traditional("码流 / 封装"), en: "Bitstream / container", ja: "ビットストリーム / コンテナ", ko: "비트스트림 / 컨테이너" }, detail: { zh: "变成文件、网络包或蓝牙传输帧。", "zh-Hant": traditional("变成文件、网络包或蓝牙传输帧。"), en: "Produce a file, network packet, or Bluetooth frame.", ja: "ファイル、ネットワークパケット、Bluetooth 伝送フレームにする。", ko: "파일, 네트워크 패킷 또는 Bluetooth 전송 프레임으로 만든다." } }
];

const decodePath = [
  { title: { zh: "码流输入", "zh-Hant": traditional("码流输入"), en: "Bitstream input", ja: "ビットストリーム入力", ko: "비트스트림 입력" }, detail: { zh: "来自文件、网络、蓝牙或实时通信。", "zh-Hant": traditional("来自文件、网络、蓝牙或实时通信。"), en: "From a file, network, Bluetooth, or live call.", ja: "ファイル、ネットワーク、Bluetooth、リアルタイム通信から受け取る。", ko: "파일, 네트워크, Bluetooth 또는 실시간 통신에서 받는다." } },
  { title: { zh: "解包与解析", "zh-Hant": traditional("解包与解析"), en: "Unpack and parse", ja: "アンパックと解析", ko: "언패킹 및 파싱" }, detail: { zh: "取出编码帧和时间戳；丢包恢复取决于协议和编解码器。", "zh-Hant": traditional("取出编码帧和时间戳；丢包恢复取决于协议和编解码器。"), en: "Extract frames and timestamps; loss recovery depends on the protocol and codec.", ja: "符号化フレームとタイムスタンプを取り出す。パケット損失の復旧はプロトコルとコーデックに依存する。", ko: "인코딩 프레임과 타임스탬프를 꺼낸다. 패킷 손실 복구는 프로토콜과 코덱에 따라 달라진다." } },
  { title: { zh: "反量化与合成", "zh-Hant": traditional("反量化与合成"), en: "Inverse quantization and synthesis", ja: "逆量子化と合成", ko: "역양자화 및 합성" }, detail: { zh: "从模型参数重建频域或时域信号。", "zh-Hant": traditional("从模型参数重建频域或时域信号。"), en: "Reconstruct frequency- or time-domain signals from model parameters.", ja: "モデルパラメータから周波数領域または時間領域の信号を再構成する。", ko: "모델 파라미터에서 주파수 영역 또는 시간 영역 신호를 재구성한다." } },
  { title: { zh: "PCM 输出", "zh-Hant": traditional("PCM 输出"), en: "PCM output", ja: "PCM 出力", ko: "PCM 출력" }, detail: { zh: "交给系统音频栈、后处理或 DAC。", "zh-Hant": traditional("交给系统音频栈、后处理或 DAC。"), en: "Deliver to the system audio stack, post-processing, or DAC.", ja: "システムのオーディオスタック、後処理、DAC に渡す。", ko: "시스템 오디오 스택, 후처리 또는 DAC에 전달한다." } }
];

const pageCopy = {
  backToKnowledge: { zh: "返回知识库", "zh-Hant": traditional("返回知识库"), en: "Back to knowledge base", ja: "知識ベースに戻る", ko: "지식 베이스로 돌아가기" },
  kicker: { zh: "音频软件 · 编解码专题", "zh-Hant": traditional("音频软件 · 编解码专题"), en: "Audio software · Codec deep dive", ja: "オーディオソフトウェア · コーデック詳説", ko: "오디오 소프트웨어 · 코덱 심층 해설" },
  metaPcm: { zh: "PCM 与码流", "zh-Hant": traditional("PCM 与码流"), en: "PCM and bitstreams", ja: "PCM とビットストリーム", ko: "PCM 및 비트스트림" },
  metaQuality: { zh: "质量与延迟", "zh-Hant": traditional("质量与延迟"), en: "Quality and latency", ja: "品質と遅延", ko: "품질 및 지연" },
  metaLab: { zh: "实验验证", "zh-Hant": traditional("实验验证"), en: "Hands-on lab", ja: "実験で検証", ko: "실험으로 검증" },
  introHeading: { zh: "先区分 PCM、码流和硬件 Codec", "zh-Hant": traditional("先区分 PCM、码流和硬件 Codec"), en: "Separate PCM, bitstreams, and hardware codecs", ja: "まず PCM、ビットストリーム、ハードウェア Codec を区別する", ko: "먼저 PCM, 비트스트림, 하드웨어 Codec 구분하기" },
  directionHeading: { zh: "编码和解码是两个方向", "zh-Hant": traditional("编码和解码是两个方向"), en: "Encoding and decoding are two directions", ja: "符号化と復号は反対方向の処理", ko: "인코딩과 디코딩은 서로 반대 방향이다" },
  directionDescription: { zh: "编码把样本变成更适合存储或传输的表示，解码再把它交回播放链路。", "zh-Hant": traditional("编码把样本变成更适合存储或传输的表示，解码再把它交回播放链路。"), en: "Encoding turns samples into a representation suited to storage or transport; decoding returns it to the playback path.", ja: "符号化はサンプルを保存や伝送に適した表現へ変え、復号はそれを再生経路へ戻す。", ko: "인코딩은 샘플을 저장이나 전송에 맞는 표현으로 바꾸고, 디코딩은 이를 재생 경로로 돌려보낸다." },
  encodeTitle: { zh: "编码：PCM → 码流", "zh-Hant": traditional("编码：PCM → 码流"), en: "Encode: PCM → bitstream", ja: "符号化：PCM → ビットストリーム", ko: "인코딩: PCM → 비트스트림" },
  decodeTitle: { zh: "解码：码流 → PCM", "zh-Hant": traditional("解码：码流 → PCM"), en: "Decode: bitstream → PCM", ja: "復号：ビットストリーム → PCM", ko: "디코딩: 비트스트림 → PCM" },
  lossyNote: { zh: "以上是有损编码路径：量化会引入不可逆误差。FLAC 等无损编码以预测残差和熵编码等方式保留全部样本精度；解码可逐样本还原，不经过丢精度的量化。", "zh-Hant": traditional("以上是有损编码路径：量化会引入不可逆误差。FLAC 等无损编码以预测残差和熵编码等方式保留全部样本精度；解码可逐样本还原，不经过丢精度的量化。"), en: "The paths above describe lossy coding: quantization introduces irreversible error. Lossless codecs such as FLAC use prediction residuals and entropy coding to preserve sample precision and restore samples exactly.", ja: "上記は非可逆符号化の経路で、量子化によって不可逆な誤差が生じる。FLAC などの可逆コーデックは予測残差やエントロピー符号化によってサンプル精度を保ち、精度を失う量子化なしにサンプル単位で復元できる。", ko: "위 경로는 손실 인코딩의 흐름으로, 양자화가 되돌릴 수 없는 오차를 만든다. FLAC 같은 무손실 코덱은 예측 잔차와 엔트로피 코딩 등으로 샘플 정밀도를 보존하며, 정밀도를 버리는 양자화 없이 샘플 단위로 복원한다." },
  labAria: { zh: "音频编解码实验室入口", "zh-Hant": traditional("音频编解码实验室入口"), en: "Audio codec lab entry", ja: "オーディオコーデック実験室への入口", ko: "오디오 코덱 실험실 입구" },
  labHeading: { zh: "进入音频编解码实验室", "zh-Hant": traditional("进入音频编解码实验室"), en: "Open the audio codec lab", ja: "オーディオコーデック実験室を開く", ko: "오디오 코덱 실험실 열기" },
  labDescription: { zh: "对照编码与解码流程，切换音乐、会议和蓝牙等场景，比较选型取舍。", "zh-Hant": traditional("对照编码与解码流程，切换音乐、会议和蓝牙等场景，比较选型取舍。"), en: "Follow the encode/decode flows and switch music, meeting, and Bluetooth scenarios to compare trade-offs.", ja: "符号化と復号の流れを追い、音楽、会議、Bluetooth などのシナリオを切り替えて選択のトレードオフを比較する。", ko: "인코딩과 디코딩 흐름을 따라가며 음악, 회의, Bluetooth 등의 시나리오를 전환해 선택의 트레이드오프를 비교한다." },
  coreHeading: { zh: "核心判断", "zh-Hant": traditional("核心判断"), en: "Core decisions", ja: "中核となる判断", ko: "핵심 판단" },
  coreDescription: { zh: "选 Codec 时同时看质量、码率、延迟、抗丢包和设备兼容性。", "zh-Hant": traditional("选 Codec 时同时看质量、码率、延迟、抗丢包和设备兼容性。"), en: "Choose a codec by quality, bitrate, latency, packet-loss resilience, and device compatibility.", ja: "コーデックは品質、ビットレート、遅延、パケット損失への耐性、機器互換性を合わせて選ぶ。", ko: "코덱은 품질, 비트레이트, 지연, 패킷 손실 내성, 기기 호환성을 함께 보고 선택한다." },
  referenceAria: { zh: "编码和采样率对比表", "zh-Hant": traditional("编码和采样率对比表"), en: "Codec and sample-rate comparison tables", ja: "コーデックとサンプルレートの比較表", ko: "코덱 및 샘플링 레이트 비교표" },
  compressionHeading: { zh: "编码压缩率对比", "zh-Hant": traditional("编码压缩率对比"), en: "Codec compression ratio comparison", ja: "コーデック圧縮率の比較", ko: "코덱 압축비 비교" },
  compressionDescription: { zh: "压缩比 = 原 PCM 码率 / 编码码率；示例不计封装开销", "zh-Hant": traditional("压缩比 = 原 PCM 码率 / 编码码率；示例不计封装开销"), en: "Ratio = original PCM bitrate / encoded bitrate; examples exclude packaging overhead", ja: "圧縮率 = 元の PCM ビットレート / 符号化ビットレート。例ではコンテナのオーバーヘッドを除く", ko: "압축비 = 원본 PCM 비트레이트 / 인코딩 비트레이트. 예시는 패키징 오버헤드를 제외함" },
  format: { zh: "格式", "zh-Hant": traditional("格式"), en: "Format", ja: "形式", ko: "형식" },
  ratio: { zh: "压缩率", "zh-Hant": traditional("压缩率"), en: "Ratio", ja: "圧縮率", ko: "압축비" },
  typicalBitrate: { zh: "典型码率 / 大小", "zh-Hant": traditional("典型码率 / 大小"), en: "Typical bitrate / size", ja: "代表的なビットレート / サイズ", ko: "일반적인 비트레이트 / 크기" },
  note: { zh: "说明", "zh-Hant": traditional("说明"), en: "Note", ja: "注記", ko: "설명" },
  sampleHeading: { zh: "采样率音质差异对比", "zh-Hant": traditional("采样率音质差异对比"), en: "Sample-rate quality comparison", ja: "サンプルレートによる音質の比較", ko: "샘플링 레이트별 음질 비교" },
  nyquist: { zh: "Nyquist 上限约为采样率的一半", "zh-Hant": traditional("Nyquist 上限约为采样率的一半"), en: "Nyquist limit is about half the sample rate", ja: "Nyquist 上限はサンプルレートの約半分", ko: "Nyquist 상한은 샘플링 레이트의 약 절반" },
  sampleRate: { zh: "采样率", "zh-Hant": traditional("采样率"), en: "Sample rate", ja: "サンプルレート", ko: "샘플링 레이트" },
  frequencyBand: { zh: "可表示频率", "zh-Hant": traditional("可表示频率"), en: "Representable band", ja: "表現可能帯域", ko: "표현 가능한 대역" },
  listeningDifference: { zh: "听感差异", "zh-Hant": traditional("听感差异"), en: "Listening difference", ja: "聴感上の違い", ko: "청감 차이" },
  typicalUse: { zh: "典型用途", "zh-Hant": traditional("典型用途"), en: "Typical use", ja: "代表的な用途", ko: "일반적인 용도" },
  comparisonAria: { zh: "音频编码格式对比", "zh-Hant": traditional("音频编码格式对比"), en: "Audio codec comparison", ja: "オーディオコーデックの比較", ko: "오디오 코덱 비교" },
  comparisonHeading: { zh: "格式对比", "zh-Hant": traditional("格式对比"), en: "Codec comparison", ja: "コーデック比較", ko: "코덱 비교" },
  comparisonDescription: { zh: "按用途理解，而不是按名字背诵", "zh-Hant": traditional("按用途理解，而不是按名字背诵"), en: "Understand by use case, not by name alone", ja: "名前ではなく用途で理解する", ko: "이름이 아니라 용도로 이해하기" },
  bitrateCompression: { zh: "码率 / 压缩", "zh-Hant": traditional("码率 / 压缩"), en: "Bitrate / compression", ja: "ビットレート / 圧縮", ko: "비트레이트 / 압축" },
  latency: { zh: "延迟", "zh-Hant": traditional("延迟"), en: "Latency", ja: "遅延", ko: "지연" },
  bestFit: { zh: "适合场景", "zh-Hant": traditional("适合场景"), en: "Best fit", ja: "適した用途", ko: "적합한 용도" },
  principleExample: { zh: "原理与示例", "zh-Hant": traditional("原理与示例"), en: "Principle and example", ja: "原理と例", ko: "원리와 예시" },
  plainPrinciple: { zh: "通俗原理", "zh-Hant": traditional("通俗原理"), en: "Plain principle", ja: "わかりやすい原理", ko: "쉬운 원리" },
  simpleExample: { zh: "简单例子", "zh-Hant": traditional("简单例子"), en: "Simple example", ja: "簡単な例", ko: "간단한 예시" },
  termsHeading: { zh: "编解码术语", "zh-Hant": traditional("编解码术语"), en: "Codec terms", ja: "コーデック用語", ko: "코덱 용어" },
  termsDescription: { zh: "把帧长、封装和蓝牙 Codec 放回真实使用场景。", "zh-Hant": traditional("把帧长、封装和蓝牙 Codec 放回真实使用场景。"), en: "Place frame size, containers, and Bluetooth codecs back into real use cases.", ja: "フレーム長、コンテナ、Bluetooth コーデックを実際の用途に結び付ける。", ko: "프레임 길이, 컨테이너, Bluetooth 코덱을 실제 사용 상황에 연결한다." },
  engineeringBoundary: { zh: "工程边界", "zh-Hant": traditional("工程边界"), en: "Engineering boundary", ja: "技術上の境界", ko: "기술적 경계" }
} satisfies Record<string, LocalizedText>;

const introCopy: Record<Language, ReactNode> = {
  zh: <>这里的 Codec 指<strong>压缩编解码算法</strong>，<strong>不是硬件章节中的音频 Codec 芯片</strong>。编码器接收已经采样量化后的 <strong>PCM</strong>，经过<strong>分帧、分析建模和压缩</strong>形成适合存储或传输的<strong>码流</strong>；播放或接收端再将码流<strong>解码回 PCM</strong>，交给系统音频栈、后处理或 DAC。</>,
  "zh-Hant": <>這裡的 Codec 指<strong>壓縮編解碼算法</strong>，<strong>不是硬件章節中的音頻 Codec 芯片</strong>。編碼器接收已經採樣量化後的 <strong>PCM</strong>，經過<strong>分幀、分析建模和壓縮</strong>形成適合存儲或傳輸的<strong>碼流</strong>；播放或接收端再將碼流<strong>解碼回 PCM</strong>，交給系統音頻棧、後處理或 DAC。</>,
  en: <>Here, codec means a <strong>compression algorithm</strong>, <strong>not the hardware audio codec chip</strong>. An encoder takes sampled and quantized <strong>PCM</strong>, then performs <strong>framing, analysis, modeling, and compression</strong> to produce a <strong>bitstream</strong> for storage or transport. The receiving side <strong>decodes it back to PCM</strong> for the system audio stack, post-processing, or DAC.</>,
  ja: <>ここでいう Codec は<strong>圧縮コーデックアルゴリズム</strong>を指し、<strong>ハードウェア編のオーディオ Codec チップではない</strong>。エンコーダーはサンプリングと量子化が済んだ <strong>PCM</strong> を受け取り、<strong>フレーム化、解析、モデル化、圧縮</strong>を行って保存や伝送に適した<strong>ビットストリーム</strong>を作る。受信側はそれを<strong>PCM に復号</strong>し、システムのオーディオスタック、後処理、DAC に渡す。</>,
  ko: <>여기서 Codec은 <strong>압축 코덱 알고리즘</strong>을 뜻하며, <strong>하드웨어 장에서 다루는 오디오 Codec 칩이 아니다</strong>. 인코더는 샘플링과 양자화가 끝난 <strong>PCM</strong>을 받아 <strong>프레이밍, 분석, 모델링, 압축</strong>을 수행해 저장이나 전송에 적합한<strong>비트스트림</strong>을 만든다. 수신 측은 이를<strong>PCM으로 디코딩</strong>해 시스템 오디오 스택, 후처리 또는 DAC로 전달한다.</>
};

const principleExampleAria: Record<Language, (name: string) => string> = {
  zh: (name) => `${name} 原理与示例`, "zh-Hant": (name) => `${name} 原理與示例`,
  en: (name) => `${name} principle and example`,
  ja: (name) => `${name} の原理と例`,
  ko: (name) => `${name} 원리와 예시`
};

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
          {pageCopy.backToKnowledge[language]}
        </button>
        <div className="sound-topic-kicker">
          <BookOpen size={16} aria-hidden="true" />
          {pageCopy.kicker[language]}
        </div>
        <h1 id="audio-codec-topic-title">{topic.title[language]}</h1>
        <p className="sound-topic-lede">{topic.summary[language]}</p>
        <div className="sound-topic-meta">
          <span>{pageCopy.metaPcm[language]}</span>
          <span>{pageCopy.metaQuality[language]}</span>
          <span>{pageCopy.metaLab[language]}</span>
        </div>
      </header>

      <TopicReadingLayout language={language}>
        <section className="sound-topic-section sound-topic-intro">
          <div>
            <h2>{pageCopy.introHeading[language]}</h2>
            <p>{introCopy[language]}</p>
          </div>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading">
            <div>
              <h2>{pageCopy.directionHeading[language]}</h2>
              <p>{pageCopy.directionDescription[language]}</p>
            </div>
          </div>
          <div className="audio-codec-topic-path-grid">
            <CodecPath language={language} title={pageCopy.encodeTitle[language]} steps={encodePath} tone="encode" />
            <CodecPath language={language} title={pageCopy.decodeTitle[language]} steps={decodePath} tone="decode" />
          </div>
          <p className="sound-topic-note">
            {pageCopy.lossyNote[language]}
          </p>
        </section>

        <section className="sound-topic-section audio-codec-topic-lab-entry" aria-label={pageCopy.labAria[language]}>
          <div className="sound-topic-cta">
            <CircuitBoard size={22} aria-hidden="true" />
            <h2>{pageCopy.labHeading[language]}</h2>
            <p>{pageCopy.labDescription[language]}</p>
            <button className="diagram-open-button" type="button" onClick={onOpenLab}>
              {detail.lab?.buttonLabel[language]}
            </button>
          </div>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading">
            <div>
              <h2>{pageCopy.coreHeading[language]}</h2>
              <p>{pageCopy.coreDescription[language]}</p>
            </div>
          </div>
          <div className="sound-topic-glossary audio-codec-topic-key-points">
            {detail.keyConcepts.map((concept) => <article key={concept.en}><p>{concept[language]}</p></article>)}
          </div>
        </section>

      <section className="sound-topic-section audio-codec-reference-tables" aria-label={pageCopy.referenceAria[language]}>
        <article className="audio-codec-reference-card">
          <div className="codec-mode-concepts-header">
            <h2>{pageCopy.compressionHeading[language]}</h2>
            <span>{pageCopy.compressionDescription[language]}</span>
          </div>
          <div className="audio-codec-reference-table">
            <div className="audio-codec-reference-row header">
              <span>{pageCopy.format[language]}</span>
              <span>{pageCopy.ratio[language]}</span>
              <span>{pageCopy.typicalBitrate[language]}</span>
              <span>{pageCopy.note[language]}</span>
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
            <h2>{pageCopy.sampleHeading[language]}</h2>
            <span>{pageCopy.nyquist[language]}</span>
          </div>
          <div className="audio-codec-reference-table sample-rate">
            <div className="audio-codec-reference-row header">
              <span>{pageCopy.sampleRate[language]}</span>
              <span>{pageCopy.frequencyBand[language]}</span>
              <span>{pageCopy.listeningDifference[language]}</span>
              <span>{pageCopy.typicalUse[language]}</span>
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

      <section className="sound-topic-section audio-codec-comparison" aria-label={pageCopy.comparisonAria[language]}>
        <div className="codec-mode-concepts-header">
          <h2>{pageCopy.comparisonHeading[language]}</h2>
          <span>{pageCopy.comparisonDescription[language]}</span>
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
                  <dt>{pageCopy.bitrateCompression[language]}</dt>
                  <dd>{row.bitrate[language]}</dd>
                </div>
                <div>
                  <dt>{pageCopy.latency[language]}</dt>
                  <dd>{row.latency[language]}</dd>
                </div>
                <div>
                  <dt>{pageCopy.bestFit[language]}</dt>
                  <dd>{row.scenario[language]}</dd>
                </div>
              </dl>
              <details className="codec-reading-details">
                <summary aria-label={principleExampleAria[language](row.name)}>
                  {pageCopy.principleExample[language]}
                </summary>
                <dl>
                  <div>
                    <dt>{pageCopy.plainPrinciple[language]}</dt>
                    <dd>{row.principle[language]}</dd>
                  </div>
                  <div>
                    <dt>{pageCopy.simpleExample[language]}</dt>
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
              <h2>{pageCopy.termsHeading[language]}</h2>
              <p>{pageCopy.termsDescription[language]}</p>
            </div>
          </div>
          <div className="sound-topic-glossary">
            {terms.map((term) => <article key={term.name.en}><h3>{term.name[language]}</h3><p>{term.explanation[language]}</p></article>)}
          </div>
        </section>

        <section className="sound-topic-section">
          <div><h2>{pageCopy.engineeringBoundary[language]}</h2><p>{detail.misconception[language]}</p></div>
        </section>
      </TopicReadingLayout>
      {relatedTopics}
      <TopicPager language={language} onBack={onBack} onPrevious={onOpenPrevious} onNext={onOpenNext} />
    </main>
  );
}
