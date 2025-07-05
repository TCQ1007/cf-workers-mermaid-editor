<template>
  <div class="monaco-editor-wrapper">
    <div ref="editorContainer" class="monaco-editor-container"></div>
    <div v-if="showPlaceholder" class="monaco-placeholder">
      从这里输入 Mermaid 语法内容
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from "vue";

const props = defineProps({
  value: {
    type: String,
    default: "",
  },
  language: {
    type: String,
    default: "mermaid",
  },
  theme: {
    type: String,
    default: "vs",
  },
  options: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["change", "selection-change"]);
    const editorContainer = ref(null);
    const showPlaceholder = ref(true);
    let editor = null;
    let isUpdating = false;

    // 字体大小管理
    const fontSize = ref(14); // 默认字体大小
    const minFontSize = 8;
    const maxFontSize = 32;
    const defaultOptions = {
      automaticLayout: true,
      fontSize: fontSize.value,
      lineNumbers: "on",
      roundedSelection: false,
      scrollBeyondLastLine: false,
      readOnly: false,
      theme: props.theme,
      minimap: {
        enabled: true,
      },
      wordWrap: "on",
      tabSize: 2,
      insertSpaces: true,
      detectIndentation: false,
      formatOnPaste: true,
      formatOnType: true,
      autoIndent: "advanced",
      matchBrackets: "always",
      folding: true,
      foldingStrategy: "indentation",
      selectionHighlight: true,
      occurrencesHighlight: true,
      quickSuggestions: {
        other: true,
        comments: true,
        strings: true,
      },
      parameterHints: {
        enabled: true,
      },
      acceptSuggestionOnEnter: "on",
      scrollbar: {
        vertical: "visible",
        horizontal: "visible",
        useShadows: false,
        verticalHasArrows: false,
        horizontalHasArrows: false,
        verticalScrollbarSize: 10,
        horizontalScrollbarSize: 10,
      },
    };

    // 加载保存的字体大小
    const loadFontSize = () => {
      try {
        const savedFontSize = localStorage.getItem('monaco-editor-font-size');
        if (savedFontSize) {
          const size = parseInt(savedFontSize, 10);
          if (size >= minFontSize && size <= maxFontSize) {
            fontSize.value = size;
          }
        }
      } catch (err) {
        console.warn('Failed to load font size from localStorage:', err);
      }
    };

    // 保存字体大小
    const saveFontSize = () => {
      try {
        localStorage.setItem('monaco-editor-font-size', fontSize.value.toString());
      } catch (err) {
        console.warn('Failed to save font size to localStorage:', err);
      }
    };

    // 调整字体大小
    const adjustFontSize = (delta) => {
      const newSize = fontSize.value + delta;
      if (newSize >= minFontSize && newSize <= maxFontSize) {
        fontSize.value = newSize;
        if (editor) {
          editor.updateOptions({ fontSize: fontSize.value });
        }
        saveFontSize();
      }
    };

    // 鼠标滚轮事件处理
    const handleWheel = (event) => {
      // 只有在按住Ctrl键时才处理
      if (event.ctrlKey) {
        event.preventDefault();
        event.stopPropagation();

        // 根据滚轮方向调整字体大小
        const delta = event.deltaY > 0 ? -1 : 1;
        adjustFontSize(delta);
      }
    };

    const initEditor = async () => {
      if (!editorContainer.value) return;

      // 加载保存的字体大小
      loadFontSize();

      // 等待 Monaco Editor CDN 加载完成
      if (!window.require) {
        console.error("Monaco Editor loader not found");
        return;
      }

      return new Promise((resolve) => {
        window.require.config({
          paths: {
            vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs",
          },
        });

        window.require(["vs/editor/editor.main"], () => {
          const editorOptions = {
            ...defaultOptions,
            ...props.options,
            value: props.value,
            language: props.language,
            fontSize: fontSize.value, // 使用当前字体大小
          };

          editor = window.monaco.editor.create(editorContainer.value, editorOptions);

          editor.onDidChangeModelContent(() => {
            if (!isUpdating) {
              const value = editor.getValue();
              showPlaceholder.value = !value.trim();
              emit("change", value);
            }
          });

          editor.onDidChangeCursorSelection(() => {
            const selection = editor.getSelection();
            if (selection) {
              const selectedText = editor.getModel().getValueInRange(selection);
              emit("selection-change", selectedText);
            }
          });

          setupLanguageFeatures();

          // 初始化占位符状态
          showPlaceholder.value = !props.value.trim();

          const resizeObserver = new ResizeObserver(() => {
            if (editor) {
              editor.layout();
            }
          });
          resizeObserver.observe(editorContainer.value);
          editor._resizeObserver = resizeObserver;

          // 添加鼠标滚轮事件监听器
          const editorDomNode = editor.getDomNode();
          if (editorDomNode) {
            editorDomNode.addEventListener('wheel', handleWheel, { passive: false });
            editor._wheelEventListener = handleWheel;
          }

          resolve();
        });
      });
    };
    const setupLanguageFeatures = () => {
      if (!editor) return;
      const model = editor.getModel();
      if (!model) return;
      model.updateOptions({
        tabSize: 2,
        insertSpaces: true,
      });
      if (props.language === "mermaid") {
        if (
          !window.monaco.languages.getLanguages().find((lang) => lang.id === "mermaid")
        ) {
          window.monaco.languages.register({ id: "mermaid" });
          window.monaco.languages.setMonarchTokensProvider("mermaid", {
            tokenizer: {
              root: [
                [
                  /^(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|gantt|pie|gitgraph|erDiagram|journey|mindmap|timeline|quadrantChart|requirementDiagram|c4Context|c4Container|c4Component|c4Dynamic)\b/,
                  "keyword",
                ],
                [/\b(TD|TB|BT|RL|LR)\b/, "keyword"],
                [/[A-Za-z][A-Za-z0-9_]*(?=\[|\(|\{|\>)/, "variable"],
                [
                  /-->|---|\-\.-\>|\-\.\-|==\>|===|=\.-\>|=\.\=|\-\-\>|\-\-\-/,
                  "operator",
                ],
                [/[[\]{}()<>]/, "delimiter"],
                [/"([^"\\]|\\.)*"/, "string"],
                [/'([^'\\]|\\.)*'/, "string"],
                [/%%.*$/, "comment"],
                [/\d+/, "number"],
                [/classDef\s+\w+/, "type"],
                [/class\s+\w+/, "type"],
                [/fill:|stroke:|stroke-width:|color:/, "attribute.name"],
                [/#[0-9a-fA-F]{3,6}/, "attribute.value"],
                [/[a-zA-Z_]\w*/, "identifier"],
              ],
            },
          });
          window.monaco.languages.setLanguageConfiguration("mermaid", {
            brackets: [
              ["[", "]"],
              ["(", ")"],
              ["{", "}"],
            ],
            autoClosingPairs: [
              { open: "[", close: "]" },
              { open: "(", close: ")" },
              { open: "{", close: "}" },
              { open: '"', close: '"', notIn: ["string"] },
              { open: "'", close: "'", notIn: ["string", "comment"] },
            ],
          });
        }
      }
    };
    watch(
      () => props.value,
      (newValue) => {
        if (editor && editor.getValue() !== newValue) {
          isUpdating = true;
          editor.setValue(newValue);
          isUpdating = false;
        }
        showPlaceholder.value = !newValue.trim();
      }
    );
    onMounted(() => {
      nextTick(initEditor);
    });
    onUnmounted(() => {
      if (editor) {
        // 移除滚轮事件监听器
        const editorDomNode = editor.getDomNode();
        if (editorDomNode && editor._wheelEventListener) {
          editorDomNode.removeEventListener('wheel', editor._wheelEventListener);
        }

        editor.dispose();
        if (editor._resizeObserver) {
          editor._resizeObserver.disconnect();
        }
      }
    });

</script>

<style scoped>
.monaco-editor-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.monaco-editor-container {
  width: 100%;
  height: 100%;
  min-height: 400px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background: #fafbfc;
  box-sizing: border-box;
}

.monaco-placeholder {
  position: absolute;
  top: 20px;
  left: 65px;
  color: #999;
  font-size: 14px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  pointer-events: none;
  z-index: 1;
  opacity: 0.6;
  user-select: none;
}
</style>
 