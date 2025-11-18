import type { RouteRecordRaw } from 'vue-router'

/**
 * 文章相關路由
 *
 * 包含功能：
 * - 新增

 */
export const postRoutes: RouteRecordRaw = {
    path: '/post',
    redirect: { name: 'home' },
    meta: {
        title: '文章',
        icon: 'mdi-earth',
        // requiresAuth: true,
        resourceName: '文章',
    },
    children: [
        {
            path: ':id',
            name: 'post-detail',
            meta: {
                title: '文章詳情',
                icon: 'mdi-file-document',
                resourceName: '文章 > 詳情',
            },
            component: () => import('@/pages/Posts/PostDetail.vue'),
        },
        {
            path: 'add',
            name: 'post-add',
            meta: {
                title: '新增文章',
                icon: 'mdi-format-list-bulleted-square',
                // requiresAuth: true,
                resourceName: '文章 > 新增文章',
            },
            component: () => import('@/pages/Posts/AddPost.vue'),
        },
        {
            path: 'edit/:id?',
            name: 'post-edit',
            meta: {
                title: '編輯文章',
                icon: 'mdi-format-list-bulleted-square',
                // requiresAuth: true,
                resourceName: '文章 > 更新文章',
            },
            component: () => import('@/pages/Posts/EditPost.vue'),
        },
    ],
}
