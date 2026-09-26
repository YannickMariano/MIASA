import React from "react";
import heroImage from "../../assets/img1.jpg";
import { Icon } from "../Icon";

export function HeroSection({ onNavigate, online, moisture }) {
  return (
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
          <div className="hero-pill story-element" data-reveal>
            <span className="dot" />
            POUR UNE AGRICULTURE INTELLIGENTE ET INNOVANTE
          </div>

          <h1 data-reveal style={{ "--d": "120ms" }}>
            <span>Maîtriser le sujet,</span>
            <br />
            <span className="accent">Mieux produire pour demain.</span>
          </h1>

          <p data-reveal style={{ "--d": "240ms" }}>
            Voly rassemble apprentissage, expérimentation et données de terrain
            pour aider tout acteur agricole à prendre de meilleures décisions,
            augmenter les rendements et apporter sa contribution au
            développement de Madagascar.
          </p>

          <div
            className="hero-actions"
            data-reveal
            style={{ "--d": "360ms" }}
          >
            <button
              className="btn btn-primary btn-lg hover-glow"
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

        <div className="hero-visual" data-reveal style={{ "--d": "200ms" }}>
          <div className="hero-frame parallax-img">
            <img
              src={heroImage}
              alt="Technicienne agronome et producteurs"
            />
            <div className="hero-shade" />
          </div>

          {moisture !== null && (
            <div className="float-card hero-floating floating-anim">
              <span className={`float-icon ${online ? "online" : ""}`}>
                <Icon name={online ? "water_drop" : "wifi_off"} fill />
              </span>
              <div>
                <small>CAPTEUR DE LA PARCELLE</small>
                <b>{online ? `${moisture}% d’humidité` : "Non connecté"}</b>
              </div>
              {online && <i className="live-dot" />}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
