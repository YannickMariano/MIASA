#pragma once

// Facultatif : copier ce fichier en config.h pour changer les réglages par défaut.
// Sans config.h, le firmware utilise les valeurs ci-dessous.
#define DEVICE_ID "ESP32-PARCELLE-01"

// Wi-Fi et MQTT : copiez ce fichier vers config.h, puis remplacez les valeurs.
#define MQTT_ENABLED 1
#define WIFI_SSID "VOTRE_WIFI"
#define WIFI_PASSWORD "VOTRE_MOT_DE_PASSE_WIFI"
#define MQTT_HOST "192.168.1.47"
#define MQTT_PORT 1883
#define MQTT_USER "tanimboly"
#define MQTT_PASSWORD "VOTRE_MOT_DE_PASSE_MQTT"
#define MQTT_BASE_TOPIC "tanimboly"

// Câblage
#define SOIL_SENSOR_PIN 32      // AOUT du capteur d'humidité
#define RELAY_PIN 26            // IN du module relais
#define RELAY_ACTIVE_LOW true   // mettre false si la pompe tourne quand elle devrait être arrêtée

// Calibration du capteur (voir README) : valeur "soilMoistureRaw" sol sec / sol saturé.
#define DRY_VALUE 3300
#define WET_VALUE 1250

// Arrosage automatique
#define MOISTURE_THRESHOLD 35   // % sous lequel on arrose
#define MEASURE_INTERVAL_MS 1000  // mesure chaque seconde : la pompe réagit en 1 s au plus
#define PUMP_PULSE_MS 10000       // durée MAXIMALE d'une impulsion (arrêt dès que le seuil est atteint)
#define PUMP_COOLDOWN_MS 10000    // pause entre deux impulsions (l'eau doit atteindre le capteur)
#define PUMP_MAX_PULSES 6         // impulsions sans effet avant blocage de sécurité
#define PUMP_LOCK_RETRY_MS 60000  // nouvel essai automatique 60 s après un blocage
