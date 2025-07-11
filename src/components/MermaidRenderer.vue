<template>
  <div class="mermaid-renderer">
    <!-- 图表容器 - 始终存在 -->
    <div class="mermaid-container">
      <div
        ref="mermaidContainer"
        class="mermaid-content interactive-preview"
        :style="previewTransformStyle"
        @click="openLightbox"
        @wheel="handlePreviewWheel"
        @mousedown="handlePreviewMouseDown"
        @mouseenter="onPreviewEnter"
        @mouseleave="onPreviewLeave"
      ></div>

      <!-- 加载状态覆盖层 -->
      <div v-if="loading" class="status-overlay loading">
        <div class="spinner"></div>
        <span>正在渲染图表...</span>
      </div>

      <!-- 错误状态覆盖层 -->
      <div v-if="error" class="status-overlay error">
        <div class="error-icon">⚠️</div>
        <div class="error-message">{{ error }}</div>
      </div>

      <!-- 复制状态提示 -->
      <div v-if="copyStatus" class="copy-status">{{ copyStatus }}</div>
    </div>

    <!-- 灯箱预览 -->
    <div v-if="showLightbox" class="lightbox" @click="closeLightbox">
      <div class="lightbox-content" @click.stop>
        <div class="lightbox-header">
          <h3>图表预览</h3>
          <div class="header-controls">
            <button @click="zoomOut" class="zoom-btn">🔍-</button>
            <span class="zoom-level">{{ Math.round(scale * 100) }}%</span>
            <button @click="zoomIn" class="zoom-btn">🔍+</button>
            <button @click="fitToWindow" class="fit-btn">适应窗口</button>
            <button @click="resetZoom" class="reset-btn">重置</button>
            <button @click="closeLightbox" class="close-btn">✕</button>
          </div>
        </div>

        <div class="lightbox-body">
          <div
            class="lightbox-image"
            :style="imageStyle"
            @wheel="handleWheel"
            @mousedown="startDrag"
            v-html="svgContent"
          ></div>

          <!-- 操作提示 -->
          <div class="interaction-hint">
            <span>💡 滚轮缩放 | 中键拖拽</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick, onUnmounted } from 'vue'

const props = defineProps({
  content: {
    type: String,
    required: true
  }
})

// 响应式状态
const mermaidContainer = ref(null)
const loading = ref(false)
const error = ref('')
const svgContent = ref('')

// 灯箱状态
const showLightbox = ref(false)
const scale = ref(1)
const translateX = ref(0)
const translateY = ref(0)
const isDragging = ref(false)

// 预览窗口状态
const previewScale = ref(1)
const previewTranslateX = ref(0)
const previewTranslateY = ref(0)
const isPreviewDragging = ref(false)
const isPreviewHovered = ref(false)

// 计算属性
const imageStyle = computed(() => ({
  transform: `scale(${scale.value}) translate(${translateX.value}px, ${translateY.value}px)`,
  cursor: isDragging.value ? 'grabbing' : 'default',
  willChange: isDragging.value ? 'transform' : 'auto'
}))

// 预览窗口变换样式
const previewTransformStyle = computed(() => ({
  transform: `scale(${previewScale.value}) translate(${previewTranslateX.value}px, ${previewTranslateY.value}px)`,
  cursor: isPreviewDragging.value ? 'grabbing' : 'pointer',
  willChange: isPreviewDragging.value ? 'transform' : 'auto',
  transformOrigin: 'center center'
}))

// Mermaid初始化
const initMermaid = () => {
  if (!window.mermaid) {
    error.value = 'Mermaid 库未加载'
    return
  }

  try {
    window.mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      fontFamily: 'Arial, sans-serif',
      flowchart: { useMaxWidth: true, htmlLabels: true },
      sequence: { useMaxWidth: true },
      gantt: { useMaxWidth: true },
      class: { useMaxWidth: true },
      state: { useMaxWidth: true },
      pie: { useMaxWidth: true }
    })
    console.log('Mermaid initialized successfully')
  } catch (err) {
    console.error('Failed to initialize Mermaid:', err)
    error.value = '无法初始化 Mermaid 渲染器'
  }
}

