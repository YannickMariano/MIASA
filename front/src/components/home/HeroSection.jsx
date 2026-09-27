import React from "react";
import { heroImage } from "../../data/homeData";
import { Icon } from "../Icon";

// Accueil inspiré de la maquette « coucher de soleil » : photo plein écran au ciel orangé.
export function HeroSection({ onNavigate }) {
  return (
    <section className="home-hero">
      <div className="hero-bg" aria-hidden="true">
        <div className="blob one" />
        <div className="blob two" />
      </div>

      <div className="hero-stage">
        <div className="hero-photo" data-reveal>
          <img src={heroImage.src} alt={heroImage.alt} fetchpriority="high" />
          <div className="hero-grade" aria-hidden="true" />
          <div className="hero-copy">
            <div className="hero-pill">
              <span className="dot" />
              POUR UNE AGRICULTURE INTELLIGENTE ET INNOVANTE
            </div>

            <h1>
              <span>Avant de bâtir grand,</span>
              <span className="accent">il faut renforcer l’essentiel.</span>
            </h1>

            <p>
              M'IASA rassemble apprentissage, expérimentation et données de
              terrain pour aider tout acteur agricole à prendre de meilleures
              décisions, augmenter les rendements et apporter sa contribution
              au développement de Madagascar.
            </p>

            <div className="hero-actions">
              <button
                className="btn btn-sun btn-lg"
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
          </div>

        </div>
      </div>
    </section>
  );
}
