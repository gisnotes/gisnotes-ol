import{aP as K,G as X,aH as Q,aQ as D,am as ae,s as J,aR as g,ac as O,ad as v,aS as oe,ai as ce,E as Z,aj as le,al as ue,aT as he,aU as ge,w as W,aV as de,aW as F,aX as x,aY as $,aZ as me,a_ as Y,aw as S,a$ as V,b0 as C,b1 as ee,aL as te,H as B,b2 as H,F as fe,J as _e,b3 as pe,d as Re,b4 as Ee,aO as Ie,af as we,b5 as q,b6 as ye,b7 as Se,M as je,V as xe,a5 as Te,aM as Le,D as Oe}from"./TileImage-DO9MAZ2N.js";import{C as ve,T as Pe,S as Ae}from"./Tile-VOza3DxU.js";import{_ as be,r as Me,ai as Fe,I as Ge,J as De,o as Ce,m as Ne,f as Ue,h as ke,i as We,K as Ye}from"./index-D84q53pX.js";import"./index-BNXuNbEr.js";function N(a,e){const t=(""+a).split("."),n=(""+e).split(".");for(let r=0;r<Math.max(t.length,n.length);r++){const s=parseInt(t[r]||"0",10),i=parseInt(n[r]||"0",10);if(s>i)return 1;if(i>s)return-1}return 0}function G(a){return Array.isArray(a)?Math.min(...a):a}class Ve extends K{constructor(e,t,n,r,s,i,o){let c=e.getExtent();c&&e.canWrapX()&&(c=c.slice(),c[0]=-1/0,c[2]=1/0);let l=t.getExtent();l&&t.canWrapX()&&(l=l.slice(),l[0]=-1/0,l[2]=1/0);const u=l?X(n,l):n,h=Q(u),m=D(e,t,h,r),f=ue,E=new ae(e,t,u,c,m*f,r),_=E.calculateSourceExtent(),p=J(_)?null:i(_,m,s),I=p?g.IDLE:g.EMPTY,d=p?p.getPixelRatio():1;super(n,r,d,I),this.targetProj_=t,this.maxSourceExtent_=c,this.triangulation_=E,this.targetResolution_=r,this.targetExtent_=n,this.sourceImage_=p,this.sourcePixelRatio_=d,this.interpolate_=o,this.canvas_=null,this.sourceListenerKey_=null}disposeInternal(){this.state==g.LOADING&&this.unlistenSource_(),super.disposeInternal()}getImage(){return this.canvas_}getProjection(){return this.targetProj_}reproject_(){const e=this.sourceImage_.getState();if(e==g.LOADED){const t=O(this.targetExtent_)/this.targetResolution_,n=v(this.targetExtent_)/this.targetResolution_;this.canvas_=oe(t,n,this.sourcePixelRatio_,G(this.sourceImage_.getResolution()),this.maxSourceExtent_,this.targetResolution_,this.targetExtent_,this.triangulation_,[{extent:this.sourceImage_.getExtent(),image:this.sourceImage_.getImage()}],0,void 0,this.interpolate_,!0)}this.state=e,this.changed()}load(){if(this.state==g.IDLE){this.state=g.LOADING,this.changed();const e=this.sourceImage_.getState();e==g.LOADED||e==g.ERROR?this.reproject_():(this.sourceListenerKey_=ce(this.sourceImage_,Z.CHANGE,t=>{const n=this.sourceImage_.getState();(n==g.LOADED||n==g.ERROR)&&(this.unlistenSource_(),this.reproject_())}),this.sourceImage_.load())}}unlistenSource_(){le(this.sourceListenerKey_),this.sourceListenerKey_=null}}const R=4,M={IMAGELOADSTART:"imageloadstart",IMAGELOADEND:"imageloadend",IMAGELOADERROR:"imageloaderror"};class Be extends me{constructor(e,t){super(e),this.image=t}}class He extends he{constructor(e){super({attributions:e.attributions,projection:e.projection,state:e.state,interpolate:e.interpolate!==void 0?e.interpolate:!0}),this.on,this.once,this.un,this.loader=e.loader||null,this.resolutions_=e.resolutions!==void 0?e.resolutions:null,this.reprojectedImage_=null,this.reprojectedRevision_=0,this.image=null,this.wantedExtent_,this.wantedResolution_,this.static_=e.loader?e.loader.length===0:!1,this.wantedProjection_=null}getResolutions(){return this.resolutions_}setResolutions(e){this.resolutions_=e}findNearestResolution(e){const t=this.getResolutions();if(t){const n=ge(t,e,0);e=t[n]}return e}getImage(e,t,n,r){const s=this.getProjection();if(!s||!r||W(s,r))return s&&(r=s),this.getImageInternal(e,t,n,r);if(this.reprojectedImage_){if(this.reprojectedRevision_==this.getRevision()&&W(this.reprojectedImage_.getProjection(),r)&&this.reprojectedImage_.getResolution()==t&&de(this.reprojectedImage_.getExtent(),e))return this.reprojectedImage_;this.reprojectedImage_.dispose(),this.reprojectedImage_=null}return this.reprojectedImage_=new Ve(s,r,e,t,n,(i,o,c)=>this.getImageInternal(i,o,c,s),this.getInterpolate()),this.reprojectedRevision_=this.getRevision(),this.reprojectedImage_}getImageInternal(e,t,n,r){if(this.loader){const s=re(e,t,n,1),i=this.findNearestResolution(t);if(this.image&&(this.static_||this.wantedProjection_===r&&(this.wantedExtent_&&F(this.wantedExtent_,s)||F(this.image.getExtent(),s))&&(this.wantedResolution_&&G(this.wantedResolution_)===i||G(this.image.getResolution())===i)))return this.image;this.wantedProjection_=r,this.wantedExtent_=s,this.wantedResolution_=i,this.image=new K(s,i,n,this.loader),this.image.addEventListener(Z.CHANGE,this.handleImageChange.bind(this))}return this.image}handleImageChange(e){const t=e.target;let n;switch(t.getState()){case g.LOADING:this.loading=!0,n=M.IMAGELOADSTART;break;case g.LOADED:this.loading=!1,n=M.IMAGELOADEND;break;case g.ERROR:this.loading=!1,n=M.IMAGELOADERROR;break;default:return}this.hasListener(n)&&this.dispatchEvent(new Be(n,t))}}function qe(a,e){a.getImage().src=e}function re(a,e,t,n){const r=e/t,s=Q(a),i=x(O(a)/r,R),o=x(v(a)/r,R),c=x((n-1)*i/2,R),l=i+2*c,u=x((n-1)*o/2,R),h=o+2*u;return $(s,r,0,[l,h])}const T="1.3.0",z=[101,101];function ne(a,e,t,n,r){r.WIDTH=t[0],r.HEIGHT=t[1];const s=n.getAxisOrientation(),i=N(r.VERSION,"1.3")>=0;r[i?"CRS":"SRS"]=n.getCode();const o=i&&s.startsWith("ne")?[e[1],e[0],e[3],e[2]]:e;return r.BBOX=o.join(","),C(a,r)}function se(a,e,t,n,r,s,i){s=Object.assign({REQUEST:"GetMap"},s);const o=e/t,c=[Y(O(a)/o,R),Y(v(a)/o,R)];if(t!=1)switch(i){case"geoserver":const u=90*t+.5|0;"FORMAT_OPTIONS"in s?s.FORMAT_OPTIONS+=";dpi:"+u:s.FORMAT_OPTIONS="dpi:"+u;break;case"mapserver":s.MAP_RESOLUTION=90*t;break;case"carmentaserver":case"qgis":s.DPI=90*t;break;default:throw new Error("Unknown `serverType` configured")}return ne(r,a,c,n,s)}function L(a,e){return Object.assign({REQUEST:e,SERVICE:"WMS",VERSION:T,FORMAT:"image/png",STYLES:"",TRANSPARENT:"TRUE"},a)}function ze(a){const e=a.hidpi===void 0?!0:a.hidpi,t=S(a.projection||"EPSG:3857"),n=a.ratio||1.5,r=a.load||ee,s=a.crossOrigin??null,i=a.referrerPolicy;return(o,c,l)=>{o=re(o,c,l,n),l!=1&&(!e||a.serverType===void 0)&&(l=1);const u=se(o,c,l,t,a.url,L(a.params,"GetMap"),a.serverType),h=new Image;return h.crossOrigin=s,i!==void 0&&(h.referrerPolicy=i),r(h,u).then(m=>({image:m,extent:o,pixelRatio:l}))}}function Ke(a,e,t){if(a.url===void 0)return;const n=S(a.projection||"EPSG:3857"),r=$(e,t,0,z),s={QUERY_LAYERS:a.params.LAYERS,INFO_FORMAT:"application/json"};Object.assign(s,L(a.params,"GetFeatureInfo"),a.params);const i=V((e[0]-r[0])/t,R),o=V((r[3]-e[1])/t,R),c=N(s.VERSION,"1.3")>=0;return s[c?"I":"X"]=i,s[c?"J":"Y"]=o,ne(a.url,r,z,n,s)}function Xe(a,e){if(a.url===void 0)return;const t={SERVICE:"WMS",VERSION:T,REQUEST:"GetLegendGraphic",FORMAT:"image/png"};if(e!==void 0){const n=S(a.projection||"EPSG:3857").getMetersPerUnit()||1,r=28e-5;t.SCALE=e*n/r}if(Object.assign(t,a.params),a.params!==void 0&&t.LAYER===void 0){const n=t.LAYERS;if(!(!Array.isArray(n)||n.length!==1))return;t.LAYER=n}return C(a.url,t)}class Qe extends He{constructor(e){e=e||{},super({attributions:e.attributions,interpolate:e.interpolate,projection:e.projection,resolutions:e.resolutions}),this.crossOrigin_=e.crossOrigin!==void 0?e.crossOrigin:null,this.referrerPolicy_=e.referrerPolicy,this.url_=e.url,this.imageLoadFunction_=e.imageLoadFunction!==void 0?e.imageLoadFunction:qe,this.params_=Object.assign({},e.params),this.serverType_=e.serverType,this.hidpi_=e.hidpi!==void 0?e.hidpi:!0,this.renderedRevision_=0,this.ratio_=e.ratio!==void 0?e.ratio:1.5,this.loaderProjection_=null}getFeatureInfoUrl(e,t,n,r){const s=S(n),i=this.getProjection();i&&i!==s&&(t=D(i,s,e,t),e=te(e,s,i));const o={url:this.url_,params:{...this.params_,...r},projection:i||s};return Ke(o,e,t)}getLegendUrl(e,t){return Xe({url:this.url_,params:{...this.params_,...t}},e)}getParams(){return this.params_}getImageInternal(e,t,n,r){return this.url_===void 0?null:((!this.loader||this.loaderProjection_!==r)&&(this.loaderProjection_=r,this.loader=ze({crossOrigin:this.crossOrigin_,referrerPolicy:this.referrerPolicy_,params:this.params_,projection:r,serverType:this.serverType_,hidpi:this.hidpi_,url:this.url_,ratio:this.ratio_,load:(s,i)=>(this.image.setImage(s),this.imageLoadFunction_(this.image,i),ee(s))})),super.getImageInternal(e,t,n,r))}getImageLoadFunction(){return this.imageLoadFunction_}getUrl(){return this.url_}setImageLoadFunction(e){this.imageLoadFunction_=e,this.changed()}setUrl(e){e!=this.url_&&(this.url_=e,this.loader=null,this.changed())}setParams(e){this.params_=Object.assign({},e),this.loader=null,this.changed()}updateParams(e){Object.assign(this.params_,e),this.changed()}changed(){this.image=null,super.changed()}}class Je extends ve{constructor(e){super(e),this.image=null,this.renderedSourceRevision_=0}getImage(){return this.image?this.image.getImage():null}prepareFrame(e){const t=e.layerStatesArray[e.layerIndex],n=e.pixelRatio,r=e.viewState,s=r.resolution,i=this.getLayer().getSource(),o=e.viewHints;let c=e.extent;if(t.extent!==void 0&&(c=X(c,B(t.extent,r.projection))),!o[H.ANIMATING]&&!o[H.INTERACTING]&&!J(c))if(i){!this.getLayer().rendered&&this.renderedSourceRevision_!==i.getRevision()&&(this.image=null),this.renderedSourceRevision_=i.getRevision();const l=r.projection,u=i.getImage(c,s,n,l);u&&(this.loadImage(u)?this.image=u:u.getState()===g.EMPTY&&(this.image=null))}else this.image=null;return!!this.image}getData(e){const t=this.frameState;if(!t)return null;const n=this.getLayer(),r=fe(t.pixelToCoordinateTransform,e.slice()),s=n.getExtent();if(s&&!_e(s,r))return null;const i=this.image.getExtent(),o=this.image.getImage(),c=O(i),l=Math.floor(o.width*((r[0]-i[0])/c));if(l<0||l>=o.width)return null;const u=v(i),h=Math.floor(o.height*((i[3]-r[1])/u));return h<0||h>=o.height?null:this.getImageData(o,l,h)}renderFrame(e,t){const n=this.image,r=n.getExtent(),s=n.getResolution(),[i,o]=Array.isArray(s)?s:[s,s],c=n.getPixelRatio(),l=e.layerStatesArray[e.layerIndex],u=e.pixelRatio,h=e.viewState,m=h.center,f=h.resolution,E=u*i/(f*c),_=u*o/(f*c);this.prepareContainer(e,t);const p=this.context.canvas.width,I=this.context.canvas.height,d=this.getRenderContext(e);let P=!1,A=!0;if(l.extent){const y=B(l.extent,h.projection);A=pe(y,e.extent),P=A&&!F(y,e.extent),P&&this.clipUnrotated(d,e,y)}const w=n.getImage(),j=Re(this.tempTransform,p/2,I/2,E,_,0,c*(r[0]-m[0])/i,c*(m[1]-r[3])/o);this.renderedResolution=o*u/c;const U=w.width*j[0],k=w.height*j[3];if(this.getLayer().getSource().getInterpolate()||(d.imageSmoothingEnabled=!1),this.preRender(d,e),A&&U>=.5&&k>=.5){const y=j[4],ie=j[5],b=l.opacity;b!==1&&(d.save(),d.globalAlpha=b),d.drawImage(w,0,0,+w.width,+w.height,y,ie,U,k),b!==1&&d.restore()}return this.postRender(this.context,e),P&&d.restore(),d.imageSmoothingEnabled=!0,this.container}}class Ze extends Ee{constructor(e){e=e||{},super(e)}}class $e extends Ze{constructor(e){super(e)}createRenderer(){return new Je(this)}getData(e){return super.getData(e)}}class et extends Ie{constructor(e){e=e||{};const t=Object.assign({},e.params);super({attributions:e.attributions,attributionsCollapsible:e.attributionsCollapsible,cacheSize:e.cacheSize,crossOrigin:e.crossOrigin,interpolate:e.interpolate,projection:e.projection,reprojectionErrorThreshold:e.reprojectionErrorThreshold,tileClass:e.tileClass,tileGrid:e.tileGrid,tileLoadFunction:e.tileLoadFunction,url:e.url,urls:e.urls,wrapX:e.wrapX!==void 0?e.wrapX:!0,transition:e.transition,zDirection:e.zDirection}),this.gutter_=e.gutter!==void 0?e.gutter:0,this.params_=t,this.v13_=!0,this.serverType_=e.serverType,this.hidpi_=e.hidpi!==void 0?e.hidpi:!0,this.tmpExtent_=we(),this.updateV13_(),this.setKey(this.getKeyForParams_())}getFeatureInfoUrl(e,t,n,r){const s=S(n),i=this.getProjection()||s;let o=this.getTileGrid();o||(o=this.getTileGridForProjection(i));const c=te(e,s,i),l=D(i,s,e,t),u=o.getZForResolution(l,this.zDirection),h=o.getResolution(u),m=o.getTileCoordForCoordAndZ(c,u);if(o.getResolutions().length<=m[0])return;let f=o.getTileCoordExtent(m,this.tmpExtent_);const E=this.gutter_;E!==0&&(f=q(f,h*E,f));const _={QUERY_LAYERS:this.params_.LAYERS};Object.assign(_,L(this.params_,"GetFeatureInfo"),r);const p=Math.floor((c[0]-f[0])/h),I=Math.floor((f[3]-c[1])/h);return _[this.v13_?"I":"X"]=p,_[this.v13_?"J":"Y"]=I,this.getRequestUrl_(m,f,1,i||s,_)}getLegendUrl(e,t){if(this.urls[0]===void 0)return;const n={SERVICE:"WMS",VERSION:T,REQUEST:"GetLegendGraphic",FORMAT:"image/png"};if(t===void 0||t.LAYER===void 0){const r=this.params_.LAYERS;if(!(!Array.isArray(r)||r.length===1))return;n.LAYER=r}if(e!==void 0){const r=this.getProjection()?this.getProjection().getMetersPerUnit():1,s=28e-5;n.SCALE=e*r/s}return Object.assign(n,t),C(this.urls[0],n)}getGutter(){return this.gutter_}getParams(){return this.params_}getRequestUrl_(e,t,n,r,s){const i=this.urls;if(!i)return;let o;if(i.length==1)o=i[0];else{const c=ye(Se(e),i.length);o=i[c]}return se(t,(this.tileGrid||this.getTileGridForProjection(r)).getResolution(e[0]),n,r,o,s,this.serverType_)}getTilePixelRatio(e){return!this.hidpi_||this.serverType_===void 0?1:e}getKeyForParams_(){let e=0;const t=[];for(const n in this.params_)t[e++]=n+"-"+this.params_[n];return t.join("/")}setParams_(e){this.params_=e,this.updateV13_(),this.setKey(this.getKeyForParams_())}setParams(e){this.setParams_(Object.assign({},e))}updateParams(e){this.setParams_(Object.assign(this.params_,e))}updateV13_(){const e=this.params_.VERSION||T;this.v13_=N(e,"1.3")>=0}tileUrlFunction(e,t,n){let r=this.getTileGrid();if(r||(r=this.getTileGridForProjection(n)),r.getResolutions().length<=e[0])return;t!=1&&(!this.hidpi_||this.serverType_===void 0)&&(t=1);const s=r.getResolution(e[0]);let i=r.getTileCoordExtent(e,this.tmpExtent_);const o=this.gutter_;o!==0&&(i=q(i,s*o,i));const c=Object.assign({},L(this.params_,"GetMap"));return this.getRequestUrl_(e,i,t,n,c)}}const tt=`<template>\r
  <demo-box :codeBlocks="codeBlocks">\r
    <div class="wms-no-projection" ref="mapDivRef"></div>\r
  </demo-box>\r
</template>\r
\r
<script setup name="WmsNoProjection">\r
import DemoBox from "@/components/DemoBox/index.vue";\r
import IndexSourceCode from "./index.vue?raw";\r
\r
import Map from "ol/Map.js";\r
import View from "ol/View.js";\r
import ScaleLine from "ol/control/ScaleLine.js";\r
import { defaults as defaultControls } from "ol/control/defaults.js";\r
import ImageLayer from "ol/layer/Image.js";\r
import TileLayer from "ol/layer/Tile.js";\r
import Projection from "ol/proj/Projection.js";\r
import ImageWMS from "ol/source/ImageWMS.js";\r
import TileWMS from "ol/source/TileWMS.js";\r
import "ol/ol.css";\r
\r
const codeBlocks = ref([\r
  {\r
    fileName: "@/views/projection/wmsNoProjection/index.vue",\r
    rawCode: IndexSourceCode,\r
    language: "html",\r
  },\r
]);\r
\r
const mapRef = useTemplateRef("mapDivRef");\r
let map = null;\r
\r
const wmsUrl = "https://wms.geo.admin.ch/";\r
\r
// 1. 定义极简的投影对象（只声明了代号和单位，没有换算能力）\r
const projection = new Projection({\r
  code: "EPSG:21781",\r
  units: "m",\r
});\r
\r
// 2. 配置 WMS 图层组合\r
const layers = [\r
  // 底图\r
  new TileLayer({\r
    source: new TileWMS({\r
      /**\r
       * 根据 版权内容可以看出：\r
       * 这是一张 1:1,000,000（一百万分之一）比例尺的彩色国家像素地图（Pixelmap），\r
       * 由瑞士联邦地形局提供的。\r
       */\r
      attributions:\r
        '© <a href="https://shop.swisstopo.admin.ch/en/products/maps/national/lk1000" target="_blank">' +\r
        "Pixelmap 1:1000000 / geo.admin.ch</a>",\r
      crossOrigin: "anonymous",\r
      params: {\r
        LAYERS: "ch.swisstopo.pixelkarte-farbe-pk1000.noscale",\r
        FORMAT: "image/jpeg",\r
      },\r
      url: wmsUrl,\r
    }),\r
  }),\r
  // 业务图层\r
  new ImageLayer({\r
    source: new ImageWMS({\r
      /**\r
       * 根据 版权内容可以看出：\r
       * 这是一张国家级水文与洪水预警图（Flood Alert Map），\r
       * 由瑞士联邦环境局提供的。\r
       */\r
      attributions:\r
        '© <a href="https://www.hydrodaten.admin.ch/en/notes-on-the-flood-alert-maps.html" target="_blank">' +\r
        "Flood Alert / geo.admin.ch</a>",\r
      crossOrigin: "anonymous",\r
      params: { LAYERS: "ch.bafu.hydroweb-warnkarte_national" },\r
      serverType: "mapserver",\r
      url: wmsUrl,\r
    }),\r
  }),\r
];\r
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
    controls: defaultControls([]).extend([new ScaleLine()]),\r
    layers,\r
    target: mapRef.value,\r
    view: new View({\r
      center: [660000, 190000],\r
      projection,\r
      zoom: 9,\r
    }),\r
  });\r
}\r
<\/script>\r
\r
<style scoped lang="scss">\r
.wms-no-projection {\r
  position: absolute;\r
  inset: 0;\r
  background-color: #f8f9fa; //地图瓦片加载前设置一个底色\r
}\r
</style>\r
`,rt={class:"wms-no-projection",ref:"mapDivRef"},nt=Ye({name:"WmsNoProjection"}),st=Object.assign(nt,{setup(a){const e=Me([{fileName:"@/views/projection/wmsNoProjection/index.vue",rawCode:tt,language:"html"}]),t=Fe("mapDivRef");let n=null;const r="https://wms.geo.admin.ch/",s=new Te({code:"EPSG:21781",units:"m"}),i=[new Pe({source:new et({attributions:'© <a href="https://shop.swisstopo.admin.ch/en/products/maps/national/lk1000" target="_blank">Pixelmap 1:1000000 / geo.admin.ch</a>',crossOrigin:"anonymous",params:{LAYERS:"ch.swisstopo.pixelkarte-farbe-pk1000.noscale",FORMAT:"image/jpeg"},url:r})}),new $e({source:new Qe({attributions:'© <a href="https://www.hydrodaten.admin.ch/en/notes-on-the-flood-alert-maps.html" target="_blank">Flood Alert / geo.admin.ch</a>',crossOrigin:"anonymous",params:{LAYERS:"ch.bafu.hydroweb-warnkarte_national"},serverType:"mapserver",url:r})})];Ge(()=>{setTimeout(()=>{o()},0)}),De(()=>{n&&(n.setTarget(void 0),n=null)});function o(){n=new je({controls:Le([]).extend([new Ae]),layers:i,target:t.value,view:new xe({center:[66e4,19e4],projection:s,zoom:9})})}return(c,l)=>(Ce(),Ne(Oe,{codeBlocks:We(e)},{default:Ue(()=>[ke("div",rt,null,512)]),_:1},8,["codeBlocks"]))}}),lt=be(st,[["__scopeId","data-v-f2e64964"]]);export{lt as default};
