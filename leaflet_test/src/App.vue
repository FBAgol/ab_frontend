<template>
  <scale-telekom-header app-name="Bauarbeiter" meta-nav-aria-label="Meta navigation section"
    meta-nav-external-aria-label="External navigation section" lang-switcher-aria-label="Language switcher section"
    main-nav-aria-label="Main navigation section">
    <scale-telekom-nav-list slot="main-nav" aria-label="Main Navigation Links">
      <scale-telekom-nav-item aria-label="Registeration" :hidden="companyeditorShow || telekomeditorShow || superadminShow">
        <scale-icon-home-home accessibility-title="home"/>
        <RouterLink to="/" >Registeration</RouterLink>
      </scale-telekom-nav-item>

      <scale-telekom-nav-item aria-label="Login" :hidden="companyeditorShow || telekomeditorShow || superadminShow">
        <scale-icon-user-file-bussines-users accessibility-title="bussines-users"/>
        <RouterLink to="/loginUser" >Login</RouterLink>
      </scale-telekom-nav-item>

      <scale-telekom-nav-item aria-label="leafletMap" :hidden="!companyeditorShow">
        <RouterLink to="/leafletMap">Leaflet</RouterLink>
      </scale-telekom-nav-item>

      <scale-telekom-nav-item aria-label="CreateProject" :hidden="!superadminShow">
        <RouterLink to="/createProjects">Projekte anlegen</RouterLink>
      </scale-telekom-nav-item>

      <scale-telekom-nav-item aria-label="getProjects" :hidden="!telekomeditorShow">
        <RouterLink to="/getProjects">Projekte</RouterLink>
      </scale-telekom-nav-item>
      <!-- … -->
    </scale-telekom-nav-list>
  </scale-telekom-header>

  <body class="body_content">
    <RouterView @loginNumber="userType($event)" @registerNumber="userType($event)"></RouterView>
  </body>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink,useRouter } from 'vue-router'
const registNum = ref<number>()
const superadminShow = ref<boolean>(false)
const companyeditorShow = ref<boolean>(false)
const telekomeditorShow = ref<boolean>(false)

// Zugriff auf den Router
const router = useRouter()
function userType(value: number) {
  registNum.value = value
  if (value === 0) {
    console.log("superadmin", value)
    superadminShow.value = true
    router.push('/createProjects').catch(err => console.error(err)) // Fängt mögliche Fehler ab
  } else if (value === 1) {
    console.log("company editor", value)
    companyeditorShow.value = true
    router.push('/leafletMap').catch(err => console.error(err)) // Fängt mögliche Fehler ab
  } else if (value === 2) {
    console.log("telekom editor", value)
    telekomeditorShow.value = true
    router.push('/getProjects').catch(err => console.error(err)) // Fängt mögliche Fehler ab
  }
}


</script>

<style scoped>
.hidden {
  display: none;
}

.show {
  visibility: visible;
}
</style>
