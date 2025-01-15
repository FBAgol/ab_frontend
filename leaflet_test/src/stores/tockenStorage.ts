import { ref} from 'vue'
import { defineStore } from 'pinia'



export const tokenStore = defineStore('store', () => {

    const tocken = ref<string>('')
    const refreshToken = ref<string >('')


  return { tocken, refreshToken }
})
