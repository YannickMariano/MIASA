import React from "react";
import { Kicker } from "../PageHeader";

export function MissionSection() {
  return (
    <section className="home-section mission-intro">
      <div className="container two-col">
        <div data-reveal className="story-header">
          <Kicker>NOTRE RAISON D’ÊTRE</Kicker>
          <h2>
            La connaissance agricole au service de la souveraineté alimentaire
          </h2>
        </div>
        <div className="mission-text" data-reveal style={{ "--d": "150ms" }}>
          <p className="highlight-text">
            Madagascar possède des terres et une diversité agricole
            exceptionnels. Pourtant, l’accès aux connaissances techniques et
            outils de mesure reste inégal.
          </p>
          <p>
            <b>Voly est un levier économique important.</b> Notre ambition est
            d’aider à produire davantage et mieux, réduire la dépendance aux
            importations et viser l'autosuffisance alimentaire.
          </p>
          <p>
            <b>Voly, plus qu'une idée :</b> Rapprocher la science et la
            technologie du terrain, tout en maintenant l'employabilité et
            fournissant de l'enseignement compatible avec les besoins réels.
          </p>
        </div>
      </div>
    </section>
  );
}
