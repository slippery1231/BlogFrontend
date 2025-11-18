import { createRouter, createWebHistory } from 'vue-router'
import { postRoutes } from './post.route'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/Posts/PostList.vue'),
    },
    postRoutes,
  ],
})

export default router