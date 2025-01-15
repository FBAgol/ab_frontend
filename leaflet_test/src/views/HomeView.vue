  <template>

    <body class="body_content">
      <div style="width: 25%">
        <sidebar @projectData="getData($event)"></sidebar>
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
  import { ref, onMounted, watch, toRaw } from 'vue'
  import sidebar from '../components/SideBar.vue'
  import 'leaflet/dist/leaflet.css'
  import * as L from 'leaflet'
  import { mainStore } from '@/stores/store'


  const store = mainStore()
  

  const initialMap = ref<L.Map | undefined>()
  const markers = ref<{ [key: string]: L.Marker }>({})
  const openCamera = ref(false)
  const videoStream = ref<HTMLVideoElement | null>(null)
  const currentMarkerIndex = ref<string | null>(null)
  const isMobileDevice = ref(false)
  const d = ref<any>()

  const projectInfo= ref<any>()

  function getData(data: any) {
    projectInfo.value = data
  }

  watch(projectInfo, (newData) => {
    const data = JSON.parse(JSON.stringify(newData))
    console.log('newData:', newData)
    console.log('streets:', newData["streets"])
    d.value= newData["streets"]
  })

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

  const createMarkers = (data:any) => {
    
    Object.values(markers.value).forEach((marker) => initialMap.value?.removeLayer(marker as unknown as L.Layer))
    markers.value = {}

    projectInfo.value["streets"].forEach((street:any) => {
      street["coordinates_ZoneId"].forEach((s:any)=>{
       // console.log('type:', typeof parseFloat(s["longitude"]))
        const marker = L.marker([parseFloat(s["latitude"]), parseFloat(s["longitude"])])
        .addTo(initialMap.value!)
        .bindPopup(getPopupContent(s["zone_id"]), { maxWidth: undefined })
        .on('popupopen', () => setupPopupEvents(s["zone_id"]))
      markers.value[s["zone_id"]] = marker

      })
      
    })

    Object.values(markers.value).forEach(marker => {
  const latLng = marker.getLatLng();
  console.log('Marker Koordinaten:', latLng);
});


    if (Object.keys(markers.value).length > 0) {
      const layers = Object.values(markers.value).map(marker => toRaw(marker));
      const group = L.featureGroup(layers as unknown as L.Layer[])
      initialMap.value?.fitBounds(group.getBounds())
    }
  }

  watch(projectInfo, (newData) => {
    createMarkers(newData)
  })

  const getPopupContent = (zoneId: string ): string => {
    const uploadButton = `<button id="upload${zoneId}Photo" style="background:none; border:none;">
        <img src="../../public/upload-bold-arrow-icon.svg" alt="upload" height="20" width="20">
      </button>
      `

    const cameraButton = isMobileDevice.value
      ? `<button id="open${zoneId}Camera" style="background:none; border:none;">
          <img src="../../public/vecteezy_camera-icon-simple-design-in-white-background_18932615.svg" alt="camera" height="25" width="25">
        </button>`
      : ''
    const infoMarker = `
  <div style="display: flex; flex-direction: column; align-items: flex-start;">
      <p>FID: ${zoneId}</p>
      <p>Stadt: ${projectInfo.value["city"]}</p>
      <p>Straße: </p>
      <p>Location:</p>
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

  const setupPopupEvents = (zoneId: string) => {
    const uploadButton = document.getElementById(`upload${zoneId}Photo`)
    const cameraButton = document.getElementById(`open${zoneId}Camera`)
    const deleteButton = document.getElementById(`delete${zoneId}Photo`)

    // Event-Listener für Upload-Button
    if (uploadButton) {
      uploadButton.addEventListener('click', () => handlePhotoUpload(zoneId))
    }

    // Event-Listener für Kamera-Button
    if (cameraButton) {
      cameraButton.addEventListener('click', () => openCameraHandler(zoneId))
    }

    // Event-Listener für Lösch-Button (wird nach Foto-Upload hinzugefügt)
    if (deleteButton) {
      deleteButton.addEventListener('click', () => removeImage(zoneId))
    }
  }

  const openCameraHandler = (zoneId: string) => {
    currentMarkerIndex.value = zoneId
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

  const handlePhotoUpload = (zoneId: string) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'

    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement)?.files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const uploadedImage = e.target?.result as string
          updateMarkerPopup(zoneId, uploadedImage)
        }
        reader.readAsDataURL(file)
      }
    }

    input.click()
  }

  const updateMarkerPopup = (zoneId: string, image: string) => {
    const content = `
      <div>
        <img src="${image}" alt="Bild" style="width:100%; height:auto;">
        <button id="delete${zoneId}Photo" style="display:block; margin-top:10px;">Bild löschen</button>
      </div>
      <div style="display: flex; flex-direction: column; align-items: flex-start;">
      <p>FID: ${zoneId}</p>
      <p>Stadt: ${projectInfo.value["city"]}</p>
      <p>Straße: </p>
      <p>Location: </p>
      <p>Bedarf Materail: 1.2.2.2.</p>
  </div>

    `

    const marker = markers.value[zoneId]
    marker.setPopupContent(content).openPopup()

    // Event-Listener für den Delete-Button setzen
    setupPopupEvents(zoneId)
  }

  const removeImage = (zoneId: string) => {
    // Entfernen des Bildes und des Delete-Buttons
    const marker = markers.value[zoneId]
    marker.setPopupContent(getPopupContent(zoneId)) // Reset des Popups auf den ursprünglichen Inhalt
    marker.openPopup()

    // Alle Events werden beim Reset ebenfalls zurückgesetzt
    setupPopupEvents(zoneId)
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
