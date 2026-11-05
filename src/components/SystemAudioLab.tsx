import { traditional } from "../content/traditional";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";

import type { Language, LocalizedText } from "../content/knowledge";

type FlowMode = "playback" | "capture" | "duplex";

type FlowStep = {
  label: LocalizedText;
  sub: LocalizedText;
  x: number;
  y: number;
};

const FLOW_VIEWBOX = "0 0 1240 680";
const FLOW_WIDTH = 1240;
const FLOW_HEIGHT = 680;
const FLOW_NODE_WIDTH = 252;
const FLOW_NODE_HEIGHT = 152;
const FLOW_NODE_HALF_WIDTH = FLOW_NODE_WIDTH / 2;
const FLOW_NODE_HALF_HEIGHT = FLOW_NODE_HEIGHT / 2;

type ArchitectureLayer = {
  kind: "app" | "middleware" | "software" | "driver" | "hardware";
  title: LocalizedText;
  detail: LocalizedText;
};

type SystemAudioLabProps = {
  language: Language;
  onBack: () => void;
  onBackToDetails?: () => void;
};

const localized = (language: Language, values: LocalizedText) => values[language];

const genericArchitectureLayers = [
  {
    kind: "app",
    title: { zh: "应用程序", "zh-Hant": traditional("应用程序"), en: "Application", ja: "アプリケーション", ko: "애플리케이션" },
    detail: { zh: "播放器 / 浏览器 / 录音 / 通话软件", "zh-Hant": traditional("播放器 / 浏览器 / 录音 / 通话软件"), en: "player / browser / recorder / call app", ja: "プレーヤー / ブラウザー / レコーダー / 通話アプリ", ko: "플레이어 / 브라우저 / 녹음 / 통화 앱" }
  },
  {
    kind: "middleware",
    title: { zh: "音频 API / 音频服务", "zh-Hant": traditional("音频 API / 音频服务"), en: "Audio API / audio service", ja: "オーディオAPI / オーディオサービス", ko: "오디오 API / 오디오 서비스" },
    detail: { zh: "接收请求，管理会话、权限和音量", "zh-Hant": traditional("接收请求，管理会话、权限和音量"), en: "receives requests, manages sessions, permission, and volume", ja: "要求を受け、セッション、権限、音量を管理", ko: "요청을 받고 세션, 권한, 음량을 관리" }
  },
  {
    kind: "software",
    title: { zh: "混音 / 路由 / 重采样 / 音量管理", "zh-Hant": traditional("混音 / 路由 / 重采样 / 音量管理"), en: "Mixing / routing / resampling / volume", ja: "ミキシング / ルーティング / リサンプリング / 音量管理", ko: "믹싱 / 라우팅 / 리샘플링 / 음량 관리" },
    detail: { zh: "合并播放流，选择设备，统一格式", "zh-Hant": traditional("合并播放流，选择设备，统一格式"), en: "combines streams, selects devices, normalizes formats", ja: "再生ストリームをまとめ、デバイスを選び、形式を統一", ko: "재생 스트림을 합치고 장치를 선택하며 형식을 통일" }
  },
  {
    kind: "driver",
    title: { zh: "驱动接口", "zh-Hant": traditional("驱动接口"), en: "Driver interface", ja: "ドライバーインターフェース", ko: "드라이버 인터페이스" },
    detail: { zh: "承接 PCM 数据、控制命令和设备状态", "zh-Hant": traditional("承接 PCM 数据、控制命令和设备状态"), en: "handles PCM data, controls, and device state", ja: "PCMデータ、制御命令、デバイス状態を受け渡す", ko: "PCM 데이터, 제어 명령, 장치 상태를 처리" }
  },
  {
    kind: "hardware",
    title: { zh: "硬件设备", "zh-Hant": traditional("硬件设备"), en: "Hardware device", ja: "ハードウェアデバイス", ko: "하드웨어 장치" },
    detail: { zh: "Codec / DAC / ADC / 麦克风 / 扬声器", "zh-Hant": traditional("Codec / DAC / ADC / 麦克风 / 扬声器"), en: "Codec / DAC / ADC / microphone / speaker", ja: "Codec / DAC / ADC / マイク / スピーカー", ko: "Codec / DAC / ADC / 마이크 / 스피커" }
  }
] satisfies ArchitectureLayer[];

