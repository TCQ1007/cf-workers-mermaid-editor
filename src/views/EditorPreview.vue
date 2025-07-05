<template>
  <div id="app">
    <div class="header">
      <div class="header-left">
        <h1>📊 Mermaid 图表编辑器</h1>
        <span class="subtitle">专业的 Mermaid 语法编辑器</span>
      </div>
      <div class="toolbar">
        <button @click="openPreviewWindow" class="btn btn-primary preview-window-btn">🪟 新窗口预览</button>
        <GitHubCorner href="https://github.com/TCQ1007/cf-workers-mermaid-editor" />
      </div>
    </div>
    <div class="content" :class="{ 'split-view': showPreview }">
      <div
        class="editor-section"
        :style="{ width: showPreview ? `${editorWidth}%` : '100%' }"
      >
        <div class="section-header">
          <h3>Mermaid 语法编辑器</h3>
          <div class="editor-controls">
            <div class="editor-buttons">
              <button @click="copyToClipboard" class="btn btn-small">
                📋 {{ copyStatus }}
              </button>
              <button @click="clearEditor" class="btn btn-small" :disabled="!code.trim()">
                🗑️ 清空
              </button>
            </div>
            <div class="editor-stats">
              <span>字符: {{ code.length }}</span>
              <span>行数: {{ lineCount }}</span>
              <span v-if="selectedText">选中: {{ selectedText.length }}</span>
            </div>
          </div>
        </div>
        <div class="editor-container">
          <MonacoEditor
            ref="editorRef"
            :value="code"
            :language="selectedLanguage"
            @change="handleCodeChange"
            @selection-change="handleSelectionChange"
          />
        </div>
      </div>
      <div v-if="showPreview" class="resize-handle" @mousedown="startResize"></div>
      <div v-if="!showPreview" class="expand-button" @click="togglePreview">
        <span class="icon">👁️</span>
        <span class="expand-text">展开预览</span>
      </div>
      <div
        v-if="showPreview"
        class="preview-section"
        :style="{ width: `${100 - editorWidth}%` }"
      >
        <div class="section-header">
          <h3>图表预览</h3>
          <div class="preview-controls">
            <button @click="copyChartAsImage" class="btn btn-small">📋 复制图表</button>
            <button @click="togglePreview" class="btn btn-small">
              <span class="icon">👁️‍🗨️</span>
              收起
            </button>
          </div>
        </div>
        <div class="preview-container">
          <div class="preview-content">
            <MermaidRenderer :content="code" />
          </div>
        </div>
      </div>
    </div>
    <div class="status-bar">
      <div class="status-left">
        <span>MERMAID</span>
        <span v-if="lastSaved">最后保存: {{ lastSaved }}</span>
      </div>
      <div class="status-right">
        <span @click="showAbout = true" title="About">Info</span>
        <span>Tab: 2 空格</span>
        <span>UTF-8</span>
      </div>
    </div>
    <AboutModal v-if="showAbout" @close="showAbout = false" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import MonacoEditor from "../components/MonacoEditor.vue";
import MermaidRenderer from "../components/MermaidRenderer.vue";
import AboutModal from "../components/AboutModal.vue";
import GitHubCorner from "../components/GitHubCorner.vue";

