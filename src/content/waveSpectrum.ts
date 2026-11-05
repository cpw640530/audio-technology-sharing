import type { LocalizedText, Topic } from "./knowledge";
import { traditional } from "./traditional";

const l = (zh: string, en: string, ja: string, ko: string): LocalizedText => ({ zh, "zh-Hant": traditional(zh), en, ja, ko });

export const waveSpectrumTopic: Topic = {
  title: l("读懂波形与频谱", "Reading Waveforms and Spectra", "波形とスペクトルを読む", "파형과 스펙트럼 읽기"),
  summary: l("把同一段声音的时间变化与频率组成对应起来，分清基频、谐波和时频图。", "Connect a sound's changes over time with its frequency components, harmonics, and spectrogram.", "同じ音の時間変化と周波数成分を結び付け、基本周波数・倍音・スペクトログラムを理解します。", "같은 소리의 시간 변화와 주파수 성분을 연결하고 기본 주파수, 배음, 스펙트로그램을 이해합니다."),
  bullets: [
    l("时域与频域", "Time and frequency domains", "時間領域と周波数領域", "시간 영역과 주파수 영역"),
    l("分量叠加与谐波", "Superposition and harmonics", "重ね合わせと倍音", "중첩과 배음"),
    l("幅度谱与时频图", "Amplitude spectra and spectrograms", "振幅スペクトルとスペクトログラム", "진폭 스펙트럼과 스펙트로그램")
  ],
  detail: {
    explanation: l("波形回答“信号何时、怎样变化”，频谱回答“信号包含哪些频率、各有多强”。它们描述同一信号的不同方面，不是处理前后两段不同的声音。", "A waveform shows when and how a signal changes; a spectrum shows its frequencies and their strengths. They describe different aspects of the same signal, not an input and a processed output.", "波形は信号がいつ、どう変わるかを、スペクトルは含まれる周波数とその強さを示します。同じ信号の異なる表現であり、処理前後の別の音ではありません。", "파형은 신호가 언제 어떻게 변하는지, 스펙트럼은 어떤 주파수가 얼마나 강한지 보여 줍니다. 처리 전후의 다른 소리가 아니라 같은 신호의 서로 다른 표현입니다."),
    keyConcepts: [
      l("先看坐标、单位与标度，再比较图形；不要凭曲线高度判断音高。", "Read axes, units, and scales before comparing shapes; curve height is not pitch.", "形を比べる前に軸・単位・尺度を確認します。曲線の高さは音高ではありません。", "모양을 비교하기 전에 축, 단위, 척도를 확인합니다. 곡선 높이가 음높이는 아닙니다."),
      l("谐波是基频的整数倍；任意多个正弦分量不一定互为谐波。", "Harmonics are integer multiples of a fundamental; arbitrary sinusoids need not be harmonically related.", "倍音は基本周波数の整数倍です。任意の正弦波同士が倍音関係とは限りません。", "배음은 기본 주파수의 정수배입니다. 임의의 정현파가 모두 배음 관계인 것은 아닙니다."),
      l("幅度谱不保留相位，单凭它不能唯一恢复波形。", "An amplitude spectrum omits phase and cannot uniquely reconstruct a waveform.", "振幅スペクトルは位相を含まず、それだけで波形を一意に復元できません。", "진폭 스펙트럼에는 위상이 없어 이것만으로 파형을 유일하게 복원할 수 없습니다.")
    ],
    lab: {
      type: "wave-spectrum",
      title: l("波形与频谱实验室", "Waveform and Spectrum Lab", "波形とスペクトル実験室", "파형과 스펙트럼 실험실"),
      description: l("用三个正弦分量对照合成波形与幅度线谱。", "Compare three sine components, their sum, and their amplitude line spectrum.", "三つの正弦波、その和、振幅線スペクトルを比較します。", "세 정현파 성분, 합성 파형, 진폭 선 스펙트럼을 비교합니다."),
      buttonLabel: l("打开波形与频谱实验室", "Open waveform and spectrum lab", "波形とスペクトル実験室を開く", "파형과 스펙트럼 실험실 열기")
    },
    misconception: l("这里的幅度是归一化数字量，不是实测声压。幅度谱、功率谱和功率谱密度的纵轴含义不同，不能统称为“能量图”。", "Amplitude here is a normalized digital value, not measured sound pressure. Amplitude, power, and power spectral density use different vertical quantities; they are not interchangeable energy plots.", "ここでの振幅は正規化されたデジタル値であり、実測音圧ではありません。振幅・パワー・パワースペクトル密度では縦軸の意味が異なります。", "여기서 진폭은 정규화된 디지털 값이지 실측 음압이 아닙니다. 진폭, 파워, 파워 스펙트럼 밀도는 세로축의 의미가 다릅니다."),
    contentDirection: l("先建立读图直觉，再进入基础信号处理学习 FFT/STFT 和窗函数。", "Build plot-reading intuition before studying FFT/STFT and windows in Core Signal Processing.", "まず図を読む感覚を養い、基礎信号処理で FFT/STFT と窓関数を学びます。", "먼저 그래프를 읽는 직관을 익힌 뒤 기초 신호 처리에서 FFT/STFT와 창 함수를 학습합니다.")
  }
};

