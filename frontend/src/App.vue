<template>
  <div id="app">
    <vheader></vheader>
    <router-view />
    <vue-progress-bar></vue-progress-bar>
  </div>
</template>

<script>
import vheader from '@/components/Header';

export default {
  name: 'App',
  components: {
    vheader,
  },
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
  height: 100%;
  width: 100%;
}

</style>
