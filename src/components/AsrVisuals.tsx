import { ArrowRight, Blocks, Network } from "lucide-react";
import type { Language } from "../content/knowledge";
import { traditional } from "../content/traditional";

const text = (language: Language, zh: string, en: string, ja: string, ko: string) =>
  ({ zh, "zh-Hant": traditional(zh), en, ja, ko })[language];

export function AsrSignalJourney({ language }: { language: Language }) {
  const t = (zh: string, en: string, ja: string, ko: string) => text(language, zh, en, ja, ko);
  const wave = Array.from({ length: 161 }, (_, i) => {
    const x = i / 160;
    const y = Math.sin(2 * Math.PI * 7 * x) * Math.sin(Math.PI * x) ** 2;
    return `${i ? "L" : "M"}${x * 160},${28 - y * 22}`;
  }).join(" ");
  return <section className="sound-topic-section asr-journey">
    <div><h2>{t("声音怎样一步步变成文字", "Watch sound become text", "音が文字になるまで", "소리가 텍스트가 되는 과정")}</h2>
      <ol className="asr-journey-strip" aria-label={t("AI 音频处理流程", "AI audio processing flow", "AI オーディオ処理フロー", "AI 오디오 처리 흐름")}>
        <li><strong>01 · PCM</strong><svg viewBox="0 0 160 56" aria-hidden="true"><path d="M0 28H160" className="asr-zero" /><path d={wave} className="asr-signal" /></svg><span>16 kHz · 16000/s</span></li>
        <li><strong>02 · log-Mel</strong><Blocks size={42} aria-hidden="true" /><span>{t("25 ms 窗 / 10 ms 步长", "25 ms window / 10 ms hop", "25 ms 窓 / 10 ms ホップ", "25 ms 창 / 10 ms 홉")}</span></li>
        <li><strong>03 · Encoder</strong><Network size={42} aria-hidden="true" /><span>{t("声学模式 → 上下文", "Acoustics → context", "音響 → 文脈", "음향 → 문맥")}</span></li>
        <li><strong>04 · Decoder</strong><div className="asr-token-strip"><b>你</b><b>好</b></div><span>token → {t("文字", "text", "文字", "텍스트")}</span></li>
      </ol>
      <p className="asr-visual-note">{t("结构示意，不是这条示意波形的识别结果。log-Mel 是一种前端选择；字数与声学帧数不必相等。", "Schematic, not recognition of the illustrated waveform. Log-Mel is one front-end choice; text and acoustic frames need not match one-to-one.", "構造の模式図で、この波形の認識結果ではありません。log-Mel は前段の一例で、文字数と音声フレーム数は一致しません。", "구조 개념도이며 표시한 파형의 인식 결과가 아닙니다. log-Mel은 프런트엔드의 한 선택이며 문자와 음향 프레임 수는 다를 수 있습니다.")}</p>
    </div>
  </section>;
}

export function AsrRouteDiagram({ route, language }: { route: number; language: Language }) {
  const t = (zh: string, en: string, ja: string, ko: string) => text(language, zh, en, ja, ko);
  return <figure className="asr-route-diagram" aria-label={["CTC", "RNN-T", "Attention"][route]}>
    {route === 0 ? <>
      <div className="asr-timeline">{["blank", "你", "你", "blank", "好", "好"].map((token, i) => <div key={i}><small>t{i + 1}</small><b className={token === "blank" ? "asr-blank" : ""}>{token}</b></div>)}</div>
      <div className="asr-collapse"><span>{t("合并重复", "Merge repeats", "重複統合", "중복 병합")}</span><ArrowRight aria-hidden="true" /><code>blank · 你 · blank · 好</code></div>
      <div className="asr-collapse"><span>{t("删除 blank", "Remove blank", "blank を除去", "blank 제거")}</span><ArrowRight aria-hidden="true" /><div className="asr-token-strip"><b>你</b><b>好</b></div></div>
      <figcaption>{t("6 个输出步 → 2 个字；blank 不是静音标签。", "6 output steps → 2 characters; blank is not a silence label.", "6 出力ステップ → 2 文字。blank は無音ラベルではありません。", "출력 6단계 → 2글자. blank는 무음 라벨이 아닙니다.")}</figcaption>
    </> : route === 1 ? <>
      <p className="asr-visual-note">{t("横轴：声学步 t；纵轴：已输出 token 数 u", "Horizontal: acoustic step t; vertical: emitted-token count u", "横軸：音響ステップ t、縦軸：出力 token 数 u", "가로: 음향 단계 t, 세로: 출력 token 수 u")}</p>
      <svg viewBox="0 0 360 210" role="img" aria-label={t("RNN-T 单条对齐路径", "One RNN-T alignment path", "RNN-T の対応経路の一例", "RNN-T 정렬 경로 예시")}>
        {[0,1,2].map(u => <g key={u}><path d={`M35 ${170-u*60}H305`} className="asr-grid" /><text x="8" y={175-u*60}>{u}</text></g>)}
        {[0,1,2,3].map(i => <g key={i}><path d={`M${35+i*90} 50V170`} className="asr-grid" /><text x={30+i*90} y="199">{i}</text></g>)}
        <path d="M35 170H125V50H305" className="asr-signal" />
        {[[35,170],[125,170],[125,110],[125,50],[215,50],[305,50]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="5" fill="#226d60" />)}
        <text x="57" y="157">blank →</text><text x="140" y="143">你 ↑</text><text x="140" y="83">好 ↑</text><text x="147" y="35">blank →</text><text x="238" y="35">blank →</text>
      </svg>
      <figcaption>{t("输出文字向上走，blank 才向右推进时间。此例在同一声学步输出两个字，不做 CTC 去重。", "Labels move up; blank advances time to the right. Two characters are emitted at one acoustic step here, without CTC deduplication.", "文字で上へ進み、blank で時刻を右へ進めます。この例は同じ音響ステップで二文字を出力し、CTC の重複削除はしません。", "라벨은 위로, blank는 시간을 오른쪽으로 진행시킵니다. 이 예시는 같은 음향 단계에서 두 글자를 출력하며 CTC 중복 제거를 하지 않습니다.")}</figcaption>
    </> : <>
      <div className="asr-encoded"><Network size={28} aria-hidden="true" /><span>{t("整段音频的编码表示", "Encoded audio context", "音声全体の符号化表現", "전체 음향의 인코딩 표현")}</span></div>
      <div className="asr-attention-branches" aria-hidden="true">↙ ↓ ↘</div>
      <div className="asr-timeline asr-attention-tokens">{["你", "好", "EOS"].map((token,i)=><div key={token}><small>{i+1}</small><b>{token}</b></div>)}</div>
      <p className="asr-token-history"><code>BOS → 你 → 好 → EOS</code></p>
      <figcaption>{t("每一步结合音频与已有文字预测下一个 token，EOS 表示生成结束；不是先做 CTC 折叠。箭头仅表示信息依赖，不是注意力权重。", "Each step uses audio and prior text to predict the next token; EOS ends generation. No CTC collapse. Arrows show dependencies, not attention weights.", "音声と既出文字から次の token を予測し、EOS で終了します。CTC 折りたたみは使いません。矢印は情報依存であり、注意力の重みではありません。", "음향과 기존 텍스트로 다음 token을 예측하고 EOS로 종료합니다. CTC 병합이 아닙니다. 화살표는 정보 의존성을 뜻하며 Attention 가중치가 아닙니다.")}</figcaption>
    </>}
  </figure>;
}