const editorRef = ref(null);
const code = ref("");
const selectedLanguage = ref("mermaid");
const showPreview = ref(true);
const copyStatus = ref("复制");
const selectedText = ref("");
const lastSaved = ref("");
const editorWidth = ref(40); // 默认40%宽度
const isResizing = ref(false);
const previewWindow = ref(null);
const previewWindowCheckInterval = ref(null);
const lineCount = computed(() => code.value.split("\n").length);
const handleCodeChange = (newCode) => {
  code.value = newCode;
  saveToLocalStorage();

  // 实时同步到预览窗口
  if (previewWindow.value && !previewWindow.value.closed) {
    previewWindow.value.postMessage(
      {
        type: "updateMermaid",
        code: newCode,
      },
      "*"
    );
  }
};
const handleSelectionChange = (selection) => {
  selectedText.value = selection;
};
const togglePreview = () => {
  showPreview.value = !showPreview.value;
  localStorage.setItem("showPreview", JSON.stringify(showPreview.value));
};
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(code.value);
    copyStatus.value = "已复制!";
    setTimeout(() => {
      copyStatus.value = "复制";
    }, 2000);
  } catch (err) {
    const textArea = document.createElement("textarea");
    textArea.value = code.value;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand("copy");
      copyStatus.value = "已复制!";
      setTimeout(() => {
        copyStatus.value = "复制";
      }, 2000);
    } catch (fallbackErr) {
      copyStatus.value = "复制失败";
      setTimeout(() => {
        copyStatus.value = "复制";
      }, 2000);
    }
    document.body.removeChild(textArea);
  }
};
const copyChartAsImage = async () => {
  try {
    const svgElement = document.querySelector(".preview-content svg");
    if (!svgElement) {
      alert("未找到图表，请确保图表已正确渲染");
      return;
    }

    // 直接将SVG转换为PNG，使用现代浏览器的方法
    try {
      // 获取SVG的完整HTML
      const svgData = new XMLSerializer().serializeToString(svgElement);

      // 创建一个包含SVG的完整HTML文档
      const svgWithStyles = `
        <svg xmlns="http://www.w3.org/2000/svg" 
             width="${
               svgElement.getAttribute("width") ||
               svgElement.viewBox?.baseVal?.width ||
               800
             }" 
             height="${
               svgElement.getAttribute("height") ||
               svgElement.viewBox?.baseVal?.height ||
               600
             }"
             style="background: white; font-family: Arial, sans-serif;">
          ${svgElement.innerHTML}
        </svg>
      `;

      // 创建blob
      const blob = new Blob([svgWithStyles], { type: "image/svg+xml" });

      // 尝试复制到剪贴板
      if (navigator.clipboard && window.ClipboardItem) {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({
              "image/svg+xml": blob,
            }),
          ]);
          alert("图表已复制为SVG到剪贴板");
          return;
        } catch (clipboardErr) {
          console.log("SVG复制失败，尝试PNG方式");
        }
      }

      // 如果SVG复制失败，尝试PNG方式
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "mermaid-chart.svg";
      a.click();
      URL.revokeObjectURL(url);
      alert("图表已下载为SVG文件");
    } catch (err) {
      console.error("SVG处理失败:", err);

      // 备用方案：直接复制SVG代码
      try {
        const svgCode = new XMLSerializer().serializeToString(svgElement);
        await navigator.clipboard.writeText(svgCode);
        alert("SVG代码已复制到剪贴板");
      } catch (textErr) {
        alert("图表复制失败，请手动保存");
      }
    }
  } catch (err) {
    console.error("复制图表失败:", err);
    alert("复制图表失败");
  }
};
const clearEditor = () => {
  if (confirm("确定要清空编辑器内容吗？")) {
    code.value = "";
    saveToLocalStorage();
  }
};
const saveToLocalStorage = () => {
  const data = {
    code: code.value,
    timestamp: new Date().toISOString(),
  };
  localStorage.setItem("mermaidEditorData", JSON.stringify(data));
  lastSaved.value = new Date().toLocaleTimeString();
};
const startResize = (e) => {
  isResizing.value = true;
  const startX = e.clientX;
  const startWidth = editorWidth.value;
  const containerWidth = document.querySelector(".content").offsetWidth;

  const onMouseMove = (e) => {
    if (!isResizing.value) return;

    const deltaX = e.clientX - startX;
    const deltaPercent = (deltaX / containerWidth) * 100;
    let newWidth = startWidth + deltaPercent;

    // 限制最小和最大宽度
    newWidth = Math.max(20, Math.min(80, newWidth));
    editorWidth.value = newWidth;

    // 保存到localStorage
    localStorage.setItem("editorWidth", newWidth.toString());
  };

  const onMouseUp = () => {
    isResizing.value = false;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
    document.body.style.cursor = "default";
    document.body.style.userSelect = "auto";
  };

  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
  document.body.style.cursor = "col-resize";
  document.body.style.userSelect = "none";
};

const loadFromLocalStorage = () => {
  try {
    const saved = localStorage.getItem("mermaidEditorData");
    if (saved) {
      const data = JSON.parse(saved);
      code.value = data.code || "";
      lastSaved.value = data.timestamp
        ? new Date(data.timestamp).toLocaleTimeString()
        : "";
    }
    const savedPreview = localStorage.getItem("showPreview");
    if (savedPreview) {
      showPreview.value = JSON.parse(savedPreview);
    }
    const savedWidth = localStorage.getItem("editorWidth");
    if (savedWidth) {
      editorWidth.value = parseFloat(savedWidth);
    }
  } catch (err) {
    console.error("Failed to load from localStorage:", err);
  }
};
let autoSaveTimer = null;
const startAutoSave = () => {
  autoSaveTimer = setInterval(() => {
    if (code.value.trim()) {
      saveToLocalStorage();
    }
  }, 30000);
};

