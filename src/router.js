import Vue from 'vue';
import VueRouter from 'vue-router';
import Cookies from 'js-cookie';

// Components
import HomeView from './views/HomeView.vue'
import LoginView from './views/LoginView.vue';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/',      name: 'home',  component: HomeView },
    { path: '/login', name: 'login', component: LoginView }
  ]
});

router.beforeEach((to, from, next) => {
  const username = Cookies.get('username');

  if (to.name === 'login') !!username ? next({ name: 'home' }) : next();
  else !!username ? next() : next({ name: 'login' });
});

export default router;
