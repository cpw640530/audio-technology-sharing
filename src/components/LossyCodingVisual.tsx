import { useState } from "react";
import type { Language, LocalizedText } from "../content/knowledge";
import { traditional } from "../content/traditional";

// An exact two-basis DCT-II example, not an MP3/AAC encoder.
export function transformQuantization(bits: number, weak: number) {
  if (!Number.isInteger(bits) || bits < 2 || bits > 10 || !Number.isFinite(weak) || weak < 0 || weak > 0.3) throw new RangeError("Invalid demonstration parameters");
  const coefficients = Array.from({ length: 32 }, (_, k) => k === 4 ? 2.6 : k === 5 ? weak * 4 : 0);
  const step = 8 / 2 ** bits;
  const quantized = coefficients.map(value => Math.max(-(2 ** (bits - 1)), Math.min(2 ** (bits - 1) - 1, Math.round(value / step))) * step);
  const synthesize = (values: number[]) => Array.from({ length: 32 }, (_, n) => values.reduce((sum, value, k) => sum + value * Math.sqrt((k === 0 ? 1 : 2) / 32) * Math.cos(Math.PI * (n + 0.5) * k / 32), 0));
  const original = synthesize(coefficients);
  const reconstructed = synthesize(quantized);
  const error = original.map((value, n) => reconstructed[n] - value);
  return { coefficients, quantized, original, reconstructed, error, step, rmse: Math.sqrt(error.reduce((sum, value) => sum + value * value, 0) / 32) };
}

