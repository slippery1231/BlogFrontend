import { useQuasar } from 'quasar'

/**
 * 基礎對話視窗 Composable
 * 提供常用的對話視窗功能
 */
export const useDialog = () => {
  const $q = useQuasar()

  /**
   * 顯示成功對話視窗
   * @param message 訊息內容
   * @param title 標題，預設為「成功」
   */
  const showSuccess = (message: string, title = '成功') => {
    return $q.dialog({
      title,
      message,
      color: 'positive',
      ok: { label: '確認', color: 'positive', flat: true },
      persistent: true,
    })
  }

  /**
   * 顯示確認對話視窗
   * @param message 訊息內容
   * @param title 標題，預設為「確認」
   */
  const showConfirm = (message: string, title = '確認') => {
    return $q.dialog({
      title,
      message,
      color: 'primary',
      ok: { label: '確認', color: 'primary', flat: true },
      cancel: { label: '取消', color: 'grey', flat: true },
      persistent: true,
    })
  }

  /**
   * 顯示警告對話視窗
   * @param message 訊息內容
   * @param title 標題，預設為「警告」
   */
  const showWarning = (message: string, title = '警告') => {
    return $q.dialog({
      title,
      message,
      color: 'warning',
      ok: { label: '確認', color: 'warning', flat: true },
      persistent: true,
    })
  }

  /**
   * 顯示錯誤對話視窗
   * @param message 訊息內容
   * @param title 標題，預設為「錯誤」
   */
  const showError = (message: string, title = '錯誤') => {
    return $q.dialog({
      title,
      message,
      html: true,
      color: 'negative',
      ok: { label: '確認', color: 'negative', flat: true },
      persistent: true,
    })
  }

  /**
   * 顯示資訊對話視窗
   * @param message 訊息內容
   * @param title 標題，預設為「資訊」
   */
  const showInfo = (message: string, title = '資訊') => {
    return $q.dialog({
      title,
      message,
      color: 'info',
      ok: { label: '確認', color: 'info', flat: true },
      persistent: true,
    })
  }

  return {
    showSuccess,
    showConfirm,
    showWarning,
    showError,
    showInfo,
  }
}
