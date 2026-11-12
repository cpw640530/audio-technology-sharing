import { traditional } from "../content/traditional";
import { useLabState } from "../hooks/useLabState";
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
  const ja: Record<string, string> = {
    "声学特征": "音響特徴",
    "模型与 token": "モデルと token",
    "CTC 解码": "CTC デコード",
    "RNN-T 流式识别": "RNN-T ストリーミング認識",
    "注意力 Encoder–Decoder": "Attention Encoder–Decoder",
    "ASR 逐步可视化": "ASR の段階的な可視化",
    "声音怎样变成文字：CTC、RNN-T 与注意力": "音声が文字になる仕組み：CTC・RNN-T・Attention",
    "从声学特征到文字，比较 CTC 对齐与 RNN-T 输出机制。以下为人工教学示例，不是真实录音的推理结果。Whisper 等注意力编码器–解码器属于另一条路线。": "音響特徴から文字まで、CTC のアラインメントと RNN-T の出力機構を比較します。以下は手作りの教材例で、実録音の推論結果ではありません。Whisper などの Attention encoder–decoder は別の経路です。",
    "16 kHz 单声道 PCM": "16 kHz モノラル PCM",
    "每秒 16000 个振幅样本，样本本身没有汉字。以 25 ms 窗、10 ms 步长为例，每帧取 400 个样本，每次移动 160 个样本。": "1 秒あたり 16000 個の振幅サンプルで、サンプル自体に漢字はありません。25 ms 窓と 10 ms ホップなら、各フレームは 400 サンプルで 160 サンプルずつ移動します。",
    "功率谱": "パワースペクトル",
    "对每帧加窗和 FFT，取模平方；Mel 滤波器组将频率能量加权汇总，再取对数。每帧得到一组特征，例如 80 维；80 是特征数，不是 80 个字。": "各フレームに窓と FFT を適用して振幅の二乗を取り、Mel フィルタバンクで周波数エネルギーを重み付け集約してから対数を取ります。1 フレームは例えば 80 次元の特徴になり、80 個の文字ではありません。",
    "上下文表示": "コンテキスト表現",
    "卷积提取局部变化，注意力或循环网络整合上下文。编码器可能下采样，因此一个输出步不一定对应一个 10 ms 输入帧。MFCC 是另一种表示，不是 log-Mel 后的必经步骤。": "畳み込みは局所変化を抽出し、Attention または再帰ネットワークがコンテキストを統合します。エンコーダはダウンサンプリングするため、1 出力ステップが 10 ms の入力フレーム 1 つに対応するとは限りません。MFCC は別の表現で、log-Mel の後に必ず行う処理ではありません。",
    "编码器输出 hₜ，经训练得到的线性层变成 logits，再由 softmax 转为各 token 的概率。token 可以是字、子词或音素；本例只取三个汉字加 blank，每列概率和为 1。": "エンコーダ出力 hₜ を学習済み線形層で logits に変換し、softmax で各 token の確率にします。token は文字、サブワード、音素などで、本例は 3 つの漢字と blank を使い、各列の合計は 1 です。",
    "贪心解码每步取概率最大的 token，先合并相邻重复，再删除 blank。blank 表示该步不输出标签，不等于静音；被 blank 隔开的相同字必须保留。": "Greedy デコードは各ステップで最大確率の token を選び、隣接重複をまとめてから blank を削除します。blank はそのステップでラベルを出力しないことを示し、無音とは限りません。blank で区切られた同じ文字は保持します。",
    "文字示例": "文字例",
    "检查输出步": "出力ステップを確認",
    "第 4 步 blank logit": "4 番目の blank logit",
    "滑块只干预第 4 步输出分数，不改变录音或重新运行编码器；它用来说明一次 token 决策如何影响最终文字。相同最大值时，本例取词表中靠前的 token。": "スライダーは 4 番目の出力スコアだけを変え、録音やエンコーダの再実行は行いません。1 回の token 判断が最終テキストにどう影響するかを示します。同率なら語彙の前方の token を選びます。",
    "Token 概率：列为输出步，行为 token；数字越大，色块越深": "Token 確率：列は出力ステップ、行は token。数値が大きいほど色が濃い",
    "最大概率": "最大確率",
    "所选输出步": "選択した出力ステップ",
    "这是帧级分布，不是整句正确率。": "これはフレーム単位の分布であり、文全体の正解率ではありません。",
    "逐步取最大概率": "各ステップで最大確率を選択",
    "合并相邻重复": "隣接重複を統合",
    "删除 blank，得到文字": "blank を削除して文字を得る",
    "空文本": "空のテキスト",
    "训练时，CTC 将所有能折叠为目标文字的路径概率相加；贪心解码只取一条路径，不保证得到总概率最大的文字。Beam search 可保留更多候选；标点与文本规范化属于后续处理，本例未自动补标点。": "学習時、CTC は目標テキストに折りたためる全経路の確率を合計します。Greedy デコードは 1 経路だけなので、合計確率最大の文字列とは限りません。Beam search は候補を多く残せます。句読点とテキスト正規化は後処理で、本例では自動追加しません。",
    "算法参考：CTC 原论文（Graves 等，2006）": "アルゴリズム参考：CTC 原論文（Graves ら、2006）",
    "Token": "Token"
  };
  const ko: Record<string, string> = {
    "声学特征": "음향 특징",
    "模型与 token": "모델과 token",
    "CTC 解码": "CTC 디코딩",
    "RNN-T 流式识别": "RNN-T 스트리밍 인식",
    "注意力 Encoder–Decoder": "Attention Encoder–Decoder",
    "ASR 逐步可视化": "ASR 단계별 시각화",
    "声音怎样变成文字：CTC、RNN-T 与注意力": "소리가 문자로 변하는 과정: CTC·RNN-T·Attention",
    "从声学特征到文字，比较 CTC 对齐与 RNN-T 输出机制。以下为人工教学示例，不是真实录音的推理结果。Whisper 等注意力编码器–解码器属于另一条路线。": "음향 특징에서 문자까지 CTC 정렬과 RNN-T 출력 메커니즘을 비교합니다. 아래는 수작업 교육 예시이며 실제 녹음의 추론 결과가 아닙니다. Whisper 같은 Attention encoder–decoder는 별도의 경로입니다.",
    "16 kHz 单声道 PCM": "16 kHz 모노 PCM",
    "每秒 16000 个振幅样本，样本本身没有汉字。以 25 ms 窗、10 ms 步长为例，每帧取 400 个样本，每次移动 160 个样本。": "초당 16,000개의 진폭 샘플이며 샘플 자체에는 한자가 없습니다. 25 ms 창과 10 ms 홉을 사용하면 프레임마다 400개 샘플을 취하고 160개씩 이동합니다.",
    "功率谱": "파워 스펙트럼",
    "对每帧加窗和 FFT，取模平方；Mel 滤波器组将频率能量加权汇总，再取对数。每帧得到一组特征，例如 80 维；80 是特征数，不是 80 个字。": "각 프레임에 창과 FFT를 적용해 크기의 제곱을 구하고 Mel 필터 뱅크로 주파수 에너지를 가중 합산한 뒤 로그를 취합니다. 프레임마다 예를 들어 80차원 특징을 얻으며 80개의 문자가 아닙니다.",
    "上下文表示": "문맥 표현",
    "卷积提取局部变化，注意力或循环网络整合上下文。编码器可能下采样，因此一个输出步不一定对应一个 10 ms 输入帧。MFCC 是另一种表示，不是 log-Mel 后的必经步骤。": "합성곱은 지역 변화를 추출하고 Attention 또는 순환 네트워크가 문맥을 통합합니다. 인코더가 다운샘플링할 수 있어 출력 단계 하나가 10 ms 입력 프레임 하나와 반드시 대응하지는 않습니다. MFCC는 별도의 표현이며 log-Mel 뒤에 반드시 거치는 단계가 아닙니다.",
    "编码器输出 hₜ，经训练得到的线性层变成 logits，再由 softmax 转为各 token 的概率。token 可以是字、子词或音素；本例只取三个汉字加 blank，每列概率和为 1。": "인코더 출력 hₜ를 학습된 선형 층으로 logits로 바꾼 뒤 softmax로 각 token 확률을 구합니다. token은 문자·서브워드·음소일 수 있으며 이 예시는 한자 세 개와 blank를 사용하고 각 열의 합은 1입니다.",
    "贪心解码每步取概率最大的 token，先合并相邻重复，再删除 blank。blank 表示该步不输出标签，不等于静音；被 blank 隔开的相同字必须保留。": "Greedy 디코딩은 각 단계에서 확률이 가장 큰 token을 고르고 인접 반복을 합친 뒤 blank를 삭제합니다. blank는 해당 단계에서 레이블을 출력하지 않는다는 뜻이지 무음이라는 뜻은 아닙니다. blank로 분리된 같은 문자는 유지합니다.",
    "文字示例": "문자 예시",
    "检查输出步": "출력 단계 확인",
    "第 4 步 blank logit": "4번째 blank logit",
    "滑块只干预第 4 步输出分数，不改变录音或重新运行编码器；它用来说明一次 token 决策如何影响最终文字。相同最大值时，本例取词表中靠前的 token。": "슬라이더는 4번째 출력 점수만 바꾸며 녹음이나 인코더를 다시 실행하지 않습니다. 한 번의 token 결정이 최종 텍스트에 미치는 영향을 보여 줍니다. 최대값이 같으면 어휘에서 앞선 token을 선택합니다.",
    "Token 概率：列为输出步，行为 token；数字越大，色块越深": "Token 확률: 열은 출력 단계, 행은 token이며 숫자가 클수록 색이 진합니다",
    "最大概率": "최대 확률",
    "所选输出步": "선택한 출력 단계",
    "这是帧级分布，不是整句正确率。": "프레임 단위 분포이며 전체 문장 정확도가 아닙니다.",
    "逐步取最大概率": "단계별 최대 확률 선택",
    "合并相邻重复": "인접 반복 병합",
    "删除 blank，得到文字": "blank를 삭제해 문자 얻기",
    "空文本": "빈 텍스트",
    "训练时，CTC 将所有能折叠为目标文字的路径概率相加；贪心解码只取一条路径，不保证得到总概率最大的文字。Beam search 可保留更多候选；标点与文本规范化属于后续处理，本例未自动补标点。": "학습 중 CTC는 목표 텍스트로 접힐 수 있는 모든 경로의 확률을 합산합니다. Greedy 디코딩은 한 경로만 따르므로 전체 확률이 가장 큰 문자열을 보장하지 않습니다. Beam search는 더 많은 후보를 유지할 수 있습니다. 구두점과 텍스트 정규화는 후처리이며 이 예시에서는 자동으로 넣지 않습니다.",
    "算法参考：CTC 原论文（Graves 等，2006）": "알고리즘 참고: CTC 원 논문(Graves 등, 2006)",
    "Token": "토큰"
  };
  const t = (zh: string, en: string) => language === "zh-Hant" ? traditional(zh) : language === "zh" ? zh : language === "en" ? en : (language === "ja" ? ja[zh] : ko[zh]);
  const [step, setStep] = useLabState<number>("asr.step", 0, (value): value is number => typeof value === "number" && Number.isInteger(value) && value >= 0 && value < 5);
  const [example, setExample] = useLabState<number>("asr.ctc.example", 0, (value): value is number => typeof value === "number" && Number.isInteger(value) && value >= 0 && value < examples.length);
  const [frame, setFrame] = useLabState<number>("asr.ctc.frame", 3, (value): value is number => typeof value === "number" && Number.isInteger(value) && value >= 0 && value < examples[0].length);
  const [blankLogit, setBlankLogit] = useLabState<number>("asr.ctc.blankLogit", 3, (value): value is number => typeof value === "number" && Number.isFinite(value) && value >= -2 && value <= 4);
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
    <h2>{t("声音怎样变成文字：CTC、RNN-T 与注意力", "How sound becomes text: CTC, RNN-T and attention")}</h2>
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
        <label>{t("文字示例", "Text example")}<select value={example} onChange={e => setExample(Number(e.target.value))}><option value={0}>{language === "ja" ? "你好 / こんにちは" : language === "ko" ? "你好 / 안녕하세요" : "你好 / hello"}</option><option value={1}>{language === "ja" ? "妈妈 / ママ" : language === "ko" ? "妈妈 / 엄마" : "妈妈 / mama"}</option></select></label>
        <label>{t("检查输出步", "Inspect output step")}<select value={frame} onChange={e => setFrame(Number(e.target.value))}>{path.map((_, i) => <option key={i} value={i}>{i + 1}</option>)}</select></label>
        <label>{t("第 4 步 blank logit", "Step 4 blank logit")}: {blankLogit.toFixed(1)}<input type="range" min="-2" max="4" step="0.1" value={blankLogit} onChange={e => setBlankLogit(Number(e.target.value))} /></label>
      </div>
      <p>{t("滑块只干预第 4 步输出分数，不改变录音或重新运行编码器；它用来说明一次 token 决策如何影响最终文字。相同最大值时，本例取词表中靠前的 token。", "The slider changes only the fourth output score, not audio or encoder inference, demonstrating how a token decision affects text. Ties select the first token in vocabulary order.")}</p>
      <div className="asr-probabilities"><table><caption>{t("Token 概率：列为输出步，行为 token；数字越大，色块越深", "Token probabilities: columns are output steps, rows are tokens; darker means higher probability")}</caption><thead><tr><th scope="col">{t("Token", "Token")}</th>{path.map((_, i) => <th scope="col" key={i} aria-current={frame === i ? "step" : undefined}>{i + 1}</th>)}</tr></thead><tbody>{tokens.map((token, k) => <tr key={token}><th scope="row">{token}</th>{probabilities.map((row, i) => <td key={i} className={frame === i ? "asr-selected" : undefined} style={{backgroundColor:`rgba(21, 133, 113, ${row[k]*0.6})`}}>{row[k].toFixed(3)}{path[i] === k && <span aria-label={t("最大概率", "Highest probability")}> *</span>}</td>)}</tr>)}</tbody></table></div>
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
