<template>
  <div class="monaco-editor-wrapper">
    <div ref="editorContainer" class="monaco-editor-container"></div>
    <div v-if="showPlaceholder" class="monaco-placeholder">
      从这里输入 Mermaid 语法内容
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch, nextTick } from "vue";

export default {
  name: "MonacoEditor",
  props: {
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
  },
  emits: ["change", "selection-change"],
  setup(props, { emit }) {
    const editorContainer = ref(null);
    const showPlaceholder = ref(true);
    let editor = null;
    let isUpdating = false;
    const defaultOptions = {
      automaticLayout: true,
      fontSize: 14,
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
    const initEditor = async () => {
      if (!editorContainer.value) return;

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
        editor.dispose();
        if (editor._resizeObserver) {
          editor._resizeObserver.disconnect();
        }
      }
    });
    return {
      editorContainer,
      showPlaceholder,
    };
  },
};
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
