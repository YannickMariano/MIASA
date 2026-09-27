// Recommandations pour le bien-être de la plante, construites à partir du résultat du Diagnostic IA.
// Une fiche par problème reconnu par le modèle YOLO (ai-service/models/best.pt), puis ajustée selon
// la confiance, le nombre d'échantillons atteints et les autres hypothèses de l'analyse.

const SAFETY = 'Avant tout produit : utilisez un produit homologué pour la culture, respectez la dose et le délai avant récolte, et portez gants et masque.'

// Conseils de bien-être par plante (feuille saine ou en complément d'un traitement).
const CARE = {
  apple: ['Arroser au pied, profondément mais rarement, surtout pendant la formation des fruits.', 'Tailler en hiver pour aérer le centre de l’arbre.', 'Apporter du compost au pied à la fin de l’hiver.'],
  pepper: ['Arroser régulièrement au pied, sans mouiller le feuillage.', 'Pailler pour garder le sol frais et limiter les maladies du sol.', 'Apporter un engrais riche en potassium à la floraison.'],
  berry: ['Maintenir un sol frais et bien drainé, paillé si possible.', 'Supprimer les rameaux secs ou abîmés pour aérer.', 'Apporter du compost bien décomposé une fois par an.'],
  corn: ['Semer à bonne densité pour que l’air circule entre les rangs.', 'Fractionner l’azote : une partie au semis, une partie à 6–8 feuilles.', 'Désherber tôt pour éviter la concurrence.'],
  potato: ['Butter les plants pour protéger les tubercules.', 'Arroser régulièrement au pied, sans excès.', 'Pratiquer une rotation d’au moins 3 ans sans pomme de terre ni tomate.'],
  soy: ['Semer dans un sol bien drainé ; inoculer les semences si c’est une nouvelle parcelle.', 'Désherber pendant les premières semaines.', 'Éviter l’excès d’azote : le soja fixe lui-même l’azote de l’air.'],
  squash: ['Arroser au pied le matin, jamais sur les feuilles.', 'Espacer les plants pour une bonne aération.', 'Pailler pour garder les fruits propres et le sol humide.'],
  tomato: ['Arroser au pied, régulièrement, de préférence le matin.', 'Tuteurer et retirer les gourmands pour aérer le plant.', 'Pailler le sol pour éviter les éclaboussures de terre sur les feuilles.'],
  grape: ['Palisser et effeuiller autour des grappes pour aérer.', 'Tailler chaque année pour limiter la densité du feuillage.', 'Éviter l’excès d’azote qui rend le feuillage sensible.'],
}

