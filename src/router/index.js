import { createRouter, createWebHistory } from "vue-router";

// path → component
const routes = [
  {
    path: '/',
    component: () => import('@/pages/Entrance.vue'),
    meta: {
      title: '入口頁',
      requiredLogin: false
    }
  },

  // === 前台 ===
  {
    path: '/Home',
    component: () => import('@/pages/Home.vue'),
    meta: {
      title: 'TibaEAT 提膳家',
      requiredLogin: false
    }
  },
  {
    path: '/LuchBox',
    component: () => import('@/pages/LunchBox.vue'),
    meta: {
      title: '餐盒介紹 - TibaEAT 提膳家',
      requiredLogin: false
    }
  },
  {
    path: '/Order',
    component: () => import('@/pages/Order.vue'),
    meta: {
      title: '預約訂餐 - TibaEAT 提膳家',
      requiredLogin: true
    }
  },
  {
    path: '/Order/PlanForyou',
    component: () => import('@/pages/PlanForyou.vue'),
    meta: {
      title: '為你搭配 - TibaEAT 提膳家',
      requiredLogin: true
    }
  },
  {
    path: '/Order/PlanFreeMatching',
    component: () => import('@/pages/PlanFreeMatching.vue'),
    meta: {
      title: '自由搭配 - TibaEAT 提膳家',
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
    path: '/Member',
    component: () => import('@/pages/Member.vue'),
    meta: {
      title: '會員中心 - TibaEAT 提膳家',
      requiredLogin: false
    }
  },
  {
    path: '/Login',
    component: () => import('@/pages/Login.vue'),
    meta: {
      title: '會員登入 - TibaEAT 提膳家',
      requiredLogin: false
    }
  },
  {
    path: '/Sign_Up',
    component: () => import('@/pages/Sign_Up.vue'),
    meta: {
      title: '會員註冊 - TibaEAT 提膳家',
      requiredLogin: false
    }
  },
    {
    path: '/MemberCenter',
    component: () => import('@/pages/MemberCenter.vue'),
    meta: {
      title: '個人資料 - TibaEAT 提膳家',
      requiredLogin: false
    }
  },

  // === 後台 ===
  {
    path: '/admin', // /admin      /admin/users
    children: [
      { path: '', component: () => import('@/pages/admin/Dashboard.vue') },
      { path: 'users', component: () => import('@/pages/admin/User.vue') },
    ],
  },


];

// 建立 router
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
});

// 依據 route 的 meta.title 更新網頁標題
router.afterEach((to) => {
  const defaultTitle = 'TibaEAT 提膳家';
  document.title = to.meta.title || defaultTitle;
});

// 匯出 router
export default router;