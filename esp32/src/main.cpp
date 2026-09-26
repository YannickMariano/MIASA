#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>

#if __has_include("config.h")
#include "config.h"
#endif

#ifndef DEVICE_ID
#define DEVICE_ID "ESP32-PARCELLE-01"
#endif
#ifndef MQTT_ENABLED
#define MQTT_ENABLED 0
#endif
#ifndef WIFI_SSID
#define WIFI_SSID ""
#endif
#ifndef WIFI_PASSWORD
#define WIFI_PASSWORD ""
#endif
#ifndef MQTT_HOST
#define MQTT_HOST "192.168.1.47"
#endif
#ifndef MQTT_PORT
#define MQTT_PORT 1883
#endif
#ifndef MQTT_USER
#define MQTT_USER ""
#endif
#ifndef MQTT_PASSWORD
#define MQTT_PASSWORD ""
#endif
#ifndef MQTT_BASE_TOPIC
#define MQTT_BASE_TOPIC "tanimboly"
#endif
#ifndef SOIL_SENSOR_PIN
#define SOIL_SENSOR_PIN 32
#endif
#ifndef RELAY_PIN
#define RELAY_PIN 26
#endif
#ifndef RELAY_ACTIVE_LOW
#define RELAY_ACTIVE_LOW true
#endif
#ifndef DRY_VALUE
#define DRY_VALUE 3300
#endif
#ifndef WET_VALUE
#define WET_VALUE 1250
#endif
#ifndef MOISTURE_THRESHOLD
#define MOISTURE_THRESHOLD 35
#endif
#ifndef READ_INTERVAL_MS
#define READ_INTERVAL_MS 5000
#endif
#ifndef PUMP_PULSE_MS
#define PUMP_PULSE_MS 5000
#endif
#ifndef PUMP_COOLDOWN_MS
#define PUMP_COOLDOWN_MS 30000
#endif
#ifndef PUMP_MAX_PULSES
#define PUMP_MAX_PULSES 6
#endif

constexpr uint8_t SAMPLE_COUNT = 20;

int threshold = MOISTURE_THRESHOLD;
bool pumpOn = false;
bool pumpLocked = false;
unsigned long pumpStartedAt = 0;
unsigned long lastPumpStopAt = 0;
unsigned long lastReadAt = 0;
uint8_t consecutivePulses = 0;
int moistureBeforePulses = -1;
int lastMoisture = -1;
String inputLine;

#if MQTT_ENABLED
WiFiClient wifiClient;
PubSubClient mqttClient(wifiClient);
unsigned long lastConnectionAttemptAt = 0;
char telemetryTopic[100];
char statusTopic[100];
char commandsTopic[100];
#endif

void setPump(bool on) {
  pumpOn = on;
  const bool level = RELAY_ACTIVE_LOW ? !on : on;
  digitalWrite(RELAY_PIN, level ? HIGH : LOW);
}

int readRawAverage() {
  uint32_t total = 0;
  for (uint8_t i = 0; i < SAMPLE_COUNT; i++) {
    total += analogRead(SOIL_SENSOR_PIN);
    delay(10);
  }
  return total / SAMPLE_COUNT;
}

int moisturePercent(int raw) {
  return constrain(map(raw, DRY_VALUE, WET_VALUE, 0, 100), 0, 100);
}

void applyConfig(const String &message) {
  const int key = message.indexOf("\"threshold\":");
  if (message.indexOf("\"config\"") < 0 || key < 0) return;
  const int value = message.substring(key + 12).toInt();
  if (value >= 10 && value <= 80) {
    threshold = value;
    Serial.printf("Seuil d'arrosage réglé à %d%%.\n", threshold);
  }
}

#if MQTT_ENABLED
void onMqttMessage(char *, byte *payload, unsigned int length) {
  String message;
  message.reserve(length);
  for (unsigned int i = 0; i < length; i++) message += static_cast<char>(payload[i]);
  applyConfig(message);
}

