<template>
  <div class="google-auth">
    <div class="auth-divider"><span>{{ t('auth.or') }}</span></div>

    <!-- 自訂樣式按鈕：點擊後由 vue3-google-login 觸發 Google 登入，callback 取得 credential -->
    <GoogleLogin :callback="onSuccess" :error="onError">
      <button class="google-btn" type="button" :disabled="submitting">
        <q-spinner-dots v-if="submitting" color="grey-8" size="20px" />
        <template v-else>
          <svg class="google-logo" viewBox="0 0 18 18" aria-hidden="true">
            <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18Z"/>
            <path fill="#FBBC05" d="M3.97 10.72a5.41 5.41 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33Z"/>
            <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.46 3.44 1.35l2.58-2.58C13.47.89 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z"/>
          </svg>
          <span>{{ t('auth.continueWithGoogle') }}</span>
        </template>
      </button>
    </GoogleLogin>
  </div>
</template>

<script setup lang="ts">
import { GoogleLogin } from 'vue3-google-login'
import type { CallbackTypes } from 'vue3-google-login'
import { useI18n } from 'vue-i18n'
import { useAuth } from '@/pages/Auth/composables/useAuth'
import { useLogger } from '@/composables/useLogger'

const { t } = useI18n()
const { submitting, loginWithGoogle } = useAuth()
const logger = useLogger({ prefix: 'GoogleAuth' })

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

/* ---------- Google 按鈕（自訂樣式，與站台一致） ---------- */
.google-auth :deep(.g-btn-wrapper) {
  display: block;
}
.google-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-family: var(--font-sans);
  font-size: 15px;
  font-weight: 600;
  color: var(--ink);
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 3px;
  padding: 12px 18px;
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    background-color 0.15s ease,
    transform 0.1s ease;
}
.google-btn:hover:not(:disabled) {
  border-color: var(--ink-soft);
  background: var(--paper);
}
.google-btn:active:not(:disabled) {
  transform: translateY(1px);
}
.google-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}
.google-logo {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}
</style>
