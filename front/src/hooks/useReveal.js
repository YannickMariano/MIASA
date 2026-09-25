import { useEffect, useRef } from 'react'

// Fait apparaître en douceur les éléments [data-reveal] quand ils entrent à l'écran.
export function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const root = ref.current
    if (!root) return
    const items = root.querySelectorAll('[data-reveal]')
    if (!('IntersectionObserver' in window)) { items.forEach(el => el.classList.add('is-in')); return }
    root.classList.add('reveal-ready')
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-in'); observer.unobserve(entry.target) }
    }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })
    items.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])
  return ref
}
