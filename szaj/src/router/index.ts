import { createRouter, createWebHashHistory } from "vue-router";
import { usePathStore } from "@/stores/routerPath";


const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      redirect: "case-list",
    },
    {
      path: "/case-list",
      name: "case-list",
      component: () => import("../views/case-list.vue"),
      meta: {
        index: 1,
        title: "案件列表",
      },
    },
    {
      path: "/sjlist",
      name: "sjlist",
      component: () => import("../views/sjlist.vue"),
      meta: {
        index: 2,
        title:'申请列表'
      },
    },
    {
      path: "/sjxx",
      name: "sjxx",
      component: () => import("../views/sjxx.vue"),
      meta: {
        index: 3,
        title:'审计信息详情'
      },
    },
    {
      path: "/exportList",
      name: "exportList",
      component: () => import("../views/exportList.vue"),
      meta: {
        index: 4,
        title:'任务列表'
      },
    },
    {
      path: "/ajdj",
      name: "ajdj",
      component: () => import("../views/ajdj.vue"),
      meta: {
        index: 2,
        title: "案件登记",
      },
    },
    {
      path: "/search",
      name: "search",
      component: () => import("../views/search.vue"),
      meta: {
        index: 3,
      },
    },
    {
      path: "/announcement",
      name: "announcement",
      component: () => import("../views/announcement.vue"),
      meta: {
        index: 4,
        title: "公告",
      },
    },
    {
      path: "/ajsb",
      name: "ajsb",
      component: () => import("../views/ajsb.vue"),
      meta: {
        index: 5,
        title: "涉众案件查询登记",
      },
    },
    {
      path: "/ajxx",
      name: "ajxx",
      component: () => import("../views/ajxx.vue"),
      meta: {
        index: 6,
        title: "涉众案件查询登记",
      },
    },
    {
      path: "/confirm",
      name: "confirm",
      component: () => import("../views/confirm.vue"),
      meta: {
        index: 7,
        title: "涉众案件查询登记",
      },
    },
    {
      path: "/submitted",
      name: "submitted",
      component: () => import("../views/submitted.vue"),
      meta: {
        index: 8,
        title: "涉众案件查询登记",
      },
    },
    {
      path: "/previewPdf",
      name: "previewPdf",
      component: () => import("../views/previewPdf.vue"),
      meta: {
        index: 99,
      },
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    // 如果 `savedPosition` 存在，则表示这是通过浏览器的前进/后退按钮导航，此时返回保存的位置
    if (savedPosition) {
      return savedPosition;
    } else {
      // 否则返回顶部
      return { top: 0 };
    }
  },
});
router.beforeEach((to, from, next) => {
  const pathStore=usePathStore();
  let url = pathStore.routerPath;
  if (to.meta.title) {
    document.title = to?.meta?.title;
  }
  if (url && url.length !== 0 && to.name != url) {
    router.go(-1);
    return;
  }
  //如果达到了就把之前存的清除掉
  if (url && url.length !== 0 && to.name === url) {
    pathStore.clearRouterPath();
  }

  next();
});

export default router;
