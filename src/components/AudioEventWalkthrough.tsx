import { useState } from "react";
import type { Language } from "../content/knowledge";
import { text } from "../content/language";

// Synthetic frame-score presets for generic postprocessing only; no ATST-F inference runs here.
const examples = [
  { names: ["哭声", "Baby cry", "泣き声", "울음소리"], scores: [.05, .18, .42, .72, .88, .82, .65, .35, .15, .10, .12, .08], reference: [[2, 7]] },
  { names: ["玻璃破碎", "Glass break", "ガラス破損", "유리 파손"], scores: [.08, .12, .15, .66, .12, .92, .15, .08, .07, .05, .10, .06], reference: [[5, 6]] },
  { names: ["狗叫声", "Dog bark", "犬の鳴き声", "개 짖는 소리"], scores: [.10, .12, .15, .08, .12, .10, .18, .28, .81, .73, .52, .16], reference: [[8, 11]] }
] as const;

export function detectEventRuns(scores: readonly number[], threshold: number, minimumBins: number) {
  if (!Number.isFinite(threshold) || threshold < 0 || threshold > 1 || !Number.isInteger(minimumBins) || minimumBins < 1 || scores.some(score => !Number.isFinite(score) || score < 0 || score > 1)) {
    throw new RangeError("Expected scores and threshold in [0, 1] and a positive integer minimumBins");
  }
  const runs: Array<[number, number]> = [];
  let start = -1;
  for (let i = 0; i <= scores.length; i++) {
    if (i < scores.length && scores[i] >= threshold) {
      if (start < 0) start = i;
    } else if (start >= 0) {
      if (i - start >= minimumBins) runs.push([start, i]);
      start = -1;
    }
  }
  return runs;
}

