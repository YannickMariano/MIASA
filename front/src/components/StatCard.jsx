import { Icon } from './Icon'

export function StatCard({ icon, label, value, unit, detail, tone = 'green' }) {
  return <article className={`stat-card tone-${tone}`}><div className="stat-top"><span className="stat-label"><span className="stat-icon"><Icon name={icon}/></span>{label}</span><Icon name="north_east" className="stat-arrow"/></div><h3>{value}<small>{unit}</small></h3><span className="stat-detail">{detail}</span></article>
}
