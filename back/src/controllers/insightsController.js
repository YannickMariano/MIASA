import {getAgriculturalWeather} from '../services/weatherService.js'
import {getMarketInsights} from '../services/marketService.js'
export async function weather(req,res,next){try{res.json(await getAgriculturalWeather(req.query.place,req.query.crop))}catch(error){next(error)}}
export async function market(_req,res,next){try{res.json(await getMarketInsights())}catch(error){next(error)}}
