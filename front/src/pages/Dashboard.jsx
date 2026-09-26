import { useEffect, useRef, useState } from "react";
import heroImage from "../assets/img1.jpg";
import { Icon } from "../components/Icon";
import { Kicker } from "../components/PageHeader";
import { useReveal } from "../hooks/useReveal";

const features = [
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
const storyImages = {
  knowledge: {
    src: heroImage,
    position: "14% center",
    alt: "Paysage agricole et rizières de Madagascar",
  },
  coffee: {
    src: heroImage,
    position: "13% 88%",
    alt: "Café cultivé à Madagascar",
  },
  field: {
    src: heroImage,
    position: "58% 68%",
    alt: "Parcelle agricole malgache",
  },
  technician: {
    src: heroImage,
    position: "68% 47%",
    alt: "Technicienne agronome utilisant une tablette",
  },
  sensor: {
    src: heroImage,
    position: "75% 72%",
    alt: "Observation des cultures avec un capteur connecté",
  },
  vanilla: { src: heroImage, position: "98% 45%", alt: "Culture de vanille" },
  farmers: {
    src: heroImage,
    position: "90% 48%",
    alt: "Producteurs agricoles de Madagascar",
  },
};

const steps = [
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

export function Dashboard({ data, onNavigate }) {
  const online = data?.device?.online,
    moisture = Number.isFinite(data?.sensors?.soilMoisture)
      ? data.sensors.soilMoisture
      : null;
  const root = useReveal();
  return (
    <div className="home-page" ref={root}>
      <section className="home-hero">
        <div className="hero-bg" aria-hidden="true">
          <div className="blob one" />
          <div className="blob two" />
          <div className="dot-grid" />
          <div className="particles">
            {[58, 66, 74, 82, 90, 62, 78, 12].map((x, i) => (
              <i
                key={i}
                style={{
                  left: `${x}%`,
                  bottom: `${[12, 20, 8, 24, 14, 30, 36, 18][i]}%`,
                  animationDelay: `${[0, 2, 4, 1, 6, 3, 7, 5][i]}s`,
                  animationDuration: `${9 + (i % 4) * 1.2}s`,
                }}
              />
            ))}
          </div>
        </div>
        <div className="hero-grid">
          <div className="hero-copy">
            <div className="hero-pill" data-reveal>
              <span className="dot" />
              POUR UNE AGRICULTURE INTELLIGENTE ET INNOVANTE
            </div>
            <h1 data-reveal style={{ "--d": "120ms" }}>
              <span>Maîtriser le sujet,</span>
              <span className="accent">Mieux produire pour demain.</span>
            </h1>
            <p data-reveal style={{ "--d": "240ms" }}>
              M'IASA rassemble apprentissage, expérimentation et données de
              terrain pour aider tout acteur agricole à prendre de meilleures
              décisions, augmenter les rendements et apporter sa contribution au
              développement de Madagascar.
            </p>
            <div
              className="hero-actions"
              data-reveal
              style={{ "--d": "360ms" }}
            >
              <button
                className="btn btn-primary btn-lg"
                onClick={() => onNavigate("learn")}
              >
                Découvrir les formations <Icon name="arrow_forward" />
              </button>
              <button
                className="btn btn-glass btn-lg"
                onClick={() => onNavigate("sensors")}
              >
                <Icon name="play_circle" fill className="green" />
                Voir les outils connectés
              </button>
            </div>
            {/* <div className="hero-chips" data-reveal style={{ "--d": "480ms" }}>
              {features.map((f) => (
                <span key={f.id}>
                  <Icon name={f.icon} />
                  {f.title}
                </span>
              ))}
            </div> */}
          </div>
          <div className="hero-visual" data-reveal style={{ "--d": "200ms" }}>
            <div className="hero-frame">
              <img
                src={heroImage}
                alt="Technicienne agronome et producteurs utilisant un capteur dans une exploitation malgache"
              />
              <div className="hero-shade" />
            </div>
            {/* <div className="float-card hero-floating">
              <span className={`float-icon ${online ? "online" : ""}`}>
                <Icon name={online ? "water_drop" : "wifi_off"} fill />
              </span>
              <div>
                <small>CAPTEUR DE LA PARCELLE</small>
                <b>{online ? `${moisture}% d’humidité` : "Non connecté"}</b>
              </div>
              {online && <i className="live-dot" />}
            </div> */}
          </div>
        </div>
      </section>

      <section className="home-section mission-intro">
        <div className="container two-col">
          <div data-reveal>
            <Kicker>NOTRE RAISON D’ETRE</Kicker>
            <h2>
              La connaissance agricole au service de la souveraineté alimentaire
            </h2>
          </div>
          <div className="mission-text" data-reveal style={{ "--d": "150ms" }}>
            <p>
              Madagascar possède des terres et une diversité agricole exceptionnels. 
              Pourtant, l’accès aux connaissances techniques et savoir-faire adéquats et mises à jour, 
              ainsi qu'aux outils de mesure reste inégal.
            </p>
            <p>
              <b>M'IASA est un levier économique important.</b> Notre ambition est d’aider à produire
              davantage et mieux, réduire la dépendance aux importations et viser 
              l'autosuffisance alimentaire  alimentaires au niveau national.
            </p>
            <p>
              <b> M'IASA, plus qu'une idée </b>
              M'IASA rapproche la science et la technologie du terrain. Son impact est aussi social : 
              il permet de maintenir l'employabilité des personnes appartenant au domaine tout en 
              fournissant de l'enseignement et l'innovation compatibles aux besoins réels.
            </p>
          </div>
        </div>
      </section>

      <section className="home-section editorial-story">
        <div className="container story-grid">
          <div className="story-collage" data-reveal>
            <StoryImage item={storyImages.knowledge} label="Territoire" />
            <StoryImage item={storyImages.technician} label="Expertise" />
            <StoryImage item={storyImages.coffee} label="Cultures" />
            <StoryImage item={storyImages.sensor} label="Données" />
          </div>
          <div className="story-copy" data-reveal style={{ "--d": "150ms" }}>
            <Kicker>01 · DE LA CONNAISSANCE AUX RESULTATS</Kicker>
            <h2>
              La théorie rencontre la <em>pratique</em> et la <em>réalité</em>
            </h2>
            <p className="story-overline">OBSERVER · COMPRENDRE · AMELIORER</p>
            <p>
              Plusieurs solutions sont proposées suivant les besoins. Un catalogue de cours expliquent 
              les techniques, le laboratoire permet d’expérimenter, et les capteurs rapprochent la
              décision de la réalité du terrain.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => onNavigate("learn")}
            >
              Explorer <Icon name="arrow_forward" />
            </button>
          </div>
        </div>
      </section>

      <section className="home-section editorial-story tinted">
        <div className="container story-grid reverse">
          <div className="story-copy" data-reveal>
            <Kicker>02 · DU TERRAIN À LA TECHNOLOGIE</Kicker>
            <h2>
              Le savoir-faire rencontre la <em>précision</em>
            </h2>
            <p className="story-overline">
              AGRONOMIE · CAPTEURS · EXPÉRIMENTATION
            </p>
            <p>
              La plateforme valorise l’expérience humaine et l’enrichit avec des outils accessibles. 
              Un technicien peut expliquer, mesurer, comparer puis accompagner chaque producteur 
              vers une pratique adaptée à son choix de culture.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => onNavigate("sensors")}
            >
              Découvrir le capteur d'humidité de sol <Icon name="sensors" />
            </button>
          </div>
          <div className="story-collage" data-reveal style={{ "--d": "150ms" }}>
            <StoryImage item={storyImages.technician} label="Accompagner" />
            <StoryImage item={storyImages.vanilla} label="Valoriser" />
            <StoryImage item={storyImages.farmers} label="Transmettre" />
            <StoryImage item={storyImages.field} label="Produire" />
          </div>
        </div>
      </section>

      <section className="home-section audience-section">
        <div className="section-glow" aria-hidden="true" />
        <div className="container audience-grid">
          <div className="audience-visual" data-reveal>
            <span className="audience-icon">
              <Icon name="groups" />
            </span>
            <h3>
              Une plateforme pensée pour celles et ceux qui font pousser Madagascar
            </h3>
          </div>
          <div className="audience-list">
            <Audience
              number="01"
              icon="school"
              title="Techniciens agronomes"
              text="Centraliser les connaissances, accompagner les producteurs et appuyer les recommandations avec des données de terrain."
              delay={0}
            />
            <Audience
              number="02"
              icon="agriculture"
              title="Agriculteurs et producteurs"
              text="Comprendre leur sol, prévenir les problèmes et choisir les pratiques adaptées à leurs cultures."
              delay={120}
            />
            <Audience
              number="03"
              icon="groups"
              title="Étudiants et passionnés"
              text="Apprendre progressivement, expérimenter et découvrir le potentiel agricole des régions malgaches."
              delay={240}
            />
          </div>
        </div>
      </section>

      <section className="home-section platform-section">
        <div className="container">
          <div className="section-title-row" data-reveal>
            <div>
              <Kicker>UNE PLATEFORME, SIX OUTILS</Kicker>
              <h2>Du savoir à la décision</h2>
            </div>
            <p>
              Chaque module répond à une étape concrète : apprendre, tester,
              observer, diagnostiquer puis décider.
            </p>
          </div>
          <div className="feature-showcase">
            {features.map((f, i) => (
              <div key={f.id} data-reveal style={{ "--d": `${i * 90}ms` }}>
                <button
                  onClick={() => onNavigate(f.id)}
                  className={`feature-card ${i === 0 ? "featured" : ""}`}
                >
                  <span className="feature-visual">
                    <span className="feature-icon">
                      <Icon name={f.icon} />
                    </span>
                    <small>0{i + 1}</small>
                  </span>
                  <span className="feature-body">
                    <h3>{f.title}</h3>
                    <p>{f.text}</p>
                    <b>
                      Explorer <Icon name="arrow_forward" />
                    </b>
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section how-section">
        <div className="container how-grid">
          <div>
            <div className="how-sticky" data-reveal>
              <Kicker>COMMENT ÇA FONCTIONNE</Kicker>
              <h2>Une démarche simple, fondée sur l’observation</h2>
              <p>
                La technologie ne remplace pas l’agronome : elle lui apporte des
                informations supplémentaires pour décider avec plus de
                précision.
              </p>
              <button
                className="btn btn-primary"
                onClick={() => onNavigate("learn")}
              >
                Commencer à apprendre <Icon name="arrow_forward" />
              </button>
            </div>
          </div>
          <Timeline />
        </div>
      </section>

      {/* <section className="home-section impact-section">
        <div className="container">
          <div className="impact-banner" data-reveal>
            <div className="impact-copy">
              <span className="impact-icon">
                <Icon name="trending_up" />
              </span>
              <div>
                <Kicker light>NOTRE VISION</Kicker>
                <h2>
                  Des rendements plus élevés, des ressources mieux utilisées et
                  des producteurs plus autonomes.
                </h2>
              </div>
            </div>
            <button
              className="btn btn-cream btn-lg"
              onClick={() => onNavigate("lab")}
            >
              Tester le laboratoire 3D <Icon name="arrow_forward" />
            </button>
          </div>
        </div>
      </section> */}
    </div>
  );
}

function Timeline() {
  const ref = useRef(null),
    [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect(),
        start = window.innerHeight * 0.75;
      setPct(Math.max(0, Math.min(100, ((start - r.top) / r.height) * 100)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return (
    <div className="steps-flow" ref={ref}>
      <div className="steps-line">
        <i style={{ height: `${pct}%` }} />
      </div>
      {steps.map(([icon, n, title, text], i) => (
        <Step
          key={n}
          icon={icon}
          n={n}
          title={title}
          text={text}
          active={pct >= i * 25 + 5}
        />
      ))}
    </div>
  );
}
function Audience({ number, icon, title, text, delay }) {
  return (
    <article data-reveal style={{ "--d": `${delay}ms` }}>
      <small>{number}</small>
      <span>
        <Icon name={icon} />
      </span>
      <div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </article>
  );
}
function Step({ icon, n, title, text, active }) {
  return (
    <article className={active ? "active" : ""}>
      <span className="step-node">
        <Icon name={icon} />
      </span>
      <div className="step-card">
        <i>0{n}</i>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </article>
  );
}
function StoryImage({ item, label }) {
  return (
    <figure className="story-img">
      <img
        src={item.src}
        style={{ objectPosition: item.position }}
        alt={item.alt}
      />
      <figcaption>
        {label}
        <Icon name="north_east" size={15} />
      </figcaption>
    </figure>
  );
}
