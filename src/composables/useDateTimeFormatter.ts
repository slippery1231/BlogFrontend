import dayjs from 'dayjs'

/** 預設日期時間格式 */
const DEFAULT_DATETIME_FORMAT = 'YYYY-MM-DD HH:mm'
/** 預設日期格式 */
const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD'

/**
 * 日期時間格式化 Composable
 * 以 dayjs 為基礎，提供統一的日期時間格式化工具
 */
export function useDateTimeFormatter() {
  /**
   * 格式化日期時間
   * @param value ISO 8601 字串、時間戳或 Date 物件
   * @param format 輸出格式，預設 `YYYY-MM-DD HH:mm`
   * @returns 格式化後字串；輸入為空或無效時回傳空字串
   */
  function formatDateTime(value?: string | number | Date | null, format: string = DEFAULT_DATETIME_FORMAT): string {
    if (value === null || value === undefined || value === '') return ''
    const parsed = dayjs(value)
    return parsed.isValid() ? parsed.format(format) : ''
  }

  /**
   * 格式化日期（不含時間）
   * @param value ISO 8601 字串、時間戳或 Date 物件
   * @returns 格式化後字串；輸入為空或無效時回傳空字串
   */
  function formatDate(value?: string | number | Date | null): string {
    return formatDateTime(value, DEFAULT_DATE_FORMAT)
  }

  return {
    formatDateTime,
    formatDate,
  }
}
