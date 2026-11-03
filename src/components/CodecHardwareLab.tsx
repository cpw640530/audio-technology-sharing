import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import type { Language } from "../content/knowledge";

type SupportedLanguage = "zh" | "en" | "ja" | "ko";
type LocalizedText = Record<SupportedLanguage, string>;

const localized = (language: Language, values: LocalizedText) => values[language as SupportedLanguage];

type CodecHardwareLabProps = {
  language: Language;
  onBack: () => void;
  onBackToDetails?: () => void;
};

type CodecMode = "adc" | "dac" | "codec";

type ModeCopy = {
  title: string;
  body: string;
};

const modeLabels: Record<CodecMode, LocalizedText> = {
  adc: { zh: "ADC 采集", en: "ADC capture", ja: "ADC収音", ko: "ADC 캡처" },
  dac: { zh: "DAC 重建", en: "DAC reconstruction", ja: "DAC再構成", ko: "DAC 재구성" },
  codec: { zh: "Codec 芯片链路", en: "Codec chip path", ja: "Codecチップ経路", ko: "Codec 칩 경로" }
};

const fixedConverterSettings = {
  bitDepth: 5,
  inputLevel: 86,
  jitter: 8,
  sampleRate: 24
};

function quantizeSample(value: number, bitDepth: number) {
  const levels = 2 ** bitDepth;
  const quantized = Math.round(((value + 1) / 2) * (levels - 1));
  return (quantized / (levels - 1)) * 2 - 1;
}

function createConverterData({
  bitDepth,
  inputLevel,
  jitter,
  sampleRate
}: {
  bitDepth: number;
  inputLevel: number;
  jitter: number;
  sampleRate: number;
}) {
  const width = 660;
  const midY = 150;
  const amplitude = 92;
  const levels = 2 ** bitDepth;
  const analogPoints = Array.from({ length: 140 }, (_, index) => {
    const ratio = index / 139;
    const value = Math.sin(ratio * Math.PI * 4.6) * (inputLevel / 100);
    return {
      x: 50 + ratio * width,
      y: midY - value * amplitude,
      value
    };
  });

  const samples = Array.from({ length: sampleRate }, (_, index) => {
    const baseRatio = sampleRate === 1 ? 0 : index / (sampleRate - 1);
    const jitterOffset = Math.sin(index * 1.9) * (jitter / 400) / (sampleRate - 1);
    const ratio = Math.max(0, Math.min(1, baseRatio + jitterOffset));
    const value = Math.sin(ratio * Math.PI * 4.6) * (inputLevel / 100);
    const clipped = Math.max(-1, Math.min(1, value));
    const quantized = quantizeSample(clipped, bitDepth);
    return {
      x: 50 + ratio * width,
      y: midY - value * amplitude,
      quantizedY: midY - quantized * amplitude,
      ratio,
      clipped: Math.abs(value) > 1,
      value: clipped,
      quantized
    };
  });

  const buildAnalogPath = (
    getValue: (point: (typeof analogPoints)[number], index: number) => number,
    centerY = midY,
    pathAmplitude = amplitude
  ) =>
    analogPoints
      .map((point, index) => {
        const y = centerY - getValue(point, index) * pathAmplitude;
        return `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${y.toFixed(2)}`;
      })
      .join(" ");
  const analogPath = buildAnalogPath((point) => point.value);
  const dacHoldPath = samples.map((sample, index) =>
    `${index === 0 ? `M ${sample.x.toFixed(2)}` : `H ${sample.x.toFixed(2)} V`} ${(112 - sample.quantized * 52).toFixed(2)}`
  ).join(" ") + " H 710";
  // Exact RC response over each held sample; normalized display window is 1 ms.
  const tau = 0.025;
  let heldIndex = 0;
  let state = 0;
  let previousTime = 0;
  const dacReconstructionPath = Array.from({ length: 661 }, (_, index) => {
    const time = index / 660;
    while (heldIndex + 1 < samples.length && samples[heldIndex + 1].ratio <= time) {
      const nextTime = samples[heldIndex + 1].ratio;
      const input = samples[heldIndex].quantized;
      state = input + (state - input) * Math.exp(-(nextTime - previousTime) / tau);
      previousTime = nextTime;
      heldIndex += 1;
    }
    const input = samples[heldIndex].quantized;
    state = input + (state - input) * Math.exp(-(time - previousTime) / tau);
    previousTime = time;
    return `${index === 0 ? "M" : "L"} ${50 + index} ${(232 - state * 52).toFixed(2)}`;
  }).join(" ");
  const quantizationError =
    samples.reduce((total, sample) => total + Math.abs(sample.value - sample.quantized), 0) / samples.length;
  const clippingRisk = Math.round(100 * samples.filter(sample => sample.clipped).length / samples.length);
  const jitterRisk = jitter / 4;
  const visibleQuantizationLineCount = Math.min(33, levels);
  const visibleQuantizationLines = Array.from({ length: visibleQuantizationLineCount }, (_, index) => {
    const ratio = visibleQuantizationLineCount <= 1 ? 0 : index / (visibleQuantizationLineCount - 1);
    const code = Math.round(ratio * (levels - 1));
    const value = (code / (levels - 1)) * 2 - 1;
    return midY - value * amplitude;
  });

  return {
    analogPath,
    clippingRisk,
    dacHoldPath,
    dacReconstructionPath,
    jitterRisk,
    quantizationError,
    samples,
    visibleQuantizationLines
  };
}

