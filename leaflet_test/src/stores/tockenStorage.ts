import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

export const tokenStore = defineStore('store', () => {
  const tocken = ref<string>('') 
  const refreshToken = ref<string>('') 

  const storedToken = localStorage.getItem('authToken')
  if (storedToken) {
    tocken.value = storedToken
  }

  const storedRefreshToken = localStorage.getItem('refreshToken')
  if (storedRefreshToken) {
    refreshToken.value = storedRefreshToken
  }

  watch(tocken, (newToken) => {
    if (newToken) {
      localStorage.setItem('authToken', newToken)
    } else {
      localStorage.removeItem('authToken')
    }
  })

  watch(refreshToken, (newRefreshToken) => {
    if (newRefreshToken) {
      localStorage.setItem('refreshToken', newRefreshToken)
    } else {
      localStorage.removeItem('refreshToken')
    }
  })

  return { tocken, refreshToken }
})
