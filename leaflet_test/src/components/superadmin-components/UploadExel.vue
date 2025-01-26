<template>
  <scale-card label="Upload Exel">
    <scale-text-field label="" type="file" @change="handleFileUpload"> </scale-text-field>
    <div class="buttonBox">
      <scale-button @click="lastPage">Zurück</scale-button>
      <scale-button @click="submitFile">Erstellen</scale-button>
    </div>
  </scale-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emits = defineEmits(['backToLastPage', 'exelFile'])

const inputFile = ref<File | null>(null)
const backToLastPage = ref<boolean>(false)

// Funktion, um die Datei aus dem Input-Feld zu holen
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    inputFile.value = target.files[0] // Datei speichern
  }
}

// Funktion, um die Datei an die API zu senden
const submitFile = async () => {
  if (!inputFile.value) {
    alert('Bitte wählen Sie eine Datei aus.')
    return
  }

  const formData = new FormData()
  formData.append('file', inputFile.value)
  return emits('exelFile', inputFile.value) // Nur die Datei wird zurückgegeben
}

async function lastPage() {
  backToLastPage.value = true
  return emits('backToLastPage', backToLastPage.value)
}
</script>

<style scoped>
.buttonBox {
  margin-left: 1px;
}
</style>
