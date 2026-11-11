import { traditional } from "../content/traditional";
import { ArrowDown, ArrowLeft, Headphones, Speaker } from "lucide-react";
import { text } from "../content/language";
import { useMemo, useState } from "react";
import type { Language } from "../content/knowledge";

type SpatialAudioLabProps = {
  language: Language;
  onBack: () => void;
  onBackToDetails?: () => void;
};

type SpatialMode = "cues" | "binaural" | "object" | "headTracking";
type Localized = Record<"zh" | "en" | "ja" | "ko" | "zh-Hant", string>;

const modeLabels: Record<SpatialMode, Localized> = {
  cues: { zh: "定位线索", "zh-Hant": traditional("定位线索"), en: "Localization cues", ja: "定位手がかり", ko: "위치 단서" },
  binaural: { zh: "双耳渲染", "zh-Hant": traditional("双耳渲染"), en: "Binaural rendering", ja: "バイノーラルレンダリング", ko: "바이노럴 렌더링" },
  object: { zh: "对象 / 声道", "zh-Hant": traditional("对象 / 声道"), en: "Object / channel", ja: "オブジェクト / チャンネル", ko: "오브젝트 / 채널" },
  headTracking: { zh: "头部追踪", "zh-Hant": traditional("头部追踪"), en: "Head tracking", ja: "ヘッドトラッキング", ko: "헤드 트래킹" }
};

const modeDescriptions: Record<SpatialMode, Localized> = {
  cues: {
    zh: "观察声源相对方向如何改变 ITD/ILD，以及距离和反射如何改变到达时间与能量；这里不计算真实 HRTF 频谱。", "zh-Hant": traditional("观察声源相对方向如何改变 ITD/ILD，以及距离和反射如何改变到达时间与能量；这里不计算真实 HRTF 频谱。"),
    en: "Observe directional ITD/ILD trends and how distance and reflections change arrival time and energy; actual HRTF spectra are not computed here.",
    ja: "音源の相対方向が ITD/ILD をどう変えるか、距離と反射が到達時間とエネルギーをどう変えるかを観察する。ここでは実際の HRTF スペクトルは計算しない。",
    ko: "음원의 상대 방향이 ITD/ILD를 어떻게 바꾸는지, 거리와 반사가 도달 시간과 에너지를 어떻게 바꾸는지 관찰함. 여기서는 실제 HRTF 스펙트럼을 계산하지 않음."
  },
  binaural: {
    zh: "耳机空间音频通常把每个虚拟声源与对应方向的 HRIR 卷积，得到左耳和右耳 PCM。", "zh-Hant": traditional("耳机空间音频通常把每个虚拟声源与对应方向的 HRIR 卷积，得到左耳和右耳 PCM。"),
    en: "Headphone spatial audio usually convolves each virtual source with direction-specific HRIRs to produce left-ear and right-ear PCM.",
    ja: "ヘッドホンの空間音声では通常、各仮想音源を方向に対応した HRIR と畳み込み、左耳・右耳の PCM を生成する。",
    ko: "헤드폰 공간 오디오는 보통 각 가상 음원을 방향별 HRIR과 컨볼루션하여 왼쪽 귀와 오른쪽 귀 PCM을 생성함."
  },
  object: {
    zh: "对象音频保存声音和位置元数据，播放端按耳机或实际扬声器布局渲染；固定声道则已有约定位置。", "zh-Hant": traditional("对象音频保存声音和位置元数据，播放端按耳机或实际扬声器布局渲染；固定声道则已有约定位置。"),
    en: "Object audio stores sound and position metadata for rendering to headphones or the actual speaker layout; fixed channels already have assigned positions.",
    ja: "オブジェクト音声は音と位置メタデータを保存し、ヘッドホンや実際のスピーカー配置に合わせて描画する。固定チャンネルには所定の位置がある。",
    ko: "오브젝트 오디오는 소리와 위치 메타데이터를 저장해 헤드폰이나 실제 스피커 배치에 맞게 렌더링함. 고정 채널에는 지정된 위치가 있음."
  },
  headTracking: {
    zh: "头部追踪让声源固定在外部世界；转头时渲染器要低延迟更新相对耳朵的方向。", "zh-Hant": traditional("头部追踪让声源固定在外部世界；转头时渲染器要低延迟更新相对耳朵的方向。"),
    en: "Head tracking keeps sources fixed in the outside world; as the head turns, the renderer must update the source direction relative to the ears with low latency.",
    ja: "ヘッドトラッキングは音源を外界に固定する。頭を回すと、レンダラーは耳に対する音源方向を低遅延で更新する必要がある。",
    ko: "헤드 트래킹은 음원을 외부 세계에 고정함. 머리를 돌리면 렌더러가 귀를 기준으로 한 음원 방향을 낮은 지연으로 갱신해야 함."
  }
};

const pipelineSteps: Record<Exclude<SpatialMode, "object">, Array<{ title: Localized; detail: Localized }>> = {
  cues: [
    { title: { zh: "声源位置", "zh-Hant": traditional("声源位置"), en: "Source position", ja: "音源位置", ko: "음원 위치" }, detail: { zh: "角度、距离、移动", "zh-Hant": traditional("角度、距离、移动"), en: "angle, distance, motion", ja: "角度、距離、移動", ko: "각도, 거리, 이동" } },
    { title: { zh: "双耳线索", "zh-Hant": traditional("双耳线索"), en: "Binaural cues", ja: "両耳の手がかり", ko: "양이 단서" }, detail: { zh: "ITD / ILD", "zh-Hant": traditional("ITD / ILD"), en: "ITD / ILD", ja: "ITD / ILD", ko: "ITD / ILD" } },
    { title: { zh: "耳廓滤波", "zh-Hant": traditional("耳廓滤波"), en: "Pinna filtering", ja: "耳介フィルタリング", ko: "귓바퀴 필터링" }, detail: { zh: "HRTF 峰谷", "zh-Hant": traditional("HRTF 峰谷"), en: "HRTF peaks/notches", ja: "HRTF のピーク/ノッチ", ko: "HRTF 피크/노치" } },
    { title: { zh: "距离与房间", "zh-Hant": traditional("距离与房间"), en: "Distance / room", ja: "距離 / 部屋", ko: "거리 / 공간" }, detail: { zh: "反射、混响、衰减", "zh-Hant": traditional("反射、混响、衰减"), en: "reflections, reverb, loss", ja: "反射、残響、減衰", ko: "반사, 잔향, 감쇠" } }
  ],
  binaural: [
    { title: { zh: "对象 / 声源", "zh-Hant": traditional("对象 / 声源"), en: "Object / source", ja: "オブジェクト / 音源", ko: "오브젝트 / 음원" }, detail: { zh: "mono 或多路素材", "zh-Hant": traditional("mono 或多路素材"), en: "mono or multi-channel asset", ja: "mono またはマルチチャンネル素材", ko: "mono 또는 다중 채널 소스" } },
    { title: { zh: "方位参数", "zh-Hant": traditional("方位参数"), en: "Spatial parameters", ja: "空間パラメータ", ko: "공간 파라미터" }, detail: { zh: "方位角、距离、仰角", "zh-Hant": traditional("方位角、距离、仰角"), en: "azimuth, distance, elevation", ja: "方位角、距離、仰角", ko: "방위각, 거리, 고도각" } },
    { title: { zh: "HRIR 卷积", "zh-Hant": traditional("HRIR 卷积"), en: "HRIR convolution", ja: "HRIR 畳み込み", ko: "HRIR 컨볼루션" }, detail: { zh: "生成左右耳信号", "zh-Hant": traditional("生成左右耳信号"), en: "left/right ear signals", ja: "左右耳信号を生成", ko: "왼쪽/오른쪽 귀 신호 생성" } },
    { title: { zh: "双耳 PCM", "zh-Hant": traditional("双耳 PCM"), en: "Binaural PCM", ja: "バイノーラル PCM", ko: "바이노럴 PCM" }, detail: { zh: "适合耳机播放", "zh-Hant": traditional("适合耳机播放"), en: "for headphone playback", ja: "ヘッドホン再生用", ko: "헤드폰 재생용" } }
  ],
  headTracking: [
    { title: { zh: "IMU 姿态", "zh-Hant": traditional("IMU 姿态"), en: "IMU pose", ja: "IMU 姿勢", ko: "IMU 자세" }, detail: { zh: "头部 yaw / pitch / roll", "zh-Hant": traditional("头部 yaw / pitch / roll"), en: "head yaw / pitch / roll", ja: "頭部 yaw / pitch / roll", ko: "머리 yaw / pitch / roll" } },
    { title: { zh: "坐标变换", "zh-Hant": traditional("坐标变换"), en: "Coordinate update", ja: "座標更新", ko: "좌표 갱신" }, detail: { zh: "世界方向 -> 耳朵方向", "zh-Hant": traditional("世界方向 -> 耳朵方向"), en: "world direction -> ear direction", ja: "世界方向 -> 耳方向", ko: "세계 방향 -> 귀 방향" } },
    { title: { zh: "重选 HRTF", "zh-Hant": traditional("重选 HRTF"), en: "HRTF update", ja: "HRTF 更新", ko: "HRTF 갱신" }, detail: { zh: "低延迟更新滤波器", "zh-Hant": traditional("低延迟更新滤波器"), en: "low-latency filter update", ja: "低遅延でフィルターを更新", ko: "낮은 지연으로 필터 갱신" } },
    { title: { zh: "外部化声像", "zh-Hant": traditional("外部化声像"), en: "Externalized image", ja: "外在化した音像", ko: "외재화된 음상" }, detail: { zh: "声源不跟头转", "zh-Hant": traditional("声源不跟头转"), en: "source does not rotate with head", ja: "音源が頭の回転に追従しない", ko: "음원이 머리 회전을 따라가지 않음" } }
  ]
};

