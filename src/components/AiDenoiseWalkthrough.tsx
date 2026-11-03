/// <reference types="vite/client" />
import { useEffect, useRef, useState } from "react";
import type { Language } from "../content/knowledge";
type Demo = { waves: number[][]; input: number[][]; output: number[][]; mask: number[][]; magnitude: number[][]; activations: number[][][]; kernels: number[][][]; bias: number[]; head: number[]; headBias: number; snr: number[] };

function Map({ values, label, max = 1, selection, selectionSize = 3 }: { values: number[][]; label: string; max?: number; selection?: number[]; selectionSize?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    if (/jsdom/i.test(navigator.userAgent)) return;
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    values.forEach((row,f)=>row.forEach((v,t)=>{
      const a = Math.max(0,Math.min(1,v/max));
      ctx.fillStyle = `rgb(${15+230*a},${35+155*a},${65-30*a})`;
      ctx.fillRect(t*4,(63-f)*4,4,4);
    }));
  },[values,max]);
  const radius = (selectionSize - 1) / 2;
  return <div style={{position:"relative"}}><canvas ref={ref} width="256" height="256" role="img" aria-label={label} />{selection && <span className="denoise-selection" aria-hidden="true" style={{position:"absolute", outline:"2px solid white",boxShadow:"0 0 0 3px #16372e",pointerEvents:"none",left:`${(selection[0]-radius)/64*100}%`,top:`${(63-selection[1]-radius)/64*100}%`,width:`${selectionSize/64*100}%`,height:`${selectionSize/64*100}%`}} />}</div>;
}

