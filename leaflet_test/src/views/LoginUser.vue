<template>
  <div class="loginBody">
    <scale-card target="_blank" rel="noopener noreferrer" label="Example Card">
      <scale-text-field class="childCard" label="Email" v-model="inputEmail"
        :helper-text="warningEmail ? 'Email Feld ist leer' : ''" :invalid="warningEmail"></scale-text-field>
      <scale-text-field label="Password" class="childCard" v-model="inputPassword"
        :helper-text="warningPassword ? 'Password Feld ist leer' : ''" :invalid="warningPassword"></scale-text-field>
      <scale-dropdown-select label="Rolle" class="childCard" @scale-change="handleSelectionChange"
        :helper-text="warningRolle ? 'Wählen Sie bitte Ihre Rolle aus' : ''" :invalid="warningRolle">
        <scale-dropdown-select-item value="0">Super Admin</scale-dropdown-select-item>
        <scale-dropdown-select-item value="1">Company Editor</scale-dropdown-select-item>
        <scale-dropdown-select-item value="2">Telekom Editor</scale-dropdown-select-item>
      </scale-dropdown-select>
      <scale-button @click="submitForm">Anmelden</scale-button>
    </scale-card>
    <scale-notification  :heading="invalidError ? 'Email oder Password ist invalid' : ''" :variant="invalidError ?  'danger' : ''" opened></scale-notification>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import type { Login } from '../interfaces/interface'
import { tokenStore } from '@/stores/tockenStorage'
import { editorStore } from '@/stores/editorStore'


//console.log('window.innerWidth:', window.innerWidth)

const tStore = tokenStore()
const editorstore = editorStore()
const emits = defineEmits(["loginNumber"])

const inputEmail = ref('')
const inputPassword = ref('')
const selectedValue = ref<string>('')
const loginUser = ref<Login>({
  email: '',
  password: '',
  role: ''
})

const warningEmail = ref<boolean>(false)
const warningPassword = ref<boolean>(false)
const warningRolle = ref<boolean>(false)

const invalidError = ref<boolean>(false)

const handleSelectionChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  selectedValue.value = target.value
}

async function submitForm() {
  // Login-Daten setzen und Warnungen aktivieren, wenn Felder leer sind
  warningEmail.value = !inputEmail.value;
  warningPassword.value = !inputPassword.value;
  warningRolle.value = !selectedValue.value;

  // Beenden, wenn eines der Warnungsflags true ist
  if (warningEmail.value || warningPassword.value || warningRolle.value) {
    return; // Abbrechen und keine weiteren Aktionen ausführen
  }

  // Validierte Login-Daten zuweisen
  loginUser.value.email = inputEmail.value;
  loginUser.value.password = inputPassword.value;
  loginUser.value.role = selectedValue.value!;

  try {
    const url = ref<string>('');
    if (loginUser.value.role === '0') {
      url.value = "http://localhost:8000/api/v1/superadmin/login";
    } else if (loginUser.value.role === '1') {
      url.value = "http://localhost:8000/api/v1/companyeditor/login";
    } else if (loginUser.value.role === '2') {
      url.value = "http://localhost:8000/api/v1/telekomeditor/login";
    }

    const response = await fetch(url.value, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginUser.value),
    });

    if (!response.ok) {
      invalidError.value = true;
      throw new Error('Fehler beim Login.');
    }

    console.log('Login erfolgreich:', response.status);

    // Wenn die Antwort erfolgreich ist, setzen Sie den entsprechenden Typ
    let loginNumberType = -1; // Initialisieren mit einem ungültigen Wert
    if (loginUser.value.role === '0') {
      loginNumberType = 0;
    } else if (loginUser.value.role === '1') {
      loginNumberType = 1;
    } else if (loginUser.value.role === '2') {
      loginNumberType = 2;
    }

    const data = await response.json();
  console.log('data:', data);

    tStore.tocken = data["access_token"];
    tStore.refreshToken = data["refresh_token"];
    if (data["projects"] && data["company_name"]) {
      editorstore.projects = data["projects"];
      editorstore.companyName = data["company_name"];
      editorstore.companyEditorEmail = inputEmail.value;
    }

    if (loginUser.value.role === '2' &&data) {
      editorstore.telekomEditorNotifications = data["notifications"];
    } 
    emits("loginNumber", loginNumberType)

  } catch (error: any) {
    console.error(error.message);
  }
}

</script>

<style scoped>
body {
  background-color: black;
}
.loginBody{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 450px;

}
scale-card::part(base) {
  width: 500px;
  min-height: 188px;
  border-radius: 5px;
  overflow: visible;/* Erlaubt das Anzeigen der Dropdown-Optionen außerhalb des Containers */
}

scale-card :deep(.text-field){
  margin: 5px;
}

scale-card ::part(combobox) {
  margin: 5px;
  width: 442px;
}

scale-card ::part(base variant-primary before){
  margin: 0 5px 5px 5px;

}

scale-notification::part(base) {
  width: 50%;
  margin-top: 10px;
}



</style>
