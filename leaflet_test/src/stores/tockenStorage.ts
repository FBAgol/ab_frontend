import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

export const tokenStore = defineStore('store', () => {
  const tocken = ref<string>('') // Auth Token
  const refreshToken = ref<string>('') // Refresh Token

  // Wenn der Token im LocalStorage vorhanden ist, setze ihn
  const storedToken = localStorage.getItem('authToken')
  if (storedToken) {
    tocken.value = storedToken
  }

  const storedRefreshToken = localStorage.getItem('refreshToken')
  if (storedRefreshToken) {
    refreshToken.value = storedRefreshToken
  }

  // Watcher, um Änderungen am Token zu speichern
  watch(tocken, (newToken) => {
    if (newToken) {
      localStorage.setItem('authToken', newToken) // Speichern im LocalStorage
    } else {
      localStorage.removeItem('authToken') // Entfernen, wenn der Token gelöscht wird
    }
  })

  watch(refreshToken, (newRefreshToken) => {
    if (newRefreshToken) {
      localStorage.setItem('refreshToken', newRefreshToken) // Speichern im LocalStorage
    } else {
      localStorage.removeItem('refreshToken') // Entfernen, wenn der Refresh-Token gelöscht wird
    }
  })

  return { tocken, refreshToken }
})
