import {sensorStore} from '../store/sensorStore.js'
export const getLatest=(_req,res)=>res.json(sensorStore.latest())
export const getHistory=(req,res)=>res.json(sensorStore.history(Math.min(Number(req.query.limit)||24,100)))
export const addReading=(req,res)=>{const soilMoisture=Number(req.body.soilMoisture);if(!Number.isFinite(soilMoisture)||soilMoisture<0||soilMoisture>100)return res.status(400).json({message:'soilMoisture doit être compris entre 0 et 100.'});const reading={soilMoisture};if(Number.isFinite(Number(req.body.soilMoistureRaw)))reading.soilMoistureRaw=Number(req.body.soilMoistureRaw);if(typeof req.body.deviceId==='string')reading.deviceId=req.body.deviceId.slice(0,50);res.status(201).json(sensorStore.add(reading))}
