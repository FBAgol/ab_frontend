import './assets/main.css'
import '@telekom/scale-components/dist/scale-components/scale-components.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { defineCustomElements } from '@telekom/scale-components/loader' // Komponenten-Bibliothek laden

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Custom Elements registrieren
defineCustomElements()

app.mount('#app')
