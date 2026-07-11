var E=r=>{throw TypeError(r)};var X=(r,e,n)=>e.has(r)||E("Cannot "+n);var d=(r,e,n)=>(X(r,e,"read from private field"),n?n.call(r):e.get(r)),f=(r,e,n)=>e.has(r)?E("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(r):e.set(r,n);import{a as Y,E as O}from"./el-form-item-Cct6e9oS.js";import{_ as B,r as h,ai as Z,I as F,J as N,ak as Q,o as C,m as $,f as w,h as M,e as g,X as J,R as K,i as G,c as q,Y as H,Z as ee,$ as re,K as ne,al as te}from"./index-jD_X0PT8.js";/* empty css                */import{bY as oe,a4 as b,Z as ie,X as se,M as ae,V as L,bZ as _,b_ as le,D as ce,b$ as I}from"./Source-BfaDjW3k.js";import{T as ue,S as pe}from"./Tile-9D4f-YDP.js";import{o as me}from"./TileImage-Bd0ar7pU.js";import{X as de}from"./XYZ-6ZxMT48g.js";import"./index-CwDaKGgQ.js";import"./Layer-PQ25rqs0.js";class fe extends me{constructor(e){super({extent:e.extent,origin:e.origin,origins:e.origins,resolutions:e.resolutions,tileSize:e.tileSize,tileSizes:e.tileSizes,sizes:e.sizes}),this.matrixIds_=e.matrixIds}getMatrixId(e){return this.matrixIds_[e]}getMatrixIds(){return this.matrixIds_}}const we=`<template>\r
  <demo-box :codeBlocks="codeBlocks">\r
    <div class="projection-and-scale" ref="mapDivRef">\r
      <div class="panel">\r
        <el-form label-suffix=":" label-width="auto">\r
          <el-form-item label="视图投影">\r
            <el-select\r
              v-model="epsgCode"\r
              placeholder="请选择投影"\r
              @change="onChangeProjection"\r
            >\r
              <el-option\r
                v-for="item in epsgCodeArray"\r
                :key="item.value"\r
                :label="item.label"\r
                :value="item.value"\r
              />\r
            </el-select>\r
          </el-form-item>\r
        </el-form>\r
      </div>\r
    </div>\r
  </demo-box>\r
</template>\r
\r
<script setup name="ProjectionAndScale">\r
import DemoBox from "@/components/DemoBox/index.vue";\r
import IndexSourceCode from "./index.vue?raw";\r
import TiandituUtilCode from "@/utils/layer/tdt.js?raw";\r
\r
import Map from "ol/Map.js";\r
import View from "ol/View.js";\r
import ScaleLine from "ol/control/ScaleLine.js";\r
import { defaults as defaultControls } from "ol/control/defaults.js";\r
import {\r
  getPointResolution,\r
  get as getProjection,\r
  transform,\r
} from "ol/proj.js";\r
import "ol/ol.css";\r
import { useResizeObserver, useDebounceFn } from "@vueuse/core";\r
\r
import Tianditu from "@/utils/layer/tdt.js";\r
\r
const codeBlocks = ref([\r
  {\r
    fileName: "@/views/projection/projectionAndScale/index.vue",\r
    rawCode: IndexSourceCode,\r
    language: "html",\r
  },\r
  {\r
    fileName: "@/utils/layer/tdt.js",\r
    rawCode: TiandituUtilCode,\r
    language: "js",\r
  },\r
]);\r
\r
const mapDivRef = useTemplateRef("mapDivRef");\r
let map = null;\r
\r
const TDT = new Tianditu();\r
\r
const vecLyrGrp = TDT.createTileLayerGroup("vec");\r
\r
const epsgCodeArray = [\r
  { label: "Web墨卡托(EPSG:3857)", value: "EPSG:3857" },\r
  { label: "WGS 84(EPSG:4326)", value: "EPSG:4326" },\r
];\r
const epsgCode = ref("EPSG:3857");\r
const projection = getProjection(epsgCode.value);\r
\r
const scaleControl = new ScaleLine({\r
  units: "metric",\r
  bar: true,\r
  steps: 4,\r
  text: true,\r
  minWidth: 140,\r
});\r
\r
onMounted(() => {\r
  setTimeout(() => {\r
    initMap();\r
  }, 0);\r
});\r
\r
onUnmounted(() => {\r
  if (map) {\r
    map.setTarget(undefined);\r
    map = null;\r
  }\r
});\r
\r
function initMap() {\r
  map = new Map({\r
    controls: defaultControls([]).extend([scaleControl]),\r
    layers: [vecLyrGrp],\r
    target: mapDivRef.value,\r
    view: new View({\r
      center: transform([113.626373, 34.748782], "EPSG:4326", projection),\r
      zoom: 8,\r
      projection: projection,\r
    }),\r
  });\r
\r
  /**\r
   * 增加防抖避免频繁触发updateSize函数的执行，\r
   * 实现的效果是：拽改变窗口大小时，地图不会卡顿地一帧帧重绘，\r
   * 而是会在你停下拖拽的一瞬间刷新地图尺寸，性能和体验都能兼顾得到\r
   */\r
  const debouncedUpdateSize = useDebounceFn(() => {\r
    if (map) {\r
      console.log("刷新地图尺寸");\r
      map.updateSize();\r
    }\r
  }, 300);\r
\r
  // 监听容器大小变化\r
  useResizeObserver(mapDivRef, debouncedUpdateSize);\r
}\r
\r
function onChangeProjection() {\r
  // 1. 获取当前的状态：投影、分辨率（像素代表多少地图单位）、中心点坐标、旋转角度\r
  const currentView = map.getView();\r
  const currentProjection = currentView.getProjection();\r
  const currentResolution = currentView.getResolution();\r
  const currentCenter = currentView.getCenter();\r
  const currentRotation = currentView.getRotation();\r
  // 2. 算出中心点在新投影（比如从 3857 转到 4326）下的坐标位置\r
  const newProjection = getProjection(epsgCode.value);\r
  const newCenter = transform(currentCenter, currentProjection, newProjection);\r
  /**\r
   * 3. 获取新老投影的“标准单位换算率”（Meters Per Unit, 简称 MPU）\r
   *  - 如果是 3857，单位是米，MPU 就是 1。\r
   *  - 如果是 4326，单位是度，1度在赤道上约等于 111319 米，MPU 就是 111319。\r
   */\r
  const currentMPU = currentProjection.getMetersPerUnit();\r
  const newMPU = newProjection.getMetersPerUnit();\r
  /* 4. 计算新分辨率（1 像素代表多少新地图单位）：\r
   *  - 新分辨率 = 旧分辨率 * 旧的点分辨率 / 新的点分辨率\r
   */\r
  const currentPointResolution =\r
    getPointResolution(currentProjection, 1 / currentMPU, currentCenter, "m") *\r
    currentMPU;\r
  const newPointResolution =\r
    getPointResolution(newProjection, 1 / newMPU, newCenter, "m") * newMPU;\r
  const newResolution =\r
    (currentResolution * currentPointResolution) / newPointResolution;\r
  // 5. 利用新计算出的中心点坐标、新分辨率、当前旋转角度，创建新的视图\r
  const newView = new View({\r
    center: newCenter,\r
    resolution: newResolution,\r
    rotation: currentRotation,\r
    projection: newProjection,\r
  });\r
  map.setView(newView);\r
}\r
<\/script>\r
\r
<style lang="scss" scoped>\r
.projection-and-scale {\r
  position: absolute;\r
  inset: 0;\r
\r
  .panel {\r
    position: absolute;\r
    width: 320px;\r
    top: 10px;\r
    right: 10px;\r
    background-color: white;\r
    border-radius: 4px;\r
    z-index: 2;\r
    padding: 10px;\r
    opacity: 0.96;\r
    box-shadow: var(--el-box-shadow-dark);\r
  }\r
}\r
\r
:deep(.el-form-item) {\r
  margin-bottom: 0;\r
}\r
</style>\r
`,ge=`import { XYZ } from "ol/source";\r
import { Tile as TileLayer, Group as LayerGroup } from "ol/layer";\r
import { get as getProjection } from "ol/proj";\r
import { getTopLeft, getWidth } from "ol/extent";\r
import WMTSTileGrid from "ol/tilegrid/WMTS";\r
\r
export default class Tianditu {\r
  #baseUrl = "https://t{0-7}.tianditu.gov.cn/";\r
  #tk = "e1f2618711e8858b50bb0a1d4a715fa9";\r
  #sourceGroupType = {\r
    vec: ["vec", "cva"], // 矢量底图\r
    img: ["img", "cia"], // 影像底图\r
  };\r
\r
  /**\r
   * 创建指定类型的图层组\r
   *\r
   * @param type 图层组类型\r
   * @param visible 是否可见\r
   * @returns 返回创建的图层组对象\r
   */\r
  createTileLayerGroup(type, visible = true) {\r
    const layers = this.#sourceGroupType[type].map((st) => {\r
      return this.createTileLayer(st);\r
    });\r
