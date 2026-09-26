import { useEffect, useRef, useState } from "react";

/**
 * Suit la position de scroll globale de la page.
 * - scrollY : position brute en pixels
 * - progress : avancement de 0 à 100 sur la hauteur totale de la page
 * Utilisé par la "vine" de progression et par les effets de parallax du hero.
 */
export function usePageProgress() {
  const [state, setState] = useState({ scrollY: 0, progress: 0 });
  const frame = useRef(null);

  useEffect(() => {
    const measure = () => {
      const scrollY = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      setState({ scrollY, progress: Math.min(100, Math.max(0, progress)) });
      frame.current = null;
    };

    const onScroll = () => {
      if (frame.current) return;
      frame.current = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, []);

  return state;
}
