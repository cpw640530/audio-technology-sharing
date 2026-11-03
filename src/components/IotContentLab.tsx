import { ArrowLeft } from "lucide-react";
import type { Language } from "../content/knowledge";

type IotContentLabProps = {
  language: Language;
  onBack: () => void;
  onBackToDetails?: () => void;
};

type Locale = "zh" | "en" | "ja" | "ko";
type LocalizedText = Record<Locale, string>;

const l = (zh: string, en: string, ja: string, ko: string): LocalizedText => ({ zh, en, ja, ko });

const issueCards = [
  {
    title: l("误唤醒", "False wake", "誤ウェイク", "오작동 웨이크업"),
    cause: l("常见原因是唤醒词太短、环境噪声相似、播放内容里出现近似词、阈值过低，或麦克风结构导致远场噪声被放大。", "Common causes include short wake words, similar environmental sounds, near-matches in playback, too-low thresholds, or microphone design that emphasizes far-field noise.", "よくある原因は、短すぎるウェイクワード、似た環境音、再生中の類似語、低すぎる閾値、遠方ノイズを強調するマイク構造です。", "흔한 원인은 짧은 웨이크 워드, 유사한 환경음, 재생 중 비슷한 단어, 너무 낮은 임계값 또는 원거리 잡음을 강조하는 마이크 구조입니다."),
    checks: [
      l("先看误唤醒音频是不是来自真实人声、电视/音箱回放，还是环境噪声。", "First classify whether false wakes come from human speech, TV/speaker playback, or environmental noise.", "まず誤ウェイク音声が実際の話し声、テレビ・スピーカー再生、環境ノイズのどれかを分類します。", "먼저 오작동 웨이크 음성이 실제 사람 목소리인지, TV·스피커 재생인지, 환경 잡음인지 분류합니다."),
      l("再看唤醒阈值、二次确认和回放 AEC 是否开启。", "Then inspect wake threshold, second-stage confirmation, and playback AEC.", "次にウェイク閾値、二段階確認、再生 AEC の有効状態を確認します。", "그다음 웨이크 임계값, 2단계 확인, 재생 AEC 활성화 여부를 확인합니다."),
      l("最后看低功耗模型是否覆盖目标语言、口音和家庭噪声。", "Finally check whether the low-power model covers target languages, accents, and household noise.", "最後に低消費電力モデルが対象言語、訛り、家庭内ノイズをカバーしているか確認します。", "마지막으로 저전력 모델이 대상 언어, 억양, 가정 잡음을 포함하는지 확인합니다.")
    ]
  },
  {
    title: l("直播声音忽大忽小", "Live level jumps", "ライブ音量が揺れる", "라이브 음량 변동"),
    cause: l("可能来自麦克风距离变化、AGC 泵动、压缩器释放时间不合适、背景音乐 ducking 过强，或平台二次响度处理。", "It can come from changing mic distance, AGC pumping, unsuitable compressor release, excessive music ducking, or platform-side loudness processing.", "マイク距離の変化、AGC のポンピング、不適切なコンプレッサーのリリース時間、強すぎる BGM のダッキング、配信プラットフォームの二次ラウドネス処理が原因かもしれません。", "마이크 거리 변화, AGC 펌핑, 부적절한 컴프레서 릴리스 시간, 과도한 배경 음악 덕킹 또는 플랫폼의 2차 라우드니스 처리가 원인일 수 있습니다."),
    checks: [
      l("先固定麦克风距离和输入增益，确认原始电平是否稳定。", "First fix microphone distance and input gain, then check raw level stability.", "まずマイク距離と入力ゲインを固定し、元のレベルが安定しているか確認します。", "먼저 마이크 거리와 입력 게인을 고정하고 원래 레벨이 안정적인지 확인합니다."),
      l("再旁路 AGC、压缩、限幅和 ducking，定位哪个模块在拉扯音量。", "Then bypass AGC, compression, limiting, and ducking to locate which module is moving the level.", "次に AGC、圧縮、リミッター、ダッキングをバイパスし、どのモジュールが音量を動かしているか特定します。", "그다음 AGC, 압축, 리미팅, 덕킹을 우회해 어느 모듈이 레벨을 움직이는지 찾습니다."),
      l("最后按平台响度目标导出或推流，避免二次处理过大。", "Finally export or stream against the platform loudness target to avoid heavy second-stage processing.", "最後にプラットフォームのラウドネス目標に合わせて書き出し・配信し、二次処理を強くしすぎないようにします。", "마지막으로 플랫폼 라우드니스 목표에 맞춰 내보내거나 스트리밍해 2차 처리가 과하지 않게 합니다.")
    ]
  },
  {
    title: l("AI 配音不自然", "Unnatural AI dubbing", "AI 吹き替えが不自然", "부자연스러운 AI 더빙"),
    cause: l("通常和文本断句、情绪标签、说话速度、专有名词读音、声线选择、背景音乐掩蔽和后期混音有关。", "Usually related to text segmentation, emotion tags, speaking rate, proper-noun pronunciation, voice choice, music masking, and post mix.", "テキストの区切り、感情タグ、話速、固有名詞の発音、声質の選択、BGM のマスキング、ポストミックスに関係することが多いです。", "대개 텍스트 구분, 감정 태그, 말하기 속도, 고유명사 발음, 음색 선택, 배경 음악 마스킹, 후반 믹싱과 관련됩니다."),
    checks: [
      l("先把长句拆成自然口语短句，并标出停顿和重音。", "First split long sentences into natural spoken phrases and mark pauses or emphasis.", "まず長い文を自然な口語の短文に分け、ポーズと強勢を示します。", "먼저 긴 문장을 자연스러운 구어 단위로 나누고 멈춤과 강세를 표시합니다."),
      l("再检查专有名词、数字、英文缩写和多音字读音。", "Then check proper nouns, numbers, acronyms, and ambiguous pronunciations.", "次に固有名詞、数字、英字略語、多音字の読みを確認します。", "그다음 고유명사, 숫자, 영어 약어, 여러 발음이 가능한 글자의 발음을 확인합니다."),
      l("最后用 EQ、压缩和响度匹配让配音融入原始内容。", "Finally use EQ, compression, and loudness matching to make the dubbing sit in the original content.", "最後に EQ、コンプレッション、ラウドネスマッチングで吹き替えを元のコンテンツになじませます。", "마지막으로 EQ, 컴프레션, 라우드니스 매칭으로 더빙이 원본 콘텐츠에 어울리게 합니다.")
    ]
  }
] satisfies Array<{ title: LocalizedText; cause: LocalizedText; checks: LocalizedText[] }>;

