import {StatCard} from '../components/StatCard'
import {Icon} from '../components/Icon'
import {Breadcrumb,Kicker} from '../components/PageHeader'

const RING=490.1

export function Sensors({data,onNavigate}){
 const sensor=data?.sensors||{soilMoisture:null,soilMoistureRaw:null},online=data?.device?.online,moisture=Number.isFinite(sensor.soilMoisture)?sensor.soilMoisture:null,required=online&&moisture<35
 const ringValue=online&&moisture!==null?Math.max(0,Math.min(100,moisture)):0
 return <div className="sensors-page">
  <Breadcrumb label="Capteurs" onNavigate={onNavigate}/>
  <div className="sensor-top">
   <div className={`device-banner ${online?'connected':'disconnected'}`}><div className="device-head"><span className="device-icon"><Icon name={online?'sensors':'sensors_off'}/>{online&&<i className="device-pulse"/>}</span><div><span className="mono-label">CAPTEUR ESP32</span><b><i className="status-dot"/>{online?'Capteur ESP32 connecté':'Capteur ESP32 non branché'}</b></div></div><p>{online?`Les mesures de ${data.device.id} arrivent automatiquement toutes les 30 secondes.`:'Branchez et alimentez l’ESP32. La connexion sera détectée dès la première mesure.'}</p></div>
   <section className={`irrigation-status ${!online?'unknown':required?'required':'not-required'}`}><div className="decision-ring">{online&&<><span className="wave"/><span className="wave late"/></>}<svg viewBox="0 0 180 180" aria-hidden="true"><circle cx="90" cy="90" r="78" className="ring-track"/><circle cx="90" cy="90" r="78" className="ring-value" strokeDasharray={RING} strokeDashoffset={RING*(1-ringValue/100)}/></svg><div className="decision-icon">{!online?<Icon name="wifi_off"/>:<><b>{moisture}<small>%</small></b><Icon name="water_drop" fill/></>}</div></div><div className="decision-copy"><Kicker light>ANALYSE AUTOMATIQUE DE L’HUMIDITÉ</Kicker><h2>{!online?'Branchez le capteur pour obtenir une décision':required?'Le sol doit être arrosé':'Le sol ne nécessite pas d’arrosage'}</h2><p>{!online?'Aucune valeur fictive n’est utilisée. La décision apparaîtra après réception de la première mesure ESP32.':required?`Humidité mesurée : ${moisture} %. Elle est inférieure au seuil configuré de 35 %.`:`Humidité mesurée : ${moisture} %. Elle est suffisante par rapport au seuil de 35 %.`}</p><span className="decision-badge">{!online?'EN ATTENTE':required?'ARROSAGE REQUIS':'SOL CORRECT'}</span></div></section>
  </div>
  <div className="stats-grid sensor-real-grid"><StatCard icon="water_drop" label="Humidité réelle du sol" value={moisture??'--'} unit={moisture===null?'':'%'} detail={online?'Dernière mesure ESP32':'Aucune donnée réelle'}/><StatCard icon="memory" label="Valeur brute ADC" value={online&&Number.isFinite(sensor.soilMoistureRaw)?sensor.soilMoistureRaw:'--'} unit="" detail="Lecture GPIO 34" tone="blue"/><StatCard icon={online?'speed':'wifi_off'} label="Décision d’arrosage" value={!online?'Impossible':required?'Nécessaire':'Non nécessaire'} unit="" detail={!online?'Capteur requis':required?'Sous le seuil de 35%':'Humidité suffisante'} tone={required?'amber':'green'}/></div>
  <section className="chart-card"><div className="section-head"><div><Kicker>MESURES DU CAPTEUR</Kicker><h2>Évolution de l’humidité</h2></div></div>{online?<div className="current-measure"><span className="measure-icon"><Icon name="water_drop" fill/></span><span><small>DERNIÈRE MESURE RÉELLE</small><b>{moisture}%</b></span></div>:<div className="empty-chart"><span><Icon name="wifi_off"/></span><h3>Aucune mesure reçue</h3><p>Le graphique sera alimenté par les données réelles de l’ESP32.</p></div>}</section>
 </div>
}
