<template>
  <div>
    <h1>404 Not Found</h1>
    <router-link v-bind:to="{ name: 'home' }">Return to index</router-link>
  </div>
</template>

<script>
export default {
  name: 'NotFound'
}
</script>

<style lang="scss" scoped>
div {
  display: block;
  width: 100%;
  text-align: center;
  margin-top: 22.5%;
}
</style>
