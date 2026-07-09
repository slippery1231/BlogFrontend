<template>
  <AuthScene :eyebrow="t('auth.eyebrowLogin')" :title="t('auth.loginTitle')" :subtitle="t('auth.loginSubtitle')">
    <form class="auth-form" novalidate @submit.prevent="onSubmit">
      <div class="field" :class="{ 'has-error': errors.email }">
        <label for="login-email">{{ t('auth.email') }}</label>
        <input
          id="login-email"
          v-model.trim="form.email"
          type="email"
          autocomplete="email"
          :placeholder="t('auth.emailPlaceholder')"
          @blur="validate"
        />
        <span v-if="errors.email" class="field-error">{{ errors.email }}</span>
      </div>

      <div class="field" :class="{ 'has-error': errors.password }">
        <label for="login-password">{{ t('auth.password') }}</label>
        <input
          id="login-password"
          v-model="form.password"
          type="password"
          autocomplete="current-password"
          :placeholder="t('auth.passwordPlaceholder')"
          @blur="validate"
        />
        <span v-if="errors.password" class="field-error">{{ errors.password }}</span>
      </div>

      <button class="auth-btn" type="submit" :disabled="submitting">
        <q-spinner-dots v-if="submitting" color="white" size="20px"/>
        <span v-else>{{ t('auth.login') }}</span>
      </button>
    </form>

    <GoogleAuthButton/>

    <template #alt>
      {{ t('auth.noAccount') }}
      <button type="button" class="auth-link" @click="router.push({ name: 'register' })">
        {{ t('auth.goRegister') }}
      </button>
    </template>
  </AuthScene>
</template>

<script setup lang="ts">
import {reactive} from 'vue'
import {useRouter} from 'vue-router'
import {useI18n} from 'vue-i18n'
import AuthScene from '@/pages/Auth/components/AuthScene.vue'
import GoogleAuthButton from '@/pages/Auth/components/GoogleAuthButton.vue'
import {useAuth} from '@/pages/Auth/composables/useAuth'
import {useAuthValidation} from '@/pages/Auth/composables/useAuthValidation'

const router = useRouter()
const {t} = useI18n()
const {submitting, login} = useAuth()
const {requiredError, emailError} = useAuthValidation()

/** 表單欄位 */
const form = reactive({
  email: '',
  password: '',
})

/** 各欄位錯誤訊息 */
const errors = reactive({
  email: '',
  password: '',
})

/** 驗證表單，回傳是否通過 */
function validate() {
  errors.email = emailError(form.email)
  errors.password = requiredError(form.password)
  return !errors.email && !errors.password
}

async function onSubmit() {
  if (!validate()) return
  await login({account: form.email, password: form.password})
}
</script>

