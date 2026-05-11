var Ke=Object.defineProperty;var _e=h=>{throw TypeError(h)};var Ze=(h,e,t)=>e in h?Ke(h,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):h[e]=t;var we=(h,e,t)=>Ze(h,typeof e!="symbol"?e+"":e,t),Xe=(h,e,t)=>e.has(h)||_e("Cannot "+t);var q=(h,e,t)=>(Xe(h,e,"read from private field"),t?t.call(h):e.get(h)),$=(h,e,t)=>e.has(h)?_e("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(h):e.set(h,t);import{a as Ye,E as qe}from"./el-form-item-D5NKhTY-.js";import{_ as $e,r as Ce,ai as Qe,I as He,J as Je,aj as et,o as Ee,m as tt,f as Q,h as Se,e as H,X as nt,R as rt,i as Pe,c as it,Y as ot,Z as st,$ as at,K as lt,ak as ct}from"./index-BNnLIRvC.js";/* empty css                */import{aD as dt,aL as ut,aM as ht,aN as ee,aO as pt,aP as Me,L as gt,c as ae,aQ as ft,a0 as je,aR as mt,aS as Tt,ab as xt,aT as yt,l as Ae,af as ge,aU as Rt,aV as vt,aW as _t,F as j,ad as ke,ae as wt,d as ue,aE as Ct,aX as Et,o as St,n as J,ag as Pt,p as Mt,q as be,r as Le,at as le,w as jt,J as bt,f as G,t as Lt,I as It,R as Dt,i as Ie,j as De,g as k,v as Gt,H as Fe,G as he,aY as zt,aZ as Ut,a_ as At,a3 as kt,a$ as Ft,X as Vt,ax as pe,M as Wt,V as Ge,b0 as ze,b1 as Bt,D as Nt}from"./XYZ-CucocO0n.js";import"./index-DumT2d1p.js";class Ot extends dt{constructor(e){super({extent:e.extent,origin:e.origin,origins:e.origins,resolutions:e.resolutions,tileSize:e.tileSize,tileSizes:e.tileSizes,sizes:e.sizes}),this.matrixIds_=e.matrixIds}getMatrixId(e){return this.matrixIds_[e]}getMatrixIds(){return this.matrixIds_}}const Kt=`<template>\r
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
`,Zt=`import { XYZ } from "ol/source";\r
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
`,ce="units",Xt=[1,2,5],W=25.4/.28;class Yt extends ut{constructor(e){e=e||{};const t=document.createElement("div");t.style.pointerEvents="none",super({element:t,render:e.render,target:e.target}),this.on,this.once,this.un;const n=e.className!==void 0?e.className:e.bar?"ol-scale-bar":"ol-scale-line";this.innerElement_=document.createElement("div"),this.innerElement_.className=n+"-inner",this.element.className=n+" "+ht,this.element.appendChild(this.innerElement_),this.viewState_=null,this.minWidth_=e.minWidth!==void 0?e.minWidth:64,this.maxWidth_=e.maxWidth,this.renderedVisible_=!1,this.renderedWidth_=void 0,this.renderedHTML_="",this.addChangeListener(ce,this.handleUnitsChanged_),this.setUnits(e.units||"metric"),this.scaleBar_=e.bar||!1,this.scaleBarSteps_=e.steps||4,this.scaleBarText_=e.text||!1,this.dpi_=e.dpi||void 0}getUnits(){return this.get(ce)}handleUnitsChanged_(){this.updateElement_()}setUnits(e){this.set(ce,e)}setDpi(e){this.dpi_=e}updateElement_(){const e=this.viewState_;if(!e){this.renderedVisible_&&(this.element.style.display="none",this.renderedVisible_=!1);return}const t=e.center,n=e.projection,r=this.getUnits(),a=r=="degrees"?"degrees":"m";let i=ee(n,e.resolution,t,a);const s=this.minWidth_*(this.dpi_||W)/W,l=this.maxWidth_!==void 0?this.maxWidth_*(this.dpi_||W)/W:void 0;let c=s*i,o="";if(r=="degrees"){const x=pt.degrees;c*=x,c<x/60?(o="″",i*=3600):c<x?(o="′",i*=60):o="°"}else if(r=="imperial")c<.9144?(o="in",i/=.0254):c<1609.344?(o="ft",i/=.3048):(o="mi",i/=1609.344);else if(r=="nautical")i/=1852,o="NM";else if(r=="metric")c<1e-6?(o="nm",i*=1e9):c<.001?(o="μm",i*=1e6):c<1?(o="mm",i*=1e3):c<1e3?o="m":(o="km",i/=1e3);else if(r=="us")c<.9144?(o="in",i*=39.37):c<1609.344?(o="ft",i/=.30480061):(o="mi",i/=1609.3472);else throw new Error("Invalid units");let p=3*Math.floor(Math.log(s*i)/Math.log(10)),d,u,g,R=0,f,m;for(;;){g=Math.floor(p/3);const x=Math.pow(10,g);if(d=Xt[(p%3+3)%3]*x,u=Math.round(d/i),isNaN(u)){this.element.style.display="none",this.renderedVisible_=!1;return}if(l!==void 0&&u>=l){d=R,u=f,g=m;break}else if(u>=s)break;R=d,f=u,m=g,++p}const T=this.scaleBar_?this.createScaleBar(u,d,o):d.toFixed(g<0?-g:0)+" "+o;this.renderedHTML_!=T&&(this.innerElement_.innerHTML=T,this.renderedHTML_=T),this.renderedWidth_!=u&&(this.innerElement_.style.width=u+"px",this.renderedWidth_=u),this.renderedVisible_||(this.element.style.display="",this.renderedVisible_=!0)}createScaleBar(e,t,n){const r=this.getScaleForResolution(),a=r<1?Math.round(1/r).toLocaleString()+" : 1":"1 : "+Math.round(r).toLocaleString(),i=this.scaleBarSteps_,s=e/i,l=[this.createMarker("absolute")];for(let o=0;o<i;++o){const p=o%2===0?"ol-scale-singlebar-odd":"ol-scale-singlebar-even";l.push(`<div><div class="ol-scale-singlebar ${p}" style="width: ${s}px;"></div>`+this.createMarker("relative")+(o%2===0||i===2?this.createStepText(o,e,!1,t,n):"")+"</div>")}return l.push(this.createStepText(i,e,!0,t,n)),(this.scaleBarText_?`<div class="ol-scale-text" style="width: ${e}px;">`+a+"</div>":"")+l.join("")}createMarker(e){return`<div class="ol-scale-step-marker" style="position: ${e}; top: ${e==="absolute"?3:-10}px;"></div>`}createStepText(e,t,n,r,a){const s=(e===0?0:Math.round(r/this.scaleBarSteps_*e*100)/100)+(e===0?"":" "+a),l=e===0?-3:t/this.scaleBarSteps_*-1,c=e===0?0:t/this.scaleBarSteps_*2;return`<div class="ol-scale-step-text" style="margin-left: ${l}px;text-align: ${e===0?"left":"center"};min-width: ${c}px;left: ${n?t+"px":"unset"};">`+s+"</div>"}getScaleForResolution(){const e=ee(this.viewState_.projection,this.viewState_.resolution,this.viewState_.center,"m"),t=this.dpi_||W,n=1e3/25.4;return e*n*t}render(e){const t=e.frameState;t?this.viewState_=t.viewState:this.viewState_=null,this.updateElement_()}}class qt{constructor(){we(this,"pushMethodArgs_",(...e)=>(this.push_(e),this));this.instructions_=[],this.zIndex=0,this.offset_=0,this.context_=new Proxy(Me(),{get:(e,t)=>{if(typeof Me()[t]=="function")return this.push_(t),this.pushMethodArgs_},set:(e,t,n)=>(this.push_(t,n),!0)})}push_(...e){const t=this.instructions_,n=this.zIndex+this.offset_;t[n]||(t[n]=[]),t[n].push(...e)}pushFunction(e){this.push_(e)}getContext(){return this.context_}draw(e){this.instructions_.forEach(t=>{for(let n=0,r=t.length;n<r;++n){const a=t[n];if(typeof a=="function"){a(e);continue}const i=t[++n];if(typeof e[a]=="function")e[a](...i);else{if(typeof i=="function"){e[a]=i(e);continue}e[a]=i}}})}clear(){this.instructions_.length=0,this.zIndex=0,this.offset_=0}offset(){this.offset_=this.instructions_.length,this.zIndex=0}}let F=null;function $t(){F=Ae(1,1,void 0,{willReadFrequently:!0})}class Qt extends gt{constructor(e){super(e),this.container=null,this.renderedResolution,this.tempTransform=ae(),this.pixelTransform=ae(),this.inversePixelTransform=ae(),this.context=null,this.deferredContext_=null,this.containerReused=!1,this.frameState=null}getImageData(e,t,n){F||$t(),F.clearRect(0,0,1,1);let r;try{F.drawImage(e,t,n,1,1,0,0,1,1),r=F.getImageData(0,0,1,1).data}catch{return F=null,null}return r}getBackground(e){let n=this.getLayer().getBackground();return typeof n=="function"&&(n=n(e.viewState.resolution)),n||void 0}useContainer(e,t,n){const r=this.getLayer().getClassName();let a,i;if(e&&e.className===r&&(!n||e&&e.style.backgroundColor&&ft(je(e.style.backgroundColor),je(n)))){const s=e.firstElementChild;mt(s)&&(i=s.getContext("2d"))}if(i&&Tt(i.canvas.style.transform,t)?(this.container=e,this.context=i,this.containerReused=!0):this.containerReused?(this.container=null,this.context=null,this.containerReused=!1):this.container&&(this.container.style.backgroundColor=null),!this.container){a=xt?yt():document.createElement("div"),a.className=r;let s=a.style;s.position="absolute",s.width="100%",s.height="100%",i=Ae();const l=i.canvas;a.appendChild(l),s=l.style,s.position="absolute",s.left="0",s.transformOrigin="top left",this.container=a,this.context=i}!this.containerReused&&n&&!this.container.style.backgroundColor&&(this.container.style.backgroundColor=n)}clipUnrotated(e,t,n){const r=ge(n),a=Rt(n),i=vt(n),s=_t(n);j(t.coordinateToPixelTransform,r),j(t.coordinateToPixelTransform,a),j(t.coordinateToPixelTransform,i),j(t.coordinateToPixelTransform,s);const l=this.inversePixelTransform;j(l,r),j(l,a),j(l,i),j(l,s),e.save(),e.beginPath(),e.moveTo(Math.round(r[0]),Math.round(r[1])),e.lineTo(Math.round(a[0]),Math.round(a[1])),e.lineTo(Math.round(i[0]),Math.round(i[1])),e.lineTo(Math.round(s[0]),Math.round(s[1])),e.clip()}prepareContainer(e,t){const n=e.extent,r=e.viewState.resolution,a=e.viewState.rotation,i=e.pixelRatio,s=Math.round(ke(n)/r*i),l=Math.round(wt(n)/r*i);ue(this.pixelTransform,e.size[0]/2,e.size[1]/2,1/i,1/i,a,-s/2,-l/2),Ct(this.inversePixelTransform,this.pixelTransform);const c=Et(this.pixelTransform);if(this.useContainer(t,c,this.getBackground(e)),!this.containerReused){const o=this.context.canvas;o.width!=s||o.height!=l?(o.width=s,o.height=l):this.context.clearRect(0,0,s,l),c!==o.style.transform&&(o.style.transform=c)}}dispatchRenderEvent_(e,t,n){const r=this.getLayer();if(r.hasListener(e)){const a=new St(e,this.inversePixelTransform,n,t);r.dispatchEvent(a)}}preRender(e,t){this.frameState=t,!t.declutter&&this.dispatchRenderEvent_(J.PRERENDER,e,t)}postRender(e,t){t.declutter||this.dispatchRenderEvent_(J.POSTRENDER,e,t)}renderDeferredInternal(e){}getRenderContext(e){return e.declutter&&!this.deferredContext_&&(this.deferredContext_=new qt),e.declutter?this.deferredContext_.getContext():this.context}renderDeferred(e){e.declutter&&(this.dispatchRenderEvent_(J.PRERENDER,this.context,e),e.declutter&&this.deferredContext_&&(this.deferredContext_.draw(this.context),this.deferredContext_.clear()),this.renderDeferredInternal(e),this.dispatchRenderEvent_(J.POSTRENDER,this.context,e))}getRenderTransform(e,t,n,r,a,i,s){const l=a/2,c=i/2,o=r/t,p=-o,d=-e[0]+s,u=-e[1];return ue(this.tempTransform,l,c,o,p,-n,d,u)}disposeInternal(){delete this.frameState,super.disposeInternal()}}function de(h,e,t){if(!(t in h))return h[t]=new Set([e]),!0;const n=h[t],r=n.has(e);return r||n.add(e),!r}function Ht(h,e,t){const n=h[t];return n?n.delete(e):!1}function Ue(h,e){const t=h.layerStatesArray[h.layerIndex];t.extent&&(e=he(e,Fe(t.extent,h.viewState.projection)));const n=t.layer.getRenderSource();if(!n.getWrapX()){const r=n.getTileGridForProjection(h.viewState.projection).getExtent();r&&(e=he(e,r))}return e}class Jt extends Qt{constructor(e,t){super(e),t=t||{},this.extentChanged=!0,this.renderComplete=!1,this.renderedExtent_=null,this.renderedPixelRatio,this.renderedProjection=null,this.renderedTiles=[],this.renderedSourceKey_,this.renderedSourceRevision_,this.tempExtent=Pt(),this.tempTileRange_=new Mt(0,0,0,0),this.tempTileCoord_=be(0,0,0);const n=t.cacheSize!==void 0?t.cacheSize:512;this.tileCache_=new Le(n),this.sourceTileCache_=null,this.layerExtent=null,this.maxStaleKeys=n*.5}getTileCache(){return this.tileCache_}getSourceTileCache(){return this.sourceTileCache_||(this.sourceTileCache_=new Le(512)),this.sourceTileCache_}getOrCreateTile(e,t,n,r){const a=this.tileCache_,s=this.getLayer().getSource(),l=le(s,s.getKey(),e,t,n);let c;if(a.containsKey(l))c=a.get(l);else{const o=r.viewState.projection,p=s.getProjection();if(c=s.getTile(e,t,n,r.pixelRatio,o,!p||jt(p,o)?void 0:this.getSourceTileCache()),!c)return null;a.set(l,c)}return c}getTile(e,t,n,r){const a=this.getOrCreateTile(e,t,n,r);return a||null}getData(e){const t=this.frameState;if(!t)return null;const n=this.getLayer(),r=j(t.pixelToCoordinateTransform,e.slice()),a=n.getExtent();if(a&&!bt(a,r))return null;const i=t.viewState,s=n.getRenderSource(),l=s.getTileGridForProjection(i.projection),c=s.getTilePixelRatio(t.pixelRatio);for(let o=l.getZForResolution(i.resolution);o>=l.getMinZoom();--o){const p=l.getTileCoordForCoordAndZ(r,o),d=this.getTile(o,p[1],p[2],t);if(!d||d.getState()!==G.LOADED)continue;const u=l.getOrigin(o),g=Lt(l.getTileSize(o)),R=l.getResolution(o);let f;if(d instanceof It||d instanceof Dt)f=d.getImage();else if(d instanceof Ie){if(f=De(d.getData()),!f)continue}else continue;const m=Math.floor(c*((r[0]-u[0])/R-p[1]*g[0])),T=Math.floor(c*((u[1]-r[1])/R-p[2]*g[1])),x=Math.round(c*s.getGutterForProjection(i.projection));return this.getImageData(f,m+x,T+x)}return null}prepareFrame(e){var r;this.renderedProjection?e.viewState.projection!==this.renderedProjection&&(this.tileCache_.clear(),this.renderedProjection=e.viewState.projection):this.renderedProjection=e.viewState.projection;const t=this.getLayer().getSource();if(!t)return!1;const n=t.getRevision();return this.renderedSourceRevision_?this.renderedSourceRevision_!==n&&(this.renderedSourceRevision_=n,this.renderedSourceKey_===t.getKey()&&(this.tileCache_.clear(),(r=this.sourceTileCache_)==null||r.clear())):this.renderedSourceRevision_=n,!0}enqueueTilesForNextExtent(){return!0}enqueueTiles(e,t,n,r,a){const i=e.viewState,s=this.getLayer(),l=s.getRenderSource(),c=l.getTileGridForProjection(i.projection),o=k(l);o in e.wantedTiles||(e.wantedTiles[o]={});const p=e.wantedTiles[o],d=s.getMapInternal(),u=Math.max(n-a,c.getMinZoom(),c.getZForResolution(Math.min(s.getMaxResolution(),d?d.getView().getResolutionForZoom(Math.max(s.getMinZoom(),0)):c.getResolution(0)),l.zDirection)),g=i.rotation,R=g?Gt(i.center,i.resolution,g,e.size):void 0;for(let f=n;f>=u;--f){const m=c.getTileRangeForExtentAndZ(t,f,this.tempTileRange_),T=c.getResolution(f);for(let x=m.minX;x<=m.maxX;++x)for(let S=m.minY;S<=m.maxY;++S){if(g&&!c.tileCoordIntersectsViewport([f,x,S],R))continue;const _=this.getTile(f,x,S,e);if(!_||!de(r,_,f))continue;const b=_.getKey();if(p[b]=!0,_.getState()===G.IDLE&&!e.tileQueue.isKeyQueued(b)){const z=be(f,x,S,this.tempTileCoord_);e.tileQueue.enqueue([_,o,c.getTileCoordCenter(z),T])}}}}findStaleTile_(e,t){const n=this.tileCache_,r=e[0],a=e[1],i=e[2],s=this.getStaleKeys();for(let l=0;l<s.length;++l){const c=le(this.getLayer().getSource(),s[l],r,a,i);if(n.containsKey(c)){const o=n.peek(c);if(o.getState()===G.LOADED)return o.endTransition(k(this)),de(t,o,r),!0}}return!1}findAltTiles_(e,t,n,r){const a=e.getTileRangeForTileCoordAndZ(t,n,this.tempTileRange_);if(!a)return!1;let i=!0;const s=this.tileCache_,l=this.getLayer().getRenderSource(),c=l.getKey();for(let o=a.minX;o<=a.maxX;++o)for(let p=a.minY;p<=a.maxY;++p){const d=le(l,c,n,o,p);let u=!1;if(s.containsKey(d)){const g=s.peek(d);g.getState()===G.LOADED&&(de(r,g,n),u=!0)}u||(i=!1)}return i}renderFrame(e,t){this.renderComplete=!0;const n=e.layerStatesArray[e.layerIndex],r=e.viewState,a=r.projection,i=r.resolution,s=r.center,l=e.pixelRatio,c=this.getLayer(),o=c.getSource(),p=o.getTileGridForProjection(a),d=p.getZForResolution(i,o.zDirection),u=p.getResolution(d),g=o.getKey();this.renderedSourceKey_?this.renderedSourceKey_!==g&&(this.prependStaleKey(this.renderedSourceKey_),this.renderedSourceKey_=g):this.renderedSourceKey_=g;let R=e.extent;const f=o.getTilePixelRatio(l);this.prepareContainer(e,t);const m=this.context.canvas.width,T=this.context.canvas.height;this.layerExtent=n.extent?Fe(n.extent):null,this.layerExtent&&(R=he(R,this.layerExtent));const x=u*m/2/f,S=u*T/2/f,_=[s[0]-x,s[1]-S,s[0]+x,s[1]+S],v={};this.renderedTiles.length=0;const b=c.getPreload();if(e.nextExtent&&this.enqueueTilesForNextExtent()){const w=p.getZForResolution(r.nextResolution,o.zDirection),C=Ue(e,e.nextExtent);this.enqueueTiles(e,C,w,v,b)}const z=Ue(e,R);if(this.enqueueTiles(e,z,d,v,0),b>0&&setTimeout(()=>{this.enqueueTiles(e,z,d-1,v,b-1)},0),!(d in v))return this.container;const fe=k(this),Ve=e.time;for(const w of v[d]){const C=w.getState();if(C===G.EMPTY)continue;const L=w.tileCoord;if(C===G.LOADED&&w.getAlpha(fe,Ve)===1){w.endTransition(fe);continue}if(C!==G.ERROR&&(this.renderComplete=!1),this.findStaleTile_(L,v)){Ht(v,w,d),e.animate=!0;continue}if(this.findAltTiles_(p,L,d+1,v))continue;const A=p.getMinZoom();for(let M=d-1;M>=A&&!this.findAltTiles_(p,L,M,v);--M);}const B=u/i*l/f,y=this.getRenderContext(e);ue(this.tempTransform,m/2,T/2,B,B,0,-m/2,-T/2),this.layerExtent&&this.clipUnrotated(y,e,this.layerExtent),o.getInterpolate()||(y.imageSmoothingEnabled=!1),this.preRender(y,e);const N=Object.keys(v).map(Number);N.sort(zt);let P;const ie=[],me=[];for(let w=N.length-1;w>=0;--w){const C=N[w],L=o.getTilePixelSize(C,l,a),U=p.getResolution(C)/u,A=L[0]*U*B,M=L[1]*U*B,O=p.getTileCoordForCoordAndZ(ge(_),C),Te=p.getTileCoordExtent(O),K=j(this.tempTransform,[f*(Te[0]-_[0])/u,f*(_[3]-Te[3])/u]),We=f*o.getGutterForProjection(a);for(const V of v[C]){if(V.getState()!==G.LOADED)continue;const xe=V.tileCoord,ye=O[1]-xe[1],Be=Math.round(K[0]-(ye-1)*A),Re=O[2]-xe[2],Ne=Math.round(K[1]-(Re-1)*M),I=Math.round(K[0]-ye*A),D=Math.round(K[1]-Re*M),Z=Be-I,X=Ne-D,ve=N.length===1;let se=!1;P=[I,D,I+Z,D,I+Z,D+X,I,D+X];for(let Y=0,Oe=ie.length;Y<Oe;++Y)if(!ve&&C<me[Y]){const E=ie[Y];Ut([I,D,I+Z,D+X],[E[0],E[3],E[4],E[7]])&&(se||(y.save(),se=!0),y.beginPath(),y.moveTo(P[0],P[1]),y.lineTo(P[2],P[3]),y.lineTo(P[4],P[5]),y.lineTo(P[6],P[7]),y.moveTo(E[6],E[7]),y.lineTo(E[4],E[5]),y.lineTo(E[2],E[3]),y.lineTo(E[0],E[1]),y.clip())}ie.push(P),me.push(C),this.drawTile(V,e,I,D,Z,X,We,ve),se&&y.restore(),this.renderedTiles.unshift(V),this.updateUsedTiles(e.usedTiles,o,V)}}if(this.renderedResolution=u,this.extentChanged=!this.renderedExtent_||!At(this.renderedExtent_,_),this.renderedExtent_=_,this.renderedPixelRatio=l,this.postRender(this.context,e),this.layerExtent&&y.restore(),y.imageSmoothingEnabled=!0,this.renderComplete){const w=(C,L)=>{var M;const oe=k(o),U=L.wantedTiles[oe],A=U?Object.keys(U).length:0;this.updateCacheSize(A),this.tileCache_.expireCache(),(M=this.sourceTileCache_)==null||M.expireCache()};e.postRenderFunctions.push(w)}return this.container}updateCacheSize(e){this.tileCache_.highWaterMark=Math.max(this.tileCache_.highWaterMark,e*2)}drawTile(e,t,n,r,a,i,s,l){let c;if(e instanceof Ie){if(c=De(e.getData()),!c)throw new Error("Rendering array data is not yet supported")}else c=this.getTileImage(e);if(!c)return;const o=this.getRenderContext(t),p=k(this),d=t.layerStatesArray[t.layerIndex],u=d.opacity*(l?e.getAlpha(p,t.time):1),g=u!==o.globalAlpha;g&&(o.save(),o.globalAlpha=u),o.drawImage(c,s,s,c.width-2*s,c.height-2*s,n,r,a,i),g&&o.restore(),u!==d.opacity?t.animate=!0:l&&e.endTransition(p)}getImage(){const e=this.context;return e?e.canvas:null}getTileImage(e){return e.getImage()}updateUsedTiles(e,t,n){const r=k(t);r in e||(e[r]={}),e[r][n.getKey()]=!0}}class en extends kt{constructor(e){super(e)}createRenderer(){return new Jt(this,{cacheSize:this.getCacheSize()})}}var te,ne,re;class tn{constructor(){$(this,te,"https://t{0-7}.tianditu.gov.cn/");$(this,ne,"e1f2618711e8858b50bb0a1d4a715fa9");$(this,re,{vec:["vec","cva"],img:["img","cia"]})}createTileLayerGroup(e,t=!0){const n=q(this,re)[e].map(r=>this.createTileLayer(r));return new Ft({layers:n,visible:t,properties:{name:e}})}createTileLayer(e){return new en({source:this.createXYZSource(e),properties:{name:e}})}createXYZSource(e){return new Vt({url:q(this,te)+e+"_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER="+e+"&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk="+q(this,ne),tileGrid:nn(pe("EPSG:3857"))})}}te=new WeakMap,ne=new WeakMap,re=new WeakMap;function nn(h){const e=h.getExtent(),t=ge(e),n=ke(e),r=new Array(18),a=new Array(18);for(let i=0;i<18;++i)r[i]=n/(256*Math.pow(2,i)),a[i]=i;return new Ot({origin:t,resolutions:r,matrixIds:a})}const rn={class:"panel"},on=lt({name:"ProjectionAndScale"}),sn=Object.assign(on,{setup(h){const e=Ce([{fileName:"@/views/projection/projectionAndScale/index.vue",rawCode:Kt,language:"html"},{fileName:"@/utils/layer/tdt.js",rawCode:Zt,language:"js"}]),t=Qe("mapDivRef");let n=null;const a=new tn().createTileLayerGroup("vec"),i=[{label:"Web墨卡托(EPSG:3857)",value:"EPSG:3857"},{label:"WGS 84(EPSG:4326)",value:"EPSG:4326"}],s=Ce("EPSG:3857"),l=pe(s.value),c=new Yt({units:"metric",bar:!0,steps:4,text:!0,minWidth:140});He(()=>{setTimeout(()=>{o()},0)}),Je(()=>{n&&(n.setTarget(void 0),n=null)});function o(){n=new Wt({controls:Bt([]).extend([c]),layers:[a],target:t.value,view:new Ge({center:ze([113.626373,34.748782],"EPSG:4326",l),zoom:8,projection:l})});const d=ct(()=>{n&&(console.log("刷新地图尺寸"),n.updateSize())},300);et(t,d)}function p(){const d=n.getView(),u=d.getProjection(),g=d.getResolution(),R=d.getCenter(),f=d.getRotation(),m=pe(s.value),T=ze(R,u,m),x=u.getMetersPerUnit(),S=m.getMetersPerUnit(),_=ee(u,1/x,R,"m")*x,v=ee(m,1/S,T,"m")*S,b=g*_/v,z=new Ge({center:T,resolution:b,rotation:f,projection:m});n.setView(z)}return(d,u)=>{const g=at,R=nt,f=qe,m=Ye;return Ee(),tt(Nt,{codeBlocks:Pe(e)},{default:Q(()=>[Se("div",{class:"projection-and-scale",ref_key:"mapDivRef",ref:t},[Se("div",rn,[H(m,{"label-suffix":":","label-width":"auto"},{default:Q(()=>[H(f,{label:"视图投影"},{default:Q(()=>[H(R,{modelValue:Pe(s),"onUpdate:modelValue":u[0]||(u[0]=T=>rt(s)?s.value=T:null),placeholder:"请选择投影",onChange:p},{default:Q(()=>[(Ee(),it(ot,null,st(i,T=>H(g,{key:T.value,label:T.label,value:T.value},null,8,["label","value"])),64))]),_:1},8,["modelValue"])]),_:1})]),_:1})])],512)]),_:1},8,["codeBlocks"])}}}),pn=$e(sn,[["__scopeId","data-v-8305554a"]]);export{pn as default};
