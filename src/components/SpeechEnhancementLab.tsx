import { traditional } from "../content/traditional";
import { ArrowLeft } from "lucide-react";
import { useLabState } from "../hooks/useLabState";
import type { Language } from "../content/knowledge";
import { EnhancementStageFocus } from "./EnhancementStageFocus";
import { SpatialSpectralDemo } from "./SpatialSpectralDemo";

type SpeechEnhancementLabProps = {
  language: Language;
  onBack: () => void;
  onBackToDetails?: () => void;
};

type EnhancementMode = "aec" | "ns" | "agc" | "beamforming" | "dereverb";
type ProcessingStrengths = Record<EnhancementMode, number>;
type Localized = Record<"zh" | "en" | "ja" | "ko" | "zh-Hant", string>;
type SocFlow = {
  name: string;
  summary: Localized;
  flow: {
    label: string;
    detail: Localized;
  }[];
  chips: (Localized & { model: string })[];
  note: Localized;
  stages: Localized[];
};

const flowModes: EnhancementMode[] = ["beamforming", "aec", "ns", "dereverb", "agc"];
const enhancementGuides = {
  aec: {
    title: { zh: "AEC：减掉扬声器传回来的声音", "zh-Hant": traditional("AEC：减掉扬声器传回来的声音"), en: "AEC: remove the sound returning from the speaker", ja: "AEC：スピーカーから戻る音を取り除く", ko: "AEC: 스피커에서 되돌아오는 소리 제거" },
    sections: [
      { zh: ["输入是什么", "一路是 AI 采集的混合信号，包含近端人声、扬声器回声和噪声；另一路是 AO 播放参考。两路必须正确对齐，参考还要能代表实际送播的信号。"], "zh-Hant": traditional(["输入是什么", "一路是 AI 采集的混合信号，包含近端人声、扬声器回声和噪声；另一路是 AO 播放参考。两路必须正确对齐，参考还要能代表实际送播的信号。"]), en: ["Inputs", "AI captures near-end voice, speaker echo and noise. A separate AO playback reference describes what is being played. Correct timing and a representative playback reference are essential."], ja: ["入力", "一方は近端音声、スピーカーエコー、ノイズを含む AI の収音混合信号で、もう一方は AO の再生 reference。両者を正しく時間合わせし、reference が実際の再生信号を表す必要がある。"], ko: ["입력", "한쪽은 근단 음성, 스피커 에코 및 노이즈를 포함한 AI 수집 혼합 신호이고 다른 쪽은 AO 재생 reference임. 두 신호를 정확히 정렬하고 reference가 실제 재생 신호를 나타내야 함."] },
      { zh: ["如何抵消", "扬声器、房间和麦克风共同改变播放声音的延迟、幅度和频响。自适应滤波器估计这条回声路径，用播放参考生成估计回声，再执行：输出 = 采集信号 − 估计回声，而不是直接减掉 AO。"], "zh-Hant": traditional(["如何抵消", "扬声器、房间和麦克风共同改变播放声音的延迟、幅度和频响。自适应滤波器估计这条回声路径，用播放参考生成估计回声，再执行：输出 = 采集信号 − 估计回声，而不是直接减掉 AO。"]), en: ["Cancellation", "The speaker, room and microphone change delay, level and frequency response. An adaptive filter models this echo path and generates an echo estimate from the reference. Output = capture − estimated echo, not capture − AO."], ja: ["キャンセルの仕組み", "スピーカー、部屋、マイクが再生音の遅延、レベル、周波数応答を変える。適応フィルターがこのエコー経路を推定し、reference から推定エコーを作る。出力 = 収音信号 − 推定エコーであり、AO を直接引くのではない。"], ko: ["제거 방식", "스피커, 공간 및 마이크가 재생음의 지연, 레벨과 주파수 응답을 바꿈. 적응형 필터가 에코 경로를 모델링하고 reference로 추정 에코를 생성함. 출력 = 수집 신호 − 추정 에코이며 AO를 직접 빼는 것이 아님."] },
      { zh: ["怎样看结果", "先看 AO 与 AI 中回声的对应关系，再看 AEC 输出是否保留近端语音。双讲时不能把近端人声当作回声消掉；延迟漂移、削波或路径突变都会影响收敛。下方三路图是已知路径教学模拟，不是运行自适应算法。"], "zh-Hant": traditional(["怎样看结果", "先看 AO 与 AI 中回声的对应关系，再看 AEC 输出是否保留近端语音。双讲时不能把近端人声当作回声消掉；延迟漂移、削波或路径突变都会影响收敛。下方三路图是已知路径教学模拟，不是运行自适应算法。"]), en: ["Reading the result", "Compare AO with its echo in AI, then check that near-end voice remains in AEC output. Double-talk, timing drift, clipping and path changes complicate adaptation. The three tracks below model a known path rather than running an adaptive filter."], ja: ["結果の見方", "まず AO と AI に現れるエコーの対応を確認し、次に AEC 出力に近端音声が残っているかを見る。ダブルトーク、タイミングドリフト、クリッピング、経路変化は適応を難しくする。下の 3 トラックは既知経路の教材モデルで、適応フィルターを実行した結果ではない。"], ko: ["결과 해석", "먼저 AO와 AI에 나타나는 에코의 대응을 확인한 뒤 AEC 출력에 근단 음성이 남아 있는지 확인함. 더블 토크, 타이밍 드리프트, 클리핑 및 경로 변화는 적응을 어렵게 함. 아래 세 트랙은 알려진 경로의 교육용 모델이며 적응형 필터를 실행한 결과가 아님."] }
    ]
  },
  ns: {
    title: { zh: "ANR / NS：压低背景噪声，保留人声", "zh-Hant": traditional("ANR / NS：压低背景噪声，保留人声"), en: "ANR / NS: reduce background noise while preserving speech", ja: "ANR / NS：背景ノイズを抑え、音声を保つ", ko: "ANR / NS: 배경 노이즈를 줄이고 음성 보존" },
    sections: [
      { zh: ["输入是什么", "输入通常是经过 AEC 的 PCM。AEC 减少的是与播放参考相关的回声；风扇、电流声等独立背景噪声仍然可能存在。ANR/NS 不等于 AEC，也不是耳机的主动降噪 ANC。"], "zh-Hant": traditional(["输入是什么", "输入通常是经过 AEC 的 PCM。AEC 减少的是与播放参考相关的回声；风扇、电流声等独立背景噪声仍然可能存在。ANR/NS 不等于 AEC，也不是耳机的主动降噪 ANC。"]), en: ["Inputs", "The input is typically PCM after AEC. Independent fan or electrical noise may remain after playback-correlated echo is reduced. ANR/NS is not AEC or headphone ANC."], ja: ["入力", "入力は通常 AEC 後の PCM。AEC が減らすのは再生 reference に相関したエコーで、ファン音や電気ノイズなど独立した背景ノイズは残ることがある。ANR/NS は AEC でもヘッドホンの ANC でもない。"], ko: ["입력", "입력은 보통 AEC 후의 PCM임. AEC가 줄이는 것은 재생 reference와 상관된 에코이며 팬 소리나 전기 노이즈 같은 독립 배경 노이즈는 남을 수 있음. ANR/NS는 AEC나 헤드폰 ANC가 아님."] },
      { zh: ["如何处理", "典型传统方法将 PCM 分帧加窗，估计各频带噪声功率，计算随时间和频率变化的增益，再重建波形。不是把整段声音统一调小：语音占优势的频带尽量保留，噪声占优势的频带适当衰减。"], "zh-Hant": traditional(["如何处理", "典型传统方法将 PCM 分帧加窗，估计各频带噪声功率，计算随时间和频率变化的增益，再重建波形。不是把整段声音统一调小：语音占优势的频带尽量保留，噪声占优势的频带适当衰减。"]), en: ["Processing", "A typical traditional method windows PCM frames, estimates noise power by frequency band, applies time-varying spectral gains, then reconstructs the waveform. Speech-dominant bands are preserved rather than turning the entire signal down."], ja: ["処理方法", "代表的な従来法は PCM をフレーム化して窓掛けし、帯域ごとのノイズパワーを推定し、時間と周波数で変化するゲインを適用して波形を再構成する。全体を一律に小さくするのではなく、音声優勢の帯域を保ち、ノイズ優勢の帯域を適度に減衰させる。"], ko: ["처리 방식", "전통적인 방법은 PCM을 프레임화하고 윈도잉한 뒤 대역별 노이즈 전력을 추정하고 시간·주파수에 따라 변하는 게인을 적용한 다음 파형을 재구성함. 전체 소리를 일괄적으로 줄이는 대신 음성 우세 대역은 보존하고 노이즈 우세 대역은 적절히 감쇠함."] },
      { zh: ["怎样看结果", "观察噪声分量 RMS 是否降低，同时检查近端语音有没有被削弱。真实语音与噪声会重叠，抑制过强可能造成辅音丢失、音乐噪声或抽吸。下方示例从开头的纯噪声段估计频谱，再对混合信号计算增益；不能无损分离重叠的语音和噪声。"], "zh-Hant": traditional(["怎样看结果", "观察噪声分量 RMS 是否降低，同时检查近端语音有没有被削弱。真实语音与噪声会重叠，抑制过强可能造成辅音丢失、音乐噪声或抽吸。下方示例从开头的纯噪声段估计频谱，再对混合信号计算增益；不能无损分离重叠的语音和噪声。"]), en: ["Reading the result", "Noise RMS should decrease while voice remains. Real speech overlaps noise; excessive suppression can remove consonants or cause musical noise and pumping. The example estimates noise from an initial noise-only segment, then filters the mixture; overlapping speech and noise cannot be separated losslessly."], ja: ["結果の見方", "ノイズ成分の RMS が下がり、近端音声が弱くなっていないか確認する。実際の音声とノイズは重なるため、抑制しすぎると子音の欠落、ミュージカルノイズ、ポンピングが生じる。下の例は冒頭のノイズだけの区間からスペクトルを推定して混合信号のゲインを計算するが、重なった音声とノイズを無損失には分離できない。"], ko: ["결과 해석", "노이즈 성분 RMS가 낮아지는 동시에 근단 음성이 약해지지 않는지 확인함. 실제 음성과 노이즈는 겹치므로 과도한 억제는 자음 손실, 음악성 노이즈 또는 펌핑을 만들 수 있음. 아래 예시는 시작 부분의 노이즈만 있는 구간에서 스펙트럼을 추정한 뒤 혼합 신호의 게인을 계산하며 겹친 음성과 노이즈를 무손실로 분리할 수 없음."] }
    ]
  },
  agc: {
    title: { zh: "AGC：稳定电平，不是继续降噪", "zh-Hant": traditional("AGC：稳定电平，不是继续降噪"), en: "AGC: stabilize level, not remove more noise", ja: "AGC：レベルを安定させ、ノイズをさらに除去するものではない", ko: "AGC: 레벨 안정화이며 추가 노이즈 제거가 아님" },
    sections: [
      { zh: ["输入是什么", "输入是前级处理后的 PCM，通常仍包含少量残留噪声。数字信号也有电平：可通过峰值或 RMS 衡量，常以相对满刻度的 dBFS 表示。"], "zh-Hant": traditional(["输入是什么", "输入是前级处理后的 PCM，通常仍包含少量残留噪声。数字信号也有电平：可通过峰值或 RMS 衡量，常以相对满刻度的 dBFS 表示。"]), en: ["Inputs", "PCM from upstream stages may still contain residual noise. Digital signals have levels measured by peak or RMS, often expressed relative to full scale in dBFS."], ja: ["入力", "入力は前段処理後の PCM で、通常は少量の残留ノイズを含む。デジタル信号にもレベルがあり、ピークまたは RMS で測定し、フルスケールに対する dBFS で表すことが多い。"], ko: ["입력", "입력은 이전 단계 처리 후의 PCM이며 보통 소량의 잔여 노이즈를 포함함. 디지털 신호에도 레벨이 있으며 피크나 RMS로 측정하고 대개 풀 스케일 기준 dBFS로 표시함."] },
      { zh: ["如何处理", "先检测电平，再与目标电平比较，计算并平滑增益：输出样本 = 增益 × 输入样本。attack/release 控制跟随速度，最大增益和限幅等约束避免过度放大与过载；AGC 不必然包含限幅器。"], "zh-Hant": traditional(["如何处理", "先检测电平，再与目标电平比较，计算并平滑增益：输出样本 = 增益 × 输入样本。attack/release 控制跟随速度，最大增益和限幅等约束避免过度放大与过载；AGC 不必然包含限幅器。"]), en: ["Processing", "Detect level, compare with a target, then calculate and smooth gain: output sample = gain × input sample. Attack/release set tracking speed; gain limits and optional limiting control overload. An AGC does not necessarily include a limiter."], ja: ["処理方法", "レベルを検出して目標レベルと比較し、ゲインを計算・平滑化する。出力サンプル = ゲイン × 入力サンプル。attack/release が追従速度を決め、最大ゲインや任意のリミッターで過増幅と過負荷を抑える。AGC にリミッターが必ず含まれるわけではない。"], ko: ["처리 방식", "레벨을 검출해 목표 레벨과 비교한 뒤 게인을 계산하고 평활화함. 출력 샘플 = 게인 × 입력 샘플. attack/release가 추적 속도를 정하고 최대 게인과 선택적 리미팅이 과도한 증폭과 과부하를 제어함. AGC에 리미터가 반드시 포함되지는 않음."] },
      { zh: ["怎样看结果", "轻声可能被抬高，大声可能被压低，但同一时刻的语音和残余噪声都乘以相同增益。不要把噪声变大误认为降噪失效。下方是即时包络教学模型，未模拟真实 attack/release 或静音门控。"], "zh-Hant": traditional(["怎样看结果", "轻声可能被抬高，大声可能被压低，但同一时刻的语音和残余噪声都乘以相同增益。不要把噪声变大误认为降噪失效。下方是即时包络教学模型，未模拟真实 attack/release 或静音门控。"]), en: ["Reading the result", "Quiet passages may rise and loud passages may fall. Voice and residual noise receive the same gain at each instant, so louder noise does not imply failed denoising. This instantaneous envelope model omits attack/release and silence gating."], ja: ["結果の見方", "小さい音は持ち上がり、大きい音は抑えられることがあるが、同じ時刻の音声と残留ノイズには同じゲインが掛かる。ノイズが大きくなったことをノイズ除去の失敗と誤解しない。下の瞬時包絡モデルは実際の attack/release や無音ゲートを再現していない。"], ko: ["결과 해석", "작은 소리는 커지고 큰 소리는 줄어들 수 있지만 같은 시점의 음성과 잔여 노이즈에는 동일한 게인이 적용됨. 노이즈가 커졌다고 노이즈 제거가 실패했다고 해석하면 안 됨. 아래 순간 엔벨로프 모델은 실제 attack/release나 무음 게이팅을 모델링하지 않음."] }
    ]
  }
};
const defaultProcessingStrengths: ProcessingStrengths = {
  beamforming: 65,
  aec: 65,
  ns: 65,
  dereverb: 65,
  agc: 65
};

