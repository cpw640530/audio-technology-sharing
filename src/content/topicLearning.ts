import type { LocalizedText } from "./knowledge";
import type { TopicKey } from "./relatedTopics";
import { traditional } from "./traditional";

export type TopicLearning = {
  prerequisite?: TopicKey;
  prerequisiteNote: LocalizedText;
  question: LocalizedText;
  next: TopicKey;
  transition: LocalizedText;
  labTask?: LocalizedText;
};

const l = (zh: string, en: string, ja: string, ko: string): LocalizedText => ({ zh, "zh-Hant": traditional(zh), en, ja, ko });

export const topicLearning: Record<TopicKey, TopicLearning> = {
  "sound-wave": {
    prerequisiteNote: l("无需预备知识，从一次振动开始。", "No prior knowledge needed: start with a vibration.", "予備知識は不要です。一つの振動から始めます。", "사전 지식 없이 하나의 진동에서 시작합니다."),
    question: l("声音怎样产生、传播，又怎样用频率和振幅描述？", "How is sound produced, propagated, and described by frequency and amplitude?", "音はどう生まれて伝わり、周波数と振幅でどう表されるのでしょうか。", "소리는 어떻게 발생하고 전달되며 주파수와 진폭으로 표현될까요?"),
    next: "wave-spectrum",
    transition: l("理解一次振动后，再看复杂声音里同时有哪些频率。", "After one vibration, explore the frequencies present together in a complex sound.", "一つの振動の次に、複雑な音に含まれる周波数を見ます。", "하나의 진동 다음에는 복합음에 함께 존재하는 주파수를 살펴봅니다."),
    labTask: l("分别改变频率和振幅，对照周期和高度；相位改变波形起点，不等于纯音变响。", "Change frequency and amplitude separately to compare period and height; phase shifts the starting point, not a pure tone's level.", "周波数と振幅を別々に変え、周期と高さを比較します。位相は開始位置を変え、純音の音量を変えません。", "주파수와 진폭을 따로 바꿔 주기와 높이를 비교합니다. 위상은 시작 위치를 바꾸며 순음의 음량을 바꾸지 않습니다.")
  },
  "wave-spectrum": {
    prerequisite: "sound-wave",
    prerequisiteNote: l("先认识频率、振幅和相位。", "Start with frequency, amplitude, and phase.", "周波数・振幅・位相を先に確認します。", "주파수, 진폭, 위상을 먼저 이해합니다."),
    question: l("同一个声音，波形、频谱和时频图分别告诉我们什么？", "What do waveform, spectrum, and spectrogram reveal about the same sound?", "同じ音の波形・スペクトル・時間周波数図は何を示すのでしょうか。", "같은 소리의 파형, 스펙트럼, 스펙트로그램은 각각 무엇을 보여 줄까요?"),
    next: "sampling-quantization",
    transition: l("会读连续波形后，再看计算机怎样把它存成离散数值。", "Once you can read a continuous waveform, see how a computer stores it as discrete values.", "連続波形を読めたら、計算機が離散値として保存する方法へ進みます。", "연속 파형을 읽은 뒤 컴퓨터가 이를 이산 값으로 저장하는 방법을 봅니다."),
    labTask: l("改变一个分量的振幅或相位，对照合成波形与幅度谱，区分形状变化和频率成分变化。", "Change one component's amplitude or phase; compare the sum and magnitude spectrum to distinguish shape from frequency content.", "一成分の振幅や位相を変え、合成波形と振幅スペクトルで形と成分の違いを比べます。", "한 성분의 진폭이나 위상을 바꿔 합성 파형과 크기 스펙트럼에서 모양과 주파수 성분의 차이를 비교합니다.")
  },
  "sampling-quantization": {
    prerequisite: "wave-spectrum",
    prerequisiteNote: l("先分清时间轴上的变化与频率成分。", "Distinguish changes over time from frequency components.", "時間変化と周波数成分を区別します。", "시간 변화와 주파수 성분을 구분합니다."),
    question: l("采样、量化和 PCM 编码各解决什么，DAC 又如何重建模拟信号？", "What do sampling, quantization, and PCM encoding each do, and how does a DAC reconstruct an analog signal?", "標本化・量子化・PCM 符号化の役割と DAC の再構成とは何でしょうか。", "샘플링, 양자화, PCM 인코딩의 역할은 무엇이며 DAC는 아날로그 신호를 어떻게 복원할까요?"),
    next: "audio-units",
    transition: l("得到 PCM 后，需要分清数字电平、电压与声压各自的参考基准。", "With PCM established, distinguish the reference levels for digital amplitude, voltage, and sound pressure.", "PCM の次に、デジタルレベル・電圧・音圧の基準を区別します。", "PCM을 이해한 뒤 디지털 레벨, 전압, 음압의 기준을 구분합니다."),
    labTask: l("分别改变输入频率、采样点数和位深，追踪采样点、量化阶梯、PCM 码值；再切到 DAC 看重建。", "Vary input frequency, sample count, and bit depth separately; trace samples, quantized steps, and PCM codes, then switch to DAC reconstruction.", "入力周波数・標本数・ビット深度を別々に変え、標本点・量子化段・PCM 値を追い、DAC 再構成へ切り替えます。", "입력 주파수, 샘플 수, 비트 깊이를 따로 바꾸며 샘플, 양자화 단계, PCM 값을 추적한 뒤 DAC 복원을 봅니다.")
  },
  "audio-units": {
    prerequisite: "sampling-quantization",
    prerequisiteNote: l("先理解 PCM 数值和满刻度。", "Understand PCM values and full scale first.", "PCM 値とフルスケールを確認します。", "PCM 값과 풀 스케일을 먼저 이해합니다."),
    question: l("dB 的参考量是什么，哪些单位能直接换算，哪些必须先标定？", "What does each dB reference mean, and which conversions require calibration?", "各 dB の基準は何で、どの換算に校正が必要でしょうか。", "각 dB의 기준은 무엇이며 어떤 환산에 교정이 필요할까요?"),
    next: "listening-metrics",
    transition: l("分清单位后，再判断信噪比、响度和失真读数能解释哪些听感。", "With units clear, examine what SNR, loudness, and distortion measurements tell us about perception.", "単位の次に、SNR・ラウドネス・歪みの値と聴感の関係を見ます。", "단위 다음에는 SNR, 라우드니스, 왜곡 수치와 청감의 관계를 봅니다."),
    labTask: l("输入电平和距离，核对换算前提；比较倍距衰减，避免把 dBFS 直接当成 dBSPL。", "Enter level and distance, check conversion assumptions, and compare distance doubling without treating dBFS as dBSPL.", "レベルと距離を入力し換算条件を確認します。距離倍増の減衰を比較し、dBFS と dBSPL を混同しません。", "레벨과 거리를 입력해 환산 조건과 거리 두 배의 감쇠를 확인하고 dBFS를 dBSPL로 간주하지 않습니다.")
  },
  "listening-metrics": {
    prerequisite: "audio-units",
    prerequisiteNote: l("先区分声压级、数字电平与响度单位。", "Distinguish sound-pressure level, digital level, and loudness units.", "音圧レベル・デジタルレベル・ラウドネス単位を区別します。", "음압 레벨, 디지털 레벨, 라우드니스 단위를 구분합니다."),
    question: l("听起来亮、浑浊、吵或失真，分别对应什么信号变化？", "Which signal changes cause brightness, muddiness, noise, or distortion?", "明るさ・こもり・ノイズ・歪みはどの信号変化に対応するのでしょうか。", "밝음, 탁함, 잡음, 왜곡은 어떤 신호 변화에 해당할까요?"),
    next: "core-signal-processing",
    transition: l("识别问题后，再学习用滤波、EQ 和动态处理主动改变信号。", "After identifying a problem, learn how filters, EQ, and dynamics modify the signal.", "問題を識別したら、フィルター・EQ・ダイナミクスで信号を変える方法へ進みます。", "문제를 식별한 뒤 필터, EQ, 다이내믹 처리로 신호를 바꾸는 방법을 배웁니다."),
    labTask: l("逐项改变效果强度，比较处理前后波形、读数与短音；不要只凭波形高度判断音质。", "Vary one effect at a time and compare waveforms, readings, and short audio; waveform height alone is not sound quality.", "効果を一つずつ変えて波形・数値・短い音を比較します。波形の高さだけで音質を判断しません。", "효과를 하나씩 바꾸며 파형, 수치, 짧은 소리를 비교합니다. 파형 높이만으로 음질을 판단하지 않습니다.")
  },
  microphone: {
    prerequisite: "sound-wave",
    prerequisiteNote: l("先理解声压变化如何推动振膜。", "Understand how pressure changes move a diaphragm.", "音圧変化が振動板を動かす仕組みを確認します。", "음압 변화가 진동판을 움직이는 원리를 이해합니다."),
    question: l("不同麦克风如何换能，指向性和参数如何影响选型？", "How do microphone types transduce sound, and how do patterns and specifications guide selection?", "マイクの変換原理と指向性・仕様は選定にどう関わるのでしょうか。", "마이크 종류별 변환 원리와 지향성, 사양은 선택에 어떤 영향을 줄까요?"),
    next: "digital-interface",
    transition: l("麦克风信号完成数字化后，接口决定这些数据如何送到处理器。", "Once microphone signals are digitized, interfaces determine how data reaches the processor.", "マイク信号をデジタル化した後は、インターフェースがプロセッサーへの伝送を担います。", "마이크 신호를 디지털화한 다음 인터페이스가 프로세서로 데이터를 전달합니다."),
    labTask: l("比较换能流程中的数值，再改变指向、距离和增益，观察拾音电平与削波风险。", "Compare values along transduction, then change pattern, distance, and gain to observe pickup level and clipping risk.", "変換経路の数値を比べ、指向性・距離・ゲインで収音レベルとクリッピングの危険を見ます。", "변환 경로의 값을 비교하고 지향성, 거리, 게인으로 수음 레벨과 클리핑 위험을 관찰합니다.")
  },
  "digital-interface": {
    prerequisite: "sampling-quantization",
    prerequisiteNote: l("先理解 PCM 样本、位深和声道。", "Start with PCM samples, bit depth, and channels.", "PCM サンプル・ビット深度・チャンネルを確認します。", "PCM 샘플, 비트 깊이, 채널을 먼저 이해합니다."),
    question: l("样本内容、时钟和帧边界如何一起保证数字音频正确传输？", "How do sample data, clocks, and framing make digital audio transport work?", "サンプル・クロック・フレーム境界は正しい音声伝送をどう支えるのでしょうか。", "샘플 데이터, 클록, 프레임 경계는 정확한 오디오 전송을 어떻게 보장할까요?"),
    next: "system-audio",
    transition: l("硬件接口送达数据后，还需要操作系统把设备与应用连接起来。", "After hardware transports data, the operating system must connect devices to applications.", "ハードウェアでデータを運んだ後、OS が機器とアプリを接続します。", "하드웨어가 데이터를 전달한 뒤 운영체제가 장치와 앱을 연결합니다."),
    labTask: l("切换协议，核对数据线、帧边界和时钟；在 I2S/TDM 中改变配置，比较 slot 与有效位数。", "Switch protocols to inspect data lines, framing, and clocks; vary I2S/TDM settings to compare slots with valid bits.", "プロトコルを切り替えて配線・フレーム・クロックを確認し、I2S/TDM の設定でスロットと有効ビットを比べます。", "프로토콜을 바꿔 데이터선, 프레임, 클록을 확인하고 I2S/TDM 설정으로 슬롯과 유효 비트를 비교합니다.")
  },
  "amplifier-speaker": {
    prerequisite: "sound-wave",
    prerequisiteNote: l("先理解振膜振动与声压传播。", "Understand diaphragm motion and pressure-wave propagation.", "振動板の振動と音圧の伝播を確認します。", "진동판 진동과 음압 전파를 이해합니다."),
    question: l("功放、单元、箱体和分频怎样共同把电信号变成声音？", "How do amplifier, driver, enclosure, and crossover turn an electrical signal into sound?", "アンプ・ユニット・箱・クロスオーバーは電気信号をどう音に変えるのでしょうか。", "앰프, 드라이버, 인클로저, 크로스오버는 전기 신호를 어떻게 소리로 바꿀까요?"),
    next: "spatial-audio",
    transition: l("单个扬声器能发声后，再看多个声源怎样形成方向和空间感。", "After one speaker produces sound, explore how multiple sources create direction and space.", "一つのスピーカーの次に、複数音源による方向と空間感を見ます。", "한 스피커 다음에는 여러 음원이 만드는 방향과 공간감을 봅니다."),
    labTask: l("比较 A/AB/D 类示意、箱体和分频响应，再检查功率、阻抗与灵敏度的匹配。", "Compare A/AB/D illustrations, enclosure and crossover responses, then examine power, impedance, and sensitivity matching.", "A/AB/D 級の図と箱・クロスオーバーの応答を比べ、電力・インピーダンス・感度の整合を確認します。", "A/AB/D급 도해와 인클로저, 크로스오버 응답을 비교하고 전력, 임피던스, 감도 매칭을 확인합니다.")
  },
  "system-audio": {
    prerequisite: "sampling-quantization",
    prerequisiteNote: l("先知道应用交付的是带格式的 PCM 帧。", "Know that applications exchange PCM frames with a defined format.", "アプリが形式の決まった PCM フレームを渡すことを確認します。", "앱이 정해진 형식의 PCM 프레임을 주고받는다는 점을 이해합니다."),
    question: l("应用、服务、驱动和硬件分别负责什么，播放和采集如何贯通？", "What do applications, services, drivers, and hardware each do in playback and capture?", "再生と収録でアプリ・サービス・ドライバー・ハードウェアは何を担当するのでしょうか。", "재생과 캡처에서 앱, 서비스, 드라이버, 하드웨어는 각각 무엇을 담당할까요?"),
    next: "alsa",
    transition: l("明确各层职责后，用 Linux ALSA 具体追踪设备、PCM 接口和缓冲。", "With the layers clear, trace devices, PCM interfaces, and buffering in Linux ALSA.", "各層の役割を確認したら、Linux ALSA の機器・PCM・バッファーを追います。", "계층별 역할을 이해한 뒤 Linux ALSA의 장치, PCM 인터페이스, 버퍼를 추적합니다.")
  },
  alsa: {
    prerequisite: "system-audio",
    prerequisiteNote: l("先分清应用、音频服务和内核驱动。", "Distinguish applications, audio services, and kernel drivers.", "アプリ・音声サービス・カーネルドライバーを区別します。", "앱, 오디오 서비스, 커널 드라이버를 구분합니다."),
    question: l("ALSA 如何通过 PCM 接口和环形缓冲协调应用与硬件？", "How does ALSA coordinate applications and hardware through PCM interfaces and ring buffers?", "ALSA は PCM とリングバッファーでアプリとハードウェアをどう調整するのでしょうか。", "ALSA는 PCM 인터페이스와 링 버퍼로 앱과 하드웨어를 어떻게 조율할까요?"),
    next: "realtime-audio",
    transition: l("理解读写指针后，再把算法耗时、调度和编码攒帧加入时延预算。", "With read/write pointers understood, add processing, scheduling, and codec framing to the latency budget.", "読み書きポインターの次に、処理・スケジューリング・符号化のフレーム蓄積を遅延予算に加えます。", "읽기·쓰기 포인터 다음에는 처리, 스케줄링, 코덱 프레임 축적을 지연 예산에 포함합니다."),
    labTask: l("切换播放与采集，移动环形缓冲指针，比较可读、可写空间及 XRUN 条件。", "Switch playback and capture, move ring-buffer pointers, and compare readable/writable space and XRUN conditions.", "再生と収録を切り替え、リングのポインターで読み書き可能量と XRUN 条件を比べます。", "재생과 캡처를 전환하고 링 버퍼 포인터로 읽기·쓰기 공간과 XRUN 조건을 비교합니다.")
  },
  "realtime-audio": {
    prerequisite: "alsa",
    prerequisiteNote: l("先理解 period、buffer 和 XRUN。", "Understand periods, buffers, and XRUNs.", "period・buffer・XRUN を確認します。", "period, buffer, XRUN을 이해합니다."),
    question: l("数据按时到达不等于按时处理，怎样找出整条音频链的等待与超时？", "Timely arrival is not timely processing: where does the audio chain wait or miss deadlines?", "データの到着と処理の完了は別です。経路のどこで待ちや期限超過が起きるのでしょうか。", "제때 도착하는 것과 처리하는 것은 다릅니다. 오디오 경로의 대기와 기한 초과는 어디서 생길까요?"),
    next: "audio-codec",
    transition: l("编码器的帧长也是时延来源，接着比较压缩格式的码率与延迟取舍。", "Codec frame length also adds latency; next compare bitrate and delay across compression approaches.", "符号化フレームも遅延源です。次に圧縮方式のビットレートと遅延を比べます。", "코덱 프레임 길이도 지연 요인입니다. 다음에는 압축 방식의 비트레이트와 지연을 비교합니다."),
    labTask: l("沿采集、DSP、编码和解码播放流程逐段追踪缓冲，区分处理块、编码帧与端到端时延。", "Trace buffers through capture, DSP, encoding, and decoded playback; distinguish processing blocks, codec frames, and end-to-end delay.", "収録・DSP・符号化・復号再生のバッファーを追い、処理ブロック・符号化フレーム・全体遅延を区別します。", "캡처, DSP, 인코딩, 디코드 재생의 버퍼를 추적해 처리 블록, 코덱 프레임, 종단 지연을 구분합니다.")
  },
  "audio-codec": {
    prerequisite: "sampling-quantization",
    prerequisiteNote: l("先理解 PCM、采样率、位深与声道数。", "Understand PCM, sample rate, bit depth, and channel count.", "PCM・標本化周波数・ビット深度・チャンネル数を確認します。", "PCM, 샘플레이트, 비트 깊이, 채널 수를 이해합니다."),
    question: l("编码器如何减少数据量，无损与有损各保留和舍弃了什么？", "How do codecs reduce data, and what do lossless and lossy methods preserve or discard?", "コーデックはデータをどう減らし、可逆・非可逆方式は何を残すのでしょうか。", "코덱은 데이터를 어떻게 줄이며 무손실·손실 방식은 무엇을 보존하거나 버릴까요?"),
    next: "bluetooth-audio",
    transition: l("压缩码流还要经过实际传输链路，蓝牙展示兼容性、码率和缓冲如何一起限制体验。", "Compressed streams still need transport; Bluetooth shows how compatibility, bitrate, and buffering constrain the experience.", "圧縮ストリームには伝送が必要です。Bluetooth で互換性・ビットレート・バッファーの制約を見ます。", "압축 스트림도 전송이 필요합니다. Bluetooth에서 호환성, 비트레이트, 버퍼의 제약을 봅니다.")
  },
  "core-signal-processing": {
    prerequisite: "sampling-quantization",
    prerequisiteNote: l("先理解离散样本及其时间、频率表示。", "Understand discrete samples and their time/frequency representations.", "離散サンプルと時間・周波数の表現を確認します。", "이산 샘플과 시간·주파수 표현을 이해합니다."),
    question: l("FFT/STFT 如何分析 PCM，滤波与动态处理又如何改变它？", "How do FFT/STFT analyze PCM, while filters and dynamics modify it?", "FFT/STFT は PCM をどう分析し、フィルターとダイナミクスはどう変更するのでしょうか。", "FFT/STFT는 PCM을 어떻게 분석하고 필터와 다이내믹 처리는 이를 어떻게 바꿀까요?"),
    next: "speech-enhancement",
    transition: l("会分析和处理信号后，再把这些工具放进回声消除、降噪与增益控制链。", "After analysis and processing, apply these tools in echo cancellation, noise suppression, and gain control.", "分析と処理の次に、エコー除去・ノイズ抑制・ゲイン制御の経路へ進みます。", "분석과 처리 다음에는 에코 제거, 잡음 억제, 이득 제어 경로에 적용합니다."),
    labTask: l("先比较窗长与 hop 对分析图的影响，再看 EQ 与压缩器如何改变输出；分析参数不改原始 PCM。", "Compare window/hop effects on analysis, then EQ and compression on output; analysis settings do not change the original PCM.", "窓長・hop の分析図への影響と、EQ・圧縮の出力への影響を比べます。分析設定は元 PCM を変えません。", "창 길이·hop이 분석 그래프에 주는 영향과 EQ·압축이 출력에 주는 영향을 비교합니다. 분석 설정은 원본 PCM을 바꾸지 않습니다.")
  },
  "speech-enhancement": {
    prerequisite: "core-signal-processing",
    prerequisiteNote: l("先理解分帧、滤波和动态增益。", "Understand framing, filtering, and dynamic gain.", "フレーム分割・フィルター・動的ゲインを確認します。", "프레이밍, 필터링, 동적 이득을 이해합니다."),
    question: l("AEC、降噪、去混响和 AGC 各针对哪种问题，为什么不能互相替代？", "Which problems do AEC, noise suppression, dereverberation, and AGC address, and why are they not interchangeable?", "AEC・ノイズ抑制・残響除去・AGC は何を解決し、なぜ代替できないのでしょうか。", "AEC, 잡음 억제, 잔향 제거, AGC는 무엇을 해결하며 왜 서로 대체할 수 없을까요?"),
    next: "ai-enhancement",
    transition: l("明确传统增强的任务与边界后，再看学习模型如何估计掩码或滤波参数。", "With traditional enhancement tasks clear, examine learned mask or filter estimation.", "従来の強調の役割と限界を確認したら、学習モデルのマスク・フィルター推定へ進みます。", "기존 향상 처리의 역할과 한계를 이해한 뒤 학습 모델의 마스크·필터 추정을 봅니다."),
    labTask: l("一次调整一个阶段，对照输入与输出；改变后级强度不应反过来改变前级结果。", "Adjust one stage at a time and compare input/output; changing a later stage must not alter earlier results.", "一段ずつ調整して入出力を比べます。後段の変更で前段の結果は変わりません。", "단계를 하나씩 조절해 입출력을 비교합니다. 뒤 단계 변경이 앞 단계 결과를 바꾸면 안 됩니다.")
  },
  "spatial-audio": {
    prerequisite: "sound-wave",
    prerequisiteNote: l("先理解时间差、幅度和反射。", "Understand timing differences, amplitude, and reflections.", "時間差・振幅・反射を確認します。", "시간 차, 진폭, 반사를 이해합니다."),
    question: l("双耳的时间差、级差和频谱线索怎样构成方向与空间感？", "How do binaural timing, level, and spectral cues create direction and space?", "両耳の時間差・レベル差・周波数特性は方向と空間感をどう作るのでしょうか。", "양 귀의 시간, 레벨, 스펙트럼 단서는 방향과 공간감을 어떻게 만들까요?"),
    next: "automotive-audio",
    transition: l("空间线索进入车厢后，还要考虑座位、扬声器位置和反射环境。", "In a cabin, spatial cues also depend on seats, speaker placement, and reflections.", "車内では座席・スピーカー配置・反射も空間の手掛かりに影響します。", "차량 안에서는 좌석, 스피커 배치, 반사도 공간 단서에 영향을 줍니다."),
    labTask: l("分别改变声源方向、头部朝向和房间反射，比较双耳差异与早期反射的时间位置。", "Vary source direction, head orientation, and room reflections separately; compare binaural differences and early-reflection timing.", "音源方向・頭の向き・室内反射を別々に変え、両耳差と初期反射の時間位置を比べます。", "음원 방향, 머리 방향, 실내 반사를 따로 바꿔 양 귀 차이와 초기 반사 시점을 비교합니다.")
  },
  "ai-overview": {
    prerequisite: "sampling-quantization",
    prerequisiteNote: l("先理解 PCM 是样本，而不是文字或声音类别。", "PCM contains samples, not text or sound labels.", "PCM はサンプルであり、文字や音のラベルではありません。", "PCM은 샘플이며 문자나 소리 라벨이 아닙니다."),
    question: l("输入、表示、模型、输出和后处理怎样组成不同的 AI 音频任务？", "How do inputs, representations, models, outputs, and postprocessing form different AI audio tasks?", "入力・表現・モデル・出力・後処理は AI 音声タスクをどう構成するのでしょうか。", "입력, 표현, 모델, 출력, 후처리는 AI 오디오 작업을 어떻게 구성할까요?"),
    next: "ai-asr",
    transition: l("建立共同框架后，先以语音转文字追踪一个完整任务。", "With a shared framework, trace a complete speech-to-text task first.", "共通の枠組みの次に、音声から文字へのタスクを追います。", "공통 틀을 이해한 뒤 음성을 문자로 바꾸는 작업을 추적합니다.")
  },
  "ai-asr": {
    prerequisite: "ai-overview",
    prerequisiteNote: l("先分清声学表示、模型推理和后处理。", "Distinguish acoustic representations, inference, and postprocessing.", "音響表現・推論・後処理を区別します。", "음향 표현, 추론, 후처리를 구분합니다."),
    question: l("连续的声学帧如何对齐为较短的 token 序列并成为文字？", "How do acoustic frames align to a shorter token sequence and become text?", "連続した音響フレームは短い token 列にどう整列して文字になるのでしょうか。", "연속 음향 프레임은 짧은 token 시퀀스에 어떻게 정렬되어 문자가 될까요?"),
    next: "ai-tts",
    transition: l("识别得到文字后，TTS 解决反方向的文字到语音生成。", "Once recognition yields text, TTS tackles text-to-speech generation.", "認識で文字を得た後、TTS で文字から音声を生成する方向へ進みます。", "인식으로 문자를 얻은 뒤 TTS로 문자에서 음성을 생성하는 방향을 봅니다."),
    labTask: l("逐步比较声学特征、token 分数与解码结果；调整示例参数，观察 CTC 或注意力对齐，不是真实转写。", "Compare acoustic features, token scores, and decoding step by step; vary example parameters to inspect CTC or attention alignment, not live transcription.", "特徴・token スコア・デコードを段階的に比べ、例の設定で CTC や注意の整列を見ます。実際の文字起こしではありません。", "특징, token 점수, 디코딩을 단계별로 비교하고 예시 설정으로 CTC·어텐션 정렬을 봅니다. 실제 전사가 아닙니다.")
  },
  "ai-tts": {
    prerequisite: "ai-overview",
    prerequisiteNote: l("先区分条件输入、声学表示与 PCM 输出。", "Distinguish conditioning input, acoustic representations, and PCM output.", "条件入力・音響表現・PCM 出力を区別します。", "조건 입력, 음향 표현, PCM 출력을 구분합니다."),
    question: l("文本怎样经过读音、韵律和声学建模，最终重建为语音？", "How does text become speech through pronunciation, prosody, acoustic modeling, and reconstruction?", "テキストは発音・韻律・音響モデル・再構成を経てどう音声になるのでしょうか。", "텍스트는 발음, 운율, 음향 모델링, 복원을 거쳐 어떻게 음성이 될까요?"),
    next: "ai-generation",
    transition: l("理解语音生成后，再看音乐与音效如何受提示和时长条件控制。", "After speech generation, explore prompt and duration conditioning for music and effects.", "音声生成の次に、音楽・効果音のプロンプトと長さ条件を見ます。", "음성 생성 다음에는 음악·효과음의 프롬프트와 길이 조건을 봅니다."),
    labTask: l("调整语速和停顿，观察时长展开与声学帧；切换路线比较重建步骤，示意不生成真人语音。", "Adjust rate and pauses to inspect duration expansion and acoustic frames; compare reconstruction routes without generating real speech.", "話速・ポーズで長さ展開と音響フレームを見て、再構成経路を比べます。実音声は生成しません。", "속도·멈춤으로 길이 확장과 음향 프레임을 보고 복원 경로를 비교합니다. 실제 음성을 생성하지 않습니다.")
  },
  "ai-generation": {
    prerequisite: "ai-overview",
    prerequisiteNote: l("先区分模型表示与最终可播放波形。", "Distinguish model representations from playable waveforms.", "モデル表現と再生可能な波形を区別します。", "모델 표현과 재생 가능한 파형을 구분합니다."),
    question: l("提示条件如何引导 latent 或 token 的生成，再被解码为声音？", "How do prompts guide latent or token generation before decoding into sound?", "条件は latent や token の生成をどう導き、音へ復号されるのでしょうか。", "조건은 latent나 token 생성을 어떻게 이끌고 소리로 디코딩될까요?"),
    next: "ai-codec",
    transition: l("生成路线常依赖压缩表示，下一篇解释这些表示怎样量化和重建。", "Generation often relies on compressed representations; next examine their quantization and reconstruction.", "生成で使う圧縮表現の量子化と再構成を次に確認します。", "생성에 쓰이는 압축 표현의 양자화와 복원을 다음으로 봅니다."),
    labTask: l("切换生成路线，比较条件、表示预算和迭代阶段；观察流程区别，不把示意当成实际模型生成。", "Switch generation routes to compare conditions, representation budgets, and iterations; these are diagrams, not model-generated results.", "生成経路を切り替え、条件・表現予算・反復段階を比較します。実際のモデル生成ではありません。", "생성 경로를 바꿔 조건, 표현 예산, 반복 단계를 비교합니다. 실제 모델 생성 결과가 아닙니다.")
  },
  "ai-event": {
    prerequisite: "ai-overview",
    prerequisiteNote: l("先理解特征、类别分数与最终标签不是同一个东西。", "Distinguish features, class scores, and final labels.", "特徴・クラススコア・最終ラベルを区別します。", "특징, 클래스 점수, 최종 라벨을 구분합니다."),
    question: l("怎样把类别分数变成带起止时间的事件，同时控制误报和漏报？", "How do class scores become timed events while balancing false alarms and misses?", "クラススコアを時間区間へ変え、誤報と見逃しをどう調整するのでしょうか。", "클래스 점수를 시간 구간으로 바꾸며 오탐과 미탐을 어떻게 조절할까요?"),
    next: "iot-content",
    transition: l("事件标签进入产品后，还需要告警策略、隐私保护和现场验证。", "Product deployment adds alert policies, privacy, and field validation to event labels.", "製品化ではラベルに加え、通知方針・プライバシー・現場検証が必要です。", "제품에서는 라벨 외에 알림 정책, 개인정보 보호, 현장 검증이 필요합니다."),
    labTask: l("调分数阈值与最短时长，比较同一组预设分数的事件区间、误报和漏检。", "Vary score threshold and minimum duration; compare intervals, false alarms, and misses for the same preset scores.", "同じ設定済みスコアで閾値・最短長を変え、イベント区間・誤報・見逃しを比べます。", "같은 사전 설정 점수에서 임계값·최소 길이를 바꿔 이벤트 구간, 오탐, 미탐을 비교합니다.")
  },
  "ai-enhancement": {
    prerequisite: "speech-enhancement",
    prerequisiteNote: l("先理解降噪目标，以及保留人声与抑制噪声的取舍。", "Understand noise suppression and the trade-off between speech preservation and noise removal.", "ノイズ抑制と音声保持のトレードオフを確認します。", "잡음 억제와 음성 보존의 절충을 이해합니다."),
    question: l("模型如何从带噪特征估计掩码或滤波参数，再重建增强音频？", "How does a model estimate masks or filters from noisy features and reconstruct enhanced audio?", "モデルは雑音特徴からマスクやフィルターを推定し、強調音をどう再構成するのでしょうか。", "모델은 잡음 특징에서 마스크나 필터를 추정하고 향상된 오디오를 어떻게 복원할까요?"),
    next: "ai-asr",
    transition: l("波形更干净不保证识别更准，接着看 ASR 需要怎样的声学信息。", "Cleaner waveforms do not guarantee better recognition; examine the acoustic information ASR needs next.", "きれいな波形が認識精度を保証するわけではありません。次に ASR が必要とする情報を見ます。", "깨끗한 파형이 인식 정확도를 보장하지는 않습니다. 다음으로 ASR에 필요한 정보를 봅니다."),
    labTask: l("跟随特征、局部卷积、mask 和重建步骤，检查选中位置的计算与输入输出；不重新训练模型。", "Follow features, local convolution, mask, and reconstruction; inspect selected-position calculations and input/output without retraining.", "特徴・局所畳み込み・mask・再構成を追い、選択位置の計算と入出力を確認します。再学習はしません。", "특징, 국소 합성곱, mask, 복원을 따라 선택 위치 계산과 입출력을 확인합니다. 재학습하지 않습니다.")
  },
  "ai-codec": {
    prerequisite: "audio-codec",
    prerequisiteNote: l("先理解码率、失真与编解码配对。", "Understand bitrate, distortion, and encoder/decoder compatibility.", "ビットレート・歪み・エンコーダーとデコーダーの対応を確認します。", "비트레이트, 왜곡, 인코더·디코더 호환성을 이해합니다."),
    question: l("神经编码怎样把音频变成离散码本索引，码率又由什么决定？", "How does a neural codec turn audio into codebook indices, and what sets the bitrate?", "ニューラルコーデックは音声をコードブック索引にどう変え、何がビットレートを決めるのでしょうか。", "신경 코덱은 오디오를 코드북 인덱스로 어떻게 바꾸며 무엇이 비트레이트를 결정할까요?"),
    next: "ai-generation",
    transition: l("这些索引也可成为生成模型的声音 token，但只有匹配的解码器才能重建音频。", "These indices can serve as audio tokens for generation, but reconstruction requires a matching decoder.", "索引は生成モデルの音声 token にもなりますが、再構成には対応デコーダーが必要です。", "인덱스는 생성 모델의 오디오 token이 될 수 있지만 복원에는 대응 디코더가 필요합니다."),
    labTask: l("手算最近码本向量与码率例子，区分索引预算和最终音质；这里不运行神经编解码器。", "Work through nearest-codebook and bitrate examples; distinguish index budget from audio quality. No neural codec runs here.", "最近傍コードとビットレートの例を計算し、索引予算と音質を区別します。ニューラルコーデックは実行しません。", "최근접 코드와 비트레이트 예제를 계산해 인덱스 예산과 음질을 구분합니다. 신경 코덱을 실행하지 않습니다.")
  },
  "meeting-communication": {
    prerequisite: "speech-enhancement",
    prerequisiteNote: l("先分清回声、噪声和增益问题。", "Distinguish echo, noise, and gain problems.", "エコー・ノイズ・ゲインの問題を区別します。", "에코, 잡음, 이득 문제를 구분합니다."),
    question: l("会议里的听不清、回声和卡顿，怎样沿声学、处理与网络逐段定位？", "How do we trace unclear speech, echo, and glitches across acoustics, processing, and networking?", "会議の不明瞭さ・エコー・音切れを音響・処理・通信のどこに切り分けるのでしょうか。", "회의의 불명확한 음성, 에코, 끊김을 음향, 처리, 네트워크에서 어떻게 구분할까요?"),
    next: "realtime-audio",
    transition: l("确认问题属于等待和丢帧后，再用实时链路的缓冲与截止时间追查。", "If waiting or dropped frames are responsible, investigate buffers and deadlines in the real-time chain.", "待ちやフレーム落ちが原因なら、リアルタイム経路のバッファーと期限を調べます。", "대기나 프레임 손실이 원인이라면 실시간 경로의 버퍼와 데드라인을 조사합니다.")
  },
  "automotive-audio": {
    prerequisite: "spatial-audio",
    prerequisiteNote: l("先理解空间线索、声源位置和反射。", "Understand spatial cues, source placement, and reflections.", "空間の手掛かり・音源位置・反射を確認します。", "공간 단서, 음원 위치, 반사를 이해합니다."),
    question: l("同一座舱如何同时支持语音交互、声源定位、空间播放与主动降噪？", "How can one cabin support voice interaction, localization, spatial playback, and active noise control?", "同じ車室で音声対話・音源定位・空間再生・能動騒音制御をどう構成するのでしょうか。", "한 실내에서 음성 상호작용, 음원 위치, 공간 재생, 능동 소음 제어를 어떻게 구성할까요?"),
    next: "microphone",
    transition: l("座舱布局提出了具体拾音需求，回到麦克风参数检查方向、动态范围与阵列条件。", "Cabin layouts impose pickup requirements; revisit microphone directionality, dynamic range, and array constraints.", "車室配置の収音要件を、マイクの指向性・ダイナミックレンジ・アレイ条件で確認します。", "실내 배치의 수음 요구를 마이크 지향성, 다이내믹 레인지, 배열 조건으로 확인합니다."),
    labTask: l("切换座舱任务并查看麦克风与扬声器位置，追踪参考与输出路径；布局示意不代表实车声场测量。", "Switch cabin tasks and inspect mic/speaker positions and reference/output paths; the layout is not a measured vehicle sound field.", "車室タスクとマイク・スピーカー位置、参照・出力経路を確認します。実車の音場測定ではありません。", "실내 작업과 마이크·스피커 위치, 참조·출력 경로를 확인합니다. 실제 차량 음장 측정이 아닙니다.")
  },
  "robot-audio": {
    prerequisite: "speech-enhancement",
    prerequisiteNote: l("先理解多麦拾音、回声参考和降噪。", "Understand multi-mic pickup, echo references, and noise suppression.", "多マイク収音・エコー参照・ノイズ抑制を確認します。", "다중 마이크 수음, 에코 참조, 잡음 억제를 이해합니다."),
    question: l("机器人运动和自身噪声怎样影响听、定位、识别与回答？", "How do robot motion and self-noise affect listening, localization, recognition, and response?", "ロボットの移動と自己雑音は収音・定位・認識・応答にどう影響するのでしょうか。", "로봇의 움직임과 자체 잡음은 수음, 위치 추정, 인식, 응답에 어떤 영향을 줄까요?"),
    next: "ai-asr",
    transition: l("可靠采集后，还要把语音变成可供机器人任务系统使用的文字。", "After reliable capture, speech must become text the robot's task system can use.", "安定して収音した後、音声をタスクシステムが使える文字に変えます。", "안정적인 캡처 다음에는 음성을 작업 시스템이 사용할 문자로 바꿉니다."),
    labTask: l("切换机器人场景，追踪声源、麦克风、播放参考与任务链，区分感知问题和交互问题。", "Switch robot scenarios and trace sources, microphones, playback reference, and task flow; distinguish perception from interaction problems.", "ロボット場面で音源・マイク・再生参照・タスク経路を追い、知覚と対話の問題を分けます。", "로봇 상황에서 음원, 마이크, 재생 참조, 작업 흐름을 추적해 인식 문제와 상호작용 문제를 구분합니다.")
  },
  "iot-content": {
    prerequisite: "system-audio",
    prerequisiteNote: l("先理解采集、处理、存储与播放的系统分工。", "Understand system roles in capture, processing, storage, and playback.", "収録・処理・保存・再生の役割を確認します。", "캡처, 처리, 저장, 재생의 시스템 역할을 이해합니다."),
    question: l("设备告警和内容制作各自需要怎样的音频链路与质量检查？", "What audio chains and quality checks do device alerts and content production require?", "機器の通知とコンテンツ制作にはどの音声経路と品質確認が必要でしょうか。", "장치 알림과 콘텐츠 제작에는 어떤 오디오 경로와 품질 검사가 필요할까요?"),
    next: "ai-event",
    transition: l("需要让设备判断发生了什么声音时，继续学习事件识别与阈值决策。", "When a device must identify a sound event, continue with event recognition and threshold decisions.", "機器で音の出来事を判断するには、イベント認識と閾値判定へ進みます。", "장치가 소리 사건을 판단해야 한다면 이벤트 인식과 임계값 결정을 배웁니다.")
  },
  "bluetooth-audio": {
    prerequisite: "audio-codec",
    prerequisiteNote: l("先理解压缩码流、码率与编解码兼容性。", "Understand compressed streams, bitrate, and codec compatibility.", "圧縮ストリーム・ビットレート・コーデック互換性を確認します。", "압축 스트림, 비트레이트, 코덱 호환성을 이해합니다."),
    question: l("蓝牙音频的配置、协商、传输和缓冲怎样共同影响延迟与体验？", "How do Bluetooth profiles, negotiation, transport, and buffering affect latency and experience?", "Bluetooth のプロファイル・交渉・伝送・バッファーは遅延と体験にどう影響するのでしょうか。", "Bluetooth 프로파일, 협상, 전송, 버퍼는 지연과 경험에 어떤 영향을 줄까요?"),
    next: "realtime-audio",
    transition: l("无线链路只是时延的一部分，下一步把它放回整条采集与播放路径计算预算。", "Wireless transport is only part of latency; put it back into the full capture/playback budget.", "無線伝送は遅延の一部です。収録から再生までの予算に戻して考えます。", "무선 전송은 지연의 일부입니다. 전체 캡처·재생 예산 안에서 봅니다."),
    labTask: l("比较经典音频与 LE Audio 的链路、编码和缓冲假设，不把名义码率当成实际音质或实测延迟。", "Compare Classic and LE Audio paths, coding, and buffering assumptions; nominal bitrate is neither measured quality nor latency.", "Classic と LE Audio の経路・符号化・バッファー条件を比較します。公称ビットレートは音質や実測遅延ではありません。", "Classic과 LE Audio 경로, 인코딩, 버퍼 가정을 비교합니다. 명목 비트레이트는 실측 음질이나 지연이 아닙니다.")
  }
};
