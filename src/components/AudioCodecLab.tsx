import { traditional } from "../content/traditional";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";

import type { Language, LocalizedText } from "../content/knowledge";

type AudioCodecLabProps = {
  language: Language;
  onBack: () => void;
  onBackToDetails?: () => void;
};

type ScenarioId = "music" | "video" | "speech" | "meeting" | "bluetooth" | "lowLatency";

const encodeSteps = [
  { title: { zh: "PCM 输入", "zh-Hant": traditional("PCM 输入"), en: "PCM input", ja: "PCM 入力", ko: "PCM 입력" }, detail: { zh: "系统或文件中的原始样本", "zh-Hant": traditional("系统或文件中的原始样本"), en: "raw samples from system or file", ja: "システムまたはファイルからの生サンプル", ko: "시스템 또는 파일의 원시 샘플" } },
  { title: { zh: "分帧", "zh-Hant": traditional("分帧"), en: "Framing", ja: "フレーム化", ko: "프레이밍" }, detail: { zh: "按固定时长切块", "zh-Hant": traditional("按固定时长切块"), en: "split into time blocks", ja: "固定時間のブロックに分割", ko: "고정된 시간 블록으로 나누기" } },
  { title: { zh: "分析 / 建模", "zh-Hant": traditional("分析 / 建模"), en: "Analysis / model", ja: "解析 / モデル", ko: "분석 / 모델" }, detail: { zh: "预测、频域或听觉模型", "zh-Hant": traditional("预测、频域或听觉模型"), en: "prediction, transform, or hearing model", ja: "予測、変換、または聴覚モデル", ko: "예측, 변환 또는 청각 모델" } },
  { title: { zh: "量化 / 码率控制", "zh-Hant": traditional("量化 / 码率控制"), en: "Quantize / rate control", ja: "量子化 / レート制御", ko: "양자화 / 비트레이트 제어" }, detail: { zh: "按目标质量分配比特", "zh-Hant": traditional("按目标质量分配比特"), en: "allocate bits for target quality", ja: "目標の品質に応じてビットを配分", ko: "목표 품질에 맞춰 비트 배분" } },
  { title: { zh: "码流 / 封装", "zh-Hant": traditional("码流 / 封装"), en: "Bitstream / package", ja: "ビットストリーム / パッケージ", ko: "비트스트림 / 패키지" }, detail: { zh: "写入文件或网络包", "zh-Hant": traditional("写入文件或网络包"), en: "write file or network packets", ja: "ファイルまたはネットワークパケットに書き込む", ko: "파일 또는 네트워크 패킷에 기록" } }
] satisfies Array<{ title: LocalizedText; detail: LocalizedText }>;

const decodeSteps = [
  { title: { zh: "码流 / 文件 / 网络包", "zh-Hant": traditional("码流 / 文件 / 网络包"), en: "Bitstream / file / packet", ja: "ビットストリーム / ファイル / パケット", ko: "비트스트림 / 파일 / 패킷" }, detail: { zh: "来自存储、流媒体或蓝牙", "zh-Hant": traditional("来自存储、流媒体或蓝牙"), en: "from storage, streaming, or Bluetooth", ja: "ストレージ、ストリーミング、Bluetooth から", ko: "저장소, 스트리밍 또는 Bluetooth에서" } },
  { title: { zh: "解包 / 解析", "zh-Hant": traditional("解包 / 解析"), en: "Unpack / parse", ja: "アンパック / 解析", ko: "언패킹 / 파싱" }, detail: { zh: "取出编码帧与时间戳", "zh-Hant": traditional("取出编码帧与时间戳"), en: "extract frames and timestamps", ja: "符号化フレームとタイムスタンプを取り出す", ko: "인코딩 프레임과 타임스탬프를 추출" } },
  { title: { zh: "反量化 / 合成", "zh-Hant": traditional("反量化 / 合成"), en: "Inverse quantize / synthesize", ja: "逆量子化 / 合成", ko: "역양자화 / 합성" }, detail: { zh: "还原频域或语音模型参数", "zh-Hant": traditional("还原频域或语音模型参数"), en: "restore transform or speech parameters", ja: "変換または音声モデルのパラメータを復元", ko: "변환 또는 음성 모델 파라미터 복원" } },
  { title: { zh: "PCM 输出", "zh-Hant": traditional("PCM 输出"), en: "PCM output", ja: "PCM 出力", ko: "PCM 출력" }, detail: { zh: "恢复为系统可播放样本", "zh-Hant": traditional("恢复为系统可播放样本"), en: "samples ready for the system", ja: "システムで再生できるサンプルに戻す", ko: "시스템에서 재생할 수 있는 샘플로 복원" } },
  { title: { zh: "播放 / 后处理", "zh-Hant": traditional("播放 / 后处理"), en: "Playback / post-process", ja: "再生 / 後処理", ko: "재생 / 후처리" }, detail: { zh: "混音、音效、DAC 或蓝牙输出", "zh-Hant": traditional("混音、音效、DAC 或蓝牙输出"), en: "mix, effects, DAC, or Bluetooth out", ja: "ミックス、エフェクト、DAC、Bluetooth 出力", ko: "믹싱, 효과, DAC 또는 Bluetooth 출력" } }
] satisfies Array<{ title: LocalizedText; detail: LocalizedText }>;

