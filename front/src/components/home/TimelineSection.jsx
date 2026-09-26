import React, { useEffect, useRef, useState } from "react";
import { Icon } from "../Icon";
import { Kicker } from "../PageHeader";
import { sectionImages, steps } from "../../data/homeData";

function Step({ icon, n, title, text, active }) {
  return (
    <article className={`timeline-step ${active ? "active" : ""}`}>
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

export function TimelineSection({ onNavigate }) {
  const ref = useRef(null);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const start = window.innerHeight * 0.75;
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
    <section className="home-section how-section">
      <div className="container how-grid">
        <div>
          <div className="how-sticky" data-reveal>
            <Kicker>COMMENT ÇA FONCTIONNE</Kicker>
            <h2>Une démarche simple, fondée sur l’observation</h2>
            <p>
              La technologie ne remplace pas l’agronome : elle lui apporte des
              informations supplémentaires pour décider avec plus de précision.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => onNavigate("learn")}
            >
              Commencer à apprendre <Icon name="arrow_forward" />
            </button>
            <figure className="how-photo">
              <img src={sectionImages.timeline.src} alt={sectionImages.timeline.alt} loading="lazy" />
            </figure>
          </div>
        </div>

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
              active={pct >= i * 22 + 5}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
