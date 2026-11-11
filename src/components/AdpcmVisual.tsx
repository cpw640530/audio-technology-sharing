import { useState } from "react";
import type { Language, LocalizedText } from "../content/knowledge";
import { traditional } from "../content/traditional";
import { encodeImaTrace } from "./imaAdpcm";

const copy = {
  title: { zh: "IMA ADPCM：差分量化如何产生误差", "zh-Hant": traditional("IMA ADPCM：差分量化如何产生误差"), en: "IMA ADPCM: how difference quantization creates error", ja: "IMA ADPCM：差分量子化による誤差", ko: "IMA ADPCM: 차분 양자화의 오차" },
  amplitude: { zh: "输入振幅（16-bit PCM 整数值）", "zh-Hant": traditional("输入振幅（16-bit PCM 整数值）"), en: "Input amplitude (16-bit PCM integer)", ja: "入力振幅（16-bit PCM 整数）", ko: "입력 진폭 (16-bit PCM 정수)" },
  index: { zh: "初始步长表索引", "zh-Hant": traditional("初始步长表索引"), en: "Initial step-table index", ja: "初期ステップ表インデックス", ko: "초기 스텝 테이블 인덱스" },
  position: { zh: "查看样本序号 n", "zh-Hant": traditional("查看样本序号 n"), en: "Inspect sample index n", ja: "サンプル番号 n を選択", ko: "샘플 인덱스 n 선택" },
  original: { zh: "原样本", "zh-Hant": traditional("原样本"), en: "Original", ja: "元サンプル", ko: "원본" },
  prediction: { zh: "预测与差值", "zh-Hant": traditional("预测与差值"), en: "Predict and subtract", ja: "予測と差分", ko: "예측과 차분" },
  code: { zh: "4-bit 码字", "zh-Hant": traditional("4-bit 码字"), en: "4-bit code", ja: "4-bit 符号", ko: "4-bit 코드" },
  restored: { zh: "重建值", "zh-Hant": traditional("重建值"), en: "Reconstructed", ja: "再構成値", ko: "재구성값" },
  error: { zh: "误差（重建 − 原始）", "zh-Hant": traditional("误差（重建 − 原始）"), en: "Error (reconstructed − original)", ja: "誤差（再構成 − 元値）", ko: "오차 (재구성 − 원본)" },
  axis: { zh: "横轴：样本序号 n；纵轴：整数样本值，三条曲线共用刻度。连线只辅助观察离散样本，不是 DAC 重建。", "zh-Hant": traditional("横轴：样本序号 n；纵轴：整数样本值，三条曲线共用刻度。连线只辅助观察离散样本，不是 DAC 重建。"), en: "X: sample index n; Y: integer sample value, shared by all traces. Lines connect discrete samples for inspection, not DAC reconstruction.", ja: "横軸：サンプル番号 n。縦軸：整数値、全曲線共通。線は離散点の観察用で DAC 再構成ではない。", ko: "X: 샘플 인덱스 n, Y: 정수 샘플 값으로 모든 곡선이 같은 눈금을 쓴다. 연결선은 관찰용이며 DAC 재구성이 아니다." },
  adaptation: { zh: "步长与索引变化（当前 → 下一样本）", "zh-Hant": traditional("步长与索引变化（当前 → 下一样本）"), en: "Step and index update (current → next sample)", ja: "ステップとインデックス（現在 → 次）", ko: "스텝과 인덱스 갱신 (현재 → 다음)" },
  note: { zh: "首样本作为初始预测值直接保存；后续预测器沿用前一个重建值，而非前一个原样本。码字由 1 个符号位和 3 个幅度位组成，表示差分量化结果，不是截取 PCM 的 4 位。差值相对当前步长较大时，码字会提高后续步长，较小时会降低；初始索引大并不保证误差更小。与上面的 FLAC 残差完整保存不同，这里通常不能精确还原。", "zh-Hant": traditional("首样本作为初始预测值直接保存；后续预测器沿用前一个重建值，而非前一个原样本。码字由 1 个符号位和 3 个幅度位组成，表示差分量化结果，不是截取 PCM 的 4 位。差值相对当前步长较大时，码字会提高后续步长，较小时会降低；初始索引大并不保证误差更小。与上面的 FLAC 残差完整保存不同，这里通常不能精确还原。"), en: "The first sample is stored as the initial predictor. Later predictions use the previous reconstructed value, not the original. Each code has one sign and three magnitude bits, not four bits cut from PCM. Coded differences large relative to the current step increase the next step; small ones reduce it. A higher initial index does not guarantee lower error. Unlike exact FLAC residual coding above, reconstruction is generally lossy.", ja: "先頭サンプルは初期予測値として保存する。以後は直前の元値ではなく再構成値で予測する。符号は符号 1 bit と大きさ 3 bit で、PCM の 4 bit を切り取る処理ではない。現在のステップに対して符号化差分が大きければ次のステップが増え、小さければ減る。初期インデックスが大きくても低誤差とは限らず、上の FLAC と異なり通常は完全復元できない。", ko: "첫 샘플은 초기 예측값으로 저장한다. 이후에는 원본이 아닌 이전 재구성값으로 예측한다. 코드는 부호 1 bit와 크기 3 bit이며 PCM의 4 bit를 잘라낸 것이 아니다. 현재 스텝에 비해 큰 코딩 차분은 다음 스텝을 키우고 작은 값은 줄인다. 높은 초기 인덱스가 작은 오차를 보장하지 않으며 위 FLAC과 달리 일반적으로 손실이 있다." },
  scope: { zh: "本图执行 IMA/DVI 样本级量化与解码规则，未打包 WAV 或导出音频。每个后续样本为 4 bit；块头、首样本和状态也需存储，所以短片段不能直接声称文件缩小到 1/4。", "zh-Hant": traditional("本图执行 IMA/DVI 样本级量化与解码规则，未打包 WAV 或导出音频。每个后续样本为 4 bit；块头、首样本和状态也需存储，所以短片段不能直接声称文件缩小到 1/4。"), en: "Uses IMA/DVI sample-level quantization and decoding, without WAV packaging or audio export. Later samples use 4 bits each; headers, the first sample, and state also take space, so a short clip is not a guaranteed 4:1 file reduction.", ja: "IMA/DVI のサンプル量子化・復号規則を実行する。WAV 化や音声出力はしない。後続は各 4 bit だがヘッダ・初期値・状態も必要で、短い区間のファイルが必ず 1/4 になるわけではない。", ko: "IMA/DVI 샘플 양자화와 복호화 규칙을 실행하며 WAV 포장이나 오디오 내보내기는 하지 않는다. 후속 샘플은 4 bit지만 헤더·초기 샘플·상태도 필요하므로 짧은 파일이 반드시 1/4이 되지는 않는다." },
} satisfies Record<string, LocalizedText>;

