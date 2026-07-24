import { ref } from 'vue'
import { getPosts } from '@/services/post/postService'
import type { Post } from '@/pages/Posts/types'
import { samplePosts } from '@/pages/Posts/sampleData'
import { useLogger } from '@/composables/useLogger'

/**
 * 文章列表資料載入 Composable
 * 封裝文章列表的載入狀態、錯誤處理與資料。
 * 開發模式下若 API 無法連線，會退回種子資料以利預覽版面。
 */
export function usePostList() {
  const logger = useLogger({ prefix: 'PostList' })

  const posts = ref<Post[]>([])
  const loading = ref(false)
  const error = ref('')

  /** 載入文章列表 */
  async function load() {
    loading.value = true
    error.value = ''
    try {
      posts.value = await getPosts()
    } catch (err) {
      if (import.meta.env.DEV) {
        logger.warn('API 無法連線，改用開發種子資料預覽版面', err)
        posts.value = samplePosts
      } else {
        error.value = (err as ErrorResponseStructure).errorMessage ?? (err as Error).message ?? 'load failed'
        logger.error('載入文章列表失敗:', err)
      }
    } finally {
      loading.value = false
    }
  }

  return { posts, loading, error, load }
}
