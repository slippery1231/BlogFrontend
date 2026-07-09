import { requestData } from '@/services/axiosService'
import type {
  LoginRequest,
  RegisterRequest,
  GoogleLoginRequest,
  AuthResponse,
  SendVerificationEmailRequest,
  SendVerificationEmailResponse,
} from '@/pages/Auth/types'
import type { CreatedResponse } from '@/services/axiosService'

/** 呼叫路徑 */
const BASE_API_URL = `/api/auth`

// ==================== API ====================
/**
 * 登入
 * @param payload 帳號密碼
 * @returns 含 accessToken 的驗證資料
 */
export function login(payload: LoginRequest): Promise<AuthResponse> {
  return requestData<AuthResponse>({ method: 'POST', url: `${BASE_API_URL}/login`, data: payload })
}

/**
 * Google 登入
 * @param payload 含 Google credential（id_token）
 * @returns 含 accessToken 的驗證資料
 */
export function loginWithGoogle(payload: GoogleLoginRequest): Promise<AuthResponse> {
  return requestData<AuthResponse>({ method: 'POST', url: `${BASE_API_URL}/google`, data: payload })
}

/**
 * 註冊
 * @param payload 註冊資料
 */
export function register(payload: RegisterRequest): Promise<CreatedResponse> {
  return requestData<CreatedResponse>({ method: 'POST', url: `${BASE_API_URL}/register`, data: payload })
}

/**
 * 寄送註冊驗證碼郵件
 * @param payload 收件電子信箱
 */
export function sendVerificationEmail(payload: SendVerificationEmailRequest): Promise<SendVerificationEmailResponse> {
  return requestData<SendVerificationEmailResponse>({ method: 'POST', url: `${BASE_API_URL}/send-verification-email`, data: payload })
}
