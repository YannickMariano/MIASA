# Firmware ESP32

1. Installer PlatformIO dans VS Code.
2. Copier `include/config.example.h` vers `include/config.h`.
3. Renseigner le Wi-Fi et l'adresse IP locale du serveur.
4. Brancher le capteur capacitif : `VCC → 3,3 V`, `GND → GND`, `AOUT → GPIO 34`.
5. Téléverser avec `pio run --target upload`.

## Calibration obligatoire

Lire la valeur `Brut` dans le moniteur série avec le capteur sec, puis dans un sol saturé. Reporter ces deux valeurs dans `config.h` sous `DRY_VALUE` et `WET_VALUE`. Ne pas immerger la partie électronique du capteur.

Le firmware ne commande actuellement aucune pompe : l'arrosage est simulé dans l'application web. Lorsqu'un relais et une pompe seront disponibles, leur commande pourra être ajoutée séparément.