const modeLabels: Record<EnhancementMode, Localized> = {
  beamforming: { zh: "多麦波束成形", "zh-Hant": traditional("多麦波束成形"), en: "Beamforming", ja: "マイクアレイビームフォーミング", ko: "다중 마이크 빔포밍" },
  aec: { zh: "AEC 回声消除", "zh-Hant": traditional("AEC 回声消除"), en: "AEC", ja: "AEC エコーキャンセル", ko: "AEC 에코 제거" },
  ns: { zh: "NS / ANR 降噪", "zh-Hant": traditional("NS / ANR 降噪"), en: "NS / ANR", ja: "NS / ANR ノイズ抑制", ko: "NS / ANR 노이즈 억제" },
  dereverb: { zh: "去混响", "zh-Hant": traditional("去混响"), en: "Dereverb", ja: "残響除去", ko: "잔향 제거" },
  agc: { zh: "AGC 自动增益", "zh-Hant": traditional("AGC 自动增益"), en: "AGC", ja: "AGC 自動ゲイン", ko: "AGC 자동 게인" }
};

const modeDescriptions: Record<EnhancementMode, Localized> = {
  aec: {
    zh: "AEC 利用 AO/Mixer 播放回采参考估计回声路径，再从麦克风信号中减掉估计回声；本模型的强度滑块改变整段回声的抵消比例，不改变回声延迟。", "zh-Hant": traditional("AEC 利用 AO/Mixer 播放回采参考估计回声路径，再从麦克风信号中减掉估计回声；本模型的强度滑块改变整段回声的抵消比例，不改变回声延迟。"),
    en: "AEC estimates the echo path from an AO/Mixer playback reference, then subtracts estimated echo from capture. This model's strength changes cancellation across the echo, not its delay.",
    ja: "AEC は AO/Mixer の再生回収 reference からエコー経路を推定し、推定エコーをマイク収音から差し引く。このモデルの強度スライダーはエコー全体のキャンセル率を変えるが、エコー遅延は変えない。",
    ko: "AEC는 AO/Mixer 재생 회수 reference에서 에코 경로를 추정한 뒤 추정 에코를 마이크 수집 신호에서 뺌. 이 모델의 강도 슬라이더는 에코 전체의 제거율을 바꾸지만 에코 지연은 바꾸지 않음."
  },
  ns: {
    zh: "NS/ANR 估计背景噪声频谱，在压低噪声和保护语音辅音细节之间做取舍；强度滑块主要改变噪声纹理。", "zh-Hant": traditional("NS/ANR 估计背景噪声频谱，在压低噪声和保护语音辅音细节之间做取舍；强度滑块主要改变噪声纹理。"),
    en: "NS/ANR estimates the background-noise spectrum and trades off reduction against speech detail; the strength slider mainly changes the noise texture.",
    ja: "NS/ANR は背景ノイズのスペクトルを推定し、ノイズ低減と音声の子音ディテールの保持を両立させる。強度スライダーは主にノイズの質感を変える。",
    ko: "NS/ANR은 배경 노이즈 스펙트럼을 추정해 노이즈 감소와 음성 자음 세부 보존 사이에서 절충함. 강도 슬라이더는 주로 노이즈 질감을 바꿈."
  },
  agc: {
    zh: "AGC 根据语音电平包络缓慢调节增益，把过小的语音拉高、过大的语音限制住；强度滑块主要改变包络稳定度。", "zh-Hant": traditional("AGC 根据语音电平包络缓慢调节增益，把过小的语音拉高、过大的语音限制住；强度滑块主要改变包络稳定度。"),
    en: "AGC slowly adjusts gain from the speech-level envelope, raising quiet speech and limiting loud speech; the slider mainly changes envelope stability.",
    ja: "AGC は音声レベルの包絡に基づいてゲインをゆっくり調整し、小さい音声を持ち上げ、大きい音声を抑える。スライダーは主に包絡の安定度を変える。",
    ko: "AGC는 음성 레벨 엔벨로프에 따라 게인을 천천히 조정해 작은 음성은 올리고 큰 음성은 제한함. 슬라이더는 주로 엔벨로프 안정도를 바꿈."
  },
  beamforming: {
    zh: "多麦波束成形对同步麦克风信号进行延迟与加权合成，增强目标方向；方向可固定，也可由 DOA 定位提供。单麦时旁路此处理。", "zh-Hant": traditional("多麦波束成形对同步麦克风信号进行延迟与加权合成，增强目标方向；方向可固定，也可由 DOA 定位提供。单麦时旁路此处理。"),
    en: "Beamforming delays and weights synchronized microphone signals toward a fixed or DOA-estimated direction. This processing is bypassed with one microphone.",
    ja: "ビームフォーミングは同期したマイク信号を遅延・重み付けして合成し、目標方向を強調する。方向は固定することも DOA 推定から与えることもできる。マイク 1 本ではこの処理をバイパスする。",
    ko: "빔포밍은 동기화된 마이크 신호에 지연과 가중치를 적용해 합산하여 목표 방향을 강화함. 방향은 고정하거나 DOA 추정으로 정할 수 있음. 마이크 한 개에서는 이 처리를 우회함."
  },
  dereverb: {
      zh: "去混响减弱房间后期反射造成的拖尾；此教学滑块仅压低拖尾幅度，不改变模拟房间的延迟或衰减常数。", "zh-Hant": traditional("去混响减弱房间后期反射造成的拖尾；此教学滑块仅压低拖尾幅度，不改变模拟房间的延迟或衰减常数。"),
      en: "Dereverberation reduces late reflection tails. This teaching slider lowers tail amplitude only, not the modeled room delay or decay constant.",
      ja: "残響除去は室内の後期反射による尾部を弱める。この教材スライダーは尾部の振幅だけを下げ、モデル化した部屋の遅延や減衰定数は変えない。",
      ko: "잔향 제거는 공간의 후기 반사로 생기는 꼬리를 줄임. 이 교육용 슬라이더는 꼬리 진폭만 낮추며 모델링된 공간 지연이나 감쇠 상수는 바꾸지 않음."
  }
};

