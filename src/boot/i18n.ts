import { createI18n } from 'vue-i18n'

import messages from '@/i18n'

export type MessageLanguages = keyof typeof messages
export type MessageSchema = (typeof messages)['zh-TW']

/* eslint-disable @typescript-eslint/no-empty-object-type */
declare module 'vue-i18n' {
  export interface DefineLocaleMessage extends MessageSchema {}
  export interface DefineDateTimeFormat {}
  export interface DefineNumberFormat {}
}
/* eslint-enable @typescript-eslint/no-empty-object-type */

export default createI18n({
  locale: 'zh-TW',
  fallbackLocale: 'en-US',
  legacy: false,
  messages,
})