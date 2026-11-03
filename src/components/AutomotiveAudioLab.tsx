import { useId, useState } from "react";
import { ArrowLeft } from "lucide-react";
import type { Language } from "../content/knowledge";

type AutomotiveAudioLabProps = {
  language: Language;
  onBack: () => void;
  onBackToDetails?: () => void;
};

type LocalizedText = Record<Language, string>;

const l = (zh: string, en: string, ja: string, ko: string): LocalizedText => ({ zh, en, ja, ko });

type AutomotiveModule = "layout" | "voice" | "localization" | "spatial" | "anc";

type ModuleContent = {
  label: LocalizedText;
  heading: LocalizedText;
  goal: LocalizedText;
  chain: LocalizedText;
  limit: LocalizedText;
  example: LocalizedText;
};

const automotiveModules: Record<AutomotiveModule, ModuleContent> = {
  layout: {
    label: l("整车布局", "Whole-car layout", "車両全体のレイアウト", "차량 전체 배치"),
    heading: l("整车声学布局", "Whole-vehicle acoustic layout", "車両全体の音響レイアウト", "차량 전체 음향 배치"),
    goal: l("在拾音距离、声像方向、控制稳定性和成本之间安排麦克风、扬声器与传感器。", "Place microphones, speakers, and sensors to balance pickup distance, image direction, control stability, and cost.", "収音距離、音像方向、制御の安定性、コストのバランスを取ってマイク、スピーカー、センサーを配置します。", "수음 거리, 음상 방향, 제어 안정성, 비용 사이의 균형을 고려해 마이크, 스피커, 센서를 배치합니다。"),
    chain: l("乘员 / 噪声源 -> 麦克风与传感器 -> DSP / 功放 -> 扬声器 -> 乘员耳位", "Occupants / noise sources -> microphones and sensors -> DSP / amplifier -> speakers -> occupant listening positions", "乗員 / 雑音源 -> マイクとセンサー -> DSP / アンプ -> スピーカー -> 乗員の聴取位置", "탑승자 / 잡음원 -> 마이크와 센서 -> DSP / 앰프 -> 스피커 -> 탑승자 청취 위치"),
    limit: l("实际数量和位置受车身反射、内饰、座位、功耗与车型成本约束。", "Actual counts and positions are constrained by body reflections, trim, seating, power, and vehicle cost.", "実際の数と位置は、車体反射、内装、座席、消費電力、車種コストに制約されます。", "실제 수량과 위치는 차체 반사, 내장재, 좌석, 전력, 차종 비용의 제약을 받습니다。"),
    example: l("顶灯阵列负责远场拾音，A 柱高音与门板扬声器塑造前方声像，后备厢低音炮补充低频。", "A roof array captures far-field speech, A-pillar tweeters and door speakers shape the front image, and a rear subwoofer extends bass.", "ルーフアレイが遠方音声を収音し、A ピラーのツイーターとドアスピーカーが前方の音像を作り、後部サブウーファーが低域を補います。", "루프 배열이 원거리 음성을 수음하고 A필러 트위터와 도어 스피커가 전방 음상을 만들며 후방 서브우퍼가 저역을 보강합니다。")
  },
  voice: {
    label: l("语音交互", "Voice interaction", "音声インタラクション", "음성 상호작용"),
    heading: l("从一句话到车辆动作", "From speech to a permitted vehicle action", "一言を許可された車両動作へ", "한마디에서 허용된 차량 동작으로"),
    goal: l("在音乐、路噪和多人说话中识别说话座位与意图，再按座位权限执行车辆动作并给出可感知反馈。", "Identify the speaking seat and intent amid playback, road noise, and competing talkers, then apply seat permissions before acting and providing perceptible feedback.", "音楽、走行音、複数人の発話の中から発話席と意図を識別し、座席権限を確認して車両動作を実行し、知覚できるフィードバックを返します。", "음악, 주행 소음, 여러 사람의 발화 속에서 발화 좌석과 의도를 식별하고 좌석 권한을 확인한 뒤 차량을 동작시켜 인지 가능한 피드백을 제공합니다。"),
    chain: l("说话人 -> 顶灯麦阵 -> AEC / 降噪 / 波束形成 -> 唤醒 / ASR -> 意图理解与安全策略 -> 获准的车辆控制 / 语音反馈", "Talker -> roof array -> AEC / denoising / beamforming -> wake / ASR -> intent understanding and safety policy -> permitted vehicle control / voice response", "話者 -> ルーフアレイ -> AEC / ノイズ抑圧 / ビームフォーミング -> ウェイク / ASR -> 意図理解と安全ポリシー -> 許可された車両制御 / 音声応答", "화자 -> 루프 배열 -> AEC / 잡음 억제 / 빔포밍 -> 웨이크 / ASR -> 의도 이해와 안전 정책 -> 허용된 차량 제어 / 음성 응답"),
    limit: l("必须结合车速、驾驶状态、座位权限和安全策略，避免乘客或回放声音触发不安全或未授权控制。", "Vehicle speed, driving state, seat permission, and safety policy must be considered so passengers or playback cannot trigger unsafe or unauthorized control.", "車速、運転状態、座席権限、安全ポリシーを組み合わせ、乗員や再生音が危険な操作や未許可の制御を起こさないようにします。", "차량 속도, 주행 상태, 좌석 권한, 안전 정책을 함께 고려해 승객이나 재생음이 위험하거나 승인되지 않은 제어를 일으키지 않게 해야 합니다。"),
    example: l("驾驶员可以调节空调；后排乘客通常只能控制自己的娱乐区域。", "The driver may adjust climate controls, while rear passengers are usually limited to their own entertainment zone.", "運転者は空調を調整できますが、後部座席の乗員は通常、自分のエンターテインメント領域だけを操作します。", "운전자는 공조를 조절할 수 있지만 뒷좌석 승객은 보통 자신의 엔터테인먼트 영역만 제어할 수 있습니다。")
  },
  localization: {
    label: l("声源定位", "Source localization", "音源測位", "음원 위치 추정"),
    heading: l("用到达时间差判断说话座位", "Use time differences to identify the speaking seat", "到来時間差から発話席を判定", "도착 시간 차로 발화 좌석 판단"),
    goal: l("利用同步多麦估计声源方向和座位，为唤醒、分区识别与车辆控制提供归属信息。", "Use synchronized microphones to estimate source direction and seat ownership for wake-up, zoned recognition, and vehicle control.", "同期した複数マイクで音源方向と座席を推定し、ウェイク、ゾーン認識、車両制御に所属情報を提供します。", "동기화된 여러 마이크로 음원 방향과 좌석을 추정해 웨이크, 구역 인식, 차량 제어에 소속 정보를 제공합니다。"),
    chain: l("Δt = d sin(θ) / c", "Δt = d sin(θ) / c", "Δt = d sin(θ) / c", "Δt = d sin(θ) / c"),
    limit: l("定位负责判断方向，波束形成负责增强目标方向；强反射、通道延迟和多人重叠会降低稳定性。", "Localization estimates direction, while beamforming enhances the target direction; strong reflections, channel delay, and overlapping talkers reduce stability.", "測位は方向を推定し、ビームフォーミングは対象方向を強調します。強い反射、チャンネル遅延、発話の重なりは安定性を下げます。", "위치 추정은 방향을 판단하고 빔포밍은 대상 방향을 강화합니다. 강한 반사, 채널 지연, 여러 화자의 중첩은 안정성을 낮춥니다。"),
    example: l("同一句“调高温度”来自主驾或副驾时，系统只调整对应温区。", "The same “raise the temperature” request adjusts the corresponding climate zone depending on whether it came from the driver or passenger.", "同じ「温度を上げて」という要求でも、運転席か助手席かに応じて対応する空調ゾーンだけを調整します。", "같은 ‘온도를 올려’라는 요청도 운전석인지 조수석인지에 따라 해당 공조 구역만 조절합니다。")
  },
  spatial: {
    label: l("空间音频", "Spatial audio", "空間音響", "공간 오디오"),
    heading: l("让每类声音出现在合适方向", "Place each sound in a useful direction", "音の種類ごとに適切な方向へ配置", "각 소리를 적절한 방향에 배치"),
    goal: l("通过扬声器布局、延迟、EQ、相位和座位补偿，把音乐、导航、告警与助手反馈放到清晰方向。", "Use speaker layout, delay, EQ, phase, and seat compensation to place music, navigation, alerts, and assistant feedback clearly.", "スピーカー配置、遅延、EQ、位相、座席補正によって、音楽、ナビ、警告、アシスタント応答を明確な方向に配置します。", "스피커 배치, 지연, EQ, 위상, 좌석 보정으로 음악, 내비게이션, 경고, 어시스턴트 응답을 명확한 방향에 배치합니다。"),
    chain: l("音源分类 -> 安全优先级 -> 声像与座位渲染 -> 多扬声器回放", "Source classification -> safety priority -> image and seat rendering -> multi-speaker playback", "音源分類 -> 安全優先度 -> 音像と座席のレンダリング -> 複数スピーカー再生", "음원 분류 -> 안전 우선순위 -> 음상 및 좌석 렌더링 -> 다중 스피커 재생"),
    limit: l("安全告警优先于娱乐声场，导航提示也不应被音乐声像掩蔽。", "Safety alerts take priority over entertainment imaging, and navigation prompts must not be masked by music.", "安全警告は娯楽の音場より優先し、ナビの案内も音楽の音像に埋もれてはいけません。", "안전 경고는 엔터테인먼트 음장보다 우선하며 내비게이션 안내도 음악 음상에 묻히면 안 됩니다。"),
    example: l("右转导航提示偏向右前方，碰撞告警保持强可辨识度，音乐维持宽阔前方声场。", "A right-turn prompt appears front-right, a collision alert remains unmistakable, and music retains a broad frontal stage.", "右折案内は右前方に定位し、衝突警告は明確に聞き取れる強さを保ち、音楽は広い前方音場を維持します。", "우회전 안내는 오른쪽 앞에 배치하고 충돌 경고는 뚜렷하게 들리도록 유지하며 음악은 넓은 전방 음장을 유지합니다。")
  },
  anc: {
    label: l("ANC / RNC", "ANC / RNC", "ANC / RNC", "ANC / RNC"),
    heading: l("用闭环控制削弱稳定低频噪声", "Reduce steady low-frequency noise with closed-loop control", "閉ループ制御で定常的な低周波雑音を低減", "폐루프 제어로 지속적인 저주파 잡음 줄이기"),
    goal: l("利用路面或动力系统参考信号预测稳定低频噪声，并在乘员耳位附近减小残余声压。", "Use road or powertrain reference signals to predict steady low-frequency noise and reduce residual pressure near occupant ears.", "路面やパワートレインの参照信号から定常低周波雑音を予測し、乗員の耳元で残留音圧を下げます。", "노면 또는 파워트레인 참조 신호로 지속적인 저주파 잡음을 예측하고 탑승자 귀 주변의 잔류 음압을 줄입니다。"),
    chain: l("参考信号 -> ANC 控制器 -> 扬声器反相信号 -> 座舱残余噪声 -> 误差麦反馈", "Reference signal -> ANC controller -> anti-noise from speakers -> residual cabin noise -> error-microphone feedback", "参照信号 -> ANC コントローラー -> スピーカーの逆相信号 -> 車室残留雑音 -> エラーマイクのフィードバック", "참조 신호 -> ANC 컨트롤러 -> 스피커 역위상 신호 -> 실내 잔류 잡음 -> 오차 마이크 피드백"),
    limit: l("适用于稳定、可预测的低频噪声，不应以人声、安全告警或高频瞬态声为消除目标；相位或延迟错误可能放大噪声。", "It suits stable, predictable low-frequency noise and must not target speech, safety alerts, or high-frequency transients; phase or delay errors can amplify noise.", "安定して予測可能な低周波雑音に適し、音声、安全警告、高周波過渡音を対象にしてはいけません。位相や遅延の誤りは雑音を増幅することがあります。", "안정적이고 예측 가능한 저주파 잡음에 적합하며 음성, 안전 경고, 고주파 과도음을 제거 대상으로 삼으면 안 됩니다. 위상이나 지연 오류는 잡음을 증폭할 수 있습니다。"),
    example: l("轮速或悬架传感器提供路噪参考，门板扬声器输出反相信号，误差麦持续修正控制器。", "Wheel-speed or suspension sensors provide a road-noise reference, door speakers emit anti-noise, and error microphones continuously adapt the controller.", "車輪速またはサスペンションセンサーが走行雑音の参照を提供し、ドアスピーカーが逆相信号を出力し、エラーマイクが制御器を継続的に補正します。", "휠 속도 또는 서스펜션 센서가 주행 잡음 참조를 제공하고 도어 스피커가 역위상 신호를 출력하며 오차 마이크가 컨트롤러를 계속 보정합니다。")
  }
};

