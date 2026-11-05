import { traditional } from "../content/traditional";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

import type { Language, LocalizedText } from "../content/knowledge";

type AlsaLabProps = {
  language: Language;
  onBack: () => void;
  onBackToDetails?: () => void;
};

const localized = (language: Language, values: LocalizedText) => values[language];

type AlsaMode = "playback" | "capture" | "buffer" | "xrun";
type StreamDirection = "playback" | "capture";
type FlowLayer = "user" | "kernel" | "driver" | "hardware";
type SampleRate = 16000 | 44100 | 48000;
type Channels = 1 | 2;
type BitDepth = 16 | 24 | 32;
type PeriodFrames = 64 | 128 | 256 | 512 | 1024;
type PeriodCount = 2 | 3 | 4 | 8;

type AlsaConfig = {
  sampleRate: SampleRate;
  channels: Channels;
  bitDepth: BitDepth;
  periodFrames: PeriodFrames;
  periodCount: PeriodCount;
};

type FlowStep = {
  label: LocalizedText;
  detail: LocalizedText;
  layer: FlowLayer;
};

const sampleRates: SampleRate[] = [16000, 44100, 48000];
const channelOptions: Channels[] = [1, 2];
const bitDepths: BitDepth[] = [16, 24, 32];
const periodFramesOptions: PeriodFrames[] = [64, 128, 256, 512, 1024];
const periodCounts: PeriodCount[] = [2, 3, 4, 8];

const defaultConfig: AlsaConfig = {
  sampleRate: 44100,
  channels: 2,
  bitDepth: 16,
  periodFrames: 128,
  periodCount: 4
};

const modeTabs: Array<{ id: AlsaMode; label: LocalizedText; description: LocalizedText }> = [
  {
    id: "playback",
    label: { zh: "PCM 播放", "zh-Hant": traditional("PCM 播放"), en: "PCM Playback", ja: "PCM再生", ko: "PCM 재생" },
    description: {
      zh: "应用填充播放 ring buffer，硬件/DMA 按时间取走帧。", "zh-Hant": traditional("应用填充播放 ring buffer，硬件/DMA 按时间取走帧。"),
      en: "The app fills the playback ring while hardware/DMA consumes frames on time.",
      ja: "アプリが再生リングを満たし、ハードウェア／DMAがフレームを時間どおりに消費します。",
      ko: "앱이 재생 링을 채우고 하드웨어/DMA가 프레임을 제때 소비합니다."
    }
  },
  {
    id: "capture",
    label: { zh: "PCM 录音", "zh-Hant": traditional("PCM 录音"), en: "PCM Capture", ja: "PCM収音", ko: "PCM 캡처" },
    description: {
      zh: "硬件/DMA 写入采集 ring buffer，应用读取新到的帧。", "zh-Hant": traditional("硬件/DMA 写入采集 ring buffer，应用读取新到的帧。"),
      en: "Hardware/DMA writes the capture ring while the app reads new frames.",
      ja: "ハードウェア／DMAが収音リングへ書き込み、アプリが新しいフレームを読み取ります。",
      ko: "하드웨어/DMA가 캡처 링에 쓰고 앱이 새 프레임을 읽습니다."
    }
  },
  {
    id: "buffer",
    label: { zh: "缓冲与延迟", "zh-Hant": traditional("缓冲与延迟"), en: "Buffer and Latency", ja: "バッファと遅延", ko: "버퍼와 지연" },
    description: {
      zh: "把 period、总 buffer、指针和可用帧放在同一个环形视图里。", "zh-Hant": traditional("把 period、总 buffer、指针和可用帧放在同一个环形视图里。"),
      en: "Put period size, total buffer, pointers, and available frames in one ring view.",
      ja: "periodサイズ、総バッファ、ポインター、利用可能なフレームを一つのリングで示します。",
      ko: "period 크기, 전체 버퍼, 포인터, 사용 가능한 프레임을 하나의 링으로 보여줍니다."
    }
  },
  {
    id: "xrun",
    label: { zh: "XRUN 排查", "zh-Hant": traditional("XRUN 排查"), en: "XRUN Troubleshooting", ja: "XRUNトラブルシューティング", ko: "XRUN 문제 해결" },
    description: {
      zh: "从现象、状态和日志走到根因，再恢复 PCM 流。", "zh-Hant": traditional("从现象、状态和日志走到根因，再恢复 PCM 流。"),
      en: "Move from symptoms, state, and logs to the root cause, then recover the PCM stream.",
      ja: "現象、状態、ログから根因を特定し、PCMストリームを復旧します。",
      ko: "증상, 상태, 로그에서 근본 원인을 찾고 PCM 스트림을 복구합니다."
    }
  }
];

const layerLabels: Record<FlowLayer, LocalizedText> = {
  user: { zh: "用户态", "zh-Hant": traditional("用户态"), en: "User space", ja: "ユーザー空間", ko: "사용자 공간" },
  kernel: { zh: "内核态", "zh-Hant": traditional("内核态"), en: "Kernel space", ja: "カーネル空間", ko: "커널 공간" },
  driver: { zh: "驱动", "zh-Hant": traditional("驱动"), en: "Driver", ja: "ドライバー", ko: "드라이버" },
  hardware: { zh: "硬件", "zh-Hant": traditional("硬件"), en: "Hardware", ja: "ハードウェア", ko: "하드웨어" }
};

