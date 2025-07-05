import { createRouter, createWebHistory } from 'vue-router'
import EditorPreview from '../views/EditorPreview.vue'
import PreviewWindow from '../views/PreviewWindow.vue'
import { getBasePath, microAppLifecycle } from '../config/microapp.js'

const basePath = getBasePath()

const routes = [
  {
    path: '/',
    name: 'EditorPreview',
    component: EditorPreview
  },
  {
    path: '/preview',
    name: 'PreviewWindow',
    component: PreviewWindow
  }
]

const router = createRouter({
  history: createWebHistory(basePath),
  routes
})

// 添加路由守卫，用于调试和监控
router.beforeEach((to, from, next) => {
  console.log(`🚀 路由跳转: ${from.path} -> ${to.path} (basePath: ${basePath})`)
  next()
})

// 路由就绪后触发微前端生命周期
router.isReady().then(() => {
  microAppLifecycle.mounted()
})

export default router
