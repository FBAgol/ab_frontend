<template>
  <div>
    <scale-card target="_blank" rel="noopener noreferrer" label="Example Card">
      <scale-text-field class="childCard" label="Email" v-model="inputEmail"></scale-text-field>
      <scale-text-field label="Password" class="childCard" v-model="inputPassword"></scale-text-field>
      <scale-dropdown-select label="Rolle" class="childCard" @scale-change="handleSelectionChange">
        <scale-dropdown-select-item value="0">Super Admin</scale-dropdown-select-item>
        <scale-dropdown-select-item value="1">Company Editor</scale-dropdown-select-item>
        <scale-dropdown-select-item value="2">Telekom Editor</scale-dropdown-select-item>

      </scale-dropdown-select>
      <scale-button @click="submitForm">Anmelden</scale-button>
    </scale-card>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import type { Login } from '../interfaces/interface'

// Input-Felder
const inputEmail = ref('')
const inputPassword = ref('')

const selectedValue = ref<string | null>(null)

// Benutzer-Login-Daten
const loginUser = ref<Login>({
  email: '',
  password: '',
  role: 0
})

const handleSelectionChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  selectedValue.value = target.value
}

async function submitForm() {

  // Login-Daten setzen
  loginUser.value.email = inputEmail.value
  loginUser.value.password = inputPassword.value
  loginUser.value.role = parseInt(selectedValue.value!)

  try {
    const url = ref<string>('')
    if (loginUser.value.role === 0) {
      url.value = "http://localhost:8000/api/v1/superadmin/login"
    }
    else if (loginUser.value.role === 1) {
      url.value = "http://localhost:8000/api/v1/companyeditor/login"
    }
    else if (loginUser.value.role === 2) {
      url.value = "http://localhost:8000/api/v1/telekomeditor/login"
    }

    const response = await fetch(url.value, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginUser.value)
    })
    if (!response.ok) {
      throw new Error('Fehler beim Login.')
    }

    const data = await response.json()
    console.log('user:',  loginUser.value.role)
    console.log('Erfolg:',  data)

  } catch (error) {
    console.error(error)
  }

}
</script>

<style scoped>
scale-card::part(base) {
  width: 500px;
  height: 400px;
  border-radius: 5px;
}
</style>
