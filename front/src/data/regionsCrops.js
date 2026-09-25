// Principales productions agricoles par région (données indicatives, à valider avec les sources officielles).
// Les clés correspondent exactement à `shapeName` dans public/regions24.geojson.
export const CROP_FILTERS = [
  ['riz', 'Riz', '🌾'], ['vanille', 'Vanille', '🌿'], ['cafe', 'Café', '☕'], ['girofle', 'Girofle', '🌸'],
  ['litchi', 'Litchi', '🍒'], ['cacao', 'Cacao', '🍫'], ['mais', 'Maïs', '🌽'], ['manioc', 'Manioc', '🍠'],
  ['pomme-de-terre', 'Pomme de terre', '🥔'], ['haricot', 'Haricot', '🫘'], ['arachide', 'Arachide', '🥜'], ['pois-du-cap', 'Pois du Cap', '🫛'],
]

// Cultures classées par ordre d'importance dans la région : la 1re est la production principale.
export const REGION_CROPS = {
  'Diana': ['cacao', 'vanille', 'cafe', 'riz'],
  'Sava': ['vanille', 'girofle', 'cafe', 'riz'],
  'Ambatosoa': ['vanille', 'girofle', 'riz', 'cafe'],
  'Analanjirofo': ['girofle', 'litchi', 'vanille', 'riz', 'cafe'],
  'Sofia': ['riz', 'cafe', 'mais', 'arachide', 'manioc'],
  'Boeny': ['riz', 'mais', 'manioc', 'arachide'],
  'Betsiboka': ['riz', 'mais', 'manioc', 'arachide'],
  'Melaky': ['riz', 'manioc', 'mais'],
  'Alaotra-Mangoro': ['riz', 'manioc', 'mais', 'arachide'],
  'Atsinanana': ['litchi', 'girofle', 'cafe', 'riz', 'manioc'],
  'Analamanga': ['riz', 'mais', 'manioc', 'haricot'],
  'Itasy': ['riz', 'mais', 'haricot', 'pomme-de-terre', 'manioc'],
  'Bongolava': ['riz', 'mais', 'manioc', 'arachide'],
  'Vakinankaratra': ['pomme-de-terre', 'riz', 'mais', 'haricot'],
  "Amoron'i Mania": ['riz', 'mais', 'haricot', 'pomme-de-terre', 'manioc'],
  'Matsiatra Ambony': ['riz', 'cafe', 'mais', 'pomme-de-terre', 'haricot'],
  'Vatovavy': ['cafe', 'litchi', 'girofle', 'riz'],
  'Fitovinany': ['cafe', 'girofle', 'litchi', 'riz', 'manioc'],
  'Atsimo-Atsinanana': ['cafe', 'girofle', 'riz', 'manioc'],
  'Ihorombe': ['manioc', 'riz', 'mais'],
  'Menabe': ['riz', 'mais', 'pois-du-cap', 'arachide', 'manioc'],
  'Atsimo-Andrefana': ['manioc', 'mais', 'pois-du-cap', 'arachide'],
  'Androy': ['manioc', 'mais', 'arachide'],
  'Anosy': ['litchi', 'riz', 'manioc', 'mais'],
}

// Niveau d'importance d'une culture selon son rang dans la région.
export const IMPORTANCE = [
  { label: 'Production principale', color: '#0F6B47' },
  { label: 'Production importante', color: '#189B67' },
  { label: 'Production secondaire', color: '#8CD8B3' },
]
export const importanceOf = rank => rank < 0 ? null : rank === 0 ? 0 : rank <= 2 ? 1 : 2

// Mois de récolte habituels (0 = janvier), à l'échelle nationale. Indicatif.
export const MONTHS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc']
export const HARVEST_MONTHS = {
  'riz': [3, 4, 5], 'vanille': [5, 6, 7, 8], 'cafe': [4, 5, 6, 7], 'girofle': [8, 9, 10, 11],
  'litchi': [10, 11, 0], 'cacao': [3, 4, 5, 9, 10, 11], 'mais': [2, 3, 4], 'manioc': [5, 6, 7, 8],
  'pomme-de-terre': [0, 1, 2, 5, 6], 'haricot': [3, 4, 11], 'arachide': [2, 3, 4], 'pois-du-cap': [5, 6, 7],
}

// Fiches déjà présentes dans l'application (ville, culture conseillée, compatibilité), rattachées à leur région.
export const REGION_DETAILS = {
  'Sava': { name: 'SAVA', city: 'Sambava', pos: [-14.27, 50.17], crop: 'Vanille', score: 95, details: 'Climat chaud et humide' },
  'Boeny': { name: 'Boeny', city: 'Mahajanga', pos: [-15.72, 46.32], crop: 'Maïs · Riz', score: 84, details: 'Plaine alluviale fertile' },
  'Analamanga': { name: 'Analamanga', city: 'Antananarivo', pos: [-18.88, 47.51], crop: 'Riz irrigué', score: 92, details: 'Hauts plateaux rizicoles' },
  'Alaotra-Mangoro': { name: 'Alaotra-Mangoro', city: 'Ambatondrazaka', pos: [-17.83, 48.42], crop: 'Riz', score: 97, details: 'Premier grenier à riz' },
  'Matsiatra Ambony': { name: 'Haute Matsiatra', city: 'Fianarantsoa', pos: [-21.45, 47.09], crop: 'Café Arabica', score: 88, details: 'Altitude et fraîcheur favorables' },
  'Atsimo-Andrefana': { name: 'Atsimo-Andrefana', city: 'Toliara', pos: [-23.35, 43.67], crop: 'Manioc · Pois du Cap', score: 79, details: 'Cultures adaptées au climat sec' },
  'Anosy': { name: 'Anosy', city: 'Tolagnaro', pos: [-25.03, 46.99], crop: 'Litchi · Riz', score: 82, details: 'Climat côtier du Sud-Est' },
}

// Nom d'usage affiché quand il diffère du nom du fichier.
export const REGION_LABELS = { 'Matsiatra Ambony': 'Haute Matsiatra', 'Sava': 'SAVA' }

// Liens vers les autres pages de l'application.
export const LESSON_IDS = { 'cafe': 'coffee', 'vanille': 'vanilla', 'riz': 'rice', 'mais': 'maize', 'manioc': 'cassava' }
export const LAB_CROPS = { 'riz': 'rice', 'cafe': 'coffee' }
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
