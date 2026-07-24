<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { getPost } from '@/services/post/postService'
import type { Post } from '@/pages/Posts/types'
import { samplePosts } from '@/pages/Posts/sampleData'
import { usePostFormat } from '@/pages/Posts/composables/usePostFormat'
import { useDateTimeFormatter } from '@/composables/useDateTimeFormatter'
import { useLogger } from '@/composables/useLogger'

const props = defineProps<{ id: string | number }>()

const router = useRouter()
const { t } = useI18n()
const { readingTime, initial } = usePostFormat()
const { formatDateTime } = useDateTimeFormatter()
const logger = useLogger({ prefix: 'PostDetail' })

const post = ref<Post | null>(null)
const loading = ref(false)
const error = ref('')

async function load() {
  loading.value = true
  error.value = ''
  post.value = null
  try {
    post.value = await getPost(props.id)
  } catch (err) {
    if (import.meta.env.DEV) {
      logger.warn('API 無法連線，改用開發種子資料預覽版面', err)
      post.value = samplePosts.find((p) => String(p.id) === String(props.id)) ?? null
    } else {
      error.value = (err as ErrorResponseStructure).errorMessage ?? (err as Error).message ?? 'load failed'
      logger.error('載入文章失敗:', err)
    }
  } finally {
    loading.value = false
  }
}

function fmtDate(value?: string | null) {
  return formatDateTime(value, 'YYYY年M月D日')
}

onMounted(load)
watch(() => props.id, load)
</script>

<template>
  <main class="tw-wrap article-wrap">
    <button class="back-link" @click="router.push({ name: 'postList' })">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <path d="M15 18l-6-6 6-6" />
      </svg>
      {{ t('common.back') }}
    </button>

    <div v-if="loading" class="state">
      <q-spinner-dots color="primary" size="40px" />
    </div>

    <q-banner v-else-if="error" class="state error-banner" rounded>
      {{ error }}
      <template #action>
        <q-btn flat color="negative" :label="t('common.retry')" @click="load" />
      </template>
    </q-banner>

    <div v-else-if="!post" class="state empty">{{ t('post.notFound') }}</div>

    <article v-else>
      <span v-if="post.category" class="tag-pill">{{ post.category }}</span>
      <h1 class="article-title">{{ post.title }}</h1>
      <div class="meta-row">
        <div class="avatar">{{ initial(post.author) }}</div>
        <span>{{ post.author }}</span>
        <span class="meta-dot">·</span>
        <span>{{ fmtDate(post.createdAt) }}</span>
        <span class="meta-dot">·</span>
        <span>{{ readingTime(post.content) }} {{ t('post.minRead') }}</span>
      </div>

      <div class="article-cover">
        <svg viewBox="0 0 800 260" preserveAspectRatio="xMidYMid slice">
          <rect width="800" height="260" fill="var(--indigo)" />
          <path d="M0 180 Q100 150 200 180 T400 180 T600 180 T800 180 V260 H0 Z" fill="var(--indigo-deep)" opacity="0.7" />
          <path d="M0 215 Q120 195 240 215 T480 215 T720 215 T800 212 V260 H0 Z" fill="var(--indigo-deep)" />
        </svg>
      </div>

      <div class="article-body">
        <p v-for="(para, i) in post.content.split('\n\n')" :key="i">{{ para }}</p>
      </div>
    </article>
  </main>
</template>

<style scoped>
.article-wrap {
  max-width: 760px;
}
.state {
  display: flex;
  justify-content: center;
  padding: 64px 0;
}
.state.empty {
  color: var(--ink-soft);
  font-family: var(--font-reading);
}
.error-banner {
  background: rgba(177, 80, 45, 0.12);
  color: var(--rust-deep);
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--rust-deep);
  padding: 0;
  margin-bottom: 28px;
}
.back-link svg {
  width: 14px;
  height: 14px;
}

.tag-pill {
  display: inline-flex;
  align-items: center;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--rust-deep);
  background: rgba(177, 80, 45, 0.13);
  padding: 5px 11px;
  border-radius: 999px;
  margin-bottom: 18px;
}
.article-title {
  font-family: var(--font-serif);
  font-size: 42px;
  line-height: 1.18;
  font-weight: 600;
  color: var(--ink);
  margin-bottom: 20px;
}
.meta-row {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: var(--ink-soft);
  margin-bottom: 32px;
}
.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--rust);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-serif);
  font-weight: 600;
  font-size: 13px;
  flex-shrink: 0;
}
.meta-dot {
  opacity: 0.5;
}

.article-cover {
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 36px;
  height: 260px;
}
.article-cover svg {
  width: 100%;
  height: 100%;
  display: block;
}

.article-body p {
  font-family: var(--font-reading);
  font-size: 18px;
  line-height: 1.85;
  color: var(--ink);
  margin-bottom: 24px;
}

@media (max-width: 720px) {
  .article-title {
    font-size: 32px;
  }
  .article-cover {
    height: 180px;
  }
}
</style>