export function AudioEventWalkthrough({ language }: { language: Language }) {
  const t = (zh: string, en: string, ja: string, ko: string) => text(language, zh, en, ja, ko);
  const [threshold, setThreshold] = useState(.5);
  const [minimumBins, setMinimumBins] = useState(1);
  const [display, setDisplay] = useState<"tagging" | "detection">("detection");
  const active = (runs: readonly (readonly [number, number])[], i: number) => runs.some(([start, end]) => i >= start && i < end);
  return <section className="event-walkthrough" aria-labelledby="event-demo-title">
    <header><h2 id="event-demo-title">{t("从类别分数到事件时间轴", "From class scores to an event timeline", "クラススコアからイベント時間軸へ", "클래스 점수에서 이벤트 시간축으로")}</h2>
      <p>{t("固定合成帧分数上的通用后处理教学数据，不是 ATST-F 或其他真实模型推理：同一段 6 秒场景中三个类别可以重叠。每格 0.5 s，不代表模型窗口或输出步长。", "Synthetic frame scores for generic postprocessing, not ATST-F or any other real model inference: three classes may overlap in one six-second scene. Each bin is 0.5 s and does not represent a model window or output stride.", "汎用後処理のための合成フレームスコアであり、ATST-F や他の実モデルの推論ではない。同じ 6 秒内で 3 クラスが重なり得る。1 区間 0.5 s はモデルの窓や出力間隔を表さない。", "일반 후처리를 위한 합성 프레임 점수이며 ATST-F나 다른 실제 모델 추론이 아님. 6초 장면에서 세 클래스가 중첩 가능. 각 0.5초 구간은 모델 창이나 출력 간격을 나타내지 않음.")}</p>
    </header>
    <div className="event-demo-controls">
      <div role="group" aria-label={t("输出任务", "Output task", "出力タスク", "출력 작업")} className="event-task-tabs">
        <button type="button" aria-pressed={display === "tagging"} onClick={() => setDisplay("tagging")}>{t("片段标签", "Clip tags", "クリップタグ", "클립 태그")}</button>
        <button type="button" aria-pressed={display === "detection"} onClick={() => setDisplay("detection")}>{t("时间定位", "Event timing", "時間定位", "시간 위치")}</button>
      </div>
      <label>{t("分数阈值", "Score threshold", "スコア閾値", "점수 임계값")} · {threshold.toFixed(2)}<input type="range" min="0.1" max="0.95" step="0.05" value={threshold} onChange={event => setThreshold(Number(event.target.value))} /></label>
      {display === "detection" && <label>{t("最短保留时长", "Minimum retained duration", "最短保持時間", "최소 유지 시간")}<select value={minimumBins} onChange={event => setMinimumBins(Number(event.target.value))}>{[1, 2, 3].map(n => <option value={n} key={n}>{(n * .5).toFixed(1)} s</option>)}</select></label>}
    </div>
    <p className="event-rule">{display === "tagging"
      ? t("本例用 max 池化：取整段中该类最高分，再与阈值比较；没有起止时间。真实模型也可用均值、注意力等聚合方式。", "This example uses max pooling: compare the highest class score in the clip with the threshold, without timestamps. Real models may use mean or attention pooling.", "本例は max 集約で最大スコアを閾値と比較し、境界は出さない。実際には平均や注意機構の集約もある。", "이 예는 max 풀링으로 클립의 최대 점수를 임계값과 비교하며 시간 경계는 없음. 실제 모델은 평균·어텐션 풀링도 사용함.")
      : t("通用后处理：分数 ≥ 阈值 → 合并连续区间 → 删除过短区间。调节参数只改变判定，不改变上游合成分数或参考标注。", "Generic postprocessing: score ≥ threshold → merge consecutive bins → discard short runs. Controls change decisions, not the upstream synthetic scores or reference labels.", "汎用後処理：スコア ≥ 閾値 → 連続区間を結合 → 短い区間を除去。操作は判定だけを変え、上流の合成スコアや正解は変えない。", "일반 후처리: 점수 ≥ 임계값 → 연속 구간 병합 → 짧은 구간 제거. 조작은 판정만 바꾸며 상류 합성 점수나 참조 주석은 유지됨.")}</p>
    <div className="event-demo-tracks">
      {examples.map(({ names, scores, reference }, row) => {
        const name = t(names[0], names[1], names[2], names[3]);
        const runs = detectEventRuns(scores, threshold, minimumBins);
        const peak = Math.max(...scores);
        const falseTime = scores.filter((_, i) => active(runs, i) && !active(reference, i)).length * .5;
        const missedTime = scores.filter((_, i) => !active(runs, i) && active(reference, i)).length * .5;
        const stepPath = scores.map((score, i) => `${i === 0 ? "M" : "L"} ${44 + i * 40} ${110 - score * 90} H ${44 + (i + 1) * 40}`).join(" ");
        return <section className="event-demo-track" key={row} aria-label={name}>
          <h3>{name}</h3>
          {display === "tagging" ? <div className="event-tag-result"><meter min="0" max="1" value={peak} aria-label={name} /><strong>{peak.toFixed(2)}</strong><span>{peak >= threshold ? t("标签保留", "Tag retained", "タグ保持", "태그 유지") : t("未过阈值", "Below threshold", "閾値未満", "임계값 미만")}</span></div> : <>
            <svg className="event-score-chart" viewBox="0 0 550 205" role="img" aria-label={`${name} · ${t("分数与时间", "score over time", "スコアと時間", "시간별 점수")}`}>
              {[0, .5, 1].map(p => <g key={p}><line x1="44" x2="524" y1={110 - p * 90} y2={110 - p * 90} className="event-gridline" /><text x="36" y={116 - p * 90} textAnchor="end">{p}</text></g>)}
              <path data-testid={`event-score-${row}`} d={stepPath} className="event-score-line" />
              <line x1="44" x2="524" y1={110 - threshold * 90} y2={110 - threshold * 90} className="event-threshold-line" />
              {reference.map(([start, end]) => <rect key={start} x={44 + start * 40} y="130" width={(end - start) * 40} height="16" className="event-reference-bar" />)}
              {runs.map(([start, end]) => <rect data-testid={`event-run-${row}`} data-start={start * .5} data-end={end * .5} key={start} x={44 + start * 40} y="156" width={(end - start) * 40} height="16" className="event-detection-bar" />)}
              {[0, 2, 4, 6].map(time => <text x={44 + time * 80} y="198" textAnchor="middle" key={time}>{time} s</text>)}
            </svg>
            <div className="event-chart-legend"><span className="event-score-key">{t("分数 0–1", "Score 0–1", "スコア 0–1", "점수 0–1")}</span><span className="event-threshold-key">τ = {threshold.toFixed(2)}</span><span className="event-reference-key">{t("上轨：参考", "Upper: reference", "上段：正解", "위: 참조")}</span><span className="event-detection-key">{t("下轨：检测", "Lower: detected", "下段：検出", "아래: 검출")}</span></div>
            <p className="event-track-result" data-testid={`event-result-${row}`}>
              {t("检测区间", "Detected intervals", "検出区間", "검출 구간")}: {runs.length ? runs.map(([start, end]) => `[${(start * .5).toFixed(1)}, ${(end * .5).toFixed(1)}) s`).join(" · ") : "—"}
              <br />{t("误报 / 漏检时长", "False / missed duration", "誤検出 / 見逃し時間", "오탐 / 미탐 시간")}: {falseTime.toFixed(1)} / {missedTime.toFixed(1)} s
            </p>
          </>}
        </section>;
      })}
    </div>
    <aside className="event-demo-boundary"><h3>{t("从演示走向设备", "From demo to device", "デモから実機へ", "데모에서 장치로")}</h3><ul>
      <li>{t("提高阈值通常减少触发，也可能漏掉弱事件。延长最短时长会滤掉孤立尖峰，也会删掉真实的短促玻璃破碎声。", "Higher thresholds generally reduce triggers but can miss weak events. Longer minimum durations reject isolated spikes and genuine short glass breaks alike.", "閾値を上げると発火は減るが弱い音を見逃し得る。最短時間を延ばすと孤立ピークと本物の短い破損音の両方を除去し得る。", "임계값을 높이면 트리거가 줄지만 약한 이벤트를 놓칠 수 있음. 최소 시간을 늘리면 단발성 피크와 실제 짧은 파손음도 함께 제거할 수 있음.")}</li>
      <li>{t("这是合成数据上的离线区间筛选，图中起点回标到首次过阈值的位置；实时告警必须等待足够证据，不能把回标时间当成零延迟。", "This is offline run filtering on synthetic data: starts are backdated to the first crossing. Real-time alerts must wait for enough evidence; a backdated onset does not mean zero latency.", "合成データに対するオフライン区間選別で、開始を最初の閾値超過へ遡及する。リアルタイム警報は証拠を待つため、遡及開始は遅延ゼロを意味しない。", "합성 데이터에 대한 오프라인 구간 필터링으로 시작을 첫 임계값 통과로 소급함. 실시간 경보는 충분한 증거를 기다려야 하므로 소급 시각이 지연 0을 의미하지 않음.")}</li>
      <li>{t("示例误报时长不是每小时误报数，也不是 DCASE 事件 F1。产品需要逐类校准阈值，并用真实设备、噪声和负样本独立验证；未知声音也可能被错分。", "Example false duration is neither false alarms per hour nor DCASE event F1. Calibrate each class and independently validate on real devices, noise and negative examples; unknown sounds can be misclassified.", "例の誤検出時間は時間当たり誤警報数でも DCASE のイベント F1 でもない。クラス別閾値を実機・雑音・負例で検証し、未知音の誤分類にも注意する。", "예시 오탐 시간은 시간당 오탐 수나 DCASE 이벤트 F1이 아님. 각 클래스의 임계값을 보정하고 실제 장치·잡음·비대상 소리로 독립 검증해야 함. 미지의 소리도 오분류될 수 있음.")}</li>
    </ul></aside>
  </section>;
}
