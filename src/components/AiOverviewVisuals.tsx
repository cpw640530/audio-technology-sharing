import { useState } from "react";
import { ArrowRight, RotateCcw, StepForward, Network, Captions, Headphones, Music, Radio } from "lucide-react";
import type { Language } from "../content/knowledge";
import { traditional } from "../content/traditional";

const text = (language: Language, zh: string, en: string, ja: string, ko: string) =>
  ({ zh, "zh-Hant": traditional(zh), en, ja, ko })[language];

export function AiOverviewVisual({ task, stage, language }: { task: number; stage: number; language: Language }) {
  const t = (zh: string, en: string, ja: string, ko: string) => text(language, zh, en, ja, ko);
  const wave = (noise: boolean) => Array.from({length:121},(_,i)=>{
    const x=i/120;
    const y=Math.sin(2*Math.PI*4*x)*Math.sin(Math.PI*x)**2+(noise?0.25*Math.sin(2*Math.PI*29*x):0);
    return `${i?"L":"M"}${x*160},${30-y*22}`;
  }).join(" ");
  if (stage===4) {
    const Icon=[Captions,Headphones,Music,Radio][task];
    return <div className="ai-overview-visual" aria-hidden="true"><Icon size={40}/></div>;
  }
  if ((stage===0 && task!==2) || (stage===3 && (task===1 || task===2 || task===3))) {
    return <div className="ai-overview-visual" aria-hidden="true"><svg viewBox="0 0 160 60"><path d="M0 30H160" className="asr-zero"/><path d={wave(task===1&&stage===0)} className="asr-signal"/></svg><small>PCM · x[n]</small></div>;
  }
  if ((task===2&&stage===0)||(task===0&&stage===3)) return <div className="ai-overview-visual" aria-hidden="true"><div className="asr-token-strip"><b>你</b><b>好</b></div><small>{task===0?t("文字 / 类别", "Text / class", "文字 / クラス", "텍스트 / 클래스"):t("文本条件", "Text condition", "テキスト条件", "텍스트 조건")}</small></div>;
  if (stage===2 && task===3) return <div className="ai-overview-visual" aria-hidden="true"><div className="ai-code-indices">12 · 7 · 31</div><small>{t("码本索引 ≠ 文字", "Code indices ≠ text", "コード索引 ≠ 文字", "코드 인덱스 ≠ 텍스트")}</small></div>;
  if (stage===2 && task===1) return <div className="ai-overview-visual" aria-hidden="true"><div className="ai-mask-gains">{[0.2,0.7,1].map(m=><span key={m} style={{height:20+m*34}}>{m.toFixed(1)}</span>)}</div><small>{t("掩码增益示意", "Example mask gains", "マスクゲイン例", "마스크 이득 예시")}</small></div>;
  if (stage===1 && task===0) return <div className="ai-overview-visual" aria-hidden="true"><div className="ai-feature-matrix">{Array.from({length:20},(_,i)=><span key={i}/>)}</div><small>{t("时间 × 特征维度", "Time × feature dimensions", "時間 × 特徴次元", "시간 × 특징 차원")}</small></div>;
  if (stage===1 && task===1) return <div className="ai-overview-visual" aria-hidden="true"><code>Y(t,f)<br/>Re + j Im</code><small>{t("幅度 + 相位", "Magnitude + phase", "振幅 + 位相", "진폭 + 위상")}</small></div>;
  if (stage===1 && task===3) return <div className="ai-overview-visual" aria-hidden="true"><div className="ai-latent-vector">−0.3 · 0.8 · 0.1</div><small>{t("连续 latent", "Continuous latent", "連続 latent", "연속 latent")}</small></div>;
  if (stage===1 && task===2) return <div className="ai-overview-visual" aria-hidden="true"><svg viewBox="0 0 120 60"><path d="M0 30H120" className="asr-zero"/>{[-0.3,0.8,0.1].map((v,i)=><g key={i}><rect x={10+i*40} y={v>0?30-v*25:30} width="20" height={Math.abs(v)*25} fill="#226d60"/><text x={10+i*40} y="57" fill="#42594f" fontSize="10">v{i+1}</text></g>)}</svg><small>{t("向量分量示意", "Example vector components", "ベクトル成分の例", "벡터 성분 예시")}</small></div>;
  return <div className="ai-overview-visual" aria-hidden="true"><Network size={40}/><small>{stage===1?"embedding":"fθ"}</small></div>;
}

