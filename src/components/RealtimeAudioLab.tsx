import { ArrowLeft } from "lucide-react";

import type { Language, LocalizedText } from "../content/knowledge";

type RealtimeAudioLabProps = {
  language: Language;
  onBack: () => void;
  onBackToDetails?: () => void;
};

type FlowStep = {
  title: LocalizedText;
  detail: LocalizedText;
  type?: "hardware" | "driver" | "buffer" | "process" | "codec";
};

type FlowLayout = "horizontal" | "compact-horizontal";

const localized = (language: Language, values: LocalizedText) => values[language];

const bytesPerSample = 2;
const channels = 1;
const sampleRate = 16000;
const bufferFrames = 512;
const dspMs = 1.4;
const jitterMs = 0.4;
const periodMs = (bufferFrames / sampleRate) * 1000;
const samples = bufferFrames * channels;
const bytes = samples * bytesPerSample;
const worstProcessingMs = dspMs + jitterMs;
const codecFrameSamples = 576;
const firstFrameReadyMs = Math.ceil(codecFrameSamples / bufferFrames) * periodMs;

const basicFlowSteps = [
  {
    title: { zh: "声音输入", en: "Sound input", ja: "音声入力", ko: "소리 입력" },
    detail: { zh: "空气压力变化进入麦克风", en: "air pressure enters the microphone", ja: "空気圧の変化がマイクに入る", ko: "공기 압력 변화가 마이크로 들어감" },
    type: "hardware"
  },
  {
    title: { zh: "麦克风 / ADC", en: "Microphone / ADC", ja: "マイク / ADC", ko: "마이크 / ADC" },
    detail: { zh: "模拟声音变为 PCM 采样", en: "analog sound becomes PCM samples", ja: "アナログ音声をPCMサンプルへ変換", ko: "아날로그 소리를 PCM 샘플로 변환" },
    type: "hardware"
  },
  {
    title: { zh: "驱动采集 PCM", en: "Driver captures PCM", ja: "ドライバーがPCMを収音", ko: "드라이버가 PCM 캡처" },
    detail: { zh: "硬件 DMA 和驱动持续搬运数据", en: "DMA and driver move samples continuously", ja: "ハードウェアDMAとドライバーがサンプルを連続搬送", ko: "하드웨어 DMA와 드라이버가 샘플을 계속 이동" },
    type: "driver"
  },
  {
    title: { zh: "采集 buffer", en: "Capture buffer", ja: "収音バッファ", ko: "캡처 버퍼" },
    detail: { zh: "暂存原始 PCM，等待应用读取", en: "stores raw PCM until the app reads it", ja: "アプリが読み取るまで生PCMを一時保存", ko: "앱이 읽을 때까지 원시 PCM을 임시 저장" },
    type: "buffer"
  },
  {
    title: { zh: "用户态读取 PCM", en: "User-space PCM read", ja: "ユーザー空間のPCM読み取り", ko: "사용자 공간 PCM 읽기" },
    detail: { zh: "read 或 mmap 取到一段 PCM", en: "read or mmap obtains a PCM block", ja: "readまたはmmapでPCMブロックを取得", ko: "read 또는 mmap으로 PCM 블록을 얻음" },
    type: "process"
  },
  {
    title: { zh: "filter / DSP", en: "filter / DSP", ja: "filter / DSP", ko: "filter / DSP" },
    detail: { zh: "滤波、降噪、AEC、AGC", en: "filtering, NS, AEC, AGC", ja: "フィルタリング、NS、AEC、AGC", ko: "필터링, NS, AEC, AGC" },
    type: "process"
  },
  {
    title: { zh: "编码器输入 buffer", en: "Encoder input buffer", ja: "エンコーダー入力バッファ", ko: "인코더 입력 버퍼" },
    detail: { zh: "攒够编码器需要的样本数", en: "accumulates enough samples for codec frames", ja: "コーデックフレームに必要なサンプルを蓄積", ko: "코덱 프레임에 필요한 샘플을 축적" },
    type: "buffer"
  },
  {
    title: { zh: "编码", en: "Encode", ja: "エンコード", ko: "인코드" },
    detail: { zh: "PCM 压缩为 MP3 / Opus 等帧", en: "PCM is compressed into MP3 / Opus frames", ja: "PCMをMP3 / Opusなどのフレームへ圧縮", ko: "PCM을 MP3 / Opus 등의 프레임으로 압축" },
    type: "codec"
  },
  {
    title: { zh: "传输 / 缓存", en: "Transmit / buffer", ja: "送信 / バッファ", ko: "전송 / 버퍼" },
    detail: { zh: "文件、RTSP/RTP 或 jitter buffer", en: "file, RTSP/RTP, or jitter buffer", ja: "ファイル、RTSP/RTP、またはjitter buffer", ko: "파일, RTSP/RTP 또는 jitter buffer" },
    type: "buffer"
  },
  {
    title: { zh: "解码", en: "Decode", ja: "デコード", ko: "디코드" },
    detail: { zh: "压缩帧还原为播放 PCM", en: "compressed frames return to playback PCM", ja: "圧縮フレームを再生PCMへ復元", ko: "압축 프레임을 재생 PCM으로 복원" },
    type: "codec"
  },
  {
    title: { zh: "播放侧 filter / DSP", en: "Playback filter / DSP", ja: "再生側filter / DSP", ko: "재생 측 filter / DSP" },
    detail: { zh: "音量、EQ、混音或响度处理", en: "volume, EQ, mixing, or loudness processing", ja: "音量、EQ、ミキシング、ラウドネス処理", ko: "음량, EQ, 믹싱 또는 라우드니스 처리" },
    type: "process"
  },
  {
    title: { zh: "播放驱动", en: "Playback driver", ja: "再生ドライバー", ko: "재생 드라이버" },
    detail: { zh: "写入播放 ring buffer，DMA 读走", en: "writes playback ring buffer, DMA reads out", ja: "再生リングバッファへ書き込み、DMAが読み出す", ko: "재생 링 버퍼에 쓰고 DMA가 읽어감" },
    type: "driver"
  },
  {
    title: { zh: "D/A 转换", en: "D/A conversion", ja: "D/A変換", ko: "D/A 변환" },
    detail: { zh: "DAC 把 PCM 变回模拟电压", en: "DAC turns PCM back into analog voltage", ja: "DACがPCMをアナログ電圧へ戻す", ko: "DAC가 PCM을 아날로그 전압으로 되돌림" },
    type: "hardware"
  },
  {
    title: { zh: "功放", en: "Amplifier", ja: "アンプ", ko: "앰프" },
    detail: { zh: "放大模拟信号推动负载", en: "amplifies analog signal to drive the load", ja: "アナログ信号を増幅して負荷を駆動", ko: "아날로그 신호를 증폭해 부하를 구동" },
    type: "hardware"
  },
  {
    title: { zh: "声音输出", en: "Sound output", ja: "音声出力", ko: "소리 출력" },
    detail: { zh: "扬声器振膜推动空气", en: "speaker diaphragm moves air", ja: "スピーカーの振動板が空気を動かす", ko: "스피커 진동판이 공기를 움직임" },
    type: "hardware"
  }
] satisfies FlowStep[];

