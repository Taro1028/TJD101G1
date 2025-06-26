import { createRouter, createWebHistory } from "vue-router";
import { useMemberStore } from "@/stores/MemberStore";
import { useModalStore } from "@/stores/ModalStore";
import { useAdminMemberStore } from "@/stores/AdminMemberStore";

// path → component
const routes = [
  {
    path: "/",
    component: () => import("@/pages/Entrance.vue"),
    meta: {
      title: "入口頁",
      requiredLogin: false,
    },
  },

  // === 前台 ===
  {
    path: "/Home",
    component: () => import("@/pages/Home.vue"),
    meta: {
      title: "TibaEAT 提膳家",
      requiredLogin: false,
    },
  },
  {
    path: "/privacy-policy",
    component: () => import("@/pages/PrivacyPolicy.vue"),
    meta: {
      title: "TibaEAT 提膳家",
      requiredLogin: false,
    },
  },
  {
    path: "/LunchBox",
    component: () => import("@/pages/LunchBox.vue"),
    meta: {
      title: "餐盒介紹 - TibaEAT 提膳家",
      requiredLogin: false,
    },
  },
  {
    path: "/Order/Select",
    component: () => import("@/pages/Select.vue"),
    meta: {
      title: "選擇期間 - TibaEAT 提膳家",
      requiredLogin: true,
    },
  },
  {
    path: "/Order",
    component: () => import("@/pages/Order.vue"),
    meta: {
      title: "選擇方案 - TibaEAT 提膳家",
      requiredLogin: true,
    },
  },
  {
    path: "/Order/PlanForyou",
    component: () => import("@/pages/Order_PlanForyou.vue"),
    meta: {
      title: "為你搭配 - TibaEAT 提膳家",
      requiredLogin: true,
    },
  },
  {
    path: "/Order/Select1_PlanFree",
    component: () => import("@/pages/Order_Select1_PlanFree.vue"),
    meta: {
      title: "自由搭配 - TibaEAT 提膳家",
      requiredLogin: true,
    },
  },
  {
    path: "/Order/Select2_PlanFree",
    component: () => import("@/pages/Order_Select2_PlanFree.vue"),
    meta: {
      title: "自由搭配 - TibaEAT 提膳家",
      requiredLogin: true,
    },
  },
  {
    path: "/Order/Select3_PlanFree",
    component: () => import("@/pages/Order_Select3_PlanFree.vue"),
    meta: {
      title: "自由搭配 - TibaEAT 提膳家",
      requiredLogin: true,
    },
  },
  {
    path: "/Order/Loading",
    component: () => import("@/pages/Order_Loading.vue"),
    meta: {
      title: "隨機產生 - TibaEAT 提膳家",
      requiredLogin: true,
    },
  },
  {
    path: "/Order/MessageCards",
    component: () => import("@/pages/MessageCards.vue"),
    meta: {
      title: "編輯留言小卡 - TibaEAT 提膳家",
      requiredLogin: true,
    },
  },
  {
    path: "/Order/AddCart",
    component: () => import("@/pages/Order_AddCart.vue"),
    meta: {
      title: "加入購物車 - TibaEAT 提膳家",
      requiredLogin: true,
    },
  },
  {
    path: "/Check_OrderInfo",
    component: () => import("@/pages/Check1_OrderInfo.vue"),
    meta: {
      title: "訂單資料 - TibaEAT 提膳家",
      requiredLogin: true,
    },
  },
  {
    path: "/Check_PaymentInfo",
    component: () => import("@/pages/Check2_PaymentInfo.vue"),
    meta: {
      title: "付款資料 - TibaEAT 提膳家",
      requiredLogin: true,
    },
  },
  {
    path: "/Check_Complete",
    component: () => import("@/pages/Check3_Complete.vue"),
    meta: {
      title: "完成訂單 - TibaEAT 提膳家",
      requiredLogin: true,
    },
  },
  {
    path: "/About",
    component: () => import("@/pages/About.vue"),
    meta: {
      title: "理念及目標 - TibaEAT 提膳家",
      requiredLogin: false,
    },
  },
  {
    path: "/About/News",
    component: () => import("@/pages/News.vue"),
    meta: {
      title: "最新消息 - TibaEAT 提膳家",
      requiredLogin: false,
    },
  },
  {
    path: "/About/News/Newsitem/:id",
    name: "NewsDetail",
    component: () => import("@/pages/Newsitem.vue"),
    props: true,
    meta: {
      title: "最新消息 - TibaEAT 提膳家",
    },
  },
  {
    path: "/About/SmallFarmer",
    component: () => import("@/pages/SmallFarmer.vue"),
    meta: {
      title: "配合小農 - TibaEAT 提膳家",
      requiredLogin: false,
    },
  },
  {
    path: "/About/Cooperation",
    component: () => import("@/pages/Cooperation.vue"),
    meta: {
      title: "合作夥伴 - TibaEAT 提膳家",
      requiredLogin: false,
    },
  },
  {
    path: "/LineCallBack",
    component: () => import("@/components/LineCallBack.vue"),
    meta: {
      title: "會員登入 - TibaEAT 提膳",
      requiredLogin: false,
    },
  },
  {
    path: "/Login",
    name: "Login",
    beforeEnter: (to, from, next) => {
      const member = useMemberStore();
      member.loadFromsessionStorage?.();
      if (member.id) {
        next("/home");
      } else {
        next();
      }
    },
    component: () => import("@/pages/Login.vue"),
    meta: {
      title: "會員登入 - TibaEAT 提膳家",
      requiredLogin: false,
    },
  },
  {
    path: "/Sign_Up",
    component: () => import("@/pages/Sign_Up.vue"),
    meta: {
      title: "會員註冊 - TibaEAT 提膳家",
      requiredLogin: false,
    },
  },
  {
    path: "/ForgotPassword",
    component: () => import("@/pages/ForgotPassword.vue"),
    meta: {
      title: "忘記密碼 - TibaEAT 提膳家",
      requiredLogin: false,
    },
  },
  {
    path: "/MemberCenter",
    component: () => import("@/pages/MemberCenter.vue"),
    meta: {
      title: "個人資料 - TibaEAT 提膳家",
      requiredLogin: true,
    },
  },

  {
    path: "/MemberCenter/Recipients",
    component: () => import("@/pages/Recipients.vue"),
    meta: {
      title: "收件者管理 - TibaEAT 提膳家",
      requiredLogin: true,
    },
  },
  {
    path: "/MemberCenter/MyCards",
    component: () => import("@/pages/MyCards.vue"),
    meta: {
      title: "我的小卡 - TibaEAT 提膳家",
      requiredLogin: true,
    },
  },
  {
    path: "/MemberCenter/MyOrders",
    component: () => import("@/pages/MyOrders.vue"),
    meta: {
      title: "訂單總覽 - TibaEAT 提膳家",
      requiredLogin: true,
    },
  },
  // === 後台 ===
  {
    path: "/adminLogin", // /admin      /admin/users
    component: () => import("@/pages/admin/AdminLogin.vue"),
  },
  {
    path: "/admin", // /admin      /admin/users
    component: () => import("@/pages/admin/Member.vue"),
    children: [
      {
        path: "member",
        component: () => import("@/components/Admin/DataForm.vue"),
      },
      {
        path: "product",
        component: () => import("@/components/Admin/DataForm.vue"),
      },
      {
        path: "order",
        component: () => import("@/components/Admin/DataForm.vue"),
      },
      {
        path: "consignees",
        component: () => import("@/components/Admin/DataForm.vue"),
      },
      {
        path: "web",
        component: () => import("@/components/Admin/DataForm.vue"),
      },
    ],
  },
];