const linuxArchitectureLayers = [
  {
    kind: "app",
    title: { zh: "应用程序", "zh-Hant": traditional("应用程序"), en: "Application", ja: "アプリケーション", ko: "애플리케이션" },
    detail: { zh: "播放器 / 浏览器 / 录音软件 / 通话软件", "zh-Hant": traditional("播放器 / 浏览器 / 录音软件 / 通话软件"), en: "player / browser / recorder / call app", ja: "プレーヤー / ブラウザー / レコーダー / 通話アプリ", ko: "플레이어 / 브라우저 / 녹음 소프트웨어 / 통화 소프트웨어" }
  },
  {
    kind: "middleware",
    title: { zh: "PipeWire / PulseAudio / JACK", "zh-Hant": traditional("PipeWire / PulseAudio / JACK"), en: "PipeWire / PulseAudio / JACK", ja: "PipeWire / PulseAudio / JACK", ko: "PipeWire / PulseAudio / JACK" },
    detail: { zh: "音频流管理、路由、会话和低延迟服务", "zh-Hant": traditional("音频流管理、路由、会话和低延迟服务"), en: "stream management, routing, sessions, low-latency service", ja: "ストリーム管理、ルーティング、セッション、低遅延サービス", ko: "스트림 관리, 라우팅, 세션, 저지연 서비스" }
  },
  {
    kind: "software",
    title: { zh: "ALSA 用户态接口", "zh-Hant": traditional("ALSA 用户态接口"), en: "ALSA user-space interface", ja: "ALSAユーザー空間インターフェース", ko: "ALSA 사용자 공간 인터페이스" },
    detail: { zh: "alsa-lib / PCM API / mixer control", "zh-Hant": traditional("alsa-lib / PCM API / mixer control"), en: "alsa-lib / PCM API / mixer control", ja: "alsa-lib / PCM API / ミキサー制御", ko: "alsa-lib / PCM API / 믹서 제어" }
  },
  {
    kind: "driver",
    title: { zh: "Linux Kernel ALSA 驱动", "zh-Hant": traditional("Linux Kernel ALSA 驱动"), en: "Linux kernel ALSA driver", ja: "LinuxカーネルALSAドライバー", ko: "Linux 커널 ALSA 드라이버" },
    detail: { zh: "声卡驱动 / I2S / USB Audio / HDA / ASoC", "zh-Hant": traditional("声卡驱动 / I2S / USB Audio / HDA / ASoC"), en: "sound driver / I2S / USB Audio / HDA / ASoC", ja: "サウンドドライバー / I2S / USB Audio / HDA / ASoC", ko: "사운드 드라이버 / I2S / USB Audio / HDA / ASoC" }
  },
  {
    kind: "hardware",
    title: { zh: "硬件层", "zh-Hant": traditional("硬件层"), en: "Hardware layer", ja: "ハードウェア層", ko: "하드웨어 계층" },
    detail: { zh: "Codec / DAC / ADC / 功放 / 麦克风 / 扬声器", "zh-Hant": traditional("Codec / DAC / ADC / 功放 / 麦克风 / 扬声器"), en: "Codec / DAC / ADC / amplifier / mic / speaker", ja: "Codec / DAC / ADC / アンプ / マイク / スピーカー", ko: "Codec / DAC / ADC / 앰프 / 마이크 / 스피커" }
  }
] satisfies ArchitectureLayer[];

const architectureKindLabels = {
  app: { zh: "应用", "zh-Hant": traditional("应用"), en: "App", ja: "アプリ", ko: "앱" },
  middleware: { zh: "中间件", "zh-Hant": traditional("中间件"), en: "Middleware", ja: "ミドルウェア", ko: "미들웨어" },
  software: { zh: "软件", "zh-Hant": traditional("软件"), en: "Software", ja: "ソフトウェア", ko: "소프트웨어" },
  driver: { zh: "驱动", "zh-Hant": traditional("驱动"), en: "Driver", ja: "ドライバー", ko: "드라이버" },
  hardware: { zh: "硬件", "zh-Hant": traditional("硬件"), en: "Hardware", ja: "ハードウェア", ko: "하드웨어" }
} satisfies Record<ArchitectureLayer["kind"], LocalizedText>;

