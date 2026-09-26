import {useCallback,useEffect,useMemo,useRef,useState} from 'react'
import {MapContainer,GeoJSON,ZoomControl,useMapEvents} from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import {Icon} from './Icon'
import {PageHeader} from './PageHeader'
import {CROP_TYPES,DATASET_FILE,LAB_LINKS,LESSON_LINKS,PLACE_NAMES,REGION_LABELS,SCALE,SOURCE_LABEL,WEATHER_PLACE,colorFor,parseDataset} from '../data/mapData'

const GEOJSON_FILE='regions24.geojson'
const cropOf=Object.fromEntries(CROP_TYPES.map(([id,label,emoji])=>[id,{label,emoji}]))
const labelOf=name=>REGION_LABELS[name]||name
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))
const pct=v=>`${v.toLocaleString('fr-FR',{minimumFractionDigits:1,maximumFractionDigits:1})} %`
const gap=(v,ref)=>{const d=v-ref;return `${d>=0?'+':'−'}${Math.abs(d).toLocaleString('fr-FR',{maximumFractionDigits:1})} pt`}

// Fiche d'une région : les 7 types de culture comparés à la moyenne nationale (INSTAT – RGPH 2018).
function regionPopup(name,row,national,crop){
 if(!row)return `<div class="crop-popup"><small>RÉGION</small><h3>${escape(labelOf(name))}</h3><span>Aucune donnée INSTAT pour cette région.</span></div>`
 const bars=CROP_TYPES.map(([id,label,emoji])=>{const v=row.values[id],n=national.values[id];return `<div class="popup-bar ${id===crop?'current':''}"><span>${emoji} ${escape(label)}</span><b>${pct(v)}</b><i><em style="width:${v}%"></em><u style="left:${n}%" title="Moyenne nationale ${pct(n)}"></u></i></div>`}).join('')
 // Régions redécoupées après 2018 : valeurs communes avec leur(s) voisine(s).
 const shared=row.sharedWith.length?`<p class="popup-note">Données 2018 de l’ancienne région ${escape(row.source)} (commune avec ${row.sharedWith.map(r=>escape(labelOf(r))).join(', ')}).</p>`:''
 const place=WEATHER_PLACE[name],lessons=LESSON_LINKS[crop]||[],lab=LAB_LINKS[crop]
 const links=[...lessons.map(([id,label])=>`<button data-page="learn" data-key="crop" data-value="${id}">📘 Guide · ${escape(label)}</button>`),lab&&`<button data-page="lab" data-key="crop" data-value="${lab[0]}">🧪 Simuler · ${escape(lab[1])}</button>`,place&&`<button data-page="insights" data-key="place" data-value="${place}">⛅ Météo · ${escape(PLACE_NAMES[place])}</button>`].filter(Boolean).join('')
 return `<div class="crop-popup"><small>RÉGION</small><h3>${escape(labelOf(name))}</h3>${shared}<p>Part des ménages pratiquant chaque culture</p><div class="popup-bars">${bars}</div><p class="popup-legend"><u></u> Moyenne nationale</p><p class="popup-households">${row.households.toLocaleString('fr-FR')} ménages recensés${row.sharedWith.length?` (ancienne région ${escape(row.source)})`:''}</p>${links?`<div class="popup-links">${links}</div>`:''}<p class="popup-source">Source : ${SOURCE_LABEL}</p></div>`}

// Relie les boutons des fiches de région à la navigation de l'application.
function PopupLinks({onNavigate}){useMapEvents({popupopen:e=>{e.popup.getElement()?.querySelectorAll('button[data-page]').forEach(b=>{b.onclick=()=>onNavigate?.(b.dataset.page,{[b.dataset.key]:b.dataset.value})})}});return null}

