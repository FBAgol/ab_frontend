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
import { ref} from 'vue'
import type { Login } from '../interfaces/interface'
import { tokenStore } from '@/stores/tockenStorage'
import { companyeditorStore } from '@/stores/companyEditorStore'

const tStore = tokenStore()
const ceditorstore= companyeditorStore() 
const emits= defineEmits(["loginNumber"])

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
  const loginNumberType = ref<number>()

  try {
    const url = ref<string>('')
    if (loginUser.value.role === 0) {
      url.value = "http://localhost:8000/api/v1/superadmin/login"
      loginNumberType.value = 0
    }
    else if (loginUser.value.role === 1) {
      url.value = "http://localhost:8000/api/v1/companyeditor/login"
      loginNumberType.value = 1
    }
    else if (loginUser.value.role === 2) {
      url.value = "http://localhost:8000/api/v1/telekomeditor/login"
      loginNumberType.value = 2
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

    //console.log('tocken:',  data["access_token"])
    //console.log('refresch tocken:',  data["refresh_token"])
    //console.log('number:',  loginNumberType.value)
    tStore.tocken= data["access_token"]
    tStore.refreshToken= data["refresh_token"]
    if(data["projects"] && data["company_name"]){
      ceditorstore.projects= data["projects"]
      ceditorstore.companyName= data["company_name"]
      ceditorstore.editorEmail= inputEmail.value
    }
    return emits("loginNumber", loginNumberType.value)

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
