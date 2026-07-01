import { requestData } from '@/services/axiosService'
import type { Post, PostCreateRequest, PostUpdateRequest } from '@/pages/Posts/types'
import type { CreatedResponse, UpdatedResponse, DeletedResponse } from '@/services/axiosService'

/** 文章 API 路徑前綴 */
const RESOURCE = '/api/posts'

/**
 * 取得文章列表
 * @returns 文章陣列
 */
export function getPosts(): Promise<Post[]> {
  return requestData<Post[]>({ method: 'GET', url: RESOURCE })
}

/**
 * 取得單篇文章
 * @param id 文章編號
 */
export function getPost(id: string | number): Promise<Post> {
  return requestData<Post>({ method: 'GET', url: `${RESOURCE}/${id}` })
}

/**
 * 新增文章
 * @param payload 文章內容
 */
export function createPost(payload: PostCreateRequest): Promise<CreatedResponse> {
  return requestData<CreatedResponse>({ method: 'POST', url: RESOURCE, data: payload })
}

/**
 * 更新文章
 * @param payload 文章內容（含 id）
 */
export function updatePost(payload: PostUpdateRequest): Promise<UpdatedResponse> {
  const { id, ...data } = payload
  return requestData<UpdatedResponse>({ method: 'PUT', url: `${RESOURCE}/${id}`, data })
}

/**
 * 刪除文章
 * @param id 文章編號
 */
export function deletePost(id: string | number): Promise<DeletedResponse> {
  return requestData<DeletedResponse>({ method: 'DELETE', url: `${RESOURCE}/${id}` })
}