// Fiches des maladies et ravageurs.
const DISEASES = {
  scab: {
    type: 'fungal', severity: 2, cause: 'Champignon (Venturia inaequalis) favorisé par les printemps humides.',
    now: ['Ramasser et détruire les feuilles tombées, qui abritent le champignon.', 'Retirer les fruits tachés ou déformés.'],
    treat: ['Traitement préventif à base de cuivre ou de soufre au débourrement, puis après les pluies.', 'Si l’attaque est forte : fongicide homologué contre la tavelure, en suivant l’étiquette.'],
    prevent: ['Tailler pour aérer la couronne de l’arbre.', 'Choisir des variétés résistantes à la tavelure lors des nouvelles plantations.'],
  },
  appleRust: {
    type: 'fungal', severity: 1, cause: 'Champignon (Gymnosporangium) qui alterne entre le pommier et le genévrier.',
    now: ['Retirer les feuilles portant des taches orange.', 'Repérer les genévriers proches, qui hébergent la maladie.'],
    treat: ['Traitement préventif au soufre au printemps si la maladie revient chaque année.'],
    prevent: ['Éloigner ou supprimer les genévriers à proximité.', 'Préférer des variétés tolérantes.'],
  },
  bacterialSpot: {
    type: 'bacterial', severity: 2, cause: 'Bactérie (Xanthomonas) propagée par l’eau, les éclaboussures et les outils.',
    now: ['Retirer les feuilles tachées et les sortir de la parcelle.', 'Ne pas travailler sur les plants quand ils sont mouillés.', 'Désinfecter les outils (eau de Javel diluée ou alcool).'],
    treat: ['Pulvérisation préventive à base de cuivre (bouillie bordelaise) pour freiner la propagation.', 'Les antibiotiques ne sont pas autorisés : misez sur la prévention.'],
    prevent: ['Utiliser des semences saines ou traitées.', 'Rotation de 2 à 3 ans sans tomate, poivron ni piment.', 'Arroser au pied, jamais en aspersion.'],
  },
  grayLeafSpot: {
    type: 'fungal', severity: 2, cause: 'Champignon (Cercospora zeae-maydis) favorisé par la chaleur humide et les résidus de maïs.',
    now: ['Surveiller la progression vers les feuilles au-dessus de l’épi.', 'Noter les zones de la parcelle les plus touchées.'],
    treat: ['Fongicide homologué seulement si les feuilles au-dessus de l’épi sont atteintes avant la floraison.'],
    prevent: ['Enfouir ou détruire les résidus de maïs après récolte.', 'Rotation avec une légumineuse (haricot, soja, arachide).', 'Semer des variétés tolérantes.'],
  },
  cornBlight: {
    type: 'fungal', severity: 2, cause: 'Champignon (Helminthosporium / Exserohilum turcicum) favorisé par les nuits fraîches et humides.',
    now: ['Repérer les longues taches grises en forme de cigare sur les feuilles.', 'Surveiller les feuilles au-dessus de l’épi.'],
    treat: ['Fongicide homologué seulement si l’attaque arrive avant la floraison et progresse vite.'],
    prevent: ['Détruire ou enfouir les résidus de culture.', 'Rotation d’au moins un an sans maïs.', 'Choisir des variétés résistantes.'],
  },
  cornRust: {
    type: 'fungal', severity: 1, cause: 'Champignon (Puccinia sorghi) transporté par le vent.',
    now: ['Vérifier si les pustules brun-rouge couvrent une grande partie des feuilles.'],
    treat: ['Un traitement est rarement rentable : réservé aux attaques précoces et fortes, avec un fongicide homologué.'],
    prevent: ['Semer des variétés tolérantes à la rouille.', 'Éviter les semis tardifs, plus exposés.'],
  },
  earlyBlight: {
    type: 'fungal', severity: 2, cause: 'Champignon (Alternaria solani) : taches brunes en cercles concentriques, d’abord sur les vieilles feuilles.',
    now: ['Retirer les feuilles du bas qui portent des taches.', 'Arroser au pied et éviter de mouiller le feuillage.'],
    treat: ['Pulvérisation à base de cuivre dès les premiers symptômes.', 'Si la maladie progresse : fongicide homologué contre l’alternariose.'],
    prevent: ['Pailler pour éviter les éclaboussures de terre.', 'Rotation de 3 ans sans tomate ni pomme de terre.', 'Fertilisation équilibrée : une plante affaiblie est plus sensible.'],
  },
  lateBlight: {
    type: 'fungal', severity: 3, cause: 'Mildiou (Phytophthora infestans) : maladie très rapide par temps frais et humide, qui peut détruire une parcelle en quelques jours.',
    now: ['Agir aujourd’hui : arracher et détruire les plants très atteints (ne pas les composter).', 'Ne plus arroser le feuillage et aérer la culture.', 'Prévenir les voisins producteurs : la maladie se propage par le vent.'],
    treat: ['Protéger les plants encore sains avec une bouillie bordelaise (cuivre).', 'En cas de forte pression : fongicide anti-mildiou homologué, en respectant les intervalles de traitement.'],
    prevent: ['Planter des semences et plants sains, variétés tolérantes.', 'Espacer les plants et éviter les parcelles humides et ombragées.', 'Détruire les repousses et les tubercules abandonnés.'],
  },
  powderyMildew: {
    type: 'fungal', severity: 1, cause: 'Oïdium : champignon qui forme une poudre blanche, favorisé par l’air sec et les nuits fraîches.',
    now: ['Retirer les feuilles les plus couvertes de poudre blanche.', 'Aérer les plants.'],
    treat: ['Pulvérisation de soufre mouillable (hors fortes chaleurs).', 'Alternative douce : bicarbonate de soude (5 g/L) avec quelques gouttes de savon noir.'],
    prevent: ['Espacer les plants et arroser au pied.', 'Choisir des variétés tolérantes à l’oïdium.'],
  },
  septoria: {
    type: 'fungal', severity: 2, cause: 'Champignon (Septoria lycopersici) : nombreuses petites taches à centre clair, d’abord sur les feuilles du bas.',
    now: ['Retirer les feuilles du bas atteintes et les sortir de la parcelle.', 'Arroser au pied uniquement.'],
    treat: ['Pulvérisation à base de cuivre, à renouveler après les fortes pluies.'],
    prevent: ['Pailler le sol et tuteurer pour éloigner les feuilles du sol.', 'Rotation de 3 ans et élimination des débris de culture.'],
  },
  mosaicVirus: {
    type: 'viral', severity: 3, cause: 'Virus de la mosaïque, transmis par contact (mains, outils) et par les semences. Aucun traitement ne guérit un plant infecté.',
    now: ['Arracher et détruire les plants atteints pour protéger les autres.', 'Se laver les mains et désinfecter les outils après chaque plant.'],
    treat: ['Aucun produit ne soigne un virus : l’objectif est d’éviter la propagation.'],
    prevent: ['Utiliser des semences certifiées et des variétés résistantes.', 'Ne pas fumer ni manipuler de tabac près des plants.', 'Désherber : certaines mauvaises herbes hébergent le virus.'],
  },
  yellowLeafCurl: {
    type: 'viral', severity: 3, cause: 'Virus de l’enroulement jaune (TYLCV), transmis par l’aleurode (mouche blanche). Aucun traitement ne guérit un plant infecté.',
    now: ['Arracher et détruire les plants atteints.', 'Contrôler les mouches blanches sous les feuilles (pièges jaunes englués).'],
    treat: ['Lutter contre l’aleurode : savon noir ou huile de neem, puis insecticide homologué si nécessaire.'],
    prevent: ['Produire les plants sous filet anti-insectes.', 'Choisir des variétés résistantes au TYLCV.', 'Éliminer les mauvaises herbes et les anciennes cultures hôtes.'],
  },
  leafMold: {
    type: 'fungal', severity: 2, cause: 'Cladosporiose (Passalora fulva) : taches jaunes dessus, feutrage vert-brun dessous, favorisée par l’humidité élevée (serre, abri).',
    now: ['Aérer fortement l’abri ou la serre et réduire l’humidité.', 'Retirer les feuilles atteintes.'],
    treat: ['Pulvérisation à base de cuivre ; fongicide homologué si l’attaque est forte.'],
    prevent: ['Espacer les plants et effeuiller le bas.', 'Choisir des variétés résistantes à la cladosporiose.'],
  },
  spiderMites: {
    type: 'pest', severity: 2, cause: 'Acariens (tétranyques) : petites piqûres jaunes et fines toiles sous les feuilles, favorisés par la chaleur sèche.',
    now: ['Pulvériser de l’eau sous les feuilles pour déloger les acariens.', 'Retirer les feuilles très atteintes.'],
    treat: ['Savon noir ou huile de neem sous les feuilles, tous les 5 à 7 jours.', 'Acaricide homologué seulement en cas de forte infestation.'],
    prevent: ['Maintenir une humidité suffisante autour des plants.', 'Favoriser les auxiliaires (acariens prédateurs, coccinelles) en évitant les insecticides à large spectre.'],
  },
  blackRot: {
    type: 'fungal', severity: 2, cause: 'Champignon (Guignardia bidwellii) : taches brunes sur les feuilles, puis baies noires et momifiées.',
    now: ['Retirer les feuilles tachées et les grappes momifiées.', 'Ne laisser aucune baie momifiée sur la vigne ni au sol.'],
    treat: ['Fongicide homologué contre le black-rot, du débourrement jusqu’à la fermeture de la grappe.'],
    prevent: ['Tailler et palisser pour aérer.', 'Détruire les bois et baies malades pendant l’hiver.'],
  },
}

