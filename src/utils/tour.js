// 引导功能配置
const tourConfig = {
  version: "1.0.0",
  autoStart: true,
  autoStartDelay: 1500,
  showProgress: true,
  allowClose: true,
  keyboardControl: true,
  smoothScroll: true,

  // Driver.js配置
  driverOptions: {
    animate: true,
    opacity: 0.75,
    padding: 10,
    overlayClickNext: false,
    showButtons: true,
    showProgress: true,
    keyboardControl: true,
    smoothScroll: true
  },

  // 按钮文本
  texts: {
    doneBtnText: "🎉 完成引导",
    closeBtnText: "✕",
    nextBtnText: "下一步 →",
    prevBtnText: "← 上一步"
  }
};

// 引导步骤配置（新版Driver.js格式）
const tourSteps = [
  {
    element: 'body',
    popover: {
      title: '🎉 欢迎使用 Mermaid 图表编辑器',
      description: `
        <div class="tour-welcome">
          <p>这是一个现代化的在线Mermaid图表编辑器，让您轻松创建各种图表！</p>
          <div class="tour-features">
            <div class="feature-item">📝 实时编辑和预览</div>
            <div class="feature-item">🖱️ 智能交互操作</div>
            <div class="feature-item">📤 多格式导出</div>
            <div class="feature-item">🎨 现代化界面</div>
          </div>
          <p class="tour-start">让我们开始一个快速导览，了解所有功能吧！</p>
        </div>
      `,
      side: 'over',
      align: 'center'
    }
  },
  {
    element: '.editor-container',
    popover: {
      title: '📝 代码编辑器',
      description: `
        <div class="tour-step">
          <p>这里是Monaco编辑器，提供专业的代码编辑体验：</p>
          <ul class="tour-list">
            <li>🎨 <strong>语法高亮</strong> - Mermaid语法着色显示</li>
            <li>⌨️ <strong>智能提示</strong> - 代码自动补全功能</li>
            <li>🔍 <strong>字体调整</strong> - Ctrl + 滚轮调整字体大小</li>
            <li>💾 <strong>自动保存</strong> - 编辑内容自动保存到本地</li>
          </ul>
          <div class="tour-tip">
            💡 <strong>小贴士：</strong>试试在编辑器中输入一些Mermaid语法，右侧会实时显示图表！
          </div>
        </div>
      `,
      side: 'right',
      align: 'start'
    }
  },
  {
    element: '.preview-content',
    popover: {
      title: '👁️ 实时预览区',
      description: `
        <div class="tour-step">
          <p>右侧是实时预览区域，支持智能交互操作：</p>
          <ul class="tour-list">
            <li>⚡ <strong>实时渲染</strong> - 编辑内容立即显示图表</li>
            <li>🖱️ <strong>滚轮缩放</strong> - 鼠标滚轮放大缩小图表</li>
            <li>🖱️ <strong>中键拖拽</strong> - 按住滚轮拖拽移动图表</li>
            <li>👆 <strong>双击重置</strong> - 双击恢复原始大小和位置</li>
          </ul>
          <div class="tour-demo">
            <strong>🎮 试试这些操作：</strong>
            <div class="demo-actions">
              <span class="demo-action">滚轮 → 缩放</span>
              <span class="demo-action">中键拖拽 → 移动</span>
              <span class="demo-action">双击 → 重置</span>
            </div>
          </div>
        </div>
      `,
      side: 'left',
      align: 'start'
    }
  },
  {
    element: '.copy-dropdown',
    popover: {
      title: '📋 复制功能',
      description: `
        <div class="tour-step">
          <p>支持多种格式的复制功能，满足不同使用场景：</p>
          <ul class="tour-list">
            <li>📄 <strong>SVG代码</strong> - 适合开发者使用和网页集成</li>
            <li>🖼️ <strong>PNG图片</strong> - 高质量图片，带白色背景</li>
            <li>📸 <strong>JPG图片</strong> - 文档友好格式，适合演示</li>
          </ul>
          <div class="tour-highlight">
            <strong>✨ 特色功能：</strong>PNG和JPG会自动添加白色背景，让图表在任何地方都清晰可见！
          </div>
        </div>
      `,
      side: 'bottom',
      align: 'center'
    }
  },
  {
    element: '.download-dropdown',
    popover: {
      title: '💾 下载功能',
      description: `
        <div class="tour-step">
          <p>提供多种格式的文件下载，方便保存和分享：</p>
          <ul class="tour-list">
            <li>📄 <strong>SVG文件</strong> - 矢量格式，无损缩放</li>
            <li>🖼️ <strong>PNG图片</strong> - 高质量位图，支持透明</li>
            <li>📸 <strong>JPG图片</strong> - 通用格式，文件较小</li>
          </ul>
          <div class="tour-note">
            📌 <strong>使用建议：</strong>
            <br>• 网页使用 → SVG格式
            <br>• 文档插入 → PNG/JPG格式
            <br>• 打印分享 → JPG格式
          </div>
        </div>
      `,
      side: 'bottom',
      align: 'center'
    }
  },
  {
    element: '.preview-window-btn',
    popover: {
      title: '🪟 新窗口预览',
      description: `
        <div class="tour-step">
          <p>独立预览窗口提供更大的查看空间：</p>
          <ul class="tour-list">
            <li>🔍 <strong>更大空间</strong> - 专门的预览窗口，查看更清晰</li>
            <li>🔄 <strong>实时同步</strong> - 与主窗口编辑内容实时同步</li>
            <li>🖱️ <strong>完整交互</strong> - 支持缩放、拖拽等所有操作</li>
            <li>📱 <strong>多屏支持</strong> - 可以拖拽到其他显示器</li>
          </ul>
          <div class="tour-tip">
            💡 <strong>使用场景：</strong>演示时可以将预览窗口投屏，主窗口继续编辑！
          </div>
        </div>
      `,
      side: 'bottom',
      align: 'center'
    }
  },
  {
    element: '.about-btn',
    popover: {
      title: '❓ 关于项目',
      description: `
        <div class="tour-step">
          <p>点击了解更多项目信息：</p>
          <ul class="tour-list">
            <li>📖 <strong>项目介绍</strong> - 详细的功能说明和优势</li>
            <li>💡 <strong>解决痛点</strong> - 了解我们解决了哪些问题</li>
            <li>🔗 <strong>GitHub链接</strong> - 查看源码，参与贡献</li>
            <li>👨‍💻 <strong>作者信息</strong> - 联系方式和技术交流</li>
          </ul>
          <div class="tour-highlight">
            ⭐ 如果觉得好用，别忘了给项目点个Star支持一下！
          </div>
        </div>
      `,
      side: 'bottom',
      align: 'start'
    }
  },
  {
    element: 'body',
    popover: {
      title: '🎊 引导完成！',
      description: `
        <div class="tour-complete">
          <div class="complete-header">
            <h3>🎉 恭喜！你已经掌握了所有核心功能</h3>
          </div>

          <div class="tour-summary">
            <h4>📚 功能回顾：</h4>
            <div class="summary-grid">
              <div class="summary-item">
                <span class="summary-icon">📝</span>
                <span class="summary-text">Monaco编辑器</span>
              </div>
              <div class="summary-item">
                <span class="summary-icon">👁️</span>
                <span class="summary-text">实时预览</span>
              </div>
              <div class="summary-item">
                <span class="summary-icon">🖱️</span>
                <span class="summary-text">智能交互</span>
              </div>
              <div class="summary-item">
                <span class="summary-icon">📤</span>
                <span class="summary-text">多格式导出</span>
              </div>
            </div>
          </div>

          <div class="tour-tips">
            <h4>💡 使用小贴士：</h4>
            <ul>
              <li>编辑器支持 <kbd>Ctrl+Z</kbd> 撤销操作</li>
              <li>内容会自动保存，下次打开继续编辑</li>
              <li>可以随时点击引导按钮重新学习</li>
            </ul>
          </div>

          <div class="tour-footer">
            <p class="footer-text">🚀 现在开始创建你的第一个精美图表吧！</p>
            <p class="footer-sub">有问题？点击关于按钮查看更多帮助信息</p>
          </div>
        </div>
      `,
      side: 'over',
      align: 'center'
    }
  }
];

