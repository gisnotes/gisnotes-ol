<template>
  <demo-box :codeBlocks>
    <div
      class="auto-projection"
      ref="mapDivRef"
      v-loading="isLoading"
      element-loading-background="rgba(122, 122, 122, 0.8)"
      element-loading-text="地图加载中..."
    ></div>
  </demo-box>
</template>

<script setup name="AutoProjection">
import DemoBox from "@/components/DemoBox/index.vue";
import IndexSourceCode from "./index.vue?raw";
import IndexSourceCodeOld from "./indexOld.vue?raw";

import Map from "ol/Map.js";
import View from "ol/View.js";
import { unByKey } from "ol/Observable.js";
import WebGLTileLayer from "ol/layer/WebGLTile.js";
import "ol/ol.css";
import GeoTIFF from "ol/source/GeoTIFF.js";
import XYZ from "ol/source/XYZ.js";

import { MAPTILER_API_KEY } from "@/constants";

const codeBlocks = ref([
  {
    fileName: "新版-@/views/projection/autoProjection/index.vue",
    rawCode: IndexSourceCode,
    language: "html",
  },
  {
    fileName: "旧版-@/views/projection/autoProjection/indexOld.vue",
    rawCode: IndexSourceCodeOld,
    language: "html",
  },
]);

const mapDivRef = ref(null);
let map = null;

const loadingTilesCount = ref(0);
const isLoading = computed(() => loadingTilesCount.value > 0);

let listenerKeys = [];

const isDev = import.meta.env.DEV;

/**
 * 利用 jsDelivr 加速 GitHub 上的静态资源,
 * 本地开发时使用本地路径, 线上 build 后使用 CDN 路径
 */
const cogUrl = isDev
  ? "/data/linzhou_cog.tif"
  : "https://cdn.jsdelivr.net/gh/gisnotes/gisnotes-ol@main/public/data/linzhou_cog.tif";
const cogSource = new GeoTIFF({
  sources: [
    {
      url: cogUrl,
      nodata: 0,
    },
  ],
});

const xyzSource = new XYZ({
  url:
    "https://api.maptiler.com/maps/satellite/{z}/{x}/{y}.jpg?key=" +
    MAPTILER_API_KEY,
  tileSize: 512,
  maxZoom: 20,
  crossOrigin: "",
});

const handleTileLoadStart = () => loadingTilesCount.value++;
const handleTileLoadEndOrError = () => {
  if (loadingTilesCount.value > 0) loadingTilesCount.value--;
};

const attachListeners = () => {
  // 防止重复绑定
  if (listenerKeys.length > 0) return;

  [cogSource, xyzSource].forEach((source) => {
    // source.on 监听单事件返回单 key，监听数组返回 key 数组
    listenerKeys.push(
      source.on("tileloadstart", handleTileLoadStart),
      source.on(["tileloadend", "tileloaderror"], handleTileLoadEndOrError),
    );
  });
};

const detachListeners = () => {
  if (listenerKeys.length > 0) {
    // listenerKeys 内部可能包含数组，利用 flat() 拍平后批量解绑
    listenerKeys.flat().forEach((key) => unByKey(key));
    listenerKeys = []; // 清空 Key 池
  }

  // 重置加载状态。防止在后台时瓦片加载完成导致切回来时状态卡死
  loadingTilesCount.value = 0;
};

onMounted(() => {
  setTimeout(() => {
    initMap();
  }, 0);
});

function initMap() {
  cogSource.getView().then((ViewOptions) => {
    const { center, projection } = ViewOptions;
    map = new Map({
      target: mapDivRef.value,
      layers: [
        new WebGLTileLayer({
          source: xyzSource,
          opacity: 0.5, //这里我把底图透明度调低能凸显cog数据加载后的效果
          style: { exposure: 0.2 },
        }),
        new WebGLTileLayer({ source: cogSource, style: { gamma: 0.7 } }),
      ],
      view: new View({
        center,
        zoom: 9,
        projection,
      }),
    });
  });
}

onActivated(() => {
  attachListeners();
});

onDeactivated(() => {
  detachListeners();
});

onUnmounted(() => {
  detachListeners();
  if (map) {
    map.setTarget(null);
    map = null;
  }
});
</script>

<style lang="scss" scoped>
.auto-projection {
  position: absolute;
  inset: 0;
}
</style>