function getModeCopy(mode: CodecMode, language: Language): ModeCopy {
  if (mode === "adc") {
    return {
      title: localized(language, { zh: "ADC：模拟电压变成数字样本", en: "ADC: analog voltage to digital samples", ja: "ADC：アナログ電圧をデジタルサンプルへ", ko: "ADC: 아날로그 전압을 디지털 샘플로" }),
      body: localized(language, {
        zh: "曲线与小点表示量化前输入，大点表示限幅后的量化值。输入可以超过 ±1 FS，但数字输出会饱和在量程边界；这里不模拟 PGA 或抗混叠滤波器的内部响应。",
        en: "The curve and small dots show the input before quantization; large dots show clipped, quantized values. Input may exceed ±1 FS while digital output saturates at the limits. Internal PGA and anti-alias filter responses are not simulated.",
        ja: "曲線と小さな点は量子化前の入力、大きな点はクリップ後の量子化値を示します。入力は±1 FSを超えられますが、デジタル出力はレンジ端で飽和します。PGAやアンチエイリアスフィルターの内部応答はシミュレーションしていません。",
        ko: "곡선과 작은 점은 양자화 전 입력을, 큰 점은 클리핑된 양자화 값을 나타냅니다. 입력은 ±1 FS를 넘을 수 있지만 디지털 출력은 범위 끝에서 포화됩니다. PGA와 안티앨리어스 필터의 내부 응답은 시뮬레이션하지 않습니다."
      })
    };
  }

  if (mode === "dac") {
    return {
      title: localized(language, { zh: "DAC：数字样本重建成模拟输出", en: "DAC: digital samples to analog output", ja: "DAC：デジタルサンプルをアナログ出力へ再構成", ko: "DAC: 디지털 샘플을 아날로그 출력으로 재구성" }),
      body: localized(language, {
        zh: "本图使用量化样本、零阶保持和一阶 RC 低通（时间常数 25 μs，初始输出为 0），展示滤波的平滑、衰减和延迟。实际 Σ-Δ DAC 还包含插值与噪声整形，不能等同于这里的简化模型。",
        en: "This model uses quantized samples, zero-order hold and a first-order RC low-pass (25 μs time constant, zero initial output) to show smoothing, attenuation and delay. Real sigma-delta DACs also use interpolation and noise shaping; this is not a chip simulation.",
        ja: "このモデルは量子化サンプル、ゼロ次ホールド、一段のRCローパス（時定数25 μs、初期出力0）を使い、平滑化、減衰、遅延を示します。実際のΣ-Δ DACには補間とノイズシェーピングも含まれるため、これはチップのシミュレーションではありません。",
        ko: "이 모델은 양자화 샘플, 제로 오더 홀드, 1차 RC 로우패스(시정수 25 μs, 초기 출력 0)를 사용해 평활화, 감쇠, 지연을 보여줍니다. 실제 시그마-델타 DAC에는 보간과 노이즈 셰이핑도 포함되므로 여기의 모델은 칩 시뮬레이션이 아닙니다."
      })
    };
  }

  return {
    title: localized(language, { zh: "Codec 芯片：采集、播放和路由集成", en: "Codec chip: integrated capture, playback, and routing", ja: "Codecチップ：収音、再生、ルーティングを統合", ko: "Codec 칩: 캡처, 재생, 라우팅 통합" }),
    body: localized(language, {
      zh: "Codec 芯片不是单向链路，而是同时包含录音和播放两条通路。录音时麦克风/线路输入经 PGA 和 ADC 变成数字音频送给主控；播放时主控把 I2S/TDM 数字音频送回 Codec，经 DAC 和耳放/功放输出。",
      en: "A codec chip is not one single direction. It contains capture and playback paths at the same time. Capture sends mic/line input through PGA and ADC to the host; playback sends I2S/TDM audio from the host through DAC and output amplifiers.",
      ja: "Codecチップは一方向の経路ではなく、収音と再生の2本を同時に備えます。収音ではマイク/ライン入力をPGAとADCでデジタルオーディオにしてホストへ送り、再生ではホストからI2S/TDMで受けた音声をDACとヘッドホンアンプ/パワーアンプから出力します。",
      ko: "Codec 칩은 한 방향의 경로가 아니라 캡처와 재생 경로를 동시에 포함합니다. 캡처에서는 마이크/라인 입력을 PGA와 ADC로 디지털 오디오로 바꿔 호스트로 보내고, 재생에서는 호스트의 I2S/TDM 오디오를 DAC과 헤드폰 앰프/파워 앰프를 거쳐 출력합니다."
    })
  };
}

