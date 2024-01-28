import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '../views/bigscreen/Bigscreen.vue';
import LoginView from '../views/login/Login.vue';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
  ],
});

export default router;
