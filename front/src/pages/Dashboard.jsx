import {Activity,ArrowRight,BookOpen,BrainCircuit,CheckCircle2,GraduationCap,Map,Radio,Sprout,TrendingUp,Users,Wifi,WifiOff} from 'lucide-react'
import heroImage from '../assets/agriculture-madagascar-hero.png'

const features=[
 {id:'learn',icon:BookOpen,title:'Bibliothèque agricole',text:'Des parcours complets sur le café, la vanille, la tomate, le riz, le maïs et les méthodes de culture.'},
 {id:'lab',icon:Sprout,title:'Laboratoire 3D',text:'Expérimenter le cycle du caféier, tester des actions et observer leurs conséquences sans risquer une culture.'},
 {id:'map',icon:Map,title:'Carte de Madagascar',text:'Explorer les cultures à potentiel selon les régions, le climat et les caractéristiques agricoles locales.'},
 {id:'sensors',icon:Radio,title:'Capteur ESP32',text:'Suivre l’humidité réelle du sol et déterminer automatiquement si un arrosage est nécessaire.'},
 {id:'diagnosis',icon:BrainCircuit,title:'Diagnostic par image',text:'Analyser les signes visibles d’une maladie végétale à partir de photos ou d’une courte vidéo.'},
]

// Images temporaires : remplacez chaque `src` par vos futurs rendus 3D.
const storyImages={
 knowledge:{src:heroImage,position:'14% center',alt:'Paysage agricole et rizières de Madagascar'},
 coffee:{src:heroImage,position:'13% 88%',alt:'Café cultivé à Madagascar'},
 field:{src:heroImage,position:'58% 68%',alt:'Parcelle agricole malgache'},
 technician:{src:heroImage,position:'68% 47%',alt:'Technicienne agronome utilisant une tablette'},
 sensor:{src:heroImage,position:'75% 72%',alt:'Observation des cultures avec un capteur connecté'},
 vanilla:{src:heroImage,position:'98% 45%',alt:'Culture de vanille'},
 farmers:{src:heroImage,position:'90% 48%',alt:'Producteurs agricoles de Madagascar'},
}

