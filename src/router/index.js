import { createRouter, createWebHistory } from 'vue-router'
import EditorPreview from '../views/EditorPreview.vue'
import PreviewWindow from '../views/PreviewWindow.vue'
import NotFound from '../views/NotFound.vue'

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
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