// Classe du modèle → plante et problème.
const CLASSES = {
  'Apple Scab Leaf': ['apple', 'scab'],
  'Apple leaf': ['apple'],
  'Apple rust leaf': ['apple', 'appleRust'],
  'Bell_pepper leaf spot': ['pepper', 'bacterialSpot'],
  'Bell_pepper leaf': ['pepper'],
  'Blueberry leaf': ['berry'],
  'Cherry leaf': ['berry'],
  'Corn Gray leaf spot': ['corn', 'grayLeafSpot'],
  'Corn leaf blight': ['corn', 'cornBlight'],
  'Corn rust leaf': ['corn', 'cornRust'],
  'Peach leaf': ['berry'],
  'Potato leaf early blight': ['potato', 'earlyBlight'],
  'Potato leaf late blight': ['potato', 'lateBlight'],
  'Potato leaf': ['potato'],
  'Raspberry leaf': ['berry'],
  'Soyabean leaf': ['soy'],
  'Squash Powdery mildew leaf': ['squash', 'powderyMildew'],
  'Strawberry leaf': ['berry'],
  'Tomato Early blight leaf': ['tomato', 'earlyBlight'],
  'Tomato Septoria leaf spot': ['tomato', 'septoria'],
  'Tomato leaf bacterial spot': ['tomato', 'bacterialSpot'],
  'Tomato leaf late blight': ['tomato', 'lateBlight'],
  'Tomato leaf mosaic virus': ['tomato', 'mosaicVirus'],
  'Tomato leaf yellow virus': ['tomato', 'yellowLeafCurl'],
  'Tomato leaf': ['tomato'],
  'Tomato mold leaf': ['tomato', 'leafMold'],
  'Tomato two spotted spider mites leaf': ['tomato', 'spiderMites'],
  'grape leaf black rot': ['grape', 'blackRot'],
  'grape leaf': ['grape'],
}