export function AiDenoiseWalkthrough({ language }: { language: Language }) {
  const ja: Record<string, string> = {
    "模型逐步可视化": "モデルの段階的な可視化",
    "输入与 STFT": "入力と STFT",
    "卷积乘加": "畳み込みの積和",
    "激活特征": "活性化特徴",
    "预测掩码": "マスク予測",
    "重建与试听": "再構成と試聴",
    "8 kHz PCM → 256 点 Hann 窗 → STFT，hop=128。幅度 dB 裁剪至 [-80,0]，再缩放到 [0,1] 作为模型输入；另行保留复数频谱用于重建。": "8 kHz PCM → 256 点 Hann 窓 → STFT、hop=128。振幅 dB を [-80,0] にクリップし、[0,1] にスケールしてモデル入力にします。再構成用に複素スペクトルも保持します。",
    "3×3 核沿时间和频率移动，逐项相乘、求和、加偏置。深度学习中通常将这种互相关运算称为卷积，权重来自训练。": "3×3 カーネルを時間と周波数に沿って動かし、要素ごとに乗算、加算、バイアス加算を行います。深層学習ではこの相互相関を通常「畳み込み」と呼び、重みは学習で得ます。",
    "ReLU(z)=max(0,z)。四个通道有各自的学习权重，亮区表示响应较强，不代表声音能量或语音概率。": "ReLU(z)=max(0,z)。4 チャネルはそれぞれ学習済み重みを持ち、明るい部分は応答が強いことを示しますが、音エネルギーや音声確率ではありません。",
    "1×1 卷积合并四个激活通道，Sigmoid 产生 0–1 掩码。M=0.2 表示幅度乘 0.2，不是语音概率 20%。Ŝ=M×Y。": "1×1 畳み込みで 4 つの活性化チャネルを混ぜ、Sigmoid で 0–1 のマスクを作ります。M=0.2 は振幅を 0.2 倍する意味で、音声確率 20% ではありません。Ŝ=M×Y。",
    "掩码乘原始复数频谱，保留输入相位，经 iSTFT 与重叠相加恢复 PCM。未加入额外后滤波。三段音频统一缩放，避免分别归一化误导对比。": "マスクを元の複素スペクトルに掛け、入力位相を保ったまま iSTFT とオーバーラップ加算で PCM を復元します。追加のポストフィルタはありません。3 音声は同じスケールで比較し、個別正規化による誤解を避けます。",
    "输入：带噪 PCM": "入力：ノイズ付き PCM",
    "PCM 是按时间排列的振幅数值。这里是合成谐波加白噪声，不是真人说话。": "PCM は時間順に並んだ振幅値です。ここでは合成調波にホワイトノイズを加えており、実際の発話ではありません。",
    "运算：分帧、加窗、FFT": "処理：フレーム化、窓掛け、FFT",
    "每 32 ms 取一帧，每 16 ms 前进一步。Hann 窗减轻截断引起的频谱泄漏；逐帧 FFT 组成 STFT，展示不同频率随时间的变化。": "32 ms ごとに 1 フレームを取り、16 ms ずつ進めます。Hann 窓で切断によるスペクトル漏れを抑え、フレームごとの FFT から STFT を作って周波数の時間変化を示します。",
    "输出：频谱与模型特征": "出力：スペクトルとモデル特徴",
    "复数频谱含幅度和相位。本模型只把缩放后的对数幅度送入网络，不使用 MFCC；相位留到重建时使用。": "複素スペクトルには振幅と位相が含まれます。このモデルはスケールした対数振幅だけをネットワークに入力し、MFCC は使いません。位相は再構成に残します。",
    "输入：3×3 局部频谱": "入力：局所 3×3 スペクトル",
    "取相邻 3 个频率 bin 和 3 个时间帧。模型同时观察某个频率及其附近的时频结构。": "隣接する 3 周波数 bin と 3 時間フレームを取り、ある周波数と周辺の時間周波数構造を同時に見ます。",
    "运算：共享权重乘加": "処理：共有重みの積和",
    "九个输入分别乘九个权重，再求和加偏置。同一组权重扫描整个频谱；训练调整权重，而不是人为指定哪里是语音。": "9 個の入力に 9 個の重みを掛けて合計し、バイアスを加えます。同じ重みがスペクトル全体を走査し、音声領域を人手で指定するのではなく学習で調整します。",
    "输出：四路响应": "出力：4 系統の応答",
    "四组卷积核各产生一张响应图。它们是内部特征，不是四个麦克风，也不是四条可播放音轨。": "4 組の畳み込みカーネルがそれぞれ応答マップを作ります。内部特徴であり、4 本のマイクや再生可能な 4 音声トラックではありません。",
    "输入：卷积响应 z": "入力：畳み込み応答 z",
    "卷积乘加结果可以为正或负，尚未决定最终保留多少声音。": "畳み込みの積和結果は正にも負にもなり、最終的にどれだけ音を残すかはまだ決まっていません。",
    "运算：ReLU 非线性": "処理：ReLU 非線形性",
    "ReLU 将负值置零、正值保留。加入非线性后，网络可以学习比单次线性加权更复杂的映射。": "ReLU は負値を 0 にし、正値を保持します。非線形性により、ネットワークは 1 回の線形重み付けより複雑な写像を学習できます。",
    "输出：激活特征图": "出力：活性化特徴マップ",
    "亮区表示卷积核对该局部模式响应较强。四通道使用同一色标，但不能把亮度解释为声音更响或语音更确定。": "明るい部分はカーネルが局所パターンに強く応答したことを示します。4 チャネルは同じカラースケールですが、明るさは大きな音や確かな音声を意味しません。",
    "输入：四路激活": "入力：4 系統の活性化",
    "取同一个时间帧、同一个频率 bin 上的四个特征值。": "同じ時間フレーム、同じ周波数 bin にある 4 つの特徴値を取ります。",
    "运算：1×1 卷积与 Sigmoid": "処理：1×1 畳み込みと Sigmoid",
    "将四路特征加权求和加偏置，再映射到 0–1。训练目标是该位置干净信号与带噪信号的幅度比，并裁剪到 0–1。": "4 系統の特徴を重み付き加算してバイアスを加え、0–1 に写像します。学習目標はその位置のクリーン信号とノイズ付き信号の振幅比を 0–1 にクリップしたものです。",
    "输出：逐点幅度掩码 M": "出力：点ごとの振幅マスク M",
    "M 接近 0 表示强衰减，接近 1 表示保留。M=0.2 对应约 −14 dB 幅度增益；同一格内的目标与噪声都会被缩放，不能保证完全分离。": "M が 0 に近いほど強く減衰し、1 に近いほど保持します。M=0.2 は約 −14 dB の振幅ゲインに相当します。同じ bin の目標音とノイズがともにスケールされるため、完全分離は保証されません。",
    "输入：掩码与原始复数频谱": "入力：マスクと元の複素スペクトル",
    "逐点相乘 Ŝ=M×Y，修改幅度并沿用输入相位。输出频谱使用与输入相同的色标，便于比较衰减区域。": "点ごとに Ŝ=M×Y を掛け、振幅を変えながら入力位相を使います。出力スペクトルは入力と同じ色スケールで、減衰領域を比較できます。",
    "运算：iSTFT 重建": "処理：iSTFT 再構成",
    "每帧做逆 FFT，再按窗口重叠相加并归一化，恢复连续 PCM。本例没有额外 AGC 或后滤波。": "各フレームに逆 FFT を行い、窓に従ってオーバーラップ加算と正規化をして連続 PCM を復元します。本例に追加の AGC やポストフィルタはありません。",
    "输出：可播放 PCM": "出力：再生可能な PCM",
    "对比残留噪声与谐波是否受损。SNR 使用已知干净参考计算，只代表本段合成信号，不能推断真实语音质量。": "残留ノイズと調波の損傷を比較します。SNR は既知のクリーン参照から計算した、この合成信号だけの指標であり、実音声品質は推定できません。",
    "从频谱到降噪：看见模型计算": "スペクトルからノイズ抑制へ：モデル計算を見る",
    "教学 CNN：用 24 段合成谐波与白噪声训练，展示独立测试片段的真实中间结果；不是经过真实语音验证的降噪产品。结构为 3×3 卷积（4 通道）→ ReLU → 1×1 卷积 → Sigmoid。": "教材用 CNN です。24 個の合成調波とホワイトノイズで学習し、独立したテスト区間の実中間結果を示します。実音声で検証した製品用ノイズ抑制器ではありません。構造は 3×3 畳み込み（4 チャネル）→ ReLU → 1×1 畳み込み → Sigmoid です。",
    "时序边界：这是离线预计算。STFT 窗以帧时间为中心、两端补零；3×3 卷积还读取下一帧。以帧中心计，特征窗需 16 ms 未来样本，再加 16 ms 下一帧上下文，掩码至少需 32 ms 前视；这还不是端到端延迟。": "時間境界：これはオフライン事前計算です。STFT 窓はフレーム時刻を中心にゼロパディングされ、3×3 畳み込みは次フレームも読みます。フレーム中心から見ると特徴窓に 16 ms の未来サンプル、さらに次フレームの 16 ms コンテキストが必要なので、マスクには少なくとも 32 ms の先読みが必要です。これはエンドツーエンド遅延ではありません。",
    "数据加载失败，请刷新重试。": "データの読み込みに失敗しました。更新して再試行してください。",
    "加载计算结果…": "計算結果を読み込み中…",
    "PCM 波形对照": "PCM 波形の比較",
    "带噪 PCM": "ノイズ付き PCM",
    "输出 PCM": "出力 PCM",
    "同一片段 0.500–0.532 s；横轴为时间，纵轴为归一化 PCM 幅度，两图零线及幅度比例相同（每单位 40 图像坐标）。": "同じ区間 0.500–0.532 s。横軸は時間、縦軸は正規化 PCM 振幅で、ゼロ線と振幅スケールは両図で同じです（振幅 1 単位あたり描画座標 40）。",
    "输出通道": "出力チャネル",
    "时间帧": "時間フレーム",
    "频率 bin": "周波数 bin",
    "所选位置": "選択位置",
    "幅度增益": "振幅ゲイン",
    "滑动仅检查固定推理结果，不会重新训练或改变音频。": "スライダーは固定された推論結果を確認するだけで、再学習や音声変更は行いません。",
    "掩码计算图解": "マスク計算の解説",
    "四路特征如何变成一个掩码": "4 つの特徴が 1 つのマスクになる仕組み",
    "特征通道": "特徴チャネル",
    "求和 + 偏置": "加算 + バイアス",
    "缩放线性频谱幅度": "線形スペクトル振幅をスケール",
    "h 是激活值，w 和偏置是训练得到的参数。显示数值经过舍入，因此复算与保存的掩码可能有微小差异。幅度取自原始 STFT 系数，既不是 0–1 着色特征，也不是 PCM 单点振幅。": "h は活性化値、w とバイアスは学習パラメータです。表示値は丸められているため、再計算値と保存マスクに小さな差が出る場合があります。振幅は元の STFT 係数から取り、0–1 の着色特徴でも PCM の単一サンプル振幅でもありません。",
    "三张图的白框对应同一时间帧和频率 bin；掩码图亮度表示保留比例，输入与输出图亮度表示对数幅度。": "3 枚の図の白枠は同じ時間フレームと周波数 bin に対応します。マスク図の明るさは保持率、入力・出力図の明るさは対数振幅を示します。",
    "输入频谱": "入力スペクトル",
    "输入幅度：暗 -80 dB → 亮 0 dB": "入力振幅：暗い -80 dB → 明るい 0 dB",
    "ReLU 激活；四通道共用色标，非能量": "ReLU 活性化。4 チャネル共通の色スケールで、エネルギーではない",
    "掩码：暗 0（抑制）→ 亮 1（保留）": "マスク：暗い 0（抑制）→ 明るい 1（保持）",
    "输出频谱": "出力スペクトル",
    "输出幅度：与输入相同色标": "出力振幅：入力と同じ色スケール",
    "掩码": "マスク",
    "训练方式与可复现源码": "学習方法と再現可能なソース",
    "（仅此合成测试片段）": "（この合成テスト区間のみ）",
    "目标为 clip(|S|/(|Y|+ε),0,1)，以掩码 MSE 训练，NumPy 反向传播与 Adam 更新权重。固定随机种子，测试片段未参与训练。真实语音、混响与其他噪声尚未验证。": "目標は clip(|S|/(|Y|+ε),0,1) で、マスク MSE、NumPy の逆伝播、Adam で重みを更新します。乱数種を固定し、テスト区間は学習に使っていません。実音声、残響、他のノイズ種類は未検証です。",
    "横轴：时间帧 0–63（0–1.008 s）；纵轴：下方 0 Hz，上方 1968.75 Hz（bin 0–63）。局部展示，模型实际处理完整 0–4 kHz 频谱和 2 秒音频。": "横軸：時間フレーム 0–63（0–1.008 s）、縦軸：下が 0 Hz、上が 1968.75 Hz（bin 0–63）。局所表示で、モデルは 0–4 kHz の全スペクトルと 2 秒音声を処理します。",
    "带噪输入": "ノイズ付き入力",
    "模型输出": "モデル出力",
    "干净参考": "クリーン参照"
  };
  const ko: Record<string, string> = {
    "模型逐步可视化": "모델 단계별 시각화",
    "输入与 STFT": "입력과 STFT",
    "卷积乘加": "합성곱 곱셈-누산",
    "激活特征": "활성화 특징",
    "预测掩码": "마스크 예측",
    "重建与试听": "재구성과 청취",
    "8 kHz PCM → 256 点 Hann 窗 → STFT，hop=128。幅度 dB 裁剪至 [-80,0]，再缩放到 [0,1] 作为模型输入；另行保留复数频谱用于重建。": "8 kHz PCM → 256포인트 Hann 창 → STFT, hop=128. 진폭 dB를 [-80,0]으로 자른 뒤 [0,1]로 스케일해 모델 입력으로 사용하고 복소 스펙트럼은 재구성용으로 보존합니다.",
    "3×3 核沿时间和频率移动，逐项相乘、求和、加偏置。深度学习中通常将这种互相关运算称为卷积，权重来自训练。": "3×3 커널을 시간과 주파수 방향으로 이동하며 원소별 곱셈·합산·바이어스 추가를 수행합니다. 딥러닝에서는 이런 상호상관 연산을 보통 합성곱이라 부르며 가중치는 학습으로 얻습니다.",
    "ReLU(z)=max(0,z)。四个通道有各自的学习权重，亮区表示响应较强，不代表声音能量或语音概率。": "ReLU(z)=max(0,z). 4개 채널은 서로 다른 학습 가중치를 사용하며 밝은 영역은 응답이 강하다는 뜻이지 소리 에너지나 음성 확률이 아닙니다.",
    "1×1 卷积合并四个激活通道，Sigmoid 产生 0–1 掩码。M=0.2 表示幅度乘 0.2，不是语音概率 20%。Ŝ=M×Y。": "1×1 합성곱으로 4개 활성화 채널을 섞고 Sigmoid로 0–1 마스크를 만듭니다. M=0.2는 진폭을 0.2배 한다는 뜻이지 음성 확률 20%가 아닙니다. Ŝ=M×Y.",
    "掩码乘原始复数频谱，保留输入相位，经 iSTFT 与重叠相加恢复 PCM。未加入额外后滤波。三段音频统一缩放，避免分别归一化误导对比。": "마스크를 원본 복소 스펙트럼에 곱하고 입력 위상을 유지한 뒤 iSTFT와 오버랩-애드로 PCM을 복원합니다. 추가 후필터는 없습니다. 세 오디오를 같은 스케일로 처리해 개별 정규화로 인한 비교 왜곡을 피합니다.",
    "输入：带噪 PCM": "입력: 잡음 PCM",
    "PCM 是按时间排列的振幅数值。这里是合成谐波加白噪声，不是真人说话。": "PCM은 시간순으로 배열된 진폭 값입니다. 여기에는 합성 고조파와 백색 잡음이 있으며 실제 사람의 발화가 아닙니다.",
    "运算：分帧、加窗、FFT": "연산: 프레임화, 창 적용, FFT",
    "每 32 ms 取一帧，每 16 ms 前进一步。Hann 窗减轻截断引起的频谱泄漏；逐帧 FFT 组成 STFT，展示不同频率随时间的变化。": "32 ms마다 한 프레임을 취하고 16 ms씩 이동합니다. Hann 창은 절단으로 인한 스펙트럼 누설을 줄이며 프레임별 FFT를 모아 시간에 따른 주파수 변화를 보여 주는 STFT를 만듭니다.",
    "输出：频谱与模型特征": "출력: 스펙트럼과 모델 특징",
    "复数频谱含幅度和相位。本模型只把缩放后的对数幅度送入网络，不使用 MFCC；相位留到重建时使用。": "복소 스펙트럼에는 진폭과 위상이 들어 있습니다. 이 모델은 스케일된 로그 진폭만 네트워크에 넣고 MFCC는 사용하지 않으며 위상은 재구성에 사용합니다.",
    "输入：3×3 局部频谱": "입력: 지역 3×3 스펙트럼",
    "取相邻 3 个频率 bin 和 3 个时间帧。模型同时观察某个频率及其附近的时频结构。": "인접한 주파수 bin 3개와 시간 프레임 3개를 취해 특정 주파수와 주변 시간-주파수 구조를 함께 봅니다.",
    "运算：共享权重乘加": "연산: 공유 가중치 곱셈-누산",
    "九个输入分别乘九个权重，再求和加偏置。同一组权重扫描整个频谱；训练调整权重，而不是人为指定哪里是语音。": "9개 입력에 9개 가중치를 각각 곱해 합산하고 바이어스를 더합니다. 같은 가중치가 전체 스펙트럼을 훑으며 음성 영역을 사람이 지정하지 않고 학습으로 조정합니다.",
    "输出：四路响应": "출력: 4개 응답 채널",
    "四组卷积核各产生一张响应图。它们是内部特征，不是四个麦克风，也不是四条可播放音轨。": "4개 합성곱 커널이 각각 응답 맵을 만듭니다. 내부 특징이지 4개의 마이크나 재생 가능한 4개 트랙이 아닙니다.",
    "输入：卷积响应 z": "입력: 합성곱 응답 z",
    "卷积乘加结果可以为正或负，尚未决定最终保留多少声音。": "합성곱 곱셈-누산 결과는 양수나 음수가 될 수 있으며 최종적으로 얼마나 소리를 남길지는 아직 정해지지 않았습니다.",
    "运算：ReLU 非线性": "연산: ReLU 비선형성",
    "ReLU 将负值置零、正值保留。加入非线性后，网络可以学习比单次线性加权更复杂的映射。": "ReLU는 음수 값을 0으로 만들고 양수는 유지합니다. 비선형성이 추가되면 네트워크가 한 번의 선형 가중합보다 복잡한 매핑을 학습할 수 있습니다.",
    "输出：激活特征图": "출력: 활성화 특징 맵",
    "亮区表示卷积核对该局部模式响应较强。四通道使用同一色标，但不能把亮度解释为声音更响或语音更确定。": "밝은 영역은 커널이 해당 지역 패턴에 강하게 응답했다는 뜻입니다. 4개 채널은 같은 색상 범위를 사용하지만 밝기가 더 큰 소리나 더 확실한 음성을 뜻하지는 않습니다.",
    "输入：四路激活": "입력: 4개 활성화",
    "取同一个时间帧、同一个频率 bin 上的四个特征值。": "같은 시간 프레임과 주파수 bin에 있는 4개 특징 값을 취합니다.",
    "运算：1×1 卷积与 Sigmoid": "연산: 1×1 합성곱과 Sigmoid",
    "将四路特征加权求和加偏置，再映射到 0–1。训练目标是该位置干净信号与带噪信号的幅度比，并裁剪到 0–1。": "4개 특징을 가중 합산하고 바이어스를 더한 뒤 0–1로 매핑합니다. 학습 목표는 해당 위치의 깨끗한 신호와 잡음 신호의 진폭 비를 0–1로 자른 값입니다.",
    "输出：逐点幅度掩码 M": "출력: 점별 진폭 마스크 M",
    "M 接近 0 表示强衰减，接近 1 表示保留。M=0.2 对应约 −14 dB 幅度增益；同一格内的目标与噪声都会被缩放，不能保证完全分离。": "M이 0에 가까우면 강하게 감쇠하고 1에 가까우면 보존합니다. M=0.2는 약 −14 dB 진폭 이득입니다. 같은 bin의 목표음과 잡음이 함께 스케일되므로 완전한 분리는 보장되지 않습니다.",
    "输入：掩码与原始复数频谱": "입력: 마스크와 원본 복소 스펙트럼",
    "逐点相乘 Ŝ=M×Y，修改幅度并沿用输入相位。输出频谱使用与输入相同的色标，便于比较衰减区域。": "점별로 Ŝ=M×Y를 곱해 진폭을 바꾸고 입력 위상을 유지합니다. 출력 스펙트럼은 입력과 같은 색상 범위를 사용해 감쇠 영역을 비교합니다.",
    "运算：iSTFT 重建": "연산: iSTFT 재구성",
    "每帧做逆 FFT，再按窗口重叠相加并归一化，恢复连续 PCM。本例没有额外 AGC 或后滤波。": "각 프레임에 역 FFT를 적용한 뒤 창에 따라 오버랩-애드와 정규화를 수행해 연속 PCM을 복원합니다. 추가 AGC나 후필터는 없습니다.",
    "输出：可播放 PCM": "출력: 재생 가능한 PCM",
    "对比残留噪声与谐波是否受损。SNR 使用已知干净参考计算，只代表本段合成信号，不能推断真实语音质量。": "잔여 잡음과 고조파 손상을 비교합니다. SNR은 알려진 깨끗한 참조로 계산한 이 합성 구간의 지표일 뿐 실제 음성 품질을 추정하지 않습니다.",
    "从频谱到降噪：看见模型计算": "스펙트럼에서 잡음 억제까지: 모델 계산 보기",
    "教学 CNN：用 24 段合成谐波与白噪声训练，展示独立测试片段的真实中间结果；不是经过真实语音验证的降噪产品。结构为 3×3 卷积（4 通道）→ ReLU → 1×1 卷积 → Sigmoid。": "교육용 CNN입니다. 24개의 합성 고조파와 백색 잡음으로 학습하고 독립 테스트 구간의 실제 중간 결과를 보여 줍니다. 실제 음성으로 검증된 잡음 억제 제품이 아니며 구조는 3×3 합성곱(4채널) → ReLU → 1×1 합성곱 → Sigmoid입니다.",
    "时序边界：这是离线预计算。STFT 窗以帧时间为中心、两端补零；3×3 卷积还读取下一帧。以帧中心计，特征窗需 16 ms 未来样本，再加 16 ms 下一帧上下文，掩码至少需 32 ms 前视；这还不是端到端延迟。": "시간 경계: 오프라인으로 미리 계산된 결과입니다. STFT 창은 프레임 시각을 중심으로 하고 양끝을 0으로 채우며 3×3 합성곱은 다음 프레임도 읽습니다. 프레임 중심 기준으로 특징 창에 16 ms 미래 샘플과 다음 프레임의 16 ms 문맥이 필요하므로 마스크에는 최소 32 ms 룩어헤드가 필요합니다. 엔드투엔드 지연은 아닙니다.",
    "数据加载失败，请刷新重试。": "데이터를 불러오지 못했습니다. 새로 고쳐 다시 시도하세요.",
    "加载计算结果…": "계산 결과를 불러오는 중…",
    "PCM 波形对照": "PCM 파형 비교",
    "带噪 PCM": "잡음 PCM",
    "输出 PCM": "출력 PCM",
    "同一片段 0.500–0.532 s；横轴为时间，纵轴为归一化 PCM 幅度，两图零线及幅度比例相同（每单位 40 图像坐标）。": "같은 구간 0.500–0.532 s입니다. 가로축은 시간, 세로축은 정규화 PCM 진폭이며 두 그림의 0선과 진폭 스케일은 같습니다(진폭 단위당 도형 좌표 40).",
    "输出通道": "출력 채널",
    "时间帧": "시간 프레임",
    "频率 bin": "주파수 bin",
    "所选位置": "선택한 위치",
    "幅度增益": "진폭 이득",
    "滑动仅检查固定推理结果，不会重新训练或改变音频。": "슬라이더는 고정된 추론 결과만 확인하며 재학습하거나 오디오를 바꾸지 않습니다.",
    "掩码计算图解": "마스크 계산 해설",
    "四路特征如何变成一个掩码": "4개 특징이 하나의 마스크가 되는 과정",
    "特征通道": "특징 채널",
    "求和 + 偏置": "합산 + 바이어스",
    "缩放线性频谱幅度": "선형 스펙트럼 진폭 스케일링",
    "h 是激活值，w 和偏置是训练得到的参数。显示数值经过舍入，因此复算与保存的掩码可能有微小差异。幅度取自原始 STFT 系数，既不是 0–1 着色特征，也不是 PCM 单点振幅。": "h는 활성화 값이고 w와 바이어스는 학습된 파라미터입니다. 표시 값은 반올림되므로 재계산과 저장된 마스크 사이에 작은 차이가 날 수 있습니다. 진폭은 원본 STFT 계수에서 가져오며 0–1 색상 특징이나 PCM 단일 샘플 진폭이 아닙니다.",
    "三张图的白框对应同一时间帧和频率 bin；掩码图亮度表示保留比例，输入与输出图亮度表示对数幅度。": "세 그림의 흰색 테두리는 같은 시간 프레임과 주파수 bin을 가리킵니다. 마스크 그림의 밝기는 보존 비율, 입력·출력 그림의 밝기는 로그 진폭을 뜻합니다.",
    "输入频谱": "입력 스펙트럼",
    "输入幅度：暗 -80 dB → 亮 0 dB": "입력 진폭: 어두운 -80 dB → 밝은 0 dB",
    "ReLU 激活；四通道共用色标，非能量": "ReLU 활성화. 4개 채널 공통 색상 범위이며 에너지가 아님",
    "掩码：暗 0（抑制）→ 亮 1（保留）": "마스크: 어두운 0(억제) → 밝은 1(보존)",
    "输出频谱": "출력 스펙트럼",
    "输出幅度：与输入相同色标": "출력 진폭: 입력과 같은 색상 범위",
    "掩码": "마스크",
    "训练方式与可复现源码": "학습 방법과 재현 가능한 소스",
    "（仅此合成测试片段）": "(이 합성 테스트 구간만)",
    "目标为 clip(|S|/(|Y|+ε),0,1)，以掩码 MSE 训练，NumPy 反向传播与 Adam 更新权重。固定随机种子，测试片段未参与训练。真实语音、混响与其他噪声尚未验证。": "목표는 clip(|S|/(|Y|+ε),0,1)이며 마스크 MSE, NumPy 역전파, Adam으로 가중치를 갱신합니다. 난수 시드를 고정했고 테스트 구간은 학습에 사용하지 않았습니다. 실제 음성·잔향·다른 잡음 종류는 검증하지 않았습니다.",
    "横轴：时间帧 0–63（0–1.008 s）；纵轴：下方 0 Hz，上方 1968.75 Hz（bin 0–63）。局部展示，模型实际处理完整 0–4 kHz 频谱和 2 秒音频。": "가로축: 시간 프레임 0–63(0–1.008 s), 세로축: 아래 0 Hz, 위 1968.75 Hz(bin 0–63)입니다. 부분 표시이며 모델은 0–4 kHz 전체 스펙트럼과 2초 오디오를 처리합니다.",
    "带噪输入": "잡음 입력",
    "模型输出": "모델 출력",
    "干净参考": "깨끗한 참조"
  };
  const t = (zh: string, en: string) => language === "zh" ? zh : language === "en" ? en : (language === "ja" ? ja[zh] : ko[zh]);
  const [data,setData] = useState<Demo | null>(null);
  const [failed,setFailed] = useState(false);
  const [step,setStep] = useState(0);
  const [channel,setChannel] = useState(0);
  const [frame,setFrame] = useState(20);
  const [bin,setBin] = useState(8);
  const root = `${import.meta.env.BASE_URL}ai-denoise/`;
  useEffect(()=>{
    const controller = new AbortController();
    fetch(`${root}demo.json`,{signal:controller.signal}).then(r=>{if(!r.ok) throw Error(); return r.json();}).then(setData).catch(e=>{if(e.name!=="AbortError") setFailed(true);});
    return ()=>controller.abort();
  },[root]);
  const names = [t("输入与 STFT","Input and STFT"),t("卷积乘加","Convolution"),t("激活特征","Activations"),t("预测掩码","Predict mask"),t("重建与试听","Reconstruction")];
  const descriptions = [
    t("8 kHz PCM → 256 点 Hann 窗 → STFT，hop=128。幅度 dB 裁剪至 [-80,0]，再缩放到 [0,1] 作为模型输入；另行保留复数频谱用于重建。", "8 kHz PCM → 256-point Hann window → STFT, hop=128. Magnitude dB is clipped to [-80,0] and scaled to [0,1] for the model; complex spectra are retained for reconstruction."),
    t("3×3 核沿时间和频率移动，逐项相乘、求和、加偏置。深度学习中通常将这种互相关运算称为卷积，权重来自训练。", "A 3×3 kernel slides over time and frequency: multiply, sum, add bias. Deep learning usually calls this cross-correlation convolution; weights are learned."),
    t("ReLU(z)=max(0,z)。四个通道有各自的学习权重，亮区表示响应较强，不代表声音能量或语音概率。", "ReLU(z)=max(0,z). Four channels use different learned weights. Bright areas indicate stronger activations, not sound energy or speech probability."),
    t("1×1 卷积合并四个激活通道，Sigmoid 产生 0–1 掩码。M=0.2 表示幅度乘 0.2，不是语音概率 20%。Ŝ=M×Y。", "A 1×1 convolution mixes four activation channels; sigmoid produces a 0–1 mask. M=0.2 multiplies amplitude by 0.2, not a 20% speech probability. Ŝ=M×Y."),
    t("掩码乘原始复数频谱，保留输入相位，经 iSTFT 与重叠相加恢复 PCM。未加入额外后滤波。三段音频统一缩放，避免分别归一化误导对比。", "Apply the mask to the original complex spectrum, retain input phase, and reconstruct PCM via iSTFT and overlap-add. No extra postfilter. All clips share one scale for a fair comparison.")
  ];
  const products = data ? data.kernels[channel].flat().map((w,i)=>({w,x:data.input[bin+Math.floor(i/3)-1][frame+i%3-1]})) : [];
  const sum = data ? products.reduce((s,p)=>s+p.x*p.w,data.bias[channel]) : 0;
  const headProducts = data ? data.head.map((w,i)=>({w,x:data.activations[i][bin][frame]})) : [];
  const logit = data ? headProducts.reduce((s,p)=>s+p.x*p.w,data.headBias) : 0;
  const predictedMask = 1 / (1 + Math.exp(-Math.max(-30,Math.min(30,logit))));
  const selected = step===3 ? [frame,bin] : undefined;
  const explanations = [
    [t("输入：带噪 PCM", "Input: noisy PCM"), t("PCM 是按时间排列的振幅数值。这里是合成谐波加白噪声，不是真人说话。", "PCM stores amplitude samples over time. Here it contains synthetic harmonics plus white noise, not recorded speech."),
      t("运算：分帧、加窗、FFT", "Operation: frame, window, FFT"), t("每 32 ms 取一帧，每 16 ms 前进一步。Hann 窗减轻截断引起的频谱泄漏；逐帧 FFT 组成 STFT，展示不同频率随时间的变化。", "Take a 32 ms frame every 16 ms. A Hann window reduces spectral leakage from truncation; frame-by-frame FFTs form the STFT, showing frequency content over time."),
      t("输出：频谱与模型特征", "Output: spectrum and model features"), t("复数频谱含幅度和相位。本模型只把缩放后的对数幅度送入网络，不使用 MFCC；相位留到重建时使用。", "The complex spectrum contains magnitude and phase. This model receives scaled log magnitudes, not MFCCs; phase is retained for reconstruction.")],
    [t("输入：3×3 局部频谱", "Input: a local 3×3 patch"), t("取相邻 3 个频率 bin 和 3 个时间帧。模型同时观察某个频率及其附近的时频结构。", "Take three neighboring frequency bins across three frames, so the model sees local time-frequency structure."),
      t("运算：共享权重乘加", "Operation: weighted sum"), t("九个输入分别乘九个权重，再求和加偏置。同一组权重扫描整个频谱；训练调整权重，而不是人为指定哪里是语音。", "Multiply nine inputs by nine weights, sum, and add a bias. The same weights scan the spectrum; training adjusts them rather than manually labeling speech regions."),
      t("输出：四路响应", "Output: four response channels"), t("四组卷积核各产生一张响应图。它们是内部特征，不是四个麦克风，也不是四条可播放音轨。", "Four kernels produce four response maps. These are internal features, not four microphones or playable audio tracks.")],
    [t("输入：卷积响应 z", "Input: convolution response z"), t("卷积乘加结果可以为正或负，尚未决定最终保留多少声音。", "Weighted sums can be positive or negative; they do not yet decide how much sound to retain."),
      t("运算：ReLU 非线性", "Operation: ReLU nonlinearity"), t("ReLU 将负值置零、正值保留。加入非线性后，网络可以学习比单次线性加权更复杂的映射。", "ReLU sets negative values to zero and keeps positive values, allowing more complex mappings than a single linear weighted sum."),
      t("输出：激活特征图", "Output: activation maps"), t("亮区表示卷积核对该局部模式响应较强。四通道使用同一色标，但不能把亮度解释为声音更响或语音更确定。", "Brightness means a stronger response to a local pattern. Channels share a color scale, but brightness does not mean louder sound or greater speech certainty.")],
    [t("输入：四路激活", "Input: four activations"), t("取同一个时间帧、同一个频率 bin 上的四个特征值。", "Take the four feature values at the same frame and frequency bin."),
      t("运算：1×1 卷积与 Sigmoid", "Operation: 1×1 convolution and sigmoid"), t("将四路特征加权求和加偏置，再映射到 0–1。训练目标是该位置干净信号与带噪信号的幅度比，并裁剪到 0–1。", "Mix the four features with weights and a bias, then map to 0–1. The training target is the clean-to-noisy magnitude ratio clipped to 0–1."),
      t("输出：逐点幅度掩码 M", "Output: magnitude mask M"), t("M 接近 0 表示强衰减，接近 1 表示保留。M=0.2 对应约 −14 dB 幅度增益；同一格内的目标与噪声都会被缩放，不能保证完全分离。", "M near 0 strongly attenuates; near 1 retains. M=0.2 means about −14 dB gain. Both target and noise in that bin are scaled, so perfect separation is not guaranteed.")],
    [t("输入：掩码与原始复数频谱", "Input: mask and original complex spectrum"), t("逐点相乘 Ŝ=M×Y，修改幅度并沿用输入相位。输出频谱使用与输入相同的色标，便于比较衰减区域。", "Multiply pointwise: Ŝ=M×Y, changing magnitude while retaining input phase. Input and output spectra share a color scale for comparing attenuation."),
      t("运算：iSTFT 重建", "Operation: iSTFT reconstruction"), t("每帧做逆 FFT，再按窗口重叠相加并归一化，恢复连续 PCM。本例没有额外 AGC 或后滤波。", "Apply an inverse FFT to each frame, then overlap-add with window normalization to reconstruct PCM. This example adds no AGC or postfilter."),
      t("输出：可播放 PCM", "Output: playable PCM"), t("对比残留噪声与谐波是否受损。SNR 使用已知干净参考计算，只代表本段合成信号，不能推断真实语音质量。", "Compare residual noise and harmonic damage. SNR uses the known clean reference and describes only this synthetic clip, not real-speech quality.")]
  ];
  return <section className="ai-denoise-walkthrough" aria-label={t("模型逐步可视化","Model walkthrough")}>
    <h2>{t("从频谱到降噪：看见模型计算","From spectrum to denoising: inspect the computation")}</h2>
    <p>{t("教学 CNN：用 24 段合成谐波与白噪声训练，展示独立测试片段的真实中间结果；不是经过真实语音验证的降噪产品。结构为 3×3 卷积（4 通道）→ ReLU → 1×1 卷积 → Sigmoid。", "Teaching CNN: trained on 24 synthetic harmonic signals with white noise. These are real intermediate results on a held-out clip, not a validated speech denoiser. Architecture: 3×3 convolution (4 channels) → ReLU → 1×1 convolution → sigmoid.")}</p>
    <p>{t("时序边界：这是离线预计算。STFT 窗以帧时间为中心、两端补零；3×3 卷积还读取下一帧。以帧中心计，特征窗需 16 ms 未来样本，再加 16 ms 下一帧上下文，掩码至少需 32 ms 前视；这还不是端到端延迟。", "Timing boundary: results are precomputed offline. STFT windows are centered with zero-padded boundaries; the 3×3 convolution also reads the next frame. Relative to the frame center, the feature window needs 16 ms of future samples plus 16 ms for the next frame: at least 32 ms of lookahead for the mask, not total end-to-end latency.")}</p>
    <div className="robot-buttons">{names.map((s,i)=><button key={s} onClick={()=>setStep(i)} aria-pressed={step===i}>{i+1}. {s}</button>)}</div>
    {failed ? <p role="alert">{t("数据加载失败，请刷新重试。","Data failed to load. Reload to retry.")}</p> : !data ? <p role="status">{t("加载计算结果…","Loading results…")}</p> : <>
      <h3>{names[step]}</h3><p>{descriptions[step]}</p>
      <dl className="denoise-explanation">{[0,2,4].map(i=><div key={i}><dt>{explanations[step][i]}</dt><dd>{explanations[step][i+1]}</dd></div>)}</dl>
      {(step===0 || step===4) && data.waves && <figure style={{margin:0}}><svg viewBox="0 0 600 220" role="img" aria-label={t("PCM 波形对照","PCM waveform comparison")} style={{width:"100%",maxHeight:220,background:"#f0f5f3"}}>{data.waves.map((wave,i)=><g key={i}><text x="12" y={20+i*100} fill="#285c50">{i===0 ? t("带噪 PCM","Noisy PCM") : t("输出 PCM","Output PCM")}</text><path d={`M0 ${60+i*100} H600`} stroke="#99b8b0" /><path d={wave.map((v,j)=>`${j===0 ? "M" : "L"}${j/255*600} ${60+i*100-v*40}`).join(" ")} fill="none" stroke={i===0 ? "#a26a2e" : "#158571"} /></g>)}</svg><figcaption>{t("同一片段 0.500–0.532 s；横轴为时间，纵轴为归一化 PCM 幅度，两图零线及幅度比例相同（每单位 40 图像坐标）。", "Same excerpt, 0.500–0.532 s; horizontal time, vertical normalized PCM amplitude. Both use identical zero-line conventions and amplitude scale (40 drawing units per amplitude unit).")}</figcaption></figure>}
      {(step>=1 && step<=3) && <div className="robot-controls">{step<3 && <label>{t("输出通道","Output channel")}<select value={channel} onChange={e=>setChannel(+e.target.value)}>{[0,1,2,3].map(i=><option key={i} value={i}>{i+1}</option>)}</select></label>}<label>{t("时间帧","Time frame")} {frame}<input type="range" min="1" max="62" value={frame} onChange={e=>setFrame(+e.target.value)} /></label><label>{t("频率 bin","Frequency bin")} {bin} ({bin*31.25} Hz)<input type="range" min="1" max="62" value={bin} onChange={e=>setBin(+e.target.value)} /></label></div>}
      {step===3 && <p data-testid="denoise-mask-value">{t("所选位置", "Selected position")}: M = {data.mask[bin][frame].toFixed(4)}; {t("幅度增益", "Magnitude gain")} = {(20*Math.log10(data.mask[bin][frame])).toFixed(2)} dB. {t("滑动仅检查固定推理结果，不会重新训练或改变音频。", "Sliders inspect fixed inference results; they do not retrain the model or change the audio.")}</p>}
      {step===3 && <section className="denoise-head" aria-label={t("掩码计算图解", "Mask calculation walkthrough")}>
        <h4>{t("四路特征如何变成一个掩码", "How four features become one mask")}</h4>
        <div className="denoise-head-products">{headProducts.map((p,i)=><div key={i}><strong>{t("特征通道", "Feature channel")} {i+1}</strong><code>{p.x.toFixed(5)} × ({p.w.toFixed(5)})<br />= {(p.x*p.w).toFixed(5)}</code></div>)}</div>
        <ol className="denoise-head-flow">
          <li><strong>{t("求和 + 偏置", "Sum + bias")}</strong><code>z = Σ(h × w) + ({data.headBias.toFixed(5)}) = {logit.toFixed(5)}</code></li>
          <li><strong>Sigmoid</strong><code data-testid="denoise-head-result">M = 1 / (1 + exp(−z)) ≈ {predictedMask.toFixed(5)}</code></li>
          <li><strong>{t("缩放线性频谱幅度", "Scale linear spectral magnitude")}</strong><code data-testid="denoise-amplitude-product">|Ŝ| = |Y| × M ≈ {data.magnitude[bin][frame].toExponential(4)} × {data.mask[bin][frame].toFixed(5)} = {(data.magnitude[bin][frame]*data.mask[bin][frame]).toExponential(4)}</code></li>
        </ol>
        <p>{t("h 是激活值，w 和偏置是训练得到的参数。显示数值经过舍入，因此复算与保存的掩码可能有微小差异。幅度取自原始 STFT 系数，既不是 0–1 着色特征，也不是 PCM 单点振幅。", "h denotes an activation; weights w and the bias are learned. Rounded values can cause small differences from the saved mask. Magnitudes come from the original STFT coefficients, not the 0–1 color features or individual PCM samples.")}</p>
        <p>{t("三张图的白框对应同一时间帧和频率 bin；掩码图亮度表示保留比例，输入与输出图亮度表示对数幅度。", "White outlines mark the same frame and frequency bin in all three maps. Mask brightness shows the retained fraction; input and output brightness shows log magnitude.")}</p>
      </section>}
      <div className="denoise-maps">
        <figure><Map values={data.input} selection={step===1 ? [frame,bin] : selected} selectionSize={step===1 ? 3 : 1} label={t("输入频谱","Input spectrum")} /><figcaption>{t("输入幅度：暗 -80 dB → 亮 0 dB","Input magnitude: dark -80 dB → bright 0 dB")}</figcaption></figure>
        <figure><Map values={step<3 ? data.activations[channel] : data.mask} selection={selected} selectionSize={1} max={step<3 ? Math.max(1e-8,...data.activations.flat(2)) : 1} label={step<3 ? "ReLU" : t("掩码", "Mask")} /><figcaption>{step<3 ? t("ReLU 激活；四通道共用色标，非能量","ReLU activation; shared scale across channels, not energy") : t("掩码：暗 0（抑制）→ 亮 1（保留）","Mask: dark 0 (suppress) → bright 1 (retain)")}</figcaption></figure>
        <figure><Map values={data.output} selection={selected} selectionSize={1} label={t("输出频谱","Output spectrum")} /><figcaption>{t("输出幅度：与输入相同色标","Output magnitude: same scale as input")}</figcaption></figure>
      </div>
      <p>{t("横轴：时间帧 0–63（0–1.008 s）；纵轴：下方 0 Hz，上方 1968.75 Hz（bin 0–63）。局部展示，模型实际处理完整 0–4 kHz 频谱和 2 秒音频。", "Horizontal: frames 0–63 (0–1.008 s). Vertical: 0 Hz at bottom, 1968.75 Hz at top (bins 0–63). Cropped display; inference covers the full 0–4 kHz spectrum and 2-second clip.")}</p>
      {step===1 && <><div className="denoise-products">{products.map((p,i)=><code key={i}>{p.x.toFixed(3)} × {p.w.toFixed(3)}<br />= {(p.x*p.w).toFixed(3)}</code>)}</div><p data-testid="denoise-sum"><code>Σ(x×w) + b ({data.bias[channel].toFixed(4)}) = {sum.toFixed(4)} → ReLU = {Math.max(0,sum).toFixed(4)}</code></p></>}
      {step===4 && <><div className="denoise-audio">{["input","output","target"].map((name,i)=><div key={name}><h4>{[t("带噪输入","Noisy input"),t("模型输出","Model output"),t("干净参考","Clean reference")][i]}</h4><audio controls preload="none" src={`${root}${name}.wav`} onPlay={e=>{e.currentTarget.closest("section")?.querySelectorAll("audio").forEach(a=>{if(a!==e.currentTarget) a.pause();});}} /></div>)}</div><p>SNR: {data.snr[0].toFixed(2)} dB → {data.snr[1].toFixed(2)} dB {t("（仅此合成测试片段）","(this synthetic clip only)")}</p></>}
      <details><summary>{t("训练方式与可复现源码","Training and reproducible source")}</summary><p>{t("目标为 clip(|S|/(|Y|+ε),0,1)，以掩码 MSE 训练，NumPy 反向传播与 Adam 更新权重。固定随机种子，测试片段未参与训练。真实语音、混响与其他噪声尚未验证。", "Target: clip(|S|/(|Y|+ε),0,1), trained with mask MSE, NumPy backpropagation, and Adam. Fixed seed; test clip excluded from training. Real speech, reverberation, and other noise types are untested.")}</p><code>scripts/generate-ai-denoise-demo.py</code></details>
    </>}
  </section>;
}
