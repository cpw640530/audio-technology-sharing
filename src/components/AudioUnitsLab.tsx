import { traditional } from "../content/traditional";
import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import type { Language, LocalizedText } from "../content/knowledge";

type AudioUnitsLabProps = {
  language: Language;
  onBack: () => void;
  onBackToDetails?: () => void;
};

type ConversionUnit =
  | "dBSPL"
  | "Pa"
  | "uPa"
  | "dBu"
  | "dBV"
  | "Vrms"
  | "W"
  | "dBW"
  | "dBm"
  | "dBFS"
  | "dBAmplitude"
  | "dBPower";

type ConversionResult = {
  label: string | LocalizedText;
  value: string;
  valueByLanguage?: LocalizedText;
};

type ConversionCalculation =
  | {
      kind: "valid";
      domain: Record<Language, string>;
      results: ConversionResult[];
      note?: Record<Language, string>;
    }
  | {
      kind: "invalid";
      message: Record<Language, string>;
    };

const conversionUnitOptions = [
  { value: "dBSPL", label: { zh: "dBSPL（声压级）", "zh-Hant": traditional("dBSPL（声压级）"), en: "dBSPL (sound pressure)", ja: "dBSPL（音圧レベル）", ko: "dBSPL (음압 레벨)" } },
  { value: "Pa", label: { zh: "Pa（声压）", "zh-Hant": traditional("Pa（声压）"), en: "Pa (sound pressure)", ja: "Pa（音圧）", ko: "Pa (음압)" } },
  { value: "uPa", label: { zh: "uPa（声压）", "zh-Hant": traditional("uPa（声压）"), en: "uPa (sound pressure)", ja: "uPa（音圧）", ko: "uPa (음압)" } },
  { value: "dBu", label: { zh: "dBu（模拟电压）", "zh-Hant": traditional("dBu（模拟电压）"), en: "dBu (analog voltage)", ja: "dBu（アナログ電圧）", ko: "dBu (아날로그 전압)" } },
  { value: "dBV", label: { zh: "dBV（模拟电压）", "zh-Hant": traditional("dBV（模拟电压）"), en: "dBV (analog voltage)", ja: "dBV（アナログ電圧）", ko: "dBV (아날로그 전압)" } },
  { value: "Vrms", label: { zh: "Vrms（有效值电压）", "zh-Hant": traditional("Vrms（有效值电压）"), en: "Vrms (RMS voltage)", ja: "Vrms（実効値電圧）", ko: "Vrms (RMS 전압)" } },
  { value: "W", label: { zh: "W（功率）", "zh-Hant": traditional("W（功率）"), en: "W (power)", ja: "W（電力）", ko: "W (전력)" } },
  { value: "dBW", label: { zh: "dBW（参考 1 W）", "zh-Hant": traditional("dBW（参考 1 W）"), en: "dBW (ref 1 W)", ja: "dBW（1 W 基準）", ko: "dBW (1 W 기준)" } },
  { value: "dBm", label: { zh: "dBm（参考 1 mW）", "zh-Hant": traditional("dBm（参考 1 mW）"), en: "dBm (ref 1 mW)", ja: "dBm（1 mW 基準）", ko: "dBm (1 mW 기준)" } },
  { value: "dBFS", label: { zh: "dBFS（数字满刻度）", "zh-Hant": traditional("dBFS（数字满刻度）"), en: "dBFS (digital full scale)", ja: "dBFS（デジタルフルスケール）", ko: "dBFS (디지털 풀 스케일)" } },
  { value: "dBAmplitude", label: { zh: "dB（幅度比）", "zh-Hant": traditional("dB（幅度比）"), en: "dB (amplitude ratio)", ja: "dB（振幅比）", ko: "dB (진폭비)" } },
  { value: "dBPower", label: { zh: "dB（功率比）", "zh-Hant": traditional("dB（功率比）"), en: "dB (power ratio)", ja: "dB（電力比）", ko: "dB (전력비)" } }
] satisfies Array<{ value: ConversionUnit; label: Record<Language, string> }>;

