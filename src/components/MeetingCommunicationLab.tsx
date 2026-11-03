import { useId, useState } from "react";
import { ArrowLeft } from "lucide-react";
import type { Language } from "../content/knowledge";

type MeetingCommunicationLabProps = {
  language: Language;
  onBack: () => void;
  onBackToDetails?: () => void;
};

type ScenarioId = "personal" | "room" | "network" | "captions";
type ChainKind = "capture" | "process" | "network" | "playback" | "recognition";
type LocalizedText = Record<Language, string>;

type Scenario = {
  label: LocalizedText;
  title: LocalizedText;
  action: LocalizedText;
  expected: LocalizedText;
  risk: LocalizedText;
  sceneDescription: LocalizedText;
  modules: LocalizedText[];
  metrics: LocalizedText[];
  checks: LocalizedText[];
  chain: Array<{ kind: ChainKind; label: LocalizedText }>;
  optionalBranch?: { label: LocalizedText; nodeLabel: LocalizedText; note: LocalizedText };
};

const ja: Record<string, string> = {
  "个人终端": "個人端末",
  "个人终端：免提通话": "個人端末：ハンズフリー通話",
  "用户用笔记本或手机的内置麦克风和扬声器参加远程会议。": "ユーザーはノートパソコンやスマートフォンの内蔵マイクとスピーカーでリモート会議に参加します。",
  "近端和远端可以自然双讲，远端不会听到自己的回声。": "近端と遠端が自然にダブルトークでき、遠端の参加者に自分のエコーが返りません。",
  "扬声器声音经桌面和墙面反射回到麦克风；音量变化和双讲会让回声更难消除。": "スピーカー音が机や壁で反射してマイクに戻り、レベル変化とダブルトークによってエコー除去が難しくなります。",
  "笔记本或手机的扬声器播放远端声音，播放参考信号进入 AEC；同时声学回声从扬声器绕回内置麦克风。": "ノートパソコンやスマートフォンのスピーカーが遠端音声を再生し、再生参照信号を AEC に入力します。同時に音響エコーがスピーカーから内蔵マイクへ回り込みます。",
  "双讲检测": "ダブルトーク検出",
  "耳机模式": "ヘッドセットモード",
  "端到端延迟": "エンドツーエンド遅延",
  "输入峰值": "入力ピーク",
  "双讲保留率": "ダブルトーク保持率",
  "确认扬声器回采参考进入 AEC。": "スピーカーの再生参照が AEC に入力されることを確認します。",
  "检查参考与麦克风信号是否对齐。": "参照信号とマイク信号が整列しているか確認します。",
  "检查双讲保留，再核对扬声器音量和处理强度。": "ダブルトークの保持を確認し、スピーカー音量と処理強度を再確認します。",
  "内置麦克风": "内蔵マイク",
  "AEC / 双讲 / NS / ANR / AGC": "AEC / ダブルトーク / NS / ANR / AGC",
  "实时传输": "リアルタイム伝送",
  "远端参与者": "遠端参加者",
  "多人会议室": "会議室",
  "多人会议室：远场拾音": "会議室：遠方収音",
  "三名以上参会者围桌讨论，通过中央阵列与远端会场沟通。": "3 人以上の参加者がテーブルを囲んで話し、中央アレイと遠端会場を介して会話します。",
  "阵列持续对准当前说话人，远近座位的语音都清晰稳定。": "アレイが発話者に追従し、近い席と遠い席の音声をともに明瞭かつ安定して収音します。",
  "多人位置、扬声器回放和房间多次反射会扩散声源并加重混响。": "複数話者の位置、スピーカー再生、室内の多重反射によって音源が拡散し、残響が増えます。",
  "三名参会者围绕会议桌，中央麦克风阵列用拾音波束跟随说话人，并接收扬声器产生的墙面和桌面反射。": "3 人の参加者が会議テーブルを囲み、中央マイクアレイが収音ビームで話者を追従しながら、スピーカーによる壁面とテーブル面の反射も受けます。",
  "麦克风阵列": "マイクアレイ",
  "波束拾音": "ビーム収音",
  "多人发言处理": "複数話者処理",
  "去混响": "残響除去",
  "拾音距离": "収音距離",
  "混响时间": "残響時間",
  "阵列方向": "アレイ方向",
  "近远端电平差": "近端 / 遠端レベル差",
  "确认各阵元工作且通道增益一致。": "すべてのアレイ素子が動作し、チャンネルゲインが一致していることを確認します。",
  "观察阵列方向与多人发言切换。": "アレイ方向と複数話者への切り替えを観察します。",
  "最后检查 AEC 与去混响效果。": "最後に AEC と残響除去の効果を確認します。",
  "中央阵列拾音": "中央アレイ収音",
  "波束形成 / 多人发言 / 去混响": "ビームフォーミング / 複数話者 / 残響除去",
  "会议传输": "会議伝送",
  "远端会场": "遠端会場",
  "弱网会议": "低品質ネットワーク会議",
  "弱网会议：连续听感": "低品質ネットワーク会議：連続した聴感",
  "本地与远端端点在延迟抖动和偶发丢包的网络上持续通话。": "ローカルと遠端のエンドポイントが、遅延ジッターと散発的なパケット損失のあるネットワークで通話を続けます。",
  "短时抖动和单个丢包不会造成明显停顿，播放延迟保持可控。": "短時間のジッターや単一パケットの損失で目立つ途切れが起きず、再生遅延も制御可能に保たれます。",
  "包间隔不均或连续丢包会造成缓冲欠载、卡顿和延迟累积。": "パケット間隔の不均一やバースト損失は、バッファアンダーラン、途切れ、遅延の蓄積を引き起こします。",
  "接收端先接收间隔不均的 RTP 包，再由自适应抖动缓冲重排并调度播放时间，随后解码器决定使用 FEC 恢复或 PLC 补偿，最后连续播放。": "受信側はまず間隔の不均一な RTP パケットを受け取り、適応ジッターバッファで並べ替えて再生時刻を調整します。その後、デコーダーが FEC 復元または PLC 補償を選び、連続再生します。",
  "自适应码率": "適応ビットレート",
  "丢包率": "パケット損失率",
  "到达抖动": "到着ジッター",
  "PLC 触发率": "PLC 発生率",
  "播放缓冲深度": "再生バッファ深度",
  "先对比原始采集，区分采集异常与网络损伤。": "まず元の収録と比較し、収録異常とネットワーク損傷を切り分けます。",
  "检查丢包、RTT、抖动与 PLC 触发。": "損失、RTT、ジッター、PLC 発生を確認します。",
  "最后调整缓冲、FEC 和码率。": "最後にバッファ、FEC、ビットレートを調整します。",
  "Opus / 自适应码率": "Opus / 適応ビットレート",
  "RTP 包": "RTP パケット",
  "自适应抖动缓冲": "適応ジッターバッファ",
  "FEC / PLC 解码决策": "FEC / PLC デコード判断",
  "连续播放": "連続再生",
  "实时字幕": "リアルタイム字幕",
  "实时字幕：识别旁路": "リアルタイム字幕：認識サイドパス",
  "参会者正常通话，同时查看增量更新的字幕，并可选开启翻译。": "参加者は通常どおり通話しながら、逐次更新される字幕を確認し、必要に応じて翻訳を有効にします。",
  "首字快速出现，后续文字稳定增量更新，字幕不会阻塞主音频链路。": "最初の文字がすぐに現れ、後続の文字が安定して逐次更新され、字幕が主音声経路をブロックしません。",
  "端点等待、识别推理、翻译和 UI 稳定策略会叠加字幕延迟。": "エンドポイント待ち、認識推論、翻訳、UI の安定化戦略が字幕遅延として積み重なります。",
  "增强后的 PCM 分支到字幕旁路，直接经过流式 ASR、增量字幕和字幕界面；可选翻译分支可以绕过，不会阻塞主音频或未翻译字幕。": "強調後の PCM を字幕サイドパスへ分岐し、ストリーミング ASR、逐次字幕、字幕 UI を通します。任意の翻訳分岐は迂回でき、主音声や未翻訳字幕をブロックしません。",
  "流式 ASR": "ストリーミング ASR",
  "端点检测": "エンドポイント検出",
  "增量字幕": "逐次字幕",
  "字幕稳定": "字幕安定化",
  "可选翻译": "任意翻訳",
  "首字延迟": "初回トークン遅延",
  "最终结果延迟": "最終結果遅延",
  "修订次数": "修正回数",
  "字错率": "文字誤り率",
  "先检查增强后音频的清晰度和完整性。": "まず強調後音声の明瞭性と完全性を確認します。",
  "再区分网络传输延迟与模型推理延迟。": "次にネットワーク伝送遅延とモデル推論遅延を切り分けます。",
  "最后检查端点检测和字幕稳定策略。": "最後にエンドポイント検出と字幕安定化戦略を確認します。",
  "增强后 PCM": "強調後 PCM",
  "增量识别": "逐次認識",
  "字幕界面": "字幕 UI",
  "可选翻译分支": "任意翻訳分岐",
  "可绕过直接字幕路径": "直接字幕経路から迂回可能",
  "会议场景图滚动区域": "会議シーン図のスクロール領域",
  "个人终端会议场景图": "個人端末の会議シーン図",
  "内置扬声器与麦克风形成声学回路": "内蔵スピーカーとマイクが音響ループを形成",
  "笔记本 / 手机": "ノートパソコン / スマートフォン",
  "本地用户": "ローカルユーザー",
  "内置扬声器": "内蔵スピーカー",
  "听到本地语音": "ローカル音声を聴取",
  "会议网络": "会議ネットワーク",
  "播放参考 → AEC": "再生参照 → AEC",
  "扬声器到麦克风的回声路径": "スピーカーからマイクへのエコー経路",
  "多人会议室场景图": "会議室のシーン図",
  "波束跟随说话人，反射从多个方向到达阵列": "ビームが話者を追従し、反射音が多方向からアレイに到達",
  "参会者 ": "参加者 ",
  "中央阵列": "中央アレイ",
  "远端显示": "遠端ディスプレイ",
  "墙面与桌面反射": "壁面とテーブル面の反射",
  "弱网会议场景图": "低品質ネットワーク会議のシーン図",
  "包到达间隔不均，其中一个包缺失": "パケットの到着間隔が不均一で、1 つのパケットが欠落",
  "缺失": "欠落",
  "间隔不均的 RTP 包": "間隔が不均一な RTP パケット",
  "RTP 包到达": "RTP パケット到着",
  "乱序 / 晚到": "順序変更 / 遅延到着",
  "重排 / 调度 / 缓冲延迟": "並べ替え / スケジュール / バッファ遅延",
  "恢复或补偿": "復元または補償",
  "扬声器输出": "スピーカー出力",
  "实时字幕会议场景图": "リアルタイム字幕会議のシーン図",
  "增强语音保持主链路，同时分支到字幕识别旁路": "強調音声は主経路に残し、字幕認識サイドパスへ分岐",
  "清晰语音": "明瞭な音声",
  "主会议音频": "主会議音声",
  "字幕旁路": "字幕サイドパス",
  "未翻译直达": "未翻訳で直接表示",
  "可绕过": "迂回可能",
  "会议与通信实验室": "会議・通信ラボ",
  "选择真实会议场景，观察用户体验、音频链路和工程排查重点如何同步变化。": "実際の会議シーンを選び、ユーザー体験、音声経路、エンジニアリング上の確認点がどう連動して変わるかを確認します。",
  "会议场景选择": "会議シーンの選択",
  "当前场景": "現在のシーン",
  "用户视角": "ユーザー視点",
  "当前体验": "現在の体験",
  "用户正在做什么": "ユーザーがしていること",
  "正常体验": "期待される体験",
  "主要风险": "主なリスク",
  "场景链路": "シーンの経路",
  "信号流": "信号フロー",
  "工程信息": "エンジニアリング情報",
  "工程视角": "エンジニアリング視点",
  "关键模块": "主要モジュール",
  "可观察指标": "観測可能な指標",
  "排查顺序": "トラブルシュート順序",
  "返回知识库": "知識ベースに戻る",
  "返回详细内容": "詳細ページに戻る",
  "应用场景": "応用シナリオ"
};