const flowSteps: Record<StreamDirection, FlowStep[]> = {
  playback: [
    { label: { zh: "应用", "zh-Hant": traditional("应用"), en: "Application", ja: "アプリケーション", ko: "애플리케이션" }, detail: { zh: "PCM 帧", "zh-Hant": traditional("PCM 帧"), en: "PCM frames", ja: "PCMフレーム", ko: "PCM 프레임" }, layer: "user" },
    { label: { zh: "alsa-lib", "zh-Hant": traditional("alsa-lib"), en: "alsa-lib", ja: "alsa-lib", ko: "alsa-lib" }, detail: { zh: "用户态 API", "zh-Hant": traditional("用户态 API"), en: "user API", ja: "ユーザー空間API", ko: "사용자 공간 API" }, layer: "user" },
    { label: { zh: "PCM 插件", "zh-Hant": traditional("PCM 插件"), en: "PCM plugin", ja: "PCMプラグイン", ko: "PCM 플러그인" }, detail: { zh: "plughw / default", "zh-Hant": traditional("plughw / default"), en: "plughw / default", ja: "plughw / default", ko: "plughw / default" }, layer: "user" },
    { label: { zh: "ALSA PCM", "zh-Hant": traditional("ALSA PCM"), en: "ALSA PCM", ja: "ALSA PCM", ko: "ALSA PCM" }, detail: { zh: "内核 ring", "zh-Hant": traditional("内核 ring"), en: "kernel ring", ja: "カーネルリング", ko: "커널 링" }, layer: "kernel" },
    { label: { zh: "ASoC / DMA", "zh-Hant": traditional("ASoC / DMA"), en: "ASoC / DMA", ja: "ASoC / DMA", ko: "ASoC / DMA" }, detail: { zh: "驱动 period", "zh-Hant": traditional("驱动 period"), en: "period transfer", ja: "ドライバーperiod", ko: "드라이버 period" }, layer: "driver" },
    { label: { zh: "I2S", "zh-Hant": traditional("I2S"), en: "I2S", ja: "I2S", ko: "I2S" }, detail: { zh: "DAI 串行链路", "zh-Hant": traditional("DAI 串行链路"), en: "DAI serial link", ja: "DAIシリアルリンク", ko: "DAI 직렬 링크" }, layer: "hardware" },
    { label: { zh: "Codec DAC", "zh-Hant": traditional("Codec DAC"), en: "Codec DAC", ja: "Codec DAC", ko: "Codec DAC" }, detail: { zh: "PCM -> 模拟", "zh-Hant": traditional("PCM -> 模拟"), en: "PCM -> analog", ja: "PCM → アナログ", ko: "PCM → 아날로그" }, layer: "hardware" },
    { label: { zh: "扬声器", "zh-Hant": traditional("扬声器"), en: "Speaker", ja: "スピーカー", ko: "스피커" }, detail: { zh: "空气声压", "zh-Hant": traditional("空气声压"), en: "air pressure", ja: "空気圧", ko: "공기 압력" }, layer: "hardware" }
  ],
  capture: [
    { label: { zh: "麦克风", "zh-Hant": traditional("麦克风"), en: "Microphone", ja: "マイク", ko: "마이크" }, detail: { zh: "模拟输入", "zh-Hant": traditional("模拟输入"), en: "analog input", ja: "アナログ入力", ko: "아날로그 입력" }, layer: "hardware" },
    { label: { zh: "Codec ADC", "zh-Hant": traditional("Codec ADC"), en: "Codec ADC", ja: "Codec ADC", ko: "Codec ADC" }, detail: { zh: "模拟 -> PCM", "zh-Hant": traditional("模拟 -> PCM"), en: "analog -> PCM", ja: "アナログ → PCM", ko: "아날로그 → PCM" }, layer: "hardware" },
    { label: { zh: "I2S", "zh-Hant": traditional("I2S"), en: "I2S", ja: "I2S", ko: "I2S" }, detail: { zh: "DAI 串行链路", "zh-Hant": traditional("DAI 串行链路"), en: "DAI serial link", ja: "DAIシリアルリンク", ko: "DAI 직렬 링크" }, layer: "hardware" },
    { label: { zh: "ASoC / DMA", "zh-Hant": traditional("ASoC / DMA"), en: "ASoC / DMA", ja: "ASoC / DMA", ko: "ASoC / DMA" }, detail: { zh: "写入 period", "zh-Hant": traditional("写入 period"), en: "period write", ja: "periodへの書き込み", ko: "period 쓰기" }, layer: "driver" },
    { label: { zh: "ALSA PCM", "zh-Hant": traditional("ALSA PCM"), en: "ALSA PCM", ja: "ALSA PCM", ko: "ALSA PCM" }, detail: { zh: "内核 ring", "zh-Hant": traditional("内核 ring"), en: "kernel ring", ja: "カーネルリング", ko: "커널 링" }, layer: "kernel" },
    { label: { zh: "alsa-lib", "zh-Hant": traditional("alsa-lib"), en: "alsa-lib", ja: "alsa-lib", ko: "alsa-lib" }, detail: { zh: "用户态 API", "zh-Hant": traditional("用户态 API"), en: "user API", ja: "ユーザー空間API", ko: "사용자 공간 API" }, layer: "user" },
    { label: { zh: "应用", "zh-Hant": traditional("应用"), en: "Application", ja: "アプリケーション", ko: "애플리케이션" }, detail: { zh: "读取 PCM 帧", "zh-Hant": traditional("读取 PCM 帧"), en: "read PCM frames", ja: "PCMフレームを読み取る", ko: "PCM 프레임 읽기" }, layer: "user" }
  ]
};

const formatNames: Record<BitDepth, string> = {
  16: "S16_LE",
  24: "S24_3LE",
  32: "S32_LE"
};

function formatMs(value: number) {
  return value.toFixed(2);
}

function formatInteger(value: number) {
  return Math.round(value).toLocaleString("en-US");
}

function getFlowGroups(steps: FlowStep[]) {
  return steps.reduce<Array<{ layer: FlowLayer; start: number; end: number }>>((groups, step, index) => {
    const previous = groups[groups.length - 1];
    if (previous?.layer === step.layer) {
      previous.end = index;
    } else {
      groups.push({ layer: step.layer, start: index, end: index });
    }
    return groups;
  }, []);
}

