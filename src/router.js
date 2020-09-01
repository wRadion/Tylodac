// Libraries
import Vue from 'vue';
import VueRouter from 'vue-router';

// Modules
import Session from '/modules/session';

// Components
import LoginView from './views/LoginView';
import HomeView from './views/HomeView';
import GameSoloView from './views/GameSoloView';
import NotFoundView from './views/NotFoundView';

import HeaderComponent from './components/HeaderComponent';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
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
      path: '/solo',
      name: 'solo',
      components: {
        default: GameSoloView,
        header: HeaderComponent
      },
      meta: { requiresAuth: true }
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
