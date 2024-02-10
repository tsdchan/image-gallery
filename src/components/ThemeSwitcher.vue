<!-- src/components/ThemeSwitcher.vue -->

<template>
  <div class="theme-switcher">
    <span>Dark Mode:</span>
    <label class="switch">
        <input type="checkbox" :checked="isDarkMode" @change="toggleTheme" aria-label="Toggle dark mode">
        <span class="slider round"></span>
    </label>
  </div>
</template>

<script>
export default {
  name: 'ThemeSwitcher',
  data() {
    return {
      isDarkMode: false, // Initial state of the theme
    };
  },
  methods: {
    toggleTheme() {
      this.isDarkMode = !this.isDarkMode; // Toggle the state
      document.body.classList.toggle('dark-mode', this.isDarkMode);
      // Save the theme preference to localStorage
      localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    }
  },
  mounted() {
    if (localStorage.getItem('theme')){
        // Apply the saved theme preference on load and set checkbox state
        this.isDarkMode = localStorage.getItem('theme') === 'dark';
    } else {
        // Apply default browser darkmode
        this.isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
    }
  }
};
</script>

<style scope>
.theme-switcher {
  display: flex;
  align-items: center; /* Vertically center align items */
  justify-content: flex-end; /* Align items to the right */
  gap: 10px; /* Spacing between the text and the switch */
  padding: 10px; /* Padding around the switcher for better touch targets on mobile */
}

/* The switch - the box around the slider */
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
  margin: 0;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: #03bd00;
}

input:focus + .slider {
  box-shadow: 0 0 1px #03bd00;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
