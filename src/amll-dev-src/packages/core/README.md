# AMLL Core

> 警告：此为个人项目，且尚未完成开发，可能仍有大量问题，所以请勿直接用于生产环境！

![AMLL-Core](https://img.shields.io/badge/Core-%233178c6?label=Apple%20Music-like%20Lyrics&labelColor=%23FB5C74)
[![npm](https://img.shields.io/npm/dt/%40applemusic-like-lyrics/core)](https://www.npmjs.com/package/@applemusic-like-lyrics/core)
[![npm](https://img.shields.io/npm/v/%40applemusic-like-lyrics%2Fcore)](https://www.npmjs.com/package/@applemusic-like-lyrics/core)

AMLL 的纯 JS 核心组件框架，包括歌词显示组件和背景组件等其它可以复用的组件。

此处的东西都是 UI 框架无关的，所以可以间接在各种动态页面框架下引用。

或者如果你需要使用组件绑定的话，这里有 [React 绑定版本](../react/README.md) 和 [Vue 绑定版本](../vue/README.md)

## 安装

安装使用的依赖（如果以下列出的依赖包没有安装的话需要自行安装）：
```bash
npm install @pixi/app @pixi/core @pixi/display @pixi/filter-blur @pixi/filter-bulge-pinch @pixi/filter-color-matrix @pixi/sprite jss jss-preset-default # 使用 npm
yarn add @pixi/app @pixi/core @pixi/display @pixi/filter-blur @pixi/filter-bulge-pinch @pixi/filter-color-matrix @pixi/sprite jss jss-preset-default # 使用 yarn
```

安装本体框架：
```bash
npm install @applemusic-like-lyrics/core # 使用 npm
yarn add @applemusic-like-lyrics/core # 使用 yarn
```

## 使用方式摘要

详细的 API 文档请参考 [./docs/modules.md](./docs/modules.md)

一个测试用途的程序可以在 [./src/test.ts](./src/test.ts) 里找到。

```typescript
import { LyricPlayer } from "@applemusic-like-lyrics/core";

const player = new LyricPlayer(); // 创建歌词播放组件
document.body.appendChild(player.getElement()); // 将组件的元素添加到页面
player.setLyricLines([]) // 设置歌词
player.setCurrentTime(0) // 设定当前播放时间（需要逐帧调用）
player.update(0) // 更新歌词组件动画（需要逐帧调用）
```

每次通过 `LyricPlayer.setLyricLines` 设置的歌词是一个 `LyricLine[]` 参数，具体可以参考 [./src/interfaces.ts](./src/interfaces.ts) 中的代码。
