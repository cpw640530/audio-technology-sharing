import {
  Binary,
  BrainCircuit,
  Cpu,
  Headphones,
  RadioTower,
  SlidersHorizontal
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Language = "zh" | "en" | "ja" | "ko";

export type LocalizedText = Record<Language, string>;

export type TopicTerm = {
  name: LocalizedText;
  explanation: LocalizedText;
};

export type TopicDiagram = {
  type: "sound-wave";
  label: LocalizedText;
  caption: LocalizedText;
};

export type AiAudioMode = "asr" | "tts" | "generation" | "event" | "enhancement" | "codec";
export type AiAudioLabId = "overview" | AiAudioMode;

export type TopicLab = {
  type:
    | "sound-wave"
    | "audio-units"
    | "sampling-quantization"
    | "listening-metrics"
    | "microphone"
    | "codec-hardware"
    | "digital-interface"
    | "amplifier-speaker"
    | "system-audio"
    | "alsa"
    | "audio-codec"
    | "realtime-audio"
    | "core-signal-processing"
    | "speech-enhancement"
    | "spatial-audio"
    | "meeting-communication"
    | "automotive-audio"
    | "robot-audio"
    | "iot-content"
    | "bluetooth-audio"
    | "ai-audio";
  initialMode?: AiAudioLabId;
  title: LocalizedText;
  description: LocalizedText;
  buttonLabel: LocalizedText;
};

export type TopicDetail = {
  explanation: LocalizedText;
  chainContext?: {
    stage: LocalizedText;
    input: LocalizedText;
    output: LocalizedText;
    next: LocalizedText;
  };
  keyConcepts: LocalizedText[];
  termExplanations?: TopicTerm[];
  diagram?: TopicDiagram;
  lab?: TopicLab;
  misconception: LocalizedText;
  contentDirection: LocalizedText;
};

export type Topic = {
  title: LocalizedText;
  summary: LocalizedText;
  bullets: LocalizedText[];
  detail: TopicDetail;
};

export type Category = {
  id: string;
  icon: LucideIcon;
  title: LocalizedText;
  description: LocalizedText;
  accent: string;
  topics: Topic[];
};

export const interfaceCopy = {
  navGithub: { zh: "GitHub", en: "GitHub", ja: "GitHub", ko: "GitHub" },
  languageButton: { zh: "English", en: "中文", ja: "한국어", ko: "日本語" },
  eyebrow: { zh: "音频技术分享", en: "Audio Technology Sharing", ja: "音声技術の共有", ko: "오디오 기술 공유" },
  title: { zh: "音频技术分享", en: "Audio Technology Sharing", ja: "音声技術の共有", ko: "오디오 기술 공유" },
  subtitle: {
    zh: "一个可搜索、可筛选、带交互实验室的音频技术分享网页，覆盖音频基础、硬件、软件、传统 DSP、AI 算法和应用场景。",
    en: "A searchable, filterable audio technology sharing site with interactive labs, covering fundamentals, hardware, software, traditional DSP, AI algorithms, and applications.",
    ja: "検索と絞り込みに対応し、インタラクティブなラボを備えた音声技術共有サイトです。音声の基礎、ハードウェア、ソフトウェア、従来型 DSP、AI アルゴリズム、応用分野を扱います。",
    ko: "검색과 필터링을 지원하고 인터랙티브 실험실을 제공하는 오디오 기술 공유 사이트입니다. 오디오 기초, 하드웨어, 소프트웨어, 전통 DSP, AI 알고리즘과 응용 분야를 다룹니다."
  },
  searchLabel: { zh: "搜索知识点", en: "Search knowledge topics", ja: "知識トピックを検索", ko: "지식 주제 검색" },
  searchPlaceholder: {
    zh: "搜索 FFT、麦克风、TTS、蓝牙延迟...",
    en: "Search FFT, microphones, TTS, Bluetooth latency...",
    ja: "FFT、マイク、TTS、Bluetooth の遅延を検索…",
    ko: "FFT, 마이크, TTS, Bluetooth 지연 검색..."
  },
  allCategories: { zh: "全部", en: "All", ja: "すべて", ko: "전체" },
  categoriesTitle: { zh: "知识分类", en: "Knowledge Areas", ja: "知識分野", ko: "지식 분야" },
  categoriesSubtitle: {
    zh: "按学习路径浏览，也可以直接搜索具体概念。",
    en: "Browse by learning path, or search directly for a concept.",
    ja: "学習パスから閲覧するか、概念を直接検索できます。",
    ko: "학습 경로로 살펴보거나 개념을 바로 검색할 수 있습니다."
  },
  topicsTitle: { zh: "主题卡片", en: "Topic Cards", ja: "トピックカード", ko: "주제 카드" },
  topicsSubtitle: {
    zh: "声音原理、工程实践与 AI 算法的图解和交互实验。",
    en: "Explanations and interactive experiments in sound, audio engineering and AI.",
    ja: "音、音声工学、AI に関する解説とインタラクティブな実験を提供します。",
    ko: "소리, 오디오 공학과 AI에 관한 설명 및 인터랙티브 실험을 제공합니다."
  },
  noResults: { zh: "没有找到匹配主题。", en: "No matching topics found.", ja: "一致するトピックが見つかりません。", ko: "일치하는 주제를 찾지 못했습니다." },
  detailsLabel: { zh: "主题详情", en: "Topic details", ja: "トピックの詳細", ko: "주제 세부 정보" },
  closeDetails: { zh: "关闭详情", en: "Close details", ja: "詳細を閉じる", ko: "세부 정보 닫기" },
  detailsExplanationTitle: { zh: "详细解释", en: "Detailed explanation", ja: "詳しい解説", ko: "자세한 설명" },
  detailsRelatedTermsTitle: { zh: "相关知识点逐条解释", en: "Related knowledge explained", ja: "関連知識の解説", ko: "관련 지식 설명" },
  detailsConceptsTitle: { zh: "关键概念", en: "Key concepts", ja: "主要概念", ko: "핵심 개념" },
  detailsDiagramTitle: { zh: "声音模型图解", en: "Sound model diagram", ja: "音のモデル図解", ko: "소리 모델 도해" },
  detailsMisconceptionTitle: { zh: "常见误区", en: "Common misconception", ja: "よくある誤解", ko: "흔한 오해" },
  detailsContentDirectionTitle: { zh: "内容扩展建议", en: "Content expansion idea", ja: "コンテンツ拡張案", ko: "콘텐츠 확장 아이디어" },
  detailsFormatTitle: { zh: "适合内容形式", en: "Best content formats", ja: "適したコンテンツ形式", ko: "적합한 콘텐츠 형식" },
  detailsFormats: {
    zh: "文章 / 图解 / 案例 / 交互说明",
    en: "Article / Diagram / Case study / Interactive explainer",
    ja: "記事 / 図解 / ケーススタディ / インタラクティブ解説",
    ko: "문서 / 도해 / 사례 연구 / 인터랙티브 설명"
  },
  footer: {
    zh: "内容来自当前仓库的音频技术分享知识大纲。",
    en: "Content is derived from the repository's audio technology knowledge outline.",
    ja: "このリポジトリの音声技術ナレッジ概要をもとにしたコンテンツです。",
    ko: "이 콘텐츠는 현재 저장소의 오디오 기술 지식 개요를 바탕으로 합니다."
  }
} satisfies Record<string, LocalizedText>;

export const categories: Category[] = [
  {
    id: "fundamentals",
    icon: RadioTower,
    accent: "#1f9d8a",
    title: { zh: "音频基础", en: "Audio Fundamentals", ja: "音声の基礎", ko: "오디오 기초" },
    description: {
      zh: "理解声音、声学和数字音频的底层概念。",
      en: "Understand sound, acoustics, and the basics of digital audio.",
      ja: "音、音響、デジタル音声の基礎概念を理解します。",
      ko: "소리, 음향과 디지털 오디오의 기초 개념을 이해합니다."
    },
    topics: [
      {
        title: { zh: "什么是声音", en: "What Sound Is", ja: "音とは何か", ko: "소리란 무엇인가" },
        summary: {
          zh: "声音是介质中传播的压力扰动；从物理振动、数学模型一路理解到麦克风和 PCM。",
          en: "Sound is a pressure disturbance traveling through a medium; connect physical vibration and mathematical models to microphones and PCM.",
          ja: "音は媒質を伝わる圧力の揺らぎです。物理的な振動と数学モデルを、マイクや PCM までつなげて理解します。",
          ko: "소리는 매질을 통해 전달되는 압력 교란입니다. 물리적 진동과 수학적 모델을 마이크 및 PCM까지 연결해 이해합니다."
        },
        bullets: [
          { zh: "介质中的压力扰动与能量传播", en: "Pressure disturbances and energy propagation in a medium", ja: "媒質中の圧力の揺らぎとエネルギー伝搬", ko: "매질의 압력 교란과 에너지 전파" },
          { zh: "频率、振幅、相位、周期和波长", en: "Frequency, amplitude, phase, period, and wavelength", ja: "周波数、振幅、位相、周期、波長", ko: "주파수, 진폭, 위상, 주기와 파장" },
          { zh: "声压经过麦克风和 ADC 变成 PCM", en: "Sound pressure becomes PCM through a microphone and ADC", ja: "音圧がマイクと ADC を通って PCM になるまで", ko: "음압이 마이크와 ADC를 거쳐 PCM이 되는 과정" }
        ],
        detail: {
          explanation: {
            zh: "声音来自声源振动造成的局部压力和密度变化。介质粒子只在平衡位置附近往复运动，传播出去的是扰动和能量，而不是一团空气从声源跑到耳朵。单频纯音可近似写成 Δp(t) = Â·sin(2πft + φ)：Â 是峰值声压，f 是频率，φ 是初相位；真实语音和音乐则是许多频率、谐波与瞬态的叠加。",
            en: "Sound begins when a vibrating source creates local pressure and density changes. Particles oscillate around equilibrium while the disturbance and energy travel; a parcel of air does not move all the way from source to listener. A pure tone can be approximated by Δp(t) = Â·sin(2πft + φ), where Â is peak sound pressure, f is frequency, and φ is initial phase. Speech and music combine many frequencies, harmonics, and transients.",
            ja: "音は、振動する音源が局所的な圧力と密度の変化を生むことで始まります。粒子は平衡位置の周りで振動し、伝わるのは揺らぎとエネルギーであって、空気の塊が音源から聞き手まで移動するわけではありません。純音は Δp(t) = Â·sin(2πft + φ) と近似でき、Â は最大音圧、f は周波数、φ は初期位相です。音声や音楽は多くの周波数、倍音、過渡成分の組み合わせです。",
            ko: "소리는 진동하는 음원이 국소적인 압력과 밀도 변화를 만들 때 시작됩니다. 입자는 평형 위치 주변에서 진동하고, 전달되는 것은 교란과 에너지이지 공기 덩어리가 음원에서 청취자까지 이동하는 것이 아닙니다. 순음은 Δp(t) = Â·sin(2πft + φ)로 근사할 수 있으며, Â는 최대 음압, f는 주파수, φ는 초기 위상입니다. 음성과 음악은 여러 주파수, 배음과 과도 성분의 조합입니다."
          },
          chainContext: {
            stage: { zh: "链路起点：物理声学", en: "Chain position: physical acoustics", ja: "チェーンの起点：物理音響", ko: "체인 시작점: 물리 음향" },
            input: { zh: "声源的机械振动", en: "Mechanical vibration from a source", ja: "音源の機械振動", ko: "음원의 기계적 진동" },
            output: { zh: "空气中的声压变化 Δp", en: "Sound-pressure variation Δp in air", ja: "空気中の音圧変化 Δp", ko: "공기 중 음압 변화 Δp" },
            next: { zh: "进入麦克风换能", en: "Next: microphone transduction", ja: "次：マイクによる変換", ko: "다음: 마이크 변환" }
          },
          keyConcepts: [
            { zh: "周期 T = 1/f；空气中的波长 λ = c/f。频率升高会让周期变短、波长变短，但不会自动增大振幅。", en: "Period T = 1/f, and wavelength in air is λ = c/f. Higher frequency shortens period and wavelength but does not automatically increase amplitude.", ja: "周期 T = 1/f、空気中の波長 λ = c/f です。周波数が高いほど周期と波長は短くなりますが、振幅が自動的に大きくなるわけではありません。", ko: "주기 T = 1/f이고 공기 중 파장은 λ = c/f입니다. 주파수가 높아지면 주기와 파장은 짧아지지만 진폭이 자동으로 커지지는 않습니다." },
            { zh: "幅度描述物理变化大小；听感响度还受频率、持续时间、距离和人耳敏感度影响。", en: "Amplitude describes the size of a physical variation; perceived loudness also depends on frequency, duration, distance, and hearing sensitivity.", ja: "振幅は物理的な変化の大きさを表します。知覚される音量には周波数、持続時間、距離、聴覚の感度も影響します。", ko: "진폭은 물리적 변화의 크기를 나타내며, 지각되는 음량에는 주파수, 지속 시간, 거리와 청각 민감도도 영향을 줍니다." },
            { zh: "相位描述周期中的起始位置。单独持续纯音的绝对相位通常不明显，但多路声音叠加时会产生增强、抵消和定位差异。", en: "Phase describes the starting position within a cycle. Absolute phase of one sustained tone is usually subtle, but relative phase between signals changes reinforcement, cancellation, and localization.", ja: "位相は周期内の開始位置を表します。持続する単一純音の絶対位相は通常わかりにくい一方、信号同士の相対位相は強め合い、打ち消し、定位を変えます。", ko: "위상은 주기 안에서의 시작 위치를 나타냅니다. 지속되는 단일 순음의 절대 위상은 보통 미묘하지만 신호 간 상대 위상은 강화, 상쇄와 위치감을 바꿉니다." },
            { zh: "工程链路是：声源振动 → 声压变化 → 麦克风电压 → ADC 采样量化 → PCM 样本。", en: "The engineering chain is: source vibration → pressure variation → microphone voltage → ADC sampling and quantization → PCM samples.", ja: "工学的なチェーンは、音源の振動 → 音圧変化 → マイク電圧 → ADC のサンプリングと量子化 → PCM サンプルです。", ko: "공학적 체인은 음원 진동 → 음압 변화 → 마이크 전압 → ADC 샘플링 및 양자화 → PCM 샘플입니다." }
          ],
          termExplanations: [
            {
              name: { zh: "频率", en: "Frequency", ja: "周波数", ko: "주파수" },
              explanation: {
                zh: "频率 f 表示每秒完成的周期数，单位是赫兹 Hz，周期 T = 1/f。1 kHz 纯音每毫秒完成一个周期。频率主要对应音高，但音高还会受到谐波结构和听觉机制影响。",
                en: "Frequency f is the number of cycles completed each second, measured in hertz, with period T = 1/f. A 1 kHz tone completes one cycle per millisecond. Frequency is the main cue for pitch, although harmonics and hearing mechanisms also contribute.",
                ja: "周波数 f は 1 秒あたりの周期数で、単位はヘルツ、周期は T = 1/f です。1 kHz の音は 1 ミリ秒に 1 周期進みます。周波数は音高の主な手がかりですが、倍音構造や聴覚の仕組みも関係します。",
                ko: "주파수 f는 1초에 완료되는 주기의 수이며 단위는 헤르츠, 주기는 T = 1/f입니다. 1 kHz 음은 1밀리초마다 한 주기를 완료합니다. 주파수는 음높이의 주요 단서지만 배음 구조와 청각 메커니즘도 영향을 줍니다."
              }
            },
            {
              name: { zh: "振幅", en: "Amplitude", ja: "振幅", ko: "진폭" },
              explanation: {
                zh: "振幅表示压力偏离平衡值的大小。正弦波峰值为 Â，有效值 pᵣₘₛ = Â/√2；声压级计算使用有效值。提高频率不会自动提高振幅，两者必须分别控制。",
                en: "Amplitude is the pressure deviation from equilibrium. For a sine wave with peak Â, pᵣₘₛ = Â/√2, and sound-pressure level uses the RMS value. Raising frequency does not automatically raise amplitude; they are independent controls.",
                ja: "振幅は平衡値からの音圧の偏差です。ピーク Â の正弦波では pᵣₘₛ = Â/√2 で、音圧レベルには RMS 値を使います。周波数を上げても振幅は自動的には増えず、両者は別々に制御します。",
                ko: "진폭은 평형값에서 벗어난 음압의 크기입니다. 피크가 Â인 정현파에서는 pᵣₘₛ = Â/√2이고 음압 레벨에는 RMS 값을 사용합니다. 주파수를 높여도 진폭이 자동으로 커지지 않으며 둘은 독립적으로 조절합니다."
              }
            },
            {
              name: { zh: "相位", en: "Phase", ja: "位相", ko: "위상" },
              explanation: {
                zh: "相位 φ 描述波形在周期中的起始位置。单独播放一个持续纯音时，改变绝对相位通常不明显；两个同频信号叠加时，相对相位为 0° 会增强，接近 180° 会削弱或抵消。",
                en: "Phase φ describes a waveform's starting position within its cycle. Changing the absolute phase of one sustained pure tone is usually subtle; for two equal-frequency signals, 0° relative phase reinforces while nearly 180° weakens or cancels.",
                ja: "位相 φ は波形が周期内のどこから始まるかを表します。持続する単一純音の絶対位相を変えても通常はわずかですが、同じ周波数の 2 信号では相対位相 0° が強め合い、180° 付近が弱め合いまたは打ち消します。",
                ko: "위상 φ는 파형이 주기 안에서 시작하는 위치를 나타냅니다. 지속되는 단일 순음의 절대 위상 변화는 보통 미묘하지만 같은 주파수의 두 신호에서는 상대 위상 0°가 강화하고 180°에 가까우면 약화되거나 상쇄됩니다."
              }
            },
            {
              name: { zh: "波长", en: "Wavelength", ja: "波長", ko: "파장" },
              explanation: {
                zh: "波长 λ 是一个周期在空间中的长度，λ = c/f。在约 20°C 空气中取 c ≈ 343 m/s，100 Hz、1 kHz 和 10 kHz 的波长分别约为 3.43 m、0.343 m 和 0.0343 m。",
                en: "Wavelength λ is the spatial length of one cycle, λ = c/f. In air near 20°C, c ≈ 343 m/s, so 100 Hz, 1 kHz, and 10 kHz have wavelengths of about 3.43 m, 0.343 m, and 0.0343 m.",
                ja: "波長 λ は 1 周期が空間で占める長さで、λ = c/f です。20°C 前後の空気で c ≈ 343 m/s とすると、100 Hz、1 kHz、10 kHz の波長はそれぞれ約 3.43 m、0.343 m、0.0343 m です。",
                ko: "파장 λ은 한 주기가 공간에서 차지하는 길이이며 λ = c/f입니다. 약 20°C의 공기에서 c ≈ 343 m/s라면 100 Hz, 1 kHz, 10 kHz의 파장은 각각 약 3.43 m, 0.343 m, 0.0343 m입니다."
              }
            },
            {
              name: { zh: "人耳听觉范围", en: "Human hearing range", ja: "人間の可聴範囲", ko: "사람의 가청 범위" },
              explanation: {
                zh: "多数年轻人可听到大约 20 Hz 到 20 kHz 的声音，但年龄、环境噪声和个体差异会改变实际范围。人耳对 2 kHz 到 5 kHz 附近通常更敏感。",
                en: "Many young listeners can hear roughly 20 Hz to 20 kHz, but age, noise exposure, and individual differences change the actual range. Human hearing is often more sensitive around 2 kHz to 5 kHz.",
                ja: "多くの若年者はおよそ 20 Hz から 20 kHz まで聞こえますが、年齢、騒音への曝露、個人差で実際の範囲は変わります。人間の聴覚は通常 2 kHz から 5 kHz 付近により敏感です。",
                ko: "많은 젊은 청취자는 대략 20 Hz에서 20 kHz를 들을 수 있지만 나이, 소음 노출과 개인차에 따라 실제 범위가 달라집니다. 사람의 청각은 보통 2 kHz에서 5 kHz 부근에 더 민감합니다."
              }
            },
            {
              name: { zh: "传播介质", en: "Propagation medium", ja: "伝搬媒質", ko: "전파 매질" },
              explanation: {
                zh: "声音需要介质传递压力变化。空气中的声速约为 343 m/s，水和固体中的速度通常更快，因此同样频率在不同介质中的波长也不同。",
                en: "Sound needs a medium to carry pressure changes. In air the speed of sound is about 343 m/s, while it is usually faster in water and solids, so the same frequency has different wavelengths in different media.",
                ja: "音は圧力変化を運ぶ媒質を必要とします。空気中の音速は約 343 m/s で、水や固体では通常もっと速いため、同じ周波数でも媒質によって波長が異なります。",
                ko: "소리는 압력 변화를 전달할 매질이 필요합니다. 공기 중 음속은 약 343 m/s이고 물과 고체에서는 보통 더 빠르므로 같은 주파수라도 매질에 따라 파장이 달라집니다."
              }
            },
            {
              name: { zh: "声压级 dBSPL", en: "Sound pressure level (dBSPL)", ja: "音圧レベル dBSPL", ko: "음압 레벨 dBSPL" },
              explanation: {
                zh: "空气声压级 Lₚ = 20·log₁₀(pᵣₘₛ / 20 μPa)。20 μPa 是空气中的参考声压；声压有效值加倍约增加 6 dB。dBSPL 是物理量，不等同于主观响度，也不能直接换算成 dBFS。",
                en: "Airborne sound-pressure level is Lₚ = 20·log₁₀(pᵣₘₛ / 20 μPa). The 20 μPa value is the reference pressure; doubling RMS pressure adds about 6 dB. dBSPL is a physical measure, not perceived loudness, and it cannot be directly converted to dBFS.",
                ja: "空気中の音圧レベルは Lₚ = 20·log₁₀(pᵣₘₛ / 20 μPa) です。20 μPa は基準音圧で、RMS 音圧を 2 倍にすると約 6 dB 増えます。dBSPL は物理量であり、知覚音量ではなく、dBFS に直接換算することもできません。",
                ko: "공기 중 음압 레벨은 Lₚ = 20·log₁₀(pᵣₘₛ / 20 μPa)입니다. 20 μPa는 기준 음압이며 RMS 음압이 2배가 되면 약 6 dB 증가합니다. dBSPL은 물리량이지 지각 음량이 아니며 dBFS로 직접 변환할 수도 없습니다."
              }
            },
            {
              name: { zh: "从声压到 PCM", en: "From pressure to PCM", ja: "音圧から PCM へ", ko: "음압에서 PCM으로" },
              explanation: {
                zh: "麦克风把声压变化转换成模拟电压，前置放大器调整电平，ADC 按固定采样率取样并量化成整数，得到 PCM。PCM 数值表示采样时刻的相对幅度，不再是 Pa；必须经过麦克风灵敏度和增益校准才能反推声压。",
                en: "A microphone converts pressure variation into analog voltage, a preamp sets the level, and an ADC samples and quantizes it into integer PCM values. PCM represents relative amplitude at each sample, not pressure in pascals; microphone sensitivity and gain calibration are required to recover sound pressure.",
                ja: "マイクは圧力変化をアナログ電圧に変換し、プリアンプがレベルを整え、ADC がサンプリングと量子化を行って整数 PCM 値にします。PCM は各サンプルの相対振幅を表すもので、パスカル単位の音圧ではありません。音圧を復元するにはマイク感度とゲインの校正が必要です。",
                ko: "마이크는 압력 변화를 아날로그 전압으로 바꾸고 프리앰프가 레벨을 조정하며 ADC가 샘플링과 양자화를 수행해 정수 PCM 값으로 만듭니다. PCM은 파스칼 단위의 음압이 아니라 각 샘플의 상대 진폭을 나타내므로 음압을 역산하려면 마이크 감도와 게인 보정이 필요합니다."
              }
            }
          ],
          diagram: {
            type: "sound-wave",
            label: { zh: "声波频率、振幅、相位和波长图解", en: "Diagram of sound-wave frequency, amplitude, phase, and wavelength", ja: "音波の周波数・振幅・位相・波長の図解", ko: "음파의 주파수, 진폭, 위상과 파장 도해" },
            caption: {
              zh: "同样的振幅下，高频波形周期更密；同样的频率下，振幅越大代表压力变化越强。波长对应一个完整周期在空间中的距离。",
              en: "At the same amplitude, higher frequency creates tighter cycles. At the same frequency, larger amplitude means stronger pressure variation. Wavelength is the spatial distance of one full cycle.",
              ja: "同じ振幅なら周波数が高いほど周期は密になります。同じ周波数なら振幅が大きいほど圧力変化が強くなります。波長は 1 周期分の空間的な距離です。",
              ko: "같은 진폭에서는 주파수가 높을수록 주기가 촘촘해집니다. 같은 주파수에서는 진폭이 클수록 압력 변화가 강합니다. 파장은 한 주기의 공간적 거리입니다."
            }
          },
          lab: {
            type: "sound-wave",
            title: { zh: "声音波形实验室", en: "Sound Wave Lab", ja: "音波形ラボ", ko: "소리 파형 실험실" },
            description: {
              zh: "调节频率、振幅和相位，观察周期与波形变化；频率和振幅会改变听感，相位主要用于理解多信号叠加。",
              en: "Adjust frequency, amplitude, and phase to observe period and waveform changes; frequency and amplitude affect hearing, while phase mainly explains signal combination.",
              ja: "周波数、振幅、位相を調整して周期と波形の変化を観察します。周波数と振幅は聴感に影響し、位相は主に信号の重なりを理解するために使います。",
              ko: "주파수, 진폭과 위상을 조절해 주기와 파형의 변화를 관찰합니다. 주파수와 진폭은 청감에 영향을 주고 위상은 주로 신호 결합을 이해하는 데 사용됩니다."
            },
            buttonLabel: { zh: "打开声音波形实验室", en: "Open sound wave lab", ja: "音波形ラボを開く", ko: "소리 파형 실험실 열기" }
          },
          misconception: {
            zh: "声音传播不是空气整体向前流动；频率更高也不代表振幅更大。声音需要气体、液体或固体等介质传递机械扰动，普通声波不能在真空中传播。",
            en: "Sound propagation is not bulk forward motion of air, and higher frequency does not mean larger amplitude. Sound needs a gas, liquid, or solid to carry mechanical disturbance; ordinary sound waves do not travel through a vacuum.",
            ja: "音の伝搬は空気全体が前へ流れることではなく、周波数が高いからといって振幅が大きいわけでもありません。音は気体、液体、固体などの媒質で機械的な揺らぎを伝える必要があり、通常の音波は真空を進みません。",
            ko: "소리의 전파는 공기 전체가 앞으로 이동하는 것이 아니며 주파수가 높다고 진폭이 큰 것도 아닙니다. 소리는 기체, 액체 또는 고체 같은 매질이 기계적 교란을 전달해야 하므로 일반적인 음파는 진공을 통과하지 못합니다."
          },
          contentDirection: {
            zh: "上方交互实验已经把频率、振幅、相位和播放音高连接起来；后续可以继续补充谐波、噪声和真实乐器波形对比。",
            en: "The interactive experiment above already connects frequency, amplitude, phase, and audible pitch; next it can add harmonics, noise, and real-instrument waveform comparisons.",
            ja: "上のインタラクティブ実験では周波数、振幅、位相、聞こえる音高をすでに結び付けています。次は倍音、ノイズ、実楽器の波形比較を追加できます。",
            ko: "위 인터랙티브 실험은 이미 주파수, 진폭, 위상과 청각적 음높이를 연결합니다. 다음 단계로 배음, 잡음과 실제 악기 파형 비교를 추가할 수 있습니다."
          }
        }
      },
      {
        title: { zh: "声音与音频单位", en: "Sound and Audio Units", ja: "音とオーディオの単位", ko: "소리와 오디오 단위" },
        summary: {
          zh: "区分 dBSPL、dBFS、dBu、dBV、LUFS、Hz、bit、ms 等常见单位和参考点。",
          en: "Distinguish common units and references such as dBSPL, dBFS, dBu, dBV, LUFS, Hz, bit, and ms.",
          ja: "dBSPL、dBFS、dBu、dBV、LUFS、Hz、bit、ms などの一般的な単位と基準値を区別します。",
          ko: "dBSPL, dBFS, dBu, dBV, LUFS, Hz, bit와 ms 같은 주요 단위와 기준을 구분합니다."
        },
        bullets: [
          { zh: "dB 是比例，dBSPL / dBFS / dBu / dBV 的参考点不同", en: "dB is a ratio; dBSPL, dBFS, dBu, and dBV use different references", ja: "dB は比率であり、dBSPL、dBFS、dBu、dBV の基準値は異なります", ko: "dB는 비율이며 dBSPL, dBFS, dBu와 dBV는 서로 다른 기준을 사용합니다" },
          { zh: "LUFS 描述节目响度，dBFS 描述数字满刻度余量", en: "LUFS describes program loudness, while dBFS describes digital full-scale headroom", ja: "LUFS は番組音量を、dBFS はデジタルフルスケールまでの余裕を表します", ko: "LUFS는 프로그램 음량을, dBFS는 디지털 풀 스케일까지의 헤드룸을 나타냅니다" },
          { zh: "Hz、kHz、bit、sample、ms 常用于频率、采样、位深和延迟", en: "Hz, kHz, bit, sample, and ms describe frequency, sampling, bit depth, and latency", ja: "Hz、kHz、bit、sample、ms は周波数、サンプリング、ビット深度、遅延に使われます", ko: "Hz, kHz, bit, sample과 ms는 주파수, 샘플링, 비트 깊이와 지연을 나타내는 데 사용됩니다" }
        ],
        detail: {
          explanation: {
            zh: "音频里很多单位都写成 dB，但它们不是同一种东西。dB 本身只是两个量之间的对数比例；加上不同后缀后，参考点才被确定：dBSPL 参考空气声压，dBFS 参考数字满刻度，dBu 和 dBV 参考模拟电压，LUFS 则用于描述节目响度。理解这些单位的关键，是先问“相对于什么参考值”。",
            en: "Many audio units include dB, but they are not the same thing. dB itself is a logarithmic ratio between two quantities; the suffix defines the reference: dBSPL refers to acoustic pressure, dBFS to digital full scale, dBu and dBV to analog voltage, and LUFS to program loudness. The key question is always: relative to what reference?",
            ja: "音声分野には dB を含む単位が多くありますが、同じものではありません。dB 自体は 2 つの量の対数比で、接尾辞が基準値を決めます。dBSPL は音圧、dBFS はデジタルフルスケール、dBu と dBV はアナログ電圧、LUFS は番組音量を基準にします。常に「何を基準にした値か」を確認することが重要です。",
            ko: "오디오 분야에는 dB를 포함하는 단위가 많지만 모두 같은 것은 아닙니다. dB 자체는 두 양의 로그 비율이고 접미사가 기준을 정합니다. dBSPL은 음압, dBFS는 디지털 풀 스케일, dBu와 dBV는 아날로그 전압, LUFS는 프로그램 음량을 기준으로 합니다. 핵심 질문은 항상 무엇을 기준으로 하는가입니다."
          },
          keyConcepts: [
            { zh: "dB 不是绝对单位，必须知道参考点。20 dB SPL、-20 dBFS 和 +20 dBu 不能直接比较大小。", en: "dB is not absolute without a reference. 20 dB SPL, -20 dBFS, and +20 dBu cannot be directly compared.", ja: "dB は基準値がなければ絶対量ではありません。20 dB SPL、-20 dBFS、+20 dBu をそのまま大小比較することはできません。", ko: "dB는 기준이 없으면 절대값이 아닙니다. 20 dB SPL, -20 dBFS와 +20 dBu를 직접 크기 비교할 수 없습니다." },
            { zh: "dBFS 的 0 dBFS 是数字满刻度上限，正常数字音频电平通常是负数，超过 0 dBFS 往往会削波。", en: "0 dBFS is digital full scale, so normal digital levels are usually negative; exceeding 0 dBFS often clips.", ja: "0 dBFS はデジタルフルスケールの上限なので、通常のデジタル音声レベルは負の値です。0 dBFS を超えると多くの場合クリップします。", ko: "0 dBFS는 디지털 풀 스케일의 상한이므로 정상적인 디지털 오디오 레벨은 보통 음수입니다. 0 dBFS를 넘으면 대개 클리핑이 발생합니다." },
            { zh: "dBSPL 关注空气中的声压级，常用于扬声器、噪声和听力安全；94 dB SPL 常对应 1 Pa 声压。", en: "dBSPL describes acoustic sound pressure, used for speakers, noise, and hearing safety; 94 dB SPL corresponds to 1 Pa pressure.", ja: "dBSPL は空気中の音圧レベルを表し、スピーカー、騒音、聴覚の安全に使われます。94 dB SPL は通常 1 Pa の音圧に相当します。", ko: "dBSPL은 공기 중 음압 레벨을 나타내며 스피커, 소음과 청각 안전에 사용됩니다. 94 dB SPL은 보통 1 Pa 음압에 해당합니다." },
            { zh: "dBu 和 dBV 是模拟电压单位：0 dBu = 0.775 Vrms，0 dBV = 1 Vrms，常用于线路电平和专业/消费设备接口。", en: "dBu and dBV are analog voltage units: 0 dBu = 0.775 Vrms and 0 dBV = 1 Vrms, common for line level and pro/consumer interfaces.", ja: "dBu と dBV はアナログ電圧の単位です。0 dBu = 0.775 Vrms、0 dBV = 1 Vrms で、ラインレベルや業務用・民生機器のインターフェースによく使われます。", ko: "dBu와 dBV는 아날로그 전압 단위입니다. 0 dBu = 0.775 Vrms, 0 dBV = 1 Vrms이며 라인 레벨과 프로/소비자 장비 인터페이스에 흔히 사용됩니다." },
            { zh: "LUFS 加入人耳频率权重和时间积分，更适合描述一段节目整体听起来有多响。", en: "LUFS includes perceptual weighting and time integration, making it better for how loud a program feels overall.", ja: "LUFS は聴覚に基づく重み付けと時間積分を含むため、番組全体がどれほど大きく聞こえるかの表現に適しています。", ko: "LUFS는 청각적 가중과 시간 적분을 포함하므로 프로그램 전체가 얼마나 크게 들리는지를 나타내는 데 더 적합합니다." }
          ],
          termExplanations: [
            {
              name: { zh: "dB", en: "dB", ja: "dB", ko: "dB" },
              explanation: {
                zh: "dB 是对数比例单位，用来表示两个量的相对大小。电压、电平这类幅度比常用 20×log10，功率比常用 10×log10。没有参考点时，单独说“多少 dB”通常是不完整的。",
                en: "dB is a logarithmic ratio. Amplitude ratios such as voltage often use 20 x log10, while power ratios use 10 x log10. Saying only 'some dB' is usually incomplete without a reference.",
                ja: "dB は対数比です。電圧などの振幅比には 20 x log10、電力比には 10 x log10 を使うことが多く、基準値なしに「何 dB」とだけ言うのは不十分です。",
                ko: "dB는 로그 비율입니다. 전압 같은 진폭비에는 보통 20 x log10을, 전력비에는 10 x log10을 사용하며 기준 없이 단지 몇 dB라고 말하면 불완전합니다."
              }
            },
            {
              name: { zh: "dBSPL", en: "dBSPL", ja: "dBSPL", ko: "dBSPL" },
              explanation: {
                zh: "dBSPL 是声压级，参考值是 20 µPa，接近人耳在 1 kHz 附近的听阈。它用来描述空气中的声音强弱，例如环境噪声、扬声器最大声压和听力安全。",
                en: "dBSPL is sound pressure level, referenced to 20 uPa, near the threshold of hearing around 1 kHz. It describes acoustic sound strength, such as environmental noise, speaker maximum SPL, and hearing safety.",
                ja: "dBSPL は 20 uPa を基準とする音圧レベルで、1 kHz 付近の聴覚閾値に近い値です。環境騒音、スピーカーの最大 SPL、聴覚の安全など、音の物理的な強さを表します。",
                ko: "dBSPL은 20 uPa를 기준으로 하는 음압 레벨이며 1 kHz 부근의 청각 임계값에 가깝습니다. 환경 소음, 스피커 최대 SPL과 청각 안전처럼 음향의 물리적 세기를 나타냅니다."
              }
            },
            {
              name: { zh: "dBFS", en: "dBFS", ja: "dBFS", ko: "dBFS" },
              explanation: {
                zh: "dBFS 是数字音频相对于满刻度的电平。0 dBFS 是系统能表示的最大数字幅度，-6 dBFS 约表示幅度减半，录音和混音常保留一定 headroom 避免削波。",
                en: "dBFS is digital level relative to full scale. 0 dBFS is the maximum representable digital amplitude, -6 dBFS is roughly half amplitude, and recording/mixing often leaves headroom to avoid clipping.",
                ja: "dBFS はフルスケールを基準にしたデジタルレベルです。0 dBFS は表現可能な最大振幅、-6 dBFS はおよそ半分の振幅で、録音やミックスではクリップを避けるためヘッドルームを残すことが多いです。",
                ko: "dBFS는 풀 스케일을 기준으로 한 디지털 레벨입니다. 0 dBFS는 표현 가능한 최대 디지털 진폭이고 -6 dBFS는 대략 절반의 진폭이며 녹음과 믹싱에서는 클리핑을 피하려고 헤드룸을 남기는 경우가 많습니다."
              }
            },
            {
              name: { zh: "dBu / dBV", en: "dBu / dBV", ja: "dBu / dBV", ko: "dBu / dBV" },
              explanation: {
                zh: "dBu 和 dBV 描述模拟电压电平。0 dBu = 0.775 Vrms，0 dBV = 1 Vrms。专业线路电平常说 +4 dBu，消费设备常见 -10 dBV。",
                en: "dBu and dBV describe analog voltage level. 0 dBu = 0.775 Vrms and 0 dBV = 1 Vrms. Professional line level is often +4 dBu, while consumer gear often uses -10 dBV.",
                ja: "dBu と dBV はアナログ電圧レベルを表します。0 dBu = 0.775 Vrms、0 dBV = 1 Vrms です。業務用ラインレベルは +4 dBu、民生機器では -10 dBV がよく使われます。",
                ko: "dBu와 dBV는 아날로그 전압 레벨을 나타냅니다. 0 dBu = 0.775 Vrms, 0 dBV = 1 Vrms입니다. 프로 장비의 라인 레벨은 보통 +4 dBu, 소비자 장비는 -10 dBV를 사용합니다."
              }
            },
            {
              name: { zh: "LUFS", en: "LUFS", ja: "LUFS", ko: "LUFS" },
              explanation: {
                zh: "LUFS 是响度单位，常用于节目响度标准化。它不是简单峰值，而是考虑人耳频率敏感度和时间积分，适合比较歌曲、视频、播客或直播整体响度。",
                en: "LUFS is a loudness unit used for program loudness normalization. It is not a simple peak value; it uses perceptual weighting and time integration, useful for comparing music, video, podcasts, or streams.",
                ja: "LUFS は番組音量の正規化に使う音量単位です。単純なピーク値ではなく、聴覚重み付けと時間積分を用いるため、音楽、動画、ポッドキャスト、配信の全体音量を比較できます。",
                ko: "LUFS는 프로그램 음량 정규화에 사용하는 음량 단위입니다. 단순한 피크값이 아니라 청각적 가중과 시간 적분을 사용하므로 음악, 동영상, 팟캐스트와 스트림의 전체 음량을 비교하는 데 유용합니다."
              }
            },
            {
              name: { zh: "Hz / kHz", en: "Hz / kHz", ja: "Hz / kHz", ko: "Hz / kHz" },
              explanation: {
                zh: "Hz 表示每秒次数。20 Hz 到 20 kHz 常用来描述人耳可听频率范围；44.1 kHz 或 48 kHz 描述数字音频每秒采样次数。",
                en: "Hz means cycles or events per second. 20 Hz to 20 kHz often describes human hearing range; 44.1 kHz or 48 kHz describes digital audio samples per second.",
                ja: "Hz は 1 秒あたりの周期または事象の回数です。20 Hz から 20 kHz は人間の可聴範囲の説明に、44.1 kHz や 48 kHz はデジタル音声の 1 秒あたりのサンプル数の説明に使われます。",
                ko: "Hz는 초당 주기 또는 사건의 횟수입니다. 20 Hz에서 20 kHz는 사람의 가청 범위를, 44.1 kHz와 48 kHz는 디지털 오디오의 초당 샘플 수를 나타내는 데 흔히 사용됩니다."
              }
            },
            {
              name: { zh: "bit / sample / ms", en: "bit / sample / ms", ja: "bit / sample / ms", ko: "bit / sample / ms" },
              explanation: {
                zh: "bit 常用于位深或码率，sample 是一个采样点，ms 是毫秒，常用于延迟和 buffer 长度。例如 48 kHz 下 480 samples 对应 10 ms。",
                en: "bit is used for bit depth or bitrate, sample is one sampled point, and ms is milliseconds, often used for latency and buffer length. For example, at 48 kHz, 480 samples equal 10 ms.",
                ja: "bit はビット深度やビットレート、sample は 1 つのサンプル点、ms はミリ秒を表し、遅延やバッファ長によく使います。たとえば 48 kHz では 480 samples が 10 ms に相当します。",
                ko: "bit는 비트 깊이나 비트레이트에, sample은 하나의 샘플 지점에, ms는 밀리초에 사용되며 지연과 버퍼 길이를 나타낼 때 흔합니다. 예를 들어 48 kHz에서 480 samples는 10 ms입니다."
              }
            }
          ],
          lab: {
            type: "audio-units",
            title: { zh: "声音与音频单位实验室", en: "Sound and Audio Units Lab", ja: "音とオーディオの単位ラボ", ko: "소리와 오디오 단위 실험실" },
            description: {
              zh: "进入独立界面查看 dBSPL、dBFS、dBu、dBV、LUFS、Hz、bit、sample 和 ms 的参考点、典型范围和换算关系。",
              en: "Open an independent lab to inspect references, typical ranges, and conversion relationships for dBSPL, dBFS, dBu, dBV, LUFS, Hz, bit, sample, and ms.",
              ja: "独立したラボで、dBSPL、dBFS、dBu、dBV、LUFS、Hz、bit、sample、ms の基準値、代表的な範囲、換算関係を確認します。",
              ko: "독립 실험실에서 dBSPL, dBFS, dBu, dBV, LUFS, Hz, bit, sample과 ms의 기준, 일반적인 범위와 변환 관계를 살펴봅니다."
            },
            buttonLabel: { zh: "打开声音与音频单位实验室", en: "Open sound and audio units lab", ja: "音とオーディオの単位ラボを開く", ko: "소리와 오디오 단위 실험실 열기" }
          },
          misconception: {
            zh: "看到 dB 不能默认它们能直接比较。声压、电压、数字满刻度和节目响度的参考点不同，必须先看后缀和测量场景。",
            en: "Do not assume all dB values are directly comparable. Acoustic pressure, analog voltage, digital full scale, and program loudness use different references, so check the suffix and measurement context first.",
            ja: "すべての dB 値を直接比較できると考えてはいけません。音圧、アナログ電圧、デジタルフルスケール、番組音量は異なる基準を使うため、まず接尾辞と測定状況を確認します。",
            ko: "모든 dB 값을 직접 비교할 수 있다고 생각하면 안 됩니다. 음압, 아날로그 전압, 디지털 풀 스케일과 프로그램 음량은 서로 다른 기준을 사용하므로 먼저 접미사와 측정 상황을 확인해야 합니다."
          },
          contentDirection: {
            zh: "适合扩展为单位速查表、参考点对照图、dBu/dBV 电压换算、dBFS headroom 图和 samples/ms 延迟换算工具。",
            en: "This can expand into a unit cheat sheet, reference comparison diagram, dBu/dBV voltage conversion, dBFS headroom chart, and samples/ms latency calculator.",
            ja: "単位早見表、基準値比較図、dBu/dBV 電圧換算、dBFS ヘッドルーム図、samples/ms 遅延計算ツールへ発展できます。",
            ko: "단위 요약표, 기준 비교 도해, dBu/dBV 전압 변환, dBFS 헤드룸 차트와 samples/ms 지연 계산기로 확장할 수 있습니다."
          }
        }
      },
      {
        title: { zh: "数字音频基础", en: "Digital Audio Basics", ja: "デジタル音声の基礎", ko: "디지털 오디오 기초" },
        summary: {
          zh: "解释采样、量化、编码，以及采样率和位深对音质的影响。",
          en: "Explain sampling, quantization, encoding, and how sample rate and bit depth affect audio quality.",
          ja: "サンプリング、量子化、エンコード、そしてサンプルレートとビット深度が音質に与える影響を解説します。",
          ko: "샘플링, 양자화, 인코딩과 샘플레이트 및 비트 깊이가 음질에 미치는 영향을 설명합니다."
        },
        bullets: [
          { zh: "采样定理", en: "Sampling theorem", ja: "サンプリング定理", ko: "샘플링 정리" },
          { zh: "采样率、位深、动态范围", en: "Sample rate, bit depth, dynamic range", ja: "サンプルレート、ビット深度、ダイナミックレンジ", ko: "샘플레이트, 비트 깊이, 다이내믹 레인지" },
          { zh: "WAV、MP3、AAC、FLAC、Opus", en: "WAV, MP3, AAC, FLAC, Opus", ja: "WAV、MP3、AAC、FLAC、Opus", ko: "WAV, MP3, AAC, FLAC, Opus" }
        ],
        detail: {
          explanation: {
            zh: "数字音频把连续的声波转换成一串离散数字。采样率决定每秒记录多少个点，位深决定每个点能表达多细的幅度变化，编码格式则决定这些数字如何保存、压缩和传输。",
            en: "Digital audio turns a continuous waveform into discrete numbers. Sample rate controls how many points are captured per second, bit depth controls amplitude precision, and the encoding format defines how those numbers are stored, compressed, and transmitted.",
            ja: "デジタル音声は連続波形を離散的な数値に変換します。サンプルレートは 1 秒あたりに記録する点の数、ビット深度は振幅の精度を決め、エンコード形式は数値の保存、圧縮、伝送方法を決めます。",
            ko: "디지털 오디오는 연속 파형을 이산적인 숫자로 바꿉니다. 샘플레이트는 초당 기록되는 점의 수를, 비트 깊이는 진폭 정밀도를 결정하며 인코딩 형식은 그 숫자를 저장, 압축하고 전송하는 방식을 정합니다."
          },
          chainContext: {
            stage: { zh: "采集后的数字化阶段", en: "Chain position: digitization after capture", ja: "チェーン位置：収音後のデジタル化", ko: "체인 위치: 캡처 후 디지털화" },
            input: { zh: "麦克风或线路输入的连续模拟电压", en: "Continuous analog voltage from a microphone or line input", ja: "マイクまたはライン入力からの連続アナログ電圧", ko: "마이크 또는 라인 입력의 연속 아날로그 전압" },
            output: { zh: "带采样率、位深和格式的 PCM / 音频码流", en: "PCM samples or an audio stream with sample rate, bit depth, and format", ja: "サンプルレート、ビット深度、形式を持つ PCM / 音声ストリーム", ko: "샘플레이트, 비트 깊이와 형식을 포함한 PCM / 오디오 스트림" },
            next: { zh: "进入 DSP、编码、存储或传输", en: "Next: DSP, encoding, storage, or transport", ja: "次：DSP、エンコード、保存、伝送", ko: "다음: DSP, 인코딩, 저장 또는 전송" }
          },
          keyConcepts: [
            { zh: "采样率决定时间轴上的记录密度，常见音乐和视频音频会使用 44.1 kHz 或 48 kHz。", en: "Sample rate determines density along the time axis; music and video commonly use 44.1 kHz or 48 kHz.", ja: "サンプルレートは時間軸上の記録密度を決めます。音楽や動画では 44.1 kHz または 48 kHz がよく使われます。", ko: "샘플레이트는 시간축의 기록 밀도를 결정하며 음악과 동영상에서는 44.1 kHz 또는 48 kHz를 흔히 사용합니다." },
            { zh: "奈奎斯特采样定理说明采样率至少要高于最高有效频率的两倍，采样前通常需要抗混叠滤波。", en: "The Nyquist theorem says the sample rate must be more than twice the highest useful frequency, so anti-alias filtering is usually needed before sampling.", ja: "ナイキストの定理では、サンプルレートは有効な最高周波数の 2 倍を超える必要があります。そのため通常はサンプリング前にアンチエイリアスフィルターを使います。", ko: "나이퀴스트 정리에 따르면 샘플레이트는 유효 최고 주파수의 두 배보다 높아야 하므로 샘플링 전에 일반적으로 앨리어스 방지 필터가 필요합니다." },
            { zh: "位深影响量化噪声和理论动态范围，16-bit 常用于发行，24-bit 常用于录音和制作。", en: "Bit depth affects quantization noise and theoretical dynamic range; 16-bit is common for delivery, while 24-bit is common for recording and production.", ja: "ビット深度は量子化ノイズと理論上のダイナミックレンジに影響します。16-bit は配信用、24-bit は録音や制作に一般的です。", ko: "비트 깊이는 양자화 잡음과 이론적 다이내믹 레인지에 영향을 줍니다. 16-bit는 배포에, 24-bit는 녹음과 제작에 흔히 사용됩니다." },
            { zh: "傅里叶变换把一段时间波形表示为不同频率正弦分量的组合；FFT 是快速计算 DFT 的算法，不是另一种变换。", en: "The Fourier transform represents a time waveform as a combination of sinusoidal components; FFT is a fast algorithm for computing the DFT, not a different transform.", ja: "フーリエ変換は時間波形を異なる周波数の正弦成分の組み合わせとして表します。FFT は DFT を高速に計算するアルゴリズムで、別の変換ではありません。", ko: "푸리에 변환은 시간 파형을 서로 다른 주파수의 정현파 성분 조합으로 나타냅니다. FFT는 DFT를 빠르게 계산하는 알고리즘이지 다른 변환이 아닙니다." },
            { zh: "编码把采样值组织成文件或码流，PCM 保留原始采样，FLAC 无损压缩，MP3、AAC、Opus 有损压缩。", en: "Encoding organizes samples into files or streams: PCM preserves raw samples, FLAC compresses losslessly, and MP3, AAC, and Opus compress lossily.", ja: "エンコードはサンプルをファイルやストリームにまとめます。PCM は元のサンプルを保ち、FLAC は可逆圧縮、MP3、AAC、Opus は非可逆圧縮を行います。", ko: "인코딩은 샘플을 파일이나 스트림으로 구성합니다. PCM은 원본 샘플을 보존하고 FLAC은 무손실 압축, MP3, AAC와 Opus는 손실 압축을 수행합니다." }
          ],
          termExplanations: [
            {
              name: { zh: "采样", en: "Sampling", ja: "サンプリング", ko: "샘플링" },
              explanation: {
                zh: "采样把连续时间中的模拟波形按固定时间间隔记录成一个个离散点。采样率越高，每秒记录的点越多，时间细节越容易保留；采样率不足时，高频内容可能被误判成低频，这叫混叠。",
                en: "Sampling records a continuous-time analog waveform as discrete points at fixed time intervals. A higher sample rate captures more points per second and preserves time detail more easily; if it is too low, high-frequency content can appear as a false lower frequency, called aliasing.",
                ja: "サンプリングは連続時間のアナログ波形を一定間隔で離散点として記録します。サンプルレートが高いほど 1 秒あたりの点が増えて時間的な細部を保ちやすくなりますが、低すぎると高周波成分が偽の低周波として現れます。これがエイリアシングです。",
                ko: "샘플링은 연속 시간의 아날로그 파형을 일정한 시간 간격의 이산적인 점으로 기록합니다. 샘플레이트가 높으면 초당 더 많은 점을 기록해 시간 세부 사항을 보존하기 쉽지만 너무 낮으면 고주파 성분이 가짜 저주파로 나타나며 이를 앨리어싱이라고 합니다."
              }
            },
            {
              name: { zh: "量化", en: "Quantization", ja: "量子化", ko: "양자화" },
              explanation: {
                zh: "量化把连续幅度映射到有限个数字等级。位深越高，可用等级越多，量化误差越小，理论动态范围越大；位深较低时，波形会变成更明显的阶梯，并产生更容易听到的量化噪声。",
                en: "Quantization maps continuous amplitude to a finite set of numeric levels. Higher bit depth provides more levels, lower quantization error, and wider theoretical dynamic range; low bit depth creates more obvious stair-steps and more audible quantization noise.",
                ja: "量子化は連続振幅を有限個の数値レベルに写像します。ビット深度が高いほどレベル数が増え、量子化誤差が減り、理論ダイナミックレンジが広がります。低ビット深度では階段状の波形と聞こえやすい量子化ノイズが生じます。",
                ko: "양자화는 연속적인 진폭을 유한한 수치 레벨로 매핑합니다. 비트 깊이가 높으면 레벨 수가 많아지고 양자화 오차가 줄며 이론적 다이내믹 레인지가 넓어집니다. 비트 깊이가 낮으면 계단 모양과 더 잘 들리는 양자화 잡음이 생깁니다."
              }
            },
            {
              name: { zh: "编码", en: "Encoding", ja: "エンコード", ko: "인코딩" },
              explanation: {
                zh: "编码决定这些采样值如何组织、封装、压缩和传输。PCM 不是压缩算法，而是把每个量化后的采样值按固定字长顺序写成二进制样本；WAV 常封装 PCM 原始采样，FLAC 做无损压缩，MP3、AAC、Opus 会进一步做感知压缩。",
                en: "Encoding defines how sample values are organized, wrapped, compressed, and transmitted. PCM is not a compression algorithm; it writes each quantized sample as a fixed-width binary word in sequence. WAV often wraps raw PCM, FLAC compresses losslessly, while MP3, AAC, and Opus add perceptual compression.",
                ja: "エンコードはサンプル値の整理、パッケージ化、圧縮、伝送方法を決めます。PCM は圧縮アルゴリズムではなく、量子化した各サンプルを固定幅の二進語として順に書き込みます。WAV は生の PCM を格納することが多く、FLAC は可逆圧縮、MP3、AAC、Opus は知覚圧縮を加えます。",
                ko: "인코딩은 샘플 값을 구성하고 래핑하며 압축하고 전송하는 방식을 정합니다. PCM은 압축 알고리즘이 아니라 양자화된 각 샘플을 고정 폭 이진 단어로 순서대로 기록합니다. WAV는 원시 PCM을 담는 경우가 많고 FLAC은 무손실 압축, MP3, AAC와 Opus는 지각 압축을 추가합니다."
              }
            },
            {
              name: { zh: "采样率", en: "Sample rate", ja: "サンプルレート", ko: "샘플레이트" },
              explanation: {
                zh: "采样率是每秒采样次数，单位是 Hz。44.1 kHz 表示每秒 44100 个采样点；48 kHz 常用于视频、会议和系统音频。采样率提高会增加数据量，但不自动等于更好听。",
                en: "Sample rate is the number of samples per second, measured in Hz. 44.1 kHz means 44,100 samples per second; 48 kHz is common for video, conferencing, and system audio. Raising it increases data size but does not automatically sound better.",
                ja: "サンプルレートは 1 秒あたりのサンプル数で、Hz で表します。44.1 kHz は毎秒 44,100 サンプル、48 kHz は動画、会議、システム音声でよく使われます。高くするとデータ量は増えますが、音が自動的に良くなるわけではありません。",
                ko: "샘플레이트는 초당 샘플 수이며 Hz로 측정합니다. 44.1 kHz는 초당 44,100 샘플을 뜻하고 48 kHz는 동영상, 회의와 시스템 오디오에 흔합니다. 높이면 데이터 크기는 커지지만 음질이 자동으로 좋아지지는 않습니다."
              }
            },
            {
              name: { zh: "傅里叶变换", en: "Fourier transform", ja: "フーリエ変換", ko: "푸리에 변환" },
              explanation: {
                zh: "傅里叶变换把时间域信号投影到频率域：它回答‘这段声音里有哪些频率、各自有多强、相位如何’。实际音频通常对有限长度的一帧做 DFT；FFT 只是利用对称性减少计算量的快速实现。窗口越长，频率间隔 Δf = fₛ/N 越细，但时间定位越粗；短时傅里叶变换（STFT）就是连续分帧后分别做 FFT。",
                en: "The Fourier transform projects a time-domain signal into the frequency domain, answering which frequencies are present, how strong they are, and what their phases are. Audio usually applies a DFT to a finite frame; FFT is a faster implementation that reduces repeated computation. A longer window gives finer frequency spacing Δf = fₛ/N but coarser time localization; STFT applies FFT to successive frames.",
                ja: "フーリエ変換は時間領域信号を周波数領域へ写像し、どの周波数が含まれ、どれほど強く、位相がどうなっているかを示します。音声では通常、有限長のフレームに DFT を適用します。FFT は重複計算を減らす高速実装です。長い窓は周波数間隔 Δf = fₛ/N を細かくしますが時間定位は粗くなり、STFT は連続するフレームに FFT を適用します。",
                ko: "푸리에 변환은 시간 영역 신호를 주파수 영역으로 투영해 어떤 주파수가 존재하고 얼마나 강하며 위상이 어떤지 보여줍니다. 오디오에서는 보통 유한한 프레임에 DFT를 적용하고 FFT는 중복 계산을 줄이는 빠른 구현입니다. 긴 윈도우는 주파수 간격 Δf = fₛ/N을 더 세밀하게 하지만 시간 위치 해상도는 거칠어지며 STFT는 연속 프레임마다 FFT를 적용합니다."
              }
            },
            {
              name: { zh: "位深", en: "Bit depth", ja: "ビット深度", ko: "비트 깊이" },
              explanation: {
                zh: "位深表示每个采样点用多少位二进制描述幅度。n-bit 可以表示 2 的 n 次方个幅度等级。16-bit 理论动态范围约 96 dB，24-bit 理论动态范围约 144 dB。",
                en: "Bit depth is how many binary bits describe each sample's amplitude. n-bit audio can represent 2^n amplitude levels. 16-bit has about 96 dB theoretical dynamic range, while 24-bit has about 144 dB.",
                ja: "ビット深度は各サンプルの振幅を表す二進ビット数です。n-bit 音声は 2^n 個の振幅レベルを表現できます。16-bit の理論ダイナミックレンジは約 96 dB、24-bit は約 144 dB です。",
                ko: "비트 깊이는 각 샘플의 진폭을 표현하는 이진 비트 수입니다. n-bit 오디오는 2^n개의 진폭 레벨을 표현할 수 있습니다. 16-bit의 이론적 다이내믹 레인지는 약 96 dB, 24-bit는 약 144 dB입니다."
              }
            },
            {
              name: { zh: "码率", en: "Bitrate", ja: "ビットレート", ko: "비트레이트" },
              explanation: {
                zh: "码率表示每秒音频数据量，通常用 kbps 表示。无压缩 PCM 的码率由采样率、位深和通道数决定；有损编码的码率还受到编码器算法和内容复杂度影响。",
                en: "Bitrate is the amount of audio data per second, often shown in kbps. Uncompressed PCM bitrate comes from sample rate, bit depth, and channel count; lossy codec bitrate is also affected by codec design and content complexity.",
                ja: "ビットレートは 1 秒あたりの音声データ量で、通常 kbps で示します。非圧縮 PCM のビットレートはサンプルレート、ビット深度、チャンネル数から決まり、非可逆 Codec では設計とコンテンツの複雑さも影響します。",
                ko: "비트레이트는 초당 오디오 데이터 양이며 보통 kbps로 표시합니다. 비압축 PCM 비트레이트는 샘플레이트, 비트 깊이와 채널 수로 정해지고 손실 코덱의 비트레이트에는 코덱 설계와 콘텐츠 복잡도도 영향을 줍니다."
              }
            },
            {
              name: { zh: "PCM", en: "PCM", ja: "PCM", ko: "PCM" },
              explanation: {
                zh: "PCM 的完整过程是：先采样得到时间点，再量化得到幅度等级，最后把每个等级转换成固定位数的整数样本。播放器按采样率、位深和声道顺序读取这些样本，就能还原出连续播放的数字音频流。",
                en: "PCM works by sampling time points, quantizing amplitude levels, then converting each level into a fixed-width integer sample. Playback reads those samples according to sample rate, bit depth, and channel order to reconstruct a continuous digital audio stream.",
                ja: "PCM は時間点をサンプリングし、振幅レベルを量子化し、各レベルを固定幅の整数サンプルへ変換します。再生側はサンプルレート、ビット深度、チャンネル順に従って読み取り、連続したデジタル音声ストリームを再構成します。",
                ko: "PCM은 시간 지점을 샘플링하고 진폭 레벨을 양자화한 뒤 각 레벨을 고정 폭 정수 샘플로 바꾸는 방식입니다. 재생기는 샘플레이트, 비트 깊이와 채널 순서에 따라 샘플을 읽어 연속적인 디지털 오디오 스트림을 재구성합니다."
              }
            }
          ],
          lab: {
            type: "sampling-quantization",
            title: { zh: "采样、量化与编码实验室", en: "Sampling, Quantization, and Encoding Lab", ja: "サンプリング・量子化・エンコードラボ", ko: "샘플링, 양자화와 인코딩 실험실" },
            description: {
              zh: "进入独立界面调节采样率、位深和输入频率，观察采样点、量化阶梯、PCM 编码和常见压缩格式如何连接。",
              en: "Open an independent lab to adjust sample rate, bit depth, and input frequency while connecting samples, quantized steps, PCM encoding, and common compressed formats.",
              ja: "独立したラボでサンプルレート、ビット深度、入力周波数を調整し、サンプル、量子化ステップ、PCM エンコード、代表的な圧縮形式のつながりを観察します。",
              ko: "독립 실험실에서 샘플레이트, 비트 깊이와 입력 주파수를 조절하며 샘플, 양자화 단계, PCM 인코딩과 주요 압축 형식의 연결을 살펴봅니다."
            },
            buttonLabel: { zh: "打开采样、量化与编码实验室", en: "Open sampling, quantization, and encoding lab", ja: "サンプリング・量子化・エンコードラボを開く", ko: "샘플링, 양자화와 인코딩 실험실 열기" }
          },
          misconception: {
            zh: "采样率越高并不一定代表最终听感越好，码率相同也不代表不同编码器音质相同；录音、混音、播放链路、编码器实现和内容类型往往同样重要。",
            en: "A higher sample rate does not automatically mean better perceived quality, and equal bitrate does not mean equal quality across codecs; recording, mixing, playback hardware, codec implementation, and content type often matter just as much.",
            ja: "高いサンプルレートが知覚品質の向上を自動的に意味するわけではなく、同じビットレートでも Codec 間の品質は同じではありません。録音、ミックス、再生ハードウェア、Codec 実装、コンテンツの種類も同じくらい重要です。",
            ko: "샘플레이트가 높다고 지각 품질이 자동으로 좋아지는 것은 아니며 같은 비트레이트라고 코덱 간 품질이 같은 것도 아닙니다. 녹음, 믹싱, 재생 하드웨어, 코덱 구현과 콘텐츠 유형도 그만큼 중요합니다."
          },
          contentDirection: {
            zh: "适合做采样点可视化、量化阶梯图和不同编码格式对比表，解释音质、文件大小和延迟之间的取舍。",
            en: "This can become a sampling visualization, quantization staircase diagram, and codec comparison table explaining trade-offs among quality, file size, and latency.",
            ja: "サンプリングの可視化、量子化の階段図、Codec 比較表へ発展させ、音質、ファイルサイズ、遅延のトレードオフを説明できます。",
            ko: "샘플링 시각화, 양자화 계단 도해와 코덱 비교표로 확장해 품질, 파일 크기와 지연의 트레이드오프를 설명할 수 있습니다."
          }
        }
      },
      {
        title: { zh: "听感与指标", en: "Listening Perception and Metrics", ja: "聴感と指標", ko: "청감과 지표" },
        summary: {
          zh: "把响度、音色、空间感等主观听感和客观指标关联起来。",
          en: "Connect loudness, timbre, clarity, and spatial perception with measurable indicators.",
          ja: "音量、音色、明瞭度、空間知覚を測定可能な指標と結び付けます。",
          ko: "음량, 음색, 명료도와 공간 지각을 측정 가능한 지표와 연결합니다."
        },
        bullets: [
          { zh: "响度、音色、清晰度", en: "Loudness, timbre, clarity", ja: "音量、音色、明瞭度", ko: "음량, 음색, 명료도" },
          { zh: "频响、SPL、THD", en: "Frequency response, SPL, THD", ja: "周波数特性、SPL、THD", ko: "주파수 응답, SPL, THD" },
          { zh: "主观评价与客观测量", en: "Subjective evaluation and objective measurement", ja: "主観評価と客観測定", ko: "주관 평가와 객관 측정" }
        ],
        detail: {
          explanation: {
            zh: "听感是人对声音的综合判断，受到响度、频率分布、瞬态、失真、空间反射和个人经验影响。工程指标能帮助定位问题，但需要结合实际试听和场景目标解读。",
            en: "Listening perception is a combined judgment shaped by loudness, frequency balance, transients, distortion, spatial reflections, and personal experience. Engineering metrics help locate issues, but they must be interpreted with listening tests and product goals.",
            ja: "聴感は、音量、周波数バランス、過渡成分、歪み、空間反射、個人の経験によって形作られる総合的な判断です。工学的な指標は問題の切り分けに役立ちますが、実際の試聴と製品の目的を合わせて解釈する必要があります。",
            ko: "청감은 음량, 주파수 균형, 과도 성분, 왜곡, 공간 반사와 개인 경험이 함께 만드는 종합적인 판단입니다. 공학 지표는 문제를 찾는 데 도움이 되지만 실제 청취 테스트와 제품 목표를 함께 고려해 해석해야 합니다."
          },
          keyConcepts: [
            { zh: "响度和声压级不同，LUFS 更适合描述节目整体响度。", en: "Loudness and sound pressure level are different; LUFS is better for program loudness.", ja: "ラウドネスと音圧レベルは異なり、番組全体の音量には LUFS が適しています。", ko: "음량과 음압 레벨은 다르며 프로그램 전체 음량은 LUFS로 나타내는 것이 더 적합합니다." },
            { zh: "频响曲线描述不同频率的能量变化，但不能单独决定音质。", en: "Frequency response describes energy variation by frequency, but it does not determine quality alone.", ja: "周波数特性は周波数ごとのエネルギー変化を表しますが、それだけで音質は決まりません。", ko: "주파수 응답은 주파수별 에너지 변화를 나타내지만 그것만으로 음질이 결정되지는 않습니다." },
            { zh: "THD、SNR、延迟、串扰分别描述失真、噪声、时间延后和通道隔离，测量条件必须同时说明。", en: "THD, SNR, latency, and crosstalk describe distortion, noise, time delay, and channel isolation; measurement conditions must also be stated.", ja: "THD、SNR、遅延、クロストークはそれぞれ歪み、ノイズ、時間的な遅れ、チャンネル分離を表します。測定条件も必ず併記します。", ko: "THD, SNR, 지연과 크로스토크는 각각 왜곡, 잡음, 시간 지연과 채널 분리를 나타내므로 측정 조건도 함께 명시해야 합니다." }
          ],
          termExplanations: [
            {
              name: { zh: "响度", en: "Loudness", ja: "ラウドネス", ko: "음량" },
              explanation: {
                zh: "响度是人耳主观感受到的声音大小，不等同于瞬时声压。SPL 常用于物理声压测量，LUFS 更适合描述节目整体响度，播客、视频和流媒体通常会按 LUFS 做响度归一。",
                en: "Loudness is perceived sound level, not the same as instantaneous pressure. SPL measures physical sound pressure, while LUFS is better for program loudness and is commonly used for podcasts, video, and streaming normalization.",
                ja: "ラウドネスは知覚される音の大きさで、瞬間的な音圧とは異なります。SPL は物理的な音圧を測定し、LUFS は番組全体の音量に適しているため、ポッドキャスト、動画、配信の正規化によく使われます。",
                ko: "음량은 지각되는 소리의 크기로 순간 음압과는 다릅니다. SPL은 물리적 음압을 측정하고 LUFS는 프로그램 전체 음량에 더 적합해 팟캐스트, 동영상과 스트리밍 정규화에 흔히 사용됩니다."
              }
            },
            {
              name: { zh: "频响曲线", en: "Frequency response", ja: "周波数特性", ko: "주파수 응답" },
              explanation: {
                zh: "频响曲线描述设备或处理链对不同频率的增强或衰减。高频偏多可能听起来明亮甚至刺耳，低中频堆积可能显得浑浊，低频不足则容易单薄。",
                en: "Frequency response shows how a device or processing chain boosts or cuts different frequencies. More treble can sound bright or harsh, low-mid buildup can sound muddy, and weak bass can feel thin.",
                ja: "周波数特性は、機器や処理チェーンが周波数ごとにどれだけ増幅または減衰するかを示します。高域が多いと明るく、場合によっては刺さって聞こえ、低中域の蓄積はこもり、低域不足は薄く感じられます。",
                ko: "주파수 응답은 장치나 처리 체인이 주파수별로 얼마나 증폭하거나 감쇠하는지 보여줍니다. 고역이 많으면 밝거나 거칠게 들리고 저중역이 쌓이면 탁하게 들리며 저역이 약하면 얇게 느껴질 수 있습니다."
              }
            },
            {
              name: { zh: "动态范围", en: "Dynamic range", ja: "ダイナミックレンジ", ko: "다이내믹 레인지" },
              explanation: {
                zh: "动态范围描述信号或系统中最低可用电平与最大不失真电平之间的跨度。压缩器会缩小超过阈值部分的强弱差；若再加入补偿增益，整体听感可能更靠前。",
                en: "Dynamic range is the span between a signal or system's lowest usable level and highest undistorted level. Compression narrows level differences above a threshold; makeup gain can then make the result feel more forward.",
                ja: "ダイナミックレンジは、信号やシステムで使える最小レベルと歪みのない最大レベルの幅です。コンプレッションはしきい値を超えた部分のレベル差を狭め、メイクアップゲインを加えると全体が前に出て感じられます。",
                ko: "다이내믹 레인지는 신호나 시스템에서 사용할 수 있는 최저 레벨과 왜곡이 없는 최고 레벨 사이의 범위입니다. 컴프레션은 임계값을 넘는 부분의 레벨 차를 줄이고 메이크업 게인을 추가하면 결과가 더 앞으로 느껴질 수 있습니다."
              }
            },
            {
              name: { zh: "SNR", en: "SNR", ja: "SNR", ko: "SNR" },
              explanation: {
                zh: "SNR 是信噪比，表示有效信号与底噪之间的差距。SNR 越低，底噪、嘶声或电流声越容易被听见，语音清晰度和安静段质量会下降。",
                en: "SNR is signal-to-noise ratio, the gap between useful signal and noise floor. Lower SNR makes hiss or electrical noise easier to hear and reduces speech clarity and quiet-section quality.",
                ja: "SNR は信号対雑音比で、有効信号とノイズフロアの差です。SNR が低いとヒスノイズや電気ノイズが聞こえやすくなり、音声の明瞭度や静かな部分の品質が低下します。",
                ko: "SNR은 신호 대 잡음비로 유효 신호와 노이즈 플로어 사이의 차이입니다. SNR이 낮으면 히스나 전기 잡음이 더 잘 들리고 음성 명료도와 조용한 구간의 품질이 떨어집니다."
              }
            },
            {
              name: { zh: "THD / THD+N", en: "THD / THD+N", ja: "THD / THD+N", ko: "THD / THD+N" },
              explanation: {
                zh: "THD 描述非线性产生的谐波总量，THD+N 还把测量带宽内的噪声算入。相同数值也可能因谐波阶次、频率和电平不同而听起来不同。",
                en: "THD describes total harmonics created by nonlinearity, while THD+N also includes noise inside the measurement bandwidth. The same value can sound different with different harmonic orders, frequencies, and levels.",
                ja: "THD は非線形性で生じる高調波の総量を表し、THD+N は測定帯域内のノイズも含みます。同じ数値でも、高調波の次数、周波数、レベルが違えば聞こえ方は変わります。",
                ko: "THD는 비선형성으로 생긴 전체 배음량을 나타내고 THD+N은 측정 대역 내 잡음도 포함합니다. 같은 수치라도 배음 차수, 주파수와 레벨에 따라 다르게 들릴 수 있습니다."
              }
            },
            {
              name: { zh: "声像与空间感", en: "Stereo image and space", ja: "ステレオイメージと空間感", ko: "스테레오 이미지와 공간감" },
              explanation: {
                zh: "水平声像主要依赖左右耳或声道间的电平差与到达时间差，空间感还受频谱线索、早期反射和混响影响。串扰、极性或相位问题会让定位变糊。",
                en: "Horizontal imaging mainly relies on interaural or interchannel level and arrival-time differences; spectral cues, early reflections, and reverberation also shape space. Crosstalk, polarity, or phase problems can blur localization.",
                ja: "水平方向の音像は主に両耳間またはチャンネル間のレベル差と到達時間差に依存し、周波数手がかり、初期反射、残響も空間感を形作ります。クロストーク、極性、位相の問題は定位をぼかします。",
                ko: "수평 음상은 주로 양 귀 또는 채널 간 레벨 차와 도달 시간 차에 의존하며 주파수 단서, 초기 반사와 잔향도 공간감을 만듭니다. 크로스토크, 극성 또는 위상 문제는 위치감을 흐릴 수 있습니다."
              }
            }
          ],
          lab: {
            type: "listening-metrics",
            title: { zh: "听感与指标实验室", en: "Listening Metrics Lab", ja: "聴感と指標ラボ", ko: "청감과 지표 실험실" },
            description: {
              zh: "进入独立界面切换明亮、浑浊、底噪、失真、动态压缩和声像偏移，查看对应指标并播放短音效对照。",
              en: "Open an independent lab to switch between brightness, muddiness, noise floor, distortion, compression, and stereo shift while viewing metrics and hearing short examples.",
              ja: "独立したラボで、明るさ、こもり、ノイズフロア、歪み、コンプレッション、ステレオ移動を切り替え、指標を見ながら短い音の例を試聴します。",
              ko: "독립 실험실에서 밝은 음색, 탁함, 노이즈 플로어, 왜곡, 컴프레션과 스테레오 이동을 전환하고 지표를 보며 짧은 소리 예시를 들어봅니다."
            },
            buttonLabel: { zh: "打开听感与指标实验室", en: "Open listening metrics lab", ja: "聴感と指標ラボを開く", ko: "청감과 지표 실험실 열기" }
          },
          misconception: {
            zh: "一个漂亮的指标不能代表完整听感；同样的曲线在不同房间、耳机佩戴方式和内容类型下可能听起来完全不同。",
            en: "One impressive metric cannot represent the whole listening experience; the same curve can sound different across rooms, headphone fits, and content types.",
            ja: "印象的な 1 つの指標だけで聴感全体を表すことはできません。同じ曲線でも部屋、ヘッドホンの装着状態、コンテンツの種類によって聞こえ方は変わります。",
            ko: "인상적인 하나의 지표만으로 전체 청취 경험을 나타낼 수 없습니다. 같은 곡선도 공간, 헤드폰 착용 상태와 콘텐츠 유형에 따라 다르게 들릴 수 있습니다."
          },
          contentDirection: {
            zh: "适合扩展为指标速查卡、主观听感词典和真实测量案例，帮助读者建立“听到什么，对应可能是什么指标”的判断路径。",
            en: "This can become a metric cheat sheet, listening vocabulary guide, and measurement case study that maps perceived problems to likely indicators.",
            ja: "指標の早見表、聴感語彙ガイド、知覚した問題を考えられる指標に対応付ける測定事例へ発展できます。",
            ko: "지표 요약표, 청감 어휘 안내서와 지각된 문제를 가능한 지표에 연결하는 측정 사례로 확장할 수 있습니다."
          }
        }
      }
    ]
  },
  {
    id: "hardware",
    icon: Headphones,
    accent: "#c46f2a",
    title: { zh: "音频硬件", en: "Audio Hardware", ja: "音声ハードウェア", ko: "오디오 하드웨어" },
    description: {
      zh: "从采集、转换、放大到播放理解完整硬件链路。",
      en: "Understand the hardware chain from capture and conversion to amplification and playback.",
      ja: "収音、変換、増幅、再生までのハードウェアチェーンを理解します。",
      ko: "캡처와 변환부터 증폭과 재생까지의 하드웨어 체인을 이해합니다."
    },
    topics: [
      {
        title: { zh: "麦克风", en: "Microphones", ja: "マイク", ko: "마이크" },
        summary: {
          zh: "从换能原理、类型、参数和使用场景理解麦克风如何把声音变成电信号。",
          en: "Understand how microphones convert sound into electrical signals through transducer principles, types, specifications, and use cases.",
          ja: "変換原理、種類、仕様、用途を通して、マイクが音を電気信号へ変える仕組みを理解します。",
          ko: "변환 원리, 종류, 사양과 사용 사례를 통해 마이크가 소리를 전기 신호로 바꾸는 방식을 이해합니다."
        },
        bullets: [
          { zh: "换能原理与常见麦克风类型", en: "Transducer principle and microphone types", ja: "変換原理と代表的なマイクの種類", ko: "변환 원리와 주요 마이크 종류" },
          { zh: "灵敏度、频响、SNR、最大 SPL", en: "Sensitivity, frequency response, SNR, maximum SPL", ja: "感度、周波数特性、SNR、最大 SPL", ko: "감도, 주파수 응답, SNR, 최대 SPL" },
          { zh: "指向性、距离、增益和阵列拾音", en: "Polar pattern, distance, gain, and array pickup", ja: "指向性、距離、ゲイン、アレイ収音", ko: "지향성, 거리, 게인과 어레이 수음" }
        ],
        detail: {
          explanation: {
            zh: "麦克风把声压变化转换成电信号：动圈麦利用电磁感应，常见电容、驻极体和电容式 MEMS 麦利用振膜与背板之间的电容变化。模拟输出经前级、滤波和 ADC 进入数字系统；数字麦已在内部完成模数转换，PDM 输出需抽取为 PCM，I2S 型号则输出 PCM 数据。",
            en: "Microphones convert pressure changes into electrical signals. Moving-coil microphones use electromagnetic induction; common condenser, electret, and capacitive MEMS microphones use diaphragm-to-backplate capacitance changes. Analog outputs need a preamp, filtering, and ADC. Digital microphones convert internally: PDM output needs decimation to PCM, while I2S models output PCM data.",
            ja: "マイクは圧力変化を電気信号に変換します。ムービングコイル型は電磁誘導を使い、一般的なコンデンサー型、エレクトレット型、容量式 MEMS 型は振動板とバックプレートの静電容量変化を使います。アナログ出力にはプリアンプ、フィルター、ADC が必要です。デジタルマイクは内部で変換し、PDM 出力は PCM へのデシメーション、I2S 型は PCM データの出力を行います。",
            ko: "마이크는 압력 변화를 전기 신호로 변환합니다. 무빙 코일 마이크는 전자기 유도를 사용하고 일반적인 콘덴서, 일렉트릿과 정전용량 MEMS 마이크는 진동판과 백플레이트 사이의 정전용량 변화를 사용합니다. 아날로그 출력에는 프리앰프, 필터와 ADC가 필요합니다. 디지털 마이크는 내부에서 변환하며 PDM 출력은 PCM으로 데시메이션해야 하고 I2S 모델은 PCM 데이터를 출력합니다."
          },
          chainContext: {
            stage: { zh: "采集入口：声学到电信号", en: "Chain position: capture entry from acoustics to electricity", ja: "チェーン位置：音響から電気信号への収音入口", ko: "체인 위치: 음향에서 전기 신호로 들어오는 캡처 단계" },
            input: { zh: "声压变化 Δp 与声源方向", en: "Sound-pressure variation Δp and source direction", ja: "音圧変化 Δp と音源方向", ko: "음압 변화 Δp와 음원 방향" },
            output: { zh: "模拟电压，或经过前端后的 PDM / I2S 数据", en: "Analog voltage, or PDM / I2S data after the front end", ja: "アナログ電圧、またはフロントエンド後の PDM / I2S データ", ko: "아날로그 전압 또는 프런트엔드 이후의 PDM / I2S 데이터" },
            next: { zh: "进入 ADC、Codec 或数字麦克风接口", en: "Next: ADC, codec, or digital-microphone interface", ja: "次：ADC、Codec、デジタルマイクインターフェース", ko: "다음: ADC, Codec 또는 디지털 마이크 인터페이스" }
          },
          keyConcepts: [
            { zh: "动圈麦耐用、抗大声压，适合舞台和近讲；电容麦灵敏、细节多，常用于录音棚和播客。", en: "Dynamic microphones are durable and tolerate high SPL, useful on stage and close speech; condenser microphones are sensitive and detailed, common in studios and podcasts.", ja: "ダイナミックマイクは丈夫で高 SPL に耐え、ステージや近接収音に向きます。コンデンサーマイクは感度と細部の再現に優れ、スタジオやポッドキャストでよく使われます。", ko: "다이내믹 마이크는 내구성이 높고 큰 SPL을 견뎌 무대와 근접 음성에 적합하며 콘덴서 마이크는 감도와 세부 표현이 좋아 스튜디오와 팟캐스트에 흔합니다." },
            { zh: "驻极体和 MEMS 麦克风体积小、成本低，广泛用于手机、耳机、会议设备、IoT 和车载语音。", en: "Electret and MEMS microphones are compact and low-cost, widely used in phones, earbuds, conferencing devices, IoT, and vehicle voice systems.", ja: "エレクトレットマイクと MEMS マイクは小型で低コストなため、スマートフォン、イヤホン、会議機器、IoT、車載音声に広く使われます。", ko: "일렉트릿과 MEMS 마이크는 작고 저렴해 휴대폰, 이어버드, 회의 장비, IoT와 차량 음성 시스템에 널리 사용됩니다." },
            { zh: "灵敏度、等效自噪声、SNR、最大 SPL、频响和指向性共同决定可录到的声音质量。", en: "Sensitivity, equivalent self-noise, SNR, maximum SPL, frequency response, and polar pattern together shape capture quality.", ja: "感度、等価自己雑音、SNR、最大 SPL、周波数特性、指向性が収音品質を総合的に決めます。", ko: "감도, 등가 자체 잡음, SNR, 최대 SPL, 주파수 응답과 지향성이 함께 수음 품질을 결정합니다." },
            { zh: "距离、房间反射、安装位置和增益设置经常比麦克风价格更直接影响录音结果。", en: "Distance, room reflections, placement, and gain staging often affect the recording more directly than microphone price.", ja: "距離、部屋の反射、設置位置、ゲイン設定は、マイクの価格よりも録音結果に直接影響することがよくあります。", ko: "거리, 공간 반사, 설치 위치와 게인 설정이 마이크 가격보다 녹음 결과에 더 직접적인 영향을 주는 경우가 많습니다." }
          ],
          termExplanations: [
            {
              name: { zh: "换能过程", en: "Transduction", ja: "変換過程", ko: "변환 과정" },
              explanation: {
                zh: "声波先推动振膜运动，振膜运动再被转换成电信号。动圈麦利用线圈在磁场中运动产生电压；电容麦利用振膜和背板之间的电容变化；MEMS 麦则把微型机械结构和电子电路集成在芯片中。",
                en: "Sound first moves a diaphragm, and that movement becomes an electrical signal. Dynamic mics generate voltage from a moving coil in a magnetic field; condenser mics use capacitance changes; MEMS mics integrate micro-mechanical structures and electronics on a chip.",
                ja: "音はまず振動板を動かし、その動きが電気信号になります。ダイナミックマイクは磁界中のコイルの動きから電圧を生み、コンデンサーマイクは静電容量の変化を使い、MEMS マイクは微小機械構造と電子回路をチップに集積します。",
                ko: "소리는 먼저 진동판을 움직이고 그 움직임이 전기 신호가 됩니다. 다이내믹 마이크는 자기장 속 코일의 움직임으로 전압을 만들고 콘덴서 마이크는 정전용량 변화를 사용하며 MEMS 마이크는 미세 기계 구조와 전자 회로를 칩에 집적합니다."
              }
            },
            {
              name: { zh: "动圈麦克风", en: "Dynamic microphone", ja: "ダイナミックマイク", ko: "다이내믹 마이크" },
              explanation: {
                zh: "动圈麦结构像小型反向扬声器，耐用、抗摔、能承受很高声压，不需要幻象电源。它通常灵敏度较低，需要较多前级增益，适合舞台、人声近讲、鼓和吉他箱体。",
                en: "A dynamic mic works like a small speaker in reverse. It is rugged, handles high SPL, and needs no phantom power. It is usually less sensitive and needs more preamp gain, making it useful for stage vocals, close speech, drums, and guitar cabinets.",
                ja: "ダイナミックマイクは小さなスピーカーを逆向きに使うような構造です。頑丈で高 SPL に対応し、ファンタム電源も不要です。通常は感度が低く、より大きなプリアンプゲインが必要なため、ステージボーカル、近接音声、ドラム、ギターキャビネットに向きます。",
                ko: "다이내믹 마이크는 작은 스피커를 거꾸로 사용하는 것과 비슷합니다. 튼튼하고 높은 SPL을 처리하며 팬텀 전원이 필요하지 않습니다. 보통 감도가 낮아 더 큰 프리앰프 게인이 필요하므로 무대 보컬, 근접 음성, 드럼과 기타 캐비닛에 적합합니다."
              }
            },
            {
              name: { zh: "电容麦克风", en: "Condenser microphone", ja: "コンデンサーマイク", ko: "콘덴서 마이크" },
              explanation: {
                zh: "电容麦利用振膜和背板组成电容，需要极化电压和内部放大电路，常通过 48V 幻象电源供电。它灵敏度高、瞬态和高频细节好，但更容易收进房间噪声和反射。",
                en: "A condenser mic uses a diaphragm and backplate as a capacitor, requiring polarization and active electronics, often powered by 48V phantom power. It is sensitive and detailed, but also captures more room noise and reflections.",
                ja: "コンデンサーマイクは振動板とバックプレートをコンデンサーとして使い、分極電圧とアクティブ回路を必要とします。多くは 48V ファンタム電源で動作します。感度と細部再現に優れますが、部屋のノイズや反射も多く拾います。",
                ko: "콘덴서 마이크는 진동판과 백플레이트를 커패시터로 사용하므로 분극 전압과 능동 회로가 필요하고 보통 48V 팬텀 전원으로 구동합니다. 감도와 세부 표현이 좋지만 공간 잡음과 반사도 더 많이 수음합니다."
              }
            },
            {
              name: { zh: "驻极体 / MEMS", en: "Electret / MEMS", ja: "エレクトレット / MEMS", ko: "일렉트릿 / MEMS" },
              explanation: {
                zh: "驻极体麦把电荷固化在材料中，降低供电需求；MEMS 麦把机械振膜、前端电路和封装做成芯片级器件。它们适合小体积、多麦阵列和量产设备，数字 MEMS 常直接输出 PDM 或 I2S 数据。",
                en: "Electret mics store charge in material, reducing bias requirements; MEMS mics package diaphragm, front-end electronics, and housing as chip-scale parts. They suit compact devices, arrays, and mass production, with digital MEMS often outputting PDM or I2S.",
                ja: "エレクトレットマイクは材料に電荷を保持してバイアスの要件を減らします。MEMS マイクは振動板、フロントエンド回路、パッケージをチップサイズの部品にまとめます。小型機器、アレイ、量産に向き、デジタル MEMS は PDM または I2S を出力することが多いです。",
                ko: "일렉트릿 마이크는 재료에 전하를 저장해 바이어스 요구를 줄이고 MEMS 마이크는 진동판, 프런트엔드 전자 회로와 하우징을 칩 크기 부품으로 패키징합니다. 소형 기기, 어레이와 대량 생산에 적합하며 디지털 MEMS는 PDM 또는 I2S를 출력하는 경우가 많습니다."
              }
            },
            {
              name: { zh: "灵敏度", en: "Sensitivity", ja: "感度", ko: "감도" },
              explanation: {
                zh: "灵敏度表示在标准声压下麦克风输出多大的电平，常用 mV/Pa 或 dBV/Pa 表示。灵敏度高不等于音质更好，它只说明同样声音下输出更大，后端增益需求更低。",
                en: "Sensitivity describes output level at a standard sound pressure, often in mV/Pa or dBV/Pa. Higher sensitivity does not mean better quality; it means more output for the same sound and less required downstream gain.",
                ja: "感度は標準音圧での出力レベルを表し、mV/Pa や dBV/Pa で示すことが多いです。感度が高いから音質が良いのではなく、同じ音に対して出力が大きく、後段に必要なゲインが小さいという意味です。",
                ko: "감도는 표준 음압에서의 출력 레벨을 나타내며 보통 mV/Pa 또는 dBV/Pa로 표시합니다. 감도가 높다고 품질이 좋은 것은 아니고 같은 소리에 더 큰 출력을 내며 후단에 필요한 게인이 작다는 뜻입니다."
              }
            },
            {
              name: { zh: "频率响应", en: "Frequency response", ja: "周波数特性", ko: "주파수 응답" },
              explanation: {
                zh: "频率响应描述麦克风对不同频率的拾取差异。人声麦常会有低频近讲增强或高频存在感提升；测量麦则追求更平直，用来反映真实声场。",
                en: "Frequency response shows how a mic captures different frequencies. Vocal mics may add proximity bass or presence boost; measurement mics aim to be flatter to represent the real sound field.",
                ja: "周波数特性はマイクが周波数ごとにどのように収音するかを示します。ボーカルマイクは近接効果の低域やプレゼンスを加えることがあり、測定用マイクは実際の音場を表すため平坦な特性を目指します。",
                ko: "주파수 응답은 마이크가 주파수별로 어떻게 수음하는지 보여줍니다. 보컬 마이크는 근접 효과의 저역이나 존재감을 더할 수 있고 측정용 마이크는 실제 음장을 나타내기 위해 더 평탄한 특성을 지향합니다."
              }
            },
            {
              name: { zh: "指向性", en: "Polar pattern", ja: "指向性", ko: "지향성" },
              explanation: {
                zh: "指向性描述麦克风从不同方向收声的强弱。全指向各方向接近一致，心形主要收前方并抑制后方，8 字形收前后并抑制侧面。它直接影响抗噪、离轴音色和多人拾音。",
                en: "Polar pattern describes pickup strength by direction. Omni captures nearly all directions, cardioid favors the front and rejects the rear, and figure-8 captures front/back while rejecting the sides. It affects noise rejection, off-axis tone, and multi-person capture.",
                ja: "指向性は方向ごとの収音強度を表します。無指向性はほぼ全方向を拾い、カーディオイドは前方を優先して後方を抑え、8 の字型は前後を拾って側面を抑えます。ノイズ除去、軸外の音色、複数人収音に影響します。",
                ko: "지향성은 방향별 수음 세기를 나타냅니다. 무지향성은 거의 모든 방향을 수음하고 카디오이드는 전면을 우선하며 후면을 억제하고 8자형은 전후를 수음하면서 측면을 억제합니다. 소음 억제, 오프축 음색과 여러 사람 수음에 영향을 줍니다."
              }
            },
            {
              name: { zh: "自噪声 / SNR", en: "Self-noise / SNR", ja: "自己雑音 / SNR", ko: "자체 잡음 / SNR" },
              explanation: {
                zh: "自噪声是麦克风自身电子和热噪声造成的底噪，SNR 表示目标声和噪声之间的差距。安静录音、人声远场和会议拾音尤其依赖低自噪声和高 SNR。",
                en: "Self-noise is the mic's own electronic and thermal noise floor, while SNR is the gap between target sound and noise. Quiet recording, far-field voice, and conferencing depend strongly on low self-noise and high SNR.",
                ja: "自己雑音はマイク自身の電子ノイズと熱雑音によるノイズフロアで、SNR は目的音とノイズの差です。静かな録音、遠距離音声、会議収音では低い自己雑音と高い SNR が特に重要です。",
                ko: "자체 잡음은 마이크 자체의 전자 잡음과 열 잡음으로 생기는 노이즈 플로어이고 SNR은 목표 소리와 잡음 사이의 차이입니다. 조용한 녹음, 원거리 음성과 회의 수음에서는 낮은 자체 잡음과 높은 SNR이 특히 중요합니다."
              }
            },
            {
              name: { zh: "最大 SPL", en: "Maximum SPL", ja: "最大 SPL", ko: "최대 SPL" },
              explanation: {
                zh: "最大 SPL 表示麦克风在失真达到规定阈值前能承受多大的声压。鼓、铜管、吉他箱体和近距离喊叫需要更高最大 SPL，否则前端可能过载产生破音。",
                en: "Maximum SPL indicates how loud a source can be before distortion reaches a specified threshold. Drums, brass, guitar cabinets, and close shouting need higher maximum SPL to avoid front-end overload.",
                ja: "最大 SPL は、歪みが規定のしきい値に達する前に音源がどれだけ大きくできるかを示します。ドラム、金管楽器、ギターキャビネット、近距離の叫び声には、フロントエンドの過負荷を避けるため高い最大 SPL が必要です。",
                ko: "최대 SPL은 왜곡이 정해진 임계값에 도달하기 전에 음원이 얼마나 클 수 있는지를 나타냅니다. 드럼, 금관악기, 기타 캐비닛과 가까운 고함은 프런트엔드 과부하를 피하려면 더 높은 최대 SPL이 필요합니다."
              }
            },
            {
              name: { zh: "幻象电源 48V", en: "48V phantom power", ja: "48V ファンタム電源", ko: "48V 팬텀 전원" },
              explanation: {
                zh: "48V 幻象电源通过平衡线给电容麦内部电路供电。它不是音质增强开关，动圈麦通常不需要；错误接线或不兼容设备可能带来噪声或风险。",
                en: "48V phantom power feeds condenser mic electronics through balanced cables. It is not a quality boost switch, and dynamic mics usually do not need it; wrong wiring or incompatible gear can cause noise or risk.",
                ja: "48V ファンタム電源はバランスケーブルを通じてコンデンサーマイクの回路に電力を供給します。音質を高めるスイッチではなく、ダイナミックマイクには通常不要です。誤配線や非対応機器はノイズや危険を招くことがあります。",
                ko: "48V 팬텀 전원은 밸런스 케이블을 통해 콘덴서 마이크 회로에 전원을 공급합니다. 음질 향상 스위치가 아니며 다이내믹 마이크에는 보통 필요하지 않습니다. 잘못된 배선이나 호환되지 않는 장비는 잡음이나 위험을 일으킬 수 있습니다."
              }
            },
            {
              name: { zh: "麦克风阵列", en: "Microphone array", ja: "マイクアレイ", ko: "마이크 어레이" },
              explanation: {
                zh: "多个麦克风可以利用到达时间差、相位差和电平差判断方向，并通过波束成形增强目标声源、抑制噪声和回声。手机、会议机、智能音箱和车载语音常用阵列。",
                en: "Multiple microphones can use time, phase, and level differences to estimate direction, then beamform toward the target while suppressing noise and echo. Phones, conference devices, smart speakers, and cars commonly use arrays.",
                ja: "複数のマイクは到達時間差、位相差、レベル差を使って方向を推定し、ノイズやエコーを抑えながら目的音源へビームフォーミングできます。スマートフォン、会議機器、スマートスピーカー、車載音声で一般的です。",
                ko: "여러 마이크는 도달 시간 차, 위상 차와 레벨 차를 이용해 방향을 추정한 뒤 잡음과 에코를 억제하면서 목표 음원으로 빔포밍할 수 있습니다. 휴대폰, 회의 장비, 스마트 스피커와 차량에서 흔히 사용합니다."
              }
            }
          ],
          lab: {
            type: "microphone",
            title: { zh: "麦克风指向性与拾音实验室", en: "Microphone Pickup Lab", ja: "マイク収音ラボ", ko: "마이크 수음 실험실" },
            description: {
              zh: "进入独立界面切换全指向、心形和 8 字形，拖动声源角度、距离和增益，观察拾音强度、噪声和削波风险。",
              en: "Open an independent lab to switch omni, cardioid, and figure-8 patterns, then adjust source angle, distance, and gain to see pickup strength, noise, and clipping risk.",
              ja: "独立したラボで無指向性、カーディオイド、8 の字型を切り替え、音源角度、距離、ゲインを調整して収音強度、ノイズ、クリップのリスクを確認します。",
              ko: "독립 실험실에서 무지향성, 카디오이드와 8자형을 전환하고 음원 각도, 거리와 게인을 조절해 수음 세기, 잡음과 클리핑 위험을 확인합니다."
            },
            buttonLabel: { zh: "打开麦克风实验室", en: "Open microphone lab", ja: "マイクラボを開く", ko: "마이크 실험실 열기" }
          },
          misconception: {
            zh: "更贵的麦克风不能自动解决糟糕声学环境；房间混响、安装位置、拾音距离、结构噪声和前级增益经常比麦克风型号更关键。",
            en: "A more expensive microphone does not automatically fix bad acoustics; room reverberation, placement, pickup distance, mechanical noise, and preamp gain are often more important than the model.",
            ja: "高価なマイクだけで劣悪な音響環境が自動的に改善するわけではありません。部屋の残響、設置、収音距離、機械ノイズ、プリアンプゲインは、機種より重要なことがよくあります。",
            ko: "더 비싼 마이크가 나쁜 음향 환경을 자동으로 해결해 주지는 않습니다. 공간 잔향, 설치 위치, 수음 거리, 기계 잡음과 프리앰프 게인이 모델보다 더 중요한 경우가 많습니다."
          },
          contentDirection: {
            zh: "适合继续扩展为麦克风类型对比表、指向性极坐标图、近讲效应示例、阵列拾音动画和真实录音问题排查清单。",
            en: "This can expand into microphone type comparisons, polar diagrams, proximity-effect examples, array pickup animations, and recording troubleshooting checklists.",
            ja: "マイクの種類比較、極座標図、近接効果の例、アレイ収音アニメーション、録音トラブルシューティングのチェックリストへ発展できます。",
            ko: "마이크 종류 비교, 극좌표 도해, 근접 효과 예시, 어레이 수음 애니메이션과 녹음 문제 해결 체크리스트로 확장할 수 있습니다."
          }
        }
      },
      {
        title: { zh: "ADC / DAC / Codec", en: "ADC / DAC / Codec", ja: "ADC / DAC / Codec", ko: "ADC / DAC / Codec" },
        summary: {
          zh: "理解模拟音频如何采样成数字、数字音频如何重建为模拟，以及音频 Codec 芯片如何整合整条链路。",
          en: "Understand how analog audio becomes digital samples, how digital audio is reconstructed to analog, and how audio codec chips integrate the whole chain.",
          ja: "アナログ音声がデジタルサンプルになり、デジタル音声がアナログへ再構成され、オーディオ Codec チップがチェーン全体を統合する仕組みを理解します。",
          ko: "아날로그 오디오가 디지털 샘플이 되고 디지털 오디오가 아날로그로 재구성되며 오디오 Codec 칩이 전체 체인을 통합하는 방식을 이해합니다."
        },
        bullets: [
          { zh: "ADC 采样、量化、抗混叠和输入范围", en: "ADC sampling, quantization, anti-aliasing, and input range", ja: "ADC のサンプリング、量子化、アンチエイリアス、入力範囲", ko: "ADC 샘플링, 양자화, 앨리어싱 방지와 입력 범위" },
          { zh: "DAC 重建、保持、低通滤波和输出驱动", en: "DAC reconstruction, hold, low-pass filtering, and output drive", ja: "DAC の再構成、保持、ローパスフィルター、出力駆動", ko: "DAC 재구성, 홀드, 로우패스 필터와 출력 구동" },
          { zh: "Codec 芯片、PGA、混音、I2S/PDM/TDM、时钟和电源噪声", en: "Codec chips, PGA, mixing, I2S/PDM/TDM, clocking, and power noise", ja: "Codec チップ、PGA、ミキシング、I2S/PDM/TDM、クロック、電源ノイズ", ko: "Codec 칩, PGA, 믹싱, I2S/PDM/TDM, 클록과 전원 잡음" }
        ],
        detail: {
          explanation: {
            zh: "ADC 把麦克风、线路输入等模拟电压按固定时钟采样并量化成数字样本；DAC 把数字样本转换成阶梯状或调制后的模拟信号，再经过重建滤波和输出级驱动耳机、功放或线路输出。音频 Codec 芯片通常把 ADC、DAC、PGA、耳机放大、混音、数字滤波、时钟和 I2S/PDM/TDM 接口集成在一起，是嵌入式音频链路的核心器件。",
            en: "An ADC samples and quantizes analog voltage from microphones or line inputs into digital samples. A DAC converts digital samples into stepped or modulated analog signals, then uses reconstruction filtering and output stages to drive headphones, amplifiers, or line outputs. An audio codec chip often integrates ADCs, DACs, PGA, headphone amps, mixers, digital filters, clocks, and I2S/PDM/TDM interfaces.",
            ja: "ADC はマイクやライン入力のアナログ電圧をサンプリングし、量子化してデジタルサンプルにします。DAC はデジタルサンプルを階段状または変調されたアナログ信号に変換し、再構成フィルターと出力段でヘッドホン、アンプ、ライン出力を駆動します。オーディオ Codec チップは ADC、DAC、PGA、ヘッドホンアンプ、ミキサー、デジタルフィルター、クロック、I2S/PDM/TDM インターフェースを統合することが多いです。",
            ko: "ADC는 마이크나 라인 입력의 아날로그 전압을 샘플링하고 양자화해 디지털 샘플로 만듭니다. DAC는 디지털 샘플을 계단형 또는 변조된 아날로그 신호로 변환한 뒤 재구성 필터와 출력단으로 헤드폰, 앰프 또는 라인 출력을 구동합니다. 오디오 Codec 칩은 ADC, DAC, PGA, 헤드폰 앰프, 믹서, 디지털 필터, 클록과 I2S/PDM/TDM 인터페이스를 통합하는 경우가 많습니다."
          },
          chainContext: {
            stage: { zh: "转换与模拟边界", en: "Chain position: analog/digital boundary", ja: "チェーン位置：アナログとデジタルの境界", ko: "체인 위치: 아날로그/디지털 경계" },
            input: { zh: "模拟电压，或待播放的 PCM 样本", en: "Analog voltage, or PCM samples ready for playback", ja: "アナログ電圧、または再生待ちの PCM サンプル", ko: "아날로그 전압 또는 재생 대기 중인 PCM 샘플" },
            output: { zh: "PCM，或经过重建滤波的模拟输出", en: "PCM, or an analog output after reconstruction filtering", ja: "PCM、または再構成フィルター後のアナログ出力", ko: "PCM 또는 재구성 필터 후의 아날로그 출력" },
            next: { zh: "采集侧进入接口 / DSP；播放侧进入功放与扬声器", en: "Capture goes to interfaces / DSP; playback goes to the amplifier and speaker", ja: "収音側はインターフェース / DSP へ、再生側はアンプとスピーカーへ", ko: "캡처 측은 인터페이스 / DSP로, 재생 측은 앰프와 스피커로 이동" }
          },
          keyConcepts: [
            { zh: "ADC 之前的模拟前端决定输入电平、增益和抗混叠；输入过大会削波，输入太小会让底噪占比变高。", en: "The analog front end before an ADC sets input level, gain, and anti-aliasing; too much level clips, while too little level exposes noise.", ja: "ADC 前のアナログフロントエンドが入力レベル、ゲイン、アンチエイリアスを決めます。入力が大きすぎるとクリップし、小さすぎるとノイズの割合が増えます。", ko: "ADC 전 아날로그 프런트엔드가 입력 레벨, 게인과 앨리어싱 방지를 정합니다. 입력이 너무 크면 클리핑되고 너무 작으면 노이즈 비중이 커집니다." },
            { zh: "DAC 之后的重建滤波、输出阻抗、负载能力和耳机/功放匹配决定实际播放质量。", en: "After a DAC, reconstruction filtering, output impedance, load drive, and headphone/amplifier matching shape playback quality.", ja: "DAC 後の再構成フィルター、出力インピーダンス、負荷駆動能力、ヘッドホンやアンプとの適合が実際の再生品質を左右します。", ko: "DAC 이후의 재구성 필터, 출력 임피던스, 부하 구동 능력과 헤드폰/앰프 매칭이 실제 재생 품질을 좌우합니다." },
            { zh: "Codec 芯片不是 MP3/AAC 压缩算法，而是集成音频转换、模拟通路、数字接口和控制寄存器的硬件芯片。", en: "A codec chip is not an MP3/AAC compression algorithm; it is hardware integrating conversion, analog paths, digital interfaces, and control registers.", ja: "Codec チップは MP3/AAC 圧縮アルゴリズムではなく、音声変換、アナログ経路、デジタルインターフェース、制御レジスターを統合したハードウェアです。", ko: "Codec 칩은 MP3/AAC 압축 알고리즘이 아니라 오디오 변환, 아날로그 경로, 디지털 인터페이스와 제어 레지스터를 통합한 하드웨어 칩입니다." },
            { zh: "采样时钟、PLL、MCLK/BCLK/LRCLK 配置错误会造成采样率不准、变调、爆音、丢帧或左右声道错位。", en: "Wrong sample clocks, PLL, MCLK/BCLK/LRCLK settings can cause sample-rate errors, pitch shift, pops, dropouts, or channel misalignment.", ja: "サンプルクロック、PLL、MCLK/BCLK/LRCLK の設定を誤ると、サンプルレートのずれ、ピッチ変化、ポップノイズ、ドロップアウト、左右チャンネルのずれが起こります。", ko: "샘플 클록, PLL, MCLK/BCLK/LRCLK 설정이 잘못되면 샘플레이트 오류, 피치 변화, 팝 노이즈, 드롭아웃이나 좌우 채널 불일치가 발생할 수 있습니다." }
          ],
          termExplanations: [
            {
              name: { zh: "ADC", en: "ADC", ja: "ADC", ko: "ADC" },
              explanation: {
                zh: "ADC 是模数转换器，把连续的模拟电压转换成离散数字样本。音频 ADC 通常包含采样保持、量化、数字滤波和抽取，现代芯片多采用 Σ-Δ 架构以获得较高动态范围。",
                en: "An ADC converts continuous analog voltage into discrete digital samples. Audio ADCs usually include sample-and-hold, quantization, digital filtering, and decimation; modern parts often use sigma-delta architectures for high dynamic range.",
                ja: "ADC は連続アナログ電圧を離散デジタルサンプルに変換します。オーディオ ADC には通常、サンプルホールド、量子化、デジタルフィルター、デシメーションが含まれ、現代の製品は高いダイナミックレンジのため Σ-Δ 構成を使うことが多いです。",
                ko: "ADC는 연속 아날로그 전압을 이산적인 디지털 샘플로 변환합니다. 오디오 ADC에는 보통 샘플 앤 홀드, 양자화, 디지털 필터와 데시메이션이 포함되며 현대 부품은 높은 다이내믹 레인지를 위해 시그마-델타 구조를 사용하는 경우가 많습니다."
              }
            },
            {
              name: { zh: "DAC", en: "DAC", ja: "DAC", ko: "DAC" },
              explanation: {
                zh: "DAC 是数模转换器，把数字样本重建为模拟电压或电流。音频 DAC 通常经过过采样、噪声整形、模拟低通滤波和输出缓冲，最后驱动线路输出、耳机或功放。",
                en: "A DAC reconstructs digital samples into analog voltage or current. Audio DACs usually use oversampling, noise shaping, analog low-pass filtering, and output buffering before driving line out, headphones, or amplifiers.",
                ja: "DAC はデジタルサンプルをアナログ電圧または電流に再構成します。オーディオ DAC は通常、ライン出力、ヘッドホン、アンプを駆動する前に、オーバーサンプリング、ノイズシェーピング、アナログローパスフィルター、出力バッファーを使います。",
                ko: "DAC는 디지털 샘플을 아날로그 전압 또는 전류로 재구성합니다. 오디오 DAC는 보통 라인 출력, 헤드폰이나 앰프를 구동하기 전에 오버샘플링, 노이즈 셰이핑, 아날로그 로우패스 필터와 출력 버퍼를 사용합니다."
              }
            },
            {
              name: { zh: "音频 Codec 芯片", en: "Audio codec chip", ja: "オーディオ Codec チップ", ko: "오디오 Codec 칩" },
              explanation: {
                zh: "硬件 Codec 芯片把 ADC、DAC、PGA、耳机放大、麦克风偏置、混音矩阵、音量控制和数字接口集成在一起。它负责硬件通路，不等同于 MP3、AAC、Opus 这类压缩编码算法。",
                en: "A hardware codec chip integrates ADCs, DACs, PGA, headphone amps, mic bias, mixers, volume controls, and digital interfaces. It handles hardware paths, not compression formats such as MP3, AAC, or Opus.",
                ja: "ハードウェア Codec チップは ADC、DAC、PGA、ヘッドホンアンプ、マイクバイアス、ミキサー、音量制御、デジタルインターフェースを統合します。担当するのはハードウェア経路であり、MP3、AAC、Opus などの圧縮形式ではありません。",
                ko: "하드웨어 Codec 칩은 ADC, DAC, PGA, 헤드폰 앰프, 마이크 바이어스, 믹서, 볼륨 제어와 디지털 인터페이스를 통합합니다. 하드웨어 경로를 처리하며 MP3, AAC, Opus 같은 압축 형식을 처리하는 것은 아닙니다."
              }
            },
            {
              name: { zh: "PGA / 前级增益", en: "PGA / preamp gain", ja: "PGA / プリアンプゲイン", ko: "PGA / 프리앰프 게인" },
              explanation: {
                zh: "PGA 是可编程增益放大器，用来把麦克风或线路输入调整到 ADC 合适范围。增益太小会浪费动态范围，增益太大则可能削波并把噪声一起放大。",
                en: "A PGA is a programmable gain amplifier that brings mic or line input into the ADC's usable range. Too little gain wastes dynamic range; too much clips and amplifies noise.",
                ja: "PGA はプログラマブルゲインアンプで、マイクまたはライン入力を ADC の使用可能範囲に合わせます。ゲインが小さすぎるとダイナミックレンジを無駄にし、大きすぎるとクリップしてノイズも増幅します。",
                ko: "PGA는 마이크 또는 라인 입력을 ADC의 사용 범위에 맞추는 프로그래머블 게인 앰프입니다. 게인이 너무 작으면 다이내믹 레인지를 낭비하고 너무 크면 클리핑과 함께 잡음도 증폭합니다."
              }
            },
            {
              name: { zh: "抗混叠滤波", en: "Anti-alias filter", ja: "アンチエイリアスフィルター", ko: "앨리어싱 방지 필터" },
              explanation: {
                zh: "采样前需要限制高于奈奎斯特频率的内容，否则高频会折叠成错误低频。现代音频 ADC 通常用模拟前端加过采样数字滤波共同完成抗混叠。",
                en: "Before sampling, content above the Nyquist frequency must be limited or it folds into false lower frequencies. Modern audio ADCs combine analog front-end filtering with oversampled digital filtering.",
                ja: "サンプリング前にナイキスト周波数を超える成分を制限しないと、偽の低周波へ折り返されます。現代のオーディオ ADC はアナログフロントエンドのフィルターとオーバーサンプリングされたデジタルフィルターを組み合わせます。",
                ko: "샘플링 전에 나이퀴스트 주파수를 넘는 성분을 제한하지 않으면 가짜 저주파로 접혀 들어갑니다. 현대 오디오 ADC는 아날로그 프런트엔드 필터와 오버샘플링 디지털 필터를 함께 사용합니다."
              }
            },
            {
              name: { zh: "重建滤波", en: "Reconstruction filter", ja: "再構成フィルター", ko: "재구성 필터" },
              explanation: {
                zh: "DAC 输出后会出现采样镜像和阶梯成分，需要低通重建滤波去除超声频镜像，让输出更接近连续模拟波形。",
                en: "DAC output contains sampling images and stepped components. A low-pass reconstruction filter removes ultrasonic images and makes the output closer to a continuous analog waveform.",
                ja: "DAC 出力にはサンプリングイメージと階段状成分が含まれます。ローパスの再構成フィルターで超音波域のイメージを除き、連続アナログ波形に近づけます。",
                ko: "DAC 출력에는 샘플링 이미지와 계단형 성분이 포함됩니다. 로우패스 재구성 필터가 초음파 대역 이미지를 제거해 출력을 연속적인 아날로그 파형에 가깝게 만듭니다."
              }
            },
            {
              name: { zh: "动态范围 / SNR", en: "Dynamic range / SNR", ja: "ダイナミックレンジ / SNR", ko: "다이내믹 레인지 / SNR" },
              explanation: {
                zh: "动态范围描述最大不失真信号和噪声底之间的跨度。ADC/DAC 的 ENOB、SNR、THD+N、模拟布局和电源噪声都会影响真实可用动态范围。",
                en: "Dynamic range is the span between maximum unclipped signal and noise floor. ENOB, SNR, THD+N, analog layout, and power noise all affect usable converter range.",
                ja: "ダイナミックレンジは、クリップしない最大信号とノイズフロアの幅です。ENOB、SNR、THD+N、アナログレイアウト、電源ノイズがコンバーターの実用範囲に影響します。",
                ko: "다이내믹 레인지는 클리핑되지 않는 최대 신호와 노이즈 플로어 사이의 범위입니다. ENOB, SNR, THD+N, 아날로그 레이아웃과 전원 잡음이 변환기의 실제 사용 범위에 영향을 줍니다."
              }
            },
            {
              name: { zh: "时钟与抖动", en: "Clocking and jitter", ja: "クロックとジッター", ko: "클로킹과 지터" },
              explanation: {
                zh: "音频采样依赖稳定时钟。抖动是采样或重建时刻的微小偏差，严重时会带来噪声、失真或声像模糊；实际系统还要正确配置 MCLK、BCLK、LRCLK 和 PLL。",
                en: "Audio conversion depends on stable clocks. Jitter is tiny timing error in sampling or reconstruction; when severe it can add noise, distortion, or image blur. Systems also need correct MCLK, BCLK, LRCLK, and PLL configuration.",
                ja: "音声変換は安定したクロックに依存します。ジッターはサンプリングや再構成の時刻に生じる微小な誤差で、深刻になるとノイズ、歪み、音像のぼけを加えます。システムでは MCLK、BCLK、LRCLK、PLL も正しく設定する必要があります。",
                ko: "오디오 변환은 안정적인 클록에 의존합니다. 지터는 샘플링 또는 재구성 시점의 미세한 시간 오차이며 심하면 잡음, 왜곡이나 음상 흐림을 추가할 수 있습니다. 시스템은 MCLK, BCLK, LRCLK와 PLL도 올바르게 설정해야 합니다."
              }
            },
            {
              name: { zh: "I2S / PDM / TDM", en: "I2S / PDM / TDM", ja: "I2S / PDM / TDM", ko: "I2S / PDM / TDM" },
              explanation: {
                zh: "I2S 常用于双声道 PCM 音频，PDM 常见于数字 MEMS 麦克风，TDM 可在一组时钟线上承载多路音频。接口格式、位宽、左右对齐和主从时钟必须匹配。",
                en: "I2S commonly carries stereo PCM, PDM is common for digital MEMS microphones, and TDM carries multiple channels on shared clocks. Format, word length, alignment, and clock master/slave roles must match.",
                ja: "I2S はステレオ PCM、PDM はデジタル MEMS マイク、TDM は共有クロック上の複数チャンネル伝送によく使われます。形式、ワード長、アライメント、クロックのマスター／スレーブ役割を一致させる必要があります。",
                ko: "I2S는 스테레오 PCM, PDM은 디지털 MEMS 마이크, TDM은 공유 클록에서 여러 채널을 전달하는 데 흔히 사용됩니다. 형식, 워드 길이, 정렬과 클록 마스터/슬레이브 역할이 일치해야 합니다."
              }
            },
            {
              name: { zh: "电源与模拟布局", en: "Power and analog layout", ja: "電源とアナログレイアウト", ko: "전원과 아날로그 레이아웃" },
              explanation: {
                zh: "Codec 周围的电源纹波、地回路、模拟/数字隔离、参考电压和去耦电容会直接影响噪声、串扰和爆音。数据手册推荐布局通常非常关键。",
                en: "Power ripple, ground loops, analog/digital separation, voltage references, and decoupling near a codec directly affect noise, crosstalk, and pops. Datasheet layout guidance is often critical.",
                ja: "Codec 周辺の電源リップル、グラウンドループ、アナログ／デジタル分離、電圧リファレンス、デカップリングは、ノイズ、クロストーク、ポップノイズに直接影響します。データシートのレイアウト指針が重要になることが多いです。",
                ko: "Codec 주변의 전원 리플, 그라운드 루프, 아날로그/디지털 분리, 전압 기준과 디커플링은 잡음, 크로스토크와 팝 노이즈에 직접 영향을 줍니다. 데이터시트의 레이아웃 지침이 중요한 경우가 많습니다."
              }
            }
          ],
          lab: {
            type: "codec-hardware",
            title: { zh: "ADC / DAC / Codec 实验室", en: "ADC / DAC / Codec Lab", ja: "ADC / DAC / Codec ラボ", ko: "ADC / DAC / Codec 실험실" },
            description: {
              zh: "进入独立界面切换 ADC 采集、DAC 重建和 Codec 芯片链路，调节输入电平、采样率、位深和时钟抖动，观察削波、量化噪声、重建滤波和接口数据流。",
              en: "Open an independent lab to switch ADC capture, DAC reconstruction, and codec-chip paths, then adjust input level, sample rate, bit depth, and clock jitter to observe clipping, quantization noise, reconstruction filtering, and interface flow.",
              ja: "独立したラボで ADC 収音、DAC 再構成、Codec チップの経路を切り替え、入力レベル、サンプルレート、ビット深度、クロックジッターを調整して、クリップ、量子化ノイズ、再構成フィルター、インターフェースの流れを観察します。",
              ko: "독립 실험실에서 ADC 캡처, DAC 재구성과 Codec 칩 경로를 전환하고 입력 레벨, 샘플레이트, 비트 깊이와 클록 지터를 조절해 클리핑, 양자화 잡음, 재구성 필터와 인터페이스 흐름을 관찰합니다."
            },
            buttonLabel: { zh: "打开 ADC / DAC / Codec 实验室", en: "Open ADC / DAC / Codec lab", ja: "ADC / DAC / Codec ラボを開く", ko: "ADC / DAC / Codec 실험실 열기" }
          },
          misconception: {
            zh: "硬件 Codec 芯片和 MP3、AAC 这类编解码算法不是同一个概念；前者是音频转换、模拟通路和接口芯片，后者是压缩格式算法。",
            en: "A hardware codec chip is not the same thing as an MP3 or AAC codec algorithm; the former handles conversion, analog paths, and interfaces, while the latter compresses audio data.",
            ja: "ハードウェア Codec チップは MP3 や AAC の Codec アルゴリズムとは別物です。前者は変換、アナログ経路、インターフェースを扱い、後者は音声データを圧縮します。",
            ko: "하드웨어 Codec 칩은 MP3나 AAC 코덱 알고리즘과 같은 개념이 아닙니다. 전자는 변환, 아날로그 경로와 인터페이스를 처리하고 후자는 오디오 데이터를 압축합니다."
          },
          contentDirection: {
            zh: "适合继续扩展为从麦克风到扬声器的硬件链路图、Codec 寄存器配置示例、I2S/PDM/TDM 时序图，以及噪声、失真、爆音和时钟问题排查清单。",
            en: "This can expand into microphone-to-speaker hardware chain diagrams, codec register examples, I2S/PDM/TDM timing diagrams, and checklists for noise, distortion, pops, and clocking problems.",
            ja: "マイクからスピーカーまでのハードウェアチェーン図、Codec レジスター例、I2S/PDM/TDM のタイミング図、ノイズ、歪み、ポップノイズ、クロック問題のチェックリストへ発展できます。",
            ko: "마이크에서 스피커까지의 하드웨어 체인 도해, Codec 레지스터 예시, I2S/PDM/TDM 타이밍 도해와 잡음, 왜곡, 팝 노이즈, 클로킹 문제 체크리스트로 확장할 수 있습니다."
          }
        }
      },
      {
        title: {
          zh: "数字音频接口 / 传输协议",
          en: "Digital Audio Interfaces / Transport Protocols",
          ja: "デジタル音声インターフェース／伝送プロトコル",
          ko: "디지털 오디오 인터페이스 / 전송 프로토콜",
        },
        summary: {
          zh: "理解主控、Codec、数字麦克风、功放和外设之间如何传输音频样本、时钟和多通道数据。",
          en: "Understand how hosts, codecs, digital microphones, amplifiers, and peripherals move audio samples, clocks, and multichannel data.",
          ja: "ホスト、Codec、デジタルマイク、アンプ、周辺機器の間で、音声サンプル、クロック、マルチチャンネルデータを伝送する仕組みを理解します。",
          ko: "호스트, Codec, 디지털 마이크, 앰프와 주변 장치 사이에서 오디오 샘플, 클록과 다중 채널 데이터를 전송하는 방식을 이해합니다."
        },
        bullets: [
          { zh: "I2S / IIS / I²S、TDM、PDM、SPDIF、USB Audio", en: "I2S / IIS / I²S, TDM, PDM, SPDIF, USB Audio", ja: "I2S / IIS / I²S、TDM、PDM、SPDIF、USB Audio", ko: "I2S / IIS / I²S, TDM, PDM, SPDIF, USB Audio" },
          { zh: "MCLK、BCLK、LRCLK、帧同步和主从时钟", en: "MCLK, BCLK, LRCLK, frame sync, and clock master/slave roles", ja: "MCLK、BCLK、LRCLK、フレーム同期、クロックのマスター／スレーブ役割", ko: "MCLK, BCLK, LRCLK, 프레임 동기와 클록 마스터/슬레이브 역할" },
          { zh: "声道排布、位宽、对齐方式、延迟和兼容性", en: "Channel layout, word length, alignment, latency, and compatibility", ja: "チャンネル配置、ワード長、アライメント、遅延、互換性", ko: "채널 배치, 워드 길이, 정렬, 지연과 호환성" }
        ],
        detail: {
          explanation: {
            zh: "接口协议关注的是芯片和设备之间如何搬运音频样本，而不是声音如何被采样或压缩。ADC、DAC、Codec、数字 MEMS 麦克风、DSP、蓝牙芯片和主控之间通常要约定数据线、时钟线、帧同步、位宽、声道顺序和主从关系，任何一项不匹配都可能导致无声、变调、左右声道错位、噪声或爆音。",
            en: "Interface protocols are about moving audio samples between chips and devices, not about how sound is sampled or compressed. ADCs, DACs, codecs, digital MEMS microphones, DSPs, Bluetooth chips, and hosts must agree on data lines, clocks, frame sync, word length, channel order, and master/slave roles; mismatches can cause silence, pitch errors, swapped channels, noise, or pops.",
            ja: "インターフェースプロトコルは、音がどのようにサンプリングや圧縮されるかではなく、チップや機器の間で音声サンプルをどう運ぶかを定めます。ADC、DAC、Codec、デジタル MEMS マイク、DSP、Bluetooth チップ、ホストは、データ線、クロック、フレーム同期、ワード長、チャンネル順、マスター／スレーブ役割を一致させる必要があり、不一致は無音、ピッチずれ、左右入れ替わり、ノイズ、ポップノイズを招きます。",
            ko: "인터페이스 프로토콜은 소리가 어떻게 샘플링되거나 압축되는지가 아니라 칩과 장치 사이에서 오디오 샘플을 어떻게 전달하는지를 다룹니다. ADC, DAC, Codec, 디지털 MEMS 마이크, DSP, Bluetooth 칩과 호스트는 데이터선, 클록, 프레임 동기, 워드 길이, 채널 순서와 마스터/슬레이브 역할에 합의해야 하며 불일치하면 무음, 피치 오류, 좌우 채널 뒤바뀜, 잡음이나 팝 노이즈가 발생할 수 있습니다."
          },
          chainContext: {
            stage: { zh: "芯片之间的数字搬运层", en: "Chain position: digital transport between chips", ja: "チェーン位置：チップ間のデジタル伝送層", ko: "체인 위치: 칩 사이의 디지털 전송 계층" },
            input: { zh: "PCM、PDM 或设备音频包，以及时钟配置", en: "PCM, PDM, or device audio packets plus clock configuration", ja: "PCM、PDM、または機器の音声パケットとクロック設定", ko: "PCM, PDM 또는 장치 오디오 패킷과 클록 설정" },
            output: { zh: "按约定时序送达下一颗芯片或外设", en: "Samples delivered to the next chip or peripheral with agreed timing", ja: "合意したタイミングで次のチップまたは周辺機器へサンプルを届ける", ko: "합의된 타이밍으로 다음 칩 또는 주변 장치에 샘플 전달" },
            next: { zh: "进入 DSP、Codec、DAC、功放或主机协议栈", en: "Next: DSP, codec, DAC, amplifier, or host protocol stack", ja: "次段：DSP、Codec、DAC、アンプ、またはホストのプロトコルスタック", ko: "다음: DSP, Codec, DAC, 앰프 또는 호스트 프로토콜 스택" }
          },
          keyConcepts: [
            { zh: "I2S/IIS/I²S 主要用于传输已经采样量化后的 PCM 数据，常见于主控和 Codec、DAC、功放之间。", en: "I2S/IIS/I²S carries already sampled and quantized PCM data, commonly between a host and codec, DAC, or amplifier.", ja: "I2S/IIS/I²S は、サンプリングと量子化を済ませた PCM データの伝送に使われ、ホストと Codec、DAC、アンプの間でよく見られます。", ko: "I2S/IIS/I²S는 이미 샘플링 및 양자화된 PCM 데이터를 전달하며 호스트와 Codec, DAC, 앰프 사이에서 흔히 사용됩니다." },
            { zh: "PDM 常见于数字 MEMS 麦克风，传的是高速 1-bit 脉冲密度流，后端需要抽取滤波变成 PCM。", en: "PDM is common for digital MEMS microphones. It carries a high-rate 1-bit pulse-density stream that must be decimated into PCM.", ja: "PDM はデジタル MEMS マイクでよく使われる高速 1-bit のパルス密度ストリームで、後段でデシメーションして PCM に変換します。", ko: "PDM은 디지털 MEMS 마이크에 흔하며 고속 1-bit 펄스 밀도 스트림을 전달하고 후단에서 데시메이션해 PCM으로 변환합니다." },
            { zh: "TDM 适合多通道音频，把多个声道按时隙塞进同一条数据线和同一组时钟。", en: "TDM fits multichannel audio by packing channels into time slots on one data line and shared clocks.", ja: "TDM はマルチチャンネル音声に適し、複数のチャンネルを1本のデータ線と共有クロックのタイムスロットへ詰め込みます。", ko: "TDM은 여러 채널을 하나의 데이터선과 공유 클록의 타임슬롯에 배치하므로 다중 채널 오디오에 적합합니다." },
            { zh: "接口调试要同时检查采样率、位深、左右/帧同步、主从时钟、边沿采样和 DMA buffer 配置。", en: "Interface debugging checks sample rate, bit depth, left/right or frame sync, master/slave clocks, sampling edge, and DMA buffer configuration together.", ja: "インターフェースのデバッグでは、サンプルレート、ビット深度、左右／フレーム同期、マスター／スレーブクロック、サンプリングエッジ、DMA バッファー設定を同時に確認します。", ko: "인터페이스 디버깅에서는 샘플레이트, 비트 깊이, 좌우/프레임 동기, 마스터/슬레이브 클록, 샘플링 에지와 DMA 버퍼 설정을 함께 확인합니다." }
          ],
          termExplanations: [
            {
              name: { zh: "I2S / IIS / I²S", en: "I2S / IIS / I²S", ja: "I2S / IIS / I²S", ko: "I2S / IIS / I²S" },
              explanation: {
                zh: "I2S 是最常见的芯片级数字音频接口之一，也常被写成 IIS 或 I²S。它通常包含 BCLK 位时钟、LRCLK 左右声道时钟和 SD 数据线，可选 MCLK 主时钟。它主要传输 PCM 样本，常用于主控连接 Codec、DAC、ADC、DSP 或数字功放。",
                en: "I2S is one of the most common chip-level digital audio interfaces, also written as IIS or I²S. It usually has BCLK bit clock, LRCLK left/right clock, SD data, and optionally MCLK master clock. It carries PCM samples between hosts, codecs, DACs, ADCs, DSPs, or digital amplifiers.",
                ja: "I2S は代表的なチップ間デジタル音声インターフェースで、IIS や I²S とも表記されます。通常は BCLK ビットクロック、LRCLK 左右クロック、SD データ線を持ち、MCLK 主クロックを加えることもあります。ホスト、Codec、DAC、ADC、DSP、デジタルアンプの間で PCM サンプルを伝送します。",
                ko: "I2S는 대표적인 칩 간 디지털 오디오 인터페이스이며 IIS 또는 I²S로도 표기합니다. 보통 BCLK 비트 클록, LRCLK 좌우 클록, SD 데이터선을 사용하고 MCLK 주 클록을 추가할 수 있습니다. 호스트, Codec, DAC, ADC, DSP와 디지털 앰프 사이에서 PCM 샘플을 전달합니다."
              }
            },
            {
              name: { zh: "TDM", en: "TDM", ja: "TDM", ko: "TDM" },
              explanation: {
                zh: "TDM 是时分复用接口，可以把 4 路、8 路甚至更多声道按固定时隙放进同一条数据线上。会议设备、多麦阵列、车载音频和多通道 DSP 常用 TDM，但帧长、slot 宽度、声道顺序必须严格匹配。",
                en: "TDM uses time slots to place 4, 8, or more channels on one data line. It is common in conferencing devices, microphone arrays, automotive audio, and multichannel DSP systems, but frame length, slot width, and channel order must match exactly.",
                ja: "TDM はタイムスロットを使って、4、8、またはそれ以上のチャンネルを1本のデータ線に配置します。会議機器、マイクアレイ、車載音声、マルチチャンネル DSP で使われますが、フレーム長、slot 幅、チャンネル順を厳密に一致させる必要があります。",
                ko: "TDM은 타임슬롯을 사용해 4개, 8개 또는 그 이상의 채널을 하나의 데이터선에 배치합니다. 회의 장비, 마이크 어레이, 차량 오디오와 다중 채널 DSP에서 흔하지만 프레임 길이, slot 폭과 채널 순서가 정확히 일치해야 합니다."
              }
            },
            {
              name: { zh: "PDM", en: "PDM", ja: "PDM", ko: "PDM" },
              explanation: {
                zh: "PDM 是脉冲密度调制，常见于数字 MEMS 麦克风。它不是普通多 bit PCM，而是高速 1-bit 数据流，密度代表瞬时幅度。主控或 Codec 需要用抽取滤波把 PDM 转换成 PCM 后再处理。",
                en: "PDM means pulse-density modulation and is common in digital MEMS microphones. It is not normal multibit PCM; it is a high-rate 1-bit stream where pulse density represents amplitude. A host or codec decimates it into PCM before processing.",
                ja: "PDM はパルス密度変調で、デジタル MEMS マイクによく使われます。通常のマルチビット PCM ではなく、パルス密度が振幅を表す高速 1-bit ストリームです。ホストまたは Codec がデシメーションして PCM に変換してから処理します。",
                ko: "PDM은 펄스 밀도 변조로 디지털 MEMS 마이크에 흔히 사용됩니다. 일반적인 멀티비트 PCM이 아니라 펄스 밀도가 진폭을 나타내는 고속 1-bit 스트림이며 호스트나 Codec이 데시메이션해 PCM으로 변환한 뒤 처리합니다."
              }
            },
            {
              name: { zh: "PCM 接口", en: "PCM interface", ja: "PCM インターフェース", ko: "PCM 인터페이스" },
              explanation: {
                zh: "PCM 接口这个名字在不同芯片手册中含义不完全一致，有时指电话/语音窄带接口，有时泛指同步串行 PCM 传输。看数据手册时要确认帧同步、位宽、对齐方式和是否兼容 I2S/TDM。",
                en: "The term PCM interface varies by datasheet. It can mean a telephony voice interface or a generic synchronous serial PCM transport. Check frame sync, word length, alignment, and whether it is compatible with I2S or TDM.",
                ja: "PCM インターフェースという名称はデータシートによって意味が異なり、電話／音声用の狭帯域インターフェースを指す場合も、同期シリアル PCM 伝送全般を指す場合もあります。フレーム同期、ワード長、アライメント、I2S／TDM 互換性を確認してください。",
                ko: "PCM 인터페이스라는 이름은 데이터시트마다 의미가 다릅니다. 전화/음성 협대역 인터페이스를 뜻할 수도 있고 동기식 직렬 PCM 전송을 넓게 뜻할 수도 있습니다. 프레임 동기, 워드 길이, 정렬 방식과 I2S 또는 TDM 호환 여부를 확인해야 합니다."
              }
            },
            {
              name: { zh: "SPDIF", en: "SPDIF", ja: "SPDIF", ko: "SPDIF" },
              explanation: {
                zh: "SPDIF 常用于消费电子的数字音频输出，可通过同轴或光纤传输立体声 PCM，也可承载压缩环绕声码流。它适合设备间连接，不常用于芯片内部短距离连接。",
                en: "SPDIF is common in consumer digital audio output over coaxial or optical links. It can carry stereo PCM or compressed surround bitstreams. It is useful between devices rather than short chip-to-chip links.",
                ja: "SPDIF は民生機器のデジタル音声出力でよく使われ、同軸または光リンクでステレオ PCM や圧縮サラウンドのビットストリームを伝送できます。チップ間の短距離接続より機器間接続に適しています。",
                ko: "SPDIF는 소비자 기기의 디지털 오디오 출력에 흔히 사용되며 동축 또는 광 링크로 스테레오 PCM이나 압축 서라운드 비트스트림을 전달할 수 있습니다. 칩 간 단거리 연결보다는 장치 간 연결에 적합합니다."
              }
            },
            {
              name: { zh: "USB Audio", en: "USB Audio", ja: "USB Audio", ko: "USB Audio" },
              explanation: {
                zh: "USB Audio 是电脑、手机和声卡之间常见的外设级音频协议。它不仅传音频样本，还包含设备枚举、端点、同步方式、控制请求、采样率切换和多通道描述。",
                en: "USB Audio is a peripheral-level protocol between computers, phones, and audio interfaces. It carries samples and also handles enumeration, endpoints, synchronization, control requests, sample-rate changes, and multichannel descriptors.",
                ja: "USB Audio はコンピューター、スマートフォン、オーディオインターフェースの間で使われる周辺機器向けプロトコルです。サンプルだけでなく、デバイス列挙、エンドポイント、同期方式、制御リクエスト、サンプルレート変更、マルチチャンネル記述も扱います。",
                ko: "USB Audio는 컴퓨터, 휴대폰과 오디오 인터페이스 사이에서 사용되는 주변 장치 수준의 오디오 프로토콜입니다. 샘플뿐 아니라 장치 열거, 엔드포인트, 동기화 방식, 제어 요청, 샘플레이트 변경과 다중 채널 설명도 처리합니다."
              }
            },
            {
              name: { zh: "MCLK / BCLK / LRCLK", en: "MCLK / BCLK / LRCLK", ja: "MCLK / BCLK / LRCLK", ko: "MCLK / BCLK / LRCLK" },
              explanation: {
                zh: "MCLK 是主时钟，BCLK 是每一位数据的时钟，LRCLK 或 FS 用来标记左右声道或帧边界。采样率、位宽和声道数会共同决定这些时钟频率。",
                en: "MCLK is the master clock, BCLK clocks each data bit, and LRCLK or FS marks left/right channels or frame boundaries. Sample rate, word length, and channel count together determine these clock rates.",
                ja: "MCLK は主クロック、BCLK は各データビットのクロック、LRCLK または FS は左右チャンネルやフレーム境界を示します。これらのクロック周波数は、サンプルレート、ワード長、チャンネル数で決まります。",
                ko: "MCLK는 주 클록, BCLK는 각 데이터 비트의 클록이며 LRCLK 또는 FS는 좌우 채널이나 프레임 경계를 표시합니다. 이 클록 주파수는 샘플레이트, 워드 길이와 채널 수로 함께 결정됩니다."
              }
            },
            {
              name: { zh: "主从时钟", en: "Clock master/slave", ja: "クロックのマスター／スレーブ", ko: "클록 마스터/슬레이브" },
              explanation: {
                zh: "数字音频链路中必须明确谁输出时钟、谁跟随时钟。两个设备都当主机会打架，两个设备都当从机则没有时钟。复杂系统通常还要统一 PLL 和采样率域。",
                en: "A digital audio link must define who generates clocks and who follows them. Two masters conflict, while two slaves provide no clock. Complex systems also need aligned PLL and sample-rate domains.",
                ja: "デジタル音声リンクでは、誰がクロックを生成し、誰が従うかを明確にする必要があります。2台のマスターは競合し、2台ともスレーブではクロックがありません。複雑なシステムでは PLL とサンプルレートのドメインもそろえる必要があります。",
                ko: "디지털 오디오 링크에서는 누가 클록을 생성하고 누가 따를지 명확히 해야 합니다. 두 장치가 모두 마스터면 충돌하고 모두 슬레이브면 클록이 없습니다. 복잡한 시스템에서는 PLL과 샘플레이트 도메인도 맞춰야 합니다."
              }
            }
          ],
          lab: {
            type: "digital-interface",
            title: { zh: "数字音频接口实验室", en: "Digital Audio Interface Lab", ja: "デジタル音声インターフェースラボ", ko: "디지털 오디오 인터페이스 실험실" },
            description: {
              zh: "进入独立界面切换 I2S、TDM、PDM、SPDIF 和 USB Audio，观察时钟线、数据线、帧同步、声道 slot、PDM 抽取和 USB 包传输。",
              en: "Open an independent lab to switch I2S, TDM, PDM, SPDIF, and USB Audio while inspecting clock lines, data lines, frame sync, channel slots, PDM decimation, and USB packet transport.",
              ja: "独立したラボで I2S、TDM、PDM、SPDIF、USB Audio を切り替え、クロック線、データ線、フレーム同期、チャンネル slot、PDM のデシメーション、USB パケット伝送を観察します。",
              ko: "독립 실험실에서 I2S, TDM, PDM, SPDIF와 USB Audio를 전환하며 클록선, 데이터선, 프레임 동기, 채널 slot, PDM 데시메이션과 USB 패킷 전송을 관찰합니다."
            },
            buttonLabel: { zh: "打开数字音频接口实验室", en: "Open digital audio interface lab", ja: "デジタル音声インターフェースラボを開く", ko: "디지털 오디오 인터페이스 실험실 열기" }
          },
          misconception: {
            zh: "I2S/TDM/PDM 不是 MP3、AAC、Opus 这类压缩格式，也不是 ADC/DAC 本身；它们是芯片或设备之间搬运数字音频数据的接口协议。",
            en: "I2S/TDM/PDM are not compression formats like MP3, AAC, or Opus, and they are not ADC/DAC conversion itself; they are interface protocols for transporting digital audio data between chips or devices.",
            ja: "I2S/TDM/PDM は MP3、AAC、Opus のような圧縮形式でも ADC/DAC そのものでもなく、チップや機器の間でデジタル音声データを運ぶインターフェースプロトコルです。",
            ko: "I2S/TDM/PDM은 MP3, AAC, Opus 같은 압축 형식도 ADC/DAC 변환 자체도 아니며 칩이나 장치 사이에서 디지털 오디오 데이터를 운반하는 인터페이스 프로토콜입니다."
          },
          contentDirection: {
            zh: "后续适合扩展为接口时序图实验室：切换 I2S、TDM、PDM、SPDIF 和 USB Audio，观察时钟线、数据线、帧同步、声道 slot 和常见配置错误。",
            en: "This can later become an interface timing lab: switch I2S, TDM, PDM, SPDIF, and USB Audio to inspect clock lines, data lines, frame sync, channel slots, and common configuration mistakes.",
            ja: "今後はインターフェースのタイミングラボへ発展させ、I2S、TDM、PDM、SPDIF、USB Audio を切り替えて、クロック線、データ線、フレーム同期、チャンネル slot、よくある設定ミスを確認できます。",
            ko: "향후 인터페이스 타이밍 실험실로 확장해 I2S, TDM, PDM, SPDIF와 USB Audio를 전환하면서 클록선, 데이터선, 프레임 동기, 채널 slot과 흔한 설정 오류를 확인할 수 있습니다."
          }
        }
      },
      {
        title: { zh: "功放与扬声器", en: "Amplifiers and Speakers", ja: "アンプとスピーカー", ko: "앰프와 스피커" },
        summary: {
          zh: "覆盖功放类型、扬声器单元、T/S 参数、箱体、分频器和线阵列。",
          en: "Cover amplifier classes, speaker drivers, T/S parameters, enclosures, crossovers, and line arrays.",
          ja: "アンプの方式、スピーカーユニット、T/S パラメーター、エンクロージャー、クロスオーバー、ラインアレイを扱います。",
          ko: "앰프 방식, 스피커 드라이버, T/S 파라미터, 인클로저, 크로스오버와 라인 어레이를 다룹니다."
        },
        bullets: [
          { zh: "Class A / AB / D", en: "Class A / AB / D", ja: "Class A / AB / D", ko: "Class A / AB / D" },
          { zh: "Thiele-Small 参数、密闭箱和倒相箱", en: "Thiele-Small parameters, sealed and bass-reflex boxes", ja: "Thiele-Small パラメーター、密閉箱、バスレフ箱", ko: "Thiele-Small 파라미터, 밀폐형과 베이스 리플렉스 인클로저" },
          { zh: "分频阶数、相位对齐、主动/被动分频", en: "Crossover order, phase alignment, active/passive crossovers", ja: "クロスオーバー次数、位相合わせ、アクティブ／パッシブ分岐", ko: "크로스오버 차수, 위상 정렬, 액티브/패시브 크로스오버" },
          { zh: "线阵列扬声器和覆盖控制", en: "Line arrays and coverage control", ja: "ラインアレイスピーカーとカバレッジ制御", ko: "라인 어레이 스피커와 커버리지 제어" }
        ],
        detail: {
          explanation: {
            zh: "功放负责把 DAC、Codec 或前级输出的小信号变成能推动扬声器的电压、电流和功率；扬声器再把电能转换成振膜运动和空气声波。实际听感不是由某一个参数决定，而是由功放类型、输出能力、扬声器单元、Thiele-Small 参数、箱体形式、分频阶数、相位对齐、保护算法和声学结构共同决定。",
            en: "An amplifier turns the small signal from a DAC, codec, or preamp into voltage, current, and power that can drive a speaker. The speaker then turns electrical energy into diaphragm motion and air pressure. The listening result depends on amplifier class, output capability, driver design, Thiele-Small parameters, enclosure type, crossover order, phase alignment, protection, and acoustics together.",
            ja: "アンプは DAC、Codec、プリアンプからの小信号を、スピーカーを駆動できる電圧、電流、電力へ変換します。スピーカーは電気エネルギーを振動板の動きと空気圧へ変換します。聴感はアンプ方式、出力能力、ユニット設計、Thiele-Small パラメーター、エンクロージャー、クロスオーバー次数、位相合わせ、保護、音響の組み合わせで決まります。",
            ko: "앰프는 DAC, Codec 또는 프리앰프의 작은 신호를 스피커를 구동할 수 있는 전압, 전류와 전력으로 바꿉니다. 스피커는 전기 에너지를 진동판의 움직임과 공기 압력으로 바꿉니다. 실제 청감은 앰프 방식, 출력 능력, 드라이버 설계, Thiele-Small 파라미터, 인클로저, 크로스오버 차수, 위상 정렬, 보호와 음향의 조합으로 결정됩니다."
          },
          keyConcepts: [
            { zh: "功放要提供足够电压摆幅和电流能力；电源电压、负载阻抗、散热和保护策略会限制最大输出。", en: "An amplifier needs enough voltage swing and current capability; supply voltage, load impedance, heat, and protection limit maximum output.", ja: "アンプには十分な電圧振幅と電流能力が必要で、電源電圧、負荷インピーダンス、発熱、保護機能が最大出力を制限します。", ko: "앰프에는 충분한 전압 스윙과 전류 능력이 필요하며 전원 전압, 부하 임피던스, 발열과 보호 전략이 최대 출력을 제한합니다." },
            { zh: "Class A 线性好但效率低，Class AB 是传统折中方案，Class D 通过开关/PWM 工作，效率高但需要关注滤波、布局和 EMI。", en: "Class A is linear but inefficient, Class AB is a traditional compromise, and Class D uses switching/PWM for high efficiency while requiring care with filtering, layout, and EMI.", ja: "Class A は線形性に優れますが効率が低く、Class AB は従来の折衷案です。Class D はスイッチング／PWM で高効率ですが、フィルター、レイアウト、EMI に注意が必要です。", ko: "Class A는 선형성이 좋지만 효율이 낮고 Class AB는 전통적인 절충안입니다. Class D는 스위칭/PWM으로 높은 효율을 얻지만 필터, 레이아웃과 EMI를 주의해야 합니다." },
            { zh: "扬声器的音圈在磁场中受力，推动振膜往复运动；行程、热容量和机械结构决定它能承受多大声压和低频。", en: "A speaker voice coil moves in a magnetic field and drives the diaphragm; excursion, thermal capacity, and mechanics determine sound pressure and bass limits.", ja: "スピーカーのボイスコイルは磁場中で力を受け、振動板を往復させます。振幅、熱容量、機械構造が許容音圧と低域の限界を決めます。", ko: "스피커 보이스 코일은 자기장 안에서 힘을 받아 진동판을 왕복시킵니다. 진폭, 열 용량과 기계 구조가 허용 음압과 저주파 한계를 결정합니다." },
            { zh: "Thiele-Small 参数描述低频小信号行为：Fs、Qts、Vas 会影响适合密闭箱还是倒相箱，以及箱体容积和调谐频率。", en: "Thiele-Small parameters describe low-frequency small-signal behavior: Fs, Qts, and Vas influence whether a driver suits sealed or bass-reflex boxes, and guide box volume and tuning frequency.", ja: "Thiele-Small パラメーターは低域の小信号特性を表します。Fs、Qts、Vas はユニットが密閉箱とバスレフ箱のどちらに適するか、箱体容積やチューニング周波数を左右します。", ko: "Thiele-Small 파라미터는 저주파 소신호 특성을 설명합니다. Fs, Qts와 Vas는 드라이버가 밀폐형과 베이스 리플렉스 중 어디에 적합한지, 인클로저 용적과 튜닝 주파수를 결정하는 데 영향을 줍니다." },
            { zh: "密闭箱用箱内空气弹簧控制振膜，响应通常更平滑；倒相箱用导管共振增强低频效率，但调谐点以下更容易失控。", en: "A sealed box uses the trapped air as a spring and is often smoother; a bass-reflex box uses port resonance to improve bass efficiency, but below tuning the driver is less controlled.", ja: "密閉箱は内部の空気をばねとして振動板を制御し、応答が滑らかになりやすい構造です。バスレフ箱はポート共振で低域効率を高めますが、チューニング周波数以下ではユニットを制御しにくくなります。", ko: "밀폐형은 내부 공기를 스프링처럼 사용해 진동판을 제어하므로 응답이 더 매끄러운 편입니다. 베이스 리플렉스는 포트 공진으로 저주파 효율을 높이지만 튜닝 주파수 아래에서는 드라이버 제어가 어려워집니다." },
            { zh: "分频阶数决定斜率：一阶约 6 dB/oct，二阶约 12 dB/oct，四阶约 24 dB/oct；阶数越高越能保护单元，但相位、延迟和叠加要更小心。", en: "Crossover order sets slope: first order is about 6 dB/oct, second order 12 dB/oct, and fourth order 24 dB/oct. Higher order protects drivers better but needs more care with phase, delay, and summing.", ja: "クロスオーバー次数は傾きを決めます。1次は約 6 dB/oct、2次は約 12 dB/oct、4次は約 24 dB/oct です。次数が高いほどユニットを保護できますが、位相、遅延、合成にはより注意が必要です。", ko: "크로스오버 차수가 기울기를 정합니다. 1차는 약 6 dB/oct, 2차는 약 12 dB/oct, 4차는 약 24 dB/oct입니다. 차수가 높을수록 드라이버를 잘 보호하지만 위상, 지연과 합산을 더 주의해야 합니다." },
            { zh: "主动分频在功放之前用 DSP/有源滤波拆频，每个单元独立功放；被动分频在功放之后用电感、电容、电阻分频，结构简单但受负载阻抗影响。", en: "Active crossovers split bands before amplification with DSP/active filters and use one amp per driver; passive crossovers split after the amp with inductors, capacitors, and resistors, simpler but load-dependent.", ja: "アクティブ分岐はアンプの前で DSP やアクティブフィルターを使って帯域を分け、各ユニットを独立アンプで駆動します。パッシブ分岐はアンプ後にコイル、コンデンサー、抵抗で分けるため単純ですが、負荷インピーダンスの影響を受けます。", ko: "액티브 크로스오버는 앰프 앞에서 DSP/액티브 필터로 대역을 나누고 드라이버마다 앰프를 하나씩 사용합니다. 패시브 크로스오버는 앰프 뒤에서 인덕터, 커패시터와 저항으로 나누므로 구조는 단순하지만 부하 임피던스에 좌우됩니다." },
            { zh: "线阵列通过多个单元垂直排列和延迟/幅度控制，把能量集中到目标覆盖区域，减少不必要的垂直扩散。", en: "A line array uses vertically stacked drivers plus delay/amplitude control to focus energy into the target coverage area and reduce unwanted vertical spread.", ja: "ラインアレイは複数のユニットを垂直に並べ、遅延と振幅を制御してエネルギーを目標のカバレッジへ集中させ、不要な垂直拡散を抑えます。", ko: "라인 어레이는 여러 드라이버를 수직으로 배열하고 지연/진폭을 제어해 에너지를 목표 커버리지에 집중시키며 불필요한 수직 확산을 줄입니다." },
            { zh: "阻抗越低，同电压下电流越大，对功放输出级和散热要求越高。", en: "Lower impedance draws more current at the same voltage, increasing amplifier output-stage and thermal demands.", ja: "インピーダンスが低いほど同じ電圧で流れる電流が大きくなり、アンプの出力段と熱設計への要求が高まります。", ko: "임피던스가 낮을수록 같은 전압에서 더 큰 전류가 흐르므로 앰프 출력단과 방열에 대한 요구가 커집니다." },
            { zh: "灵敏度、功率、箱体和分频共同决定实际响度；瓦数更大不等于一定更响或更好听。", en: "Sensitivity, power, enclosure, and crossover jointly determine loudness; more watts do not guarantee louder or better sound.", ja: "感度、電力、エンクロージャー、クロスオーバーが実際の音量を共同で決めます。ワット数が大きいからといって、必ずしも大きく、または良く聴こえるとは限りません。", ko: "감도, 전력, 인클로저와 크로스오버가 실제 음량을 함께 결정하며 와트 수가 크다고 반드시 더 크거나 더 좋은 소리가 나는 것은 아닙니다." }
          ],
          termExplanations: [
            {
              name: { zh: "功放是什么", en: "What an amplifier does", ja: "アンプの役割", ko: "앰프의 역할" },
              explanation: {
                zh: "功放把小信号变成可驱动负载的功率输出。它需要处理增益、电源电压、输出电流、效率、散热、削波和保护。",
                en: "An amplifier turns a small signal into power output for a load. It must handle gain, supply voltage, output current, efficiency, heat, clipping, and protection.",
                ja: "アンプは小信号を負荷を駆動できる電力出力へ変換します。ゲイン、電源電圧、出力電流、効率、発熱、クリップ、保護を扱う必要があります。",
                ko: "앰프는 작은 신호를 부하를 구동할 수 있는 전력 출력으로 바꿉니다. 게인, 전원 전압, 출력 전류, 효율, 발열, 클리핑과 보호를 처리해야 합니다."
              }
            },
            {
              name: { zh: "Class A / AB / D", en: "Class A / AB / D", ja: "Class A / AB / D", ko: "Class A / AB / D" },
              explanation: {
                zh: "Class A 器件几乎一直导通，线性好但耗电；Class AB 让正负半周分担输出；Class D 把信号调制成高速开关脉冲，再由负载和滤波恢复为音频。",
                en: "Class A devices conduct most of the time, Class AB splits positive and negative halves, and Class D modulates audio into fast switching pulses before filtering through the load.",
                ja: "Class A はほぼ常時導通するため線形性に優れますが消費電力が大きく、Class AB は正負の半周期で出力を分担します。Class D は音声を高速スイッチングパルスへ変調し、負荷とフィルターで音声へ戻します。",
                ko: "Class A 소자는 대부분의 시간 동안 도통해 선형성이 좋지만 전력 소모가 큽니다. Class AB는 양과 음의 반주기를 나눠 출력하고 Class D는 오디오를 고속 스위칭 펄스로 변조한 뒤 부하와 필터로 오디오를 복원합니다."
              }
            },
            {
              name: { zh: "动圈扬声器", en: "Moving-coil speaker", ja: "ムービングコイルスピーカー", ko: "무빙 코일 스피커" },
              explanation: {
                zh: "动圈单元由音圈、磁路、振膜、悬边和定心支片组成。音圈中的电流在磁场里产生力，带动振膜推动空气。",
                en: "A moving-coil driver has a voice coil, magnetic circuit, diaphragm, surround, and spider. Current in the coil creates force in the magnetic field and moves air.",
                ja: "ダイナミック型ユニットは、ボイスコイル、磁気回路、振動板、エッジ、ダンパーで構成されます。コイルの電流が磁場中で力を生み、振動板を動かして空気を動かします。",
                ko: "다이내믹 드라이버는 보이스 코일, 자기 회로, 진동판, 서라운드와 스파이더로 구성됩니다. 코일의 전류가 자기장 안에서 힘을 만들어 진동판을 움직이고 공기를 이동시킵니다."
              }
            },
            {
              name: { zh: "阻抗", en: "Impedance", ja: "インピーダンス", ko: "임피던스" },
              explanation: {
                zh: "阻抗不是固定电阻，而是随频率变化的交流负载。标称 4 Ω、8 Ω 只是参考值，真实曲线会影响功放电流和控制力。",
                en: "Impedance is a frequency-dependent AC load, not a fixed resistor. Nominal 4 ohm or 8 ohm values are references; the real curve affects current and control.",
                ja: "インピーダンスは固定抵抗ではなく、周波数で変化する交流負荷です。公称 4 Ω や 8 Ω は目安にすぎず、実際の曲線がアンプの電流と制動力に影響します。",
                ko: "임피던스는 고정 저항이 아니라 주파수에 따라 변하는 교류 부하입니다. 공칭 4 Ω 또는 8 Ω은 참고값일 뿐이며 실제 곡선이 앰프 전류와 제어력에 영향을 줍니다."
              }
            },
            {
              name: { zh: "灵敏度", en: "Sensitivity", ja: "感度", ko: "감도" },
              explanation: {
                zh: "灵敏度描述扬声器在给定输入下能产生多大声压。高灵敏度单元在同样功率下更容易响，但频响、失真和体积仍要一起看。",
                en: "Sensitivity describes sound pressure for a given input. Higher sensitivity gets louder with the same power, but frequency response, distortion, and size still matter.",
                ja: "感度は、決められた入力でスピーカーがどれだけの音圧を出せるかを表します。同じ電力なら高感度ユニットほど大きくなりますが、周波数特性、歪み、サイズも考慮が必要です。",
                ko: "감도는 정해진 입력에서 스피커가 얼마나 큰 음압을 낼 수 있는지를 나타냅니다. 같은 전력에서는 고감도 유닛이 더 크게 울리지만 주파수 응답, 왜곡과 크기도 함께 봐야 합니다."
              }
            },
            {
              name: { zh: "分频器", en: "Crossover", ja: "クロスオーバー", ko: "크로스오버" },
              explanation: {
                zh: "分频器把低频、中频和高频送给适合的单元。分频点、斜率、相位和单元摆位都会影响衔接和声像。",
                en: "A crossover sends bass, midrange, and treble to suitable drivers. Crossover point, slope, phase, and driver placement affect integration and imaging.",
                ja: "クロスオーバーは低域、中域、高域を適したユニットへ送ります。クロスオーバー周波数、傾き、位相、ユニットの配置がつながりと音像に影響します。",
                ko: "크로스오버는 저음, 중음과 고음을 적절한 드라이버로 보냅니다. 크로스오버 주파수, 기울기, 위상과 드라이버 배치가 연결감과 음상을 좌우합니다."
              }
            },
            {
              name: { zh: "Thiele-Small 参数", en: "Thiele-Small parameters", ja: "Thiele-Small パラメーター", ko: "Thiele-Small 파라미터" },
              explanation: {
                zh: "T/S 参数是一组描述低频小信号行为的单元参数。Fs 是自由空气谐振频率，Qts 是总 Q 值，Vas 是等效空气顺性体积；它们常用于估算箱体容积、低频下潜和是否适合倒相调谐。",
                en: "T/S parameters describe a driver's low-frequency small-signal behavior. Fs is free-air resonance, Qts is total Q, and Vas is equivalent compliance volume; they help estimate box volume, bass extension, and ported-box suitability.",
                ja: "T/S パラメーターはユニットの低域小信号特性を表します。Fs は自由空気共振周波数、Qts は総合 Q、Vas は等価空気コンプライアンス容積で、箱体容積、低域の伸び、バスレフ箱への適性を見積もるのに役立ちます。",
                ko: "T/S 파라미터는 드라이버의 저주파 소신호 특성을 설명합니다. Fs는 자유 공진 주파수, Qts는 총 Q, Vas는 등가 순응 용적이며 인클로저 용적, 저주파 확장과 포트형 인클로저 적합성을 추정하는 데 사용합니다."
              }
            },
            {
              name: { zh: "密闭箱 vs 倒相箱", en: "Sealed vs bass reflex", ja: "密閉箱とバスレフ箱", ko: "밀폐형과 베이스 리플렉스" },
              explanation: {
                zh: "密闭箱没有导管，箱内空气像弹簧一样限制振膜，瞬态和滚降通常更可控；倒相箱通过导管和箱体形成共振，在调谐频率附近提高低频效率，但导管噪声、群延迟和调谐点以下保护要注意。",
                en: "A sealed box has no port; trapped air works like a spring and often gives controlled rolloff and transient behavior. A bass-reflex box uses a port resonance to increase efficiency near tuning, but port noise, group delay, and below-tuning protection matter.",
                ja: "密閉箱にはポートがなく、閉じ込めた空気がばねのように働いて、ロールオフと過渡特性を制御しやすくします。バスレフ箱はポート共振でチューニング付近の効率を高めますが、ポートノイズ、群遅延、チューニング以下の保護に注意が必要です。",
                ko: "밀폐형에는 포트가 없고 갇힌 공기가 스프링처럼 작용해 롤오프와 과도 응답을 제어하기 쉽습니다. 베이스 리플렉스는 포트 공진으로 튜닝 부근의 효율을 높이지만 포트 잡음, 그룹 지연과 튜닝 이하 보호를 고려해야 합니다."
              }
            },
            {
              name: { zh: "分频阶数与相位", en: "Crossover order and phase", ja: "クロスオーバー次数と位相", ko: "크로스오버 차수와 위상" },
              explanation: {
                zh: "一阶、二阶、四阶分频对应不同衰减斜率和相位旋转。真正设计时要让低音和高音在分频点附近幅度相加、相位尽量对齐，否则会出现凹陷、隆起或声像漂移。",
                en: "First-, second-, and fourth-order crossovers have different slopes and phase rotation. Real designs must make woofer and tweeter sum correctly near the crossover point, or dips, peaks, and image shifts appear.",
                ja: "1次、2次、4次のクロスオーバーは減衰傾斜と位相回転が異なります。実際の設計ではクロスオーバー付近でウーファーとツイーターの振幅が正しく合成され、位相もできるだけそろう必要があります。そうでなければディップ、ピーク、音像の移動が生じます。",
                ko: "1차, 2차와 4차 크로스오버는 감쇠 기울기와 위상 회전이 다릅니다. 실제 설계에서는 크로스오버 부근에서 우퍼와 트위터의 진폭이 올바르게 합산되고 위상도 최대한 맞아야 하며 그렇지 않으면 딥, 피크나 음상 이동이 나타납니다."
              }
            },
            {
              name: { zh: "主动分频 vs 被动分频", en: "Active vs passive crossover", ja: "アクティブ分岐とパッシブ分岐", ko: "액티브와 패시브 크로스오버" },
              explanation: {
                zh: "主动分频在功放之前完成，便于做精确延迟、EQ、限幅和单元保护；被动分频在功放之后完成，不需要多路功放，但元件会发热，且滤波结果会跟随扬声器阻抗曲线变化。",
                en: "Active crossovers happen before amplifiers and allow precise delay, EQ, limiting, and driver protection. Passive crossovers happen after the amplifier and avoid multiple amps, but components heat up and filter behavior follows the speaker impedance curve.",
                ja: "アクティブ分岐はアンプの前で行うため、正確な遅延、EQ、リミッター、ユニット保護が可能です。パッシブ分岐はアンプ後で行い、多数のアンプを不要にしますが、部品が発熱し、フィルター特性がスピーカーのインピーダンス曲線に従います。",
                ko: "액티브 크로스오버는 앰프 앞에서 동작하므로 정밀한 지연, EQ, 리미팅과 드라이버 보호가 가능합니다. 패시브 크로스오버는 앰프 뒤에서 동작해 여러 앰프가 필요 없지만 부품이 발열하고 필터 특성이 스피커 임피던스 곡선을 따릅니다."
              }
            },
            {
              name: { zh: "线阵列扬声器", en: "Line array speaker", ja: "ラインアレイスピーカー", ko: "라인 어레이 스피커" },
              explanation: {
                zh: "线阵列把多个单元排成一列，通过物理间距、角度、延迟和电平控制覆盖范围。它不是简单把喇叭堆多，而是用干涉和指向性控制让远近听众获得更均匀的声压。",
                en: "A line array stacks drivers vertically and controls coverage with spacing, splay angle, delay, and level. It is not just more speakers; interference and directivity are used to make SPL more even across near and far listeners.",
                ja: "ラインアレイは複数のユニットを垂直に並べ、間隔、開き角、遅延、レベルでカバレッジを制御します。単にスピーカーを増やすのではなく、干渉と指向性を利用して近距離と遠距離の聴取者へより均一な SPL を届けます。",
                ko: "라인 어레이는 여러 드라이버를 수직으로 배치하고 간격, 벌림 각도, 지연과 레벨로 커버리지를 제어합니다. 스피커를 단순히 늘리는 것이 아니라 간섭과 지향성을 이용해 가까운 청취자와 먼 청취자에게 더 균일한 SPL을 전달합니다."
              }
            }
          ],
          lab: {
            type: "amplifier-speaker",
            title: { zh: "功放与扬声器实验室", en: "Amplifier and Speaker Lab", ja: "アンプとスピーカーラボ", ko: "앰프와 스피커 실험실" },
            description: {
              zh: "进入独立界面观察小信号、功放、扬声器单元、T/S 参数、箱体、分频阶数、主动/被动分频、线阵列和空气声波之间的关系。",
              en: "Open an independent lab to inspect the relationships among small signals, amplifiers, speaker drivers, T/S parameters, enclosures, crossover order, active/passive crossovers, line arrays, and air pressure.",
              ja: "独立したラボで、小信号、アンプ、スピーカーユニット、T/S パラメーター、エンクロージャー、クロスオーバー次数、アクティブ／パッシブ分岐、ラインアレイ、空気圧の関係を確認します。",
              ko: "독립 실험실에서 작은 신호, 앰프, 스피커 드라이버, T/S 파라미터, 인클로저, 크로스오버 차수, 액티브/패시브 크로스오버, 라인 어레이와 공기 압력의 관계를 확인합니다."
            },
            buttonLabel: { zh: "打开功放与扬声器实验室", en: "Open amplifier and speaker lab", ja: "アンプとスピーカーラボを開く", ko: "앰프와 스피커 실험실 열기" }
          },
          misconception: {
            zh: "瓦数更大不等于一定更响或更好听；阻抗、灵敏度、箱体、失真、散热、保护和摆放都会影响最终声音。",
            en: "More watts do not guarantee louder or better sound; impedance, sensitivity, enclosure, distortion, heat, protection, and placement all shape the result.",
            ja: "ワット数が大きいからといって、必ずしも大きく、または良く聴こえるとは限りません。インピーダンス、感度、エンクロージャー、歪み、発熱、保護、設置が最終的な音を左右します。",
            ko: "와트 수가 크다고 반드시 더 크거나 더 좋은 소리가 나는 것은 아닙니다. 임피던스, 감도, 인클로저, 왜곡, 발열, 보호와 배치가 최종 음향을 좌우합니다."
          },
          contentDirection: {
            zh: "适合继续扩展为 T/S 参数选箱工具、密闭/倒相低频响应对比、分频相位对齐案例、小音箱保护算法和真实产品播放链路拆解。",
            en: "This can expand into a T/S parameter box-selection tool, sealed/ported bass-response comparison, crossover phase-alignment cases, small-speaker protection, and real product playback-chain breakdowns.",
            ja: "T/S パラメーターによる箱体選定ツール、密閉／バスレフの低域応答比較、クロスオーバーの位相合わせ事例、小型スピーカー保護、実製品の再生チェーン分解へ発展できます。",
            ko: "T/S 파라미터 인클로저 선택 도구, 밀폐형/포트형 저주파 응답 비교, 크로스오버 위상 정렬 사례, 소형 스피커 보호와 실제 제품 재생 체인 분석으로 확장할 수 있습니다."
          }
        }
      }
    ]
  },
  {
    id: "software",
    icon: Cpu,
    accent: "#4f7cbd",
    title: { zh: "音频软件", en: "Audio Software", ja: "オーディオソフトウェア", ko: "오디오 소프트웨어" },
    description: {
      zh: "理解系统音频栈、数据流、编解码和实时处理。",
      en: "Understand system audio stacks, data flow, codecs, and real-time processing.",
      ja: "システム音声スタック、データフロー、Codec、リアルタイム処理を理解します。",
      ko: "시스템 오디오 스택, 데이터 흐름, 코덱과 실시간 처리를 이해합니다."
    },
    topics: [
      {
        title: { zh: "系统音频架构", en: "System Audio Architecture", ja: "システム音声アーキテクチャ", ko: "시스템 오디오 아키텍처" },
        summary: {
          zh: "用系统分层看清 App、音频服务、驱动和硬件如何分工。",
          en: "Use system layers to understand how apps, audio services, drivers, and hardware divide responsibilities.",
          ja: "システムの層を使って、アプリ、音声サービス、ドライバー、ハードウェアの役割分担を理解します。",
          ko: "시스템 계층을 통해 앱, 오디오 서비스, 드라이버와 하드웨어의 역할 분담을 이해합니다."
        },
        bullets: [
          { zh: "应用、服务、驱动和硬件边界", en: "App, service, driver, and hardware boundaries", ja: "アプリ、サービス、ドライバー、ハードウェアの境界", ko: "앱, 서비스, 드라이버와 하드웨어의 경계" },
          { zh: "播放、采集和全双工链路", en: "Playback, capture, and full-duplex paths", ja: "再生、収音、全二重の経路", ko: "재생, 캡처와 전이중 경로" },
          { zh: "设备路由、权限、会话和音量", en: "Device routing, permission, session, and volume", ja: "デバイスルーティング、権限、セッション、音量", ko: "장치 라우팅, 권한, 세션과 볼륨" }
        ],
        detail: {
          explanation: {
            zh: "系统音频架构回答的是：应用发起播放或录音请求后，系统如何选择设备、管理权限、处理会话和音量，并把 PCM 数据交给驱动和硬件。它是系统层总览，不展开具体 DSP 算法、接口时序或低延迟调参。",
            en: "System audio architecture answers this question: after an app requests playback or recording, how does the system choose devices, manage permission, handle sessions and volume, then hand PCM data to drivers and hardware? It is a system-level overview, not a deep dive into DSP algorithms, interface timing, or low-latency tuning.",
            ja: "システム音声アーキテクチャは、アプリが再生や録音を要求した後、システムがデバイスを選び、権限を管理し、セッションと音量を処理して、PCM データをドライバーとハードウェアへ渡す方法を説明します。これはシステム層の概要であり、具体的な DSP アルゴリズム、インターフェースのタイミング、低遅延チューニングの詳細には踏み込みません。",
            ko: "시스템 오디오 아키텍처는 앱이 재생이나 녹음을 요청한 뒤 시스템이 장치를 선택하고 권한을 관리하며 세션과 볼륨을 처리해 PCM 데이터를 드라이버와 하드웨어로 넘기는 방식을 설명합니다. 시스템 계층의 개요이며 구체적인 DSP 알고리즘, 인터페이스 타이밍이나 저지연 튜닝의 세부 사항을 다루지는 않습니다."
          },
          chainContext: {
            stage: { zh: "系统调度层：请求到设备", en: "System orchestration: request to device", ja: "システム調整層：リクエストからデバイスへ", ko: "시스템 오케스트레이션: 요청에서 장치로" },
            input: { zh: "应用的播放、采集或通话请求", en: "Playback, capture, or call request from an app", ja: "アプリからの再生、収音、通話リクエスト", ko: "앱의 재생, 캡처 또는 통화 요청" },
            output: { zh: "路由后的 PCM 数据与控制状态", en: "Routed PCM data and control state", ja: "ルーティング後の PCM データと制御状態", ko: "라우팅된 PCM 데이터와 제어 상태" },
            next: { zh: "进入 ALSA / HAL、驱动和硬件链路", en: "Next: ALSA / HAL, drivers, and hardware path", ja: "次段：ALSA / HAL、ドライバー、ハードウェア経路", ko: "다음: ALSA / HAL, 드라이버와 하드웨어 경로" }
          },
          keyConcepts: [
            { zh: "系统音频先处理请求和策略，再把数据交给具体设备；应用通常不直接控制物理麦克风或扬声器。", en: "System audio handles requests and policy before handing data to a device; apps usually do not control physical microphones or speakers directly.", ja: "システム音声はまずリクエストとポリシーを処理してから特定のデバイスへデータを渡し、アプリが物理マイクやスピーカーを直接制御することは通常ありません。", ko: "시스템 오디오는 먼저 요청과 정책을 처리한 뒤 특정 장치로 데이터를 넘기며 앱이 물리적 마이크나 스피커를 직접 제어하는 경우는 보통 없습니다." },
            { zh: "播放、采集和全双工共用系统管理，但数据方向和设备占用关系不同。", en: "Playback, capture, and full duplex share system management, but differ in data direction and device ownership.", ja: "再生、収音、全二重はシステム管理を共有しますが、データ方向とデバイス占有の関係は異なります。", ko: "재생, 캡처와 전이중은 시스템 관리를 공유하지만 데이터 방향과 장치 점유 관계가 다릅니다." },
            { zh: "系统层定义模块边界：ALSA 负责 Linux 设备接口，实时卡片负责 deadline，算法卡片负责信号处理。", en: "The system layer defines boundaries: ALSA owns Linux device interfaces, the real-time card owns deadlines, and algorithm cards own signal processing.", ja: "システム層はモジュールの境界を定義します。ALSA は Linux デバイスインターフェース、リアルタイム層は deadline、アルゴリズム層は信号処理を担当します。", ko: "시스템 계층은 모듈 경계를 정의합니다. ALSA는 Linux 장치 인터페이스, 실시간 계층은 deadline, 알고리즘 계층은 신호 처리를 담당합니다." }
          ],
          termExplanations: [
            {
              name: { zh: "请求生命周期", en: "Request lifecycle", ja: "リクエストのライフサイクル", ko: "요청 수명 주기" },
              explanation: {
                zh: "应用先提出播放、采集或通话请求，系统再完成权限检查、设备选择、格式协商和流启动。应用拿到的是系统提供的音频流，不必知道每个硬件寄存器。",
                en: "An app first requests playback, capture, or a call. The system then checks permission, selects a device, negotiates format, and starts the stream. The app receives a system audio stream without knowing each hardware register.",
                ja: "アプリはまず再生、収音、通話を要求し、システムが権限確認、デバイス選択、形式ネゴシエーション、ストリーム開始を行います。アプリは個々のハードウェアレジスターを知らなくても、システムが提供する音声ストリームを受け取れます。",
                ko: "앱이 먼저 재생, 캡처 또는 통화를 요청하면 시스템이 권한 확인, 장치 선택, 형식 협상과 스트림 시작을 수행합니다. 앱은 각 하드웨어 레지스터를 알지 못해도 시스템 오디오 스트림을 받습니다."
              }
            },
            {
              name: { zh: "策略与数据流分离", en: "Policy versus data flow", ja: "ポリシーとデータフローの分離", ko: "정책과 데이터 흐름의 분리" },
              explanation: {
                zh: "路由、音量、音频焦点和权限回答‘允许谁使用哪台设备’；PCM 数据流回答‘样本如何按时间顺序传递’。两者相关，但不是同一个模块。",
                en: "Routing, volume, audio focus, and permission answer who may use which device; the PCM data flow answers how samples move over time. They interact but are not the same module.",
                ja: "ルーティング、音量、オーディオフォーカス、権限は「誰がどのデバイスを使えるか」に答え、PCM データフローは「サンプルが時間に沿ってどう移動するか」に答えます。両者は関係しますが同じモジュールではありません。",
                ko: "라우팅, 볼륨, 오디오 포커스와 권한은 ‘누가 어떤 장치를 사용할 수 있는가’를 결정하고 PCM 데이터 흐름은 ‘샘플이 시간에 따라 어떻게 이동하는가’를 다룹니다. 서로 관련되지만 같은 모듈은 아닙니다."
              }
            },
            {
              name: { zh: "平台边界", en: "Platform boundary", ja: "プラットフォーム境界", ko: "플랫폼 경계" },
              explanation: {
                zh: "Android AudioFlinger、Linux PipeWire/ALSA、Windows WASAPI 和 macOS Core Audio 的名称不同，但都要完成请求管理、路由和设备适配。具体 API 与驱动细节放在平台专题中。",
                en: "Android AudioFlinger, Linux PipeWire/ALSA, Windows WASAPI, and macOS Core Audio use different names but all manage requests, routing, and device adaptation. Platform-specific APIs and drivers belong in dedicated topics.",
                ja: "Android AudioFlinger、Linux PipeWire/ALSA、Windows WASAPI、macOS Core Audio は名称が異なりますが、いずれもリクエスト管理、ルーティング、デバイス適応を行います。固有の API とドライバーの詳細は各プラットフォームのテーマで扱います。",
                ko: "Android AudioFlinger, Linux PipeWire/ALSA, Windows WASAPI와 macOS Core Audio는 이름은 다르지만 모두 요청 관리, 라우팅과 장치 적응을 수행합니다. 플랫폼별 API와 드라이버 세부 사항은 각 플랫폼 주제에서 다룹니다."
              }
            }
          ],
          lab: {
            type: "system-audio",
            title: { zh: "系统音频架构实验室", en: "System Audio Architecture Lab", ja: "システム音声アーキテクチャラボ", ko: "시스템 오디오 아키텍처 실험실" },
            description: {
              zh: "进入独立界面查看通用分层、Linux 示例，并切换播放、录音和全双工三条系统链路。",
              en: "Open an independent lab to view generic layers, a Linux example, and switch among playback, capture, and full-duplex system paths.",
              ja: "独立したラボで一般的な層構造と Linux の例を確認し、再生、録音、全二重の3つのシステム経路を切り替えます。",
              ko: "독립 실험실에서 일반적인 계층과 Linux 예시를 확인하고 재생, 녹음과 전이중 시스템 경로를 전환합니다."
            },
            buttonLabel: { zh: "打开系统音频架构实验室", en: "Open system audio architecture lab", ja: "システム音声アーキテクチャラボを開く", ko: "시스템 오디오 아키텍처 실험실 열기" }
          },
          misconception: {
            zh: "系统音频架构不是某一个算法模块，也不是硬件接口教程；它主要解释系统如何管理请求、设备和数据流边界。",
            en: "System audio architecture is not one algorithm module or a hardware-interface tutorial; it mainly explains how the system manages requests, devices, and data-flow boundaries.",
            ja: "システム音声アーキテクチャは単一のアルゴリズムモジュールでもハードウェアインターフェースのチュートリアルでもなく、主にシステムがリクエスト、デバイス、データフローの境界を管理する方法を説明します。",
            ko: "시스템 오디오 아키텍처는 하나의 알고리즘 모듈이나 하드웨어 인터페이스 튜토리얼이 아니라 시스템이 요청, 장치와 데이터 흐름의 경계를 관리하는 방식을 설명합니다."
          },
          contentDirection: {
            zh: "适合后续继续补充 Android AudioFlinger、Windows WASAPI、macOS Core Audio 与 Linux 的系统级对比。",
            en: "This can later add system-level comparisons among Android AudioFlinger, Windows WASAPI, macOS Core Audio, and Linux.",
            ja: "今後は Android AudioFlinger、Windows WASAPI、macOS Core Audio、Linux のシステムレベル比較を追加できます。",
            ko: "향후 Android AudioFlinger, Windows WASAPI, macOS Core Audio와 Linux의 시스템 수준 비교를 추가할 수 있습니다."
          }
        }
      },
      {
        title: { zh: "ALSA 框架", en: "ALSA Framework", ja: "ALSA フレームワーク", ko: "ALSA 프레임워크" },
        summary: {
          zh: "从 alsa-lib 到内核 PCM、DMA 和 Codec，理解 Linux 音频设备、参数和 XRUN。",
          en: "Trace Linux audio from alsa-lib through kernel PCM, DMA, and codecs, including device parameters and XRUNs.",
          ja: "alsa-lib からカーネル PCM、DMA、Codec までをたどり、Linux の音声デバイス、パラメーター、XRUN を理解します。",
          ko: "alsa-lib에서 커널 PCM, DMA와 Codec까지 Linux 오디오 경로를 따라가며 장치 파라미터와 XRUN을 이해합니다."
        },
        bullets: [
          { zh: "card / device / subdevice / PCM stream 设备模型", en: "The card / device / subdevice / PCM stream device model", ja: "card / device / subdevice / PCM stream のデバイスモデル", ko: "card / device / subdevice / PCM stream 장치 모델" },
          { zh: "hw、plughw、default 与 hw_params / sw_params", en: "hw, plughw, default, and hw_params / sw_params", ja: "hw、plughw、default と hw_params / sw_params", ko: "hw, plughw, default와 hw_params / sw_params" },
          { zh: "read/write、mmap、buffer / period 与 XRUN 排查", en: "read/write, mmap, buffer / period, and XRUN troubleshooting", ja: "read/write、mmap、buffer / period、XRUN のトラブルシューティング", ko: "read/write, mmap, buffer / period와 XRUN 문제 해결" }
        ],
        detail: {
          explanation: {
            zh: "ALSA（Advanced Linux Sound Architecture）是 Linux 的音频实现专题，不等于完整的系统音频架构。它通过 alsa-lib 向用户态提供 PCM、Control 等 API，并把流连接到内核 PCM、DMA 环形 buffer 和声卡；系统级的权限、音频焦点、应用会话和跨设备路由仍由上层音频服务负责。一次 PCM 播放通常从应用和 alsa-lib 出发，经过 PCM 插件与内核 ALSA PCM，把样本放进由 DMA 消费的环形 buffer，最后沿 I2S 等接口到达 Codec DAC；录音方向相反。ALSA 负责设备与流的接口、参数协商和时序状态，但不会替你解决所有调度抖动或设备时钟问题。",
            en: "ALSA (Advanced Linux Sound Architecture) is a Linux implementation topic, not the whole system audio architecture. It exposes PCM and Control APIs through alsa-lib and connects streams to kernel PCM, DMA ring buffers, and sound cards; system-level permission, focus, app sessions, and cross-device routing remain the responsibility of higher audio services. A PCM playback stream usually starts in the app and alsa-lib, passes through PCM plugins and the kernel ALSA PCM layer, places samples in a DMA-consumed ring buffer, and reaches a Codec DAC over interfaces such as I2S; capture reverses the path. ALSA provides device, parameter, and stream-state interfaces, but it cannot remove every scheduling or clocking problem.",
            ja: "ALSA（Advanced Linux Sound Architecture）は Linux の音声実装を扱うテーマであり、システム音声アーキテクチャ全体を指すものではありません。alsa-lib を通じてユーザー空間へ PCM や Control API を提供し、ストリームをカーネル PCM、DMA リングバッファー、サウンドカードへ接続します。システムレベルの権限、フォーカス、アプリセッション、デバイス間ルーティングは上位の音声サービスが担います。PCM 再生は通常、アプリと alsa-lib から始まり、PCM プラグインとカーネル ALSA PCM 層を通り、DMA が消費するリングバッファーへサンプルを置き、I2S などのインターフェースで Codec DAC に届きます。録音は逆方向です。ALSA はデバイス、パラメーター、ストリーム状態のインターフェースを提供しますが、すべてのスケジューリング揺らぎやクロック問題を解消するものではありません。",
            ko: "ALSA(Advanced Linux Sound Architecture)는 Linux 오디오 구현을 다루는 주제이지 시스템 오디오 아키텍처 전체를 뜻하지는 않습니다. alsa-lib를 통해 사용자 공간에 PCM과 Control API를 제공하고 스트림을 커널 PCM, DMA 링 버퍼와 사운드 카드에 연결합니다. 시스템 수준의 권한, 포커스, 앱 세션과 장치 간 라우팅은 상위 오디오 서비스가 담당합니다. PCM 재생은 보통 앱과 alsa-lib에서 시작해 PCM 플러그인과 커널 ALSA PCM 계층을 거치고 DMA가 소비하는 링 버퍼에 샘플을 넣은 뒤 I2S 같은 인터페이스를 통해 Codec DAC에 도달합니다. 녹음은 반대 방향입니다. ALSA는 장치, 파라미터와 스트림 상태 인터페이스를 제공하지만 모든 스케줄링 지터나 클록 문제를 해결해 주지는 않습니다."
          },
          keyConcepts: [
            { zh: "card 是声卡容器，PCM device 是音频流端点，subdevice 是端点下可并行使用的逻辑实例；PCM stream 再区分 playback 和 capture。Control 是声卡级的独立控制接口。", en: "A card is a sound-card container, a PCM device is an audio-stream endpoint, and a subdevice is a logical instance that may be used in parallel; a PCM stream is playback or capture. Control is a separate card-level interface.", ja: "card はサウンドカードのコンテナ、PCM device は音声ストリームの端点、subdevice は端点の下で並列利用できる論理インスタンスです。PCM stream は playback と capture に分かれ、Control はカード単位の独立した制御インターフェースです。", ko: "card는 사운드 카드 컨테이너, PCM device는 오디오 스트림 엔드포인트, subdevice는 엔드포인트 아래에서 병렬로 사용할 수 있는 논리 인스턴스입니다. PCM stream은 playback과 capture로 나뉘며 Control은 카드 수준의 별도 제어 인터페이스입니다." },
            { zh: "hw 追求设备原生能力，plughw 可做格式、采样率或通道转换，default 交给系统默认路由；名称背后的实际插件和策略依发行版配置而变。", en: "hw requests native device behavior, plughw can convert format, rate, or channels, and default follows the system route; the actual plugins and policy depend on distro configuration.", ja: "hw はデバイス本来の動作を要求し、plughw は形式、レート、チャンネルを変換でき、default はシステムのルートに従います。実際のプラグインとポリシーはディストリビューションの設定に依存します。", ko: "hw는 장치의 네이티브 동작을 요청하고 plughw는 형식, 레이트 또는 채널을 변환할 수 있으며 default는 시스템 경로를 따릅니다. 실제 플러그인과 정책은 배포판 설정에 따라 달라집니다." },
            { zh: "hw_params 协商硬件流参数，sw_params 设置可用帧、启动和停止阈值等软件策略；两者不是同一层。", en: "hw_params negotiates hardware stream parameters, while sw_params sets software policy such as available-frame, start, and stop thresholds; they are different layers.", ja: "hw_params はハードウェアストリームのパラメーターをネゴシエーションし、sw_params は利用可能フレーム、開始・停止しきい値などのソフトウェアポリシーを設定します。両者は別の層です。", ko: "hw_params는 하드웨어 스트림 파라미터를 협상하고 sw_params는 가용 프레임, 시작·중지 임계값 같은 소프트웨어 정책을 설정합니다. 둘은 서로 다른 계층입니다." },
            { zh: "播放 underrun 是硬件追上了应用尚未填满的区域；录音 overrun 是硬件覆盖了应用尚未读取的数据。", en: "A playback underrun means hardware caught up with an area the app had not filled; a capture overrun means hardware overwrote data the app had not read.", ja: "再生 underrun は、アプリがまだ埋めていない領域にハードウェアが追いつく状態です。録音 overrun は、アプリがまだ読んでいないデータをハードウェアが上書きする状態です。", ko: "재생 underrun은 하드웨어가 앱이 아직 채우지 못한 영역까지 따라잡는 상태이고 녹음 overrun은 하드웨어가 앱이 아직 읽지 않은 데이터를 덮어쓰는 상태입니다." }
          ],
          termExplanations: [
            {
              name: { zh: "card / device / subdevice", en: "card / device / subdevice", ja: "card / device / subdevice", ko: "card / device / subdevice" },
              explanation: {
                zh: "card 表示一张物理或虚拟声卡，例如 card 0；PCM device 是卡上的音频流端点，例如 device 0；subdevice 是 PCM 端点提供的逻辑子流。PCM stream 还必须声明 playback 或 capture 方向。Control 则是声卡级控制接口，不应与 PCM device 编号混为一谈。",
                en: "A card is a physical or virtual sound card such as card 0. A PCM device is an audio-stream endpoint on that card, such as device 0, and a subdevice is a logical PCM substream. The PCM stream must also declare playback or capture direction. Control is a separate card-level interface and should not be confused with PCM device numbering.",
                ja: "card は card 0 のような物理または仮想サウンドカード、PCM device は device 0 のようなカード上の音声ストリーム端点、subdevice は PCM 端点が提供する論理サブストリームです。PCM stream には playback または capture の方向も必要です。Control はカード単位の別インターフェースで、PCM device 番号と混同してはいけません。",
                ko: "card는 card 0 같은 물리 또는 가상 사운드 카드이고 PCM device는 device 0 같은 카드 내 오디오 스트림 엔드포인트이며 subdevice는 PCM 엔드포인트가 제공하는 논리 서브스트림입니다. PCM stream에는 playback 또는 capture 방향도 지정해야 합니다. Control은 카드 수준의 별도 인터페이스이므로 PCM device 번호와 혼동하면 안 됩니다."
              }
            },
            {
              name: { zh: "hw / plughw / default", en: "hw / plughw / default", ja: "hw / plughw / default", ko: "hw / plughw / default" },
              explanation: {
                zh: "hw:0,0 直接请求 card 0 的 PCM device 0，通常不替你转换格式；plughw:0,0 允许 alsa-lib 的 plug 层在设备支持范围内做格式、采样率和通道适配；default 是系统配置的默认 PCM，可能经过 dmix、重采样或其它路由。它们不是三个固定硬件。",
                en: "hw:0,0 requests card 0, PCM device 0 with little automatic conversion. plughw:0,0 allows alsa-lib's plug layer to adapt format, rate, and channels within device limits. default is the configured default PCM and may use dmix, resampling, or other routing. They are not three fixed pieces of hardware.",
                ja: "hw:0,0 は card 0 の PCM device 0 を直接要求し、通常は形式を自動変換しません。plughw:0,0 は alsa-lib の plug 層に、デバイスの範囲内で形式、レート、チャンネルを適応させます。default は設定された既定 PCM で、dmix、リサンプリング、その他のルーティングを使うことがあります。3つの固定ハードウェアではありません。",
                ko: "hw:0,0은 card 0의 PCM device 0을 직접 요청하며 보통 형식을 자동 변환하지 않습니다. plughw:0,0은 alsa-lib의 plug 계층이 장치 한도 안에서 형식, 레이트와 채널을 조정하도록 합니다. default는 설정된 기본 PCM으로 dmix, 리샘플링 또는 다른 라우팅을 사용할 수 있습니다. 세 가지 고정 하드웨어가 아닙니다."
              }
            },
            {
              name: { zh: "hw_params / sw_params", en: "hw_params / sw_params", ja: "hw_params / sw_params", ko: "hw_params / sw_params" },
              explanation: {
                zh: "hw_params 描述 access、format、rate、channels、period size 和 buffer size 等硬件约束，通常在 prepare 前完成协商。sw_params 描述 avail_min、start_threshold、stop_threshold 等软件可见阈值，影响何时唤醒和何时启动或停止流。",
                en: "hw_params describes hardware constraints such as access, format, rate, channels, period size, and buffer size, normally negotiated before prepare. sw_params describes software-visible thresholds such as avail_min, start_threshold, and stop_threshold, affecting wakeups and stream start or stop behavior.",
                ja: "hw_params は access、format、rate、channels、period size、buffer size などのハードウェア制約を表し、通常は prepare 前にネゴシエーションします。sw_params は avail_min、start_threshold、stop_threshold などソフトウェアから見えるしきい値を表し、ウェイクアップやストリームの開始・停止動作に影響します。",
                ko: "hw_params는 access, format, rate, channels, period size와 buffer size 같은 하드웨어 제약을 설명하며 보통 prepare 전에 협상합니다. sw_params는 avail_min, start_threshold, stop_threshold 같은 소프트웨어 가시 임계값을 설명하고 깨우기와 스트림 시작·중지 동작에 영향을 줍니다."
              }
            },
            {
              name: { zh: "PCM vs Control / Mixer", en: "PCM vs Control / Mixer", ja: "PCM と Control / Mixer", ko: "PCM과 Control / Mixer" },
              explanation: {
                zh: "PCM API 搬运有时间顺序的音频帧，例如 snd_pcm_writei 或 snd_pcm_readi。Control/Mixer API 不搬运音频帧，而是读写音量、静音、输入选择、路由和开关等控件；alsamixer 主要展示后者。",
                en: "The PCM API moves time-ordered audio frames through calls such as snd_pcm_writei or snd_pcm_readi. Control/Mixer APIs do not move audio frames; they read and write controls such as volume, mute, input selection, routing, and switches. alsamixer mainly exposes the latter.",
                ja: "PCM API は snd_pcm_writei や snd_pcm_readi などを通じて、時間順の音声フレームを運びます。Control／Mixer API はフレームを運ばず、音量、ミュート、入力選択、ルーティング、スイッチなどのコントロールを読み書きします。alsamixer は主に後者を表示します。",
                ko: "PCM API는 snd_pcm_writei나 snd_pcm_readi 같은 호출로 시간 순서의 오디오 프레임을 전달합니다. Control/Mixer API는 프레임을 전달하지 않고 볼륨, 음소거, 입력 선택, 라우팅과 스위치 같은 컨트롤을 읽고 씁니다. alsamixer는 주로 후자를 표시합니다."
              }
            },
            {
              name: { zh: "read/write vs mmap", en: "read/write vs mmap", ja: "read/write と mmap", ko: "read/write와 mmap" },
              explanation: {
                zh: "read/write 模式通过 snd_pcm_readi、snd_pcm_writei 等接口交付帧，库或内核会完成必要的数据拷贝。mmap 模式通过 snd_pcm_mmap_begin / commit 直接访问映射的环形区域，可减少显式拷贝，但需要驱动和访问模式支持，并不自动降低端到端延迟。",
                en: "read/write mode delivers frames through calls such as snd_pcm_readi and snd_pcm_writei, with required copying handled by the library or kernel. mmap uses snd_pcm_mmap_begin / commit to access a mapped ring directly, which can reduce explicit copies but needs driver and access-mode support and does not automatically lower end-to-end latency.",
                ja: "read/write モードは snd_pcm_readi、snd_pcm_writei などでフレームを渡し、必要なコピーはライブラリまたはカーネルが行います。mmap は snd_pcm_mmap_begin / commit でマッピングされたリングへ直接アクセスし、明示的なコピーを減らせますが、ドライバーと access モードの対応が必要で、端から端までの遅延が自動的に下がるわけではありません。",
                ko: "read/write 모드는 snd_pcm_readi, snd_pcm_writei 같은 호출로 프레임을 전달하고 필요한 복사는 라이브러리나 커널이 처리합니다. mmap은 snd_pcm_mmap_begin / commit으로 매핑된 링에 직접 접근해 명시적 복사를 줄일 수 있지만 드라이버와 access 모드 지원이 필요하며 엔드투엔드 지연을 자동으로 낮추지는 않습니다."
              }
            },
            {
              name: { zh: "buffer / period", en: "buffer / period", ja: "buffer / period", ko: "buffer / period" },
              explanation: {
                zh: "buffer 是环形队列的总帧数；period 是硬件传输的进度通知单位，不是另一块独立 buffer。period count 近似为 bufferFrames / periodFrames。period 越小通知通常越频繁，但应用实际唤醒还取决于 avail_min、通知方式与调度。",
                en: "The buffer is the ring's total frame capacity; a period is a hardware-transfer progress interval, not another independent buffer. Period count is approximately bufferFrames / periodFrames. Smaller periods typically increase notifications, but actual app wakeups also depend on avail_min, notification mode, and scheduling.",
                ja: "buffer はリングの総フレーム容量で、period はハードウェア転送の進捗通知単位です。別の独立した buffer ではありません。period count はおよそ bufferFrames / periodFrames です。period を小さくすると通常は通知が増えますが、アプリの実際のウェイクアップは avail_min、通知方式、スケジューリングにも依存します。",
                ko: "buffer는 링의 전체 프레임 용량이고 period는 하드웨어 전송 진행을 알리는 단위이지 별도의 buffer가 아닙니다. period count는 대략 bufferFrames / periodFrames입니다. period가 작으면 보통 알림이 늘지만 실제 앱 깨우기는 avail_min, 알림 방식과 스케줄링에도 좌우됩니다."
              }
            },
            {
              name: { zh: "XRUN", en: "XRUN", ja: "XRUN", ko: "XRUN" },
              explanation: {
                zh: "XRUN 是流无法按时供给或消费数据的统称。播放 underrun 发生在硬件/DMA 消费速度超过应用填充速度；录音 overrun 发生在硬件写入速度超过应用读取速度。snd_pcm_state 可以确认状态，snd_pcm_prepare 可以让流回到可运行状态，但只恢复流，不修复调度、处理或参数根因。",
                en: "XRUN is the shared term for a stream failing to supply or consume data on time. Playback underrun occurs when hardware/DMA consumes faster than the app fills; capture overrun occurs when hardware writes faster than the app reads. snd_pcm_state confirms the state and snd_pcm_prepare returns the stream to a runnable state, but it only recovers the stream and does not fix scheduling, processing, or parameter root causes.",
                ja: "XRUN はストリームが期限内にデータを供給または消費できない状態の総称です。再生 underrun はハードウェア／DMA の消費がアプリの充填より速いとき、録音 overrun はハードウェアの書き込みがアプリの読み出しより速いときに起こります。snd_pcm_state で状態を確認し、snd_pcm_prepare で実行可能な状態へ戻せますが、復旧するのはストリームだけで、スケジューリング、処理、パラメーターの根本原因は直しません。",
                ko: "XRUN은 스트림이 제때 데이터를 공급하거나 소비하지 못하는 상태를 통칭합니다. 재생 underrun은 하드웨어/DMA 소비가 앱의 채우기보다 빠를 때 발생하고 녹음 overrun은 하드웨어 쓰기가 앱의 읽기보다 빠를 때 발생합니다. snd_pcm_state로 상태를 확인하고 snd_pcm_prepare로 실행 가능한 상태로 되돌릴 수 있지만 스트림만 복구할 뿐 스케줄링, 처리나 파라미터의 근본 원인을 고치지는 않습니다."
              }
            },
            {
              name: { zh: "ASoC / DAI / I2S / Codec", en: "ASoC / DAI / I2S / Codec", ja: "ASoC / DAI / I2S / Codec", ko: "ASoC / DAI / I2S / Codec" },
              explanation: {
                zh: "在嵌入式 Linux 中，ASoC 常把 SoC 音频控制器、DAI、I2S 等 CPU 端和 Codec DAI、Codec、功放组合成声卡链路。DAI 是数字音频接口抽象，I2S 是常见物理协议，Codec 负责 ADC/DAC 和模拟路径；这只是嵌入式常见链路，不是所有 PC 声卡的固定结构。",
                en: "On embedded Linux, ASoC often combines a SoC audio controller, CPU-side DAI and I2S with a codec DAI, codec, and amplifier. DAI is the digital-audio-interface abstraction, I2S is a common protocol, and the codec handles ADC/DAC and analog paths. This is common in embedded Linux, not a fixed structure for every PC sound card.",
                ja: "組み込み Linux では、ASoC が SoC の音声コントローラー、CPU 側の DAI と I2S を Codec DAI、Codec、アンプと組み合わせてサウンドカード経路を構成することがあります。DAI はデジタル音声インターフェースの抽象化、I2S は一般的なプロトコル、Codec は ADC/DAC とアナログ経路を担当します。これは組み込み Linux で一般的な構成であり、すべての PC サウンドカードの固定構造ではありません。",
                ko: "임베디드 Linux에서 ASoC는 SoC 오디오 컨트롤러, CPU 측 DAI와 I2S를 Codec DAI, Codec, 앰프와 결합해 사운드 카드 경로를 구성하는 경우가 많습니다. DAI는 디지털 오디오 인터페이스 추상화이고 I2S는 흔한 프로토콜이며 Codec은 ADC/DAC와 아날로그 경로를 담당합니다. 이는 임베디드 Linux에서 흔한 구성이지 모든 PC 사운드 카드의 고정 구조는 아닙니다."
              }
            }
          ],
          lab: {
            type: "alsa",
            title: { zh: "ALSA 框架实验室", en: "ALSA Framework Lab", ja: "ALSA フレームワークラボ", ko: "ALSA 프레임워크 실험실" },
            description: {
              zh: "在浏览器教学模拟中切换 PCM 播放、PCM 录音、缓冲与延迟和 XRUN 排查，实时观察参数、链路、环形 buffer 与命令变化。",
              en: "In a browser-only teaching simulation, switch among PCM playback, PCM capture, buffer and latency, and XRUN troubleshooting while observing live parameters, paths, ring-buffer state, and commands.",
              ja: "ブラウザーだけで動く教材シミュレーションで、PCM 再生、PCM 録音、バッファーと遅延、XRUN トラブルシューティングを切り替え、パラメーター、経路、リングバッファーの状態、コマンドの変化を確認します。",
              ko: "브라우저 전용 교육 시뮬레이션에서 PCM 재생, PCM 녹음, 버퍼와 지연, XRUN 문제 해결을 전환하며 파라미터, 경로, 링 버퍼 상태와 명령 변화를 관찰합니다."
            },
            buttonLabel: { zh: "打开 ALSA 框架实验室", en: "Open ALSA framework lab", ja: "ALSA フレームワークラボを開く", ko: "ALSA 프레임워크 실험실 열기" }
          },
          misconception: {
            zh: "ALSA 不是只负责播放文件的命令行工具，也不是完整的系统音频策略层；它提供的是 Linux 内核音频架构和用户态接口，默认路由、插件和上层音频服务仍可能参与。",
            en: "ALSA is not merely a command-line file player or the complete system audio policy layer; it provides Linux kernel audio architecture and user-space interfaces, while default routing, plugins, and higher-level audio services may still participate.",
            ja: "ALSA はファイルを再生するだけのコマンドラインツールでも、完全なシステム音声ポリシー層でもありません。Linux カーネルの音声アーキテクチャとユーザー空間インターフェースを提供し、既定ルーティング、プラグイン、上位の音声サービスが関与することもあります。",
            ko: "ALSA는 파일을 재생하는 명령줄 도구에 불과하지도 완전한 시스템 오디오 정책 계층도 아닙니다. Linux 커널 오디오 아키텍처와 사용자 공간 인터페이스를 제공하며 기본 라우팅, 플러그인과 상위 오디오 서비스가 여전히 참여할 수 있습니다."
          },
          contentDirection: {
            zh: "后续可继续补充 snd_pcm_* 状态机、asound.conf 路由、aplay -l / arecord -l 输出解读，以及 ASoC machine driver 与 DAPM 图。",
            en: "Further work could add the snd_pcm_* state machine, asound.conf routing, aplay -l / arecord -l output reading, and ASoC machine-driver and DAPM graphs.",
            ja: "今後は snd_pcm_* ステートマシン、asound.conf のルーティング、aplay -l / arecord -l の出力解釈、ASoC machine driver と DAPM のグラフを追加できます。",
            ko: "향후 snd_pcm_* 상태 머신, asound.conf 라우팅, aplay -l / arecord -l 출력 해석과 ASoC machine driver 및 DAPM 그래프를 추가할 수 있습니다."
          }
        }
      },
      {
        title: { zh: "实时音频处理", en: "Real-Time Audio Processing", ja: "リアルタイム音声処理", ko: "실시간 오디오 처리" },
        summary: {
          zh: "关注 buffer、延迟、回调线程、卡顿、爆音和丢帧。",
          en: "Focus on buffers, latency, callback threads, glitches, pops, and frame drops.",
          ja: "バッファー、遅延、コールバックスレッド、音切れ、ポップノイズ、フレーム落ちに注目します。",
          ko: "버퍼, 지연, 콜백 스레드, 끊김, 팝 노이즈와 프레임 드롭에 집중합니다."
        },
        bullets: [
          { zh: "Buffer size 与 latency", en: "Buffer size and latency", ja: "Buffer size と latency", ko: "Buffer size와 latency" },
          { zh: "实时线程与回调", en: "Real-time threads and callbacks", ja: "リアルタイムスレッドとコールバック", ko: "실시간 스레드와 콜백" },
          { zh: "卡顿、爆音、杂音排查", en: "Debugging glitches, pops, and noise", ja: "音切れ、ポップノイズ、ノイズの調査", ko: "끊김, 팝 노이즈와 잡음 문제 해결" }
        ],
        detail: {
          explanation: {
            zh: "实时音频处理要求每一小块音频都在截止时间前完成计算。只要回调线程被阻塞、CPU 峰值过高或 buffer 供给不连续，就可能出现卡顿、爆音、断续和延迟增加。",
            en: "Real-time audio processing requires each small audio block to be computed before its deadline. If the callback thread blocks, CPU spikes, or buffers are not supplied continuously, users may hear glitches, pops, dropouts, or increased latency.",
            ja: "リアルタイム音声処理では、各オーディオブロックを deadline までに計算し終える必要があります。コールバックがブロックしたり CPU 使用率が急上昇したり、バッファーが連続して供給されなかったりすると、音切れ、ポップノイズ、途切れ、遅延増加が起こります。",
            ko: "실시간 오디오 처리는 각 작은 오디오 블록의 계산을 deadline 전에 끝내야 합니다. 콜백 스레드가 블록되거나 CPU 피크가 높거나 버퍼가 연속으로 공급되지 않으면 끊김, 팝 노이즈, 드롭아웃과 지연 증가가 발생할 수 있습니다."
          },
          termExplanations: [
            {
              name: { zh: "Buffer size", en: "Buffer size", ja: "バッファーサイズ", ko: "버퍼 크기" },
              explanation: {
                zh: "先区分一次回调的处理块与整个 ring buffer 容量。48 kHz 下 128 帧处理块对应 2.67 ms，64 帧对应 1.33 ms；缩小处理块可减少块等待，但不会自动消除其他队列、算法前视和设备延迟。",
                en: "Distinguish a callback block from total ring-buffer capacity. At 48 kHz, a 128-frame block spans 2.67 ms and 64 frames span 1.33 ms. Smaller blocks reduce block waiting, not other queues, algorithmic lookahead, or device delay.",
                ja: "1回のコールバックの処理ブロックと、リングバッファー全体の容量を区別します。48 kHz では 128 フレームは 2.67 ms、64 フレームは 1.33 ms です。ブロックを小さくするとブロック待ちを減らせますが、他のキュー、アルゴリズムの先読み、デバイス遅延は自動的にはなくなりません。",
                ko: "한 번의 콜백 처리 블록과 전체 링 버퍼 용량을 구분해야 합니다. 48 kHz에서 128프레임 블록은 2.67 ms, 64프레임은 1.33 ms입니다. 블록을 줄이면 블록 대기는 줄지만 다른 큐, 알고리즘 룩어헤드와 장치 지연이 자동으로 없어지지는 않습니다."
              }
            },
            {
              name: { zh: "回调 deadline", en: "Callback deadline", ja: "コールバックのデッドライン", ko: "콜백 데드라인" },
              explanation: {
                zh: "块帧数 / 采样率给出稳态每块处理预算。实际截止时间还受队列水位和启动策略影响；一次超时未必立即 XRUN，但持续落后会耗尽余量，导致播放缺样本或采集丢样本。",
                en: "Block frames / sample rate gives a steady-state per-block budget. Actual deadlines also depend on queue occupancy and start policy. One late block need not cause an immediate XRUN, but sustained delay exhausts headroom and causes playback underruns or capture overruns.",
                ja: "ブロックのフレーム数 / サンプルレートが、定常状態での1ブロックあたりの予算を決めます。実際の deadline はキューの水位と開始ポリシーにも左右されます。1回遅れただけで直ちに XRUN になるとは限りませんが、遅れが続くと余裕を使い果たし、再生 underrun や収音 overrun を起こします。",
                ko: "블록 프레임 수 / 샘플레이트가 정상 상태에서 블록 하나의 처리 예산을 정합니다. 실제 deadline은 큐 점유량과 시작 정책에도 좌우됩니다. 한 블록이 늦었다고 즉시 XRUN이 발생하는 것은 아니지만 지연이 지속되면 여유가 소진되어 재생 underrun이나 캡처 overrun이 발생합니다."
              }
            },
            {
              name: { zh: "XRUN", en: "XRUN", ja: "XRUN", ko: "XRUN" },
              explanation: {
                zh: "XRUN 是 underrun 或 overrun 的统称。播放 underrun 表示输出端来不及拿到新数据，采集 overrun 表示输入端数据没有及时被取走，常见听感是爆音、断续或短暂静音。",
                en: "XRUN is a shared term for underrun or overrun. A playback underrun means the output side did not receive new data in time; a capture overrun means input data was not consumed in time. Users may hear pops, dropouts, or short silence.",
                ja: "XRUN は underrun または overrun の総称です。再生 underrun は出力側が時間内に新しいデータを受け取れない状態、収音 overrun は入力データを時間内に取り出せない状態で、ポップノイズ、途切れ、短い無音として聞こえることがあります。",
                ko: "XRUN은 underrun 또는 overrun을 통칭합니다. 재생 underrun은 출력 측이 제때 새 데이터를 받지 못하는 상태이고 캡처 overrun은 입력 데이터를 제때 소비하지 못하는 상태이며 팝 노이즈, 드롭아웃이나 짧은 무음으로 들릴 수 있습니다."
              }
            },
            {
              name: { zh: "实时安全操作", en: "Real-time safe operations", ja: "リアルタイム安全操作", ko: "실시간 안전 연산" },
              explanation: {
                zh: "实时回调中应只做可预测的计算，避免锁等待、磁盘 IO、网络请求、大量日志和运行期分配。耗时或不可预测任务应放到非实时线程，通过无锁队列或预分配 buffer 交换数据。",
                en: "A real-time callback should do predictable computation only, avoiding lock waits, disk IO, network requests, heavy logging, and runtime allocation. Slow or unpredictable work should move to non-real-time threads and exchange data through lock-free queues or preallocated buffers.",
                ja: "リアルタイムコールバックでは予測可能な計算だけを行い、ロック待ち、ディスク IO、ネットワーク要求、大量ログ、実行時のメモリ確保を避けます。時間のかかる処理や予測不能な処理は非リアルタイムスレッドへ移し、ロックフリーキューや事前確保したバッファーでデータを交換します。",
                ko: "실시간 콜백에서는 예측 가능한 계산만 수행하고 잠금 대기, 디스크 IO, 네트워크 요청, 과도한 로그와 런타임 할당을 피해야 합니다. 느리거나 예측할 수 없는 작업은 비실시간 스레드로 옮기고 lock-free 큐나 미리 할당한 버퍼로 데이터를 교환합니다."
              }
            }
          ],
          keyConcepts: [
            { zh: "Buffer 越小延迟越低，但留给处理的时间也越少。", en: "Smaller buffers reduce latency but leave less time for processing.", ja: "Buffer が小さいほど遅延は下がりますが、処理に使える時間も減ります。", ko: "Buffer가 작을수록 지연은 낮아지지만 처리에 사용할 시간도 줄어듭니다." },
            { zh: "实时回调中应避免阻塞 IO、锁竞争、动态内存分配和不可预测操作。", en: "Real-time callbacks should avoid blocking IO, lock contention, dynamic allocation, and unpredictable operations.", ja: "リアルタイムコールバックでは、ブロッキング IO、ロック競合、動的メモリ確保、予測不能な操作を避けます。", ko: "실시간 콜백에서는 블로킹 IO, 잠금 경쟁, 동적 메모리 할당과 예측 불가능한 작업을 피해야 합니다." },
            { zh: "XRUN、underrun、overrun 是定位播放或采集不连续的重要线索。", en: "XRUN, underrun, and overrun events are important clues for playback or capture discontinuity.", ja: "XRUN、underrun、overrun は再生や収音が不連続になる原因を絞る重要な手掛かりです。", ko: "XRUN, underrun과 overrun은 재생 또는 캡처가 불연속인 원인을 찾는 중요한 단서입니다." }
          ],
          lab: {
            type: "realtime-audio",
            title: { zh: "实时音频处理实验室", en: "Real-Time Audio Processing Lab", ja: "リアルタイム音声処理ラボ", ko: "실시간 오디오 처리 실험실" },
            description: {
              zh: "通过固定的 16 kHz 单声道实例，追踪采集、512 点处理块、MP3 攒帧、解码播放，以及 AEC 播放参考回采路径。",
              en: "Trace a fixed 16 kHz mono example through capture, 512-sample blocks, MP3 framing, decoded playback, and the AEC playback-reference path.",
              ja: "固定した 16 kHz モノラルの例で、収音、512 サンプルの処理ブロック、MP3 フレーム化、デコード再生、AEC の再生リファレンス経路を追跡します。",
              ko: "고정된 16 kHz 모노 예시에서 캡처, 512 샘플 처리 블록, MP3 프레이밍, 디코드 재생과 AEC 재생 참조 경로를 추적합니다."
            },
            buttonLabel: { zh: "打开实时音频处理实验室", en: "Open real-time audio processing lab", ja: "リアルタイム音声処理ラボを開く", ko: "실시간 오디오 처리 실험실 열기" }
          },
          misconception: {
            zh: "把 buffer 调到最小不一定最好；设备性能、系统调度、算法复杂度和稳定性需要一起平衡。",
            en: "The smallest buffer is not always best; device performance, scheduler behavior, algorithm cost, and stability must be balanced.",
            ja: "Buffer を最小にすればよいとは限りません。デバイス性能、スケジューラーの動作、アルゴリズムのコスト、安定性を一緒に調整する必要があります。",
            ko: "버퍼를 최소로 설정한다고 항상 좋은 것은 아닙니다. 장치 성능, 스케줄러 동작, 알고리즘 비용과 안정성을 함께 균형 잡아야 합니다."
          },
          contentDirection: {
            zh: "适合做实时回调时间线、不同 buffer 大小的延迟对比，以及卡顿问题排查清单。",
            en: "This fits a real-time callback timeline, latency comparisons for buffer sizes, and a glitch debugging checklist.",
            ja: "リアルタイムコールバックのタイムライン、Buffer サイズごとの遅延比較、音切れのデバッグチェックリストへ発展できます。",
            ko: "실시간 콜백 타임라인, 버퍼 크기별 지연 비교와 끊김 디버깅 체크리스트로 확장할 수 있습니다."
          }
        }
      },
      {
        title: { zh: "音频编解码", en: "Audio Codecs", ja: "音声 Codec", ko: "오디오 코덱" },
        summary: {
          zh: "比较无损、有损和蓝牙音频 Codec 的码率、延迟与稳定性。",
          en: "Compare lossless, lossy, and Bluetooth codecs by bitrate, latency, and stability.",
          ja: "ロスレス、非可逆、Bluetooth 音声 Codec をビットレート、遅延、安定性で比較します。",
          ko: "무손실, 손실과 Bluetooth 오디오 코덱을 비트레이트, 지연과 안정성으로 비교합니다."
        },
        bullets: [
          { zh: "MP3、AAC、Opus、LC3", en: "MP3, AAC, Opus, LC3", ja: "MP3、AAC、Opus、LC3", ko: "MP3, AAC, Opus, LC3" },
          { zh: "SBC、aptX、LDAC", en: "SBC, aptX, LDAC", ja: "SBC、aptX、LDAC", ko: "SBC, aptX, LDAC" },
          { zh: "编码延迟与码率", en: "Encoding latency and bitrate", ja: "エンコード遅延とビットレート", ko: "인코딩 지연과 비트레이트" }
        ],
        detail: {
          explanation: {
            zh: "这里的 Codec 指压缩编解码算法，不是前面硬件章节里的音频 Codec 芯片。它接收已经采样量化后的 PCM，把数据按帧切开，再通过无损预测、感知模型、语音模型或蓝牙传输约束进行压缩；播放或接收端再解码回 PCM 交给系统音频栈、DAC 或后续处理。",
            en: "Here codec means a compression algorithm, not the hardware audio codec chip discussed in the hardware section. It takes already sampled PCM, splits it into frames, compresses it with lossless prediction, perceptual models, speech models, or Bluetooth transport constraints, then decodes it back to PCM for the system audio stack, DAC, or later processing.",
            ja: "ここでいう Codec は圧縮用のコーデックアルゴリズムであり、ハードウェア章の音声 Codec チップではありません。サンプリングと量子化を済ませた PCM をフレームに分け、ロスレス予測、知覚モデル、音声モデル、Bluetooth 伝送の制約などで圧縮し、再生側や受信側で PCM にデコードしてシステム音声スタック、DAC、後段処理へ渡します。",
            ko: "여기서 Codec은 압축 코덱 알고리즘을 뜻하며 하드웨어 장에서 다룬 오디오 Codec 칩과는 다릅니다. 이미 샘플링·양자화된 PCM을 프레임으로 나눈 뒤 무손실 예측, 지각 모델, 음성 모델 또는 Bluetooth 전송 제약으로 압축하고 재생·수신 측에서 PCM으로 디코드해 시스템 오디오 스택, DAC 또는 후속 처리로 전달합니다."
          },
          keyConcepts: [
            { zh: "码率影响文件大小和压缩余量，但不同编码器在同码率下质量不同。", en: "Bitrate affects file size and compression headroom, but different codecs have different quality at the same bitrate.", ja: "ビットレートはファイルサイズと圧縮の余裕に影響しますが、同じビットレートでも Codec によって品質は異なります。", ko: "비트레이트는 파일 크기와 압축 여유에 영향을 주지만 같은 비트레이트에서도 코덱마다 품질이 다릅니다." },
            { zh: "帧长和算法复杂度会影响端到端延迟。", en: "Frame size and algorithmic complexity affect end-to-end latency.", ja: "フレーム長とアルゴリズムの複雑さがエンドツーエンド遅延に影響します。", ko: "프레임 길이와 알고리즘 복잡도가 엔드투엔드 지연에 영향을 줍니다." },
            { zh: "Opus、LC3 等更适合低延迟或通信场景，FLAC 更适合无损归档。", en: "Opus and LC3 are useful for low-latency or communication scenarios, while FLAC is better for lossless archiving.", ja: "Opus や LC3 は低遅延や通信シーンに適し、FLAC はロスレス保存に適しています。", ko: "Opus와 LC3는 저지연 또는 통신 시나리오에 적합하고 FLAC은 무손실 보관에 더 적합합니다." }
          ],
          termExplanations: [
            {
              name: { zh: "编码与解码", en: "Encoding and decoding", ja: "エンコードとデコード", ko: "인코딩과 디코딩" },
              explanation: {
                zh: "编码把 PCM 转成更小的码流或文件，解码把码流恢复成可播放的 PCM。压缩算法可能是无损的，也可能是有损的。",
                en: "Encoding turns PCM into a smaller bitstream or file; decoding reconstructs playable PCM. The compression may be lossless or lossy.",
                ja: "エンコードは PCM をより小さなビットストリームやファイルへ変換し、デコードはビットストリームから再生可能な PCM を再構成します。圧縮はロスレスの場合も非可逆の場合もあります。",
                ko: "인코딩은 PCM을 더 작은 비트스트림이나 파일로 바꾸고 디코딩은 비트스트림에서 재생 가능한 PCM을 복원합니다. 압축은 무손실일 수도 손실일 수도 있습니다."
              }
            },
            {
              name: { zh: "封装与码流", en: "Container and bitstream", ja: "コンテナーとビットストリーム", ko: "컨테이너와 비트스트림" },
              explanation: {
                zh: "码流是编码后的音频数据，封装则负责文件头、时间戳、索引和多轨信息。例如 AAC 码流可以放进 MP4/M4A 容器。",
                en: "A bitstream is encoded audio data, while a container carries headers, timestamps, indexes, and tracks. For example, AAC bitstreams can be stored in MP4/M4A containers.",
                ja: "ビットストリームはエンコード済みの音声データで、コンテナはヘッダー、タイムスタンプ、インデックス、トラックを保持します。たとえば AAC ビットストリームは MP4/M4A コンテナに格納できます。",
                ko: "비트스트림은 인코딩된 오디오 데이터이고 컨테이너는 헤더, 타임스탬프, 인덱스와 트랙을 담습니다. 예를 들어 AAC 비트스트림은 MP4/M4A 컨테이너에 저장할 수 있습니다."
              }
            },
            {
              name: { zh: "帧长与算法延迟", en: "Frame size and algorithmic delay", ja: "フレーム長とアルゴリズム遅延", ko: "프레임 길이와 알고리즘 지연" },
              explanation: {
                zh: "多数 Codec 需要攒够一帧音频后再分析和编码。帧越长，压缩效率可能更高，但实时通话和游戏互动的延迟也会增加。",
                en: "Most codecs collect a frame before analysis and encoding. Longer frames can improve compression efficiency, but increase delay for calls and interactive audio.",
                ja: "多くの Codec は1フレーム分の音声を集めてから分析とエンコードを行います。フレームが長いほど圧縮効率は上がる可能性がありますが、通話やインタラクティブ音声の遅延は増えます。",
                ko: "대부분의 코덱은 한 프레임의 오디오를 모은 뒤 분석하고 인코딩합니다. 프레임이 길면 압축 효율이 높아질 수 있지만 통화와 대화형 오디오의 지연도 증가합니다."
              }
            },
            {
              name: { zh: "蓝牙 Codec", en: "Bluetooth codec", ja: "Bluetooth Codec", ko: "Bluetooth Codec" },
              explanation: {
                zh: "蓝牙 Codec 还要受无线带宽、丢包、耳机芯片功耗和设备兼容性限制，所以码率高不一定始终稳定。",
                en: "Bluetooth codecs are also constrained by wireless bandwidth, packet loss, headset power, and compatibility, so a higher bitrate is not always stable.",
                ja: "Bluetooth Codec は無線帯域、パケット損失、ヘッドセットチップの消費電力、互換性にも制約されるため、ビットレートが高いほど常に安定するとは限りません。",
                ko: "Bluetooth 코덱은 무선 대역폭, 패킷 손실, 헤드셋 칩 전력과 호환성에도 제약을 받으므로 비트레이트가 높다고 항상 안정적인 것은 아닙니다."
              }
            }
          ],
          lab: {
            type: "audio-codec",
            title: { zh: "音频编解码实验室", en: "Audio Codec Lab", ja: "音声 Codec ラボ", ko: "오디오 코덱 실험실" },
            description: {
              zh: "进入独立界面查看 PCM 如何经过分帧、压缩、码流传输和解码，并按音乐、语音、会议、蓝牙和低延迟场景比较常见 Codec。",
              en: "Open an independent lab to see how PCM is framed, compressed, transmitted as a bitstream, and decoded, then compare common codecs for music, speech, conferencing, Bluetooth, and low-latency use.",
              ja: "独立したラボで PCM がフレーム化、圧縮、ビットストリーム伝送、デコードされる流れを確認し、音楽、音声、会議、Bluetooth、低遅延用途に向く代表的な Codec を比較します。",
              ko: "독립 실험실에서 PCM이 프레임화, 압축, 비트스트림 전송과 디코딩을 거치는 과정을 보고 음악, 음성, 회의, Bluetooth와 저지연 용도의 대표 코덱을 비교합니다."
            },
            buttonLabel: { zh: "打开音频编解码实验室", en: "Open audio codec lab", ja: "音声 Codec ラボを開く", ko: "오디오 코덱 실험실 열기" }
          },
          misconception: {
            zh: "相同码率不代表相同音质或相同延迟；编码器实现、内容类型和传输环境都会改变结果。",
            en: "The same bitrate does not mean the same quality or latency; encoder implementation, content type, and network conditions change the result.",
            ja: "同じビットレートでも同じ音質や遅延になるとは限りません。エンコーダーの実装、コンテンツの種類、伝送環境で結果は変わります。",
            ko: "같은 비트레이트가 같은 음질이나 지연을 뜻하지는 않습니다. 인코더 구현, 콘텐츠 유형과 전송 환경이 결과를 바꿉니다."
          },
          contentDirection: {
            zh: "适合做格式对比表、蓝牙 Codec 延迟路径图和不同码率试听素材说明。",
            en: "This can become a codec comparison table, Bluetooth latency path diagram, and listening guide for different bitrates.",
            ja: "形式比較表、Bluetooth Codec の遅延経路図、異なるビットレートの試聴素材ガイドへ発展できます。",
            ko: "형식 비교표, Bluetooth 코덱 지연 경로 도해와 비트레이트별 청취 자료 안내로 확장할 수 있습니다."
          }
        }
      }
    ]
  },
  {
    id: "dsp",
    icon: SlidersHorizontal,
    accent: "#7d6ab8",
    title: { zh: "传统算法", en: "Traditional DSP", ja: "従来型アルゴリズム", ko: "전통 DSP" },
    description: {
      zh: "用信号处理方法解释音频分析、增强和空间音频。",
      en: "Use signal processing methods to explain audio analysis, enhancement, and spatial audio.",
      ja: "信号処理の方法で、音声分析、強調、空間音声を説明します。",
      ko: "신호 처리 방법으로 오디오 분석, 향상과 공간 오디오를 설명합니다."
    },
    topics: [
      {
        title: { zh: "基础信号处理", en: "Core Signal Processing", ja: "コア信号処理", ko: "핵심 신호 처리" },
        summary: {
          zh: "理解 FFT / STFT、滤波器、EQ、动态范围压缩和限幅器。",
          en: "Understand FFT / STFT, filters, EQ, dynamic range compression, and limiters.",
          ja: "FFT / STFT、フィルター、EQ、ダイナミックレンジ圧縮、リミッターを理解します。",
          ko: "FFT / STFT, 필터, EQ, 다이내믹 레인지 압축과 리미터를 이해합니다."
        },
        bullets: [
          { zh: "FFT / STFT", en: "FFT / STFT", ja: "FFT / STFT", ko: "FFT / STFT" },
          { zh: "低通、高通、带通、陷波", en: "Low-pass, high-pass, band-pass, notch filters", ja: "ローパス、ハイパス、バンドパス、ノッチフィルター", ko: "로우패스, 하이패스, 밴드패스와 노치 필터" },
          { zh: "EQ、DRC、Limiter", en: "EQ, DRC, limiter", ja: "EQ、DRC、Limiter", ko: "EQ, DRC, 리미터" }
        ],
        detail: {
          explanation: {
            zh: "基础信号处理是传统 DSP 的基础入口：它把音频从时间域、频率域和能量变化三个角度分析，再用滤波、EQ、动态处理和变换域方法改变或提取声音特征。FFT/STFT 主要用于观察频谱和做分帧频域处理；滤波器和 EQ 改变不同频段的能量；压缩器和限幅器控制响度、瞬态和峰值。",
            en: "Core signal processing is the entry point for traditional DSP: it analyzes audio through time, frequency, and energy changes, then uses filtering, EQ, dynamics processing, and transform-domain methods to modify sound or extract features. FFT/STFT mainly reveal spectra and enable framed frequency-domain processing; filters and EQ reshape frequency energy; compressors and limiters control loudness, transients, and peaks.",
            ja: "コア信号処理は従来型 DSP の入口です。音声を時間、周波数、エネルギー変化の3つの観点で分析し、フィルター、EQ、ダイナミクス処理、変換領域の手法で音の特徴を変えたり抽出したりします。FFT/STFT は主にスペクトルの観察とフレーム単位の周波数領域処理に使い、フィルターと EQ は帯域ごとのエネルギーを整え、コンプレッサーとリミッターは音量、過渡、ピークを制御します。",
            ko: "핵심 신호 처리는 전통 DSP의 입구입니다. 오디오를 시간, 주파수와 에너지 변화의 관점에서 분석하고 필터, EQ, 다이내믹 처리와 변환 영역 기법으로 소리의 특징을 바꾸거나 추출합니다. FFT/STFT는 주로 스펙트럼을 관찰하고 프레임 단위 주파수 영역 처리를 수행하는 데 사용하며 필터와 EQ는 대역별 에너지를 조정하고 컴프레서와 리미터는 음량, 과도 응답과 피크를 제어합니다."
          },
          termExplanations: [
            {
              name: { zh: "时间域", en: "Time domain", ja: "時間領域", ko: "시간 영역" },
              explanation: {
                zh: "时间域直接看采样值随时间变化的波形，适合观察波形、周期、瞬态、包络、峰值、RMS 和是否削波。",
                en: "The time domain shows sample values changing over time. It is useful for inspecting waveform shape, cycles, transients, envelope, peak level, RMS, and clipping.",
                ja: "時間領域はサンプル値が時間とともに変化する波形を直接示します。波形形状、周期、過渡、エンベロープ、ピークレベル、RMS、クリップの観察に適しています。",
                ko: "시간 영역은 샘플 값이 시간에 따라 변하는 파형을 직접 보여 줍니다. 파형 모양, 주기, 과도 응답, 엔벌로프, 피크 레벨, RMS와 클리핑을 관찰하는 데 적합합니다."
              }
            },
            {
              name: { zh: "频率域", en: "Frequency domain", ja: "周波数領域", ko: "주파수 영역" },
              explanation: {
                zh: "频率域把声音拆成不同频率的能量分布。FFT 会受到窗口长度、采样率和点数影响，频率分辨率越高，通常时间定位越粗。",
                en: "The frequency domain decomposes sound into energy at different frequencies. FFT results depend on window length, sample rate, and point count; higher frequency resolution usually gives coarser time localization.",
                ja: "周波数領域は音を異なる周波数のエネルギー分布へ分解します。FFT の結果は窓長、サンプルレート、点数に左右され、周波数分解能を高くすると通常は時間位置の分解能が粗くなります。",
                ko: "주파수 영역은 소리를 서로 다른 주파수의 에너지 분포로 분해합니다. FFT 결과는 윈도 길이, 샘플레이트와 포인트 수에 좌우되며 주파수 해상도가 높을수록 일반적으로 시간 위치 해상도는 거칠어집니다."
              }
            },
            {
              name: { zh: "STFT 分帧", en: "STFT framing", ja: "STFT フレーミング", ko: "STFT 프레이밍" },
              explanation: {
                zh: "STFT 会把连续 PCM 切成短帧，每帧加窗后做 FFT。window size 和 hop size 决定时间分辨率、频率分辨率、延迟和计算量。",
                en: "STFT cuts continuous PCM into short frames, applies a window, then runs FFT per frame. Window size and hop size determine time resolution, frequency resolution, latency, and compute cost.",
                ja: "STFT は連続 PCM を短いフレームに分け、各フレームへ窓を掛けて FFT を行います。window size と hop size が時間分解能、周波数分解能、遅延、計算量を決めます。",
                ko: "STFT는 연속 PCM을 짧은 프레임으로 나누고 각 프레임에 윈도를 적용한 뒤 FFT를 수행합니다. window size와 hop size가 시간 해상도, 주파수 해상도, 지연과 계산량을 결정합니다."
              }
            },
            {
              name: { zh: "滤波器", en: "Filters", ja: "フィルター", ko: "필터" },
              explanation: {
                zh: "滤波器按频率选择保留或衰减声音，可做低通、高通、带通和陷波。FIR 和 IIR 的计算方式、相位、延迟和稳定性特征不同。",
                en: "Filters keep or attenuate sound by frequency, such as low-pass, high-pass, band-pass, and notch. FIR and IIR differ in computation, phase behavior, delay, and stability.",
                ja: "フィルターは周波数ごとに音を通過または減衰させ、ローパス、ハイパス、バンドパス、ノッチなどを実現します。FIR と IIR は計算方法、位相特性、遅延、安定性が異なります。",
                ko: "필터는 주파수에 따라 소리를 통과시키거나 감쇠하며 로우패스, 하이패스, 밴드패스와 노치 등을 만들 수 있습니다. FIR과 IIR은 계산 방식, 위상 특성, 지연과 안정성이 다릅니다."
              }
            },
            {
              name: { zh: "参数 EQ", en: "Parametric EQ", ja: "パラメトリック EQ", ko: "파라메트릭 EQ" },
              explanation: {
                zh: "参数 EQ 本质上是一组可调滤波器。常见参数是 gain、frequency、Q，用来提升或削减某个中心频率附近的能量。",
                en: "Parametric EQ is essentially a set of adjustable filters. Common parameters are gain, frequency, and Q, used to boost or cut energy around a center frequency.",
                ja: "パラメトリック EQ は本質的に調整可能なフィルターの集合です。gain、frequency、Q を使って中心周波数付近のエネルギーを増減します。",
                ko: "파라메트릭 EQ는 본질적으로 조절 가능한 필터 묶음입니다. gain, frequency와 Q를 사용해 중심 주파수 주변의 에너지를 높이거나 줄입니다."
              }
            },
            {
              name: { zh: "动态处理", en: "Dynamics processing", ja: "ダイナミクス処理", ko: "다이내믹 처리" },
              explanation: {
                zh: "动态处理根据电平变化改变增益。压缩器和限幅器常用 threshold、ratio、attack、release、knee 控制响度、瞬态和峰值。",
                en: "Dynamics processing changes gain according to signal level. Compressors and limiters use threshold, ratio, attack, release, and knee to control loudness, transients, and peaks.",
                ja: "ダイナミクス処理は信号レベルに応じてゲインを変えます。コンプレッサーとリミッターは threshold、ratio、attack、release、knee を使って音量、過渡、ピークを制御します。",
                ko: "다이내믹 처리는 신호 레벨에 따라 게인을 바꿉니다. 컴프레서와 리미터는 threshold, ratio, attack, release와 knee를 사용해 음량, 과도 응답과 피크를 제어합니다."
              }
            }
          ],
          keyConcepts: [
            { zh: "基础 DSP 链路常见为：输入 PCM -> 分帧/加窗 -> FFT/STFT 分析 -> 频域处理或特征计算 -> IFFT/重叠相加 -> 输出 PCM。", en: "A common basic DSP chain is: input PCM -> framing/windowing -> FFT/STFT analysis -> frequency-domain processing or feature extraction -> IFFT/overlap-add -> output PCM.", ja: "基本的な DSP 経路は、入力 PCM -> フレーム化／窓掛け -> FFT/STFT 分析 -> 周波数領域処理または特徴計算 -> IFFT／オーバーラップ加算 -> 出力 PCM です。", ko: "일반적인 기본 DSP 경로는 입력 PCM -> 프레이밍/윈도 적용 -> FFT/STFT 분석 -> 주파수 영역 처리 또는 특징 계산 -> IFFT/오버랩 추가 -> 출력 PCM입니다." },
            { zh: "窗口长度影响时间分辨率和频率分辨率，是 STFT 的核心取舍；hop size 还会影响延迟、平滑程度和计算量。", en: "Window length trades time resolution against frequency resolution, which is central to STFT; hop size also affects latency, smoothing, and compute cost.", ja: "窓長は時間分解能と周波数分解能のトレードオフを決める STFT の核心要素です。hop size は遅延、平滑さ、計算量にも影響します。", ko: "윈도 길이는 시간 해상도와 주파수 해상도의 절충을 정하는 STFT의 핵심 요소이며 hop size는 지연, 평활도와 계산량에도 영향을 줍니다." },
            { zh: "滤波器的截止频率、斜率、Q 值决定频率响应形状；线性相位、最小相位和 IIR/FIR 选择会影响延迟和瞬态。", en: "Filter cutoff frequency, slope, and Q determine the response shape; linear-phase, minimum-phase, and IIR/FIR choices affect delay and transients.", ja: "フィルターのカットオフ周波数、傾き、Q が周波数応答の形を決め、リニアフェーズ、最小位相、IIR/FIR の選択が遅延と過渡特性に影響します。", ko: "필터의 차단 주파수, 기울기와 Q가 주파수 응답 모양을 결정하며 선형 위상, 최소 위상과 IIR/FIR 선택이 지연과 과도 응답에 영향을 줍니다." },
            { zh: "EQ 是面向听感的滤波器组合，适合修正频段能量；动态处理器则根据电平包络改变增益，适合控制响度和峰值。", en: "EQ is a listener-facing filter set for reshaping band energy; dynamics processors change gain based on level envelope to control loudness and peaks.", ja: "EQ は聴感のために帯域エネルギーを整えるフィルター群で、ダイナミクスプロセッサーはレベルエンベロープに応じてゲインを変え、音量とピークを制御します。", ko: "EQ는 청감에 맞춰 대역 에너지를 조정하는 필터 묶음이고 다이내믹 프로세서는 레벨 엔벌로프에 따라 게인을 바꿔 음량과 피크를 제어합니다." },
            { zh: "传统 DSP 常以帧为单位工作，因此算法效果、实时延迟和 CPU 占用必须一起考虑。", en: "Traditional DSP often works frame by frame, so algorithm effect, real-time latency, and CPU load must be considered together.", ja: "従来型 DSP はフレーム単位で動くことが多いため、アルゴリズムの効果、リアルタイム遅延、CPU 負荷を同時に考える必要があります。", ko: "전통 DSP는 프레임 단위로 동작하는 경우가 많으므로 알고리즘 효과, 실시간 지연과 CPU 사용량을 함께 고려해야 합니다." }
          ],
          lab: {
            type: "core-signal-processing",
            title: { zh: "基础信号处理实验室", en: "Core Signal Processing Lab", ja: "コア信号処理ラボ", ko: "핵심 신호 처리 실험실" },
            description: {
              zh: "进入独立界面切换 STFT、滤波器/EQ 和动态处理视图，调节窗口、hop size、截止频率、Q、EQ 增益、阈值和 ratio，观察图形和关键指标如何变化。",
              en: "Open an independent lab to switch between STFT, filter/EQ, and dynamics views, then adjust window, hop size, cutoff, Q, EQ gain, threshold, and ratio to see diagrams and metrics change.",
              ja: "独立したラボで STFT、フィルター／EQ、ダイナミクスの表示を切り替え、窓、hop size、カットオフ、Q、EQ ゲイン、しきい値、ratio を調整して図と指標の変化を確認します。",
              ko: "독립 실험실에서 STFT, 필터/EQ와 다이내믹 보기를 전환하고 윈도, hop size, 차단 주파수, Q, EQ 게인, 임계값과 ratio를 조절해 도해와 지표 변화를 관찰합니다."
            },
            buttonLabel: { zh: "打开基础信号处理实验室", en: "Open core signal processing lab", ja: "コア信号処理ラボを開く", ko: "핵심 신호 처리 실험실 열기" }
          },
          misconception: {
            zh: "FFT 只是分析工具，不会自动让声音变好；真正改变声音还需要滤波、增益、重建或其他处理策略。压缩器不是 MP3/AAC 这类编码压缩，动态压缩改变的是电平范围；滤波器也不只是改变响度，还可能引入相位变化、延迟、振铃或削波后的失真。",
            en: "FFT is an analysis tool and does not improve sound by itself; changing sound requires filtering, gain changes, reconstruction, or another processing strategy. A compressor is not MP3/AAC-style codec compression; dynamics compression changes level range. Filters also do more than change loudness: they can introduce phase shift, delay, ringing, or distortion after clipping.",
            ja: "FFT は分析ツールにすぎず、それだけで音を良くするものではありません。音を変えるにはフィルタリング、ゲイン変更、再構成などの処理が必要です。コンプレッサーは MP3/AAC のような Codec 圧縮ではなく、ダイナミクス圧縮はレベル範囲を変えます。フィルターも音量だけでなく、位相変化、遅延、リンギング、クリップ後の歪みを生じさせることがあります。",
            ko: "FFT는 분석 도구일 뿐 그것만으로 소리를 개선하지는 않습니다. 소리를 바꾸려면 필터링, 게인 변경, 재구성 또는 다른 처리 전략이 필요합니다. 컴프레서는 MP3/AAC 방식의 코덱 압축이 아니며 다이내믹 압축은 레벨 범위를 바꿉니다. 필터도 음량만 바꾸는 것이 아니라 위상 변화, 지연, 링잉이나 클리핑 후 왜곡을 만들 수 있습니다."
          },
          contentDirection: {
            zh: "适合继续做三个交互方向：频谱瀑布图解释 FFT/STFT，滤波器响应图调节 cutoff/Q/gain，压缩器前后对比展示 threshold、ratio、attack、release 对响度和瞬态的影响。",
            en: "Good next interactive directions are: a spectrogram view for FFT/STFT, a filter-response control for cutoff/Q/gain, and a compressor before-after comparison showing how threshold, ratio, attack, and release affect loudness and transients.",
            ja: "次のインタラクティブな方向として、FFT/STFT を説明するスペクトログラム、cutoff/Q/gain を調整するフィルター応答図、threshold、ratio、attack、release が音量と過渡に与える影響を示すコンプレッサー前後比較が考えられます。",
            ko: "다음 인터랙티브 방향으로 FFT/STFT를 설명하는 스펙트로그램, cutoff/Q/gain을 조절하는 필터 응답 보기, threshold, ratio, attack과 release가 음량과 과도 응답에 미치는 영향을 보여 주는 컴프레서 전후 비교를 만들 수 있습니다."
          }
        }
      },
      {
        title: { zh: "语音增强", en: "Speech Enhancement", ja: "音声強調", ko: "음성 향상" },
        summary: {
          zh: "覆盖降噪、回声消除、自动增益、波束成形和去混响。",
          en: "Cover noise suppression, echo cancellation, AGC, beamforming, and dereverberation.",
          ja: "ノイズ抑制、エコーキャンセル、AGC、ビームフォーミング、残響除去を扱います。",
          ko: "잡음 억제, 에코 제거, AGC, 빔포밍과 잔향 제거를 다룹니다."
        },
        bullets: [
          { zh: "Noise Suppression", en: "Noise suppression", ja: "Noise Suppression", ko: "Noise Suppression" },
          { zh: "AEC、AGC", en: "AEC, AGC", ja: "AEC、AGC", ko: "AEC, AGC" },
          { zh: "Beamforming 与 Dereverberation", en: "Beamforming and dereverberation", ja: "Beamforming と Dereverberation", ko: "Beamforming과 Dereverberation" }
        ],
        detail: {
          explanation: {
            zh: "语音增强的目标是在真实设备和复杂环境中，让近端人声更清楚、更稳定，同时尽量降低回声、噪声、混响和响度波动。工程上它通常不是一个单独算法，而是一条低延迟 PCM 处理链：从麦克风 AI 采集开始，多麦场景先做波束成形，再结合播放回采参考做 AEC，后面接 NS/ANR、去混响、AGC 和 EQ，最后送往 AENC 编码、ASR 唤醒识别或本地录音。瑞芯微、SigmaStar、君正等 SoC SDK 名称不同，但常见模块边界类似：AI/AO 负责音频输入输出，AENC/ADEC 负责编解码，VQE/3A/Audio Process 负责 AEC、NS、AGC 等语音增强。",
            en: "Speech enhancement makes near-end speech clearer and steadier on real devices while reducing echo, noise, reverberation, and level swings. In engineering it is usually not one algorithm but a low-latency PCM processing chain: AI capture from microphones, beamforming first in multi-mic systems, AEC using playback reference, then NS/ANR, dereverberation, AGC, and EQ before AENC encoding, ASR wake/recognition, or local recording. Rockchip, SigmaStar, Ingenic, and similar SoC SDKs use different names, but the boundaries are similar: AI/AO for audio input/output, AENC/ADEC for codecs, and VQE/3A/Audio Process for AEC, NS, AGC, and voice enhancement.",
            ja: "音声強調の目的は、実機と複雑な環境で近端話者の声をより明瞭かつ安定させながら、エコー、ノイズ、残響、レベル変動を抑えることです。実装では単一アルゴリズムではなく、低遅延 PCM 処理チェーンになることが多く、マイクから AI 収音を始め、マルチマイクではまずビームフォーミングを行い、再生リファレンスを使う AEC、NS/ANR、残響除去、AGC、EQ を続け、最後に AENC エンコード、ASR のウェイク／認識、ローカル録音へ送ります。Rockchip、SigmaStar、Ingenic などの SoC SDK は名称が異なりますが、AI/AO は入出力、AENC/ADEC は Codec、VQE/3A/Audio Process は AEC、NS、AGC などの音声強調を担当するという境界は似ています。",
            ko: "음성 향상의 목표는 실제 장치와 복잡한 환경에서 근단 화자의 음성을 더 선명하고 안정적으로 만들면서 에코, 잡음, 잔향과 레벨 변동을 줄이는 것입니다. 구현에서는 하나의 알고리즘이 아니라 저지연 PCM 처리 체인인 경우가 많습니다. 마이크 AI 캡처로 시작해 다중 마이크에서는 먼저 빔포밍을 수행하고 재생 참조를 이용한 AEC, NS/ANR, 잔향 제거, AGC와 EQ를 거친 뒤 AENC 인코딩, ASR 웨이크/인식 또는 로컬 녹음으로 보냅니다. Rockchip, SigmaStar, Ingenic 같은 SoC SDK는 이름이 다르지만 AI/AO는 오디오 입출력, AENC/ADEC는 코덱, VQE/3A/Audio Process는 AEC, NS, AGC 같은 음성 향상을 담당한다는 경계는 비슷합니다."
          },
          termExplanations: [
            {
              name: { zh: "AEC 回声消除", en: "AEC echo cancellation", ja: "AEC エコーキャンセル", ko: "AEC 에코 제거" },
              explanation: {
                zh: "AEC 需要两路信号：麦克风输入和播放回采参考。算法先做时间对齐，再用自适应滤波器估计扬声器声音经过功放、腔体、空气和房间后的回声路径，生成预测回声后从麦克风信号中相减。难点在于双讲、延迟漂移和非线性失真。",
                en: "AEC needs two signals: microphone input and playback reference. It time-aligns them, uses an adaptive filter to estimate the echo path through the amplifier, enclosure, air, and room, then subtracts the predicted echo from the mic signal. Double-talk, delay drift, and nonlinear distortion are the hard parts.",
                ja: "AEC にはマイク入力と再生リファレンスの2つの信号が必要です。時間をそろえ、自適応フィルターでアンプ、筐体、空気、部屋を通るエコー経路を推定し、予測エコーをマイク信号から差し引きます。難所はダブルトーク、遅延ドリフト、非線形歪みです。",
                ko: "AEC에는 마이크 입력과 재생 참조라는 두 신호가 필요합니다. 시간을 맞춘 뒤 적응형 필터로 앰프, 인클로저, 공기와 공간을 거치는 에코 경로를 추정하고 예측 에코를 마이크 신호에서 뺍니다. 더블 토크, 지연 드리프트와 비선형 왜곡이 어려운 부분입니다."
              }
            },
            {
              name: { zh: "NS / ANR 降噪", en: "NS / ANR noise suppression", ja: "NS / ANR ノイズ抑制", ko: "NS / ANR 잡음 억제" },
              explanation: {
                zh: "NS 或 ANR 通常按短帧分析频谱或滤波器组，估计每个频段里噪声和语音的占比，再降低噪声占比高的频段增益。它常用于风扇、空调、车噪和底噪，但强度太大会损伤辅音和高频细节，产生金属音、抽吸声或吞字。",
                en: "NS or ANR usually analyzes short-frame spectra or filter banks, estimates how much speech and noise exist in each band, then lowers gain in noise-dominant bands. It helps with fans, HVAC, car noise, and hiss, but aggressive settings can damage consonants and high-frequency detail, causing metallic sound, pumping, or clipped words.",
                ja: "NS や ANR は通常、短フレームのスペクトルまたはフィルターバンクを分析し、各帯域の音声とノイズの割合を推定して、ノイズが多い帯域のゲインを下げます。ファン、空調、車内ノイズ、ヒスに有効ですが、強すぎる設定は子音や高域の細部を損ない、金属的な音、ポンピング、語尾の欠落を生じます。",
                ko: "NS 또는 ANR은 보통 짧은 프레임의 스펙트럼이나 필터 뱅크를 분석해 각 대역의 음성과 잡음 비율을 추정한 뒤 잡음이 우세한 대역의 게인을 낮춥니다. 팬, 공조기, 차량 소음과 히스에 유용하지만 설정이 강하면 자음과 고주파 세부를 손상해 금속성 소리, 펌핑이나 단어 잘림이 생깁니다."
              }
            },
            {
              name: { zh: "AGC 自动增益", en: "AGC automatic gain control", ja: "AGC 自動ゲイン制御", ko: "AGC 자동 이득 제어" },
              explanation: {
                zh: "AGC 先估计短时 RMS、峰值或语音包络，再用 attack/release 控制增益变化速度，把过小的语音拉高、过大的语音压住。它通常要配合 limiter，避免增益过高导致数字削波；好的 AGC 不应该让波形整体上下平移，而是改变包络和峰值。",
                en: "AGC estimates short-term RMS, peaks, or speech envelope, then uses attack/release timing to control gain, raising quiet speech and holding back loud speech. It is often paired with a limiter to avoid digital clipping; a good AGC changes envelope and peaks rather than shifting the waveform up or down.",
                ja: "AGC は短時間 RMS、ピーク、音声エンベロープを推定し、attack/release の時間設定でゲイン変化を制御します。小さい音声を持ち上げ、大きい音声を抑えます。デジタルクリップを避けるためリミッターと併用することが多く、良い AGC は波形全体を上下に移動させるのではなく、エンベロープとピークを変えます。",
                ko: "AGC는 단시간 RMS, 피크 또는 음성 엔벌로프를 추정한 뒤 attack/release 시간으로 게인 변화 속도를 제어해 작은 음성은 높이고 큰 음성은 억제합니다. 디지털 클리핑을 피하려고 리미터와 함께 사용하는 경우가 많으며 좋은 AGC는 파형 전체를 위아래로 옮기기보다 엔벌로프와 피크를 바꿉니다."
              }
            },
            {
              name: { zh: "多麦波束成形", en: "Multi-mic beamforming", ja: "マルチマイクビームフォーミング", ko: "다중 마이크 빔포밍" },
              explanation: {
                zh: "多麦阵列利用不同麦克风的到达时间差和相位差，增强目标方向的人声，压低旁边或后方的干扰声。它要求多路麦克风同步采集和稳定的阵列结构。",
                en: "A microphone array uses arrival-time and phase differences to enhance speech from a target direction while reducing side or rear interference. It needs synchronized mic capture and stable array geometry.",
                ja: "マイクアレイはマイクごとの到達時間差と位相差を利用し、目標方向の音声を強めながら側面や後方の干渉音を抑えます。同期したマイク収音と安定したアレイ配置が必要です。",
                ko: "마이크 어레이는 마이크별 도달 시간 차와 위상 차를 이용해 목표 방향의 음성을 강화하고 측면이나 후방 간섭을 줄입니다. 동기화된 마이크 캡처와 안정적인 어레이 구조가 필요합니다."
              }
            },
            {
              name: { zh: "去混响 Dereverb", en: "Dereverberation", ja: "残響除去（Dereverb）", ko: "잔향 제거(Dereverb)" },
              explanation: {
                zh: "去混响试图减弱房间后期反射造成的持续拖尾，让语音更近、更清楚。工程上可能结合多麦空间信息、线性预测或频域衰减，判断哪些能量是拖尾再降低它。它通常和波束成形、AEC、NS 配合使用，但过强会把自然共鸣和尾音也削掉。",
                en: "Dereverberation reduces late room-reflection tails so speech sounds closer and clearer. Engineering methods may combine array cues, linear prediction, or frequency-domain attenuation to identify and reduce sustained tails. It is often combined with beamforming, AEC, and NS, but strong processing can remove natural resonance and word endings.",
                ja: "残響除去は、部屋の後期反射による持続的な尾を弱め、音声を近く明瞭に聞かせます。実装ではアレイの空間情報、線形予測、周波数領域の減衰を組み合わせ、尾のエネルギーを特定して抑えます。ビームフォーミング、AEC、NS と併用されますが、強すぎる処理は自然な共鳴や語尾まで削ります。",
                ko: "잔향 제거는 공간의 후기 반사로 생기는 지속적인 꼬리를 줄여 음성을 더 가깝고 선명하게 만듭니다. 구현에서는 어레이 공간 정보, 선형 예측 또는 주파수 영역 감쇠를 조합해 잔향 에너지를 식별하고 줄입니다. 빔포밍, AEC, NS와 함께 사용하지만 처리가 과하면 자연스러운 공명과 단어 끝소리까지 제거할 수 있습니다."
              }
            }
          ],
          keyConcepts: [
            { zh: "典型采集链路是：Mic / PDM / I2S -> AI 驱动环形 buffer -> PCM 帧 -> VQE/3A -> AENC/ASR/录音。算法多数按 10 ms、16 ms 或 20 ms 帧处理，帧长会影响延迟和效果。", en: "A typical capture path is: Mic / PDM / I2S -> AI driver ring buffer -> PCM frames -> VQE/3A -> AENC/ASR/recording. Most algorithms process 10 ms, 16 ms, or 20 ms frames, and frame size affects latency and quality.", ja: "代表的な収音経路は Mic / PDM / I2S -> AI ドライバーのリングバッファー -> PCM フレーム -> VQE/3A -> AENC/ASR/録音です。多くのアルゴリズムは 10 ms、16 ms、20 ms のフレームで処理し、フレーム長が遅延と品質に影響します。", ko: "일반적인 캡처 경로는 Mic / PDM / I2S -> AI 드라이버 링 버퍼 -> PCM 프레임 -> VQE/3A -> AENC/ASR/녹음입니다. 대부분의 알고리즘은 10 ms, 16 ms 또는 20 ms 프레임으로 처리하며 프레임 길이가 지연과 품질에 영향을 줍니다." },
            { zh: "AEC 需要播放侧 AO/Mixer 的 reference buffer。没有正确的回采参考、时间戳或延迟估计，AEC 很难稳定消除回声。", en: "AEC needs a playback reference buffer from AO/Mixer. Without correct reference, timestamps, or delay estimation, echo cancellation is difficult to stabilize.", ja: "AEC には再生側 AO/Mixer の reference buffer が必要です。正しい回采リファレンス、タイムスタンプ、遅延推定がなければ、エコーを安定して消すのは困難です。", ko: "AEC에는 재생 측 AO/Mixer의 reference buffer가 필요합니다. 올바른 회수 참조, 타임스탬프나 지연 추정이 없으면 AEC가 에코를 안정적으로 제거하기 어렵습니다." },
            { zh: "常见顺序不是绝对固定，但本实验室按一条典型链路组织：高通/去直流 -> 波束成形/DOA（多麦）-> AEC -> NS/ANR -> 去混响 -> AGC/Limiter -> 编码或识别。", en: "The order is not universal, but this lab uses one typical chain: high-pass/DC removal -> beamforming/DOA for multi-mic capture -> AEC -> NS/ANR -> dereverberation -> AGC/limiter -> encoding or recognition.", ja: "順序は一意ではありませんが、このラボでは典型例として、ハイパス／DC 除去 -> ビームフォーミング／DOA（マルチマイク）-> AEC -> NS/ANR -> 残響除去 -> AGC/リミッター -> エンコードまたは認識で構成します。", ko: "순서는 고정되지 않지만 이 실험실은 대표적인 경로로 하이패스/DC 제거 -> 빔포밍/DOA(다중 마이크) -> AEC -> NS/ANR -> 잔향 제거 -> AGC/리미터 -> 인코딩 또는 인식 순서를 사용합니다." },
            { zh: "单麦没有空间到达时间差，不能做真正的多麦波束成形；2 Mic 或 4 Mic 阵列才有空间抑制和目标方向增强的基础。", en: "A single microphone has no spatial arrival-time differences, so true beamforming requires a 2-mic or 4-mic array.", ja: "単一マイクには空間的な到達時間差がないため、本当のマルチマイク・ビームフォーミングには 2 Mic または 4 Mic のアレイが必要です。", ko: "단일 마이크에는 공간적인 도달 시간 차가 없으므로 진정한 다중 마이크 빔포밍에는 2 Mic 또는 4 Mic 어레이가 필요합니다." },
            { zh: "SDK 名称会变化：瑞芯微常见 AI/AO/AENC/ADEC/VQE，SigmaStar 常见 AI/AO/AENC/ADEC/Audio Process，君正常见 IMP Audio + AGC/NS/AEC 接口；理解边界比记名字更重要。", en: "SDK names vary: Rockchip commonly uses AI/AO/AENC/ADEC/VQE, SigmaStar often uses AI/AO/AENC/ADEC/Audio Process, and Ingenic uses IMP Audio plus AGC/NS/AEC APIs. Understanding boundaries matters more than memorizing names.", ja: "SDK の名称は異なります。Rockchip は AI/AO/AENC/ADEC/VQE、SigmaStar は AI/AO/AENC/ADEC/Audio Process、Ingenic は IMP Audio と AGC/NS/AEC API を使うことがよくあります。名前を暗記するより境界を理解することが重要です。", ko: "SDK 이름은 달라집니다. Rockchip은 AI/AO/AENC/ADEC/VQE, SigmaStar는 AI/AO/AENC/ADEC/Audio Process, Ingenic은 IMP Audio와 AGC/NS/AEC API를 흔히 사용합니다. 이름을 외우는 것보다 경계를 이해하는 것이 중요합니다." },
            { zh: "语音增强不是越强越好。降噪、AEC、AGC、波束成形都需要在清晰度、自然度、双讲、延迟、CPU 占用和功耗之间取舍。", en: "Speech enhancement is not better just because it is stronger. NS, AEC, AGC, and beamforming trade off clarity, naturalness, double-talk, latency, CPU use, and power.", ja: "音声強調は強いほど良いわけではありません。NS、AEC、AGC、ビームフォーミングは、明瞭さ、自然さ、ダブルトーク、遅延、CPU 使用率、消費電力の間でトレードオフがあります。", ko: "음성 향상은 강할수록 좋은 것이 아닙니다. NS, AEC, AGC와 빔포밍은 명료도, 자연스러움, 더블 토크, 지연, CPU 사용량과 전력 사이의 절충이 필요합니다." }
          ],
          lab: {
            type: "speech-enhancement",
            title: { zh: "语音增强实验室", en: "Speech Enhancement Lab", ja: "音声強調ラボ", ko: "음성 향상 실험실" },
            description: {
              zh: "进入独立界面查看 AI/AO/AENC/VQE/3A 风格的采集与回采链路，按流程顺序切换波束成形、AEC、NS/ANR、去混响和 AGC，观察波形与指标如何变化。",
              en: "Open an independent lab to inspect AI/AO/AENC/VQE/3A-style capture and reference paths, switch beamforming, AEC, NS/ANR, dereverberation, and AGC in flow order, and compare waveform and metrics.",
              ja: "独立したラボで AI/AO/AENC/VQE/3A 型の収音と回采リファレンス経路を確認し、ビームフォーミング、AEC、NS/ANR、残響除去、AGC を処理順に切り替えて波形と指標を比較します。",
              ko: "독립 실험실에서 AI/AO/AENC/VQE/3A 방식의 캡처와 참조 경로를 확인하고 빔포밍, AEC, NS/ANR, 잔향 제거와 AGC를 흐름 순서로 전환해 파형과 지표를 비교합니다."
            },
            buttonLabel: { zh: "打开语音增强实验室", en: "Open speech enhancement lab", ja: "音声強調ラボを開く", ko: "음성 향상 실험실 열기" }
          },
          misconception: {
            zh: "语音增强不能无损移除所有噪声，也不能靠单个参数解决所有问题。回声大可能是 reference 路径或延迟不准，噪声残留可能是噪声估计和语音保护的取舍，声音忽大忽小可能是 AGC 和 limiter 设置不合理。",
            en: "Speech enhancement cannot remove all noise losslessly, and one parameter will not fix everything. Echo may come from wrong reference or delay, residual noise may be a tradeoff in noise estimation and speech protection, and unstable loudness may come from AGC/limiter settings.",
            ja: "音声強調ですべてのノイズを無損失に除去できるわけでも、1つのパラメーターですべてを解決できるわけでもありません。大きなエコーは誤ったリファレンス経路や遅延、残留ノイズはノイズ推定と音声保護のトレードオフ、音量の不安定さは AGC／リミッター設定が原因かもしれません。",
            ko: "음성 향상으로 모든 잡음을 무손실 제거할 수도 없고 하나의 파라미터로 모든 문제를 해결할 수도 없습니다. 큰 에코는 잘못된 참조 경로나 지연, 남은 잡음은 잡음 추정과 음성 보호의 절충, 불안정한 음량은 AGC/리미터 설정 때문일 수 있습니다."
          },
          contentDirection: {
            zh: "后续可以继续做独立语音增强实验室：切换单麦/双麦/四麦，调节噪声、回声、混响和说话距离，展示 AEC、NS、AGC、波束成形前后的波形、频谱和听感差异。",
            en: "A later standalone lab could switch among one-, two-, and four-mic setups, adjust noise, echo, reverberation, and speaker distance, and compare waveforms, spectra, and listening results before and after AEC, NS, AGC, and beamforming.",
            ja: "今後は単一、2マイク、4マイクの構成を切り替え、ノイズ、エコー、残響、話者距離を調整し、AEC、NS、AGC、ビームフォーミング前後の波形、スペクトル、聴感を比較する独立ラボへ発展できます。",
            ko: "향후 단일, 2마이크와 4마이크 구성을 전환하고 잡음, 에코, 잔향과 화자 거리를 조절해 AEC, NS, AGC와 빔포밍 전후의 파형, 스펙트럼과 청감을 비교하는 독립 실험실로 확장할 수 있습니다."
          }
        }
      },
      {
        title: { zh: "空间音频", en: "Spatial Audio", ja: "空間音声", ko: "공간 오디오" },
        summary: {
          zh: "解释双耳渲染、HRTF、环绕声、3D Audio 和头部追踪。",
          en: "Explain binaural rendering, HRTF, surround sound, 3D audio, and head tracking.",
          ja: "バイノーラルレンダリング、HRTF、サラウンド、3D Audio、ヘッドトラッキングを説明します。",
          ko: "바이노럴 렌더링, HRTF, 서라운드 사운드, 3D Audio와 헤드 트래킹을 설명합니다."
        },
        bullets: [
          { zh: "ITD / ILD / HRTF", en: "ITD / ILD / HRTF", ja: "ITD / ILD / HRTF", ko: "ITD / ILD / HRTF" },
          { zh: "双耳渲染、Ambisonics", en: "Binaural rendering, Ambisonics", ja: "バイノーラルレンダリング、Ambisonics", ko: "바이노럴 렌더링, Ambisonics" },
          { zh: "对象音频与头部追踪", en: "Object audio and head tracking", ja: "オブジェクト音声とヘッドトラッキング", ko: "오브젝트 오디오와 헤드 트래킹" }
        ],
        detail: {
          explanation: {
            zh: "空间音频不是单一格式，而是一套从内容制作、空间编码、渲染到播放设备的完整链路。它利用左右耳到达时间差、声级差、耳廓滤波、房间反射、距离衰减和头部运动线索，让听众觉得声音来自前后、上下、远近不同的位置。耳机里通常把每个虚拟声源经过 HRTF/HRIR 卷积，生成左右耳双耳信号；扬声器系统则按 5.1、7.1、Atmos、车载多扬声器等布局，把声道床或对象音频重新分配到实际扬声器，并结合延迟、增益、EQ 和房间校正。",
            en: "Spatial audio is not one format, but a full chain from content creation, spatial encoding, rendering, and playback. It uses interaural time differences, level differences, pinna filtering, room reflections, distance attenuation, and head-motion cues so listeners perceive sources in front, behind, above, below, near, or far away. Headphones usually convolve each virtual source with HRTF/HRIR data to create binaural left/right ear signals; speaker systems render channel beds or object audio to layouts such as 5.1, 7.1, Atmos, or in-car speaker arrays, with delay, gain, EQ, and room correction.",
            ja: "空間音声は単一の形式ではなく、コンテンツ制作、空間符号化、レンダリング、再生機器までを含む一連の経路です。左右耳の到達時間差、レベル差、耳介フィルター、部屋の反射、距離減衰、頭部運動の手掛かりを使い、音が前後、上下、近距離、遠距離のどこから来るかを感じさせます。ヘッドホンでは通常、各仮想音源を HRTF/HRIR データと畳み込み、左右耳のバイノーラル信号を作ります。スピーカーシステムでは、5.1、7.1、Atmos、車載スピーカーアレイなどの配置へチャンネルベッドやオブジェクト音声をレンダリングし、遅延、ゲイン、EQ、ルーム補正も組み合わせます。",
            ko: "공간 오디오는 하나의 형식이 아니라 콘텐츠 제작, 공간 부호화, 렌더링과 재생 장치까지 이어지는 전체 경로입니다. 양 귀의 도달 시간 차, 레벨 차, 귓바퀴 필터, 공간 반사, 거리 감쇠와 머리 움직임 단서를 이용해 청취자가 소리가 앞, 뒤, 위, 아래, 가까이 또는 멀리서 온다고 느끼게 합니다. 헤드폰에서는 보통 각 가상 음원을 HRTF/HRIR 데이터와 컨볼루션해 좌우 귀의 바이노럴 신호를 만들고 스피커 시스템에서는 5.1, 7.1, Atmos, 차량용 스피커 어레이 같은 배치에 채널 베드나 오브젝트 오디오를 렌더링하며 지연, 게인, EQ와 룸 보정도 함께 적용합니다."
          },
          termExplanations: [
            {
              name: { zh: "ITD 到达时间差", en: "ITD interaural time difference", ja: "ITD 両耳間時間差", ko: "ITD 양이 간 시간 차" },
              explanation: {
                zh: "ITD 表示同一个声音到达左右耳的时间差。声源在左侧时通常先到左耳、再到右耳，大脑会利用这个微小时间差判断水平方向，尤其对低频和中低频定位很重要。",
                en: "ITD is the arrival-time difference between the two ears. A source on the left usually reaches the left ear first and the right ear later, and the brain uses this tiny delay to infer horizontal direction, especially at low and mid-low frequencies.",
                ja: "ITD は同じ音が左右の耳へ届く時間差です。左側の音源は通常、左耳へ先に届き、右耳へ後から届きます。脳はこの微小な遅延を使って水平方向を判断し、特に低域から中低域の定位で重要です。",
                ko: "ITD는 같은 소리가 양 귀에 도달하는 시간 차입니다. 왼쪽 음원은 보통 왼쪽 귀에 먼저 도달하고 오른쪽 귀에 늦게 도달하며 뇌는 이 작은 지연을 이용해 수평 방향을 판단합니다. 특히 저주파와 중저주파 위치 인식에 중요합니다."
              }
            },
            {
              name: { zh: "ILD 声级差", en: "ILD interaural level difference", ja: "ILD 両耳間レベル差", ko: "ILD 양이 간 레벨 차" },
              explanation: {
                zh: "ILD 表示同一个声音到达左右耳的声级差。头部会遮挡较高频率的声音，所以右侧声源到左耳时高频会更弱，这种强弱差帮助判断左右方向。",
                en: "ILD is the level difference between the two ears. The head shadows higher frequencies, so a source on the right reaches the left ear with less high-frequency energy; this level contrast helps localize left and right.",
                ja: "ILD は同じ音が左右の耳へ届くレベル差です。頭部は高い周波数を遮るため、右側の音源は左耳へ届くとき高域エネルギーが弱くなり、この強弱差が左右の定位に役立ちます。",
                ko: "ILD는 같은 소리가 양 귀에 도달하는 레벨 차입니다. 머리는 높은 주파수를 가리므로 오른쪽 음원이 왼쪽 귀에 도달할 때 고주파 에너지가 약해지며 이 레벨 대비가 좌우 위치 인식을 돕습니다."
              }
            },
            {
              name: { zh: "HRTF / HRIR", en: "HRTF / HRIR", ja: "HRTF / HRIR", ko: "HRTF / HRIR" },
              explanation: {
                zh: "HRTF 描述声音从某个方向传到耳膜前，被头部、耳廓、肩膀和躯干滤波后的频率响应；对应的时域脉冲响应常叫 HRIR。耳机空间音频会把虚拟声源和对应方向的 HRIR 做卷积，得到左耳和右耳信号。",
                en: "An HRTF describes the frequency response after sound from a direction is filtered by the head, pinna, shoulders, and torso before reaching the eardrum; the corresponding time-domain impulse response is often called an HRIR. Headphone spatial audio convolves a virtual source with direction-specific HRIRs to generate left-ear and right-ear signals.",
                ja: "HRTF は、ある方向から来た音が鼓膜へ届く前に頭部、耳介、肩、胴体でフィルターされた後の周波数応答です。対応する時間領域のインパルス応答は HRIR と呼ばれます。ヘッドホンの空間音声は仮想音源を方向ごとの HRIR と畳み込み、左耳と右耳の信号を生成します。",
                ko: "HRTF는 특정 방향에서 온 소리가 고막에 도달하기 전에 머리, 귓바퀴, 어깨와 몸통에서 필터링된 뒤의 주파수 응답을 설명합니다. 이에 대응하는 시간 영역 임펄스 응답을 HRIR이라고 합니다. 헤드폰 공간 오디오는 가상 음원을 방향별 HRIR과 컨볼루션해 왼쪽 귀와 오른쪽 귀 신호를 생성합니다."
              }
            },
            {
              name: { zh: "双耳渲染", en: "Binaural rendering", ja: "バイノーラルレンダリング", ko: "바이노럴 렌더링" },
              explanation: {
                zh: "双耳渲染的输入可以是单个声源、多个对象、Ambisonics 声场或声道床。渲染器根据每个声源的方位、距离和房间参数，生成只能通过耳机正确还原的左右耳信号。",
                en: "Binaural rendering can take mono sources, multiple objects, an Ambisonics scene, or a channel bed. The renderer uses direction, distance, and room parameters to create left/right ear signals that reproduce correctly over headphones.",
                ja: "バイノーラルレンダリングの入力は、単一音源、複数オブジェクト、Ambisonics の音場、チャンネルベッドなどです。レンダラーは各音源の方向、距離、部屋のパラメーターから、ヘッドホンで正しく再生される左右耳信号を作ります。",
                ko: "바이노럴 렌더링의 입력은 단일 음원, 여러 오브젝트, Ambisonics 장면 또는 채널 베드일 수 있습니다. 렌더러는 각 음원의 방향, 거리와 공간 파라미터를 이용해 헤드폰에서 올바르게 재생되는 좌우 귀 신호를 만듭니다."
              }
            },
            {
              name: { zh: "环绕声与声道床", en: "Surround and channel beds", ja: "サラウンドとチャンネルベッド", ko: "서라운드와 채널 베드" },
              explanation: {
                zh: "传统环绕声把内容直接混到固定声道，例如左、右、中置、环绕、低频 LFE。它适合影院和家庭影院，但声场高度依赖扬声器摆位，换到耳机或不同房间时需要重新渲染或虚拟化。",
                en: "Traditional surround mixes content directly to fixed channels such as left, right, center, surrounds, and LFE. It works well for cinema and home theater, but the image depends heavily on speaker placement and needs virtualization or re-rendering for headphones or different rooms.",
                ja: "従来のサラウンドは、左、右、センター、サラウンド、低域 LFE などの固定チャンネルへ直接ミックスします。映画館やホームシアターに適しますが、音場はスピーカー配置に大きく依存し、ヘッドホンや別の部屋では仮想化または再レンダリングが必要です。",
                ko: "전통적인 서라운드는 왼쪽, 오른쪽, 센터, 서라운드와 저주파 LFE 같은 고정 채널에 콘텐츠를 직접 믹스합니다. 영화관과 홈시어터에 잘 맞지만 음상은 스피커 배치에 크게 의존하며 헤드폰이나 다른 공간에서는 가상화 또는 재렌더링이 필요합니다."
              }
            },
            {
              name: { zh: "对象音频", en: "Object audio", ja: "オブジェクトオーディオ", ko: "오브젝트 오디오" },
              explanation: {
                zh: "对象音频把声音内容和空间元数据分开：一段声音是对象，位置、移动轨迹、大小和优先级是元数据。播放端渲染器再根据实际扬声器或耳机能力把对象放到空间里。",
                en: "Object audio separates sound content from spatial metadata: an audio signal is an object, while position, motion, size, and priority are metadata. The playback renderer maps those objects to the actual speakers or headphones.",
                ja: "オブジェクト音声は音の内容と空間メタデータを分離します。音声信号がオブジェクトで、位置、移動、サイズ、優先度がメタデータです。再生側のレンダラーが実際のスピーカーやヘッドホンの能力に合わせてオブジェクトを空間へ配置します。",
                ko: "오브젝트 오디오는 소리 콘텐츠와 공간 메타데이터를 분리합니다. 오디오 신호가 오브젝트이고 위치, 이동, 크기와 우선순위가 메타데이터입니다. 재생 측 렌더러가 실제 스피커나 헤드폰 능력에 맞춰 오브젝트를 공간에 배치합니다."
              }
            },
            {
              name: { zh: "Ambisonics", en: "Ambisonics", ja: "Ambisonics", ko: "Ambisonics" },
              explanation: {
                zh: "Ambisonics 是一种声场表示方式，常用于 VR、全景视频和游戏。它不直接绑定某几个扬声器，而是用一组通道描述球面声场，播放时再解码到耳机双耳渲染或多扬声器系统。",
                en: "Ambisonics is a scene-based sound-field representation often used in VR, panoramic video, and games. It is not tied to fixed speakers; instead, a set of channels describes a spherical sound field that is decoded to binaural headphones or speaker arrays at playback.",
                ja: "Ambisonics は VR、パノラマ映像、ゲームでよく使われる音場表現です。特定のスピーカーに直接結び付かず、複数のチャンネルで球面音場を表し、再生時にバイノーラルヘッドホンやスピーカーアレイへデコードします。",
                ko: "Ambisonics는 VR, 파노라마 영상과 게임에서 자주 사용하는 음장 표현입니다. 특정 스피커에 직접 묶이지 않고 여러 채널로 구형 음장을 표현한 뒤 재생 시 바이노럴 헤드폰이나 스피커 어레이로 디코드합니다."
              }
            },
            {
              name: { zh: "头部追踪", en: "Head tracking", ja: "ヘッドトラッキング", ko: "헤드 트래킹" },
              explanation: {
                zh: "头部追踪会实时读取头部朝向。当你转头时，渲染器要反向更新虚拟声源相对耳朵的方向，让外部声源听起来仍停在原来的世界位置。延迟过大会导致声像漂移、跟头转或眩晕感。",
                en: "Head tracking reads head orientation in real time. When you turn your head, the renderer updates each virtual source direction relative to the ears so external sources stay fixed in world space. Excess latency can make the image drift, rotate with the head, or feel uncomfortable.",
                ja: "ヘッドトラッキングは頭の向きをリアルタイムで読み取ります。頭を動かすと、レンダラーは耳に対する各仮想音源の方向を更新し、外部の音源が世界空間の同じ位置に留まるようにします。遅延が大きいと音像がずれたり頭と一緒に回ったり、不快感を生じたりします。",
                ko: "헤드 트래킹은 머리 방향을 실시간으로 읽습니다. 머리를 돌리면 렌더러가 귀를 기준으로 각 가상 음원의 방향을 갱신해 외부 음원이 세계 공간의 원래 위치에 고정된 것처럼 유지합니다. 지연이 크면 음상이 흔들리거나 머리와 함께 회전하고 불편함이 생길 수 있습니다."
              }
            },
            {
              name: { zh: "距离感与房间反射", en: "Distance and room reflections", ja: "距離感と室内反射", ko: "거리감과 실내 반사" },
              explanation: {
                zh: "距离不只靠音量判断，还和直达声/混响声比例、高频衰减、早期反射、空气吸收和动态变化有关。只把声音变小通常会像远处的小声源，不一定像真实远距离。",
                en: "Distance is not judged by level alone; it also depends on direct-to-reverberant ratio, high-frequency loss, early reflections, air absorption, and motion. Simply lowering volume often sounds like a quiet nearby source rather than a realistic far source.",
                ja: "距離感はレベルだけでなく、直接音と残響音の比、​​高域損失、初期反射、空気吸収、動きにも左右されます。音量を下げるだけでは、現実的に遠い音源ではなく近くの小さな音源のように聞こえがちです。",
                ko: "거리감은 레벨만으로 판단하지 않으며 직접음/잔향음 비율, 고주파 손실, 초기 반사, 공기 흡수와 움직임에도 좌우됩니다. 단순히 볼륨을 낮추면 실제로 먼 음원보다 가까운 곳의 작은 음원처럼 들리는 경우가 많습니다."
              }
            }
          ],
          keyConcepts: [
            { zh: "人耳定位不是只靠左右音量差：水平定位常依赖 ITD 和 ILD，前后/上下定位更依赖耳廓造成的频谱凹陷和峰值，距离感还需要反射和混响线索。", en: "Localization is not just left/right volume difference: horizontal placement often relies on ITD and ILD, front/back and height rely more on pinna spectral notches and peaks, and distance needs reflection and reverberation cues.", ja: "人の定位は左右の音量差だけではありません。水平定位は ITD と ILD、前後や高さは耳介が作るスペクトルのノッチとピーク、距離感は反射と残響の手掛かりに大きく依存します。", ko: "인간의 위치 인식은 좌우 볼륨 차이만으로 이루어지지 않습니다. 수평 위치는 ITD와 ILD, 앞뒤와 높이는 귓바퀴가 만드는 스펙트럼 노치와 피크, 거리감은 반사와 잔향 단서에 더 의존합니다." },
            { zh: "耳机空间音频的典型链路是：声源或对象 -> 方位/距离参数 -> HRTF/HRIR 卷积 -> 房间反射/混响 -> 左右耳双耳 PCM。", en: "A typical headphone chain is: source or object -> direction/distance parameters -> HRTF/HRIR convolution -> room reflections/reverb -> binaural left/right PCM.", ja: "ヘッドホン空間音声の典型経路は、音源またはオブジェクト -> 方向／距離パラメーター -> HRTF/HRIR 畳み込み -> 部屋の反射／残響 -> 左右耳のバイノーラル PCM です。", ko: "헤드폰 공간 오디오의 일반적인 경로는 음원 또는 오브젝트 -> 방향/거리 파라미터 -> HRTF/HRIR 컨볼루션 -> 공간 반사/잔향 -> 좌우 귀 바이노럴 PCM입니다." },
            { zh: "扬声器空间音频的典型链路是：声道床或对象音频 -> 渲染器 -> 扬声器布局映射 -> 延迟/增益/EQ/房间校正 -> 实际声场。", en: "A typical speaker chain is: channel bed or object audio -> renderer -> speaker-layout mapping -> delay/gain/EQ/room correction -> physical sound field.", ja: "スピーカー空間音声の典型経路は、チャンネルベッドまたはオブジェクト音声 -> レンダラー -> スピーカー配置へのマッピング -> 遅延／ゲイン／EQ／ルーム補正 -> 実際の音場です。", ko: "스피커 공간 오디오의 일반적인 경로는 채널 베드 또는 오브젝트 오디오 -> 렌더러 -> 스피커 배치 매핑 -> 지연/게인/EQ/룸 보정 -> 실제 음장입니다." },
            { zh: "对象音频关注“声音在哪里、如何移动”，Ambisonics 关注“整个球面声场如何表示”；二者都需要在播放端解码或渲染。", en: "Object audio focuses on where sounds are and how they move, while Ambisonics represents the whole spherical sound field; both require decoding or rendering at playback.", ja: "オブジェクト音声は「音がどこにあり、どう動くか」に注目し、Ambisonics は「球面音場全体をどう表すか」を扱います。どちらも再生側でデコードまたはレンダリングが必要です。", ko: "오브젝트 오디오는 ‘소리가 어디에 있고 어떻게 움직이는가’에 초점을 맞추고 Ambisonics는 ‘전체 구형 음장을 어떻게 표현하는가’를 다룹니다. 둘 다 재생 측에서 디코드나 렌더링이 필요합니다." },
            { zh: "头部追踪的目标是让声源固定在外部世界，而不是粘在耳朵上。运动传感器、蓝牙链路、渲染 buffer 和系统调度都会影响端到端延迟。", en: "Head tracking aims to keep sources fixed in the outside world rather than attached to the ears. Motion sensors, Bluetooth links, render buffers, and system scheduling all affect end-to-end latency.", ja: "ヘッドトラッキングの目標は音源を耳に貼り付けるのではなく、外部の世界に固定することです。モーションセンサー、Bluetooth リンク、レンダーバッファー、システムスケジューリングがエンドツーエンド遅延に影響します。", ko: "헤드 트래킹의 목표는 음원을 귀에 붙이는 것이 아니라 외부 세계에 고정하는 것입니다. 모션 센서, Bluetooth 링크, 렌더 버퍼와 시스템 스케줄링이 엔드투엔드 지연에 영향을 줍니다." },
            { zh: "HRTF 有个体差异。通用 HRTF 能提供基本方向感，但前后混淆、头内定位和高度感不足很常见，个性化 HRTF 或校准可以改善效果。", en: "HRTFs vary by listener. Generic HRTFs can provide basic directionality, but front/back confusion, inside-the-head localization, and weak height are common; personalized HRTFs or calibration can improve results.", ja: "HRTF には個人差があります。汎用 HRTF でも基本的な方向感は得られますが、前後の混同、頭内定位、高さの不足はよく起こり、個人化 HRTF や校正で改善できます。", ko: "HRTF는 청취자마다 다릅니다. 일반 HRTF도 기본 방향감은 제공하지만 앞뒤 혼동, 머릿속에 맺히는 위치감과 약한 높이감이 흔하며 개인화 HRTF나 보정으로 개선할 수 있습니다." },
            { zh: "空间音频和语音增强里的波束成形方向相反：空间音频主要是把声音渲染到空间，波束成形主要是从空间中选择性拾取声音。", en: "Spatial audio and speech-enhancement beamforming are opposite in direction: spatial audio renders sound into space, while beamforming selectively captures sound from space.", ja: "空間音声と音声強調のビームフォーミングは方向が逆です。空間音声は主に音を空間へレンダリングし、ビームフォーミングは空間から音を選択的に収音します。", ko: "공간 오디오와 음성 향상의 빔포밍은 방향이 반대입니다. 공간 오디오는 주로 소리를 공간에 렌더링하고 빔포밍은 공간에서 소리를 선택적으로 수음합니다." }
          ],
          lab: {
            type: "spatial-audio",
            title: { zh: "空间音频实验室", en: "Spatial Audio Lab", ja: "空間音声ラボ", ko: "공간 오디오 실험실" },
            description: {
              zh: "进入独立界面调节声源角度、距离、房间反射和头部朝向，观察 ITD、ILD、HRTF、双耳渲染和头部追踪指标如何变化。",
              en: "Open an independent lab to adjust source angle, distance, room reflections, and head yaw, then observe ITD, ILD, HRTF, binaural rendering, and head-tracking metrics.",
              ja: "独立したラボで音源角度、距離、部屋の反射、頭部のヨー角を調整し、ITD、ILD、HRTF、バイノーラルレンダリング、ヘッドトラッキングの指標を観察します。",
              ko: "독립 실험실에서 음원 각도, 거리, 공간 반사와 머리 요 각도를 조절하고 ITD, ILD, HRTF, 바이노럴 렌더링과 헤드 트래킹 지표를 관찰합니다."
            },
            buttonLabel: { zh: "打开空间音频实验室", en: "Open spatial audio lab", ja: "空間音声ラボを開く", ko: "공간 오디오 실험실 열기" }
          },
          misconception: {
            zh: "简单把左右声道拉宽、加一点混响或做左右声道延迟，不等于真正空间音频。真实空间感需要方向、距离、耳廓滤波、反射、头部运动和播放设备校准共同成立；否则可能只是“变宽”，但定位不准、中心发虚或听久疲劳。",
            en: "Simply widening stereo, adding some reverb, or delaying one channel is not true spatial audio. Convincing space needs direction, distance, pinna filtering, reflections, head motion, and playback calibration together; otherwise it may only sound wider, with poor localization, weak center image, or listening fatigue.",
            ja: "ステレオを広げたり、少し残響を加えたり、一方のチャンネルを遅延させたりするだけでは本当の空間音声になりません。説得力のある空間感には、方向、距離、耳介フィルター、反射、頭部運動、再生機器の校正がそろって必要です。そうでなければ、定位が悪く、センターが弱く、長時間で疲れるだけの「広がった音」になり得ます。",
            ko: "스테레오를 단순히 넓히거나 잔향을 조금 더하거나 한 채널을 지연하는 것만으로는 진정한 공간 오디오가 되지 않습니다. 설득력 있는 공간감에는 방향, 거리, 귓바퀴 필터, 반사, 머리 움직임과 재생 장치 보정이 함께 필요하며 그렇지 않으면 위치가 부정확하고 센터가 약하거나 오래 들을 때 피로한 ‘넓어진 소리’에 그칠 수 있습니다."
          },
          contentDirection: {
            zh: "后续适合做空间音频实验室：用一个俯视头部图展示声源角度，切换 ITD、ILD、HRTF、房间反射和头部追踪；再对比耳机双耳渲染、5.1/7.1 环绕声、对象音频、Ambisonics、游戏和车载座舱空间音频的链路差异。",
            en: "A later spatial-audio lab could show a top-down head diagram with a movable source angle, toggling ITD, ILD, HRTF, room reflections, and head tracking; it could then compare headphone binaural rendering, 5.1/7.1 surround, object audio, Ambisonics, games, and in-cabin spatial audio.",
            ja: "今後は俯瞰した頭部図で音源角度を動かし、ITD、ILD、HRTF、部屋の反射、ヘッドトラッキングを切り替える空間音声ラボへ発展できます。さらに、ヘッドホンのバイノーラルレンダリング、5.1/7.1 サラウンド、オブジェクト音声、Ambisonics、ゲーム、車室内空間音声の経路を比較できます。",
            ko: "향후 위에서 본 머리 도해에서 음원 각도를 움직이고 ITD, ILD, HRTF, 공간 반사와 헤드 트래킹을 전환하는 공간 오디오 실험실로 확장할 수 있습니다. 또한 헤드폰 바이노럴 렌더링, 5.1/7.1 서라운드, 오브젝트 오디오, Ambisonics, 게임과 차량 실내 공간 오디오의 경로를 비교할 수 있습니다."
          }
        }
      }
    ]
  },
  {
    id: "ai",
    icon: BrainCircuit,
    accent: "#b44c6d",
    title: { zh: "AI 音频", en: "AI Audio", ja: "AI 音声", ko: "AI 오디오" },
    description: {
      zh: "从信号表示、训练目标、评价指标与部署约束理解识别、合成、生成、增强和神经编码。",
      en: "Understand recognition, synthesis, generation, enhancement, and neural coding through representations, objectives, metrics, and deployment constraints.",
      ja: "信号表現、学習目標、評価指標、デプロイ制約から、認識、合成、生成、強調、ニューラル符号化を理解します。",
      ko: "신호 표현, 학습 목표, 평가 지표와 배포 제약을 통해 인식, 합성, 생성, 향상과 신경망 코딩을 이해합니다."
    },
    topics: [
      {
        title: { zh: "AI 音频总流程", en: "AI Audio Overall Flow", ja: "AI 音声の全体フロー", ko: "AI 오디오 전체 흐름" },
        summary: {
          zh: "先建立从 PCM、任务表示、模型目标到评价与部署的统一工程框架。",
          en: "Build one engineering framework from PCM and task representations to objectives, evaluation, and deployment.",
          ja: "PCM とタスク表現から、目標、評価、デプロイまでを一つの工学的枠組みで整理します。",
          ko: "PCM과 작업 표현에서 목표, 평가와 배포까지 하나의 엔지니어링 프레임워크로 정리합니다."
        },
        bullets: [
          { zh: "波形、频谱、embedding 与 token", en: "Waveforms, spectra, embeddings, and tokens", ja: "波形、スペクトル、embedding、token", ko: "파형, 스펙트럼, embedding과 token" },
          { zh: "训练目标与核心公式", en: "Training objectives and core equations", ja: "学習目標と主要な式", ko: "학습 목표와 핵심 공식" },
          { zh: "任务指标与实时部署预算", en: "Task metrics and real-time deployment budgets", ja: "タスク指標とリアルタイムデプロイ予算", ko: "작업 지표와 실시간 배포 예산" }
        ],
        detail: {
          explanation: {
            zh: "真实声音经过麦克风、Codec/ADC 采集后得到 PCM 数字音频；PCM 只是数字波形，不直接包含语义。\n\n不同任务会按需使用原始波形、FFT/STFT、Mel/MFCC、学习型 embedding 或神经 codec token，再由专用模型完成识别、生成、增强或编码。\n\n声音分类常把频谱图作为二维特征，但这不是所有 AI 音频的统一前端；专业系统还必须明确训练目标、任务指标，以及流式/离线、端侧/云端的延迟和算力预算。",
            en: "Microphones and Codec/ADC hardware capture real sound as PCM, which is waveform data rather than semantics.\n\nEach task may use raw waveform, FFT/STFT, Mel/MFCC, learned embeddings, or neural-codec tokens before a specialized model performs recognition, generation, enhancement, or coding.\n\nSound classification often uses spectrograms as 2D features, but that is not a universal AI-audio front end. A production system must also define its training objective, task metrics, and latency/compute budget for streaming or offline, edge or cloud deployment.",
            ja: "実際の音はマイクと Codec/ADC で PCM のデジタル音声になります。PCM は波形データであり、意味を直接含むものではありません。\n\nタスクに応じて、生波形、FFT/STFT、Mel/MFCC、学習型 embedding、ニューラル Codec token などを使い、専用モデルが認識、生成、強調、符号化を行います。\n\n音声分類ではスペクトログラムを2次元特徴として使うことが多いものの、すべての AI 音声で共通するフロントエンドではありません。実運用システムでは、学習目標、タスク指標、ストリーミング／オフライン、エッジ／クラウドに応じた遅延と計算量の予算も定義する必要があります。",
            ko: "실제 소리는 마이크와 Codec/ADC를 거쳐 PCM 디지털 오디오가 됩니다. PCM은 파형 데이터일 뿐 의미를 직접 포함하지 않습니다.\n\n작업에 따라 원시 파형, FFT/STFT, Mel/MFCC, 학습형 embedding 또는 신경망 코덱 token을 사용하고 전용 모델이 인식, 생성, 향상이나 코딩을 수행합니다.\n\n소리 분류에서는 스펙트로그램을 2차원 특징으로 자주 사용하지만 모든 AI 오디오의 공통 프런트엔드는 아닙니다. 실제 시스템은 학습 목표, 작업 지표와 함께 스트리밍/오프라인, 엣지/클라우드 배포에 맞는 지연과 연산 예산도 정의해야 합니다."
          },
          termExplanations: [
            {
              name: { zh: "PCM", en: "PCM", ja: "PCM", ko: "PCM" },
              explanation: {
                zh: "PCM 是麦克风采集和 ADC 转换后的原始数字采样值。它能还原波形，但不直接表示“说了什么”或“发生了什么声音”。",
                en: "PCM is the raw digital sample stream after microphone capture and ADC conversion. It can reconstruct a waveform, but it does not directly represent what was said or what sound happened.",
                ja: "PCM はマイク収音と ADC 変換後の生のデジタルサンプル列です。波形を再構成できますが、「何を話したか」や「どんな音が起きたか」を直接表すものではありません。",
                ko: "PCM은 마이크 캡처와 ADC 변환 후의 원시 디지털 샘플 스트림입니다. 파형을 복원할 수 있지만 ‘무엇을 말했는지’나 ‘어떤 소리가 났는지’를 직접 나타내지는 않습니다."
              }
            },
            {
              name: { zh: "FFT / STFT / Mel / MFCC", en: "FFT / STFT / Mel / MFCC", ja: "FFT / STFT / Mel / MFCC", ko: "FFT / STFT / Mel / MFCC" },
              explanation: {
                zh: "FFT 把短帧信号从时间域转到频率域；STFT 是对连续短帧反复做 FFT；Mel 滤波让频率尺度更接近人耳听感；MFCC 再把谱包络压缩成更紧凑的特征。",
                en: "FFT converts a short frame from time domain to frequency domain; STFT repeatedly applies FFT over many frames; Mel filters make the frequency scale closer to human hearing; MFCCs compress the spectral envelope into compact features.",
                ja: "FFT は短いフレームを時間領域から周波数領域へ変換し、STFT は連続する短フレームに FFT を繰り返し適用します。Mel フィルターは周波数尺度を人の聴覚に近づけ、MFCC はスペクトル包絡をよりコンパクトな特徴へ圧縮します。",
                ko: "FFT는 짧은 프레임 신호를 시간 영역에서 주파수 영역으로 변환하고 STFT는 여러 프레임에 FFT를 반복 적용합니다. Mel 필터는 주파수 척도를 사람의 청각에 가깝게 만들며 MFCC는 스펙트럼 엔벌로프를 더 압축된 특징으로 바꿉니다."
              }
            },
            {
              name: { zh: "频谱图像识别", en: "Spectrogram recognition", ja: "スペクトログラム認識", ko: "스펙트로그램 인식" },
              explanation: {
                zh: "声音事件识别常把 log-mel 频谱图看成一张二维图：横轴是时间，纵轴是频率，颜色或亮度是能量。模型从中寻找事件特征，例如玻璃破碎的短促高频、狗叫声的重复脉冲、哭声的调制结构。",
                en: "Sound event recognition often treats a log-mel spectrogram as a 2D map: time on the x-axis, frequency on the y-axis, and color or brightness as energy. The model looks for event patterns such as short high-frequency glass breaks, repeated dog-bark pulses, or modulated baby-cry structure.",
                ja: "音響イベント認識では、log-mel スペクトログラムを2次元マップとして扱うことがよくあります。横軸が時間、縦軸が周波数、色や明るさがエネルギーです。モデルは、ガラスが割れる短い高域、犬の鳴き声の反復パルス、泣き声の変調構造などのイベントパターンを探します。",
                ko: "소리 이벤트 인식에서는 log-mel 스펙트로그램을 2차원 맵으로 다루는 경우가 많습니다. 가로축은 시간, 세로축은 주파수, 색이나 밝기는 에너지입니다. 모델은 유리 파손의 짧은 고주파, 개 짖음의 반복 펄스, 울음소리의 변조 구조 같은 이벤트 패턴을 찾습니다."
              }
            },
            {
              name: { zh: "任务模型", en: "Task model", ja: "タスクモデル", ko: "태스크 모델" },
              explanation: {
                zh: "同样的 PCM 可以送去不同任务模型：ASR 输出文字，事件识别输出类别概率，AI 降噪输出增强后的 PCM，AI 编码输出 token/latent 或低码率码流，生成式音频输出新声音。",
                en: "The same PCM can go to different task models: ASR outputs text, event detection outputs class probabilities, AI denoising outputs enhanced PCM, AI coding outputs tokens/latents or low-bitrate streams, and generative audio outputs new sound.",
                ja: "同じ PCM を異なるタスクモデルへ入力できます。ASR は文字、イベント認識はクラス確率、AI ノイズ低減は強調済み PCM、AI 符号化は token/latent や低ビットレートのビットストリーム、生成音声は新しい音を出力します。",
                ko: "같은 PCM을 서로 다른 작업 모델에 보낼 수 있습니다. ASR은 텍스트, 이벤트 인식은 클래스 확률, AI 잡음 제거는 향상된 PCM, AI 코딩은 token/latent 또는 저비트레이트 스트림, 생성 오디오는 새로운 소리를 출력합니다."
              }
            }
          ],
          keyConcepts: [
            { zh: "先采集得到 PCM 数字音频；PCM 是波形数字，不是语义。", en: "Capture first produces PCM digital audio; PCM is waveform data, not semantic meaning.", ja: "まず収音して PCM デジタル音声を得ます。PCM は波形データであり、意味ではありません。", ko: "먼저 캡처해 PCM 디지털 오디오를 얻습니다. PCM은 파형 데이터이지 의미가 아닙니다." },
            { zh: "表示方式取决于任务：可使用波形、频谱/Mel/MFCC、学习型 embedding 或 codec token。", en: "Representations depend on the task: waveform, spectrum/Mel/MFCC, learned embeddings, or codec tokens may be used.", ja: "表現方法はタスクによって異なり、波形、スペクトル／Mel／MFCC、学習型 embedding、Codec token などを使います。", ko: "표현 방식은 작업에 따라 달라지며 파형, 스펙트럼/Mel/MFCC, 학습형 embedding 또는 코덱 token을 사용할 수 있습니다." },
            { zh: "把频谱图当图像识别是声音事件识别的一种常见解释方式，但不是所有 AI 音频任务都等同于图像识别。", en: "Treating spectrograms like images is a common way to explain sound event detection, but not every AI audio task is simply image recognition.", ja: "スペクトログラムを画像のように扱うのは音響イベント認識の説明として一般的ですが、すべての AI 音声タスクが画像認識と同じわけではありません。", ko: "스펙트로그램을 이미지처럼 다루는 것은 소리 이벤트 인식을 설명하는 일반적인 방식이지만 모든 AI 오디오 작업이 이미지 인식과 같은 것은 아닙니다." },
            { zh: "AI 音频的关键问题是：输入是什么、特征如何表示、模型输出什么、后处理如何变成用户可理解结果。", en: "The key AI audio questions are: what is the input, how are features represented, what does the model output, and how does post-processing turn it into a user-understandable result.", ja: "AI 音声の重要な問いは、入力は何か、特徴をどう表すか、モデルは何を出力するか、後処理でどうユーザーが理解できる結果にするかです。", ko: "AI 오디오의 핵심 질문은 입력이 무엇인지, 특징을 어떻게 표현하는지, 모델이 무엇을 출력하는지, 후처리로 어떻게 사용자가 이해할 수 있는 결과로 바꾸는지입니다." }
          ],
          lab: {
            type: "ai-audio",
            initialMode: "overview",
            title: { zh: "AI 音频总流程实验室", en: "AI Audio Overall Flow Lab", ja: "AI 音声全体フローラボ", ko: "AI 오디오 전체 흐름 실험실" },
            description: {
              zh: "进入独立文章界面，用总流程图理解 PCM、特征、模型、任务输出和后处理的关系。",
              en: "Open an independent article page with a flow diagram explaining PCM, features, models, task outputs, and post-processing.",
              ja: "独立した記事ページで全体フロー図を確認し、PCM、特徴、モデル、タスク出力、後処理の関係を理解します。",
              ko: "독립 문서 페이지에서 전체 흐름 도해를 보고 PCM, 특징, 모델, 작업 출력과 후처리의 관계를 이해합니다."
            },
            buttonLabel: { zh: "打开 AI 音频总流程实验室", en: "Open AI audio overall flow lab", ja: "AI 音声全体フローラボを開く", ko: "AI 오디오 전체 흐름 실험실 열기" }
          },
          misconception: {
            zh: "不要把所有 AI 音频都理解成“频谱图像识别”。频谱图分类确实常见，但语音识别、降噪、编码和生成会使用不同网络结构、训练目标和输出形式。",
            en: "Do not treat all AI audio as spectrogram image recognition. Spectrogram classification is common, but speech recognition, denoising, coding, and generation use different network structures, training objectives, and outputs.",
            ja: "すべての AI 音声を「スペクトログラム画像認識」と捉えないでください。スペクトログラム分類は一般的ですが、音声認識、ノイズ低減、符号化、生成は異なるネットワーク構造、学習目標、出力形式を使います。",
            ko: "모든 AI 오디오를 ‘스펙트로그램 이미지 인식’으로 이해하면 안 됩니다. 스펙트로그램 분류는 흔하지만 음성 인식, 잡음 제거, 코딩과 생성은 서로 다른 네트워크 구조, 학습 목표와 출력 형식을 사용합니다."
          },
          contentDirection: {
            zh: "适合先作为 AI 音频章节的入口，用流程图解释从 PCM 到特征、模型、任务输出和后处理的完整链路。",
            en: "This works as the entry point for the AI audio chapter, using a flow diagram to explain PCM, features, models, task outputs, and post-processing.",
            ja: "AI 音声章の入口として、PCM から特徴、モデル、タスク出力、後処理までの全経路をフロー図で説明できます。",
            ko: "AI 오디오 장의 입구로 사용해 PCM에서 특징, 모델, 작업 출력과 후처리까지의 전체 경로를 흐름도로 설명할 수 있습니다."
          }
        }
      },
      {
        title: { zh: "语音识别 ASR", en: "Speech Recognition ASR", ja: "音声認識 ASR", ko: "음성 인식 ASR" },
        summary: {
          zh: "理解语音转文字、端到端识别、流式识别、唤醒词和多语言识别。",
          en: "Understand speech-to-text, end-to-end recognition, streaming ASR, wake words, and multilingual recognition.",
          ja: "音声から文字への変換、エンドツーエンド認識、ストリーミング ASR、ウェイクワード、多言語認識を理解します。",
          ko: "음성 텍스트 변환, 엔드투엔드 인식, 스트리밍 ASR, 웨이크 워드와 다국어 인식을 이해합니다."
        },
        bullets: [
          { zh: "语音转文字流程", en: "Speech-to-text pipeline", ja: "音声から文字への処理フロー", ko: "음성 텍스트 변환 흐름" },
          { zh: "端到端与流式识别", en: "End-to-end and streaming recognition", ja: "エンドツーエンド認識とストリーミング認識", ko: "엔드투엔드와 스트리밍 인식" },
          { zh: "唤醒词与多语言", en: "Wake words and multilingual ASR", ja: "ウェイクワードと多言語 ASR", ko: "웨이크 워드와 다국어 ASR" }
        ],
        detail: {
          explanation: {
            zh: "语音识别把连续的语音波形转换成可编辑、可检索的文字，但 ASR 并不是把每个采样点直接翻译成文字。\n\nPCM 只是连续的压力变化数字，系统通常先把它切成 10 ms 或 20 ms 左右的短帧，再提取每帧的频率能量结构，形成 log-mel、MFCC 或神经网络 embedding。\n\n随后 Encoder 把这些连续声学变化压成更稳定的上下文表示，CTC、Attention 或 Transducer 等识别头再估计最可能的 token 序列，最后经过语言上下文、热词、标点、时间戳和说话人信息等后处理，得到最终文本。",
            en: "Speech recognition turns continuous speech waveforms into editable, searchable text, but ASR does not translate each sample directly into words.\n\nPCM is only a sequence of pressure-change numbers. A system usually slices it into short frames of about 10 ms or 20 ms, extracts frequency-energy structure from each frame, and forms log-mel features, MFCCs, or neural embeddings.\n\nAn encoder then compresses those acoustic changes into more stable contextual representations; CTC, attention, or transducer heads estimate the most likely token sequence; and language context, hotwords, punctuation, timestamps, and speaker metadata produce the final text.",
            ja: "音声認識は連続する音声波形を編集・検索できる文字へ変換しますが、ASR は各サンプルを直接単語へ翻訳するものではありません。\n\nPCM は圧力変化を数値化した列にすぎません。システムは通常、約 10 ms または 20 ms の短いフレームに分け、各フレームの周波数エネルギー構造を抽出して log-mel、MFCC、ニューラル embedding を作ります。\n\n次に Encoder が音響変化を安定した文脈表現へ圧縮し、CTC、Attention、Transducer などの認識ヘッドが最も可能性の高い token 列を推定します。最後に言語コンテキスト、ホットワード、句読点、タイムスタンプ、話者情報を後処理して最終テキストを得ます。",
            ko: "음성 인식은 연속적인 음성 파형을 편집·검색 가능한 텍스트로 바꾸지만 ASR이 각 샘플을 직접 단어로 번역하는 것은 아닙니다.\n\nPCM은 압력 변화의 수치열일 뿐입니다. 시스템은 보통 약 10 ms 또는 20 ms의 짧은 프레임으로 나누고 각 프레임의 주파수 에너지 구조를 추출해 log-mel, MFCC 또는 신경망 embedding을 만듭니다.\n\n그 다음 Encoder가 연속적인 음향 변화를 더 안정적인 문맥 표현으로 압축하고 CTC, Attention 또는 Transducer 같은 인식 헤드가 가장 가능성 높은 token 시퀀스를 추정합니다. 마지막으로 언어 문맥, 핫워드, 구두점, 타임스탬프와 화자 정보를 후처리해 최종 텍스트를 얻습니다."
          },
          termExplanations: [
            {
              name: { zh: "PCM 输入", en: "PCM input", ja: "PCM 入力", ko: "PCM 입력" },
              explanation: {
                zh: "输入通常是麦克风采集到的 PCM 采样值，例如 16 kHz 单声道语音。PCM 能描述波形，但它本身没有“字”的概念，因此不能直接等于文本，需要先变成模型能理解的短时声学模式。",
                en: "The input is usually PCM samples captured by a microphone, such as 16 kHz mono speech. PCM describes the waveform, but it has no word-level meaning by itself, so it must be converted into short-time acoustic patterns a model can use.",
                ja: "入力は通常、16 kHz モノラル音声のような、マイクで収音した PCM サンプルです。PCM は波形を表しますが、単独では「文字」の概念を持たないため、モデルが扱える短時間の音響パターンへ変換する必要があります。",
                ko: "입력은 보통 16 kHz 모노 음성처럼 마이크로 캡처한 PCM 샘플입니다. PCM은 파형을 나타내지만 자체적으로 ‘단어’ 의미가 없으므로 모델이 사용할 수 있는 단시간 음향 패턴으로 변환해야 합니다."
              }
            },
            {
              name: { zh: "分帧加窗", en: "Framing and windowing", ja: "フレーム分割と窓関数", ko: "프레임 분할과 윈도잉" },
              explanation: {
                zh: "语音在很短时间内可以近似看成稳定信号，所以 ASR 会把长波形切成短帧，例如 10 ms 或 20 ms，并用窗函数减少帧边界突变。输出是一串短时分析片段，后面才能计算频谱或送入神经网络。",
                en: "Speech can be treated as roughly stable over a short interval, so ASR slices a long waveform into frames such as 10 ms or 20 ms and applies a window to reduce boundary jumps. The output is a sequence of short analysis segments ready for spectral features or neural input.",
                ja: "音声は短い時間ではほぼ定常信号とみなせるため、ASR は長い波形を 10 ms や 20 ms のフレームに分け、窓関数で境界の急変を抑えます。出力は、スペクトル特徴の計算やニューラルネットワーク入力に使える短時間解析片の列です。",
                ko: "음성은 짧은 구간에서는 대략 안정적인 신호로 볼 수 있으므로 ASR은 긴 파형을 10 ms나 20 ms 프레임으로 나누고 윈도 함수로 경계의 급격한 변화를 줄입니다. 출력은 스펙트럼 특징 계산이나 신경망 입력에 사용할 수 있는 짧은 분석 구간의 시퀀스입니다."
              }
            },
            {
              name: { zh: "log-mel / MFCC", en: "log-mel / MFCC", ja: "log-mel / MFCC", ko: "log-mel / MFCC" },
              explanation: {
                zh: "log-mel 和 MFCC 都是在描述每帧语音里不同频率区域的能量。log-mel 会把每帧语音变成更接近人耳听感的频率能量图，MFCC 则进一步压缩频谱包络；它们让模型更关注音素、元音、辅音等语音结构，而不是原始采样点细节。",
                en: "Log-mel and MFCC features describe how much energy each speech frame has in different frequency regions. Log-mel is like a time-varying frequency-energy map, while MFCC compresses the spectral envelope further; both help models focus on phonetic structure rather than raw sample details.",
                ja: "log-mel と MFCC は、各音声フレームの異なる周波数領域にどれだけエネルギーがあるかを表します。log-mel は時間変化する周波数エネルギーマップに近く、MFCC はスペクトル包絡をさらに圧縮します。どちらもモデルが生サンプルの細部ではなく、音素、母音、子音などの音声構造へ注目するのを助けます。",
                ko: "log-mel과 MFCC는 각 음성 프레임이 서로 다른 주파수 영역에 얼마나 많은 에너지를 갖는지 설명합니다. log-mel은 시간에 따라 변하는 주파수 에너지 맵과 같고 MFCC는 스펙트럼 엔벌로프를 더 압축합니다. 둘 다 모델이 원시 샘플 세부보다 음소, 모음과 자음 같은 음성 구조에 집중하도록 돕습니다."
              }
            },
            {
              name: { zh: "Encoder 编码器", en: "Encoder", ja: "Encoder（エンコーダー）", ko: "Encoder(인코더)" },
              explanation: {
                zh: "Encoder 接收连续的特征帧，结合前后上下文，把“局部频谱变化”变成更高层的语音表示。输出仍然是时间序列，但每个位置已经包含更多上下文信息，方便后续判断它像哪个音素、拼音、字或 token。",
                en: "The encoder consumes feature frames, combines surrounding context, and turns local spectral changes into higher-level speech representations. Its output is still a time sequence, but each position carries richer context for predicting phonemes, pinyin, characters, or tokens.",
                ja: "Encoder は特徴フレームを受け取り、前後の文脈を組み合わせて「局所的なスペクトル変化」をより高次の音声表現へ変換します。出力は時間系列のままですが、各位置に音素、ピンイン、文字、token を予測するための豊かな文脈が含まれます。",
                ko: "Encoder는 특징 프레임을 받아 주변 문맥을 결합하고 ‘국소 스펙트럼 변화’를 더 높은 수준의 음성 표현으로 바꿉니다. 출력은 여전히 시간 시퀀스지만 각 위치에 음소, 병음, 문자 또는 token을 예측할 수 있는 더 풍부한 문맥이 담깁니다."
              }
            },
            {
              name: { zh: "CTC / Attention / Transducer", en: "CTC / Attention / Transducer", ja: "CTC / Attention / Transducer", ko: "CTC / Attention / Transducer" },
              explanation: {
                zh: "CTC 适合把很多帧对齐到较短 token 序列，中间允许空白符；Attention 更像看完整上下文后逐步生成文本；Transducer/RNNT 适合流式识别，把声学帧和已输出 token 一起决定下一个 token。",
                en: "CTC maps many acoustic frames to a shorter token sequence with blank symbols. Attention generates text step by step while looking at context. Transducer/RNNT is well suited to streaming ASR because it uses both acoustic frames and previously emitted tokens to decide the next token.",
                ja: "CTC は多数の音響フレームを blank 記号を含む短い token 列へ対応付けます。Attention は全体の文脈を見ながら段階的にテキストを生成します。Transducer/RNNT は音響フレームとすでに出力した token の両方から次の token を決めるため、ストリーミング ASR に適しています。",
                ko: "CTC는 많은 음향 프레임을 blank 기호를 포함한 짧은 token 시퀀스에 매핑합니다. Attention은 문맥을 보면서 단계적으로 텍스트를 생성합니다. Transducer/RNNT는 음향 프레임과 이미 출력한 token을 함께 사용해 다음 token을 결정하므로 스트리밍 ASR에 적합합니다."
              }
            },
            {
              name: { zh: "解码与后处理", en: "Decoding and post-processing", ja: "デコードと後処理", ko: "디코딩과 후처리" },
              explanation: {
                zh: "模型输出通常是多个 token 候选和概率，解码器会结合语言约束、热词和上下文选择更合理的句子。后处理再补标点、大小写、数字格式、时间戳和说话人信息，让输出更适合字幕、会议纪要或语音控制。",
                en: "The model usually outputs token candidates and probabilities. A decoder uses language constraints, hotwords, and context to choose a more plausible sentence. Post-processing adds punctuation, casing, number formatting, timestamps, and speaker metadata for captions, meeting notes, or voice control.",
                ja: "モデルは通常、複数の token 候補と確率を出力します。デコーダーは言語制約、ホットワード、文脈を使ってより妥当な文を選びます。後処理で句読点、大文字小文字、数値形式、タイムスタンプ、話者メタデータを加え、字幕、議事録、音声操作に適した出力にします。",
                ko: "모델은 보통 여러 token 후보와 확률을 출력합니다. 디코더는 언어 제약, 핫워드와 문맥을 이용해 더 타당한 문장을 선택합니다. 후처리에서 구두점, 대소문자, 숫자 형식, 타임스탬프와 화자 메타데이터를 추가해 자막, 회의록이나 음성 제어에 적합하게 만듭니다."
              }
            },
            {
              name: { zh: "流式识别", en: "Streaming ASR", ja: "ストリーミング ASR", ko: "스트리밍 ASR" },
              explanation: {
                zh: "流式 ASR 不能等整句话结束才处理，需要边接收小块音频边输出文字。它要控制首字延迟和实时率，还要处理临时结果回滚，例如先显示“打开客”，再修正为“打开客厅灯”。",
                en: "Streaming ASR cannot wait for the full utterance; it receives small audio chunks and emits text incrementally. It must control first-token latency and real-time factor, while handling partial-result rollback such as correcting an early phrase once more context arrives.",
                ja: "ストリーミング ASR は発話全体の終了を待てず、小さな音声チャンクを受け取りながら文字を逐次出力します。首字遅延とリアルタイム率を制御し、文脈が増えたときに初期の仮結果を修正するロールバックも扱います。",
                ko: "스트리밍 ASR은 전체 발화가 끝날 때까지 기다릴 수 없으며 작은 오디오 청크를 받는 동시에 텍스트를 점진적으로 출력합니다. 첫 토큰 지연과 실시간 계수를 제어하고 문맥이 늘면 초기 임시 결과를 수정하는 롤백도 처리해야 합니다."
              }
            },
            {
              name: { zh: "WER / CER / RTF", en: "WER / CER / RTF", ja: "WER / CER / RTF", ko: "WER / CER / RTF" },
              explanation: {
                zh: "WER 是词错误率，CER 是字错误率，RTF 是实时率。离线转写更看最终 WER/CER，实时交互还要看首字延迟、稳定性、端点检测和噪声鲁棒性。",
                en: "WER is word error rate, CER is character error rate, and RTF is real-time factor. Offline transcription focuses on final WER/CER, while real-time interaction also depends on first-token latency, stability, endpointing, and noise robustness.",
                ja: "WER は単語誤り率、CER は文字誤り率、RTF はリアルタイム係数です。オフライン文字起こしでは最終 WER/CER を重視し、リアルタイム対話では首字遅延、安定性、エンドポイント検出、ノイズ耐性も重要です。",
                ko: "WER는 단어 오류율, CER는 문자 오류율, RTF는 실시간 계수입니다. 오프라인 전사는 최종 WER/CER을 더 중시하지만 실시간 상호작용에서는 첫 토큰 지연, 안정성, 엔드포인트 검출과 잡음 강건성도 중요합니다."
              }
            }
          ],
          keyConcepts: [
            { zh: "ASR 的核心不是“采样点到文字”的直接映射，而是把短时声学模式逐步抽象成 token 序列。", en: "ASR is not a direct sample-to-word mapping; it gradually abstracts short-time acoustic patterns into token sequences.", ja: "ASR の核心は「サンプルから文字」への直接対応ではなく、短時間の音響パターンを段階的に token 列へ抽象化することです。", ko: "ASR의 핵심은 ‘샘플에서 단어’로 직접 매핑하는 것이 아니라 짧은 시간의 음향 패턴을 점차 token 시퀀스로 추상화하는 것입니다." },
            { zh: "离线 ASR 可利用更长上下文和更复杂解码，流式 ASR 更重视首字延迟、增量稳定性和临时结果回滚。", en: "Offline ASR can use longer context and heavier decoding, while streaming ASR prioritizes first-token latency, incremental stability, and partial-result rollback.", ja: "オフライン ASR は長い文脈と複雑なデコードを使えますが、ストリーミング ASR は首字遅延、増分結果の安定性、仮結果のロールバックを重視します。", ko: "오프라인 ASR은 더 긴 문맥과 복잡한 디코딩을 사용할 수 있지만 스트리밍 ASR은 첫 토큰 지연, 증분 안정성과 임시 결과 롤백을 더 중시합니다." },
            { zh: "声学模型解决“听起来像什么”，语言上下文和解码器解决“这句话更可能是什么”。", en: "Acoustic models answer what the sound resembles, while language context and decoding answer what sentence is most plausible.", ja: "音響モデルは「何に聞こえるか」を扱い、言語コンテキストとデコーダーは「どの文が最もありそうか」を決めます。", ko: "음향 모델은 ‘무엇처럼 들리는가’를 해결하고 언어 문맥과 디코더는 ‘어떤 문장이 가장 가능성이 높은가’를 결정합니다." },
            { zh: "WER、CER、RTF、首字延迟、端点检测、热词召回和噪声鲁棒性需要一起评估。", en: "WER, CER, RTF, first-token latency, endpointing, hotword recall, and noise robustness need to be evaluated together.", ja: "WER、CER、RTF、首字遅延、エンドポイント検出、ホットワード再現率、ノイズ耐性をまとめて評価する必要があります。", ko: "WER, CER, RTF, 첫 토큰 지연, 엔드포인트 검출, 핫워드 재현율과 잡음 강건성을 함께 평가해야 합니다." },
            { zh: "唤醒词、标点恢复、数字格式化、时间戳和说话人分离常与 ASR 组成完整语音入口。", en: "Wake words, punctuation restoration, number formatting, timestamps, and speaker diarization often combine with ASR to form a complete voice interface.", ja: "ウェイクワード、句読点復元、数値整形、タイムスタンプ、話者分離は ASR と組み合わされ、完全な音声入口を構成することが多いです。", ko: "웨이크 워드, 구두점 복원, 숫자 형식화, 타임스탬프와 화자 분리는 ASR과 함께 완전한 음성 인터페이스를 구성하는 경우가 많습니다." },
            { zh: "ASR 输出的是语言内容，不负责判断玻璃破碎、狗叫声这类非语音事件；这些属于声音事件识别。", en: "ASR outputs language content and does not classify non-speech events such as glass breaks or dog barks; those belong to sound event detection.", ja: "ASR が出力するのは言語内容であり、ガラスが割れる音や犬の鳴き声など非音声イベントの分類は担当しません。それらは音響イベント認識の領域です。", ko: "ASR은 언어 콘텐츠를 출력하며 유리 파손이나 개 짖음 같은 비음성 이벤트를 분류하지 않습니다. 이는 소리 이벤트 인식의 영역입니다." }
          ],
          lab: {
            type: "ai-audio",
            initialMode: "asr",
            title: { zh: "语音识别 ASR 实验室", en: "Speech Recognition ASR Lab", ja: "音声認識 ASR ラボ", ko: "음성 인식 ASR 실험실" },
            description: {
              zh: "进入独立文章界面，理解语音从 PCM、特征、Encoder、CTC/RNNT 到文本后处理的流程。",
              en: "Open an independent article page explaining speech from PCM, features, encoder, CTC/RNNT, and text post-processing.",
              ja: "独立した記事ページで、PCM、特徴、Encoder、CTC/RNNT からテキスト後処理までの音声認識フローを理解します。",
              ko: "독립 문서 페이지에서 PCM, 특징, Encoder, CTC/RNNT부터 텍스트 후처리까지 음성 인식 흐름을 이해합니다."
            },
            buttonLabel: { zh: "打开语音识别 ASR 实验室", en: "Open speech recognition ASR lab", ja: "音声認識 ASR ラボを開く", ko: "음성 인식 ASR 실험실 열기" }
          },
          misconception: {
            zh: "识别率高不等于在所有噪声、口音和设备上都稳定；真实产品还要验证远场、多人、打断、专有名词和隐私边界。",
            en: "High recognition accuracy does not mean stable behavior across all noise, accents, and devices; real products must also validate far-field use, multiple speakers, interruptions, proper nouns, and privacy boundaries.",
            ja: "認識率が高くても、あらゆるノイズ、アクセント、デバイスで安定するとは限りません。実製品では遠距離音声、複数話者、割り込み、固有名詞、プライバシー境界も検証する必要があります。",
            ko: "인식률이 높다고 모든 잡음, 억양과 장치에서 안정적이라는 뜻은 아닙니다. 실제 제품은 원거리 음성, 여러 화자, 끼어들기, 고유명사와 개인정보 경계도 검증해야 합니다."
          },
          contentDirection: {
            zh: "适合扩展为从波形到文字的流程图，并加入流式字幕、会议纪要和车载语音三个应用案例。",
            en: "This can become a waveform-to-text pipeline diagram with examples for live captions, meeting notes, and in-car voice control.",
            ja: "波形から文字までのフロー図へ発展させ、ライブ字幕、会議議事録、車載音声操作の3つの応用例を加えられます。",
            ko: "파형에서 텍스트까지의 처리 흐름 도해로 확장하고 실시간 자막, 회의록과 차량 음성 제어 사례를 추가할 수 있습니다."
          }
        }
      },
      {
        title: { zh: "语音合成 TTS", en: "Text-to-Speech TTS", ja: "音声合成 TTS", ko: "음성 합성 TTS" },
        summary: {
          zh: "说明文本转语音、声学模型、声码器、多音色和情感语音。",
          en: "Explain text-to-speech, acoustic models, vocoders, multi-speaker voices, and expressive speech.",
          ja: "テキスト音声合成、音響モデル、ボコーダー、複数話者、表現豊かな音声を説明します。",
          ko: "텍스트 음성 합성, 음향 모델, 보코더, 다중 화자 음성과 표현력 있는 음성을 설명합니다."
        },
        bullets: [
          { zh: "声学模型与声码器", en: "Acoustic models and vocoders", ja: "音響モデルとボコーダー", ko: "음향 모델과 보코더" },
          { zh: "多音色、情感语音", en: "Multi-speaker and expressive speech", ja: "複数話者と表現音声", ko: "다중 화자와 표현력 있는 음성" },
          { zh: "实时 TTS 与高保真 TTS", en: "Real-time and high-fidelity TTS", ja: "リアルタイム TTS と高忠実度 TTS", ko: "실시간 TTS와 고충실도 TTS" }
        ],
        detail: {
          explanation: {
            zh: "语音合成把文本转换成自然语音。\n\n现代 TTS 通常先处理文本、读音和韵律，再由声学模型生成声学表示，最后通过声码器输出波形，可用于导航、客服、播客、配音和无障碍阅读。",
            en: "Text-to-speech converts text into natural speech.\n\nModern TTS usually normalizes text, predicts pronunciation and prosody, generates acoustic representations, and uses a vocoder to output waveforms for navigation, support, podcasts, dubbing, and accessibility.",
            ja: "音声合成はテキストを自然な音声へ変換します。\n\n現代の TTS は通常、テキスト、発音、韻律を処理し、音響モデルで音響表現を生成し、ボコーダーで波形を出力します。ナビゲーション、カスタマーサポート、ポッドキャスト、吹き替え、アクセシビリティに利用できます。",
            ko: "음성 합성은 텍스트를 자연스러운 음성으로 변환합니다.\n\n현대 TTS는 보통 텍스트, 발음과 운율을 처리한 뒤 음향 모델로 음향 표현을 생성하고 보코더로 파형을 출력합니다. 내비게이션, 고객 지원, 팟캐스트, 더빙과 접근성 기능에 사용할 수 있습니다."
          },
          termExplanations: [
            {
              name: { zh: "文本规范化", en: "Text normalization", ja: "テキスト正規化", ko: "텍스트 정규화" },
              explanation: {
                zh: "把 2026、3.5V、USB、kg 等文本转成可朗读的形式。规范化错误会让语音听起来像读错数字或单位。",
                en: "Converts text such as 2026, 3.5V, USB, or kg into speakable forms. Errors here sound like wrong numbers or units.",
                ja: "2026、3.5V、USB、kg などのテキストを読み上げ可能な形へ変換します。ここを誤ると数字や単位の読み間違いとして聞こえます。",
                ko: "2026, 3.5V, USB, kg 같은 텍스트를 읽을 수 있는 형태로 변환합니다. 여기서 오류가 나면 숫자나 단위를 잘못 읽는 것처럼 들립니다."
              }
            },
            {
              name: { zh: "韵律预测", en: "Prosody prediction", ja: "韻律予測", ko: "운율 예측" },
              explanation: {
                zh: "预测停顿、重音、语速和语调。它决定一句话像机械朗读，还是像自然表达。",
                en: "Predicts pauses, stress, speed, and intonation. It decides whether a sentence sounds mechanical or naturally expressed.",
                ja: "ポーズ、アクセント、速度、イントネーションを予測します。文が機械的に聞こえるか自然に表現されるかを左右します。",
                ko: "쉼, 강세, 속도와 억양을 예측합니다. 문장이 기계적으로 들릴지 자연스럽게 표현될지를 결정합니다."
              }
            },
            {
              name: { zh: "神经声码器", en: "Neural vocoder", ja: "ニューラルボコーダー", ko: "신경 보코더" },
              explanation: {
                zh: "把梅尔谱、codec token 或其他声学表示还原成波形。声码器直接影响音质、实时性和端侧算力需求。",
                en: "Turns mel spectrograms, codec tokens, or other acoustic representations into waveform audio, directly affecting quality, latency, and edge compute.",
                ja: "Mel スペクトログラム、Codec token、その他の音響表現を波形音声へ戻します。ボコーダーは音質、リアルタイム性、エッジ側の計算量に直接影響します。",
                ko: "Mel 스펙트로그램, 코덱 token 또는 다른 음향 표현을 파형 오디오로 복원합니다. 보코더는 음질, 실시간성과 엣지 연산량에 직접 영향을 줍니다."
              }
            }
          ],
          keyConcepts: [
            { zh: "文本规范化负责把数字、日期、单位和缩写转换成可朗读形式。", en: "Text normalization converts numbers, dates, units, and abbreviations into speakable forms.", ja: "テキスト正規化は数字、日付、単位、略語を読み上げ可能な形へ変換します。", ko: "텍스트 정규화는 숫자, 날짜, 단위와 약어를 읽을 수 있는 형태로 변환합니다." },
            { zh: "韵律包含停顿、重音、语速和语调，决定语音是否自然。", en: "Prosody includes pauses, stress, speed, and intonation, which strongly shape naturalness.", ja: "韻律にはポーズ、アクセント、速度、イントネーションが含まれ、自然さを大きく左右します。", ko: "운율에는 쉼, 강세, 속도와 억양이 포함되며 자연스러움을 크게 좌우합니다." },
            { zh: "声码器把声学特征转换成最终波形，影响音质、速度和设备成本。", en: "The vocoder converts acoustic features into the final waveform and affects quality, speed, and device cost.", ja: "ボコーダーは音響特徴を最終波形へ変換し、音質、速度、デバイスコストに影響します。", ko: "보코더는 음향 특징을 최종 파형으로 변환하며 음질, 속도와 장치 비용에 영향을 줍니다." },
            { zh: "TTS 生成的是可听语音，不等同于音乐/音效生成；它更关注可懂度、自然度、音色一致性和延迟。", en: "TTS generates intelligible speech rather than music or sound effects; it focuses more on intelligibility, naturalness, voice consistency, and latency.", ja: "TTS は音楽や効果音ではなく理解可能な音声を生成し、明瞭度、自然さ、声色の一貫性、遅延を重視します。", ko: "TTS는 음악이나 효과음이 아니라 이해 가능한 음성을 생성하며 명료도, 자연스러움, 음색 일관성과 지연에 더 집중합니다." }
          ],
          lab: {
            type: "ai-audio",
            initialMode: "tts",
            title: { zh: "语音合成 TTS 实验室", en: "Text-to-Speech TTS Lab", ja: "音声合成 TTS ラボ", ko: "음성 합성 TTS 실험실" },
            description: {
              zh: "进入独立文章界面，理解文本规范化、韵律预测、声学模型和神经声码器如何生成语音。",
              en: "Open an independent article page explaining how text normalization, prosody prediction, acoustic models, and neural vocoders generate speech.",
              ja: "独立した記事ページで、テキスト正規化、韻律予測、音響モデル、ニューラルボコーダーが音声を生成する仕組みを理解します。",
              ko: "독립 문서 페이지에서 텍스트 정규화, 운율 예측, 음향 모델과 신경망 보코더가 음성을 생성하는 방식을 이해합니다."
            },
            buttonLabel: { zh: "打开语音合成 TTS 实验室", en: "Open text-to-speech TTS lab", ja: "音声合成 TTS ラボを開く", ko: "음성 합성 TTS 실험실 열기" }
          },
          misconception: {
            zh: "音色像真人不代表表达自然；断句、重音、情绪、上下文理解和长文本稳定性同样决定体验。",
            en: "A realistic voice timbre does not guarantee natural expression; phrasing, stress, emotion, context, and long-form stability also define the experience.",
            ja: "声色が人間らしくても表現が自然とは限りません。区切り、アクセント、感情、文脈理解、長文での安定性も体験を決めます。",
            ko: "음색이 사람처럼 들린다고 표현이 자연스러운 것은 아닙니다. 구절 나누기, 강세, 감정, 문맥 이해와 긴 텍스트의 안정성도 경험을 결정합니다."
          },
          contentDirection: {
            zh: "适合做文本到波形的模块图，并用同一句话的不同语速、情绪和停顿展示韵律作用。",
            en: "This fits a text-to-waveform module diagram and examples showing how speed, emotion, and pauses change the same sentence.",
            ja: "テキストから波形までのモジュール図を作り、同じ文を異なる速度、感情、ポーズで読んで韻律の働きを示せます。",
            ko: "텍스트에서 파형까지의 모듈 도해를 만들고 같은 문장을 다른 속도, 감정과 쉼으로 표현해 운율의 역할을 보여 줄 수 있습니다."
          }
        }
      },
      {
        title: { zh: "音频生成", en: "Audio Generation", ja: "音声生成", ko: "오디오 생성" },
        summary: {
          zh: "覆盖音乐生成、音效生成、声音克隆、音频修复和版权风险。",
          en: "Cover music generation, sound effects, voice cloning, audio restoration, and copyright risks.",
          ja: "音楽生成、効果音生成、声のクローン、音声修復、著作権リスクを扱います。",
          ko: "음악 생성, 효과음 생성, 음성 복제, 오디오 복원과 저작권 위험을 다룹니다."
        },
        bullets: [
          { zh: "音乐与音效生成", en: "Music and sound generation", ja: "音楽と効果音の生成", ko: "음악과 효과음 생성" },
          { zh: "声音克隆", en: "Voice cloning", ja: "声のクローン", ko: "음성 복제" },
          { zh: "隐私、版权与安全边界", en: "Privacy, copyright, and safety boundaries", ja: "プライバシー、著作権、安全の境界", ko: "개인정보, 저작권과 안전 경계" }
        ],
        detail: {
          explanation: {
            zh: "音频生成使用 AI 根据文本、旋律、参考声音或视频画面生成新的音乐、音效、人声或环境声。\n\n它能提升内容生产效率，但也需要处理可控性、版权、身份冒用和质量一致性问题。",
            en: "Audio generation uses AI to create music, sound effects, voices, or ambience from text, melody, reference audio, or video.\n\nIt can speed up content creation, but it also raises control, copyright, impersonation, and consistency challenges.",
            ja: "音声生成は、テキスト、メロディー、参照音声、映像から AI で新しい音楽、効果音、声、環境音を作ります。\n\nコンテンツ制作を効率化できますが、制御性、著作権、なりすまし、品質の一貫性という課題にも向き合う必要があります。",
            ko: "오디오 생성은 텍스트, 멜로디, 참조 음성 또는 영상에서 AI로 새로운 음악, 효과음, 목소리와 환경음을 만듭니다.\n\n콘텐츠 제작을 빠르게 할 수 있지만 제어 가능성, 저작권, 사칭과 품질 일관성 문제도 해결해야 합니다."
          },
          termExplanations: [
            {
              name: { zh: "条件控制", en: "Conditioning", ja: "条件付け", ko: "조건 제어" },
              explanation: {
                zh: "条件可以是文本、旋律、节拍、风格标签、参考音色或视频画面。条件越清楚，模型越容易生成符合目标的声音。",
                en: "Conditioning can be text, melody, tempo, style tags, reference timbre, or video. Clearer conditioning makes the generated audio easier to steer.",
                ja: "条件はテキスト、メロディー、テンポ、スタイルタグ、参照音色、映像などです。条件が明確なほど、モデルは目的に合う音を生成しやすくなります。",
                ko: "조건은 텍스트, 멜로디, 템포, 스타일 태그, 참조 음색이나 영상일 수 있습니다. 조건이 명확할수록 모델이 목표에 맞는 오디오를 생성하기 쉽습니다."
              }
            },
            {
              name: { zh: "扩散 / Transformer", en: "Diffusion / Transformer", ja: "拡散モデル / Transformer", ko: "확산 모델 / Transformer" },
              explanation: {
                zh: "扩散模型常把噪声逐步还原成音频表示；Transformer 常把音频 token 当序列生成。不同模型在质量、速度和可控性上取舍不同。",
                en: "Diffusion models often denoise audio representations step by step; Transformers often generate audio tokens as sequences. They trade quality, speed, and controllability differently.",
                ja: "拡散モデルはノイズを段階的に音声表現へ戻し、Transformer は音声 token を系列として生成することが多いです。モデルごとに品質、速度、制御性のトレードオフが異なります。",
                ko: "확산 모델은 잡음을 단계적으로 오디오 표현으로 되돌리고 Transformer는 오디오 token을 시퀀스로 생성하는 경우가 많습니다. 모델마다 품질, 속도와 제어 가능성의 절충이 다릅니다."
              }
            },
            {
              name: { zh: "声音克隆", en: "Voice cloning", ja: "音声クローン", ko: "음성 복제" },
              explanation: {
                zh: "用少量参考音频学习或匹配某个音色。产品中必须处理授权、身份验证、水印和滥用检测。",
                en: "Matches a voice from a small reference sample. Products must handle consent, identity checks, watermarking, and abuse detection.",
                ja: "少量の参照音声から声色を学習または照合します。製品では同意、本人確認、電子透かし、悪用検知を扱う必要があります。",
                ko: "소량의 참조 음성에서 음색을 학습하거나 매칭합니다. 제품에서는 동의, 신원 확인, 워터마킹과 악용 탐지를 처리해야 합니다."
              }
            }
          ],
          keyConcepts: [
            { zh: "条件控制决定生成结果如何响应文本、风格、节奏、旋律或参考音色。", en: "Conditioning determines how generation responds to text, style, rhythm, melody, or reference timbre.", ja: "条件制御は、生成結果がテキスト、スタイル、リズム、メロディー、参照音色へどう反応するかを決めます。", ko: "조건 제어는 생성 결과가 텍스트, 스타일, 리듬, 멜로디 또는 참조 음색에 어떻게 반응할지를 결정합니다." },
            { zh: "扩散、Transformer、神经声码器等方法常用于不同粒度的音频生成。", en: "Diffusion models, Transformers, neural vocoders, and related methods are used at different audio granularities.", ja: "拡散モデル、Transformer、ニューラルボコーダーなどは、異なる粒度の音声生成に使われます。", ko: "확산 모델, Transformer와 신경망 보코더 같은 방법은 서로 다른 오디오 단위의 생성에 사용됩니다." },
            { zh: "水印、授权数据和滥用检测是生成式音频产品的重要安全环节。", en: "Watermarking, licensed data, and abuse detection are important safety layers for generative audio products.", ja: "電子透かし、許諾済みデータ、悪用検知は生成音声製品の重要な安全層です。", ko: "워터마킹, 허가된 데이터와 악용 탐지는 생성 오디오 제품의 중요한 안전 계층입니다." },
            { zh: "生成式音频的目标是创造新内容，和 ASR 的识别、TTS 的朗读、事件识别的分类目标不同。", en: "Generative audio creates new content, which differs from ASR recognition, TTS reading, and event-classification goals.", ja: "生成音声の目標は新しいコンテンツを作ることで、ASR の認識、TTS の読み上げ、イベント認識の分類とは異なります。", ko: "생성 오디오의 목표는 새로운 콘텐츠를 만드는 것이며 ASR 인식, TTS 낭독, 이벤트 분류의 목표와 다릅니다." }
          ],
          lab: {
            type: "ai-audio",
            initialMode: "generation",
            title: { zh: "音频生成实验室", en: "Audio Generation Lab", ja: "音声生成ラボ", ko: "오디오 생성 실험실" },
            description: {
              zh: "进入独立文章界面，理解文本、旋律、参考音色和生成模型如何产生音乐、音效、人声和环境声。",
              en: "Open an independent article page explaining how text, melody, reference timbre, and generative models create music, effects, voices, and ambience.",
              ja: "独立した記事ページで、テキスト、メロディー、参照音色、生成モデルが音楽、効果音、声、環境音を作る仕組みを理解します。",
              ko: "독립 문서 페이지에서 텍스트, 멜로디, 참조 음색과 생성 모델이 음악, 효과음, 목소리와 환경음을 만드는 방식을 이해합니다."
            },
            buttonLabel: { zh: "打开音频生成实验室", en: "Open audio generation lab", ja: "音声生成ラボを開く", ko: "오디오 생성 실험실 열기" }
          },
          misconception: {
            zh: "AI 生成内容不天然等于可商用或可控；训练数据来源、相似性、声音授权和平台规则都需要确认。",
            en: "AI-generated audio is not automatically commercial-safe or controllable; training data, similarity, voice consent, and platform rules must be checked.",
            ja: "AI 生成音声が自動的に商用利用可能、または制御可能になるわけではありません。学習データの出所、類似性、声の同意、プラットフォーム規則を確認する必要があります。",
            ko: "AI 생성 오디오가 자동으로 상업적으로 안전하거나 제어 가능한 것은 아닙니다. 학습 데이터 출처, 유사성, 음성 동의와 플랫폼 규칙을 확인해야 합니다."
          },
          contentDirection: {
            zh: "适合做生成式音频应用地图，分别讲音乐、音效、声音克隆、修复和自动配乐的边界。",
            en: "This can become a generative-audio application map covering music, sound effects, voice cloning, restoration, and automatic scoring.",
            ja: "音楽、効果音、声のクローン、修復、自動作曲における境界を説明する生成音声アプリケーションマップへ発展できます。",
            ko: "음악, 효과음, 음성 복제, 복원과 자동 작곡의 경계를 설명하는 생성 오디오 애플리케이션 맵으로 확장할 수 있습니다."
          }
        }
      },
      {
        title: { zh: "AI 音频事件识别", en: "AI Audio Event Detection", ja: "AI 音響イベント認識", ko: "AI 오디오 이벤트 인식" },
        summary: {
          zh: "识别哭声、玻璃破碎、狗叫声、警报声等非语音事件。",
          en: "Detect non-speech events such as baby cries, glass breaks, dog barks, and alarms.",
          ja: "泣き声、ガラスが割れる音、犬の鳴き声、警報などの非音声イベントを認識します。",
          ko: "울음소리, 유리 파손, 개 짖음과 경보 같은 비음성 이벤트를 감지합니다."
        },
        bullets: [
          { zh: "声音事件分类", en: "Sound event classification", ja: "音響イベント分類", ko: "소리 이벤트 분류" },
          { zh: "连续监听与误报控制", en: "Continuous listening and false-alarm control", ja: "常時リスニングと誤検知制御", ko: "연속 청취와 오탐 제어" },
          { zh: "安防、看护、车载与 IoT", en: "Security, care, automotive, and IoT", ja: "セキュリティ、見守り、車載、IoT", ko: "보안, 돌봄, 차량과 IoT" }
        ],
        detail: {
          explanation: {
            zh: "AI 音频事件识别关注“发生了什么声音”，而不是“说了什么话”。\n\n系统通常把 PCM 变成梅尔谱、log-mel 特征或 learned embedding，再用分类模型判断哭声、玻璃破碎、狗叫声、烟雾报警器、门铃、枪声、碰撞声等事件，并输出时间范围和置信度。",
            en: "AI audio event detection asks what sound happened, not what words were spoken.\n\nA system usually converts PCM into mel spectrograms, log-mel features, or learned embeddings, then uses a classifier to detect events such as baby cries, glass breaks, dog barks, smoke alarms, doorbells, gunshots, or impacts with timestamps and confidence.",
            ja: "AI 音響イベント認識は「何を話したか」ではなく「どんな音が起きたか」に注目します。\n\nシステムは通常、PCM を Mel スペクトル、log-mel 特徴、学習型 embedding に変換し、分類モデルで泣き声、ガラスの破損、犬の鳴き声、煙警報器、ドアベル、銃声、衝撃などを判定し、時間範囲と信頼度を出力します。",
            ko: "AI 오디오 이벤트 인식은 ‘무슨 말을 했는가’가 아니라 ‘어떤 소리가 발생했는가’를 묻습니다.\n\n시스템은 보통 PCM을 Mel 스펙트럼, log-mel 특징 또는 학습형 embedding으로 변환한 뒤 분류 모델로 울음소리, 유리 파손, 개 짖음, 연기 경보기, 초인종, 총성이나 충격 같은 이벤트를 타임스탬프와 신뢰도로 감지합니다."
          },
          termExplanations: [
            {
              name: { zh: "声音事件分类", en: "Sound event classification", ja: "音響イベント分類", ko: "음향 이벤트 분류" },
              explanation: {
                zh: "给一段音频打标签，例如“哭声”“狗叫声”“玻璃破碎”。如果还要标出发生时间，就接近声音事件检测 SED。",
                en: "Assigns labels to an audio segment, such as baby cry, dog bark, or glass break. If it also marks time ranges, it becomes closer to sound event detection.",
                ja: "音声区間へ「泣き声」「犬の鳴き声」「ガラス破損」などのラベルを付けます。発生時間も示すなら、音響イベント検出 SED に近くなります。",
                ko: "오디오 구간에 ‘울음소리’, ‘개 짖음’, ‘유리 파손’ 같은 라벨을 붙입니다. 발생 시간까지 표시하면 소리 이벤트 검출 SED에 가까워집니다."
              }
            },
            {
              name: { zh: "置信度阈值", en: "Confidence threshold", ja: "信頼度しきい値", ko: "신뢰도 임계값" },
              explanation: {
                zh: "阈值越低越容易触发，但误报更多；阈值越高误报减少，但可能漏掉较弱或被噪声遮挡的事件。",
                en: "A lower threshold triggers more easily but raises false alarms; a higher threshold reduces false alarms but may miss quiet or masked events.",
                ja: "しきい値が低いほどトリガーしやすい一方、誤検知が増えます。高くすると誤検知は減りますが、弱い音やノイズに隠れたイベントを見逃すことがあります。",
                ko: "임계값이 낮으면 쉽게 트리거되지만 오탐이 늘고 임계값이 높으면 오탐은 줄지만 작은 소리나 잡음에 가려진 이벤트를 놓칠 수 있습니다."
              }
            },
            {
              name: { zh: "边缘监听", en: "Edge listening", ja: "エッジリスニング", ko: "엣지 리스닝" },
              explanation: {
                zh: "摄像头、门铃、婴儿看护器和车机常在本地跑小模型，只有命中事件或用户授权时才上传片段，降低延迟和隐私风险。",
                en: "Cameras, doorbells, baby monitors, and vehicles often run small local models and upload clips only on events or with consent, reducing latency and privacy risk.",
                ja: "カメラ、ドアベル、ベビーモニター、車載機器は小型モデルをローカルで動かし、イベント発生時や同意がある場合だけクリップをアップロードすることが多く、遅延とプライバシーリスクを下げます。",
                ko: "카메라, 초인종, 베이비 모니터와 차량은 소형 모델을 로컬에서 실행하고 이벤트가 감지되거나 사용자가 동의한 경우에만 클립을 업로드해 지연과 개인정보 위험을 줄이는 경우가 많습니다."
              }
            }
          ],
          keyConcepts: [
            { zh: "事件识别通常不是 ASR：哭声、玻璃破碎、狗叫声没有明确文字内容，但仍有可学习的频谱和时间模式。", en: "Event recognition is usually not ASR: baby cries, glass breaks, and dog barks have no clear words, but they still have learnable spectral and temporal patterns.", ja: "イベント認識は通常 ASR ではありません。泣き声、ガラス破損、犬の鳴き声に明確な文字内容はありませんが、学習可能なスペクトルと時間パターンがあります。", ko: "이벤트 인식은 보통 ASR이 아닙니다. 울음소리, 유리 파손과 개 짖음에는 명확한 문자 내용이 없지만 학습 가능한 스펙트럼과 시간 패턴은 있습니다." },
            { zh: "短促事件要关注时间分辨率和触发延迟，持续事件要关注起止边界和重复告警策略。", en: "Short events need time resolution and trigger latency; sustained events need onset/offset boundaries and repeated-alert strategy.", ja: "短いイベントでは時間分解能とトリガー遅延、持続するイベントでは開始・終了境界と繰り返し警告の戦略が重要です。", ko: "짧은 이벤트는 시간 해상도와 트리거 지연, 지속 이벤트는 시작/종료 경계와 반복 경보 전략을 살펴야 합니다." },
            { zh: "模型准确率必须和误报、漏报、场景噪声、设备麦克风位置一起评估。", en: "Model accuracy must be evaluated together with false alarms, misses, scene noise, and microphone placement.", ja: "モデル精度は誤検知、見逃し、環境ノイズ、機器のマイク位置と合わせて評価する必要があります。", ko: "모델 정확도는 오탐, 미탐, 환경 잡음과 장치 마이크 위치를 함께 평가해야 합니다." },
            { zh: "常见产品会把唤醒词、事件识别和本地隐私策略组合，而不是把所有原始音频长期上传。", en: "Products often combine wake words, event detection, and local privacy policy instead of uploading raw audio continuously.", ja: "一般的な製品はウェイクワード、イベント認識、ローカルのプライバシーポリシーを組み合わせ、すべての生音声を常時アップロードすることは避けます。", ko: "일반적인 제품은 웨이크 워드, 이벤트 인식과 로컬 개인정보 정책을 결합하며 모든 원시 오디오를 계속 업로드하지는 않습니다." }
          ],
          lab: {
            type: "ai-audio",
            initialMode: "event",
            title: { zh: "AI 音频事件识别实验室", en: "AI Audio Event Detection Lab", ja: "AI 音響イベント認識ラボ", ko: "AI 오디오 이벤트 인식 실험실" },
            description: {
              zh: "进入独立文章界面，理解哭声、玻璃破碎、狗叫声等事件如何由频谱图和分类模型识别。",
              en: "Open an independent article page explaining how baby cries, glass breaks, dog barks, and related events are detected from spectrograms and classifiers.",
              ja: "独立した記事ページで、泣き声、ガラス破損、犬の鳴き声などをスペクトログラムと分類モデルから認識する仕組みを理解します。",
              ko: "독립 문서 페이지에서 울음소리, 유리 파손, 개 짖음 등의 이벤트를 스펙트로그램과 분류 모델로 감지하는 방식을 이해합니다."
            },
            buttonLabel: { zh: "打开 AI 音频事件识别实验室", en: "Open AI audio event detection lab", ja: "AI 音響イベント認識ラボを開く", ko: "AI 오디오 이벤트 인식 실험실 열기" }
          },
          misconception: {
            zh: "声音事件识别不是简单比音量大小。玻璃破碎可能很短但高频能量强，哭声有调制和谐波结构，狗叫声有重复脉冲；模型要看时间和频率模式。",
            en: "Sound event detection is not simple loudness matching. Glass breaks can be short with strong high-frequency energy, baby cries have modulation and harmonic structure, and dog barks have repeated pulses; models need temporal and spectral patterns.",
            ja: "音響イベント認識は単純な音量比較ではありません。ガラス破損は短くても高域エネルギーが強く、泣き声には変調と倍音構造があり、犬の鳴き声には反復パルスがあります。モデルは時間と周波数のパターンを見る必要があります。",
            ko: "소리 이벤트 인식은 단순히 음량을 비교하는 것이 아닙니다. 유리 파손은 짧지만 고주파 에너지가 강할 수 있고 울음소리에는 변조와 배음 구조가 있으며 개 짖음에는 반복 펄스가 있습니다. 모델은 시간과 주파수 패턴을 봐야 합니다."
          },
          contentDirection: {
            zh: "适合做事件识别实验室：用频谱块展示哭声、玻璃破碎、狗叫声的不同模式，并加入阈值、误报和边缘部署说明。",
            en: "This fits an event-detection lab showing different spectrogram patterns for baby cries, glass breaks, and dog barks, with threshold, false-alarm, and edge-deployment notes.",
            ja: "泣き声、ガラス破損、犬の鳴き声の異なるスペクトログラムパターンを示し、しきい値、誤検知、エッジデプロイの説明を加えるイベント認識ラボへ発展できます。",
            ko: "울음소리, 유리 파손과 개 짖음의 서로 다른 스펙트로그램 패턴을 보여 주고 임계값, 오탐과 엣지 배포 설명을 추가하는 이벤트 인식 실험실로 확장할 수 있습니다."
          }
        }
      },
      {
        title: { zh: "AI 音频增强", en: "AI Audio Enhancement", ja: "AI 音声強調", ko: "AI 오디오 향상" },
        summary: {
          zh: "说明 AI 降噪、去混响、语音分离、神经后滤波和模型部署。",
          en: "Explain AI denoising, dereverberation, speech separation, neural post-filters, and deployment.",
          ja: "AI ノイズ低減、残響除去、音声分離、ニューラルポストフィルター、モデルデプロイを説明します。",
          ko: "AI 잡음 제거, 잔향 제거, 음성 분리, 신경망 후처리 필터와 모델 배포를 설명합니다."
        },
        bullets: [
          { zh: "AI 降噪与语音保真", en: "AI denoising and speech preservation", ja: "AI ノイズ低減と音声の忠実度", ko: "AI 잡음 제거와 음성 보존" },
          { zh: "语音分离、去混响", en: "Speech separation and dereverberation", ja: "音声分離と残響除去", ko: "음성 분리와 잔향 제거" },
          { zh: "端侧模型、延迟和算力", en: "Edge models, latency, and compute", ja: "エッジモデル、遅延、計算量", ko: "엣지 모델, 지연과 연산량" }
        ],
        detail: {
          explanation: {
            zh: "AI 音频增强把带噪、混响或多人叠加的音频输入神经网络，让模型估计干净语音、目标声源或频谱掩蔽。\n\n它常用于会议、耳机、直播、助听、车载和短视频处理。和传统 DSP 的固定滤波不同，AI 增强依赖训练数据学习噪声、语音和房间模式，但也可能引入音乐噪声、语音发闷、断字和过度抑制。",
            en: "AI audio enhancement feeds noisy, reverberant, or overlapping audio into neural networks so the model can estimate clean speech, a target source, or a spectral mask.\n\nIt is common in conferencing, headsets, live streaming, hearing assistance, cars, and short-video processing. Unlike fixed traditional DSP filters, AI enhancement learns noise, speech, and room patterns from data, but can introduce artifacts such as musical noise, muffled speech, clipped words, or over-suppression.",
            ja: "AI 音声強調は、ノイズ、残響、複数話者が重なった音声をニューラルネットワークへ入力し、モデルにクリーン音声、目標音源、スペクトルマスクを推定させます。\n\n会議、ヘッドセット、ライブ配信、補聴、車載、短編動画処理でよく使われます。固定フィルター中心の従来 DSP と異なり、AI 強調はデータからノイズ、音声、部屋のパターンを学びますが、ミュージカルノイズ、こもり、語切れ、過抑制などのアーティファクトを生む可能性もあります。",
            ko: "AI 오디오 향상은 잡음, 잔향 또는 여러 화자가 겹친 오디오를 신경망에 입력해 모델이 깨끗한 음성, 목표 음원이나 스펙트럼 마스크를 추정하도록 합니다.\n\n회의, 헤드셋, 라이브 스트리밍, 보청, 차량과 숏폼 영상 처리에서 흔히 사용합니다. 고정 필터 중심의 전통 DSP와 달리 AI 향상은 데이터에서 잡음, 음성과 공간 패턴을 학습하지만 음악성 잡음, 먹먹한 음성, 단어 잘림이나 과도한 억제 같은 아티팩트를 만들 수도 있습니다."
          },
          termExplanations: [
            {
              name: { zh: "神经降噪", en: "Neural denoising", ja: "ニューラルノイズ除去", ko: "신경망 잡음 제거" },
              explanation: {
                zh: "模型估计每个时间频率区域中语音和噪声的占比，再保留语音、压低噪声。强降噪会降低底噪，但可能损伤辅音和空气感。",
                en: "The model estimates how much speech and noise exist in each time-frequency region, preserving speech while reducing noise. Strong denoising lowers background noise but may damage consonants and airiness.",
                ja: "モデルは各時間周波数領域に含まれる音声とノイズの割合を推定し、音声を残してノイズを抑えます。強いノイズ低減は背景ノイズを下げますが、子音や空気感を損なうことがあります。",
                ko: "모델은 각 시간-주파수 영역의 음성과 잡음 비율을 추정해 음성을 보존하면서 잡음을 줄입니다. 강한 잡음 제거는 배경 잡음을 낮추지만 자음과 공기감을 손상할 수 있습니다."
              }
            },
            {
              name: { zh: "语音分离", en: "Speech separation", ja: "音声分離", ko: "음성 분리" },
              explanation: {
                zh: "从重叠说话或背景人声中分离目标说话人。它比普通降噪更难，因为干扰源也是语音。",
                en: "Separates a target speaker from overlapping speech or background voices. It is harder than ordinary denoising because the interference is also speech.",
                ja: "重なった会話や背景の声から目標話者を分離します。干渉源も音声なので、通常のノイズ低減より難しい処理です。",
                ko: "겹쳐 말하는 음성이나 배경 화자에서 목표 화자를 분리합니다. 간섭원도 음성이므로 일반적인 잡음 제거보다 어렵습니다."
              }
            },
            {
              name: { zh: "神经后滤波", en: "Neural post-filter", ja: "ニューラルポストフィルター", ko: "신경망 후처리 필터" },
              explanation: {
                zh: "在传统 AEC/NS/AGC 之后再用小模型修补残留噪声、回声和音色损伤，是很多实时产品折中质量和算力的方式。",
                en: "A small model after traditional AEC/NS/AGC can clean residual noise, echo, and timbre damage, which is a common compromise between quality and compute.",
                ja: "従来の AEC/NS/AGC の後段に小型モデルを置いて残留ノイズ、エコー、音色の損傷を補修します。多くのリアルタイム製品で品質と計算量を両立する方法です。",
                ko: "전통적인 AEC/NS/AGC 뒤에 소형 모델을 배치해 남은 잡음, 에코와 음색 손상을 정리하는 방식으로 많은 실시간 제품에서 품질과 연산량을 절충합니다."
              }
            }
          ],
          keyConcepts: [
            { zh: "AI 增强应和语音增强卡片区分：传统语音增强讲 AEC/AGC/ANR/Beamforming 的工程链路，这里重点讲学习型模型如何估计掩蔽、目标语音或残差信号。", en: "AI enhancement should be separated from the speech-enhancement card: traditional enhancement covers AEC/AGC/ANR/beamforming engineering chains, while this card focuses on learned models estimating masks, target speech, or residual signals.", ja: "AI 強調は音声強調カードと区別します。従来の音声強調は AEC/AGC/ANR/Beamforming の工学的経路を扱い、こちらは学習モデルがマスク、目標音声、残差信号を推定する方法に重点を置きます。", ko: "AI 향상은 음성 향상 카드와 구분해야 합니다. 전통 음성 향상은 AEC/AGC/ANR/Beamforming 엔지니어링 경로를 다루고 여기서는 학습 모델이 마스크, 목표 음성이나 잔차 신호를 추정하는 방식에 중점을 둡니다." },
            { zh: "训练数据决定鲁棒性；模型没见过的噪声、口音、麦克风和房间会显著影响效果。", en: "Training data defines robustness; unseen noise, accents, microphones, and rooms can strongly affect results.", ja: "学習データがロバスト性を決めます。モデルが経験していないノイズ、アクセント、マイク、部屋は結果に大きく影響します。", ko: "학습 데이터가 강건성을 결정합니다. 모델이 보지 못한 잡음, 억양, 마이크와 공간은 결과에 큰 영향을 줍니다." },
            { zh: "端侧实时 AI 增强要同时满足帧长、模型大小、NPU/DSP/CPU 算力、功耗和隐私。", en: "Real-time edge AI enhancement must satisfy frame size, model size, NPU/DSP/CPU compute, power, and privacy constraints.", ja: "エッジのリアルタイム AI 強調は、フレーム長、モデルサイズ、NPU/DSP/CPU の計算量、消費電力、プライバシー制約を同時に満たす必要があります。", ko: "엣지 실시간 AI 향상은 프레임 길이, 모델 크기, NPU/DSP/CPU 연산, 전력과 개인정보 제약을 동시에 만족해야 합니다." },
            { zh: "评估不能只看降噪量，也要看语音可懂度、自然度、延迟、残留噪声和算法伪影。", en: "Evaluation cannot only measure noise reduction; it also needs intelligibility, naturalness, latency, residual noise, and artifacts.", ja: "評価はノイズ低減量だけでなく、音声の明瞭度、自然さ、遅延、残留ノイズ、アーティファクトも見る必要があります。", ko: "평가는 잡음 감소량만 볼 수 없고 음성 명료도, 자연스러움, 지연, 잔류 잡음과 아티팩트도 봐야 합니다." }
          ],
          lab: {
            type: "ai-audio",
            initialMode: "enhancement",
            title: { zh: "AI 音频增强实验室", en: "AI Audio Enhancement Lab", ja: "AI 音声強調ラボ", ko: "AI 오디오 향상 실험실" },
            description: {
              zh: "进入独立文章界面，理解 AI 降噪、语音分离、去混响和神经后滤波的基本链路。",
              en: "Open an independent article page explaining AI denoising, speech separation, dereverberation, and neural post-filtering.",
              ja: "独立した記事ページで、AI ノイズ低減、音声分離、残響除去、ニューラルポストフィルターの基本経路を理解します。",
              ko: "독립 문서 페이지에서 AI 잡음 제거, 음성 분리, 잔향 제거와 신경망 후처리 필터의 기본 경로를 이해합니다."
            },
            buttonLabel: { zh: "打开 AI 音频增强实验室", en: "Open AI audio enhancement lab", ja: "AI 音声強調ラボを開く", ko: "AI 오디오 향상 실험실 열기" }
          },
          misconception: {
            zh: "AI 降噪不是越强越好。过强的模型或参数可能把轻声、尾音、摩擦音当成噪声切掉，让语音听起来更干净但更不自然。",
            en: "AI denoising is not better just because it is stronger. Aggressive models or settings can remove soft speech, endings, and fricatives as if they were noise, making speech cleaner but less natural.",
            ja: "AI ノイズ低減は強いほど良いわけではありません。強すぎるモデルや設定は、弱い音声、語尾、摩擦音をノイズとして削り、音声をきれいにする一方で不自然にすることがあります。",
            ko: "AI 잡음 제거는 강할수록 좋은 것이 아닙니다. 과한 모델이나 설정은 작은 음성, 어미와 마찰음을 잡음으로 잘라 내 음성을 깨끗하게 만들지만 덜 자연스럽게 할 수 있습니다."
          },
          contentDirection: {
            zh: "适合做 AI 增强实验室：展示带噪波形、特征图、模型掩蔽、增强后波形和伪影风险，并和传统 AEC/NS 链路做边界说明。",
            en: "This fits an AI enhancement lab showing noisy waveform, feature map, model mask, enhanced waveform, and artifact risk, with clear boundaries from traditional AEC/NS pipelines.",
            ja: "ノイズ波形、特徴マップ、モデルマスク、強調後波形、アーティファクトのリスクを示し、従来の AEC/NS 経路との境界を説明する AI 強調ラボへ発展できます。",
            ko: "잡음 파형, 특징 맵, 모델 마스크, 향상 후 파형과 아티팩트 위험을 보여 주고 전통적인 AEC/NS 경계도 설명하는 AI 향상 실험실로 확장할 수 있습니다."
          }
        }
      },
      {
        title: { zh: "AI 音频编码", en: "AI Audio Coding", ja: "AI 音声符号化", ko: "AI 오디오 코딩" },
        summary: {
          zh: "介绍神经音频编码、语义 token、低码率语音和生成式重建。",
          en: "Introduce neural audio coding, semantic tokens, low-bitrate speech, and generative reconstruction.",
          ja: "ニューラル音声符号化、セマンティック token、低ビットレート音声、生成的再構成を紹介します。",
          ko: "신경망 오디오 코딩, 의미 token, 저비트레이트 음성과 생성적 복원을 소개합니다."
        },
        bullets: [
          { zh: "神经编码器 / 解码器", en: "Neural encoder / decoder", ja: "ニューラルエンコーダー／デコーダー", ko: "신경망 인코더/디코더" },
          { zh: "codec token 与 latent", en: "Codec tokens and latents", ja: "Codec token と latent", ko: "Codec token과 latent" },
          { zh: "低码率语音、音乐和通信", en: "Low-bitrate speech, music, and communication", ja: "低ビットレート音声、音楽、通信", ko: "저비트레이트 음성, 음악과 통신" }
        ],
        detail: {
          explanation: {
            zh: "AI 音频编码用神经网络把 PCM 压缩成离散 token 或连续 latent，再由神经解码器重建波形。\n\n它和 MP3/AAC/Opus 这类传统 codec 不同：传统 codec 主要依赖听觉模型、变换和熵编码，AI codec 则让模型学习哪些声音信息最该保留，甚至可用生成模型补全细节。\n\n它适合低码率语音、实时通信、生成式语音 token、内容编辑和弱网传输，但要关注延迟、算力、跨设备一致性和失真类型。",
            en: "AI audio coding uses neural networks to compress PCM into discrete tokens or continuous latents, then reconstructs waveform audio with a neural decoder.\n\nIt differs from traditional codecs such as MP3, AAC, and Opus: traditional codecs rely mainly on psychoacoustic models, transforms, and entropy coding, while AI codecs learn which sound information to preserve and may use generative reconstruction.\n\nIt suits low-bitrate speech, real-time communication, generative speech tokens, content editing, and weak networks, but latency, compute, device consistency, and distortion types matter.",
            ja: "AI 音声符号化はニューラルネットワークで PCM を離散 token または連続 latent に圧縮し、ニューラルデコーダーで波形音声を再構成します。\n\nMP3、AAC、Opus などの従来 Codec とは異なり、従来 Codec が主に聴覚モデル、変換、エントロピー符号化に依存するのに対し、AI Codec はどの音情報を残すべきかを学習し、生成モデルで細部を補うこともあります。\n\n低ビットレート音声、リアルタイム通信、生成音声 token、コンテンツ編集、弱いネットワークに適しますが、遅延、計算量、デバイス間の一貫性、歪みの種類に注意が必要です。",
            ko: "AI 오디오 코딩은 신경망으로 PCM을 이산 token 또는 연속 latent로 압축한 뒤 신경망 디코더로 파형 오디오를 복원합니다.\n\nMP3, AAC, Opus 같은 전통 코덱과 다르게 전통 코덱은 주로 청각 모델, 변환과 엔트로피 코딩에 의존하는 반면 AI 코덱은 어떤 소리 정보를 보존할지 학습하고 생성 모델로 세부를 보완할 수도 있습니다.\n\n저비트레이트 음성, 실시간 통신, 생성 음성 token, 콘텐츠 편집과 열악한 네트워크에 적합하지만 지연, 연산량, 장치 간 일관성과 왜곡 유형을 고려해야 합니다."
          },
          termExplanations: [
            {
              name: { zh: "codec token", en: "Codec token", ja: "Codec トークン", ko: "Codec 토큰" },
              explanation: {
                zh: "模型把短帧音频映射成离散编号序列。生成式语音模型可以直接预测这些 token，再由解码器还原为语音。",
                en: "The model maps short audio frames into a sequence of discrete IDs. Generative speech models can predict these tokens directly, then a decoder turns them back into speech.",
                ja: "モデルは短い音声フレームを離散 ID の列へ写像します。生成音声モデルはこれらの token を直接予測し、デコーダーが音声へ戻します。",
                ko: "모델은 짧은 오디오 프레임을 이산 ID 시퀀스로 매핑합니다. 생성 음성 모델은 이 token을 직접 예측하고 디코더가 음성으로 되돌립니다."
              }
            },
            {
              name: { zh: "latent", en: "Latent", ja: "潜在表現", ko: "잠재 표현" },
              explanation: {
                zh: "latent 是模型内部的压缩表示，可以是连续向量或量化后的 token。它不是人能直接听到的音频，而是供解码器重建声音的表示。",
                en: "A latent is a compressed internal representation, either continuous vectors or quantized tokens. It is not directly audible audio; it is used by a decoder to reconstruct sound.",
                ja: "latent はモデル内部の圧縮表現で、連続ベクトルまたは量子化された token です。人が直接聞ける音声ではなく、デコーダーが音を再構成するための表現です。",
                ko: "latent는 연속 벡터 또는 양자화된 token 형태의 모델 내부 압축 표현입니다. 사람이 직접 들을 수 있는 오디오가 아니라 디코더가 소리를 복원하는 데 사용하는 표현입니다."
              }
            },
            {
              name: { zh: "生成式重建", en: "Generative reconstruction", ja: "生成的再構成", ko: "생성형 재구성" },
              explanation: {
                zh: "在极低码率下，模型可能不是逐点还原所有细节，而是根据保留下来的语音/音色信息生成听起来合理的细节。",
                en: "At very low bitrates, the model may not reconstruct every detail sample by sample; it generates plausible details from preserved speech and timbre information.",
                ja: "極低ビットレートでは、モデルはすべての細部をサンプル単位で復元せず、残された音声や音色の情報から聞こえの自然な細部を生成することがあります。",
                ko: "매우 낮은 비트레이트에서는 모델이 모든 세부를 샘플 단위로 복원하지 않고 보존된 음성·음색 정보에서 그럴듯한 세부를 생성할 수 있습니다."
              }
            }
          ],
          keyConcepts: [
            { zh: "AI codec 的基本流程是 PCM -> 神经编码器 -> token/latent -> 码流/网络 -> 神经解码器 -> PCM。", en: "The basic AI codec flow is PCM -> neural encoder -> token/latent -> bitstream/network -> neural decoder -> PCM.", ja: "AI Codec の基本フローは PCM -> ニューラルエンコーダー -> token/latent -> ビットストリーム／ネットワーク -> ニューラルデコーダー -> PCM です。", ko: "AI 코덱의 기본 흐름은 PCM -> 신경망 인코더 -> token/latent -> 비트스트림/네트워크 -> 신경망 디코더 -> PCM입니다." },
            { zh: "AI 编码和传统音频编解码卡片不冲突：传统卡片讲 PCM/WAV/MP3/AAC/Opus 的工程和原理，这里讲学习型压缩表示和神经重建。", en: "AI coding does not conflict with the traditional audio-codec card: that card explains PCM/WAV/MP3/AAC/Opus engineering and principles, while this one covers learned compressed representations and neural reconstruction.", ja: "AI 符号化は従来の音声 Codec カードと競合しません。従来カードは PCM/WAV/MP3/AAC/Opus の工学と原理、こちらは学習型圧縮表現とニューラル再構成を扱います。", ko: "AI 코딩은 전통 오디오 코덱 카드와 충돌하지 않습니다. 전통 카드는 PCM/WAV/MP3/AAC/Opus의 공학과 원리를 설명하고 이 카드는 학습형 압축 표현과 신경망 복원을 다룹니다." },
            { zh: "低码率并不等于无损；AI codec 可能保留语音可懂度，但改变空间感、背景声、瞬态或音色细节。", en: "Low bitrate does not mean lossless; an AI codec may preserve intelligibility while changing spatial cues, background sound, transients, or timbre details.", ja: "低ビットレートはロスレスを意味しません。AI Codec は音声の明瞭度を保ちながら、空間手掛かり、背景音、過渡、音色の細部を変えることがあります。", ko: "저비트레이트가 무손실을 뜻하지는 않습니다. AI 코덱은 음성 명료도를 보존하면서 공간 단서, 배경음, 과도 응답이나 음색 세부를 바꿀 수 있습니다." },
            { zh: "实时通信要看算法延迟、帧长、丢包恢复和端侧算力；离线生成则更看自然度和一致性。", en: "Real-time communication depends on algorithmic latency, frame size, packet-loss recovery, and edge compute; offline generation focuses more on naturalness and consistency.", ja: "リアルタイム通信ではアルゴリズム遅延、フレーム長、パケット損失回復、エッジ計算量を見ます。オフライン生成では自然さと一貫性をより重視します。", ko: "실시간 통신은 알고리즘 지연, 프레임 길이, 패킷 손실 복구와 엣지 연산에 좌우되며 오프라인 생성은 자연스러움과 일관성을 더 중시합니다." }
          ],
          lab: {
            type: "ai-audio",
            initialMode: "codec",
            title: { zh: "AI 音频编码实验室", en: "AI Audio Coding Lab", ja: "AI 音声符号化ラボ", ko: "AI 오디오 코딩 실험실" },
            description: {
              zh: "进入独立文章界面，理解 PCM、神经编码器、token/latent、低码率码流和神经解码器之间的关系。",
              en: "Open an independent article page explaining PCM, neural encoders, tokens/latents, low-bitrate streams, and neural decoders.",
              ja: "独立した記事ページで、PCM、ニューラルエンコーダー、token/latent、低ビットレートのビットストリーム、ニューラルデコーダーの関係を理解します。",
              ko: "독립 문서 페이지에서 PCM, 신경망 인코더, token/latent, 저비트레이트 스트림과 신경망 디코더의 관계를 이해합니다."
            },
            buttonLabel: { zh: "打开 AI 音频编码实验室", en: "Open AI audio coding lab", ja: "AI 音声符号化ラボを開く", ko: "AI 오디오 코딩 실험실 열기" }
          },
          misconception: {
            zh: "AI 编码不是把 MP3 再包一层 AI，也不是一定比传统 codec 更好。它在低码率和语义表示上有优势，但对算力、训练数据、延迟和兼容性更敏感。",
            en: "AI coding is not MP3 wrapped in AI, and it is not always better than traditional codecs. It can help at low bitrates and semantic representation, but is more sensitive to compute, training data, latency, and compatibility.",
            ja: "AI 符号化は MP3 を AI で包むものでも、従来 Codec より常に優れるものでもありません。低ビットレートと意味表現に強みがありますが、計算量、学習データ、遅延、互換性に敏感です。",
            ko: "AI 코딩은 MP3에 AI를 한 겹 씌우는 것도 전통 코덱보다 항상 좋은 것도 아닙니다. 낮은 비트레이트와 의미 표현에 장점이 있지만 연산량, 학습 데이터, 지연과 호환성에 더 민감합니다."
          },
          contentDirection: {
            zh: "适合做 AI 编码实验室：把传统 codec 的“变换/量化/熵编码”和 AI codec 的“神经编码/token/神经解码”并排对比，并展示低码率通信与生成式语音 token 两种场景。",
            en: "This fits an AI coding lab comparing traditional transform/quantization/entropy coding with neural encoding/tokens/neural decoding, plus low-bitrate communication and generative speech-token scenarios.",
            ja: "従来 Codec の「変換／量子化／エントロピー符号化」と AI Codec の「ニューラル符号化／token／ニューラルデコード」を並べて比較し、低ビットレート通信と生成音声 token の2つの場面を示す AI 符号化ラボへ発展できます。",
            ko: "전통 코덱의 ‘변환/양자화/엔트로피 코딩’과 AI 코덱의 ‘신경망 코딩/token/신경망 디코딩’을 나란히 비교하고 저비트레이트 통신과 생성 음성 token 사례를 보여 주는 AI 코딩 실험실로 확장할 수 있습니다."
          }
        }
      }
    ]
  },
  {
    id: "applications",
    icon: Binary,
    accent: "#6d8c3f",
    title: { zh: "应用场景", en: "Applications", ja: "応用シーン", ko: "응용 시나리오" },
    description: {
      zh: "把音频技术放进产品、设备和行业场景中理解。",
      en: "Understand audio technology through products, devices, and industry scenarios.",
      ja: "音声技術を製品、機器、業界のシーンに置いて理解します。",
      ko: "오디오 기술을 제품, 장치와 산업 시나리오 속에서 이해합니다."
    },
    topics: [
      {
        title: { zh: "蓝牙音频：无线传输、编码与延迟", en: "Bluetooth Audio: Wireless Transport, Coding, and Latency", ja: "Bluetooth 音声：無線伝送、符号化、遅延", ko: "Bluetooth 오디오: 무선 전송, 코딩과 지연" },
        summary: { zh: "从手机到耳机，理解音乐、通话、LE Audio、编解码协商和播放缓冲。", en: "Follow audio from phone to headphones through music, calls, LE Audio, codec negotiation, and playout buffers.", ja: "スマートフォンからヘッドホンまで、音楽、通話、LE Audio、Codec ネゴシエーション、再生バッファーをたどります。", ko: "휴대폰에서 헤드폰까지 음악, 통화, LE Audio, 코덱 협상과 재생 버퍼를 따라갑니다." },
        bullets: [
          { zh: "A2DP / HFP / LE Audio", en: "A2DP / HFP / LE Audio", ja: "A2DP / HFP / LE Audio", ko: "A2DP / HFP / LE Audio" },
          { zh: "码率、延迟与丢包补偿", en: "Bitrate, latency, and loss concealment", ja: "ビットレート、遅延、パケット損失隠蔽", ko: "비트레이트, 지연과 패킷 손실 은닉" },
          { zh: "TWS 同步与广播音频", en: "TWS synchronization and broadcast audio", ja: "TWS 同期とブロードキャスト音声", ko: "TWS 동기와 방송 오디오" }
        ],
        detail: {
          explanation: { zh: "手机先解码音乐文件得到 PCM，经系统混音后按连接双方协商的蓝牙 Codec 重新编码，再通过协议栈和无线控制器发送。耳机按播放时限缓存、解码，经 DAC 和功放发声。经典蓝牙通常用 A2DP 播放音乐、HFP 进行双向通话；LE Audio 使用低功耗蓝牙等时传输，可支持多流同步和广播音频。", en: "A phone decodes a music file to PCM, mixes it, then encodes it with a Bluetooth codec negotiated with the receiver. The protocol stack and radio controller transport it to the headphones, which buffer to a playout deadline, decode, and drive the DAC and amplifier. Classic Bluetooth commonly uses A2DP for music and HFP for calls; LE Audio uses LE isochronous transport for features including synchronized streams and broadcast audio.", ja: "スマートフォンは音楽ファイルを PCM へデコードしてシステムでミックスし、接続相手とネゴシエーションした Bluetooth Codec で再エンコードして、プロトコルスタックと無線コントローラーから送信します。ヘッドホンは再生 deadline に合わせてバッファリング、デコードし、DAC とアンプを駆動します。Classic Bluetooth は音楽に A2DP、通話に HFP を使うことが多く、LE Audio は LE アイソクロナス伝送で同期ストリームやブロードキャスト音声を実現します。", ko: "스마트폰은 음악 파일을 PCM으로 디코드하고 시스템에서 믹스한 뒤 연결 상대와 협상한 Bluetooth 코덱으로 다시 인코딩해 프로토콜 스택과 무선 컨트롤러로 전송합니다. 헤드폰은 재생 deadline에 맞춰 버퍼링하고 디코드한 다음 DAC와 앰프를 구동합니다. Classic Bluetooth는 음악에 A2DP, 통화에 HFP를 흔히 사용하고 LE Audio는 LE 등시성 전송으로 동기화 스트림과 방송 오디오를 지원할 수 있습니다." },
          keyConcepts: [
            { zh: "Codec 是压缩方法，Profile 是设备如何协作的规范，蓝牙版本号不能代替具体功能支持。", en: "A codec compresses audio; a profile defines device interoperability. A Bluetooth version number alone does not establish feature support.", ja: "Codec は圧縮方法、Profile は機器が協調するための仕様で、Bluetooth のバージョン番号だけでは具体的な機能対応を示せません。", ko: "Codec은 압축 방법이고 Profile은 장치 협업 규격이며 Bluetooth 버전 번호만으로 구체적인 기능 지원을 판단할 수 없습니다." },
            { zh: "缓冲可接纳播放时限内的迟到数据，但不能恢复永久丢包；PLC 只能估计缺失音频。", en: "Buffers accept late data before its deadline, but cannot recover permanently lost packets. PLC estimates missing audio.", ja: "バッファーは deadline 前に遅れて届いたデータを受け入れられますが、永久に失われたパケットは復元できません。PLC は欠落音声を推定するだけです。", ko: "버퍼는 deadline 전에 늦게 도착한 데이터를 수용할 수 있지만 영구적으로 손실된 패킷을 복구하지는 못합니다. PLC는 손실 오디오를 추정할 뿐입니다." },
            { zh: "总延迟包含编码帧积累、处理、排队、无线调度、接收缓冲和播放，不由 Codec 名称单独决定。", en: "Total latency includes frame collection, processing, queuing, radio scheduling, receive buffering, and playout, not just the codec.", ja: "総遅延にはエンコードのフレーム蓄積、処理、キュー、無線スケジューリング、受信バッファー、再生が含まれ、Codec 名だけでは決まりません。", ko: "전체 지연에는 인코딩 프레임 축적, 처리, 큐잉, 무선 스케줄링, 수신 버퍼와 재생이 포함되며 코덱 이름만으로 결정되지 않습니다." }
          ],
          termExplanations: [
            { name: { zh: "音乐与通话", en: "Music and calls", ja: "音楽と通話", ko: "음악과 통화" }, explanation: { zh: "A2DP 面向高质量媒体播放，常见 SBC、AAC 和厂商扩展 Codec；HFP 提供麦克风上行和通话下行。启用耳机麦克风可能触发路径切换，音质变化不一定是耳机故障。", en: "A2DP carries high-quality media using codecs such as SBC, AAC, and vendor extensions. HFP provides microphone uplink and call downlink. Activating a headset microphone may switch paths and change quality without a hardware fault.", ja: "A2DP は高品質メディア再生向けで、SBC、AAC、メーカー拡張 Codec などを使います。HFP はマイク上りと通話下りを提供します。ヘッドセットのマイクを有効にすると経路が切り替わり、音質が変わっても故障とは限りません。", ko: "A2DP는 고품질 미디어 재생을 대상으로 하며 SBC, AAC와 제조사 확장 코덱을 사용합니다. HFP는 마이크 업링크와 통화 다운링크를 제공합니다. 헤드셋 마이크를 활성화하면 경로가 바뀌어 음질이 변할 수 있지만 하드웨어 고장은 아닐 수 있습니다." } },
            { name: { zh: "LE Audio 与 LC3", en: "LE Audio and LC3", ja: "LE Audio と LC3", ko: "LE Audio와 LC3" }, explanation: { zh: "LC3 是 LE Audio 的基础 Codec，支持 7.5 ms / 10 ms 帧间隔；帧间隔不是端到端延迟。发送端、接收端和操作系统都必须支持对应功能。", en: "LC3 is the foundational LE Audio codec and supports 7.5 ms / 10 ms frame intervals. A frame interval is not end-to-end latency. Sender, receiver, and operating system must support the relevant features.", ja: "LC3 は LE Audio の基盤 Codec で、7.5 ms / 10 ms のフレーム間隔に対応します。フレーム間隔はエンドツーエンド遅延ではありません。送信側、受信側、OS が該当機能に対応する必要があります。", ko: "LC3는 LE Audio의 기본 코덱으로 7.5 ms / 10 ms 프레임 간격을 지원합니다. 프레임 간격은 엔드투엔드 지연이 아니며 송신기, 수신기와 운영체제가 해당 기능을 지원해야 합니다." } },
            { name: { zh: "TWS 与广播", en: "TWS and broadcast", ja: "TWS とブロードキャスト", ko: "TWS와 방송" }, explanation: { zh: "TWS 左右耳需要共同的播放时间和时钟漂移补偿，不只是同时收到包。LE Audio 多流便于同步分发；Auracast 广播可让多个兼容接收端收听同一节目。", en: "TWS earbuds need a shared playout time and clock-drift compensation, not merely simultaneous packet arrival. LE Audio supports synchronized streams; Auracast broadcast lets compatible receivers listen to a shared program.", ja: "TWS の左右イヤホンには共通の再生時刻とクロックドリフト補償が必要で、単に同時にパケットを受け取るだけでは不十分です。LE Audio のマルチストリームは同期配信に適し、Auracast は複数の対応受信機で同じ番組を聴けます。", ko: "TWS 좌우 이어버드는 패킷을 동시에 받는 것만이 아니라 공통 재생 시각과 클록 드리프트 보상이 필요합니다. LE Audio 멀티스트림은 동기 전송에 유리하고 Auracast 방송은 여러 호환 수신기가 같은 프로그램을 들을 수 있게 합니다." } }
          ],
          lab: { type: "bluetooth-audio", title: { zh: "蓝牙音频链路实验室", en: "Bluetooth Audio Link Lab", ja: "Bluetooth 音声リンクラボ", ko: "Bluetooth 오디오 링크 실험실" }, description: { zh: "切换编码配置并调整缓冲和传输条件，观察负载大小、播放时限和延迟预算。", en: "Switch coding configurations and adjust buffering and transport conditions to explore payload size, deadlines, and latency budgets.", ja: "符号化設定を切り替え、バッファーと伝送条件を調整して、ペイロードサイズ、deadline、遅延予算を確認します。", ko: "코딩 구성을 전환하고 버퍼와 전송 조건을 조절해 페이로드 크기, deadline과 지연 예산을 관찰합니다." }, buttonLabel: { zh: "打开蓝牙音频实验室", en: "Open Bluetooth audio lab", ja: "Bluetooth 音声ラボを開く", ko: "Bluetooth 오디오 실험실 열기" } },
          misconception: { zh: "高码率不等于必然更好听，LC3 也不等于固定低延迟；设备实现、内容、链路和播放策略都需一起评估。", en: "Higher bitrate does not automatically sound better, and LC3 does not guarantee a fixed low latency. Implementation, content, link conditions, and playout policy all matter.", ja: "高ビットレートが必ず良い音になるわけではなく、LC3 も固定の低遅延を保証しません。実装、コンテンツ、リンク、再生ポリシーをまとめて評価する必要があります。", ko: "높은 비트레이트가 반드시 더 좋은 소리를 보장하지 않고 LC3도 고정된 저지연을 보장하지 않습니다. 구현, 콘텐츠, 링크 조건과 재생 정책을 함께 평가해야 합니다." },
          contentDirection: { zh: "用音乐耳机、车载通话、游戏、TWS 和公共广播比较需求；编码原理参见音频编解码卡片。", en: "Compare music headphones, car calls, gaming, TWS, and public broadcasts. See Audio Codecs for compression internals.", ja: "音楽ヘッドホン、車載通話、ゲーム、TWS、公共放送の要件を比較できます。圧縮の内部原理は音声 Codec カードを参照します。", ko: "음악 헤드폰, 차량 통화, 게임, TWS와 공공 방송의 요구를 비교합니다. 압축 내부 원리는 오디오 코덱 카드를 참고합니다." }
        }
      },
      {
        title: { zh: "会议与通信", en: "Conferencing and Communication", ja: "会議と通信", ko: "회의와 통신" },
        summary: {
          zh: "从个人终端、多人会议室、弱网会议和实时字幕四个场景理解会议体验与排查方法。",
          en: "Understand meeting experience and troubleshooting through personal devices, meeting rooms, poor networks, and live captions.",
          ja: "個人端末、会議室、弱いネットワーク、ライブ字幕の4つの場面から、会議体験とトラブルシューティングを理解します。",
          ko: "개인 단말, 회의실, 불안정한 네트워크와 실시간 자막의 네 가지 장면으로 회의 경험과 문제 해결을 이해합니다."
        },
        bullets: [
          { zh: "个人终端与声学回声", en: "Personal devices and acoustic echo", ja: "個人端末と音響エコー", ko: "개인 단말과 음향 에코" },
          { zh: "多人会议室与远场拾音", en: "Meeting rooms and far-field pickup", ja: "会議室と遠距離収音", ko: "회의실과 원거리 수음" },
          { zh: "弱网下的连续播放", en: "Continuous playout on poor networks", ja: "弱いネットワークでの連続再生", ko: "불안정한 네트워크에서의 연속 재생" },
          { zh: "实时字幕识别旁路", en: "Live-caption recognition side path", ja: "ライブ字幕認識のサイドパス", ko: "실시간 자막 인식 사이드 경로" }
        ],
        detail: {
          explanation: {
            zh: "会议排查要把环境、信号链、症状、可观察指标连起来：个人终端重点看扬声器到麦克风的声学回路，多人会议室还要看距离、方位和混响；AEC 用播放参考抑制回声。弱网中的卡顿和延迟属于传输与播放问题，Jitter Buffer 重排并缓存到达不均的包，PLC 在丢包时补偿短缺音频。实时字幕从增强后语音分出 ASR 旁路，首字和最终结果还受端点检测、推理、翻译与出字策略影响，不应把字幕慢等同于主音频慢。",
            en: "Meeting troubleshooting connects environment, signal chain, symptom, and observable metric. On personal devices, inspect the acoustic loop from speaker to microphone; in meeting rooms, also inspect distance, direction, and reverberation. AEC uses the render reference to suppress echo. Stalls and delay on poor networks belong to transport and playout: a jitter buffer reorders and holds uneven packets, while PLC conceals short audio gaps after loss. Live captions branch from enhanced speech into an ASR side path, where endpointing, inference, translation, and text stabilization affect first-token and final-result latency; slow captions do not necessarily mean slow main audio.",
            ja: "会議のトラブルシューティングでは、環境、信号経路、症状、観測可能な指標を結び付けます。個人端末ではスピーカーからマイクへ戻る音響ループを確認し、会議室では距離、方向、残響も見ます。AEC は再生リファレンスでエコーを抑えます。弱いネットワークの音切れと遅延は伝送・再生の問題で、Jitter Buffer が到着のばらつくパケットを並べ替えて保持し、PLC が損失後の短い音声欠落を補います。ライブ字幕は強調後音声から ASR のサイドパスへ分岐し、エンドポイント検出、推論、翻訳、テキスト安定化が首字と最終結果の遅延に影響します。字幕が遅いことを主音声が遅いことと同一視してはいけません。",
            ko: "회의 문제 해결에서는 환경, 신호 경로, 증상과 관찰 가능한 지표를 연결해야 합니다. 개인 단말에서는 스피커에서 마이크로 돌아오는 음향 루프를 보고 회의실에서는 거리, 방향과 잔향도 확인합니다. AEC는 재생 참조로 에코를 억제합니다. 불안정한 네트워크의 끊김과 지연은 전송·재생 문제이며 Jitter Buffer가 도착이 고르지 않은 패킷을 재정렬하고 보관하고 PLC가 손실 뒤 짧은 오디오 공백을 은닉합니다. 실시간 자막은 향상된 음성에서 ASR 사이드 경로로 분기되며 엔드포인트 검출, 추론, 번역과 텍스트 안정화가 첫 토큰과 최종 결과 지연에 영향을 줍니다. 자막이 느리다고 주 오디오가 느린 것은 아닙니다."
          },
          lab: {
            type: "meeting-communication",
            title: { zh: "会议与通信实验室", en: "Conferencing and Communication Lab", ja: "会議と通信ラボ", ko: "회의와 통신 실험실" },
            description: {
              zh: "切换四个实际场景，对照环境、信号链、体验症状、可观察指标和排查顺序。",
              en: "Switch among four practical scenes and compare environment, signal chain, user symptom, observable metric, and troubleshooting order.",
              ja: "4つの実際のシーンを切り替え、環境、信号経路、体験上の症状、観測指標、調査の順序を比較します。",
              ko: "네 가지 실제 장면을 전환하며 환경, 신호 경로, 사용자 증상, 관찰 지표와 문제 해결 순서를 비교합니다."
            },
            buttonLabel: { zh: "打开会议与通信实验室", en: "Open conferencing and communication lab", ja: "会議と通信ラボを開く", ko: "회의와 통신 실험실 열기" }
          },
          keyConcepts: [
            { zh: "个人终端出现回声时，先核对声学环境、播放参考和 AEC 指标；多人会议室听不清时，再看拾音距离、阵列方向与混响。", en: "For echo on a personal device, check the acoustic environment, render reference, and AEC metrics first. For poor intelligibility in a meeting room, also inspect pickup distance, array direction, and reverberation.", ja: "個人端末のエコーでは、まず音響環境、再生リファレンス、AEC 指標を確認します。会議室で聞き取りにくい場合は、収音距離、アレイ方向、残響も調べます。", ko: "개인 단말에서 에코가 나면 먼저 음향 환경, 재생 참조와 AEC 지표를 확인합니다. 회의실에서 잘 들리지 않으면 수음 거리, 어레이 방향과 잔향도 살펴봅니다." },
            { zh: "弱网卡顿要沿 RTP 到达、Jitter Buffer、PLC 和播放链路定位，并观察丢包率、抖动、RTT 与缓冲深度。", en: "Trace poor-network stalls through RTP arrival, the jitter buffer, PLC, and playout while observing packet loss, jitter, RTT, and buffer depth.", ja: "弱いネットワークの音切れは、RTP 到着、Jitter Buffer、PLC、再生経路に沿って調べ、パケット損失率、ジッター、RTT、バッファー深度を観測します。", ko: "불안정한 네트워크의 끊김은 RTP 도착, Jitter Buffer, PLC와 재생 경로를 따라 추적하고 패킷 손실률, 지터, RTT와 버퍼 깊이를 관찰합니다." },
            { zh: "实时字幕是 ASR 识别旁路；应分别观察首字延迟、最终结果延迟和修订次数，不要用字幕延迟代替主音频延迟。", en: "Live captions use an ASR recognition side path. Observe first-token latency, final-result latency, and revisions separately instead of treating caption delay as main-audio delay.", ja: "ライブ字幕は ASR の認識サイドパスです。首字遅延、最終結果遅延、修正回数を分けて観測し、字幕遅延を主音声の遅延の代わりにしてはいけません。", ko: "실시간 자막은 ASR 인식 사이드 경로입니다. 첫 토큰 지연, 최종 결과 지연과 수정 횟수를 따로 관찰하고 자막 지연을 주 오디오 지연으로 간주하지 않아야 합니다." },
            { zh: "同一症状可能来自不同位置：先按场景确认环境，再沿信号链复现症状，用对应指标缩小范围，最后调整模块。", en: "The same symptom can originate at different points: establish the environment, follow the signal chain to reproduce it, narrow the scope with matching metrics, and only then tune a module.", ja: "同じ症状でも原因箇所は異なります。まずシーンの環境を確認し、信号経路に沿って症状を再現し、対応する指標で範囲を絞ってからモジュールを調整します。", ko: "같은 증상도 다른 위치에서 생길 수 있습니다. 먼저 장면의 환경을 확인하고 신호 경로를 따라 증상을 재현한 뒤 해당 지표로 범위를 좁히고 마지막에 모듈을 조정합니다." }
          ],
          misconception: {
            zh: "不要把回声、卡顿和字幕慢都归因于麦克风或网络：声学问题、网络问题和字幕旁路延迟位于不同链路，必须用各自指标验证。",
            en: "Do not blame every echo, stall, or slow caption on the microphone or network. Acoustic problems, network problems, and caption side-path delays occur on different chains and require their own metrics.",
            ja: "エコー、音切れ、字幕の遅さをすべてマイクやネットワークのせいにしないでください。音響問題、ネットワーク問題、字幕サイドパスの遅延は異なる経路にあり、それぞれの指標で検証する必要があります。",
            ko: "모든 에코, 끊김과 느린 자막을 마이크나 네트워크 탓으로 돌리면 안 됩니다. 음향 문제, 네트워크 문제와 자막 사이드 경로 지연은 서로 다른 경로에 있으므로 각각의 지표로 검증해야 합니다."
          },
          contentDirection: {
            zh: "重点用端到端链路图和问题诊断说明“回声大、听不清、字幕慢”分别该看哪些模块，而不是把所有算法孤立介绍。",
            en: "Focus on an end-to-end chain diagram and troubleshooting flow for echo, poor intelligibility, and delayed captions, rather than explaining every algorithm in isolation.",
            ja: "各アルゴリズムを孤立して説明するのではなく、「エコーが大きい」「聞き取りにくい」「字幕が遅い」で見るべきモジュールを、エンドツーエンドの経路図と診断フローで示すことに重点を置きます。",
            ko: "모든 알고리즘을 따로 설명하기보다 ‘에코가 크다’, ‘잘 들리지 않는다’, ‘자막이 느리다’에서 어떤 모듈을 봐야 하는지를 엔드투엔드 경로 도해와 문제 진단 흐름으로 설명하는 데 중점을 둡니다."
          }
        }
      },
      {
        title: { zh: "机器人音频", en: "Robot Audio", ja: "ロボット音声", ko: "로봇 오디오" },
        summary: { zh: "从身体部件到工作场景，理解机器人如何听、定位、交流与执行任务。", en: "Connect robot anatomy with real scenes: hearing, localization, conversation, and action.", ja: "ロボットの構成要素と実際のシーンをつなぎ、聞く、定位する、対話する、任務を実行する仕組みを理解します。", ko: "로봇의 구성 요소와 실제 장면을 연결해 듣고, 위치를 찾고, 대화하고, 작업을 수행하는 방식을 이해합니다." },
        bullets: [
          { zh: "阵列定位与定向拾音", en: "Array localization and beamforming", ja: "アレイ定位と指向性収音", ko: "어레이 위치 추정과 지향성 수음" },
          { zh: "运动自噪声与播放回声", en: "Motion self-noise and playback echo", ja: "動作の自己ノイズと再生エコー", ko: "동작 자체 잡음과 재생 에코" },
          { zh: "语音交互与多模态协同", en: "Voice interaction and multimodal coordination", ja: "音声対話とマルチモーダル連携", ko: "음성 상호작용과 멀티모달 협업" }
        ],
        detail: {
          explanation: { zh: "机器人音频连接听觉感知与任务执行。麦克风采集人声和环境声，多麦系统可利用通道间到达时间差估计方向，再定向增强目标语音；电机和风扇产生自噪声，扬声器播报则通过声学路径重新进入麦克风。增强后的语音送入唤醒、ASR 和意图理解，结合视觉与姿态信息确认对象，由任务规划和控制系统决定动作；TTS 提供语音反馈。服务机器人侧重对话，巡检机器人还可通过声音事件检测发现异常，但不能仅凭一次声音分类就判定设备故障。", en: "Robot audio connects auditory perception to action. Microphones capture speech and environmental sound; arrays can estimate direction from interchannel arrival-time differences and enhance target speech. Motors and fans create self-noise, while playback returns to microphones through acoustic paths. Enhanced speech feeds wake-word detection, ASR, and intent understanding; vision and pose help establish context, and planning and control decide actions. TTS provides spoken feedback. Service robots emphasize conversation; inspection robots can detect unusual sounds, but a single sound classification cannot establish a machine fault.", ja: "ロボット音声は聴覚知覚とタスク実行をつなぎます。マイクが人声と環境音を収音し、マルチマイクシステムがチャンネル間の到達時間差から方向を推定して目標音声を指向性強調します。モーターやファンは自己ノイズを生み、スピーカーの再生音は音響経路を通ってマイクへ戻ります。強調された音声はウェイクワード、ASR、意図理解へ送られ、視覚と姿勢で文脈を確認し、タスク計画と制御が動作を決めます。TTS が音声フィードバックを提供します。サービスロボットは対話を重視し、巡回ロボットは音響イベントで異常を検出できますが、1回の音分類だけで機器故障を断定できません。", ko: "로봇 오디오는 청각 인식과 작업 실행을 연결합니다. 마이크가 사람 음성과 환경음을 수음하고 다중 마이크 시스템은 채널 간 도달 시간 차로 방향을 추정한 뒤 목표 음성을 지향성 강화합니다. 모터와 팬은 자체 잡음을 만들고 스피커 재생음은 음향 경로를 통해 마이크로 돌아옵니다. 향상된 음성은 웨이크 워드, ASR과 의도 이해로 전달되고 시각과 자세 정보로 대상을 확인한 뒤 작업 계획과 제어 시스템이 동작을 결정합니다. TTS가 음성 피드백을 제공합니다. 서비스 로봇은 대화를 중시하고 순찰 로봇은 소리 이벤트로 이상을 감지할 수 있지만 한 번의 소리 분류만으로 기기 고장을 확정할 수는 없습니다." },
          lab: { type: "robot-audio", title: { zh: "机器人音频实验室", en: "Robot Audio Lab", ja: "ロボット音声ラボ", ko: "로봇 오디오 실험실" }, description: { zh: "切换结构与工作场景，对照部件、空间关系和处理链路。", en: "Explore anatomy and working scenes alongside the processing chain.", ja: "構成と作業シーンを切り替え、部品、空間関係、処理経路を確認します。", ko: "구조와 작업 장면을 전환하며 부품, 공간 관계와 처리 경로를 살펴봅니다." }, buttonLabel: { zh: "打开机器人音频实验室", en: "Open robot audio lab", ja: "ロボット音声ラボを開く", ko: "로봇 오디오 실험실 열기" } },
          keyConcepts: [
            { zh: "单麦不能使用阵列时间差定位；方向也不等于准确距离或三维位置。", en: "A single microphone cannot perform array TDOA localization; direction is not exact distance or 3D position.", ja: "単一マイクではアレイの TDOA 定位はできず、方向も正確な距離や3次元位置を意味しません。", ko: "단일 마이크로는 어레이 TDOA 위치 추정을 할 수 없으며 방향이 정확한 거리나 3차원 위치를 뜻하지도 않습니다." },
            { zh: "AEC 需要同步的播放参考，降噪处理电机等干扰；两者不能互相替代。", en: "AEC needs a synchronized playback reference; noise suppression handles interference such as motors. Neither replaces the other.", ja: "AEC には同期した再生リファレンスが必要で、ノイズ抑制はモーターなどの干渉を扱います。互いの代わりにはなりません。", ko: "AEC에는 동기화된 재생 참조가 필요하고 잡음 억제는 모터 같은 간섭을 처리합니다. 둘은 서로를 대체하지 않습니다." },
            { zh: "坐标随机器人姿态变化，声源跟踪需要时间同步和坐标转换。", en: "Robot pose changes relative coordinates; source tracking requires synchronization and coordinate transforms.", ja: "ロボットの姿勢で相対座標が変わるため、音源追跡には時間同期と座標変換が必要です。", ko: "로봇 자세가 상대 좌표를 바꾸므로 음원 추적에는 시간 동기와 좌표 변환이 필요합니다." }
          ],
          misconception: { zh: "听懂指令不等于可以安全执行；动作还要经过权限、环境和控制系统检查。", en: "Understanding a command does not make it safe to execute; permissions, environment, and control constraints still apply.", ja: "指示を理解したことは安全に実行できることを意味しません。権限、環境、制御上の制約を確認する必要があります。", ko: "명령을 이해했다고 안전하게 실행할 수 있는 것은 아닙니다. 권한, 환경과 제어 제약을 확인해야 합니다." },
          contentDirection: { zh: "结合静止交互、边走边听和播报打断，观察自噪声、定位与回声路径。", en: "Compare stationary interaction, listening in motion, and playback interruption through noise, direction, and echo paths.", ja: "静止した対話、移動中の聴取、再生割り込みを比較し、自己ノイズ、方向、エコー経路を観察します。", ko: "정지 상태 상호작용, 이동 중 청취와 재생 중단을 비교하며 자체 잡음, 방향과 에코 경로를 관찰합니다." }
        }
      },
      {
        title: { zh: "车载声学", en: "In-Car Acoustics", ja: "車載音響", ko: "차량 음향" },
        summary: {
          zh: "从座舱采集与定位到语音决策、空间回放和闭环噪声控制，理解车载声学的完整链路。",
          en: "Understand the complete in-car acoustic chain, from cabin capture and localization to voice decisions, spatial playback, and closed-loop noise control.",
          ja: "キャビンの収音・定位から音声判断、空間再生、閉ループ騒音制御まで、車載音響の全経路を理解します。",
          ko: "실내 캡처와 위치 추정부터 음성 판단, 공간 재생과 폐루프 잡음 제어까지 차량 음향의 전체 경로를 이해합니다."
        },
        bullets: [
          { zh: "麦克风阵列、分区定位与波束形成", en: "Microphone arrays, zone localization, and beamforming", ja: "マイクアレイ、ゾーン定位、ビームフォーミング", ko: "마이크 어레이, 구역 위치 추정과 빔포밍" },
          { zh: "语音理解与车辆安全策略", en: "Speech understanding and vehicle safety policy", ja: "音声理解と車両安全ポリシー", ko: "음성 이해와 차량 안전 정책" },
          { zh: "多扬声器空间渲染与告警优先级", en: "Multi-speaker spatial rendering and alert priority", ja: "マルチスピーカー空間レンダリングと警告優先度", ko: "다중 스피커 공간 렌더링과 경고 우선순위" },
          { zh: "ANC / RNC 闭环低频噪声控制", en: "ANC / RNC closed-loop low-frequency noise control", ja: "ANC / RNC 閉ループ低域騒音制御", ko: "ANC / RNC 폐루프 저주파 잡음 제어" }
        ],
        detail: {
          explanation: {
            zh: "车载声学把采集与定位、语音理解、回放与空间渲染、噪声控制连接成同一套座舱系统。麦克风阵列先采集乘员语音，通过通道间时间差和相位差定位说话座位，再用波束形成增强目标方向；AEC 和降噪抑制扬声器回放、路噪与空调声。随后唤醒词、ASR 和意图理解把语音变成候选动作，车辆还要结合车速、驾驶状态、座位权限和安全策略决定是否执行。播放侧通过多扬声器、功放、延迟、EQ 和相位校准渲染音乐、导航、告警与语音反馈。ANC / RNC 是闭环低频噪声控制：控制器根据参考信号预测发动机、轮胎或路面噪声，经扬声器产生反相信号，再由误差麦反馈修正。",
            en: "In-car acoustics connects capture and localization, speech understanding, playback and spatial rendering, and noise control into one cabin system. Microphone arrays first capture occupant speech, use interchannel time and phase differences to locate the speaking seat, and then apply beamforming to enhance the target direction; AEC and noise suppression reduce loudspeaker playback leakage, road noise, and HVAC noise. Wake-word detection, ASR, and intent understanding then turn speech into candidate actions, while the vehicle considers speed, driving state, seat permissions, and safety policies before deciding whether to execute them. On the playback side, multiple speakers, amplifiers, delay, EQ, and phase calibration render music, navigation, alerts, and voice feedback. ANC / RNC is closed-loop low-frequency noise control: the controller uses reference signals to predict engine, tire, or road noise, drives the speakers to produce an anti-phase signal, and then corrects its output using feedback from error microphones.",
            ja: "車載音響は、収音と定位、音声理解、再生と空間レンダリング、騒音制御を一つのキャビンシステムへつなぎます。マイクアレイが乗員の音声を収音し、チャンネル間の時間差と位相差から発話座席を特定して、ビームフォーミングで目標方向を強調します。AEC とノイズ抑制はスピーカーの回り込み、ロードノイズ、空調ノイズを低減します。続いてウェイクワード、ASR、意図理解が音声を候補動作へ変換し、車両は速度、運転状態、座席権限、安全ポリシーを考慮して実行可否を決めます。再生側では複数スピーカー、アンプ、遅延、EQ、位相校正で音楽、ナビ、警告、音声フィードバックをレンダリングします。ANC / RNC は閉ループ低域騒音制御で、参照信号からエンジン、タイヤ、路面ノイズを予測し、スピーカーで逆位相信号を出し、エラーマイクのフィードバックで補正します。",
            ko: "차량 음향은 캡처와 위치 추정, 음성 이해, 재생과 공간 렌더링, 잡음 제어를 하나의 실내 시스템으로 연결합니다. 마이크 어레이가 탑승자 음성을 먼저 캡처하고 채널 간 시간 차와 위상 차로 말하는 좌석을 찾은 뒤 빔포밍으로 목표 방향을 강화합니다. AEC와 잡음 억제는 스피커 재생 누설, 도로 소음과 공조기 소음을 줄입니다. 이어서 웨이크 워드, ASR과 의도 이해가 음성을 후보 동작으로 바꾸고 차량은 속도, 주행 상태, 좌석 권한과 안전 정책을 고려해 실행 여부를 결정합니다. 재생 측에서는 여러 스피커, 앰프, 지연, EQ와 위상 보정으로 음악, 내비게이션, 경고와 음성 피드백을 렌더링합니다. ANC / RNC는 폐루프 저주파 잡음 제어로, 참조 신호에서 엔진, 타이어나 노면 잡음을 예측해 스피커로 역위상 신호를 만들고 오류 마이크 피드백으로 출력을 보정합니다."
          },
          lab: {
            type: "automotive-audio",
            title: { zh: "车载声学实验室", en: "In-Car Acoustics Lab", ja: "車載音響ラボ", ko: "차량 음향 실험실" },
            description: {
              zh: "用车内饰部件位置图理解麦克风、扬声器、声源定位、语音助手、座舱空间音频和主动降噪如何协同。",
              en: "Use a cabin component layout to understand how microphones, speakers, localization, voice assistants, spatial audio, and active noise control work together.",
              ja: "キャビン部品の配置図で、マイク、スピーカー、定位、音声アシスタント、車室内空間音声、アクティブノイズ制御の連携を理解します。",
              ko: "실내 부품 배치도로 마이크, 스피커, 위치 추정, 음성 비서, 실내 공간 오디오와 능동 잡음 제어의 협업을 이해합니다."
            },
            buttonLabel: { zh: "打开车载声学实验室", en: "Open in-car acoustics lab", ja: "車載音響ラボを開く", ko: "차량 음향 실험실 열기" }
          },
          keyConcepts: [
            { zh: "麦克风阵列利用通道间时间差和相位差估计声源方向与座位分区；定位回答“声音来自哪里”，波束形成则是朝该方向增强、抑制其他方向的空间滤波，两者不能混为同一步。", en: "A microphone array uses interchannel time and phase differences to estimate source direction and seat zone. Localization answers where the sound comes from, while beamforming spatially enhances that direction and suppresses others; they are distinct operations.", ja: "マイクアレイはチャンネル間の時間差と位相差から音源方向と座席ゾーンを推定します。定位は「音がどこから来たか」に答え、ビームフォーミングはその方向を強調して他方向を抑える空間フィルターであり、別の処理です。", ko: "마이크 어레이는 채널 간 시간 차와 위상 차로 음원 방향과 좌석 구역을 추정합니다. 위치 추정은 ‘소리가 어디에서 오는가’에 답하고 빔포밍은 해당 방향을 강화하고 다른 방향을 억제하는 공간 필터이므로 서로 다른 작업입니다." },
            { zh: "语音助手用唤醒词启动交互，ASR 转写内容，意图理解生成候选动作；车速、驾驶状态、座位权限与安全策略再决定动作能否执行。", en: "A voice assistant starts interaction with a wake word, uses ASR to transcribe speech, and derives a candidate action through intent understanding; speed, driving state, seat permissions, and safety policy then determine whether that action may execute.", ja: "音声アシスタントはウェイクワードで対話を開始し、ASR で内容を文字化し、意図理解で候補動作を作ります。速度、運転状態、座席権限、安全ポリシーが実行可否を決めます。", ko: "음성 비서는 웨이크 워드로 상호작용을 시작하고 ASR로 내용을 전사한 뒤 의도 이해로 후보 동작을 만듭니다. 속도, 주행 상태, 좌석 권한과 안전 정책이 실행 가능 여부를 결정합니다." },
            { zh: "回放系统通过多扬声器与功放分配声道，并用延迟、EQ 和相位校准塑造座位声场；导航与安全告警必须按优先级压过或避让娱乐内容。", en: "The playback system distributes channels across multiple speakers and amplifiers, then shapes each seating sound field with delay, EQ, and phase calibration. Navigation and safety alerts must override or duck entertainment content according to priority.", ja: "再生システムは複数のスピーカーとアンプへチャンネルを分配し、遅延、EQ、位相校正で座席ごとの音場を作ります。ナビや安全警告は優先度に応じてエンターテインメントを割り込むかダッキングする必要があります。", ko: "재생 시스템은 여러 스피커와 앰프에 채널을 분배하고 지연, EQ와 위상 보정으로 좌석별 음장을 만듭니다. 내비게이션과 안전 경고는 우선순위에 따라 엔터테인먼트 콘텐츠를 중단하거나 덕킹해야 합니다." },
            { zh: "ANC / RNC 的闭环由参考信号、控制器、扬声器和误差麦组成，反馈用于持续修正残余噪声；它适合可预测、稳定的低频成分，不适合强行抵消高频、人声或突发声。", en: "The ANC / RNC loop consists of a reference signal, controller, speakers, and error microphones, whose feedback continuously corrects residual noise. It is suited to predictable, stable low-frequency components, not aggressive cancellation of high frequencies, speech, or transients.", ja: "ANC / RNC の閉ループは参照信号、コントローラー、スピーカー、エラーマイクで構成され、フィードバックが残留ノイズを継続的に補正します。予測可能で安定した低域成分に適し、高域、音声、過渡音を無理に消す用途には向きません。", ko: "ANC / RNC 폐루프는 참조 신호, 컨트롤러, 스피커와 오류 마이크로 구성되며 피드백이 잔류 잡음을 계속 보정합니다. 예측 가능하고 안정적인 저주파 성분에 적합하고 고주파, 음성이나 과도음을 억지로 상쇄하는 데는 적합하지 않습니다." }
          ],
          misconception: {
            zh: "把每个模块单独调通不代表整车体验已经成立：定位错误会把语音交给错误座位，回放泄漏会影响拾音，而不稳定的 ANC 参数还可能放大残余噪声。",
            en: "Making each module work in isolation does not guarantee a correct vehicle experience: localization errors can assign speech to the wrong seat, playback leakage can impair capture, and unstable ANC tuning can amplify residual noise.",
            ja: "各モジュールを単独で動かしても、車全体の体験が成立するとは限りません。定位の誤りは音声を誤った座席へ割り当て、再生の回り込みは収音を妨げ、不安定な ANC 調整は残留ノイズを増幅することがあります。",
            ko: "각 모듈을 따로 동작시킨다고 차량 전체 경험이 올바른 것은 아닙니다. 위치 추정 오류는 음성을 잘못된 좌석에 배정하고 재생 누설은 캡처를 방해하며 불안정한 ANC 튜닝은 잔류 잡음을 증폭할 수 있습니다."
          },
          contentDirection: {
            zh: "诊断时先判断问题属于拾音定位、语音决策、回放渲染还是噪声控制，再沿对应信号链检查唤醒错座、定位漂移、告警遮蔽或 ANC 轰鸣。",
            en: "When diagnosing an issue, first determine whether it belongs to capture and localization, voice decision-making, playback rendering, or noise control, then follow the corresponding signal chain to investigate wrong-seat wakeups, localization drift, masked alerts, or ANC rumble.",
            ja: "診断ではまず、収音・定位、音声判断、再生レンダリング、騒音制御のどこに問題があるかを判断し、対応する信号経路に沿って、誤った座席でのウェイクアップ、定位のドリフト、警告のマスキング、ANC の唸りを調べます。",
            ko: "진단할 때는 먼저 문제가 수음·위치 추정, 음성 의사결정, 재생 렌더링 또는 잡음 제어 중 어디에 속하는지 판단한 뒤 해당 신호 경로를 따라 잘못된 좌석의 웨이크업, 위치 추정 드리프트, 경고 마스킹이나 ANC 웅웅거림을 확인합니다."
          }
        }
      },
      {
        title: { zh: "IoT 与内容创作", en: "IoT and Content Creation", ja: "IoT とコンテンツ制作", ko: "IoT와 콘텐츠 제작" },
        summary: {
          zh: "覆盖低功耗语音唤醒、边缘控制、播客、直播、AI 配音和自动混音。",
          en: "Cover low-power wake words, edge control, podcasts, streaming, AI dubbing, and automatic mixing.",
          ja: "低消費電力の音声ウェイクアップ、エッジ制御、ポッドキャスト、ライブ配信、AI 吹き替え、自動ミキシングを扱います。",
          ko: "저전력 음성 웨이크업, 엣지 제어, 팟캐스트, 스트리밍, AI 더빙과 자동 믹싱을 다룹니다."
        },
        bullets: [
          { zh: "本地语音控制", en: "Local voice control", ja: "ローカル音声制御", ko: "로컬 음성 제어" },
          { zh: "播客与直播音频", en: "Podcast and live-stream audio", ja: "ポッドキャストとライブ配信音声", ko: "팟캐스트와 라이브 스트리밍 오디오" },
          { zh: "AI 配音与自动母带", en: "AI dubbing and automatic mastering", ja: "AI 吹き替えと自動マスタリング", ko: "AI 더빙과 자동 마스터링" }
        ],
        detail: {
          explanation: {
            zh: "IoT 音频更像一个长期待机的边缘感知系统，核心目标是低功耗、低成本、隐私、安全和快速响应。典型链路是麦克风持续监听低功耗唤醒词，唤醒后把短语音送入本地命令识别或云端 ASR/LLM，再控制灯、门锁、家电、摄像头或机器人。内容创作音频更像一条可反复编辑和交付的生产流水线，核心目标是可听、稳定、可修改、跨平台响度一致。典型链路是录音或导入素材，经过降噪、剪辑、EQ、压缩、响度标准化、AI 配音、自动母带和多平台导出。两者都可能用 AI，但 IoT 更在意实时性和资源预算，内容创作更在意质量、可控性和最终交付。",
            en: "IoT audio is more like an always-on edge sensing system whose goals are low power, low cost, privacy, safety, and fast response. A typical chain keeps a microphone listening for a low-power wake word, then sends short speech to local command recognition or cloud ASR/LLM to control lights, locks, appliances, cameras, or robots. Content-creation audio is more like an editable production pipeline whose goals are intelligibility, consistency, editability, and platform-ready loudness. A typical chain records or imports material, then applies denoising, editing, EQ, compression, loudness normalization, AI dubbing, automatic mastering, and multi-platform export. Both may use AI, but IoT cares more about latency and resource budget, while content creation cares more about quality, control, and delivery.",
            ja: "IoT 音声は、低消費電力、低コスト、プライバシー、安全、素早い応答を目標とする常時稼働のエッジセンシングシステムに近いものです。典型的な経路では、マイクが低消費電力のウェイクワードを待ち受け、起動後に短い音声をローカルのコマンド認識またはクラウドの ASR/LLM へ送り、照明、鍵、家電、カメラ、ロボットを制御します。コンテンツ制作音声は、聞きやすさ、一貫性、編集可能性、プラットフォーム向けの音量を目標とする編集可能な制作パイプラインです。録音または素材を取り込み、ノイズ低減、編集、EQ、圧縮、ラウドネス正規化、AI 吹き替え、自動マスタリング、複数プラットフォームへの書き出しを行います。両者とも AI を使えますが、IoT はリアルタイム性とリソース予算、コンテンツ制作は品質、制御性、最終納品をより重視します。",
            ko: "IoT 오디오는 저전력, 저비용, 개인정보, 안전과 빠른 응답을 목표로 하는 상시 동작 엣지 감지 시스템에 가깝습니다. 일반적인 경로에서는 마이크가 저전력 웨이크 워드를 계속 듣고, 깨어난 뒤 짧은 음성을 로컬 명령 인식이나 클라우드 ASR/LLM으로 보내 조명, 잠금장치, 가전, 카메라 또는 로봇을 제어합니다. 콘텐츠 제작 오디오는 듣기 쉬움, 일관성, 편집 가능성, 플랫폼에 맞는 음량을 목표로 반복 편집과 납품이 가능한 제작 파이프라인에 가깝습니다. 녹음하거나 소재를 가져온 뒤 잡음 제거, 편집, EQ, 압축, 라우드니스 정규화, AI 더빙, 자동 마스터링과 여러 플랫폼 내보내기를 적용합니다. 둘 다 AI를 사용할 수 있지만 IoT는 실시간성과 자원 예산을, 콘텐츠 제작은 품질, 제어 가능성과 최종 납품을 더 중시합니다."
          },
          lab: {
            type: "iot-content",
            title: { zh: "IoT 与内容创作实验室", en: "IoT and Content Creation Lab", ja: "IoT とコンテンツ制作ラボ", ko: "IoT와 콘텐츠 제작 실험실" },
            description: {
              zh: "用双路径流程图对比 IoT 语音控制和内容创作工具链，理解实时控制与内容生产的目标差异。",
              en: "Use a dual-path flow diagram to compare IoT voice control with creator audio workflows and understand the different goals of real-time control and production.",
              ja: "2本の経路図で IoT 音声制御とクリエイター向け音声ワークフローを比較し、リアルタイム制御と制作の目標の違いを理解します。",
              ko: "이중 경로 흐름도로 IoT 음성 제어와 크리에이터 오디오 워크플로를 비교하고 실시간 제어와 제작의 목표 차이를 이해합니다."
            },
            buttonLabel: { zh: "打开 IoT 与内容创作实验室", en: "Open IoT and content creation lab", ja: "IoT とコンテンツ制作ラボを開く", ko: "IoT와 콘텐츠 제작 실험실 열기" }
          },
          keyConcepts: [
            { zh: "边缘语音唤醒需要在功耗、误唤醒、漏唤醒、模型大小、唤醒词体验和隐私之间取舍。", en: "Edge wake-word detection trades power, false accepts, false rejects, model size, wake-word UX, and privacy.", ja: "エッジのウェイクワード検出では、消費電力、誤起動、起動漏れ、モデルサイズ、ウェイクワード体験、プライバシーを調整します。", ko: "엣지 웨이크 워드 검출은 전력, 오탐 기동, 미탐 기동, 모델 크기, 웨이크 워드 경험과 개인정보 사이의 절충이 필요합니다." },
            { zh: "IoT 的音频采集通常短、轻、实时：16 kHz 单声道 PCM、低功耗 DSP/NPU、本地关键词和少量命令词很常见。", en: "IoT capture is often short, lightweight, and real-time: 16 kHz mono PCM, low-power DSP/NPU, local keywords, and small command sets are common.", ja: "IoT の収音は短く軽量でリアルタイムなことが多く、16 kHz モノラル PCM、低消費電力 DSP/NPU、ローカルキーワード、少数のコマンドが一般的です。", ko: "IoT 캡처는 보통 짧고 가벼우며 실시간입니다. 16 kHz 모노 PCM, 저전력 DSP/NPU, 로컬 키워드와 적은 명령어 세트가 흔합니다." },
            { zh: "播客和直播常用响度标准、降噪、压缩、限幅、去齿音和自动电平控制，目标是让听众换设备也不觉得忽大忽小。", en: "Podcasts and live streams use loudness targets, denoising, compression, limiting, de-essing, and automatic leveling so listeners do not hear large level jumps across devices.", ja: "ポッドキャストとライブ配信では、ラウドネス目標、ノイズ低減、圧縮、リミッター、ディエッサー、自動レベル制御を使い、機器を変えても音量の大きな変動を感じさせないことを目指します。", ko: "팟캐스트와 라이브 스트림은 라우드니스 목표, 잡음 제거, 압축, 리미팅, 디에서와 자동 레벨 제어를 사용해 장치를 바꿔도 큰 음량 변화를 느끼지 않게 합니다." },
            { zh: "AI 配音、自动剪辑、自动母带和多语言翻译把复杂后期流程变成可重复的工具链，但仍需要人工检查情绪、语义和版权风险。", en: "AI dubbing, auto editing, automatic mastering, and multilingual translation turn post-production into repeatable toolchains, but emotion, meaning, and rights still require human review.", ja: "AI 吹き替え、自動編集、自動マスタリング、多言語翻訳は複雑なポストプロダクションを再現可能なツールチェーンにしますが、感情、意味、権利の確認は人が行う必要があります。", ko: "AI 더빙, 자동 편집, 자동 마스터링과 다국어 번역은 복잡한 후반 작업을 반복 가능한 도구 체인으로 바꾸지만 감정, 의미와 권리 위험은 여전히 사람이 확인해야 합니다." }
          ],
          misconception: {
            zh: "边缘 AI 不代表完全不需要云端，自动母带也不代表完全不用听。很多 IoT 产品会组合本地唤醒、轻量命令和云端大模型；很多创作工具会自动处理响度和动态，但最终仍要按内容风格和发布平台检查。",
            en: "Edge AI does not mean the cloud disappears, and automatic mastering does not mean nobody listens. Many IoT products combine local wake words and lightweight commands with cloud models; many creator tools automate loudness and dynamics, but final checks still depend on content style and publishing platform.",
            ja: "エッジ AI があればクラウドが不要になるわけでも、自動マスタリングで試聴が不要になるわけでもありません。多くの IoT 製品はローカルのウェイクワードと軽量コマンドをクラウドモデルと組み合わせ、制作ツールも音量とダイナミクスを自動処理しますが、最終確認はコンテンツのスタイルと公開プラットフォームに応じて必要です。",
            ko: "엣지 AI가 클라우드를 완전히 없애는 것도 자동 마스터링이 사람이 듣지 않아도 된다는 뜻도 아닙니다. 많은 IoT 제품은 로컬 웨이크 워드와 가벼운 명령을 클라우드 모델과 결합하고 창작 도구는 음량과 다이내믹을 자동 처리하지만 최종 확인은 콘텐츠 스타일과 게시 플랫폼에 따라 여전히 필요합니다."
          },
          contentDirection: {
            zh: "重点用双路径图讲清 IoT 语音控制和内容创作生产线：前者看功耗、延迟、误唤醒和隐私，后者看响度、动态、噪声、编辑效率和交付一致性。",
            en: "Use a dual-path diagram to explain IoT voice control and creator production workflows: the former focuses on power, latency, false wakes, and privacy; the latter focuses on loudness, dynamics, noise, editing speed, and delivery consistency.",
            ja: "2本の経路図で IoT 音声制御とクリエイター制作ワークフローを説明します。前者は消費電力、遅延、誤起動、プライバシー、後者はラウドネス、ダイナミクス、ノイズ、編集効率、納品の一貫性に注目します。",
            ko: "이중 경로 도해로 IoT 음성 제어와 크리에이터 제작 워크플로를 설명합니다. 전자는 전력, 지연, 오탐 기동과 개인정보를 보고 후자는 라우드니스, 다이내믹, 잡음, 편집 속도와 납품 일관성을 봅니다."
          }
        }
      }
    ]
  }
];