const conversionBoundaryNote = {
  zh: "提示：dBSPL 与 dBFS/dBu/dBV 不能无校准直接互转；这里只计算同一参考域内的等效值。", "zh-Hant": traditional("提示：dBSPL 与 dBFS/dBu/dBV 不能无校准直接互转；这里只计算同一参考域内的等效值。"),
  en: "Note: dBSPL cannot be directly converted to dBFS/dBu/dBV without calibration; this tool only calculates equivalents inside the same reference domain.",
  ja: "注：dBSPL は校正なしで dBFS/dBu/dBV に直接変換できません。このツールは同じ基準領域内の等価値だけを計算します。",
  ko: "참고: dBSPL은 보정 없이 dBFS/dBu/dBV로 직접 변환할 수 없습니다. 이 도구는 같은 기준 영역 안의 등가값만 계산합니다."
};

const invalidNumberMessage = {
  zh: "请输入有效数字。", "zh-Hant": traditional("请输入有效数字。"),
  en: "Enter a valid number.",
  ja: "有効な数値を入力してください。",
  ko: "유효한 숫자를 입력하세요."
};

const positiveNumberMessage = {
  zh: "该单位必须输入大于 0 的数值。", "zh-Hant": traditional("该单位必须输入大于 0 的数值。"),
  en: "This unit requires a value greater than 0.",
  ja: "この単位には 0 より大きい数値を入力してください。",
  ko: "이 단위에는 0보다 큰 값을 입력해야 합니다."
};

