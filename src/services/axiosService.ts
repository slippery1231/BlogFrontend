import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { useUserStore } from '@/stores/useUser'
import { useLogger } from '@/composables/useLogger'

// ==================== 回應型別定義 ====================

/**
 * 統一的回應格式介面
 * @template TResponse - 回應資料的型別
 */
export interface ResponseStructure<TResponse> {
  /** 後端標準回應結構，包含 data 和 error */
  result: BaseResponse<TResponse>
  /** HTTP 狀態碼（例如：200, 404, 500） */
  status: number
  /** HTTP 狀態文字（例如：OK, Not Found, Internal Server Error） */
  statusText: string
  /** 請求是否成功（HTTP 狀態碼為 2xx 時為 true） */
  success: boolean
  /** 統一的錯誤訊息，來自後端錯誤或網路錯誤 */
  errorMessage?: string
  /** 回應時間戳記（毫秒），用於除錯和追蹤 */
  timestamp: number
  /** 原始請求的 URL，用於追蹤和除錯 */
  requestUrl?: string
  /** 回應的 HTTP headers，用於存取中繼資料（如分頁資訊、快取控制等） */
  headers?: Record<string, string>
}

/**
 * 後端標準回應結構
 * @description data 和 error 二擇一，不會同時存在
 * @template T - 資料的型別
 */
export interface BaseResponse<T> {
  /** 成功時的回應資料，失敗時為 null */
  data: T | null
  /** 失敗時的錯誤資訊，成功時為 null */
  error: ErrorResponse | null
}

/**
 * 後端錯誤回應結構
 * @description 統一的錯誤格式，包含錯誤代碼和訊息
 */
export interface ErrorResponse {
  /** 錯誤代碼（通常為 HTTP 狀態碼） */
  code: number
  /** 錯誤訊息，描述錯誤的詳細資訊 */
  message: string
}

/**
 * 新增資料回應結構
 * @description 用於 POST 請求成功後的回應
 */
export interface CreatedResponse {
  /** 新增資料的唯一編號 */
  id: string | null
  /**
   * 資料建立時間 - ISO 8601 格式
   * @example "2025-06-09T07:19:07.2128455+00:00"
   */
  createdAt: string | null
}

/**
 * 更新資料回應結構
 * @description 用於 PUT/PATCH 請求成功後的回應
 */
export interface UpdatedResponse {
  /** 更新資料的唯一編號 */
  id: string | null
  /**
   * 資料更新時間 - ISO 8601 格式
   * @example "2025-06-09T07:19:07.2128455+00:00"
   */
  updatedAt: string | null
}

/**
 * 刪除資料回應結構
 * @description 用於 DELETE 請求成功後的回應
 */
export interface DeletedResponse {
  /** 是否成功刪除資料 */
  success: boolean
  /** 受影響的記錄數量（刪除的筆數） */
  record: number
}

// ==================== Axios 實例 ====================

/** 共用的 Axios 實體包含專案預設設定 */
const axiosService: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
})

/** 日誌實體設定 */
const logger = useLogger({
  prefix: 'AxiosService',
  enabled: true,
  minLevel: import.meta.env.VITE_LOG_LEVEL ? 'info' : 'warn',
})

/**
 * 請求攔截 - 自動為每個請求添加 Bearer token
 */
axiosService.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const userStore = useUserStore()
    const token = userStore.accessToken

    logger.debug('請求位址:', config.url)
    logger.debug('完整位址:', (config.baseURL ?? '') + config.url)

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      logger.debug('已附加 Token 至請求')
    } else {
      logger.debug('請求期間未找到 Token；繼續進行但不包含驗證標頭')
    }

    return config
  },
  (error: AxiosError) => {
    logger.error('請求錯誤:', error)
    return Promise.reject(error)
  }
)

/**
 * 回應攔截 - 統一回應處理
 */
