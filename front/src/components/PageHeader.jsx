import { Icon } from './Icon'

export function Breadcrumb({ label, onNavigate, light = false }) {
  return <div className={`breadcrumb ${light ? 'light' : ''}`}><button onClick={() => onNavigate?.('dashboard')}>Accueil</button><Icon name="chevron_right" size={16}/><span>{label}</span></div>
}

export function Kicker({ children, light = false, center = false }) {
  return <div className={`kicker ${light ? 'light' : ''} ${center ? 'center' : ''}`}><span className="kicker-line"/>{children}{center && <span className="kicker-line"/>}</div>
}

export function PageHeader({ crumb, kicker, title, text, onNavigate, aside }) {
  return <section className="page-header">
    <Breadcrumb label={crumb} onNavigate={onNavigate}/>
    <div className="page-header-row">
      <div className="page-header-copy">{kicker && <Kicker>{kicker}</Kicker>}<h1>{title}</h1>{text && <p>{text}</p>}</div>
      {aside}
    </div>
  </section>
}