const alsaFlowSteps = [
  {
    title: { zh: "麦克风", en: "Microphone", ja: "マイク", ko: "마이크" },
    detail: { zh: "空气压力变化先变成很小的模拟电信号", en: "air pressure first becomes a tiny analog electrical signal", ja: "空気圧の変化がまず小さなアナログ電気信号になる", ko: "공기 압력 변화가 먼저 작은 아날로그 전기 신호가 됨" },
    type: "hardware"
  },
  {
    title: { zh: "模拟前端 / Codec ADC", en: "Analog front end / Codec ADC", ja: "アナログフロントエンド / Codec ADC", ko: "아날로그 프런트엔드 / Codec ADC" },
    detail: { zh: "放大、偏置、抗混叠后采样成 16 kHz / mono / 16-bit PCM", en: "amplifies, biases, anti-aliases, then samples to 16 kHz / mono / 16-bit PCM", ja: "増幅、バイアス、アンチエイリアス後に16 kHz / mono / 16-bit PCMへサンプリング", ko: "증폭, 바이어스, 앨리어스 방지 후 16 kHz / mono / 16-bit PCM으로 샘플링" },
    type: "hardware"
  },
  {
    title: { zh: "I2S", en: "I2S", ja: "I2S", ko: "I2S" },
    detail: { zh: "本例 Codec 通过 I2S 把 PCM 送到 SoC", en: "this codec sends PCM to the SoC over I2S", ja: "このCodecはI2S経由でPCMをSoCへ送る", ko: "이 Codec은 I2S를 통해 PCM을 SoC로 보냄" },
    type: "hardware"
  },
  {
    title: { zh: "DMA", en: "DMA", ja: "DMA", ko: "DMA" },
    detail: { zh: "不经过 CPU 逐点拷贝，直接写内存", en: "writes memory without CPU copying every sample", ja: "CPUがサンプルごとにコピーせず、メモリへ直接書き込む", ko: "CPU가 샘플마다 복사하지 않고 메모리에 직접 씀" },
    type: "driver"
  },
  {
    title: { zh: "ALSA ring buffer", en: "ALSA ring buffer", ja: "ALSAリングバッファ", ko: "ALSA 링 버퍼" },
    detail: { zh: "内核态 PCM 环形 buffer，保存原始采集数据", en: "kernel PCM ring buffer storing captured data", ja: "収音データを保存するカーネルPCMリングバッファ", ko: "캡처 데이터를 저장하는 커널 PCM 링 버퍼" },
    type: "buffer"
  },
  {
    title: { zh: "period ready", en: "period ready", ja: "period ready", ko: "period ready" },
    detail: { zh: "通知 period 进度；应用唤醒还取决于 avail_min", en: "reports period progress; app wakeups also depend on avail_min", ja: "periodの進行を通知。アプリの起床はavail_minにも依存", ko: "period 진행을 알리며 앱 깨우기는 avail_min에도 좌우됨" },
    type: "driver"
  },
  {
    title: { zh: "copy_to_user / mmap", en: "copy_to_user / mmap", ja: "copy_to_user / mmap", ko: "copy_to_user / mmap" },
    detail: { zh: "read 走拷贝，mmap 可减少显式拷贝", en: "read copies data; mmap reduces explicit copies", ja: "readはコピーを行い、mmapは明示的なコピーを減らす", ko: "read는 복사하고 mmap은 명시적 복사를 줄임" },
    type: "process"
  },
  {
    title: { zh: "用户态 capture buffer", en: "User capture buffer", ja: "ユーザー空間収音バッファ", ko: "사용자 공간 캡처 버퍼" },
    detail: { zh: "应用拿到可处理的 PCM", en: "PCM block ready for the application", ja: "アプリが処理できるPCMを取得", ko: "앱이 처리할 수 있는 PCM을 얻음" },
    type: "buffer"
  },
  {
    title: { zh: "32ms filter frame", en: "32 ms filter frame", ja: "32msフィルターフレーム", ko: "32ms 필터 프레임" },
    detail: { zh: "16 kHz 下 512 samples / 1024 bytes", en: "512 samples / 1024 bytes at 16 kHz", ja: "16 kHzで512 samples / 1024 bytes", ko: "16 kHz에서 512 samples / 1024 bytes" },
    type: "buffer"
  },
  {
    title: { zh: "filter / DSP", en: "filter / DSP", ja: "filter / DSP", ko: "filter / DSP" },
    detail: { zh: "高通滤波、降噪、AEC、AGC", en: "high-pass, noise suppression, AEC, AGC", ja: "ハイパス、ノイズ抑制、AEC、AGC", ko: "하이패스, 잡음 억제, AEC, AGC" },
    type: "process"
  },
  {
    title: { zh: "编码器输入 buffer", en: "Encoder input buffer", ja: "エンコーダー入力バッファ", ko: "인코더 입력 버퍼" },
    detail: { zh: "按编码器帧长重新攒样本", en: "accumulates samples according to codec frame size", ja: "コーデックのフレーム長に合わせてサンプルを再蓄積", ko: "코덱 프레임 길이에 맞춰 샘플을 다시 축적" },
    type: "buffer"
  },
  {
    title: { zh: "MP3 frame", en: "MP3 frame", ja: "MP3フレーム", ko: "MP3 프레임" },
    detail: { zh: "16 kHz MPEG-2 Layer III：576 samples / 36 ms", en: "16 kHz MPEG-2 Layer III: 576 samples / 36 ms", ja: "16 kHz MPEG-2 Layer III：576 samples / 36 ms", ko: "16 kHz MPEG-2 Layer III: 576 samples / 36 ms" },
    type: "codec"
  }
] satisfies FlowStep[];

