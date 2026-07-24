<template>
  <div class="google-auth" :class="{ 'is-submitting': submitting }">
    <div class="auth-divider">
      <span>{{ t('auth.or') }}</span>
    </div>

    <!--
      Google 官方渲染按鈕：不可放 slot 自訂按鈕。
      套件在有 slot 時會改走 popup（授權碼 / access_token）流程，callback 不會有 credential（id_token）；
      只有官方渲染按鈕才回傳 credential，後端 /api/auth/google 依賴此欄位驗證。
    -->
    <GoogleLogin :callback="onSuccess" :error="onError" :button-config="buttonConfig" />
  </div>
</template>

<script setup lang="ts">
import { GoogleLogin } from 'vue3-google-login'
import type { CallbackTypes } from 'vue3-google-login'
import { useI18n } from 'vue-i18n'
import { useAuth } from '@/pages/Auth/composables/useAuth'
import { useLogger } from '@/composables/useLogger'

const { t, locale } = useI18n()
const { submitting, loginWithGoogle } = useAuth()
const logger = useLogger({ prefix: 'GoogleAuth' })

/** Google 官方按鈕外觀設定（renderButton 參數） */
const buttonConfig = {
  type: 'standard',
  theme: 'outline',
  size: 'large',
  text: 'continue_with',
  shape: 'rectangular',
  logo_alignment: 'left',
  width: 320,
  // GIS 的 locale 用底線格式（zh_TW），i18n 用連字號（zh-TW），需轉換
  locale: locale.value.replace('-', '_'),
}

/** Google 登入成功：拿到 credential（id_token）後送後端換 accessToken */
const onSuccess: CallbackTypes.CredentialCallback = (response) => {
  loginWithGoogle(response.credential)
}

// ==================== function ====================
/** Google 登入彈窗失敗或被關閉 */
function onError() {
  logger.warn('Google 登入未完成或被取消')
}
</script>

<style scoped>
.google-auth {
  margin-top: 20px;
}

/* 送出中避免重複點擊官方按鈕 */
.google-auth.is-submitting :deep(.g-btn-wrapper) {
  pointer-events: none;
  opacity: 0.65;
}

/* ---------- 分隔線（or） ---------- */
.auth-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
  color: var(--ink-soft);
}
.auth-divider::before,
.auth-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--line);
}
.auth-divider span {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 1px;
  text-transform: uppercase;
}

/* ---------- 官方按鈕置中 ---------- */
.google-auth :deep(.g-btn-wrapper) {
  display: flex;
  justify-content: center;
}
</style>
