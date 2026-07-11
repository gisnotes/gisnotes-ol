<template>
  <demo-box :codeBlocks>
    <div class="equal-earth-projection">
      <div class="map-container" ref="mapDivRef"></div>
      <div class="info-box" ref="infoRef" v-show="infoText">
        {{ infoText }}
      </div>
    </div>
  </demo-box>
</template>

<script setup name="EqualEarthProjection">
import DemoBox from "@/components/DemoBox/index.vue";
import IndexSourceCode from "./index.vue?raw";

import { useThrottleFn } from "@vueuse/core";
import Map from "ol/Map.js";
import { unByKey } from "ol/Observable.js";
import View from "ol/View.js";
import GeoJSON from "ol/format/GeoJSON.js";
import VectorLayer from "ol/layer/Vector.js";
import "ol/ol.css";
import { fromLonLat, get as getProjection, toLonLat } from "ol/proj.js";
import { register } from "ol/proj/proj4.js";
import RenderFeature from "ol/render/Feature.js";
import VectorSource from "ol/source/Vector.js";
import proj4 from "proj4";

const codeBlocks = ref([
  {
    fileName: "@/views/projection/equalEarthProjection/index.vue",
    rawCode: IndexSourceCode,
    language: "html",
  },
]);

const mapDivRef = useTemplateRef("mapDivRef");
const infoText = ref("");

let map = null;
let geojsonData = null;
let vectorLayer = null;
let featureOverlay = null;

// 事件集合，用于在组件销毁时统一解绑
let mapEventKeys = [];

// 生命周期管理
onMounted(() => {
  initMap();
});

onUnmounted(() => {
  // 解绑所有基于 Key 注册的地图事件（如 click, pointermove）
  if (mapEventKeys.length > 0) {
    mapEventKeys.forEach((key) => unByKey(key));
    mapEventKeys = [];
  }

  if (map) {
    // 解绑当前视图（View）上的拖拽监听事件
    const currentView = map.getView();
    if (currentView) {
      currentView.un("change:center", handleCenterChange);
    }

    // 销毁地图实例，释放 Canvas 内存
    map.setTarget(undefined);
    map = null;
  }
});

async function initMap() {
  const isDev = import.meta.env.DEV;
  /**
   * 利用 jsDelivr 加速 GitHub 上的静态资源,
   * 本地开发时使用本地路径, 线上 build 后使用 CDN 路径
   */
  const dataUrl = isDev
    ? "/data/ecoregions.json"
    : "https://cdn.jsdelivr.net/gh/gisnotes/gisnotes-ol@main/public/data/ecoregions.json";
  try {
    // const response = await fetch("/data/ecoregions.json");
    const response = await fetch(dataUrl);
    geojsonData = await response.json();

    const initialCenter = [11, 0];
    const initialProjection = dynEqualEarth(initialCenter, 1);

    vectorLayer = new VectorLayer({
      source: jsonSource(
        clipPolygon(geojsonData, initialCenter[0]),
        initialProjection,
      ),
      extent: initialProjection.getExtent(),
      wrapX: false,
      style: {
        "fill-color": ["string", ["get", "COLOR"], "#eee"],
      },
    });

    map = new Map({
      layers: [vectorLayer],
      target: mapDivRef.value,
      view: new View({
        projection: initialProjection,
        center: initialCenter,
        zoom: 0,
        showFullExtent: true,
      }),
    });

    featureOverlay = new VectorLayer({
      source: new VectorSource(),
      map: map,
      style: {
        "stroke-color": "rgba(255, 255, 255, 0.9)",
        "stroke-width": 2,
      },
    });

    bindMapEvents();
  } catch (error) {
    console.error("地图初始化失败:", error);
  }
}

/**
 * 动态创建投影
 * @param center 中心经度
 * @param round 经度取整精度
 * @returns 投影对象
 */
function dynEqualEarth(center, round = 15) {
  const lon0 = Math.round(center[0] / round) * round;
  const code = `EqualEarth${lon0}`;
  let prj = getProjection(code);

  if (!prj) {
    proj4.defs(
      code,
      `+proj=eqearth +lon_0=${lon0} +x_0=0 +y_0=0 +R=6371008.7714 +units=m +no_defs +type=crs`,
    );
    register(proj4);
    prj = getProjection(code);
    prj.setGlobal(true);
    prj.setExtent([-17243959.06, -8392927.6, 17243959.06, 8392927.6]);
    prj.setWorldExtent([-180, -90, 180, 90]);
  }
  return prj;
}

/**
 * 在新对向子午线(antimeridian)裁剪多边形以避免渲染伪影(Rendering Artifacts)
 * @param geojson 输入的 GeoJSON 数据
 * @param lon0 新子午线经度
 * @returns 裁剪后的 GeoJSON 数据
 */
