#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "config.h"

// Capteur capacitif analogique : VCC -> 3,3 V, GND -> GND, AOUT -> GPIO 34.
constexpr uint8_t SOIL_SENSOR_PIN = 34;
constexpr uint8_t SAMPLE_COUNT = 20;
constexpr unsigned long SEND_INTERVAL_MS = 30000;
unsigned long lastSendAt = 0;

bool connectWifi() {
  if (WiFi.status() == WL_CONNECTED) return true;
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connexion Wi-Fi");
  const unsigned long startedAt = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - startedAt < 15000) {
    delay(500);
    Serial.print('.');
  }
  Serial.println(WiFi.status() == WL_CONNECTED ? " connecté" : " échec");
  return WiFi.status() == WL_CONNECTED;
}

int readRawAverage() {
  uint32_t total = 0;
  for (uint8_t i = 0; i < SAMPLE_COUNT; i++) {
    total += analogRead(SOIL_SENSOR_PIN);
    delay(20);
  }
  return total / SAMPLE_COUNT;
}

int moisturePercent(int raw) {
  return constrain(map(raw, DRY_VALUE, WET_VALUE, 0, 100), 0, 100);
}

void sendReading() {
  if (!connectWifi()) return;
  const int raw = readRawAverage();
  const int moisture = moisturePercent(raw);
  JsonDocument payload;
  payload["deviceId"] = DEVICE_ID;
  payload["soilMoisture"] = moisture;
  payload["soilMoistureRaw"] = raw;
  String body;
  serializeJson(payload, body);

  HTTPClient http;
  http.setTimeout(8000);
  http.begin(String(API_URL) + "/sensors/readings");
  http.addHeader("Content-Type", "application/json");
  http.addHeader("X-Device-Key", DEVICE_API_KEY);
  const int status = http.POST(body);
  Serial.printf("Brut: %d | Humidité: %d%% | HTTP: %d\n", raw, moisture, status);
  http.end();
}

void setup() {
  Serial.begin(115200);
  analogReadResolution(12);
  analogSetPinAttenuation(SOIL_SENSOR_PIN, ADC_11db);
  connectWifi();
  sendReading();
  lastSendAt = millis();
}

void loop() {
  if (millis() - lastSendAt >= SEND_INTERVAL_MS) {
    lastSendAt = millis();
    sendReading();
  }
  delay(100);
}