void connectNetwork() {
  if (millis() - lastConnectionAttemptAt < 5000) return;
  lastConnectionAttemptAt = millis();

  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("Wi-Fi : tentative de connexion…");
    WiFi.disconnect();
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    return;
  }
  if (mqttClient.connected()) return;

  const String clientId = String("tanimboly-") + DEVICE_ID + "-" + String((uint32_t)ESP.getEfuseMac(), HEX);
  if (mqttClient.connect(clientId.c_str(), MQTT_USER, MQTT_PASSWORD, statusTopic, 1, true, "offline")) {
    mqttClient.subscribe(commandsTopic, 1);
    mqttClient.publish(statusTopic, "online", true);
    Serial.printf("MQTT connecté à %s:%d.\n", MQTT_HOST, MQTT_PORT);
  } else {
    Serial.printf("MQTT connexion refusée, code %d.\n", mqttClient.state());
  }
}
#endif

void sendReading(int raw, int moisture) {
  char payload[256];
  snprintf(payload, sizeof(payload), "{\"type\":\"reading\",\"deviceId\":\"%s\",\"soilMoisture\":%d,\"soilMoistureRaw\":%d,\"pump\":%s,\"pumpLocked\":%s,\"threshold\":%d}",
           DEVICE_ID, moisture, raw, pumpOn ? "true" : "false", pumpLocked ? "true" : "false", threshold);
  Serial.println(payload);
#if MQTT_ENABLED
  if (mqttClient.connected()) mqttClient.publish(telemetryTopic, payload, true);
#endif
}

void manageIrrigation(int moisture) {
  if (moisture >= threshold) {
    consecutivePulses = 0;
    moistureBeforePulses = -1;
    return;
  }
  if (pumpOn || pumpLocked) return;
  if (lastPumpStopAt && millis() - lastPumpStopAt < PUMP_COOLDOWN_MS) return;
  if (consecutivePulses == 0) moistureBeforePulses = moisture;
  if (consecutivePulses >= PUMP_MAX_PULSES && moisture <= moistureBeforePulses + 2) {
    pumpLocked = true;
    Serial.println("ALERTE : pompe bloquée, l'humidité n'augmente pas.");
    return;
  }
  consecutivePulses++;
  setPump(true);
  pumpStartedAt = millis();
  Serial.printf("Pompe en marche (humidité %d%% < seuil %d%%).\n", moisture, threshold);
}

void readCommands() {
  while (Serial.available()) {
    const char c = Serial.read();
    if (c != '\n') {
      if (inputLine.length() < 120) inputLine += c;
      continue;
    }
    applyConfig(inputLine);
    inputLine = "";
  }
}

void measure() {
  const int raw = readRawAverage();
  lastMoisture = moisturePercent(raw);
  manageIrrigation(lastMoisture);
  sendReading(raw, lastMoisture);
}

void setup() {
  digitalWrite(RELAY_PIN, RELAY_ACTIVE_LOW ? HIGH : LOW);
  pinMode(RELAY_PIN, OUTPUT);
  setPump(false);
  Serial.begin(115200);
  analogReadResolution(12);
  analogSetPinAttenuation(SOIL_SENSOR_PIN, ADC_11db);
  delay(300);

#if MQTT_ENABLED
  snprintf(telemetryTopic, sizeof(telemetryTopic), "%s/%s/telemetry", MQTT_BASE_TOPIC, DEVICE_ID);
  snprintf(statusTopic, sizeof(statusTopic), "%s/%s/status", MQTT_BASE_TOPIC, DEVICE_ID);
  snprintf(commandsTopic, sizeof(commandsTopic), "%s/%s/commands", MQTT_BASE_TOPIC, DEVICE_ID);
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  mqttClient.setServer(MQTT_HOST, MQTT_PORT);
  mqttClient.setCallback(onMqttMessage);
  mqttClient.setBufferSize(512);
#endif

  Serial.println("Voly ESP32 prêt : mesure toutes les 5 s et arrosage automatique.");
  measure();
  lastReadAt = millis();
}

void loop() {
  readCommands();
#if MQTT_ENABLED
  connectNetwork();
  mqttClient.loop();
#endif
  if (pumpOn && millis() - pumpStartedAt >= PUMP_PULSE_MS) {
    setPump(false);
    lastPumpStopAt = millis();
    Serial.println("Pompe arrêtée.");
  }
  if (millis() - lastReadAt >= READ_INTERVAL_MS) {
    lastReadAt = millis();
    measure();
  }
  delay(20);
}
