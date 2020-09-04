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
      this.$socket.emit('client_multi_rooms_create', params, (roomId) => {
        this.$router.push({ name: 'multi-room', params: { id: roomId }});
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
