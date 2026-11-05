import { lazy, Suspense, type ReactNode } from "react";
import { ArrowLeft, BookOpen, Waves } from "lucide-react";
import { text } from "../content/language";
import { categories, type Language } from "../content/knowledge";
import { TopicReadingLayout } from "./TopicReadingLayout";
import { TopicPager } from "./TopicPager";
import { SoundPropagationDiagram } from "./SoundPropagationDiagram";
import { SoundCompositionExperiment } from "./SoundCompositionExperiment";

const SoundGasExperiment = lazy(() => import("./SoundGasExperiment"));
const soundTopic = categories.find(category => category.id === "fundamentals")!.topics.find(topic => topic.title.en === "What Sound Is")!;

export function SoundTopicPage({ relatedTopics, language, onBack, onOpenLab, onOpenNext }: {
  relatedTopics?: ReactNode; language: Language; onBack: () => void; onOpenLab: () => void; onOpenNext: () => void;
}) {
  const t = (zh: string, en: string, ja: string, ko: string) => text(language, zh, en, ja, ko);
  return <main className="sound-topic-page sound-story-page" aria-labelledby="sound-topic-title">
    <header className="sound-topic-hero">
      <button className="sound-topic-back" type="button" onClick={onBack}><ArrowLeft size={17} aria-hidden="true" />{t("返回知识库", "Back to knowledge base", "知識ベースに戻る", "지식 모음으로 돌아가기")}</button>
      <div className="sound-topic-kicker"><BookOpen size={16} />{t("声音入门 · 交互阅读", "Sound fundamentals · Interactive reading", "音の基礎 · 対話型解説", "소리 입문 · 인터랙티브 읽기")}</div>
      <h1 id="sound-topic-title">{soundTopic.title[language]}</h1>
      <p className="sound-topic-lede">{t("空气为什么能把一句话送到远处？从看不见的分子开始，亲手改变条件，跟着一段扰动走到声压、传播和音高。", "How does air carry a spoken word? Start with invisible molecules, change the conditions, and follow a disturbance toward pressure, propagation and pitch.", "空気はどうやって言葉を運ぶのでしょう？分子から始め、条件を変えながら音圧、伝播、音の高さへ進みます。", "공기는 어떻게 말을 전달할까요? 보이지 않는 분자부터 조건을 바꾸며 음압, 전파, 음높이까지 따라가 봅니다.")}</p>
      <p>{t("不是先背公式，而是每次回答一个问题：什么在运动，什么在传播，我们又记录了什么？", "Rather than memorize a formula first, ask: what moves, what travels, and what are we recording?", "式を覚える前に、何が動き、何が伝わり、何を記録しているかを考えます。", "공식을 외우기 전에 무엇이 움직이고 전달되며 무엇을 기록하는지 살펴봅니다.")}</p>
      <button className="diagram-open-button" type="button" onClick={onOpenLab}><Waves size={18} />{soundTopic.detail.lab?.buttonLabel[language]}</button>
    </header>
    <TopicReadingLayout language={language}>
      <section className="sound-topic-section">
        <h2>{t("1. 声音是什么？", "1. What is sound?", "1. 音とは何か？", "1. 소리란 무엇인가요?")}</h2>
        <p><strong>{t("声音是一种在介质中传播的机械扰动。在空气中，它主要表现为压力与密度的起伏。", "Sound is a mechanical disturbance traveling through a medium. In air, it appears as variations in pressure and density.", "音は媒質を伝わる力学的な変化です。空気中では主に圧力と密度の変化として現れます。", "소리는 매질을 통해 전달되는 역학적 변화입니다. 공기에서는 주로 압력과 밀도의 변화로 나타납니다.")}</strong></p>
        <p>{t("可以把它理解为：这里的空气受到扰动，变化又传到旁边，再传向更远处。到达耳朵的不是从声源吹来的一团空气，而是当地空气压力随时间的变化。水和固体也能传声，真空没有传递这种机械扰动的介质。", "A disturbance in one region affects neighboring regions and travels onward. Your ear receives changing local pressure, not a parcel blown all the way from the source. Water and solids also transmit sound; a vacuum lacks a medium for this mechanical disturbance.", "ある場所の変化が隣へ、さらに遠くへ伝わります。耳に届くのは音源から飛んできた空気の塊ではなく、その場所の圧力変化です。水や固体も音を伝えますが、真空には媒質がありません。", "한 영역의 변화가 이웃과 더 먼 곳으로 전달됩니다. 귀에 도달하는 것은 음원에서 날아온 공기 덩어리가 아니라 그곳의 압력 변화입니다. 물과 고체도 소리를 전달하지만 진공에는 매질이 없습니다.")}</p>
        <details><summary>{t("进一步看：空气为什么有压力？", "Explore: why does air have pressure?", "詳しく：空気に圧力がある理由", "더 알아보기: 공기에 압력이 있는 이유")}</summary>
        <p>{t("没有人在说话时，空气也没有停下来。大量分子向不同方向运动，彼此碰撞，也撞击周围物体。一次碰撞很微小，但大量碰撞不断交换动量，汇集成作用在表面上的力；单位面积承受的力，就是压力。", "Air does not stop when a room becomes quiet. Molecules move in different directions, collide with one another and strike surfaces. Each collision transfers a little momentum. Many collisions create a force on a surface; force per unit area is pressure.", "静かな部屋でも空気分子は動き、互いに衝突し、表面にも当たります。小さな運動量の交換が多数集まって力となり、単位面積あたりの力が圧力です。", "조용한 방에서도 공기 분자는 움직이며 서로와 표면에 충돌합니다. 작은 운동량 교환이 모여 힘이 되고 단위 면적당 힘이 압력입니다.")}</p>
        <p>{t("先观察一个橙色粒子：它并不是排好队、按正弦曲线来回走。再把容器体积减半，保持粒子数和初始平均动能相同。空间变小后，粒子到达容器壁的路程缩短；在相同温度下，理想气体的平均压力会升高。", "Track the orange particle: it does not follow a neat sine-wave path. Then halve the volume while keeping particle count and initial average kinetic energy unchanged. Shorter paths to the walls accompany a higher mean ideal-gas pressure at equal temperature.", "橙色の粒子は正弦波に沿って動くわけではありません。粒子数と初期平均運動エネルギーを保ち、体積を半分にすると壁への距離が短くなり、等温での理想気体の平均圧力は上がります。", "주황색 입자는 정현파 경로를 따르지 않습니다. 입자 수와 초기 평균 운동에너지를 유지하고 부피를 절반으로 줄이면 벽까지 거리가 짧아지고 등온 이상기체의 평균 압력은 증가합니다.")}</p>
        <Suspense fallback={<p>{t("正在准备分子实验…", "Preparing the molecular experiment…", "分子実験を準備中…", "분자 실험 준비 중…")}</p>}><SoundGasExperiment language={language} /></Suspense>
        <p><strong>{t("有气压，不等于有可听的声音。", "Air pressure is not the same as audible sound.", "気圧があることと音が聞こえることは別です。", "기압이 있다는 것과 소리가 들린다는 것은 다릅니다.")}</strong> {t("声波是叠加在背景气压上的、有组织的压力扰动。接下来把观察尺度放大：一个球点不再代表分子，而代表含有很多分子的空气小体积。水和固体也能传声；真空没有传递机械扰动的介质。", "A sound wave is an organized pressure disturbance superimposed on ambient pressure. Next we zoom out: a dot will represent a parcel containing many molecules, not one molecule. Water and solids also carry sound; a vacuum has no medium for this mechanical disturbance.", "音波は背景の気圧に重なる組織的な圧力変化です。次の点は一分子ではなく多くの分子を含む小体積を示します。水や固体も音を伝えますが、真空には媒質がありません。", "음파는 배경 기압에 더해진 조직적인 압력 변화입니다. 다음 점은 한 분자가 아닌 많은 분자를 포함한 작은 부피입니다. 물과 고체도 소리를 전달하지만 진공에는 매질이 없습니다.")}</p>
        </details>
      </section>

      <section className="sound-topic-section">
        <h2>{t("2. 声音如何产生？", "2. How is sound produced?", "2. 音はどう生まれる？", "2. 소리는 어떻게 발생하나요?")}</h2>
        <p>{t("以扬声器为例：通电后，振膜来回运动，把机械能传给周围空气。振膜向前推时，前方空气被挤压；向后退时，附近空气可以膨胀，压力降低。这里说的高压、低压，都是相对于原有气压的微小变化。", "Consider a loudspeaker: its driven diaphragm moves back and forth, transferring mechanical energy to the air. Moving forward compresses nearby air; retreating lets it expand and its pressure fall. High and low here mean small changes relative to ambient pressure.", "スピーカーでは振動板の往復が空気に力学的エネルギーを与えます。前進すると空気を圧縮し、後退すると膨張して圧力が下がります。高低は元の気圧に対する小さな変化です。", "스피커의 진동판은 왕복하며 공기에 역학적 에너지를 전달합니다. 앞으로 가면 공기를 압축하고 뒤로 가면 팽창하며 압력이 내려갑니다. 높고 낮음은 원래 기압에 대한 작은 변화입니다.")}</p>
        <p>{t("一次快速动作可以产生短促的声音；持续振动可以不断产生声波。振膜停在偏离原位的位置，并不意味着它会一直发声。声音也不一定有规则的周期，例如拍手和摩擦产生的声音。", "One rapid movement can make a brief sound; ongoing vibration can keep generating waves. A diaphragm held at an offset does not keep emitting sound. Sound need not be periodic: claps and friction are examples.", "一度の速い動きは短い音を、継続する振動は連続した波を作れます。振動板をずらした位置で止めても音は出続けません。拍手や摩擦の音のように、周期的でない音もあります。", "한 번의 빠른 움직임은 짧은 소리를, 지속 진동은 연속된 파동을 만들 수 있습니다. 진동판을 옮긴 위치에 멈춘다고 계속 소리가 나지는 않습니다. 박수나 마찰음처럼 비주기적인 소리도 있습니다.")}</p>
      </section>
      <section className="sound-topic-section">
        <h2>{t("3. 声音如何传播到耳朵？", "3. How does sound reach the ear?", "3. 音はどう耳に届く？", "3. 소리는 어떻게 귀에 도달하나요?")}</h2>
        <p>{t("振膜向前运动，使附近空气暂时变密、压力升高。相邻区域受到不平衡的压力作用，又推动下一片空气。振膜退回时也会产生压力降低的区域。这样，压缩和稀疏可以离开声源向外传播，而不需要同一团空气从声源一路跑到耳朵。", "A forward-moving diaphragm briefly compresses nearby air. Unequal pressure pushes adjacent regions, which affect their neighbors. The return stroke can create a lower-pressure region. Compression and rarefaction travel without a parcel having to move all the way from source to ear.", "振動板が進むと近くの空気が圧縮され、圧力の差が隣の領域を動かします。戻ると低圧の領域も生じます。空気の塊が耳まで移動しなくても疎密の変化は伝わります。", "진동판이 앞으로 가면 주변 공기가 압축되고 압력 차이가 이웃 영역을 움직입니다. 돌아올 때는 저압 영역도 생깁니다. 공기 덩어리가 귀까지 가지 않아도 압축과 희박은 전달됩니다.")}</p>
        <SoundPropagationDiagram language={language} />
        <p><strong>{t("空气局部往复，扰动向外传播。", "Air moves locally; the disturbance travels outward.", "空気は局所的に往復し、変化は外へ伝わります。", "공기는 국소적으로 왕복하고 변화는 바깥으로 전달됩니다.")}</strong> {t("振膜退回时产生的稀疏区，也会离开声源向外传播，不是整条声波倒着走。传播需要时间；压力变化到达耳朵后推动鼓膜，再经中耳和内耳转为神经信号，由大脑形成听觉。不是所有声波都能被人耳听到。", "Rarefaction from the return stroke also travels away from the source; the whole wave does not reverse. Travel takes time. Arriving pressure changes move the eardrum; the middle and inner ear convey and convert this motion into neural signals for hearing. Not all sound waves are audible to humans.", "後退で生じた希薄部も音源から外へ進み、波全体が逆走するわけではありません。伝播には時間がかかり、届いた圧力変化が鼓膜を動かし、中耳と内耳を経て神経信号となります。すべての音波が聞こえるわけではありません。", "후퇴로 생긴 희박 영역도 음원에서 멀어지며 파동 전체가 역행하지 않습니다. 전파에는 시간이 걸립니다. 도착한 압력 변화가 고막을 움직이고 중이와 내이를 거쳐 신경 신호로 바뀝니다. 모든 음파를 사람이 들을 수 있는 것은 아닙니다.")}</p>
        <p>{t("不要把这里的规则往复运动，和上一节单个分子的热运动混在一起。前者描述许多分子平均后的声学运动，后者是微观运动。我们用不同尺度的模型回答不同问题。", "Do not confuse these organized local displacements with the previous molecular thermal motion. One describes averaged acoustic motion of many molecules; the other describes microscopic motion. Different scales answer different questions.", "規則的な往復は多くの分子を平均した音響運動で、前節の熱運動とは異なります。尺度の違うモデルで別々の問いを扱います。", "규칙적인 왕복은 많은 분자를 평균한 음향 운동이며 앞의 분자 열운동과 다릅니다. 다른 척도의 모델로 서로 다른 질문을 다룹니다.")}</p>
      </section>

      <section className="sound-topic-section">
        <h2>{t("进一步探索：振动与波形", "Explore further: vibration and waveforms", "さらに学ぶ：振動と波形", "더 알아보기: 진동과 파형")}</h2>
        <details><summary>{t("为什么声音有高低、强弱？", "Why do pitch and loudness vary?", "音の高さと大きさが変わる理由", "음높이와 크기가 다른 이유")}</summary>
        <p>{t("一次推动产生短暂的扰动，反复推动则产生重复的压力变化。每秒重复多少次叫频率，单位 Hz；重复一次所用的时间叫周期，T = 1/f。220 Hz 的一个周期约为 4.55 ms，440 Hz 则约为 2.27 ms。", "One push produces a transient; repeated motion produces recurring pressure changes. Repetitions per second are frequency in Hz, and one repetition takes a period T = 1/f. A 220 Hz period is about 4.55 ms; at 440 Hz it is about 2.27 ms.", "一度の動きは過渡変化、繰り返しは周期的な圧力変化を生みます。毎秒の回数が周波数 Hz、一回の時間が周期 T = 1/f です。220 Hz は約4.55 ms、440 Hz は約2.27 msです。", "한 번의 움직임은 과도 변화를, 반복은 주기적인 압력 변화를 만듭니다. 초당 횟수는 주파수 Hz, 한 주기의 시간은 T = 1/f입니다. 220 Hz는 약4.55 ms, 440 Hz는 약2.27 ms입니다.")}</p>
        <p>{t("下面先用最简单的正弦信号。改变频率时保持振幅不变，对比周期和音高；再只改变振幅，对比起伏和听感。圆周投影是生成正弦函数的数学图解，不是说空气分子在转圈。拖动观察时刻，可把圆上的投影与波形中的一个点对应起来。", "Start with a sine signal. Vary frequency at fixed amplitude, then amplitude at fixed frequency. The circular projection explains the sine function mathematically; air molecules are not orbiting. Move the observation time to connect the projection with one point on the waveform.", "まず正弦信号で周波数と振幅を別々に変えます。円の投影は正弦関数の数学的説明で、空気分子が回転する意味ではありません。観測時刻を変えて波形上の点と対応させます。", "정현파에서 주파수와 진폭을 따로 바꿔 봅니다. 원 투영은 정현함수의 수학적 설명이며 공기 분자가 회전한다는 뜻이 아닙니다. 관측 시점을 바꾸며 파형의 점과 연결합니다.")}</p>
        <SoundCompositionExperiment language={language} mode="tone" />
        <p>{t("音调和响度是听觉感受，不是仪表读数。对纯音，频率通常决定音调的高低；相同频率下，振幅增大通常更响。但人耳对不同频率的敏感度不同，设备响应也不同，因此固定振幅不保证主观上一样响。", "Pitch and loudness are perceptions, not meter readings. Pure-tone frequency usually governs pitch, and more amplitude at the same frequency usually sounds louder. Hearing sensitivity and device response vary with frequency, so fixed amplitude does not guarantee equal perceived loudness.", "高さと大きさは知覚です。純音では周波数が高さに、同周波数での振幅が大きさに関わりますが、耳と機器の周波数特性により同振幅でも同じ大きさには聞こえません。", "음높이와 음량은 지각입니다. 순음의 주파수는 음높이에, 같은 주파수의 진폭은 음량에 영향을 주지만 귀와 장치의 주파수 응답 때문에 같은 진폭도 같은 크기로 들리지 않습니다.")}</p>
        </details>
        <details><summary>{t("波形到底画了什么？", "What does a waveform actually show?", "波形が表すもの", "파형은 무엇을 나타낼까요?")}</summary>
        <p>{t("回看传播实验：固定橙色观察面，随时间记录当地声压，就得到一条波形。它不是空气运动的空间路线，也不是声波外形的照片。曲线向上和向下，分别表示高于与低于背景气压，不表示空气上下运动，也不表示绝对气压变成负数。", "Revisit the propagation experiment: pressure recorded over time at the fixed orange plane forms a waveform. It is not a spatial particle trajectory or a photograph of a wave. Positive and negative values mean above and below ambient pressure, not vertical air motion or negative absolute pressure.", "固定観測面の音圧を時間に沿って記録したものが波形です。空気の軌跡や波の写真ではありません。正負は静圧より高い・低いという意味で、上下運動や負の絶対圧ではありません。", "고정 관측면의 음압을 시간에 따라 기록한 것이 파형입니다. 공기 경로나 파동 사진이 아닙니다. 양수와 음수는 정압보다 높고 낮음을 뜻하며 상하 운동이나 음의 절대 압력이 아닙니다.")}</p>
        <div className="sound-story-comparison">
          <div><h3>{t("固定时刻，看不同位置", "One instant, different positions", "同時刻の異なる位置", "한 시점의 여러 위치")}</h3><p>{t("三维场景显示空间分布：哪里压缩，哪里稀疏。纵波中，空气小体积的往复方向与传播方向平行。", "The 3D scene shows where air is compressed or rarefied. Local motion is parallel to propagation in this longitudinal wave.", "3D図は疎密の空間分布です。縦波では局所運動と伝播方向が平行です。", "3D는 압축과 희박의 공간 분포입니다. 종파의 국소 운동은 전파 방향과 평행합니다.")}</p></div>
          <div><h3>{t("固定位置，看不同时刻", "One position, different times", "同位置の異なる時刻", "한 위치의 여러 시점")}</h3><p>{t("记录图显示时间变化：这里的压力什么时候升高或降低。空间距离与时间通过传播速度联系，但不能混用坐标。", "The trace shows when pressure rises or falls here. Propagation speed connects distance and time, but their axes are not interchangeable.", "記録図はその場所の時間変化です。距離と時間は伝播速度で結ばれますが、軸は別の量です。", "기록은 그 위치의 시간 변화입니다. 거리와 시간은 전파 속도로 연결되지만 축을 혼동하면 안 됩니다.")}</p></div>
        </div>
        <p>{t("同样重要的是分清位移与声压：振膜停在某个位置，并不意味着它持续产生声波。在理想单向平面波中，声压与空气质点速度成正比，Δp = ρcu；因此位移峰值不一定是声压峰值。后续看到任何波形，先问纵轴表示哪一个量。", "Distinguish displacement from pressure: holding a diaphragm still does not keep generating a wave. For an ideal one-way plane wave, pressure is proportional to particle velocity, Δp = ρcu. Maximum displacement need not mean maximum pressure. Always identify the vertical-axis quantity.", "変位と音圧も区別します。振動板が止まっていれば波を作り続けません。一方向平面波では Δp = ρcu で音圧は粒子速度に比例し、最大変位と最大音圧は一致しません。", "변위와 음압도 구분해야 합니다. 진동판을 고정하면 파동이 계속 생기지 않습니다. 단방향 평면파에서는 Δp = ρcu로 음압이 입자 속도에 비례하므로 최대 변위가 최대 음압은 아닙니다.")}</p>
        </details>
      </section>

      <section className="sound-topic-section">
        <h2>{t("带着三个问题回看", "Check your understanding", "三つの問いで振り返る", "세 질문으로 돌아보기")}</h2>
        <p>{t("空气分子在运动，和声波在传播，是同一回事吗？一条上下起伏的曲线，为什么不表示空气上下运动？频率升高时，周期为什么变短？尝试先回答，再回到对应实验验证。", "Is molecular motion the same as wave propagation? Why doesn't an up-and-down curve mean air moves vertically? Why does a higher frequency mean a shorter period? Answer first, then revisit the experiments.", "分子運動と波の伝播は同じ？上下する曲線は空気の上下運動？周波数が高いほど周期が短いのはなぜ？実験で答えを確かめてください。", "분자 운동과 파동 전파는 같은가요? 곡선의 상하는 공기의 상하 운동인가요? 주파수가 높아지면 주기는 왜 짧아지나요? 실험에서 확인해 보세요.")}</p>
        <p>{t("到这里，我们已经解释了声音如何产生和传播。分量怎样叠加、相位如何改变波形、频谱如何读，继续到下一篇。", "We have followed how sound is produced and travels. Continue to the next guide for superposition, phase and reading spectra.", "音の発生と伝播を学びました。重ね合わせ、位相、スペクトルは次の記事で扱います。", "소리의 발생과 전파를 살펴봤습니다. 중첩, 위상, 스펙트럼은 다음 글에서 이어집니다.")}</p>
        <button className="diagram-open-button" type="button" onClick={onOpenNext}>{t("下一篇：读懂波形与频谱", "Next: Reading Waveforms and Spectra", "次へ：波形とスペクトルを読む", "다음: 파형과 스펙트럼 읽기")}</button>
        <details><summary>{t("参考与模型边界", "References and model limits", "参考とモデルの限界", "참고와 모델의 한계")}</summary>
          <p>{t("教学路径参考 Bartosz Ciechanowski 的 Sound；本文文字与交互独立实现，不是原文翻译。分子模型、声学模型和合成信号分别用于解释不同尺度，均不替代真实设备测量。", "The teaching path is inspired by Bartosz Ciechanowski's Sound; this text and the interactions are independently implemented, not a translation. Molecular, acoustic and synthesized-signal models explain different scales and do not replace measurements.", "Bartosz Ciechanowski の Sound を学習順序の参考にしています。文章と実装は独自で翻訳ではありません。各モデルは実測の代わりではありません。", "학습 순서는 Bartosz Ciechanowski의 Sound를 참고했습니다. 글과 구현은 독자적이며 번역이 아닙니다. 각 모델은 실측을 대체하지 않습니다.")}</p>
          <p><a href="https://ciechanow.ski/sound/" target="_blank" rel="noreferrer">Sound · Bartosz Ciechanowski</a></p>
          <p><a href="https://www.acs.psu.edu/drussell/Demos/phase-p-u-sine/phase-p-u-sine.html" target="_blank" rel="noreferrer">Penn State · Pressure, velocity and displacement</a></p>
        </details>
      </section>
    </TopicReadingLayout>
    {relatedTopics}
    <TopicPager language={language} onBack={onBack} onNext={onOpenNext} />
  </main>;
}
