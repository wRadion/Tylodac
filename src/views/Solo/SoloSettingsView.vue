<template>
  <SettingsComponent :multi="false" @submit="onSubmit" style="width: 360px"></SettingsComponent>
</template>

<script>
import SettingsComponent from '/components/SettingsComponent';

export default {
  components: {
    SettingsComponent
  },
  name: 'SoloSettingsView',
  methods: {
    onSubmit: function(params) {
      this.$router.push({ name: 'solo-game', query: params });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