const modeLimits: Record<EnhancementMode, Localized> = {
  aec: {
    zh: "边界：AEC 依赖时间对齐的播放 reference；双讲或延迟漂移时，过强收敛可能误削近端语音。", "zh-Hant": traditional("边界：AEC 依赖时间对齐的播放 reference；双讲或延迟漂移时，过强收敛可能误削近端语音。"),
    en: "Limit: AEC depends on a time-aligned playback reference; during double-talk or delay drift, aggressive adaptation can suppress near-end speech.",
    ja: "限界：AEC は時間同期した再生 reference に依存する。ダブルトークや遅延ドリフト時に強く適応させると近端音声を誤って抑えることがある。",
    ko: "한계: AEC는 시간 정렬된 재생 reference에 의존함. 더블 토크나 지연 드리프트 중 과도한 적응은 근단 음성을 억제할 수 있음."
  },
  ns: {
    zh: "边界：更强抑制不等于更好；过强会损伤辅音和高频细节，并引入金属音或抽吸声。", "zh-Hant": traditional("边界：更强抑制不等于更好；过强会损伤辅音和高频细节，并引入金属音或抽吸声。"),
    en: "Limit: stronger suppression is not always better; aggressive settings can damage consonants and high-frequency detail, causing metallic sound or pumping.",
    ja: "限界：強い抑制が常に良いとは限らない。強すぎる設定は子音や高域のディテールを損ない、金属的な音やポンピングを生む。",
    ko: "한계: 강한 억제가 항상 더 좋은 것은 아님. 과도한 설정은 자음과 고주파 세부를 손상해 금속성 음색이나 펌핑을 만들 수 있음."
  },
  agc: {
    zh: "边界：attack/release 决定跟随速度；过快会抽吸、过慢会跟不上变化，增益过高仍需 limiter 防止削波。", "zh-Hant": traditional("边界：attack/release 决定跟随速度；过快会抽吸、过慢会跟不上变化，增益过高仍需 limiter 防止削波。"),
    en: "Limit: attack/release set tracking speed; too fast causes pumping, too slow misses level changes, and excessive gain still needs a limiter to prevent clipping.",
    ja: "限界：attack/release が追従速度を決める。速すぎるとポンピング、遅すぎるとレベル変化に追従できず、ゲインが大きすぎる場合はクリッピング防止にリミッターが必要になる。",
    ko: "한계: attack/release가 추적 속도를 결정함. 너무 빠르면 펌핑이 생기고 너무 느리면 레벨 변화를 놓치며 게인이 과도하면 클리핑 방지를 위해 리미터가 필요함."
  },
  beamforming: {
    zh: "边界：至少需要两路同步麦克风；单麦没有空间差分，更多通道通常增加计算量，抑制效果和延迟还取决于阵列结构与算法。", "zh-Hant": traditional("边界：至少需要两路同步麦克风；单麦没有空间差分，更多通道通常增加计算量，抑制效果和延迟还取决于阵列结构与算法。"),
    en: "Limit: at least two synchronized microphones are required; a single mic has no spatial difference. More channels usually add compute, while suppression and latency also depend on array geometry and the algorithm.",
    ja: "限界：同期したマイクが少なくとも 2 本必要で、1 本では空間差がない。チャンネルを増やすと通常は計算量が増え、抑制効果と遅延はアレイ構造やアルゴリズムにも依存する。",
    ko: "한계: 동기화된 마이크가 최소 두 개 필요하며 한 개로는 공간 차이가 없음. 채널이 많아지면 보통 연산량이 늘고 억제 효과와 지연은 배열 구조와 알고리즘에도 좌우됨."
  },
  dereverb: {
    zh: "边界：去混响主要压低后期拖尾；过强会削弱自然共鸣和词尾，声音变薄发干。", "zh-Hant": traditional("边界：去混响主要压低后期拖尾；过强会削弱自然共鸣和词尾，声音变薄发干。"),
    en: "Limit: dereverb mainly reduces late tails; aggressive settings can remove natural resonance and word endings, making speech thin and dry.",
    ja: "限界：残響除去は主に後期の尾部を下げる。強すぎると自然な共鳴や語尾を削り、音声が薄く乾いた印象になる。",
    ko: "한계: 잔향 제거는 주로 후기 꼬리를 줄임. 과도하면 자연스러운 공명과 어미를 없애 음성이 얇고 건조해질 수 있음."
  }
};

const sdkRows = [
  {
    module: "AI",
    zh: "Audio Input，麦克风采集、DMA、驱动 ring buffer", "zh-Hant": traditional("Audio Input，麦克风采集、DMA、驱动 ring buffer"),
    en: "Audio input, microphone capture, DMA, and driver ring buffer",
    ja: "Audio Input：マイク収音、DMA、ドライバーの ring buffer",
    ko: "Audio Input: 마이크 수집, DMA 및 드라이버 ring buffer"
  },
  {
    module: "AO",
    zh: "Audio Output，播放 PCM，同时给 AEC 提供 reference", "zh-Hant": traditional("Audio Output，播放 PCM，同时给 AEC 提供 reference"),
    en: "Audio output, playback PCM, and AEC reference source",
    ja: "Audio Output：PCM を再生し、AEC に reference を提供",
    ko: "Audio Output: PCM을 재생하고 AEC reference를 제공"
  },
  {
    module: "VQE / 3A",
    zh: "语音增强模块，常包含波束成形、AEC、NS/ANR、去混响和 AGC", "zh-Hant": traditional("语音增强模块，常包含波束成形、AEC、NS/ANR、去混响和 AGC"),
    en: "Voice quality enhancement, often containing beamforming, AEC, NS/ANR, dereverberation, and AGC",
    ja: "音声強調モジュール。ビームフォーミング、AEC、NS/ANR、残響除去、AGC を含むことが多い",
    ko: "음성 향상 모듈로 빔포밍, AEC, NS/ANR, 잔향 제거 및 AGC를 포함하는 경우가 많음"
  },
  {
    module: "AENC / ASR",
    zh: "增强后的 PCM 送编码、通话、唤醒识别或录音", "zh-Hant": traditional("增强后的 PCM 送编码、通话、唤醒识别或录音"),
    en: "Enhanced PCM goes to encoding, calls, wake/ASR, or recording",
    ja: "強調後の PCM をエンコード、通話、ウェイク/ASR、録音へ送る",
    ko: "향상된 PCM을 인코딩, 통화, 웨이크/ASR 또는 녹음으로 전달"
  }
] as const;

