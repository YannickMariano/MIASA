import {env} from '../config/env.js'

const adviceByLabel = {
  healthy: ['Continuer la surveillance régulière de la parcelle.', 'Maintenir un arrosage au pied et une nutrition équilibrée.'],
  rust: ['Retirer les feuilles très atteintes et les éloigner de la parcelle.', 'Améliorer l’aération et éviter de mouiller le feuillage.', 'Faire confirmer la maladie avant d’appliquer un traitement.'],
  blight: ['Isoler les plants fortement atteints et retirer les débris infectés.', 'Éviter l’arrosage sur les feuilles et améliorer le drainage.', 'Consulter un technicien agricole si les symptômes progressent.'],
  mold: ['Réduire l’humidité autour du feuillage et améliorer l’aération.', 'Retirer prudemment les feuilles très atteintes.', 'Demander une confirmation avant tout traitement phytosanitaire.'],
  virus: ['Isoler le plant suspect pour limiter une éventuelle propagation.', 'Désinfecter les outils et surveiller les insectes vecteurs.', 'Faire confirmer le diagnostic par un technicien agricole.'],
  spot: ['Retirer les feuilles très atteintes et nettoyer les outils.', 'Éviter les éclaboussures d’eau entre les plants.', 'Observer plusieurs feuilles avant de décider d’un traitement.'],
  default: ['Comparer les symptômes sur plusieurs feuilles et plusieurs plants.', 'Éviter tout traitement chimique avant confirmation du diagnostic.', 'Contacter un technicien agricole si les symptômes progressent.'],
}

function adviceFor(label) {
  const normalized = label.toLowerCase()
  const key = Object.keys(adviceByLabel).find(candidate => candidate !== 'default' && normalized.includes(candidate)) || 'default'
  return adviceByLabel[key]
}

export async function diagnosePlant(buffer, {filename = 'capture.jpg', mimeType = 'image/jpeg'} = {}) {
  const form = new FormData()
  form.append('file', new Blob([buffer], {type: mimeType}), filename)

  let response
  try {
    response = await fetch(`${env.aiServiceUrl}/predict`, {
      method: 'POST',
      body: form,
      signal: AbortSignal.timeout(90_000),
    })
  } catch {
    throw new Error(`Service YOLO inaccessible sur ${env.aiServiceUrl}. Démarrez ai-service avant l’analyse.`)
  }

  const output = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(output.detail || output.message || `Service YOLO indisponible (${response.status})`)

  const predictions = Array.isArray(output.predictions) ? output.predictions : []
  if (!predictions.length) {
    return {
      mode: 'yolo',
      model: output.model || 'YOLOv8 local',
      prediction: {label: 'Aucun signe reconnu', score: 0},
      alternatives: [],
      advice: adviceByLabel.default,
      warning: 'Aucune détection ne garantit pas que la plante est saine. Essayez une photo plus nette et demandez un avis terrain.',
    }
  }

  const [prediction, ...alternatives] = predictions
  return {
    mode: 'yolo',
    model: output.model || 'YOLOv8 local',
    prediction,
    alternatives,
    advice: adviceFor(prediction.label),
    warning: 'Résultat indicatif uniquement. Confirmez le diagnostic auprès d’un technicien agricole avant tout traitement.',
  }
}
