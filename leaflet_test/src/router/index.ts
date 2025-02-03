import { createRouter, createWebHistory } from 'vue-router'
import { tokenStore } from '@/stores/tockenStorage'

import RegisterationUser from '@/views/RegisterationUser.vue'
import LoginUser from '@/views/LoginUser.vue'
import CreateProjects from '@/views/superadmin_routers/CreateProjects.vue'
import LeafletMap from '../views/companyEditor_routers/LeafletMap.vue'
import GetProjects from '@/views/telekomeditor_routers/GetProjects.vue'
import NotificationEditor from '@/views/telekomeditor_routers/NotificationEditor.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
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
      meta: { requiresAuth: true } // Diese Route erfordert Authentifizierung
    },
    {
      path: '/leafletMap',
      name: 'leafletMap',
      component: LeafletMap,
    },
    {
      path: '/getProjects',
      name: 'getProjects',
      component: GetProjects,
    },
    {
      path: '/notificationEditor',
      name: 'notificationEditor',
      component: NotificationEditor,
    }
  ],
})

/**/

// Navigation Guard --> if the authToken is not there, then has to be shown the register page
router.beforeEach(async (to, from, next) => {
  const store = tokenStore()
  const authToken = store.tocken || localStorage.getItem('authToken')

  if (!authToken) {
    if (to.path !== '/') {
      return next('/') 
    }
    next() 
  } else {
 
    const isAuthenticated = !!authToken

    if (to.meta.requiresAuth && !isAuthenticated) {
      return next('/') 
    } else {
      next() 
    }
  }
})


export default router
