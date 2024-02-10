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
      <div v-for="(image, index) in images" :key="image.id" class="col-sm-6 col-md-4 col-lg-3 mb-4" @click="openLightbox(index)">
        <div class="card h-100">
          <div class="square-image" :style="{ backgroundImage: 'url(' + image.src + ')' }"></div>
          <div class="card-body">
            <h5 class="card-title">{{ image.title }}</h5>
            <p class="card-text">{{ image.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Lightbox Modal -->
    <div v-if="lightbox.visible" class="lightbox-modal" @click.self="closeLightbox">
      <img :src="`${images[lightbox.currentIndex].src}`" class="lightbox-image" :alt="images[lightbox.currentIndex].title">
      <button class="nav-btn left" @click.stop.prevent="navigate('prev')">&lt;</button>
      <button class="nav-btn right" @click.stop.prevent="navigate('next')">&gt;</button>
      
      <div class="thumbnail-container">
        <img v-for="(image, index) in images" :key="image.id"
             :src="`${image.src}`"
             class="thumbnail"
             @click.stop.prevent="setImage(index)">
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
      lightbox: {
        visible: false,
        currentIndex: 0,
        currentImage: {},
      },
    };
  },
  async mounted() {
    this.currentAlbumFolder = this.path;
    await this.fetchAlbumInfo();
    await this.fetchImages();
  },
  methods: {
    isAbsolutePath(url) {
      return /^(?:[a-z]+:)?\/\//i.test(url);
    },
    resolvePath(path) {
      return this.isAbsolutePath(path) ? path : `${process.env.VUE_APP_BASE_URL}${path}`;
    },
    async fetchAlbumInfo() {
      try {
        const albumsResponse = await axios.get(`${process.env.VUE_APP_BASE_URL}albums.json`); // Use baseURL
        const currentAlbum = albumsResponse.data.albums.find(album => album.path === this.path);
        if (currentAlbum) {
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
        const response = await axios.get(this.resolvePath(this.albumJson));
        this.images = response.data.images.map(image => ({
          ...image,
          src: this.resolvePath(image.src),
        }));
      } catch (error) {
        console.error("There was an error fetching the images:", error);
      }
    },
    openLightbox(index) {
      this.lightbox.currentIndex = index;
      this.lightbox.visible = true;
    },
    closeLightbox() {
      this.lightbox.visible = false;
    },
    navigate(direction) {
      const imagesCount = this.images.length;
      if (direction === 'next') {
        this.lightbox.currentIndex = (this.lightbox.currentIndex + 1) % imagesCount;
      } else if (direction === 'prev') {
        this.lightbox.currentIndex = (this.lightbox.currentIndex + imagesCount - 1) % imagesCount;
      }
    },
    setImage(index) {
      this.lightbox.currentIndex = index;
    },
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

.lightbox-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050; /* Ensure it's above other content */
}

.lightbox-image {
  max-width: 80%;
  max-height: 80%;
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: #fff;
  border: none;
  cursor: pointer;
}

.left { left: 10px; }
.right { right: 10px; }

.thumbnail-container {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
}

.thumbnail {
  width: 50px;
  margin: 0 5px;
  cursor: pointer;
  opacity: 0.7;
}

.thumbnail:hover {
  opacity: 1;
}

.square-image {
  width: 100%; /* Ensure the container spans the full width of its parent */
  padding-top: 100%; /* This creates a square aspect ratio */
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
}
</style>