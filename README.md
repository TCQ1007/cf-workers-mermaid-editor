# Mermaid 在线编辑器

基于 Vue 3 + Cloudflare Workers 的现代化 Mermaid 图表在线编辑器，支持实时预览、微前端集成和跨域访问。

## 💻 开发环境

**推荐 IDE**：[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

**配置参考**：[Vite Configuration Reference](https://vite.dev/config/)

## ✨ 主要功能

### 🎨 编辑体验
- **实时预览**：支持 Mermaid 语法的可视化编辑与实时预览
- **分屏布局**：编辑区与预览区可拖拽调整宽度，刷新自动恢复
- **代码高亮**：Monaco 编辑器支持语法高亮、占位符、复制、清空等
- **字体调整**：支持 Ctrl + 鼠标滚轮调整编辑器字体大小（8px-32px）

### 🖼️ 预览功能
- **智能缩放**：SVG 图表支持智能缩放、滚动操作
- **导出下载**：支持复制图表内容和下载功能
- **新窗口预览**：独立预览窗口，与主页面代码实时同步

### 🔧 系统特性
- **微前端支持**：智能检测微前端环境，自动适配路由前缀
- **跨域访问**：完整的 CORS 支持，可嵌入任意域名
- **404处理**：友好的404错误页面，支持返回操作
- **响应式设计**：适配移动端和桌面端，极简 URL 设计

## 🚀 快速开始

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发环境
npm run dev

# 生产构建
npm run build
```

### 部署到 Cloudflare Workers

```bash
# 构建并部署
npm run deploy
```

## 📖 使用指南

### 界面说明
- **左侧编辑器**：Monaco 代码编辑器，支持 Mermaid 语法高亮
- **右侧预览**：实时渲染的 Mermaid 图表
- **工具栏**：新窗口预览、复制、清空等操作
- **右下角 Info**：查看项目说明和功能介绍
- **右上角 GitHub**：跳转至源码仓库

### 快捷操作
- **字体调整**：`Ctrl` + 鼠标滚轮（8px-32px，自动保存）
- **复制图表**：点击预览区的复制按钮
- **下载图表**：点击预览区的下载按钮
- **新窗口预览**：点击工具栏的预览按钮

## 🔧 微前端集成

### 自动检测
应用会自动检测微前端环境并适配路由：

```javascript
// 检测条件
window.__MICRO_APP_ENVIRONMENT__
window.__MICRO_APP_NAME__
window.microApp
window.__JINGDONG_MICRO_APP__
```

### 路由适配
- **独立访问**：`https://your-domain.com/`
- **微前端**：`https://your-domain.com/任意前缀/`（自动识别前缀）

### 集成示例
```javascript
// 京东微前端框架集成
{
  name: 'mermaid-editor',
  url: 'https://your-domain.com/mermaid/',
  container: '#micro-app-container'
}
```

## 🏗️ 技术架构

### 前端技术栈
- **Vue 3** + Composition API + `<script setup>`
- **Vite 6** - 现代化构建工具
- **Monaco Editor** - 代码编辑器
- **Mermaid** - 图表渲染引擎

### 后端服务
- **Cloudflare Workers** - 边缘计算平台
- **静态资源托管** - 自动 SPA fallback
- **CORS 支持** - 完整跨域访问支持

### 核心特性
- **极简服务器**：仅 39 行代码的 Workers 服务
- **智能路由**：自动微前端路径重写
- **性能优化**：CDN 加速 + 边缘计算
- **零配置部署**：一键部署到全球边缘节点

## 📁 项目结构

```
├── src/
│   ├── components/          # Vue 组件
│   │   ├── MonacoEditor.vue # 代码编辑器
│   │   └── MermaidRenderer.vue # 图表渲染器
│   ├── views/              # 页面组件
│   │   ├── EditorPreview.vue # 主编辑页面
│   │   ├── PreviewWindow.vue # 预览窗口
│   │   └── NotFound.vue     # 404 页面
│   ├── config/             # 配置文件
│   │   └── microapp.js     # 微前端配置
│   └── router/             # 路由配置
├── server/
│   └── index.js            # Cloudflare Workers 服务
├── docs/
│   └── MICROAPP.md         # 微前端集成文档
└── wrangler.jsonc          # Workers 配置
```

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 开发规范
- 使用 Vue 3 Composition API
- 遵循 ESLint 代码规范
- 提交信息使用约定式提交格式

### 反馈渠道
- 🐛 **Bug 报告**：[GitHub Issues](https://github.com/your-repo/issues)
- 💡 **功能建议**：[GitHub Discussions](https://github.com/your-repo/discussions)
- 📖 **文档改进**：直接提交 PR

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件
