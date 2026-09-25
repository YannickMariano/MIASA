import { useEffect, useState } from 'react'
import { Navbar } from './components/Navbar'
import { Dashboard } from './pages/Dashboard'
import { Learn } from './pages/Learn'
import { Sensors } from './pages/Sensors'
import { PlantLab } from './components/PlantLab'
import { MadagascarMap } from './components/MadagascarMap'
import { api } from './services/api'
import { Diagnosis } from './pages/Diagnosis'
import { Insights } from './pages/Insights'
import { Footer } from './components/Footer'
import { Icon } from './components/Icon'

export default function App(){const[page,setPage]=useState('dashboard');const[data,setData]=useState(null);const[toast,setToast]=useState('');
 useEffect(()=>{let active=true;const refresh=()=>api.dashboard().then(value=>active&&setData(value)).catch(()=>active&&setData(current=>({sensors:current?.sensors||{soilMoisture:42,temperature:26,fertility:78},device:{online:false,lastSeen:null}})));refresh();const timer=setInterval(refresh,5000);return()=>{active=false;clearInterval(timer)}},[])
 let content=page==='dashboard'?<Dashboard data={data} onNavigate={setPage}/>:page==='learn'?<Learn onNavigate={setPage}/>:page==='lab'?<PlantLab full onNavigate={setPage}/>:page==='map'?<MadagascarMap full onNavigate={setPage}/>:page==='insights'?<Insights onNavigate={setPage}/>:page==='diagnosis'?<Diagnosis onNavigate={setPage}/>:<Sensors data={data} onNavigate={setPage}/>
 return <div className={`app-shell page-${page}`}><div className="app-glow" aria-hidden="true"/><Navbar page={page} setPage={setPage}/><main><div className="page" key={page}>{content}</div></main><Footer onNavigate={setPage}/>{toast&&<div className="toast"><Icon name="check_circle" fill/>{toast}</div>}</div>}