const spatialCopy = {
  sceneTitle: { zh: "俯视图：声源与头部朝向", "zh-Hant": traditional("俯视图：声源与头部朝向"), en: "Top view: source and head direction", ja: "上面図：音源と頭の向き", ko: "평면도: 음원과 머리 방향" },
  sceneAria: { zh: "空间音频声源定位图", "zh-Hant": traditional("空间音频声源定位图"), en: "Spatial audio source localization diagram", ja: "空間音声の音源定位図", ko: "공간 오디오 음원 위치 다이어그램" },
  front: { zh: "前", "zh-Hant": traditional("前"), en: "front", ja: "前", ko: "앞" },
  rear: { zh: "后", "zh-Hant": traditional("后"), en: "rear", ja: "後ろ", ko: "뒤" },
  left: { zh: "左", "zh-Hant": traditional("左"), en: "left", ja: "左", ko: "왼쪽" },
  right: { zh: "右", "zh-Hant": traditional("右"), en: "right", ja: "右", ko: "오른쪽" },
  leftEar: { zh: "左耳", "zh-Hant": traditional("左耳"), en: "L", ja: "左耳", ko: "왼쪽 귀" },
  rightEar: { zh: "右耳", "zh-Hant": traditional("右耳"), en: "R", ja: "右耳", ko: "오른쪽 귀" },
  source: { zh: "声源", "zh-Hant": traditional("声源"), en: "source", ja: "音源", ko: "음원" },
  binauralCue: { zh: "当前双耳线索：", "zh-Hant": traditional("当前双耳线索："), en: "Current binaural cue: ", ja: "現在の両耳手がかり：", ko: "현재 양이 단서: " },
  earsAligned: { zh: "左右耳接近同时", "zh-Hant": traditional("左右耳接近同时"), en: "ears nearly aligned", ja: "左右の耳にほぼ同時に到達", ko: "양쪽 귀에 거의 동시에 도달" },
  leftFirst: { zh: "左耳先到 / 左侧更强", "zh-Hant": traditional("左耳先到 / 左侧更强"), en: "left ear first / stronger left", ja: "左耳が先に到達 / 左側が強い", ko: "왼쪽 귀가 먼저 도달 / 왼쪽이 더 강함" },
  rightFirst: { zh: "右耳先到 / 右侧更强", "zh-Hant": traditional("右耳先到 / 右侧更强"), en: "right ear first / stronger right", ja: "右耳が先に到達 / 右側が強い", ko: "오른쪽 귀가 먼저 도달 / 오른쪽이 더 강함" },
  relativeDirection: { zh: "相对耳朵方向：", "zh-Hant": traditional("相对耳朵方向："), en: "Ear-relative direction: ", ja: "耳に対する方向：", ko: "귀 기준 방향: " },
  worldSource: { zh: "世界声源角度：", "zh-Hant": traditional("世界声源角度："), en: "world source: ", ja: "世界座標の音源：", ko: "세계 음원: " },
  headYaw: { zh: "头部朝向：", "zh-Hant": traditional("头部朝向："), en: "head yaw: ", ja: "頭部 yaw：", ko: "머리 yaw: " },
  earArrival: { zh: "双耳到达与电平", "zh-Hant": traditional("双耳到达与电平"), en: "Ear arrival and level", ja: "両耳の到達とレベル", ko: "양쪽 귀 도달 및 레벨" },
  binauralTitle: { zh: "双耳线索：何时到达、有多强", "zh-Hant": traditional("双耳线索：何时到达、有多强"), en: "Binaural cues: arrival and level", ja: "両耳の手がかり：到達時刻と強さ", ko: "양이 단서: 도달 시각과 강도" },
  relativeAmplitude: { zh: "相对幅度", "zh-Hant": traditional("相对幅度"), en: "relative amplitude", ja: "相対振幅", ko: "상대 진폭" },
  timeAmplitude: { zh: "时间 0–1 ms · 相对幅度 0–1 · 到达/增益示意", "zh-Hant": traditional("时间 0–1 ms · 相对幅度 0–1 · 到达/增益示意"), en: "Time 0–1 ms · Relative amplitude 0–1 · Arrival/gain", ja: "時間 0–1 ms · 相対振幅 0–1 · 到達/ゲインの概念図", ko: "시간 0–1 ms · 상대 진폭 0–1 · 도달/게인 개념도" },
  earPlots: { zh: "双耳图说明", "zh-Hant": traditional("双耳图说明"), en: "About the ear plots", ja: "両耳グラフについて", ko: "양이 그래프 설명" },
  earPlotDescription: { zh: "横轴固定 0–1 ms，以先到耳为 0；纵轴固定相对幅度 0–1（上/中/下网格为 1/0.5/0），参照 1 m 近侧耳。竖线只表示到达与增益，不是声波或 HRIR。距离加倍，两耳幅度减半；转头改变相对方向。", "zh-Hant": traditional("横轴固定 0–1 ms，以先到耳为 0；纵轴固定相对幅度 0–1（上/中/下网格为 1/0.5/0），参照 1 m 近侧耳。竖线只表示到达与增益，不是声波或 HRIR。距离加倍，两耳幅度减半；转头改变相对方向。"), en: "X: fixed 0–1 ms from the first ear; Y: fixed relative amplitude 0–1 (top/middle/bottom grid: 1/0.5/0), referenced to the near ear at 1 m. Stems represent arrival and gain, not waveforms or HRIRs. Doubling distance halves both amplitudes; turning changes relative direction.", ja: "横軸は先に到達する耳を 0 とした固定 0–1 ms。縦軸は固定の相対振幅 0–1（上/中/下の目盛りは 1/0.5/0）で、1 m の近い耳を基準にする。縦線は到達とゲインを示すだけで、波形や HRIR ではない。距離が 2 倍になると両耳の振幅は半分になり、頭を回すと相対方向が変わる。", ko: "가로축은 먼저 도달하는 귀를 0으로 한 고정 0–1 ms. 세로축은 고정 상대 진폭 0–1(위/가운데/아래 눈금 1/0.5/0)이며 1 m에서 가까운 귀를 기준으로 함. 세로선은 도달과 게인만 나타내며 파형이나 HRIR이 아님. 거리가 2배가 되면 양쪽 귀 진폭이 절반이 되고 머리를 돌리면 상대 방향이 바뀜." },
  earTrendDescription: { zh: "这里只用方向趋势展示 ITD/ILD，不做真实双耳卷积。真实 ILD 随频率变化；前后对称方向可能产生相同线索，还需要耳廓频谱和头部运动来区分。", "zh-Hant": traditional("这里只用方向趋势展示 ITD/ILD，不做真实双耳卷积。真实 ILD 随频率变化；前后对称方向可能产生相同线索，还需要耳廓频谱和头部运动来区分。"), en: "These directional ITD/ILD trends are not real binaural convolution. Actual ILD is frequency-dependent; front/back directions can share cues and need pinna spectra and head motion to disambiguate.", ja: "ここでは ITD/ILD の方向傾向だけを示し、実際の両耳畳み込みは行わない。実際の ILD は周波数依存で、前後対称の方向は同じ手がかりを持つことがあり、耳介スペクトルや頭部運動で区別する必要がある。", ko: "여기서는 ITD/ILD의 방향 경향만 보여 주며 실제 양이 컨볼루션은 수행하지 않음. 실제 ILD는 주파수에 따라 달라지고 앞뒤 대칭 방향은 같은 단서를 만들 수 있어 귓바퀴 스펙트럼과 머리 움직임으로 구분해야 함." },
  relativeEnergy: { zh: "相对能量：直达声、反射、拖尾", "zh-Hant": traditional("相对能量：直达声、反射、拖尾"), en: "Relative energy: direct, reflections, tail", ja: "相対エネルギー：直接音、反射、尾部", ko: "상대 에너지: 직접음, 반사, 꼬리" },
  direct: { zh: "直达声", "zh-Hant": traditional("直达声"), en: "Direct", ja: "直接音", ko: "직접음" },
  earlyReflections: { zh: "早期反射", "zh-Hant": traditional("早期反射"), en: "Early reflections", ja: "初期反射", ko: "초기 반사" },
  reverbTail: { zh: "混响尾巴", "zh-Hant": traditional("混响尾巴"), en: "Reverb tail", ja: "残響尾部", ko: "잔향 꼬리" },
  roomAria: { zh: "房间反射时间响应图", "zh-Hant": traditional("房间反射时间响应图"), en: "Room reflection time response", ja: "室内反射の時間応答図", ko: "공간 반사 시간 응답 그래프" },
  timeMs: { zh: "时间 ms", "zh-Hant": traditional("时间 ms"), en: "time ms", ja: "時間 ms", ko: "시간 ms" },
  energyModel: { zh: "能量图说明（非实测）", "zh-Hant": traditional("能量图说明（非实测）"), en: "Energy model (not measured)", ja: "エネルギーモデル（実測値ではない）", ko: "에너지 모델(실측값 아님)" },
  energyDescription: { zh: "示意能量包络，不是真实房间脉冲响应。纵轴 10 log10(E/E₁ₘ)，显示下限 −60 dB，不是 dB SPL；直达声按 1/d² 衰减。反射保留比例 r = 滑块/100，三条假想反射使用 rⁿ/(d + 343Δt)²，额外延时 12/28/48 ms；尾部从额外 60 ms 开始。反射为 0 时无反射能量。上方曲线只是路径概念，不与这些延时逐条对应；未求解房间几何，不对应实测 RT60。", "zh-Hant": traditional("示意能量包络，不是真实房间脉冲响应。纵轴 10 log10(E/E₁ₘ)，显示下限 −60 dB，不是 dB SPL；直达声按 1/d² 衰减。反射保留比例 r = 滑块/100，三条假想反射使用 rⁿ/(d + 343Δt)²，额外延时 12/28/48 ms；尾部从额外 60 ms 开始。反射为 0 时无反射能量。上方曲线只是路径概念，不与这些延时逐条对应；未求解房间几何，不对应实测 RT60。"), en: "Illustrative energy envelope, not a real room impulse response. Y = 10 log10(E/E at 1 m), floored at −60 dB, not dB SPL. Direct energy follows 1/d². Retention r = slider/100; three hypothetical reflections use rⁿ/(d + 343Δt)² with excess delays of 12/28/48 ms. The tail starts 60 ms after direct arrival. Zero reflection means zero reflected energy. Curved paths above are conceptual, not matched to these delays; no room geometry or measured RT60 is claimed.", ja: "説明用のエネルギー包絡であり、実際の室内インパルス応答ではない。Y = 10 log10(E/E at 1 m)、下限は −60 dB で dB SPL ではない。直接音は 1/d² に従って減衰する。保持率 r = スライダー/100、3 本の仮想反射は余分な遅延 12/28/48 ms に対して rⁿ/(d + 343Δt)² を使う。尾部は直接音の 60 ms 後から始まる。反射 0 では反射エネルギーはない。上の曲線は概念的な経路で、これらの遅延とは 1 対 1 に対応せず、部屋の幾何や実測 RT60 を解いていない。", ko: "설명용 에너지 엔벨로프이며 실제 공간 임펄스 응답이 아님. Y = 10 log10(E/E at 1 m), 하한은 −60 dB이고 dB SPL이 아님. 직접음은 1/d²에 따라 감쇠함. 유지율 r = 슬라이더/100이며 세 가상 반사는 추가 지연 12/28/48 ms에 대해 rⁿ/(d + 343Δt)²를 사용함. 꼬리는 직접음 도달 60 ms 후 시작함. 반사 0이면 반사 에너지가 없음. 위 곡선은 개념적 경로이며 이 지연과 일대일로 대응하지 않고 공간 기하나 실측 RT60을 계산하지 않음." },
  pipeline: { zh: "空间音频渲染流程", "zh-Hant": traditional("空间音频渲染流程"), en: "Spatial audio rendering pipeline", ja: "空間音声レンダリングフロー", ko: "공간 오디오 렌더링 흐름" },
  backKnowledge: { zh: "返回知识库", "zh-Hant": traditional("返回知识库"), en: "Back to knowledge base", ja: "ナレッジベースに戻る", ko: "지식 베이스로 돌아가기" },
  backDetails: { zh: "返回详细内容", "zh-Hant": traditional("返回详细内容"), en: "Back to detailed content", ja: "詳細コンテンツに戻る", ko: "상세 내용으로 돌아가기" },
  traditionalLab: { zh: "传统 DSP 实验", "zh-Hant": traditional("传统 DSP 实验"), en: "Traditional DSP lab", ja: "従来型 DSP 実験", ko: "전통 DSP 실험" },
  labTitle: { zh: "空间音频实验室", "zh-Hant": traditional("空间音频实验室"), en: "Spatial Audio Lab", ja: "空間音声ラボ", ko: "공간 오디오 실험실" },
  intro: { zh: "用一个俯视声源图理解 ITD、ILD、HRTF、双耳渲染、对象音频和头部追踪如何共同形成空间感。", "zh-Hant": traditional("用一个俯视声源图理解 ITD、ILD、HRTF、双耳渲染、对象音频和头部追踪如何共同形成空间感。"), en: "Use a top-down source diagram to understand how ITD, ILD, HRTF, binaural rendering, object audio, and head tracking create spatial perception.", ja: "上面から見た音源図で、ITD、ILD、HRTF、バイノーラルレンダリング、オブジェクト音声、ヘッドトラッキングが空間知覚をどう作るかを理解する。", ko: "평면 음원 다이어그램을 사용해 ITD, ILD, HRTF, 바이노럴 렌더링, 오브젝트 오디오 및 헤드 트래킹이 공간감을 어떻게 만드는지 이해함." },
  workbench: { zh: "空间音频实验台", "zh-Hant": traditional("空间音频实验台"), en: "Spatial audio workbench", ja: "空間音声ワークベンチ", ko: "공간 오디오 워크벤치" },
  modes: { zh: "空间音频模式", "zh-Hant": traditional("空间音频模式"), en: "Spatial audio modes", ja: "空間音声モード", ko: "공간 오디오 모드" },
  sourceAngle: { zh: "声源角度", "zh-Hant": traditional("声源角度"), en: "Source angle", ja: "音源角度", ko: "음원 각도" },
  distance: { zh: "距离", "zh-Hant": traditional("距离"), en: "Distance", ja: "距離", ko: "거리" },
  reflections: { zh: "房间反射", "zh-Hant": traditional("房间反射"), en: "Room reflections", ja: "室内反射", ko: "공간 반사" },
  headDirection: { zh: "头部朝向", "zh-Hant": traditional("头部朝向"), en: "Head yaw", ja: "頭部 yaw", ko: "머리 yaw" },
  relativeAngle: { zh: "相对角度：", "zh-Hant": traditional("相对角度："), en: "Relative angle: ", ja: "相対角度：", ko: "상대 각도: " },
  itd: { zh: "ITD：", "zh-Hant": traditional("ITD："), en: "ITD: ", ja: "ITD：", ko: "ITD: " },
  ildAbout: { zh: "ILD：约 ", "zh-Hant": traditional("ILD：约 "), en: "ILD: about ", ja: "ILD：約 ", ko: "ILD: 약 " },
  distanceLoss: { zh: "距离衰减：", "zh-Hant": traditional("距离衰减："), en: "Distance loss: ", ja: "距離減衰：", ko: "거리 감쇠: " },
  modelLimits: { zh: "模型边界", "zh-Hant": traditional("模型边界"), en: "Model limits", ja: "モデルの範囲", ko: "모델 한계" },
  modelBoundary: { zh: "ITD/ILD 是方向趋势模型，不是个人 HRTF：实际值还随频率、头型和距离变化。HRTF 需测量或选取数据库，延迟取决于渲染实现，不能由角度和反射强度直接推算。俯视图位置非等比例，曲线仅表示反射路径概念。", "zh-Hant": traditional("ITD/ILD 是方向趋势模型，不是个人 HRTF：实际值还随频率、头型和距离变化。HRTF 需测量或选取数据库，延迟取决于渲染实现，不能由角度和反射强度直接推算。俯视图位置非等比例，曲线仅表示反射路径概念。"), en: "ITD/ILD are directional trend models, not personal HRTFs; actual cues depend on frequency, head geometry, and distance. HRTFs require measurements or a database; latency depends on the renderer, not just angle and reflection strength. The top view is not to scale; curves are conceptual reflection paths.", ja: "ITD/ILD は方向の傾向モデルで、個人の HRTF ではない。実際の手がかりは周波数、頭部形状、距離にも依存する。HRTF には測定またはデータベースが必要で、遅延は角度や反射強度だけでなくレンダラーの実装で決まる。上面図は縮尺どおりではなく、曲線は反射経路の概念を示す。", ko: "ITD/ILD는 방향 경향 모델이며 개인별 HRTF가 아님. 실제 단서는 주파수, 머리 형상 및 거리에도 좌우됨. HRTF는 측정이나 데이터베이스가 필요하고 지연은 각도와 반사 강도만이 아니라 렌더러 구현에 따라 결정됨. 평면도는 실제 비율이 아니며 곡선은 반사 경로 개념임." },
  principles: { zh: "原理与渲染流程", "zh-Hant": traditional("原理与渲染流程"), en: "Principles and rendering flow", ja: "原理とレンダリングフロー", ko: "원리 및 렌더링 흐름" }
} satisfies Record<string, Localized>;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function normalizeAngle(angle: number) {
  const normalized = ((((angle + 180) % 360) + 360) % 360) - 180;

  return normalized === -180 ? 180 : normalized;
}

