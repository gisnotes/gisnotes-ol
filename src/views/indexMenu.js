import { ElMessageBox, ElMessage } from "element-plus";

export const STATUS = {
  DONE: "#07c160",
  IN_PROGRESS: "#ed6a0c",
  PENDING: "#606266",
};

const PROJECTION_NODES = [
  {
    id: "projection1",
    topic: "COG with automatic Projection Lookup",
    status: STATUS.DONE,
    route: "/projection/autoProjection",
    children: [
      {
        id: "projection1-1",
        topic: "Openlayers 之不同坐标系下 COG 影像的自动叠加",
        status: STATUS.DONE,
        externalLink: "https://mp.weixin.qq.com/s/yl2sYCgm0MtfqrtKorWdAA",
      },
      {
        id: "projection1-2",
        topic: "处理 GeoTIFF 数据为 COG 并完成数据加载",
        status: STATUS.DONE,
        externalLink: "https://mp.weixin.qq.com/s/HesBAG6Rk97YvvcpCcX_jA",
      },
    ],
  },
  {
    id: "projection2",
    topic: "Projection and Scale",
    status: STATUS.DONE,
    route: "/projection/projectionAndScale",
    children: [
      {
        id: "projection2-1",
        topic: "Openlayers 之投影与缩放",
        status: STATUS.DONE,
        externalLink: "https://mp.weixin.qq.com/s/9B9MJuffe7Q7_22TnDveSA",
      },
    ],
  },
  {
    id: "projection3",
    topic: "WMS without Projection",
    status: STATUS.IN_PROGRESS,
  },
  {
    id: "projection4",
    topic: "Equal Earth projection with dynamic center meridian",
    status: STATUS.PENDING,
  },
  {
    id: "projection5",
    topic: "Reprojection with coordinate system search",
    status: STATUS.PENDING,
  },
  {
    id: "projection6",
    topic: "COG with ModelTransformation",
    status: STATUS.PENDING,
  },
  { id: "projection7", topic: "Custom Tiled WMS", status: STATUS.PENDING },
  { id: "projection8", topic: "GeoTIFF Reprojection", status: STATUS.PENDING },
  { id: "projection9", topic: "Image Reprojection", status: STATUS.PENDING },
  { id: "projection10", topic: "Multiple COG sources", status: STATUS.PENDING },
  {
    id: "projection11",
    topic: "OpenStreetMap Reprojection",
    status: STATUS.PENDING,
  },
  {
    id: "projection12",
    topic: "OpenStreetMap Reprojection with ScaleLine Control",
    status: STATUS.PENDING,
  },
  { id: "projection13", topic: "Raster Reprojection", status: STATUS.PENDING },
  {
    id: "projection14",
    topic: "Single Image WMS with Proj4js",
    status: STATUS.PENDING,
  },
  { id: "projection15", topic: "Sphere Mollweide", status: STATUS.PENDING },
  {
    id: "projection16",
    topic: "Vector tiles reprojected",
    status: STATUS.PENDING,
  },
  { id: "projection17", topic: "Zoomify", status: STATUS.PENDING },
];

export const JS_MIND_DATA = {
  meta: { name: "Openalyers示例归类", author: "gisnotes", version: "1.0" },
  format: "node_tree",
  data: {
    id: "root",
    topic: "Openlayers示例归类",
    "background-color": "#409eff",
    children: [
      {
        id: "projection",
        topic: "投影",
        "background-color": "#409eff",
        children: PROJECTION_NODES.map((n) => ({
          ...n,
          "background-color": n.status,
          clickable: n.status === STATUS.DONE,
          children: n.children?.map((c) => ({
            ...c,
            "background-color": c.status,
            clickable: n.status === STATUS.DONE,
          })),
        })),
      },
    ],
  },
};

export function buildHandlers(router) {
  const handlers = {};
  for (const n of PROJECTION_NODES) {
    if (n.route) handlers[n.id] = () => router.push(n.route);
    if (n.children) {
      for (const c of n.children) {
        if (c.externalLink)
          handlers[c.id] = () => openExternalLink(c.externalLink);
      }
    }
  }
  return handlers;
}

function openExternalLink(url) {
  ElMessageBox.confirm("是否打开外部链接？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "info",
  })
    .then(() => {
      window.open(url, "_blank");
    })
    .catch(() => {
      ElMessage.warning("取消打开外部链接");
    });
}
