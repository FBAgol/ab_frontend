<template>
  <body class="body-content">
    <div style="width: 25%; margin: 8.5px 10px 0 0">
      <sidebar @projectData="getProject($event)"></sidebar>
    </div>
    <div style="width: 75%; border-radius: 5px" v-if="projektInfo?.streets?.length">
      <div v-for="(street, index) in projektInfo['streets']" :key="index">
        <div  v-for="(zone, id) in street['coordinates_ZoneId']" :key="id">
          <scale-card label="" show-sort class="" >
          <scale-table  v-for="(material , index) in zone['result_materiallist']" :key="index">
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
              <tbody>
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
                    <p class="ulrHover" @click="openModal()">
                      {{ formatUrlImg() }}
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
        <scale-modal >
          <div style="display: flex; justify-content: center; align-items: center">
            <img alt="image" />
          </div>
        </scale-modal>
    </div>
  </body>
</template>
<script setup lang="ts">
import { ref, nextTick } from 'vue'
import sidebar from '../../components/SideBar.vue'



const projektInfo= ref<any>()

function getProject(data:any){
  console.log(typeof(data))
  projektInfo.value= data

}
// Methode zum Formatieren der Zahl
function formatConfidence(value: number): string {
  return value.toFixed(2) + '%'
}

function formatUrlImg() {

}

// Modal öffnen und Bild-URL setzen
function openModal() {

 return

}

// Modal schließen
function closeModal() {

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
