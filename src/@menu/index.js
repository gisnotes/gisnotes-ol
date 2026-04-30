/**
 * 本地菜单定义结构
 */
export const LOCAL_ROUTES = [
  {
    name: "Projection",
    path: "/projection",
    hidden: false,
    redirect: "noRedirect",
    component: "Layout",
    alwaysShow: true,
    meta: { title: "投影", icon: "projection", roles: ["admin"] },
    children: [
      {
        path: "autoProjection",
        component: "projection/autoProjection/index",
        name: "AutoProjection",
        hidden: false,
        meta: { title: "自动投影查询", icon: "projection", roles: ["admin"] },
      },
    ],
  },
];
