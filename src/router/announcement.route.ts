import type { RouteRecordRaw } from 'vue-router'

/** 公告模組路由 */
export const announcementRoutes: RouteRecordRaw[] = [
  {
    path: '/announcement',
    name: 'announcement',
    component: () => import('@/pages/Announcement/AnnouncementList.vue'),
  },
]
