import { traditional } from "../content/traditional";
import { useLabState } from "../hooks/useLabState";
import { ArrowLeft } from "lucide-react";

import type { Language } from "../content/knowledge";
import { text } from "../content/language";

type SupportedLanguage = "zh" | "en" | "ja" | "ko" | "zh-Hant";
type LocalizedText = Record<SupportedLanguage, string>;

const localized = (language: Language, values: LocalizedText) => values[language as SupportedLanguage];

type DiagramMode = "amplifier" | "speaker" | "enclosure" | "ts" | "crossover" | "activePassive" | "lineArray" | "matching";
type AmpClass = "class-a" | "class-ab" | "class-d";
type AmpPrincipleDetail = {
  principle: string;
  advantage: string;
  caution: string;
  usage: string;
};

type AmplifierSpeakerLabProps = {
  language: Language;
  onBack: () => void;
  onBackToDetails?: () => void;
};

const chainLabels: Record<SupportedLanguage, string[]> = {
  zh: ["DAC / Codec 输出", "功放", "被动分频（如有）", "扬声器单元", "空气声波"], "zh-Hant": traditional(["DAC / Codec 输出", "功放", "被动分频（如有）", "扬声器单元", "空气声波"]),
  en: ["DAC / Codec out", "Amplifier", "Passive crossover (if used)", "Speaker driver", "Air pressure"],
  ja: ["DAC / Codec出力", "アンプ", "パッシブクロスオーバー（使用時）", "スピーカードライバー", "空気圧"],
  ko: ["DAC / Codec 출력", "앰프", "패시브 크로스오버(사용 시)", "스피커 드라이버", "공기 압력"]
};

const diagramModes: Array<{ id: DiagramMode; label: LocalizedText }> = [
  { id: "amplifier", label: { zh: "功放类型", "zh-Hant": traditional("功放类型"), en: "Amplifier class", ja: "アンプ方式", ko: "앰프 방식" } },
  { id: "speaker", label: { zh: "扬声器单元", "zh-Hant": traditional("扬声器单元"), en: "Speaker driver", ja: "スピーカードライバー", ko: "스피커 드라이버" } },
  { id: "enclosure", label: { zh: "箱体与分频", "zh-Hant": traditional("箱体与分频"), en: "Enclosure and crossover", ja: "エンクロージャーとクロスオーバー", ko: "인클로저와 크로스오버" } },
  { id: "ts", label: { zh: "T/S 参数", "zh-Hant": traditional("T/S 参数"), en: "T/S parameters", ja: "T/Sパラメータ", ko: "T/S 파라미터" } },
  { id: "crossover", label: { zh: "分频阶数", "zh-Hant": traditional("分频阶数"), en: "Crossover order", ja: "クロスオーバー次数", ko: "크로스오버 차수" } },
  { id: "activePassive", label: { zh: "主动 / 被动分频", "zh-Hant": traditional("主动 / 被动分频"), en: "Active / passive", ja: "アクティブ / パッシブ", ko: "액티브 / 패시브" } },
  { id: "lineArray", label: { zh: "线阵列", "zh-Hant": traditional("线阵列"), en: "Line array", ja: "ラインアレイ", ko: "라인 어레이" } },
  { id: "matching", label: { zh: "匹配关系", "zh-Hant": traditional("匹配关系"), en: "Matching", ja: "マッチング", ko: "매칭" } }
];

const ampClasses: Array<{ id: AmpClass; label: string; copy: LocalizedText }> = [
  {
    id: "class-a",
    label: "Class A",
    copy: {
      zh: "Class A：器件几乎一直导通，线性好但效率低", "zh-Hant": traditional("Class A：器件几乎一直导通，线性好但效率低"),
      en: "Class A: devices conduct almost all the time, with good linearity but low efficiency",
      ja: "Class A：デバイスがほぼ常時導通し、直線性は良い一方で効率が低い",
      ko: "Class A: 소자가 거의 항상 도통되어 선형성은 좋지만 효율이 낮습니다"
    }
  },
  {
    id: "class-ab",
    label: "Class AB",
    copy: {
      zh: "Class AB：正负半周分担输出，效率和失真折中", "zh-Hant": traditional("Class AB：正负半周分担输出，效率和失真折中"),
      en: "Class AB: positive and negative halves share output, balancing efficiency and distortion",
      ja: "Class AB：正負の半周期を分担し、効率と歪みのバランスを取る",
      ko: "Class AB: 양의 반주기와 음의 반주기가 출력을 나눠 효율과 왜곡을 절충합니다"
    }
  },
  {
    id: "class-d",
    label: "Class D",
    copy: {
      zh: "Class D：用高速开关和 PWM 表示音频，效率高但要关注滤波和 EMI", "zh-Hant": traditional("Class D：用高速开关和 PWM 表示音频，效率高但要关注滤波和 EMI"),
      en: "Class D: represents audio with fast switching and PWM, efficient but sensitive to filtering and EMI",
      ja: "Class D：高速スイッチングとPWMで音声を表現し、高効率だがフィルターとEMIに注意が必要",
      ko: "Class D: 고속 스위칭과 PWM으로 오디오를 표현해 효율이 높지만 필터와 EMI를 확인해야 합니다"
    }
  }
];

const ampPrinciples = {
  "class-a": {
    zh: {
      principle: "基本原理：输出器件始终处在导通区，完整正负半周都由线性放大路径连续处理。",
      advantage: "优势：正常工作范围内没有推挽交接造成的交越失真；不等于没有其他失真。",
      caution: "注意：静态电流大，效率低，发热明显。",
      usage: "常见：小功率高保真、耳放、前级或偏重音质的线性电路。"
    }, "zh-Hant": traditional({
      principle: "基本原理：输出器件始终处在导通区，完整正负半周都由线性放大路径连续处理。",
      advantage: "优势：正常工作范围内没有推挽交接造成的交越失真；不等于没有其他失真。",
      caution: "注意：静态电流大，效率低，发热明显。",
      usage: "常见：小功率高保真、耳放、前级或偏重音质的线性电路。"
    }),
    en: {
      principle:
        "Principle: the output device stays biased on, so the full positive and negative waveform is handled through a continuous linear path.",
      advantage: "Benefit: no handover crossover distortion within its operating range; other distortion can still occur.",
      caution: "Watch out: high idle current, low efficiency, and obvious heat.",
      usage: "Common in: low-power hi-fi, headphone amps, preamps, and linear circuits focused on sound quality."
    },
    ja: {
      principle: "原理：出力デバイスを常時バイアスして導通させ、正負の波形全体を連続したリニア経路で処理します。",
      advantage: "利点：動作範囲内では受け渡しによるクロスオーバー歪みがありません。ただし他の歪みは起こりえます。",
      caution: "注意：待機電流が大きく、効率が低く、発熱が目立ちます。",
      usage: "用途：低出力ハイファイ、ヘッドホンアンプ、プリアンプ、音質重視のリニア回路。"
    },
    ko: {
      principle: "원리: 출력 소자를 항상 바이어스해 도통시키므로 양과 음의 전체 파형을 연속적인 선형 경로로 처리합니다.",
      advantage: "장점: 동작 범위에서 전환에 따른 크로스오버 왜곡이 없습니다. 다른 왜곡은 여전히 발생할 수 있습니다.",
      caution: "주의: 유휴 전류가 크고 효율이 낮으며 발열이 뚜렷합니다.",
      usage: "용도: 저출력 하이파이, 헤드폰 앰프, 프리앰프, 음질 중심의 선형 회로입니다."
    }
  },
  "class-ab": {
    zh: {
      principle: "基本原理：正半周和负半周主要由上下两组输出器件分担，并保留少量偏置来减轻交越失真。",
      advantage: "优势：比 Class A 效率高，又比纯 B 类更容易控制交越失真。",
      caution: "注意：偏置设置不好会有交越失真，仍有一定发热。",
      usage: "常见：传统音箱功放、车载功放和较多线性功放。"
    }, "zh-Hant": traditional({
      principle: "基本原理：正半周和负半周主要由上下两组输出器件分担，并保留少量偏置来减轻交越失真。",
      advantage: "优势：比 Class A 效率高，又比纯 B 类更容易控制交越失真。",
      caution: "注意：偏置设置不好会有交越失真，仍有一定发热。",
      usage: "常见：传统音箱功放、车载功放和较多线性功放。"
    }),
    en: {
      principle:
        "Principle: positive and negative halves are mainly shared by upper and lower output devices, with a small bias to reduce crossover distortion.",
      advantage: "Benefit: more efficient than Class A and easier to keep clean than pure Class B.",
      caution: "Watch out: poor biasing causes crossover distortion, and it still produces heat.",
      usage: "Common in: traditional speaker amps, car amplifiers, and many linear power amplifiers."
    },
    ja: {
      principle: "原理：正負の半周期を主に上下の出力デバイスが分担し、少量のバイアスでクロスオーバー歪みを抑えます。",
      advantage: "利点：Class Aより効率が高く、純粋なClass Bより歪みを抑えやすい方式です。",
      caution: "注意：バイアス設定が不適切だとクロスオーバー歪みが生じ、発熱も残ります。",
      usage: "用途：従来型スピーカーアンプ、カーアンプ、多くのリニアパワーアンプ。"
    },
    ko: {
      principle: "원리: 양과 음의 반주기를 주로 상하 출력 소자가 나누어 담당하고, 약간의 바이어스로 크로스오버 왜곡을 줄입니다.",
      advantage: "장점: Class A보다 효율이 높고 순수 Class B보다 깨끗하게 유지하기 쉽습니다.",
      caution: "주의: 바이어스가 잘못 설정되면 크로스오버 왜곡이 생기며 발열도 남습니다.",
      usage: "용도: 전통적인 스피커 앰프, 차량용 앰프, 다양한 선형 파워 앰프입니다."
    }
  },
  "class-d": {
    zh: {
      principle: "基本原理：音频信号先变成 PWM 或类似的高速开关脉冲，输出级只在开/关之间切换，再通过滤波和扬声器还原音频电流。",
      advantage: "优势：效率高、发热低，适合电池供电和小体积设备。",
      caution: "注意：外置 LC 是否需要取决于调制方式、负载和布线；仍需检查 EMI、电源和 PCB 布局。",
      usage: "常见：蓝牙音箱、手机、电视、便携设备和高效率大功率功放。"
    }, "zh-Hant": traditional({
      principle: "基本原理：音频信号先变成 PWM 或类似的高速开关脉冲，输出级只在开/关之间切换，再通过滤波和扬声器还原音频电流。",
      advantage: "优势：效率高、发热低，适合电池供电和小体积设备。",
      caution: "注意：外置 LC 是否需要取决于调制方式、负载和布线；仍需检查 EMI、电源和 PCB 布局。",
      usage: "常见：蓝牙音箱、手机、电视、便携设备和高效率大功率功放。"
    }),
    en: {
      principle:
        "Principle: the audio signal is converted into PWM or a similar high-speed switching pulse stream, the output stage switches on/off, then filtering and the speaker recover audio current.",
      advantage: "Benefit: high efficiency and low heat, well suited to battery-powered and compact devices.",
      caution: "Watch out: external LC requirements depend on modulation, load and wiring; EMI, supply and layout still matter.",
      usage: "Common in: Bluetooth speakers, phones, TVs, portable devices, and high-efficiency high-power amps."
    },
    ja: {
      principle: "原理：音声をPWMなどの高速スイッチングパルス列に変換し、出力段をオン／オフ動作させ、フィルターとスピーカーで音声電流を復元します。",
      advantage: "利点：高効率で発熱が少なく、バッテリー機器や小型機器に適します。",
      caution: "注意：外付けLCの要否は変調方式、負荷、配線で変わります。EMI、電源、基板レイアウトも確認が必要です。",
      usage: "用途：Bluetoothスピーカー、スマートフォン、テレビ、ポータブル機器、高効率大出力アンプ。"
    },
    ko: {
      principle: "원리: 오디오 신호를 PWM과 같은 고속 스위칭 펄스열로 바꾸고 출력단을 켜고 끈 뒤 필터와 스피커가 오디오 전류를 복원합니다.",
      advantage: "장점: 효율이 높고 발열이 적어 배터리 구동 및 소형 장치에 적합합니다.",
      caution: "주의: 외부 LC 필요 여부는 변조 방식, 부하, 배선에 따라 달라집니다. EMI, 전원, PCB 레이아웃도 중요합니다.",
      usage: "용도: Bluetooth 스피커, 휴대전화, TV, 휴대 장치, 고효율 고출력 앰프입니다."
    }
  }
} satisfies Record<AmpClass, Record<SupportedLanguage, AmpPrincipleDetail>>;

