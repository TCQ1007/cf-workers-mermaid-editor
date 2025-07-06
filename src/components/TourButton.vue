<template>
  <button
    @click="startTour"
    class="tour-btn"
    :class="{ 'tour-btn-pulse': showPulse }"
    title="功能引导 - 了解所有功能特性"
  >
    <span class="tour-icon">🎯</span>
    <span class="tour-text">功能引导</span>
  </button>
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

// 生命周期
onMounted(() => {
  checkPulseAnimation()
})

// 暴露方法给父组件
defineExpose({
  startTour,
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
