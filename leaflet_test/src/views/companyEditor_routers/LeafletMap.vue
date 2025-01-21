<template>
  <body class="body_content">
    <div style="width: 25%; margin: 8.5px 10px 0 0">
      <sidebar @projectData="getData($event)"></sidebar>
    </div>
    <div style="width: 75%; border-radius: 5px">
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
import sidebar from '../../components/SideBar.vue'
import 'leaflet/dist/leaflet.css'
import * as L from 'leaflet'
import { mainStore } from '@/stores/store'
import { tokenStore } from '@/stores/tockenStorage'
import type { updateImg  } from '@/interfaces/interface'


const store = mainStore()
const token = tokenStore()

const initialMap = ref<L.Map | undefined>()
const markers = ref<{ [key: string]: L.Marker }>({})
const openCamera = ref(false)
const videoStream = ref<HTMLVideoElement | null>(null)
const currentMarkerIndex = ref<string | null>(null)
const isMobileDevice = ref(false)
const d = ref<any>()

const projectInfo = ref<any>()
const updateImage= ref<updateImg>({
  oldOrginalImgUrl:'',
  oldAnalysedImgUrl:''
})

function getData(data: any) {
  projectInfo.value = data
}

watch(projectInfo, (newData) => {
  const data = JSON.parse(JSON.stringify(newData))
  //console.log('newData:', newData)
  //console.log('streets:', newData["streets"])
  d.value = newData['streets']
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

const createMarkers = (data: { [key: string]: any }) => {
  Object.values(markers.value).forEach((marker) =>
    initialMap.value?.removeLayer(marker as unknown as L.Layer),
  )
  markers.value = {}

  projectInfo.value['streets'].forEach((street: { [key: string]: any }) => {
    street['coordinates_ZoneId'].forEach((s: { [key: string]: any }) => {
      if (s['original_image_url']) {
        updateImage.value.oldAnalysedImgUrl = s['analysed_image_url']
        updateImage.value.oldOrginalImgUrl = s['original_image_url']
      }
      const zoneId = s['zone_id'] ? String(s['zone_id']) : 'Unbekannte Zone';
      // console.log('type:', typeof parseFloat(s["longitude"]))
      const marker = L.marker([parseFloat(s['latitude']), parseFloat(s['longitude'])])
        .addTo(initialMap.value!)
        .bindPopup(getPopupContent(s['zone_id'], street['street_name'], s['target_material'], s["original_image_url"]), {
          maxWidth: undefined,
        })
        .bindTooltip(zoneId, {
          permanent: true, // Tooltip bleibt dauerhaft sichtbar
          direction: 'top', // Position des Tooltips relativ zum Marker
          offset: [0, -10], // Offset für die Position des Tooltips
        })
        .on('popupopen', () => setupPopupEvents(s['zone_id'], updateImage.value))
      markers.value[s['zone_id']] = marker
    })
  })

  Object.values(markers.value).forEach((marker) => {
    const latLng = marker.getLatLng()
    // console.log('Marker Koordinaten:', latLng);
  })

  if (Object.keys(markers.value).length > 0) {
    const layers = Object.values(markers.value).map((marker) => toRaw(marker))
    const group = L.featureGroup(layers as unknown as L.Layer[])
    initialMap.value?.fitBounds(group.getBounds())
  }
}

watch(projectInfo, (newData) => {
  createMarkers(newData)
})

const getPopupContent = (
  zoneId: string,
  street?: string,
  target_material?: string | null,
  imgPath?: string,
): string => {
  const availableImg = `<img src="http://localhost:8000/${imgPath}" id="availableImg${zoneId}" alt="Bild" style="width:100%; height:auto;">`
  const pcCamera = `<scale-icon-device-photo-camera accessibility-title="photo-camera" id="upload${zoneId}Photo" style="cursor:pointer;" />
      `

  const phoneCamera = isMobileDevice.value
    ? `<scale-icon-device-device-phone accessibility-title="device-phone" id="open${zoneId}Camera" style="cursor:pointer;" />`
    : ''
  const infoMarker = `
  <div style="display: flex; flex-direction: column; align-items: flex-start;">
      <p>FID: ${zoneId}</p>
      <p>Stadt: ${projectInfo.value['city']}</p>
      <p>Straße: ${street} </p>
      <p>Location:</p>
      <p>Bedard Materail: ${target_material}</p>
  </div>`

  if (imgPath) {
    return `
      <div class="avaolableImgBox">
        ${availableImg}
        <scale-button id="updateImg${zoneId}" style="margin-top:10px;">Update</scale-button>
      </div>
      ${infoMarker}
    `
  }

  return `
      <div>
        ${pcCamera}
        ${phoneCamera}
      </div>
      ${infoMarker}
    `
}

const setupPopupEvents = (zoneId: string, imgInfo?: updateImg) => {
  const pcCameraIcon = document.getElementById(`upload${zoneId}Photo`)
  const phoneCameraIcon = document.getElementById(`open${zoneId}Camera`)
  const deleteButton = document.getElementById(`delete${zoneId}Photo`)
  const saveImgButton = document.getElementById(`save${zoneId}`)
  const updateImgButton = document.getElementById(`updateImg${zoneId}`)

  // Event-Listener für Upload-Button (nur Datei-Upload öffnen)
  if (pcCameraIcon) {
    pcCameraIcon.addEventListener('click', (event) => {
      event.stopPropagation() // Verhindert unerwünschte Propagation
      handlePhotoUpload(zoneId)
    })
  }

  // Event-Listener für Kamera-Button (nur Kamera öffnen)
  if (phoneCameraIcon) {
    phoneCameraIcon.addEventListener('click', (event) => {
      event.stopPropagation() // Verhindert unerwünschte Propagation
      openCameraHandler(zoneId)
    })
  }

  // Event-Listener für Lösch-Button (nur Bild löschen)
  if (deleteButton) {
    deleteButton.addEventListener('click', (event) => {
      event.stopPropagation() // Verhindert unerwünschte Propagation
      removeImage(zoneId)
    })
  }

  if (saveImgButton) {
    saveImgButton.addEventListener('click', (event) => {
      event.stopPropagation() // Verhindert unerwünschte Propagation
      saveImage(zoneId)
    })
  }

  if(updateImgButton && imgInfo){
    updateImgButton.addEventListener('click', (event) => {
      event.stopPropagation() // Verhindert unerwünschte Propagation
      updateImgHandler(zoneId, imgInfo)
    })
  }
}

const updateImgHandler = async (zoneId: string, imgInfo: updateImg) => {
  document.querySelector('.avaolableImgBox')?.remove(); // Entfernt das alte Bild
  
  // Lösche das Bild in der Datenbank
  await fetch('http://localhost:8000/api/v1/companyeditor/update/img_coordinate', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token.tocken,
    },
    body: JSON.stringify({
      oldOriginalImgUrl: imgInfo.oldOrginalImgUrl,
      oldAnalyzedImgUrl: imgInfo.oldAnalysedImgUrl,
    }),
  });

  // Aktualisiere den Popup-Inhalt mit `getPopupContent`
  const marker = markers.value[zoneId];
  if (marker) {
    const updatedContent = getPopupContent(zoneId); // Generiere neuen Popup-Inhalt
    marker.setPopupContent(updatedContent).openPopup(); // Setze neuen Inhalt und öffne das Popup
    setupPopupEvents(zoneId); // Setze die Events neu, damit Icons wie pcCameraIcon funktionieren
  }
};

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

