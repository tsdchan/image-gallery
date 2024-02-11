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
      <div v-for="(image, index) in images" :key="image.id"
          class="col-6 col-sm-4 col-md-3 col-lg-2 mb-4" @click="openLightbox(index)">
        <div class="card h-100">
          <div class="square-image" :style="{ backgroundImage: 'url(' + image.src + ')' }"></div>
        </div>
      </div>
    </div>

    <!-- Lightbox Modal -->
    <div v-if="lightbox.visible" class="lightbox-modal" @click.self="closeLightbox" 
        @touchstart="handleTouchStart" 
        @touchmove="handleTouchMove" 
        @touchend="handleTouchEnd">
      <button class="lightbox-close" @click.stop="closeLightbox">X</button>
      <!-- Image Preview -->
      <img :src="`${images[lightbox.currentIndex].src}`" class="lightbox-image" :alt="images[lightbox.currentIndex].title">

      <!-- Image Title and Description -->
      <div class="lightbox-info">
        <h3 class="lightbox-title">{{ images[lightbox.currentIndex].title }}</h3>
        <p class="lightbox-description">{{ images[lightbox.currentIndex].description }}</p>
      </div>

      <!-- Navigation Buttons -->
      <button class="nav-btn left" @click.stop.prevent="navigate('prev')">&lt;</button>
      <button class="nav-btn right" @click.stop.prevent="navigate('next')">&gt;</button>

      <!-- Thumbnail List -->
      <div class="thumbnail-container" ref="thumbnailContainer">
        <img v-for="(image, index) in images" :key="image.id"
             :src="`${image.src}`"
             class="thumbnail"
             :class="{ active: index === lightbox.currentIndex }"
             @click.stop.prevent="setImage(index)"
             :ref="`thumb-${index}`">
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
        touchStartX: 0,
        touchStartY: 0,
        touchEndX: 0,
        touchEndY: 0,
      },
    };
  },
  async mounted() {
    this.currentAlbumFolder = this.path;
    await this.fetchAlbumInfo();
    await this.fetchImages();
    document.addEventListener('keydown', this.handleKeydown);
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.handleKeydown);
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
      this.$nextTick(() => {
        this.ensureThumbnailVisible(this.lightbox.currentIndex);
      });
    },
    setImage(index) {
      this.lightbox.currentIndex = index;
      this.ensureThumbnailVisible(index);
    },
    handleKeydown(e) {
      if (!this.lightbox.visible) return;
      if (e.key === 'ArrowRight') {
        this.navigate('next');
      } else if (e.key === 'ArrowLeft') {
        this.navigate('prev');
      } else if (e.key === 'Escape') {
        this.closeLightbox();
      }
    },
    ensureThumbnailVisible(index) {
      const container = this.$refs.thumbnailContainer;
      const activeThumb = this.$refs[`thumb-${index}`][0];
      if (container && activeThumb) {
        const containerRect = container.getBoundingClientRect();
        console.log(containerRect);
        const thumbRect = activeThumb.getBoundingClientRect();
        if (thumbRect.left < containerRect.left || thumbRect.right > containerRect.right) {
          container.scrollLeft += thumbRect.left - containerRect.left - (containerRect.width / 2) + (thumbRect.width / 2);
        }
      }
    },
    handleTouchStart(event) {
      this.lightbox.touchStartX = event.touches[0].clientX;
      this.lightbox.touchStartY = event.touches[0].clientY;
      this.lightbox.touchEndX = null; // Reset end coordinates
      this.lightbox.touchEndY = null;
    },
    handleTouchMove(event) {
      // Prevent scrolling while swiping
      event.preventDefault();
      this.lightbox.touchEndX = event.touches[0].clientX;
      this.lightbox.touchEndY = event.touches[0].clientY;
    },
    handleTouchEnd() {
      if (!this.lightbox.touchEndX || !this.lightbox.touchEndY) return; // Ensure touch move happened
      const deltaX = this.lightbox.touchEndX - this.lightbox.touchStartX;
      const deltaY = this.lightbox.touchEndY - this.lightbox.touchStartY;
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      // Determine if swipe is more horizontal than vertical and exceeds a threshold
      if (absDeltaX > absDeltaY && absDeltaX > 50) {
        // Swipe is horizontal
        if (deltaX > 0) {
          this.navigate('prev'); // Swipe right to left
        } else {
          this.navigate('next'); // Swipe left to right
        }
      }
    }
  },
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
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.lightbox-image {
  max-width: 80%;
  max-height: 64%;
}

.lightbox-close {
  position: absolute;
  top: 16px;
  right: 16px;
  border: none;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 24px;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-stretch: expanded;
}

.lightbox-info {
  color: #fff;
  text-align: center; /* Center-align the text for aesthetics */
  padding: 4px; /* Add some padding around the text for readability */
  width: 80%;
}

.lightbox-title {
  margin-top: 0px;
  font-size: 12px;
  font-weight: bold;
}

.lightbox-description {
  margin-top: 2px;
  font-size: 12px;
  max-width: 80%;
  margin-left: auto;
  margin-right: auto;
}

.nav-btn {
  position: absolute;
  top: 40%;
  transform: translateY(-50%);
  background-color: #fff;
  border: none;
  cursor: pointer;
  font-size: 24px;
  width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  color: #000;
}

.left { left: 10px; }
.right { right: 10px; }

.thumbnail-container {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  max-width: 100%;
}

.thumbnail {
  width: 14vw;
  height: 14vw;
  max-height: 100px;
  margin: 0 5px;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.thumbnail:hover {
  opacity: 1;
}

.thumbnail.active {
  opacity: 1;
  outline: 2px solid #2196F3;
  outline-offset: -2px;
}

.square-image {
  width: 100%; /* Ensure the container spans the full width of its parent */
  padding-top: 100%; /* This creates a square aspect ratio */
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
}

@media (max-width: 1023px) and (orientation: landscape) {
  .thumbnail {
    max-height: 36px;
    max-width: 36px;
  }
  .lightbox-image {
    max-width: 80vw;
    max-height: 60vh;
  }
}
</style>