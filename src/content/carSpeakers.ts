import type { LocalizedText } from "./knowledge";
import { traditional } from "./traditional";

const l = (zh: string, en: string, ja: string, ko: string): LocalizedText => ({
  zh,
  "zh-Hant": traditional(zh),
  en,
  ja,
  ko
});

type CarSpeaker = {
  id: string;
  position: [number, number, number];
  kind: "tweeter" | "center" | "door" | "sub";
  title: LocalizedText;
  purpose: LocalizedText;
};

export const carSpeakers: CarSpeaker[] = [
  {
    id: "front-left-tweeter",
    position: [-1.05, 1.3, -1.4],
    kind: "tweeter",
    title: l("左前高音", "Front-left tweeter", "左前ツイーター", "좌측 전면 트위터"),
    purpose: l(
      "高音扬声器呈现高频细节与方向线索，帮助听者定位声像。",
      "The tweeter presents high-frequency detail and directional cues that help place the sound image.",
      "ツイーターは高域の細部と方向手掛かりを再生し、音像の位置を捉えやすくします。",
      "트위터는 고역의 세부 정보와 방향 단서를 재생해 음상의 위치를 파악하도록 돕습니다."
    )
  },
  {
    id: "front-right-tweeter",
    position: [1.05, 1.3, -1.4],
    kind: "tweeter",
    title: l("右前高音", "Front-right tweeter", "右前ツイーター", "우측 전면 트위터"),
    purpose: l(
      "高音扬声器呈现高频细节与方向线索，帮助听者定位声像。",
      "The tweeter presents high-frequency detail and directional cues that help place the sound image.",
      "ツイーターは高域の細部と方向手掛かりを再生し、音像の位置を捉えやすくします。",
      "트위터는 고역의 세부 정보와 방향 단서를 재생해 음상의 위치를 파악하도록 돕습니다."
    )
  },
  {
    id: "center",
    position: [0, 1.08, -1.55],
    kind: "center",
    title: l("中置扬声器", "Center speaker", "センタースピーカー", "센터 스피커"),
    purpose: l(
      "中置可按混音与系统调校策略辅助稳定前方声场，尤其帮助人声保持居中。它不代表所有人声只由中置播放。",
      "The center speaker can help stabilize the front soundstage, especially vocal placement, according to the mix and system tuning. It does not mean every vocal is played only by the center speaker.",
      "センタースピーカーは、ミックスとシステム調整の方針に応じて前方音場を安定させ、とくにボーカルを中央に保つのを助けます。すべてのボーカルをセンターだけで再生する意味ではありません。",
      "센터 스피커는 믹스와 시스템 튜닝 전략에 따라 전면 음장을 안정시키고 특히 보컬을 중앙에 배치하도록 돕습니다. 모든 보컬이 센터에서만 재생된다는 뜻은 아닙니다."
    )
  },
  {
    id: "front-left-door",
    position: [-1.17, 0.9, -0.65],
    kind: "door",
    title: l("左前门扬声器", "Front-left door speaker", "左前ドアスピーカー", "좌측 전면 도어 스피커"),
    purpose: l(
      "门板扬声器通常承担中低频与部分整体能量，具体分频取决于系统设计。",
      "A door speaker commonly handles mid and low content plus part of the overall energy; its crossover depends on the system design.",
      "ドアスピーカーは一般に中低域と全体の一部を担いますが、クロスオーバーはシステム設計で決まります。",
      "도어 스피커는 보통 중저역과 전체 에너지의 일부를 담당하며, 크로스오버는 시스템 설계에 따라 정해집니다."
    )
  },
  {
    id: "front-right-door",
    position: [1.17, 0.9, -0.65],
    kind: "door",
    title: l("右前门扬声器", "Front-right door speaker", "右前ドアスピーカー", "우측 전면 도어 스피커"),
    purpose: l(
      "门板扬声器通常承担中低频与部分整体能量，具体分频取决于系统设计。",
      "A door speaker commonly handles mid and low content plus part of the overall energy; its crossover depends on the system design.",
      "ドアスピーカーは一般に中低域と全体の一部を担いますが、クロスオーバーはシステム設計で決まります。",
      "도어 스피커는 보통 중저역과 전체 에너지의 일부를 담당하며, 크로스오버는 시스템 설계에 따라 정해집니다."
    )
  },
  {
    id: "rear-left-door",
    position: [-1.17, 0.9, 1.15],
    kind: "door",
    title: l("左后门扬声器", "Rear-left door speaker", "左後ドアスピーカー", "좌측 후면 도어 스피커"),
    purpose: l(
      "后门扬声器补充后排覆盖与整体空间感，不等于独立隔音区。",
      "Rear door speakers add rear-seat coverage and overall spaciousness; they do not create an independent sound-isolation zone.",
      "リアドアスピーカーは後席のカバレッジと全体の広がりを補いますが、独立した遮音ゾーンを作るものではありません。",
      "후면 도어 스피커는 뒷좌석 커버리지와 전체 공간감을 보완하지만, 독립적인 방음 구역을 만드는 것은 아닙니다."
    )
  },
  {
    id: "rear-right-door",
    position: [1.17, 0.9, 1.15],
    kind: "door",
    title: l("右后门扬声器", "Rear-right door speaker", "右後ドアスピーカー", "우측 후면 도어 스피커"),
    purpose: l(
      "后门扬声器补充后排覆盖与整体空间感，不等于独立隔音区。",
      "Rear door speakers add rear-seat coverage and overall spaciousness; they do not create an independent sound-isolation zone.",
      "リアドアスピーカーは後席のカバレッジと全体の広がりを補いますが、独立した遮音ゾーンを作るものではありません。",
      "후면 도어 스피커는 뒷좌석 커버리지와 전체 공간감을 보완하지만, 독립적인 방음 구역을 만드는 것은 아닙니다."
    )
  },
  {
    id: "sub",
    position: [0, 1.05, 2.0],
    kind: "sub",
    title: l("低音炮", "Subwoofer", "サブウーファー", "서브우퍼"),
    purpose: l(
      "这里的低音炮用于补充音乐低频。单纯播放低音不等于 ANC；若作为主动降噪输出，还需要相应的参考信号、误差反馈与控制算法。",
      "Here the subwoofer supplements music bass. Playing bass is not ANC; using it as a noise-control output also requires suitable reference signals, error feedback, and a control algorithm.",
      "ここでは音楽の低域を補います。低音の再生だけでは ANC になりません。制御音の出力に使うには、適切な参照信号、誤差フィードバック、制御アルゴリズムも必要です。",
      "여기서는 음악의 저역을 보완합니다. 저음 재생만으로 ANC가 되지는 않습니다. 소음 제어 출력으로 사용하려면 적절한 참조 신호, 오차 피드백, 제어 알고리즘도 필요합니다."
    )
  }
];
