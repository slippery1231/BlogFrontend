<template>
  <main class="tw-wrap">
    <!-- 期數 / 標語 -->
    <div class="issue-row">
      <div>
        <div class="eyebrow">{{ t('home.issue') }} · 2026 年 7 月</div>
        <div class="tagline">{{ t('app.tagline') }}</div>
      </div>
    </div>

    <div v-if="loading" class="state">
      <q-spinner-dots color="primary" size="40px" />
    </div>

    <q-banner v-else-if="error" class="state error-banner" rounded>
      {{ error }}
      <template #action>
        <q-btn flat color="negative" :label="t('common.retry')" @click="load" />
      </template>
    </q-banner>

    <template v-else>
      <!-- 精選文章 -->
      <section v-if="featured" class="featured" @click="goDetail(featured.id)">
        <div class="featured-cover">
          <svg viewBox="0 0 400 280" preserveAspectRatio="xMidYMid slice">
            <rect width="400" height="280" fill="var(--indigo)" />
            <path d="M0 200 Q50 170 100 200 T200 200 T300 200 T400 200 V280 H0 Z" fill="var(--indigo-deep)" opacity="0.7" />
            <path d="M0 230 Q60 210 120 230 T240 230 T360 230 T400 226 V280 H0 Z" fill="var(--indigo-deep)" />
          </svg>
        </div>
        <div class="featured-body">
          <span v-if="featured.category" class="tag-pill">{{ featured.category }}</span>
          <h1 class="featured-title">{{ featured.title }}</h1>
          <p class="featured-excerpt">{{ excerpt(featured.content, 90) }}</p>
          <div class="meta-row">
            <div class="avatar">{{ initial(featured.author) }}</div>
            <span>{{ featured.author }}</span>
            <span class="meta-dot">·</span>
            <span>{{ fmtDate(featured.createdAt) }}</span>
            <span class="meta-dot">·</span>
            <span>{{ readingTime(featured.content) }} {{ t('post.minRead') }}</span>
          </div>
        </div>
      </section>

      <!-- 波紋分隔線 -->
      <svg class="wave-divider" viewBox="0 0 800 14" preserveAspectRatio="none">
        <path
          d="M0 7 Q20 0 40 7 T80 7 T120 7 T160 7 T200 7 T240 7 T280 7 T320 7 T360 7 T400 7 T440 7 T480 7 T520 7 T560 7 T600 7 T640 7 T680 7 T720 7 T760 7 T800 7"
          stroke="var(--rust)"
          stroke-width="1.5"
          fill="none"
        />
      </svg>

      <!-- 最新文章 -->
      <div class="section-label">{{ t('home.latest') }}</div>
      <div class="grid">
        <article v-for="post in rest" :key="post.id" class="card" @click="goDetail(post.id)">
          <span v-if="post.category" class="tag-pill">{{ post.category }}</span>
          <h3 class="card-title">{{ post.title }}</h3>
          <p class="card-excerpt">{{ excerpt(post.content) }}</p>
          <div class="meta-row">
            <div class="avatar sm">{{ initial(post.author) }}</div>
            <span>{{ post.author }}</span>
            <span class="meta-dot">·</span>
            <span>{{ readingTime(post.content) }} {{ t('post.min') }}</span>
          </div>
        </article>
      </div>

      <!-- 熱門標籤 -->
      <div v-if="popularTags.length" class="tags-block">
        <div class="section-label">{{ t('home.popularTags') }}</div>
        <div class="tag-cloud">
          <span v-for="tag in popularTags" :key="tag" class="tag-outline">{{ tag }}</span>
        </div>
      </div>
      <!--熱門文章-->
      <!--      todo 熱門文章-->
    </template>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useDateTimeFormatter } from '@/composables/useDateTimeFormatter'
import { usePostList } from '@/pages/Posts/composables/usePostList'
import { usePostFormat } from '@/pages/Posts/composables/usePostFormat'

