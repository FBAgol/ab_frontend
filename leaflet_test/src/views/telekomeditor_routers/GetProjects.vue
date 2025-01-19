<template>
    <div>
        <h1>hier kommen alle Projekte </h1>
        <button @click="getProjects">Projects</button>
    </div>
</template>
<script setup lang="ts">

import { ref } from 'vue'
import { tokenStore } from '@/stores/tockenStorage'

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