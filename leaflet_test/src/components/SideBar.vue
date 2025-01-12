<template> 
  <scale-card
  >
  <form @submit.prevent>
    <label for="name">Name:</label>
    <input v-model="name" type="text" id="name" name="name" placeholder="Dein Name" required />
    <label for="firmenname">Firmenname:</label>
    <input
      v-model="firmenname"
      type="text"
      id="firmenname"
      name="firmenname"
      placeholder="Firmenname"
      required
    />
    <label for="projektname">Projektname:</label>
    <input
      v-model="projektname"
      type="text"
      id="projektname"
      name="projektname"
      placeholder="Projektname"
      required
    />
    <label for="excel">Datei hochladen (CSV, XLS, XLSX):</label>
    <input
      id="excel"
      name="excel"
      type="file"
      accept=".xls,.xlsx,.csv"
      @change="handleFileChange"
    />
    <button type="button" @click="submitForm">Absenden</button>
  </form>
  </scale-card
>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import * as XLSX from 'xlsx'
import Papa from 'papaparse'
import { mainStore } from '@/stores/store'

const store = mainStore()
const name = ref('')
const firmenname = ref('')
const projektname = ref('')
const fileInput = ref<File | null>(null)
const jsonData = ref<any[]>([])

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return
  const file = target.files[0]
  fileInput.value = file
  const fileExtension = file.name.split('.').pop()?.toLowerCase()
  if (fileExtension === 'xlsx' || fileExtension === 'xls') {
    processExcel(file)
  } else if (fileExtension === 'csv') {
    processCSV(file)
  } else {
    alert('Bitte eine gültige Datei hochladen (.xls, .xlsx, .csv).')
  }
}

const processCSV = (file: File) => {
  const reader = new FileReader()
  reader.onload = () => {
    const csvText = reader.result as string
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false, // Alle Daten als String einlesen
      complete: (result) => {
        jsonData.value = result.data // Originaldaten speichern
      },
    })
  }
  reader.onerror = () => {
    alert('Fehler beim Lesen der CSV-Datei.')
  }
  reader.readAsText(file, 'UTF-8')
}

// Excel-Datei verarbeiten
const processExcel = (file: File) => {
  const reader = new FileReader()
  reader.onload = (event) => {
    const data = new Uint8Array(event.target?.result as ArrayBuffer)
    const workbook = XLSX.read(data, {
      type: 'array',
      cellText: true, // Lese Zellen als Text
      cellDates: true, // Lese Datumswerte als Text
    })
    const sheetName = workbook.SheetNames[0] // Erstes Blatt wählen
    const worksheet = workbook.Sheets[sheetName]
    jsonData.value = XLSX.utils.sheet_to_json(worksheet, {
      raw: true, // Originalwerte ohne Interpretation einlesen
      defval: null, // Leere Zellen als `null` speichern
    })
  }
  reader.onerror = () => {
    alert('Fehler beim Lesen der Excel-Datei.')
  }
  reader.readAsArrayBuffer(file)
}

const submitForm = () => {
  if (name.value && firmenname.value && projektname.value && jsonData.value.length > 0) {
    store.formContents = {
      name: name.value,
      firmenname: firmenname.value,
      projektname: projektname.value,
      dateiInhalt: jsonData.value,
    }

    name.value = ''
    firmenname.value = ''
    projektname.value = ''
    jsonData.value = []

    //console.log("Formular erfolgreich abgeschickt:", store.formContents);
  } else {
    alert('Bitte alle Felder ausfüllen und eine Datei hochladen.')
  }
}
</script>

<style scoped>
scale-card{
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
