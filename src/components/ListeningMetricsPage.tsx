import type { ReactNode } from "react";
import { TopicReadingLayout } from "./TopicReadingLayout";
import { ArrowLeft, BookOpen, Ear, Gauge } from "lucide-react";
import { categories, type Language, type LocalizedText } from "../content/knowledge";
import { TopicPager } from "./TopicPager";

type ListeningMetricsPageProps = {
  relatedTopics?: ReactNode;
  language: Language;
  onBack: () => void;
  onOpenLab: () => void;
  onOpenPrevious: () => void;
};

const listeningTopic = categories
  .find((category) => category.id === "fundamentals")
  ?.topics.find((topic) => topic.title.en === "Listening Perception and Metrics")!;

if (!listeningTopic) {
  throw new Error("The listening metrics topic is required for the professional guide.");
}

const perceptionMap = [
  {
    cue: { zh: "忽大忽小", en: "Uneven loudness", ja: "音量が不均一", ko: "음량이 들쭉날쭉함" },
    metric: "LUFS / True Peak",
    check: { zh: "先看时间尺度和峰值余量", en: "Check time scale and peak headroom", ja: "時間尺度とピークのヘッドルームを確認", ko: "시간 척도와 피크 헤드룸을 먼저 확인" }
  },
  {
    cue: { zh: "明亮或浑浊", en: "Bright or muddy", ja: "明るい、またはこもる", ko: "밝거나 탁함" },
    metric: { zh: "频响 / 频谱", en: "Response / spectrum", ja: "周波数特性 / スペクトル", ko: "주파수 응답 / 스펙트럼" },
    check: { zh: "再排除内容与播放设备影响", en: "Then exclude content and playback effects", ja: "次にコンテンツと再生機器の影響を除外", ko: "그다음 콘텐츠와 재생 장치의 영향을 배제" }
  },
  {
    cue: { zh: "底噪明显", en: "Audible noise floor", ja: "ノイズフロアが目立つ", ko: "노이즈 플로어가 뚜렷함" },
    metric: "SNR",
    check: { zh: "注明带宽、计权和测量电平", en: "State bandwidth, weighting, and test level", ja: "帯域幅、重み付け、測定レベルを明記", ko: "대역폭, 가중 방식과 측정 레벨을 명시" }
  },
  {
    cue: { zh: "破音或粗糙", en: "Clipping or roughness", ja: "クリップまたは粗い音", ko: "클리핑 또는 거친 소리" },
    metric: "THD / THD+N",
    check: { zh: "同时看谐波阶次与输入电平", en: "Also inspect harmonic order and input level", ja: "高調波次数と入力レベルも確認", ko: "고조파 차수와 입력 레벨도 확인" }
  },
  {
    cue: { zh: "没有起伏", en: "Flat dynamics", ja: "ダイナミクスが平坦", ko: "다이내믹이 평평함" },
    metric: { zh: "动态范围 / 峰均比", en: "Dynamic range / crest factor", ja: "ダイナミックレンジ / クレストファクター", ko: "다이내믹 레인지 / 크레스트 팩터" },
    check: { zh: "检查阈值、压缩比和增益衰减", en: "Check threshold, ratio, and gain reduction", ja: "しきい値、レシオ、ゲインリダクションを確認", ko: "임계값, 비율과 게인 리덕션을 확인" }
  },
  {
    cue: { zh: "声像偏移", en: "Image shift", ja: "音像のずれ", ko: "음상 이동" },
    metric: "ILD / ITD",
    check: { zh: "区分声道电平差与时间差", en: "Separate level and timing differences", ja: "チャンネル間のレベル差と時間差を区別", ko: "채널 간 레벨 차이와 시간 차이를 구분" }
  }
] as const;

