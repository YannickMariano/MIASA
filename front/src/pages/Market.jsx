import { useCallback, useEffect, useMemo, useState } from 'react'
import { Icon } from '../components/Icon'
import { Kicker, PageHeader } from '../components/PageHeader'
import { Crown } from '../components/Crown'
import { api } from '../services/api'

// Listes de secours si le serveur ne répond pas (identiques à celles du backend).
const FALLBACK = {
  categories: ['Céréales', 'Tubercules', 'Légumineuses', 'Fruits', 'Légumes', 'Cultures de rente', 'Épices', 'Autre'],
  units: ['kg', 'tonne', 'sac', 'daba', 'kapoaka', 'pièce', 'litre'],
  regions: [],
}
const EMPTY = { crop: '', category: '', quantity: '', unit: 'kg', price: '', region: '', phone: '', description: '' }
const MINE_KEY = 'miasa-mes-annonces'

// Jetons de suppression des annonces publiées depuis ce navigateur (seul l'auteur peut retirer son annonce).
const readMine = () => { try { return JSON.parse(localStorage.getItem(MINE_KEY)) || {} } catch { return {} } }
const writeMine = value => { try { localStorage.setItem(MINE_KEY, JSON.stringify(value)) } catch { /* stockage indisponible */ } }

const ariary = n => `${Number(n).toLocaleString('fr-FR')} Ar`
const since = iso => {
  const days = Math.floor((Date.now() - new Date(iso)) / 86400000)
  return days <= 0 ? 'Aujourd’hui' : days === 1 ? 'Hier' : `Il y a ${days} jours`
}

