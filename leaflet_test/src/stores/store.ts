import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

interface FormData {
  name: string
  firmenname: string
  projektname: string
  dateiInhalt: JSON[]
}

interface Data {
  fid: number
  city: string
  street: string
  locationname: string
  nessesaryMaterials?: Array<string | null>
  latlong: number[]
}

export const mainStore = defineStore('store', () => {
  const formContents = ref<FormData | null>(null)
  const transformedData = ref<Data[]>([])

 
  watch(formContents, (newVal) => {
    if (newVal?.dateiInhalt) {
      transformedData.value = newVal.dateiInhalt.map((ob: { [key: string]: any }) => {
        return {
          fid: ob.fid,
          city: ob.city,
          street: ob.street,
          locationname: ob.locationname,
          nessesaryMaterials: [],
          latlong: [parseFloat(ob.latitude), parseFloat(ob.longitude)],
        }
      });
     // console.log("Transformierte Daten:", transformedData);
    }
  });


  return { formContents, transformedData }
})
