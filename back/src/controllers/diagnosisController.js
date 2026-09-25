import {diagnosePlant} from '../services/plantDiagnosisService.js'
export async function analyze(req,res,next){try{if(!req.file)return res.status(400).json({message:'Une image est requise.'});const result=await diagnosePlant(req.file.buffer);res.json({...result,file:{name:req.file.originalname,size:req.file.size}})}catch(error){next(error)}}
