<template>
  <div class="album-index">
    <h1>Albums</h1>
    <ul>
      <li v-for="album in albums" :key="album.id">
        <router-link :to="{ name: 'ImageGallery', params: { path: album.path }}">
          {{ album.title }}
        </router-link>
        <p>{{ album.description }}</p>
      </li>
    </ul>
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
      // Path to the JSON file in the public directory
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

<style>
/* Add styles for your album index page */
.album-index ul {
  list-style-type: none;
  padding: 0;
}
.album-index li {
  margin-bottom: 1rem;
}
</style>