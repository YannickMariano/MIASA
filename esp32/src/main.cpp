#include <Arduino.h>

// Réglages facultatifs : copiez include/config.example.h en include/config.h pour les modifier.
#if __has_include("config.h")
#include "config.h"
#endif

#ifndef DEVICE_ID
#define DEVICE_ID "ESP32-PARCELLE-01"
#endif
#ifndef SOIL_SENSOR_PIN
#define SOIL_SENSOR_PIN 32          // AOUT du capteur d'humidité
#endif
#ifndef RELAY_PIN
#define RELAY_PIN 26                // IN du module relais
#endif
#ifndef RELAY_ACTIVE_LOW
#define RELAY_ACTIVE_LOW true       // la plupart des modules relais s'activent avec un niveau BAS
#endif
#ifndef DRY_VALUE
#define DRY_VALUE 3300              // valeur brute capteur dans un sol sec (à calibrer)
#endif
#ifndef WET_VALUE
#define WET_VALUE 1250              // valeur brute capteur dans un sol saturé d'eau (à calibrer)
#endif
#ifndef MOISTURE_THRESHOLD
#define MOISTURE_THRESHOLD 35       // % sous lequel on arrose (synchronisé avec l'application)
#endif
#ifndef READ_INTERVAL_MS
#define READ_INTERVAL_MS 5000       // une mesure toutes les 5 s
#endif
#ifndef PUMP_PULSE_MS
#define PUMP_PULSE_MS 5000          // durée d'une impulsion d'arrosage
#endif
#ifndef PUMP_COOLDOWN_MS
#define PUMP_COOLDOWN_MS 30000      // pause entre deux impulsions, le temps que l'eau diffuse
#endif
#ifndef PUMP_MAX_PULSES
#define PUMP_MAX_PULSES 6           // sécurité : impulsions consécutives sans effet avant blocage
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

// Une ligne JSON par mesure : c'est ce que lit le serveur via le câble USB.
void sendReading(int raw, int moisture) {
  Serial.printf("{\"type\":\"reading\",\"deviceId\":\"%s\",\"soilMoisture\":%d,\"soilMoistureRaw\":%d,\"pump\":%s,\"pumpLocked\":%s,\"threshold\":%d}\n",
                DEVICE_ID, moisture, raw, pumpOn ? "true" : "false", pumpLocked ? "true" : "false", threshold);
}

// Décide s'il faut arroser : impulsions courtes, pause entre deux, blocage si l'arrosage reste sans effet.
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
    Serial.println("ALERTE : l'arrosage n'augmente pas l'humidité. Pompe bloquée par sécurité (réservoir vide ? capteur hors du sol ?). Redémarrez l'ESP32 après vérification.");
    return;
  }
  consecutivePulses++;
  setPump(true);
  pumpStartedAt = millis();
  Serial.printf("Pompe en marche (humidité %d%% < seuil %d%%).\n", moisture, threshold);
}

// Commandes envoyées par le serveur, ex. {"cmd":"config","threshold":40}
void readCommands() {
  while (Serial.available()) {
    const char c = Serial.read();
    if (c != '\n') { if (inputLine.length() < 120) inputLine += c; continue; }
    const int key = inputLine.indexOf("\"threshold\":");
    if (inputLine.indexOf("\"config\"") >= 0 && key >= 0) {
      const int value = inputLine.substring(key + 12).toInt();
      if (value >= 10 && value <= 80) {
        threshold = value;
        Serial.printf("Seuil d'arrosage réglé à %d%%.\n", threshold);
      }
    }
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
  // Relais coupé AVANT de passer la broche en sortie, pour que la pompe ne démarre jamais au boot.
  digitalWrite(RELAY_PIN, RELAY_ACTIVE_LOW ? HIGH : LOW);
  pinMode(RELAY_PIN, OUTPUT);
  setPump(false);
  Serial.begin(115200);
  analogReadResolution(12);
  analogSetPinAttenuation(SOIL_SENSOR_PIN, ADC_11db);
  delay(300);
  Serial.println("Voly ESP32 prêt : mesure de l'humidité toutes les 5 s, arrosage automatique.");
  measure();
  lastReadAt = millis();
}

void loop() {
  readCommands();
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
