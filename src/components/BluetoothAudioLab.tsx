import { useState } from "react";
import { ArrowLeft, Headphones, Smartphone, Radio, Speaker } from "lucide-react";
import type { Language } from "../content/knowledge";

const codecs = {
  SBC: { rates: [192, 256, 328], transport: "A2DP / BR/EDR" },
  AAC: { rates: [128, 192, 256], transport: "A2DP / BR/EDR" },
  LC3: { rates: [96, 160, 192], transport: "LE Audio / LE ISO" },
  LDAC: { rates: [330, 660, 990], transport: "A2DP / BR/EDR" }
};
type Codec = keyof typeof codecs;

export function BluetoothAudioLab({ language, onBack }: { language: Language; onBack: () => void }) {
  const text = (cn: string, en: string) => language === "zh" ? cn : en;
  const [codec, setCodec] = useState<Codec>("LC3");
  const [rate, setRate] = useState(160);
  const [loss, setLoss] = useState(5);
  const [buffer, setBuffer] = useState(40);
  const [jitter, setJitter] = useState(30);
  // Fixed teaching trace: permanent loss and missed playout deadlines are separate.
  const packets = Array.from({ length: 100 }, (_, i) => {
    const lost = (i * 37 + 17) % 100 < loss;
    const late = jitter * ((i * 29 + 11) % 100) / 99 > buffer;
    return lost ? "lost" : late ? "late" : "ready";
  });
  const lostCount = packets.filter((p) => p === "lost").length;
  const lateCount = packets.filter((p) => p === "late").length;
  const stages = [
    text("文件 / App → PCM", "File / app → PCM"),
    `${text("混音 → 编码", "Mix → encode")} (${codec})`,
    text("协议栈 → 发送队列", "Stack → TX queue"),
    `${text("无线调度", "Radio scheduling")} · ${codecs[codec].transport}`,
    text("接收缓冲 → 解码 / PLC", "RX buffer → decode / PLC"),
    text("PCM → DAC → 功放 → 发声", "PCM → DAC → amp → sound")
  ];
  const delays = [
    { label: text("帧积累与处理", "Framing & processing"), ms: 20 },
    { label: text("发送与调度", "TX & scheduling"), ms: 10 },
    { label: text("接收缓冲", "RX buffering"), ms: buffer },
    { label: text("解码与播放", "Decode & playout"), ms: 10 }
  ];

  return <main className="bluetooth-lab-page">
    <section className="sound-lab-hero">
      <button className="sound-lab-back" type="button" onClick={onBack}><ArrowLeft size={18} aria-hidden="true" />{text("返回知识库", "Back to knowledge base")}</button>
      <div><span className="section-kicker">{text("应用场景", "Applications")}</span><h1>{text("蓝牙音频链路实验室", "Bluetooth Audio Link Lab")}</h1><p>{text("从手机到耳机：把压缩、无线传输和播放时限分开看。", "From phone to headphones: separate compression, radio transport, and playout deadlines.")}</p></div>
    </section>
    <section className="bluetooth-section" aria-label={text("蓝牙音频传输流程图", "Bluetooth audio transport flow diagram")}>
      <div className="bluetooth-endpoints" aria-hidden="true"><Smartphone size={38} /><span>PCM</span><Radio size={38} /><span>{codec}</span><Headphones size={38} /><Speaker size={30} /></div>
      <h2>{text("一条完整播放链路", "The playback chain")}</h2>
      <ol className="bluetooth-flow">{stages.map((label, i) => <li key={i}><small>{String(i + 1).padStart(2, "0")}</small><span>{label}</span></li>)}</ol>
      <p>{text("箭头表示信号顺序。音乐文件通常先解码为 PCM，再编码为协商的蓝牙格式；不会默认把 MP3 文件原封不动送进耳机。通话还增加反向麦克风上行链路。", "Arrows show signal order. Music is normally decoded to PCM and re-encoded into the negotiated Bluetooth format, rather than passing an MP3 file unchanged to the headset. Calls add a reverse microphone uplink.")}</p>
    </section>
    <section className="bluetooth-section" aria-label={text("蓝牙音频实验台", "Bluetooth audio workbench")}>
      <h2>{text("负载与播放时限", "Payload and playout deadlines")}</h2>
      <p>{text("教学模型：48 kHz、16 bit、双声道 PCM = 1536 kbps。码率为双声道总量的示例配置，不代表设备必定支持。这里不实际运行 Codec，也不以模拟图评定音质。", "Teaching model: 48 kHz, 16-bit stereo PCM = 1536 kbps. Rates are example stereo totals, not guaranteed device capabilities. This lab does not execute codecs or infer audio quality from a simulated plot.")}</p>
      <div className="bluetooth-controls">
        <label>{text("编码器", "Codec")}<select aria-label={text("蓝牙编码器", "Bluetooth codec")} value={codec} onChange={(e) => { const next = e.target.value as Codec; setCodec(next); setRate(codecs[next].rates[1]); }}>{Object.keys(codecs).map((c) => <option key={c}>{c}</option>)}</select></label>
        <label>{text("编码码率", "Encoded bitrate")}<select aria-label={text("编码码率", "Encoded bitrate")} value={rate} onChange={(e) => setRate(Number(e.target.value))}>{codecs[codec].rates.map((r) => <option key={r} value={r}>{r} kbps</option>)}</select></label>
        <label><span>{text("永久丢包率", "Permanent loss")} <strong>{loss}%</strong></span><input aria-label={text("永久丢包率", "Permanent loss")} type="range" min="0" max="20" step="1" value={loss} onChange={(e) => setLoss(Number(e.target.value))} /></label>
        <label><span>{text("最大额外到达延迟", "Maximum extra arrival delay")} <strong>{jitter} ms</strong></span><input aria-label={text("最大额外到达延迟", "Maximum extra arrival delay")} type="range" min="0" max="120" step="10" value={jitter} onChange={(e) => setJitter(Number(e.target.value))} /></label>
        <label><span>{text("接收缓冲等待", "RX buffer wait")} <strong>{buffer} ms</strong></span><input aria-label={text("接收缓冲等待", "RX buffer wait")} type="range" min="10" max="160" step="10" value={buffer} onChange={(e) => setBuffer(Number(e.target.value))} /></label>
      </div>
      <dl className="bluetooth-results">
        <div><dt>{text("传输路径", "Transport")}</dt><dd>{codecs[codec].transport}</dd></div>
        <div><dt>{text("每 10 ms 平均编码负载", "Mean encoded payload per 10 ms")}</dt><dd data-testid="bluetooth-payload">{(rate * 10 / 8).toFixed(1)} B</dd></div>
        <div><dt>{text("PCM / 码流比", "PCM / encoded ratio")}</dt><dd>{(1536 / rate).toFixed(2)} : 1</dd></div>
      </dl>
      <p>{text("负载 = kbps × ms ÷ 8；未计协议头、重传和射频开销。10 ms 只是统计时间窗，不是所有 Codec 的帧长，也不是空口包大小。", "Payload = kbps × ms ÷ 8, excluding headers, retransmissions, and radio overhead. The 10 ms accounting window is not every codec's frame size or an on-air packet size.")}</p>
      <h3>{text("100 个传输单元的示意", "A 100-unit transport trace")}</h3>
      <div className="bluetooth-packets" role="img" aria-label={text(`按时 ${100 - lostCount - lateCount}，迟到 ${lateCount}，丢失 ${lostCount}`, `On time ${100 - lostCount - lateCount}, late ${lateCount}, lost ${lostCount}`)}>{packets.map((state, i) => <span key={i} className={state} aria-hidden="true">{state === "lost" ? "×" : state === "late" ? "!" : "·"}</span>)}</div>
      <p data-testid="bluetooth-packet-summary">{text(`绿色：按时 ${100 - lostCount - lateCount}；黄色 !：迟到 ${lateCount}；红色 ×：永久丢失 ${lostCount}。`, `Green: on time ${100 - lostCount - lateCount}; yellow !: late ${lateCount}; red ×: permanently lost ${lostCount}.`)}</p>
      <p>{text("增大缓冲可减少本模型的迟到单元，但永久丢包不会消失。PLC 估计缺失片段，不能恢复原始内容；连续丢包通常比同数量分散丢包更难掩盖。", "Larger buffers reduce late units in this model but cannot remove permanent losses. PLC estimates missing segments without recovering the original content; bursts are usually harder to conceal than scattered losses.")}</p>
      <h3>{text("延迟预算示例", "Example latency budget")} <output data-testid="bluetooth-latency">{40 + buffer} ms</output></h3>
      <div className="bluetooth-delay" aria-hidden="true">{delays.map((part, i) => <span key={part.label} className={`part-${i}`} style={{ flex: part.ms }} />)}</div>
      <ul className="bluetooth-delay-labels">{delays.map((part) => <li key={part.label}>{part.label}: {part.ms} ms</li>)}</ul>
      <p>{text("20 + 10 + 10 ms 是固定教学假设，总延迟再加接收缓冲，不是 Codec 的实测延迟。视频可延后显示以同步，但游戏操作反馈无法靠延迟画面解决。", "The fixed 20 + 10 + 10 ms components are teaching assumptions, not measured codec delays; RX buffering is added directly. Delaying video can synchronize playback but does not solve gaming input lag.")}</p>
    </section>
    <section className="bluetooth-section"><h2>{text("协议与编码", "Profiles and coding")}</h2><div className="bluetooth-table-wrap"><table><thead><tr><th>{text("路径", "Path")}</th><th>{text("用途", "Use")}</th><th>{text("需要区分", "Key distinction")}</th></tr></thead><tbody>
      <tr><th>A2DP</th><td>{text("经典蓝牙音乐：SBC、AAC、LDAC、aptX 系列", "Classic music: SBC, AAC, LDAC, aptX family")}</td><td>{text("SBC 为基础支持；其他格式需双方共同支持。", "SBC is the baseline; optional codecs require support at both ends.")}</td></tr>
      <tr><th>HFP / HSP</th><td>{text("HFP 双向通话；HSP 为较早的耳机配置", "HFP for duplex calls; HSP is an older headset profile")}</td><td>{text("CVSD、mSBC 等能力随版本和设备而异；不是 A2DP 音乐链路。", "Codec capabilities such as CVSD and mSBC depend on version and device; this is not the A2DP music path.")}</td></tr>
      <tr><th>LE Audio / LC3</th><td>{text("音乐、通话、助听、多流与广播", "Music, calls, hearing assistance, multistream, broadcast")}</td><td>{text("LC3 有 7.5 / 10 ms 帧间隔；帧长不是端到端延迟。", "LC3 has 7.5 / 10 ms frame intervals; frame duration is not end-to-end latency.")}</td></tr>
    </tbody></table></div><p>{text("压缩原理参见音频编解码卡片。本页关注连接与产品体验；不能只按码率数字为不同 Codec 的音质排名。", "See Audio Codecs for compression internals. This page focuses on connections and product behavior; bitrate alone cannot rank codec quality.")}</p></section>
    <section className="bluetooth-section"><h2>{text("实际设备场景", "Practical scenarios")}</h2><div className="bluetooth-knowledge-grid">
      {[
        [text("音乐耳机 / 音箱", "Music headphones / speakers"), text("先核对协商结果，再观察遮挡、干扰和自动降码率；高码率不是稳定性的保证。", "Check negotiation, obstructions, interference, and adaptive bitrate; high bitrate does not guarantee stability.")],
        [text("车载通话", "Car calls"), text("麦克风上行和通话下行同时工作；AEC、拾音和链路都影响清晰度。", "Microphone uplink and call downlink work together. AEC, capture, and transport all affect clarity.")],
        [text("游戏与视频", "Gaming and video"), text("视频可做音画同步补偿；游戏要测从操作到声音的完整延迟。", "Video can compensate AV timing; games need full action-to-sound latency measured.")],
        [text("TWS 左右耳", "TWS earbuds"), text("共同播放时间、时钟漂移补偿和数据分发保证同步。经典 TWS 可用转发或双连接；LE Audio 提供多流机制。", "Shared playout time, drift correction, and distribution maintain sync. Classic TWS may relay or use dual links; LE Audio provides multistream mechanisms.")],
        [text("助听与公共广播", "Hearing assistance and broadcast"), text("LE Audio 支持助听相关配置；Auracast 让多个兼容接收端收听同一节目。", "LE Audio supports hearing-related profiles; Auracast lets compatible receivers join a shared broadcast.")],
        [text("USB / Wi-Fi 对比", "USB / Wi-Fi comparison"), text("USB Audio 为有线音频接口；Wi-Fi 通常带宽更大，但同步与缓冲策略不同。技术名称不能单独决定音质或延迟。", "USB Audio is wired; Wi-Fi generally offers more bandwidth but uses different sync and buffering. Transport names alone do not determine quality or delay.")]
      ].map(([title, body]) => <article key={title}><h3>{title}</h3><p>{body}</p></article>)}</div></section>
    <section className="bluetooth-section"><h2>{text("参考资料", "References")}</h2><p><a href="https://www.bluetooth.com/learn-about-bluetooth/feature-enhancements/le-audio/">Bluetooth SIG: LE Audio</a> · <a href="https://www.bluetooth.com/blog/a-technical-overview-of-lc3/">LC3 technical overview</a> · <a href="https://www.bluetooth.com/wp-content/uploads/2023/07/LC3Characterization_WP.pdf">LC3 performance characterization</a></p></section>
  </main>;
}