const playbackFlowSteps = [
  {
    title: { zh: "网络包 / 文件码流", en: "Network packet / file bitstream", ja: "ネットワークパケット / ファイルビットストリーム", ko: "네트워크 패킷 / 파일 비트스트림" },
    detail: { zh: "RTP 承载媒体；RTSP 管理会话；也可读文件", en: "RTP carries media; RTSP controls the session; files also work", ja: "RTPがメディアを運び、RTSPがセッションを管理。ファイルも読み取り可能", ko: "RTP가 미디어를 전달하고 RTSP가 세션을 관리하며 파일도 읽을 수 있음" },
    type: "codec"
  },
  {
    title: { zh: "接收 buffer / jitter buffer", en: "Receive buffer / jitter buffer", ja: "受信バッファ / jitter buffer", ko: "수신 버퍼 / jitter buffer" },
    detail: { zh: "抵抗网络包到达时间抖动，按播放时间排队", en: "absorbs packet-arrival jitter and queues by playout time", ja: "パケット到着のジッターを吸収し、再生時刻順にキューへ入れる", ko: "패킷 도착 지터를 흡수하고 재생 시간순으로 큐에 넣음" },
    type: "buffer"
  },
  {
    title: { zh: "解包 / 重排", en: "Depacketize / reorder", ja: "デパケット化 / 並べ替え", ko: "패킷 해제 / 재정렬" },
    detail: { zh: "去掉 RTP/容器头，按序恢复连续编码帧", en: "removes RTP/container headers and restores ordered codec frames", ja: "RTP／コンテナヘッダーを除き、順序どおりのコーデックフレームを復元", ko: "RTP/컨테이너 헤더를 제거하고 순서가 맞는 코덱 프레임을 복원" },
    type: "process"
  },
  {
    title: { zh: "解码器输入 buffer", en: "Decoder input buffer", ja: "デコーダー入力バッファ", ko: "디코더 입력 버퍼" },
    detail: { zh: "攒够一帧 MP3/AAC/Opus 后才能送解码器", en: "accumulates one MP3/AAC/Opus frame before decoding", ja: "MP3/AAC/Opusの1フレームを蓄積してからデコーダーへ送る", ko: "MP3/AAC/Opus 한 프레임을 축적한 뒤 디코더로 보냄" },
    type: "buffer"
  },
  {
    title: { zh: "MP3 解码", en: "MP3 decode", ja: "MP3デコード", ko: "MP3 디코드" },
    detail: { zh: "压缩帧解码回多点 PCM 采样", en: "turns compressed frames back into PCM samples", ja: "圧縮フレームをPCMサンプルへデコード", ko: "압축 프레임을 PCM 샘플로 디코드" },
    type: "codec"
  },
  {
    title: { zh: "PCM playback buffer", en: "PCM playback buffer", ja: "PCM再生バッファ", ko: "PCM 재생 버퍼" },
    detail: { zh: "保存待播放 PCM，太少会 underrun", en: "stores PCM waiting for playback; too little causes underrun", ja: "再生待ちのPCMを保存し、少なすぎるとunderrunになる", ko: "재생 대기 PCM을 저장하며 너무 적으면 underrun 발생" },
    type: "buffer"
  },
  {
    title: { zh: "重采样 / 混音 / 音量", en: "Resample / mix / volume", ja: "リサンプル / ミックス / 音量", ko: "리샘플 / 믹스 / 음량" },
    detail: { zh: "匹配设备采样率，叠加多路声音并处理音量", en: "matches device rate, mixes streams, and applies volume", ja: "デバイスのレートに合わせ、ストリームをミックスして音量を適用", ko: "장치 레이트에 맞추고 스트림을 믹스해 음량을 적용" },
    type: "process"
  },
  {
    title: { zh: "ALSA playback ring buffer", en: "ALSA playback ring buffer", ja: "ALSA再生リングバッファ", ko: "ALSA 재생 링 버퍼" },
    detail: { zh: "应用写入 PCM，DMA 按硬件节奏读走", en: "app writes PCM while DMA reads it at hardware cadence", ja: "アプリがPCMを書き込み、DMAがハードウェアの周期で読み出す", ko: "앱이 PCM을 쓰고 DMA가 하드웨어 주기에 맞춰 읽어감" },
    type: "buffer"
  },
  {
    title: { zh: "DMA", en: "DMA", ja: "DMA", ko: "DMA" },
    detail: { zh: "把播放 PCM 搬到音频接口或声卡", en: "moves playback PCM to the audio interface or sound card", ja: "再生PCMをオーディオインターフェースまたはサウンドカードへ搬送", ko: "재생 PCM을 오디오 인터페이스나 사운드 카드로 이동" },
    type: "driver"
  },
  {
    title: { zh: "I2S / TDM / USB Audio", en: "I2S / TDM / USB Audio", ja: "I2S / TDM / USB Audio", ko: "I2S / TDM / USB Audio" },
    detail: { zh: "按 BCLK/LRCLK 或 USB 帧节奏把 PCM 送到硬件", en: "sends PCM to hardware using BCLK/LRCLK or USB frame cadence", ja: "BCLK/LRCLKまたはUSBフレーム周期でPCMをハードウェアへ送る", ko: "BCLK/LRCLK 또는 USB 프레임 주기에 맞춰 PCM을 하드웨어로 보냄" },
    type: "hardware"
  },
  {
    title: { zh: "Codec DAC / 模拟处理", en: "Codec DAC / analog processing", ja: "Codec DAC / アナログ処理", ko: "Codec DAC / 아날로그 처리" },
    detail: { zh: "数字 PCM 还原为模拟电压，可带滤波和增益控制", en: "converts digital PCM to analog voltage, with filtering and gain control", ja: "デジタルPCMをアナログ電圧へ戻し、フィルターとゲイン制御を行う", ko: "디지털 PCM을 아날로그 전압으로 변환하고 필터와 게인을 제어" },
    type: "hardware"
  },
  {
    title: { zh: "功放", en: "Amplifier", ja: "アンプ", ko: "앰프" },
    detail: { zh: "把模拟小信号放大到能推动耳机或扬声器", en: "amplifies the analog signal enough to drive headphones or speakers", ja: "アナログ小信号をヘッドホンやスピーカーを駆動できるレベルまで増幅", ko: "아날로그 소신호를 헤드폰이나 스피커를 구동할 만큼 증폭" },
    type: "hardware"
  },
  {
    title: { zh: "扬声器", en: "Speaker", ja: "スピーカー", ko: "스피커" },
    detail: { zh: "电信号推动振膜，重新变成空气振动", en: "electrical signal moves the diaphragm and becomes air vibration again", ja: "電気信号が振動板を動かし、再び空気の振動になる", ko: "전기 신호가 진동판을 움직여 다시 공기 진동이 됨" },
    type: "hardware"
  }
] satisfies FlowStep[];

