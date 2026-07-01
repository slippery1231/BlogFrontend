<template>
  <main class="auth-scene">
    <!-- 左側：品牌意象面板 -->
    <aside class="brand-panel">
      <div class="brand" @click="router.push({ name: 'home' })">
        <svg class="brand-mark" viewBox="0 0 22 22" fill="none" aria-hidden="true">
          <path d="M1 11 Q6 4 11 11 T21 11" stroke="var(--paper)" stroke-width="1.6"/>
          <path d="M1 16 Q6 9 11 16 T21 16" stroke="var(--rust)" stroke-width="1.6"/>
        </svg>
        <span class="brand-name">{{ t('app.title') }}</span>
      </div>

      <div class="brand-copy">
        <div class="brand-eyebrow">{{ t('app.fieldNotes') }}</div>
        <p class="brand-tagline">{{ t('app.tagline') }}</p>
      </div>

      <svg class="brand-waves" viewBox="0 0 400 120" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 70 Q50 45 100 70 T200 70 T300 70 T400 70 V120 H0 Z" fill="var(--indigo-deep)" opacity="0.6"/>
        <path d="M0 92 Q60 68 120 92 T240 92 T360 92 T400 90 V120 H0 Z" fill="var(--indigo-deep)"/>
      </svg>
    </aside>

    <!-- 右側：表單 -->
    <section class="form-panel">
      <div class="form-inner">
        <div class="eyebrow">{{ eyebrow }}</div>
        <h1 class="auth-title">{{ title }}</h1>
        <p class="auth-subtitle">{{ subtitle }}</p>

        <slot/>

        <div class="auth-alt">
          <slot name="alt"/>
        </div>

        <button class="back-home" type="button" @click="router.push({ name: 'home' })">
          {{ t('auth.backHome') }}
        </button>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import {useRouter} from 'vue-router'
import {useI18n} from 'vue-i18n'

defineProps<{
  /** 頂部小標（mono、大寫） */
  eyebrow: string
  /** 主標題 */
  title: string
  /** 副標題說明 */
  subtitle: string
}>()

const router = useRouter()
const {t} = useI18n()
</script>


<style scoped>
.auth-scene {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
}

/* ---------- 左側品牌面板 ---------- */
.brand-panel {
  position: relative;
  overflow: hidden;
  background: var(--indigo-deep);
  color: var(--paper);
  padding: 48px 56px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  width: fit-content;
}

.brand-mark {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.brand-name {
  font-family: var(--font-serif);
  font-size: 22px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.brand-copy {
  position: relative;
  z-index: 1;
  max-width: 320px;
}

.brand-eyebrow {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--rust);
  margin-bottom: 14px;
}

.brand-tagline {
  font-family: var(--font-reading);
  font-style: italic;
  font-size: 24px;
  line-height: 1.5;
  color: var(--paper);
}

.brand-waves {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 120px;
}

/* ---------- 右側表單面板 ---------- */
.form-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 40px;
  background: var(--paper);
}

.form-inner {
  width: 100%;
  max-width: 380px;
}

.eyebrow {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--rust-deep);
}

.auth-title {
  font-family: var(--font-serif);
  font-size: 34px;
  font-weight: 600;
  line-height: 1.2;
  color: var(--ink);
  margin: 10px 0 8px;
}

.auth-subtitle {
  font-family: var(--font-reading);
  font-size: 15px;
  line-height: 1.6;
  color: var(--ink-soft);
  margin-bottom: 30px;
}

.auth-alt {
  margin-top: 24px;
  font-size: 14px;
  color: var(--ink-soft);
  text-align: center;
}

.back-home {
  display: block;
  margin: 20px auto 0;
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--ink-soft);
}

.back-home:hover {
  color: var(--rust-deep);
}

/* ---------- slot 內表單元素的共用樣式 ---------- */
:deep(.auth-form) {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

:deep(.field) {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

:deep(.field label) {
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.3px;
  color: var(--ink);
}

:deep(.field input) {
  font-family: var(--font-sans);
  font-size: 15px;
  color: var(--ink);
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 3px;
  padding: 12px 14px;
  outline: none;
  transition: border-color 0.15s ease,
  box-shadow 0.15s ease;
}

:deep(.field input::placeholder) {
  color: var(--ink-soft);
  opacity: 0.6;
}

:deep(.field input:focus) {
  border-color: var(--rust);
  box-shadow: 0 0 0 3px rgba(177, 80, 45, 0.12);
}

:deep(.field.has-error input) {
  border-color: var(--rust-deep);
}

:deep(.field-error) {
  font-family: var(--font-sans);
  font-size: 12px;
  color: var(--rust-deep);
}

:deep(.auth-btn) {
  margin-top: 6px;
  font-family: var(--font-sans);
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: var(--paper);
  background: var(--indigo-deep);
  border: none;
  border-radius: 3px;
  padding: 13px 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background-color 0.15s ease,
  transform 0.1s ease;
}

:deep(.auth-btn:hover:not(:disabled)) {
  background: var(--indigo);
}

:deep(.auth-btn:active:not(:disabled)) {
  transform: translateY(1px);
}

:deep(.auth-btn:disabled) {
  opacity: 0.65;
  cursor: not-allowed;
}

:deep(.auth-link) {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 600;
  color: var(--rust-deep);
  text-decoration: underline;
  text-underline-offset: 3px;
}

@media (max-width: 860px) {
  .auth-scene {
    grid-template-columns: 1fr;
  }

  .brand-panel {
    min-height: 200px;
    padding: 32px 28px;
  }

  .brand-tagline {
    font-size: 20px;
  }

  .form-panel {
    padding: 40px 24px;
  }
}
</style>
