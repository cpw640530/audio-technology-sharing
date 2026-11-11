import type { LocalizedText } from "./knowledge";
import { traditional } from "./traditional";

const l = (zh: string, en: string, ja: string, ko: string): LocalizedText => ({
  zh,
  "zh-Hant": traditional(zh),
  en,
  ja,
  ko
});

export type CarAcousticMode = "layout" | "voice" | "localization" | "spatial" | "anc";

export const carAcousticPoints: Array<{
  id: string;
  position: [number, number, number];
  title: LocalizedText;
  purpose: LocalizedText;
}> = [
  {
    id: "talker",
    position: [-0.62, 1.95, -0.48],
    title: l("听者 / 说话者示意", "Listener / talker schematic", "聴者／話者の模式点", "청취자 / 화자 개략점"),
    purpose: l(
      "同一示意点既表示听者位置，也作为语音路径中的声源示意；不是车内安装件。",
      "The same schematic point represents the listener position and a talker in the voice path; it is not an installed vehicle component.",
      "同じ模式点で聴者の位置と音声経路の話者を表します。車内に取り付ける部品ではありません。",
      "같은 개략점이 청취자 위치와 음성 경로의 화자를 함께 나타내며 차량에 설치되는 부품은 아닙니다."
    )
  },
  {
    id: "mic-left",
    position: [-0.25, 2.1, -0.9],
    title: l("左顶灯麦克风（简化）", "Left overhead-light microphone (simplified)", "左側ルーフライトマイク（簡略）", "좌측 오버헤드 라이트 마이크(단순화)"),
    purpose: l(
      "顶灯阵列的两通道简化示意，用于展示采集与时差路径；不代表任意车辆的真实麦克风数量、位置或布置。",
      "A simplified two-channel overhead-light array for showing capture and time-difference paths; it does not claim the microphone count, positions, or layout of any vehicle.",
      "収音と時間差の経路を示すための、ルーフライトアレイの2チャンネル簡略図です。実車のマイク数、位置、配置を示すものではありません。",
      "수음 및 시간차 경로를 보여주는 오버헤드 라이트 어레이의 2채널 단순화이며 어떤 차량의 실제 마이크 수, 위치 또는 배치를 주장하지 않습니다."
    )
  },
  {
    id: "mic-right",
    position: [0.25, 2.1, -0.9],
    title: l("右顶灯麦克风（简化）", "Right overhead-light microphone (simplified)", "右側ルーフライトマイク（簡略）", "우측 오버헤드 라이트 마이크(단순화)"),
    purpose: l(
      "顶灯阵列的两通道简化示意，用于展示采集与时差路径；不代表任意车辆的真实麦克风数量、位置或布置。",
      "A simplified two-channel overhead-light array for showing capture and time-difference paths; it does not claim the microphone count, positions, or layout of any vehicle.",
      "収音と時間差の経路を示すための、ルーフライトアレイの2チャンネル簡略図です。実車のマイク数、位置、配置を示すものではありません。",
      "수음 및 시간차 경로를 보여주는 오버헤드 라이트 어레이의 2채널 단순화이며 어떤 차량의 실제 마이크 수, 위치 또는 배치를 주장하지 않습니다."
    )
  },
  {
    id: "error",
    position: [0.62, 1.95, -0.48],
    title: l("误差麦克风（示意）", "Error microphone (schematic)", "誤差マイク（模式）", "오차 마이크(개략)"),
    purpose: l(
      "用于展示残余误差反馈的示意观测点；不代表具体安装位置或测量值。",
      "A schematic observation point for residual-error feedback; it does not represent a specific installation position or measured value.",
      "残留誤差のフィードバックを示す模式的な観測点です。具体的な取り付け位置や測定値を表すものではありません。",
      "잔류 오차 피드백을 보여주는 개략 관측점이며 특정 설치 위치나 측정값을 나타내지 않습니다."
    )
  },
  {
    id: "reference",
    position: [1.45, 0.65, 1.85],
    title: l("参考加速度计（示意）", "Reference accelerometer (schematic)", "参照加速度計（模式）", "기준 가속도계(개략)"),
    purpose: l(
      "表示 ANC 路径中的参考加速度输入，不是语音麦克风。",
      "Represents the reference acceleration input in the ANC path, not a speech microphone.",
      "ANC経路の参照加速度入力を表し、音声マイクではありません。",
      "ANC 경로의 기준 가속도 입력을 나타내며 음성 마이크가 아닙니다."
    )
  },
  {
    id: "processor",
    position: [1.9, 1.15, 0.35],
    title: l("DSP 控制框（外置示意）", "DSP control block (external schematic)", "DSP制御ブロック（外部模式）", "DSP 제어 블록(외부 개략)"),
    purpose: l(
      "这是外置功能示意块，概括不同模式中的前端、识别、控制、安全策略与响应；不是车内安装位置，也不等于完整 AEC 实现。",
      "An external functional schematic that summarizes front end, recognition, control, safety policy, and response across modes; it is not an in-vehicle installation position or a complete AEC implementation.",
      "各モードのフロントエンド、認識、制御、安全方針、応答を概括する外部機能模式です。車内の取り付け位置ではなく、完全なAEC実装でもありません。",
      "여러 모드의 프런트엔드, 인식, 제어, 안전 정책과 응답을 요약하는 외부 기능 개략이며 차량 내 설치 위치나 완전한 AEC 구현을 뜻하지 않습니다."
    )
  }
];

