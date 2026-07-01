import type { RouteRecordRaw } from 'vue-router'

/**
 * 身分驗證模組路由
 *
 * 登入 / 註冊頁採用獨立版面（AuthScene），不套用 MainLayout，
 * 因此定義為頂層路由而非 featureRoutes；也不設定 meta.title，不顯示於主選單。
 */
export const authRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/Auth/LoginView.vue'),
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/pages/Auth/RegisterView.vue'),
  },
]