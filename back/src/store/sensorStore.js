const initial={soilMoisture:null,soilMoistureRaw:null,createdAt:null}
class SensorStore{#readings=[initial];#lastDeviceSeen=null;#deviceId=null;#link=null;#irrigation={required:false,threshold:35,simulation:true,lastDecisionAt:null,pumpOn:false,lastRun:null};add(reading){const item={...this.latest(),...reading,createdAt:new Date().toISOString()};this.#lastDeviceSeen=Date.now();this.#deviceId=reading.deviceId||this.#deviceId||'ESP32';const required=item.soilMoisture<this.#irrigation.threshold;this.#irrigation={...this.#irrigation,required,lastDecisionAt:item.createdAt};this.#readings.push(item);if(this.#readings.length>500)this.#readings.shift();return item}latest(){return this.#readings.at(-1)}history(limit=24){return this.#readings.filter(r=>r.createdAt).slice(-limit)}device(){const age=this.#lastDeviceSeen?Date.now()-this.#lastDeviceSeen:null;return{id:this.#deviceId||'ESP32-PARCELLE-01',online:age!==null&&age<75000,lastSeen:this.#lastDeviceSeen?new Date(this.#lastDeviceSeen).toISOString():null,ageSeconds:age===null?null:Math.floor(age/1000),timeoutSeconds:75,link:this.#link}}
 // Liaison active avec l'ESP32 (ex. {type:'usb',port:'COM5'}), renseignée par le pont série.
 setLink(link){this.#link=link}
 // Appelé quand le câble USB est débranché : l'appareil passe hors ligne immédiatement.
 markOffline(){this.#lastDeviceSeen=null;this.#link=null}
 irrigation(){return this.#irrigation}setIrrigation(patch){this.#irrigation={...this.#irrigation,...patch};return this.#irrigation}}
export const sensorStore=new SensorStore()
