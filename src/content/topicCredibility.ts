import type { AiAudioLabId, LocalizedText } from "./knowledge";
import type { TopicKey } from "./relatedTopics";
import { traditional } from "./traditional";
import { aiModelReferences } from "./aiModelReferences";

const l = (zh: string, en: string, ja: string, ko: string): LocalizedText => ({ zh, en, ja, ko, "zh-Hant": traditional(zh) });
export type EvidenceKind = "calculation" | "simulation" | "illustration";
type Method = { kind: EvidenceKind; scope: LocalizedText };
type Source = { name: string; url: string };
type Credibility = {
  updatedAt: string;
  methods: Method[];
  assumptions: LocalizedText;
  sources: Source[];
  model?: AiAudioLabId;
};

export const evidenceKinds: Record<EvidenceKind, { label: LocalizedText; meaning: LocalizedText }> = {
  calculation: { label: l("真实计算", "Actual computation", "実計算", "실제 계산"), meaning: l("数值由输入和所述公式计算；不等于设备实测或真实模型推理。", "Values are computed from inputs and stated formulas; this does not imply hardware measurements or model inference.", "入力と明示した式から数値を計算します。実機測定やモデル推論とは限りません。", "입력과 명시된 식으로 수치를 계산하며 장비 실측이나 모델 추론을 뜻하지는 않습니다.") },
  simulation: { label: l("教学模拟", "Teaching simulation", "教育用シミュレーション", "교육용 시뮬레이션"), meaning: l("使用简化模型、合成信号或预设数据说明趋势，不作为性能测试。", "Simplified models, synthetic signals or presets illustrate behavior, not benchmark performance.", "簡略モデル・合成信号・設定済みデータで傾向を示します。性能試験ではありません。", "단순 모델·합성 신호·사전 설정 데이터로 경향을 보여 주며 성능 시험이 아닙니다.") },
  illustration: { label: l("示意动画", "Schematic animation", "模式アニメーション", "도식 애니메이션"), meaning: l("图形及动效解释结构、顺序或数据流；形状与播放速度不代表实测量。", "Diagrams and motion explain structure, order or data flow; shapes and playback speed are not measurements.", "図や動きは構造・順序・データ流を説明します。形状や再生速度は実測値ではありません。", "도형과 동작은 구조·순서·데이터 흐름을 설명하며 모양과 재생 속도는 실측값이 아닙니다.") }
};

const refs = {
  sound: { name: "Penn State · Pressure, velocity and displacement", url: "https://www.acs.psu.edu/drussell/Demos/phase-p-u-sine/phase-p-u-sine.html" },
  sampling: { name: "Steven W. Smith · DSP Guide, Chapter 3: ADC and DAC", url: "https://www.dspguide.com/ch3.htm" },
  fourier: { name: "Steven W. Smith · DSP Guide, Chapter 8: DFT", url: "https://www.dspguide.com/ch8.htm" },
  filters: { name: "Steven W. Smith · DSP Guide, Chapter 14: Digital filters", url: "https://www.dspguide.com/ch14.htm" },
  webAudio: { name: "W3C · Web Audio API", url: "https://www.w3.org/TR/webaudio/" },
  levels: { name: "RaneNote 169 · RMS, dBu and dBFS", url: "https://www.ranecommercial.com/legacy/note169.html" },
  loudness: { name: "ITU-R BS.1770 · Loudness and true peak", url: "https://www.itu.int/rec/R-REC-BS.1770/en" },
  microphone: { name: "TI TIDU765 · Electret microphone preamplifier", url: "https://www.ti.com/lit/ug/tidu765/tidu765.pdf" },
  i2s: { name: "NXP UM11732 Rev. 3 · I2S bus specification", url: "https://www.nxp.com/docs/en/user-manual/UM11732.pdf" },
  amplifier: { name: "TI TPA3116D2 · Class-D amplifier datasheet", url: "https://www.ti.com/lit/ds/symlink/tpa3116d2.pdf" },
  crossover: { name: "Linkwitz Lab · Active filters and crossovers", url: "https://www.linkwitzlab.com/filters.htm" },
  asoc: { name: "Linux Kernel · ASoC overview", url: "https://docs.kernel.org/sound/soc/overview.html" },
  alsa: { name: "ALSA · PCM interface", url: "https://www.alsa-project.org/alsa-doc/alsa-lib/pcm.html" },
  pipewire: { name: "PipeWire · Processing graph overview", url: "https://pipewire.pages.freedesktop.org/pipewire/page_overview.html" },
  flac: { name: "RFC 9639 · FLAC", url: "https://www.rfc-editor.org/rfc/rfc9639" },
  opus: { name: "RFC 6716 · Opus", url: "https://www.rfc-editor.org/rfc/rfc6716" },
  speex: { name: "SpeexDSP · Preprocessing and echo cancellation", url: "https://speex.org/docs/manual/speex-manual/node7.html" },
  webrtc: { name: "WebRTC · Audio processing source code", url: "https://webrtc.googlesource.com/src/+/refs/heads/main/modules/audio_processing/" },
  rtc: { name: "RFC 7874 · WebRTC audio processing requirements", url: "https://www.rfc-editor.org/rfc/rfc7874" },
  bluetooth: { name: "Bluetooth SIG · LE Audio", url: "https://www.bluetooth.com/learn-about-bluetooth/feature-enhancements/le-audio/" },
  odas: { name: "ODAS · Sound localization, tracking and separation", url: "https://github.com/introlab/odas" },
  assist: { name: "Home Assistant · Assist pipelines", url: "https://contributors.home-assistant.io/core/internals/assist-pipelines/" }
} satisfies Record<string, Source>;

