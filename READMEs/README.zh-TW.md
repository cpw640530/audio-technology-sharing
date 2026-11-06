<p align="center">
  <h1 align="center">音頻技術分享</h1>
  <p align="center">
    動手調參數，看波形如何變化，再結合多語言工程文章理解聲音背後的原理。
  </p>
</p>

<p align="center">
  <a href="../README.md">English</a> ·
  <a href="./README.zh-CN.md">简体中文</a> ·
  <a href="./README.zh-TW.md">繁體中文</a> ·
  <a href="./README.ja.md">日本語</a> ·
  <a href="./README.ko.md">한국어</a>
</p>

<p align="center">
  <img alt="Docs" src="https://img.shields.io/badge/docs-Markdown-blue">
  <img alt="App" src="https://img.shields.io/badge/app-React%20%2B%20Vite-1f9d8a">
  <img alt="Languages" src="https://img.shields.io/badge/languages-English%20%7C%20Chinese%20%7C%20Japanese%20%7C%20Korean-brightgreen">
  <img alt="Project Type" src="https://img.shields.io/badge/type-Audio%20Technology%20Sharing-purple">
  <img alt="Status" src="https://img.shields.io/badge/status-active%20development-green">
</p>

---

## 項目簡介
音頻技術分享 是一個內容優先的資料倉庫和網頁應用，用於把音頻技術相關知識整理成可搜索的卡片、圖解文章和交互式實驗室。

當前網頁可用於瀏覽音頻基礎、硬件、軟件、信號處理、AI 音頻算法和真實應用場景。主題卡片可以打開詳細解釋和對應實驗室，方便用圖解或交互方式理解關鍵概念。

