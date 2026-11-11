import { AudioLines, ScanSearch, Tags, Workflow } from "lucide-react";
import type { Language } from "../content/knowledge";
import { text } from "../content/language";

export function AudioEventPrinciple({ language }: { language: Language }) {
  const t = (zh: string, en: string, ja: string, ko: string) => text(language, zh, en, ja, ko);
  const stages = [
    [ScanSearch, "Pretrained frame encoder · ATST-F", t("输入仍需遵循可复现实现的预处理约定（例如 16 kHz 单声道与 log-Mel 帧）。预训练 ATST-F 帧编码器把每帧变成表示；编码器本身不会输出事件标签或起止边界。", "Follow the reproducible implementation's input contract, such as 16 kHz mono and log-Mel frames. The pretrained ATST-F frame encoder turns each frame into an embedding; the encoder alone does not emit event labels or boundaries.", "16 kHz モノラルや log-Mel フレームなど、再現可能な実装の入力条件に従う。事前学習済み ATST-F フレームエンコーダは各フレームを埋め込みに変換するが、エンコーダだけではイベントラベルや境界を出力しない。", "16 kHz 모노와 log-Mel 프레임 같은 재현 가능한 구현의 입력 조건을 따름. 사전 학습된 ATST-F 프레임 인코더는 각 프레임을 임베딩으로 바꾸지만, 인코더만으로 이벤트 라벨이나 경계를 출력하지 않음.")],
    [Workflow, "Fine-tuned SED head", t("在下游的强标注事件数据上微调 SED 头，把帧表示映射到任务类别。可以按任务选择冻结或继续微调编码器，但事件预测来自编码器之上的 SED 头。", "Fine-tune an SED head on downstream frame-level event annotations to map frame embeddings to task classes. The encoder may be frozen or fine-tuned for the task, but event predictions come from the SED head on top.", "下流のフレーム単位イベントアノテーションで SED ヘッドを微調整し、フレーム埋め込みをタスクのクラスへ写像する。エンコーダを凍結するか微調整するかはタスク次第だが、イベント予測は上の SED ヘッドから得る。", "다운스트림 프레임 단위 이벤트 주석으로 SED 헤드를 미세 조정해 프레임 임베딩을 작업 클래스에 매핑. 인코더를 고정할지 미세 조정할지는 작업에 따라 다르지만 이벤트 예측은 그 위의 SED 헤드에서 나옴.")],
    [Tags, "Per-frame multi-label scores", t("SED 头为每一帧、每个类别输出一个分数；多个声音可以同时为正，所以分数不必相加为 1。这些仍是分数，不是起止时间。", "The SED head emits one score per class for each frame. Multiple sounds can be active together, so scores need not sum to one; scores are still not onset/offset times.", "SED ヘッドは各フレームの各クラスに 1 つのスコアを出す。複数音が同時に有効になれるため合計は 1 でなく、スコア自体も開始・終了時刻ではない。", "SED 헤드는 각 프레임의 각 클래스에 하나의 점수를 출력. 여러 소리가 동시에 활성화될 수 있어 합이 1일 필요가 없으며, 점수 자체가 시작·종료 시각은 아님.")],
    [AudioLines, "Postprocess: onset / offset", t("通用后处理再对逐帧分数应用阈值、合并相邻阳性帧并去除过短区间，估计 onset/offset。阈值和时长是检测策略，不是预训练编码器单独产生的事件。", "Generic postprocessing thresholds frame scores, merges neighboring positives and removes short runs to estimate onset/offset. Thresholds and duration rules are detection policy, not events produced by the pretrained encoder alone.", "汎用の後処理でフレームスコアを閾値処理し、隣接する陽性フレームを結合して短い区間を除き、開始・終了を推定する。閾値や時間規則は検出方針であり、事前学習済みエンコーダだけがイベントを生成するのではない。", "일반 후처리로 프레임 점수에 임계값을 적용하고 인접한 양성 프레임을 병합한 뒤 짧은 구간을 제거해 시작·종료를 추정. 임계값과 시간 규칙은 검출 정책이며 사전 학습 인코더만으로 이벤트가 생성되는 것이 아님.")]
  ] as const;
  return <>
    <section className="sound-topic-section">
      <h2>{t("先分清：听到了什么，还是何时发生", "What happened, or when did it happen?", "何の音か、それともいつ起きたか", "어떤 소리인가, 언제 발생했는가")}</h2>
      <div className="event-task-comparison">
        <div><h3>Audio tagging</h3><p>{t("给整段音频贴标签：这 6 秒里有哭声和玻璃破碎。", "Label a whole clip: crying and breaking glass occur in these six seconds.", "クリップ全体のラベル：この 6 秒には泣き声とガラス破損がある。", "전체 클립에 라벨 부여: 이 6초에 울음과 유리 파손이 있음.")}</p><code>clip → [cry, glass]</code></div>
        <div><h3>Sound event detection · SED</h3><p>{t("还要标出各类的开始、结束，并允许同时发生。时间精度受模型输出步长、窗口和标注影响。", "Also locate each class's start and end, including overlaps. Timing precision depends on output stride, windows and annotations.", "各クラスの開始・終了と重なりも示す。時間精度は出力間隔、窓、アノテーションに依存する。", "각 클래스의 시작·종료와 중첩도 표시. 시간 정밀도는 출력 간격, 창, 주석에 좌우됨.")}</p><code>cry: [1.0, 3.5) s<br />glass: [2.5, 3.0) s</code></div>
      </div>
    </section>
    <section className="sound-topic-section">
      <h2>{t("一个可复现的事件检测路径：PretrainedSED / ATST-F（ICASSP 2025）", "A reproducible SED path: PretrainedSED / ATST-F (ICASSP 2025)", "再現可能な SED の流れ：PretrainedSED / ATST-F（ICASSP 2025）", "재현 가능한 SED 경로: PretrainedSED / ATST-F (ICASSP 2025)")}</h2>
      <p>{t("这里采用作者公开的 PretrainedSED 实现作为现代主路径：预训练帧编码器先提供表示，再由下游微调的 SED 头产生逐帧多标签分数，最后由后处理估计事件边界。浏览器中的本页不下载或运行模型。", "The modern primary path follows the authors' public PretrainedSED implementation: a pretrained frame encoder provides representations, a downstream fine-tuned SED head produces per-frame multi-label scores, and postprocessing estimates event boundaries. This page does not download or run a model in the browser.", "現代的な主経路は著者公開の PretrainedSED 実装に従う。事前学習済みフレームエンコーダが表現を作り、下流で微調整した SED ヘッドがフレーム単位のマルチラベルスコアを出し、後処理がイベント境界を推定する。このページはブラウザでモデルをダウンロード・実行しない。", "현대적 기본 경로는 저자가 공개한 PretrainedSED 구현을 따름. 사전 학습 프레임 인코더가 표현을 만들고 다운스트림에서 미세 조정한 SED 헤드가 프레임별 멀티 라벨 점수를 출력하며 후처리가 이벤트 경계를 추정. 이 페이지는 브라우저에서 모델을 다운로드하거나 실행하지 않음.")}</p>
      <ol className="ai-topic-flow" aria-label={t("声音事件模型流程", "Sound event model flow", "音イベントモデルの流れ", "소리 이벤트 모델 흐름")}>
        {stages.map(([Icon, title, description], index) => <li key={title}><span>{String(index + 1).padStart(2, "0")}</span><Icon size={24} aria-hidden="true" /><h3>{title}</h3><p>{description}</p></li>)}
      </ol>
      <p>{t("逐帧分数仍只是证据，不能把某个高分帧直接当成精确 onset/offset；实验室只演示通用后处理如何改变检测结果。", "Per-frame scores are evidence, not exact onset/offsets; the lab only demonstrates how generic postprocessing changes detections.", "フレーム単位のスコアは証拠であり、正確な開始・終了ではない。ラボでは汎用後処理が検出をどう変えるかだけを示す。", "프레임별 점수는 증거일 뿐 정확한 시작·종료가 아님. 실험실은 일반 후처리가 검출을 어떻게 바꾸는지만 보여줌.")}</p>
      <details className="event-classic-baseline">
        <summary>{t("经典基线：YAMNet 片段标签", "Classic baseline: YAMNet clip tagging", "古典的ベースライン：YAMNet クリップタグ", "고전 기준선: YAMNet 클립 태깅")}</summary>
        <p>{t("YAMNet 保留为简短、可复现的片段标签基线：MobileNet-v1 风格编码器以 0.96 s 窗、0.48 s 步进输出重叠分块；聚合这些分块分数后，才把整段音频概括为 521 × sigmoid 类别。它不是上面的逐帧 SED 主路径，也不会单独提供事件起止边界。", "YAMNet remains a compact, reproducible clip-tag baseline: a MobileNet-v1-style encoder emits overlapping 0.96 s patches every 0.48 s; aggregating those patch scores summarizes a whole clip into 521 × sigmoid tags. It is not the frame-level SED path above and does not provide event boundaries by itself.", "YAMNet は短い再現可能なクリップタグのベースラインとして残す。MobileNet-v1 風エンコーダが 0.96 s の重なり合うパッチを 0.48 s 間隔で出力し、そのパッチスコアを集約してクリップ全体を 521 × sigmoid のタグに要約する。上のフレーム単位 SED の主経路ではなく、それだけでイベント境界を出力しない。", "YAMNet은 간결하고 재현 가능한 클립 태그 기준선으로 유지. MobileNet-v1 방식 인코더가 0.96 s 중첩 패치를 0.48 s 간격으로 출력하고, 패치 점수를 집계해 전체 클립을 521 × sigmoid 태그로 요약함. 위의 프레임 단위 SED 주 경로가 아니며 단독으로 이벤트 경계를 제공하지 않음.")}</p>
        <a href="https://github.com/tensorflow/models/tree/master/research/audioset/yamnet" target="_blank" rel="noreferrer">YAMNet · {t("源码与参数", "code and parameters", "コードとパラメータ", "코드와 파라미터")}</a>
      </details>
      <p className="event-references"><a href="https://github.com/fschmid56/PretrainedSED" target="_blank" rel="noreferrer">PretrainedSED · {t("作者代码、检查点与推理", "author code, checkpoints and inference", "著者コード、チェックポイント、推論", "저자 코드, 체크포인트 및 추론")}</a><a href="https://arxiv.org/abs/2409.09546" target="_blank" rel="noreferrer">ICASSP 2025 · {t("论文", "paper", "論文", "논문")}</a><a href="https://dcase.community/challenge2024/task-sound-event-detection-with-heterogeneous-training-dataset-and-potentially-missing-labels" target="_blank" rel="noreferrer">DCASE · {t("事件检测与标注", "detection and annotations", "検出とアノテーション", "검출과 주석")}</a></p>
    </section>
  </>;
}
