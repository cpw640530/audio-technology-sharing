import type { LocalizedText } from "./knowledge";
import { traditional } from "./traditional";

const l = (zh: string, en: string, ja: string, ko: string): LocalizedText => ({ zh, "zh-Hant": traditional(zh), en, ja, ko });

type ProductPhoto = {
  image: string;
  title: LocalizedText;
  caption: LocalizedText;
  source: string;
  author: string;
  license: string;
  licenseUrl: string;
};

export const applicationProducts: Record<string, ProductPhoto[]> = {
  "meeting-communication": [{
    image: "meeting-product.webp",
    title: l("Polycom 桌面会议终端", "Polycom conference phone", "Polycom 会議用電話機", "Polycom 회의용 전화기"),
    caption: l("同一台桌面终端既拾音又放音，对应下文并行的发送与接收链路。理解 AEC 时，要区分远端播放参考与麦克风实际采集到的声音。", "One tabletop endpoint captures and plays audio, connecting the parallel send and receive paths below. For AEC, distinguish the remote render reference from what the microphone actually captures.", "卓上端末で集音と再生を行い、下の送受信経路につながります。AEC では、遠端の再生参照とマイクが実際に収録する音を区別します。", "탁상 단말은 수음과 재생을 함께 수행하며 아래 송수신 경로에 해당합니다. AEC에서는 원단 재생 참조와 마이크가 실제 수음한 소리를 구분합니다."),
    source: "https://commons.wikimedia.org/wiki/File:Polycom_phone_for_conference_calling.jpg",
    author: "Ser Amantio di Nicolao", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/"
  }],
  "automotive-audio": [{
    image: "car-product.webp",
    title: l("BMW 328i 内的 Harman Kardon 扬声器", "Harman Kardon speaker in a BMW 328i", "BMW 328i の Harman Kardon スピーカー", "BMW 328i의 Harman Kardon 스피커"),
    caption: l("车内扬声器是声音输出端。安装位置、朝向和座位关系，是理解座舱声场的起点；这张照片不代表该车型配有下文全部空间音频或 ANC 功能。", "The speaker is a sound output endpoint. Placement, orientation, and seating help explain cabin acoustics; this photo does not establish support for every spatial-audio or ANC feature described below.", "車内スピーカーは音の出力端です。設置位置、向き、座席との関係から車室音響を考えます。この写真は、下記の全空間音響・ANC 機能への対応を示すものではありません。", "스피커는 소리 출력단입니다. 설치 위치, 방향, 좌석과의 관계가 실내 음장을 이해하는 출발점입니다. 사진만으로 아래 모든 공간 오디오 및 ANC 기능 지원을 뜻하지는 않습니다."),
    source: "https://commons.wikimedia.org/wiki/File:Harman_Kardon_Car_Audio_Speaker.jpg",
    author: "Cozinsky", license: "CC BY-SA 3.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/"
  }],
  "robot-audio": [{
    image: "robot-product.webp",
    title: l("Pepper 交互机器人", "Pepper interactive robot", "対話ロボット Pepper", "Pepper 대화형 로봇"),
    caption: l("把语音交互放回实体机器人：听清指令、理解意图、确认动作，再通过语音或屏幕反馈。下文定位与安全流程是通用教学示意，不是这台机器人的内部实现。", "Place voice interaction in a physical robot: hear a request, interpret intent, confirm an action, and respond through speech or a screen. The localization and safety flows below are generic, not this robot's internal implementation.", "実体のあるロボットで、指示の聞き取り、意図理解、動作確認、音声や画面での応答を考えます。下の定位・安全フローは一般的な教材であり、この製品の内部実装ではありません。", "실제 로봇에서 요청 수음, 의도 이해, 동작 확인, 음성 또는 화면 응답을 생각해 봅니다. 아래 위치 추정 및 안전 흐름은 일반 교육용이며 이 제품의 내부 구현이 아닙니다."),
    source: "https://commons.wikimedia.org/wiki/File:Peper.jpg",
    author: "Nebojsa.pavic", license: "CC0 1.0", licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/"
  }],
  "bluetooth-audio": [{
    image: "bluetooth-product.webp",
    title: l("Apple AirPods 无线耳机", "Apple AirPods wireless earbuds", "Apple AirPods ワイヤレスイヤホン", "Apple AirPods 무선 이어폰"),
    caption: l("耳机对应无线链路的接收与播放端，通话还需要麦克风上行。外观不能告诉我们协商出的 Codec、实际延迟，也不能据此判断是否支持 LE Audio。", "Earbuds sit at the receive/playback end of a wireless link; calls also need a microphone uplink. Appearance does not reveal the negotiated codec, measured latency, or LE Audio support.", "イヤホンは無線経路の受信・再生端で、通話にはマイクの上り経路も必要です。外観から選択された Codec、実測遅延、LE Audio 対応は判断できません。", "이어폰은 무선 경로의 수신·재생단이며 통화에는 마이크 상향 경로도 필요합니다. 외관만으로 협상된 Codec, 실측 지연, LE Audio 지원 여부를 알 수 없습니다."),
    source: "https://commons.wikimedia.org/wiki/File:AirPods_(2).jpg",
    author: "LWYang", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0/"
  }],
  "iot-content": [{
    image: "echo-product.webp",
    title: l("Amazon Echo 智能音箱", "Amazon Echo smart speaker", "Amazon Echo スマートスピーカー", "Amazon Echo 스마트 스피커"),
    caption: l("智能音箱把声音变成设备交互入口。对应下文 IoT 路径：拾音、识别请求、执行设备操作并反馈；端侧与云端如何分工，要以具体产品为准。", "A smart speaker makes sound an interface to devices: capture, recognize a request, execute an operation, and respond. The edge/cloud split depends on the actual product.", "音声を機器操作の入口にするスマートスピーカー。集音、要求の認識、操作実行、応答が IoT 経路に対応します。端末とクラウドの分担は製品ごとに異なります。", "스마트 스피커는 소리를 기기 조작의 입구로 만듭니다. 수음, 요청 인식, 동작 실행, 응답이 IoT 경로에 해당합니다. 기기와 클라우드의 역할 분담은 제품별로 다릅니다."),
    source: "https://commons.wikimedia.org/wiki/File:Amazon_Echo.jpg",
    author: "Frmorrison", license: "CC BY-SA 3.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/"
  }, {
    image: "microphone-dynamic.jpg",
    title: l("Shure SM58 录音拾音示例", "Shure SM58 capture example", "Shure SM58 収音の例", "Shure SM58 수음 예시"),
    caption: l("内容创作从可靠的拾音开始。这类模拟话筒需要经过合适的前级与音频接口，才能变成可编辑的 PCM；后面的剪辑、动态处理与编码属于另一条制作链路。", "Content creation starts with capture. An analog microphone needs a suitable preamp and audio interface to produce editable PCM; editing, dynamics, and encoding belong to the production path.", "制作は収音から始まります。アナログマイクは適切なプリアンプと音声インターフェースを経て編集可能な PCM になります。編集、ダイナミクス処理、符号化は制作経路の役割です。", "콘텐츠 제작은 수음에서 시작합니다. 아날로그 마이크는 적절한 프리앰프와 오디오 인터페이스를 거쳐 편집 가능한 PCM이 됩니다. 편집, 다이내믹 처리, 인코딩은 제작 경로에 해당합니다."),
    source: "https://commons.wikimedia.org/wiki/File:Micro_Shure_SM58.jpg",
    author: "Nicolas Esposito", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0/"
  }]
};