function polarPoint(cx: number, cy: number, radius: number, angleDegrees: number) {
  const radians = (angleDegrees * Math.PI) / 180;

  return {
    x: cx + Math.sin(radians) * radius,
    y: cy - Math.cos(radians) * radius
  };
}

function rotateOffset(cx: number, cy: number, offsetX: number, offsetY: number, angleDegrees: number) {
  const radians = (angleDegrees * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);

  return {
    x: cx + offsetX * cos - offsetY * sin,
    y: cy + offsetX * sin + offsetY * cos
  };
}

function formatSignedDegrees(value: number) {
  return `${value > 0 ? "+" : ""}${Math.round(value)}°`;
}

function formatSignedDb(value: number) {
  const rounded = Math.round(value * 10) / 10;

  return `${rounded > 0 ? "+" : ""}${rounded.toFixed(1)} dB`;
}

const reflectionPaths = [
  { controlA: { x: 92, y: 86 }, controlB: { x: 98, y: 414 }, earOffset: -34, threshold: 0.08 },
  { controlA: { x: 632, y: 88 }, controlB: { x: 636, y: 412 }, earOffset: 34, threshold: 0.08 },
  { controlA: { x: 205, y: 54 }, controlB: { x: 506, y: 74 }, earOffset: -12, threshold: 0.32 },
  { controlA: { x: 514, y: 456 }, controlB: { x: 214, y: 432 }, earOffset: 12, threshold: 0.52 },
  { controlA: { x: 72, y: 250 }, controlB: { x: 214, y: 92 }, earOffset: -46, threshold: 0.72 },
  { controlA: { x: 648, y: 250 }, controlB: { x: 506, y: 408 }, earOffset: 46, threshold: 0.72 }
];

