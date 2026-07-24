import type { App } from 'vue'
import { Quasar, Dialog, Loading, LoadingBar, Notify } from 'quasar'

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/material-symbols-outlined/material-symbols-outlined.css'
import '@quasar/extras/mdi-v7/mdi-v7.css'

// Import Quasar css
import 'quasar/src/css/index.sass'

export default {
  install: (app: App) => {
    app.use(Quasar, {
      plugins: { Dialog, Loading, LoadingBar, Notify }, // import Quasar plugins and add here

      config: {
        loading: {
          delay: 500,
        } /* look at QuasarConfOptions from the API card */,
        loadingBar: {
          position: 'bottom',
        } /* look at QuasarConfOptions from the API card */,
        notify: {
          color: 'primary',
        } /* look at QuasarConfOptions from the API card */,
        dark: false,
      },
    })
  },
}
