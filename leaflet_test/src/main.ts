import './assets/main.css'
import '@telekom/scale-components/dist/scale-components/scale-components.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { defineCustomElements } from '@telekom/scale-components/loader'





import App from './App.vue'
import router from './router'

defineCustomElements();
const app = createApp(App)

app.use(createPinia())
app.use(router)
app.mount('#app')

router.replace('/') // Immer auf die Registrierungsseite umleiten nach der Refresh-Seite
