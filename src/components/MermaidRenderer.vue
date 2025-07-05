<template>
  <div class="mermaid-renderer">
    <div v-if="error" class="error-message">
      <h4>⚠️ Mermaid 语法错误</h4>
      <p>{{ error }}</p>
      <details>
        <summary>点击查看原始代码</summary>
        <pre>{{ content }}</pre>
      </details>
    </div>
    <div v-else class="preview-wrapper">
      <div v-if="loading" class="loading-overlay">
        <div class="loading-spinner"></div>
        正在渲染图表...
      </div>
      <div class="mermaid-container" ref="mermaidContainer" @click="openLightbox"></div>
    </div>
    <div v-if="showLightbox" class="lightbox-overlay" @click="closeLightbox">
      <div class="lightbox-container">
        <div class="lightbox-header">
          <div class="lightbox-title"> 图表预览</div>
          <div class="lightbox-controls">
            <button @click="zoomOut" class="control-btn" :disabled="scale <= 0.2">🔍-</button>
            <span class="zoom-level">{{ Math.round(scale * 100) }}%</span>
            <button @click="zoomIn" class="control-btn" :disabled="scale >= 10">🔍+</button>
            <div class="zoom-presets">
              <button @click="calculateFitZoom" class="preset-btn fit-btn">适应窗口</button>
              <button @click="setZoom(1)" class="preset-btn" :class="{ active: Math.abs(scale - 1) < 0.1 }">100%</button>
              <button @click="setZoom(2)" class="preset-btn" :class="{ active: Math.abs(scale - 2) < 0.1 }">200%</button>
              <button @click="setZoom(5)" class="preset-btn" :class="{ active: Math.abs(scale - 5) < 0.1 }">500%</button>
              <button @click="setZoom(10)" class="preset-btn" :class="{ active: Math.abs(scale - 10) < 0.1 }">1000%</button>
            </div>
            <button @click="resetZoom" class="control-btn">🔄</button>
            <button @click="closeLightbox" class="control-btn close-btn">✕</button>
          </div>
        </div>
        <div class="lightbox-content" ref="lightboxContent">
          <div 
            class="lightbox-image" 
            :class="{ 'no-transition': isDragging }"
            ref="lightboxImage"
            :style="{ 
              transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`,
              cursor: isDragging ? 'grabbing' : (scale > 1 ? 'grab' : 'default')
            }"
            @mousedown="startDrag"
            @touchstart="startDrag"
            @wheel="onWheel"
          >
            <div v-html="svgContent"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch, nextTick, onUnmounted } from 'vue'

export default {
  name: 'MermaidRenderer',
  props: {
    content: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const mermaidContainer = ref(null)
    const lightboxContent = ref(null)
    const lightboxImage = ref(null)
    const loading = ref(false)
    const error = ref('')
    const showLightbox = ref(false)
    const svgContent = ref('')
    const scale = ref(1)
    const translateX = ref(0)
    const translateY = ref(0)
    const isDragging = ref(false)
    const dragStart = ref({ x: 0, y: 0 })
    const dragStartTranslate = ref({ x: 0, y: 0 })
    let renderTimeout = null
    let rafId = null
    let currentMousePos = { x: 0, y: 0 }
    let isUpdating = false
    const initMermaid = () => {
      try {
        if (!window.mermaid) {
          throw new Error('Mermaid library not loaded')
        }
        window.mermaid.initialize({
          startOnLoad: false,
          theme: 'default',
          securityLevel: 'loose',
          fontFamily: 'Arial, sans-serif',
          flowchart: {
            useMaxWidth: true,
            htmlLabels: true
          },
          sequence: {
            useMaxWidth: true
          },
          gantt: {
            useMaxWidth: true
          },
          class: {
            useMaxWidth: true
          },
          state: {
            useMaxWidth: true
          },
          pie: {
            useMaxWidth: true
          }
        })
        console.log('Mermaid initialized successfully')
      } catch (err) {
        console.error('Failed to initialize Mermaid:', err)
        error.value = '无法初始化 Mermaid 渲染器'
      }
    }
    const renderMermaid = async () => {
      if (renderTimeout) {
        clearTimeout(renderTimeout)
      }
      if (!props.content.trim()) {
        if (mermaidContainer.value) {
          mermaidContainer.value.innerHTML = '<div class="empty-message">请输入 Mermaid 语法</div>'
        }
        return
      }
      loading.value = true
      error.value = ''
      renderTimeout = setTimeout(async () => {
        try {
          await nextTick()
          if (!mermaidContainer.value) {
            loading.value = false
            return
          }
          mermaidContainer.value.innerHTML = ''
          const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
          const { svg } = await window.mermaid.render(id, props.content)
          if (mermaidContainer.value) {
            mermaidContainer.value.innerHTML = svg
            svgContent.value = svg
            const svgElement = mermaidContainer.value.querySelector('svg')
            if (svgElement) {
              // 移除 maxWidth 限制，让 SVG 保持原始尺寸，通过容器滚动查看
              svgElement.style.height = 'auto'
              svgElement.style.display = 'block'
              svgElement.style.cursor = 'pointer'
              // 如果图表很小，则居中显示
              const containerWidth = mermaidContainer.value.clientWidth
              const svgWidth = svgElement.getBoundingClientRect().width
              if (svgWidth < containerWidth) {
                svgElement.style.margin = '0 auto'
              } else {
                svgElement.style.margin = '0'
              }
            }
          }
        } catch (err) {
          console.error('Mermaid rendering error:', err)
          if (err.message && err.message.includes('mermaid')) {
            error.value = 'Mermaid 模块加载失败，请刷新页面重试'
          } else {
            error.value = err.message || '图表语法错误，请检查语法'
          }
        } finally {
          loading.value = false
        }
      }, 300)
    }
    const openLightbox = () => {
      if (svgContent.value) {
        showLightbox.value = true
        document.body.style.overflow = 'hidden'
        // 等待DOM更新后计算适合的缩放比例
        nextTick(() => {
          calculateFitZoom()
        })
      }
    }
    const closeLightbox = (e) => {
      if (e.target === e.currentTarget) {
        showLightbox.value = false
        document.body.style.overflow = 'auto'
      }
    }
    const zoomIn = () => {
      if (scale.value < 10) {
        let step = 0.2
        if (scale.value >= 2) step = 0.5
        if (scale.value >= 5) step = 1
        scale.value = Math.min(10, scale.value + step)
      }
    }
    const zoomOut = () => {
      if (scale.value > 0.2) {
        let step = 0.2
        if (scale.value > 2) step = 0.5
        if (scale.value > 5) step = 1
        scale.value = Math.max(0.2, scale.value - step)
      }
    }
    const resetZoom = () => {
      scale.value = 1
      translateX.value = 0
      translateY.value = 0
    }

    const calculateFitZoom = () => {
      if (!lightboxContent.value || !svgContent.value) {
        resetZoom()
        return
      }

      // 创建临时元素来测量SVG的原始尺寸
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = svgContent.value
      tempDiv.style.position = 'absolute'
      tempDiv.style.visibility = 'hidden'
      tempDiv.style.pointerEvents = 'none'
      document.body.appendChild(tempDiv)

      const tempSvg = tempDiv.querySelector('svg')
      if (!tempSvg) {
        document.body.removeChild(tempDiv)
        resetZoom()
        return
      }

      // 获取SVG的原始尺寸
      const svgRect = tempSvg.getBoundingClientRect()
      const svgWidth = svgRect.width
      const svgHeight = svgRect.height

      // 清理临时元素
      document.body.removeChild(tempDiv)

      // 获取可用的显示区域尺寸（减去一些边距）
      const containerRect = lightboxContent.value.getBoundingClientRect()
      const availableWidth = containerRect.width - 40 // 预留40px边距
      const availableHeight = containerRect.height - 40 // 预留40px边距

      // 计算缩放比例，使图表适应窗口
      const scaleX = availableWidth / svgWidth
      const scaleY = availableHeight / svgHeight
      const fitScale = Math.min(scaleX, scaleY, 10) // 最大不超过10倍

      // 设置合适的缩放比例，最小0.2倍
      scale.value = Math.max(0.2, fitScale)
      translateX.value = 0
      translateY.value = 0
    }
    const setZoom = (targetScale) => {
      scale.value = targetScale
      translateX.value = 0
      translateY.value = 0
    }
    const onWheel = (e) => {
      e.preventDefault()
      let delta = e.deltaY > 0 ? -0.1 : 0.1
      let newScale = scale.value + delta
      newScale = Math.max(0.2, Math.min(10, newScale))
      scale.value = newScale
    }
    const startDrag = (e) => {
      isDragging.value = true
      if (e.type === 'mousedown') {
        dragStart.value = { x: e.clientX, y: e.clientY }
      } else if (e.type === 'touchstart') {
        dragStart.value = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      }
      dragStartTranslate.value = { x: translateX.value, y: translateY.value }
      document.addEventListener('mousemove', onDrag)
      document.addEventListener('mouseup', stopDrag)
      document.addEventListener('touchmove', onDrag)
      document.addEventListener('touchend', stopDrag)
    }
    const onDrag = (e) => {
      if (!isDragging.value) return
      let clientX, clientY
      if (e.type.startsWith('touch')) {
        clientX = e.touches[0].clientX
        clientY = e.touches[0].clientY
      } else {
        clientX = e.clientX
        clientY = e.clientY
      }
      translateX.value = dragStartTranslate.value.x + (clientX - dragStart.value.x)
      translateY.value = dragStartTranslate.value.y + (clientY - dragStart.value.y)
    }
    const stopDrag = () => {
      isDragging.value = false
      document.removeEventListener('mousemove', onDrag)
      document.removeEventListener('mouseup', stopDrag)
      document.removeEventListener('touchmove', onDrag)
      document.removeEventListener('touchend', stopDrag)
    }
    watch(() => props.content, () => {
      renderMermaid()
    })
    onMounted(() => {
      initMermaid()
      renderMermaid()
    })
    onUnmounted(() => {
      if (renderTimeout) clearTimeout(renderTimeout)
      if (rafId) cancelAnimationFrame(rafId)
    })
    return {
      mermaidContainer,
      lightboxContent,
      lightboxImage,
      loading,
      error,
      showLightbox,
      svgContent,
      scale,
      translateX,
      translateY,
      isDragging,
      openLightbox,
      closeLightbox,
      zoomIn,
      zoomOut,
      resetZoom,
      calculateFitZoom,
      setZoom,
      onWheel,
      startDrag
    }
  }
}
</script>

<style scoped>
.mermaid-renderer {
  width: 100%;
  height: 100%;
  position: relative;
}
.error-message {
  color: #d32f2f;
  background: #fff3f3;
  border: 1px solid #fbc2c2;
  border-radius: 6px;
  padding: 16px;
  margin: 16px 0;
}
.preview-wrapper {
  width: 100%;
  height: 100%;
  min-height: 400px;
  position: relative;
}
.loading-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(255,255,255,0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 2;
}
.loading-spinner {
  width: 32px;
  height: 32px;
  border: 4px solid #e0e0e0;
  border-top: 4px solid #1976d2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 8px;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.mermaid-container {
  width: 100%;
  min-height: 400px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  box-sizing: border-box;
  padding: 16px;
  cursor: pointer;
  overflow-x: auto;
}
.lightbox-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.7);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.lightbox-container {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.2);
  width: 95vw;
  height: 95vh;
  max-width: 95vw;
  max-height: 95vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.lightbox-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
}
.lightbox-title {
  font-weight: bold;
  font-size: 18px;
}
.lightbox-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}
.control-btn {
  background: #f0f0f0;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.2s;
}
.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.preset-btn {
  background: #e3f2fd;
  border: none;
  border-radius: 4px;
  padding: 2px 6px;
  margin: 0 2px;
  cursor: pointer;
  font-size: 14px;
}
.preset-btn.active {
  background: #1976d2;
  color: #fff;
}

.preset-btn.fit-btn {
  background: #4caf50;
  color: #fff;
  font-weight: bold;
}

.preset-btn.fit-btn:hover {
  background: #45a049;
}
.lightbox-content {
  flex: 1;
  overflow: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafbfc;
}
.lightbox-image {
  display: inline-block;
  transition: transform 0.2s cubic-bezier(0.4,0,0.2,1);
  will-change: transform;
  user-select: none;
}
.lightbox-image.no-transition {
  transition: none;
}
</style> 