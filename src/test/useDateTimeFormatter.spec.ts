import { describe, expect, test } from 'vitest'
import { useDateTimeFormatter } from '@/composables/useDateTimeFormatter'

// 測試環境時區固定為 Asia/Taipei（見 vite.config.ts 的 test.env.TZ）
describe('useDateTimeFormatter', () => {
  const { formatDateTime, formatDate } = useDateTimeFormatter()

  describe('空值處理', () => {
    test('null 回傳空字串', () => {
      expect(formatDateTime(null)).toBe('')
    })
    test('undefined 回傳空字串', () => {
      expect(formatDateTime(undefined)).toBe('')
    })
    test('空字串回傳空字串', () => {
      expect(formatDateTime('')).toBe('')
    })
  })

  describe('無效日期', () => {
    test('無法解析的字串回傳空字串', () => {
      expect(formatDateTime('not-a-date')).toBe('')
    })
  })

  describe('格式化', () => {
    test('formatDate 只輸出日期', () => {
      expect(formatDate('2025-06-09T07:19:07Z')).toBe('2025-06-09')
    })
    test('formatDateTime 預設格式', () => {
      expect(formatDateTime('2025-06-09T00:00:00')).toBe('2025-06-09 00:00')
    })
    test('formatDateTime 支援自訂格式', () => {
      expect(formatDateTime('2025-06-09T00:00:00', 'YYYY/MM/DD')).toBe('2025/06/09')
    })
  })
})
