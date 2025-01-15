<template>
  <div>
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

    <scale-notification :heading="invalidError ? 'Email oder Password ist invalid' : ''" :variant="invalidError ?  'danger' : ''" opened></scale-notification>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import type { Login } from '../interfaces/interface'
import { tokenStore } from '@/stores/tockenStorage'
import { companyeditorStore } from '@/stores/companyEditorStore'

const tStore = tokenStore()
const ceditorstore = companyeditorStore()
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

    tStore.tocken = data["access_token"];
    tStore.refreshToken = data["refresh_token"];
    if (data["projects"] && data["company_name"]) {
      ceditorstore.projects = data["projects"];
      ceditorstore.companyName = data["company_name"];
      ceditorstore.editorEmail = inputEmail.value;
    }

    // Emit den Typ, wenn alles erfolgreich ist
    return emits("loginNumber", loginNumberType);

  } catch (error: any) {
    console.error(error.message);
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
