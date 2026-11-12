import { traditional } from "../content/traditional";
import { useLabState } from "../hooks/useLabState";
import { ArrowLeft, Headphones, Smartphone, Radio, Speaker } from "lucide-react";
import type { Language } from "../content/knowledge";

const codecs = {
  SBC: { rates: [192, 256, 328], transport: "A2DP / BR/EDR" },
  AAC: { rates: [128, 192, 256], transport: "A2DP / BR/EDR" },
  LC3: { rates: [96, 160, 192], transport: "LE Audio / LE ISO" },
  LDAC: { rates: [330, 660, 990], transport: "A2DP / BR/EDR" }
};
type Codec = keyof typeof codecs;

export function BluetoothAudioLab({ language, onBack, onBackToDetails }: { language: Language; onBack: () => void; onBackToDetails?: () => void }) {
  const ja: Record<string, string> = {
    "文件 / App → PCM": "ファイル / App → PCM",
    "混音 → 编码": "ミックス → 符号化",
    "协议栈 → 发送队列": "プロトコルスタック → 送信キュー",
    "无线调度": "無線スケジューリング",
    "接收缓冲 → 解码 / PLC": "受信バッファ → デコード / PLC",
    "PCM → DAC → 功放 → 发声": "PCM → DAC → アンプ → 発音",
    "帧积累与处理": "フレーム蓄積と処理",
    "发送与调度": "送信とスケジューリング",
    "接收缓冲": "受信バッファ",
    "解码与播放": "デコードと再生",
    "应用场景": "アプリケーション",
    "蓝牙音频链路实验室": "Bluetooth オーディオ経路ラボ",
    "从手机到耳机：把压缩、无线传输和播放时限分开看。": "スマートフォンからヘッドホンまで：圧縮、無線伝送、再生期限を分けて見ます。",
    "蓝牙音频传输流程图": "Bluetooth オーディオ伝送フロー図",
    "一条完整播放链路": "完全な再生経路",
    "箭头表示信号顺序。音乐文件通常先解码为 PCM，再编码为协商的蓝牙格式；不会默认把 MP3 文件原封不动送进耳机。通话还增加反向麦克风上行链路。": "矢印は信号の順序を示します。音楽ファイルは通常 PCM にデコードしてから合意した Bluetooth 形式に再符号化し、MP3 をそのままヘッドセットへ送るわけではありません。通話ではマイクの上り経路も加わります。",
    "蓝牙音频实验台": "Bluetooth オーディオワークベンチ",
    "负载与播放时限": "ペイロードと再生期限",
    "教学模型：48 kHz、16 bit、双声道 PCM = 1536 kbps。码率为双声道总量的示例配置，不代表设备必定支持。这里不实际运行 Codec，也不以模拟图评定音质。": "教材モデル：48 kHz、16 bit、ステレオ PCM = 1536 kbps。ビットレートはステレオ合計の例で、デバイスの対応を保証しません。ここでは Codec を実行せず、シミュレーション図から音質も評価しません。",
    "编码器": "エンコーダ",
    "蓝牙编码器": "Bluetooth エンコーダ",
    "编码码率": "符号化ビットレート",
    "永久丢包率": "恒久パケット損失率",
    "最大额外到达延迟": "最大追加到着遅延",
    "接收缓冲等待": "受信バッファ待ち",
    "传输路径": "伝送経路",
    "每 10 ms 平均编码负载": "10 ms あたりの平均符号化ペイロード",
    "PCM / 码流比": "PCM / ビットストリーム比",
    "负载 = kbps × ms ÷ 8；未计协议头、重传和射频开销。10 ms 只是统计时间窗，不是所有 Codec 的帧长，也不是空口包大小。": "ペイロード = kbps × ms ÷ 8。ヘッダー、再送、無線オーバーヘッドは含みません。10 ms は統計窓であり、すべての Codec のフレーム長や無線パケット長ではありません。",
    "100 个传输单元的示意": "100 伝送単位の例",
    "增大缓冲可减少本模型的迟到单元，但永久丢包不会消失。PLC 估计缺失片段，不能恢复原始内容；连续丢包通常比同数量分散丢包更难掩盖。": "バッファを増やすとこのモデルの遅延単位は減りますが、恒久損失は消えません。PLC は欠落区間を推定するだけで元データを復元できず、連続損失は同数の分散損失より隠しにくい傾向があります。",
    "固定教学延迟预算（非设备实测）": "固定の教材用遅延予算（デバイスの実測値ではありません）",
    "20 + 10 + 10 ms 分别是帧积累与处理、发送与调度、解码与播放的固定教学假设；总延迟再加接收缓冲。切换 Codec 只改变本页的示例码率与传输路径标签，不改变这个教学预算；它不是 Codec 的算法延迟，也不是 HFP 或 LE Audio 设备的实测端到端延迟。视频可延后显示以同步，但游戏操作反馈无法靠延迟画面解决。": "20 + 10 + 10 ms はフレーム蓄積/処理、送信/スケジューリング、デコード/再生についての固定教材上の仮定で、受信バッファは別に加算します。Codec を切り替えても、このページの例示ビットレートと伝送経路ラベルだけが変わり、この教材上の予算は変わりません。Codec のアルゴリズム遅延でも、HFP/LE Audio デバイスの実測エンドツーエンド遅延でもありません。映像を遅らせて同期はできますが、ゲームの操作遅延は映像を遅らせても解決しません。",
    "协议与编码": "プロファイルと符号化",
    "路径": "経路",
    "用途": "用途",
    "需要区分": "区別する点",
    "经典蓝牙音乐：SBC、AAC、LDAC、aptX 系列": "クラシック Bluetooth 音楽：SBC、AAC、LDAC、aptX 系列",
    "SBC 为基础支持；其他格式需双方共同支持。": "SBC は基本対応で、他の形式は双方の対応が必要です。",
    "HFP 双向通话；HSP 为较早的耳机配置": "HFP は双方向通話、HSP は古いヘッドセットプロファイル",
    "CVSD、mSBC 等能力随版本和设备而异；不是 A2DP 音乐链路。": "CVSD、mSBC などの能力はバージョンとデバイスで異なり、A2DP の音楽経路ではありません。",
    "音乐、通话、助听、多流与广播": "音楽、通話、聴覚支援、マルチストリーム、ブロードキャスト",
    "LC3 有 7.5 / 10 ms 帧间隔；帧长不是端到端延迟。": "LC3 のフレーム間隔は 7.5 / 10 ms ですが、フレーム長はエンドツーエンド遅延ではありません。",
    "压缩原理参见音频编解码卡片。本页关注连接与产品体验；不能只按码率数字为不同 Codec 的音质排名。": "圧縮の原理は Audio Codecs カードを参照してください。このページは接続と製品体験に焦点を当て、ビットレートだけで Codec の音質を順位付けできません。",
    "实际设备场景": "実際のデバイスシナリオ",
    "音乐耳机 / 音箱": "音楽ヘッドホン / スピーカー",
    "先核对协商结果，再观察遮挡、干扰和自动降码率；高码率不是稳定性的保证。": "まずネゴシエーション結果を確認し、遮蔽、干渉、自動ビットレート低下を観察します。高ビットレートは安定性を保証しません。",
    "车载通话": "車載通話",
    "麦克风上行和通话下行同时工作；AEC、拾音和链路都影响清晰度。": "マイク上りと通話下りが同時に動き、AEC、収音、伝送経路がすべて明瞭度に影響します。",
    "游戏与视频": "ゲームと動画",
    "视频可做音画同步补偿；游戏要测从操作到声音的完整延迟。": "動画では音画同期を補償できますが、ゲームでは操作から音までの全遅延を測る必要があります。",
    "TWS 左右耳": "TWS 左右イヤホン",
    "共同播放时间、时钟漂移补偿和数据分发保证同步。经典 TWS 可用转发或双连接；LE Audio 提供多流机制。": "共通の再生時刻、クロックドリフト補正、データ配信で同期を保ちます。クラシック TWS はリレーまたはデュアル接続、LE Audio はマルチストリームを提供します。",
    "助听与公共广播": "聴覚支援と公共放送",
    "LE Audio 支持助听相关配置；Auracast 让多个兼容接收端收听同一节目。": "LE Audio は聴覚支援関連プロファイルに対応し、Auracast は複数の互換受信機で同じ番組を聴けるようにします。",
    "USB / Wi-Fi 对比": "USB / Wi-Fi 比較",
    "USB Audio 为有线音频接口；Wi-Fi 通常带宽更大，但同步与缓冲策略不同。技术名称不能单独决定音质或延迟。": "USB Audio は有線オーディオインターフェース、Wi-Fi は通常より広い帯域を持ちますが、同期とバッファ戦略が異なります。技術名だけで音質や遅延は決まりません。",
    "参考资料": "参考資料",
    "返回知识库": "ナレッジベースに戻る",
    "返回详细内容": "詳細コンテンツに戻る"
  };
  const ko: Record<string, string> = {
    "文件 / App → PCM": "파일 / App → PCM",
    "混音 → 编码": "믹싱 → 코딩",
    "协议栈 → 发送队列": "프로토콜 스택 → 송신 큐",
    "无线调度": "무선 스케줄링",
    "接收缓冲 → 解码 / PLC": "수신 버퍼 → 디코딩 / PLC",
    "PCM → DAC → 功放 → 发声": "PCM → DAC → 앰프 → 재생",
    "帧积累与处理": "프레임 누적 및 처리",
    "发送与调度": "송신 및 스케줄링",
    "接收缓冲": "수신 버퍼",
    "解码与播放": "디코딩 및 재생",
    "应用场景": "응용 분야",
    "蓝牙音频链路实验室": "Bluetooth 오디오 경로 실험실",
    "从手机到耳机：把压缩、无线传输和播放时限分开看。": "휴대폰에서 헤드폰까지: 압축·무선 전송·재생 기한을 나눠 봅니다.",
    "蓝牙音频传输流程图": "Bluetooth 오디오 전송 흐름도",
    "一条完整播放链路": "완전한 재생 경로",
    "箭头表示信号顺序。音乐文件通常先解码为 PCM，再编码为协商的蓝牙格式；不会默认把 MP3 文件原封不动送进耳机。通话还增加反向麦克风上行链路。": "화살표는 신호 순서를 나타냅니다. 음악 파일은 보통 PCM으로 디코딩한 뒤 협상된 Bluetooth 형식으로 다시 코딩하며 MP3 파일을 그대로 헤드셋에 보내지 않습니다. 통화에는 마이크 업링크가 추가됩니다.",
    "蓝牙音频实验台": "Bluetooth 오디오 워크벤치",
    "负载与播放时限": "페이로드와 재생 기한",
    "教学模型：48 kHz、16 bit、双声道 PCM = 1536 kbps。码率为双声道总量的示例配置，不代表设备必定支持。这里不实际运行 Codec，也不以模拟图评定音质。": "교육 모델: 48 kHz, 16 bit, 스테레오 PCM = 1536 kbps. 비트레이트는 스테레오 합계의 예시이며 기기 지원을 보장하지 않습니다. 여기서는 Codec을 실제 실행하지 않고 시뮬레이션으로 음질을 판단하지 않습니다.",
    "编码器": "인코더",
    "蓝牙编码器": "Bluetooth 인코더",
    "编码码率": "코딩 비트레이트",
    "永久丢包率": "영구 패킷 손실률",
    "最大额外到达延迟": "최대 추가 도착 지연",
    "接收缓冲等待": "수신 버퍼 대기",
    "传输路径": "전송 경로",
    "每 10 ms 平均编码负载": "10 ms당 평균 코딩 페이로드",
    "PCM / 码流比": "PCM / 비트스트림 비율",
    "负载 = kbps × ms ÷ 8；未计协议头、重传和射频开销。10 ms 只是统计时间窗，不是所有 Codec 的帧长，也不是空口包大小。": "페이로드 = kbps × ms ÷ 8이며 헤더·재전송·무선 오버헤드는 제외합니다. 10 ms는 통계 창일 뿐 모든 Codec의 프레임 길이나 무선 패킷 크기가 아닙니다.",
    "100 个传输单元的示意": "전송 단위 100개의 예시",
    "增大缓冲可减少本模型的迟到单元，但永久丢包不会消失。PLC 估计缺失片段，不能恢复原始内容；连续丢包通常比同数量分散丢包更难掩盖。": "버퍼를 늘리면 이 모델의 지연 단위를 줄일 수 있지만 영구 손실은 사라지지 않습니다. PLC는 누락 구간을 추정할 뿐 원본을 복원할 수 없고 연속 손실은 같은 수의 분산 손실보다 보통 숨기기 어렵습니다.",
    "固定教学延迟预算（非设备实测）": "고정된 교육용 지연 예산(기기 실측값 아님)",
    "20 + 10 + 10 ms 分别是帧积累与处理、发送与调度、解码与播放的固定教学假设；总延迟再加接收缓冲。切换 Codec 只改变本页的示例码率与传输路径标签，不改变这个教学预算；它不是 Codec 的算法延迟，也不是 HFP 或 LE Audio 设备的实测端到端延迟。视频可延后显示以同步，但游戏操作反馈无法靠延迟画面解决。": "20 + 10 + 10ms는 프레임 누적/처리, 송신/스케줄링, 디코딩/재생에 대한 고정 교육 가정이며, 수신 버퍼는 별도로 더합니다. Codec을 바꿔도 이 페이지의 예시 비트레이트와 전송 경로 라벨만 바뀌고 이 교육용 예산은 바뀌지 않습니다. Codec의 알고리즘 지연도 HFP 또는 LE Audio 기기의 실측 엔드투엔드 지연도 아닙니다. 영상은 늦춰 동기화할 수 있지만 게임 조작 지연은 화면을 늦추는 것으로 해결되지 않습니다.",
    "协议与编码": "프로파일과 코딩",
    "路径": "경로",
    "用途": "용도",
    "需要区分": "구분할 점",
    "经典蓝牙音乐：SBC、AAC、LDAC、aptX 系列": "클래식 Bluetooth 음악: SBC, AAC, LDAC, aptX 계열",
    "SBC 为基础支持；其他格式需双方共同支持。": "SBC는 기본 지원이며 다른 형식은 양쪽 모두 지원해야 합니다.",
    "HFP 双向通话；HSP 为较早的耳机配置": "HFP는 양방향 통화, HSP는 이전 헤드셋 프로파일",
    "CVSD、mSBC 等能力随版本和设备而异；不是 A2DP 音乐链路。": "CVSD·mSBC 등의 기능은 버전과 기기에 따라 다르며 A2DP 음악 경로가 아닙니다.",
    "音乐、通话、助听、多流与广播": "음악·통화·청각 보조·다중 스트림·방송",
    "LC3 有 7.5 / 10 ms 帧间隔；帧长不是端到端延迟。": "LC3는 7.5 / 10 ms 프레임 간격을 사용하지만 프레임 길이가 엔드투엔드 지연은 아닙니다.",
    "压缩原理参见音频编解码卡片。本页关注连接与产品体验；不能只按码率数字为不同 Codec 的音质排名。": "압축 원리는 오디오 코덱 카드를 참조하세요. 이 페이지는 연결과 제품 경험에 초점을 두며 비트레이트만으로 Codec 음질을 순위화할 수 없습니다.",
    "实际设备场景": "실제 기기 시나리오",
    "音乐耳机 / 音箱": "음악 헤드폰 / 스피커",
    "先核对协商结果，再观察遮挡、干扰和自动降码率；高码率不是稳定性的保证。": "먼저 협상 결과를 확인하고 차폐·간섭·자동 비트레이트 감소를 관찰하세요. 높은 비트레이트가 안정성을 보장하지는 않습니다.",
    "车载通话": "차량 통화",
    "麦克风上行和通话下行同时工作；AEC、拾音和链路都影响清晰度。": "마이크 업링크와 통화 다운링크가 동시에 동작하며 AEC·수음·전송 경로가 모두 선명도에 영향을 줍니다.",
    "游戏与视频": "게임과 영상",
    "视频可做音画同步补偿；游戏要测从操作到声音的完整延迟。": "영상은 음향-영상 동기를 보정할 수 있지만 게임은 조작부터 소리까지 전체 지연을 측정해야 합니다.",
    "TWS 左右耳": "TWS 좌우 이어버드",
    "共同播放时间、时钟漂移补偿和数据分发保证同步。经典 TWS 可用转发或双连接；LE Audio 提供多流机制。": "공통 재생 시각·클록 드리프트 보정·데이터 분배로 동기를 유지합니다. 클래식 TWS는 릴레이 또는 이중 연결을 사용할 수 있고 LE Audio는 다중 스트림을 제공합니다.",
    "助听与公共广播": "청각 보조와 공공 방송",
    "LE Audio 支持助听相关配置；Auracast 让多个兼容接收端收听同一节目。": "LE Audio는 청각 보조 관련 프로파일을 지원하고 Auracast는 여러 호환 수신기가 같은 프로그램을 듣게 합니다.",
    "USB / Wi-Fi 对比": "USB / Wi-Fi 비교",
    "USB Audio 为有线音频接口；Wi-Fi 通常带宽更大，但同步与缓冲策略不同。技术名称不能单独决定音质或延迟。": "USB Audio는 유선 오디오 인터페이스이고 Wi-Fi는 보통 더 넓은 대역폭을 제공하지만 동기화·버퍼 전략이 다릅니다. 기술 이름만으로 음질이나 지연을 결정할 수 없습니다.",
    "参考资料": "참고 자료",
    "返回知识库": "지식 베이스로 돌아가기",
    "返回详细内容": "상세 내용으로 돌아가기"
  };
  const text = (cn: string, en: string, jaText?: string, koText?: string) => language === "zh-Hant" ? traditional(cn) : language === "zh" ? cn : language === "en" ? en : language === "ja" ? jaText ?? ja[cn] : koText ?? ko[cn];
  const [codec, setCodec] = useLabState<Codec>(
    "BluetoothAudioLab.codec",
    "LC3",
    (value): value is Codec => value === "SBC" || value === "AAC" || value === "LC3" || value === "LDAC"
  );
  const [rate, setRate] = useLabState<number>(
    "BluetoothAudioLab.rate",
    () => codecs[codec].rates[1],
    (value): value is number => typeof value === "number" && Number.isFinite(value) && codecs[codec].rates.includes(value)
  );
  const [loss, setLoss] = useLabState(
    "BluetoothAudioLab.loss",
    5,
    (value): value is number => typeof value === "number" && Number.isFinite(value) && Number.isInteger(value) && value >= 0 && value <= 20
  );
  const [buffer, setBuffer] = useLabState(
    "BluetoothAudioLab.buffer",
    40,
    (value): value is number => typeof value === "number" && Number.isFinite(value) && Number.isInteger(value) && value >= 10 && value <= 160 && (value - 10) % 10 === 0
  );
  const [jitter, setJitter] = useLabState(
    "BluetoothAudioLab.jitter",
    30,
    (value): value is number => typeof value === "number" && Number.isFinite(value) && Number.isInteger(value) && value >= 0 && value <= 120 && value % 10 === 0
  );
  // Fixed teaching trace: permanent loss and missed playout deadlines are separate.
  const packets = Array.from({ length: 100 }, (_, i) => {
    const lost = (i * 37 + 17) % 100 < loss;
    const late = jitter * ((i * 29 + 11) % 100) / 99 > buffer;
    return lost ? "lost" : late ? "late" : "ready";
  });
  const lostCount = packets.filter((p) => p === "lost").length;
  const lateCount = packets.filter((p) => p === "late").length;
  const stages = [
    text("文件 / App → PCM", "File / app → PCM"),
    `${text("混音 → 编码", "Mix → encode")} (${codec})`,
    text("协议栈 → 发送队列", "Stack → TX queue"),
    `${text("无线调度", "Radio scheduling")} · ${codecs[codec].transport}`,
    text("接收缓冲 → 解码 / PLC", "RX buffer → decode / PLC"),
    text("PCM → DAC → 功放 → 发声", "PCM → DAC → amp → sound")
  ];
  const delays = [
    { label: text("帧积累与处理", "Framing & processing"), ms: 20 },
    { label: text("发送与调度", "TX & scheduling"), ms: 10 },
    { label: text("接收缓冲", "RX buffering"), ms: buffer },
    { label: text("解码与播放", "Decode & playout"), ms: 10 }
  ];

  return <main className="bluetooth-lab-page">
    <section className="sound-lab-hero">
      <div className="sound-lab-back-actions">
          <button className="sound-lab-back sound-lab-back-secondary" type="button" onClick={onBack}>
            {text("返回知识库", "Back to knowledge base")}
          </button>
          {onBackToDetails && <button className="sound-lab-back" type="button" onClick={onBackToDetails}>
            <ArrowLeft size={18} aria-hidden="true" />
            {text("返回详细内容", "Back to detailed content")}
          </button>}
        </div>
      <div><span className="section-kicker">{text("应用场景", "Applications")}</span><h1>{text("蓝牙音频链路实验室", "Bluetooth Audio Link Lab")}</h1><p>{text("从手机到耳机：把压缩、无线传输和播放时限分开看。", "From phone to headphones: separate compression, radio transport, and playout deadlines.")}</p></div>
    </section>
    <section className="bluetooth-section" aria-label={text("蓝牙音频传输流程图", "Bluetooth audio transport flow diagram")}>
      <div className="bluetooth-endpoints" aria-hidden="true"><Smartphone size={38} /><span>PCM</span><Radio size={38} /><span>{codec}</span><Headphones size={38} /><Speaker size={30} /></div>
      <h2>{text("一条完整播放链路", "The playback chain")}</h2>
      <ol className="bluetooth-flow">{stages.map((label, i) => <li key={i}><small>{String(i + 1).padStart(2, "0")}</small><span>{label}</span></li>)}</ol>
      <p>{text("箭头表示信号顺序。音乐文件通常先解码为 PCM，再编码为协商的蓝牙格式；不会默认把 MP3 文件原封不动送进耳机。通话还增加反向麦克风上行链路。", "Arrows show signal order. Music is normally decoded to PCM and re-encoded into the negotiated Bluetooth format, rather than passing an MP3 file unchanged to the headset. Calls add a reverse microphone uplink.")}</p>
    </section>
    <section className="bluetooth-section" aria-label={text("蓝牙音频实验台", "Bluetooth audio workbench")}>
      <h2>{text("负载与播放时限", "Payload and playout deadlines")}</h2>
      <p>{text("教学模型：48 kHz、16 bit、双声道 PCM = 1536 kbps。码率为双声道总量的示例配置，不代表设备必定支持。这里不实际运行 Codec，也不以模拟图评定音质。", "Teaching model: 48 kHz, 16-bit stereo PCM = 1536 kbps. Rates are example stereo totals, not guaranteed device capabilities. This lab does not execute codecs or infer audio quality from a simulated plot.")}</p>
      <div className="bluetooth-controls">
        <label>{text("编码器", "Codec")}<select aria-label={text("蓝牙编码器", "Bluetooth codec")} value={codec} onChange={(e) => { const next = e.target.value as Codec; setCodec(next); setRate(codecs[next].rates[1]); }}>{Object.keys(codecs).map((c) => <option key={c}>{c}</option>)}</select></label>
        <label>{text("编码码率", "Encoded bitrate")}<select aria-label={text("编码码率", "Encoded bitrate")} value={rate} onChange={(e) => setRate(Number(e.target.value))}>{codecs[codec].rates.map((r) => <option key={r} value={r}>{r} kbps</option>)}</select></label>
        <label><span>{text("永久丢包率", "Permanent loss")} <strong>{loss}%</strong></span><input aria-label={text("永久丢包率", "Permanent loss")} type="range" min="0" max="20" step="1" value={loss} onChange={(e) => setLoss(Number(e.target.value))} /></label>
        <label><span>{text("最大额外到达延迟", "Maximum extra arrival delay")} <strong>{jitter} ms</strong></span><input aria-label={text("最大额外到达延迟", "Maximum extra arrival delay")} type="range" min="0" max="120" step="10" value={jitter} onChange={(e) => setJitter(Number(e.target.value))} /></label>
        <label><span>{text("接收缓冲等待", "RX buffer wait")} <strong>{buffer} ms</strong></span><input aria-label={text("接收缓冲等待", "RX buffer wait")} type="range" min="10" max="160" step="10" value={buffer} onChange={(e) => setBuffer(Number(e.target.value))} /></label>
      </div>
      <dl className="bluetooth-results">
        <div><dt>{text("传输路径", "Transport")}</dt><dd>{codecs[codec].transport}</dd></div>
        <div><dt>{text("每 10 ms 平均编码负载", "Mean encoded payload per 10 ms")}</dt><dd data-testid="bluetooth-payload">{(rate * 10 / 8).toFixed(1)} B</dd></div>
        <div><dt>{text("PCM / 码流比", "PCM / encoded ratio")}</dt><dd>{(1536 / rate).toFixed(2)} : 1</dd></div>
      </dl>
      <p>{text("负载 = kbps × ms ÷ 8；未计协议头、重传和射频开销。10 ms 只是统计时间窗，不是所有 Codec 的帧长，也不是空口包大小。", "Payload = kbps × ms ÷ 8, excluding headers, retransmissions, and radio overhead. The 10 ms accounting window is not every codec's frame size or an on-air packet size.")}</p>
      <h3>{text("100 个传输单元的示意", "A 100-unit transport trace")}</h3>
      <div className="bluetooth-packets" role="img" aria-label={text(`按时 ${100 - lostCount - lateCount}，迟到 ${lateCount}，丢失 ${lostCount}`, `On time ${100 - lostCount - lateCount}, late ${lateCount}, lost ${lostCount}`, `定刻 ${100 - lostCount - lateCount}、遅延 ${lateCount}、損失 ${lostCount}`, `정시 ${100 - lostCount - lateCount}, 지연 ${lateCount}, 손실 ${lostCount}`)}>{packets.map((state, i) => <span key={i} className={state} aria-hidden="true">{state === "lost" ? "×" : state === "late" ? "!" : "·"}</span>)}</div>
      <p data-testid="bluetooth-packet-summary">{text(`绿色：按时 ${100 - lostCount - lateCount}；黄色 !：迟到 ${lateCount}；红色 ×：永久丢失 ${lostCount}。`, `Green: on time ${100 - lostCount - lateCount}; yellow !: late ${lateCount}; red ×: permanently lost ${lostCount}.`, `緑：定刻 ${100 - lostCount - lateCount}。黄 !：遅延 ${lateCount}。赤 ×：恒久損失 ${lostCount}。`, `초록: 정시 ${100 - lostCount - lateCount}; 노랑 !: 지연 ${lateCount}; 빨강 ×: 영구 손실 ${lostCount}.`)}</p>
      <p>{text("增大缓冲可减少本模型的迟到单元，但永久丢包不会消失。PLC 估计缺失片段，不能恢复原始内容；连续丢包通常比同数量分散丢包更难掩盖。", "Larger buffers reduce late units in this model but cannot remove permanent losses. PLC estimates missing segments without recovering the original content; bursts are usually harder to conceal than scattered losses.")}</p>
      <h3>{text("固定教学延迟预算（非设备实测）", "Fixed teaching latency budget (not a device measurement)")} <output data-testid="bluetooth-latency">{40 + buffer} ms</output></h3>
      <div className="bluetooth-delay" aria-hidden="true">{delays.map((part, i) => <span key={part.label} className={`part-${i}`} style={{ flex: part.ms }} />)}</div>
      <ul className="bluetooth-delay-labels">{delays.map((part) => <li key={part.label}>{part.label}: {part.ms} ms</li>)}</ul>
      <p>{text("20 + 10 + 10 ms 分别是帧积累与处理、发送与调度、解码与播放的固定教学假设；总延迟再加接收缓冲。切换 Codec 只改变本页的示例码率与传输路径标签，不改变这个教学预算；它不是 Codec 的算法延迟，也不是 HFP 或 LE Audio 设备的实测端到端延迟。视频可延后显示以同步，但游戏操作反馈无法靠延迟画面解决。", "The 20 + 10 + 10 ms components are fixed teaching assumptions for framing/processing, TX/scheduling, and decode/playout; RX buffering is added separately. Switching codecs changes only this page's example bitrate and transport label, not this teaching budget; it is neither a codec's algorithmic delay nor a measured end-to-end latency for an HFP or LE Audio device. Delaying video can synchronize playback but does not solve gaming input lag.")}</p>
    </section>
    <section className="bluetooth-section"><h2>{text("协议与编码", "Profiles and coding")}</h2><div className="bluetooth-table-wrap"><table><thead><tr><th>{text("路径", "Path")}</th><th>{text("用途", "Use")}</th><th>{text("需要区分", "Key distinction")}</th></tr></thead><tbody>
      <tr><th>A2DP</th><td>{text("经典蓝牙音乐：SBC、AAC、LDAC、aptX 系列", "Classic music: SBC, AAC, LDAC, aptX family")}</td><td>{text("SBC 为基础支持；其他格式需双方共同支持。", "SBC is the baseline; optional codecs require support at both ends.")}</td></tr>
      <tr><th>HFP / HSP</th><td>{text("HFP 双向通话；HSP 为较早的耳机配置", "HFP for duplex calls; HSP is an older headset profile")}</td><td>{text("CVSD、mSBC 等能力随版本和设备而异；不是 A2DP 音乐链路。", "Codec capabilities such as CVSD and mSBC depend on version and device; this is not the A2DP music path.")}</td></tr>
      <tr><th>LE Audio / LC3</th><td>{text("音乐、通话、助听、多流与广播", "Music, calls, hearing assistance, multistream, broadcast")}</td><td>{text("LC3 有 7.5 / 10 ms 帧间隔；帧长不是端到端延迟。", "LC3 has 7.5 / 10 ms frame intervals; frame duration is not end-to-end latency.")}</td></tr>
    </tbody></table></div><p>{text("压缩原理参见音频编解码卡片。本页关注连接与产品体验；不能只按码率数字为不同 Codec 的音质排名。", "See Audio Codecs for compression internals. This page focuses on connections and product behavior; bitrate alone cannot rank codec quality.")}</p></section>
    <section className="bluetooth-section"><h2>{text("实际设备场景", "Practical scenarios")}</h2><div className="bluetooth-knowledge-grid">
      {[
        [text("音乐耳机 / 音箱", "Music headphones / speakers"), text("先核对协商结果，再观察遮挡、干扰和自动降码率；高码率不是稳定性的保证。", "Check negotiation, obstructions, interference, and adaptive bitrate; high bitrate does not guarantee stability.")],
        [text("车载通话", "Car calls"), text("麦克风上行和通话下行同时工作；AEC、拾音和链路都影响清晰度。", "Microphone uplink and call downlink work together. AEC, capture, and transport all affect clarity.")],
        [text("游戏与视频", "Gaming and video"), text("视频可做音画同步补偿；游戏要测从操作到声音的完整延迟。", "Video can compensate AV timing; games need full action-to-sound latency measured.")],
        [text("TWS 左右耳", "TWS earbuds"), text("共同播放时间、时钟漂移补偿和数据分发保证同步。经典 TWS 可用转发或双连接；LE Audio 提供多流机制。", "Shared playout time, drift correction, and distribution maintain sync. Classic TWS may relay or use dual links; LE Audio provides multistream mechanisms.")],
        [text("助听与公共广播", "Hearing assistance and broadcast"), text("LE Audio 支持助听相关配置；Auracast 让多个兼容接收端收听同一节目。", "LE Audio supports hearing-related profiles; Auracast lets compatible receivers join a shared broadcast.")],
        [text("USB / Wi-Fi 对比", "USB / Wi-Fi comparison"), text("USB Audio 为有线音频接口；Wi-Fi 通常带宽更大，但同步与缓冲策略不同。技术名称不能单独决定音质或延迟。", "USB Audio is wired; Wi-Fi generally offers more bandwidth but uses different sync and buffering. Transport names alone do not determine quality or delay.")]
      ].map(([title, body]) => <article key={title}><h3>{title}</h3><p>{body}</p></article>)}</div></section>
    <section className="bluetooth-section"><h2>{text("参考资料", "References")}</h2><p><a href="https://www.bluetooth.com/learn-about-bluetooth/feature-enhancements/le-audio/">Bluetooth SIG: LE Audio</a> · <a href="https://www.bluetooth.com/blog/a-technical-overview-of-lc3/">LC3 technical overview</a> · <a href="https://www.bluetooth.com/wp-content/uploads/2023/07/LC3Characterization_WP.pdf">LC3 performance characterization</a></p></section>
  </main>;
}