// 判断内容是否为有效的Mermaid语法
const isValidMermaidContent = (content) => {
  if (!content || !content.trim()) return false

  const trimmed = content.trim()
  const validTypes = [
    'graph', 'flowchart', 'sequenceDiagram', 'classDiagram',
    'stateDiagram', 'erDiagram', 'journey', 'gantt',
    'pie', 'gitgraph', 'mindmap', 'timeline'
  ]

  return validTypes.some(type => trimmed.startsWith(type))
}

// 渲染图表
const renderMermaid = async () => {
  // 清空之前的状态
  loading.value = false
  error.value = ''
  svgContent.value = ''

  // 判断内容有效性
  if (!isValidMermaidContent(props.content)) {
    return
  }

  loading.value = true

  try {
    await nextTick()

    if (!window.mermaid) {
      throw new Error('Mermaid library not loaded')
    }

    if (!mermaidContainer.value) {
      throw new Error('Mermaid container not found')
    }

    // 清空容器
    mermaidContainer.value.innerHTML = ''

    // 生成唯一ID并渲染
    const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const { svg } = await window.mermaid.render(id, props.content)

    mermaidContainer.value.innerHTML = svg
    svgContent.value = svg
  } catch (err) {
    console.error('Mermaid rendering error:', err)
    error.value = err.message || '图表语法错误，请检查语法'
  } finally {
    loading.value = false
  }
}

// 计算SVG的实际尺寸
const getSVGDimensions = () => {
  if (!svgContent.value) return { width: 0, height: 0 }

  const parser = new DOMParser()
  const svgDoc = parser.parseFromString(svgContent.value, 'image/svg+xml')
  const svgElement = svgDoc.querySelector('svg')

  if (!svgElement) return { width: 0, height: 0 }

  // 尝试从viewBox获取尺寸
  const viewBox = svgElement.getAttribute('viewBox')
  if (viewBox) {
    const [, , width, height] = viewBox.split(' ').map(Number)
    return { width, height }
  }

  // 尝试从width/height属性获取
  const width = parseFloat(svgElement.getAttribute('width')) || 800
  const height = parseFloat(svgElement.getAttribute('height')) || 600

  return { width, height }
}

// 计算适合窗口的缩放比例
const calculateFitScale = () => {
  const { width: svgWidth, height: svgHeight } = getSVGDimensions()
  if (svgWidth === 0 || svgHeight === 0) return 1

  // 获取弹窗内容区域的实际尺寸
  const lightboxContent = document.querySelector('.lightbox-content')
  if (!lightboxContent) return 1

  const contentRect = lightboxContent.getBoundingClientRect()

  // 计算可用的显示区域（减去标题栏和padding）
  const headerHeight = 50 // 标题栏高度
  const padding = 40 // 内边距

  const availableWidth = contentRect.width - padding
  const availableHeight = contentRect.height - headerHeight - padding

  // 计算缩放比例，让内容尽可能填满可用空间
  const scaleX = availableWidth / svgWidth
  const scaleY = availableHeight / svgHeight

  // 选择较小的比例，确保内容完全可见，但允许超过100%
  const fitScale = Math.min(scaleX, scaleY)

  // 设置合理的缩放范围
  return Math.max(0.1, Math.min(fitScale, 5))
}

