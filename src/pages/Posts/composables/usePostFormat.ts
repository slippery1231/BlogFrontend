/**
 * 文章顯示格式化工具
 * 提供摘要、閱讀時間、頭像縮寫等純函式，供列表/詳細頁共用
 */
export function usePostFormat() {
  /**
   * 產生文章摘要
   * @param content 文章內容
   * @param max 最大字數，預設 62
   */
  function excerpt(content?: string | null, max = 62): string {
    const text = (content ?? '').replace(/\s+/g, ' ').trim()
    return text.length > max ? `${text.slice(0, max)}…` : text
  }

  /**
   * 估算閱讀時間（分鐘）
   * @param content 文章內容
   */
  function readingTime(content?: string | null): number {
    const length = (content ?? '').trim().length
    return Math.max(1, Math.round(length / 300))
  }

  /**
   * 取得作者頭像縮寫（首字）
   * @param name 作者名稱
   */
  function initial(name?: string | null): string {
    const trimmed = (name ?? '').trim()
    return trimmed ? trimmed.charAt(0) : '·'
  }

  return { excerpt, readingTime, initial }
}