import { useEffect, useMemo, useRef, useState } from "react";
import type { Language } from "../content/knowledge";
import { psdDb, stftAnalysis, type StftExample } from "./stftModel";

type Localized = Record<"zh" | "en" | "ja" | "ko", string>;

const examples: Record<StftExample, Localized> = {
  tone: { zh: "纯音", en: "Pure tone", ja: "純音", ko: "순음" },
  chirp: { zh: "扫频", en: "Chirp", ja: "チャープ", ko: "처프" },
  "two-tone": { zh: "相邻双音", en: "Nearby tones", ja: "近接した 2 音", ko: "인접한 두 톤" },
  pulse: { zh: "短脉冲", en: "Impulse", ja: "短いインパルス", ko: "임펄스" },
  mixed: { zh: "混合信号", en: "Mixture", ja: "混合信号", ko: "혼합 신호" }
};
const descriptions: Record<StftExample, Localized> = {
  tone: { zh: "1 kHz 纯音：频率不变，因此是一条水平亮带。", en: "1 kHz tone: constant frequency forms a horizontal band.", ja: "1 kHz の純音：周波数が一定なので水平な明るい帯になる。", ko: "1 kHz 순음: 주파수가 일정하므로 수평의 밝은 띠가 됨." },
  "two-tone": { zh: "1000 Hz 与 1125 Hz 等幅双音：频差 125 Hz。比较长短窗口下两峰之间的谷，不能只看频率格数量。", en: "Equal-amplitude 1000 and 1125 Hz tones, 125 Hz apart. Compare the valley between peaks across window lengths, not just the number of bins.", ja: "振幅が等しい 1000 Hz と 1125 Hz の 2 音、周波数差は 125 Hz。窓長ごとの 2 つのピーク間の谷を比べ、ビン数だけで判断しない。", ko: "진폭이 같은 1000 Hz와 1125 Hz 두 톤이며 주파수 차이는 125 Hz. 윈도 길이에 따른 두 피크 사이 골을 비교하고 빈 개수만 보지 않음." },
  chirp: { zh: "1→6.12 kHz 扫频：频率逐渐上升，因此是一条斜向亮带。", en: "1→6.12 kHz chirp: rising frequency forms an upward band.", ja: "1→6.12 kHz のチャープ：周波数が徐々に上がるため、斜め上向きの明るい帯になる。", ko: "1→6.12 kHz 처프: 주파수가 점점 올라가므로 위로 향하는 밝은 띠가 됨." },
  pulse: { zh: "160 ms 处的单样本脉冲：持续极短、频带很宽，因此形成竖向亮带。", en: "A single-sample impulse at 160 ms: brief and broadband, forming a vertical band.", ja: "160 ms の 1 サンプルインパルス：持続時間が極めて短く広帯域なので、縦の帯になる。", ko: "160 ms의 단일 샘플 임펄스: 매우 짧고 광대역이므로 세로 띠를 만듦." },
  mixed: { zh: "1 kHz 纯音、2.5→3.524 kHz 扫频，以及 160 ms 附近的 6 kHz 短音同时存在。", en: "A 1 kHz tone, a 2.5→3.524 kHz chirp and a brief 6 kHz tone near 160 ms coexist.", ja: "1 kHz の純音、2.5→3.524 kHz のチャープ、160 ms 付近の短い 6 kHz 音が同時に存在する。", ko: "1 kHz 순음, 2.5→3.524 kHz 처프 및 160 ms 부근의 짧은 6 kHz 톤이 동시에 존재함." }
};

