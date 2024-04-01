import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import pinia from '@/stores/index'
import '@/assets/main.scss'

const app = createApp(App)

app.use(router)
app.use(pinia)
app.mount('#app')
