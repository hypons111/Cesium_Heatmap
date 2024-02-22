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
    path: '/MH1',
    name: '1',
    component: function () {
      return import('../views/Model+HeatmapView_1.vue')
    }
  },
  {
    path: '/MH2',
    name: '2',
    component: function () {
      return import('../views/Model+HeatmapView_2.vue')
    }
  },
  {
    path: '/x',
    name: 'x',
    component: function () {
      return import('../views/xView.vue')
    }
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
