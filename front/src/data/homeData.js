import heroImage from "../assets/img1.jpg";

export { heroImage };

export const features = [
  {
    id: "learn",
    icon: "menu_book",
    title: "Bibliothèque agricole",
    text: "Des parcours complets sur le café, la vanille, la tomate, le riz, le maïs et les méthodes de culture.",
  },
  {
    id: "lab",
    icon: "view_in_ar",
    title: "Laboratoire 3D",
    text: "Expérimenter le cycle du caféier, tester des actions et observer leurs conséquences sans risquer une culture.",
  },
  {
    id: "map",
    icon: "map",
    title: "Cartographie agricole",
    text: "Explorer les cultures à potentiel selon les régions, le climat et les caractéristiques agricoles locales.",
  },
  {
    id: "insights",
    icon: "partly_cloudy_day",
    title: "Climat & Marché",
    text: "Explorer le climat local et le marché agricole international",
  },
  {
    id: "sensors",
    icon: "sensors",
    title: "Capteur d'humidité",
    text: "Suivre l’humidité réelle du sol et déterminer automatiquement si un arrosage est nécessaire.",
  },
  {
    id: "diagnosis",
    icon: "troubleshoot",
    title: "Diagnostic par image",
    text: "Analyser les signes visibles d’une maladie végétale à partir de photos ou d’une courte vidéo.",
  },
];

// Images temporaires : remplacez chaque `src` par vos futurs rendus 3D.
// `speed` règle la profondeur de parallax dans les sections narratives
// (0 = fixe, plus la valeur est grande plus l'image se déplace vite).
export const storyImages = {
  knowledge: {
    src: heroImage,
    position: "14% center",
    alt: "Paysage agricole et rizières de Madagascar",
    speed: 0.06,
  },
  coffee: {
    src: heroImage,
    position: "13% 88%",
    alt: "Café cultivé à Madagascar",
    speed: 0.12,
  },
  field: {
    src: heroImage,
    position: "58% 68%",
    alt: "Parcelle agricole malgache",
    speed: 0.09,
  },
  technician: {
    src: heroImage,
    position: "68% 47%",
    alt: "Technicienne agronome utilisant une tablette",
    speed: 0.04,
  },
  sensor: {
    src: heroImage,
    position: "75% 72%",
    alt: "Observation des cultures avec un capteur connecté",
    speed: 0.14,
  },
  vanilla: {
    src: heroImage,
    position: "98% 45%",
    alt: "Culture de vanille",
    speed: 0.07,
  },
  farmers: {
    src: heroImage,
    position: "90% 48%",
    alt: "Producteurs agricoles de Madagascar",
    speed: 0.1,
  },
};

export const steps = [
  ["menu_book", "1", "Apprendre", "Comprendre la culture et ses besoins."],
  [
    "visibility",
    "2",
    "Observer",
    "Collecter les signes et mesures du terrain.",
  ],
  ["analytics", "3", "Analyser", "Comparer les données et simuler les choix."],
  ["task_alt", "4", "Décider", "Appliquer une action adaptée et la suivre."],
];
