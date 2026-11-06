import type { Language } from "../content/knowledge";
import { text } from "../content/language";
import { soundValue, type SoundComponent } from "./soundCompositionModel";

const components: SoundComponent[] = [
  { multiple: 1, amplitude: .25, phase: 0 },
  { multiple: 2, amplitude: .15, phase: 0 },
  { multiple: 3, amplitude: .1, phase: 0 },
];
const colors = ["#227a70", "#a94d1d", "#4167a0"];
const dashes = ["8 4", "2 4", "8 3 2 3"];
const curve = (parts: SoundComponent[]) => Array.from({ length: 401 }, (_, i) => `${i ? "L" : "M"}${40 + i},${90 - 120 * soundValue(i / 400 * .008, 250, parts)}`).join(" ");

export function WaveSpectrumExample({ language }: { language: Language }) {
  const t = (zh: string, en: string, ja: string, ko: string) => text(language, zh, en, ja, ko);
  return <figure className="sound-composition" data-testid="wave-spectrum-example">
    <figcaption>{t("固定示例：三个正弦分量，相位均为 0°", "Fixed example: three sine components, all at 0° phase", "固定例：三つの正弦成分、位相はすべて0°", "고정 예시: 세 정현파 성분, 위상 모두 0°")}</figcaption>
    <ul className="sound-composition-legend">
      {components.map((c, i) => <li key={i}><svg viewBox="0 0 40 12" aria-hidden="true"><path d="M0 6 H40" stroke={colors[i]} strokeWidth="2" strokeDasharray={dashes[i]} /></svg><span>{"ABC"[i]} · {250 * c.multiple} Hz · {t("振幅", "amplitude", "振幅", "진폭")} {c.amplitude}</span></li>)}
      <li><svg viewBox="0 0 40 12" aria-hidden="true"><path d="M0 6 H40" stroke="#203b35" strokeWidth="3" /></svg><span>{t("合成结果", "Sum", "合成", "합성")} = A + B + C</span></li>
    </ul>
    <svg viewBox="0 0 460 190" role="img" aria-label={t("固定分量与合成波形", "Fixed components and summed waveform", "固定成分と合成波形", "고정 성분과 합성 파형")}>
      {[-.5, 0, .5].map(a => <g key={a}><path d={`M40 ${90 - a * 120} H440`} stroke="#c8d6d0" /><text x="30" y={95 - a * 120} textAnchor="end">{a}</text></g>)}
      {[0, 2, 4, 6, 8].map(ms => <text key={ms} x={40 + ms * 50} y="178" textAnchor="middle">{ms}</text>)}
      {components.map((c, i) => <path key={i} d={curve([c])} fill="none" stroke={colors[i]} strokeDasharray={dashes[i]} strokeWidth="1.5" />)}
      <path data-testid="example-sum" d={curve(components)} fill="none" stroke="#203b35" strokeWidth="2.5" />
    </svg>
    <p>{t("横轴：时间 ms；纵轴：相对幅度。每个时刻，把三条虚线的数值相加，得到深色实线。", "X: time in ms; Y: relative amplitude. At each instant, adding the three dashed values gives the dark solid line.", "横軸は時間ms、縦軸は相対振幅です。同時刻の三本の破線の値を足すと濃い実線になります。", "가로축은 시간 ms, 세로축은 상대 진폭입니다. 같은 시점의 세 점선 값을 더하면 진한 실선이 됩니다.")}</p>
    <svg viewBox="0 0 460 180" role="img" aria-label={t("固定示例幅度线谱", "Fixed example amplitude spectrum", "固定例の振幅スペクトル", "고정 예시 진폭 스펙트럼")}>
      {[0, .1, .2, .3].map(a => <g key={a}><path d={`M40 ${140 - a * 360} H440`} stroke="#c8d6d0" /><text x="30" y={145 - a * 360} textAnchor="end">{a}</text></g>)}
      {[0, 250, 500, 750, 1000].map(f => <text key={f} x={40 + f * .4} y="169" textAnchor="middle">{f}</text>)}
      {components.map((c, i) => <path key={i} d={`M${40 + c.multiple * 100} 140 v${-c.amplitude * 360}`} stroke={colors[i]} strokeWidth="4" />)}
    </svg>
    <p>{t("横轴：频率 Hz；纵轴：各分量峰值振幅。三条谱线与上方 A、B、C 一一对应，不是三段先后发生的声音；这是已知系数的线谱，不是实测 FFT。", "X: frequency in Hz; Y: peak component amplitude. The lines correspond to A, B and C, not successive sounds. This spectrum uses known coefficients, not a measured FFT.", "横軸は周波数Hz、縦軸は成分のピーク振幅です。線はA・B・Cに対応し、順番に鳴る音ではありません。既知の係数であり実測FFTではありません。", "가로축은 주파수 Hz, 세로축은 성분 피크 진폭입니다. 선은 A, B, C에 대응하며 순차적인 소리가 아닙니다. 알려진 계수이며 실측 FFT가 아닙니다.")}</p>
  </figure>;
}
