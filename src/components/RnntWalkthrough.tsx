import { traditional } from "../content/traditional";
import { useState } from "react";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import type { Language } from "../content/knowledge";

// One illustrative alignment, not a trained model's decisions.
const actions = ["blank", "token", "token", "blank", "blank", "blank"] as const;

export function RnntWalkthrough({ language }: { language: Language }) {
  const ja: Record<string, string> = {
    "RNN-T 流式路径": "RNN-T ストリーミング経路",
    "RNN-T 也不是刚出现的技术（2012 年提出）。这里展示 Transducer 的输出机制；它可以配合不同 Encoder。Conformer 是编码器结构，不能与 CTC、RNN-T 当成同一层次的替代选项。": "RNN-T も新しい技術ではなく、2012 年に提案されました。ここでは Transducer の出力機構を示します。異なる Encoder と組み合わせられます。Conformer はエンコーダ構造であり、CTC や RNN-T と同じ階層の代替方式ではありません。",
    "人工路径演示：4 个编码器时间步、2 个文字 token，没有运行真实识别模型。每次推进一条路径边，不代表固定毫秒数或实际字的时间戳。": "手作りの経路例です。エンコーダの時間ステップは 4、文字 token は 2 つで、実際の認識モデルは動かしていません。1 回の操作は経路上の 1 辺を進めるだけで、固定ミリ秒や実際の文字タイムスタンプを表しません。",
    "RNN-T 文字示例": "RNN-T の文字例",
    "声音经特征提取和编码形成当前声学状态。": "音声は特徴抽出とエンコードを経て現在の音響状態になります。",
    "输入步已耗尽": "入力ステップを使い切りました",
    "只根据已经输出的非 blank token 更新文字上下文。": "出力済みの non-blank token だけで文字コンテキストを更新します。",
    "起始状态": "開始状態",
    "联合声学状态与文字上下文，预测下一项的分布。": "音響状態と文字コンテキストを結合し、次の記号の分布を予測します。",
    "上一步": "前へ",
    "下一步": "次へ",
    "重置": "リセット",
    "路径完成": "経路が完了しました",
    "下一条边：blank，时间步 t + 1，文字不变。": "次の辺：blank。時間ステップは t + 1 になり、文字は変わりません。",
    "下一条边：输出 token，文字长度 u + 1，时间步不变。": "次の辺：token を出力。文字数は u + 1 になり、時間ステップは変わりません。",
    "RNN-T 时间与文字路径图": "RNN-T の時間・文字アラインメント",
    "纵轴：已输出 token 数 u": "縦軸：出力済み token 数 u",
    "横轴：编码器时间步 t；t=4 为终点": "横軸：エンコーダ時間ステップ t。t=4 が終点",
    "绿色为已走路径，虚线为剩余路径，圆点为当前位置；横移读下一步音频，竖移输出文字。": "緑は通過済みの経路、破線は残りの経路、円は現在位置です。右へ進むと次の音声ステップ、上へ進むと文字を出力します。",
    "当前文字": "現在の文字",
    "空文本": "空のテキスト",
    "同一个 t 可以连续输出多个 token。选择“妈妈”可看到两个“妈”都被保留；RNN-T 不做 CTC 的相邻重复折叠。": "同じ t で複数の token を連続出力できます。「ママ」の例では同じ文字を 2 つとも保持します。RNN-T は CTC の隣接重複の折りたたみを行いません。",
    "blank 推进时间，但不加入文字，也不更新 Prediction network 的标签历史；它不代表静音。": "blank は時間を進めますが、文字には加わらず Prediction network のラベル履歴も更新しません。無音を意味するわけではありません。",
    "真正流式还要求 Encoder 使用因果或受限右侧上下文，并管理缓存、分块和端点；使用 RNN-T 本身不保证低延迟。本图仅示范一条路径，训练会对合法对齐求和。": "真のストリーミングには Encoder の因果または制限付き右コンテキスト、キャッシュ、チャンク、エンドポイント管理も必要です。RNN-T を使うだけでは低遅延は保証されません。この図は 1 経路の例で、学習では有効なアラインメントを合計します。",
    "RNN-T 原论文（Graves，2012）": "RNN-T 原論文（Graves、2012）"
  };
  const ko: Record<string, string> = {
    "RNN-T 流式路径": "RNN-T 스트리밍 경로",
    "RNN-T 也不是刚出现的技术（2012 年提出）。这里展示 Transducer 的输出机制；它可以配合不同 Encoder。Conformer 是编码器结构，不能与 CTC、RNN-T 当成同一层次的替代选项。": "RNN-T도 새로 등장한 기술은 아니며 2012년에 제안되었습니다. 여기서는 Transducer의 출력 메커니즘을 보여 줍니다. 여러 Encoder와 함께 사용할 수 있습니다. Conformer는 인코더 구조이므로 CTC나 RNN-T와 같은 계층의 대안이 아닙니다.",
    "人工路径演示：4 个编码器时间步、2 个文字 token，没有运行真实识别模型。每次推进一条路径边，不代表固定毫秒数或实际字的时间戳。": "수작업으로 만든 경로 예시입니다. 인코더 시간 단계 4개와 문자 token 2개를 사용하며 실제 인식 모델은 실행하지 않습니다. 한 번의 진행은 경로의 한 변을 이동할 뿐, 고정된 밀리초나 실제 문자 타임스탬프를 뜻하지 않습니다.",
    "RNN-T 文字示例": "RNN-T 문자 예시",
    "声音经特征提取和编码形成当前声学状态。": "소리는 특징 추출과 인코딩을 거쳐 현재 음향 상태가 됩니다.",
    "输入步已耗尽": "입력 단계를 모두 사용함",
    "只根据已经输出的非 blank token 更新文字上下文。": "이미 출력된 non-blank token만으로 문자 문맥을 갱신합니다.",
    "起始状态": "시작 상태",
    "联合声学状态与文字上下文，预测下一项的分布。": "음향 상태와 문자 문맥을 결합해 다음 기호의 분포를 예측합니다.",
    "上一步": "이전 단계",
    "下一步": "다음 단계",
    "重置": "초기화",
    "路径完成": "경로 완료",
    "下一条边：blank，时间步 t + 1，文字不变。": "다음 변: blank. 시간 단계는 t + 1이 되고 문자는 변하지 않습니다.",
    "下一条边：输出 token，文字长度 u + 1，时间步不变。": "다음 변: token 출력. 문자 길이는 u + 1이 되고 시간 단계는 변하지 않습니다.",
    "RNN-T 时间与文字路径图": "RNN-T 시간 및 문자 정렬",
    "纵轴：已输出 token 数 u": "세로축: 출력된 token 수 u",
    "横轴：编码器时间步 t；t=4 为终点": "가로축: 인코더 시간 단계 t. t=4가 종점",
    "绿色为已走路径，虚线为剩余路径，圆点为当前位置；横移读下一步音频，竖移输出文字。": "초록색은 지난 경로, 점선은 남은 경로, 원은 현재 위치입니다. 오른쪽 이동은 다음 오디오 단계, 위쪽 이동은 문자 출력입니다.",
    "当前文字": "현재 문자",
    "空文本": "빈 텍스트",
    "同一个 t 可以连续输出多个 token。选择“妈妈”可看到两个“妈”都被保留；RNN-T 不做 CTC 的相邻重复折叠。": "같은 t에서 여러 token을 연속 출력할 수 있습니다. ‘엄마’ 예시에서도 같은 글자 두 개가 모두 유지됩니다. RNN-T는 CTC처럼 인접 반복을 접지 않습니다.",
    "blank 推进时间，但不加入文字，也不更新 Prediction network 的标签历史；它不代表静音。": "blank는 시간을 진행하지만 문자에 추가되지 않고 Prediction network의 레이블 이력도 갱신하지 않습니다. 무음을 뜻하지 않습니다.",
    "真正流式还要求 Encoder 使用因果或受限右侧上下文，并管理缓存、分块和端点；使用 RNN-T 本身不保证低延迟。本图仅示范一条路径，训练会对合法对齐求和。": "진정한 스트리밍에는 Encoder의 인과적 또는 제한된 오른쪽 문맥, 캐시·청크·종단점 관리도 필요합니다. RNN-T 자체가 낮은 지연을 보장하지는 않습니다. 이 그림은 한 경로만 보여 주며 학습에서는 유효한 정렬을 합산합니다.",
    "RNN-T 原论文（Graves，2012）": "RNN-T 원 논문(Graves, 2012)"
  };
  const t = (zh: string, en: string) => language === "zh-Hant" ? traditional(zh) : language === "zh" ? zh : language === "en" ? en : (language === "ja" ? ja[zh] : ko[zh]);
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
    <div className="robot-controls"><label>{t("RNN-T 文字示例", "RNN-T text example")}<select value={phrase} onChange={e => { setPhrase(e.target.value); setPosition(0); }}><option value="你好">{language === "ja" ? "你好 / こんにちは" : language === "ko" ? "你好 / 안녕하세요" : "你好 / hello"}</option><option value="妈妈">{language === "ja" ? "妈妈 / ママ" : language === "ko" ? "妈妈 / 엄마" : "妈妈 / mama"}</option></select></label></div>
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
