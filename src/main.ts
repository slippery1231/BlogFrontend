import { createApp } from 'vue'
import { createPinia } from 'pinia'

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
app.mount('#app')