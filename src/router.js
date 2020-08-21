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
  if (to.name !== 'login' && !Cookies.get('username')) next('/login');
  else next();
});

export default router;
