<template>
  <div>
    <scale-card target="_blank" rel="noopener noreferrer" label="Example Card">
      <scale-text-field label="Email" v-model="inputEmail"></scale-text-field>
      <scale-text-field label="Geheimschluessel" v-model="inputSecretKey" :disabled="parseInt(selectedValue) === 0"></scale-text-field>
      <scale-text-field label="Password" v-model="inputPassword"></scale-text-field>
      <scale-text-field label="Password woiederholen" v-model="inputPasswordRepeat"></scale-text-field>
      <scale-dropdown-select label="Rolle" @scale-change="handleSelectionChange">
        <scale-dropdown-select-item value="0">Super Admin</scale-dropdown-select-item>
        <scale-dropdown-select-item value="1">Telekom Editor</scale-dropdown-select-item>
        <scale-dropdown-select-item value="2">Company Editor</scale-dropdown-select-item>
      </scale-dropdown-select>
      <scale-button @click="submitForm">Registerieren</scale-button>
    </scale-card>
  </div>
</template>
<script setup lang="ts">

import { ref } from 'vue'
import { mainStore } from '@/stores/tockenStorage'

const store = mainStore()


const inputEmail = ref('')
const inputSecretKey = ref('')
const inputPassword = ref('')
const inputPasswordRepeat = ref('')
const selectedValue = ref<string>('');
const url = ref<string>('')

const handleSelectionChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  selectedValue.value = target.value;
}




async function submitForm() {

  if(inputPassword.value !== inputPasswordRepeat.value){

    return "Password stimmt nicht ueberein"
  }


  if (parseInt(selectedValue.value) === 0) {
    url.value = "http://localhost:8000/api/v1/superadmin/registeration"
  }
  else if (parseInt(selectedValue.value) === 2) {
    url.value = "http://localhost:8000/api/v1/telekomeditor/registeration"
  }
  else if (parseInt(selectedValue.value) === 1) {
    url.value = "http://localhost:8000/api/v1/companyeditor/registeration"
  }

  if (parseInt(selectedValue.value) === 0) {
    
    const request = await fetch(url.value, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: inputEmail.value,
        password: inputPassword.value,
        role: parseInt(selectedValue.value)
      })
    })
    if (!request.ok) {
      throw new Error('Fehler beim Login.')
    }

    const data = await request.json()
    console.log(data)

  }
  else{
    const request = await fetch(url.value, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        secret_key: inputSecretKey.value,
        email: inputEmail.value,
        password: inputPassword.value,
        role: parseInt(selectedValue.value)
      })
    })
    if (!request.ok) {
      throw new Error('Fehler beim Login.')
    }

    const data = await request.json()
    console.log(data)
    console.log(data)
    store.tocken= data["access_token"]
    store.refreshToken= data["refresh_token"]
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