const metricDefinitions = [
  {
    title: "LUFS",
    formula: "K-weighting → mean square → channel weighting → gating / integration",
    note: {
      zh: "LUFS 表示节目响度；真峰值单独用 dBTP 测量。门限用于综合响度测量，LUFS 不是声压级，不能直接换算成 dBSPL。",
      en: "LUFS measures program loudness; true peak is measured separately in dBTP. Gating applies to integrated loudness. LUFS is not SPL and cannot be converted directly to dBSPL.",
      ja: "LUFS は番組ラウドネスを表し、真のピークは dBTP で別に測定します。ゲーティングは統合ラウドネスに適用されます。LUFS は音圧レベルではなく、dBSPL へ直接変換できません。",
      ko: "LUFS는 프로그램 음량을 나타내며 트루 피크는 dBTP로 별도 측정합니다. 게이팅은 통합 음량에 적용됩니다. LUFS는 음압 레벨이 아니므로 dBSPL로 직접 변환할 수 없습니다."
    }
  },
  {
    title: "SNR",
    formula: "SNR = 20 log10(Srms / Nrms) dB",
    note: {
      zh: "适用于同阻抗下的幅度或电压比；比较前必须统一带宽、计权和测量条件。",
      en: "Applies to amplitude or voltage ratios at equal impedance; bandwidth, weighting, and conditions must match.",
      ja: "同じインピーダンスにおける振幅比または電圧比に適用します。比較前に帯域幅、重み付け、測定条件をそろえる必要があります。",
      ko: "같은 임피던스에서의 진폭비 또는 전압비에 적용하며 비교 전에 대역폭, 가중 방식과 측정 조건을 맞춰야 합니다."
    }
  },
  {
    title: "THD",
    formula: "THD = √(V2² + … + Vn²) / V1 × 100%",
    note: {
      zh: "THD 只统计谐波，THD+N 还包含噪声；同一百分比也可能因谐波分布不同而听感不同。",
      en: "THD counts harmonics; THD+N also includes noise. The same percentage can sound different with a different harmonic distribution.",
      ja: "THD は高調波だけを数え、THD+N はノイズも含みます。同じ百分率でも高調波の分布が違えば聴感は変わります。",
      ko: "THD는 고조파만 계산하고 THD+N은 잡음도 포함합니다. 같은 백분율이어도 고조파 분포가 다르면 청감이 달라질 수 있습니다."
    }
  },
  {
    title: { zh: "压缩器静态曲线", en: "Compressor static curve", ja: "コンプレッサーの静特性曲線", ko: "컴프레서 정적 곡선" },
    formula: "Lout = T + (Lin − T) / R,  Lin > T",
    note: {
      zh: "电平以 dB 表示。阈值 T 和压缩比 R 决定稳态增益衰减，Attack / Release 决定随时间如何跟随。",
      en: "Levels are in dB. Threshold T and ratio R set steady-state reduction; attack and release set its timing.",
      ja: "レベルは dB で表します。しきい値 T とレシオ R が定常状態のゲインリダクションを決め、Attack / Release が時間応答を決めます。",
      ko: "레벨은 dB로 표시합니다. 임계값 T와 비율 R이 정상 상태의 게인 리덕션을 정하고 Attack / Release가 시간 응답을 정합니다."
    }
  },
  {
    title: "ILD / ITD",
    formula: "ILD = 20 log10(Lrms / Rrms),  ITD = tL − tR",
    note: {
      zh: "左右电平差和到达时间差是水平方向定位的主要线索；扬声器串音与耳机监听条件不同。",
      en: "Interaural level and arrival-time differences are key horizontal cues; loudspeaker crosstalk differs from headphones.",
      ja: "左右のレベル差と到達時間差は水平方向の定位手掛かりです。スピーカーのクロストーク条件はヘッドホンと異なります。",
      ko: "양이 간 레벨 차이와 도달 시간 차이는 수평 방향 위치를 판단하는 핵심 단서이며 스피커의 크로스토크 조건은 헤드폰과 다릅니다."
    }
  },
  {
    title: "RT60",
    formula: "L(t + RT60) = L(t) − 60 dB",
    note: {
      zh: "实际常从 20 dB 或 30 dB 衰减段外推，避免噪声底阻碍完整 60 dB 测量。",
      en: "In practice it is often extrapolated from a 20 or 30 dB decay because the noise floor can hide a full 60 dB decay.",
      ja: "実際には 20 dB または 30 dB の減衰区間から外挿することが多く、ノイズフロアによって完全な 60 dB 減衰が隠れるのを避けます。",
      ko: "실제로는 20 dB 또는 30 dB 감쇠 구간에서 외삽하는 경우가 많습니다. 노이즈 플로어가 60 dB 전체 감쇠를 가릴 수 있기 때문입니다."
    }
  }
] as const;

