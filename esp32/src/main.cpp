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
#ifndef MEASURE_INTERVAL_MS
#define MEASURE_INTERVAL_MS 1000   // mesure de l'humidité : la pompe réagit en 1 s au plus
#endif
#ifndef PUBLISH_INTERVAL_MS
#define PUBLISH_INTERVAL_MS 5000   // envoi à l'application (immédiat quand la pompe change d'état)
#endif
#ifndef PUMP_PULSE_MS
#define PUMP_PULSE_MS 10000        // durée maximale d'une impulsion (arrêt dès que le seuil est atteint)
#endif
#ifndef PUMP_MIN_ON_MS
#define PUMP_MIN_ON_MS 2000        // durée minimale de marche, évite que le relais claque
#endif
#ifndef PUMP_COOLDOWN_MS
#define PUMP_COOLDOWN_MS 10000     // pause entre deux impulsions pour laisser l'eau atteindre le capteur
#endif
#ifndef PUMP_MAX_PULSES
#define PUMP_MAX_PULSES 6
#endif
#ifndef PUMP_LOCK_RETRY_MS
#define PUMP_LOCK_RETRY_MS 60000   // après un blocage de sécurité, nouvel essai automatique
#endif

constexpr uint8_t SAMPLE_COUNT = 16;

int threshold = MOISTURE_THRESHOLD;
bool pumpOn = false;
bool pumpLocked = false;
unsigned long pumpStartedAt = 0;
unsigned long lastPumpStopAt = 0;
bool pumpHasStopped = false;
unsigned long lockedAt = 0;
unsigned long lastReadAt = 0;
unsigned long lastPublishAt = 0;
bool publishNow = false;
uint8_t consecutivePulses = 0;
int moistureBeforePulses = -1;
int lastMoisture = -1;
int lastRaw = 0;
String inputLine;

#if MQTT_ENABLED
WiFiClient wifiClient;
PubSubClient mqttClient(wifiClient);
unsigned long lastWifiAttemptAt = 0;
unsigned long lastMqttAttemptAt = 0;
unsigned long mqttRetryMs = 5000;
char telemetryTopic[100];
char statusTopic[100];
char commandsTopic[100];
#endif

void setPump(bool on) {
  if (pumpOn != on) publishNow = true;  // l'application voit tout de suite la pompe démarrer ou s'arrêter
  pumpOn = on;
  if (RELAY_ACTIVE_LOW) {
    // Module relais 5 V actif à l'état bas : un « HIGH » de 3,3 V ne suffit pas à le couper (il reste collé).
    // Pour l'arrêt, on relâche la broche (haute impédance) : le module repasse au repos à coup sûr.
    if (on) {
      pinMode(RELAY_PIN, OUTPUT);
      digitalWrite(RELAY_PIN, LOW);
    } else {
      pinMode(RELAY_PIN, INPUT);
    }
    return;
  }
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, on ? HIGH : LOW);
}