const flowTabs: Array<{ id: FlowMode; label: LocalizedText }> = [
  { id: "playback", label: { zh: "播放链路", "zh-Hant": traditional("播放链路"), en: "Playback path", ja: "再生経路", ko: "재생 경로" } },
  { id: "capture", label: { zh: "录音链路", "zh-Hant": traditional("录音链路"), en: "Capture path", ja: "録音経路", ko: "녹음 경로" } },
  { id: "duplex", label: { zh: "全双工语音", "zh-Hant": traditional("全双工语音"), en: "Full-duplex voice", ja: "全二重音声", ko: "전이중 음성" } }
];

const flowCopy = {
  playback: {
    summary: {
      zh: "播放链路重点：系统把应用输出映射到当前可用的输出设备。", "zh-Hant": traditional("播放链路重点：系统把应用输出映射到当前可用的输出设备。"),
      en: "Playback focus: the system maps app output to the currently available output device.",
      ja: "再生経路の要点：システムがアプリの出力を現在利用できる出力デバイスへ割り当てます。",
      ko: "재생 경로의 핵심: 시스템이 앱 출력을 현재 사용할 수 있는 출력 장치에 매핑합니다."
    },
  },
  capture: {
    summary: {
      zh: "录音链路重点：系统在应用拿到数据前完成权限、输入选择和格式交付。", "zh-Hant": traditional("录音链路重点：系统在应用拿到数据前完成权限、输入选择和格式交付。"),
      en: "Capture focus: the system handles permission, input selection, and format delivery before the app receives data.",
      ja: "録音経路の要点：アプリがデータを受け取る前に、権限、入力選択、形式の受け渡しを処理します。",
      ko: "녹음 경로의 핵심: 앱이 데이터를 받기 전에 권한, 입력 선택, 형식 전달을 처리합니다."
    },
  },
  duplex: {
    summary: {
      zh: "全双工重点：系统只说明回放参考和采集流怎样接入语音链路。", "zh-Hant": traditional("全双工重点：系统只说明回放参考和采集流怎样接入语音链路。"),
      en: "Full-duplex focus: the system only shows how playback reference and capture stream enter the voice path.",
      ja: "全二重の要点：再生リファレンスと収音ストリームが音声経路に入る方法だけを示します。",
      ko: "전이중의 핵심: 재생 참조와 캡처 스트림이 음성 경로에 들어가는 방식만 보여줍니다."
    },
  }
} satisfies Record<FlowMode, { summary: LocalizedText }>;

