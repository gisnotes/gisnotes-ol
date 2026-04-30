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
    meta: { title: "投影", icon: "projection", roles: ["admin"] },
    children: [
      // {
      //   path: "build",
      //   component: "tool/build/index",
      //   hidden: false,
      //   meta: { title: "表单构建", icon: "build", roles: ["admin"] },
      // },
    ],
  },
];
