<template>
  <div id="app">
    <vheader></vheader>
    <router-view />
    <vue-progress-bar></vue-progress-bar>
    <!-- <aplayer :autoplay='true' :listFolded='true' :mini='true'
      :music="{
        title: 'The Saltwater Room',
        artist: 'Owi City',
        src: 'https://onedrive.gimhoy.com/sharepoint/aHR0cHM6Ly9tYWlsMnN5c3VlZHVjbi1teS5zaGFyZXBvaW50LmNvbS86dTovZy9wZXJzb25hbC9jaGVueWQzNV9tYWlsMl9zeXN1X2VkdV9jbi9FZERLQy1WN0luaEpuMHR3Y3ZiR3BJWUJfWjQ3UXh5QUxkYWY3d2stTW1OdTRnP2U9bGZDSWNv.mp3',
        pic: ''
      }"
      :list="[{
        title: 'The Saltwater Room',
        artist: 'Owi City',
        src: 'https://onedrive.gimhoy.com/sharepoint/aHR0cHM6Ly9tYWlsMnN5c3VlZHVjbi1teS5zaGFyZXBvaW50LmNvbS86dTovZy9wZXJzb25hbC9jaGVueWQzNV9tYWlsMl9zeXN1X2VkdV9jbi9FZERLQy1WN0luaEpuMHR3Y3ZiR3BJWUJfWjQ3UXh5QUxkYWY3d2stTW1OdTRnP2U9bGZDSWNv.mp3',
        pic: ''
      }]
      "
      style="position:absolute;bottom:0;z-index:9999"
    /> -->
    <!-- <APlayer id="aplayer" :audio='audio' :lrcType='3' fixed :listMaxHeight=90 style="z-index:9999" ></APlayer> -->

    <meting-js
    server="netease"
    type="playlist"
    id="5405842180"
    fixed="true"
    autoplay="true"
    order="random"
    >
    </meting-js>
  </div>
</template>

<script>
import vheader from '@/components/Header';
// import APlayer from '@moefe/vue-aplayer';

export default {
  name: 'App',
  data() {
    return {
      audio: [{
        name: 'The Saltwater Room',
        artist: 'Owi City',
        url: 'https://onedrive.gimhoy.com/sharepoint/aHR0cHM6Ly9tYWlsMnN5c3VlZHVjbi1teS5zaGFyZXBvaW50LmNvbS86dTovZy9wZXJzb25hbC9jaGVueWQzNV9tYWlsMl9zeXN1X2VkdV9jbi9FZERLQy1WN0luaEpuMHR3Y3ZiR3BJWUJfWjQ3UXh5QUxkYWY3d2stTW1OdTRnP2U9bGZDSWNv.mp3',
      },
      ],
    };
  },
  components: {
    vheader,
    // APlayer,
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

.aplayer.aplayer-fixed{
  z-index:99999 !important;
}

</style>