\r
    return new LayerGroup({\r
      layers,\r
      visible,\r
      properties: {\r
        name: type,\r
      },\r
    });\r
  }\r
\r
  /**\r
   * 创建一个瓦片图层\r
   *\r
   * @param type 瓦片图层类型\r
   * @returns 返回一个新的瓦片图层实例\r
   */\r
  createTileLayer(type) {\r
    return new TileLayer({\r
      source: this.createXYZSource(type),\r
      properties: {\r
        name: type,\r
      },\r
    });\r
  }\r
\r
  /**\r
   * 创建XYZ数据源\r
   *\r
   * @param type 数据类型\r
   * @returns 返回XYZ数据源实例\r
   */\r
  createXYZSource(type) {\r
    return new XYZ({\r
      url:\r
        this.#baseUrl +\r
        type +\r
        "_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=" +\r
        type +\r
        "&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=" +\r
        this.#tk,\r
      tileGrid: createTileGrid(getProjection("EPSG:3857")),\r
    });\r
  }\r
}\r
\r
/**\r
 * 创建瓦片网格模式\r
 * @param {Object} projection 投影对象\r
 * @returns 网格模式对象\r
 */\r
function createTileGrid(projection) {\r
  const projExtent = projection.getExtent();\r
  const origin = getTopLeft(projExtent);\r
  const width = getWidth(projExtent);\r
  const resolutions = new Array(18);\r
  const matrixIds = new Array(18);\r
  for (let z = 0; z < 18; ++z) {\r
    resolutions[z] = width / (256 * Math.pow(2, z));\r
    matrixIds[z] = z;\r
  }\r
  return new WMTSTileGrid({\r
    origin,\r
    resolutions,\r
    matrixIds,\r
  });\r
}\r
`;var T,v,P;class Te{constructor(){f(this,T,"https://t{0-7}.tianditu.gov.cn/");f(this,v,"e1f2618711e8858b50bb0a1d4a715fa9");f(this,P,{vec:["vec","cva"],img:["img","cia"]})}createTileLayerGroup(e,n=!0){const t=d(this,P)[e].map(c=>this.createTileLayer(c));return new oe({layers:t,visible:n,properties:{name:e}})}createTileLayer(e){return new ue({source:this.createXYZSource(e),properties:{name:e}})}createXYZSource(e){return new de({url:d(this,T)+e+"_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER="+e+"&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk="+d(this,v),tileGrid:ve(b("EPSG:3857"))})}}T=new WeakMap,v=new WeakMap,P=new WeakMap;function ve(r){const e=r.getExtent(),n=ie(e),t=se(e),c=new Array(18),p=new Array(18);for(let o=0;o<18;++o)c[o]=t/(256*Math.pow(2,o)),p[o]=o;return new fe({origin:n,resolutions:c,matrixIds:p})}const Pe={class:"panel"},je=ne({name:"ProjectionAndScale"}),Se=Object.assign(je,{setup(r){const e=h([{fileName:"@/views/projection/projectionAndScale/index.vue",rawCode:we,language:"html"},{fileName:"@/utils/layer/tdt.js",rawCode:ge,language:"js"}]),n=Z("mapDivRef");let t=null;const p=new Te().createTileLayerGroup("vec"),o=[{label:"Web墨卡托(EPSG:3857)",value:"EPSG:3857"},{label:"WGS 84(EPSG:4326)",value:"EPSG:4326"}],u=h("EPSG:3857"),x=b(u.value),U=new pe({units:"metric",bar:!0,steps:4,text:!0,minWidth:140});F(()=>{setTimeout(()=>{z()},0)}),N(()=>{t&&(t.setTarget(void 0),t=null)});function z(){t=new ae({controls:le([]).extend([U]),layers:[p],target:n.value,view:new L({center:_([113.626373,34.748782],"EPSG:4326",x),zoom:8,projection:x})});const s=te(()=>{t&&(console.log("刷新地图尺寸"),t.updateSize())},300);Q(n,s)}function V(){const s=t.getView(),a=s.getProjection(),j=s.getResolution(),m=s.getCenter(),S=s.getRotation(),l=b(u.value),i=_(m,a,l),y=a.getMetersPerUnit(),R=l.getMetersPerUnit(),k=I(a,1/y,m,"m")*y,A=I(l,1/R,i,"m")*R,D=j*k/A,W=new L({center:i,resolution:D,rotation:S,projection:l});t.setView(W)}return(s,a)=>{const j=re,m=J,S=O,l=Y;return C(),$(ce,{codeBlocks:G(e)},{default:w(()=>[M("div",{class:"projection-and-scale",ref_key:"mapDivRef",ref:n},[M("div",Pe,[g(l,{"label-suffix":":","label-width":"auto"},{default:w(()=>[g(S,{label:"视图投影"},{default:w(()=>[g(m,{modelValue:G(u),"onUpdate:modelValue":a[0]||(a[0]=i=>K(u)?u.value=i:null),placeholder:"请选择投影",onChange:V},{default:w(()=>[(C(),q(H,null,ee(o,i=>g(j,{key:i.value,label:i.label,value:i.value},null,8,["label","value"])),64))]),_:1},8,["modelValue"])]),_:1})]),_:1})])],512)]),_:1},8,["codeBlocks"])}}}),_e=B(Se,[["__scopeId","data-v-8305554a"]]);export{_e as default};