// 建立 router
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
  scrollBehavior(to, from, savedPosition) {
    // always scroll to top
    return { top: 0 };
  },
});

// 依據 route 的 meta.title 更新網頁標題
router.afterEach((to) => {
  const defaultTitle = "TibaEAT 提膳家";
  document.title = to.meta.title || defaultTitle;
});

// 匯出 router
export default router;

// 全域前置守衛 - 檢查登入狀態
router.beforeEach(async (to, from, next) => {
  const memberStore = useMemberStore();
  const modalStore = useModalStore();
  const adminMemberStore = useAdminMemberStore();

  // 檢查完整 URL 和參數
  // console.log("🔍 完整除錯資訊:");
  // console.log("  window.location.href:", window.location.href);
  // console.log("  window.location.hash:", window.location.hash);
  // console.log("  document.referrer:", document.referrer);
  // console.log("  to.fullPath:", to.fullPath);
  // console.log("  to.path:", to.path);
  // console.log("  to.name:", to.name);

  // 🔥 修正：檢查實際的路由路徑
  let actualPath = to.path;

  if (to.path.startsWith("/admin/")) {
    console.log("進入 admin 區域:", to.path);
    adminMemberStore.loadFromsessionStorage();
    console.log(
      "測試 adminMemberStore 登入狀態:",
      adminMemberStore.isAuthenticated
    );

    if (!adminMemberStore.isAuthenticated) {
      next("/adminLogin");
      return;
    } else {
      next();
      return;
    }
  }

  // 如果 to.path 是 '/' 但 hash 包含其他路徑，從 hash 中提取
  if (to.path === "/" && window.location.hash) {
    const hashPath = window.location.hash.replace("#", "").split("?")[0];
    if (hashPath && hashPath !== "/") {
      actualPath = hashPath;
      console.log("🔧 從 hash 中修正路徑:", actualPath);
    }
  }

  // console.log("🔍 實際路徑:", actualPath);

  // 🔥 檢查是否來自綠界且要去完成頁面
  if (
    document.referrer.includes("ecpay.com.tw") &&
    actualPath === "/Check_Complete"
  ) {
    // console.log("🎯 檢測到來自綠界的跳轉到完成頁面！");

    // 強制導航到完成頁面
    if (to.path !== "/Check_Complete") {
      // console.log("🔧 強制導航到完成頁面");
      next("/Check_Complete");
      return;
    }
  }

  // ✨ 確保會員資料已載入
  if (!memberStore.isLoggedIn && !memberStore.checkAuthStatus()) {
    console.log("  載入 sessionStorage 結果: 失敗");
    memberStore.logout();
  } else {
    // console.log("  載入 sessionStorage 結果: 成功");
  }

  // 使用 actualPath 來檢查路由權限
  const targetRoute = routes.find((route) => route.path === actualPath);
  const requiresAuth =
    targetRoute?.meta?.requiredLogin || to.meta.requiredLogin;

  // console.log("路由守衛檢查 - 實際目標頁面:", actualPath);
  // console.log("需要登入:", requiresAuth);
  // console.log("是否已認證:", memberStore.isAuthenticated);

  // 如果需要登入但使用者未登入
  if (requiresAuth && !memberStore.isAuthenticated) {
    console.log("需要登入才能進入此頁面:", actualPath);

    modalStore.openLoginPopup(
      to.fullPath,
      `請先登入才能進入「${targetRoute?.meta?.title || "此頁面"}」`
    );

    next(false);
    return;
  } else if (to.path === "/Login" && memberStore.isAuthenticated) {
    // console.log("已登入，跳轉到會員中心");
    next("/MemberCenter");
    return;
  } else {
    // console.log("✅ 正常進入頁面:", actualPath);
    next();
    return;
  }
});
