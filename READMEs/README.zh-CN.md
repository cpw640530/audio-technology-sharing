<h1 align="center">音频技术分享</h1>
<p align="center">顺着信号学原理，动手调参数，看懂结果为什么变化。</p>

<p align="center">
  <a href="../README.md">English</a> ·
  <a href="./README.zh-CN.md">简体中文</a> ·
  <a href="./README.zh-TW.md">繁體中文</a> ·
  <a href="./README.ja.md">日本語</a> ·
  <a href="./README.ko.md">한국어</a>
</p>

<p align="center">
  <img alt="React 与 Vite" src="https://img.shields.io/badge/app-React%20%2B%20Vite-1f9d8a">
  <img alt="5 种语言" src="https://img.shields.io/badge/languages-5-blue">
  <img alt="持续开发中" src="https://img.shields.io/badge/status-active%20development-green">
</p>

## 在线体验

**[访问网站](https://cpw640530.github.io/audio-technology-sharing/)** · **[浏览知识库](https://cpw640530.github.io/audio-technology-sharing/#top)** · **[直接体验声音波形实验室](https://cpw640530.github.io/audio-technology-sharing/#/labs/sound-wave)**

音频技术分享是面向学生、工程师和音频爱好者的可视化知识库。它通过图解文章与交互实验，把声音、硬件、软件、DSP、AI 和应用场景串成学习路径，而不只是罗列术语。

目前包含 **6 个知识分类、27 篇主题文章、22 个独立实验室**，支持简体中文、繁体中文、英文、日语和韩语。部分主题通过文章内的图解与演示讲解，不另设实验室。

<p align="center"><img alt="当前知识库：首页大纲、学习路线、搜索与旋转主题卡片" src="../public/images/audio_technology_sharing.png" width="1000"></p>

本页截图统一采集自 **2026 年 11 月 12 日的生产构建**，使用英文界面与减少动态效果设置；网页可切换上述五种语言。截图反映本地构建，不代表已核验线上最新部署。

## 交互式实验室：让原理变成看得见的变化

位深增加，量化误差为什么会变小？窗口变长，频谱图为什么不同？回声消除到底减掉了什么？通过调整条件、对照结果理解这些问题，而不只是记住定义。

| 实验室 | 可以动手做什么 | 重点看懂什么 |
| --- | --- | --- |
| [声音波形](https://cpw640530.github.io/audio-technology-sharing/#/labs/sound-wave) | 调节频率、振幅、相位，并播放信号 | 区分周期、幅度和相位的作用 |
| [波形与频谱](https://cpw640530.github.io/audio-technology-sharing/#/labs/wave-spectrum) | 调节谐波分量和相对相位 | 将时域叠加与理想幅度线谱联系起来 |
| [数字音频](https://cpw640530.github.io/audio-technology-sharing/#/labs/sampling-quantization) | 对比采样与量化，查看 PCM 码字和 DAC 重建 | 分清时间采样、幅度精度与重建过程 |
| [FFT / STFT](https://cpw640530.github.io/audio-technology-sharing/#/labs/core-signal-processing) | 比较相邻双音、窗口长度、Hop 大小和短脉冲 | 跟随 PCM 窗口观察频谱，区分频率格间距与分辨相邻频率的能力 |
| [语音增强](https://cpw640530.github.io/audio-technology-sharing/#/labs/speech-enhancement) | 切换 AEC、降噪和 AGC，改变处理强度 | 对照各阶段输入输出，追踪前级处理对后级的影响 |

<p align="center"><img alt="声音波形实验室：波形、公式、参数调节与播放控制" src="../public/images/Sound%20Wave%20Lab.png" width="1000"></p>

**用于学习，不替代测量仪器。** 文章与实验室区分真实计算、教学模拟和示意动画，并注明参考来源、维护日期与模型假设。AI 演示**不运行所引用的生产模型，也不复现其基准成绩**。AEC 使用已知合成分量，不是生产级自适应消除器。并非每个实验都有试听；进行听感对比前，请暂停背景音乐。

## 从阅读到实验，再到下一篇

1. **找到主题**：通过左侧知识分类大纲、搜索、分类筛选及旋转卡片浏览内容，小屏幕自动调整布局。
2. **带着问题阅读**：文章说明“先了解什么、本篇解决什么、下一步看什么”，配合章节目录和可拖动的局部关系图串起知识。
3. **动手验证**：有实验室的主题可以进入交互验证，再返回文章。详细内容负责原理，实验室重点呈现控制条件、观察现象和结果解释。
4. **直接分享文章**：文章与实验室都有独立的 hash 地址，例如 [什么是声音](https://cpw640530.github.io/audio-technology-sharing/#/topics/sound-wave)。可以直接打开或刷新，不需要为每篇文章配置服务器目录。

<p align="center"><img alt="什么是声音：先修知识、学习问题、参考依据、章节目录与局部关系图" src="../public/images/topic-detail.png" width="1000"></p>

缓慢起伏的三维波形曲面仅作背景，不拦截操作；减少动态效果时静止显示，WebGL 不可用时在支持的环境中回退到 Canvas 2D 投影曲面。技术笔记作为独立栏目保留，知识库底部还提供参考与延伸阅读网站。

## 再次访问，接着学

- **最近阅读**：保留最近访问的最多 8 个主题，也能回到上次进入的实验室。
- **收藏主题**：在文章或实验室收藏、取消收藏，从首页快速找回。
- **恢复实验参数**：已接入的控制项会在校验后恢复，也可以一键恢复当前实验默认参数。不恢复播放、上传音频或临时动画状态。
- **只保存在此浏览器**：不做账号，不上传，不跨设备同步。确认清除本地学习数据后，会删除阅读记录、收藏和实验参数，但保留语言选择。清理浏览器或站点数据也会删除这些记录；存储不可用时界面会提示。

<p align="center"><img alt="通过实际访问和收藏示例主题形成的首页收藏列表，数据只保存在本地浏览器" src="../public/images/reading-memory.png" width="900"></p>

## 知识范围

| 方向 | 主题 |
| --- | --- |
| 音频基础 | 声音、波形与频谱、采样、量化、编码、音频单位、听感与指标 |
| 音频硬件 | 麦克风、数字音频接口、功放与扬声器 |
| 音频软件 | 系统音频架构、ALSA、实时音频处理、音频编解码 |
| 传统算法 | FFT/STFT、滤波、EQ、动态处理、语音增强、空间音频 |
| AI 音频 | 总处理流程、ASR、TTS、音频生成、事件识别、音频增强、神经音频编码 |
| 应用场景 | 蓝牙音频、会议通信、机器人、车载声学、IoT 与内容创作 |

<p align="center"><img alt="知识分类筛选与旋转主题卡片，左右显示相邻卡片" src="../public/images/Knowledge%20Areas.png" width="1000"></p>

## 本地运行

安装 Node.js 和 npm 后，使用仓库锁文件安装依赖：

```bash
npm ci
npm run dev
```

运行验证与生产构建：

```bash
npm test
npm run build
```

文章与实验室代码按需加载，欢迎页使用响应式 WebP 图片并保留 PNG 回退。具体测量与剩余限制见[加载性能记录](../docs/loading-performance-2026-11-12.md)，不代表所有设备都能达到相同流畅度。

## 内容与维护

| 位置 | 职责 |
| --- | --- |
| `README.md`、`READMEs/` | 五种语言的项目介绍，包含 `README.zh-TW.md` |
| `src/content/knowledge.ts` | 分类、主题元数据与实验室入口 |
| `src/content/topicRoutes.ts` | 文章、实验室地址与路由映射 |
| `src/content/topicLearning.ts` | 先修关系、学习问题与下一篇推荐 |
| `src/content/topicCredibility.ts` | 来源、更新时间、演示性质与模型边界 |
| `src/components/` | 详细文章、图解、实验室与共享阅读界面 |
| `src/hooks/useLabState.tsx` | 带校验的实验参数本地保存 |
| `src/styles.css` | 共享样式与响应式布局 |
| `public/images/` | 插图及本页使用的截图 |

[音频技术分享知识大纲](../docs/audio_technology_knowledge_outline.md)提供内容概览；[本地回访说明](../docs/local-return-visits.md)记录存储、重置和隐私边界。当前实现以主题源码为准。

## 语言

README、网页界面、详细文章和实验室支持**简体中文、繁体中文、英文、日语和韩语**。网页首次访问默认英文，并记住所选语言。标准模型名称、代码、公式及参考图片内的原始文字保持不变。GitHub 通过普通链接切换各语言 README，无需 JavaScript。

繁体中文（`zh-Hant`）使用本地打包的 ICU 字形转换映射，由简体正文生成，不调用在线翻译服务，尚未单独本地化地区术语。维护者更新中文正文后，可在安装 ICU `uconv` 的环境运行 `node scripts/generate-traditional.cjs` 更新映射。

## License

暂未选择开源许可证。
