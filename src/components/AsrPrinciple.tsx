import { useState } from "react";
import { AsrRouteDiagram } from "./AsrVisuals";
import type { Language } from "../content/knowledge";
import { traditional } from "../content/traditional";

export function AsrPrinciple({ language }: { language: Language }) {
  const t = (zh: string, en: string, ja: string, ko: string) =>
    ({ zh, "zh-Hant": traditional(zh), en, ja, ko })[language];
  const [route, setRoute] = useState(0);
  const routes = [
    { name: "CTC", url: "https://huggingface.co/learn/audio-course/en/chapter3/ctc",
      mechanism: t("每个编码器输出步预测 token 或 blank；对所有合法对齐路径求和。贪心解码先合并相邻重复，再删除 blank。", "Each encoder step predicts a token or blank; training sums valid alignment paths. Greedy decoding merges adjacent repeats before removing blanks.", "各エンコーダ出力で token か blank を予測し、学習では有効な対応経路を合計します。貪欲デコードは隣接重複を統合してから blank を除きます。", "인코더 출력마다 token 또는 blank를 예측하고 학습에서는 유효한 정렬 경로를 합산합니다. 탐욕 디코딩은 인접 중복을 합친 후 blank를 제거합니다."),
      boundary: t("帧级输出便于观察对齐，但流式与否仍取决于编码器的未来上下文；CTC 不等于只能用旧模型。", "Frame-level outputs expose alignment, but streaming depends on encoder lookahead. CTC is not limited to old models.", "フレーム出力で対応を確認できますが、ストリーミング可否はエンコーダの先読み次第です。CTC は旧式モデル専用ではありません。", "프레임 출력으로 정렬을 관찰할 수 있지만 스트리밍 여부는 인코더 선행 문맥에 달려 있습니다. CTC가 구형 모델 전용인 것은 아닙니다.") },
    { name: "RNN-T / Transducer", url: "https://arxiv.org/abs/1211.3711",
      mechanism: t("声学编码器与已输出 token 的预测网络汇合：输出 blank 才推进声学步，输出文字则更新 token 历史。", "Acoustic states and a prediction network over emitted tokens meet in a joint network: blank advances acoustic time; a label updates token history.", "音響状態と既出 token の予測ネットワークを結合します。blank で音響時刻を進め、文字では token 履歴を更新します。", "음향 상태와 출력 token 예측 네트워크를 결합합니다. blank는 음향 시간을 진행시키고 라벨은 token 이력을 갱신합니다."),
      boundary: t("常用于低延迟流式识别，但不保证零延迟；分块、右侧上下文和端点等待仍要计入预算。", "Often used for low-latency streaming, not zero latency: chunks, right context, and endpoint waiting still matter.", "低遅延ストリーミングで使われますが遅延ゼロではありません。チャンク、右文脈、発話終端の待ち時間が必要です。", "저지연 스트리밍에 쓰이지만 지연이 0은 아닙니다. 청크, 우측 문맥, 발화 종료 대기도 고려해야 합니다.") },
    { name: "Attention Encoder–Decoder", url: "https://github.com/openai/whisper",
      mechanism: t("解码器结合音频表示和已生成的 token，逐步预测下一个 token。Whisper 是这种路线的代表，不使用 CTC 折叠规则。", "A decoder uses audio representations and generated tokens to predict the next token. Whisper exemplifies this route and does not use CTC collapse rules.", "デコーダは音声表現と生成済み token から次を予測します。Whisper はこの経路の代表で、CTC の折りたたみ規則は使いません。", "디코더가 오디오 표현과 생성한 token으로 다음 token을 예측합니다. Whisper가 대표적이며 CTC 병합 규칙을 쓰지 않습니다."),
      boundary: t("有利于使用长上下文；Whisper 原生不是流式模型。注意力也可以受限为流式结构，不能把所有注意力模型都当成离线。", "Can exploit long context; native Whisper is not streaming. Attention can also be constrained for streaming, so attention does not always mean offline.", "長い文脈を利用できます。Whisper 自体はストリーミングモデルではありませんが、Attention を制限したストリーミング構造もあります。", "긴 문맥을 활용합니다. Whisper 자체는 스트리밍 모델이 아니지만 Attention을 제한한 스트리밍 구조도 가능합니다.") }
  ];
  return <section className="sound-topic-section asr-principle">
    <div>
      <h2>{t("三条识别路线，解决同一个对齐问题", "Three routes to align speech and text", "音声と文字を対応付ける三つの経路", "음성과 텍스트를 정렬하는 세 경로")}</h2>
      <p>{t("选一条路线，看相同的“你好”怎样输出。三者是替代路线，不是串联步骤。", "Choose a route to see how “你好” is emitted. These are alternatives, not consecutive stages.", "同じ「你好」の出力経路を選びます。三者は直列工程ではありません。", "같은 ‘你好’의 출력 경로를 선택하세요. 세 방식은 순차 단계가 아닙니다.")}</p>
      <div className="asr-route-switch" role="group" aria-label={t("识别路线", "Recognition route", "認識経路", "인식 경로")}>{routes.map((item,i)=><button type="button" key={item.name} aria-pressed={route===i} onClick={()=>setRoute(i)}>{item.name}</button>)}</div>
      <AsrRouteDiagram route={route} language={language} />
      <details className="asr-reading-more"><summary>{t("原理、边界与参考资料", "Principle, limits and reference", "原理・境界・参考資料", "원리·경계·참고 자료")}</summary><p>{routes[route].mechanism}</p><p>{routes[route].boundary}</p><a href={routes[route].url} target="_blank" rel="noreferrer">{routes[route].name}</a></details>
      <details className="asr-reading-more"><summary>{t("Conformer、log-Mel、token 有何不同？", "Conformer, log-Mel or token?", "Conformer・log-Mel・token の違い", "Conformer·log-Mel·token의 차이")}</summary>
      <p>{t("不要混淆层级：Conformer 是编码器结构，可搭配 CTC 或 Transducer；log-Mel 是输入特征；token 是输出单位，既可以是汉字，也可以是子词。它们不是互相替代的三个模型。", "Keep the levels distinct: Conformer is an encoder architecture that can use CTC or a transducer; log-Mel is an input feature; tokens are output units such as characters or subwords. They are not three interchangeable models.", "Conformer は CTC や Transducer と組み合わせるエンコーダ構造、log-Mel は入力特徴、token は文字やサブワードなどの出力単位です。同じ階層のモデルではありません。", "Conformer는 CTC나 Transducer와 결합하는 인코더 구조, log-Mel은 입력 특징, token은 문자·서브워드 같은 출력 단위입니다. 서로 대체하는 모델이 아닙니다.")}</p>
      </details>
      <h3>{t("不是声音更干净就一定识别更准", "Cleaner audio does not guarantee better recognition", "音がきれいでも認識精度は保証されない", "깨끗한 소리가 인식 정확도를 보장하지는 않음")}</h3>
      <div className="asr-score-visual">
        <figure><div className="asr-character-row"><span>{t("参考", "Reference", "正解", "정답")}</span>{["打","开","客","厅","灯"].map(char=><b key={char}>{char}</b>)}</div>
          <div className="asr-character-row"><span>{t("识别", "Hypothesis", "認識", "인식")}</span>{["打","开","客","厅"].map(char=><b key={char}>{char}</b>)}<b className="asr-missing" aria-label={t("删除一个字", "One deletion", "一文字削除", "한 글자 삭제")}>×</b></div>
          <figcaption><strong>CER = 1 / 5 = 20%</strong> · {t("少一个字，不是“整句有 80% 概率正确”。", "One missing character, not an 80% sentence-correct probability.", "一文字の削除で、文が 80% 正しい確率ではありません。", "한 글자 삭제이며 문장이 맞을 확률 80%가 아닙니다.")}</figcaption>
        </figure>
        <figure><div className="asr-time-budget">{Array.from({length:10},(_,i)=><span key={i} className={i<2?"asr-time-used":""} />)}</div>
          <figcaption><strong>RTF = 2 s / 10 s = 0.2</strong><br />{t("处理耗时 2 秒 / 音频 10 秒；算得快，不代表首字出得早。", "2 seconds to process 10 seconds of audio. Fast processing need not mean an early first token.", "10 秒の音声を 2 秒で処理。速い処理でも初字が早いとは限りません。", "10초 음향을 2초에 처리합니다. 처리가 빠르다고 첫 token이 빠른 것은 아닙니다.")}</figcaption>
        </figure>
      </div>
      <details className="asr-reading-more"><summary>{t("展开评价规则与计算说明", "Evaluation rules and calculation", "評価規則と計算の説明", "평가 규칙과 계산 설명")}</summary>
      <p>{t("例：参考“打开客厅灯”，识别为“打开客厅”。少了“灯”，删除 D=1，参考共 5 字，CER=(0+1+0)/5=20%。这不是 80% 的句子正确概率；插入很多字时错误率还可能超过 100%。中文先约定按字还是分词评估，并统一标点、大小写和数字格式。", "Example: reference “打开客厅灯”, hypothesis “打开客厅”. One character is deleted: D=1 out of 5, so CER=(0+1+0)/5=20%. This is not an 80% probability that the sentence is correct; many insertions can make error rates exceed 100%. Agree on character versus word scoring and normalize punctuation, casing, and numbers.", "例：正解「打开客厅灯」に対して「打开客厅」なら、5 文字中 1 文字の削除で CER=(0+1+0)/5=20% です。文が 80% の確率で正しい意味ではなく、挿入が多いと誤り率は 100% を超えます。文字か単語か、句読点や数字の扱いも統一します。", "예: 정답 ‘打开客厅灯’를 ‘打开客厅’으로 인식하면 5자 중 1자 삭제로 CER=(0+1+0)/5=20%입니다. 문장이 맞을 확률 80%가 아니며 삽입이 많으면 오류율이 100%를 넘을 수 있습니다. 문자·단어 평가와 구두점·숫자 처리도 통일해야 합니다.")}</p>
      <p><code>RTF = Tprocess / Taudio</code> · {t("10 秒录音用 2 秒算完，RTF=0.2；若系统先等整段录音结束，首字仍可能很慢。因此要分别看错误率、首字延迟、句末延迟和临时文本修改。", "Processing 10 seconds in 2 seconds gives RTF=0.2. If processing waits for the whole recording, the first token can still arrive late. Measure error rates, first-token latency, finalization latency, and partial revisions separately.", "10 秒の録音を 2 秒で処理すると RTF=0.2 ですが、録音終了を待てば最初の文字は遅れます。誤り率、初字遅延、確定遅延、仮結果の修正を分けて測ります。", "10초 녹음을 2초에 처리하면 RTF=0.2지만 전체 녹음을 기다리면 첫 token은 늦습니다. 오류율, 첫 token 지연, 최종 확정 지연, 임시 결과 수정을 따로 측정합니다.")}</p>
      </details>
    </div>
  </section>;
}
