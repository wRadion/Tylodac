<template>
  <div id="header-div">
    <router-link v-bind:to="{ name: 'home' }">
      <div id="header-logo">
        <img src="/assets/logo.png" />
        <span><strong>Tylodac</strong></span>
      </div>
    </router-link>
    <div id="header-logout">
      <span v-show="username">
        Connected as: <strong>{{ this.username }}</strong>
      </span>
      <button @click.prevent="logout">
        Logout
      </button>
    </div>
  </div>
</template>

<script>
import Session from '/modules/session';

export default {
  name: 'HeaderComponent',
  data: function() {
    return {
      username: null
    }
  },
  mounted: function() {
    this.$socket.emit('client_username', (username) => {
      this.username = username;
    });
  },
  methods: {
    logout: function() {
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
$height: 48px;

#header-div {
  height: $height;
  background: #292929;
  box-shadow: 0px 0px 8px 4px #111111;
  padding: 0 16px;
  line-height: $height;

  #header-logo {
    position: relative;
    height: $height;
    float: left;

    span {
      position: relative;
      top: -18px;
      color: #CCCCCC;
      text-shadow: 1px 1px #111111;
    }

    img {
      height: $height;
    }
  }

  #header-logout {
    height: $height;
    float: right;

    strong {
      color: #CCCCCC;
    }

    button {
      padding-top: 4px;
      padding-bottom: 4px;
    }
  }
}
</style>