export function Market({ onNavigate }) {
  const [listings, setListings] = useState([]), [options, setOptions] = useState(FALLBACK)
  const [loading, setLoading] = useState(true), [error, setError] = useState('')
  const [form, setForm] = useState(EMPTY), [sending, setSending] = useState(false), [formError, setFormError] = useState(''), [done, setDone] = useState(false)
  const [query, setQuery] = useState(''), [category, setCategory] = useState('Toutes'), [region, setRegion] = useState(''), [sort, setSort] = useState('recent')
  const [mine, setMine] = useState(readMine)

  const load = useCallback(() => {
    setLoading(true)
    Promise.all([api.listings(), api.listingOptions()])
      .then(([items, opts]) => { setListings(items); setOptions(opts); setError('') })
      .catch(() => setError('Le serveur M’IASA ne répond pas. Les annonces s’afficheront dès qu’il sera démarré.'))
      .finally(() => setLoading(false))
  }, [])
  useEffect(load, [load])

  const set = key => e => { setForm(f => ({ ...f, [key]: e.target.value })); setDone(false) }
  const submit = async e => {
    e.preventDefault(); setSending(true); setFormError('')
    try {
      const { deleteToken, ...listing } = await api.publishListing(form)
      const next = { ...mine, [listing.id]: deleteToken }; setMine(next); writeMine(next)
      setListings(list => [listing, ...list]); setForm(EMPTY); setDone(true)
    } catch (err) { setFormError(err.message) } finally { setSending(false) }
  }
  const remove = async id => {
    if (!window.confirm('Retirer cette annonce ?')) return
    try {
      await api.removeListing(id, mine[id])
      setListings(list => list.filter(l => l.id !== id))
      const next = { ...mine }; delete next[id]; setMine(next); writeMine(next)
    } catch (err) { window.alert(err.message) }
  }

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = listings.filter(l => (category === 'Toutes' || l.category === category) && (!region || l.region === region) && (!q || `${l.crop} ${l.description}`.toLowerCase().includes(q)))
    return sort === 'price' ? [...list].sort((a, b) => a.price - b.price) : list
  }, [listings, query, category, region, sort])

  return <div className="market-page">
    <PageHeader crumb="Publications" kicker="MARCHÉ DES RÉCOLTES" title="Récoltes proposées à la vente" text="Les producteurs publient leurs récoltes avec un prix. Pour acheter, contactez directement le vendeur par téléphone : aucun nom n’est affiché, seulement un numéro." onNavigate={onNavigate} aside={<span className="count-pill">{listings.length} annonce{listings.length > 1 ? 's' : ''}</span>}/>

    <div className="market-layout">
      <form className="market-form" onSubmit={submit}>
        <Kicker>PUBLIER UNE RÉCOLTE</Kicker>
        <h2>Proposer ma récolte <span className="premium-badge inline"><Crown size={14}/>Premium</span></h2>
        <p className="market-premium wide"><Crown size={16}/>La publication d’annonces est une fonctionnalité payante. La consultation des annonces reste gratuite pour tous.</p>
        <label className="wide"><span>Produit récolté</span><input value={form.crop} onChange={set('crop')} placeholder="Ex. Riz blanc Makalioka, vanille noire…" maxLength={60} required/></label>
        <label><span>Catégorie</span><select value={form.category} onChange={set('category')} required><option value="">Choisir…</option>{options.categories.map(c => <option key={c}>{c}</option>)}</select></label>
        <label><span>Région</span><select value={form.region} onChange={set('region')} required><option value="">Choisir…</option>{options.regions.map(r => <option key={r}>{r}</option>)}</select></label>
        <label><span>Quantité disponible</span><input type="number" min="0" step="any" inputMode="decimal" value={form.quantity} onChange={set('quantity')} placeholder="500" required/></label>
        <label><span>Unité</span><select value={form.unit} onChange={set('unit')}>{options.units.map(u => <option key={u}>{u}</option>)}</select></label>
        <label className="wide"><span>Prix en Ariary, par {form.unit}</span><input type="number" min="0" step="1" inputMode="numeric" value={form.price} onChange={set('price')} placeholder="2800" required/></label>
        <label className="wide"><span>Numéro de téléphone</span><input type="tel" value={form.phone} onChange={set('phone')} placeholder="034 12 345 67" required/></label>
        <label className="wide"><span>Description (facultatif)</span><textarea value={form.description} onChange={set('description')} rows={3} maxLength={400} placeholder="Qualité, date de récolte, lieu de retrait…"/></label>
        <p className="market-privacy wide"><Icon name="shield_person"/>Aucun nom n’est demandé ni publié : seul votre numéro est visible, pour être contacté.</p>
        {formError && <p className="market-alert error wide"><Icon name="error" fill/>{formError}</p>}
        {done && <p className="market-alert ok wide"><Icon name="check_circle" fill/>Annonce publiée ! Vous pourrez la retirer depuis ce navigateur.</p>}
        <button className="btn btn-sun wide" disabled={sending || !!error}>{sending ? <span className="spinner small"/> : <Icon name="campaign"/>}Publier l’annonce<Crown size={16}/></button>
      </form>

      <section className="market-results">
        <div className="market-filters">
          <label className="search-field"><Icon name="search"/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Rechercher riz, vanille, maïs…"/></label>
          <select value={region} onChange={e => setRegion(e.target.value)} aria-label="Région"><option value="">Toutes les régions</option>{options.regions.map(r => <option key={r}>{r}</option>)}</select>
          <select value={sort} onChange={e => setSort(e.target.value)} aria-label="Trier"><option value="recent">Plus récentes</option><option value="price">Prix croissant</option></select>
        </div>
        <div className="pill-tabs market-cats">{['Toutes', ...options.categories].map(c => <button key={c} className={category === c ? 'active' : ''} onClick={() => setCategory(c)}>{c}</button>)}</div>

        {loading ? <div className="market-state"><span className="spinner"/><b>Chargement des annonces…</b></div>
          : error ? <div className="market-state"><Icon name="cloud_off"/><b>Annonces indisponibles</b><p>{error}</p><button className="btn btn-outline" onClick={load}><Icon name="refresh"/>Réessayer</button></div>
          : !visible.length ? <div className="market-state"><Icon name="storefront"/><b>{listings.length ? 'Aucune annonce ne correspond' : 'Aucune récolte publiée pour le moment'}</b><p>{listings.length ? 'Modifiez les filtres pour voir plus d’annonces.' : 'Soyez le premier à proposer votre récolte avec le formulaire.'}</p></div>
          : <div className="listing-grid">{visible.map(l => <article className="listing-card" key={l.id}>
              <header><span className="listing-cat">{l.category}</span><small>{since(l.createdAt)}</small></header>
              <h3>{l.crop}</h3>
              <p className="listing-price"><b>{ariary(l.price)}</b> / {l.unit}</p>
              <ul>
                <li><Icon name="inventory_2"/>{Number(l.quantity).toLocaleString('fr-FR')} {l.unit} disponibles</li>
                <li><Icon name="location_on"/>{l.region}</li>
              </ul>
              {l.description && <p className="listing-desc">{l.description}</p>}
              <footer>
                <a className="btn btn-primary" href={`tel:${l.phone.replace(/\s/g, '')}`}><Icon name="call"/>{l.phone}</a>
                {mine[l.id] && <button className="btn btn-outline" onClick={() => remove(l.id)}><Icon name="delete"/>Retirer</button>}
              </footer>
            </article>)}</div>}
      </section>
    </div>
  </div>
}
