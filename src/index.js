import Vue from 'vue';
import VueSocketIO from 'vue-socket.io'
import App from './App';

import router from './router';

Vue.use(new VueSocketIO({
  connection: window.location.hostname + ':4321'
}));

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