const updateMarkerPopupAfterSave = (zoneId: string, analysedImageUrl: string, originalImageUrl: string) => {
  const zone_info: { target_material?: string[] } = {};
  const street = projectInfo.value['streets'].find((street: { [key: string]: any }) => {
    return street['coordinates_ZoneId'].some((s: { [key: string]: any }) => s['zone_id'] === zoneId);
  });

  if (street) {
    street['coordinates_ZoneId'].forEach((s: { [key: string]: any }) => {
      if (s['zone_id'] === zoneId) {
        zone_info['target_material'] = s['target_material'];
      }
    });
  }

  // Popup-Inhalt mit neuem Bild und Update-Schaltfläche
  const content = `
    <div class="avaolableImgBox">
      <img src="http://localhost:8000/${analysedImageUrl}" id="availableImg${zoneId}" alt="Bild" style="width:100%; height:auto;">
      <scale-button id="updateImg${zoneId}" style="margin-top:10px;">Update</scale-button>
    </div>
    <div style="display: flex; flex-direction: column; align-items: flex-start;">
      <p>FID: ${zoneId}</p>
      <p>Stadt: ${projectInfo.value['city']}</p>
      <p>Straße: ${street ? street['street_name'] : 'Unbekannt'}</p>
      <p>Location: </p>
      <p>Bedarf Material: ${zone_info['target_material']}</p>
    </div>
  `;

  const marker = markers.value[zoneId];
  if (marker) {
    marker.setPopupContent(content).openPopup();
    setupPopupEvents(zoneId, { oldOrginalImgUrl: originalImageUrl, oldAnalysedImgUrl: analysedImageUrl });
  }
};


