<template>
  <demo-box :codeBlocks="codeBlocks">
    <div class="wms-no-projection" ref="mapDivRef"></div>
  </demo-box>
</template>

<script setup name="WmsNoProjection">
import DemoBox from "@/components/DemoBox/index.vue";
import IndexSourceCode from "./index.vue?raw";

import Map from "ol/Map.js";
import View from "ol/View.js";
import ScaleLine from "ol/control/ScaleLine.js";
import { defaults as defaultControls } from "ol/control/defaults.js";
import ImageLayer from "ol/layer/Image.js";
import TileLayer from "ol/layer/Tile.js";
import Projection from "ol/proj/Projection.js";
import ImageWMS from "ol/source/ImageWMS.js";
import TileWMS from "ol/source/TileWMS.js";
import "ol/ol.css";

const codeBlocks = ref([
  {
    fileName: "@/views/projection/wmsNoProjection/index.vue",
    rawCode: IndexSourceCode,
    language: "html",
  },
]);

const mapRef = useTemplateRef("mapDivRef");
let map = null;

const wmsUrl = "https://wms.geo.admin.ch/";

// 1. 定义极简的投影对象（只声明了代号和单位，没有换算能力）
const projection = new Projection({
  code: "EPSG:21781",
  units: "m",
});

// 2. 配置 WMS 图层组合
const layers = [
  // 底图
  new TileLayer({
    source: new TileWMS({
      /**
       * 根据 版权内容可以看出：
       * 这是一张 1:1,000,000（一百万分之一）比例尺的彩色国家像素地图（Pixelmap），
       * 由瑞士联邦地形局提供的。
       */
      attributions:
        '© <a href="https://shop.swisstopo.admin.ch/en/products/maps/national/lk1000" target="_blank">' +
        "Pixelmap 1:1000000 / geo.admin.ch</a>",
      crossOrigin: "anonymous",
      params: {
        LAYERS: "ch.swisstopo.pixelkarte-farbe-pk1000.noscale",
        FORMAT: "image/jpeg",
      },
      url: wmsUrl,
    }),
  }),
  // 业务图层
  new ImageLayer({
    source: new ImageWMS({
      /**
       * 根据 版权内容可以看出：
       * 这是一张国家级水文与洪水预警图（Flood Alert Map），
       * 由瑞士联邦环境局提供的。
       */
      attributions:
        '© <a href="https://www.hydrodaten.admin.ch/en/notes-on-the-flood-alert-maps.html" target="_blank">' +
        "Flood Alert / geo.admin.ch</a>",
      crossOrigin: "anonymous",
      params: { LAYERS: "ch.bafu.hydroweb-warnkarte_national" },
      serverType: "mapserver",
      url: wmsUrl,
    }),
  }),
];

onMounted(() => {
  setTimeout(() => {
    initMap();
  }, 0);
});

onUnmounted(() => {
  if (map) {
    map.setTarget(undefined);
    map = null;
  }
});

function initMap() {
  map = new Map({
    controls: defaultControls([]).extend([new ScaleLine()]),
    layers,
    target: mapRef.value,
    view: new View({
      center: [660000, 190000],
      projection,
      zoom: 9,
    }),
  });
}
</script>

<style scoped lang="scss">
.wms-no-projection {
  position: absolute;
  inset: 0;
  background-color: #f8f9fa; //地图瓦片加载前设置一个底色
}
</style>