const bufferCards = [
  {
    title: { zh: "ALSA PCM ring buffer", en: "ALSA PCM ring buffer", ja: "ALSA PCMリングバッファ", ko: "ALSA PCM 링 버퍼" },
    body: {
      zh: "在内核态保存原始 PCM。DMA 持续写入，ALSA 用读写指针管理哪些数据已经被应用取走。",
      en: "Stores raw PCM in kernel space. DMA writes continuously, while ALSA manages read/write pointers for consumed data.",
      ja: "カーネル空間に生PCMを保存します。DMAが連続して書き込み、ALSAが消費済みデータの読み書きポインターを管理します。",
      ko: "커널 공간에 원시 PCM을 저장합니다. DMA가 계속 쓰고 ALSA가 소비된 데이터의 읽기/쓰기 포인터를 관리합니다."
    }
  },
  {
    title: { zh: "period buffer", en: "period buffer", ja: "periodバッファ", ko: "period 버퍼" },
    body: {
      zh: "period 是 ring buffer 的分区和进度通知单位，不是另一块独立 buffer。本例每 period 为 512 帧，即 16 kHz 下 32 ms；实际唤醒还取决于 avail_min 和调度。",
      en: "A period partitions the ring and sets a progress-notification interval, not another buffer. Here 512 frames span 32 ms at 16 kHz; actual wakeups also depend on avail_min and scheduling.",
      ja: "periodはリングを分割し進行通知の間隔を決める単位で、別のバッファではありません。この例では16 kHzで512フレームが32 msに相当し、実際の起床はavail_minとスケジューリングにも依存します。",
      ko: "period는 링을 나누고 진행 알림 간격을 정하는 단위이지 별도 버퍼가 아닙니다. 이 예에서는 16 kHz에서 512 프레임이 32 ms이며 실제 깨우기는 avail_min과 스케줄링에도 좌우됩니다."
    }
  },
  {
    title: { zh: "用户态 capture buffer", en: "User capture buffer", ja: "ユーザー空間収音バッファ", ko: "사용자 공간 캡처 버퍼" },
    body: {
      zh: "应用通过 read 得到拷贝后的 PCM，或通过 mmap 访问映射区域。这里开始进入应用自己的处理节奏。",
      en: "The app receives copied PCM through read, or accesses a mapped area through mmap. This is where app-side timing begins.",
      ja: "アプリはreadでコピーされたPCMを受け取るか、mmapでマッピング領域へアクセスします。ここからアプリ側のタイミングが始まります。",
      ko: "앱은 read를 통해 복사된 PCM을 받거나 mmap으로 매핑 영역에 접근합니다. 여기서 앱 측 타이밍이 시작됩니다."
    }
  },
  {
    title: { zh: "filter frame", en: "filter frame", ja: "filterフレーム", ko: "filter 프레임" },
    body: {
      zh: "算法通常按固定时长处理，例如 32 ms。它不一定等于 ALSA period，也不一定等于编码器帧长。",
      en: "Algorithms often process fixed frame durations, such as 32 ms. This does not have to match ALSA period or codec frame size.",
      ja: "アルゴリズムは32 msなど固定長のフレームを処理することが多く、ALSAのperiodやコーデックのフレーム長と一致する必要はありません。",
      ko: "알고리즘은 보통 32 ms와 같은 고정 길이 프레임을 처리하며 ALSA period나 코덱 프레임 크기와 일치할 필요는 없습니다."
    }
  },
  {
    title: { zh: "encoder input buffer", en: "Encoder input buffer", ja: "エンコーダー入力バッファ", ko: "인코더 입력 버퍼" },
    body: {
      zh: "本例 16 kHz MPEG-2 Layer III 每帧 576 点（36 ms）；收到两个 512 点块后才够首帧，取走 576 点还剩 448 点。MPEG-1 Layer III 才是每帧 1152 点。攒帧时间不等于编码器全部算法延迟。",
      en: "At 16 kHz, MPEG-2 Layer III uses 576 samples (36 ms). Two 512-sample blocks supply the first frame, leaving 448 samples. MPEG-1 Layer III uses 1152 samples. Accumulation time is not the full codec delay.",
      ja: "16 kHzのMPEG-2 Layer IIIは576サンプル（36 ms）を使います。512サンプルのブロック2つで最初のフレームが揃い、448サンプルが残ります。MPEG-1 Layer IIIは1152サンプルです。蓄積時間はコーデック全体の遅延ではありません。",
      ko: "16 kHz에서 MPEG-2 Layer III는 576 샘플(36 ms)을 사용합니다. 512 샘플 블록 두 개로 첫 프레임이 채워지고 448 샘플이 남습니다. MPEG-1 Layer III는 1152 샘플을 사용합니다. 축적 시간은 전체 코덱 지연이 아닙니다."
    }
  },
  {
    title: { zh: "encoded frame buffer", en: "Encoded frame buffer", ja: "エンコード済みフレームバッファ", ko: "인코딩된 프레임 버퍼" },
    body: {
      zh: "PCM 编码后变成 MP3、AAC、Opus 等码流帧，后面才能进入文件、RTSP/RTP 或其他网络队列。",
      en: "After encoding, PCM becomes MP3, AAC, Opus, or other bitstream frames for files, RTSP/RTP, or network queues.",
      ja: "エンコード後、PCMはMP3、AAC、Opusなどのビットストリームフレームになり、ファイル、RTSP/RTP、ネットワークキューへ進みます。",
      ko: "인코딩 후 PCM은 MP3, AAC, Opus 등의 비트스트림 프레임이 되어 파일, RTSP/RTP 또는 네트워크 큐로 들어갑니다."
    }
  },
  {
    title: { zh: "jitter buffer", en: "jitter buffer", ja: "jitter buffer", ko: "jitter buffer" },
    body: {
      zh: "播放网络实时音频时，包到达时间会忽快忽慢。jitter buffer 用少量额外延迟换连续播放，太小会断续，太大会增加通话延迟。",
      en: "For network audio, packet arrival timing varies. A jitter buffer trades a little delay for continuous playback; too small stutters, too large adds call latency.",
      ja: "ネットワーク音声ではパケット到着時刻が変動します。jitter bufferは少しの遅延で連続再生を得ますが、小さすぎると途切れ、大きすぎると通話遅延が増えます。",
      ko: "네트워크 오디오에서는 패킷 도착 시간이 변합니다. jitter buffer는 약간의 지연으로 연속 재생을 얻으며 너무 작으면 끊기고 너무 크면 통화 지연이 늘어납니다."
    }
  },
  {
    title: { zh: "解码器输入 buffer", en: "Decoder input buffer", ja: "デコーダー入力バッファ", ko: "디코더 입력 버퍼" },
    body: {
      zh: "通常需先收齐压缩帧；MP3 还可能引用前帧的 bit reservoir，因此有完整帧不代表可以从任意位置独立解码。",
      en: "A complete compressed frame is usually required. MP3 may also reference earlier bit-reservoir data, so a complete frame does not guarantee independent decoding at an arbitrary position.",
      ja: "通常は圧縮フレーム全体が必要です。MP3は前のフレームのビットリザーバーを参照することもあるため、完全なフレームでも任意位置から独立デコードできるとは限りません。",
      ko: "보통 완전한 압축 프레임이 필요합니다. MP3는 이전 프레임의 비트 리저버를 참조할 수 있으므로 완전한 프레임이라도 임의 위치에서 독립적으로 디코드할 수 있다는 보장은 없습니다."
    }
  },
  {
    title: { zh: "PCM playback buffer", en: "PCM playback buffer", ja: "PCM再生バッファ", ko: "PCM 재생 버퍼" },
    body: {
      zh: "这是用户态待播放 PCM 队列。它把解码节奏和设备播放节奏隔开，队列被读空就容易出现 underrun 和爆音。",
      en: "This user-space queue holds PCM waiting for playback. It separates decode cadence from device cadence; if it runs dry, underrun and pops can occur.",
      ja: "このユーザー空間キューは再生待ちのPCMを保持します。デコード周期とデバイス周期を分離し、空になるとunderrunやポップノイズが起こります。",
      ko: "이 사용자 공간 큐는 재생 대기 PCM을 보관합니다. 디코드 주기와 장치 주기를 분리하며 비면 underrun과 팝 노이즈가 발생할 수 있습니다."
    }
  },
  {
    title: { zh: "ALSA playback ring buffer", en: "ALSA playback ring buffer", ja: "ALSA再生リングバッファ", ko: "ALSA 재생 링 버퍼" },
    body: {
      zh: "播放方向和采集方向相反：应用把 PCM 写进内核环形 buffer，DMA 按声卡时钟读走并送到 DAC。",
      en: "Playback is the reverse of capture: the app writes PCM into the kernel ring buffer, and DMA reads it at the sound-card clock toward the DAC.",
      ja: "再生は収音の逆です。アプリがカーネルリングバッファへPCMを書き込み、DMAがサウンドカードのクロックでDACへ読み出します。",
      ko: "재생은 캡처의 반대입니다. 앱이 커널 링 버퍼에 PCM을 쓰고 DMA가 사운드 카드 클록에 맞춰 DAC로 읽어 보냅니다."
    }
  },
  {
    title: { zh: "AEC reference buffer", en: "AEC reference buffer", ja: "AECリファレンスバッファ", ko: "AEC 참조 버퍼" },
    body: {
      zh: "播放参考通常取自 AO/Mixer 输出或即将送入播放设备的 PCM。AEC 用它和麦克风信号做时间对齐，再估计并减掉扬声器回声。",
      en: "The playback reference is usually taken from AO/Mixer output or PCM about to reach the playback device. AEC aligns it with the microphone signal, then estimates and removes speaker echo.",
      ja: "再生リファレンスは通常AO／Mixer出力、または再生デバイスへ送る直前のPCMから取得します。AECがマイク信号と時間を合わせ、スピーカーエコーを推定して除去します。",
      ko: "재생 참조는 보통 AO/Mixer 출력이나 재생 장치로 보내기 직전의 PCM에서 가져옵니다. AEC가 마이크 신호와 시간을 맞춘 뒤 스피커 에코를 추정해 제거합니다."
    }
  }
] satisfies Array<{ title: LocalizedText; body: LocalizedText }>;