const copy = {
  metrics: { zh: "Δ：系数量化间隔；RMSE：重建误差的均方根，不是听感评分。", "zh-Hant": traditional("Δ：系数量化间隔；RMSE：重建误差的均方根，不是听感评分。"), en: "Δ: coefficient quantization step; RMSE: root mean square reconstruction error, not a listening-quality score.", ja: "Δ：係数量子化の間隔。RMSE：再構成誤差の二乗平均平方根。聴感の評価値ではない。", ko: "Δ: 계수 양자화 간격. RMSE: 재구성 오차의 제곱평균제곱근이며 청감 점수가 아니다." },
  title: { zh: "频域有损编码：比特变少后，什么发生了变化？", "zh-Hant": traditional("频域有损编码：比特变少后，什么发生了变化？"), en: "Lossy transform coding: what changes with fewer bits?", ja: "周波数領域の非可逆符号化：ビットを減らすと？", ko: "주파수 영역 손실 코딩: 비트를 줄이면?" },
  intro: { zh: "固定 8 kHz、32 个样本：500 Hz 强分量振幅为 0.65，625 Hz 弱分量可调。采样率始终不变，只改频域系数的量化精度。", "zh-Hant": traditional("固定 8 kHz、32 个样本：500 Hz 强分量振幅为 0.65，625 Hz 弱分量可调。采样率始终不变，只改频域系数的量化精度。"), en: "Fixed 8 kHz, 32 samples: a 500 Hz component at amplitude 0.65 and an adjustable weak 625 Hz component. Sample rate stays fixed; only transform-coefficient precision changes.", ja: "8 kHz・32 サンプル固定。500 Hz の振幅は 0.65、弱い 625 Hz 成分は調整可能。標本化周波数ではなく係数量子化の精度だけを変える。", ko: "8 kHz, 32샘플 고정: 500 Hz 성분의 진폭은 0.65, 약한 625 Hz 성분은 조절 가능하다. 샘플레이트가 아닌 변환 계수의 정밀도만 바꾼다." },
  bits: { zh: "每个系数的比特数", "zh-Hant": traditional("每个系数的比特数"), en: "Bits per coefficient", ja: "係数当たりのビット数", ko: "계수당 비트 수" },
  weak: { zh: "弱分量振幅", "zh-Hant": traditional("弱分量振幅"), en: "Weak-component amplitude", ja: "弱い成分の振幅", ko: "약한 성분의 진폭" },
  original: { zh: "原始", "zh-Hant": traditional("原始"), en: "Original", ja: "元信号", ko: "원본" },
  reconstructed: { zh: "重建", "zh-Hant": traditional("重建"), en: "Reconstructed", ja: "再構成", ko: "재구성" },
  error: { zh: "误差", "zh-Hant": traditional("误差"), en: "Error", ja: "誤差", ko: "오차" },
  spectrum: { zh: "频率分量：原始与量化后", "zh-Hant": traditional("频率分量：原始与量化后"), en: "Frequency components: before and after quantization", ja: "量子化前後の周波数成分", ko: "양자화 전후 주파수 성분" },
  waveform: { zh: "波形：原始、重建与误差", "zh-Hant": traditional("波形：原始、重建与误差"), en: "Waveforms: original, reconstructed, and error", ja: "波形：元信号・再構成・誤差", ko: "파형: 원본, 재구성, 오차" },
  spectrumAxis: { zh: "横轴：频率 Hz；纵轴：余弦分量振幅，不是能量或 dB。绿柱为原始，橙柱为量化后。", "zh-Hant": traditional("横轴：频率 Hz；纵轴：余弦分量振幅，不是能量或 dB。绿柱为原始，橙柱为量化后。"), en: "X: frequency in Hz; Y: cosine-component amplitude, not energy or dB. Green: original; orange: quantized.", ja: "横軸：Hz。縦軸：余弦成分の振幅（エネルギー・dB ではない）。緑：元、橙：量子化後。", ko: "X: Hz, Y: 코사인 성분 진폭 (에너지나 dB가 아님). 초록: 원본, 주황: 양자화 후." },
  waveAxis: { zh: "横轴：时间 ms；纵轴：归一化样本值。蓝线为重建减原始的误差，三条曲线同刻度。", "zh-Hant": traditional("横轴：时间 ms；纵轴：归一化样本值。蓝线为重建减原始的误差，三条曲线同刻度。"), en: "X: time in ms; Y: normalized sample value. Blue is reconstructed minus original. All traces share a scale.", ja: "横軸：ms。縦軸：正規化サンプル値。青は再構成−元信号の誤差。全曲線は同じ目盛り。", ko: "X: ms, Y: 정규화 샘플 값. 파랑은 재구성−원본 오차이며 모든 곡선은 같은 눈금을 사용한다." },
  budget: { zh: "本块系数预算（不计头部）", "zh-Hant": traditional("本块系数预算（不计头部）"), en: "Coefficient budget per block (no headers)", ja: "ブロック係数のビット数（ヘッダ除外）", ko: "블록 계수 비트 수 (헤더 제외)" },
  masking: { zh: "听觉掩蔽是为何可以容忍部分误差的线索：强声音可能让附近较弱的声音或噪声更难察觉，但阈值取决于频率、时间、播放电平及听者。此处弱分量归零只是量化结果，不证明它听不见；真正的感知编码会估计掩蔽阈值，再分配比特。", "zh-Hant": traditional("听觉掩蔽是为何可以容忍部分误差的线索：强声音可能让附近较弱的声音或噪声更难察觉，但阈值取决于频率、时间、播放电平及听者。此处弱分量归零只是量化结果，不证明它听不见；真正的感知编码会估计掩蔽阈值，再分配比特。"), en: "Masking can make nearby weak sounds or noise harder to notice, but thresholds depend on frequency, timing, playback level, and the listener. A component rounded to zero here is not proof of inaudibility. Perceptual encoders estimate masking thresholds to guide bit allocation.", ja: "強い音は近くの弱い音や雑音を感じにくくする場合があるが、閾値は周波数・時間・再生レベル・聴者に依存する。本図のゼロへの丸めは聞こえない証明ではない。知覚符号化はマスキング閾値を推定しビット配分を決める。", ko: "강한 소리는 인접한 약한 소리나 잡음을 감지하기 어렵게 할 수 있지만 임계값은 주파수·시간·재생 레벨·청취자에 따라 다르다. 여기서 0으로 양자화되었다고 들리지 않는 것은 아니다. 지각 코덱은 마스킹 임계값을 추정해 비트를 배분한다." },
  scope: { zh: "简化教学模型：正交 DCT-II、固定系数范围 [-4, 4)、统一位数的均匀量化，再逆变换。并未模拟听觉阈值、熵编码或码流。MP3 使用混合滤波器组，AAC 使用 MDCT 等工具；本图不是它们的真实输出，也不对应某个 kbps。误差大小不等于听感质量，压缩也不是简单砍高频。", "zh-Hant": traditional("简化教学模型：正交 DCT-II、固定系数范围 [-4, 4)、统一位数的均匀量化，再逆变换。并未模拟听觉阈值、熵编码或码流。MP3 使用混合滤波器组，AAC 使用 MDCT 等工具；本图不是它们的真实输出，也不对应某个 kbps。误差大小不等于听感质量，压缩也不是简单砍高频。"), en: "Teaching model: orthonormal DCT-II, fixed coefficient range [-4, 4), uniform bit depth and quantization, then inverse transform. No masking-threshold model, entropy coding, or bitstream. MP3 uses a hybrid filter bank; AAC uses MDCT-based tools. This is not their actual output or any kbps setting. Numerical error is not perceptual quality, and compression is not simply cutting treble.", ja: "教材モデル：直交 DCT-II、係数範囲 [-4, 4)、一律ビット数・均一量子化、逆変換。聴覚閾値・エントロピー符号化・ビットストリームは扱わない。MP3 はハイブリッドフィルタバンク、AAC は MDCT 等を使う。本図は実出力や kbps 設定ではない。数値誤差は音質そのものではなく、圧縮は単純な高域除去でもない。", ko: "교육 모델: 직교 DCT-II, 고정 계수 범위 [-4, 4), 동일 비트 수와 균일 양자화 후 역변환. 마스킹 임계값·엔트로피 코딩·비트스트림은 구현하지 않는다. MP3는 하이브리드 필터뱅크, AAC는 MDCT 기반 도구를 쓴다. 실제 출력이나 특정 kbps가 아니며 수치 오차가 곧 음질은 아니다. 압축은 단순한 고역 제거가 아니다." },
} satisfies Record<string, LocalizedText>;