const socFlows: SocFlow[] = [
  {
    name: "Rockchip RK Media / VQE",
    summary: {
      zh: "常见边界是 AI 采集、AO 播放回采、VQE/3A 做语音增强、AENC 或 ASR 消费增强后 PCM。", "zh-Hant": traditional("常见边界是 AI 采集、AO 播放回采、VQE/3A 做语音增强、AENC 或 ASR 消费增强后 PCM。"),
      en: "A common boundary is AI capture, AO playback reference, VQE/3A enhancement, then AENC or ASR consuming enhanced PCM.",
      ja: "一般的な境界は AI 収音、AO 再生回収、VQE/3A による音声強調、その後に AENC または ASR が強調後 PCM を利用する構成。",
      ko: "일반적인 경계는 AI 수집, AO 재생 회수, VQE/3A 음성 향상 후 AENC 또는 ASR이 향상된 PCM을 사용하는 구성임."
    },
    flow: [
      { label: "Mic / Codec", detail: { zh: "PDM / I2S / ADC", "zh-Hant": traditional("PDM / I2S / ADC"), en: "PDM / I2S / ADC", ja: "PDM / I2S / ADC", ko: "PDM / I2S / ADC" } },
      { label: "AI", detail: { zh: "DMA + ring buffer", "zh-Hant": traditional("DMA + ring buffer"), en: "DMA + ring buffer", ja: "DMA + ring buffer", ko: "DMA + ring buffer" } },
      { label: "VQE / 3A", detail: { zh: "BF / AEC / ANR / AGC", "zh-Hant": traditional("BF / AEC / ANR / AGC"), en: "BF / AEC / ANR / AGC", ja: "BF / AEC / ANR / AGC", ko: "BF / AEC / ANR / AGC" } },
      { label: "AENC / ASR", detail: { zh: "编码、唤醒、识别", "zh-Hant": traditional("编码、唤醒、识别"), en: "encode, wake, ASR", ja: "エンコード、ウェイク、認識", ko: "인코딩, 웨이크, 인식" } },
      { label: "AO Ref", detail: { zh: "播放回采给 AEC", "zh-Hant": traditional("播放回采给 AEC"), en: "playback ref to AEC", ja: "AEC 用の再生回収", ko: "AEC용 재생 회수" } }
    ],
    chips: [
      { model: "RV1103B / RV1106B", zh: "适合低功耗 IPC、门铃、语音唤醒和边缘 AI 语音前端。", "zh-Hant": traditional("适合低功耗 IPC、门铃、语音唤醒和边缘 AI 语音前端。"), en: "Good for low-power IPC, doorbells, wake-word, and edge-AI voice frontends.", ja: "低消費電力 IPC、ドアベル、ウェイクワード、エッジ AI 音声フロントエンド向け。", ko: "저전력 IPC, 초인종, 웨이크 워드 및 엣지 AI 음성 프런트엔드에 적합함." },
      { model: "RV1126B / RV1109", zh: "适合更高算力的视频设备、双向语音和多算法并行。", "zh-Hant": traditional("适合更高算力的视频设备、双向语音和多算法并行。"), en: "Good for higher-compute video devices, two-way audio, and parallel algorithms.", ja: "より高い演算性能の映像機器、双方向音声、複数アルゴリズムの並列処理向け。", ko: "더 높은 연산 성능의 영상 장치, 양방향 음성 및 알고리즘 병렬 처리에 적합함." },
      { model: "RK3568", zh: "适合网关、工业屏、Linux 应用层音频处理和多媒体系统。", "zh-Hant": traditional("适合网关、工业屏、Linux 应用层音频处理和多媒体系统。"), en: "Good for gateways, industrial panels, Linux user-space audio processing, and multimedia systems.", ja: "ゲートウェイ、産業用パネル、Linux ユーザー空間の音声処理、マルチメディアシステム向け。", ko: "게이트웨이, 산업용 패널, Linux 사용자 공간 오디오 처리 및 멀티미디어 시스템에 적합함." }
    ],
    note: {
      zh: "公开资料显示 RV1103B/RV1106B 面向 AI IPC，并列出 AI 降噪、语音识别、音频编解码等能力；具体 VQE 接口以板级 SDK 为准。", "zh-Hant": traditional("公开资料显示 RV1103B/RV1106B 面向 AI IPC，并列出 AI 降噪、语音识别、音频编解码等能力；具体 VQE 接口以板级 SDK 为准。"),
      en: "Public material positions RV1103B/RV1106B for AI IPC and lists AI noise reduction, speech recognition, and audio codec capabilities; exact VQE APIs depend on the board SDK.",
      ja: "公開資料では RV1103B/RV1106B は AI IPC 向けで、AI ノイズ抑制、音声認識、音声コーデック機能が挙げられている。具体的な VQE API はボード SDK に依存する。",
      ko: "공개 자료는 RV1103B/RV1106B를 AI IPC용으로 설명하며 AI 노이즈 억제, 음성 인식 및 오디오 코덱 기능을 열거함. 구체적인 VQE API는 보드 SDK에 따라 달라짐."
    },
    stages: [
      { zh: "Mic / Codec / PDM / I2S -> AI 通道，驱动和 DMA 写入 ring buffer。", "zh-Hant": traditional("Mic / Codec / PDM / I2S -> AI 通道，驱动和 DMA 写入 ring buffer。"), en: "Mic / codec / PDM / I2S -> AI channel, with driver and DMA writing a ring buffer.", ja: "Mic / Codec / PDM / I2S -> AI チャンネル。ドライバーと DMA が ring buffer に書き込む。", ko: "Mic / Codec / PDM / I2S -> AI 채널로 연결되며 드라이버와 DMA가 ring buffer에 기록함." },
      { zh: "AI 输出 10-20 ms PCM 帧，配置 VQE 参数后进入 AEC、ANR、AGC 等处理。", "zh-Hant": traditional("AI 输出 10-20 ms PCM 帧，配置 VQE 参数后进入 AEC、ANR、AGC 等处理。"), en: "AI outputs 10-20 ms PCM frames, then VQE parameters route frames through AEC, ANR, AGC, and similar processing.", ja: "AI が 10–20 ms の PCM フレームを出力し、VQE パラメータに従って AEC、ANR、AGC などを通す。", ko: "AI가 10~20 ms PCM 프레임을 출력하고 VQE 파라미터에 따라 AEC, ANR, AGC 등의 처리를 통과시킴." },
      { zh: "AO / Mixer 的播放 PCM 作为 AEC reference，需要做延迟估计和时间对齐。", "zh-Hant": traditional("AO / Mixer 的播放 PCM 作为 AEC reference，需要做延迟估计和时间对齐。"), en: "AO / Mixer playback PCM is used as AEC reference and needs delay estimation and time alignment.", ja: "AO / Mixer の再生 PCM を AEC reference とし、遅延推定と時間合わせを行う。", ko: "AO / Mixer 재생 PCM을 AEC reference로 사용하며 지연 추정과 시간 정렬이 필요함." },
      { zh: "增强后 PCM 送 AENC 编码、网络传输、本地录音或唤醒/ASR。", "zh-Hant": traditional("增强后 PCM 送 AENC 编码、网络传输、本地录音或唤醒/ASR。"), en: "Enhanced PCM goes to AENC, networking, local recording, or wake/ASR.", ja: "強調後 PCM を AENC、ネットワーク伝送、ローカル録音、ウェイク/ASR へ送る。", ko: "향상된 PCM을 AENC, 네트워크 전송, 로컬 녹음 또는 웨이크/ASR로 전달함." }
    ]
  },
  {
    name: "SigmaStar MI Audio",
    summary: {
      zh: "常见模块名围绕 MI_AI、MI_AO、MI_AENC、Audio Process / VQE，处理链路和 Rockchip 边界类似。", "zh-Hant": traditional("常见模块名围绕 MI_AI、MI_AO、MI_AENC、Audio Process / VQE，处理链路和 Rockchip 边界类似。"),
      en: "Common names revolve around MI_AI, MI_AO, MI_AENC, and Audio Process / VQE, with boundaries similar to Rockchip-style pipelines.",
      ja: "一般的なモジュール名は MI_AI、MI_AO、MI_AENC、Audio Process / VQE で、処理チェーンの境界は Rockchip 型と似ている。",
      ko: "주요 모듈 이름은 MI_AI, MI_AO, MI_AENC 및 Audio Process / VQE이며 처리 체인의 경계는 Rockchip 방식과 유사함."
    },
    flow: [
      { label: "Mic / I2S", detail: { zh: "输入设备与通道", "zh-Hant": traditional("输入设备与通道"), en: "input device + channel", ja: "入力デバイスとチャンネル", ko: "입력 장치와 채널" } },
      { label: "MI_AI", detail: { zh: "采集 PCM 帧", "zh-Hant": traditional("采集 PCM 帧"), en: "capture PCM frames", ja: "PCM フレームを収音", ko: "PCM 프레임 수집" } },
      { label: "Audio Process", detail: { zh: "AEC / ANR / AGC", "zh-Hant": traditional("AEC / ANR / AGC"), en: "AEC / ANR / AGC", ja: "AEC / ANR / AGC", ko: "AEC / ANR / AGC" } },
      { label: "MI_AENC", detail: { zh: "编码或网络", "zh-Hant": traditional("编码或网络"), en: "encode or network", ja: "エンコードまたはネットワーク", ko: "인코딩 또는 네트워크" } },
      { label: "MI_AO Ref", detail: { zh: "播放回采", "zh-Hant": traditional("播放回采"), en: "playback reference", ja: "再生 reference", ko: "재생 reference" } }
    ],
    chips: [
      { model: "SSC338Q / SSC338G", zh: "适合 IPC、双向对讲、摄像头语音增强和本地 AI 处理。", "zh-Hant": traditional("适合 IPC、双向对讲、摄像头语音增强和本地 AI 处理。"), en: "Good for IPC, two-way talk, camera voice enhancement, and local AI processing.", ja: "IPC、双方向通話、カメラ音声強調、ローカル AI 処理向け。", ko: "IPC, 양방향 대화, 카메라 음성 향상 및 로컬 AI 처리에 적합함." },
      { model: "SSC337 / SSC335", zh: "适合成本敏感型摄像头、基础采集和编码链路。", "zh-Hant": traditional("适合成本敏感型摄像头、基础采集和编码链路。"), en: "Good for cost-sensitive cameras with basic capture and encoding paths.", ja: "コスト重視のカメラ、基本的な収音・エンコード経路向け。", ko: "비용에 민감한 카메라와 기본 수집·인코딩 경로에 적합함." },
      { model: "SSD202D / SSD20x", zh: "适合低成本 Linux 音频、屏显控制和轻量语音交互。", "zh-Hant": traditional("适合低成本 Linux 音频、屏显控制和轻量语音交互。"), en: "Good for low-cost Linux audio, display-control products, and lightweight voice interaction.", ja: "低コスト Linux 音声、表示制御製品、軽量な音声インタラクション向け。", ko: "저비용 Linux 오디오, 디스플레이 제어 제품 및 경량 음성 상호작용에 적합함." }
    ],
    note: {
      zh: "SigmaStar MI SDK 常见 AI/AO/AENC/Audio Process 边界明确，但不同授权包里的 AEC、ANR、AGC、阵列算法可能差异较大，选型时要确认 SDK 示例和库授权。", "zh-Hant": traditional("SigmaStar MI SDK 常见 AI/AO/AENC/Audio Process 边界明确，但不同授权包里的 AEC、ANR、AGC、阵列算法可能差异较大，选型时要确认 SDK 示例和库授权。"),
      en: "SigmaStar MI SDK commonly exposes AI/AO/AENC/Audio Process-style boundaries, but AEC, ANR, AGC, and array libraries can vary by licensed SDK package; confirm samples and library authorization during selection.",
      ja: "SigmaStar MI SDK は AI/AO/AENC/Audio Process 型の境界を示すことが多いが、AEC、ANR、AGC、アレイライブラリはライセンス済み SDK パッケージで異なる。選定時にサンプルとライブラリの許諾を確認する。",
      ko: "SigmaStar MI SDK는 AI/AO/AENC/Audio Process 형태의 경계를 제공하는 경우가 많지만 AEC, ANR, AGC 및 배열 라이브러리는 라이선스 SDK 패키지에 따라 다를 수 있음. 선정 시 예제와 라이브러리 권한을 확인해야 함."
    },
    stages: [
      { zh: "麦克风进入 MI_AI，按采样率、位宽、通道数创建音频输入设备和通道。", "zh-Hant": traditional("麦克风进入 MI_AI，按采样率、位宽、通道数创建音频输入设备和通道。"), en: "Microphones enter MI_AI, creating audio input devices and channels by sample rate, bit depth, and channel count.", ja: "マイクを MI_AI に接続し、サンプルレート、ビット深度、チャンネル数に応じて入力デバイスとチャンネルを作る。", ko: "마이크를 MI_AI에 연결하고 샘플 레이트, 비트 깊이 및 채널 수에 따라 오디오 입력 장치와 채널을 생성함." },
      { zh: "Audio Process 对 AI 帧做 AEC、ANR/NS、AGC 等增强，参数通常绑定到 AI 通道。", "zh-Hant": traditional("Audio Process 对 AI 帧做 AEC、ANR/NS、AGC 等增强，参数通常绑定到 AI 通道。"), en: "Audio Process enhances AI frames with AEC, ANR/NS, AGC, and related processing, usually bound to the AI channel.", ja: "Audio Process が AI フレームに AEC、ANR/NS、AGC などを適用し、パラメータは通常 AI チャンネルに紐付く。", ko: "Audio Process가 AI 프레임에 AEC, ANR/NS, AGC 등의 향상을 적용하며 파라미터는 보통 AI 채널에 연결됨." },
      { zh: "MI_AO 负责播放，回采 reference 给 AEC；增强后送 MI_AENC、上层算法或网络。", "zh-Hant": traditional("MI_AO 负责播放，回采 reference 给 AEC；增强后送 MI_AENC、上层算法或网络。"), en: "MI_AO handles playback and provides AEC reference; enhanced audio goes to MI_AENC, upper algorithms, or networking.", ja: "MI_AO が再生を担当し、AEC reference を回収する。強調後の音声は MI_AENC、上位アルゴリズム、ネットワークへ送る。", ko: "MI_AO가 재생을 담당하고 AEC reference를 회수함. 향상된 오디오는 MI_AENC, 상위 알고리즘 또는 네트워크로 보냄." },
      { zh: "多麦方案会在 AI 后加入阵列/波束成形，再进入单通道增强或编码。", "zh-Hant": traditional("多麦方案会在 AI 后加入阵列/波束成形，再进入单通道增强或编码。"), en: "Multi-mic products add array or beamforming after AI, then continue to single-channel enhancement or encoding.", ja: "マルチマイク製品は AI の後にアレイ/ビームフォーミングを加え、単一チャンネルの強調またはエンコードへ進む。", ko: "다중 마이크 제품은 AI 뒤에 배열/빔포밍을 추가한 다음 단일 채널 향상 또는 인코딩으로 진행함." }
    ]
  },
  {
    name: "Ingenic IMP Audio",
    summary: {
      zh: "常见边界是 IMP Audio 输入输出，加 AGC、NS、AEC 等接口，最后接编码、录像、对讲或识别。", "zh-Hant": traditional("常见边界是 IMP Audio 输入输出，加 AGC、NS、AEC 等接口，最后接编码、录像、对讲或识别。"),
      en: "A common boundary is IMP Audio input/output plus AGC, NS, AEC-style interfaces, then encoding, recording, intercom, or recognition.",
      ja: "一般的な境界は IMP Audio の入出力に AGC、NS、AEC 系のインターフェースを加え、その後にエンコード、録画、インターホン、認識を接続する構成。",
      ko: "일반적인 경계는 IMP Audio 입출력에 AGC, NS, AEC 형태의 인터페이스를 더한 뒤 인코딩, 녹화, 인터컴 또는 인식을 연결하는 구성임."
    },
    flow: [
      { label: "Codec / DMIC", detail: { zh: "模拟或数字麦", "zh-Hant": traditional("模拟或数字麦"), en: "analog or digital mic", ja: "アナログ / デジタル", ko: "아날로그 또는 디지털 마이크" } },
      { label: "IMP AI", detail: { zh: "内核 buffer 取帧", "zh-Hant": traditional("内核 buffer 取帧"), en: "read frames from buffer", ja: "バッファーから取得", ko: "buffer에서 프레임 읽기" } },
      { label: "IMP Algo", detail: { zh: "NS / AGC / AEC", "zh-Hant": traditional("NS / AGC / AEC"), en: "NS / AGC / AEC", ja: "NS / AGC / AEC", ko: "NS / AGC / AEC" } },
      { label: "Encode / App", detail: { zh: "录像、对讲、识别", "zh-Hant": traditional("录像、对讲、识别"), en: "record, talk, ASR", ja: "録画、通話、認識", ko: "녹화, 대화, ASR" } },
      { label: "IMP AO Ref", detail: { zh: "播放参考", "zh-Hant": traditional("播放参考"), en: "playback reference", ja: "再生 reference", ko: "재생 reference" } }
    ],
    chips: [
      { model: "T41", zh: "适合 AI 摄像头、IPC、音频 3A、DMIC 和多麦算法验证。", "zh-Hant": traditional("适合 AI 摄像头、IPC、音频 3A、DMIC 和多麦算法验证。"), en: "Good for AI cameras, IPC, audio 3A, DMIC, and multi-mic algorithm validation.", ja: "AI カメラ、IPC、音声 3A、DMIC、マルチマイクアルゴリズム検証向け。", ko: "AI 카메라, IPC, 오디오 3A, DMIC 및 다중 마이크 알고리즘 검증에 적합함." },
      { model: "T31 / T40", zh: "适合经典 IPC、低功耗采集、对讲和录像音轨。", "zh-Hant": traditional("适合经典 IPC、低功耗采集、对讲和录像音轨。"), en: "Good for classic IPC, low-power capture, intercom, and recorded audio tracks.", ja: "従来型 IPC、低消費電力収音、インターホン、録画音声トラック向け。", ko: "기존 IPC, 저전력 수집, 인터컴 및 녹화 오디오 트랙에 적합함." },
      { model: "X2000 / X2600", zh: "适合 Linux 应用处理、网关、人机交互和更复杂的用户态音频链路。", "zh-Hant": traditional("适合 Linux 应用处理、网关、人机交互和更复杂的用户态音频链路。"), en: "Good for Linux application processing, gateways, HMI, and more complex user-space audio chains.", ja: "Linux アプリケーション処理、ゲートウェイ、HMI、より複雑なユーザー空間音声チェーン向け。", ko: "Linux 애플리케이션 처리, 게이트웨이, HMI 및 복잡한 사용자 공간 오디오 체인에 적합함." }
    ],
    note: {
      zh: "公开资料显示 T41 支持音频 3A、DMIC，君正 Mert 音频算法库覆盖降噪、回声消除、多麦增强等方向；具体接口和算力预算仍需按 SDK 与板型确认。", "zh-Hant": traditional("公开资料显示 T41 支持音频 3A、DMIC，君正 Mert 音频算法库覆盖降噪、回声消除、多麦增强等方向；具体接口和算力预算仍需按 SDK 与板型确认。"),
      en: "Public material lists T41 audio 3A and DMIC support, and Ingenic's Mert audio algorithm library covers denoise, echo cancellation, multi-mic enhancement, and related functions; exact APIs and compute budget still depend on SDK and board design.",
      ja: "公開資料では T41 は音声 3A と DMIC をサポートし、Ingenic の Mert 音声アルゴリズムライブラリはノイズ抑制、エコーキャンセル、マルチマイク強調などを扱う。具体的な API と演算予算は SDK とボード設計に依存する。",
      ko: "공개 자료는 T41이 오디오 3A와 DMIC를 지원하며 Ingenic Mert 오디오 알고리즘 라이브러리가 노이즈 억제, 에코 제거 및 다중 마이크 향상 등을 다룬다고 설명함. 구체적인 API와 연산 예산은 SDK와 보드 설계에 따라 달라짐."
    },
    stages: [
      { zh: "Codec / I2S / PDM 音频进入 IMP Audio AI，按帧从内核 buffer 取 PCM。", "zh-Hant": traditional("Codec / I2S / PDM 音频进入 IMP Audio AI，按帧从内核 buffer 取 PCM。"), en: "Codec / I2S / PDM audio enters IMP Audio AI, and PCM frames are read from kernel buffers.", ja: "Codec / I2S / PDM 音声が IMP Audio AI に入り、カーネル buffer から PCM をフレーム単位で取得する。", ko: "Codec / I2S / PDM 오디오가 IMP Audio AI로 들어가며 커널 buffer에서 PCM을 프레임 단위로 읽음." },
      { zh: "根据产品启用 NS、AGC、AEC；AEC 同样需要播放侧 reference 和稳定延迟。", "zh-Hant": traditional("根据产品启用 NS、AGC、AEC；AEC 同样需要播放侧 reference 和稳定延迟。"), en: "Products enable NS, AGC, and AEC as needed; AEC still requires playback reference and stable delay.", ja: "製品要件に応じて NS、AGC、AEC を有効にする。AEC には再生側 reference と安定した遅延も必要。", ko: "제품에 따라 NS, AGC 및 AEC를 활성화하며 AEC에는 재생 측 reference와 안정적인 지연도 필요함." },
      { zh: "处理后 PCM 可以送编码、录像文件音轨、语音对讲或本地识别。", "zh-Hant": traditional("处理后 PCM 可以送编码、录像文件音轨、语音对讲或本地识别。"), en: "Processed PCM can go to encoding, video-file audio tracks, voice intercom, or local recognition.", ja: "処理後の PCM はエンコード、録画ファイルの音声トラック、音声通話、ローカル認識へ送れる。", ko: "처리된 PCM은 인코딩, 녹화 파일 오디오 트랙, 음성 인터컴 또는 로컬 인식으로 보낼 수 있음." },
      { zh: "算力较小的芯片通常会限制采样率、帧长、算法强度和多麦通道数。", "zh-Hant": traditional("算力较小的芯片通常会限制采样率、帧长、算法强度和多麦通道数。"), en: "Lower-power chips often constrain sample rate, frame size, algorithm strength, and number of microphone channels.", ja: "演算性能の低いチップでは、サンプルレート、フレーム長、アルゴリズム強度、マイクチャンネル数が制限されることが多い。", ko: "연산 성능이 낮은 칩은 보통 샘플 레이트, 프레임 길이, 알고리즘 강도 및 마이크 채널 수를 제한함." }
    ]
  }
];