function renderAmplifierDiagram(language: Language, ampClass: AmpClass) {
  const currentCopy = localized(language, ampClasses.find((item) => item.id === ampClass)?.copy ?? ampClasses[2].copy);
  const ampClassLabel = ampClasses.find((item) => item.id === ampClass)?.label ?? "Class D";
  const stageLabel = {
    "class-a": { zh: "线性放大", "zh-Hant": traditional("线性放大"), en: "Linear gain", ja: "リニアゲイン", ko: "선형 이득" },
    "class-ab": { zh: "AB 推挽", "zh-Hant": traditional("AB 推挽"), en: "AB push-pull", ja: "ABプッシュプル", ko: "AB 푸시풀" },
    "class-d": { zh: "PWM 调制", "zh-Hant": traditional("PWM 调制"), en: "PWM modulation", ja: "PWM変調", ko: "PWM 변조" }
  } satisfies Record<AmpClass, LocalizedText>;
  const outputLabel = {
    "class-a": { zh: "线性连续输出", "zh-Hant": traditional("线性连续输出"), en: "Linear continuous output", ja: "リニア連続出力", ko: "선형 연속 출력" },
    "class-ab": { zh: "正负半周交替输出", "zh-Hant": traditional("正负半周交替输出"), en: "Push-pull sum", ja: "正負半周期の交互出力", ko: "양과 음 반주기 교대 출력" },
    "class-d": { zh: "PWM 开关输出", "zh-Hant": traditional("PWM 开关输出"), en: "PWM switching output", ja: "PWMスイッチング出力", ko: "PWM 스위칭 출력" }
  } satisfies Record<AmpClass, LocalizedText>;
  const sinePath = (x: number, width: number, amplitude: number) => Array.from({ length: 121 }, (_, i) =>
    `${i === 0 ? "M" : "L"} ${(x + width * i / 120).toFixed(2)} ${(190 - amplitude * Math.sin(2 * Math.PI * i / 120)).toFixed(2)}`
  ).join(" ");
  const inputWave = sinePath(62, 162, 28);
  const linearOutput = sinePath(438, 108, 44);
  // Deliberately slow carrier: one sampled duty value per period makes PWM visible.
  const pwmOutput = "M 438 242 " + Array.from({ length: 10 }, (_, i) => {
    const duty = 0.5 + 0.4 * Math.sin(2 * Math.PI * (i + 0.5) / 10);
    return `V 138 H ${(438 + (i + duty) * 10.8).toFixed(2)} V 242 H ${(438 + (i + 1) * 10.8).toFixed(2)}`;
  }).join(" ");

  return (
    <figure className="amp-diagram-figure">
      <svg
        aria-label={localized(language, {
          zh: `${ampClassLabel} 功放图解`, "zh-Hant": traditional(`${ampClassLabel} 功放图解`),
          en: `${ampClassLabel} amplifier diagram`,
          ja: `${ampClassLabel}アンプ図解`,
          ko: `${ampClassLabel} 앰프 다이어그램`
        })}
        role="img"
        viewBox="0 0 760 310"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <marker id="ampFlowArrow" markerHeight="10" markerWidth="10" orient="auto" refX="8" refY="5">
            <path d="M 0 0 L 10 5 L 0 10 Z" fill="#f0b46a" />
          </marker>
        </defs>
        <rect className="lab-diagram-bg" height="310" rx="14" width="760" />
        <text className="lab-label amp-diagram-title" x="48" y="42">
          {localized(language, {
            zh: "从左到右：输入小信号 → 功放工作方式 → 功率输出 → 扬声器负载", "zh-Hant": traditional("从左到右：输入小信号 → 功放工作方式 → 功率输出 → 扬声器负载"),
            en: "Left to right: small input signal -> amplifier method -> power output -> speaker load",
            ja: "左から右へ：小信号入力 → アンプ方式 → 電力出力 → スピーカー負荷",
            ko: "왼쪽에서 오른쪽으로: 작은 입력 신호 → 앰프 방식 → 전력 출력 → 스피커 부하"
          })}
        </text>
        <text className="interface-node-sub amp-flow-note" x="48" y="66">
          {localized(language, {
            zh: "输入与输出各自展示同一周期；电压仅示意，横向间距不是传播时间", "zh-Hant": traditional("输入与输出各自展示同一周期；电压仅示意，横向间距不是传播时间"),
            en: "Input and output each span one period; voltage is illustrative, spacing is not propagation time",
            ja: "入力と出力はそれぞれ1周期を示します。電圧は模式的で、横方向の間隔は伝搬時間ではありません。",
            ko: "입력과 출력은 각각 한 주기를 나타냅니다. 전압은 개념도이며 가로 간격은 전파 시간이 아닙니다."
          })}
        </text>

        <line className="amp-flow-centerline" x1="48" x2="712" y1="190" y2="190" />
        <path className="amp-flow-arrow" d="M 240 190 L 270 190" />
        <path className="amp-flow-arrow" d="M 380 190 L 422 190" />
        <path className="amp-flow-arrow" d="M 560 190 L 598 190" />

        <text className="lab-label" x="144" y="112">
          {localized(language, { zh: "输入小信号", "zh-Hant": traditional("输入小信号"), en: "Small input signal", ja: "小信号入力", ko: "작은 입력 신호" })}
        </text>
        <path className="amp-wave-input" d={inputWave} />
        <text className="interface-node-sub" x="144" y="268">
          {localized(language, { zh: "DAC / Codec 输出，电压小", "zh-Hant": traditional("DAC / Codec 输出，电压小"), en: "DAC / codec out, low voltage", ja: "DAC / Codec出力、低電圧", ko: "DAC / Codec 출력, 낮은 전압" })}
        </text>

        <text className="lab-label" x="314" y="112">
          {localized(language, { zh: "功放工作方式", "zh-Hant": traditional("功放工作方式"), en: "Amplifier method", ja: "アンプ方式", ko: "앰프 방식" })}
        </text>
        <rect className="amp-block" height="86" rx="12" width="104" x="276" y="146" />
        <text className="interface-node-text" x="328" y="180">{ampClassLabel}</text>
        <text className="interface-node-sub" x="328" y="207">{localized(language, stageLabel[ampClass])}</text>
        <text className="interface-node-sub" x="328" y="268">
          {localized(language, { zh: "决定效率、失真和发热", "zh-Hant": traditional("决定效率、失真和发热"), en: "Efficiency / distortion / heat", ja: "効率・歪み・発熱を左右", ko: "효율·왜곡·발열을 결정" })}
        </text>

        <text className="lab-label" x="492" y="112">
          {localized(language, { zh: "功率输出", "zh-Hant": traditional("功率输出"), en: "Power output", ja: "電力出力", ko: "전력 출력" })}
        </text>
        <path className={`interface-clock-line amp-output-wave${ampClass === "class-d" ? " amp-pwm-output" : ""}`} d={ampClass === "class-d" ? pwmOutput : linearOutput} />
        <text className="interface-node-sub" x="492" y="268">{localized(language, outputLabel[ampClass])}</text>

        <text className="lab-label" x="656" y="112">
          {localized(language, { zh: "扬声器负载", "zh-Hant": traditional("扬声器负载"), en: "Speaker load", ja: "スピーカー負荷", ko: "스피커 부하" })}
        </text>
        <rect className="amp-block muted" height="86" rx="12" width="104" x="604" y="146" />
        <path className="amp-cone small" d="M 626 162 L 678 146 L 678 234 L 626 218 Z" />
        <path className="amp-air-wave" d="M 686 170 C 708 184 708 206 686 220" />
        <text className="interface-node-sub" x="656" y="268">
          {localized(language, { zh: "滤波后推动扬声器", "zh-Hant": traditional("滤波后推动扬声器"), en: "Filtered current drives speaker", ja: "フィルター後の電流がスピーカーを駆動", ko: "필터링된 전류가 스피커를 구동" })}
        </text>
      </svg>
      <figcaption>
        {currentCopy}
        <br />
        {ampClass === "class-d"
          ? localized(language, {
              zh: "PWM 占空比随输入变化；为看清脉宽，示例仅画每音频周期 10 个开关周期，并非实际开关频率或滤波仿真。", "zh-Hant": traditional("PWM 占空比随输入变化；为看清脉宽，示例仅画每音频周期 10 个开关周期，并非实际开关频率或滤波仿真。"),
              en: "PWM duty follows the input. Only 10 switching periods per audio cycle are drawn for readability, not a real switching frequency or filter simulation.",
              ja: "PWMのデューティ比は入力に応じて変化します。見やすさのため音声1周期あたり10回のスイッチングだけを描いており、実際のスイッチング周波数やフィルターのシミュレーションではありません。",
              ko: "PWM 듀티는 입력에 따라 변합니다. 보기 쉽게 오디오 주기마다 10회의 스위칭만 그렸으며 실제 스위칭 주파수나 필터 시뮬레이션이 아닙니다."
            })
          : localized(language, {
              zh: "图示为未削波的理想线性输出。A / AB 的差别主要在器件偏置与导通角，AB 不应必然出现零点缺口。", "zh-Hant": traditional("图示为未削波的理想线性输出。A / AB 的差别主要在器件偏置与导通角，AB 不应必然出现零点缺口。"),
              en: "Ideal unclipped linear output. A / AB differ mainly in bias and conduction angle; an AB output need not have a zero-crossing notch.",
              ja: "図はクリップしていない理想的なリニア出力です。A / ABの違いは主にバイアスと導通角にあり、AB出力に必ずゼロクロスの切れ目が生じるわけではありません。",
              ko: "그림은 클리핑되지 않은 이상적인 선형 출력입니다. A와 AB의 차이는 주로 바이어스와 도통각에 있으며 AB 출력에 반드시 영점 통과의 홈이 생기지는 않습니다."
            })}
      </figcaption>
    </figure>
  );
}