function getModeStatus({
  bitDepth,
  language,
  levels,
  mode,
  sampleRate
}: {
  bitDepth: number;
  language: Language;
  levels: number;
  mode: CodecMode;
  sampleRate: number;
}) {
  if (mode === "adc") {
    return localized(language, { zh: `量化等级：${levels} 级 · 采样点：${sampleRate}`, en: `Quantization levels: ${levels} · samples: ${sampleRate}`, ja: `量子化レベル：${levels}段 · サンプル数：${sampleRate}`, ko: `양자화 레벨: ${levels}단계 · 샘플 수: ${sampleRate}` });
  }

  if (mode === "dac") {
    return localized(language, { zh: `输出位深：${bitDepth} bit · 重建样本：${sampleRate}`, en: `Output depth: ${bitDepth} bit · reconstruction samples: ${sampleRate}`, ja: `出力ビット深度：${bitDepth} bit · 再構成サンプル数：${sampleRate}`, ko: `출력 비트 깊이: ${bitDepth} bit · 재구성 샘플 수: ${sampleRate}` });
  }

  return localized(language, { zh: "双向链路 · 音频数据与寄存器控制分开", en: "Duplex path · separate audio data and register control", ja: "双方向経路 · オーディオデータとレジスター制御を分離", ko: "양방향 경로 · 오디오 데이터와 레지스터 제어 분리" });
}