export function AdpcmVisual({ language }: { language: Language }) {
  const [amplitude, setAmplitude] = useState(4000);
  const [initialIndex, setInitialIndex] = useState(40);
  const [position, setPosition] = useState(5);
  const original = Array.from({ length: 16 }, (_, n) => Math.round(amplitude * Math.sin(n * Math.PI / 8)));
  const trace = encodeImaTrace(original, initialIndex);
  const reconstructed = [original[0], ...trace.map(row => row.reconstructed)];
  const error = original.map((value, n) => reconstructed[n] - value);
  const selected = trace[position - 1];
  const limit = Math.ceil(Math.max(amplitude, ...reconstructed.map(Math.abs), ...error.map(Math.abs)) / 1000) * 1000;
  const x = (n: number) => 60 + n * 34;
  const y = (value: number) => 112 - value / limit * 80;
  const traces = [{ name: copy.original, values: original, tone: "original" }, { name: copy.restored, values: reconstructed, tone: "predicted" }, { name: copy.error, values: error, tone: "residual" }];
  const stages = [
    { name: copy.original, value: `x[${position}] = ${selected.original}` },
    { name: copy.prediction, value: `${selected.original} − (${selected.prediction}) = ${selected.difference}` },
    { name: copy.code, value: selected.code.toString(2).padStart(4, "0") },
    { name: copy.restored, value: `${selected.prediction} + (${selected.reconstructed - selected.prediction}) = ${selected.reconstructed}` },
    { name: copy.error, value: String(selected.error) },
  ];
  return <section className="sound-topic-section codec-inline-visual" aria-label={copy.title[language]}>
    <h2>{copy.title[language]}</h2>
    <div className="codec-inline-controls">
      <label>{copy.amplitude[language]}: {amplitude}<input type="range" min="500" max="12000" step="500" value={amplitude} onChange={event => setAmplitude(Number(event.target.value))} /></label>
      <label>{copy.index[language]}: {initialIndex}<input type="range" min="0" max="88" step="1" value={initialIndex} onChange={event => setInitialIndex(Number(event.target.value))} /></label>
      <label>{copy.position[language]}<select value={position} onChange={event => setPosition(Number(event.target.value))}>{trace.map((_, n) => <option key={n} value={n + 1}>{n + 1}</option>)}</select></label>
    </div>
    <div className="codec-trace-legend">{traces.map(row => <span key={row.tone} className={row.tone}>{row.name[language]}</span>)}</div>
    <svg className="codec-prediction-chart" viewBox="0 0 600 230" role="img" aria-label={copy.title[language]}>
      {[-limit, 0, limit].map(value => <g key={value}><line className="codec-chart-grid" x1="55" x2="580" y1={y(value)} y2={y(value)} /><text x="50" y={y(value) + 4} textAnchor="end">{value === 0 ? 0 : `${value / 1000}k`}</text></g>)}
      <line className="codec-adpcm-selection" x1={x(position)} x2={x(position)} y1="24" y2="196" />
      {original.map((_, n) => n % 3 === 0 ? <text key={n} x={x(n)} y="218" textAnchor="middle">{n}</text> : null)}
      {traces.map(row => <g key={row.tone} className={row.tone}><polyline points={row.values.map((value, n) => `${x(n)},${y(value)}`).join(" ")} />{row.values.map((value, n) => <circle key={n} cx={x(n)} cy={y(value)} r={n === position ? 5 : 2.5} />)}</g>)}
    </svg>
    <p className="codec-axis-note">{copy.axis[language]} k = 1000.</p>
    <ol className="codec-adpcm-steps">{stages.map(stage => <li key={stage.name.en}><strong>{stage.name[language]}</strong><code>{stage.value}</code></li>)}</ol>
    <output className="codec-inline-result">{copy.adaptation[language]}: step = {selected.step}; index = {selected.index} → {selected.nextIndex}</output>
    <p>{copy.note[language]}</p>
    <p className="sound-topic-note">{copy.scope[language]} <a href="https://www.cs.columbia.edu/~hgs/audio/dvi/IMA_ADPCM.pdf" target="_blank" rel="noreferrer">IMA/DVI reference</a></p>
  </section>;
}
