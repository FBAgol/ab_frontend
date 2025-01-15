<template>
  <div>
    <scale-card target="_blank" rel="noopener noreferrer" label="Example Card">
      <scale-text-field label="Email" v-model="inputEmail" :helper-text="warningEmail ? 'Email Feld ist leer' : ''"
      :invalid="warningEmail"></scale-text-field>
      <scale-text-field label="Geheimschluessel" v-model="inputSecretKey" :disabled="parseInt(selectedValue) === 0" :helper-text="warningSecretKey ? 'Gehimschlussel Feld ist leer' : ''"
      :invalid="warningSecretKey"></scale-text-field>
      <scale-text-field label="Password" v-model="inputPassword" :helper-text="warningPassword ? 'Password Feld ist leer' : ''"
      :invalid="warningPassword"></scale-text-field>
      <scale-text-field label="Password woiederholen" v-model="inputPasswordRepeat" :helper-text="warningPasswordRepeat ? 'Feld ist leer' : ''"
      :invalid="warningPasswordRepeat"></scale-text-field>
      <scale-dropdown-select label="Rolle" @scale-change="handleSelectionChange" :helper-text="warningRolle ? 'Wählen Sie bitte Ihre Rolle aus' : ''"
      :invalid="warningRolle">
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

const store = tokenStore()
const emits= defineEmits(["registerNumber"])


const inputEmail = ref('')
const inputSecretKey = ref('')
const inputPassword = ref('')
const inputPasswordRepeat = ref('')
const selectedValue = ref<string>('');
const url = ref<string>('')


const warningEmail= ref<boolean>(false)
const warningPassword= ref<boolean>(false)
const warningRolle= ref<boolean>(false)
const warningPasswordRepeat= ref<boolean>(false)
const warningSecretKey= ref<boolean>(false)

const handleSelectionChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  selectedValue.value = target.value;
}
async function submitForm() {
  try {
    warningEmail.value = !inputEmail.value;
    warningPassword.value = !inputPassword.value;
    warningRolle.value = !selectedValue.value;
    warningPasswordRepeat.value = !inputPasswordRepeat.value;
    warningSecretKey.value = !inputSecretKey.value && parseInt(selectedValue.value) !== 0;
    warningRolle.value = !selectedValue.value;

    if (warningEmail.value || warningPassword.value || warningRolle.value || warningPasswordRepeat.value || warningSecretKey.value) {
      return;
    }

    // Überprüfe, ob die Passwörter übereinstimmen
    if (inputPassword.value !== inputPasswordRepeat.value) {
      // Return der Fehlermeldung, wenn Passwörter nicht übereinstimmen
      return "Password stimmt nicht überein";
    }

    // Festlegung der URL basierend auf der Rolle
    if (parseInt(selectedValue.value) === 0) {
      url.value = "http://localhost:8000/api/v1/superadmin/registeration";
    } else if (parseInt(selectedValue.value) === 2) {
      url.value = "http://localhost:8000/api/v1/telekomeditor/registeration";
    } else if (parseInt(selectedValue.value) === 1) {
      url.value = "http://localhost:8000/api/v1/companyeditor/registeration";
    }

    // Sende die Anfrage basierend auf der Rolle
    const request = await fetch(url.value, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: inputEmail.value,
        password: inputPassword.value,
        role: parseInt(selectedValue.value),
        secret_key: inputSecretKey.value, // Nur wenn notwendig (z.B. für Editor-Rollen)
      }),
    });

    // Überprüfe, ob die Antwort OK ist
    if (!request.ok) {
      throw new Error('Fehler beim Login.');
    }

    let registerNumberType= -1

    if(parseInt(selectedValue.value) === 0){
      registerNumberType= 0}
    else if(parseInt(selectedValue.value) === 1){
      registerNumberType= 1
    }
    else if(parseInt(selectedValue.value) === 2){
      registerNumberType= 2
    }


    // Verarbeite die Antwort
    const data = await request.json();
    console.log(data);

    // Speichere Token für Editor-Rollen
    if (parseInt(selectedValue.value) !== 0) {
      store.tocken = data["access_token"];
      store.refreshToken = data["refresh_token"];
    }
    return emits("registerNumber", registerNumberType);

  } catch (error:any) {
    // Fange alle Fehler ab und gebe den Fehlertext zurück
    console.log(error)
    console.log(error.message);
    return `Error: ${error.message}`;
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
