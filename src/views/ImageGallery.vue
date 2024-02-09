<template>
    <div>
        <!-- Breadcrumb Navigation -->
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item">
                    <router-link to="/">Album List</router-link>
                </li>
                <li class="breadcrumb-item active" aria-current="page">{{ albumTitle }}</li>
            </ol>
        </nav>

        <!-- Image Gallery Grid -->
        <div class="gallery">
            <div v-for="image in images" :key="image.id" class="gallery-item">
            <img :src="`/${currentAlbumFolder}/${image.src}`" :alt="image.title">
            <h3>{{ image.title }}</h3>
            <p>{{ image.description }}</p>
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
        } else {
          console.error("Album not found.");
        }
      } catch (error) {
        console.error("There was an error fetching the albums:", error);
      }
    },
    async fetchImages() {
      try {
        const response = await axios.get(`/${this.currentAlbumFolder}/images.json`);
        this.images = response.data.images;
      } catch (error) {
        console.error("There was an error fetching the images:", error);
      }
    }
  }
};
</script>


<style scoped>
.breadcrumb {
  padding: 1rem 0;
  background: none;
  margin-bottom: 2rem;
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