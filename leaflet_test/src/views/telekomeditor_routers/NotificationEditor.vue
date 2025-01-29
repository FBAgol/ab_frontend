<template>
  <div v-if="editorstore.telekomEditorNotifications.length === 0">
    <p>Keine neuen Benachrichtigungen.</p>
  </div>
  <div v-else>
    <scale-card label="">
      <scale-table
        show-sort
        v-for="(notification, index) in telekomEditorNotifications"
        :key="index"
        class="notification-item"
      >
        <table style="border-bottom-color: white;">
          <thead>
            <tr>
              <th tabindex="0" aria-sort="descending" id="email">Email</th>
              <th tabindex="1" aria-disabled="true" id="project">Projekt</th>
              <th tabindex="2" id="address">Adresse</th>
              <th tabindex="3" id="gegenstand">Gegenstand</th>
              <th tabindex="4" id="wahrscheinlichkeit">Wahrscheinlichkeit</th>
              <th tabindex="5" id="wahrscheinlichkeit">Bild</th>
              <th tabindex="6" id="zone_id">Zone Id</th>
              <th tabindex="7" id="status">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ notification.company_editor }}</td>
              <td>{{ notification.project_name }}</td>
              <td>{{ notification.city }}-{{ notification.street }}</td>
              <td>{{ notification.objects.object }}</td>
              <td>
                <scale-progress-bar
                  :percentage="formatConfidence(notification.objects.confidence)"
                  :label="`${formatConfidence(notification.objects.confidence)}`"
                  show-status="true"
                ></scale-progress-bar>
              </td>
              <td>
                <!-- Klickbar p-Tag zum Öffnen des Modals -->
                <p class="ulrHover"  @click="openModal(notification.analysed_image_url)">
                  {{ formatUrlImg(notification.analysed_image_url) }}
                </p>
              </td>
              <td>{{ notification.zone_id }}</td>
              <td>
                <scale-button @click="establishObjectStatus(notification.objects.object, notification.latitude, notification.longitude)">bestädigen</scale-button></td>
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
import {tokenStore} from '@/stores/tockenStorage'
import { initializeSocket } from '@/stores/socket'
import { storeToRefs } from "pinia";

const editorstore = editorStore()
const tokenstore = tokenStore()
const { telekomEditorNotifications } = storeToRefs(editorstore);

// Zustand für das Modal
const opened = ref(false)
const modalImageUrl = ref('')

// Methode zum Formatieren der Zahl
function formatConfidence(value: number): string {
  return value.toFixed(2) + '%'
}

function formatUrlImg(url: string): string {
  const formatedUrl= url.replace('images/analyse/', '')
  return formatedUrl
}

// WebSocket-Listener initialisieren, wenn die Komponente gemountet wird
let socket: any

onMounted(async () => {
  socket = await initializeSocket() // Socket initialisieren
  socket.on('notification', (data: any) => {
    console.log('Notification received:', data)
    telekomEditorNotifications.value.push(data) // Nachricht zur Benachrichtigungsliste hinzufügen
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

function establishObjectStatus(obj:string , lat:string, long:string){
  
  const request= fetch('http://localhost:8000/api/v1/telekomeditor/update_status_img',{
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `${tokenstore.tocken}`
    },
    body: JSON.stringify({
      status: true,
      lat: parseFloat(lat),
      long: parseFloat(long),
      objectName: obj,
    })
  })



  editorstore.telekomEditorNotifications.forEach((notification: any )=> {
    if(notification.objects["object"] === obj && notification.latitude === lat && notification.longitude === long){
      editorstore.telekomEditorNotifications = editorstore.telekomEditorNotifications.filter((item: any) => { return item !== notification})
      
    }
  })

  console.log(editorstore.telekomEditorNotifications)

}


/*

Email Reuqest

async function sendEmail() {
  const fromEmail = "farzad.golzari@telekom.de";
  const toEmail="farzadgolzari@gmail.com"  // E-Mail des Empfängers
  const subject = `Notification for jjdh`;  // Betreff der E-Mail
  const body = `Hello, you have a new notification regarding the project.`;  // Text der E-Mail

  try {
    const response = await fetch('http://localhost:8000/api/v1/email/send_email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${tokenstore.tocken}`,
      },
      body: JSON.stringify({
        from_email: fromEmail,
        to_email: toEmail,
        subject: subject,
        body: body,
      }),
    });

    if (response.ok) {
      alert('E-Mail erfolgreich gesendet');
    } else {
      alert('Fehler beim Senden der E-Mail');
    }
  } catch (error) {
    console.error('Error sending email:', error);
    alert('Fehler beim Senden der E-Mail');
  }
}
*/ 
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
.ulrHover:hover{
  color:#e20074;
  text-decoration: underline;
  cursor: pointer;
}
scale-card::part(base) {
  border-radius: 5px;
}
.table tbody td{
  border-bottom-color: white;
  vertical-align: middle;
  text-align: center;
}
</style>
