<template>
  <div class="app-container home">
    <div class="mind-map" ref="jsmindContainerRef"></div>
    <div class="legend">
      <span class="legend-title">图例：</span>
      <span class="legend-item">
        <span class="legend-color done"></span>
        <span class="legend-text">已完成</span>
      </span>
      <span class="legend-item">
        <span class="legend-color in-progress"></span>
        <span class="legend-text">进行中</span>
      </span>
      <span class="legend-item">
        <span class="legend-color pending"></span>
        <span class="legend-text">待办</span>
      </span>
    </div>
  </div>
</template>

<script setup name="Index">
import "jsmind/style/jsmind.css";
import jsMind from "jsmind";
import { STATUS, JS_MIND_DATA, buildHandlers } from "./indexMenu.js";
import { useRouter } from "vue-router";

const router = useRouter();

const jsmindContainerRef = ref(null);

let jm = null;

onMounted(() => {
  const JsMind = jsMind.default || jsMind;
  const options = {
    container: jsmindContainerRef.value,
    theme: "primary",
    editable: false,
    support_html: true,
    view: {
      custom_node_render: (jm, ele, node) => {
        ele.setAttribute("title", node.topic);
        if (node.data?.clickable) {
          ele.style.cursor = "pointer";
        } else {
          ele.style.pointerEvents = "none";
        }
      },
    },
  };
  jm = new JsMind(options);
  jm.show(JS_MIND_DATA);

  jm.add_event_listener((type, data) => {
    if (type !== JsMind.event_type.select) return;
    const handlers = buildHandlers(router);
    if (handlers[data.node]) {
      handlers[data.node]();
    }
  });
});

onUnmounted(() => {
  if (jm) {
    jm = null;
  }
});
</script>
<style scoped lang="scss">
.home {
  height: 100%;
  padding: 0;
  position: relative;
  overflow: hidden;

  .mind-map {
    height: 100%;
    padding: 0;
    box-sizing: border-box;
    overflow: auto;
    background-color: #f2f3f5;
    scrollbar-width: auto;
    scrollbar-color: #c0c4cc #f5f7fa;

    &::-webkit-scrollbar {
      width: 12px;
      height: 12px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #c0c4cc;
      border-radius: 6px;

      &:hover {
        background-color: #909399;
      }
    }

    &::-webkit-scrollbar-track {
      background-color: #f5f7fa;
      border-radius: 6px;
    }
  }

  .legend {
    position: absolute;
    top: 20px;
    left: 20px;
    background-color: #fff;
    border-radius: 8px;
    padding: 12px 16px;
    box-shadow: var(--el-box-shadow-dark);
    z-index: 100;
    display: flex;
    align-items: center;
    gap: 12px;

    .legend-title {
      font-weight: bold;
      color: #606266;
      font-size: 14px;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 4px;

      .legend-color {
        width: 16px;
        height: 16px;
        border-radius: 4px;

        &.done {
          background-color: v-bind("STATUS.DONE");
        }

        &.in-progress {
          background-color: v-bind("STATUS.IN_PROGRESS");
        }

        &.pending {
          background-color: v-bind("STATUS.PENDING");
        }
      }

      .legend-text {
        font-size: 13px;
        color: #606266;
      }
    }
  }
}
</style>