const copy = {
  tracksAria: { zh: "STFT 音轨观察台", en: "STFT track workbench", ja: "STFT トラック観察台", ko: "STFT 트랙 워크벤치" },
  load: { zh: "加载 STFT 对照", en: "Load STFT comparison", ja: "STFT 比較条件を読み込む", ko: "STFT 비교 조건 불러오기" },
  choose: { zh: "选择对照条件", en: "Choose comparison conditions", ja: "比較条件を選択", ko: "비교 조건 선택" },
  single: { zh: "1A · 单音 / 64 ms", en: "1A · One tone / 64 ms", ja: "1A · 単音 / 64 ms", ko: "1A · 단일 톤 / 64 ms" },
  pair: { zh: "1B · 双音 / 64 ms", en: "1B · Two tones / 64 ms", ja: "1B · 2 音 / 64 ms", ko: "1B · 두 톤 / 64 ms" },
  twoShort: { zh: "2A · 双音 / 16 ms", en: "2A · Two tones / 16 ms", ja: "2A · 2 音 / 16 ms", ko: "2A · 두 톤 / 16 ms" },
  twoLong: { zh: "2B · 双音 / 64 ms", en: "2B · Two tones / 64 ms", ja: "2B · 2 音 / 64 ms", ko: "2B · 두 톤 / 64 ms" },
  hopSparse: { zh: "3A · 双音 / Hop 32 ms", en: "3A · Two tones / Hop 32 ms", ja: "3A · 2 音 / Hop 32 ms", ko: "3A · 두 톤 / Hop 32 ms" },
  hopDense: { zh: "3B · 双音 / Hop 8 ms", en: "3B · Two tones / Hop 8 ms", ja: "3B · 2 音 / Hop 8 ms", ko: "3B · 두 톤 / Hop 8 ms" },
  pulseShort: { zh: "4A · 脉冲 / 16 ms", en: "4A · Impulse / 16 ms", ja: "4A · インパルス / 16 ms", ko: "4A · 임펄스 / 16 ms" },
  pulseLong: { zh: "4B · 脉冲 / 64 ms", en: "4B · Impulse / 64 ms", ja: "4B · インパルス / 64 ms", ko: "4B · 임펄스 / 64 ms" },
  examples: { zh: "示例信号", en: "Example signal", ja: "信号例", ko: "예시 신호" },
  waveform: { zh: "波形", en: "Waveform", ja: "波形", ko: "파형" },
  fullWave: { zh: "完整 PCM 波形", en: "Full PCM waveform", ja: "全体の PCM 波形", ko: "전체 PCM 파형" },
  amplitude: { zh: "幅度", en: "Amp.", ja: "振幅", ko: "진폭" },
  spectrogram: { zh: "STFT 时频图", en: "STFT spectrogram", ja: "STFT スペクトログラム", ko: "STFT 스펙트로그램" },
  frequencyTime: { zh: "频率随时间的分布", en: "Frequency over time", ja: "時間に対する周波数分布", ko: "시간에 따른 주파수 분포" },
  spectrogramAria: { zh: "STFT 时频图：横轴时间，纵轴频率，颜色表示功率谱密度", en: "STFT spectrogram: time, frequency and power spectral density", ja: "STFT スペクトログラム：横軸は時間、縦軸は周波数、色はパワースペクトル密度", ko: "STFT 스펙트로그램: 가로축 시간, 세로축 주파수, 색상은 파워 스펙트럼 밀도" },
  selectedFrame: { zh: "观察帧", en: "Selected frame", ja: "選択フレーム", ko: "선택한 프레임" },
  currentWindow: { zh: "当前窗口", en: "Current window", ja: "現在の窓", ko: "현재 윈도" },
  samples: { zh: "样本", en: "samples", ja: "サンプル", ko: "샘플" },
  spacing: { zh: "窗口时长 / 帧间隔 / 频率格间距", en: "Window duration / Frame spacing / Bin spacing", ja: "窓長 / フレーム間隔 / ビン間隔", ko: "윈도 길이 / 프레임 간격 / 빈 간격" },
  noOverlap: { zh: "当前帧不重叠：落在 Hann 窗边缘或帧间空隙的短事件可能漏检。可减小 hop 观察差别。", en: "Frames do not overlap: brief events at Hann window edges or in gaps can be missed. Reduce hop to compare.", ja: "現在のフレームは重なっていない。Hann 窓の端やフレーム間の隙間にある短いイベントを見逃す可能性がある。hop を小さくして比較できる。", ko: "현재 프레임은 겹치지 않음. Hann 윈도 가장자리나 프레임 사이의 빈틈에 있는 짧은 이벤트를 놓칠 수 있으므로 hop을 줄여 비교할 수 있음." },
  windowed: { zh: "当前帧 · 加窗波形", en: "Selected frame · windowed PCM", ja: "選択フレーム · 窓掛け PCM", ko: "선택한 프레임 · 윈도잉 PCM" },
  selectedWindowed: { zh: "当前帧加窗波形", en: "Selected windowed frame", ja: "選択フレームの窓掛け波形", ko: "선택한 윈도잉 프레임" },
  timeWithin: { zh: "横轴：窗口内时间；纵轴：幅度 −1…+1", en: "X: time within window; Y: amplitude −1…+1", ja: "横軸：窓内の時間、縦軸：振幅 −1…+1", ko: "가로축: 윈도 내부 시간, 세로축: 진폭 −1…+1" },
  spectrum: { zh: "当前帧 · 频谱", en: "Selected frame · spectrum", ja: "選択フレーム · スペクトル", ko: "선택한 프레임 · 스펙트럼" },
  psd: { zh: "当前帧功率谱密度", en: "Selected-frame PSD", ja: "選択フレームの PSD", ko: "선택한 프레임의 PSD" },
  frequencySpectrum: { zh: "横轴：0–8 kHz；纵轴：−100…−20 dB/Hz", en: "X: 0–8 kHz; Y: −100…−20 dB/Hz", ja: "横軸：0–8 kHz、縦軸：−100…−20 dB/Hz", ko: "가로축: 0–8 kHz, 세로축: −100…−20 dB/Hz" },
  twoToneDetail: { zh: "双音频谱局部 · 750–1375 Hz", en: "Two-tone spectrum detail · 750–1375 Hz", ja: "2 音スペクトル詳細 · 750–1375 Hz", ko: "두 톤 스펙트럼 상세 · 750–1375 Hz" },
  nearbyDetail: { zh: "相邻双音局部频谱", en: "Nearby-tone spectrum detail", ja: "近接 2 音のスペクトル詳細", ko: "인접 두 톤 스펙트럼 상세" },
  twoToneNote: { zh: "横轴 750–1375 Hz，纵轴 −100…−20 dB/Hz。折线仅连接已计算的频率格。长窗改变主瓣宽度；补零只能插值，不能代替更长的观测。", en: "X: 750–1375 Hz; Y: −100…−20 dB/Hz. Lines connect computed bins only. Longer windows change main-lobe width; zero padding interpolates and cannot replace longer observation.", ja: "横軸 750–1375 Hz、縦軸 −100…−20 dB/Hz。折れ線は計算済みのビンだけを結ぶ。長い窓は主ローブ幅を変えるが、ゼロ詰めは補間に過ぎず、長い観測の代わりにはならない。", ko: "가로축 750–1375 Hz, 세로축 −100…−20 dB/Hz. 선은 계산된 빈만 연결함. 긴 윈도는 주 로브 폭을 바꾸지만 제로 패딩은 보간일 뿐 더 긴 관측을 대신할 수 없음." },
  notes: { zh: "读图与计算说明", en: "Reading and calculation notes", ja: "読み方と計算の説明", ko: "읽기 및 계산 설명" },
  note1: { zh: "每列来自一帧 PCM：分帧 → Hann 加窗 → DFT → 功率谱密度。上下音轨共用时间轴；游标是帧中心，上方阴影是完整分析窗口。空白边缘或帧间空隙是未显示分析值，不代表静音。", en: "Each column comes from one PCM frame: framing → Hann window → DFT → PSD. Tracks share a timeline; the cursor is the frame center and the shaded region is the full analysis window. Blank edges or gaps mean no displayed analysis, not silence.", ja: "各列は 1 フレームの PCM から作る：フレーム分割 → Hann 窓 → DFT → PSD。上下のトラックは同じ時間軸を使い、カーソルはフレーム中心、上の影は完全な解析窓を示す。端やフレーム間の空白は解析値を表示していないだけで、無音を意味しない。", ko: "각 열은 하나의 PCM 프레임에서 생성됨: 프레임 분할 → Hann 윈도 → DFT → PSD. 위아래 트랙은 같은 시간축을 사용하며 커서는 프레임 중심, 위의 음영은 전체 분석 윈도를 나타냄. 가장자리나 프레임 사이의 빈칸은 분석값을 표시하지 않은 것이지 무음을 뜻하지 않음." },
  note2: { zh: "颜色由暗蓝到紫、橙、亮白，对应功率谱密度由低到高，参考 1 FS²/Hz。色标固定为 −100…−20 dB/Hz，超范围饱和显示；这不是总响度。纯音的峰值密度可随窗口变化，但频带积分功率不因此增大。", en: "Dark blue, violet, orange and white indicate increasing PSD relative to 1 FS²/Hz. The fixed −100…−20 dB/Hz scale clips values outside its range; this is not total loudness. A tone peak may change with window length without increasing integrated power.", ja: "暗い青、紫、オレンジ、明るい白は 1 FS²/Hz を基準に低い順から高い順の PSD を示す。色スケールは −100…−20 dB/Hz に固定し、範囲外は飽和表示する。これは全体のラウドネスではない。純音のピーク密度は窓長で変わるが、帯域積分パワーが増えるわけではない。", ko: "짙은 파랑, 보라, 주황 및 흰색은 1 FS²/Hz 기준으로 증가하는 PSD를 나타냄. 고정 색상 범위는 −100…−20 dB/Hz이며 범위를 벗어나면 포화 표시함. 이는 전체 라우드니스가 아님. 순음의 피크 밀도는 윈도 길이에 따라 바뀔 수 있지만 적분 대역 전력이 증가하는 것은 아님." },
  note3: { zh: "长窗更能分开相邻频率，但短事件会在时间上展开。hop 改变帧间距，不改变同一帧的频谱。这里使用逐频率格数据，不做频带平均或平滑补细节。", en: "Long windows better separate nearby frequencies but spread short events in time. Hop changes frame spacing, not an identical frame's spectrum. These are individual frequency bins, without band averaging or smoothing to invent detail.", ja: "長い窓は近接周波数を分離しやすいが、短いイベントを時間方向に広げる。hop はフレーム間隔を変えるが、同じフレームのスペクトルは変えない。ここでは周波数ビンごとのデータを使い、帯域平均や平滑化で細部を作っていない。", ko: "긴 윈도는 인접 주파수를 더 잘 분리하지만 짧은 이벤트를 시간상으로 퍼뜨림. hop은 프레임 간격을 바꾸며 동일 프레임의 스펙트럼은 바꾸지 않음. 여기서는 개별 주파수 빈 데이터를 사용하고 대역 평균이나 평활화로 세부를 만들어내지 않음." },
  note4: { zh: "FFT 是计算 DFT 的快速算法。本演示使用有限长度直接 DFT；768 点窗补零至 1024 点，补零不会增加实际分辨能力。单边 PSD 按采样率和窗平方和归一化，频率格间距为 fs/NDFT。", en: "FFT is a fast algorithm for the DFT. This demo directly computes the bounded DFT; 768-sample windows are padded to 1024 without improving true resolution. One-sided PSD is normalized by sample rate and window squared sum; bin spacing is fs/NDFT.", ja: "FFT は DFT を計算する高速アルゴリズム。このデモは有限長の DFT を直接計算し、768 サンプルの窓を 1024 点までゼロ詰めするが、実際の分解能は向上しない。片側 PSD はサンプルレートと窓の二乗和で正規化し、ビン間隔は fs/NDFT。", ko: "FFT는 DFT를 계산하는 빠른 알고리즘임. 이 데모는 유한 길이 DFT를 직접 계산하며 768 샘플 윈도를 1024점까지 제로 패딩하지만 실제 분해능은 향상되지 않음. 단측 PSD는 샘플 레이트와 윈도 제곱합으로 정규화하고 빈 간격은 fs/NDFT임." }
} satisfies Record<string, Localized>;