function renderSpeakerDiagram(language: Language) {
  return (
    <figure className="amp-diagram-figure">
      <svg
        aria-label={localized(language, { zh: "动圈扬声器结构图", "zh-Hant": traditional("动圈扬声器结构图"), en: "Moving coil speaker diagram", ja: "ダイナミック型スピーカーの構造図", ko: "다이내믹 스피커 구조도" })}
        role="img"
        viewBox="0 0 760 410"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <marker id="speakerFlowArrow" markerHeight="10" markerWidth="10" orient="auto" refX="8" refY="5">
            <path d="M 0 0 L 10 5 L 0 10 Z" fill="#f0b46a" />
          </marker>
        </defs>
        <rect className="lab-diagram-bg" height="410" rx="14" width="760" />
        <text className="lab-label amp-diagram-title" x="48" y="42">
          {localized(language, {
            zh: "从左到右：电流输入 → 音圈受力 → 振膜运动 → 空气声波", "zh-Hant": traditional("从左到右：电流输入 → 音圈受力 → 振膜运动 → 空气声波"),
            en: "Left to right: current input -> coil force -> diaphragm motion -> air pressure wave",
            ja: "左から右へ：電流入力 → ボイスコイルの力 → 振動板の運動 → 空気圧波",
            ko: "왼쪽에서 오른쪽으로: 전류 입력 → 보이스 코일의 힘 → 진동판 운동 → 공기 압력파"
          })}
        </text>
        <text className="interface-node-sub amp-flow-note" x="48" y="66">
          {localized(language, {
            zh: "这张图看的是电能如何变成机械运动和声波", "zh-Hant": traditional("这张图看的是电能如何变成机械运动和声波"),
            en: "This diagram shows how electrical energy becomes mechanical motion and sound",
            ja: "電気エネルギーが機械運動と音波に変わる過程を示します",
            ko: "전기 에너지가 기계적 운동과 음파로 바뀌는 과정을 보여줍니다"
          })}
        </text>

        <line className="amp-flow-centerline" x1="52" x2="708" y1="196" y2="196" />
        <path className="amp-speaker-arrow" d="M 154 196 L 196 196" />
        <path className="amp-speaker-arrow" d="M 328 196 L 374 196" />
        <path className="amp-speaker-arrow" d="M 552 196 L 608 196" />

        <text className="lab-label" x="106" y="118">
          {localized(language, { zh: "电流输入", "zh-Hant": traditional("电流输入"), en: "Current input", ja: "電流入力", ko: "전류 입력" })}
        </text>
        <path className="amp-wave-input" d="M 60 196 C 76 166 92 166 108 196 S 140 226 156 196" />
        <text className="interface-node-sub" x="106" y="272">
          {localized(language, { zh: "来自功放的交流电流", "zh-Hant": traditional("来自功放的交流电流"), en: "AC current from amplifier", ja: "アンプからの交流電流", ko: "앰프에서 나온 교류 전류" })}
        </text>

        <text className="lab-label" x="262" y="118">
          {localized(language, { zh: "音圈受力", "zh-Hant": traditional("音圈受力"), en: "Voice coil force", ja: "ボイスコイルの力", ko: "보이스 코일의 힘" })}
        </text>
        <circle className="amp-magnet" cx="262" cy="196" r="56" />
        <rect className="amp-voice-coil" height="64" rx="10" width="68" x="296" y="164" />
        <text className="interface-node-sub" x="262" y="278">
          {localized(language, { zh: "磁路", "zh-Hant": traditional("磁路"), en: "Magnet", ja: "磁気回路", ko: "자기 회로" })}
        </text>
        <text className="interface-node-sub" x="330" y="252">
          {localized(language, { zh: "音圈", "zh-Hant": traditional("音圈"), en: "Voice coil", ja: "ボイスコイル", ko: "보이스 코일" })}
        </text>
        <text className="interface-node-sub" x="292" y="334">
          {localized(language, { zh: "电流在磁场中产生推/拉力", "zh-Hant": traditional("电流在磁场中产生推/拉力"), en: "Current in the magnetic field creates push/pull force", ja: "磁界中の電流が押す力と引く力を生みます", ko: "자기장 속 전류가 미는 힘과 당기는 힘을 만듭니다" })}
        </text>

        <text className="lab-label" x="466" y="118">
          {localized(language, { zh: "振膜运动", "zh-Hant": traditional("振膜运动"), en: "Diaphragm motion", ja: "振動板の運動", ko: "진동판 운동" })}
        </text>
        <path className="amp-cone" d="M 388 138 L 552 92 L 552 300 L 388 252 Z" />
        <path className="amp-motion-line" d="M 434 144 L 466 144" />
        <path className="amp-motion-line reverse" d="M 434 318 L 466 318" />
        <text className="interface-node-sub" x="466" y="354">
          {localized(language, { zh: "振膜前后运动，压缩/稀疏空气", "zh-Hant": traditional("振膜前后运动，压缩/稀疏空气"), en: "Diaphragm pushes and pulls air", ja: "振動板が前後に動き、空気を圧縮・希薄化します", ko: "진동판이 앞뒤로 움직여 공기를 압축하고 희박하게 만듭니다" })}
        </text>

        <text className="lab-label" x="654" y="118">
          {localized(language, { zh: "空气声波", "zh-Hant": traditional("空气声波"), en: "Air pressure wave", ja: "空気圧波", ko: "공기 압력파" })}
        </text>
        <path className="amp-air-wave" d="M 614 132 C 650 162 650 230 614 260" />
        <path className="amp-air-wave" d="M 650 106 C 706 154 706 238 650 288" />
        <text className="interface-node-sub" x="654" y="354">
          {localized(language, { zh: "空气压力变化被耳朵听到", "zh-Hant": traditional("空气压力变化被耳朵听到"), en: "Pressure wave reaches the ear", ja: "圧力波が耳に届きます", ko: "압력파가 귀에 도달합니다" })}
        </text>
      </svg>
      <figcaption>
        {localized(language, {
          zh: "动圈扬声器的核心是音圈、磁路和振膜：功放输出电流，音圈在磁场中受力，振膜把机械运动变成空气压力变化。", "zh-Hant": traditional("动圈扬声器的核心是音圈、磁路和振膜：功放输出电流，音圈在磁场中受力，振膜把机械运动变成空气压力变化。"),
          en: "A moving-coil speaker is built around the coil, magnet, and diaphragm: amplifier current creates force, and the diaphragm turns that motion into air pressure.",
          ja: "ダイナミック型スピーカーの中心はボイスコイル、磁気回路、振動板です。アンプ電流が力を生み、振動板が機械運動を空気圧の変化に変えます。",
          ko: "다이내믹 스피커의 핵심은 보이스 코일, 자기 회로, 진동판입니다. 앰프 전류가 힘을 만들고 진동판이 기계적 운동을 공기 압력 변화로 바꿉니다."
        })}
      </figcaption>
    </figure>
  );
}