const audioUnitsCopy = {
  diagramAria: {
    zh: "声音与音频单位参考关系图", "zh-Hant": traditional("声音与音频单位参考关系图"),
    en: "Sound and audio unit reference diagram",
    ja: "音声とオーディオ単位の基準関係図",
    ko: "소리와 오디오 단위 기준 관계도"
  },
  diagramHeading: {
    zh: "先看参考点：同样写 dB，含义可能完全不同", "zh-Hant": traditional("先看参考点：同样写 dB，含义可能完全不同"),
    en: "Start with the reference: dB suffixes can mean very different things",
    ja: "まず基準を確認：同じ dB でも接尾辞で意味が大きく変わります",
    ko: "먼저 기준을 확인하세요: 같은 dB라도 접미사에 따라 의미가 크게 다릅니다"
  },
  acousticPressure: { zh: "空气声压", "zh-Hant": traditional("空气声压"), en: "acoustic pressure", ja: "空気の音圧", ko: "공기 음압" },
  digitalAmplitude: { zh: "数字幅度", "zh-Hant": traditional("数字幅度"), en: "digital amplitude", ja: "デジタル振幅", ko: "디지털 진폭" },
  analogVoltage: { zh: "模拟电压", "zh-Hant": traditional("模拟电压"), en: "analog voltage", ja: "アナログ電圧", ko: "아날로그 전압" },
  programLoudness: { zh: "节目响度", "zh-Hant": traditional("节目响度"), en: "program loudness", ja: "番組ラウドネス", ko: "프로그램 음량" },
  quiet: { zh: "30 dB 安静", "zh-Hant": traditional("30 dB 安静"), en: "30 dB quiet", ja: "30 dB 静かな環境", ko: "30 dB 조용한 환경" },
  onePascal: { zh: "94 dB = 1 Pa", "zh-Hant": traditional("94 dB = 1 Pa"), en: "94 dB = 1 Pa", ja: "94 dB = 1 Pa", ko: "94 dB = 1 Pa" },
  loud: { zh: "120 dB 很响", "zh-Hant": traditional("120 dB 很响"), en: "120 dB very loud", ja: "120 dB 非常に大きい音", ko: "120 dB 매우 큰 소리" },
  fullScale: { zh: "0 dBFS 满刻度", "zh-Hant": traditional("0 dBFS 满刻度"), en: "0 dBFS full scale", ja: "0 dBFS フルスケール", ko: "0 dBFS 풀 스케일" },
  halfAmplitude: { zh: "-6 dBFS 约半幅度", "zh-Hant": traditional("-6 dBFS 约半幅度"), en: "-6 dBFS half-ish", ja: "-6 dBFS 振幅は約半分", ko: "-6 dBFS 진폭 약 절반" },
  negativeNormal: { zh: "负数是正常电平", "zh-Hant": traditional("负数是正常电平"), en: "negative is normal", ja: "負の値が通常のレベル", ko: "음수 값이 정상 레벨" },
  lineLevel: { zh: "线路电平", "zh-Hant": traditional("线路电平"), en: "line level", ja: "ラインレベル", ko: "라인 레벨" },
  integratedLoudness: { zh: "积分响度", "zh-Hant": traditional("积分响度"), en: "integrated loudness", ja: "統合ラウドネス", ko: "통합 음량" },
  normalization: { zh: "平台标准化", "zh-Hant": traditional("平台标准化"), en: "platform normalization", ja: "プラットフォームのノーマライズ", ko: "플랫폼 정규화" },
  cannotConvert: {
    zh: "不能把 -6 dBFS 直接换成 94 dBSPL", "zh-Hant": traditional("不能把 -6 dBFS 直接换成 94 dBSPL"),
    en: "You cannot directly convert -6 dBFS to 94 dBSPL",
    ja: "-6 dBFS を 94 dBSPL に直接変換することはできません",
    ko: "-6 dBFS를 94 dBSPL로 직접 변환할 수 없습니다"
  },
  calibrationPath: {
    zh: "中间还要经过 DAC、功放、扬声器灵敏度和距离。", "zh-Hant": traditional("中间还要经过 DAC、功放、扬声器灵敏度和距离。"),
    en: "DAC, amplifier, speaker sensitivity, and distance sit in between.",
    ja: "途中には DAC、アンプ、スピーカー感度、距離の要素があります。",
    ko: "중간에는 DAC, 앰프, 스피커 감도와 거리 요소가 있습니다."
  },
  backKnowledge: { zh: "返回知识库", "zh-Hant": traditional("返回知识库"), en: "Back to knowledge base", ja: "知識ベースに戻る", ko: "지식 베이스로 돌아가기" },
  backGuide: { zh: "返回详细内容", "zh-Hant": traditional("返回详细内容"), en: "Back to detailed guide", ja: "詳細ガイドに戻る", ko: "상세 가이드로 돌아가기" },
  kicker: { zh: "基础实验", "zh-Hant": traditional("基础实验"), en: "Fundamentals lab", ja: "基礎ラボ", ko: "기초 실험실" },
  title: { zh: "声音与音频单位实验室", "zh-Hant": traditional("声音与音频单位实验室"), en: "Sound and Audio Units Lab", ja: "音声とオーディオ単位ラボ", ko: "소리와 오디오 단위 실험실" },
  description: {
    zh: "输入数值和单位，观察同一参考域内的换算结果与理想距离衰减。", "zh-Hant": traditional("输入数值和单位，观察同一参考域内的换算结果与理想距离衰减。"),
    en: "Enter a value and unit to inspect same-domain conversion and ideal distance loss.",
    ja: "数値と単位を入力し、同じ基準領域内の換算結果と理想的な距離減衰を確認します。",
    ko: "값과 단위를 입력해 같은 기준 영역 안의 변환 결과와 이상적인 거리 감쇠를 확인합니다."
  },
  workbench: { zh: "声音与音频单位实验台", "zh-Hant": traditional("声音与音频单位实验台"), en: "Sound and audio units workbench", ja: "音声とオーディオ単位の実験台", ko: "소리와 오디오 단위 실험대" },
  tools: { zh: "单位自动换算工具", "zh-Hant": traditional("单位自动换算工具"), en: "Automatic unit conversion tools", ja: "単位自動換算ツール", ko: "단위 자동 변환 도구" },
  converter: { zh: "自动换算器", "zh-Hant": traditional("自动换算器"), en: "Automatic converter", ja: "自動換算器", ko: "자동 변환기" },
  sameDomain: { zh: "理想参考条件下，仅在同一参考域内换算", "zh-Hant": traditional("理想参考条件下，仅在同一参考域内换算"), en: "Ideal reference conditions, only within the same reference domain", ja: "理想的な基準条件で、同じ基準領域内だけを換算", ko: "이상적인 기준 조건에서 같은 기준 영역 안에서만 변환" },
  inputValue: { zh: "输入数值", "zh-Hant": traditional("输入数值"), en: "Input value", ja: "入力値", ko: "입력값" },
  sourceUnit: { zh: "源单位", "zh-Hant": traditional("源单位"), en: "Source unit", ja: "元の単位", ko: "원본 단위" },
  distanceCalculator: { zh: "距离声压衰减计算器", "zh-Hant": traditional("距离声压衰减计算器"), en: "Distance SPL loss calculator", ja: "距離による音圧減衰計算器", ko: "거리 음압 감쇠 계산기" },
  distanceLoss: { zh: "距离声压衰减", "zh-Hant": traditional("距离声压衰减"), en: "Distance SPL loss", ja: "距離による音圧減衰", ko: "거리 음압 감쇠" },
  idealLab: { zh: "理想实验室：自由场、点声源、无反射", "zh-Hant": traditional("理想实验室：自由场、点声源、无反射"), en: "Ideal lab: free field, point source, no reflections", ja: "理想ラボ：自由音場、点音源、反射なし", ko: "이상 실험실: 자유 음장, 점음원, 반사 없음" },
  initialSpl: { zh: "初始声压级", "zh-Hant": traditional("初始声压级"), en: "Initial SPL", ja: "初期音圧レベル", ko: "초기 음압 레벨" },
  initialDistance: { zh: "初始距离", "zh-Hant": traditional("初始距离"), en: "Initial distance", ja: "初期距離", ko: "초기 거리" }
} satisfies Record<string, LocalizedText>;