const scenarios = {
  music: {
    label: { zh: "音乐存储", "zh-Hant": traditional("音乐存储"), en: "Music storage", ja: "音楽ストレージ", ko: "음악 저장" },
    summary: { zh: "音乐存储：优先考虑音质、文件大小和长期兼容。", "zh-Hant": traditional("音乐存储：优先考虑音质、文件大小和长期兼容。"), en: "Music storage: prioritize quality, file size, and long-term compatibility.", ja: "音楽ストレージ：音質、ファイルサイズ、長期的な互換性を優先する。", ko: "음악 저장: 음질, 파일 크기, 장기 호환성을 우선한다." },
    recommendation: { zh: "推荐：FLAC / AAC / MP3", "zh-Hant": traditional("推荐：FLAC / AAC / MP3"), en: "Recommended: FLAC / AAC / MP3", ja: "推奨：FLAC / AAC / MP3", ko: "권장: FLAC / AAC / MP3" },
    metrics: [
      { zh: "无损归档选 FLAC；日常分发常用 AAC 或 MP3。", "zh-Hant": traditional("无损归档选 FLAC；日常分发常用 AAC 或 MP3。"), en: "Use FLAC for lossless archive; AAC or MP3 for everyday delivery.", ja: "可逆アーカイブには FLAC、日常の配布には AAC または MP3 を使う。", ko: "무손실 보관에는 FLAC, 일상 배포에는 AAC 또는 MP3를 사용한다." },
      { zh: "码率越高不一定线性提升听感，内容和编码器实现同样重要。", "zh-Hant": traditional("码率越高不一定线性提升听感，内容和编码器实现同样重要。"), en: "Higher bitrate does not linearly improve listening quality; content and encoder quality matter.", ja: "ビットレートを上げても聴感が直線的に向上するわけではなく、素材とエンコーダーの品質も同じくらい重要。", ko: "비트레이트가 높아져도 청취 품질이 선형적으로 좋아지는 것은 아니며 콘텐츠와 인코더 품질도 중요하다." }
    ]
  },
  video: {
    label: { zh: "在线视频", "zh-Hant": traditional("在线视频"), en: "Online video", ja: "オンライン動画", ko: "온라인 동영상" },
    summary: { zh: "在线视频：关注音画同步、平台兼容和自适应码率。", "zh-Hant": traditional("在线视频：关注音画同步、平台兼容和自适应码率。"), en: "Online video: focus on AV sync, platform support, and adaptive bitrate.", ja: "オンライン動画：AV 同期、プラットフォーム対応、適応ビットレートを重視する。", ko: "온라인 동영상: AV 동기화, 플랫폼 지원, 적응형 비트레이트를 중시한다." },
    recommendation: { zh: "推荐：AAC / Opus", "zh-Hant": traditional("推荐：AAC / Opus"), en: "Recommended: AAC / Opus", ja: "推奨：AAC / Opus", ko: "권장: AAC / Opus" },
    metrics: [
      { zh: "容器、时间戳和播放器缓冲会影响音画同步。", "zh-Hant": traditional("容器、时间戳和播放器缓冲会影响音画同步。"), en: "Container timestamps and player buffering affect AV sync.", ja: "コンテナのタイムスタンプとプレーヤーのバッファリングが AV 同期に影響する。", ko: "컨테이너 타임스탬프와 플레이어 버퍼링이 AV 동기화에 영향을 준다." },
      { zh: "直播更看重端到端延迟，点播更看重质量和兼容性。", "zh-Hant": traditional("直播更看重端到端延迟，点播更看重质量和兼容性。"), en: "Live streaming values latency; on-demand values quality and compatibility.", ja: "ライブ配信は遅延、オンデマンド配信は品質と互換性を重視する。", ko: "라이브 스트리밍은 지연을, 주문형 재생은 품질과 호환성을 중시한다." }
    ]
  },
  speech: {
    label: { zh: "语音通话", "zh-Hant": traditional("语音通话"), en: "Voice call", ja: "音声通話", ko: "음성 통화" },
    summary: { zh: "语音通话：清晰度、抗丢包和低码率更关键。", "zh-Hant": traditional("语音通话：清晰度、抗丢包和低码率更关键。"), en: "Voice call: intelligibility, packet-loss robustness, and low bitrate matter most.", ja: "音声通話：聞き取りやすさ、パケット損失への強さ、低ビットレートが重要。", ko: "음성 통화: 명료도, 패킷 손실 내성, 낮은 비트레이트가 가장 중요하다." },
    recommendation: { zh: "推荐：Opus / AMR / LC3", "zh-Hant": traditional("推荐：Opus / AMR / LC3"), en: "Recommended: Opus / AMR / LC3", ja: "推奨：Opus / AMR / LC3", ko: "권장: Opus / AMR / LC3" },
    metrics: [
      { zh: "按链路选择：Opus 用于互联网语音，AMR 用于蜂窝语音，LC3 用于 LE Audio 耳机段；不是同一链路的任意替代品。", "zh-Hant": traditional("按链路选择：Opus 用于互联网语音，AMR 用于蜂窝语音，LC3 用于 LE Audio 耳机段；不是同一链路的任意替代品。"), en: "Choose by link: Opus for Internet voice, AMR for cellular voice, LC3 for the LE Audio headset segment; these are not interchangeable on every link.", ja: "リンクに応じて選ぶ：インターネット音声には Opus、携帯音声には AMR、LE Audio のイヤホン区間には LC3。どのリンクでも相互交換できるわけではない。", ko: "링크에 따라 선택한다: 인터넷 음성에는 Opus, 이동통신 음성에는 AMR, LE Audio 헤드셋 구간에는 LC3를 쓴다. 모든 링크에서 서로 대체할 수 있는 것은 아니다." },
      { zh: "网络抖动、丢包隐藏和回声处理常比纯码率更影响体验。", "zh-Hant": traditional("网络抖动、丢包隐藏和回声处理常比纯码率更影响体验。"), en: "Jitter, packet-loss concealment, and echo handling often matter more than bitrate alone.", ja: "ジッター、パケット損失隠蔽、エコー処理は、純粋なビットレート以上に体験を左右することが多い。", ko: "지터, 패킷 손실 은닉, 에코 처리는 순수한 비트레이트보다 경험에 더 큰 영향을 주는 경우가 많다." }
    ]
  },
  meeting: {
    label: { zh: "会议", "zh-Hant": traditional("会议"), en: "Meeting", ja: "会議", ko: "회의" },
    summary: { zh: "会议：要在多人语音、弱网和设备切换中保持稳定。", "zh-Hant": traditional("会议：要在多人语音、弱网和设备切换中保持稳定。"), en: "Meeting: stay stable across multi-speaker voice, weak networks, and device changes.", ja: "会議：複数人の音声、弱いネットワーク、機器の切り替えにまたがって安定させる。", ko: "회의: 여러 사람의 음성, 약한 네트워크, 기기 전환 속에서도 안정적으로 유지해야 한다." },
    recommendation: { zh: "互联网链路：Opus；LE Audio 耳机段：LC3", "zh-Hant": traditional("互联网链路：Opus；LE Audio 耳机段：LC3"), en: "Internet link: Opus; LE Audio headset segment: LC3", ja: "インターネット回線：Opus、LE Audio のイヤホン区間：LC3", ko: "인터넷 링크: Opus, LE Audio 헤드셋 구간: LC3" },
    metrics: [
      { zh: "会议链路通常还会叠加降噪、回声消除、自动增益和混音。", "zh-Hant": traditional("会议链路通常还会叠加降噪、回声消除、自动增益和混音。"), en: "Meeting paths usually add noise suppression, echo cancellation, AGC, and mixing.", ja: "会議経路には通常、ノイズ抑制、エコーキャンセル、AGC、ミキシングも重なる。", ko: "회의 경로에는 보통 잡음 억제, 에코 제거, AGC, 믹싱도 추가된다." },
      { zh: "可变码率和抗丢包能力比极高保真更重要。", "zh-Hant": traditional("可变码率和抗丢包能力比极高保真更重要。"), en: "Variable bitrate and packet-loss resilience matter more than maximum fidelity.", ja: "可変ビットレートとパケット損失への耐性は、最大限の忠実度より重要。", ko: "가변 비트레이트와 패킷 손실 내성은 최대 충실도보다 중요하다." }
    ]
  },
  bluetooth: {
    label: { zh: "蓝牙耳机", "zh-Hant": traditional("蓝牙耳机"), en: "Bluetooth headset", ja: "Bluetooth イヤホン", ko: "블루투스 헤드셋" },
    summary: { zh: "蓝牙耳机：无线稳定性、功耗、延迟和设备兼容一起决定体验。", "zh-Hant": traditional("蓝牙耳机：无线稳定性、功耗、延迟和设备兼容一起决定体验。"), en: "Bluetooth headset: radio stability, power, latency, and compatibility decide the experience.", ja: "Bluetooth イヤホン：無線の安定性、消費電力、遅延、機器互換性が体験を左右する。", ko: "블루투스 헤드셋: 무선 안정성, 전력 소모, 지연, 기기 호환성이 함께 경험을 좌우한다." },
    recommendation: { zh: "推荐：SBC / AAC / aptX / LDAC / LC3", "zh-Hant": traditional("推荐：SBC / AAC / aptX / LDAC / LC3"), en: "Recommended: SBC / AAC / aptX / LDAC / LC3", ja: "推奨：SBC / AAC / aptX / LDAC / LC3", ko: "권장: SBC / AAC / aptX / LDAC / LC3" },
    metrics: [
      { zh: "LDAC 高码率需要稳定无线环境；SBC 兼容性强但效率较普通。", "zh-Hant": traditional("LDAC 高码率需要稳定无线环境；SBC 兼容性强但效率较普通。"), en: "LDAC high bitrate needs stable radio; SBC is compatible but less efficient.", ja: "LDAC の高ビットレートには安定した無線環境が必要。SBC は互換性が高いが効率は普通。", ko: "LDAC 고비트레이트에는 안정적인 무선 환경이 필요하며, SBC는 호환성이 높지만 효율은 보통이다." },
      { zh: "LE Audio 的 LC3 更重视低功耗、多设备和广播音频。", "zh-Hant": traditional("LE Audio 的 LC3 更重视低功耗、多设备和广播音频。"), en: "LC3 in LE Audio targets low power, multi-device use, and broadcast audio.", ja: "LE Audio の LC3 は低消費電力、複数機器、ブロードキャスト音声を重視する。", ko: "LE Audio의 LC3는 저전력, 다중 기기 사용, 방송 오디오를 중시한다." }
    ]
  },
  lowLatency: {
    label: { zh: "低延迟互动", "zh-Hant": traditional("低延迟互动"), en: "Low-latency interaction", ja: "低遅延インタラクション", ko: "저지연 상호작용" },
    summary: { zh: "低延迟互动：帧长、缓冲、网络和解码等待都必须压低。", "zh-Hant": traditional("低延迟互动：帧长、缓冲、网络和解码等待都必须压低。"), en: "Low-latency interaction: frame size, buffering, network, and decode wait must stay low.", ja: "低遅延インタラクション：フレーム長、バッファ、ネットワーク、復号待ちをすべて低く抑える。", ko: "저지연 상호작용: 프레임 길이, 버퍼링, 네트워크, 디코딩 대기를 모두 낮게 유지해야 한다." },
    recommendation: { zh: "推荐：Opus / LC3 / 低延迟专用链路", "zh-Hant": traditional("推荐：Opus / LC3 / 低延迟专用链路"), en: "Recommended: Opus / LC3 / dedicated low-latency paths", ja: "推奨：Opus / LC3 / 低遅延専用経路", ko: "권장: Opus / LC3 / 전용 저지연 경로" },
    metrics: [
      { zh: "游戏语音、远程合奏和本地监听的预算不同；监听通常比通话要求更短的延迟，不能共用一个 100 ms 标准。", "zh-Hant": traditional("游戏语音、远程合奏和本地监听的预算不同；监听通常比通话要求更短的延迟，不能共用一个 100 ms 标准。"), en: "Game chat, remote ensemble playing, and local monitoring have different budgets; monitoring typically needs much less delay than conversation, not a shared 100 ms target.", ja: "ゲーム音声、遠隔合奏、ローカルモニタリングでは予算が異なる。通常、モニタリングは通話より大幅に短い遅延を要し、100 ms の基準を共用できない。", ko: "게임 음성, 원격 합주, 로컬 모니터링은 지연 예산이 다르다. 모니터링은 보통 통화보다 훨씬 짧은 지연이 필요하므로 100 ms 기준 하나를 함께 쓸 수 없다." },
      { zh: "过度追求压缩率会增加算法等待和错误恢复成本。", "zh-Hant": traditional("过度追求压缩率会增加算法等待和错误恢复成本。"), en: "Chasing compression ratio can increase algorithmic wait and recovery cost.", ja: "圧縮率を追い求めすぎると、アルゴリズムの待ち時間とエラー復旧コストが増える。", ko: "압축비를 지나치게 추구하면 알고리즘 대기 시간과 오류 복구 비용이 늘어날 수 있다." }
    ]
  }
} satisfies Record<
  ScenarioId,
  {
    label: LocalizedText;
    summary: LocalizedText;
    recommendation: LocalizedText;
    metrics: Array<LocalizedText>;
  }
