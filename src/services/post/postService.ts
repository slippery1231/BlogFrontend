import { requestData } from '@/services/axiosService'
import type { Post, PostCreateRequest, PostUpdateRequest } from '@/pages/Posts/types'
import type { CreatedResponse, UpdatedResponse, DeletedResponse } from '@/services/axiosService'

/** 呼叫路徑 */
const BASE_API_URL = `${import.meta.env.VITE_API_URL}/api/posts`

/**
 * 取得文章列表
 * @returns 文章陣列
 */
export function getPosts(): Promise<Post[]> {
  return requestData<Post[]>({ method: 'GET', url: BASE_API_URL })
}

/**
 * 取得單篇文章
 * @param id 文章編號
 */
export function getPost(id: string | number): Promise<Post> {
  return requestData<Post>({ method: 'GET', url: `${BASE_API_URL}/${id}` })
}

/**
 * 新增文章
 * @param payload 文章內容
 */
export function createPost(payload: PostCreateRequest): Promise<CreatedResponse> {
  return requestData<CreatedResponse>({ method: 'POST', url: BASE_API_URL, data: payload })
}

/**
 * 更新文章
 * @param payload 文章內容（含 id）
 */
export function updatePost(payload: PostUpdateRequest): Promise<UpdatedResponse> {
  const { id, ...data } = payload
  return requestData<UpdatedResponse>({ method: 'PUT', url: `${BASE_API_URL}/${id}`, data })
}

/**
 * 刪除文章
 * @param id 文章編號
 */
export function deletePost(id: string | number): Promise<DeletedResponse> {
  return requestData<DeletedResponse>({ method: 'DELETE', url: `${BASE_API_URL}/${id}` })
}
