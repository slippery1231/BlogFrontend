/** 日期時間轉換工具 */
import dayjs from 'dayjs'

/**
 * 將日期字串或 Date 物件轉換為 ISO 8601 UTC 格式
 * 用於發送 API 請求
 * @param date YYYY-MM-DD 格式的日期字串或 Date 物件
 * @returns ISO 8601 UTC 格式的日期字串
 * @example
 * toISO8601('2024-01-15')
 * // "2024-01-14T16:00:00.000Z" (UTC)
 * toISO8601(new Date('2024-01-15'))
 * // "2024-01-15T00:00:00.000Z" (UTC)
 */
export function toISO8601(date: string | Date | null | undefined): string {
  if (!date) return ''
  const d = dayjs(date instanceof Date ? date : `${date}T00:00:00`)
  if (!d.isValid()) return ''
  return d.toDate().toISOString()
}

/**
 * 將日期字串或 Date 物件轉換為帶時區的 ISO 8601 格式
 * 用於 debug 時查看，日期顯示與用戶選擇一致
 * @param date YYYY-MM-DD 格式的日期字串或 Date 物件
 * @returns ISO 8601 格式的日期字串（包含本地時區偏移）
 * @example
 * toDateWithTimezone('2024-01-15')
 * // "2024-01-15T00:00:00+08:00" (台灣時區)
 * toDateWithTimezone(new Date('2024-01-15T08:30:00'))
 * // "2024-01-15T08:30:00+08:00" (台灣時區)
 */
export function toDateWithTimezone(date: string | Date | null | undefined): string {
  if (!date) return ''
  const d = date instanceof Date ? dayjs(date) : dayjs(date)
  if (!d.isValid()) return ''
  const offsetMinutes = d.toDate().getTimezoneOffset()
  const offsetHours = Math.abs(Math.floor(offsetMinutes / 60))
  const offsetMins = Math.abs(offsetMinutes % 60)
  const offsetSign = offsetMinutes <= 0 ? '+' : '-'
  const offsetStr = `${offsetSign}${String(offsetHours).padStart(2, '0')}:${String(offsetMins).padStart(2, '0')}`
  // Date 物件保留完整時間，字串則用 00:00:00
  if (date instanceof Date) {
    return `${d.format('YYYY-MM-DDTHH:mm:ss')}${offsetStr}`
  }
  return `${d.format('YYYY-MM-DD')}T00:00:00${offsetStr}`
}

/**
 * 將 ISO 8601 UTC 格式轉換回本地 YYYY-MM-DD 日期字串
 * 用於接收 API 回應，將 UTC 時間轉換為本地日期
 * @param isoString ISO 8601 UTC 格式的日期字串
 * @returns 本地時區的 YYYY-MM-DD 日期字串
 * @example
 * fromISO8601('2026-03-02T16:00:00+00:00')
 * // "2026-03-03" (台灣時區 UTC+8)
 */
export function fromISO8601Date(isoString: string | null | undefined): string {
  if (!isoString) return ''
  const d = dayjs(isoString)
  if (!d.isValid()) return ''
  return d.format('YYYY-MM-DD')
}

/**
 * 將 ISO 8601 UTC 格式轉換回本地 YYYY-MM-DD HH:mm:ss 日期時間字串
 * 用於接收 API 回應，將 UTC 時間轉換為本地日期時間
 * @param isoString ISO 8601 UTC 格式的日期時間字串
 * @returns 本地時區的 YYYY-MM-DD HH:mm:ss 日期時間字串
 * @example
 * fromISO8601DateTime('2026-03-02T16:30:00+00:00')
 * // "2026-03-03 00:30:00" (台灣時區 UTC+8)
 */
export function fromISO8601DateTime(isoString: string | null | undefined): string {
  if (!isoString) return ''
  const d = dayjs(isoString)
  if (!d.isValid()) return ''
  return d.format('YYYY-MM-DD HH:mm:ss')
}

/**
 * 將 ISO 8601 UTC 格式轉換回本地 YYYY-MM-DD HH:mm 日期時間字串
 * 用於接收 API 回應，將 UTC 時間轉換為本地日期時間（精確到分鐘）
 * @param isoString ISO 8601 UTC 格式的日期時間字串
 * @returns 本地時區的 YYYY-MM-DD HH:mm 日期時間字串
 * @example
 * fromISO8601DateTimeMinute('2026-03-02T16:30:45+00:00')
 * // "2026-03-03 00:30" (台灣時區 UTC+8)
 */
export function fromISO8601DateTimeMinute(isoString: string | null | undefined): string {
  if (!isoString) return ''
  const d = dayjs(isoString)
  if (!d.isValid()) return ''
  return d.format('YYYY-MM-DD HH:mm')
}

/**
 * 日期時間轉換 composable
 */
export function useDateTimeConverter() {
  return {
    toISO8601,
    fromISO8601: fromISO8601Date,
    fromISO8601DateTime,
    fromISO8601DateTimeMinute,
    toDateWithTimezone,
  }
}
