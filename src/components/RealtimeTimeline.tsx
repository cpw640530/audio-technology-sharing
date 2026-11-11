import { useState } from "react";
import type { Language } from "../content/knowledge";
import { text } from "../content/language";

export function simulateRealtime(processing: number, scheduling: number, capacity: number) {
  if (!Number.isFinite(processing) || processing < 1 || processing > 64 || !Number.isFinite(scheduling) || scheduling < 0 || scheduling > 24 || !Number.isInteger(capacity) || capacity < 1 || capacity > 6) throw new RangeError("Invalid scheduling parameters");
  let finish = 0;
  let pending: number[] = [];
  // Capacity includes the active block; a full application queue rejects the arriving block.
  return Array.from({ length: 8 }, (_, index) => {
    const arrival = (index + 1) * 32;
    pending = pending.filter(end => end > arrival);
    if (pending.length >= capacity) return { arrival, start: null, end: null, occupancy: pending.length };
    const start = Math.max(arrival, finish) + scheduling;
    finish = start + processing;
    pending.push(finish);
    return { arrival, start, end: finish, occupancy: pending.length };
  });
}

export function RealtimeTimeline({ language }: { language: Language }) {
  const t = (zh: string, en: string, ja: string, ko: string) => text(language, zh, en, ja, ko);
  const [processing, setProcessing] = useState(12);
  const [scheduling, setScheduling] = useState(4);
  const [capacity, setCapacity] = useState(2);
  const rows = simulateRealtime(processing, scheduling, capacity);
  const dropped = rows.filter(row => row.end === null).length;
  const maxDelay = Math.max(...rows.map(row => row.end === null ? 0 : row.end - row.arrival));
  const maxTime = Math.ceil(Math.max(288, ...rows.map(row => row.end ?? row.arrival)) / 64) * 64;
  const x = (ms: number) => 55 + ms / maxTime * 600;
  const title = t("32 ms 一块：数据会不会越积越多？", "A block every 32 ms: does work pile up?", "32 ms ごとのブロック：処理は滞る？", "32 ms마다 한 블록: 작업이 쌓일까?");
  const waiting = t("等待（排队 + 调度）", "Waiting (queue + scheduling)", "待機（キュー + スケジュール）", "대기 (큐 + 스케줄링)");
  const work = t("处理", "Processing", "処理", "처리");
  const drop = t("队列满，丢弃新块", "Queue full: new block dropped", "満杯：新ブロックを破棄", "큐 가득 참: 새 블록 폐기");
  return <section className="realtime-timeline" aria-label={title}>
    <h2>{title}</h2>
    <p>{t("16 kHz 单声道，每块 512 个样本 = 32 ms 音频。第一块在 32 ms 攒齐，之后每隔 32 ms 到来一块；每行追踪其中一块，不是一个声道。", "16 kHz mono: 512 samples = 32 ms of audio. The first block is ready at 32 ms, followed by one every 32 ms. Each row tracks a block, not a channel.", "16 kHz モノラル：512 サンプル = 32 ms。最初のブロックは 32 ms で揃い、以後 32 ms ごとに到着。各行はチャンネルではなく 1 ブロック。", "16 kHz 모노: 512샘플 = 32 ms. 첫 블록은 32 ms에 준비되고 이후 32 ms마다 도착한다. 각 행은 채널이 아닌 한 블록이다.")}</p>
    <div className="codec-inline-controls">
      <label>{t("每块处理耗时", "Processing per block", "ブロックの処理時間", "블록당 처리 시간")}<select value={processing} onChange={event => setProcessing(Number(event.target.value))}>{[4, 12, 24, 32, 40, 64].map(n => <option key={n} value={n}>{n} ms</option>)}</select></label>
      <label>{t("每块启动前的调度等待", "Scheduling wait per block", "処理開始前の待機", "블록별 스케줄링 대기")}<select value={scheduling} onChange={event => setScheduling(Number(event.target.value))}>{[0, 4, 12, 24].map(n => <option key={n} value={n}>{n} ms</option>)}</select></label>
      <label>{t("容量（块，含处理中）", "Capacity (blocks, including active)", "容量（処理中を含むブロック数）", "용량 (처리 중 포함 블록 수)")}<select value={capacity} onChange={event => setCapacity(Number(event.target.value))}>{[1, 2, 4, 6].map(n => <option key={n} value={n}>{n}</option>)}</select></label>
    </div>
    <div className="realtime-timeline-legend"><span className="wait">{waiting}</span><span className="work">{work}</span><span className="drop">× {drop}</span></div>
    <div className="realtime-timeline-scroll" tabIndex={0} role="region" aria-label={title}>
      <svg viewBox="0 0 720 330" role="img" aria-label={title}>
        {Array.from({ length: 9 }, (_, n) => n * maxTime / 8).map(ms => <g key={ms}><line className="grid" x1={x(ms)} x2={x(ms)} y1="30" y2="278" /><text x={x(ms)} y="300" textAnchor="middle">{ms}</text></g>)}
        <text x="690" y="20" textAnchor="middle">Q</text>
        {rows.map((row, n) => <g key={n}>
          <text x="30" y={51 + n * 29} textAnchor="middle">{n + 1}</text>
          <line className="arrival" x1={x(row.arrival)} x2={x(row.arrival)} y1={36 + n * 29} y2={58 + n * 29} />
          {row.start !== null && row.end !== null ? <>
            <rect className="wait" x={x(row.arrival)} y={40 + n * 29} width={x(row.start) - x(row.arrival)} height="14" />
            <rect className="work" x={x(row.start)} y={40 + n * 29} width={x(row.end) - x(row.start)} height="14" />
          </> : <text className="drop" x={x(row.arrival)} y={54 + n * 29} textAnchor="middle">×</text>}
          <text x="690" y={51 + n * 29} textAnchor="middle">{row.occupancy}/{capacity}</text>
        </g>)}
        <text x="355" y="325" textAnchor="middle">{t("时间 / ms", "Time / ms", "時間 / ms", "시간 / ms")}</text>
      </svg>
    </div>
    <p className="realtime-timeline-caption">{t("竖线：块到达；绿色条末端：处理完成。Q 是到达后尚未完成的块数 / 容量。横轴随总时长自动调整。", "Vertical marks: arrivals; green bar ends: completions. Q: unfinished blocks after arrival / capacity. The time axis adapts to total duration.", "縦線：到着、緑の終端：完了。Q：到着後の未完了ブロック数 / 容量。時間軸は全体時間に応じて変わる。", "세로선: 도착, 초록 막대 끝: 완료. Q: 도착 후 미완료 블록 수 / 용량. 시간축은 전체 길이에 맞춰 바뀐다.")}</p>
    <output className="codec-inline-result" aria-live="polite">
      <strong>{t("8 块中的丢弃数", "Dropped out of 8 blocks", "8 ブロック中の破棄数", "8블록 중 폐기 수")}: {dropped}</strong>
      <span>{t("已接收块的最大到达至完成时间", "Max arrival-to-completion time of accepted blocks", "受理ブロックの最大到着〜完了時間", "수락된 블록의 최대 도착~완료 시간")}: {maxDelay} ms</span>
    </output>
    <p>{processing + scheduling > 32
      ? t("每块占用时间超过 32 ms，持续输入时处理跟不上。更大的队列可以推迟丢块，但可能积累更多等待，不能提高处理速度。", "Each block occupies more than 32 ms, so sustained input outpaces processing. More capacity can postpone drops but may accumulate more waiting; it does not speed up processing.", "1 ブロックの占有時間が 32 ms を超え、連続入力に追いつかない。容量を増やすと破棄を遅らせるが、待機が増え、処理自体は速くならない。", "블록당 점유 시간이 32 ms를 넘어 지속 입력을 따라가지 못한다. 용량을 늘리면 폐기를 늦출 수 있지만 대기가 늘 수 있고 처리 속도는 빨라지지 않는다.")
      : t("本例处理能跟上输入。容量是上限，不是必须攒满的目标；队列不积压时，单纯增大容量不会自动增加这里的等待。", "Processing keeps pace in this model. Capacity is a limit, not a fill target; enlarging an empty queue does not automatically add waiting.", "この例では入力に追いつく。容量は上限であり満杯まで待つ目標ではない。滞留がなければ容量を増やしても待機は増えない。", "이 모델에서는 입력을 따라간다. 용량은 한도이지 채워야 하는 목표가 아니다. 적체가 없으면 용량만 늘려도 대기가 증가하지 않는다.")}</p>
    <p className="realtime-timeline-caption">{t("教学假设：单工作线程、FIFO，每块启动前固定等待，满时丢弃新块；不是 ALSA 环形缓冲仿真。这里的丢块不直接等于硬件 XRUN，到达至完成时间也不是端到端延迟，还未包含采集攒块、编码、网络和播放缓冲。", "Teaching assumptions: one worker, FIFO, a fixed wait before each job, and drop-new on full. This is not an ALSA ring-buffer simulation. Drops are not hardware XRUNs; arrival-to-completion time excludes capture accumulation, coding, network, and playback buffers.", "教材モデル：単一ワーカー、FIFO、各処理前の固定待機、満杯なら新規破棄。ALSA リングの模擬ではない。破棄はハードウェア XRUN とは別で、表示時間は収録・符号化・通信・再生バッファーの遅延を含まない。", "교육 가정: 단일 작업자, FIFO, 작업 전 고정 대기, 가득 차면 새 블록 폐기. ALSA 링 버퍼 시뮬레이션이 아니다. 폐기는 하드웨어 XRUN과 다르며 표시 시간에는 캡처 수집·인코딩·네트워크·재생 버퍼 지연이 포함되지 않는다.")}</p>
  </section>;
}
