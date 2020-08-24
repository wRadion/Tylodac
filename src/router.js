// Libraries
import Vue from 'vue';
import VueRouter from 'vue-router';

// Modules
import Session from '/modules/session';

// Components
import HomeView from './views/HomeView.vue';
import LoginView from './views/LoginView.vue';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth) && !Session.isLogged()) return next({ name: 'login' });
  return next();
});

export default router;