function IotContentWorkflowDiagram({ language }: { language: Language }) {
  const t = (zh: string, en: string, ja: string, ko: string) => ({ zh, en, ja, ko })[language];
  return (
    <figure className="iot-content-diagram">
      <svg
        aria-label={t("IoT 与内容创作双路径音频流程图", "IoT and content creation dual-path audio workflow diagram", "IoT とコンテンツ制作の二経路オーディオフロー図", "IoT 및 콘텐츠 제작 이중 경로 오디오 흐름도")}
        role="img"
        viewBox="0 0 980 560"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <marker id="iotArrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
            <path d="M0 0 8 4 0 8Z" fill="#1f7569" />
          </marker>
          <marker id="creatorArrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
            <path d="M0 0 8 4 0 8Z" fill="#b44c6d" />
          </marker>
        </defs>
        <rect className="iot-diagram-bg" height="560" rx="18" width="980" />
        <text className="iot-diagram-title" x="40" y="46">
          {t("同样是音频，IoT 追求实时控制，内容创作追求可编辑交付", "The same audio tools serve real-time IoT control and editable creator delivery", "同じオーディオでも、IoT はリアルタイム制御、コンテンツ制作は編集可能な納品を重視します", "같은 오디오라도 IoT는 실시간 제어를, 콘텐츠 제작은 편집 가능한 납품을 중시합니다")}
        </text>

        <text className="iot-lane-title" x="48" y="96">{t("IoT 语音控制路径", "IoT voice control path", "IoT 音声制御経路", "IoT 음성 제어 경로")}</text>
        <rect className="iot-flow-box capture" height="62" rx="10" width="124" x="48" y="118" />
        <text className="iot-box-title" x="110" y="143" textAnchor="middle">{t("低功耗监听", "Low-power listen", "低消費電力リスニング", "저전력 청취")}</text>
        <text className="iot-box-sub" x="110" y="164" textAnchor="middle">mic + DSP</text>

        <rect className="iot-flow-box wake" height="62" rx="10" width="124" x="206" y="118" />
        <text className="iot-box-title" x="268" y="143" textAnchor="middle">{t("本地唤醒词", "Local wake word", "ローカルウェイクワード", "로컬 웨이크 워드")}</text>
        <text className="iot-box-sub" x="268" y="164" textAnchor="middle">{t("低功耗模型", "tiny model", "小型低消費電力モデル", "저전력 소형 모델")}</text>

        <rect className="iot-flow-box command" height="62" rx="10" width="124" x="364" y="118" />
        <text className="iot-box-title" x="426" y="143" textAnchor="middle">{t("命令识别", "Command ASR", "コマンド認識", "명령 인식")}</text>
        <text className="iot-box-sub" x="426" y="164" textAnchor="middle">{t("本地 / 云端", "edge / cloud", "エッジ / クラウド", "엣지 / 클라우드")}</text>

        <rect className="iot-flow-box policy" height="62" rx="10" width="124" x="522" y="118" />
        <text className="iot-box-title" x="584" y="143" textAnchor="middle">{t("意图与权限", "Intent + policy", "意図とポリシー", "의도와 정책")}</text>
        <text className="iot-box-sub" x="584" y="164" textAnchor="middle">{t("安全控制", "safe control", "安全制御", "안전 제어")}</text>

        <rect className="iot-flow-box action" height="62" rx="10" width="124" x="680" y="118" />
        <text className="iot-box-title" x="742" y="143" textAnchor="middle">{t("设备动作", "Device action", "デバイス操作", "기기 동작")}</text>
        <text className="iot-box-sub" x="742" y="164" textAnchor="middle">{t("灯 / 锁 / 家电", "light / lock / IoT", "照明 / ロック / 家電", "조명 / 잠금장치 / IoT")}</text>

        <rect className="iot-flow-box feedback" height="62" rx="10" width="124" x="838" y="118" />
        <text className="iot-box-title" x="900" y="143" textAnchor="middle">{t("语音反馈", "Voice response", "音声フィードバック", "음성 응답")}</text>
        <text className="iot-box-sub" x="900" y="164" textAnchor="middle">TTS / beep</text>

        <path className="iot-arrow" d="M172 149 H206" markerEnd="url(#iotArrow)" />
        <path className="iot-arrow" d="M330 149 H364" markerEnd="url(#iotArrow)" />
        <path className="iot-arrow" d="M488 149 H522" markerEnd="url(#iotArrow)" />
        <path className="iot-arrow" d="M646 149 H680" markerEnd="url(#iotArrow)" />
        <path className="iot-arrow" d="M804 149 H838" markerEnd="url(#iotArrow)" />

        <rect className="iot-note-box" height="58" rx="12" width="390" x="48" y="216" />
        <text className="iot-note-title" x="70" y="240">{t("IoT 关键约束", "IoT constraints", "IoT の主要制約", "IoT 핵심 제약")}</text>
        <text className="iot-note-copy" x="70" y="262">
          {t("功耗、误唤醒、漏唤醒、隐私、联网失败、端侧算力", "Power, false wakes, misses, privacy, network failure, edge compute", "消費電力、誤ウェイク、検出漏れ、プライバシー、接続失敗、エッジ計算量", "전력, 오작동 웨이크, 미검출, 개인정보, 네트워크 실패, 엣지 연산")}
        </text>

        <text className="creator-lane-title" x="48" y="334">{t("内容创作生产路径", "Content creation production path", "コンテンツ制作の生産経路", "콘텐츠 제작 생산 경로")}</text>
        <rect className="creator-flow-box capture" height="62" rx="10" width="124" x="48" y="356" />
        <text className="creator-box-title" x="110" y="381" textAnchor="middle">{t("录音 / 导入", "Record / import", "録音 / インポート", "녹음 / 가져오기")}</text>
        <text className="creator-box-sub" x="110" y="402" textAnchor="middle">voice / music</text>

        <rect className="creator-flow-box clean" height="62" rx="10" width="124" x="206" y="356" />
        <text className="creator-box-title" x="268" y="381" textAnchor="middle">{t("降噪 / 清理", "Denoise / clean", "ノイズ抑制 / クリーンアップ", "잡음 억제 / 정리")}</text>
        <text className="creator-box-sub" x="268" y="402" textAnchor="middle">{t("底噪 / 爆音", "noise / plosive", "フロアノイズ / 破裂音", "바닥 잡음 / 파열음")}</text>

        <rect className="creator-flow-box edit" height="62" rx="10" width="124" x="364" y="356" />
        <text className="creator-box-title" x="426" y="381" textAnchor="middle">{t("剪辑 / 修音", "Edit / polish", "編集 / 音の調整", "편집 / 다듬기")}</text>
        <text className="creator-box-sub" x="426" y="402" textAnchor="middle">EQ / de-ess</text>

        <rect className="creator-flow-box mix" height="62" rx="10" width="124" x="522" y="356" />
        <text className="creator-box-title" x="584" y="381" textAnchor="middle">{t("压缩 / 混音", "Compress / mix", "コンプレッション / ミックス", "압축 / 믹싱")}</text>
        <text className="creator-box-sub" x="584" y="402" textAnchor="middle">{t("动态 / 音乐", "dynamics / music", "ダイナミクス / 音楽", "다이내믹 / 음악")}</text>

        <rect className="creator-flow-box master" height="62" rx="10" width="124" x="680" y="356" />
        <text className="creator-box-title" x="742" y="381" textAnchor="middle">{t("母带 / 响度", "Master / loudness", "マスタリング / ラウドネス", "마스터링 / 라우드니스")}</text>
        <text className="creator-box-sub" x="742" y="402" textAnchor="middle">LUFS / true peak</text>

        <rect className="creator-flow-box export" height="62" rx="10" width="124" x="838" y="356" />
        <text className="creator-box-title" x="900" y="381" textAnchor="middle">{t("多平台导出", "Multi-platform export", "複数プラットフォームへ書き出し", "다중 플랫폼 내보내기")}</text>
        <text className="creator-box-sub" x="900" y="402" textAnchor="middle">podcast / video</text>

        <path className="creator-arrow" d="M172 387 H206" markerEnd="url(#creatorArrow)" />
        <path className="creator-arrow" d="M330 387 H364" markerEnd="url(#creatorArrow)" />
        <path className="creator-arrow" d="M488 387 H522" markerEnd="url(#creatorArrow)" />
        <path className="creator-arrow" d="M646 387 H680" markerEnd="url(#creatorArrow)" />
        <path className="creator-arrow" d="M804 387 H838" markerEnd="url(#creatorArrow)" />

        <rect className="creator-note-box" height="58" rx="12" width="442" x="488" y="456" />
        <text className="creator-note-title" x="510" y="480">{t("创作关键约束", "Creator constraints", "制作上の主要制約", "제작 핵심 제약")}</text>
        <text className="creator-note-copy" x="510" y="502">
          {t("响度一致、可编辑、情绪自然、版权清晰、平台规格匹配", "Consistent loudness, editability, natural emotion, clear rights, platform specs", "ラウドネスの一貫性、編集性、自然な感情、明確な権利、プラットフォーム仕様への適合", "일관된 라우드니스, 편집 가능성, 자연스러운 감정, 명확한 권리, 플랫폼 규격 일치")}
        </text>
      </svg>
      <figcaption>
        {t("上半部分强调 IoT 语音从低功耗监听到设备动作，关键是少耗电、少误触、快响应；下半部分强调内容创作从素材到交付，关键是好听、可改、响度稳定。", "The upper path emphasizes IoT voice from low-power listening to device action, where low power, low false triggers, and fast response matter. The lower path emphasizes creator production from source material to delivery, where quality, editability, and stable loudness matter.", "上段は低消費電力リスニングからデバイス操作までの IoT 音声を扱い、省電力、誤操作の少なさ、素早い応答が要点です。下段は素材から納品までの制作を扱い、聴感、編集性、安定したラウドネスが要点です。", "위쪽 경로는 저전력 청취부터 기기 동작까지 IoT 음성을 다루며 낮은 전력, 적은 오작동, 빠른 응답이 중요합니다. 아래쪽 경로는 원본부터 납품까지 제작을 다루며 좋은 음질, 편집 가능성, 안정적인 라우드니스가 중요합니다.")}
      </figcaption>
    </figure>
  );
}

