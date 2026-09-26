// Données de la carte : INSTAT Madagascar, RGPH 2018 (voir public/data/README.md).
export const DATASET_FILE = 'data/instat-rgph2018-cultures.csv'
export const SOURCE_LABEL = 'INSTAT – RGPH 2018'

// Types de culture du tableau INSTAT (colonne du CSV, libellé, emoji).
export const CROP_TYPES = [
  ['riziculture', 'Riziculture', '🌾'],
  ['autres_cereales', 'Autres céréales', '🌽'],
  ['tubercules', 'Tubercules', '🍠'],
  ['legumineuses', 'Légumineuses', '🫘'],
  ['cultures_industrielles', 'Cultures industrielles', '🏭'],
  ['cultures_rente', 'Cultures de rente', '🌿'],
  ['fruits_legumes', 'Fruits et légumes', '🍅'],
]

// Échelle de couleurs : part des ménages (%) pratiquant la culture choisie.
export const SCALE = [
  { min: 0, max: 20, color: '#E4F2EA' },
  { min: 20, max: 40, color: '#B7E0C8' },
  { min: 40, max: 60, color: '#7CC9A2' },
  { min: 60, max: 80, color: '#2FA673' },
  { min: 80, max: 100, color: '#0F6B47' },
]
export const colorFor = value => (SCALE.find(s => value < s.max) || SCALE.at(-1)).color

// Lecture du CSV : valeurs par région de la carte + valeurs nationales.
export function parseDataset(text) {
  const [header, ...lines] = text.trim().split(/\r?\n/).map(line => line.split(','))
  const col = name => header.indexOf(name)
  const byRegion = {}
  let national = null
  for (const row of lines) {
    const values = Object.fromEntries(CROP_TYPES.map(([id]) => [id, Number(row[col(id)])]))
    const entry = { source: row[col('region')], values, households: Number(row[col('menages_total')]) }
    if (entry.source === 'MADAGASCAR') { national = entry; continue }
    const mapRegions = row[col('regions_carte')].split(';').filter(Boolean)
    for (const name of mapRegions) byRegion[name] = { ...entry, sharedWith: mapRegions.filter(other => other !== name) }
  }
  return { byRegion, national }
}

// Nom d'usage affiché quand il diffère du nom du fichier de la carte.
export const REGION_LABELS = { 'Matsiatra Ambony': 'Haute Matsiatra', 'Sava': 'SAVA' }

// Liens vers les autres pages de l'application selon le type de culture choisi.
export const LESSON_LINKS = {
  riziculture: [['rice', 'Riz']], autres_cereales: [['maize', 'Maïs']], tubercules: [['cassava', 'Manioc']],
  cultures_rente: [['vanilla', 'Vanille'], ['coffee', 'Café']], fruits_legumes: [['tomato', 'Tomate']],
}
export const LAB_LINKS = { riziculture: ['rice', 'Riz'], cultures_rente: ['coffee', 'Café'] }

// Station météo la plus proche parmi celles proposées dans « Climat & marché ».
export const WEATHER_PLACE = {
  'Analamanga': 'antananarivo', 'Itasy': 'antananarivo', 'Vakinankaratra': 'antananarivo', 'Bongolava': 'antananarivo',
  'Sava': 'sambava', 'Diana': 'sambava', 'Ambatosoa': 'sambava',
  'Boeny': 'mahajanga', 'Sofia': 'mahajanga', 'Betsiboka': 'mahajanga', 'Melaky': 'mahajanga',
  'Atsinanana': 'toamasina', 'Analanjirofo': 'toamasina', 'Alaotra-Mangoro': 'toamasina',
  'Matsiatra Ambony': 'fianarantsoa', "Amoron'i Mania": 'fianarantsoa', 'Ihorombe': 'fianarantsoa', 'Vatovavy': 'fianarantsoa', 'Fitovinany': 'fianarantsoa', 'Atsimo-Atsinanana': 'fianarantsoa',
  'Atsimo-Andrefana': 'toliara', 'Menabe': 'toliara', 'Androy': 'toliara', 'Anosy': 'toliara',
}
export const PLACE_NAMES = { antananarivo: 'Antananarivo', sambava: 'Sambava', mahajanga: 'Mahajanga', toamasina: 'Toamasina', fianarantsoa: 'Fianarantsoa', toliara: 'Toliara' }
