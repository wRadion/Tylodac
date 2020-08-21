<template>
  <div id="wrapper">
    <img src="/assets/logo.png" />
    <form @submit.prevent="login">
      <label for="username">Username</label>
      <input id="username"
             v-model.trim="username"
             v-bind:class="{ error: this.hasError }"
             type="text"
             autocomplete="off"
             autofocus>
      <input id="login"
             v-bind:disabled="!connected"
             v-bind:title="connected ? null : 'Could not connect to the server'"
             type="submit"
             value="Login">
      <div v-if="this.hasError" class="error-message">{{ this.error }}</div>
    </form>
  </div>
</template>

<script>
import Cookies from 'js-cookie';

export default {
  name: 'LoginView',
  data: function() {
    return {
      username: '',
      error: null,
      connected: false
    }
  },
  watch: {
    username: function(newValue, oldValue) {
      this.error = null;
      this.checkUsername();
    }
  },
  sockets: {
    connect: function() {
      this.connected = true;
    },
    connect_error: function(error) {
      this.connected = false;
      alert('Could not connect to the server. Please wait or refresh this page.');
    },
    disconnect: function(reason) {
      this.connected = false;
      alert('The server disconnected: ' + reason);
    },
    server_check_username_response: function(isTaken) {
      if (!isTaken) return;
      this.error = 'This username is taken';
    },
    server_login_response: function(loggedIn) {
      console.log(loggedIn);
      if (!loggedIn) return;
      Cookies.set('username', this.username);
      alert('Login successful. Welcome, ' + Cookies.get('username') + '!');
    }
  },
  computed: {
    hasError: function() { return !!this.error; }
  },
  methods: {
    checkUsername: function() {
      if (this.username.length >= 3) return;
      this.error = 'Username must be at least 3 characters long';
    },
    validateUsername: function() {
      this.checkUsername();
      this.$socket.emit('client_check_username', this.username);
    },
    login: function() {
      this.validateUsername();
      if (this.hasError) return;
      this.$socket.emit('client_login', this.username);
    }
  }
}
</script>

<style lang="scss" scoped>
@import '/scss/variables.scss';

$width: 460px;

#wrapper {
  width: $width;
  margin: auto;
  margin-top: 200px;
  text-align: center;
}

form {
  padding: $main-pd;
  width: $width;
  background: $lvl1-bg;
  border-radius: $main-br;
}
</style>