function renderEnclosureDiagram(language: Language) {
  return (
    <figure className="amp-diagram-figure">
      <svg
        aria-label={localized(language, { zh: "箱体与分频图解", "zh-Hant": traditional("箱体与分频图解"), en: "Enclosure and crossover diagram", ja: "エンクロージャーとクロスオーバーの図解", ko: "인클로저와 크로스오버 다이어그램" })}
        role="img"
        viewBox="0 0 760 410"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <marker id="enclosureFlowArrow" markerHeight="10" markerWidth="10" orient="auto" refX="8" refY="5">
            <path d="M 0 0 L 10 5 L 0 10 Z" fill="#f0b46a" />
          </marker>
        </defs>
        <rect className="lab-diagram-bg" height="410" rx="14" width="760" />
        <text className="lab-label amp-diagram-title" x="48" y="42">
          {localized(language, {
            zh: "从左到右：全频信号 → 分频器 → 低音/高音单元 → 箱体声学", "zh-Hant": traditional("从左到右：全频信号 → 分频器 → 低音/高音单元 → 箱体声学"),
            en: "Left to right: full-range signal -> crossover -> woofer/tweeter -> enclosure acoustics",
            ja: "左から右へ：全帯域信号 → クロスオーバー → ウーファー／ツイーター → エンクロージャー音響",
            ko: "왼쪽에서 오른쪽으로: 전대역 신호 → 크로스오버 → 우퍼/트위터 → 인클로저 음향"
          })}
        </text>
        <text className="interface-node-sub amp-flow-note" x="48" y="66">
          {localized(language, {
            zh: "分频器决定谁负责低频、谁负责高频", "zh-Hant": traditional("分频器决定谁负责低频、谁负责高频"),
            en: "The crossover decides which driver handles low or high frequencies",
            ja: "クロスオーバーが低域と高域をどのドライバーに分担させるか決めます",
            ko: "크로스오버가 저역과 고역을 어느 드라이버가 담당할지 결정합니다"
          })}
        </text>

        <text className="lab-label" x="96" y="134">
          {localized(language, { zh: "全频信号", "zh-Hant": traditional("全频信号"), en: "Full-range signal", ja: "全帯域信号", ko: "전대역 신호" })}
        </text>
        <path className="amp-wave-input" d={Array.from({ length: 121 }, (_, index) => {
          const phase = 2 * Math.PI * index / 120;
          return `${index === 0 ? "M" : "L"} ${(54 + 108 * index / 120).toFixed(2)} ${(198 - 16 * Math.sin(phase) - 9 * Math.sin(4 * phase)).toFixed(2)}`;
        }).join(" ")} />
        <text className="interface-node-sub" x="96" y="256">
          {localized(language, { zh: "功放输出含低频和高频", "zh-Hant": traditional("功放输出含低频和高频"), en: "Lows and highs from amplifier", ja: "アンプ出力には低域と高域が含まれます", ko: "앰프 출력에는 저역과 고역이 포함됩니다" })}
        </text>

        <path className="amp-enclosure-arrow" d="M 176 198 L 220 198" />
        <rect className="amp-block" height="92" rx="12" width="128" x="224" y="152" />
        <text className="interface-node-text" x="288" y="188">
          {localized(language, { zh: "分频器", "zh-Hant": traditional("分频器"), en: "Crossover", ja: "クロスオーバー", ko: "크로스오버" })}
        </text>
        <text className="interface-node-sub" x="288" y="216">
          {localized(language, { zh: "低通 / 高通", "zh-Hant": traditional("低通 / 高通"), en: "Low-pass / high-pass", ja: "ローパス / ハイパス", ko: "로우패스 / 하이패스" })}
        </text>
        <text className="interface-node-sub" x="288" y="276">
          {localized(language, { zh: "分频点常见 2-3 kHz", "zh-Hant": traditional("分频点常见 2-3 kHz"), en: "Typical crossover point: 2-3 kHz", ja: "一般的なクロスオーバー周波数：2-3 kHz", ko: "일반적인 크로스오버 지점: 2-3 kHz" })}
        </text>

        <text className="lab-label" x="432" y="104">
          {localized(language, { zh: "高频通路", "zh-Hant": traditional("高频通路"), en: "High-frequency path", ja: "高域経路", ko: "고주파 경로" })}
        </text>
        <text className="lab-label" x="432" y="316">
          {localized(language, { zh: "低频通路", "zh-Hant": traditional("低频通路"), en: "Low-frequency path", ja: "低域経路", ko: "저주파 경로" })}
        </text>

        <rect className="amp-speaker-box" height="230" rx="16" width="190" x="474" y="90" />
        <path className="amp-enclosure-arrow" d="M 352 178 C 390 136 416 136 540 136" />
        <path className="amp-enclosure-arrow" d="M 352 218 C 394 260 420 248 516 248" />
        <circle className="amp-driver-high" cx="568" cy="136" r="28" />
        <circle className="amp-driver-low" cx="568" cy="248" r="52" />
        <text className="interface-node-sub" x="568" y="184">
          {localized(language, { zh: "高音单元", "zh-Hant": traditional("高音单元"), en: "Tweeter", ja: "ツイーター", ko: "트위터" })}
        </text>
        <text className="interface-node-sub" x="568" y="322">
          {localized(language, { zh: "低音单元", "zh-Hant": traditional("低音单元"), en: "Woofer", ja: "ウーファー", ko: "우퍼" })}
        </text>

        <path className="amp-port" d="M 622 260 H 654" />
        <text className="lab-chip" x="596" y="342">
          {localized(language, { zh: "箱体低频响应", "zh-Hant": traditional("箱体低频响应"), en: "Enclosure bass response", ja: "エンクロージャーの低域応答", ko: "인클로저 저역 응답" })}
        </text>
        <path className="amp-air-wave" d="M 682 224 C 710 244 710 282 682 304" />
        <text className="interface-node-sub" x="596" y="366">
          {localized(language, { zh: "密闭 / 倒相会影响低频", "zh-Hant": traditional("密闭 / 倒相会影响低频"), en: "Sealed/ported designs affect bass", ja: "密閉型／バスレフ型は低域に影響します", ko: "밀폐형/베이스 리플렉스 설계는 저역에 영향을 줍니다" })}
        </text>
        <text className="interface-node-sub" x="596" y="388">
          {localized(language, { zh: "腔体容积会改变共振", "zh-Hant": traditional("腔体容积会改变共振"), en: "Cabinet volume changes resonance", ja: "キャビネット容積が共振を変えます", ko: "캐비닛 용적이 공진을 바꿉니다" })}
        </text>
      </svg>
      <figcaption>
        {localized(language, {
          zh: "分频器把全频信号拆给不同单元，箱体负责控制低频效率、下潜、共振和漏气问题。", "zh-Hant": traditional("分频器把全频信号拆给不同单元，箱体负责控制低频效率、下潜、共振和漏气问题。"),
          en: "The crossover splits the full-range signal across drivers, while the enclosure controls bass efficiency, extension, resonance, and leakage.",
          ja: "クロスオーバーが全帯域信号を各ドライバーに分け、エンクロージャーが低域効率、伸び、共振、漏れを制御します。",
          ko: "크로스오버가 전대역 신호를 드라이버별로 나누고 인클로저가 저역 효율, 확장성, 공진, 누설을 제어합니다."
        })}
      </figcaption>
    </figure>
  );
}

function renderTsDiagram(language: Language) {
  return (
    <figure className="amp-diagram-figure">
      <svg
        aria-label={localized(language, { zh: "Thiele-Small 参数与箱体关系图", "zh-Hant": traditional("Thiele-Small 参数与箱体关系图"), en: "Thiele-Small parameter enclosure diagram", ja: "Thiele-Smallパラメータとエンクロージャーの関係図", ko: "Thiele-Small 파라미터와 인클로저 관계 다이어그램" })}
        role="img"
        viewBox="0 0 760 430"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <marker id="ampMatchArrow" markerHeight="10" markerWidth="10" orient="auto" refX="8" refY="5">
            <path d="M 0 0 L 10 5 L 0 10 Z" fill="#f0b46a" />
          </marker>
        </defs>
        <rect className="lab-diagram-bg" height="430" rx="14" width="760" />
        <text className="lab-label amp-diagram-title" x="48" y="42">
          {localized(language, { zh: "T/S 参数不是音色玄学，而是低频箱体设计的输入条件", "zh-Hant": traditional("T/S 参数不是音色玄学，而是低频箱体设计的输入条件"), en: "T/S parameters are input data for low-frequency box design", ja: "T/Sパラメータは音色の神秘ではなく、低域エンクロージャー設計の入力条件です", ko: "T/S 파라미터는 음색의 신비가 아니라 저역 인클로저 설계의 입력 조건입니다" })}
        </text>
        <text className="interface-node-sub amp-flow-note" x="48" y="66">
          {localized(language, { zh: "Fs、Qts、Vas 会影响箱体容积、低频下潜、瞬态和倒相调谐", "zh-Hant": traditional("Fs、Qts、Vas 会影响箱体容积、低频下潜、瞬态和倒相调谐"), en: "Fs, Qts, and Vas affect box volume, extension, transient behavior, and port tuning", ja: "Fs、Qts、Vasはエンクロージャー容積、低域の伸び、過渡応答、バスレフチューニングに影響します", ko: "Fs, Qts, Vas는 인클로저 용적, 저역 확장, 과도 응답, 포트 튜닝에 영향을 줍니다" })}
        </text>

        {[
          { key: "Fs", y: 116, body: localized(language, { zh: "自由空气谐振频率", "zh-Hant": traditional("自由空气谐振频率"), en: "free-air resonance", ja: "自由空気共振周波数", ko: "자유 공진 주파수" }) },
          { key: "Qts", y: 202, body: localized(language, { zh: "总 Q 值，反映阻尼", "zh-Hant": traditional("总 Q 值，反映阻尼"), en: "total Q, damping", ja: "総合Q値、減衰を表す", ko: "총 Q 값, 감쇠를 나타냄" }) },
          { key: "Vas", y: 288, body: localized(language, { zh: "等效空气顺性体积", "zh-Hant": traditional("等效空气顺性体积"), en: "equivalent compliance volume", ja: "等価空気コンプライアンス容積", ko: "등가 공기 컴플라이언스 용적" }) }
        ].map((item) => (
          <g key={item.key}>
            <rect className="amp-match-card" height="64" rx="12" width="150" x="56" y={item.y - 32} />
            <text className="interface-node-text" x="131" y={item.y - 4}>{item.key}</text>
            <text className="interface-node-sub" x="131" y={item.y + 22}>{item.body}</text>
            <path className="amp-matching-arrow" d={`M 210 ${item.y} C 252 ${item.y} 272 204 314 204`} />
          </g>
        ))}

        <rect className="amp-block" height="128" rx="16" width="174" x="318" y="140" />
        <text className="interface-node-text" x="405" y="182">{localized(language, { zh: "箱体计算", "zh-Hant": traditional("箱体计算"), en: "Box model", ja: "エンクロージャーモデル", ko: "인클로저 모델" })}</text>
        <text className="interface-node-sub" x="405" y="208">{localized(language, { zh: "容积 / 调谐 / 阻尼", "zh-Hant": traditional("容积 / 调谐 / 阻尼"), en: "volume / tuning / damping", ja: "容積 / チューニング / 減衰", ko: "용적 / 튜닝 / 감쇠" })}</text>
        <text className="interface-node-sub" x="405" y="232">{localized(language, { zh: "不是只看单元口径", "zh-Hant": traditional("不是只看单元口径"), en: "not just driver size", ja: "ドライバー口径だけでは決まりません", ko: "드라이버 크기만으로 결정되지 않음" })}</text>

        <path className="amp-matching-arrow" d="M 496 172 C 536 142 558 126 604 126" />
        <path className="amp-matching-arrow" d="M 496 236 C 536 268 558 292 604 292" />

        <rect className="amp-speaker-box" height="118" rx="14" width="122" x="606" y="70" />
        <circle className="amp-driver-low" cx="666" cy="130" r="32" />
        <text className="lab-label" x="666" y="214">{localized(language, { zh: "密闭箱", "zh-Hant": traditional("密闭箱"), en: "Sealed box", ja: "密閉箱", ko: "밀폐형" })}</text>
        <text className="interface-node-sub" x="666" y="238">{localized(language, { zh: "空气弹簧控制振膜", "zh-Hant": traditional("空气弹簧控制振膜"), en: "air spring controls cone", ja: "空気ばねが振動板を制御", ko: "공기 스프링이 진동판을 제어" })}</text>

        <rect className="amp-speaker-box" height="118" rx="14" width="122" x="606" y="248" />
        <circle className="amp-driver-low" cx="654" cy="306" r="30" />
        <path className="amp-port" d="M 690 330 H 724" />
        <text className="lab-label" x="666" y="392">{localized(language, { zh: "倒相箱", "zh-Hant": traditional("倒相箱"), en: "Bass reflex", ja: "バスレフ箱", ko: "베이스 리플렉스" })}</text>
        <text className="interface-node-sub" x="666" y="414">{localized(language, { zh: "导管共振增强低频", "zh-Hant": traditional("导管共振增强低频"), en: "port resonance boosts bass", ja: "ポート共振が低域を強調", ko: "포트 공진이 저역을 강화" })}</text>
      </svg>
      <figcaption>
        {localized(language, {
          zh: "常见经验是：Qts 较低的单元更常用于倒相箱，Qts 较高的单元更容易做密闭箱；但最终还要看目标体积、低频下潜、最大声压和保护策略。", "zh-Hant": traditional("常见经验是：Qts 较低的单元更常用于倒相箱，Qts 较高的单元更容易做密闭箱；但最终还要看目标体积、低频下潜、最大声压和保护策略。"),
          en: "A common rule of thumb is that lower-Qts drivers often suit bass-reflex boxes, while higher-Qts drivers are easier in sealed boxes; final choices still depend on target volume, extension, maximum SPL, and protection.",
          ja: "一般にQtsが低いドライバーはバスレフ箱、高いドライバーは密閉箱に向きやすいと言われますが、最終的には目標容積、低域の伸び、最大SPL、保護方針も左右します。",
          ko: "일반적으로 Qts가 낮은 드라이버는 베이스 리플렉스에, 높은 드라이버는 밀폐형에 적합하지만 최종 선택은 목표 용적, 저역 확장, 최대 SPL, 보호 전략에 따라 달라집니다."
        })}
      </figcaption>
    </figure>
  );
}