/**
 * 本地存储键名常量
 */
const STORAGE_KEYS = {
  TOUR_COMPLETED: 'tour-completed',
  TOUR_VERSION: 'tour-version',
  TOUR_START_TIME: 'tour-start-time',
  TOUR_COMPLETE_TIME: 'tour-complete-time'
}

/**
 * 引导功能管理器
 * 负责管理整个引导流程的初始化、启动、状态管理等
 */
export class TourManager {
  constructor() {
    this.driver = null
    this.config = tourConfig
    this.isFirstVisit = !localStorage.getItem(STORAGE_KEYS.TOUR_COMPLETED)
    this.tourVersion = this.config.version
    this.isInitialized = false
  }

  /**
   * 初始化Driver.js实例
   * @returns {Promise<boolean>} 初始化是否成功
   */
  async initDriver() {
    if (this.isInitialized && this.driver) {
      return true
    }

    // 检查Driver.js是否已加载（新版本API）
    if (typeof window.driver?.js?.driver !== 'function') {
      this.logError('Driver.js未加载或版本不正确', {
        driverExists: typeof window.driver,
        jsExists: typeof window.driver?.js,
        driverFunction: typeof window.driver?.js?.driver
      })
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

      this.isInitialized = true
      this.logInfo('Driver.js初始化成功')
      return true
    } catch (error) {
      this.logError('Driver.js初始化失败', error)
      return false
    }
  }