function SpatialScene({
  distance,
  headYaw,
  language,
  mode,
  reflection,
  sourceAngle
}: {
  distance: number;
  headYaw: number;
  language: Language;
  mode: SpatialMode;
  reflection: number;
  sourceAngle: number;
}) {
  const center = { x: 360, y: 250 };
  const sourceRadius = 90 + distance * 8;
  const source = polarPoint(center.x, center.y, sourceRadius, sourceAngle);
  const headForward = polarPoint(center.x, center.y, 88, headYaw);
  const relativeAngle = normalizeAngle(sourceAngle - headYaw);
  const leftEar = rotateOffset(center.x, center.y, -52, 0, headYaw);
  const rightEar = rotateOffset(center.x, center.y, 52, 0, headYaw);
  const lateral = Math.sin((relativeAngle * Math.PI) / 180);
  const leadingEarPoint = Math.abs(lateral) < 0.08 ? center : lateral < 0 ? leftEar : rightEar;
  const laggingEarPoint = Math.abs(lateral) < 0.08 ? center : lateral < 0 ? rightEar : leftEar;
  const reflectionAmount = reflection / 100;
  const showHeadTracking = mode === "headTracking";
  const cueSummary = {
    zh: `当前双耳线索：${Math.abs(lateral) < 0.08 ? "左右耳接近同时" : lateral < 0 ? "左耳先到 / 左侧更强" : "右耳先到 / 右侧更强"}`, "zh-Hant": traditional(`当前双耳线索：${Math.abs(lateral) < 0.08 ? "左右耳接近同时" : lateral < 0 ? "左耳先到 / 左侧更强" : "右耳先到 / 右侧更强"}`),
    en: `Current binaural cue: ${Math.abs(lateral) < 0.08 ? "ears nearly aligned" : lateral < 0 ? "left ear first / stronger left" : "right ear first / stronger right"}`,
    ja: `現在の両耳手がかり：${Math.abs(lateral) < 0.08 ? "左右の耳にほぼ同時に到達" : lateral < 0 ? "左耳が先に到達 / 左側が強い" : "右耳が先に到達 / 右側が強い"}`,
    ko: `현재 양이 단서: ${Math.abs(lateral) < 0.08 ? "양쪽 귀에 거의 동시에 도달" : lateral < 0 ? "왼쪽 귀가 먼저 도달 / 왼쪽이 더 강함" : "오른쪽 귀가 먼저 도달 / 오른쪽이 더 강함"}`
  }[language];
  const directionSummary = {
    zh: `相对耳朵方向：${formatSignedDegrees(relativeAngle)}；世界声源角度：${formatSignedDegrees(sourceAngle)}；头部朝向：${formatSignedDegrees(headYaw)}`, "zh-Hant": traditional(`相对耳朵方向：${formatSignedDegrees(relativeAngle)}；世界声源角度：${formatSignedDegrees(sourceAngle)}；头部朝向：${formatSignedDegrees(headYaw)}`),
    en: `Ear-relative direction: ${formatSignedDegrees(relativeAngle)}; world source: ${formatSignedDegrees(sourceAngle)}; head yaw: ${formatSignedDegrees(headYaw)}`,
    ja: `耳に対する方向：${formatSignedDegrees(relativeAngle)}。世界座標の音源：${formatSignedDegrees(sourceAngle)}。頭部 yaw：${formatSignedDegrees(headYaw)}`,
    ko: `귀 기준 방향: ${formatSignedDegrees(relativeAngle)}; 세계 음원: ${formatSignedDegrees(sourceAngle)}; 머리 yaw: ${formatSignedDegrees(headYaw)}`
  }[language];

  return (
    <figure className="spatial-response-figure">
    <h2 className="spatial-plot-heading">{spatialCopy.sceneTitle[language]}</h2>
    <svg
      aria-label={spatialCopy.sceneAria[language]}
      className="spatial-audio-scene"
      role="img"
      viewBox="0 0 720 500"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <marker id="spatialArrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
          <path d="M0 0 8 4 0 8Z" fill="#dcece8" />
        </marker>
      </defs>
      <rect className="lab-diagram-bg" height="500" rx="16" width="720" />
      <circle className="spatial-room-ring" cx={center.x} cy={center.y} r="190" />
      <circle className="spatial-room-ring faint" cx={center.x} cy={center.y} r="118" />
      <line className="spatial-axis" x1={center.x} x2={center.x} y1="72" y2="432" />
      <line className="spatial-axis" x1="180" x2="540" y1={center.y} y2={center.y} />
      <text className="spatial-axis-label" x="348" y="86">{spatialCopy.front[language]}</text>
      <text className="spatial-axis-label" x="344" y="438">{spatialCopy.rear[language]}</text>
      <text className="spatial-axis-label" x="186" y="242">{spatialCopy.left[language]}</text>
      <text className="spatial-axis-label" x="508" y="242">{spatialCopy.right[language]}</text>

      {mode === "cues" && reflectionPaths.map((path, index) => {
        const pathStrength = clamp((reflectionAmount - path.threshold) / 0.28, 0, 1);

        if (pathStrength <= 0) {
          return null;
        }

        return (
          <path
            className={index < 2 ? "spatial-reflection-path early" : "spatial-reflection-path late"}
            d={`M ${source.x.toFixed(1)} ${source.y.toFixed(1)} C ${path.controlA.x} ${path.controlA.y} ${path.controlB.x} ${path.controlB.y} ${(path.earOffset < 0 ? leftEar.x : rightEar.x).toFixed(1)} ${(path.earOffset < 0 ? leftEar.y : rightEar.y).toFixed(1)}`}
            key={`${path.controlA.x}-${path.controlB.y}`}
            opacity={0.12 + pathStrength * 0.55}
          />
        );
      })}
      <line
        className="spatial-direct-path"
        x1={source.x}
        x2={leadingEarPoint.x}
        y1={source.y}
        y2={leadingEarPoint.y}
      />
      {Math.abs(lateral) >= 0.08 ? (
        <line
          className="spatial-secondary-ear-path"
          x1={source.x}
          x2={laggingEarPoint.x}
          y1={source.y}
          y2={laggingEarPoint.y}
        />
      ) : null}
      <line
        className="spatial-head-forward"
        markerEnd="url(#spatialArrow)"
        x1={center.x}
        x2={headForward.x}
        y1={center.y}
        y2={headForward.y}
      />
      {showHeadTracking ? (
        <path
          className="spatial-world-lock"
          d={`M ${source.x.toFixed(1)} ${source.y.toFixed(1)} C ${source.x + 42} ${source.y - 36} ${center.x + 126} ${center.y - 110} ${headForward.x} ${headForward.y}`}
        />
      ) : null}

      <g className="spatial-head" transform={`rotate(${headYaw} ${center.x} ${center.y})`}>
        <ellipse cx={center.x} cy={center.y} rx="44" ry="58" />
        <circle className="spatial-ear left" cx={center.x - 52} cy={center.y} r="10" />
        <circle className="spatial-ear right" cx={center.x + 52} cy={center.y} r="10" />
        <text className="spatial-ear-label" x={center.x - 72} y={center.y + 28}>{spatialCopy.leftEar[language]}</text>
        <text className="spatial-ear-label" x={center.x + 58} y={center.y + 28}>{spatialCopy.rightEar[language]}</text>
      </g>

      <g className="spatial-source">
        <circle cx={source.x} cy={source.y} r="14" />
        <text x={source.x + 20} y={source.y + 5}>{spatialCopy.source[language]}</text>
      </g>
    </svg>
      <figcaption className="spatial-scene-caption">
        <p>
          {cueSummary}
        </p>
        <p>
          {directionSummary}
        </p>
      </figcaption>
    </figure>
  );
}

