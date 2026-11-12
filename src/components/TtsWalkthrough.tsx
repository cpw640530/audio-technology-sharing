import { useEffect, useRef, useState } from "react";
import { animate, createScope } from "animejs";
import { ArrowRight, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import type { Language } from "../content/knowledge";
import { text } from "../content/language";
import { useLabState } from "../hooks/useLabState";
import { expandTtsDurations, ttsUnits } from "./ttsDurationModel";

export function TtsWalkthrough({language}:{language:Language}) {
  const t=(zh:string,en:string,ja:string,ko:string)=>text(language,zh,en,ja,ko);
  const [step,setStep]=useState(0);
  const [speed,setSpeed]=useLabState<number>("tts.speed",1, (value): value is number => typeof value === "number" && Number.isFinite(value) && value >= .7 && value <= 1.5);
  const [pause,setPause]=useLabState<number>("tts.pause",15, (value): value is number => typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 30);
  const root=useRef<HTMLElement>(null);
  const {durations,frames}=expandTtsDurations(speed,pause);
  const [cursor,setCursor]=useLabState<number>("tts.cursor",28, (value): value is number => typeof value === "number" && Number.isInteger(value) && value >= 0 && value < frames.length);
  const [route,setRoute]=useLabState<number>("tts.route",0, (value): value is number => typeof value === "number" && Number.isInteger(value) && value >= 0 && value < 3);
  const frame=Math.min(cursor,frames.length-1);
  useEffect(() => { if (cursor !== frame) setCursor(frame); }, [cursor, frame, setCursor]);
  const unit=frames[frame];
  const start=durations.slice(0,unit).reduce((a,b)=>a+b,0);
  const names=[t("文本与读音","Text & pronunciation","テキストと発音","텍스트와 발음"),t("时长与对齐","Duration & alignment","長さと整列","길이와 정렬"),t("模型生成","Model generation","モデル生成","모델 생성"),t("从表示到 PCM","Representation to PCM","表現から PCM へ","표현에서 PCM으로")];
  const routes=["FastSpeech 2","F5-TTS","CosyVoice 3"];
  useEffect(()=>{
    const scope=createScope({root,mediaQueries:{reduceMotion:"(prefers-reduced-motion: reduce)"}}).add(self=>{
      if(!self?.matches.reduceMotion)animate(".tts-stage-content",{opacity:[.55,1],duration:180,ease:"linear"});
    });
    return ()=>scope.revert();
  },[step,route]);
  const routeNodes=[
    [
      ["Phonemes",t("文本编码","Text encoder","テキスト符号化","텍스트 인코딩")],
      ["Variance adaptor",t("时长展开 + 音高、能量条件","Expand durations; add pitch and energy","長さ展開・ピッチ・エネルギー条件","길이 확장·피치·에너지 조건")],
      ["Mel decoder",t("生成声学特征，不是 PCM","Predict acoustic features, not PCM","音響特徴を予測、PCM ではない","음향 특징 예측, PCM 아님")],
      ["Vocoder → PCM",t("例如另配 HiFi-GAN","For example, a separate HiFi-GAN","例：別途 HiFi-GAN を使用","예: 별도 HiFi-GAN 사용")],
    ],
    [
      [t("条件与初始噪声","Conditions & initial noise","条件と初期ノイズ","조건과 초기 잡음"),t("文本、参考 Mel 与采样噪声","Text, reference Mel and sampled noise","テキスト・参照 Mel・標本化ノイズ","텍스트·참조 Mel·샘플링 잡음")],
      ["DiT + ODE",t("学习速度场，积分生成目标片段","Integrate a learned velocity field","学習速度場を積分して生成","학습한 속도장을 적분해 생성")],
      ["Mel",t("连续声学表示","Continuous acoustic representation","連続音響表現","연속 음향 표현")],
      ["Vocoder → PCM",t("匹配训练配置的声码器","Vocoder with matching configuration","学習設定と一致するボコーダ","학습 설정에 맞는 보코더")],
    ],
    [
      [t("文本与提示条件","Text & prompt conditions","テキストとプロンプト条件","텍스트와 프롬프트 조건"),t("文本 token、参考语音条件","Text tokens and reference speech","テキスト token・参照音声","텍스트 token·참조 음성")],
      ["CosyVoice3LM → speech tokens",t("CosyVoice3LM 以 25 Hz 自回归生成离散语音 token；CosyVoice 3 使用新的语音 tokenizer","CosyVoice3LM autoregressively generates discrete speech tokens at 25 Hz; CosyVoice 3 uses a new speech tokenizer","CosyVoice3LM は 25 Hz で離散音声 token を自己回帰生成し、CosyVoice 3 は新しい音声 tokenizer を使います","CosyVoice3LM은 25 Hz로 이산 음성 token을 자기회귀 생성하며 CosyVoice 3는 새로운 음성 tokenizer를 사용합니다")],
      ["Chunked Causal DiT flow matching → Mel",t("因果 DiT flow matching 按 chunk 生成 Mel；官方配置为 25-token 流式 chunk、token_mel_ratio=2","Causal DiT flow matching renders Mel in chunks; the official config uses 25-token streaming chunks and token_mel_ratio=2","因果 DiT flow matching が chunk 単位で Mel を生成します。公式設定は 25-token のストリーミング chunk と token_mel_ratio=2 です","인과 DiT flow matching이 chunk 단위로 Mel을 생성합니다. 공식 설정은 25-token 스트리밍 chunk와 token_mel_ratio=2입니다")],
      ["Causal HiFT → PCM",t("因果 HiFT 声码器把 Mel 变成波形","Causal HiFT vocoder turns Mel into waveform samples","因果 HiFT ボコーダが Mel を波形サンプルに変換します","인과 HiFT 보코더가 Mel을 파형 샘플로 변환합니다")],
    ],
  ];
  const routeNotes=[
    t("FastSpeech 2 是这里保留的经典对照路线，不代表最新模型。它用显式音素时长解释对齐；训练时从录音提取时长、音高和能量，推理时由预测器给出。上一页的数值是手工教学配置，不是训练结果。","FastSpeech 2 is retained as a classic comparison route, not a claim that it is the latest model. It explains alignment with explicit phoneme durations: training extracts duration, pitch and energy from recordings, while inference predicts them. The previous step uses hand-set teaching values, not trained predictions.","FastSpeech 2 は古典的な比較経路として残しており、最新モデルだという主張ではありません。明示的な音素長で整列を説明し、学習時は録音から長さ・ピッチ・エネルギーを抽出し、推論時は予測します。前のステップの数値は手動の教材値です。","FastSpeech 2는 고전 비교 경로로 유지한 것이며 최신 모델이라는 주장이 아닙니다. 명시적 음소 길이로 정렬을 설명하고, 학습에서는 녹음에서 길이·피치·에너지를 추출하며 추론에서는 예측합니다. 앞 단계의 값은 수동 교육 설정입니다."),
    t("F5-TTS 是这里保留的生成式对照路线，不代表最新模型。它不依赖上述逐音素时长展开器，而是在文本与参考条件下从随机噪声生成目标 Mel 片段；这不是把录音里的环境噪声消掉。τ 是生成过程时间，不是音频播放时间。","F5-TTS is retained as a generative comparison route, not a claim that it is the latest model. It does not rely on the phoneme-wise duration regulator above; it generates target Mel frames from sampled noise under text/reference conditioning. It is not removing environmental noise from a recording, and τ is generation time, not playback time.","F5-TTS は生成系の比較経路として残しており、最新モデルだという主張ではありません。上の音素別長さ展開器に依存せず、テキスト・参照条件のもとランダムノイズから Mel 区間を生成します。録音の環境雑音除去ではなく、τ は再生時刻でなく生成過程の時刻です。","F5-TTS는 생성형 비교 경로로 유지한 것이며 최신 모델이라는 주장이 아닙니다. 위의 음소별 길이 확장기에 의존하지 않고 텍스트·참조 조건으로 무작위 잡음에서 Mel 구간을 생성합니다. 녹음의 환경 잡음 제거가 아니며 τ는 재생 시간이 아닌 생성 과정 시간입니다."),
    t("这是 CosyVoice 3 的混合路线：CosyVoice3LM 自回归生成离散语音 token；因果 DiT flow matching 按 chunk 生成 Mel；Causal HiFT 生成波形。官方配置使用 25 Hz 语音 token、25-token 流式 chunk 和 token_mel_ratio=2。下方链路是概念图，不是一次真实推理轨迹。","CosyVoice 3 uses a hybrid route: CosyVoice3LM autoregressively generates discrete speech tokens; causal DiT flow matching renders Mel in chunks; Causal HiFT produces waveform samples. The official config specifies 25 Hz speech tokens, 25-token streaming chunks, and token_mel_ratio=2. The chain below is conceptual, not an inference trace.","CosyVoice 3 は、CosyVoice3LM が離散音声 token を自己回帰生成し、因果 DiT flow matching が chunk 単位で Mel を生成し、Causal HiFT が波形サンプルを出力する混合経路です。公式設定は 25 Hz の音声 token、25-token のストリーミング chunk、token_mel_ratio=2 です。下の経路は概念図で、実際の推論トレースではありません。","CosyVoice 3는 CosyVoice3LM이 이산 음성 token을 자기회귀 생성하고, 인과 DiT flow matching이 chunk 단위로 Mel을 생성하며, Causal HiFT가 파형 샘플을 출력하는 혼합 경로입니다. 공식 설정은 25 Hz 음성 token, 25-token 스트리밍 chunk, token_mel_ratio=2입니다. 아래 경로는 개념도이며 실제 추론 트레이스가 아닙니다."),
  ];
  const sources=["https://arxiv.org/abs/2006.04558","https://github.com/SWivid/F5-TTS","https://github.com/QwenAudio/CosyVoice"];
  const cosyVoice3Paper="https://arxiv.org/abs/2505.17589";
  const reset=()=>{setStep(0);setSpeed(1);setPause(15);setCursor(28);setRoute(0);};
  return <section ref={root} className="tts-walkthrough" aria-label={t("TTS 逐步可视化","TTS walkthrough","TTS の段階的可視化","TTS 단계별 시각화")}>
    <header className="tts-toolbar"><div><h2>{t("跟随一句话，看懂语音怎样生成","Follow one sentence into speech","一文から音声生成を理解","한 문장으로 음성 생성 이해하기")}</h2><span>Hello, AI!</span></div><div className="robot-buttons">
      <button onClick={()=>setStep(step-1)} disabled={step===0} aria-label={t("上一步","Previous step","前のステップ","이전 단계")} title={t("上一步","Previous step","前のステップ","이전 단계")}><ChevronLeft size={18}/></button>
      <button onClick={()=>setStep(step+1)} disabled={step===3} aria-label={t("下一步","Next step","次のステップ","다음 단계")} title={t("下一步","Next step","次のステップ","다음 단계")}><ChevronRight size={18}/></button>
      <button onClick={reset} aria-label={t("重置 TTS 演示","Reset TTS walkthrough","TTS デモをリセット","TTS 데모 초기화")} title={t("重置","Reset","リセット","초기화")}><RotateCcw size={18}/></button>
    </div></header>
    <ol className="tts-stage-nav">{names.map((name,i)=><li key={i}><button onClick={()=>setStep(i)} aria-current={step===i?"step":undefined}>{i+1}. {name}</button></li>)}</ol>
    <div className="tts-stage-content" key={`${step}-${route}`}>
      {step===0 && <>
        <ol className="tts-text-chain">
          <li><span>{t("输入文本","Input text","入力テキスト","입력 텍스트")}</span><strong>Hello, AI!</strong></li>
          <li><span>{t("固定读法的规范化示例","Fixed-reading normalization example","読みを固定した正規化例","읽기를 고정한 정규화 예")}</span><strong>Hello, A I!</strong></li>
          <li><span>{t("一种英语读音 + 停顿","One English pronunciation + pause","英語の読み方の一例とポーズ","영어 발음 한 가지와 멈춤")}</span><strong>/h ə l oʊ/ · sil · /eɪ aɪ/</strong></li>
        </ol>
        <p>{t("本例把 AI 按字母 A、I 朗读。音素说明读什么，时长、音高和能量决定怎么说；sil 是逗号处的教学停顿，不是字母或音素。实际前端还要结合语言与上下文处理多音字、数字和缩写。","Here AI is read as the letters A and I. Phonemes specify pronunciation; duration, pitch and energy shape delivery. sil is an illustrative comma pause, not a letter or phoneme. Real front ends resolve numbers, abbreviations and context-dependent pronunciation.","AI を文字 A・I として読みます。音素は発音を、長さ・ピッチ・エネルギーは話し方を決めます。sil はコンマの教材用ポーズで、文字や音素ではありません。実際の前処理は文脈・言語に応じ数字や略語も解決します。","AI를 A와 I로 읽습니다. 음소는 발음을, 길이·피치·에너지는 말하는 방식을 정합니다. sil은 쉼표의 교육용 멈춤이며 문자나 음소가 아닙니다. 실제 프런트엔드는 언어·문맥에 맞게 숫자와 약어도 처리합니다.")}</p>
      </>}
      {step===1 && <>
        <h3>{t("FastSpeech 类路线：一个音素占几个声学帧？","FastSpeech-style: how many frames per phoneme?","FastSpeech 型：音素は何フレーム？","FastSpeech 방식: 음소당 몇 프레임인가?")}</h3>
        <div className="tts-controls">
          <label>{t("语速倍率","Speaking-rate multiplier","話速倍率","말하기 속도 배율")} · {speed.toFixed(1)}×<input type="range" min="0.7" max="1.5" step="0.1" value={speed} onChange={e=>setSpeed(Number(e.target.value))}/></label>
          <label>{t("停顿帧数","Pause frames","ポーズのフレーム数","멈춤 프레임 수")} · {pause}<input type="range" min="0" max="30" step="1" value={pause} onChange={e=>setPause(Number(e.target.value))}/></label>
        </div>
        <div className="tts-unit-buttons">{ttsUnits.map((phone,i)=><button key={i} disabled={durations[i]===0} aria-pressed={unit===i} onClick={()=>setCursor(durations.slice(0,i).reduce((a,b)=>a+b,0))}><strong>{phone}</strong><span>h{i+1} · {durations[i]} {t("帧","frames","フレーム","프레임")}</span></button>)}</div>
        <svg className="tts-duration-timeline" viewBox="0 0 700 115" role="img" aria-label={t("按时长展开的音素时间轴","Duration-expanded phoneme timeline","長さ展開された音素の時間軸","길이 확장 음소 시간축")}>
          {durations.map((d,i)=>{const x=40+durations.slice(0,i).reduce((a,b)=>a+b,0)/frames.length*620;return d>0?<g key={i}><rect x={x} y="15" width={d/frames.length*620} height="52" className={i===unit?"tts-unit-active":"tts-unit-block"}/><text x={x+d/frames.length*310} y="46" textAnchor="middle">{ttsUnits[i]}</text></g>:null;})}
          <path d={`M${40+(frame+.5)/frames.length*620} 10V75`} className="tts-frame-cursor"/>
          {[0,.25,.5,.75,1].map(f=><text key={f} x={40+f*620} y="100" textAnchor="middle">{Math.round(f*frames.length*10)} ms</text>)}
        </svg>
        <label className="tts-frame-control">{t("检查声学帧","Inspect acoustic frame","音響フレームを確認","음향 프레임 확인")} · {frame+1}/{frames.length}<input type="range" min="0" max={frames.length-1} value={frame} onChange={e=>setCursor(Number(e.target.value))}/></label>
        <div className="tts-frame-mapping"><strong data-testid="tts-selected-unit">{ttsUnits[unit]} · h{unit+1}</strong><ArrowRight aria-hidden="true"/><div className="tts-expanded-frames">{Array.from({length:durations[unit]},(_,i)=><span key={i} data-selected={start+i===frame}>h{unit+1}</span>)}</div></div>
        <div className="tts-duration-result"><code data-testid="tts-duration-total">T = Σ dᵢ = {frames.length}</code><strong>{frames.length} × 10 ms = {(frames.length/100).toFixed(2)} s</strong></div>
        <p>{t("每个 hᵢ 是文本编码器的隐藏向量，展开时重复向量，不是重复一小段录音。这里时长为手工给定，声学帧间隔设为 10 ms；语速只改变非停顿单元，停顿单独控制。此操作不会改变采样率，也不生成声音。","Each hᵢ is a text-encoder hidden vector. Expansion repeats vectors, not recorded audio fragments. Durations are hand-set with a 10 ms frame hop; rate scales non-pause units, with pause controlled separately. This changes neither sample rate nor generates sound.","hᵢ はテキスト符号器の隠れベクトルで、録音断片でなくベクトルを反復します。長さは手動設定、フレーム間隔は10 ms。話速は非ポーズ単位だけを変え、ポーズは別制御です。標本化周波数は変わらず、音声も生成しません。","hᵢ는 텍스트 인코더의 은닉 벡터이며 녹음 조각이 아닌 벡터를 반복합니다. 길이는 수동 설정, 프레임 간격은 10 ms입니다. 속도는 멈춤 외 단위만 바꾸고 멈춤은 별도 제어합니다. 샘플레이트는 바뀌지 않으며 소리를 생성하지 않습니다.")}</p>
      </>}
      {step>=2 && <>
        <div className="tts-route-options" role="group" aria-label={t("TTS 模型路线","TTS model route","TTS モデル経路","TTS 모델 경로")}>{routes.map((name,i)=><button key={name} onClick={()=>setRoute(i)} aria-pressed={route===i}>{name}</button>)}</div>
        {step===2 ? <>
          <ol className="tts-route-chain">{routeNodes[route].map(([name,detail],i)=><li key={i}><strong>{name}</strong><span>{detail}</span>{i<3 && <ArrowRight aria-hidden="true"/>}</li>)}</ol>
          <code className="tts-route-equation">{["H → LengthRegulator(H, d) → Mel decoder","dxτ / dτ = vθ(xτ, τ | text, prompt)","text + prompt → speech tokens (25 Hz) → chunked Causal DiT flow matching → Mel → Causal HiFT → PCM"][route]}</code>
          <p>{routeNotes[route]}</p>
        </> : <>
          <ol className="tts-output-chain"><li><strong>{route===2?"Speech tokens → chunked Causal DiT flow matching → Mel":"Mel"}</strong><span>{t("声学表示，不是可播放采样值","Acoustic representation, not playable samples","音響表現、再生サンプルではない","음향 표현, 재생 샘플 아님")}</span></li><li><strong>{route===2?"Causal HiFT":"Neural vocoder"}</strong><span>{t("学习从表示生成波形","Learned waveform generation","表現から波形を学習生成","표현에서 파형을 학습 생성")}</span></li><li><strong>PCM</strong><span>{t("时间排列的振幅样本","Amplitude samples ordered in time","時間順の振幅サンプル","시간순 진폭 샘플")}</span></li></ol>
          {route===0 && <div className="tts-duration-result"><code>24 kHz · H = 240 samples</code><strong data-testid="tts-sample-budget">{frames.length} × 240 = {frames.length*240}</strong><span>{t("样本数预算示例，非模型输出","Illustrative sample budget, not model output","サンプル数予算例、モデル出力ではない","샘플 수 예산 예시, 모델 출력 아님")}</span></div>}
          <p>{t("Mel 特征不包含完整相位，不能直接做逆 FFT 就得到原语音。HiFi-GAN 等声码器学习生成波形细节；若前端读错字，后端不会自动纠正。上方 24 kHz / 240 点只是与 10 ms 帧间隔一致的预算示例，不是所有模型的固定配置。实际输出长度还取决于 padding 和裁剪。","Mel features do not contain full phase and cannot recover speech by a direct inverse FFT. Vocoders such as HiFi-GAN learn waveform detail; they do not automatically repair pronunciation errors. The 24 kHz / 240-sample budget matches our illustrative 10 ms hop, not every model configuration. Actual length also depends on padding and trimming.","Mel 特徴には完全な位相がなく、直接逆 FFT で元音声には戻せません。HiFi-GAN などが波形細部を学習生成しますが、読み間違いを自動修正しません。24 kHz・240サンプルは10 ms 間隔の予算例で、全モデル共通ではありません。実長はパディング・切り詰めにも依存します。","Mel 특징에는 완전한 위상이 없으므로 역 FFT만으로 음성을 복원할 수 없습니다. HiFi-GAN 등이 파형 세부를 학습 생성하지만 발음 오류를 자동 수정하지는 않습니다. 24 kHz·240샘플은 10 ms 간격의 예산 예시일 뿐 모든 모델의 설정이 아닙니다. 실제 길이는 패딩·자르기에도 좌우됩니다.")}</p>
        </>}
        <span className="tts-route-sources"><a href={sources[route]} target="_blank" rel="noreferrer">{routes[route]} · {t("论文 / 官方实现","Paper / official implementation","論文 / 公式実装","논문 / 공식 구현")}</a>{route===2 && <><span aria-hidden="true"> · </span><a href={cosyVoice3Paper} target="_blank" rel="noreferrer">{t("CosyVoice 3 论文","CosyVoice 3 paper","CosyVoice 3 論文","CosyVoice 3 논문")}</a></>}</span>
      </>}
    </div>
    <p className="tts-demo-boundary">{t("这里演示文本表示、真实的时长展开运算和模型结构；路线图是概念图，不在浏览器运行 TTS，不将示意图当作模型频谱，也不调用系统朗读来冒充这些模型。","This demonstrates text representations, actual duration expansion and model structures. The route diagrams are conceptual, not inference traces; it runs no TTS inference, presents no invented model spectra, and does not substitute system speech for these models.","テキスト表現・実際の長さ展開計算・モデル構造の教材です。経路図は概念図で推論トレースではありません。ブラウザで TTS 推論せず、架空のモデルスペクトルやシステム読上げによる代用もしません。","텍스트 표현·실제 길이 확장 계산·모델 구조를 설명합니다. 경로도는 개념도이며 추론 트레이스가 아닙니다. 브라우저에서 TTS 추론을 하지 않으며 가짜 모델 스펙트럼이나 시스템 읽기를 대신 사용하지 않습니다.")}</p>
  </section>;
}
