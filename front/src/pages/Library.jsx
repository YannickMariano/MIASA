import { useMemo, useState } from 'react'
import { Icon } from '../components/Icon'
import { PageHeader } from '../components/PageHeader'
import { BOOK_THEMES, books, coverUrl } from '../data/libraryBooks'

export function Library({ onNavigate }) {
  const [theme, setTheme] = useState('Toutes'), [query, setQuery] = useState(''), [freeOnly, setFreeOnly] = useState(false)
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return books.filter(b => (theme === 'Toutes' || (theme === 'Madagascar' ? b.mg : b.theme === theme)) && (!freeOnly || b.free) && (!q || `${b.title} ${b.authors} ${b.publisher} ${b.summary}`.toLowerCase().includes(q)))
  }, [theme, query, freeOnly])

  return <div className="library-page">
    <PageHeader crumb="Littérature" kicker="BIBLIOTHÈQUE AGRICOLE" title="Des livres de référence pour cultiver" text="Une sélection d’ouvrages officiellement publiés, avec auteurs et éditeurs reconnus (FAO, CIRAD, Quae…). Chaque lien mène au site officiel de l’éditeur." onNavigate={onNavigate} aside={<label className="search-field"><Icon name="search"/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Rechercher un titre, un auteur…"/></label>}/>

    <div className="library-toolbar">
      <div className="pill-tabs">{BOOK_THEMES.map(t => <button key={t} className={theme === t ? 'active' : ''} onClick={() => setTheme(t)}>{t}</button>)}</div>
      <button className={`free-toggle ${freeOnly ? 'on' : ''}`} onClick={() => setFreeOnly(v => !v)} aria-pressed={freeOnly}><Icon name="lock_open"/>Lecture gratuite uniquement</button>
    </div>

    {visible.length ? <div className="book-grid">{visible.map(b => <article className="book-card" key={b.id}>
      {b.cover ? <img className="book-cover-img" src={coverUrl(b.id)} alt={`Couverture : ${b.title}`} loading="lazy"/> : <div className="book-cover" aria-hidden="true"><span>{b.publisher.split(' ')[0]}</span><b>{b.title}</b><i>{b.year}</i></div>}
      <div className="book-body">
        <div className="book-tags">{b.mg && <span className="mg">Madagascar</span>}<span>{b.theme}</span><span className="lang">{b.lang}</span>{b.free && <span className="free">Accès libre</span>}</div>
        <h3>{b.title}</h3>
        <p className="book-authors">{b.authors}</p>
        <p className="book-summary">{b.summary}</p>
        <dl>
          <div><dt>Éditeur</dt><dd>{b.publisher}</dd></div>
          <div><dt>Année</dt><dd>{b.year}{b.pages ? ` · ${b.pages.toLocaleString('fr-FR')} p.` : ''}</dd></div>
          <div><dt>{b.isbn.startsWith('FAO') ? 'Référence' : 'ISBN'}</dt><dd className="mono">{b.isbn}</dd></div>
        </dl>
        <a className={`btn ${b.free ? 'btn-primary' : 'btn-outline'}`} href={b.url} target="_blank" rel="noreferrer"><Icon name={b.free ? 'auto_stories' : 'open_in_new'}/>{b.free ? 'Lire gratuitement (PDF officiel)' : 'Voir chez l’éditeur'}</a>
      </div>
    </article>)}</div>
      : <div className="market-state"><Icon name="menu_book"/><b>Aucun livre ne correspond</b><p>Essayez un autre thème ou un autre mot-clé.</p></div>}

    <p className="map-note library-note"><Icon name="verified"/>Seuls des ouvrages publiés par des éditeurs reconnus, avec auteurs identifiés et ISBN ou référence officielle, sont proposés. Les livres payants s’achètent chez l’éditeur ; M’IASA n’héberge aucun fichier.</p>
  </div>
}