function BinauralCues({ language, relativeAngle, itdMs, ildDb, distance }: {
  language: Language; relativeAngle: number; itdMs: number; ildDb: number; distance: number;
}) {
  const rightFirst = Math.sin(relativeAngle * Math.PI / 180) > 0;
  return <section className="spatial-ear-response" aria-label={spatialCopy.earArrival[language]}>
    <h2 className="spatial-plot-heading">{spatialCopy.binauralTitle[language]}</h2>
    {["L", "R"].map(ear => {
      const far = ear === "L" ? rightFirst : !rightFirst;
      const delay = far ? itdMs : 0;
      const gain = 10 ** (-(far ? ildDb : 0) / 20) / distance;
      const x = 36 + delay * 344;
      const earName = {
        zh: ear === "L" ? "左耳" : "右耳", "zh-Hant": traditional(ear === "L" ? "左耳" : "右耳"),
        en: ear,
        ja: ear === "L" ? "左耳" : "右耳",
        ko: ear === "L" ? "왼쪽 귀" : "오른쪽 귀"
      }[language];
      const earDescription = {
        zh: `${earName} · ${delay.toFixed(2)} ms · ${gain.toFixed(3)} ${spatialCopy.relativeAmplitude.zh}`, "zh-Hant": traditional(`${earName} · ${delay.toFixed(2)} ms · ${gain.toFixed(3)} ${spatialCopy.relativeAmplitude.zh}`),
        en: `${earName} · ${delay.toFixed(2)} ms · ${gain.toFixed(3)} ${spatialCopy.relativeAmplitude.en}`,
        ja: `${earName} · ${delay.toFixed(2)} ms · ${gain.toFixed(3)} ${spatialCopy.relativeAmplitude.ja}`,
        ko: `${earName} · ${delay.toFixed(2)} ms · ${gain.toFixed(3)} ${spatialCopy.relativeAmplitude.ko}`
      }[language];
      const earAria = {
        zh: `${earName}到达示意`, "zh-Hant": traditional(`${earName}到达示意`),
        en: `${ear} arrival diagram`,
        ja: `${earName}の到達図`,
        ko: `${earName} 도달 다이어그램`
      }[language];
      return <div key={ear}>
        <p>{earDescription}</p>
        <svg role="img" aria-label={earAria} viewBox="0 0 400 120">
          {[10, 50, 90].map((y, index) => <g key={y}>
            <line x1="36" x2="380" y1={y} y2={y} stroke="#536c64" />
            <text x="30" y={y + 4} textAnchor="end" className="spatial-cue-tick">{1 - index * 0.5}</text>
          </g>)}
          {[0, 0.5, 1].map(t => <text key={t} x={36 + t * 344} y="112" textAnchor="middle" className="spatial-cue-tick">{t}</text>)}
          <path data-testid={`spatial-ear-${ear}`} data-delay={delay} data-gain={gain} d={`M ${x} 90 V ${90 - gain * 80}`} stroke={ear === "L" ? "#7ee7d8" : "#f1bb72"} strokeWidth="3" />
        </svg>
      </div>;
    })}
    <p>{spatialCopy.timeAmplitude[language]}</p>
    <details className="spatial-explanation"><summary>{spatialCopy.earPlots[language]}</summary>
    <p>{spatialCopy.earPlotDescription[language]}</p>
    <p>{spatialCopy.earTrendDescription[language]}</p>
    </details>
  </section>;
}

