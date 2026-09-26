// Petite couronne signalant une fonctionnalité payante (information seulement : la fonctionnalité reste accessible).
export const PREMIUM_PAGES = ['lab', 'sensors', 'diagnosis']

export function Crown({ size = 15, className = '' }) {
  return <svg className={`crown ${className}`} width={size} height={size} viewBox="0 0 24 24" role="img" aria-label="Fonctionnalité payante">
    <title>Fonctionnalité payante</title>
    <path d="M3 8.5l4.6 3.7L12 5l4.4 7.2L21 8.5l-2 10.5H5L3 8.5z" fill="currentColor"/>
    <rect x="5" y="19.6" width="14" height="2.2" rx="1.1" fill="currentColor"/>
  </svg>
}
