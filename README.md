# mermaid

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## 技术栈

- Vue 3 + Composition API
- Vite 6
- monaco-editor（代码编辑器）
- mermaid（图表渲染）
- Cloudflare Workers（可选部署）
- Playwright（自动化测试/布局验证）

## 主要功能

- 支持 Mermaid 语法的可视化编辑与实时预览
- 编辑区与预览区分屏拖拽，宽度可调，刷新自动恢复
- 代码编辑器支持高亮、占位符、复制、清空等
- 预览区支持 SVG 智能缩放、滚动、复制、下载
- 右下角 Info 弹窗，支持结构化说明内容
- 顶部右上角 GitHub 外链角标
- 新窗口预览支持与主页面代码同步
- 响应式布局，极简 URL，无多余参数

## 使用说明

1. 安装依赖

```sh
npm install
```

2. 启动开发环境

```sh
npm run dev
```

3. 生产构建

```sh
npm run build
```

4. 主要界面说明

- 首页即为编辑+预览一体化页面
- 左侧为 Monaco 编辑器，右侧为 Mermaid 图表预览
- 工具栏支持新窗口预览、复制、清空等操作
- 右下角 Info 可查看项目说明
- 右上角 GitHub 图标跳转至源码仓库

如需自定义、扩展或反馈建议，请访问仓库 Issues。