const ko: Record<string, string> = {
  "个人终端": "개인 단말",
  "个人终端：免提通话": "개인 단말: 스피커폰 통화",
  "用户用笔记本或手机的内置麦克风和扬声器参加远程会议。": "사용자가 노트북이나 휴대폰의 내장 마이크와 스피커로 원격 회의에 참여합니다.",
  "近端和远端可以自然双讲，远端不会听到自己的回声。": "근단과 원단이 자연스럽게 더블 토크를 할 수 있고 원단 참가자는 자신의 에코를 듣지 않습니다.",
  "扬声器声音经桌面和墙面反射回到麦克风；音量变化和双讲会让回声更难消除。": "스피커 소리가 책상과 벽에서 반사되어 마이크로 돌아오며, 레벨 변화와 더블 토크로 에코 제거가 어려워집니다.",
  "笔记本或手机的扬声器播放远端声音，播放参考信号进入 AEC；同时声学回声从扬声器绕回内置麦克风。": "노트북이나 휴대폰 스피커가 원단 음성을 재생하고 재생 참조 신호는 AEC로 들어갑니다. 동시에 음향 에코가 스피커에서 내장 마이크로 돌아옵니다.",
  "双讲检测": "더블 토크 감지",
  "耳机模式": "헤드셋 모드",
  "端到端延迟": "종단 간 지연",
  "输入峰值": "입력 피크",
  "双讲保留率": "더블 토크 보존율",
  "确认扬声器回采参考进入 AEC。": "스피커 재생 참조가 AEC에 입력되는지 확인합니다.",
  "检查参考与麦克风信号是否对齐。": "참조 신호와 마이크 신호가 정렬되는지 확인합니다.",
  "检查双讲保留，再核对扬声器音量和处理强度。": "더블 토크 보존을 확인한 뒤 스피커 볼륨과 처리 강도를 다시 확인합니다.",
  "内置麦克风": "내장 마이크",
  "AEC / 双讲 / NS / ANR / AGC": "AEC / 더블 토크 / NS / ANR / AGC",
  "实时传输": "실시간 전송",
  "远端参与者": "원단 참가자",
  "多人会议室": "회의실",
  "多人会议室：远场拾音": "회의실: 원거리 수음",
  "三名以上参会者围桌讨论，通过中央阵列与远端会场沟通。": "3명 이상의 참가자가 테이블을 둘러앉아 중앙 배열과 원격 회의실을 통해 대화합니다.",
  "阵列持续对准当前说话人，远近座位的语音都清晰稳定。": "배열이 현재 화자를 계속 향하고 가까운 좌석과 먼 좌석의 음성을 모두 선명하고 안정적으로 수음합니다.",
  "多人位置、扬声器回放和房间多次反射会扩散声源并加重混响。": "여러 화자의 위치, 스피커 재생, 실내 다중 반사로 음원이 퍼지고 잔향이 커집니다.",
  "三名参会者围绕会议桌，中央麦克风阵列用拾音波束跟随说话人，并接收扬声器产生的墙面和桌面反射。": "세 명의 참가자가 회의 테이블을 둘러싸고 중앙 마이크 배열이 수음 빔으로 화자를 따라가며 스피커에서 발생한 벽과 테이블 반사도 받습니다.",
  "麦克风阵列": "마이크 배열",
  "波束拾音": "빔 수음",
  "多人发言处理": "다중 화자 처리",
  "去混响": "잔향 제거",
  "拾音距离": "수음 거리",
  "混响时间": "잔향 시간",
  "阵列方向": "배열 방향",
  "近远端电平差": "근단 / 원단 레벨 차",
  "确认各阵元工作且通道增益一致。": "모든 배열 요소가 동작하고 채널 게인이 일치하는지 확인합니다.",
  "观察阵列方向与多人发言切换。": "배열 방향과 다중 화자 전환을 관찰합니다.",
  "最后检查 AEC 与去混响效果。": "마지막으로 AEC와 잔향 제거 효과를 확인합니다.",
  "中央阵列拾音": "중앙 배열 수음",
  "波束形成 / 多人发言 / 去混响": "빔포밍 / 다중 화자 / 잔향 제거",
  "会议传输": "회의 전송",
  "远端会场": "원격 회의실",
  "弱网会议": "불안정 네트워크 회의",
  "弱网会议：连续听感": "불안정 네트워크 회의: 연속 청취",
  "本地与远端端点在延迟抖动和偶发丢包的网络上持续通话。": "로컬과 원단 엔드포인트가 지연 지터와 간헐적 패킷 손실이 있는 네트워크에서 통화를 계속합니다.",
  "短时抖动和单个丢包不会造成明显停顿，播放延迟保持可控。": "짧은 지터와 단일 패킷 손실이 눈에 띄는 끊김을 만들지 않고 재생 지연도 제어 가능한 수준을 유지합니다.",
  "包间隔不均或连续丢包会造成缓冲欠载、卡顿和延迟累积。": "패킷 간격 불균일이나 버스트 손실은 버퍼 언더런, 끊김, 지연 누적을 일으킬 수 있습니다.",
  "接收端先接收间隔不均的 RTP 包，再由自适应抖动缓冲重排并调度播放时间，随后解码器决定使用 FEC 恢复或 PLC 补偿，最后连续播放。": "수신단은 먼저 간격이 불규칙한 RTP 패킷을 받고 적응형 지터 버퍼로 재정렬하고 재생 시각을 예약합니다. 이후 디코더가 FEC 복원 또는 PLC 보상을 선택하고 연속 재생합니다.",
  "自适应码率": "적응형 비트레이트",
  "丢包率": "패킷 손실률",
  "到达抖动": "도착 지터",
  "PLC 触发率": "PLC 발생률",
  "播放缓冲深度": "재생 버퍼 깊이",
  "先对比原始采集，区分采集异常与网络损伤。": "먼저 원시 캡처와 비교해 캡처 이상과 네트워크 손상을 구분합니다.",
  "检查丢包、RTT、抖动与 PLC 触发。": "손실, RTT, 지터, PLC 발생을 확인합니다.",
  "最后调整缓冲、FEC 和码率。": "마지막으로 버퍼, FEC, 비트레이트를 조정합니다.",
  "Opus / 自适应码率": "Opus / 적응형 비트레이트",
  "RTP 包": "RTP 패킷",
  "自适应抖动缓冲": "적응형 지터 버퍼",
  "FEC / PLC 解码决策": "FEC / PLC 디코딩 결정",
  "连续播放": "연속 재생",
  "实时字幕": "실시간 자막",
  "实时字幕：识别旁路": "실시간 자막: 인식 사이드 패스",
  "参会者正常通话，同时查看增量更新的字幕，并可选开启翻译。": "참가자는 정상적으로 통화하면서 점진적으로 갱신되는 자막을 보고 필요하면 번역을 켭니다.",
  "首字快速出现，后续文字稳定增量更新，字幕不会阻塞主音频链路。": "첫 글자가 빠르게 나타나고 이후 텍스트가 안정적으로 갱신되며 자막이 주 오디오 경로를 막지 않습니다.",
  "端点等待、识别推理、翻译和 UI 稳定策略会叠加字幕延迟。": "엔드포인트 대기, 인식 추론, 번역, UI 안정화 전략이 자막 지연으로 누적될 수 있습니다.",
  "增强后的 PCM 分支到字幕旁路，直接经过流式 ASR、增量字幕和字幕界面；可选翻译分支可以绕过，不会阻塞主音频或未翻译字幕。": "향상된 PCM을 자막 사이드 패스로 분기해 스트리밍 ASR, 증분 자막, 자막 UI를 통과시킵니다. 선택적 번역 분기는 우회할 수 있어 주 오디오나 미번역 자막을 막지 않습니다.",
  "流式 ASR": "스트리밍 ASR",
  "端点检测": "엔드포인트 감지",
  "增量字幕": "증분 자막",
  "字幕稳定": "자막 안정화",
  "可选翻译": "선택적 번역",
  "首字延迟": "첫 토큰 지연",
  "最终结果延迟": "최종 결과 지연",
  "修订次数": "수정 횟수",
  "字错率": "문자 오류율",
  "先检查增强后音频的清晰度和完整性。": "먼저 향상된 오디오의 명료도와 완전성을 확인합니다.",
  "再区分网络传输延迟与模型推理延迟。": "그다음 네트워크 전송 지연과 모델 추론 지연을 구분합니다.",
  "最后检查端点检测和字幕稳定策略。": "마지막으로 엔드포인트 감지와 자막 안정화 전략을 확인합니다.",
  "增强后 PCM": "향상된 PCM",
  "增量识别": "증분 인식",
  "字幕界面": "자막 UI",
  "可选翻译分支": "선택적 번역 분기",
  "可绕过直接字幕路径": "직접 자막 경로에서 우회 가능",
  "会议场景图滚动区域": "회의 장면도 스크롤 영역",
  "个人终端会议场景图": "개인 단말 회의 장면도",
  "内置扬声器与麦克风形成声学回路": "내장 스피커와 마이크가 음향 루프를 형성",
  "笔记本 / 手机": "노트북 / 휴대폰",
  "本地用户": "로컬 사용자",
  "内置扬声器": "내장 스피커",
  "听到本地语音": "로컬 음성을 들음",
  "会议网络": "회의 네트워크",
  "播放参考 → AEC": "재생 참조 → AEC",
  "扬声器到麦克风的回声路径": "스피커에서 마이크로 가는 에코 경로",
  "多人会议室场景图": "회의실 장면도",
  "波束跟随说话人，反射从多个方向到达阵列": "빔이 화자를 따라가고 반사음은 여러 방향에서 배열에 도착",
  "参会者 ": "참가자 ",
  "中央阵列": "중앙 배열",
  "远端显示": "원단 디스플레이",
  "墙面与桌面反射": "벽과 테이블 반사",
  "弱网会议场景图": "불안정 네트워크 회의 장면도",
  "包到达间隔不均，其中一个包缺失": "패킷 도착 간격이 불규칙하고 한 패킷이 누락",
  "缺失": "누락",
  "间隔不均的 RTP 包": "간격이 불규칙한 RTP 패킷",
  "RTP 包到达": "RTP 패킷 도착",
  "乱序 / 晚到": "순서 변경 / 늦은 도착",
  "重排 / 调度 / 缓冲延迟": "재정렬 / 예약 / 버퍼 지연",
  "恢复或补偿": "복원 또는 보상",
  "扬声器输出": "스피커 출력",
  "实时字幕会议场景图": "실시간 자막 회의 장면도",
  "增强语音保持主链路，同时分支到字幕识别旁路": "향상된 음성은 주 경로에 남고 자막 인식 사이드 패스로 분기",
  "清晰语音": "선명한 음성",
  "主会议音频": "주 회의 오디오",
  "字幕旁路": "자막 사이드 패스",
  "未翻译直达": "미번역 직접 표시",
  "可绕过": "우회 가능",
  "会议与通信实验室": "회의 및 통신 랩",
  "选择真实会议场景，观察用户体验、音频链路和工程排查重点如何同步变化。": "실제 회의 장면을 선택해 사용자 경험, 오디오 경로, 엔지니어링 점검 항목이 어떻게 함께 변하는지 확인합니다.",
  "会议场景选择": "회의 장면 선택",
  "当前场景": "현재 장면",
  "用户视角": "사용자 관점",
  "当前体验": "현재 경험",
  "用户正在做什么": "사용자가 하는 일",
  "正常体验": "예상 경험",
  "主要风险": "주요 위험",
  "场景链路": "장면 경로",
  "信号流": "신호 흐름",
  "工程信息": "엔지니어링 정보",
  "工程视角": "엔지니어링 관점",
  "关键模块": "핵심 모듈",
  "可观察指标": "관찰 가능한 지표",
  "排查顺序": "문제 해결 순서",
  "返回知识库": "지식 베이스로 돌아가기",
  "返回详细内容": "상세 내용으로 돌아가기",
  "应用场景": "응용 시나리오"
};

