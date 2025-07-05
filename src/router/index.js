import { createRouter, createWebHistory } from 'vue-router'
import EditorPreview from '../views/EditorPreview.vue'
import PreviewWindow from '../views/PreviewWindow.vue'

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
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
