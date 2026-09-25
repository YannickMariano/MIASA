# Firmware ESP32 — capteur d'humidité et arrosage automatique

L'ESP32 fonctionne seul dès qu'il est alimenté : il mesure l'humidité du sol toutes les 5 secondes,
arrose automatiquement si le sol est trop sec, et envoie chaque mesure par le **câble USB**.
Le serveur (`back/`) détecte l'ESP32 branché et affiche les résultats dans la page **Capteurs** de l'application.
Aucun Wi-Fi ni bouton n'est nécessaire.

## Câblage

| Composant | Broche composant | Broche ESP32 |
|---|---|---|
| Capteur d'humidité | VCC | 3V3 |
| | GND | GND |
| | AOUT | **GPIO 32** |
| Module relais | VCC | VIN (5 V) |
| | GND | GND |
| | IN | **GPIO 26** |
| Pompe | + | sortie NO (normalement ouvert) du relais, commun du relais relié au + de l'alimentation de la pompe |
| | − | − de l'alimentation de la pompe |

- Alimentez la pompe par une source séparée (piles ou bloc 5 V) : ne l'alimentez **jamais** directement par une broche de l'ESP32.
- Reliez la masse (GND) de l'alimentation de la pompe à celle de l'ESP32 si votre module relais n'est pas opto-isolé.
- Ne plongez pas la partie électronique du capteur dans l'eau.

## Téléverser le firmware (une seule fois)

1. Installer l'extension **PlatformIO** dans VS Code.
2. Ouvrir le dossier `esp32/` dans VS Code, brancher l'ESP32 en USB.
3. **Arrêter le serveur `back/`** s'il tourne (il occupe le port USB et bloquerait le téléversement).
4. Cliquer sur « Upload » (→) dans la barre PlatformIO, ou lancer `pio run --target upload`.

Les réglages par défaut conviennent au câblage ci-dessus. Pour les changer, copier `include/config.example.h`
en `include/config.h` et modifier les valeurs.

## Utilisation

1. Démarrer l'application depuis la racine du projet : `npm run dev`.
2. Brancher l'ESP32 au PC en USB.
3. Dans le terminal du serveur, le message `[ESP32] Connecté sur COMx` apparaît après quelques secondes,
   et la page **Capteurs** affiche l'humidité, la décision d'arrosage et l'état de la pompe en direct.

Si plusieurs cartes série sont branchées, forcer le port dans `back/.env` : `SERIAL_PORT=COM5`.
Pour désactiver la lecture USB (par exemple pendant un téléversement) : `SERIAL_BRIDGE=off`.

## Calibration du capteur (recommandée)

La valeur brute (`Valeur brute ADC` dans l'application) dépend de chaque capteur :

1. Capteur à l'air libre / sol sec : noter la valeur brute → `DRY_VALUE`.
2. Capteur dans un verre d'eau (jusqu'au trait, sans mouiller l'électronique) → `WET_VALUE`.
3. Reporter ces deux valeurs dans `include/config.h`, puis téléverser à nouveau.

## Arrosage automatique et sécurités

- Sous le seuil (35 % par défaut, synchronisé avec l'application), la pompe tourne par **impulsions de 5 s**,
  séparées de **30 s** de pause pour laisser l'eau pénétrer.
- Au démarrage, le relais est coupé avant toute autre action : la pompe ne se déclenche jamais au branchement.
- Si 6 impulsions de suite n'augmentent pas l'humidité (réservoir vide, capteur sorti du sol…), la pompe est
  **bloquée par sécurité** ; l'application affiche « Pompe bloquée ». Débrancher/rebrancher l'ESP32 après vérification.
- Si la pompe tourne alors qu'elle devrait être arrêtée (ou l'inverse), votre relais est « actif à l'état haut » :
  mettre `RELAY_ACTIVE_LOW false` dans `include/config.h`.
