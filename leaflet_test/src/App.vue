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
        <RouterLink to="/registerationUser">Registeration</RouterLink>
      </scale-telekom-nav-list>
    </scale-telekom-header>
  </header>

  <body class="body_content">
    <RouterView></RouterView>
  </body>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<style scoped>

</style>
