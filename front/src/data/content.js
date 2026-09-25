export const crops = [
  { name: 'Riz irrigué', region: 'Hauts Plateaux', season: 'Nov. — Avril', score: 94, icon: '🌾', color: '#189B67' },
  { name: 'Vanille', region: 'SAVA', season: 'Sept. — Janv.', score: 89, icon: '🌿', color: '#D6A85F' },
  { name: 'Maïs', region: 'Boeny', season: 'Oct. — Mars', score: 82, icon: '🌽', color: '#E7B84C' },
  { name: 'Café arabica', region: 'Haute Matsiatra', season: 'Toute l’année', score: 78, icon: '☕', color: '#97705A' },
]

export const lessons = [
  { tag: 'Sol', title: 'Comprendre la fertilité de votre terre', duration: '8 min', level: 'Débutant', icon: '◌' },
  { tag: 'Eau', title: 'Irriguer mieux, avec moins d’eau', duration: '12 min', level: 'Intermédiaire', icon: '≈' },
  { tag: 'Culture', title: 'Les bases de la rotation culturale', duration: '10 min', level: 'Débutant', icon: '↻' },
]

export const regions = [
  { id: 'sava', label: 'SAVA', crop: 'Vanille', x: 77, y: 16 },
  { id: 'boeny', label: 'Boeny', crop: 'Maïs', x: 38, y: 28 },
  { id: 'analamanga', label: 'Analamanga', crop: 'Riz', x: 51, y: 48 },
  { id: 'matsiatra', label: 'Haute Matsiatra', crop: 'Café', x: 48, y: 65 },
  { id: 'atsimo', label: 'Atsimo-Andrefana', crop: 'Manioc', x: 31, y: 78 },
]
