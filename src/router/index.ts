import { createRouter, createWebHistory } from 'vue-router'
import { allRoutes } from '@/router/routes'
import { useLogger } from '@/composables/useLogger'

/** 定義路由元訊息 */
declare module 'vue-router' {
  interface RouteMeta {
    /** 顯示名稱，如果沒設定或是空值就不會出現在選單 */
    title?: string
    /** 顯示圖示 */
    icon?: string
    /** 是否需要驗證 */
    requiresAuth?: boolean
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: allRoutes,
})

// 創建路由專用的 Logger
const logger = useLogger({
  prefix: 'Router',
  enabled: import.meta.env.DEV,
  showTimestamp: true,
})

/** 路由守衛 所有路由要進入之前，都會先經過這裡
 * @param to : 即將進入的目標
 * @param from : 目前導航正要離開的路由
 */
router.beforeEach((to, from) => {
  logger.debug('導航中', { 目標路由名稱: `${String(to.name) || '(無名稱)'}`, 導航: `${from.path || '/'} → ${to.path}` })
})

export default router
