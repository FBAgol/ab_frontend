<template>
  <div>
    <scale-card target="_blank" rel="noopener noreferrer" label="Example Card">
      <scale-text-field
        label="Email"
      ></scale-text-field>
      <scale-text-field
        label="Geheimschluessel"
      ></scale-text-field>
      <scale-text-field
        label="Password"
      ></scale-text-field>
      <scale-text-field
        label="Password woiederholen"
      ></scale-text-field>
      <scale-dropdown-select label="select">
        <scale-dropdown-select-item value="caspar">Super Admin</scale-dropdown-select-item>
        <scale-dropdown-select-item value="cedric">Telekom Editor</scale-dropdown-select-item>
        <scale-dropdown-select-item value="cem">Company Editor</scale-dropdown-select-item>
      </scale-dropdown-select>
    </scale-card>
  </div>
</template>
<script setup lang="ts"></script>

<style scoped>
scale-card::part(base) {
  width: 500px;
  height: 400px;
  border-radius: 5px;
}

</style>