const ruleCards = [
  {
    title: { zh: "排查方向", en: "Troubleshooting direction", ja: "トラブルシューティングの方向", ko: "문제 해결 방향" },
    body: {
      zh: "CPU 峰值过高、period 太小、filter 太慢、copy 阻塞或编码器攒帧过多，都可能让采集链路发生 overrun。",
      en: "CPU peaks, tiny periods, slow filters, blocking copies, or excessive codec buffering can cause capture overruns.",
      ja: "CPUピーク、小さすぎるperiod、遅いフィルター、ブロッキングコピー、過剰なコーデックバッファリングは収音overrunの原因になります。",
      ko: "CPU 피크, 너무 작은 period, 느린 필터, 블로킹 복사, 과도한 코덱 버퍼링은 캡처 overrun을 일으킬 수 있습니다."
    }
  },
  {
    title: { zh: "线程分工", en: "Thread split", ja: "スレッド分担", ko: "스레드 분담" },
    body: {
      zh: "采集线程负责按时取 PCM；处理线程负责 filter；编码线程负责攒帧和输出码流。线程之间用预分配队列传递数据。",
      en: "The capture thread reads PCM on time; the processing thread filters; the encoder thread frames and outputs bitstream. Preallocated queues pass data across threads.",
      ja: "収音スレッドがPCMを時間どおりに読み、処理スレッドがフィルターを行い、エンコーダースレッドがフレーム化してビットストリームを出力します。事前確保したキューでスレッド間を受け渡します。",
      ko: "캡처 스레드는 PCM을 제때 읽고 처리 스레드는 필터링하며 인코더 스레드는 프레임화와 비트스트림 출력을 담당합니다. 사전 할당 큐로 스레드 간 데이터를 전달합니다."
    }
  },
  {
    title: { zh: "延迟取舍", en: "Latency tradeoff", ja: "遅延のトレードオフ", ko: "지연 트레이드오프" },
    body: {
      zh: "period 越小响应越快，但唤醒更频繁、CPU 余量更少。语音链路常在 10 ms、20 ms、32 ms 等处理帧之间取舍。",
      en: "Smaller periods respond faster, but wake more often and leave less CPU headroom. Voice pipelines commonly trade off among 10 ms, 20 ms, and 32 ms frames.",
      ja: "periodを小さくすると応答は速くなりますが、起床回数が増えてCPUの余裕が減ります。音声経路では10 ms、20 ms、32 msなどのフレームを使い分けます。",
      ko: "period를 작게 하면 응답은 빨라지지만 더 자주 깨워 CPU 여유가 줄어듭니다. 음성 파이프라인은 보통 10 ms, 20 ms, 32 ms 프레임 사이에서 절충합니다."
    }
  },
  {
    title: { zh: "典型 SoC 命名差异", en: "Typical SoC naming differences", ja: "代表的なSoC命名の違い", ko: "일반적인 SoC 명칭 차이" },
    body: {
      zh: "瑞芯微、君正、SigmaStar 等 SoC 的 SDK 名称不同，但常见边界类似：AI 表示音频输入，AO 表示音频输出，AENC/ADEC 表示音频编码和解码，VQE/3A 表示 AEC、NS/ANR、AGC 等语音增强。",
      en: "Rockchip, Ingenic, SigmaStar, and similar SoCs use different SDK names, but the common boundaries are similar: AI for audio input, AO for audio output, AENC/ADEC for audio encode/decode, and VQE/3A for AEC, NS/ANR, AGC, and other voice enhancement blocks.",
      ja: "Rockchip、Ingenic、SigmaStarなどのSoCはSDK名が異なりますが、境界は似ています。AIは音声入力、AOは音声出力、AENC/ADECは音声エンコード／デコード、VQE/3AはAEC、NS/ANR、AGCなどの音声強調ブロックを表します。",
      ko: "Rockchip, Ingenic, SigmaStar 등의 SoC는 SDK 명칭이 다르지만 일반적인 경계는 비슷합니다. AI는 오디오 입력, AO는 오디오 출력, AENC/ADEC는 오디오 인코드/디코드, VQE/3A는 AEC, NS/ANR, AGC 등의 음성 향상 블록을 나타냅니다."
    }
  }
] satisfies Array<{ title: LocalizedText; body: LocalizedText }>;

function formatMs(value: number) {
  return `${value.toFixed(2)} ms`;
}

function formatFrameMs(value: number) {
  return Number.isInteger(value) ? `${value} ms` : formatMs(value);
}


