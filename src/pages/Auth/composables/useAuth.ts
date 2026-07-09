import { ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
  login as loginApi,
  loginWithGoogle as loginWithGoogleApi,
  register as registerApi,
  sendVerificationEmail as sendVerificationEmailApi,
} from '@/services/auth/authService'
import type { AuthResponse, LoginRequest, RegisterRequest } from '@/pages/Auth/types'
import { useUserStore } from '@/stores/useUser'
import { useNotify } from '@/composables/useNotify'
import { useLogger } from '@/composables/useLogger'

/** 認證動作的共用執行設定 */
interface AuthActionOptions<T> {
  /** 執行期間要開啟的送出狀態旗標 */
  pending: Ref<boolean>
  /** 實際呼叫的 API */
  action: () => Promise<T>
  /** DEV 模式 API 未連線時，模擬成功用的假結果 */
  devResult: T
  /** DEV 模擬時的警告訊息 */
  devWarn: string
  /** 失敗時的日誌前綴 */
  failLog: string
  /** 失敗時的通知訊息（無後端錯誤訊息時的 fallback） */
  failMessage: string
  /** 成功（或 DEV 模擬成功）後的處理：通知與導頁 */
  onSuccess: (result: T) => Promise<void> | void
}

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

  /** 執行認證動作：管理 pending 狀態、DEV 模擬與錯誤通知，回傳是否成功 */
  async function runAuthAction<T>(options: AuthActionOptions<T>) {
    options.pending.value = true
    try {
      const result = await options.action()
      await options.onSuccess(result)
      return true
    } catch (err) {
      if (import.meta.env.DEV && isNetworkError(err)) {
        logger.warn(options.devWarn)
        await options.onSuccess(options.devResult)
        return true
      }
      logger.error(options.failLog, err)
      notifyError(toMessage(err, options.failMessage))
      return false
    } finally {
      options.pending.value = false
    }
  }

  /** 登入成功後的共同流程：儲存 token、通知、導向首頁 */
  async function finishLogin({ accessToken }: AuthResponse) {
    userStore.storageUser(accessToken)
    notifySuccess(t('auth.loginSuccess'))
    await router.push({ name: 'home' })
  }

  /** DEV 模擬登入用的假結果 */
  const devLoginResult: AuthResponse = { accessToken: 'dev-access-token' }

  /** 登入 */
  function login(payload: LoginRequest) {
    return runAuthAction({
      pending: submitting,
      action: () => loginApi(payload),
      devResult: devLoginResult,
      devWarn: 'API 無法連線，開發模式模擬登入以利預覽',
      failLog: '登入失敗:',
      failMessage: t('auth.loginFailed'),
      onSuccess: finishLogin,
    })
  }

  /** Google 登入：將 Google 的 credential（id_token）送後端換取 accessToken */
  function loginWithGoogle(credential: string) {
    return runAuthAction({
      pending: submitting,
      action: () => loginWithGoogleApi({ credential }),
      devResult: devLoginResult,
      devWarn: 'API 無法連線，開發模式模擬 Google 登入以利預覽',
      failLog: 'Google 登入失敗:',
      failMessage: t('auth.loginFailed'),
      onSuccess: finishLogin,
    })
  }

  /** 寄送註冊驗證碼郵件，回傳是否寄送成功 */
  function sendVerificationEmail(email: string) {
    return runAuthAction({
      pending: sendingCode,
      action: () => sendVerificationEmailApi({ email }),
      devResult: { emailSent: true, expirationMinutes: 10 },
      devWarn: 'API 無法連線，開發模式模擬寄送驗證碼以利預覽',
      failLog: '寄送驗證碼失敗:',
      failMessage: t('auth.codeSentFailed'),
      onSuccess: () => {
        notifySuccess(t('auth.codeSentSuccess'))
      },
    })
  }

  /** 註冊，成功後導向登入頁 */
  function register(payload: RegisterRequest) {
    return runAuthAction({
      pending: submitting,
      action: () => registerApi(payload),
      devResult: { id: null, createdAt: null },
      devWarn: 'API 無法連線，開發模式模擬註冊以利預覽',
      failLog: '註冊失敗:',
      failMessage: t('auth.registerFailed'),
      onSuccess: async () => {
        notifySuccess(t('auth.registerSuccess'))
        await router.push({ name: 'login' })
      },
    })
  }

  return { submitting, sendingCode, login, loginWithGoogle, register, sendVerificationEmail }
}