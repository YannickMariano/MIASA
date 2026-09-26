import { useEffect, useState } from "react";

/**
 * Renvoie `true` si l'utilisateur a activé "Réduire les animations"
 * dans les préférences système. Toutes les animations scroll-linked
 * (vine, parallax) doivent respecter ce réglage.
 */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const handleChange = (event) => setReduced(event.matches);
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  return reduced;
}