>;

const scenarioOrder = Object.keys(scenarios) as ScenarioId[];

const metricCards = [
  { title: { zh: "码率", "zh-Hant": traditional("码率"), en: "Bitrate", ja: "ビットレート", ko: "비트레이트" }, body: { zh: "每秒码流大小，影响文件体积、带宽和压缩余量。", "zh-Hant": traditional("每秒码流大小，影响文件体积、带宽和压缩余量。"), en: "Bitstream size per second; affects file size, bandwidth, and compression headroom.", ja: "1 秒あたりのビットストリーム量。ファイルサイズ、帯域幅、圧縮の余裕に影響する。", ko: "초당 비트스트림 크기로, 파일 크기·대역폭·압축 여유에 영향을 준다." } },
  { title: { zh: "压缩比", "zh-Hant": traditional("压缩比"), en: "Compression ratio", ja: "圧縮率", ko: "압축비" }, body: { zh: "编码后大小相对 PCM 的缩小程度，通常要和音质一起看。", "zh-Hant": traditional("编码后大小相对 PCM 的缩小程度，通常要和音质一起看。"), en: "How much smaller the encoded stream is than PCM; must be judged with quality.", ja: "符号化後のストリームが PCM よりどれだけ小さいか。通常は音質と合わせて判断する。", ko: "인코딩된 스트림이 PCM보다 얼마나 작아졌는지를 나타내며, 보통 음질과 함께 판단해야 한다." } },
  { title: { zh: "延迟", "zh-Hant": traditional("延迟"), en: "Latency", ja: "遅延", ko: "지연" }, body: { zh: "包含分帧等待、编码、传输缓冲、解码和播放缓冲。", "zh-Hant": traditional("包含分帧等待、编码、传输缓冲、解码和播放缓冲。"), en: "Includes framing wait, encode, transport buffer, decode, and playback buffer.", ja: "フレーム化の待ち時間、符号化、伝送バッファ、復号、再生バッファを含む。", ko: "프레이밍 대기, 인코딩, 전송 버퍼, 디코딩, 재생 버퍼를 포함한다." } },
  { title: { zh: "抗丢包", "zh-Hant": traditional("抗丢包"), en: "Packet-loss resilience", ja: "パケット損失耐性", ko: "패킷 손실 내성" }, body: { zh: "实时通信会用冗余、PLC 和自适应码率降低断续感。", "zh-Hant": traditional("实时通信会用冗余、PLC 和自适应码率降低断续感。"), en: "Real-time communication uses redundancy, PLC, and adaptive bitrate to reduce dropouts.", ja: "リアルタイム通信では冗長化、PLC、適応ビットレートを使って音の途切れを抑える。", ko: "실시간 통신은 중복, PLC, 적응형 비트레이트로 끊김을 줄인다." } }
] satisfies Array<{ title: LocalizedText; body: LocalizedText }>;

