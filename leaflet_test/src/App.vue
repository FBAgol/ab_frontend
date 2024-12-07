<template>
  <header>
    <scale-telekom-header
      app-name="Bauarbeiter"
      app-name-link="https://example.com"
      meta-nav-aria-label="Meta navigation section"
      meta-nav-external-aria-label="External navigation section"
      lang-switcher-aria-label="Language switcher section"
      main-nav-aria-label="Main navigation section"
    >
      <scale-telekom-nav-list slot="main-nav" aria-label="Main Navigation Links">
        <RouterLink to="/">Leaflet</RouterLink>
      </scale-telekom-nav-list>
    </scale-telekom-header>
  </header>

  <div class="side_content">
    <div style="width: 25%">
      <sidebar></sidebar>
    </div>
    <div style="width: 75%">
      <RouterView></RouterView>
    </div>
  </div>
</template>

<script setup lang="ts">
import sidebar from './components/SideBar.vue'
</script>

<style scoped>
.side_content {
  display: flex;
  flex-direction: row;
}
</style>
