import { requestData } from '@/services/axiosService'
import type { LoginRequest, RegisterRequest, GoogleLoginRequest, AuthResponse } from '@/pages/Auth/types'
import type { CreatedResponse } from '@/services/axiosService'

/** 身分驗證 API 路徑前綴 */
const RESOURCE = '/api/auth'

// ==================== API ====================
/**
 * 登入
 * @param payload 帳號密碼
 * @returns 含 accessToken 的驗證資料
 */
export function login(payload: LoginRequest): Promise<AuthResponse> {
  return requestData<AuthResponse>({ method: 'POST', url: `${RESOURCE}/login`, data: payload })
}

/**
 * Google 登入
 * @param payload 含 Google credential（id_token）
 * @returns 含 accessToken 的驗證資料
 */
export function loginWithGoogle(payload: GoogleLoginRequest): Promise<AuthResponse> {
  return requestData<AuthResponse>({ method: 'POST', url: `${RESOURCE}/google`, data: payload })
}

/**
 * 註冊
 * @param payload 註冊資料
 */
export function register(payload: RegisterRequest): Promise<CreatedResponse> {
  return requestData<CreatedResponse>({ method: 'POST', url: `${RESOURCE}/register`, data: payload })
}
