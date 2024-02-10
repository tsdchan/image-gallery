<template>
  <div class="container mt-2">
    <!-- Breadcrumb Navigation -->
    <nav aria-label="breadcrumb" class="breadcrumb-container">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <router-link to="/">Album List</router-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">{{ albumTitle }}</li>
      </ol>
    </nav>

    <div class="description mb-4">{{albumDescription}}</div>

    <!-- Image Gallery Grid -->
    <div class="row">
      <div v-for="image in images" :key="image.id" class="col-sm-6 col-md-4 col-lg-3 mb-4">
        <div class="card h-100">
          <img :src="`/${currentAlbumFolder}/${image.src}`" class="card-img-top" :alt="image.title">
          <div class="card-body">
            <h5 class="card-title">{{ image.title }}</h5>
            <p class="card-text">{{ image.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: ['path'],
  data() {
    return {
      images: [],
      currentAlbumFolder: '',
      albumTitle: '',
      albumDescription: '',
      albumJson: '',
    };
  },
  async mounted() {
    this.currentAlbumFolder = this.path;
    await this.fetchAlbumInfo();
    await this.fetchImages();
  },
  methods: {
    async fetchAlbumInfo() {
      try {
        // Fetch the list of albums to get the current album's details
        const albumsResponse = await axios.get('/albums.json');
        const currentAlbum = albumsResponse.data.albums.find(album => album.path === this.path);
        console.log(currentAlbum);
        if (currentAlbum) {
          //this.currentAlbumFolder = currentAlbum.path;
          this.albumTitle = currentAlbum.title;
          this.albumDescription = currentAlbum.description;
          this.albumJson = currentAlbum.json;
        } else {
          console.error("Album not found.");
        }
      } catch (error) {
        console.error("There was an error fetching the albums:", error);
      }
    },
    async fetchImages() {
      try {
        const response = await axios.get(`${this.albumJson}`);
        this.images = response.data.images;
      } catch (error) {
        console.error("There was an error fetching the images:", error);
      }
    }
  }
};
</script>

<style scoped>
.description {
  font-weight: 300;
}

.breadcrumb-container .breadcrumb {
  background-color: #d8d8d8;
  border-radius: 10px;
  padding: .75rem 1rem;
}

.breadcrumb-container .breadcrumb-item + .breadcrumb-item::before {
  color: #333333;
}

.breadcrumb {
  padding: 1rem 0;
  background: none;
  margin-bottom: 1rem;
}

.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.gallery-item {
  display: flex;
  flex-direction: column;
}

.gallery-item img {
  width: 100%;
  height: auto;
  margin-bottom: 0.5rem;
  border-radius: 0.25rem;
}

.image-info {
  text-align: center;
}
</style>