function AlsaFlowDiagram({ language, direction }: { language: Language; direction: StreamDirection }) {
  const steps = flowSteps[direction];
  const nodeWidth = 150;
  const nodeHeight = 126;
  const gap = 24;
  const left = 28;
  const top = 116;
  const width = left * 2 + steps.length * nodeWidth + (steps.length - 1) * gap;
  const height = 342;
  const groups = getFlowGroups(steps);
  const title = direction === "playback"
    ? { zh: "ALSA PCM 播放流程图", "zh-Hant": traditional("ALSA PCM 播放流程图"), en: "ALSA PCM playback flow diagram", ja: "ALSA PCM再生フロー図", ko: "ALSA PCM 재생 흐름도" }
    : { zh: "ALSA PCM 录音流程图", "zh-Hant": traditional("ALSA PCM 录音流程图"), en: "ALSA PCM capture flow diagram", ja: "ALSA PCM収音フロー図", ko: "ALSA PCM 캡처 흐름도" };
  const description = direction === "playback"
    ? {
        zh: "播放从应用和 alsa-lib 进入 PCM 插件、内核 ALSA PCM、DMA、I2S、Codec DAC 和扬声器。", "zh-Hant": traditional("播放从应用和 alsa-lib 进入 PCM 插件、内核 ALSA PCM、DMA、I2S、Codec DAC 和扬声器。"),
        en: "Playback moves from the app and alsa-lib through a PCM plugin, kernel ALSA PCM, DMA, I2S, Codec DAC, and speaker.",
        ja: "再生はアプリとalsa-libからPCMプラグイン、カーネルALSA PCM、DMA、I2S、Codec DAC、スピーカーへ進みます。",
        ko: "재생은 앱과 alsa-lib에서 PCM 플러그인, 커널 ALSA PCM, DMA, I2S, Codec DAC, 스피커로 진행됩니다."
      }
    : {
        zh: "录音从麦克风和 Codec ADC 反向经过 I2S、DMA、ALSA PCM、alsa-lib 到应用。", "zh-Hant": traditional("录音从麦克风和 Codec ADC 反向经过 I2S、DMA、ALSA PCM、alsa-lib 到应用。"),
        en: "Capture reverses from microphone and Codec ADC through I2S, DMA, ALSA PCM, alsa-lib, and the app.",
        ja: "収音はマイクとCodec ADCから逆方向にI2S、DMA、ALSA PCM、alsa-libを経てアプリへ進みます。",
        ko: "캡처는 마이크와 Codec ADC에서 반대 방향으로 I2S, DMA, ALSA PCM, alsa-lib를 거쳐 앱으로 진행됩니다."
      };
  const path = direction === "playback"
    ? { zh: "应用/alsa-lib → PCM 插件 → ALSA PCM → DMA → I2S → Codec DAC → 扬声器", "zh-Hant": traditional("应用/alsa-lib → PCM 插件 → ALSA PCM → DMA → I2S → Codec DAC → 扬声器"), en: "Application/alsa-lib → PCM plugin → ALSA PCM → DMA → I2S → Codec DAC → speaker", ja: "アプリ／alsa-lib → PCMプラグイン → ALSA PCM → DMA → I2S → Codec DAC → スピーカー", ko: "앱/alsa-lib → PCM 플러그인 → ALSA PCM → DMA → I2S → Codec DAC → 스피커" }
    : { zh: "麦克风 → Codec ADC → I2S → DMA → ALSA PCM → alsa-lib → 应用", "zh-Hant": traditional("麦克风 → Codec ADC → I2S → DMA → ALSA PCM → alsa-lib → 应用"), en: "Microphone → Codec ADC → I2S → DMA → ALSA PCM → alsa-lib → application", ja: "マイク → Codec ADC → I2S → DMA → ALSA PCM → alsa-lib → アプリ", ko: "마이크 → Codec ADC → I2S → DMA → ALSA PCM → alsa-lib → 앱" };

  return (
    <figure className="alsa-flow-figure">
      <div
        aria-label={localized(language, { zh: "可水平滚动的 ALSA 流程图", "zh-Hant": traditional("可水平滚动的 ALSA 流程图"), en: "Horizontally scrollable ALSA flow diagram", ja: "横スクロール可能なALSAフロー図", ko: "가로로 스크롤할 수 있는 ALSA 흐름도" })}
        className="alsa-flow-scroll"
        role="region"
        tabIndex={0}
      >
        <svg
          aria-label={localized(language, title)}
          className="alsa-flow-svg"
          role="img"
          viewBox={`0 0 ${width} ${height}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>{localized(language, title)}</title>
          <desc>{localized(language, description)}</desc>
          <defs>
            <marker id={`alsa-flow-arrow-${direction}`} markerHeight="10" markerWidth="10" orient="auto" refX="8" refY="5">
              <path d="M 0 0 L 10 5 L 0 10 Z" />
            </marker>
          </defs>
          <rect className="alsa-flow-background" height={height} rx="16" width={width} />
          {groups.map((group) => {
            const x = left + group.start * (nodeWidth + gap) - 12;
            const groupWidth = (group.end - group.start + 1) * nodeWidth + (group.end - group.start) * gap + 24;
            return (
              <g key={group.layer}>
                <rect className={`alsa-flow-layer alsa-flow-layer-${group.layer}`} height="246" rx="12" width={groupWidth} x={x} y="54" />
                <text className="alsa-flow-layer-title" x={x + 14} y="78">{localized(language, layerLabels[group.layer])}</text>
              </g>
            );
          })}
          {steps.slice(0, -1).map((step, index) => {
            const x = left + index * (nodeWidth + gap);
            const nextX = left + (index + 1) * (nodeWidth + gap);
            return (
              <line
                className="alsa-flow-arrow"
                key={`${step.label.en}-${index}`}
                markerEnd={`url(#alsa-flow-arrow-${direction})`}
                x1={x + nodeWidth}
                x2={nextX}
                y1={top + nodeHeight / 2}
                y2={top + nodeHeight / 2}
              />
            );
          })}
          {steps.map((step, index) => {
            const x = left + index * (nodeWidth + gap);
            return (
              <g key={step.label.en}>
                <rect className={`alsa-flow-node alsa-flow-node-${step.layer}`} height={nodeHeight} rx="12" width={nodeWidth} x={x} y={top} />
                <text className="alsa-flow-node-title" x={x + nodeWidth / 2} y={top + 48}>{localized(language, step.label)}</text>
                <text className="alsa-flow-node-detail" x={x + nodeWidth / 2} y={top + 82}>{localized(language, step.detail)}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <figcaption className="alsa-flow-caption">
        <strong>{localized(language, path)}</strong>
        <span>{localized(language, {
          zh: "这是嵌入式 I2S 示例；USB / PCI 声卡不必经过 ASoC 和 I2S，PCM 插件也取决于设备名配置。", "zh-Hant": traditional("这是嵌入式 I2S 示例；USB / PCI 声卡不必经过 ASoC 和 I2S，PCM 插件也取决于设备名配置。"),
          en: "This is an embedded I2S example; USB / PCI devices need not use ASoC or I2S, and PCM plugins depend on device-name configuration.",
          ja: "これは組み込みI2Sの例です。USB / PCIサウンドカードはASoCやI2Sを通る必要がなく、PCMプラグインもデバイス名の設定に依存します。",
          ko: "임베디드 I2S 예시입니다. USB / PCI 사운드 카드는 ASoC나 I2S를 거칠 필요가 없으며 PCM 플러그인은 장치 이름 설정에 따라 달라집니다."
        })}</span>
      </figcaption>
    </figure>
  );
}

function AlsaBufferDiagram({
  config,
  direction,
  language,
  usedFrames,
  readFrame,
  onChange
}: {
  config: AlsaConfig;
  direction: StreamDirection;
  language: Language;
  usedFrames: number;
  readFrame: number;
  onChange: (readFrame: number, usedFrames: number) => void;
}) {
  const [dragPointer, setDragPointer] = useState<"read" | "write" | null>(null);
  const bufferFrames = config.periodFrames * config.periodCount;
  const center = 310;
  const radius = 128;
  const circumference = 2 * Math.PI * radius;
  const frameAngle = (frame: number) => -90 + (frame / bufferFrames) * 360;
  const point = (frame: number, distance: number) => {
    const angle = (frameAngle(frame) * Math.PI) / 180;
    return { x: center + Math.cos(angle) * distance, y: 210 + Math.sin(angle) * distance };
  };
  const writeFrame = (readFrame + usedFrames) % bufferFrames;
  const appPointer = direction === "playback" ? writeFrame : readFrame;
  const dmaPointer = direction === "playback" ? readFrame : writeFrame;
  const title = localized(language, { zh: "ALSA 环形 buffer", "zh-Hant": traditional("ALSA 环形 buffer"), en: "ALSA ring buffer", ja: "ALSAリングバッファ", ko: "ALSA 링 버퍼" });
  const description = direction === "playback"
    ? {
        zh: "播放中应用写指针位于已填充数据末端，硬件/DMA 读指针从环中消费。", "zh-Hant": traditional("播放中应用写指针位于已填充数据末端，硬件/DMA 读指针从环中消费。"),
        en: "During playback, the app write pointer ends the filled region while hardware/DMA reads from the ring.",
        ja: "再生中はアプリの書き込みポインターが充填領域の末端を示し、ハードウェア／DMAがリングから読み取ります。",
        ko: "재생 중 앱 쓰기 포인터는 채워진 영역의 끝을 가리키고 하드웨어/DMA가 링에서 읽습니다."
      }
    : {
        zh: "录音中硬件/DMA 写指针位于新数据末端，应用读指针消费尚未读取的帧。", "zh-Hant": traditional("录音中硬件/DMA 写指针位于新数据末端，应用读指针消费尚未读取的帧。"),
        en: "During capture, the hardware/DMA write pointer ends new data while the app reads unconsumed frames.",
        ja: "収音中はハードウェア／DMAの書き込みポインターが新しいデータの末端を示し、アプリが未読フレームを読み取ります。",
        ko: "캡처 중 하드웨어/DMA 쓰기 포인터는 새 데이터의 끝을 가리키고 앱이 소비되지 않은 프레임을 읽습니다."
      };

  return (
    <figure className="alsa-buffer-figure">
      <div
        aria-label={localized(language, { zh: "可水平滚动的 ALSA 环形 buffer 图", "zh-Hant": traditional("可水平滚动的 ALSA 环形 buffer 图"), en: "Horizontally scrollable ALSA ring-buffer diagram", ja: "横スクロール可能なALSAリングバッファ図", ko: "가로로 스크롤할 수 있는 ALSA 링 버퍼 다이어그램" })}
        className="alsa-buffer-scroll"
        role="region"
        tabIndex={0}
      >
        <svg aria-label={title} className="alsa-buffer-svg" role="img" viewBox="0 0 620 430" xmlns="http://www.w3.org/2000/svg"
          onPointerMove={(event) => {
            if (dragPointer === null) return;
            const matrix = event.currentTarget.getScreenCTM();
            if (!matrix) return;
            const cursor = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
            const angle = (Math.atan2(cursor.y - 210, cursor.x - center) * 180) / Math.PI + 90;
            const frame = Math.round((((angle + 360) % 360) / 360) * bufferFrames) % bufferFrames;
            if (dragPointer === "read") onChange(frame, (writeFrame - frame + bufferFrames) % bufferFrames);
            else onChange(readFrame, (frame - readFrame + bufferFrames) % bufferFrames);
          }}
          onPointerUp={() => setDragPointer(null)}
          onPointerCancel={() => setDragPointer(null)}
          onLostPointerCapture={() => setDragPointer(null)}>
          <title>{title}</title>
          <desc>{localized(language, description)}</desc>
          <rect className="alsa-buffer-background" height="430" rx="16" width="620" />
          <text className="alsa-buffer-heading" x="310" y="405" textAnchor="middle">{bufferFrames} frames · {localized(language, { zh: "顺时针推进", "zh-Hant": traditional("顺时针推进"), en: "clockwise progress", ja: "時計回りに進行", ko: "시계 방향 진행" })}</text>
          <circle className="alsa-buffer-track" cx={center} cy="210" r={radius} />
          <circle className="alsa-buffer-period-used" cx={center} cy="210" r={radius} transform={`rotate(${frameAngle(readFrame)} 310 210)`} strokeDasharray={`${(usedFrames / bufferFrames) * circumference} ${circumference}`} />
          <text className="alsa-buffer-heading" textAnchor="middle" x="310" y="203">{localized(language, { zh: "着色：未读数据", "zh-Hant": traditional("着色：未读数据"), en: "Color: unread data", ja: "色付き：未読データ", ko: "색칠됨: 읽지 않은 데이터" })}</text>
          <text className="alsa-buffer-heading" textAnchor="middle" x="310" y="230">{usedFrames} frames</text>
          {Array.from({ length: config.periodCount }, (_, index) => {
            const inner = point(index * config.periodFrames, radius - 18);
            const boundary = point(index * config.periodFrames, radius + 18);
            const label = point((index + 0.5) * config.periodFrames, radius);
            return (
              <g key={index}>
                <line className="alsa-buffer-period" data-period-index={index} x1={inner.x} x2={boundary.x} y1={inner.y} y2={boundary.y} />
                <text className="alsa-buffer-period-label" textAnchor="middle" x={label.x} y={label.y + 4}>{index + 1}</text>
              </g>
            );
          })}
          {[{ frame: appPointer, className: "alsa-buffer-pointer-app", kind: direction === "playback" ? "write" : "read" }, { frame: dmaPointer, className: "alsa-buffer-pointer-dma", kind: direction === "playback" ? "read" : "write" }].map(({ frame, className, kind }, index) => {
            const inner = point(frame, index === 0 ? radius - 36 : radius + 20);
            const outer = point(frame, index === 0 ? radius - 20 : radius + 36);
            return <g key={className} data-pointer={kind} onPointerDown={(event) => {
              event.preventDefault();
              event.currentTarget.ownerSVGElement?.setPointerCapture(event.pointerId);
              setDragPointer(kind as "read" | "write");
            }}><line className={`alsa-buffer-pointer ${className}`} x1={inner.x} x2={outer.x} y1={inner.y} y2={outer.y} /></g>;
          })}
        </svg>
      </div>
      <div className="alsa-controls">
        <label className="alsa-control">
          <span>{localized(language, { zh: "读指针位置", "zh-Hant": traditional("读指针位置"), en: "Read pointer position", ja: "読み取りポインター位置", ko: "읽기 포인터 위치" })}: {readFrame}</span>
          <input aria-label={localized(language, { zh: "读指针位置", "zh-Hant": traditional("读指针位置"), en: "Read pointer position", ja: "読み取りポインター位置", ko: "읽기 포인터 위치" })} type="range" min="0" max={bufferFrames - 1} value={readFrame} onChange={(event) => {
            const frame = Number(event.target.value);
            onChange(frame, (writeFrame - frame + bufferFrames) % bufferFrames);
          }} />
        </label>
        <label className="alsa-control">
          <span>{localized(language, { zh: "未读帧数", "zh-Hant": traditional("未读帧数"), en: "Unread frames", ja: "未読フレーム数", ko: "읽지 않은 프레임 수" })}: {usedFrames}</span>
          <input aria-label={localized(language, { zh: "未读帧数", "zh-Hant": traditional("未读帧数"), en: "Unread frames", ja: "未読フレーム数", ko: "읽지 않은 프레임 수" })} type="range" min="0" max={bufferFrames} value={usedFrames} onChange={(event) => onChange(readFrame, Number(event.target.value))} />
        </label>
      </div>
      <p className="alsa-buffer-caption">
        <span className="alsa-app-legend">APP: {direction === "playback" ? localized(language, { zh: "应用写", "zh-Hant": traditional("应用写"), en: "app write", ja: "アプリ書き込み", ko: "앱 쓰기" }) : localized(language, { zh: "应用读", "zh-Hant": traditional("应用读"), en: "app read", ja: "アプリ読み取り", ko: "앱 읽기" })} {appPointer} ({localized(language, { zh: "内侧", "zh-Hant": traditional("内侧"), en: "inner", ja: "内側", ko: "안쪽" })})</span>
        {" · "}<span className="alsa-dma-legend">DMA: {direction === "playback" ? localized(language, { zh: "硬件读", "zh-Hant": traditional("硬件读"), en: "hardware read", ja: "ハードウェア読み取り", ko: "하드웨어 읽기" }) : localized(language, { zh: "硬件写", "zh-Hant": traditional("硬件写"), en: "hardware write", ja: "ハードウェア書き込み", ko: "하드웨어 쓰기" })} {dmaPointer} ({localized(language, { zh: "外侧", "zh-Hant": traditional("外侧"), en: "outer", ja: "外側", ko: "바깥쪽" })})</span>
      </p>
      <figcaption className="alsa-buffer-caption">{localized(language, description)} {localized(language, {
        zh: "数字代表 period 分区，位置按 buffer 容量取模后回绕；这是静态快照，不代表指针停止。实际 ALSA 使用逻辑指针跟踪进度，仅靠环上位置不能区分空和满。", "zh-Hant": traditional("数字代表 period 分区，位置按 buffer 容量取模后回绕；这是静态快照，不代表指针停止。实际 ALSA 使用逻辑指针跟踪进度，仅靠环上位置不能区分空和满。"),
        en: "Numbers identify periods; positions wrap modulo buffer capacity. This is a static snapshot, not stopped pointers. ALSA tracks progress using logical pointers: ring positions alone cannot distinguish empty from full.",
        ja: "数字はperiod区画を示し、位置はバッファ容量を法として折り返します。これは静的スナップショットで、ポインターが停止している意味ではありません。実際のALSAは論理ポインターで進行を追跡するため、リング上の位置だけでは空と満杯を区別できません。",
        ko: "숫자는 period 구간을 나타내며 위치는 버퍼 용량을 기준으로 되감깁니다. 정적 스냅샷이므로 포인터가 멈췄다는 뜻은 아닙니다. 실제 ALSA는 논리 포인터로 진행을 추적하므로 링 위치만으로는 비어 있음과 가득 참을 구분할 수 없습니다."
      })}</figcaption>
    </figure>
  );
}

function AlsaLab({ language, onBack, onBackToDetails }: AlsaLabProps) {
  const [config, setConfig] = useState<AlsaConfig>(defaultConfig);
  const [mode, setMode] = useState<AlsaMode>("playback");
  const [streamDirection, setStreamDirection] = useState<StreamDirection>("playback");
  const [ring, setRing] = useState({ read: 0, used: 320 });
  const periodMs = (config.periodFrames / config.sampleRate) * 1000;
  const bufferFrames = config.periodFrames * config.periodCount;
  const bufferMs = (bufferFrames / config.sampleRate) * 1000;
  const wakeupsPerSecond = config.sampleRate / config.periodFrames;
  const bytesPerSecond = config.sampleRate * config.channels * (config.bitDepth / 8);
  const usedFrames = ring.used;
  const availableFrames = bufferFrames - usedFrames;
  const currentTab = modeTabs.find((tab) => tab.id === mode) ?? modeTabs[0];
  const format = formatNames[config.bitDepth];
  const command = streamDirection === "playback"
    ? `aplay -D plughw:0,0 -t raw -f ${format} -r ${config.sampleRate} -c ${config.channels} raw.pcm`
    : `arecord -D plughw:0,0 -t raw -f ${format} -r ${config.sampleRate} -c ${config.channels} capture.raw`;

  function updateConfig(key: keyof AlsaConfig, value: number) {
    setConfig((current) => ({ ...current, [key]: value } as AlsaConfig));
    if (key === "periodFrames" || key === "periodCount") {
      const capacity = key === "periodFrames" ? value * config.periodCount : config.periodFrames * value;
      setRing({ read: ring.read % capacity, used: Math.min(ring.used, capacity) });
    }
  }

  function selectMode(nextMode: AlsaMode) {
    setMode(nextMode);
    if (nextMode === "playback" || nextMode === "capture") {
      setStreamDirection(nextMode);
    }
  }

  const xrunSteps = [
    {
      title: { zh: "现象", "zh-Hant": traditional("现象"), en: "Symptom", ja: "現象", ko: "증상" },
      body: {
        zh: "播放时应用未及时补充数据，硬件追上应用会发生 playback underrun；录音时应用未及时读取，硬件覆盖尚未读取的数据会发生 capture overrun。", "zh-Hant": traditional("播放时应用未及时补充数据，硬件追上应用会发生 playback underrun；录音时应用未及时读取，硬件覆盖尚未读取的数据会发生 capture overrun。"),
        en: "A playback underrun occurs when hardware catches the application after it fails to refill; a capture overrun occurs when hardware overwrites data the application has not read.",
        ja: "再生ではアプリの補充が遅れてハードウェアが追いつくとplayback underrunが起こり、録音ではアプリの読み取り前にハードウェアが上書きするとcapture overrunが起こります。",
        ko: "재생에서는 앱이 제때 보충하지 못해 하드웨어가 따라잡으면 playback underrun이 발생하고, 녹음에서는 앱이 읽기 전에 하드웨어가 덮어쓰면 capture overrun이 발생합니다."
      }
    },
    {
      title: { zh: "确认状态与日志", "zh-Hant": traditional("确认状态与日志"), en: "Confirm state and logs", ja: "状態とログを確認", ko: "상태와 로그 확인" },
      body: { zh: "检查 snd_pcm_state、返回值和内核/驱动日志，确认是否真的进入 XRUN。", "zh-Hant": traditional("检查 snd_pcm_state、返回值和内核/驱动日志，确认是否真的进入 XRUN。"), en: "Check snd_pcm_state, return values, and kernel/driver logs to confirm an XRUN.", ja: "snd_pcm_state、戻り値、カーネル／ドライバーログを確認し、本当にXRUNへ入ったか確かめます。", ko: "snd_pcm_state, 반환값, 커널/드라이버 로그를 확인해 실제로 XRUN에 진입했는지 확인합니다." }
    },
    {
      title: { zh: "定位根因", "zh-Hant": traditional("定位根因"), en: "Find the root cause", ja: "根因を特定", ko: "근본 원인 찾기" },
      body: { zh: "分别排查调度抢占、处理耗时、阻塞 IO、CPU 抖动、设备时钟和 rate / period / buffer 参数。", "zh-Hant": traditional("分别排查调度抢占、处理耗时、阻塞 IO、CPU 抖动、设备时钟和 rate / period / buffer 参数。"), en: "Check scheduling, processing time, blocking IO, CPU jitter, device clocks, and rate / period / buffer parameters.", ja: "スケジューリングのプリエンプション、処理時間、ブロッキングIO、CPUジッター、デバイスクロック、rate / period / bufferパラメータを調べます。", ko: "스케줄링 선점, 처리 시간, 블로킹 IO, CPU 지터, 장치 클록, rate / period / buffer 파라미터를 확인합니다." }
    },
    {
      title: { zh: "恢复流", "zh-Hant": traditional("恢复流"), en: "Recover the stream", ja: "ストリームを復旧", ko: "스트림 복구" },
      body: { zh: "调用 snd_pcm_prepare 重新准备 PCM，再按方向补齐或读取数据。", "zh-Hant": traditional("调用 snd_pcm_prepare 重新准备 PCM，再按方向补齐或读取数据。"), en: "Call snd_pcm_prepare to prepare the PCM again, then refill or read data for the direction.", ja: "snd_pcm_prepareを呼び出してPCMを再準備し、方向に応じてデータを補充または読み取ります。", ko: "snd_pcm_prepare를 호출해 PCM을 다시 준비한 뒤 방향에 맞게 데이터를 보충하거나 읽습니다." }
    }
  ];

  return (
    <main className="codec-lab-page alsa-lab-page" aria-label={localized(language, { zh: "ALSA 框架实验室", "zh-Hant": traditional("ALSA 框架实验室"), en: "ALSA Framework Lab", ja: "ALSAフレームワークラボ", ko: "ALSA 프레임워크 실험실" })}>
      <section className="sound-lab-hero alsa-hero" aria-labelledby="alsa-lab-title">
        <div className="sound-lab-back-actions">
          <button className="sound-lab-back sound-lab-back-secondary" type="button" onClick={onBack}>
            {localized(language, { zh: "返回知识库", "zh-Hant": traditional("返回知识库"), en: "Back to knowledge base", ja: "ナレッジベースに戻る", ko: "지식 베이스로 돌아가기" })}
          </button>
          {onBackToDetails && <button className="sound-lab-back" type="button" onClick={onBackToDetails}>
            <ArrowLeft size={18} aria-hidden="true" />
            {localized(language, { zh: "返回详细内容", "zh-Hant": traditional("返回详细内容"), en: "Back to detailed content", ja: "詳細内容に戻る", ko: "상세 내용으로 돌아가기" })}
          </button>}
        </div>
        <div>
          <span className="section-kicker">{localized(language, { zh: "Linux 音频软件", "zh-Hant": traditional("Linux 音频软件"), en: "Linux audio software", ja: "Linuxオーディオソフトウェア", ko: "Linux 오디오 소프트웨어" })}</span>
          <h1 id="alsa-lab-title">{localized(language, { zh: "ALSA 框架实验室", "zh-Hant": traditional("ALSA 框架实验室"), en: "ALSA Framework Lab", ja: "ALSAフレームワークラボ", ko: "ALSA 프레임워크 실험실" })}</h1>
          <p>{localized(language, {
            zh: "用可计算的 PCM 参数和静态流程图理解 ALSA 设备、数据流、环形 buffer 与 XRUN。", "zh-Hant": traditional("用可计算的 PCM 参数和静态流程图理解 ALSA 设备、数据流、环形 buffer 与 XRUN。"),
            en: "Use computable PCM parameters and static path diagrams to understand ALSA devices, data flow, ring buffers, and XRUNs.",
            ja: "計算可能なPCMパラメータと静的なフロー図で、ALSAデバイス、データフロー、リングバッファ、XRUNを理解します。",
            ko: "계산 가능한 PCM 파라미터와 정적 흐름도로 ALSA 장치, 데이터 흐름, 링 버퍼, XRUN을 이해합니다."
          })}</p>
        </div>
      </section>

      <section className="alsa-workbench" aria-label={localized(language, { zh: "ALSA 交互实验台", "zh-Hant": traditional("ALSA 交互实验台"), en: "ALSA interactive workbench", ja: "ALSAインタラクティブワークベンチ", ko: "ALSA 대화형 작업대" })}>
        <div className="alsa-workbench-main">
          <div className="alsa-workbench-heading">
            <div>
              <span className="section-kicker">{localized(language, { zh: "浏览器教学模拟", "zh-Hant": traditional("浏览器教学模拟"), en: "Browser teaching simulation", ja: "ブラウザー教育シミュレーション", ko: "브라우저 교육 시뮬레이션" })}</span>
              <h2>{localized(language, currentTab.label)}</h2>
            </div>
            <p>{localized(language, currentTab.description)}</p>
          </div>

          <form className="alsa-controls" aria-label={localized(language, { zh: "ALSA PCM 参数", "zh-Hant": traditional("ALSA PCM 参数"), en: "ALSA PCM parameters", ja: "ALSA PCMパラメータ", ko: "ALSA PCM 파라미터" })}>
            <label className="alsa-control">
              <span>{localized(language, { zh: "采样率", "zh-Hant": traditional("采样率"), en: "Sample rate", ja: "サンプリングレート", ko: "샘플레이트" })}</span>
              <select aria-label={localized(language, { zh: "采样率", "zh-Hant": traditional("采样率"), en: "Sample rate", ja: "サンプリングレート", ko: "샘플레이트" })} value={config.sampleRate} onChange={(event) => updateConfig("sampleRate", Number(event.target.value))}>
                {sampleRates.map((value) => <option key={value} value={value}>{value.toLocaleString("en-US")} Hz</option>)}
              </select>
            </label>
            <label className="alsa-control">
              <span>{localized(language, { zh: "声道", "zh-Hant": traditional("声道"), en: "Channels", ja: "チャンネル数", ko: "채널" })}</span>
              <select aria-label={localized(language, { zh: "声道", "zh-Hant": traditional("声道"), en: "Channels", ja: "チャンネル数", ko: "채널" })} value={config.channels} onChange={(event) => updateConfig("channels", Number(event.target.value))}>
                {channelOptions.map((value) => <option key={value} value={value}>{value} {localized(language, { zh: "声道", "zh-Hant": traditional("声道"), en: "channel(s)", ja: "チャンネル", ko: "채널" })}</option>)}
              </select>
            </label>
            <label className="alsa-control">
              <span>{localized(language, { zh: "位深", "zh-Hant": traditional("位深"), en: "Bit depth", ja: "ビット深度", ko: "비트 깊이" })}</span>
              <select aria-label={localized(language, { zh: "位深", "zh-Hant": traditional("位深"), en: "Bit depth", ja: "ビット深度", ko: "비트 깊이" })} value={config.bitDepth} onChange={(event) => updateConfig("bitDepth", Number(event.target.value))}>
                {bitDepths.map((value) => <option key={value} value={value}>{value}-bit / {formatNames[value]}</option>)}
              </select>
            </label>
            <label className="alsa-control">
              <span>{localized(language, { zh: "period frames", "zh-Hant": traditional("period frames"), en: "period frames", ja: "periodフレーム数", ko: "period 프레임 수" })}</span>
              <select aria-label={localized(language, { zh: "period frames", "zh-Hant": traditional("period frames"), en: "period frames", ja: "periodフレーム数", ko: "period 프레임 수" })} value={config.periodFrames} onChange={(event) => updateConfig("periodFrames", Number(event.target.value))}>
                {periodFramesOptions.map((value) => <option key={value} value={value}>{value} {localized(language, { zh: "frames", "zh-Hant": traditional("frames"), en: "frames", ja: "フレーム", ko: "프레임" })}</option>)}
              </select>
            </label>
            <label className="alsa-control">
              <span>{localized(language, { zh: "period count", "zh-Hant": traditional("period count"), en: "period count", ja: "period数", ko: "period 개수" })}</span>
              <select aria-label={localized(language, { zh: "period count", "zh-Hant": traditional("period count"), en: "period count", ja: "period数", ko: "period 개수" })} value={config.periodCount} onChange={(event) => updateConfig("periodCount", Number(event.target.value))}>
                {periodCounts.map((value) => <option key={value} value={value}>{value} {localized(language, { zh: "periods", "zh-Hant": traditional("periods"), en: "periods", ja: "period", ko: "period" })}</option>)}
              </select>
            </label>
          </form>

          <section className="alsa-metrics" aria-label={localized(language, { zh: "实时计算结果", "zh-Hant": traditional("实时计算结果"), en: "Live calculations", ja: "リアルタイム計算結果", ko: "실시간 계산 결과" })} aria-live="polite">
            <article className="alsa-metric">
              <span>{localized(language, { zh: "周期时长", "zh-Hant": traditional("周期时长"), en: "Period duration", ja: "period期間", ko: "period 시간" })}</span>
              <strong>{localized(language, { zh: "period", "zh-Hant": traditional("period"), en: "period", ja: "period", ko: "period" })} {formatMs(periodMs)} ms</strong>
            </article>
            <article className="alsa-metric">
              <span>{localized(language, { zh: "总 buffer 时长", "zh-Hant": traditional("总 buffer 时长"), en: "Total buffer duration", ja: "総バッファ時間", ko: "전체 버퍼 시간" })}</span>
              <strong>{localized(language, { zh: "buffer", "zh-Hant": traditional("buffer"), en: "buffer", ja: "バッファ", ko: "버퍼" })} {formatMs(bufferMs)} ms</strong>
            </article>
            <article className="alsa-metric">
              <span>{localized(language, { zh: "名义 period 频率", "zh-Hant": traditional("名义 period 频率"), en: "Nominal period rate", ja: "公称period頻度", ko: "명목 period 빈도" })}</span>
              <strong>{wakeupsPerSecond.toFixed(2)} {localized(language, { zh: "periods/s", "zh-Hant": traditional("periods/s"), en: "periods/s", ja: "period/s", ko: "period/s" })}</strong>
            </article>
            <article className="alsa-metric">
              <span>{localized(language, { zh: "数据速率", "zh-Hant": traditional("数据速率"), en: "Data rate", ja: "データレート", ko: "데이터 속도" })}</span>
              <strong>{formatInteger(bytesPerSecond)} B/s</strong>
            </article>
          </section>
          <p className="alsa-buffer-caption">{localized(language, {
            zh: "period 频率不等于实际线程唤醒次数；后者还取决于 avail_min、通知方式和调度。", "zh-Hant": traditional("period 频率不等于实际线程唤醒次数；后者还取决于 avail_min、通知方式和调度。"),
            en: "Period rate is not the actual thread wakeup rate; avail_min, notification mode, and scheduling also matter.",
            ja: "period頻度は実際のスレッド起床回数ではありません。後者はavail_min、通知方式、スケジューリングにも左右されます。",
            ko: "period 빈도는 실제 스레드 깨우기 횟수와 같지 않습니다. 실제 횟수는 avail_min, 알림 방식, 스케줄링에도 좌우됩니다."
          })}</p>

          <div className="alsa-mode-tabs" role="group" aria-label={localized(language, { zh: "ALSA 实验模式", "zh-Hant": traditional("ALSA 实验模式"), en: "ALSA lab modes", ja: "ALSAラボモード", ko: "ALSA 실험 모드" })}>
            {modeTabs.map((tab) => (
              <button
                aria-pressed={mode === tab.id}
                className={mode === tab.id ? "alsa-mode-tab active" : "alsa-mode-tab"}
                key={tab.id}
                type="button"
                onClick={() => selectMode(tab.id)}
              >
                {localized(language, tab.label)}
              </button>
            ))}
          </div>

          {mode === "buffer" ? (
            <section className="alsa-mode-panel" aria-label={localized(language, currentTab.label)}>
              <div className="alsa-panel-heading">
                <h2>{localized(language, { zh: "环形 buffer 与指针", "zh-Hant": traditional("环形 buffer 与指针"), en: "Ring buffer and pointers", ja: "リングバッファとポインター", ko: "링 버퍼와 포인터" })}</h2>
                <p>{localized(language, { zh: "每个分区代表一个 period；分区数量和总容量随参数实时变化。", "zh-Hant": traditional("每个分区代表一个 period；分区数量和总容量随参数实时变化。"), en: "Each partition represents one period; partition count and total capacity update with the parameters.", ja: "各区画は1つのperiodを表し、区画数と総容量はパラメータに合わせて更新されます。", ko: "각 구간은 하나의 period를 나타내며 구간 수와 전체 용량은 파라미터에 따라 실시간으로 바뀝니다." })}</p>
              </div>
              <AlsaBufferDiagram config={config} direction={streamDirection} language={language} usedFrames={usedFrames} readFrame={ring.read} onChange={(read, used) => setRing({ read, used })} />
              <dl className="alsa-buffer-stats">
                <div>
                  <dt>{streamDirection === "playback" ? localized(language, { zh: "排队待播放", "zh-Hant": traditional("排队待播放"), en: "Queued for playback", ja: "再生待ちキュー", ko: "재생 대기" }) : localized(language, { zh: "可读采集帧", "zh-Hant": traditional("可读采集帧"), en: "Captured frames ready", ja: "読み取り可能な収音フレーム", ko: "읽을 수 있는 캡처 프레임" })}</dt>
                  <dd>{usedFrames}</dd>
                </div>
                <div>
                  <dt>{streamDirection === "playback" ? localized(language, { zh: "应用可写空间", "zh-Hant": traditional("应用可写空间"), en: "Writable space", ja: "アプリの書き込み可能領域", ko: "앱 쓰기 가능 공간" }) : localized(language, { zh: "硬件可写空间", "zh-Hant": traditional("硬件可写空间"), en: "Free capture space", ja: "ハードウェアの書き込み可能領域", ko: "하드웨어 쓰기 가능 공간" })}</dt>
                  <dd>{availableFrames}</dd>
                </div>
                <div><dt>{localized(language, { zh: "总帧数", "zh-Hant": traditional("总帧数"), en: "Total frames", ja: "総フレーム数", ko: "전체 프레임 수" })}</dt><dd>{bufferFrames}</dd></div>
              </dl>
              <p className="alsa-buffer-direction-note">
                {streamDirection === "playback"
                  ? localized(language, {
                      zh: "播放 underrun：硬件追上应用，读指针进入尚未填充的区域。", "zh-Hant": traditional("播放 underrun：硬件追上应用，读指针进入尚未填充的区域。"),
                      en: "Playback underrun: hardware catches the app and reads into an area the app has not filled.",
                      ja: "再生underrun：ハードウェアがアプリに追いつき、読み取りポインターが未充填領域へ入ります。",
                      ko: "재생 underrun: 하드웨어가 앱을 따라잡아 읽기 포인터가 아직 채워지지 않은 영역으로 들어갑니다."
                    })
                  : localized(language, {
                      zh: "录音 overrun：硬件覆盖应用尚未读取的数据。", "zh-Hant": traditional("录音 overrun：硬件覆盖应用尚未读取的数据。"),
                      en: "Capture overrun: hardware overwrites data the app has not read.",
                      ja: "収音overrun：ハードウェアがアプリの未読データを上書きします。",
                      ko: "캡처 overrun: 하드웨어가 앱이 아직 읽지 않은 데이터를 덮어씁니다."
                    })}
              </p>
            </section>
          ) : mode === "xrun" ? (
            <section className="alsa-mode-panel alsa-xrun-panel" aria-label={localized(language, currentTab.label)}>
              <div className="alsa-panel-heading">
                <h2>{localized(language, currentTab.label)}</h2>
                <p>{localized(language, currentTab.description)}</p>
              </div>
              <ol className="alsa-xrun-flow">
                {xrunSteps.map((step, index) => (
                  <li className="alsa-xrun-step" key={step.title.en}>
                    <span>{index + 1}</span>
                    <div>
                      <h3>{localized(language, step.title)}</h3>
                      <p>{localized(language, step.body)}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <aside className="alsa-xrun-callout">
                <strong>snd_pcm_prepare</strong>
                <p>
                  {localized(language, {
                    zh: "prepare 只恢复到 PREPARED，不等于已经 RUNNING；仍需按启动阈值或显式 start 启动。它不解决调度、处理耗时、设备参数或驱动时钟的根因。", "zh-Hant": traditional("prepare 只恢复到 PREPARED，不等于已经 RUNNING；仍需按启动阈值或显式 start 启动。它不解决调度、处理耗时、设备参数或驱动时钟的根因。"),
                    en: "prepare returns the stream to PREPARED, not RUNNING; starting still follows the start threshold or an explicit start. It does not fix scheduling, processing time, device parameters, or driver-clock root causes.",
                    ja: "prepareはストリームをPREPAREDへ戻すだけで、RUNNINGになるわけではありません。開始しきい値または明示的なstartが必要です。スケジューリング、処理時間、デバイスパラメータ、ドライバークロックの根因は解決しません。",
                    ko: "prepare는 스트림을 PREPARED로 되돌릴 뿐 RUNNING으로 만들지 않습니다. 시작 임계값이나 명시적인 start가 여전히 필요합니다. 스케줄링, 처리 시간, 장치 파라미터, 드라이버 클록의 근본 원인을 해결하지 않습니다."
                  })}
                </p>
              </aside>
            </section>
          ) : (
            <section className="alsa-mode-panel" aria-label={localized(language, currentTab.label)}>
              <div className="alsa-panel-heading">
                <h2>{streamDirection === "playback" ? localized(language, { zh: "播放：应用填充，硬件消费", "zh-Hant": traditional("播放：应用填充，硬件消费"), en: "Playback: app fills, hardware consumes", ja: "再生：アプリが充填し、ハードウェアが消費", ko: "재생: 앱이 채우고 하드웨어가 소비" }) : localized(language, { zh: "录音：硬件写入，应用读取", "zh-Hant": traditional("录音：硬件写入，应用读取"), en: "Capture: hardware writes, app reads", ja: "収音：ハードウェアが書き込み、アプリが読み取る", ko: "캡처: 하드웨어가 쓰고 앱이 읽음" })}</h2>
                <p>{localized(language, currentTab.description)}</p>
              </div>
              <AlsaFlowDiagram direction={streamDirection} language={language} />
              <div className="alsa-command-block">
                <span>{localized(language, { zh: "对应命令（raw PCM 示例）", "zh-Hant": traditional("对应命令（raw PCM 示例）"), en: "Matching command (raw PCM example)", ja: "対応するコマンド（raw PCM例）", ko: "해당 명령(raw PCM 예시)" })}</span>
                <code data-testid="alsa-command">{command}</code>
                <p>
                  {localized(language, {
                    zh: "S16_LE、S24_3LE、S32_LE 分别按每样本 2/3/4 字节存储；S24_LE 通常使用 4 字节容器。WAV 通常自带格式头，这些 -f/-r/-c 参数更适合 raw PCM。", "zh-Hant": traditional("S16_LE、S24_3LE、S32_LE 分别按每样本 2/3/4 字节存储；S24_LE 通常使用 4 字节容器。WAV 通常自带格式头，这些 -f/-r/-c 参数更适合 raw PCM。"),
                    en: "S16_LE, S24_3LE, and S32_LE store each sample in 2, 3, and 4 bytes; S24_LE commonly uses a 4-byte container. WAV usually carries its own header, so these -f/-r/-c flags are mainly for raw PCM.",
                    ja: "S16_LE、S24_3LE、S32_LEは各サンプルをそれぞれ2/3/4バイトで格納します。S24_LEは通常4バイトのコンテナを使います。WAVには通常ヘッダーがあるため、-f/-r/-cは主にraw PCM向けです。",
                    ko: "S16_LE, S24_3LE, S32_LE는 각 샘플을 각각 2/3/4바이트로 저장합니다. S24_LE는 보통 4바이트 컨테이너를 사용합니다. WAV에는 보통 헤더가 있으므로 -f/-r/-c 옵션은 주로 raw PCM에 적합합니다."
                  })}
                </p>
              </div>
            </section>
          )}
        </div>
      </section>
    </main>
  );
}

export { AlsaLab };
