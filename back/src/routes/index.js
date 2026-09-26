import {Router} from 'express'
import {addReading,getHistory,getLatest} from '../controllers/sensorController.js'
import {settings,status,toggle} from '../controllers/irrigationController.js'
import {sensorStore} from '../store/sensorStore.js'
import multer from 'multer'
import {analyze} from '../controllers/diagnosisController.js'
import {market,weather} from '../controllers/insightsController.js'
import {create as createListing,list as listListings,options as listingOptions,remove as removeListing} from '../controllers/listingsController.js'
const router=Router()
const upload=multer({storage:multer.memoryStorage(),limits:{fileSize:8*1024*1024},fileFilter:(_req,file,cb)=>cb(null,file.mimetype.startsWith('image/'))})
router.get('/health',(_req,res)=>res.json({status:'ok',service:'tanimboly-api'}))
router.get('/dashboard',(_req,res)=>res.json({sensors:sensorStore.latest(),irrigation:sensorStore.irrigation(),device:sensorStore.device()}))
router.get('/device/status',(_req,res)=>res.json(sensorStore.device()))
router.get('/sensors/latest',getLatest);router.get('/sensors/history',getHistory);router.post('/sensors/readings',addReading)
router.get('/irrigation/status',status);router.post('/irrigation/toggle',toggle);router.put('/irrigation/settings',settings)
router.post('/diagnosis/analyze',upload.single('image'),analyze)
router.get('/insights/weather',weather);router.get('/insights/market',market)
router.get('/listings',listListings);router.get('/listings/options',listingOptions);router.post('/listings',createListing);router.delete('/listings/:id',removeListing)
export default router