const t = (zh: string, en: string): LocalizedText => ({ zh, en, ja: ja[zh], ko: ko[zh] });

const scenarios: Record<ScenarioId, Scenario> = {
  personal: {
    label: t("个人终端", "Personal device"),
    title: t("个人终端：免提通话", "Personal device: speakerphone call"),
    action: t("用户用笔记本或手机的内置麦克风和扬声器参加远程会议。", "A user joins a remote meeting on a laptop or phone using its built-in microphone and speaker."),
    expected: t("近端和远端可以自然双讲，远端不会听到自己的回声。", "Near- and far-end participants can double-talk naturally without the remote participant hearing an echo."),
    risk: t("扬声器声音经桌面和墙面反射回到麦克风；音量变化和双讲会让回声更难消除。", "Speaker audio can reflect from the desk and walls into the microphone; level changes and double-talk make cancellation harder."),
    sceneDescription: t("笔记本或手机的扬声器播放远端声音，播放参考信号进入 AEC；同时声学回声从扬声器绕回内置麦克风。", "A laptop or phone plays remote audio through its speaker. The render reference enters AEC while acoustic echo travels from speaker back to the built-in microphone."),
    modules: [t("AEC", "AEC"), t("双讲检测", "Double-talk detection"), t("NS / ANR", "NS / ANR"), t("AGC", "AGC"), t("耳机模式", "Headset mode")],
    metrics: [t("ERLE", "ERLE"), t("端到端延迟", "End-to-end latency"), t("输入峰值", "Input peak"), t("双讲保留率", "Double-talk retention")],
    checks: [t("确认扬声器回采参考进入 AEC。", "Confirm the speaker render reference reaches AEC."), t("检查参考与麦克风信号是否对齐。", "Check alignment between reference and microphone audio."), t("检查双讲保留，再核对扬声器音量和处理强度。", "Check double-talk retention, then verify speaker volume and processing strength.")],
    chain: [
      { kind: "capture", label: t("内置麦克风", "Built-in mic") },
      { kind: "process", label: t("AEC / 双讲 / NS / ANR / AGC", "AEC / double-talk / NS / ANR / AGC") },
      { kind: "network", label: t("实时传输", "Real-time transport") },
      { kind: "playback", label: t("远端参与者", "Remote participant") }
    ]
  },
  room: {
    label: t("多人会议室", "Meeting room"),
    title: t("多人会议室：远场拾音", "Meeting room: far-field pickup"),
    action: t("三名以上参会者围桌讨论，通过中央阵列与远端会场沟通。", "Three or more participants discuss around a table through a central array and far-end display."),
    expected: t("阵列持续对准当前说话人，远近座位的语音都清晰稳定。", "The array tracks the active talker and keeps speech clear from both near and distant seats."),
    risk: t("多人位置、扬声器回放和房间多次反射会扩散声源并加重混响。", "Multiple talker positions, speaker playback, and repeated room reflections spread sources and increase reverberation."),
    sceneDescription: t("三名参会者围绕会议桌，中央麦克风阵列用拾音波束跟随说话人，并接收扬声器产生的墙面和桌面反射。", "Three participants surround a conference table. A central microphone array steers pickup beams toward talkers while receiving wall and table reflections from the speaker."),
    modules: [t("麦克风阵列", "Microphone array"), t("波束拾音", "Beam pickup"), t("多人发言处理", "Multi-speaker processing"), t("AEC", "AEC"), t("去混响", "Dereverberation")],
    metrics: [t("拾音距离", "Pickup distance"), t("混响时间", "Reverberation time"), t("阵列方向", "Array direction"), t("近远端电平差", "Near/far level difference")],
    checks: [t("确认各阵元工作且通道增益一致。", "Confirm every array element works with matched channel gain."), t("观察阵列方向与多人发言切换。", "Observe array direction and multi-speaker switching."), t("最后检查 AEC 与去混响效果。", "Finally check AEC and dereverberation performance.")],
    chain: [
      { kind: "capture", label: t("中央阵列拾音", "Central array pickup") },
      { kind: "process", label: t("波束形成 / 多人发言 / 去混响", "Beamforming / multi-speaker / dereverb") },
      { kind: "process", label: t("AEC", "AEC") },
      { kind: "network", label: t("会议传输", "Conference transport") },
      { kind: "playback", label: t("远端会场", "Far-end room") }
    ]
  },
  network: {
    label: t("弱网会议", "Poor network"),
    title: t("弱网会议：连续听感", "Poor network: continuous listening"),
    action: t("本地与远端端点在延迟抖动和偶发丢包的网络上持续通话。", "Local and remote endpoints continue a call over a network with jitter and occasional packet loss."),
    expected: t("短时抖动和单个丢包不会造成明显停顿，播放延迟保持可控。", "Brief jitter and an isolated missing packet do not cause obvious gaps, while playout delay stays controlled."),
    risk: t("包间隔不均或连续丢包会造成缓冲欠载、卡顿和延迟累积。", "Uneven packet spacing or burst loss can cause buffer underruns, dropouts, and accumulated latency."),
    sceneDescription: t("接收端先接收间隔不均的 RTP 包，再由自适应抖动缓冲重排并调度播放时间，随后解码器决定使用 FEC 恢复或 PLC 补偿，最后连续播放。", "The receiver first accepts uneven RTP packets, then an adaptive jitter buffer reorders and schedules them with buffering delay. During decode, FEC recovery or PLC concealment is selected before continuous playout."),
    modules: [t("Opus", "Opus"), t("RTP", "RTP"), t("FEC", "FEC"), t("Jitter Buffer", "Jitter Buffer"), t("PLC", "PLC"), t("自适应码率", "Adaptive bitrate")],
    metrics: [t("丢包率", "Packet loss rate"), t("到达抖动", "Arrival jitter"), t("RTT", "RTT"), t("PLC 触发率", "PLC trigger rate"), t("播放缓冲深度", "Playout buffer depth")],
    checks: [t("先对比原始采集，区分采集异常与网络损伤。", "First compare raw capture to distinguish capture faults from network damage."), t("检查丢包、RTT、抖动与 PLC 触发。", "Check loss, RTT, jitter, and PLC triggers."), t("最后调整缓冲、FEC 和码率。", "Finally tune buffering, FEC, and bitrate.")],
    chain: [
      { kind: "process", label: t("Opus / 自适应码率", "Opus / adaptive bitrate") },
      { kind: "network", label: t("RTP 包", "RTP packets") },
      { kind: "process", label: t("自适应抖动缓冲", "Adaptive jitter buffer") },
      { kind: "process", label: t("FEC / PLC 解码决策", "FEC / PLC decode decision") },
      { kind: "playback", label: t("连续播放", "Continuous playout") }
    ]
  },
  captions: {
    label: t("实时字幕", "Live captions"),
    title: t("实时字幕：识别旁路", "Live captions: recognition side path"),
    action: t("参会者正常通话，同时查看增量更新的字幕，并可选开启翻译。", "Participants talk normally while reading incrementally updated captions with optional translation."),
    expected: t("首字快速出现，后续文字稳定增量更新，字幕不会阻塞主音频链路。", "The first words appear quickly, later text updates incrementally, and captions never block the main audio path."),
    risk: t("端点等待、识别推理、翻译和 UI 稳定策略会叠加字幕延迟。", "Endpointing, recognition inference, translation, and UI stabilization can add up to caption latency."),
    sceneDescription: t("增强后的 PCM 分支到字幕旁路，直接经过流式 ASR、增量字幕和字幕界面；可选翻译分支可以绕过，不会阻塞主音频或未翻译字幕。", "Enhanced PCM branches to a caption side path that directly runs through streaming ASR, incremental captions, and the caption UI. The optional translation branch is bypassable and blocks neither main audio nor untranslated captions."),
    modules: [t("流式 ASR", "Streaming ASR"), t("端点检测", "Endpoint detection"), t("增量字幕", "Incremental captions"), t("字幕稳定", "Caption stabilization"), t("可选翻译", "Optional translation")],
    metrics: [t("首字延迟", "First-token latency"), t("最终结果延迟", "Final-result latency"), t("修订次数", "Revision count"), t("字错率", "Word error rate")],
    checks: [t("先检查增强后音频的清晰度和完整性。", "First check enhanced-audio clarity and completeness."), t("再区分网络传输延迟与模型推理延迟。", "Then distinguish network delay from inference delay."), t("最后检查端点检测和字幕稳定策略。", "Finally check endpoint detection and caption stabilization.")],
    chain: [
      { kind: "capture", label: t("增强后 PCM", "Enhanced PCM") },
      { kind: "recognition", label: t("流式 ASR", "Streaming ASR") },
      { kind: "recognition", label: t("增量字幕", "Incremental captions") },
      { kind: "recognition", label: t("字幕界面", "Caption UI") }
    ],
    optionalBranch: {
      label: t("可选翻译分支", "Optional translation branch"),
      nodeLabel: t("可选翻译", "Optional translation"),
      note: t("可绕过直接字幕路径", "Bypassable from the direct caption path")
    }
  }
};