const moduleOrder = Object.keys(automotiveModules) as AutomotiveModule[];

type LegendItem = {
  id: "voice-mic" | "error-mic" | "speaker" | "noise";
  label: LocalizedText;
  symbol: string;
  relevantTo: AutomotiveModule[];
};

const legendItems: LegendItem[] = [
  {
    id: "voice-mic",
    label: l("语音麦克风", "Voice mic", "音声マイク", "음성 마이크"),
    symbol: "MIC",
    relevantTo: ["layout", "voice", "localization"]
  },
  {
    id: "error-mic",
    label: l("ANC 误差麦", "ANC error mic", "ANC エラーマイク", "ANC 오차 마이크"),
    symbol: "ANC",
    relevantTo: ["layout", "anc"]
  },
  {
    id: "speaker",
    label: l("扬声器", "Speaker", "スピーカー", "스피커"),
    symbol: "SPK",
    relevantTo: ["layout", "voice", "spatial", "anc"]
  },
  {
    id: "noise",
    label: l("外部噪声源", "External noise source", "外部雑音源", "외부 잡음원"),
    symbol: "NOISE",
    relevantTo: ["layout", "anc"]
  }
];

function AutomotiveCabinDiagram({ activeModule, language }: { activeModule: AutomotiveModule; language: Language }) {
  const arrowMarkerId = useId();
  const voiceArrowMarkerId = useId();
  const ja: Record<string, string> = {
    "可水平滚动的座舱部件图": "横スクロールできる車室部品図",
    "车载声学座舱部件位置图": "車載音響の車室部品配置図",
    "车头": "車両前方",
    "车尾": "車両後方",
    "主驾": "運転席",
    "副驾": "助手席",
    "后左": "後左席",
    "后右": "後右席",
    "顶灯麦克风阵列": "ルーフマイクアレイ",
    "顶灯麦阵": "ルーフマイクアレイ",
    "ANC 误差麦": "ANC エラーマイク",
    "ANC 误差麦：": "ANC エラーマイク：",
    "中置扬声器": "センタースピーカー",
    "门板扬声器": "ドアスピーカー",
    "后置低音炮": "リアサブウーファー",
    "前方扬声器区": "前方スピーカーゾーン",
    "A 柱 + 中置 + 前门": "A ピラー + センター + 前ドア",
    "拾音：顶灯麦阵": "収音：ルーフマイクアレイ",
    "后方扬声器区": "後方スピーカーゾーン",
    "后门 + 低音炮": "後ドア + サブウーファー",
    "反馈：ANC 误差麦": "フィードバック：ANC エラーマイク",
    "路噪 / 胎噪": "走行音 / タイヤ音",
    "空调噪声": "空調雑音",
    "音乐回放": "音楽再生",
    "助手处理": "アシスタント処理",
    "回声与噪声预处理": "エコーと雑音の前処理",
    "唤醒 / ASR -> 意图 / 安全策略": "ウェイク / ASR -> 意図 / 安全ポリシー",
    "车辆响应": "車両の応答",
    "获准控制 + 语音反馈": "許可された制御 + 音声応答",
    "多麦时间差": "複数マイクの時間差",
    "TDOA 阵列几何": "TDOA アレイ幾何",
    "声源方向": "音源方向",
    "音乐：前方宽声场": "音楽：広い前方音場",
    "导航：右前方": "ナビ：右前方",
    "告警：最高优先级": "警告：最優先",
    "轮胎 / 路面参考": "タイヤ / 路面参照",
    "轮速 · 悬架传感器": "車輪速 · サスペンションセンサー",
    "ANC 控制器": "ANC コントローラー",
    "闭环反馈": "閉ループフィードバック",
    "残余噪声 -> 误差麦": "残留雑音 -> エラーマイク",
    "车载声学图例": "車載音響の凡例",
    "当前模块相关": "現在のモジュールに関連",
    "当前模块不相关": "現在のモジュールに非関連",
    "选择模块，观察麦克风、扬声器与控制链路如何在同一座舱中协同。": "モジュールを選び、同じ車室でマイク、スピーカー、制御経路がどう協調するかを確認します。"
  };
  const ko: Record<string, string> = {
    "可水平滚动的座舱部件图": "가로로 스크롤할 수 있는 실내 부품도",
    "车载声学座舱部件位置图": "차량 음향 실내 부품 배치도",
    "车头": "차량 전방",
    "车尾": "차량 후방",
    "主驾": "운전석",
    "副驾": "조수석",
    "后左": "왼쪽 뒷좌석",
    "后右": "오른쪽 뒷좌석",
    "顶灯麦克风阵列": "루프 마이크 배열",
    "顶灯麦阵": "루프 마이크 배열",
    "ANC 误差麦": "ANC 오차 마이크",
    "中置扬声器": "센터 스피커",
    "门板扬声器": "도어 스피커",
    "后置低音炮": "후방 서브우퍼",
    "前方扬声器区": "전방 스피커 구역",
    "A 柱 + 中置 + 前门": "A필러 + 센터 + 앞문",
    "拾音：顶灯麦阵": "수음: 루프 마이크 배열",
    "后方扬声器区": "후방 스피커 구역",
    "后门 + 低音炮": "뒷문 + 서브우퍼",
    "反馈：ANC 误差麦": "피드백: ANC 오차 마이크",
    "路噪 / 胎噪": "주행음 / 타이어음",
    "空调噪声": "공조 소음",
    "音乐回放": "음악 재생",
    "助手处理": "어시스턴트 처리",
    "回声与噪声预处理": "에코 및 잡음 전처리",
    "唤醒 / ASR -> 意图 / 安全策略": "웨이크 / ASR -> 의도 / 안전 정책",
    "车辆响应": "차량 응답",
    "获准控制 + 语音反馈": "허용된 제어 + 음성 응답",
    "多麦时间差": "다중 마이크 시간 차",
    "TDOA 阵列几何": "TDOA 배열 기하",
    "声源方向": "음원 방향",
    "音乐：前方宽声场": "음악: 넓은 전방 음장",
    "导航：右前方": "내비게이션: 오른쪽 앞",
    "告警：最高优先级": "경고: 최고 우선순위",
    "轮胎 / 路面参考": "타이어 / 노면 참조",
    "轮速 · 悬架传感器": "휠 속도 · 서스펜션 센서",
    "ANC 控制器": "ANC 컨트롤러",
    "闭环反馈": "폐루프 피드백",
    "残余噪声 -> 误差麦": "잔류 잡음 -> 오차 마이크",
    "车载声学图例": "차량 음향 범례",
    "当前模块相关": "현재 모듈과 관련",
    "当前模块不相关": "현재 모듈과 무관",
    "选择模块，观察麦克风、扬声器与控制链路如何在同一座舱中协同。": "모듈을 선택해 같은 실내에서 마이크, 스피커, 제어 경로가 어떻게 협력하는지 확인합니다."
  };
  const t = (zh: string, en: string, jaText = ja[zh], koText = ko[zh]) => language === "zh" ? zh : language === "en" ? en : language === "ja" ? jaText : koText;

  return (
    <figure className="automotive-diagram">
      <div
        aria-label={t("可水平滚动的座舱部件图", "Horizontally scrollable cabin component diagram")}
        className="automotive-diagram-scroll"
        role="region"
        tabIndex={0}
      >
        <svg
          aria-label={t("车载声学座舱部件位置图", "In-car acoustics cabin component layout diagram")}
          data-active-module={activeModule}
          role="img"
          viewBox="0 0 980 600"
          xmlns="http://www.w3.org/2000/svg"
        >
        <defs>
          <marker id={arrowMarkerId} markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
            <path d="M0 0 8 4 0 8Z" fill="#1f7569" />
          </marker>
          <marker id={voiceArrowMarkerId} markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
            <path d="M0 0 8 4 0 8Z" fill="#b44c6d" />
          </marker>
        </defs>
        <rect className="auto-diagram-bg" height="600" rx="18" width="980" />

        <g className="auto-car">
          <text className="auto-orientation-label" x="490" y="28" textAnchor="middle">{t("车头", "Front")}</text>
          <text className="auto-orientation-label" x="490" y="584" textAnchor="middle">{t("车尾", "Rear")}</text>
          <rect className="auto-external-wheel" height="102" rx="16" width="28" x="260" y="126" />
          <rect className="auto-external-wheel" height="102" rx="16" width="28" x="692" y="126" />
          <rect className="auto-external-wheel" height="102" rx="16" width="28" x="260" y="404" />
          <rect className="auto-external-wheel" height="102" rx="16" width="28" x="692" y="404" />
          <path className="auto-body" d="M350 48 C314 60 294 96 294 152 L294 472 C294 528 328 558 382 566 L598 566 C652 558 686 528 686 472 L686 152 C686 96 666 60 630 48 C570 30 410 30 350 48Z" />
          <path className="auto-window auto-windshield-front" d="M350 96 Q490 62 630 96 L610 168 Q490 146 370 168Z" />
          <path className="auto-window auto-windshield-rear" d="M370 474 Q490 496 610 474 L626 526 Q490 550 354 526Z" />
          <path className="auto-door-seam" d="M304 188 H676 M304 356 H676 M490 180 V478" />
          <rect className="auto-console" height="212" rx="16" width="42" x="469" y="214" />
          <circle className="auto-steering-wheel" cx="386" cy="192" r="25" />
          <circle className="auto-steering-hub" cx="386" cy="192" r="7" />

          {[
            { x: 344, y: 228, label: t("主驾", "Driver") },
            { x: 536, y: 228, label: t("副驾", "Passenger") },
            { x: 344, y: 380, label: t("后左", "Rear left") },
            { x: 536, y: 380, label: t("后右", "Rear right") }
          ].map((seat) => (
            <g className="auto-seat" key={seat.label}>
              <rect className="auto-seat-back" height="68" rx="16" width="94" x={seat.x} y={seat.y} />
              <rect className="auto-seat-base" height="38" rx="14" width="108" x={seat.x - 7} y={seat.y + 58} />
              <text className="auto-seat-label" textAnchor="middle" x={seat.x + 47} y={seat.y + 83}>{seat.label}</text>
            </g>
          ))}

          <g aria-label={t("顶灯麦克风阵列", "Roof microphone array")}>
            {[466, 482, 498, 514].map((x) => <circle className="auto-mic roof" cx={x} cy="186" key={x} r="6" />)}
          </g>
          <text className="auto-component-text" x="490" y="177" textAnchor="middle">{t("顶灯麦克风阵列", "Roof mic array")}</text>
          <circle className="auto-error-mic" cx="414" cy="330" r="7" />
          <circle className="auto-error-mic" cx="566" cy="330" r="7" />
          <text className="auto-component-text" x="490" y="346" textAnchor="middle">{t("ANC 误差麦", "ANC error mics")}</text>
          <circle className="auto-speaker pillar" cx="326" cy="176" r="10" />
          <circle className="auto-speaker pillar" cx="654" cy="176" r="10" />
          <circle className="auto-speaker dash" cx="490" cy="156" r="12" />
          <text className="auto-component-text" x="490" y="145" textAnchor="middle">{t("中置扬声器", "Center speaker")}</text>
          {[242, 420].flatMap((y) => [318, 662].map((x) => <circle className="auto-speaker door" cx={x} cy={y} key={`${x}-${y}`} r="12" />))}
          <text className="auto-component-text" x="735" y="248">{t("门板扬声器", "Door speakers")}</text>
          <path className="auto-component-line speaker-line" d="M724 244 L674 242" />
          <circle className="auto-subwoofer" cx="490" cy="520" r="18" />
          <text className="auto-component-text" x="518" y="526">{t("后置低音炮", "Rear subwoofer")}</text>
        </g>

        {activeModule === "layout" && (
          <g data-module="layout">
            <rect className="auto-chip" height="48" rx="12" width="174" x="30" y="74" />
            <text className="auto-chip-text" x="117" y="95" textAnchor="middle">{t("前方扬声器区", "Front speaker zone")}</text>
            <text className="auto-panel-copy" x="117" y="115" textAnchor="middle">{t("A 柱 + 中置 + 前门", "A-pillars + center + front doors")}</text>
            <rect className="auto-chip" height="34" rx="12" width="174" x="30" y="148" />
            <text className="auto-chip-text" x="117" y="171" textAnchor="middle">{t("拾音：顶灯麦阵", "Pickup: roof mic array")}</text>
            <path className="auto-component-line mic-line" d="M204 165 L458 184" />
            <rect className="auto-chip" height="48" rx="12" width="174" x="776" y="474" />
            <text className="auto-chip-text" x="863" y="495" textAnchor="middle">{t("后方扬声器区", "Rear speaker zone")}</text>
            <text className="auto-panel-copy" x="863" y="515" textAnchor="middle">{t("后门 + 低音炮", "Rear doors + subwoofer")}</text>
            <rect className="auto-chip" height="34" rx="12" width="174" x="776" y="390" />
            <text className="auto-chip-text" x="863" y="413" textAnchor="middle">{t("反馈：ANC 误差麦", "Feedback: ANC error mics")}</text>
            <path className="auto-component-line anc-line" d="M776 407 L578 336" />
            <rect className="auto-noise-chip" height="34" rx="12" width="108" x="58" y="246" />
            <text className="auto-noise-text" x="112" y="269" textAnchor="middle">{t("路噪 / 胎噪", "Road / tire")}</text>
            <rect className="auto-noise-chip" height="34" rx="12" width="108" x="814" y="246" />
            <text className="auto-noise-text" x="868" y="269" textAnchor="middle">{t("空调噪声", "HVAC noise")}</text>
            <rect className="auto-noise-chip" height="34" rx="12" width="108" x="814" y="302" />
            <text className="auto-noise-text" x="868" y="325" textAnchor="middle">{t("音乐回放", "Music playback")}</text>
          </g>
        )}

        {activeModule === "voice" && (
          <g data-module="voice">
          <circle className="auto-talker" cx="386" cy="250" r="16" />
          <path className="auto-voice-arrow" d="M402 244 Q438 204 466 190" markerEnd={`url(#${voiceArrowMarkerId})`} />
          <rect className="auto-assistant-panel" height="116" rx="12" width="224" x="24" y="72" />
          <text className="auto-panel-title" x="136" y="101" textAnchor="middle">{t("助手处理", "Assistant processing")}</text>
          <text className="auto-panel-copy" x="136" y="127" textAnchor="middle">{t("回声与噪声预处理", "Echo and noise preprocessing")}</text>
          <text className="auto-panel-copy" x="136" y="152" textAnchor="middle">{t("唤醒 / ASR -> 意图 / 安全策略", "Wake / ASR -> intent / safety policy")}</text>
          <path className="auto-voice-arrow" d="M466 186 Q330 108 248 126" markerEnd={`url(#${voiceArrowMarkerId})`} />
          <rect className="auto-chip" height="54" rx="12" width="190" x="766" y="88" />
          <text className="auto-chip-text" x="861" y="111" textAnchor="middle">{t("车辆响应", "Vehicle response")}</text>
          <text className="auto-panel-copy" x="861" y="132" textAnchor="middle">{t("获准控制 + 语音反馈", "Permitted control + voice reply")}</text>
          <path className="auto-voice-arrow" d="M248 146 Q566 54 766 112" markerEnd={`url(#${voiceArrowMarkerId})`} />
          </g>
        )}

        {activeModule === "localization" && (
          <g data-module="localization">
          {[466, 482, 498, 514].map((x, index) => (
            <path className="auto-localization-beam" d={`M386 250 Q${420 + index * 14} ${210 - index * 4} ${x} 186`} key={x} markerEnd={`url(#${arrowMarkerId})`} />
          ))}
          <circle className="auto-target-seat" cx="391" cy="272" r="62" />
          <rect className="auto-chip localization" height="104" rx="12" width="220" x="24" y="254" />
          <text className="auto-panel-title" x="134" y="284" textAnchor="middle">{t("多麦时间差", "Multi-mic time differences")}</text>
          <text className="auto-panel-copy" x="134" y="312" textAnchor="middle">Δt1 · Δt2 · Δt3</text>
          <text className="auto-panel-copy" x="134" y="340" textAnchor="middle">{t("TDOA 阵列几何", "TDOA array geometry")}</text>
          <path className="auto-arrow" d="M244 306 Q302 286 330 276" markerEnd={`url(#${arrowMarkerId})`} />
          </g>
        )}

        {activeModule === "spatial" && (
          <g data-module="spatial">
          <path className="auto-spatial-ring" d="M326 176 Q490 84 654 176" />
          <path className="auto-spatial-ring" d="M318 242 Q490 330 662 242" />
          <path className="auto-spatial-ring" d="M318 420 Q490 514 662 420" />
          <path className="auto-spatial-ring" d="M490 156 Q610 206 662 242" markerEnd={`url(#${arrowMarkerId})`} />
          <rect className="auto-spatial-panel" height="132" rx="12" width="224" x="732" y="294" />
          <text className="auto-panel-title" x="844" y="324" textAnchor="middle">{t("声源方向", "Source directions")}</text>
          <text className="auto-panel-copy" x="844" y="352" textAnchor="middle">{t("音乐：前方宽声场", "Music: wide front stage")}</text>
          <text className="auto-panel-copy" x="844" y="378" textAnchor="middle">{t("导航：右前方", "Navigation: front-right")}</text>
          <text className="auto-panel-copy" x="844" y="404" textAnchor="middle">{t("告警：最高优先级", "Alert: highest priority")}</text>
          </g>
        )}

        {activeModule === "anc" && (
          <g data-module="anc">
          <rect className="auto-noise-chip" height="52" rx="12" width="184" x="22" y="442" />
          <text className="auto-panel-title" x="114" y="464" textAnchor="middle">{t("轮胎 / 路面参考", "Tire / road reference")}</text>
          <text className="auto-panel-copy" x="114" y="484" textAnchor="middle">{t("轮速 · 悬架传感器", "wheel · suspension sensors")}</text>
          <rect className="auto-anc-panel" height="58" rx="12" width="182" x="24" y="512" />
          <text className="auto-panel-title" x="115" y="547" textAnchor="middle">{t("ANC 控制器", "ANC controller")}</text>
          <path className="auto-anc-wave" d="M206 468 Q250 452 270 432" markerEnd={`url(#${arrowMarkerId})`} />
          <path className="auto-anc-wave inverse" d="M206 540 Q282 548 318 420" markerEnd={`url(#${arrowMarkerId})`} />
          <path className="auto-anc-wave inverse" d="M206 540 Q566 584 662 420" markerEnd={`url(#${arrowMarkerId})`} />
          <rect className="auto-anc-panel" height="82" rx="12" width="220" x="736" y="476" />
          <text className="auto-panel-title" x="846" y="506" textAnchor="middle">{t("闭环反馈", "Closed-loop feedback")}</text>
          <text className="auto-panel-copy" x="846" y="532" textAnchor="middle">{t("残余噪声 -> 误差麦", "Residual noise -> error mics")}</text>
          <path className="auto-anc-wave" d="M736 518 Q628 392 566 330" markerEnd={`url(#${arrowMarkerId})`} />
          <path className="auto-anc-wave" d="M566 330 Q660 410 736 540" markerEnd={`url(#${arrowMarkerId})`} />
          </g>
        )}
        </svg>
      </div>
      <div
        aria-label={t("车载声学图例", "Automotive acoustics legend")}
        className="automotive-legend"
        role="region"
      >
        <ul>
          {legendItems.map((item) => {
            const secondaryLanguage: Language = ({ zh: "en", en: "zh", ja: "en", ko: "en" } as Record<Language, Language>)[language];
            const isRelevant = item.relevantTo.includes(activeModule);
            const accessibleLabel =
              language === "zh"
                ? `${item.label.zh} - ${isRelevant ? "当前模块相关" : "当前模块不相关"}`
                : language === "en"
                  ? `${item.label.en} - ${isRelevant ? "Relevant to current module" : "Not relevant to current module"}`
                  : language === "ja"
                    ? `${item.label.ja} - ${isRelevant ? "現在のモジュールに関連" : "現在のモジュールに非関連"}`
                    : `${item.label.ko} - ${isRelevant ? "현재 모듈과 관련" : "현재 모듈과 무관"}`;
            return (
              <li aria-label={accessibleLabel} data-relevant={isRelevant} key={item.id}>
                <span aria-hidden="true" className={`automotive-legend-swatch ${item.id}`}>
                  {item.symbol}
                </span>
                <span className="automotive-legend-label">
                  <span>{item.label[language]}</span>
                  <small lang={secondaryLanguage}>{item.label[secondaryLanguage]}</small>
                </span>
              </li>
            );
          })}
        </ul>
      </div>
      <figcaption>
        {t(
          "选择模块，观察麦克风、扬声器与控制链路如何在同一座舱中协同。",
          "Select a module to see how microphones, speakers, and control paths work together in one cabin."
        )}
      </figcaption>
    </figure>
  );
}

