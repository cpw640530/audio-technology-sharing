import { traditional } from "../content/traditional";
import type { Language } from "../content/knowledge";

type SupportedLanguage = "zh" | "en" | "ja" | "ko" | "zh-Hant";
type LocalizedText = Record<SupportedLanguage, string>;
type SpecRows = Array<[string, string]>;

const localized = (language: Language, values: LocalizedText) => values[language as SupportedLanguage];

const stages: Array<{ title: LocalizedText; flow: LocalizedText[]; text: LocalizedText; note: LocalizedText }> = [
  {
    title: { zh: "ADC：从电压到 PCM", "zh-Hant": traditional("ADC：从电压到 PCM"), en: "ADC: from voltage to PCM", ja: "ADC：電圧からPCMへ", ko: "ADC: 전압에서 PCM으로" },
    flow: [
      { zh: "模拟输入与 PGA", "zh-Hant": traditional("模拟输入与 PGA"), en: "Analog input + PGA", ja: "アナログ入力 + PGA", ko: "아날로그 입력 + PGA" },
      { zh: "模拟抗混叠", "zh-Hant": traditional("模拟抗混叠"), en: "Analog anti-aliasing", ja: "アナログ・アンチエイリアス", ko: "아날로그 안티앨리어싱" },
      { zh: "Σ-Δ 过采样与噪声整形", "zh-Hant": traditional("Σ-Δ 过采样与噪声整形"), en: "Σ-Δ oversampling + noise shaping", ja: "Σ-Δオーバーサンプリング + ノイズシェーピング", ko: "Σ-Δ 오버샘플링 + 노이즈 셰이핑" },
      { zh: "数字低通与抽取", "zh-Hant": traditional("数字低通与抽取"), en: "Digital low-pass + decimation", ja: "デジタル・ローパス + デシメーション", ko: "디지털 로우패스 + 데시메이션" },
      { zh: "PCM 输出", "zh-Hant": traditional("PCM 输出"), en: "PCM output", ja: "PCM出力", ko: "PCM 출력" }
    ],
    text: {
      zh: "这是常见 Σ-Δ 音频 ADC 的功能链路。内部高速转换率不同于最终 48 kHz 等 PCM 输出率；噪声整形把更多量化噪声移到带外，数字滤波后再抽取。模拟滤波与数字滤波各有职责，不能用一句‘采样前去掉 24 kHz 以上’概括所有内部环节。", "zh-Hant": traditional("这是常见 Σ-Δ 音频 ADC 的功能链路。内部高速转换率不同于最终 48 kHz 等 PCM 输出率；噪声整形把更多量化噪声移到带外，数字滤波后再抽取。模拟滤波与数字滤波各有职责，不能用一句‘采样前去掉 24 kHz 以上’概括所有内部环节。"),
      en: "This is a typical sigma-delta audio ADC chain. Its internal conversion rate differs from the final PCM rate, such as 48 kHz. Noise shaping moves more quantization noise out of band; digital filtering precedes decimation. Analog and digital filters serve different boundaries.",
      ja: "これは一般的なΣ-ΔオーディオADCの機能チェーンです。内部の高速変換レートは、最終的な48 kHzなどのPCM出力レートとは異なります。ノイズシェーピングは量子化ノイズの多くを帯域外へ移し、デジタルフィルターの後でデシメーションを行います。アナログとデジタルのフィルターにはそれぞれ役割があり、内部処理全体を「サンプリング前に24 kHz超を除去する」と一言で表すことはできません。",
      ko: "일반적인 시그마-델타 오디오 ADC의 기능 경로입니다. 내부 고속 변환 속도는 48 kHz 같은 최종 PCM 출력 속도와 다릅니다. 노이즈 셰이핑은 양자화 노이즈를 더 많이 대역 밖으로 옮기고, 디지털 필터링 후 데시메이션을 수행합니다. 아날로그 필터와 디지털 필터는 역할이 다르므로 모든 내부 단계를 ‘샘플링 전에 24 kHz 초과를 제거한다’고 단순화할 수 없습니다."
    },
    note: {
      zh: "理想数值例：以相对共模电压 ±1 V 对应满量程，16-bit 有符号 PCM 的步长为 2 V / 65536 ≈ 30.5 μV。+0.25 V 对应约 8192；前级放大 4 倍后已到正满量程边缘。实际输入范围、共模和增益必须查芯片手册。", "zh-Hant": traditional("理想数值例：以相对共模电压 ±1 V 对应满量程，16-bit 有符号 PCM 的步长为 2 V / 65536 ≈ 30.5 μV。+0.25 V 对应约 8192；前级放大 4 倍后已到正满量程边缘。实际输入范围、共模和增益必须查芯片手册。"),
      en: "Ideal example: with ±1 V relative to common mode as full scale, signed 16-bit PCM has a 2 V / 65536 ≈ 30.5 μV step. +0.25 V gives about 8192; 4× preamp gain reaches the positive full-scale edge. Actual range, common mode and gain come from the datasheet.",
      ja: "理想値の例：コモンモードからの相対電圧±1 Vをフルスケールとすると、符号付き16-bit PCMの1ステップは2 V / 65536 ≈ 30.5 μVです。+0.25 Vは約8192に相当し、前段を4倍にすると正側フルスケールの端に達します。実際の入力範囲、コモンモード、ゲインはデータシートで確認してください。",
      ko: "이상적인 수치 예: 공통 모드 기준 ±1 V를 풀 스케일로 보면 부호 있는 16-bit PCM의 한 스텝은 2 V / 65536 ≈ 30.5 μV입니다. +0.25 V는 약 8192에 해당하고 전치 증폭을 4배로 하면 양의 풀 스케일 경계에 도달합니다. 실제 입력 범위, 공통 모드, 이득은 데이터시트에서 확인해야 합니다."
    }
  },
  {
    title: { zh: "DAC：从 PCM 到模拟输出", "zh-Hant": traditional("DAC：从 PCM 到模拟输出"), en: "DAC: from PCM to analog output", ja: "DAC：PCMからアナログ出力へ", ko: "DAC: PCM에서 아날로그 출력으로" },
    flow: [
      { zh: "PCM 输入", "zh-Hant": traditional("PCM 输入"), en: "PCM input", ja: "PCM入力", ko: "PCM 입력" },
      { zh: "数字插值", "zh-Hant": traditional("数字插值"), en: "Digital interpolation", ja: "デジタル補間", ko: "디지털 보간" },
      { zh: "Σ-Δ 调制与 DAC 核心", "zh-Hant": traditional("Σ-Δ 调制与 DAC 核心"), en: "Σ-Δ modulation + DAC core", ja: "Σ-Δ変調 + DACコア", ko: "Σ-Δ 변조 + DAC 코어" },
      { zh: "模拟重建滤波", "zh-Hant": traditional("模拟重建滤波"), en: "Analog reconstruction filter", ja: "アナログ再構成フィルター", ko: "아날로그 재구성 필터" },
      { zh: "线路输出 / 耳放", "zh-Hant": traditional("线路输出 / 耳放"), en: "Line output / headphone amp", ja: "ライン出力 / ヘッドホンアンプ", ko: "라인 출력 / 헤드폰 앰프" }
    ],
    text: {
      zh: "插值提高内部更新率，不会凭空恢复录音中没有的细节。重建滤波抑制采样镜像和带外噪声；实际响应还包含幅频、相位和延迟。阶梯图是零阶保持模型，并非每种音频 DAC 内部真实波形。", "zh-Hant": traditional("插值提高内部更新率，不会凭空恢复录音中没有的细节。重建滤波抑制采样镜像和带外噪声；实际响应还包含幅频、相位和延迟。阶梯图是零阶保持模型，并非每种音频 DAC 内部真实波形。"),
      en: "Interpolation increases the internal update rate without inventing missing recording detail. Reconstruction filtering suppresses images and out-of-band noise, with amplitude, phase and delay effects. A staircase is a zero-order-hold model, not the internal waveform of every audio DAC.",
      ja: "補間は内部の更新レートを高めますが、録音に存在しない細部を生み出すわけではありません。再構成フィルターはサンプリングイメージと帯域外ノイズを抑えますが、実際の応答には振幅、位相、遅延の影響も含まれます。階段状の図はゼロ次ホールドのモデルであり、すべてのオーディオDAC内部の実波形ではありません。",
      ko: "보간은 내부 갱신 속도를 높일 뿐 녹음에 없던 세부 정보를 만들어내지 않습니다. 재구성 필터는 샘플링 이미지와 대역 외 노이즈를 억제하지만 실제 응답에는 진폭, 위상, 지연의 영향도 포함됩니다. 계단 모양 그림은 제로 오더 홀드 모델이며 모든 오디오 DAC 내부의 실제 파형은 아닙니다."
    },
    note: {
      zh: "线路输出不能默认直接驱动扬声器；耳机输出和扬声器功放也不是同一类负载能力。输出级是否集成，取决于具体型号。", "zh-Hant": traditional("线路输出不能默认直接驱动扬声器；耳机输出和扬声器功放也不是同一类负载能力。输出级是否集成，取决于具体型号。"),
      en: "A line output cannot be assumed to drive a speaker. Headphone and speaker amplifiers have different load capabilities; integration depends on the device.",
      ja: "ライン出力がスピーカーを直接駆動できるとは限りません。ヘッドホン出力とスピーカー用パワーアンプでは負荷を駆動する能力が異なり、出力段が内蔵されるかどうかも機種によって決まります。",
      ko: "라인 출력이 스피커를 직접 구동한다고 가정할 수 없습니다. 헤드폰 출력과 스피커용 파워 앰프는 부하 구동 능력이 다르며 출력단의 통합 여부는 장치에 따라 달라집니다."
    }
  }
];