function FlowChart({
  ariaLabel,
  id,
  layout = "horizontal",
  language,
  steps,
  title
}: {
  ariaLabel: LocalizedText;
  id: string;
  layout?: FlowLayout;
  language: Language;
  steps: FlowStep[];
  title: LocalizedText;
}) {
  const isCompact = layout === "compact-horizontal";
  const canvasWidth = isCompact ? 1180 : 1480;
  const nodeWidth = isCompact ? 270 : 260;
  const nodeHeight = 176;
  const columns = isCompact ? 4 : 5;
  const gapX = isCompact ? 16 : 20;
  const gapY = isCompact ? 34 : 40;
  const top = 88;
  const left = 44;
  const rowCount = Math.ceil(steps.length / columns);
  const height = top + rowCount * nodeHeight + (rowCount - 1) * gapY + 44;

  const getPosition = (index: number) => {
    const row = Math.floor(index / columns);
    const column = index % columns;
    const isReverseRow = row % 2 === 1;
    const visualColumn = isReverseRow ? columns - 1 - column : column;

    return {
      column,
      row,
      x: left + visualColumn * (nodeWidth + gapX),
      y: top + row * (nodeHeight + gapY)
    };
  };

  const getConnectorPath = (index: number) => {
    const current = getPosition(index);
    const next = getPosition(index + 1);
    const currentCenterY = current.y + nodeHeight / 2;
    const nextCenterY = next.y + nodeHeight / 2;

    if (current.row === next.row) {
      const startsRight = next.x > current.x;
      const startX = startsRight ? current.x + nodeWidth : current.x;
      const endX = startsRight ? next.x : next.x + nodeWidth;
      return `M ${startX} ${currentCenterY} H ${endX}`;
    }

    const startX = current.x + nodeWidth / 2;
    const endX = next.x + nodeWidth / 2;
    const midY = current.y + nodeHeight + gapY / 2;
    return `M ${startX} ${current.y + nodeHeight} V ${midY} H ${endX} V ${next.y}`;
  };

  return (
    <div className="realtime-flow-scroll" role="region" aria-label={localized(language, ariaLabel)} tabIndex={0}>
    <svg
      aria-label={localized(language, ariaLabel)}
      className="realtime-flow-chart"
      data-layout={layout === "compact-horizontal" ? "horizontal-pair" : "horizontal"}
      role="img"
      viewBox={`0 0 ${canvasWidth} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <marker id={`${id}Arrow`} markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
          <path d="M 0 0 L 8 4 L 0 8 Z" />
        </marker>
      </defs>
      <rect className="lab-diagram-bg" height={height} rx="14" width={canvasWidth} />
      <text className="lab-label" x="42" y="48">
        {localized(language, title)}
      </text>
      {steps.map((step, index) => {
        const { x, y } = getPosition(index);

        return (
          <g key={`${id}-${step.title.en}`}>
            <rect
              className={`realtime-flow-node ${step.type ?? "process"}`}
              height={nodeHeight}
              rx="9"
              width={nodeWidth}
              x={x}
              y={y}
            />
            <foreignObject x={x + 14} y={y + 12} width={nodeWidth - 28} height={nodeHeight - 24}>
              <div className="realtime-flow-node-copy"><strong>{localized(language, step.title)}</strong><span>{localized(language, step.detail)}</span></div>
            </foreignObject>
            {index < steps.length - 1 ? (
              <path
                className="realtime-flow-arrow"
                d={getConnectorPath(index)}
                markerEnd={`url(#${id}Arrow)`}
              />
            ) : null}
          </g>
        );
      })}
    </svg>
    </div>
  );
}

function SocAecDiagram({ language }: { language: Language }) {
  const nodes = [
    { id: "remote", title: { zh: "远端音频", en: "Remote audio", ja: "遠端音声", ko: "원격 오디오" }, x: 60, y: 110, type: "codec" },
    { id: "adec", title: { zh: "ADEC", en: "ADEC", ja: "ADEC", ko: "ADEC" }, x: 260, y: 110, type: "codec" },
    { id: "mixer", title: { zh: "AO / Mixer", en: "AO / Mixer", ja: "AO / Mixer", ko: "AO / Mixer" }, x: 460, y: 110, type: "process" },
    { id: "dac", title: { zh: "I2S → Codec DAC", en: "I2S → Codec DAC", ja: "I2S → Codec DAC", ko: "I2S → Codec DAC" }, x: 660, y: 110, type: "hardware" },
    { id: "speaker", title: { zh: "功放 / 扬声器", en: "Amp / speaker", ja: "アンプ / スピーカー", ko: "앰프 / 스피커" }, x: 880, y: 110, type: "hardware" },
    { id: "ref", title: { zh: "AEC 参考 PCM", en: "Reference PCM", ja: "AECリファレンスPCM", ko: "AEC 참조 PCM" }, x: 460, y: 270, type: "buffer" },
    { id: "mic", title: { zh: "麦克风", en: "Microphone", ja: "マイク", ko: "마이크" }, x: 60, y: 430, type: "hardware" },
    { id: "ai", title: { zh: "AI / DMA", en: "AI / DMA", ja: "AI / DMA", ko: "AI / DMA" }, x: 260, y: 430, type: "driver" },
    { id: "aec", title: { zh: "AEC", en: "AEC", ja: "AEC", ko: "AEC" }, x: 460, y: 430, type: "process" },
    { id: "ns", title: { zh: "NS / ANR", en: "NS / ANR", ja: "NS / ANR", ko: "NS / ANR" }, x: 660, y: 430, type: "process" },
    { id: "agc", title: { zh: "AGC", en: "AGC", ja: "AGC", ko: "AGC" }, x: 840, y: 430, type: "process" },
    { id: "aenc", title: { zh: "AENC", en: "AENC", ja: "AENC", ko: "AENC" }, x: 1000, y: 430, type: "codec" }
  ] satisfies Array<{
    id: string;
    title: LocalizedText;
    x: number;
    y: number;
    type: NonNullable<FlowStep["type"]>;
  }>;

  const arrows = [
    { d: "M 220 140 L 250 140" },
    { d: "M 420 140 L 450 140" },
    { d: "M 620 140 L 650 140" },
    { d: "M 820 140 L 870 140" },
    { d: "M 540 170 L 540 260" },
    { d: "M 540 330 L 540 420" },
    { d: "M 220 460 L 250 460" },
    { d: "M 420 460 L 450 460" },
    { d: "M 620 460 L 650 460" },
    { d: "M 820 460 L 830 460" },
    { d: "M 980 460 L 990 460" }
  ];

  return (
    <div className="realtime-flow-scroll" role="region" aria-label={localized(language, { zh: "SoC AEC 流程图", en: "SoC AEC flow diagram", ja: "SoC AECフロー図", ko: "SoC AEC 흐름도" })} tabIndex={0}>
    <svg
      aria-label={localized(language, { zh: "典型 SoC AEC 和 3A 处理框图", en: "Typical SoC AEC and 3A processing block diagram", ja: "典型的なSoC AECと3A処理ブロック図", ko: "일반적인 SoC AEC 및 3A 처리 블록 다이어그램" })}
      className="realtime-flow-chart realtime-soc-aec-chart"
      role="img"
      viewBox="0 0 1180 620"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <marker id="socAecArrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
          <path d="M 0 0 L 8 4 L 0 8 Z" />
        </marker>
      </defs>
      <rect className="lab-diagram-bg" height="620" rx="14" width="1180" />
      <text className="lab-label" x="42" y="48">
        {localized(language, { zh: "典型 SoC AEC / 3A：播放参考回采到采集侧消除", en: "Typical SoC AEC / 3A: playback reference returns to capture-side cancellation", ja: "典型的なSoC AEC / 3A：再生リファレンスを収音側へ戻して除去", ko: "일반적인 SoC AEC / 3A: 재생 참조를 캡처 측으로 되돌려 제거" })}
      </text>
      <text className="realtime-soc-lane-label" x="60" y="88">
        {localized(language, { zh: "播放参考链路", en: "Playback reference path", ja: "再生リファレンス経路", ko: "재생 참조 경로" })}
      </text>
      <text className="realtime-soc-lane-label" x="60" y="408">
        {localized(language, { zh: "麦克风采集链路", en: "Microphone capture path", ja: "マイク収音経路", ko: "마이크 캡처 경로" })}
      </text>
      <text className="realtime-soc-note" x="650" y="290">
        <tspan x="650">{localized(language, { zh: "AEC：播放参考与麦克风输入", en: "AEC: playback reference and mic input", ja: "AEC：再生リファレンスとマイク入力", ko: "AEC: 재생 참조와 마이크 입력" })}</tspan>
        <tspan x="650" dy="24">{localized(language, { zh: "必须时间对齐", en: "must be time-aligned", ja: "時間整合が必須", ko: "시간 정렬 필요" })}</tspan>
      </text>
      <text className="realtime-soc-note" x="590" y="366">
        {localized(language, { zh: "回采信号用于 AEC", en: "Loopback signal feeds AEC", ja: "ループバック信号をAECへ入力", ko: "루프백 신호를 AEC에 입력" })}
      </text>
      {arrows.map((arrow) => (
        <path className="realtime-soc-aec-arrow" d={arrow.d} key={arrow.d} markerEnd="url(#socAecArrow)" />
      ))}
      {nodes.map((node) => (
        <g key={node.id}>
          <rect className={`realtime-flow-node ${node.type}`} height="60" rx="9" width={node.id === "aenc" ? 120 : node.id === "agc" ? 140 : 160} x={node.x} y={node.y} />
          <text className="realtime-soc-node-title" x={node.x + (node.id === "aenc" ? 60 : node.id === "agc" ? 70 : 80)} y={node.y + 31}>
            {localized(language, node.title)}
          </text>
        </g>
      ))}
    </svg>
    </div>
  );
}

