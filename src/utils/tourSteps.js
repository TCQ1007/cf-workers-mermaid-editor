// 引导步骤配置（新版Driver.js格式）
export const tourSteps = [
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
      position: 'bottom'
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
      position: 'bottom'
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
]
