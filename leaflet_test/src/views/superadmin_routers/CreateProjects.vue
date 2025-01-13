<template>
        <scale-card :class="{hidden: nextPageShow, show: !nextPageShow}" target="_blank" rel="noopener noreferrer"label="Example Card">
            <scale-text-field label="Projektname" v-model="inputProjectName"></scale-text-field>
            <scale-text-field label="Telekom Editor Email" v-model="inputTelEditorEmail"></scale-text-field>
            <scale-text-field label="Telekom Editor Secretkey" v-model="inputTelSecretKey"></scale-text-field>
            <scale-text-field label="Company Editor Email" v-model="inputComEditorEmail"></scale-text-field>
            <scale-text-field label="Company Editor Secretkey" v-model="inputComSecretKey"></scale-text-field>
            <scale-text-field label="Company Name" v-model="inputComponyName"></scale-text-field>
            <scale-button @click="nextPage">Weieter</scale-button>
        </scale-card>
 
    <UploadExel @backToLastPage="lastPage" @exelFile="createProject($event)" :class="{hidden: !nextPageShow, show: nextPageShow}"></UploadExel>
    <div>
        <p>{{ inputProjectName }}</p>
        <p>{{ inputTelEditorEmail }}</p>
        <p>{{ inputTelSecretKey }}</p>
        <p>{{ inputComEditorEmail }}</p>
        <p>{{ inputComSecretKey }}</p>
        <p>{{ inputComponyName }}</p>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import UploadExel from '../../components/superadmin-components/UploadExel.vue'
import type {ProjectInfo} from '../../interfaces/interface'

const inputProjectName = ref<string>('')
const inputTelEditorEmail = ref<string>('')
const inputTelSecretKey = ref<string>('')
const inputComEditorEmail = ref<string>('')
const inputComSecretKey = ref<string>('')
const inputComponyName = ref<string>('')
const fileContent = ref(null)
const projectInfo = ref<ProjectInfo>({
    superadmin_token: '',
    company_name: '',
    TelEditor_email: '',
    TelEditor_secret_key: '',
    Com_Editor_email: '',
    Com_Editor_secret_key: '',
    project_name: ''})


const nextPageShow= ref<boolean>(false)

async function nextPage() {
    nextPageShow.value = true
}

async function lastPage() {
    nextPageShow.value = false
}

async function createProject(value: any) {
    fileContent.value = value
    projectInfo.value.superadmin_token =""
    projectInfo.value.company_name = inputComponyName.value
    projectInfo.value.TelEditor_email = inputTelEditorEmail.value
    projectInfo.value.TelEditor_secret_key = inputTelSecretKey.value
    projectInfo.value.Com_Editor_email = inputComEditorEmail.value
    projectInfo.value.Com_Editor_secret_key = inputComSecretKey.value
    projectInfo.value.project_name = inputProjectName.value
    
    
    
}
</script>

<style scoped>

    .hidden{
        display: none;
    }

    .show {
  visibility: visible; 
}
</style>