export const waveSpectrumSections = [
  {
    title: l("一个信号，两种观察方式", "One signal, two views", "一つの信号、二つの見方", "하나의 신호, 두 가지 관점"),
    body: l("时域图的横轴是时间，纵轴是瞬时幅度，可以看起止、周期和瞬态。频域图的横轴是频率，纵轴必须明确是幅度、功率还是其他量；它更适合区分频率成分，而不是直接告诉你声音何时出现。", "A time-domain plot uses time and instantaneous amplitude to show onsets, cycles, and transients. A frequency-domain plot uses frequency and a specified magnitude quantity. It separates frequency components but does not directly locate them in time.", "時間波形は時間と瞬時振幅で開始・周期・過渡変化を示します。周波数領域では横軸が周波数となり、縦軸の量を明示する必要があります。成分を分けられますが、発生時刻は直接示しません。", "시간 영역은 시간과 순간 진폭으로 시작, 주기, 과도 변화를 보여 줍니다. 주파수 영역은 주파수와 명시된 크기 척도로 성분을 구분하지만 발생 시각을 직접 보여 주지는 않습니다.")
  },
  {
    title: l("从纯音到复合音", "From a pure tone to a complex tone", "純音から複合音へ", "순음에서 복합음으로"),
    body: l("理想纯音只有一个频率。将 250、500、750 Hz 的正弦分量逐时刻相加，就得到一个谐波复合音：250 Hz 为基频，500 和 750 Hz 分别为二次、三次谐波。改变比例会改变波形与音色线索，但更多谐波不代表更好的音质；只保留 500 Hz 时，剩下的是 500 Hz 纯音。", "An ideal pure tone has one frequency. Adding 250, 500, and 750 Hz sinusoids point by point gives a harmonic complex: 250 Hz is the fundamental, with second and third harmonics. Their balance changes shape and timbral cues, not a quality score. With only 500 Hz left, the result is a 500 Hz pure tone.", "理想純音の周波数は一つです。250・500・750 Hz を各時刻で足すと、250 Hz を基本周波数とする複合音になります。比率は波形と音色の手掛かりを変えますが、倍音が多いほど高音質とは限りません。500 Hz だけなら 500 Hz の純音です。", "이상적인 순음은 하나의 주파수만 갖습니다. 250, 500, 750 Hz를 시점별로 더하면 250 Hz를 기본으로 하는 배음 복합음이 됩니다. 비율은 파형과 음색 단서를 바꾸지만 배음이 많다고 음질이 좋은 것은 아닙니다. 500 Hz만 남으면 500 Hz 순음입니다.")
  },
  {
    title: l("为什么还需要时频图", "Why a spectrogram adds information", "スペクトログラムが必要な理由", "스펙트로그램이 필요한 이유"),
    body: l("本网站的时频图横轴为时间，纵轴为频率，颜色表示每一帧中相应频率的强度，具体单位以图例为准。持续纯音常表现为横向亮线，扫频表现为倾斜轨迹，短促宽带声音表现为短时间内跨越多个频率的亮带。颜色越亮只表示该标度下数值更高，不等同于听起来一定更响。", "Our spectrograms use time horizontally, frequency vertically, and color for a per-frame spectral quantity defined by the legend. A steady tone gives a horizontal ridge, a sweep a sloping ridge, and a brief broadband event a short vertical band. Brighter means a larger plotted value, not necessarily greater perceived loudness.", "本サイトのスペクトログラムは横軸が時間、縦軸が周波数で、色の量は凡例で定義します。持続純音は水平線、スイープは斜線、短い広帯域音は縦帯として現れます。明るさは表示値の大きさであり、聴感上の大きさと同一ではありません。", "이 사이트의 스펙트로그램은 가로축이 시간, 세로축이 주파수이며 색의 물리량은 범례에 따릅니다. 지속 순음은 수평선, 스윕은 기울어진 선, 짧은 광대역음은 수직 띠로 나타납니다. 밝기는 표시 값의 크기이지 지각 음량과 같지 않습니다.")
  },
  {
    title: l("读图时最容易混淆的边界", "Limits to keep in mind", "図を読むときの注意点", "그래프 해석의 한계"),
    body: l("固定参考下，幅度用 20 log₁₀(A/Aref) 转为 dB，功率用 10 log₁₀(P/Pref)。数字幅度不能直接换算为 dBSPL。实验室显示的是已知正弦系数的理想线谱；实际 FFT 测量还会受到观察时长、窗函数和谱泄漏影响，这些留在“基础信号处理”中解释。", "With a fixed reference, amplitude ratios use 20 log₁₀(A/Aref); power ratios use 10 log₁₀(P/Pref). Digital amplitude is not directly convertible to dBSPL. This lab shows ideal lines from known sine coefficients; real FFT measurements also depend on observation length, windows, and leakage, covered in Core Signal Processing.", "一定の基準では振幅比は 20 log₁₀(A/Aref)、パワー比は 10 log₁₀(P/Pref) で dB に変換します。デジタル振幅から dBSPL は直接求まりません。実験は既知の係数による理想線スペクトルで、実測 FFT の窓や漏れは基礎信号処理で扱います。", "고정 기준에서 진폭비는 20 log₁₀(A/Aref), 파워비는 10 log₁₀(P/Pref)로 dB를 계산합니다. 디지털 진폭을 dBSPL로 직접 바꿀 수는 없습니다. 실험은 알려진 계수의 이상적 선 스펙트럼이며 실제 FFT의 창과 누설은 기초 신호 처리에서 다룹니다.")
  }
];

