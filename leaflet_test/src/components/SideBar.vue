<template>
  <scale-card>
      <scale-text-field label="Name" :value="ceditorstore.editorEmail" readonly></scale-text-field>
      <scale-text-field label="Unternehmen" :value="ceditorstore.companyName" readonly></scale-text-field>
      <scale-dropdown-select label="Projects" @scale-change="handleSelectionChange">
        <scale-dropdown-select-item  v-for="(project, index) in ceditorstore.projects" :key="index" :value="project">{{ project }}</scale-dropdown-select-item>
      </scale-dropdown-select>
      <scale-button @click="getProjectContent">Projekt</scale-button>

  </scale-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
//import * as XLSX from 'xlsx'
//import Papa from 'papaparse'
import { tokenStore } from '@/stores/tockenStorage'
import { companyeditorStore } from '@/stores/companyEditorStore'

const tStore = tokenStore()
const ceditorstore = companyeditorStore()

const selectedValue = ref<string | null>(null)
const emits= defineEmits(["projectData"])

const handleSelectionChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  selectedValue.value = target.value
}

async function getProjectContent() {
  const url = `http://localhost:8000/api/v1/companyeditor/projectname/${selectedValue.value}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': tStore.tocken,  // Korrektes Header-Feld für den Token
    },
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    console.error('Fehler:', response.status, errorMessage);
    throw new Error('Fehler beim Laden der Projekte.');
  }

  const data = await response.json();
  console.log('projects:', data);
  return emits("projectData", data)

}



</script>

<style scoped>

scale-card::part(base) {
  border-radius: 5px;
  overflow: visible;/* Erlaubt das Anzeigen der Dropdown-Optionen außerhalb des Containers */
}

scale-card :deep(.text-field){
  margin: 5px;
}

scale-card ::part(combobox) {
  margin: 5px;
  width: 352px;
}
scale-card ::part(base variant-primary before){
  margin: 0 5px 5px 5px;

}

</style>