export function Dashboard({data,onNavigate}){
 const online=data?.device?.online,moisture=Number.isFinite(data?.sensors?.soilMoisture)?data.sensors.soilMoisture:null
 return <div className="home-page">
  <section className="project-hero"><img src={heroImage} alt="Technicienne agronome et producteurs utilisant un capteur dans une exploitation malgache"/><div className="hero-shade"/><div className="hero-copy"><span className="hero-label"><Sprout size={14}/> AGRICULTURE INTELLIGENTE À MADAGASCAR</span><h1>Comprendre la terre.<br/><em>Mieux produire demain.</em></h1><p>Tanimboly rassemble apprentissage, expérimentation et données de terrain pour aider chaque acteur agricole à prendre de meilleures décisions et augmenter durablement les rendements.</p><div><button onClick={()=>onNavigate('learn')}>Découvrir les formations <ArrowRight/></button><button className="ghost" onClick={()=>onNavigate('sensors')}>Voir les outils connectés</button></div></div><div className="hero-floating"><span className={online?'online':''}>{online?<Wifi/>:<WifiOff/>}</span><div><small>CAPTEUR DE LA PARCELLE</small><b>{online?`${moisture}% d’humidité`:'Non connecté'}</b></div></div></section>

  <section className="mission-intro"><div><span className="kicker">NOTRE RAISON D’ÊTRE</span><h2>La connaissance agricole au service de la souveraineté alimentaire</h2></div><div><p>Madagascar possède des terres, des savoir-faire et une diversité agricole exceptionnels. Pourtant, l’accès aux connaissances techniques, aux outils de mesure et à l’expérimentation reste inégal.</p><p><b>Tanimboly rapproche la science du terrain.</b> Notre ambition est d’aider à produire davantage et mieux, réduire la dépendance aux importations alimentaires et permettre à Madagascar de renforcer sa place parmi les pays producteurs et exportateurs.</p></div></section>

  <section className="editorial-story image-left-story"><div className="story-collage collage-one"><StoryImage item={storyImages.knowledge} className="story-img a" label="Territoire"/><StoryImage item={storyImages.technician} className="story-img b" label="Expertise"/><StoryImage item={storyImages.coffee} className="story-img c" label="Cultures"/><StoryImage item={storyImages.sensor} className="story-img d" label="Données"/></div><div className="story-copy"><span className="story-index">01 — NOTRE APPROCHE</span><h2>De la connaissance<br/>aux <em>résultats</em></h2><p className="story-overline">OBSERVER · COMPRENDRE · AMÉLIORER</p><p>Tanimboly donne aux acteurs agricoles la liberté d’explorer plusieurs solutions avant d’agir. Les cours expliquent les cultures, le laboratoire permet d’expérimenter, et les capteurs rapprochent la décision de la réalité du terrain.</p><button onClick={()=>onNavigate('learn')}>Explorer les connaissances <ArrowRight/></button></div></section>

  <section className="editorial-story text-left-story"><div className="story-copy"><span className="story-index">02 — DU TERRAIN À LA TECHNOLOGIE</span><h2>Le savoir-faire<br/>rencontre la <em>précision</em></h2><p className="story-overline">AGRONOMIE · CAPTEURS · EXPÉRIMENTATION</p><p>La plateforme valorise l’expérience humaine et l’enrichit avec des outils accessibles. Un technicien peut expliquer, mesurer, comparer puis accompagner chaque producteur vers une pratique adaptée à sa parcelle.</p><button onClick={()=>onNavigate('sensors')}>Découvrir le capteur ESP32 <ArrowRight/></button></div><div className="story-collage collage-two"><StoryImage item={storyImages.technician} className="story-img a" label="Accompagner"/><StoryImage item={storyImages.vanilla} className="story-img b" label="Valoriser"/><StoryImage item={storyImages.farmers} className="story-img c" label="Transmettre"/><StoryImage item={storyImages.field} className="story-img d" label="Produire"/></div></section>

  <section className="audience-section"><div className="audience-visual"><div className="field-pattern"/><span><Users/></span><h3>Une plateforme pensée pour celles et ceux qui font pousser Madagascar</h3></div><div className="audience-list"><Audience number="01" icon={GraduationCap} title="Techniciens agronomes" text="Centraliser les connaissances, accompagner les producteurs et appuyer les recommandations avec des données de terrain."/><Audience number="02" icon={Sprout} title="Agriculteurs et producteurs" text="Comprendre leur sol, prévenir les problèmes et choisir les pratiques adaptées à leurs cultures."/><Audience number="03" icon={Users} title="Étudiants et passionnés" text="Apprendre progressivement, expérimenter et découvrir le potentiel agricole des régions malgaches."/></div></section>

  <section className="platform-section"><div className="home-section-title"><div><span className="kicker">UNE PLATEFORME, CINQ OUTILS</span><h2>Du savoir à la décision</h2></div><p>Chaque module répond à une étape concrète : apprendre, tester, observer, diagnostiquer puis décider.</p></div><div className="feature-showcase">{features.map((f,i)=><button key={f.id} onClick={()=>onNavigate(f.id)} className={i===0?'featured':''}><span><f.icon/></span><small>0{i+1}</small><h3>{f.title}</h3><p>{f.text}</p><b>Explorer <ArrowRight/></b></button>)}</div></section>

  <section className="how-section"><div><span className="kicker">COMMENT ÇA FONCTIONNE</span><h2>Une démarche simple, fondée sur l’observation</h2><p>La technologie ne remplace pas l’agronome : elle lui apporte des informations supplémentaires pour décider avec plus de précision.</p><button onClick={()=>onNavigate('learn')}>Commencer à apprendre <ArrowRight/></button></div><div className="steps-flow"><Step icon={BookOpen} n="1" title="Apprendre" text="Comprendre la culture et ses besoins."/><Step icon={Activity} n="2" title="Observer" text="Collecter les signes et mesures du terrain."/><Step icon={BrainCircuit} n="3" title="Analyser" text="Comparer les données et simuler les choix."/><Step icon={CheckCircle2} n="4" title="Décider" text="Appliquer une action adaptée et la suivre."/></div></section>

  <section className="impact-banner"><div><TrendingUp/><span><small>NOTRE VISION</small><h2>Des rendements plus élevés, des ressources mieux utilisées et des producteurs plus autonomes.</h2></span></div><button onClick={()=>onNavigate('lab')}>Tester le laboratoire 3D <ArrowRight/></button></section>
 </div>
}

function Audience({number,icon:Icon,title,text}){return <article><small>{number}</small><span><Icon/></span><div><h3>{title}</h3><p>{text}</p></div></article>}
function Step({icon:Icon,n,title,text}){return <article><i>{n}</i><span><Icon/></span><h3>{title}</h3><p>{text}</p></article>}
function StoryImage({item,className,label}){return <figure className={className}><img src={item.src} style={{objectPosition:item.position}} alt={item.alt}/><figcaption>{label}<span>↗</span></figcaption></figure>}
