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
  const t = (zh: string, en: string) => language === "zh" ? zh : en;
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
