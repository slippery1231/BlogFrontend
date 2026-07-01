/**
 * 統一的日誌管理系統
 * 提供開發環境除錯和生產環境控制功能
 */

/** 日誌等級類型 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

/** Logger 配置介面 */
export interface LoggerConfig {
  /** 日誌前綴，用於識別不同模組 */
  prefix: string
  /** 是否啟用日誌輸出 */
  enabled: boolean
  /** 最小日誌等級，低於此等級的日誌不會輸出 */
  minLevel?: LogLevel
  /** 是否顯示時間戳 */
  showTimestamp?: boolean
  /** 是否顯示堆疊追蹤（僅錯誤等級） */
  showStack?: boolean
}

/** 日誌等級權重，用於比較等級 */
const LOG_LEVEL_WEIGHTS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

/** 日誌等級對應的 emoji */
const LOG_LEVEL_EMOJIS: Record<LogLevel, string> = {
  debug: '🔍',
  info: 'ℹ️',
  warn: '⚠️',
  error: '❌',
}

/** 日誌等級對應的樣式 */
const LOG_LEVEL_STYLES: Record<LogLevel, string> = {
  debug: 'color: #6B7280; background: #F3F4F6; padding: 2px 6px; border-radius: 4px;',
  info: 'color: #059669; background: #D1FAE5; padding: 2px 6px; border-radius: 4px;',
  warn: 'color: #D97706; background: #FEF3C7; padding: 2px 6px; border-radius: 4px;',
  error: 'color: #DC2626; background: #FEE2E2; padding: 2px 6px; border-radius: 4px;',
}

/**
 * 創建 Logger 實例
 * @param config Logger 配置
 * @returns Logger 實例
 *
 * @example
 * ```typescript
 * // 基本使用
 * const logger = useLogger({ prefix: 'PostService', enabled: true })
 * logger.info('文章載入成功', { count: 10 })
 *
 * // 進階配置
 * const logger = useLogger({
 *   prefix: 'API',
 *   enabled: import.meta.env.DEV,
 *   minLevel: 'info',
 *   showTimestamp: true,
 *   showStack: true
 * })
 * logger.debug('這不會顯示，因為 minLevel 是 info')
 * logger.error('API 錯誤', error)
 * ```
 */
export function useLogger(config: Partial<LoggerConfig> = {}) {
  // 預設配置
  const defaultConfig: LoggerConfig = {
    prefix: '',
    enabled: import.meta.env.DEV,
    minLevel: 'debug',
    showTimestamp: false,
    showStack: false,
  }

  const finalConfig = { ...defaultConfig, ...config }

  /**
   * 檢查是否應該輸出日誌
   */
  function shouldLog(level: LogLevel): boolean {
    if (!finalConfig.enabled) return false

    const currentWeight = LOG_LEVEL_WEIGHTS[level]
    const minWeight = LOG_LEVEL_WEIGHTS[finalConfig.minLevel!]

    return currentWeight >= minWeight
  }

  /**
   * 格式化日誌前綴
   */
  function formatPrefix(level: LogLevel): string {
    const parts: string[] = []

    // 時間戳
    if (finalConfig.showTimestamp) {
      const now = new Date()
      const timestamp = now.toLocaleTimeString('zh-TW', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
      const milliseconds = now.getMilliseconds().toString().padStart(3, '0')
      parts.push(`[${timestamp}.${milliseconds}]`)
    }

    // 等級 emoji
    parts.push(LOG_LEVEL_EMOJIS[level])

    // 模組前綴
    if (finalConfig.prefix) {
      parts.push(`[${finalConfig.prefix}]`)
    }

    return parts.join(' ')
  }

  /**
   * 輸出日誌
   */
  function log(level: LogLevel, ...args: unknown[]) {
    if (!shouldLog(level)) return

    const prefix = formatPrefix(level)
    const style = LOG_LEVEL_STYLES[level]

    // 使用對應的 console 方法
    const consoleMethod = console[level] || console.log

    if (level === 'error' && finalConfig.showStack && args[0] instanceof Error) {
      // 錯誤等級且啟用堆疊追蹤
      consoleMethod(`%c${prefix}`, style, args[0].message)
      console.error('Stack trace:', args[0].stack)
      if (args.length > 1) {
        consoleMethod('Additional data:', ...args.slice(1))
      }
    } else {
      // 一般日誌輸出
      consoleMethod(`%c${prefix}`, style, ...args)
    }
  }

  return {
    /**
     * 除錯等級日誌 - 詳細的除錯資訊
     * @param args 要輸出的內容
     */
    debug: (...args: unknown[]) => log('debug', ...args),

    /**
     * 資訊等級日誌 - 一般資訊
     * @param args 要輸出的內容
     */
    info: (...args: unknown[]) => log('info', ...args),

    /**
     * 警告等級日誌 - 警告訊息
     * @param args 要輸出的內容
     */
    warn: (...args: unknown[]) => log('warn', ...args),

    /**
     * 錯誤等級日誌 - 錯誤訊息
     * @param args 要輸出的內容
     */
    error: (...args: unknown[]) => log('error', ...args),

    /**
     * 取得當前配置
     */
    getConfig: () => ({ ...finalConfig }),

    /**
     * 動態更新配置
     * @param newConfig 新的配置
     */
    updateConfig: (newConfig: Partial<LoggerConfig>) => {
      Object.assign(finalConfig, newConfig)
    },

    /**
     * 建立子 Logger（繼承當前配置）
     * @param childPrefix 子模組前綴
     * @param childConfig 子配置（可選）
     */
    createChild: (childPrefix: string, childConfig?: Partial<LoggerConfig>) => {
      const childFullPrefix = finalConfig.prefix ? `${finalConfig.prefix}:${childPrefix}` : childPrefix

      return useLogger({
        ...finalConfig,
        ...childConfig,
        prefix: childFullPrefix,
      })
    },
  }
}

/**
 * 全域 Logger 實例，供快速使用
 * 建議在大型專案中為每個模組建立專屬的 Logger
 */
export const globalLogger = useLogger({
  prefix: 'App',
  enabled: import.meta.env.DEV,
  showTimestamp: true,
})