// ==================== composables ====================
const router = useRouter()
const { t } = useI18n() // t為官方慣例寫法,代表 "translate"
const { posts, loading, error, load } = usePostList()
const { excerpt, readingTime, initial } = usePostFormat()
const { formatDateTime } = useDateTimeFormatter()

// ==================== computed ====================
const featured = computed(() => posts.value[0] ?? null)
const rest = computed(() => posts.value.slice(1))

/** 由文章分類彙整熱門標籤 */
const popularTags = computed(() => {
  const set = new Set<string>()
  posts.value.forEach((p) => p.category && set.add(p.category))
  return [...set]
})

// ==================== function ====================
function fmtDate(value?: string | null) {
  return formatDateTime(value, 'YYYY年M月D日')
}

function goDetail(id: string | number) {
  router.push({ name: 'postDetail', params: { id } })
}

// ==================== life cycle ====================
onMounted(load)
</script>

<style scoped>
.state {
  display: flex;
  justify-content: center;
  padding: 64px 0;
}
.error-banner {
  background: rgba(177, 80, 45, 0.12);
  color: var(--rust-deep);
}

.issue-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  border-bottom: 1px solid var(--line);
  padding-bottom: 18px;
  margin-bottom: 44px;
}
.eyebrow {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 1.5px;
  color: var(--rust-deep);
  text-transform: uppercase;
}
.tagline {
  font-family: var(--font-reading);
  font-style: italic;
  color: var(--ink-soft);
  font-size: 15px;
  margin-top: 6px;
}

/* 精選文章 */
.featured {
  display: flex;
  gap: 40px;
  margin-bottom: 52px;
  align-items: stretch;
  cursor: pointer;
}
.featured-cover {
  width: 42%;
  flex-shrink: 0;
  border-radius: 3px;
  min-height: 280px;
  overflow: hidden;
}
.featured-cover svg {
  width: 100%;
  height: 100%;
  display: block;
}
.featured-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.featured-title {
  font-family: var(--font-serif);
  font-size: 38px;
  line-height: 1.2;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--ink);
}
.featured-excerpt {
  font-family: var(--font-reading);
  font-size: 17px;
  line-height: 1.75;
  color: var(--ink-soft);
  margin-bottom: 22px;
  max-width: 52ch;
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
  width: fit-content;
  margin-bottom: 16px;
}

.meta-row {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: var(--ink-soft);
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
.avatar.sm {
  width: 24px;
  height: 24px;
  font-size: 11px;
}
.meta-dot {
  opacity: 0.5;
}

.wave-divider {
  width: 100%;
  height: 14px;
  margin: 0 0 40px;
  opacity: 0.6;
}

.section-label {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--ink-soft);
  margin-bottom: 22px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 26px;
  margin-bottom: 52px;
}
.card {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 3px;
  padding: 22px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}
.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(35, 42, 71, 0.08);
}
.card-title {
  font-family: var(--font-serif);
  font-size: 19px;
  font-weight: 600;
  line-height: 1.35;
  margin: 4px 0 10px;
  color: var(--ink);
}
.card-excerpt {
  font-family: var(--font-reading);
  font-size: 14px;
  line-height: 1.6;
  color: var(--ink-soft);
  margin-bottom: 16px;
  flex: 1;
}
.card .meta-row {
  font-size: 12px;
}

.tags-block {
  margin-bottom: 52px;
}
.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.tag-outline {
  font-family: var(--font-sans);
  font-size: 13px;
  padding: 7px 14px;
  border: 1px solid var(--line);
  border-radius: 999px;
  color: var(--ink-soft);
}

@media (max-width: 820px) {
  .featured {
    flex-direction: column;
    gap: 20px;
  }
  .featured-cover {
    width: 100%;
    min-height: 200px;
  }
  .featured-title {
    font-size: 30px;
  }
}
</style>