function resultLabel(label: string | LocalizedText, language: Language) {
  return typeof label === "string" ? label : label[language];
}

function parseFiniteNumber(value: string) {
  if (!value.trim()) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatFixed(value: number, digits: number) {
  return value.toLocaleString("en-US", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits
  });
}

function formatCompact(value: number, digits = 3) {
  if (Math.abs(value) >= 0.001 && Math.abs(value) < 1_000_000) {
    return value.toLocaleString("en-US", {
      maximumFractionDigits: digits,
      minimumFractionDigits: digits
    });
  }

  return value.toExponential(digits);
}

function formatInteger(value: number) {
  return value.toLocaleString("en-US", {
    maximumFractionDigits: 0
  });
}

function calculateConversion(rawValue: string, unit: ConversionUnit): ConversionCalculation {
  const value = parseFiniteNumber(rawValue);

  if (value === null) {
    return { kind: "invalid", message: invalidNumberMessage };
  }

  if (unit === "dBSPL" || unit === "Pa" || unit === "uPa") {
    const pressurePa =
      unit === "dBSPL"
        ? 20e-6 * 10 ** (value / 20)
        : unit === "Pa"
          ? value
          : value / 1_000_000;

    if (pressurePa <= 0) {
      return { kind: "invalid", message: positiveNumberMessage };
    }

    const dbSpl = 20 * Math.log10(pressurePa / 20e-6);

    return {
      kind: "valid",
      domain: { zh: "声压参考域", "zh-Hant": traditional("声压参考域"), en: "Acoustic pressure domain", ja: "音圧の基準領域", ko: "음압 기준 영역" },
      results: [
        { label: { zh: "dBSPL", "zh-Hant": traditional("dBSPL"), en: "dBSPL", ja: "dBSPL", ko: "dBSPL" }, value: `${formatFixed(dbSpl, 2)} dBSPL` },
        { label: { zh: "Pa", "zh-Hant": traditional("Pa"), en: "Pa", ja: "Pa", ko: "Pa" }, value: `${formatCompact(pressurePa, 3)} Pa` },
        { label: { zh: "uPa", "zh-Hant": traditional("uPa"), en: "uPa", ja: "uPa", ko: "uPa" }, value: `${formatInteger(pressurePa * 1_000_000)} uPa` }
      ]
    };
  }

  if (unit === "dBu" || unit === "dBV" || unit === "Vrms") {
    const vrms =
      unit === "dBu" ? 0.775 * 10 ** (value / 20) : unit === "dBV" ? 10 ** (value / 20) : value;

    if (vrms <= 0) {
      return { kind: "invalid", message: positiveNumberMessage };
    }

    return {
      kind: "valid",
      domain: { zh: "模拟电压参考域", "zh-Hant": traditional("模拟电压参考域"), en: "Analog voltage domain", ja: "アナログ電圧の基準領域", ko: "아날로그 전압 기준 영역" },
      results: [
        { label: { zh: "dBu", "zh-Hant": traditional("dBu"), en: "dBu", ja: "dBu", ko: "dBu" }, value: `${formatFixed(20 * Math.log10(vrms / 0.775), 2)} dBu` },
        { label: { zh: "dBV", "zh-Hant": traditional("dBV"), en: "dBV", ja: "dBV", ko: "dBV" }, value: `${formatFixed(20 * Math.log10(vrms), 2)} dBV` },
        { label: { zh: "Vrms", "zh-Hant": traditional("Vrms"), en: "Vrms", ja: "Vrms", ko: "Vrms" }, value: `${formatFixed(vrms, 3)} Vrms` },
        { label: { zh: "mVrms", "zh-Hant": traditional("mVrms"), en: "mVrms", ja: "mVrms", ko: "mVrms" }, value: `${formatInteger(vrms * 1000)} mVrms` }
      ]
    };
  }

  if (unit === "W" || unit === "dBW" || unit === "dBm") {
    const watts = unit === "W" ? value : unit === "dBW" ? 10 ** (value / 10) : 0.001 * 10 ** (value / 10);

    if (watts <= 0) {
      return { kind: "invalid", message: positiveNumberMessage };
    }

    const dbw = 10 * Math.log10(watts);

    return {
      kind: "valid",
      domain: { zh: "功率参考域", "zh-Hant": traditional("功率参考域"), en: "Power domain", ja: "電力の基準領域", ko: "전력 기준 영역" },
      results: [
        { label: { zh: "W", "zh-Hant": traditional("W"), en: "W", ja: "W", ko: "W" }, value: `${formatCompact(watts, 3)} W` },
        { label: { zh: "mW", "zh-Hant": traditional("mW"), en: "mW", ja: "mW", ko: "mW" }, value: `${formatCompact(watts * 1000, 3)} mW` },
        { label: { zh: "dBW", "zh-Hant": traditional("dBW"), en: "dBW", ja: "dBW", ko: "dBW" }, value: `${formatFixed(dbw, 2)} dBW` },
        { label: { zh: "dBm", "zh-Hant": traditional("dBm"), en: "dBm", ja: "dBm", ko: "dBm" }, value: `${formatFixed(dbw + 30, 2)} dBm` }
      ]
    };
  }

  if (unit === "dBFS") {
    const amplitudeRatio = 10 ** (value / 20);

    return {
      kind: "valid",
      domain: { zh: "数字满刻度参考域", "zh-Hant": traditional("数字满刻度参考域"), en: "Digital full-scale domain", ja: "デジタルフルスケールの基準領域", ko: "디지털 풀 스케일 기준 영역" },
      results: [
        { label: { zh: "dBFS", "zh-Hant": traditional("dBFS"), en: "dBFS", ja: "dBFS", ko: "dBFS" }, value: `${formatFixed(value, 2)} dBFS` },
        { label: { zh: "幅度比例", "zh-Hant": traditional("幅度比例"), en: "Amplitude ratio", ja: "振幅比", ko: "진폭비" }, value: `${formatCompact(amplitudeRatio, 3)} x FS` },
        { label: { zh: "满刻度百分比", "zh-Hant": traditional("满刻度百分比"), en: "Full-scale percentage", ja: "フルスケール百分率", ko: "풀 스케일 백분율" }, value: `${formatFixed(amplitudeRatio * 100, 2)}% FS` },
        {
          label: { zh: "余量", "zh-Hant": traditional("余量"), en: "Headroom", ja: "ヘッドルーム", ko: "헤드룸" },
          value: value <= 0 ? `${formatFixed(Math.abs(value), 2)} dB headroom` : "",
          valueByLanguage: value > 0
            ? { zh: "超过 0 dBFS，可能削波", "zh-Hant": traditional("超过 0 dBFS，可能削波"), en: "Above 0 dBFS; clipping is possible", ja: "0 dBFS を超えており、クリッピングの可能性があります", ko: "0 dBFS를 초과하여 클리핑이 발생할 수 있습니다" }
            : undefined
        }
      ],
      note: {
        zh: "dBFS 是数字系统内部参考，只有经过 DAC、增益、扬声器和距离校准后，才能映射到真实声压。", "zh-Hant": traditional("dBFS 是数字系统内部参考，只有经过 DAC、增益、扬声器和距离校准后，才能映射到真实声压。"),
        en: "dBFS is an internal digital reference. It maps to real SPL only after DAC, gain, speaker, and distance calibration.",
        ja: "dBFS はデジタルシステム内部の基準です。実際の音圧へ対応付けるには、DAC、ゲイン、スピーカー、距離の校正が必要です。",
        ko: "dBFS는 디지털 시스템 내부의 기준입니다. 실제 음압으로 대응시키려면 DAC, 게인, 스피커와 거리 보정이 필요합니다."
      }
    };
  }

  const dbValue = value;
  const amplitudeRatio = 10 ** (dbValue / 20);
  const powerRatio = 10 ** (dbValue / 10);

  return {
    kind: "valid",
    domain: { zh: "无量纲比例域", "zh-Hant": traditional("无量纲比例域"), en: "Dimensionless ratio domain", ja: "無次元比の領域", ko: "무차원 비율 영역" },
    results: [
      { label: { zh: "dB", "zh-Hant": traditional("dB"), en: "dB", ja: "dB", ko: "dB" }, value: `${formatFixed(dbValue, 2)} dB` },
      { label: { zh: "幅度比", "zh-Hant": traditional("幅度比"), en: "Amplitude ratio", ja: "振幅比", ko: "진폭비" }, value: `${formatCompact(amplitudeRatio, 3)} : 1` },
      { label: { zh: "功率比", "zh-Hant": traditional("功率比"), en: "Power ratio", ja: "電力比", ko: "전력비" }, value: `${formatCompact(powerRatio, 3)} : 1` }
    ],
    note: {
      zh: unit === "dBAmplitude" ? "幅度、电压、声压这类幅度比使用 20 x log10。" : "功率、能量这类功率比使用 10 x log10。", "zh-Hant": traditional(unit === "dBAmplitude" ? "幅度、电压、声压这类幅度比使用 20 x log10。" : "功率、能量这类功率比使用 10 x log10。"),
      en:
        unit === "dBAmplitude"
          ? "Amplitude-like quantities such as voltage or pressure use 20 x log10."
          : "Power-like quantities use 10 x log10.",
      ja:
        unit === "dBAmplitude"
          ? "電圧や音圧などの振幅に相当する量には 20 x log10 を使います。"
          : "電力に相当する量には 10 x log10 を使います。",
      ko:
        unit === "dBAmplitude"
          ? "전압이나 음압처럼 진폭에 해당하는 양에는 20 x log10을 사용합니다."
          : "전력에 해당하는 양에는 10 x log10을 사용합니다."
    }
  };
}

