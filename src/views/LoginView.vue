<template>
  <div id="wrapper">
    <img src="/assets/logo.png" />
    <form>
      <label for="username">Username</label>
      <input id="username" type="text" autofocus>
      <input id="login" type="submit" v-on:click.prevent='login' value="Login">
    </form>
  </div>
</template>

<script>
export default {
  name: 'LoginView',
  methods: {
    login: function() { alert('test'); }
  }
}
</script>

<style lang="scss" scoped>
@import '/scss/variables.scss';

$width: 450px;

#wrapper {
  width: $width;
  margin: auto;
  text-align: center;
}

form {
  padding: $main-pd;
  width: $width;
  background: $lvl1-bg;
  border-radius: $main-br;
}
</style>
