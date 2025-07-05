# 京东微前端集成指南

本文档说明如何将Mermaid编辑器作为微应用集成到京东微前端框架中。

## 🚀 快速开始

### 独立运行模式（默认）
```bash
# 开发
npm run dev

# 构建
npm run build

# 部署
npm run deploy
```

### 微前端模式
```bash
# 开发
npm run dev:micro

# 构建
npm run build:micro

# 部署
npm run deploy:micro
```

## 🔧 配置说明

### 环境变量
- `MICRO_APP_MODE=true` - 启用微前端模式
- 微前端模式下会自动使用 `/mermaid` 作为路由前缀

### 路由配置
- **独立模式**: `/` 和 `/preview`
- **微前端模式**: `/mermaid/` 和 `/mermaid/preview`

## 🔍 自动检测机制

应用会自动检测是否在微前端环境中运行，检测条件包括：

1. **全局变量检测**:
   - `window.__MICRO_APP_ENVIRONMENT__`
   - `window.__MICRO_APP_NAME__`
   - `window.microApp`
   - `window.__JINGDONG_MICRO_APP__`

2. **DOM元素检测**:
   - `micro-app` 标签
   - `[data-micro-app]` 属性
   - `.jd-micro-app-container` 类名

3. **环境检测**:
   - 是否在iframe中运行
   - URL路径是否包含 `/mermaid` 前缀
   - 构建时环境变量

## 📡 微前端通信

### 向父应用发送消息

```javascript
// 应用就绪
window.parent.postMessage({
  type: 'MICRO_APP_READY',
  name: 'mermaid',
  timestamp: Date.now()
}, '*')

// 错误报告
window.parent.postMessage({
  type: 'MICRO_APP_ERROR',
  name: 'mermaid',
  error: 'error message',
  timestamp: Date.now()
}, '*')
```

### 接收父应用消息

```javascript
window.addEventListener('message', (event) => {
  if (event.data.type === 'PARENT_TO_MERMAID') {
    // 处理来自父应用的消息
    console.log('收到父应用消息:', event.data)
  }
})
```

## 🔄 生命周期

微应用支持完整的生命周期管理：

1. **beforeMount** - 挂载前
2. **mounted** - 挂载完成
3. **beforeUnmount** - 卸载前
4. **unmounted** - 卸载完成

## 🌐 服务器端支持

Cloudflare Workers会自动处理带有 `/mermaid` 前缀的请求：

```javascript
// 自动路由重写
/mermaid/ -> /
/mermaid/preview -> /preview
/mermaid/api/xxx -> /api/xxx
```

## 📱 京东App集成

### 在京东App中嵌入

```javascript
// 京东App微前端配置示例
{
  name: 'mermaid-editor',
  url: 'https://your-domain.com/mermaid/',
  container: '#micro-app-container',
  props: {
    // 传递给微应用的属性
  }
}
```

### 检测京东App环境

```javascript
import { isInJingdongMicroApp } from './config/microapp.js'

if (isInJingdongMicroApp()) {
  console.log('运行在京东微前端环境中')
}
```

## 🛠️ 开发调试

### 本地开发微前端模式

```bash
# 启动微前端开发模式
npm run dev:micro

# 访问地址
http://localhost:5173/mermaid/
```

### 调试信息

开启微前端模式后，控制台会显示详细的调试信息：

- 环境检测结果
- 路由跳转日志
- 生命周期事件
- 通信消息

## 🔒 安全考虑

1. **CORS配置**: 已自动配置跨域支持
2. **消息验证**: 建议验证postMessage的来源
3. **路径安全**: 服务器端会验证路径重写的安全性

## 📋 部署清单

部署微前端版本前请确认：

- [ ] 使用 `npm run build:micro` 构建
- [ ] 确认路由前缀配置正确
- [ ] 测试在iframe中的运行情况
- [ ] 验证与父应用的通信
- [ ] 检查CORS配置

## 🐛 常见问题

### Q: 路由不工作？
A: 确保使用了正确的构建命令 `npm run build:micro`

### Q: 样式丢失？
A: 检查CSS资源路径是否正确，确认base路径配置

### Q: 无法与父应用通信？
A: 检查postMessage的target origin配置

### Q: 检测不到微前端环境？
A: 查看控制台的检测日志，确认检测条件是否满足