const scenarioIds = Object.keys(scenarios) as ScenarioId[];

type SceneFrameProps = {
  name: string;
  description: string;
  scrollRegionLabel: string;
  arrowId: string;
  riskArrowId: string;
  children: React.ReactNode;
};

function SceneFrame({ name, description, scrollRegionLabel, arrowId, riskArrowId, children }: SceneFrameProps) {
  const accessibleId = useId().replace(/:/g, "");
  const titleId = `${accessibleId}-title`;
  const descriptionId = `${accessibleId}-description`;
  return (
    <figure aria-label={scrollRegionLabel} className="meeting-scene-figure" role="region" tabIndex={0}>
      <svg aria-labelledby={titleId} aria-describedby={descriptionId} role="img" viewBox="0 0 980 420" xmlns="http://www.w3.org/2000/svg">
        <title id={titleId}>{name}</title>
        <desc id={descriptionId}>{description}</desc>
        <defs>
          <marker id={arrowId} markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4"><path d="M0 0 8 4 0 8Z" fill="#1f7569" /></marker>
          <marker id={riskArrowId} markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4"><path d="M0 0 8 4 0 8Z" fill="#b44c6d" /></marker>
        </defs>
        <rect className="meeting-diagram-bg" height="420" rx="18" width="980" />
        {children}
      </svg>
    </figure>
  );
}