function renderCrossoverOrderDiagram(language: Language) {
  const rows = [
    { order: 1, label: localized(language, { zh: "一阶", "zh-Hant": traditional("一阶"), en: "1st order", ja: "1次", ko: "1차" }), slope: "6 dB/oct", phase: localized(language, { zh: "渐近带外衰减", "zh-Hant": traditional("渐近带外衰减"), en: "asymptotic roll-off", ja: "漸近的な帯域外減衰", ko: "점근적 대역 외 감쇠" }) },
    { order: 2, label: localized(language, { zh: "二阶", "zh-Hant": traditional("二阶"), en: "2nd order", ja: "2次", ko: "2차" }), slope: "12 dB/oct", phase: localized(language, { zh: "渐近带外衰减", "zh-Hant": traditional("渐近带外衰减"), en: "asymptotic roll-off", ja: "漸近的な帯域外減衰", ko: "점근적 대역 외 감쇠" }) },
    { order: 4, label: localized(language, { zh: "四阶", "zh-Hant": traditional("四阶"), en: "4th order", ja: "4次", ko: "4차" }), slope: "24 dB/oct", phase: localized(language, { zh: "渐近带外衰减", "zh-Hant": traditional("渐近带外衰减"), en: "asymptotic roll-off", ja: "漸近的な帯域外減衰", ko: "점근적 대역 외 감쇠" }) }
  ];

  return (
    <figure className="amp-diagram-figure">
      <svg
        aria-label={localized(language, { zh: "分频阶数与相位对齐图", "zh-Hant": traditional("分频阶数与相位对齐图"), en: "Crossover order and phase alignment diagram", ja: "クロスオーバー次数と位相整合の図", ko: "크로스오버 차수와 위상 정렬 다이어그램" })}
        role="img"
        viewBox="0 0 760 430"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect className="lab-diagram-bg" height="430" rx="14" width="760" />
        <text className="lab-label amp-diagram-title" x="48" y="42">
          {localized(language, { zh: "分频阶数决定斜率，分频点附近还要看相位叠加", "zh-Hant": traditional("分频阶数决定斜率，分频点附近还要看相位叠加"), en: "Crossover order sets slope; phase summing near crossover also matters", ja: "クロスオーバー次数が傾きを決め、分岐点付近では位相の加算も重要です", ko: "크로스오버 차수가 기울기를 정하지만 크로스오버 부근에서는 위상 합산도 중요합니다" })}
        </text>
        <line className="spatial-response-axis" x1="84" x2="430" y1="352" y2="352" />
        <line className="spatial-response-axis" x1="84" x2="84" y1="92" y2="352" />
        <text className="interface-node-sub" x="250" y="402">{localized(language, { zh: "频率 / fc（对数轴）", "zh-Hant": traditional("频率 / fc（对数轴）"), en: "Frequency / fc (log axis)", ja: "周波数 / fc（対数軸）", ko: "주파수 / fc(로그 축)" })}</text>
        <text className="interface-node-sub" x="54" y="80">dB</text>
        {[0, -24, -48, -72].map(db => <g key={db}>
          <line className="spatial-response-axis" x1="84" x2="430" y1={100 - db * 3.5} y2={100 - db * 3.5} />
          <text className="interface-node-sub" x="60" y={104 - db * 3.5}>{db}</text>
        </g>)}
        {[0.125, 0.5, 1, 2, 8].map(ratio => <text className="interface-node-sub" key={ratio} x={84 + (Math.log2(ratio) + 3) / 6 * 346} y="374">{ratio}</text>)}
        <line className="spatial-response-axis" x1="257" x2="257" y1="92" y2="352" />
        <text className="interface-node-sub" x="300" y="86">fc: −3.01 dB</text>
        {rows.map((row, index) => (
          <g key={row.label}>
            <path className={`amp-crossover-slope order-${index + 1}`} d={Array.from({ length: 121 }, (_, i) => {
              const ratio = 2 ** (-3 + i / 20);
              const db = -10 * Math.log10(1 + ratio ** (2 * row.order));
              return `${i === 0 ? "M" : "L"} ${(84 + i / 120 * 346).toFixed(2)} ${(100 - Math.max(-72, db) * 3.5).toFixed(2)}`;
            }).join(" ")} />
            <text className="lab-label" x="468" y={126 + index * 80}>{row.label}</text>
            <text className="interface-node-sub" x="548" y={126 + index * 80}>{row.slope}</text>
            <text className="interface-node-sub" x="468" y={150 + index * 80}>{row.phase}</text>
          </g>
        ))}
        <rect className="amp-block muted" height="88" rx="14" width="210" x="500" y="326" />
        <text className="interface-node-text" x="605" y="348">{localized(language, { zh: "相位对齐", "zh-Hant": traditional("相位对齐"), en: "Phase alignment", ja: "位相整合", ko: "위상 정렬" })}</text>
        <text className="interface-node-sub" x="605" y="372">{localized(language, { zh: "低音 + 高音在分频点相加", "zh-Hant": traditional("低音 + 高音在分频点相加"), en: "woofer + tweeter sum at crossover", ja: "クロスオーバーでウーファーとツイーターを加算", ko: "크로스오버에서 우퍼와 트위터를 합산" })}</text>
        <text className="interface-node-sub" x="605" y="396">{localized(language, { zh: "不对齐会凹陷、隆起或声像漂移", "zh-Hant": traditional("不对齐会凹陷、隆起或声像漂移"), en: "misalignment causes dips, peaks, or image shift", ja: "整合しないとディップ、ピーク、音像の移動が生じます", ko: "정렬되지 않으면 딥, 피크 또는 음상 이동이 생깁니다" })}</text>
      </svg>
      <figcaption>
        {localized(language, {
          zh: "分频不是简单切一刀。这里比较同一 fc、同一增益基准的 Butterworth 低通：电平 = −10 log10[1 + (f/fc)^(2n)]。这不是完整分频器的声学总响应；不能仅凭阶数判断是否反相，还要考虑滤波器类型、单元声学中心和摆位。", "zh-Hant": traditional("分频不是简单切一刀。这里比较同一 fc、同一增益基准的 Butterworth 低通：电平 = −10 log10[1 + (f/fc)^(2n)]。这不是完整分频器的声学总响应；不能仅凭阶数判断是否反相，还要考虑滤波器类型、单元声学中心和摆位。"),
          en: "A crossover is not just a cut. These Butterworth low-passes share fc and gain: level = −10 log10[1 + (f/fc)^(2n)]. This is not the summed acoustic response. Order alone does not decide polarity; filter type, acoustic centers and placement also matter.",
          ja: "クロスオーバーは単純な切断ではありません。ここではfcとゲイン基準をそろえたButterworthローパスを比較します：レベル = −10 log10[1 + (f/fc)^(2n)]。完全な分岐器の音響総応答ではなく、次数だけで極性は決まりません。フィルター形式、ドライバーの音響中心、配置も考慮します。",
          ko: "크로스오버는 단순히 한 번 자르는 것이 아닙니다. 여기서는 fc와 게인 기준이 같은 Butterworth 로우패스를 비교합니다: 레벨 = −10 log10[1 + (f/fc)^(2n)]. 완전한 크로스오버의 음향 합성 응답이 아니며 차수만으로 극성이 결정되지는 않습니다. 필터 유형, 드라이버 음향 중심, 배치도 고려해야 합니다."
        })}
      </figcaption>
    </figure>
  );
}