function RoomReflectionResponse({
  distance,
  language,
  reflection
}: {
  distance: number;
  language: Language;
  reflection: number;
}) {
  const reflectionAmount = reflection / 100;
  const arrivalMs = distance / 343 * 1000;
  const directX = 54 + arrivalMs / 160 * 612;
  const energyHeight = (energy: number) => Math.max(0, 60 + 10 * Math.log10(Math.max(1e-12, energy))) * 2;
  const directEnergy = 1 / (distance * distance);
  const directHeight = energyHeight(directEnergy);
  const directPeak = 214 - directHeight;
  // Fixed excess path lengths are a teaching model, not a solved room geometry.
  const earlyPeaks = [12, 28, 48].map((delay, index) => ({
    x: directX + delay / 160 * 612,
    height: energyHeight(reflectionAmount ** (index + 1) / (distance + delay * 343 / 1000) ** 2)
  }));
  const tailStart = directX + 60 / 160 * 612;
  const tailLength = 60 / 160 * 612;
  const tailHeight = reflectionAmount ** 3 / (distance + 0.060 * 343) ** 2;
  const tailEnvelope = (ratio: number) => tailHeight * Math.exp(-ratio * 60 / (5 + reflectionAmount * 15));
  const tailPath = Array.from({ length: 61 }, (_, i) => `${i ? "L" : "M"} ${(tailStart + i / 60 * tailLength).toFixed(1)} ${(214 - energyHeight(tailEnvelope(i / 60))).toFixed(1)}`).join(" ");
  const tailFillPath = `${tailPath} L ${(tailStart + tailLength).toFixed(1)} 214 L ${tailStart.toFixed(1)} 214 Z`;
  const tailTexture = Array.from({ length: 18 }, (_, index) => {
    const ratio = index / 17;
    const x = tailStart + ratio * tailLength;
    const height = energyHeight(tailEnvelope(ratio) * (0.28 + ((index * 7) % 5) * 0.08));

    return { height, x };
  });

  return (
    <figure className="spatial-response-figure">
    <h2 className="spatial-plot-heading">{spatialCopy.relativeEnergy[language]}</h2>
    <div className="spatial-response-legend"><span>{spatialCopy.direct[language]}</span><span>{spatialCopy.earlyReflections[language]}</span><span>{spatialCopy.reverbTail[language]}</span></div>
    <svg
      aria-label={spatialCopy.roomAria[language]}
      className="spatial-reflection-response"
      role="img"
      viewBox="0 0 720 280"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect className="lab-diagram-bg" height="280" rx="16" width="720" />
      <line className="spatial-response-axis" x1="54" x2="666" y1="214" y2="214" />
      <line className="spatial-response-axis" x1="54" x2="54" y1="62" y2="214" />
      <text className="spatial-axis-label" x="360" y="272" textAnchor="middle">{spatialCopy.timeMs[language]}</text>
      <text className="spatial-axis-label" x="28" y="72">dB</text>
      {[0, -20, -40, -60].map(db => <g key={db}><line x1="54" x2="666" y1={214 - (db + 60) * 2} y2={214 - (db + 60) * 2} stroke="#536c64" opacity="0.4" /><text x="44" y={218 - (db + 60) * 2} textAnchor="end" className="spatial-axis-label">{db}</text></g>)}
      {[0, 40, 80, 120, 160].map(ms => <text className="spatial-axis-label" key={ms} x={54 + ms / 160 * 612} y="233" textAnchor="middle">{ms}</text>)}
      <path className="spatial-reverb-tail-fill" d={tailFillPath} opacity={0.1 + reflectionAmount * 0.28} />
      <path className="spatial-reverb-tail-line" d={tailPath} opacity={0.35 + reflectionAmount * 0.52} />
      {tailTexture.map((item) => (
        <line
          className="spatial-tail-texture"
          key={item.x.toFixed(1)}
          opacity={0.12 + reflectionAmount * 0.36}
          x1={item.x}
          x2={item.x}
          y1={214}
          y2={214 - item.height}
        />
      ))}
      <path className="spatial-direct-impulse" data-energy={directEnergy} d={`M ${(directX - 3).toFixed(1)} 214 L ${directX.toFixed(1)} ${directPeak.toFixed(1)} L ${(directX + 3).toFixed(1)} 214`} />
      {earlyPeaks.map((peak) => (
        <g key={peak.x}>
          <path
            className="spatial-early-impulse"
            d={`M ${(peak.x - 2.6).toFixed(1)} 214 L ${peak.x.toFixed(1)} ${(214 - peak.height).toFixed(1)} L ${(peak.x + 2.6).toFixed(1)} 214`}
            opacity={0.22 + reflectionAmount * 0.68}
          />
        </g>
      ))}
    </svg>
    <figcaption><details className="spatial-explanation"><summary>{spatialCopy.energyModel[language]}</summary><p className="traditional-model-note">{spatialCopy.energyDescription[language]}</p></details></figcaption>
    </figure>
  );
}

function BinauralFlow({ language, angle, distance }: { language: Language; angle: number; distance: number }) {
  return <section className="spatial-mode-diagram" data-testid="spatial-binaural-flow">
    <h2 className="spatial-plot-heading">{text(language, "同一声源，两个耳朵的滤波器", "One source, two ear filters", "1 つの音源、左右の耳のフィルター", "하나의 음원, 양쪽 귀 필터")}</h2>
    <div className="spatial-flow-node"><strong>PCM · x[n]</strong><span>{text(language, "单个干声输入", "One dry source", "単一のドライ音源", "단일 드라이 음원")}</span></div>
    <div className="spatial-flow-junction"><ArrowDown aria-hidden="true" /><span>{text(language, "按相对方位选取左右 HRIR", "Select both HRIRs by relative direction", "相対方向から左右 HRIR を選択", "상대 방향에 따라 양쪽 HRIR 선택")} · {formatSignedDegrees(angle)}</span></div>
    <div className="spatial-flow-pair spatial-filter-pair">
      {(["L", "R"] as const).map(ear => <div className="spatial-filter-branch" key={ear}>
        <div className="spatial-flow-node"><strong>HRIR · h{ear}[k]</strong><span>{spatialCopy[ear === "L" ? "leftEar" : "rightEar"][language]}</span></div>
        <ArrowDown aria-hidden="true" />
        <code>y{ear}[n] = g · Σ x[n−k] h{ear}[k]</code>
        <ArrowDown aria-hidden="true" />
        <div className="spatial-flow-node"><Headphones size={20} aria-hidden="true" /><strong>PCM · y{ear}[n]</strong></div>
      </div>)}
    </div>
    <p>g = 1 / d = {(1 / distance).toFixed(3)} · d = {distance.toFixed(1)} m</p>
    <p className="spatial-mode-note">{text(language, "结构示意：HRIR 是滤波器系数；Σ 表示对 k 求和。本页未载入实测 HRIR、未执行卷积。g 仅演示以 1 m 为参考的自由场幅度衰减，不含房间反射。", "Structure only: HRIR contains filter coefficients; Σ sums over k. No measured HRIR or convolution runs here. g illustrates free-field amplitude loss referenced to 1 m, without room reflections.", "構造図：HRIR はフィルター係数、Σ は k に関する和。実測 HRIR の読込や畳み込み演算は行わない。g は 1 m 基準の自由音場の振幅減衰で、室内反射を含まない。", "구조 설명: HRIR은 필터 계수이며 Σ는 k에 대한 합. 실측 HRIR을 불러오거나 컨볼루션을 실행하지 않음. g는 1 m 기준 자유음장 진폭 감쇠이며 공간 반사는 포함하지 않음.")}</p>
  </section>;
}