const labCopy = {
  backToKnowledge: { zh: "返回知识库", "zh-Hant": traditional("返回知识库"), en: "Back to knowledge base", ja: "知識ベースに戻る", ko: "지식 베이스로 돌아가기" },
  backToDetails: { zh: "返回详细内容", "zh-Hant": traditional("返回详细内容"), en: "Back to detailed content", ja: "詳細に戻る", ko: "상세 내용으로 돌아가기" },
  kicker: { zh: "软件实验", "zh-Hant": traditional("软件实验"), en: "Software lab", ja: "ソフトウェア実験", ko: "소프트웨어 실험" },
  title: { zh: "音频编解码实验室", "zh-Hant": traditional("音频编解码实验室"), en: "Audio Codec Lab", ja: "オーディオコーデック実験室", ko: "오디오 코덱 실험실" },
  intro: { zh: "观察 PCM 如何被分帧、压缩成码流、传输或封装，并在播放端解码回 PCM。这里讨论的是 MP3、AAC、Opus、LC3、SBC 等压缩算法，不是硬件 Codec 芯片。", "zh-Hant": traditional("观察 PCM 如何被分帧、压缩成码流、传输或封装，并在播放端解码回 PCM。这里讨论的是 MP3、AAC、Opus、LC3、SBC 等压缩算法，不是硬件 Codec 芯片。"), en: "See how PCM is framed, compressed into a bitstream, transported or packaged, then decoded back to PCM. This lab covers compression algorithms such as MP3, AAC, Opus, LC3, and SBC, not hardware codec chips.", ja: "PCM がどのようにフレーム化され、ビットストリームへ圧縮され、伝送またはパッケージ化され、再生側で PCM に復号されるかを確認する。ここでは MP3、AAC、Opus、LC3、SBC などの圧縮アルゴリズムを扱い、ハードウェア Codec チップは扱わない。", ko: "PCM이 프레이밍되고 비트스트림으로 압축된 뒤 전송 또는 패키징되고, 재생 측에서 다시 PCM으로 디코딩되는 과정을 살펴본다. 이 실험실에서는 MP3, AAC, Opus, LC3, SBC 등의 압축 알고리즘을 다루며 하드웨어 Codec 칩은 다루지 않는다." },
  workbenchAria: { zh: "音频编解码实验台", "zh-Hant": traditional("音频编解码实验台"), en: "Audio codec workbench", ja: "オーディオコーデック実験台", ko: "오디오 코덱 실험대" },
  visualAria: { zh: "音频编码和解码流程图", "zh-Hant": traditional("音频编码和解码流程图"), en: "Audio encoding and decoding flow charts", ja: "オーディオの符号化と復号のフロー図", ko: "오디오 인코딩 및 디코딩 흐름도" },
  directionHeading: { zh: "编码和解码是两个方向", "zh-Hant": traditional("编码和解码是两个方向"), en: "Encoding and decoding are two directions", ja: "符号化と復号は反対方向の処理", ko: "인코딩과 디코딩은 서로 반대 방향이다" },
  directionSub: { zh: "上行压缩，下行还原为 PCM", "zh-Hant": traditional("上行压缩，下行还原为 PCM"), en: "Compress on one side, reconstruct PCM on the other", ja: "一方で圧縮し、もう一方で PCM に復元する", ko: "한쪽에서는 압축하고 다른 쪽에서는 PCM으로 복원" },
  encodeLabel: { zh: "音频编码流程图", "zh-Hant": traditional("音频编码流程图"), en: "Audio encoding flow chart", ja: "オーディオ符号化フロー図", ko: "오디오 인코딩 흐름도" },
  encodeTitle: { zh: "有损编码示例：PCM → 码流", "zh-Hant": traditional("有损编码示例：PCM → 码流"), en: "Lossy encoding example: PCM → bitstream", ja: "非可逆符号化の例：PCM → ビットストリーム", ko: "손실 인코딩 예시: PCM → 비트스트림" },
  decodeLabel: { zh: "音频解码流程图", "zh-Hant": traditional("音频解码流程图"), en: "Audio decoding flow chart", ja: "オーディオ復号フロー図", ko: "오디오 디코딩 흐름도" },
  decodeTitle: { zh: "解码：码流还原为可播放 PCM", "zh-Hant": traditional("解码：码流还原为可播放 PCM"), en: "Decoding: bitstream returns to playable PCM", ja: "復号：ビットストリームを再生可能な PCM に戻す", ko: "디코딩: 비트스트림을 재생 가능한 PCM으로 복원" },
  metricsAria: { zh: "编解码关键指标", "zh-Hant": traditional("编解码关键指标"), en: "Codec key metrics", ja: "コーデックの主要指標", ko: "코덱 핵심 지표" },
  metricsNote: { zh: "图中量化 / 反量化对应有损编码。FLAC 等无损编码保存预测残差等信息，不丢弃样本精度。封装负责组织码流，不等于压缩；PLC 是丢包估计，FEC 需要额外冗余，均不是每种解码器都有的纠错步骤。", "zh-Hant": traditional("图中量化 / 反量化对应有损编码。FLAC 等无损编码保存预测残差等信息，不丢弃样本精度。封装负责组织码流，不等于压缩；PLC 是丢包估计，FEC 需要额外冗余，均不是每种解码器都有的纠错步骤。"), en: "Quantization / inverse quantization here describe lossy coding. Lossless codecs such as FLAC retain prediction residuals without discarding sample precision. Packaging is not compression; PLC estimates missing audio and FEC requires redundancy, neither is a universal decoder repair step.", ja: "図の量子化 / 逆量子化は非可逆符号化を表す。FLAC などの可逆コーデックは予測残差などを保持し、サンプル精度を捨てない。パッケージ化は圧縮ではなく、PLC は欠落音声の推定、FEC は追加の冗長性を必要とするため、どちらもすべてのデコーダーにある修復手順ではない。", ko: "그림의 양자화 / 역양자화는 손실 코딩을 나타낸다. FLAC 같은 무손실 코덱은 예측 잔차 등의 정보를 보존해 샘플 정밀도를 버리지 않는다. 패키징은 압축이 아니며, PLC는 누락된 오디오를 추정하고 FEC는 추가 중복을 필요로 하므로 둘 다 모든 디코더에 있는 복구 단계는 아니다." },
  keyMetrics: { zh: "关键指标", "zh-Hant": traditional("关键指标"), en: "Key metrics", ja: "主要指標", ko: "핵심 지표" },
  keyMetricsSub: { zh: "不要只看码率", "zh-Hant": traditional("不要只看码率"), en: "Do not only compare bitrate", ja: "ビットレートだけで比較しない", ko: "비트레이트만 비교하지 않기" },
  scenariosAria: { zh: "音频编解码应用场景", "zh-Hant": traditional("音频编解码应用场景"), en: "Audio codec use cases", ja: "オーディオコーデックの用途", ko: "오디오 코덱 사용 사례" },
  useCases: { zh: "应用场景", "zh-Hant": traditional("应用场景"), en: "Use cases", ja: "用途", ko: "사용 사례" },
  useCasesSub: { zh: "先看用途，再选 Codec", "zh-Hant": traditional("先看用途，再选 Codec"), en: "Start with the use case, then pick a codec", ja: "用途を確認してから Codec を選ぶ", ko: "용도를 먼저 보고 Codec 선택하기" },
  scenarioTabsAria: { zh: "应用场景", "zh-Hant": traditional("应用场景"), en: "Use cases", ja: "用途", ko: "사용 사례" }
} satisfies Record<string, LocalizedText>;