const flowSteps = {
  playback: [
    {
      label: { zh: "App 播放请求", "zh-Hant": traditional("App 播放请求"), en: "Playback request", ja: "App再生要求", ko: "App 재생 요청" },
      sub: { zh: "媒体 / 游戏 / 提示音", "zh-Hant": traditional("媒体 / 游戏 / 提示音"), en: "Media / game / prompt", ja: "メディア / ゲーム / 通知音", ko: "미디어 / 게임 / 알림음" },
      x: 178,
      y: 170
    },
    {
      label: { zh: "Audio API", "zh-Hant": traditional("Audio API"), en: "Audio API", ja: "Audio API", ko: "Audio API" },
      sub: { zh: "格式 / 会话", "zh-Hant": traditional("格式 / 会话"), en: "format / session", ja: "形式 / セッション", ko: "형식 / 세션" },
      x: 486,
      y: 170
    },
    {
      label: { zh: "音频服务", "zh-Hant": traditional("音频服务"), en: "Audio service", ja: "オーディオサービス", ko: "오디오 서비스" },
      sub: { zh: "音频焦点 / session", "zh-Hant": traditional("音频焦点 / session"), en: "focus / session", ja: "オーディオフォーカス / セッション", ko: "오디오 포커스 / 세션" },
      x: 794,
      y: 170
    },
    {
      label: { zh: "混音 / 重采样", "zh-Hant": traditional("混音 / 重采样"), en: "Mix / resample", ja: "ミックス / リサンプル", ko: "믹스 / 리샘플" },
      sub: { zh: "多路流统一输出", "zh-Hant": traditional("多路流统一输出"), en: "streams to output", ja: "複数ストリームを出力へ", ko: "여러 스트림을 출력으로" },
      x: 794,
      y: 448
    },
    {
      label: { zh: "HAL / 驱动", "zh-Hant": traditional("HAL / 驱动"), en: "HAL / driver", ja: "HAL / ドライバー", ko: "HAL / 드라이버" },
      sub: { zh: "DMA / 接口配置", "zh-Hant": traditional("DMA / 接口配置"), en: "DMA / interface", ja: "DMA / インターフェース設定", ko: "DMA / 인터페이스 설정" },
      x: 486,
      y: 448
    },
    {
      label: { zh: "扬声器 / 耳机", "zh-Hant": traditional("扬声器 / 耳机"), en: "Speaker / headset", ja: "スピーカー / ヘッドセット", ko: "스피커 / 헤드셋" },
      sub: { zh: "Codec / DAC 输出", "zh-Hant": traditional("Codec / DAC 输出"), en: "Codec / DAC out", ja: "Codec / DAC出力", ko: "Codec / DAC 출력" },
      x: 178,
      y: 448
    }
  ],
  capture: [
    {
      label: { zh: "麦克风 / ADC", "zh-Hant": traditional("麦克风 / ADC"), en: "Mic / ADC", ja: "マイク / ADC", ko: "마이크 / ADC" },
      sub: { zh: "声压转数字样本", "zh-Hant": traditional("声压转数字样本"), en: "pressure to samples", ja: "音圧をサンプルへ", ko: "음압을 샘플로" },
      x: 178,
      y: 170
    },
    {
      label: { zh: "HAL / 驱动", "zh-Hant": traditional("HAL / 驱动"), en: "HAL / driver", ja: "HAL / ドライバー", ko: "HAL / 드라이버" },
      sub: { zh: "DMA / 时间戳", "zh-Hant": traditional("DMA / 时间戳"), en: "DMA / timestamp", ja: "DMA / タイムスタンプ", ko: "DMA / 타임스탬프" },
      x: 486,
      y: 170
    },
    {
      label: { zh: "输入路由", "zh-Hant": traditional("输入路由"), en: "Input routing", ja: "入力ルーティング", ko: "입력 라우팅" },
      sub: { zh: "内置 / USB / 蓝牙", "zh-Hant": traditional("内置 / USB / 蓝牙"), en: "built-in / USB / BT", ja: "内蔵 / USB / Bluetooth", ko: "내장 / USB / Bluetooth" },
      x: 794,
      y: 170
    },
    {
      label: { zh: "音频服务", "zh-Hant": traditional("音频服务"), en: "Audio service", ja: "オーディオサービス", ko: "오디오 서비스" },
      sub: { zh: "授权后交付", "zh-Hant": traditional("授权后交付"), en: "authorized delivery", ja: "権限確認後に配信", ko: "권한 확인 후 전달" },
      x: 794,
      y: 448
    },
    {
      label: { zh: "可选预处理", "zh-Hant": traditional("可选预处理"), en: "Optional processing", ja: "任意の前処理", ko: "선택적 전처리" },
      sub: { zh: "增益 / 降噪 / 格式", "zh-Hant": traditional("增益 / 降噪 / 格式"), en: "gain / denoise / format", ja: "ゲイン / ノイズ抑制 / 形式", ko: "게인 / 잡음 억제 / 형식" },
      x: 486,
      y: 448
    },
    {
      label: { zh: "App 录音数据", "zh-Hant": traditional("App 录音数据"), en: "App capture data", ja: "App収音データ", ko: "App 캡처 데이터" },
      sub: { zh: "识别 / 通话 / 录制", "zh-Hant": traditional("识别 / 通话 / 录制"), en: "ASR / call / record", ja: "認識 / 通話 / 録音", ko: "인식 / 통화 / 녹음" },
      x: 178,
      y: 448
    }
  ],
  duplex: [
    {
      label: { zh: "回放流", "zh-Hant": traditional("回放流"), en: "Playback stream", ja: "再生ストリーム", ko: "재생 스트림" },
      sub: { zh: "混音 / 音量后 PCM", "zh-Hant": traditional("混音 / 音量后 PCM"), en: "post-mix / volume PCM", ja: "ミックス / 音量処理後のPCM", ko: "믹스 / 음량 처리 후 PCM" },
      x: 190,
      y: 170
    },
    {
      label: { zh: "扬声器输出", "zh-Hant": traditional("扬声器输出"), en: "Speaker output", ja: "スピーカー出力", ko: "스피커 출력" },
      sub: { zh: "进入空气和麦克风", "zh-Hant": traditional("进入空气和麦克风"), en: "into air and mic", ja: "空気とマイクへ", ko: "공기와 마이크로" },
      x: 506,
      y: 170
    },
    {
      label: { zh: "回放参考", "zh-Hant": traditional("回放参考"), en: "Playback reference", ja: "再生リファレンス", ko: "재생 참조" },
      sub: { zh: "数字副本，需时间对齐", "zh-Hant": traditional("数字副本，需时间对齐"), en: "aligned digital copy", ja: "時間整合が必要なデジタルコピー", ko: "시간 정렬이 필요한 디지털 복사본" },
      x: 822,
      y: 170
    },
    {
      label: { zh: "采集流", "zh-Hant": traditional("采集流"), en: "Capture stream", ja: "収音ストリーム", ko: "캡처 스트림" },
      sub: { zh: "近端语音 + 回声", "zh-Hant": traditional("近端语音 + 回声"), en: "near voice + echo", ja: "近端音声 + エコー", ko: "근접 음성 + 에코" },
      x: 190,
      y: 462
    },
    {
      label: { zh: "AEC / NS / AGC", "zh-Hant": traditional("AEC / NS / AGC"), en: "AEC / NS / AGC", ja: "AEC / NS / AGC", ko: "AEC / NS / AGC" },
      sub: { zh: "消回声 / 降噪 / 自动增益", "zh-Hant": traditional("消回声 / 降噪 / 自动增益"), en: "echo / noise / gain", ja: "エコー除去 / ノイズ抑制 / 自動ゲイン", ko: "에코 제거 / 잡음 억제 / 자동 게인" },
      x: 506,
      y: 462
    },
    {
      label: { zh: "语音 App", "zh-Hant": traditional("语音 App"), en: "Voice app", ja: "音声アプリ", ko: "음성 앱" },
      sub: { zh: "通话 / 会议 / 对讲", "zh-Hant": traditional("通话 / 会议 / 对讲"), en: "call / meeting / intercom", ja: "通話 / 会議 / インターコム", ko: "통화 / 회의 / 인터컴" },
      x: 822,
      y: 462
    }
  ]
} satisfies Record<FlowMode, FlowStep[]>;