function ScenarioScene({ id, language }: { id: ScenarioId; language: Language }) {
  const text = (zhText: string, enText: string, jaText = ja[zhText], koText = ko[zhText]) => language === "zh" ? zhText : language === "en" ? enText : language === "ja" ? jaText : koText;
  const markerId = useId().replace(/:/g, "");
  const arrowId = `${markerId}-arrow`;
  const riskArrowId = `${markerId}-risk-arrow`;
  const frameProps = {
    description: scenarios[id].sceneDescription[language],
    scrollRegionLabel: text("会议场景图滚动区域", "Meeting scene diagram scroll region"),
    arrowId,
    riskArrowId
  };
  if (id === "personal") return (
    <SceneFrame {...frameProps} name={text("个人终端会议场景图", "Personal device meeting scene diagram")}>
      <text className="meeting-diagram-title" x="44" y="48">{text("内置扬声器与麦克风形成声学回路", "Built-in speaker and microphone form an acoustic loop")}</text>
      <rect className="meeting-box capture" x="90" y="120" width="250" height="178" rx="12" />
      <text className="meeting-box-title" x="215" y="150" textAnchor="middle">{text("笔记本 / 手机", "Laptop / phone")}</text>
      <circle cx="170" cy="210" r="34" className="meeting-box process" /><text className="meeting-box-sub" x="170" y="216" textAnchor="middle">{text("本地用户", "Local user")}</text>
      <rect className="meeting-box playback" x="245" y="184" width="72" height="42" rx="8" /><text className="meeting-box-sub" x="281" y="210" textAnchor="middle">{text("内置扬声器", "Speaker")}</text>
      <rect className="meeting-box capture" x="245" y="246" width="72" height="36" rx="8" /><text className="meeting-box-sub" x="281" y="269" textAnchor="middle">{text("内置麦克风", "Mic")}</text>
      <rect className="meeting-box remote" x="700" y="150" width="190" height="120" rx="12" /><text className="meeting-box-title" x="795" y="202" textAnchor="middle">{text("远端参与者", "Remote participant")}</text><text className="meeting-box-sub" x="795" y="228" textAnchor="middle">{text("听到本地语音", "Hears local speech")}</text>
      <path className="meeting-arrow" d="M340 206 H690" markerEnd={`url(#${arrowId})`} /><text className="meeting-reference-text" x="515" y="190" textAnchor="middle">{text("会议网络", "Meeting network")}</text>
      <rect className="meeting-box process" x="500" y="245" width="120" height="54" rx="8" /><text className="meeting-box-title" x="560" y="278" textAnchor="middle">AEC</text>
      <path className="meeting-arrow" d="M317 205 C390 205 415 272 490 272" fill="none" strokeDasharray="7 6" markerEnd={`url(#${arrowId})`} /><text className="meeting-reference-text" x="410" y="236" textAnchor="middle">{text("播放参考 → AEC", "Render reference → AEC")}</text>
      <path className="meeting-echo-arrow" d="M282 226 C390 350 410 350 282 282" fill="none" markerEnd={`url(#${riskArrowId})`} /><text className="meeting-reference-text" x="445" y="370" textAnchor="middle">{text("扬声器到麦克风的回声路径", "Speaker-to-mic echo path")}</text>
    </SceneFrame>
  );
  if (id === "room") return (
    <SceneFrame {...frameProps} name={text("多人会议室场景图", "Meeting room scene diagram")}>
      <text className="meeting-diagram-title" x="44" y="48">{text("波束跟随说话人，反射从多个方向到达阵列", "Beams follow talkers while reflections reach the array from many directions")}</text>
      <rect className="meeting-box process" x="150" y="105" width="560" height="230" rx="70" />
      {[230, 430, 630].map((x, i) => <g key={x}><circle className="meeting-box capture" cx={x} cy={i === 1 ? 300 : 155} r="28" /><text className="meeting-box-sub" x={x} y={i === 1 ? 305 : 160} textAnchor="middle">{text(`参会者 ${i + 1}`, `P${i + 1}`, `参加者 ${i + 1}`, `참가자 ${i + 1}`)}</text></g>)}
      <circle className="meeting-box capture" cx="430" cy="220" r="42" /><text className="meeting-box-title" x="430" y="216" textAnchor="middle">{text("中央阵列", "Central array")}</text><text className="meeting-box-sub" x="430" y="237" textAnchor="middle">{text("波束拾音", "Beam pickup")}</text>
      <path className="meeting-arrow" d="M255 166 Q340 205 390 217" markerEnd={`url(#${arrowId})`} /><path className="meeting-arrow" d="M405 282 L425 265" markerEnd={`url(#${arrowId})`} /><path className="meeting-arrow" d="M605 166 Q520 205 470 217" markerEnd={`url(#${arrowId})`} />
      <rect className="meeting-box playback" x="760" y="105" width="150" height="92" rx="10" /><text className="meeting-box-title" x="835" y="145" textAnchor="middle">{text("远端显示", "Far-end display")}</text><text className="meeting-box-sub" x="835" y="168" textAnchor="middle">{text("扬声器", "Speaker", "スピーカー", "스피커")}</text>
      <path className="meeting-echo-arrow" d="M760 170 Q630 70 500 195" fill="none" markerEnd={`url(#${riskArrowId})`} /><path className="meeting-echo-arrow" d="M760 180 Q650 370 475 250" fill="none" strokeDasharray="8 7" markerEnd={`url(#${riskArrowId})`} /><text className="meeting-reference-text" x="735" y="350" textAnchor="middle">{text("墙面与桌面反射", "Wall and table reflections")}</text>
    </SceneFrame>
  );
  if (id === "network") return (
    <SceneFrame {...frameProps} name={text("弱网会议场景图", "Poor network meeting scene diagram")}>
      <text className="meeting-diagram-title" x="44" y="48">{text("包到达间隔不均，其中一个包缺失", "Packets arrive unevenly and one packet is missing")}</text>
      {[80, 150, 235, 340].map((x, i) => <g key={x}><rect className="meeting-box network" x={x} y={i % 2 ? 130 : 105} width="54" height="42" rx="6" /><text className="meeting-box-sub" x={x + 27} y={i % 2 ? 156 : 131} textAnchor="middle">#{i + 1}</text></g>)}
      <rect x="270" y="130" width="54" height="42" rx="6" fill="none" stroke="#b44c6d" strokeDasharray="7 6" /><text className="meeting-reference-text" x="297" y="156" textAnchor="middle">{text("缺失", "Lost")}</text>
      <text className="meeting-lane-title" x="80" y="205">{text("间隔不均的 RTP 包", "Uneven RTP packets")}</text>
      {[{ x: 80, w: 190, a: text("RTP 包到达", "RTP packet arrival"), b: text("乱序 / 晚到", "Reordered / late") }, { x: 310, w: 210, a: text("自适应抖动缓冲", "Adaptive jitter buffer"), b: text("重排 / 调度 / 缓冲延迟", "Reorder / schedule / delay") }, { x: 560, w: 190, a: text("FEC / PLC 解码决策", "FEC / PLC decode decision"), b: text("恢复或补偿", "Recover or conceal") }, { x: 790, w: 130, a: text("连续播放", "Playout"), b: text("扬声器输出", "Speaker output") }].map(({ x, w, a, b }) => <g key={x}><rect className="meeting-box process" x={x} y="245" width={w} height="76" rx="10" /><text className="meeting-box-title" x={x + w / 2} y="276" textAnchor="middle">{a}</text><text className="meeting-box-sub" x={x + w / 2} y="300" textAnchor="middle">{b}</text></g>)}
      <path className="meeting-arrow" d="M270 283 H300" markerEnd={`url(#${arrowId})`} /><path className="meeting-arrow" d="M520 283 H550" markerEnd={`url(#${arrowId})`} /><path className="meeting-arrow" d="M750 283 H780" markerEnd={`url(#${arrowId})`} />
    </SceneFrame>
  );
  return (
    <SceneFrame {...frameProps} name={text("实时字幕会议场景图", "Live captions meeting scene diagram")}>
      <text className="meeting-diagram-title" x="44" y="48">{text("增强语音保持主链路，同时分支到字幕识别旁路", "Enhanced speech stays on the main path and branches to caption recognition")}</text>
      <rect className="meeting-box capture" x="60" y="125" width="150" height="68" rx="10" /><text className="meeting-box-title" x="135" y="154" textAnchor="middle">{text("增强后 PCM", "Enhanced PCM")}</text><text className="meeting-box-sub" x="135" y="176" textAnchor="middle">{text("清晰语音", "Clean speech")}</text>
      <rect className="meeting-box playback" x="730" y="125" width="170" height="68" rx="10" /><text className="meeting-box-title" x="815" y="165" textAnchor="middle">{text("主会议音频", "Main meeting audio")}</text><path className="meeting-arrow" d="M210 159 H720" markerEnd={`url(#${arrowId})`} />
      <path className="meeting-echo-arrow" d="M250 159 V260 H305" fill="none" markerEnd={`url(#${riskArrowId})`} /><text className="meeting-reference-text" x="250" y="240">{text("字幕旁路", "Caption side path")}</text>
      {[{ x: 315, a: text("流式 ASR", "Streaming ASR"), b: text("增量识别", "Partial recognition") }, { x: 515, a: text("增量字幕", "Incremental captions"), b: text("字幕稳定", "Text stabilization") }, { x: 765, a: text("字幕界面", "Caption UI"), b: text("未翻译直达", "Direct untranslated") }].map(({ x, a, b }) => <g key={x}><rect className="meeting-box caption" x={x} y="225" width="150" height="76" rx="10" /><text className="meeting-box-title" x={x + 75} y="256" textAnchor="middle">{a}</text><text className="meeting-box-sub" x={x + 75} y="280" textAnchor="middle">{b}</text></g>)}
      <path className="meeting-arrow" d="M465 263 H505" markerEnd={`url(#${arrowId})`} />
      <path className="meeting-arrow" d="M665 263 H755" data-caption-route="direct-asr-to-captions" markerEnd={`url(#${arrowId})`} />
      <rect className="meeting-box process" x="515" y="330" width="150" height="58" rx="10" /><text className="meeting-box-title" x="590" y="354" textAnchor="middle">{text("可选翻译", "Optional translation")}</text><text className="meeting-box-sub" x="590" y="375" textAnchor="middle">{text("可绕过", "Bypassable")}</text>
      <path className="meeting-echo-arrow" d="M465 275 C485 275 485 359 505 359" data-caption-route="optional-translation" markerEnd={`url(#${riskArrowId})`} />
      <path className="meeting-echo-arrow" d="M665 359 C720 359 720 285 755 285" markerEnd={`url(#${riskArrowId})`} /><text className="meeting-reference-text" x="690" y="382">{text("可选翻译分支", "Optional translation branch")}</text>
    </SceneFrame>
  );
}

export function MeetingCommunicationLab({ language, onBack, onBackToDetails }: MeetingCommunicationLabProps) {
  const [activeScenario, setActiveScenario] = useState<ScenarioId>("personal");
  const scenario = scenarios[activeScenario];
  const text = (zhText: string, enText: string, jaText = ja[zhText], koText = ko[zhText]) => language === "zh" ? zhText : language === "en" ? enText : language === "ja" ? jaText : koText;

  return (
    <main className="meeting-lab-page" aria-label={text("会议与通信实验室", "Conferencing and Communication Lab")}>
      <section className="sound-lab-hero meeting-lab-hero">
        <div className="sound-lab-back-actions">
          <button className="sound-lab-back sound-lab-back-secondary" type="button" onClick={onBack}>
            {text("返回知识库", "Back to knowledge base")}
          </button>
          {onBackToDetails && <button className="sound-lab-back" type="button" onClick={onBackToDetails}>
            <ArrowLeft size={18} aria-hidden="true" />
            {text("返回详细内容", "Back to detailed content")}
          </button>}
        </div>
        <div><span className="details-category">{text("应用场景", "Applications")}</span><h1>{text("会议与通信实验室", "Conferencing and Communication Lab")}</h1><p>{text("选择真实会议场景，观察用户体验、音频链路和工程排查重点如何同步变化。", "Choose a real meeting scenario and see the user experience, audio chain, and engineering checks change together.")}</p></div>
      </section>

      <section className="meeting-scenario-tabs-section" aria-label={text("会议场景选择", "Meeting scenario selection")}>
        <div className="meeting-scenario-tabs">
          {scenarioIds.map((id) => <button className="meeting-scenario-tab" type="button" key={id} aria-pressed={activeScenario === id} onClick={() => setActiveScenario(id)}>{scenarios[id].label[language]}</button>)}
        </div>
      </section>

      <section className="meeting-scene-section" aria-label={scenario.title[language]}>
        <div className="meeting-section-heading"><span>{text("当前场景", "Current scenario")}</span><h2>{scenario.title[language]}</h2></div>
        <ScenarioScene id={activeScenario} language={language} />
      </section>

      <section className="meeting-experience-section" aria-label={text("当前体验", "Current experience")}>
        <div className="meeting-section-heading"><span>{text("用户视角", "User view")}</span><h2>{text("当前体验", "Current experience")}</h2></div>
        <div className="meeting-experience-grid">
          <article className="meeting-experience-item"><h3>{text("用户正在做什么", "What the user is doing")}</h3><p>{scenario.action[language]}</p></article>
          <article className="meeting-experience-item"><h3>{text("正常体验", "Expected experience")}</h3><p>{scenario.expected[language]}</p></article>
          <article className="meeting-experience-item"><h3>{text("主要风险", "Main risk")}</h3><p>{scenario.risk[language]}</p></article>
        </div>
      </section>

      <section className="meeting-chain-section" aria-label={text("场景链路", "Scenario chain")}>
        <div className="meeting-section-heading"><span>{text("信号流", "Signal flow")}</span><h2>{text("场景链路", "Scenario chain")}</h2></div>
        <div className="meeting-chain-list">{scenario.chain.map((node, index) => <article className={`meeting-chain-node ${node.kind}`} key={`${node.kind}-${node.label.en}`}><span className="meeting-chain-index">{index + 1}</span><h3>{node.label[language]}</h3>{index < scenario.chain.length - 1 && <span className="meeting-chain-arrow" aria-hidden="true">→</span>}</article>)}</div>
        {scenario.optionalBranch && <div aria-label={scenario.optionalBranch.label[language]} className="meeting-optional-branch" role="group"><span>{scenario.optionalBranch.label[language]}</span><strong>{scenario.optionalBranch.nodeLabel[language]}</strong><p>{scenario.optionalBranch.note[language]}</p></div>}
      </section>

      <section className="meeting-engineering-section" aria-label={text("工程信息", "Engineering information")}>
        <div className="meeting-section-heading"><span>{text("工程视角", "Engineering view")}</span><h2>{text("工程信息", "Engineering information")}</h2></div>
        <div className="meeting-engineering-grid">
          <article className="meeting-engineering-card"><h3>{text("关键模块", "Key modules")}</h3><ul className="meeting-engineering-list">{scenario.modules.map((item) => <li key={item.en}>{item[language]}</li>)}</ul></article>
          <article className="meeting-engineering-card"><h3>{text("可观察指标", "Observable metrics")}</h3><ul className="meeting-engineering-list">{scenario.metrics.map((item) => <li key={item.en}>{item[language]}</li>)}</ul></article>
          <article className="meeting-engineering-card"><h3>{text("排查顺序", "Troubleshooting order")}</h3><ol className="meeting-check-list">{scenario.checks.map((item) => <li key={item.en}>{item[language]}</li>)}</ol></article>
        </div>
      </section>
    </main>
  );
}
