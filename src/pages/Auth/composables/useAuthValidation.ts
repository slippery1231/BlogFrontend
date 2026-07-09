import { useI18n } from 'vue-i18n'

// 網域段排除 `.`，與後方的 `\.` 無重疊，避免回溯爆炸(sonar S5852)
const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/

/** 密碼最短長度 */
const MIN_PASSWORD = 6

/**
 * 認證表單欄位驗證 Composable
 * 各方法回傳該欄位的錯誤訊息，通過驗證則回傳空字串。
 */
export function useAuthValidation() {
  const { t } = useI18n()

  /** 必填欄位 */
  function requiredError(value: string) {
    return value ? '' : t('auth.errorRequired')
  }

  /** email 欄位 */
  function emailError(value: string) {
    if (!value) return t('auth.errorRequired')
    if (!EMAIL_PATTERN.test(value)) return t('auth.errorEmail')
    return ''
  }

  /** 密碼欄位 */
  function passwordError(value: string) {
    if (!value) return t('auth.errorRequired')
    if (value.length < MIN_PASSWORD) return t('auth.errorPasswordLength')
    return ''
  }

  return { requiredError, emailError, passwordError }
}