// 新窗口预览功能
const openPreviewWindow = () => {
  // 如果已经有预览窗口，先关闭它
  if (previewWindow.value && !previewWindow.value.closed) {
    previewWindow.value.close();
  }

  // 构建预览URL，不传递代码参数
  const baseUrl = window.location.origin;
  const previewUrl = baseUrl + "/preview";

  // 创建新窗口，使用预览路由
  const windowFeatures =
    "width=1200,height=800,scrollbars=yes,resizable=yes,menubar=no,toolbar=no,location=no,status=no";
  previewWindow.value = window.open(previewUrl, "MermaidPreview", windowFeatures);

  if (!previewWindow.value) {
    alert("无法打开新窗口，请检查浏览器弹窗设置");
    return;
  }

  // 自动收起编辑页面的预览区域
  showPreview.value = false;

  // 监听窗口关闭
  startPreviewWindowCheck();
};

const startPreviewWindowCheck = () => {
  if (previewWindowCheckInterval.value) {
    clearInterval(previewWindowCheckInterval.value);
  }

  previewWindowCheckInterval.value = setInterval(() => {
    if (previewWindow.value && previewWindow.value.closed) {
      clearInterval(previewWindowCheckInterval.value);
      previewWindow.value = null;
    }
  }, 1000);
};

// 提供给预览窗口获取当前代码的方法
window.getEditorCode = () => {
  return code.value;
};
onMounted(() => {
  loadFromLocalStorage();
  startAutoSave();
  // 监听来自预览窗口的消息
  window.addEventListener("message", handlePreviewWindowMessage);
});

onUnmounted(() => {
  if (autoSaveTimer) {
    clearInterval(autoSaveTimer);
  }
  if (previewWindowCheckInterval.value) {
    clearInterval(previewWindowCheckInterval.value);
  }
  if (previewWindow.value && !previewWindow.value.closed) {
    previewWindow.value.close();
  }
  window.removeEventListener("message", handlePreviewWindowMessage);
});

const handlePreviewWindowMessage = (event) => {
  if (event.data && event.data.type === "previewWindowClosed") {
    if (previewWindowCheckInterval.value) {
      clearInterval(previewWindowCheckInterval.value);
    }
    previewWindow.value = null;
  } else if (event.data && event.data.type === "previewWindowReady") {
    // 预览窗口准备就绪，发送当前代码
    if (previewWindow.value && !previewWindow.value.closed) {
      previewWindow.value.postMessage(
        {
          type: "updateMermaid",
          code: code.value,
        },
        "*"
      );
    }
  }
};
const showAbout = ref(false);

onMounted(() => {
  if (!localStorage.getItem("aboutModalShown")) {
    showAbout.value = true;
    localStorage.setItem("aboutModalShown", "1");
  }
});
</script>

<style>
/* 全局样式 - 不使用 scoped，因为需要应用到 #app */
#app {
  height: 100vh !important;
  width: 100vw !important;
  display: flex !important;
  flex-direction: column !important;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue",
    Arial, sans-serif;
  background: #f8f9fa;
  margin: 0 !important;
  padding: 0 !important;
  box-sizing: border-box !important;
  max-width: none !important;
}

/* 重置 body 和 html 的默认样式 */
html,
body {
  margin: 0 !important;
  padding: 0 !important;
  height: 100% !important;
  width: 100% !important;
  overflow: hidden !important;
  box-sizing: border-box !important;
}

.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 44px;
  padding: 0 1.5rem;
  background: #fff;
  border-bottom: 1px solid #e0e0e0;
}
.top-bar-right {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}
.github-link {
  color: #24292f;
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  transition: color 0.2s;
}
.github-link:hover {
  color: #0366d6;
}
.github-link-fixed {
  position: fixed;
  top: 16px;
  right: 24px;
  z-index: 1002;
  color: #24292f;
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  padding: 4px;
  transition: color 0.2s, box-shadow 0.2s;
}
.github-link-fixed:hover {
  color: #0366d6;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}
</style>

<style scoped>
/* 顶部工具栏 - 紧凑设计 */
.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.5rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  min-height: 48px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-left h1 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  white-space: nowrap;
}

