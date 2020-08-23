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
    { path: '/',      name: 'home',  component: HomeView, meta: { requiresAuth: true } },
    { path: '/login', name: 'login', component: LoginView }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const username = Cookies.get('username');
    if (!username) return next({ name: 'login' });
  }
  return next();
});

export default router;
