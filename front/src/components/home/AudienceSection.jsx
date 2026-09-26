import React from "react";
import { Icon } from "../Icon";
import { sectionImages } from "../../data/homeData";

function AudienceCard({ number, icon, title, text, delay }) {
  return (
    <article
      className="audience-card"
      data-reveal
      style={{ "--d": `${delay}ms` }}
    >
      <small className="audience-num">{number}</small>
      <span className="audience-icon-badge">
        <Icon name={icon} />
      </span>
      <div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </article>
  );
}

export function AudienceSection() {
  return (
    <section className="home-section audience-section" style={{ "--audience-img": `url(${sectionImages.audience.src})` }}>
      <div className="section-glow" aria-hidden="true" />
      <div className="container audience-grid">
        <div className="audience-visual" data-reveal>
          <span className="audience-icon">
            <Icon name="groups" />
          </span>
          <h3>Une plateforme pensée pour celles et ceux qui font pousser Madagascar</h3>
        </div>
        <div className="audience-list">
          <AudienceCard
            number="01"
            icon="school"
            title="Techniciens agronomes"
            text="Centraliser les connaissances, accompagner les producteurs et appuyer les recommandations avec des données."
            delay={0}
          />
          <AudienceCard
            number="02"
            icon="agriculture"
            title="Agriculteurs et producteurs"
            text="Comprendre leur sol, prévenir les problèmes et choisir les pratiques adaptées à leurs cultures."
            delay={120}
          />
          <AudienceCard
            number="03"
            icon="groups"
            title="Étudiants et passionnés"
            text="Apprendre progressivement, expérimenter et découvrir le potentiel agricole des régions."
            delay={240}
          />
        </div>
      </div>
    </section>
  );
}
