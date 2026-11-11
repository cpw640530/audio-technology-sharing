import { useState } from "react";
import type { Language, LocalizedText } from "../content/knowledge";
import { traditional } from "../content/traditional";

const copy = {
  flacIntro: { zh: "PCM 是一串记录声音的整数。相邻样本往往比较接近：与其反复保存较大的数，不如根据前面的数预测下一个，再完整保存“实际值与预测值相差多少”。这个差值就叫残差。预测可以不准，只要差值没有丢，还原就不会错。", "zh-Hant": traditional("PCM 是一串记录声音的整数。相邻样本往往比较接近：与其反复保存较大的数，不如根据前面的数预测下一个，再完整保存“实际值与预测值相差多少”。这个差值就叫残差。预测可以不准，只要差值没有丢，还原就不会错。"), en: "Integer PCM is a sequence of numbers describing sound. Neighboring samples are often similar. Instead of repeatedly storing large values, predict the next one from earlier samples and keep the exact difference from the actual value. That difference is the residual. The prediction may be wrong; keeping the full difference makes recovery exact.", ja: "整数 PCM は音を表す数列。隣り合う値は近いことが多いため、前の値から次を予測し、実際の値との差を正確に保存する。この差が残差。予測が外れても、差を失わなければ完全に復元できる。", ko: "정수 PCM은 소리를 표현하는 숫자의 나열이다. 이웃 샘플은 값이 비슷한 경우가 많다. 이전 값으로 다음 값을 예측하고 실제 값과의 차이를 정확히 저장한다. 이 차이가 잔차다. 예측이 틀려도 차이를 모두 보존하면 정확하게 복원할 수 있다." },
  inspect: { zh: "当前样本 n", "zh-Hant": traditional("当前样本 n"), en: "Current sample n", ja: "現在のサンプル n", ko: "현재 샘플 n" },
  guess: { zh: "先预测下一个数", "zh-Hant": traditional("先预测下一个数"), en: "Predict the next value", ja: "次の値を予測", ko: "다음 값 예측" },
  difference: { zh: "编码：保存差多少", "zh-Hant": traditional("编码：保存差多少"), en: "Encode: keep the difference", ja: "符号化：差を保存", ko: "인코딩: 차이 저장" },
  recover: { zh: "解码：把差值加回来", "zh-Hant": traditional("解码：把差值加回来"), en: "Decode: add the difference back", ja: "復号：差を足し戻す", ko: "디코딩: 차이를 다시 더함" },
  firstRule: { zh: "沿用前一个已知样本作为预测值。", "zh-Hant": traditional("沿用前一个已知样本作为预测值。"), en: "Use the previous known sample as the prediction.", ja: "直前の既知サンプルを予測値にする。", ko: "직전의 알려진 샘플을 예측값으로 사용한다." },
  secondRule: { zh: "把前两个样本的增减趋势延续一次：前一个值 + 上一次的变化量。", "zh-Hant": traditional("把前两个样本的增减趋势延续一次：前一个值 + 上一次的变化量。"), en: "Extend the previous change: previous value + the change between the last two samples.", ja: "直前の変化を延長：前の値 + 直前 2 サンプルの差。", ko: "직전 변화량을 연장한다: 이전 값 + 직전 두 샘플의 차이." },
  differenceRule: { zh: "实际值 − 预测值 = 残差。正数表示少猜了，负数表示多猜了。", "zh-Hant": traditional("实际值 − 预测值 = 残差。正数表示少猜了，负数表示多猜了。"), en: "Actual − predicted = residual. Positive means the guess was too low; negative means too high.", ja: "実際の値 − 予測値 = 残差。正なら予測が小さく、負なら大きかった。", ko: "실제 값 − 예측값 = 잔차. 양수는 예측이 낮았고 음수는 높았다는 뜻이다." },
  recoverRule: { zh: "用已经还原的样本做同样的预测，再加上保存的残差，得到原数。", "zh-Hant": traditional("用已经还原的样本做同样的预测，再加上保存的残差，得到原数。"), en: "Make the same prediction from already restored samples, then add the stored residual to recover the original.", ja: "復元済みの値から同じ予測を計算し、保存した残差を足すと元の値に戻る。", ko: "이미 복원한 샘플로 같은 예측을 계산하고 저장된 잔차를 더하면 원래 값으로 돌아온다." },
  warmups: { zh: "先直接保存起始值", "zh-Hant": traditional("先直接保存起始值"), en: "Store starting values directly", ja: "初期値はそのまま保存", ko: "시작 값은 그대로 저장" },
  differences: { zh: "后续只需保存残差", "zh-Hant": traditional("后续只需保存残差"), en: "Then store residuals", ja: "以降は残差を保存", ko: "이후에는 잔차 저장" },
  whySmaller: { zh: "为什么可能省空间？这里的数字个数并没有减少。省的是二进制位数：当残差大多接近 0，Rice 等编码可用较短的码表示它们；预测规则和起始值也必须保存。若变化很不规则、残差很大，未必能省，FLAC 也可以选择直接保存样本。", "zh-Hant": traditional("为什么可能省空间？这里的数字个数并没有减少。省的是二进制位数：当残差大多接近 0，Rice 等编码可用较短的码表示它们；预测规则和起始值也必须保存。若变化很不规则、残差很大，未必能省，FLAC 也可以选择直接保存样本。"), en: "Why can this save space? There are still as many numbers. The saving is in bits: Rice coding can give short codes to residuals clustered near zero. The prediction rule and starting values must also be stored. Irregular signals with large residuals may not save space; FLAC can store samples directly instead.", ja: "数の個数は減らない。残差が 0 付近に集まれば、Rice 符号などで短いビット列にできる。予測方式と初期値も保存が必要。不規則な変化で残差が大きいと省容量にならず、FLAC は直接保存も選べる。", ko: "숫자의 개수는 줄지 않는다. 잔차가 0 근처에 모이면 Rice 코딩 등으로 짧은 비트열을 사용할 수 있다. 예측 규칙과 시작 값도 저장해야 한다. 불규칙한 신호에서 잔차가 크면 절약되지 않을 수 있고, FLAC은 샘플을 그대로 저장할 수도 있다." },
  pcm: { zh: "PCM：规格如何变成数据量", "zh-Hant": traditional("PCM：规格如何变成数据量"), en: "PCM: from specifications to data size", ja: "PCM：仕様からデータ量へ", ko: "PCM: 사양에서 데이터 크기로" },
  rate: { zh: "采样率", "zh-Hant": traditional("采样率"), en: "Sample rate", ja: "サンプルレート", ko: "샘플레이트" },
  depth: { zh: "位深", "zh-Hant": traditional("位深"), en: "Bit depth", ja: "ビット深度", ko: "비트 깊이" },
  channels: { zh: "声道数", "zh-Hant": traditional("声道数"), en: "Channels", ja: "チャンネル数", ko: "채널 수" },
  bits: { zh: "一个声道、一个样本：每格代表 1 bit 的存储位，不代表实际二进制值。", "zh-Hant": traditional("一个声道、一个样本：每格代表 1 bit 的存储位，不代表实际二进制值。"), en: "One sample in one channel: each cell is one storage bit, not an actual binary value.", ja: "1 チャンネルの 1 サンプル。各マスは 1 bit の記憶領域で、実際の二進値ではない。", ko: "한 채널의 한 샘플: 각 칸은 저장 비트 하나이며 실제 이진 값이 아니다." },
  timeline: { zh: "1 ms 时间片：每格是该声道的一个样本，越多表示采样越密。", "zh-Hant": traditional("1 ms 时间片：每格是该声道的一个样本，越多表示采样越密。"), en: "A 1 ms interval: each cell is one sample in that channel. More cells mean denser sampling.", ja: "1 ms の区間。各マスはそのチャンネルの 1 サンプル。数が多いほど密に標本化する。", ko: "1 ms 구간: 각 칸은 해당 채널의 샘플 하나다. 칸이 많을수록 샘플링이 촘촘하다." },
  size: { zh: "1 秒 PCM 数据量", "zh-Hant": traditional("1 秒 PCM 数据量"), en: "PCM size for 1 second", ja: "1 秒の PCM データ量", ko: "1초 PCM 크기" },
  pcmNote: { zh: "采用紧密存储的整数 PCM，1 kB = 1000 字节，不计文件头、对齐填充或协议开销。改变规格是在改变原始数据量，不是在执行压缩；这里只画存储格子，不模拟声音的带宽或量化误差。", "zh-Hant": traditional("采用紧密存储的整数 PCM，1 kB = 1000 字节，不计文件头、对齐填充或协议开销。改变规格是在改变原始数据量，不是在执行压缩；这里只画存储格子，不模拟声音的带宽或量化误差。"), en: "Assumes packed integer PCM, 1 kB = 1000 bytes, excluding headers, padding, and protocol overhead. Changing specifications changes raw size, not codec compression. Cells illustrate storage only, not bandwidth or quantization error.", ja: "整数 PCM の密な格納を仮定。1 kB = 1000 byte。ヘッダ・パディング・通信の追加分は除外する。仕様変更は元の量の変更であり圧縮ではない。マスは記憶領域のみを示し、帯域や量子化誤差は再現しない。", ko: "패킹된 정수 PCM, 1 kB = 1000바이트 기준으로 헤더·패딩·프로토콜 오버헤드는 제외한다. 사양 변경은 원본 크기를 바꾸며 코덱 압축이 아니다. 칸은 저장 공간만 나타내고 대역폭이나 양자화 오차는 모사하지 않는다." },
  flac: { zh: "FLAC 原理：预测 + 残差 = 原样本", "zh-Hant": traditional("FLAC 原理：预测 + 残差 = 原样本"), en: "FLAC principle: prediction + residual = original", ja: "FLAC の原理：予測 + 残差 = 元サンプル", ko: "FLAC 원리: 예측 + 잔차 = 원본" },
  input: { zh: "输入样本", "zh-Hant": traditional("输入样本"), en: "Input samples", ja: "入力サンプル", ko: "입력 샘플" },
  smooth: { zh: "平滑变化", "zh-Hant": traditional("平滑变化"), en: "Smooth signal", ja: "滑らかな信号", ko: "완만한 신호" },
  irregular: { zh: "不规则变化", "zh-Hant": traditional("不规则变化"), en: "Irregular signal", ja: "不規則な信号", ko: "불규칙한 신호" },
  predictor: { zh: "预测方式", "zh-Hant": traditional("预测方式"), en: "Predictor", ja: "予測方式", ko: "예측 방식" },
  previous: { zh: "一阶：沿用前一个样本", "zh-Hant": traditional("一阶：沿用前一个样本"), en: "Order 1: previous sample", ja: "1 次：前サンプルを使用", ko: "1차: 이전 샘플 사용" },
  linear: { zh: "二阶：沿用前两个样本的趋势", "zh-Hant": traditional("二阶：沿用前两个样本的趋势"), en: "Order 2: extend the previous trend", ja: "2 次：直前の傾きを延長", ko: "2차: 이전 추세 연장" },
  original: { zh: "原样本", "zh-Hant": traditional("原样本"), en: "Original", ja: "元サンプル", ko: "원본" },
  predicted: { zh: "预测值", "zh-Hant": traditional("预测值"), en: "Prediction", ja: "予測値", ko: "예측값" },
  residual: { zh: "残差", "zh-Hant": traditional("残差"), en: "Residual", ja: "残差", ko: "잔차" },
  decoded: { zh: "恢复值", "zh-Hant": traditional("恢复值"), en: "Restored", ja: "復元値", ko: "복원값" },
  axis: { zh: "横轴：样本序号 n；纵轴：整数样本值（非 dB）。三条曲线共用同一刻度。", "zh-Hant": traditional("横轴：样本序号 n；纵轴：整数样本值（非 dB）。三条曲线共用同一刻度。"), en: "X: sample index n. Y: integer sample value, not dB. All three traces use the same scale.", ja: "横軸：サンプル番号 n。縦軸：整数サンプル値（dB ではない）。3 本は同じ目盛りを使う。", ko: "X: 샘플 인덱스 n. Y: 정수 샘플 값이며 dB가 아니다. 세 곡선은 같은 눈금을 사용한다." },
  restored: { zh: "8 / 8 个样本精确还原", "zh-Hant": traditional("8 / 8 个样本精确还原"), en: "8 / 8 samples restored exactly", ja: "8 / 8 サンプルを完全復元", ko: "8 / 8 샘플 정확히 복원" },
  flacNote: { zh: "“—”是直接保存的起始样本，不参与该处预测；解码端仅用起始值、预测器和残差逐点恢复。真实 FLAC 还要选择分块、预测器和残差编码方式（如 Rice 编码）；残差较小通常有利于压缩，但本图没有执行 FLAC 编码，不给出虚构的压缩率。", "zh-Hant": traditional("“—”是直接保存的起始样本，不参与该处预测；解码端仅用起始值、预测器和残差逐点恢复。真实 FLAC 还要选择分块、预测器和残差编码方式（如 Rice 编码）；残差较小通常有利于压缩，但本图没有执行 FLAC 编码，不给出虚构的压缩率。"), en: "A dash marks a warm-up sample stored directly, without prediction at that index. Decoding uses only warm-ups, the predictor, and residuals. FLAC also selects blocks, predictors, and residual coding such as Rice coding. Smaller residuals often help compression, but this is not a FLAC encoder and reports no compression ratio.", ja: "「—」は予測せず直接保存する初期サンプル。復号は初期値・予測器・残差だけから順に行う。実際の FLAC はブロック・予測器・Rice などの残差符号化を選ぶ。小さな残差は圧縮に有利だが、本図は実際の FLAC 符号化や圧縮率を示すものではない。", ko: "대시는 직접 저장하는 초기 샘플로 해당 위치에서 예측하지 않는다. 복호화는 초기값·예측기·잔차만 사용한다. 실제 FLAC은 블록·예측기·Rice 등의 잔차 코딩을 선택한다. 작은 잔차는 압축에 유리하지만 이 그림은 FLAC 인코더가 아니며 압축비를 제시하지 않는다." },
} satisfies Record<string, LocalizedText>;

