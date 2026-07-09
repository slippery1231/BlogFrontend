// ==================== request ====================
/** 登入請求資料 */
export interface LoginRequest {
  /** 電子信箱 */
  account: string
  /** 密碼 */
  password: string
}

/** Google 登入請求資料 */
export interface GoogleLoginRequest {
  /** Google 簽發的 JWT id_token（credential），交由後端驗證 */
  credential: string
}

/** 註冊請求資料 */
export interface RegisterRequest {
  /** 姓氏 */
  lastName: string
  /** 名字 */
  firstName: string
  /** 主要電子信箱 */
  emailPrimary: string
  /** 密碼 */
  password: string
  /** 電子信箱驗證碼 */
  verificationCode: string
}

/** 寄送註冊驗證碼請求資料 */
export interface SendVerificationEmailRequest {
  /** 電子信箱 */
  email: string
}

// ==================== response ====================
/** 驗證成功後的回應資料 */
export interface AuthResponse {
  /** Json Web Token */
  accessToken: string
  /** 使用者基本資料（選填） */
  user?: AuthUser | null
}

/** 使用者基本資料 */
export interface AuthUser {
  /** 使用者唯一編號 */
  id: string | number
  /** 暱稱 */
  name: string
  /** 電子信箱 */
  email: string
}

/** 寄送註冊驗證碼回應資料 */
export interface SendVerificationEmailResponse {
  /** 是否已發送 */
  emailSent: boolean
  /** 驗證碼過期時間（分鐘） */
  expirationMinutes: number
}
