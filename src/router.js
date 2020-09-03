// Libraries
import Vue from 'vue';
import VueRouter from 'vue-router';

// Modules
import Session from '/modules/session';

// Components
import LoginView from './views/LoginView';
import HomeView from './views/HomeView';
import NotFoundView from './views/NotFoundView';

import HeaderComponent from './components/HeaderComponent';

import SoloGameView from './views/solo/SoloGameView';
import SoloSettingsView from './views/solo/SoloSettingsView';

import MultiRoomsView from './views/multi/MultiRoomsView';
import MultiRoomCreateView from './views/multi/MultiRoomCreateView';
import MultiGameView from './views/multi/MultiGameView';

Vue.use(VueRouter);

function defaultRoute(path, name, component) {
  return {
    path,
    name,
    components: {
      default: component,
      header: HeaderComponent
    },
    meta: { requiresAuth: true }
  }
}

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/login', name: 'login', component: LoginView },
    { path: '*', component: NotFoundView },
    defaultRoute('/', 'home', HomeView),
    defaultRoute('/solo/game', 'solo-game', SoloGameView),
    defaultRoute('/solo/settings', 'solo-settings', SoloSettingsView),
    defaultRoute('/multi/rooms', 'multi-rooms', MultiRoomsView),
    defaultRoute('/multi/rooms/create', 'multi-room-create', MultiRoomCreateView),
    defaultRoute('/multi/room/:id', 'multi-room', MultiGameView)
  ]
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth) && !Session.isLogged()) return next({ name: 'login' });
  return next();
});

export default router;
