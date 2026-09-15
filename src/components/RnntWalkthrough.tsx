import { useState } from "react";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import type { Language } from "../content/knowledge";

// One illustrative alignment, not a trained model's decisions.
const actions = ["blank", "token", "token", "blank", "blank", "blank"] as const;

export function RnntWalkthrough({ language }: { language: Language }) {
  const t = (zh: string, en: string) => language === "zh" ? zh : en;
  const [position, setPosition] = useState(0);
  const [phrase, setPhrase] = useState("你好");
  const points = [{ time: 0, count: 0 }];
  for (const action of actions) {
    const last = points[points.length - 1];
    points.push({ time: last.time + Number(action === "blank"), count: last.count + Number(action === "token") });
  }
  const current = points[position];
  const text = phrase.slice(0, current.count);
  const finished = position === actions.length;
  const x = (time: number) => 80 + time * 115;
  const y = (count: number) => 200 - count * 65;
  return <section aria-label={t("RNN-T 流式路径", "RNN-T streaming path")}>
    <p>{t("RNN-T 也不是刚出现的技术（2012 年提出）。这里展示 Transducer 的输出机制；它可以配合不同 Encoder。Conformer 是编码器结构，不能与 CTC、RNN-T 当成同一层次的替代选项。", "RNN-T is not brand-new either: it was introduced in 2012. This shows the Transducer output mechanism, which can pair with different encoders. Conformer is an encoder architecture, not an alternative at the same level as CTC or RNN-T.")}</p>
    <p>{t("人工路径演示：4 个编码器时间步、2 个文字 token，没有运行真实识别模型。每次推进一条路径边，不代表固定毫秒数或实际字的时间戳。", "Hand-built alignment: four encoder time steps and two text tokens, with no real recognition model. Each action advances one edge, not a fixed duration or a measured word timestamp.")}</p>
    <div className="robot-controls"><label>{t("RNN-T 文字示例", "RNN-T text example")}<select value={phrase} onChange={e => { setPhrase(e.target.value); setPosition(0); }}><option value="你好">你好 / hello</option><option value="妈妈">妈妈 / mama</option></select></label></div>
    <div className="denoise-explanation">
      <div><strong>Encoder → hₜ</strong><p>{t("声音经特征提取和编码形成当前声学状态。", "Audio features are encoded into the current acoustic state.")}</p><code>{finished ? t("输入步已耗尽", "Input steps exhausted") : `t = ${current.time}`}</code></div>
      <div><strong>Prediction network → gᵤ</strong><p>{t("只根据已经输出的非 blank token 更新文字上下文。", "Updates label context from previously emitted nonblank tokens.")}</p><code>u = {current.count}; {text || t("起始状态", "Start state")}</code></div>
      <div><strong>Joint network → softmax</strong><p>{t("联合声学状态与文字上下文，预测下一项的分布。", "Combines acoustic state and label context to predict the next-symbol distribution.")}</p><code>P(k | x, y₁…yᵤ) = softmax(Joint(hₜ, gᵤ))</code></div>
    </div>
    <div className="robot-buttons">
      <button disabled={position === 0} onClick={() => setPosition(p => p - 1)}><ArrowLeft size={16} aria-hidden="true" />{t("上一步", "Previous")}</button>
      <button disabled={finished} onClick={() => setPosition(p => p + 1)}><ArrowRight size={16} aria-hidden="true" />{t("下一步", "Next")}</button>
      <button disabled={position === 0} onClick={() => setPosition(0)}><RotateCcw size={16} aria-hidden="true" />{t("重置", "Reset")}</button>
    </div>
    <p role="status" data-testid="rnnt-state">{finished ? t("路径完成", "Path complete") : actions[position] === "blank" ? t("下一条边：blank，时间步 t + 1，文字不变。", "Next edge: blank advances time t + 1; text stays unchanged.") : t("下一条边：输出 token，文字长度 u + 1，时间步不变。", "Next edge: emit a token, advancing u + 1 while time stays unchanged.")} <code>t = {current.time}, u = {current.count}</code></p>
    <figure className="rnnt-figure">
      <svg viewBox="0 0 640 275" role="img" aria-label={t("RNN-T 时间与文字路径图", "RNN-T time and label alignment")}>
        {[0,1,2].map(u => <g key={u}><line x1="80" y1={y(u)} x2="540" y2={y(u)} stroke="#b9ccc3" /><text x="65" y={y(u)+5} textAnchor="end">u={u}</text></g>)}
        {[0,1,2,3,4].map(time => <g key={time}><line x1={x(time)} y1="70" x2={x(time)} y2="200" stroke="#b9ccc3" /><text x={x(time)} y="230" textAnchor="middle">t={time}</text></g>)}
        <text x="80" y="30">{t("纵轴：已输出 token 数 u", "Vertical: emitted token count u")}</text>
        <text x="320" y="262" textAnchor="middle">{t("横轴：编码器时间步 t；t=4 为终点", "Horizontal: encoder step t; t=4 is terminal")}</text>
        {actions.map((action,i) => <g key={i}><line x1={x(points[i].time)} y1={y(points[i].count)} x2={x(points[i+1].time)} y2={y(points[i+1].count)} stroke={i<position ? "#158571" : "#697c78"} strokeWidth="4" strokeDasharray={i<position ? undefined : "5 5"} /><text x={action === "blank" ? (x(points[i].time)+x(points[i+1].time))/2 : x(points[i].time)+12} y={action === "blank" ? y(points[i].count)-12 : (y(points[i].count)+y(points[i+1].count))/2} textAnchor={action === "blank" ? "middle" : "start"}>{action === "blank" ? "blank →" : `${phrase[points[i].count]} ↑`}</text></g>)}
        <circle cx={x(current.time)} cy={y(current.count)} r="8" fill="#b6572b" stroke="white" strokeWidth="2" />
      </svg>
      <figcaption>{t("绿色为已走路径，虚线为剩余路径，圆点为当前位置；横移读下一步音频，竖移输出文字。", "Green shows completed edges, dashed lines show remaining edges, and the dot marks the current state. Move right for the next audio step; move up to emit text.")}</figcaption>
    </figure>
    <p>{t("当前文字", "Current text")}: <output data-testid="rnnt-transcript">{text || t("空文本", "Empty text")}</output></p>
    <ul>
      <li>{t("同一个 t 可以连续输出多个 token。选择“妈妈”可看到两个“妈”都被保留；RNN-T 不做 CTC 的相邻重复折叠。", "Multiple tokens can be emitted at the same t. In the mama example both repeated characters remain: RNN-T does not apply CTC repeat collapsing.")}</li>
      <li>{t("blank 推进时间，但不加入文字，也不更新 Prediction network 的标签历史；它不代表静音。", "Blank advances time without adding text or updating label history in the prediction network. It does not mean silence.")}</li>
      <li>{t("真正流式还要求 Encoder 使用因果或受限右侧上下文，并管理缓存、分块和端点；使用 RNN-T 本身不保证低延迟。本图仅示范一条路径，训练会对合法对齐求和。", "True streaming also requires causal or limited-lookahead encoding, caches, chunking, and endpointing. RNN-T alone does not guarantee low latency. This illustrates one path; training sums over valid alignments.")}</li>
    </ul>
    <a href="https://arxiv.org/abs/1211.3711" target="_blank" rel="noreferrer">{t("RNN-T 原论文（Graves，2012）", "RNN-T paper (Graves, 2012)")}</a>
  </section>;
}
