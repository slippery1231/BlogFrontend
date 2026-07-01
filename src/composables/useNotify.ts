import { useQuasar } from 'quasar'

/**
 * 基礎通知 Composable
 * 提供常用的通知功能
 */
export function useNotify() {
  const $q = useQuasar()

  /**
   * 顯示成功通知
   * @param message 訊息內容
   * @param timeout 顯示時間（毫秒），預設為 2000ms
   */
  function notifySuccess(message: string, timeout = 2000, progress = false) {
    return $q.notify({
      progress,
      type: 'positive',
      message,
      position: 'top',
      timeout,
      actions: [
        {
          icon: 'close',
          color: 'white',
          round: true,
          handler: () => {
            /* 關閉通知 */
          },
        },
      ],
    })
  }

  /**
   * 顯示錯誤通知
   * @param message 訊息內容
   * @param timeout 顯示時間（毫秒），預設為 3000ms
   */
  function notifyError(message: string, timeout = 3000, progress = false) {
    return $q.notify({
      progress,
      type: 'negative',
      message,
      html: true,
      position: 'top',
      timeout,
      actions: [
        {
          icon: 'close',
          color: 'white',
          round: true,
          handler: () => {
            /* 關閉通知 */
          },
        },
      ],
    })
  }

  /**
   * 顯示警告通知
   * @param message 訊息內容
   * @param timeout 顯示時間（毫秒），預設為 2500ms
   */
  function notifyWarning(message: string, timeout = 2500, progress = false) {
    return $q.notify({
      progress,
      type: 'warning',
      message,
      position: 'top',
      timeout,
      actions: [
        {
          icon: 'close',
          color: 'white',
          round: true,
          handler: () => {
            /* 關閉通知 */
          },
        },
      ],
    })
  }

  /**
   * 顯示資訊通知
   * @param message 訊息內容
   * @param timeout 顯示時間（毫秒），預設為 2000ms
   */
  function notifyInfo(message: string, timeout = 2000, progress = false) {
    return $q.notify({
      progress,
      type: 'info',
      message,
      position: 'top',
      timeout,
      actions: [
        {
          icon: 'close',
          color: 'white',
          round: true,
          handler: () => {
            /* 關閉通知 */
          },
        },
      ],
    })
  }

  return {
    notifySuccess,
    notifyError,
    notifyWarning,
    notifyInfo,
  }
}

/**
 * 業務邏輯通知 Composable
 * 提供部落格專案特定的通知功能
 */
export const useBusinessNotify = () => {
  const { notifySuccess, notifyError } = useNotify()

  /** 資料載入失敗通知 */
  const notifyLoadFailed = (message?: string) => notifyError(message || '資料載入失敗，請稍後再試')

  /** 資料儲存成功通知 */
  const notifySaveSuccess = () => notifySuccess('資料已成功儲存')

  /** 資料儲存失敗通知 */
  const notifySaveFailed = (message?: string) => notifyError(message || '資料儲存失敗，請稍後再試')

  /** 網路錯誤通知 */
  const notifyNetworkError = () => notifyError('網路連線異常，請檢查網路設定')

  return {
    notifyLoadFailed,
    notifySaveSuccess,
    notifySaveFailed,
    notifyNetworkError,
  }
}