function calculateDistanceLevels(rawSpl: string, rawDistance: string): ConversionCalculation {
  const spl = parseFiniteNumber(rawSpl);
  const distance = parseFiniteNumber(rawDistance);

  if (spl === null || distance === null) {
    return { kind: "invalid", message: invalidNumberMessage };
  }

  if (distance <= 0) {
    return { kind: "invalid", message: positiveNumberMessage };
  }

  const targetDistances = [1, 2, 4, 8];

  return {
    kind: "valid",
    domain: { zh: "理想自由场距离衰减", "zh-Hant": traditional("理想自由场距离衰减"), en: "Ideal free-field distance loss", ja: "理想自由音場の距離減衰", ko: "이상적인 자유 음장의 거리 감쇠" },
    results: targetDistances.map((targetDistance) => ({
      label: `${targetDistance} m`,
      value: `${formatFixed(spl - 20 * Math.log10(targetDistance / distance), 1)} dBSPL`
    })),
    note: {
      zh: "理想自由场、点声源、无墙面反射和空气吸收时，距离翻倍约 -6 dB，距离减半约 +6 dB。", "zh-Hant": traditional("理想自由场、点声源、无墙面反射和空气吸收时，距离翻倍约 -6 dB，距离减半约 +6 dB。"),
      en: "In an ideal free field with a point source and no reflections or air absorption, doubling distance is about -6 dB and halving distance is about +6 dB.",
      ja: "点音源の理想自由音場で壁面反射と空気吸収を無視すると、距離を2倍にすると約 -6 dB、半分にすると約 +6 dB になります。",
      ko: "점음원인 이상적인 자유 음장에서 벽 반사와 공기 흡수를 무시하면 거리를 2배로 할 때 약 -6 dB, 절반으로 할 때 약 +6 dB가 됩니다."
    }
  };
}


