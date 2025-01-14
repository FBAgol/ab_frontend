import { ref, watch } from 'vue'
import { defineStore } from 'pinia'



export const mainStore = defineStore('store', () => {

    const tocken = ref<string>('')
    const refreshToken = ref<string >('')


  return { tocken, refreshToken }
})