export const signalExamples = [
  [l("持续纯音", "Steady pure tone", "持続純音", "지속 순음"), l("规则的正弦波", "Regular sinusoid", "規則的な正弦波", "규칙적인 정현파"), l("理想情况下只有一条频率线", "One ideal frequency line", "理想的には一本の線", "이상적으로 하나의 주파수 선")],
  [l("谐波复合音", "Harmonic complex", "倍音を持つ複合音", "배음 복합음"), l("周期重复，但不再是正弦形", "Periodic, not sinusoidal", "周期的だが正弦形ではない", "주기적이지만 정현파가 아님"), l("基频及其整数倍上的谱线", "Lines at the fundamental and its multiples", "基本周波数と整数倍の線", "기본 주파수와 정수배의 선")],
  [l("宽带噪声", "Broadband noise", "広帯域雑音", "광대역 잡음"), l("不规则起伏，没有稳定周期", "Irregular, no stable period", "不規則で安定した周期がない", "불규칙하고 안정된 주기가 없음"), l("能量分布在较宽频带；一次测量不一定平坦", "Spread over a wide band; a single estimate need not be flat", "広い帯域に分布し、一回の測定は平坦とは限らない", "넓은 대역에 분포하며 한 번의 측정이 평탄하지는 않음")],
  [l("短促脉冲", "Brief pulse", "短いパルス", "짧은 펄스"), l("短时间内的幅度突变", "A brief amplitude excursion", "短時間の振幅変化", "짧은 시간의 진폭 변화"), l("通常覆盖较宽频带；具体形状取决于脉冲宽度和包络", "Usually broad; its shape depends on duration and envelope", "通常は広帯域で、幅と包絡により形が変わる", "대체로 넓으며 폭과 포락선에 따라 모양이 달라짐")]
];
