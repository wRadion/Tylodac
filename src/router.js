// Libraries
import Vue from 'vue';
import VueRouter from 'vue-router';

// Modules
import Session from '/modules/session';

// Components
import HomeView from './views/HomeView';
import LoginView from './views/LoginView';
import NotFoundView from './views/NotFoundView';

import HeaderComponent from './components/HeaderComponent';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      components: {
        default: HomeView,
        header: HeaderComponent
      },
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '*',
      component: NotFoundView
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth) && !Session.isLogged()) return next({ name: 'login' });
  return next();
});

export default router;
