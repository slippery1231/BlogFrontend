<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t } = useI18n()
</script>

<template>
  <main class="tw-wrap not-found">
    <div class="code">404</div>
    <p class="tagline">{{ t('app.tagline') }}</p>
    <button class="home-btn" @click="router.push({ name: 'home' })">{{ t('nav.home') }}</button>
  </main>
</template>

<style scoped>
.not-found {
  text-align: center;
  padding-top: 96px;
  padding-bottom: 96px;
}
.code {
  font-family: var(--font-serif);
  font-size: 96px;
  font-weight: 600;
  color: var(--indigo);
  line-height: 1;
}
.tagline {
  font-family: var(--font-reading);
  font-style: italic;
  font-size: 17px;
  color: var(--ink-soft);
  margin: 16px 0 28px;
}
.home-btn {
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  background: var(--rust-deep);
  border: none;
  padding: 11px 22px;
  border-radius: 2px;
  cursor: pointer;
}
</style>
