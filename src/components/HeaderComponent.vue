<template>
  <div id="header-div">
    <div id="header-logout">
      <span id="header-logout-username">{{ username }}</span>
      <button id="header-logout-button"
              @click.prevent="logout">Logout</button>
    </div>
  </div>
</template>

<script>
import Session from '/modules/session';

export default {
  name: 'HeaderComponent',
  props: {
    username: String
  },
  methods: {
    logout: function() {
      console.log('yes');
      this.$socket.emit('client_logout', (ok) => {
        if (!ok) return;
        Session.logout();
        this.$router.go({ name: 'login' });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
#header-div {
  height: 48px;
  background: #292929;
  box-shadow: 0px 0px 8px 4px #111111;
}

#header-logout {
  float: right;
  background: yellow;
}
</style>
