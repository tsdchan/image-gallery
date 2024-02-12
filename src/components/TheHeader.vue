<!-- src/components/TheHeader.vue -->
<template>
  <header class="container">
    <nav>
      <!-- Navigation items -->
    </nav>
    <ThemeSwitcher />
  </header>
</template>

<script>
import ThemeSwitcher from './ThemeSwitcher.vue';

export default {
  components: {
    ThemeSwitcher
  }
};
</script>
