import { Bell, Menu, Search } from 'lucide-react'

export function Header({ title, onMenu }) {
  return <header className="topbar">
    <button className="menu-btn" onClick={onMenu}><Menu/></button>
    <div><span className="eyebrow">TANIMBOLY</span><h1>{title}</h1></div>
    <div className="header-actions"><label className="search"><Search size={18}/><input placeholder="Rechercher une culture..."/></label><button className="icon-btn"><Bell size={20}/><i/></button></div>
  </header>
}
