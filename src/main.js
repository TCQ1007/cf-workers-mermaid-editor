import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { microAppLifecycle, isInJingdongMicroApp } from './config/microapp.js'

// 微前端生命周期：挂载前
microAppLifecycle.beforeMount()

const app = createApp(App)

app.use(router)

// 错误处理
app.config.errorHandler = (err, vm, info) => {
  console.error('Vue应用错误:', err, info)

  // 在微前端环境中向父应用报告错误
  if (isInJingdongMicroApp() && window.parent !== window) {
    window.parent.postMessage({
      type: 'MICRO_APP_ERROR',
      name: 'mermaid',
      error: err.message,
      info,
      timestamp: Date.now()
    }, '*')
  }
}

app.mount('#app')

// 监听微前端卸载事件
if (isInJingdongMicroApp()) {
  window.addEventListener('beforeunload', () => {
    microAppLifecycle.beforeUnmount()
  })

  window.addEventListener('unload', () => {
    microAppLifecycle.unmounted()
  })
}
