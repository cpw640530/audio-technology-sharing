import { useState } from "react";
import { ArrowRight } from "lucide-react";
import type { AiAudioLabId, Language } from "../content/knowledge";

export function AiAudioOverview({ language, onOpen }: { language: Language; onOpen?: (id: AiAudioLabId) => void }) {
  const t = (zh: string, en: string) => language === "zh" ? zh : en;
  const [task, setTask] = useState(0);
  const tasks = [
    { name: t("识别内容", "Recognize"), steps: [t("语音或环境声 PCM", "Speech or environmental PCM"), t("log-Mel 或学习型波形表示", "Log-Mel or learned waveform features"), t("识别或分类模型", "Recognition or classification model"), t("文字、事件标签", "Text or event labels"), t("字幕、玻璃破碎提醒", "Captions, glass-break alerts")], metric: t("ASR 看 WER/CER；事件识别看精确率、召回率和误报。", "ASR: WER/CER. Event detection: precision, recall and false alarms."), links: [["asr", "ASR"], ["event", t("声音事件识别", "Sound events")]] },
    { name: t("改善声音", "Enhance"), steps: [t("含噪或混响 PCM", "Noisy or reverberant PCM"), t("波形或复数频谱", "Waveform or complex spectrum"), t("掩码、滤波或波形估计", "Mask, filter or waveform estimation"), t("重建增强 PCM", "Reconstructed enhanced PCM"), t("通话、会议、助听", "Calls, meetings, hearing assistance")], metric: t("比较残留噪声、语音失真、可懂度和延迟；信噪比提升不等于听感一定更好。", "Compare residual noise, speech distortion, intelligibility and latency; better SNR need not mean better perceived quality."), links: [["enhancement", t("AI 音频增强", "AI enhancement")]] },
    { name: t("生成声音", "Generate"), steps: [t("文字、音色或音乐条件", "Text, voice or music conditions"), t("文本 token、音素或条件向量", "Text tokens, phonemes or conditioning"), t("声学或生成模型", "Acoustic or generative model"), t("声码器或 codec 解码为 PCM", "Vocoder or codec decodes to PCM"), t("语音播报、音乐创作", "Speech synthesis, music creation")], metric: t("TTS 关注发音与韵律；音乐生成关注结构与条件一致性。都需结合听评，不能只看单一分数。", "TTS emphasizes pronunciation and prosody; music emphasizes structure and conditioning. Listening evaluation is needed alongside metrics."), links: [["tts", "TTS"], ["generation", t("音频生成", "Audio generation")]] },
    { name: t("压缩声音", "Compress"), steps: [t("原始 PCM", "Original PCM"), t("编码器学习连续潜变量", "Encoder learns continuous latents"), t("量化为离散索引并封装", "Quantize to indices and package"), t("匹配的解码器重建 PCM", "Matching decoder reconstructs PCM"), t("低码率通信或生成模型表示", "Low-bitrate communication or generative representations")], metric: t("比较码率、重建质量、延迟与算力；离散 token 不是文字，压缩通常有损。", "Compare bitrate, quality, latency and compute; discrete tokens are not text, and compression is usually lossy."), links: [["codec", t("AI 音频编码", "Neural audio coding")]] }
  ];
  const active = tasks[task];
  return <section className="ai-denoise-walkthrough ai-overview" aria-label={t("AI 如何处理声音", "How AI processes sound")}>
    <h2>{t("AI 如何处理声音", "How AI processes sound")}</h2>
    <p>{t("对计算机来说，声音是一串随时间变化的数字。AI 从数据中学习规律，把输入映射为文字、标签、更清晰的声音、新声音或紧凑码流。先确定任务，再选择表示和模型。", "To a computer, sound is a sequence of numbers over time. AI learns mappings to text, labels, enhanced or new sound, or compact streams. Choose the task first, then the representation and model.")}</p>
    <div className="robot-buttons">{tasks.map((item, i) => <button key={i} aria-pressed={task === i} onClick={() => setTask(i)}>{item.name}</button>)}</div>
    <ol className="ai-article-flow" aria-label={t("任务总览流程", "Task overview flow")}>{active.steps.map((value, i) => <li key={i}><span>{[t("输入", "Input"), t("表示", "Representation"), t("模型处理", "Model processing"), t("输出与后处理", "Output and post-processing"), t("应用", "Application")][i]}</span><strong>{value}</strong></li>)}</ol>
    <p>{active.metric}</p>
    {onOpen && <div className="robot-buttons">{active.links.map(([id, label]) => <button key={id} onClick={() => onOpen(id as AiAudioLabId)}>{t("进入", "Open")} {label}<ArrowRight size={16} aria-hidden="true" /></button>)}</div>}
    <h3>{t("表示不是固定流水线", "Representations are not a fixed pipeline")}</h3>
    <p>{t("PCM 是振幅序列；STFT 保留时间与频率结构；log-Mel 汇总频带并取对数；embedding 是模型学到的向量；音频 token 是离散索引。它们按任务选用，不需要依次全部经过。MFCC 不是必经步骤，频谱也不只是拿来做图片识别。", "PCM is an amplitude sequence; STFT captures time-frequency structure; log-Mel aggregates bands and takes logs; embeddings are learned vectors; audio tokens are discrete indices. Tasks select among them, rather than passing through all of them. MFCC is optional, and spectra are not simply pictures for image recognition.")}</p>
    <div className="denoise-explanation">
      <div><h3>{t("训练：学习参数", "Training: learn parameters")}</h3><p>{t("数据与目标 → 模型预测 → 损失函数比较 → 反向传播更新权重 → 重复。降噪可用带噪与干净配对信号；自监督任务也可从数据自身构造目标。", "Data and targets → prediction → loss comparison → backpropagation updates weights → repeat. Denoising may use noisy/clean pairs; self-supervision can derive targets from the data itself.")}</p></div>
      <div><h3>{t("推理：使用参数", "Inference: use parameters")}</h3><p>{t("新输入 → 已训练模型 → 结果。通常固定权重。修改演示滑块或查看中间结果不等于训练；结果也可能因噪声、口音或数据分布变化出错。", "New input → trained model → result, usually with fixed weights. Inspecting intermediates or moving demo sliders is not training. Noise, accents or distribution shifts can still cause errors.")}</p></div>
      <div><h3>{t("评价：检查泛化", "Evaluation: check generalization")}</h3><p>{t("使用未参与训练的测试数据，按任务检查质量，并测量目标设备的延迟、内存和功耗。教学模拟不能证明真实模型的准确率。", "Use held-out test data and task-specific quality metrics, then measure latency, memory and power on the target device. A teaching simulation cannot establish real-model accuracy.")}</p></div>
    </div>
    <h3>{t("落地例子：设备听懂一句指令", "Deployment: a device follows a spoken command")}</h3>
    <ol className="ai-article-flow" aria-label={t("语音助手工程链路", "Voice assistant pipeline")}>{[
      [t("硬件采集", "Capture hardware"), t("麦克风 → ADC → PCM", "Microphone → ADC → PCM")],
      [t("音频前处理", "Audio front end"), t("按需 AEC、降噪与增益控制", "AEC, denoising and gain control as needed")],
      ["ASR", t("语音 → 文字", "Speech → text")],
      [t("应用理解", "Application understanding"), t("意图与参数 → 执行动作", "Intent and arguments → action")],
      [t("TTS 与播放", "TTS and playback"), t("回复文本 → PCM → DAC / 功放 / 扬声器", "Reply → PCM → DAC / amplifier / speaker")]
    ].map(([label, body]) => <li key={label}><span>{label}</span><strong>{body}</strong></li>)}</ol>
    <p>{t("这是模块化语音助手的一种实现；理解与执行不属于 ASR，端到端语音模型也可以绕过显式文本。总延迟还包含采集、缓冲、网络和播放，不能只看模型推理时间。", "This is one modular assistant design. Understanding and execution are not ASR; end-to-end speech models may bypass explicit text. Overall latency also includes capture, buffers, network and playback, not just inference.")}</p>
  </section>;
}
