import 'dotenv/config'

export const env = {
  port: Number(process.env.PORT) || 4000,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  deviceApiKey: process.env.DEVICE_API_KEY || 'dev-esp32-key',
  aiServiceUrl: process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000',
  serialBridge: process.env.SERIAL_BRIDGE?.toLowerCase() !== 'off',
  mqttEnabled: process.env.MQTT_ENABLED?.toLowerCase() === 'true',
  mqttUrl: process.env.MQTT_URL || 'mqtt://127.0.0.1:1883',
  mqttUsername: process.env.MQTT_USERNAME || '',
  mqttPassword: process.env.MQTT_PASSWORD || '',
  mqttBaseTopic: process.env.MQTT_BASE_TOPIC || 'tanimboly',
}
