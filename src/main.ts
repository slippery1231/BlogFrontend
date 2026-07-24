import { createApp } from 'vue'
import { createPinia } from 'pinia'
import vue3GoogleLogin from 'vue3-google-login'

import App from './App.vue'
import router from './router'
import i18n from './boot/i18n'

import quasarPlugin from '@/plugins/quasar'
import '@/assets/scss/styles.scss'
import '@/assets/tailwind.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(quasarPlugin)
app.use(router)
app.use(i18n)
// Google 登入：只帶 clientId 初始化，實際觸發交由各頁的 GoogleLogin 元件處理
app.use(vue3GoogleLogin, {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
})
app.mount('#app')
