import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { userStore } from '../stores/userStore'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/RegisterView.vue')
  },
  {
    path: '/main',
    name: 'main',
    component: () => import('../views/MainView.vue'),
    meta: { requiresAuth: true } 
  },
  { path: '/:pathMatch(.*)*', 
    redirect: '/' 
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = userStore();
  const isAuthenticated = authStore.isAuthenticated;

  if (to.meta.requiresAuth && isAuthenticated) {
    next('/');
  } else {
    next();
  }
});

export default router