async function saveImage(zoneId: string) {
  const imgElement = document.getElementById(`uploaded${zoneId}`) as HTMLImageElement;

  if (!imgElement) {
    console.error('Kein Bild gefunden.');
    return;
  }

  const zone_info: { lat?: number; long?: number } = {};
  const street = projectInfo.value['streets'].find((street: { [key: string]: any }) =>
    street['coordinates_ZoneId'].some((s: { [key: string]: any }) => s['zone_id'] === zoneId),
  );

  if (street) {
    street['coordinates_ZoneId'].forEach((s: { [key: string]: any }) => {
      if (s['zone_id'] === zoneId) {
        zone_info['lat'] = s['latitude'];
        zone_info['long'] = s['longitude'];
      }
    });
  }

  // Hole die Base64-Daten aus dem Bild
  const base64Data = imgElement.src;

  // Konvertiere Base64 zu einer Datei
  const blob = await fetch(base64Data).then((res) => res.blob());
  const file = new File([blob], `${zoneId}.png`, { type: 'image/png' });

  // Erstelle FormData für den API-Aufruf
  const formData = new FormData();

  // Füge das JSON-String-Format von `upload_img_request` hinzu
  const uploadImgRequest = {
    lat: zone_info.lat,
    long: zone_info.long,
  };
  formData.append('upload_img_request', JSON.stringify(uploadImgRequest));

  // Füge die Datei hinzu
  formData.append('file', file);

  try {
    const response = await fetch('http://localhost:8000/api/v1/companyeditor/upload/img', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.tocken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      throw new Error(`Fehler beim Speichern: ${errorDetails.detail}`);
    }

    const result = await response.json();

    // Aktualisiere den Marker-Popup-Inhalt mit der Bild-URL und füge die Update-Schaltfläche hinzu
    updateMarkerPopupAfterSave(zoneId, result.analysed_image_url, result.original_image_url);

    console.log('Bild erfolgreich gespeichert:', result);
  } catch (error) {
    console.error('Fehler beim Speichern des Bildes:', error);
    alert('Bild konnte nicht gespeichert werden.');
  }
}


function hideScaleButtonBase(scaleButtonId: string) {
  // Suche das Scale-Button-Element anhand der ID
  const scaleButton = document.getElementById(scaleButtonId) as HTMLElement

  if (!scaleButton) {
    console.error(`Kein Scale-Button mit der ID ${scaleButtonId} gefunden.`)
    return
  }

  // Überprüfen, ob das Element ein Shadow DOM hat
  if (scaleButton.shadowRoot) {
    // Rekursive Funktion, um den gesamten Shadow DOM-Baum zu durchsuchen
    function findButtonInShadow(root: ShadowRoot | HTMLElement): HTMLElement | null {
      // Suche nach dem Button innerhalb des Shadow DOM
      const button = root.querySelector('button[part="base variant-primary before"]')
      if (button) {
        return button as HTMLElement
      }

      // Falls wir noch nicht fündig geworden sind, überprüfen wir, ob es noch verschachtelte Shadow Roots gibt
      const shadowHosts = root.querySelectorAll<HTMLElement>('[shadowroot]')
      for (let shadowHost of shadowHosts) {
        if (shadowHost.shadowRoot) {
          const foundButton = findButtonInShadow(shadowHost.shadowRoot)
          if (foundButton) return foundButton
        }
      }

      return null
    }

    // Versuche, den Button im Shadow DOM zu finden
    const baseButton = findButtonInShadow(scaleButton.shadowRoot)
    if (baseButton) {
      // Wende den Style an, um das Element auszublenden
      baseButton.style.display = 'none'
      console.log('Das Button-Element mit part="base variant-primary before" wurde ausgeblendet.')
    } else {
      console.error(
        'Kein Button-Element mit part="base variant-primary before" im Shadow DOM gefunden.',
      )
    }
  } else {
    console.error(`Das Element ${scaleButtonId} hat kein Shadow DOM.`)
  }
}

