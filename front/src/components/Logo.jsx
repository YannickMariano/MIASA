import { Icon } from './Icon'

export function Logo({ compact = false, badge = true }) {
  return <div className="logo"><span className="logo-mark"><Icon name="eco" fill/></span>{!compact && <span className="logo-name">Voly</span>}{!compact && badge && <span className="logo-badge">MG</span>}</div>
}