function getModeObservation({
  bitDepth,
  clippingRisk,
  inputLevel,
  jitterRisk,
  language,
  mode,
  quantizationError,
  sampleRate
}: {
  bitDepth: number;
  clippingRisk: number;
  inputLevel: number;
  jitterRisk: number;
  language: Language;
  mode: CodecMode;
  quantizationError: number;
  sampleRate: number;
}) {
  if (mode === "adc") {
    return localized(language, {
      zh: `本图把 100% 视为归一化满量程；当前输入 ${inputLevel}% 时削波样本占比 ${clippingRisk}%，PGA/前端增益应在不超出输入范围的前提下把弱信号抬离噪声底。${bitDepth} bit 量化和 ${jitterRisk}% Ts 时序偏移是本模型的限制，不是具体芯片规格。`,
      en: `This model treats 100% as normalized full scale; at ${inputLevel}% input, ${clippingRisk}% of samples clip, so PGA/front-end gain must lift quiet signals without exceeding the input range. ${bitDepth}-bit quantization and ${jitterRisk}% Ts timing offset are model limits, not a specific chip's specification.`,
      ja: `このモデルでは100%を正規化フルスケールとします。入力${inputLevel}%では${clippingRisk}%のサンプルがクリップするため、PGA/前段ゲインは入力範囲を超えずに小さな信号をノイズフロアから持ち上げる必要があります。${bitDepth} bit量子化と${jitterRisk}% Tsのタイミングずれはモデル上の制約であり、特定チップの仕様ではありません。`,
      ko: `이 모델은 100%를 정규화된 풀 스케일로 봅니다. 현재 입력 ${inputLevel}%에서 ${clippingRisk}%의 샘플이 클리핑되므로 PGA/전단 이득은 입력 범위를 넘지 않으면서 작은 신호를 노이즈 바닥에서 끌어올려야 합니다. ${bitDepth} bit 양자화와 ${jitterRisk}% Ts 타이밍 오프셋은 모델의 한계이며 특정 칩 사양이 아닙니다.`
    });
  }

  if (mode === "dac") {
    return localized(language, {
      zh: `当前用 ${sampleRate} 个样本、${bitDepth} bit 量化和 ${jitterRisk}% Ts 时序偏移观察重建，平均量化误差为 ${quantizationError.toFixed(3)} FS。零阶保持加一阶 RC 只示意平滑、衰减和延迟，不代表实际 DAC 的插值、噪声整形或输出驱动。`,
      en: `This view uses ${sampleRate} samples, ${bitDepth}-bit quantization, and ${jitterRisk}% Ts timing offset; mean quantization error is ${quantizationError.toFixed(3)} FS. Zero-order hold plus first-order RC illustrates smoothing, attenuation, and delay, not a real DAC's interpolation, noise shaping, or output drive.`,
      ja: `この表示では${sampleRate}サンプル、${bitDepth} bit量子化、${jitterRisk}% Tsのタイミングずれで再構成を観察します。平均量子化誤差は${quantizationError.toFixed(3)} FSです。ゼロ次ホールドと一段RCは平滑化、減衰、遅延の例であり、実際のDACの補間、ノイズシェーピング、出力駆動を表すものではありません。`,
      ko: `이 화면에서는 ${sampleRate}개 샘플, ${bitDepth} bit 양자화, ${jitterRisk}% Ts 타이밍 오프셋으로 재구성을 관찰하며 평균 양자화 오차는 ${quantizationError.toFixed(3)} FS입니다. 제로 오더 홀드와 1차 RC는 평활화, 감쇠, 지연을 보여줄 뿐 실제 DAC의 보간, 노이즈 셰이핑, 출력 구동을 나타내지 않습니다.`
    });
  }

  return localized(language, { zh: "这张图只表示 Codec 的双向路由；实际 PGA/增益、I2S/TDM 格式、采样率、静音和电源时序仍由具体芯片寄存器与时钟方案决定。", en: "This diagram shows only the Codec's bidirectional routing; actual PGA/gain, I2S/TDM format, sample rate, mute, and power sequencing depend on the chip's registers and clock plan.", ja: "この図はCodecの双方向ルーティングだけを示します。実際のPGA/ゲイン、I2S/TDM形式、サンプルレート、ミュート、電源シーケンスはチップのレジスターとクロック設計で決まります。", ko: "이 그림은 Codec의 양방향 라우팅만 보여줍니다. 실제 PGA/이득, I2S/TDM 형식, 샘플 속도, 뮤트, 전원 시퀀스는 칩의 레지스터와 클록 설계에 따라 결정됩니다." });
}

function renderCodecSvgDefs() {
  return (
    <defs>
      <linearGradient id="codecAnalogLine" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0%" stopColor="#7ee7d8" />
        <stop offset="100%" stopColor="#f0b46a" />
      </linearGradient>
    </defs>
  );
}

function renderCodecSvgBase() {
  return (
    <>
      <rect className="lab-diagram-bg" height="340" rx="14" width="760" />
      <line className="lab-axis" x1="50" x2="710" y1="150" y2="150" />
      <line className="lab-axis faint" x1="50" x2="710" y1="58" y2="58" />
      <line className="lab-axis faint" x1="50" x2="710" y1="242" y2="242" />
    </>
  );
}

function renderCodecMetricChips({
  clippingRisk,
  jitterRisk,
  language,
  quantizationError
}: {
  clippingRisk: number;
  jitterRisk: number;
  language: Language;
  quantizationError: number;
}) {
  return (
    <div className="codec-model-metrics">
      <span>{localized(language, { zh: `削波样本占比 ${clippingRisk}%`, en: `Clipped samples ${clippingRisk}%`, ja: `クリップしたサンプルの割合 ${clippingRisk}%`, ko: `클리핑 샘플 비율 ${clippingRisk}%` })}</span>
      <span>{localized(language, { zh: `时间偏移上限 ${jitterRisk}% Ts`, en: `Timing offset limit ${jitterRisk}% Ts`, ja: `タイミングずれ上限 ${jitterRisk}% Ts`, ko: `타이밍 오프셋 한계 ${jitterRisk}% Ts` })}</span>
      <span>{localized(language, { zh: `平均绝对量化误差 ${quantizationError.toFixed(3)} FS`, en: `Mean absolute quantization error ${quantizationError.toFixed(3)} FS`, ja: `平均絶対量子化誤差 ${quantizationError.toFixed(3)} FS`, ko: `평균 절대 양자화 오차 ${quantizationError.toFixed(3)} FS` })}</span>
    </div>
  );
}