function renderActivePassiveDiagram(language: Language) {
  return (
    <figure className="amp-diagram-figure">
      <svg
        aria-label={localized(language, { zh: "主动分频与被动分频对比图", "zh-Hant": traditional("主动分频与被动分频对比图"), en: "Active and passive crossover comparison diagram", ja: "アクティブ／パッシブクロスオーバー比較図", ko: "액티브 및 패시브 크로스오버 비교 다이어그램" })}
        role="img"
        viewBox="0 0 760 430"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <marker id="enclosureFlowArrow" markerHeight="10" markerWidth="10" orient="auto" refX="8" refY="5">
            <path d="M 0 0 L 10 5 L 0 10 Z" fill="#f0b46a" />
          </marker>
        </defs>
        <rect className="lab-diagram-bg" height="430" rx="14" width="760" />
        <text className="lab-label amp-diagram-title" x="48" y="42">{localized(language, { zh: "主动分频：先分频，再分别功放", "zh-Hant": traditional("主动分频：先分频，再分别功放"), en: "Active crossover: split first, then amplify each band", ja: "アクティブクロスオーバー：先に分けてから帯域ごとに増幅", ko: "액티브 크로스오버: 먼저 나눈 뒤 각 대역을 증폭" })}</text>
        <rect className="amp-block" height="58" rx="10" width="112" x="54" y="84" />
        <text className="interface-node-text" x="110" y="120">DSP / DAC</text>
        <path className="amp-enclosure-arrow" d="M 170 112 H 196 V 92 H 220" />
        <path className="amp-enclosure-arrow" d="M 196 112 V 176 H 220" />
        <rect className="amp-block" height="58" rx="10" width="112" x="224" y="62" />
        <text className="interface-node-text" x="280" y="98">{localized(language, { zh: "低频功放", "zh-Hant": traditional("低频功放"), en: "LF amp", ja: "低域アンプ", ko: "저역 앰프" })}</text>
        <rect className="amp-block" height="58" rx="10" width="112" x="224" y="146" />
        <text className="interface-node-text" x="280" y="182">{localized(language, { zh: "高频功放", "zh-Hant": traditional("高频功放"), en: "HF amp", ja: "高域アンプ", ko: "고역 앰프" })}</text>
        <path className="amp-enclosure-arrow" d="M 336 92 H 424" />
        <path className="amp-enclosure-arrow" d="M 336 176 H 432" />
        <circle className="amp-driver-low" cx="452" cy="92" r="28" />
        <circle className="amp-driver-high" cx="452" cy="176" r="20" />
        <text className="interface-node-sub" x="596" y="92">{localized(language, { zh: "优点：延迟/EQ/限幅/保护精确", "zh-Hant": traditional("优点：延迟/EQ/限幅/保护精确"), en: "Pros: precise delay/EQ/limiting/protection", ja: "利点：ディレイ／EQ／リミッター／保護を精密に設定", ko: "장점: 딜레이/EQ/리미팅/보호를 정밀하게 설정" })}</text>
        <text className="interface-node-sub" x="596" y="122">{localized(language, { zh: "代价：需要多路 DAC/功放", "zh-Hant": traditional("代价：需要多路 DAC/功放"), en: "Cost: needs more DAC/amp channels", ja: "代償：複数のDAC／アンプチャンネルが必要", ko: "대가: 여러 DAC/앰프 채널 필요" })}</text>

        <line className="amp-match-divider" x1="48" x2="712" y1="228" y2="228" />
        <text className="lab-label amp-diagram-title" x="48" y="270">{localized(language, { zh: "被动分频：先功放，再用 L/C/R 分给单元", "zh-Hant": traditional("被动分频：先功放，再用 L/C/R 分给单元"), en: "Passive crossover: amplify first, then split with L/C/R", ja: "パッシブクロスオーバー：先に増幅し、L/C/Rで各ユニットへ分配", ko: "패시브 크로스오버: 먼저 증폭한 뒤 L/C/R로 드라이버에 분배" })}</text>
        <rect className="amp-block" height="58" rx="10" width="112" x="54" y="306" />
        <text className="interface-node-text" x="110" y="342">{localized(language, { zh: "功放", "zh-Hant": traditional("功放"), en: "Amp", ja: "アンプ", ko: "앰프" })}</text>
        <path className="amp-enclosure-arrow" d="M 170 334 H 220" />
        <rect className="amp-block muted" height="82" rx="10" width="126" x="224" y="294" />
        <text className="interface-node-text" x="287" y="324">L / C / R</text>
        <text className="interface-node-sub" x="287" y="350">{localized(language, { zh: "被动分频网络", "zh-Hant": traditional("被动分频网络"), en: "passive network", ja: "パッシブネットワーク", ko: "패시브 네트워크" })}</text>
        <path className="amp-enclosure-arrow" d="M 350 314 H 424" />
        <path className="amp-enclosure-arrow" d="M 350 356 H 392 V 370 H 432" />
        <circle className="amp-driver-low" cx="452" cy="314" r="28" />
        <circle className="amp-driver-high" cx="452" cy="370" r="20" />
        <text className="interface-node-sub" x="596" y="314">{localized(language, { zh: "优点：结构简单，一路功放即可", "zh-Hant": traditional("优点：结构简单，一路功放即可"), en: "Pros: simple, one amp channel can work", ja: "利点：構造が簡単で、1チャンネルのアンプで動作", ko: "장점: 구조가 단순하고 앰프 한 채널로 동작" })}</text>
        <text className="interface-node-sub" x="596" y="344">{localized(language, { zh: "代价：受阻抗曲线影响，元件会损耗", "zh-Hant": traditional("代价：受阻抗曲线影响，元件会损耗"), en: "Cost: load-dependent, components dissipate power", ja: "代償：インピーダンス特性に左右され、部品で電力を消費", ko: "대가: 임피던스 곡선에 좌우되고 부품에서 전력이 소모" })}</text>
      </svg>
      <figcaption>
        {localized(language, {
          zh: "主动分频更像系统设计，适合 DSP 音箱、车载和有源监听；被动分频更像模拟网络设计，常见于传统无源音箱。", "zh-Hant": traditional("主动分频更像系统设计，适合 DSP 音箱、车载和有源监听；被动分频更像模拟网络设计，常见于传统无源音箱。"),
          en: "Active crossover is closer to system design and fits DSP speakers, cars, and active monitors; passive crossover is an analog network design common in traditional passive speakers.",
          ja: "アクティブクロスオーバーはシステム設計に近く、DSPスピーカー、車載、アクティブモニターに適します。パッシブ方式は従来型パッシブスピーカーに多いアナログネットワーク設計です。",
          ko: "액티브 크로스오버는 시스템 설계에 가까워 DSP 스피커, 차량, 액티브 모니터에 적합합니다. 패시브 방식은 전통적인 패시브 스피커에서 흔한 아날로그 네트워크 설계입니다."
        })}
      </figcaption>
    </figure>
  );
}

function renderLineArrayDiagram(language: Language) {
  const drivers = [92, 132, 172, 212, 252, 292, 332];

  return (
    <figure className="amp-diagram-figure">
      <svg
        aria-label={localized(language, { zh: "线阵列扬声器覆盖控制图", "zh-Hant": traditional("线阵列扬声器覆盖控制图"), en: "Line array coverage control diagram", ja: "ラインアレイのカバレッジ制御図", ko: "라인 어레이 커버리지 제어 다이어그램" })}
        role="img"
        viewBox="0 0 760 430"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect className="lab-diagram-bg" height="430" rx="14" width="760" />
        <text className="lab-label amp-diagram-title" x="48" y="42">
          {localized(language, { zh: "线阵列通过多个单元的叠加控制垂直覆盖", "zh-Hant": traditional("线阵列通过多个单元的叠加控制垂直覆盖"), en: "A line array controls vertical coverage by combining many drivers", ja: "ラインアレイは複数ドライバーの重ね合わせで垂直カバレッジを制御します", ko: "라인 어레이는 여러 드라이버를 합산해 수직 커버리지를 제어합니다" })}
        </text>
        <rect className="amp-block muted" height="300" rx="16" width="96" x="86" y="72" />
        {drivers.map((y, index) => (
          <g key={y}>
            <circle className="amp-driver-high" cx="134" cy={y} r="14" />
            <text className="interface-node-sub" x="134" y={y + 4}>{index + 1}</text>
          </g>
        ))}
        <path className="amp-linearray-main" d="M 184 212 C 290 126 462 100 684 130" />
        <path className="amp-linearray-main lower" d="M 184 212 C 290 298 462 324 684 294" />
        <path className="amp-linearray-side" d="M 184 212 C 294 176 438 182 622 210" />
        <path className="amp-linearray-side" d="M 184 212 C 294 248 438 242 622 214" />
        <text className="lab-chip" x="388" y="96">{localized(language, { zh: "目标覆盖区", "zh-Hant": traditional("目标覆盖区"), en: "target coverage", ja: "目標カバレッジ", ko: "목표 커버리지" })}</text>
        <text className="lab-chip" x="392" y="340">{localized(language, { zh: "减少垂直扩散", "zh-Hant": traditional("减少垂直扩散"), en: "reduced vertical spill", ja: "垂直方向の拡散を低減", ko: "수직 확산 감소" })}</text>
        <rect className="amp-block" height="94" rx="14" width="210" x="476" y="154" />
        <text className="interface-node-text" x="581" y="186">{localized(language, { zh: "延迟 / 电平 / 角度", "zh-Hant": traditional("延迟 / 电平 / 角度"), en: "Delay / level / splay", ja: "ディレイ / レベル / スプレイ角", ko: "딜레이 / 레벨 / 스플레이 각도" })}</text>
        <text className="interface-node-sub" x="581" y="214">{localized(language, { zh: "让远近听众声压更均匀", "zh-Hant": traditional("让远近听众声压更均匀"), en: "more even SPL for near/far listeners", ja: "近距離と遠距離の聴衆に均一なSPLを届けます", ko: "가까운 청중과 먼 청중의 SPL을 더 균일하게 만듭니다" })}</text>
        <text className="interface-node-sub" x="581" y="238">{localized(language, { zh: "阵列越长，低频指向控制越强", "zh-Hant": traditional("阵列越长，低频指向控制越强"), en: "longer arrays control lower frequencies better", ja: "アレイが長いほど低域の指向性制御が強くなります", ko: "어레이가 길수록 저역 지향성 제어가 강해집니다" })}</text>
        <text className="interface-node-sub amp-diagram-long-note" x="48" y="402">
          {localized(language, {
            zh: "注意：线阵列不是简单堆喇叭，单元间距过大会产生梳状滤波和旁瓣。", "zh-Hant": traditional("注意：线阵列不是简单堆喇叭，单元间距过大会产生梳状滤波和旁瓣。"),
            en: "Note: a line array is not just stacked speakers; excessive spacing causes comb filtering and side lobes.",
            ja: "注意：ラインアレイはスピーカーを単に積むものではありません。間隔が大きすぎるとコームフィルターとサイドローブが生じます。",
            ko: "주의: 라인 어레이는 스피커를 단순히 쌓은 것이 아닙니다. 간격이 너무 크면 콤 필터와 사이드 로브가 생깁니다."
          })}
        </text>
      </svg>
      <figcaption>
        {localized(language, {
          zh: "线阵列常用于大型扩声。它通过多个单元在空间中的相干叠加控制覆盖范围，设计重点是阵列长度、单元间距、吊挂角度、延迟和电平 shading。", "zh-Hant": traditional("线阵列常用于大型扩声。它通过多个单元在空间中的相干叠加控制覆盖范围，设计重点是阵列长度、单元间距、吊挂角度、延迟和电平 shading。"),
          en: "Line arrays are common in large sound reinforcement. They use coherent spatial summing to control coverage; key design points are array length, driver spacing, splay angle, delay, and level shading.",
          ja: "ラインアレイは大規模な拡声でよく使われます。複数ユニットの空間的なコヒーレント加算でカバレッジを制御し、設計ではアレイ長、ドライバー間隔、スプレイ角、ディレイ、レベルシェーディングが重要です。",
          ko: "라인 어레이는 대형 음향 시스템에서 흔히 사용됩니다. 여러 유닛의 공간적 코히어런트 합산으로 커버리지를 제어하며 어레이 길이, 드라이버 간격, 스플레이 각도, 딜레이, 레벨 셰이딩이 핵심입니다."
        })}
      </figcaption>
    </figure>
  );
}

