import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: function () {
      return import('../views/HomeView.vue')
    }
  },
  {
    path: '/heatMap',
    name: 'heatMap',
    component: function () {
      return import('../views/HeatMapView.vue')
    }
  },
  {
    path: '/cesiumModel',
    name: 'cesiumModel',
    component: function () {
      return import('../views/CesiumModelView.vue')
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