export function AutomotiveAudioLab({ language, onBack, onBackToDetails }: AutomotiveAudioLabProps) {
  const [activeModule, setActiveModule] = useState<AutomotiveModule>("layout");
  const activeContent = automotiveModules[activeModule];
  const t = (zh: string, en: string, ja: string, ko: string) => language === "zh" ? zh : language === "en" ? en : language === "ja" ? ja : ko;

  return (
    <main className="automotive-lab-page" aria-label={t("车载声学实验室", "In-Car Acoustics Lab", "車載音響ラボ", "차량 음향 랩")}>
      <section className="sound-lab-hero automotive-lab-hero">
        <div className="sound-lab-back-actions">
          <button className="sound-lab-back sound-lab-back-secondary" type="button" onClick={onBack}>
            {t("返回知识库", "Back to knowledge base", "知識ベースに戻る", "지식 베이스로 돌아가기")}
          </button>
          {onBackToDetails && <button className="sound-lab-back" type="button" onClick={onBackToDetails}>
            <ArrowLeft size={18} aria-hidden="true" />
            {t("返回详细内容", "Back to detailed content", "詳細ページに戻る", "상세 내용으로 돌아가기")}
          </button>}
        </div>
        <div>
          <span className="details-category">{t("应用场景", "Applications", "応用シナリオ", "응용 시나리오")}</span>
          <h1>{t("车载声学实验室", "In-Car Acoustics Lab", "車載音響ラボ", "차량 음향 랩")}</h1>
          <p>
            {t("用一张俯视整车图理解麦克风与扬声器布局，以及语音、定位、空间音频和主动降噪之间的协作。", "Use one top-down vehicle diagram to understand microphone and speaker placement and how voice, localization, spatial audio, and active noise control work together.", "車両全体の俯瞰図で、マイクとスピーカーの配置、音声、測位、空間音響、アクティブノイズコントロールの協調を理解します。", "차량 평면도 하나로 마이크와 스피커 배치, 음성, 위치 추정, 공간 오디오, 능동 잡음 제어의 협력을 이해합니다。")}
          </p>
        </div>
      </section>

      <section className="automotive-diagram-section" aria-label={t("车载声学座舱部件位置", "In-car acoustics cabin component layout", "車載音響の車室部品配置", "차량 음향 실내 부품 배치")}>
        <div className="automotive-module-controls" aria-label={t("座舱模块", "Cabin modules", "車室モジュール", "실내 모듈")} role="group">
          {moduleOrder.map((module) => (
            <button
              aria-pressed={activeModule === module}
              key={module}
              onClick={() => setActiveModule(module)}
              type="button"
            >
              {automotiveModules[module].label[language]}
            </button>
          ))}
        </div>

        <AutomotiveCabinDiagram activeModule={activeModule} language={language} />

        <article className="automotive-module-panel" aria-live="polite">
          <h2>{activeContent.heading[language]}</h2>
          <dl>
            {[
              { label: l("工作目标", "Goal", "作業目標", "작업 목표"), value: activeContent.goal },
              { label: l("处理链路", "Processing chain", "処理チェーン", "처리 체인"), value: activeContent.chain },
              { label: l("关键限制", "Key limit", "主な制約", "주요 제약"), value: activeContent.limit },
              { label: l("实际例子", "Example", "実例", "실제 예시"), value: activeContent.example }
            ].map((row) => (
              <div key={row.label.en}>
                <dt>{row.label[language]}</dt>
                <dd>{row.value[language]}</dd>
              </div>
            ))}
          </dl>
        </article>
      </section>
    </main>
  );
}
