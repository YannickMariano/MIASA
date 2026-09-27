import { Logo } from "./Logo";

const platformLinks = [
  ["dashboard", "Accueil"],
  ["learn", "Leçons"],
  ["lab", "Laboratoire 3D"],
  ["map", "Carte"],
  ["library", "Littérature"],
];

const smartToolLinks = [
  ["insights", "Climat & marché"],
  ["diagnosis", "Diagnostic IA"],
  ["sensors", "Capteurs connectés"],
  ["market", "Publications"],
];

function FooterLinks({ title, links, onNavigate }) {
  return (
    <nav className="footer-column" aria-label={title}>
      <h3>{title}</h3>
      {links.map(([id, label]) => (
        <button key={id} onClick={() => onNavigate(id)}>
          <span>{label}</span>
          <span aria-hidden="true">→</span>
        </button>
      ))}
    </nav>
  );
}

export function Footer({ onNavigate }) {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <Logo badge={false} />
            <p className="footer-tagline">
              La technologie au service d’une agriculture plus intelligente.
            </p>
            <p className="footer-description">
              Apprendre, observer et décider grâce aux données agricoles
              adaptées aux réalités de Madagascar.
            </p>
            <button
              className="footer-cta"
              onClick={() => onNavigate("learn")}
            >
              Explorer les leçons <span aria-hidden="true">→</span>
            </button>
          </div>
          <FooterLinks
            title="Découvrir"
            links={platformLinks}
            onNavigate={onNavigate}
          />
          <FooterLinks
            title="Outils intelligents"
            links={smartToolLinks}
            onNavigate={onNavigate}
          />
        </div>
        <div className="footer-bottom">
          <span>© 2026 M'IASA · Conçu pour l’agriculture à Madagascar</span>
          <span className="footer-values">Apprendre · Expérimenter · Cultiver</span>
          <span className="mono">FR / MG</span>
        </div>
      </div>
    </footer>
  );
}
