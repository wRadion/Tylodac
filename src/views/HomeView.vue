<template>
  <div>
    <div class="wrapper">
      <router-link :to="{ name: 'solo-settings' }">
        <img src="/assets/images/singleplayer.png" class="soloplayer" />
        <div>Soloplayer</div>
      </router-link>
      <router-link :to="{ name: 'multi-rooms' }">
        <img src="/assets/images/multiplayer.png" class="multiplayer" />
        <div>Multiplayer</div>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeView'
};
</script>

<style lang="scss" scoped>
@import 'animate.css';
@import '/scss/fork-awesome.min.scss';

.wrapper {
  width: 30%;
  min-height: 280px;
  margin: auto;
  margin-top: 280px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-content: space-around;
}

a {
  position: relative;
  top: 0;
  left: 0;
  width: 280px;
  height: 128px;
  display: inline-block;
  background: #303030;
  border-radius: 4px;
  text-decoration: none;
  text-align: center;
  transform: scale(1);
  box-shadow: 0px 0px 8px #00000044;
  transition: transform 0.1s ease;

  img, div {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  img {
    opacity: 12%;
  }

  div {
    line-height: 128px;
    font-size: 24px;
    font-weight: 500;
    color: #CCCCCC;
    text-shadow: 3px 3px #00000066;
  }
}

a:hover {
  color: #DDDDDD;
  background: #363636;
  transform: scale(1.075);
}
</style>