export const TYPE_LABELS = {
  healthy: 'Plante saine', fungal: 'Maladie fongique', bacterial: 'Maladie bactérienne', viral: 'Maladie virale', pest: 'Ravageur', unknown: 'À confirmer',
}
const URGENCY = [
  {level: 'low', label: 'Aucune urgence', text: 'Continuez l’entretien habituel.'},
  {level: 'low', label: 'Urgence faible', text: 'Agir dans la semaine et surveiller l’évolution.'},
  {level: 'medium', label: 'Urgence moyenne', text: 'Agir dans les 2 à 3 jours pour limiter la propagation.'},
  {level: 'high', label: 'Urgence élevée', text: 'Agir aujourd’hui : la maladie peut se propager très vite.'},
]

const profileOf = label => {
  const [plant, disease] = CLASSES[label] || []
  return {plant, disease, info: disease ? DISEASES[disease] : null, known: Boolean(CLASSES[label])}
}

/**
 * Construit les solutions recommandées à partir de toutes les analyses (une par image).
 * @param {Array} results réponses de /api/diagnosis/analyze
 * @param {Function} nameOf traduction française d'une classe
 */
export function buildRecommendations(results, nameOf = x => x) {
  const best = results.reduce((a, b) => (a.prediction.score > b.prediction.score ? a : b))
  const {label, score} = best.prediction
  const confidence = Math.round(score * 100)
  const {plant, disease, info, known} = profileOf(label)
  const affected = results.filter(r => r.prediction.label === label).length
  const total = results.length

  // Aucun signe reconnu ou classe inconnue : on garde les conseils du serveur et on demande de nouvelles photos.
  if (!known || score <= 0) {
    return {
      type: 'unknown', urgency: URGENCY[0], confidence, affected, total, cause: 'Le modèle n’a pas reconnu de problème précis sur ces images.',
      groups: [
        {id: 'now', title: 'À faire maintenant', icon: 'photo_camera', items: ['Reprendre une photo nette d’une seule feuille, en lumière naturelle.', 'Photographier le dessus et le dessous des feuilles qui présentent des taches.']},
        {id: 'care', title: 'Conseils généraux', icon: 'eco', items: best.advice || []},
      ],
      notes: [],
    }
  }

  const type = info ? info.type : 'healthy'
  let severity = info ? info.severity : 0
  if (info && total > 1 && affected === total) severity = Math.min(3, severity + 1) // tous les échantillons atteints : propagation probable
  const unsure = confidence < 50
  if (unsure) severity = Math.min(severity, 2) // simple hypothèse : pas d'urgence maximale

  const notes = []
  if (confidence < 50) notes.push({icon: 'help', text: `Confiance faible (${confidence} %) : ces recommandations sont des hypothèses. Refaites des photos plus nettes avant tout traitement.`})
  else if (confidence < 75) notes.push({icon: 'visibility', text: `Confiance moyenne (${confidence} %) : vérifiez les symptômes décrits ci-dessous sur la plante avant d’agir.`})
  if (total > 1) notes.push({icon: 'photo_library', text: `${nameOf(label)} détecté sur ${affected} échantillon${affected > 1 ? 's' : ''} sur ${total}.${info && affected === total ? ' Tous les échantillons sont touchés : la maladie est probablement installée.' : ''}`})
  const rival = (best.alternatives || []).find(a => a.score >= score * 0.6 && profileOf(a.label).disease !== disease)
  if (rival) notes.push({icon: 'compare_arrows', text: `À distinguer de : ${nameOf(rival.label)} (${Math.round(rival.score * 100)} %). Comparez les symptômes avant de traiter.`})

  const care = CARE[plant] || []
  const groups = info
    ? [
        {id: 'now', title: 'À faire maintenant', icon: 'bolt', items: unsure
          ? ['Isoler ou marquer le plant suspect en attendant la confirmation.', ...info.now.map(x => (/^(Agir aujourd’hui : )?arracher/i.test(x) ? `Si le diagnostic est confirmé : ${x.replace(/^Agir aujourd’hui : /, '').replace(/^A/, 'a')}` : x))]
          : info.now},
        {id: 'treat', title: 'Traitement', icon: 'medication', items: unsure ? ['Attendre une confirmation (nouvelles photos ou avis d’un technicien) avant tout traitement.', ...info.treat] : info.treat, note: info.type === 'viral' ? null : SAFETY},
        {id: 'prevent', title: 'Prévention et bien-être', icon: 'eco', items: [...info.prevent, care[0]].filter(Boolean)},
      ]
    : [
        {id: 'care', title: 'Garder la plante en bonne santé', icon: 'eco', items: care},
        {id: 'watch', title: 'Surveillance', icon: 'visibility', items: ['Inspecter les feuilles (dessus et dessous) une fois par semaine.', 'Refaire un diagnostic dès l’apparition de taches, de jaunissement ou de déformations.']},
      ]

  return {type, urgency: URGENCY[severity], confidence, affected, total, cause: info ? info.cause : 'Aucun symptôme de maladie reconnu sur cette feuille.', groups, notes}
}
