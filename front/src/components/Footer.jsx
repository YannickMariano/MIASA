import { Logo } from "./Logo";

const links = [
  ["dashboard", "Accueil"],
  ["insights", "Climat & marché"],
  ["learn", "Leçons"],
  ["diagnosis", "Diagnostic IA"],
  ["lab", "Laboratoire 3D"],
  ["sensors", "Capteurs"],
  ["map", "Carte"],
];

export function Footer({ onNavigate }) {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <Logo badge={false} />
            <p>
              La technologie au service d’une agriculture plus intelligente.
            </p>
          </div>
          <nav className="footer-links">
            {links.map(([id, label]) => (
              <button key={id} onClick={() => onNavigate(id)}>
                {label}
              </button>
            ))}
          </nav>
        </div>
        <div className="footer-bottom">
          <span>Conçu pour les agriculteurs de Madagascar · M'IASA 2026</span>
          <span className="mono">FR · MG</span>
        </div>
      </div>
    </footer>
  );
}