export function IotContentLab({ language, onBack, onBackToDetails }: IotContentLabProps) {
  const t = (zh: string, en: string, ja: string, ko: string) => ({ zh, en, ja, ko })[language];
  return (
    <main className="iot-content-lab-page" aria-label={t("IoT 与内容创作实验室", "IoT and Content Creation Lab", "IoT とコンテンツ制作ラボ", "IoT 및 콘텐츠 제작 실험실")}>
      <section className="sound-lab-hero iot-content-lab-hero">
        <div className="sound-lab-back-actions">
          <button className="sound-lab-back sound-lab-back-secondary" type="button" onClick={onBack}>
            {t("返回知识库", "Back to knowledge base", "ナレッジベースに戻る", "지식 베이스로 돌아가기")}
          </button>
          {onBackToDetails && <button className="sound-lab-back" type="button" onClick={onBackToDetails}>
            <ArrowLeft size={18} aria-hidden="true" />
            {t("返回详细内容", "Back to detailed content", "詳細コンテンツに戻る", "상세 내용으로 돌아가기")}
          </button>}
        </div>
        <div>
          <span className="details-category">{t("应用场景", "Applications", "アプリケーション", "응용 분야")}</span>
          <h1>{t("IoT 与内容创作实验室", "IoT and Content Creation Lab", "IoT とコンテンツ制作ラボ", "IoT 및 콘텐츠 제작 실험실")}</h1>
          <p>
            {t("先看双路径图，再用典型问题诊断验证 IoT 语音和内容创作的不同约束。", "Start with the dual-path diagram, then use the issue cards to test the different constraints of IoT voice and creator audio.", "まず二経路図を確認し、典型的な問題カードで IoT 音声とコンテンツ制作の異なる制約を検証します。", "먼저 이중 경로 그림을 보고 일반적인 문제 카드로 IoT 음성과 제작 오디오의 서로 다른 제약을 확인합니다.")}
          </p>
        </div>
      </section>

      <section className="iot-content-diagram-section" aria-label={t("IoT 与内容创作双路径流程", "IoT and content creation dual-path workflow", "IoT とコンテンツ制作の二経路フロー", "IoT 및 콘텐츠 제작 이중 경로 흐름")}>
        <IotContentWorkflowDiagram language={language} />
      </section>

      <section className="iot-content-issue-section" aria-label={t("IoT 与内容创作典型问题诊断", "IoT and content creation troubleshooting", "IoT とコンテンツ制作の典型問題診断", "IoT 및 콘텐츠 제작 일반 문제 진단")}>
        <div className="iot-content-section-heading">
          <span>{t("排查思路", "Troubleshooting", "トラブルシューティング", "문제 해결")}</span>
          <h2>{t("典型问题诊断", "Common Issue Troubleshooting", "典型的な問題の診断", "일반 문제 진단")}</h2>
        </div>
        <div className="iot-content-issue-grid">
          {issueCards.map((issue) => (
            <article className="iot-content-issue-card" key={issue.title.en}>
              <h3>{issue.title[language]}</h3>
              <p>{issue.cause[language]}</p>
              <ol>
                {issue.checks.map((check) => (
                  <li key={check.en}>{check[language]}</li>
                ))}
              </ol>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
