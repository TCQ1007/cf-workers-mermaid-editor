<template>
  <div class="tour-button-container">
    <button 
      @click="startTour" 
      class="tour-btn" 
      :class="{ 'tour-btn-pulse': showPulse }"
      title="功能引导 - 了解所有功能特性"
    >
      <span class="tour-icon">🎯</span>
      <span class="tour-text">功能引导</span>
    </button>
    
    <!-- 重置按钮（开发模式下显示） -->
    <button 
      v-if="showResetButton" 
      @click="resetTour" 
      class="tour-reset-btn"
      title="重置引导状态"
    >
      🔄
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { globalTourManager } from '../utils/tour.js'

// Props
const props = defineProps({
  // 是否显示脉冲动画
  pulse: {
    type: Boolean,
    default: true
  },
  // 是否在首次访问时显示脉冲
  pulseOnFirstVisit: {
    type: Boolean,
    default: true
  }
})

// 响应式数据
const showPulse = ref(false)
const showResetButton = ref(false)

// 使用全局引导管理器实例（避免重复创建）
const tourManager = globalTourManager

/**
 * 开始引导
 */
const startTour = () => {
  // 停止脉冲动画
  showPulse.value = false

  // 强制启动引导
  tourManager.startTour(true)
}

/**
 * 重置引导状态
 */
const resetTour = async () => {
  // 使用现代化的确认对话框
  const confirmed = await showConfirmDialog(
    '重置引导状态',
    '确定要重置引导状态吗？这将清除所有引导记录。',
    '重置',
    '取消'
  )

  if (confirmed) {
    tourManager.resetTour()
    showPulse.value = true

    // 给用户反馈
    showSuccessMessage('引导状态已重置！刷新页面将重新显示引导。')
  }
}

/**
 * 现代化确认对话框
 */
const showConfirmDialog = (title, message, confirmText, cancelText) => {
  return new Promise((resolve) => {
    // 如果浏览器支持，可以使用更现代的方式
    // 这里暂时使用原生confirm，后续可以替换为自定义组件
    const result = confirm(`${title}\n\n${message}`)
    resolve(result)
  })
}

/**
 * 成功消息提示
 */
const showSuccessMessage = (message) => {
  // 创建临时提示元素
  const toast = document.createElement('div')
  toast.textContent = message
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #10b981;
    color: white;
    padding: 12px 20px;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    font-family: var(--tour-font-family, sans-serif);
    font-size: 14px;
    max-width: 300px;
    word-wrap: break-word;
  `

  document.body.appendChild(toast)

  // 3秒后自动移除
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast)
    }
  }, 3000)
}

/**
 * 检查是否显示脉冲动画
 */
const checkPulseAnimation = () => {
  if (!props.pulse) return
  
  // 如果是首次访问且启用了首次访问脉冲
  if (props.pulseOnFirstVisit && tourManager.isFirstVisit) {
    showPulse.value = true
    
    // 10秒后停止脉冲
    setTimeout(() => {
      showPulse.value = false
    }, 10000)
  }
}

/**
 * 检查是否显示重置按钮
 */
const checkResetButton = () => {
  // 开发环境或者URL包含debug参数时显示
  const isDev = import.meta.env.DEV
  const hasDebug = new URLSearchParams(window.location.search).has('debug')
  
  showResetButton.value = isDev || hasDebug
}

// 生命周期
onMounted(() => {
  checkPulseAnimation()
  checkResetButton()
})

// 暴露方法给父组件
defineExpose({
  startTour,
  resetTour,
  tourManager,
  stopPulse: () => { showPulse.value = false },
  startPulse: () => { showPulse.value = true }
})
</script>

<style scoped>
.tour-button-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tour-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: relative;
  overflow: hidden;
}

.tour-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  background: linear-gradient(135deg, #7c8df0 0%, #8659b8 100%);
}

.tour-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.tour-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}

.tour-btn:hover::before {
  left: 100%;
}

.tour-icon {
  font-size: 1.1rem;
  display: flex;
  align-items: center;
}

.tour-text {
  font-weight: 500;
  white-space: nowrap;
}

/* 脉冲动画 */
.tour-btn-pulse {
  animation: tourPulse 2s infinite;
}

@keyframes tourPulse {
  0% {
    box-shadow: 0 2px 4px rgba(0,0,0,0.1), 0 0 0 0 rgba(102, 126, 234, 0.7);
  }
  70% {
    box-shadow: 0 2px 4px rgba(0,0,0,0.1), 0 0 0 10px rgba(102, 126, 234, 0);
  }
  100% {
    box-shadow: 0 2px 4px rgba(0,0,0,0.1), 0 0 0 0 rgba(102, 126, 234, 0);
  }
}

/* 重置按钮 */
.tour-reset-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background: #f0f0f0;
  color: #666;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tour-reset-btn:hover {
  background: #e0e0e0;
  transform: rotate(180deg);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .tour-text {
    display: none;
  }
  
  .tour-btn {
    padding: 0.5rem;
    min-width: 40px;
    justify-content: center;
  }
  
  .tour-icon {
    margin: 0;
  }
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .tour-reset-btn {
    background: #333;
    color: #ccc;
  }
  
  .tour-reset-btn:hover {
    background: #444;
  }
}
</style>
