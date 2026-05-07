var Oe=Object.defineProperty;var ye=h=>{throw TypeError(h)};var Ze=(h,e,t)=>e in h?Oe(h,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):h[e]=t;var Ce=(h,e,t)=>Ze(h,typeof e!="symbol"?e+"":e,t),Xe=(h,e,t)=>e.has(h)||ye("Cannot "+t);var Y=(h,e,t)=>(Xe(h,e,"read from private field"),t?t.call(h):e.get(h)),$=(h,e,t)=>e.has(h)?ye("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(h):e.set(h,t);import{a as qe,E as Ye}from"./el-form-item-awC4PQnv.js";import{_ as $e,r as we,ah as He,F as Qe,G as Je,ai as et,o as Ee,m as tt,f as H,h as Se,e as Q,W as nt,Q as it,i as Pe,c as rt,X as st,Y as ot,Z as at,H as lt}from"./index-z_CaaXbb.js";/* empty css                */import{aD as ct,aL as dt,aM as ut,aN as ee,aO as ht,aP as Me,L as pt,c as ae,aQ as gt,a0 as je,aR as ft,aS as mt,ab as xt,aT as Tt,l as ze,af as ge,aU as _t,aV as vt,aW as Rt,F as j,ad as Ae,ae as yt,d as ue,aE as Ct,aX as wt,o as Et,n as J,ag as St,p as Pt,q as be,r as Le,at as le,w as Mt,J as jt,f as G,t as bt,I as Lt,R as It,i as Ie,j as De,g as A,v as Dt,H as Ve,G as he,aY as Gt,aZ as Ut,a_ as kt,a3 as zt,a$ as At,X as Vt,ax as pe,M as Bt,V as Ge,b0 as Ue,b1 as Ft,D as Kt}from"./XYZ-CcmNesYt.js";import"./index-Co_r3obg.js";class Wt extends ct{constructor(e){super({extent:e.extent,origin:e.origin,origins:e.origins,resolutions:e.resolutions,tileSize:e.tileSize,tileSizes:e.tileSizes,sizes:e.sizes}),this.matrixIds_=e.matrixIds}getMatrixId(e){return this.matrixIds_[e]}getMatrixIds(){return this.matrixIds_}}const Nt=`<template>\r
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
import { useResizeObserver } from "@vueuse/core";\r
\r
import Tianditu from "@/utils/layer/tdt.js";\r
\r
const codeBlocks = ref([\r
  {\r
    fileName: "@/views/projection/projectionAndScale/index.vue",\r
    rawCode: IndexSourceCode,\r
    language: "html",\r
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
      center: transform([0, 52], "EPSG:4326", projection),\r
      zoom: 6,\r
      projection: projection,\r
    }),\r
  });\r