function renderFlowDiagram(language: Language, flowMode: FlowMode) {
  const steps = flowSteps[flowMode];
  const isDuplex = flowMode === "duplex";
  const label = {
    playback: { zh: "播放链路流程图", "zh-Hant": traditional("播放链路流程图"), en: "Playback path flowchart", ja: "再生経路フローチャート", ko: "재생 경로 플로차트" },
    capture: { zh: "录音链路流程图", "zh-Hant": traditional("录音链路流程图"), en: "Capture path flowchart", ja: "録音経路フローチャート", ko: "녹음 경로 플로차트" },
    duplex: { zh: "全双工语音流程图", "zh-Hant": traditional("全双工语音流程图"), en: "Full-duplex voice flowchart", ja: "全二重音声フローチャート", ko: "전이중 음성 플로차트" }
  } satisfies Record<FlowMode, LocalizedText>;
  const renderStepConnector = (step: FlowStep, next: FlowStep, index: number) => {
    if (step.y === next.y) {
      return (
        <path
          className="system-audio-arrow"
          d={`M ${step.x + Math.sign(next.x - step.x) * FLOW_NODE_HALF_WIDTH} ${step.y} H ${next.x - Math.sign(next.x - step.x) * FLOW_NODE_HALF_WIDTH}`}
          key={`${step.label.en}-${next.label.en}`}
        />
      );
    }

    return (
      <path
        className="system-audio-arrow"
        d={`M ${step.x} ${step.y + FLOW_NODE_HALF_HEIGHT} V ${(step.y + next.y) / 2} H ${next.x} V ${next.y - FLOW_NODE_HALF_HEIGHT}`}
        key={`${step.label.en}-${next.label.en}-${index}`}
      />
    );
  };

  return (
    <figure className="system-audio-flow">
      <div className="system-audio-flow-scroll" role="region" aria-label={localized(language, { zh: "链路图解", "zh-Hant": traditional("链路图解"), en: "Path diagram", ja: "経路図", ko: "경로 다이어그램" })} tabIndex={0}>
      <svg aria-label={localized(language, label[flowMode])} role="img" viewBox={FLOW_VIEWBOX} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <marker id="systemAudioArrow" markerHeight="10" markerWidth="10" orient="auto" refX="8" refY="5">
            <path d="M 0 0 L 10 5 L 0 10 Z" fill="#f0b46a" />
          </marker>
        </defs>
        <rect className="lab-diagram-bg" height={FLOW_HEIGHT} rx="20" width={FLOW_WIDTH} />
        <text className="lab-label system-audio-flow-title" x="56" y="56">
          {localized(language, label[flowMode])}
        </text>
        {steps.map((step) => (
          <g key={step.label.en}>
            <rect
              className="system-audio-node"
              height={FLOW_NODE_HEIGHT}
              rx="18"
              width={FLOW_NODE_WIDTH}
              x={step.x - FLOW_NODE_HALF_WIDTH}
              y={step.y - FLOW_NODE_HALF_HEIGHT}
            />
            <text className="interface-node-text" x={step.x} y={step.y - 4}>
              {localized(language, step.label)}
            </text>
            <text className="interface-node-sub" x={step.x} y={step.y + 34}>
              {localized(language, step.sub)}
            </text>
          </g>
        ))}
        {isDuplex ? (
          <>
            <path className="system-audio-arrow" d="M 316 170 H 380" />
            <path className="system-audio-arrow reference" d="M 348 170 V 78 H 822 V 94" />
            <path className="system-audio-arrow reference" d="M 822 246 C 822 330 632 354 548 386" />
            <path className="system-audio-arrow" d="M 316 462 H 380" />
            <path className="system-audio-arrow" d="M 632 462 H 696" />
            <path className="system-audio-arrow echo" d="M 506 246 C 416 318 286 342 190 386" />
            <text className="system-audio-note" x="56" y="584">
              {localized(language, {
                zh: "青色虚线：回放 PCM 分支 → AEC 参考；用于估计回声，需匹配延迟与采样时钟", "zh-Hant": traditional("青色虚线：回放 PCM 分支 → AEC 参考；用于估计回声，需匹配延迟与采样时钟"),
                en: "Teal dashed: playback PCM → AEC reference; estimates echo with delay / clock alignment",
                ja: "青緑の破線：再生PCMの分岐 → AECリファレンス。遅延とサンプリングクロックを合わせてエコーを推定します",
                ko: "청록 점선: 재생 PCM 분기 → AEC 참조. 딜레이와 샘플링 클록을 맞춰 에코를 추정합니다"
              })}
            </text>
            <text className="system-audio-note" x="56" y="628">
              {localized(language, {
                zh: "橙色虚线：扬声器声经过房间传播，被麦克风再次采到", "zh-Hant": traditional("橙色虚线：扬声器声经过房间传播，被麦克风再次采到"),
                en: "Orange dashed: speaker sound travels through the room and reaches the mic",
                ja: "オレンジの破線：スピーカー音が部屋を伝わり、マイクに再び取り込まれます",
                ko: "주황 점선: 스피커 소리가 공간을 거쳐 마이크에 다시 들어옵니다"
              })}
            </text>
          </>
        ) : (
          steps.slice(0, -1).map((step, index) => {
            const next = steps[index + 1];
            return renderStepConnector(step, next, index);
          })
        )}
      </svg>
      </div>
      <figcaption>
        {localized(language, flowCopy[flowMode].summary)}
        {flowMode === "capture"
          ? localized(language, {
              zh: " 权限与隐私属于控制策略，不是处理 PCM 的滤波步骤；授权可在打开设备前或交付数据前检查。", "zh-Hant": traditional(" 权限与隐私属于控制策略，不是处理 PCM 的滤波步骤；授权可在打开设备前或交付数据前检查。"),
              en: " Permission and privacy are control policy, not PCM filtering; checks can gate device opening or data delivery.",
              ja: " 権限とプライバシーは制御方針であり、PCM処理のフィルター手順ではありません。デバイスを開く前またはデータ配信前に確認できます。",
              ko: " 권한과 개인정보 보호는 제어 정책이며 PCM 필터링 단계가 아닙니다. 장치를 열기 전이나 데이터를 전달하기 전에 확인할 수 있습니다."
            })
          : null}
      </figcaption>
    </figure>
  );
}

