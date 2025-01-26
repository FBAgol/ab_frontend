<template>
    <div>
      <h2>Benachrichtigungen</h2>
      <div v-if="editorstore.telekomEditorNotifications.length === 0">
        <p>Keine neuen Benachrichtigungen.</p>
      </div>
      <div v-else>
        <div
          v-for="(notification, index) in editorstore.telekomEditorNotifications"
          :key="index"
          class="notification-item"
        >
          <p><strong>Projekt:</strong> {{ notification.project_name }}</p>
          <p><strong>Stadt:</strong> {{ notification.city }}</p>
          <p><strong>Straße:</strong> {{ notification.street }}</p>
          <p><strong>Editor:</strong> {{ notification.company_editor }}</p>
          <p><strong>Koordinaten:</strong> ({{ notification.latitude }}, {{ notification.longitude }})</p>
          <p><strong>Objekt:</strong> {{ notification.objects.name }} ({{ notification.objects.confidence }}%)</p>
          <img :src="notification.analysed_image_url" alt="Analysiertes Bild" style="max-width: 100%; height: auto;" />
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { onMounted, onUnmounted } from 'vue';
  import { editorStore } from '@/stores/editorStore';
  import { initializeSocket } from '@/stores/socket';  // Importiere die initializeSocket-Funktion
  
  const editorstore = editorStore();
  
  // WebSocket-Listener initialisieren, wenn die Komponente gemountet wird
  let socket: any;
  
  onMounted(async () => {
  socket = await initializeSocket();  // Socket initialisieren
  socket.on('notification', (data:any) => {
    console.log('Notification received:', data);  // Debugging
    editorstore.addNotification(data);  // Nachricht zur Benachrichtigungsliste hinzufügen
  });
});

  
  // WebSocket-Listener entfernen, wenn die Komponente unmounted wird
  onUnmounted(() => {
    if (socket) {
      socket.off('notification');
    }
  });
  </script>
  
  <style scoped>
  .notification-item {
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 16px;
    background-color: #f9f9f9;
  }
  
  .notification-item p {
    margin: 8px 0;
  }
  
  h2 {
    margin-bottom: 16px;
  }
  </style>