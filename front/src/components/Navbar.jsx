import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { Icon } from "./Icon";
const items = [
  ["dashboard", "home", "Accueil"],
  ["learn", "menu_book", "Apprentissage"],
  ["lab", "view_in_ar", "Laboratoire 3D"],
  ["map", "map", "Cartographie"],
  ["insights", "partly_cloudy_day", "Climat & Marché"],
  ["sensors", "sensors", "Diagnostic par capteur"],
  ["diagnosis", "troubleshoot", "Diagnostic IA"],
];
export function Navbar({ page, setPage }) {
  const [open, setOpen] = useState(false),
    [scrolled, setScrolled] = useState(false);
  const go = (id) => {
    setPage(id);
    setOpen(false);
  };
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={`top-navigation ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-bar">
        <button
          className="nav-logo"
          onClick={() => go("dashboard")}
          aria-label="Accueil"
        >
          <Logo />
        </button>
        <nav className="nav-links">
          {items.map(([id, , label]) => (
            <button
              key={id}
              className={page === id ? "active" : ""}
              onClick={() => go(id)}
            >
              {label}
              {id === "diagnosis" && <i>IA</i>}
            </button>
          ))}
        </nav>
        <div className="nav-end">
          {/* <div className="nav-user">
            <span>RA</span>
            <div>
              <b>Rado Andria</b>
              <small>Agriculteur</small>
            </div>
            <Icon name="expand_more" size={18} />
          </div> */}
          {/* Bouton du menu mobile : indispensable sous 1240 px, où les liens du haut sont masqués. */}
          <button
            className="mobile-nav"
            aria-label="Menu"
            onClick={() => setOpen(!open)}
          >
            <Icon name={open ? "close" : "menu"} />
          </button>
        </div>
      </div>
      {open && (
        <nav className="nav-menu">
          {items.map(([id, icon, label]) => (
            <button
              key={id}
              className={page === id ? "active" : ""}
              onClick={() => go(id)}
            >
              <span>
                <Icon name={icon} />
                {label}
                {id === "diagnosis" && <i>IA</i>}
              </span>
              <Icon name="arrow_forward" className="arrow" />
            </button>
          ))}
          {/* <div className="nav-menu-user">
            <span>RA</span>
            <div>
              <b>Rado Andria</b>
              <small>Agriculteur</small>
            </div>
          </div> */}
        </nav>
      )}
    </header>
  );
}