const listeningPageCopy = {
  backKnowledge: { zh: "返回知识库", en: "Back to knowledge base", ja: "知識ベースに戻る", ko: "지식 베이스로 돌아가기" },
  kicker: { zh: "音频基础 · 感知与测量", en: "Audio fundamentals · Perception and measurement", ja: "オーディオ基礎 · 知覚と測定", ko: "오디오 기초 · 지각과 측정" },
  perception: { zh: "主观听感", en: "Perception", ja: "主観的な聴感", ko: "주관적 청감" },
  measurement: { zh: "客观测量", en: "Measurement", ja: "客観測定", ko: "객관적 측정" },
  controlledEvaluation: { zh: "受控评价", en: "Controlled evaluation", ja: "統制評価", ko: "통제된 평가" },
  introTitle: { zh: "听感不是某一个数字", en: "Perception is not one number", ja: "聴感は1つの数値ではありません", ko: "청감은 하나의 숫자가 아닙니다" },
  describeTitle: { zh: "先描述现象，再选择指标", en: "Describe first, measure second", ja: "まず現象を記述し、次に指標を選ぶ", ko: "먼저 현상을 설명하고 다음에 지표를 선택하세요" },
  describeBody: {
    zh: "“刺耳”“浑浊”“靠右”是排查线索，不是测量结论。记录内容、播放电平、设备和环境，结果才可复现。",
    en: "Harsh, muddy, or right-heavy are investigation cues, not measurement conclusions. Record content, level, device, and room so results are reproducible.",
    ja: "「刺さる」「こもる」「右に寄る」は調査の手掛かりであり、測定結果ではありません。内容、再生レベル、機器、環境を記録して初めて結果を再現できます。",
    ko: "‘자극적임’, ‘탁함’, ‘오른쪽으로 치우침’은 조사 단서이지 측정 결론이 아닙니다. 콘텐츠, 재생 레벨, 장치와 환경을 기록해야 결과를 재현할 수 있습니다."
  },
  labTitle: { zh: "进入听感实验室", en: "Open the listening lab", ja: "聴感ラボを開く", ko: "청감 실험실 열기" },
  labBody: {
    zh: "切换频响、噪声、失真、压缩和声像，观察教学曲线并试听参数变化。",
    en: "Switch among response, noise, distortion, compression, and stereo image to inspect teaching curves and hear parameter changes.",
    ja: "周波数特性、ノイズ、歪み、コンプレッション、音像を切り替え、学習用の曲線とパラメーター変化を確認・試聴します。",
    ko: "주파수 응답, 잡음, 왜곡, 압축과 음상을 전환해 교육용 곡선을 확인하고 파라미터 변화를 들어 봅니다."
  },
  mapTitle: { zh: "从听到的问题，找到测量入口", en: "Map an audible problem to a measurement", ja: "聴こえる問題を測定項目へつなぐ", ko: "들리는 문제에서 측정 항목 찾기" },
  mapBody: { zh: "指标用于缩小排查范围，不是给音质做单一排名。", en: "Metrics narrow the investigation; they do not provide a single ranking of sound quality.", ja: "指標は調査範囲を絞るためのもので、音質を1つの順位にするものではありません。", ko: "지표는 조사 범위를 좁히는 데 쓰이며 음질을 하나의 순위로 매기지 않습니다." },
  definitionsTitle: { zh: "指标的定义与边界", en: "Definitions and boundaries", ja: "指標の定義と適用範囲", ko: "지표의 정의와 범위" },
  definitionsBody: { zh: "公式只有在参考量、带宽、时间尺度和测量条件一致时才可比较。", en: "A formula is comparable only when reference, bandwidth, time scale, and conditions match.", ja: "基準量、帯域幅、時間尺度、測定条件が一致して初めて式を比較できます。", ko: "기준량, 대역폭, 시간 척도와 측정 조건이 일치할 때만 공식을 비교할 수 있습니다." },
  credibleTitle: { zh: "怎样做可信的听感评价", en: "How to make listening evaluation credible", ja: "信頼できる聴感評価の進め方", ko: "신뢰할 수 있는 청감 평가 방법" },
  credibleBody: { zh: "先控制变量，再盲听，最后用测量解释差异；否则音量更大的版本往往会被误判为更好。", en: "Control variables, listen blind, then use measurements to explain differences; otherwise the louder version is often mistaken for the better one.", ja: "まず変数を統制し、次にブラインド試聴を行い、最後に測定で差を説明します。そうしないと音量の大きい版を良いと誤判定しがちです。", ko: "먼저 변수를 통제하고 블라인드로 들은 뒤 측정으로 차이를 설명하세요. 그렇지 않으면 더 큰 소리의 버전을 더 좋다고 오판하기 쉽습니다." },
  evaluationFlow: { zh: "听感评价流程", en: "Listening evaluation flow", ja: "聴感評価の手順", ko: "청감 평가 절차" }
} satisfies Record<string, LocalizedText>;

