<template>
  <div class="code-box">
    <!-- 顶部状态栏 -->
    <div class="mac-header">
      <div class="dots">
        <span class="mac-dot red"></span>
        <span class="mac-dot yellow"></span>
        <span class="mac-dot green"></span>
      </div>
      <span class="file-name" v-if="fileName">{{ fileName }}</span>

      <!-- 复制按钮：使用 el-button + el-icon -->
      <el-button
        v-if="isSupported"
        class="copy-btn"
        :type="copied ? 'success' : 'primary'"
        link
        @click="copy(rawCode)"
      >
        <template #icon>
          <el-icon>
            <Check v-if="copied" />
            <CopyDocument v-else />
          </el-icon>
        </template>
        {{ copied ? "已复制" : "复制" }}
      </el-button>
    </div>

    <!-- 代码包裹容器：负责统一滚动 -->
    <div class="code-wrapper">
      <!-- 左侧行号列 -->
      <div class="line-numbers-col">
        <span v-for="n in lineCount" :key="n">{{ n }}</span>
      </div>

      <!-- 右侧代码列 -->
      <pre
        class="code-content"
        v-html="`<code class='hljs'>${highlightedCode}</code>`"
      ></pre>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";
import { useClipboard } from "@vueuse/core";

const props = defineProps({
  fileName: {
    type: String,
    default: "index.vue",
  },
  rawCode: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    default: "html",
  },
});

// 1. 复制逻辑
const { copy, copied, isSupported } = useClipboard({
  legacy: true,
});

// 2. 行数计算
const lineCount = computed(() => {
  const lines = props.rawCode.split("\n");
  // 如果最后一行是空的则不计数，保证与编辑器行号一致
  return lines[lines.length - 1] === "" ? lines.length - 1 || 1 : lines.length;
});

// 3. 高亮渲染
const highlightedCode = computed(() => {
  try {
    if (props.language && hljs.getLanguage(props.language)) {
      return hljs.highlight(props.rawCode, { language: props.language }).value;
    }
    return hljs.highlightAuto(props.rawCode).value;
  } catch (e) {
    return props.rawCode;
  }
});
</script>

<style scoped lang="scss">
$code-bg: #1e1e1e;
$header-bg: #2d2d2d;
$line-num-color: #5c6370;

.code-box {
  height: 100%;
  width: 100%;
  background-color: $code-bg;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  & ::-webkit-scrollbar {
    width: 14px;
    height: 14px;
  }
  & ::-webkit-scrollbar-track {
    background-color: transparent;
  }
  & ::-webkit-scrollbar-thumb {
    background-color: #444;
    border-radius: 7px;
    border: 4px solid $code-bg;
    &:hover {
      background-color: #555;
    }
  }
  & ::-webkit-scrollbar-corner {
    background-color: transparent;
  }

  .mac-header {
    height: 30px;
    flex-shrink: 0;
    background-color: $header-bg;
    display: flex;
    align-items: center;
    padding: 0 15px;
    z-index: 10;
    position: relative;

    .dots {
      display: flex;
      gap: 8px;
    }

    .mac-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      &.red {
        background-color: #ff5f56;
      }
      &.yellow {
        background-color: #ffbd2e;
      }
      &.green {
        background-color: #27c93f;
      }
    }

    .file-name {
      margin-left: 10px;
      color: #858585;
      font-size: 12px;
      font-family: Consolas, Monaco, monospace;
    }

    .copy-btn {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      font-family: Consolas, monospace;
      font-size: 12px;
      transition: color 0.2s;
    }
  }

  /* --- 代码包裹容器 --- */
  .code-wrapper {
    flex: 1;
    display: flex;
    overflow: auto;
    min-height: 0;
    position: relative;
  }

  /* --- 左侧行号 --- */
  .line-numbers-col {
    position: sticky;
    left: 0;
    z-index: 5;
    padding: 15px 0;
    width: 42px;
    background-color: $code-bg;
    display: flex;
    flex-direction: column;
    text-align: right;
    border-right: 1px solid #333;
    user-select: none;

    span {
      padding: 0 10px;
      color: $line-num-color;
      font-family: "Consolas", "Courier New", monospace;
      font-size: 14px;
      line-height: 1.5;
    }
  }

  .code-content {
    margin: 0;
    padding: 15px;
    flex: 1;
    min-width: 0;
    overflow: visible;

    :deep(code.hljs) {
      font-family: "Consolas", "Courier New", monospace;
      font-size: 14px;
      line-height: 1.5;
      display: block;
      background: transparent;
      padding: 0;
      overflow: visible;
    }
  }
}
</style>
