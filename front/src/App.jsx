import { Suspense, lazy, useCallback, useEffect, useState } from 'react'
import { Navbar } from './components/Navbar'
import { Dashboard } from './pages/Dashboard'
import { Learn } from './pages/Learn'
import { Sensors } from './pages/Sensors'
import { api } from './services/api'
import { Diagnosis } from './pages/Diagnosis'
import { Insights } from './pages/Insights'
import { Footer } from './components/Footer'
import { Icon } from './components/Icon'

// La 3D (Three.js) et la carte (Leaflet) ne sont chargées qu'à l'ouverture de leur page.
const PlantLab = lazy(() => import('./components/PlantLab').then(m => ({ default: m.PlantLab })))
const MadagascarMap = lazy(() => import('./components/MadagascarMap').then(m => ({ default: m.MadagascarMap })))

function PageLoading(){return <div className="page-loading"><span className="spinner"/><p>Chargement…</p></div>}

export default function App(){const[page,setPage]=useState('dashboard');const[params,setParams]=useState({});const[data,setData]=useState(null);const[toast,setToast]=useState('');
 const navigate=useCallback((id,options={})=>{setParams(options);setPage(id)},[])
 useEffect(()=>{window.scrollTo({top:0,behavior:'instant'})},[page,params])
 useEffect(()=>{let active=true;const refresh=()=>api.dashboard().then(value=>active&&setData(value)).catch(()=>active&&setData(current=>({sensors:current?.sensors||{soilMoisture:42,temperature:26,fertility:78},device:{online:false,lastSeen:null}})));refresh();const timer=setInterval(refresh,5000);return()=>{active=false;clearInterval(timer)}},[])
 let content=page==='dashboard'?<Dashboard data={data} onNavigate={navigate}/>:page==='learn'?<Learn onNavigate={navigate} initialCrop={params.crop}/>:page==='lab'?<PlantLab full onNavigate={navigate} initialCrop={params.crop}/>:page==='map'?<MadagascarMap full onNavigate={navigate}/>:page==='insights'?<Insights onNavigate={navigate} initialPlace={params.place}/>:page==='diagnosis'?<Diagnosis onNavigate={navigate}/>:<Sensors data={data} onNavigate={navigate}/>
 return <div className={`app-shell page-${page}`}><div className="app-glow" aria-hidden="true"/><Navbar page={page} setPage={navigate}/><main><div className="page" key={`${page}-${JSON.stringify(params)}`}><Suspense fallback={<PageLoading/>}>{content}</Suspense></div></main><Footer onNavigate={navigate}/>{toast&&<div className="toast"><Icon name="check_circle" fill/>{toast}</div>}</div>}
