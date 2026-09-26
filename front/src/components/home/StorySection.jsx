import React from "react";
import { Icon } from "../Icon";
import { Kicker } from "../PageHeader";
import { storyImages } from "../../data/homeData";

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

export function StorySection({ onNavigate }) {
  return (
    <>
      {/* Chapitre 1 */}
      <section className="home-section editorial-story story-chapter-1">
        <div className="container story-grid">
          <div className="story-collage" data-reveal>
            <StoryImage item={storyImages.knowledge} label="Territoire" />
            <StoryImage item={storyImages.technician} label="Expertise" />
            <StoryImage item={storyImages.coffee} label="Cultures" />
            <StoryImage item={storyImages.sensor} label="Données" />
          </div>
          <div className="story-copy" data-reveal style={{ "--d": "150ms" }}>
            <Kicker>01 · DE LA CONNAISSANCE AUX RÉSULTATS</Kicker>
            <h2>
              La théorie rencontre la <em>pratique</em> et la <em>réalité</em>
            </h2>
            <p className="story-overline">OBSERVER · COMPRENDRE · AMÉLIORER</p>
            <p>
              Un catalogue de cours explique les techniques, le laboratoire
              permet d’expérimenter, et les capteurs rapprochent la décision de
              la réalité du terrain.
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

      {/* Chapitre 2 */}
      <section className="home-section editorial-story tinted story-chapter-2">
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
              La plateforme valorise l’expérience humaine et l’enrichit avec
              des outils accessibles pour accompagner chaque producteur.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => onNavigate("sensors")}
            >
              Découvrir le capteur d'humidité de sol <Icon name="sensors" />
            </button>
          </div>
          <div
            className="story-collage"
            data-reveal
            style={{ "--d": "150ms" }}
          >
            <StoryImage item={storyImages.technician} label="Accompagner" />
            <StoryImage item={storyImages.vanilla} label="Valoriser" />
            <StoryImage item={storyImages.farmers} label="Transmettre" />
            <StoryImage item={storyImages.field} label="Produire" />
          </div>
        </div>
      </section>
    </>
  );
}
