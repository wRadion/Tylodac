<template>
  <div id="wrapper">
    <img src="/assets/logo.png" />
    <form @submit.prevent="login">
      <label for="username">Username</label>
      <input id="username"
             v-bind:class="{ error: this.hasError }"
             v-model.trim="username"
             type="text"
             autocomplete="off"
             autofocus>
      <input id="login"
             type="submit"
             value="Login"
             v-bind:disabled="!connected">
      <div v-if="this.hasError" class="error-message">{{ this.error }}</div>
    </form>
  </div>
</template>

<script>
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
      alert('Could not connect to the server. Please wait and refresh this page.');
    },
    server_check_username_response: function(isTaken) {
      if (isTaken) {
        this.error = 'This username is taken';
      }
    }
  },
  computed: {
    hasError: function() { return !!this.error; }
  },
  methods: {
    checkUsername: function() {
      if (this.username.length < 3) {
        this.error = 'Username must be at least 3 characters long';
      }
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
