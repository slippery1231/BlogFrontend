/** 文章資料結構 */
export interface Post {
  /** 文章唯一編號 */
  id: string | number
  /** 文章標題 */
  title: string
  /** 文章內容 */
  content: string
  /** 作者名稱 */
  author?: string | null
  /** 分類（顯示於標籤膠囊） */
  category?: string | null
  /** 標籤 */
  tags?: string[]
  /** 建立時間 - ISO 8601 格式 */
  createdAt?: string | null
  /** 更新時間 - ISO 8601 格式 */
  updatedAt?: string | null
}

/** 新增文章的請求資料 */
export interface PostCreateRequest {
  title: string
  content: string
  author?: string
  category?: string
  tags?: string[]
}

/** 更新文章的請求資料 */
export interface PostUpdateRequest extends Partial<PostCreateRequest> {
  id: string | number
}
