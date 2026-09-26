// Littérature : uniquement des ouvrages officiellement publiés (éditeur reconnu, auteurs identifiés, ISBN ou référence éditeur).
// Les liens mènent aux pages officielles des éditeurs ; « free » signale une lecture gratuite autorisée par l'éditeur (FAO, Cirad).
// « cover » : couverture officielle (front/public/images/covers) ; sans couverture, une couverture dessinée est affichée.
// « mg » : ouvrage consacré à Madagascar (onglet « Madagascar »).
export const coverUrl = id => `${import.meta.env.BASE_URL}images/covers/${id}.jpg`
export const BOOK_THEMES = ['Toutes', 'Madagascar', 'Référence générale', 'Riz et céréales', 'Tubercules', 'Cultures de rente', 'Maraîchage', 'Agroécologie']

export const books = [
  {
    id: 'memento', cover: true, title: 'Mémento de l’agronome', authors: 'CIRAD, GRET, Ministère des Affaires étrangères',
    publisher: 'CIRAD-GRET (diffusion Quae)', year: 2002, pages: 1691, isbn: '2-87614-522-7', lang: 'FR', theme: 'Référence générale',
    summary: 'L’ouvrage de référence des agronomes et techniciens de terrain des zones tropicales : milieux, systèmes de culture, fiches par plante cultivée et élevage.',
    url: 'https://agritrop.cirad.fr/511326/', free: false,
  },
  {
    id: 'laulanie', title: 'Le riz à Madagascar : un développement en dialogue avec les paysans', authors: 'Henri de Laulanié',
    publisher: 'Karthala', year: 2003, pages: 288, isbn: '2-84586-415-9', lang: 'FR', theme: 'Riz et céréales',
    summary: 'Les travaux du père de Laulanié sur les rizières malgaches, à l’origine du Système de Riziculture Intensive (SRI).',
    url: 'https://www.karthala.com/accueil/1375-le-riz-a-madagascar-9782845864153.html', free: false, mg: true,
  },
  {
    id: 'fao-cereales', cover: true, title: 'Produire plus avec moins en pratique : le maïs, le riz, le blé', authors: 'T. G. Reeves, G. Thomas, G. Ramsay',
    publisher: 'FAO', year: 2016, pages: null, isbn: 'FAO i4009f', lang: 'FR', theme: 'Riz et céréales',
    summary: 'Guide pour une production céréalière durable : comment les petits producteurs augmentent leurs rendements tout en préservant les sols et l’eau.',
    url: 'https://www.fao.org/4/i4009f/i4009f.pdf', free: true,
  },
  {
    id: 'paliwal', cover: true, title: 'Tropical Maize: Improvement and Production', authors: 'R. L. Paliwal, G. Granados, H. R. Lafitte, A. D. Violic',
    publisher: 'FAO (Plant Production and Protection Series n° 28)', year: 2000, pages: 363, isbn: '92-5-104457-0', lang: 'EN', theme: 'Riz et céréales',
    summary: 'Synthèse de spécialistes du CIMMYT sur l’amélioration et la culture du maïs en zones tropicales.',
    url: 'https://books.google.com/books/about/Tropical_Maize.html?id=x-bwAAAAMAAJ', free: false,
  },
  {
    id: 'fao-manioc', cover: true, title: 'Produire plus avec moins : le manioc', authors: 'FAO',
    publisher: 'FAO', year: 2013, pages: null, isbn: 'FAO i3278f', lang: 'FR', theme: 'Tubercules',
    summary: 'Guide pour une intensification durable de la culture du manioc, tiré d’expériences en Afrique, en Asie et en Amérique latine.',
    url: 'https://www.fao.org/4/i3278f/i3278f.pdf', free: true,
  },
  {
    id: 'vanilla', cover: true, title: 'Vanilla', authors: 'Eric Odoux, Michel Grisoni (dir.)',
    publisher: 'CRC Press (Medicinal and Aromatic Plants – Industrial Profiles)', year: 2010, pages: 411, isbn: '978-1-4200-8337-8', lang: 'EN', theme: 'Cultures de rente',
    summary: 'Biologie du vanillier, préparation et qualité des gousses, production mondiale : 45 experts internationaux, dont Madagascar.',
    url: 'https://www.routledge.com/Vanilla/Odoux-Grisoni/p/book/9781420083378', free: false,
  },
  {
    id: 'coffee', cover: true, title: 'Coffee: Growing, Processing, Sustainable Production', authors: 'Jean Nicolas Wintgens (dir.)',
    publisher: 'Wiley-VCH', year: 2012, pages: 1040, isbn: '978-3-527-33253-3', lang: 'EN', theme: 'Cultures de rente',
    summary: 'Manuel complet du caféier, de la plantation à la transformation, rédigé par 40 auteurs des grands pays producteurs (2e édition).',
    url: 'https://doi.org/10.1002/9783527619627', free: false,
  },
  {
    id: 'tomatoes', cover: true, title: 'Tomatoes (2e édition)', authors: 'Ep Heuvelink (dir.)',
    publisher: 'CABI (Crop Production Science in Horticulture)', year: 2018, pages: null, isbn: '978-1-78064-193-5', lang: 'EN', theme: 'Maraîchage',
    summary: 'Génétique, croissance, irrigation, fertilisation, protection, culture en plein champ et sous serre, et après-récolte de la tomate.',
    url: 'https://doi.org/10.1079/9781780641935.0000', free: false,
  },
  {
    id: 'fao-save-grow', cover: true, title: 'Produire plus avec moins', authors: 'FAO',
    publisher: 'FAO', year: 2011, pages: 112, isbn: 'FAO i2215f', lang: 'FR', theme: 'Agroécologie',
    summary: 'Guide à l’intention des décideurs sur l’intensification durable de l’agriculture paysanne : sols, eau, semences, lutte intégrée.',
    url: 'https://www.fao.org/4/i2215f/i2215f.pdf', free: true,
  },
  {
    id: 'paec', cover: true, title: 'Protection agroécologique des cultures', authors: 'J.-P. Deguine, C. Gloanec, P. Laurent, A. Ratnadass, J.-N. Aubertot (coord.)',
    publisher: 'Éditions Quae', year: 2016, pages: 288, isbn: '978-2-7592-2412-8', lang: 'FR', theme: 'Agroécologie',
    summary: 'Protéger les cultures contre les ravageurs et maladies en s’appuyant sur l’agroécosystème, avec des expériences en milieu tropical.',
    url: 'https://www.quae.com/produit/1333/9782759224128/protection-agroecologique-des-cultures', free: false,
  },
  {
    id: 'deforestation', cover: true, mg: true, title: 'Déforestation et systèmes agraires à Madagascar : les dynamiques des tavy sur la côte orientale', authors: 'Sigrid Aubert, Serge Razafiarison, Alain Bertrand (éd.)',
    publisher: 'Cirad, Cite, FOFIFA (collection Repères)', year: 2003, pages: 220, isbn: '978-2-87614-495-8', lang: 'FR', theme: 'Agroécologie',
    summary: 'Le tavy (culture sur brûlis) de la côte Est : pratiques paysannes, déforestation et pistes pour des systèmes agraires durables. Édité avec le FOFIFA.',
    url: 'https://www.quae.com/produit/259/9782876144958/deforestation-et-systemes-agraires-a-madagascar', free: true,
  },
  {
    id: 'omd-madagascar', mg: true, title: 'Madagascar face au défi des Objectifs du millénaire pour le développement', authors: 'Bénédicte Gastineau, Flore Gubert, Anne-Sophie Robilliard, Jean-Michel Wachsberger (dir.)',
    publisher: 'IRD Éditions', year: 2010, pages: null, isbn: '978-2-7099-1682-0', lang: 'FR', theme: 'Référence générale',
    summary: 'Pauvreté, sécurité alimentaire et développement de l’agriculture malgache, avec un chapitre sur les trappes de pauvreté et l’agriculture durable.',
    url: 'https://books.openedition.org/irdeditions/1907', free: false,
  },
]
