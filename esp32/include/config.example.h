#pragma once

// Facultatif : copier ce fichier en config.h pour changer les réglages par défaut.
// Sans config.h, le firmware utilise les valeurs ci-dessous.
#define DEVICE_ID "ESP32-PARCELLE-01"

// Câblage
#define SOIL_SENSOR_PIN 32      // AOUT du capteur d'humidité
#define RELAY_PIN 26            // IN du module relais
#define RELAY_ACTIVE_LOW true   // mettre false si la pompe tourne quand elle devrait être arrêtée

// Calibration du capteur (voir README) : valeur "soilMoistureRaw" sol sec / sol saturé.
#define DRY_VALUE 3300
#define WET_VALUE 1250

// Arrosage automatique
#define MOISTURE_THRESHOLD 35   // % sous lequel on arrose
#define PUMP_PULSE_MS 5000      // durée d'une impulsion
#define PUMP_COOLDOWN_MS 30000  // pause entre deux impulsions
#define PUMP_MAX_PULSES 6       // impulsions sans effet avant blocage de sécurité
