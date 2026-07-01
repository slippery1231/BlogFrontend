/** 用於集中管理用戶狀態 */
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { useLogger } from '@/composables/useLogger'

export const useUserStore = defineStore('userStore', () => {
  const logger = useLogger({
    prefix: 'UserStore',
    enabled: import.meta.env.DEV,
    showTimestamp: true,
  })

  /** Json Web Token */
  const accessToken = useStorage<string>('accessToken', '')

  /** 是否驗證 */
  const isAuthenticated = useStorage<boolean>('isAuthenticated', false)

  // 監聽 localStorage 恢復狀態
  if (isAuthenticated.value) {
    logger.info('從 localStorage 恢復登入狀態')
  } else {
    logger.info('localStorage 無登入狀態')
  }

  /** 儲存用戶狀態 */
  function storageUser(accessTokenRef: string) {
    isAuthenticated.value = true
    accessToken.value = accessTokenRef
  }

  /** 清除用戶狀態 */
  function clearUser() {
    isAuthenticated.value = false
    accessToken.value = ''
  }

  return {
    isAuthenticated,
    accessToken,
    storageUser,
    clearUser,
  }
})