const specs: Record<SupportedLanguage, SpecRows> = {
  zh: [
    ["位宽与有效精度", "24-bit 是数据表示能力，不是 24-bit 无噪声精度。理想满幅正弦量化 SNR ≈ 6.02N + 1.76 dB；ENOB 应由规定条件下的 SINAD 估计。"],
    ["SNR / THD+N", "分别关注噪声和噪声加失真；比较时同时核对带宽、A 计权、信号频率与电平、负载，不能只比一个 dB 数字。"],
    ["时钟与延迟", "随机抖动、固定采样率偏差、时钟丢失是不同问题。ADC 抽取和 DAC 插值滤波也产生群延迟，低延迟模式可能牺牲部分带外抑制。"],
    ["无声 / 削波 / 爆音", "无声先查供电、时钟、路由与静音；削波查输入范围和 PGA；底噪查增益、参考与布局；上电爆音查偏置稳定和静音时序。"]
  ], "zh-Hant": traditional([
    ["位宽与有效精度", "24-bit 是数据表示能力，不是 24-bit 无噪声精度。理想满幅正弦量化 SNR ≈ 6.02N + 1.76 dB；ENOB 应由规定条件下的 SINAD 估计。"],
    ["SNR / THD+N", "分别关注噪声和噪声加失真；比较时同时核对带宽、A 计权、信号频率与电平、负载，不能只比一个 dB 数字。"],
    ["时钟与延迟", "随机抖动、固定采样率偏差、时钟丢失是不同问题。ADC 抽取和 DAC 插值滤波也产生群延迟，低延迟模式可能牺牲部分带外抑制。"],
    ["无声 / 削波 / 爆音", "无声先查供电、时钟、路由与静音；削波查输入范围和 PGA；底噪查增益、参考与布局；上电爆音查偏置稳定和静音时序。"]
  ]),
  en: [
    ["Word length vs precision", "24-bit words do not mean 24 noise-free bits. Ideal full-scale sine quantization SNR ≈ 6.02N + 1.76 dB; estimate ENOB from SINAD under specified conditions."],
    ["SNR / THD+N", "Noise and distortion-plus-noise are different metrics. Compare bandwidth, A-weighting, test frequency, level and load alongside the dB figures."],
    ["Clocks and latency", "Random jitter, fixed rate error and missing clocks are different faults. ADC decimation and DAC interpolation filters add group delay; low-latency modes may trade stopband rejection."],
    ["Silence / clipping / pops", "For silence check supplies, clocks, routing and mute; for clipping check range and PGA; for noise check gain, reference and layout; for startup pops check bias settling and mute sequencing."]
  ],
  ja: [
    ["ビット長と実効精度", "24-bitのワード幅は、ノイズのない24-bit精度を意味しません。フルスケール正弦波の理想量子化SNRは約6.02N + 1.76 dBで、ENOBは規定条件のSINADから見積もります。"],
    ["SNR / THD+N", "ノイズと、歪みを含むノイズは別の指標です。dB値だけでなく帯域幅、A特性、試験周波数、レベル、負荷もそろえて比較します。"],
    ["クロックと遅延", "ランダムジッター、固定的なレート誤差、クロック欠落は異なる故障です。ADCのデシメーションとDACの補間フィルターも群遅延を生み、低遅延モードでは阻止帯域の減衰が下がる場合があります。"],
    ["無音 / クリップ / ポップノイズ", "無音なら電源、クロック、ルーティング、ミュートを確認します。クリップなら入力範囲とPGA、ノイズならゲイン、リファレンス、レイアウト、起動時のポップならバイアスの安定とミュートの順序を確認します。"]
  ],
  ko: [
    ["비트 길이와 유효 정밀도", "24-bit 워드가 노이즈 없는 24-bit 정밀도를 뜻하지는 않습니다. 풀 스케일 정현파의 이상적인 양자화 SNR은 약 6.02N + 1.76 dB이며 ENOB는 규정 조건의 SINAD에서 추정합니다."],
    ["SNR / THD+N", "노이즈와 왜곡을 포함한 노이즈는 서로 다른 지표입니다. dB 값만 비교하지 말고 대역폭, A 가중, 시험 주파수, 레벨, 부하를 함께 확인합니다."],
    ["클록과 지연", "랜덤 지터, 고정 샘플 속도 오차, 클록 누락은 서로 다른 고장입니다. ADC 데시메이션과 DAC 보간 필터도 군지연을 만들며 저지연 모드에서는 저지 대역 감쇠를 일부 포기할 수 있습니다."],
    ["무음 / 클리핑 / 팝 노이즈", "무음이면 전원, 클록, 라우팅, 뮤트를 확인하고 클리핑이면 입력 범위와 PGA를 확인합니다. 노이즈는 이득, 레퍼런스, 레이아웃을 확인하며 기동 팝은 바이어스 안정화와 뮤트 순서를 확인합니다."]
  ]
};

