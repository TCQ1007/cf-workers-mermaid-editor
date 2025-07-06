# 📊 Mermaid 图表编辑器

基于 Vue 3 + Cloudflare Workers 的现代化 Mermaid 图表在线编辑器，支持实时预览、智能交互和多格式导出。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Vue](https://img.shields.io/badge/Vue-3.x-green.svg)
![Cloudflare](https://img.shields.io/badge/Cloudflare-Workers-orange.svg)

## 💻 开发环境

**推荐 IDE**：[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

**配置参考**：[Vite Configuration Reference](https://vite.dev/config/)

## ✨ 核心功能

### 🎨 专业编辑体验
- **🔄 实时预览**：左侧编辑，右侧实时渲染，所见即所得的编辑体验
- **🖱️ 智能交互**：右侧预览支持滚轮缩放和中键拖拽，随时查看图表细节
- **⌨️ 编辑器优化**：支持 Ctrl + 鼠标滚轮调整字体大小，Monaco编辑器提供专业代码体验
- **🪟 新窗口预览**：独立预览窗口，支持多屏显示和演示模式

### 📤 多格式导出
- **📋 复制功能**：支持 SVG代码、PNG图片、JPG图片三种格式复制
- **💾 下载功能**：支持 SVG文件、PNG图片、JPG图片三种格式下载
- **🎨 背景处理**：PNG/JPG自动添加白色背景，适合文档使用
- **🔧 高质量输出**：2倍缩放确保图片清晰度，支持自定义质量

### 🎯 用户引导系统
- **🎯 功能引导**：基于Driver.js的交互式引导，7步完整功能介绍
- **🔄 智能启动**：首次访问自动启动，已完成用户可手动重新学习
- **📱 响应式适配**：引导界面完美适配桌面和移动端
- **✨ 现代化设计**：精美的引导界面和流畅的动画效果

### 🚀 现代化架构
- **📱 响应式设计**：完美适配桌面和移动端，随时随地编辑图表
- **🌐 跨域支持**：完整的 CORS 配置，可嵌入任何系统
- **⚡ 高性能**：基于Vue 3 + Cloudflare Workers，加载快速，运行流畅
- **✨ 现代化UI**：简洁美观的界面设计，专注于内容创作体验

## 🚀 快速开始

### 环境要求

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0
- **Cloudflare账户**: 用于Workers部署

### 本地开发

```bash
# 克隆项目
git clone https://github.com/TCQ1007/cf-workers-mermaid-editor.git
cd cf-workers-mermaid-editor

# 安装依赖
npm install

# 启动开发环境
npm run dev

# 访问 http://localhost:5173
```

### 生产部署

```bash
# 构建项目
npm run build

# 部署到 Cloudflare Workers
npm run deploy

# 或使用 wrangler 命令
npx wrangler deploy
```

## 📖 使用指南

### 界面布局
- **📝 左侧编辑器**：Monaco 代码编辑器，支持 Mermaid 语法高亮和智能提示
- **👁️ 右侧预览**：实时渲染的 Mermaid 图表，支持交互操作
- **🛠️ 顶部工具栏**：功能引导、关于项目、GitHub链接
- **🪟 预览控制**：图表预览标题右侧的新窗口预览按钮
- **📤 导出功能**：预览区域的复制和下载功能按钮

### 🎯 功能引导
首次访问时会自动启动功能引导，包含以下步骤：
1. **欢迎介绍** - 项目概述和功能亮点
2. **代码编辑器** - Monaco编辑器功能和快捷键
3. **实时预览** - 预览区域和交互操作
4. **复制功能** - 多格式复制选项说明
5. **下载功能** - 文件下载和格式选择
6. **新窗口预览** - 独立预览窗口功能
7. **关于项目** - 项目信息和GitHub链接

### 交互操作

#### 编辑器操作
- **字体调整**：`Ctrl` + 鼠标滚轮（8px-32px，自动保存）
- **代码编辑**：支持语法高亮、自动补全、代码折叠
- **实时同步**：编辑内容自动保存到本地存储

#### 预览区操作
- **滚轮缩放**：鼠标进入预览区后，滚轮滚动调整图表大小
- **中键拖拽**：按住鼠标中键（滚轮）拖拽移动图表位置
- **双击重置**：双击预览区重置到原始大小和位置

#### 导出功能
- **📋 复制为**：支持 SVG代码、PNG图片、JPG图片
- **💾 下载为**：支持 SVG文件、PNG图片、JPG图片
- **🪟 新窗口预览**：独立预览窗口，支持多屏显示和演示

## 🏗️ 技术架构

### 核心技术栈

#### 前端框架
- **Vue 3.4+** - 使用 Composition API 和 `<script setup>` 语法
- **Vue Router 4** - 单页应用路由管理
- **Vite 6** - 现代化构建工具，支持热更新和快速构建

#### 编辑器组件
- **Monaco Editor** - VS Code 同款编辑器，支持语法高亮和智能提示
- **Mermaid.js** - 图表渲染引擎，支持多种图表类型

#### 部署平台
- **Cloudflare Workers** - 边缘计算平台，全球CDN加速
- **Cloudflare Pages** - 静态资源托管，自动SPA回退

### 关键实现细节

#### 1. 实时预览系统
```javascript
// 监听编辑器内容变化，实时渲染图表
watch(() => props.content, async (newContent) => {
  if (isValidMermaidContent(newContent)) {
    await renderMermaid(newContent)
  }
}, { immediate: true })
```

#### 2. 智能交互功能
```javascript
// 预览区滚轮缩放
const handlePreviewWheel = (event) => {
  event.preventDefault()
  const delta = event.deltaY > 0 ? 0.9 : 1.1
  const newScale = Math.max(0.2, Math.min(5, previewScale.value * delta))
  previewScale.value = newScale
}

// 中键拖拽功能
const handlePreviewMouseDown = (event) => {
  if (event.button !== 1) return // 只处理中键
  // 实现拖拽逻辑...
}
```

#### 3. 用户引导系统
```javascript
// 引导功能管理器
export class TourManager {
  async startTour(force = false) {
    const initialized = await this.initDriver()
    if (!initialized) return false

    this.driver.setSteps(tourSteps)
    this.driver.drive()
    return true
  }
}

// 引导步骤配置
const tourSteps = [
  {
    element: '.editor-container',
    popover: {
      title: '📝 代码编辑器',
      description: '这里是Monaco编辑器...',
      side: 'right'
    }
  }
]
```

#### 4. 多格式导出
```javascript
// SVG转图片功能
const svgToImage = (svgString, format = 'png', scale = 2, withBackground = true) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    // 添加白色背景（PNG/JPG）
    if (withBackground) {
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    // 渲染SVG到Canvas并导出
    // ...
  })
}
```

#### 5. Cloudflare Workers 服务
```javascript
// 极简的Workers服务，支持CORS和静态资源
export default {
  fetch: async (request, env) => {
    // 处理CORS预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders })
    }

    // 静态资源服务
    const response = await env.ASSETS.fetch(request)
    return addCorsHeaders(response)
  }
}
```

### 性能优化

#### 前端优化
- **代码分割**：路由级别的懒加载
- **资源压缩**：Vite自动压缩CSS/JS
- **缓存策略**：本地存储编辑内容和用户设置

#### 部署优化
- **全球CDN**：Cloudflare边缘节点加速
- **HTTP/2**：支持多路复用和服务器推送
- **Gzip压缩**：自动压缩静态资源

## 📁 项目结构

```
mermaid-editor/
├── src/                    # 源代码目录
│   ├── components/         # Vue 组件
│   │   ├── MonacoEditor.vue      # Monaco 代码编辑器组件
│   │   ├── MermaidRenderer.vue   # Mermaid 图表渲染组件
│   │   ├── AboutModal.vue        # 关于项目弹窗组件
│   │   ├── TourButton.vue        # 功能引导按钮组件
│   │   └── GitHubCorner.vue      # GitHub 角标组件
│   ├── views/              # 页面组件
│   │   ├── EditorPreview.vue     # 主编辑页面
│   │   ├── PreviewWindow.vue     # 独立预览窗口
│   │   └── NotFound.vue          # 404 错误页面
│   ├── assets/             # 静态资源
│   │   ├── about.json            # 项目信息配置
│   │   ├── main.css              # 主样式文件
│   │   └── tour-styles.css       # 引导功能样式
│   ├── utils/              # 工具函数
│   │   ├── storage.js            # 本地存储工具
│   │   └── tour.js               # 引导功能管理器
│   ├── router/             # 路由配置
│   │   └── index.js              # Vue Router 配置
│   ├── App.vue             # 根组件
│   └── main.js             # 应用入口
├── server/                 # 服务端代码
│   └── index.js            # Cloudflare Workers 服务
├── docs/                   # 项目文档
│   └── TOUR_GUIDE.md       # 引导功能使用指南
├── tests/                  # 测试文件（可选）
├── public/                 # 公共资源
│   └── favicon.ico         # 网站图标
├── dist/                   # 构建输出目录
├── wrangler.jsonc          # Cloudflare Workers 配置
├── vite.config.js          # Vite 构建配置
└── package.json            # 项目依赖配置
```

## 📦 核心依赖

### 生产依赖
```json
{
  "vue": "^3.4.0",
  "vue-router": "^4.2.0",
  "monaco-editor": "^0.45.0"
}
```

**依赖说明：**
- `vue`: Vue.js 框架
- `vue-router`: Vue 路由管理
- `monaco-editor`: 代码编辑器

### 开发依赖
```json
{
  "@vitejs/plugin-vue": "^5.0.0",
  "@cloudflare/vite-plugin": "^1.0.0",
  "vite": "^6.0.0",
  "wrangler": "^3.0.0"
}
```

**依赖说明：**
- `@vitejs/plugin-vue`: Vue 插件
- `@cloudflare/vite-plugin`: Cloudflare 集成
- `vite`: 构建工具
- `wrangler`: Workers CLI

### 外部依赖（CDN）
- **Mermaid.js**: 通过 CDN 加载，避免打包体积过大
- **Monaco Editor**: 通过 AMD 模块加载，支持按需加载
- **Driver.js**: 引导功能库，通过 CDN 加载，轻量级集成

## 🎯 特色功能

### 🎯 智能引导系统
- **首次访问自动引导**：新用户首次访问时自动启动7步功能介绍
- **手动重新学习**：随时点击引导按钮重新学习所有功能
- **响应式适配**：引导界面完美适配桌面和移动端
- **现代化设计**：基于Driver.js的精美引导界面

### 🪟 多窗口支持
- **独立预览窗口**：点击预览区标题右侧的"🪟 新窗口"按钮
- **实时同步**：预览窗口与主编辑器实时同步内容
- **多屏显示**：支持拖拽到其他显示器进行演示
- **完整交互**：预览窗口支持所有缩放和拖拽操作

### 📤 智能导出
- **三种复制格式**：SVG代码、PNG图片、JPG图片
- **三种下载格式**：SVG文件、PNG图片、JPG图片
- **自动背景处理**：PNG/JPG自动添加白色背景
- **高质量输出**：2倍缩放确保图片清晰度

### 🎨 用户体验优化
- **现代化通知**：替代原生alert的滑入式通知系统
- **智能交互**：滚轮缩放、中键拖拽、双击重置
- **响应式设计**：完美适配各种设备和屏幕尺寸
- **无干扰设计**：移除自动弹窗，用户主动选择查看信息

## 🛠️ 开发指南

### 本地开发环境搭建
```bash
# 1. 克隆项目
git clone https://github.com/TCQ1007/cf-workers-mermaid-editor.git
cd cf-workers-mermaid-editor

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 4. 访问应用
open http://localhost:5173
```

### 构建和部署
```bash
# 本地构建
npm run build

# 预览构建结果
npm run preview

# 部署到 Cloudflare Workers
npm run deploy
```

### 代码规范
- **Vue 3 Composition API**: 使用 `<script setup>` 语法
- **ES6+ 语法**: 支持最新 JavaScript 特性
- **模块化设计**: 组件职责单一，便于维护
- **TypeScript 友好**: 虽未使用 TS，但代码结构支持渐进式迁移

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 贡献流程
1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 开发规范
- **代码风格**: 遵循 Vue.js 官方风格指南
- **提交规范**: 使用约定式提交格式 (Conventional Commits)
- **测试要求**: 确保新功能不破坏现有功能
- **文档更新**: 重要功能需要更新相关文档

### 反馈渠道
- 🐛 **Bug 报告**: [GitHub Issues](https://github.com/TCQ1007/cf-workers-mermaid-editor/issues)
- 💡 **功能建议**: [GitHub Discussions](https://github.com/TCQ1007/cf-workers-mermaid-editor/discussions)
- 📖 **文档改进**: 直接提交 PR
- 💬 **技术交流**: 欢迎在 Issues 中讨论技术实现

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Mermaid](https://mermaid.js.org/) - 强大的图表生成库
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - 优秀的代码编辑器
- [Cloudflare Workers](https://workers.cloudflare.com/) - 边缘计算平台

---

⭐ 如果这个项目对你有帮助，请给个 Star 支持一下！