function renderMatchingDiagram(language: Language) {
  const nodes = [
    {
      label: localized(language, { zh: "功率", "zh-Hant": traditional("功率"), en: "Power", ja: "電力", ko: "전력" }),
      sub: localized(language, { zh: "能提供多少电压/电流余量", "zh-Hant": traditional("能提供多少电压/电流余量"), en: "Voltage/current headroom", ja: "どれだけの電圧／電流余裕を供給できるか", ko: "얼마나 많은 전압/전류 여유를 제공하는가" }),
      x: 164,
      y: 118
    },
    {
      label: localized(language, { zh: "阻抗", "zh-Hant": traditional("阻抗"), en: "Impedance", ja: "インピーダンス", ko: "임피던스" }),
      sub: localized(language, { zh: "负载越低，电流压力越大", "zh-Hant": traditional("负载越低，电流压力越大"), en: "Lower load means higher current stress", ja: "負荷が低いほど電流の負担が大きくなります", ko: "부하가 낮을수록 전류 부담이 커집니다" }),
      x: 164,
      y: 212
    },
    {
      label: localized(language, { zh: "灵敏度", "zh-Hant": traditional("灵敏度"), en: "Sensitivity", ja: "感度", ko: "감도" }),
      sub: localized(language, { zh: "同样功率能换来多少声压", "zh-Hant": traditional("同样功率能换来多少声压"), en: "SPL produced per watt", ja: "同じ電力でどれだけの音圧になるか", ko: "같은 전력으로 얼마나 큰 음압을 얻는가" }),
      x: 164,
      y: 306
    }
  ];

  return (
    <figure className="amp-diagram-figure">
      <svg
        aria-label={localized(language, { zh: "功放扬声器匹配图", "zh-Hant": traditional("功放扬声器匹配图"), en: "Amplifier speaker matching diagram", ja: "アンプとスピーカーのマッチング図", ko: "앰프와 스피커 매칭 다이어그램" })}
        role="img"
        viewBox="0 0 760 410"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <marker id="ampMatchArrow" markerHeight="10" markerWidth="10" orient="auto" refX="8" refY="5">
            <path d="M 0 0 L 10 5 L 0 10 Z" fill="#f0b46a" />
          </marker>
        </defs>
        <rect className="lab-diagram-bg" height="410" rx="14" width="760" />
        <text className="lab-label amp-diagram-title" x="48" y="42">
          {localized(language, {
            zh: "不是信号流，而是三个参数共同决定结果", "zh-Hant": traditional("不是信号流，而是三个参数共同决定结果"),
            en: "This is not a signal flow: three parameters jointly decide the result",
            ja: "信号フローではなく、3つのパラメータが結果を共同で決めます",
            ko: "신호 흐름이 아니라 세 가지 파라미터가 결과를 함께 결정합니다"
          })}
        </text>
        <text className="interface-node-sub amp-flow-note" x="48" y="66">
          {localized(language, {
            zh: "匹配关系看的是响度、失真、发热和保护余量", "zh-Hant": traditional("匹配关系看的是响度、失真、发热和保护余量"),
            en: "Matching is about loudness, distortion, heat, and protection margin",
            ja: "マッチングでは音量、歪み、発熱、保護の余裕を見ます",
            ko: "매칭에서는 음량, 왜곡, 발열, 보호 여유를 확인합니다"
          })}
        </text>
        {nodes.map((node) => (
          <g key={node.label}>
            <rect className="amp-match-card" height="82" rx="12" width="172" x={node.x - 86} y={node.y - 41} />
            <text className="interface-node-text" x={node.x} y={node.y + 6}>
              {node.label}
            </text>
            <foreignObject x={node.x - 78} y={node.y + 12} width="156" height="28">
              <p className="amp-match-description">{node.sub}</p>
            </foreignObject>
          </g>
        ))}

        <path className="amp-matching-arrow" d="M 250 118 C 330 118 402 154 484 176" />
        <path className="amp-matching-arrow" d="M 250 212 H 484" />
        <path className="amp-matching-arrow" d="M 250 306 C 330 306 404 250 484 226" />

        <rect className="amp-block" height="142" rx="16" width="204" x="494" y="132" />
        <text className="interface-node-text" x="595" y="178">
          {localized(language, { zh: "实际声压", "zh-Hant": traditional("实际声压"), en: "Actual SPL", ja: "実際のSPL", ko: "실제 SPL" })}
        </text>
        <text className="interface-node-sub" x="595" y="204">
          {localized(language, { zh: "测量位置的声压级", "zh-Hant": traditional("测量位置的声压级"), en: "SPL at the measurement point", ja: "測定位置の音圧レベル", ko: "측정 위치의 음압 레벨" })}
        </text>
        <line className="amp-match-divider" x1="526" x2="670" y1="222" y2="222" />
        <text className="interface-node-text" x="595" y="240">
          {localized(language, { zh: "失真 / 保护风险", "zh-Hant": traditional("失真 / 保护风险"), en: "Distortion / protection risk", ja: "歪み / 保護リスク", ko: "왜곡 / 보호 위험" })}
        </text>
        <text className="interface-node-sub" x="595" y="282">
          {localized(language, { zh: "超出电压余量会削波；低阻抗可能触发过流", "zh-Hant": traditional("超出电压余量会削波；低阻抗可能触发过流"), en: "Voltage limit: clipping; current limit: protection", ja: "電圧限界でクリップ、電流限界で保護が動作", ko: "전압 한계: 클리핑 / 전류 한계: 보호 동작" })}
        </text>
        <text className="interface-node-sub" x="595" y="302">
          {localized(language, { zh: "灵敏度低需要更多功率", "zh-Hant": traditional("灵敏度低需要更多功率"), en: "Low sensitivity needs more power", ja: "感度が低いほど多くの電力が必要です", ko: "감도가 낮을수록 더 많은 전력이 필요합니다" })}
        </text>
        <text className="lab-chip" x="368" y="366">
          {localized(language, { zh: "目标：够响、不破音、不过热", "zh-Hant": traditional("目标：够响、不破音、不过热"), en: "Goal: loud enough, clean, and not overheating", ja: "目標：十分な音量、クリアな音、過熱なし", ko: "목표: 충분히 크고 깨끗하며 과열되지 않게" })}
        </text>
      </svg>
      <figcaption>
        {localized(language, {
          zh: "匹配不是只看一个参数。额定功率小不代表一定削波，超过电压或电流余量才可能失真。阻抗随频率变化；灵敏度要区分 1 W/1 m 与 2.83 V/1 m，后者仅在 8 Ω 纯电阻下等于 1 W。", "zh-Hant": traditional("匹配不是只看一个参数。额定功率小不代表一定削波，超过电压或电流余量才可能失真。阻抗随频率变化；灵敏度要区分 1 W/1 m 与 2.83 V/1 m，后者仅在 8 Ω 纯电阻下等于 1 W。"),
          en: "Matching is not one number. A low power rating alone does not cause clipping; exceeding voltage or current headroom can distort. Impedance varies with frequency. Distinguish 1 W/1 m from 2.83 V/1 m; the latter equals 1 W only into an 8-ohm resistive load.",
          ja: "マッチングは一つの数値だけでは決まりません。定格電力が小さいだけでクリップするわけではなく、電圧または電流の余裕を超えると歪む可能性があります。インピーダンスは周波数で変化します。1 W/1 mと2.83 V/1 mを区別してください。後者が1 Wになるのは8 Ωの純抵抗負荷だけです。",
          ko: "매칭은 하나의 숫자로 결정되지 않습니다. 정격 전력이 낮다고 해서 반드시 클리핑되는 것은 아니며 전압 또는 전류 여유를 넘을 때 왜곡될 수 있습니다. 임피던스는 주파수에 따라 변합니다. 1 W/1 m와 2.83 V/1 m를 구분해야 하며 후자가 1 W가 되는 것은 8 Ω 순저항 부하에서뿐입니다."
        })}
      </figcaption>
    </figure>
  );
}