export function CodecHardwareLab({ language, onBack, onBackToDetails }: CodecHardwareLabProps) {
  const [mode, setMode] = useState<CodecMode>("adc");
  const [inputLevel, setInputLevel] = useState(fixedConverterSettings.inputLevel);
  const [sampleRate, setSampleRate] = useState(fixedConverterSettings.sampleRate);
  const [bitDepth, setBitDepth] = useState(fixedConverterSettings.bitDepth);
  const [jitter, setJitter] = useState(fixedConverterSettings.jitter);
  const data = useMemo(
    () => createConverterData({ bitDepth, inputLevel, jitter, sampleRate }),
    [bitDepth, inputLevel, jitter, sampleRate]
  );
  const modeCopy = getModeCopy(mode, language);
  const levels = 2 ** bitDepth;
  const modeStatus = getModeStatus({ bitDepth, language, levels, mode, sampleRate });
  const modeObservation = getModeObservation({
    bitDepth,
    clippingRisk: data.clippingRisk,
    inputLevel,
    jitterRisk: data.jitterRisk,
    language,
    mode,
    quantizationError: data.quantizationError,
    sampleRate
  });

  return (
    <main className="codec-lab-page">
      <section className="sound-lab-hero" aria-labelledby="codec-lab-title">
        <div className="sound-lab-back-actions">
        <button className="sound-lab-back sound-lab-back-secondary" type="button" onClick={onBack}>
          <ArrowLeft size={18} aria-hidden="true" />
          {localized(language, { zh: "返回知识库", en: "Back to knowledge base", ja: "知識ベースに戻る", ko: "지식 베이스로 돌아가기" })}
        </button>
        {onBackToDetails && <button className="sound-lab-back" type="button" onClick={onBackToDetails}>
          <ArrowLeft size={18} aria-hidden="true" />
          {localized(language, { zh: "返回详细内容", en: "Back to detailed content", ja: "詳細内容に戻る", ko: "상세 내용으로 돌아가기" })}
        </button>}
        </div>
        <div>
          <span className="section-kicker">{localized(language, { zh: "硬件实验", en: "Hardware lab", ja: "ハードウェア実験", ko: "하드웨어 실험" })}</span>
          <h1 id="codec-lab-title">{localized(language, { zh: "ADC / DAC / Codec 实验室", en: "ADC / DAC / Codec Lab", ja: "ADC / DAC / Codec 実験室", ko: "ADC / DAC / Codec 실험실" })}</h1>
          <p>
            {localized(language, { zh: "用同一条音频链路观察模拟采集、数字样本、DAC 重建、接口时钟和 Codec 芯片内部模块。", en: "Use one audio path to inspect analog capture, digital samples, DAC reconstruction, interface clocks, and codec-chip blocks.", ja: "一つのオーディオ経路で、アナログ収音、デジタルサンプル、DAC再構成、インターフェースクロック、Codecチップ内部のブロックを観察します。", ko: "하나의 오디오 경로로 아날로그 캡처, 디지털 샘플, DAC 재구성, 인터페이스 클록, Codec 칩 내부 블록을 살펴봅니다." })}
          </p>
        </div>
      </section>

      <section className="codec-lab-workbench" aria-label={localized(language, { zh: "ADC DAC Codec 实验台", en: "ADC DAC Codec workbench", ja: "ADC DAC Codec ワークベンチ", ko: "ADC DAC Codec 워크벤치" })}>
        <div className="codec-lab-visual">
          <div className="digital-lab-status">
            <strong>{modeCopy.title}</strong>
            <span>{modeStatus}</span>
          </div>
          <div className="codec-diagram-scroll" role="region" aria-label={modeLabels[mode][language]} tabIndex={0}>
          {mode === "adc" ? (
            <svg
              aria-label={localized(language, { zh: "ADC 采集图", en: "ADC capture chart", ja: "ADC収音チャート", ko: "ADC 캡처 차트" })}
              role="img"
              viewBox="0 0 760 340"
              xmlns="http://www.w3.org/2000/svg"
            >
              {renderCodecSvgDefs()}
              {renderCodecSvgBase()}
                {data.visibleQuantizationLines.map((y, index) => (
                  <line className="codec-quant-grid" key={`${index}-${y.toFixed(2)}`} x1="50" x2="710" y1={y.toFixed(2)} y2={y.toFixed(2)} />
                ))}
                <path className="codec-analog-path" d={data.analogPath} />
                {data.samples.map((sample, index) => (
                  <g key={`${index}-${sample.x.toFixed(2)}`}>
                    <line className="digital-sample-stem" x1={sample.x.toFixed(2)} x2={sample.x.toFixed(2)} y1="150" y2={sample.quantizedY.toFixed(2)} />
                    <circle className="digital-sample-dot" cx={sample.x.toFixed(2)} cy={sample.y.toFixed(2)} r="3.5" />
                    <circle className="digital-quantized-dot" cx={sample.x.toFixed(2)} cy={sample.quantizedY.toFixed(2)} r="4.5" />
                  </g>
                ))}
                <text className="lab-label" x="54" y="23">{localized(language, { zh: "ADC 输入模拟波形", en: "ADC analog input", ja: "ADC入力アナログ波形", ko: "ADC 입력 아날로그 파형" })}</text>
                <text className="lab-label" x="54" y="292">{localized(language, { zh: "采样点与量化等级", en: "Samples and quantization levels", ja: "サンプル点と量子化レベル", ko: "샘플 지점과 양자화 레벨" })}</text>
                {[0, 0.5, 1].map(t => <text key={t} className="lab-label" x={50 + t * 660} y="319" textAnchor="middle">{t} ms</text>)}
                {[-1, 0, 1].map(value => <text key={value} className="lab-label" x="40" y={150 - value * 92 + 5} textAnchor="end">{value}</text>)}
            </svg>
          ) : null}
          {mode === "dac" ? (
            <svg
              aria-label={localized(language, { zh: "DAC 重建图", en: "DAC reconstruction chart", ja: "DAC再構成チャート", ko: "DAC 재구성 차트" })}
              role="img"
              viewBox="0 0 760 340"
              xmlns="http://www.w3.org/2000/svg"
            >
              {renderCodecSvgDefs()}
              <rect className="lab-diagram-bg" height="340" rx="14" width="760" />
                <line className="codec-sub-axis" x1="50" x2="710" y1="112" y2="112" />
                <line className="codec-sub-axis" x1="50" x2="710" y1="232" y2="232" />
                <path className="codec-step-path" d={data.dacHoldPath} />
                <path className="codec-reconstruction-path" d={data.dacReconstructionPath} />
                {data.samples.map((sample, index) => (
                  <circle className="digital-quantized-dot" cx={sample.x.toFixed(2)} cy={(112 - sample.quantized * 52).toFixed(2)} key={`${index}-${sample.x.toFixed(2)}`} r="4.5" />
                ))}
                <text className="lab-label" x="54" y="42">{localized(language, { zh: "保持输出：阶梯状电压", en: "Hold output: stepped voltage", ja: "ホールド出力：階段状電圧", ko: "홀드 출력: 계단형 전압" })}</text>
                <text className="lab-label" x="54" y="177">{localized(language, { zh: "一阶低通输出（含延迟与衰减）", en: "First-order low-pass output (lag + attenuation)", ja: "1次ローパス出力（遅延と減衰を含む）", ko: "1차 로우패스 출력(지연과 감쇠 포함)" })}</text>
                {[0, 0.5, 1].map(t => <text key={t} className="lab-label" x={50 + t * 660} y="319" textAnchor="middle">{t} ms</text>)}
                {[112, 232].map(center => <g key={center}>{[-1, 0, 1].map(value => <text key={value} className="lab-label" x="40" y={center - value * 52 + 5} textAnchor="end">{value}</text>)}</g>)}
            </svg>
          ) : null}
          {mode === "codec" ? (
            <svg
              aria-label={localized(language, { zh: "Codec 芯片链路图", en: "Codec chip path chart", ja: "Codecチップ経路チャート", ko: "Codec 칩 경로 차트" })}
              role="img"
              viewBox="0 0 760 340"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <marker id="codecRecordArrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
                  <path d="M 0 0 L 8 4 L 0 8 Z" fill="#7ee7d8" />
                </marker>
                <marker id="codecPlaybackArrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
                  <path d="M 0 0 L 8 4 L 0 8 Z" fill="#f0b46a" />
                </marker>
              </defs>
              <rect className="lab-diagram-bg" height="340" rx="14" width="760" />
              <text className="lab-label" x="54" y="42">{localized(language, { zh: "录音链路", en: "Capture path", ja: "収音経路", ko: "캡처 경로" })}</text>
              <text className="lab-label" x="54" y="190">{localized(language, { zh: "播放链路", en: "Playback path", ja: "再生経路", ko: "재생 경로" })}</text>

              <g className="codec-block-row">
                {["Mic/Line", "PGA", "ADC", "I2S/TDM", localized(language, { zh: "主控", en: "Host", ja: "ホスト", ko: "호스트" })].map((item, index) => {
                  const x = 54 + index * 126;
                  return (
                    <g key={item}>
                      <rect className="codec-block-node" height="58" rx="8" width="96" x={x} y="70" />
                      <text className="codec-block-text" x={x + 48} y="105">{item}</text>
                      {index < 4 ? <path className="codec-block-arrow" d={`M ${x + 100} 99 L ${x + 122} 99`} /> : null}
                    </g>
                  );
                })}
              </g>

              <g className="codec-block-row playback">
                {[localized(language, { zh: "主控", en: "Host", ja: "ホスト", ko: "호스트" }), "I2S/TDM", "DAC", localized(language, { zh: "耳放/功放", en: "HP/Amp", ja: "ヘッドホン/パワーアンプ", ko: "헤드폰/파워 앰프" }), localized(language, { zh: "扬声器", en: "Speaker", ja: "スピーカー", ko: "스피커" })].map((item, index) => {
                  const x = 54 + index * 126;
                  return (
                    <g key={item}>
                      <rect className="codec-block-node playback" height="58" rx="8" width="96" x={x} y="218" />
                      <text className="codec-block-text" x={x + 48} y="253">{item}</text>
                      {index < 4 ? <path className="codec-block-arrow playback" d={`M ${x + 100} 247 L ${x + 122} 247`} /> : null}
                    </g>
                  );
                })}
              </g>

              <g>
                <rect className="codec-control-node" height="60" rx="10" width="138" x="552" y="138" />
                <text className="codec-control-text" x="621" y="160">{localized(language, { zh: "寄存器控制", en: "Registers", ja: "レジスター制御", ko: "레지스터 제어" })}</text>
                <text className="codec-control-subtext" x="621" y="184">{localized(language, { zh: "路由 / 增益 / 静音", en: "route / gain / mute", ja: "ルーティング / ゲイン / ミュート", ko: "라우팅 / 이득 / 뮤트" })}</text>
                <path className="codec-control-line" d="M 552 150 L 400 128" />
                <path className="codec-control-line" d="M 552 186 L 400 218" />
              </g>
            </svg>
          ) : null}
          </div>
          {mode !== "codec" && <>
            {renderCodecMetricChips({ ...data, language })}
            <p className="codec-model-note">{localized(language, { zh: "横轴：0–1 ms；纵轴：归一化幅度（±1 FS 为量程边界）。Ts 为名义采样间隔，时间偏移为夸大的周期性演示。DAC 使用相同的采样与更新时间，不模拟独立的 DAC 时钟误差。", en: "X: 0–1 ms; Y: normalized amplitude (range limits ±1 FS). Ts is the nominal sample interval; timing error is exaggerated and periodic. DAC acquisition and updates share the same schedule, not independent DAC clock error.", ja: "横軸：0–1 ms、縦軸：正規化振幅（±1 FSがレンジ端）です。Tsは公称サンプル間隔で、タイミングずれは誇張した周期的な例です。DACの収音と更新は同じスケジュールを使い、独立したDACクロック誤差は扱いません。", ko: "가로축: 0–1 ms, 세로축: 정규화 진폭(±1 FS가 범위 한계)입니다. Ts는 공칭 샘플 간격이며 타이밍 오프셋은 과장된 주기적 예시입니다. DAC 캡처와 갱신은 같은 일정을 사용하고 독립적인 DAC 클록 오차는 모델링하지 않습니다." })}</p>
            <p className="codec-model-note">{localized(language, { zh: "量化采用包含 ±1 两端的理想等间隔电平，不是有符号 PCM 码值映射。网格最多显示 33 条真实电平线，量化仍使用全部电平；平均量化误差不含输入超量程的削波误差。", en: "Quantization uses ideal equally spaced levels including both ±1 endpoints, not signed PCM code mapping. The grid shows at most 33 actual levels; quantization uses all levels. Mean quantization error excludes overrange clipping error.", ja: "量子化には±1の両端を含む理想的な等間隔レベルを使い、符号付きPCMコードへの対応付けは使いません。グリッドには最大33本の実レベルを表示しますが、量子化自体は全レベルを使います。平均量子化誤差には入力の過大レベルによるクリップ誤差を含めません。", ko: "양자화에는 ±1 양 끝을 포함한 이상적인 등간격 레벨을 사용하며 부호 있는 PCM 코드 매핑은 사용하지 않습니다. 그리드에는 최대 33개의 실제 레벨선을 표시하지만 양자화는 모든 레벨을 사용합니다. 평균 양자화 오차에는 입력 초과 범위의 클리핑 오차를 포함하지 않습니다." })}</p>
          </>}
        </div>

        <div className="codec-lab-panel">
          <div className="waveform-tabs" role="group" aria-label={localized(language, { zh: "转换模式", en: "Conversion mode", ja: "変換モード", ko: "변환 모드" })}>
            {(Object.keys(modeLabels) as CodecMode[]).map((item) => (
              <button
                className={mode === item ? "waveform-tab active" : "waveform-tab"}
                key={item}
                aria-pressed={mode === item}
                type="button"
                onClick={() => setMode(item)}
              >
                {modeLabels[item][language]}
              </button>
            ))}
          </div>

          {mode !== "codec" ? (
            <div className="lab-sliders">
              <label>
                <span>
                  {localized(language, { zh: "输入电平", en: "Input level", ja: "入力レベル", ko: "입력 레벨" })}
                  <strong>{inputLevel}%</strong>
                </span>
                <input
                  aria-label={localized(language, { zh: "输入电平", en: "Input level", ja: "入力レベル", ko: "입력 레벨" })}
                  max="130"
                  min="20"
                  step="5"
                  type="range"
                  value={inputLevel}
                  onChange={(event) => setInputLevel(Number(event.target.value))}
                />
              </label>
              <label>
                <span>
                  {localized(language, { zh: "采样点数", en: "Sample count", ja: "サンプル数", ko: "샘플 수" })}
                  <strong>{sampleRate}</strong>
                </span>
                <input
                  aria-label={localized(language, { zh: "采样点数", en: "Sample count", ja: "サンプル数", ko: "샘플 수" })}
                  max="48"
                  min="8"
                  step="4"
                  type="range"
                  value={sampleRate}
                  onChange={(event) => setSampleRate(Number(event.target.value))}
                />
              </label>
              <label>
                <span>
                  {localized(language, { zh: "位深", en: "Bit depth", ja: "ビット深度", ko: "비트 깊이" })}
                  <strong>{bitDepth} bit</strong>
                </span>
                <input
                  aria-label={localized(language, { zh: "位深", en: "Bit depth", ja: "ビット深度", ko: "비트 깊이" })}
                  max="8"
                  min="3"
                  step="1"
                  type="range"
                  value={bitDepth}
                  onChange={(event) => setBitDepth(Number(event.target.value))}
                />
              </label>
              <label>
                <span>
                  {localized(language, { zh: "时钟抖动", en: "Clock jitter", ja: "クロックジッター", ko: "클록 지터" })}
                  <strong>{jitter / 4}% Ts</strong>
                </span>
                <input
                  aria-label={localized(language, { zh: "时钟抖动", en: "Clock jitter", ja: "クロックジッター", ko: "클록 지터" })}
                  max="80"
                  min="0"
                  step="4"
                  type="range"
                  value={jitter}
                  onChange={(event) => setJitter(Number(event.target.value))}
                />
              </label>
            </div>
          ) : null}

          <div className="lab-live-note">
            <strong>{modeLabels[mode][language]}</strong>
            <span>{modeCopy.body}</span>
            <span>{modeObservation}</span>
          </div>
        </div>

      </section>
    </main>
  );
}
