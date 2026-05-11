import{_ as E,r as s,A as h,I as S,af as j,ag as x,J as A,o as R,m as I,f as P,P as w,h as O,U as L,i as u,K as G}from"./index-BNnLIRvC.js";import{X as M,M as k,V as B,D as C,u as K}from"./XYZ-CucocO0n.js";import{I as D,G as U,M as Y,W as p}from"./index-DhwC4kxn.js";import"./index-DumT2d1p.js";const b=`<template>\r
  <demo-box :codeBlocks>\r
    <div\r
      class="auto-projection"\r
      ref="mapDivRef"\r
      v-loading="isLoading"\r
      element-loading-background="rgba(122, 122, 122, 0.8)"\r
      element-loading-text="地图加载中..."\r
    ></div>\r
  </demo-box>\r
</template>\r
\r
<script setup>\r
import DemoBox from "@/components/DemoBox/index.vue";\r
import IndexSourceCode from "./index.vue?raw";\r
\r
import Map from "ol/Map.js";\r
import { unByKey } from "ol/Observable.js";\r
import TileLayer from "ol/layer/WebGLTile.js";\r
import "ol/ol.css";\r
import { register } from "ol/proj/proj4.js";\r
import GeoTIFF from "ol/source/GeoTIFF.js";\r
import XYZ from "ol/source/XYZ.js";\r
import proj4 from "proj4";\r
\r
import { MAPTILER_API_KEY } from "@/constants";\r
\r
const codeBlocks = ref([\r
  {\r
    fileName: "@/views/projection/autoProjection/index.vue",\r
    rawCode: IndexSourceCode,\r
    language: "html",\r
  },\r
]);\r
\r
const mapDivRef = ref(null);\r
let map = null;\r
\r
const loadingTilesCount = ref(0);\r
const isLoading = computed(() => loadingTilesCount.value > 0);\r
\r
let listenerKeys = [];\r
\r
proj4.defs(\r
  "EPSG:27700",\r
  \`PROJCS["OSGB36 / British National Grid",GEOGCS["OSGB36",DATUM["Ordnance_Survey_of_Great_Britain_1936",SPHEROID["Airy 1830",6377563.396,299.3249646,AUTHORITY["EPSG","7001"]],AUTHORITY["EPSG","6277"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4277"]],PROJECTION["Transverse_Mercator"],PARAMETER["latitude_of_origin",49],PARAMETER["central_meridian",-2],PARAMETER["scale_factor",0.9996012717],PARAMETER["false_easting",400000],PARAMETER["false_northing",-100000],UNIT["metre",1,AUTHORITY["EPSG","9001"]],AXIS["Easting",EAST],AXIS["Northing",NORTH],AUTHORITY["EPSG","27700"]]\r
\`,\r
);\r
\r
// 不推荐采用标砖的字符串，+nadgrids参数引用的是一个外部文件，这里不推荐使用\r
// 可以采用下面的简化版本，但本示例所用数据推荐使用wkt字符串注册。\r
// proj4.defs(\r
//   "EPSG:27700",\r
//   "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +nadgrids=uk_os_OSTN15_NTv2_OSGBtoETRS.tif +units=m +no_defs +type=crs",\r
// );\r
\r
//简化版proj字符串，增加了+towgs84参数\r
// proj4.defs(\r
//   "EPSG:27700",\r
//   "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 +units=m +no_defs",\r
// );\r
\r
register(proj4);\r
\r
const cogSource = new GeoTIFF({\r
  sources: [\r
    {\r
      url: "https://mikenunn.net/data/MiniScale_(std_with_grid)_R23.tif",\r
      nodata: 0,\r
    },\r
  ],\r
  // loadMissingProjection: true,\r
});\r
\r
const xyzSource = new XYZ({\r
  url:\r
    "https://api.maptiler.com/maps/satellite/{z}/{x}/{y}.jpg?key=" +\r
    MAPTILER_API_KEY,\r
  tileSize: 512,\r
  maxZoom: 20,\r
  crossOrigin: "",\r
});\r
\r
const handleTileLoadStart = () => loadingTilesCount.value++;\r
const handleTileLoadEndOrError = () => {\r
  if (loadingTilesCount.value > 0) loadingTilesCount.value--;\r
};\r
\r
const attachListeners = () => {\r
  // 防止重复绑定\r
  if (listenerKeys.length > 0) return;\r
\r
  [cogSource, xyzSource].forEach((source) => {\r
    // source.on 监听单事件返回单 key，监听数组返回 key 数组\r
    listenerKeys.push(\r
      source.on("tileloadstart", handleTileLoadStart),\r
      source.on(["tileloadend", "tileloaderror"], handleTileLoadEndOrError),\r
    );\r
  });\r
};\r
\r
const detachListeners = () => {\r
  if (listenerKeys.length > 0) {\r
    // listenerKeys 内部可能包含数组，利用 flat() 拍平后批量解绑\r
    listenerKeys.flat().forEach((key) => unByKey(key));\r
    listenerKeys = []; // 清空 Key 池\r
  }\r
\r
  // 重置加载状态。防止在后台时瓦片加载完成导致切回来时状态卡死\r
  loadingTilesCount.value = 0;\r
};\r
\r
onMounted(() => {\r
  setTimeout(() => {\r
    initMap();\r
  }, 0);\r
});\r
\r
function initMap() {\r
  map = new Map({\r
    target: mapDivRef.value,\r
    layers: [\r
      new TileLayer({ source: xyzSource, style: { exposure: 0.2 } }),\r
      new TileLayer({ source: cogSource, opacity: 0.7, style: { gamma: 0.7 } }),\r
    ],\r
    view: cogSource.getView(),\r
  });\r
}\r
\r
onActivated(() => {\r
  attachListeners();\r
});\r
\r
onDeactivated(() => {\r
  detachListeners();\r
});\r
\r
onUnmounted(() => {\r
  detachListeners();\r
  if (map) {\r
    map.setTarget(null);\r
    map = null;\r
  }\r
});\r
<\/script>\r
\r
<style lang="scss" scoped>\r
.auto-projection {\r
  position: absolute;\r
  inset: 0;\r
}\r
</style>\r
`,N=G({name:"AutoProjection"}),z=Object.assign(N,{setup(H){const m=s([{fileName:"新版-@/views/projection/autoProjection/index.vue",rawCode:D,language:"html"},{fileName:"旧版-@/views/projection/autoProjection/indexOld.vue",rawCode:b,language:"html"}]),i=s(null);let o=null;const n=s(0),g=h(()=>n.value>0);let r=[];const f="https://cdn.jsdelivr.net/gh/gisnotes/gisnotes-ol@main/public/data/linzhou_cog.tif",t=new U({sources:[{url:f,nodata:0}]}),l=new M({url:"https://api.maptiler.com/maps/satellite/{z}/{x}/{y}.jpg?key="+Y,tileSize:512,maxZoom:20,crossOrigin:""}),T=()=>n.value++,_=()=>{n.value>0&&n.value--},y=()=>{r.length>0||[t,l].forEach(e=>{r.push(e.on("tileloadstart",T),e.on(["tileloadend","tileloaderror"],_))})},c=()=>{r.length>0&&(r.flat().forEach(e=>K(e)),r=[]),n.value=0};S(()=>{setTimeout(()=>{v()},0)});function v(){t.getView().then(e=>{const{center:d,projection:a}=e;o=new k({target:i.value,layers:[new p({source:l,opacity:.5,style:{exposure:.2}}),new p({source:t,style:{gamma:.7}})],view:new B({center:d,zoom:9,projection:a})})})}return j(()=>{y()}),x(()=>{c()}),A(()=>{c(),o&&(o.setTarget(null),o=null)}),(e,d)=>{const a=L;return R(),I(C,{codeBlocks:u(m)},{default:P(()=>[w(O("div",{class:"auto-projection",ref_key:"mapDivRef",ref:i,"element-loading-background":"rgba(122, 122, 122, 0.8)","element-loading-text":"地图加载中..."},null,512),[[a,u(g)]])]),_:1},8,["codeBlocks"])}}}),J=E(z,[["__scopeId","data-v-2058994a"]]);export{J as default};
