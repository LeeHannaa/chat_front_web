import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/chat',
      name: 'chat',
      component: () => import('../views/ChatView.vue'),
      props: (route) => ({
        id: Number(route.query.id),
        name: route.query.name,
        from: route.query.from,
      }),
    },
    {
      path: '/apt',
      name: 'apt',
      component: () => import('../views/AptView.vue'),
    },
    {
      path: '/aptDetail',
      name: 'aptDetail',
      component: () => import('../views/AptDetailView.vue'),
      props: (route) => ({
        id: Number(route.query.id),
        name: route.query.name,
      }),
    },
  ],
})

export default router
