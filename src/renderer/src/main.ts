import './css/main.css'

import { createApp } from 'vue'
import App from '@renderer/App.vue'
import { createPinia } from 'pinia'
import { initializeApp } from '@renderer/code/initialize-app/initialize-app'

const app = createApp(App)
app.use(createPinia())

initializeApp()

app.mount('#app')
