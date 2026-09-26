import {diagnosePlant} from '../services/plantDiagnosisService.js'

export async function analyze(req, res) {
  if (!req.file) return res.status(400).json({message: 'Une image est requise.'})
  try {
    const result = await diagnosePlant(req.file.buffer, {
      filename: req.file.originalname,
      mimeType: req.file.mimetype,
    })
    res.json({...result, file: {name: req.file.originalname, size: req.file.size}})
  } catch (error) {
    // Message explicite pour l'utilisateur (service YOLO arrêté, modèle absent…) au lieu d'une erreur 500 générique.
    console.error('[Diagnostic]', error.message)
    res.status(503).json({message: error.message || 'Le service de diagnostic est indisponible.'})
  }
}
