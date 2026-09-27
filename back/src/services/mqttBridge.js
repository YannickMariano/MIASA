import mqtt from 'mqtt'
import {env} from '../config/env.js'
import {sensorStore} from '../store/sensorStore.js'

let client = null
let activeDeviceId = null
const topic = suffix => `${env.mqttBaseTopic}/${suffix}`

export function startMqttBridge({log = console} = {}) {
  if (!env.mqttEnabled) return null
  if (!env.mqttUsername || !env.mqttPassword) {
    log.error('[MQTT] MQTT_USERNAME et MQTT_PASSWORD sont requis.')
    return null
  }

  client = mqtt.connect(env.mqttUrl, {
    username: env.mqttUsername,
    password: env.mqttPassword,
    clientId: `tanimboly-backend-${process.pid}`,
    clean: true,
    reconnectPeriod: 3000,
    connectTimeout: 10000,
  })

  client.on('connect', () => {
    log.log(`[MQTT] Connecté à ${env.mqttUrl}.`)
    client.subscribe([topic('+/telemetry'), topic('+/status')], {qos: 1}, error => {
      if (error) log.error('[MQTT] Abonnement impossible :', error.message)
    })
  })

  client.on('message', (messageTopic, payload) => {
    const parts = messageTopic.split('/')
    const deviceId = parts.at(-2)
    const channel = parts.at(-1)
    if (!deviceId) return
    if (channel === 'status') {
      if (payload.toString() === 'offline' && activeDeviceId === deviceId) sensorStore.markOffline()
      return
    }

    let data
    try { data = JSON.parse(payload.toString()) } catch { return }
    const soilMoisture = Number(data.soilMoisture)
    if (!Number.isFinite(soilMoisture) || soilMoisture < 0 || soilMoisture > 100) return

    activeDeviceId = String(data.deviceId || deviceId).slice(0, 50)
    const reading = {deviceId: activeDeviceId, soilMoisture}
    if (Number.isFinite(Number(data.soilMoistureRaw))) reading.soilMoistureRaw = Number(data.soilMoistureRaw)
    sensorStore.setLink({type: 'mqtt', broker: env.mqttUrl})
    sensorStore.add(reading)

    const irrigation = sensorStore.irrigation()
    const pumpOn = data.pump === true
    sensorStore.setIrrigation({
      pumpOn,
      pumpLocked: data.pumpLocked === true,
      ...(pumpOn && !irrigation.pumpOn ? {lastRun: new Date().toISOString()} : {}),
    })
    if (Number.isFinite(Number(data.threshold)) && Number(data.threshold) !== irrigation.threshold) {
      publishDeviceConfig(activeDeviceId, {threshold: irrigation.threshold})
    }
    if ((data.mode === 'auto' || data.mode === 'manual') && data.mode !== irrigation.mode) {
      publishDeviceCommand({cmd: 'mode', mode: irrigation.mode}, activeDeviceId)
    }
  })

  client.on('reconnect', () => log.log('[MQTT] Reconnexion au broker…'))
  client.on('error', error => log.error('[MQTT] Erreur :', error.message))
  return client
}

// Envoie une commande à l'ESP32 (mode d'arrosage, pompe manuelle). Retourne false si l'ESP32 n'est pas joignable.
export function publishDeviceCommand(command, deviceId = activeDeviceId) {
  if (!client?.connected || !deviceId) return false
  client.publish(topic(`${deviceId}/commands`), JSON.stringify(command), {qos: 1})
  return true
}

export function publishDeviceConfig(deviceId = activeDeviceId, config = {}) {
  if (!client?.connected || !deviceId) return false
  client.publish(topic(`${deviceId}/commands`), JSON.stringify({cmd: 'config', ...config}), {qos: 1})
  return true
}
