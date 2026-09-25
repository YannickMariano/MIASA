import {useCallback,useEffect,useMemo,useRef,useState} from 'react'
import {MapContainer,GeoJSON,CircleMarker,Popup,ZoomControl,useMapEvents} from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import {Icon} from './Icon'
import {PageHeader} from './PageHeader'
import {CROP_FILTERS,HARVEST_MONTHS,IMPORTANCE,LAB_CROPS,LESSON_IDS,MONTHS,PLACE_NAMES,REGION_CROPS,REGION_DETAILS,REGION_LABELS,WEATHER_PLACE,importanceOf} from '../data/regionsCrops'

const GEOJSON_FILE='regions24.geojson'
const cropLabel=Object.fromEntries(CROP_FILTERS.map(([id,label,emoji])=>[id,{label,emoji}]))
const labelOf=name=>REGION_LABELS[name]||name
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))
// Cultures de la région correspondant aux filtres (culture + mois de récolte).
const matching=(name,crop,month)=>(REGION_CROPS[name]||[]).filter(c=>(crop==='all'||c===crop)&&(month===null||HARVEST_MONTHS[c]?.includes(month)))

function regionPopup(name,crop){const crops=REGION_CROPS[name]||[],d=REGION_DETAILS[name]
 const pick=table=>(crop!=='all'&&table[crop]&&crops.includes(crop))?crop:crops.find(c=>table[c])
 const lesson=pick(LESSON_IDS),lab=pick(LAB_CROPS),place=WEATHER_PLACE[name]
 const links=[lesson&&`<button data-page="learn" data-key="crop" data-value="${LESSON_IDS[lesson]}">📘 Guide · ${escape(cropLabel[lesson].label)}</button>`,lab&&`<button data-page="lab" data-key="crop" data-value="${LAB_CROPS[lab]}">🧪 Simuler · ${escape(cropLabel[lab].label)}</button>`,place&&`<button data-page="insights" data-key="place" data-value="${place}">⛅ Météo · ${escape(PLACE_NAMES[place])}</button>`].filter(Boolean).join('')
 return `<div class="crop-popup"><small>RÉGION</small><h3>${escape(labelOf(name))}</h3><p>Principales productions</p><div class="popup-chips">${crops.map((c,i)=>`<span class="lvl-${importanceOf(i)}">${cropLabel[c].emoji} ${escape(cropLabel[c].label)}</span>`).join('')||'<span>Aucune donnée</span>'}</div>${d?`<p>Culture conseillée</p><b>${escape(d.crop)}</b><span>${escape(d.details)}</span><em><i style="width:${d.score}%"></i><strong>Compatibilité ${d.score}%</strong></em>`:''}${links?`<div class="popup-links">${links}</div>`:''}</div>`}

// Relie les boutons des fiches de région à la navigation de l'application.
function PopupLinks({onNavigate}){useMapEvents({popupopen:e=>{e.popup.getElement()?.querySelectorAll('button[data-page]').forEach(b=>{b.onclick=()=>onNavigate?.(b.dataset.page,{[b.dataset.key]:b.dataset.value})})}});return null}

