<template>
  <div id="wrapper">
    <img src="/assets/logo.png" />
    <form>
      <label for="username">Username</label>
      <input id="username"
             v-model.trim="username"
             v-bind:class="{ error: this.hasError }"
             type="text"
             autocomplete="off"
             autofocus>
      <input id="login"
             @click.prevent="login"
             v-bind:disabled="!connected"
             v-bind:title="connected ? null : 'Could not connect to the server'"
             type="submit"
             value="Login">
      <div v-if="this.hasError" class="error-message">{{ this.error }}</div>
    </form>
  </div>
</template>

<script>
import Session from '/modules/session';

export default {
  name: 'LoginView',
  data: function() {
    return {
      username: '',
      error: null,
      connected: false
    }
  },
  created: function() {
    if (Session.isLogged()) this.$router.push({ name: 'home' });
  },
  watch: {
    username: function(_, __) {
      this.validateUsername();
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
    }
  },
  computed: {
    hasError: function() { return !!this.error; }
  },
  methods: {
    validateUsername: function() {
      this.error = null;
      if (this.username.length >= 3 && this.username.length <= 16) return;
      this.error = 'Username must be between 3 and 16 characters long';
    },
    login: function() {
      if (this.hasError) return;
      this.$socket.emit('client_login', this.username, (sessionId) => {
        Session.create(sessionId);
        this.$router.push({ name: 'home' });
      });
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