export function LossyCodingVisual({ language }: { language: Language }) {
  const [bits, setBits] = useState(4);
  const [weak, setWeak] = useState(0.08);
  const data = transformQuantization(bits, weak);
  const traces = [{ name: copy.original, values: data.original, tone: "original" }, { name: copy.reconstructed, values: data.reconstructed, tone: "predicted" }, { name: copy.error, values: data.error, tone: "residual" }];
  return <section className="sound-topic-section codec-inline-visual" aria-label={copy.title[language]}>
    <h2>{copy.title[language]}</h2><p>{copy.intro[language]}</p>
    <div className="codec-inline-controls">
      <label>{copy.bits[language]}: {bits}<input type="range" min="2" max="10" step="1" value={bits} onChange={event => setBits(Number(event.target.value))} /></label>
      <label>{copy.weak[language]}: {weak.toFixed(2)}<input type="range" min="0" max="0.3" step="0.01" value={weak} onChange={event => setWeak(Number(event.target.value))} /></label>
    </div>
    <h3>{copy.spectrum[language]}</h3>
    <svg className="codec-prediction-chart" viewBox="0 0 600 230" role="img" aria-label={copy.spectrum[language]}>
      {[0, 0.5, 1].map(value => <g key={value}><line className="codec-chart-grid" x1="50" x2="580" y1={192 - value * 160} y2={192 - value * 160} /><text x="42" y={196 - value * 160} textAnchor="end">{value}</text></g>)}
      {data.coefficients.map((value, k) => <g key={k}><rect fill="#226d60" x={52 + k * 16} y={192 - Math.abs(value) / 4 * 160} width="6" height={Math.abs(value) / 4 * 160} /><rect fill="#9b541c" x={59 + k * 16} y={192 - Math.abs(data.quantized[k]) / 4 * 160} width="6" height={Math.abs(data.quantized[k]) / 4 * 160} /></g>)}
      {[0, 1000, 2000, 3000, 4000].map(value => <text key={value} x={52 + value / 125 * 16} y="220" textAnchor="middle">{value}</text>)}
    </svg>
    <p className="codec-axis-note">{copy.spectrumAxis[language]}</p>
    <h3>{copy.waveform[language]}</h3>
    <div className="codec-trace-legend">{traces.map(row => <span key={row.tone} className={row.tone}>{row.name[language]}</span>)}</div>
    <svg className="codec-prediction-chart" viewBox="0 0 600 230" role="img" aria-label={copy.waveform[language]}>
      {[-1, 0, 1].map(value => <g key={value}><line className="codec-chart-grid" x1="50" x2="580" y1={112 - value * 80} y2={112 - value * 80} /><text x="42" y={116 - value * 80} textAnchor="end">{value}</text></g>)}
      {[0, 1, 2, 3].map(value => <text key={value} x={52 + value * 8 * 16} y="218" textAnchor="middle">{value}</text>)}
      {traces.map(row => <g key={row.tone} className={row.tone}><polyline points={row.values.map((value, n) => `${52 + n * 16},${112 - value * 80}`).join(" ")} /></g>)}
    </svg>
    <p className="codec-axis-note">{copy.waveAxis[language]}</p>
    <output className="codec-inline-result">{copy.budget[language]}: 32 × {bits} = {32 * bits} bit<br />Δ = {data.step.toFixed(5)}; RMSE = {data.rmse.toFixed(5)}<br />500 Hz: 0.65 → {(data.quantized[4] / 4).toFixed(4)}; 625 Hz: {weak.toFixed(2)} → {(data.quantized[5] / 4).toFixed(4)}</output>
    <p className="codec-axis-note">{copy.metrics[language]}</p>
    <p>{copy.masking[language]}</p><p className="sound-topic-note">{copy.scope[language]} <a href="https://www.audiolabs-erlangen.de/content/resources/aesCodingTutorial/media/tutorial/aes.pdf" target="_blank" rel="noreferrer">AudioLabs / AES</a></p>
  </section>;
}
