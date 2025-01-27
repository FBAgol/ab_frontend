<template>
  <div v-if="editorstore.telekomEditorNotifications.length === 0">
    <p>Keine neuen Benachrichtigungen.</p>
  </div>
  <div v-else>
    <scale-card label="">
      <scale-table
        show-sort
        v-for="(notification, index) in editorstore.telekomEditorNotifications"
        :key="index"
        class="notification-item"
      >
        <table>
          <thead>
            <tr>
              <th tabindex="0" aria-sort="descending" id="email">Email</th>
              <th tabindex="1" aria-disabled="true" id="project">Projekt</th>
              <th tabindex="2" id="address">Adresse</th>
              <th tabindex="3" id="gegenstand">Gegenstand</th>
              <th tabindex="4" id="wahrscheinlichkeit">Wahrscheinlichkeit</th>
              <th tabindex="5" id="wahrscheinlichkeit">Bild</th>
              <th tabindex="6" id="zone_id">Zone Id</th>
              <th tabindex="7" id="euros">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ notification.company_editor }}</td>
              <td>{{ notification.project_name }}</td>
              <td>{{ notification.city }}-{{ notification.street }}</td>
              <td>{{ notification.objects.name }}</td>
              <td>
                <scale-progress-bar
                  :percentage="formatConfidence(notification.objects.confidence)"
                  :label="`${formatConfidence(notification.objects.confidence)}`"
                  show-status="true"
                ></scale-progress-bar>
              </td>
              <td>
                <!-- Klickbar p-Tag zum Öffnen des Modals -->
                <p style="cursor: pointer" @click="openModal(notification.analysed_image_url)">
                  Bild anzeigen
                </p>
              </td>
              <td>Zone ID</td>
              <td><scale-button>Status</scale-button></td>
            </tr>
          </tbody>
        </table>
      </scale-table>
    </scale-card>
    <!-- Modal zum Anzeigen des Bildes -->
    <scale-modal :opened="opened" size="large" @scale-close="opened = false">
      <div style="display: flex; justify-content: center; align-items: center">
        <img :src="modalImageUrl" alt="image" />
      </div>
    </scale-modal>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { editorStore } from '@/stores/editorStore'
import { initializeSocket } from '@/stores/socket'

const editorstore = editorStore()

// Zustand für das Modal
const opened = ref(false)
const modalImageUrl = ref('')

// Methode zum Formatieren der Zahl
function formatConfidence(value: number): string {
  return value.toFixed(2) + '%'
}

// WebSocket-Listener initialisieren, wenn die Komponente gemountet wird
let socket: any

onMounted(async () => {
  socket = await initializeSocket() // Socket initialisieren
  socket.on('notification', (data: any) => {
    console.log('Notification received:', data)
    editorstore.addNotification(data) // Nachricht zur Benachrichtigungsliste hinzufügen
  })
})

// WebSocket-Listener entfernen, wenn die Komponente unmounted wird
onUnmounted(() => {
  if (socket) {
    socket.off('notification')
  }
})


// Modal öffnen und Bild-URL setzen
function openModal(imageUrl: string) {
  const fullImageUrl = `http://localhost:8000/${imageUrl}`
  modalImageUrl.value = fullImageUrl
  opened.value = true

}

// Modal schließen
function closeModal() {
  opened.value = false
}
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
