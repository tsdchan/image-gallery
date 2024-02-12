<template>
  <div id="app">
    <TheHeader />
    <router-view></router-view>
  </div>
</template>

<script>
import TheHeader from './components/TheHeader.vue';

export default {
  components: {
    TheHeader
  }
};
</script>

<style scoped>
#app {
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
}

@media (max-width: 1600px) {
  #app {
    padding: 0 10px;
  }
}
</style>