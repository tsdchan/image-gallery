import { createRouter, createWebHistory } from 'vue-router';
import AlbumIndex from '../views/AlbumIndex.vue';
import ImageGallery from '../views/ImageGallery.vue';

const routes = [
  {
    path: '/',
    name: 'AlbumIndex',
    component: AlbumIndex,
  },
  {
    path: '/album/:path',
    name: 'ImageGallery',
    component: ImageGallery,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
