<template>
    <body class="body_content">
      <div style="width: 25%; margin: 8.5px 10px 0 0;">
        <sidebar @projectData=""></sidebar>
      </div>
      <div style="width: 75%; border-radius: 5px;">
        <h1>hier kommen alle Projekte </h1>
        <button @click="getProjects">Projects</button>
        
      </div>

    </body>
</template>
<script setup lang="ts">

import { ref } from 'vue'
import { tokenStore } from '@/stores/tockenStorage'
import sidebar from '../../components/SideBar.vue'

const store = tokenStore()

const project = "telMax"

async function getProjects() {
    const url =`http://localhost:8000/api/v1/telekomeditor/projectname/${project}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': store.tocken,
        }
})

if (!response.ok) {
    const errorMessage = await response.text();
    console.error('Fehler:', response.status, errorMessage);
    throw new Error('Fehler beim Laden der Projekte.');}

    const data = await response.json();
    console.log('projects Telekom Editor:', data);
}
</script>