export function RealtimeAudioLab({ language, onBack, onBackToDetails }: RealtimeAudioLabProps) {
  const statusLabel = localized(language, { zh: "状态：稳定", en: "Status: stable", ja: "状態：安定", ko: "상태: 안정" });

  return (
    <main className="codec-lab-page realtime-audio-lab-page">
      <section className="sound-lab-hero" aria-labelledby="realtime-audio-lab-title">
        <div className="sound-lab-back-actions">
          <button className="sound-lab-back sound-lab-back-secondary" type="button" onClick={onBack}>
            {localized(language, { zh: "返回知识库", en: "Back to knowledge base", ja: "ナレッジベースに戻る", ko: "지식 베이스로 돌아가기" })}
          </button>
          {onBackToDetails && <button className="sound-lab-back" type="button" onClick={onBackToDetails}>
            <ArrowLeft size={18} aria-hidden="true" />
            {localized(language, { zh: "返回详细内容", en: "Back to detailed content", ja: "詳細内容に戻る", ko: "상세 내용으로 돌아가기" })}
          </button>}
        </div>
        <div>
          <span className="section-kicker">{localized(language, { zh: "软件实验", en: "Software lab", ja: "ソフトウェア実験", ko: "소프트웨어 실험" })}</span>
          <h1 id="realtime-audio-lab-title">
            {localized(language, { zh: "实时音频处理实验室", en: "Real-Time Audio Processing Lab", ja: "リアルタイムオーディオ処理ラボ", ko: "실시간 오디오 처리 실험실" })}
          </h1>
          <p>{localized(language, {
            zh: "用一个 16 kHz 单声道语音采集例子，区分驱动、ALSA、用户态 filter 和编码器里的不同 buffer。",
            en: "Use a 16 kHz mono voice-capture example to separate buffers in the driver, ALSA, user-space filter, and encoder.",
            ja: "16 kHzモノラルの音声収音例を使い、ドライバー、ALSA、ユーザー空間filter、エンコーダーの各バッファを区別します。",
            ko: "16 kHz 모노 음성 캡처 예시로 드라이버, ALSA, 사용자 공간 filter, 인코더의 서로 다른 버퍼를 구분합니다."
          })}</p>
        </div>
      </section>

      <section
        className="realtime-audio-workbench"
        aria-label={localized(language, { zh: "实时音频处理实验台", en: "Real-time audio processing workbench", ja: "リアルタイムオーディオ処理ワークベンチ", ko: "실시간 오디오 처리 작업대" })}
      >
        <section className="realtime-audio-visual" aria-label={localized(language, { zh: "实时音频调度图", en: "Real-time audio scheduling diagram", ja: "リアルタイムオーディオスケジューリング図", ko: "실시간 오디오 스케줄링 다이어그램" })}>
          <div className="digital-lab-status">
            <strong>{localized(language, { zh: "从 PCM 采集到解码播放", en: "From PCM capture to decoded playback", ja: "PCM収音からデコード再生まで", ko: "PCM 캡처에서 디코드 재생까지" })}</strong>
            <span>
              {localized(language, {
                zh: "先看通用链路，再看采集编码和解码播放两个具体例子",
                en: "Start with the generic path, then inspect capture-encode and decode-playback examples",
                ja: "まず一般的な経路を見てから、収音・エンコードとデコード・再生の具体例を確認します",
                ko: "먼저 일반 경로를 보고 캡처-인코드와 디코드-재생 예시를 살펴봅니다"
              })}
            </span>
          </div>

          <div className="realtime-audio-metrics">
            <strong>{localized(language, { zh: "默认格式：16 kHz / mono / 16-bit PCM", en: "Default format: 16 kHz / mono / 16-bit PCM", ja: "デフォルト形式：16 kHz / mono / 16-bit PCM", ko: "기본 형식: 16 kHz / mono / 16-bit PCM" })}</strong>
            <strong>
              {localized(language, {
                zh: `${formatFrameMs(periodMs)} 处理帧：${samples} samples / ${bytes} bytes`,
                en: `${formatFrameMs(periodMs)} frame: ${samples} samples / ${bytes} bytes`,
                ja: `${formatFrameMs(periodMs)}の処理フレーム：${samples} samples / ${bytes} bytes`,
                ko: `${formatFrameMs(periodMs)} 처리 프레임: ${samples} samples / ${bytes} bytes`
              })}
            </strong>
            <strong>{localized(language, { zh: `采集 period：${formatMs(periodMs)}`, en: `Capture period: ${formatMs(periodMs)}`, ja: `収音period：${formatMs(periodMs)}`, ko: `캡처 period: ${formatMs(periodMs)}` })}</strong>
            <strong>{localized(language, { zh: `每块处理预算：${formatMs(periodMs)}`, en: `Per-block budget: ${formatMs(periodMs)}`, ja: `ブロックごとの予算：${formatMs(periodMs)}`, ko: `블록당 예산: ${formatMs(periodMs)}` })}</strong>
            <strong>{localized(language, { zh: `假设处理耗时上限：${formatMs(worstProcessingMs)}`, en: `Assumed processing bound: ${formatMs(worstProcessingMs)}`, ja: `想定処理時間上限：${formatMs(worstProcessingMs)}`, ko: `가정한 처리 시간 한계: ${formatMs(worstProcessingMs)}` })}</strong>
            <strong>{localized(language, { zh: `首帧样本攒齐时间：${formatMs(firstFrameReadyMs)}`, en: `First-frame samples available: ${formatMs(firstFrameReadyMs)}`, ja: `最初のフレームが揃う時間：${formatMs(firstFrameReadyMs)}`, ko: `첫 프레임 샘플 준비 시간: ${formatMs(firstFrameReadyMs)}` })}</strong>
            <strong className="realtime-status stable">{statusLabel}</strong>
          </div>

          <div className="lab-live-note realtime-lab-headroom-note">
            <strong>{localized(language, { zh: `DSP 耗时：${formatMs(dspMs)}`, en: `DSP time: ${formatMs(dspMs)}`, ja: `DSP時間：${formatMs(dspMs)}`, ko: `DSP 시간: ${formatMs(dspMs)}` })}</strong>
            <span>
              {localized(language, {
                zh: "这是固定参数教学例子，不是实测：每 32 ms 交付 512 点，首帧需 576 点，64 ms 时样本才攒齐；尚未计入处理、编码器前视和传输延迟。实际 XRUN 还取决于队列水位与调度。",
                en: "This is a fixed teaching example, not a measurement: 512 samples arrive every 32 ms; the first 576-sample frame is available at 64 ms, before processing, codec lookahead, or transport delay. Actual XRUN risk also depends on queue occupancy and scheduling.",
                ja: "これは固定パラメータの教育例であり実測ではありません。32 msごとに512点が届き、最初の576サンプルフレームは64 msで揃います。処理、コーデックの先読み、伝送遅延は未計上で、実際のXRUNリスクはキュー水位とスケジューリングにも依存します。",
                ko: "고정 파라미터 교육 예시이며 실측이 아닙니다. 32 ms마다 512 샘플이 도착하고 첫 576 샘플 프레임은 64 ms에 준비됩니다. 처리, 코덱 룩어헤드, 전송 지연은 포함하지 않았으며 실제 XRUN 위험은 큐 수위와 스케줄링에도 좌우됩니다."
              })}
            </span>
          </div>

          <div className="realtime-flow-grid">
            <FlowChart
              ariaLabel={{ zh: "基础音频处理流程图", en: "Basic audio processing flow chart", ja: "基本オーディオ処理フローチャート", ko: "기본 오디오 처리 흐름도" }}
              id="basicAudioFlow"
              language={language}
              steps={basicFlowSteps}
              title={{ zh: "基础流程：采集 -> 编码 -> 解码 -> 播放输出", en: "Basic flow: capture -> encode -> decode -> playback output", ja: "基本フロー：収音 -> エンコード -> デコード -> 再生出力", ko: "기본 흐름: 캡처 -> 인코드 -> 디코드 -> 재생 출력" }}
            />
            <div className="realtime-example-flow-pair">
              <FlowChart
                ariaLabel={{ zh: "ALSA 采集 PCM 到编码流程图", en: "ALSA PCM capture to encoding flow chart", ja: "ALSA PCM収音からエンコードまでのフローチャート", ko: "ALSA PCM 캡처에서 인코드까지 흐름도" }}
                id="alsaCaptureFlow"
                language={language}
                steps={alsaFlowSteps}
                title={{ zh: "具体例子：ALSA 采集 PCM -> filter -> MP3 编码", en: "Example: ALSA PCM capture -> filter -> MP3 encode", ja: "具体例：ALSA PCM収音 -> filter -> MP3エンコード", ko: "예시: ALSA PCM 캡처 -> filter -> MP3 인코드" }}
              />
              <FlowChart
                ariaLabel={{ zh: "MP3 解码到 PCM 播放流程图", en: "MP3 decode to PCM playback flow chart", ja: "MP3デコードからPCM再生までのフローチャート", ko: "MP3 디코드에서 PCM 재생까지 흐름도" }}
                id="mp3PlaybackFlow"
                language={language}
                steps={playbackFlowSteps}
                title={{ zh: "具体例子：MP3 / RTSP 接收 -> 解码 -> PCM 播放", en: "Example: MP3 / RTSP receive -> decode -> PCM playback", ja: "具体例：MP3 / RTSP受信 -> デコード -> PCM再生", ko: "예시: MP3 / RTSP 수신 -> 디코드 -> PCM 재생" }}
              />
            </div>
            <SocAecDiagram language={language} />
          </div>
        </section>

        <details className="codec-mode-concepts realtime-buffer-guide">
          <summary className="codec-mode-concepts-header">
            <strong>{localized(language, { zh: "这些 buffer 不是同一个东西", en: "These buffers are not the same thing", ja: "これらのbufferは同じものではありません", ko: "이 buffer들은 같은 것이 아닙니다" })}</strong>
            <span>{localized(language, { zh: "按数据位置和用途区分", en: "Separate them by location and purpose", ja: "データの位置と用途で区別", ko: "데이터 위치와 용도로 구분" })}</span>
          </summary>
          <div className="realtime-buffer-card-grid">
            {bufferCards.map((card) => (
              <article key={card.title.en}>
                <h2>{localized(language, card.title)}</h2>
                <p>{localized(language, card.body)}</p>
              </article>
            ))}
          </div>
        </details>

        <details className="codec-mode-concepts realtime-audio-rules">
          <summary className="codec-mode-concepts-header">
            <strong>{localized(language, { zh: "关键规则", en: "Key rules", ja: "重要なルール", ko: "핵심 규칙" })}</strong>
            <span>{localized(language, { zh: "实时处理的重点是确定性", en: "The priority is deterministic timing", ja: "リアルタイム処理では決定性が重要", ko: "실시간 처리의 핵심은 결정성" })}</span>
          </summary>
          <div className="codec-concept-grid realtime-rule-grid">
            {ruleCards.map((card) => (
              <article key={card.title.en}>
                <h2>{localized(language, card.title)}</h2>
                <p>{localized(language, card.body)}</p>
              </article>
            ))}
          </div>
        </details>
      </section>
    </main>
  );
}