export function MadagascarMap({full=false,onNavigate}){
 const[geo,setGeo]=useState(null),[failed,setFailed]=useState(false),[crop,setCrop]=useState('all'),[month,setMonth]=useState(null),[hovered,setHovered]=useState(null),[selected,setSelected]=useState(null)
 const mapRef=useRef(null),layersRef=useRef({}),selectRef=useRef(null),cropRef=useRef(crop)
 cropRef.current=crop;selectRef.current=setSelected
 useEffect(()=>{let active=true;fetch(`${import.meta.env.BASE_URL}${GEOJSON_FILE}`).then(r=>{if(!r.ok)throw new Error();return r.json()}).then(g=>active&&setGeo(g)).catch(()=>active&&setFailed(true));return()=>{active=false}},[])
 const bounds=useMemo(()=>geo?L.geoJSON(geo).getBounds():null,[geo])
 const regionNames=useMemo(()=>geo?geo.features.map(f=>f.properties.shapeName):[],[geo])
 const inScope=useMemo(()=>new Set(regionNames.filter(n=>matching(n,crop,month).length)),[regionNames,crop,month])
 const counts=useMemo(()=>Object.fromEntries(CROP_FILTERS.map(([id])=>[id,regionNames.filter(n=>matching(n,id,month).length).length])),[regionNames,month])
 const fillOf=useCallback(n=>{if(!inScope.has(n))return'#E4EAE1';if(crop==='all')return month===null?'#8CD8B3':'#189B67';return IMPORTANCE[importanceOf((REGION_CROPS[n]||[]).indexOf(crop))].color},[inScope,crop,month])
 const style=useCallback(feature=>{const n=feature.properties.shapeName,on=inScope.has(n),focus=n===hovered||n===selected;return{color:focus?'#0B3D2A':'#FCFBF5',weight:focus?2.4:1.2,fillColor:fillOf(n),fillOpacity:on?(focus?1:.88):(focus?.95:.7)}},[inScope,hovered,selected,fillOf])
 const focusRegion=useCallback(name=>{setSelected(name);const layer=layersRef.current[name],map=mapRef.current;if(layer&&map){map.closePopup();map.once('moveend',()=>layer.openPopup(layer.getBounds().getCenter()));map.flyToBounds(layer.getBounds(),{padding:[40,40],maxZoom:7.5,duration:.8})}},[])
 const resetView=()=>{setSelected(null);const map=mapRef.current;if(map&&bounds){map.closePopup();map.flyToBounds(bounds,{padding:[16,16],duration:.8})}}
 const onEachFeature=useCallback((feature,layer)=>{const n=feature.properties.shapeName;layersRef.current[n]=layer;layer.bindTooltip(labelOf(n),{sticky:true,direction:'top',className:'region-tip'});layer.bindPopup(()=>regionPopup(n,cropRef.current),{maxWidth:280,autoPanPadding:[24,24]});layer.on({mouseover:()=>setHovered(n),mouseout:()=>setHovered(h=>h===n?null:h),click:()=>selectRef.current(n)})},[])
 const rankOf=n=>crop==='all'?0:(REGION_CROPS[n]||[]).indexOf(crop)
 const list=[...regionNames].sort((a,b)=>(inScope.has(b)-inScope.has(a))||(rankOf(a)-rankOf(b))||labelOf(a).localeCompare(labelOf(b),'fr'))
 const current=crop==='all'?null:cropLabel[crop]
 const scopeLabel=`${current?`${current.emoji} ${current.label}`:'Toutes les cultures'}${month!==null?` · récolte en ${MONTHS[month].toLowerCase()}`:''}`
 return <div className={`map-page ${full?'map-full':''}`}>
  <PageHeader crumb="Carte" kicker="CARTE AGRICOLE RÉELLE" title="Cultures potentielles à Madagascar" text="Choisissez une culture et un mois de récolte pour voir les régions concernées. Survolez ou touchez une région pour afficher ses principales productions." onNavigate={onNavigate} aside={<span className="map-legend"><i/> {current?`Régions productrices · ${current.label}`:'Zone agricole'}</span>}/>
  <div className="pill-tabs map-filters"><button className={crop==='all'?'active':''} onClick={()=>setCrop('all')}>Toutes les cultures <span>{regionNames.filter(n=>matching(n,'all',month).length).length||''}</span></button>{CROP_FILTERS.map(([id,label,emoji])=><button key={id} className={crop===id?'active':''} onClick={()=>setCrop(id)}><em>{emoji}</em>{label} <span>{counts[id]||''}</span></button>)}</div>
  <div className="month-filter"><span className="mono-label"><Icon name="calendar_month"/>RÉCOLTE EN</span><div><button className={month===null?'active':''} onClick={()=>setMonth(null)}>Toute l’année</button>{MONTHS.map((m,i)=><button key={m} className={`${month===i?'active':''} ${crop!=='all'&&HARVEST_MONTHS[crop]?.includes(i)?'harvest':''}`} onClick={()=>setMonth(month===i?null:i)}>{m}</button>)}</div></div>
  <div className="map-layout">
   <section className="real-map-card"><div className="leaflet-wrap">{bounds?<><MapContainer ref={mapRef} bounds={bounds} boundsOptions={{padding:[16,16]}} maxBounds={bounds.pad(.35)} maxBoundsViscosity={.8} minZoom={4.5} maxZoom={10} zoomSnap={.25} zoomControl={false} scrollWheelZoom={full} attributionControl={false}><ZoomControl position="bottomright"/><PopupLinks onNavigate={onNavigate}/><GeoJSON data={geo} style={style} onEachFeature={onEachFeature}/>{Object.values(REGION_DETAILS).map(r=><CircleMarker key={r.name} center={r.pos} radius={full?7:5} pathOptions={{color:'#fff',weight:2.5,fillColor:'#0B3D2A',fillOpacity:1}}><Popup><div className="crop-popup"><small>{r.name}</small><h3>{r.city}</h3><p>Culture conseillée</p><b>{r.crop}</b><span>{r.details}</span><em><i style={{width:`${r.score}%`}}/><strong>Compatibilité {r.score}%</strong></em></div></Popup></CircleMarker>)}</MapContainer><button className="map-reset" onClick={resetView}><Icon name="zoom_out_map"/>Vue d’ensemble</button></>:<div className="map-state">{failed?<><Icon name="error" fill/><b>Impossible de charger les régions</b><span>Vérifiez que le fichier {GEOJSON_FILE} est présent dans le dossier public.</span></>:<><span className="spinner"/><b>Chargement des régions…</b></>}</div>}</div><p className="map-note"><Icon name="info"/>{regionNames.length||'…'} régions (découpage 2023, d’après les districts OCHA / BNGRC). Productions et mois de récolte indicatifs. Les points foncés indiquent les fiches de culture conseillée.</p></section>
   <aside className="region-panel">
    <div className="region-kpis"><div className="kpi-main"><small>{scopeLabel}</small><b>{inScope.size}</b><span>régions {month!==null?'en récolte':'productrices'} sur {regionNames.length||'…'}</span></div>{current&&<div className="importance-legend">{IMPORTANCE.map(l=><span key={l.label}><i style={{background:l.color}}/>{l.label}</span>)}</div>}{current&&month===null&&<div className="harvest-note"><Icon name="event_available"/>Récolte habituelle : {HARVEST_MONTHS[crop].map(i=>MONTHS[i]).join(', ')}</div>}</div>
    <div className="region-list">{list.map(n=>{const on=inScope.has(n),rank=rankOf(n),lvl=crop!=='all'&&on?importanceOf(rank):null;return <button key={n} className={`${on?'on':''} ${n===selected?'selected':''} ${n===hovered?'hover':''}`} onMouseEnter={()=>setHovered(n)} onMouseLeave={()=>setHovered(h=>h===n?null:h)} onClick={()=>focusRegion(n)}><i style={on?{background:fillOf(n)}:undefined}/><span><b>{labelOf(n)}</b><small>{lvl!==null?IMPORTANCE[lvl].label:(REGION_CROPS[n]||[]).map(c=>cropLabel[c].label).join(' · ')||'Aucune donnée'}</small></span>{REGION_DETAILS[n]&&<Icon name="star" fill className="has-detail"/>}</button>})}</div>
   </aside>
  </div>
 </div>}
