<template>
  <scale-telekom-header
    app-name="Baubegleitung"
    meta-nav-aria-label="Meta navigation section"
    meta-nav-external-aria-label="External navigation section"
    lang-switcher-aria-label="Language switcher section"
    main-nav-aria-label="Main navigation section"
  >
    <scale-telekom-nav-list slot="main-nav" aria-label="Main Navigation Links">
      <scale-telekom-nav-item
        aria-label="Registeration"
        :hidden="companyeditorShow || telekomeditorShow || superadminShow"
      >
        <RouterLink to="/">
          <scale-icon-home-home
            accessibility-title="registration"
            size="22"
            class="icon"
          />Registrierung</RouterLink
        >
      </scale-telekom-nav-item>

      <scale-telekom-nav-item
        aria-label="Login"
        :hidden="companyeditorShow || telekomeditorShow || superadminShow"
      >
        <RouterLink to="/loginUser"
          ><scale-icon-user-file-bussines-users
            size="22"
            class="icon"
            accessibility-title="login"
          />Anmelden</RouterLink
        >
      </scale-telekom-nav-item>

      <scale-telekom-nav-item aria-label="leafletMap" :hidden="!companyeditorShow">
        <RouterLink to="/leafletMap">Landkarte</RouterLink>
      </scale-telekom-nav-item>

      <scale-telekom-nav-item aria-label="CreateProject" :hidden="!superadminShow">
        <RouterLink to="/createProjects">Projekt anlegen</RouterLink>
      </scale-telekom-nav-item>

      <scale-telekom-nav-item aria-label="getProjects" :hidden="!telekomeditorShow">
        <RouterLink to="/getProjects"
        >Projekte</RouterLink>
      </scale-telekom-nav-item>

      <scale-telekom-nav-item aria-label="notification" :hidden="!telekomeditorShow">
        <RouterLink to="/notificationEditor">Benachrichtigungen</RouterLink>
      </scale-telekom-nav-item>

     <div class="loggout-container" :style="{visibility: loggout ? 'visible' : 'hidden'}" @click="openLoggoutCard">
      <div class="loggout-header" >
        <scale-icon-user-file-bussines-users
            size="22"
            class="icon"
            accessibility-title="login"
          />
          <p>Abmelden</p>
      </div>
          <scale-card :style="{visibility: loggoutCard ? 'visible' : 'hidden'}">
            <h1 style="font-weight: bold; margin-bottom: 2px;">
              Abmelden
            </h1>
            <p>Wollen Sie sich auslogen</p>
            <scale-button style="margin: 20px 0 0 26px;" @click="logout" >Abmelden</scale-button>
          </scale-card>
     </div>
    </scale-telekom-nav-list>
  </scale-telekom-header>

  <body>
    <RouterView @loginNumber="userType($event)" @registerNumber="userType($event)"></RouterView>
  </body>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'

const registNum = ref<number>()
const superadminShow = ref<boolean>(false)
const companyeditorShow = ref<boolean>(false)
const telekomeditorShow = ref<boolean>(false)
const loggout = ref<boolean>(false)
const loggoutCard = ref<boolean>(false)

const router = useRouter()

function userType(value: number, data?: any) {
  registNum.value = value
  loggout.value = true

  if (value === 0) {
    console.log('superadmin', value)
    superadminShow.value = true
    router.push('/createProjects').catch((err) => console.error(err))
  } else if (value === 1) {
    console.log('company editor', value)
    companyeditorShow.value = true
    router.push('/leafletMap').catch((err) => console.error(err))
  } else if (value === 2) {
    console.log('telekom editor', value)
    telekomeditorShow.value = true
    router.push('/getProjects').catch((err) => console.error(err))
  }
}

const route = useRoute()
watch(
  () => route.path,
  (newPath) => {
    const noScrollRoutes = ['/', '/loginUser'] // die Seiten die nicht scrollen sollen
    if (noScrollRoutes.includes(newPath)) {
      document.body.classList.add('no-scroll')
    } else {
      document.body.classList.remove('no-scroll')
    }
  },
  { immediate: true }, // Direkt beim Laden ausführen
)

function openLoggoutCard() {
  loggoutCard.value = !loggoutCard.value
}

function logout() {
  loggout.value = false;
  superadminShow.value = false;
  companyeditorShow.value = false;
  telekomeditorShow.value = false;
  
  router.push('/').catch((err) => console.error(err)); // Zur Startseite navigieren
}
</script>

<style scoped>
.loggout-header {
  display: flex;
  flex-direction: row;
  cursor: pointer;
}
.inlineItems {
  display: inline-flex;
}
.icon {
  margin-right: 7px;
}
.hidden {
  display: block;
}

.show {
  visibility: visible;
}

.no-scroll {
  overflow: hidden;
  height: 100%; /* Verhindert auch das Scrollen auf mobilen Geräten */
}

.loggout-container {
  position: absolute;
  right: 0;
  top: auto;
}
</style>