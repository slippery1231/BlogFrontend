import { request, type ResponseStructure } from '@/services/axiosService.ts'

/** 呼叫路徑 */
const BASE_API_URL = `${import.meta.env.VITE_API_URL}/api/announcements`

// ==================== response ====================
/** 公告查詢回應介面 */
export interface AnnouncementResponse {
  /** 唯一編號 */
  id: string
  /** 公告主旨 */
  title: string
  /** 公告內容 */
  content: string
  /** 是否啟用 */
  isActive: boolean
  /** 是否置頂 */
  pinned: boolean
  /** 發布時間 */
  publishedAt: string | null
  /** 到期時間 */
  expiresAt: string | null
  /** 新增時間 */
  createdAt: string | null
  /** 新增人員 */
  createdBy: string | null
  /** 更新時間 */
  updatedAt: string | null
  /** 更新人員 */
  updatedBy: string | null
}

/** 公告查詢指定回應介面 */
export interface AnnouncementDetailResponse {
  /** 唯一編號 */
  id: string
  /** 公告主旨 */
  title: string
  /** 公告內容 */
  content: string
  /** 是否啟用 */
  isActive: boolean
  /** 是否置頂 */
  pinned: boolean
  /** 發布時間 */
  publishedAt: string | null
  /** 到期時間 */
  expiresAt: string | null
  /** 附件 */
  attachments: AnnouncementAttachmentsResponse[]
  /** 新增時間 */
  createdAt: string | null
  /** 新增人員 */
  createdBy: string | null
  /** 更新時間 */
  updatedAt: string | null
  /** 更新人員 */
  updatedBy: string | null
}

/** 公告附件回應 */
export interface AnnouncementAttachmentsResponse {
  /** 下載連結 */
  url: string
  /** 原始檔名 */
  originalFileName: string
  /** 現在檔名 */
  currentFileName: string
  /** 檔案大小 */
  fileSize: number
  /** 檔案類型 */
  contentType: string
  /** 儲存桶名稱 */
  bucketName: string
  /** 儲存桶儲存路徑 */
  objectName: string
  /** 下載時顯示的檔名 */
  displayFileName: string | null
  /** 顯示順序 */
  displayOrder: number
}

// ==================== API ====================
export function getAnnouncements(): Promise<ResponseStructure<AnnouncementResponse[]>> {
  return request<AnnouncementResponse[]>({ method: 'GET', url: `${BASE_API_URL}` })
}

export function getAnnouncementById(announcementId: string): Promise<ResponseStructure<AnnouncementDetailResponse>> {
  return request<AnnouncementDetailResponse>({ method: 'GET', url: `${BASE_API_URL}/${announcementId}` })
}
