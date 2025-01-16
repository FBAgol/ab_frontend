import { createRouter, createWebHistory } from 'vue-router'
import { tokenStore } from '@/stores/tockenStorage'

import RegisterationUser from '@/views/RegisterationUser.vue'
import LoginUser from '@/views/LoginUser.vue'
import CreateProjects from '@/views/superadmin_routers/CreateProjects.vue'
import HomeView from '../views/HomeView.vue'

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
      path: '/home',
      name: 'home',
      component: HomeView,
    }
  ],
})

// Navigation Guard
router.beforeEach(async (to, from, next) => {
  const store = tokenStore()

  // Wenn der Token noch nicht aus localStorage geladen wurde, prüfen wir und warten.
  const authToken = store.tocken || localStorage.getItem('authToken')

  if (!authToken) {
    // Wenn kein Token vorhanden ist, leite immer auf die Registrierung weiter.
    if (to.path !== '/') {
      return next('/') // Immer auf die Registrierung weiterleiten
    }
    next() // Bleibe auf '/' (Registrierung)
  } else {
    // Wenn der Benutzer angemeldet ist und Authentifizierung erforderlich ist.
    const isAuthenticated = !!authToken

    if (to.meta.requiresAuth && !isAuthenticated) {
      return next('/') // Wenn die Route Authentifizierung benötigt und der Benutzer nicht authentifiziert ist.
    } else {
      next() // Andernfalls fortfahren
    }
  }
})


export default router
