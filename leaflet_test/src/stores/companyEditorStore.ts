import { ref} from 'vue'
import { defineStore } from 'pinia'



export const companyeditorStore = defineStore('store', () => {

    const companyName = ref<string>('')
    const projects = ref<string[]>([])
    const editorEmail= ref<string>('')


  return { companyName, projects, editorEmail }
})
