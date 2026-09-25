import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import routes from './routes/index.js'
import {env} from './config/env.js'
export const app=express();app.use(helmet());app.use(cors({origin:env.frontendUrl}));app.use(express.json({limit:'20kb'}));app.use(morgan('dev'));app.use('/api',routes);app.use((_req,res)=>res.status(404).json({message:'Route introuvable'}));app.use((err,_req,res,_next)=>{console.error(err);const aiUnavailable=err.message?.startsWith('Service YOLO');res.status(aiUnavailable?503:500).json({message:aiUnavailable?err.message:'Erreur interne du serveur'})})
