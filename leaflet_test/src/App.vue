<template>
  <scale-telekom-header
    app-name="Bauarbeiter"
    meta-nav-aria-label="Meta navigation section"
    meta-nav-external-aria-label="External navigation section"
    lang-switcher-aria-label="Language switcher section"
    main-nav-aria-label="Main navigation section"
  >
    <scale-telekom-nav-list slot="main-nav" aria-label="Main Navigation Links">
      <scale-telekom-nav-item aria-label="Leaflet">
        <RouterLink to="/">Leaflet</RouterLink>
      </scale-telekom-nav-item>

      <scale-telekom-nav-item aria-label="Registeration">
        <RouterLink to="/registerationUser">Registeration</RouterLink>
      </scale-telekom-nav-item>

      <scale-telekom-nav-item aria-label="Leaflet">
        <RouterLink to="/loginUser">Login</RouterLink>
      </scale-telekom-nav-item>

      <scale-telekom-nav-item aria-label="Leaflet">
        <RouterLink to="/createProjects">Projekte anlegen</RouterLink>
      </scale-telekom-nav-item>
      <!-- … -->
    </scale-telekom-nav-list>
  </scale-telekom-header>

  <body class="body_content">
    <RouterView></RouterView>
  </body>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<style scoped></style>