const speechCopy = {
  flowAria: { zh: "语音增强处理流程图", "zh-Hant": traditional("语音增强处理流程图"), en: "Speech enhancement processing flow", ja: "音声強調処理フロー", ko: "음성 향상 처리 흐름" },
  flowTitle: { zh: "SoC SDK 风格：采集侧 VQE / 3A 处理链路", "zh-Hant": traditional("SoC SDK 风格：采集侧 VQE / 3A 处理链路"), en: "SoC SDK style: capture-side VQE / 3A chain", ja: "SoC SDK 型：収音側 VQE / 3A 処理チェーン", ko: "SoC SDK 방식: 수집 측 VQE / 3A 처리 체인" },
  singleMicBypass: { zh: "单麦无空间信息，跳过多麦增强", "zh-Hant": traditional("单麦无空间信息，跳过多麦增强"), en: "Single mic has no spatial cue, beamforming bypassed", ja: "単一マイクでは空間情報がなく、ビームフォーミングをバイパス", ko: "단일 마이크에는 공간 정보가 없어 빔포밍을 우회함" },
  playbackReference: { zh: "播放 reference", "zh-Hant": traditional("播放 reference"), en: "playback reference", ja: "再生 reference", ko: "재생 reference" },
  sdkBoundary: { zh: "Rockchip VQE / SigmaStar Audio Process / Ingenic IMP Audio：命名不同，边界类似", "zh-Hant": traditional("Rockchip VQE / SigmaStar Audio Process / Ingenic IMP Audio：命名不同，边界类似"), en: "Rockchip VQE / SigmaStar Audio Process / Ingenic IMP Audio: different names, similar boundaries", ja: "Rockchip VQE / SigmaStar Audio Process / Ingenic IMP Audio：名称不同，边界相似", ko: "Rockchip VQE / SigmaStar Audio Process / Ingenic IMP Audio: 이름은 다르지만 경계는 유사함" },
  solidDashed: { zh: "实线：PCM 主数据通路。虚线：播放信号与 AEC 参考的关联，不是另一条必须串行经过的处理链。", "zh-Hant": traditional("实线：PCM 主数据通路。虚线：播放信号与 AEC 参考的关联，不是另一条必须串行经过的处理链。"), en: "Solid: primary PCM data path. Dashed: association between playback and the AEC reference, not an additional mandatory serial processing chain.", ja: "実線：PCM の主データ経路。破線：再生信号と AEC reference の関係であり、別の必須直列処理チェーンではない。", ko: "실선: PCM 주 데이터 경로. 점선: 재생 신호와 AEC reference의 관계이며 별도의 필수 직렬 처리 체인이 아님." },
  chainOutput: { zh: "AGC 后仍是 PCM，可按应用选择编码、识别、录音或直接送 AO。AO 再经驱动、数字接口、DAC/Codec 与功放到扬声器，不必先编码。AEC 对齐播放参考和麦克风输入：参考应来自实际送往扬声器的播放信号，不是把 AGC 输出无条件回接 AEC。麦克风直通扬声器还需防止声反馈啸叫。", "zh-Hant": traditional("AGC 后仍是 PCM，可按应用选择编码、识别、录音或直接送 AO。AO 再经驱动、数字接口、DAC/Codec 与功放到扬声器，不必先编码。AEC 对齐播放参考和麦克风输入：参考应来自实际送往扬声器的播放信号，不是把 AGC 输出无条件回接 AEC。麦克风直通扬声器还需防止声反馈啸叫。"), en: "AGC still outputs PCM: route it to encoding, recognition, recording or directly to AO. AO feeds the driver, digital interface, DAC/Codec and amplifier/speaker; encoding is not required. AEC aligns reference and mic input: the reference must represent actual speaker playback, not an unconditional loop from AGC. Mic-to-speaker monitoring also requires acoustic-feedback control.", ja: "AGC の後も PCM なので、用途に応じてエンコード、認識、録音、または AO へ直接送れる。AO はドライバー、デジタルインターフェース、DAC/Codec、アンプを経てスピーカーへ進み、先にエンコードする必要はない。AEC は再生 reference とマイク入力を同期するため、reference は実際にスピーカーへ送る再生信号を表し、AGC 出力を無条件に AEC へ戻すものではない。マイクからスピーカーへのモニタリングには音響フィードバック対策も必要。", ko: "AGC 후에도 PCM이므로 용도에 따라 인코딩, 인식, 녹음 또는 AO로 직접 보낼 수 있음. AO는 드라이버, 디지털 인터페이스, DAC/Codec 및 앰프를 거쳐 스피커로 전달되며 먼저 인코딩할 필요가 없음. AEC는 재생 reference와 마이크 입력을 정렬하므로 reference는 실제 스피커로 보내는 재생 신호를 나타내야 하며 AGC 출력을 무조건 AEC로 되돌리는 것이 아님. 마이크에서 스피커로 직접 모니터링할 때는 음향 피드백 대책도 필요함." },
  audioFlow: { zh: "音频处理流程图", "zh-Hant": traditional("音频处理流程图"), en: "audio processing flow", ja: "オーディオ処理フロー", ko: "오디오 처리 흐름" },
  typicalChain: { zh: "典型处理链路", "zh-Hant": traditional("典型处理链路"), en: "Typical processing chain", ja: "典型的な処理チェーン", ko: "일반적인 처리 체인" },
  backKnowledge: { zh: "返回知识库", "zh-Hant": traditional("返回知识库"), en: "Back to knowledge base", ja: "ナレッジベースに戻る", ko: "지식 베이스로 돌아가기" },
  backDetails: { zh: "返回详细内容", "zh-Hant": traditional("返回详细内容"), en: "Back to detailed content", ja: "詳細コンテンツに戻る", ko: "상세 내용으로 돌아가기" },
  algorithmAria: { zh: "语音增强算法", "zh-Hant": traditional("语音增强算法"), en: "Speech enhancement algorithms", ja: "音声強調アルゴリズム", ko: "음성 향상 알고리즘" },
  aecConcept: { zh: "概念仿真：回声由已知播放参考延迟、缩放产生，滑块控制估计回声的抵消比例。这里没有训练自适应滤波器，也不模拟双讲检测和收敛过程；结果不能用于评估真实 AEC 性能。", "zh-Hant": traditional("概念仿真：回声由已知播放参考延迟、缩放产生，滑块控制估计回声的抵消比例。这里没有训练自适应滤波器，也不模拟双讲检测和收敛过程；结果不能用于评估真实 AEC 性能。"), en: "Concept simulation: echo is a delayed, scaled playback reference; the slider controls the cancellation fraction. No adaptive filter training, double-talk detector or convergence is simulated. Results do not measure real AEC performance.", ja: "概念シミュレーション：既知の再生 reference を遅延・スケーリングしてエコーを作り、スライダーで推定エコーのキャンセル率を制御する。適応フィルターの学習、ダブルトーク検出、収束過程は再現せず、結果は実際の AEC 性能を測定しない。", ko: "개념 시뮬레이션: 알려진 재생 reference를 지연·스케일링해 에코를 만들고 슬라이더로 추정 에코 제거율을 제어함. 적응형 필터 학습, 더블 토크 검출 또는 수렴 과정은 시뮬레이션하지 않으며 결과는 실제 AEC 성능을 측정하지 않음." },
  standalone: { zh: "当前为独立算法示例，不串接其他页面的波形。空间参数和频谱增益只影响本页。", "zh-Hant": traditional("当前为独立算法示例，不串接其他页面的波形。空间参数和频谱增益只影响本页。"), en: "Standalone algorithm example, not connected to other pages' waveforms. Spatial parameters and spectral gain affect this page only.", ja: "独立したアルゴリズム例で、他ページの波形とは接続していない。空間パラメータとスペクトルゲインはこのページだけに作用する。", ko: "독립 알고리즘 예시이며 다른 페이지의 파형과 연결되지 않음. 공간 파라미터와 스펙트럼 게인은 이 페이지만 변경함." },
  workbench: { zh: "算法独立实验页", "zh-Hant": traditional("算法独立实验页"), en: "Individual algorithm workbench", ja: "アルゴリズム別ワークベンチ", ko: "알고리즘별 워크벤치" },
  microphoneCount: { zh: "麦克风数量", "zh-Hant": traditional("麦克风数量"), en: "Microphone count", ja: "マイク本数", ko: "마이크 수" },
  basicPrinciple: { zh: "基本原理", "zh-Hant": traditional("基本原理"), en: "Basic principle", ja: "基本原理", ko: "기본 원리" },
  steeringAngle: { zh: "指向角度", "zh-Hant": traditional("指向角度"), en: "Steering angle", ja: "ステアリング角度", ko: "조향 각도" },
  processingStrength: { zh: "处理强度", "zh-Hant": traditional("处理强度"), en: "Processing strength", ja: "処理強度", ko: "처리 강도" },
  aecComparison: { zh: "AEC 对照条件", "zh-Hant": traditional("AEC 对照条件"), en: "AEC comparison", ja: "AEC 比較条件", ko: "AEC 비교 조건" },
  chooseCancellation: { zh: "选择抵消强度", "zh-Hant": traditional("选择抵消强度"), en: "Choose cancellation strength", ja: "キャンセル強度を選択", ko: "제거 강도 선택" },
  engineeringLimits: { zh: "工程限制", "zh-Hant": traditional("工程限制"), en: "Engineering limits", ja: "工学上の制約", ko: "엔지니어링 한계" },
  adjacent: { zh: "相邻算法", "zh-Hant": traditional("相邻算法"), en: "Adjacent algorithms", ja: "隣接アルゴリズム", ko: "인접 알고리즘" },
  previous: { zh: "上一算法", "zh-Hant": traditional("上一算法"), en: "Previous", ja: "前のアルゴリズム", ko: "이전 알고리즘" },
  next: { zh: "下一算法", "zh-Hant": traditional("下一算法"), en: "Next", ja: "次のアルゴリズム", ko: "다음 알고리즘" },
  fullChain: { zh: "完整链路参考", "zh-Hant": traditional("完整链路参考"), en: "Full chain reference", ja: "完全なチェーンの参考", ko: "전체 체인 참고" },
  sdkReference: { zh: "SoC SDK 与工程参考", "zh-Hant": traditional("SoC SDK 与工程参考"), en: "SoC SDK and engineering references", ja: "SoC SDK と実装上の参考", ko: "SoC SDK 및 엔지니어링 참고" },
  sdkModules: { zh: "SDK 模块对照", "zh-Hant": traditional("SDK 模块对照"), en: "SDK module mapping", ja: "SDK モジュール対応表", ko: "SDK 모듈 매핑" },
  socFlows: { zh: "SoC SDK 音频处理流程", "zh-Hant": traditional("SoC SDK 音频处理流程"), en: "SoC SDK audio processing flows", ja: "SoC SDK オーディオ処理フロー", ko: "SoC SDK 오디오 처리 흐름" },
  commonSocFlows: { zh: "常见 SoC SDK 音频处理流程", "zh-Hant": traditional("常见 SoC SDK 音频处理流程"), en: "Common SoC SDK Audio Flows", ja: "代表的な SoC SDK オーディオ処理フロー", ko: "일반적인 SoC SDK 오디오 처리 흐름" },
  socIntro: { zh: "不同 SDK 版本命名会变化，下面按工程模块边界理解：采集、回采、语音增强、编码或识别。", "zh-Hant": traditional("不同 SDK 版本命名会变化，下面按工程模块边界理解：采集、回采、语音增强、编码或识别。"), en: "Names differ by SDK version, so these flows focus on engineering boundaries: capture, playback reference, voice enhancement, and encoding or recognition.", ja: "SDK のバージョンで名称は変わるため、ここでは収音、再生回収、音声強調、エンコードまたは認識という実装上の境界に注目する。", ko: "SDK 버전에 따라 이름이 달라지므로 여기서는 수집, 재생 회수, 음성 향상, 인코딩 또는 인식이라는 엔지니어링 경계에 초점을 둠." },
  recommendedChips: { zh: "主流芯片推荐", "zh-Hant": traditional("主流芯片推荐"), en: "Recommended mainstream chips", ja: "主な推奨チップ", ko: "주요 권장 칩" }
} satisfies Record<string, Localized>;


