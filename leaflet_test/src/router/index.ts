import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RegisterationUser from '@/views/RegisterationUser.vue'
import LoginUser from '@/views/LoginUser.vue'
import CreateProjects from '@/views/superadmin_routers/CreateProjects.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/registerationUser',
      name: 'registerationUser',
      component: RegisterationUser,
    },
    {
      path: '/loginUser',
      name: 'loginUser',
      component: LoginUser,
    },
    {
      path: '/createProjects',
      name: 'createProjects',
      component: CreateProjects,
    }
  ],
})

export default router
