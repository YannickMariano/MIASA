import { useEffect, useRef, useState } from "react";

/**
 * Calcule l'avancement de scroll (0 à 1) d'une section par rapport à la
 * fenêtre : proche de 0 quand la section entre dans le viewport, proche de 1
 * quand elle l'a traversée. Sert à la fois à la timeline "Comment ça
 * fonctionne" et à la profondeur de parallax des visuels des sections
 * narratives (StorySection).
 */
export function useSectionProgress({
  startFraction = 0.75,
  endFraction = 0.15,
} = {}) {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);
  const frame = useRef(null);

  useEffect(() => {
    const measure = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * startFraction;
      const end = vh * endFraction - rect.height;
      const raw = (start - rect.top) / (start - end);
      setProgress(Math.min(1, Math.max(0, raw)));
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startFraction, endFraction]);

  return [ref, progress];
}