int readRawAverage() {
  uint32_t total = 0;
  for (uint8_t i = 0; i < SAMPLE_COUNT; i++) {
    total += analogRead(SOIL_SENSOR_PIN);
    delay(2);
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

// Reconnexion sans bloquer l'arrosage : une connexion MQTT vers un broker injoignable peut figer la boucle
// plusieurs secondes, donc on ne la tente jamais pendant que la pompe tourne et on espace les essais en cas d'échec.
void connectNetwork() {
  if (pumpOn) return;
  if (WiFi.status() != WL_CONNECTED) {
    if (millis() - lastWifiAttemptAt < 15000) return;
    lastWifiAttemptAt = millis();
    Serial.println("Wi-Fi : tentative de connexion…");
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    return;
  }
  if (mqttClient.connected()) return;
  if (millis() - lastMqttAttemptAt < mqttRetryMs) return;
  lastMqttAttemptAt = millis();

  const String clientId = String("tanimboly-") + DEVICE_ID + "-" + String((uint32_t)ESP.getEfuseMac(), HEX);
  if (mqttClient.connect(clientId.c_str(), MQTT_USER, MQTT_PASSWORD, statusTopic, 1, true, "offline")) {
    mqttClient.subscribe(commandsTopic, 1);
    mqttClient.publish(statusTopic, "online", true);
    mqttRetryMs = 5000;
    publishNow = true;
    Serial.printf("MQTT connecté à %s:%d.\n", MQTT_HOST, MQTT_PORT);
  } else {
    mqttRetryMs = min(mqttRetryMs * 2, 60000UL);
    Serial.printf("MQTT connexion refusée (code %d), nouvel essai dans %lu s. Vérifiez MQTT_HOST.\n", mqttClient.state(), mqttRetryMs / 1000);
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

void stopPump(const char *reason) {
  setPump(false);
  pumpHasStopped = true;
  lastPumpStopAt = millis();
  Serial.printf("Pompe arrêtée (%s).\n", reason);
}

void manageIrrigation(int moisture) {
  if (pumpOn) {
    // Arrêt dès que le sol est assez humide, sans attendre la fin de l'impulsion.
    if (moisture >= threshold && millis() - pumpStartedAt >= PUMP_MIN_ON_MS) stopPump("seuil atteint");
    return;
  }
  if (moisture >= threshold) {
    consecutivePulses = 0;
    moistureBeforePulses = -1;
    if (pumpLocked) {
      pumpLocked = false;
      publishNow = true;
      Serial.println("Sol de nouveau humide : blocage de sécurité levé.");
    }
    return;
  }
  if (pumpLocked) {
    // Plus besoin de débrancher l'ESP32 : nouvel essai automatique après PUMP_LOCK_RETRY_MS.
    if (millis() - lockedAt < PUMP_LOCK_RETRY_MS) return;
    pumpLocked = false;
    consecutivePulses = 0;
    publishNow = true;
    Serial.println("Nouvel essai d'arrosage après le blocage de sécurité.");
  }
  if (pumpHasStopped && millis() - lastPumpStopAt < PUMP_COOLDOWN_MS) return;
  if (consecutivePulses == 0) moistureBeforePulses = moisture;
  if (consecutivePulses >= PUMP_MAX_PULSES && moisture <= moistureBeforePulses + 2) {
    pumpLocked = true;
    lockedAt = millis();
    publishNow = true;
    Serial.printf("ALERTE : pompe bloquée, l'humidité n'augmente pas. Nouvel essai dans %d s.\n", PUMP_LOCK_RETRY_MS / 1000);
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
  lastRaw = readRawAverage();
  lastMoisture = moisturePercent(lastRaw);
  manageIrrigation(lastMoisture);
}

void publishIfDue() {
  if (!publishNow && millis() - lastPublishAt < PUBLISH_INTERVAL_MS) return;
  publishNow = false;
  lastPublishAt = millis();
  sendReading(lastRaw, lastMoisture);
}

void setup() {
  setPump(false);  // relais au repos avant toute autre action : la pompe ne démarre jamais au branchement
  Serial.begin(115200);
  analogReadResolution(12);
  analogSetPinAttenuation(SOIL_SENSOR_PIN, ADC_11db);
  delay(300);

#if MQTT_ENABLED
  snprintf(telemetryTopic, sizeof(telemetryTopic), "%s/%s/telemetry", MQTT_BASE_TOPIC, DEVICE_ID);
  snprintf(statusTopic, sizeof(statusTopic), "%s/%s/status", MQTT_BASE_TOPIC, DEVICE_ID);
  snprintf(commandsTopic, sizeof(commandsTopic), "%s/%s/commands", MQTT_BASE_TOPIC, DEVICE_ID);
  WiFi.mode(WIFI_STA);
  WiFi.setAutoReconnect(true);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  lastWifiAttemptAt = millis();
  wifiClient.setTimeout(2);            // connexion TCP au broker : 2 s maximum
  mqttClient.setSocketTimeout(2);      // attente de la réponse du broker : 2 s maximum (15 s par défaut)
  mqttClient.setServer(MQTT_HOST, MQTT_PORT);
  mqttClient.setCallback(onMqttMessage);
  mqttClient.setBufferSize(512);
#endif

  Serial.println("M'IASA ESP32 prêt : mesure chaque seconde, arrosage automatique immédiat.");
  measure();
  lastReadAt = millis();
  publishNow = true;
  publishIfDue();
}

void loop() {
  readCommands();
#if MQTT_ENABLED
  connectNetwork();
  mqttClient.loop();
#endif
  if (pumpOn && millis() - pumpStartedAt >= PUMP_PULSE_MS) stopPump("durée maximale de l'impulsion");
  if (millis() - lastReadAt >= MEASURE_INTERVAL_MS) {
    lastReadAt = millis();
    measure();
  }
  publishIfDue();
  delay(10);
}