export function AiLearningVisual({ language }: { language: Language }) {
  const t = (zh: string, en: string, ja: string, ko: string) => text(language, zh, en, ja, ko);
  const [step,setStep]=useState(0);
  const [input,setInput]=useState(0.5);
  // Exact gradient descent for L=(w-0.8)^2, x=1 and learning rate 0.25.
  const weight=0.8-0.6*0.5**step;
  const loss=(weight-0.8)**2;
  const lossPath=Array.from({length:step+1},(_,i)=>`${i?"L":"M"}${30+i*44},${130-(0.6*0.5**i)**2/0.36*110}`).join(" ");
  return <div className="ai-learning-visual">
    <p className="asr-visual-note">{t("可复算的标量教学计算，不是音频模型：训练样本 x=1、目标 y*=0.8，模型 ŷ=w·x，损失 L=(ŷ−y*)²。", "Reproducible scalar teaching calculation, not an audio model: training x=1, target y*=0.8, model ŷ=w·x, loss L=(ŷ−y*)².", "再計算できるスカラー教材で、音声モデルではありません。学習 x=1、目標 y*=0.8、モデル ŷ=w·x、損失 L=(ŷ−y*)²。", "재계산 가능한 스칼라 교육 계산이며 음향 모델이 아닙니다. 학습 x=1, 목표 y*=0.8, 모델 ŷ=w·x, 손실 L=(ŷ−y*)².")}</p>
    <div className="ai-learning-columns">
      <div><h3>{t("训练会更新权重", "Training updates weights", "学習は重みを更新", "학습은 가중치를 갱신")}</h3>
        <div className="ai-learning-equation"><span>x=1</span><ArrowRight aria-hidden="true"/><strong data-testid="overview-weight">w={weight.toFixed(4)}</strong><ArrowRight aria-hidden="true"/><span>ŷ={weight.toFixed(4)}</span></div>
        <div className="robot-buttons"><button type="button" disabled={step===5} onClick={()=>setStep(s=>s+1)}><StepForward size={16} aria-hidden="true"/>{t("更新一次", "One update", "一回更新", "한 번 갱신")}</button><button type="button" onClick={()=>setStep(0)} title={t("重置训练", "Reset training", "学習をリセット", "학습 초기화")} aria-label={t("重置训练", "Reset training", "学習をリセット", "학습 초기화")}><RotateCcw size={16} aria-hidden="true"/></button></div>
        <figure className="ai-loss-plot"><svg viewBox="0 0 280 155" role="img" aria-label={t("训练损失曲线", "Training loss curve", "学習損失曲線", "학습 손실 곡선")}><path d="M30 15V130H260" className="asr-grid"/><path d={lossPath} className="asr-signal"/><circle cx={30+step*44} cy={130-loss/0.36*110} r="4" fill="#226d60"/><text x="0" y="23">.36</text><text x="12" y="134">0</text>{[0,1,2,3,4,5].map(i=><text key={i} x={27+i*44} y="150">{i}</text>)}</svg><figcaption>{t("横轴：更新次数；纵轴：损失 L", "Horizontal: updates; vertical: loss L", "横軸：更新回数、縦軸：損失 L", "가로: 갱신 횟수, 세로: 손실 L")} · <output data-testid="overview-loss">{loss.toFixed(6)}</output></figcaption></figure>
      </div>
      <div><h3>{t("推理只使用当前权重", "Inference uses current weights", "推論は現在の重みを利用", "추론은 현재 가중치를 사용")}</h3>
        <label className="ai-inference-input">{t("新输入 x", "New input x", "新しい入力 x", "새 입력 x")} = {input.toFixed(2)}<input type="range" min="0" max="1" step="0.05" value={input} onChange={e=>setInput(Number(e.target.value))}/></label>
        <div className="ai-learning-equation"><span>{input.toFixed(2)}</span><span>×</span><strong>{weight.toFixed(4)}</strong><span>=</span><output data-testid="overview-inference">{(input*weight).toFixed(4)}</output></div>
        <p>{t("改变输入会改变输出，不会更新 w。只有左侧“更新一次”执行参数学习。", "Changing input changes the output, not w. Only the training update learns parameters.", "入力を変えると出力が変わりますが w は変わりません。左の更新だけが学習です。", "입력을 바꾸면 출력만 바뀌고 w는 바뀌지 않습니다. 왼쪽 갱신만 파라미터를 학습합니다.")}</p>
        <details className="asr-reading-more"><summary>{t("更新公式与边界", "Update rule and limits", "更新式と限界", "갱신 공식과 한계")}</summary><code>w ← w − 0.25 × 2(w − 0.8)</code><p>{t("这里的损失下降只证明拟合这个训练样本，不代表泛化或真实降噪效果；真实网络有更多参数和不同损失。", "Lower loss only shows fitting this training sample, not generalization or real denoising quality. Real networks have more parameters and different losses.", "損失低下はこの学習例への適合だけを示し、汎化や実際のノイズ除去品質を保証しません。実ネットワークは多数のパラメータや別の損失を使います。", "손실 감소는 이 학습 샘플 적합만 보여주며 일반화나 실제 잡음 제거 품질을 보장하지 않습니다. 실제 네트워크는 더 많은 파라미터와 다른 손실을 씁니다.")}</p></details>
      </div>
    </div>
  </div>;
}
