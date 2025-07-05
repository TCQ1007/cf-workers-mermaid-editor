/**
 * 微前端配置文件
 * 用于管理在京东微前端框架下的配置
 */

// 微前端环境检测配置
export const MICRO_APP_CONFIG = {
  // 路由前缀
  BASE_PATH: '/mermaid',
  
  // 检测标识符
  DETECTION_FLAGS: [
    '__MICRO_APP_ENVIRONMENT__',
    '__MICRO_APP_NAME__',
    'microApp',
    '__JINGDONG_MICRO_APP__'
  ],
  
  // DOM选择器检测
  DOM_SELECTORS: [
    'micro-app',
    '[data-micro-app]',
    '.jd-micro-app-container'
  ]
}

/**
 * 检测是否在京东微前端环境中运行
 * @returns {boolean}
 */
export function isInJingdongMicroApp() {
  // 1. 检测全局变量
  const hasGlobalFlags = MICRO_APP_CONFIG.DETECTION_FLAGS.some(flag => 
    window[flag] !== undefined
  )
  
  // 2. 检测是否在iframe中
  const isInIframe = window.parent !== window
  
  // 3. 检测DOM元素
  const hasMicroAppElements = MICRO_APP_CONFIG.DOM_SELECTORS.some(selector =>
    document.querySelector(selector) !== null
  )
  
  // 4. 检测URL路径
  const hasPathPrefix = window.location.pathname.startsWith(MICRO_APP_CONFIG.BASE_PATH)
  
  // 5. 检测环境变量（构建时）
  const isBuildForMicroApp = import.meta.env.VITE_MICRO_APP_MODE === 'true'
  
  const result = hasGlobalFlags || isInIframe || hasMicroAppElements || hasPathPrefix || isBuildForMicroApp
  
  if (result) {
    console.log('🔍 京东微前端环境检测结果:', {
      hasGlobalFlags,
      isInIframe,
      hasMicroAppElements,
      hasPathPrefix,
      isBuildForMicroApp,
      userAgent: navigator.userAgent.includes('JingdongApp') ? 'JingdongApp' : 'Other'
    })
  }
  
  return result
}

/**
 * 获取基础路径
 * @returns {string}
 */
export function getBasePath() {
  if (isInJingdongMicroApp()) {
    console.log('🔍 检测到京东微前端环境，使用路由前缀:', MICRO_APP_CONFIG.BASE_PATH)
    return MICRO_APP_CONFIG.BASE_PATH
  }
  
  console.log('🏠 独立运行模式，不使用路由前缀')
  return import.meta.env.BASE_URL || '/'
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