function EnhancementFlowChart({
  language,
  micCount,
  mode
}: {
  language: Language;
  micCount: number;
  mode: EnhancementMode;
}) {
  const isMultiMic = micCount > 1;
  const micLabel = {
    zh: micCount === 1 ? "1 Mic 单麦" : `${micCount} Mic 阵列`, "zh-Hant": traditional(micCount === 1 ? "1 Mic 单麦" : `${micCount} Mic 阵列`),
    en: micCount === 1 ? "1 Mic single" : `${micCount} Mic array`,
    ja: micCount === 1 ? "1 Mic 単一マイク" : `${micCount} Mic アレイ`,
    ko: micCount === 1 ? "1 Mic 단일 마이크" : `${micCount} Mic 배열`
  }[language];
  const nodes = [
    { id: "mic", label: "Mic / PDM / I2S", sub: { zh: micLabel, "zh-Hant": traditional(micLabel), en: micLabel, ja: micLabel, ko: micLabel }, x: 46, y: 76 },
    { id: "ai", label: "AI", sub: { zh: "ring buffer", "zh-Hant": traditional("ring buffer"), en: "ring buffer", ja: "ring buffer", ko: "ring buffer" }, x: 192, y: 76 },
    {
      id: "beamforming",
      label: "Beamforming",
      sub: { zh: isMultiMic ? "DOA + 定向拾音" : "单麦跳过", "zh-Hant": traditional(isMultiMic ? "DOA + 定向拾音" : "单麦跳过"), en: isMultiMic ? "DOA + pickup" : "bypassed", ja: isMultiMic ? "DOA + 指向収音" : "単一マイクでバイパス", ko: isMultiMic ? "DOA + 지향 수음" : "단일 마이크로 우회" },
      x: 338,
      y: 76
    },
    { id: "aec", label: "AEC", sub: { zh: "消回声", "zh-Hant": traditional("消回声"), en: "echo cancel", ja: "エコーキャンセル", ko: "에코 제거" }, x: 484, y: 76 },
    { id: "ns", label: "NS / ANR", sub: { zh: "降噪", "zh-Hant": traditional("降噪"), en: "denoise", ja: "ノイズ抑制", ko: "노이즈 억제" }, x: 192, y: 220 },
    { id: "dereverb", label: "Dereverb", sub: { zh: "去混响", "zh-Hant": traditional("去混响"), en: "tail reduce", ja: "残響尾部を低減", ko: "잔향 꼬리 감소" }, x: 338, y: 220 },
    { id: "agc", label: "AGC", sub: { zh: "自动增益", "zh-Hant": traditional("自动增益"), en: "auto gain", ja: "自動ゲイン", ko: "자동 게인" }, x: 484, y: 220 },
    { id: "out", label: "PCM", sub: { zh: "增强后数据", "zh-Hant": traditional("增强后数据"), en: "enhanced samples", ja: "強調後サンプル", ko: "향상된 샘플" }, x: 484, y: 350 },
    { id: "encode", label: "AENC / ASR", sub: { zh: "编码或识别", "zh-Hant": traditional("编码或识别"), en: "encode or ASR", ja: "エンコードまたは ASR", ko: "인코딩 또는 ASR" }, x: 338, y: 490 },
    { id: "play", label: "AO", sub: { zh: "本地播放", "zh-Hant": traditional("本地播放"), en: "local playback", ja: "ローカル再生", ko: "로컬 재생" }, x: 484, y: 490 }
  ] as const;

  return (
    <>
    <svg
      aria-label={speechCopy.flowAria[language]}
      className="speech-enhancement-flow-chart"
      role="img"
      viewBox="0 0 720 650"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <marker id="speechLabArrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
          <path d="M0 0 8 4 0 8Z" fill="#dcece8" />
        </marker>
      </defs>
      <rect className="lab-diagram-bg" height="650" rx="16" width="720" />
      <text className="speech-lab-chart-title" x="44" y="42">
        {speechCopy.flowTitle[language]}
      </text>
      <path className="speech-lab-flow-link" d="M 164 117 H 192" />
      <path className={isMultiMic ? "speech-lab-flow-link" : "speech-lab-flow-link muted"} d="M 310 117 H 338" />
      <path className={isMultiMic ? "speech-lab-flow-link" : "speech-lab-flow-link muted"} d="M 456 117 H 484" />
      {!isMultiMic ? (
        <>
          <path className="speech-lab-flow-link bypass" d="M 310 94 C 360 64 434 64 484 94" />
          <text className="speech-lab-bypass-label" x="397" y="72">
            {speechCopy.singleMicBypass[language]}
          </text>
        </>
      ) : null}
      <path className="speech-lab-flow-link" d="M 550 158 V 198 H 251 V 220" />
      <path className="speech-lab-flow-link" d="M 310 261 H 338" />
      <path className="speech-lab-flow-link" d="M 456 261 H 484" />
      <path className="speech-lab-flow-link" d="M 550 302 V 350" />
      <path className="speech-lab-flow-link" data-testid="speech-pcm-to-encode" d="M 543 432 V 460 H 397 V 490" />
      <path className="speech-lab-flow-link" data-testid="speech-pcm-to-ao" d="M 543 460 V 490" />
      <path className="speech-lab-reference-link" data-testid="speech-playback-to-ao" d="M 127 426 V 592 H 650 V 531 H 602" />
      <g className="speech-lab-reference">
        <rect height="76" rx="12" width="170" x="42" y="350" />
        <text x="127" y="382">Playback / Mixer</text>
        <text x="127" y="406">{speechCopy.playbackReference[language]}</text>
      </g>
      <path className="speech-lab-reference-link" d="M 42 388 H 20 V 58 H 543 V 76" />
      <g className="speech-lab-mic-array" aria-hidden="true">
        {Array.from({ length: micCount }, (_, index) => (
          <circle
            cx={84 + index * (micCount === 4 ? 14 : 22)}
            cy="170"
            key={index}
            r="5"
          />
        ))}
        <text x="105" y="190">{micLabel}</text>
      </g>
      {nodes.map((node) => (
        <g
          className={
            `${(mode === "aec" && node.id === "aec") ||
            (mode === "ns" && node.id === "ns") ||
            (mode === "agc" && node.id === "agc") ||
            (mode === "beamforming" && node.id === "beamforming") ||
            (mode === "dereverb" && node.id === "dereverb")
              ? "speech-lab-node active"
              : "speech-lab-node"}${node.id === "beamforming" && !isMultiMic ? " disabled" : ""}`
          }
          key={node.id}
        >
          <rect height="82" rx="12" width="118" x={node.x} y={node.y} />
          <text className="speech-lab-node-title" x={node.x + 59} y={node.y + 32}>{node.label}</text>
          <text className="speech-lab-node-sub" x={node.x + 59} y={node.y + 56}>{node.sub[language]}</text>
        </g>
      ))}
      <text className="speech-lab-sdk-label" x="44" y="624">
        {speechCopy.sdkBoundary[language]}
      </text>
    </svg>
    <p className="speech-mic-note">{speechCopy.solidDashed[language]}</p>
    <p className="speech-mic-note">{speechCopy.chainOutput[language]}</p>
    </>
  );
}