export const carAcousticScenes: Record<
  CarAcousticMode,
  {
    points: string[];
    paths: { from: string; to: string; kind: "acoustic" | "signal" | "feedback" }[];
    caption: LocalizedText;
  }
> = {
  layout: {
    points: [
      "talker",
      "mic-left",
      "mic-right",
      "error",
      "reference",
      "processor",
      "front-left-tweeter",
      "front-right-tweeter",
      "center",
      "front-left-door",
      "front-right-door",
      "rear-left-door",
      "rear-right-door",
      "sub"
    ],
    paths: [],
    caption: l(
      "展示车载声学实验的相对角色与连接范围；节点和箭头是示意，不代表实际安装结构、测量结果或性能。",
      "Shows relative roles and connection scope for the in-vehicle acoustics lab; nodes and arrows are schematic and do not represent installation structure, measurements, or performance.",
      "車載音響ラボの相対的な役割と接続範囲を示します。ノードと矢印は模式図であり、実際の取り付け構造、測定結果、性能を表しません。",
      "차량 음향 실험실의 상대적 역할과 연결 범위를 보여줍니다. 노드와 화살표는 개략도이며 실제 설치 구조, 측정 결과 또는 성능을 나타내지 않습니다."
    )
  },
  voice: {
    points: ["talker", "mic-left", "mic-right", "processor", "center"],
    paths: [
      { from: "talker", to: "mic-left", kind: "acoustic" },
      { from: "talker", to: "mic-right", kind: "acoustic" },
      { from: "mic-left", to: "processor", kind: "signal" },
      { from: "mic-right", to: "processor", kind: "signal" },
      { from: "processor", to: "center", kind: "signal" },
      { from: "center", to: "talker", kind: "acoustic" }
    ],
    caption: l(
      "说话声到达顶灯麦阵，采集信号送去处理与识别；获准的语音响应再经中置扬声器传到听者。处理框概括前端、识别与安全策略，回声及 AEC 参考支路未展开。",
      "Speech reaches the roof microphones and the captured signals go to processing and recognition. An authorized voice response returns through the center speaker to the listener. The block summarizes front end, recognition, and safety policy; echo and the AEC reference branch are omitted.",
      "発話はルーフマイクに届き、収音信号は処理・認識へ送られます。許可された音声応答はセンタースピーカーから聴者へ戻ります。処理ブロックは前処理・認識・安全方針の概括で、エコーとAEC参照分岐は省略しています。",
      "발화는 루프 마이크에 도달하고 수음 신호는 처리·인식으로 전달됩니다. 허용된 음성 응답은 센터 스피커를 통해 청취자에게 돌아갑니다. 처리 블록은 전처리·인식·안전 정책을 요약하며 에코와 AEC 참조 분기는 생략합니다."
    )
  },
  localization: {
    points: ["talker", "mic-left", "mic-right", "processor"],
    paths: [
      { from: "talker", to: "mic-left", kind: "acoustic" },
      { from: "talker", to: "mic-right", kind: "acoustic" },
      { from: "mic-left", to: "processor", kind: "signal" },
      { from: "mic-right", to: "processor", kind: "signal" }
    ],
    caption: l(
      "同一句话沿不同距离到达两只麦克风。对同步通道估计到达时间差，再结合阵列几何判断方向；这不是身份识别，图中距离也不用于计算定位精度。",
      "The same utterance travels different distances to two microphones. Estimate arrival-time differences between synchronized channels, then use array geometry to infer direction. This is not identity recognition; diagram distances do not determine localization accuracy.",
      "同じ発話が異なる距離を通って2つのマイクに届きます。同期チャンネル間の到達時間差とアレイ形状から方向を推定します。身元認識ではなく、図中の距離から定位精度は計算しません。",
      "같은 발화가 서로 다른 거리를 거쳐 두 마이크에 도달합니다. 동기 채널의 도달 시간차와 배열 기하로 방향을 추정합니다. 신원 인식이 아니며 그림의 거리로 위치 추정 정확도를 계산하지 않습니다."
    )
  },
  spatial: {
    points: ["processor", "front-left-door", "front-right-door", "talker"],
    paths: [
      { from: "processor", to: "front-left-door", kind: "signal" },
      { from: "processor", to: "front-right-door", kind: "signal" },
      { from: "front-left-door", to: "talker", kind: "acoustic" },
      { from: "front-right-door", to: "talker", kind: "acoustic" }
    ],
    caption: l(
      "处理器分别驱动左右门扬声器，两路声音在听者位置叠加。这里只展示两个输出通道；实际声像还取决于增益、延迟、反射与座位校准，箭头不是声场。",
      "The processor drives the left and right door speakers separately; their sounds superpose at the listener. Only two output channels are shown. Imaging also depends on gain, delay, reflections, and seat calibration; arrows are not a sound field.",
      "処理器が左右のドアスピーカーを別々に駆動し、聴者の位置で音が重なります。出力は2チャンネルだけを示しています。音像はゲイン、遅延、反射、座席校正にも依存し、矢印は音場ではありません。",
      "처리기가 좌우 도어 스피커를 각각 구동하고 청취자 위치에서 소리가 중첩됩니다. 두 출력 채널만 표시하며 실제 음상은 이득, 지연, 반사, 좌석 보정에도 의존합니다. 화살표는 음장이 아닙니다."
    )
  },
  anc: {
    points: ["reference", "processor", "front-left-door", "front-right-door", "error"],
    paths: [
      { from: "reference", to: "processor", kind: "signal" },
      { from: "processor", to: "front-left-door", kind: "signal" },
      { from: "processor", to: "front-right-door", kind: "signal" },
      { from: "front-left-door", to: "error", kind: "acoustic" },
      { from: "front-right-door", to: "error", kind: "acoustic" },
      { from: "error", to: "processor", kind: "feedback" }
    ],
    caption: l(
      "加速度参考送入控制器，扬声器输出控制声；误差麦测量它与路噪叠加后的残余声压，反馈给控制器更新滤波器。参考传感器不是语音麦，图中未画路噪传播，也不表示全舱都能消除。",
      "The acceleration reference feeds the controller, and speakers emit control sound. The error microphone measures residual pressure after road noise and control sound combine, feeding it back to update the filter. The reference is not a speech mic; road-noise propagation is omitted and whole-cabin cancellation is not implied.",
      "加速度参照を制御器へ送り、スピーカーが制御音を出します。誤差マイクは走行騒音と制御音の重畳後の残留音圧を測り、フィルタ更新へフィードバックします。参照は音声マイクではなく、走行騒音の伝搬は省略し、全車室の消音も意味しません。",
      "가속도 참조가 제어기에 입력되고 스피커가 제어음을 출력합니다. 오차 마이크는 도로 소음과 제어음이 중첩된 잔류 음압을 측정해 필터 갱신으로 피드백합니다. 참조는 음성 마이크가 아니며 도로 소음 전달은 생략했고 실내 전체의 상쇄를 뜻하지 않습니다."
    )
  }
};
