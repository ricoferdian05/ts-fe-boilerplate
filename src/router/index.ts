import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory } from 'vue-router'
import { isUserLoggedIn } from './utils'
import routes from '~pages'
import { canNavigate } from '@layouts/plugins/casl'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: to => {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}')
        const userRole = userData && userData.role ? userData.role : null

        if (userRole === 'INTERNAL') 
          return { name:  'index' }
        if (userRole === 'CUSTOMER')
          return { name: 'index' }
          
        return { name: 'login', query: to.query }
       },
    },
    {
      path: '/create-link',
      redirect: to => {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}')
        const userRole = userData && userData.role ? userData.role : null

        if (userRole === 'INTERNAL') 
          return { name:  'index' }
        if (userRole === 'CUSTOMER')
          return { name: 'index' }
          
        return { name: 'login', query: to.query }
       },
    },    
    ...setupLayouts(routes),
  ],
})

// router.beforeEach(to => {
//   const isLoggedIn = isUserLoggedIn()

//   if (canNavigate(to)) {
//     if(to.meta.redirectIfLoggedIn && isLoggedIn)
//     return '/'
//   }
//   else {
//     if (isLoggedIn)
//       return { name: 'not-authorized' }
//     else
//     return { name: 'login', query: { to: to.name !== 'index' ? to.fullPath : undefined } }
//   }
// })

// Docs: https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards

export default router
