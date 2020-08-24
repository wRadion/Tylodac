<style lang="scss">
@import '/scss/app.scss';
</style>

<script>
import Session from '/modules/session';

export default {
  name: 'App',
  sockets: {
    connect: function() {
      if (Session.isLogged()) Session.connect(this.$socket);
    }
  }
};
</script>

<template>
  <div>
    <router-view></router-view>
  </div>
</template>