export function MadagascarMap({full=false,onNavigate}){
 const[geo,setGeo]=useState(null),[dataset,setDataset]=useState(null),[failed,setFailed]=useState(''),[crop,setCrop]=useState('riziculture'),[hovered,setHovered]=useState(null),[selected,setSelected]=useState(null)
 const mapRef=useRef(null),layersRef=useRef({}),selectRef=useRef(null),popupRef=useRef({})
 selectRef.current=setSelected;popupRef.current={dataset,crop}
 useEffect(()=>{let active=true;const base=import.meta.env.BASE_URL
  Promise.all([fetch(`${base}${GEOJSON_FILE}`).then(r=>{if(!r.ok)throw new Error(GEOJSON_FILE);return r.json()}),fetch(`${base}${DATASET_FILE}`).then(r=>{if(!r.ok)throw new Error(DATASET_FILE);return r.text()})])
   .then(([g,csv])=>{if(!active)return;setGeo(g);setDataset(parseDataset(csv))}).catch(error=>active&&setFailed(error.message));return()=>{active=false}},[])
 const bounds=useMemo(()=>geo?L.geoJSON(geo).getBounds():null,[geo])
 const regionNames=useMemo(()=>geo?geo.features.map(f=>f.properties.shapeName):[],[geo])
 const valueOf=useCallback(n=>dataset?.byRegion[n]?.values[crop],[dataset,crop])
 const nationalValue=dataset?.national?.values[crop]
 const style=useCallback(feature=>{const n=feature.properties.shapeName,v=valueOf(n),focus=n===hovered||n===selected;return{color:focus?'#0B3D2A':'#FCFBF5',weight:focus?2.4:1.2,fillColor:Number.isFinite(v)?colorFor(v):'#E4EAE1',fillOpacity:focus?1:.9}},[valueOf,hovered,selected])
 const focusRegion=useCallback(name=>{setSelected(name);const layer=layersRef.current[name],map=mapRef.current;if(layer&&map){map.closePopup();map.once('moveend',()=>layer.openPopup(layer.getBounds().getCenter()));map.flyToBounds(layer.getBounds(),{padding:[40,40],maxZoom:7.5,duration:.8})}},[])
 const resetView=()=>{setSelected(null);const map=mapRef.current;if(map&&bounds){map.closePopup();map.flyToBounds(bounds,{padding:[16,16],duration:.8})}}
 const onEachFeature=useCallback((feature,layer)=>{const n=feature.properties.shapeName;layersRef.current[n]=layer
  layer.bindTooltip(()=>{const {dataset:d,crop:c}=popupRef.current,v=d?.byRegion[n]?.values[c];return `${escape(labelOf(n))}${Number.isFinite(v)?` · ${pct(v)}`:''}`},{sticky:true,direction:'top',className:'region-tip'})
  layer.bindPopup(()=>{const {dataset:d,crop:c}=popupRef.current;return regionPopup(n,d?.byRegion[n],d?.national,c)},{maxWidth:330,minWidth:290,autoPanPadding:[24,24]})
  layer.on({mouseover:()=>setHovered(n),mouseout:()=>setHovered(h=>h===n?null:h),click:()=>selectRef.current(n)})},[])
 const list=[...regionNames].sort((a,b)=>((valueOf(b)??-1)-(valueOf(a)??-1))||labelOf(a).localeCompare(labelOf(b),'fr'))
 const above=regionNames.filter(n=>valueOf(n)>nationalValue).length
 const current=cropOf[crop]
 return <div className={`map-page ${full?'map-full':''}`}>
  <PageHeader crumb="Carte" kicker="CARTE AGRICOLE RÉELLE" title="Cultures pratiquées à Madagascar" text="Choisissez un type de culture pour voir, région par région, la part des ménages qui le pratiquent. Survolez ou touchez une région pour afficher son profil complet." onNavigate={onNavigate} aside={<span className="map-legend"><Icon name="verified" fill/> Source : {SOURCE_LABEL}</span>}/>
  <div className="pill-tabs map-filters">{CROP_TYPES.map(([id,label,emoji])=><button key={id} className={crop===id?'active':''} onClick={()=>setCrop(id)}><em>{emoji}</em>{label}{dataset&&<span>{pct(dataset.national.values[id])}</span>}</button>)}</div>
  <div className="map-layout">
   <section className="real-map-card"><div className="leaflet-wrap">{bounds&&dataset?<><MapContainer ref={mapRef} bounds={bounds} boundsOptions={{padding:[16,16]}} maxBounds={bounds.pad(.35)} maxBoundsViscosity={.8} minZoom={4.5} maxZoom={10} zoomSnap={.25} zoomControl={false} scrollWheelZoom={full} attributionControl={false}><ZoomControl position="bottomright"/><PopupLinks onNavigate={onNavigate}/><GeoJSON data={geo} style={style} onEachFeature={onEachFeature}/></MapContainer><button className="map-reset" onClick={resetView}><Icon name="zoom_out_map"/>Vue d’ensemble</button><div className="scale-legend"><small>{current.emoji} {current.label} · % des ménages</small><div>{SCALE.map(s=><span key={s.min}><i style={{background:s.color}}/>{s.min}–{s.max}</span>)}</div></div></>:<div className="map-state">{failed?<><Icon name="error" fill/><b>Impossible de charger les données de la carte</b><span>Fichier manquant ou illisible dans le dossier public : {failed}</span></>:<><span className="spinner"/><b>Chargement de la carte…</b></>}</div>}</div><p className="map-note"><Icon name="info"/>Source : {SOURCE_LABEL}. Part (%) des ménages de chaque région pratiquant le type de culture choisi ; un ménage peut en pratiquer plusieurs. Vatovavy, Fitovinany et Ambatosoa, créées après 2018, reprennent les valeurs de leur ancienne région.</p></section>
   <aside className="region-panel">
    <div className="region-kpis"><div className="kpi-main"><small>{current.emoji} {current.label} · moyenne nationale</small><b>{Number.isFinite(nationalValue)?pct(nationalValue):'…'}</b><span>{dataset?`${above} régions sur ${regionNames.length} au-dessus de la moyenne`:'Chargement des données…'}</span></div></div>
    <div className="region-list">{list.map(n=>{const v=valueOf(n),has=Number.isFinite(v);return <button key={n} className={`on ${n===selected?'selected':''} ${n===hovered?'hover':''}`} onMouseEnter={()=>setHovered(n)} onMouseLeave={()=>setHovered(h=>h===n?null:h)} onClick={()=>focusRegion(n)}><i style={has?{background:colorFor(v)}:undefined}/><span><b>{labelOf(n)}</b><small>{has?`${gap(v,nationalValue)} par rapport à la moyenne`:'Aucune donnée'}</small></span>{has&&<strong className="region-value">{pct(v)}</strong>}</button>})}</div>
   </aside>
  </div>
 </div>}
