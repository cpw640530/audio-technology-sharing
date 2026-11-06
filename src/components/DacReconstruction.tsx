import { useState } from "react";
import type { Language } from "../content/knowledge";
import { traditional } from "../content/traditional";

export function reconstructPcm(values: number[], tauUs: number) {
  const interval = 1 / (values.length - 1);
  const tau = tauUs / 1000;
  let state = 0;
  let previous = 0;
  let held = 0;
  return Array.from({ length: 641 }, (_, i) => {
    const time = i / 640;
    while (held + 1 < values.length && (held + 1) * interval <= time) {
      const next = (held + 1) * interval;
      state = values[held] + (state - values[held]) * Math.exp(-(next - previous) / tau);
      previous = next;
      held++;
    }
    state = values[held] + (state - values[held]) * Math.exp(-(time - previous) / tau);
    previous = time;
    return state;
  });
}

export function DacReconstruction({ values, codes, bitDepth, language }: { values: number[]; codes: number[]; bitDepth: number; language: Language }) {
  const [tau, setTau] = useState(25);
  const [stage, setStage] = useState(3);
  const t = (zh: string, en: string, ja: string, ko: string) => ({ zh, en, ja, ko, "zh-Hant": traditional(zh) })[language];
  const filtered = reconstructPcm(values, tau);
  const hold = values.map((v, i) => `${i ? "H" : "M"} ${60 + i * 640 / (values.length - 1)}${i ? " V" : ""} ${100 - v * 48}`).join(" ");
  const output = filtered.map((v, i) => `${i ? "L" : "M"}${60 + i} ${(stage === 4 ? 100 : 245) - v * 48}`).join(" ");
  const labels = ["PCM", t("码值映射为电压", "Code to voltage", "コードから電圧へ", "코드에서 전압으로"), t("零阶保持", "Zero-order hold", "ゼロ次ホールド", "제로 오더 홀드"), t("重建低通", "Reconstruction low-pass", "再構成ローパス", "재구성 저역통과"), t("模拟输出", "Analog output", "アナログ出力", "아날로그 출력")];
  return <section className="digital-lab-workbench dac-reconstruction" aria-label={t("DAC 数字到模拟演示", "DAC digital-to-analog demonstration", "DACデジタルからアナログへの実験", "DAC 디지털-아날로그 실험")}>
    <div className="digital-lab-visual">
      <div className="waveform-tabs dac-stage-tabs" role="group" aria-label={t("DAC 处理步骤", "DAC stages", "DAC処理手順", "DAC 처리 단계")}>
        {labels.map((step, index) => <button className={stage === index ? "waveform-tab active" : "waveform-tab"} type="button" aria-pressed={stage === index} key={step} onClick={() => setStage(index)}>{index + 1}. {step}</button>)}
      </div>
      <svg viewBox={`0 0 760 ${stage === 3 ? 350 : 210}`} role="img" aria-label={t("DAC 重建图", "DAC reconstruction chart", "DAC再構成チャート", "DAC 재구성 차트")}>
        <rect className="lab-diagram-bg" width="760" height={stage === 3 ? 350 : 210} rx="8" />
        {(stage === 3 ? [100, 245] : [100]).map(center => <g key={center}><path className="lab-axis" d={`M60 ${center} H700`} />{[-1, 0, 1].map(v => <text className="lab-label" key={v} x="45" y={center - v * 48 + 5} textAnchor="end">{v}</text>)}</g>)}
        <text className="lab-label" x="60" y="28">{labels[stage]} · {stage === 0 ? t("归一化样本", "Normalized samples", "正規化サンプル", "정규화 샘플") : "V"}</text>
        {stage < 2 && values.map((v, i) => <g key={i}><path className="digital-sample-stem" d={`M${60 + i * 640 / (values.length - 1)} 100 v${-v * 48}`} /><circle className="digital-quantized-dot" cx={60 + i * 640 / (values.length - 1)} cy={100 - v * 48} r="4" /></g>)}
        {(stage === 2 || stage === 3) && <path className="codec-step-path" d={hold} />}
        {stage === 3 && <text className="lab-label" x="60" y="177">{t("低通后的连续电压", "Continuous low-pass output", "ローパス後の連続電圧", "저역통과 후 연속 전압")}</text>}
        {stage >= 3 && <path className="codec-reconstruction-path" d={output} />}
        {[0, .5, 1].map(time => <text className="lab-label" key={time} x={60 + time * 640} y={stage === 3 ? 330 : 190} textAnchor="middle">{time} ms</text>)}
      </svg>
    </div>
    <div className="digital-lab-panel">
      <h2>{labels[stage]}</h2>
      <p>{t("使用 ADC 演示中的量化数值，按时间顺序转换为电压。假定归一化 ±1 对应 ±1 V（相对共模）。", "Uses the quantized values from the ADC demonstration in time order. Normalized ±1 maps to ±1 V relative to common mode.", "ADC実験の量子化値を時間順に電圧へ変換。正規化±1はコモンモード基準の±1 Vとします。", "ADC 실험의 양자화 값을 시간순으로 전압으로 변환합니다. 정규화 ±1은 공통 모드 기준 ±1 V입니다.")}</p>
      <p>{bitDepth}-bit · {t("无符号偏移码示例", "Offset-binary example", "オフセットバイナリの例", "오프셋 바이너리 예시")}</p>
      <table className="dac-code-table"><thead><tr><th>n</th><th>PCM</th><th>{stage === 0 ? "Binary" : "V"}</th></tr></thead><tbody>{values.slice(0, 5).map((v, i) => <tr key={i}><td>{i}</td><td>{codes[i]}</td><td>{stage === 0 ? codes[i].toString(2).padStart(bitDepth, "0") : v.toFixed(3)}</td></tr>)}</tbody></table>
      {stage === 1 && <p>V[n] = (2 × PCM[n] / (2^{bitDepth} − 1) − 1) × 1 V</p>}
      {stage >= 3 && <>
      <label>{t("滤波时间常数", "Filter time constant", "フィルター時定数", "필터 시정수")}：{tau} μs
        <input aria-label={t("滤波时间常数", "Filter time constant", "フィルター時定数", "필터 시정수")} type="range" min="5" max="100" step="5" value={tau} onChange={e => setTau(Number(e.target.value))} />
      </label>
      <p>fc ≈ {(1000 / (2 * Math.PI * tau)).toFixed(2)} kHz</p>
      </>}
      {stage >= 3 && <p>{t("固定观察窗 1 ms；上图每个数值保持到下一更新时刻，下图为一阶 RC 的连续响应，初值为 0。时间常数越大，平滑、衰减和滞后越明显。", "Fixed 1 ms window. Each value is held until the next update; the lower trace is the continuous first-order RC response starting at zero. A larger time constant increases smoothing, attenuation and lag.", "観察窓は1 ms。各値を次の更新まで保持し、下図は初期値0の1次RC連続応答です。時定数が大きいほど平滑化・減衰・遅れが増します。", "관찰 창은 1 ms입니다. 각 값은 다음 갱신까지 유지되며 아래는 초기값 0인 1차 RC 연속 응답입니다. 시정수가 커지면 평활화, 감쇠, 지연이 증가합니다.")}</p>}
      <p>{t("教学保持模型，不是每种 DAC 的内部阶梯波形；真实音频 DAC 常包含插值和噪声整形。滤波不能恢复已经丢失的信息，输出也不必与原始曲线完全重合。", "A teaching hold model, not every DAC's internal waveform. Audio DACs often include interpolation and noise shaping. Filtering cannot recover lost information or guarantee a match to the original curve.", "教育用ホールドモデルであり、全DAC内部の実波形ではありません。実機は補間やノイズシェーピングも使います。失われた情報は復元できません。", "교육용 홀드 모델이며 모든 DAC 내부의 실제 파형은 아닙니다. 실제 기기는 보간과 노이즈 셰이핑도 사용하며 잃어버린 정보는 복구할 수 없습니다.")}</p>
    </div>
  </section>;
}