export function PcmStorageVisual({ language }: { language: Language }) {
  const [rate, setRate] = useState(48000);
  const [depth, setDepth] = useState(16);
  const [channels, setChannels] = useState(2);
  const bitrate = rate * depth * channels;
  return <section className="sound-topic-section codec-inline-visual" aria-label={copy.pcm[language]}>
    <h2>{copy.pcm[language]}</h2>
    <div className="codec-inline-controls">
      <label>{copy.rate[language]}<select value={rate} onChange={event => setRate(Number(event.target.value))}>{[8000, 16000, 48000, 96000].map(value => <option key={value} value={value}>{value / 1000} kHz</option>)}</select></label>
      <label>{copy.depth[language]}<select value={depth} onChange={event => setDepth(Number(event.target.value))}>{[8, 16, 24, 32].map(value => <option key={value} value={value}>{value} bit</option>)}</select></label>
      <label>{copy.channels[language]}<select value={channels} onChange={event => setChannels(Number(event.target.value))}>{[1, 2].map(value => <option key={value} value={value}>{value}</option>)}</select></label>
    </div>
    <p>{copy.bits[language]}</p>
    <div className="codec-bit-cells" aria-label={`${depth} bit`}>{Array.from({ length: depth }, (_, index) => <span key={index} />)}</div>
    <p>{copy.timeline[language]}</p>
    <svg className="codec-sample-cells" viewBox={`0 0 600 ${channels * 36}`} role="img" aria-label={`${rate / 1000} × ${channels}`}>
      {Array.from({ length: channels }, (_, channel) => <g key={channel}>
        <text x="0" y={channel * 36 + 21}>CH {channel + 1}</text>
        {Array.from({ length: rate / 1000 }, (_, index) => <rect key={index} x={60 + index * 5.5} y={channel * 36 + 6} width="4" height="23" />)}
      </g>)}
    </svg>
    <output className="codec-inline-result" aria-label={copy.size[language]}>
      <strong>{rate / 1000} kHz × {depth} bit × {channels} = {bitrate / 1000} kbps</strong>
      <span>{copy.size[language]}: {bitrate / 8 / 1000} kB</span>
    </output>
    <p className="sound-topic-note">{copy.pcmNote[language]}</p>
  </section>;
}

