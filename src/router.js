import Vue from 'vue';
import Router from 'vue-router';

// Components
import HomeView from './views/HomeView.vue'
import LoginView from './views/LoginView.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    { path: '/',      name: 'home',  component: HomeView },
    { path: '/login', name: 'login', component: LoginView }
  ]
});