function ArchitectureStack({
  ariaLabel,
  language,
  layers
}: {
  ariaLabel: string;
  language: Language;
  layers: ArchitectureLayer[];
}) {
  return (
    <figure aria-label={ariaLabel} className="system-audio-architecture-card" role="img">
      <div className="system-audio-architecture-stack">
        {layers.map((layer, index) => (
          <div className="system-audio-architecture-row" key={layer.title.en}>
            <div className={`system-audio-architecture-box ${layer.kind}`}>
              <span className={`system-audio-kind-badge ${layer.kind}`}>
                {localized(language, architectureKindLabels[layer.kind])}
              </span>
              <strong>{localized(language, layer.title)}</strong>
              <span>{localized(language, layer.detail)}</span>
            </div>
            {index < layers.length - 1 ? <span aria-hidden="true" className="system-audio-down-arrow">↓</span> : null}
          </div>
        ))}
      </div>
    </figure>
  );
}

export function SystemAudioLab({ language, onBack, onBackToDetails }: SystemAudioLabProps) {
  const [flowMode, setFlowMode] = useState<FlowMode>("playback");

  return (
    <main className="codec-lab-page system-audio-lab">
      <section className="sound-lab-hero" aria-labelledby="system-audio-lab-title">
        <div className="sound-lab-back-actions">
          <button className="sound-lab-back sound-lab-back-secondary" type="button" onClick={onBack}>
            <ArrowLeft size={18} aria-hidden="true" />
            {localized(language, { zh: "返回知识库", "zh-Hant": traditional("返回知识库"), en: "Back to knowledge base", ja: "ナレッジベースに戻る", ko: "지식 베이스로 돌아가기" })}
          </button>
          {onBackToDetails && <button className="sound-lab-back" type="button" onClick={onBackToDetails}>
            <ArrowLeft size={18} aria-hidden="true" />
            {localized(language, { zh: "返回详细内容", "zh-Hant": traditional("返回详细内容"), en: "Back to detailed content", ja: "詳細内容に戻る", ko: "상세 내용으로 돌아가기" })}
          </button>}
        </div>
        <div>
          <span className="section-kicker">{localized(language, { zh: "软件实验", "zh-Hant": traditional("软件实验"), en: "Software lab", ja: "ソフトウェア実験", ko: "소프트웨어 실험" })}</span>
          <h1 id="system-audio-lab-title">
            {localized(language, { zh: "系统音频架构实验室", "zh-Hant": traditional("系统音频架构实验室"), en: "System Audio Architecture Lab", ja: "システムオーディオアーキテクチャラボ", ko: "시스템 오디오 아키텍처 실험실" })}
          </h1>
          <p>{localized(language, {
            zh: "对照通用架构与 Linux 映射，切换播放、录音和全双工的数据方向。", "zh-Hant": traditional("对照通用架构与 Linux 映射，切换播放、录音和全双工的数据方向。"),
            en: "Compare the generic architecture with its Linux mapping, then switch playback, capture, and full-duplex data paths.",
            ja: "一般的なアーキテクチャとLinuxの対応関係を比べ、再生、録音、全二重のデータ方向を切り替えます。",
            ko: "일반 아키텍처와 Linux 매핑을 비교하고 재생, 녹음, 전이중 데이터 경로를 전환합니다."
          })}</p>
        </div>
      </section>

      <section
        aria-label={localized(language, { zh: "系统音频架构总览", "zh-Hant": traditional("系统音频架构总览"), en: "System audio architecture overview", ja: "システムオーディオアーキテクチャ概要", ko: "시스템 오디오 아키텍처 개요" })}
        className="system-audio-overview"
      >
        <div className="system-audio-overview-grid">
          <article className="system-audio-frame-panel">
            <span className="section-kicker">{localized(language, { zh: "通用框架", "zh-Hant": traditional("通用框架"), en: "Generic model", ja: "一般モデル", ko: "일반 모델" })}</span>
            <h2>{localized(language, { zh: "通用系统音频架构", "zh-Hant": traditional("通用系统音频架构"), en: "Generic System Audio Architecture", ja: "一般的なシステムオーディオアーキテクチャ", ko: "일반 시스템 오디오 아키텍처" })}</h2>
            <ArchitectureStack
              ariaLabel={localized(language, { zh: "通用系统音频架构框图", "zh-Hant": traditional("通用系统音频架构框图"), en: "Generic system audio architecture block diagram", ja: "一般的なシステムオーディオアーキテクチャのブロック図", ko: "일반 시스템 오디오 아키텍처 블록 다이어그램" })}
              language={language}
              layers={genericArchitectureLayers}
            />
          </article>

          <article className="system-audio-frame-panel">
            <span className="section-kicker">{localized(language, { zh: "具体例子", "zh-Hant": traditional("具体例子"), en: "Concrete example", ja: "具体例", ko: "구체적인 예" })}</span>
            <h2>{localized(language, { zh: "Linux 音频架构示例", "zh-Hant": traditional("Linux 音频架构示例"), en: "Linux Audio Architecture Example", ja: "Linuxオーディオアーキテクチャの例", ko: "Linux 오디오 아키텍처 예시" })}</h2>
            <ArchitectureStack
              ariaLabel={localized(language, { zh: "Linux 音频架构示例框图", "zh-Hant": traditional("Linux 音频架构示例框图"), en: "Linux audio architecture example block diagram", ja: "Linuxオーディオアーキテクチャ例のブロック図", ko: "Linux 오디오 아키텍처 예시 블록 다이어그램" })}
              language={language}
              layers={linuxArchitectureLayers}
            />
          </article>
        </div>

        <p className="system-audio-overview-note">
          {localized(language, {
            zh: "Linux 只是具体映射：PipeWire、PulseAudio、JACK 是不同服务方案，不是必须逐级串联；应用也可直接使用 alsa-lib。alsa-lib 在用户态，ALSA/ASoC 驱动在内核态。以上箭头表示播放方向，采集方向相反。", "zh-Hant": traditional("Linux 只是具体映射：PipeWire、PulseAudio、JACK 是不同服务方案，不是必须逐级串联；应用也可直接使用 alsa-lib。alsa-lib 在用户态，ALSA/ASoC 驱动在内核态。以上箭头表示播放方向，采集方向相反。"),
            en: "Linux is one concrete mapping: PipeWire, PulseAudio and JACK are service alternatives, not mandatory successive layers; applications can also use alsa-lib directly. alsa-lib is user-space software; ALSA/ASoC drivers run in the kernel. The stack arrows show playback; capture runs in reverse.",
            ja: "Linuxは具体的な対応例の一つです。PipeWire、PulseAudio、JACKは異なるサービス方式で、必ず順番に連結する層ではありません。アプリはalsa-libを直接使うこともできます。alsa-libはユーザー空間、ALSA/ASoCドライバーはカーネル空間で動作します。スタックの矢印は再生方向を示し、収音方向は逆です。",
            ko: "Linux는 구체적인 매핑 중 하나입니다. PipeWire, PulseAudio, JACK은 서로 다른 서비스 방식이며 반드시 순서대로 연결되는 계층은 아닙니다. 앱은 alsa-lib를 직접 사용할 수도 있습니다. alsa-lib는 사용자 공간, ALSA/ASoC 드라이버는 커널 공간에서 동작합니다. 스택 화살표는 재생 방향을 나타내며 캡처 방향은 반대입니다."
          })}
        </p>
      </section>

      <section
        aria-label={localized(language, { zh: "系统音频链路实验台", "zh-Hant": traditional("系统音频链路实验台"), en: "System audio path workbench", ja: "システムオーディオ経路ワークベンチ", ko: "시스템 오디오 경로 작업대" })}
        className="system-audio-workbench"
      >
        <div className="amp-lab-panel">
          <div className="waveform-tabs" role="group" aria-label={localized(language, { zh: "链路模式", "zh-Hant": traditional("链路模式"), en: "Path mode", ja: "経路モード", ko: "경로 모드" })}>
            {flowTabs.map((tab) => (
              <button
                aria-pressed={flowMode === tab.id}
                className={flowMode === tab.id ? "waveform-tab active" : "waveform-tab"}
                key={tab.id}
                type="button"
                onClick={() => setFlowMode(tab.id)}
              >
                {localized(language, tab.label)}
              </button>
            ))}
          </div>
          {renderFlowDiagram(language, flowMode)}
        </div>
      </section>
    </main>
  );
}
