import React from "react";
import { Icon } from "../Icon";
import { Kicker } from "../PageHeader";
import { features } from "../../data/homeData";
import { Crown, PREMIUM_PAGES } from "../Crown";

export function FeaturesSection({ onNavigate }) {
  return (
    <section className="home-section platform-section">
      <div className="container">
        <div className="section-title-row" data-reveal>
          <div>
            <Kicker>UNE PLATEFORME, HUIT OUTILS</Kicker>
            <h2>Du savoir à la décision</h2>
          </div>
          <p>
            Chaque module répond à une étape concrète : apprendre, tester,
            observer, diagnostiquer, décider puis vendre.
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
                  {f.image && <img src={f.image} style={{ objectPosition: f.position }} alt="" loading="lazy" />}
                  <span className="feature-icon">
                    <Icon name={f.icon} />
                  </span>
                  <small>0{i + 1}</small>
                  {PREMIUM_PAGES.includes(f.id) && <span className="premium-badge"><Crown size={14} />Premium</span>}
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
  );
}
