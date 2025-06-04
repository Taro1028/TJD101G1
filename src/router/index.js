import { createRouter, createWebHistory } from "vue-router";

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
    path: "/LunchBox",
    component: () => import("@/pages/LunchBox.vue"),
    meta: {
      title: "餐盒介紹 - TibaEAT 提膳家",
      requiredLogin: false,
    },
  },
  {
    path: "/Order",
    component: () => import("@/pages/Order.vue"),
    meta: {
      title: "預約訂餐 - TibaEAT 提膳家",
      requiredLogin: true,
    },
  },
  {
    path: '/Order/PlanForyou',
    component: () => import('@/pages/Order_PlanForyou.vue'),
    meta: {
      title: '為你搭配 - TibaEAT 提膳家',
      requiredLogin: true
    }
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
    path: '/Order/Select2_PlanFree',
    component: () => import('@/pages/Order_Select2_PlanFree.vue'),
    meta: {
      title: '自由搭配 - TibaEAT 提膳家',
      requiredLogin: true
    }
  },
  {
    path: '/Order/Select3_PlanFree',
    component: () => import('@/pages/Order_Select3_PlanFree.vue'),
    meta: {
      title: '自由搭配 - TibaEAT 提膳家',
      requiredLogin: true
    }
  },
  {
    path: '/Order/Loading',
    component: () => import('@/pages/Order_Loading.vue'),
    meta: {
      title: '隨機產生 - TibaEAT 提膳家',
      requiredLogin: true
    }
  },
   {
    path: '/Order/MessageCards',
    component: () => import('@/pages/MessageCards.vue'),
    meta: {
      title: '編輯留言小卡 - TibaEAT 提膳家',
      requiredLogin: true
    }
  },
  {
    path: '/Order/AddCart',
    component: () => import('@/pages/Order_AddCart.vue'),
    meta: {
      title: '加入購物車 - TibaEAT 提膳家',
      requiredLogin: true
    }
  },
  {
    path: '/Check_OrderInfo',
    component: () => import('@/pages/Check1_OrderInfo.vue'),
    meta: {
      title: '訂單資料 - TibaEAT 提膳家',
      requiredLogin: true
    }
  },
  {
    path: '/Check_PaymentInfo',
    component: () => import('@/pages/Check2_PaymentInfo.vue'),
    meta: {
      title: '付款資料 - TibaEAT 提膳家',
      requiredLogin: true
    }
  },
  {
    path: '/Check_Complete',
    component: () => import('@/pages/Check3_Complete.vue'),
    meta: {
      title: '完成訂單 - TibaEAT 提膳家',
      requiredLogin: true
    }
  },
  {
    path: '/About',
    component: () => import('@/pages/About.vue'),
    meta: {
      title: '理念及目標 - TibaEAT 提膳家',
      requiredLogin: false
    }
  },
  {
    path: '/About/News',
    component: () => import('@/pages/News.vue'),
    meta: {
      title: '最新消息 - TibaEAT 提膳家',
      requiredLogin: false
    }
  },
  {
    path: '/About/News/Newsitem',
    component: () => import('@/pages/Newsitem.vue'),
    meta: {
      title: '最新消息 - TibaEAT 提膳家',
    }
  },
  {
    path: '/About/SmallFarmer',
    component: () => import('@/pages/SmallFarmer.vue'),
    meta: {
      title: '配合小農 - TibaEAT 提膳家',
      requiredLogin: false
    }
  },
  {
    path: '/About/Cooperation',
    component: () => import('@/pages/Cooperation.vue'),
    meta: {
      title: '合作夥伴 - TibaEAT 提膳家',
      requiredLogin: false
    }
  },
  {
    path: "/Member",
    component: () => import("@/pages/Member.vue"),
    meta: {
      title: "會員中心 - TibaEAT 提膳家",
      requiredLogin: false,
    },
  },
  {
    path: "/Login",
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
    path: '/MemberCenter',
    component: () => import('@/pages/MemberCenter.vue'),
    meta: {
      title: '個人資料 - TibaEAT 提膳家',
      requiredLogin: false
    }
  },

  {
    path: '/MemberCenter/Recipients',
    component: () => import('@/pages/Recipients.vue'),
    meta: {
      title: '收件者管理 - TibaEAT 提膳家',
      requiredLogin: false
    }
  },
{
  path: '/MemberCenter/MyCards',
  component: () => import('@/pages/MyCards.vue'),
  meta: {
    title: '我的小卡 - TibaEAT 提膳家',
    requiredLogin: false
  }
},
{
  path: '/MemberCenter/MyOrders', 
  component: () => import('@/pages/MyOrders.vue'),
  meta: {
    title: '訂單總覽 - TibaEAT 提膳家',
    requiredLogin: false
  }
},
  // === 後台 ===
  {
    path: '/adminLogin', // /admin      /admin/users
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
    return { top: 0 }
  },
});

// 依據 route 的 meta.title 更新網頁標題
router.afterEach((to) => {
  const defaultTitle = "TibaEAT 提膳家";
  document.title = to.meta.title || defaultTitle;
});

// 匯出 router
export default router;
