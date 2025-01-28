<template>
  <body class="body-content">
    <div style="width: 25%; margin: 8.5px 10px 0 0">
      <sidebar @projectData="getProject($event)"></sidebar>
    </div>
    <div style="width: 75%; border-radius: 5px" v-if="projektInfo?.streets?.length">
      <div v-for="(street, index) in projektInfo['streets']" :key="index">
        <div  v-for="(zone, id) in street['coordinates_ZoneId']" :key="id">
          <scale-card label="" show-sort class="" >
          <scale-table>
            <table  >
              <caption>
                {{ projektInfo.city }}, {{ street["street_name"] }}, {{ zone['zone_id'] }}

              </caption>
              <thead>
                <tr>

                  <th tabindex="0" id="gegenstand">Gegenstand</th>
                  <th tabindex="1" id="wahrscheinlichkeit">Wahrscheinlichkeit</th>
                  <th tabindex="2" id="wahrscheinlichkeit">Bild</th>
                </tr>
              </thead>
              <tbody  v-for="(material , index) in zone['result_materiallist']" :key="index">
                <tr>
                  <td>{{ material['object'] }}</td>
                  <td>
                    <scale-progress-bar 
                    :percentage="formatConfidence(material['confidence'])"
                    :label="`${formatConfidence(material['confidence'])}`"
                    :class="getProgressBarClass(material['confidence'])"
                    show-status="true"></scale-progress-bar>
                  </td>
                  <td>
                    <!-- Klickbar p-Tag zum Öffnen des Modals -->
                    <p class="ulrHover" @click="openModal(zone['analysed_image_url'])">
                      {{ formatUrlImg(zone['analysed_image_url']) }}
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </scale-table>
        </scale-card>


        </div>
        
      </div>
        
        <!-- Modal zum Anzeigen des Bildes -->
        <!-- Modal zum Anzeigen des Bildes -->
    <scale-modal :opened="opened" size="large" @scale-close="opened = false">
      <div style="display: flex; justify-content: center; align-items: center">
        <img :src="modalImageUrl" alt="image" />
      </div>
    </scale-modal>
    </div>
  </body>
</template>
<script setup lang="ts">
import { ref, nextTick } from 'vue'
import sidebar from '../../components/SideBar.vue'



const projektInfo= ref<any>()
// Zustand für das Modal
const opened = ref(false)
const modalImageUrl = ref('')

function getProject(data:any){
  console.log(typeof(data))
  projektInfo.value= data

}
// Methode zum Formatieren der Zahl
function formatConfidence(value: number): string {
  return value.toFixed(2) + '%'
}

function formatUrlImg(url: string): string {
  const formatedUrl= url.replace('images/analyse/', '')
  return formatedUrl
}

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
function getProgressBarClass(confidence: number) {
  if (confidence > 70) {
    return 'high-confidence'
  } 
  return 'low-confidence'
}

</script>

<style scoped>
.body-content{
  display: flex;
  flex-direction: row;

}

.high-confidence::part(inner) {
  background: var(--telekom-color-functional-success-standard);
}

.low-confidence::part(inner) {
  background: var(--bar-color);
}

</style>