function clipPolygon(geojson, lon0) {
  function roundN(num, n = 10) {
    return Math.round(num * Math.pow(10, n)) / Math.pow(10, n);
  }
  const minX = lon0 - 180.0;
  const maxX = lon0 + 180.0;
  const clippedJson = { type: "FeatureCollection", features: [] };

  for (const feature of geojson.features) {
    const depth = feature.geometry.type === "MultiPolygon" ? 2 : 1;
    const [featMinX, featMaxX] = feature.geometry.coordinates
      .flat(depth)
      .reduce(
        (minmax, coord) => [
          Math.min(minmax[0], coord[0]),
          Math.max(minmax[1], coord[0]),
        ],
        [Number.MAX_VALUE, Number.MIN_VALUE],
      );
    const eps = 0.01;

    if (
      (featMinX < minX + eps && featMaxX > minX - eps) ||
      (featMinX < maxX + eps && featMaxX > maxX - eps)
    ) {
      const offset = featMinX < minX ? 360 : -360;
      const feat = structuredClone(feature);
      if (feat.geometry.type === "Polygon") {
        feat.geometry.type = "MultiPolygon";
        feat.geometry.coordinates = [feat.geometry.coordinates];
      }

      const polys = [];
      for (const polygon of feat.geometry.coordinates) {
        const tpoly = structuredClone(polygon);
        const ncoords = polygon.reduce((sum, ring) => sum + ring.length, 0);
        let clamped = 0;

        for (const ring of polygon) {
          for (const coord of ring) {
            const x = coord[0];
            coord[0] = roundN(Math.min(Math.max(x, minX), maxX));
            if (coord[0] !== roundN(x)) clamped++;
          }
        }

        if (clamped < ncoords) polys.push(polygon);

        if (clamped) {
          let around180 = false;
          for (const ring of tpoly) {
            for (const coord of ring) {
              const x = coord[0] + offset;
              coord[0] = Math.min(Math.max(x, minX + eps), maxX - eps);
              if (Math.abs(coord[0]) - 180 < 0.00000001) around180 = true;
            }
          }
          if (!around180) polys.push(tpoly);
        }
      }
      feat.geometry.coordinates = polys;
      clippedJson.features.push(feat);
    } else {
      clippedJson.features.push(feature);
    }
  }
  return clippedJson;
}

function jsonSource(geojson, projection) {
  return new VectorSource({
    features: new GeoJSON({
      featureProjection: projection,
      featureClass: RenderFeature,
    }).readFeatures(geojson),
    overlaps: false,
  });
}

// ==========================================
// 事件绑定 (带性能优化与追踪)
// ==========================================

// 因为 View 是动态替换的，需要把这个处理函数提升到外部，方便在销毁时 un 掉
function handleCenterChange() {
  const degStep = 5;
  const curView = map.getView();
  const center = toLonLat(curView.getCenter(), curView.getProjection());
  const newProjection = dynEqualEarth(center, degStep);

  if (curView.getProjection().getCode() !== newProjection.getCode()) {
    // 换坐标系前，立刻解绑旧 View 的监听器
    curView.un("change:center", handleCenterChange);

    const lon0 = Math.round(center[0] / degStep) * degStep;
    const clippedJson = clipPolygon(geojsonData, lon0);

    vectorLayer.setSource(jsonSource(clippedJson, newProjection));

    map.setView(
      new View({
        projection: newProjection,
        center: fromLonLat(center, newProjection),
        zoom: curView.getZoom(),
        rotation: curView.getRotation(),
        showFullExtent: true,
      }),
    );

    // 给新生成的 View 重新绑上监听器
    map.getView().on("change:center", handleCenterChange);
  }
}

function bindMapEvents() {
  // 1. 动态中心点变化事件（View级别事件）
  map.getView().on("change:center", handleCenterChange);

  let highlight;
  const displayFeatureInfo = function (pixel) {
    const feature = map.forEachFeatureAtPixel(pixel, (feature) => feature);

    if (feature) {
      infoText.value =
        feature.get("ECO_NAME") || feature.get("name") || "未知区域";
    } else {
      infoText.value = "";
    }

    if (feature !== highlight) {
      if (highlight) {
        featureOverlay.getSource().removeFeature(highlight);
      }
      if (feature) {
        featureOverlay.getSource().addFeature(feature);
      }
      highlight = feature;
    }
  };

  // 引入节流 (50ms)，彻底解决 Canvas 频繁 getImageData 导致的性能警告
  const throttledDisplayInfo = useThrottleFn((pixel) => {
    displayFeatureInfo(pixel);
  }, 50);

  // 绑定 map 级别的事件，并把返回的 key 收集进销毁名单
  const pointerMoveKey = map.on("pointermove", function (evt) {
    if (evt.dragging) return;
    throttledDisplayInfo(evt.pixel);
  });

  const clickKey = map.on("click", function (evt) {
    throttledDisplayInfo(evt.pixel);
  });

  // 放至数组，等待组件 Unmount 时统一销毁
  mapEventKeys.push(pointerMoveKey, clickKey);
}
</script>

<style scoped lang="scss">
.equal-earth-projection {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background-color: #f8f9fa;
  overflow: hidden;

  .map-container {
    width: 100%;
    height: 100%;
  }

  .info-box {
    position: absolute;
    top: 20px;
    right: 20px;
    background: rgba(255, 255, 255, 0.95);
    padding: 10px 16px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: bold;
    color: #333;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    pointer-events: none; /* 防止遮盖地图交互 */
    z-index: 10;
  }
}
</style>
