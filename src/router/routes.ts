import type { RouteRecordRaw } from 'vue-router'
import { postRoutes } from '@/router/post.routes'
import { authRoutes } from '@/router/auth.routes'
import { announcementRoutes } from '@/router/announcement.route.ts'

/**
 * 路由配置主檔案
 *
 * 本檔案負責匯入所有模組化路由並組合它們，形成完整的路由系統。
 * 路由結構按照功能模組分為多個檔案，提高代碼的可維護性和可讀性。
 */

/** 功能頁面路由（會顯示在主選單） */
export const featureRoutes: RouteRecordRaw[] = [
  {
    path: '',
    name: 'home',
    meta: {
      title: '首頁',
      icon: 'mdi-home',
    },
    component: () => import('@/pages/Home/HomeView.vue'),
  },
  ...postRoutes,
  ...announcementRoutes,
]

/** Catch All 路由必須單獨定義並放在最後 */
export const catchAllRoute: RouteRecordRaw = {
  path: '/:catchAll(.*)*',
  name: 'notFound',
  component: () => import('@/pages/ErrorNotFound.vue'),
}

/** 主要應用路由：套用主佈局 */
export const mainRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [...featureRoutes],
  },
]

export const allRoutes: RouteRecordRaw[] = [...mainRoutes, ...authRoutes, catchAllRoute]