function SocFlowDiagram({
  flow,
  language,
  name
}: {
  flow: SocFlow["flow"];
  language: Language;
  name: string;
}) {
  const mainFlow = flow.slice(0, 4);
  const reference = flow[4];
  const markerId = `socArrow-${name.replace(/\W/g, "-")}`;

  return (
    <svg
      aria-label={`${name} ${speechCopy.audioFlow[language]}`}
      className="speech-soc-flow-chart"
      role="img"
      viewBox="0 0 520 238"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <marker id={markerId} markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
          <path d="M0 0 8 4 0 8Z" fill="#dcece8" />
        </marker>
      </defs>
      <rect className="speech-soc-flow-bg" height="238" rx="12" width="520" />
      <text className="speech-soc-flow-title" x="24" y="32">{speechCopy.typicalChain[language]}</text>
      {mainFlow.map((step, index) => {
        const x = 24 + index * 122;

        return (
          <g className="speech-soc-flow-node" key={step.label}>
            <rect height="72" rx="10" width="100" x={x} y="64" />
            <text className="speech-soc-flow-node-title" x={x + 50} y="92">{step.label}</text>
            <text className="speech-soc-flow-node-sub" x={x + 50} y="116">{step.detail[language]}</text>
          </g>
        );
      })}
      <path className="speech-soc-flow-link" d="M 124 100 H 146" markerEnd={`url(#${markerId})`} />
      <path className="speech-soc-flow-link" d="M 246 100 H 268" markerEnd={`url(#${markerId})`} />
      <path className="speech-soc-flow-link" d="M 368 100 H 390" markerEnd={`url(#${markerId})`} />
      {reference ? (
        <>
          <g className="speech-soc-flow-node reference">
            <rect height="62" rx="10" width="132" x="40" y="158" />
            <text className="speech-soc-flow-node-title" x="106" y="183">{reference.label}</text>
            <text className="speech-soc-flow-node-sub" x="106" y="205">{reference.detail[language]}</text>
          </g>
          <path className="speech-soc-flow-reference-link" d="M 172 189 C 250 188 284 132 322 101" markerEnd={`url(#${markerId})`} />
        </>
      ) : null}
    </svg>
  );
}

