# M'IASA — agriculture intelligente à Madagascar

Monorepo composé de trois applications indépendantes :

- `front/` — interface Vite + React
- `back/` — API REST Node.js + Express
- `esp32/` — firmware C++ / PlatformIO pour les capteurs et la pompe

## Démarrage rapide

```bash
npm run install:all
npm install
npm run dev
```

Le frontend est disponible sur `http://localhost:5173` et l'API sur `http://localhost:4000`.

Copier `front/.env.example` vers `front/.env` pour modifier l'URL de l'API. Le backend fonctionne immédiatement avec un simulateur de capteurs intégré.

## Liaison distante ESP32 avec Mosquitto

Le dossier `mqtt/` contient un broker Mosquitto local authentifié. L'ESP32 publie sur
`tanimboly/ESP32-PARCELLE-01/telemetry` et reçoit les réglages sur
`tanimboly/ESP32-PARCELLE-01/commands`.

### 1. Créer le mot de passe du broker

```powershell
cd C:\projet\cidst\mqtt
.\setup-password.ps1
docker compose up -d
docker compose logs -f
```

Le port TCP `1883` doit être autorisé dans le pare-feu Windows uniquement pour le réseau privé local.
Ne publiez jamais ce port directement sur Internet.

### 2. Configurer le backend

Dans `back/.env` :

```env
SERIAL_BRIDGE=off
MQTT_ENABLED=true
MQTT_URL=mqtt://127.0.0.1:1883
MQTT_USERNAME=tanimboly
MQTT_PASSWORD=LE_MEME_MOT_DE_PASSE
MQTT_BASE_TOPIC=tanimboly
```

### 3. Configurer l'ESP32

Copier `esp32/include/config.example.h` vers `esp32/include/config.h`, puis renseigner
le Wi-Fi, le mot de passe MQTT et l'adresse IPv4 locale du PC. `config.h` est ignoré par Git.

```powershell
Copy-Item .\esp32\include\config.example.h .\esp32\include\config.h
```

Exemple important dans `config.h` :

```cpp
#define MQTT_ENABLED 1
#define MQTT_HOST "192.168.1.47"
```

### 4. Compiler et téléverser

```powershell
cd C:\projet\cidst\esp32
& "$env:USERPROFILE\.platformio\penv\Scripts\platformio.exe" run --target upload --upload-port COM3
& "$env:USERPROFILE\.platformio\penv\Scripts\platformio.exe" device monitor --port COM3 --baud 115200
```

Une connexion réussie affiche `MQTT connecté`. Redémarrer ensuite le backend avec `npm run dev`.

## Routes API

- `GET /api/health`
- `GET /api/dashboard`
- `GET /api/sensors/latest`
- `POST /api/sensors/readings` — réception des mesures ESP32
- `POST /api/irrigation/toggle` — contrôle manuel
- `PUT /api/irrigation/settings` — seuil et mode automatique
