import { tourSteps, tourConfig } from './tourSteps.js'

/**
 * 引导功能管理器
 * 负责管理整个引导流程的初始化、启动、状态管理等
 */
export class TourManager {
  constructor() {
    this.driver = null
    this.config = tourConfig
    this.isFirstVisit = !localStorage.getItem('tour-completed')
    this.tourVersion = this.config.version
  }

  /**
   * 初始化Driver.js实例
   * @returns {boolean} 初始化是否成功
   */
  initDriver() {
    // 检查Driver.js是否已加载（新版本API）
    if (typeof window.driver?.js?.driver !== 'function') {
      console.error('Driver.js未加载或版本不正确，请确保CDN链接正确')
      return false
    }

    try {
      // 使用新版本API创建driver实例
      const driverConstructor = window.driver.js.driver

      this.driver = driverConstructor({
        // 使用配置文件中的选项
        ...this.config.driverOptions,

        // 步骤配置
        steps: [], // 步骤将在startTour中设置

        // 全局配置
        popoverClass: 'driverjs-theme',

        // 按钮文本配置
        ...this.config.texts,

        // 回调函数
        onDestroyed: () => {
          this.onTourComplete()
        },

        onHighlighted: (element, step, options) => {
          this.onStepHighlighted(element, step)
        },

        onDeselected: (element, step, options) => {
          // 步骤切换时的回调
        }
      })

      return true
    } catch (error) {
      console.error('Driver.js初始化失败:', error)
      return false
    }
  }

  /**
   * 开始引导流程
   * @param {boolean} force 是否强制开始（忽略已完成状态）
   */
  startTour(force = false) {
    // 如果不是强制开始且已经完成过引导，则不启动
    if (!force && this.hasCompletedTour()) {
      console.log('用户已完成引导，跳过自动引导')
      return
    }

    if (!this.initDriver()) {
      console.error('无法启动引导：Driver.js初始化失败')
      return
    }

    try {
      // 使用新版本API设置步骤并启动
      this.driver.setSteps(tourSteps)
      this.driver.drive()

      // 记录引导开始
      this.onTourStart()

      console.log('引导已启动')
    } catch (error) {
      console.error('启动引导失败:', error)
    }
  }

  /**
   * 检查是否需要自动启动引导
   */
  checkAutoStart() {
    if (!this.config.autoStart) return

    // 延迟检查，确保页面完全加载
    setTimeout(() => {
      if (this.shouldAutoStart()) {
        console.log('检测到首次访问，自动启动引导')
        this.startTour()
      }
    }, this.config.autoStartDelay) // 使用配置中的延迟时间
  }

  /**
   * 判断是否应该自动启动引导
   * @returns {boolean}
   */
  shouldAutoStart() {
    // 检查是否首次访问
    if (!this.isFirstVisit) {
      return false
    }

    // 检查引导版本是否更新
    const lastTourVersion = localStorage.getItem('tour-version')
    if (lastTourVersion !== this.tourVersion) {
      return true
    }

    return true
  }

  /**
   * 检查用户是否已完成引导
   * @returns {boolean}
   */
  hasCompletedTour() {
    const completed = localStorage.getItem('tour-completed')
    const version = localStorage.getItem('tour-version')
    
    // 如果版本不匹配，认为未完成
    if (version !== this.tourVersion) {
      return false
    }
    
    return completed === 'true'
  }

  /**
   * 重置引导状态
   */
  resetTour() {
    localStorage.removeItem('tour-completed')
    localStorage.removeItem('tour-version')
    localStorage.removeItem('tour-start-time')
    this.isFirstVisit = true
    console.log('引导状态已重置')
  }

  /**
   * 强制重新开始引导
   */
  restartTour() {
    if (this.driver) {
      this.driver.reset()
    }
    this.startTour(true)
  }

  /**
   * 引导开始回调
   */
  onTourStart() {
    localStorage.setItem('tour-start-time', Date.now().toString())
    console.log('引导开始')
  }

  /**
   * 引导完成回调
   */
  onTourComplete() {
    localStorage.setItem('tour-completed', 'true')
    localStorage.setItem('tour-version', this.tourVersion)
    localStorage.setItem('tour-complete-time', Date.now().toString())
    
    // 计算引导用时
    const startTime = localStorage.getItem('tour-start-time')
    if (startTime) {
      const duration = Date.now() - parseInt(startTime)
      console.log(`引导完成，用时: ${Math.round(duration / 1000)}秒`)
    }
    
    console.log('引导已完成')
  }

  /**
   * 步骤高亮回调
   * @param {Element} element 当前高亮的元素
   */
  onStepHighlighted(element) {
    // 可以在这里添加每个步骤的特殊处理
    if (element && element.classList) {
      console.log('当前步骤:', element.className || element.tagName)
    }
  }

  /**
   * 引导重置回调
   */
  onTourReset() {
    console.log('引导已重置')
  }

  /**
   * 获取引导统计信息
   * @returns {Object} 统计信息
   */
  getTourStats() {
    return {
      completed: this.hasCompletedTour(),
      version: this.tourVersion,
      isFirstVisit: this.isFirstVisit,
      startTime: localStorage.getItem('tour-start-time'),
      completeTime: localStorage.getItem('tour-complete-time')
    }
  }
}

// 创建全局实例（可选）
export const globalTourManager = new TourManager()

// 默认导出
export default TourManager
