import {sensorStore} from '../store/sensorStore.js'
import {publishDeviceCommand,publishDeviceConfig} from '../services/mqttBridge.js'
import {sendSerialCommand} from '../services/serialBridge.js'
export const toggle=(req,res)=>{const enabled=Boolean(req.body.enabled);const state=sensorStore.setIrrigation({enabled,lastRun:enabled?new Date().toISOString():sensorStore.irrigation().lastRun});if(enabled)setTimeout(()=>sensorStore.setIrrigation({enabled:false}),10000);res.json(state)}
export const settings=(req,res)=>{const patch={};if(typeof req.body.automatic==='boolean')patch.automatic=req.body.automatic;if(Number.isFinite(Number(req.body.threshold)))patch.threshold=Math.max(10,Math.min(80,Number(req.body.threshold)));const state=sensorStore.setIrrigation(patch);if(patch.threshold!==undefined)publishDeviceConfig(undefined,{threshold:patch.threshold});res.json(state)}
export const status=(_req,res)=>res.json(sensorStore.irrigation())

// Mode automatique / manuel. La commande part vers l'ESP32 par MQTT (Wi-Fi) ou par le câble USB.
const sendToDevice=command=>publishDeviceCommand(command)||sendSerialCommand(command)
export const setMode=(req,res)=>{const mode=req.body?.mode;if(mode!=='auto'&&mode!=='manual')return res.status(400).json({message:'Mode inconnu : choisissez « auto » ou « manual ».'});const state=sensorStore.setIrrigation({mode});res.json({...state,sent:sendToDevice({cmd:'mode',mode})})}
export const manualPump=(req,res)=>{if(sensorStore.irrigation().mode!=='manual')return res.status(409).json({message:'Passez en mode manuel pour commander la pompe.'});const on=req.body?.on===true;if(!sendToDevice({cmd:'pump',on}))return res.status(503).json({message:'ESP32 injoignable : vérifiez qu’il est connecté.'});res.json({...sensorStore.irrigation(),requested:on?'on':'off'})}