// Dark blue -> violet -> orange -> white; interpolate colors, never spectrum values.
function color(db: number) {
  const stops = [[5, 9, 20], [35, 42, 110], [147, 49, 146], [245, 139, 65], [255, 250, 225]];
  const position = Math.max(0, Math.min(4, (db + 100) / 20));
  const i = Math.min(3, Math.floor(position)), t = position - i;
  return `rgb(${stops[i].map((v, c) => Math.round(v + (stops[i + 1][c] - v) * t)).join(",")})`;
}

function line(values: number[], height: number, scale: number, offset: number) {
  return values.map((v, i) => `${i ? "L" : "M"} ${i / (values.length - 1) * 800} ${height - (v + offset) * scale}`).join(" ");
}

export function StftWorkbench({ language, windowSize, hopSize, onParameters }: { language: Language; windowSize: number; hopSize: number; onParameters?: (window: number, hop: number) => void }) {
  const [example, setExample] = useState<StftExample>("tone");
  const [time, setTime] = useState(16);
  const analysis = useMemo(() => stftAnalysis(windowSize, hopSize, example), [windowSize, hopSize, example]);
  const frameIndex = analysis.frames.reduce((best, f, i) => Math.abs(f.centerMs - time) < Math.abs(analysis.frames[best].centerMs - time) ? i : best, 0);
  const frame = analysis.frames[frameIndex];
  const canvas = useRef<HTMLCanvasElement>(null);
  const cursor = frame.centerMs / 256 * 100;
  const waveform = useMemo(() => {
    // Preserve peaks with min/max buckets instead of downsampling away the impulse.
    return Array.from({ length: 800 }, (_, i) => {
      const samples = analysis.pcm.slice(Math.floor(i * 4096 / 800), Math.floor((i + 1) * 4096 / 800));
      return `M ${i} ${60 - Math.min(...samples) * 54} V ${60 - Math.max(...samples) * 54}`;
    }).join(" ");
  }, [analysis.pcm]);
  useEffect(() => {
    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#111b20";
    ctx.fillRect(0, 0, 1024, 512);
    const span = Math.min(hopSize, windowSize);
    for (const f of analysis.frames) {
      const x = (f.centerMs * 16 - span / 2) / 4;
      const bins = f.psd.length - 1;
      for (let k = 0; k <= bins; k++) {
        const lower = Math.max(0, (k - 0.5) / bins), upper = Math.min(1, (k + 0.5) / bins);
        ctx.fillStyle = color(psdDb(f.psd[k]));
        ctx.fillRect(x, (1 - upper) * 512, span / 4, (upper - lower) * 512);
      }
    }
  }, [analysis, hopSize, windowSize]);
  const selectPosition = (clientX: number, element: HTMLElement) => {
    const bounds = element.getBoundingClientRect();
    setTime(Math.max(0, Math.min(256, (clientX - bounds.left) / bounds.width * 256)));
  };
  return <section className="stft-tracks" aria-label={copy.tracksAria[language]}>
    {onParameters && <label className="digital-study-select">
      <span>{copy.load[language]}</span>
      <select value="" onChange={event => {
        const key = event.target.value;
        if (!key) return;
        setExample(key.startsWith("pulse") ? "pulse" : key === "single" ? "tone" : "two-tone");
        setTime(key.startsWith("pulse") ? 160 : 32);
        onParameters(key.endsWith("short") ? 256 : 1024, key === "hop-sparse" ? 512 : 128);
      }}>
        <option value="">{copy.choose[language]}</option>
        <option value="single">{copy.single[language]}</option>
        <option value="pair">{copy.pair[language]}</option>
        <option value="two-short">{copy.twoShort[language]}</option>
        <option value="two-long">{copy.twoLong[language]}</option>
        <option value="hop-sparse">{copy.hopSparse[language]}</option>
        <option value="hop-dense">{copy.hopDense[language]}</option>
        <option value="pulse-short">{copy.pulseShort[language]}</option>
        <option value="pulse-long">{copy.pulseLong[language]}</option>
      </select>
    </label>}
    <div className="waveform-tabs" role="group" aria-label={copy.examples[language]}>
      {(Object.keys(examples) as StftExample[]).map(key => <button key={key} type="button" aria-pressed={key === example} className={key === example ? "active" : ""} onClick={() => setExample(key)}>{examples[key][language]}</button>)}
    </div>
    <p className="stft-example-note">{descriptions[example][language]}</p>
    <header><h2>{copy.waveform[language]}</h2><span>PCM · 16 kHz · 256 ms</span></header>
    <div className="stft-track-row">
      <div className="stft-axis"><span>+1</span><span>0</span><span>−1</span></div>
      <div className="stft-track-plot">
        <svg role="img" aria-label={copy.fullWave[language]} viewBox="0 0 800 120" preserveAspectRatio="none">
          <line x1="0" x2="800" y1="60" y2="60" className="stft-grid-line" />
          <path data-testid="stft-full-wave" d={waveform} className="stft-pcm-line" />
        </svg>
        <div className="stft-frame-span" data-testid="stft-frame-span" style={{ left: `${frame.start / 4096 * 100}%`, width: `${windowSize / 4096 * 100}%` }} />
        <div className="stft-time-cursor" style={{ left: `${cursor}%` }} />
      </div><span className="stft-axis-unit">{copy.amplitude[language]}</span>
    </div>
    <header><h2>{copy.spectrogram[language]}</h2><span>{copy.frequencyTime[language]}</span></header>
    <div className="stft-track-row">
      <div className="stft-axis"><span>8k</span><span>6k</span><span>4k</span><span>2k</span><span>0 Hz</span></div>
      <div className="stft-track-plot stft-heatmap" onPointerDown={event => selectPosition(event.clientX, event.currentTarget)}>
        <canvas ref={canvas} width="1024" height="512" role="img" aria-label={copy.spectrogramAria[language]} />
        <div className="stft-time-cursor" data-testid="stft-time-cursor" style={{ left: `${cursor}%` }} />
      </div>
      <div className="stft-color-key"><div /> <span>−20</span><span>−60</span><span>−100</span></div>
    </div>
    <div className="stft-track-row stft-time-axis"><span>ms</span><div>{[0, 64, 128, 192, 256].map(t => <span key={t}>{t}</span>)}</div><span>dB/Hz</span></div>
    <label className="stft-frame-control">{copy.selectedFrame[language]} · {frameIndex + 1}/{analysis.frames.length} · {frame.centerMs.toFixed(1)} ms
      <input type="range" min="0" max={analysis.frames.length - 1} step="1" value={frameIndex} aria-label={copy.selectedFrame[language]} onChange={e => setTime(analysis.frames[Number(e.target.value)].centerMs)} />
    </label>
    <p data-testid="stft-frame-readout">{copy.currentWindow[language]}: {(frame.start / 16).toFixed(1)}–{((frame.start + windowSize) / 16).toFixed(1)} ms · Hann · {windowSize} {copy.samples[language]}</p>
    <p>{copy.spacing[language]}: {windowSize / 16} ms / {hopSize / 16} ms / {(16000 / analysis.fftSize).toFixed(3)} Hz</p>
    {hopSize >= windowSize && <p role="status">{copy.noOverlap[language]}</p>}
    <div className="stft-frame-details">
      <section><h3>{copy.windowed[language]}</h3>
        <svg role="img" aria-label={copy.selectedWindowed[language]} viewBox="0 0 800 160" preserveAspectRatio="none"><line x1="0" x2="800" y1="80" y2="80" className="stft-grid-line" /><path className="stft-pcm-line" data-testid="stft-windowed-wave" d={line(frame.windowed, 80, 72, 0)} /></svg>
        <p>{copy.timeWithin[language]} · 0–{windowSize / 16} ms</p>
      </section>
      <section><h3>{copy.spectrum[language]}</h3>
        <svg role="img" aria-label={copy.psd[language]} viewBox="0 0 800 160" preserveAspectRatio="none">{[0, 80, 160].map(y => <line key={y} x1="0" x2="800" y1={y} y2={y} className="stft-grid-line" />)}<path className="stft-spectrum-line" data-testid="stft-spectrum-path" d={line(frame.psd.map(psdDb), 160, 2, 100)} /></svg>
        <p>{copy.frequencySpectrum[language]}</p>
      </section>
    </div>
    {example === "two-tone" && <section className="stft-frame-details"><section>
      <h3>{copy.twoToneDetail[language]}</h3>
      <svg role="img" aria-label={copy.nearbyDetail[language]} viewBox="0 0 800 160" preserveAspectRatio="none">
        <path className="stft-spectrum-line" d={line(frame.psd.slice(750 * analysis.fftSize / 16000, 1375 * analysis.fftSize / 16000 + 1).map(psdDb), 160, 2, 100)} />
      </svg>
      <p>{copy.twoToneNote[language]}</p>
    </section></section>}
    <details className="stft-reading-notes"><summary>{copy.notes[language]}</summary>
      <p>{copy.note1[language]}</p>
      <p>{copy.note2[language]}</p>
      <p>{copy.note3[language]}</p>
      <p>{copy.note4[language]}</p>
      <a href="https://manual.audacityteam.org/man/spectrogram_view.html" target="_blank" rel="noreferrer">Audacity · {language === "zh" ? "时频图视图" : language === "ja" ? "スペクトログラム表示" : language === "ko" ? "스펙트로그램 보기" : "Spectrogram View"}</a>
    </details>
  </section>;
}