axiosService.interceptors.response.use(
  // HTTP 狀態碼為 2xx 時執行（成功）
  (response: AxiosResponse) => {
    return response
  },
  // HTTP 狀態碼非 2xx 時執行（錯誤）
  (error: AxiosError<BaseResponse<null>>) => {
    // 提取錯誤資訊
    const status = error.response?.status ?? 0 // HTTP status
    const responseData = error.response?.data

    // 檢查是否為標準的 BaseResponse 格式
    const isBaseResponse = responseData && 'error' in responseData && 'data' in responseData
    const backendError = isBaseResponse ? (responseData as BaseResponse<null>).error : null

    // 處理錯誤訊息
    const errorMessage = backendError?.message || error.message

    if (error.response) {
      switch (status) {
        case 400:
          logger.error('錯誤請求 (400):', errorMessage)
          break
        case 401:
          logger.error('未授權 (401):', errorMessage)
          {
            const userStore = useUserStore()
            userStore.clearUser()
          }
          break
        case 403:
          logger.error('禁止存取 (403):', errorMessage)
          break
        case 404:
          logger.error('找不到資源 (404):', errorMessage)
          break
        case 422:
          logger.error('無法處理的實體 (422):', errorMessage)
          break
        case 500:
          logger.error('伺服器內部錯誤 (500):', errorMessage)
          break
        default:
          logger.error(`未預期的錯誤 (${status}):`, errorMessage)
      }
    } else if (error.request) {
      // 請求已發出，但沒收到回應（網路錯誤、timeout）
      logger.error('網路錯誤或請求逾時:', error.message)
    } else {
      // 請求還沒發出就失敗（config 錯誤）
      logger.error('請求配置錯誤:', error.message)
    }

    // 建立統一的 ResponseStructure 錯誤物件
    const errorResponse: ResponseStructure<null> = {
      result: {
        data: null,
        error: backendError || { code: status, message: errorMessage },
      },
      status,
      statusText: error.response?.statusText || 'Error',
      success: false,
      errorMessage: errorMessage,
      timestamp: Date.now(),
      requestUrl: error.config?.url,
      headers: error.response?.headers as Record<string, string>,
    }

    // 拋出完整的 ResponseStructure 物件
    return Promise.reject(errorResponse)
  }
)

// =========================== API 請求函數 ===========================

/**
 * 標準 API 請求 - 返回完整 ResponseStructure
 *
 * **建議使用**：包含完整的 HTTP 狀態碼、data 和 error 資訊
 *
 * @returns ResponseStructure<T> 統一的回應格式
 * @example
 * const response = await request<Post[]>({ method: 'GET', url: '/api/posts' })
 * console.log(response.status)        // 200
 * console.log(response.result.data)   // Post[]
 */
export async function request<T>(config: AxiosRequestConfig): Promise<ResponseStructure<T>> {
  const response = await axiosService.request<BaseResponse<T>>(config)
  return {
    result: response.data,
    status: response.status,
    statusText: response.statusText,
    success: response.status >= 200 && response.status < 300,
    errorMessage: response.data.error?.message,
    timestamp: Date.now(),
    requestUrl: config.url,
    headers: response.headers as Record<string, string>,
  }
}

/**
 * 簡化請求 - 自動解包，直接回傳 data
 *
 * **便捷使用**：會自動拋出業務邏輯錯誤（error），可直接使用資料無需檢查
 *
 * @throws Error 當 API 回傳業務邏輯錯誤時（HTTP 錯誤已由 interceptor 處理）
 * @example
 * const posts = await requestData<Post[]>({ method: 'GET', url: '/api/posts' })
 */
export async function requestData<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await axiosService.request<BaseResponse<T>>(config)
  if (response.data.error) {
    throw new Error(response.data.error.message)
  }
  return response.data.data as T
}

/**
 * 取得 BaseResponse - 包含 data 和 error
 *
 * **手動處理錯誤時使用**：不自動拋出異常，需要手動判斷 data/error
 *
 * @returns BaseResponse<T> 後端標準回應結構
 */
export async function requestBase<T>(config: AxiosRequestConfig): Promise<BaseResponse<T>> {
  const response = await axiosService.request<BaseResponse<T>>(config)
  return response.data
}

export { axiosService }
export type { AxiosRequestConfig, AxiosResponse }
