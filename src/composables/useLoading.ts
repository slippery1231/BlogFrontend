import { useQuasar } from 'quasar'
import type { Component } from 'vue'

export interface QLoadingShowOptions {
  /** 顯示前等待時間（以毫秒 ms 為單位）*/
  delay?: number
  /** 顯示訊息 */
  message?: string
  /** 預設載入名稱 */
  group?: string
  /** 內容包裝元素自訂類 */
  boxClass?: string
  /** 讀取遮罩大小（以像素 px 為單位） */
  spinnerSize?: number
  /** 讀取遮罩顏色名稱 */
  spinnerColor?: string
  /** 顯示訊息顏色名稱 */
  messageColor?: string
  /** 讀取遮罩背景顏色 */
  backgroundColor?: string
  /** 讀取遮罩元件 */
  spinner?: Component
  /** 額外樣式類別 */
  customClass?: string
}

export function useLoading() {
  const $q = useQuasar()
  /** 預設讀取遮罩設定 */
  const defaultLoadingOptions: QLoadingShowOptions = {
    delay: 500, // ms
    spinnerSize: 100,
    spinnerColor: 'primary',
  }

  /** 顯示讀取遮罩 */
  function show(loadingOptions?: QLoadingShowOptions) {
    if (loadingOptions === undefined) {
      $q.loading.show(defaultLoadingOptions)
    } else {
      $q.loading.show(loadingOptions)
    }
  }

  /** 隱藏讀取遮罩 */
  function hide() {
    $q.loading.hide()
  }

  /** 讀取狀態 */
  const isActive = () => $q.loading.isActive

  return { show, hide, isActive }
}