**[在線訪問網站](https://cpw640530.github.io/audio-technology-sharing/)** · 支持簡體中文、繁體中文、英文、日語和韓語。

## 交互式實驗室：讓原理變成看得見的變化

位深增加，量化誤差為甚麼會變小？窗口變長，頻譜圖為甚麼不同？回聲消除到底減掉了甚麼？通過參數調節與對照實驗理解這些問題，而不只是記住定義。

| 實驗室 | 可以動手做甚麼 | 重點看懂甚麼 |
| --- | --- | --- |
| 聲音波形 | 調節頻率、振幅、相位，並播放信號 | 將正弦模型、波形變化和聽感聯繫起來 |
| 波形與頻譜 | 調節三個諧波分量及相對相位 | 對照逐點疊加與理想幅度線譜，試聽同一組系數，不自動歸一化 |
| 採樣、量化與 PCM | 比較疏密採樣、2-bit/8-bit 量化，查看樣本碼字 | 區分時間採樣與幅度精度，追蹤量化值如何變成二進制 |
| FFT / STFT | 對比單音與相鄰雙音、長短窗口、Hop 大小和短脈衝 | 跟隨選中 PCM 窗口觀察頻譜，區分頻率格間距與分開相鄰頻率的能力 |
| AEC 回聲消除 | 用 0%、50%、100% 模型強度對比四軌信號 | 串起播放參考、採集輸入、估計回聲與輸出，理解為甚麼不能直接用採集減播放 |

**體驗路徑：**[進入知識庫](https://cpw640530.github.io/audio-technology-sharing/#top) → 打開主題詳細內容 → 進入對應實驗室。遇到不懂的概念，可隨時返回文章。硬件、ALSA、空間音頻及應用場景也提供圖解或交互探索。

<p align="center">
  <img alt="聲音波形實驗室：調節信號參數，結合波形與播放理解聲音" src="../public/images/Sound%20Wave%20Lab.png" width="900">
</p>

**用於學習，不替代測量儀器。** 實驗室區分概念示意、數值仿真和音頻演示，並非每個實驗都有試聽。AEC 使用已知合成分量，不是生產級自適應消除器；滿強度殘餘只是模型設定，不代表真實設備性能上限。進行聽感對比前，請暫停背景音樂。

截圖展示的是較早界面；近期新增的對照預設需部署後才會出現在在線網站。

## 界面與閱讀路徑

- **找到主題**：通過左側知識分類大綱定位，或在主內容區搜索、篩選主題卡片；小屏幕採用單列佈局。
- **閱讀詳細內容**：進入主題文章，結合本頁目錄、流程圖和工程說明理解知識點，並通過相鄰主題入口繼續閱讀。
- **進入實驗室**：從文章進入對應實驗室，通過交互參數或分步圖解驗證概念；可返回詳細內容或知識庫。
- **繼續拓展**：獨立的技術筆記欄目用於工作相關學習記錄；首頁底部提供參考與延伸閱讀網站。
- **切換語言**：首次訪問默認英文，網站會記住語言選擇。緩慢起伏的三維波形曲面僅作為背景，不攔截操作；減少動態效果時靜止顯示，無法使用 WebGL 時保留頁面底色。

以下截圖採集於 2026 年 10 月 28 日的生產構建，截取時暫停背景動畫以便閱讀。本地修改需部署後才會出現在在線網站。

<p align="center">
  <img alt="音頻技術分享首頁示例" src="../public/images/audio_technology_sharing.png" width="900">
</p>

## 詳細文章

主題文章串聯基本概念、工程邊界與實踐驗證。左側本頁目錄用於定位章節，實驗室入口將閱讀自然銜接到交互驗證。

<p align="center">
  <img alt="甚麼是聲音詳細文章：章節目錄與實驗室入口" src="../public/images/topic-detail.png" width="900">
</p>

## 為甚麼建立這個倉庫

音頻技術橫跨物理聲學、電子硬件、嵌入式系統、操作系統、數字信號處理、機器學習和產品應用。這個倉庫把這些主題放在一個結構化位置，方便後續穩定擴展網頁內容。

它適合用於：

- 準備音頻技術分享網站內容。
- 構建文章大綱和專題頁面。
- 規劃音頻信號鏈路和算法圖解。
- 將傳統 DSP 與 AI 音頻概念放在同一套知識體系中。
- 為後續音頻技術項目建立可復用的內容基礎。

## 知識範圍

<p align="center">
  <img alt="知識分類大綱示例" src="../public/images/Knowledge%20Areas.png" width="900">
</p>

| 方向 | 主題 |
| --- | --- |
| 音頻基礎 | 聲音、音頻單位、採樣、量化、編碼、聽感與指標、讀懂波形與頻譜 |
| 音頻硬件 | 麥克風、數字音頻接口、功放與揚聲器 |
| 音頻軟件 | 系統音頻架構、ALSA、實時音頻處理、音頻編解碼 |
| 傳統算法 | 基礎信號處理（FFT/STFT、濾波、EQ、動態處理）、語音增強、空間音頻 |
| AI 音頻 | 總處理流程、ASR、TTS、音頻生成、事件識別、音頻增強、神經音頻編碼 |
| 應用場景 | 藍牙音頻、會議通信、機器人、車載聲學、IoT 與內容創作 |

## 快速開始

在線訪問網頁：

- [https://cpw640530.github.io/audio-technology-sharing/](https://cpw640530.github.io/audio-technology-sharing/)

先從主知識大綱開始閱讀：

- [音頻技術分享知識大綱](../docs/audio_technology_knowledge_outline.md)

大綱提供內容概覽。當前主題元數據位於 `src/content/knowledge.ts`，詳細文章與實驗室在 `src/components/` 中實現。

本地運行網頁應用：

```bash
npm install
npm run dev
```

常用命令：

```bash
npm test
npm run build
```

## 內容結構

```text
.
├── README.md
├── READMEs/
│   ├── README.zh-CN.md
│   ├── README.ja.md
│   └── README.ko.md
├── index.html
├── package.json
├── src/
│   ├── App.tsx
│   ├── components/
│   ├── content/
│   └── styles.css
└── docs/
    └── audio_technology_knowledge_outline.md
```

## 學習示例

文章與實驗室將基礎概念連接到具體問題：

- **入門指南**：採樣率、位深、頻響曲線、音頻格式、藍牙延遲。
- **硬件原理**：麥克風、ADC/DAC 轉換、數字接口、功放與揚聲器。
- **算法圖解**：FFT、濾波、降噪、回聲消除、波束成形。
- **AI 音頻系列**：語音識別、語音合成、AI 降噪、聲音克隆、音頻生成。
- **應用案例**：會議音頻系統、智能音箱、車載語音交互、直播音頻處理。

## 語言

README、網頁界面、詳細文章和實驗室支持簡體中文、繁體中文、英文、日語和韓語。使用網頁的語言選擇框即可原地切換，網站會記住選擇。標準模型名稱、代碼、公式及參考圖片內的原始文字保持不變。

網頁另提供「繁體中文」（`zh-Hant`），使用 ICU 將簡體正文轉換為通用繁體字形，尚未單獨本地化地區術語。轉換表隨網站打包，不調用在線翻譯服務。維護者更新中文正文後，可在安裝 ICU `uconv` 的環境運行 `node scripts/generate-traditional.cjs` 更新詞組映射。

- [English](../README.md)
- [简体中文](./README.zh-CN.md)
- [繁體中文](./README.zh-TW.md)
- [日本語](./README.ja.md)
- [한국어](./README.ko.md)

GitHub README 不支持運行 JavaScript，因此語言切換使用普通 Markdown 鏈接實現。

## License

暫未選擇開源許可證。
