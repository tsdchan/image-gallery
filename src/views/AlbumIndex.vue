<template>
  <div class="container">
    <h1 class="mb-4">Albums</h1>
    <div v-if="loading" class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-6 col-md-4 col-lg-3 mb-2" v-for="album in albums" :key="album.id">
        <router-link :to="{ name: 'ImageGallery', params: { path: album.path }}" class="text-decoration-none text-dark" :aria-label="`Album: ${album.title}`">
          <div class="card">
          <div class="card-img-top square-image" :style="{ backgroundImage: 'url(' + album.thumbnail + ')' }"></div>
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
      loading: false,
    };
  },
  mounted() {
    this.fetchAlbums();
  },
  methods: {
    isAbsolutePath(url) {
      return /^(?:[a-z]+:)?\/\//i.test(url);
    },
    resolvePath(path) {
      const baseUrl = window.VUE_APP_BASE_URL || '/';
      return this.isAbsolutePath(path) ? path : `${baseUrl}${path}`;
    },
    fetchAlbums() {
      this.loading = true;
      const baseUrl = window.VUE_APP_BASE_URL || '/';
      axios.get(`${baseUrl}albums.json`)
        .then(response => {
          this.albums = response.data.albums.map(album => ({
            ...album,
            thumbnail: this.resolvePath(album.thumbnail),
            json: this.resolvePath(album.json)
          }));
          //this.albums = response.data.albums;
        })
        .catch(error => {
          console.error("There was an error fetching the albums:", error);
        })
        .finally(() => {
          this.loading = false; // Stop loading
        });
    }
  }
};
</script>

<style scoped>
.square-image {
  width: 100%;
  padding-top: 100%;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
}

.card-title, .card-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-text {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
