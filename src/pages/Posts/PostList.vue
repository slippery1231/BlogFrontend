<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { usePostList } from '@/pages/Posts/composables/usePostList'
import { usePostFormat } from '@/pages/Posts/composables/usePostFormat'

const router = useRouter()
const { t } = useI18n()
const { posts, loading, error, load } = usePostList()
const { excerpt, readingTime, initial } = usePostFormat()

function goDetail(id: string | number) {
  router.push({ name: 'postDetail', params: { id } })
}

onMounted(load)
</script>

<template>
  <main class="tw-wrap">
    <div class="issue-row">
      <div>
        <div class="eyebrow">{{ t('post.listTitle') }}</div>
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

    <div v-else-if="posts.length === 0" class="state empty">{{ t('common.empty') }}</div>

    <div v-else class="grid">
      <article v-for="post in posts" :key="post.id" class="card" @click="goDetail(post.id)">
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
  </main>
</template>

<style scoped>
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

.issue-row {
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

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 26px;
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
.meta-row {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  color: var(--ink-soft);
}
.avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--rust);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-serif);
  font-weight: 600;
  font-size: 11px;
  flex-shrink: 0;
}
.meta-dot {
  opacity: 0.5;
}
</style>
