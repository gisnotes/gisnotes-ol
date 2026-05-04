<template>
  <div class="app-container home" ref="jsmindContainerRef"></div>
</template>

<script setup name="Index">
import "jsmind/style/jsmind.css";
import jsMind from "jsmind";
import { useRouter } from "vue-router";
import { ElMessageBox, ElMessage } from "element-plus";

const router = useRouter();
const jsmindContainerRef = ref(null);

const STATUS = {
  DONE: undefined, // 已完成背景色为默认即可
  IN_PROGRESS: "#009B77",
  PENDING: "#909399",
};

const PROJECTION_NODES = [
  {
    id: "projection1",
    topic: "COG with automatic Projection Lookup",
    status: STATUS.DONE,
    route: "/projection/autoProjection",
    children: [
      {
        id: "projection1-1",
        topic: "Openlayers 之不同坐标系下 COG 影像的自动叠加",
        externalLink: "https://mp.weixin.qq.com/s/yl2sYCgm0MtfqrtKorWdAA",
      },
      {
        id: "projection1-2",
        topic: "处理 GeoTIFF 数据为 COG 并完成数据加载",
        externalLink: "https://mp.weixin.qq.com/s/HesBAG6Rk97YvvcpCcX_jA",
      },
    ],
  },
  {
    id: "projection2",
    topic: "Projection and Scale",
    status: STATUS.IN_PROGRESS,
  },
  {
    id: "projection3",
    topic: "WMS without Projection",
    status: STATUS.PENDING,
  },
  {
    id: "projection4",
    topic: "Equal Earth projection with dynamic center meridian",
    status: STATUS.PENDING,
  },
  {
    id: "projection5",
    topic: "Reprojection with coordinate system search",
    status: STATUS.PENDING,
  },
  {
    id: "projection6",
    topic: "COG with ModelTransformation",
    status: STATUS.PENDING,
  },
  { id: "projection7", topic: "Custom Tiled WMS", status: STATUS.PENDING },
  { id: "projection8", topic: "GeoTIFF Reprojection", status: STATUS.PENDING },
  { id: "projection9", topic: "Image Reprojection", status: STATUS.PENDING },
  { id: "projection10", topic: "Multiple COG sources", status: STATUS.PENDING },
  {
    id: "projection11",
    topic: "OpenStreetMap Reprojection",
    status: STATUS.PENDING,
  },
  {
    id: "projection12",
    topic: "OpenStreetMap Reprojection with ScaleLine Control",
    status: STATUS.PENDING,
  },
  { id: "projection13", topic: "Raster Reprojection", status: STATUS.PENDING },
  {
    id: "projection14",
    topic: "Single Image WMS with Proj4js",
    status: STATUS.PENDING,
  },
  { id: "projection15", topic: "Sphere Mollweide", status: STATUS.PENDING },
  {
    id: "projection16",
    topic: "Vector tiles reprojected",
    status: STATUS.PENDING,
  },
  { id: "projection17", topic: "Zoomify", status: STATUS.PENDING },
];

function buildMindData() {
  return {
    meta: { name: "Openalyers示例归类", author: "gisnotes", version: "1.0" },
    format: "node_tree",
    data: {
      id: "root",
      topic: "Openalyers示例归类",
      children: [
        {
          id: "projection",
          topic: "投影",
          children: PROJECTION_NODES.map((n) => ({
            ...n,
            "background-color": n.status,
            clickable: n.status === STATUS.DONE,
            children: n.children?.map((c) => ({ ...c, clickable: true })),
          })),
        },
      ],
    },
  };
}

function buildHandlers() {
  const handlers = {};
  for (const n of PROJECTION_NODES) {
    if (n.route) handlers[n.id] = () => router.push(n.route);
    if (n.children) {
      for (const c of n.children) {
        if (c.externalLink)
          handlers[c.id] = () => openExternalLink(c.externalLink);
      }
    }
  }
  return handlers;
}

let jm = null;

function openExternalLink(url) {
  ElMessageBox.confirm("是否打开外部链接？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "info",
  })
    .then(() => {
      window.open(url, "_blank");
    })
    .catch(() => {
      ElMessage.warning("取消打开外部链接");
    });
}

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
  jm.show(buildMindData());

  jm.add_event_listener((type, data) => {
    if (type !== JsMind.event_type.select) return;
    const handlers = buildHandlers();
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
  box-sizing: border-box;
  overflow: auto;

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

  scrollbar-width: auto;
  scrollbar-color: #c0c4cc #f5f7fa;
}
</style>
