import type { RouteRecordRaw } from 'vue-router'

/** 文章模組路由 */
export const postRoutes: RouteRecordRaw[] = [
  {
    path: 'posts',
    name: 'postList',
    meta: {
      title: '文章列表',
      icon: 'mdi-post-outline',
    },
    component: () => import('@/pages/Posts/PostList.vue'),
  },
  {
    path: 'posts/:id',
    name: 'postDetail',
    props: true,
    meta: {
      title: '文章內容',
    },
    component: () => import('@/pages/Posts/PostDetail.vue'),
  },
]