export function ConverterGuide({ language }: { language: Language }) {
  const currentLanguage = language as SupportedLanguage;
  const connectionRows: Record<SupportedLanguage, SpecRows> = {
    zh: [
      ["I2S / TDM", "Codec → SoC 送采集 PCM；SoC → Codec 送播放 PCM。时序细节见数字音频接口卡片。"],
      ["I²C / SPI", "SoC 配置 Codec 寄存器：输入选择、PGA、音量、静音、采样率与路由；不是用来持续传 PCM 的音频总线。"],
      ["时钟与供电", "BCLK / LRCLK 的驱动方向由主从模式决定；MCLK / PLL 需求因型号而异。模拟、数字电源和参考去耦按手册实施。"]
    ], "zh-Hant": traditional([
      ["I2S / TDM", "Codec → SoC 送采集 PCM；SoC → Codec 送播放 PCM。时序细节见数字音频接口卡片。"],
      ["I²C / SPI", "SoC 配置 Codec 寄存器：输入选择、PGA、音量、静音、采样率与路由；不是用来持续传 PCM 的音频总线。"],
      ["时钟与供电", "BCLK / LRCLK 的驱动方向由主从模式决定；MCLK / PLL 需求因型号而异。模拟、数字电源和参考去耦按手册实施。"]
    ]),
    en: [
      ["I2S / TDM", "Codec → SoC carries capture PCM; SoC → Codec carries playback PCM. See the digital-interface topic for timing."],
      ["I²C / SPI", "SoC configures codec registers: input, PGA, volume, mute, rate and routing. This is not the streaming PCM audio bus."],
      ["Clocks and supplies", "BCLK/LRCLK direction depends on clock master selection. MCLK/PLL requirements vary; follow the datasheet for supplies, reference and decoupling."]
    ],
    ja: [
      ["I2S / TDM", "Codec → SoCは収音PCMを送り、SoC → Codecは再生PCMを送ります。タイミングの詳細はデジタルオーディオインターフェースのカードを参照してください。"],
      ["I²C / SPI", "SoCがCodecのレジスターを設定します。入力選択、PGA、音量、ミュート、サンプルレート、ルーティングを扱いますが、PCMを連続転送するオーディオバスではありません。"],
      ["クロックと電源", "BCLK / LRCLKの駆動方向はマスター・スレーブ設定で決まります。MCLK / PLLの要件は機種ごとに異なるため、電源、リファレンス、デカップリングはデータシートに従います。"]
    ],
    ko: [
      ["I2S / TDM", "Codec → SoC는 캡처 PCM을 보내고 SoC → Codec은 재생 PCM을 보냅니다. 타이밍 세부 사항은 디지털 오디오 인터페이스 카드를 참조합니다."],
      ["I²C / SPI", "SoC가 Codec 레지스터를 설정합니다. 입력 선택, PGA, 볼륨, 뮤트, 샘플 속도, 라우팅을 다루지만 PCM을 계속 전송하는 오디오 버스는 아닙니다."],
      ["클록과 전원", "BCLK / LRCLK의 구동 방향은 마스터·슬레이브 설정으로 결정됩니다. MCLK / PLL 요구 사항은 장치마다 다르므로 전원, 레퍼런스, 디커플링은 데이터시트를 따릅니다."]
    ]
  };
  return <>
    {stages.map(stage => <section className="sound-topic-section" key={localized(language, stage.title)}>
      <h2>{localized(language, stage.title)}</h2><p>{localized(language, stage.text)}</p>
      <ol className="codec-guide-flow">{stage.flow.map((step, i) => <li key={localized(language, step)}><strong>{i + 1}. {localized(language, step)}</strong></li>)}</ol>
      <p className="sound-topic-note">{localized(language, stage.note)}</p>
    </section>)}
    <section className="sound-topic-section">
      <h2>{localized(language, { zh: "Codec 与 SoC：音频、控制、时钟分开看", "zh-Hant": traditional("Codec 与 SoC：音频、控制、时钟分开看"), en: "Codec and SoC: separate audio, control and clocks", ja: "CodecとSoC：オーディオ、制御、クロックを分けて考える", ko: "Codec과 SoC: 오디오, 제어, 클록을 나누어 보기" })}</h2>
      <p>{localized(language, { zh: "Codec 中的采集与播放是两条可独立工作的路径，不要求录音数据必须经过 DSP 后返回 DAC。部分芯片还有不经过 ADC/DAC 的模拟旁路。", "zh-Hant": traditional("Codec 中的采集与播放是两条可独立工作的路径，不要求录音数据必须经过 DSP 后返回 DAC。部分芯片还有不经过 ADC/DAC 的模拟旁路。"), en: "Capture and playback are independent paths: recorded data need not pass through a DSP and return to the DAC. Some devices also offer analog bypass without ADC/DAC conversion.", ja: "Codecの収音と再生は独立して動作できる2本の経路です。録音データが必ずDSPを通ってDACへ戻る必要はありません。ADC/DAC変換を通らないアナログバイパスを備えるチップもあります。", ko: "Codec의 캡처와 재생은 독립적으로 동작할 수 있는 두 경로입니다. 녹음 데이터가 반드시 DSP를 거쳐 DAC으로 돌아갈 필요는 없습니다. ADC/DAC 변환을 거치지 않는 아날로그 바이패스를 제공하는 칩도 있습니다." })}</p>
      <div className="codec-chip-boundary">
        <strong>{localized(language, { zh: "Codec 芯片边界（通用功能示意）", "zh-Hant": traditional("Codec 芯片边界（通用功能示意）"), en: "Codec boundary (generic functional example)", ja: "Codecチップの境界（一般的な機能例）", ko: "Codec 칩 경계(일반 기능 예시)" })}</strong>
        <p>{localized(language, { zh: "模拟输入 → PGA → ADC → 数字音频输出 → SoC", "zh-Hant": traditional("模拟输入 → PGA → ADC → 数字音频输出 → SoC"), en: "Analog input → PGA → ADC → digital audio output → SoC", ja: "アナログ入力 → PGA → ADC → デジタルオーディオ出力 → SoC", ko: "아날로그 입력 → PGA → ADC → 디지털 오디오 출력 → SoC" })}</p>
        <p>{localized(language, { zh: "SoC → 数字音频输入 → DAC → 输出缓冲 → 外部负载", "zh-Hant": traditional("SoC → 数字音频输入 → DAC → 输出缓冲 → 外部负载"), en: "SoC → digital audio input → DAC → output buffer → external load", ja: "SoC → デジタルオーディオ入力 → DAC → 出力バッファ → 外部負荷", ko: "SoC → 디지털 오디오 입력 → DAC → 출력 버퍼 → 외부 부하" })}</p>
        <p>{localized(language, { zh: "可选模拟旁路：输入 → 模拟混音 / 增益 → 输出", "zh-Hant": traditional("可选模拟旁路：输入 → 模拟混音 / 增益 → 输出"), en: "Optional analog bypass: input → analog mixer / gain → output", ja: "オプションのアナログバイパス：入力 → アナログミキサー / ゲイン → 出力", ko: "선택적 아날로그 바이패스: 입력 → 아날로그 믹서 / 이득 → 출력" })}</p>
      </div>
      <table className="codec-guide-table"><thead><tr><th>{localized(language, { zh: "连接", "zh-Hant": traditional("连接"), en: "Connection", ja: "接続", ko: "연결" })}</th><th>{localized(language, { zh: "职责与方向", "zh-Hant": traditional("职责与方向"), en: "Purpose and direction", ja: "役割と方向", ko: "역할과 방향" })}</th></tr></thead><tbody>
        {connectionRows[currentLanguage].map(([name, text]) => <tr key={name}><th scope="row">{name}</th><td>{text}</td></tr>)}
      </tbody></table>
      <p>{localized(language, { zh: "实例：瑞芯微 RK3308 是带内置 Audio CODEC 的语音 SoC，官方资料列出 8 路 ADC、2 路 DAC，并支持 2 组 8 通道 I2S/TDM、1 组 8 通道 PDM 和 1 组 2 通道 I2S/PCM。它适合用来理解‘SoC 内置 Codec + 音频接口 + Linux/ALSA 驱动’的链路，但不能代表所有瑞芯微 SoC 的模块和规格。", "zh-Hant": traditional("实例：瑞芯微 RK3308 是带内置 Audio CODEC 的语音 SoC，官方资料列出 8 路 ADC、2 路 DAC，并支持 2 组 8 通道 I2S/TDM、1 组 8 通道 PDM 和 1 组 2 通道 I2S/PCM。它适合用来理解‘SoC 内置 Codec + 音频接口 + Linux/ALSA 驱动’的链路，但不能代表所有瑞芯微 SoC 的模块和规格。"), en: "Example: Rockchip RK3308 is a voice-oriented SoC with an embedded audio CODEC. Rockchip lists 8 ADC channels, 2 DAC channels, two 8-channel I2S/TDM interfaces, one 8-channel PDM interface, and one 2-channel I2S/PCM interface. It is a useful example of an SoC-integrated codec plus audio interfaces and Linux/ALSA support, but it does not represent every Rockchip SoC.", ja: "例：Rockchip RK3308はオーディオCODECを内蔵した音声向けSoCです。公式資料では8系統のADC、2系統のDAC、8チャンネルI2S/TDMを2組、8チャンネルPDMを1組、2チャンネルI2S/PCMを1組サポートするとされています。SoC内蔵Codec、オーディオインターフェース、Linux/ALSAドライバーの経路を理解する例になりますが、すべてのRockchip SoCの構成や仕様を代表するものではありません。", ko: "예: Rockchip RK3308은 오디오 CODEC을 내장한 음성용 SoC입니다. 공식 자료에는 8개 ADC 채널, 2개 DAC 채널, 8채널 I2S/TDM 2세트, 8채널 PDM 1개, 2채널 I2S/PCM 1개가 제시되어 있습니다. SoC 통합 Codec, 오디오 인터페이스, Linux/ALSA 드라이버의 경로를 이해하는 예이지만 모든 Rockchip SoC의 구성과 사양을 대표하지는 않습니다." })}</p>
      <a href="https://www.rock-chips.com/a/en/products/RK33_Series/2018/0614/907.html">{localized(language, { zh: "查看瑞芯微 RK3308 官方资料", "zh-Hant": traditional("查看瑞芯微 RK3308 官方资料"), en: "Rockchip RK3308 official product page", ja: "Rockchip RK3308公式製品ページ", ko: "Rockchip RK3308 공식 제품 페이지" })}</a>
    </section>
    <section className="sound-topic-section">
      <h2>{localized(language, { zh: "读规格与定位问题", "zh-Hant": traditional("读规格与定位问题"), en: "Read specifications and locate faults", ja: "仕様を読み、問題箇所を切り分ける", ko: "사양을 읽고 문제 위치를 찾기" })}</h2>
      <table className="codec-guide-table"><thead><tr><th>{localized(language, { zh: "关注点", "zh-Hant": traditional("关注点"), en: "Focus", ja: "注目点", ko: "확인할 항목" })}</th><th>{localized(language, { zh: "如何判断", "zh-Hant": traditional("如何判断"), en: "How to interpret it", ja: "判断方法", ko: "판단 방법" })}</th></tr></thead><tbody>{specs[currentLanguage].map(([name, text]) => <tr key={name}><th scope="row">{name}</th><td>{text}</td></tr>)}</tbody></table>
      <p><a href="https://www.analog.com/en/resources/technical-articles/behind-the-sigma-delta-adc-topology.html">{localized(language, { zh: "原理参考：ADI Σ-Δ ADC", "zh-Hant": traditional("原理参考：ADI Σ-Δ ADC"), en: "Reference: ADI sigma-delta ADC", ja: "原理参考：ADI Σ-Δ ADC", ko: "원리 참고: ADI Σ-Δ ADC" })}</a> · <a href="https://www.analog.com/media/en/training-seminars/tutorials/mt-017.pdf">{localized(language, { zh: "ADI 过采样与插值 DAC", "zh-Hant": traditional("ADI 过采样与插值 DAC"), en: "ADI oversampling and interpolating DACs", ja: "ADIオーバーサンプリングと補間DAC", ko: "ADI 오버샘플링 및 보간 DAC" })}</a></p>
    </section>
  </>;
}