function renderDiagram({
  language,
  diagramMode,
  ampClass
}: {
  language: Language;
  diagramMode: DiagramMode;
  ampClass: AmpClass;
}) {
  if (diagramMode === "speaker") {
    return renderSpeakerDiagram(language);
  }
  if (diagramMode === "enclosure") {
    return renderEnclosureDiagram(language);
  }
  if (diagramMode === "ts") {
    return renderTsDiagram(language);
  }
  if (diagramMode === "crossover") {
    return renderCrossoverOrderDiagram(language);
  }
  if (diagramMode === "activePassive") {
    return renderActivePassiveDiagram(language);
  }
  if (diagramMode === "lineArray") {
    return renderLineArrayDiagram(language);
  }
  if (diagramMode === "matching") {
    return renderMatchingDiagram(language);
  }

  return renderAmplifierDiagram(language, ampClass);
}

function renderAmpPrinciple(language: Language, ampClass: AmpClass) {
  const ampClassLabel = ampClasses.find((item) => item.id === ampClass)?.label ?? "Class D";
  const principle = ampPrinciples[ampClass][language as SupportedLanguage];
  const items = [
    {
      key: "principle",
      label: localized(language, { zh: "基本原理", "zh-Hant": traditional("基本原理"), en: "Principle", ja: "原理", ko: "원리" }),
      copy: principle.principle
    },
    {
      key: "advantage",
      label: localized(language, { zh: "优势", "zh-Hant": traditional("优势"), en: "Benefit", ja: "利点", ko: "장점" }),
      copy: principle.advantage
    },
    {
      key: "caution",
      label: localized(language, { zh: "注意", "zh-Hant": traditional("注意"), en: "Watch out", ja: "注意", ko: "주의" }),
      copy: principle.caution
    },
    {
      key: "usage",
      label: localized(language, { zh: "常见场景", "zh-Hant": traditional("常见场景"), en: "Common uses", ja: "主な用途", ko: "주요 용도" }),
      copy: principle.usage
    }
  ];

  return (
    <section
      aria-label={localized(language, {
        zh: `${ampClassLabel} 基本原理`, "zh-Hant": traditional(`${ampClassLabel} 基本原理`),
        en: `${ampClassLabel} principle`,
        ja: `${ampClassLabel}の原理`,
        ko: `${ampClassLabel} 원리`
      })}
      className="amp-principle-panel"
    >
      <div className="amp-principle-header">
        <span>{localized(language, { zh: "功放类型原理", "zh-Hant": traditional("功放类型原理"), en: "Amplifier class principle", ja: "アンプ方式の原理", ko: "앰프 방식 원리" })}</span>
        <h2>{localized(language, { zh: `${ampClassLabel} 基本原理`, "zh-Hant": traditional(`${ampClassLabel} 基本原理`), en: `${ampClassLabel} Principle`, ja: `${ampClassLabel}の原理`, ko: `${ampClassLabel} 원리` })}</h2>
      </div>
      <div className="amp-principle-grid">
        {items.map((item) => (
          <article className={`amp-principle-card ${item.key}`} key={item.key}>
            <strong>{item.label}</strong>
            <p>{item.copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function AmplifierSpeakerLab({ language, onBack, onBackToDetails }: AmplifierSpeakerLabProps) {
  const [diagramMode, setDiagramMode] = useLabState<DiagramMode>(
    "AmplifierSpeakerLab.diagramMode",
    "amplifier",
    (value): value is DiagramMode => value === "amplifier" || value === "speaker" || value === "enclosure" || value === "ts" || value === "crossover" || value === "activePassive" || value === "lineArray" || value === "matching"
  );
  const [ampClass, setAmpClass] = useLabState<AmpClass>(
    "AmplifierSpeakerLab.ampClass",
    "class-d",
    (value): value is AmpClass => value === "class-a" || value === "class-ab" || value === "class-d"
  );

  return (
    <main className="codec-lab-page amp-lab">
      <section className="sound-lab-hero" aria-labelledby="amplifier-speaker-lab-title">
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
          <span className="section-kicker">{localized(language, { zh: "硬件实验", "zh-Hant": traditional("硬件实验"), en: "Hardware lab", ja: "ハードウェア実験", ko: "하드웨어 실험" })}</span>
          <h1 id="amplifier-speaker-lab-title">
            {localized(language, { zh: "功放与扬声器实验室", "zh-Hant": traditional("功放与扬声器实验室"), en: "Amplifier and Speaker Lab", ja: "アンプとスピーカーラボ", ko: "앰프와 스피커 실험실" })}
          </h1>
          <p>{localized(language, {
            zh: "观察小信号如何变成功率输出、振膜运动和空气声波，理解功放、分频、箱体和扬声器匹配关系。", "zh-Hant": traditional("观察小信号如何变成功率输出、振膜运动和空气声波，理解功放、分频、箱体和扬声器匹配关系。"),
            en: "Inspect how a small signal becomes power output, diaphragm motion, and air pressure while learning amplifier, crossover, enclosure, and speaker matching relationships.",
            ja: "小信号が電力出力、振動板の運動、空気圧へ変わる過程を観察し、アンプ、クロスオーバー、エンクロージャー、スピーカーのマッチングを理解します。",
            ko: "작은 신호가 전력 출력과 진동판 운동, 공기 압력으로 바뀌는 과정을 관찰하고 앰프, 크로스오버, 인클로저, 스피커 매칭을 이해합니다."
          })}</p>
        </div>
      </section>

      <section
        aria-label={localized(language, { zh: "功放与扬声器信号链", "zh-Hant": traditional("功放与扬声器信号链"), en: "Amplifier and speaker signal chain", ja: "アンプとスピーカーの信号経路", ko: "앰프와 스피커 신호 경로" })}
        className="amp-lab-chain"
      >
        {chainLabels[language as SupportedLanguage].map((label, index) => (
          <div className="amp-chain-node" key={label}>
            <span>{label}</span>
            {index < chainLabels[language as SupportedLanguage].length - 1 ? <span aria-hidden="true" className="amp-chain-arrow">→</span> : null}
          </div>
        ))}
      </section>

      <section
        aria-label={localized(language, { zh: "功放与扬声器实验台", "zh-Hant": traditional("功放与扬声器实验台"), en: "Amplifier and speaker workbench", ja: "アンプとスピーカーのワークベンチ", ko: "앰프와 스피커 작업대" })}
        className="amp-lab-workbench"
      >
        <div className="amp-lab-panel">
          <div className="waveform-tabs" role="group" aria-label={localized(language, { zh: "图解模式", "zh-Hant": traditional("图解模式"), en: "Diagram mode", ja: "図解モード", ko: "다이어그램 모드" })}>
            {diagramModes.map((mode) => (
              <button
                aria-pressed={diagramMode === mode.id}
                className={diagramMode === mode.id ? "waveform-tab active" : "waveform-tab"}
                key={mode.id}
                type="button"
                onClick={() => setDiagramMode(mode.id)}
              >
                {localized(language, mode.label)}
              </button>
            ))}
          </div>

          {diagramMode === "amplifier" ? (
            <div
              className="waveform-tabs amp-class-tabs"
              role="group"
              aria-label={localized(language, { zh: "功放类型", "zh-Hant": traditional("功放类型"), en: "Amplifier class", ja: "アンプ方式", ko: "앰프 방식" })}
            >
              {ampClasses.map((item) => (
                <button
                  aria-pressed={ampClass === item.id}
                  className={ampClass === item.id ? "waveform-tab active" : "waveform-tab"}
                  key={item.id}
                  type="button"
                  onClick={() => setAmpClass(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          ) : null}

          {renderDiagram({ language, diagramMode, ampClass })}
          <p className="amp-lab-model-note">{text(language,
            diagramMode === "activePassive" ? "图中是数字主动分频示例：DSP 分频后，各频段经 DAC 和独立功放输出。模拟主动分频不需要 DAC。" : diagramMode === "lineArray" ? "覆盖边界为概念示意，不是计算声场或固定指向角；实际覆盖随频率、阵列长度、间距和角度变化，并非每种阵列都支持逐单元延迟。" : "图示用于解释原理，不是产品实测。分频阶数页为理想 Butterworth 电气低通响应，其余示意不按尺寸或数值比例绘制。",
            diagramMode === "activePassive" ? "Digital active crossover example: DSP splits the bands, then DAC channels and separate amplifiers drive them. Analog active crossovers need no DAC." : diagramMode === "lineArray" ? "Coverage outlines are conceptual, not a calculated sound field or fixed angle. Coverage depends on frequency, array length, spacing and splay; not every array offers per-element delay." : "These are conceptual diagrams, not product measurements. The order page plots ideal Butterworth electrical low-passes; other diagrams are not dimensionally or numerically to scale.",
            diagramMode === "activePassive" ? "デジタルの例です。DSPで帯域分割し、各帯域をDACと専用アンプで出力します。アナログ方式にDACは不要です。" : diagramMode === "lineArray" ? "境界は概念図で、計算した音場や固定角度ではありません。周波数、長さ、間隔、角度で変化し、全機種が素子別の遅延を持つわけではありません。" : "図は原理説明であり実測ではありません。次数の図は理想Butterworth電気ローパス応答で、他の図の寸法や数値は比例しません。",
            diagramMode === "activePassive" ? "디지털 방식의 예입니다. DSP로 대역을 나눈 뒤 각 대역을 DAC와 개별 앰프로 출력합니다. 아날로그 액티브 방식에는 DAC가 필요 없습니다." : diagramMode === "lineArray" ? "경계는 계산된 음장이나 고정 각도가 아닌 개념도입니다. 주파수, 길이, 간격, 각도에 따라 달라지며 모든 어레이가 유닛별 지연을 지원하지는 않습니다." : "원리 도해이며 실측이 아닙니다. 차수 페이지는 이상적인 Butterworth 전기 저역통과 응답이며 다른 도해는 치수나 수치 비례를 나타내지 않습니다."
          )}</p>
          {diagramMode === "amplifier" ? renderAmpPrinciple(language, ampClass) : null}
        </div>
      </section>
    </main>
  );
}
