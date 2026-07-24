<template>
  <AuthScene :eyebrow="t('auth.eyebrowRegister')" :title="t('auth.registerTitle')" :subtitle="t('auth.registerSubtitle')">
    <form class="auth-form" novalidate @submit.prevent="onSubmit">
      <div class="field-row">
        <div class="field" :class="{ 'has-error': errors.lastName }">
          <label for="register-lastName">{{ t('auth.lastName') }}</label>
          <input
            id="register-lastName"
            v-model.trim="form.lastName"
            type="text"
            autocomplete="family-name"
            :placeholder="t('auth.lastNamePlaceholder')"
            @blur="validate"
          />
          <span v-if="errors.lastName" class="field-error">{{ errors.lastName }}</span>
        </div>

        <div class="field" :class="{ 'has-error': errors.firstName }">
          <label for="register-firstName">{{ t('auth.firstName') }}</label>
          <input
            id="register-firstName"
            v-model.trim="form.firstName"
            type="text"
            autocomplete="given-name"
            :placeholder="t('auth.firstNamePlaceholder')"
            @blur="validate"
          />
          <span v-if="errors.firstName" class="field-error">{{ errors.firstName }}</span>
        </div>
      </div>

      <div class="field" :class="{ 'has-error': errors.email }">
        <label for="register-email">{{ t('auth.email') }}</label>
        <div class="input-with-action">
          <input id="register-email" v-model.trim="form.email" type="email" autocomplete="email" :placeholder="t('auth.emailPlaceholder')" @blur="validate" />
          <button type="button" class="code-btn" :disabled="sendingCode || cooldown > 0" @click="onSendCode">
            <q-spinner-dots v-if="sendingCode" color="white" size="16px" />
            <span v-else-if="cooldown > 0">{{ t('auth.resendCodeIn', { seconds: cooldown }) }}</span>
            <span v-else>{{ t('auth.getCode') }}</span>
          </button>
        </div>
        <span v-if="errors.email" class="field-error">{{ errors.email }}</span>
      </div>

      <div class="field" :class="{ 'has-error': errors.verificationCode }">
        <label for="register-code">{{ t('auth.verificationCode') }}</label>
        <input
          id="register-code"
          v-model.trim="form.verificationCode"
          type="text"
          inputmode="numeric"
          autocomplete="one-time-code"
          :placeholder="t('auth.verificationCodePlaceholder')"
          @blur="validate"
        />
        <span v-if="errors.verificationCode" class="field-error">{{ errors.verificationCode }}</span>
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
import { onUnmounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import AuthScene from '@/pages/Auth/components/AuthScene.vue'
import GoogleAuthButton from '@/pages/Auth/components/GoogleAuthButton.vue'
import { useAuth } from '@/pages/Auth/composables/useAuth'
import { useAuthValidation } from '@/pages/Auth/composables/useAuthValidation'

const router = useRouter()
const { t } = useI18n()
const { submitting, sendingCode, register, sendVerificationEmail } = useAuth()
const { requiredError, emailError, passwordError } = useAuthValidation()

/** 驗證碼重新寄送冷卻秒數 */
const COOLDOWN_SECONDS = 60

/** 表單欄位 */
const form = reactive({
  lastName: '',
  firstName: '',
  email: '',
  verificationCode: '',
  password: '',
  confirmPassword: '',
})

/** 各欄位錯誤訊息 */
const errors = reactive({
  lastName: '',
  firstName: '',
  email: '',
  verificationCode: '',
  password: '',
  confirmPassword: '',
})

/** 驗證碼重新寄送剩餘秒數（0 表示可寄送） */
const cooldown = ref(0)
let cooldownTimer: ReturnType<typeof setInterval> | undefined

/** 驗證表單，回傳是否通過 */
function validate() {
  errors.lastName = requiredError(form.lastName)
  errors.firstName = requiredError(form.firstName)
  errors.email = emailError(form.email)
  errors.verificationCode = requiredError(form.verificationCode)
  errors.password = passwordError(form.password)
  errors.confirmPassword = form.confirmPassword === form.password ? '' : t('auth.errorConfirmMismatch')
  return !errors.lastName && !errors.firstName && !errors.email && !errors.verificationCode && !errors.password && !errors.confirmPassword
}

/** 開始重新寄送冷卻倒數 */
function startCooldown() {
  cooldown.value = COOLDOWN_SECONDS
  cooldownTimer = setInterval(() => {
    cooldown.value -= 1
    if (cooldown.value <= 0 && cooldownTimer) {
      clearInterval(cooldownTimer)
    }
  }, 1000)
}

/** 寄送註冊驗證碼 */
async function onSendCode() {
  errors.email = emailError(form.email)
  if (errors.email || cooldown.value > 0) return

  const ok = await sendVerificationEmail(form.email)
  if (ok) startCooldown()
}

async function onSubmit() {
  if (!validate()) return
  await register({
    lastName: form.lastName,
    firstName: form.firstName,
    emailPrimary: form.email,
    password: form.password,
    verificationCode: form.verificationCode,
  })
}

onUnmounted(() => {
  if (cooldownTimer) clearInterval(cooldownTimer)
})
</script>

<style scoped>
.field-row {
  display: flex;
  gap: 14px;
}

.field-row .field {
  flex: 1;
  min-width: 0;
}

.input-with-action {
  display: flex;
  gap: 8px;
}

.input-with-action input {
  flex: 1;
  min-width: 0;
}

.code-btn {
  flex-shrink: 0;
  white-space: nowrap;
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 600;
  color: var(--rust-deep);
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 3px;
  padding: 0 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.code-btn:hover:not(:disabled) {
  border-color: var(--rust);
}

.code-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