const evaluationFlow: Record<Language, string[]> = {
  zh: ["固定播放条件", "匹配响度", "参考与处理盲听", "测量关键指标", "结合场景下结论"],
  en: ["Fix playback conditions", "Level-match", "Blind A/B with reference", "Measure key metrics", "Conclude for the use case"],
  ja: ["再生条件を固定", "ラウドネスを一致", "基準と処理版をブラインド試聴", "主要指標を測定", "用途に即して結論"],
  ko: ["재생 조건 고정", "음량 일치", "기준과 처리 버전을 블라인드 A/B 청취", "핵심 지표 측정", "사용 사례에 맞춰 결론" ]
};

export function ListeningMetricsPage({ relatedTopics, language, onBack, onOpenLab, onOpenPrevious }: ListeningMetricsPageProps) {
  const detail = listeningTopic.detail;

  return (
    <main className="sound-topic-page listening-topic-page" aria-labelledby="listening-topic-title">
      <header className="sound-topic-hero">
        <button className="sound-topic-back" type="button" onClick={onBack}>
          <ArrowLeft size={17} aria-hidden="true" />
          {listeningPageCopy.backKnowledge[language]}
        </button>
        <div className="sound-topic-kicker">
          <BookOpen size={16} aria-hidden="true" />
          {listeningPageCopy.kicker[language]}
        </div>
        <h1 id="listening-topic-title">{listeningTopic.title[language]}</h1>
        <p className="sound-topic-lede">{listeningTopic.summary[language]}</p>
        <div className="sound-topic-meta">
          <span>{listeningPageCopy.perception[language]}</span>
          <span>{listeningPageCopy.measurement[language]}</span>
          <span>{listeningPageCopy.controlledEvaluation[language]}</span>
        </div>
      </header>

      <TopicReadingLayout language={language}>
        <section className="sound-topic-section sound-topic-intro">

          <div>
            <h2>{listeningPageCopy.introTitle[language]}</h2>
            <p>{detail.explanation[language]}</p>
          </div>
        </section>

        <section className="sound-topic-section sound-topic-bottom-grid">
          <div>
            <h2>{listeningPageCopy.describeTitle[language]}</h2>
            <p>{listeningPageCopy.describeBody[language]}</p>
          </div>
          <div className="sound-topic-cta">
            <Ear size={22} aria-hidden="true" />
            <h2>{listeningPageCopy.labTitle[language]}</h2>
            <p>{listeningPageCopy.labBody[language]}</p>
            <button className="diagram-open-button" type="button" onClick={onOpenLab}>
              <Gauge size={16} aria-hidden="true" />
              {detail.lab?.buttonLabel[language]}
            </button>
          </div>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading">

            <div>
              <h2>{listeningPageCopy.mapTitle[language]}</h2>
              <p>{listeningPageCopy.mapBody[language]}</p>
            </div>
          </div>
          <div className="digital-topic-codec-grid listening-topic-map">
            {perceptionMap.map((item) => (
              <article key={typeof item.metric === "string" ? item.metric : item.metric.en}>
                <div>
                  <h3>{item.cue[language]}</h3>
                  <strong>{typeof item.metric === "string" ? item.metric : item.metric[language]}</strong>
                </div>
                <p>{item.check[language]}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading">

            <div>
              <h2>{listeningPageCopy.definitionsTitle[language]}</h2>
              <p>{listeningPageCopy.definitionsBody[language]}</p>
            </div>
          </div>
          <div className="digital-topic-equation-grid listening-topic-equations">
            {metricDefinitions.map((metric) => (
              <article className="digital-topic-equation-card" key={typeof metric.title === "string" ? metric.title : metric.title.en}>
                <span>{typeof metric.title === "string" ? metric.title : metric.title[language]}</span>
                <code>{metric.formula}</code>
                <p>{metric.note[language]}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading">

            <div>
              <h2>{listeningPageCopy.credibleTitle[language]}</h2>
              <p>{listeningPageCopy.credibleBody[language]}</p>
            </div>
          </div>
          <ol className="sound-topic-flow listening-topic-flow" aria-label={listeningPageCopy.evaluationFlow[language]}>
            {evaluationFlow[language].map((step, index) => (
              <li key={step}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{step}</strong>
              </li>
            ))}
          </ol>
          <p className="sound-topic-note">{detail.misconception[language]}</p>
        </section>

      </TopicReadingLayout>
      {relatedTopics}
      <TopicPager language={language} onPrevious={onOpenPrevious} onBack={onBack} />
    </main>
  );
}
