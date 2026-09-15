import { useState, type PointerEvent } from "react";
import { ArrowLeft } from "lucide-react";
import type { Language } from "../content/knowledge";

export function RobotAudioLab({ language, onBack }: { language: Language; onBack: () => void }) {
  const t = (zh: string, en: string) => language === "zh" ? zh : en;
  const [view, setView] = useState("body");
  const [part, setPart] = useState(0);
  const [stage, setStage] = useState(0);
  const [array, setArray] = useState(true);
  const [moving, setMoving] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [heading, setHeading] = useState(0);
  const [person, setPerson] = useState({ x: 190, y: 115 });
  const [noise, setNoise] = useState({ x: 555, y: 165 });
  const [dragging, setDragging] = useState<"person" | "noise" | null>(null);
  const bearing = Math.atan2(person.x - 360, 285 - person.y) * 180 / Math.PI;
  const relative = ((bearing - heading + 540) % 360) - 180;
  const reflectionY = person.y + (285 - person.y) * (person.x - 30) / (person.x + 300);
  const parts = [
    [t("头部麦克风", "Head microphones"), t("麦克风将声压变为信号，经 ADC 或数字麦接口得到 PCM。多麦必须同步采集，阵列几何也要标定。", "Microphones convert pressure to signals, then ADCs or digital microphone interfaces produce PCM. Arrays require synchronized channels and calibrated geometry.")],
    [t("视觉与姿态", "Vision and pose"), t("摄像头确认人物，姿态信息把机器人坐标下的声音方向转换到场景坐标；声音本身不能确认身份。", "Vision confirms a person; pose transforms acoustic directions from robot to world coordinates. Sound direction alone does not establish identity.")],
    [t("扬声器", "Loudspeaker"), t("TTS 经 DAC、功放与扬声器播报；实际播放 PCM 同时送入 AEC 作参考，需对齐采集延迟。", "TTS reaches the speaker through DAC and amplifier. The actual render PCM also feeds AEC as a reference, aligned with capture latency.")],
    [t("处理模块", "Processing module"), t("DSP/SoC 执行前端增强、ASR 和任务逻辑，部分模型也可放在服务器。网络、缓冲和推理都会增加延迟。", "DSP/SoC handles enhancement, ASR, and task logic; some models may run on a server. Network, buffering, and inference all add latency.")],
    [t("关节与电机", "Joints and motors"), t("电机、风扇和结构振动形成自噪声。隔振、麦克风布局与运动状态辅助降噪应一起考虑；AEC 不能消除所有电机噪声。", "Motors, fans, and structural vibration create self-noise. Isolation, microphone placement, and motion-aware suppression work together; AEC cannot remove all motor noise.")]
  ];
  const stages = [
    [t("采集 PCM", "Capture PCM"), array ? t("同步多通道采集，同时保留通道空间信息。", "Capture synchronized channels while preserving spatial information.") : t("单通道仍可识别语音，但没有阵列到达时间差。", "One channel can support ASR, but supplies no array arrival-time differences.")],
    ["AEC", playing ? t("播报已开启：用播放参考估计回声路径并减去回声；双讲时应保护用户语音。", "Playback is active: estimate the echo path from the render reference and subtract echo; preserve user speech during double-talk.") : t("当前未播报，无新增自身播放回声；实际系统仍需处理停止后的回声拖尾。", "No playback is active. Real systems must still handle the echo tail after playback stops.")],
    [t("降噪", "Noise suppression"), moving ? t("运动状态增加电机和结构噪声，可能掩盖人声。先改善机械隔离，再调降噪，过强会损伤语音。", "Motion adds motor and structural noise that can mask speech. Improve mechanical isolation before tuning suppression; aggressive processing can damage speech.") : t("静止仍可能有风扇和环境干扰，降噪目标是改善可懂度，不保证完全静音。", "Fans and ambient interference may remain when stationary. Suppression aims to improve intelligibility, not guarantee silence.")],
    [array ? t("定位 / 定向拾音", "Locate / beamform") : t("单麦语音", "Single-mic speech"), array ? t("通过通道时间差估计方向，波束形成增强目标方向。下图角度由拖动位置计算，不是真实估计算法输出；波束形状也是示意。", "Estimate direction from channel delays and beamform toward the target. The angle below is geometric ground truth from dragged positions, not algorithm output; the beam is illustrative.") : t("单麦模式跳过阵列定位和波束形成，不显示方向估计。", "Single-mic mode bypasses array localization and beamforming; no direction estimate is shown.")],
    [t("唤醒 / ASR", "Wake / ASR"), t("唤醒触发会话，ASR 将增强语音转为文字；噪声、口音与重叠说话都可能造成错误。", "Wake detection starts a session; ASR converts enhanced speech into text. Noise, accents, and overlapping speakers can cause errors.")],
    [t("意图 / 任务", "Intent / task"), t("结合视觉和上下文确定对象与动作，再交给控制系统检查权限、障碍和安全约束。语音“停止”不能替代硬件急停。", "Use vision and context to resolve the object and action, then check permissions, obstacles, and safety constraints in the controller. Spoken stop is not a substitute for a hardware emergency stop.")],
    [t("TTS / 播放", "TTS / playback"), t("合成确认语音，经 DAC、功放和扬声器输出。打断交互还需检测用户插话、取消播报队列并处理回声拖尾。", "Synthesize a response and play it through DAC, amplifier, and speaker. Barge-in also requires detecting user speech, cancelling queued playback, and handling echo tails.")]
  ];
  function move(event: PointerEvent<SVGSVGElement>) {
    if (!dragging) return;
    const matrix = event.currentTarget.getScreenCTM();
    if (!matrix) return;
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
    const next = { x: Math.max(65, Math.min(655, point.x)), y: Math.max(75, Math.min(385, point.y)) };
    (dragging === "person" ? setPerson : setNoise)(next);
  }
  return <main className="robot-lab" aria-label={t("机器人音频实验室", "Robot Audio Lab")}>
    <section className="sound-lab-hero">
      <button className="sound-lab-back" onClick={onBack}><ArrowLeft size={18} />{t("返回知识库", "Back to knowledge base")}</button>
      <div><span className="details-category">{t("应用场景", "Applications")}</span><h1>{t("机器人音频实验室", "Robot Audio Lab")}</h1><p>{t("从身体部件到空间交互：听到声音、找到方向、理解指令，再决定行动。", "From anatomy to spatial interaction: hear, locate, understand, then decide on an action.")}</p></div>
    </section>
    <div className="robot-buttons" aria-label={t("视图", "Views")}>{["body", "scene"].map((id, i) => <button key={id} aria-pressed={view === id} onClick={() => setView(id)}>{i === 0 ? t("机器人结构", "Robot anatomy") : t("工作场景", "Working scene")}</button>)}</div>
    <div className="robot-controls">
      <label>{t("麦克风数量", "Microphones")}<select value={array ? "4" : "1"} onChange={e => setArray(e.target.value === "4")}><option value="1">{t("单麦", "Single mic")}</option><option value="4">{t("四麦阵列", "Four-mic array")}</option></select></label>
      <label><input type="checkbox" checked={moving} onChange={e => setMoving(e.target.checked)} />{t("运动状态", "In motion")}</label>
      <label><input type="checkbox" checked={playing} onChange={e => setPlaying(e.target.checked)} />{t("播报状态（示意）", "Playback state (illustration)")}</label>
      {view === "scene" && <label>{t("机器人朝向", "Robot heading")} {heading}°<input aria-label={t("机器人朝向", "Robot heading")} type="range" min="-180" max="180" value={heading} onChange={e => setHeading(Number(e.target.value))} /></label>}
    </div>
    <figure className={`robot-figure robot-figure-${view}`}>
      {view === "body" ? <svg viewBox="0 0 720 450" role="img" aria-label={t("机器人音频部件结构图", "Robot audio anatomy diagram")}>
        <rect x="275" y="40" width="170" height="110" rx="35" fill="#c4d8dd" stroke="#536b73" strokeWidth="3" />
        <rect x="292" y="72" width="136" height="49" rx="16" fill="#182e35" /><circle cx="327" cy="95" r="8" fill="#75dec8" /><circle cx="393" cy="95" r="8" fill="#75dec8" />
        <rect x="335" y="150" width="50" height="25" fill="#71868e" /><rect x="262" y="175" width="196" height="150" rx="38" fill="#d9e4e6" stroke="#536b73" strokeWidth="3" />
        <rect x="305" y="197" width="110" height="38" rx="6" fill="#315967" />{[205,215,225].map(y => <path key={y} d={`M320 ${y} H400`} stroke="#a9d3d9" strokeWidth="2" />)}
        <rect x="316" y="255" width="88" height="42" rx="5" fill="#477a65" /><text x="360" y="281" fill="white" textAnchor="middle">DSP / SoC</text>
        <path d="M260 191 Q218 207 232 293 M460 191 Q502 207 488 293" fill="none" stroke="#7e969e" strokeWidth="25" strokeLinecap="round" />
        <path d="M310 328 V385 H290 M410 328 V385 H430" fill="none" stroke="#7e969e" strokeWidth="30" strokeLinecap="round" />
        {moving && <path d="M214 301 l-12 12 12 12 M506 301 l12 12 -12 12 M274 354 l-12 12 12 12" fill="none" stroke="#d57739" strokeWidth="4" />}
        {(array ? [295,335,385,425] : [360]).map(x => <circle key={x} cx={x} cy="58" r="5" fill="#148372" />)}
        {playing && <path d="M417 202 Q450 214 417 232 M429 192 Q475 215 429 243" fill="none" stroke="#d57739" strokeWidth="3" />}
        {parts.map(([name], i) => { const positions = [[110,55,275,58],[575,115,430,95],[110,215,305,215],[575,278,404,278],[110,365,295,365]]; const [x,y,tx,ty] = positions[i]; return <g key={name} role="button" tabIndex={0} aria-label={name} aria-pressed={part === i} onClick={() => setPart(i)} onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setPart(i); } }} className="robot-hotspot"><path d={`M${x} ${y} L${tx} ${ty}`} stroke="#67858a" /><rect x={x-85} y={y-20} width="170" height="40" rx="6" fill={part === i ? "#226d60" : "#e0eeee"} /><text x={x} y={y+5} textAnchor="middle" fill={part === i ? "white" : "#163a35"}>{name}</text></g>; })}
      </svg> : <svg viewBox="0 0 720 450" role="img" aria-label={t("机器人俯视工作场景", "Robot top-down working scene")} onPointerMove={move} onPointerUp={() => setDragging(null)} onPointerCancel={() => setDragging(null)}>
        <rect x="25" y="30" width="670" height="385" rx="8" fill="#edf3f3" stroke="#97b1b9" strokeWidth="7" />
        <text x="45" y="56" fill="#506a70">{t("房间 / 俯视", "Room / top view")}</text>
        {array && <g transform={`translate(360 285) rotate(${bearing})`}><path d="M0 0 L-75 -180 Q0 -214 75 -180 Z" fill="#148372" opacity="0.13" /><path d="M0 0 V-195" stroke="#148372" strokeWidth="2" strokeDasharray="6 5" /></g>}
        <path d={`M${noise.x} ${noise.y} L360 285`} stroke="#ce874f" strokeDasharray="5 6" />
        <path d={`M${person.x} ${person.y} L360 285`} stroke="#168777" strokeWidth="2" />
        <path d={`M${person.x} ${person.y} L30 ${reflectionY} L360 285`} stroke="#899cad" fill="none" strokeDasharray="3 7" />
        <g transform={`translate(360 285) rotate(${heading})`}><ellipse rx="39" ry="47" fill="#bdd6db" stroke="#385c67" strokeWidth="3" /><path d="M-13 -22 L0 -39 L13 -22" fill="#285d68" />{(array ? [-24,-8,8,24] : [0]).map(x => <circle key={x} cx={x} cy="-10" r="4" fill="#138474" />)}<rect x="-14" y="18" width="28" height="10" rx="3" fill="#395865" /></g>
        {playing && <path d="M377 306 Q429 270 380 273" stroke="#bf6633" strokeWidth="3" fill="none" />}
        {moving && <path d="M308 310 l-12 10 12 10 M412 310 l12 10 -12 10" stroke="#bf6633" strokeWidth="4" fill="none" />}
        {(["person", "noise"] as const).map(id => { const p = id === "person" ? person : noise; const label = id === "person" ? t("用户", "Person") : t("噪声源", "Noise source"); return <g key={id} role="button" tabIndex={0} aria-label={label} transform={`translate(${p.x} ${p.y})`} className="robot-drag" onPointerDown={e => { e.currentTarget.ownerSVGElement?.setPointerCapture(e.pointerId); setDragging(id); }} onKeyDown={e => { const delta = { ArrowLeft: [-10,0], ArrowRight: [10,0], ArrowUp: [0,-10], ArrowDown: [0,10] }[e.key]; if (delta) { e.preventDefault(); (id === "person" ? setPerson : setNoise)({x: Math.max(65, Math.min(655,p.x+delta[0])), y: Math.max(75, Math.min(385,p.y+delta[1]))}); } }}><circle r="24" fill={id === "person" ? "#287966" : "#a96735"} /><text textAnchor="middle" y="5" fill="white">{id === "person" ? "P" : "N"}</text><text textAnchor="middle" y="43" fill="#284c50">{label}</text></g>; })}
      </svg>}
      <figcaption>{view === "body" ? parts[part][1] : <><strong data-testid="robot-bearing">{array ? t(`相对方向（几何真值）：${relative.toFixed(0)}°`, `Relative direction (geometric ground truth): ${relative.toFixed(0)}°`) : t("单麦：不提供阵列定位", "Single mic: array localization unavailable")}</strong><span>{t("绿色：直达声 / 示意波束；灰色虚线：可能的反射路径；橙色：噪声与自身播放回声。图中没有运行声学求解或真实定位。", "Green: direct sound / illustrative beam; gray dots: a possible reflection path; orange: noise and self-playback echo. No acoustic solver or real localization runs here.")}</span></>}</figcaption>
    </figure>
    <section className="robot-processing" aria-label={t("处理链路", "Processing chain")}><h2>{t("当前场景的处理链路", "Processing chain for this scene")}</h2><div className="robot-flow">{stages.map(([name], i) => <button key={i} onClick={() => setStage(i)} aria-pressed={stage === i}><small>{i + 1}</small>{name}{i < stages.length - 1 && <span aria-hidden="true"> →</span>}</button>)}</div><p className="robot-reference">{t("实际播放 PCM → AEC 参考输入；环境声音检测可从采集侧并行分支。", "Actual render PCM → AEC reference input; environmental sound detection can branch from capture.")}</p><h3>{stages[stage][0]}</h3><p>{stages[stage][1]}</p><p>{t("此处为示例串联链路。定位、降噪与波束形成也可并行或联合实现；运动状态仅显示干扰来源，不模拟识别率。", "This is an illustrative serial chain. Localization, denoising, and beamforming can also run in parallel or jointly. Motion state highlights interference sources without simulating recognition accuracy.")}</p></section>
    <section><h2>{t("应用与工程检查", "Applications and engineering checks")}</h2><div className="robot-table"><table><thead><tr>{[t("场景", "Scene"),t("音频的作用", "Audio role"),t("检查重点", "What to check")].map(s => <th key={s}>{s}</th>)}</tr></thead><tbody>
      <tr><td>{t("服务与陪伴", "Service and companionship")}</td><td>{t("呼叫定位、对话、播报打断", "Locate calls, converse, handle barge-in")}</td><td>{t("误唤醒、字错率、首响应延迟", "False wakes, word error rate, first-response latency")}</td></tr>
      <tr><td>{t("移动作业", "Mobile operation")}</td><td>{t("边走边听，声音与视觉协同", "Listen in motion, combine sound and vision")}</td><td>{t("不同转速下自噪声、定位误差、时间同步", "Self-noise across motor speeds, angular error, synchronization")}</td></tr>
      <tr><td>{t("巡检与远程协作", "Inspection and telepresence")}</td><td>{t("异常声音提示、远程双向通话", "Unusual-sound alerts and two-way calls")}</td><td>{t("误报/漏报、丢包、隐私；异常需进一步核实", "False/missed alerts, packet loss, privacy; verify anomalies")}</td></tr>
    </tbody></table></div><p>{t("算法源码参考：", "Algorithm source reference: ")}<a href="https://github.com/introlab/odas" target="_blank" rel="noreferrer">ODAS</a>{t(" 提供声源定位、跟踪、分离与后滤波；本实验室没有加载该引擎。", " provides localization, tracking, separation, and post-filtering; this lab does not load that engine.")}</p></section>
  </main>;
}