  /**
   * 统一的日志记录方法
   */
  logInfo(message, data = null) {
    console.log(`[TourManager] ${message}`, data || '')
  }

  logError(message, error = null) {
    console.error(`[TourManager] ${message}`, error || '')
  }

  logWarn(message, data = null) {
    console.warn(`[TourManager] ${message}`, data || '')
  }

  /**
   * 开始引导流程
   * @param {boolean} force 是否强制开始（忽略已完成状态）
   * @returns {Promise<boolean>} 是否成功启动
   */
  async startTour(force = false) {
    const startTime = performance.now();

    try {
      // 如果不是强制开始且已经完成过引导，则不启动
      if (!force && this.hasCompletedTour()) {
        this.logInfo('用户已完成引导，跳过自动引导')
        return false
      }

      // 初始化Driver.js
      const initialized = await this.initDriver()
      if (!initialized) {
        this.logError('无法启动引导：Driver.js初始化失败')
        return false
      }

      // 验证必要的DOM元素是否存在
      const missingElements = this.validateTourElements()
      if (missingElements.length > 0) {
        this.logWarn('部分引导目标元素不存在', missingElements)
        // 可以选择继续或者延迟启动
      }

      // 使用新版本API设置步骤并启动
      this.driver.setSteps(tourSteps)
      this.driver.drive()

      // 记录引导开始
      this.onTourStart()

      const duration = performance.now() - startTime
      this.logInfo(`引导启动成功，耗时: ${duration.toFixed(2)}ms`)
      return true

    } catch (error) {
      this.logError('启动引导失败', error)
      return false
    }
  }

  /**
   * 验证引导目标元素是否存在
   * @returns {string[]} 缺失的元素选择器列表
   */
  validateTourElements() {
    const requiredSelectors = [
      '.editor-container',
      '.preview-content',
      '.copy-dropdown',
      '.download-dropdown',
      '.preview-window-btn',
      '.about-btn'
    ]

    return requiredSelectors.filter(selector => !document.querySelector(selector))
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
   * 安全的localStorage操作
   */
  getStorageItem(key, defaultValue = null) {
    try {
      return localStorage.getItem(key) || defaultValue
    } catch (error) {
      this.logWarn('localStorage读取失败', { key, error })
      return defaultValue
    }
  }

  setStorageItem(key, value) {
    try {
      localStorage.setItem(key, value)
      return true
    } catch (error) {
      this.logWarn('localStorage写入失败', { key, value, error })
      return false
    }
  }

  removeStorageItem(key) {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      this.logWarn('localStorage删除失败', { key, error })
      return false
    }
  }

  /**
   * 检查用户是否已完成引导
   * @returns {boolean}
   */
  hasCompletedTour() {
    const completed = this.getStorageItem(STORAGE_KEYS.TOUR_COMPLETED)
    const version = this.getStorageItem(STORAGE_KEYS.TOUR_VERSION)

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
    const keys = Object.values(STORAGE_KEYS)
    keys.forEach(key => this.removeStorageItem(key))

    this.isFirstVisit = true
    this.logInfo('引导状态已重置')
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
