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

const mind = {
  meta: {
    name: "Openalyers示例归类",
    author: "gisnotes",
    version: "1.0",
  },
  format: "node_tree",
  data: {
    id: "root",
    topic: "Openalyers示例归类",
    children: [
      {
        id: "projection",
        topic: "投影",
        children: [
          {
            id: "projection1",
            topic: "COG with automatic Projection Lookup",
            clickable: true,
            children: [
              {
                id: "projection1-1",
                topic: "Openlayers 之不同坐标系下 COG 影像的自动叠加",
                clickable: true,
              },
              {
                id: "projection1-2",
                topic: "处理 GeoTIFF 数据为 COG 并完成数据加载",
                clickable: true,
              },
            ],
          },
          {
            id: "projection2",
            topic: "Projection and Scale",
            "background-color": "#009B77",
          },
          {
            id: "projection3",
            topic: "WMS without Projection",
            "background-color": "#909399",
          },
          {
            id: "projection4",
            topic: "Equal Earth projection with dynamic center meridian",
            "background-color": "#909399",
          },
          {
            id: "projection5",
            topic: "Reprojection with coordinate system search",
            "background-color": "#909399",
          },
          {
            id: "projection6",
            topic: "COG with ModelTransformation",
            "background-color": "#909399",
          },
          {
            id: "projection7",
            topic: "Custom Tiled WMS",
            "background-color": "#909399",
          },
          {
            id: "projection8",
            topic: "GeoTIFF Reprojection",
            "background-color": "#909399",
          },
          {
            id: "projection9",
            topic: "Image Reprojection",
            "background-color": "#909399",
          },
          {
            id: "projection10",
            topic: "Multiple COG sources",
            "background-color": "#909399",
          },
          {
            id: "projection11",
            topic: "OpenStreetMap Reprojection",
            "background-color": "#909399",
          },
          {
            id: "projection12",
            topic: "OpenStreetMap Reprojection with ScaleLine Control",
            "background-color": "#909399",
          },
          {
            id: "projection13",
            topic: "Raster Reprojection",
            "background-color": "#909399",
          },
          {
            id: "projection14",
            topic: "Single Image WMS with Proj4js",
            "background-color": "#909399",
          },
          {
            id: "projection15",
            topic: "Sphere Mollweide",
            "background-color": "#909399",
          },
          {
            id: "projection16",
            topic: "Vector tiles reprojected",
            "background-color": "#909399",
          },
          {
            id: "projection17",
            topic: "Zoomify",
            "background-color": "#909399",
          },
        ],
      },
    ],
  },
};

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
  jm.show(mind);

  jm.add_event_listener((type, data) => {
    if (type !== JsMind.event_type.select) return;
    const id = data.node;
    const handlers = {
      projection1: () => {
        router.push("/projection/autoProjection");
      },
      "projection1-1": () => {
        openExternalLink("https://mp.weixin.qq.com/s/yl2sYCgm0MtfqrtKorWdAA");
      },
      "projection1-2": () => {
        openExternalLink("https://mp.weixin.qq.com/s/HesBAG6Rk97YvvcpCcX_jA");
      },
    };
    if (handlers[id]) {
      handlers[id]();
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
