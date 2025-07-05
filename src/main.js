import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { microAppLifecycle } from './config/microapp.js'

// 微前端生命周期：挂载前
microAppLifecycle.beforeMount()

const app = createApp(App)

app.use(router)

app.mount('#app')
