# Tanimboly — agriculture intelligente à Madagascar

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

## Routes API

- `GET /api/health`
- `GET /api/dashboard`
- `GET /api/sensors/latest`
- `POST /api/sensors/readings` — réception des mesures ESP32
- `POST /api/irrigation/toggle` — contrôle manuel
- `PUT /api/irrigation/settings` — seuil et mode automatique