function CodecFlowChart({
  label,
  language,
  steps,
  tone,
  title
}: {
  label: LocalizedText;
  language: Language;
  steps: Array<{ title: LocalizedText; detail: LocalizedText }>;
  tone: "encode" | "decode";
  title: LocalizedText;
}) {
  return (
    <div className="audio-codec-flow-scroll" role="region" aria-label={label[language]} tabIndex={0}>
    <svg
      aria-label={label[language]}
      className={`audio-codec-flow-chart ${tone}`}
      role="img"
      viewBox="0 0 960 260"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <marker id={`audioCodecArrow-${tone}`} markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
          <path d="M 0 0 L 8 4 L 0 8 Z" />
        </marker>
      </defs>
      <rect className="lab-diagram-bg" height="260" rx="14" width="960" />
      <text className="lab-label" x="44" y="42">{title[language]}</text>
      {steps.map((step, index) => {
        const x = 42 + index * 176;
        return (
          <g key={step.title.en}>
            <rect className="audio-codec-pipeline-node" height="140" rx="8" width="152" x={x} y="72" />
            <foreignObject x={x + 10} y="82" width="132" height="120">
              <div className="audio-codec-node-copy"><strong>{step.title[language]}</strong><span>{step.detail[language]}</span></div>
            </foreignObject>
            {index < steps.length - 1 ? <path className="audio-codec-pipeline-arrow" d={`M ${x + 154} 142 L ${x + 174} 142`} markerEnd={`url(#audioCodecArrow-${tone})`} /> : null}
          </g>
        );
      })}
    </svg>
    </div>
  );
}