// Maintenance dates are explicit, not generated from the visitor's clock or build time.
export const topicCredibility: Record<TopicKey, Credibility> = {
  "sound-wave": {
    updatedAt: "2026-11-13", sources: [refs.sound, refs.webAudio],
    methods: [
      { kind: "calculation", scope: l("正弦波、频率、周期与波长。", "Sine values, frequency, period and wavelength.", "正弦波・周波数・周期・波長。", "정현파·주파수·주기·파장.") },
      { kind: "simulation", scope: l("空气粒子与传播的简化模型。传播试听：振源映射为 220 × 速度倍率 Hz 的合成纯音，幅度随行程与速度乘积变化；非观察面录音、非逐周期同步，未校准 SPL。", "Simplified particles and propagation. Propagation audio: a synthetic source tone at 220 × rate Hz, with amplitude proportional to stroke × rate; not a probe recording or cycle-synchronous playback, with no SPL calibration.", "空気粒子と伝播の簡略モデル。伝播の試聴：220 × 速度倍率 Hz の合成音、振幅は行程と速度の積に比例。観測面録音・周期同期ではなく、SPL 未校正。", "공기 입자와 전파의 단순 모델. 전파 소리: 220 × 속도 배율 Hz 합성음, 진폭은 이동량과 속도의 곱에 비례. 관측면 녹음이나 주기 동기화가 아니며 SPL 미보정.") },
      { kind: "illustration", scope: l("振膜、空气小体积与传播方向的动画。", "Animations of the diaphragm, air parcels and propagation direction.", "振動板・空気要素・伝播方向のアニメーション。", "진동판·공기 요소·전파 방향 애니메이션.") }
    ],
    assumptions: l("传播采用一维理想平面波，无反射或衰减；气体压缩使用等温硬球教学模型。位移、声压和时间尺度为可视化调整，不是实际空气分子的尺寸、速度或真实声场。", "Propagation uses a 1D ideal plane wave without reflections or attenuation; gas compression uses an isothermal hard-sphere teaching model. Displacement, pressure and time are rescaled, not molecular dimensions, speeds or a real acoustic field.", "伝播は反射・減衰のない一次元平面波、気体圧縮は等温剛体球の教育モデルです。変位・音圧・時間は可視化用で、実分子の寸法・速度や実音場ではありません。", "전파는 반사·감쇠가 없는 1차원 평면파, 기체 압축은 등온 강체 구 교육 모델입니다. 변위·음압·시간은 시각화 축척이며 실제 분자 크기·속도나 음장이 아닙니다.")
  },
  "wave-spectrum": {
    updatedAt: "2026-11-12", sources: [refs.fourier, refs.webAudio],
    methods: [{ kind: "calculation", scope: l("正弦分量叠加与对应频率、幅度。", "Sine summation and component frequency/amplitude.", "正弦成分の加算と周波数・振幅。", "정현파 합산과 성분 주파수·진폭.") }],
    assumptions: l("输入由已知正弦分量构造；分量线谱不是任意录音的 FFT，也不是随时间变化的 STFT 能量图。", "Inputs are known sine components; their line spectrum is not an FFT of arbitrary recordings or an STFT energy map.", "入力は既知の正弦成分です。線スペクトルは任意録音の FFT や STFT エネルギー図ではありません。", "입력은 알려진 정현파 성분이며 선 스펙트럼은 임의 녹음의 FFT나 STFT 에너지 맵이 아닙니다.")
  },
  "sampling-quantization": {
    updatedAt: "2026-11-12", sources: [refs.sampling],
    methods: [
      { kind: "calculation", scope: l("采样点、量化级、PCM 数值与数据率。", "Sample points, quantization levels, PCM values and data rates.", "標本点・量子化レベル・PCM 値・データ量。", "샘플점·양자화 레벨·PCM 값·데이터율.") },
      { kind: "simulation", scope: l("理想 ADC 与 DAC 重建过程。", "Ideal ADC and DAC reconstruction.", "理想 ADC と DAC の再構成。", "이상적 ADC와 DAC 복원.") }
    ],
    assumptions: l("使用合成信号和理想量化/重建模型；未测量实际转换器的噪声、非线性、时钟或模拟滤波器。", "Synthetic signals and ideal quantization/reconstruction models are used; converter noise, nonlinearity, clocks and analog filters are not measured.", "合成信号と理想量子化・再構成モデルを使い、実機の雑音・非線形・クロック・アナログフィルタは測定しません。", "합성 신호와 이상적 양자화·복원 모델을 사용하며 실제 변환기의 잡음·비선형·클록·아날로그 필터는 측정하지 않습니다.")
  },
  "audio-units": {
    updatedAt: "2026-11-12", sources: [refs.levels, refs.loudness],
    methods: [{ kind: "calculation", scope: l("参考量明确时的 dB、压力、电压、功率与距离换算。", "Reference-dependent dB, pressure, voltage, power and distance conversions.", "基準量を明示した dB・圧力・電圧・電力・距離の換算。", "기준량이 명시된 dB·압력·전압·전력·거리 환산.") }],
    assumptions: l("倍距约 -6 dB 只用于理想自由场点声源；dBFS 与 dBSPL 之间必须有设备校准，不能直接互换。", "About -6 dB per distance doubling assumes a free-field point source. dBFS-to-dBSPL conversion requires device calibration.", "距離倍増で約 -6 dB は自由音場の点音源を仮定します。dBFS と dBSPL の換算には実機校正が必要です。", "거리 두 배당 약 -6 dB는 자유음장 점음원을 가정합니다. dBFS와 dBSPL 환산에는 장비 교정이 필요합니다.")
  },
  "listening-metrics": {
    updatedAt: "2026-11-12", sources: [refs.webAudio, refs.loudness],
    methods: [
      { kind: "calculation", scope: l("合成音频的滤波、增益、失真与声道处理。", "Filtering, gain, distortion and channel processing of synthetic audio.", "合成音声のフィルタ・ゲイン・歪み・チャネル処理。", "합성 오디오의 필터·이득·왜곡·채널 처리.") },
      { kind: "simulation", scope: l("受控信号下的听感与指标对照。", "Perceptual comparisons using controlled signals.", "制御された信号による聴感比較。", "통제된 신호를 이용한 청감 비교.") }
    ],
    assumptions: l("试听依赖设备与播放电平；数字幅度不等于耳边声压。指标教学值不能替代校准测量或符合 BS.1770 的完整响度计。", "Playback depends on hardware and level; digital amplitude is not ear-level SPL. Teaching metrics do not replace calibrated measurements or a complete BS.1770 meter.", "聴感は機器と再生レベルに依存します。デジタル振幅は耳元音圧ではなく、教材値は校正測定や完全な BS.1770 メーターの代替ではありません。", "청감은 장비와 재생 레벨에 의존합니다. 디지털 진폭은 귀 위치 음압이 아니며 교육용 지표는 교정 측정이나 완전한 BS.1770 미터를 대신하지 않습니다.")
  },
  microphone: {
    updatedAt: "2026-11-12", sources: [refs.microphone],
    methods: [
      { kind: "calculation", scope: l("理想指向性、距离衰减与电压示例。", "Ideal polar response, distance attenuation and voltage examples.", "理想指向性・距離減衰・電圧の計算例。", "이상적 지향성·거리 감쇠·전압 예시.") },
      { kind: "illustration", scope: l("振膜、JFET、MEMS 与阵列信号路径。", "Diaphragm, JFET, MEMS and array signal paths.", "振動板・JFET・MEMS・アレイの信号経路。", "진동판·JFET·MEMS·어레이 신호 경로.") }
    ],
    assumptions: l("采用理想极坐标曲线和示例器件参数；真实指向性随频率变化，电压与偏置、负载、灵敏度有关，图示并非某款咪头实测。", "Ideal polar curves and example device parameters are used. Real response varies with frequency; voltage depends on bias, load and sensitivity, not a measured capsule here.", "理想指向性と例示パラメータを用います。実特性は周波数に依存し、電圧はバイアス・負荷・感度で変化します。実測ではありません。", "이상적 지향성과 예시 소자 값을 사용합니다. 실제 응답은 주파수에, 전압은 바이어스·부하·감도에 따라 달라지며 실측이 아닙니다.")
  },
  "digital-interface": {
    updatedAt: "2026-11-12", sources: [refs.i2s, { name: "TDK AN-000111 · PDM clocks and decimation", url: "https://invensense.tdk.com/wp-content/uploads/2016/05/AN-000111-PDM-Decimation-v1.0.pdf" }],
    methods: [
      { kind: "calculation", scope: l("按时隙宽度与通道配置计算时钟和负载。", "Clock and payload calculations from slot width and channel configuration.", "スロット幅とチャネル構成からクロック・負荷を計算。", "슬롯 폭과 채널 구성에 따른 클록·부하 계산.") },
      { kind: "illustration", scope: l("I2S、TDM、PDM、SPDIF 和 USB 数据流。", "I2S, TDM, PDM, SPDIF and USB data flow.", "I2S・TDM・PDM・SPDIF・USB データ流。", "I2S·TDM·PDM·SPDIF·USB 데이터 흐름.") }
    ],
    assumptions: l("图形不是逻辑分析仪采集；有效位深不必等于时隙宽度，MCLK 倍频和帧同步方式以具体器件规范为准。", "These are not logic-analyzer captures. Sample bit depth need not equal slot width; MCLK ratios and frame sync depend on the device specification.", "ロジックアナライザの実測ではありません。有効ビット数とスロット幅は異なり得ます。MCLK 比率と同期方式は実機仕様に従います。", "로직 분석기 캡처가 아닙니다. 유효 비트 깊이와 슬롯 폭은 다를 수 있으며 MCLK 배수와 프레임 동기는 기기 사양에 따릅니다.")
  },
  "amplifier-speaker": {
    updatedAt: "2026-11-12", sources: [refs.amplifier, refs.crossover, { name: "Analog Devices · Types of audio amplifiers", url: "https://www.analog.com/en/resources/technical-articles/types-of-audio-amplifiers.html" }],
    methods: [
      { kind: "calculation", scope: l("理想 Butterworth 电气低通的分频阶数曲线。", "Ideal Butterworth electrical low-pass curves for crossover orders.", "分岐次数ごとの理想 Butterworth 電気低域通過特性。", "크로스오버 차수별 이상적 Butterworth 전기 저역 통과 곡선.") },
      { kind: "illustration", scope: l("功放导通、PWM、扬声器结构、箱体和匹配关系。", "Amplifier conduction, PWM, speaker structure, enclosures and matching.", "増幅器導通・PWM・スピーカー構造・箱・整合関係。", "증폭기 도통·PWM·스피커 구조·인클로저·매칭 관계.") }
    ],
    assumptions: l("PWM 为放慢的脉宽示意；分频曲线不是扬声器声学响应。没有计算实物功率、SPL、箱体声场、阻抗全曲线或热压缩，也未验证产品额定性能。", "PWM is slowed for illustration; crossover curves are not speaker acoustic responses. Real power, SPL, enclosure acoustics, full impedance and thermal compression are not computed, nor are product ratings validated.", "PWM は低速の模式図で、分岐曲線はスピーカー音響応答ではありません。実電力・SPL・箱内音場・全インピーダンス・熱圧縮を計算せず、製品定格も検証しません。", "PWM은 느린 도식이며 크로스오버 곡선은 스피커 음향 응답이 아닙니다. 실제 전력·SPL·인클로저 음장·전체 임피던스·열 압축을 계산하거나 제품 정격을 검증하지 않습니다.")
  },
  "system-audio": {
    updatedAt: "2026-11-12", sources: [refs.asoc, refs.pipewire],
    methods: [{ kind: "illustration", scope: l("应用、中间件、驱动与硬件的播放和采集路径。", "Playback/capture paths across apps, middleware, drivers and hardware.", "アプリ・ミドルウェア・ドライバ・ハードウェアの再生／収録経路。", "앱·미들웨어·드라이버·하드웨어의 재생·캡처 경로.") }],
    assumptions: l("以 Linux 常见架构为例；中间件可被绕过，箭头不代表所有系统都采用同一进程、拷贝或调度方式。", "Linux is the example. Middleware may be bypassed; arrows do not prescribe identical processes, copying or scheduling on every system.", "Linux を例にします。ミドルウェアを迂回する場合もあり、矢印は全システム共通のプロセス・コピー・スケジューリングを意味しません。", "Linux를 예로 사용합니다. 미들웨어를 우회할 수 있으며 화살표는 모든 시스템의 동일한 프로세스·복사·스케줄링을 뜻하지 않습니다.")
  },
  alsa: {
    updatedAt: "2026-11-12", sources: [refs.alsa, refs.asoc],
    methods: [
      { kind: "calculation", scope: l("PCM 帧、period、buffer 和延迟换算。", "PCM frame, period, buffer and latency conversions.", "PCM フレーム・period・buffer・遅延の換算。", "PCM 프레임·period·buffer·지연 환산.") },
      { kind: "simulation", scope: l("读写指针、队列占用与 XRUN。", "Read/write pointers, occupancy and XRUN scenarios.", "読み書きポインタ・占有量・XRUN。", "읽기·쓰기 포인터·점유량·XRUN.") }
    ],
    assumptions: l("浏览器未连接 ALSA 驱动；环形缓冲按离散步骤推进，不包含目标内核、DMA、中断和调度的真实抖动。", "The browser is not connected to ALSA. The ring advances in discrete steps, excluding real kernel, DMA, interrupt and scheduling jitter.", "ブラウザは ALSA に接続していません。リングは離散的に進み、実カーネル・DMA・割り込み・スケジューリングの揺らぎを含みません。", "브라우저는 ALSA에 연결되지 않습니다. 링은 이산 단계로 진행하며 실제 커널·DMA·인터럽트·스케줄링 지터를 포함하지 않습니다.")
  },
  "realtime-audio": {
    updatedAt: "2026-11-12", sources: [refs.alsa, refs.speex],
    methods: [
      { kind: "calculation", scope: l("帧时长、处理预算和延迟估算。", "Frame duration, processing budgets and latency estimates.", "フレーム時間・処理予算・遅延の推定。", "프레임 길이·처리 예산·지연 추정.") },
      { kind: "simulation", scope: l("处理超时、缓冲和采集/播放链路。", "Deadline misses, buffers and capture/playback chains.", "締切超過・バッファ・収録／再生経路。", "마감 초과·버퍼·캡처/재생 경로.") }
    ],
    assumptions: l("预算与延迟使用设定参数；没有运行 SoC SDK、RTSP 服务或内核实时调度，不能据此保证目标设备的端到端时延。", "Budgets use configured values. No SoC SDK, RTSP server or real-time kernel scheduler is running; target end-to-end latency is not guaranteed.", "設定値で予算を計算します。SoC SDK・RTSP・リアルタイムカーネルは実行せず、実機の全体遅延を保証しません。", "설정값으로 예산을 계산합니다. SoC SDK·RTSP 서버·실시간 커널 스케줄러를 실행하지 않으며 대상 기기의 전체 지연을 보장하지 않습니다.")
  },
  "audio-codec": {
    updatedAt: "2026-11-12", sources: [refs.flac, refs.opus],
    methods: [
      { kind: "calculation", scope: l("PCM/码率预算、预测残差和简化编码算例。", "PCM/bitrate budgets, prediction residuals and simplified coding examples.", "PCM・ビットレート予算、予測残差、簡略符号化例。", "PCM·비트레이트 예산, 예측 잔차, 단순 코딩 예시.") },
      { kind: "illustration", scope: l("编码与解码的数据表示转换。", "Data representations through encoding and decoding.", "符号化・復号でのデータ表現の変化。", "인코딩·디코딩의 데이터 표현 변화.") }
    ],
    assumptions: l("示例不是完整 MP3/AAC/Opus/FLAC 编码器；压缩率依赖输入与配置，预测残差更小也不必然使完整文件更小。", "Examples are not complete MP3/AAC/Opus/FLAC encoders. Ratios depend on content/settings; smaller residuals alone do not guarantee a smaller file.", "完全な MP3/AAC/Opus/FLAC エンコーダではありません。圧縮率は入力・設定に依存し、残差が小さくてもファイルが小さくなるとは限りません。", "완전한 MP3/AAC/Opus/FLAC 인코더가 아닙니다. 압축률은 입력·설정에 의존하며 작은 잔차만으로 작은 파일을 보장하지 않습니다.")
  },
  "core-signal-processing": {
    updatedAt: "2026-11-12", sources: [refs.fourier, refs.filters, { name: "W3C · Audio EQ Cookbook (RBJ biquads)", url: "https://www.w3.org/TR/audio-eq-cookbook/" }],
    methods: [{ kind: "calculation", scope: l("合成 PCM 的直接 DFT / STFT、RBJ 滤波和静态动态处理曲线。", "Direct DFT / STFT, RBJ filters and static dynamics curves on synthetic PCM.", "合成 PCM の直接 DFT / STFT・RBJ フィルタ・静的ダイナミクス曲線。", "합성 PCM의 직접 DFT / STFT·RBJ 필터·정적 다이내믹 곡선.") }],
    assumptions: l("频谱采用有限点数直接 DFT，不是 FFT 性能实现；动态曲线不包含完整 attack/release 或限幅器。频谱幅度、功率与 PSD 不能混用，示例耗时不是目标硬件性能。", "Spectra use bounded direct DFT, not an FFT performance implementation; dynamics omit full attack/release and limiting. Spectral amplitude, power and PSD differ; demo timing is not target-hardware performance.", "スペクトルは有限点数の直接 DFT で FFT 性能実装ではなく、完全な attack/release・リミッターを含みません。振幅・パワー・PSD は異なり、デモ時間は実機性能ではありません。", "스펙트럼은 유한 점수의 직접 DFT이며 FFT 성능 구현이 아닙니다. 완전한 attack/release·리미터는 포함하지 않습니다. 진폭·전력·PSD는 다르며 데모 시간은 하드웨어 성능이 아닙니다.")
  },
  "speech-enhancement": {
    updatedAt: "2026-11-12", sources: [refs.webrtc, refs.speex],
    methods: [{ kind: "simulation", scope: l("合成多麦、AEC、NS/ANR、去混响和 AGC 阶段。", "Synthetic multichannel, AEC, NS/ANR, dereverberation and AGC stages.", "合成多チャネル・AEC・NS/ANR・残響除去・AGC の段階。", "합성 다중 채널·AEC·NS/ANR·잔향 제거·AGC 단계.") }],
    assumptions: l("演示知道合成语音、噪声和回声各成分；这不是实际产品的盲分离或自适应 AEC，强度滑块不是 ERLE、MOS 或 SDK 性能。", "The demo knows the synthetic speech, noise and echo components. It is not blind separation or production adaptive AEC; strength is not ERLE, MOS or SDK performance.", "合成音声・雑音・エコーの成分を既知としています。盲分離や製品版適応 AEC ではなく、強度は ERLE・MOS・SDK 性能ではありません。", "합성 음성·잡음·에코 성분을 알고 있는 데모입니다. 실제 블라인드 분리나 적응 AEC가 아니며 강도는 ERLE·MOS·SDK 성능이 아닙니다.")
  },
  "spatial-audio": {
    updatedAt: "2026-11-12", sources: [refs.webAudio],
    methods: [
      { kind: "calculation", scope: l("方向、距离、耳间时差与增益关系。", "Direction, distance, interaural time and gain relations.", "方向・距離・両耳間時間差・ゲインの関係。", "방향·거리·양이간 시간차·이득 관계.") },
      { kind: "simulation", scope: l("简化头部与房间反射模型。", "Simplified head and room-reflection models.", "頭部と室内反射の簡略モデル。", "머리와 실내 반사의 단순 모델.") }
    ],
    assumptions: l("方向与反射采用简化几何；不是个人 HRTF 测量或完整房间声场求解，图中数值不保证实际定位效果。", "Direction/reflections use simplified geometry, not personalized HRTF measurement or a full room-acoustic solver. Values do not guarantee real localization.", "方向・反射は簡略幾何です。個人 HRTF 測定や完全な室内音場解析ではなく、実際の定位を保証しません。", "방향·반사는 단순 기하 모델입니다. 개인 HRTF 측정이나 완전한 실내 음장 해석이 아니며 실제 정위 효과를 보장하지 않습니다.")
  },
  "meeting-communication": {
    updatedAt: "2026-11-12", sources: [refs.rtc, refs.webrtc],
    methods: [{ kind: "illustration", scope: l("会议设备布局、播放回采与通信链路。", "Conference layout, playback reference and communication paths.", "会議機器配置・再生参照・通信経路。", "회의 장비 배치·재생 참조·통신 경로.") }],
    assumptions: l("按典型场景解释系统职责，不运行真实网络会议，也不承诺具体设备覆盖范围或回声消除指标。", "Typical scenarios explain responsibilities without running a live conference or guaranteeing device coverage or echo-cancellation metrics.", "典型例で役割を説明し、実会議を実行したり機器の収音範囲・エコー除去性能を保証したりしません。", "전형적 시나리오로 역할을 설명하며 실제 회의를 실행하거나 장비 수음 범위·에코 제거 성능을 보장하지 않습니다.")
  },
  "bluetooth-audio": {
    updatedAt: "2026-11-12", sources: [refs.bluetooth],
    methods: [
      { kind: "calculation", scope: l("码率、包负载与缓冲时长。", "Bitrates, packet payload and buffer duration.", "ビットレート・パケット負荷・バッファ時間。", "비트레이트·패킷 부하·버퍼 시간.") },
      { kind: "simulation", scope: l("链路条件、重传与播放截止时间。", "Link conditions, retransmission and playback deadlines.", "リンク条件・再送・再生締切。", "링크 조건·재전송·재생 마감.") }
    ],
    assumptions: l("使用预设链路条件而非真实蓝牙射频；编码延迟、重传策略与设备配置相关，估算不代表认证测试结果。", "Preset link conditions replace real Bluetooth radio. Codec delay and retries depend on configuration; estimates are not certification results.", "実無線ではなく設定済みリンク条件を用います。遅延・再送は構成に依存し、推定は認証試験結果ではありません。", "실제 블루투스 무선 대신 설정된 링크 조건을 사용합니다. 지연·재전송은 구성에 의존하며 추정값은 인증 시험 결과가 아닙니다.")
  },
  "robot-audio": {
    updatedAt: "2026-11-12", sources: [refs.odas],
    methods: [{ kind: "illustration", scope: l("麦克风、扬声器、自噪声和机器人交互链路。", "Microphones, speakers, self-noise and robot interaction paths.", "マイク・スピーカー・自己雑音・ロボット対話経路。", "마이크·스피커·자체 잡음·로봇 상호작용 경로.") }],
    assumptions: l("机器人外形与部件位置为教学布局，未运行定位、导航或语音模型，不代表特定产品的实测声学性能。", "Robot geometry and part locations are illustrative; no localization, navigation or speech model is running, and no product acoustics are measured.", "形状・部品位置は教材配置です。定位・ナビ・音声モデルを実行せず、製品音響の実測ではありません。", "로봇 형태와 부품 위치는 교육용입니다. 정위·내비게이션·음성 모델을 실행하지 않으며 제품 음향 실측이 아닙니다.")
  },
  "automotive-audio": {
    updatedAt: "2026-11-12", sources: [{ name: "Kardome · In-cabin voice UI and voice zones", url: "https://www.kardome.com/resources/blog/kardome-automotive-in-cabin-voice-ui/" }, { name: "Bose Automotive · Active sound management and road noise control", url: "https://automotive.bose.com/technology-systems/active-sound-management" }],
    methods: [{ kind: "illustration", scope: l("座舱麦克风、扬声器、语音助手与 ANC 链路。", "Cabin microphones, speakers, voice assistants and ANC paths.", "車室マイク・スピーカー・音声アシスタント・ANC 経路。", "실내 마이크·스피커·음성 비서·ANC 경로.") }],
    assumptions: l("车厢与声区为示意布局；没有求解车内声场或运行实车 ANC，不能据此推断降噪分贝或座位隔离度。", "Cabin and zones are schematic. No cabin acoustic field or vehicle ANC is solved; noise reduction and seat isolation cannot be inferred.", "車室・ゾーンは模式配置です。実車音場や ANC を計算せず、低減 dB や座席間分離を推定できません。", "실내와 음향 구역은 도식입니다. 실차 음장이나 ANC를 계산하지 않으므로 저감 dB나 좌석 간 분리도를 추정할 수 없습니다.")
  },
  "iot-content": {
    updatedAt: "2026-11-12", sources: [refs.assist, refs.loudness],
    methods: [{ kind: "illustration", scope: l("设备语音交互、录制与内容交付工作流。", "Device voice interaction, recording and delivery workflows.", "機器音声対話・録音・配信のワークフロー。", "기기 음성 상호작용·녹음·배포 워크플로.") }],
    assumptions: l("工作流是典型工程方案，不表示网页已连接智能家居或完成内容响度合规检测。", "Workflows are engineering examples, not a live smart-home connection or a loudness-compliance test.", "ワークフローは実装例であり、スマートホーム実接続やラウドネス適合検査ではありません。", "워크플로는 엔지니어링 예시이며 실제 스마트홈 연결이나 라우드니스 적합성 시험이 아닙니다.")
  },
  "ai-overview": {
    updatedAt: "2026-11-12", model: "overview", sources: aiModelReferences.overview.sources,
    methods: [
      { kind: "calculation", scope: l("标量损失与梯度下降算例。", "Scalar loss and gradient-descent examples.", "スカラー損失と勾配降下の計算例。", "스칼라 손실·경사 하강 계산 예시.") },
      { kind: "illustration", scope: l("任务流程、特征、示例 token 与掩码。", "Task flows, features, example tokens and masks.", "タスク経路・特徴・例示 token・マスク。", "작업 흐름·특징·예시 token·마스크.") }
    ],
    assumptions: l("训练演示是单变量 L=(w-0.8)^2；图中的特征、token 和掩码不是 Qwen3-Omni 的实际中间结果。", "Training uses the scalar loss L=(w-0.8)^2. Features, tokens and masks are not Qwen3-Omni intermediate outputs.", "学習例は単変数の L=(w-0.8)^2 です。特徴・token・マスクは Qwen3-Omni の実中間出力ではありません。", "학습 예시는 단일 변수 L=(w-0.8)^2입니다. 특징·token·마스크는 Qwen3-Omni의 실제 중간 출력이 아닙니다.")
  },
  "ai-asr": {
    updatedAt: "2026-11-12", model: "asr", sources: aiModelReferences.asr.sources,
    methods: [
      { kind: "calculation", scope: l("预置分数上的 softmax、CTC 合并和路径处理。", "Softmax, CTC collapsing and paths from preset scores.", "設定済みスコアの softmax・CTC 統合・経路処理。", "사전 설정 점수의 softmax·CTC 병합·경로 처리.") },
      { kind: "simulation", scope: l("玩具词表、logits、注意力与 RNN-T 动作。", "Toy vocabulary, logits, attention and RNN-T actions.", "小規模語彙・logits・注意・RNN-T 動作。", "소규모 어휘·logits·어텐션·RNN-T 동작.") }
    ],
    assumptions: l("输入路径与分数为手工示例，没有音频编码器推理；滑块变化不能表示真实转写准确率，也不是 Qwen3-ASR 的 CTC 实现。", "Paths and scores are hand-built, without audio-encoder inference. Sliders do not measure transcription accuracy; the CTC example is not Qwen3-ASR's decoder.", "経路とスコアは手作りで、音声エンコーダ推論はありません。スライダーは認識精度を測らず、CTC 例は Qwen3-ASR の復号器ではありません。", "경로·점수는 수작업 예시이며 오디오 인코더 추론이 없습니다. 슬라이더는 전사 정확도를 측정하지 않으며 CTC 예시는 Qwen3-ASR 디코더가 아닙니다.")
  },
  "ai-tts": {
    updatedAt: "2026-11-12", model: "tts", sources: aiModelReferences.tts.sources,
    methods: [
      { kind: "calculation", scope: l("固定音素时长展开与帧数预算。", "Expansion of fixed phoneme durations and frame budgets.", "固定音素長の展開とフレーム数の計算。", "고정 음소 길이 확장과 프레임 예산.") },
      { kind: "illustration", scope: l("FastSpeech、flow matching 与语音 token 路线。", "FastSpeech, flow-matching and speech-token routes.", "FastSpeech・flow matching・音声 token の経路。", "FastSpeech·flow matching·음성 token 경로.") }
    ],
    assumptions: l("音素、时长和帧预算是教学设定；未运行 G2P、时长预测器、声码器或 codec 解码器，不生成真实合成语音。", "Phonemes, durations and budgets are teaching settings. No G2P, duration predictor, vocoder or codec decoder runs, and no speech is synthesized.", "音素・長さ・フレーム予算は教材設定です。G2P・長さ予測・ボコーダ・codec 復号器を実行せず、音声を合成しません。", "음소·길이·프레임 예산은 교육용 설정입니다. G2P·길이 예측기·보코더·codec 디코더를 실행하지 않으며 음성을 합성하지 않습니다.")
  },
  "ai-generation": {
    updatedAt: "2026-11-12", model: "generation", sources: aiModelReferences.generation.sources,
    methods: [
      { kind: "calculation", scope: l("给定时长与名义速率的序列预算。", "Sequence budgets from duration and nominal rates.", "長さと公称レートによる系列サイズ計算。", "길이와 명목 속도에 따른 시퀀스 예산.") },
      { kind: "illustration", scope: l("条件、latent 迭代与波形解码阶段。", "Conditioning, latent iterations and waveform decoding.", "条件・latent 反復・波形復号の段階。", "조건·latent 반복·파형 디코딩 단계.") }
    ],
    assumptions: l("latent 图形与迭代次数不是模型状态；未运行 ACE-Step 或 Stable Audio，也未生成音频。序列长度不等于算力或质量。", "Latent blocks and iteration counts are not model states. Neither ACE-Step nor Stable Audio runs or generates audio. Sequence length is not compute cost or quality.", "latent 図や反復数は実モデル状態ではありません。ACE-Step・Stable Audio は実行せず、音声も生成しません。系列長は計算量や品質ではありません。", "latent 도형·반복 횟수는 실제 모델 상태가 아닙니다. ACE-Step·Stable Audio를 실행하거나 오디오를 생성하지 않습니다. 시퀀스 길이는 연산량·품질이 아닙니다.")
  },
  "ai-event": {
    updatedAt: "2026-11-12", model: "event", sources: aiModelReferences.event.sources,
    methods: [
      { kind: "calculation", scope: l("阈值判定、连续区间合并与短事件过滤。", "Thresholds, contiguous event merging and short-event filtering.", "閾値判定・連続区間の統合・短イベント除去。", "임계값 판정·연속 구간 병합·짧은 이벤트 필터링.") },
      { kind: "simulation", scope: l("6 秒场景中预设的类别分数与参考区间。", "Preset class scores and reference intervals in a six-second scene.", "6 秒シーンの設定済みクラススコアと参照区間。", "6초 장면의 사전 설정 클래스 점수와 참조 구간.") }
    ],
    assumptions: l("使用 0.5 秒时间格和预置分数，未运行 ATST-F；结果不能外推为模型的真实误报率、延迟或 DCASE 指标。", "Scores are presets on 0.5-second bins, not ATST-F inference. Results cannot establish real false-alarm rates, latency or DCASE metrics.", "0.5 秒単位の設定済みスコアであり、ATST-F 推論ではありません。実誤報率・遅延・DCASE 指標を示しません。", "0.5초 구간의 사전 설정 점수이며 ATST-F 추론이 아닙니다. 실제 오탐률·지연·DCASE 지표로 일반화할 수 없습니다.")
  },
  "ai-enhancement": {
    updatedAt: "2026-11-12", model: "enhancement", sources: [
      ...aiModelReferences.enhancement.sources,
      { name: "Teaching CNN · reproducible data-generation script", url: "https://github.com/cpw640530/audio-technology-sharing/blob/main/scripts/generate-ai-denoise-demo.py" }
    ],
    methods: [
      { kind: "calculation", scope: l("离线教学 CNN 训练/推理；浏览器复算所选帧的卷积、head 与 sigmoid。", "Offline teaching-CNN training/inference; browser recomputation of selected-frame convolution, head and sigmoid.", "教材 CNN のオフライン学習・推論と、選択フレームの畳み込み・head・sigmoid のブラウザ再計算。", "교육용 CNN의 오프라인 학습·추론 및 선택 프레임의 합성곱·head·sigmoid 브라우저 재계산.") },
      { kind: "simulation", scope: l("合成谐波与白噪声上的降噪教学数据。", "Denoising examples using synthetic harmonics and white noise.", "合成倍音と白色雑音によるノイズ除去教材。", "합성 고조파·백색 잡음을 이용한 잡음 제거 예시.") }
    ],
    assumptions: l("8 kHz、256 点 Hann 窗、hop 128；数据来自 24 条合成训练样本及留出片段。页面载入预计算结果，不是 DPDFNet 全量在线推理，也未验证真实语音泛化。", "8 kHz, 256-point Hann windows, hop 128; 24 synthetic training examples plus held-out clips. The page loads precomputed results, not full online DPDFNet inference; real-speech generalization is unvalidated.", "8 kHz・256 点 Hann 窓・hop 128、合成学習例 24 本と留保クリップを使います。事前計算結果であり、DPDFNet の全体推論や実音声への汎化検証ではありません。", "8 kHz·256점 Hann 창·hop 128, 합성 학습 예시 24개와 별도 평가 클립을 사용합니다. 사전 계산 결과이며 DPDFNet 전체 온라인 추론이나 실제 음성 일반화 검증이 아닙니다.")
  },
  "ai-codec": {
    updatedAt: "2026-11-12", model: "codec", sources: aiModelReferences.codec.sources,
    methods: [{ kind: "illustration", scope: l("编码器、VQ/RVQ 码本与解码器的原理图解。", "Encoder, VQ/RVQ codebook and decoder principles.", "エンコーダ・VQ/RVQ コードブック・デコーダの原理図。", "인코더·VQ/RVQ 코드북·디코더 원리 도식.") }],
    assumptions: l("未运行神经 codec 或真实码本搜索；码率公式假设等大小码本和定长索引，实际码率还受熵编码、封包和辅助信息影响。", "No neural codec or real codebook search runs. Bitrate formulas assume equal-sized codebooks and fixed-length indices; entropy coding, packets and side information alter actual rates.", "ニューラル codec や実コードブック探索は実行しません。式は同サイズのコードブックと固定長索引を仮定し、実ビットレートにはエントロピー符号化・封包・補助情報が影響します。", "신경 codec이나 실제 코드북 탐색을 실행하지 않습니다. 식은 동일 크기 코드북·고정 길이 인덱스를 가정하며 실제 비트레이트에는 엔트로피 코딩·패킷·부가 정보가 영향을 줍니다.")
  }
};
