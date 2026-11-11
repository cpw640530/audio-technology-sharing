import { traditional } from "../content/traditional";
import type { Language } from "../content/knowledge";

type Locale = "zh" | "en" | "ja" | "ko" | "zh-Hant";
type LocalizedText = Record<Locale, string>;

const l = (zh: string, en: string, ja: string, ko: string): LocalizedText => ({ zh, "zh-Hant": traditional(zh), en, ja, ko });

const issueCards = [
  {
    title: l("误唤醒", "False wake", "誤ウェイク", "오작동 웨이크업"),
    cause: l("常见原因是唤醒词太短、环境噪声相似、播放内容里出现近似词、阈值过低，或麦克风结构导致远场噪声被放大。", "Common causes include short wake words, similar environmental sounds, near-matches in playback, too-low thresholds, or microphone design that emphasizes far-field noise.", "よくある原因は、短すぎるウェイクワード、似た環境音、再生中の類似語、低すぎる閾値、遠方ノイズを強調するマイク構造です。", "흔한 원인은 짧은 웨이크 워드, 유사한 환경음, 재생 중 비슷한 단어, 너무 낮은 임계값 또는 원거리 잡음을 강조하는 마이크 구조입니다."),
    checks: [
      l("先看误唤醒音频是不是来自真实人声、电视/音箱回放，还是环境噪声。", "First classify whether false wakes come from human speech, TV/speaker playback, or environmental noise.", "まず誤ウェイク音声が実際の話し声、テレビ・スピーカー再生、環境ノイズのどれかを分類します。", "먼저 오작동 웨이크 음성이 실제 사람 목소리인지, TV·스피커 재생인지, 환경 잡음인지 분류합니다."),
      l("再看唤醒阈值和二次确认。AEC 需要本机实际播放参考，不能默认消除没有参考的外部电视声。", "Then check wake threshold and confirmation. AEC needs the device's actual playback reference; it cannot be assumed to cancel an external TV without a reference.", "次にウェイク閾値と再確認を調べます。AEC には端末の実際の再生参照が必要で、参照のない外部テレビ音を消せるとは限りません。", "그다음 웨이크 임계값과 확인 단계를 점검합니다. AEC에는 기기의 실제 재생 참조가 필요하며 참조 없는 외부 TV 소리를 제거한다고 가정할 수 없습니다."),
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

type IotTroubleshootingProps = {
  language: Language;
};

export function IotTroubleshooting({ language }: IotTroubleshootingProps) {
  const heading = l("典型问题诊断", "Common Issue Troubleshooting", "典型的な問題の診断", "일반 문제 진단");

  return (
    <section className="sound-topic-section iot-troubleshooting" aria-label={heading[language]}>
      <h2>{heading[language]}</h2>
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
  );
}
