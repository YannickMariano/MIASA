$ErrorActionPreference = 'Continue'
$configPath = (Resolve-Path (Join-Path $PSScriptRoot 'config')).Path
$composeFile = Join-Path $PSScriptRoot 'docker-compose.yml'

$null = docker info 2>&1
if ($LASTEXITCODE -ne 0) {
  throw 'Docker Desktop n est pas pret. Demarrez Docker Desktop, attendez Engine running, puis relancez ce script.'
}

Write-Host 'Verification de l image Mosquitto...'
docker pull eclipse-mosquitto:2.0.22
if ($LASTEXITCODE -ne 0) {
  throw 'Telechargement impossible. Redemarrez le moteur Docker Desktop puis testez docker pull eclipse-mosquitto:2.0.22.'
}

Write-Host 'Creation du compte MQTT tanimboly.'
Write-Host 'Conservez ce mot de passe pour back/.env et esp32/include/config.h.'

docker run --rm -it `
  -v "${configPath}:/mosquitto/config" `
  eclipse-mosquitto:2.0.22 `
  mosquitto_passwd -c /mosquitto/config/password.txt tanimboly

if ($LASTEXITCODE -ne 0 -or -not (Test-Path (Join-Path $configPath 'password.txt'))) {
    throw 'La creation du mot de passe MQTT a echoue.'
}

Write-Host 'Mot de passe cree.'
Write-Host "Demarrez Mosquitto avec : docker compose -f `"$composeFile`" up -d"
