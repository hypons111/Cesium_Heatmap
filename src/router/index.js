import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'earth',
    component: function () {
      return import('../views/EarthView.vue')
    }
  },
  {
    path: '/modal',
    name: 'modal',
    component: function () {
      return import('../views/ModalView.vue')
    }
  },
  {
    path: '/template',
    name: 'template',
    component: function () {
      return import('../views/TemplateView.vue')
    }
  },
  {
    path: '/colorModal',
    name: 'colorModal',
    component: function () {
      return import('../views/ColorModalView.vue')
    }
  },
  {
    path: '/heatmapView',
    name: 'heatmapView',
    component: function () {
      return import('../views/HeatmapView.vue')
    }
  }

]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