export function SpeechEnhancementLab({ language, onBack, onBackToDetails }: SpeechEnhancementLabProps) {
  const [page, setPage] = useLabState<EnhancementMode>(
    "SpeechEnhancementLab.page",
    "aec",
    (value): value is EnhancementMode => value === "aec" || value === "ns" || value === "agc" || value === "beamforming" || value === "dereverb"
  );
  const [strengths, setStrengths] = useLabState<ProcessingStrengths>(
    "SpeechEnhancementLab.strengths",
    () => ({ ...defaultProcessingStrengths }),
    (value): value is ProcessingStrengths => {
      if (typeof value !== "object" || value === null) return false;
      const candidate = value as Record<string, unknown>;
      return ["beamforming", "aec", "ns", "dereverb", "agc"].every(key => {
        const strength = candidate[key];
        return typeof strength === "number" && Number.isFinite(strength) && Number.isInteger(strength) && strength >= 0 && strength <= 100 && strength % 5 === 0;
      });
    }
  );
  const [micCount, setMicCount] = useLabState(
    "SpeechEnhancementLab.micCount",
    2,
    (value): value is number => value === 1 || value === 2 || value === 4
  );
  const [steering, setSteering] = useLabState(
    "SpeechEnhancementLab.steering",
    30,
    (value): value is number => typeof value === "number" && Number.isFinite(value) && Number.isInteger(value) && value >= -90 && value <= 90 && (value + 90) % 5 === 0
  );
  const index = flowModes.indexOf(page);
  const guide = page === "aec" || page === "ns" || page === "agc" ? enhancementGuides[page] : null;
  const extraPrinciple = page === "beamforming"
    ? ({
      zh: "同一个声源到达不同麦克风的时间和相位不同。波束成形对各路信号施加延迟和权重后相加，让目标方向的声音尽量同相叠加，其他方向的干扰受到抑制。目标方向可以预先设定，也可以由 DOA 定位结果提供；并非所有波束成形都必须先做定位。这里按理想远场模型计算延迟求和，未模拟房间反射。", "zh-Hant": traditional("同一个声源到达不同麦克风的时间和相位不同。波束成形对各路信号施加延迟和权重后相加，让目标方向的声音尽量同相叠加，其他方向的干扰受到抑制。目标方向可以预先设定，也可以由 DOA 定位结果提供；并非所有波束成形都必须先做定位。这里按理想远场模型计算延迟求和，未模拟房间反射。"),
      en: "A source reaches different microphones with different delays and phases. Beamforming delays and weights the channels before summing them, aligning the target direction while reducing other directions. Steering can be fixed or supplied by DOA estimation; localization is not mandatory. This demo calculates delay-and-sum for ideal far-field waves, without room reflections.",
      ja: "同じ音源でもマイクごとに到達時間と位相が異なる。ビームフォーミングは各信号を遅延・重み付けして加算し、目標方向を同相にそろえて他方向の干渉を抑える。ステアリングは固定でも DOA 推定から与えてもよく、定位が必須とは限らない。このデモは理想的な遠方場の遅延和を計算し、部屋の反射は再現しない。",
      ko: "같은 음원도 마이크마다 도달 시간과 위상이 다름. 빔포밍은 각 신호에 지연과 가중치를 적용해 합산하여 목표 방향을 동상으로 정렬하고 다른 방향의 간섭을 줄임. 조향은 고정하거나 DOA 추정으로 제공할 수 있으며 위치 추정이 필수는 아님. 이 데모는 이상적인 원거리장 지연 합을 계산하고 공간 반사는 모델링하지 않음."
    } satisfies Localized)[language]
    : ({
      zh: "房间反射使直达声之后仍有衰减的声音尾巴，多个音节因此互相叠加。去混响利用信号的时间相关性、频谱或房间模型，估计并减弱后期反射，尽量保留直达声及有用的早期反射。它不是简单删掉某个时间点之后的声音；本演示仅降低已知拖尾分量的幅度。", "zh-Hant": traditional("房间反射使直达声之后仍有衰减的声音尾巴，多个音节因此互相叠加。去混响利用信号的时间相关性、频谱或房间模型，估计并减弱后期反射，尽量保留直达声及有用的早期反射。它不是简单删掉某个时间点之后的声音；本演示仅降低已知拖尾分量的幅度。"),
      en: "Room reflections produce decaying tails after direct sound, smearing successive syllables. Dereverberation uses temporal correlation, spectral information or room models to estimate and reduce late reflections while preserving direct sound and useful early reflections. It does not simply delete everything after a time point; this demo only attenuates a known tail component.",
      ja: "部屋の反射は直接音の後に減衰する尾部を生み、連続する音節を重ね合わせる。残響除去は時間相関、スペクトル、部屋のモデルなどを使って後期反射を推定・低減し、直接音と有用な初期反射をなるべく保つ。特定の時刻以降を単純に削除するものではなく、このデモは既知の尾部成分の振幅だけを下げる。",
      ko: "공간 반사는 직접음 뒤에 감쇠하는 꼬리를 만들어 연속된 음절을 겹치게 함. 잔향 제거는 시간 상관, 스펙트럼 또는 공간 모델을 이용해 후기 반사를 추정하고 줄이면서 직접음과 유용한 초기 반사를 최대한 보존함. 특정 시점 이후를 단순히 삭제하는 것이 아니며 이 데모는 알려진 꼬리 성분의 진폭만 낮춤."
    } satisfies Localized)[language];
  const inputs: Record<EnhancementMode, Localized> = {
    beamforming: { zh: "麦克风采集；单麦时旁路多麦处理", "zh-Hant": traditional("麦克风采集；单麦时旁路多麦处理"), en: "Microphone capture; array processing is bypassed with one microphone", ja: "マイク収音。1 本の場合はアレイ処理をバイパス", ko: "마이크 수집. 한 개일 때 배열 처리를 우회함" },
    aec: { zh: "麦克风采集，包含已启用的多麦预处理", "zh-Hant": traditional("麦克风采集，包含已启用的多麦预处理"), en: "Microphone capture, including enabled array preprocessing", ja: "有効なアレイ前処理を含むマイク収音", ko: "활성화된 배열 전처리를 포함한 마이크 수집" },
    ns: { zh: "AEC 输出", "zh-Hant": traditional("AEC 输出"), en: "AEC output", ja: "AEC 出力", ko: "AEC 출력" },
    dereverb: { zh: "AEC → ANR/NS 后的 PCM", "zh-Hant": traditional("AEC → ANR/NS 后的 PCM"), en: "PCM after AEC → ANR/NS", ja: "AEC → ANR/NS 後の PCM", ko: "AEC → ANR/NS 후 PCM" },
    agc: { zh: "AEC → ANR/NS → 去混响后的 PCM", "zh-Hant": traditional("AEC → ANR/NS → 去混响后的 PCM"), en: "PCM after AEC → ANR/NS → dereverberation", ja: "AEC → ANR/NS → 残響除去後の PCM", ko: "AEC → ANR/NS → 잔향 제거 후 PCM" }
  };
  const input = inputs[page][language];
  const currentInput = {
    zh: `当前输入：${input}；${micCount} Mic。此页仍使用简化链路模型，不采用独立波束/频谱实验的输出。`, "zh-Hant": traditional(`当前输入：${input}；${micCount} Mic。此页仍使用简化链路模型，不采用独立波束/频谱实验的输出。`),
    en: `Input: ${input}; ${micCount} microphones. This page retains the simplified chain model, not the outputs of the standalone spatial/spectral experiments.`,
    ja: `現在の入力：${input}。${micCount} 本のマイク。このページは簡略化したチェーンモデルを使い、独立した空間/スペクトル実験の出力は使用しない。`,
    ko: `현재 입력: ${input}; 마이크 ${micCount}개. 이 페이지는 단순화된 체인 모델을 유지하며 독립 공간/스펙트럼 실험의 출력은 사용하지 않음.`
  }[language];
  function openAlgorithm(next: EnhancementMode) {
    setPage(next);
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  const pageNavigation = <nav className="waveform-tabs speech-enhancement-tabs" aria-label={speechCopy.algorithmAria[language]}>
    {flowModes.map(item => <button key={item} type="button" className={item === page ? "active" : ""} aria-current={item === page ? "page" : undefined} onClick={() => openAlgorithm(item)}>{modeLabels[item][language]}</button>)}
  </nav>;
    return <main className="speech-enhancement-page">
      <section className="sound-lab-hero">
        <div className="sound-lab-back-actions">
          <button type="button" className="sound-lab-back" onClick={onBack}>{speechCopy.backKnowledge[language]}</button>
          {onBackToDetails && <button type="button" className="sound-lab-back" onClick={onBackToDetails}>{speechCopy.backDetails[language]}</button>}
        </div>
        <h1>{modeLabels[page][language]}</h1>
        <p>{modeDescriptions[page][language]}</p>
        {page === "aec" && <p>{speechCopy.aecConcept[language]}</p>}
        {pageNavigation}
      </section>
      <section className="speech-enhancement-workbench" aria-label={speechCopy.workbench[language]}>
        <p className="speech-mic-note">{page === "beamforming" || page === "ns"
          ? speechCopy.standalone[language]
          : currentInput}</p>
        {page === "beamforming" && <div className="speech-mic-selector" role="group" aria-label={speechCopy.microphoneCount[language]}>
          {[1, 2, 4].map(count => <button key={count} type="button" className={micCount === count ? "active" : ""} onClick={() => setMicCount(count)}>{count} Mic</button>)}
        </div>}
        <div className="speech-enhancement-visuals">
          <section className="speech-module-guide" aria-label={speechCopy.basicPrinciple[language]}>
            <details className="speech-explanation"><summary>{speechCopy.basicPrinciple[language]}</summary>
            {guide ? <div>{guide.sections.map((item, i) => <section key={i}><h3>{item[language][0]}</h3><p>{item[language][1]}</p></section>)}</div> : <p>{extraPrinciple}</p>}
            </details>
          </section>
          <label className="sound-lab-control speech-live-strength">
            <span>{page === "beamforming" ? `${speechCopy.steeringAngle[language]} · ${steering}°` : `${modeLabels[page][language]} · ${strengths[page]}%`}</span>
            {page === "beamforming" ? <input type="range" min="-90" max="90" step="5" value={steering} aria-label={speechCopy.steeringAngle[language]} onChange={event => setSteering(Number(event.target.value))} />
              : <input type="range" min="0" max="100" step="5" value={strengths[page]} aria-label={speechCopy.processingStrength[language]} onChange={event => setStrengths(current => ({ ...current, [page]: Number(event.target.value) }))} />}
          </label>
          {page === "aec" && <label className="digital-study-select"><span>{speechCopy.aecComparison[language]}</span><select value="" onChange={event => { if (event.target.value !== "") setStrengths(current => ({ ...current, aec: Number(event.target.value) })); }}>
            <option value="">{speechCopy.chooseCancellation[language]}</option>
            {[0, 50, 100].map(value => <option key={value} value={value}>{value}%</option>)}
          </select></label>}
          {page === "beamforming" || page === "ns" ? <SpatialSpectralDemo language={language} mode={page} micCount={micCount} steering={steering} strength={strengths[page]} />
            : <EnhancementStageFocus language={language} mode={page} strengths={{ ...strengths, ns: defaultProcessingStrengths.ns, beamforming: defaultProcessingStrengths.beamforming }} micCount={micCount} />}
          <details className="speech-explanation"><summary>{speechCopy.engineeringLimits[language]}</summary><p>{modeLimits[page][language]}</p></details>
        </div>
        <nav className="sound-lab-back-actions" aria-label={speechCopy.adjacent[language]}>
          {index > 0 && <button type="button" className="sine-button" onClick={() => openAlgorithm(flowModes[index - 1])}>{speechCopy.previous[language]} · {modeLabels[flowModes[index - 1]][language]}</button>}
          {index < flowModes.length - 1 && <button type="button" className="sine-button" onClick={() => openAlgorithm(flowModes[index + 1])}>{speechCopy.next[language]} · {modeLabels[flowModes[index + 1]][language]}</button>}
        </nav>
        <details className="speech-supplement"><summary>{speechCopy.fullChain[language]}</summary><EnhancementFlowChart language={language} micCount={micCount} mode={page} /></details>
        <details className="speech-supplement">
        <summary>{speechCopy.sdkReference[language]}</summary>
        <section className="speech-sdk-table" aria-label={speechCopy.sdkModules[language]}>
          {sdkRows.map((row) => (
            <article key={row.module}>
              <h2>{row.module}</h2>
              <p>{row[language]}</p>
            </article>
          ))}
        </section>

        <section className="speech-soc-section" aria-label={speechCopy.socFlows[language]}>
          <div className="speech-soc-heading">
            <h2>{speechCopy.commonSocFlows[language]}</h2>
            <p>{speechCopy.socIntro[language]}</p>
          </div>
          <div className="speech-soc-grid">
            {socFlows.map((flow) => (
              <article key={flow.name}>
                <h3>{flow.name}</h3>
                <p>{flow.summary[language]}</p>
                <SocFlowDiagram flow={flow.flow} language={language} name={flow.name} />
                <ol>
                  {flow.stages.map((stage) => (
                    <li key={stage.en}>{stage[language]}</li>
                  ))}
                </ol>
                <div className="speech-soc-chip-list" aria-label={`${flow.name} ${speechCopy.recommendedChips[language]}`}>
                  <strong>{speechCopy.recommendedChips[language]}</strong>
                  {flow.chips.map((chip) => (
                    <p key={chip.model}>
                      <span>{chip.model}</span>
                      {chip[language]}
                    </p>
                  ))}
                </div>
                <p className="speech-soc-note">{flow.note[language]}</p>
              </article>
            ))}
          </div>
        </section>
        </details>
      </section>
    </main>;

}