function AudioUnitsDiagram({ language }: { language: Language }) {
  return (
    <svg
      aria-label={audioUnitsCopy.diagramAria[language]}
      role="img"
      viewBox="0 0 820 470"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <marker id="unitArrow" markerHeight="10" markerWidth="10" orient="auto" refX="8" refY="5">
          <path d="M 0 0 L 10 5 L 0 10 Z" fill="#f0b46a" />
        </marker>
      </defs>
      <rect className="lab-diagram-bg" height="470" rx="16" width="820" />
      <text className="lab-label" x="48" y="46">
        {audioUnitsCopy.diagramHeading[language]}
      </text>

      <g className="unit-reference-axis">
        <line x1="82" x2="738" y1="118" y2="118" />
        <text x="82" y="92">{audioUnitsCopy.acousticPressure[language]}</text>
        <text x="304" y="92">{audioUnitsCopy.digitalAmplitude[language]}</text>
        <text x="508" y="92">{audioUnitsCopy.analogVoltage[language]}</text>
        <text x="668" y="92">{audioUnitsCopy.programLoudness[language]}</text>
        {[
          { x: 104, label: "dBSPL", sub: "20 uPa" },
          { x: 326, label: "dBFS", sub: "0 dBFS" },
          { x: 532, label: "dBu / dBV", sub: "0.775 V / 1 V" },
          { x: 704, label: "LUFS", sub: "K-weighted" }
        ].map((item) => (
          <g key={item.label}>
            <circle cx={item.x} cy="118" r="9" />
            <text className="unit-axis-label" x={item.x} y="156">{item.label}</text>
            <text className="unit-axis-sub" x={item.x} y="178">{item.sub}</text>
          </g>
        ))}
      </g>

      <g>
        <rect className="unit-meter acoustic" height="148" rx="12" width="150" x="62" y="238" />
        <text className="interface-node-text" x="137" y="272">dBSPL</text>
        <text className="interface-node-sub" x="137" y="304">{audioUnitsCopy.quiet[language]}</text>
        <text className="interface-node-sub" x="137" y="330">{audioUnitsCopy.onePascal[language]}</text>
        <text className="interface-node-sub" x="137" y="356">{audioUnitsCopy.loud[language]}</text>

        <rect className="unit-meter digital" height="148" rx="12" width="150" x="246" y="238" />
        <text className="interface-node-text" x="321" y="272">dBFS</text>
        <text className="interface-node-sub" x="321" y="304">{audioUnitsCopy.fullScale[language]}</text>
        <text className="interface-node-sub" x="321" y="330">{audioUnitsCopy.halfAmplitude[language]}</text>
        <text className="interface-node-sub" x="321" y="356">{audioUnitsCopy.negativeNormal[language]}</text>

        <rect className="unit-meter voltage" height="148" rx="12" width="150" x="430" y="238" />
        <text className="interface-node-text" x="505" y="272">dBu / dBV</text>
        <text className="interface-node-sub" x="505" y="304">+4 dBu</text>
        <text className="interface-node-sub" x="505" y="330">-10 dBV</text>
        <text className="interface-node-sub" x="505" y="356">{audioUnitsCopy.lineLevel[language]}</text>

        <rect className="unit-meter loudness" height="148" rx="12" width="150" x="614" y="238" />
        <text className="interface-node-text" x="689" y="272">LUFS</text>
        <text className="interface-node-sub" x="689" y="304">{audioUnitsCopy.integratedLoudness[language]}</text>
        <text className="interface-node-sub" x="689" y="330">-14 LUFS</text>
        <text className="interface-node-sub" x="689" y="356">{audioUnitsCopy.normalization[language]}</text>
      </g>

      <text className="lab-chip audio-units-note" x="410" y="424">
        <tspan x="410">{audioUnitsCopy.cannotConvert[language]}</tspan>
        <tspan x="410" dy="26">
          {audioUnitsCopy.calibrationPath[language]}
        </tspan>
      </text>
    </svg>
  );
}

