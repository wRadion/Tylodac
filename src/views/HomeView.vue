<template>
  <div>
    <TypingTestComponent style="width: 1200px" />
  </div>
</template>

<script>
import TypingTestComponent from '/components/TypingTestComponent';

export default {
  components: {
    TypingTestComponent
  },
  name: 'HomeView'
};
</script>

<style lang="scss" scoped>
div {
  margin-top: 10%;
}
</style>
