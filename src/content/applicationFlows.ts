import type { LocalizedText } from "./knowledge";
import { traditional } from "./traditional";

const l = (zh: string, en: string, ja: string, ko: string): LocalizedText => ({ zh, "zh-Hant": traditional(zh), en, ja, ko });

type ScenarioPath = {
  id: string;
  title: LocalizedText;
  steps: LocalizedText[];
  note: LocalizedText;
};
type ScenarioFlow = {
  introduction: LocalizedText;
  paths: ScenarioPath[];
  feedback?: LocalizedText;
  check: LocalizedText;
};

export const applicationFlows: Record<string, ScenarioFlow> = {
  "bluetooth-audio": {
    introduction: l(
      "先确认两端共同支持的音频配置和 Codec，再看媒体数据怎么走。协议协商是建立链路的条件，不是每帧 PCM 都要经过的处理步骤。",
      "First establish a mutually supported audio configuration and codec, then follow the media. Negotiation sets up the link; it is not a PCM processing stage repeated for every frame.",
      "最初に両端が対応する音声構成と Codec を確認し、その後にメディアの流れを追います。ネゴシエーションは接続の前提であり、PCM の各フレームで繰り返す処理ではありません。",
      "먼저 양쪽이 지원하는 오디오 구성과 Codec을 확인한 뒤 미디어 흐름을 봅니다. 협상은 연결 조건이지 PCM 프레임마다 반복하는 처리 단계가 아닙니다."),
    paths: [{
      id: "media", title: l("媒体播放路径", "Media playback path", "メディア再生経路", "미디어 재생 경로"),
      steps: [
        l("源设备：解码文件 / 混音 → PCM", "Source: file decode / mix → PCM", "送信側：ファイル復号・ミックス → PCM", "송신 기기: 파일 디코딩 / 믹싱 → PCM"),
        l("蓝牙编码 → 无线传输", "Bluetooth encoding → radio transport", "Bluetooth 符号化 → 無線伝送", "Bluetooth 인코딩 → 무선 전송"),
        l("接收缓冲 → 解码 / 丢帧补偿", "Receive buffer → decode / loss concealment", "受信バッファ → 復号・欠損補完", "수신 버퍼 → 디코딩 / 손실 은폐"),
        l("PCM → DAC / 功放 → 扬声器", "PCM → DAC / amplifier → speaker", "PCM → DAC・アンプ → スピーカー", "PCM → DAC / 앰프 → 스피커")
      ],
      note: l("这是播放方向；通话还需要麦克风上行。A2DP、HFP 与 LE Audio 的传输机制不同，不能只替换 Codec 名字就当作同一协议。", "This is the playback direction; calls also need a microphone uplink. A2DP, HFP, and LE Audio use different transport mechanisms, not merely different codec names.", "これは再生方向です。通話にはマイクの上り経路も必要です。A2DP、HFP、LE Audio は Codec 名だけでなく伝送方式も異なります。", "재생 방향의 예이며 통화에는 마이크 상향 경로도 필요합니다. A2DP, HFP, LE Audio는 Codec 이름뿐 아니라 전송 방식도 다릅니다.")
    }],
    check: l("观察延迟与断续的取舍：加大缓冲可容纳更晚到达的数据，但增加等待，也无法找回永久丢失的数据。总延迟还包含源端排队、编解码、无线调度与输出延迟，须在真实设备上测量。", "Observe the delay/dropout trade-off: a larger buffer accepts later arrivals but adds waiting and cannot recover permanently lost data. Total delay also includes source queues, coding, radio scheduling, and output; measure it on real devices.", "遅延と途切れのトレードオフを確認します。大きなバッファは遅着を吸収しますが待ち時間が増え、永久欠損は回復できません。全遅延には送信待ち、符号化・復号、無線制御、出力も含まれ、実機で測定が必要です。", "지연과 끊김의 절충을 봅니다. 큰 버퍼는 늦게 도착한 데이터를 수용하지만 대기가 늘고 영구 손실은 복원하지 못합니다. 전체 지연에는 송신 대기, 코딩, 무선 스케줄링, 출력도 포함되며 실기기에서 측정해야 합니다.")
  },
  "meeting-communication": {
    introduction: l("以同一台会议终端为观察点：发送和接收同时进行，AEC 使用本机播放参考。字幕只是语音的旁路消费者，不应阻塞通话。", "View one meeting endpoint: sending and receiving run simultaneously, and AEC uses its local render reference. Captions consume a side branch and should not block the call.", "一台の会議端末を基準に見ると、送信と受信は同時に動き、AEC は端末の再生参照を使います。字幕は音声の分岐先であり、通話を止めない構成にします。", "하나의 회의 단말을 기준으로 송수신이 동시에 진행되고 AEC는 로컬 재생 참조를 사용합니다. 자막은 음성 분기 경로이며 통화를 막지 않아야 합니다."),
    paths: [
      { id: "send", title: l("发送：让远端听清我", "Send: let the remote side hear me", "送信：遠端に自分の声を届ける", "송신: 상대방에게 내 목소리 전달"), steps: [
        l("麦克风 → 驱动 / PCM", "Microphone → driver / PCM", "マイク → ドライバ・PCM", "마이크 → 드라이버 / PCM"),
        l("AEC → 降噪 / AGC", "AEC → noise suppression / AGC", "AEC → ノイズ抑制・AGC", "AEC → 잡음 억제 / AGC"),
        l("编码 → RTP 等媒体传输 → 远端", "Encode → media transport such as RTP → remote", "符号化 → RTP 等のメディア伝送 → 遠端", "인코딩 → RTP 등 미디어 전송 → 상대방")
      ], note: l("这是单麦示例。多麦还需通道同步和波束成形，具体顺序随架构而变。增强后的近端 PCM 可分支送 ASR。", "This is a single-mic example. Arrays also need channel synchronization and beamforming; order depends on the architecture. Enhanced near-end PCM can branch to ASR.", "単一マイクの例です。アレイでは同期とビームフォーミングも必要で、順序は構成によります。強調後の近端 PCM は ASR に分岐できます。", "단일 마이크 예입니다. 어레이에는 채널 동기화와 빔포밍이 추가되며 순서는 구조에 따라 다릅니다. 향상된 근단 PCM을 ASR로 분기할 수 있습니다.") },
      { id: "receive", title: l("接收：让我听清远端", "Receive: let me hear the remote side", "受信：遠端の声を聞く", "수신: 상대방 목소리 듣기"), steps: [
        l("远端码流 → 抖动缓冲", "Remote bitstream → jitter buffer", "遠端ビットストリーム → ジッターバッファ", "상대방 비트스트림 → 지터 버퍼"),
        l("解码 / PLC → 播放 PCM", "Decode / PLC → render PCM", "復号・PLC → 再生 PCM", "디코딩 / PLC → 재생 PCM"),
        l("输出驱动 → DAC / 功放 → 扬声器", "Output driver → DAC / amplifier → speaker", "出力ドライバ → DAC・アンプ → スピーカー", "출력 드라이버 → DAC / 앰프 → 스피커")
      ], note: l("抖动缓冲处理到达时间波动，PLC 在缺帧时估计替代音频，不能保证还原原始语音。远端字幕应从接收解码后的 PCM 另行分支。", "The jitter buffer handles arrival variation; PLC estimates replacement audio for missing frames, not exact recovery. Remote captions should branch from received, decoded PCM.", "ジッターバッファは到着時刻の揺れを吸収し、PLC は欠損フレームの代替音声を推定します。元の音声の完全復元ではありません。遠端の字幕は受信復号後の PCM から分岐します。", "지터 버퍼는 도착 시각 변동을 흡수하고 PLC는 누락 프레임의 대체 음성을 추정할 뿐 원음 복원을 보장하지 않습니다. 원단 자막은 수신 디코딩 후 PCM에서 분기합니다.") }
    ],
    feedback: l("参考回路：接收侧实际播放 PCM → 延迟对齐 → 发送侧 AEC 参考输入。声学回声则沿“扬声器 → 房间 → 麦克风”返回；参考信号不是再次送去播放的音频。", "Reference loop: actual receive-side render PCM → delay alignment → send-side AEC reference input. Acoustic echo returns through speaker → room → microphone; the reference is not a second playback path.", "参照ループ：受信側の実際の再生 PCM → 遅延整合 → 送信側 AEC の参照入力。音響エコーはスピーカー → 部屋 → マイクと戻ります。参照は二重再生の経路ではありません。", "참조 경로: 수신 측 실제 재생 PCM → 지연 정렬 → 송신 측 AEC 참조 입력. 음향 에코는 스피커 → 방 → 마이크로 돌아오며 참조는 별도 재생 경로가 아닙니다."),
    check: l("同一段语音分别测试单讲、双讲和弱网：检查近端语音是否被误消、远端是否断续，并记录端到端延迟。ERLE 主要观察回声衰减，不能单独证明双讲保真或通话质量。", "Test single-talk, double-talk, and poor networking with the same speech. Check near-end suppression, remote dropouts, and end-to-end delay. ERLE measures echo attenuation, not double-talk fidelity or overall call quality by itself.", "同じ音声で片端発話、同時発話、弱いネットワークを試し、近端音声の誤抑制、遠端の途切れ、全遅延を確認します。ERLE だけでは同時発話の忠実度や通話品質を評価できません。", "같은 음성으로 단일 발화, 동시 발화, 약한 네트워크를 비교하고 근단 음성 오억제, 원단 끊김, 전체 지연을 확인합니다. ERLE만으로 동시 발화 보존이나 통화 품질을 판단할 수 없습니다.")
  },
  "automotive-audio": {
    introduction: l("座舱音频包含三条可以并行工作的路径。它们可能共享处理器、总线与扬声器，但主动降噪不是 ASR 或语音助手的下一个步骤。", "Cabin audio contains three paths that can run in parallel. They may share processors, buses, and speakers, but ANC is not the next stage of ASR or the voice assistant.", "車室内音響には並行動作する三つの経路があります。プロセッサ、バス、スピーカーを共有する場合もありますが、ANC は ASR や音声アシスタントの後段ではありません。", "차량 오디오는 병렬로 동작할 수 있는 세 경로로 나뉩니다. 프로세서, 버스, 스피커를 공유할 수 있지만 ANC는 ASR이나 음성 비서의 다음 단계가 아닙니다."),
    paths: [
      { id: "voice", title: l("语音交互", "Voice interaction", "音声対話", "음성 상호작용"), steps: [
        l("麦克风阵列 → 座位方向线索", "Microphone array → seat-direction cues", "マイクアレイ → 座席方向の手がかり", "마이크 어레이 → 좌석 방향 단서"),
        l("定向拾音 / AEC / 降噪 → ASR", "Beamforming / AEC / denoising → ASR", "ビームフォーミング・AEC・ノイズ抑制 → ASR", "빔포밍 / AEC / 잡음 억제 → ASR"),
        l("意图与权限判断 → 控制 / 语音回应", "Intent and permission checks → control / spoken reply", "意図・権限の確認 → 制御・音声応答", "의도 및 권한 확인 → 제어 / 음성 응답")
      ], note: l("方向用于判断来自哪个座位，不等于识别某个人的身份。AEC 消除本车播放回声；扬声器实际播放信号需送作参考。", "Direction helps associate speech with a seat, not establish personal identity. AEC removes echoes of cabin playback using the actual render signal as its reference.", "方向は発話の座席を推定する手がかりであり、個人認証ではありません。AEC は実際の再生信号を参照し、車内再生の回り込みを除去します。", "방향은 발화 좌석의 단서이지 개인 신원 확인이 아닙니다. AEC는 실제 재생 신호를 참조해 차내 재생 에코를 제거합니다.") },
      { id: "spatial", title: l("空间播放", "Spatial playback", "空間再生", "공간 재생"), steps: [
        l("音乐 / 提示音 → 解码 PCM", "Music / prompts → decoded PCM", "音楽・案内音 → 復号 PCM", "음악 / 안내음 → 디코딩 PCM"),
        l("声场渲染 / 分频 / 延迟与增益校准", "Spatial rendering / crossover / delay and gain calibration", "空間レンダリング・帯域分割・遅延とゲインの校正", "공간 렌더링 / 크로스오버 / 지연 및 게인 보정"),
        l("功放 → 多扬声器 → 各座位声场", "Amplifiers → speakers → seat sound field", "アンプ → 複数スピーカー → 各座席の音場", "앰프 → 다중 스피커 → 좌석 음장")
      ], note: l("扬声器数量多不等于所有座位听感相同；需要结合布局、反射和测量调校。安全提示音的可闻性应单独验证。", "More speakers do not guarantee equal sound at every seat; layout, reflections, and measured tuning matter. Verify safety-alert audibility separately.", "スピーカーが多くても全座席で同じ音にはなりません。配置、反射、実測調整が必要です。安全警告音の聞こえ方は別に検証します。", "스피커가 많아도 모든 좌석의 청감이 같지는 않습니다. 배치, 반사, 실측 튜닝이 필요하며 안전 경고음의 가청성은 별도로 검증합니다.") },
      { id: "anc", title: l("主动降噪：前馈 RNC 示例", "Active noise control: feedforward RNC example", "能動騒音制御：フィードフォワード RNC の例", "능동 소음 제어: 피드포워드 RNC 예"), steps: [
        l("振动 / 噪声参考传感器", "Vibration / noise reference sensors", "振動・騒音の参照センサー", "진동 / 소음 참조 센서"),
        l("自适应控制器：考虑次级通道模型", "Adaptive controller: account for the secondary-path model", "適応制御器：二次経路モデルを考慮", "적응 제어기: 2차 경로 모델 고려"),
        l("功放 / 扬声器 → 目标区域噪声叠加", "Amplifier / speaker → superposition in target zone", "アンプ・スピーカー → 対象領域で騒音と重畳", "앰프 / 스피커 → 목표 영역에서 소음과 중첩")
      ], note: l("误差麦克风测量叠加后的残余噪声 → 回馈控制器更新滤波器。只在受控频段和区域内降低噪声；不是简单把波形乘以 −1，也不是识别语音后再处理。", "Error microphones measure residual noise after superposition → feed it back to adapt the filter. Reduction is limited to controlled bands and zones; it is not simply multiplying a waveform by −1 or processing after speech recognition.", "誤差マイクが重畳後の残留騒音を測定 → 制御器へ戻してフィルタを更新します。効果は対象帯域と領域に限られ、単なる符号反転でも音声認識後の処理でもありません。", "오차 마이크가 중첩 후 잔류 소음을 측정 → 제어기로 피드백해 필터를 갱신합니다. 효과는 제어 대역과 영역에 한정되며 단순한 부호 반전이나 음성 인식 후처리가 아닙니다.") }
    ],
    check: l("分开验收：语音看分座位识别与打断，播放看各座位频响和空间定位，ANC 看目标频带残余声压与稳定性。三者不能用同一个“降噪强度”评分代替。", "Evaluate separately: per-seat recognition and barge-in for speech; seat frequency response and spatial placement for playback; residual band sound pressure and stability for ANC. A single denoising-strength score cannot represent all three.", "音声は座席別認識と割り込み、再生は座席別周波数応答と定位、ANC は対象帯域の残留音圧と安定性を別々に評価します。一つのノイズ抑制強度では代用できません。", "음성은 좌석별 인식과 끼어들기, 재생은 좌석별 주파수 응답과 위치감, ANC는 목표 대역 잔류 음압과 안정성으로 각각 평가합니다. 하나의 잡음 억제 강도 점수로 대신할 수 없습니다.")
  },
  "robot-audio": {
    introduction: l("机器人先获取语音与方向线索，再理解请求；能听懂不等于可以立刻执行动作。感知、语言理解和安全控制属于不同职责。", "A robot first acquires speech and direction cues, then interprets the request. Understanding speech does not authorize immediate motion: perception, language understanding, and safety control have distinct responsibilities.", "ロボットは音声と方向の手がかりを取得してから要求を理解します。理解できても直ちに動作してよいとは限りません。知覚、言語理解、安全制御は別の役割です。", "로봇은 음성과 방향 단서를 수집한 뒤 요청을 이해합니다. 이해했다고 즉시 움직여도 되는 것은 아니며 감지, 언어 이해, 안전 제어의 역할은 다릅니다."),
    paths: [{ id: "interaction", title: l("从听到请求到安全回应", "From hearing a request to a safe response", "要求の聴取から安全な応答まで", "요청 청취에서 안전한 응답까지"), steps: [
      l("麦克风 → AEC / 降噪；多麦可定位、定向拾音", "Microphones → AEC / denoising; arrays can localize and beamform", "マイク → AEC・ノイズ抑制；アレイで定位・指向性収音", "마이크 → AEC / 잡음 억제; 어레이는 위치 추정·빔포밍 가능"),
      l("ASR → 意图 / 上下文理解", "ASR → intent / context", "ASR → 意図・文脈理解", "ASR → 의도 / 문맥 이해"),
      l("控制器：权限 / 障碍 / 安全检查", "Controller: permissions / obstacles / safety checks", "制御器：権限・障害物・安全確認", "제어기: 권한 / 장애물 / 안전 확인"),
      l("允许的动作 / TTS / 屏幕反馈", "Authorized action / TTS / display feedback", "許可された動作・TTS・画面応答", "허용된 동작 / TTS / 화면 피드백")
    ], note: l("DOA 估计来声方向，不直接给出身份或可靠距离；测距还需要适用的几何与声学模型或其他传感器。波束成形增强目标方向，AEC 则抑制自身播放回声；这些模块可并行或联合设计。", "DOA estimates arrival direction, not identity or reliable range. Ranging needs suitable geometry and acoustic models or other sensors. Beamforming favors a target direction; AEC suppresses self-playback echo. These modules may be parallel or joint.", "DOA は到来方向の推定であり、個人識別や確実な測距ではありません。測距には適切な幾何・音響モデルや他のセンサーが必要です。ビームフォーミングは対象方向を強調し、AEC は自己再生エコーを抑えます。並列・統合構成も可能です。", "DOA는 도래 방향 추정이며 신원이나 신뢰할 수 있는 거리를 직접 제공하지 않습니다. 측거에는 적절한 기하·음향 모델이나 다른 센서가 필요합니다. 빔포밍은 목표 방향을 강화하고 AEC는 자체 재생 에코를 억제하며 병렬·통합 구현도 가능합니다.") }],
    feedback: l("实际播放 PCM → AEC 参考；电机和风扇噪声不是这路参考，仍需隔振、布局与噪声处理。语音“停止”不能替代硬件急停。", "Actual render PCM → AEC reference. Motor and fan noise is not this reference; isolation, placement, and noise treatment are still needed. A spoken stop cannot replace a hardware emergency stop.", "実際の再生 PCM → AEC 参照。モーターやファンの騒音はこの参照ではないため、防振、配置、騒音処理が必要です。音声の停止命令はハードウェア非常停止の代わりになりません。", "실제 재생 PCM → AEC 참조. 모터·팬 소음은 이 참조가 아니므로 방진, 배치, 잡음 처리가 여전히 필요합니다. 음성 정지는 하드웨어 비상 정지를 대체하지 못합니다."),
    check: l("分别在静止、运动、自身播报时测试方向误差、识别错误和响应延迟；还要测试拒绝越权命令与安全停机。几何方向示意不代表真实定位精度。", "Test direction error, recognition errors, and response delay while stationary, moving, and speaking. Also test unauthorized-command rejection and safe stopping. A geometric direction diagram is not measured localization accuracy.", "静止、移動、自己発話の各状態で方向誤差、認識誤り、応答遅延を測定し、権限外命令の拒否と安全停止も試します。幾何学的方向の図示は実測定位精度ではありません。", "정지, 이동, 자체 발화 상태에서 방향 오차, 인식 오류, 응답 지연을 측정하고 무권한 명령 거부와 안전 정지도 시험합니다. 기하학적 방향 그림은 실측 위치 추정 정확도가 아닙니다.")
  },
  "iot-content": {
    introduction: l("这里是两种独立应用，不是一条从唤醒到剪辑的串行流水线。共同点是使用音频，目标和交付物却不同。", "These are two independent applications, not a serial pipeline from wake-up to editing. Both use audio, but their goals and deliverables differ.", "これは独立した二つの用途であり、ウェイクから編集へ進む一本の工程ではありません。音声を使う点は共通でも、目的と成果物は異なります。", "두 개의 독립된 응용이며 웨이크에서 편집으로 이어지는 직렬 경로가 아닙니다. 오디오를 사용하지만 목표와 결과물은 다릅니다."),
    paths: [
      { id: "sensing", title: l("IoT：感知与设备控制", "IoT: sensing and device control", "IoT：センシングと機器制御", "IoT: 감지와 기기 제어"), steps: [
        l("麦克风 → 低功耗监听 / 唤醒", "Microphone → low-power monitoring / wake", "マイク → 低消費電力監視・ウェイク", "마이크 → 저전력 모니터링 / 웨이크"),
        l("按任务选择：语音理解 或 声音事件识别", "Choose by task: speech understanding OR sound event detection", "用途に応じて選択：音声理解 または 音イベント検出", "작업에 따라 선택: 음성 이해 또는 소리 이벤트 검출"),
        l("阈值 / 确认 / 权限 → 控制或通知", "Threshold / confirmation / permissions → control or notify", "閾値・確認・権限 → 制御または通知", "임계값 / 확인 / 권한 → 제어 또는 알림")
      ], note: l("端侧与云端是部署选择，不是必须串联；声音事件检测也不一定要先唤醒。根据隐私和功耗预算决定是否上传音频或特征，保留误触发处理。", "Edge and cloud are deployment choices, not mandatory consecutive stages. Event detection need not require a wake word. Privacy and power budgets guide audio/feature uploads; handle false triggers.", "エッジとクラウドは配置の選択肢で、必須の直列段ではありません。イベント検出にウェイクワードが不要な場合もあります。プライバシーと電力予算から音声・特徴の送信を決め、誤作動に対処します。", "엣지와 클라우드는 배치 선택이지 필수 직렬 단계가 아닙니다. 이벤트 검출에 웨이크워드가 꼭 필요한 것도 아닙니다. 개인정보·전력 예산에 따라 오디오·특징 전송을 결정하고 오작동을 처리합니다.") },
      { id: "production", title: l("内容创作：录音与成品交付", "Content creation: recording to delivery", "コンテンツ制作：録音から納品まで", "콘텐츠 제작: 녹음에서 납품까지"), steps: [
        l("录音 / 导入 → 保留原始素材", "Record / import → preserve source assets", "録音・読み込み → 原素材を保存", "녹음 / 가져오기 → 원본 보존"),
        l("剪辑 / 降噪 / EQ / 混音", "Edit / denoise / EQ / mix", "編集・ノイズ抑制・EQ・ミックス", "편집 / 잡음 억제 / EQ / 믹싱"),
        l("检查响度与真峰值 → 编码 / 导出", "Check loudness and true peak → encode / export", "ラウドネスとトゥルーピークの確認 → 符号化・書き出し", "라우드니스·트루피크 확인 → 인코딩 / 내보내기")
      ], note: l("处理按素材问题选择，不要求每一步都开启。交付前按目标平台检查格式、响度、真峰值与授权；离线制作能反复试听，不等于设备实时控制。", "Choose processing for the source; not every step is required. Check formats, loudness, true peak, and rights for the target platform. Offline production allows repeated listening and differs from real-time device control.", "素材の問題に応じて処理を選び、全処理を必須にしません。納品先に合わせて形式、ラウドネス、トゥルーピーク、権利を確認します。オフライン制作は繰り返し試聴でき、リアルタイム機器制御とは異なります。", "소스 문제에 맞게 처리하며 모든 단계를 켤 필요는 없습니다. 대상 플랫폼의 형식, 라우드니스, 트루피크, 권리를 확인합니다. 오프라인 제작은 반복 청취가 가능하며 실시간 기기 제어와 다릅니다.") }
    ],
    check: l("IoT 看功耗、漏报、误报和响应时间；内容创作看可懂度、失真、响度与交付兼容性。不要把“识别成功率”和“录音音质”混成一个指标。", "For IoT, measure power, misses, false alarms, and response time. For production, evaluate intelligibility, distortion, loudness, and delivery compatibility. Recognition success and recording quality are different measures.", "IoT は消費電力、見逃し、誤報、応答時間、制作は明瞭度、歪み、ラウドネス、納品互換性を評価します。認識成功率と録音品質は異なる指標です。", "IoT는 전력, 미검출, 오탐, 응답 시간을, 제작은 명료도, 왜곡, 라우드니스, 납품 호환성을 평가합니다. 인식 성공률과 녹음 품질은 서로 다른 지표입니다.")
  }
};
