import {SerialPort,ReadlineParser} from 'serialport'
import {sensorStore} from '../store/sensorStore.js'

// Puces USB-série utilisées par les cartes ESP32 (CP210x, CH340/CH9102, FTDI, USB natif Espressif).
const ESP_VENDORS=['10c4','1a86','0403','303a']
const BAUD_RATE=115200
const SCAN_INTERVAL_MS=3000

// Transforme une ligne JSON envoyée par le firmware en mesure exploitable. Retourne null si la ligne n'est pas une mesure.
export function parseLine(line){
 const text=String(line).trim()
 if(!text.startsWith('{'))return null
 let data
 try{data=JSON.parse(text)}catch{return null}
 if(data.type!=='reading')return null
 const soilMoisture=Number(data.soilMoisture)
 if(!Number.isFinite(soilMoisture)||soilMoisture<0||soilMoisture>100)return null
 const reading={soilMoisture}
 if(Number.isFinite(Number(data.soilMoistureRaw)))reading.soilMoistureRaw=Number(data.soilMoistureRaw)
 if(typeof data.deviceId==='string')reading.deviceId=data.deviceId.slice(0,50)
 return{reading,pumpOn:data.pump===true,pumpLocked:data.pumpLocked===true,threshold:Number.isFinite(Number(data.threshold))?Number(data.threshold):null}
}

const isEspPort=port=>ESP_VENDORS.includes(String(port.vendorId||'').toLowerCase())||/silicon labs|wch|ftdi|espressif|cp210|ch340|ch910/i.test(`${port.manufacturer||''} ${port.friendlyName||''}`)

// Détecte automatiquement l'ESP32 branché en USB, lit ses mesures et les transmet à l'application.
export function startSerialBridge({portPath=process.env.SERIAL_PORT,log=console,Port=SerialPort,scanInterval=SCAN_INTERVAL_MS}={}){
 let current=null,timer=null,stopped=false,warnedBusy=new Set()
 const scan=async()=>{
  if(stopped||current)return
  try{
   const ports=await Port.list()
   const candidate=portPath?ports.find(p=>p.path.toLowerCase()===portPath.toLowerCase()):ports.find(isEspPort)
   if(candidate)open(candidate.path)
  }catch(error){log.error('[ESP32] Recherche des ports série impossible :',error.message)}
 }
 const open=path=>{
  const port=new Port({path,baudRate:BAUD_RATE,autoOpen:false})
  current=port
  port.open(error=>{
   if(error){current=null;if(!warnedBusy.has(path)){warnedBusy.add(path);log.warn(`[ESP32] Port ${path} indisponible (${error.message}). Fermez le moniteur série ou le téléversement en cours.`)}return}
   warnedBusy.delete(path)
   log.log(`[ESP32] Connecté sur ${path} — lecture des mesures en cours.`)
   sensorStore.setLink({type:'usb',port:path})
   const parser=port.pipe(new ReadlineParser({delimiter:'\n'}))
   parser.on('data',line=>{
    const parsed=parseLine(line)
    if(!parsed){const text=String(line).trim();if(text)log.log(`[ESP32] ${text}`);return}
    sensorStore.add(parsed.reading)
    const irrigation=sensorStore.irrigation()
    sensorStore.setIrrigation({pumpOn:parsed.pumpOn,pumpLocked:parsed.pumpLocked,...(parsed.pumpOn&&!irrigation.pumpOn?{lastRun:new Date().toISOString()}:{})})
    // Garde le seuil de l'ESP32 aligné avec celui de l'application.
    if(parsed.threshold!==null&&parsed.threshold!==irrigation.threshold)port.write(`${JSON.stringify({cmd:'config',threshold:irrigation.threshold})}\n`)
   })
  })
  port.on('close',()=>{if(current===port){current=null;sensorStore.markOffline();sensorStore.setIrrigation({pumpOn:false});log.log(`[ESP32] Déconnecté de ${path}.`)}})
  port.on('error',error=>log.error(`[ESP32] Erreur sur ${path} :`,error.message))
 }
 scan();timer=setInterval(scan,scanInterval)
 return{get port(){return current},stop(){stopped=true;clearInterval(timer);if(current?.isOpen)current.close()}}
}