const updateMarkerPopup = (zoneId: string, image: string) => {
  const zone_info: { target_material?: string[] } = {}
  const street = projectInfo.value['streets'].find((street: { [key: string]: any }) => {
    return street['coordinates_ZoneId'].some((s: { [key: string]: any }) => s['zone_id'] === zoneId)
  })

  if (street) {
    street['coordinates_ZoneId'].forEach((s: { [key: string]: any }) => {
      if (s['zone_id'] === zoneId) {
        zone_info['target_material'] = s['target_material']
      }
    })
  }

  // Erstelle den neuen Popup-Inhalt mit Bild und ursprünglichen Informationen
  const content = `
    <div>
      <img src="${image}" id="uploaded${zoneId}" alt="Bild" style="width:100%; height:auto;">
      <scale-button id="delete${zoneId}Photo" style="margin-top:10px;">Bild Löschen</scale-button>
      <scale-button id="save${zoneId}" style="margin-top:10px;">Speichern</scale-button>
    </div>
    <div style="display: flex; flex-direction: column; align-items: flex-start;">
      <p>FID: ${zoneId}</p>
      <p>Stadt: ${projectInfo.value['city']}</p>
      <p>Straße: ${street ? street['street_name'] : 'Unbekannt'}</p>
      <p>Location: </p>
      <p>Bedarf Material: ${zone_info['target_material']}</p>
    </div>
  `

  // Aktualisiere den Popup-Inhalt des Markers
  const marker = markers.value[zoneId]
  if (marker) {
    marker.setPopupContent(content).openPopup()
  }

  // Setze die Events erneut, um sicherzustellen, dass die Buttons und Icons funktionieren
  setupPopupEvents(zoneId)
}

const removeImage = (zoneId: string) => {
  const marker = markers.value[zoneId]

  if (!marker) return

  // Hole den aktuellen Popup-Inhalt
  const popupContent = marker.getPopup()?.getContent()

  if (typeof popupContent === 'string') {
    // Entferne nur das Bild und den Delete-Button aus dem HTML
    const parser = new DOMParser()
    const doc = parser.parseFromString(popupContent, 'text/html')

    // Entferne das Bild und den Delete-Button
    const img = doc.querySelector('img')
    const deleteButton = doc.querySelector(`#delete${zoneId}Photo`)
    const saveButton = doc.querySelector(`#save${zoneId}`)
    if (img) img.remove()
    if (deleteButton) deleteButton.remove()
    if (saveButton) saveButton.remove()

    // Ergänze die ursprünglichen Kamera- und Upload-Icons
    const pcCamera = `
      <scale-icon-device-photo-camera accessibility-title="photo-camera" id="upload${zoneId}Photo" style="cursor:pointer; " />
    `
    const phoneCamera = isMobileDevice.value
      ? `<scale-icon-device-device-phone accessibility-title="device-phone" id="open${zoneId}Camera" style="cursor:pointer; " />`
      : ''
    const updatedIcons = `
      <div>
        ${pcCamera}
        ${phoneCamera}
      </div>
    `

    // Füge die ursprünglichen Icons wieder hinzu
    const infoSection = doc.body.querySelector('div')
    if (infoSection) {
      infoSection.insertAdjacentHTML('afterbegin', updatedIcons)
    }

    // Aktualisiere den Marker mit dem geänderten Inhalt
    const newContent = doc.body.innerHTML
    marker.setPopupContent(newContent).openPopup()

    // Setze die Events erneut, um sicherzustellen, dass die Buttons und Icons funktionieren
    setupPopupEvents(zoneId)
  }
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

.hidden {
  display: none !important;
}

.show {
  display: block;
}

.no-scroll {
  overflow: hidden;
}
</style>
