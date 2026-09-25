import { ArrowUpRight } from 'lucide-react'

export function StatCard({ icon: Icon, label, value, unit, detail, tone = 'green' }) {
  return <article className="glass stat-card"><div className={`stat-icon ${tone}`}><Icon size={22}/></div><div><p>{label}</p><h3>{value}<small>{unit}</small></h3><span>{detail}</span></div><ArrowUpRight className="stat-arrow" size={17}/></article>
}
