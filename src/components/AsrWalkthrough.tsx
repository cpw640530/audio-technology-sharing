import { useState } from "react";
import { RnntWalkthrough } from "./RnntWalkthrough";
import { AttentionAsrWalkthrough } from "./AttentionAsrWalkthrough";
import type { Language } from "../content/knowledge";

const tokens = ["blank", "你", "好", "妈"];
const examples = [[0, 1, 1, 0, 2, 2], [0, 3, 3, 0, 3, 3]];

export function collapseCtc(path: number[]) {
  const merged = path.filter((token, i) => i === 0 || token !== path[i - 1]);
  return { merged, text: merged.filter(token => token !== 0).map(token => tokens[token]).join("") };
}

export function AsrWalkthrough({ language }: { language: Language }) {
  const t = (zh: string, en: string) => language === "zh" ? zh : en;
  const [step, setStep] = useState(0);
  const [example, setExample] = useState(0);
  const [frame, setFrame] = useState(3);
  const [blankLogit, setBlankLogit] = useState(3);
  const probabilities = examples[example].map((winner, i) => {
    const logits: number[] = tokens.map((_, token) => token === winner ? 3 : 0);
    if (i === 3) { logits[0] = blankLogit; logits[examples[example][2]] = 2; }
    const exp = logits.map(value => Math.exp(value - Math.max(...logits)));
    const sum = exp.reduce((a, b) => a + b, 0);
    return exp.map(value => value / sum);
  });
  const path = probabilities.map(row => row.indexOf(Math.max(...row)));
  const decoded = collapseCtc(path);
  const names = [t("声学特征", "Acoustic features"), t("模型与 token", "Model and tokens"), t("CTC 解码", "CTC decoding"), t("RNN-T 流式识别", "RNN-T streaming"), t("注意力 Encoder–Decoder", "Attention encoder-decoder")];
  const sequence = (values: number[]) => values.map(token => tokens[token]).join(" → ");
  return <section className="ai-denoise-walkthrough" aria-label={t("ASR 逐步可视化", "ASR walkthrough")}>
    <h2>{t("声音怎样变成文字：CTC 与 RNN-T", "How sound becomes text: CTC and RNN-T")}</h2>
    <p>{t("从声学特征到文字，比较 CTC 对齐与 RNN-T 输出机制。以下为人工教学示例，不是真实录音的推理结果。Whisper 等注意力编码器–解码器属于另一条路线。", "Compare CTC alignment and RNN-T emission from acoustic features to text. These are hand-built teaching examples, not inference on recorded speech. Attention encoder-decoders such as Whisper follow another route.")}</p>
    <div className="robot-buttons">{names.map((name, i) => <button key={name} aria-pressed={step === i} onClick={() => setStep(i)}>{i + 1}. {name}</button>)}</div>
    <h3>{names[step]}</h3>
    {step === 3 && <RnntWalkthrough language={language} />}
    {step === 4 && <AttentionAsrWalkthrough language={language} />}
    {step === 0 && <>
      <ol className="denoise-head-flow">
        <li><strong>{t("16 kHz 单声道 PCM", "16 kHz mono PCM")}</strong><p>{t("每秒 16000 个振幅样本，样本本身没有汉字。以 25 ms 窗、10 ms 步长为例，每帧取 400 个样本，每次移动 160 个样本。", "16,000 amplitude samples per second contain no characters by themselves. With a 25 ms window and 10 ms hop, each frame has 400 samples and advances by 160 samples.")}</p></li>
        <li><strong>STFT → {t("功率谱", "Power spectrum")} → Mel → log</strong><p>{t("对每帧加窗和 FFT，取模平方；Mel 滤波器组将频率能量加权汇总，再取对数。每帧得到一组特征，例如 80 维；80 是特征数，不是 80 个字。", "Window and FFT each frame, then square the magnitude. A Mel filter bank aggregates spectral power before taking logs. A frame may produce 80 features, not 80 characters.")}</p><code>F[t,m] = log(ε + Σk H[m,k] |X[t,k]|²)</code></li>
        <li><strong>Encoder → {t("上下文表示", "Contextual representation")}</strong><p>{t("卷积提取局部变化，注意力或循环网络整合上下文。编码器可能下采样，因此一个输出步不一定对应一个 10 ms 输入帧。MFCC 是另一种表示，不是 log-Mel 后的必经步骤。", "Convolutions capture local changes; attention or recurrent layers incorporate context. Encoder subsampling means one output step need not equal one 10 ms input frame. MFCCs are an alternative representation, not a mandatory step after log-Mel.")}</p></li>
      </ol>
    </>}
    {step > 0 && step < 3 && <>
      <p>{step === 1 ? t("编码器输出 hₜ，经训练得到的线性层变成 logits，再由 softmax 转为各 token 的概率。token 可以是字、子词或音素；本例只取三个汉字加 blank，每列概率和为 1。", "Encoder states hₜ pass through a learned linear layer to produce logits, then softmax yields token probabilities. Tokens may be characters, subwords, or phonemes. This example uses three Chinese characters plus blank; each column sums to 1.") : t("贪心解码每步取概率最大的 token，先合并相邻重复，再删除 blank。blank 表示该步不输出标签，不等于静音；被 blank 隔开的相同字必须保留。", "Greedy decoding selects the most probable token at each step, merges adjacent repeats, then removes blanks. Blank means no label emitted at that step, not necessarily silence; identical characters separated by blank must remain.")}</p>
      {step === 1 && <code>zₜ = W hₜ + b; P(k|x,t) = exp(zₜ,k) / Σj exp(zₜ,j)</code>}
      <div className="robot-controls">
        <label>{t("文字示例", "Text example")}<select value={example} onChange={e => setExample(Number(e.target.value))}><option value={0}>你好 / hello</option><option value={1}>妈妈 / mama</option></select></label>
        <label>{t("检查输出步", "Inspect output step")}<select value={frame} onChange={e => setFrame(Number(e.target.value))}>{path.map((_, i) => <option key={i} value={i}>{i + 1}</option>)}</select></label>
        <label>{t("第 4 步 blank logit", "Step 4 blank logit")}: {blankLogit.toFixed(1)}<input type="range" min="-2" max="4" step="0.1" value={blankLogit} onChange={e => setBlankLogit(Number(e.target.value))} /></label>
      </div>
      <p>{t("滑块只干预第 4 步输出分数，不改变录音或重新运行编码器；它用来说明一次 token 决策如何影响最终文字。相同最大值时，本例取词表中靠前的 token。", "The slider changes only the fourth output score, not audio or encoder inference, demonstrating how a token decision affects text. Ties select the first token in vocabulary order.")}</p>
      <div className="asr-probabilities"><table><caption>{t("Token 概率：列为输出步，行为 token；数字越大，色块越深", "Token probabilities: columns are output steps, rows are tokens; darker means higher probability")}</caption><thead><tr><th scope="col">Token</th>{path.map((_, i) => <th scope="col" key={i} aria-current={frame === i ? "step" : undefined}>{i + 1}</th>)}</tr></thead><tbody>{tokens.map((token, k) => <tr key={token}><th scope="row">{token}</th>{probabilities.map((row, i) => <td key={i} className={frame === i ? "asr-selected" : undefined} style={{backgroundColor:`rgba(21, 133, 113, ${row[k]*0.6})`}}>{row[k].toFixed(3)}{path[i] === k && <span aria-label={t("最大概率", "Highest probability")}> *</span>}</td>)}</tr>)}</tbody></table></div>
      <p>{t("所选输出步", "Selected output step")} {frame + 1}: <strong>{tokens[path[frame]]}</strong> ({(100 * probabilities[frame][path[frame]]).toFixed(1)}%). {t("这是帧级分布，不是整句正确率。", "This is a per-step distribution, not transcript accuracy.")}</p>
      <ol className="denoise-head-flow">
        <li><strong>{t("逐步取最大概率", "Per-step argmax")}</strong><code data-testid="asr-path">{sequence(path)}</code></li>
        <li><strong>{t("合并相邻重复", "Merge adjacent repeats")}</strong><code>{sequence(decoded.merged)}</code></li>
        <li><strong>{t("删除 blank，得到文字", "Remove blanks to obtain text")}</strong><output data-testid="asr-transcript">{decoded.text || t("空文本", "Empty text")}</output></li>
      </ol>
      {step === 2 && <p>{t("训练时，CTC 将所有能折叠为目标文字的路径概率相加；贪心解码只取一条路径，不保证得到总概率最大的文字。Beam search 可保留更多候选；标点与文本规范化属于后续处理，本例未自动补标点。", "During training, CTC sums probabilities of all paths that collapse to the target text. Greedy decoding follows one path and may miss the most probable transcript. Beam search retains more candidates; punctuation and text normalization follow decoding and are not added here.")}</p>}
    </>}
    {step < 3 && <p><a href="https://www.cs.toronto.edu/~graves/icml_2006.pdf" target="_blank" rel="noreferrer">{t("算法参考：CTC 原论文（Graves 等，2006）", "Algorithm reference: CTC paper (Graves et al., 2006)")}</a></p>}
  </section>;
}
