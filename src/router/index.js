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
  {
    path: '/front/Home',
    component: () => import('@/pages/Home.vue'),
    meta: {
      title: 'TibaEAT 提膳家',
      requiredLogin: false
    }
  },
  {
    path: '/front/LuchBox',
    component: () => import('@/pages/LunchBox.vue'),
    meta: {
      title: '餐盒介紹 - TibaEAT 提膳家',
      requiredLogin: false
    }
  },
  {
    path: '/front/Order',
    component: () => import('@/pages/Order.vue'),
    meta: {
      title: '預約訂餐',
      requiredLogin: true
    }
  },
  {
    path: '/front/About',
    component: () => import('@/pages/About.vue'),
    meta: {
      title: '關於我們 - TibaEAT 提膳家',
      requiredLogin: false
    }
  },
  {
    path: '/front/Member',
    component: () => import('@/pages/Member.vue'),
    meta: {
      title: '會員中心 - TibaEAT 提膳家',
      requiredLogin: false
    }
  },
  {
    path: '/admin',
    children: [
      { path: '', component: () => import('@/pages/admin/Dashboard.vue') },
      { path: 'users', component: () => import('@/pages/admin/User.vue') },
    ],
  },
  {
    path: '/front/Login',
    component: () => import('@/pages/Login.vue'),
    meta: {
      title: '會員登入 - TibaEAT 提膳家',
      requiredLogin: false
    }
  },
  {
    path: '/front/Sign_Up',
    component: () => import('@/pages/Sign_Up.vue'),
    meta: {
      title: '會員註冊 - TibaEAT 提膳家',
      requiredLogin: false
    }
  }

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