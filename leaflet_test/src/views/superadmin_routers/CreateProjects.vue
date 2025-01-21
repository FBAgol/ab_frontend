<template>
  <div class="projectBody">
    <scale-card :class="{hidden: nextPageShow, show: !nextPageShow}" target="_blank" rel="noopener noreferrer"label="Example Card">
            <scale-text-field label="Projektname" v-model="inputProjectName" :helper-text=" warningProjectName ? 'Email Feld ist leer': ''" 
            :invalid="warningProjectName"></scale-text-field>

            <scale-text-field label="Telekom Editor Email" v-model="inputTelEditorEmail" :helper-text=" warningTelEditorEmail ? 'Email Feld ist leer' :  (invalidTelEmail ? 'Invalid Email': '')" 
            :invalid="warningTelEditorEmail || invalidTelEmail"></scale-text-field>

            <scale-text-field label="Telekom Editor Secretkey" v-model="inputTelSecretKey" :helper-text=" warningTelSecretKey ? 'Feld ist leer' : ''" 
            :invalid="warningTelSecretKey"></scale-text-field>

            <scale-text-field label="Company Editor Email" v-model="inputComEditorEmail" :helper-text=" warningComEditorEmail ? 'Email Feld ist leer' :  (invalidComEmail ? 'Invalid Email': '')" 
            :invalid="warningComEditorEmail || invalidComEmail"></scale-text-field>

            <scale-text-field label="Company Editor Secretkey" v-model="inputComSecretKey" :helper-text=" warningComSecretKey ? 'Feld ist leer' :  ''" 
            :invalid="warningComSecretKey"></scale-text-field>
            <scale-text-field label="Company Name" v-model="inputComponyName" :helper-text=" warningComponyName ? 'Feld ist leer' :  ''" 
            :invalid="warningComponyName"></scale-text-field>
            <scale-button @click="nextPage">Weieter</scale-button>
        </scale-card>
 
    <UploadExel @backToLastPage="lastPage" @exelFile="createProject($event)" :class="{hidden: !nextPageShow, show: nextPageShow}"></UploadExel>

  </div>
        
</template>
<script setup lang="ts">
import { ref } from 'vue'
import UploadExel from '../../components/superadmin-components/UploadExel.vue'
import type { ProjectInfo } from '../../interfaces/interface'
import { tokenStore } from '@/stores/tockenStorage'

const store = tokenStore()

const inputProjectName = ref<string>('')
const inputTelEditorEmail = ref<string>('')
const inputTelSecretKey = ref<string>('')
const inputComEditorEmail = ref<string>('')
const inputComSecretKey = ref<string>('')
const inputComponyName = ref<string>('')
const fileContent = ref<File | null>(null)

const warningProjectName = ref<boolean>(false)
const warningTelEditorEmail = ref<boolean>(false) 
const warningTelSecretKey = ref<boolean>(false)
const warningComEditorEmail = ref<boolean>(false)
const warningComSecretKey = ref<boolean>(false)
const warningComponyName = ref<boolean>(false)
const invalidTelEmail = ref<boolean>(false)
const invalidComEmail = ref<boolean>(false)


const projectInfo = ref<ProjectInfo>({
  token: '',
  company_name: '',
  TelEditor_email: '',
  TelEditor_secret_key: '',
  Com_Editor_email: '',
  Com_Editor_secret_key: '',
  project_name: ''
})

const nextPageShow = ref<boolean>(false)

async function nextPage() {
  
  const emailRegex = /^[a-z0-9._%+-]+@(gmail|telekom)\.(com|de)$/;
  warningProjectName.value = !inputProjectName.value;

  warningTelEditorEmail.value = !inputTelEditorEmail.value;
  invalidTelEmail.value = !emailRegex.test(inputTelEditorEmail.value);

  warningTelSecretKey.value = !inputTelSecretKey.value;
  warningComEditorEmail.value = !inputComEditorEmail.value;
  invalidComEmail.value = !emailRegex.test(inputComEditorEmail.value);

  warningComSecretKey.value = !inputComSecretKey.value;
  warningComponyName.value = !inputComponyName.value;

  if(warningProjectName.value || warningTelEditorEmail.value || invalidTelEmail.value || warningTelSecretKey.value || warningComEditorEmail.value || invalidComEmail.value || warningComSecretKey.value || warningComponyName.value){
    return;
  }
  nextPageShow.value = true

}

async function lastPage() {
  nextPageShow.value = false
}

async function createProject(value: File) {
  fileContent.value = value // Hochgeladene Datei setzen
  projectInfo.value.token = store.tocken
  projectInfo.value.company_name = inputComponyName.value
  projectInfo.value.TelEditor_email = inputTelEditorEmail.value
  projectInfo.value.TelEditor_secret_key = inputTelSecretKey.value
  projectInfo.value.Com_Editor_email = inputComEditorEmail.value
  projectInfo.value.Com_Editor_secret_key = inputComSecretKey.value
  projectInfo.value.project_name = inputProjectName.value

  const formData = new FormData()
  formData.append('editors', JSON.stringify(projectInfo.value)) // JSON-Daten anhängen
  formData.append('file', fileContent.value as File) // Datei anhängen

  try {
    const response = await fetch('http://localhost:8000/api/v1/superadmin/define_projects', {
      method: 'POST',
      body: formData, // FormData senden
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Error: ${response.status} - ${errorData.detail}`)
    }

    const result = await response.json()
    console.log('Erfolg:', result)
    lastPage()
    inputProjectName.value = ''
    inputTelEditorEmail.value = ''
    inputTelSecretKey.value = ''
    inputComEditorEmail.value = ''
    inputComSecretKey.value = ''
    inputComponyName.value = ''
    fileContent.value = null
  } catch (error) {
    console.error('Fehler beim Erstellen des Projekts:', error)
  }
}
</script>

<style scoped>
.projectBody{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 500px;
}

.hidden{
    display: none;
}

.show {
  visibility: visible; 
}
scale-card::part(base) {
  width: 600px;
  border-radius: 5px;

}
scale-card :deep(.text-field){
  margin: 5px;
}

scale-card ::part(base variant-primary before){
  margin: 0 5px 5px 5px;

}
</style>