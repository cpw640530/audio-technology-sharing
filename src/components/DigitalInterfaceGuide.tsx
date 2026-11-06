import type { Language, TopicLab } from "../content/knowledge";
import { text } from "../content/language";
import { Cable } from "lucide-react";

type Props = { language: Language; lab: TopicLab; onOpenLab: () => void };

export function DigitalInterfaceGuide({ language, lab, onOpenLab }: Props) {
  const t = (zh: string, en: string, ja: string, ko: string) => text(language, zh, en, ja, ko);
  const protocols = [
    ["I2S / IIS / I²S", "BCLK + WS/LRCLK + SD",
      t("板内 PCM；单向通常 3 根信号线，MCLK 按器件要求另加。", "On-board PCM; typically 3 signal lines one way, plus MCLK if required.", "基板内PCM。片方向は通常3本、必要ならMCLKを追加。", "보드 내 PCM. 단방향은 보통 신호선 3개이며 필요시 MCLK를 추가합니다."),
      t("一条 SD 每帧左右两个 slot；更多声道可用多条 SD 并行，需两端支持。", "One SD carries left/right slots per frame; parallel SD lines can add channels if both ends support them.", "1本のSDは左右2スロット。対応機器ならSDの並列化で多チャンネル化。", "SD 하나는 프레임당 좌우 슬롯 2개. 양쪽이 지원하면 SD를 병렬로 늘립니다.")],
    ["TDM", "BCLK + FS + SD",
      t("板内多通道 PCM；单向通常 3 根信号线。", "On-board multichannel PCM; typically 3 one-way signal lines.", "基板内の多チャンネルPCM。片方向は通常3本。", "보드 내 다채널 PCM. 단방향은 보통 신호선 3개입니다."),
      t("一帧划分多个 slot，共用一条 SD；FS 脉宽、偏移和 slot 顺序以双方手册为准。", "Multiple slots share one SD; agree on FS width, offset and slot order from both datasheets.", "複数スロットを1本のSDで共有。FS幅・オフセット・順序は双方の仕様で確認。", "여러 슬롯이 SD 하나를 공유합니다. FS 폭, 오프셋, 슬롯 순서는 양쪽 사양을 확인합니다.")],
    ["PDM", "CLK + DATA",
      t("数字麦常用的 1-bit 密度流；通常 2 根信号线。", "A 1-bit density stream for digital mics; typically 2 signal lines.", "デジタルマイク用の1-bit密度ストリーム。通常2本。", "디지털 마이크의 1-bit 밀도 스트림. 보통 신호선 2개입니다."),
      t("先低通、再抽取为 PCM；不能直接按 I2S 字长读取。部分麦可在相反边沿共享 DATA。", "Low-pass and decimate to PCM, not I2S words. Some mics share DATA on opposite clock edges.", "ローパスと間引きでPCMへ変換。I2Sのワードではありません。対応マイクは逆エッジでDATAを共有可能。", "저역통과와 데시메이션으로 PCM으로 변환합니다. I2S 워드가 아닙니다. 일부 마이크는 반대 에지로 DATA를 공유합니다.")],
    ["SPDIF", t("同轴或光纤", "Coaxial or optical", "同軸または光", "동축 또는 광"),
      t("设备间数字音频；时钟嵌入信号，不另接 BCLK。", "Between devices; clock is embedded, with no separate BCLK.", "機器間の音声伝送。クロックを埋め込み、独立BCLKは不要。", "기기 간 오디오 전송. 클록이 내장되어 별도 BCLK가 없습니다."),
      t("常见立体声 PCM，也可承载兼容的压缩码流；同轴和光口不是同一种电气连接。", "Commonly stereo PCM; compatible compressed payloads are possible. Coax and optical use different physical interfaces.", "通常はステレオPCM。対応圧縮データも可。同軸と光は物理接続が異なります。", "주로 스테레오 PCM이며 호환 압축 스트림도 가능합니다. 동축과 광은 물리 연결이 다릅니다.")],
    ["USB Audio", t("USB 数据链路", "USB data link", "USBデータリンク", "USB 데이터 링크"),
      t("主机与音频设备之间按包传输；线数取决于 USB 版本和连接方式。", "Packet transport between host and audio device; wiring depends on USB version and connection.", "ホストと音声機器間のパケット転送。配線はUSB世代と接続方式によります。", "호스트와 오디오 기기 사이의 패킷 전송. 배선은 USB 버전과 연결 방식에 따릅니다."),
      t("没有对外的 LRCLK；设备仍有音频采样时钟，需同步或速率匹配。", "No external LRCLK; the device still needs an audio sample clock and synchronization or rate matching.", "外部LRCLKはありませんが、音声標本化クロックと同期・レート整合は必要。", "외부 LRCLK는 없지만 오디오 샘플 클록과 동기화 또는 속도 정합은 필요합니다.")]
  ];
  const flow = [
    t("PCM 样本", "PCM samples", "PCMサンプル", "PCM 샘플"),
    t("串行发送器", "Serial transmitter", "シリアル送信器", "직렬 송신기"),
    t("BCLK / WS / SD", "BCLK / WS / SD", "BCLK / WS / SD", "BCLK / WS / SD"),
    t("串行接收器", "Serial receiver", "シリアル受信器", "직렬 수신기"),
    t("恢复 PCM", "Recovered PCM", "PCMの復元", "PCM 복원")
  ];
  return <>
    <section className="sound-topic-section">
      <h2>{t("先问：样本要送到哪里？", "First: where do the samples go?", "まず、サンプルをどこへ送るのか", "먼저, 샘플을 어디로 보내는가?")}</h2>
      <p>{t("数字音频基础解决的是如何得到 PCM；这一节解决如何把样本可靠地交给另一颗芯片或另一台设备。板内连接先看 I2S / TDM / PDM，设备间连接再看 SPDIF / USB Audio。接口不负责降噪，也不等于压缩编码。", "Digital Audio Basics explains PCM conversion; this chapter explains how samples reach another chip or device. Start with I2S/TDM/PDM on a board, and SPDIF/USB Audio between devices. Transport is neither noise reduction nor compression.", "デジタル音声の基礎はPCMへの変換、ここでは別のチップや機器へ確実に届ける方法を扱います。基板内はI2S/TDM/PDM、機器間はSPDIF/USB Audioから考えます。伝送はノイズ除去や圧縮ではありません。", "디지털 오디오 기초가 PCM 변환을 다룬다면 여기서는 다른 칩이나 기기로 전달하는 방법을 다룹니다. 보드 내부는 I2S/TDM/PDM, 기기 사이는 SPDIF/USB Audio부터 검토합니다. 전송은 잡음 제거나 압축이 아닙니다.")}</p>
      <div className="interface-reading-table-wrap" role="region" tabIndex={0} aria-label={t("接口对比表，可横向滚动", "Interface comparison, horizontally scrollable", "横スクロール可能な接続比較", "가로 스크롤 가능한 인터페이스 비교")}>
        <table className="microphone-reading-table interface-reading-table">
          <caption>{t("五种接口，先按连接对象区分", "Five interfaces by connection type", "接続対象で分ける五つのインターフェース", "연결 대상별 인터페이스 5종")}</caption>
          <thead><tr>{[t("接口", "Interface", "接続", "인터페이스"), t("信号 / 介质", "Signals / medium", "信号 / 媒体", "신호 / 매체"), t("用途与接线", "Use and wiring", "用途と配線", "용도와 배선"), t("最需要区分的事", "Key distinction", "重要な違い", "핵심 차이")].map(h => <th key={h} scope="col">{h}</th>)}</tr></thead>
          <tbody>{protocols.map(([name, signals, use, distinction]) => <tr key={name}><th scope="row"><h3>{name}</h3></th><td>{signals}</td><td>{use}</td><td>{distinction}</td></tr>)}</tbody>
        </table>
      </div>
      <p className="sound-topic-note">{t("这里的线数只计算信号线，不含电源、地和配置总线；全双工 I2S 通常另加一根反向 SD。PCM 是样本表示，手册中的“PCM 接口”则要另查帧格式，不能默认等于 I2S。", "Line counts exclude power, ground and control buses. Full-duplex I2S normally adds a return SD. PCM is a sample representation; a datasheet's “PCM interface” needs its own frame-format check and is not automatically I2S.", "線数は電源・GND・制御線を除きます。全二重I2Sは通常逆方向SDを追加。PCMはサンプル表現であり、仕様書のPCM接続のフレーム形式は別途確認します。", "신호선 수에는 전원, 접지, 제어 버스가 포함되지 않습니다. 전이중 I2S는 보통 역방향 SD를 추가합니다. PCM은 샘플 표현이며 데이터시트의 PCM 인터페이스는 프레임 형식을 별도로 확인해야 합니다.")}</p>
    </section>

    <section className="sound-topic-section hardware-topic-lab-entry">
      <div className="sound-topic-cta">
        <Cable size={22} aria-hidden="true" />
        <h2>{t("把接口配置与时序对应起来", "Connect interface settings to timing", "接続設定とタイミングを結び付ける", "인터페이스 설정과 타이밍 연결하기")}</h2>
        <p>{t("观察一条数据线如何承载一帧，以及比特、声道与时钟的相对位置。", "Observe how one data line carries a frame and how bits, channels and clocks align.", "1本のデータ線がフレームを運ぶ仕組みと、ビット・チャンネル・クロックの位置関係を観察します。", "데이터선 하나가 프레임을 전달하는 방식과 비트, 채널, 클록의 위치 관계를 살펴봅니다.")}</p>
        <button className="diagram-open-button" type="button" onClick={onOpenLab}>{lab.buttonLabel[language]}</button>
      </div>
    </section>

    <section className="sound-topic-section">
      <h2>{t("沿一条 I2S 播放链路理解三类信号", "Follow three signal roles along I2S playback", "I2S再生経路で三種類の信号を理解する", "I2S 재생 경로에서 세 가지 신호 역할 이해하기")}</h2>
      <p>{t("以 SoC 向 DAC 发送 PCM 为例：SD 搬运比特，BCLK 规定每一位的节奏，WS/LRCLK 标记左右 slot。一帧包含左右各一个 slot，LRCLK 的完整周期对应一个采样周期。标准 I2S 在 WS 切换一个 BCLK 后发送新声道的 MSB；这与左对齐格式不同。", "For SoC-to-DAC PCM, SD carries bits, BCLK paces them, and WS/LRCLK selects left/right slots. One frame contains both slots; a full LRCLK cycle is one sample period. Standard I2S starts the new channel's MSB one BCLK after WS changes, unlike left-justified format.", "SoCからDACへPCMを送る例では、SDがビット、BCLKがビット周期、WS/LRCLKが左右スロットを示します。左右で1フレーム、LRCLKの1周期が標本周期です。標準I2SはWS変化の1BCLK後にMSBを送り、左詰め形式とは異なります。", "SoC에서 DAC로 PCM을 보낼 때 SD는 비트, BCLK는 비트 간격, WS/LRCLK는 좌우 슬롯을 나타냅니다. 좌우 슬롯이 한 프레임이며 LRCLK 한 주기가 샘플 주기입니다. 표준 I2S는 WS 변경 1 BCLK 후에 MSB를 보내며 좌측 정렬 형식과 다릅니다.")}</p>
      <ol className="sound-topic-flow interface-reading-flow" aria-label={t("I2S 数据传输流程", "I2S sample transport", "I2Sサンプル転送", "I2S 샘플 전송")}>{flow.map((step, i) => <li key={step}><span>{String(i + 1).padStart(2, "0")}</span><strong>{step}</strong></li>)}</ol>
      <p className="sound-topic-note">{t("谁发送数据，不等于谁提供时钟。这个例子可由 SoC 提供 BCLK/WS，也可由 DAC 提供，取决于双方能力；同一组共享时钟线上只能有一个有效驱动源。MCLK 是部分器件需要的系统参考时钟，不是 I2S 三线定义的必选信号。", "Data direction does not determine the clock provider. Either SoC or DAC may supply BCLK/WS if supported; shared clock lines need a single active driver. Some devices need MCLK as a system reference, but it is not mandatory in the three-wire I2S definition.", "データの方向とクロック供給元は別です。対応機器ならSoCまたはDACがBCLK/WSを供給し、共有線の駆動元は一つにします。MCLKは一部機器の基準クロックで、I2Sの必須3線には含まれません。", "데이터 방향과 클록 공급자는 별개입니다. 지원 여부에 따라 SoC나 DAC가 BCLK/WS를 공급하며 공유 클록선의 활성 구동원은 하나여야 합니다. MCLK는 일부 기기의 기준 클록이지 I2S 3선 정의의 필수 신호는 아닙니다.")}</p>
    </section>

    <section className="sound-topic-section">
      <h2>{t("算带宽时，用 slot 宽度而非只看位深", "Calculate bandwidth from slot width, not just bit depth", "帯域はビット深度だけでなくスロット幅で計算", "대역폭은 비트 깊이보다 슬롯 폭으로 계산하기")}</h2>
      <p>{t("例：48 kHz、24-bit、双声道 PCM，每个声道放进 32-bit slot。有效数据码率和总线时钟不是同一个数。", "Example: 48 kHz, 24-bit stereo PCM in 32-bit slots. Payload bitrate and bus clock are different quantities.", "例：48 kHz・24-bit・ステレオPCMを32-bitスロットに格納。データ量とバスクロックは別です。", "예: 48 kHz, 24-bit 스테레오 PCM을 32-bit 슬롯에 담으면 유효 데이터율과 버스 클록은 다릅니다.")}</p>
      <div className="digital-topic-equation-grid">
        <article className="digital-topic-equation-card"><span>{t("PCM 有效数据", "PCM payload", "PCM有効データ", "PCM 유효 데이터")}</span><code>48,000 × 24 × 2 = 2.304 Mbit/s</code><p>{t("每秒需要表达的样本比特，不含补齐位。", "Sample bits per second, excluding padding.", "パディングを除く毎秒のサンプルビット。", "패딩을 제외한 초당 샘플 비트 수입니다.")}</p></article>
        <article className="digital-topic-equation-card"><span>BCLK = fₛ × slots × slot_bits</span><code>48,000 × 2 × 32 = 3.072 MHz</code><p>{t("总线仍为每个 slot 发送 32 个时钟，即使只有 24 位有效。", "The bus clocks 32 bits per slot even when only 24 are valid.", "有効24ビットでも各スロットに32クロック必要です。", "유효 비트가 24개여도 슬롯마다 클록 32개가 필요합니다.")}</p></article>
      </div>
      <p>{t("8 声道不必等于 8 倍的这条 I2S 时钟：四条并行 SD 各传左右两路，BCLK 仍可为 3.072 MHz；一条 SD 上用 8 个 32-bit TDM slot，则需 12.288 MHz。MCLK 若选 256fₛ 也恰为 12.288 MHz，但用途不同，倍率必须看器件手册。", "Eight channels need not multiply this I2S clock by eight: four parallel SD lines can each carry a stereo pair at 3.072 MHz BCLK. One SD with eight 32-bit TDM slots needs 12.288 MHz. A 256fₛ MCLK is also 12.288 MHz here, but serves a different purpose; its ratio is device-specific.", "8チャンネルでもI2SのBCLKを8倍にはしません。4本の並列SDなら各ステレオを3.072 MHzで送れます。1本のSDに8個の32-bit TDMスロットを置くと12.288 MHzが必要です。256fₛのMCLKも同じ数値ですが役割は別で、倍率は仕様書によります。", "8채널이라고 이 I2S 클록의 8배가 필요한 것은 아닙니다. 병렬 SD 4개는 각각 스테레오를 BCLK 3.072 MHz로 전송할 수 있습니다. SD 하나에 32-bit TDM 슬롯 8개를 넣으면 12.288 MHz입니다. 256fₛ MCLK도 같은 값이지만 역할이 다르며 배율은 기기 사양에 따릅니다.")}</p>
    </section>

    <section className="sound-topic-section">
      <h2>{t("接线之后，按什么顺序检查？", "What should you check after wiring?", "配線後は何から確認するか", "배선 후 어떤 순서로 점검할까?")}</h2>
      <ol className="interface-reading-checklist">
        <li>{t("先核对电气条件：供电、共地、逻辑电平、引脚复用与走线。I2S 通常用于板内，不能把跳线长度无限延长。", "Check power, common ground, logic levels, pin multiplexing and routing. I2S is normally on-board, not an arbitrarily long cable link.", "電源、共通GND、論理電圧、ピン設定、配線を確認。I2Sは通常基板内用で、無制限に延長できません。", "전원, 공통 접지, 논리 전압, 핀 기능, 배선을 확인합니다. I2S는 보통 보드 내부용이며 무제한 연장할 수 없습니다.")}</li>
        <li>{t("再测时钟：先确认唯一供钟端，再核对 LRCLK / FS、BCLK 和所需 MCLK。FS 的极性、脉宽及相对数据的偏移必须匹配，不能只看有没有上升沿。", "Measure clocks: identify the sole provider, then check LRCLK/FS, BCLK and required MCLK. Match FS polarity, pulse width and data offset, not just the presence of a rising edge.", "供給元を一つにしてLRCLK/FS、BCLK、必要なMCLKを測ります。FSは立ち上がりだけでなく極性・幅・データとの位置を合わせます。", "유일한 클록 공급자를 정하고 LRCLK/FS, BCLK, 필요한 MCLK를 측정합니다. FS는 상승 에지뿐 아니라 극성, 폭, 데이터 오프셋도 맞춰야 합니다.")}</li>
        <li>{t("再核对数据：有效位数、slot 宽度、I2S / 左对齐格式、采样边沿及通道映射。位移一位可能改变幅度或符号；slot 映射错则可能串声道。", "Check valid bits, slot width, I2S versus left-justified format, sampling edge and channel mapping. A one-bit shift can change level or sign; a wrong slot map can swap channels.", "有効ビット数、スロット幅、I2S/左詰め、サンプリングエッジ、チャンネル割当を確認。1ビットずれると振幅や符号が変わり、割当違いではチャンネルが入れ替わります。", "유효 비트 수, 슬롯 폭, I2S/좌측 정렬 형식, 샘플링 에지, 채널 매핑을 확인합니다. 한 비트 이동은 레벨이나 부호를 바꾸고 슬롯 오류는 채널을 뒤바꿀 수 있습니다.")}</li>
        <li>{t("最后检查控制与软件：I²C / SPI 配置增益、路由和静音，不搬运这条 I2S 音频流。时序正确仍断音时，再去 ALSA / 实时处理章节排查 DMA、buffer 和 XRUN。", "Finally check control and software. I²C/SPI configure gain, routing and mute, not this I2S audio stream. If timing is correct but audio drops, investigate DMA, buffers and XRUN in ALSA and real-time processing.", "最後に制御とソフトを確認。I²C/SPIはゲイン・経路・ミュートを設定し、I2S音声自体は運びません。タイミングが正しくても途切れる場合はALSAとリアルタイム処理でDMA・バッファー・XRUNを調べます。", "마지막으로 제어와 소프트웨어를 확인합니다. I²C/SPI는 이득, 라우팅, 음소거를 설정하며 I2S 오디오 자체를 전송하지 않습니다. 타이밍이 맞아도 끊기면 ALSA와 실시간 처리에서 DMA, 버퍼, XRUN을 점검합니다.")}</li>
      </ol>
      <p className="sound-topic-note">{t("PDM 要检查麦克风时钟范围和抽取比；SPDIF 要看接收器是否锁定及码流兼容性；USB Audio 要看枚举、格式协商、包传输和时钟同步，不能直接套用 BCLK 公式。", "For PDM check mic clock range and decimation. For SPDIF check receiver lock and payload support. For USB Audio check enumeration, format negotiation, packets and clock synchronization, not the BCLK formula.", "PDMはクロック範囲と間引き率、SPDIFは受信ロックとデータ対応、USB Audioは認識・形式交渉・パケット・クロック同期を確認し、BCLK式を流用しません。", "PDM은 클록 범위와 데시메이션, SPDIF는 수신 잠금과 스트림 호환성, USB Audio는 열거, 형식 협상, 패킷, 클록 동기를 확인하며 BCLK 공식을 그대로 적용하지 않습니다.")}</p>
    </section>
    <section className="sound-topic-section">
      <h2>{t("规范与继续阅读", "Specifications and further reading", "仕様と参考資料", "사양과 추가 자료")}</h2>
      <ul>
        <li><a href="https://www.nxp.com/docs/en/user-manual/UM11732.pdf" target="_blank" rel="noreferrer">NXP · I2S bus specification</a></li>
        <li><a href="https://invensense.tdk.com/wp-content/uploads/2016/05/AN-000111-PDM-Decimation-v1.0.pdf" target="_blank" rel="noreferrer">TDK · Selecting PDM Microphone Clock Frequencies</a></li>
        <li><a href="https://www.xmos.com/documentation/XM-008854-UG/html/doc/rst/sw_usb_audio.html" target="_blank" rel="noreferrer">XMOS · USB Audio reference designs</a></li>
      </ul>
    </section>
  </>;
}
