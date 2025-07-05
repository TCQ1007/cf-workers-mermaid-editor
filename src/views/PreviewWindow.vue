<template>
  <div class="preview-window">
    <div class="header">
      <div class="title">📊 Mermaid 图表预览</div>
      <div class="controls">
        <button @click="refreshPreview" class="btn">🔄 刷新</button>
        <button @click="copyChart" class="btn">📋 复制</button>
        <button @click="downloadChart" class="btn">💾 下载</button>
      </div>
    </div>

    <div class="preview-container">
      <div v-if="!hasParentWindow && !mermaidCode" class="no-parent-notice">
        <div class="notice-content">
          <h2>📝 欢迎使用 Mermaid 图表预览</h2>
          <p>当前预览窗口没有连接到编辑器。</p>
          <p>请前往编辑页面创建或编辑您的 Mermaid 图表。</p>
          <button @click="goToEditor" class="btn btn-primary">🚀 前往编辑器</button>
        </div>
      </div>
      <div v-else class="mermaid-content">
        <MermaidRenderer :content="mermaidCode" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import MermaidRenderer from "../components/MermaidRenderer.vue";

const mermaidCode = ref("");
const hasParentWindow = ref(false);

// 监听来自父窗口的消息
const handleMessage = (event) => {
  if (event.data && event.data.type === "updateMermaid") {
    mermaidCode.value = event.data.code;
  }
};

// 刷新预览
const refreshPreview = () => {
  if (window.opener && !window.opener.closed) {
    try {
      const editorCode = window.opener.getEditorCode();
      if (editorCode) {
        mermaidCode.value = editorCode;
      }
    } catch (err) {
      console.log("无法获取编辑器代码");
    }
  }
};

// 复制图表
const copyChart = async () => {
  try {
    const svgElement = document.querySelector(".mermaid-content svg");
    if (!svgElement) {
      alert("未找到图表");
      return;
    }

    const svgData = new XMLSerializer().serializeToString(svgElement);
    await navigator.clipboard.writeText(svgData);
    alert("SVG代码已复制到剪贴板");
  } catch (err) {
    alert("复制失败");
  }
};

// 下载图表
const downloadChart = () => {
  try {
    const svgElement = document.querySelector(".mermaid-content svg");
    if (!svgElement) {
      alert("未找到图表");
      return;
    }

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mermaid-chart.svg";
    a.click();
    URL.revokeObjectURL(url);
  } catch (err) {
    alert("下载失败");
  }
};

// 跳转到编辑器
const goToEditor = () => {
  window.location.href = window.location.origin;
};

onMounted(() => {
  // 监听来自父窗口的消息
  window.addEventListener("message", handleMessage);

  // 检查是否有父窗口
  hasParentWindow.value = !!(window.opener && !window.opener.closed);

  // 使用默认代码，等待父窗口通过postMessage发送实际代码

  // 通知父窗口预览窗口已准备就绪
  if (hasParentWindow.value) {
    window.opener.postMessage({ type: "previewWindowReady" }, "*");
  }
});

onUnmounted(() => {
  window.removeEventListener("message", handleMessage);

  // 通知父窗口预览窗口即将关闭（仅当初始化时有父窗口）
  if (hasParentWindow.value) {
    try {
      window.opener?.postMessage({ type: "previewWindowClosed" }, "*");
    } catch (err) {
      // 忽略通信错误
    }
  }
});
</script>

<style scoped>
.preview-window {
  height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue",
    Arial, sans-serif;
  background: #f8f9fa;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 1.5rem;
  font-weight: 600;
}

.controls {
  display: flex;
  gap: 10px;
}

.btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s;
}

.btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.preview-container {
  flex: 1;
  padding: 20px;
  overflow: auto;
}

.mermaid-content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  min-height: 400px;
  padding: 20px;
}

.no-parent-notice {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.notice-content {
  text-align: center;
  padding: 3rem;
  max-width: 500px;
}

.notice-content h2 {
  color: #333;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
}

.notice-content p {
  color: #666;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  line-height: 1.6;
}

.notice-content .btn {
  margin-top: 1.5rem;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;
  display: inline-block;
}

.notice-content .btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}
</style>
