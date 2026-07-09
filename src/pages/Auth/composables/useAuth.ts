import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
  login as loginApi,
  loginWithGoogle as loginWithGoogleApi,
  register as registerApi,
  sendVerificationEmail as sendVerificationEmailApi,
} from '@/services/auth/authService'
import type { LoginRequest, RegisterRequest } from '@/pages/Auth/types'
import { useUserStore } from '@/stores/useUser'
import { useNotify } from '@/composables/useNotify'
import { useLogger } from '@/composables/useLogger'

/**
 * 身分驗證 Composable
 * 封裝登入 / 註冊的送出狀態、錯誤處理與導頁。
 * 開發模式下若 API 無法連線（網路錯誤），會模擬成功流程以利預覽版面。
 */
export function useAuth() {
  const router = useRouter()
  const { t } = useI18n()
  const userStore = useUserStore()
  const { notifySuccess, notifyError } = useNotify()
  const logger = useLogger({ prefix: 'Auth' })

  /** 送出中狀態（用於停用按鈕、顯示 spinner） */
  const submitting = ref(false)

  /** 驗證碼寄送中狀態 */
  const sendingCode = ref(false)

  /** 判斷是否為「後端未連線」的網路錯誤（status 0） */
  function isNetworkError(err: unknown) {
    return (err as ErrorResponseStructure)?.status === 0
  }

  /** 取出統一的錯誤訊息 */
  function toMessage(err: unknown, fallback: string) {
    return (err as ErrorResponseStructure).errorMessage ?? (err as Error).message ?? fallback
  }

  /** 登入 */
  async function login(payload: LoginRequest) {
    submitting.value = true
    try {
      const { accessToken } = await loginApi(payload)
      userStore.storageUser(accessToken)
      notifySuccess(t('auth.loginSuccess'))
      await router.push({ name: 'home' })
    } catch (err) {
      if (import.meta.env.DEV && isNetworkError(err)) {
        logger.warn('API 無法連線，開發模式模擬登入以利預覽')
        userStore.storageUser('dev-access-token')
        notifySuccess(t('auth.loginSuccess'))
        await router.push({ name: 'home' })
        return
      }
      logger.error('登入失敗:', err)
      notifyError(toMessage(err, t('auth.loginFailed')))
    } finally {
      submitting.value = false
    }
  }

  /** Google 登入：將 Google 的 credential（id_token）送後端換取 accessToken */
  async function loginWithGoogle(credential: string) {
    submitting.value = true
    try {
      const { accessToken } = await loginWithGoogleApi({ credential })
      userStore.storageUser(accessToken)
      notifySuccess(t('auth.loginSuccess'))
      await router.push({ name: 'home' })
    } catch (err) {
      if (import.meta.env.DEV && isNetworkError(err)) {
        logger.warn('API 無法連線，開發模式模擬 Google 登入以利預覽')
        userStore.storageUser('dev-access-token')
        notifySuccess(t('auth.loginSuccess'))
        await router.push({ name: 'home' })
        return
      }
      logger.error('Google 登入失敗:', err)
      notifyError(toMessage(err, t('auth.loginFailed')))
    } finally {
      submitting.value = false
    }
  }

  /** 寄送註冊驗證碼郵件，回傳是否寄送成功 */
  async function sendVerificationEmail(email: string) {
    sendingCode.value = true
    try {
      await sendVerificationEmailApi({ email })
      notifySuccess(t('auth.codeSentSuccess'))
      return true
    } catch (err) {
      if (import.meta.env.DEV && isNetworkError(err)) {
        logger.warn('API 無法連線，開發模式模擬寄送驗證碼以利預覽')
        notifySuccess(t('auth.codeSentSuccess'))
        return true
      }
      logger.error('寄送驗證碼失敗:', err)
      notifyError(toMessage(err, t('auth.codeSentFailed')))
      return false
    } finally {
      sendingCode.value = false
    }
  }

  /** 註冊，成功後導向登入頁 */
  async function register(payload: RegisterRequest) {
    submitting.value = true
    try {
      await registerApi(payload)
      notifySuccess(t('auth.registerSuccess'))
      await router.push({ name: 'login' })
    } catch (err) {
      if (import.meta.env.DEV && isNetworkError(err)) {
        logger.warn('API 無法連線，開發模式模擬註冊以利預覽')
        notifySuccess(t('auth.registerSuccess'))
        await router.push({ name: 'login' })
        return
      }
      logger.error('註冊失敗:', err)
      notifyError(toMessage(err, t('auth.registerFailed')))
    } finally {
      submitting.value = false
    }
  }

  return { submitting, sendingCode, login, loginWithGoogle, register, sendVerificationEmail }
}