export function AudioUnitsLab({ language, onBack, onBackToDetails }: AudioUnitsLabProps) {
  const [conversionValue, setConversionValue] = useState("94");
  const [conversionUnit, setConversionUnit] = useState<ConversionUnit>("dBSPL");
  const [distanceSpl, setDistanceSpl] = useState("94");
  const [distanceMeters, setDistanceMeters] = useState("1");

  const conversion = useMemo(
    () => calculateConversion(conversionValue, conversionUnit),
    [conversionUnit, conversionValue]
  );
  const distanceCalculation = useMemo(
    () => calculateDistanceLevels(distanceSpl, distanceMeters),
    [distanceMeters, distanceSpl]
  );

  return (
    <main className="codec-lab-page audio-units-page">
      <section className="sound-lab-hero" aria-labelledby="audio-units-title">
        <div className="sound-lab-back-actions">
          <button className="sound-lab-back sound-lab-back-secondary" type="button" onClick={onBack}>
            {audioUnitsCopy.backKnowledge[language]}
          </button>
          {onBackToDetails ? <button className="sound-lab-back" type="button" onClick={onBackToDetails}>
            <ArrowLeft size={18} aria-hidden="true" />
            {audioUnitsCopy.backGuide[language]}
          </button> : null}
        </div>
        <div>
          <span className="section-kicker">{audioUnitsCopy.kicker[language]}</span>
          <h1 id="audio-units-title">{audioUnitsCopy.title[language]}</h1>
          <p>
            {audioUnitsCopy.description[language]}
          </p>
        </div>
      </section>

      <section className="audio-units-workbench" aria-label={audioUnitsCopy.workbench[language]}>
        <div className="audio-units-visual">
          <AudioUnitsDiagram language={language} />
        </div>

        <section className="audio-units-calculator-grid" aria-label={audioUnitsCopy.tools[language]}>
          <section className="audio-units-tool-card" aria-label={audioUnitsCopy.converter[language]}>
            <div className="codec-mode-concepts-header">
              <strong>{audioUnitsCopy.converter[language]}</strong>
              <span>{audioUnitsCopy.sameDomain[language]}</span>
            </div>
            <div className="audio-units-form-grid">
              <label>
                <span>{audioUnitsCopy.inputValue[language]}</span>
                <input
                  aria-label={audioUnitsCopy.inputValue[language]}
                  inputMode="decimal"
                  type="number"
                  value={conversionValue}
                  onChange={(event) => setConversionValue(event.target.value)}
                />
              </label>
              <label>
                <span>{audioUnitsCopy.sourceUnit[language]}</span>
                <select
                  aria-label={audioUnitsCopy.sourceUnit[language]}
                  value={conversionUnit}
                  onChange={(event) => setConversionUnit(event.target.value as ConversionUnit)}
                >
                  {conversionUnitOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label[language]}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            {conversion.kind === "invalid" ? (
              <p className="audio-units-error" role="alert">
                {conversion.message[language]}
              </p>
            ) : (
              <>
                <div className="audio-units-result-heading">
                  <strong>{conversion.domain[language]}</strong>
                  <span>{conversionBoundaryNote[language]}</span>
                </div>
                <div className="audio-units-result-grid">
                  {conversion.results.map((result) => (
                    <article className="audio-units-result" key={resultLabel(result.label, "en")}>
                      <span>{resultLabel(result.label, language)}</span>
                      <strong>{`${resultLabel(result.label, language)}：${result.valueByLanguage?.[language] ?? result.value}`}</strong>
                    </article>
                  ))}
                </div>
                {conversion.note ? <p className="audio-units-note-text">{conversion.note[language]}</p> : null}
              </>
            )}
          </section>

          <section className="audio-units-tool-card" aria-label={audioUnitsCopy.distanceCalculator[language]}>
            <div className="codec-mode-concepts-header">
              <strong>{audioUnitsCopy.distanceLoss[language]}</strong>
              <span>{audioUnitsCopy.idealLab[language]}</span>
            </div>
            <div className="audio-units-form-grid">
              <label>
                <span>{audioUnitsCopy.initialSpl[language]}</span>
                <input
                  aria-label={audioUnitsCopy.initialSpl[language]}
                  inputMode="decimal"
                  type="number"
                  value={distanceSpl}
                  onChange={(event) => setDistanceSpl(event.target.value)}
                />
              </label>
              <label>
                <span>{audioUnitsCopy.initialDistance[language]}</span>
                <input
                  aria-label={audioUnitsCopy.initialDistance[language]}
                  inputMode="decimal"
                  type="number"
                  value={distanceMeters}
                  onChange={(event) => setDistanceMeters(event.target.value)}
                />
              </label>
            </div>
            {distanceCalculation.kind === "invalid" ? (
              <p className="audio-units-error" role="alert">
                {distanceCalculation.message[language]}
              </p>
            ) : (
              <>
                <div className="audio-units-result-heading">
                  <strong>{distanceCalculation.domain[language]}</strong>
                  <span>{distanceCalculation.note?.[language]}</span>
                </div>
                <div className="audio-units-result-grid">
                  {distanceCalculation.results.map((result) => (
                    <article className="audio-units-result" key={resultLabel(result.label, "en")}>
                      <span>{resultLabel(result.label, language)}</span>
                      <strong>{`${resultLabel(result.label, language)}：${result.valueByLanguage?.[language] ?? result.value}`}</strong>
                    </article>
                  ))}
                </div>
              </>
            )}
          </section>
        </section>

      </section>
    </main>
  );
}
