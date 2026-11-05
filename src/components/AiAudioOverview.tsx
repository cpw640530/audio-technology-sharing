import { traditional } from "../content/traditional";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import type { AiAudioLabId, Language } from "../content/knowledge";

export function AiAudioOverview({ language, onOpen }: { language: Language; onOpen?: (id: AiAudioLabId) => void }) {
  const ja: Record<string, string> = {
    "识别内容": "内容を認識",
    "语音或环境声 PCM": "音声または環境音の PCM",
    "log-Mel 或学习型波形表示": "log-Mel または学習型波形表現",
    "识别或分类模型": "認識または分類モデル",
    "文字、事件标签": "テキスト、イベントラベル",
    "字幕、玻璃破碎提醒": "字幕、ガラス破損アラート",
    "ASR 看 WER/CER；事件识别看精确率、召回率和误报。": "ASR は WER/CER、イベント認識は適合率・再現率・誤警報を確認します。",
    "声音事件识别": "音イベント認識",
    "改善声音": "音を改善",
    "含噪或混响 PCM": "ノイズまたは残響を含む PCM",
    "波形或复数频谱": "波形または複素スペクトル",
    "掩码、滤波或波形估计": "マスク、フィルタ、または波形推定",
    "重建增强 PCM": "強調 PCM の再構成",
    "通话、会议、助听": "通話、会議、聴覚支援",
    "比较残留噪声、语音失真、可懂度和延迟；信噪比提升不等于听感一定更好。": "残留ノイズ、音声ひずみ、明瞭度、遅延を比較します。SNR の改善が聴感の改善を意味するとは限りません。",
    "AI 音频增强": "AI オーディオ強調",
    "生成声音": "音を生成",
    "文字、音色或音乐条件": "テキスト、音色、または音楽条件",
    "文本 token、音素或条件向量": "テキスト token、音素、または条件ベクトル",
    "声学或生成模型": "音響モデルまたは生成モデル",
    "声码器或 codec 解码为 PCM": "ボコーダまたは codec で PCM に復号",
    "语音播报、音乐创作": "音声読み上げ、音楽制作",
    "TTS 关注发音与韵律；音乐生成关注结构与条件一致性。都需结合听评，不能只看单一分数。": "TTS は発音と韻律、音楽生成は構造と条件整合性を重視します。どちらも単一スコアだけでなく聴取評価が必要です。",
    "音频生成": "オーディオ生成",
    "压缩声音": "音を圧縮",
    "原始 PCM": "元の PCM",
    "编码器学习连续潜变量": "エンコーダが連続潜在表現を学習",
    "量化为离散索引并封装": "離散インデックスに量子化してパッケージ化",
    "匹配的解码器重建 PCM": "対応するデコーダで PCM を再構成",
    "低码率通信或生成模型表示": "低ビットレート通信または生成モデル表現",
    "比较码率、重建质量、延迟与算力；离散 token 不是文字，压缩通常有损。": "ビットレート、再構成品質、遅延、計算量を比較します。離散 token は文字ではなく、圧縮は通常非可逆です。",
    "AI 音频编码": "ニューラルオーディオ符号化",
    "AI 如何处理声音": "AI は音をどう処理するか",
    "任务总览流程": "タスク全体の流れ",
    "输入": "入力",
    "表示": "表現",
    "模型处理": "モデル処理",
    "输出与后处理": "出力と後処理",
    "应用": "用途",
    "进入": "開く",
    "训练：学习参数": "学習：パラメータを学ぶ",
    "推理：使用参数": "推論：パラメータを使う",
    "评价：检查泛化": "評価：汎化を確認",
    "语音助手工程链路": "音声アシスタントの開発パイプライン",
    "硬件采集": "ハードウェア収音",
    "麦克风 → ADC → PCM": "マイク → ADC → PCM",
    "音频前处理": "オーディオフロントエンド",
    "按需 AEC、降噪与增益控制": "必要に応じた AEC、ノイズ抑制、ゲイン制御",
    "语音 → 文字": "音声 → テキスト",
    "应用理解": "アプリケーション理解",
    "意图与参数 → 执行动作": "意図と引数 → アクション実行",
    "TTS 与播放": "TTS と再生",
    "回复文本 → PCM → DAC / 功放 / 扬声器": "返信テキスト → PCM → DAC / アンプ / スピーカー",
    "对计算机来说，声音是一串随时间变化的数字。AI 从数据中学习规律，把输入映射为文字、标签、更清晰的声音、新声音或紧凑码流。先确定任务，再选择表示和模型。": "コンピューターにとって音は時間とともに変化する数列です。AI はデータから規則を学び、入力を文字、ラベル、より明瞭な音、新しい音、またはコンパクトなビットストリームへ写像します。まずタスクを定め、表現とモデルを選びます。",
    "数据与目标 → 模型预测 → 损失函数比较 → 反向传播更新权重 → 重复。降噪可用带噪与干净配对信号；自监督任务也可从数据自身构造目标。": "データと目標 → モデル予測 → 損失関数で比較 → 逆伝播で重みを更新 → 反復。ノイズ抑制ではノイズ付き信号とクリーン信号のペアを使えます。自己教師ありタスクではデータ自身から目標を作ることもできます。",
    "新输入 → 已训练模型 → 结果。通常固定权重。修改演示滑块或查看中间结果不等于训练；结果也可能因噪声、口音或数据分布变化出错。": "新しい入力 → 学習済みモデル → 結果。通常は重みを固定します。デモのスライダーを動かしたり中間結果を見たりしても学習ではありません。ノイズ、訛り、データ分布の変化で誤ることもあります。",
    "使用未参与训练的测试数据，按任务检查质量，并测量目标设备的延迟、内存和功耗。教学模拟不能证明真实模型的准确率。": "学習に使っていないテストデータでタスクごとの品質を確認し、対象デバイスの遅延、メモリ、消費電力を測定します。教材用シミュレーションでは実モデルの精度を証明できません。",
    "落地例子：设备听懂一句指令": "導入例：デバイスが音声指示を理解する",
    "这是模块化语音助手的一种实现；理解与执行不属于 ASR，端到端语音模型也可以绕过显式文本。总延迟还包含采集、缓冲、网络和播放，不能只看模型推理时间。": "これはモジュール型音声アシスタントの一例です。理解と実行は ASR そのものではなく、エンドツーエンド音声モデルは明示的なテキストを介さないこともあります。総遅延には収音、バッファ、ネットワーク、再生も含まれるため、モデル推論時間だけでは判断できません。",
  };
  const ko: Record<string, string> = {
    "识别内容": "콘텐츠 인식",
    "语音或环境声 PCM": "음성 또는 환경음 PCM",
    "log-Mel 或学习型波形表示": "log-Mel 또는 학습형 파형 표현",
    "识别或分类模型": "인식 또는 분류 모델",
    "文字、事件标签": "텍스트, 이벤트 레이블",
    "字幕、玻璃破碎提醒": "자막, 유리 파손 알림",
    "ASR 看 WER/CER；事件识别看精确率、召回率和误报。": "ASR은 WER/CER을, 이벤트 인식은 정밀도·재현율·오탐을 확인합니다.",
    "声音事件识别": "소리 이벤트 인식",
    "改善声音": "소리 개선",
    "含噪或混响 PCM": "잡음 또는 잔향이 있는 PCM",
    "波形或复数频谱": "파형 또는 복소 스펙트럼",
    "掩码、滤波或波形估计": "마스크, 필터 또는 파형 추정",
    "重建增强 PCM": "향상된 PCM 재구성",
    "通话、会议、助听": "통화, 회의, 청각 보조",
    "比较残留噪声、语音失真、可懂度和延迟；信噪比提升不等于听感一定更好。": "잔여 잡음, 음성 왜곡, 명료도, 지연을 비교합니다. SNR 향상이 반드시 청취 품질 향상을 뜻하지는 않습니다.",
    "AI 音频增强": "AI 오디오 향상",
    "生成声音": "소리 생성",
    "文字、音色或音乐条件": "텍스트, 음색 또는 음악 조건",
    "文本 token、音素或条件向量": "텍스트 token, 음소 또는 조건 벡터",
    "声学或生成模型": "음향 또는 생성 모델",
    "声码器或 codec 解码为 PCM": "보코더 또는 codec으로 PCM 디코딩",
    "语音播报、音乐创作": "음성 합성, 음악 제작",
    "TTS 关注发音与韵律；音乐生成关注结构与条件一致性。都需结合听评，不能只看单一分数。": "TTS는 발음과 운율, 음악 생성은 구조와 조건 일치를 중시합니다. 둘 다 단일 점수만이 아니라 청취 평가가 필요합니다.",
    "音频生成": "오디오 생성",
    "压缩声音": "소리 압축",
    "原始 PCM": "원본 PCM",
    "编码器学习连续潜变量": "인코더가 연속 잠재 표현 학습",
    "量化为离散索引并封装": "이산 인덱스로 양자화하고 패키징",
    "匹配的解码器重建 PCM": "일치하는 디코더로 PCM 재구성",
    "低码率通信或生成模型表示": "저비트레이트 통신 또는 생성 모델 표현",
    "比较码率、重建质量、延迟与算力；离散 token 不是文字，压缩通常有损。": "비트레이트, 재구성 품질, 지연, 연산량을 비교합니다. 이산 token은 문자가 아니며 압축은 대개 손실 방식입니다.",
    "AI 音频编码": "신경 오디오 코딩",
    "AI 如何处理声音": "AI가 소리를 처리하는 방법",
    "任务总览流程": "작업 전체 흐름",
    "输入": "입력",
    "表示": "표현",
    "模型处理": "모델 처리",
    "输出与后处理": "출력과 후처리",
    "应用": "응용",
    "进入": "열기",
    "训练：学习参数": "학습: 파라미터 학습",
    "推理：使用参数": "추론: 파라미터 사용",
    "评价：检查泛化": "평가: 일반화 확인",
    "语音助手工程链路": "음성 비서 엔지니어링 파이프라인",
    "硬件采集": "하드웨어 수음",
    "麦克风 → ADC → PCM": "마이크 → ADC → PCM",
    "音频前处理": "오디오 프런트엔드",
    "按需 AEC、降噪与增益控制": "필요에 따른 AEC, 잡음 억제, 게인 제어",
    "语音 → 文字": "음성 → 텍스트",
    "应用理解": "애플리케이션 이해",
    "意图与参数 → 执行动作": "의도와 인자 → 동작 실행",
    "TTS 与播放": "TTS와 재생",
    "回复文本 → PCM → DAC / 功放 / 扬声器": "응답 텍스트 → PCM / DAC / 앰프 / 스피커",
    "对计算机来说，声音是一串随时间变化的数字。AI 从数据中学习规律，把输入映射为文字、标签、更清晰的声音、新声音或紧凑码流。先确定任务，再选择表示和模型。": "컴퓨터에게 소리는 시간에 따라 변하는 숫자열입니다. AI는 데이터에서 규칙을 학습해 입력을 텍스트, 레이블, 더 선명한 소리, 새로운 소리 또는 압축된 비트스트림으로 매핑합니다. 먼저 작업을 정한 뒤 표현과 모델을 선택합니다.",
    "数据与目标 → 模型预测 → 损失函数比较 → 反向传播更新权重 → 重复。降噪可用带噪与干净配对信号；自监督任务也可从数据自身构造目标。": "데이터와 목표 → 모델 예측 → 손실 함수 비교 → 역전파로 가중치 갱신 → 반복. 잡음 억제에는 잡음 신호와 깨끗한 신호의 쌍을 사용할 수 있으며 자기지도 학습은 데이터 자체에서 목표를 만들 수도 있습니다.",
    "新输入 → 已训练模型 → 结果。通常固定权重。修改演示滑块或查看中间结果不等于训练；结果也可能因噪声、口音或数据分布变化出错。": "새 입력 → 학습된 모델 → 결과의 흐름이며 보통 가중치는 고정됩니다. 데모 슬라이더를 움직이거나 중간 결과를 보는 것은 학습이 아닙니다. 잡음, 억양, 데이터 분포 변화로 결과가 틀릴 수도 있습니다.",
    "使用未参与训练的测试数据，按任务检查质量，并测量目标设备的延迟、内存和功耗。教学模拟不能证明真实模型的准确率。": "학습에 사용하지 않은 테스트 데이터로 작업별 품질을 확인하고 대상 기기의 지연, 메모리, 전력 소비를 측정합니다. 교육용 시뮬레이션만으로 실제 모델의 정확도를 입증할 수는 없습니다.",
    "落地例子：设备听懂一句指令": "적용 예시: 기기가 음성 명령을 이해하기",
    "这是模块化语音助手的一种实现；理解与执行不属于 ASR，端到端语音模型也可以绕过显式文本。总延迟还包含采集、缓冲、网络和播放，不能只看模型推理时间。": "이는 모듈형 음성 비서의 한 구현입니다. 이해와 실행은 ASR 자체가 아니며 엔드투엔드 음성 모델은 명시적 텍스트를 건너뛸 수도 있습니다. 전체 지연에는 캡처·버퍼·네트워크·재생도 포함되므로 모델 추론 시간만 볼 수 없습니다.",
  };
  const t = (zh: string, en: string) => language === "zh-Hant" ? traditional(zh) : language === "zh" ? zh : language === "en" ? en : (language === "ja" ? ja[zh] : ko[zh]);
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