\r
  useResizeObserver(mapDivRef, () => {\r
    map.updateSize();\r
  });\r
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
  /* 4. 计算新分辨率（像素代表多少地图单位）：\r
   *  - 新分辨率 = 旧分辨率 * 旧点分辨率 / 新点分辨率\r
   *  - 其中，旧点分辨率 = 旧投影下的点分辨率（1米 = 1像素）\r
   *  - 新点分辨率 = 新投影下的点分辨率（1度 = 1像素）\r
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
    box-shadow:\r
      rgba(195, 191, 188, 0.7) 0px 1px 2px 0px,\r
      rgba(195, 191, 188, 0.85) 0px 2px 4px 2px;\r
  }\r
}\r
\r
:deep(.el-form-item) {\r
  margin-bottom: 0;\r
}\r
</style>\r
`,ce="units",Ot=[1,2,5],F=25.4/.28;class Zt extends dt{constructor(e){e=e||{};const t=document.createElement("div");t.style.pointerEvents="none",super({element:t,render:e.render,target:e.target}),this.on,this.once,this.un;const n=e.className!==void 0?e.className:e.bar?"ol-scale-bar":"ol-scale-line";this.innerElement_=document.createElement("div"),this.innerElement_.className=n+"-inner",this.element.className=n+" "+ut,this.element.appendChild(this.innerElement_),this.viewState_=null,this.minWidth_=e.minWidth!==void 0?e.minWidth:64,this.maxWidth_=e.maxWidth,this.renderedVisible_=!1,this.renderedWidth_=void 0,this.renderedHTML_="",this.addChangeListener(ce,this.handleUnitsChanged_),this.setUnits(e.units||"metric"),this.scaleBar_=e.bar||!1,this.scaleBarSteps_=e.steps||4,this.scaleBarText_=e.text||!1,this.dpi_=e.dpi||void 0}getUnits(){return this.get(ce)}handleUnitsChanged_(){this.updateElement_()}setUnits(e){this.set(ce,e)}setDpi(e){this.dpi_=e}updateElement_(){const e=this.viewState_;if(!e){this.renderedVisible_&&(this.element.style.display="none",this.renderedVisible_=!1);return}const t=e.center,n=e.projection,i=this.getUnits(),a=i=="degrees"?"degrees":"m";let r=ee(n,e.resolution,t,a);const o=this.minWidth_*(this.dpi_||F)/F,l=this.maxWidth_!==void 0?this.maxWidth_*(this.dpi_||F)/F:void 0;let c=o*r,s="";if(i=="degrees"){const T=ht.degrees;c*=T,c<T/60?(s="″",r*=3600):c<T?(s="′",r*=60):s="°"}else if(i=="imperial")c<.9144?(s="in",r/=.0254):c<1609.344?(s="ft",r/=.3048):(s="mi",r/=1609.344);else if(i=="nautical")r/=1852,s="NM";else if(i=="metric")c<1e-6?(s="nm",r*=1e9):c<.001?(s="μm",r*=1e6):c<1?(s="mm",r*=1e3):c<1e3?s="m":(s="km",r/=1e3);else if(i=="us")c<.9144?(s="in",r*=39.37):c<1609.344?(s="ft",r/=.30480061):(s="mi",r/=1609.3472);else throw new Error("Invalid units");let p=3*Math.floor(Math.log(o*r)/Math.log(10)),d,u,g,v=0,f,m;for(;;){g=Math.floor(p/3);const T=Math.pow(10,g);if(d=Ot[(p%3+3)%3]*T,u=Math.round(d/r),isNaN(u)){this.element.style.display="none",this.renderedVisible_=!1;return}if(l!==void 0&&u>=l){d=v,u=f,g=m;break}else if(u>=o)break;v=d,f=u,m=g,++p}const x=this.scaleBar_?this.createScaleBar(u,d,s):d.toFixed(g<0?-g:0)+" "+s;this.renderedHTML_!=x&&(this.innerElement_.innerHTML=x,this.renderedHTML_=x),this.renderedWidth_!=u&&(this.innerElement_.style.width=u+"px",this.renderedWidth_=u),this.renderedVisible_||(this.element.style.display="",this.renderedVisible_=!0)}createScaleBar(e,t,n){const i=this.getScaleForResolution(),a=i<1?Math.round(1/i).toLocaleString()+" : 1":"1 : "+Math.round(i).toLocaleString(),r=this.scaleBarSteps_,o=e/r,l=[this.createMarker("absolute")];for(let s=0;s<r;++s){const p=s%2===0?"ol-scale-singlebar-odd":"ol-scale-singlebar-even";l.push(`<div><div class="ol-scale-singlebar ${p}" style="width: ${o}px;"></div>`+this.createMarker("relative")+(s%2===0||r===2?this.createStepText(s,e,!1,t,n):"")+"</div>")}return l.push(this.createStepText(r,e,!0,t,n)),(this.scaleBarText_?`<div class="ol-scale-text" style="width: ${e}px;">`+a+"</div>":"")+l.join("")}createMarker(e){return`<div class="ol-scale-step-marker" style="position: ${e}; top: ${e==="absolute"?3:-10}px;"></div>`}createStepText(e,t,n,i,a){const o=(e===0?0:Math.round(i/this.scaleBarSteps_*e*100)/100)+(e===0?"":" "+a),l=e===0?-3:t/this.scaleBarSteps_*-1,c=e===0?0:t/this.scaleBarSteps_*2;return`<div class="ol-scale-step-text" style="margin-left: ${l}px;text-align: ${e===0?"left":"center"};min-width: ${c}px;left: ${n?t+"px":"unset"};">`+o+"</div>"}getScaleForResolution(){const e=ee(this.viewState_.projection,this.viewState_.resolution,this.viewState_.center,"m"),t=this.dpi_||F,n=1e3/25.4;return e*n*t}render(e){const t=e.frameState;t?this.viewState_=t.viewState:this.viewState_=null,this.updateElement_()}}class Xt{constructor(){Ce(this,"pushMethodArgs_",(...e)=>(this.push_(e),this));this.instructions_=[],this.zIndex=0,this.offset_=0,this.context_=new Proxy(Me(),{get:(e,t)=>{if(typeof Me()[t]=="function")return this.push_(t),this.pushMethodArgs_},set:(e,t,n)=>(this.push_(t,n),!0)})}push_(...e){const t=this.instructions_,n=this.zIndex+this.offset_;t[n]||(t[n]=[]),t[n].push(...e)}pushFunction(e){this.push_(e)}getContext(){return this.context_}draw(e){this.instructions_.forEach(t=>{for(let n=0,i=t.length;n<i;++n){const a=t[n];if(typeof a=="function"){a(e);continue}const r=t[++n];if(typeof e[a]=="function")e[a](...r);else{if(typeof r=="function"){e[a]=r(e);continue}e[a]=r}}})}clear(){this.instructions_.length=0,this.zIndex=0,this.offset_=0}offset(){this.offset_=this.instructions_.length,this.zIndex=0}}let V=null;function qt(){V=ze(1,1,void 0,{willReadFrequently:!0})}class Yt extends pt{constructor(e){super(e),this.container=null,this.renderedResolution,this.tempTransform=ae(),this.pixelTransform=ae(),this.inversePixelTransform=ae(),this.context=null,this.deferredContext_=null,this.containerReused=!1,this.frameState=null}getImageData(e,t,n){V||qt(),V.clearRect(0,0,1,1);let i;try{V.drawImage(e,t,n,1,1,0,0,1,1),i=V.getImageData(0,0,1,1).data}catch{return V=null,null}return i}getBackground(e){let n=this.getLayer().getBackground();return typeof n=="function"&&(n=n(e.viewState.resolution)),n||void 0}useContainer(e,t,n){const i=this.getLayer().getClassName();let a,r;if(e&&e.className===i&&(!n||e&&e.style.backgroundColor&&gt(je(e.style.backgroundColor),je(n)))){const o=e.firstElementChild;ft(o)&&(r=o.getContext("2d"))}if(r&&mt(r.canvas.style.transform,t)?(this.container=e,this.context=r,this.containerReused=!0):this.containerReused?(this.container=null,this.context=null,this.containerReused=!1):this.container&&(this.container.style.backgroundColor=null),!this.container){a=xt?Tt():document.createElement("div"),a.className=i;let o=a.style;o.position="absolute",o.width="100%",o.height="100%",r=ze();const l=r.canvas;a.appendChild(l),o=l.style,o.position="absolute",o.left="0",o.transformOrigin="top left",this.container=a,this.context=r}!this.containerReused&&n&&!this.container.style.backgroundColor&&(this.container.style.backgroundColor=n)}clipUnrotated(e,t,n){const i=ge(n),a=_t(n),r=vt(n),o=Rt(n);j(t.coordinateToPixelTransform,i),j(t.coordinateToPixelTransform,a),j(t.coordinateToPixelTransform,r),j(t.coordinateToPixelTransform,o);const l=this.inversePixelTransform;j(l,i),j(l,a),j(l,r),j(l,o),e.save(),e.beginPath(),e.moveTo(Math.round(i[0]),Math.round(i[1])),e.lineTo(Math.round(a[0]),Math.round(a[1])),e.lineTo(Math.round(r[0]),Math.round(r[1])),e.lineTo(Math.round(o[0]),Math.round(o[1])),e.clip()}prepareContainer(e,t){const n=e.extent,i=e.viewState.resolution,a=e.viewState.rotation,r=e.pixelRatio,o=Math.round(Ae(n)/i*r),l=Math.round(yt(n)/i*r);ue(this.pixelTransform,e.size[0]/2,e.size[1]/2,1/r,1/r,a,-o/2,-l/2),Ct(this.inversePixelTransform,this.pixelTransform);const c=wt(this.pixelTransform);if(this.useContainer(t,c,this.getBackground(e)),!this.containerReused){const s=this.context.canvas;s.width!=o||s.height!=l?(s.width=o,s.height=l):this.context.clearRect(0,0,o,l),c!==s.style.transform&&(s.style.transform=c)}}dispatchRenderEvent_(e,t,n){const i=this.getLayer();if(i.hasListener(e)){const a=new Et(e,this.inversePixelTransform,n,t);i.dispatchEvent(a)}}preRender(e,t){this.frameState=t,!t.declutter&&this.dispatchRenderEvent_(J.PRERENDER,e,t)}postRender(e,t){t.declutter||this.dispatchRenderEvent_(J.POSTRENDER,e,t)}renderDeferredInternal(e){}getRenderContext(e){return e.declutter&&!this.deferredContext_&&(this.deferredContext_=new Xt),e.declutter?this.deferredContext_.getContext():this.context}renderDeferred(e){e.declutter&&(this.dispatchRenderEvent_(J.PRERENDER,this.context,e),e.declutter&&this.deferredContext_&&(this.deferredContext_.draw(this.context),this.deferredContext_.clear()),this.renderDeferredInternal(e),this.dispatchRenderEvent_(J.POSTRENDER,this.context,e))}getRenderTransform(e,t,n,i,a,r,o){const l=a/2,c=r/2,s=i/t,p=-s,d=-e[0]+o,u=-e[1];return ue(this.tempTransform,l,c,s,p,-n,d,u)}disposeInternal(){delete this.frameState,super.disposeInternal()}}function de(h,e,t){if(!(t in h))return h[t]=new Set([e]),!0;const n=h[t],i=n.has(e);return i||n.add(e),!i}function $t(h,e,t){const n=h[t];return n?n.delete(e):!1}function ke(h,e){const t=h.layerStatesArray[h.layerIndex];t.extent&&(e=he(e,Ve(t.extent,h.viewState.projection)));const n=t.layer.getRenderSource();if(!n.getWrapX()){const i=n.getTileGridForProjection(h.viewState.projection).getExtent();i&&(e=he(e,i))}return e}class Ht extends Yt{constructor(e,t){super(e),t=t||{},this.extentChanged=!0,this.renderComplete=!1,this.renderedExtent_=null,this.renderedPixelRatio,this.renderedProjection=null,this.renderedTiles=[],this.renderedSourceKey_,this.renderedSourceRevision_,this.tempExtent=St(),this.tempTileRange_=new Pt(0,0,0,0),this.tempTileCoord_=be(0,0,0);const n=t.cacheSize!==void 0?t.cacheSize:512;this.tileCache_=new Le(n),this.sourceTileCache_=null,this.layerExtent=null,this.maxStaleKeys=n*.5}getTileCache(){return this.tileCache_}getSourceTileCache(){return this.sourceTileCache_||(this.sourceTileCache_=new Le(512)),this.sourceTileCache_}getOrCreateTile(e,t,n,i){const a=this.tileCache_,o=this.getLayer().getSource(),l=le(o,o.getKey(),e,t,n);let c;if(a.containsKey(l))c=a.get(l);else{const s=i.viewState.projection,p=o.getProjection();if(c=o.getTile(e,t,n,i.pixelRatio,s,!p||Mt(p,s)?void 0:this.getSourceTileCache()),!c)return null;a.set(l,c)}return c}getTile(e,t,n,i){const a=this.getOrCreateTile(e,t,n,i);return a||null}getData(e){const t=this.frameState;if(!t)return null;const n=this.getLayer(),i=j(t.pixelToCoordinateTransform,e.slice()),a=n.getExtent();if(a&&!jt(a,i))return null;const r=t.viewState,o=n.getRenderSource(),l=o.getTileGridForProjection(r.projection),c=o.getTilePixelRatio(t.pixelRatio);for(let s=l.getZForResolution(r.resolution);s>=l.getMinZoom();--s){const p=l.getTileCoordForCoordAndZ(i,s),d=this.getTile(s,p[1],p[2],t);if(!d||d.getState()!==G.LOADED)continue;const u=l.getOrigin(s),g=bt(l.getTileSize(s)),v=l.getResolution(s);let f;if(d instanceof Lt||d instanceof It)f=d.getImage();else if(d instanceof Ie){if(f=De(d.getData()),!f)continue}else continue;const m=Math.floor(c*((i[0]-u[0])/v-p[1]*g[0])),x=Math.floor(c*((u[1]-i[1])/v-p[2]*g[1])),T=Math.round(c*o.getGutterForProjection(r.projection));return this.getImageData(f,m+T,x+T)}return null}prepareFrame(e){var i;this.renderedProjection?e.viewState.projection!==this.renderedProjection&&(this.tileCache_.clear(),this.renderedProjection=e.viewState.projection):this.renderedProjection=e.viewState.projection;const t=this.getLayer().getSource();if(!t)return!1;const n=t.getRevision();return this.renderedSourceRevision_?this.renderedSourceRevision_!==n&&(this.renderedSourceRevision_=n,this.renderedSourceKey_===t.getKey()&&(this.tileCache_.clear(),(i=this.sourceTileCache_)==null||i.clear())):this.renderedSourceRevision_=n,!0}enqueueTilesForNextExtent(){return!0}enqueueTiles(e,t,n,i,a){const r=e.viewState,o=this.getLayer(),l=o.getRenderSource(),c=l.getTileGridForProjection(r.projection),s=A(l);s in e.wantedTiles||(e.wantedTiles[s]={});const p=e.wantedTiles[s],d=o.getMapInternal(),u=Math.max(n-a,c.getMinZoom(),c.getZForResolution(Math.min(o.getMaxResolution(),d?d.getView().getResolutionForZoom(Math.max(o.getMinZoom(),0)):c.getResolution(0)),l.zDirection)),g=r.rotation,v=g?Dt(r.center,r.resolution,g,e.size):void 0;for(let f=n;f>=u;--f){const m=c.getTileRangeForExtentAndZ(t,f,this.tempTileRange_),x=c.getResolution(f);for(let T=m.minX;T<=m.maxX;++T)for(let S=m.minY;S<=m.maxY;++S){if(g&&!c.tileCoordIntersectsViewport([f,T,S],v))continue;const y=this.getTile(f,T,S,e);if(!y||!de(i,y,f))continue;const b=y.getKey();if(p[b]=!0,y.getState()===G.IDLE&&!e.tileQueue.isKeyQueued(b)){const U=be(f,T,S,this.tempTileCoord_);e.tileQueue.enqueue([y,s,c.getTileCoordCenter(U),x])}}}}findStaleTile_(e,t){const n=this.tileCache_,i=e[0],a=e[1],r=e[2],o=this.getStaleKeys();for(let l=0;l<o.length;++l){const c=le(this.getLayer().getSource(),o[l],i,a,r);if(n.containsKey(c)){const s=n.peek(c);if(s.getState()===G.LOADED)return s.endTransition(A(this)),de(t,s,i),!0}}return!1}findAltTiles_(e,t,n,i){const a=e.getTileRangeForTileCoordAndZ(t,n,this.tempTileRange_);if(!a)return!1;let r=!0;const o=this.tileCache_,l=this.getLayer().getRenderSource(),c=l.getKey();for(let s=a.minX;s<=a.maxX;++s)for(let p=a.minY;p<=a.maxY;++p){const d=le(l,c,n,s,p);let u=!1;if(o.containsKey(d)){const g=o.peek(d);g.getState()===G.LOADED&&(de(i,g,n),u=!0)}u||(r=!1)}return r}renderFrame(e,t){this.renderComplete=!0;const n=e.layerStatesArray[e.layerIndex],i=e.viewState,a=i.projection,r=i.resolution,o=i.center,l=e.pixelRatio,c=this.getLayer(),s=c.getSource(),p=s.getTileGridForProjection(a),d=p.getZForResolution(r,s.zDirection),u=p.getResolution(d),g=s.getKey();this.renderedSourceKey_?this.renderedSourceKey_!==g&&(this.prependStaleKey(this.renderedSourceKey_),this.renderedSourceKey_=g):this.renderedSourceKey_=g;let v=e.extent;const f=s.getTilePixelRatio(l);this.prepareContainer(e,t);const m=this.context.canvas.width,x=this.context.canvas.height;this.layerExtent=n.extent?Ve(n.extent):null,this.layerExtent&&(v=he(v,this.layerExtent));const T=u*m/2/f,S=u*x/2/f,y=[o[0]-T,o[1]-S,o[0]+T,o[1]+S],R={};this.renderedTiles.length=0;const b=c.getPreload();if(e.nextExtent&&this.enqueueTilesForNextExtent()){const C=p.getZForResolution(i.nextResolution,s.zDirection),w=ke(e,e.nextExtent);this.enqueueTiles(e,w,C,R,b)}const U=ke(e,v);if(this.enqueueTiles(e,U,d,R,0),b>0&&setTimeout(()=>{this.enqueueTiles(e,U,d-1,R,b-1)},0),!(d in R))return this.container;const fe=A(this),Be=e.time;for(const C of R[d]){const w=C.getState();if(w===G.EMPTY)continue;const L=C.tileCoord;if(w===G.LOADED&&C.getAlpha(fe,Be)===1){C.endTransition(fe);continue}if(w!==G.ERROR&&(this.renderComplete=!1),this.findStaleTile_(L,R)){$t(R,C,d),e.animate=!0;continue}if(this.findAltTiles_(p,L,d+1,R))continue;const z=p.getMinZoom();for(let M=d-1;M>=z&&!this.findAltTiles_(p,L,M,R);--M);}const K=u/r*l/f,_=this.getRenderContext(e);ue(this.tempTransform,m/2,x/2,K,K,0,-m/2,-x/2),this.layerExtent&&this.clipUnrotated(_,e,this.layerExtent),s.getInterpolate()||(_.imageSmoothingEnabled=!1),this.preRender(_,e);const W=Object.keys(R).map(Number);W.sort(Gt);let P;const re=[],me=[];for(let C=W.length-1;C>=0;--C){const w=W[C],L=s.getTilePixelSize(w,l,a),k=p.getResolution(w)/u,z=L[0]*k*K,M=L[1]*k*K,N=p.getTileCoordForCoordAndZ(ge(y),w),xe=p.getTileCoordExtent(N),O=j(this.tempTransform,[f*(xe[0]-y[0])/u,f*(y[3]-xe[3])/u]),Fe=f*s.getGutterForProjection(a);for(const B of R[w]){if(B.getState()!==G.LOADED)continue;const Te=B.tileCoord,_e=N[1]-Te[1],Ke=Math.round(O[0]-(_e-1)*z),ve=N[2]-Te[2],We=Math.round(O[1]-(ve-1)*M),I=Math.round(O[0]-_e*z),D=Math.round(O[1]-ve*M),Z=Ke-I,X=We-D,Re=W.length===1;let oe=!1;P=[I,D,I+Z,D,I+Z,D+X,I,D+X];for(let q=0,Ne=re.length;q<Ne;++q)if(!Re&&w<me[q]){const E=re[q];Ut([I,D,I+Z,D+X],[E[0],E[3],E[4],E[7]])&&(oe||(_.save(),oe=!0),_.beginPath(),_.moveTo(P[0],P[1]),_.lineTo(P[2],P[3]),_.lineTo(P[4],P[5]),_.lineTo(P[6],P[7]),_.moveTo(E[6],E[7]),_.lineTo(E[4],E[5]),_.lineTo(E[2],E[3]),_.lineTo(E[0],E[1]),_.clip())}re.push(P),me.push(w),this.drawTile(B,e,I,D,Z,X,Fe,Re),oe&&_.restore(),this.renderedTiles.unshift(B),this.updateUsedTiles(e.usedTiles,s,B)}}if(this.renderedResolution=u,this.extentChanged=!this.renderedExtent_||!kt(this.renderedExtent_,y),this.renderedExtent_=y,this.renderedPixelRatio=l,this.postRender(this.context,e),this.layerExtent&&_.restore(),_.imageSmoothingEnabled=!0,this.renderComplete){const C=(w,L)=>{var M;const se=A(s),k=L.wantedTiles[se],z=k?Object.keys(k).length:0;this.updateCacheSize(z),this.tileCache_.expireCache(),(M=this.sourceTileCache_)==null||M.expireCache()};e.postRenderFunctions.push(C)}return this.container}updateCacheSize(e){this.tileCache_.highWaterMark=Math.max(this.tileCache_.highWaterMark,e*2)}drawTile(e,t,n,i,a,r,o,l){let c;if(e instanceof Ie){if(c=De(e.getData()),!c)throw new Error("Rendering array data is not yet supported")}else c=this.getTileImage(e);if(!c)return;const s=this.getRenderContext(t),p=A(this),d=t.layerStatesArray[t.layerIndex],u=d.opacity*(l?e.getAlpha(p,t.time):1),g=u!==s.globalAlpha;g&&(s.save(),s.globalAlpha=u),s.drawImage(c,o,o,c.width-2*o,c.height-2*o,n,i,a,r),g&&s.restore(),u!==d.opacity?t.animate=!0:l&&e.endTransition(p)}getImage(){const e=this.context;return e?e.canvas:null}getTileImage(e){return e.getImage()}updateUsedTiles(e,t,n){const i=A(t);i in e||(e[i]={}),e[i][n.getKey()]=!0}}class Qt extends zt{constructor(e){super(e)}createRenderer(){return new Ht(this,{cacheSize:this.getCacheSize()})}}var te,ne,ie;class Jt{constructor(){$(this,te,"https://t{0-7}.tianditu.gov.cn/");$(this,ne,"e1f2618711e8858b50bb0a1d4a715fa9");$(this,ie,{vec:["vec","cva"],img:["img","cia"]})}createTileLayerGroup(e,t=!0){const n=Y(this,ie)[e].map(i=>this.createTileLayer(i));return new At({layers:n,visible:t,properties:{name:e}})}createTileLayer(e){return new Qt({source:this.createXYZSource(e),properties:{name:e}})}createXYZSource(e){return new Vt({url:Y(this,te)+e+"_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER="+e+"&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk="+Y(this,ne),tileGrid:en(pe("EPSG:3857"))})}}te=new WeakMap,ne=new WeakMap,ie=new WeakMap;function en(h){const e=h.getExtent(),t=ge(e),n=Ae(e),i=new Array(18),a=new Array(18);for(let r=0;r<18;++r)i[r]=n/(256*Math.pow(2,r)),a[r]=r;return new Wt({origin:t,resolutions:i,matrixIds:a})}const tn={class:"panel"},nn=lt({name:"ProjectionAndScale"}),rn=Object.assign(nn,{setup(h){const e=we([{fileName:"@/views/projection/projectionAndScale/index.vue",rawCode:Nt,language:"html"}]),t=He("mapDivRef");let n=null;const a=new Jt().createTileLayerGroup("vec"),r=[{label:"Web墨卡托(EPSG:3857)",value:"EPSG:3857"},{label:"WGS 84(EPSG:4326)",value:"EPSG:4326"}],o=we("EPSG:3857"),l=pe(o.value),c=new Zt({units:"metric",bar:!0,steps:4,text:!0,minWidth:140});Qe(()=>{setTimeout(()=>{s()},0)}),Je(()=>{n&&(n.setTarget(void 0),n=null)});function s(){n=new Bt({controls:Ft([]).extend([c]),layers:[a],target:t.value,view:new Ge({center:Ue([0,52],"EPSG:4326",l),zoom:6,projection:l})}),et(t,()=>{n.updateSize()})}function p(){const d=n.getView(),u=d.getProjection(),g=d.getResolution(),v=d.getCenter(),f=d.getRotation(),m=pe(o.value),x=Ue(v,u,m),T=u.getMetersPerUnit(),S=m.getMetersPerUnit(),y=ee(u,1/T,v,"m")*T,R=ee(m,1/S,x,"m")*S,b=g*y/R,U=new Ge({center:x,resolution:b,rotation:f,projection:m});n.setView(U)}return(d,u)=>{const g=at,v=nt,f=Ye,m=qe;return Ee(),tt(Kt,{codeBlocks:Pe(e)},{default:H(()=>[Se("div",{class:"projection-and-scale",ref_key:"mapDivRef",ref:t},[Se("div",tn,[Q(m,{"label-suffix":":","label-width":"auto"},{default:H(()=>[Q(f,{label:"视图投影"},{default:H(()=>[Q(v,{modelValue:Pe(o),"onUpdate:modelValue":u[0]||(u[0]=x=>it(o)?o.value=x:null),placeholder:"请选择投影",onChange:p},{default:H(()=>[(Ee(),rt(st,null,ot(r,x=>Q(g,{key:x.value,label:x.label,value:x.value},null,8,["label","value"])),64))]),_:1},8,["modelValue"])]),_:1})]),_:1})])],512)]),_:1},8,["codeBlocks"])}}}),un=$e(rn,[["__scopeId","data-v-7035430a"]]);export{un as default};