.subtitle {
  font-size: 0.8rem;
  opacity: 0.8;
  white-space: nowrap;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.preview-window-btn {
  margin-right: 56px;
}

.toolbar-group {
  display: flex;
  gap: 0.4rem;
  align-items: center;
}

/* 按钮样式 - 紧凑设计 */
.btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: #28a745;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #218838;
  transform: translateY(-1px);
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #5a6268;
  transform: translateY(-1px);
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #c82333;
  transform: translateY(-1px);
}

.btn-small {
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
  height: 28px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
}

.icon {
  font-size: 0.9rem;
}

/* 主要内容区域 */
.content {
  flex: 1;
  display: flex;
  overflow: hidden;
  gap: 1px;
  background: #e9ecef;
}

/* 移除固定宽度，改为动态宽度 */

.editor-section,
.preview-section {
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 8px 8px 0 0;
  overflow: hidden;
}

.editor-section {
  flex-shrink: 0;
}

/* 拖拽分割条 */
.resize-handle {
  width: 4px;
  background: #e9ecef;
  cursor: col-resize;
  position: relative;
  flex-shrink: 0;
  transition: background-color 0.2s;
}

.resize-handle:hover {
  background: #6c757d;
}

.resize-handle::before {
  content: "";
  position: absolute;
  left: -2px;
  right: -2px;
  top: 0;
  bottom: 0;
  background: transparent;
}

/* 展开按钮 */
.expand-button {
  width: 40px;
  background: #f8f9fa;
  border-left: 1px solid #e9ecef;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
  position: fixed;
  right: 0;
  top: 48px;
  bottom: 32px;
  z-index: 100;
}

.expand-button:hover {
  background: #e9ecef;
  width: 120px;
}

.expand-button .icon {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  transition: transform 0.3s ease;
}

.expand-button:hover .icon {
  transform: scale(1.1);
}

.expand-text {
  font-size: 0.75rem;
  color: #6c757d;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  opacity: 0;
  transition: opacity 0.3s ease;
  white-space: nowrap;
}

.expand-button:hover .expand-text {
  opacity: 1;
  writing-mode: horizontal-tb;
  text-orientation: initial;
}

.section-header {
  padding: 0.6rem 1rem;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 48px;
  height: 48px;
  box-sizing: border-box;
}

.section-header h3 {
  margin: 0;
  font-size: 1rem;
  color: #495057;
  font-weight: 600;
}

.editor-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.editor-buttons {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.editor-stats {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  color: #6c757d;
}

.editor-stats span {
  padding: 0.25rem 0.5rem;
  background: #e9ecef;
  border-radius: 4px;
}

.preview-controls {
  display: flex;
  gap: 0.5rem;
}

.editor-container {
  flex: 1;
  overflow: hidden;
}

.preview-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fafafa;
}

.preview-content {
  flex: 1;
  padding: 1.5rem;
  overflow: auto;
  background: white;
  line-height: 1.6;
}

/* 底部状态栏 - 紧凑设计 */
.status-bar {
  background: #343a40;
  color: #adb5bd;
  padding: 0.3rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  min-height: 28px;
}

.status-left,
.status-right {
  display: flex;
  gap: 0.75rem;
}

.status-left span,
.status-right span {
  padding: 0.15rem 0.4rem;
  background: #495057;
  border-radius: 3px;
  font-size: 0.7rem;
}

.status-right {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}
.status-info {
  display: inline-flex;
  align-items: center;
  height: 28px;
  min-width: 48px;
  padding: 0 12px;
  font-size: inherit;
  font-family: inherit;
  color: inherit;
  background: inherit;
  border: none;
  border-radius: 4px;
  box-sizing: border-box;
  user-select: none;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.status-info:hover {
  background: #e9ecef;
  color: #333;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }

  .toolbar {
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .toolbar-group {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }

  .content.split-view {
    flex-direction: column;
  }

  .content.split-view .editor-section,
  .content.split-view .preview-section {
    width: 100%;
    height: 50%;
  }

  .editor-stats {
    flex-direction: column;
    gap: 0.5rem;
  }

  .status-bar {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .header-left h1 {
    font-size: 1.2rem;
  }

  .subtitle {
    font-size: 0.8rem;
  }

  .section-header {
    padding: 0.75rem 1rem;
  }

  .preview-content {
    padding: 1rem;
  }

  .btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }
}

/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.editor-section,
.preview-section {
  animation: fadeIn 0.3s ease-out;
}

/* 滚动条样式 */
.preview-content::-webkit-scrollbar {
  width: 8px;
}

.preview-content::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.preview-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.preview-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
 