// 适应窗口大小
const fitToWindow = () => {
  // 尝试从实际渲染的SVG元素获取尺寸
  const lightboxImage = document.querySelector('.lightbox-image svg')
  if (lightboxImage) {
    const svgRect = lightboxImage.getBoundingClientRect()
    const lightboxBody = document.querySelector('.lightbox-body')

    if (lightboxBody && svgRect.width > 0 && svgRect.height > 0) {
      const bodyRect = lightboxBody.getBoundingClientRect()
      const padding = 20

      const availableWidth = bodyRect.width - padding
      const availableHeight = bodyRect.height - padding

      const scaleX = availableWidth / svgRect.width
      const scaleY = availableHeight / svgRect.height

      const fitScale = Math.min(scaleX, scaleY)
      scale.value = Math.max(0.1, Math.min(fitScale, 5))
      translateX.value = 0
      translateY.value = 0
      return
    }
  }

  // 回退到原来的计算方法
  const fitScale = calculateFitScale()
  scale.value = fitScale
  translateX.value = 0
  translateY.value = 0
}

// 灯箱功能
const openLightbox = () => {
  if (svgContent.value) {
    showLightbox.value = true
    // 打开时自动计算合适的大小
    nextTick(() => {
      setTimeout(() => {
        fitToWindow()
      }, 150) // 等待弹窗动画和DOM完全渲染
    })
  }
}

const closeLightbox = () => {
  showLightbox.value = false
}

// 缩放功能
const zoomIn = () => {
  scale.value = Math.min(scale.value * 1.2, 5)
}

const zoomOut = () => {
  scale.value = Math.max(scale.value / 1.2, 0.2)
}

const resetZoom = () => {
  scale.value = 1
  translateX.value = 0
  translateY.value = 0
}

// 鼠标滚轮缩放
const handleWheel = (event) => {
  event.preventDefault()
  const delta = event.deltaY > 0 ? 0.9 : 1.1
  scale.value = Math.max(0.2, Math.min(5, scale.value * delta))
}

// 拖拽功能 - 使用中键拖拽
const startDrag = (event) => {
  // 只在中键（滚轮按下）时拖拽
  if (event.button !== 1) return

  event.preventDefault()
  event.stopPropagation()

  isDragging.value = true
  const startX = event.clientX - translateX.value
  const startY = event.clientY - translateY.value

  // 禁用文字选择
  document.body.style.userSelect = 'none'

  const onMouseMove = (e) => {
    if (!isDragging.value) return

    // 使用requestAnimationFrame优化性能
    requestAnimationFrame(() => {
      translateX.value = e.clientX - startX
      translateY.value = e.clientY - startY
    })
  }

  const onMouseUp = () => {
    isDragging.value = false
    document.removeEventListener('mousemove', onMouseMove, { passive: false })
    document.removeEventListener('mouseup', onMouseUp)

    // 恢复文字选择
    document.body.style.userSelect = ''
  }

  // 使用passive: false确保preventDefault生效
  document.addEventListener('mousemove', onMouseMove, { passive: false })
  document.addEventListener('mouseup', onMouseUp)
}

// 复制状态
const copyStatus = ref('')
const showCopyMenu = ref(false)

// SVG转图片功能
const svgToImage = (svgString, format = 'png', scale = 2, quality = 0.9, withBackground = true) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      canvas.width = img.width * scale
      canvas.height = img.height * scale

      // 为PNG和JPG添加白色背景
      if (withBackground && (format === 'jpeg' || format === 'png')) {
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      ctx.scale(scale, scale)
      ctx.drawImage(img, 0, 0)

      const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png'
      canvas.toBlob(resolve, mimeType, quality)
    }

    img.onerror = reject

    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(svgBlob)
    img.src = url
  })
}

// 下拉菜单控制
const toggleCopyMenu = () => {
  showCopyMenu.value = !showCopyMenu.value
}

