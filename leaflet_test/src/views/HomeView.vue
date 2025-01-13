<template>

  <body class="body_content">
    <div style="width: 25%">
      <sidebar></sidebar>
    </div>
    <div style="width: 75%">
      <div id="map" style="height: 90vh; margin-top: 10px"></div>
      <div v-if="openCamera" class="camera-modal">
        <video ref="videoStream" autoplay></video>
        <button @click="takePhoto">Foto aufnehmen</button>
        <button @click="closeCamera">Abbrechen</button>
      </div>
    </div>

  </body>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import sidebar from '../components/SideBar.vue'
import 'leaflet/dist/leaflet.css'
import * as L from 'leaflet'
import { mainStore } from '@/stores/store'
import { storeToRefs } from 'pinia'

const store = mainStore()
const { transformedData } = storeToRefs(store)

const initialMap = ref<L.Map | undefined>()
const markers = ref<L.Marker[]>([])
const openCamera = ref(false)
const videoStream = ref<HTMLVideoElement | null>(null)
const currentMarkerIndex = ref<number | null>(null)
const isMobileDevice = ref(false)

onMounted(() => {
  checkDeviceType()
  window.addEventListener('resize', checkDeviceType)

  initialMap.value = L.map('map').setView([50.73438, 7.09549], 16)
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(initialMap.value)
})

const checkDeviceType = () => {
  isMobileDevice.value = window.innerWidth <= 768
}

const createMarkers = () => {
  markers.value.forEach((marker) => initialMap.value?.removeLayer(marker as unknown as L.Layer))
  markers.value = []

  transformedData.value.forEach((cord, index) => {
    const marker = L.marker([cord.latlong[0], cord.latlong[1]])
      .addTo(initialMap.value!)
      .bindPopup(getPopupContent(index), { maxWidth: undefined })
      .on('popupopen', () => setupPopupEvents(index))
    markers.value.push(marker)
  })

  if (markers.value.length > 0) {
    const group = L.featureGroup(markers.value as unknown as L.Layer[])
    initialMap.value?.fitBounds(group.getBounds())
  }
}

watch(transformedData, createMarkers, { immediate: true })

const getPopupContent = (index: number): string => {
  const uploadButton = `<button id="upload${index}Photo" style="background:none; border:none;">
      <img src="../../public/upload-bold-arrow-icon.svg" alt="upload" height="20" width="20">
    </button>
    `

  const cameraButton = isMobileDevice.value
    ? `<button id="open${index}Camera" style="background:none; border:none;">
        <img src="../../public/vecteezy_camera-icon-simple-design-in-white-background_18932615.svg" alt="camera" height="25" width="25">
      </button>`
    : ''
  const infoMarker = `
<div style="display: flex; flex-direction: column; align-items: flex-start;">
    <p>FID: ${transformedData.value[index].fid}</p>
    <p>Stadt: ${transformedData.value[index].city}</p>
    <p>Straße: ${transformedData.value[index].street}</p>
    <p>Location: ${transformedData.value[index].locationname}</p>
    <p>Bedard Materail: 1.2.2.2.</p>
</div>`

  return `
    <div>
      ${uploadButton}
      ${cameraButton}
    </div>
    ${infoMarker}
  `
}

const setupPopupEvents = (index: number) => {
  const uploadButton = document.getElementById(`upload${index}Photo`)
  const cameraButton = document.getElementById(`open${index}Camera`)
  const deleteButton = document.getElementById(`delete${index}Photo`)

  // Event-Listener für Upload-Button
  if (uploadButton) {
    uploadButton.addEventListener('click', () => handlePhotoUpload(index))
  }

  // Event-Listener für Kamera-Button
  if (cameraButton) {
    cameraButton.addEventListener('click', () => openCameraHandler(index))
  }

  // Event-Listener für Lösch-Button (wird nach Foto-Upload hinzugefügt)
  if (deleteButton) {
    deleteButton.addEventListener('click', () => removeImage(index))
  }
}

const openCameraHandler = (index: number) => {
  currentMarkerIndex.value = index
  openCamera.value = true
  startCamera()
}

const startCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true })
    if (videoStream.value) {
      videoStream.value.srcObject = stream
    }
  } catch (error) {
    console.error('Kamera konnte nicht gestartet werden:', error)
    alert('Kamera konnte nicht gestartet werden.')
    openCamera.value = false
  }
}

const takePhoto = () => {
  const video = videoStream.value
  if (!video || currentMarkerIndex.value === null) return

  const canvas = document.createElement('canvas')
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  const context = canvas.getContext('2d')

  if (context) {
    context.drawImage(video, 0, 0, canvas.width, canvas.height)
    const photo = canvas.toDataURL('image/png')

    updateMarkerPopup(currentMarkerIndex.value, photo)
    closeCamera()
  }
}

const handlePhotoUpload = (index: number) => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'

  input.onchange = (event) => {
    const file = (event.target as HTMLInputElement)?.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const uploadedImage = e.target?.result as string
        updateMarkerPopup(index, uploadedImage)
      }
      reader.readAsDataURL(file)
    }
  }

  input.click()
}

const updateMarkerPopup = (index: number, image: string) => {
  const content = `
    <div>
      <img src="${image}" alt="Bild" style="width:100%; height:auto;">
      <button id="delete${index}Photo" style="display:block; margin-top:10px;">Bild löschen</button>
    </div>
    <div style="display: flex; flex-direction: column; align-items: flex-start;">
    <p>FID: ${transformedData.value[index].fid}</p>
    <p>Stadt: ${transformedData.value[index].city}</p>
    <p>Straße: ${transformedData.value[index].street}</p>
    <p>Location: ${transformedData.value[index].locationname}</p>
    <p>Bedard Materail: 1.2.2.2.</p>
</div>

  `

  const marker = markers.value[index]
  marker.setPopupContent(content).openPopup()

  // Event-Listener für den Delete-Button setzen
  setupPopupEvents(index)
}

const removeImage = (index: number) => {
  // Entfernen des Bildes und des Delete-Buttons
  const marker = markers.value[index]
  marker.setPopupContent(getPopupContent(index)) // Reset des Popups auf den ursprünglichen Inhalt
  marker.openPopup()

  // Alle Events werden beim Reset ebenfalls zurückgesetzt
  setupPopupEvents(index)
}

const closeCamera = () => {
  openCamera.value = false
  const video = videoStream.value
  if (video && video.srcObject) {
    const tracks = (video.srcObject as MediaStream).getTracks()
    tracks.forEach((track) => track.stop())
    video.srcObject = null
  }
}
</script>

<style scoped>
.body_content {
  display: flex;
  flex-direction: row;
}

.camera-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.camera-modal video {
  width: 80%;
  max-width: 500px;
  border: 2px solid white;
}

.camera-modal button {
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.camera-modal button:hover {
  background-color: #0056b3;
}
</style>
