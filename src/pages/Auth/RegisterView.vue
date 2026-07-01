<template>
  <AuthScene :eyebrow="t('auth.eyebrowRegister')" :title="t('auth.registerTitle')" :subtitle="t('auth.registerSubtitle')">
    <form class="auth-form" novalidate @submit.prevent="onSubmit">
      <div class="field" :class="{ 'has-error': errors.name }">
        <label for="register-name">{{ t('auth.name') }}</label>
        <input
          id="register-name"
          v-model.trim="form.name"
          type="text"
          autocomplete="nickname"
          :placeholder="t('auth.namePlaceholder')"
          @blur="validate"
        />
        <span v-if="errors.name" class="field-error">{{ errors.name }}</span>
      </div>

      <div class="field" :class="{ 'has-error': errors.email }">
        <label for="register-email">{{ t('auth.email') }}</label>
        <input
          id="register-email"
          v-model.trim="form.email"
          type="email"
          autocomplete="email"
          :placeholder="t('auth.emailPlaceholder')"
          @blur="validate"
        />
        <span v-if="errors.email" class="field-error">{{ errors.email }}</span>
      </div>

      <div class="field" :class="{ 'has-error': errors.password }">
        <label for="register-password">{{ t('auth.password') }}</label>
        <input
          id="register-password"
          v-model="form.password"
          type="password"
          autocomplete="new-password"
          :placeholder="t('auth.passwordPlaceholder')"
          @blur="validate"
        />
        <span v-if="errors.password" class="field-error">{{ errors.password }}</span>
      </div>

      <div class="field" :class="{ 'has-error': errors.confirmPassword }">
        <label for="register-confirm">{{ t('auth.confirmPassword') }}</label>
        <input
          id="register-confirm"
          v-model="form.confirmPassword"
          type="password"
          autocomplete="new-password"
          :placeholder="t('auth.confirmPasswordPlaceholder')"
          @blur="validate"
        />
        <span v-if="errors.confirmPassword" class="field-error">{{ errors.confirmPassword }}</span>
      </div>

      <button class="auth-btn" type="submit" :disabled="submitting">
        <q-spinner-dots v-if="submitting" color="white" size="20px" />
        <span v-else>{{ t('auth.register') }}</span>
      </button>
    </form>

    <GoogleAuthButton />

    <template #alt>
      {{ t('auth.haveAccount') }}
      <button type="button" class="auth-link" @click="router.push({ name: 'login' })">
        {{ t('auth.goLogin') }}
      </button>
    </template>
  </AuthScene>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import AuthScene from '@/pages/Auth/components/AuthScene.vue'
import GoogleAuthButton from '@/pages/Auth/components/GoogleAuthButton.vue'
import { useAuth } from '@/pages/Auth/composables/useAuth'

const router = useRouter()
const { t } = useI18n()
const { submitting, register } = useAuth()

/** 密碼最短長度 */
const MIN_PASSWORD = 6

/** 表單欄位 */
const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

/** 各欄位錯誤訊息 */
const errors = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** 驗證表單，回傳是否通過 */
function validate() {
  errors.name = !form.name ? t('auth.errorRequired') : ''
  errors.email = !form.email ? t('auth.errorRequired') : !EMAIL_PATTERN.test(form.email) ? t('auth.errorEmail') : ''
  errors.password = !form.password
    ? t('auth.errorRequired')
    : form.password.length < MIN_PASSWORD
      ? t('auth.errorPasswordLength')
      : ''
  errors.confirmPassword = form.confirmPassword !== form.password ? t('auth.errorPasswordMatch') : ''
  return !errors.name && !errors.email && !errors.password && !errors.confirmPassword
}

async function onSubmit() {
  if (!validate()) return
  await register({ name: form.name, email: form.email, password: form.password })
}
</script>