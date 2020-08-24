<template>
  <div>
    <HeaderComponent v-bind:username="username"
                     v-if="this.$router.currentRoute.name !== 'login'">
    </HeaderComponent>
    <router-view></router-view>
  </div>
</template>

<script>
import HeaderComponent from './components/HeaderComponent';

export default {
  components: { HeaderComponent },
  name: 'App',
  data: function() {
    return {
      username: null
    };
  },
  sockets: {
    server_connect: function(username) {
      this.username = username;
    }
  }
};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&display=swap');

* {
  box-sizing: border-box;
  font-family: 'DM Mono', monospace;
  font-size: 18px;
  color: #999999;
}

html, body {
  margin: 0;
  padding: 0;
}

body {
  width: 100%;
  height: 100%;
  background: #222222;
}

label {
  color: #AAAAAA;
}

input {
  padding: 8px;
  border: 1px solid transparent;
  border-radius: 4px;
  outline: none;
}

input:focus {
  border: 1px solid #FFFFFFAA;
}

input[type=text] {
  color: #999999;
  background: #111111;
}

button, input[type=submit] {
  color: #AAAAAA;
  background: #555555;
}

button:not([disabled]):hover, input[type=submit]:not([disabled]):hover {
  color: #CCCCCC;
  background: #666666;
}

button[disabled], input[disabled] {
  opacity: 50%;
  cursor: not-allowed;
}

input.error, button.error {
  border: 1px solid #FF2222;
}

.error-message {
  margin-top: 12px;
  color: #FF2222;
  font-size: 14px;
}
</style>