function ObjectMapping({ language, angle, distance }: { language: Language; angle: number; distance: number }) {
  const [output, setOutput] = useState<"headphones" | "speakers">("speakers");
  const title = text(language, "内容与播放布局分开", "Content is separate from playback layout", "コンテンツと再生配置を分離", "콘텐츠와 재생 배치 분리");
  const headphoneLabel = text(language, "耳机", "Headphones", "ヘッドホン", "헤드폰");
  const speakerLabel = text(language, "5.1 扬声器", "5.1 speakers", "5.1 スピーカー", "5.1 스피커");
  return <section className="spatial-mode-diagram spatial-object-mapping" data-testid="spatial-object-mapping">
    <h2 className="spatial-plot-heading">{title}</h2>
    <div className="spatial-flow-pair">
      <div className="spatial-flow-node"><strong>{text(language, "音频对象", "Audio object", "音声オブジェクト", "오디오 객체")}</strong><span>PCM + {formatSignedDegrees(angle)} · {distance.toFixed(1)} m</span><small>{text(language, "声音 + 位置元数据", "Sound + position metadata", "音 + 位置メタデータ", "소리 + 위치 메타데이터")}</small></div>
      <div className="spatial-flow-node"><strong>{text(language, "声道床（可选）", "Channel bed (optional)", "チャンネルベッド（任意）", "채널 베드(선택)")}</strong><span>L · R · C · LFE · Ls · Rs</span><small>{text(language, "各声道已有约定位置", "Each channel has an assigned position", "各チャンネルに所定の位置", "각 채널에 지정된 위치")}</small></div>
    </div>
    <div className="spatial-flow-junction"><ArrowDown aria-hidden="true" /><span>{text(language, "并列输入，不是先声道床再变成对象", "Parallel inputs, not bed converted to objects", "並列入力。ベッドをオブジェクトへ変換する順序ではない", "병렬 입력이며 베드를 객체로 변환하는 순서가 아님")}</span></div>
    <div className="spatial-flow-node"><strong>{text(language, "渲染器：内容 + 目标布局", "Renderer: content + target layout", "レンダラー：コンテンツ + 出力配置", "렌더러: 콘텐츠 + 출력 배치")}</strong></div>
    <div className="spatial-flow-junction"><ArrowDown aria-hidden="true" /></div>
    <div className="waveform-tabs" role="group" aria-label={text(language, "播放设备", "Playback device", "再生デバイス", "재생 장치")}>
      <button type="button" aria-pressed={output === "headphones"} className={output === "headphones" ? "active" : ""} onClick={() => setOutput("headphones")}><Headphones size={18} aria-hidden="true" />{headphoneLabel}</button>
      <button type="button" aria-pressed={output === "speakers"} className={output === "speakers" ? "active" : ""} onClick={() => setOutput("speakers")}><Speaker size={18} aria-hidden="true" />{speakerLabel}</button>
    </div>
    <div className="spatial-output-channels" data-testid="spatial-output-channels">
      {(output === "headphones" ? ["L", "R"] : ["L", "R", "C", "LFE", "Ls", "Rs"]).map(channel => <span key={channel}>{output === "headphones" ? <Headphones size={20} aria-hidden="true" /> : <Speaker size={20} aria-hidden="true" />}<strong>{channel}</strong></span>)}
    </div>
    <p>{output === "headphones"
      ? text(language, "输出：经过双耳渲染的两路 PCM，不是直接复制到左右耳。", "Output: two binaurally rendered PCM channels, not copies to both ears.", "出力：両耳レンダリング済み PCM 2 チャンネル。左右への単純コピーではない。", "출력: 양이 렌더링된 PCM 2채널이며 양쪽 귀에 단순 복사하지 않음.")
      : text(language, "输出：按扬声器布局分配的 PCM。LFE 是独立低频效果声道，不是第六个全频方位；此处不模拟声像增益或低音管理。", "Output: PCM mapped to the speaker layout. LFE is a low-frequency effects channel, not a sixth full-range direction. Panning gains and bass management are not simulated.", "出力：スピーカー配置へ割り当てた PCM。LFE は低域効果チャンネルで、6 番目の全帯域方向ではない。パンのゲインや低音管理は模擬しない。", "출력: 스피커 배치에 매핑된 PCM. LFE는 저주파 효과 채널이며 여섯 번째 전대역 방향이 아님. 패닝 게인과 저음 관리는 시뮬레이션하지 않음.")}</p>
  </section>;
}

function HeadCoordinates({ language, sourceAngle, headYaw }: { language: Language; sourceAngle: number; headYaw: number }) {
  const relative = normalizeAngle(sourceAngle - headYaw);
  return <section className="spatial-mode-diagram" data-testid="spatial-head-coordinates">
    <h2 className="spatial-plot-heading">{text(language, "声源不动，耳朵的坐标在转", "Fixed source, rotating ear coordinates", "音源は固定、耳の座標が回転", "고정 음원, 회전하는 귀 좌표")}</h2>
    <div className="spatial-flow-pair">
      {[sourceAngle, relative].map((angle, index) => {
        const point = polarPoint(100, 100, 64, angle);
        const label = index === 0 ? text(language, "世界坐标", "World frame", "世界座標", "세계 좌표") : text(language, "头部坐标", "Head frame", "頭部座標", "머리 좌표");
        return <figure key={index} className="spatial-coordinate-dial">
          <figcaption>{label} · {formatSignedDegrees(angle)}</figcaption>
          <svg viewBox="0 0 200 200" role="img" aria-label={label}>
            <circle cx="100" cy="100" r="64" fill="none" stroke="#536c64" />
            <path d="M100 24V176 M24 100H176" stroke="#536c64" />
            <text x="100" y="18" textAnchor="middle" className="spatial-cue-tick">0°</text>
            <line x1="100" y1="100" x2={point.x} y2={point.y} stroke="#f1bb72" strokeWidth="3" />
            <circle data-testid={index === 0 ? "spatial-world-source" : "spatial-head-source"} cx={point.x} cy={point.y} r="7" fill="#f1bb72" />
          </svg>
        </figure>;
      })}
    </div>
    <div className="spatial-flow-node"><strong>θ = wrap({formatSignedDegrees(sourceAngle)} − ({formatSignedDegrees(headYaw)})) = {formatSignedDegrees(relative)}</strong><span>{text(language, "世界声源角度 − 头部朝向 → 相对方位", "World source angle − head yaw → relative direction", "世界音源角度 − 頭部角度 → 相対方向", "세계 음원 각도 − 머리 방향 → 상대 방향")}</span></div>
    <div className="spatial-flow-junction"><ArrowDown aria-hidden="true" /></div>
    <div className="spatial-flow-node"><strong>{text(language, "更新左右 HRIR → 更新双耳 PCM", "Update both HRIRs → update binaural PCM", "左右 HRIR 更新 → 両耳 PCM 更新", "양쪽 HRIR 갱신 → 양이 PCM 갱신")}</strong></div>
    <p>{text(language, "仅演示水平转头的坐标变换；wrap 将角度归入 (−180°, 180°]。没有模拟 IMU 误差、渲染延迟或真实 HRIR。", "Horizontal coordinate transform only; wrap maps angles to (−180°, 180°]. IMU errors, rendering latency and real HRIRs are not simulated.", "水平回転の座標変換のみ。wrap は角度を (−180°, 180°] に正規化する。IMU 誤差、遅延、実際の HRIR は模擬しない。", "수평 회전 좌표 변환만 표시. wrap은 각도를 (−180°, 180°]로 정규화함. IMU 오류, 렌더링 지연, 실제 HRIR은 시뮬레이션하지 않음.")}</p>
  </section>;
}

function SpatialPipeline({ language, mode }: { language: Language; mode: Exclude<SpatialMode, "object"> }) {
  const steps = pipelineSteps[mode];

  return (
    <ol className="spatial-pipeline" aria-label={spatialCopy.pipeline[language]}>
      {steps.map((step, index) => (
        <li key={step.title.en}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <strong>{step.title[language]}</strong>
          <p>{step.detail[language]}</p>
        </li>
      ))}
    </ol>
  );
}