const sampleSets = { smooth: [100, 102, 104, 107, 109, 110, 112, 114], irregular: [100, -50, 90, -80, 20, 110, -100, 60] };

export function FlacPredictionVisual({ language }: { language: Language }) {
  const [signal, setSignal] = useState<keyof typeof sampleSets>("smooth");
  const [order, setOrder] = useState(1);
  const [selected, setSelected] = useState(3);
  const index = Math.max(order, selected);
  const original = sampleSets[signal];
  const predicted = original.map((_, index) => index < order ? null : order === 1 ? original[index - 1] : 2 * original[index - 1] - original[index - 2]);
  const residual = original.map((value, index) => predicted[index] === null ? null : value - predicted[index]!);
  const decoded: number[] = [];
  // Decode from warm-ups and reconstructed history, not from the encoder's input history.
  original.forEach((value, index) => {
    decoded.push(index < order ? value : (order === 1 ? decoded[index - 1] : 2 * decoded[index - 1] - decoded[index - 2]) + residual[index]!);
  });
  const limit = Math.ceil(Math.max(...original.map(Math.abs), ...predicted.map(value => Math.abs(value ?? 0)), ...residual.map(value => Math.abs(value ?? 0))) / 50) * 50;
  const x = (index: number) => 56 + index * 72;
  const y = (value: number) => 112 - value / limit * 80;
  const traces = [{ name: copy.original, values: original, tone: "original" }, { name: copy.predicted, values: predicted, tone: "predicted" }, { name: copy.residual, values: residual, tone: "residual" }];
  return <section className="sound-topic-section codec-inline-visual" aria-label={copy.flac[language]}>
    <h2>{copy.flac[language]}</h2>
    <p>{copy.flacIntro[language]}</p>
    <div className="codec-inline-controls">
      <label>{copy.input[language]}<select value={signal} onChange={event => setSignal(event.target.value as keyof typeof sampleSets)}><option value="smooth">{copy.smooth[language]}</option><option value="irregular">{copy.irregular[language]}</option></select></label>
      <label>{copy.predictor[language]}<select value={order} onChange={event => setOrder(Number(event.target.value))}><option value="1">{copy.previous[language]}</option><option value="2">{copy.linear[language]}</option></select></label>
      <label>{copy.inspect[language]}: {index}<input type="range" min={order} max="7" step="1" value={index} onChange={event => setSelected(Number(event.target.value))} /></label>
    </div>
    <ol className="codec-flac-steps">
      <li><h3>1. {copy.guess[language]}</h3><p>{(order === 1 ? copy.firstRule : copy.secondRule)[language]}</p><strong>{order === 1 ? `${original[index - 1]} → ${predicted[index]}` : `${original[index - 1]} + (${original[index - 1]} − (${original[index - 2]})) = ${predicted[index]}`}</strong></li>
      <li><h3>2. {copy.difference[language]}</h3><p>{copy.differenceRule[language]}</p><strong>{original[index]} − ({predicted[index]}) = {residual[index]}</strong></li>
      <li><h3>3. {copy.recover[language]}</h3><p>{copy.recoverRule[language]}</p><strong>{predicted[index]} + ({residual[index]}) = {decoded[index]}</strong></li>
    </ol>
    <div className="codec-inline-result codec-flac-storage">
      <span>{copy.warmups[language]}: <strong>{original.slice(0, order).join(", ")}</strong></span>
      <span>{copy.differences[language]}: <strong>{residual.slice(order).join(", ")}</strong></span>
    </div>
    <p>{copy.whySmaller[language]}</p>
    <div className="codec-trace-legend">{traces.map(trace => <span className={trace.tone} key={trace.tone}>{trace.name[language]}</span>)}</div>
    <svg className="codec-prediction-chart" viewBox="0 0 600 230" role="img" aria-label={copy.flac[language]}>
      <rect className="codec-flac-selected" x={x(index) - 15} y="20" width="30" height="180" />
      {[-limit, 0, limit].map(value => <g key={value}><line className="codec-chart-grid" x1="50" x2="575" y1={y(value)} y2={y(value)} /><text x="48" y={y(value) + 4} textAnchor="end">{value}</text></g>)}
      {original.map((_, index) => <text key={index} x={x(index)} y="218" textAnchor="middle">{index}</text>)}
      {traces.map(trace => <g className={trace.tone} key={trace.tone}>
        <polyline points={trace.values.flatMap((value, index) => value === null ? [] : [`${x(index)},${y(value)}`]).join(" ")} />
        {trace.values.map((value, n) => value === null ? null : <circle key={n} cx={x(n)} cy={y(value)} r={n === index ? 5 : 3} />)}
      </g>)}
    </svg>
    <p className="codec-axis-note">{copy.axis[language]}</p>
    <div className="codec-sample-table-scroll" tabIndex={0} role="region" aria-label={copy.decoded[language]}>
      <table className="codec-sample-table"><thead><tr><th scope="col">n</th>{original.map((_, index) => <th scope="col" key={index}>{index}</th>)}</tr></thead>
        <tbody>{[...traces, { name: copy.decoded, values: decoded, tone: "decoded" }].map(trace => <tr key={trace.tone}><th scope="row">{trace.name[language]}</th>{trace.values.map((value, n) => <td key={n} className={n === index ? "codec-flac-current" : undefined}>{value ?? "—"}</td>)}</tr>)}</tbody>
      </table>
    </div>
    <output className="codec-inline-result">{copy.restored[language]}</output>
    <p className="sound-topic-note">{copy.flacNote[language]} <a href="https://www.rfc-editor.org/rfc/rfc9639.html#section-4.3" target="_blank" rel="noreferrer">RFC 9639</a></p>
  </section>;
}
