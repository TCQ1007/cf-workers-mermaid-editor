import { createRouter, createWebHistory } from 'vue-router'
import EditorPreview from '../views/EditorPreview.vue'

const routes = [
  {
    path: '/',
    name: 'EditorPreview',
    component: EditorPreview
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
