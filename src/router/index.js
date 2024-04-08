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
    path: '/cmpt_1',
    name: 'cmpt_1',
    component: function () {
      return import('../views/cmptView_1.vue')
    }
  },
  {
    path: '/cmpt_1.5',
    name: 'cmpt_1.5',
    component: function () {
      return import('../views/cmptView_1.5.vue')
    }
  },
  {
    path: '/colorModal',
    name: 'colorModal',
    component: function () {
      return import('../views/ColorModalView.vue')
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
