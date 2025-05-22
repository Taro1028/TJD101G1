import { createRouter, createWebHistory } from "vue-router";

// path → component
const routes = [
  {
    path: '/',
    component: () => import('@/pages/HomeView.vue'),
    meta: {
      title: '首頁',
      requiredLogin: false
    }
  },
  {
    path: '/about',
    component: () => import('@/pages/AboutView.vue'),
    meta: {
      title: '關於我們',
      requiredLogin: true
    }
  },
  {
    path: '/admin',
    children: [
      { path: '', component: () => import('@/pages/admin/Dashboard.vue') },
      { path: 'users', component: () => import('@/pages/admin/User.vue') },
    ], 
  }
];

// 建立 router
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
});

// 匯出 router
export default router;