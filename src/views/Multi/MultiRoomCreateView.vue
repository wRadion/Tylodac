<template>
  <SettingsComponent :multi="true" @submit="onSubmit" style="width:500px"></SettingsComponent>
</template>

<script>
import SettingsComponent from '/components/SettingsComponent';

export default {
  components: {
    SettingsComponent
  },
  name: 'MultiRoomCreateView',
  methods: {
    onSubmit: function(params) {
      this.$socket.emit('client_multi_rooms_create', params);
      this.$router.push({ name: 'multi-room' });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
