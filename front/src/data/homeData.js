// Photos du site : copies optimisées pour le web (front/public/images) des originaux du dossier public/ du projet.
export const photo = name => `${import.meta.env.BASE_URL}images/${name}`;

export const heroImage = {
  src: photo("12.png"),
  alt: "Coucher de soleil sur les collines et les champs des hautes terres",
};

export const features = [
  {
    id: "learn",
    image: photo("outil-apprentissage.jpg"),
    position: "center 40%",
    icon: "menu_book",
    title: "Bibliothèque agricole",
    text: "Des parcours complets sur le café, la vanille, la tomate, le riz, le maïs et les méthodes de culture.",
  },
  {
    id: "lab",
    image: photo("outil-labo.jpg"),
    position: "center 55%",
    icon: "view_in_ar",
    title: "Laboratoire 3D",
    text: "Expérimenter le cycle du caféier, tester des actions et observer leurs conséquences sans risquer une culture.",
  },
  {
    id: "map",
    image: photo("outil-carte.jpg"),
    position: "center 60%",
    icon: "map",
    title: "Cartographie agricole",
    text: "Explorer les cultures à potentiel selon les régions, le climat et les caractéristiques agricoles locales.",
  },
  {
    id: "insights",
    image: photo("outil-climat.jpg"),
    position: "center 65%",
    icon: "partly_cloudy_day",
    title: "Climat & Marché",
    text: "Explorer le climat local et le marché agricole international",
  },
  {
    id: "sensors",
    image: photo("outil-capteur.jpg"),
    position: "center 40%",
    icon: "sensors",
    title: "Capteur d'humidité",
    text: "Suivre l’humidité réelle du sol et déterminer automatiquement si un arrosage est nécessaire.",
  },
  {
    id: "diagnosis",
    image: photo("outil-diagnostic.jpg"),
    position: "center 88%",
    icon: "troubleshoot",
    title: "Diagnostic par image",
    text: "Analyser les signes visibles d’une maladie végétale à partir de photos ou d’une courte vidéo.",
  },
  {
    id: "market",
    image: photo("outil-publication.jpg"),
    position: "center 62%",
    icon: "storefront",
    title: "Publications de récoltes",
    text: "Consulter les récoltes proposées à la vente avec leur prix, ou publier la sienne avec un simple numéro de téléphone.",
  },
  {
    id: "library",
    image: photo("outil-litterature.jpg"),
    position: "center 45%",
    icon: "local_library",
    title: "Littérature agricole",
    text: "Des ouvrages officiels de référence (FAO, Cirad, FOFIFA…) sur les cultures, les sols et l’agriculture malgache.",
  },
];

// Une photo différente pour chaque vignette des deux chapitres de l'histoire.
// `speed` règle la profondeur de parallax dans les sections narratives
// (0 = fixe, plus la valeur est grande plus l'image se déplace vite).
export const storyImages = {
  territory: { src: photo("1.jpg"), position: "center", alt: "Vue aérienne de parcelles agricoles", speed: 0.06 },
  expertise: { src: photo("4.jpg"), position: "center 40%", alt: "Agricultrice repiquant le riz dans une rizière en eau", speed: 0.04 },
  crops: { src: photo("3.jpg"), position: "center", alt: "Rizières en eau", speed: 0.12 },
  data: { src: photo("10.jpg"), position: "center", alt: "Parcelle labourée observée du ciel", speed: 0.14 },
  support: { src: photo("6.jpg"), position: "center 60%", alt: "Agricultrices plantant à la main", speed: 0.04 },
  value: { src: photo("7.jpg"), position: "center 30%", alt: "Récolte transportée hors du champ", speed: 0.07 },
  transmit: { src: photo("5.jpg"), position: "center 75%", alt: "Labour traditionnel avec des bœufs", speed: 0.1 },
  produce: { src: photo("11.jpg"), position: "center", alt: "Plantation en rangs sur paillage", speed: 0.09 },
};

// Visuels des autres sections de l'accueil.
export const sectionImages = {
  mission: { src: photo("9.jpg"), alt: "Rizières en terrasses" },
  audience: { src: photo("8.jpg"), alt: "Pollinisation manuelle de la fleur de vanille" },
  timeline: { src: photo("2.jpg"), alt: "Champ moissonné sous un ciel de fin de journée" },
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