export function AudioCodecLab({ language, onBack, onBackToDetails }: AudioCodecLabProps) {
  const [activeScenario, setActiveScenario] = useState<ScenarioId>("music");
  const scenario = scenarios[activeScenario];

  return (
    <main className="codec-lab-page audio-codec-lab-page">
      <section className="sound-lab-hero" aria-labelledby="audio-codec-lab-title">
        <div className="sound-lab-back-actions">
          <button className="sound-lab-back sound-lab-back-secondary" type="button" onClick={onBack}>
            {labCopy.backToKnowledge[language]}
          </button>
          {onBackToDetails && <button className="sound-lab-back" type="button" onClick={onBackToDetails}>
            <ArrowLeft size={18} aria-hidden="true" />
            {labCopy.backToDetails[language]}
          </button>}
        </div>
        <div>
          <span className="section-kicker">{labCopy.kicker[language]}</span>
          <h1 id="audio-codec-lab-title">{labCopy.title[language]}</h1>
          <p>{labCopy.intro[language]}</p>
        </div>
      </section>

      <section className="audio-codec-workbench" aria-label={labCopy.workbenchAria[language]}>
        <section className="audio-codec-visual" aria-label={labCopy.visualAria[language]}>
          <div className="digital-lab-status">
            <strong>{labCopy.directionHeading[language]}</strong>
            <span>{labCopy.directionSub[language]}</span>
          </div>
          <div className="audio-codec-flow-grid stacked">
            <CodecFlowChart
              label={labCopy.encodeLabel}
              language={language}
              steps={encodeSteps}
              title={labCopy.encodeTitle}
              tone="encode"
            />
            <CodecFlowChart
              label={labCopy.decodeLabel}
              language={language}
              steps={decodeSteps}
              title={labCopy.decodeTitle}
              tone="decode"
            />
          </div>
        </section>

        <section className="codec-mode-concepts audio-codec-metrics" aria-label={labCopy.metricsAria[language]}>
          <p className="sound-topic-note">{labCopy.metricsNote[language]}</p>
          <div className="codec-mode-concepts-header">
            <strong>{labCopy.keyMetrics[language]}</strong>
            <span>{labCopy.keyMetricsSub[language]}</span>
          </div>
          <div className="codec-concept-grid">
            {metricCards.map((metric) => (
              <article key={metric.title.en}>
                <h2>{metric.title[language]}</h2>
                <p>{metric.body[language]}</p>
              </article>
            ))}
          </div>
        </section>
      </section>

      <section className="audio-codec-scenarios" aria-label={labCopy.scenariosAria[language]}>
        <div className="codec-mode-concepts-header">
          <h2>{labCopy.useCases[language]}</h2>
          <span>{labCopy.useCasesSub[language]}</span>
        </div>
        <div className="waveform-tabs audio-codec-scenario-tabs" role="group" aria-label={labCopy.scenarioTabsAria[language]}>
          {scenarioOrder.map((id) => (
            <button
              aria-pressed={activeScenario === id}
              className={activeScenario === id ? "waveform-tab active" : "waveform-tab"}
              key={id}
              type="button"
              onClick={() => setActiveScenario(id)}
            >
              {scenarios[id].label[language]}
            </button>
          ))}
        </div>
        <div className="audio-codec-scenario-card">
          <div className="lab-live-note audio-codec-scenario-note">
            <strong>{scenario.summary[language]}</strong>
            <span>{scenario.recommendation[language]}</span>
          </div>
          <div className="audio-codec-scenario-points">
            {scenario.metrics.map((metric) => (
              <p key={metric.en}>{metric[language]}</p>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
