import test from 'node:test'
import assert from 'node:assert/strict'
import {parseLine,startSerialBridge} from '../src/services/serialBridge.js'
import {sensorStore} from '../src/store/sensorStore.js'
import {app} from '../src/app.js'

test('parseLine lit une mesure envoyée par l’ESP32',()=>{const parsed=parseLine('{"type":"reading","deviceId":"ESP32-PARCELLE-01","soilMoisture":42,"soilMoistureRaw":2500,"pump":true,"pumpLocked":false,"threshold":35}\r');assert.deepEqual(parsed,{reading:{soilMoisture:42,soilMoistureRaw:2500,deviceId:'ESP32-PARCELLE-01'},pumpOn:true,pumpLocked:false,threshold:35})})
test('parseLine ignore les messages texte et les valeurs invalides',()=>{assert.equal(parseLine('Pompe en marche (humidité 30% < seuil 35%).'),null);assert.equal(parseLine('{"type":"reading","soilMoisture":140}'),null);assert.equal(parseLine('{"type":"reading"'),null)})
test('le débranchement USB passe l’appareil hors ligne immédiatement',()=>{sensorStore.add({soilMoisture:50,deviceId:'ESP32-TEST'});sensorStore.setLink({type:'usb',port:'COM7'});assert.equal(sensorStore.device().online,true);assert.deepEqual(sensorStore.device().link,{type:'usb',port:'COM7'});sensorStore.markOffline();assert.equal(sensorStore.device().online,false);assert.equal(sensorStore.device().link,null)})
test('CORS autorise l’application sur un autre port localhost',async()=>{const server=app.listen(0);const port=server.address().port;const response=await fetch(`http://localhost:${port}/api/health`,{headers:{Origin:'http://localhost:5174'}});assert.equal(response.headers.get('access-control-allow-origin'),'http://localhost:5174');const other=await fetch(`http://localhost:${port}/api/health`,{headers:{Origin:'http://exemple.com'}});assert.equal(other.headers.get('access-control-allow-origin'),null);server.close()})
test('le pont série détecte l’ESP32, transmet les mesures, l’état de la pompe et synchronise le seuil',async()=>{
 const {SerialPortMock}=await import('serialport')
 SerialPortMock.binding.reset();SerialPortMock.binding.createPort('COM9',{record:true,vendorId:'10c4',manufacturer:'Silicon Labs'})
 const logs=[],bridge=startSerialBridge({Port:SerialPortMock,scanInterval:20,log:{log:m=>logs.push(m),warn:m=>logs.push(m),error:m=>logs.push(m)}})
 const wait=ms=>new Promise(r=>setTimeout(r,ms))
 for(let i=0;i<50&&!bridge.port?.isOpen;i++)await wait(20)
 assert.ok(bridge.port?.isOpen,'port ouvert automatiquement')
 bridge.port.port.emitData('Voly ESP32 prêt\n{"type":"reading","deviceId":"ESP32-USB","soilMoisture":28,"soilMoistureRaw":2900,"pump":true,"pumpLocked":false,"threshold":40}\n')
 await wait(80)
 assert.equal(sensorStore.latest().soilMoisture,28);assert.equal(sensorStore.device().online,true);assert.deepEqual(sensorStore.device().link,{type:'usb',port:'COM9'})
 assert.equal(sensorStore.irrigation().pumpOn,true);assert.ok(sensorStore.irrigation().lastRun)
 assert.match(bridge.port.port.recording.toString(),/"cmd":"config","threshold":35/,'seuil de l’application renvoyé à l’ESP32')
 assert.ok(logs.some(l=>String(l).includes('Voly ESP32 prêt')))
 bridge.port.close();await wait(80)
 assert.equal(sensorStore.device().online,false);assert.equal(sensorStore.irrigation().pumpOn,false)
 bridge.stop()
})
