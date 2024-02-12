<!-- src/components/ThemeSwitcher.vue -->
<template>
  <div class="theme-switcher d-flex align-items-center justify-content-end gap-2 px-2">
    <div class="text-center" id="fullscreenToggle">
      <label class="switch mb-0">
        <input type="checkbox" :checked="isFullscreen" @change="toggleFullScreen" aria-label="Toggle fullscreen mode">
        <span class="slider round"></span>
      </label>
      <div class="label-text mt-1" style="font-size: 0.75rem;">Fullscreen</div>
    </div>
    <div class="text-center">
      <label class="switch mb-0">
        <input type="checkbox" :checked="isDarkMode" @change="toggleTheme" aria-label="Toggle dark mode">
        <span class="slider round"></span>
      </label>
      <div class="label-text mt-1" style="font-size: 0.75rem;">Dark Mode</div>
    </div>
  </div>
</template>


<script>
export default {
  name: 'ThemeSwitcher',
  data() {
    return {
      isDarkMode: false, // Initial state of the theme
      isFullscreen: false,
    };
  },
  methods: {
    toggleTheme() {
      this.isDarkMode = !this.isDarkMode; // Toggle the state
      document.body.classList.toggle('dark-mode', this.isDarkMode);
      // Save the theme preference to localStorage
      localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    },
    toggleFullScreen() {
        if (!document.fullscreenElement) {
            this.requestFullScreen(document.documentElement);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
        this.isFullscreen = !document.fullscreenElement;
    },
    requestFullScreen(element) {
        if (element.requestFullscreen) {
        element.requestFullscreen();
        } else if (element.mozRequestFullScreen) { /* Firefox */
        element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
        element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) { /* IE/Edge */
        element.msRequestFullscreen();
        }
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
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  padding: 10px;
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

/* Hide fullscreen toggle on mobile */
@media (max-width: 769px) {
  #fullscreenToggle {
    display: none;
  }
}
</style>
