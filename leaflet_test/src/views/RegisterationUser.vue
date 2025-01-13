<template>
  <div>
    <scale-card target="_blank" rel="noopener noreferrer" label="Example Card">
      <scale-text-field label="Email" v-model="inputEmail"></scale-text-field>
      <scale-text-field label="Geheimschluessel" v-model="inputSecretKey"></scale-text-field>
      <scale-text-field label="Password" v-model="inputPassword"></scale-text-field>
      <scale-text-field label="Password woiederholen" v-model="inputPasswordRepeat"></scale-text-field>
      <scale-dropdown-select label="Rolle" @scale-change="handleSelectionChange">
        <scale-dropdown-select-item value="0">Super Admin</scale-dropdown-select-item>
        <scale-dropdown-select-item value="1">Telekom Editor</scale-dropdown-select-item>
        <scale-dropdown-select-item value="2">Company Editor</scale-dropdown-select-item>
      </scale-dropdown-select>
    </scale-card>
  </div>
</template>
<script setup lang="ts">

import { ref } from 'vue'


const inputEmail = ref('')
const inputSecretKey = ref('')
const inputPassword = ref('')
const inputPasswordRepeat = ref('')

const selectedValue = ref<string | null>(null);

const handleSelectionChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  selectedValue.value = target.value;
}


</script>
<style scoped>
scale-card::part(base) {
  width: 500px;
  height: 400px;
  border-radius: 5px;
}
</style>
