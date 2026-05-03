<template>
  <div
    class="auto-projection"
    ref="mapDivRef"
    v-loading="isLoading"
    element-loading-background="rgba(122, 122, 122, 0.8)"
    element-loading-text="地图加载中..."
  ></div>
</template>

<script setup name="AutoProjection">
import Map from "ol/Map.js";
import { unByKey } from "ol/Observable.js";
import TileLayer from "ol/layer/WebGLTile.js";
import "ol/ol.css";
import { register } from "ol/proj/proj4.js";
import GeoTIFF from "ol/source/GeoTIFF.js";
import XYZ from "ol/source/XYZ.js";
import proj4 from "proj4";

import { MAPTILER_API_KEY } from "@/constants";

const mapDivRef = ref(null);
let map = null;

const loadingTilesCount = ref(0);
const isLoading = computed(() => loadingTilesCount.value > 0);

let listenerKeys = [];

proj4.defs(
  "EPSG:27700",
  `PROJCS["OSGB36 / British National Grid",GEOGCS["OSGB36",DATUM["Ordnance_Survey_of_Great_Britain_1936",SPHEROID["Airy 1830",6377563.396,299.3249646,AUTHORITY["EPSG","7001"]],AUTHORITY["EPSG","6277"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4277"]],PROJECTION["Transverse_Mercator"],PARAMETER["latitude_of_origin",49],PARAMETER["central_meridian",-2],PARAMETER["scale_factor",0.9996012717],PARAMETER["false_easting",400000],PARAMETER["false_northing",-100000],UNIT["metre",1,AUTHORITY["EPSG","9001"]],AXIS["Easting",EAST],AXIS["Northing",NORTH],AUTHORITY["EPSG","27700"]]
`,
);

// 不推荐采用标砖的字符串，+nadgrids参数引用的是一个外部文件，这里不推荐使用
// 可以采用下面的简化版本，但本示例所用数据推荐使用wkt字符串注册。
// proj4.defs(
//   "EPSG:27700",
//   "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +nadgrids=uk_os_OSTN15_NTv2_OSGBtoETRS.tif +units=m +no_defs +type=crs",
// );

//简化版proj字符串，增加了+towgs84参数
// proj4.defs(
//   "EPSG:27700",
//   "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 +units=m +no_defs",
// );

register(proj4);

const cogSource = new GeoTIFF({
  sources: [
    {
      url: "https://mikenunn.net/data/MiniScale_(std_with_grid)_R23.tif",
      nodata: 0,
    },
  ],
  // loadMissingProjection: true,
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
  map = new Map({
    target: mapDivRef.value,
    layers: [
      new TileLayer({ source: xyzSource, style: { exposure: 0.2 } }),
      new TileLayer({ source: cogSource, opacity: 0.7, style: { gamma: 0.7 } }),
    ],
    view: cogSource.getView(),
  });
});

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
  height: 100%;
}
</style>
