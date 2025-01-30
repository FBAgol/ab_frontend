<template>
  <div class="registeration-body">
    <scale-card target="_blank" rel="noopener noreferrer" label="Example Card">
      <scale-text-field label="Email" v-model="inputEmail" :helper-text=" warningEmail ? 'Email Feld ist leer' :  (invalidEmail ? 'Invalid Email': '')" 
      :invalid="warningEmail || invalidEmail"></scale-text-field>
      <scale-text-field label="Geheimschluessel" v-model="inputSecretKey" :disabled="parseInt(selectedValue) === 0" :helper-text="warningSecretKey ? 'Gehimschlussel Feld ist leer' : ''"
      :invalid="warningSecretKey"></scale-text-field>
      <scale-text-field label="Password" v-model="inputPassword" :helper-text="warningPassword ? 'Password Feld ist leer' :( invalidPassword ? 'invalid Password': '')"
      :invalid="warningPassword || invalidPassword"></scale-text-field>
      <scale-text-field label="Password woiederholen" v-model="inputPasswordRepeat" :helper-text="warningPasswordRepeat ? 'Feld ist leer' : ''"
      :invalid="warningPasswordRepeat"></scale-text-field>
      <scale-dropdown-select label="Rolle" @scale-change="handleSelectionChange" :helper-text="warningRole ? 'Wählen Sie bitte Ihre Rolle aus' : ''"
      :invalid="warningRole">
        <scale-dropdown-select-item value="0">Super Admin</scale-dropdown-select-item>
        <scale-dropdown-select-item value="2">Telekom Editor</scale-dropdown-select-item>
        <scale-dropdown-select-item value="1">Company Editor</scale-dropdown-select-item>
      </scale-dropdown-select>
    
      <scale-button @click="submitForm">Registerieren</scale-button>
    </scale-card>
  </div>
</template>
<script setup lang="ts">

import { ref} from 'vue'
import { tokenStore } from '@/stores/tockenStorage'
import { editorStore } from '@/stores/editorStore'

const store = tokenStore()
const editorstore = editorStore()
const emits= defineEmits(["registerNumber"])


const inputEmail = ref<string>('')
const inputSecretKey = ref<string>('')
const inputPassword = ref<string>('')
const inputPasswordRepeat = ref<string>('')
const selectedValue = ref<string>('');
const url = ref<string>('')


const warningEmail= ref<boolean>(false)
const warningPassword= ref<boolean>(false)
const warningRole= ref<boolean>(false)
const warningPasswordRepeat= ref<boolean>(false)
const warningSecretKey= ref<boolean>(false)
const invalidEmail= ref<boolean>(false)
const invalidPassword= ref<boolean>(false)
const handleSelectionChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  selectedValue.value = target.value;
}

async function submitForm() {
  try {
    const emailRegex = /^[a-z0-9._%+-]+@(gmail|telekom)\.(com|de)$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

    warningEmail.value = !inputEmail.value;
    invalidEmail.value = !emailRegex.test(inputEmail.value);

    warningPassword.value = !inputPassword.value ;
    invalidPassword.value = !passwordRegex.test(inputPassword.value);

    warningPasswordRepeat.value = !inputPasswordRepeat.value;
    warningSecretKey.value = !inputSecretKey.value && parseInt(selectedValue.value) !== 0;
    warningRole.value = !selectedValue.value;

    if (warningEmail.value || warningPassword.value || warningRole.value || warningPasswordRepeat.value || warningSecretKey.value) {
      return;
    }

    // Überprüfen Sie, ob die Passwörter übereinstimmen
    if (inputPassword.value !== inputPasswordRepeat.value) {
      console.error('Passwörter stimmen nicht überein');
      return 'Passwort stimmt nicht überein';
    }

    // URL basierend auf der Rolle festlegen
    if (parseInt(selectedValue.value) === 0) {
      url.value = "http://localhost:8000/api/v1/superadmin/registration";
    } else if (parseInt(selectedValue.value) === 2) { 
      url.value = "http://localhost:8000/api/v1/telekomeditor/registration";
    } else if (parseInt(selectedValue.value) === 1) {
      url.value = "http://localhost:8000/api/v1/companyeditor/registration";
    }

    // Anfrage senden
    const request = await fetch(url.value, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret_key: inputSecretKey.value,
        email: inputEmail.value,
        password: inputPassword.value,
        role: parseInt(selectedValue.value)
      }),
    });

    if (!request.ok) {
      throw new Error('Fehler beim Anmelden.');
    }

    let registerNumberType = -1;
    if (parseInt(selectedValue.value) === 0) registerNumberType = 0;
    else if (parseInt(selectedValue.value) === 1) registerNumberType = 1;
    else if (parseInt(selectedValue.value) === 2) registerNumberType = 2;

    const data = await request.json();
    console.log("regiseration data", data);

    if (parseInt(selectedValue.value) !== 0) {
      store.tocken = data["access_token"];
      store.refreshToken = data["refresh_token"];
      if (data["projects"] && data["company_name"]) {
      editorstore.projects = data["projects"];
      editorstore.companyName = data["company_name"];
      editorstore.editorEmail = inputEmail.value;
    }

    if (parseInt(selectedValue.value) === 2 &&data) {
      editorstore.telekomEditorNotifications = data["notifications"];
    } 
    }

    return emits("registerNumber", registerNumberType);

  } catch (error:any) {
    console.error(error);
    return `Fehler: ${error.message}`;
  }
}


</script>
<style scoped>
.registeration-body{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 500px;
  
}


scale-card ::part(base) {
  display: flex;
  flex-direction: column;
}
scale-card::part(base) {
  width: 500px;
  min-height: 347px;
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
.helper-text helper-text--danger{
  flex-direction: row !important;
}


scale-card[data-v-a55f2463] ::part(base){
  display: flex;
  flex-direction: row-reverse !important;
}
</style>
