<template>
  <demo-box :codeBlocks="codeBlocks">
    <div class="projection-and-scale" ref="mapDivRef">
      <div class="panel">
        <el-form label-suffix=":" label-width="auto">
          <el-form-item label="视图投影">
            <el-select
              v-model="epsgCode"
              placeholder="请选择投影"
              @change="onChangeProjection"
            >
              <el-option
                v-for="item in epsgCodeArray"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </demo-box>
</template>

<script setup name="ProjectionAndScale">
import DemoBox from "@/components/DemoBox/index.vue";
import IndexSourceCode from "./index.vue?raw";
import TiandituUtilCode from "@/utils/layer/tdt.js?raw";

import Map from "ol/Map.js";
import View from "ol/View.js";
import ScaleLine from "ol/control/ScaleLine.js";
import { defaults as defaultControls } from "ol/control/defaults.js";
import {
  getPointResolution,
  get as getProjection,
  transform,
} from "ol/proj.js";
import "ol/ol.css";
import { useResizeObserver, useDebounceFn } from "@vueuse/core";

import Tianditu from "@/utils/layer/tdt.js";

const codeBlocks = ref([
  {
    fileName: "@/views/projection/projectionAndScale/index.vue",
    rawCode: IndexSourceCode,
    language: "html",
  },
  {
    fileName: "@/utils/layer/tdt.js",
    rawCode: TiandituUtilCode,
    language: "js",
  },
]);

const mapDivRef = useTemplateRef("mapDivRef");
let map = null;

const TDT = new Tianditu();

const vecLyrGrp = TDT.createTileLayerGroup("vec");

const epsgCodeArray = [
  { label: "Web墨卡托(EPSG:3857)", value: "EPSG:3857" },
  { label: "WGS 84(EPSG:4326)", value: "EPSG:4326" },
];
const epsgCode = ref("EPSG:3857");
const projection = getProjection(epsgCode.value);

const scaleControl = new ScaleLine({
  units: "metric",
  bar: true,
  steps: 4,
  text: true,
  minWidth: 140,
});

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
    controls: defaultControls([]).extend([scaleControl]),
    layers: [vecLyrGrp],
    target: mapDivRef.value,
    view: new View({
      center: transform([113.626373, 34.748782], "EPSG:4326", projection),
      zoom: 8,
      projection: projection,
    }),
  });

  /**
   * 增加防抖避免频繁触发updateSize函数的执行，
   * 实现的效果是：拽改变窗口大小时，地图不会卡顿地一帧帧重绘，
   * 而是会在你停下拖拽的一瞬间刷新地图尺寸，性能和体验都能兼顾得到
   */
  const debouncedUpdateSize = useDebounceFn(() => {
    if (map) {
      console.log("刷新地图尺寸");
      map.updateSize();
    }
  }, 300);

  // 监听容器大小变化
  useResizeObserver(mapDivRef, debouncedUpdateSize);
}

function onChangeProjection() {
  // 1. 获取当前的状态：投影、分辨率（像素代表多少地图单位）、中心点坐标、旋转角度
  const currentView = map.getView();
  const currentProjection = currentView.getProjection();
  const currentResolution = currentView.getResolution();
  const currentCenter = currentView.getCenter();
  const currentRotation = currentView.getRotation();
  // 2. 算出中心点在新投影（比如从 3857 转到 4326）下的坐标位置
  const newProjection = getProjection(epsgCode.value);
  const newCenter = transform(currentCenter, currentProjection, newProjection);
  /**
   * 3. 获取新老投影的“标准单位换算率”（Meters Per Unit, 简称 MPU）
   *  - 如果是 3857，单位是米，MPU 就是 1。
   *  - 如果是 4326，单位是度，1度在赤道上约等于 111319 米，MPU 就是 111319。
   */
  const currentMPU = currentProjection.getMetersPerUnit();
  const newMPU = newProjection.getMetersPerUnit();
  /* 4. 计算新分辨率（1 像素代表多少新地图单位）：
   *  - 新分辨率 = 旧分辨率 * 旧的点分辨率 / 新的点分辨率
   */
  const currentPointResolution =
    getPointResolution(currentProjection, 1 / currentMPU, currentCenter, "m") *
    currentMPU;
  const newPointResolution =
    getPointResolution(newProjection, 1 / newMPU, newCenter, "m") * newMPU;
  const newResolution =
    (currentResolution * currentPointResolution) / newPointResolution;
  // 5. 利用新计算出的中心点坐标、新分辨率、当前旋转角度，创建新的视图
  const newView = new View({
    center: newCenter,
    resolution: newResolution,
    rotation: currentRotation,
    projection: newProjection,
  });
  map.setView(newView);
}
</script>

<style lang="scss" scoped>
.projection-and-scale {
  position: absolute;
  inset: 0;

  .panel {
    position: absolute;
    width: 320px;
    top: 10px;
    right: 10px;
    background-color: white;
    border-radius: 4px;
    z-index: 2;
    padding: 10px;
    opacity: 0.96;
    box-shadow: var(--el-box-shadow-dark);
  }
}

:deep(.el-form-item) {
  margin-bottom: 0;
}
</style>
