<p align="center">
  <h1 align="center">音频技术分享</h1>
  <p align="center">
    面向音频技术学习、网页内容规划和交互式实验室的结构化知识库。
  </p>
</p>

<p align="center">
  <a href="../README.md">English</a> ·
  <a href="./README.zh-CN.md">简体中文</a>
</p>

<p align="center">
  <img alt="Docs" src="https://img.shields.io/badge/docs-Markdown-blue">
  <img alt="App" src="https://img.shields.io/badge/app-React%20%2B%20Vite-1f9d8a">
  <img alt="Language" src="https://img.shields.io/badge/language-English%20%7C%20Chinese-brightgreen">
  <img alt="Project Type" src="https://img.shields.io/badge/type-Audio%20Technology%20Sharing-purple">
  <img alt="Status" src="https://img.shields.io/badge/status-planning-orange">
</p>

---

## 项目简介
音频技术分享 是一个内容优先的资料仓库和网页应用，用于把音频技术相关知识整理成可搜索的卡片、图解文章和交互式实验室。

当前网页可用于浏览音频基础、硬件、软件、信号处理、AI 音频算法和真实应用场景。主题卡片可以打开详细解释和对应实验室，方便用图解或交互方式理解关键概念。

## 为什么建立这个仓库

音频技术横跨物理声学、电子硬件、嵌入式系统、操作系统、数字信号处理、机器学习和产品应用。这个仓库把这些主题放在一个结构化位置，方便后续稳定扩展网页内容。

它适合用于：

- 准备音频技术分享网站内容。
- 构建文章大纲和专题页面。
- 规划音频信号链路和算法图解。
- 将传统 DSP 与 AI 音频概念放在同一套知识体系中。
- 为后续音频技术项目建立可复用的内容基础。

## 知识范围

| 方向 | 主题 |
| --- | --- |
| 音频基础 | 声音、声学、采样、位深、音频格式、听感认知 |
| 音频硬件 | 麦克风、ADC、DAC、Codec、功放、扬声器、耳机、嵌入式音频 |
| 音频软件 | 驱动、系统音频架构、音频数据流、编解码、实时音频处理 |
| 传统算法 | FFT、滤波器、EQ、动态处理、降噪、回声消除、波束成形 |
| AI 音频算法 | ASR、TTS、AI 降噪、音源分离、声音克隆、音乐生成 |
| 应用场景 | 消费电子、会议通信、智能汽车、IoT、内容创作、医疗和工业声学 |

## 快速开始

在线访问网页：

- [https://cpw640530.github.io/audio-technology-explained/](https://cpw640530.github.io/audio-technology-explained/)

先从主知识大纲开始阅读：

- [音频技术分享知识大纲](../docs/audio_technology_knowledge_outline.md)

这份大纲是后续内容扩展的源文档。每个章节后续都可以拆成网页栏目、文章系列、图解页面或交互式说明。

本地运行网页应用：

```bash
npm install
npm run dev
```

默认本地访问地址：

```text
http://127.0.0.1:5173/audio-technology-explained/
```

常用命令：

```bash
npm test
npm run build
```

## 内容结构

```text
.
├── README.md
├── READMEs/
│   └── README.zh-CN.md
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

## 网页内容规划

当前大纲后续可演进为这些网页内容模块：

- **入门指南**：采样率、位深、频响曲线、音频格式、蓝牙延迟。
- **硬件拆解**：麦克风、DAC、功放、TWS 音频链路、嵌入式音频系统。
- **算法图解**：FFT、滤波、降噪、回声消除、波束成形。
- **AI 音频系列**：语音识别、语音合成、AI 降噪、声音克隆、音频生成。
- **应用案例**：会议音频系统、智能音箱、车载语音交互、直播音频处理。

## 语言

本仓库提供独立的双语 README：

- [English](../README.md)
- [简体中文](./README.zh-CN.md)

GitHub README 不支持运行 JavaScript，因此语言切换使用普通 Markdown 链接实现。

## License

暂未选择开源许可证。
