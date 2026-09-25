import {sensorStore} from '../store/sensorStore.js'
export const toggle=(req,res)=>{const enabled=Boolean(req.body.enabled);const state=sensorStore.setIrrigation({enabled,lastRun:enabled?new Date().toISOString():sensorStore.irrigation().lastRun});if(enabled)setTimeout(()=>sensorStore.setIrrigation({enabled:false}),10000);res.json(state)}
export const settings=(req,res)=>{const patch={};if(typeof req.body.automatic==='boolean')patch.automatic=req.body.automatic;if(Number.isFinite(Number(req.body.threshold)))patch.threshold=Math.max(10,Math.min(80,Number(req.body.threshold)));res.json(sensorStore.setIrrigation(patch))}
export const status=(_req,res)=>res.json(sensorStore.irrigation())
