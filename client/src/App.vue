<template>
  <div id="app" class="sidebar-o enable-page-overlay side-scroll page-header-fixed main-content-narrow side-trans-enabled">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {
  }
}
</script>

<style lang="scss">
// Main Stylesheet
@import './src/assets/scss/main';

// Bootstrap Vue Stylesheet
@import '~bootstrap-vue/src/index';

// All color themes are included and available by default
// Feel free to comment out any of them if you won't use them in your main
@import './src/assets/scss/oneui/themes/amethyst';
@import './src/assets/scss/oneui/themes/city';
@import './src/assets/scss/oneui/themes/flat';
@import './src/assets/scss/oneui/themes/modern';
@import './src/assets/scss/oneui/themes/smooth';

</style>
