/**
 * 微前端配置文件
 * 简化版本，通过环境标识判断是否在微前端中运行
 */

/**
 * 检测是否在微前端环境中运行
 * @returns {boolean}
 */
export function isInJingdongMicroApp() {
  // 检测微前端环境标识
  const hasGlobalFlags = !!(
    window.__MICRO_APP_ENVIRONMENT__ ||
    window.__MICRO_APP_NAME__ ||
    window.microApp ||
    window.__JINGDONG_MICRO_APP__
  )
  
  // 检测是否在iframe中
  const isInIframe = window.parent !== window
  
  // 检测DOM元素
  const hasMicroAppElements = !!(
    document.querySelector('micro-app') ||
    document.querySelector('[data-micro-app]')
  )
  
  const result = hasGlobalFlags || isInIframe || hasMicroAppElements
  
  if (result) {
    console.log('🔍 检测到微前端环境')
  }
  
  return result
}

/**
 * 获取基础路径
 * @returns {string}
 */
export function getBasePath() {
  if (isInJingdongMicroApp()) {
    // 在微前端环境下，从当前路径中提取第一段作为前缀
    const pathSegments = window.location.pathname.split('/').filter(Boolean)
    if (pathSegments.length > 0) {
      const prefix = `/${pathSegments[0]}`
      console.log(`🔍 检测到微前端环境，使用路由前缀: ${prefix}`)
      return prefix
    }
    // 如果没有路径段，使用默认前缀
    console.log('🔍 检测到微前端环境，使用默认路由前缀: /mermaid')
    return '/mermaid'
  }

  console.log('🏠 独立运行模式，不使用路由前缀')
  return '/'
}

/**
 * 微前端生命周期钩子
 */
export const microAppLifecycle = {
  /**
   * 微应用挂载前
   */
  beforeMount() {
    console.log('🚀 Mermaid微应用准备挂载')
  },
  
  /**
   * 微应用挂载后
   */
  mounted() {
    console.log('✅ Mermaid微应用挂载完成')
    
    // 向父应用发送就绪消息
    if (window.parent !== window) {
      window.parent.postMessage({
        type: 'MICRO_APP_READY',
        name: 'mermaid',
        timestamp: Date.now()
      }, '*')
    }
  },
  
  /**
   * 微应用卸载前
   */
  beforeUnmount() {
    console.log('🔄 Mermaid微应用准备卸载')
  },
  
  /**
   * 微应用卸载后
   */
  unmounted() {
    console.log('👋 Mermaid微应用卸载完成')
  }
}