// 复制SVG功能
const copySVG = async () => {
  showCopyMenu.value = false
  if (!svgContent.value) {
    copyStatus.value = '没有可复制的内容'
    setTimeout(() => copyStatus.value = '', 2000)
    return
  }

  try {
    // 尝试使用现代API
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(svgContent.value)
      copyStatus.value = '✅ SVG已复制'
    } else {
      // 回退到传统方法
      const textArea = document.createElement('textarea')
      textArea.value = svgContent.value
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()

      const successful = document.execCommand('copy')
      document.body.removeChild(textArea)

      if (successful) {
        copyStatus.value = '✅ SVG已复制'
      } else {
        throw new Error('execCommand failed')
      }
    }

    console.log('SVG已复制到剪贴板')
  } catch (err) {
    console.error('复制失败:', err)
    copyStatus.value = '❌ 复制失败'
  }

  // 2秒后清除状态
  setTimeout(() => copyStatus.value = '', 2000)
}

// 复制PNG功能
const copyPNG = async () => {
  showCopyMenu.value = false
  if (!svgContent.value) {
    copyStatus.value = '没有可复制的内容'
    setTimeout(() => copyStatus.value = '', 2000)
    return
  }

  try {
    copyStatus.value = '🔄 正在转换PNG...'

    // 将SVG转换为PNG（带白色背景）
    const pngBlob = await svgToImage(svgContent.value, 'png', 2, 0.9, true)

    if (navigator.clipboard && window.ClipboardItem) {
      // 使用现代API复制图片
      const clipboardItem = new ClipboardItem({
        'image/png': pngBlob
      })
      await navigator.clipboard.write([clipboardItem])
      copyStatus.value = '✅ PNG已复制'
    } else {
      // 浏览器不支持复制图片到剪贴板
      copyStatus.value = '❌ 浏览器不支持复制图片'
    }

    console.log('PNG已复制到剪贴板')
  } catch (err) {
    console.error('PNG复制失败:', err)
    copyStatus.value = '❌ PNG复制失败'
  }

  // 3秒后清除状态
  setTimeout(() => copyStatus.value = '', 3000)
}

