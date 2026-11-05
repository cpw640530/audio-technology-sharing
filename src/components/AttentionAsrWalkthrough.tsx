import { traditional } from "../content/traditional";
import { useState } from "react";
import type { Language } from "../content/knowledge";

const outputs = ["你好", "世界", "。", "<eot>"];
const attention = [
  [0.72, 0.18, 0.07, 0.03],
  [0.05, 0.12, 0.67, 0.16],
  [0.04, 0.08, 0.18, 0.70],
  [0.25, 0.25, 0.25, 0.25]
];
const probabilities = [[0.75, 0.10, 0.10, 0.05], [0.08, 0.80, 0.07, 0.05], [0.05, 0.10, 0.75, 0.10], [0.02, 0.03, 0.05, 0.90]];

export function AttentionAsrWalkthrough({ language }: { language: Language }) {
  const ja: Record<string, string> = {
    "注意力 ASR 图解": "Attention ASR の解説",
    "注意力 Encoder–Decoder：以 Whisper 类路线为例": "Attention Encoder–Decoder：Whisper 系の経路を例に",
    "Whisper 是 2022 年公开的多语言 Encoder–Decoder Transformer 路线。这里使用它的基本结构做教学演示，不代表当前网页正在运行 Whisper 模型。": "Whisper は 2022 年に公開された多言語 Encoder–Decoder Transformer です。ここでは基本構造を教材として示しており、このページで Whisper モデルを実行しているわけではありません。",
    "简化词表为“你好”“世界”“。”“<eot>”，不对应 Whisper 的真实 BPE 分词。注意力与候选概率均为人工示例，未从模型提取；省略语言与任务前缀。<eot> 表示结束，不加入可见文本。": "簡略化した語彙は「你好」「世界」「。」「<eot>」で、Whisper の実際の BPE 分割とは異なります。Attention と候補確率は手作りの例で、モデルから抽出していません。言語・タスクのプレフィックスは省略し、<eot> は表示テキストに加えない終了記号です。",
    "输入：模型指定的 log-Mel": "入力：モデル指定の log-Mel",
    "Whisper 使用 16 kHz 音频、30 秒输入窗口、25 ms 分析窗与 10 ms 步长。原始版本及 large-v2 为 80 个 Mel 频带，large-v3 为 128；必须匹配模型配置。": "Whisper は 16 kHz 音声、30 秒の入力窓、25 ms の解析窓、10 ms のホップを使います。初期版と large-v2 は 80 Mel 帯域、large-v3 は 128 なので、モデル設定に合わせる必要があります。",
    "Encoder：建立音频上下文": "Encoder：音声コンテキストを構築",
    "卷积层处理局部模式，Transformer self-attention 汇总全段声学上下文，得到 H。": "畳み込み層が局所パターンを処理し、Transformer の self-attention が全体の音響コンテキストを集約して H を得ます。",
    "Decoder：逐 token 生成": "Decoder：token を逐次生成",
    "Decoder 的 self-attention 只能读取已经生成的 token；cross-attention 再从 H 中选择相关信息。": "Decoder の self-attention は生成済み token だけを読み、cross-attention が H から関連情報を選びます。",
    "当前生成": "ここまでの生成結果",
    "尚未生成": "未生成",
    "生成下一个 token": "次の token を生成",
    "回退": "一つ戻る",
    "下一步预测": "次の予測",
    "已结束：<eot>": "終了：<eot>",
    "当前高亮行与候选概率对应下一次生成；点击生成后，文本、预测和热图共同推进。结束后保留最后一次预测供查看。": "現在の強調行と候補確率は次の生成に対応します。生成を押すとテキスト、予測、ヒートマップが一緒に進み、終了後も最後の予測を確認できます。",
    "cross-attention 教学热图：单个示意头，列为编码器位置；颜色越深权重越大": "cross-attention 教材ヒートマップ：1 つの例示ヘッド。列はエンコーダ位置で、色が濃いほど重みが大きい",
    "预测 token": "予測 token",
    "位置": "位置",
    "输出词表上的候选概率（与注意力权重不同）": "出力語彙の候補確率（Attention の重みとは異なる）",
    "注意力在编码器位置上归一化；输出概率在词表上归一化。两者均和为 1，但含义不同，输出概率还经过多层计算与词表投影，并不是注意力权重的直接复制。": "Attention はエンコーダ位置上、出力確率は語彙上で正規化されます。どちらも合計は 1 ですが意味は異なり、出力確率は複数層と語彙射影を経るため、Attention 重みの直接コピーではありません。",
    "热图只表示这个教学数据里 Decoder 在 cross-attention 中的权重分布，不能直接当作字的起止时间、因果解释或对齐标注。真实时间戳需要模型专门输出、强制对齐或 WhisperX 一类后处理。": "このヒートマップは教材データでの Decoder の cross-attention 重み分布だけを示します。文字の開始・終了時刻、因果説明、アラインメントラベルとはみなせません。実際のタイムスタンプにはモデル出力、強制アラインメント、WhisperX のような後処理が必要です。",
    "训练": "学習",
    "训练时用 teacher forcing，把目标序列右移后作为 Decoder 输入，学习下一个 token 的交叉熵。": "学習時は teacher forcing を使い、右シフトした目標列を Decoder 入力として次の token の交差エントロピーを学習します。",
    "推理": "推論",
    "推理时没有目标文字，Decoder 只能使用自己已经生成的 token；贪心、beam search 或采样会影响结果。": "推論時には目標テキストがないため、Decoder は自分が生成済みの token だけを使います。Greedy、beam search、sampling により結果が変わります。",
    "结构参考：OpenAI Whisper 介绍": "構造参考：OpenAI Whisper の紹介",
    "版本参数：Whisper large-v3 官方模型卡": "バージョンパラメータ：Whisper large-v3 公式モデルカード",
    "开源项目参考": "オープンソースプロジェクトの参考",
    "这些项目用于查阅真实模型、推理接口和部署方式；本实验室仍使用小型教学数据，避免把下载模型、浏览器算力和网络依赖带入首页。": "これらのプロジェクトは実モデル、推論 API、デプロイ方法を調べるための参考です。このラボは小さな教材データを使い、モデルのダウンロード、ブラウザ計算量、ネットワーク依存をトップページに持ち込みません。",
    "离线 Encoder–Decoder Transformer、多语言转写和翻译。": "オフライン Encoder–Decoder Transformer、多言語転写、翻訳。",
    "中文工程链路、Paraformer、流式识别、标点和说话人处理。": "中国語の実装パイプライン、Paraformer、ストリーミング認識、句読点、話者処理。",
    "端侧 ONNX 推理和 Transducer/Zipformer 等实时路线。": "エッジ ONNX 推論と Transducer/Zipformer などのリアルタイム方式。",
    "注意力对齐和端到端 ASR 教学实现参考。": "Attention アラインメントとエンドツーエンド ASR の教材実装の参考。"
  };
  const ko: Record<string, string> = {
    "注意力 ASR 图解": "Attention ASR 해설",
    "注意力 Encoder–Decoder：以 Whisper 类路线为例": "Attention Encoder–Decoder: Whisper 계열 경로 예시",
    "Whisper 是 2022 年公开的多语言 Encoder–Decoder Transformer 路线。这里使用它的基本结构做教学演示，不代表当前网页正在运行 Whisper 模型。": "Whisper는 2022년에 공개된 다국어 Encoder–Decoder Transformer 방식입니다. 여기서는 기본 구조를 교육용으로 보여 주며 이 페이지에서 Whisper 모델을 실행하는 것은 아닙니다.",
    "简化词表为“你好”“世界”“。”“<eot>”，不对应 Whisper 的真实 BPE 分词。注意力与候选概率均为人工示例，未从模型提取；省略语言与任务前缀。<eot> 表示结束，不加入可见文本。": "단순화한 어휘는 ‘你好’, ‘世界’, ‘。’, ‘<eot>’이며 Whisper의 실제 BPE 토큰화와 다릅니다. Attention과 후보 확률은 모델에서 추출하지 않은 수작업 예시이고 언어·작업 접두사는 생략했습니다. <eot>는 종료를 뜻하며 표시 텍스트에 넣지 않습니다.",
    "输入：模型指定的 log-Mel": "입력: 모델 지정 log-Mel",
    "Whisper 使用 16 kHz 音频、30 秒输入窗口、25 ms 分析窗与 10 ms 步长。原始版本及 large-v2 为 80 个 Mel 频带，large-v3 为 128；必须匹配模型配置。": "Whisper는 16 kHz 오디오, 30초 입력 창, 25 ms 분석 창, 10 ms 홉을 사용합니다. 원본 모델과 large-v2는 80개 Mel 대역, large-v3는 128개이므로 모델 설정에 맞춰야 합니다.",
    "Encoder：建立音频上下文": "Encoder: 오디오 문맥 구성",
    "卷积层处理局部模式，Transformer self-attention 汇总全段声学上下文，得到 H。": "합성곱 층이 지역 패턴을 처리하고 Transformer self-attention이 전체 음향 문맥을 모아 H를 만듭니다.",
    "Decoder：逐 token 生成": "Decoder: token 단위 생성",
    "Decoder 的 self-attention 只能读取已经生成的 token；cross-attention 再从 H 中选择相关信息。": "Decoder의 self-attention은 이미 생성된 token만 읽고 cross-attention이 H에서 관련 정보를 선택합니다.",
    "当前生成": "현재까지 생성",
    "尚未生成": "아직 생성되지 않음",
    "生成下一个 token": "다음 token 생성",
    "回退": "한 단계 뒤로",
    "下一步预测": "다음 예측",
    "已结束：<eot>": "종료됨: <eot>",
    "当前高亮行与候选概率对应下一次生成；点击生成后，文本、预测和热图共同推进。结束后保留最后一次预测供查看。": "현재 강조 행과 후보 확률은 다음 생성을 나타냅니다. 생성하면 텍스트·예측·히트맵이 함께 진행되고 종료 후에도 마지막 예측을 확인할 수 있습니다.",
    "cross-attention 教学热图：单个示意头，列为编码器位置；颜色越深权重越大": "cross-attention 교육용 히트맵: 하나의 예시 헤드. 열은 인코더 위치이며 색이 진할수록 가중치가 큽니다.",
    "预测 token": "예측 token",
    "位置": "위치",
    "输出词表上的候选概率（与注意力权重不同）": "출력 어휘의 후보 확률(Attention 가중치와 다름)",
    "注意力在编码器位置上归一化；输出概率在词表上归一化。两者均和为 1，但含义不同，输出概率还经过多层计算与词表投影，并不是注意力权重的直接复制。": "Attention은 인코더 위치에서, 출력 확률은 어휘에서 정규화됩니다. 둘 다 합은 1이지만 의미가 다르며 출력 확률은 여러 층과 어휘 투영을 거치므로 Attention 가중치를 그대로 복사한 것이 아닙니다.",
    "热图只表示这个教学数据里 Decoder 在 cross-attention 中的权重分布，不能直接当作字的起止时间、因果解释或对齐标注。真实时间戳需要模型专门输出、强制对齐或 WhisperX 一类后处理。": "이 히트맵은 교육 데이터에서 Decoder의 cross-attention 가중치 분포만 보여 줍니다. 글자의 시작·끝 시각, 인과 설명, 정렬 라벨로 바로 사용할 수 없습니다. 실제 타임스탬프에는 모델 출력, 강제 정렬 또는 WhisperX 같은 후처리가 필요합니다.",
    "训练": "학습",
    "训练时用 teacher forcing，把目标序列右移后作为 Decoder 输入，学习下一个 token 的交叉熵。": "학습 중에는 teacher forcing으로 목표 시퀀스를 오른쪽으로 이동해 Decoder 입력으로 넣고 다음 token의 교차 엔트로피를 학습합니다.",
    "推理": "추론",
    "推理时没有目标文字，Decoder 只能使用自己已经生成的 token；贪心、beam search 或采样会影响结果。": "추론에는 목표 텍스트가 없으므로 Decoder는 자신이 생성한 token만 사용합니다. Greedy, beam search, sampling에 따라 결과가 달라집니다.",
    "结构参考：OpenAI Whisper 介绍": "구조 참고: OpenAI Whisper 소개",
    "版本参数：Whisper large-v3 官方模型卡": "버전 파라미터: Whisper large-v3 공식 모델 카드",
    "开源项目参考": "오픈 소스 프로젝트 참고",
    "这些项目用于查阅真实模型、推理接口和部署方式；本实验室仍使用小型教学数据，避免把下载模型、浏览器算力和网络依赖带入首页。": "이 프로젝트들은 실제 모델, 추론 API, 배포 방식을 확인하기 위한 참고 자료입니다. 이 실험실은 작은 교육용 데이터를 사용해 모델 다운로드, 브라우저 연산량, 네트워크 의존성을 첫 화면에 넣지 않습니다.",
    "离线 Encoder–Decoder Transformer、多语言转写和翻译。": "오프라인 Encoder–Decoder Transformer, 다국어 전사와 번역.",
    "中文工程链路、Paraformer、流式识别、标点和说话人处理。": "중국어 엔지니어링 파이프라인, Paraformer, 스트리밍 인식, 구두점과 화자 처리.",
    "端侧 ONNX 推理和 Transducer/Zipformer 等实时路线。": "엣지 ONNX 추론과 Transducer/Zipformer 같은 실시간 방식.",
    "注意力对齐和端到端 ASR 教学实现参考。": "Attention 정렬과 엔드투엔드 ASR 교육 구현 참고."
  };
  const t = (zh: string, en: string) => language === "zh-Hant" ? traditional(zh) : language === "zh" ? zh : language === "en" ? en : (language === "ja" ? ja[zh] : ko[zh]);
  const [step, setStep] = useState(0);
  const finished = step === outputs.length;
  const token = Math.min(step, outputs.length - 1);
  const text = outputs.slice(0, Math.min(step, outputs.length - 1)).join("");
  return <section className="asr-attention-walkthrough" aria-label={t("注意力 ASR 图解", "Attention ASR walkthrough")}>
    <h2>{t("注意力 Encoder–Decoder：以 Whisper 类路线为例", "Attention encoder-decoder: a Whisper-style route")}</h2>
    <p>{t("Whisper 是 2022 年公开的多语言 Encoder–Decoder Transformer 路线。这里使用它的基本结构做教学演示，不代表当前网页正在运行 Whisper 模型。", "Whisper is a multilingual encoder-decoder Transformer released in 2022. This teaches its basic structure; the page is not running a Whisper model.")}</p>
    <p>{t("简化词表为“你好”“世界”“。”“<eot>”，不对应 Whisper 的真实 BPE 分词。注意力与候选概率均为人工示例，未从模型提取；省略语言与任务前缀。<eot> 表示结束，不加入可见文本。", "The simplified vocabulary is 你好, 世界, 。 and <eot>, not Whisper's real BPE tokenization. Attention and candidate probabilities are hand-built, not extracted from a model; language and task prefixes are omitted. <eot> ends generation without adding visible text.")}</p>
    <div className="denoise-explanation">
      <div><strong>{t("输入：模型指定的 log-Mel", "Input: model-specific log-Mel")}</strong><p>{t("Whisper 使用 16 kHz 音频、30 秒输入窗口、25 ms 分析窗与 10 ms 步长。原始版本及 large-v2 为 80 个 Mel 频带，large-v3 为 128；必须匹配模型配置。", "Whisper uses 16 kHz audio, 30-second input windows, 25 ms analysis windows and 10 ms hops. Original models and large-v2 use 80 Mel bands; large-v3 uses 128. Match the model configuration.")}</p><code>X ∈ R^(T×M); M = 80 / 128</code></div>
      <div><strong>{t("Encoder：建立音频上下文", "Encoder: build audio context")}</strong><p>{t("卷积层处理局部模式，Transformer self-attention 汇总全段声学上下文，得到 H。", "Convolutions process local patterns; Transformer self-attention gathers acoustic context to produce H.")}</p><code>H = Encoder(X)</code></div>
      <div><strong>{t("Decoder：逐 token 生成", "Decoder: generate token by token")}</strong><p>{t("Decoder 的 self-attention 只能读取已经生成的 token；cross-attention 再从 H 中选择相关信息。", "Decoder self-attention reads only generated tokens; cross-attention then selects relevant information from H.")}</p><code>yᵢ = argmax P(yᵢ | y&lt;i, H)</code></div>
    </div>
    <div className="attention-token-panel">
      <div><h3>{t("当前生成", "Generated so far")}</h3><output data-testid="attention-transcript">{text || t("尚未生成", "Not generated")}</output><div className="robot-buttons"><button disabled={finished} onClick={() => setStep(s => s + 1)}>{t("生成下一个 token", "Generate next token")}</button><button disabled={step === 0} onClick={() => setStep(s => s - 1)}>{t("回退", "Step back")}</button></div></div>
      <div><h3>{t("下一步预测", "Next prediction")}</h3><strong data-testid="attention-next">{finished ? t("已结束：<eot>", "Finished: <eot>") : outputs[token]}</strong><p>{t("当前高亮行与候选概率对应下一次生成；点击生成后，文本、预测和热图共同推进。结束后保留最后一次预测供查看。", "The highlighted row and candidate probabilities describe the next generation. Generating advances text, prediction and heatmap together. The final prediction remains visible after completion.")}</p></div>
    </div>
    <div className="asr-attention-map"><table><caption>{t("cross-attention 教学热图：单个示意头，列为编码器位置；颜色越深权重越大", "Cross-attention teaching heatmap: one illustrative head, columns are encoder positions; darker means higher weight")}</caption><thead><tr><th>{t("预测 token", "Predicted token")}</th>{[1,2,3,4].map(label => <th key={label}>{t("位置", "Position")} {label}</th>)}</tr></thead><tbody>{outputs.map((label, i) => <tr key={label} data-current={token === i}><th scope="row">{label}</th>{attention[i].map((value, j) => <td key={j} className={token === i ? "asr-selected" : undefined} style={{backgroundColor:`rgba(21, 133, 113, ${value})`}}>{value.toFixed(2)}</td>)}</tr>)}</tbody></table></div>
    <div className="asr-attention-map"><table><caption>{t("输出词表上的候选概率（与注意力权重不同）", "Candidate probabilities over the vocabulary (not attention weights)")}</caption><thead><tr>{outputs.map(label => <th key={label} scope="col">{label}</th>)}</tr></thead><tbody><tr>{probabilities[token].map((p, i) => <td key={i}>{(100*p).toFixed(0)}%</td>)}</tr></tbody></table></div>
    <p>{t("注意力在编码器位置上归一化；输出概率在词表上归一化。两者均和为 1，但含义不同，输出概率还经过多层计算与词表投影，并不是注意力权重的直接复制。", "Attention normalizes over encoder positions; output probabilities normalize over vocabulary tokens. Both sum to one but have different meanings. Output probabilities involve further layers and a vocabulary projection, not a direct copy of attention weights.")}</p>
    <p>{t("热图只表示这个教学数据里 Decoder 在 cross-attention 中的权重分布，不能直接当作字的起止时间、因果解释或对齐标注。真实时间戳需要模型专门输出、强制对齐或 WhisperX 一类后处理。", "This heatmap shows cross-attention weights in the teaching data. It is not a word start/end timestamp, causal explanation, or alignment label. Reliable timestamps require model outputs, forced alignment, or post-processing such as WhisperX.")}</p>
    <ol className="denoise-head-flow"><li><strong>{t("训练", "Training")}</strong><p>{t("训练时用 teacher forcing，把目标序列右移后作为 Decoder 输入，学习下一个 token 的交叉熵。", "During training, teacher forcing feeds the shifted target sequence to the decoder and learns next-token cross-entropy.")}</p><code>L = −Σᵢ log P(yᵢ | y&lt;i, H)</code></li><li><strong>{t("推理", "Inference")}</strong><p>{t("推理时没有目标文字，Decoder 只能使用自己已经生成的 token；贪心、beam search 或采样会影响结果。", "At inference there is no target text; the decoder uses its own generated tokens. Greedy decoding, beam search, or sampling changes the result.")}</p></li></ol>
    <a href="https://openai.com/index/whisper/" target="_blank" rel="noreferrer">{t("结构参考：OpenAI Whisper 介绍", "Architecture reference: OpenAI Whisper introduction")}</a>
    <p><a href="https://huggingface.co/openai/whisper-large-v3" target="_blank" rel="noreferrer">{t("版本参数：Whisper large-v3 官方模型卡", "Version parameters: official Whisper large-v3 model card")}</a></p>
    <div className="asr-open-source" aria-label={t("开源项目参考", "Open-source references")}>
      <h3>{t("开源项目参考", "Open-source references")}</h3>
      <p>{t("这些项目用于查阅真实模型、推理接口和部署方式；本实验室仍使用小型教学数据，避免把下载模型、浏览器算力和网络依赖带入首页。", "Use these projects to study real models, inference APIs, and deployment. This lab keeps a small teaching dataset so the homepage does not depend on model downloads, browser compute, or network access.")}</p>
      <ul>
        <li><a href="https://github.com/openai/whisper" target="_blank" rel="noreferrer">OpenAI Whisper</a>：{t("离线 Encoder–Decoder Transformer、多语言转写和翻译。", "offline encoder-decoder Transformer, multilingual transcription and translation.")}</li>
        <li><a href="https://github.com/modelscope/FunASR" target="_blank" rel="noreferrer">FunASR</a>：{t("中文工程链路、Paraformer、流式识别、标点和说话人处理。", "Chinese engineering pipelines, Paraformer, streaming, punctuation, and speaker processing.")}</li>
        <li><a href="https://github.com/k2-fsa/sherpa-onnx" target="_blank" rel="noreferrer">sherpa-onnx</a>：{t("端侧 ONNX 推理和 Transducer/Zipformer 等实时路线。", "edge ONNX inference and streaming Transducer/Zipformer routes.")}</li>
        <li><a href="https://github.com/Alexander-H-Liu/End-to-end-ASR-Pytorch" target="_blank" rel="noreferrer">End-to-end-ASR-Pytorch</a>：{t("注意力对齐和端到端 ASR 教学实现参考。", "a teaching reference for attention alignment and end-to-end ASR.")}</li>
      </ul>
    </div>
  </section>;
}
