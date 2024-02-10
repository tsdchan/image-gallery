<template>
  <div class="container py-4">
    <h1 class="mb-4">Albums</h1>
    <div class="row">
      <div class="col-md-4 mb-4" v-for="album in albums" :key="album.id">
        <router-link :to="{ name: 'ImageGallery', params: { path: album.path }}" class="text-decoration-none text-dark">
          <div class="card">
            <img :src="album.thumbnail" class="card-img-top" :alt="`Thumbnail for ${album.title}`">
            <div class="card-body">
              <h5 class="card-title">{{ album.title }}</h5>
              <p class="card-text">{{ album.description }}</p>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AlbumIndex',
  data() {
    return {
      albums: [],
    };
  },
  mounted() {
    this.fetchAlbums();
  },
  methods: {
    fetchAlbums() {
      axios.get('/albums.json')
        .then(response => {
          this.albums = response.data.albums;
        })
        .catch(error => {
          console.error("There was an error fetching the albums:", error);
        });
    }
  }
};
</script>

<style scoped>

</style>