// 复制JPG功能
const copyJPG = async () => {
  showCopyMenu.value = false
  if (!svgContent.value) {
    copyStatus.value = '没有可复制的内容'
    setTimeout(() => copyStatus.value = '', 2000)
    return
  }

  try {
    copyStatus.value = '🔄 正在转换JPG...'

    // 将SVG转换为JPG（带白色背景）
    const jpgBlob = await svgToImage(svgContent.value, 'jpeg', 2, 0.9, true)

    if (navigator.clipboard && window.ClipboardItem) {
      try {
        // 检查浏览器是否支持JPG格式
        const clipboardItem = new ClipboardItem({
          'image/jpeg': jpgBlob
        })
        await navigator.clipboard.write([clipboardItem])
        copyStatus.value = '✅ JPG已复制'
        console.log('JPG已复制到剪贴板')
      } catch (clipboardErr) {
        console.warn('JPG剪贴板复制失败，尝试PNG格式:', clipboardErr)
        // 回退到PNG格式
        try {
          const pngBlob = await svgToImage(svgContent.value, 'png', 2, 0.9, true)
          const pngClipboardItem = new ClipboardItem({
            'image/png': pngBlob
          })
          await navigator.clipboard.write([pngClipboardItem])
          copyStatus.value = '✅ 已复制为PNG (JPG不支持)'
        } catch (pngErr) {
          throw new Error('PNG回退也失败')
        }
      }
    } else {
      // 浏览器不支持复制图片到剪贴板，提供下载
      copyStatus.value = '⬇️ 浏览器不支持复制，开始下载...'
      const url = URL.createObjectURL(jpgBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = `mermaid-${Date.now()}.jpg`
      a.click()
      URL.revokeObjectURL(url)
      copyStatus.value = '✅ JPG已下载'
    }
  } catch (err) {
    console.error('JPG复制失败:', err)
    copyStatus.value = '❌ JPG复制失败: ' + (err.message || '未知错误')
  }

  // 3秒后清除状态
  setTimeout(() => copyStatus.value = '', 3000)
}

// 下载SVG功能
const downloadSVG = () => {
  const blob = new Blob([svgContent.value], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `mermaid-${Date.now()}.svg`
  a.click()
  URL.revokeObjectURL(url)
}

// 下载PNG功能
const downloadPNG = async () => {
  if (!svgContent.value) return

  try {
    const pngBlob = await svgToImage(svgContent.value, 'png', 2, 0.9, true)
    const url = URL.createObjectURL(pngBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mermaid-${Date.now()}.png`
    a.click()
    URL.revokeObjectURL(url)
  } catch (err) {
    console.error('PNG下载失败:', err)
  }
}

// 下载JPG功能
const downloadJPG = async () => {
  if (!svgContent.value) return

  try {
    const jpgBlob = await svgToImage(svgContent.value, 'jpeg', 2, 0.9, true)
    const url = URL.createObjectURL(jpgBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mermaid-${Date.now()}.jpg`
    a.click()
    URL.revokeObjectURL(url)
  } catch (err) {
    console.error('JPG下载失败:', err)
  }
}

// 防抖渲染
let renderTimeout = null
const debouncedRender = () => {
  if (renderTimeout) {
    clearTimeout(renderTimeout)
  }
  renderTimeout = setTimeout(renderMermaid, 300)
}

// 监听内容变化
watch(() => props.content, debouncedRender, { immediate: false })

// 组件挂载
onMounted(async () => {
  initMermaid()
  // 等待DOM完全渲染后再进行Mermaid渲染
  await nextTick()
  renderMermaid()
})

// 预览窗口交互功能
const onPreviewEnter = () => {
  isPreviewHovered.value = true
}

const onPreviewLeave = () => {
  isPreviewHovered.value = false
}

// 预览窗口滚轮缩放
const handlePreviewWheel = (event) => {
  if (!isPreviewHovered.value) return

  event.preventDefault()
  event.stopPropagation()

  const delta = event.deltaY > 0 ? 0.9 : 1.1
  const newScale = Math.max(0.2, Math.min(5, previewScale.value * delta))

  // 以鼠标位置为中心缩放
  const rect = event.currentTarget.getBoundingClientRect()
  const centerX = rect.width / 2
  const centerY = rect.height / 2
  const mouseX = event.clientX - rect.left
  const mouseY = event.clientY - rect.top

  // 计算缩放后的位移调整
  const scaleRatio = newScale / previewScale.value
  const deltaX = (mouseX - centerX) * (1 - scaleRatio)
  const deltaY = (mouseY - centerY) * (1 - scaleRatio)

  previewScale.value = newScale
  previewTranslateX.value += deltaX / newScale
  previewTranslateY.value += deltaY / newScale
}

// 预览窗口鼠标按下处理
const handlePreviewMouseDown = (event) => {
  // 只处理中键（滚轮按下）
  if (event.button !== 1) return

  event.preventDefault()
  event.stopPropagation()

  isPreviewDragging.value = true
  const startX = event.clientX - previewTranslateX.value
  const startY = event.clientY - previewTranslateY.value

  // 禁用文字选择
  document.body.style.userSelect = 'none'

  const onMouseMove = (e) => {
    if (!isPreviewDragging.value) return

    requestAnimationFrame(() => {
      previewTranslateX.value = e.clientX - startX
      previewTranslateY.value = e.clientY - startY
    })
  }

  const onMouseUp = () => {
    isPreviewDragging.value = false
    document.removeEventListener('mousemove', onMouseMove, { passive: false })
    document.removeEventListener('mouseup', onMouseUp)

    // 恢复文字选择
    document.body.style.userSelect = ''
  }

  document.addEventListener('mousemove', onMouseMove, { passive: false })
  document.addEventListener('mouseup', onMouseUp)
}

// 重置预览窗口缩放
const resetPreviewZoom = () => {
  previewScale.value = 1
  previewTranslateX.value = 0
  previewTranslateY.value = 0
}

// 组件卸载
onUnmounted(() => {
  if (showLightbox.value) {
    closeLightbox()
  }
})

// 暴露方法给父组件
defineExpose({
  copySVG,
  copyPNG,
  copyJPG,
  downloadSVG,
  downloadPNG,
  downloadJPG,
  openLightbox
})
</script>

<style scoped>
.mermaid-renderer {
  position: relative;
  width: 100%;
  height: 100%;
}

/* 状态覆盖层样式 */
.status-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  z-index: 10;
  text-align: center;
}

.loading {
  color: #666;
  flex-direction: column;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 0.5rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error {
  color: #dc3545;
  flex-direction: column;
}

.error-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

/* 图表容器 */
.mermaid-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.mermaid-content {
  width: 100%;
  height: 100%;
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.1s ease-out;
}

.interactive-preview {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.interactive-preview:hover {
  /* 鼠标悬停时的视觉提示 */
  box-shadow: inset 0 0 0 2px rgba(33, 150, 243, 0.3);
}

/* 操作按钮 */
.mermaid-actions {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s;
}

.action-btn:hover {
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* 复制下拉菜单 */
.copy-dropdown {
  position: relative;
  display: inline-block;
}

.copy-main-btn {
  min-width: 90px;
}

.copy-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 1000;
  min-width: 120px;
  overflow: hidden;
}

.copy-option {
  display: block;
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: none;
  background: white;
  text-align: left;
  cursor: pointer;
  font-size: 0.8rem;
  transition: background-color 0.2s;
  white-space: nowrap;
}

.copy-option:hover {
  background: #f5f5f5;
}

.copy-option:not(:last-child) {
  border-bottom: 1px solid #eee;
}

/* 灯箱样式 */
.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.lightbox-content {
  background: white;
  border-radius: 8px;
  width: 95vw;
  height: 95vh;
  max-width: 1400px;
  max-height: 900px;
  display: flex;
  flex-direction: column;
}

.lightbox-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #eee;
  min-height: 50px;
}

.lightbox-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 500;
  color: #333;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.close-btn {
  background: none;
  border: 1px solid #ddd;
  border-radius: 3px;
  padding: 0.2rem 0.4rem;
  font-size: 1rem;
  cursor: pointer;
  color: #666;
  margin-left: 0.5rem;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
}

.close-btn:hover {
  background: #f5f5f5;
}

.lightbox-body {
  flex: 1;
  overflow: hidden;
  position: relative;
  min-height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 800px;
  min-height: 500px;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.zoom-btn, .reset-btn, .fit-btn {
  padding: 0.2rem 0.4rem;
  border: 1px solid #ddd;
  background: white;
  border-radius: 3px;
  cursor: pointer;
  font-size: 0.85rem;
  height: 28px;
  display: flex;
  align-items: center;
  white-space: nowrap;
}

.zoom-btn:hover, .reset-btn:hover, .fit-btn:hover {
  background: #f5f5f5;
}

.fit-btn {
  background: #e3f2fd;
  border-color: #2196f3;
  color: #1976d2;
}

.fit-btn:hover {
  background: #bbdefb;
}

.zoom-level {
  font-weight: 500;
  min-width: 45px;
  text-align: center;
  font-size: 0.85rem;
  color: #666;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 操作提示 */
.interaction-hint {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  pointer-events: none;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.lightbox-body:hover .interaction-hint {
  opacity: 1;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .lightbox-content {
    width: 98vw;
    height: 98vh;
    max-width: none;
    max-height: none;
  }

  .lightbox-image {
    min-width: auto;
    min-height: auto;
  }

  .lightbox-body {
    min-height: 400px;
  }

  .header-controls {
    flex-wrap: wrap;
    gap: 0.25rem;
  }

  .lightbox-header h3 {
    font-size: 1rem;
    margin: 0;
  }

  .zoom-btn, .reset-btn, .fit-btn, .close-btn {
    padding: 0.2rem 0.4rem;
    font-size: 0.8rem;
  }
}
</style>