export function SpatialAudioLab({ language, onBack, onBackToDetails }: SpatialAudioLabProps) {
  const [mode, setMode] = useState<SpatialMode>("cues");
  const [sourceAngle, setSourceAngle] = useState(-35);
  const [distance, setDistance] = useState(3);
  const [reflection, setReflection] = useState(42);
  const [headYaw, setHeadYaw] = useState(0);

  const metrics = useMemo(() => {
    const relativeAngle = normalizeAngle(sourceAngle - headYaw);
    const radians = (relativeAngle * Math.PI) / 180;
    const lateral = Math.sin(radians);
    const itdMs = Math.abs(lateral) * 0.63;
    const ildDb = Math.abs(lateral) * 9.5;
    const distanceGain = -20 * Math.log10(distance);
    const leadingEar =
      Math.abs(lateral) < 0.08
        ? { zh: "双耳近似同时", "zh-Hant": traditional("双耳近似同时"), en: "ears nearly aligned", ja: "左右の耳にほぼ同時", ko: "양쪽 귀에 거의 동시에" }
        : lateral < 0
          ? { zh: "左耳先到", "zh-Hant": traditional("左耳先到"), en: "left ear first", ja: "左耳が先", ko: "왼쪽 귀가 먼저" }
          : { zh: "右耳先到", "zh-Hant": traditional("右耳先到"), en: "right ear first", ja: "右耳が先", ko: "오른쪽 귀가 먼저" };

    return { distanceGain, ildDb, itdMs, leadingEar, relativeAngle };
  }, [distance, headYaw, sourceAngle]);
  const sourceAngleLabel = {
    zh: `声源角度：${formatSignedDegrees(sourceAngle)}`, "zh-Hant": traditional(`声源角度：${formatSignedDegrees(sourceAngle)}`),
    en: `Source angle: ${formatSignedDegrees(sourceAngle)}`,
    ja: `音源角度：${formatSignedDegrees(sourceAngle)}`,
    ko: `음원 각도: ${formatSignedDegrees(sourceAngle)}`
  }[language];
  const distanceLabel = {
    zh: `距离：${distance.toFixed(1)} m`, "zh-Hant": traditional(`距离：${distance.toFixed(1)} m`),
    en: `Distance: ${distance.toFixed(1)} m`,
    ja: `距離：${distance.toFixed(1)} m`,
    ko: `거리: ${distance.toFixed(1)} m`
  }[language];
  const reflectionLabel = {
    zh: `房间反射：${reflection}%`, "zh-Hant": traditional(`房间反射：${reflection}%`),
    en: `Room reflections: ${reflection}%`,
    ja: `室内反射：${reflection}%`,
    ko: `공간 반사: ${reflection}%`
  }[language];
  const headDirectionLabel = {
    zh: `头部朝向：${formatSignedDegrees(headYaw)}`, "zh-Hant": traditional(`头部朝向：${formatSignedDegrees(headYaw)}`),
    en: `Head yaw: ${formatSignedDegrees(headYaw)}`,
    ja: `頭部 yaw：${formatSignedDegrees(headYaw)}`,
    ko: `머리 yaw: ${formatSignedDegrees(headYaw)}`
  }[language];
  const relativeAngleLabel = `${spatialCopy.relativeAngle[language]}${formatSignedDegrees(metrics.relativeAngle)}`;
  const itdLabel = {
    zh: `ITD：${metrics.itdMs.toFixed(2)} ms，${metrics.leadingEar.zh}`, "zh-Hant": traditional(`ITD：${metrics.itdMs.toFixed(2)} ms，${metrics.leadingEar.zh}`),
    en: `ITD: ${metrics.itdMs.toFixed(2)} ms, ${metrics.leadingEar.en}`,
    ja: `ITD：${metrics.itdMs.toFixed(2)} ms、${metrics.leadingEar.ja}`,
    ko: `ITD: ${metrics.itdMs.toFixed(2)} ms, ${metrics.leadingEar.ko}`
  }[language];
  const ildLabel = `${spatialCopy.ildAbout[language]}${metrics.ildDb.toFixed(1)} dB`;
  const distanceLossLabel = `${spatialCopy.distanceLoss[language]}${formatSignedDb(metrics.distanceGain)}`;

  return (
    <main className="spatial-audio-page">
      <section className="sound-lab-hero" aria-labelledby="spatial-audio-title">
        <div className="sound-lab-back-actions">
          <button className="sound-lab-back" type="button" onClick={onBack}>
            <ArrowLeft size={18} aria-hidden="true" />
            {spatialCopy.backKnowledge[language]}
          </button>
          {onBackToDetails ? <button className="sound-lab-back" type="button" onClick={onBackToDetails}><ArrowLeft size={18} aria-hidden="true" />{spatialCopy.backDetails[language]}</button> : null}
        </div>
        <div>
          <span className="section-kicker">{spatialCopy.traditionalLab[language]}</span>
          <h1 id="spatial-audio-title">{spatialCopy.labTitle[language]}</h1>
          <p>
            {spatialCopy.intro[language]}
          </p>
        </div>
      </section>

      <section
        aria-label={spatialCopy.workbench[language]}
        className="spatial-audio-workbench"
      >
        <div className="waveform-tabs spatial-audio-tabs" role="group" aria-label={spatialCopy.modes[language]}>
          {(Object.keys(modeLabels) as SpatialMode[]).map((item) => (
            <button aria-pressed={mode === item} className={mode === item ? "active" : ""} key={item} type="button" onClick={() => setMode(item)}>
              {modeLabels[item][language]}
            </button>
          ))}
        </div>

        <p className="spatial-mode-description">{modeDescriptions[mode][language]}</p>
        <div className="spatial-audio-layout">
          <div className="spatial-audio-visuals" data-mode={mode}>
            {mode === "object" ? <ObjectMapping language={language} angle={sourceAngle} distance={distance} /> : <SpatialScene
              distance={distance}
              headYaw={headYaw}
              language={language}
              mode={mode}
              reflection={reflection}
              sourceAngle={sourceAngle}
            />}
            {mode === "binaural" && <BinauralFlow language={language} angle={metrics.relativeAngle} distance={distance} />}
            {mode === "headTracking" && <HeadCoordinates language={language} sourceAngle={sourceAngle} headYaw={headYaw} />}
            {mode === "cues" && <BinauralCues language={language} relativeAngle={metrics.relativeAngle} itdMs={metrics.itdMs} ildDb={metrics.ildDb} distance={distance} />}
            {mode === "cues" && <RoomReflectionResponse distance={distance} language={language} reflection={reflection} />}
          </div>

          <aside className="spatial-audio-panel">
            <div className="codec-mode-concepts-header">
              <span>{modeLabels[mode][language]}</span>
            </div>
            <label className="sound-lab-control">
              <span>{sourceAngleLabel}</span>
              <input aria-label={spatialCopy.sourceAngle[language]} max="150" min="-150" step="5" type="range" value={sourceAngle} onChange={(event) => setSourceAngle(Number(event.target.value))} />
            </label>
            <label className="sound-lab-control">
              <span>{distanceLabel}</span>
              <input aria-label={spatialCopy.distance[language]} max="8" min="1" step="0.5" type="range" value={distance} onChange={(event) => setDistance(Number(event.target.value))} />
            </label>
            {mode === "cues" && <label className="sound-lab-control">
              <span>{reflectionLabel}</span>
              <input aria-label={spatialCopy.reflections[language]} max="100" min="0" step="5" type="range" value={reflection} onChange={(event) => setReflection(Number(event.target.value))} />
            </label>}
            {mode !== "object" && <label className="sound-lab-control">
              <span>{headDirectionLabel}</span>
              <input aria-label={spatialCopy.headDirection[language]} max="90" min="-90" step="5" type="range" value={headYaw} onChange={(event) => setHeadYaw(Number(event.target.value))} />
            </label>}
            {mode !== "object" && <div className="spatial-audio-metrics">
              <strong>{relativeAngleLabel}</strong>
              <strong>{itdLabel}</strong>
              <strong>{ildLabel}</strong>
              <strong>{distanceLossLabel}</strong>
            </div>}
            {mode !== "object" && <details className="spatial-explanation"><summary>{spatialCopy.modelLimits[language]}</summary><p className="traditional-model-note">{spatialCopy.modelBoundary[language]}</p></details>}
            {mode === "cues" && <p className="spatial-mode-note">{text(language, "俯视曲线仅示意反射，不与能量图的假想延时逐条对应。", "Top-view curves are conceptual, not matched to the energy plot's hypothetical delays.", "上面図の曲線は概念図で、エネルギー図の仮想遅延とは対応しない。", "평면도 곡선은 개념도이며 에너지 그래프의 가상 지연과 일대일로 대응하지 않음.")}</p>}
          </aside>
        </div>
        {mode !== "object" && <details className="spatial-explanation spatial-flow-details">
          <summary>{spatialCopy.principles[language]}</summary>
          <SpatialPipeline language={language} mode={mode} />
        </details>}
      </section>
    </main>
  );
}
