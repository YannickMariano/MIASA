import {app} from './app.js'
import {env} from './config/env.js'
import {startSerialBridge} from './services/serialBridge.js'
app.listen(env.port,()=>console.log(`Tanimboly API active sur http://localhost:${env.port}`))
// Lecture automatique de l'ESP32 branché en USB (désactivable avec SERIAL_BRIDGE=off).
if(env.serialBridge)startSerialBridge()
