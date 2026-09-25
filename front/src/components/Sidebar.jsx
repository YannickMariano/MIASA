import { LayoutDashboard, GraduationCap, Sprout, Map, Radio, Settings, HelpCircle, X } from 'lucide-react'
import { Logo } from './Logo'

const items = [
  ['dashboard', LayoutDashboard, 'Tableau de bord'], ['learn', GraduationCap, 'Apprendre'],
  ['lab', Sprout, 'Laboratoire 3D'], ['map', Map, 'Carte des cultures'], ['sensors', Radio, 'Mes capteurs'],
]

export function Sidebar({ page, setPage, open, onClose }) {
  return <aside className={`sidebar ${open ? 'open' : ''}`}>
    <button className="close-menu" onClick={onClose}><X size={20}/></button>
    <Logo />
    <nav>
      <p className="nav-label">ESPACE PRINCIPAL</p>
      {items.map(([id, Icon, label]) => <button key={id} className={page === id ? 'active' : ''} onClick={() => { setPage(id); onClose() }}><Icon size={19}/><span>{label}</span>{id === 'lab' && <b>Nouveau</b>}</button>)}
    </nav>
    <div className="sidebar-bottom">
      <button><Settings size={19}/>Paramètres</button><button><HelpCircle size={19}/>Besoin d’aide ?</button>
      <div className="profile"><span>RA</span><div><strong>Rado Andria</strong><small>Agriculteur</small></div><i>•••</i></div>
    </div>
  </aside>
}
