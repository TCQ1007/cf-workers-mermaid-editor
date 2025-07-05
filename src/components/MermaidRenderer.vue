<template>
  <div class="mermaid-renderer">
    <!-- 图表容器 - 始终存在 -->
    <div class="mermaid-container">
      <div ref="mermaidContainer" class="mermaid-content" @click="openLightbox"></div>

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
    </div>

    <!-- 灯箱预览 -->
    <div v-if="showLightbox" class="lightbox" @click="closeLightbox">
      <div class="lightbox-content" @click.stop>
        <div class="lightbox-header">
          <h3>图表预览</h3>
          <button @click="closeLightbox" class="close-btn">✕</button>
        </div>
        
        <div class="lightbox-body">
          <div 
            class="lightbox-image"
            :style="imageStyle"
            @wheel="handleWheel"
            @mousedown="startDrag"
            v-html="svgContent"
          ></div>
        </div>
        
        <div class="lightbox-controls">
          <button @click="zoomOut" class="zoom-btn">🔍-</button>
          <span class="zoom-level">{{ Math.round(scale * 100) }}%</span>
          <button @click="zoomIn" class="zoom-btn">🔍+</button>
          <button @click="resetZoom" class="reset-btn">重置</button>
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

// 计算属性
const imageStyle = computed(() => ({
  transform: `scale(${scale.value}) translate(${translateX.value}px, ${translateY.value}px)`,
  cursor: isDragging.value ? 'grabbing' : (scale.value > 1 ? 'grab' : 'default')
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

// 灯箱功能
const openLightbox = () => {
  if (svgContent.value) {
    showLightbox.value = true
    resetZoom()
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

// 拖拽功能
const startDrag = (event) => {
  if (scale.value <= 1) return
  
  isDragging.value = true
  const startX = event.clientX - translateX.value
  const startY = event.clientY - translateY.value

  const onMouseMove = (e) => {
    translateX.value = e.clientX - startX
    translateY.value = e.clientY - startY
  }

  const onMouseUp = () => {
    isDragging.value = false
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

// 复制功能
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(svgContent.value)
    console.log('图表已复制到剪贴板')
  } catch (err) {
    console.error('复制失败:', err)
  }
}

// 下载功能
const downloadSVG = () => {
  const blob = new Blob([svgContent.value], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `mermaid-${Date.now()}.svg`
  a.click()
  URL.revokeObjectURL(url)
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

// 组件卸载
onUnmounted(() => {
  if (showLightbox.value) {
    closeLightbox()
  }
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
  overflow: auto;
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
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
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
  transition: transform 0.2s ease;
  min-width: 800px;
  min-height: 500px;
}

.lightbox-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
  border-top: 1px solid #eee;
}

.zoom-btn, .reset-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
}

.zoom-level {
  font-weight: bold;
  min-width: 60px;
  text-align: center;
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

  .lightbox-controls {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
}
</style>
