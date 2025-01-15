<template>
  <scale-card>
      <scale-text-field label="Name" :value="ceditorstore.editorEmail" readonly></scale-text-field>
      <scale-text-field label="Unternehmen" :value="ceditorstore.companyName" readonly></scale-text-field>
      <scale-dropdown-select label="Projects" v-for="(project, index) in ceditorstore.projects" :key="index" @scale-change="handleSelectionChange">
        <scale-dropdown-select-item :value="project">{{ project }}</scale-dropdown-select-item>
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
  //console.log('projects:', data);
  return emits("projectData", data)

}



</script>

<style scoped>
scale-card {
  max-width: 500px;
  margin: 10px;
}

label {
  display: block;
  margin: 10px 0 5px;
}

input[type='text'],
input[type='file'] {
  width: 100%;
  padding: 8px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  background-color: #4caf50;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>
